// === FILE HEADER ===
#!/usr/bin/env node
// === END FILE HEADER ===

// @from(Ln 11, Col 4)
fQq = Object.create
// @from(Ln 19, Col 0)
function ce8(A) {
    return this[A]
}
// @from(Ln 22, Col 4)
NQq
// @from(Ln 22, Col 9)
VQq
// @from(Ln 22, Col 14)
t = (A, q, K) => {
        var Y = A != null && typeof A === "object";
        if (Y) {
            var z = q ? NQq ??= new WeakMap : VQq ??= new WeakMap,
                _ = z.get(A);
            if (_) return _
        }
        K = A != null ? fQq(TQq(A)) : {};
        let w = q || !A || !A.__esModule ? Zk6(K, "default", {
            value: A,
            enumerable: !0
        }) : K;
        for (let O of Ue8(A))
            if (!de8.call(w, O)) Zk6(w, O, {
                get: ce8.bind(A, O),
                enumerable: !0
            });
        if (Y) z.set(A, w);
        return w
    }
// @from(Ln 42, Col 4)
k4 = (A) => {
        var q = (Qe8 ??= new WeakMap).get(A),
            K;
        if (q) return q;
        if (q = Zk6({}, "__esModule", {
                value: !0
            }), A && typeof A === "object" || typeof A === "function") {
            for (var Y of Ue8(A))
                if (!de8.call(q, Y)) Zk6(q, Y, {
                    get: ce8.bind(A, Y),
                    enumerable: !(K = vQq(A, Y)) || K.enumerable
                })
        }
        return Qe8.set(A, q), q
    }
// @from(Ln 57, Col 4)
Qe8
// @from(Ln 57, Col 9)
x = (A, q) => () => (q || A((q = {
        exports: {}
    }).exports, q), q.exports)
// @from(Ln 60, Col 4)
kQq = (A) => A
// @from(Ln 62, Col 0)
function EQq(A, q) {
    this[A] = kQq.bind(null, q)
}
// @from(Ln 65, Col 4)
N1 = (A, q) => {
    for (var K in q) Zk6(A, K, {
        get: q[K],
        enumerable: !0,
        configurable: !0,
        set: EQq.bind(q, K)
    })
}
// @from(Ln 73, Col 4)
E = (A, q) => () => (A && (q = A(A = 0)), q)
// @from(Ln 74, Col 4)
x6 = yQq(import.meta.url)
// @from(Ln 75, Col 4)
LQq = Symbol.dispose || Symbol.for("Symbol.dispose")
// @from(Ln 76, Col 4)
RQq = Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")
// @from(Ln 77, Col 4)
TY = (A, q, K) => {
        if (q != null) {
            if (typeof q !== "object" && typeof q !== "function") throw TypeError('Object expected to be assigned to "using" declaration');
            var Y;
            if (K) Y = q[RQq];
            if (Y === void 0) Y = q[LQq];
            if (typeof Y !== "function") throw TypeError("Object not disposable");
            A.push([K, Y, q])
        } else if (K) A.push([K]);
        return q
    }
// @from(Ln 88, Col 4)
vY = (A, q, K) => {
        var Y = typeof SuppressedError === "function" ? SuppressedError : function(w, O, $, H) {
                return H = Error($), H.name = "SuppressedError", H.error = w, H.suppressed = O, H
            },
            z = (w) => q = K ? new Y(w, q, "An error was suppressed during disposal") : (K = !0, w),
            _ = (w) => {
                while (w = A.pop()) try {
                    var O = w[1] && w[1].call(w[2]);
                    if (w[0]) return Promise.resolve(O).then(_, ($) => (z($), _()))
                } catch ($) {
                    z($)
                }
                if (K) throw q
            };
        return _()
    }
// @from(Ln 104, Col 4)
hQq
// @from(Ln 104, Col 9)
hs6
// @from(Ln 105, Col 4)
Nx1 = E(() => {
    hQq = typeof global == "object" && global && global.Object === Object && global, hs6 = hQq
})
// @from(Ln 108, Col 4)
SQq
// @from(Ln 108, Col 9)
CQq
// @from(Ln 108, Col 14)
NH
// @from(Ln 109, Col 4)
oE = E(() => {
    Nx1();
    SQq = typeof self == "object" && self && self.Object === Object && self, CQq = hs6 || SQq || Function("return this")(), NH = CQq
})
// @from(Ln 113, Col 4)
IQq
// @from(Ln 113, Col 9)
yD
// @from(Ln 114, Col 4)
p86 = E(() => {
    oE();
    IQq = NH.Symbol, yD = IQq
})
// @from(Ln 119, Col 0)
function uQq(A) {
    var q = bQq.call(A, Gk6),
        K = A[Gk6];
    try {
        A[Gk6] = void 0;
        var Y = !0
    } catch (_) {}
    var z = xQq.call(A);
    if (Y)
        if (q) A[Gk6] = K;
        else delete A[Gk6];
    return z
}
// @from(Ln 132, Col 4)
le8
// @from(Ln 132, Col 9)
bQq
// @from(Ln 132, Col 14)
xQq
// @from(Ln 132, Col 19)
Gk6
// @from(Ln 132, Col 24)
ie8
// @from(Ln 133, Col 4)
ne8 = E(() => {
    p86();
    le8 = Object.prototype, bQq = le8.hasOwnProperty, xQq = le8.toString, Gk6 = yD ? yD.toStringTag : void 0;
    ie8 = uQq
})
// @from(Ln 139, Col 0)
function gQq(A) {
    return BQq.call(A)
}
// @from(Ln 142, Col 4)
mQq
// @from(Ln 142, Col 9)
BQq
// @from(Ln 142, Col 14)
re8
// @from(Ln 143, Col 4)
oe8 = E(() => {
    mQq = Object.prototype, BQq = mQq.toString;
    re8 = gQq
})
// @from(Ln 148, Col 0)
function QQq(A) {
    if (A == null) return A === void 0 ? pQq : FQq;
    return ae8 && ae8 in Object(A) ? ie8(A) : re8(A)
}
// @from(Ln 152, Col 4)
FQq = "[object Null]"
// @from(Ln 153, Col 4)
pQq = "[object Undefined]"
// @from(Ln 154, Col 4)
ae8
// @from(Ln 154, Col 9)
wV
// @from(Ln 155, Col 4)
Q86 = E(() => {
    p86();
    ne8();
    oe8();
    ae8 = yD ? yD.toStringTag : void 0;
    wV = QQq
})
// @from(Ln 163, Col 0)
function UQq(A) {
    var q = typeof A;
    return A != null && (q == "object" || q == "function")
}
// @from(Ln 167, Col 4)
A_
// @from(Ln 168, Col 4)
AG = E(() => {
    A_ = UQq
})
// @from(Ln 172, Col 0)
function nQq(A) {
    if (!A_(A)) return !1;
    var q = wV(A);
    return q == cQq || q == lQq || q == dQq || q == iQq
}
// @from(Ln 177, Col 4)
dQq = "[object AsyncFunction]"
// @from(Ln 178, Col 4)
cQq = "[object Function]"
// @from(Ln 179, Col 4)
lQq = "[object GeneratorFunction]"
// @from(Ln 180, Col 4)
iQq = "[object Proxy]"
// @from(Ln 181, Col 4)
$w6
// @from(Ln 182, Col 4)
Ss6 = E(() => {
    Q86();
    AG();
    $w6 = nQq
})
// @from(Ln 187, Col 4)
rQq
// @from(Ln 187, Col 9)
Cs6
// @from(Ln 188, Col 4)
se8 = E(() => {
    oE();
    rQq = NH["__core-js_shared__"], Cs6 = rQq
})
// @from(Ln 193, Col 0)
function oQq(A) {
    return !!te8 && te8 in A
}
// @from(Ln 196, Col 4)
te8
// @from(Ln 196, Col 9)
ee8
// @from(Ln 197, Col 4)
A6A = E(() => {
    se8();
    te8 = function() {
        var A = /[^.]+$/.exec(Cs6 && Cs6.keys && Cs6.keys.IE_PROTO || "");
        return A ? "Symbol(src)_1." + A : ""
    }();
    ee8 = oQq
})
// @from(Ln 206, Col 0)
function tQq(A) {
    if (A != null) {
        try {
            return sQq.call(A)
        } catch (q) {}
        try {
            return A + ""
        } catch (q) {}
    }
    return ""
}
// @from(Ln 217, Col 4)
aQq
// @from(Ln 217, Col 9)
sQq
// @from(Ln 217, Col 14)
Op
// @from(Ln 218, Col 4)
Vx1 = E(() => {
    aQq = Function.prototype, sQq = aQq.toString;
    Op = tQq
})
// @from(Ln 223, Col 0)
function wUq(A) {
    if (!A_(A) || ee8(A)) return !1;
    var q = $w6(A) ? _Uq : AUq;
    return q.test(Op(A))
}
// @from(Ln 228, Col 4)
eQq
// @from(Ln 228, Col 9)
AUq
// @from(Ln 228, Col 14)
qUq
// @from(Ln 228, Col 19)
KUq
// @from(Ln 228, Col 24)
YUq
// @from(Ln 228, Col 29)
zUq
// @from(Ln 228, Col 34)
_Uq
// @from(Ln 228, Col 39)
q6A
// @from(Ln 229, Col 4)
K6A = E(() => {
    Ss6();
    A6A();
    AG();
    Vx1();
    eQq = /[\\^$.*+?()[\]{}|]/g, AUq = /^\[object .+?Constructor\]$/, qUq = Function.prototype, KUq = Object.prototype, YUq = qUq.toString, zUq = KUq.hasOwnProperty, _Uq = RegExp("^" + YUq.call(zUq).replace(eQq, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    q6A = wUq
})
// @from(Ln 238, Col 0)
function OUq(A, q) {
    return A == null ? void 0 : A[q]
}
// @from(Ln 241, Col 4)
Y6A
// @from(Ln 242, Col 4)
z6A = E(() => {
    Y6A = OUq
})
// @from(Ln 246, Col 0)
function $Uq(A, q) {
    var K = Y6A(A, q);
    return q6A(K) ? K : void 0
}
// @from(Ln 250, Col 4)
DT
// @from(Ln 251, Col 4)
Dn = E(() => {
    K6A();
    z6A();
    DT = $Uq
})
// @from(Ln 256, Col 4)
HUq
// @from(Ln 256, Col 9)
$p
// @from(Ln 257, Col 4)
fk6 = E(() => {
    Dn();
    HUq = DT(Object, "create"), $p = HUq
})
// @from(Ln 262, Col 0)
function jUq() {
    this.__data__ = $p ? $p(null) : {}, this.size = 0
}
// @from(Ln 265, Col 4)
_6A
// @from(Ln 266, Col 4)
w6A = E(() => {
    fk6();
    _6A = jUq
})
// @from(Ln 271, Col 0)
function JUq(A) {
    var q = this.has(A) && delete this.__data__[A];
    return this.size -= q ? 1 : 0, q
}
// @from(Ln 275, Col 4)
O6A
// @from(Ln 276, Col 4)
$6A = E(() => {
    O6A = JUq
})
// @from(Ln 280, Col 0)
function PUq(A) {
    var q = this.__data__;
    if ($p) {
        var K = q[A];
        return K === MUq ? void 0 : K
    }
    return XUq.call(q, A) ? q[A] : void 0
}
// @from(Ln 288, Col 4)
MUq = "__lodash_hash_undefined__"
// @from(Ln 289, Col 4)
DUq
// @from(Ln 289, Col 9)
XUq
// @from(Ln 289, Col 14)
H6A
// @from(Ln 290, Col 4)
j6A = E(() => {
    fk6();
    DUq = Object.prototype, XUq = DUq.hasOwnProperty;
    H6A = PUq
})
// @from(Ln 296, Col 0)
function GUq(A) {
    var q = this.__data__;
    return $p ? q[A] !== void 0 : ZUq.call(q, A)
}
// @from(Ln 300, Col 4)
WUq
// @from(Ln 300, Col 9)
ZUq
// @from(Ln 300, Col 14)
J6A
// @from(Ln 301, Col 4)
M6A = E(() => {
    fk6();
    WUq = Object.prototype, ZUq = WUq.hasOwnProperty;
    J6A = GUq
})
// @from(Ln 307, Col 0)
function TUq(A, q) {
    var K = this.__data__;
    return this.size += this.has(A) ? 0 : 1, K[A] = $p && q === void 0 ? fUq : q, this
}
// @from(Ln 311, Col 4)
fUq = "__lodash_hash_undefined__"
// @from(Ln 312, Col 4)
D6A
// @from(Ln 313, Col 4)
X6A = E(() => {
    fk6();
    D6A = TUq
})
// @from(Ln 318, Col 0)
function Hw6(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 327, Col 4)
kx1
// @from(Ln 328, Col 4)
P6A = E(() => {
    w6A();
    $6A();
    j6A();
    M6A();
    X6A();
    Hw6.prototype.clear = _6A;
    Hw6.prototype.delete = O6A;
    Hw6.prototype.get = H6A;
    Hw6.prototype.has = J6A;
    Hw6.prototype.set = D6A;
    kx1 = Hw6
})
// @from(Ln 342, Col 0)
function vUq() {
    this.__data__ = [], this.size = 0
}
// @from(Ln 345, Col 4)
W6A
// @from(Ln 346, Col 4)
Z6A = E(() => {
    W6A = vUq
})
// @from(Ln 350, Col 0)
function NUq(A, q) {
    return A === q || A !== A && q !== q
}
// @from(Ln 353, Col 4)
Gx
// @from(Ln 354, Col 4)
jw6 = E(() => {
    Gx = NUq
})
// @from(Ln 358, Col 0)
function VUq(A, q) {
    var K = A.length;
    while (K--)
        if (Gx(A[K][0], q)) return K;
    return -1
}
// @from(Ln 364, Col 4)
Xn
// @from(Ln 365, Col 4)
Tk6 = E(() => {
    jw6();
    Xn = VUq
})
// @from(Ln 370, Col 0)
function yUq(A) {
    var q = this.__data__,
        K = Xn(q, A);
    if (K < 0) return !1;
    var Y = q.length - 1;
    if (K == Y) q.pop();
    else EUq.call(q, K, 1);
    return --this.size, !0
}
// @from(Ln 379, Col 4)
kUq
// @from(Ln 379, Col 9)
EUq
// @from(Ln 379, Col 14)
G6A
// @from(Ln 380, Col 4)
f6A = E(() => {
    Tk6();
    kUq = Array.prototype, EUq = kUq.splice;
    G6A = yUq
})
// @from(Ln 386, Col 0)
function LUq(A) {
    var q = this.__data__,
        K = Xn(q, A);
    return K < 0 ? void 0 : q[K][1]
}
// @from(Ln 391, Col 4)
T6A
// @from(Ln 392, Col 4)
v6A = E(() => {
    Tk6();
    T6A = LUq
})
// @from(Ln 397, Col 0)
function RUq(A) {
    return Xn(this.__data__, A) > -1
}
// @from(Ln 400, Col 4)
N6A
// @from(Ln 401, Col 4)
V6A = E(() => {
    Tk6();
    N6A = RUq
})
// @from(Ln 406, Col 0)
function hUq(A, q) {
    var K = this.__data__,
        Y = Xn(K, A);
    if (Y < 0) ++this.size, K.push([A, q]);
    else K[Y][1] = q;
    return this
}
// @from(Ln 413, Col 4)
k6A
// @from(Ln 414, Col 4)
E6A = E(() => {
    Tk6();
    k6A = hUq
})
// @from(Ln 419, Col 0)
function Jw6(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 428, Col 4)
Pn
// @from(Ln 429, Col 4)
vk6 = E(() => {
    Z6A();
    f6A();
    v6A();
    V6A();
    E6A();
    Jw6.prototype.clear = W6A;
    Jw6.prototype.delete = G6A;
    Jw6.prototype.get = T6A;
    Jw6.prototype.has = N6A;
    Jw6.prototype.set = k6A;
    Pn = Jw6
})
// @from(Ln 442, Col 4)
SUq
// @from(Ln 442, Col 9)
Wn
// @from(Ln 443, Col 4)
Is6 = E(() => {
    Dn();
    oE();
    SUq = DT(NH, "Map"), Wn = SUq
})
// @from(Ln 449, Col 0)
function CUq() {
    this.size = 0, this.__data__ = {
        hash: new kx1,
        map: new(Wn || Pn),
        string: new kx1
    }
}
// @from(Ln 456, Col 4)
y6A
// @from(Ln 457, Col 4)
L6A = E(() => {
    P6A();
    vk6();
    Is6();
    y6A = CUq
})
// @from(Ln 464, Col 0)
function IUq(A) {
    var q = typeof A;
    return q == "string" || q == "number" || q == "symbol" || q == "boolean" ? A !== "__proto__" : A === null
}
// @from(Ln 468, Col 4)
R6A
// @from(Ln 469, Col 4)
h6A = E(() => {
    R6A = IUq
})
// @from(Ln 473, Col 0)
function bUq(A, q) {
    var K = A.__data__;
    return R6A(q) ? K[typeof q == "string" ? "string" : "hash"] : K.map
}
// @from(Ln 477, Col 4)
Zn
// @from(Ln 478, Col 4)
Nk6 = E(() => {
    h6A();
    Zn = bUq
})
// @from(Ln 483, Col 0)
function xUq(A) {
    var q = Zn(this, A).delete(A);
    return this.size -= q ? 1 : 0, q
}
// @from(Ln 487, Col 4)
S6A
// @from(Ln 488, Col 4)
C6A = E(() => {
    Nk6();
    S6A = xUq
})
// @from(Ln 493, Col 0)
function uUq(A) {
    return Zn(this, A).get(A)
}
// @from(Ln 496, Col 4)
I6A
// @from(Ln 497, Col 4)
b6A = E(() => {
    Nk6();
    I6A = uUq
})
// @from(Ln 502, Col 0)
function mUq(A) {
    return Zn(this, A).has(A)
}
// @from(Ln 505, Col 4)
x6A
// @from(Ln 506, Col 4)
u6A = E(() => {
    Nk6();
    x6A = mUq
})
// @from(Ln 511, Col 0)
function BUq(A, q) {
    var K = Zn(this, A),
        Y = K.size;
    return K.set(A, q), this.size += K.size == Y ? 0 : 1, this
}
// @from(Ln 516, Col 4)
m6A
// @from(Ln 517, Col 4)
B6A = E(() => {
    Nk6();
    m6A = BUq
})
// @from(Ln 522, Col 0)
function Mw6(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 531, Col 4)
U86
// @from(Ln 532, Col 4)
bs6 = E(() => {
    L6A();
    C6A();
    b6A();
    u6A();
    B6A();
    Mw6.prototype.clear = y6A;
    Mw6.prototype.delete = S6A;
    Mw6.prototype.get = I6A;
    Mw6.prototype.has = x6A;
    Mw6.prototype.set = m6A;
    U86 = Mw6
})
// @from(Ln 546, Col 0)
function Ex1(A, q) {
    if (typeof A != "function" || q != null && typeof q != "function") throw TypeError(gUq);
    var K = function() {
        var Y = arguments,
            z = q ? q.apply(this, Y) : Y[0],
            _ = K.cache;
        if (_.has(z)) return _.get(z);
        var w = A.apply(this, Y);
        return K.cache = _.set(z, w) || _, w
    };
    return K.cache = new(Ex1.Cache || U86), K
}
// @from(Ln 558, Col 4)
gUq = "Expected a function"
// @from(Ln 559, Col 4)
e1
// @from(Ln 560, Col 4)
U4 = E(() => {
    bs6();
    Ex1.Cache = U86;
    e1 = Ex1
})
// @from(Ln 566, Col 0)
function g6A(A) {
    return (q) => {
        if (q.code === "EPIPE") A.destroy()
    }
}
// @from(Ln 572, Col 0)
function F6A() {
    process.stdout.on("error", g6A(process.stdout)), process.stderr.on("error", g6A(process.stderr))
}
// @from(Ln 576, Col 0)
function p6A(A, q) {
    if (A.destroyed) return;
    A.write(q)
}
// @from(Ln 581, Col 0)
function Z4(A) {
    p6A(process.stdout, A)
}
// @from(Ln 585, Col 0)
function Gn(A) {
    p6A(process.stderr, A)
}
// @from(Ln 589, Col 0)
function FUq(A) {
    let q = [],
        K = A.match(/^MCP server ["']([^"']+)["']/);
    if (K && K[1]) q.push("mcp"), q.push(K[1].toLowerCase());
    else {
        let _ = A.match(/^([^:[]+):/);
        if (_ && _[1]) q.push(_[1].trim().toLowerCase())
    }
    let Y = A.match(/^\[([^\]]+)]/);
    if (Y && Y[1]) q.push(Y[1].trim().toLowerCase());
    if (A.toLowerCase().includes("1p event:")) q.push("1p");
    let z = A.match(/:\s*([^:]+?)(?:\s+(?:type|mode|status|event))?:/);
    if (z && z[1]) {
        let _ = z[1].trim().toLowerCase();
        if (_.length < 30 && !_.includes(" ")) q.push(_)
    }
    return Array.from(new Set(q))
}
// @from(Ln 608, Col 0)
function pUq(A, q) {
    if (!q) return !0;
    if (A.length === 0) return !1;
    if (q.isExclusive) return !A.some((K) => q.exclude.includes(K));
    else return A.some((K) => q.include.includes(K))
}
// @from(Ln 615, Col 0)
function U6A(A, q) {
    if (!q) return !0;
    let K = FUq(A);
    return pUq(K, q)
}
// @from(Ln 620, Col 4)
Q6A
// @from(Ln 621, Col 4)
d6A = E(() => {
    U4();
    Q6A = e1((A) => {
        if (!A || A.trim() === "") return null;
        let q = A.split(",").map((_) => _.trim()).filter(Boolean);
        if (q.length === 0) return null;
        let K = q.some((_) => _.startsWith("!")),
            Y = q.some((_) => !_.startsWith("!"));
        if (K && Y) return null;
        let z = q.map((_) => _.replace(/^!/, "").toLowerCase());
        return {
            include: K ? [] : z,
            exclude: K ? z : [],
            isExclusive: K
        }
    })
})
// @from(Ln 641, Col 4)
c6A = () => {}
// @from(Ln 643, Col 0)
function QUq() {
    this.__data__ = new Pn, this.size = 0
}
// @from(Ln 646, Col 4)
l6A
// @from(Ln 647, Col 4)
i6A = E(() => {
    vk6();
    l6A = QUq
})
// @from(Ln 652, Col 0)
function UUq(A) {
    var q = this.__data__,
        K = q.delete(A);
    return this.size = q.size, K
}
// @from(Ln 657, Col 4)
n6A
// @from(Ln 658, Col 4)
r6A = E(() => {
    n6A = UUq
})
// @from(Ln 662, Col 0)
function dUq(A) {
    return this.__data__.get(A)
}
// @from(Ln 665, Col 4)
o6A
// @from(Ln 666, Col 4)
a6A = E(() => {
    o6A = dUq
})
// @from(Ln 670, Col 0)
function cUq(A) {
    return this.__data__.has(A)
}
// @from(Ln 673, Col 4)
s6A
// @from(Ln 674, Col 4)
t6A = E(() => {
    s6A = cUq
})
// @from(Ln 678, Col 0)
function iUq(A, q) {
    var K = this.__data__;
    if (K instanceof Pn) {
        var Y = K.__data__;
        if (!Wn || Y.length < lUq - 1) return Y.push([A, q]), this.size = ++K.size, this;
        K = this.__data__ = new U86(Y)
    }
    return K.set(A, q), this.size = K.size, this
}
// @from(Ln 687, Col 4)
lUq = 200
// @from(Ln 688, Col 4)
e6A
// @from(Ln 689, Col 4)
A1A = E(() => {
    vk6();
    Is6();
    bs6();
    e6A = iUq
})
// @from(Ln 696, Col 0)
function Dw6(A) {
    var q = this.__data__ = new Pn(A);
    this.size = q.size
}
// @from(Ln 700, Col 4)
fx
// @from(Ln 701, Col 4)
Vk6 = E(() => {
    vk6();
    i6A();
    r6A();
    a6A();
    t6A();
    A1A();
    Dw6.prototype.clear = l6A;
    Dw6.prototype.delete = n6A;
    Dw6.prototype.get = o6A;
    Dw6.prototype.has = s6A;
    Dw6.prototype.set = e6A;
    fx = Dw6
})
// @from(Ln 716, Col 0)
function rUq(A) {
    return this.__data__.set(A, nUq), this
}
// @from(Ln 719, Col 4)
nUq = "__lodash_hash_undefined__"
// @from(Ln 720, Col 4)
q1A
// @from(Ln 721, Col 4)
K1A = E(() => {
    q1A = rUq
})
// @from(Ln 725, Col 0)
function oUq(A) {
    return this.__data__.has(A)
}
// @from(Ln 728, Col 4)
Y1A
// @from(Ln 729, Col 4)
z1A = E(() => {
    Y1A = oUq
})
// @from(Ln 733, Col 0)
function xs6(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.__data__ = new U86;
    while (++q < K) this.add(A[q])
}
// @from(Ln 739, Col 4)
us6
// @from(Ln 740, Col 4)
Lx1 = E(() => {
    bs6();
    K1A();
    z1A();
    xs6.prototype.add = xs6.prototype.push = q1A;
    xs6.prototype.has = Y1A;
    us6 = xs6
})
// @from(Ln 749, Col 0)
function aUq(A, q) {
    var K = -1,
        Y = A == null ? 0 : A.length;
    while (++K < Y)
        if (q(A[K], K, A)) return !0;
    return !1
}
// @from(Ln 756, Col 4)
_1A
// @from(Ln 757, Col 4)
w1A = E(() => {
    _1A = aUq
})
// @from(Ln 761, Col 0)
function sUq(A, q) {
    return A.has(q)
}
// @from(Ln 764, Col 4)
ms6
// @from(Ln 765, Col 4)
Rx1 = E(() => {
    ms6 = sUq
})
// @from(Ln 769, Col 0)
function Adq(A, q, K, Y, z, _) {
    var w = K & tUq,
        O = A.length,
        $ = q.length;
    if (O != $ && !(w && $ > O)) return !1;
    var H = _.get(A),
        j = _.get(q);
    if (H && j) return H == q && j == A;
    var J = -1,
        M = !0,
        D = K & eUq ? new us6 : void 0;
    _.set(A, q), _.set(q, A);
    while (++J < O) {
        var X = A[J],
            P = q[J];
        if (Y) var W = w ? Y(P, X, J, q, A, _) : Y(X, P, J, A, q, _);
        if (W !== void 0) {
            if (W) continue;
            M = !1;
            break
        }
        if (D) {
            if (!_1A(q, function(Z, G) {
                    if (!ms6(D, G) && (X === Z || z(X, Z, K, Y, _))) return D.push(G)
                })) {
                M = !1;
                break
            }
        } else if (!(X === P || z(X, P, K, Y, _))) {
            M = !1;
            break
        }
    }
    return _.delete(A), _.delete(q), M
}
// @from(Ln 804, Col 4)
tUq = 1
// @from(Ln 805, Col 4)
eUq = 2
// @from(Ln 806, Col 4)
Bs6
// @from(Ln 807, Col 4)
hx1 = E(() => {
    Lx1();
    w1A();
    Rx1();
    Bs6 = Adq
})
// @from(Ln 813, Col 4)
qdq
// @from(Ln 813, Col 9)
Xw6
// @from(Ln 814, Col 4)
Sx1 = E(() => {
    oE();
    qdq = NH.Uint8Array, Xw6 = qdq
})
// @from(Ln 819, Col 0)
function Kdq(A) {
    var q = -1,
        K = Array(A.size);
    return A.forEach(function(Y, z) {
        K[++q] = [z, Y]
    }), K
}
// @from(Ln 826, Col 4)
O1A
// @from(Ln 827, Col 4)
$1A = E(() => {
    O1A = Kdq
})
// @from(Ln 831, Col 0)
function Ydq(A) {
    var q = -1,
        K = Array(A.size);
    return A.forEach(function(Y) {
        K[++q] = Y
    }), K
}
// @from(Ln 838, Col 4)
Pw6
// @from(Ln 839, Col 4)
gs6 = E(() => {
    Pw6 = Ydq
})
// @from(Ln 843, Col 0)
function Zdq(A, q, K, Y, z, _, w) {
    switch (K) {
        case Wdq:
            if (A.byteLength != q.byteLength || A.byteOffset != q.byteOffset) return !1;
            A = A.buffer, q = q.buffer;
        case Pdq:
            if (A.byteLength != q.byteLength || !_(new Xw6(A), new Xw6(q))) return !1;
            return !0;
        case wdq:
        case Odq:
        case jdq:
            return Gx(+A, +q);
        case $dq:
            return A.name == q.name && A.message == q.message;
        case Jdq:
        case Ddq:
            return A == q + "";
        case Hdq:
            var O = O1A;
        case Mdq:
            var $ = Y & zdq;
            if (O || (O = Pw6), A.size != q.size && !$) return !1;
            var H = w.get(A);
            if (H) return H == q;
            Y |= _dq, w.set(A, q);
            var j = Bs6(O(A), O(q), Y, z, _, w);
            return w.delete(A), j;
        case Xdq:
            if (Cx1) return Cx1.call(A) == Cx1.call(q)
    }
    return !1
}
// @from(Ln 875, Col 4)
zdq = 1
// @from(Ln 876, Col 4)
_dq = 2
// @from(Ln 877, Col 4)
wdq = "[object Boolean]"
// @from(Ln 878, Col 4)
Odq = "[object Date]"
// @from(Ln 879, Col 4)
$dq = "[object Error]"
// @from(Ln 880, Col 4)
Hdq = "[object Map]"
// @from(Ln 881, Col 4)
jdq = "[object Number]"
// @from(Ln 882, Col 4)
Jdq = "[object RegExp]"
// @from(Ln 883, Col 4)
Mdq = "[object Set]"
// @from(Ln 884, Col 4)
Ddq = "[object String]"
// @from(Ln 885, Col 4)
Xdq = "[object Symbol]"
// @from(Ln 886, Col 4)
Pdq = "[object ArrayBuffer]"
// @from(Ln 887, Col 4)
Wdq = "[object DataView]"
// @from(Ln 888, Col 4)
H1A
// @from(Ln 888, Col 9)
Cx1
// @from(Ln 888, Col 14)
j1A
// @from(Ln 889, Col 4)
J1A = E(() => {
    p86();
    Sx1();
    jw6();
    hx1();
    $1A();
    gs6();
    H1A = yD ? yD.prototype : void 0, Cx1 = H1A ? H1A.valueOf : void 0;
    j1A = Zdq
})
// @from(Ln 900, Col 0)
function Gdq(A, q) {
    var K = -1,
        Y = q.length,
        z = A.length;
    while (++K < Y) A[z + K] = q[K];
    return A
}
// @from(Ln 907, Col 4)
Ww6
// @from(Ln 908, Col 4)
Fs6 = E(() => {
    Ww6 = Gdq
})
// @from(Ln 911, Col 4)
fdq
// @from(Ln 911, Col 9)
q_
// @from(Ln 912, Col 4)
qG = E(() => {
    fdq = Array.isArray, q_ = fdq
})
// @from(Ln 916, Col 0)
function Tdq(A, q, K) {
    var Y = q(A);
    return q_(A) ? Y : Ww6(Y, K(A))
}
// @from(Ln 920, Col 4)
ps6
// @from(Ln 921, Col 4)
Ix1 = E(() => {
    Fs6();
    qG();
    ps6 = Tdq
})
// @from(Ln 927, Col 0)
function vdq(A, q) {
    var K = -1,
        Y = A == null ? 0 : A.length,
        z = 0,
        _ = [];
    while (++K < Y) {
        var w = A[K];
        if (q(w, K, A)) _[z++] = w
    }
    return _
}
// @from(Ln 938, Col 4)
Qs6
// @from(Ln 939, Col 4)
bx1 = E(() => {
    Qs6 = vdq
})
// @from(Ln 943, Col 0)
function Ndq() {
    return []
}
// @from(Ln 946, Col 4)
Us6
// @from(Ln 947, Col 4)
xx1 = E(() => {
    Us6 = Ndq
})
// @from(Ln 950, Col 4)
Vdq
// @from(Ln 950, Col 9)
kdq
// @from(Ln 950, Col 14)
M1A
// @from(Ln 950, Col 19)
Edq
// @from(Ln 950, Col 24)
Zw6
// @from(Ln 951, Col 4)
ds6 = E(() => {
    bx1();
    xx1();
    Vdq = Object.prototype, kdq = Vdq.propertyIsEnumerable, M1A = Object.getOwnPropertySymbols, Edq = !M1A ? Us6 : function(A) {
        if (A == null) return [];
        return A = Object(A), Qs6(M1A(A), function(q) {
            return kdq.call(A, q)
        })
    }, Zw6 = Edq
})
// @from(Ln 962, Col 0)
function ydq(A, q) {
    var K = -1,
        Y = Array(A);
    while (++K < A) Y[K] = q(K);
    return Y
}
// @from(Ln 968, Col 4)
D1A
// @from(Ln 969, Col 4)
X1A = E(() => {
    D1A = ydq
})
// @from(Ln 973, Col 0)
function Ldq(A) {
    return A != null && typeof A == "object"
}
// @from(Ln 976, Col 4)
VM
// @from(Ln 977, Col 4)
Tx = E(() => {
    VM = Ldq
})
// @from(Ln 981, Col 0)
function hdq(A) {
    return VM(A) && wV(A) == Rdq
}
// @from(Ln 984, Col 4)
Rdq = "[object Arguments]"
// @from(Ln 985, Col 4)
ux1
// @from(Ln 986, Col 4)
P1A = E(() => {
    Q86();
    Tx();
    ux1 = hdq
})
// @from(Ln 991, Col 4)
W1A
// @from(Ln 991, Col 9)
Sdq
// @from(Ln 991, Col 14)
Cdq
// @from(Ln 991, Col 19)
Idq
// @from(Ln 991, Col 24)
Hp
// @from(Ln 992, Col 4)
kk6 = E(() => {
    P1A();
    Tx();
    W1A = Object.prototype, Sdq = W1A.hasOwnProperty, Cdq = W1A.propertyIsEnumerable, Idq = ux1(function() {
        return arguments
    }()) ? ux1 : function(A) {
        return VM(A) && Sdq.call(A, "callee") && !Cdq.call(A, "callee")
    }, Hp = Idq
})
// @from(Ln 1002, Col 0)
function bdq() {
    return !1
}
// @from(Ln 1005, Col 4)
Z1A
// @from(Ln 1006, Col 4)
G1A = E(() => {
    Z1A = bdq
})
// @from(Ln 1009, Col 4)
ls6 = {}
// @from(Ln 1013, Col 4)
v1A
// @from(Ln 1013, Col 9)
f1A
// @from(Ln 1013, Col 14)
xdq
// @from(Ln 1013, Col 19)
T1A
// @from(Ln 1013, Col 24)
udq
// @from(Ln 1013, Col 29)
mdq
// @from(Ln 1013, Col 34)
vx
// @from(Ln 1014, Col 4)
Ek6 = E(() => {
    oE();
    G1A();
    v1A = typeof ls6 == "object" && ls6 && !ls6.nodeType && ls6, f1A = v1A && typeof cs6 == "object" && cs6 && !cs6.nodeType && cs6, xdq = f1A && f1A.exports === v1A, T1A = xdq ? NH.Buffer : void 0, udq = T1A ? T1A.isBuffer : void 0, mdq = udq || Z1A, vx = mdq
})
// @from(Ln 1020, Col 0)
function Fdq(A, q) {
    var K = typeof A;
    return q = q == null ? Bdq : q, !!q && (K == "number" || K != "symbol" && gdq.test(A)) && (A > -1 && A % 1 == 0 && A < q)
}
// @from(Ln 1024, Col 4)
Bdq = 9007199254740991
// @from(Ln 1025, Col 4)
gdq
// @from(Ln 1025, Col 9)
fn
// @from(Ln 1026, Col 4)
yk6 = E(() => {
    gdq = /^(?:0|[1-9]\d*)$/;
    fn = Fdq
})
// @from(Ln 1031, Col 0)
function Qdq(A) {
    return typeof A == "number" && A > -1 && A % 1 == 0 && A <= pdq
}
// @from(Ln 1034, Col 4)
pdq = 9007199254740991
// @from(Ln 1035, Col 4)
Gw6
// @from(Ln 1036, Col 4)
is6 = E(() => {
    Gw6 = Qdq
})
// @from(Ln 1040, Col 0)
function Mcq(A) {
    return VM(A) && Gw6(A.length) && !!AO[wV(A)]
}
// @from(Ln 1043, Col 4)
Udq = "[object Arguments]"
// @from(Ln 1044, Col 4)
ddq = "[object Array]"
// @from(Ln 1045, Col 4)
cdq = "[object Boolean]"
// @from(Ln 1046, Col 4)
ldq = "[object Date]"
// @from(Ln 1047, Col 4)
idq = "[object Error]"
// @from(Ln 1048, Col 4)
ndq = "[object Function]"
// @from(Ln 1049, Col 4)
rdq = "[object Map]"
// @from(Ln 1050, Col 4)
odq = "[object Number]"
// @from(Ln 1051, Col 4)
adq = "[object Object]"
// @from(Ln 1052, Col 4)
sdq = "[object RegExp]"
// @from(Ln 1053, Col 4)
tdq = "[object Set]"
// @from(Ln 1054, Col 4)
edq = "[object String]"
// @from(Ln 1055, Col 4)
Acq = "[object WeakMap]"
// @from(Ln 1056, Col 4)
qcq = "[object ArrayBuffer]"
// @from(Ln 1057, Col 4)
Kcq = "[object DataView]"
// @from(Ln 1058, Col 4)
Ycq = "[object Float32Array]"
// @from(Ln 1059, Col 4)
zcq = "[object Float64Array]"
// @from(Ln 1060, Col 4)
_cq = "[object Int8Array]"
// @from(Ln 1061, Col 4)
wcq = "[object Int16Array]"
// @from(Ln 1062, Col 4)
Ocq = "[object Int32Array]"
// @from(Ln 1063, Col 4)
$cq = "[object Uint8Array]"
// @from(Ln 1064, Col 4)
Hcq = "[object Uint8ClampedArray]"
// @from(Ln 1065, Col 4)
jcq = "[object Uint16Array]"
// @from(Ln 1066, Col 4)
Jcq = "[object Uint32Array]"
// @from(Ln 1067, Col 4)
AO
// @from(Ln 1067, Col 8)
N1A
// @from(Ln 1068, Col 4)
V1A = E(() => {
    Q86();
    is6();
    Tx();
    AO = {};
    AO[Ycq] = AO[zcq] = AO[_cq] = AO[wcq] = AO[Ocq] = AO[$cq] = AO[Hcq] = AO[jcq] = AO[Jcq] = !0;
    AO[Udq] = AO[ddq] = AO[qcq] = AO[cdq] = AO[Kcq] = AO[ldq] = AO[idq] = AO[ndq] = AO[rdq] = AO[odq] = AO[adq] = AO[sdq] = AO[tdq] = AO[edq] = AO[Acq] = !1;
    N1A = Mcq
})
// @from(Ln 1078, Col 0)
function Dcq(A) {
    return function(q) {
        return A(q)
    }
}
// @from(Ln 1083, Col 4)
fw6
// @from(Ln 1084, Col 4)
ns6 = E(() => {
    fw6 = Dcq
})
// @from(Ln 1087, Col 4)
os6 = {}
// @from(Ln 1091, Col 4)
k1A
// @from(Ln 1091, Col 9)
Lk6
// @from(Ln 1091, Col 14)
Xcq
// @from(Ln 1091, Col 19)
mx1
// @from(Ln 1091, Col 24)
Pcq
// @from(Ln 1091, Col 29)
Nx
// @from(Ln 1092, Col 4)
as6 = E(() => {
    Nx1();
    k1A = typeof os6 == "object" && os6 && !os6.nodeType && os6, Lk6 = k1A && typeof rs6 == "object" && rs6 && !rs6.nodeType && rs6, Xcq = Lk6 && Lk6.exports === k1A, mx1 = Xcq && hs6.process, Pcq = function() {
        try {
            var A = Lk6 && Lk6.require && Lk6.require("util").types;
            if (A) return A;
            return mx1 && mx1.binding && mx1.binding("util")
        } catch (q) {}
    }(), Nx = Pcq
})
// @from(Ln 1102, Col 4)
E1A
// @from(Ln 1102, Col 9)
Wcq
// @from(Ln 1102, Col 14)
Tw6
// @from(Ln 1103, Col 4)
ss6 = E(() => {
    V1A();
    ns6();
    as6();
    E1A = Nx && Nx.isTypedArray, Wcq = E1A ? fw6(E1A) : N1A, Tw6 = Wcq
})
// @from(Ln 1110, Col 0)
function fcq(A, q) {
    var K = q_(A),
        Y = !K && Hp(A),
        z = !K && !Y && vx(A),
        _ = !K && !Y && !z && Tw6(A),
        w = K || Y || z || _,
        O = w ? D1A(A.length, String) : [],
        $ = O.length;
    for (var H in A)
        if ((q || Gcq.call(A, H)) && !(w && (H == "length" || z && (H == "offset" || H == "parent") || _ && (H == "buffer" || H == "byteLength" || H == "byteOffset") || fn(H, $)))) O.push(H);
    return O
}
// @from(Ln 1122, Col 4)
Zcq
// @from(Ln 1122, Col 9)
Gcq
// @from(Ln 1122, Col 14)
ts6
// @from(Ln 1123, Col 4)
Bx1 = E(() => {
    X1A();
    kk6();
    qG();
    Ek6();
    yk6();
    ss6();
    Zcq = Object.prototype, Gcq = Zcq.hasOwnProperty;
    ts6 = fcq
})
// @from(Ln 1134, Col 0)
function vcq(A) {
    var q = A && A.constructor,
        K = typeof q == "function" && q.prototype || Tcq;
    return A === K
}
// @from(Ln 1139, Col 4)
Tcq
// @from(Ln 1139, Col 9)
vw6
// @from(Ln 1140, Col 4)
es6 = E(() => {
    Tcq = Object.prototype;
    vw6 = vcq
})
// @from(Ln 1145, Col 0)
function Ncq(A, q) {
    return function(K) {
        return A(q(K))
    }
}
// @from(Ln 1150, Col 4)
At6
// @from(Ln 1151, Col 4)
gx1 = E(() => {
    At6 = Ncq
})
// @from(Ln 1154, Col 4)
Vcq
// @from(Ln 1154, Col 9)
y1A
// @from(Ln 1155, Col 4)
L1A = E(() => {
    gx1();
    Vcq = At6(Object.keys, Object), y1A = Vcq
})
// @from(Ln 1160, Col 0)
function ycq(A) {
    if (!vw6(A)) return y1A(A);
    var q = [];
    for (var K in Object(A))
        if (Ecq.call(A, K) && K != "constructor") q.push(K);
    return q
}
// @from(Ln 1167, Col 4)
kcq
// @from(Ln 1167, Col 9)
Ecq
// @from(Ln 1167, Col 14)
R1A
// @from(Ln 1168, Col 4)
h1A = E(() => {
    es6();
    L1A();
    kcq = Object.prototype, Ecq = kcq.hasOwnProperty;
    R1A = ycq
})
// @from(Ln 1175, Col 0)
function Lcq(A) {
    return A != null && Gw6(A.length) && !$w6(A)
}
// @from(Ln 1178, Col 4)
Vx
// @from(Ln 1179, Col 4)
Nw6 = E(() => {
    Ss6();
    is6();
    Vx = Lcq
})
// @from(Ln 1185, Col 0)
function Rcq(A) {
    return Vx(A) ? ts6(A) : R1A(A)
}
// @from(Ln 1188, Col 4)
aE
// @from(Ln 1189, Col 4)
d86 = E(() => {
    Bx1();
    h1A();
    Nw6();
    aE = Rcq
})
// @from(Ln 1196, Col 0)
function hcq(A) {
    return ps6(A, aE, Zw6)
}
// @from(Ln 1199, Col 4)
Rk6
// @from(Ln 1200, Col 4)
Fx1 = E(() => {
    Ix1();
    ds6();
    d86();
    Rk6 = hcq
})
// @from(Ln 1207, Col 0)
function bcq(A, q, K, Y, z, _) {
    var w = K & Scq,
        O = Rk6(A),
        $ = O.length,
        H = Rk6(q),
        j = H.length;
    if ($ != j && !w) return !1;
    var J = $;
    while (J--) {
        var M = O[J];
        if (!(w ? M in q : Icq.call(q, M))) return !1
    }
    var D = _.get(A),
        X = _.get(q);
    if (D && X) return D == q && X == A;
    var P = !0;
    _.set(A, q), _.set(q, A);
    var W = w;
    while (++J < $) {
        M = O[J];
        var Z = A[M],
            G = q[M];
        if (Y) var f = w ? Y(G, Z, M, q, A, _) : Y(Z, G, M, A, q, _);
        if (!(f === void 0 ? Z === G || z(Z, G, K, Y, _) : f)) {
            P = !1;
            break
        }
        W || (W = M == "constructor")
    }
    if (P && !W) {
        var v = A.constructor,
            N = q.constructor;
        if (v != N && (("constructor" in A) && ("constructor" in q)) && !(typeof v == "function" && v instanceof v && typeof N == "function" && N instanceof N)) P = !1
    }
    return _.delete(A), _.delete(q), P
}
// @from(Ln 1243, Col 4)
Scq = 1
// @from(Ln 1244, Col 4)
Ccq
// @from(Ln 1244, Col 9)
Icq
// @from(Ln 1244, Col 14)
S1A
// @from(Ln 1245, Col 4)
C1A = E(() => {
    Fx1();
    Ccq = Object.prototype, Icq = Ccq.hasOwnProperty;
    S1A = bcq
})
// @from(Ln 1250, Col 4)
xcq
// @from(Ln 1250, Col 9)
qt6
// @from(Ln 1251, Col 4)
I1A = E(() => {
    Dn();
    oE();
    xcq = DT(NH, "DataView"), qt6 = xcq
})
// @from(Ln 1256, Col 4)
ucq
// @from(Ln 1256, Col 9)
Kt6
// @from(Ln 1257, Col 4)
b1A = E(() => {
    Dn();
    oE();
    ucq = DT(NH, "Promise"), Kt6 = ucq
})
// @from(Ln 1262, Col 4)
mcq
// @from(Ln 1262, Col 9)
Tn
// @from(Ln 1263, Col 4)
px1 = E(() => {
    Dn();
    oE();
    mcq = DT(NH, "Set"), Tn = mcq
})
// @from(Ln 1268, Col 4)
Bcq
// @from(Ln 1268, Col 9)
Yt6
// @from(Ln 1269, Col 4)
x1A = E(() => {
    Dn();
    oE();
    Bcq = DT(NH, "WeakMap"), Yt6 = Bcq
})
// @from(Ln 1274, Col 4)
u1A = "[object Map]"
// @from(Ln 1275, Col 4)
gcq = "[object Object]"
// @from(Ln 1276, Col 4)
m1A = "[object Promise]"
// @from(Ln 1277, Col 4)
B1A = "[object Set]"
// @from(Ln 1278, Col 4)
g1A = "[object WeakMap]"
// @from(Ln 1279, Col 4)
F1A = "[object DataView]"
// @from(Ln 1280, Col 4)
Fcq
// @from(Ln 1280, Col 9)
pcq
// @from(Ln 1280, Col 14)
Qcq
// @from(Ln 1280, Col 19)
Ucq
// @from(Ln 1280, Col 24)
dcq
// @from(Ln 1280, Col 29)
c86
// @from(Ln 1280, Col 34)
jp
// @from(Ln 1281, Col 4)
hk6 = E(() => {
    I1A();
    Is6();
    b1A();
    px1();
    x1A();
    Q86();
    Vx1();
    Fcq = Op(qt6), pcq = Op(Wn), Qcq = Op(Kt6), Ucq = Op(Tn), dcq = Op(Yt6), c86 = wV;
    if (qt6 && c86(new qt6(new ArrayBuffer(1))) != F1A || Wn && c86(new Wn) != u1A || Kt6 && c86(Kt6.resolve()) != m1A || Tn && c86(new Tn) != B1A || Yt6 && c86(new Yt6) != g1A) c86 = function(A) {
        var q = wV(A),
            K = q == gcq ? A.constructor : void 0,
            Y = K ? Op(K) : "";
        if (Y) switch (Y) {
            case Fcq:
                return F1A;
            case pcq:
                return u1A;
            case Qcq:
                return m1A;
            case Ucq:
                return B1A;
            case dcq:
                return g1A
        }
        return q
    };
    jp = c86
})
// @from(Ln 1311, Col 0)
function icq(A, q, K, Y, z, _) {
    var w = q_(A),
        O = q_(q),
        $ = w ? Q1A : jp(A),
        H = O ? Q1A : jp(q);
    $ = $ == p1A ? zt6 : $, H = H == p1A ? zt6 : H;
    var j = $ == zt6,
        J = H == zt6,
        M = $ == H;
    if (M && vx(A)) {
        if (!vx(q)) return !1;
        w = !0, j = !1
    }
    if (M && !j) return _ || (_ = new fx), w || Tw6(A) ? Bs6(A, q, K, Y, z, _) : j1A(A, q, $, K, Y, z, _);
    if (!(K & ccq)) {
        var D = j && U1A.call(A, "__wrapped__"),
            X = J && U1A.call(q, "__wrapped__");
        if (D || X) {
            var P = D ? A.value() : A,
                W = X ? q.value() : q;
            return _ || (_ = new fx), z(P, W, K, Y, _)
        }
    }
    if (!M) return !1;
    return _ || (_ = new fx), S1A(A, q, K, Y, z, _)
}
// @from(Ln 1337, Col 4)
ccq = 1
// @from(Ln 1338, Col 4)
p1A = "[object Arguments]"
// @from(Ln 1339, Col 4)
Q1A = "[object Array]"
// @from(Ln 1340, Col 4)
zt6 = "[object Object]"
// @from(Ln 1341, Col 4)
lcq
// @from(Ln 1341, Col 9)
U1A
// @from(Ln 1341, Col 14)
d1A
// @from(Ln 1342, Col 4)
c1A = E(() => {
    Vk6();
    hx1();
    J1A();
    C1A();
    hk6();
    qG();
    Ek6();
    ss6();
    lcq = Object.prototype, U1A = lcq.hasOwnProperty;
    d1A = icq
})
// @from(Ln 1355, Col 0)
function l1A(A, q, K, Y, z) {
    if (A === q) return !0;
    if (A == null || q == null || !VM(A) && !VM(q)) return A !== A && q !== q;
    return d1A(A, q, K, Y, l1A, z)
}
// @from(Ln 1360, Col 4)
Vw6
// @from(Ln 1361, Col 4)
_t6 = E(() => {
    c1A();
    Tx();
    Vw6 = l1A
})
// @from(Ln 1367, Col 0)
function ocq(A, q, K, Y) {
    var z = K.length,
        _ = z,
        w = !Y;
    if (A == null) return !_;
    A = Object(A);
    while (z--) {
        var O = K[z];
        if (w && O[2] ? O[1] !== A[O[0]] : !(O[0] in A)) return !1
    }
    while (++z < _) {
        O = K[z];
        var $ = O[0],
            H = A[$],
            j = O[1];
        if (w && O[2]) {
            if (H === void 0 && !($ in A)) return !1
        } else {
            var J = new fx;
            if (Y) var M = Y(H, j, $, A, q, J);
            if (!(M === void 0 ? Vw6(j, H, ncq | rcq, Y, J) : M)) return !1
        }
    }
    return !0
}
// @from(Ln 1392, Col 4)
ncq = 1
// @from(Ln 1393, Col 4)
rcq = 2
// @from(Ln 1394, Col 4)
i1A
// @from(Ln 1395, Col 4)
n1A = E(() => {
    Vk6();
    _t6();
    i1A = ocq
})
// @from(Ln 1401, Col 0)
function acq(A) {
    return A === A && !A_(A)
}
// @from(Ln 1404, Col 4)
wt6
// @from(Ln 1405, Col 4)
Qx1 = E(() => {
    AG();
    wt6 = acq
})
// @from(Ln 1410, Col 0)
function scq(A) {
    var q = aE(A),
        K = q.length;
    while (K--) {
        var Y = q[K],
            z = A[Y];
        q[K] = [Y, z, wt6(z)]
    }
    return q
}
// @from(Ln 1420, Col 4)
r1A
// @from(Ln 1421, Col 4)
o1A = E(() => {
    Qx1();
    d86();
    r1A = scq
})
// @from(Ln 1427, Col 0)
function tcq(A, q) {
    return function(K) {
        if (K == null) return !1;
        return K[A] === q && (q !== void 0 || (A in Object(K)))
    }
}
// @from(Ln 1433, Col 4)
Ot6
// @from(Ln 1434, Col 4)
Ux1 = E(() => {
    Ot6 = tcq
})
// @from(Ln 1438, Col 0)
function ecq(A) {
    var q = r1A(A);
    if (q.length == 1 && q[0][2]) return Ot6(q[0][0], q[0][1]);
    return function(K) {
        return K === A || i1A(K, A, q)
    }
}
// @from(Ln 1445, Col 4)
a1A
// @from(Ln 1446, Col 4)
s1A = E(() => {
    n1A();
    o1A();
    Ux1();
    a1A = ecq
})
// @from(Ln 1453, Col 0)
function qlq(A) {
    return typeof A == "symbol" || VM(A) && wV(A) == Alq
}
// @from(Ln 1456, Col 4)
Alq = "[object Symbol]"
// @from(Ln 1457, Col 4)
vn
// @from(Ln 1458, Col 4)
Sk6 = E(() => {
    Q86();
    Tx();
    vn = qlq
})
// @from(Ln 1464, Col 0)
function zlq(A, q) {
    if (q_(A)) return !1;
    var K = typeof A;
    if (K == "number" || K == "symbol" || K == "boolean" || A == null || vn(A)) return !0;
    return Ylq.test(A) || !Klq.test(A) || q != null && A in Object(q)
}
// @from(Ln 1470, Col 4)
Klq
// @from(Ln 1470, Col 9)
Ylq
// @from(Ln 1470, Col 14)
kw6
// @from(Ln 1471, Col 4)
$t6 = E(() => {
    qG();
    Sk6();
    Klq = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Ylq = /^\w*$/;
    kw6 = zlq
})
// @from(Ln 1478, Col 0)
function wlq(A) {
    var q = e1(A, function(Y) {
            if (K.size === _lq) K.clear();
            return Y
        }),
        K = q.cache;
    return q
}
// @from(Ln 1486, Col 4)
_lq = 500
// @from(Ln 1487, Col 4)
t1A
// @from(Ln 1488, Col 4)
e1A = E(() => {
    U4();
    t1A = wlq
})
// @from(Ln 1492, Col 4)
Olq
// @from(Ln 1492, Col 9)
$lq
// @from(Ln 1492, Col 14)
Hlq
// @from(Ln 1492, Col 19)
A8A
// @from(Ln 1493, Col 4)
q8A = E(() => {
    e1A();
    Olq = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, $lq = /\\(\\)?/g, Hlq = t1A(function(A) {
        var q = [];
        if (A.charCodeAt(0) === 46) q.push("");
        return A.replace(Olq, function(K, Y, z, _) {
            q.push(z ? _.replace($lq, "$1") : Y || K)
        }), q
    }), A8A = Hlq
})
// @from(Ln 1504, Col 0)
function jlq(A, q) {
    var K = -1,
        Y = A == null ? 0 : A.length,
        z = Array(Y);
    while (++K < Y) z[K] = q(A[K], K, A);
    return z
}
// @from(Ln 1511, Col 4)
Ew6
// @from(Ln 1512, Col 4)
Ht6 = E(() => {
    Ew6 = jlq
})
// @from(Ln 1516, Col 0)
function z8A(A) {
    if (typeof A == "string") return A;
    if (q_(A)) return Ew6(A, z8A) + "";
    if (vn(A)) return Y8A ? Y8A.call(A) : "";
    var q = A + "";
    return q == "0" && 1 / A == -Jlq ? "-0" : q
}
// @from(Ln 1523, Col 4)
Jlq = 1 / 0
// @from(Ln 1524, Col 4)
K8A
// @from(Ln 1524, Col 9)
Y8A
// @from(Ln 1524, Col 14)
_8A
// @from(Ln 1525, Col 4)
w8A = E(() => {
    p86();
    Ht6();
    qG();
    Sk6();
    K8A = yD ? yD.prototype : void 0, Y8A = K8A ? K8A.toString : void 0;
    _8A = z8A
})
// @from(Ln 1534, Col 0)
function Mlq(A) {
    return A == null ? "" : _8A(A)
}
// @from(Ln 1537, Col 4)
yw6
// @from(Ln 1538, Col 4)
jt6 = E(() => {
    w8A();
    yw6 = Mlq
})
// @from(Ln 1543, Col 0)
function Dlq(A, q) {
    if (q_(A)) return A;
    return kw6(A, q) ? [A] : A8A(yw6(A))
}
// @from(Ln 1547, Col 4)
kx
// @from(Ln 1548, Col 4)
Lw6 = E(() => {
    qG();
    $t6();
    q8A();
    jt6();
    kx = Dlq
})
// @from(Ln 1556, Col 0)
function Plq(A) {
    if (typeof A == "string" || vn(A)) return A;
    var q = A + "";
    return q == "0" && 1 / A == -Xlq ? "-0" : q
}
// @from(Ln 1561, Col 4)
Xlq = 1 / 0
// @from(Ln 1562, Col 4)
sE
// @from(Ln 1563, Col 4)
l86 = E(() => {
    Sk6();
    sE = Plq
})
// @from(Ln 1568, Col 0)
function Wlq(A, q) {
    q = kx(q, A);
    var K = 0,
        Y = q.length;
    while (A != null && K < Y) A = A[sE(q[K++])];
    return K && K == Y ? A : void 0
}
// @from(Ln 1575, Col 4)
Rw6
// @from(Ln 1576, Col 4)
Jt6 = E(() => {
    Lw6();
    l86();
    Rw6 = Wlq
})
// @from(Ln 1582, Col 0)
function Zlq(A, q, K) {
    var Y = A == null ? void 0 : Rw6(A, q);
    return Y === void 0 ? K : Y
}
// @from(Ln 1586, Col 4)
O8A
// @from(Ln 1587, Col 4)
$8A = E(() => {
    Jt6();
    O8A = Zlq
})
// @from(Ln 1592, Col 0)
function Glq(A, q) {
    return A != null && q in Object(A)
}
// @from(Ln 1595, Col 4)
H8A
// @from(Ln 1596, Col 4)
j8A = E(() => {
    H8A = Glq
})
// @from(Ln 1600, Col 0)
function flq(A, q, K) {
    q = kx(q, A);
    var Y = -1,
        z = q.length,
        _ = !1;
    while (++Y < z) {
        var w = sE(q[Y]);
        if (!(_ = A != null && K(A, w))) break;
        A = A[w]
    }
    if (_ || ++Y != z) return _;
    return z = A == null ? 0 : A.length, !!z && Gw6(z) && fn(w, z) && (q_(A) || Hp(A))
}
// @from(Ln 1613, Col 4)
J8A
// @from(Ln 1614, Col 4)
M8A = E(() => {
    Lw6();
    kk6();
    qG();
    yk6();
    is6();
    l86();
    J8A = flq
})
// @from(Ln 1624, Col 0)
function Tlq(A, q) {
    return A != null && J8A(A, q, H8A)
}
// @from(Ln 1627, Col 4)
D8A
// @from(Ln 1628, Col 4)
X8A = E(() => {
    j8A();
    M8A();
    D8A = Tlq
})
// @from(Ln 1634, Col 0)
function Vlq(A, q) {
    if (kw6(A) && wt6(q)) return Ot6(sE(A), q);
    return function(K) {
        var Y = O8A(K, A);
        return Y === void 0 && Y === q ? D8A(K, A) : Vw6(q, Y, vlq | Nlq)
    }
}
// @from(Ln 1641, Col 4)
vlq = 1
// @from(Ln 1642, Col 4)
Nlq = 2
// @from(Ln 1643, Col 4)
P8A
// @from(Ln 1644, Col 4)
W8A = E(() => {
    _t6();
    $8A();
    X8A();
    $t6();
    Qx1();
    Ux1();
    l86();
    P8A = Vlq
})
// @from(Ln 1655, Col 0)
function klq(A) {
    return A
}
// @from(Ln 1658, Col 4)
hw6
// @from(Ln 1659, Col 4)
Mt6 = E(() => {
    hw6 = klq
})
// @from(Ln 1663, Col 0)
function Elq(A) {
    return function(q) {
        return q == null ? void 0 : q[A]
    }
}
// @from(Ln 1668, Col 4)
Z8A
// @from(Ln 1669, Col 4)
G8A = E(() => {
    Z8A = Elq
})
// @from(Ln 1673, Col 0)
function ylq(A) {
    return function(q) {
        return Rw6(q, A)
    }
}
// @from(Ln 1678, Col 4)
f8A
// @from(Ln 1679, Col 4)
T8A = E(() => {
    Jt6();
    f8A = ylq
})
// @from(Ln 1684, Col 0)
function Llq(A) {
    return kw6(A) ? Z8A(sE(A)) : f8A(A)
}
// @from(Ln 1687, Col 4)
v8A
// @from(Ln 1688, Col 4)
N8A = E(() => {
    G8A();
    T8A();
    $t6();
    l86();
    v8A = Llq
})
// @from(Ln 1696, Col 0)
function Rlq(A) {
    if (typeof A == "function") return A;
    if (A == null) return hw6;
    if (typeof A == "object") return q_(A) ? P8A(A[0], A[1]) : a1A(A);
    return v8A(A)
}
// @from(Ln 1702, Col 4)
Ex
// @from(Ln 1703, Col 4)
Sw6 = E(() => {
    s1A();
    W8A();
    Mt6();
    qG();
    N8A();
    Ex = Rlq
})
// @from(Ln 1712, Col 0)
function hlq(A, q) {
    var K, Y = -1,
        z = A.length;
    while (++Y < z) {
        var _ = q(A[Y]);
        if (_ !== void 0) K = K === void 0 ? _ : K + _
    }
    return K
}
// @from(Ln 1721, Col 4)
V8A
// @from(Ln 1722, Col 4)
k8A = E(() => {
    V8A = hlq
})
// @from(Ln 1726, Col 0)
function Slq(A, q) {
    return A && A.length ? V8A(A, Ex(q, 2)) : 0
}
// @from(Ln 1729, Col 4)
Cw6
// @from(Ln 1730, Col 4)
E8A = E(() => {
    Sw6();
    k8A();
    Cw6 = Slq
})
// @from(Ln 1736, Col 0)
function y8A() {
    return dx1
}
// @from(Ln 1740, Col 0)
function L8A(A) {
    dx1 = A
}
// @from(Ln 1744, Col 0)
function zP() {
    dx1 = null
}
// @from(Ln 1748, Col 0)
function Dt6() {
    return cx1
}
// @from(Ln 1752, Col 0)
function R8A(A) {
    cx1 = A
}
// @from(Ln 1756, Col 0)
function h8A() {
    cx1 = void 0
}
// @from(Ln 1759, Col 4)
dx1 = null
// @from(Ln 1760, Col 4)
cx1
// @from(Ln 1761, Col 4)
qm1 = {}
// @from(Ln 1957, Col 0)
function b8A() {
    let A = "";
    if (typeof process < "u" && typeof process.cwd === "function" && typeof S8A === "function") A = S8A(Clq()).normalize("NFC");
    return {
        originalCwd: A,
        projectRoot: A,
        totalCostUSD: 0,
        totalAPIDuration: 0,
        totalAPIDurationWithoutRetries: 0,
        totalToolDuration: 0,
        tokenSaverBytesSaved: 0,
        tokenSaverHits: 0,
        turnHookDurationMs: 0,
        turnToolDurationMs: 0,
        turnClassifierDurationMs: 0,
        turnToolCount: 0,
        turnHookCount: 0,
        turnClassifierCount: 0,
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
        kairosActive: !1,
        sdkAgentProgressSummariesEnabled: !1,
        userMsgOptIn: !1,
        clientType: "cli",
        sessionSource: void 0,
        questionPreviewFormat: void 0,
        sessionIngressToken: void 0,
        oauthTokenFromFd: void 0,
        apiKeyFromFd: void 0,
        flagSettingsPath: void 0,
        flagSettingsInline: null,
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
        statsStore: null,
        sessionId: yx1(),
        parentSessionId: void 0,
        loggerProvider: null,
        eventLogger: null,
        meterProvider: null,
        tracerProvider: null,
        agentColorMap: new Map,
        agentColorIndex: 0,
        lastAPIRequest: null,
        lastClassifierRequests: null,
        inMemoryErrorLog: [],
        inlinePlugins: [],
        chromeFlagOverride: void 0,
        useCoworkPlugins: !1,
        sessionBypassPermissionsMode: !1,
        scheduledTasksEnabled: !1,
        sessionCronTasks: [],
        sessionCreatedTeams: new Set,
        sessionTrustAccepted: !1,
        sessionPersistenceDisabled: !1,
        hasExitedPlanMode: !1,
        needsPlanModeExitAttachment: !1,
        needsAutoModeExitAttachment: !1,
        lspRecommendationShownThisSession: !1,
        initJsonSchema: null,
        registeredHooks: null,
        planSlugCache: new Map,
        teleportedSessionInfo: null,
        invokedSkills: new Map,
        slowOperations: [],
        sdkBetas: void 0,
        mainThreadAgentType: void 0,
        isRemoteMode: !1,
        isInWorktree: !1,
        ...{},
        directConnectServerUrl: void 0,
        systemPromptSectionCache: new Map,
        lastEmittedDate: null,
        additionalDirectoriesForClaudeMd: [],
        allowedChannels: [],
        sessionProjectDir: null,
        promptCache1hAllowlist: null,
        promptId: null
    }
}
// @from(Ln 2054, Col 0)
function R1() {
    return v1.sessionId
}
// @from(Ln 2058, Col 0)
function ix1(A = {}) {
    if (A.setCurrentAsParent) v1.parentSessionId = v1.sessionId;
    return v1.sessionId = yx1(), v1.sessionProjectDir = null, v1.sessionId
}
// @from(Ln 2063, Col 0)
function nx1() {
    return v1.parentSessionId
}
// @from(Ln 2067, Col 0)
function _P(A, q = null) {
    v1.sessionId = A, v1.sessionProjectDir = q
}
// @from(Ln 2071, Col 0)
function Ck6() {
    return v1.sessionProjectDir
}
// @from(Ln 2075, Col 0)
function AA() {
    return v1.originalCwd
}
// @from(Ln 2079, Col 0)
function qY() {
    return v1.projectRoot
}
// @from(Ln 2083, Col 0)
function Jp(A) {
    v1.originalCwd = A.normalize("NFC")
}
// @from(Ln 2087, Col 0)
function OS() {
    return v1.cwd
}
// @from(Ln 2091, Col 0)
function Xt6(A) {
    v1.cwd = A.normalize("NFC")
}
// @from(Ln 2095, Col 0)
function rx1() {
    return v1.directConnectServerUrl
}
// @from(Ln 2099, Col 0)
function Ilq(A) {
    v1.directConnectServerUrl = A
}
// @from(Ln 2103, Col 0)
function ox1(A, q) {
    v1.totalAPIDuration += A, v1.totalAPIDurationWithoutRetries += q
}
// @from(Ln 2107, Col 0)
function blq() {
    v1.totalAPIDuration = 0, v1.totalAPIDurationWithoutRetries = 0, v1.totalCostUSD = 0
}
// @from(Ln 2111, Col 0)
function ax1(A, q, K) {
    v1.modelUsage[K] = q, v1.totalCostUSD += A
}
// @from(Ln 2115, Col 0)
function LD() {
    return v1.totalCostUSD
}
// @from(Ln 2119, Col 0)
function OV() {
    return v1.totalAPIDuration
}
// @from(Ln 2123, Col 0)
function Iw6() {
    return Date.now() - v1.startTime
}
// @from(Ln 2127, Col 0)
function sx1() {
    return v1.totalAPIDurationWithoutRetries
}
// @from(Ln 2131, Col 0)
function tx1() {
    return v1.totalToolDuration
}
// @from(Ln 2135, Col 0)
function Pt6(A) {
    v1.totalToolDuration += A, v1.turnToolDurationMs += A, v1.turnToolCount++
}
// @from(Ln 2139, Col 0)
function xlq(A) {
    v1.tokenSaverBytesSaved += A, v1.tokenSaverHits++
}
// @from(Ln 2143, Col 0)
function ulq() {
    return v1.tokenSaverBytesSaved
}
// @from(Ln 2147, Col 0)
function mlq() {
    return v1.tokenSaverHits
}
// @from(Ln 2151, Col 0)
function Blq() {
    return v1.turnHookDurationMs
}
// @from(Ln 2155, Col 0)
function ex1(A) {
    v1.turnHookDurationMs += A, v1.turnHookCount++
}
// @from(Ln 2159, Col 0)
function Au1() {
    v1.turnHookDurationMs = 0, v1.turnHookCount = 0
}
// @from(Ln 2163, Col 0)
function glq() {
    return v1.turnHookCount
}
// @from(Ln 2167, Col 0)
function Flq() {
    return v1.turnToolDurationMs
}
// @from(Ln 2171, Col 0)
function qu1() {
    v1.turnToolDurationMs = 0, v1.turnToolCount = 0
}
// @from(Ln 2175, Col 0)
function plq() {
    return v1.turnToolCount
}
// @from(Ln 2179, Col 0)
function Qlq() {
    return v1.turnClassifierDurationMs
}
// @from(Ln 2183, Col 0)
function Ku1(A) {
    v1.turnClassifierDurationMs += A, v1.turnClassifierCount++
}
// @from(Ln 2187, Col 0)
function Yu1() {
    v1.turnClassifierDurationMs = 0, v1.turnClassifierCount = 0
}
// @from(Ln 2191, Col 0)
function Ulq() {
    return v1.turnClassifierCount
}
// @from(Ln 2195, Col 0)
function bw6() {
    return v1.statsStore
}
// @from(Ln 2199, Col 0)
function zu1(A) {
    v1.statsStore = A
}
// @from(Ln 2203, Col 0)
function i86(A) {
    if (A) x8A();
    else _u1 = !0
}
// @from(Ln 2208, Col 0)
function wu1() {
    if (_u1) x8A()
}
// @from(Ln 2212, Col 0)
function x8A() {
    v1.lastInteractionTime = Date.now(), _u1 = !1
}
// @from(Ln 2216, Col 0)
function Wt6(A, q) {
    v1.totalLinesAdded += A, v1.totalLinesRemoved += q
}
// @from(Ln 2220, Col 0)
function n86() {
    return v1.totalLinesAdded
}
// @from(Ln 2224, Col 0)
function r86() {
    return v1.totalLinesRemoved
}
// @from(Ln 2228, Col 0)
function o86() {
    return Cw6(Object.values(v1.modelUsage), "inputTokens")
}
// @from(Ln 2232, Col 0)
function Mp() {
    return Cw6(Object.values(v1.modelUsage), "outputTokens")
}
// @from(Ln 2236, Col 0)
function Ik6() {
    return Cw6(Object.values(v1.modelUsage), "cacheReadInputTokens")
}
// @from(Ln 2240, Col 0)
function bk6() {
    return Cw6(Object.values(v1.modelUsage), "cacheCreationInputTokens")
}
// @from(Ln 2244, Col 0)
function Ou1() {
    return Cw6(Object.values(v1.modelUsage), "webSearchRequests")
}
// @from(Ln 2248, Col 0)
function dlq() {
    return Mp() - $u1
}
// @from(Ln 2252, Col 0)
function clq() {
    return Hu1
}
// @from(Ln 2256, Col 0)
function llq(A) {
    $u1 = Mp(), Hu1 = A, Zt6 = 0
}
// @from(Ln 2260, Col 0)
function ilq() {
    return Zt6
}
// @from(Ln 2264, Col 0)
function nlq() {
    Zt6++
}
// @from(Ln 2268, Col 0)
function Gt6() {
    v1.hasUnknownModelCost = !0
}
// @from(Ln 2272, Col 0)
function ju1() {
    return v1.hasUnknownModelCost
}
// @from(Ln 2276, Col 0)
function yx() {
    return v1.lastInteractionTime
}
// @from(Ln 2280, Col 0)
function $S() {
    return v1.modelUsage
}
// @from(Ln 2284, Col 0)
function Ju1(A) {
    return v1.modelUsage[A]
}
// @from(Ln 2288, Col 0)
function HS() {
    return v1.mainLoopModelOverride
}
// @from(Ln 2292, Col 0)
function xw6() {
    return v1.initialMainLoopModel
}
// @from(Ln 2296, Col 0)
function MW(A) {
    v1.mainLoopModelOverride = A
}
// @from(Ln 2300, Col 0)
function Mu1(A) {
    v1.initialMainLoopModel = A
}
// @from(Ln 2304, Col 0)
function Zj() {
    return v1.sdkBetas
}
// @from(Ln 2308, Col 0)
function Du1(A) {
    v1.sdkBetas = A
}
// @from(Ln 2312, Col 0)
function uw6() {
    v1.totalCostUSD = 0, v1.totalAPIDuration = 0, v1.totalAPIDurationWithoutRetries = 0, v1.totalToolDuration = 0, v1.startTime = Date.now(), v1.totalLinesAdded = 0, v1.totalLinesRemoved = 0, v1.hasUnknownModelCost = !1, v1.modelUsage = {}, v1.promptId = null
}
// @from(Ln 2316, Col 0)
function xk6({
    totalCostUSD: A,
    totalAPIDuration: q,
    totalAPIDurationWithoutRetries: K,
    totalToolDuration: Y,
    totalLinesAdded: z,
    totalLinesRemoved: _,
    lastDuration: w,
    modelUsage: O
}) {
    if (v1.totalCostUSD = A, v1.totalAPIDuration = q, v1.totalAPIDurationWithoutRetries = K, v1.totalToolDuration = Y, v1.totalLinesAdded = z, v1.totalLinesRemoved = _, O) v1.modelUsage = O;
    if (w) v1.startTime = Date.now() - w
}
// @from(Ln 2330, Col 0)
function u8A() {
    throw Error("resetStateForTests can only be called in tests")
}
// @from(Ln 2334, Col 0)
function mw6() {
    return v1.modelStrings
}
// @from(Ln 2338, Col 0)
function uk6(A) {
    v1.modelStrings = A
}
// @from(Ln 2342, Col 0)
function rlq() {
    v1.modelStrings = null
}
// @from(Ln 2346, Col 0)
function Xu1(A, q) {
    v1.meter = A, v1.sessionCounter = q("claude_code.session.count", {
        description: "Count of CLI sessions started"
    }), v1.locCounter = q("claude_code.lines_of_code.count", {
        description: "Count of lines of code modified, with the 'type' attribute indicating whether lines were added or removed"
    }), v1.prCounter = q("claude_code.pull_request.count", {
        description: "Number of pull requests created"
    }), v1.commitCounter = q("claude_code.commit.count", {
        description: "Number of git commits created"
    }), v1.costCounter = q("claude_code.cost.usage", {
        description: "Cost of the Claude Code session",
        unit: "USD"
    }), v1.tokenCounter = q("claude_code.token.usage", {
        description: "Number of tokens used",
        unit: "tokens"
    }), v1.codeEditToolDecisionCounter = q("claude_code.code_edit_tool.decision", {
        description: "Count of code editing tool permission decisions (accept/reject) for Edit, Write, and NotebookEdit tools"
    }), v1.activeTimeCounter = q("claude_code.active_time.total", {
        description: "Total active time in seconds",
        unit: "s"
    })
}
// @from(Ln 2369, Col 0)
function olq() {
    return v1.meter
}
// @from(Ln 2373, Col 0)
function Pu1() {
    return v1.sessionCounter
}
// @from(Ln 2377, Col 0)
function ft6() {
    return v1.locCounter
}
// @from(Ln 2381, Col 0)
function mk6() {
    return v1.prCounter
}
// @from(Ln 2385, Col 0)
function Wu1() {
    return v1.commitCounter
}
// @from(Ln 2389, Col 0)
function Zu1() {
    return v1.costCounter
}
// @from(Ln 2393, Col 0)
function Bw6() {
    return v1.tokenCounter
}
// @from(Ln 2397, Col 0)
function Bk6() {
    return v1.codeEditToolDecisionCounter
}
// @from(Ln 2401, Col 0)
function Gu1() {
    return v1.activeTimeCounter
}
// @from(Ln 2405, Col 0)
function gk6() {
    return v1.loggerProvider
}
// @from(Ln 2409, Col 0)
function Tt6(A) {
    v1.loggerProvider = A
}
// @from(Ln 2413, Col 0)
function fu1() {
    return v1.eventLogger
}
// @from(Ln 2417, Col 0)
function vt6(A) {
    v1.eventLogger = A
}
// @from(Ln 2421, Col 0)
function Tu1() {
    return v1.meterProvider
}
// @from(Ln 2425, Col 0)
function Nt6(A) {
    v1.meterProvider = A
}
// @from(Ln 2429, Col 0)
function a86() {
    return v1.tracerProvider
}
// @from(Ln 2433, Col 0)
function Vt6(A) {
    v1.tracerProvider = A
}
// @from(Ln 2437, Col 0)
function q7() {
    return !v1.isInteractive
}
// @from(Ln 2441, Col 0)
function DW() {
    return v1.isInteractive
}
// @from(Ln 2445, Col 0)
function vu1(A) {
    v1.isInteractive = A
}
// @from(Ln 2449, Col 0)
function gw6() {
    return v1.clientType
}
// @from(Ln 2453, Col 0)
function Nu1(A) {
    v1.clientType = A
}
// @from(Ln 2457, Col 0)
function Nn() {
    return v1.sdkAgentProgressSummariesEnabled
}
// @from(Ln 2461, Col 0)
function Vu1(A) {
    v1.sdkAgentProgressSummariesEnabled = A
}
// @from(Ln 2465, Col 0)
function Vn() {
    return v1.kairosActive
}
// @from(Ln 2469, Col 0)
function alq(A) {
    v1.kairosActive = A
}
// @from(Ln 2473, Col 0)
function KG() {
    return v1.userMsgOptIn
}
// @from(Ln 2477, Col 0)
function Lx(A) {
    v1.userMsgOptIn = A
}
// @from(Ln 2481, Col 0)
function slq() {
    return v1.sessionSource
}
// @from(Ln 2485, Col 0)
function ku1(A) {
    v1.sessionSource = A
}
// @from(Ln 2489, Col 0)
function kt6() {
    return v1.questionPreviewFormat
}
// @from(Ln 2493, Col 0)
function Et6(A) {
    v1.questionPreviewFormat = A
}
// @from(Ln 2497, Col 0)
function yt6() {
    return v1.agentColorMap
}
// @from(Ln 2501, Col 0)
function kn() {
    return v1.flagSettingsPath
}
// @from(Ln 2505, Col 0)
function Eu1(A) {
    v1.flagSettingsPath = A
}
// @from(Ln 2509, Col 0)
function Fw6() {
    return v1.flagSettingsInline
}
// @from(Ln 2513, Col 0)
function yu1(A) {
    v1.flagSettingsInline = A
}
// @from(Ln 2517, Col 0)
function Lu1() {
    return v1.sessionIngressToken
}
// @from(Ln 2521, Col 0)
function s86(A) {
    v1.sessionIngressToken = A
}
// @from(Ln 2525, Col 0)
function Ru1() {
    return v1.oauthTokenFromFd
}
// @from(Ln 2529, Col 0)
function t86(A) {
    v1.oauthTokenFromFd = A
}
// @from(Ln 2533, Col 0)
function hu1() {
    return v1.apiKeyFromFd
}
// @from(Ln 2537, Col 0)
function e86(A) {
    v1.apiKeyFromFd = A
}
// @from(Ln 2541, Col 0)
function Su1(A) {
    v1.lastAPIRequest = A
}
// @from(Ln 2545, Col 0)
function Cu1() {
    return v1.lastAPIRequest
}
// @from(Ln 2549, Col 0)
function Fk6(A) {
    v1.lastClassifierRequests = A
}
// @from(Ln 2553, Col 0)
function m8A() {
    return v1.lastClassifierRequests
}
// @from(Ln 2557, Col 0)
function tlq(A) {
    if (v1.inMemoryErrorLog.length >= 100) v1.inMemoryErrorLog.shift();
    v1.inMemoryErrorLog.push(A)
}
// @from(Ln 2562, Col 0)
function Iu1() {
    return v1.allowedSettingSources
}
// @from(Ln 2566, Col 0)
function bu1(A) {
    v1.allowedSettingSources = A
}
// @from(Ln 2570, Col 0)
function pk6() {
    return q7() && v1.clientType !== "claude-vscode"
}
// @from(Ln 2574, Col 0)
function xu1(A) {
    v1.inlinePlugins = A
}
// @from(Ln 2578, Col 0)
function AA6() {
    return v1.inlinePlugins
}
// @from(Ln 2582, Col 0)
function uu1(A) {
    v1.chromeFlagOverride = A
}
// @from(Ln 2586, Col 0)
function Qk6() {
    return v1.chromeFlagOverride
}
// @from(Ln 2590, Col 0)
function $V(A) {
    v1.useCoworkPlugins = A, zP()
}
// @from(Ln 2594, Col 0)
function Uk6() {
    return v1.useCoworkPlugins
}
// @from(Ln 2598, Col 0)
function mu1(A) {
    v1.sessionBypassPermissionsMode = A
}
// @from(Ln 2602, Col 0)
function qA6() {
    return v1.sessionBypassPermissionsMode
}
// @from(Ln 2606, Col 0)
function dk6(A) {
    v1.scheduledTasksEnabled = A
}
// @from(Ln 2610, Col 0)
function pw6() {
    return v1.scheduledTasksEnabled
}
// @from(Ln 2614, Col 0)
function ck6() {
    return v1.sessionCronTasks
}
// @from(Ln 2618, Col 0)
function Bu1(A) {
    v1.sessionCronTasks.push(A)
}
// @from(Ln 2622, Col 0)
function lk6(A) {
    if (A.length === 0) return 0;
    let q = new Set(A),
        K = v1.sessionCronTasks.filter((z) => !q.has(z.id)),
        Y = v1.sessionCronTasks.length - K.length;
    if (Y === 0) return 0;
    return v1.sessionCronTasks = K, Y
}
// @from(Ln 2631, Col 0)
function ik6(A) {
    v1.sessionTrustAccepted = A
}
// @from(Ln 2635, Col 0)
function Qw6() {
    return v1.sessionTrustAccepted
}
// @from(Ln 2639, Col 0)
function gu1(A) {
    v1.sessionPersistenceDisabled = A
}
// @from(Ln 2643, Col 0)
function jS() {
    return v1.sessionPersistenceDisabled
}
// @from(Ln 2647, Col 0)
function nk6() {
    return v1.hasExitedPlanMode
}
// @from(Ln 2651, Col 0)
function HV(A) {
    v1.hasExitedPlanMode = A
}
// @from(Ln 2655, Col 0)
function Fu1() {
    return v1.needsPlanModeExitAttachment
}
// @from(Ln 2659, Col 0)
function JS(A) {
    v1.needsPlanModeExitAttachment = A
}
// @from(Ln 2663, Col 0)
function Dp(A, q) {
    if (q === "plan" && A !== "plan") v1.needsPlanModeExitAttachment = !1;
    if (A === "plan" && q !== "plan") v1.needsPlanModeExitAttachment = !0
}
// @from(Ln 2668, Col 0)
function pu1() {
    return v1.needsAutoModeExitAttachment
}
// @from(Ln 2672, Col 0)
function MS(A) {
    v1.needsAutoModeExitAttachment = A
}
// @from(Ln 2676, Col 0)
function Qu1(A, q, K) {
    let Y = A === "auto" || A === "plan" && K === "auto",
        z = q === "auto" || q === "plan" && A === "auto";
    if (z && !Y) v1.needsAutoModeExitAttachment = !1;
    if (Y && !z) v1.needsAutoModeExitAttachment = !0
}
// @from(Ln 2683, Col 0)
function Uu1() {
    return v1.lspRecommendationShownThisSession
}
// @from(Ln 2687, Col 0)
function du1(A) {
    v1.lspRecommendationShownThisSession = A
}
// @from(Ln 2691, Col 0)
function cu1(A) {
    v1.initJsonSchema = A
}
// @from(Ln 2695, Col 0)
function Lt6() {
    return v1.initJsonSchema
}
// @from(Ln 2699, Col 0)
function KA6(A) {
    if (!v1.registeredHooks) v1.registeredHooks = {};
    for (let [q, K] of Object.entries(A)) {
        let Y = q;
        if (!v1.registeredHooks[Y]) v1.registeredHooks[Y] = [];
        v1.registeredHooks[Y].push(...K)
    }
}
// @from(Ln 2708, Col 0)
function Xp() {
    return v1.registeredHooks
}
// @from(Ln 2712, Col 0)
function elq() {
    v1.registeredHooks = null
}
// @from(Ln 2716, Col 0)
function lu1() {
    if (!v1.registeredHooks) return;
    let A = {};
    for (let [q, K] of Object.entries(v1.registeredHooks)) {
        let Y = K.filter((z) => !("pluginRoot" in z));
        if (Y.length > 0) A[q] = Y
    }
    v1.registeredHooks = Object.keys(A).length > 0 ? A : null
}
// @from(Ln 2726, Col 0)
function B8A() {
    v1.initJsonSchema = null, v1.registeredHooks = null
}
// @from(Ln 2730, Col 0)
function YA6() {
    return v1.planSlugCache
}
// @from(Ln 2734, Col 0)
function rk6() {
    return v1.sessionCreatedTeams
}
// @from(Ln 2738, Col 0)
function ok6(A) {
    v1.teleportedSessionInfo = {
        isTeleported: !0,
        hasLoggedFirstMessage: !1,
        sessionId: A.sessionId
    }
}
// @from(Ln 2746, Col 0)
function Rt6() {
    return v1.teleportedSessionInfo
}
// @from(Ln 2750, Col 0)
function ht6() {
    if (v1.teleportedSessionInfo) v1.teleportedSessionInfo.hasLoggedFirstMessage = !0
}
// @from(Ln 2754, Col 0)
function Uw6(A, q, K, Y = null) {
    let z = `${Y??""}:${A}`;
    v1.invokedSkills.set(z, {
        skillName: A,
        skillPath: q,
        content: K,
        invokedAt: Date.now(),
        agentId: Y
    })
}
// @from(Ln 2765, Col 0)
function Aiq() {
    return v1.invokedSkills
}
// @from(Ln 2769, Col 0)
function St6(A) {
    let q = A ?? null,
        K = new Map;
    for (let [Y, z] of v1.invokedSkills)
        if (z.agentId === q) K.set(Y, z);
    return K
}
// @from(Ln 2777, Col 0)
function iu1(A) {
    if (!A || A.size === 0) {
        v1.invokedSkills.clear();
        return
    }
    for (let [q, K] of v1.invokedSkills)
        if (K.agentId === null || !A.has(K.agentId)) v1.invokedSkills.delete(q)
}
// @from(Ln 2786, Col 0)
function zA6(A) {
    for (let [q, K] of v1.invokedSkills)
        if (K.agentId === A) v1.invokedSkills.delete(q)
}
// @from(Ln 2791, Col 0)
function g8A(A, q) {
    return
}
// @from(Ln 2795, Col 0)
function F8A() {
    if (v1.slowOperations.length === 0) return I8A;
    let A = Date.now();
    if (v1.slowOperations.some((q) => A - q.timestamp >= lx1)) {
        if (v1.slowOperations = v1.slowOperations.filter((q) => A - q.timestamp < lx1), v1.slowOperations.length === 0) return I8A
    }
    return v1.slowOperations
}
// @from(Ln 2804, Col 0)
function Pp() {
    return v1.mainThreadAgentType
}
// @from(Ln 2808, Col 0)
function Wp(A) {
    v1.mainThreadAgentType = A
}
// @from(Ln 2812, Col 0)
function t4() {
    return v1.isRemoteMode
}
// @from(Ln 2816, Col 0)
function nu1(A) {
    v1.isRemoteMode = A
}
// @from(Ln 2820, Col 0)
function ru1() {
    return v1.isInWorktree
}
// @from(Ln 2824, Col 0)
function _A6(A) {
    v1.isInWorktree = A
}
// @from(Ln 2828, Col 0)
function ou1() {
    return v1.systemPromptSectionCache
}
// @from(Ln 2832, Col 0)
function au1(A, q) {
    v1.systemPromptSectionCache.set(A, q)
}
// @from(Ln 2836, Col 0)
function su1() {
    v1.systemPromptSectionCache.clear()
}
// @from(Ln 2840, Col 0)
function tu1() {
    return v1.lastEmittedDate
}
// @from(Ln 2844, Col 0)
function dw6(A) {
    v1.lastEmittedDate = A
}
// @from(Ln 2848, Col 0)
function XT() {
    return v1.additionalDirectoriesForClaudeMd
}
// @from(Ln 2852, Col 0)
function ak6(A) {
    v1.additionalDirectoriesForClaudeMd = A
}
// @from(Ln 2856, Col 0)
function qiq() {
    return v1.allowedChannels
}
// @from(Ln 2860, Col 0)
function Kiq(A) {
    v1.allowedChannels = A
}
// @from(Ln 2864, Col 0)
function eu1() {
    return v1.promptCache1hAllowlist
}
// @from(Ln 2868, Col 0)
function Am1(A) {
    v1.promptCache1hAllowlist = A
}
// @from(Ln 2872, Col 0)
function sk6() {
    return v1.promptId
}
// @from(Ln 2876, Col 0)
function tk6(A) {
    v1.promptId = A
}
// @from(Ln 2879, Col 4)
v1
// @from(Ln 2879, Col 8)
_u1 = !1
// @from(Ln 2880, Col 4)
$u1 = 0
// @from(Ln 2881, Col 4)
Hu1 = null
// @from(Ln 2882, Col 4)
Zt6 = 0
// @from(Ln 2883, Col 4)
C8A = 10
// @from(Ln 2884, Col 4)
lx1 = 1e4
// @from(Ln 2885, Col 4)
I8A
// @from(Ln 2886, Col 4)
T1 = E(() => {
    c6A();
    E8A();
    v1 = b8A();
    I8A = []
})
// @from(Ln 2893, Col 0)
function Yiq(A, q) {
    var K = -1,
        Y = A == null ? 0 : A.length;
    while (++K < Y)
        if (q(A[K], K, A) === !1) break;
    return A
}
// @from(Ln 2900, Col 4)
p8A
// @from(Ln 2901, Col 4)
Q8A = E(() => {
    p8A = Yiq
})
// @from(Ln 2904, Col 4)
ziq
// @from(Ln 2904, Col 9)
cw6
// @from(Ln 2905, Col 4)
Km1 = E(() => {
    Dn();
    ziq = function() {
        try {
            var A = DT(Object, "defineProperty");
            return A({}, "", {}), A
        } catch (q) {}
    }(), cw6 = ziq
})
// @from(Ln 2915, Col 0)
function _iq(A, q, K) {
    if (q == "__proto__" && cw6) cw6(A, q, {
        configurable: !0,
        enumerable: !0,
        value: K,
        writable: !0
    });
    else A[q] = K
}
// @from(Ln 2924, Col 4)
En
// @from(Ln 2925, Col 4)
ek6 = E(() => {
    Km1();
    En = _iq
})
// @from(Ln 2930, Col 0)
function $iq(A, q, K) {
    var Y = A[q];
    if (!(Oiq.call(A, q) && Gx(Y, K)) || K === void 0 && !(q in A)) En(A, q, K)
}
// @from(Ln 2934, Col 4)
wiq
// @from(Ln 2934, Col 9)
Oiq
// @from(Ln 2934, Col 14)
yn
// @from(Ln 2935, Col 4)
AE6 = E(() => {
    ek6();
    jw6();
    wiq = Object.prototype, Oiq = wiq.hasOwnProperty;
    yn = $iq
})
// @from(Ln 2942, Col 0)
function Hiq(A, q, K, Y) {
    var z = !K;
    K || (K = {});
    var _ = -1,
        w = q.length;
    while (++_ < w) {
        var O = q[_],
            $ = Y ? Y(K[O], A[O], O, K, A) : void 0;
        if ($ === void 0) $ = A[O];
        if (z) En(K, O, $);
        else yn(K, O, $)
    }
    return K
}
// @from(Ln 2956, Col 4)
tE
// @from(Ln 2957, Col 4)
wA6 = E(() => {
    AE6();
    ek6();
    tE = Hiq
})
// @from(Ln 2963, Col 0)
function jiq(A, q) {
    return A && tE(q, aE(q), A)
}
// @from(Ln 2966, Col 4)
U8A
// @from(Ln 2967, Col 4)
d8A = E(() => {
    wA6();
    d86();
    U8A = jiq
})
// @from(Ln 2973, Col 0)
function Jiq(A) {
    var q = [];
    if (A != null)
        for (var K in Object(A)) q.push(K);
    return q
}
// @from(Ln 2979, Col 4)
c8A
// @from(Ln 2980, Col 4)
l8A = E(() => {
    c8A = Jiq
})
// @from(Ln 2984, Col 0)
function Xiq(A) {
    if (!A_(A)) return c8A(A);
    var q = vw6(A),
        K = [];
    for (var Y in A)
        if (!(Y == "constructor" && (q || !Diq.call(A, Y)))) K.push(Y);
    return K
}
// @from(Ln 2992, Col 4)
Miq
// @from(Ln 2992, Col 9)
Diq
// @from(Ln 2992, Col 14)
i8A
// @from(Ln 2993, Col 4)
n8A = E(() => {
    AG();
    es6();
    l8A();
    Miq = Object.prototype, Diq = Miq.hasOwnProperty;
    i8A = Xiq
})
// @from(Ln 3001, Col 0)
function Piq(A) {
    return Vx(A) ? ts6(A, !0) : i8A(A)
}
// @from(Ln 3004, Col 4)
Rx
// @from(Ln 3005, Col 4)
lw6 = E(() => {
    Bx1();
    n8A();
    Nw6();
    Rx = Piq
})
// @from(Ln 3012, Col 0)
function Wiq(A, q) {
    return A && tE(q, Rx(q), A)
}
// @from(Ln 3015, Col 4)
r8A
// @from(Ln 3016, Col 4)
o8A = E(() => {
    wA6();
    lw6();
    r8A = Wiq
})
// @from(Ln 3021, Col 4)
It6 = {}
// @from(Ln 3026, Col 0)
function Giq(A, q) {
    if (q) return A.slice();
    var K = A.length,
        Y = t8A ? t8A(K) : new A.constructor(K);
    return A.copy(Y), Y
}
// @from(Ln 3032, Col 4)
e8A
// @from(Ln 3032, Col 9)
a8A
// @from(Ln 3032, Col 14)
Ziq
// @from(Ln 3032, Col 19)
s8A
// @from(Ln 3032, Col 24)
t8A
// @from(Ln 3032, Col 29)
qE6
// @from(Ln 3033, Col 4)
Ym1 = E(() => {
    oE();
    e8A = typeof It6 == "object" && It6 && !It6.nodeType && It6, a8A = e8A && typeof Ct6 == "object" && Ct6 && !Ct6.nodeType && Ct6, Ziq = a8A && a8A.exports === e8A, s8A = Ziq ? NH.Buffer : void 0, t8A = s8A ? s8A.allocUnsafe : void 0;
    qE6 = Giq
})
// @from(Ln 3039, Col 0)
function fiq(A, q) {
    var K = -1,
        Y = A.length;
    q || (q = Array(Y));
    while (++K < Y) q[K] = A[K];
    return q
}
// @from(Ln 3046, Col 4)
bt6
// @from(Ln 3047, Col 4)
zm1 = E(() => {
    bt6 = fiq
})
// @from(Ln 3051, Col 0)
function Tiq(A, q) {
    return tE(A, Zw6(A), q)
}
// @from(Ln 3054, Col 4)
AAA
// @from(Ln 3055, Col 4)
qAA = E(() => {
    wA6();
    ds6();
    AAA = Tiq
})
// @from(Ln 3060, Col 4)
viq
// @from(Ln 3060, Col 9)
iw6
// @from(Ln 3061, Col 4)
xt6 = E(() => {
    gx1();
    viq = At6(Object.getPrototypeOf, Object), iw6 = viq
})
// @from(Ln 3065, Col 4)
Niq
// @from(Ln 3065, Col 9)
Viq
// @from(Ln 3065, Col 14)
ut6
// @from(Ln 3066, Col 4)
_m1 = E(() => {
    Fs6();
    xt6();
    ds6();
    xx1();
    Niq = Object.getOwnPropertySymbols, Viq = !Niq ? Us6 : function(A) {
        var q = [];
        while (A) Ww6(q, Zw6(A)), A = iw6(A);
        return q
    }, ut6 = Viq
})
// @from(Ln 3078, Col 0)
function kiq(A, q) {
    return tE(A, ut6(A), q)
}
// @from(Ln 3081, Col 4)
KAA
// @from(Ln 3082, Col 4)
YAA = E(() => {
    wA6();
    _m1();
    KAA = kiq
})
// @from(Ln 3088, Col 0)
function Eiq(A) {
    return ps6(A, Rx, ut6)
}
// @from(Ln 3091, Col 4)
mt6
// @from(Ln 3092, Col 4)
wm1 = E(() => {
    Ix1();
    _m1();
    lw6();
    mt6 = Eiq
})
// @from(Ln 3099, Col 0)
function Riq(A) {
    var q = A.length,
        K = new A.constructor(q);
    if (q && typeof A[0] == "string" && Liq.call(A, "index")) K.index = A.index, K.input = A.input;
    return K
}
// @from(Ln 3105, Col 4)
yiq
// @from(Ln 3105, Col 9)
Liq
// @from(Ln 3105, Col 14)
zAA
// @from(Ln 3106, Col 4)
_AA = E(() => {
    yiq = Object.prototype, Liq = yiq.hasOwnProperty;
    zAA = Riq
})
// @from(Ln 3111, Col 0)
function hiq(A) {
    var q = new A.constructor(A.byteLength);
    return new Xw6(q).set(new Xw6(A)), q
}
// @from(Ln 3115, Col 4)
nw6
// @from(Ln 3116, Col 4)
Bt6 = E(() => {
    Sx1();
    nw6 = hiq
})
// @from(Ln 3121, Col 0)
function Siq(A, q) {
    var K = q ? nw6(A.buffer) : A.buffer;
    return new A.constructor(K, A.byteOffset, A.byteLength)
}
// @from(Ln 3125, Col 4)
wAA
// @from(Ln 3126, Col 4)
OAA = E(() => {
    Bt6();
    wAA = Siq
})
// @from(Ln 3131, Col 0)
function Iiq(A) {
    var q = new A.constructor(A.source, Ciq.exec(A));
    return q.lastIndex = A.lastIndex, q
}
// @from(Ln 3135, Col 4)
Ciq
// @from(Ln 3135, Col 9)
$AA
// @from(Ln 3136, Col 4)
HAA = E(() => {
    Ciq = /\w*$/;
    $AA = Iiq
})
// @from(Ln 3141, Col 0)
function biq(A) {
    return JAA ? Object(JAA.call(A)) : {}
}
// @from(Ln 3144, Col 4)
jAA
// @from(Ln 3144, Col 9)
JAA
// @from(Ln 3144, Col 14)
MAA
// @from(Ln 3145, Col 4)
DAA = E(() => {
    p86();
    jAA = yD ? yD.prototype : void 0, JAA = jAA ? jAA.valueOf : void 0;
    MAA = biq
})
// @from(Ln 3151, Col 0)
function xiq(A, q) {
    var K = q ? nw6(A.buffer) : A.buffer;
    return new A.constructor(K, A.byteOffset, A.length)
}
// @from(Ln 3155, Col 4)
gt6
// @from(Ln 3156, Col 4)
Om1 = E(() => {
    Bt6();
    gt6 = xiq
})
// @from(Ln 3161, Col 0)
function Anq(A, q, K) {
    var Y = A.constructor;
    switch (q) {
        case diq:
            return nw6(A);
        case uiq:
        case miq:
            return new Y(+A);
        case ciq:
            return wAA(A, K);
        case liq:
        case iiq:
        case niq:
        case riq:
        case oiq:
        case aiq:
        case siq:
        case tiq:
        case eiq:
            return gt6(A, K);
        case Biq:
            return new Y;
        case giq:
        case Qiq:
            return new Y(A);
        case Fiq:
            return $AA(A);
        case piq:
            return new Y;
        case Uiq:
            return MAA(A)
    }
}
// @from(Ln 3194, Col 4)
uiq = "[object Boolean]"
// @from(Ln 3195, Col 4)
miq = "[object Date]"
// @from(Ln 3196, Col 4)
Biq = "[object Map]"
// @from(Ln 3197, Col 4)
giq = "[object Number]"
// @from(Ln 3198, Col 4)
Fiq = "[object RegExp]"
// @from(Ln 3199, Col 4)
piq = "[object Set]"
// @from(Ln 3200, Col 4)
Qiq = "[object String]"
// @from(Ln 3201, Col 4)
Uiq = "[object Symbol]"
// @from(Ln 3202, Col 4)
diq = "[object ArrayBuffer]"
// @from(Ln 3203, Col 4)
ciq = "[object DataView]"
// @from(Ln 3204, Col 4)
liq = "[object Float32Array]"
// @from(Ln 3205, Col 4)
iiq = "[object Float64Array]"
// @from(Ln 3206, Col 4)
niq = "[object Int8Array]"
// @from(Ln 3207, Col 4)
riq = "[object Int16Array]"
// @from(Ln 3208, Col 4)
oiq = "[object Int32Array]"
// @from(Ln 3209, Col 4)
aiq = "[object Uint8Array]"
// @from(Ln 3210, Col 4)
siq = "[object Uint8ClampedArray]"
// @from(Ln 3211, Col 4)
tiq = "[object Uint16Array]"
// @from(Ln 3212, Col 4)
eiq = "[object Uint32Array]"
// @from(Ln 3213, Col 4)
XAA
// @from(Ln 3214, Col 4)
PAA = E(() => {
    Bt6();
    OAA();
    HAA();
    DAA();
    Om1();
    XAA = Anq
})
// @from(Ln 3222, Col 4)
WAA
// @from(Ln 3222, Col 9)
qnq
// @from(Ln 3222, Col 14)
ZAA
// @from(Ln 3223, Col 4)
GAA = E(() => {
    AG();
    WAA = Object.create, qnq = function() {
        function A() {}
        return function(q) {
            if (!A_(q)) return {};
            if (WAA) return WAA(q);
            A.prototype = q;
            var K = new A;
            return A.prototype = void 0, K
        }
    }(), ZAA = qnq
})
// @from(Ln 3237, Col 0)
function Knq(A) {
    return typeof A.constructor == "function" && !vw6(A) ? ZAA(iw6(A)) : {}
}
// @from(Ln 3240, Col 4)
Ft6
// @from(Ln 3241, Col 4)
$m1 = E(() => {
    GAA();
    xt6();
    es6();
    Ft6 = Knq
})
// @from(Ln 3248, Col 0)
function znq(A) {
    return VM(A) && jp(A) == Ynq
}
// @from(Ln 3251, Col 4)
Ynq = "[object Map]"
// @from(Ln 3252, Col 4)
fAA
// @from(Ln 3253, Col 4)
TAA = E(() => {
    hk6();
    Tx();
    fAA = znq
})
// @from(Ln 3258, Col 4)
vAA
// @from(Ln 3258, Col 9)
_nq
// @from(Ln 3258, Col 14)
NAA
// @from(Ln 3259, Col 4)
VAA = E(() => {
    TAA();
    ns6();
    as6();
    vAA = Nx && Nx.isMap, _nq = vAA ? fw6(vAA) : fAA, NAA = _nq
})
// @from(Ln 3266, Col 0)
function Onq(A) {
    return VM(A) && jp(A) == wnq
}
// @from(Ln 3269, Col 4)
wnq = "[object Set]"
// @from(Ln 3270, Col 4)
kAA
// @from(Ln 3271, Col 4)
EAA = E(() => {
    hk6();
    Tx();
    kAA = Onq
})
// @from(Ln 3276, Col 4)
yAA
// @from(Ln 3276, Col 9)
$nq
// @from(Ln 3276, Col 14)
LAA
// @from(Ln 3277, Col 4)
RAA = E(() => {
    EAA();
    ns6();
    as6();
    yAA = Nx && Nx.isSet, $nq = yAA ? fw6(yAA) : kAA, LAA = $nq
})
// @from(Ln 3284, Col 0)
function pt6(A, q, K, Y, z, _) {
    var w, O = q & Hnq,
        $ = q & jnq,
        H = q & Jnq;
    if (K) w = z ? K(A, Y, z, _) : K(A);
    if (w !== void 0) return w;
    if (!A_(A)) return A;
    var j = q_(A);
    if (j) {
        if (w = zAA(A), !O) return bt6(A, w)
    } else {
        var J = jp(A),
            M = J == SAA || J == Wnq;
        if (vx(A)) return qE6(A, O);
        if (J == CAA || J == hAA || M && !z) {
            if (w = $ || M ? {} : Ft6(A), !O) return $ ? KAA(A, r8A(w, A)) : AAA(A, U8A(w, A))
        } else {
            if (!Gw[J]) return z ? A : {};
            w = XAA(A, J, O)
        }
    }
    _ || (_ = new fx);
    var D = _.get(A);
    if (D) return D;
    if (_.set(A, w), LAA(A)) A.forEach(function(W) {
        w.add(pt6(W, q, K, W, A, _))
    });
    else if (NAA(A)) A.forEach(function(W, Z) {
        w.set(Z, pt6(W, q, K, Z, A, _))
    });
    var X = H ? $ ? mt6 : Rk6 : $ ? Rx : aE,
        P = j ? void 0 : X(A);
    return p8A(P || A, function(W, Z) {
        if (P) Z = W, W = A[Z];
        yn(w, Z, pt6(W, q, K, Z, A, _))
    }), w
}
// @from(Ln 3321, Col 4)
Hnq = 1
// @from(Ln 3322, Col 4)
jnq = 2
// @from(Ln 3323, Col 4)
Jnq = 4
// @from(Ln 3324, Col 4)
hAA = "[object Arguments]"
// @from(Ln 3325, Col 4)
Mnq = "[object Array]"
// @from(Ln 3326, Col 4)
Dnq = "[object Boolean]"
// @from(Ln 3327, Col 4)
Xnq = "[object Date]"
// @from(Ln 3328, Col 4)
Pnq = "[object Error]"
// @from(Ln 3329, Col 4)
SAA = "[object Function]"
// @from(Ln 3330, Col 4)
Wnq = "[object GeneratorFunction]"
// @from(Ln 3331, Col 4)
Znq = "[object Map]"
// @from(Ln 3332, Col 4)
Gnq = "[object Number]"
// @from(Ln 3333, Col 4)
CAA = "[object Object]"
// @from(Ln 3334, Col 4)
fnq = "[object RegExp]"
// @from(Ln 3335, Col 4)
Tnq = "[object Set]"
// @from(Ln 3336, Col 4)
vnq = "[object String]"
// @from(Ln 3337, Col 4)
Nnq = "[object Symbol]"
// @from(Ln 3338, Col 4)
Vnq = "[object WeakMap]"
// @from(Ln 3339, Col 4)
knq = "[object ArrayBuffer]"
// @from(Ln 3340, Col 4)
Enq = "[object DataView]"
// @from(Ln 3341, Col 4)
ynq = "[object Float32Array]"
// @from(Ln 3342, Col 4)
Lnq = "[object Float64Array]"
// @from(Ln 3343, Col 4)
Rnq = "[object Int8Array]"
// @from(Ln 3344, Col 4)
hnq = "[object Int16Array]"
// @from(Ln 3345, Col 4)
Snq = "[object Int32Array]"
// @from(Ln 3346, Col 4)
Cnq = "[object Uint8Array]"
// @from(Ln 3347, Col 4)
Inq = "[object Uint8ClampedArray]"
// @from(Ln 3348, Col 4)
bnq = "[object Uint16Array]"
// @from(Ln 3349, Col 4)
xnq = "[object Uint32Array]"
// @from(Ln 3350, Col 4)
Gw
// @from(Ln 3350, Col 8)
Qt6
// @from(Ln 3351, Col 4)
Hm1 = E(() => {
    Vk6();
    Q8A();
    AE6();
    d8A();
    o8A();
    Ym1();
    zm1();
    qAA();
    YAA();
    Fx1();
    wm1();
    hk6();
    _AA();
    PAA();
    $m1();
    qG();
    Ek6();
    VAA();
    AG();
    RAA();
    d86();
    lw6();
    Gw = {};
    Gw[hAA] = Gw[Mnq] = Gw[knq] = Gw[Enq] = Gw[Dnq] = Gw[Xnq] = Gw[ynq] = Gw[Lnq] = Gw[Rnq] = Gw[hnq] = Gw[Snq] = Gw[Znq] = Gw[Gnq] = Gw[CAA] = Gw[fnq] = Gw[Tnq] = Gw[vnq] = Gw[Nnq] = Gw[Cnq] = Gw[Inq] = Gw[bnq] = Gw[xnq] = !0;
    Gw[Pnq] = Gw[SAA] = Gw[Vnq] = !1;
    Qt6 = pt6
})
// @from(Ln 3380, Col 0)
function Bnq(A) {
    return Qt6(A, unq | mnq)
}
// @from(Ln 3383, Col 4)
unq = 1
// @from(Ln 3384, Col 4)
mnq = 4
// @from(Ln 3385, Col 4)
IAA
// @from(Ln 3386, Col 4)
bAA = E(() => {
    Hm1();
    IAA = Bnq
})
// @from(Ln 3397, Col 0)
function Unq() {
    return Qnq
}
// @from(Ln 3401, Col 0)
function B6(A, q, K) {
    let z = [];
    try {
        const Y = TY(z, E_`JSON.stringify(${A})`, 0);
        return JSON.stringify(A, q, K)
    } catch (_) {
        var w = _,
            O = 1
    } finally {
        vY(z, w, O)
    }
}
// @from(Ln 3414, Col 0)
function rw6(A) {
    let K = [];
    try {
        const q = TY(K, E_`cloneDeep(${A})`, 0);
        return IAA(A)
    } catch (Y) {
        var z = Y,
            _ = 1
    } finally {
        vY(K, z, _)
    }
}
// @from(Ln 3427, Col 0)
function fz(A, q, K) {
    let _ = [];
    try {
        const Y = TY(_, E_`fs.writeFileSync(${A}, ${q})`, 0);
        let z = K !== null && typeof K === "object" && "flush" in K && K.flush === !0;
        if (z) {
            let H = typeof K === "object" && "encoding" in K ? K.encoding : void 0,
                j = typeof K === "object" && "mode" in K ? K.mode : void 0,
                J;
            try {
                J = gnq(A, "w", j), xAA(J, q, {
                    encoding: H ?? void 0
                }), Fnq(J)
            } finally {
                if (J !== void 0) pnq(J)
            }
        } else xAA(A, q, K)
    } catch (w) {
        var O = w,
            $ = 1
    } finally {
        vY(_, O, $)
    }
}
// @from(Ln 3451, Col 4)
jCz
// @from(Ln 3451, Col 9)
Qnq
// @from(Ln 3451, Col 14)
E_
// @from(Ln 3451, Col 18)
i1 = (A, q) => {
    let Y = [];
    try {
        const K = TY(Y, E_`JSON.parse(${A})`, 0);
        return typeof q > "u" ? JSON.parse(A) : JSON.parse(A, q)
    } catch (z) {
        var _ = z,
            w = 1
    } finally {
        vY(Y, _, w)
    }
}
// @from(Ln 3463, Col 4)
g1 = E(() => {
    H1();
    T1();
    bAA();
    jCz = (() => {
        let A = process.env.CLAUDE_CODE_SLOW_OPERATION_THRESHOLD_MS;
        if (A !== void 0) {
            let q = Number(A);
            if (!Number.isNaN(q) && q >= 0) return q
        }
        return 1 / 0
    })(), Qnq = {
        [Symbol.dispose]() {}
    };
    E_ = Unq
})
// @from(Ln 3496, Col 0)
function qO(A, q) {
    if (q.startsWith("//") || q.startsWith("\\\\")) return {
        resolvedPath: q,
        isSymlink: !1,
        isCanonical: !1
    };
    if (!A.existsSync(q)) return {
        resolvedPath: q,
        isSymlink: !1,
        isCanonical: !1
    };
    try {
        let K = A.lstatSync(q);
        if (K.isFIFO() || K.isSocket() || K.isCharacterDevice() || K.isBlockDevice()) return {
            resolvedPath: q,
            isSymlink: !1,
            isCanonical: !1
        };
        let Y = A.realpathSync(q);
        return {
            resolvedPath: Y,
            isSymlink: Y !== q,
            isCanonical: !0
        }
    } catch (K) {
        return {
            resolvedPath: q,
            isSymlink: !1,
            isCanonical: !1
        }
    }
}
// @from(Ln 3529, Col 0)
function hx(A, q, K) {
    let {
        resolvedPath: Y
    } = qO(A, q);
    if (K.has(Y)) return !0;
    return K.add(Y), !1
}
// @from(Ln 3537, Col 0)
function anq(A, q) {
    let K = q,
        Y = [];
    while (K !== RD.dirname(K)) {
        let z;
        try {
            z = A.lstatSync(K)
        } catch {
            Y.unshift(RD.basename(K)), K = RD.dirname(K);
            continue
        }
        if (z.isSymbolicLink()) try {
            let _ = A.realpathSync(K);
            return Y.length === 0 ? _ : RD.join(_, ...Y)
        } catch {
            let _ = A.readlinkSync(K),
                w = RD.isAbsolute(_) ? _ : RD.resolve(RD.dirname(K), _);
            return Y.length === 0 ? w : RD.join(w, ...Y)
        }
        try {
            let _ = A.realpathSync(K);
            if (_ !== K) return Y.length === 0 ? _ : RD.join(_, ...Y)
        } catch {}
        return
    }
    return
}
// @from(Ln 3565, Col 0)
function DS(A) {
    let q = A;
    if (q === "~") q = uAA().normalize("NFC");
    else if (q.startsWith("~/")) q = RD.join(uAA().normalize("NFC"), q.slice(2));
    let K = new Set,
        Y = $1();
    if (K.add(q), q.startsWith("//") || q.startsWith("\\\\")) return Array.from(K);
    try {
        let w = q,
            O = new Set,
            $ = 40;
        for (let H = 0; H < $; H++) {
            if (O.has(w)) break;
            if (O.add(w), !Y.existsSync(w)) {
                if (w === q) {
                    let D = anq(Y, q);
                    if (D !== void 0) K.add(D)
                }
                break
            }
            let j = Y.lstatSync(w);
            if (j.isFIFO() || j.isSocket() || j.isCharacterDevice() || j.isBlockDevice()) break;
            if (!j.isSymbolicLink()) break;
            let J = Y.readlinkSync(w),
                M = RD.isAbsolute(J) ? J : RD.resolve(RD.dirname(w), J);
            K.add(M), w = M
        }
    } catch {}
    let {
        resolvedPath: z,
        isSymlink: _
    } = qO(Y, q);
    if (_ && z !== q) K.add(z);
    return Array.from(K)
}
// @from(Ln 3601, Col 0)
function $1() {
    return tnq
}
// @from(Ln 3604, Col 0)
async function dt6(A, q, K) {
    let $ = [];
    try {
        const Y = TY($, await Ut6(A, "r"), 1);
        let z = (await Y.stat()).size;
        if (z <= q) return null;
        let _ = Math.min(z - q, K);
        let w = Buffer.allocUnsafe(_);
        let O = 0;
        while (O < _) {
            let {
                bytesRead: D
            } = await Y.read(w, O, _ - O, q + O);
            if (D === 0) break;
            O += D
        }
        return {
            content: w.toString("utf8", 0, O),
            bytesRead: O,
            bytesTotal: z
        }
    } catch (H) {
        var j = H,
            J = 1
    } finally {
        var M = vY($, j, J);
        M && await M
    }
}
// @from(Ln 3633, Col 0)
async function ow6(A, q) {
    let $ = [];
    try {
        const K = TY($, await Ut6(A, "r"), 1);
        let Y = (await K.stat()).size;
        if (Y === 0) return {
            content: "",
            bytesRead: 0,
            bytesTotal: 0
        };
        let z = Math.max(0, Y - q);
        let _ = Y - z;
        let w = Buffer.allocUnsafe(_);
        let O = 0;
        while (O < _) {
            let {
                bytesRead: D
            } = await K.read(w, O, _ - O, z + O);
            if (D === 0) break;
            O += D
        }
        return {
            content: w.toString("utf8", 0, O),
            bytesRead: O,
            bytesTotal: Y
        }
    } catch (H) {
        var j = H,
            J = 1
    } finally {
        var M = vY($, j, J);
        M && await M
    }
}
// @from(Ln 3667, Col 0)
async function* BAA(A) {
    let K = await Ut6(A, "r");
    try {
        let z = (await K.stat()).size,
            _ = "",
            w = Buffer.alloc(4096);
        while (z > 0) {
            let O = Math.min(4096, z);
            z -= O, await K.read(w, 0, O, z);
            let H = (w.toString("utf8", 0, O) + _).split(`
`);
            _ = H[0] || "";
            for (let j = H.length - 1; j >= 1; j--) {
                let J = H[j];
                if (J) yield J
            }
        }
        if (_) yield _
    } finally {
        await K.close()
    }
}
// @from(Ln 3689, Col 4)
snq
// @from(Ln 3689, Col 9)
tnq
// @from(Ln 3690, Col 4)
SA = E(() => {
    g1();
    snq = {
        cwd() {
            return process.cwd()
        },
        existsSync(A) {
            let K = [];
            try {
                const q = TY(K, E_`fs.existsSync(${A})`, 0);
                return W5.existsSync(A)
            } catch (Y) {
                var z = Y,
                    _ = 1
            } finally {
                vY(K, z, _)
            }
        },
        async stat(A) {
            return dnq(A)
        },
        async readdir(A) {
            return cnq(A, {
                withFileTypes: !0
            })
        },
        async unlink(A) {
            return lnq(A)
        },
        async rmdir(A) {
            return inq(A)
        },
        async rm(A, q) {
            return nnq(A, q)
        },
        async mkdir(A, q) {
            try {
                await rnq(A, {
                    recursive: !0,
                    ...q
                })
            } catch (K) {
                if (K.code !== "EEXIST") throw K
            }
        },
        async readFile(A, q) {
            return mAA(A, {
                encoding: q.encoding
            })
        },
        async rename(A, q) {
            return onq(A, q)
        },
        statSync(A) {
            let K = [];
            try {
                const q = TY(K, E_`fs.statSync(${A})`, 0);
                return W5.statSync(A)
            } catch (Y) {
                var z = Y,
                    _ = 1
            } finally {
                vY(K, z, _)
            }
        },
        lstatSync(A) {
            let K = [];
            try {
                const q = TY(K, E_`fs.lstatSync(${A})`, 0);
                return W5.lstatSync(A)
            } catch (Y) {
                var z = Y,
                    _ = 1
            } finally {
                vY(K, z, _)
            }
        },
        readFileSync(A, q) {
            let Y = [];
            try {
                const K = TY(Y, E_`fs.readFileSync(${A})`, 0);
                return W5.readFileSync(A, {
                    encoding: q.encoding
                })
            } catch (z) {
                var _ = z,
                    w = 1
            } finally {
                vY(Y, _, w)
            }
        },
        readFileBytesSync(A) {
            let K = [];
            try {
                const q = TY(K, E_`fs.readFileBytesSync(${A})`, 0);
                return W5.readFileSync(A)
            } catch (Y) {
                var z = Y,
                    _ = 1
            } finally {
                vY(K, z, _)
            }
        },
        readSync(A, q) {
            let z = [];
            try {
                const K = TY(z, E_`fs.readSync(${A}, ${q.length} bytes)`, 0);
                let Y = void 0;
                try {
                    Y = W5.openSync(A, "r");
                    let $ = Buffer.alloc(q.length),
                        H = W5.readSync(Y, $, 0, q.length, 0);
                    return {
                        buffer: $,
                        bytesRead: H
                    }
                } finally {
                    if (Y) W5.closeSync(Y)
                }
            } catch (_) {
                var w = _,
                    O = 1
            } finally {
                vY(z, w, O)
            }
        },
        appendFileSync(A, q, K) {
            let z = [];
            try {
                const Y = TY(z, E_`fs.appendFileSync(${A}, ${q.length} chars)`, 0);
                if (K?.mode !== void 0) try {
                    let $ = W5.openSync(A, "ax", K.mode);
                    try {
                        W5.appendFileSync($, q)
                    } finally {
                        W5.closeSync($)
                    }
                    return
                } catch ($) {
                    if ($.code !== "EEXIST") throw $
                }
                W5.appendFileSync(A, q)
            } catch (_) {
                var w = _,
                    O = 1
            } finally {
                vY(z, w, O)
            }
        },
        copyFileSync(A, q) {
            let Y = [];
            try {
                const K = TY(Y, E_`fs.copyFileSync(${A} → ${q})`, 0);
                W5.copyFileSync(A, q)
            } catch (z) {
                var _ = z,
                    w = 1
            } finally {
                vY(Y, _, w)
            }
        },
        unlinkSync(A) {
            let K = [];
            try {
                const q = TY(K, E_`fs.unlinkSync(${A})`, 0);
                W5.unlinkSync(A)
            } catch (Y) {
                var z = Y,
                    _ = 1
            } finally {
                vY(K, z, _)
            }
        },
        renameSync(A, q) {
            let Y = [];
            try {
                const K = TY(Y, E_`fs.renameSync(${A} → ${q})`, 0);
                W5.renameSync(A, q)
            } catch (z) {
                var _ = z,
                    w = 1
            } finally {
                vY(Y, _, w)
            }
        },
        linkSync(A, q) {
            let Y = [];
            try {
                const K = TY(Y, E_`fs.linkSync(${A} → ${q})`, 0);
                W5.linkSync(A, q)
            } catch (z) {
                var _ = z,
                    w = 1
            } finally {
                vY(Y, _, w)
            }
        },
        symlinkSync(A, q, K) {
            let z = [];
            try {
                const Y = TY(z, E_`fs.symlinkSync(${A} → ${q})`, 0);
                W5.symlinkSync(A, q, K)
            } catch (_) {
                var w = _,
                    O = 1
            } finally {
                vY(z, w, O)
            }
        },
        readlinkSync(A) {
            let K = [];
            try {
                const q = TY(K, E_`fs.readlinkSync(${A})`, 0);
                return W5.readlinkSync(A)
            } catch (Y) {
                var z = Y,
                    _ = 1
            } finally {
                vY(K, z, _)
            }
        },
        realpathSync(A) {
            let K = [];
            try {
                const q = TY(K, E_`fs.realpathSync(${A})`, 0);
                return W5.realpathSync(A).normalize("NFC")
            } catch (Y) {
                var z = Y,
                    _ = 1
            } finally {
                vY(K, z, _)
            }
        },
        mkdirSync(A, q) {
            let z = [];
            try {
                const K = TY(z, E_`fs.mkdirSync(${A})`, 0);
                let Y = {
                    recursive: !0
                };
                if (q?.mode !== void 0) Y.mode = q.mode;
                try {
                    W5.mkdirSync(A, Y)
                } catch ($) {
                    if ($.code !== "EEXIST") throw $
                }
            } catch (_) {
                var w = _,
                    O = 1
            } finally {
                vY(z, w, O)
            }
        },
        readdirSync(A) {
            let K = [];
            try {
                const q = TY(K, E_`fs.readdirSync(${A})`, 0);
                return W5.readdirSync(A, {
                    withFileTypes: !0
                })
            } catch (Y) {
                var z = Y,
                    _ = 1
            } finally {
                vY(K, z, _)
            }
        },
        readdirStringSync(A) {
            let K = [];
            try {
                const q = TY(K, E_`fs.readdirStringSync(${A})`, 0);
                return W5.readdirSync(A)
            } catch (Y) {
                var z = Y,
                    _ = 1
            } finally {
                vY(K, z, _)
            }
        },
        isDirEmptySync(A) {
            let Y = [];
            try {
                const q = TY(Y, E_`fs.isDirEmptySync(${A})`, 0);
                let K = this.readdirSync(A);
                return K.length === 0
            } catch (z) {
                var _ = z,
                    w = 1
            } finally {
                vY(Y, _, w)
            }
        },
        rmdirSync(A) {
            let K = [];
            try {
                const q = TY(K, E_`fs.rmdirSync(${A})`, 0);
                W5.rmdirSync(A)
            } catch (Y) {
                var z = Y,
                    _ = 1
            } finally {
                vY(K, z, _)
            }
        },
        rmSync(A, q) {
            let Y = [];
            try {
                const K = TY(Y, E_`fs.rmSync(${A})`, 0);
                W5.rmSync(A, q)
            } catch (z) {
                var _ = z,
                    w = 1
            } finally {
                vY(Y, _, w)
            }
        },
        createWriteStream(A) {
            return W5.createWriteStream(A)
        },
        async readFileBytes(A, q) {
            if (q === void 0) return mAA(A);
            let K = await Ut6(A, "r");
            try {
                let {
                    size: Y
                } = await K.stat(), z = Math.min(Y, q), _ = Buffer.allocUnsafe(z), w = 0;
                while (w < z) {
                    let {
                        bytesRead: O
                    } = await K.read(_, w, z - w, w);
                    if (O === 0) break;
                    w += O
                }
                return w < z ? _.subarray(0, w) : _
            } finally {
                await K.close()
            }
        }
    }, tnq = snq
})
// @from(Ln 4037, Col 0)
function YG() {
    return gAA(c8(), "teams")
}
// @from(Ln 4041, Col 0)
function aw6(A) {
    let q = process.env.NODE_OPTIONS;
    if (!q) return !1;
    return q.split(/\s+/).includes(A)
}
// @from(Ln 4047, Col 0)
function t6(A) {
    if (!A) return !1;
    if (typeof A === "boolean") return A;
    let q = A.toLowerCase().trim();
    return ["1", "true", "yes", "on"].includes(q)
}
// @from(Ln 4054, Col 0)
function xz(A) {
    if (A === void 0) return !1;
    if (typeof A === "boolean") return !A;
    if (!A) return !1;
    let q = A.toLowerCase().trim();
    return ["0", "false", "no", "off"].includes(q)
}