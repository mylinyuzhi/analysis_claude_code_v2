// === FILE HEADER ===
#!/usr/bin/env node

// Version: 2.1.38

// @from(Ln 11, Col 4)
ASq = Object.create
// @from(Ln 18, Col 4)
o = (A, q, K) => {
        K = A != null ? ASq(qSq(A)) : {};
        let Y = q || !A || !A.__esModule ? mV1(K, "default", {
            value: A,
            enumerable: !0
        }) : K;
        for (let z of nUA(A))
            if (!rUA.call(Y, z)) mV1(Y, z, {
                get: () => A[z],
                enumerable: !0
            });
        return Y
    }
// @from(Ln 31, Col 4)
iUA = new WeakMap
// @from(Ln 32, Col 4)
ay = (A) => {
        var q = iUA.get(A),
            K;
        if (q) return q;
        if (q = mV1({}, "__esModule", {
                value: !0
            }), A && typeof A === "object" || typeof A === "function") nUA(A).map((Y) => !rUA.call(q, Y) && mV1(q, Y, {
            get: () => A[Y],
            enumerable: !(K = KSq(A, Y)) || K.enumerable
        }));
        return iUA.set(A, q), q
    }
// @from(Ln 44, Col 4)
R = (A, q) => () => (q || A((q = {
        exports: {}
    }).exports, q), q.exports)
// @from(Ln 47, Col 4)
CA = (A, q) => {
    for (var K in q) mV1(A, K, {
        get: q[K],
        enumerable: !0,
        configurable: !0,
        set: (Y) => q[K] = () => Y
    })
}
// @from(Ln 55, Col 4)
v = (A, q) => () => (A && (q = A(A = 0)), q)
// @from(Ln 56, Col 4)
h1 = YSq(import.meta.url)
// @from(Ln 57, Col 4)
zSq = Symbol.dispose || Symbol.for("Symbol.dispose")
// @from(Ln 58, Col 4)
wSq = Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")
// @from(Ln 59, Col 4)
oUA = (A, q, K) => {
        if (q != null) {
            if (typeof q !== "object" && typeof q !== "function") throw TypeError('Object expected to be assigned to "using" declaration');
            var Y;
            if (K) Y = q[wSq];
            if (Y === void 0) Y = q[zSq];
            if (typeof Y !== "function") throw TypeError("Object not disposable");
            A.push([K, Y, q])
        } else if (K) A.push([K]);
        return q
    }
// @from(Ln 70, Col 4)
aUA = (A, q, K) => {
        var Y = typeof SuppressedError === "function" ? SuppressedError : function(H, $, O, _) {
                return _ = Error(O), _.name = "SuppressedError", _.error = H, _.suppressed = $, _
            },
            z = (H) => q = K ? new Y(H, q, "An error was suppressed during disposal") : (K = !0, H),
            w = (H) => {
                while (H = A.pop()) try {
                    var $ = H[1] && H[1].call(H[2]);
                    if (H[0]) return Promise.resolve($).then(w, (O) => (z(O), w()))
                } catch (O) {
                    z(O)
                }
                if (K) throw q
            };
        return w()
    }
// @from(Ln 86, Col 4)
HSq
// @from(Ln 86, Col 9)
fi1
// @from(Ln 87, Col 4)
Qk6 = v(() => {
    HSq = typeof global == "object" && global && global.Object === Object && global, fi1 = HSq
})
// @from(Ln 90, Col 4)
$Sq
// @from(Ln 90, Col 9)
OSq
// @from(Ln 90, Col 14)
sJ
// @from(Ln 91, Col 4)
sy = v(() => {
    Qk6();
    $Sq = typeof self == "object" && self && self.Object === Object && self, OSq = fi1 || $Sq || Function("return this")(), sJ = OSq
})
// @from(Ln 95, Col 4)
_Sq
// @from(Ln 95, Col 9)
P0
// @from(Ln 96, Col 4)
n11 = v(() => {
    sy();
    _Sq = sJ.Symbol, P0 = _Sq
})
// @from(Ln 101, Col 0)
function DSq(A) {
    var q = JSq.call(A, FV1),
        K = A[FV1];
    try {
        A[FV1] = void 0;
        var Y = !0
    } catch (w) {}
    var z = XSq.call(A);
    if (Y)
        if (q) A[FV1] = K;
        else delete A[FV1];
    return z
}
// @from(Ln 114, Col 4)
sUA
// @from(Ln 114, Col 9)
JSq
// @from(Ln 114, Col 14)
XSq
// @from(Ln 114, Col 19)
FV1
// @from(Ln 114, Col 24)
tUA
// @from(Ln 115, Col 4)
eUA = v(() => {
    n11();
    sUA = Object.prototype, JSq = sUA.hasOwnProperty, XSq = sUA.toString, FV1 = P0 ? P0.toStringTag : void 0;
    tUA = DSq
})
// @from(Ln 121, Col 0)
function PSq(A) {
    return MSq.call(A)
}
// @from(Ln 124, Col 4)
jSq
// @from(Ln 124, Col 9)
MSq
// @from(Ln 124, Col 14)
ApA
// @from(Ln 125, Col 4)
qpA = v(() => {
    jSq = Object.prototype, MSq = jSq.toString;
    ApA = PSq
})
// @from(Ln 130, Col 0)
function ZSq(A) {
    if (A == null) return A === void 0 ? GSq : WSq;
    return KpA && KpA in Object(A) ? tUA(A) : ApA(A)
}
// @from(Ln 134, Col 4)
WSq = "[object Null]"
// @from(Ln 135, Col 4)
GSq = "[object Undefined]"
// @from(Ln 136, Col 4)
KpA
// @from(Ln 136, Col 9)
zT
// @from(Ln 137, Col 4)
r11 = v(() => {
    n11();
    eUA();
    qpA();
    KpA = P0 ? P0.toStringTag : void 0;
    zT = ZSq
})
// @from(Ln 145, Col 0)
function fSq(A) {
    var q = typeof A;
    return A != null && (q == "object" || q == "function")
}
// @from(Ln 149, Col 4)
WO
// @from(Ln 150, Col 4)
tE = v(() => {
    WO = fSq
})
// @from(Ln 154, Col 0)
function ESq(A) {
    if (!WO(A)) return !1;
    var q = zT(A);
    return q == NSq || q == TSq || q == VSq || q == vSq
}
// @from(Ln 159, Col 4)
VSq = "[object AsyncFunction]"
// @from(Ln 160, Col 4)
NSq = "[object Function]"
// @from(Ln 161, Col 4)
TSq = "[object GeneratorFunction]"
// @from(Ln 162, Col 4)
vSq = "[object Proxy]"
// @from(Ln 163, Col 4)
Tz1
// @from(Ln 164, Col 4)
Vi1 = v(() => {
    r11();
    tE();
    Tz1 = ESq
})
// @from(Ln 169, Col 4)
kSq
// @from(Ln 169, Col 9)
Ni1
// @from(Ln 170, Col 4)
YpA = v(() => {
    sy();
    kSq = sJ["__core-js_shared__"], Ni1 = kSq
})
// @from(Ln 175, Col 0)
function LSq(A) {
    return !!zpA && zpA in A
}
// @from(Ln 178, Col 4)
zpA
// @from(Ln 178, Col 9)
wpA
// @from(Ln 179, Col 4)
HpA = v(() => {
    YpA();
    zpA = function() {
        var A = /[^.]+$/.exec(Ni1 && Ni1.keys && Ni1.keys.IE_PROTO || "");
        return A ? "Symbol(src)_1." + A : ""
    }();
    wpA = LSq
})
// @from(Ln 188, Col 0)
function CSq(A) {
    if (A != null) {
        try {
            return ySq.call(A)
        } catch (q) {}
        try {
            return A + ""
        } catch (q) {}
    }
    return ""
}
// @from(Ln 199, Col 4)
RSq
// @from(Ln 199, Col 9)
ySq
// @from(Ln 199, Col 14)
qQ
// @from(Ln 200, Col 4)
gk6 = v(() => {
    RSq = Function.prototype, ySq = RSq.toString;
    qQ = CSq
})
// @from(Ln 205, Col 0)
function mSq(A) {
    if (!WO(A) || wpA(A)) return !1;
    var q = Tz1(A) ? BSq : hSq;
    return q.test(qQ(A))
}
// @from(Ln 210, Col 4)
SSq
// @from(Ln 210, Col 9)
hSq
// @from(Ln 210, Col 14)
ISq
// @from(Ln 210, Col 19)
xSq
// @from(Ln 210, Col 24)
bSq
// @from(Ln 210, Col 29)
uSq
// @from(Ln 210, Col 34)
BSq
// @from(Ln 210, Col 39)
$pA
// @from(Ln 211, Col 4)
OpA = v(() => {
    Vi1();
    HpA();
    tE();
    gk6();
    SSq = /[\\^$.*+?()[\]{}|]/g, hSq = /^\[object .+?Constructor\]$/, ISq = Function.prototype, xSq = Object.prototype, bSq = ISq.toString, uSq = xSq.hasOwnProperty, BSq = RegExp("^" + bSq.call(uSq).replace(SSq, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    $pA = mSq
})
// @from(Ln 220, Col 0)
function FSq(A, q) {
    return A == null ? void 0 : A[q]
}
// @from(Ln 223, Col 4)
_pA
// @from(Ln 224, Col 4)
JpA = v(() => {
    _pA = FSq
})
// @from(Ln 228, Col 0)
function QSq(A, q) {
    var K = _pA(A, q);
    return $pA(K) ? K : void 0
}
// @from(Ln 232, Col 4)
Sf
// @from(Ln 233, Col 4)
vl = v(() => {
    OpA();
    JpA();
    Sf = QSq
})
// @from(Ln 238, Col 4)
gSq
// @from(Ln 238, Col 9)
KQ
// @from(Ln 239, Col 4)
QV1 = v(() => {
    vl();
    gSq = Sf(Object, "create"), KQ = gSq
})
// @from(Ln 244, Col 0)
function USq() {
    this.__data__ = KQ ? KQ(null) : {}, this.size = 0
}
// @from(Ln 247, Col 4)
XpA
// @from(Ln 248, Col 4)
DpA = v(() => {
    QV1();
    XpA = USq
})
// @from(Ln 253, Col 0)
function pSq(A) {
    var q = this.has(A) && delete this.__data__[A];
    return this.size -= q ? 1 : 0, q
}
// @from(Ln 257, Col 4)
jpA
// @from(Ln 258, Col 4)
MpA = v(() => {
    jpA = pSq
})
// @from(Ln 262, Col 0)
function iSq(A) {
    var q = this.__data__;
    if (KQ) {
        var K = q[A];
        return K === dSq ? void 0 : K
    }
    return lSq.call(q, A) ? q[A] : void 0
}
// @from(Ln 270, Col 4)
dSq = "__lodash_hash_undefined__"
// @from(Ln 271, Col 4)
cSq
// @from(Ln 271, Col 9)
lSq
// @from(Ln 271, Col 14)
PpA
// @from(Ln 272, Col 4)
WpA = v(() => {
    QV1();
    cSq = Object.prototype, lSq = cSq.hasOwnProperty;
    PpA = iSq
})
// @from(Ln 278, Col 0)
function oSq(A) {
    var q = this.__data__;
    return KQ ? q[A] !== void 0 : rSq.call(q, A)
}
// @from(Ln 282, Col 4)
nSq
// @from(Ln 282, Col 9)
rSq
// @from(Ln 282, Col 14)
GpA
// @from(Ln 283, Col 4)
ZpA = v(() => {
    QV1();
    nSq = Object.prototype, rSq = nSq.hasOwnProperty;
    GpA = oSq
})
// @from(Ln 289, Col 0)
function sSq(A, q) {
    var K = this.__data__;
    return this.size += this.has(A) ? 0 : 1, K[A] = KQ && q === void 0 ? aSq : q, this
}
// @from(Ln 293, Col 4)
aSq = "__lodash_hash_undefined__"
// @from(Ln 294, Col 4)
fpA
// @from(Ln 295, Col 4)
VpA = v(() => {
    QV1();
    fpA = sSq
})
// @from(Ln 300, Col 0)
function vz1(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 309, Col 4)
Uk6
// @from(Ln 310, Col 4)
NpA = v(() => {
    DpA();
    MpA();
    WpA();
    ZpA();
    VpA();
    vz1.prototype.clear = XpA;
    vz1.prototype.delete = jpA;
    vz1.prototype.get = PpA;
    vz1.prototype.has = GpA;
    vz1.prototype.set = fpA;
    Uk6 = vz1
})
// @from(Ln 324, Col 0)
function tSq() {
    this.__data__ = [], this.size = 0
}
// @from(Ln 327, Col 4)
TpA
// @from(Ln 328, Col 4)
vpA = v(() => {
    TpA = tSq
})
// @from(Ln 332, Col 0)
function eSq(A, q) {
    return A === q || A !== A && q !== q
}
// @from(Ln 335, Col 4)
Wx
// @from(Ln 336, Col 4)
Ez1 = v(() => {
    Wx = eSq
})
// @from(Ln 340, Col 0)
function Ahq(A, q) {
    var K = A.length;
    while (K--)
        if (Wx(A[K][0], q)) return K;
    return -1
}
// @from(Ln 346, Col 4)
El
// @from(Ln 347, Col 4)
gV1 = v(() => {
    Ez1();
    El = Ahq
})
// @from(Ln 352, Col 0)
function Yhq(A) {
    var q = this.__data__,
        K = El(q, A);
    if (K < 0) return !1;
    var Y = q.length - 1;
    if (K == Y) q.pop();
    else Khq.call(q, K, 1);
    return --this.size, !0
}
// @from(Ln 361, Col 4)
qhq
// @from(Ln 361, Col 9)
Khq
// @from(Ln 361, Col 14)
EpA
// @from(Ln 362, Col 4)
kpA = v(() => {
    gV1();
    qhq = Array.prototype, Khq = qhq.splice;
    EpA = Yhq
})
// @from(Ln 368, Col 0)
function zhq(A) {
    var q = this.__data__,
        K = El(q, A);
    return K < 0 ? void 0 : q[K][1]
}
// @from(Ln 373, Col 4)
LpA
// @from(Ln 374, Col 4)
RpA = v(() => {
    gV1();
    LpA = zhq
})
// @from(Ln 379, Col 0)
function whq(A) {
    return El(this.__data__, A) > -1
}
// @from(Ln 382, Col 4)
ypA
// @from(Ln 383, Col 4)
CpA = v(() => {
    gV1();
    ypA = whq
})
// @from(Ln 388, Col 0)
function Hhq(A, q) {
    var K = this.__data__,
        Y = El(K, A);
    if (Y < 0) ++this.size, K.push([A, q]);
    else K[Y][1] = q;
    return this
}
// @from(Ln 395, Col 4)
SpA
// @from(Ln 396, Col 4)
hpA = v(() => {
    gV1();
    SpA = Hhq
})
// @from(Ln 401, Col 0)
function kz1(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 410, Col 4)
kl
// @from(Ln 411, Col 4)
UV1 = v(() => {
    vpA();
    kpA();
    RpA();
    CpA();
    hpA();
    kz1.prototype.clear = TpA;
    kz1.prototype.delete = EpA;
    kz1.prototype.get = LpA;
    kz1.prototype.has = ypA;
    kz1.prototype.set = SpA;
    kl = kz1
})
// @from(Ln 424, Col 4)
$hq
// @from(Ln 424, Col 9)
Ll
// @from(Ln 425, Col 4)
Ti1 = v(() => {
    vl();
    sy();
    $hq = Sf(sJ, "Map"), Ll = $hq
})
// @from(Ln 431, Col 0)
function Ohq() {
    this.size = 0, this.__data__ = {
        hash: new Uk6,
        map: new(Ll || kl),
        string: new Uk6
    }
}
// @from(Ln 438, Col 4)
IpA
// @from(Ln 439, Col 4)
xpA = v(() => {
    NpA();
    UV1();
    Ti1();
    IpA = Ohq
})
// @from(Ln 446, Col 0)
function _hq(A) {
    var q = typeof A;
    return q == "string" || q == "number" || q == "symbol" || q == "boolean" ? A !== "__proto__" : A === null
}
// @from(Ln 450, Col 4)
bpA
// @from(Ln 451, Col 4)
upA = v(() => {
    bpA = _hq
})
// @from(Ln 455, Col 0)
function Jhq(A, q) {
    var K = A.__data__;
    return bpA(q) ? K[typeof q == "string" ? "string" : "hash"] : K.map
}
// @from(Ln 459, Col 4)
Rl
// @from(Ln 460, Col 4)
pV1 = v(() => {
    upA();
    Rl = Jhq
})
// @from(Ln 465, Col 0)
function Xhq(A) {
    var q = Rl(this, A).delete(A);
    return this.size -= q ? 1 : 0, q
}
// @from(Ln 469, Col 4)
BpA
// @from(Ln 470, Col 4)
mpA = v(() => {
    pV1();
    BpA = Xhq
})
// @from(Ln 475, Col 0)
function Dhq(A) {
    return Rl(this, A).get(A)
}
// @from(Ln 478, Col 4)
FpA
// @from(Ln 479, Col 4)
QpA = v(() => {
    pV1();
    FpA = Dhq
})
// @from(Ln 484, Col 0)
function jhq(A) {
    return Rl(this, A).has(A)
}
// @from(Ln 487, Col 4)
gpA
// @from(Ln 488, Col 4)
UpA = v(() => {
    pV1();
    gpA = jhq
})
// @from(Ln 493, Col 0)
function Mhq(A, q) {
    var K = Rl(this, A),
        Y = K.size;
    return K.set(A, q), this.size += K.size == Y ? 0 : 1, this
}
// @from(Ln 498, Col 4)
ppA
// @from(Ln 499, Col 4)
dpA = v(() => {
    pV1();
    ppA = Mhq
})
// @from(Ln 504, Col 0)
function Lz1(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 513, Col 4)
o11
// @from(Ln 514, Col 4)
vi1 = v(() => {
    xpA();
    mpA();
    QpA();
    UpA();
    dpA();
    Lz1.prototype.clear = IpA;
    Lz1.prototype.delete = BpA;
    Lz1.prototype.get = FpA;
    Lz1.prototype.has = gpA;
    Lz1.prototype.set = ppA;
    o11 = Lz1
})
// @from(Ln 528, Col 0)
function pk6(A, q) {
    if (typeof A != "function" || q != null && typeof q != "function") throw TypeError(Phq);
    var K = function() {
        var Y = arguments,
            z = q ? q.apply(this, Y) : Y[0],
            w = K.cache;
        if (w.has(z)) return w.get(z);
        var H = A.apply(this, Y);
        return K.cache = w.set(z, H) || w, H
    };
    return K.cache = new(pk6.Cache || o11), K
}
// @from(Ln 540, Col 4)
Phq = "Expected a function"
// @from(Ln 541, Col 4)
KA
// @from(Ln 542, Col 4)
zq = v(() => {
    vi1();
    pk6.Cache = o11;
    KA = pk6
})
// @from(Ln 548, Col 0)
function cpA(A) {
    return (q) => {
        if (q.code === "EPIPE") A.destroy()
    }
}
// @from(Ln 554, Col 0)
function lpA() {
    process.stdout.on("error", cpA(process.stdout)), process.stderr.on("error", cpA(process.stderr))
}
// @from(Ln 558, Col 0)
function ipA(A, q) {
    if (A.destroyed) return;
    A.write(q)
}
// @from(Ln 563, Col 0)
function Q4(A) {
    ipA(process.stdout, A)
}
// @from(Ln 567, Col 0)
function yl(A) {
    ipA(process.stderr, A)
}
// @from(Ln 571, Col 0)
function Whq(A) {
    let q = [],
        K = A.match(/^MCP server ["']([^"']+)["']/);
    if (K && K[1]) q.push("mcp"), q.push(K[1].toLowerCase());
    else {
        let w = A.match(/^([^:[]+):/);
        if (w && w[1]) q.push(w[1].trim().toLowerCase())
    }
    let Y = A.match(/^\[([^\]]+)]/);
    if (Y && Y[1]) q.push(Y[1].trim().toLowerCase());
    if (A.toLowerCase().includes("1p event:")) q.push("1p");
    let z = A.match(/:\s*([^:]+?)(?:\s+(?:type|mode|status|event))?:/);
    if (z && z[1]) {
        let w = z[1].trim().toLowerCase();
        if (w.length < 30 && !w.includes(" ")) q.push(w)
    }
    return Array.from(new Set(q))
}
// @from(Ln 590, Col 0)
function Ghq(A, q) {
    if (!q) return !0;
    if (A.length === 0) return !1;
    if (q.isExclusive) return !A.some((K) => q.exclude.includes(K));
    else return A.some((K) => q.include.includes(K))
}
// @from(Ln 597, Col 0)
function rpA(A, q) {
    if (!q) return !0;
    let K = Whq(A);
    return Ghq(K, q)
}
// @from(Ln 602, Col 4)
npA
// @from(Ln 603, Col 4)
opA = v(() => {
    zq();
    npA = KA((A) => {
        if (!A || A.trim() === "") return null;
        let q = A.split(",").map((w) => w.trim()).filter(Boolean);
        if (q.length === 0) return null;
        let K = q.some((w) => w.startsWith("!")),
            Y = q.some((w) => !w.startsWith("!"));
        if (K && Y) return null;
        let z = q.map((w) => w.replace(/^!/, "").toLowerCase());
        return {
            include: K ? [] : z,
            exclude: K ? z : [],
            isExclusive: K
        }
    })
})
// @from(Ln 621, Col 0)
function Zhq() {
    this.__data__ = new kl, this.size = 0
}
// @from(Ln 624, Col 4)
apA
// @from(Ln 625, Col 4)
spA = v(() => {
    UV1();
    apA = Zhq
})
// @from(Ln 630, Col 0)
function fhq(A) {
    var q = this.__data__,
        K = q.delete(A);
    return this.size = q.size, K
}
// @from(Ln 635, Col 4)
tpA
// @from(Ln 636, Col 4)
epA = v(() => {
    tpA = fhq
})
// @from(Ln 640, Col 0)
function Vhq(A) {
    return this.__data__.get(A)
}
// @from(Ln 643, Col 4)
AdA
// @from(Ln 644, Col 4)
qdA = v(() => {
    AdA = Vhq
})
// @from(Ln 648, Col 0)
function Nhq(A) {
    return this.__data__.has(A)
}
// @from(Ln 651, Col 4)
KdA
// @from(Ln 652, Col 4)
YdA = v(() => {
    KdA = Nhq
})
// @from(Ln 656, Col 0)
function vhq(A, q) {
    var K = this.__data__;
    if (K instanceof kl) {
        var Y = K.__data__;
        if (!Ll || Y.length < Thq - 1) return Y.push([A, q]), this.size = ++K.size, this;
        K = this.__data__ = new o11(Y)
    }
    return K.set(A, q), this.size = K.size, this
}
// @from(Ln 665, Col 4)
Thq = 200
// @from(Ln 666, Col 4)
zdA
// @from(Ln 667, Col 4)
wdA = v(() => {
    UV1();
    Ti1();
    vi1();
    zdA = vhq
})
// @from(Ln 674, Col 0)
function Rz1(A) {
    var q = this.__data__ = new kl(A);
    this.size = q.size
}
// @from(Ln 678, Col 4)
Gx
// @from(Ln 679, Col 4)
dV1 = v(() => {
    UV1();
    spA();
    epA();
    qdA();
    YdA();
    wdA();
    Rz1.prototype.clear = apA;
    Rz1.prototype.delete = tpA;
    Rz1.prototype.get = AdA;
    Rz1.prototype.has = KdA;
    Rz1.prototype.set = zdA;
    Gx = Rz1
})
// @from(Ln 694, Col 0)
function khq(A) {
    return this.__data__.set(A, Ehq), this
}
// @from(Ln 697, Col 4)
Ehq = "__lodash_hash_undefined__"
// @from(Ln 698, Col 4)
HdA
// @from(Ln 699, Col 4)
$dA = v(() => {
    HdA = khq
})
// @from(Ln 703, Col 0)
function Lhq(A) {
    return this.__data__.has(A)
}
// @from(Ln 706, Col 4)
OdA
// @from(Ln 707, Col 4)
_dA = v(() => {
    OdA = Lhq
})
// @from(Ln 711, Col 0)
function Ei1(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.__data__ = new o11;
    while (++q < K) this.add(A[q])
}
// @from(Ln 717, Col 4)
ki1
// @from(Ln 718, Col 4)
dk6 = v(() => {
    vi1();
    $dA();
    _dA();
    Ei1.prototype.add = Ei1.prototype.push = HdA;
    Ei1.prototype.has = OdA;
    ki1 = Ei1
})
// @from(Ln 727, Col 0)
function Rhq(A, q) {
    var K = -1,
        Y = A == null ? 0 : A.length;
    while (++K < Y)
        if (q(A[K], K, A)) return !0;
    return !1
}
// @from(Ln 734, Col 4)
JdA
// @from(Ln 735, Col 4)
XdA = v(() => {
    JdA = Rhq
})
// @from(Ln 739, Col 0)
function yhq(A, q) {
    return A.has(q)
}
// @from(Ln 742, Col 4)
Li1
// @from(Ln 743, Col 4)
ck6 = v(() => {
    Li1 = yhq
})
// @from(Ln 747, Col 0)
function hhq(A, q, K, Y, z, w) {
    var H = K & Chq,
        $ = A.length,
        O = q.length;
    if ($ != O && !(H && O > $)) return !1;
    var _ = w.get(A),
        J = w.get(q);
    if (_ && J) return _ == q && J == A;
    var X = -1,
        D = !0,
        j = K & Shq ? new ki1 : void 0;
    w.set(A, q), w.set(q, A);
    while (++X < $) {
        var M = A[X],
            P = q[X];
        if (Y) var W = H ? Y(P, M, X, q, A, w) : Y(M, P, X, A, q, w);
        if (W !== void 0) {
            if (W) continue;
            D = !1;
            break
        }
        if (j) {
            if (!JdA(q, function(G, f) {
                    if (!Li1(j, f) && (M === G || z(M, G, K, Y, w))) return j.push(f)
                })) {
                D = !1;
                break
            }
        } else if (!(M === P || z(M, P, K, Y, w))) {
            D = !1;
            break
        }
    }
    return w.delete(A), w.delete(q), D
}
// @from(Ln 782, Col 4)
Chq = 1
// @from(Ln 783, Col 4)
Shq = 2
// @from(Ln 784, Col 4)
Ri1
// @from(Ln 785, Col 4)
lk6 = v(() => {
    dk6();
    XdA();
    ck6();
    Ri1 = hhq
})
// @from(Ln 791, Col 4)
Ihq
// @from(Ln 791, Col 9)
yz1
// @from(Ln 792, Col 4)
ik6 = v(() => {
    sy();
    Ihq = sJ.Uint8Array, yz1 = Ihq
})
// @from(Ln 797, Col 0)
function xhq(A) {
    var q = -1,
        K = Array(A.size);
    return A.forEach(function(Y, z) {
        K[++q] = [z, Y]
    }), K
}
// @from(Ln 804, Col 4)
DdA
// @from(Ln 805, Col 4)
jdA = v(() => {
    DdA = xhq
})
// @from(Ln 809, Col 0)
function bhq(A) {
    var q = -1,
        K = Array(A.size);
    return A.forEach(function(Y) {
        K[++q] = Y
    }), K
}
// @from(Ln 816, Col 4)
Cz1
// @from(Ln 817, Col 4)
yi1 = v(() => {
    Cz1 = bhq
})
// @from(Ln 821, Col 0)
function rhq(A, q, K, Y, z, w, H) {
    switch (K) {
        case nhq:
            if (A.byteLength != q.byteLength || A.byteOffset != q.byteOffset) return !1;
            A = A.buffer, q = q.buffer;
        case ihq:
            if (A.byteLength != q.byteLength || !w(new yz1(A), new yz1(q))) return !1;
            return !0;
        case mhq:
        case Fhq:
        case Uhq:
            return Wx(+A, +q);
        case Qhq:
            return A.name == q.name && A.message == q.message;
        case phq:
        case chq:
            return A == q + "";
        case ghq:
            var $ = DdA;
        case dhq:
            var O = Y & uhq;
            if ($ || ($ = Cz1), A.size != q.size && !O) return !1;
            var _ = H.get(A);
            if (_) return _ == q;
            Y |= Bhq, H.set(A, q);
            var J = Ri1($(A), $(q), Y, z, w, H);
            return H.delete(A), J;
        case lhq:
            if (nk6) return nk6.call(A) == nk6.call(q)
    }
    return !1
}
// @from(Ln 853, Col 4)
uhq = 1
// @from(Ln 854, Col 4)
Bhq = 2
// @from(Ln 855, Col 4)
mhq = "[object Boolean]"
// @from(Ln 856, Col 4)
Fhq = "[object Date]"
// @from(Ln 857, Col 4)
Qhq = "[object Error]"
// @from(Ln 858, Col 4)
ghq = "[object Map]"
// @from(Ln 859, Col 4)
Uhq = "[object Number]"
// @from(Ln 860, Col 4)
phq = "[object RegExp]"
// @from(Ln 861, Col 4)
dhq = "[object Set]"
// @from(Ln 862, Col 4)
chq = "[object String]"
// @from(Ln 863, Col 4)
lhq = "[object Symbol]"
// @from(Ln 864, Col 4)
ihq = "[object ArrayBuffer]"
// @from(Ln 865, Col 4)
nhq = "[object DataView]"
// @from(Ln 866, Col 4)
MdA
// @from(Ln 866, Col 9)
nk6
// @from(Ln 866, Col 14)
PdA
// @from(Ln 867, Col 4)
WdA = v(() => {
    n11();
    ik6();
    Ez1();
    lk6();
    jdA();
    yi1();
    MdA = P0 ? P0.prototype : void 0, nk6 = MdA ? MdA.valueOf : void 0;
    PdA = rhq
})
// @from(Ln 878, Col 0)
function ohq(A, q) {
    var K = -1,
        Y = q.length,
        z = A.length;
    while (++K < Y) A[z + K] = q[K];
    return A
}
// @from(Ln 885, Col 4)
Sz1
// @from(Ln 886, Col 4)
Ci1 = v(() => {
    Sz1 = ohq
})
// @from(Ln 889, Col 4)
ahq
// @from(Ln 889, Col 9)
gz
// @from(Ln 890, Col 4)
RG = v(() => {
    ahq = Array.isArray, gz = ahq
})
// @from(Ln 894, Col 0)
function shq(A, q, K) {
    var Y = q(A);
    return gz(A) ? Y : Sz1(Y, K(A))
}
// @from(Ln 898, Col 4)
Si1
// @from(Ln 899, Col 4)
rk6 = v(() => {
    Ci1();
    RG();
    Si1 = shq
})
// @from(Ln 905, Col 0)
function thq(A, q) {
    var K = -1,
        Y = A == null ? 0 : A.length,
        z = 0,
        w = [];
    while (++K < Y) {
        var H = A[K];
        if (q(H, K, A)) w[z++] = H
    }
    return w
}
// @from(Ln 916, Col 4)
hi1
// @from(Ln 917, Col 4)
ok6 = v(() => {
    hi1 = thq
})
// @from(Ln 921, Col 0)
function ehq() {
    return []
}
// @from(Ln 924, Col 4)
Ii1
// @from(Ln 925, Col 4)
ak6 = v(() => {
    Ii1 = ehq
})
// @from(Ln 928, Col 4)
AIq
// @from(Ln 928, Col 9)
qIq
// @from(Ln 928, Col 14)
GdA
// @from(Ln 928, Col 19)
KIq
// @from(Ln 928, Col 24)
hz1
// @from(Ln 929, Col 4)
xi1 = v(() => {
    ok6();
    ak6();
    AIq = Object.prototype, qIq = AIq.propertyIsEnumerable, GdA = Object.getOwnPropertySymbols, KIq = !GdA ? Ii1 : function(A) {
        if (A == null) return [];
        return A = Object(A), hi1(GdA(A), function(q) {
            return qIq.call(A, q)
        })
    }, hz1 = KIq
})
// @from(Ln 940, Col 0)
function YIq(A, q) {
    var K = -1,
        Y = Array(A);
    while (++K < A) Y[K] = q(K);
    return Y
}
// @from(Ln 946, Col 4)
ZdA
// @from(Ln 947, Col 4)
fdA = v(() => {
    ZdA = YIq
})
// @from(Ln 951, Col 0)
function zIq(A) {
    return A != null && typeof A == "object"
}
// @from(Ln 954, Col 4)
fD
// @from(Ln 955, Col 4)
Zx = v(() => {
    fD = zIq
})
// @from(Ln 959, Col 0)
function HIq(A) {
    return fD(A) && zT(A) == wIq
}
// @from(Ln 962, Col 4)
wIq = "[object Arguments]"
// @from(Ln 963, Col 4)
sk6
// @from(Ln 964, Col 4)
VdA = v(() => {
    r11();
    Zx();
    sk6 = HIq
})
// @from(Ln 969, Col 4)
NdA
// @from(Ln 969, Col 9)
$Iq
// @from(Ln 969, Col 14)
OIq
// @from(Ln 969, Col 19)
_Iq
// @from(Ln 969, Col 24)
YQ
// @from(Ln 970, Col 4)
cV1 = v(() => {
    VdA();
    Zx();
    NdA = Object.prototype, $Iq = NdA.hasOwnProperty, OIq = NdA.propertyIsEnumerable, _Iq = sk6(function() {
        return arguments
    }()) ? sk6 : function(A) {
        return fD(A) && $Iq.call(A, "callee") && !OIq.call(A, "callee")
    }, YQ = _Iq
})
// @from(Ln 980, Col 0)
function JIq() {
    return !1
}
// @from(Ln 983, Col 4)
TdA
// @from(Ln 984, Col 4)
vdA = v(() => {
    TdA = JIq
})
// @from(Ln 987, Col 4)
ui1 = {}
// @from(Ln 991, Col 4)
LdA
// @from(Ln 991, Col 9)
EdA
// @from(Ln 991, Col 14)
XIq
// @from(Ln 991, Col 19)
kdA
// @from(Ln 991, Col 24)
DIq
// @from(Ln 991, Col 29)
jIq
// @from(Ln 991, Col 34)
fx
// @from(Ln 992, Col 4)
lV1 = v(() => {
    sy();
    vdA();
    LdA = typeof ui1 == "object" && ui1 && !ui1.nodeType && ui1, EdA = LdA && typeof bi1 == "object" && bi1 && !bi1.nodeType && bi1, XIq = EdA && EdA.exports === LdA, kdA = XIq ? sJ.Buffer : void 0, DIq = kdA ? kdA.isBuffer : void 0, jIq = DIq || TdA, fx = jIq
})
// @from(Ln 998, Col 0)
function WIq(A, q) {
    var K = typeof A;
    return q = q == null ? MIq : q, !!q && (K == "number" || K != "symbol" && PIq.test(A)) && (A > -1 && A % 1 == 0 && A < q)
}
// @from(Ln 1002, Col 4)
MIq = 9007199254740991
// @from(Ln 1003, Col 4)
PIq
// @from(Ln 1003, Col 9)
Cl
// @from(Ln 1004, Col 4)
iV1 = v(() => {
    PIq = /^(?:0|[1-9]\d*)$/;
    Cl = WIq
})
// @from(Ln 1009, Col 0)
function ZIq(A) {
    return typeof A == "number" && A > -1 && A % 1 == 0 && A <= GIq
}
// @from(Ln 1012, Col 4)
GIq = 9007199254740991
// @from(Ln 1013, Col 4)
Iz1
// @from(Ln 1014, Col 4)
Bi1 = v(() => {
    Iz1 = ZIq
})
// @from(Ln 1018, Col 0)
function dIq(A) {
    return fD(A) && Iz1(A.length) && !!FH[zT(A)]
}
// @from(Ln 1021, Col 4)
fIq = "[object Arguments]"
// @from(Ln 1022, Col 4)
VIq = "[object Array]"
// @from(Ln 1023, Col 4)
NIq = "[object Boolean]"
// @from(Ln 1024, Col 4)
TIq = "[object Date]"
// @from(Ln 1025, Col 4)
vIq = "[object Error]"
// @from(Ln 1026, Col 4)
EIq = "[object Function]"
// @from(Ln 1027, Col 4)
kIq = "[object Map]"
// @from(Ln 1028, Col 4)
LIq = "[object Number]"
// @from(Ln 1029, Col 4)
RIq = "[object Object]"
// @from(Ln 1030, Col 4)
yIq = "[object RegExp]"
// @from(Ln 1031, Col 4)
CIq = "[object Set]"
// @from(Ln 1032, Col 4)
SIq = "[object String]"
// @from(Ln 1033, Col 4)
hIq = "[object WeakMap]"
// @from(Ln 1034, Col 4)
IIq = "[object ArrayBuffer]"
// @from(Ln 1035, Col 4)
xIq = "[object DataView]"
// @from(Ln 1036, Col 4)
bIq = "[object Float32Array]"
// @from(Ln 1037, Col 4)
uIq = "[object Float64Array]"
// @from(Ln 1038, Col 4)
BIq = "[object Int8Array]"
// @from(Ln 1039, Col 4)
mIq = "[object Int16Array]"
// @from(Ln 1040, Col 4)
FIq = "[object Int32Array]"
// @from(Ln 1041, Col 4)
QIq = "[object Uint8Array]"
// @from(Ln 1042, Col 4)
gIq = "[object Uint8ClampedArray]"
// @from(Ln 1043, Col 4)
UIq = "[object Uint16Array]"
// @from(Ln 1044, Col 4)
pIq = "[object Uint32Array]"
// @from(Ln 1045, Col 4)
FH
// @from(Ln 1045, Col 8)
RdA
// @from(Ln 1046, Col 4)
ydA = v(() => {
    r11();
    Bi1();
    Zx();
    FH = {};
    FH[bIq] = FH[uIq] = FH[BIq] = FH[mIq] = FH[FIq] = FH[QIq] = FH[gIq] = FH[UIq] = FH[pIq] = !0;
    FH[fIq] = FH[VIq] = FH[IIq] = FH[NIq] = FH[xIq] = FH[TIq] = FH[vIq] = FH[EIq] = FH[kIq] = FH[LIq] = FH[RIq] = FH[yIq] = FH[CIq] = FH[SIq] = FH[hIq] = !1;
    RdA = dIq
})
// @from(Ln 1056, Col 0)
function cIq(A) {
    return function(q) {
        return A(q)
    }
}
// @from(Ln 1061, Col 4)
xz1
// @from(Ln 1062, Col 4)
mi1 = v(() => {
    xz1 = cIq
})
// @from(Ln 1065, Col 4)
Qi1 = {}
// @from(Ln 1069, Col 4)
CdA
// @from(Ln 1069, Col 9)
nV1
// @from(Ln 1069, Col 14)
lIq
// @from(Ln 1069, Col 19)
tk6
// @from(Ln 1069, Col 24)
iIq
// @from(Ln 1069, Col 29)
Vx
// @from(Ln 1070, Col 4)
gi1 = v(() => {
    Qk6();
    CdA = typeof Qi1 == "object" && Qi1 && !Qi1.nodeType && Qi1, nV1 = CdA && typeof Fi1 == "object" && Fi1 && !Fi1.nodeType && Fi1, lIq = nV1 && nV1.exports === CdA, tk6 = lIq && fi1.process, iIq = function() {
        try {
            var A = nV1 && nV1.require && nV1.require("util").types;
            if (A) return A;
            return tk6 && tk6.binding && tk6.binding("util")
        } catch (q) {}
    }(), Vx = iIq
})
// @from(Ln 1080, Col 4)
SdA
// @from(Ln 1080, Col 9)
nIq
// @from(Ln 1080, Col 14)
bz1
// @from(Ln 1081, Col 4)
Ui1 = v(() => {
    ydA();
    mi1();
    gi1();
    SdA = Vx && Vx.isTypedArray, nIq = SdA ? xz1(SdA) : RdA, bz1 = nIq
})
// @from(Ln 1088, Col 0)
function aIq(A, q) {
    var K = gz(A),
        Y = !K && YQ(A),
        z = !K && !Y && fx(A),
        w = !K && !Y && !z && bz1(A),
        H = K || Y || z || w,
        $ = H ? ZdA(A.length, String) : [],
        O = $.length;
    for (var _ in A)
        if ((q || oIq.call(A, _)) && !(H && (_ == "length" || z && (_ == "offset" || _ == "parent") || w && (_ == "buffer" || _ == "byteLength" || _ == "byteOffset") || Cl(_, O)))) $.push(_);
    return $
}
// @from(Ln 1100, Col 4)
rIq
// @from(Ln 1100, Col 9)
oIq
// @from(Ln 1100, Col 14)
pi1
// @from(Ln 1101, Col 4)
ek6 = v(() => {
    fdA();
    cV1();
    RG();
    lV1();
    iV1();
    Ui1();
    rIq = Object.prototype, oIq = rIq.hasOwnProperty;
    pi1 = aIq
})
// @from(Ln 1112, Col 0)
function tIq(A) {
    var q = A && A.constructor,
        K = typeof q == "function" && q.prototype || sIq;
    return A === K
}
// @from(Ln 1117, Col 4)
sIq
// @from(Ln 1117, Col 9)
uz1
// @from(Ln 1118, Col 4)
di1 = v(() => {
    sIq = Object.prototype;
    uz1 = tIq
})
// @from(Ln 1123, Col 0)
function eIq(A, q) {
    return function(K) {
        return A(q(K))
    }
}
// @from(Ln 1128, Col 4)
ci1
// @from(Ln 1129, Col 4)
AL6 = v(() => {
    ci1 = eIq
})
// @from(Ln 1132, Col 4)
Axq
// @from(Ln 1132, Col 9)
hdA
// @from(Ln 1133, Col 4)
IdA = v(() => {
    AL6();
    Axq = ci1(Object.keys, Object), hdA = Axq
})
// @from(Ln 1138, Col 0)
function Yxq(A) {
    if (!uz1(A)) return hdA(A);
    var q = [];
    for (var K in Object(A))
        if (Kxq.call(A, K) && K != "constructor") q.push(K);
    return q
}
// @from(Ln 1145, Col 4)
qxq
// @from(Ln 1145, Col 9)
Kxq
// @from(Ln 1145, Col 14)
xdA
// @from(Ln 1146, Col 4)
bdA = v(() => {
    di1();
    IdA();
    qxq = Object.prototype, Kxq = qxq.hasOwnProperty;
    xdA = Yxq
})
// @from(Ln 1153, Col 0)
function zxq(A) {
    return A != null && Iz1(A.length) && !Tz1(A)
}
// @from(Ln 1156, Col 4)
Nx
// @from(Ln 1157, Col 4)
Bz1 = v(() => {
    Vi1();
    Bi1();
    Nx = zxq
})
// @from(Ln 1163, Col 0)
function wxq(A) {
    return Nx(A) ? pi1(A) : xdA(A)
}
// @from(Ln 1166, Col 4)
eE
// @from(Ln 1167, Col 4)
a11 = v(() => {
    ek6();
    bdA();
    Bz1();
    eE = wxq
})
// @from(Ln 1174, Col 0)
function Hxq(A) {
    return Si1(A, eE, hz1)
}
// @from(Ln 1177, Col 4)
rV1
// @from(Ln 1178, Col 4)
qL6 = v(() => {
    rk6();
    xi1();
    a11();
    rV1 = Hxq
})
// @from(Ln 1185, Col 0)
function Jxq(A, q, K, Y, z, w) {
    var H = K & $xq,
        $ = rV1(A),
        O = $.length,
        _ = rV1(q),
        J = _.length;
    if (O != J && !H) return !1;
    var X = O;
    while (X--) {
        var D = $[X];
        if (!(H ? D in q : _xq.call(q, D))) return !1
    }
    var j = w.get(A),
        M = w.get(q);
    if (j && M) return j == q && M == A;
    var P = !0;
    w.set(A, q), w.set(q, A);
    var W = H;
    while (++X < O) {
        D = $[X];
        var G = A[D],
            f = q[D];
        if (Y) var Z = H ? Y(f, G, D, q, A, w) : Y(G, f, D, A, q, w);
        if (!(Z === void 0 ? G === f || z(G, f, K, Y, w) : Z)) {
            P = !1;
            break
        }
        W || (W = D == "constructor")
    }
    if (P && !W) {
        var N = A.constructor,
            T = q.constructor;
        if (N != T && (("constructor" in A) && ("constructor" in q)) && !(typeof N == "function" && N instanceof N && typeof T == "function" && T instanceof T)) P = !1
    }
    return w.delete(A), w.delete(q), P
}
// @from(Ln 1221, Col 4)
$xq = 1
// @from(Ln 1222, Col 4)
Oxq
// @from(Ln 1222, Col 9)
_xq
// @from(Ln 1222, Col 14)
udA
// @from(Ln 1223, Col 4)
BdA = v(() => {
    qL6();
    Oxq = Object.prototype, _xq = Oxq.hasOwnProperty;
    udA = Jxq
})
// @from(Ln 1228, Col 4)
Xxq
// @from(Ln 1228, Col 9)
li1
// @from(Ln 1229, Col 4)
mdA = v(() => {
    vl();
    sy();
    Xxq = Sf(sJ, "DataView"), li1 = Xxq
})
// @from(Ln 1234, Col 4)
Dxq
// @from(Ln 1234, Col 9)
ii1
// @from(Ln 1235, Col 4)
FdA = v(() => {
    vl();
    sy();
    Dxq = Sf(sJ, "Promise"), ii1 = Dxq
})
// @from(Ln 1240, Col 4)
jxq
// @from(Ln 1240, Col 9)
Sl
// @from(Ln 1241, Col 4)
KL6 = v(() => {
    vl();
    sy();
    jxq = Sf(sJ, "Set"), Sl = jxq
})
// @from(Ln 1246, Col 4)
Mxq
// @from(Ln 1246, Col 9)
ni1
// @from(Ln 1247, Col 4)
QdA = v(() => {
    vl();
    sy();
    Mxq = Sf(sJ, "WeakMap"), ni1 = Mxq
})
// @from(Ln 1252, Col 4)
gdA = "[object Map]"
// @from(Ln 1253, Col 4)
Pxq = "[object Object]"
// @from(Ln 1254, Col 4)
UdA = "[object Promise]"
// @from(Ln 1255, Col 4)
pdA = "[object Set]"
// @from(Ln 1256, Col 4)
ddA = "[object WeakMap]"
// @from(Ln 1257, Col 4)
cdA = "[object DataView]"
// @from(Ln 1258, Col 4)
Wxq
// @from(Ln 1258, Col 9)
Gxq
// @from(Ln 1258, Col 14)
Zxq
// @from(Ln 1258, Col 19)
fxq
// @from(Ln 1258, Col 24)
Vxq
// @from(Ln 1258, Col 29)
s11
// @from(Ln 1258, Col 34)
zQ
// @from(Ln 1259, Col 4)
oV1 = v(() => {
    mdA();
    Ti1();
    FdA();
    KL6();
    QdA();
    r11();
    gk6();
    Wxq = qQ(li1), Gxq = qQ(Ll), Zxq = qQ(ii1), fxq = qQ(Sl), Vxq = qQ(ni1), s11 = zT;
    if (li1 && s11(new li1(new ArrayBuffer(1))) != cdA || Ll && s11(new Ll) != gdA || ii1 && s11(ii1.resolve()) != UdA || Sl && s11(new Sl) != pdA || ni1 && s11(new ni1) != ddA) s11 = function(A) {
        var q = zT(A),
            K = q == Pxq ? A.constructor : void 0,
            Y = K ? qQ(K) : "";
        if (Y) switch (Y) {
            case Wxq:
                return cdA;
            case Gxq:
                return gdA;
            case Zxq:
                return UdA;
            case fxq:
                return pdA;
            case Vxq:
                return ddA
        }
        return q
    };
    zQ = s11
})
// @from(Ln 1289, Col 0)
function vxq(A, q, K, Y, z, w) {
    var H = gz(A),
        $ = gz(q),
        O = H ? idA : zQ(A),
        _ = $ ? idA : zQ(q);
    O = O == ldA ? ri1 : O, _ = _ == ldA ? ri1 : _;
    var J = O == ri1,
        X = _ == ri1,
        D = O == _;
    if (D && fx(A)) {
        if (!fx(q)) return !1;
        H = !0, J = !1
    }
    if (D && !J) return w || (w = new Gx), H || bz1(A) ? Ri1(A, q, K, Y, z, w) : PdA(A, q, O, K, Y, z, w);
    if (!(K & Nxq)) {
        var j = J && ndA.call(A, "__wrapped__"),
            M = X && ndA.call(q, "__wrapped__");
        if (j || M) {
            var P = j ? A.value() : A,
                W = M ? q.value() : q;
            return w || (w = new Gx), z(P, W, K, Y, w)
        }
    }
    if (!D) return !1;
    return w || (w = new Gx), udA(A, q, K, Y, z, w)
}
// @from(Ln 1315, Col 4)
Nxq = 1
// @from(Ln 1316, Col 4)
ldA = "[object Arguments]"
// @from(Ln 1317, Col 4)
idA = "[object Array]"
// @from(Ln 1318, Col 4)
ri1 = "[object Object]"
// @from(Ln 1319, Col 4)
Txq
// @from(Ln 1319, Col 9)
ndA
// @from(Ln 1319, Col 14)
rdA
// @from(Ln 1320, Col 4)
odA = v(() => {
    dV1();
    lk6();
    WdA();
    BdA();
    oV1();
    RG();
    lV1();
    Ui1();
    Txq = Object.prototype, ndA = Txq.hasOwnProperty;
    rdA = vxq
})
// @from(Ln 1333, Col 0)
function adA(A, q, K, Y, z) {
    if (A === q) return !0;
    if (A == null || q == null || !fD(A) && !fD(q)) return A !== A && q !== q;
    return rdA(A, q, K, Y, adA, z)
}
// @from(Ln 1338, Col 4)
mz1
// @from(Ln 1339, Col 4)
oi1 = v(() => {
    odA();
    Zx();
    mz1 = adA
})
// @from(Ln 1345, Col 0)
function Lxq(A, q, K, Y) {
    var z = K.length,
        w = z,
        H = !Y;
    if (A == null) return !w;
    A = Object(A);
    while (z--) {
        var $ = K[z];
        if (H && $[2] ? $[1] !== A[$[0]] : !($[0] in A)) return !1
    }
    while (++z < w) {
        $ = K[z];
        var O = $[0],
            _ = A[O],
            J = $[1];
        if (H && $[2]) {
            if (_ === void 0 && !(O in A)) return !1
        } else {
            var X = new Gx;
            if (Y) var D = Y(_, J, O, A, q, X);
            if (!(D === void 0 ? mz1(J, _, Exq | kxq, Y, X) : D)) return !1
        }
    }
    return !0
}
// @from(Ln 1370, Col 4)
Exq = 1
// @from(Ln 1371, Col 4)
kxq = 2
// @from(Ln 1372, Col 4)
sdA
// @from(Ln 1373, Col 4)
tdA = v(() => {
    dV1();
    oi1();
    sdA = Lxq
})
// @from(Ln 1379, Col 0)
function Rxq(A) {
    return A === A && !WO(A)
}
// @from(Ln 1382, Col 4)
ai1
// @from(Ln 1383, Col 4)
YL6 = v(() => {
    tE();
    ai1 = Rxq
})
// @from(Ln 1388, Col 0)
function yxq(A) {
    var q = eE(A),
        K = q.length;
    while (K--) {
        var Y = q[K],
            z = A[Y];
        q[K] = [Y, z, ai1(z)]
    }
    return q
}
// @from(Ln 1398, Col 4)
edA
// @from(Ln 1399, Col 4)
AcA = v(() => {
    YL6();
    a11();
    edA = yxq
})
// @from(Ln 1405, Col 0)
function Cxq(A, q) {
    return function(K) {
        if (K == null) return !1;
        return K[A] === q && (q !== void 0 || (A in Object(K)))
    }
}
// @from(Ln 1411, Col 4)
si1
// @from(Ln 1412, Col 4)
zL6 = v(() => {
    si1 = Cxq
})
// @from(Ln 1416, Col 0)
function Sxq(A) {
    var q = edA(A);
    if (q.length == 1 && q[0][2]) return si1(q[0][0], q[0][1]);
    return function(K) {
        return K === A || sdA(K, A, q)
    }
}
// @from(Ln 1423, Col 4)
qcA
// @from(Ln 1424, Col 4)
KcA = v(() => {
    tdA();
    AcA();
    zL6();
    qcA = Sxq
})
// @from(Ln 1431, Col 0)
function Ixq(A) {
    return typeof A == "symbol" || fD(A) && zT(A) == hxq
}
// @from(Ln 1434, Col 4)
hxq = "[object Symbol]"
// @from(Ln 1435, Col 4)
Fz1
// @from(Ln 1436, Col 4)
ti1 = v(() => {
    r11();
    Zx();
    Fz1 = Ixq
})
// @from(Ln 1442, Col 0)
function uxq(A, q) {
    if (gz(A)) return !1;
    var K = typeof A;
    if (K == "number" || K == "symbol" || K == "boolean" || A == null || Fz1(A)) return !0;
    return bxq.test(A) || !xxq.test(A) || q != null && A in Object(q)
}
// @from(Ln 1448, Col 4)
xxq
// @from(Ln 1448, Col 9)
bxq
// @from(Ln 1448, Col 14)
Qz1
// @from(Ln 1449, Col 4)
ei1 = v(() => {
    RG();
    ti1();
    xxq = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, bxq = /^\w*$/;
    Qz1 = uxq
})
// @from(Ln 1456, Col 0)
function mxq(A) {
    var q = KA(A, function(Y) {
            if (K.size === Bxq) K.clear();
            return Y
        }),
        K = q.cache;
    return q
}
// @from(Ln 1464, Col 4)
Bxq = 500
// @from(Ln 1465, Col 4)
YcA
// @from(Ln 1466, Col 4)
zcA = v(() => {
    zq();
    YcA = mxq
})
// @from(Ln 1470, Col 4)
Fxq
// @from(Ln 1470, Col 9)
Qxq
// @from(Ln 1470, Col 14)
gxq
// @from(Ln 1470, Col 19)
wcA
// @from(Ln 1471, Col 4)
HcA = v(() => {
    zcA();
    Fxq = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Qxq = /\\(\\)?/g, gxq = YcA(function(A) {
        var q = [];
        if (A.charCodeAt(0) === 46) q.push("");
        return A.replace(Fxq, function(K, Y, z, w) {
            q.push(z ? w.replace(Qxq, "$1") : Y || K)
        }), q
    }), wcA = gxq
})
// @from(Ln 1482, Col 0)
function Uxq(A, q) {
    var K = -1,
        Y = A == null ? 0 : A.length,
        z = Array(Y);
    while (++K < Y) z[K] = q(A[K], K, A);
    return z
}
// @from(Ln 1489, Col 4)
gz1
// @from(Ln 1490, Col 4)
An1 = v(() => {
    gz1 = Uxq
})
// @from(Ln 1494, Col 0)
function _cA(A) {
    if (typeof A == "string") return A;
    if (gz(A)) return gz1(A, _cA) + "";
    if (Fz1(A)) return OcA ? OcA.call(A) : "";
    var q = A + "";
    return q == "0" && 1 / A == -pxq ? "-0" : q
}
// @from(Ln 1501, Col 4)
pxq = 1 / 0
// @from(Ln 1502, Col 4)
$cA
// @from(Ln 1502, Col 9)
OcA
// @from(Ln 1502, Col 14)
JcA
// @from(Ln 1503, Col 4)
XcA = v(() => {
    n11();
    An1();
    RG();
    ti1();
    $cA = P0 ? P0.prototype : void 0, OcA = $cA ? $cA.toString : void 0;
    JcA = _cA
})
// @from(Ln 1512, Col 0)
function dxq(A) {
    return A == null ? "" : JcA(A)
}
// @from(Ln 1515, Col 4)
Uz1
// @from(Ln 1516, Col 4)
qn1 = v(() => {
    XcA();
    Uz1 = dxq
})
// @from(Ln 1521, Col 0)
function cxq(A, q) {
    if (gz(A)) return A;
    return Qz1(A, q) ? [A] : wcA(Uz1(A))
}
// @from(Ln 1525, Col 4)
Tx
// @from(Ln 1526, Col 4)
pz1 = v(() => {
    RG();
    ei1();
    HcA();
    qn1();
    Tx = cxq
})
// @from(Ln 1534, Col 0)
function ixq(A) {
    if (typeof A == "string" || Fz1(A)) return A;
    var q = A + "";
    return q == "0" && 1 / A == -lxq ? "-0" : q
}
// @from(Ln 1539, Col 4)
lxq = 1 / 0
// @from(Ln 1540, Col 4)
Ak
// @from(Ln 1541, Col 4)
t11 = v(() => {
    ti1();
    Ak = ixq
})
// @from(Ln 1546, Col 0)
function nxq(A, q) {
    q = Tx(q, A);
    var K = 0,
        Y = q.length;
    while (A != null && K < Y) A = A[Ak(q[K++])];
    return K && K == Y ? A : void 0
}
// @from(Ln 1553, Col 4)
dz1
// @from(Ln 1554, Col 4)
Kn1 = v(() => {
    pz1();
    t11();
    dz1 = nxq
})
// @from(Ln 1560, Col 0)
function rxq(A, q, K) {
    var Y = A == null ? void 0 : dz1(A, q);
    return Y === void 0 ? K : Y
}
// @from(Ln 1564, Col 4)
DcA
// @from(Ln 1565, Col 4)
jcA = v(() => {
    Kn1();
    DcA = rxq
})
// @from(Ln 1570, Col 0)
function oxq(A, q) {
    return A != null && q in Object(A)
}
// @from(Ln 1573, Col 4)
McA
// @from(Ln 1574, Col 4)
PcA = v(() => {
    McA = oxq
})
// @from(Ln 1578, Col 0)
function axq(A, q, K) {
    q = Tx(q, A);
    var Y = -1,
        z = q.length,
        w = !1;
    while (++Y < z) {
        var H = Ak(q[Y]);
        if (!(w = A != null && K(A, H))) break;
        A = A[H]
    }
    if (w || ++Y != z) return w;
    return z = A == null ? 0 : A.length, !!z && Iz1(z) && Cl(H, z) && (gz(A) || YQ(A))
}
// @from(Ln 1591, Col 4)
WcA
// @from(Ln 1592, Col 4)
GcA = v(() => {
    pz1();
    cV1();
    RG();
    iV1();
    Bi1();
    t11();
    WcA = axq
})
// @from(Ln 1602, Col 0)
function sxq(A, q) {
    return A != null && WcA(A, q, McA)
}
// @from(Ln 1605, Col 4)
ZcA
// @from(Ln 1606, Col 4)
fcA = v(() => {
    PcA();
    GcA();
    ZcA = sxq
})
// @from(Ln 1612, Col 0)
function Abq(A, q) {
    if (Qz1(A) && ai1(q)) return si1(Ak(A), q);
    return function(K) {
        var Y = DcA(K, A);
        return Y === void 0 && Y === q ? ZcA(K, A) : mz1(q, Y, txq | exq)
    }
}
// @from(Ln 1619, Col 4)
txq = 1
// @from(Ln 1620, Col 4)
exq = 2
// @from(Ln 1621, Col 4)
VcA
// @from(Ln 1622, Col 4)
NcA = v(() => {
    oi1();
    jcA();
    fcA();
    ei1();
    YL6();
    zL6();
    t11();
    VcA = Abq
})
// @from(Ln 1633, Col 0)
function qbq(A) {
    return A
}
// @from(Ln 1636, Col 4)
cz1
// @from(Ln 1637, Col 4)
Yn1 = v(() => {
    cz1 = qbq
})
// @from(Ln 1641, Col 0)
function Kbq(A) {
    return function(q) {
        return q == null ? void 0 : q[A]
    }
}
// @from(Ln 1646, Col 4)
TcA
// @from(Ln 1647, Col 4)
vcA = v(() => {
    TcA = Kbq
})
// @from(Ln 1651, Col 0)
function Ybq(A) {
    return function(q) {
        return dz1(q, A)
    }
}
// @from(Ln 1656, Col 4)
EcA
// @from(Ln 1657, Col 4)
kcA = v(() => {
    Kn1();
    EcA = Ybq
})
// @from(Ln 1662, Col 0)
function zbq(A) {
    return Qz1(A) ? TcA(Ak(A)) : EcA(A)
}
// @from(Ln 1665, Col 4)
LcA
// @from(Ln 1666, Col 4)
RcA = v(() => {
    vcA();
    kcA();
    ei1();
    t11();
    LcA = zbq
})
// @from(Ln 1674, Col 0)
function wbq(A) {
    if (typeof A == "function") return A;
    if (A == null) return cz1;
    if (typeof A == "object") return gz(A) ? VcA(A[0], A[1]) : qcA(A);
    return LcA(A)
}
// @from(Ln 1680, Col 4)
vx
// @from(Ln 1681, Col 4)
lz1 = v(() => {
    KcA();
    NcA();
    Yn1();
    RG();
    RcA();
    vx = wbq
})
// @from(Ln 1690, Col 0)
function Hbq(A, q) {
    var K, Y = -1,
        z = A.length;
    while (++Y < z) {
        var w = q(A[Y]);
        if (w !== void 0) K = K === void 0 ? w : K + w
    }
    return K
}
// @from(Ln 1699, Col 4)
ycA
// @from(Ln 1700, Col 4)
CcA = v(() => {
    ycA = Hbq
})
// @from(Ln 1704, Col 0)
function $bq(A, q) {
    return A && A.length ? ycA(A, vx(q, 2)) : 0
}
// @from(Ln 1707, Col 4)
iz1
// @from(Ln 1708, Col 4)
ScA = v(() => {
    lz1();
    CcA();
    iz1 = $bq
})
// @from(Ln 1714, Col 0)
function hcA(A) {
    return {
        name: A,
        default: 30000,
        validate: (q) => {
            if (!q) return {
                effective: 30000,
                status: "valid"
            };
            let K = parseInt(q, 10);
            if (isNaN(K) || K <= 0) return {
                effective: 30000,
                status: "invalid",
                message: `Invalid value "${q}" (using default: 30000)`
            };
            if (K > 150000) return {
                effective: 150000,
                status: "capped",
                message: `Capped from ${K} to 150000`
            };
            return {
                effective: K,
                status: "valid"
            }
        }
    }
}
// @from(Ln 1741, Col 4)
zn1
// @from(Ln 1741, Col 9)
IcA
// @from(Ln 1741, Col 14)
wn1
// @from(Ln 1742, Col 4)
aV1 = v(() => {
    zn1 = hcA("BASH_MAX_OUTPUT_LENGTH"), IcA = hcA("TASK_MAX_OUTPUT_LENGTH"), wn1 = {
        name: "CLAUDE_CODE_MAX_OUTPUT_TOKENS",
        default: 32000,
        validate: (A) => {
            if (!A) return {
                effective: 32000,
                status: "valid"
            };
            let Y = parseInt(A, 10);
            if (isNaN(Y) || Y <= 0) return {
                effective: 32000,
                status: "invalid",
                message: `Invalid value "${A}" (using default: 32000)`
            };
            if (Y > 64000) return {
                effective: 64000,
                status: "capped",
                message: `Capped from ${Y} to 64000`
            };
            return {
                effective: Y,
                status: "valid"
            }
        }
    }
})
// @from(Ln 1769, Col 4)
xcA = "claude-code-20250219"
// @from(Ln 1770, Col 4)
Hn1 = "interleaved-thinking-2025-05-14"
// @from(Ln 1771, Col 4)
sV1 = "context-1m-2025-08-07"
// @from(Ln 1772, Col 4)
$n1 = "context-management-2025-06-27"
// @from(Ln 1773, Col 4)
hl = "structured-outputs-2025-12-15"
// @from(Ln 1774, Col 4)
wL6 = "web-search-2025-03-05"
// @from(Ln 1775, Col 4)
On1 = "tool-examples-2025-10-29"
// @from(Ln 1776, Col 4)
bcA = "advanced-tool-use-2025-11-20"
// @from(Ln 1777, Col 4)
ucA = "tool-search-tool-2025-10-19"
// @from(Ln 1778, Col 4)
HL6 = "effort-2025-11-24"
// @from(Ln 1779, Col 4)
$L6 = "adaptive-thinking-2026-01-28"
// @from(Ln 1780, Col 4)
tV1 = "prompt-caching-scope-2026-01-05"
// @from(Ln 1781, Col 4)
BcA = "research-preview-2026-02-01"
// @from(Ln 1782, Col 4)
OL6
// @from(Ln 1782, Col 9)
_L6
// @from(Ln 1783, Col 4)
e11 = v(() => {
    OL6 = new Set(["interleaved-thinking-2025-05-14", "context-1m-2025-08-07", "tool-search-tool-2025-10-19", "tool-examples-2025-10-29"]), _L6 = new Set(["claude-code-20250219", "interleaved-thinking-2025-05-14", "fine-grained-tool-streaming-2025-05-14", "context-management-2025-06-27"])
})
// @from(Ln 1787, Col 0)
function Xbq(A) {
    let q = A.toLowerCase();
    return q.includes("claude-sonnet-4") || q.includes("opus-4-6")
}
// @from(Ln 1792, Col 0)
function yG(A, q) {
    if (A.includes("[1m]") || q?.includes(sV1) && Xbq(A)) return 1e6;
    return Obq
}
// @from(Ln 1797, Col 0)
function mcA(A, q) {
    if (!A) return {
        used: null,
        remaining: null
    };
    let K = A.input_tokens + A.cache_creation_input_tokens + A.cache_read_input_tokens,
        Y = Math.round(K / q * 100),
        z = Math.min(100, Math.max(0, Y));
    return {
        used: z,
        remaining: 100 - z
    }
}
// @from(Ln 1811, Col 0)
function nz1(A) {
    let q = A.toLowerCase(),
        K;
    if (q.includes("3-5")) K = 8192;
    else if (q.includes("claude-3-opus")) K = 4096;
    else if (q.includes("claude-3-sonnet")) K = 8192;
    else if (q.includes("claude-3-haiku")) K = 4096;
    else if (q.includes("opus-4-5")) K = 64000;
    else if (q.includes("opus-4")) K = 32000;
    else if (q.includes("sonnet-4") || q.includes("haiku-4")) K = 64000;
    else K = _bq;
    return K
}
// @from(Ln 1825, Col 0)
function rz1(A) {
    return Jbq
}
// @from(Ln 1828, Col 4)
Obq = 200000
// @from(Ln 1829, Col 4)
JL6 = 20000
// @from(Ln 1830, Col 4)
_bq = 32000
// @from(Ln 1831, Col 4)
Jbq = 31999
// @from(Ln 1832, Col 4)
hf = v(() => {
    e11()
})
// @from(Ln 1836, Col 0)
function FcA() {
    return XL6
}
// @from(Ln 1840, Col 0)
function QcA(A) {
    XL6 = A
}
// @from(Ln 1844, Col 0)
function GO() {
    XL6 = null
}
// @from(Ln 1847, Col 4)
XL6 = null
// @from(Ln 1848, Col 4)
scA = {}
// @from(Ln 2001, Col 0)
function dcA() {
    let A = "";
    if (typeof process < "u" && typeof process.cwd === "function" && typeof gcA === "function") A = gcA(Dbq()).normalize("NFC");
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
        sessionId: pcA(),
        parentSessionId: void 0,
        loggerProvider: null,
        eventLogger: null,
        meterProvider: null,
        tracerProvider: null,
        agentColorMap: new Map,
        agentColorIndex: 0,
        envVarValidators: [zn1, wn1],
        lastAPIRequest: null,
        inMemoryErrorLog: [],
        inlinePlugins: [],
        useCoworkPlugins: !1,
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
        promptCacheBreaks: [],
        sdkBetas: void 0,
        mainThreadAgentType: void 0,
        isRemoteMode: !1,
        directConnectServerUrl: void 0,
        systemPromptSectionCache: new Map,
        additionalDirectoriesForClaudeMd: [],
        resumedTranscriptPath: null
    }
}
// @from(Ln 2075, Col 0)
function U6() {
    return o6.sessionId
}
// @from(Ln 2079, Col 0)
function DL6(A = {}) {
    if (A.setCurrentAsParent) o6.parentSessionId = o6.sessionId;
    return o6.sessionId = pcA(), o6.resumedTranscriptPath = null, o6.sessionId
}
// @from(Ln 2084, Col 0)
function jL6() {
    return o6.parentSessionId
}
// @from(Ln 2088, Col 0)
function mP(A) {
    if (o6.sessionId = A, process.env.CLAUDE_CODE_SESSION_ID !== void 0) process.env.CLAUDE_CODE_SESSION_ID = A
}
// @from(Ln 2092, Col 0)
function y8() {
    return o6.originalCwd
}
// @from(Ln 2096, Col 0)
function ZO() {
    return o6.projectRoot
}
// @from(Ln 2100, Col 0)
function _n1(A) {
    o6.originalCwd = A.normalize("NFC")
}
// @from(Ln 2104, Col 0)
function ML6() {
    return o6.resumedTranscriptPath
}
// @from(Ln 2108, Col 0)
function eV1(A) {
    o6.resumedTranscriptPath = A
}
// @from(Ln 2112, Col 0)
function Ex() {
    return o6.cwd
}
// @from(Ln 2116, Col 0)
function PL6(A) {
    o6.cwd = A.normalize("NFC")
}
// @from(Ln 2120, Col 0)
function WL6() {
    return o6.directConnectServerUrl
}
// @from(Ln 2124, Col 0)
function jbq(A) {
    o6.directConnectServerUrl = A
}
// @from(Ln 2128, Col 0)
function GL6(A, q) {
    o6.totalAPIDuration += A, o6.totalAPIDurationWithoutRetries += q
}
// @from(Ln 2132, Col 0)
function Mbq() {
    o6.totalAPIDuration = 0, o6.totalAPIDurationWithoutRetries = 0, o6.totalCostUSD = 0
}
// @from(Ln 2136, Col 0)
function ZL6(A, q, K) {
    o6.totalCostUSD += A;
    let Y = o6.modelUsage[K] ?? {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadInputTokens: 0,
        cacheCreationInputTokens: 0,
        webSearchRequests: 0,
        costUSD: 0,
        contextWindow: 0,
        maxOutputTokens: 0
    };
    Y.inputTokens += q.input_tokens, Y.outputTokens += q.output_tokens, Y.cacheReadInputTokens += q.cache_read_input_tokens ?? 0, Y.cacheCreationInputTokens += q.cache_creation_input_tokens ?? 0, Y.webSearchRequests += q.server_tool_use?.web_search_requests ?? 0, Y.costUSD += A, Y.contextWindow = yG(K, o6.sdkBetas), Y.maxOutputTokens = nz1(K), o6.modelUsage[K] = Y
}
// @from(Ln 2151, Col 0)
function W0() {
    return o6.totalCostUSD
}
// @from(Ln 2155, Col 0)
function wT() {
    return o6.totalAPIDuration
}
// @from(Ln 2159, Col 0)
function oz1() {
    return Date.now() - o6.startTime
}
// @from(Ln 2163, Col 0)
function fL6() {
    return o6.totalAPIDurationWithoutRetries
}
// @from(Ln 2167, Col 0)
function VL6() {
    return o6.totalToolDuration
}
// @from(Ln 2171, Col 0)
function Jn1(A) {
    o6.totalToolDuration += A
}
// @from(Ln 2175, Col 0)
function A61() {
    o6.lastInteractionTime = Date.now()
}
// @from(Ln 2179, Col 0)
function Xn1(A, q) {
    o6.totalLinesAdded += A, o6.totalLinesRemoved += q
}
// @from(Ln 2183, Col 0)
function q61() {
    return o6.totalLinesAdded
}
// @from(Ln 2187, Col 0)
function K61() {
    return o6.totalLinesRemoved
}
// @from(Ln 2191, Col 0)
function AN1() {
    return iz1(Object.values(o6.modelUsage), "inputTokens")
}
// @from(Ln 2195, Col 0)
function qN1() {
    return iz1(Object.values(o6.modelUsage), "outputTokens")
}
// @from(Ln 2199, Col 0)
function NL6() {
    return iz1(Object.values(o6.modelUsage), "cacheReadInputTokens")
}
// @from(Ln 2203, Col 0)
function TL6() {
    return iz1(Object.values(o6.modelUsage), "cacheCreationInputTokens")
}
// @from(Ln 2207, Col 0)
function vL6() {
    return iz1(Object.values(o6.modelUsage), "webSearchRequests")
}
// @from(Ln 2211, Col 0)
function Dn1() {
    o6.hasUnknownModelCost = !0
}
// @from(Ln 2215, Col 0)
function EL6() {
    return o6.hasUnknownModelCost
}
// @from(Ln 2219, Col 0)
function KN1() {
    return o6.lastInteractionTime
}
// @from(Ln 2223, Col 0)
function ty() {
    return o6.modelUsage
}
// @from(Ln 2227, Col 0)
function ccA(A) {
    return o6.modelUsage[A]
}
// @from(Ln 2231, Col 0)
function HT() {
    return o6.mainLoopModelOverride
}
// @from(Ln 2235, Col 0)
function YN1() {
    return o6.initialMainLoopModel
}
// @from(Ln 2239, Col 0)
function CG(A) {
    o6.mainLoopModelOverride = A
}
// @from(Ln 2243, Col 0)
function kL6(A) {
    o6.initialMainLoopModel = A
}
// @from(Ln 2247, Col 0)
function FP() {
    return o6.sdkBetas
}
// @from(Ln 2251, Col 0)
function LL6(A) {
    o6.sdkBetas = A
}
// @from(Ln 2255, Col 0)
function az1() {
    o6.totalCostUSD = 0, o6.totalAPIDuration = 0, o6.totalAPIDurationWithoutRetries = 0, o6.totalToolDuration = 0, o6.startTime = Date.now(), o6.totalLinesAdded = 0, o6.totalLinesRemoved = 0, o6.hasUnknownModelCost = !1, o6.modelUsage = {}
}
// @from(Ln 2259, Col 0)
function zN1({
    totalCostUSD: A,
    totalAPIDuration: q,
    totalAPIDurationWithoutRetries: K,
    totalToolDuration: Y,
    totalLinesAdded: z,
    totalLinesRemoved: w,
    lastDuration: H,
    modelUsage: $
}) {
    if (o6.totalCostUSD = A, o6.totalAPIDuration = q, o6.totalAPIDurationWithoutRetries = K, o6.totalToolDuration = Y, o6.totalLinesAdded = z, o6.totalLinesRemoved = w, $) o6.modelUsage = $;
    if (H) o6.startTime = Date.now() - H
}
// @from(Ln 2273, Col 0)
function lcA() {
    throw Error("resetStateForTests can only be called in tests")
}
// @from(Ln 2277, Col 0)
function sz1() {
    return o6.modelStrings
}
// @from(Ln 2281, Col 0)
function wN1(A) {
    o6.modelStrings = A
}
// @from(Ln 2285, Col 0)
function Pbq() {
    o6.modelStrings = null
}
// @from(Ln 2289, Col 0)
function RL6(A, q) {
    o6.meter = A, o6.sessionCounter = q("claude_code.session.count", {
        description: "Count of CLI sessions started"
    }), o6.locCounter = q("claude_code.lines_of_code.count", {
        description: "Count of lines of code modified, with the 'type' attribute indicating whether lines were added or removed"
    }), o6.prCounter = q("claude_code.pull_request.count", {
        description: "Number of pull requests created"
    }), o6.commitCounter = q("claude_code.commit.count", {
        description: "Number of git commits created"
    }), o6.costCounter = q("claude_code.cost.usage", {
        description: "Cost of the Claude Code session",
        unit: "USD"
    }), o6.tokenCounter = q("claude_code.token.usage", {
        description: "Number of tokens used",
        unit: "tokens"
    }), o6.codeEditToolDecisionCounter = q("claude_code.code_edit_tool.decision", {
        description: "Count of code editing tool permission decisions (accept/reject) for Edit, Write, and NotebookEdit tools"
    }), o6.activeTimeCounter = q("claude_code.active_time.total", {
        description: "Total active time in seconds",
        unit: "s"
    })
}
// @from(Ln 2312, Col 0)
function Wbq() {
    return o6.meter
}
// @from(Ln 2316, Col 0)
function yL6() {
    return o6.sessionCounter
}
// @from(Ln 2320, Col 0)
function jn1() {
    return o6.locCounter
}
// @from(Ln 2324, Col 0)
function HN1() {
    return o6.prCounter
}
// @from(Ln 2328, Col 0)
function CL6() {
    return o6.commitCounter
}
// @from(Ln 2332, Col 0)
function SL6() {
    return o6.costCounter
}
// @from(Ln 2336, Col 0)
function tz1() {
    return o6.tokenCounter
}
// @from(Ln 2340, Col 0)
function hL6() {
    return o6.codeEditToolDecisionCounter
}
// @from(Ln 2344, Col 0)
function Mn1() {
    return o6.activeTimeCounter
}
// @from(Ln 2348, Col 0)
function $N1() {
    return o6.loggerProvider
}
// @from(Ln 2352, Col 0)
function Pn1(A) {
    o6.loggerProvider = A
}
// @from(Ln 2356, Col 0)
function IL6() {
    return o6.eventLogger
}
// @from(Ln 2360, Col 0)
function Wn1(A) {
    o6.eventLogger = A
}
// @from(Ln 2364, Col 0)
function xL6() {
    return o6.meterProvider
}
// @from(Ln 2368, Col 0)
function Gn1(A) {
    o6.meterProvider = A
}
// @from(Ln 2372, Col 0)
function Y61() {
    return o6.tracerProvider
}
// @from(Ln 2376, Col 0)
function Zn1(A) {
    o6.tracerProvider = A
}
// @from(Ln 2380, Col 0)
function w4() {
    return !o6.isInteractive
}
// @from(Ln 2384, Col 0)
function wQ() {
    return o6.isInteractive
}
// @from(Ln 2388, Col 0)
function bL6(A) {
    o6.isInteractive = A
}
// @from(Ln 2392, Col 0)
function ON1() {
    return o6.clientType
}
// @from(Ln 2396, Col 0)
function uL6(A) {
    o6.clientType = A
}
// @from(Ln 2400, Col 0)
function fn1() {
    return o6.agentColorMap
}
// @from(Ln 2404, Col 0)
function Il() {
    return o6.flagSettingsPath
}
// @from(Ln 2408, Col 0)
function BL6(A) {
    o6.flagSettingsPath = A
}
// @from(Ln 2412, Col 0)
function mL6() {
    return o6.sessionIngressToken
}
// @from(Ln 2416, Col 0)
function z61(A) {
    o6.sessionIngressToken = A
}
// @from(Ln 2420, Col 0)
function FL6() {
    return o6.oauthTokenFromFd
}
// @from(Ln 2424, Col 0)
function w61(A) {
    o6.oauthTokenFromFd = A
}
// @from(Ln 2428, Col 0)
function QL6() {
    return o6.apiKeyFromFd
}
// @from(Ln 2432, Col 0)
function H61(A) {
    o6.apiKeyFromFd = A
}
// @from(Ln 2436, Col 0)
function gL6() {
    return o6.envVarValidators
}
// @from(Ln 2440, Col 0)
function UL6(A) {
    o6.lastAPIRequest = A
}
// @from(Ln 2444, Col 0)
function pL6() {
    return o6.lastAPIRequest
}
// @from(Ln 2448, Col 0)
function Gbq() {
    return [...o6.inMemoryErrorLog]
}
// @from(Ln 2452, Col 0)
function Zbq(A) {
    if (o6.inMemoryErrorLog.length >= 100) o6.inMemoryErrorLog.shift();
    o6.inMemoryErrorLog.push(A)
}
// @from(Ln 2457, Col 0)
function dL6() {
    return o6.allowedSettingSources
}
// @from(Ln 2461, Col 0)
function cL6(A) {
    o6.allowedSettingSources = A
}
// @from(Ln 2465, Col 0)
function _N1() {
    return w4() && o6.clientType !== "claude-vscode"
}
// @from(Ln 2469, Col 0)
function lL6(A) {
    o6.inlinePlugins = A
}
// @from(Ln 2473, Col 0)
function $61() {
    return o6.inlinePlugins
}
// @from(Ln 2477, Col 0)
function $T(A) {
    o6.useCoworkPlugins = A, GO()
}
// @from(Ln 2481, Col 0)
function JN1() {
    return o6.useCoworkPlugins
}
// @from(Ln 2485, Col 0)
function iL6(A) {
    o6.sessionBypassPermissionsMode = A
}
// @from(Ln 2489, Col 0)
function HQ() {
    return o6.sessionBypassPermissionsMode
}
// @from(Ln 2493, Col 0)
function nL6(A) {
    o6.sessionTrustAccepted = A
}
// @from(Ln 2497, Col 0)
function rL6() {
    return o6.sessionTrustAccepted
}
// @from(Ln 2501, Col 0)
function oL6(A) {
    o6.sessionPersistenceDisabled = A
}
// @from(Ln 2505, Col 0)
function qk() {
    return o6.sessionPersistenceDisabled
}
// @from(Ln 2509, Col 0)
function aL6() {
    return o6.hasExitedPlanMode
}
// @from(Ln 2513, Col 0)
function OT(A) {
    o6.hasExitedPlanMode = A
}
// @from(Ln 2517, Col 0)
function sL6() {
    return o6.needsPlanModeExitAttachment
}
// @from(Ln 2521, Col 0)
function kx(A) {
    o6.needsPlanModeExitAttachment = A
}
// @from(Ln 2525, Col 0)
function ey(A, q) {
    if (q === "plan" && A !== "plan") o6.needsPlanModeExitAttachment = !1;
    if (A === "plan" && q !== "plan") o6.needsPlanModeExitAttachment = !0
}
// @from(Ln 2530, Col 0)
function fbq() {
    return o6.hasExitedDelegateMode
}
// @from(Ln 2534, Col 0)
function tL6(A) {
    o6.hasExitedDelegateMode = A
}
// @from(Ln 2538, Col 0)
function eL6() {
    return o6.needsDelegateModeExitAttachment
}
// @from(Ln 2542, Col 0)
function XN1(A) {
    o6.needsDelegateModeExitAttachment = A
}
// @from(Ln 2546, Col 0)
function AR6() {
    return o6.lspRecommendationShownThisSession
}
// @from(Ln 2550, Col 0)
function qR6(A) {
    o6.lspRecommendationShownThisSession = A
}
// @from(Ln 2554, Col 0)
function KR6(A) {
    o6.initJsonSchema = A
}
// @from(Ln 2558, Col 0)
function Vn1() {
    return o6.initJsonSchema
}
// @from(Ln 2562, Col 0)
function O61(A) {
    if (!o6.registeredHooks) o6.registeredHooks = {};
    for (let [q, K] of Object.entries(A)) {
        let Y = q;
        if (!o6.registeredHooks[Y]) o6.registeredHooks[Y] = [];
        o6.registeredHooks[Y].push(...K)
    }
}
// @from(Ln 2571, Col 0)
function DN1() {
    return o6.registeredHooks
}
// @from(Ln 2575, Col 0)
function Vbq() {
    o6.registeredHooks = null
}
// @from(Ln 2579, Col 0)
function YR6() {
    if (!o6.registeredHooks) return;
    let A = {};
    for (let [q, K] of Object.entries(o6.registeredHooks)) {
        let Y = K.filter((z) => !("pluginRoot" in z));
        if (Y.length > 0) A[q] = Y
    }
    o6.registeredHooks = Object.keys(A).length > 0 ? A : null
}
// @from(Ln 2589, Col 0)
function icA() {
    o6.initJsonSchema = null, o6.registeredHooks = null
}
// @from(Ln 2593, Col 0)
function _61() {
    return o6.planSlugCache
}
// @from(Ln 2597, Col 0)
function jN1(A) {
    o6.teleportedSessionInfo = {
        isTeleported: !0,
        hasLoggedFirstMessage: !1,
        sessionId: A.sessionId
    }
}
// @from(Ln 2605, Col 0)
function Nn1() {
    return o6.teleportedSessionInfo
}
// @from(Ln 2609, Col 0)
function Tn1() {
    if (o6.teleportedSessionInfo) o6.teleportedSessionInfo.hasLoggedFirstMessage = !0
}
// @from(Ln 2613, Col 0)
function MN1(A, q, K) {
    o6.invokedSkills.set(A, {
        skillName: A,
        skillPath: q,
        content: K,
        invokedAt: Date.now()
    })
}
// @from(Ln 2622, Col 0)
function zR6() {
    return o6.invokedSkills
}
// @from(Ln 2626, Col 0)
function Nbq() {
    o6.invokedSkills.clear()
}
// @from(Ln 2630, Col 0)
function Tbq(A, q) {
    return
}
// @from(Ln 2634, Col 0)
function rcA() {
    let A = Date.now();
    return o6.slowOperations = o6.slowOperations.filter((q) => A - q.timestamp < ncA), [...o6.slowOperations]
}
// @from(Ln 2639, Col 0)
function vbq() {
    o6.slowOperations = []
}
// @from(Ln 2643, Col 0)
function wR6(A, q) {
    return
}
// @from(Ln 2647, Col 0)
function ocA() {
    let A = Date.now();
    return o6.promptCacheBreaks = o6.promptCacheBreaks.filter((q) => A - q.timestamp < Ebq), [...o6.promptCacheBreaks]
}
// @from(Ln 2652, Col 0)
function HR6() {
    o6.promptCacheBreaks = []
}
// @from(Ln 2656, Col 0)
function PN1() {
    return o6.mainThreadAgentType
}
// @from(Ln 2660, Col 0)
function AC(A) {
    o6.mainThreadAgentType = A
}
// @from(Ln 2664, Col 0)
function Nq() {
    return o6.isRemoteMode
}
// @from(Ln 2668, Col 0)
function $R6(A) {
    o6.isRemoteMode = A
}
// @from(Ln 2672, Col 0)
function OR6() {
    return o6.systemPromptSectionCache
}
// @from(Ln 2676, Col 0)
function _R6(A, q) {
    o6.systemPromptSectionCache.set(A, q)
}
// @from(Ln 2680, Col 0)
function JR6() {
    o6.systemPromptSectionCache.clear()
}
// @from(Ln 2684, Col 0)
function qC() {
    return o6.additionalDirectoriesForClaudeMd
}
// @from(Ln 2688, Col 0)
function WN1(A) {
    o6.additionalDirectoriesForClaudeMd = A
}
// @from(Ln 2692, Col 0)
function kbq() {
    return acA
}
// @from(Ln 2696, Col 0)
function XR6(A) {
    acA = {
        length: A
    }
}
// @from(Ln 2701, Col 4)
o6
// @from(Ln 2701, Col 8)
UcA = 10
// @from(Ln 2702, Col 4)
ncA = 1e4
// @from(Ln 2703, Col 4)
Ebq = 20000
// @from(Ln 2704, Col 4)
acA
// @from(Ln 2705, Col 4)
B6 = v(() => {
    ScA();
    aV1();
    hf();
    o6 = dcA();
    acA = {
        length: 0
    }
})
// @from(Ln 2715, Col 0)
function Lbq(A, q) {
    var K = -1,
        Y = A == null ? 0 : A.length;
    while (++K < Y)
        if (q(A[K], K, A) === !1) break;
    return A
}
// @from(Ln 2722, Col 4)
tcA
// @from(Ln 2723, Col 4)
ecA = v(() => {
    tcA = Lbq
})
// @from(Ln 2726, Col 4)
Rbq
// @from(Ln 2726, Col 9)
ez1
// @from(Ln 2727, Col 4)
DR6 = v(() => {
    vl();
    Rbq = function() {
        try {
            var A = Sf(Object, "defineProperty");
            return A({}, "", {}), A
        } catch (q) {}
    }(), ez1 = Rbq
})
// @from(Ln 2737, Col 0)
function ybq(A, q, K) {
    if (q == "__proto__" && ez1) ez1(A, q, {
        configurable: !0,
        enumerable: !0,
        value: K,
        writable: !0
    });
    else A[q] = K
}
// @from(Ln 2746, Col 4)
xl
// @from(Ln 2747, Col 4)
GN1 = v(() => {
    DR6();
    xl = ybq
})
// @from(Ln 2752, Col 0)
function hbq(A, q, K) {
    var Y = A[q];
    if (!(Sbq.call(A, q) && Wx(Y, K)) || K === void 0 && !(q in A)) xl(A, q, K)
}
// @from(Ln 2756, Col 4)
Cbq
// @from(Ln 2756, Col 9)
Sbq
// @from(Ln 2756, Col 14)
bl
// @from(Ln 2757, Col 4)
ZN1 = v(() => {
    GN1();
    Ez1();
    Cbq = Object.prototype, Sbq = Cbq.hasOwnProperty;
    bl = hbq
})
// @from(Ln 2764, Col 0)
function Ibq(A, q, K, Y) {
    var z = !K;
    K || (K = {});
    var w = -1,
        H = q.length;
    while (++w < H) {
        var $ = q[w],
            O = Y ? Y(K[$], A[$], $, K, A) : void 0;
        if (O === void 0) O = A[$];
        if (z) xl(K, $, O);
        else bl(K, $, O)
    }
    return K
}
// @from(Ln 2778, Col 4)
Kk
// @from(Ln 2779, Col 4)
J61 = v(() => {
    ZN1();
    GN1();
    Kk = Ibq
})
// @from(Ln 2785, Col 0)
function xbq(A, q) {
    return A && Kk(q, eE(q), A)
}
// @from(Ln 2788, Col 4)
AlA
// @from(Ln 2789, Col 4)
qlA = v(() => {
    J61();
    a11();
    AlA = xbq
})
// @from(Ln 2795, Col 0)
function bbq(A) {
    var q = [];
    if (A != null)
        for (var K in Object(A)) q.push(K);
    return q
}
// @from(Ln 2801, Col 4)
KlA
// @from(Ln 2802, Col 4)
YlA = v(() => {
    KlA = bbq
})
// @from(Ln 2806, Col 0)
function mbq(A) {
    if (!WO(A)) return KlA(A);
    var q = uz1(A),
        K = [];
    for (var Y in A)
        if (!(Y == "constructor" && (q || !Bbq.call(A, Y)))) K.push(Y);
    return K
}
// @from(Ln 2814, Col 4)
ubq
// @from(Ln 2814, Col 9)
Bbq
// @from(Ln 2814, Col 14)
zlA
// @from(Ln 2815, Col 4)
wlA = v(() => {
    tE();
    di1();
    YlA();
    ubq = Object.prototype, Bbq = ubq.hasOwnProperty;
    zlA = mbq
})
// @from(Ln 2823, Col 0)
function Fbq(A) {
    return Nx(A) ? pi1(A, !0) : zlA(A)
}
// @from(Ln 2826, Col 4)
Lx
// @from(Ln 2827, Col 4)
A21 = v(() => {
    ek6();
    wlA();
    Bz1();
    Lx = Fbq
})
// @from(Ln 2834, Col 0)
function Qbq(A, q) {
    return A && Kk(q, Lx(q), A)
}
// @from(Ln 2837, Col 4)
HlA
// @from(Ln 2838, Col 4)
$lA = v(() => {
    J61();
    A21();
    HlA = Qbq
})
// @from(Ln 2843, Col 4)
En1 = {}
// @from(Ln 2848, Col 0)
function Ubq(A, q) {
    if (q) return A.slice();
    var K = A.length,
        Y = JlA ? JlA(K) : new A.constructor(K);
    return A.copy(Y), Y
}
// @from(Ln 2854, Col 4)
XlA
// @from(Ln 2854, Col 9)
OlA
// @from(Ln 2854, Col 14)
gbq
// @from(Ln 2854, Col 19)
_lA
// @from(Ln 2854, Col 24)
JlA
// @from(Ln 2854, Col 29)
fN1
// @from(Ln 2855, Col 4)
jR6 = v(() => {
    sy();
    XlA = typeof En1 == "object" && En1 && !En1.nodeType && En1, OlA = XlA && typeof vn1 == "object" && vn1 && !vn1.nodeType && vn1, gbq = OlA && OlA.exports === XlA, _lA = gbq ? sJ.Buffer : void 0, JlA = _lA ? _lA.allocUnsafe : void 0;
    fN1 = Ubq
})
// @from(Ln 2861, Col 0)
function pbq(A, q) {
    var K = -1,
        Y = A.length;
    q || (q = Array(Y));
    while (++K < Y) q[K] = A[K];
    return q
}
// @from(Ln 2868, Col 4)
kn1
// @from(Ln 2869, Col 4)
MR6 = v(() => {
    kn1 = pbq
})
// @from(Ln 2873, Col 0)
function dbq(A, q) {
    return Kk(A, hz1(A), q)
}
// @from(Ln 2876, Col 4)
DlA
// @from(Ln 2877, Col 4)
jlA = v(() => {
    J61();
    xi1();
    DlA = dbq
})
// @from(Ln 2882, Col 4)
cbq
// @from(Ln 2882, Col 9)
q21
// @from(Ln 2883, Col 4)
Ln1 = v(() => {
    AL6();
    cbq = ci1(Object.getPrototypeOf, Object), q21 = cbq
})
// @from(Ln 2887, Col 4)
lbq
// @from(Ln 2887, Col 9)
ibq
// @from(Ln 2887, Col 14)
Rn1
// @from(Ln 2888, Col 4)
PR6 = v(() => {
    Ci1();
    Ln1();
    xi1();
    ak6();
    lbq = Object.getOwnPropertySymbols, ibq = !lbq ? Ii1 : function(A) {
        var q = [];
        while (A) Sz1(q, hz1(A)), A = q21(A);
        return q
    }, Rn1 = ibq
})
// @from(Ln 2900, Col 0)
function nbq(A, q) {
    return Kk(A, Rn1(A), q)
}
// @from(Ln 2903, Col 4)
MlA
// @from(Ln 2904, Col 4)
PlA = v(() => {
    J61();
    PR6();
    MlA = nbq
})
// @from(Ln 2910, Col 0)
function rbq(A) {
    return Si1(A, Lx, Rn1)
}
// @from(Ln 2913, Col 4)
yn1
// @from(Ln 2914, Col 4)
WR6 = v(() => {
    rk6();
    PR6();
    A21();
    yn1 = rbq
})
// @from(Ln 2921, Col 0)
function sbq(A) {
    var q = A.length,
        K = new A.constructor(q);
    if (q && typeof A[0] == "string" && abq.call(A, "index")) K.index = A.index, K.input = A.input;
    return K
}
// @from(Ln 2927, Col 4)
obq
// @from(Ln 2927, Col 9)
abq
// @from(Ln 2927, Col 14)
WlA
// @from(Ln 2928, Col 4)
GlA = v(() => {
    obq = Object.prototype, abq = obq.hasOwnProperty;
    WlA = sbq
})
// @from(Ln 2933, Col 0)
function tbq(A) {
    var q = new A.constructor(A.byteLength);
    return new yz1(q).set(new yz1(A)), q
}
// @from(Ln 2937, Col 4)
K21
// @from(Ln 2938, Col 4)
Cn1 = v(() => {
    ik6();
    K21 = tbq
})
// @from(Ln 2943, Col 0)
function ebq(A, q) {
    var K = q ? K21(A.buffer) : A.buffer;
    return new A.constructor(K, A.byteOffset, A.byteLength)
}
// @from(Ln 2947, Col 4)
ZlA
// @from(Ln 2948, Col 4)
flA = v(() => {
    Cn1();
    ZlA = ebq
})
// @from(Ln 2953, Col 0)
function quq(A) {
    var q = new A.constructor(A.source, Auq.exec(A));
    return q.lastIndex = A.lastIndex, q
}
// @from(Ln 2957, Col 4)
Auq
// @from(Ln 2957, Col 9)
VlA
// @from(Ln 2958, Col 4)
NlA = v(() => {
    Auq = /\w*$/;
    VlA = quq
})
// @from(Ln 2963, Col 0)
function Kuq(A) {
    return vlA ? Object(vlA.call(A)) : {}
}
// @from(Ln 2966, Col 4)
TlA
// @from(Ln 2966, Col 9)
vlA
// @from(Ln 2966, Col 14)
ElA
// @from(Ln 2967, Col 4)
klA = v(() => {
    n11();
    TlA = P0 ? P0.prototype : void 0, vlA = TlA ? TlA.valueOf : void 0;
    ElA = Kuq
})
// @from(Ln 2973, Col 0)
function Yuq(A, q) {
    var K = q ? K21(A.buffer) : A.buffer;
    return new A.constructor(K, A.byteOffset, A.length)
}
// @from(Ln 2977, Col 4)
Sn1
// @from(Ln 2978, Col 4)
GR6 = v(() => {
    Cn1();
    Sn1 = Yuq
})
// @from(Ln 2983, Col 0)
function vuq(A, q, K) {
    var Y = A.constructor;
    switch (q) {
        case Duq:
            return K21(A);
        case zuq:
        case wuq:
            return new Y(+A);
        case juq:
            return ZlA(A, K);
        case Muq:
        case Puq:
        case Wuq:
        case Guq:
        case Zuq:
        case fuq:
        case Vuq:
        case Nuq:
        case Tuq:
            return Sn1(A, K);
        case Huq:
            return new Y;
        case $uq:
        case Juq:
            return new Y(A);
        case Ouq:
            return VlA(A);
        case _uq:
            return new Y;
        case Xuq:
            return ElA(A)
    }
}
// @from(Ln 3016, Col 4)
zuq = "[object Boolean]"
// @from(Ln 3017, Col 4)
wuq = "[object Date]"
// @from(Ln 3018, Col 4)
Huq = "[object Map]"
// @from(Ln 3019, Col 4)
$uq = "[object Number]"
// @from(Ln 3020, Col 4)
Ouq = "[object RegExp]"
// @from(Ln 3021, Col 4)
_uq = "[object Set]"
// @from(Ln 3022, Col 4)
Juq = "[object String]"
// @from(Ln 3023, Col 4)
Xuq = "[object Symbol]"
// @from(Ln 3024, Col 4)
Duq = "[object ArrayBuffer]"
// @from(Ln 3025, Col 4)
juq = "[object DataView]"
// @from(Ln 3026, Col 4)
Muq = "[object Float32Array]"
// @from(Ln 3027, Col 4)
Puq = "[object Float64Array]"
// @from(Ln 3028, Col 4)
Wuq = "[object Int8Array]"
// @from(Ln 3029, Col 4)
Guq = "[object Int16Array]"
// @from(Ln 3030, Col 4)
Zuq = "[object Int32Array]"
// @from(Ln 3031, Col 4)
fuq = "[object Uint8Array]"
// @from(Ln 3032, Col 4)
Vuq = "[object Uint8ClampedArray]"
// @from(Ln 3033, Col 4)
Nuq = "[object Uint16Array]"
// @from(Ln 3034, Col 4)
Tuq = "[object Uint32Array]"
// @from(Ln 3035, Col 4)
LlA
// @from(Ln 3036, Col 4)
RlA = v(() => {
    Cn1();
    flA();
    NlA();
    klA();
    GR6();
    LlA = vuq
})
// @from(Ln 3044, Col 4)
ylA
// @from(Ln 3044, Col 9)
Euq
// @from(Ln 3044, Col 14)
ClA
// @from(Ln 3045, Col 4)
SlA = v(() => {
    tE();
    ylA = Object.create, Euq = function() {
        function A() {}
        return function(q) {
            if (!WO(q)) return {};
            if (ylA) return ylA(q);
            A.prototype = q;
            var K = new A;
            return A.prototype = void 0, K
        }
    }(), ClA = Euq
})
// @from(Ln 3059, Col 0)
function kuq(A) {
    return typeof A.constructor == "function" && !uz1(A) ? ClA(q21(A)) : {}
}
// @from(Ln 3062, Col 4)
hn1
// @from(Ln 3063, Col 4)
ZR6 = v(() => {
    SlA();
    Ln1();
    di1();
    hn1 = kuq
})
// @from(Ln 3070, Col 0)
function Ruq(A) {
    return fD(A) && zQ(A) == Luq
}
// @from(Ln 3073, Col 4)
Luq = "[object Map]"
// @from(Ln 3074, Col 4)
hlA
// @from(Ln 3075, Col 4)
IlA = v(() => {
    oV1();
    Zx();
    hlA = Ruq
})
// @from(Ln 3080, Col 4)
xlA
// @from(Ln 3080, Col 9)
yuq
// @from(Ln 3080, Col 14)
blA
// @from(Ln 3081, Col 4)
ulA = v(() => {
    IlA();
    mi1();
    gi1();
    xlA = Vx && Vx.isMap, yuq = xlA ? xz1(xlA) : hlA, blA = yuq
})
// @from(Ln 3088, Col 0)
function Suq(A) {
    return fD(A) && zQ(A) == Cuq
}
// @from(Ln 3091, Col 4)
Cuq = "[object Set]"
// @from(Ln 3092, Col 4)
BlA
// @from(Ln 3093, Col 4)
mlA = v(() => {
    oV1();
    Zx();
    BlA = Suq
})
// @from(Ln 3098, Col 4)
FlA
// @from(Ln 3098, Col 9)
huq
// @from(Ln 3098, Col 14)
QlA
// @from(Ln 3099, Col 4)
glA = v(() => {
    mlA();
    mi1();
    gi1();
    FlA = Vx && Vx.isSet, huq = FlA ? xz1(FlA) : BlA, QlA = huq
})
// @from(Ln 3106, Col 0)
function In1(A, q, K, Y, z, w) {
    var H, $ = q & Iuq,
        O = q & xuq,
        _ = q & buq;
    if (K) H = z ? K(A, Y, z, w) : K(A);
    if (H !== void 0) return H;
    if (!WO(A)) return A;
    var J = gz(A);
    if (J) {
        if (H = WlA(A), !$) return kn1(A, H)
    } else {
        var X = zQ(A),
            D = X == plA || X == Quq;
        if (fx(A)) return fN1(A, $);
        if (X == dlA || X == UlA || D && !z) {
            if (H = O || D ? {} : hn1(A), !$) return O ? MlA(A, HlA(H, A)) : DlA(A, AlA(H, A))
        } else {
            if (!ew[X]) return z ? A : {};
            H = LlA(A, X, $)
        }
    }
    w || (w = new Gx);
    var j = w.get(A);
    if (j) return j;
    if (w.set(A, H), QlA(A)) A.forEach(function(W) {
        H.add(In1(W, q, K, W, A, w))
    });
    else if (blA(A)) A.forEach(function(W, G) {
        H.set(G, In1(W, q, K, G, A, w))
    });
    var M = _ ? O ? yn1 : rV1 : O ? Lx : eE,
        P = J ? void 0 : M(A);
    return tcA(P || A, function(W, G) {
        if (P) G = W, W = A[G];
        bl(H, G, In1(W, q, K, G, A, w))
    }), H
}
// @from(Ln 3143, Col 4)
Iuq = 1
// @from(Ln 3144, Col 4)
xuq = 2
// @from(Ln 3145, Col 4)
buq = 4
// @from(Ln 3146, Col 4)
UlA = "[object Arguments]"
// @from(Ln 3147, Col 4)
uuq = "[object Array]"
// @from(Ln 3148, Col 4)
Buq = "[object Boolean]"
// @from(Ln 3149, Col 4)
muq = "[object Date]"
// @from(Ln 3150, Col 4)
Fuq = "[object Error]"
// @from(Ln 3151, Col 4)
plA = "[object Function]"
// @from(Ln 3152, Col 4)
Quq = "[object GeneratorFunction]"
// @from(Ln 3153, Col 4)
guq = "[object Map]"
// @from(Ln 3154, Col 4)
Uuq = "[object Number]"
// @from(Ln 3155, Col 4)
dlA = "[object Object]"
// @from(Ln 3156, Col 4)
puq = "[object RegExp]"
// @from(Ln 3157, Col 4)
duq = "[object Set]"
// @from(Ln 3158, Col 4)
cuq = "[object String]"
// @from(Ln 3159, Col 4)
luq = "[object Symbol]"
// @from(Ln 3160, Col 4)
iuq = "[object WeakMap]"
// @from(Ln 3161, Col 4)
nuq = "[object ArrayBuffer]"
// @from(Ln 3162, Col 4)
ruq = "[object DataView]"
// @from(Ln 3163, Col 4)
ouq = "[object Float32Array]"
// @from(Ln 3164, Col 4)
auq = "[object Float64Array]"
// @from(Ln 3165, Col 4)
suq = "[object Int8Array]"
// @from(Ln 3166, Col 4)
tuq = "[object Int16Array]"
// @from(Ln 3167, Col 4)
euq = "[object Int32Array]"
// @from(Ln 3168, Col 4)
ABq = "[object Uint8Array]"
// @from(Ln 3169, Col 4)
qBq = "[object Uint8ClampedArray]"
// @from(Ln 3170, Col 4)
KBq = "[object Uint16Array]"
// @from(Ln 3171, Col 4)
YBq = "[object Uint32Array]"
// @from(Ln 3172, Col 4)
ew
// @from(Ln 3172, Col 8)
xn1
// @from(Ln 3173, Col 4)
fR6 = v(() => {
    dV1();
    ecA();
    ZN1();
    qlA();
    $lA();
    jR6();
    MR6();
    jlA();
    PlA();
    qL6();
    WR6();
    oV1();
    GlA();
    RlA();
    ZR6();
    RG();
    lV1();
    ulA();
    tE();
    glA();
    a11();
    A21();
    ew = {};
    ew[UlA] = ew[uuq] = ew[nuq] = ew[ruq] = ew[Buq] = ew[muq] = ew[ouq] = ew[auq] = ew[suq] = ew[tuq] = ew[euq] = ew[guq] = ew[Uuq] = ew[dlA] = ew[puq] = ew[duq] = ew[cuq] = ew[luq] = ew[ABq] = ew[qBq] = ew[KBq] = ew[YBq] = !0;
    ew[Fuq] = ew[plA] = ew[iuq] = !1;
    xn1 = In1
})
// @from(Ln 3202, Col 0)
function HBq(A) {
    return xn1(A, zBq | wBq)
}
// @from(Ln 3205, Col 4)
zBq = 1
// @from(Ln 3206, Col 4)
wBq = 4
// @from(Ln 3207, Col 4)
clA
// @from(Ln 3208, Col 4)
llA = v(() => {
    fR6();
    clA = HBq
})
// @from(Ln 3219, Col 0)
function VR6(A) {
    if (A === null) return "null";
    if (A === void 0) return "undefined";
    if (Array.isArray(A)) return `Array[${A.length}]`;
    if (typeof A === "object") return `Object{${Object.keys(A).length} keys}`;
    if (typeof A === "string") return `string(${A.length} chars)`;
    return typeof A
}
// @from(Ln 3228, Col 0)
function bn1(A, q) {
    let K = performance.now();
    try {
        return q()
    } finally {
        performance.now() - K > $Q
    }
}
// @from(Ln 3237, Col 0)
function Q1(A, q, K) {
    let Y = VR6(A);
    return bn1(`JSON.stringify(${Y})`, () => JSON.stringify(A, q, K))
}
// @from(Ln 3242, Col 0)
function nlA(A, q) {
    let K = VR6(A);
    return bn1(`structuredClone(${K})`, () => structuredClone(A, q))
}
// @from(Ln 3247, Col 0)
function X61(A) {
    let q = VR6(A);
    return bn1(`cloneDeep(${q})`, () => clA(A))
}
// @from(Ln 3252, Col 0)
function c8(A, q, K) {
    let Y = performance.now();
    try {
        if (K !== null && typeof K === "object" && "flush" in K && K.flush === !0) {
            let w = typeof K === "object" && "encoding" in K ? K.encoding : void 0,
                H = typeof K === "object" && "mode" in K ? K.mode : void 0,
                $;
            try {
                $ = $Bq(A, "w", H), ilA($, q, {
                    encoding: w ?? void 0
                }), OBq($)
            } finally {
                if ($ !== void 0) _Bq($)
            }
        } else ilA(A, q, K)
    } finally {
        performance.now() - Y > $Q
    }
}
// @from(Ln 3271, Col 4)
$Q
// @from(Ln 3271, Col 8)
_A = (A, q) => {
    let K = typeof A === "string" ? A.length : 0;
    return bn1(`JSON.parse(${K} chars)`, () => JSON.parse(A, q))
}
// @from(Ln 3275, Col 4)
m6 = v(() => {
    Z6();
    B6();
    llA();
    $Q = (() => {
        let A = process.env.CLAUDE_CODE_SLOW_OPERATION_THRESHOLD_MS;
        if (A !== void 0) {
            let q = Number(A);
            if (!Number.isNaN(q) && q >= 0) return q
        }
        return 1 / 0
    })()
})
// @from(Ln 3302, Col 0)
function tJ(A, q) {
    let K = performance.now();
    try {
        return q()
    } finally {
        performance.now() - K > $Q
    }
}
// @from(Ln 3311, Col 0)
function QH(A, q) {
    if (q.startsWith("//") || q.startsWith("\\\\")) return {
        resolvedPath: q,
        isSymlink: !1
    };
    if (!A.existsSync(q)) return {
        resolvedPath: q,
        isSymlink: !1
    };
    try {
        let K = A.lstatSync(q);
        if (K.isFIFO() || K.isSocket() || K.isCharacterDevice() || K.isBlockDevice()) return {
            resolvedPath: q,
            isSymlink: !1
        };
        let Y = A.realpathSync(q);
        return {
            resolvedPath: Y,
            isSymlink: Y !== q
        }
    } catch (K) {
        return {
            resolvedPath: q,
            isSymlink: !1
        }
    }
}
// @from(Ln 3339, Col 0)
function Rx(A, q, K) {
    let {
        resolvedPath: Y
    } = QH(A, q);
    if (K.has(Y)) return !0;
    return K.add(Y), !1
}
// @from(Ln 3347, Col 0)
function D61(A) {
    let q = A;
    if (q === "~") q = rlA().normalize("NFC");
    else if (q.startsWith("~/")) q = ul.join(rlA().normalize("NFC"), q.slice(2));
    let K = new Set,
        Y = b1();
    if (K.add(q), q.startsWith("//") || q.startsWith("\\\\")) return Array.from(K);
    try {
        let H = q,
            $ = new Set,
            O = 40;
        for (let _ = 0; _ < O; _++) {
            if ($.has(H)) break;
            if ($.add(H), !Y.existsSync(H)) break;
            let J = Y.lstatSync(H);
            if (J.isFIFO() || J.isSocket() || J.isCharacterDevice() || J.isBlockDevice()) break;
            if (!J.isSymbolicLink()) break;
            let X = Y.readlinkSync(H),
                D = ul.isAbsolute(X) ? X : ul.resolve(ul.dirname(H), X);
            K.add(D), H = D
        }
    } catch {}
    let {
        resolvedPath: z,
        isSymlink: w
    } = QH(Y, q);
    if (w && z !== q) K.add(z);
    return Array.from(K)
}
// @from(Ln 3377, Col 0)
function b1() {
    return ZBq
}
// @from(Ln 3380, Col 0)
async function* olA(A) {
    let K = await PBq(A, "r");
    try {
        let z = (await K.stat()).size,
            w = "",
            H = Buffer.alloc(4096);
        while (z > 0) {
            let $ = Math.min(4096, z);
            z -= $, await K.read(H, 0, $, z);
            let _ = (H.toString("utf8", 0, $) + w).split(`
`);
            w = _[0] || "";
            for (let J = _.length - 1; J >= 1; J--) {
                let X = _[J];
                if (X) yield X
            }
        }
        if (w) yield w
    } finally {
        await K.close()
    }
}
// @from(Ln 3402, Col 4)
WBq = !1
// @from(Ln 3403, Col 4)
GBq
// @from(Ln 3403, Col 9)
ZBq
// @from(Ln 3404, Col 4)
_8 = v(() => {
    Z6();
    m6();
    B6();
    GBq = {
        cwd() {
            return process.cwd()
        },
        existsSync(A) {
            return tJ(`existsSync(${A})`, () => D3.existsSync(A))
        },
        async stat(A) {
            return JBq(A)
        },
        async readdir(A) {
            return XBq(A, {
                withFileTypes: !0
            })
        },
        async unlink(A) {
            return DBq(A)
        },
        async rmdir(A) {
            return jBq(A)
        },
        async rm(A, q) {
            return MBq(A, q)
        },
        statSync(A) {
            return tJ(`statSync(${A})`, () => D3.statSync(A))
        },
        lstatSync(A) {
            return tJ(`lstatSync(${A})`, () => D3.lstatSync(A))
        },
        readFileSync(A, q) {
            return tJ(`readFileSync(${A})`, () => D3.readFileSync(A, {
                encoding: q.encoding
            }))
        },
        readFileBytesSync(A) {
            return tJ(`readFileBytesSync(${A})`, () => D3.readFileSync(A))
        },
        readSync(A, q) {
            return tJ(`readSync(${A}, ${q.length} bytes)`, () => {
                let K = void 0;
                try {
                    K = D3.openSync(A, "r");
                    let Y = Buffer.alloc(q.length),
                        z = D3.readSync(K, Y, 0, q.length, 0);
                    return {
                        buffer: Y,
                        bytesRead: z
                    }
                } finally {
                    if (K) D3.closeSync(K)
                }
            })
        },
        appendFileSync(A, q, K) {
            return tJ(`appendFileSync(${A}, ${q.length} chars)`, () => {
                if (!D3.existsSync(A) && K?.mode !== void 0) {
                    let Y = D3.openSync(A, "a", K.mode);
                    try {
                        D3.appendFileSync(Y, q)
                    } finally {
                        D3.closeSync(Y)
                    }
                } else D3.appendFileSync(A, q)
            })
        },
        copyFileSync(A, q) {
            return tJ(`copyFileSync(${A} → ${q})`, () => D3.copyFileSync(A, q))
        },
        unlinkSync(A) {
            return tJ(`unlinkSync(${A})`, () => D3.unlinkSync(A))
        },
        renameSync(A, q) {
            return tJ(`renameSync(${A} → ${q})`, () => D3.renameSync(A, q))
        },
        linkSync(A, q) {
            return tJ(`linkSync(${A} → ${q})`, () => D3.linkSync(A, q))
        },
        symlinkSync(A, q, K) {
            return tJ(`symlinkSync(${A} → ${q})`, () => D3.symlinkSync(A, q, K))
        },
        readlinkSync(A) {
            return tJ(`readlinkSync(${A})`, () => D3.readlinkSync(A))
        },
        realpathSync(A) {
            return tJ(`realpathSync(${A})`, () => D3.realpathSync(A).normalize("NFC"))
        },
        mkdirSync(A, q) {
            return tJ(`mkdirSync(${A})`, () => {
                if (!D3.existsSync(A)) {
                    let K = {
                        recursive: !0
                    };
                    if (q?.mode !== void 0) K.mode = q.mode;
                    D3.mkdirSync(A, K)
                }
            })
        },
        readdirSync(A) {
            return tJ(`readdirSync(${A})`, () => D3.readdirSync(A, {
                withFileTypes: !0
            }))
        },
        readdirStringSync(A) {
            return tJ(`readdirStringSync(${A})`, () => D3.readdirSync(A))
        },
        isDirEmptySync(A) {
            return tJ(`isDirEmptySync(${A})`, () => {
                return this.readdirSync(A).length === 0
            })
        },
        rmdirSync(A) {
            return tJ(`rmdirSync(${A})`, () => D3.rmdirSync(A))
        },
        rmSync(A, q) {
            return tJ(`rmSync(${A})`, () => D3.rmSync(A, q))
        },
        createWriteStream(A) {
            return D3.createWriteStream(A)
        }
    }, ZBq = GBq
})
// @from(Ln 3537, Col 0)
function O8() {
    return (process.env.CLAUDE_CONFIG_DIR ?? alA(fBq(), ".claude")).normalize("NFC")
}
// @from(Ln 3541, Col 0)
function QP() {
    return alA(O8(), "teams")
}
// @from(Ln 3545, Col 0)
function NR6(A) {
    let q = process.env.NODE_OPTIONS;
    if (!q) return !1;
    return q.split(/\s+/).includes(A)
}
// @from(Ln 3551, Col 0)
function J6(A) {
    if (!A) return !1;
    if (typeof A === "boolean") return A;
    let q = A.toLowerCase().trim();
    return ["1", "true", "yes", "on"].includes(q)
}
// @from(Ln 3558, Col 0)
function FY(A) {
    if (A === void 0) return !1;
    if (typeof A === "boolean") return !A;
    if (!A) return !1;
    let q = A.toLowerCase().trim();
    return ["0", "false", "no", "off"].includes(q)
}
// @from(Ln 3566, Col 0)
function slA(A) {
    let q = {};
    if (A)
        for (let K of A) {
            let [Y, ...z] = K.split("=");
            if (!Y || z.length === 0) throw Error(`Invalid environment variable format: ${K}, environment variables should be added as: -e KEY1=value1 -e KEY2=value2`);
            q[Y] = z.join("=")
        }
    return q
}
// @from(Ln 3577, Col 0)
function j61() {
    return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1"
}
// @from(Ln 3581, Col 0)
function KC() {
    return process.env.CLOUD_ML_REGION || "us-east5"
}
// @from(Ln 3585, Col 0)
function TR6() {
    return J6(process.env.CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR)
}
// @from(Ln 3589, Col 0)
function tlA() {
    return !1
}
// @from(Ln 3593, Col 0)
function un1(A) {
    if (A?.startsWith("claude-haiku-4-5")) return process.env.VERTEX_REGION_CLAUDE_HAIKU_4_5 || KC();
    if (A?.startsWith("claude-3-5-haiku")) return process.env.VERTEX_REGION_CLAUDE_3_5_HAIKU || KC();
    if (A?.startsWith("claude-3-5-sonnet")) return process.env.VERTEX_REGION_CLAUDE_3_5_SONNET || KC();
    if (A?.startsWith("claude-3-7-sonnet")) return process.env.VERTEX_REGION_CLAUDE_3_7_SONNET || KC();
    if (A?.startsWith("claude-opus-4-1")) return process.env.VERTEX_REGION_CLAUDE_4_1_OPUS || KC();
    if (A?.startsWith("claude-opus-4")) return process.env.VERTEX_REGION_CLAUDE_4_0_OPUS || KC();
    if (A?.startsWith("claude-sonnet-4-5")) return process.env.VERTEX_REGION_CLAUDE_4_5_SONNET || KC();
    if (A?.startsWith("claude-sonnet-4")) return process.env.VERTEX_REGION_CLAUDE_4_0_SONNET || KC();
    return KC()
}
// @from(Ln 3604, Col 4)
hA = () => {}
// @from(Ln 3606, Col 0)
function Bn1({
    writeFn: A,
    flushIntervalMs: q = 1000,
    maxBufferSize: K = 100,
    immediateMode: Y = !1
}) {
    let z = [],
        w = null;

    function H() {
        if (w) clearTimeout(w), w = null
    }

    function $() {
        if (z.length === 0) return;
        A(z.join("")), z = [], H()
    }

    function O() {
        if (!w) w = setTimeout($, q)
    }
    return {
        write(_) {
            if (Y) {
                A(_);
                return
            }
            if (z.push(_), O(), z.length >= K) $()
        },
        flush: $,
        dispose() {
            $()
        }
    }
}
// @from(Ln 3642, Col 0)
function Tq(A) {
    return vR6.add(A), () => vR6.delete(A)
}
// @from(Ln 3645, Col 0)
async function elA() {
    await Promise.all(Array.from(vR6).map((A) => A()))
}
// @from(Ln 3648, Col 4)
vR6
// @from(Ln 3649, Col 4)
Tz = v(() => {
    vR6 = new Set
})
// @from(Ln 3657, Col 0)
function NBq(A) {
    if (typeof process > "u" || typeof process.versions > "u" || typeof process.versions.node > "u") return !1;
    let q = VBq();
    return rpA(A, q)
}
// @from(Ln 3663, Col 0)
function YiA(A) {
    KiA = A
}
// @from(Ln 3667, Col 0)
function TBq() {
    if (!mn1) mn1 = Bn1({
        writeFn: (A) => {
            let q = M61();
            if (!b1().existsSync(ER6(q))) b1().mkdirSync(ER6(q));
            b1().appendFileSync(q, A), vBq()
        },
        flushIntervalMs: 1000,
        maxBufferSize: 100,
        immediateMode: Y21()
    }), Tq(async () => mn1?.dispose());
    return mn1
}
// @from(Ln 3681, Col 0)
function h(A, {
    level: q
} = {
    level: "debug"
}) {
    if (!NBq(A)) return;
    if (KiA && A.includes(`
`)) A = Q1(A);
    let Y = `${new Date().toISOString()} [${q.toUpperCase()}] ${A.trim()}
`;
    if (yx()) {
        yl(Y);
        return
    }
    TBq().write(Y)
}
// @from(Ln 3698, Col 0)
function M61() {
    return qiA() ?? process.env.CLAUDE_CODE_DEBUG_LOGS_DIR ?? AiA(O8(), "debug", `${U6()}.txt`)
}
// @from(Ln 3702, Col 0)
function Yk(A, q) {
    return
}
// @from(Ln 3705, Col 4)
Y21
// @from(Ln 3705, Col 9)
VBq
// @from(Ln 3705, Col 14)
yx
// @from(Ln 3705, Col 18)
qiA
// @from(Ln 3705, Col 23)
KiA = !1
// @from(Ln 3706, Col 4)
mn1 = null
// @from(Ln 3707, Col 4)
vBq
// @from(Ln 3708, Col 4)
Z6 = v(() => {
    zq();
    opA();
    _8();
    hA();
    B6();
    Tz();
    m6();
    Y21 = KA(() => {
        return J6(process.env.DEBUG) || J6(process.env.DEBUG_SDK) || process.argv.includes("--debug") || process.argv.includes("-d") || yx() || process.argv.some((A) => A.startsWith("--debug=")) || qiA() !== null
    }), VBq = KA(() => {
        let A = process.argv.find((K) => K.startsWith("--debug="));
        if (!A) return null;
        let q = A.substring(8);
        return npA(q)
    }), yx = KA(() => {
        return process.argv.includes("--debug-to-stderr") || process.argv.includes("-d2e")
    }), qiA = KA(() => {
        for (let A = 0; A < process.argv.length; A++) {
            let q = process.argv[A];
            if (q.startsWith("--debug-file=")) return q.substring(13);
            if (q === "--debug-file" && A + 1 < process.argv.length) return process.argv[A + 1]
        }
        return null
    });
    vBq = KA(() => {
        if (process.argv[2] === "--ripgrep") return;
        try {
            let A = M61(),
                q = ER6(A),
                K = AiA(q, "latest");
            if (!b1().existsSync(q)) b1().mkdirSync(q);
            if (b1().existsSync(K)) try {
                b1().unlinkSync(K)
            } catch {}
            b1().symlinkSync(A, K)
        } catch {}
    })
})
// @from(Ln 3748, Col 0)
function ziA(A) {
    if (Bl !== null) throw Error("Analytics sink already attached - cannot attach more than once");
    if (Bl = A, VN1.length > 0) {
        let q = [...VN1];
        VN1.length = 0, queueMicrotask(() => {
            for (let K of q)
                if (K.async) Bl.logEventAsync(K.eventName, K.metadata);
                else Bl.logEvent(K.eventName, K.metadata)
        })
    }
}
// @from(Ln 3760, Col 0)
function c(A, q) {
    if (Bl === null) {
        VN1.push({
            eventName: A,
            metadata: q,
            async: !1
        });
        return
    }
    Bl.logEvent(A, q)
}
// @from(Ln 3771, Col 0)
async function ml(A, q) {
    if (Bl === null) {
        VN1.push({
            eventName: A,
            metadata: q,
            async: !0
        });
        return
    }
    await Bl.logEventAsync(A, q)
}
// @from(Ln 3782, Col 4)
VN1
// @from(Ln 3782, Col 9)
Bl = null
// @from(Ln 3783, Col 4)
u6 = v(() => {
    VN1 = []
})
// @from(Ln 3786, Col 4)
XiA = {}
// @from(Ln 3800, Col 0)
function yR6() {
    if (!kR6) kR6 = h1("perf_hooks").performance;
    return kR6
}
// @from(Ln 3805, Col 0)
function EK(A) {
    if (!RR6) return;
    if (yR6().mark(A), NN1) OiA.set(A, process.memoryUsage())
}
// @from(Ln 3810, Col 0)
function LR6(A) {
    return A.toFixed(3)
}
// @from(Ln 3814, Col 0)
function wiA(A) {
    return (A / 1024 / 1024).toFixed(2)
}
// @from(Ln 3818, Col 0)
function HiA() {
    if (!NN1) return "Startup profiling not enabled";
    let q = yR6().getEntriesByType("mark");
    if (q.length === 0) return "No profiling checkpoints recorded";
    let K = [];
    K.push("=".repeat(80)), K.push("STARTUP PROFILING REPORT"), K.push("=".repeat(80)), K.push("");
    let Y = 0;
    for (let H of q) {
        let $ = LR6(H.startTime),
            O = LR6(H.startTime - Y),
            _ = OiA.get(H.name),
            J = _ ? ` | RSS: ${wiA(_.rss)}MB, Heap: ${wiA(_.heapUsed)}MB` : "";
        K.push(`[+${$.padStart(8)}ms] (+${O.padStart(7)}ms) ${H.name}${J}`), Y = H.startTime
    }
    let z = q[q.length - 1],
        w = LR6(z?.startTime ?? 0);
    return K.push(""), K.push(`Total startup time: ${w}ms`), K.push("=".repeat(80)), K.join(`
`)
}
// @from(Ln 3838, Col 0)
function CR6() {
    if (JiA(), NN1) {
        let A = _iA(),
            q = kBq(A),
            K = b1();
        if (!K.existsSync(q)) K.mkdirSync(q);
        c8(A, HiA(), {
            encoding: "utf8",
            flush: !0
        }), h("Startup profiling report:"), h(HiA())
    }
}
// @from(Ln 3851, Col 0)
function yBq() {
    return RR6
}
// @from(Ln 3855, Col 0)
function CBq() {
    return NN1
}
// @from(Ln 3859, Col 0)
function _iA() {
    return EBq(O8(), "startup-perf", `${U6()}.txt`)
}
// @from(Ln 3863, Col 0)
function JiA() {
    if (!$iA) return;
    let q = yR6().getEntriesByType("mark");
    if (q.length === 0) return;
    let K = new Map;
    for (let z of q) K.set(z.name, z.startTime);
    let Y = {};
    for (let [z, [w, H]] of Object.entries(RBq)) {
        let $ = K.get(w),
            O = K.get(H);
        if ($ !== void 0 && O !== void 0) Y[`${z}_ms`] = Math.round(O - $)
    }
    Y.checkpoint_count = q.length, c("tengu_startup_perf", Y)
}
// @from(Ln 3877, Col 4)
NN1
// @from(Ln 3877, Col 9)
LBq = 0.005
// @from(Ln 3878, Col 4)
$iA
// @from(Ln 3878, Col 9)
RR6
// @from(Ln 3878, Col 14)
OiA
// @from(Ln 3878, Col 19)
kR6 = null
// @from(Ln 3879, Col 4)
RBq
// @from(Ln 3880, Col 4)
Fl = v(() => {
    Z6();
    u6();
    hA();
    B6();
    _8();
    m6();
    NN1 = process.env.CLAUDE_CODE_PROFILE_STARTUP === "1", $iA = Math.random() < LBq, RR6 = NN1 || $iA, OiA = new Map;
    RBq = {
        import_time: ["cli_entry", "main_tsx_imports_loaded"],
        init_time: ["init_function_start", "init_function_end"],
        settings_time: ["eagerLoadSettings_start", "eagerLoadSettings_end"],
        total_time: ["cli_entry", "main_after_run"]
    };
    if (RR6) EK("profiler_initialized")
})