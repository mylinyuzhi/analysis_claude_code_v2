
// @from(Start 79, End 98)
gN9 = Object.create
// @from(Start 195, End 232)
dN9 = Object.prototype.hasOwnProperty
// @from(Start 238, End 519)
BA = (A, Q, B) => {
  B = A != null ? gN9(uN9(A)) : {};
  let G = Q || !A || !A.__esModule ? AX1(B, "default", {
    value: A,
    enumerable: !0
  }) : B;
  for (let Z of mN9(A))
    if (!dN9.call(G, Z)) AX1(G, Z, {
      get: () => A[Z],
      enumerable: !0
    });
  return G
}
// @from(Start 525, End 600)
z = (A, Q) => () => (Q || A((Q = {
  exports: {}
}).exports, Q), Q.exports)
// @from(Start 606, End 748)
oG = (A, Q) => {
  for (var B in Q) AX1(A, B, {
    get: Q[B],
    enumerable: !0,
    configurable: !0,
    set: (G) => Q[B] = () => G
  })
}
// @from(Start 754, End 798)
L = (A, Q) => () => (A && (Q = A(A = 0)), Q)
// @from(Start 804, End 829)
UA = cN9(import.meta.url)
// @from(Start 835, End 838)
pN9
// @from(Start 840, End 843)
T_A
// @from(Start 849, End 960)
QX1 = L(() => {
  pN9 = typeof global == "object" && global && global.Object === Object && global, T_A = pN9
})
// @from(Start 966, End 969)
lN9
// @from(Start 971, End 974)
iN9
// @from(Start 976, End 978)
zX
// @from(Start 984, End 1141)
CR = L(() => {
  QX1();
  lN9 = typeof self == "object" && self && self.Object === Object && self, iN9 = T_A || lN9 || Function("return this")(), zX = iN9
})
// @from(Start 1147, End 1150)
nN9
// @from(Start 1152, End 1154)
EF
// @from(Start 1160, End 1213)
ws = L(() => {
  CR();
  nN9 = zX.Symbol, EF = nN9
})
// @from(Start 1216, End 1430)
function rN9(A) {
  var Q = aN9.call(A, IFA),
    B = A[IFA];
  try {
    A[IFA] = void 0;
    var G = !0
  } catch (I) {}
  var Z = sN9.call(A);
  if (G)
    if (Q) A[IFA] = B;
    else delete A[IFA];
  return Z
}
// @from(Start 1435, End 1438)
mD0
// @from(Start 1440, End 1443)
aN9
// @from(Start 1445, End 1448)
sN9
// @from(Start 1450, End 1453)
IFA
// @from(Start 1455, End 1458)
dD0
// @from(Start 1464, End 1610)
cD0 = L(() => {
  ws();
  mD0 = Object.prototype, aN9 = mD0.hasOwnProperty, sN9 = mD0.toString, IFA = EF ? EF.toStringTag : void 0;
  dD0 = rN9
})
// @from(Start 1613, End 1653)
function eN9(A) {
  return tN9.call(A)
}
// @from(Start 1658, End 1661)
oN9
// @from(Start 1663, End 1666)
tN9
// @from(Start 1668, End 1671)
pD0
// @from(Start 1677, End 1753)
lD0 = L(() => {
  oN9 = Object.prototype, tN9 = oN9.toString;
  pD0 = eN9
})
// @from(Start 1756, End 1876)
function BL9(A) {
  if (A == null) return A === void 0 ? QL9 : AL9;
  return iD0 && iD0 in Object(A) ? dD0(A) : pD0(A)
}
// @from(Start 1881, End 1902)
AL9 = "[object Null]"
// @from(Start 1906, End 1932)
QL9 = "[object Undefined]"
// @from(Start 1936, End 1939)
iD0
// @from(Start 1941, End 1943)
s$
// @from(Start 1949, End 2041)
qs = L(() => {
  ws();
  cD0();
  lD0();
  iD0 = EF ? EF.toStringTag : void 0;
  s$ = BL9
})
// @from(Start 2044, End 2140)
function GL9(A) {
  var Q = typeof A;
  return A != null && (Q == "object" || Q == "function")
}
// @from(Start 2145, End 2147)
SY
// @from(Start 2153, End 2181)
bN = L(() => {
  SY = GL9
})
// @from(Start 2184, End 2299)
function WL9(A) {
  if (!SY(A)) return !1;
  var Q = s$(A);
  return Q == IL9 || Q == YL9 || Q == ZL9 || Q == JL9
}
// @from(Start 2304, End 2334)
ZL9 = "[object AsyncFunction]"
// @from(Start 2338, End 2363)
IL9 = "[object Function]"
// @from(Start 2367, End 2401)
YL9 = "[object GeneratorFunction]"
// @from(Start 2405, End 2427)
JL9 = "[object Proxy]"
// @from(Start 2431, End 2434)
yBA
// @from(Start 2440, End 2486)
P_A = L(() => {
  qs();
  bN();
  yBA = WL9
})
// @from(Start 2492, End 2495)
XL9
// @from(Start 2497, End 2500)
j_A
// @from(Start 2506, End 2576)
nD0 = L(() => {
  CR();
  XL9 = zX["__core-js_shared__"], j_A = XL9
})
// @from(Start 2579, End 2625)
function VL9(A) {
  return !!aD0 && aD0 in A
}
// @from(Start 2630, End 2633)
aD0
// @from(Start 2635, End 2638)
sD0
// @from(Start 2644, End 2823)
rD0 = L(() => {
  nD0();
  aD0 = function() {
    var A = /[^.]+$/.exec(j_A && j_A.keys && j_A.keys.IE_PROTO || "");
    return A ? "Symbol(src)_1." + A : ""
  }();
  sD0 = VL9
})
// @from(Start 2826, End 2983)
function DL9(A) {
  if (A != null) {
    try {
      return KL9.call(A)
    } catch (Q) {}
    try {
      return A + ""
    } catch (Q) {}
  }
  return ""
}
// @from(Start 2988, End 2991)
FL9
// @from(Start 2993, End 2996)
KL9
// @from(Start 2998, End 3000)
ax
// @from(Start 3006, End 3083)
BX1 = L(() => {
  FL9 = Function.prototype, KL9 = FL9.toString;
  ax = DL9
})
// @from(Start 3086, End 3193)
function qL9(A) {
  if (!SY(A) || sD0(A)) return !1;
  var Q = yBA(A) ? wL9 : CL9;
  return Q.test(ax(A))
}
// @from(Start 3198, End 3201)
HL9
// @from(Start 3203, End 3206)
CL9
// @from(Start 3208, End 3211)
EL9
// @from(Start 3213, End 3216)
zL9
// @from(Start 3218, End 3221)
UL9
// @from(Start 3223, End 3226)
$L9
// @from(Start 3228, End 3231)
wL9
// @from(Start 3233, End 3236)
oD0
// @from(Start 3242, End 3608)
tD0 = L(() => {
  P_A();
  rD0();
  bN();
  BX1();
  HL9 = /[\\^$.*+?()[\]{}|]/g, CL9 = /^\[object .+?Constructor\]$/, EL9 = Function.prototype, zL9 = Object.prototype, UL9 = EL9.toString, $L9 = zL9.hasOwnProperty, wL9 = RegExp("^" + UL9.call($L9).replace(HL9, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  oD0 = qL9
})
// @from(Start 3611, End 3668)
function NL9(A, Q) {
  return A == null ? void 0 : A[Q]
}
// @from(Start 3673, End 3676)
eD0
// @from(Start 3682, End 3712)
AH0 = L(() => {
  eD0 = NL9
})
// @from(Start 3715, End 3787)
function LL9(A, Q) {
  var B = eD0(A, Q);
  return oD0(B) ? B : void 0
}
// @from(Start 3792, End 3794)
fz
// @from(Start 3800, End 3846)
du = L(() => {
  tD0();
  AH0();
  fz = LL9
})
// @from(Start 3852, End 3855)
ML9
// @from(Start 3857, End 3859)
sx
// @from(Start 3865, End 3930)
YFA = L(() => {
  du();
  ML9 = fz(Object, "create"), sx = ML9
})
// @from(Start 3933, End 4003)
function OL9() {
  this.__data__ = sx ? sx(null) : {}, this.size = 0
}
// @from(Start 4008, End 4011)
QH0
// @from(Start 4017, End 4056)
BH0 = L(() => {
  YFA();
  QH0 = OL9
})
// @from(Start 4059, End 4163)
function RL9(A) {
  var Q = this.has(A) && delete this.__data__[A];
  return this.size -= Q ? 1 : 0, Q
}
// @from(Start 4168, End 4171)
GH0
// @from(Start 4177, End 4207)
ZH0 = L(() => {
  GH0 = RL9
})
// @from(Start 4210, End 4362)
function SL9(A) {
  var Q = this.__data__;
  if (sx) {
    var B = Q[A];
    return B === TL9 ? void 0 : B
  }
  return jL9.call(Q, A) ? Q[A] : void 0
}
// @from(Start 4367, End 4400)
TL9 = "__lodash_hash_undefined__"
// @from(Start 4404, End 4407)
PL9
// @from(Start 4409, End 4412)
jL9
// @from(Start 4414, End 4417)
IH0
// @from(Start 4423, End 4514)
YH0 = L(() => {
  YFA();
  PL9 = Object.prototype, jL9 = PL9.hasOwnProperty;
  IH0 = SL9
})
// @from(Start 4517, End 4608)
function yL9(A) {
  var Q = this.__data__;
  return sx ? Q[A] !== void 0 : kL9.call(Q, A)
}
// @from(Start 4613, End 4616)
_L9
// @from(Start 4618, End 4621)
kL9
// @from(Start 4623, End 4626)
JH0
// @from(Start 4632, End 4723)
WH0 = L(() => {
  YFA();
  _L9 = Object.prototype, kL9 = _L9.hasOwnProperty;
  JH0 = yL9
})
// @from(Start 4726, End 4858)
function vL9(A, Q) {
  var B = this.__data__;
  return this.size += this.has(A) ? 0 : 1, B[A] = sx && Q === void 0 ? xL9 : Q, this
}
// @from(Start 4863, End 4896)
xL9 = "__lodash_hash_undefined__"
// @from(Start 4900, End 4903)
XH0
// @from(Start 4909, End 4948)
VH0 = L(() => {
  YFA();
  XH0 = vL9
})
// @from(Start 4951, End 5101)
function xBA(A) {
  var Q = -1,
    B = A == null ? 0 : A.length;
  this.clear();
  while (++Q < B) {
    var G = A[Q];
    this.set(G[0], G[1])
  }
}
// @from(Start 5106, End 5109)
GX1
// @from(Start 5115, End 5330)
FH0 = L(() => {
  BH0();
  ZH0();
  YH0();
  WH0();
  VH0();
  xBA.prototype.clear = QH0;
  xBA.prototype.delete = GH0;
  xBA.prototype.get = IH0;
  xBA.prototype.has = JH0;
  xBA.prototype.set = XH0;
  GX1 = xBA
})
// @from(Start 5333, End 5387)
function bL9() {
  this.__data__ = [], this.size = 0
}
// @from(Start 5392, End 5395)
KH0
// @from(Start 5401, End 5431)
DH0 = L(() => {
  KH0 = bL9
})
// @from(Start 5434, End 5495)
function fL9(A, Q) {
  return A === Q || A !== A && Q !== Q
}
// @from(Start 5500, End 5502)
jj
// @from(Start 5508, End 5537)
vBA = L(() => {
  jj = fL9
})
// @from(Start 5540, End 5642)
function hL9(A, Q) {
  var B = A.length;
  while (B--)
    if (jj(A[B][0], Q)) return B;
  return -1
}
// @from(Start 5647, End 5649)
cu
// @from(Start 5655, End 5693)
JFA = L(() => {
  vBA();
  cu = hL9
})
// @from(Start 5696, End 5880)
function mL9(A) {
  var Q = this.__data__,
    B = cu(Q, A);
  if (B < 0) return !1;
  var G = Q.length - 1;
  if (B == G) Q.pop();
  else uL9.call(Q, B, 1);
  return --this.size, !0
}
// @from(Start 5885, End 5888)
gL9
// @from(Start 5890, End 5893)
uL9
// @from(Start 5895, End 5898)
HH0
// @from(Start 5904, End 5986)
CH0 = L(() => {
  JFA();
  gL9 = Array.prototype, uL9 = gL9.splice;
  HH0 = mL9
})
// @from(Start 5989, End 6085)
function dL9(A) {
  var Q = this.__data__,
    B = cu(Q, A);
  return B < 0 ? void 0 : Q[B][1]
}
// @from(Start 6090, End 6093)
EH0
// @from(Start 6099, End 6138)
zH0 = L(() => {
  JFA();
  EH0 = dL9
})
// @from(Start 6141, End 6195)
function cL9(A) {
  return cu(this.__data__, A) > -1
}
// @from(Start 6200, End 6203)
UH0
// @from(Start 6209, End 6248)
$H0 = L(() => {
  JFA();
  UH0 = cL9
})
// @from(Start 6251, End 6392)
function pL9(A, Q) {
  var B = this.__data__,
    G = cu(B, A);
  if (G < 0) ++this.size, B.push([A, Q]);
  else B[G][1] = Q;
  return this
}
// @from(Start 6397, End 6400)
wH0
// @from(Start 6406, End 6445)
qH0 = L(() => {
  JFA();
  wH0 = pL9
})
// @from(Start 6448, End 6598)
function bBA(A) {
  var Q = -1,
    B = A == null ? 0 : A.length;
  this.clear();
  while (++Q < B) {
    var G = A[Q];
    this.set(G[0], G[1])
  }
}
// @from(Start 6603, End 6605)
pu
// @from(Start 6611, End 6825)
WFA = L(() => {
  DH0();
  CH0();
  zH0();
  $H0();
  qH0();
  bBA.prototype.clear = KH0;
  bBA.prototype.delete = HH0;
  bBA.prototype.get = EH0;
  bBA.prototype.has = UH0;
  bBA.prototype.set = wH0;
  pu = bBA
})
// @from(Start 6831, End 6834)
lL9
// @from(Start 6836, End 6838)
lu
// @from(Start 6844, End 6910)
S_A = L(() => {
  du();
  CR();
  lL9 = fz(zX, "Map"), lu = lL9
})
// @from(Start 6913, End 7033)
function iL9() {
  this.size = 0, this.__data__ = {
    hash: new GX1,
    map: new(lu || pu),
    string: new GX1
  }
}
// @from(Start 7038, End 7041)
NH0
// @from(Start 7047, End 7104)
LH0 = L(() => {
  FH0();
  WFA();
  S_A();
  NH0 = iL9
})
// @from(Start 7107, End 7254)
function nL9(A) {
  var Q = typeof A;
  return Q == "string" || Q == "number" || Q == "symbol" || Q == "boolean" ? A !== "__proto__" : A === null
}
// @from(Start 7259, End 7262)
MH0
// @from(Start 7268, End 7298)
OH0 = L(() => {
  MH0 = nL9
})
// @from(Start 7301, End 7415)
function aL9(A, Q) {
  var B = A.__data__;
  return MH0(Q) ? B[typeof Q == "string" ? "string" : "hash"] : B.map
}
// @from(Start 7420, End 7422)
iu
// @from(Start 7428, End 7466)
XFA = L(() => {
  OH0();
  iu = aL9
})
// @from(Start 7469, End 7556)
function sL9(A) {
  var Q = iu(this, A).delete(A);
  return this.size -= Q ? 1 : 0, Q
}
// @from(Start 7561, End 7564)
RH0
// @from(Start 7570, End 7609)
TH0 = L(() => {
  XFA();
  RH0 = sL9
})
// @from(Start 7612, End 7659)
function rL9(A) {
  return iu(this, A).get(A)
}
// @from(Start 7664, End 7667)
PH0
// @from(Start 7673, End 7712)
jH0 = L(() => {
  XFA();
  PH0 = rL9
})
// @from(Start 7715, End 7762)
function oL9(A) {
  return iu(this, A).has(A)
}
// @from(Start 7767, End 7770)
SH0
// @from(Start 7776, End 7815)
_H0 = L(() => {
  XFA();
  SH0 = oL9
})
// @from(Start 7818, End 7940)
function tL9(A, Q) {
  var B = iu(this, A),
    G = B.size;
  return B.set(A, Q), this.size += B.size == G ? 0 : 1, this
}
// @from(Start 7945, End 7948)
kH0
// @from(Start 7954, End 7993)
yH0 = L(() => {
  XFA();
  kH0 = tL9
})
// @from(Start 7996, End 8146)
function fBA(A) {
  var Q = -1,
    B = A == null ? 0 : A.length;
  this.clear();
  while (++Q < B) {
    var G = A[Q];
    this.set(G[0], G[1])
  }
}
// @from(Start 8151, End 8153)
Ns
// @from(Start 8159, End 8373)
__A = L(() => {
  LH0();
  TH0();
  jH0();
  _H0();
  yH0();
  fBA.prototype.clear = NH0;
  fBA.prototype.delete = RH0;
  fBA.prototype.get = PH0;
  fBA.prototype.has = SH0;
  fBA.prototype.set = kH0;
  Ns = fBA
})
// @from(Start 8376, End 8747)
function ZX1(A, Q) {
  if (typeof A != "function" || Q != null && typeof Q != "function") throw TypeError(eL9);
  var B = function() {
    var G = arguments,
      Z = Q ? Q.apply(this, G) : G[0],
      I = B.cache;
    if (I.has(Z)) return I.get(Z);
    var Y = A.apply(this, G);
    return B.cache = I.set(Z, Y) || I, Y
  };
  return B.cache = new(ZX1.Cache || Ns), B
}
// @from(Start 8752, End 8779)
eL9 = "Expected a function"
// @from(Start 8783, End 8785)
s1
// @from(Start 8791, End 8846)
l2 = L(() => {
  __A();
  ZX1.Cache = Ns;
  s1 = ZX1
})
// @from(Start 8849, End 8957)
function L9(A) {
  for (let Q = 0; Q < A.length; Q += 2000) process.stdout.write(A.substring(Q, Q + 2000))
}
// @from(Start 8959, End 9067)
function Sj(A) {
  for (let Q = 0; Q < A.length; Q += 2000) process.stderr.write(A.substring(Q, Q + 2000))
}
// @from(Start 9069, End 9685)
function AM9(A) {
  let Q = [],
    B = A.match(/^MCP server ["']([^"']+)["']/);
  if (B && B[1]) Q.push("mcp"), Q.push(B[1].toLowerCase());
  else {
    let I = A.match(/^([^:[]+):/);
    if (I && I[1]) Q.push(I[1].trim().toLowerCase())
  }
  let G = A.match(/^\[([^\]]+)]/);
  if (G && G[1]) Q.push(G[1].trim().toLowerCase());
  if (A.toLowerCase().includes("statsig event:")) Q.push("statsig");
  let Z = A.match(/:\s*([^:]+?)(?:\s+(?:type|mode|status|event))?:/);
  if (Z && Z[1]) {
    let I = Z[1].trim().toLowerCase();
    if (I.length < 30 && !I.includes(" ")) Q.push(I)
  }
  return Array.from(new Set(Q))
}
// @from(Start 9687, End 9881)
function QM9(A, Q) {
  if (!Q) return !0;
  if (A.length === 0) return !1;
  if (Q.isExclusive) return !A.some((B) => Q.exclude.includes(B));
  else return A.some((B) => Q.include.includes(B))
}
// @from(Start 9883, End 9963)
function vH0(A, Q) {
  if (!Q) return !0;
  let B = AM9(A);
  return QM9(B, Q)
}
// @from(Start 9968, End 9971)
xH0
// @from(Start 9977, End 10447)
bH0 = L(() => {
  l2();
  xH0 = s1((A) => {
    if (!A || A.trim() === "") return null;
    let Q = A.split(",").map((I) => I.trim()).filter(Boolean);
    if (Q.length === 0) return null;
    let B = Q.some((I) => I.startsWith("!")),
      G = Q.some((I) => !I.startsWith("!"));
    if (B && G) return null;
    let Z = Q.map((I) => I.replace(/^!/, "").toLowerCase());
    return {
      include: B ? [] : Z,
      exclude: B ? Z : [],
      isExclusive: B
    }
  })
})
// @from(Start 10536, End 10822)
function fK(A, Q) {
  if (!A.existsSync(Q)) return {
    resolvedPath: Q,
    isSymlink: !1
  };
  try {
    let B = A.realpathSync(Q);
    return {
      resolvedPath: B,
      isSymlink: B !== Q
    }
  } catch (B) {
    return {
      resolvedPath: Q,
      isSymlink: !1
    }
  }
}
// @from(Start 10824, End 10987)
function Ls(A) {
  let Q = [],
    B = RA();
  Q.push(A);
  let {
    resolvedPath: G,
    isSymlink: Z
  } = fK(B, A);
  if (Z && G !== A) Q.push(G);
  return Q
}
// @from(Start 10989, End 11019)
function RA() {
  return IM9
}
// @from(Start 11020, End 11498)
async function* fH0(A) {
  let B = await GM9(A, "r");
  try {
    let Z = (await B.stat()).size,
      I = "",
      Y = Buffer.alloc(4096);
    while (Z > 0) {
      let J = Math.min(4096, Z);
      Z -= J, await B.read(Y, 0, J, Z);
      let X = (Y.toString("utf8", 0, J) + I).split(`
`);
      I = X[0] || "";
      for (let V = X.length - 1; V >= 1; V--) {
        let F = X[V];
        if (F) yield F
      }
    }
    if (I) yield I
  } finally {
    await B.close()
  }
}
// @from(Start 11503, End 11506)
ZM9
// @from(Start 11508, End 11511)
IM9
// @from(Start 11517, End 13996)
AQ = L(() => {
  ZM9 = {
    cwd() {
      return process.cwd()
    },
    existsSync(A) {
      return v9.existsSync(A)
    },
    async stat(A) {
      return BM9(A)
    },
    statSync(A) {
      return v9.statSync(A)
    },
    readFileSync(A, Q) {
      return v9.readFileSync(A, {
        encoding: Q.encoding
      })
    },
    readFileBytesSync(A) {
      return v9.readFileSync(A)
    },
    readSync(A, Q) {
      let B = void 0;
      try {
        B = v9.openSync(A, "r");
        let G = Buffer.alloc(Q.length),
          Z = v9.readSync(B, G, 0, Q.length, 0);
        return {
          buffer: G,
          bytesRead: Z
        }
      } finally {
        if (B) v9.closeSync(B)
      }
    },
    writeFileSync(A, Q, B) {
      let G = v9.existsSync(A);
      if (!B.flush) {
        let I = {
          encoding: B.encoding
        };
        if (!G) I.mode = B.mode ?? 384;
        else if (B.mode !== void 0) I.mode = B.mode;
        v9.writeFileSync(A, Q, I);
        return
      }
      let Z;
      try {
        let I = !G ? B.mode ?? 384 : B.mode;
        Z = v9.openSync(A, "w", I), v9.writeFileSync(Z, Q, {
          encoding: B.encoding
        }), v9.fsyncSync(Z)
      } finally {
        if (Z) v9.closeSync(Z)
      }
    },
    appendFileSync(A, Q, B) {
      if (!v9.existsSync(A)) {
        let G = B?.mode ?? 384,
          Z = v9.openSync(A, "a", G);
        try {
          v9.appendFileSync(Z, Q)
        } finally {
          v9.closeSync(Z)
        }
      } else v9.appendFileSync(A, Q)
    },
    copyFileSync(A, Q) {
      v9.copyFileSync(A, Q)
    },
    unlinkSync(A) {
      v9.unlinkSync(A)
    },
    renameSync(A, Q) {
      v9.renameSync(A, Q)
    },
    linkSync(A, Q) {
      v9.linkSync(A, Q)
    },
    symlinkSync(A, Q) {
      v9.symlinkSync(A, Q)
    },
    readlinkSync(A) {
      return v9.readlinkSync(A)
    },
    realpathSync(A) {
      return v9.realpathSync(A)
    },
    mkdirSync(A) {
      if (!v9.existsSync(A)) v9.mkdirSync(A, {
        recursive: !0,
        mode: 448
      })
    },
    readdirSync(A) {
      return v9.readdirSync(A, {
        withFileTypes: !0
      })
    },
    readdirStringSync(A) {
      return v9.readdirSync(A)
    },
    isDirEmptySync(A) {
      return this.readdirSync(A).length === 0
    },
    rmdirSync(A) {
      v9.rmdirSync(A)
    },
    rmSync(A, Q) {
      v9.rmSync(A, Q)
    },
    createWriteStream(A) {
      return v9.createWriteStream(A)
    }
  }, IM9 = ZM9
})
// @from(Start 14076, End 14157)
function MQ() {
  return process.env.CLAUDE_CONFIG_DIR ?? YM9(JM9(), ".claude")
}
// @from(Start 14159, End 14320)
function Y0(A) {
  if (!A) return !1;
  if (typeof A === "boolean") return A;
  let Q = A.toLowerCase().trim();
  return ["1", "true", "yes", "on"].includes(Q)
}
// @from(Start 14322, End 14516)
function _j(A) {
  if (A === void 0) return !1;
  if (typeof A === "boolean") return !A;
  if (!A) return !1;
  let Q = A.toLowerCase().trim();
  return ["0", "false", "no", "off"].includes(Q)
}
// @from(Start 14518, End 14824)
function hH0(A) {
  let Q = {};
  if (A)
    for (let B of A) {
      let [G, ...Z] = B.split("=");
      if (!G || Z.length === 0) throw Error(`Invalid environment variable format: ${B}, environment variables should be added as: -e KEY1=value1 -e KEY2=value2`);
      Q[G] = Z.join("=")
    }
  return Q
}
// @from(Start 14826, End 14925)
function hBA() {
  return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1"
}
// @from(Start 14927, End 14995)
function ER() {
  return process.env.CLOUD_ML_REGION || "us-east5"
}
// @from(Start 14997, End 15081)
function IX1() {
  return Y0(process.env.CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR)
}
// @from(Start 15083, End 15916)
function k_A(A) {
  if (A?.startsWith("claude-haiku-4-5")) return process.env.VERTEX_REGION_CLAUDE_HAIKU_4_5 || ER();
  if (A?.startsWith("claude-3-5-haiku")) return process.env.VERTEX_REGION_CLAUDE_3_5_HAIKU || ER();
  if (A?.startsWith("claude-3-5-sonnet")) return process.env.VERTEX_REGION_CLAUDE_3_5_SONNET || ER();
  if (A?.startsWith("claude-3-7-sonnet")) return process.env.VERTEX_REGION_CLAUDE_3_7_SONNET || ER();
  if (A?.startsWith("claude-opus-4-1")) return process.env.VERTEX_REGION_CLAUDE_4_1_OPUS || ER();
  if (A?.startsWith("claude-opus-4")) return process.env.VERTEX_REGION_CLAUDE_4_0_OPUS || ER();
  if (A?.startsWith("claude-sonnet-4-5")) return process.env.VERTEX_REGION_CLAUDE_4_5_SONNET || ER();
  if (A?.startsWith("claude-sonnet-4")) return process.env.VERTEX_REGION_CLAUDE_4_0_SONNET || ER();
  return ER()
}
// @from(Start 15921, End 15934)
hQ = () => {}
// @from(Start 15937, End 15995)
function WM9() {
  this.__data__ = new pu, this.size = 0
}
// @from(Start 16000, End 16003)
gH0
// @from(Start 16009, End 16048)
uH0 = L(() => {
  WFA();
  gH0 = WM9
})
// @from(Start 16051, End 16147)
function XM9(A) {
  var Q = this.__data__,
    B = Q.delete(A);
  return this.size = Q.size, B
}
// @from(Start 16152, End 16155)
mH0
// @from(Start 16161, End 16191)
dH0 = L(() => {
  mH0 = XM9
})
// @from(Start 16194, End 16243)
function VM9(A) {
  return this.__data__.get(A)
}
// @from(Start 16248, End 16251)
cH0
// @from(Start 16257, End 16287)
pH0 = L(() => {
  cH0 = VM9
})
// @from(Start 16290, End 16339)
function FM9(A) {
  return this.__data__.has(A)
}
// @from(Start 16344, End 16347)
lH0
// @from(Start 16353, End 16383)
iH0 = L(() => {
  lH0 = FM9
})
// @from(Start 16386, End 16653)
function DM9(A, Q) {
  var B = this.__data__;
  if (B instanceof pu) {
    var G = B.__data__;
    if (!lu || G.length < KM9 - 1) return G.push([A, Q]), this.size = ++B.size, this;
    B = this.__data__ = new Ns(G)
  }
  return B.set(A, Q), this.size = B.size, this
}
// @from(Start 16658, End 16667)
KM9 = 200
// @from(Start 16671, End 16674)
nH0
// @from(Start 16680, End 16737)
aH0 = L(() => {
  WFA();
  S_A();
  __A();
  nH0 = DM9
})
// @from(Start 16740, End 16817)
function gBA(A) {
  var Q = this.__data__ = new pu(A);
  this.size = Q.size
}
// @from(Start 16822, End 16824)
kj
// @from(Start 16830, End 17053)
VFA = L(() => {
  WFA();
  uH0();
  dH0();
  pH0();
  iH0();
  aH0();
  gBA.prototype.clear = gH0;
  gBA.prototype.delete = mH0;
  gBA.prototype.get = cH0;
  gBA.prototype.has = lH0;
  gBA.prototype.set = nH0;
  kj = gBA
})
// @from(Start 17056, End 17116)
function CM9(A) {
  return this.__data__.set(A, HM9), this
}
// @from(Start 17121, End 17154)
HM9 = "__lodash_hash_undefined__"
// @from(Start 17158, End 17161)
sH0
// @from(Start 17167, End 17197)
rH0 = L(() => {
  sH0 = CM9
})
// @from(Start 17200, End 17249)
function EM9(A) {
  return this.__data__.has(A)
}
// @from(Start 17254, End 17257)
oH0
// @from(Start 17263, End 17293)
tH0 = L(() => {
  oH0 = EM9
})
// @from(Start 17296, End 17422)
function y_A(A) {
  var Q = -1,
    B = A == null ? 0 : A.length;
  this.__data__ = new Ns;
  while (++Q < B) this.add(A[Q])
}
// @from(Start 17427, End 17430)
x_A
// @from(Start 17436, End 17568)
YX1 = L(() => {
  __A();
  rH0();
  tH0();
  y_A.prototype.add = y_A.prototype.push = sH0;
  y_A.prototype.has = oH0;
  x_A = y_A
})
// @from(Start 17571, End 17705)
function zM9(A, Q) {
  var B = -1,
    G = A == null ? 0 : A.length;
  while (++B < G)
    if (Q(A[B], B, A)) return !0;
  return !1
}
// @from(Start 17710, End 17713)
eH0
// @from(Start 17719, End 17749)
AC0 = L(() => {
  eH0 = zM9
})
// @from(Start 17752, End 17792)
function UM9(A, Q) {
  return A.has(Q)
}
// @from(Start 17797, End 17800)
v_A
// @from(Start 17806, End 17836)
JX1 = L(() => {
  v_A = UM9
})
// @from(Start 17839, End 18634)
function qM9(A, Q, B, G, Z, I) {
  var Y = B & $M9,
    J = A.length,
    W = Q.length;
  if (J != W && !(Y && W > J)) return !1;
  var X = I.get(A),
    V = I.get(Q);
  if (X && V) return X == Q && V == A;
  var F = -1,
    K = !0,
    D = B & wM9 ? new x_A : void 0;
  I.set(A, Q), I.set(Q, A);
  while (++F < J) {
    var H = A[F],
      C = Q[F];
    if (G) var E = Y ? G(C, H, F, Q, A, I) : G(H, C, F, A, Q, I);
    if (E !== void 0) {
      if (E) continue;
      K = !1;
      break
    }
    if (D) {
      if (!eH0(Q, function(U, q) {
          if (!v_A(D, q) && (H === U || Z(H, U, B, G, I))) return D.push(q)
        })) {
        K = !1;
        break
      }
    } else if (!(H === C || Z(H, C, B, G, I))) {
      K = !1;
      break
    }
  }
  return I.delete(A), I.delete(Q), K
}
// @from(Start 18639, End 18646)
$M9 = 1
// @from(Start 18650, End 18657)
wM9 = 2
// @from(Start 18661, End 18664)
b_A
// @from(Start 18670, End 18727)
WX1 = L(() => {
  YX1();
  AC0();
  JX1();
  b_A = qM9
})
// @from(Start 18733, End 18736)
NM9
// @from(Start 18738, End 18741)
uBA
// @from(Start 18747, End 18806)
XX1 = L(() => {
  CR();
  NM9 = zX.Uint8Array, uBA = NM9
})
// @from(Start 18809, End 18929)
function LM9(A) {
  var Q = -1,
    B = Array(A.size);
  return A.forEach(function(G, Z) {
    B[++Q] = [Z, G]
  }), B
}
// @from(Start 18934, End 18937)
QC0
// @from(Start 18943, End 18973)
BC0 = L(() => {
  QC0 = LM9
})
// @from(Start 18976, End 19088)
function MM9(A) {
  var Q = -1,
    B = Array(A.size);
  return A.forEach(function(G) {
    B[++Q] = G
  }), B
}
// @from(Start 19093, End 19096)
mBA
// @from(Start 19102, End 19132)
f_A = L(() => {
  mBA = MM9
})
// @from(Start 19135, End 19985)
function hM9(A, Q, B, G, Z, I, Y) {
  switch (B) {
    case fM9:
      if (A.byteLength != Q.byteLength || A.byteOffset != Q.byteOffset) return !1;
      A = A.buffer, Q = Q.buffer;
    case bM9:
      if (A.byteLength != Q.byteLength || !I(new uBA(A), new uBA(Q))) return !1;
      return !0;
    case TM9:
    case PM9:
    case _M9:
      return jj(+A, +Q);
    case jM9:
      return A.name == Q.name && A.message == Q.message;
    case kM9:
    case xM9:
      return A == Q + "";
    case SM9:
      var J = QC0;
    case yM9:
      var W = G & OM9;
      if (J || (J = mBA), A.size != Q.size && !W) return !1;
      var X = Y.get(A);
      if (X) return X == Q;
      G |= RM9, Y.set(A, Q);
      var V = b_A(J(A), J(Q), G, Z, I, Y);
      return Y.delete(A), V;
    case vM9:
      if (VX1) return VX1.call(A) == VX1.call(Q)
  }
  return !1
}
// @from(Start 19990, End 19997)
OM9 = 1
// @from(Start 20001, End 20008)
RM9 = 2
// @from(Start 20012, End 20036)
TM9 = "[object Boolean]"
// @from(Start 20040, End 20061)
PM9 = "[object Date]"
// @from(Start 20065, End 20087)
jM9 = "[object Error]"
// @from(Start 20091, End 20111)
SM9 = "[object Map]"
// @from(Start 20115, End 20138)
_M9 = "[object Number]"
// @from(Start 20142, End 20165)
kM9 = "[object RegExp]"
// @from(Start 20169, End 20189)
yM9 = "[object Set]"
// @from(Start 20193, End 20216)
xM9 = "[object String]"
// @from(Start 20220, End 20243)
vM9 = "[object Symbol]"
// @from(Start 20247, End 20275)
bM9 = "[object ArrayBuffer]"
// @from(Start 20279, End 20304)
fM9 = "[object DataView]"
// @from(Start 20308, End 20311)
GC0
// @from(Start 20313, End 20316)
VX1
// @from(Start 20318, End 20321)
ZC0
// @from(Start 20327, End 20480)
IC0 = L(() => {
  ws();
  XX1();
  vBA();
  WX1();
  BC0();
  f_A();
  GC0 = EF ? EF.prototype : void 0, VX1 = GC0 ? GC0.valueOf : void 0;
  ZC0 = hM9
})
// @from(Start 20483, End 20601)
function gM9(A, Q) {
  var B = -1,
    G = Q.length,
    Z = A.length;
  while (++B < G) A[Z + B] = Q[B];
  return A
}
// @from(Start 20606, End 20609)
dBA
// @from(Start 20615, End 20645)
h_A = L(() => {
  dBA = gM9
})
// @from(Start 20651, End 20654)
uM9
// @from(Start 20656, End 20658)
b7
// @from(Start 20664, End 20713)
uC = L(() => {
  uM9 = Array.isArray, b7 = uM9
})
// @from(Start 20716, End 20791)
function mM9(A, Q, B) {
  var G = Q(A);
  return b7(A) ? G : dBA(G, B(A))
}
// @from(Start 20796, End 20799)
g_A
// @from(Start 20805, End 20852)
FX1 = L(() => {
  h_A();
  uC();
  g_A = mM9
})
// @from(Start 20855, End 21032)
function dM9(A, Q) {
  var B = -1,
    G = A == null ? 0 : A.length,
    Z = 0,
    I = [];
  while (++B < G) {
    var Y = A[B];
    if (Q(Y, B, A)) I[Z++] = Y
  }
  return I
}
// @from(Start 21037, End 21040)
u_A
// @from(Start 21046, End 21076)
KX1 = L(() => {
  u_A = dM9
})
// @from(Start 21079, End 21109)
function cM9() {
  return []
}
// @from(Start 21114, End 21117)
m_A
// @from(Start 21123, End 21153)
DX1 = L(() => {
  m_A = cM9
})
// @from(Start 21159, End 21162)
pM9
// @from(Start 21164, End 21167)
lM9
// @from(Start 21169, End 21172)
YC0
// @from(Start 21174, End 21177)
iM9
// @from(Start 21179, End 21182)
cBA
// @from(Start 21188, End 21483)
d_A = L(() => {
  KX1();
  DX1();
  pM9 = Object.prototype, lM9 = pM9.propertyIsEnumerable, YC0 = Object.getOwnPropertySymbols, iM9 = !YC0 ? m_A : function(A) {
    if (A == null) return [];
    return A = Object(A), u_A(YC0(A), function(Q) {
      return lM9.call(A, Q)
    })
  }, cBA = iM9
})
// @from(Start 21486, End 21582)
function nM9(A, Q) {
  var B = -1,
    G = Array(A);
  while (++B < A) G[B] = Q(B);
  return G
}
// @from(Start 21587, End 21590)
JC0
// @from(Start 21596, End 21626)
WC0 = L(() => {
  JC0 = nM9
})
// @from(Start 21629, End 21691)
function aM9(A) {
  return A != null && typeof A == "object"
}
// @from(Start 21696, End 21698)
qV
// @from(Start 21704, End 21732)
yj = L(() => {
  qV = aM9
})
// @from(Start 21735, End 21785)
function rM9(A) {
  return qV(A) && s$(A) == sM9
}
// @from(Start 21790, End 21816)
sM9 = "[object Arguments]"
// @from(Start 21820, End 21823)
HX1
// @from(Start 21829, End 21875)
XC0 = L(() => {
  qs();
  yj();
  HX1 = rM9
})
// @from(Start 21881, End 21884)
VC0
// @from(Start 21886, End 21889)
oM9
// @from(Start 21891, End 21894)
tM9
// @from(Start 21896, End 21899)
eM9
// @from(Start 21901, End 21903)
rx
// @from(Start 21909, End 22183)
FFA = L(() => {
  XC0();
  yj();
  VC0 = Object.prototype, oM9 = VC0.hasOwnProperty, tM9 = VC0.propertyIsEnumerable, eM9 = HX1(function() {
    return arguments
  }()) ? HX1 : function(A) {
    return qV(A) && oM9.call(A, "callee") && !tM9.call(A, "callee")
  }, rx = eM9
})
// @from(Start 22186, End 22216)
function AO9() {
  return !1
}
// @from(Start 22221, End 22224)
FC0
// @from(Start 22230, End 22260)
KC0 = L(() => {
  FC0 = AO9
})
// @from(Start 22266, End 22274)
p_A = {}
// @from(Start 22314, End 22317)
CC0
// @from(Start 22319, End 22322)
DC0
// @from(Start 22324, End 22327)
QO9
// @from(Start 22329, End 22332)
HC0
// @from(Start 22334, End 22337)
BO9
// @from(Start 22339, End 22342)
GO9
// @from(Start 22344, End 22346)
xj
// @from(Start 22352, End 22646)
KFA = L(() => {
  CR();
  KC0();
  CC0 = typeof p_A == "object" && p_A && !p_A.nodeType && p_A, DC0 = CC0 && typeof c_A == "object" && c_A && !c_A.nodeType && c_A, QO9 = DC0 && DC0.exports === CC0, HC0 = QO9 ? zX.Buffer : void 0, BO9 = HC0 ? HC0.isBuffer : void 0, GO9 = BO9 || FC0, xj = GO9
})
// @from(Start 22649, End 22815)
function YO9(A, Q) {
  var B = typeof A;
  return Q = Q == null ? ZO9 : Q, !!Q && (B == "number" || B != "symbol" && IO9.test(A)) && (A > -1 && A % 1 == 0 && A < Q)
}
// @from(Start 22820, End 22842)
ZO9 = 9007199254740991
// @from(Start 22846, End 22849)
IO9
// @from(Start 22851, End 22853)
nu
// @from(Start 22859, End 22916)
DFA = L(() => {
  IO9 = /^(?:0|[1-9]\d*)$/;
  nu = YO9
})
// @from(Start 22919, End 23004)
function WO9(A) {
  return typeof A == "number" && A > -1 && A % 1 == 0 && A <= JO9
}
// @from(Start 23009, End 23031)
JO9 = 9007199254740991
// @from(Start 23035, End 23038)
pBA
// @from(Start 23044, End 23074)
l_A = L(() => {
  pBA = WO9
})
// @from(Start 23077, End 23143)
function yO9(A) {
  return qV(A) && pBA(A.length) && !!JI[s$(A)]
}
// @from(Start 23148, End 23174)
XO9 = "[object Arguments]"
// @from(Start 23178, End 23200)
VO9 = "[object Array]"
// @from(Start 23204, End 23228)
FO9 = "[object Boolean]"
// @from(Start 23232, End 23253)
KO9 = "[object Date]"
// @from(Start 23257, End 23279)
DO9 = "[object Error]"
// @from(Start 23283, End 23308)
HO9 = "[object Function]"
// @from(Start 23312, End 23332)
CO9 = "[object Map]"
// @from(Start 23336, End 23359)
EO9 = "[object Number]"
// @from(Start 23363, End 23386)
zO9 = "[object Object]"
// @from(Start 23390, End 23413)
UO9 = "[object RegExp]"
// @from(Start 23417, End 23437)
$O9 = "[object Set]"
// @from(Start 23441, End 23464)
wO9 = "[object String]"
// @from(Start 23468, End 23492)
qO9 = "[object WeakMap]"
// @from(Start 23496, End 23524)
NO9 = "[object ArrayBuffer]"
// @from(Start 23528, End 23553)
LO9 = "[object DataView]"
// @from(Start 23557, End 23586)
MO9 = "[object Float32Array]"
// @from(Start 23590, End 23619)
OO9 = "[object Float64Array]"
// @from(Start 23623, End 23649)
RO9 = "[object Int8Array]"
// @from(Start 23653, End 23680)
TO9 = "[object Int16Array]"
// @from(Start 23684, End 23711)
PO9 = "[object Int32Array]"
// @from(Start 23715, End 23742)
jO9 = "[object Uint8Array]"
// @from(Start 23746, End 23780)
SO9 = "[object Uint8ClampedArray]"
// @from(Start 23784, End 23812)
_O9 = "[object Uint16Array]"
// @from(Start 23816, End 23844)
kO9 = "[object Uint32Array]"
// @from(Start 23848, End 23850)
JI
// @from(Start 23852, End 23855)
EC0
// @from(Start 23861, End 24179)
zC0 = L(() => {
  qs();
  l_A();
  yj();
  JI = {};
  JI[MO9] = JI[OO9] = JI[RO9] = JI[TO9] = JI[PO9] = JI[jO9] = JI[SO9] = JI[_O9] = JI[kO9] = !0;
  JI[XO9] = JI[VO9] = JI[NO9] = JI[FO9] = JI[LO9] = JI[KO9] = JI[DO9] = JI[HO9] = JI[CO9] = JI[EO9] = JI[zO9] = JI[UO9] = JI[$O9] = JI[wO9] = JI[qO9] = !1;
  EC0 = yO9
})
// @from(Start 24182, End 24244)
function xO9(A) {
  return function(Q) {
    return A(Q)
  }
}
// @from(Start 24249, End 24252)
lBA
// @from(Start 24258, End 24288)
i_A = L(() => {
  lBA = xO9
})
// @from(Start 24294, End 24302)
a_A = {}
// @from(Start 24342, End 24345)
UC0
// @from(Start 24347, End 24350)
HFA
// @from(Start 24352, End 24355)
vO9
// @from(Start 24357, End 24360)
CX1
// @from(Start 24362, End 24365)
bO9
// @from(Start 24367, End 24369)
vj
// @from(Start 24375, End 24798)
s_A = L(() => {
  QX1();
  UC0 = typeof a_A == "object" && a_A && !a_A.nodeType && a_A, HFA = UC0 && typeof n_A == "object" && n_A && !n_A.nodeType && n_A, vO9 = HFA && HFA.exports === UC0, CX1 = vO9 && T_A.process, bO9 = function() {
    try {
      var A = HFA && HFA.require && HFA.require("util").types;
      if (A) return A;
      return CX1 && CX1.binding && CX1.binding("util")
    } catch (Q) {}
  }(), vj = bO9
})
// @from(Start 24804, End 24807)
$C0
// @from(Start 24809, End 24812)
fO9
// @from(Start 24814, End 24817)
iBA
// @from(Start 24823, End 24937)
r_A = L(() => {
  zC0();
  i_A();
  s_A();
  $C0 = vj && vj.isTypedArray, fO9 = $C0 ? lBA($C0) : EC0, iBA = fO9
})
// @from(Start 24940, End 25363)
function uO9(A, Q) {
  var B = b7(A),
    G = !B && rx(A),
    Z = !B && !G && xj(A),
    I = !B && !G && !Z && iBA(A),
    Y = B || G || Z || I,
    J = Y ? JC0(A.length, String) : [],
    W = J.length;
  for (var X in A)
    if ((Q || gO9.call(A, X)) && !(Y && (X == "length" || Z && (X == "offset" || X == "parent") || I && (X == "buffer" || X == "byteLength" || X == "byteOffset") || nu(X, W)))) J.push(X);
  return J
}
// @from(Start 25368, End 25371)
hO9
// @from(Start 25373, End 25376)
gO9
// @from(Start 25378, End 25381)
o_A
// @from(Start 25387, End 25522)
EX1 = L(() => {
  WC0();
  FFA();
  uC();
  KFA();
  DFA();
  r_A();
  hO9 = Object.prototype, gO9 = hO9.hasOwnProperty;
  o_A = uO9
})
// @from(Start 25525, End 25645)
function dO9(A) {
  var Q = A && A.constructor,
    B = typeof Q == "function" && Q.prototype || mO9;
  return A === B
}
// @from(Start 25650, End 25653)
mO9
// @from(Start 25655, End 25658)
nBA
// @from(Start 25664, End 25720)
t_A = L(() => {
  mO9 = Object.prototype;
  nBA = dO9
})
// @from(Start 25723, End 25791)
function cO9(A, Q) {
  return function(B) {
    return A(Q(B))
  }
}
// @from(Start 25796, End 25799)
e_A
// @from(Start 25805, End 25835)
zX1 = L(() => {
  e_A = cO9
})
// @from(Start 25841, End 25844)
pO9
// @from(Start 25846, End 25849)
wC0
// @from(Start 25855, End 25926)
qC0 = L(() => {
  zX1();
  pO9 = e_A(Object.keys, Object), wC0 = pO9
})
// @from(Start 25929, End 26087)
function nO9(A) {
  if (!nBA(A)) return wC0(A);
  var Q = [];
  for (var B in Object(A))
    if (iO9.call(A, B) && B != "constructor") Q.push(B);
  return Q
}
// @from(Start 26092, End 26095)
lO9
// @from(Start 26097, End 26100)
iO9
// @from(Start 26102, End 26105)
NC0
// @from(Start 26111, End 26211)
LC0 = L(() => {
  t_A();
  qC0();
  lO9 = Object.prototype, iO9 = lO9.hasOwnProperty;
  NC0 = nO9
})
// @from(Start 26214, End 26280)
function aO9(A) {
  return A != null && pBA(A.length) && !yBA(A)
}
// @from(Start 26285, End 26287)
bj
// @from(Start 26293, End 26340)
aBA = L(() => {
  P_A();
  l_A();
  bj = aO9
})
// @from(Start 26343, End 26395)
function sO9(A) {
  return bj(A) ? o_A(A) : NC0(A)
}
// @from(Start 26400, End 26402)
fN
// @from(Start 26408, End 26463)
Ms = L(() => {
  EX1();
  LC0();
  aBA();
  fN = sO9
})
// @from(Start 26466, End 26510)
function rO9(A) {
  return g_A(A, fN, cBA)
}
// @from(Start 26515, End 26518)
CFA
// @from(Start 26524, End 26580)
UX1 = L(() => {
  FX1();
  d_A();
  Ms();
  CFA = rO9
})
// @from(Start 26583, End 27507)
function AR9(A, Q, B, G, Z, I) {
  var Y = B & oO9,
    J = CFA(A),
    W = J.length,
    X = CFA(Q),
    V = X.length;
  if (W != V && !Y) return !1;
  var F = W;
  while (F--) {
    var K = J[F];
    if (!(Y ? K in Q : eO9.call(Q, K))) return !1
  }
  var D = I.get(A),
    H = I.get(Q);
  if (D && H) return D == Q && H == A;
  var C = !0;
  I.set(A, Q), I.set(Q, A);
  var E = Y;
  while (++F < W) {
    K = J[F];
    var U = A[K],
      q = Q[K];
    if (G) var w = Y ? G(q, U, K, Q, A, I) : G(U, q, K, A, Q, I);
    if (!(w === void 0 ? U === q || Z(U, q, B, G, I) : w)) {
      C = !1;
      break
    }
    E || (E = K == "constructor")
  }
  if (C && !E) {
    var N = A.constructor,
      R = Q.constructor;
    if (N != R && (("constructor" in A) && ("constructor" in Q)) && !(typeof N == "function" && N instanceof N && typeof R == "function" && R instanceof R)) C = !1
  }
  return I.delete(A), I.delete(Q), C
}
// @from(Start 27512, End 27519)
oO9 = 1
// @from(Start 27523, End 27526)
tO9
// @from(Start 27528, End 27531)
eO9
// @from(Start 27533, End 27536)
MC0
// @from(Start 27542, End 27633)
OC0 = L(() => {
  UX1();
  tO9 = Object.prototype, eO9 = tO9.hasOwnProperty;
  MC0 = AR9
})
// @from(Start 27639, End 27642)
QR9
// @from(Start 27644, End 27647)
AkA
// @from(Start 27653, End 27725)
RC0 = L(() => {
  du();
  CR();
  QR9 = fz(zX, "DataView"), AkA = QR9
})
// @from(Start 27731, End 27734)
BR9
// @from(Start 27736, End 27739)
QkA
// @from(Start 27745, End 27816)
TC0 = L(() => {
  du();
  CR();
  BR9 = fz(zX, "Promise"), QkA = BR9
})
// @from(Start 27822, End 27825)
GR9
// @from(Start 27827, End 27829)
au
// @from(Start 27835, End 27901)
$X1 = L(() => {
  du();
  CR();
  GR9 = fz(zX, "Set"), au = GR9
})
// @from(Start 27907, End 27910)
ZR9
// @from(Start 27912, End 27915)
BkA
// @from(Start 27921, End 27992)
PC0 = L(() => {
  du();
  CR();
  ZR9 = fz(zX, "WeakMap"), BkA = ZR9
})
// @from(Start 27998, End 28018)
jC0 = "[object Map]"
// @from(Start 28022, End 28045)
IR9 = "[object Object]"
// @from(Start 28049, End 28073)
SC0 = "[object Promise]"
// @from(Start 28077, End 28097)
_C0 = "[object Set]"
// @from(Start 28101, End 28125)
kC0 = "[object WeakMap]"
// @from(Start 28129, End 28154)
yC0 = "[object DataView]"
// @from(Start 28158, End 28161)
YR9
// @from(Start 28163, End 28166)
JR9
// @from(Start 28168, End 28171)
WR9
// @from(Start 28173, End 28176)
XR9
// @from(Start 28178, End 28181)
VR9
// @from(Start 28183, End 28185)
Os
// @from(Start 28187, End 28189)
ox
// @from(Start 28195, End 28876)
EFA = L(() => {
  RC0();
  S_A();
  TC0();
  $X1();
  PC0();
  qs();
  BX1();
  YR9 = ax(AkA), JR9 = ax(lu), WR9 = ax(QkA), XR9 = ax(au), VR9 = ax(BkA), Os = s$;
  if (AkA && Os(new AkA(new ArrayBuffer(1))) != yC0 || lu && Os(new lu) != jC0 || QkA && Os(QkA.resolve()) != SC0 || au && Os(new au) != _C0 || BkA && Os(new BkA) != kC0) Os = function(A) {
    var Q = s$(A),
      B = Q == IR9 ? A.constructor : void 0,
      G = B ? ax(B) : "";
    if (G) switch (G) {
      case YR9:
        return yC0;
      case JR9:
        return jC0;
      case WR9:
        return SC0;
      case XR9:
        return _C0;
      case VR9:
        return kC0
    }
    return Q
  };
  ox = Os
})
// @from(Start 28879, End 29594)
function DR9(A, Q, B, G, Z, I) {
  var Y = b7(A),
    J = b7(Q),
    W = Y ? vC0 : ox(A),
    X = J ? vC0 : ox(Q);
  W = W == xC0 ? GkA : W, X = X == xC0 ? GkA : X;
  var V = W == GkA,
    F = X == GkA,
    K = W == X;
  if (K && xj(A)) {
    if (!xj(Q)) return !1;
    Y = !0, V = !1
  }
  if (K && !V) return I || (I = new kj), Y || iBA(A) ? b_A(A, Q, B, G, Z, I) : ZC0(A, Q, W, B, G, Z, I);
  if (!(B & FR9)) {
    var D = V && bC0.call(A, "__wrapped__"),
      H = F && bC0.call(Q, "__wrapped__");
    if (D || H) {
      var C = D ? A.value() : A,
        E = H ? Q.value() : Q;
      return I || (I = new kj), Z(C, E, B, G, I)
    }
  }
  if (!K) return !1;
  return I || (I = new kj), MC0(A, Q, B, G, Z, I)
}
// @from(Start 29599, End 29606)
FR9 = 1
// @from(Start 29610, End 29636)
xC0 = "[object Arguments]"
// @from(Start 29640, End 29662)
vC0 = "[object Array]"
// @from(Start 29666, End 29689)
GkA = "[object Object]"
// @from(Start 29693, End 29696)
KR9
// @from(Start 29698, End 29701)
bC0
// @from(Start 29703, End 29706)
fC0
// @from(Start 29712, End 29865)
hC0 = L(() => {
  VFA();
  WX1();
  IC0();
  OC0();
  EFA();
  uC();
  KFA();
  r_A();
  KR9 = Object.prototype, bC0 = KR9.hasOwnProperty;
  fC0 = DR9
})
// @from(Start 29868, End 30035)
function gC0(A, Q, B, G, Z) {
  if (A === Q) return !0;
  if (A == null || Q == null || !qV(A) && !qV(Q)) return A !== A && Q !== Q;
  return fC0(A, Q, B, G, gC0, Z)
}
// @from(Start 30040, End 30043)
sBA
// @from(Start 30049, End 30096)
ZkA = L(() => {
  hC0();
  yj();
  sBA = gC0
})
// @from(Start 30099, End 30637)
function ER9(A, Q, B, G) {
  var Z = B.length,
    I = Z,
    Y = !G;
  if (A == null) return !I;
  A = Object(A);
  while (Z--) {
    var J = B[Z];
    if (Y && J[2] ? J[1] !== A[J[0]] : !(J[0] in A)) return !1
  }
  while (++Z < I) {
    J = B[Z];
    var W = J[0],
      X = A[W],
      V = J[1];
    if (Y && J[2]) {
      if (X === void 0 && !(W in A)) return !1
    } else {
      var F = new kj;
      if (G) var K = G(X, V, W, A, Q, F);
      if (!(K === void 0 ? sBA(V, X, HR9 | CR9, G, F) : K)) return !1
    }
  }
  return !0
}
// @from(Start 30642, End 30649)
HR9 = 1
// @from(Start 30653, End 30660)
CR9 = 2
// @from(Start 30664, End 30667)
uC0
// @from(Start 30673, End 30721)
mC0 = L(() => {
  VFA();
  ZkA();
  uC0 = ER9
})
// @from(Start 30724, End 30770)
function zR9(A) {
  return A === A && !SY(A)
}
// @from(Start 30775, End 30778)
IkA
// @from(Start 30784, End 30822)
wX1 = L(() => {
  bN();
  IkA = zR9
})
// @from(Start 30825, End 30970)
function UR9(A) {
  var Q = fN(A),
    B = Q.length;
  while (B--) {
    var G = Q[B],
      Z = A[G];
    Q[B] = [G, Z, IkA(Z)]
  }
  return Q
}
// @from(Start 30975, End 30978)
dC0
// @from(Start 30984, End 31031)
cC0 = L(() => {
  wX1();
  Ms();
  dC0 = UR9
})
// @from(Start 31034, End 31173)
function $R9(A, Q) {
  return function(B) {
    if (B == null) return !1;
    return B[A] === Q && (Q !== void 0 || (A in Object(B)))
  }
}
// @from(Start 31178, End 31181)
YkA
// @from(Start 31187, End 31217)
qX1 = L(() => {
  YkA = $R9
})
// @from(Start 31220, End 31381)
function wR9(A) {
  var Q = dC0(A);
  if (Q.length == 1 && Q[0][2]) return YkA(Q[0][0], Q[0][1]);
  return function(B) {
    return B === A || uC0(B, A, Q)
  }
}
// @from(Start 31386, End 31389)
pC0
// @from(Start 31395, End 31452)
lC0 = L(() => {
  mC0();
  cC0();
  qX1();
  pC0 = wR9
})
// @from(Start 31455, End 31529)
function NR9(A) {
  return typeof A == "symbol" || qV(A) && s$(A) == qR9
}
// @from(Start 31534, End 31557)
qR9 = "[object Symbol]"
// @from(Start 31561, End 31564)
rBA
// @from(Start 31570, End 31616)
JkA = L(() => {
  qs();
  yj();
  rBA = NR9
})
// @from(Start 31619, End 31843)
function OR9(A, Q) {
  if (b7(A)) return !1;
  var B = typeof A;
  if (B == "number" || B == "symbol" || B == "boolean" || A == null || rBA(A)) return !0;
  return MR9.test(A) || !LR9.test(A) || Q != null && A in Object(Q)
}
// @from(Start 31848, End 31851)
LR9
// @from(Start 31853, End 31856)
MR9
// @from(Start 31858, End 31861)
oBA
// @from(Start 31867, End 31989)
WkA = L(() => {
  uC();
  JkA();
  LR9 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, MR9 = /^\w*$/;
  oBA = OR9
})
// @from(Start 31992, End 32129)
function TR9(A) {
  var Q = s1(A, function(G) {
      if (B.size === RR9) B.clear();
      return G
    }),
    B = Q.cache;
  return Q
}
// @from(Start 32134, End 32143)
RR9 = 500
// @from(Start 32147, End 32150)
iC0
// @from(Start 32156, End 32194)
nC0 = L(() => {
  l2();
  iC0 = TR9
})
// @from(Start 32200, End 32203)
PR9
// @from(Start 32205, End 32208)
jR9
// @from(Start 32210, End 32213)
SR9
// @from(Start 32215, End 32218)
aC0
// @from(Start 32224, End 32584)
sC0 = L(() => {
  nC0();
  PR9 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, jR9 = /\\(\\)?/g, SR9 = iC0(function(A) {
    var Q = [];
    if (A.charCodeAt(0) === 46) Q.push("");
    return A.replace(PR9, function(B, G, Z, I) {
      Q.push(Z ? I.replace(jR9, "$1") : G || B)
    }), Q
  }), aC0 = SR9
})
// @from(Start 32587, End 32726)
function _R9(A, Q) {
  var B = -1,
    G = A == null ? 0 : A.length,
    Z = Array(G);
  while (++B < G) Z[B] = Q(A[B], B, A);
  return Z
}
// @from(Start 32731, End 32734)
tBA
// @from(Start 32740, End 32770)
XkA = L(() => {
  tBA = _R9
})
// @from(Start 32773, End 32977)
function tC0(A) {
  if (typeof A == "string") return A;
  if (b7(A)) return tBA(A, tC0) + "";
  if (rBA(A)) return oC0 ? oC0.call(A) : "";
  var Q = A + "";
  return Q == "0" && 1 / A == -kR9 ? "-0" : Q
}
// @from(Start 32982, End 32993)
kR9 = 1 / 0
// @from(Start 32997, End 33000)
rC0
// @from(Start 33002, End 33005)
oC0
// @from(Start 33007, End 33010)
eC0
// @from(Start 33016, End 33151)
AE0 = L(() => {
  ws();
  XkA();
  uC();
  JkA();
  rC0 = EF ? EF.prototype : void 0, oC0 = rC0 ? rC0.toString : void 0;
  eC0 = tC0
})
// @from(Start 33154, End 33206)
function yR9(A) {
  return A == null ? "" : eC0(A)
}
// @from(Start 33211, End 33214)
eBA
// @from(Start 33220, End 33259)
VkA = L(() => {
  AE0();
  eBA = yR9
})
// @from(Start 33262, End 33346)
function xR9(A, Q) {
  if (b7(A)) return A;
  return oBA(A, Q) ? [A] : aC0(eBA(A))
}
// @from(Start 33351, End 33353)
fj
// @from(Start 33359, End 33423)
A2A = L(() => {
  uC();
  WkA();
  sC0();
  VkA();
  fj = xR9
})
// @from(Start 33426, End 33557)
function bR9(A) {
  if (typeof A == "string" || rBA(A)) return A;
  var Q = A + "";
  return Q == "0" && 1 / A == -vR9 ? "-0" : Q
}
// @from(Start 33562, End 33573)
vR9 = 1 / 0
// @from(Start 33577, End 33579)
hN
// @from(Start 33585, End 33622)
Rs = L(() => {
  JkA();
  hN = bR9
})
// @from(Start 33625, End 33776)
function fR9(A, Q) {
  Q = fj(Q, A);
  var B = 0,
    G = Q.length;
  while (A != null && B < G) A = A[hN(Q[B++])];
  return B && B == G ? A : void 0
}
// @from(Start 33781, End 33784)
Q2A
// @from(Start 33790, End 33837)
FkA = L(() => {
  A2A();
  Rs();
  Q2A = fR9
})
// @from(Start 33840, End 33937)
function hR9(A, Q, B) {
  var G = A == null ? void 0 : Q2A(A, Q);
  return G === void 0 ? B : G
}
// @from(Start 33942, End 33945)
QE0
// @from(Start 33951, End 33990)
BE0 = L(() => {
  FkA();
  QE0 = hR9
})
// @from(Start 33993, End 34052)
function gR9(A, Q) {
  return A != null && Q in Object(A)
}
// @from(Start 34057, End 34060)
GE0
// @from(Start 34066, End 34096)
ZE0 = L(() => {
  GE0 = gR9
})
// @from(Start 34099, End 34403)
function uR9(A, Q, B) {
  Q = fj(Q, A);
  var G = -1,
    Z = Q.length,
    I = !1;
  while (++G < Z) {
    var Y = hN(Q[G]);
    if (!(I = A != null && B(A, Y))) break;
    A = A[Y]
  }
  if (I || ++G != Z) return I;
  return Z = A == null ? 0 : A.length, !!Z && pBA(Z) && nu(Y, Z) && (b7(A) || rx(A))
}
// @from(Start 34408, End 34411)
IE0
// @from(Start 34417, End 34499)
YE0 = L(() => {
  A2A();
  FFA();
  uC();
  DFA();
  l_A();
  Rs();
  IE0 = uR9
})
// @from(Start 34502, End 34561)
function mR9(A, Q) {
  return A != null && IE0(A, Q, GE0)
}
// @from(Start 34566, End 34569)
JE0
// @from(Start 34575, End 34623)
WE0 = L(() => {
  ZE0();
  YE0();
  JE0 = mR9
})
// @from(Start 34626, End 34814)
function pR9(A, Q) {
  if (oBA(A) && IkA(Q)) return YkA(hN(A), Q);
  return function(B) {
    var G = QE0(B, A);
    return G === void 0 && G === Q ? JE0(B, A) : sBA(Q, G, dR9 | cR9)
  }
}
// @from(Start 34819, End 34826)
dR9 = 1
// @from(Start 34830, End 34837)
cR9 = 2
// @from(Start 34841, End 34844)
XE0
// @from(Start 34850, End 34942)
VE0 = L(() => {
  ZkA();
  BE0();
  WE0();
  WkA();
  wX1();
  qX1();
  Rs();
  XE0 = pR9
})
// @from(Start 34945, End 34975)
function lR9(A) {
  return A
}
// @from(Start 34980, End 34983)
B2A
// @from(Start 34989, End 35019)
KkA = L(() => {
  B2A = lR9
})
// @from(Start 35022, End 35105)
function iR9(A) {
  return function(Q) {
    return Q == null ? void 0 : Q[A]
  }
}
// @from(Start 35110, End 35113)
FE0
// @from(Start 35119, End 35149)
KE0 = L(() => {
  FE0 = iR9
})
// @from(Start 35152, End 35219)
function nR9(A) {
  return function(Q) {
    return Q2A(Q, A)
  }
}
// @from(Start 35224, End 35227)
DE0
// @from(Start 35233, End 35272)
HE0 = L(() => {
  FkA();
  DE0 = nR9
})
// @from(Start 35275, End 35332)
function aR9(A) {
  return oBA(A) ? FE0(hN(A)) : DE0(A)
}
// @from(Start 35337, End 35340)
CE0
// @from(Start 35346, End 35411)
EE0 = L(() => {
  KE0();
  HE0();
  WkA();
  Rs();
  CE0 = aR9
})
// @from(Start 35414, End 35587)
function sR9(A) {
  if (typeof A == "function") return A;
  if (A == null) return B2A;
  if (typeof A == "object") return b7(A) ? XE0(A[0], A[1]) : pC0(A);
  return CE0(A)
}
// @from(Start 35592, End 35594)
hj
// @from(Start 35600, End 35673)
G2A = L(() => {
  lC0();
  VE0();
  KkA();
  uC();
  EE0();
  hj = sR9
})
// @from(Start 35676, End 35840)
function rR9(A, Q) {
  var B, G = -1,
    Z = A.length;
  while (++G < Z) {
    var I = Q(A[G]);
    if (I !== void 0) B = B === void 0 ? I : B + I
  }
  return B
}
// @from(Start 35845, End 35848)
zE0
// @from(Start 35854, End 35884)
UE0 = L(() => {
  zE0 = rR9
})
// @from(Start 35887, End 35955)
function oR9(A, Q) {
  return A && A.length ? zE0(A, hj(Q, 2)) : 0
}
// @from(Start 35960, End 35963)
Z2A
// @from(Start 35969, End 36017)
$E0 = L(() => {
  G2A();
  UE0();
  Z2A = oR9
})
// @from(Start 36023, End 36026)
DkA
// @from(Start 36028, End 36031)
HkA
// @from(Start 36037, End 37226)
CkA = L(() => {
  DkA = {
    name: "BASH_MAX_OUTPUT_LENGTH",
    default: 30000,
    validate: (A) => {
      if (!A) return {
        effective: 30000,
        status: "valid"
      };
      let G = parseInt(A, 10);
      if (isNaN(G) || G <= 0) return {
        effective: 30000,
        status: "invalid",
        message: `Invalid value "${A}" (using default: 30000)`
      };
      if (G > 150000) return {
        effective: 150000,
        status: "capped",
        message: `Capped from ${G} to 150000`
      };
      return {
        effective: G,
        status: "valid"
      }
    }
  }, HkA = {
    name: "CLAUDE_CODE_MAX_OUTPUT_TOKENS",
    default: 32000,
    validate: (A) => {
      if (!A) return {
        effective: 32000,
        status: "valid"
      };
      let G = parseInt(A, 10);
      if (isNaN(G) || G <= 0) return {
        effective: 32000,
        status: "invalid",
        message: `Invalid value "${A}" (using default: 32000)`
      };
      if (G > 64000) return {
        effective: 64000,
        status: "capped",
        message: `Capped from ${G} to 64000`
      };
      return {
        effective: G,
        status: "valid"
      }
    }
  }
})
// @from(Start 37229, End 37301)
function su(A) {
  if (A.includes("[1m]")) return 1e6;
  return 200000
}
// @from(Start 37306, End 37317)
EkA = 20000
// @from(Start 37450, End 38909)
function AT9() {
  let A = "";
  if (typeof process < "u" && typeof process.cwd === "function") A = eR9(tR9());
  return {
    originalCwd: A,
    totalCostUSD: 0,
    totalAPIDuration: 0,
    totalAPIDurationWithoutRetries: 0,
    totalToolDuration: 0,
    startTime: Date.now(),
    lastInteractionTime: Date.now(),
    totalLinesAdded: 0,
    totalLinesRemoved: 0,
    hasUnknownModelCost: !1,
    cwd: A,
    modelUsage: {},
    mainLoopModelOverride: void 0,
    initialMainLoopModel: null,
    modelStrings: null,
    isInteractive: !1,
    clientType: "cli",
    sessionIngressToken: void 0,
    oauthTokenFromFd: void 0,
    apiKeyFromFd: void 0,
    flagSettingsPath: void 0,
    allowedSettingSources: ["userSettings", "projectSettings", "localSettings", "flagSettings", "policySettings"],
    meter: null,
    sessionCounter: null,
    locCounter: null,
    prCounter: null,
    commitCounter: null,
    costCounter: null,
    tokenCounter: null,
    codeEditToolDecisionCounter: null,
    activeTimeCounter: null,
    sessionId: wE0(),
    loggerProvider: null,
    eventLogger: null,
    meterProvider: null,
    tracerProvider: null,
    agentColorMap: new Map,
    agentColorIndex: 0,
    envVarValidators: [DkA, HkA],
    lastAPIRequest: null,
    inMemoryErrorLog: [],
    inlinePlugins: [],
    sessionBypassPermissionsMode: !1,
    hasExitedPlanMode: !1,
    initJsonSchema: null,
    registeredHooks: null,
    planSlugCache: new Map
  }
}
// @from(Start 38911, End 38950)
function e1() {
  return WQ.sessionId
}
// @from(Start 38952, End 39014)
function qE0() {
  return WQ.sessionId = wE0(), WQ.sessionId
}
// @from(Start 39016, End 39144)
function zR(A) {
  if (WQ.sessionId = A, process.env.CLAUDE_CODE_SESSION_ID !== void 0) process.env.CLAUDE_CODE_SESSION_ID = A
}
// @from(Start 39146, End 39187)
function uQ() {
  return WQ.originalCwd
}
// @from(Start 39189, End 39229)
function NE0(A) {
  WQ.originalCwd = A
}
// @from(Start 39231, End 39265)
function I2A() {
  return WQ.cwd
}
// @from(Start 39267, End 39299)
function LE0(A) {
  WQ.cwd = A
}
// @from(Start 39301, End 39390)
function ME0(A, Q) {
  WQ.totalAPIDuration += A, WQ.totalAPIDurationWithoutRetries += Q
}
// @from(Start 39392, End 39968)
function OE0(A, Q, B) {
  WQ.totalCostUSD += A;
  let G = WQ.modelUsage[B] ?? {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadInputTokens: 0,
    cacheCreationInputTokens: 0,
    webSearchRequests: 0,
    costUSD: 0,
    contextWindow: 0
  };
  G.inputTokens += Q.input_tokens, G.outputTokens += Q.output_tokens, G.cacheReadInputTokens += Q.cache_read_input_tokens ?? 0, G.cacheCreationInputTokens += Q.cache_creation_input_tokens ?? 0, G.webSearchRequests += Q.server_tool_use?.web_search_requests ?? 0, G.costUSD += A, G.contextWindow = su(B), WQ.modelUsage[B] = G
}
// @from(Start 39970, End 40012)
function hK() {
  return WQ.totalCostUSD
}
// @from(Start 40014, End 40060)
function gN() {
  return WQ.totalAPIDuration
}
// @from(Start 40062, End 40115)
function zFA() {
  return Date.now() - WQ.startTime
}
// @from(Start 40117, End 40165)
function RE0() {
  return WQ.totalToolDuration
}
// @from(Start 40167, End 40214)
function NX1(A) {
  WQ.totalToolDuration += A
}
// @from(Start 40216, End 40272)
function UFA() {
  WQ.lastInteractionTime = Date.now()
}
// @from(Start 40274, End 40349)
function LX1(A, Q) {
  WQ.totalLinesAdded += A, WQ.totalLinesRemoved += Q
}
// @from(Start 40351, End 40397)
function Y2A() {
  return WQ.totalLinesAdded
}
// @from(Start 40399, End 40447)
function J2A() {
  return WQ.totalLinesRemoved
}
// @from(Start 40449, End 40525)
function TE0() {
  return Z2A(Object.values(WQ.modelUsage), "inputTokens")
}
// @from(Start 40527, End 40604)
function PE0() {
  return Z2A(Object.values(WQ.modelUsage), "outputTokens")
}
// @from(Start 40606, End 40691)
function jE0() {
  return Z2A(Object.values(WQ.modelUsage), "cacheReadInputTokens")
}
// @from(Start 40693, End 40782)
function SE0() {
  return Z2A(Object.values(WQ.modelUsage), "cacheCreationInputTokens")
}
// @from(Start 40784, End 40866)
function _E0() {
  return Z2A(Object.values(WQ.modelUsage), "webSearchRequests")
}
// @from(Start 40868, End 40916)
function MX1() {
  WQ.hasUnknownModelCost = !0
}
// @from(Start 40918, End 40968)
function kE0() {
  return WQ.hasUnknownModelCost
}
// @from(Start 40970, End 41020)
function zkA() {
  return WQ.lastInteractionTime
}
// @from(Start 41022, End 41062)
function ru() {
  return WQ.modelUsage
}
// @from(Start 41064, End 41116)
function yE0() {
  return WQ.mainLoopModelOverride
}
// @from(Start 41118, End 41169)
function UkA() {
  return WQ.initialMainLoopModel
}
// @from(Start 41171, End 41220)
function Ts(A) {
  WQ.mainLoopModelOverride = A
}
// @from(Start 41222, End 41271)
function xE0(A) {
  WQ.initialMainLoopModel = A
}
// @from(Start 41273, End 41529)
function OX1() {
  WQ.totalCostUSD = 0, WQ.totalAPIDuration = 0, WQ.totalAPIDurationWithoutRetries = 0, WQ.totalToolDuration = 0, WQ.startTime = Date.now(), WQ.totalLinesAdded = 0, WQ.totalLinesRemoved = 0, WQ.hasUnknownModelCost = !1, WQ.modelUsage = {}
}
// @from(Start 41531, End 41574)
function $kA() {
  return WQ.modelStrings
}
// @from(Start 41576, End 41617)
function RX1(A) {
  WQ.modelStrings = A
}
// @from(Start 41619, End 42737)
function vE0(A, Q) {
  WQ.meter = A, WQ.sessionCounter = Q("claude_code.session.count", {
    description: "Count of CLI sessions started"
  }), WQ.locCounter = Q("claude_code.lines_of_code.count", {
    description: "Count of lines of code modified, with the 'type' attribute indicating whether lines were added or removed"
  }), WQ.prCounter = Q("claude_code.pull_request.count", {
    description: "Number of pull requests created"
  }), WQ.commitCounter = Q("claude_code.commit.count", {
    description: "Number of git commits created"
  }), WQ.costCounter = Q("claude_code.cost.usage", {
    description: "Cost of the Claude Code session",
    unit: "USD"
  }), WQ.tokenCounter = Q("claude_code.token.usage", {
    description: "Number of tokens used",
    unit: "tokens"
  }), WQ.codeEditToolDecisionCounter = Q("claude_code.code_edit_tool.decision", {
    description: "Count of code editing tool permission decisions (accept/reject) for Edit, Write, and NotebookEdit tools"
  }), WQ.activeTimeCounter = Q("claude_code.active_time.total", {
    description: "Total active time in seconds",
    unit: "s"
  })
}
// @from(Start 42739, End 42784)
function bE0() {
  return WQ.sessionCounter
}
// @from(Start 42786, End 42827)
function TX1() {
  return WQ.locCounter
}
// @from(Start 42829, End 42869)
function PX1() {
  return WQ.prCounter
}
// @from(Start 42871, End 42915)
function fE0() {
  return WQ.commitCounter
}
// @from(Start 42917, End 42959)
function hE0() {
  return WQ.costCounter
}
// @from(Start 42961, End 43004)
function $FA() {
  return WQ.tokenCounter
}
// @from(Start 43006, End 43064)
function wFA() {
  return WQ.codeEditToolDecisionCounter
}
// @from(Start 43066, End 43114)
function jX1() {
  return WQ.activeTimeCounter
}
// @from(Start 43116, End 43161)
function SX1() {
  return WQ.loggerProvider
}
// @from(Start 43163, End 43206)
function gE0(A) {
  WQ.loggerProvider = A
}
// @from(Start 43208, End 43250)
function uE0() {
  return WQ.eventLogger
}
// @from(Start 43252, End 43292)
function mE0(A) {
  WQ.eventLogger = A
}
// @from(Start 43294, End 43338)
function dE0() {
  return WQ.meterProvider
}
// @from(Start 43340, End 43382)
function cE0(A) {
  WQ.meterProvider = A
}
// @from(Start 43384, End 43429)
function _X1() {
  return WQ.tracerProvider
}
// @from(Start 43431, End 43474)
function pE0(A) {
  WQ.tracerProvider = A
}
// @from(Start 43476, End 43520)
function N6() {
  return !WQ.isInteractive
}
// @from(Start 43522, End 43566)
function wkA() {
  return WQ.isInteractive
}
// @from(Start 43568, End 43610)
function lE0(A) {
  WQ.isInteractive = A
}
// @from(Start 43612, End 43653)
function qkA() {
  return WQ.clientType
}
// @from(Start 43655, End 43694)
function iE0(A) {
  WQ.clientType = A
}
// @from(Start 43696, End 43740)
function kX1() {
  return WQ.agentColorMap
}
// @from(Start 43742, End 43789)
function yX1() {
  return WQ.flagSettingsPath
}
// @from(Start 43791, End 43836)
function nE0(A) {
  WQ.flagSettingsPath = A
}
// @from(Start 43838, End 43888)
function aE0() {
  return WQ.sessionIngressToken
}
// @from(Start 43890, End 43938)
function W2A(A) {
  WQ.sessionIngressToken = A
}
// @from(Start 43940, End 43987)
function sE0() {
  return WQ.oauthTokenFromFd
}
// @from(Start 43989, End 44034)
function X2A(A) {
  WQ.oauthTokenFromFd = A
}
// @from(Start 44036, End 44079)
function rE0() {
  return WQ.apiKeyFromFd
}
// @from(Start 44081, End 44122)
function V2A(A) {
  WQ.apiKeyFromFd = A
}
// @from(Start 44124, End 44171)
function oE0() {
  return WQ.envVarValidators
}
// @from(Start 44173, End 44216)
function tE0(A) {
  WQ.lastAPIRequest = A
}
// @from(Start 44218, End 44263)
function NkA() {
  return WQ.lastAPIRequest
}
// @from(Start 44265, End 44317)
function eE0() {
  return [...WQ.inMemoryErrorLog]
}
// @from(Start 44319, End 44438)
function Az0(A) {
  if (WQ.inMemoryErrorLog.length >= 100) WQ.inMemoryErrorLog.shift();
  WQ.inMemoryErrorLog.push(A)
}
// @from(Start 44440, End 44492)
function Qz0() {
  return WQ.allowedSettingSources
}
// @from(Start 44494, End 44544)
function Bz0(A) {
  WQ.allowedSettingSources = A
}
// @from(Start 44546, End 44615)
function Gz0() {
  return N6() && WQ.clientType !== "claude-vscode"
}
// @from(Start 44617, End 44659)
function Zz0(A) {
  WQ.inlinePlugins = A
}
// @from(Start 44661, End 44705)
function Iz0() {
  return WQ.inlinePlugins
}
// @from(Start 44707, End 44764)
function Yz0(A) {
  WQ.sessionBypassPermissionsMode = A
}
// @from(Start 44766, End 44814)
function Jz0() {
  return WQ.hasExitedPlanMode
}
// @from(Start 44816, End 44861)
function ou(A) {
  WQ.hasExitedPlanMode = A
}
// @from(Start 44863, End 44906)
function Wz0(A) {
  WQ.initJsonSchema = A
}
// @from(Start 44908, End 44953)
function xX1() {
  return WQ.initJsonSchema
}
// @from(Start 44955, End 44999)
function LkA(A) {
  WQ.registeredHooks = A
}
// @from(Start 45001, End 45047)
function MkA() {
  return WQ.registeredHooks
}
// @from(Start 45049, End 45093)
function qFA() {
  return WQ.planSlugCache
}
// @from(Start 45098, End 45100)
WQ
// @from(Start 45106, End 45154)
_0 = L(() => {
  $E0();
  CkA();
  WQ = AT9()
})
// @from(Start 45157, End 45678)
function Xz0({
  writeFn: A,
  flushIntervalMs: Q = 1000,
  maxBufferSize: B = 100,
  immediateMode: G = !1
}) {
  let Z = [],
    I = null;

  function Y() {
    if (I) clearTimeout(I), I = null
  }

  function J() {
    if (Z.length === 0) return;
    A(Z.join("")), Z = [], Y()
  }

  function W() {
    if (!I) I = setTimeout(J, Q)
  }
  return {
    write(X) {
      if (G) {
        A(X);
        return
      }
      if (Z.push(X), W(), Z.length >= B) J()
    },
    flush: J,
    dispose() {
      J()
    }
  }
}
// @from(Start 45680, End 45739)
function PG(A) {
  return vX1.add(A), () => vX1.delete(A)
}
// @from(Start 45740, End 45817)
async function Vz0() {
  await Promise.all(Array.from(vX1).map((A) => A()))
}
// @from(Start 45822, End 45825)
vX1
// @from(Start 45831, End 45864)
HH = L(() => {
  vX1 = new Set
})
// @from(Start 45923, End 46088)
function BT9(A) {
  if (typeof process > "u" || typeof process.versions > "u" || typeof process.versions.node > "u") return !1;
  let Q = QT9();
  return vH0(A, Q)
}
// @from(Start 46090, End 46119)
function Dz0(A) {
  Kz0 = A
}
// @from(Start 46121, End 46438)
function GT9() {
  if (!OkA) OkA = Xz0({
    writeFn: (A) => {
      let Q = Ps();
      if (!RA().existsSync(bX1(Q))) RA().mkdirSync(bX1(Q));
      RA().appendFileSync(Q, A), ZT9()
    },
    flushIntervalMs: 1000,
    maxBufferSize: 100,
    immediateMode: F2A()
  }), PG(async () => OkA?.dispose());
  return OkA
}
// @from(Start 46440, End 46704)
function g(A, {
  level: Q
} = {
  level: "debug"
}) {
  if (!BT9(A)) return;
  if (Kz0 && A.includes(`
`)) A = JSON.stringify(A);
  let G = `${new Date().toISOString()} [${Q.toUpperCase()}] ${A.trim()}
`;
  if (gj()) {
    Sj(G);
    return
  }
  GT9().write(G)
}
// @from(Start 46706, End 46808)
function Ps() {
  return process.env.CLAUDE_CODE_DEBUG_LOGS_DIR ?? Fz0(MQ(), "debug", `${e1()}.txt`)
}
// @from(Start 46810, End 46840)
function uN(A, Q) {
  return
}
// @from(Start 46845, End 46848)
F2A
// @from(Start 46850, End 46853)
QT9
// @from(Start 46855, End 46857)
gj
// @from(Start 46859, End 46867)
Kz0 = !1
// @from(Start 46871, End 46881)
OkA = null
// @from(Start 46885, End 46888)
ZT9
// @from(Start 46894, End 47721)
V0 = L(() => {
  l2();
  bH0();
  AQ();
  hQ();
  _0();
  HH();
  F2A = s1(() => {
    return Y0(process.env.DEBUG) || Y0(process.env.DEBUG_SDK) || process.argv.includes("--debug") || process.argv.includes("-d") || gj() || process.argv.some((A) => A.startsWith("--debug="))
  }), QT9 = s1(() => {
    let A = process.argv.find((B) => B.startsWith("--debug="));
    if (!A) return null;
    let Q = A.substring(8);
    return xH0(Q)
  }), gj = s1(() => {
    return process.argv.includes("--debug-to-stderr") || process.argv.includes("-d2e")
  });
  ZT9 = s1(() => {
    try {
      let A = Ps(),
        Q = bX1(A),
        B = Fz0(Q, "latest");
      if (!RA().existsSync(Q)) RA().mkdirSync(Q);
      if (RA().existsSync(B)) try {
        RA().unlinkSync(B)
      } catch {}
      RA().symlinkSync(A, B)
    } catch {}
  })
})
// @from(Start 47724, End 48086)
function Hz0(A) {
  if (tu !== null) throw Error("Analytics sink already attached - cannot attach more than once");
  if (tu = A, NFA.length > 0) {
    let Q = [...NFA];
    NFA.length = 0, queueMicrotask(() => {
      for (let B of Q)
        if (B.async) tu.logEventAsync(B.eventName, B.metadata);
        else tu.logEvent(B.eventName, B.metadata)
    })
  }
}
// @from(Start 48088, End 48243)
function GA(A, Q) {
  if (tu === null) {
    NFA.push({
      eventName: A,
      metadata: Q,
      async: !1
    });
    return
  }
  tu.logEvent(A, Q)
}
// @from(Start 48244, End 48416)
async function eu(A, Q) {
  if (tu === null) {
    NFA.push({
      eventName: A,
      metadata: Q,
      async: !0
    });
    return
  }
  await tu.logEventAsync(A, Q)
}
// @from(Start 48421, End 48424)
NFA
// @from(Start 48426, End 48435)
tu = null
// @from(Start 48441, End 48469)
q0 = L(() => {
  NFA = []
})
// @from(Start 48528, End 48607)
function gX1() {
  if (!fX1) fX1 = UA("perf_hooks").performance;
  return fX1
}
// @from(Start 48609, End 48707)
function M9(A) {
  if (!Uz0) return;
  if (gX1().mark(A), RkA) $z0.set(A, process.memoryUsage())
}
// @from(Start 48709, End 48750)
function hX1(A) {
  return A.toFixed(3)
}
// @from(Start 48752, End 48809)
function Cz0(A) {
  return (A / 1024 / 1024).toFixed(2)
}
// @from(Start 48811, End 49545)
function Ez0() {
  if (!RkA) return "Startup profiling not enabled";
  let Q = gX1().getEntriesByType("mark");
  if (Q.length === 0) return "No profiling checkpoints recorded";
  let B = [];
  B.push("=".repeat(80)), B.push("STARTUP PROFILING REPORT"), B.push("=".repeat(80)), B.push("");
  let G = 0;
  for (let Y of Q) {
    let J = hX1(Y.startTime),
      W = hX1(Y.startTime - G),
      X = $z0.get(Y.name),
      V = X ? ` | RSS: ${Cz0(X.rss)}MB, Heap: ${Cz0(X.heapUsed)}MB` : "";
    B.push(`[+${J.padStart(8)}ms] (+${W.padStart(7)}ms) ${Y.name}${V}`), G = Y.startTime
  }
  let Z = Q[Q.length - 1],
    I = hX1(Z?.startTime ?? 0);
  return B.push(""), B.push(`Total startup time: ${I}ms`), B.push("=".repeat(80)), B.join(`
`)
}
// @from(Start 49547, End 49805)
function wz0() {
  if (VT9(), RkA) {
    let A = XT9(),
      Q = YT9(A),
      B = RA();
    if (!B.existsSync(Q)) B.mkdirSync(Q);
    B.writeFileSync(A, Ez0(), {
      encoding: "utf8",
      flush: !0
    }), g("Startup profiling report:"), g(Ez0())
  }
}
// @from(Start 49807, End 49875)
function XT9() {
  return IT9(MQ(), "startup-perf", `${e1()}.txt`)
}
// @from(Start 49877, End 50294)
function VT9() {
  if (!zz0) return;
  let Q = gX1().getEntriesByType("mark");
  if (Q.length === 0) return;
  let B = new Map;
  for (let Z of Q) B.set(Z.name, Z.startTime);
  let G = {};
  for (let [Z, [I, Y]] of Object.entries(WT9)) {
    let J = B.get(I),
      W = B.get(Y);
    if (J !== void 0 && W !== void 0) G[`${Z}_ms`] = Math.round(W - J)
  }
  G.checkpoint_count = Q.length, GA("tengu_startup_perf", G)
}
// @from(Start 50299, End 50302)
RkA
// @from(Start 50304, End 50315)
JT9 = 0.001
// @from(Start 50319, End 50322)
zz0
// @from(Start 50324, End 50327)
Uz0
// @from(Start 50329, End 50332)
$z0
// @from(Start 50334, End 50344)
fX1 = null
// @from(Start 50348, End 50351)
WT9
// @from(Start 50357, End 50825)
js = L(() => {
  V0();
  q0();
  hQ();
  _0();
  AQ();
  RkA = process.env.CLAUDE_CODE_PROFILE_STARTUP === "1", zz0 = Math.random() < JT9, Uz0 = RkA || zz0, $z0 = new Map;
  WT9 = {
    import_time: ["cli_entry", "main_tsx_imports_loaded"],
    init_time: ["init_function_start", "init_function_end"],
    settings_time: ["eagerLoadSettings_start", "eagerLoadSettings_end"],
    total_time: ["cli_entry", "main_after_run"]
  };
  if (Uz0) M9("profiler_initialized")
})
// @from(Start 50831, End 50834)
FT9
// @from(Start 50836, End 50839)
K2A
// @from(Start 50845, End 51012)
uX1 = L(() => {
  du();
  FT9 = function() {
    try {
      var A = fz(Object, "defineProperty");
      return A({}, "", {}), A
    } catch (Q) {}
  }(), K2A = FT9
})
// @from(Start 51015, End 51178)
function KT9(A, Q, B) {
  if (Q == "__proto__" && K2A) K2A(A, Q, {
    configurable: !0,
    enumerable: !0,
    value: B,
    writable: !0
  });
  else A[Q] = B
}
// @from(Start 51183, End 51185)
Am
// @from(Start 51191, End 51229)
LFA = L(() => {
  uX1();
  Am = KT9
})
// @from(Start 51232, End 51334)
function DT9(A, Q, B) {
  if (B !== void 0 && !jj(A[Q], B) || B === void 0 && !(Q in A)) Am(A, Q, B)
}
// @from(Start 51339, End 51342)
MFA
// @from(Start 51348, End 51396)
mX1 = L(() => {
  LFA();
  vBA();
  MFA = DT9
})
// @from(Start 51399, End 51629)
function HT9(A) {
  return function(Q, B, G) {
    var Z = -1,
      I = Object(Q),
      Y = G(Q),
      J = Y.length;
    while (J--) {
      var W = Y[A ? J : ++Z];
      if (B(I[W], W, I) === !1) break
    }
    return Q
  }
}
// @from(Start 51634, End 51637)
qz0
// @from(Start 51643, End 51673)
Nz0 = L(() => {
  qz0 = HT9
})
// @from(Start 51679, End 51682)
CT9
// @from(Start 51684, End 51687)
TkA
// @from(Start 51693, End 51745)
dX1 = L(() => {
  Nz0();
  CT9 = qz0(), TkA = CT9
})
// @from(Start 51751, End 51759)
jkA = {}
// @from(Start 51797, End 51933)
function zT9(A, Q) {
  if (Q) return A.slice();
  var B = A.length,
    G = Oz0 ? Oz0(B) : new A.constructor(B);
  return A.copy(G), G
}
// @from(Start 51938, End 51941)
Rz0
// @from(Start 51943, End 51946)
Lz0
// @from(Start 51948, End 51951)
ET9
// @from(Start 51953, End 51956)
Mz0
// @from(Start 51958, End 51961)
Oz0
// @from(Start 51963, End 51966)
OFA
// @from(Start 51972, End 52245)
cX1 = L(() => {
  CR();
  Rz0 = typeof jkA == "object" && jkA && !jkA.nodeType && jkA, Lz0 = Rz0 && typeof PkA == "object" && PkA && !PkA.nodeType && PkA, ET9 = Lz0 && Lz0.exports === Rz0, Mz0 = ET9 ? zX.Buffer : void 0, Oz0 = Mz0 ? Mz0.allocUnsafe : void 0;
  OFA = zT9
})
// @from(Start 52248, End 52349)
function UT9(A) {
  var Q = new A.constructor(A.byteLength);
  return new uBA(Q).set(new uBA(A)), Q
}
// @from(Start 52354, End 52357)
D2A
// @from(Start 52363, End 52402)
SkA = L(() => {
  XX1();
  D2A = UT9
})
// @from(Start 52405, End 52521)
function $T9(A, Q) {
  var B = Q ? D2A(A.buffer) : A.buffer;
  return new A.constructor(B, A.byteOffset, A.length)
}
// @from(Start 52526, End 52529)
_kA
// @from(Start 52535, End 52574)
pX1 = L(() => {
  SkA();
  _kA = $T9
})
// @from(Start 52577, End 52696)
function wT9(A, Q) {
  var B = -1,
    G = A.length;
  Q || (Q = Array(G));
  while (++B < G) Q[B] = A[B];
  return Q
}
// @from(Start 52701, End 52704)
kkA
// @from(Start 52710, End 52740)
lX1 = L(() => {
  kkA = wT9
})
// @from(Start 52746, End 52749)
Tz0
// @from(Start 52751, End 52754)
qT9
// @from(Start 52756, End 52759)
Pz0
// @from(Start 52765, End 53041)
jz0 = L(() => {
  bN();
  Tz0 = Object.create, qT9 = function() {
    function A() {}
    return function(Q) {
      if (!SY(Q)) return {};
      if (Tz0) return Tz0(Q);
      A.prototype = Q;
      var B = new A;
      return A.prototype = void 0, B
    }
  }(), Pz0 = qT9
})
// @from(Start 53047, End 53050)
NT9
// @from(Start 53052, End 53055)
H2A
// @from(Start 53061, End 53142)
ykA = L(() => {
  zX1();
  NT9 = e_A(Object.getPrototypeOf, Object), H2A = NT9
})
// @from(Start 53145, End 53238)
function LT9(A) {
  return typeof A.constructor == "function" && !nBA(A) ? Pz0(H2A(A)) : {}
}
// @from(Start 53243, End 53246)
xkA
// @from(Start 53252, End 53309)
iX1 = L(() => {
  jz0();
  ykA();
  t_A();
  xkA = LT9
})
// @from(Start 53312, End 53355)
function MT9(A) {
  return qV(A) && bj(A)
}
// @from(Start 53360, End 53363)
Sz0
// @from(Start 53369, End 53416)
_z0 = L(() => {
  aBA();
  yj();
  Sz0 = MT9
})
// @from(Start 53419, End 53653)
function ST9(A) {
  if (!qV(A) || s$(A) != OT9) return !1;
  var Q = H2A(A);
  if (Q === null) return !0;
  var B = PT9.call(Q, "constructor") && Q.constructor;
  return typeof B == "function" && B instanceof B && kz0.call(B) == jT9
}
// @from(Start 53658, End 53681)
OT9 = "[object Object]"
// @from(Start 53685, End 53688)
RT9
// @from(Start 53690, End 53693)
TT9
// @from(Start 53695, End 53698)
kz0
// @from(Start 53700, End 53703)
PT9
// @from(Start 53705, End 53708)
jT9
// @from(Start 53710, End 53713)
C2A
// @from(Start 53719, End 53896)
vkA = L(() => {
  qs();
  ykA();
  yj();
  RT9 = Function.prototype, TT9 = Object.prototype, kz0 = RT9.toString, PT9 = TT9.hasOwnProperty, jT9 = kz0.call(Object);
  C2A = ST9
})
// @from(Start 53899, End 54032)
function _T9(A, Q) {
  if (Q === "constructor" && typeof A[Q] === "function") return;
  if (Q == "__proto__") return;
  return A[Q]
}
// @from(Start 54037, End 54040)
RFA
// @from(Start 54046, End 54076)
nX1 = L(() => {
  RFA = _T9
})
// @from(Start 54079, End 54198)
function xT9(A, Q, B) {
  var G = A[Q];
  if (!(yT9.call(A, Q) && jj(G, B)) || B === void 0 && !(Q in A)) Am(A, Q, B)
}
// @from(Start 54203, End 54206)
kT9
// @from(Start 54208, End 54211)
yT9
// @from(Start 54213, End 54215)
Qm
// @from(Start 54221, End 54320)
TFA = L(() => {
  LFA();
  vBA();
  kT9 = Object.prototype, yT9 = kT9.hasOwnProperty;
  Qm = xT9
})
// @from(Start 54323, End 54591)
function vT9(A, Q, B, G) {
  var Z = !B;
  B || (B = {});
  var I = -1,
    Y = Q.length;
  while (++I < Y) {
    var J = Q[I],
      W = G ? G(B[J], A[J], J, B, A) : void 0;
    if (W === void 0) W = A[J];
    if (Z) Am(B, J, W);
    else Qm(B, J, W)
  }
  return B
}
// @from(Start 54596, End 54598)
mN
// @from(Start 54604, End 54650)
Ss = L(() => {
  TFA();
  LFA();
  mN = vT9
})
// @from(Start 54653, End 54754)
function bT9(A) {
  var Q = [];
  if (A != null)
    for (var B in Object(A)) Q.push(B);
  return Q
}
// @from(Start 54759, End 54762)
yz0
// @from(Start 54768, End 54798)
xz0 = L(() => {
  yz0 = bT9
})
// @from(Start 54801, End 54977)
function gT9(A) {
  if (!SY(A)) return yz0(A);
  var Q = nBA(A),
    B = [];
  for (var G in A)
    if (!(G == "constructor" && (Q || !hT9.call(A, G)))) B.push(G);
  return B
}
// @from(Start 54982, End 54985)
fT9
// @from(Start 54987, End 54990)
hT9
// @from(Start 54992, End 54995)
vz0
// @from(Start 55001, End 55109)
bz0 = L(() => {
  bN();
  t_A();
  xz0();
  fT9 = Object.prototype, hT9 = fT9.hasOwnProperty;
  vz0 = gT9
})
// @from(Start 55112, End 55168)
function uT9(A) {
  return bj(A) ? o_A(A, !0) : vz0(A)
}
// @from(Start 55173, End 55175)
uj
// @from(Start 55181, End 55237)
E2A = L(() => {
  EX1();
  bz0();
  aBA();
  uj = uT9
})
// @from(Start 55240, End 55281)
function mT9(A) {
  return mN(A, uj(A))
}
// @from(Start 55286, End 55289)
fz0
// @from(Start 55295, End 55342)
hz0 = L(() => {
  Ss();
  E2A();
  fz0 = mT9
})
// @from(Start 55345, End 56024)
function dT9(A, Q, B, G, Z, I, Y) {
  var J = RFA(A, B),
    W = RFA(Q, B),
    X = Y.get(W);
  if (X) {
    MFA(A, B, X);
    return
  }
  var V = I ? I(J, W, B + "", A, Q, Y) : void 0,
    F = V === void 0;
  if (F) {
    var K = b7(W),
      D = !K && xj(W),
      H = !K && !D && iBA(W);
    if (V = W, K || D || H)
      if (b7(J)) V = J;
      else if (Sz0(J)) V = kkA(J);
    else if (D) F = !1, V = OFA(W, !0);
    else if (H) F = !1, V = _kA(W, !0);
    else V = [];
    else if (C2A(W) || rx(W)) {
      if (V = J, rx(J)) V = fz0(J);
      else if (!SY(J) || yBA(J)) V = xkA(W)
    } else F = !1
  }
  if (F) Y.set(W, V), Z(V, W, G, I, Y), Y.delete(W);
  MFA(A, B, V)
}
// @from(Start 56029, End 56032)
gz0
// @from(Start 56038, End 56201)
uz0 = L(() => {
  mX1();
  cX1();
  pX1();
  lX1();
  iX1();
  FFA();
  uC();
  _z0();
  KFA();
  P_A();
  bN();
  vkA();
  r_A();
  nX1();
  hz0();
  gz0 = dT9
})
// @from(Start 56204, End 56483)
function mz0(A, Q, B, G, Z) {
  if (A === Q) return;
  TkA(Q, function(I, Y) {
    if (Z || (Z = new kj), SY(I)) gz0(A, Q, Y, B, mz0, G, Z);
    else {
      var J = G ? G(RFA(A, Y), I, Y + "", A, Q, Z) : void 0;
      if (J === void 0) J = I;
      MFA(A, Y, J)
    }
  }, uj)
}
// @from(Start 56488, End 56491)
dz0
// @from(Start 56497, End 56589)
cz0 = L(() => {
  VFA();
  mX1();
  dX1();
  uz0();
  bN();
  E2A();
  nX1();
  dz0 = mz0
})
// @from(Start 56592, End 56845)
function cT9(A, Q, B) {
  switch (B.length) {
    case 0:
      return A.call(Q);
    case 1:
      return A.call(Q, B[0]);
    case 2:
      return A.call(Q, B[0], B[1]);
    case 3:
      return A.call(Q, B[0], B[1], B[2])
  }
  return A.apply(Q, B)
}
// @from(Start 56850, End 56853)
pz0
// @from(Start 56859, End 56889)
lz0 = L(() => {
  pz0 = cT9
})
// @from(Start 56892, End 57249)
function pT9(A, Q, B) {
  return Q = iz0(Q === void 0 ? A.length - 1 : Q, 0),
    function() {
      var G = arguments,
        Z = -1,
        I = iz0(G.length - Q, 0),
        Y = Array(I);
      while (++Z < I) Y[Z] = G[Q + Z];
      Z = -1;
      var J = Array(Q + 1);
      while (++Z < Q) J[Z] = G[Z];
      return J[Q] = B(Y), pz0(A, this, J)
    }
}
// @from(Start 57254, End 57257)
iz0
// @from(Start 57259, End 57262)
bkA
// @from(Start 57268, End 57325)
aX1 = L(() => {
  lz0();
  iz0 = Math.max;
  bkA = pT9
})
// @from(Start 57328, End 57386)
function lT9(A) {
  return function() {
    return A
  }
}
// @from(Start 57391, End 57394)
nz0
// @from(Start 57400, End 57430)
az0 = L(() => {
  nz0 = lT9
})
// @from(Start 57436, End 57439)
iT9
// @from(Start 57441, End 57444)
sz0
// @from(Start 57450, End 57673)
rz0 = L(() => {
  az0();
  uX1();
  KkA();
  iT9 = !K2A ? B2A : function(A, Q) {
    return K2A(A, "toString", {
      configurable: !0,
      enumerable: !1,
      value: nz0(Q),
      writable: !0
    })
  }, sz0 = iT9
})
// @from(Start 57676, End 57911)
function rT9(A) {
  var Q = 0,
    B = 0;
  return function() {
    var G = sT9(),
      Z = aT9 - (G - B);
    if (B = G, Z > 0) {
      if (++Q >= nT9) return arguments[0]
    } else Q = 0;
    return A.apply(void 0, arguments)
  }
}
// @from(Start 57916, End 57925)
nT9 = 800
// @from(Start 57929, End 57937)
aT9 = 16
// @from(Start 57941, End 57944)
sT9
// @from(Start 57946, End 57949)
oz0
// @from(Start 57955, End 58003)
tz0 = L(() => {
  sT9 = Date.now;
  oz0 = rT9
})
// @from(Start 58009, End 58012)
oT9
// @from(Start 58014, End 58017)
fkA
// @from(Start 58023, End 58087)
sX1 = L(() => {
  rz0();
  tz0();
  oT9 = oz0(sz0), fkA = oT9
})
// @from(Start 58090, End 58149)
function tT9(A, Q) {
  return fkA(bkA(A, Q, B2A), A + "")
}
// @from(Start 58154, End 58157)
ez0
// @from(Start 58163, End 58220)
AU0 = L(() => {
  KkA();
  aX1();
  sX1();
  ez0 = tT9
})
// @from(Start 58223, End 58401)
function eT9(A, Q, B) {
  if (!SY(B)) return !1;
  var G = typeof Q;
  if (G == "number" ? bj(B) && nu(Q, B.length) : G == "string" && (Q in B)) return jj(B[Q], A);
  return !1
}
// @from(Start 58406, End 58409)
QU0
// @from(Start 58415, End 58480)
BU0 = L(() => {
  vBA();
  aBA();
  DFA();
  bN();
  QU0 = eT9
})
// @from(Start 58483, End 58878)
function AP9(A) {
  return ez0(function(Q, B) {
    var G = -1,
      Z = B.length,
      I = Z > 1 ? B[Z - 1] : void 0,
      Y = Z > 2 ? B[2] : void 0;
    if (I = A.length > 3 && typeof I == "function" ? (Z--, I) : void 0, Y && QU0(B[0], B[1], Y)) I = Z < 3 ? void 0 : I, Z = 1;
    Q = Object(Q);
    while (++G < Z) {
      var J = B[G];
      if (J) A(Q, J, G, I)
    }
    return Q
  })
}
// @from(Start 58883, End 58886)
GU0
// @from(Start 58892, End 58940)
ZU0 = L(() => {
  AU0();
  BU0();
  GU0 = AP9
})
// @from(Start 58946, End 58949)
QP9
// @from(Start 58951, End 58954)
rX1
// @from(Start 58960, End 59067)
IU0 = L(() => {
  cz0();
  ZU0();
  QP9 = GU0(function(A, Q, B, G) {
    dz0(A, Q, B, G)
  }), rX1 = QP9
})
// @from(Start 59070, End 59341)
function hkA(A) {
  return A.sort((Q, B) => {
    let G = B.modified.getTime() - Q.modified.getTime();
    if (G !== 0) return G;
    let Z = B.created.getTime() - Q.created.getTime();
    if (Z !== 0) return Z;
    return Q.created.getTime() - B.created.getTime()
  })
}
// @from(Start 59399, End 59485)
function PFA(A, Q) {
  return A.customTitle || A.summary || A.firstPrompt || Q || ""
}
// @from(Start 59487, End 59553)
function GP9(A) {
  return A.toISOString().replace(/[:.]/g, "-")
}
// @from(Start 59555, End 59613)
function ZP9() {
  return oX1(mj.errors(), tX1 + ".txt")
}
// @from(Start 59615, End 60107)
function AA(A) {
  try {
    if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY) || process.env.DISABLE_ERROR_REPORTING || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
    let Q = A.stack || A.message,
      B = {
        error: Q,
        timestamp: new Date().toISOString()
      };
    g(`${A.name}: ${Q}`, {
      level: "error"
    }), Az0(B), IP9(ZP9(), {
      error: Q
    })
  } catch {}
}
// @from(Start 60109, End 60142)
function z2A() {
  return eE0()
}
// @from(Start 60144, End 60315)
function eX1(A) {
  if (!RA().existsSync(A)) return [];
  try {
    return JSON.parse(RA().readFileSync(A, {
      encoding: "utf8"
    }))
  } catch {
    return []
  }
}
// @from(Start 60317, End 60348)
function IP9(A, Q) {
  return
}
// @from(Start 60350, End 61062)
function WI(A, Q) {
  if (g(`MCP server "${A}" ${Q}`, {
      level: "error"
    }), (l0() || {}).cleanupPeriodDays === 0) return;
  try {
    let G = mj.mcpLogs(A),
      Z = Q instanceof Error ? Q.stack || Q.message : String(Q),
      I = new Date().toISOString(),
      Y = oX1(G, tX1 + ".txt");
    if (!RA().existsSync(G)) RA().mkdirSync(G);
    if (!RA().existsSync(Y)) RA().writeFileSync(Y, "[]", {
      encoding: "utf8",
      flush: !1
    });
    let J = {
        error: Z,
        timestamp: I,
        sessionId: e1(),
        cwd: RA().cwd()
      },
      W = eX1(Y);
    W.push(J), RA().writeFileSync(Y, JSON.stringify(W, null, 2), {
      encoding: "utf8",
      flush: !1
    })
  } catch {}
}
// @from(Start 61064, End 61632)
function y0(A, Q) {
  g(`MCP server "${A}": ${Q}`);
  try {
    let B = mj.mcpLogs(A),
      G = new Date().toISOString(),
      Z = oX1(B, tX1 + ".txt");
    if (!RA().existsSync(B)) RA().mkdirSync(B);
    if (!RA().existsSync(Z)) RA().writeFileSync(Z, "[]", {
      encoding: "utf8",
      flush: !1
    });
    let I = {
        debug: Q,
        timestamp: G,
        sessionId: e1(),
        cwd: RA().cwd()
      },
      Y = eX1(Z);
    Y.push(I), RA().writeFileSync(Z, JSON.stringify(Y, null, 2), {
      encoding: "utf8",
      flush: !1
    })
  } catch {}
}
// @from(Start 61634, End 61741)
function AV1(A, Q) {
  if (!Q || Q !== "repl_main_thread") return;
  let B = structuredClone(A);
  tE0(B)
}
// @from(Start 61746, End 61749)
tX1
// @from(Start 61755, End 61850)
g1 = L(() => {
  _0();
  R9();
  AQ();
  MB();
  hQ();
  _0();
  V0();
  tX1 = GP9(new Date)
})
// @from(Start 61904, End 61988)
function o9(A = JP9) {
  let Q = new AbortController;
  return YP9(A, Q.signal), Q
}
// @from(Start 61990, End 62025)
function YU0() {
  return o9(WP9)
}
// @from(Start 62027, End 62165)
function JU0(A, Q) {
  let B = o9(Q);
  return A.signal.addEventListener("abort", () => B.abort(A.signal.reason), {
    once: !0
  }), B
}
// @from(Start 62170, End 62178)
JP9 = 50
// @from(Start 62182, End 62191)
WP9 = 500
// @from(Start 62197, End 62210)
OZ = () => {}
// @from(Start 62300, End 62570)
function GV1(A, {
  suffix: Q = "nodejs"
} = {}) {
  if (typeof A !== "string") throw TypeError(`Expected a string, got ${typeof A}`);
  if (Q) A += `-${Q}`;
  if (QV1.platform === "darwin") return XP9(A);
  if (QV1.platform === "win32") return VP9(A);
  return FP9(A)
}
// @from(Start 62575, End 62577)
Bm
// @from(Start 62579, End 62582)
BV1
// @from(Start 62584, End 62587)
U2A
// @from(Start 62589, End 62856)
XP9 = (A) => {
    let Q = _Y.join(Bm, "Library");
    return {
      data: _Y.join(Q, "Application Support", A),
      config: _Y.join(Q, "Preferences", A),
      cache: _Y.join(Q, "Caches", A),
      log: _Y.join(Q, "Logs", A),
      temp: _Y.join(BV1, A)
    }
  }
// @from(Start 62860, End 63194)
VP9 = (A) => {
    let Q = U2A.APPDATA || _Y.join(Bm, "AppData", "Roaming"),
      B = U2A.LOCALAPPDATA || _Y.join(Bm, "AppData", "Local");
    return {
      data: _Y.join(B, A, "Data"),
      config: _Y.join(Q, A, "Config"),
      cache: _Y.join(B, A, "Cache"),
      log: _Y.join(B, A, "Log"),
      temp: _Y.join(BV1, A)
    }
  }
// @from(Start 63198, End 63592)
FP9 = (A) => {
    let Q = _Y.basename(Bm);
    return {
      data: _Y.join(U2A.XDG_DATA_HOME || _Y.join(Bm, ".local", "share"), A),
      config: _Y.join(U2A.XDG_CONFIG_HOME || _Y.join(Bm, ".config"), A),
      cache: _Y.join(U2A.XDG_CACHE_HOME || _Y.join(Bm, ".cache"), A),
      log: _Y.join(U2A.XDG_STATE_HOME || _Y.join(Bm, ".local", "state"), A),
      temp: _Y.join(BV1, Q, A)
    }
  }
// @from(Start 63598, End 63683)
XU0 = L(() => {
  Bm = WU0.homedir(), BV1 = WU0.tmpdir(), {
    env: U2A
  } = QV1
})
// @from(Start 63689, End 63884)
IG = z((VU0) => {
  Object.defineProperty(VU0, "__esModule", {
    value: !0
  });
  VU0.isFunction = void 0;

  function KP9(A) {
    return typeof A === "function"
  }
  VU0.isFunction = KP9
})
// @from(Start 63890, End 64248)
Gm = z((KU0) => {
  Object.defineProperty(KU0, "__esModule", {
    value: !0
  });
  KU0.createErrorClass = void 0;

  function DP9(A) {
    var Q = function(G) {
        Error.call(G), G.stack = Error().stack
      },
      B = A(Q);
    return B.prototype = Object.create(Error.prototype), B.prototype.constructor = B, B
  }
  KU0.createErrorClass = DP9
})
// @from(Start 64254, End 64727)
ZV1 = z((HU0) => {
  Object.defineProperty(HU0, "__esModule", {
    value: !0
  });
  HU0.UnsubscriptionError = void 0;
  var HP9 = Gm();
  HU0.UnsubscriptionError = HP9.createErrorClass(function(A) {
    return function(B) {
      A(this), this.message = B ? B.length + ` errors occurred during unsubscription:
` + B.map(function(G, Z) {
        return Z + 1 + ") " + G.toString()
      }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = B
    }
  })
})
// @from(Start 64733, End 64972)
tx = z((EU0) => {
  Object.defineProperty(EU0, "__esModule", {
    value: !0
  });
  EU0.arrRemove = void 0;

  function CP9(A, Q) {
    if (A) {
      var B = A.indexOf(Q);
      0 <= B && A.splice(B, 1)
    }
  }
  EU0.arrRemove = CP9
})
// @from(Start 64978, End 69753)
r$ = z((hz) => {
  var UU0 = hz && hz.__values || function(A) {
      var Q = typeof Symbol === "function" && Symbol.iterator,
        B = Q && A[Q],
        G = 0;
      if (B) return B.call(A);
      if (A && typeof A.length === "number") return {
        next: function() {
          if (A && G >= A.length) A = void 0;
          return {
            value: A && A[G++],
            done: !A
          }
        }
      };
      throw TypeError(Q ? "Object is not iterable." : "Symbol.iterator is not defined.")
    },
    $U0 = hz && hz.__read || function(A, Q) {
      var B = typeof Symbol === "function" && A[Symbol.iterator];
      if (!B) return A;
      var G = B.call(A),
        Z, I = [],
        Y;
      try {
        while ((Q === void 0 || Q-- > 0) && !(Z = G.next()).done) I.push(Z.value)
      } catch (J) {
        Y = {
          error: J
        }
      } finally {
        try {
          if (Z && !Z.done && (B = G.return)) B.call(G)
        } finally {
          if (Y) throw Y.error
        }
      }
      return I
    },
    wU0 = hz && hz.__spreadArray || function(A, Q) {
      for (var B = 0, G = Q.length, Z = A.length; B < G; B++, Z++) A[Z] = Q[B];
      return A
    };
  Object.defineProperty(hz, "__esModule", {
    value: !0
  });
  hz.isSubscription = hz.EMPTY_SUBSCRIPTION = hz.Subscription = void 0;
  var jFA = IG(),
    IV1 = ZV1(),
    qU0 = tx(),
    YV1 = function() {
      function A(Q) {
        this.initialTeardown = Q, this.closed = !1, this._parentage = null, this._finalizers = null
      }
      return A.prototype.unsubscribe = function() {
        var Q, B, G, Z, I;
        if (!this.closed) {
          this.closed = !0;
          var Y = this._parentage;
          if (Y)
            if (this._parentage = null, Array.isArray(Y)) try {
              for (var J = UU0(Y), W = J.next(); !W.done; W = J.next()) {
                var X = W.value;
                X.remove(this)
              }
            } catch (C) {
              Q = {
                error: C
              }
            } finally {
              try {
                if (W && !W.done && (B = J.return)) B.call(J)
              } finally {
                if (Q) throw Q.error
              }
            } else Y.remove(this);
          var V = this.initialTeardown;
          if (jFA.isFunction(V)) try {
            V()
          } catch (C) {
            I = C instanceof IV1.UnsubscriptionError ? C.errors : [C]
          }
          var F = this._finalizers;
          if (F) {
            this._finalizers = null;
            try {
              for (var K = UU0(F), D = K.next(); !D.done; D = K.next()) {
                var H = D.value;
                try {
                  NU0(H)
                } catch (C) {
                  if (I = I !== null && I !== void 0 ? I : [], C instanceof IV1.UnsubscriptionError) I = wU0(wU0([], $U0(I)), $U0(C.errors));
                  else I.push(C)
                }
              }
            } catch (C) {
              G = {
                error: C
              }
            } finally {
              try {
                if (D && !D.done && (Z = K.return)) Z.call(K)
              } finally {
                if (G) throw G.error
              }
            }
          }
          if (I) throw new IV1.UnsubscriptionError(I)
        }
      }, A.prototype.add = function(Q) {
        var B;
        if (Q && Q !== this)
          if (this.closed) NU0(Q);
          else {
            if (Q instanceof A) {
              if (Q.closed || Q._hasParent(this)) return;
              Q._addParent(this)
            }(this._finalizers = (B = this._finalizers) !== null && B !== void 0 ? B : []).push(Q)
          }
      }, A.prototype._hasParent = function(Q) {
        var B = this._parentage;
        return B === Q || Array.isArray(B) && B.includes(Q)
      }, A.prototype._addParent = function(Q) {
        var B = this._parentage;
        this._parentage = Array.isArray(B) ? (B.push(Q), B) : B ? [B, Q] : Q
      }, A.prototype._removeParent = function(Q) {
        var B = this._parentage;
        if (B === Q) this._parentage = null;
        else if (Array.isArray(B)) qU0.arrRemove(B, Q)
      }, A.prototype.remove = function(Q) {
        var B = this._finalizers;
        if (B && qU0.arrRemove(B, Q), Q instanceof A) Q._removeParent(this)
      }, A.EMPTY = function() {
        var Q = new A;
        return Q.closed = !0, Q
      }(), A
    }();
  hz.Subscription = YV1;
  hz.EMPTY_SUBSCRIPTION = YV1.EMPTY;

  function EP9(A) {
    return A instanceof YV1 || A && "closed" in A && jFA.isFunction(A.remove) && jFA.isFunction(A.add) && jFA.isFunction(A.unsubscribe)
  }
  hz.isSubscription = EP9;

  function NU0(A) {
    if (jFA.isFunction(A)) A();
    else A.unsubscribe()
  }
})
// @from(Start 69759, End 70051)
$2A = z((LU0) => {
  Object.defineProperty(LU0, "__esModule", {
    value: !0
  });
  LU0.config = void 0;
  LU0.config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1
  }
})
// @from(Start 70057, End 71424)
JV1 = z((dj) => {
  var OU0 = dj && dj.__read || function(A, Q) {
      var B = typeof Symbol === "function" && A[Symbol.iterator];
      if (!B) return A;
      var G = B.call(A),
        Z, I = [],
        Y;
      try {
        while ((Q === void 0 || Q-- > 0) && !(Z = G.next()).done) I.push(Z.value)
      } catch (J) {
        Y = {
          error: J
        }
      } finally {
        try {
          if (Z && !Z.done && (B = G.return)) B.call(G)
        } finally {
          if (Y) throw Y.error
        }
      }
      return I
    },
    RU0 = dj && dj.__spreadArray || function(A, Q) {
      for (var B = 0, G = Q.length, Z = A.length; B < G; B++, Z++) A[Z] = Q[B];
      return A
    };
  Object.defineProperty(dj, "__esModule", {
    value: !0
  });
  dj.timeoutProvider = void 0;
  dj.timeoutProvider = {
    setTimeout: function(A, Q) {
      var B = [];
      for (var G = 2; G < arguments.length; G++) B[G - 2] = arguments[G];
      var Z = dj.timeoutProvider.delegate;
      if (Z === null || Z === void 0 ? void 0 : Z.setTimeout) return Z.setTimeout.apply(Z, RU0([A, Q], OU0(B)));
      return setTimeout.apply(void 0, RU0([A, Q], OU0(B)))
    },
    clearTimeout: function(A) {
      var Q = dj.timeoutProvider.delegate;
      return ((Q === null || Q === void 0 ? void 0 : Q.clearTimeout) || clearTimeout)(A)
    },
    delegate: void 0
  }
})
// @from(Start 71430, End 71783)
WV1 = z((TU0) => {
  Object.defineProperty(TU0, "__esModule", {
    value: !0
  });
  TU0.reportUnhandledError = void 0;
  var zP9 = $2A(),
    UP9 = JV1();

  function $P9(A) {
    UP9.timeoutProvider.setTimeout(function() {
      var Q = zP9.config.onUnhandledError;
      if (Q) Q(A);
      else throw A
    })
  }
  TU0.reportUnhandledError = $P9
})
// @from(Start 71789, End 71933)
gK = z((jU0) => {
  Object.defineProperty(jU0, "__esModule", {
    value: !0
  });
  jU0.noop = void 0;

  function wP9() {}
  jU0.noop = wP9
})
// @from(Start 71939, End 72521)
yU0 = z((_U0) => {
  Object.defineProperty(_U0, "__esModule", {
    value: !0
  });
  _U0.createNotification = _U0.nextNotification = _U0.errorNotification = _U0.COMPLETE_NOTIFICATION = void 0;
  _U0.COMPLETE_NOTIFICATION = function() {
    return gkA("C", void 0, void 0)
  }();

  function qP9(A) {
    return gkA("E", void 0, A)
  }
  _U0.errorNotification = qP9;

  function NP9(A) {
    return gkA("N", A, void 0)
  }
  _U0.nextNotification = NP9;

  function gkA(A, Q, B) {
    return {
      kind: A,
      value: Q,
      error: B
    }
  }
  _U0.createNotification = gkA
})
// @from(Start 72527, End 73196)
ukA = z((vU0) => {
  Object.defineProperty(vU0, "__esModule", {
    value: !0
  });
  vU0.captureError = vU0.errorContext = void 0;
  var xU0 = $2A(),
    _s = null;

  function RP9(A) {
    if (xU0.config.useDeprecatedSynchronousErrorHandling) {
      var Q = !_s;
      if (Q) _s = {
        errorThrown: !1,
        error: null
      };
      if (A(), Q) {
        var B = _s,
          G = B.errorThrown,
          Z = B.error;
        if (_s = null, G) throw Z
      }
    } else A()
  }
  vU0.errorContext = RP9;

  function TP9(A) {
    if (xU0.config.useDeprecatedSynchronousErrorHandling && _s) _s.errorThrown = !0, _s.error = A
  }
  vU0.captureError = TP9
})