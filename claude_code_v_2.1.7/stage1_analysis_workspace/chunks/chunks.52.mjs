
// @from(Ln 138386, Col 4)
Eo1 = U((R28) => {
  var SMA = NA("buffer"),
    Ho1 = mW(),
    O28 = MMA(),
    M28 = {
      identify: (A) => A instanceof Uint8Array,
      default: !1,
      tag: "tag:yaml.org,2002:binary",
      resolve(A, Q) {
        if (typeof SMA.Buffer === "function") return SMA.Buffer.from(A, "base64");
        else if (typeof atob === "function") {
          let B = atob(A.replace(/[\n\r]/g, "")),
            G = new Uint8Array(B.length);
          for (let Z = 0; Z < B.length; ++Z) G[Z] = B.charCodeAt(Z);
          return G
        } else return Q("This environment does not support reading binary tags; either Buffer or atob is required"), A
      },
      stringify({
        comment: A,
        type: Q,
        value: B
      }, G, Z, Y) {
        if (!B) return "";
        let J = B,
          X;
        if (typeof SMA.Buffer === "function") X = J instanceof SMA.Buffer ? J.toString("base64") : SMA.Buffer.from(J.buffer).toString("base64");
        else if (typeof btoa === "function") {
          let I = "";
          for (let D = 0; D < J.length; ++D) I += String.fromCharCode(J[D]);
          X = btoa(I)
        } else throw Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        if (Q ?? (Q = Ho1.Scalar.BLOCK_LITERAL), Q !== Ho1.Scalar.QUOTE_DOUBLE) {
          let I = Math.max(G.options.lineWidth - G.indent.length, G.options.minContentWidth),
            D = Math.ceil(X.length / I),
            W = Array(D);
          for (let K = 0, V = 0; K < D; ++K, V += I) W[K] = X.substr(V, I);
          X = W.join(Q === Ho1.Scalar.BLOCK_LITERAL ? `
` : " ")
        }
        return O28.stringifyString({
          comment: A,
          type: Q,
          value: X
        }, G, Z, Y)
      }
    };
  R28.binary = M28
})
// @from(Ln 138434, Col 4)
t11 = U((S28) => {
  var s11 = G7(),
    zo1 = Ga(),
    j28 = mW(),
    T28 = Ja();

  function DVB(A, Q) {
    if (s11.isSeq(A))
      for (let B = 0; B < A.items.length; ++B) {
        let G = A.items[B];
        if (s11.isPair(G)) continue;
        else if (s11.isMap(G)) {
          if (G.items.length > 1) Q("Each pair must have its own sequence indicator");
          let Z = G.items[0] || new zo1.Pair(new j28.Scalar(null));
          if (G.commentBefore) Z.key.commentBefore = Z.key.commentBefore ? `${G.commentBefore}
${Z.key.commentBefore}` : G.commentBefore;
          if (G.comment) {
            let Y = Z.value ?? Z.key;
            Y.comment = Y.comment ? `${G.comment}
${Y.comment}` : G.comment
          }
          G = Z
        }
        A.items[B] = s11.isPair(G) ? G : new zo1.Pair(G)
      } else Q("Expected a sequence for this tag");
    return A
  }

  function WVB(A, Q, B) {
    let {
      replacer: G
    } = B, Z = new T28.YAMLSeq(A);
    Z.tag = "tag:yaml.org,2002:pairs";
    let Y = 0;
    if (Q && Symbol.iterator in Object(Q))
      for (let J of Q) {
        if (typeof G === "function") J = G.call(Q, String(Y++), J);
        let X, I;
        if (Array.isArray(J))
          if (J.length === 2) X = J[0], I = J[1];
          else throw TypeError(`Expected [key, value] tuple: ${J}`);
        else if (J && J instanceof Object) {
          let D = Object.keys(J);
          if (D.length === 1) X = D[0], I = J[X];
          else throw TypeError(`Expected tuple with one key, not ${D.length} keys`)
        } else X = J;
        Z.items.push(zo1.createPair(X, I, B))
      }
    return Z
  }
  var P28 = {
    collection: "seq",
    default: !1,
    tag: "tag:yaml.org,2002:pairs",
    resolve: DVB,
    createNode: WVB
  };
  S28.createPairs = WVB;
  S28.pairs = P28;
  S28.resolvePairs = DVB
})
// @from(Ln 138495, Col 4)
Co1 = U((f28) => {
  var KVB = G7(),
    $o1 = Aa(),
    xMA = Ya(),
    k28 = Ja(),
    VVB = t11();
  class aQA extends k28.YAMLSeq {
    constructor() {
      super();
      this.add = xMA.YAMLMap.prototype.add.bind(this), this.delete = xMA.YAMLMap.prototype.delete.bind(this), this.get = xMA.YAMLMap.prototype.get.bind(this), this.has = xMA.YAMLMap.prototype.has.bind(this), this.set = xMA.YAMLMap.prototype.set.bind(this), this.tag = aQA.tag
    }
    toJSON(A, Q) {
      if (!Q) return super.toJSON(A);
      let B = new Map;
      if (Q?.onCreate) Q.onCreate(B);
      for (let G of this.items) {
        let Z, Y;
        if (KVB.isPair(G)) Z = $o1.toJS(G.key, "", Q), Y = $o1.toJS(G.value, Z, Q);
        else Z = $o1.toJS(G, "", Q);
        if (B.has(Z)) throw Error("Ordered maps must not include duplicate keys");
        B.set(Z, Y)
      }
      return B
    }
    static from(A, Q, B) {
      let G = VVB.createPairs(A, Q, B),
        Z = new this;
      return Z.items = G.items, Z
    }
  }
  aQA.tag = "tag:yaml.org,2002:omap";
  var b28 = {
    collection: "seq",
    identify: (A) => A instanceof Map,
    nodeClass: aQA,
    default: !1,
    tag: "tag:yaml.org,2002:omap",
    resolve(A, Q) {
      let B = VVB.resolvePairs(A, Q),
        G = [];
      for (let {
          key: Z
        }
        of B.items)
        if (KVB.isScalar(Z))
          if (G.includes(Z.value)) Q(`Ordered maps must not include duplicate keys: ${Z.value}`);
          else G.push(Z.value);
      return Object.assign(new aQA, B)
    },
    createNode: (A, Q, B) => aQA.from(A, Q, B)
  };
  f28.YAMLOMap = aQA;
  f28.omap = b28
})
// @from(Ln 138549, Col 4)
$VB = U((u28) => {
  var FVB = mW();

  function HVB({
    value: A,
    source: Q
  }, B) {
    if (Q && (A ? EVB : zVB).test.test(Q)) return Q;
    return A ? B.options.trueStr : B.options.falseStr
  }
  var EVB = {
      identify: (A) => A === !0,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new FVB.Scalar(!0),
      stringify: HVB
    },
    zVB = {
      identify: (A) => A === !1,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new FVB.Scalar(!1),
      stringify: HVB
    };
  u28.falseTag = zVB;
  u28.trueTag = EVB
})
// @from(Ln 138578, Col 4)
CVB = U((n28) => {
  var c28 = mW(),
    Uo1 = yXA(),
    p28 = {
      identify: (A) => typeof A === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (A) => A.slice(-3).toLowerCase() === "nan" ? NaN : A[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: Uo1.stringifyNumber
    },
    l28 = {
      identify: (A) => typeof A === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (A) => parseFloat(A.replace(/_/g, "")),
      stringify(A) {
        let Q = Number(A.value);
        return isFinite(Q) ? Q.toExponential() : Uo1.stringifyNumber(A)
      }
    },
    i28 = {
      identify: (A) => typeof A === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(A) {
        let Q = new c28.Scalar(parseFloat(A.replace(/_/g, ""))),
          B = A.indexOf(".");
        if (B !== -1) {
          let G = A.substring(B + 1).replace(/_/g, "");
          if (G[G.length - 1] === "0") Q.minFractionDigits = G.length
        }
        return Q
      },
      stringify: Uo1.stringifyNumber
    };
  n28.float = i28;
  n28.floatExp = l28;
  n28.floatNaN = p28
})
// @from(Ln 138621, Col 4)
qVB = U((Q98) => {
  var UVB = yXA(),
    yMA = (A) => typeof A === "bigint" || Number.isInteger(A);

  function e11(A, Q, B, {
    intAsBigInt: G
  }) {
    let Z = A[0];
    if (Z === "-" || Z === "+") Q += 1;
    if (A = A.substring(Q).replace(/_/g, ""), G) {
      switch (B) {
        case 2:
          A = `0b${A}`;
          break;
        case 8:
          A = `0o${A}`;
          break;
        case 16:
          A = `0x${A}`;
          break
      }
      let J = BigInt(A);
      return Z === "-" ? BigInt(-1) * J : J
    }
    let Y = parseInt(A, B);
    return Z === "-" ? -1 * Y : Y
  }

  function qo1(A, Q, B) {
    let {
      value: G
    } = A;
    if (yMA(G)) {
      let Z = G.toString(Q);
      return G < 0 ? "-" + B + Z.substr(1) : B + Z
    }
    return UVB.stringifyNumber(A)
  }
  var s28 = {
      identify: yMA,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (A, Q, B) => e11(A, 2, 2, B),
      stringify: (A) => qo1(A, 2, "0b")
    },
    t28 = {
      identify: yMA,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (A, Q, B) => e11(A, 1, 8, B),
      stringify: (A) => qo1(A, 8, "0")
    },
    e28 = {
      identify: yMA,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (A, Q, B) => e11(A, 0, 10, B),
      stringify: UVB.stringifyNumber
    },
    A98 = {
      identify: yMA,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (A, Q, B) => e11(A, 2, 16, B),
      stringify: (A) => qo1(A, 16, "0x")
    };
  Q98.int = e28;
  Q98.intBin = s28;
  Q98.intHex = A98;
  Q98.intOct = t28
})
// @from(Ln 138699, Col 4)
No1 = U((X98) => {
  var B01 = G7(),
    A01 = Ga(),
    Q01 = Ya();
  class oQA extends Q01.YAMLMap {
    constructor(A) {
      super(A);
      this.tag = oQA.tag
    }
    add(A) {
      let Q;
      if (B01.isPair(A)) Q = A;
      else if (A && typeof A === "object" && "key" in A && "value" in A && A.value === null) Q = new A01.Pair(A.key, null);
      else Q = new A01.Pair(A, null);
      if (!Q01.findPair(this.items, Q.key)) this.items.push(Q)
    }
    get(A, Q) {
      let B = Q01.findPair(this.items, A);
      return !Q && B01.isPair(B) ? B01.isScalar(B.key) ? B.key.value : B.key : B
    }
    set(A, Q) {
      if (typeof Q !== "boolean") throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof Q}`);
      let B = Q01.findPair(this.items, A);
      if (B && !Q) this.items.splice(this.items.indexOf(B), 1);
      else if (!B && Q) this.items.push(new A01.Pair(A))
    }
    toJSON(A, Q) {
      return super.toJSON(A, Q, Set)
    }
    toString(A, Q, B) {
      if (!A) return JSON.stringify(this);
      if (this.hasAllNullValues(!0)) return super.toString(Object.assign({}, A, {
        allNullValues: !0
      }), Q, B);
      else throw Error("Set items must all have null values")
    }
    static from(A, Q, B) {
      let {
        replacer: G
      } = B, Z = new this(A);
      if (Q && Symbol.iterator in Object(Q))
        for (let Y of Q) {
          if (typeof G === "function") Y = G.call(Q, Y, Y);
          Z.items.push(A01.createPair(Y, null, B))
        }
      return Z
    }
  }
  oQA.tag = "tag:yaml.org,2002:set";
  var J98 = {
    collection: "map",
    identify: (A) => A instanceof Set,
    nodeClass: oQA,
    default: !1,
    tag: "tag:yaml.org,2002:set",
    createNode: (A, Q, B) => oQA.from(A, Q, B),
    resolve(A, Q) {
      if (B01.isMap(A))
        if (A.hasAllNullValues(!0)) return Object.assign(new oQA, A);
        else Q("Set items must all have null values");
      else Q("Expected a mapping for this tag");
      return A
    }
  };
  X98.YAMLSet = oQA;
  X98.set = J98
})
// @from(Ln 138766, Col 4)
Lo1 = U((F98) => {
  var W98 = yXA();

  function wo1(A, Q) {
    let B = A[0],
      G = B === "-" || B === "+" ? A.substring(1) : A,
      Z = (J) => Q ? BigInt(J) : Number(J),
      Y = G.replace(/_/g, "").split(":").reduce((J, X) => J * Z(60) + Z(X), Z(0));
    return B === "-" ? Z(-1) * Y : Y
  }

  function NVB(A) {
    let {
      value: Q
    } = A, B = (J) => J;
    if (typeof Q === "bigint") B = (J) => BigInt(J);
    else if (isNaN(Q) || !isFinite(Q)) return W98.stringifyNumber(A);
    let G = "";
    if (Q < 0) G = "-", Q *= B(-1);
    let Z = B(60),
      Y = [Q % Z];
    if (Q < 60) Y.unshift(0);
    else if (Q = (Q - Y[0]) / Z, Y.unshift(Q % Z), Q >= 60) Q = (Q - Y[0]) / Z, Y.unshift(Q);
    return G + Y.map((J) => String(J).padStart(2, "0")).join(":").replace(/000000\d*$/, "")
  }
  var K98 = {
      identify: (A) => typeof A === "bigint" || Number.isInteger(A),
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (A, Q, {
        intAsBigInt: B
      }) => wo1(A, B),
      stringify: NVB
    },
    V98 = {
      identify: (A) => typeof A === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (A) => wo1(A, !1),
      stringify: NVB
    },
    wVB = {
      identify: (A) => A instanceof Date,
      default: !0,
      tag: "tag:yaml.org,2002:timestamp",
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(A) {
        let Q = A.match(wVB.test);
        if (!Q) throw Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        let [, B, G, Z, Y, J, X] = Q.map(Number), I = Q[7] ? Number((Q[7] + "00").substr(1, 3)) : 0, D = Date.UTC(B, G - 1, Z, Y || 0, J || 0, X || 0, I), W = Q[8];
        if (W && W !== "Z") {
          let K = wo1(W, !1);
          if (Math.abs(K) < 30) K *= 60;
          D -= 60000 * K
        }
        return new Date(D)
      },
      stringify: ({
        value: A
      }) => A?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
  F98.floatTime = V98;
  F98.intTime = K98;
  F98.timestamp = wVB
})
// @from(Ln 138835, Col 4)
OVB = U((_98) => {
  var $98 = SXA(),
    C98 = a11(),
    U98 = xXA(),
    q98 = PMA(),
    N98 = Eo1(),
    LVB = $VB(),
    Oo1 = CVB(),
    G01 = qVB(),
    w98 = u11(),
    L98 = Co1(),
    O98 = t11(),
    M98 = No1(),
    Mo1 = Lo1(),
    R98 = [$98.map, U98.seq, q98.string, C98.nullTag, LVB.trueTag, LVB.falseTag, G01.intBin, G01.intOct, G01.int, G01.intHex, Oo1.floatNaN, Oo1.floatExp, Oo1.float, N98.binary, w98.merge, L98.omap, O98.pairs, M98.set, Mo1.intTime, Mo1.floatTime, Mo1.timestamp];
  _98.schema = R98
})
// @from(Ln 138852, Col 4)
vVB = U((b98) => {
  var jVB = SXA(),
    T98 = a11(),
    TVB = xXA(),
    P98 = PMA(),
    S98 = Xo1(),
    Ro1 = Do1(),
    _o1 = Ko1(),
    x98 = JVB(),
    y98 = IVB(),
    PVB = Eo1(),
    vMA = u11(),
    SVB = Co1(),
    xVB = t11(),
    MVB = OVB(),
    yVB = No1(),
    Z01 = Lo1(),
    RVB = new Map([
      ["core", x98.schema],
      ["failsafe", [jVB.map, TVB.seq, P98.string]],
      ["json", y98.schema],
      ["yaml11", MVB.schema],
      ["yaml-1.1", MVB.schema]
    ]),
    _VB = {
      binary: PVB.binary,
      bool: S98.boolTag,
      float: Ro1.float,
      floatExp: Ro1.floatExp,
      floatNaN: Ro1.floatNaN,
      floatTime: Z01.floatTime,
      int: _o1.int,
      intHex: _o1.intHex,
      intOct: _o1.intOct,
      intTime: Z01.intTime,
      map: jVB.map,
      merge: vMA.merge,
      null: T98.nullTag,
      omap: SVB.omap,
      pairs: xVB.pairs,
      seq: TVB.seq,
      set: yVB.set,
      timestamp: Z01.timestamp
    },
    v98 = {
      "tag:yaml.org,2002:binary": PVB.binary,
      "tag:yaml.org,2002:merge": vMA.merge,
      "tag:yaml.org,2002:omap": SVB.omap,
      "tag:yaml.org,2002:pairs": xVB.pairs,
      "tag:yaml.org,2002:set": yVB.set,
      "tag:yaml.org,2002:timestamp": Z01.timestamp
    };

  function k98(A, Q, B) {
    let G = RVB.get(Q);
    if (G && !A) return B && !G.includes(vMA.merge) ? G.concat(vMA.merge) : G.slice();
    let Z = G;
    if (!Z)
      if (Array.isArray(A)) Z = [];
      else {
        let Y = Array.from(RVB.keys()).filter((J) => J !== "yaml11").map((J) => JSON.stringify(J)).join(", ");
        throw Error(`Unknown schema "${Q}"; use one of ${Y} or define customTags array`)
      } if (Array.isArray(A))
      for (let Y of A) Z = Z.concat(Y);
    else if (typeof A === "function") Z = A(Z.slice());
    if (B) Z = Z.concat(vMA.merge);
    return Z.reduce((Y, J) => {
      let X = typeof J === "string" ? _VB[J] : J;
      if (!X) {
        let I = JSON.stringify(J),
          D = Object.keys(_VB).map((W) => JSON.stringify(W)).join(", ");
        throw Error(`Unknown custom tag ${I}; use one of ${D}`)
      }
      if (!Y.includes(X)) Y.push(X);
      return Y
    }, [])
  }
  b98.coreKnownTags = v98;
  b98.getTags = k98
})
// @from(Ln 138932, Col 4)
Po1 = U((c98) => {
  var jo1 = G7(),
    g98 = SXA(),
    u98 = xXA(),
    m98 = PMA(),
    Y01 = vVB(),
    d98 = (A, Q) => A.key < Q.key ? -1 : A.key > Q.key ? 1 : 0;
  class To1 {
    constructor({
      compat: A,
      customTags: Q,
      merge: B,
      resolveKnownTags: G,
      schema: Z,
      sortMapEntries: Y,
      toStringDefaults: J
    }) {
      this.compat = Array.isArray(A) ? Y01.getTags(A, "compat") : A ? Y01.getTags(null, A) : null, this.name = typeof Z === "string" && Z || "core", this.knownTags = G ? Y01.coreKnownTags : {}, this.tags = Y01.getTags(Q, this.name, B), this.toStringOptions = J ?? null, Object.defineProperty(this, jo1.MAP, {
        value: g98.map
      }), Object.defineProperty(this, jo1.SCALAR, {
        value: m98.string
      }), Object.defineProperty(this, jo1.SEQ, {
        value: u98.seq
      }), this.sortMapEntries = typeof Y === "function" ? Y : Y === !0 ? d98 : null
    }
    clone() {
      let A = Object.create(To1.prototype, Object.getOwnPropertyDescriptors(this));
      return A.tags = this.tags.slice(), A
    }
  }
  c98.Schema = To1
})
// @from(Ln 138964, Col 4)
kVB = U((n98) => {
  var l98 = G7(),
    So1 = RMA(),
    kMA = LMA();

  function i98(A, Q) {
    let B = [],
      G = Q.directives === !0;
    if (Q.directives !== !1 && A.directives) {
      let I = A.directives.toString(A);
      if (I) B.push(I), G = !0;
      else if (A.directives.docStart) G = !0
    }
    if (G) B.push("---");
    let Z = So1.createStringifyContext(A, Q),
      {
        commentString: Y
      } = Z.options;
    if (A.commentBefore) {
      if (B.length !== 1) B.unshift("");
      let I = Y(A.commentBefore);
      B.unshift(kMA.indentComment(I, ""))
    }
    let J = !1,
      X = null;
    if (A.contents) {
      if (l98.isNode(A.contents)) {
        if (A.contents.spaceBefore && G) B.push("");
        if (A.contents.commentBefore) {
          let W = Y(A.contents.commentBefore);
          B.push(kMA.indentComment(W, ""))
        }
        Z.forceBlockIndent = !!A.comment, X = A.contents.comment
      }
      let I = X ? void 0 : () => J = !0,
        D = So1.stringify(A.contents, Z, () => X = null, I);
      if (X) D += kMA.lineComment(D, "", Y(X));
      if ((D[0] === "|" || D[0] === ">") && B[B.length - 1] === "---") B[B.length - 1] = `--- ${D}`;
      else B.push(D)
    } else B.push(So1.stringify(A.contents, Z));
    if (A.directives?.docEnd)
      if (A.comment) {
        let I = Y(A.comment);
        if (I.includes(`
`)) B.push("..."), B.push(kMA.indentComment(I, ""));
        else B.push(`... ${I}`)
      } else B.push("...");
    else {
      let I = A.comment;
      if (I && J) I = I.replace(/^\n+/, "");
      if (I) {
        if ((!J || X) && B[B.length - 1] !== "") B.push("");
        B.push(kMA.indentComment(Y(I), ""))
      }
    }
    return B.join(`
`) + `
`
  }
  n98.stringifyDocument = i98
})
// @from(Ln 139025, Col 4)
bMA = U((B48) => {
  var o98 = NMA(),
    vXA = v11(),
    uR = G7(),
    r98 = Ga(),
    s98 = Aa(),
    t98 = Po1(),
    e98 = kVB(),
    xo1 = S11(),
    A48 = sa1(),
    Q48 = wMA(),
    yo1 = ra1();
  class vo1 {
    constructor(A, Q, B) {
      this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, uR.NODE_TYPE, {
        value: uR.DOC
      });
      let G = null;
      if (typeof Q === "function" || Array.isArray(Q)) G = Q;
      else if (B === void 0 && Q) B = Q, Q = void 0;
      let Z = Object.assign({
        intAsBigInt: !1,
        keepSourceTokens: !1,
        logLevel: "warn",
        prettyErrors: !0,
        strict: !0,
        stringKeys: !1,
        uniqueKeys: !0,
        version: "1.2"
      }, B);
      this.options = Z;
      let {
        version: Y
      } = Z;
      if (B?._directives) {
        if (this.directives = B._directives.atDocument(), this.directives.yaml.explicit) Y = this.directives.yaml.version
      } else this.directives = new yo1.Directives({
        version: Y
      });
      this.setSchema(Y, B), this.contents = A === void 0 ? null : this.createNode(A, G, B)
    }
    clone() {
      let A = Object.create(vo1.prototype, {
        [uR.NODE_TYPE]: {
          value: uR.DOC
        }
      });
      if (A.commentBefore = this.commentBefore, A.comment = this.comment, A.errors = this.errors.slice(), A.warnings = this.warnings.slice(), A.options = Object.assign({}, this.options), this.directives) A.directives = this.directives.clone();
      if (A.schema = this.schema.clone(), A.contents = uR.isNode(this.contents) ? this.contents.clone(A.schema) : this.contents, this.range) A.range = this.range.slice();
      return A
    }
    add(A) {
      if (kXA(this.contents)) this.contents.add(A)
    }
    addIn(A, Q) {
      if (kXA(this.contents)) this.contents.addIn(A, Q)
    }
    createAlias(A, Q) {
      if (!A.anchor) {
        let B = xo1.anchorNames(this);
        A.anchor = !Q || B.has(Q) ? xo1.findNewAnchor(Q || "a", B) : Q
      }
      return new o98.Alias(A.anchor)
    }
    createNode(A, Q, B) {
      let G = void 0;
      if (typeof Q === "function") A = Q.call({
        "": A
      }, "", A), G = Q;
      else if (Array.isArray(Q)) {
        let E = ($) => typeof $ === "number" || $ instanceof String || $ instanceof Number,
          z = Q.filter(E).map(String);
        if (z.length > 0) Q = Q.concat(z);
        G = Q
      } else if (B === void 0 && Q) B = Q, Q = void 0;
      let {
        aliasDuplicateObjects: Z,
        anchorPrefix: Y,
        flow: J,
        keepUndefined: X,
        onTagObj: I,
        tag: D
      } = B ?? {}, {
        onAnchor: W,
        setAnchors: K,
        sourceObjects: V
      } = xo1.createNodeAnchors(this, Y || "a"), F = {
        aliasDuplicateObjects: Z ?? !0,
        keepUndefined: X ?? !1,
        onAnchor: W,
        onTagObj: I,
        replacer: G,
        schema: this.schema,
        sourceObjects: V
      }, H = Q48.createNode(A, D, F);
      if (J && uR.isCollection(H)) H.flow = !0;
      return K(), H
    }
    createPair(A, Q, B = {}) {
      let G = this.createNode(A, null, B),
        Z = this.createNode(Q, null, B);
      return new r98.Pair(G, Z)
    }
    delete(A) {
      return kXA(this.contents) ? this.contents.delete(A) : !1
    }
    deleteIn(A) {
      if (vXA.isEmptyPath(A)) {
        if (this.contents == null) return !1;
        return this.contents = null, !0
      }
      return kXA(this.contents) ? this.contents.deleteIn(A) : !1
    }
    get(A, Q) {
      return uR.isCollection(this.contents) ? this.contents.get(A, Q) : void 0
    }
    getIn(A, Q) {
      if (vXA.isEmptyPath(A)) return !Q && uR.isScalar(this.contents) ? this.contents.value : this.contents;
      return uR.isCollection(this.contents) ? this.contents.getIn(A, Q) : void 0
    }
    has(A) {
      return uR.isCollection(this.contents) ? this.contents.has(A) : !1
    }
    hasIn(A) {
      if (vXA.isEmptyPath(A)) return this.contents !== void 0;
      return uR.isCollection(this.contents) ? this.contents.hasIn(A) : !1
    }
    set(A, Q) {
      if (this.contents == null) this.contents = vXA.collectionFromPath(this.schema, [A], Q);
      else if (kXA(this.contents)) this.contents.set(A, Q)
    }
    setIn(A, Q) {
      if (vXA.isEmptyPath(A)) this.contents = Q;
      else if (this.contents == null) this.contents = vXA.collectionFromPath(this.schema, Array.from(A), Q);
      else if (kXA(this.contents)) this.contents.setIn(A, Q)
    }
    setSchema(A, Q = {}) {
      if (typeof A === "number") A = String(A);
      let B;
      switch (A) {
        case "1.1":
          if (this.directives) this.directives.yaml.version = "1.1";
          else this.directives = new yo1.Directives({
            version: "1.1"
          });
          B = {
            resolveKnownTags: !1,
            schema: "yaml-1.1"
          };
          break;
        case "1.2":
        case "next":
          if (this.directives) this.directives.yaml.version = A;
          else this.directives = new yo1.Directives({
            version: A
          });
          B = {
            resolveKnownTags: !0,
            schema: "core"
          };
          break;
        case null:
          if (this.directives) delete this.directives;
          B = null;
          break;
        default: {
          let G = JSON.stringify(A);
          throw Error(`Expected '1.1', '1.2' or null as first argument, but found: ${G}`)
        }
      }
      if (Q.schema instanceof Object) this.schema = Q.schema;
      else if (B) this.schema = new t98.Schema(Object.assign(B, Q));
      else throw Error("With a null YAML version, the { schema: Schema } option is required")
    }
    toJS({
      json: A,
      jsonArg: Q,
      mapAsMap: B,
      maxAliasCount: G,
      onAnchor: Z,
      reviver: Y
    } = {}) {
      let J = {
          anchors: new Map,
          doc: this,
          keep: !A,
          mapAsMap: B === !0,
          mapKeyWarned: !1,
          maxAliasCount: typeof G === "number" ? G : 100
        },
        X = s98.toJS(this.contents, Q ?? "", J);
      if (typeof Z === "function")
        for (let {
            count: I,
            res: D
          }
          of J.anchors.values()) Z(D, I);
      return typeof Y === "function" ? A48.applyReviver(Y, {
        "": X
      }, "", X) : X
    }
    toJSON(A, Q) {
      return this.toJS({
        json: !0,
        jsonArg: A,
        mapAsMap: !1,
        onAnchor: Q
      })
    }
    toString(A = {}) {
      if (this.errors.length > 0) throw Error("Document with errors cannot be stringified");
      if ("indent" in A && (!Number.isInteger(A.indent) || Number(A.indent) <= 0)) {
        let Q = JSON.stringify(A.indent);
        throw Error(`"indent" option must be a positive integer, not ${Q}`)
      }
      return e98.stringifyDocument(this, A)
    }
  }

  function kXA(A) {
    if (uR.isCollection(A)) return !0;
    throw Error("Expected a YAML collection as document contents")
  }
  B48.Document = vo1
})
// @from(Ln 139250, Col 4)
fMA = U((Y48) => {
  class J01 extends Error {
    constructor(A, Q, B, G) {
      super();
      this.name = A, this.code = B, this.message = G, this.pos = Q
    }
  }
  class bVB extends J01 {
    constructor(A, Q, B) {
      super("YAMLParseError", A, Q, B)
    }
  }
  class fVB extends J01 {
    constructor(A, Q, B) {
      super("YAMLWarning", A, Q, B)
    }
  }
  var Z48 = (A, Q) => (B) => {
    if (B.pos[0] === -1) return;
    B.linePos = B.pos.map((X) => Q.linePos(X));
    let {
      line: G,
      col: Z
    } = B.linePos[0];
    B.message += ` at line ${G}, column ${Z}`;
    let Y = Z - 1,
      J = A.substring(Q.lineStarts[G - 1], Q.lineStarts[G]).replace(/[\n\r]+$/, "");
    if (Y >= 60 && J.length > 80) {
      let X = Math.min(Y - 39, J.length - 79);
      J = "…" + J.substring(X), Y -= X - 1
    }
    if (J.length > 80) J = J.substring(0, 79) + "…";
    if (G > 1 && /^ *$/.test(J.substring(0, Y))) {
      let X = A.substring(Q.lineStarts[G - 2], Q.lineStarts[G - 1]);
      if (X.length > 80) X = X.substring(0, 79) + `…
`;
      J = X + J
    }
    if (/[^ ]/.test(J)) {
      let X = 1,
        I = B.linePos[1];
      if (I && I.line === G && I.col > Z) X = Math.max(1, Math.min(I.col - Z, 80 - Y));
      let D = " ".repeat(Y) + "^".repeat(X);
      B.message += `:

${J}
${D}
`
    }
  };
  Y48.YAMLError = J01;
  Y48.YAMLParseError = bVB;
  Y48.YAMLWarning = fVB;
  Y48.prettifyError = Z48
})
// @from(Ln 139305, Col 4)
hMA = U((K48) => {
  function W48(A, {
    flow: Q,
    indicator: B,
    next: G,
    offset: Z,
    onError: Y,
    parentIndent: J,
    startOnNewline: X
  }) {
    let I = !1,
      D = X,
      W = X,
      K = "",
      V = "",
      F = !1,
      H = !1,
      E = null,
      z = null,
      $ = null,
      O = null,
      L = null,
      M = null,
      _ = null;
    for (let b of A) {
      if (H) {
        if (b.type !== "space" && b.type !== "newline" && b.type !== "comma") Y(b.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
        H = !1
      }
      if (E) {
        if (D && b.type !== "comment" && b.type !== "newline") Y(E, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
        E = null
      }
      switch (b.type) {
        case "space":
          if (!Q && (B !== "doc-start" || G?.type !== "flow-collection") && b.source.includes("\t")) E = b;
          W = !0;
          break;
        case "comment": {
          if (!W) Y(b, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          let S = b.source.substring(1) || " ";
          if (!K) K = S;
          else K += V + S;
          V = "", D = !1;
          break
        }
        case "newline":
          if (D) {
            if (K) K += b.source;
            else if (!M || B !== "seq-item-ind") I = !0
          } else V += b.source;
          if (D = !0, F = !0, z || $) O = b;
          W = !0;
          break;
        case "anchor":
          if (z) Y(b, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
          if (b.source.endsWith(":")) Y(b.offset + b.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0);
          z = b, _ ?? (_ = b.offset), D = !1, W = !1, H = !0;
          break;
        case "tag": {
          if ($) Y(b, "MULTIPLE_TAGS", "A node can have at most one tag");
          $ = b, _ ?? (_ = b.offset), D = !1, W = !1, H = !0;
          break
        }
        case B:
          if (z || $) Y(b, "BAD_PROP_ORDER", `Anchors and tags must be after the ${b.source} indicator`);
          if (M) Y(b, "UNEXPECTED_TOKEN", `Unexpected ${b.source} in ${Q??"collection"}`);
          M = b, D = B === "seq-item-ind" || B === "explicit-key-ind", W = !1;
          break;
        case "comma":
          if (Q) {
            if (L) Y(b, "UNEXPECTED_TOKEN", `Unexpected , in ${Q}`);
            L = b, D = !1, W = !1;
            break
          }
        default:
          Y(b, "UNEXPECTED_TOKEN", `Unexpected ${b.type} token`), D = !1, W = !1
      }
    }
    let j = A[A.length - 1],
      x = j ? j.offset + j.source.length : Z;
    if (H && G && G.type !== "space" && G.type !== "newline" && G.type !== "comma" && (G.type !== "scalar" || G.source !== "")) Y(G.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
    if (E && (D && E.indent <= J || G?.type === "block-map" || G?.type === "block-seq")) Y(E, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
    return {
      comma: L,
      found: M,
      spaceBefore: I,
      comment: K,
      hasNewline: F,
      anchor: z,
      tag: $,
      newlineAfterProp: O,
      end: x,
      start: _ ?? x
    }
  }
  K48.resolveProps = W48
})
// @from(Ln 139403, Col 4)
X01 = U((F48) => {
  function ko1(A) {
    if (!A) return null;
    switch (A.type) {
      case "alias":
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        if (A.source.includes(`
`)) return !0;
        if (A.end) {
          for (let Q of A.end)
            if (Q.type === "newline") return !0
        }
        return !1;
      case "flow-collection":
        for (let Q of A.items) {
          for (let B of Q.start)
            if (B.type === "newline") return !0;
          if (Q.sep) {
            for (let B of Q.sep)
              if (B.type === "newline") return !0
          }
          if (ko1(Q.key) || ko1(Q.value)) return !0
        }
        return !1;
      default:
        return !0
    }
  }
  F48.containsNewline = ko1
})
// @from(Ln 139435, Col 4)
bo1 = U(($48) => {
  var E48 = X01();

  function z48(A, Q, B) {
    if (Q?.type === "flow-collection") {
      let G = Q.end[0];
      if (G.indent === A && (G.source === "]" || G.source === "}") && E48.containsNewline(Q)) B(G, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0)
    }
  }
  $48.flowIndentCheck = z48
})
// @from(Ln 139446, Col 4)
fo1 = U((q48) => {
  var hVB = G7();

  function U48(A, Q, B) {
    let {
      uniqueKeys: G
    } = A.options;
    if (G === !1) return !1;
    let Z = typeof G === "function" ? G : (Y, J) => Y === J || hVB.isScalar(Y) && hVB.isScalar(J) && Y.value === J.value;
    return Q.some((Y) => Z(Y.key, B))
  }
  q48.mapIncludes = U48
})
// @from(Ln 139459, Col 4)
cVB = U((R48) => {
  var gVB = Ga(),
    w48 = Ya(),
    uVB = hMA(),
    L48 = X01(),
    mVB = bo1(),
    O48 = fo1(),
    dVB = "All mapping items must start at the same column";

  function M48({
    composeNode: A,
    composeEmptyNode: Q
  }, B, G, Z, Y) {
    let X = new(Y?.nodeClass ?? w48.YAMLMap)(B.schema);
    if (B.atRoot) B.atRoot = !1;
    let I = G.offset,
      D = null;
    for (let W of G.items) {
      let {
        start: K,
        key: V,
        sep: F,
        value: H
      } = W, E = uVB.resolveProps(K, {
        indicator: "explicit-key-ind",
        next: V ?? F?.[0],
        offset: I,
        onError: Z,
        parentIndent: G.indent,
        startOnNewline: !0
      }), z = !E.found;
      if (z) {
        if (V) {
          if (V.type === "block-seq") Z(I, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
          else if ("indent" in V && V.indent !== G.indent) Z(I, "BAD_INDENT", dVB)
        }
        if (!E.anchor && !E.tag && !F) {
          if (D = E.end, E.comment)
            if (X.comment) X.comment += `
` + E.comment;
            else X.comment = E.comment;
          continue
        }
        if (E.newlineAfterProp || L48.containsNewline(V)) Z(V ?? K[K.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line")
      } else if (E.found?.indent !== G.indent) Z(I, "BAD_INDENT", dVB);
      B.atKey = !0;
      let $ = E.end,
        O = V ? A(B, V, E, Z) : Q(B, $, K, null, E, Z);
      if (B.schema.compat) mVB.flowIndentCheck(G.indent, V, Z);
      if (B.atKey = !1, O48.mapIncludes(B, X.items, O)) Z($, "DUPLICATE_KEY", "Map keys must be unique");
      let L = uVB.resolveProps(F ?? [], {
        indicator: "map-value-ind",
        next: H,
        offset: O.range[2],
        onError: Z,
        parentIndent: G.indent,
        startOnNewline: !V || V.type === "block-scalar"
      });
      if (I = L.end, L.found) {
        if (z) {
          if (H?.type === "block-map" && !L.hasNewline) Z(I, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
          if (B.options.strict && E.start < L.found.offset - 1024) Z(O.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key")
        }
        let M = H ? A(B, H, L, Z) : Q(B, I, F, null, L, Z);
        if (B.schema.compat) mVB.flowIndentCheck(G.indent, H, Z);
        I = M.range[2];
        let _ = new gVB.Pair(O, M);
        if (B.options.keepSourceTokens) _.srcToken = W;
        X.items.push(_)
      } else {
        if (z) Z(O.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
        if (L.comment)
          if (O.comment) O.comment += `
` + L.comment;
          else O.comment = L.comment;
        let M = new gVB.Pair(O);
        if (B.options.keepSourceTokens) M.srcToken = W;
        X.items.push(M)
      }
    }
    if (D && D < I) Z(D, "IMPOSSIBLE", "Map comment with trailing content");
    return X.range = [G.offset, I, D ?? I], X
  }
  R48.resolveBlockMap = M48
})
// @from(Ln 139544, Col 4)
pVB = U((x48) => {
  var j48 = Ja(),
    T48 = hMA(),
    P48 = bo1();

  function S48({
    composeNode: A,
    composeEmptyNode: Q
  }, B, G, Z, Y) {
    let X = new(Y?.nodeClass ?? j48.YAMLSeq)(B.schema);
    if (B.atRoot) B.atRoot = !1;
    if (B.atKey) B.atKey = !1;
    let I = G.offset,
      D = null;
    for (let {
        start: W,
        value: K
      }
      of G.items) {
      let V = T48.resolveProps(W, {
        indicator: "seq-item-ind",
        next: K,
        offset: I,
        onError: Z,
        parentIndent: G.indent,
        startOnNewline: !0
      });
      if (!V.found)
        if (V.anchor || V.tag || K)
          if (K && K.type === "block-seq") Z(V.end, "BAD_INDENT", "All sequence items must start at the same column");
          else Z(I, "MISSING_CHAR", "Sequence item without - indicator");
      else {
        if (D = V.end, V.comment) X.comment = V.comment;
        continue
      }
      let F = K ? A(B, K, V, Z) : Q(B, V.end, W, null, V, Z);
      if (B.schema.compat) P48.flowIndentCheck(G.indent, K, Z);
      I = F.range[2], X.items.push(F)
    }
    return X.range = [G.offset, I, D ?? I], X
  }
  x48.resolveBlockSeq = S48
})
// @from(Ln 139587, Col 4)
bXA = U((k48) => {
  function v48(A, Q, B, G) {
    let Z = "";
    if (A) {
      let Y = !1,
        J = "";
      for (let X of A) {
        let {
          source: I,
          type: D
        } = X;
        switch (D) {
          case "space":
            Y = !0;
            break;
          case "comment": {
            if (B && !Y) G(X, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            let W = I.substring(1) || " ";
            if (!Z) Z = W;
            else Z += J + W;
            J = "";
            break
          }
          case "newline":
            if (Z) J += I;
            Y = !0;
            break;
          default:
            G(X, "UNEXPECTED_TOKEN", `Unexpected ${D} at node end`)
        }
        Q += I.length
      }
    }
    return {
      comment: Z,
      offset: Q
    }
  }
  k48.resolveEnd = v48
})
// @from(Ln 139627, Col 4)
nVB = U((p48) => {
  var f48 = G7(),
    h48 = Ga(),
    lVB = Ya(),
    g48 = Ja(),
    u48 = bXA(),
    iVB = hMA(),
    m48 = X01(),
    d48 = fo1(),
    ho1 = "Block collections are not allowed within flow collections",
    go1 = (A) => A && (A.type === "block-map" || A.type === "block-seq");

  function c48({
    composeNode: A,
    composeEmptyNode: Q
  }, B, G, Z, Y) {
    let J = G.start.source === "{",
      X = J ? "flow map" : "flow sequence",
      D = new(Y?.nodeClass ?? (J ? lVB.YAMLMap : g48.YAMLSeq))(B.schema);
    D.flow = !0;
    let W = B.atRoot;
    if (W) B.atRoot = !1;
    if (B.atKey) B.atKey = !1;
    let K = G.offset + G.start.source.length;
    for (let z = 0; z < G.items.length; ++z) {
      let $ = G.items[z],
        {
          start: O,
          key: L,
          sep: M,
          value: _
        } = $,
        j = iVB.resolveProps(O, {
          flow: X,
          indicator: "explicit-key-ind",
          next: L ?? M?.[0],
          offset: K,
          onError: Z,
          parentIndent: G.indent,
          startOnNewline: !1
        });
      if (!j.found) {
        if (!j.anchor && !j.tag && !M && !_) {
          if (z === 0 && j.comma) Z(j.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${X}`);
          else if (z < G.items.length - 1) Z(j.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${X}`);
          if (j.comment)
            if (D.comment) D.comment += `
` + j.comment;
            else D.comment = j.comment;
          K = j.end;
          continue
        }
        if (!J && B.options.strict && m48.containsNewline(L)) Z(L, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line")
      }
      if (z === 0) {
        if (j.comma) Z(j.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${X}`)
      } else {
        if (!j.comma) Z(j.start, "MISSING_CHAR", `Missing , between ${X} items`);
        if (j.comment) {
          let x = "";
          A: for (let b of O) switch (b.type) {
            case "comma":
            case "space":
              break;
            case "comment":
              x = b.source.substring(1);
              break A;
            default:
              break A
          }
          if (x) {
            let b = D.items[D.items.length - 1];
            if (f48.isPair(b)) b = b.value ?? b.key;
            if (b.comment) b.comment += `
` + x;
            else b.comment = x;
            j.comment = j.comment.substring(x.length + 1)
          }
        }
      }
      if (!J && !M && !j.found) {
        let x = _ ? A(B, _, j, Z) : Q(B, j.end, M, null, j, Z);
        if (D.items.push(x), K = x.range[2], go1(_)) Z(x.range, "BLOCK_IN_FLOW", ho1)
      } else {
        B.atKey = !0;
        let x = j.end,
          b = L ? A(B, L, j, Z) : Q(B, x, O, null, j, Z);
        if (go1(L)) Z(b.range, "BLOCK_IN_FLOW", ho1);
        B.atKey = !1;
        let S = iVB.resolveProps(M ?? [], {
          flow: X,
          indicator: "map-value-ind",
          next: _,
          offset: b.range[2],
          onError: Z,
          parentIndent: G.indent,
          startOnNewline: !1
        });
        if (S.found) {
          if (!J && !j.found && B.options.strict) {
            if (M)
              for (let AA of M) {
                if (AA === S.found) break;
                if (AA.type === "newline") {
                  Z(AA, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break
                }
              }
            if (j.start < S.found.offset - 1024) Z(S.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key")
          }
        } else if (_)
          if ("source" in _ && _.source && _.source[0] === ":") Z(_, "MISSING_CHAR", `Missing space after : in ${X}`);
          else Z(S.start, "MISSING_CHAR", `Missing , or : between ${X} items`);
        let u = _ ? A(B, _, S, Z) : S.found ? Q(B, S.end, M, null, S, Z) : null;
        if (u) {
          if (go1(_)) Z(u.range, "BLOCK_IN_FLOW", ho1)
        } else if (S.comment)
          if (b.comment) b.comment += `
` + S.comment;
          else b.comment = S.comment;
        let f = new h48.Pair(b, u);
        if (B.options.keepSourceTokens) f.srcToken = $;
        if (J) {
          let AA = D;
          if (d48.mapIncludes(B, AA.items, b)) Z(x, "DUPLICATE_KEY", "Map keys must be unique");
          AA.items.push(f)
        } else {
          let AA = new lVB.YAMLMap(B.schema);
          AA.flow = !0, AA.items.push(f);
          let n = (u ?? b).range;
          AA.range = [b.range[0], n[1], n[2]], D.items.push(AA)
        }
        K = u ? u.range[2] : S.end
      }
    }
    let V = J ? "}" : "]",
      [F, ...H] = G.end,
      E = K;
    if (F && F.source === V) E = F.offset + F.source.length;
    else {
      let z = X[0].toUpperCase() + X.substring(1),
        $ = W ? `${z} must end with a ${V}` : `${z} in block collection must be sufficiently indented and end with a ${V}`;
      if (Z(K, W ? "MISSING_CHAR" : "BAD_INDENT", $), F && F.source.length !== 1) H.unshift(F)
    }
    if (H.length > 0) {
      let z = u48.resolveEnd(H, E, B.options.strict, Z);
      if (z.comment)
        if (D.comment) D.comment += `
` + z.comment;
        else D.comment = z.comment;
      D.range = [G.offset, E, z.offset]
    } else D.range = [G.offset, E, E];
    return D
  }
  p48.resolveFlowCollection = c48
})
// @from(Ln 139783, Col 4)
aVB = U((A68) => {
  var i48 = G7(),
    n48 = mW(),
    a48 = Ya(),
    o48 = Ja(),
    r48 = cVB(),
    s48 = pVB(),
    t48 = nVB();

  function uo1(A, Q, B, G, Z, Y) {
    let J = B.type === "block-map" ? r48.resolveBlockMap(A, Q, B, G, Y) : B.type === "block-seq" ? s48.resolveBlockSeq(A, Q, B, G, Y) : t48.resolveFlowCollection(A, Q, B, G, Y),
      X = J.constructor;
    if (Z === "!" || Z === X.tagName) return J.tag = X.tagName, J;
    if (Z) J.tag = Z;
    return J
  }

  function e48(A, Q, B, G, Z) {
    let Y = G.tag,
      J = !Y ? null : Q.directives.tagName(Y.source, (V) => Z(Y, "TAG_RESOLVE_FAILED", V));
    if (B.type === "block-seq") {
      let {
        anchor: V,
        newlineAfterProp: F
      } = G, H = V && Y ? V.offset > Y.offset ? V : Y : V ?? Y;
      if (H && (!F || F.offset < H.offset)) Z(H, "MISSING_CHAR", "Missing newline after block sequence props")
    }
    let X = B.type === "block-map" ? "map" : B.type === "block-seq" ? "seq" : B.start.source === "{" ? "map" : "seq";
    if (!Y || !J || J === "!" || J === a48.YAMLMap.tagName && X === "map" || J === o48.YAMLSeq.tagName && X === "seq") return uo1(A, Q, B, Z, J);
    let I = Q.schema.tags.find((V) => V.tag === J && V.collection === X);
    if (!I) {
      let V = Q.schema.knownTags[J];
      if (V && V.collection === X) Q.schema.tags.push(Object.assign({}, V, {
        default: !1
      })), I = V;
      else {
        if (V) Z(Y, "BAD_COLLECTION_TYPE", `${V.tag} used for ${X} collection, but expects ${V.collection??"scalar"}`, !0);
        else Z(Y, "TAG_RESOLVE_FAILED", `Unresolved tag: ${J}`, !0);
        return uo1(A, Q, B, Z, J)
      }
    }
    let D = uo1(A, Q, B, Z, J, I),
      W = I.resolve?.(D, (V) => Z(Y, "TAG_RESOLVE_FAILED", V), Q.options) ?? D,
      K = i48.isNode(W) ? W : new n48.Scalar(W);
    if (K.range = D.range, K.tag = J, I?.format) K.format = I.format;
    return K
  }
  A68.composeCollection = e48
})
// @from(Ln 139832, Col 4)
do1 = U((Y68) => {
  var mo1 = mW();

  function B68(A, Q, B) {
    let G = Q.offset,
      Z = G68(Q, A.options.strict, B);
    if (!Z) return {
      value: "",
      type: null,
      comment: "",
      range: [G, G, G]
    };
    let Y = Z.mode === ">" ? mo1.Scalar.BLOCK_FOLDED : mo1.Scalar.BLOCK_LITERAL,
      J = Q.source ? Z68(Q.source) : [],
      X = J.length;
    for (let E = J.length - 1; E >= 0; --E) {
      let z = J[E][1];
      if (z === "" || z === "\r") X = E;
      else break
    }
    if (X === 0) {
      let E = Z.chomp === "+" && J.length > 0 ? `
`.repeat(Math.max(1, J.length - 1)) : "",
        z = G + Z.length;
      if (Q.source) z += Q.source.length;
      return {
        value: E,
        type: Y,
        comment: Z.comment,
        range: [G, z, z]
      }
    }
    let I = Q.indent + Z.indent,
      D = Q.offset + Z.length,
      W = 0;
    for (let E = 0; E < X; ++E) {
      let [z, $] = J[E];
      if ($ === "" || $ === "\r") {
        if (Z.indent === 0 && z.length > I) I = z.length
      } else {
        if (z.length < I) B(D + z.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator");
        if (Z.indent === 0) I = z.length;
        if (W = E, I === 0 && !A.atRoot) B(D, "BAD_INDENT", "Block scalar values in collections must be indented");
        break
      }
      D += z.length + $.length + 1
    }
    for (let E = J.length - 1; E >= X; --E)
      if (J[E][0].length > I) X = E + 1;
    let K = "",
      V = "",
      F = !1;
    for (let E = 0; E < W; ++E) K += J[E][0].slice(I) + `
`;
    for (let E = W; E < X; ++E) {
      let [z, $] = J[E];
      D += z.length + $.length + 1;
      let O = $[$.length - 1] === "\r";
      if (O) $ = $.slice(0, -1);
      if ($ && z.length < I) {
        let M = `Block scalar lines must not be less indented than their ${Z.indent?"explicit indentation indicator":"first line"}`;
        B(D - $.length - (O ? 2 : 1), "BAD_INDENT", M), z = ""
      }
      if (Y === mo1.Scalar.BLOCK_LITERAL) K += V + z.slice(I) + $, V = `
`;
      else if (z.length > I || $[0] === "\t") {
        if (V === " ") V = `
`;
        else if (!F && V === `
`) V = `

`;
        K += V + z.slice(I) + $, V = `
`, F = !0
      } else if ($ === "")
        if (V === `
`) K += `
`;
        else V = `
`;
      else K += V + $, V = " ", F = !1
    }
    switch (Z.chomp) {
      case "-":
        break;
      case "+":
        for (let E = X; E < J.length; ++E) K += `
` + J[E][0].slice(I);
        if (K[K.length - 1] !== `
`) K += `
`;
        break;
      default:
        K += `
`
    }
    let H = G + Z.length + Q.source.length;
    return {
      value: K,
      type: Y,
      comment: Z.comment,
      range: [G, H, H]
    }
  }

  function G68({
    offset: A,
    props: Q
  }, B, G) {
    if (Q[0].type !== "block-scalar-header") return G(Q[0], "IMPOSSIBLE", "Block scalar header not found"), null;
    let {
      source: Z
    } = Q[0], Y = Z[0], J = 0, X = "", I = -1;
    for (let V = 1; V < Z.length; ++V) {
      let F = Z[V];
      if (!X && (F === "-" || F === "+")) X = F;
      else {
        let H = Number(F);
        if (!J && H) J = H;
        else if (I === -1) I = A + V
      }
    }
    if (I !== -1) G(I, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${Z}`);
    let D = !1,
      W = "",
      K = Z.length;
    for (let V = 1; V < Q.length; ++V) {
      let F = Q[V];
      switch (F.type) {
        case "space":
          D = !0;
        case "newline":
          K += F.source.length;
          break;
        case "comment":
          if (B && !D) G(F, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          K += F.source.length, W = F.source.substring(1);
          break;
        case "error":
          G(F, "UNEXPECTED_TOKEN", F.message), K += F.source.length;
          break;
        default: {
          let H = `Unexpected token in block scalar header: ${F.type}`;
          G(F, "UNEXPECTED_TOKEN", H);
          let E = F.source;
          if (E && typeof E === "string") K += E.length
        }
      }
    }
    return {
      mode: Y,
      indent: J,
      chomp: X,
      comment: W,
      length: K
    }
  }

  function Z68(A) {
    let Q = A.split(/\n( *)/),
      B = Q[0],
      G = B.match(/^( *)/),
      Y = [G?.[1] ? [G[1], B.slice(G[1].length)] : ["", B]];
    for (let J = 1; J < Q.length; J += 2) Y.push([Q[J], Q[J + 1]]);
    return Y
  }
  Y68.resolveBlockScalar = B68
})
// @from(Ln 140000, Col 4)
po1 = U((E68) => {
  var co1 = mW(),
    X68 = bXA();

  function I68(A, Q, B) {
    let {
      offset: G,
      type: Z,
      source: Y,
      end: J
    } = A, X, I, D = (V, F, H) => B(G + V, F, H);
    switch (Z) {
      case "scalar":
        X = co1.Scalar.PLAIN, I = D68(Y, D);
        break;
      case "single-quoted-scalar":
        X = co1.Scalar.QUOTE_SINGLE, I = W68(Y, D);
        break;
      case "double-quoted-scalar":
        X = co1.Scalar.QUOTE_DOUBLE, I = K68(Y, D);
        break;
      default:
        return B(A, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${Z}`), {
          value: "",
          type: null,
          comment: "",
          range: [G, G + Y.length, G + Y.length]
        }
    }
    let W = G + Y.length,
      K = X68.resolveEnd(J, W, Q, B);
    return {
      value: I,
      type: X,
      comment: K.comment,
      range: [G, W, K.offset]
    }
  }

  function D68(A, Q) {
    let B = "";
    switch (A[0]) {
      case "\t":
        B = "a tab character";
        break;
      case ",":
        B = "flow indicator character ,";
        break;
      case "%":
        B = "directive indicator character %";
        break;
      case "|":
      case ">": {
        B = `block scalar indicator ${A[0]}`;
        break
      }
      case "@":
      case "`": {
        B = `reserved character ${A[0]}`;
        break
      }
    }
    if (B) Q(0, "BAD_SCALAR_START", `Plain value cannot start with ${B}`);
    return oVB(A)
  }

  function W68(A, Q) {
    if (A[A.length - 1] !== "'" || A.length === 1) Q(A.length, "MISSING_CHAR", "Missing closing 'quote");
    return oVB(A.slice(1, -1)).replace(/''/g, "'")
  }

  function oVB(A) {
    let Q, B;
    try {
      Q = new RegExp(`(.*?)(?<![ 	])[ 	]*\r?
`, "sy"), B = new RegExp(`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`, "sy")
    } catch {
      Q = /(.*?)[ \t]*\r?\n/sy, B = /[ \t]*(.*?)[ \t]*\r?\n/sy
    }
    let G = Q.exec(A);
    if (!G) return A;
    let Z = G[1],
      Y = " ",
      J = Q.lastIndex;
    B.lastIndex = J;
    while (G = B.exec(A)) {
      if (G[1] === "")
        if (Y === `
`) Z += Y;
        else Y = `
`;
      else Z += Y + G[1], Y = " ";
      J = B.lastIndex
    }
    let X = /[ \t]*(.*)/sy;
    return X.lastIndex = J, G = X.exec(A), Z + Y + (G?.[1] ?? "")
  }

  function K68(A, Q) {
    let B = "";
    for (let G = 1; G < A.length - 1; ++G) {
      let Z = A[G];
      if (Z === "\r" && A[G + 1] === `
`) continue;
      if (Z === `
`) {
        let {
          fold: Y,
          offset: J
        } = V68(A, G);
        B += Y, G = J
      } else if (Z === "\\") {
        let Y = A[++G],
          J = F68[Y];
        if (J) B += J;
        else if (Y === `
`) {
          Y = A[G + 1];
          while (Y === " " || Y === "\t") Y = A[++G + 1]
        } else if (Y === "\r" && A[G + 1] === `
`) {
          Y = A[++G + 1];
          while (Y === " " || Y === "\t") Y = A[++G + 1]
        } else if (Y === "x" || Y === "u" || Y === "U") {
          let X = {
            x: 2,
            u: 4,
            U: 8
          } [Y];
          B += H68(A, G + 1, X, Q), G += X
        } else {
          let X = A.substr(G - 1, 2);
          Q(G - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${X}`), B += X
        }
      } else if (Z === " " || Z === "\t") {
        let Y = G,
          J = A[G + 1];
        while (J === " " || J === "\t") J = A[++G + 1];
        if (J !== `
` && !(J === "\r" && A[G + 2] === `
`)) B += G > Y ? A.slice(Y, G + 1) : Z
      } else B += Z
    }
    if (A[A.length - 1] !== '"' || A.length === 1) Q(A.length, "MISSING_CHAR", 'Missing closing "quote');
    return B
  }

  function V68(A, Q) {
    let B = "",
      G = A[Q + 1];
    while (G === " " || G === "\t" || G === `
` || G === "\r") {
      if (G === "\r" && A[Q + 2] !== `
`) break;
      if (G === `
`) B += `
`;
      Q += 1, G = A[Q + 1]
    }
    if (!B) B = " ";
    return {
      fold: B,
      offset: Q
    }
  }
  var F68 = {
    "0": "\x00",
    a: "\x07",
    b: "\b",
    e: "\x1B",
    f: "\f",
    n: `
`,
    r: "\r",
    t: "\t",
    v: "\v",
    N: "",
    _: " ",
    L: "\u2028",
    P: "\u2029",
    " ": " ",
    '"': '"',
    "/": "/",
    "\\": "\\",
    "\t": "\t"
  };

  function H68(A, Q, B, G) {
    let Z = A.substr(Q, B),
      J = Z.length === B && /^[0-9a-fA-F]+$/.test(Z) ? parseInt(Z, 16) : NaN;
    if (isNaN(J)) {
      let X = A.substr(Q - 2, B + 2);
      return G(Q - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${X}`), X
    }
    return String.fromCodePoint(J)
  }
  E68.resolveFlowScalar = I68
})
// @from(Ln 140199, Col 4)
sVB = U((w68) => {
  var rQA = G7(),
    rVB = mW(),
    $68 = do1(),
    C68 = po1();

  function U68(A, Q, B, G) {
    let {
      value: Z,
      type: Y,
      comment: J,
      range: X
    } = Q.type === "block-scalar" ? $68.resolveBlockScalar(A, Q, G) : C68.resolveFlowScalar(Q, A.options.strict, G), I = B ? A.directives.tagName(B.source, (K) => G(B, "TAG_RESOLVE_FAILED", K)) : null, D;
    if (A.options.stringKeys && A.atKey) D = A.schema[rQA.SCALAR];
    else if (I) D = q68(A.schema, Z, I, B, G);
    else if (Q.type === "scalar") D = N68(A, Z, Q, G);
    else D = A.schema[rQA.SCALAR];
    let W;
    try {
      let K = D.resolve(Z, (V) => G(B ?? Q, "TAG_RESOLVE_FAILED", V), A.options);
      W = rQA.isScalar(K) ? K : new rVB.Scalar(K)
    } catch (K) {
      let V = K instanceof Error ? K.message : String(K);
      G(B ?? Q, "TAG_RESOLVE_FAILED", V), W = new rVB.Scalar(Z)
    }
    if (W.range = X, W.source = Z, Y) W.type = Y;
    if (I) W.tag = I;
    if (D.format) W.format = D.format;
    if (J) W.comment = J;
    return W
  }

  function q68(A, Q, B, G, Z) {
    if (B === "!") return A[rQA.SCALAR];
    let Y = [];
    for (let X of A.tags)
      if (!X.collection && X.tag === B)
        if (X.default && X.test) Y.push(X);
        else return X;
    for (let X of Y)
      if (X.test?.test(Q)) return X;
    let J = A.knownTags[B];
    if (J && !J.collection) return A.tags.push(Object.assign({}, J, {
      default: !1,
      test: void 0
    })), J;
    return Z(G, "TAG_RESOLVE_FAILED", `Unresolved tag: ${B}`, B !== "tag:yaml.org,2002:str"), A[rQA.SCALAR]
  }

  function N68({
    atKey: A,
    directives: Q,
    schema: B
  }, G, Z, Y) {
    let J = B.tags.find((X) => (X.default === !0 || A && X.default === "key") && X.test?.test(G)) || B[rQA.SCALAR];
    if (B.compat) {
      let X = B.compat.find((I) => I.default && I.test?.test(G)) ?? B[rQA.SCALAR];
      if (J.tag !== X.tag) {
        let I = Q.tagString(J.tag),
          D = Q.tagString(X.tag),
          W = `Value may be parsed as either ${I} or ${D}`;
        Y(Z, "TAG_RESOLVE_FAILED", W, !0)
      }
    }
    return J
  }
  w68.composeScalar = U68
})
// @from(Ln 140267, Col 4)
tVB = U((M68) => {
  function O68(A, Q, B) {
    if (Q) {
      B ?? (B = Q.length);
      for (let G = B - 1; G >= 0; --G) {
        let Z = Q[G];
        switch (Z.type) {
          case "space":
          case "comment":
          case "newline":
            A -= Z.source.length;
            continue
        }
        Z = Q[++G];
        while (Z?.type === "space") A += Z.source.length, Z = Q[++G];
        break
      }
    }
    return A
  }
  M68.emptyScalarPosition = O68
})
// @from(Ln 140289, Col 4)
QFB = U((v68) => {
  var _68 = NMA(),
    j68 = G7(),
    T68 = aVB(),
    eVB = sVB(),
    P68 = bXA(),
    S68 = tVB(),
    x68 = {
      composeNode: AFB,
      composeEmptyNode: lo1
    };

  function AFB(A, Q, B, G) {
    let Z = A.atKey,
      {
        spaceBefore: Y,
        comment: J,
        anchor: X,
        tag: I
      } = B,
      D, W = !0;
    switch (Q.type) {
      case "alias":
        if (D = y68(A, Q, G), X || I) G(Q, "ALIAS_PROPS", "An alias node must not specify any properties");
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        if (D = eVB.composeScalar(A, Q, I, G), X) D.anchor = X.source.substring(1);
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        if (D = T68.composeCollection(x68, A, Q, B, G), X) D.anchor = X.source.substring(1);
        break;
      default: {
        let K = Q.type === "error" ? Q.message : `Unsupported token (type: ${Q.type})`;
        G(Q, "UNEXPECTED_TOKEN", K), D = lo1(A, Q.offset, void 0, null, B, G), W = !1
      }
    }
    if (X && D.anchor === "") G(X, "BAD_ALIAS", "Anchor cannot be an empty string");
    if (Z && A.options.stringKeys && (!j68.isScalar(D) || typeof D.value !== "string" || D.tag && D.tag !== "tag:yaml.org,2002:str")) G(I ?? Q, "NON_STRING_KEY", "With stringKeys, all keys must be strings");
    if (Y) D.spaceBefore = !0;
    if (J)
      if (Q.type === "scalar" && Q.source === "") D.comment = J;
      else D.commentBefore = J;
    if (A.options.keepSourceTokens && W) D.srcToken = Q;
    return D
  }

  function lo1(A, Q, B, G, {
    spaceBefore: Z,
    comment: Y,
    anchor: J,
    tag: X,
    end: I
  }, D) {
    let W = {
        type: "scalar",
        offset: S68.emptyScalarPosition(Q, B, G),
        indent: -1,
        source: ""
      },
      K = eVB.composeScalar(A, W, X, D);
    if (J) {
      if (K.anchor = J.source.substring(1), K.anchor === "") D(J, "BAD_ALIAS", "Anchor cannot be an empty string")
    }
    if (Z) K.spaceBefore = !0;
    if (Y) K.comment = Y, K.range[2] = I;
    return K
  }

  function y68({
    options: A
  }, {
    offset: Q,
    source: B,
    end: G
  }, Z) {
    let Y = new _68.Alias(B.substring(1));
    if (Y.source === "") Z(Q, "BAD_ALIAS", "Alias cannot be an empty string");
    if (Y.source.endsWith(":")) Z(Q + B.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
    let J = Q + B.length,
      X = P68.resolveEnd(G, J, A.strict, Z);
    if (Y.range = [Q, J, X.offset], X.comment) Y.comment = X.comment;
    return Y
  }
  v68.composeEmptyNode = lo1;
  v68.composeNode = AFB
})
// @from(Ln 140380, Col 4)
GFB = U((m68) => {
  var f68 = bMA(),
    BFB = QFB(),
    h68 = bXA(),
    g68 = hMA();

  function u68(A, Q, {
    offset: B,
    start: G,
    value: Z,
    end: Y
  }, J) {
    let X = Object.assign({
        _directives: Q
      }, A),
      I = new f68.Document(void 0, X),
      D = {
        atKey: !1,
        atRoot: !0,
        directives: I.directives,
        options: I.options,
        schema: I.schema
      },
      W = g68.resolveProps(G, {
        indicator: "doc-start",
        next: Z ?? Y?.[0],
        offset: B,
        onError: J,
        parentIndent: 0,
        startOnNewline: !0
      });
    if (W.found) {
      if (I.directives.docStart = !0, Z && (Z.type === "block-map" || Z.type === "block-seq") && !W.hasNewline) J(W.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")
    }
    I.contents = Z ? BFB.composeNode(D, Z, W, J) : BFB.composeEmptyNode(D, W.end, G, null, W, J);
    let K = I.contents.range[2],
      V = h68.resolveEnd(Y, K, !1, J);
    if (V.comment) I.comment = V.comment;
    return I.range = [B, K, V.offset], I
  }
  m68.composeDoc = u68
})
// @from(Ln 140422, Col 4)
io1 = U((a68) => {
  var c68 = NA("process"),
    p68 = ra1(),
    l68 = bMA(),
    gMA = fMA(),
    ZFB = G7(),
    i68 = GFB(),
    n68 = bXA();

  function uMA(A) {
    if (typeof A === "number") return [A, A + 1];
    if (Array.isArray(A)) return A.length === 2 ? A : [A[0], A[1]];
    let {
      offset: Q,
      source: B
    } = A;
    return [Q, Q + (typeof B === "string" ? B.length : 1)]
  }

  function YFB(A) {
    let Q = "",
      B = !1,
      G = !1;
    for (let Z = 0; Z < A.length; ++Z) {
      let Y = A[Z];
      switch (Y[0]) {
        case "#":
          Q += (Q === "" ? "" : G ? `

` : `
`) + (Y.substring(1) || " "), B = !0, G = !1;
          break;
        case "%":
          if (A[Z + 1]?.[0] !== "#") Z += 1;
          B = !1;
          break;
        default:
          if (!B) G = !0;
          B = !1
      }
    }
    return {
      comment: Q,
      afterEmptyLine: G
    }
  }
  class JFB {
    constructor(A = {}) {
      this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (Q, B, G, Z) => {
        let Y = uMA(Q);
        if (Z) this.warnings.push(new gMA.YAMLWarning(Y, B, G));
        else this.errors.push(new gMA.YAMLParseError(Y, B, G))
      }, this.directives = new p68.Directives({
        version: A.version || "1.2"
      }), this.options = A
    }
    decorate(A, Q) {
      let {
        comment: B,
        afterEmptyLine: G
      } = YFB(this.prelude);
      if (B) {
        let Z = A.contents;
        if (Q) A.comment = A.comment ? `${A.comment}
${B}` : B;
        else if (G || A.directives.docStart || !Z) A.commentBefore = B;
        else if (ZFB.isCollection(Z) && !Z.flow && Z.items.length > 0) {
          let Y = Z.items[0];
          if (ZFB.isPair(Y)) Y = Y.key;
          let J = Y.commentBefore;
          Y.commentBefore = J ? `${B}
${J}` : B
        } else {
          let Y = Z.commentBefore;
          Z.commentBefore = Y ? `${B}
${Y}` : B
        }
      }
      if (Q) Array.prototype.push.apply(A.errors, this.errors), Array.prototype.push.apply(A.warnings, this.warnings);
      else A.errors = this.errors, A.warnings = this.warnings;
      this.prelude = [], this.errors = [], this.warnings = []
    }
    streamInfo() {
      return {
        comment: YFB(this.prelude).comment,
        directives: this.directives,
        errors: this.errors,
        warnings: this.warnings
      }
    }* compose(A, Q = !1, B = -1) {
      for (let G of A) yield* this.next(G);
      yield* this.end(Q, B)
    }* next(A) {
      if (c68.env.LOG_STREAM) console.dir(A, {
        depth: null
      });
      switch (A.type) {
        case "directive":
          this.directives.add(A.source, (Q, B, G) => {
            let Z = uMA(A);
            Z[0] += Q, this.onError(Z, "BAD_DIRECTIVE", B, G)
          }), this.prelude.push(A.source), this.atDirectives = !0;
          break;
        case "document": {
          let Q = i68.composeDoc(this.options, this.directives, A, this.onError);
          if (this.atDirectives && !Q.directives.docStart) this.onError(A, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
          if (this.decorate(Q, !1), this.doc) yield this.doc;
          this.doc = Q, this.atDirectives = !1;
          break
        }
        case "byte-order-mark":
        case "space":
          break;
        case "comment":
        case "newline":
          this.prelude.push(A.source);
          break;
        case "error": {
          let Q = A.source ? `${A.message}: ${JSON.stringify(A.source)}` : A.message,
            B = new gMA.YAMLParseError(uMA(A), "UNEXPECTED_TOKEN", Q);
          if (this.atDirectives || !this.doc) this.errors.push(B);
          else this.doc.errors.push(B);
          break
        }
        case "doc-end": {
          if (!this.doc) {
            this.errors.push(new gMA.YAMLParseError(uMA(A), "UNEXPECTED_TOKEN", "Unexpected doc-end without preceding document"));
            break
          }
          this.doc.directives.docEnd = !0;
          let Q = n68.resolveEnd(A.end, A.offset + A.source.length, this.doc.options.strict, this.onError);
          if (this.decorate(this.doc, !0), Q.comment) {
            let B = this.doc.comment;
            this.doc.comment = B ? `${B}
${Q.comment}` : Q.comment
          }
          this.doc.range[2] = Q.offset;
          break
        }
        default:
          this.errors.push(new gMA.YAMLParseError(uMA(A), "UNEXPECTED_TOKEN", `Unsupported token ${A.type}`))
      }
    }* end(A = !1, Q = -1) {
      if (this.doc) this.decorate(this.doc, !0), yield this.doc, this.doc = null;
      else if (A) {
        let B = Object.assign({
            _directives: this.directives
          }, this.options),
          G = new l68.Document(void 0, B);
        if (this.atDirectives) this.onError(Q, "MISSING_CHAR", "Missing directives-end indicator line");
        G.range = [0, Q, Q], this.decorate(G, !1), yield G
      }
    }
  }
  a68.Composer = JFB
})
// @from(Ln 140578, Col 4)
DFB = U((G38) => {
  var r68 = do1(),
    s68 = po1(),
    t68 = fMA(),
    XFB = MMA();

  function e68(A, Q = !0, B) {
    if (A) {
      let G = (Z, Y, J) => {
        let X = typeof Z === "number" ? Z : Array.isArray(Z) ? Z[0] : Z.offset;
        if (B) B(X, Y, J);
        else throw new t68.YAMLParseError([X, X + 1], Y, J)
      };
      switch (A.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return s68.resolveFlowScalar(A, Q, G);
        case "block-scalar":
          return r68.resolveBlockScalar({
            options: {
              strict: Q
            }
          }, A, G)
      }
    }
    return null
  }

  function A38(A, Q) {
    let {
      implicitKey: B = !1,
      indent: G,
      inFlow: Z = !1,
      offset: Y = -1,
      type: J = "PLAIN"
    } = Q, X = XFB.stringifyString({
      type: J,
      value: A
    }, {
      implicitKey: B,
      indent: G > 0 ? " ".repeat(G) : "",
      inFlow: Z,
      options: {
        blockQuote: !0,
        lineWidth: -1
      }
    }), I = Q.end ?? [{
      type: "newline",
      offset: -1,
      indent: G,
      source: `
`
    }];
    switch (X[0]) {
      case "|":
      case ">": {
        let D = X.indexOf(`
`),
          W = X.substring(0, D),
          K = X.substring(D + 1) + `
`,
          V = [{
            type: "block-scalar-header",
            offset: Y,
            indent: G,
            source: W
          }];
        if (!IFB(V, I)) V.push({
          type: "newline",
          offset: -1,
          indent: G,
          source: `
`
        });
        return {
          type: "block-scalar",
          offset: Y,
          indent: G,
          props: V,
          source: K
        }
      }
      case '"':
        return {
          type: "double-quoted-scalar", offset: Y, indent: G, source: X, end: I
        };
      case "'":
        return {
          type: "single-quoted-scalar", offset: Y, indent: G, source: X, end: I
        };
      default:
        return {
          type: "scalar", offset: Y, indent: G, source: X, end: I
        }
    }
  }

  function Q38(A, Q, B = {}) {
    let {
      afterKey: G = !1,
      implicitKey: Z = !1,
      inFlow: Y = !1,
      type: J
    } = B, X = "indent" in A ? A.indent : null;
    if (G && typeof X === "number") X += 2;
    if (!J) switch (A.type) {
      case "single-quoted-scalar":
        J = "QUOTE_SINGLE";
        break;
      case "double-quoted-scalar":
        J = "QUOTE_DOUBLE";
        break;
      case "block-scalar": {
        let D = A.props[0];
        if (D.type !== "block-scalar-header") throw Error("Invalid block scalar header");
        J = D.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
        break
      }
      default:
        J = "PLAIN"
    }
    let I = XFB.stringifyString({
      type: J,
      value: Q
    }, {
      implicitKey: Z || X === null,
      indent: X !== null && X > 0 ? " ".repeat(X) : "",
      inFlow: Y,
      options: {
        blockQuote: !0,
        lineWidth: -1
      }
    });
    switch (I[0]) {
      case "|":
      case ">":
        B38(A, I);
        break;
      case '"':
        no1(A, I, "double-quoted-scalar");
        break;
      case "'":
        no1(A, I, "single-quoted-scalar");
        break;
      default:
        no1(A, I, "scalar")
    }
  }

  function B38(A, Q) {
    let B = Q.indexOf(`
`),
      G = Q.substring(0, B),
      Z = Q.substring(B + 1) + `
`;
    if (A.type === "block-scalar") {
      let Y = A.props[0];
      if (Y.type !== "block-scalar-header") throw Error("Invalid block scalar header");
      Y.source = G, A.source = Z
    } else {
      let {
        offset: Y
      } = A, J = "indent" in A ? A.indent : -1, X = [{
        type: "block-scalar-header",
        offset: Y,
        indent: J,
        source: G
      }];
      if (!IFB(X, "end" in A ? A.end : void 0)) X.push({
        type: "newline",
        offset: -1,
        indent: J,
        source: `
`
      });
      for (let I of Object.keys(A))
        if (I !== "type" && I !== "offset") delete A[I];
      Object.assign(A, {
        type: "block-scalar",
        indent: J,
        props: X,
        source: Z
      })
    }
  }

  function IFB(A, Q) {
    if (Q)
      for (let B of Q) switch (B.type) {
        case "space":
        case "comment":
          A.push(B);
          break;
        case "newline":
          return A.push(B), !0
      }
    return !1
  }

  function no1(A, Q, B) {
    switch (A.type) {
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        A.type = B, A.source = Q;
        break;
      case "block-scalar": {
        let G = A.props.slice(1),
          Z = Q.length;
        if (A.props[0].type === "block-scalar-header") Z -= A.props[0].source.length;
        for (let Y of G) Y.offset += Z;
        delete A.props, Object.assign(A, {
          type: B,
          source: Q,
          end: G
        });
        break
      }
      case "block-map":
      case "block-seq": {
        let Z = {
          type: "newline",
          offset: A.offset + Q.length,
          indent: A.indent,
          source: `
`
        };
        delete A.items, Object.assign(A, {
          type: B,
          source: Q,
          end: [Z]
        });
        break
      }
      default: {
        let G = "indent" in A ? A.indent : -1,
          Z = "end" in A && Array.isArray(A.end) ? A.end.filter((Y) => Y.type === "space" || Y.type === "comment" || Y.type === "newline") : [];
        for (let Y of Object.keys(A))
          if (Y !== "type" && Y !== "offset") delete A[Y];
        Object.assign(A, {
          type: B,
          indent: G,
          source: Q,
          end: Z
        })
      }
    }
  }
  G38.createScalarToken = A38;
  G38.resolveAsScalar = e68;
  G38.setScalarValue = Q38
})
// @from(Ln 140831, Col 4)
WFB = U((I38) => {
  var X38 = (A) => ("type" in A) ? D01(A) : I01(A);

  function D01(A) {
    switch (A.type) {
      case "block-scalar": {
        let Q = "";
        for (let B of A.props) Q += D01(B);
        return Q + A.source
      }
      case "block-map":
      case "block-seq": {
        let Q = "";
        for (let B of A.items) Q += I01(B);
        return Q
      }
      case "flow-collection": {
        let Q = A.start.source;
        for (let B of A.items) Q += I01(B);
        for (let B of A.end) Q += B.source;
        return Q
      }
      case "document": {
        let Q = I01(A);
        if (A.end)
          for (let B of A.end) Q += B.source;
        return Q
      }
      default: {
        let Q = A.source;
        if ("end" in A && A.end)
          for (let B of A.end) Q += B.source;
        return Q
      }
    }
  }

  function I01({
    start: A,
    key: Q,
    sep: B,
    value: G
  }) {
    let Z = "";
    for (let Y of A) Z += Y.source;
    if (Q) Z += D01(Q);
    if (B)
      for (let Y of B) Z += Y.source;
    if (G) Z += D01(G);
    return Z
  }
  I38.stringify = X38
})
// @from(Ln 140884, Col 4)
FFB = U((K38) => {
  var ao1 = Symbol("break visit"),
    W38 = Symbol("skip children"),
    KFB = Symbol("remove item");

  function sQA(A, Q) {
    if ("type" in A && A.type === "document") A = {
      start: A.start,
      value: A.value
    };
    VFB(Object.freeze([]), A, Q)
  }
  sQA.BREAK = ao1;
  sQA.SKIP = W38;
  sQA.REMOVE = KFB;
  sQA.itemAtPath = (A, Q) => {
    let B = A;
    for (let [G, Z] of Q) {
      let Y = B?.[G];
      if (Y && "items" in Y) B = Y.items[Z];
      else return
    }
    return B
  };
  sQA.parentCollection = (A, Q) => {
    let B = sQA.itemAtPath(A, Q.slice(0, -1)),
      G = Q[Q.length - 1][0],
      Z = B?.[G];
    if (Z && "items" in Z) return Z;
    throw Error("Parent collection not found")
  };

  function VFB(A, Q, B) {
    let G = B(Q, A);
    if (typeof G === "symbol") return G;
    for (let Z of ["key", "value"]) {
      let Y = Q[Z];
      if (Y && "items" in Y) {
        for (let J = 0; J < Y.items.length; ++J) {
          let X = VFB(Object.freeze(A.concat([
            [Z, J]
          ])), Y.items[J], B);
          if (typeof X === "number") J = X - 1;
          else if (X === ao1) return ao1;
          else if (X === KFB) Y.items.splice(J, 1), J -= 1
        }
        if (typeof G === "function" && Z === "key") G = G(Q, A)
      }
    }
    return typeof G === "function" ? G(Q, A) : G
  }
  K38.visit = sQA
})
// @from(Ln 140937, Col 4)
W01 = U((U38) => {
  var oo1 = DFB(),
    F38 = WFB(),
    H38 = FFB(),
    ro1 = "\uFEFF",
    so1 = "\x02",
    to1 = "\x18",
    eo1 = "\x1F",
    E38 = (A) => !!A && ("items" in A),
    z38 = (A) => !!A && (A.type === "scalar" || A.type === "single-quoted-scalar" || A.type === "double-quoted-scalar" || A.type === "block-scalar");

  function $38(A) {
    switch (A) {
      case ro1:
        return "<BOM>";
      case so1:
        return "<DOC>";
      case to1:
        return "<FLOW_END>";
      case eo1:
        return "<SCALAR>";
      default:
        return JSON.stringify(A)
    }
  }

  function C38(A) {
    switch (A) {
      case ro1:
        return "byte-order-mark";
      case so1:
        return "doc-mode";
      case to1:
        return "flow-error-end";
      case eo1:
        return "scalar";
      case "---":
        return "doc-start";
      case "...":
        return "doc-end";
      case "":
      case `
`:
      case `\r
`:
        return "newline";
      case "-":
        return "seq-item-ind";
      case "?":
        return "explicit-key-ind";
      case ":":
        return "map-value-ind";
      case "{":
        return "flow-map-start";
      case "}":
        return "flow-map-end";
      case "[":
        return "flow-seq-start";
      case "]":
        return "flow-seq-end";
      case ",":
        return "comma"
    }
    switch (A[0]) {
      case " ":
      case "\t":
        return "space";
      case "#":
        return "comment";
      case "%":
        return "directive-line";
      case "*":
        return "alias";
      case "&":
        return "anchor";
      case "!":
        return "tag";
      case "'":
        return "single-quoted-scalar";
      case '"':
        return "double-quoted-scalar";
      case "|":
      case ">":
        return "block-scalar-header"
    }
    return null
  }
  U38.createScalarToken = oo1.createScalarToken;
  U38.resolveAsScalar = oo1.resolveAsScalar;
  U38.setScalarValue = oo1.setScalarValue;
  U38.stringify = F38.stringify;
  U38.visit = H38.visit;
  U38.BOM = ro1;
  U38.DOCUMENT = so1;
  U38.FLOW_END = to1;
  U38.SCALAR = eo1;
  U38.isCollection = E38;
  U38.isScalar = z38;
  U38.prettyToken = $38;
  U38.tokenType = C38
})
// @from(Ln 141038, Col 4)
Qr1 = U((k38) => {
  var mMA = W01();

  function DP(A) {
    switch (A) {
      case void 0:
      case " ":
      case `
`:
      case "\r":
      case "\t":
        return !0;
      default:
        return !1
    }
  }
  var HFB = new Set("0123456789ABCDEFabcdef"),
    y38 = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"),
    K01 = new Set(",[]{}"),
    v38 = new Set(` ,[]{}
\r	`),
    Ar1 = (A) => !A || v38.has(A);
  class EFB {
    constructor() {
      this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0
    }* lex(A, Q = !1) {
      if (A) {
        if (typeof A !== "string") throw TypeError("source is not a string");
        this.buffer = this.buffer ? this.buffer + A : A, this.lineEndPos = null
      }
      this.atEnd = !Q;
      let B = this.next ?? "stream";
      while (B && (Q || this.hasChars(1))) B = yield* this.parseNext(B)
    }
    atLineEnd() {
      let A = this.pos,
        Q = this.buffer[A];
      while (Q === " " || Q === "\t") Q = this.buffer[++A];
      if (!Q || Q === "#" || Q === `
`) return !0;
      if (Q === "\r") return this.buffer[A + 1] === `
`;
      return !1
    }
    charAt(A) {
      return this.buffer[this.pos + A]
    }
    continueScalar(A) {
      let Q = this.buffer[A];
      if (this.indentNext > 0) {
        let B = 0;
        while (Q === " ") Q = this.buffer[++B + A];
        if (Q === "\r") {
          let G = this.buffer[B + A + 1];
          if (G === `
` || !G && !this.atEnd) return A + B + 1
        }
        return Q === `
` || B >= this.indentNext || !Q && !this.atEnd ? A + B : -1
      }
      if (Q === "-" || Q === ".") {
        let B = this.buffer.substr(A, 3);
        if ((B === "---" || B === "...") && DP(this.buffer[A + 3])) return -1
      }
      return A
    }
    getLine() {
      let A = this.lineEndPos;
      if (typeof A !== "number" || A !== -1 && A < this.pos) A = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = A;
      if (A === -1) return this.atEnd ? this.buffer.substring(this.pos) : null;
      if (this.buffer[A - 1] === "\r") A -= 1;
      return this.buffer.substring(this.pos, A)
    }
    hasChars(A) {
      return this.pos + A <= this.buffer.length
    }
    setNext(A) {
      return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = A, null
    }
    peek(A) {
      return this.buffer.substr(this.pos, A)
    }* parseNext(A) {
      switch (A) {
        case "stream":
          return yield* this.parseStream();
        case "line-start":
          return yield* this.parseLineStart();
        case "block-start":
          return yield* this.parseBlockStart();
        case "doc":
          return yield* this.parseDocument();
        case "flow":
          return yield* this.parseFlowCollection();
        case "quoted-scalar":
          return yield* this.parseQuotedScalar();
        case "block-scalar":
          return yield* this.parseBlockScalar();
        case "plain-scalar":
          return yield* this.parsePlainScalar()
      }
    }* parseStream() {
      let A = this.getLine();
      if (A === null) return this.setNext("stream");
      if (A[0] === mMA.BOM) yield* this.pushCount(1), A = A.substring(1);
      if (A[0] === "%") {
        let Q = A.length,
          B = A.indexOf("#");
        while (B !== -1) {
          let Z = A[B - 1];
          if (Z === " " || Z === "\t") {
            Q = B - 1;
            break
          } else B = A.indexOf("#", B + 1)
        }
        while (!0) {
          let Z = A[Q - 1];
          if (Z === " " || Z === "\t") Q -= 1;
          else break
        }
        let G = (yield* this.pushCount(Q)) + (yield* this.pushSpaces(!0));
        return yield* this.pushCount(A.length - G), this.pushNewline(), "stream"
      }
      if (this.atLineEnd()) {
        let Q = yield* this.pushSpaces(!0);
        return yield* this.pushCount(A.length - Q), yield* this.pushNewline(), "stream"
      }
      return yield mMA.DOCUMENT, yield* this.parseLineStart()
    }* parseLineStart() {
      let A = this.charAt(0);
      if (!A && !this.atEnd) return this.setNext("line-start");
      if (A === "-" || A === ".") {
        if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
        let Q = this.peek(3);
        if ((Q === "---" || Q === "...") && DP(this.charAt(3))) return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, Q === "---" ? "doc" : "stream"
      }
      if (this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !DP(this.charAt(1))) this.indentNext = this.indentValue;
      return yield* this.parseBlockStart()
    }* parseBlockStart() {
      let [A, Q] = this.peek(2);
      if (!Q && !this.atEnd) return this.setNext("block-start");
      if ((A === "-" || A === "?" || A === ":") && DP(Q)) {
        let B = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
        return this.indentNext = this.indentValue + 1, this.indentValue += B, yield* this.parseBlockStart()
      }
      return "doc"
    }* parseDocument() {
      yield* this.pushSpaces(!0);
      let A = this.getLine();
      if (A === null) return this.setNext("doc");
      let Q = yield* this.pushIndicators();
      switch (A[Q]) {
        case "#":
          yield* this.pushCount(A.length - Q);
        case void 0:
          return yield* this.pushNewline(), yield* this.parseLineStart();
        case "{":
        case "[":
          return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
        case "}":
        case "]":
          return yield* this.pushCount(1), "doc";
        case "*":
          return yield* this.pushUntil(Ar1), "doc";
        case '"':
        case "'":
          return yield* this.parseQuotedScalar();
        case "|":
        case ">":
          return Q += yield* this.parseBlockScalarHeader(), Q += yield* this.pushSpaces(!0), yield* this.pushCount(A.length - Q), yield* this.pushNewline(), yield* this.parseBlockScalar();
        default:
          return yield* this.parsePlainScalar()
      }
    }* parseFlowCollection() {
      let A, Q, B = -1;
      do {
        if (A = yield* this.pushNewline(), A > 0) Q = yield* this.pushSpaces(!1), this.indentValue = B = Q;
        else Q = 0;
        Q += yield* this.pushSpaces(!0)
      } while (A + Q > 0);
      let G = this.getLine();
      if (G === null) return this.setNext("flow");
      if (B !== -1 && B < this.indentNext && G[0] !== "#" || B === 0 && (G.startsWith("---") || G.startsWith("...")) && DP(G[3])) {
        if (!(B === this.indentNext - 1 && this.flowLevel === 1 && (G[0] === "]" || G[0] === "}"))) return this.flowLevel = 0, yield mMA.FLOW_END, yield* this.parseLineStart()
      }
      let Z = 0;
      while (G[Z] === ",") Z += yield* this.pushCount(1), Z += yield* this.pushSpaces(!0), this.flowKey = !1;
      switch (Z += yield* this.pushIndicators(), G[Z]) {
        case void 0:
          return "flow";
        case "#":
          return yield* this.pushCount(G.length - Z), "flow";
        case "{":
        case "[":
          return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
        case "}":
        case "]":
          return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
        case "*":
          return yield* this.pushUntil(Ar1), "flow";
        case '"':
        case "'":
          return this.flowKey = !0, yield* this.parseQuotedScalar();
        case ":": {
          let Y = this.charAt(1);
          if (this.flowKey || DP(Y) || Y === ",") return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow"
        }
        default:
          return this.flowKey = !1, yield* this.parsePlainScalar()
      }
    }* parseQuotedScalar() {
      let A = this.charAt(0),
        Q = this.buffer.indexOf(A, this.pos + 1);
      if (A === "'")
        while (Q !== -1 && this.buffer[Q + 1] === "'") Q = this.buffer.indexOf("'", Q + 2);
      else
        while (Q !== -1) {
          let Z = 0;
          while (this.buffer[Q - 1 - Z] === "\\") Z += 1;
          if (Z % 2 === 0) break;
          Q = this.buffer.indexOf('"', Q + 1)
        }
      let B = this.buffer.substring(0, Q),
        G = B.indexOf(`
`, this.pos);
      if (G !== -1) {
        while (G !== -1) {
          let Z = this.continueScalar(G + 1);
          if (Z === -1) break;
          G = B.indexOf(`
`, Z)
        }
        if (G !== -1) Q = G - (B[G - 1] === "\r" ? 2 : 1)
      }
      if (Q === -1) {
        if (!this.atEnd) return this.setNext("quoted-scalar");
        Q = this.buffer.length
      }
      return yield* this.pushToIndex(Q + 1, !1), this.flowLevel ? "flow" : "doc"
    }* parseBlockScalarHeader() {
      this.blockScalarIndent = -1, this.blockScalarKeep = !1;
      let A = this.pos;
      while (!0) {
        let Q = this.buffer[++A];
        if (Q === "+") this.blockScalarKeep = !0;
        else if (Q > "0" && Q <= "9") this.blockScalarIndent = Number(Q) - 1;
        else if (Q !== "-") break
      }
      return yield* this.pushUntil((Q) => DP(Q) || Q === "#")
    }* parseBlockScalar() {
      let A = this.pos - 1,
        Q = 0,
        B;
      A: for (let Z = this.pos; B = this.buffer[Z]; ++Z) switch (B) {
        case " ":
          Q += 1;
          break;
        case `
`:
          A = Z, Q = 0;
          break;
        case "\r": {
          let Y = this.buffer[Z + 1];
          if (!Y && !this.atEnd) return this.setNext("block-scalar");
          if (Y === `
`) break
        }
        default:
          break A
      }
      if (!B && !this.atEnd) return this.setNext("block-scalar");
      if (Q >= this.indentNext) {
        if (this.blockScalarIndent === -1) this.indentNext = Q;
        else this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
        do {
          let Z = this.continueScalar(A + 1);
          if (Z === -1) break;
          A = this.buffer.indexOf(`
`, Z)
        } while (A !== -1);
        if (A === -1) {
          if (!this.atEnd) return this.setNext("block-scalar");
          A = this.buffer.length
        }
      }
      let G = A + 1;
      B = this.buffer[G];
      while (B === " ") B = this.buffer[++G];
      if (B === "\t") {
        while (B === "\t" || B === " " || B === "\r" || B === `
`) B = this.buffer[++G];
        A = G - 1
      } else if (!this.blockScalarKeep)
        do {
          let Z = A - 1,
            Y = this.buffer[Z];
          if (Y === "\r") Y = this.buffer[--Z];
          let J = Z;
          while (Y === " ") Y = this.buffer[--Z];
          if (Y === `
` && Z >= this.pos && Z + 1 + Q > J) A = Z;
          else break
        } while (!0);
      return yield mMA.SCALAR, yield* this.pushToIndex(A + 1, !0), yield* this.parseLineStart()
    }* parsePlainScalar() {
      let A = this.flowLevel > 0,
        Q = this.pos - 1,
        B = this.pos - 1,
        G;
      while (G = this.buffer[++B])
        if (G === ":") {
          let Z = this.buffer[B + 1];
          if (DP(Z) || A && K01.has(Z)) break;
          Q = B
        } else if (DP(G)) {
        let Z = this.buffer[B + 1];
        if (G === "\r")
          if (Z === `
`) B += 1, G = `
`, Z = this.buffer[B + 1];
          else Q = B;
        if (Z === "#" || A && K01.has(Z)) break;
        if (G === `
`) {
          let Y = this.continueScalar(B + 1);
          if (Y === -1) break;
          B = Math.max(B, Y - 2)
        }
      } else {
        if (A && K01.has(G)) break;
        Q = B
      }
      if (!G && !this.atEnd) return this.setNext("plain-scalar");
      return yield mMA.SCALAR, yield* this.pushToIndex(Q + 1, !0), A ? "flow" : "doc"
    }* pushCount(A) {
      if (A > 0) return yield this.buffer.substr(this.pos, A), this.pos += A, A;
      return 0
    }* pushToIndex(A, Q) {
      let B = this.buffer.slice(this.pos, A);
      if (B) return yield B, this.pos += B.length, B.length;
      else if (Q) yield "";
      return 0
    }* pushIndicators() {
      switch (this.charAt(0)) {
        case "!":
          return (yield* this.pushTag()) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
        case "&":
          return (yield* this.pushUntil(Ar1)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
        case "-":
        case "?":
        case ":": {
          let A = this.flowLevel > 0,
            Q = this.charAt(1);
          if (DP(Q) || A && K01.has(Q)) {
            if (!A) this.indentNext = this.indentValue + 1;
            else if (this.flowKey) this.flowKey = !1;
            return (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators())
          }
        }
      }
      return 0
    }* pushTag() {
      if (this.charAt(1) === "<") {
        let A = this.pos + 2,
          Q = this.buffer[A];
        while (!DP(Q) && Q !== ">") Q = this.buffer[++A];
        return yield* this.pushToIndex(Q === ">" ? A + 1 : A, !1)
      } else {
        let A = this.pos + 1,
          Q = this.buffer[A];
        while (Q)
          if (y38.has(Q)) Q = this.buffer[++A];
          else if (Q === "%" && HFB.has(this.buffer[A + 1]) && HFB.has(this.buffer[A + 2])) Q = this.buffer[A += 3];
        else break;
        return yield* this.pushToIndex(A, !1)
      }
    }* pushNewline() {
      let A = this.buffer[this.pos];
      if (A === `
`) return yield* this.pushCount(1);
      else if (A === "\r" && this.charAt(1) === `
`) return yield* this.pushCount(2);
      else return 0
    }* pushSpaces(A) {
      let Q = this.pos - 1,
        B;
      do B = this.buffer[++Q]; while (B === " " || A && B === "\t");
      let G = Q - this.pos;
      if (G > 0) yield this.buffer.substr(this.pos, G), this.pos = Q;
      return G
    }* pushUntil(A) {
      let Q = this.pos,
        B = this.buffer[Q];
      while (!A(B)) B = this.buffer[++Q];
      return yield* this.pushToIndex(Q, !1)
    }
  }
  k38.Lexer = EFB
})
// @from(Ln 141437, Col 4)
Br1 = U((f38) => {
  class zFB {
    constructor() {
      this.lineStarts = [], this.addNewLine = (A) => this.lineStarts.push(A), this.linePos = (A) => {
        let Q = 0,
          B = this.lineStarts.length;
        while (Q < B) {
          let Z = Q + B >> 1;
          if (this.lineStarts[Z] < A) Q = Z + 1;
          else B = Z
        }
        if (this.lineStarts[Q] === A) return {
          line: Q + 1,
          col: 1
        };
        if (Q === 0) return {
          line: 0,
          col: A
        };
        let G = this.lineStarts[Q - 1];
        return {
          line: Q,
          col: A - G + 1
        }
      }
    }
  }
  f38.LineCounter = zFB
})