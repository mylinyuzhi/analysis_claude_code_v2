
// @from(Ln 8, Col 4)
JM9 = Object.create
// @from(Ln 15, Col 4)
c = (A, Q, B) => {
    B = A != null ? JM9(XM9(A)) : {};
    let G = Q || !A || !A.__esModule ? zCA(B, "default", {
      value: A,
      enumerable: !0
    }) : B;
    for (let Z of yy0(A))
      if (!vy0.call(G, Z)) zCA(G, Z, {
        get: () => A[Z],
        enumerable: !0
      });
    return G
  }
// @from(Ln 28, Col 2)
xy0 = new WeakMap
// @from(Ln 29, Col 2)
ky0 = (A) => {
    var Q = xy0.get(A),
      B;
    if (Q) return Q;
    if (Q = zCA({}, "__esModule", {
        value: !0
      }), A && typeof A === "object" || typeof A === "function") yy0(A).map((G) => !vy0.call(Q, G) && zCA(Q, G, {
      get: () => A[G],
      enumerable: !(B = IM9(A, G)) || B.enumerable
    }));
    return xy0.set(A, Q), Q
  }
// @from(Ln 41, Col 2)
U = (A, Q) => () => (Q || A((Q = {
    exports: {}
  }).exports, Q), Q.exports)
// @from(Ln 44, Col 4)
_5 = (A, Q) => {
  for (var B in Q) zCA(A, B, {
    get: Q[B],
    enumerable: !0,
    configurable: !0,
    set: (G) => Q[B] = () => G
  })
}
// @from(Ln 52, Col 4)
w = (A, Q) => () => (A && (Q = A(A = 0)), Q)
// @from(Ln 53, Col 4)
NA = DM9(import.meta.url)
// @from(Ln 54, Col 4)
WM9
// @from(Ln 54, Col 9)
SmA
// @from(Ln 55, Col 4)
OU1 = w(() => {
  WM9 = typeof global == "object" && global && global.Object === Object && global, SmA = WM9
})
// @from(Ln 58, Col 4)
KM9
// @from(Ln 58, Col 9)
VM9
// @from(Ln 58, Col 14)
OW
// @from(Ln 59, Col 4)
VT = w(() => {
  OU1();
  KM9 = typeof self == "object" && self && self.Object === Object && self, VM9 = SmA || KM9 || Function("return this")(), OW = VM9
})
// @from(Ln 63, Col 4)
FM9
// @from(Ln 63, Col 9)
mV
// @from(Ln 64, Col 4)
bAA = w(() => {
  VT();
  FM9 = OW.Symbol, mV = FM9
})
// @from(Ln 69, Col 0)
function zM9(A) {
  var Q = HM9.call(A, $CA),
    B = A[$CA];
  try {
    A[$CA] = void 0;
    var G = !0
  } catch (Y) {}
  var Z = EM9.call(A);
  if (G)
    if (Q) A[$CA] = B;
    else delete A[$CA];
  return Z
}
// @from(Ln 82, Col 4)
by0
// @from(Ln 82, Col 9)
HM9
// @from(Ln 82, Col 14)
EM9
// @from(Ln 82, Col 19)
$CA
// @from(Ln 82, Col 24)
fy0
// @from(Ln 83, Col 4)
hy0 = w(() => {
  bAA();
  by0 = Object.prototype, HM9 = by0.hasOwnProperty, EM9 = by0.toString, $CA = mV ? mV.toStringTag : void 0;
  fy0 = zM9
})
// @from(Ln 89, Col 0)
function UM9(A) {
  return CM9.call(A)
}
// @from(Ln 92, Col 4)
$M9
// @from(Ln 92, Col 9)
CM9
// @from(Ln 92, Col 14)
gy0
// @from(Ln 93, Col 4)
uy0 = w(() => {
  $M9 = Object.prototype, CM9 = $M9.toString;
  gy0 = UM9
})
// @from(Ln 98, Col 0)
function wM9(A) {
  if (A == null) return A === void 0 ? NM9 : qM9;
  return my0 && my0 in Object(A) ? fy0(A) : gy0(A)
}
// @from(Ln 102, Col 4)
qM9 = "[object Null]"
// @from(Ln 103, Col 2)
NM9 = "[object Undefined]"
// @from(Ln 104, Col 2)
my0
// @from(Ln 104, Col 7)
cw
// @from(Ln 105, Col 4)
fAA = w(() => {
  bAA();
  hy0();
  uy0();
  my0 = mV ? mV.toStringTag : void 0;
  cw = wM9
})
// @from(Ln 113, Col 0)
function LM9(A) {
  var Q = typeof A;
  return A != null && (Q == "object" || Q == "function")
}
// @from(Ln 117, Col 4)
lX
// @from(Ln 118, Col 4)
_M = w(() => {
  lX = LM9
})
// @from(Ln 122, Col 0)
function jM9(A) {
  if (!lX(A)) return !1;
  var Q = cw(A);
  return Q == MM9 || Q == RM9 || Q == OM9 || Q == _M9
}
// @from(Ln 127, Col 4)
OM9 = "[object AsyncFunction]"
// @from(Ln 128, Col 2)
MM9 = "[object Function]"
// @from(Ln 129, Col 2)
RM9 = "[object GeneratorFunction]"
// @from(Ln 130, Col 2)
_M9 = "[object Proxy]"
// @from(Ln 131, Col 2)
w5A
// @from(Ln 132, Col 4)
xmA = w(() => {
  fAA();
  _M();
  w5A = jM9
})
// @from(Ln 137, Col 4)
TM9
// @from(Ln 137, Col 9)
ymA
// @from(Ln 138, Col 4)
dy0 = w(() => {
  VT();
  TM9 = OW["__core-js_shared__"], ymA = TM9
})
// @from(Ln 143, Col 0)
function PM9(A) {
  return !!cy0 && cy0 in A
}
// @from(Ln 146, Col 4)
cy0
// @from(Ln 146, Col 9)
py0
// @from(Ln 147, Col 4)
ly0 = w(() => {
  dy0();
  cy0 = function () {
    var A = /[^.]+$/.exec(ymA && ymA.keys && ymA.keys.IE_PROTO || "");
    return A ? "Symbol(src)_1." + A : ""
  }();
  py0 = PM9
})
// @from(Ln 156, Col 0)
function yM9(A) {
  if (A != null) {
    try {
      return xM9.call(A)
    } catch (Q) {}
    try {
      return A + ""
    } catch (Q) {}
  }
  return ""
}
// @from(Ln 167, Col 4)
SM9
// @from(Ln 167, Col 9)
xM9
// @from(Ln 167, Col 14)
th
// @from(Ln 168, Col 4)
MU1 = w(() => {
  SM9 = Function.prototype, xM9 = SM9.toString;
  th = yM9
})
// @from(Ln 173, Col 0)
function mM9(A) {
  if (!lX(A) || py0(A)) return !1;
  var Q = w5A(A) ? uM9 : kM9;
  return Q.test(th(A))
}
// @from(Ln 178, Col 4)
vM9
// @from(Ln 178, Col 9)
kM9
// @from(Ln 178, Col 14)
bM9
// @from(Ln 178, Col 19)
fM9
// @from(Ln 178, Col 24)
hM9
// @from(Ln 178, Col 29)
gM9
// @from(Ln 178, Col 34)
uM9
// @from(Ln 178, Col 39)
iy0
// @from(Ln 179, Col 4)
ny0 = w(() => {
  xmA();
  ly0();
  _M();
  MU1();
  vM9 = /[\\^$.*+?()[\]{}|]/g, kM9 = /^\[object .+?Constructor\]$/, bM9 = Function.prototype, fM9 = Object.prototype, hM9 = bM9.toString, gM9 = fM9.hasOwnProperty, uM9 = RegExp("^" + hM9.call(gM9).replace(vM9, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  iy0 = mM9
})
// @from(Ln 188, Col 0)
function dM9(A, Q) {
  return A == null ? void 0 : A[Q]
}
// @from(Ln 191, Col 4)
ay0
// @from(Ln 192, Col 4)
oy0 = w(() => {
  ay0 = dM9
})
// @from(Ln 196, Col 0)
function cM9(A, Q) {
  var B = ay0(A, Q);
  return iy0(B) ? B : void 0
}
// @from(Ln 200, Col 4)
Yq
// @from(Ln 201, Col 4)
Ol = w(() => {
  ny0();
  oy0();
  Yq = cM9
})
// @from(Ln 206, Col 4)
pM9
// @from(Ln 206, Col 9)
eh
// @from(Ln 207, Col 4)
CCA = w(() => {
  Ol();
  pM9 = Yq(Object, "create"), eh = pM9
})
// @from(Ln 212, Col 0)
function lM9() {
  this.__data__ = eh ? eh(null) : {}, this.size = 0
}
// @from(Ln 215, Col 4)
ry0
// @from(Ln 216, Col 4)
sy0 = w(() => {
  CCA();
  ry0 = lM9
})
// @from(Ln 221, Col 0)
function iM9(A) {
  var Q = this.has(A) && delete this.__data__[A];
  return this.size -= Q ? 1 : 0, Q
}
// @from(Ln 225, Col 4)
ty0
// @from(Ln 226, Col 4)
ey0 = w(() => {
  ty0 = iM9
})
// @from(Ln 230, Col 0)
function rM9(A) {
  var Q = this.__data__;
  if (eh) {
    var B = Q[A];
    return B === nM9 ? void 0 : B
  }
  return oM9.call(Q, A) ? Q[A] : void 0
}
// @from(Ln 238, Col 4)
nM9 = "__lodash_hash_undefined__"
// @from(Ln 239, Col 2)
aM9
// @from(Ln 239, Col 7)
oM9
// @from(Ln 239, Col 12)
Av0
// @from(Ln 240, Col 4)
Qv0 = w(() => {
  CCA();
  aM9 = Object.prototype, oM9 = aM9.hasOwnProperty;
  Av0 = rM9
})
// @from(Ln 246, Col 0)
function eM9(A) {
  var Q = this.__data__;
  return eh ? Q[A] !== void 0 : tM9.call(Q, A)
}
// @from(Ln 250, Col 4)
sM9
// @from(Ln 250, Col 9)
tM9
// @from(Ln 250, Col 14)
Bv0
// @from(Ln 251, Col 4)
Gv0 = w(() => {
  CCA();
  sM9 = Object.prototype, tM9 = sM9.hasOwnProperty;
  Bv0 = eM9
})
// @from(Ln 257, Col 0)
function QR9(A, Q) {
  var B = this.__data__;
  return this.size += this.has(A) ? 0 : 1, B[A] = eh && Q === void 0 ? AR9 : Q, this
}
// @from(Ln 261, Col 4)
AR9 = "__lodash_hash_undefined__"
// @from(Ln 262, Col 2)
Zv0
// @from(Ln 263, Col 4)
Yv0 = w(() => {
  CCA();
  Zv0 = QR9
})
// @from(Ln 268, Col 0)
function L5A(A) {
  var Q = -1,
    B = A == null ? 0 : A.length;
  this.clear();
  while (++Q < B) {
    var G = A[Q];
    this.set(G[0], G[1])
  }
}
// @from(Ln 277, Col 4)
RU1
// @from(Ln 278, Col 4)
Jv0 = w(() => {
  sy0();
  ey0();
  Qv0();
  Gv0();
  Yv0();
  L5A.prototype.clear = ry0;
  L5A.prototype.delete = ty0;
  L5A.prototype.get = Av0;
  L5A.prototype.has = Bv0;
  L5A.prototype.set = Zv0;
  RU1 = L5A
})
// @from(Ln 292, Col 0)
function BR9() {
  this.__data__ = [], this.size = 0
}
// @from(Ln 295, Col 4)
Xv0
// @from(Ln 296, Col 4)
Iv0 = w(() => {
  Xv0 = BR9
})
// @from(Ln 300, Col 0)
function GR9(A, Q) {
  return A === Q || A !== A && Q !== Q
}
// @from(Ln 303, Col 4)
Uy
// @from(Ln 304, Col 4)
O5A = w(() => {
  Uy = GR9
})
// @from(Ln 308, Col 0)
function ZR9(A, Q) {
  var B = A.length;
  while (B--)
    if (Uy(A[B][0], Q)) return B;
  return -1
}
// @from(Ln 314, Col 4)
Ml
// @from(Ln 315, Col 4)
UCA = w(() => {
  O5A();
  Ml = ZR9
})
// @from(Ln 320, Col 0)
function XR9(A) {
  var Q = this.__data__,
    B = Ml(Q, A);
  if (B < 0) return !1;
  var G = Q.length - 1;
  if (B == G) Q.pop();
  else JR9.call(Q, B, 1);
  return --this.size, !0
}
// @from(Ln 329, Col 4)
YR9
// @from(Ln 329, Col 9)
JR9
// @from(Ln 329, Col 14)
Dv0
// @from(Ln 330, Col 4)
Wv0 = w(() => {
  UCA();
  YR9 = Array.prototype, JR9 = YR9.splice;
  Dv0 = XR9
})
// @from(Ln 336, Col 0)
function IR9(A) {
  var Q = this.__data__,
    B = Ml(Q, A);
  return B < 0 ? void 0 : Q[B][1]
}
// @from(Ln 341, Col 4)
Kv0
// @from(Ln 342, Col 4)
Vv0 = w(() => {
  UCA();
  Kv0 = IR9
})
// @from(Ln 347, Col 0)
function DR9(A) {
  return Ml(this.__data__, A) > -1
}
// @from(Ln 350, Col 4)
Fv0
// @from(Ln 351, Col 4)
Hv0 = w(() => {
  UCA();
  Fv0 = DR9
})
// @from(Ln 356, Col 0)
function WR9(A, Q) {
  var B = this.__data__,
    G = Ml(B, A);
  if (G < 0) ++this.size, B.push([A, Q]);
  else B[G][1] = Q;
  return this
}
// @from(Ln 363, Col 4)
Ev0
// @from(Ln 364, Col 4)
zv0 = w(() => {
  UCA();
  Ev0 = WR9
})
// @from(Ln 369, Col 0)
function M5A(A) {
  var Q = -1,
    B = A == null ? 0 : A.length;
  this.clear();
  while (++Q < B) {
    var G = A[Q];
    this.set(G[0], G[1])
  }
}
// @from(Ln 378, Col 4)
Rl
// @from(Ln 379, Col 4)
qCA = w(() => {
  Iv0();
  Wv0();
  Vv0();
  Hv0();
  zv0();
  M5A.prototype.clear = Xv0;
  M5A.prototype.delete = Dv0;
  M5A.prototype.get = Kv0;
  M5A.prototype.has = Fv0;
  M5A.prototype.set = Ev0;
  Rl = M5A
})
// @from(Ln 392, Col 4)
KR9
// @from(Ln 392, Col 9)
_l
// @from(Ln 393, Col 4)
vmA = w(() => {
  Ol();
  VT();
  KR9 = Yq(OW, "Map"), _l = KR9
})
// @from(Ln 399, Col 0)
function VR9() {
  this.size = 0, this.__data__ = {
    hash: new RU1,
    map: new(_l || Rl),
    string: new RU1
  }
}
// @from(Ln 406, Col 4)
$v0
// @from(Ln 407, Col 4)
Cv0 = w(() => {
  Jv0();
  qCA();
  vmA();
  $v0 = VR9
})
// @from(Ln 414, Col 0)
function FR9(A) {
  var Q = typeof A;
  return Q == "string" || Q == "number" || Q == "symbol" || Q == "boolean" ? A !== "__proto__" : A === null
}
// @from(Ln 418, Col 4)
Uv0
// @from(Ln 419, Col 4)
qv0 = w(() => {
  Uv0 = FR9
})
// @from(Ln 423, Col 0)
function HR9(A, Q) {
  var B = A.__data__;
  return Uv0(Q) ? B[typeof Q == "string" ? "string" : "hash"] : B.map
}
// @from(Ln 427, Col 4)
jl
// @from(Ln 428, Col 4)
NCA = w(() => {
  qv0();
  jl = HR9
})
// @from(Ln 433, Col 0)
function ER9(A) {
  var Q = jl(this, A).delete(A);
  return this.size -= Q ? 1 : 0, Q
}
// @from(Ln 437, Col 4)
Nv0
// @from(Ln 438, Col 4)
wv0 = w(() => {
  NCA();
  Nv0 = ER9
})
// @from(Ln 443, Col 0)
function zR9(A) {
  return jl(this, A).get(A)
}
// @from(Ln 446, Col 4)
Lv0
// @from(Ln 447, Col 4)
Ov0 = w(() => {
  NCA();
  Lv0 = zR9
})
// @from(Ln 452, Col 0)
function $R9(A) {
  return jl(this, A).has(A)
}
// @from(Ln 455, Col 4)
Mv0
// @from(Ln 456, Col 4)
Rv0 = w(() => {
  NCA();
  Mv0 = $R9
})
// @from(Ln 461, Col 0)
function CR9(A, Q) {
  var B = jl(this, A),
    G = B.size;
  return B.set(A, Q), this.size += B.size == G ? 0 : 1, this
}
// @from(Ln 466, Col 4)
_v0
// @from(Ln 467, Col 4)
jv0 = w(() => {
  NCA();
  _v0 = CR9
})
// @from(Ln 472, Col 0)
function R5A(A) {
  var Q = -1,
    B = A == null ? 0 : A.length;
  this.clear();
  while (++Q < B) {
    var G = A[Q];
    this.set(G[0], G[1])
  }
}
// @from(Ln 481, Col 4)
hAA
// @from(Ln 482, Col 4)
kmA = w(() => {
  Cv0();
  wv0();
  Ov0();
  Rv0();
  jv0();
  R5A.prototype.clear = $v0;
  R5A.prototype.delete = Nv0;
  R5A.prototype.get = Lv0;
  R5A.prototype.has = Mv0;
  R5A.prototype.set = _v0;
  hAA = R5A
})
// @from(Ln 496, Col 0)
function _U1(A, Q) {
  if (typeof A != "function" || Q != null && typeof Q != "function") throw TypeError(UR9);
  var B = function () {
    var G = arguments,
      Z = Q ? Q.apply(this, G) : G[0],
      Y = B.cache;
    if (Y.has(Z)) return Y.get(Z);
    var J = A.apply(this, G);
    return B.cache = Y.set(Z, J) || Y, J
  };
  return B.cache = new(_U1.Cache || hAA), B
}
// @from(Ln 508, Col 4)
UR9 = "Expected a function"
// @from(Ln 509, Col 2)
W0
// @from(Ln 510, Col 4)
Y9 = w(() => {
  kmA();
  _U1.Cache = hAA;
  W0 = _U1
})
// @from(Ln 516, Col 0)
function Tv0() {
  process.stdout.on("error", (A) => {
    if (A.code === "EPIPE") process.stdout.destroy()
  }), process.stderr.on("error", (A) => {
    if (A.code === "EPIPE") process.stderr.destroy()
  })
}
// @from(Ln 524, Col 0)
function J9(A) {
  if (process.stdout.destroyed) return;
  for (let Q = 0; Q < A.length; Q += 2000) process.stdout.write(A.substring(Q, Q + 2000))
}
// @from(Ln 529, Col 0)
function Tl(A) {
  if (process.stderr.destroyed) return;
  for (let Q = 0; Q < A.length; Q += 2000) process.stderr.write(A.substring(Q, Q + 2000))
}
// @from(Ln 534, Col 0)
function qR9(A) {
  let Q = [],
    B = A.match(/^MCP server ["']([^"']+)["']/);
  if (B && B[1]) Q.push("mcp"), Q.push(B[1].toLowerCase());
  else {
    let Y = A.match(/^([^:[]+):/);
    if (Y && Y[1]) Q.push(Y[1].trim().toLowerCase())
  }
  let G = A.match(/^\[([^\]]+)]/);
  if (G && G[1]) Q.push(G[1].trim().toLowerCase());
  if (A.toLowerCase().includes("statsig event:")) Q.push("statsig");
  let Z = A.match(/:\s*([^:]+?)(?:\s+(?:type|mode|status|event))?:/);
  if (Z && Z[1]) {
    let Y = Z[1].trim().toLowerCase();
    if (Y.length < 30 && !Y.includes(" ")) Q.push(Y)
  }
  return Array.from(new Set(Q))
}
// @from(Ln 553, Col 0)
function NR9(A, Q) {
  if (!Q) return !0;
  if (A.length === 0) return !1;
  if (Q.isExclusive) return !A.some((B) => Q.exclude.includes(B));
  else return A.some((B) => Q.include.includes(B))
}
// @from(Ln 560, Col 0)
function Sv0(A, Q) {
  if (!Q) return !0;
  let B = qR9(A);
  return NR9(B, Q)
}
// @from(Ln 565, Col 4)
Pv0
// @from(Ln 566, Col 4)
xv0 = w(() => {
  Y9();
  Pv0 = W0((A) => {
    if (!A || A.trim() === "") return null;
    let Q = A.split(",").map((Y) => Y.trim()).filter(Boolean);
    if (Q.length === 0) return null;
    let B = Q.some((Y) => Y.startsWith("!")),
      G = Q.some((Y) => !Y.startsWith("!"));
    if (B && G) return null;
    let Z = Q.map((Y) => Y.replace(/^!/, "").toLowerCase());
    return {
      include: B ? [] : Z,
      exclude: B ? Z : [],
      isExclusive: B
    }
  })
})
// @from(Ln 584, Col 0)
function wR9() {
  this.__data__ = new Rl, this.size = 0
}
// @from(Ln 587, Col 4)
yv0
// @from(Ln 588, Col 4)
vv0 = w(() => {
  qCA();
  yv0 = wR9
})
// @from(Ln 593, Col 0)
function LR9(A) {
  var Q = this.__data__,
    B = Q.delete(A);
  return this.size = Q.size, B
}
// @from(Ln 598, Col 4)
kv0
// @from(Ln 599, Col 4)
bv0 = w(() => {
  kv0 = LR9
})
// @from(Ln 603, Col 0)
function OR9(A) {
  return this.__data__.get(A)
}
// @from(Ln 606, Col 4)
fv0
// @from(Ln 607, Col 4)
hv0 = w(() => {
  fv0 = OR9
})
// @from(Ln 611, Col 0)
function MR9(A) {
  return this.__data__.has(A)
}
// @from(Ln 614, Col 4)
gv0
// @from(Ln 615, Col 4)
uv0 = w(() => {
  gv0 = MR9
})
// @from(Ln 619, Col 0)
function _R9(A, Q) {
  var B = this.__data__;
  if (B instanceof Rl) {
    var G = B.__data__;
    if (!_l || G.length < RR9 - 1) return G.push([A, Q]), this.size = ++B.size, this;
    B = this.__data__ = new hAA(G)
  }
  return B.set(A, Q), this.size = B.size, this
}
// @from(Ln 628, Col 4)
RR9 = 200
// @from(Ln 629, Col 2)
mv0
// @from(Ln 630, Col 4)
dv0 = w(() => {
  qCA();
  vmA();
  kmA();
  mv0 = _R9
})
// @from(Ln 637, Col 0)
function _5A(A) {
  var Q = this.__data__ = new Rl(A);
  this.size = Q.size
}
// @from(Ln 641, Col 4)
qy
// @from(Ln 642, Col 4)
wCA = w(() => {
  qCA();
  vv0();
  bv0();
  hv0();
  uv0();
  dv0();
  _5A.prototype.clear = yv0;
  _5A.prototype.delete = kv0;
  _5A.prototype.get = fv0;
  _5A.prototype.has = gv0;
  _5A.prototype.set = mv0;
  qy = _5A
})
// @from(Ln 657, Col 0)
function TR9(A) {
  return this.__data__.set(A, jR9), this
}
// @from(Ln 660, Col 4)
jR9 = "__lodash_hash_undefined__"
// @from(Ln 661, Col 2)
cv0
// @from(Ln 662, Col 4)
pv0 = w(() => {
  cv0 = TR9
})
// @from(Ln 666, Col 0)
function PR9(A) {
  return this.__data__.has(A)
}
// @from(Ln 669, Col 4)
lv0
// @from(Ln 670, Col 4)
iv0 = w(() => {
  lv0 = PR9
})
// @from(Ln 674, Col 0)
function bmA(A) {
  var Q = -1,
    B = A == null ? 0 : A.length;
  this.__data__ = new hAA;
  while (++Q < B) this.add(A[Q])
}
// @from(Ln 680, Col 4)
fmA
// @from(Ln 681, Col 4)
jU1 = w(() => {
  kmA();
  pv0();
  iv0();
  bmA.prototype.add = bmA.prototype.push = cv0;
  bmA.prototype.has = lv0;
  fmA = bmA
})
// @from(Ln 690, Col 0)
function SR9(A, Q) {
  var B = -1,
    G = A == null ? 0 : A.length;
  while (++B < G)
    if (Q(A[B], B, A)) return !0;
  return !1
}
// @from(Ln 697, Col 4)
nv0
// @from(Ln 698, Col 4)
av0 = w(() => {
  nv0 = SR9
})
// @from(Ln 702, Col 0)
function xR9(A, Q) {
  return A.has(Q)
}
// @from(Ln 705, Col 4)
hmA
// @from(Ln 706, Col 4)
TU1 = w(() => {
  hmA = xR9
})
// @from(Ln 710, Col 0)
function kR9(A, Q, B, G, Z, Y) {
  var J = B & yR9,
    X = A.length,
    I = Q.length;
  if (X != I && !(J && I > X)) return !1;
  var D = Y.get(A),
    W = Y.get(Q);
  if (D && W) return D == Q && W == A;
  var K = -1,
    V = !0,
    F = B & vR9 ? new fmA : void 0;
  Y.set(A, Q), Y.set(Q, A);
  while (++K < X) {
    var H = A[K],
      E = Q[K];
    if (G) var z = J ? G(E, H, K, Q, A, Y) : G(H, E, K, A, Q, Y);
    if (z !== void 0) {
      if (z) continue;
      V = !1;
      break
    }
    if (F) {
      if (!nv0(Q, function ($, O) {
          if (!hmA(F, O) && (H === $ || Z(H, $, B, G, Y))) return F.push(O)
        })) {
        V = !1;
        break
      }
    } else if (!(H === E || Z(H, E, B, G, Y))) {
      V = !1;
      break
    }
  }
  return Y.delete(A), Y.delete(Q), V
}
// @from(Ln 745, Col 4)
yR9 = 1
// @from(Ln 746, Col 2)
vR9 = 2
// @from(Ln 747, Col 2)
gmA
// @from(Ln 748, Col 4)
PU1 = w(() => {
  jU1();
  av0();
  TU1();
  gmA = kR9
})
// @from(Ln 754, Col 4)
bR9
// @from(Ln 754, Col 9)
j5A
// @from(Ln 755, Col 4)
SU1 = w(() => {
  VT();
  bR9 = OW.Uint8Array, j5A = bR9
})
// @from(Ln 760, Col 0)
function fR9(A) {
  var Q = -1,
    B = Array(A.size);
  return A.forEach(function (G, Z) {
    B[++Q] = [Z, G]
  }), B
}
// @from(Ln 767, Col 4)
ov0
// @from(Ln 768, Col 4)
rv0 = w(() => {
  ov0 = fR9
})
// @from(Ln 772, Col 0)
function hR9(A) {
  var Q = -1,
    B = Array(A.size);
  return A.forEach(function (G) {
    B[++Q] = G
  }), B
}
// @from(Ln 779, Col 4)
T5A
// @from(Ln 780, Col 4)
umA = w(() => {
  T5A = hR9
})
// @from(Ln 784, Col 0)
function tR9(A, Q, B, G, Z, Y, J) {
  switch (B) {
    case sR9:
      if (A.byteLength != Q.byteLength || A.byteOffset != Q.byteOffset) return !1;
      A = A.buffer, Q = Q.buffer;
    case rR9:
      if (A.byteLength != Q.byteLength || !Y(new j5A(A), new j5A(Q))) return !1;
      return !0;
    case mR9:
    case dR9:
    case lR9:
      return Uy(+A, +Q);
    case cR9:
      return A.name == Q.name && A.message == Q.message;
    case iR9:
    case aR9:
      return A == Q + "";
    case pR9:
      var X = ov0;
    case nR9:
      var I = G & gR9;
      if (X || (X = T5A), A.size != Q.size && !I) return !1;
      var D = J.get(A);
      if (D) return D == Q;
      G |= uR9, J.set(A, Q);
      var W = gmA(X(A), X(Q), G, Z, Y, J);
      return J.delete(A), W;
    case oR9:
      if (xU1) return xU1.call(A) == xU1.call(Q)
  }
  return !1
}
// @from(Ln 816, Col 4)
gR9 = 1
// @from(Ln 817, Col 2)
uR9 = 2
// @from(Ln 818, Col 2)
mR9 = "[object Boolean]"
// @from(Ln 819, Col 2)
dR9 = "[object Date]"
// @from(Ln 820, Col 2)
cR9 = "[object Error]"
// @from(Ln 821, Col 2)
pR9 = "[object Map]"
// @from(Ln 822, Col 2)
lR9 = "[object Number]"
// @from(Ln 823, Col 2)
iR9 = "[object RegExp]"
// @from(Ln 824, Col 2)
nR9 = "[object Set]"
// @from(Ln 825, Col 2)
aR9 = "[object String]"
// @from(Ln 826, Col 2)
oR9 = "[object Symbol]"
// @from(Ln 827, Col 2)
rR9 = "[object ArrayBuffer]"
// @from(Ln 828, Col 2)
sR9 = "[object DataView]"
// @from(Ln 829, Col 2)
sv0
// @from(Ln 829, Col 7)
xU1
// @from(Ln 829, Col 12)
tv0
// @from(Ln 830, Col 4)
ev0 = w(() => {
  bAA();
  SU1();
  O5A();
  PU1();
  rv0();
  umA();
  sv0 = mV ? mV.prototype : void 0, xU1 = sv0 ? sv0.valueOf : void 0;
  tv0 = tR9
})
// @from(Ln 841, Col 0)
function eR9(A, Q) {
  var B = -1,
    G = Q.length,
    Z = A.length;
  while (++B < G) A[Z + B] = Q[B];
  return A
}
// @from(Ln 848, Col 4)
P5A
// @from(Ln 849, Col 4)
mmA = w(() => {
  P5A = eR9
})
// @from(Ln 852, Col 4)
A_9
// @from(Ln 852, Col 9)
wG
// @from(Ln 853, Col 4)
e$ = w(() => {
  A_9 = Array.isArray, wG = A_9
})
// @from(Ln 857, Col 0)
function Q_9(A, Q, B) {
  var G = Q(A);
  return wG(A) ? G : P5A(G, B(A))
}
// @from(Ln 861, Col 4)
dmA
// @from(Ln 862, Col 4)
yU1 = w(() => {
  mmA();
  e$();
  dmA = Q_9
})
// @from(Ln 868, Col 0)
function B_9(A, Q) {
  var B = -1,
    G = A == null ? 0 : A.length,
    Z = 0,
    Y = [];
  while (++B < G) {
    var J = A[B];
    if (Q(J, B, A)) Y[Z++] = J
  }
  return Y
}
// @from(Ln 879, Col 4)
cmA
// @from(Ln 880, Col 4)
vU1 = w(() => {
  cmA = B_9
})
// @from(Ln 884, Col 0)
function G_9() {
  return []
}
// @from(Ln 887, Col 4)
pmA
// @from(Ln 888, Col 4)
kU1 = w(() => {
  pmA = G_9
})
// @from(Ln 891, Col 4)
Z_9
// @from(Ln 891, Col 9)
Y_9
// @from(Ln 891, Col 14)
Ak0
// @from(Ln 891, Col 19)
J_9
// @from(Ln 891, Col 24)
S5A
// @from(Ln 892, Col 4)
lmA = w(() => {
  vU1();
  kU1();
  Z_9 = Object.prototype, Y_9 = Z_9.propertyIsEnumerable, Ak0 = Object.getOwnPropertySymbols, J_9 = !Ak0 ? pmA : function (A) {
    if (A == null) return [];
    return A = Object(A), cmA(Ak0(A), function (Q) {
      return Y_9.call(A, Q)
    })
  }, S5A = J_9
})
// @from(Ln 903, Col 0)
function X_9(A, Q) {
  var B = -1,
    G = Array(A);
  while (++B < A) G[B] = Q(B);
  return G
}
// @from(Ln 909, Col 4)
Qk0
// @from(Ln 910, Col 4)
Bk0 = w(() => {
  Qk0 = X_9
})
// @from(Ln 914, Col 0)
function I_9(A) {
  return A != null && typeof A == "object"
}
// @from(Ln 917, Col 4)
gK
// @from(Ln 918, Col 4)
Ny = w(() => {
  gK = I_9
})
// @from(Ln 922, Col 0)
function W_9(A) {
  return gK(A) && cw(A) == D_9
}
// @from(Ln 925, Col 4)
D_9 = "[object Arguments]"
// @from(Ln 926, Col 2)
bU1
// @from(Ln 927, Col 4)
Gk0 = w(() => {
  fAA();
  Ny();
  bU1 = W_9
})
// @from(Ln 932, Col 4)
Zk0
// @from(Ln 932, Col 9)
K_9
// @from(Ln 932, Col 14)
V_9
// @from(Ln 932, Col 19)
F_9
// @from(Ln 932, Col 24)
Ag
// @from(Ln 933, Col 4)
LCA = w(() => {
  Gk0();
  Ny();
  Zk0 = Object.prototype, K_9 = Zk0.hasOwnProperty, V_9 = Zk0.propertyIsEnumerable, F_9 = bU1(function () {
    return arguments
  }()) ? bU1 : function (A) {
    return gK(A) && K_9.call(A, "callee") && !V_9.call(A, "callee")
  }, Ag = F_9
})
// @from(Ln 943, Col 0)
function H_9() {
  return !1
}
// @from(Ln 946, Col 4)
Yk0
// @from(Ln 947, Col 4)
Jk0 = w(() => {
  Yk0 = H_9
})
// @from(Ln 950, Col 4)
nmA = {}
// @from(Ln 954, Col 4)
Dk0
// @from(Ln 954, Col 9)
Xk0
// @from(Ln 954, Col 14)
E_9
// @from(Ln 954, Col 19)
Ik0
// @from(Ln 954, Col 24)
z_9
// @from(Ln 954, Col 29)
$_9
// @from(Ln 954, Col 34)
wy
// @from(Ln 955, Col 4)
OCA = w(() => {
  VT();
  Jk0();
  Dk0 = typeof nmA == "object" && nmA && !nmA.nodeType && nmA, Xk0 = Dk0 && typeof imA == "object" && imA && !imA.nodeType && imA, E_9 = Xk0 && Xk0.exports === Dk0, Ik0 = E_9 ? OW.Buffer : void 0, z_9 = Ik0 ? Ik0.isBuffer : void 0, $_9 = z_9 || Yk0, wy = $_9
})
// @from(Ln 961, Col 0)
function q_9(A, Q) {
  var B = typeof A;
  return Q = Q == null ? C_9 : Q, !!Q && (B == "number" || B != "symbol" && U_9.test(A)) && (A > -1 && A % 1 == 0 && A < Q)
}
// @from(Ln 965, Col 4)
C_9 = 9007199254740991
// @from(Ln 966, Col 2)
U_9
// @from(Ln 966, Col 7)
Pl
// @from(Ln 967, Col 4)
MCA = w(() => {
  U_9 = /^(?:0|[1-9]\d*)$/;
  Pl = q_9
})
// @from(Ln 972, Col 0)
function w_9(A) {
  return typeof A == "number" && A > -1 && A % 1 == 0 && A <= N_9
}
// @from(Ln 975, Col 4)
N_9 = 9007199254740991
// @from(Ln 976, Col 2)
x5A
// @from(Ln 977, Col 4)
amA = w(() => {
  x5A = w_9
})
// @from(Ln 981, Col 0)
function n_9(A) {
  return gK(A) && x5A(A.length) && !!EJ[cw(A)]
}
// @from(Ln 984, Col 4)
L_9 = "[object Arguments]"
// @from(Ln 985, Col 2)
O_9 = "[object Array]"
// @from(Ln 986, Col 2)
M_9 = "[object Boolean]"
// @from(Ln 987, Col 2)
R_9 = "[object Date]"
// @from(Ln 988, Col 2)
__9 = "[object Error]"
// @from(Ln 989, Col 2)
j_9 = "[object Function]"
// @from(Ln 990, Col 2)
T_9 = "[object Map]"
// @from(Ln 991, Col 2)
P_9 = "[object Number]"
// @from(Ln 992, Col 2)
S_9 = "[object Object]"
// @from(Ln 993, Col 2)
x_9 = "[object RegExp]"
// @from(Ln 994, Col 2)
y_9 = "[object Set]"
// @from(Ln 995, Col 2)
v_9 = "[object String]"
// @from(Ln 996, Col 2)
k_9 = "[object WeakMap]"
// @from(Ln 997, Col 2)
b_9 = "[object ArrayBuffer]"
// @from(Ln 998, Col 2)
f_9 = "[object DataView]"
// @from(Ln 999, Col 2)
h_9 = "[object Float32Array]"
// @from(Ln 1000, Col 2)
g_9 = "[object Float64Array]"
// @from(Ln 1001, Col 2)
u_9 = "[object Int8Array]"
// @from(Ln 1002, Col 2)
m_9 = "[object Int16Array]"
// @from(Ln 1003, Col 2)
d_9 = "[object Int32Array]"
// @from(Ln 1004, Col 2)
c_9 = "[object Uint8Array]"
// @from(Ln 1005, Col 2)
p_9 = "[object Uint8ClampedArray]"
// @from(Ln 1006, Col 2)
l_9 = "[object Uint16Array]"
// @from(Ln 1007, Col 2)
i_9 = "[object Uint32Array]"
// @from(Ln 1008, Col 2)
EJ
// @from(Ln 1008, Col 6)
Wk0
// @from(Ln 1009, Col 4)
Kk0 = w(() => {
  fAA();
  amA();
  Ny();
  EJ = {};
  EJ[h_9] = EJ[g_9] = EJ[u_9] = EJ[m_9] = EJ[d_9] = EJ[c_9] = EJ[p_9] = EJ[l_9] = EJ[i_9] = !0;
  EJ[L_9] = EJ[O_9] = EJ[b_9] = EJ[M_9] = EJ[f_9] = EJ[R_9] = EJ[__9] = EJ[j_9] = EJ[T_9] = EJ[P_9] = EJ[S_9] = EJ[x_9] = EJ[y_9] = EJ[v_9] = EJ[k_9] = !1;
  Wk0 = n_9
})
// @from(Ln 1019, Col 0)
function a_9(A) {
  return function (Q) {
    return A(Q)
  }
}
// @from(Ln 1024, Col 4)
y5A
// @from(Ln 1025, Col 4)
omA = w(() => {
  y5A = a_9
})
// @from(Ln 1028, Col 4)
smA = {}
// @from(Ln 1032, Col 4)
Vk0
// @from(Ln 1032, Col 9)
RCA
// @from(Ln 1032, Col 14)
o_9
// @from(Ln 1032, Col 19)
fU1
// @from(Ln 1032, Col 24)
r_9
// @from(Ln 1032, Col 29)
Ly
// @from(Ln 1033, Col 4)
tmA = w(() => {
  OU1();
  Vk0 = typeof smA == "object" && smA && !smA.nodeType && smA, RCA = Vk0 && typeof rmA == "object" && rmA && !rmA.nodeType && rmA, o_9 = RCA && RCA.exports === Vk0, fU1 = o_9 && SmA.process, r_9 = function () {
    try {
      var A = RCA && RCA.require && RCA.require("util").types;
      if (A) return A;
      return fU1 && fU1.binding && fU1.binding("util")
    } catch (Q) {}
  }(), Ly = r_9
})
// @from(Ln 1043, Col 4)
Fk0
// @from(Ln 1043, Col 9)
s_9
// @from(Ln 1043, Col 14)
v5A
// @from(Ln 1044, Col 4)
emA = w(() => {
  Kk0();
  omA();
  tmA();
  Fk0 = Ly && Ly.isTypedArray, s_9 = Fk0 ? y5A(Fk0) : Wk0, v5A = s_9
})
// @from(Ln 1051, Col 0)
function Aj9(A, Q) {
  var B = wG(A),
    G = !B && Ag(A),
    Z = !B && !G && wy(A),
    Y = !B && !G && !Z && v5A(A),
    J = B || G || Z || Y,
    X = J ? Qk0(A.length, String) : [],
    I = X.length;
  for (var D in A)
    if ((Q || e_9.call(A, D)) && !(J && (D == "length" || Z && (D == "offset" || D == "parent") || Y && (D == "buffer" || D == "byteLength" || D == "byteOffset") || Pl(D, I)))) X.push(D);
  return X
}
// @from(Ln 1063, Col 4)
t_9
// @from(Ln 1063, Col 9)
e_9
// @from(Ln 1063, Col 14)
AdA
// @from(Ln 1064, Col 4)
hU1 = w(() => {
  Bk0();
  LCA();
  e$();
  OCA();
  MCA();
  emA();
  t_9 = Object.prototype, e_9 = t_9.hasOwnProperty;
  AdA = Aj9
})
// @from(Ln 1075, Col 0)
function Bj9(A) {
  var Q = A && A.constructor,
    B = typeof Q == "function" && Q.prototype || Qj9;
  return A === B
}
// @from(Ln 1080, Col 4)
Qj9
// @from(Ln 1080, Col 9)
k5A
// @from(Ln 1081, Col 4)
QdA = w(() => {
  Qj9 = Object.prototype;
  k5A = Bj9
})
// @from(Ln 1086, Col 0)
function Gj9(A, Q) {
  return function (B) {
    return A(Q(B))
  }
}
// @from(Ln 1091, Col 4)
BdA
// @from(Ln 1092, Col 4)
gU1 = w(() => {
  BdA = Gj9
})
// @from(Ln 1095, Col 4)
Zj9
// @from(Ln 1095, Col 9)
Hk0
// @from(Ln 1096, Col 4)
Ek0 = w(() => {
  gU1();
  Zj9 = BdA(Object.keys, Object), Hk0 = Zj9
})
// @from(Ln 1101, Col 0)
function Xj9(A) {
  if (!k5A(A)) return Hk0(A);
  var Q = [];
  for (var B in Object(A))
    if (Jj9.call(A, B) && B != "constructor") Q.push(B);
  return Q
}
// @from(Ln 1108, Col 4)
Yj9
// @from(Ln 1108, Col 9)
Jj9
// @from(Ln 1108, Col 14)
zk0
// @from(Ln 1109, Col 4)
$k0 = w(() => {
  QdA();
  Ek0();
  Yj9 = Object.prototype, Jj9 = Yj9.hasOwnProperty;
  zk0 = Xj9
})
// @from(Ln 1116, Col 0)
function Ij9(A) {
  return A != null && x5A(A.length) && !w5A(A)
}
// @from(Ln 1119, Col 4)
Oy
// @from(Ln 1120, Col 4)
b5A = w(() => {
  xmA();
  amA();
  Oy = Ij9
})
// @from(Ln 1126, Col 0)
function Dj9(A) {
  return Oy(A) ? AdA(A) : zk0(A)
}
// @from(Ln 1129, Col 4)
jM
// @from(Ln 1130, Col 4)
gAA = w(() => {
  hU1();
  $k0();
  b5A();
  jM = Dj9
})
// @from(Ln 1137, Col 0)
function Wj9(A) {
  return dmA(A, jM, S5A)
}
// @from(Ln 1140, Col 4)
_CA
// @from(Ln 1141, Col 4)
uU1 = w(() => {
  yU1();
  lmA();
  gAA();
  _CA = Wj9
})
// @from(Ln 1148, Col 0)
function Hj9(A, Q, B, G, Z, Y) {
  var J = B & Kj9,
    X = _CA(A),
    I = X.length,
    D = _CA(Q),
    W = D.length;
  if (I != W && !J) return !1;
  var K = I;
  while (K--) {
    var V = X[K];
    if (!(J ? V in Q : Fj9.call(Q, V))) return !1
  }
  var F = Y.get(A),
    H = Y.get(Q);
  if (F && H) return F == Q && H == A;
  var E = !0;
  Y.set(A, Q), Y.set(Q, A);
  var z = J;
  while (++K < I) {
    V = X[K];
    var $ = A[V],
      O = Q[V];
    if (G) var L = J ? G(O, $, V, Q, A, Y) : G($, O, V, A, Q, Y);
    if (!(L === void 0 ? $ === O || Z($, O, B, G, Y) : L)) {
      E = !1;
      break
    }
    z || (z = V == "constructor")
  }
  if (E && !z) {
    var M = A.constructor,
      _ = Q.constructor;
    if (M != _ && (("constructor" in A) && ("constructor" in Q)) && !(typeof M == "function" && M instanceof M && typeof _ == "function" && _ instanceof _)) E = !1
  }
  return Y.delete(A), Y.delete(Q), E
}
// @from(Ln 1184, Col 4)
Kj9 = 1
// @from(Ln 1185, Col 2)
Vj9
// @from(Ln 1185, Col 7)
Fj9
// @from(Ln 1185, Col 12)
Ck0
// @from(Ln 1186, Col 4)
Uk0 = w(() => {
  uU1();
  Vj9 = Object.prototype, Fj9 = Vj9.hasOwnProperty;
  Ck0 = Hj9
})
// @from(Ln 1191, Col 4)
Ej9
// @from(Ln 1191, Col 9)
GdA
// @from(Ln 1192, Col 4)
qk0 = w(() => {
  Ol();
  VT();
  Ej9 = Yq(OW, "DataView"), GdA = Ej9
})
// @from(Ln 1197, Col 4)
zj9
// @from(Ln 1197, Col 9)
ZdA
// @from(Ln 1198, Col 4)
Nk0 = w(() => {
  Ol();
  VT();
  zj9 = Yq(OW, "Promise"), ZdA = zj9
})
// @from(Ln 1203, Col 4)
$j9
// @from(Ln 1203, Col 9)
Sl
// @from(Ln 1204, Col 4)
mU1 = w(() => {
  Ol();
  VT();
  $j9 = Yq(OW, "Set"), Sl = $j9
})
// @from(Ln 1209, Col 4)
Cj9
// @from(Ln 1209, Col 9)
YdA
// @from(Ln 1210, Col 4)
wk0 = w(() => {
  Ol();
  VT();
  Cj9 = Yq(OW, "WeakMap"), YdA = Cj9
})
// @from(Ln 1215, Col 4)
Lk0 = "[object Map]"
// @from(Ln 1216, Col 2)
Uj9 = "[object Object]"
// @from(Ln 1217, Col 2)
Ok0 = "[object Promise]"
// @from(Ln 1218, Col 2)
Mk0 = "[object Set]"
// @from(Ln 1219, Col 2)
Rk0 = "[object WeakMap]"
// @from(Ln 1220, Col 2)
_k0 = "[object DataView]"
// @from(Ln 1221, Col 2)
qj9
// @from(Ln 1221, Col 7)
Nj9
// @from(Ln 1221, Col 12)
wj9
// @from(Ln 1221, Col 17)
Lj9
// @from(Ln 1221, Col 22)
Oj9
// @from(Ln 1221, Col 27)
uAA
// @from(Ln 1221, Col 32)
Qg
// @from(Ln 1222, Col 4)
jCA = w(() => {
  qk0();
  vmA();
  Nk0();
  mU1();
  wk0();
  fAA();
  MU1();
  qj9 = th(GdA), Nj9 = th(_l), wj9 = th(ZdA), Lj9 = th(Sl), Oj9 = th(YdA), uAA = cw;
  if (GdA && uAA(new GdA(new ArrayBuffer(1))) != _k0 || _l && uAA(new _l) != Lk0 || ZdA && uAA(ZdA.resolve()) != Ok0 || Sl && uAA(new Sl) != Mk0 || YdA && uAA(new YdA) != Rk0) uAA = function (A) {
    var Q = cw(A),
      B = Q == Uj9 ? A.constructor : void 0,
      G = B ? th(B) : "";
    if (G) switch (G) {
      case qj9:
        return _k0;
      case Nj9:
        return Lk0;
      case wj9:
        return Ok0;
      case Lj9:
        return Mk0;
      case Oj9:
        return Rk0
    }
    return Q
  };
  Qg = uAA
})
// @from(Ln 1252, Col 0)
function _j9(A, Q, B, G, Z, Y) {
  var J = wG(A),
    X = wG(Q),
    I = J ? Tk0 : Qg(A),
    D = X ? Tk0 : Qg(Q);
  I = I == jk0 ? JdA : I, D = D == jk0 ? JdA : D;
  var W = I == JdA,
    K = D == JdA,
    V = I == D;
  if (V && wy(A)) {
    if (!wy(Q)) return !1;
    J = !0, W = !1
  }
  if (V && !W) return Y || (Y = new qy), J || v5A(A) ? gmA(A, Q, B, G, Z, Y) : tv0(A, Q, I, B, G, Z, Y);
  if (!(B & Mj9)) {
    var F = W && Pk0.call(A, "__wrapped__"),
      H = K && Pk0.call(Q, "__wrapped__");
    if (F || H) {
      var E = F ? A.value() : A,
        z = H ? Q.value() : Q;
      return Y || (Y = new qy), Z(E, z, B, G, Y)
    }
  }
  if (!V) return !1;
  return Y || (Y = new qy), Ck0(A, Q, B, G, Z, Y)
}
// @from(Ln 1278, Col 4)
Mj9 = 1
// @from(Ln 1279, Col 2)
jk0 = "[object Arguments]"
// @from(Ln 1280, Col 2)
Tk0 = "[object Array]"
// @from(Ln 1281, Col 2)
JdA = "[object Object]"
// @from(Ln 1282, Col 2)
Rj9
// @from(Ln 1282, Col 7)
Pk0
// @from(Ln 1282, Col 12)
Sk0
// @from(Ln 1283, Col 4)
xk0 = w(() => {
  wCA();
  PU1();
  ev0();
  Uk0();
  jCA();
  e$();
  OCA();
  emA();
  Rj9 = Object.prototype, Pk0 = Rj9.hasOwnProperty;
  Sk0 = _j9
})
// @from(Ln 1296, Col 0)
function yk0(A, Q, B, G, Z) {
  if (A === Q) return !0;
  if (A == null || Q == null || !gK(A) && !gK(Q)) return A !== A && Q !== Q;
  return Sk0(A, Q, B, G, yk0, Z)
}
// @from(Ln 1301, Col 4)
f5A
// @from(Ln 1302, Col 4)
XdA = w(() => {
  xk0();
  Ny();
  f5A = yk0
})
// @from(Ln 1308, Col 0)
function Pj9(A, Q, B, G) {
  var Z = B.length,
    Y = Z,
    J = !G;
  if (A == null) return !Y;
  A = Object(A);
  while (Z--) {
    var X = B[Z];
    if (J && X[2] ? X[1] !== A[X[0]] : !(X[0] in A)) return !1
  }
  while (++Z < Y) {
    X = B[Z];
    var I = X[0],
      D = A[I],
      W = X[1];
    if (J && X[2]) {
      if (D === void 0 && !(I in A)) return !1
    } else {
      var K = new qy;
      if (G) var V = G(D, W, I, A, Q, K);
      if (!(V === void 0 ? f5A(W, D, jj9 | Tj9, G, K) : V)) return !1
    }
  }
  return !0
}
// @from(Ln 1333, Col 4)
jj9 = 1
// @from(Ln 1334, Col 2)
Tj9 = 2
// @from(Ln 1335, Col 2)
vk0
// @from(Ln 1336, Col 4)
kk0 = w(() => {
  wCA();
  XdA();
  vk0 = Pj9
})
// @from(Ln 1342, Col 0)
function Sj9(A) {
  return A === A && !lX(A)
}
// @from(Ln 1345, Col 4)
IdA
// @from(Ln 1346, Col 4)
dU1 = w(() => {
  _M();
  IdA = Sj9
})
// @from(Ln 1351, Col 0)
function xj9(A) {
  var Q = jM(A),
    B = Q.length;
  while (B--) {
    var G = Q[B],
      Z = A[G];
    Q[B] = [G, Z, IdA(Z)]
  }
  return Q
}
// @from(Ln 1361, Col 4)
bk0
// @from(Ln 1362, Col 4)
fk0 = w(() => {
  dU1();
  gAA();
  bk0 = xj9
})
// @from(Ln 1368, Col 0)
function yj9(A, Q) {
  return function (B) {
    if (B == null) return !1;
    return B[A] === Q && (Q !== void 0 || (A in Object(B)))
  }
}
// @from(Ln 1374, Col 4)
DdA
// @from(Ln 1375, Col 4)
cU1 = w(() => {
  DdA = yj9
})
// @from(Ln 1379, Col 0)
function vj9(A) {
  var Q = bk0(A);
  if (Q.length == 1 && Q[0][2]) return DdA(Q[0][0], Q[0][1]);
  return function (B) {
    return B === A || vk0(B, A, Q)
  }
}
// @from(Ln 1386, Col 4)
hk0
// @from(Ln 1387, Col 4)
gk0 = w(() => {
  kk0();
  fk0();
  cU1();
  hk0 = vj9
})
// @from(Ln 1394, Col 0)
function bj9(A) {
  return typeof A == "symbol" || gK(A) && cw(A) == kj9
}
// @from(Ln 1397, Col 4)
kj9 = "[object Symbol]"
// @from(Ln 1398, Col 2)
h5A
// @from(Ln 1399, Col 4)
WdA = w(() => {
  fAA();
  Ny();
  h5A = bj9
})
// @from(Ln 1405, Col 0)
function gj9(A, Q) {
  if (wG(A)) return !1;
  var B = typeof A;
  if (B == "number" || B == "symbol" || B == "boolean" || A == null || h5A(A)) return !0;
  return hj9.test(A) || !fj9.test(A) || Q != null && A in Object(Q)
}
// @from(Ln 1411, Col 4)
fj9
// @from(Ln 1411, Col 9)
hj9
// @from(Ln 1411, Col 14)
g5A
// @from(Ln 1412, Col 4)
KdA = w(() => {
  e$();
  WdA();
  fj9 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, hj9 = /^\w*$/;
  g5A = gj9
})
// @from(Ln 1419, Col 0)
function mj9(A) {
  var Q = W0(A, function (G) {
      if (B.size === uj9) B.clear();
      return G
    }),
    B = Q.cache;
  return Q
}
// @from(Ln 1427, Col 4)
uj9 = 500
// @from(Ln 1428, Col 2)
uk0
// @from(Ln 1429, Col 4)
mk0 = w(() => {
  Y9();
  uk0 = mj9
})
// @from(Ln 1433, Col 4)
dj9
// @from(Ln 1433, Col 9)
cj9
// @from(Ln 1433, Col 14)
pj9
// @from(Ln 1433, Col 19)
dk0
// @from(Ln 1434, Col 4)
ck0 = w(() => {
  mk0();
  dj9 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, cj9 = /\\(\\)?/g, pj9 = uk0(function (A) {
    var Q = [];
    if (A.charCodeAt(0) === 46) Q.push("");
    return A.replace(dj9, function (B, G, Z, Y) {
      Q.push(Z ? Y.replace(cj9, "$1") : G || B)
    }), Q
  }), dk0 = pj9
})
// @from(Ln 1445, Col 0)
function lj9(A, Q) {
  var B = -1,
    G = A == null ? 0 : A.length,
    Z = Array(G);
  while (++B < G) Z[B] = Q(A[B], B, A);
  return Z
}
// @from(Ln 1452, Col 4)
u5A
// @from(Ln 1453, Col 4)
VdA = w(() => {
  u5A = lj9
})
// @from(Ln 1457, Col 0)
function ik0(A) {
  if (typeof A == "string") return A;
  if (wG(A)) return u5A(A, ik0) + "";
  if (h5A(A)) return lk0 ? lk0.call(A) : "";
  var Q = A + "";
  return Q == "0" && 1 / A == -ij9 ? "-0" : Q
}
// @from(Ln 1464, Col 4)
ij9 = 1 / 0
// @from(Ln 1465, Col 2)
pk0
// @from(Ln 1465, Col 7)
lk0
// @from(Ln 1465, Col 12)
nk0
// @from(Ln 1466, Col 4)
ak0 = w(() => {
  bAA();
  VdA();
  e$();
  WdA();
  pk0 = mV ? mV.prototype : void 0, lk0 = pk0 ? pk0.toString : void 0;
  nk0 = ik0
})
// @from(Ln 1475, Col 0)
function nj9(A) {
  return A == null ? "" : nk0(A)
}
// @from(Ln 1478, Col 4)
m5A
// @from(Ln 1479, Col 4)
FdA = w(() => {
  ak0();
  m5A = nj9
})
// @from(Ln 1484, Col 0)
function aj9(A, Q) {
  if (wG(A)) return A;
  return g5A(A, Q) ? [A] : dk0(m5A(A))
}
// @from(Ln 1488, Col 4)
My
// @from(Ln 1489, Col 4)
d5A = w(() => {
  e$();
  KdA();
  ck0();
  FdA();
  My = aj9
})
// @from(Ln 1497, Col 0)
function rj9(A) {
  if (typeof A == "string" || h5A(A)) return A;
  var Q = A + "";
  return Q == "0" && 1 / A == -oj9 ? "-0" : Q
}
// @from(Ln 1502, Col 4)
oj9 = 1 / 0
// @from(Ln 1503, Col 2)
TM
// @from(Ln 1504, Col 4)
mAA = w(() => {
  WdA();
  TM = rj9
})
// @from(Ln 1509, Col 0)
function sj9(A, Q) {
  Q = My(Q, A);
  var B = 0,
    G = Q.length;
  while (A != null && B < G) A = A[TM(Q[B++])];
  return B && B == G ? A : void 0
}
// @from(Ln 1516, Col 4)
c5A
// @from(Ln 1517, Col 4)
HdA = w(() => {
  d5A();
  mAA();
  c5A = sj9
})
// @from(Ln 1523, Col 0)
function tj9(A, Q, B) {
  var G = A == null ? void 0 : c5A(A, Q);
  return G === void 0 ? B : G
}
// @from(Ln 1527, Col 4)
ok0
// @from(Ln 1528, Col 4)
rk0 = w(() => {
  HdA();
  ok0 = tj9
})
// @from(Ln 1533, Col 0)
function ej9(A, Q) {
  return A != null && Q in Object(A)
}
// @from(Ln 1536, Col 4)
sk0
// @from(Ln 1537, Col 4)
tk0 = w(() => {
  sk0 = ej9
})
// @from(Ln 1541, Col 0)
function AT9(A, Q, B) {
  Q = My(Q, A);
  var G = -1,
    Z = Q.length,
    Y = !1;
  while (++G < Z) {
    var J = TM(Q[G]);
    if (!(Y = A != null && B(A, J))) break;
    A = A[J]
  }
  if (Y || ++G != Z) return Y;
  return Z = A == null ? 0 : A.length, !!Z && x5A(Z) && Pl(J, Z) && (wG(A) || Ag(A))
}
// @from(Ln 1554, Col 4)
ek0
// @from(Ln 1555, Col 4)
Ab0 = w(() => {
  d5A();
  LCA();
  e$();
  MCA();
  amA();
  mAA();
  ek0 = AT9
})
// @from(Ln 1565, Col 0)
function QT9(A, Q) {
  return A != null && ek0(A, Q, sk0)
}
// @from(Ln 1568, Col 4)
Qb0
// @from(Ln 1569, Col 4)
Bb0 = w(() => {
  tk0();
  Ab0();
  Qb0 = QT9
})
// @from(Ln 1575, Col 0)
function ZT9(A, Q) {
  if (g5A(A) && IdA(Q)) return DdA(TM(A), Q);
  return function (B) {
    var G = ok0(B, A);
    return G === void 0 && G === Q ? Qb0(B, A) : f5A(Q, G, BT9 | GT9)
  }
}
// @from(Ln 1582, Col 4)
BT9 = 1
// @from(Ln 1583, Col 2)
GT9 = 2
// @from(Ln 1584, Col 2)
Gb0
// @from(Ln 1585, Col 4)
Zb0 = w(() => {
  XdA();
  rk0();
  Bb0();
  KdA();
  dU1();
  cU1();
  mAA();
  Gb0 = ZT9
})
// @from(Ln 1596, Col 0)
function YT9(A) {
  return A
}
// @from(Ln 1599, Col 4)
p5A
// @from(Ln 1600, Col 4)
EdA = w(() => {
  p5A = YT9
})
// @from(Ln 1604, Col 0)
function JT9(A) {
  return function (Q) {
    return Q == null ? void 0 : Q[A]
  }
}
// @from(Ln 1609, Col 4)
Yb0
// @from(Ln 1610, Col 4)
Jb0 = w(() => {
  Yb0 = JT9
})
// @from(Ln 1614, Col 0)
function XT9(A) {
  return function (Q) {
    return c5A(Q, A)
  }
}
// @from(Ln 1619, Col 4)
Xb0
// @from(Ln 1620, Col 4)
Ib0 = w(() => {
  HdA();
  Xb0 = XT9
})
// @from(Ln 1625, Col 0)
function IT9(A) {
  return g5A(A) ? Yb0(TM(A)) : Xb0(A)
}
// @from(Ln 1628, Col 4)
Db0
// @from(Ln 1629, Col 4)
Wb0 = w(() => {
  Jb0();
  Ib0();
  KdA();
  mAA();
  Db0 = IT9
})
// @from(Ln 1637, Col 0)
function DT9(A) {
  if (typeof A == "function") return A;
  if (A == null) return p5A;
  if (typeof A == "object") return wG(A) ? Gb0(A[0], A[1]) : hk0(A);
  return Db0(A)
}
// @from(Ln 1643, Col 4)
Ry
// @from(Ln 1644, Col 4)
l5A = w(() => {
  gk0();
  Zb0();
  EdA();
  e$();
  Wb0();
  Ry = DT9
})
// @from(Ln 1653, Col 0)
function WT9(A, Q) {
  var B, G = -1,
    Z = A.length;
  while (++G < Z) {
    var Y = Q(A[G]);
    if (Y !== void 0) B = B === void 0 ? Y : B + Y
  }
  return B
}
// @from(Ln 1662, Col 4)
Kb0
// @from(Ln 1663, Col 4)
Vb0 = w(() => {
  Kb0 = WT9
})
// @from(Ln 1667, Col 0)
function KT9(A, Q) {
  return A && A.length ? Kb0(A, Ry(Q, 2)) : 0
}
// @from(Ln 1670, Col 4)
i5A
// @from(Ln 1671, Col 4)
Fb0 = w(() => {
  l5A();
  Vb0();
  i5A = KT9
})
// @from(Ln 1677, Col 0)
function Hb0(A) {
  return {
    name: A,
    default: 30000,
    validate: (Q) => {
      if (!Q) return {
        effective: 30000,
        status: "valid"
      };
      let B = parseInt(Q, 10);
      if (isNaN(B) || B <= 0) return {
        effective: 30000,
        status: "invalid",
        message: `Invalid value "${Q}" (using default: 30000)`
      };
      if (B > 150000) return {
        effective: 150000,
        status: "capped",
        message: `Capped from ${B} to 150000`
      };
      return {
        effective: B,
        status: "valid"
      }
    }
  }
}
// @from(Ln 1704, Col 4)
zdA
// @from(Ln 1704, Col 9)
Eb0
// @from(Ln 1704, Col 14)
$dA
// @from(Ln 1705, Col 4)
TCA = w(() => {
  zdA = Hb0("BASH_MAX_OUTPUT_LENGTH"), Eb0 = Hb0("TASK_MAX_OUTPUT_LENGTH"), $dA = {
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
// @from(Ln 1732, Col 4)
zb0 = "claude-code-20250219"
// @from(Ln 1733, Col 2)
$b0 = "interleaved-thinking-2025-05-14"
// @from(Ln 1734, Col 2)
n5A = "context-1m-2025-08-07"
// @from(Ln 1735, Col 2)
CdA = "context-management-2025-06-27"
// @from(Ln 1736, Col 2)
Cb0 = "structured-outputs-2025-09-17"
// @from(Ln 1737, Col 2)
pU1 = "web-search-2025-03-05"
// @from(Ln 1738, Col 2)
UdA = "tool-examples-2025-10-29"
// @from(Ln 1739, Col 2)
Ub0 = "advanced-tool-use-2025-11-20"
// @from(Ln 1740, Col 2)
qb0 = "tool-search-tool-2025-10-19"
// @from(Ln 1741, Col 2)
lU1
// @from(Ln 1741, Col 7)
iU1
// @from(Ln 1742, Col 4)
a5A = w(() => {
  lU1 = new Set(["interleaved-thinking-2025-05-14", "context-1m-2025-08-07", "tool-search-tool-2025-10-19", "tool-examples-2025-10-29"]), iU1 = new Set(["claude-code-20250219", "interleaved-thinking-2025-05-14", "fine-grained-tool-streaming-2025-05-14", "context-management-2025-06-27"])
})
// @from(Ln 1746, Col 0)
function HT9(A) {
  return A.toLowerCase().includes("claude-sonnet-4")
}
// @from(Ln 1750, Col 0)
function Jq(A, Q) {
  if (A.includes("[1m]") || Q?.includes(n5A) && HT9(A)) return 1e6;
  return VT9
}
// @from(Ln 1755, Col 0)
function o5A(A) {
  let Q = A.toLowerCase(),
    B;
  if (Q.includes("3-5")) B = 8192;
  else if (Q.includes("claude-3-opus")) B = 4096;
  else if (Q.includes("claude-3-sonnet")) B = 8192;
  else if (Q.includes("claude-3-haiku")) B = 4096;
  else if (Q.includes("opus-4-5")) B = 64000;
  else if (Q.includes("opus-4")) B = 32000;
  else if (Q.includes("sonnet-4") || Q.includes("haiku-4")) B = 64000;
  else B = FT9;
  return B
}
// @from(Ln 1768, Col 4)
VT9 = 200000
// @from(Ln 1769, Col 2)
nU1 = 20000
// @from(Ln 1770, Col 2)
FT9 = 32000
// @from(Ln 1771, Col 4)
FT = w(() => {
  a5A()
})
// @from(Ln 1784, Col 0)
function $T9() {
  let A = "";
  if (typeof process < "u" && typeof process.cwd === "function") A = zT9(ET9());
  return {
    originalCwd: A,
    projectRoot: A,
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
    sessionId: Nb0(),
    loggerProvider: null,
    eventLogger: null,
    meterProvider: null,
    tracerProvider: null,
    agentColorMap: new Map,
    agentColorIndex: 0,
    envVarValidators: [zdA, $dA],
    lastAPIRequest: null,
    inMemoryErrorLog: [],
    inlinePlugins: [],
    sessionBypassPermissionsMode: !1,
    sessionTrustAccepted: !1,
    sessionPersistenceDisabled: !1,
    hasExitedPlanMode: !1,
    needsPlanModeExitAttachment: !1,
    hasExitedDelegateMode: !1,
    needsDelegateModeExitAttachment: !1,
    lspRecommendationShownThisSession: !1,
    initJsonSchema: null,
    registeredHooks: null,
    planSlugCache: new Map,
    teleportedSessionInfo: null,
    invokedSkills: new Map,
    slowOperations: [],
    sdkBetas: void 0,
    mainThreadAgentType: void 0
  }
}
// @from(Ln 1850, Col 0)
function q0() {
  return g0.sessionId
}
// @from(Ln 1854, Col 0)
function wb0() {
  return g0.sessionId = Nb0(), g0.sessionId
}
// @from(Ln 1858, Col 0)
function pw(A) {
  if (g0.sessionId = A, process.env.CLAUDE_CODE_SESSION_ID !== void 0) process.env.CLAUDE_CODE_SESSION_ID = A
}
// @from(Ln 1862, Col 0)
function EQ() {
  return g0.originalCwd
}
// @from(Ln 1866, Col 0)
function Xq() {
  return g0.projectRoot
}
// @from(Ln 1870, Col 0)
function Lb0(A) {
  g0.originalCwd = A
}
// @from(Ln 1874, Col 0)
function _y() {
  return g0.cwd
}
// @from(Ln 1878, Col 0)
function Ob0(A) {
  g0.cwd = A
}
// @from(Ln 1882, Col 0)
function Mb0(A, Q) {
  g0.totalAPIDuration += A, g0.totalAPIDurationWithoutRetries += Q
}
// @from(Ln 1886, Col 0)
function Rb0(A, Q, B) {
  g0.totalCostUSD += A;
  let G = g0.modelUsage[B] ?? {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadInputTokens: 0,
    cacheCreationInputTokens: 0,
    webSearchRequests: 0,
    costUSD: 0,
    contextWindow: 0,
    maxOutputTokens: 0
  };
  G.inputTokens += Q.input_tokens, G.outputTokens += Q.output_tokens, G.cacheReadInputTokens += Q.cache_read_input_tokens ?? 0, G.cacheCreationInputTokens += Q.cache_creation_input_tokens ?? 0, G.webSearchRequests += Q.server_tool_use?.web_search_requests ?? 0, G.costUSD += A, G.contextWindow = Jq(B, g0.sdkBetas), G.maxOutputTokens = o5A(B), g0.modelUsage[B] = G
}
// @from(Ln 1901, Col 0)
function $H() {
  return g0.totalCostUSD
}
// @from(Ln 1905, Col 0)
function PM() {
  return g0.totalAPIDuration
}
// @from(Ln 1909, Col 0)
function PCA() {
  return Date.now() - g0.startTime
}
// @from(Ln 1913, Col 0)
function _b0() {
  return g0.totalAPIDurationWithoutRetries
}
// @from(Ln 1917, Col 0)
function jb0() {
  return g0.totalToolDuration
}
// @from(Ln 1921, Col 0)
function aU1(A) {
  g0.totalToolDuration += A
}
// @from(Ln 1925, Col 0)
function SCA() {
  g0.lastInteractionTime = Date.now()
}
// @from(Ln 1929, Col 0)
function oU1(A, Q) {
  g0.totalLinesAdded += A, g0.totalLinesRemoved += Q
}
// @from(Ln 1933, Col 0)
function r5A() {
  return g0.totalLinesAdded
}
// @from(Ln 1937, Col 0)
function s5A() {
  return g0.totalLinesRemoved
}
// @from(Ln 1941, Col 0)
function qdA() {
  return i5A(Object.values(g0.modelUsage), "inputTokens")
}
// @from(Ln 1945, Col 0)
function NdA() {
  return i5A(Object.values(g0.modelUsage), "outputTokens")
}
// @from(Ln 1949, Col 0)
function Tb0() {
  return i5A(Object.values(g0.modelUsage), "cacheReadInputTokens")
}
// @from(Ln 1953, Col 0)
function Pb0() {
  return i5A(Object.values(g0.modelUsage), "cacheCreationInputTokens")
}
// @from(Ln 1957, Col 0)
function Sb0() {
  return i5A(Object.values(g0.modelUsage), "webSearchRequests")
}
// @from(Ln 1961, Col 0)
function rU1() {
  g0.hasUnknownModelCost = !0
}
// @from(Ln 1965, Col 0)
function xb0() {
  return g0.hasUnknownModelCost
}
// @from(Ln 1969, Col 0)
function wdA() {
  return g0.lastInteractionTime
}
// @from(Ln 1973, Col 0)
function jy() {
  return g0.modelUsage
}
// @from(Ln 1977, Col 0)
function yb0() {
  return g0.mainLoopModelOverride
}
// @from(Ln 1981, Col 0)
function LdA() {
  return g0.initialMainLoopModel
}
// @from(Ln 1985, Col 0)
function dAA(A) {
  g0.mainLoopModelOverride = A
}
// @from(Ln 1989, Col 0)
function vb0(A) {
  g0.initialMainLoopModel = A
}
// @from(Ln 1993, Col 0)
function SM() {
  return g0.sdkBetas
}
// @from(Ln 1997, Col 0)
function kb0(A) {
  g0.sdkBetas = A
}
// @from(Ln 2001, Col 0)
function xCA() {
  g0.totalCostUSD = 0, g0.totalAPIDuration = 0, g0.totalAPIDurationWithoutRetries = 0, g0.totalToolDuration = 0, g0.startTime = Date.now(), g0.totalLinesAdded = 0, g0.totalLinesRemoved = 0, g0.hasUnknownModelCost = !1, g0.modelUsage = {}
}
// @from(Ln 2005, Col 0)
function OdA({
  totalCostUSD: A,
  totalAPIDuration: Q,
  totalAPIDurationWithoutRetries: B,
  totalToolDuration: G,
  totalLinesAdded: Z,
  totalLinesRemoved: Y,
  lastDuration: J,
  modelUsage: X
}) {
  if (g0.totalCostUSD = A, g0.totalAPIDuration = Q, g0.totalAPIDurationWithoutRetries = B, g0.totalToolDuration = G, g0.totalLinesAdded = Z, g0.totalLinesRemoved = Y, X) g0.modelUsage = X;
  if (J) g0.startTime = Date.now() - J
}
// @from(Ln 2019, Col 0)
function MdA() {
  return g0.modelStrings
}
// @from(Ln 2023, Col 0)
function sU1(A) {
  g0.modelStrings = A
}
// @from(Ln 2027, Col 0)
function bb0(A, Q) {
  g0.meter = A, g0.sessionCounter = Q("claude_code.session.count", {
    description: "Count of CLI sessions started"
  }), g0.locCounter = Q("claude_code.lines_of_code.count", {
    description: "Count of lines of code modified, with the 'type' attribute indicating whether lines were added or removed"
  }), g0.prCounter = Q("claude_code.pull_request.count", {
    description: "Number of pull requests created"
  }), g0.commitCounter = Q("claude_code.commit.count", {
    description: "Number of git commits created"
  }), g0.costCounter = Q("claude_code.cost.usage", {
    description: "Cost of the Claude Code session",
    unit: "USD"
  }), g0.tokenCounter = Q("claude_code.token.usage", {
    description: "Number of tokens used",
    unit: "tokens"
  }), g0.codeEditToolDecisionCounter = Q("claude_code.code_edit_tool.decision", {
    description: "Count of code editing tool permission decisions (accept/reject) for Edit, Write, and NotebookEdit tools"
  }), g0.activeTimeCounter = Q("claude_code.active_time.total", {
    description: "Total active time in seconds",
    unit: "s"
  })
}
// @from(Ln 2050, Col 0)
function fb0() {
  return g0.sessionCounter
}
// @from(Ln 2054, Col 0)
function tU1() {
  return g0.locCounter
}
// @from(Ln 2058, Col 0)
function eU1() {
  return g0.prCounter
}
// @from(Ln 2062, Col 0)
function hb0() {
  return g0.commitCounter
}
// @from(Ln 2066, Col 0)
function gb0() {
  return g0.costCounter
}
// @from(Ln 2070, Col 0)
function yCA() {
  return g0.tokenCounter
}
// @from(Ln 2074, Col 0)
function vCA() {
  return g0.codeEditToolDecisionCounter
}
// @from(Ln 2078, Col 0)
function Aq1() {
  return g0.activeTimeCounter
}
// @from(Ln 2082, Col 0)
function RdA() {
  return g0.loggerProvider
}
// @from(Ln 2086, Col 0)
function Qq1(A) {
  g0.loggerProvider = A
}
// @from(Ln 2090, Col 0)
function ub0() {
  return g0.eventLogger
}
// @from(Ln 2094, Col 0)
function Bq1(A) {
  g0.eventLogger = A
}
// @from(Ln 2098, Col 0)
function mb0() {
  return g0.meterProvider
}
// @from(Ln 2102, Col 0)
function Gq1(A) {
  g0.meterProvider = A
}
// @from(Ln 2106, Col 0)
function t5A() {
  return g0.tracerProvider
}
// @from(Ln 2110, Col 0)
function Zq1(A) {
  g0.tracerProvider = A
}
// @from(Ln 2114, Col 0)
function p2() {
  return !g0.isInteractive
}
// @from(Ln 2118, Col 0)
function e5A() {
  return g0.isInteractive
}
// @from(Ln 2122, Col 0)
function db0(A) {
  g0.isInteractive = A
}
// @from(Ln 2126, Col 0)
function _dA() {
  return g0.clientType
}
// @from(Ln 2130, Col 0)
function cb0(A) {
  g0.clientType = A
}
// @from(Ln 2134, Col 0)
function Yq1() {
  return g0.agentColorMap
}
// @from(Ln 2138, Col 0)
function Jq1() {
  return g0.flagSettingsPath
}
// @from(Ln 2142, Col 0)
function pb0(A) {
  g0.flagSettingsPath = A
}
// @from(Ln 2146, Col 0)
function lb0() {
  return g0.sessionIngressToken
}
// @from(Ln 2150, Col 0)
function A7A(A) {
  g0.sessionIngressToken = A
}
// @from(Ln 2154, Col 0)
function ib0() {
  return g0.oauthTokenFromFd
}
// @from(Ln 2158, Col 0)
function Q7A(A) {
  g0.oauthTokenFromFd = A
}
// @from(Ln 2162, Col 0)
function nb0() {
  return g0.apiKeyFromFd
}
// @from(Ln 2166, Col 0)
function B7A(A) {
  g0.apiKeyFromFd = A
}
// @from(Ln 2170, Col 0)
function ab0() {
  return g0.envVarValidators
}
// @from(Ln 2174, Col 0)
function ob0(A) {
  g0.lastAPIRequest = A
}
// @from(Ln 2178, Col 0)
function rb0() {
  return g0.lastAPIRequest
}
// @from(Ln 2182, Col 0)
function sb0() {
  return g0.allowedSettingSources
}
// @from(Ln 2186, Col 0)
function tb0(A) {
  g0.allowedSettingSources = A
}
// @from(Ln 2190, Col 0)
function eb0() {
  return p2() && g0.clientType !== "claude-vscode"
}
// @from(Ln 2194, Col 0)
function Af0(A) {
  g0.inlinePlugins = A
}
// @from(Ln 2198, Col 0)
function Qf0() {
  return g0.inlinePlugins
}
// @from(Ln 2202, Col 0)
function Bf0(A) {
  g0.sessionBypassPermissionsMode = A
}
// @from(Ln 2206, Col 0)
function Gf0() {
  return g0.sessionBypassPermissionsMode
}
// @from(Ln 2210, Col 0)
function Zf0(A) {
  g0.sessionTrustAccepted = A
}
// @from(Ln 2214, Col 0)
function Yf0() {
  return g0.sessionTrustAccepted
}
// @from(Ln 2218, Col 0)
function Jf0(A) {
  g0.sessionPersistenceDisabled = A
}
// @from(Ln 2222, Col 0)
function cAA() {
  return g0.sessionPersistenceDisabled
}
// @from(Ln 2226, Col 0)
function Xf0() {
  return g0.hasExitedPlanMode
}
// @from(Ln 2230, Col 0)
function Iq(A) {
  g0.hasExitedPlanMode = A
}
// @from(Ln 2234, Col 0)
function If0() {
  return g0.needsPlanModeExitAttachment
}
// @from(Ln 2238, Col 0)
function lw(A) {
  g0.needsPlanModeExitAttachment = A
}
// @from(Ln 2242, Col 0)
function Ty(A, Q) {
  if (Q === "plan" && A !== "plan") g0.needsPlanModeExitAttachment = !1;
  if (A === "plan" && Q !== "plan") g0.needsPlanModeExitAttachment = !0
}
// @from(Ln 2247, Col 0)
function Df0(A) {
  g0.hasExitedDelegateMode = A
}
// @from(Ln 2251, Col 0)
function Wf0() {
  return g0.needsDelegateModeExitAttachment
}
// @from(Ln 2255, Col 0)
function jdA(A) {
  g0.needsDelegateModeExitAttachment = A
}
// @from(Ln 2259, Col 0)
function Kf0() {
  return g0.lspRecommendationShownThisSession
}
// @from(Ln 2263, Col 0)
function Vf0(A) {
  g0.lspRecommendationShownThisSession = A
}
// @from(Ln 2267, Col 0)
function Ff0(A) {
  g0.initJsonSchema = A
}
// @from(Ln 2271, Col 0)
function Xq1() {
  return g0.initJsonSchema
}
// @from(Ln 2275, Col 0)
function G7A(A) {
  if (!g0.registeredHooks) g0.registeredHooks = {};
  for (let [Q, B] of Object.entries(A)) {
    let G = Q;
    if (!g0.registeredHooks[G]) g0.registeredHooks[G] = [];
    g0.registeredHooks[G].push(...B)
  }
}
// @from(Ln 2284, Col 0)
function TdA() {
  return g0.registeredHooks
}
// @from(Ln 2288, Col 0)
function Hf0() {
  if (!g0.registeredHooks) return;
  let A = {};
  for (let [Q, B] of Object.entries(g0.registeredHooks)) {
    let G = B.filter((Z) => !("pluginRoot" in Z));
    if (G.length > 0) A[Q] = G
  }
  g0.registeredHooks = Object.keys(A).length > 0 ? A : null
}
// @from(Ln 2298, Col 0)
function Z7A() {
  return g0.planSlugCache
}
// @from(Ln 2302, Col 0)
function PdA(A) {
  g0.teleportedSessionInfo = {
    isTeleported: !0,
    hasLoggedFirstMessage: !1,
    sessionId: A.sessionId
  }
}
// @from(Ln 2310, Col 0)
function Iq1() {
  return g0.teleportedSessionInfo
}
// @from(Ln 2314, Col 0)
function Dq1() {
  if (g0.teleportedSessionInfo) g0.teleportedSessionInfo.hasLoggedFirstMessage = !0
}
// @from(Ln 2318, Col 0)
function Ef0(A, Q, B) {
  g0.invokedSkills.set(A, {
    skillName: A,
    skillPath: Q,
    content: B,
    invokedAt: Date.now()
  })
}
// @from(Ln 2327, Col 0)
function zf0() {
  return g0.invokedSkills
}
// @from(Ln 2331, Col 0)
function $f0() {
  return g0.mainThreadAgentType
}
// @from(Ln 2335, Col 0)
function Cf0(A) {
  g0.mainThreadAgentType = A
}
// @from(Ln 2338, Col 4)
g0
// @from(Ln 2339, Col 4)
C0 = w(() => {
  Fb0();
  TCA();
  FT();
  g0 = $T9()
})
// @from(Ln 2352, Col 0)
function MW(A, Q) {
  let B = performance.now();
  try {
    return Q()
  } finally {
    performance.now() - B > Bg
  }
}
// @from(Ln 2361, Col 0)
function xI(A, Q) {
  if (!A.existsSync(Q)) return {
    resolvedPath: Q,
    isSymlink: !1
  };
  try {
    let B = A.lstatSync(Q);
    if (B.isFIFO() || B.isSocket() || B.isCharacterDevice() || B.isBlockDevice()) return {
      resolvedPath: Q,
      isSymlink: !1
    };
    let G = A.realpathSync(Q);
    return {
      resolvedPath: G,
      isSymlink: G !== Q
    }
  } catch (B) {
    return {
      resolvedPath: Q,
      isSymlink: !1
    }
  }
}
// @from(Ln 2385, Col 0)
function Py(A, Q, B) {
  let {
    resolvedPath: G
  } = xI(A, Q);
  if (B.has(G)) return !0;
  return B.add(G), !1
}
// @from(Ln 2393, Col 0)
function pAA(A) {
  let Q = new Set,
    B = vA();
  Q.add(A);
  try {
    let Y = A,
      J = new Set,
      X = 40;
    for (let I = 0; I < X; I++) {
      if (J.has(Y)) break;
      if (J.add(Y), !B.existsSync(Y)) break;
      let D = B.lstatSync(Y);
      if (D.isFIFO() || D.isSocket() || D.isCharacterDevice() || D.isBlockDevice()) break;
      if (!D.isSymbolicLink()) break;
      let W = B.readlinkSync(Y),
        K = Y7A.isAbsolute(W) ? W : Y7A.resolve(Y7A.dirname(Y), W);
      Q.add(K), Y = K
    }
  } catch {}
  let {
    resolvedPath: G,
    isSymlink: Z
  } = xI(B, A);
  if (Z && G !== A) Q.add(G);
  return Array.from(Q)
}
// @from(Ln 2420, Col 0)
function vA() {
  return wT9
}
// @from(Ln 2423, Col 0)
async function* Uf0(A) {
  let B = await UT9(A, "r");
  try {
    let Z = (await B.stat()).size,
      Y = "",
      J = Buffer.alloc(4096);
    while (Z > 0) {
      let X = Math.min(4096, Z);
      Z -= X, await B.read(J, 0, X, Z);
      let D = (J.toString("utf8", 0, X) + Y).split(`
`);
      Y = D[0] || "";
      for (let W = D.length - 1; W >= 1; W--) {
        let K = D[W];
        if (K) yield K
      }
    }
    if (Y) yield Y
  } finally {
    await B.close()
  }
}
// @from(Ln 2445, Col 4)
qT9 = !1
// @from(Ln 2446, Col 2)
NT9
// @from(Ln 2446, Col 7)
wT9
// @from(Ln 2447, Col 4)
DQ = w(() => {
  T1();
  A0();
  C0();
  NT9 = {
    cwd() {
      return process.cwd()
    },
    existsSync(A) {
      return MW(`existsSync(${A})`, () => $6.existsSync(A))
    },
    async stat(A) {
      return CT9(A)
    },
    statSync(A) {
      return MW(`statSync(${A})`, () => $6.statSync(A))
    },
    lstatSync(A) {
      return MW(`lstatSync(${A})`, () => $6.lstatSync(A))
    },
    readFileSync(A, Q) {
      return MW(`readFileSync(${A})`, () => $6.readFileSync(A, {
        encoding: Q.encoding
      }))
    },
    readFileBytesSync(A) {
      return MW(`readFileBytesSync(${A})`, () => $6.readFileSync(A))
    },
    readSync(A, Q) {
      return MW(`readSync(${A}, ${Q.length} bytes)`, () => {
        let B = void 0;
        try {
          B = $6.openSync(A, "r");
          let G = Buffer.alloc(Q.length),
            Z = $6.readSync(B, G, 0, Q.length, 0);
          return {
            buffer: G,
            bytesRead: Z
          }
        } finally {
          if (B) $6.closeSync(B)
        }
      })
    },
    appendFileSync(A, Q, B) {
      return MW(`appendFileSync(${A}, ${Q.length} chars)`, () => {
        if (!$6.existsSync(A) && B?.mode !== void 0) {
          let G = $6.openSync(A, "a", B.mode);
          try {
            $6.appendFileSync(G, Q)
          } finally {
            $6.closeSync(G)
          }
        } else $6.appendFileSync(A, Q)
      })
    },
    copyFileSync(A, Q) {
      return MW(`copyFileSync(${A} → ${Q})`, () => $6.copyFileSync(A, Q))
    },
    unlinkSync(A) {
      return MW(`unlinkSync(${A})`, () => $6.unlinkSync(A))
    },
    renameSync(A, Q) {
      return MW(`renameSync(${A} → ${Q})`, () => $6.renameSync(A, Q))
    },
    linkSync(A, Q) {
      return MW(`linkSync(${A} → ${Q})`, () => $6.linkSync(A, Q))
    },
    symlinkSync(A, Q) {
      return MW(`symlinkSync(${A} → ${Q})`, () => $6.symlinkSync(A, Q))
    },
    readlinkSync(A) {
      return MW(`readlinkSync(${A})`, () => $6.readlinkSync(A))
    },
    realpathSync(A) {
      return MW(`realpathSync(${A})`, () => $6.realpathSync(A))
    },
    mkdirSync(A, Q) {
      return MW(`mkdirSync(${A})`, () => {
        if (!$6.existsSync(A)) {
          let B = {
            recursive: !0
          };
          if (Q?.mode !== void 0) B.mode = Q.mode;
          $6.mkdirSync(A, B)
        }
      })
    },
    readdirSync(A) {
      return MW(`readdirSync(${A})`, () => $6.readdirSync(A, {
        withFileTypes: !0
      }))
    },
    readdirStringSync(A) {
      return MW(`readdirStringSync(${A})`, () => $6.readdirSync(A))
    },
    isDirEmptySync(A) {
      return MW(`isDirEmptySync(${A})`, () => {
        return this.readdirSync(A).length === 0
      })
    },
    rmdirSync(A) {
      return MW(`rmdirSync(${A})`, () => $6.rmdirSync(A))
    },
    rmSync(A, Q) {
      return MW(`rmSync(${A})`, () => $6.rmSync(A, Q))
    },
    createWriteStream(A) {
      return $6.createWriteStream(A)
    }
  }, wT9 = NT9
})
// @from(Ln 2566, Col 0)
function zQ() {
  return process.env.CLAUDE_CONFIG_DIR ?? LT9(OT9(), ".claude")
}
// @from(Ln 2570, Col 0)
function a1(A) {
  if (!A) return !1;
  if (typeof A === "boolean") return A;
  let Q = A.toLowerCase().trim();
  return ["1", "true", "yes", "on"].includes(Q)
}
// @from(Ln 2577, Col 0)
function iX(A) {
  if (A === void 0) return !1;
  if (typeof A === "boolean") return !A;
  if (!A) return !1;
  let Q = A.toLowerCase().trim();
  return ["0", "false", "no", "off"].includes(Q)
}
// @from(Ln 2585, Col 0)
function qf0(A) {
  let Q = {};
  if (A)
    for (let B of A) {
      let [G, ...Z] = B.split("=");
      if (!G || Z.length === 0) throw Error(`Invalid environment variable format: ${B}, environment variables should be added as: -e KEY1=value1 -e KEY2=value2`);
      Q[G] = Z.join("=")
    }
  return Q
}
// @from(Ln 2596, Col 0)
function lAA() {
  return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1"
}
// @from(Ln 2600, Col 0)
function HT() {
  return process.env.CLOUD_ML_REGION || "us-east5"
}
// @from(Ln 2604, Col 0)
function Wq1() {
  return a1(process.env.CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR)
}
// @from(Ln 2608, Col 0)
function SdA(A) {
  if (A?.startsWith("claude-haiku-4-5")) return process.env.VERTEX_REGION_CLAUDE_HAIKU_4_5 || HT();
  if (A?.startsWith("claude-3-5-haiku")) return process.env.VERTEX_REGION_CLAUDE_3_5_HAIKU || HT();
  if (A?.startsWith("claude-3-5-sonnet")) return process.env.VERTEX_REGION_CLAUDE_3_5_SONNET || HT();
  if (A?.startsWith("claude-3-7-sonnet")) return process.env.VERTEX_REGION_CLAUDE_3_7_SONNET || HT();
  if (A?.startsWith("claude-opus-4-1")) return process.env.VERTEX_REGION_CLAUDE_4_1_OPUS || HT();
  if (A?.startsWith("claude-opus-4")) return process.env.VERTEX_REGION_CLAUDE_4_0_OPUS || HT();
  if (A?.startsWith("claude-sonnet-4-5")) return process.env.VERTEX_REGION_CLAUDE_4_5_SONNET || HT();
  if (A?.startsWith("claude-sonnet-4")) return process.env.VERTEX_REGION_CLAUDE_4_0_SONNET || HT();
  return HT()
}
// @from(Ln 2619, Col 4)
fQ = () => {}
// @from(Ln 2621, Col 0)
function xdA({
  writeFn: A,
  flushIntervalMs: Q = 1000,
  maxBufferSize: B = 100,
  immediateMode: G = !1
}) {
  let Z = [],
    Y = null;

  function J() {
    if (Y) clearTimeout(Y), Y = null
  }

  function X() {
    if (Z.length === 0) return;
    A(Z.join("")), Z = [], J()
  }

  function I() {
    if (!Y) Y = setTimeout(X, Q)
  }
  return {
    write(D) {
      if (G) {
        A(D);
        return
      }
      if (Z.push(D), I(), Z.length >= B) X()
    },
    flush: X,
    dispose() {
      X()
    }
  }
}
// @from(Ln 2657, Col 0)
function C6(A) {
  return Kq1.add(A), () => Kq1.delete(A)
}
// @from(Ln 2660, Col 0)
async function Nf0() {
  await Promise.all(Array.from(Kq1).map((A) => A()))
}
// @from(Ln 2663, Col 4)
Kq1
// @from(Ln 2664, Col 4)
nX = w(() => {
  Kq1 = new Set
})
// @from(Ln 2672, Col 0)
function RT9(A) {
  if (typeof process > "u" || typeof process.versions > "u" || typeof process.versions.node > "u") return !1;
  let Q = MT9();
  return Sv0(A, Q)
}
// @from(Ln 2678, Col 0)
function Of0(A) {
  Lf0 = A
}
// @from(Ln 2682, Col 0)
function _T9() {
  if (!ydA) ydA = xdA({
    writeFn: (A) => {
      let Q = kCA();
      if (!vA().existsSync(Vq1(Q))) vA().mkdirSync(Vq1(Q));
      vA().appendFileSync(Q, A), jT9()
    },
    flushIntervalMs: 1000,
    maxBufferSize: 100,
    immediateMode: J7A()
  }), C6(async () => ydA?.dispose());
  return ydA
}
// @from(Ln 2696, Col 0)
function k(A, {
  level: Q
} = {
  level: "debug"
}) {
  if (!RT9(A)) return;
  if (Lf0 && A.includes(`
`)) A = eA(A);
  let G = `${new Date().toISOString()} [${Q.toUpperCase()}] ${A.trim()}
`;
  if (Sy()) {
    Tl(G);
    return
  }
  _T9().write(G)
}
// @from(Ln 2713, Col 0)
function kCA() {
  return process.env.CLAUDE_CODE_DEBUG_LOGS_DIR ?? wf0(zQ(), "debug", `${q0()}.txt`)
}
// @from(Ln 2717, Col 0)
function xM(A, Q) {
  return
}
// @from(Ln 2720, Col 4)
J7A
// @from(Ln 2720, Col 9)
MT9
// @from(Ln 2720, Col 14)
Sy
// @from(Ln 2720, Col 18)
Lf0 = !1
// @from(Ln 2721, Col 2)
ydA = null
// @from(Ln 2722, Col 2)
jT9
// @from(Ln 2723, Col 4)
T1 = w(() => {
  Y9();
  xv0();
  DQ();
  fQ();
  C0();
  nX();
  A0();
  J7A = W0(() => {
    return a1(process.env.DEBUG) || a1(process.env.DEBUG_SDK) || process.argv.includes("--debug") || process.argv.includes("-d") || Sy() || process.argv.some((A) => A.startsWith("--debug="))
  }), MT9 = W0(() => {
    let A = process.argv.find((B) => B.startsWith("--debug="));
    if (!A) return null;
    let Q = A.substring(8);
    return Pv0(Q)
  }), Sy = W0(() => {
    return process.argv.includes("--debug-to-stderr") || process.argv.includes("-d2e")
  });
  jT9 = W0(() => {
    if (process.argv[2] === "--ripgrep") return;
    try {
      let A = kCA(),
        Q = Vq1(A),
        B = wf0(Q, "latest");
      if (!vA().existsSync(Q)) vA().mkdirSync(Q);
      if (vA().existsSync(B)) try {
        vA().unlinkSync(B)
      } catch {}
      vA().symlinkSync(A, B)
    } catch {}
  })
})
// @from(Ln 2756, Col 0)
function TT9(A, Q) {
  var B = -1,
    G = A == null ? 0 : A.length;
  while (++B < G)
    if (Q(A[B], B, A) === !1) break;
  return A
}
// @from(Ln 2763, Col 4)
Mf0
// @from(Ln 2764, Col 4)
Rf0 = w(() => {
  Mf0 = TT9
})
// @from(Ln 2767, Col 4)
PT9
// @from(Ln 2767, Col 9)
X7A
// @from(Ln 2768, Col 4)
Fq1 = w(() => {
  Ol();
  PT9 = function () {
    try {
      var A = Yq(Object, "defineProperty");
      return A({}, "", {}), A
    } catch (Q) {}
  }(), X7A = PT9
})
// @from(Ln 2778, Col 0)
function ST9(A, Q, B) {
  if (Q == "__proto__" && X7A) X7A(A, Q, {
    configurable: !0,
    enumerable: !0,
    value: B,
    writable: !0
  });
  else A[Q] = B
}
// @from(Ln 2787, Col 4)
xl
// @from(Ln 2788, Col 4)
bCA = w(() => {
  Fq1();
  xl = ST9
})
// @from(Ln 2793, Col 0)
function vT9(A, Q, B) {
  var G = A[Q];
  if (!(yT9.call(A, Q) && Uy(G, B)) || B === void 0 && !(Q in A)) xl(A, Q, B)
}
// @from(Ln 2797, Col 4)
xT9
// @from(Ln 2797, Col 9)
yT9
// @from(Ln 2797, Col 14)
yl
// @from(Ln 2798, Col 4)
fCA = w(() => {
  bCA();
  O5A();
  xT9 = Object.prototype, yT9 = xT9.hasOwnProperty;
  yl = vT9
})
// @from(Ln 2805, Col 0)
function kT9(A, Q, B, G) {
  var Z = !B;
  B || (B = {});
  var Y = -1,
    J = Q.length;
  while (++Y < J) {
    var X = Q[Y],
      I = G ? G(B[X], A[X], X, B, A) : void 0;
    if (I === void 0) I = A[X];
    if (Z) xl(B, X, I);
    else yl(B, X, I)
  }
  return B
}
// @from(Ln 2819, Col 4)
yM
// @from(Ln 2820, Col 4)
iAA = w(() => {
  fCA();
  bCA();
  yM = kT9
})
// @from(Ln 2826, Col 0)
function bT9(A, Q) {
  return A && yM(Q, jM(Q), A)
}
// @from(Ln 2829, Col 4)
_f0
// @from(Ln 2830, Col 4)
jf0 = w(() => {
  iAA();
  gAA();
  _f0 = bT9
})
// @from(Ln 2836, Col 0)
function fT9(A) {
  var Q = [];
  if (A != null)
    for (var B in Object(A)) Q.push(B);
  return Q
}
// @from(Ln 2842, Col 4)
Tf0
// @from(Ln 2843, Col 4)
Pf0 = w(() => {
  Tf0 = fT9
})
// @from(Ln 2847, Col 0)
function uT9(A) {
  if (!lX(A)) return Tf0(A);
  var Q = k5A(A),
    B = [];
  for (var G in A)
    if (!(G == "constructor" && (Q || !gT9.call(A, G)))) B.push(G);
  return B
}
// @from(Ln 2855, Col 4)
hT9
// @from(Ln 2855, Col 9)
gT9
// @from(Ln 2855, Col 14)
Sf0
// @from(Ln 2856, Col 4)
xf0 = w(() => {
  _M();
  QdA();
  Pf0();
  hT9 = Object.prototype, gT9 = hT9.hasOwnProperty;
  Sf0 = uT9
})
// @from(Ln 2864, Col 0)
function mT9(A) {
  return Oy(A) ? AdA(A, !0) : Sf0(A)
}
// @from(Ln 2867, Col 4)
xy
// @from(Ln 2868, Col 4)
I7A = w(() => {
  hU1();
  xf0();
  b5A();
  xy = mT9
})
// @from(Ln 2875, Col 0)
function dT9(A, Q) {
  return A && yM(Q, xy(Q), A)
}
// @from(Ln 2878, Col 4)
yf0
// @from(Ln 2879, Col 4)
vf0 = w(() => {
  iAA();
  I7A();
  yf0 = dT9
})
// @from(Ln 2884, Col 4)
kdA = {}
// @from(Ln 2889, Col 0)
function pT9(A, Q) {
  if (Q) return A.slice();
  var B = A.length,
    G = ff0 ? ff0(B) : new A.constructor(B);
  return A.copy(G), G
}
// @from(Ln 2895, Col 4)
hf0
// @from(Ln 2895, Col 9)
kf0
// @from(Ln 2895, Col 14)
cT9
// @from(Ln 2895, Col 19)
bf0
// @from(Ln 2895, Col 24)
ff0
// @from(Ln 2895, Col 29)
hCA
// @from(Ln 2896, Col 4)
Hq1 = w(() => {
  VT();
  hf0 = typeof kdA == "object" && kdA && !kdA.nodeType && kdA, kf0 = hf0 && typeof vdA == "object" && vdA && !vdA.nodeType && vdA, cT9 = kf0 && kf0.exports === hf0, bf0 = cT9 ? OW.Buffer : void 0, ff0 = bf0 ? bf0.allocUnsafe : void 0;
  hCA = pT9
})
// @from(Ln 2902, Col 0)
function lT9(A, Q) {
  var B = -1,
    G = A.length;
  Q || (Q = Array(G));
  while (++B < G) Q[B] = A[B];
  return Q
}
// @from(Ln 2909, Col 4)
bdA
// @from(Ln 2910, Col 4)
Eq1 = w(() => {
  bdA = lT9
})
// @from(Ln 2914, Col 0)
function iT9(A, Q) {
  return yM(A, S5A(A), Q)
}
// @from(Ln 2917, Col 4)
gf0
// @from(Ln 2918, Col 4)
uf0 = w(() => {
  iAA();
  lmA();
  gf0 = iT9
})
// @from(Ln 2923, Col 4)
nT9
// @from(Ln 2923, Col 9)
D7A
// @from(Ln 2924, Col 4)
fdA = w(() => {
  gU1();
  nT9 = BdA(Object.getPrototypeOf, Object), D7A = nT9
})
// @from(Ln 2928, Col 4)
aT9
// @from(Ln 2928, Col 9)
oT9
// @from(Ln 2928, Col 14)
hdA
// @from(Ln 2929, Col 4)
zq1 = w(() => {
  mmA();
  fdA();
  lmA();
  kU1();
  aT9 = Object.getOwnPropertySymbols, oT9 = !aT9 ? pmA : function (A) {
    var Q = [];
    while (A) P5A(Q, S5A(A)), A = D7A(A);
    return Q
  }, hdA = oT9
})
// @from(Ln 2941, Col 0)
function rT9(A, Q) {
  return yM(A, hdA(A), Q)
}
// @from(Ln 2944, Col 4)
mf0
// @from(Ln 2945, Col 4)
df0 = w(() => {
  iAA();
  zq1();
  mf0 = rT9
})
// @from(Ln 2951, Col 0)
function sT9(A) {
  return dmA(A, xy, hdA)
}
// @from(Ln 2954, Col 4)
gdA
// @from(Ln 2955, Col 4)
$q1 = w(() => {
  yU1();
  zq1();
  I7A();
  gdA = sT9
})
// @from(Ln 2962, Col 0)
function AP9(A) {
  var Q = A.length,
    B = new A.constructor(Q);
  if (Q && typeof A[0] == "string" && eT9.call(A, "index")) B.index = A.index, B.input = A.input;
  return B
}
// @from(Ln 2968, Col 4)
tT9
// @from(Ln 2968, Col 9)
eT9
// @from(Ln 2968, Col 14)
cf0
// @from(Ln 2969, Col 4)
pf0 = w(() => {
  tT9 = Object.prototype, eT9 = tT9.hasOwnProperty;
  cf0 = AP9
})
// @from(Ln 2974, Col 0)
function QP9(A) {
  var Q = new A.constructor(A.byteLength);
  return new j5A(Q).set(new j5A(A)), Q
}
// @from(Ln 2978, Col 4)
W7A
// @from(Ln 2979, Col 4)
udA = w(() => {
  SU1();
  W7A = QP9
})
// @from(Ln 2984, Col 0)
function BP9(A, Q) {
  var B = Q ? W7A(A.buffer) : A.buffer;
  return new A.constructor(B, A.byteOffset, A.byteLength)
}
// @from(Ln 2988, Col 4)
lf0
// @from(Ln 2989, Col 4)
if0 = w(() => {
  udA();
  lf0 = BP9
})
// @from(Ln 2994, Col 0)
function ZP9(A) {
  var Q = new A.constructor(A.source, GP9.exec(A));
  return Q.lastIndex = A.lastIndex, Q
}
// @from(Ln 2998, Col 4)
GP9
// @from(Ln 2998, Col 9)
nf0
// @from(Ln 2999, Col 4)
af0 = w(() => {
  GP9 = /\w*$/;
  nf0 = ZP9
})
// @from(Ln 3004, Col 0)
function YP9(A) {
  return rf0 ? Object(rf0.call(A)) : {}
}
// @from(Ln 3007, Col 4)
of0
// @from(Ln 3007, Col 9)
rf0
// @from(Ln 3007, Col 14)
sf0
// @from(Ln 3008, Col 4)
tf0 = w(() => {
  bAA();
  of0 = mV ? mV.prototype : void 0, rf0 = of0 ? of0.valueOf : void 0;
  sf0 = YP9
})
// @from(Ln 3014, Col 0)
function JP9(A, Q) {
  var B = Q ? W7A(A.buffer) : A.buffer;
  return new A.constructor(B, A.byteOffset, A.length)
}
// @from(Ln 3018, Col 4)
mdA
// @from(Ln 3019, Col 4)
Cq1 = w(() => {
  udA();
  mdA = JP9
})
// @from(Ln 3024, Col 0)
function RP9(A, Q, B) {
  var G = A.constructor;
  switch (Q) {
    case EP9:
      return W7A(A);
    case XP9:
    case IP9:
      return new G(+A);
    case zP9:
      return lf0(A, B);
    case $P9:
    case CP9:
    case UP9:
    case qP9:
    case NP9:
    case wP9:
    case LP9:
    case OP9:
    case MP9:
      return mdA(A, B);
    case DP9:
      return new G;
    case WP9:
    case FP9:
      return new G(A);
    case KP9:
      return nf0(A);
    case VP9:
      return new G;
    case HP9:
      return sf0(A)
  }
}
// @from(Ln 3057, Col 4)
XP9 = "[object Boolean]"
// @from(Ln 3058, Col 2)
IP9 = "[object Date]"
// @from(Ln 3059, Col 2)
DP9 = "[object Map]"
// @from(Ln 3060, Col 2)
WP9 = "[object Number]"
// @from(Ln 3061, Col 2)
KP9 = "[object RegExp]"
// @from(Ln 3062, Col 2)
VP9 = "[object Set]"
// @from(Ln 3063, Col 2)
FP9 = "[object String]"
// @from(Ln 3064, Col 2)
HP9 = "[object Symbol]"
// @from(Ln 3065, Col 2)
EP9 = "[object ArrayBuffer]"
// @from(Ln 3066, Col 2)
zP9 = "[object DataView]"
// @from(Ln 3067, Col 2)
$P9 = "[object Float32Array]"
// @from(Ln 3068, Col 2)
CP9 = "[object Float64Array]"
// @from(Ln 3069, Col 2)
UP9 = "[object Int8Array]"
// @from(Ln 3070, Col 2)
qP9 = "[object Int16Array]"
// @from(Ln 3071, Col 2)
NP9 = "[object Int32Array]"
// @from(Ln 3072, Col 2)
wP9 = "[object Uint8Array]"
// @from(Ln 3073, Col 2)
LP9 = "[object Uint8ClampedArray]"
// @from(Ln 3074, Col 2)
OP9 = "[object Uint16Array]"
// @from(Ln 3075, Col 2)
MP9 = "[object Uint32Array]"
// @from(Ln 3076, Col 2)
ef0
// @from(Ln 3077, Col 4)
Ah0 = w(() => {
  udA();
  if0();
  af0();
  tf0();
  Cq1();
  ef0 = RP9
})
// @from(Ln 3085, Col 4)
Qh0
// @from(Ln 3085, Col 9)
_P9
// @from(Ln 3085, Col 14)
Bh0
// @from(Ln 3086, Col 4)
Gh0 = w(() => {
  _M();
  Qh0 = Object.create, _P9 = function () {
    function A() {}
    return function (Q) {
      if (!lX(Q)) return {};
      if (Qh0) return Qh0(Q);
      A.prototype = Q;
      var B = new A;
      return A.prototype = void 0, B
    }
  }(), Bh0 = _P9
})
// @from(Ln 3100, Col 0)
function jP9(A) {
  return typeof A.constructor == "function" && !k5A(A) ? Bh0(D7A(A)) : {}
}
// @from(Ln 3103, Col 4)
ddA
// @from(Ln 3104, Col 4)
Uq1 = w(() => {
  Gh0();
  fdA();
  QdA();
  ddA = jP9
})
// @from(Ln 3111, Col 0)
function PP9(A) {
  return gK(A) && Qg(A) == TP9
}
// @from(Ln 3114, Col 4)
TP9 = "[object Map]"
// @from(Ln 3115, Col 2)
Zh0
// @from(Ln 3116, Col 4)
Yh0 = w(() => {
  jCA();
  Ny();
  Zh0 = PP9
})
// @from(Ln 3121, Col 4)
Jh0
// @from(Ln 3121, Col 9)
SP9
// @from(Ln 3121, Col 14)
Xh0
// @from(Ln 3122, Col 4)
Ih0 = w(() => {
  Yh0();
  omA();
  tmA();
  Jh0 = Ly && Ly.isMap, SP9 = Jh0 ? y5A(Jh0) : Zh0, Xh0 = SP9
})
// @from(Ln 3129, Col 0)
function yP9(A) {
  return gK(A) && Qg(A) == xP9
}
// @from(Ln 3132, Col 4)
xP9 = "[object Set]"
// @from(Ln 3133, Col 2)
Dh0
// @from(Ln 3134, Col 4)
Wh0 = w(() => {
  jCA();
  Ny();
  Dh0 = yP9
})
// @from(Ln 3139, Col 4)
Kh0
// @from(Ln 3139, Col 9)
vP9
// @from(Ln 3139, Col 14)
Vh0
// @from(Ln 3140, Col 4)
Fh0 = w(() => {
  Wh0();
  omA();
  tmA();
  Kh0 = Ly && Ly.isSet, vP9 = Kh0 ? y5A(Kh0) : Dh0, Vh0 = vP9
})
// @from(Ln 3147, Col 0)
function cdA(A, Q, B, G, Z, Y) {
  var J, X = Q & kP9,
    I = Q & bP9,
    D = Q & fP9;
  if (B) J = Z ? B(A, G, Z, Y) : B(A);
  if (J !== void 0) return J;
  if (!lX(A)) return A;
  var W = wG(A);
  if (W) {
    if (J = cf0(A), !X) return bdA(A, J)
  } else {
    var K = Qg(A),
      V = K == Eh0 || K == dP9;
    if (wy(A)) return hCA(A, X);
    if (K == zh0 || K == Hh0 || V && !Z) {
      if (J = I || V ? {} : ddA(A), !X) return I ? mf0(A, yf0(J, A)) : gf0(A, _f0(J, A))
    } else {
      if (!kY[K]) return Z ? A : {};
      J = ef0(A, K, X)
    }
  }
  Y || (Y = new qy);
  var F = Y.get(A);
  if (F) return F;
  if (Y.set(A, J), Vh0(A)) A.forEach(function (z) {
    J.add(cdA(z, Q, B, z, A, Y))
  });
  else if (Xh0(A)) A.forEach(function (z, $) {
    J.set($, cdA(z, Q, B, $, A, Y))
  });
  var H = D ? I ? gdA : _CA : I ? xy : jM,
    E = W ? void 0 : H(A);
  return Mf0(E || A, function (z, $) {
    if (E) $ = z, z = A[$];
    yl(J, $, cdA(z, Q, B, $, A, Y))
  }), J
}
// @from(Ln 3184, Col 4)
kP9 = 1
// @from(Ln 3185, Col 2)
bP9 = 2
// @from(Ln 3186, Col 2)
fP9 = 4
// @from(Ln 3187, Col 2)
Hh0 = "[object Arguments]"
// @from(Ln 3188, Col 2)
hP9 = "[object Array]"
// @from(Ln 3189, Col 2)
gP9 = "[object Boolean]"
// @from(Ln 3190, Col 2)
uP9 = "[object Date]"
// @from(Ln 3191, Col 2)
mP9 = "[object Error]"
// @from(Ln 3192, Col 2)
Eh0 = "[object Function]"
// @from(Ln 3193, Col 2)
dP9 = "[object GeneratorFunction]"
// @from(Ln 3194, Col 2)
cP9 = "[object Map]"
// @from(Ln 3195, Col 2)
pP9 = "[object Number]"
// @from(Ln 3196, Col 2)
zh0 = "[object Object]"
// @from(Ln 3197, Col 2)
lP9 = "[object RegExp]"
// @from(Ln 3198, Col 2)
iP9 = "[object Set]"
// @from(Ln 3199, Col 2)
nP9 = "[object String]"
// @from(Ln 3200, Col 2)
aP9 = "[object Symbol]"
// @from(Ln 3201, Col 2)
oP9 = "[object WeakMap]"
// @from(Ln 3202, Col 2)
rP9 = "[object ArrayBuffer]"
// @from(Ln 3203, Col 2)
sP9 = "[object DataView]"
// @from(Ln 3204, Col 2)
tP9 = "[object Float32Array]"
// @from(Ln 3205, Col 2)
eP9 = "[object Float64Array]"
// @from(Ln 3206, Col 2)
AS9 = "[object Int8Array]"
// @from(Ln 3207, Col 2)
QS9 = "[object Int16Array]"
// @from(Ln 3208, Col 2)
BS9 = "[object Int32Array]"
// @from(Ln 3209, Col 2)
GS9 = "[object Uint8Array]"
// @from(Ln 3210, Col 2)
ZS9 = "[object Uint8ClampedArray]"
// @from(Ln 3211, Col 2)
YS9 = "[object Uint16Array]"
// @from(Ln 3212, Col 2)
JS9 = "[object Uint32Array]"
// @from(Ln 3213, Col 2)
kY
// @from(Ln 3213, Col 6)
pdA
// @from(Ln 3214, Col 4)
qq1 = w(() => {
  wCA();
  Rf0();
  fCA();
  jf0();
  vf0();
  Hq1();
  Eq1();
  uf0();
  df0();
  uU1();
  $q1();
  jCA();
  pf0();
  Ah0();
  Uq1();
  e$();
  OCA();
  Ih0();
  _M();
  Fh0();
  gAA();
  I7A();
  kY = {};
  kY[Hh0] = kY[hP9] = kY[rP9] = kY[sP9] = kY[gP9] = kY[uP9] = kY[tP9] = kY[eP9] = kY[AS9] = kY[QS9] = kY[BS9] = kY[cP9] = kY[pP9] = kY[zh0] = kY[lP9] = kY[iP9] = kY[nP9] = kY[aP9] = kY[GS9] = kY[ZS9] = kY[YS9] = kY[JS9] = !0;
  kY[mP9] = kY[Eh0] = kY[oP9] = !1;
  pdA = cdA
})
// @from(Ln 3243, Col 0)
function DS9(A) {
  return pdA(A, XS9 | IS9)
}
// @from(Ln 3246, Col 4)
XS9 = 1
// @from(Ln 3247, Col 2)
IS9 = 4
// @from(Ln 3248, Col 2)
gCA
// @from(Ln 3249, Col 4)
Nq1 = w(() => {
  qq1();
  gCA = DS9
})
// @from(Ln 3260, Col 0)
function wq1(A) {
  if (A === null) return "null";
  if (A === void 0) return "undefined";
  if (Array.isArray(A)) return `Array[${A.length}]`;
  if (typeof A === "object") return `Object{${Object.keys(A).length} keys}`;
  if (typeof A === "string") return `string(${A.length} chars)`;
  return typeof A
}
// @from(Ln 3269, Col 0)
function ldA(A, Q) {
  let B = performance.now();
  try {
    return Q()
  } finally {
    performance.now() - B > Bg
  }
}
// @from(Ln 3278, Col 0)
function eA(A, Q, B) {
  let G = wq1(A);
  return ldA(`JSON.stringify(${G})`, () => JSON.stringify(A, Q, B))
}
// @from(Ln 3283, Col 0)
function Ch0(A, Q) {
  let B = wq1(A);
  return ldA(`structuredClone(${B})`, () => structuredClone(A, Q))
}
// @from(Ln 3288, Col 0)
function nAA(A) {
  let Q = wq1(A);
  return ldA(`cloneDeep(${Q})`, () => gCA(A))
}
// @from(Ln 3293, Col 0)
function bB(A, Q, B) {
  let G = performance.now();
  try {
    if (B !== null && typeof B === "object" && "flush" in B && B.flush === !0) {
      let Y = typeof B === "object" && "encoding" in B ? B.encoding : void 0,
        J = typeof B === "object" && "mode" in B ? B.mode : void 0,
        X;
      try {
        X = WS9(A, "w", J), $h0(X, Q, {
          encoding: Y ?? void 0
        }), KS9(X)
      } finally {
        if (X !== void 0) VS9(X)
      }
    } else $h0(A, Q, B)
  } finally {
    performance.now() - G > Bg
  }
}
// @from(Ln 3312, Col 4)
Bg = 1 / 0
// @from(Ln 3313, Col 2)
AQ = (A, Q) => {
    let B = typeof A === "string" ? A.length : 0;
    return ldA(`JSON.parse(${B} chars)`, () => JSON.parse(A, Q))
  }
// @from(Ln 3317, Col 4)
A0 = w(() => {
  T1();
  C0();
  Nq1()
})
// @from(Ln 3323, Col 0)
function Uh0(A) {
  if (vl !== null) throw Error("Analytics sink already attached - cannot attach more than once");
  if (vl = A, uCA.length > 0) {
    let Q = [...uCA];
    uCA.length = 0, queueMicrotask(() => {
      for (let B of Q)
        if (B.async) vl.logEventAsync(B.eventName, B.metadata);
        else vl.logEvent(B.eventName, B.metadata)
    })
  }
}
// @from(Ln 3335, Col 0)
function l(A, Q) {
  if (vl === null) {
    uCA.push({
      eventName: A,
      metadata: Q,
      async: !1
    });
    return
  }
  vl.logEvent(A, Q)
}
// @from(Ln 3346, Col 0)
async function kl(A, Q) {
  if (vl === null) {
    uCA.push({
      eventName: A,
      metadata: Q,
      async: !0
    });
    return
  }
  await vl.logEventAsync(A, Q)
}
// @from(Ln 3357, Col 4)
uCA
// @from(Ln 3357, Col 9)
vl = null
// @from(Ln 3358, Col 4)
Z0 = w(() => {
  uCA = []
})
// @from(Ln 3366, Col 0)
function Mq1() {
  if (!Lq1) Lq1 = NA("perf_hooks").performance;
  return Lq1
}
// @from(Ln 3371, Col 0)
function x9(A) {
  if (!Lh0) return;
  if (Mq1().mark(A), idA) Oh0.set(A, process.memoryUsage())
}
// @from(Ln 3376, Col 0)
function Oq1(A) {
  return A.toFixed(3)
}
// @from(Ln 3380, Col 0)
function qh0(A) {
  return (A / 1024 / 1024).toFixed(2)
}
// @from(Ln 3384, Col 0)
function Nh0() {
  if (!idA) return "Startup profiling not enabled";
  let Q = Mq1().getEntriesByType("mark");
  if (Q.length === 0) return "No profiling checkpoints recorded";
  let B = [];
  B.push("=".repeat(80)), B.push("STARTUP PROFILING REPORT"), B.push("=".repeat(80)), B.push("");
  let G = 0;
  for (let J of Q) {
    let X = Oq1(J.startTime),
      I = Oq1(J.startTime - G),
      D = Oh0.get(J.name),
      W = D ? ` | RSS: ${qh0(D.rss)}MB, Heap: ${qh0(D.heapUsed)}MB` : "";
    B.push(`[+${X.padStart(8)}ms] (+${I.padStart(7)}ms) ${J.name}${W}`), G = J.startTime
  }
  let Z = Q[Q.length - 1],
    Y = Oq1(Z?.startTime ?? 0);
  return B.push(""), B.push(`Total startup time: ${Y}ms`), B.push("=".repeat(80)), B.join(`
`)
}
// @from(Ln 3404, Col 0)
function Mh0() {
  if (CS9(), idA) {
    let A = $S9(),
      Q = HS9(A),
      B = vA();
    if (!B.existsSync(Q)) B.mkdirSync(Q);
    bB(A, Nh0(), {
      encoding: "utf8",
      flush: !0
    }), k("Startup profiling report:"), k(Nh0())
  }
}
// @from(Ln 3417, Col 0)
function $S9() {
  return FS9(zQ(), "startup-perf", `${q0()}.txt`)
}
// @from(Ln 3421, Col 0)
function CS9() {
  if (!wh0) return;
  let Q = Mq1().getEntriesByType("mark");
  if (Q.length === 0) return;
  let B = new Map;
  for (let Z of Q) B.set(Z.name, Z.startTime);
  let G = {};
  for (let [Z, [Y, J]] of Object.entries(zS9)) {
    let X = B.get(Y),
      I = B.get(J);
    if (X !== void 0 && I !== void 0) G[`${Z}_ms`] = Math.round(I - X)
  }
  G.checkpoint_count = Q.length, l("tengu_startup_perf", G)
}
// @from(Ln 3435, Col 4)
idA
// @from(Ln 3435, Col 9)
ES9 = 0.005
// @from(Ln 3436, Col 2)
wh0
// @from(Ln 3436, Col 7)
Lh0
// @from(Ln 3436, Col 12)
Oh0
// @from(Ln 3436, Col 17)
Lq1 = null
// @from(Ln 3437, Col 2)
zS9
// @from(Ln 3438, Col 4)
aAA = w(() => {
  T1();
  Z0();
  fQ();
  C0();
  DQ();
  A0();
  idA = process.env.CLAUDE_CODE_PROFILE_STARTUP === "1", wh0 = Math.random() < ES9, Lh0 = idA || wh0, Oh0 = new Map;
  zS9 = {
    import_time: ["cli_entry", "main_tsx_imports_loaded"],
    init_time: ["init_function_start", "init_function_end"],
    settings_time: ["eagerLoadSettings_start", "eagerLoadSettings_end"],
    total_time: ["cli_entry", "main_after_run"]
  };
  if (Lh0) x9("profiler_initialized")
})
// @from(Ln 3455, Col 0)
function US9(A, Q, B) {
  if (B !== void 0 && !Uy(A[Q], B) || B === void 0 && !(Q in A)) xl(A, Q, B)
}
// @from(Ln 3458, Col 4)
mCA
// @from(Ln 3459, Col 4)
Rq1 = w(() => {
  bCA();
  O5A();
  mCA = US9
})
// @from(Ln 3465, Col 0)
function qS9(A) {
  return function (Q, B, G) {
    var Z = -1,
      Y = Object(Q),
      J = G(Q),
      X = J.length;
    while (X--) {
      var I = J[A ? X : ++Z];
      if (B(Y[I], I, Y) === !1) break
    }
    return Q
  }
}
// @from(Ln 3478, Col 4)
Rh0
// @from(Ln 3479, Col 4)
_h0 = w(() => {
  Rh0 = qS9
})
// @from(Ln 3482, Col 4)
NS9
// @from(Ln 3482, Col 9)
ndA
// @from(Ln 3483, Col 4)
_q1 = w(() => {
  _h0();
  NS9 = Rh0(), ndA = NS9
})
// @from(Ln 3488, Col 0)
function wS9(A) {
  return gK(A) && Oy(A)
}
// @from(Ln 3491, Col 4)
jh0
// @from(Ln 3492, Col 4)
Th0 = w(() => {
  b5A();
  Ny();
  jh0 = wS9
})
// @from(Ln 3498, Col 0)
function jS9(A) {
  if (!gK(A) || cw(A) != LS9) return !1;
  var Q = D7A(A);
  if (Q === null) return !0;
  var B = RS9.call(Q, "constructor") && Q.constructor;
  return typeof B == "function" && B instanceof B && Ph0.call(B) == _S9
}
// @from(Ln 3505, Col 4)
LS9 = "[object Object]"
// @from(Ln 3506, Col 2)
OS9
// @from(Ln 3506, Col 7)
MS9
// @from(Ln 3506, Col 12)
Ph0
// @from(Ln 3506, Col 17)
RS9
// @from(Ln 3506, Col 22)
_S9
// @from(Ln 3506, Col 27)
K7A
// @from(Ln 3507, Col 4)
adA = w(() => {
  fAA();
  fdA();
  Ny();
  OS9 = Function.prototype, MS9 = Object.prototype, Ph0 = OS9.toString, RS9 = MS9.hasOwnProperty, _S9 = Ph0.call(Object);
  K7A = jS9
})
// @from(Ln 3515, Col 0)
function TS9(A, Q) {
  if (Q === "constructor" && typeof A[Q] === "function") return;
  if (Q == "__proto__") return;
  return A[Q]
}
// @from(Ln 3520, Col 4)
dCA
// @from(Ln 3521, Col 4)
jq1 = w(() => {
  dCA = TS9
})
// @from(Ln 3525, Col 0)
function PS9(A) {
  return yM(A, xy(A))
}
// @from(Ln 3528, Col 4)
Sh0
// @from(Ln 3529, Col 4)
xh0 = w(() => {
  iAA();
  I7A();
  Sh0 = PS9
})
// @from(Ln 3535, Col 0)
function SS9(A, Q, B, G, Z, Y, J) {
  var X = dCA(A, B),
    I = dCA(Q, B),
    D = J.get(I);
  if (D) {
    mCA(A, B, D);
    return
  }
  var W = Y ? Y(X, I, B + "", A, Q, J) : void 0,
    K = W === void 0;
  if (K) {
    var V = wG(I),
      F = !V && wy(I),
      H = !V && !F && v5A(I);
    if (W = I, V || F || H)
      if (wG(X)) W = X;
      else if (jh0(X)) W = bdA(X);
    else if (F) K = !1, W = hCA(I, !0);
    else if (H) K = !1, W = mdA(I, !0);
    else W = [];
    else if (K7A(I) || Ag(I)) {
      if (W = X, Ag(X)) W = Sh0(X);
      else if (!lX(X) || w5A(X)) W = ddA(I)
    } else K = !1
  }
  if (K) J.set(I, W), Z(W, I, G, Y, J), J.delete(I);
  mCA(A, B, W)
}
// @from(Ln 3563, Col 4)
yh0
// @from(Ln 3564, Col 4)
vh0 = w(() => {
  Rq1();
  Hq1();
  Cq1();
  Eq1();
  Uq1();
  LCA();
  e$();
  Th0();
  OCA();
  xmA();
  _M();
  adA();
  emA();
  jq1();
  xh0();
  yh0 = SS9
})
// @from(Ln 3583, Col 0)
function kh0(A, Q, B, G, Z) {
  if (A === Q) return;
  ndA(Q, function (Y, J) {
    if (Z || (Z = new qy), lX(Y)) yh0(A, Q, J, B, kh0, G, Z);
    else {
      var X = G ? G(dCA(A, J), Y, J + "", A, Q, Z) : void 0;
      if (X === void 0) X = Y;
      mCA(A, J, X)
    }
  }, xy)
}
// @from(Ln 3594, Col 4)
bh0
// @from(Ln 3595, Col 4)
fh0 = w(() => {
  wCA();
  Rq1();
  _q1();
  vh0();
  _M();
  I7A();
  jq1();
  bh0 = kh0
})
// @from(Ln 3606, Col 0)
function xS9(A, Q, B) {
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
// @from(Ln 3619, Col 4)
hh0
// @from(Ln 3620, Col 4)
gh0 = w(() => {
  hh0 = xS9
})
// @from(Ln 3624, Col 0)
function yS9(A, Q, B) {
  return Q = uh0(Q === void 0 ? A.length - 1 : Q, 0),
    function () {
      var G = arguments,
        Z = -1,
        Y = uh0(G.length - Q, 0),
        J = Array(Y);
      while (++Z < Y) J[Z] = G[Q + Z];
      Z = -1;
      var X = Array(Q + 1);
      while (++Z < Q) X[Z] = G[Z];
      return X[Q] = B(J), hh0(A, this, X)
    }
}
// @from(Ln 3638, Col 4)
uh0
// @from(Ln 3638, Col 9)
odA
// @from(Ln 3639, Col 4)
Tq1 = w(() => {
  gh0();
  uh0 = Math.max;
  odA = yS9
})
// @from(Ln 3645, Col 0)
function vS9(A) {
  return function () {
    return A
  }
}
// @from(Ln 3650, Col 4)
mh0
// @from(Ln 3651, Col 4)
dh0 = w(() => {
  mh0 = vS9
})
// @from(Ln 3654, Col 4)
kS9
// @from(Ln 3654, Col 9)
ch0
// @from(Ln 3655, Col 4)
ph0 = w(() => {
  dh0();
  Fq1();
  EdA();
  kS9 = !X7A ? p5A : function (A, Q) {
    return X7A(A, "toString", {
      configurable: !0,
      enumerable: !1,
      value: mh0(Q),
      writable: !0
    })
  }, ch0 = kS9
})
// @from(Ln 3669, Col 0)
function gS9(A) {
  var Q = 0,
    B = 0;
  return function () {
    var G = hS9(),
      Z = fS9 - (G - B);
    if (B = G, Z > 0) {
      if (++Q >= bS9) return arguments[0]
    } else Q = 0;
    return A.apply(void 0, arguments)
  }
}
// @from(Ln 3681, Col 4)
bS9 = 800
// @from(Ln 3682, Col 2)
fS9 = 16
// @from(Ln 3683, Col 2)
hS9
// @from(Ln 3683, Col 7)
lh0
// @from(Ln 3684, Col 4)
ih0 = w(() => {
  hS9 = Date.now;
  lh0 = gS9
})
// @from(Ln 3688, Col 4)
uS9
// @from(Ln 3688, Col 9)
rdA
// @from(Ln 3689, Col 4)
Pq1 = w(() => {
  ph0();
  ih0();
  uS9 = lh0(ch0), rdA = uS9
})
// @from(Ln 3695, Col 0)
function mS9(A, Q) {
  return rdA(odA(A, Q, p5A), A + "")
}
// @from(Ln 3698, Col 4)
nh0
// @from(Ln 3699, Col 4)
ah0 = w(() => {
  EdA();
  Tq1();
  Pq1();
  nh0 = mS9
})
// @from(Ln 3706, Col 0)
function dS9(A, Q, B) {
  if (!lX(B)) return !1;
  var G = typeof Q;
  if (G == "number" ? Oy(B) && Pl(Q, B.length) : G == "string" && (Q in B)) return Uy(B[Q], A);
  return !1
}
// @from(Ln 3712, Col 4)
oh0
// @from(Ln 3713, Col 4)
rh0 = w(() => {
  O5A();
  b5A();
  MCA();
  _M();
  oh0 = dS9
})
// @from(Ln 3721, Col 0)
function cS9(A) {
  return nh0(function (Q, B) {
    var G = -1,
      Z = B.length,
      Y = Z > 1 ? B[Z - 1] : void 0,
      J = Z > 2 ? B[2] : void 0;
    if (Y = A.length > 3 && typeof Y == "function" ? (Z--, Y) : void 0, J && oh0(B[0], B[1], J)) Y = Z < 3 ? void 0 : Y, Z = 1;
    Q = Object(Q);
    while (++G < Z) {
      var X = B[G];
      if (X) A(Q, X, G, Y)
    }
    return Q
  })
}
// @from(Ln 3736, Col 4)
sh0
// @from(Ln 3737, Col 4)
th0 = w(() => {
  ah0();
  rh0();
  sh0 = cS9
})
// @from(Ln 3742, Col 4)
pS9
// @from(Ln 3742, Col 9)
sdA
// @from(Ln 3743, Col 4)
eh0 = w(() => {
  fh0();
  th0();
  pS9 = sh0(function (A, Q, B, G) {
    bh0(A, Q, B, G)
  }), sdA = pS9
})
// @from(Ln 3751, Col 0)
function V7A(A) {
  return A.sort((Q, B) => {
    let G = B.modified.getTime() - Q.modified.getTime();
    if (G !== 0) return G;
    let Z = B.created.getTime() - Q.created.getTime();
    if (Z !== 0) return Z;
    return Q.created.getTime() - B.created.getTime()
  })
}
// @from(Ln 3764, Col 0)
function yq1(A, {
  suffix: Q = "nodejs"
} = {}) {
  if (typeof A !== "string") throw TypeError(`Expected a string, got ${typeof A}`);
  if (Q) A += `-${Q}`;
  if (Sq1.platform === "darwin") return lS9(A);
  if (Sq1.platform === "win32") return iS9(A);
  return nS9(A)
}
// @from(Ln 3773, Col 4)
bl
// @from(Ln 3773, Col 8)
xq1
// @from(Ln 3773, Col 13)
F7A
// @from(Ln 3773, Col 18)
lS9 = (A) => {
    let Q = aX.join(bl, "Library");
    return {
      data: aX.join(Q, "Application Support", A),
      config: aX.join(Q, "Preferences", A),
      cache: aX.join(Q, "Caches", A),
      log: aX.join(Q, "Logs", A),
      temp: aX.join(xq1, A)
    }
  }
// @from(Ln 3783, Col 2)
iS9 = (A) => {
    let Q = F7A.APPDATA || aX.join(bl, "AppData", "Roaming"),
      B = F7A.LOCALAPPDATA || aX.join(bl, "AppData", "Local");
    return {
      data: aX.join(B, A, "Data"),
      config: aX.join(Q, A, "Config"),
      cache: aX.join(B, A, "Cache"),
      log: aX.join(B, A, "Log"),
      temp: aX.join(xq1, A)
    }
  }
// @from(Ln 3794, Col 2)
nS9 = (A) => {
    let Q = aX.basename(bl);
    return {
      data: aX.join(F7A.XDG_DATA_HOME || aX.join(bl, ".local", "share"), A),
      config: aX.join(F7A.XDG_CONFIG_HOME || aX.join(bl, ".config"), A),
      cache: aX.join(F7A.XDG_CACHE_HOME || aX.join(bl, ".cache"), A),
      log: aX.join(F7A.XDG_STATE_HOME || aX.join(bl, ".local", "state"), A),
      temp: aX.join(xq1, Q, A)
    }
  }
// @from(Ln 3804, Col 4)
Qg0 = w(() => {
  bl = Ag0.homedir(), xq1 = Ag0.tmpdir(), {
    env: F7A
  } = Sq1
})
// @from(Ln 3813, Col 0)
function Bg0(A) {
  return A.replace(/[^a-zA-Z0-9]/g, "-")
}
// @from(Ln 3817, Col 0)
function AcA(A) {
  return Bg0(A)
}
// @from(Ln 3820, Col 4)
edA
// @from(Ln 3820, Col 9)
fl
// @from(Ln 3821, Col 4)
cCA = w(() => {
  Qg0();
  DQ();
  edA = yq1("claude-cli");
  fl = {
    baseLogs: () => tdA(edA.cache, AcA(vA().cwd())),
    errors: () => tdA(edA.cache, AcA(vA().cwd()), "errors"),
    messages: () => tdA(edA.cache, AcA(vA().cwd()), "messages"),
    mcpLogs: (A) => tdA(edA.cache, AcA(vA().cwd()), `mcp-logs-${Bg0(A)}`)
  }
})
// @from(Ln 3833, Col 0)
function hl(A, Q) {
  return A.agentName || A.customTitle || A.summary || A.firstPrompt || Q || ""
}
// @from(Ln 3837, Col 0)
function Gg0(A) {
  return A.toISOString().replace(/[:.]/g, "-")
}
// @from(Ln 3841, Col 0)
function oS9(A) {
  if (QcA.length >= aS9) QcA.shift();
  QcA.push(A)
}
// @from(Ln 3846, Col 0)
function Zg0(A) {
  if (ET !== null) throw Error("Error log sink already attached - cannot attach more than once");
  if (ET = A, H7A.length > 0) {
    let Q = [...H7A];
    H7A.length = 0;
    for (let B of Q) switch (B.type) {
      case "error":
        ET.logError(B.error);
        break;
      case "mcpError":
        ET.logMCPError(B.serverName, B.error);
        break;
      case "mcpDebug":
        ET.logMCPDebug(B.serverName, B.message);
        break
    }
  }
}
// @from(Ln 3865, Col 0)
function e(A) {
  try {
    if (a1(process.env.CLAUDE_CODE_USE_BEDROCK) || a1(process.env.CLAUDE_CODE_USE_VERTEX) || a1(process.env.CLAUDE_CODE_USE_FOUNDRY) || process.env.DISABLE_ERROR_REPORTING || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
    let B = {
      error: A.stack || A.message,
      timestamp: new Date().toISOString()
    };
    if (oS9(B), ET === null) {
      H7A.push({
        type: "error",
        error: A
      });
      return
    }
    ET.logError(A)
  } catch {}
}
// @from(Ln 3883, Col 0)
function E7A() {
  return [...QcA]
}
// @from(Ln 3887, Col 0)
function NZ(A, Q) {
  try {
    if (ET === null) {
      H7A.push({
        type: "mcpError",
        serverName: A,
        error: Q
      });
      return
    }
    ET.logMCPError(A, Q)
  } catch {}
}
// @from(Ln 3901, Col 0)
function i0(A, Q) {
  try {
    if (ET === null) {
      H7A.push({
        type: "mcpDebug",
        serverName: A,
        message: Q
      });
      return
    }
    ET.logMCPDebug(A, Q)
  } catch {}
}
// @from(Ln 3915, Col 0)
function vq1(A, Q) {
  if (!Q || Q !== "repl_main_thread") return;
  let B = Ch0(A);
  ob0(B)
}
// @from(Ln 3920, Col 4)
aS9 = 100
// @from(Ln 3921, Col 2)
QcA
// @from(Ln 3921, Col 7)
H7A
// @from(Ln 3921, Col 12)
ET = null
// @from(Ln 3922, Col 4)
v1 = w(() => {
  C0();
  cCA();
  DQ();
  fQ();
  A0();
  QcA = [];
  H7A = []
})
// @from(Ln 3935, Col 0)
function c9(A = sS9) {
  let Q = new AbortController;
  return rS9(A, Q.signal), Q
}
// @from(Ln 3940, Col 0)
function BcA(A, Q) {
  let B = c9(Q),
    G = () => B.abort(A.signal.reason);
  return A.signal.addEventListener("abort", G, {
    once: !0
  }), B.signal.addEventListener("abort", () => A.signal.removeEventListener("abort", G), {
    once: !0
  }), B
}
// @from(Ln 3949, Col 4)
sS9 = 50
// @from(Ln 3950, Col 4)
iZ = () => {}
// @from(Ln 3951, Col 4)
nG = U((Yg0) => {
  Object.defineProperty(Yg0, "__esModule", {
    value: !0
  });
  Yg0.isFunction = void 0;

  function tS9(A) {
    return typeof A === "function"
  }
  Yg0.isFunction = tS9
})
// @from(Ln 3962, Col 4)
gl = U((Xg0) => {
  Object.defineProperty(Xg0, "__esModule", {
    value: !0
  });
  Xg0.createErrorClass = void 0;

  function eS9(A) {
    var Q = function (G) {
        Error.call(G), G.stack = Error().stack
      },
      B = A(Q);
    return B.prototype = Object.create(Error.prototype), B.prototype.constructor = B, B
  }
  Xg0.createErrorClass = eS9
})
// @from(Ln 3977, Col 4)
kq1 = U((Dg0) => {
  Object.defineProperty(Dg0, "__esModule", {
    value: !0
  });
  Dg0.UnsubscriptionError = void 0;
  var Ax9 = gl();
  Dg0.UnsubscriptionError = Ax9.createErrorClass(function (A) {
    return function (B) {
      A(this), this.message = B ? B.length + ` errors occurred during unsubscription:
` + B.map(function (G, Z) {
        return Z + 1 + ") " + G.toString()
      }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = B
    }
  })
})
// @from(Ln 3993, Col 4)
Gg = U((Kg0) => {
  Object.defineProperty(Kg0, "__esModule", {
    value: !0
  });
  Kg0.arrRemove = void 0;

  function Qx9(A, Q) {
    if (A) {
      var B = A.indexOf(Q);
      0 <= B && A.splice(B, 1)
    }
  }
  Kg0.arrRemove = Qx9
})