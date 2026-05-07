// === FILE HEADER ===
#!/usr/bin/env node
 // Version: 2.1.112


// === END FILE HEADER ===

// @from(Ln 7, Col 4)
MP5 = Object.create
// @from(Ln 15, Col 0)
function qD7(q) {
    return this[q]
}
// @from(Ln 18, Col 4)
DP5
// @from(Ln 18, Col 9)
ZP5
// @from(Ln 18, Col 14)
K6 = (q, K, _) => {
        var z = q != null && typeof q === "object";
        if (z) {
            var Y = K ? DP5 ??= new WeakMap : ZP5 ??= new WeakMap,
                A = Y.get(q);
            if (A) return A
        }
        _ = q != null ? MP5(PP5(q)) : {};
        let O = K || !q || !q.__esModule ? vB6(_, "default", {
            value: q,
            enumerable: !0
        }) : _;
        for (let w of t07(q))
            if (!e07.call(O, w)) vB6(O, w, {
                get: qD7.bind(q, w),
                enumerable: !0
            });
        if (z) Y.set(q, O);
        return O
    }
// @from(Ln 38, Col 4)
B7 = (q) => {
        var K = (s07 ??= new WeakMap).get(q),
            _;
        if (K) return K;
        if (K = vB6({}, "__esModule", {
                value: !0
            }), q && typeof q === "object" || typeof q === "function") {
            for (var z of t07(q))
                if (!e07.call(K, z)) vB6(K, z, {
                    get: qD7.bind(q, z),
                    enumerable: !(_ = WP5(q, z)) || _.enumerable
                })
        }
        return s07.set(q, K), K
    }
// @from(Ln 53, Col 4)
s07
// @from(Ln 53, Col 9)
p = (q, K) => () => (K || q((K = {
        exports: {}
    }).exports, K), K.exports)
// @from(Ln 56, Col 4)
fP5 = (q) => q
// @from(Ln 58, Col 0)
function GP5(q, K) {
    this[q] = fP5.bind(null, K)
}
// @from(Ln 61, Col 4)
h8 = (q, K) => {
    for (var _ in K) vB6(q, _, {
        get: K[_],
        enumerable: !0,
        configurable: !0,
        set: GP5.bind(K, _)
    })
}
// @from(Ln 69, Col 4)
L = (q, K) => () => (q && (K = q(q = 0)), K)
// @from(Ln 70, Col 4)
d6 = vP5(import.meta.url)
// @from(Ln 71, Col 4)
TP5 = Symbol.dispose || Symbol.for("Symbol.dispose")
// @from(Ln 72, Col 4)
VP5 = Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")
// @from(Ln 73, Col 4)
rz = (q, K, _) => {
        if (K != null) {
            if (typeof K !== "object" && typeof K !== "function") throw TypeError('Object expected to be assigned to "using" declaration');
            var z;
            if (_) z = K[VP5];
            if (z === void 0) z = K[TP5];
            if (typeof z !== "function") throw TypeError("Object not disposable");
            q.push([_, z, K])
        } else if (_) q.push([_]);
        return K
    }
// @from(Ln 84, Col 4)
oz = (q, K, _) => {
        var z = typeof SuppressedError === "function" ? SuppressedError : function(O, w, $, j) {
                return j = Error($), j.name = "SuppressedError", j.error = O, j.suppressed = w, j
            },
            Y = (O) => K = _ ? new z(O, K, "An error was suppressed during disposal") : (_ = !0, O),
            A = (O) => {
                while (O = q.pop()) try {
                    var w = O[1] && O[1].call(O[2]);
                    if (O[0]) return Promise.resolve(w).then(A, ($) => (Y($), A()))
                } catch ($) {
                    Y($)
                }
                if (_) throw K
            };
        return A()
    }
// @from(Ln 101, Col 0)
function kP5() {
    this.__data__ = [], this.size = 0
}
// @from(Ln 104, Col 4)
KD7
// @from(Ln 105, Col 4)
_D7 = L(() => {
    KD7 = kP5
})
// @from(Ln 109, Col 0)
function NP5(q, K) {
    return q === K || q !== q && K !== K
}
// @from(Ln 112, Col 4)
ug
// @from(Ln 113, Col 4)
t06 = L(() => {
    ug = NP5
})
// @from(Ln 117, Col 0)
function EP5(q, K) {
    var _ = q.length;
    while (_--)
        if (ug(q[_][0], K)) return _;
    return -1
}
// @from(Ln 123, Col 4)
P86
// @from(Ln 124, Col 4)
TB6 = L(() => {
    t06();
    P86 = EP5
})
// @from(Ln 129, Col 0)
function hP5(q) {
    var K = this.__data__,
        _ = P86(K, q);
    if (_ < 0) return !1;
    var z = K.length - 1;
    if (_ == z) K.pop();
    else LP5.call(K, _, 1);
    return --this.size, !0
}
// @from(Ln 138, Col 4)
yP5
// @from(Ln 138, Col 9)
LP5
// @from(Ln 138, Col 14)
zD7
// @from(Ln 139, Col 4)
YD7 = L(() => {
    TB6();
    yP5 = Array.prototype, LP5 = yP5.splice;
    zD7 = hP5
})
// @from(Ln 145, Col 0)
function RP5(q) {
    var K = this.__data__,
        _ = P86(K, q);
    return _ < 0 ? void 0 : K[_][1]
}
// @from(Ln 150, Col 4)
AD7
// @from(Ln 151, Col 4)
OD7 = L(() => {
    TB6();
    AD7 = RP5
})
// @from(Ln 156, Col 0)
function SP5(q) {
    return P86(this.__data__, q) > -1
}
// @from(Ln 159, Col 4)
wD7
// @from(Ln 160, Col 4)
$D7 = L(() => {
    TB6();
    wD7 = SP5
})
// @from(Ln 165, Col 0)
function CP5(q, K) {
    var _ = this.__data__,
        z = P86(_, q);
    if (z < 0) ++this.size, _.push([q, K]);
    else _[z][1] = K;
    return this
}
// @from(Ln 172, Col 4)
jD7
// @from(Ln 173, Col 4)
HD7 = L(() => {
    TB6();
    jD7 = CP5
})
// @from(Ln 178, Col 0)
function e06(q) {
    var K = -1,
        _ = q == null ? 0 : q.length;
    this.clear();
    while (++K < _) {
        var z = q[K];
        this.set(z[0], z[1])
    }
}
// @from(Ln 187, Col 4)
W86
// @from(Ln 188, Col 4)
VB6 = L(() => {
    _D7();
    YD7();
    OD7();
    $D7();
    HD7();
    e06.prototype.clear = KD7;
    e06.prototype.delete = zD7;
    e06.prototype.get = AD7;
    e06.prototype.has = wD7;
    e06.prototype.set = jD7;
    W86 = e06
})
// @from(Ln 202, Col 0)
function bP5() {
    this.__data__ = new W86, this.size = 0
}
// @from(Ln 205, Col 4)
JD7
// @from(Ln 206, Col 4)
XD7 = L(() => {
    VB6();
    JD7 = bP5
})
// @from(Ln 211, Col 0)
function IP5(q) {
    var K = this.__data__,
        _ = K.delete(q);
    return this.size = K.size, _
}
// @from(Ln 216, Col 4)
MD7
// @from(Ln 217, Col 4)
PD7 = L(() => {
    MD7 = IP5
})
// @from(Ln 221, Col 0)
function xP5(q) {
    return this.__data__.get(q)
}
// @from(Ln 224, Col 4)
WD7
// @from(Ln 225, Col 4)
DD7 = L(() => {
    WD7 = xP5
})
// @from(Ln 229, Col 0)
function uP5(q) {
    return this.__data__.has(q)
}
// @from(Ln 232, Col 4)
ZD7
// @from(Ln 233, Col 4)
fD7 = L(() => {
    ZD7 = uP5
})
// @from(Ln 236, Col 4)
mP5
// @from(Ln 236, Col 9)
rA8
// @from(Ln 237, Col 4)
ae8 = L(() => {
    mP5 = typeof global == "object" && global && global.Object === Object && global, rA8 = mP5
})
// @from(Ln 240, Col 4)
BP5
// @from(Ln 240, Col 9)
pP5
// @from(Ln 240, Col 14)
oJ
// @from(Ln 241, Col 4)
GC = L(() => {
    ae8();
    BP5 = typeof self == "object" && self && self.Object === Object && self, pP5 = rA8 || BP5 || Function("return this")(), oJ = pP5
})
// @from(Ln 245, Col 4)
FP5
// @from(Ln 245, Col 9)
x0
// @from(Ln 246, Col 4)
zY6 = L(() => {
    GC();
    FP5 = oJ.Symbol, x0 = FP5
})
// @from(Ln 251, Col 0)
function QP5(q) {
    var K = gP5.call(q, kB6),
        _ = q[kB6];
    try {
        q[kB6] = void 0;
        var z = !0
    } catch (A) {}
    var Y = UP5.call(q);
    if (z)
        if (K) q[kB6] = _;
        else delete q[kB6];
    return Y
}
// @from(Ln 264, Col 4)
GD7
// @from(Ln 264, Col 9)
gP5
// @from(Ln 264, Col 14)
UP5
// @from(Ln 264, Col 19)
kB6
// @from(Ln 264, Col 24)
vD7
// @from(Ln 265, Col 4)
TD7 = L(() => {
    zY6();
    GD7 = Object.prototype, gP5 = GD7.hasOwnProperty, UP5 = GD7.toString, kB6 = x0 ? x0.toStringTag : void 0;
    vD7 = QP5
})
// @from(Ln 271, Col 0)
function lP5(q) {
    return cP5.call(q)
}
// @from(Ln 274, Col 4)
dP5
// @from(Ln 274, Col 9)
cP5
// @from(Ln 274, Col 14)
VD7
// @from(Ln 275, Col 4)
kD7 = L(() => {
    dP5 = Object.prototype, cP5 = dP5.toString;
    VD7 = lP5
})
// @from(Ln 280, Col 0)
function rP5(q) {
    if (q == null) return q === void 0 ? iP5 : nP5;
    return ND7 && ND7 in Object(q) ? vD7(q) : VD7(q)
}
// @from(Ln 284, Col 4)
nP5 = "[object Null]"
// @from(Ln 285, Col 4)
iP5 = "[object Undefined]"
// @from(Ln 286, Col 4)
ND7
// @from(Ln 286, Col 9)
QL
// @from(Ln 287, Col 4)
YY6 = L(() => {
    zY6();
    TD7();
    kD7();
    ND7 = x0 ? x0.toStringTag : void 0;
    QL = rP5
})
// @from(Ln 295, Col 0)
function oP5(q) {
    var K = typeof q;
    return q != null && (K == "object" || K == "function")
}
// @from(Ln 299, Col 4)
xO
// @from(Ln 300, Col 4)
zV = L(() => {
    xO = oP5
})
// @from(Ln 304, Col 0)
function qW5(q) {
    if (!xO(q)) return !1;
    var K = QL(q);
    return K == sP5 || K == tP5 || K == aP5 || K == eP5
}
// @from(Ln 309, Col 4)
aP5 = "[object AsyncFunction]"
// @from(Ln 310, Col 4)
sP5 = "[object Function]"
// @from(Ln 311, Col 4)
tP5 = "[object GeneratorFunction]"
// @from(Ln 312, Col 4)
eP5 = "[object Proxy]"
// @from(Ln 313, Col 4)
qD6
// @from(Ln 314, Col 4)
oA8 = L(() => {
    YY6();
    zV();
    qD6 = qW5
})
// @from(Ln 319, Col 4)
KW5
// @from(Ln 319, Col 9)
aA8
// @from(Ln 320, Col 4)
ED7 = L(() => {
    GC();
    KW5 = oJ["__core-js_shared__"], aA8 = KW5
})
// @from(Ln 325, Col 0)
function _W5(q) {
    return !!yD7 && yD7 in q
}
// @from(Ln 328, Col 4)
yD7
// @from(Ln 328, Col 9)
LD7
// @from(Ln 329, Col 4)
hD7 = L(() => {
    ED7();
    yD7 = function() {
        var q = /[^.]+$/.exec(aA8 && aA8.keys && aA8.keys.IE_PROTO || "");
        return q ? "Symbol(src)_1." + q : ""
    }();
    LD7 = _W5
})
// @from(Ln 338, Col 0)
function AW5(q) {
    if (q != null) {
        try {
            return YW5.call(q)
        } catch (K) {}
        try {
            return q + ""
        } catch (K) {}
    }
    return ""
}
// @from(Ln 349, Col 4)
zW5
// @from(Ln 349, Col 9)
YW5
// @from(Ln 349, Col 14)
ki
// @from(Ln 350, Col 4)
se8 = L(() => {
    zW5 = Function.prototype, YW5 = zW5.toString;
    ki = AW5
})
// @from(Ln 355, Col 0)
function MW5(q) {
    if (!xO(q) || LD7(q)) return !1;
    var K = qD6(q) ? XW5 : wW5;
    return K.test(ki(q))
}
// @from(Ln 360, Col 4)
OW5
// @from(Ln 360, Col 9)
wW5
// @from(Ln 360, Col 14)
$W5
// @from(Ln 360, Col 19)
jW5
// @from(Ln 360, Col 24)
HW5
// @from(Ln 360, Col 29)
JW5
// @from(Ln 360, Col 34)
XW5
// @from(Ln 360, Col 39)
RD7
// @from(Ln 361, Col 4)
SD7 = L(() => {
    oA8();
    hD7();
    zV();
    se8();
    OW5 = /[\\^$.*+?()[\]{}|]/g, wW5 = /^\[object .+?Constructor\]$/, $W5 = Function.prototype, jW5 = Object.prototype, HW5 = $W5.toString, JW5 = jW5.hasOwnProperty, XW5 = RegExp("^" + HW5.call(JW5).replace(OW5, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    RD7 = MW5
})
// @from(Ln 370, Col 0)
function PW5(q, K) {
    return q == null ? void 0 : q[K]
}
// @from(Ln 373, Col 4)
CD7
// @from(Ln 374, Col 4)
bD7 = L(() => {
    CD7 = PW5
})
// @from(Ln 378, Col 0)
function WW5(q, K) {
    var _ = CD7(q, K);
    return RD7(_) ? _ : void 0
}
// @from(Ln 382, Col 4)
IN
// @from(Ln 383, Col 4)
D86 = L(() => {
    SD7();
    bD7();
    IN = WW5
})
// @from(Ln 388, Col 4)
DW5
// @from(Ln 388, Col 9)
Z86
// @from(Ln 389, Col 4)
sA8 = L(() => {
    D86();
    GC();
    DW5 = IN(oJ, "Map"), Z86 = DW5
})
// @from(Ln 394, Col 4)
ZW5
// @from(Ln 394, Col 9)
Ni
// @from(Ln 395, Col 4)
NB6 = L(() => {
    D86();
    ZW5 = IN(Object, "create"), Ni = ZW5
})
// @from(Ln 400, Col 0)
function fW5() {
    this.__data__ = Ni ? Ni(null) : {}, this.size = 0
}
// @from(Ln 403, Col 4)
ID7
// @from(Ln 404, Col 4)
xD7 = L(() => {
    NB6();
    ID7 = fW5
})
// @from(Ln 409, Col 0)
function GW5(q) {
    var K = this.has(q) && delete this.__data__[q];
    return this.size -= K ? 1 : 0, K
}
// @from(Ln 413, Col 4)
uD7
// @from(Ln 414, Col 4)
mD7 = L(() => {
    uD7 = GW5
})
// @from(Ln 418, Col 0)
function kW5(q) {
    var K = this.__data__;
    if (Ni) {
        var _ = K[q];
        return _ === vW5 ? void 0 : _
    }
    return VW5.call(K, q) ? K[q] : void 0
}
// @from(Ln 426, Col 4)
vW5 = "__lodash_hash_undefined__"
// @from(Ln 427, Col 4)
TW5
// @from(Ln 427, Col 9)
VW5
// @from(Ln 427, Col 14)
BD7
// @from(Ln 428, Col 4)
pD7 = L(() => {
    NB6();
    TW5 = Object.prototype, VW5 = TW5.hasOwnProperty;
    BD7 = kW5
})
// @from(Ln 434, Col 0)
function yW5(q) {
    var K = this.__data__;
    return Ni ? K[q] !== void 0 : EW5.call(K, q)
}
// @from(Ln 438, Col 4)
NW5
// @from(Ln 438, Col 9)
EW5
// @from(Ln 438, Col 14)
FD7
// @from(Ln 439, Col 4)
gD7 = L(() => {
    NB6();
    NW5 = Object.prototype, EW5 = NW5.hasOwnProperty;
    FD7 = yW5
})
// @from(Ln 445, Col 0)
function hW5(q, K) {
    var _ = this.__data__;
    return this.size += this.has(q) ? 0 : 1, _[q] = Ni && K === void 0 ? LW5 : K, this
}
// @from(Ln 449, Col 4)
LW5 = "__lodash_hash_undefined__"
// @from(Ln 450, Col 4)
UD7
// @from(Ln 451, Col 4)
QD7 = L(() => {
    NB6();
    UD7 = hW5
})
// @from(Ln 456, Col 0)
function KD6(q) {
    var K = -1,
        _ = q == null ? 0 : q.length;
    this.clear();
    while (++K < _) {
        var z = q[K];
        this.set(z[0], z[1])
    }
}
// @from(Ln 465, Col 4)
te8
// @from(Ln 466, Col 4)
dD7 = L(() => {
    xD7();
    mD7();
    pD7();
    gD7();
    QD7();
    KD6.prototype.clear = ID7;
    KD6.prototype.delete = uD7;
    KD6.prototype.get = BD7;
    KD6.prototype.has = FD7;
    KD6.prototype.set = UD7;
    te8 = KD6
})
// @from(Ln 480, Col 0)
function RW5() {
    this.size = 0, this.__data__ = {
        hash: new te8,
        map: new(Z86 || W86),
        string: new te8
    }
}
// @from(Ln 487, Col 4)
cD7
// @from(Ln 488, Col 4)
lD7 = L(() => {
    dD7();
    VB6();
    sA8();
    cD7 = RW5
})
// @from(Ln 495, Col 0)
function SW5(q) {
    var K = typeof q;
    return K == "string" || K == "number" || K == "symbol" || K == "boolean" ? q !== "__proto__" : q === null
}
// @from(Ln 499, Col 4)
nD7
// @from(Ln 500, Col 4)
iD7 = L(() => {
    nD7 = SW5
})
// @from(Ln 504, Col 0)
function CW5(q, K) {
    var _ = q.__data__;
    return nD7(K) ? _[typeof K == "string" ? "string" : "hash"] : _.map
}
// @from(Ln 508, Col 4)
f86
// @from(Ln 509, Col 4)
EB6 = L(() => {
    iD7();
    f86 = CW5
})
// @from(Ln 514, Col 0)
function bW5(q) {
    var K = f86(this, q).delete(q);
    return this.size -= K ? 1 : 0, K
}
// @from(Ln 518, Col 4)
rD7
// @from(Ln 519, Col 4)
oD7 = L(() => {
    EB6();
    rD7 = bW5
})
// @from(Ln 524, Col 0)
function IW5(q) {
    return f86(this, q).get(q)
}
// @from(Ln 527, Col 4)
aD7
// @from(Ln 528, Col 4)
sD7 = L(() => {
    EB6();
    aD7 = IW5
})
// @from(Ln 533, Col 0)
function xW5(q) {
    return f86(this, q).has(q)
}
// @from(Ln 536, Col 4)
tD7
// @from(Ln 537, Col 4)
eD7 = L(() => {
    EB6();
    tD7 = xW5
})
// @from(Ln 542, Col 0)
function uW5(q, K) {
    var _ = f86(this, q),
        z = _.size;
    return _.set(q, K), this.size += _.size == z ? 0 : 1, this
}
// @from(Ln 547, Col 4)
qZ7
// @from(Ln 548, Col 4)
KZ7 = L(() => {
    EB6();
    qZ7 = uW5
})
// @from(Ln 553, Col 0)
function _D6(q) {
    var K = -1,
        _ = q == null ? 0 : q.length;
    this.clear();
    while (++K < _) {
        var z = q[K];
        this.set(z[0], z[1])
    }
}
// @from(Ln 562, Col 4)
AY6
// @from(Ln 563, Col 4)
tA8 = L(() => {
    lD7();
    oD7();
    sD7();
    eD7();
    KZ7();
    _D6.prototype.clear = cD7;
    _D6.prototype.delete = rD7;
    _D6.prototype.get = aD7;
    _D6.prototype.has = tD7;
    _D6.prototype.set = qZ7;
    AY6 = _D6
})
// @from(Ln 577, Col 0)
function BW5(q, K) {
    var _ = this.__data__;
    if (_ instanceof W86) {
        var z = _.__data__;
        if (!Z86 || z.length < mW5 - 1) return z.push([q, K]), this.size = ++_.size, this;
        _ = this.__data__ = new AY6(z)
    }
    return _.set(q, K), this.size = _.size, this
}
// @from(Ln 586, Col 4)
mW5 = 200
// @from(Ln 587, Col 4)
_Z7
// @from(Ln 588, Col 4)
zZ7 = L(() => {
    VB6();
    sA8();
    tA8();
    _Z7 = BW5
})
// @from(Ln 595, Col 0)
function zD6(q) {
    var K = this.__data__ = new W86(q);
    this.size = K.size
}
// @from(Ln 599, Col 4)
mg
// @from(Ln 600, Col 4)
yB6 = L(() => {
    VB6();
    XD7();
    PD7();
    DD7();
    fD7();
    zZ7();
    zD6.prototype.clear = JD7;
    zD6.prototype.delete = MD7;
    zD6.prototype.get = WD7;
    zD6.prototype.has = ZD7;
    zD6.prototype.set = _Z7;
    mg = zD6
})
// @from(Ln 615, Col 0)
function FW5(q) {
    return this.__data__.set(q, pW5), this
}
// @from(Ln 618, Col 4)
pW5 = "__lodash_hash_undefined__"
// @from(Ln 619, Col 4)
YZ7
// @from(Ln 620, Col 4)
AZ7 = L(() => {
    YZ7 = FW5
})
// @from(Ln 624, Col 0)
function gW5(q) {
    return this.__data__.has(q)
}
// @from(Ln 627, Col 4)
OZ7
// @from(Ln 628, Col 4)
wZ7 = L(() => {
    OZ7 = gW5
})
// @from(Ln 632, Col 0)
function eA8(q) {
    var K = -1,
        _ = q == null ? 0 : q.length;
    this.__data__ = new AY6;
    while (++K < _) this.add(q[K])
}
// @from(Ln 638, Col 4)
qO8
// @from(Ln 639, Col 4)
ee8 = L(() => {
    tA8();
    AZ7();
    wZ7();
    eA8.prototype.add = eA8.prototype.push = YZ7;
    eA8.prototype.has = OZ7;
    qO8 = eA8
})
// @from(Ln 648, Col 0)
function UW5(q, K) {
    var _ = -1,
        z = q == null ? 0 : q.length;
    while (++_ < z)
        if (K(q[_], _, q)) return !0;
    return !1
}
// @from(Ln 655, Col 4)
$Z7
// @from(Ln 656, Col 4)
jZ7 = L(() => {
    $Z7 = UW5
})
// @from(Ln 660, Col 0)
function QW5(q, K) {
    return q.has(K)
}
// @from(Ln 663, Col 4)
KO8
// @from(Ln 664, Col 4)
q61 = L(() => {
    KO8 = QW5
})
// @from(Ln 668, Col 0)
function lW5(q, K, _, z, Y, A) {
    var O = _ & dW5,
        w = q.length,
        $ = K.length;
    if (w != $ && !(O && $ > w)) return !1;
    var j = A.get(q),
        H = A.get(K);
    if (j && H) return j == K && H == q;
    var J = -1,
        X = !0,
        M = _ & cW5 ? new qO8 : void 0;
    A.set(q, K), A.set(K, q);
    while (++J < w) {
        var P = q[J],
            W = K[J];
        if (z) var D = O ? z(W, P, J, K, q, A) : z(P, W, J, q, K, A);
        if (D !== void 0) {
            if (D) continue;
            X = !1;
            break
        }
        if (M) {
            if (!$Z7(K, function(Z, G) {
                    if (!KO8(M, G) && (P === Z || Y(P, Z, _, z, A))) return M.push(G)
                })) {
                X = !1;
                break
            }
        } else if (!(P === W || Y(P, W, _, z, A))) {
            X = !1;
            break
        }
    }
    return A.delete(q), A.delete(K), X
}
// @from(Ln 703, Col 4)
dW5 = 1
// @from(Ln 704, Col 4)
cW5 = 2
// @from(Ln 705, Col 4)
_O8
// @from(Ln 706, Col 4)
K61 = L(() => {
    ee8();
    jZ7();
    q61();
    _O8 = lW5
})
// @from(Ln 712, Col 4)
nW5
// @from(Ln 712, Col 9)
YD6
// @from(Ln 713, Col 4)
_61 = L(() => {
    GC();
    nW5 = oJ.Uint8Array, YD6 = nW5
})
// @from(Ln 718, Col 0)
function iW5(q) {
    var K = -1,
        _ = Array(q.size);
    return q.forEach(function(z, Y) {
        _[++K] = [Y, z]
    }), _
}
// @from(Ln 725, Col 4)
HZ7
// @from(Ln 726, Col 4)
JZ7 = L(() => {
    HZ7 = iW5
})
// @from(Ln 730, Col 0)
function rW5(q) {
    var K = -1,
        _ = Array(q.size);
    return q.forEach(function(z) {
        _[++K] = z
    }), _
}
// @from(Ln 737, Col 4)
AD6
// @from(Ln 738, Col 4)
zO8 = L(() => {
    AD6 = rW5
})
// @from(Ln 742, Col 0)
function $05(q, K, _, z, Y, A, O) {
    switch (_) {
        case w05:
            if (q.byteLength != K.byteLength || q.byteOffset != K.byteOffset) return !1;
            q = q.buffer, K = K.buffer;
        case O05:
            if (q.byteLength != K.byteLength || !A(new YD6(q), new YD6(K))) return !1;
            return !0;
        case sW5:
        case tW5:
        case K05:
            return ug(+q, +K);
        case eW5:
            return q.name == K.name && q.message == K.message;
        case _05:
        case Y05:
            return q == K + "";
        case q05:
            var w = HZ7;
        case z05:
            var $ = z & oW5;
            if (w || (w = AD6), q.size != K.size && !$) return !1;
            var j = O.get(q);
            if (j) return j == K;
            z |= aW5, O.set(q, K);
            var H = _O8(w(q), w(K), z, Y, A, O);
            return O.delete(q), H;
        case A05:
            if (z61) return z61.call(q) == z61.call(K)
    }
    return !1
}
// @from(Ln 774, Col 4)
oW5 = 1
// @from(Ln 775, Col 4)
aW5 = 2
// @from(Ln 776, Col 4)
sW5 = "[object Boolean]"
// @from(Ln 777, Col 4)
tW5 = "[object Date]"
// @from(Ln 778, Col 4)
eW5 = "[object Error]"
// @from(Ln 779, Col 4)
q05 = "[object Map]"
// @from(Ln 780, Col 4)
K05 = "[object Number]"
// @from(Ln 781, Col 4)
_05 = "[object RegExp]"
// @from(Ln 782, Col 4)
z05 = "[object Set]"
// @from(Ln 783, Col 4)
Y05 = "[object String]"
// @from(Ln 784, Col 4)
A05 = "[object Symbol]"
// @from(Ln 785, Col 4)
O05 = "[object ArrayBuffer]"
// @from(Ln 786, Col 4)
w05 = "[object DataView]"
// @from(Ln 787, Col 4)
XZ7
// @from(Ln 787, Col 9)
z61
// @from(Ln 787, Col 14)
MZ7
// @from(Ln 788, Col 4)
PZ7 = L(() => {
    zY6();
    _61();
    t06();
    K61();
    JZ7();
    zO8();
    XZ7 = x0 ? x0.prototype : void 0, z61 = XZ7 ? XZ7.valueOf : void 0;
    MZ7 = $05
})
// @from(Ln 799, Col 0)
function j05(q, K) {
    var _ = -1,
        z = K.length,
        Y = q.length;
    while (++_ < z) q[Y + _] = K[_];
    return q
}
// @from(Ln 806, Col 4)
OD6
// @from(Ln 807, Col 4)
YO8 = L(() => {
    OD6 = j05
})
// @from(Ln 810, Col 4)
H05
// @from(Ln 810, Col 9)
uO
// @from(Ln 811, Col 4)
YV = L(() => {
    H05 = Array.isArray, uO = H05
})
// @from(Ln 815, Col 0)
function J05(q, K, _) {
    var z = K(q);
    return uO(q) ? z : OD6(z, _(q))
}
// @from(Ln 819, Col 4)
AO8
// @from(Ln 820, Col 4)
Y61 = L(() => {
    YO8();
    YV();
    AO8 = J05
})
// @from(Ln 826, Col 0)
function X05(q, K) {
    var _ = -1,
        z = q == null ? 0 : q.length,
        Y = 0,
        A = [];
    while (++_ < z) {
        var O = q[_];
        if (K(O, _, q)) A[Y++] = O
    }
    return A
}
// @from(Ln 837, Col 4)
OO8
// @from(Ln 838, Col 4)
A61 = L(() => {
    OO8 = X05
})
// @from(Ln 842, Col 0)
function M05() {
    return []
}
// @from(Ln 845, Col 4)
wO8
// @from(Ln 846, Col 4)
O61 = L(() => {
    wO8 = M05
})
// @from(Ln 849, Col 4)
P05
// @from(Ln 849, Col 9)
W05
// @from(Ln 849, Col 14)
WZ7
// @from(Ln 849, Col 19)
D05
// @from(Ln 849, Col 24)
wD6
// @from(Ln 850, Col 4)
$O8 = L(() => {
    A61();
    O61();
    P05 = Object.prototype, W05 = P05.propertyIsEnumerable, WZ7 = Object.getOwnPropertySymbols, D05 = !WZ7 ? wO8 : function(q) {
        if (q == null) return [];
        return q = Object(q), OO8(WZ7(q), function(K) {
            return W05.call(q, K)
        })
    }, wD6 = D05
})
// @from(Ln 861, Col 0)
function Z05(q, K) {
    var _ = -1,
        z = Array(q);
    while (++_ < q) z[_] = K(_);
    return z
}
// @from(Ln 867, Col 4)
DZ7
// @from(Ln 868, Col 4)
ZZ7 = L(() => {
    DZ7 = Z05
})
// @from(Ln 872, Col 0)
function f05(q) {
    return q != null && typeof q == "object"
}
// @from(Ln 875, Col 4)
TW
// @from(Ln 876, Col 4)
Bg = L(() => {
    TW = f05
})
// @from(Ln 880, Col 0)
function v05(q) {
    return TW(q) && QL(q) == G05
}
// @from(Ln 883, Col 4)
G05 = "[object Arguments]"
// @from(Ln 884, Col 4)
w61
// @from(Ln 885, Col 4)
fZ7 = L(() => {
    YY6();
    Bg();
    w61 = v05
})
// @from(Ln 890, Col 4)
GZ7
// @from(Ln 890, Col 9)
T05
// @from(Ln 890, Col 14)
V05
// @from(Ln 890, Col 19)
k05
// @from(Ln 890, Col 24)
Ei
// @from(Ln 891, Col 4)
LB6 = L(() => {
    fZ7();
    Bg();
    GZ7 = Object.prototype, T05 = GZ7.hasOwnProperty, V05 = GZ7.propertyIsEnumerable, k05 = w61(function() {
        return arguments
    }()) ? w61 : function(q) {
        return TW(q) && T05.call(q, "callee") && !V05.call(q, "callee")
    }, Ei = k05
})
// @from(Ln 901, Col 0)
function N05() {
    return !1
}
// @from(Ln 904, Col 4)
vZ7
// @from(Ln 905, Col 4)
TZ7 = L(() => {
    vZ7 = N05
})
// @from(Ln 908, Col 4)
HO8 = {}
// @from(Ln 912, Col 4)
NZ7
// @from(Ln 912, Col 9)
VZ7
// @from(Ln 912, Col 14)
E05
// @from(Ln 912, Col 19)
kZ7
// @from(Ln 912, Col 24)
y05
// @from(Ln 912, Col 29)
L05
// @from(Ln 912, Col 34)
pg
// @from(Ln 913, Col 4)
hB6 = L(() => {
    GC();
    TZ7();
    NZ7 = typeof HO8 == "object" && HO8 && !HO8.nodeType && HO8, VZ7 = NZ7 && typeof jO8 == "object" && jO8 && !jO8.nodeType && jO8, E05 = VZ7 && VZ7.exports === NZ7, kZ7 = E05 ? oJ.Buffer : void 0, y05 = kZ7 ? kZ7.isBuffer : void 0, L05 = y05 || vZ7, pg = L05
})
// @from(Ln 919, Col 0)
function S05(q, K) {
    var _ = typeof q;
    return K = K == null ? h05 : K, !!K && (_ == "number" || _ != "symbol" && R05.test(q)) && (q > -1 && q % 1 == 0 && q < K)
}
// @from(Ln 923, Col 4)
h05 = 9007199254740991
// @from(Ln 924, Col 4)
R05
// @from(Ln 924, Col 9)
G86
// @from(Ln 925, Col 4)
RB6 = L(() => {
    R05 = /^(?:0|[1-9]\d*)$/;
    G86 = S05
})
// @from(Ln 930, Col 0)
function b05(q) {
    return typeof q == "number" && q > -1 && q % 1 == 0 && q <= C05
}
// @from(Ln 933, Col 4)
C05 = 9007199254740991
// @from(Ln 934, Col 4)
$D6
// @from(Ln 935, Col 4)
JO8 = L(() => {
    $D6 = b05
})
// @from(Ln 939, Col 0)
function zD5(q) {
    return TW(q) && $D6(q.length) && !!e$[QL(q)]
}
// @from(Ln 942, Col 4)
I05 = "[object Arguments]"
// @from(Ln 943, Col 4)
x05 = "[object Array]"
// @from(Ln 944, Col 4)
u05 = "[object Boolean]"
// @from(Ln 945, Col 4)
m05 = "[object Date]"
// @from(Ln 946, Col 4)
B05 = "[object Error]"
// @from(Ln 947, Col 4)
p05 = "[object Function]"
// @from(Ln 948, Col 4)
F05 = "[object Map]"
// @from(Ln 949, Col 4)
g05 = "[object Number]"
// @from(Ln 950, Col 4)
U05 = "[object Object]"
// @from(Ln 951, Col 4)
Q05 = "[object RegExp]"
// @from(Ln 952, Col 4)
d05 = "[object Set]"
// @from(Ln 953, Col 4)
c05 = "[object String]"
// @from(Ln 954, Col 4)
l05 = "[object WeakMap]"
// @from(Ln 955, Col 4)
n05 = "[object ArrayBuffer]"
// @from(Ln 956, Col 4)
i05 = "[object DataView]"
// @from(Ln 957, Col 4)
r05 = "[object Float32Array]"
// @from(Ln 958, Col 4)
o05 = "[object Float64Array]"
// @from(Ln 959, Col 4)
a05 = "[object Int8Array]"
// @from(Ln 960, Col 4)
s05 = "[object Int16Array]"
// @from(Ln 961, Col 4)
t05 = "[object Int32Array]"
// @from(Ln 962, Col 4)
e05 = "[object Uint8Array]"
// @from(Ln 963, Col 4)
qD5 = "[object Uint8ClampedArray]"
// @from(Ln 964, Col 4)
KD5 = "[object Uint16Array]"
// @from(Ln 965, Col 4)
_D5 = "[object Uint32Array]"
// @from(Ln 966, Col 4)
e$
// @from(Ln 966, Col 8)
EZ7
// @from(Ln 967, Col 4)
yZ7 = L(() => {
    YY6();
    JO8();
    Bg();
    e$ = {};
    e$[r05] = e$[o05] = e$[a05] = e$[s05] = e$[t05] = e$[e05] = e$[qD5] = e$[KD5] = e$[_D5] = !0;
    e$[I05] = e$[x05] = e$[n05] = e$[u05] = e$[i05] = e$[m05] = e$[B05] = e$[p05] = e$[F05] = e$[g05] = e$[U05] = e$[Q05] = e$[d05] = e$[c05] = e$[l05] = !1;
    EZ7 = zD5
})
// @from(Ln 977, Col 0)
function YD5(q) {
    return function(K) {
        return q(K)
    }
}
// @from(Ln 982, Col 4)
jD6
// @from(Ln 983, Col 4)
XO8 = L(() => {
    jD6 = YD5
})
// @from(Ln 986, Col 4)
PO8 = {}
// @from(Ln 990, Col 4)
LZ7
// @from(Ln 990, Col 9)
SB6
// @from(Ln 990, Col 14)
AD5
// @from(Ln 990, Col 19)
$61
// @from(Ln 990, Col 24)
OD5
// @from(Ln 990, Col 29)
Fg
// @from(Ln 991, Col 4)
WO8 = L(() => {
    ae8();
    LZ7 = typeof PO8 == "object" && PO8 && !PO8.nodeType && PO8, SB6 = LZ7 && typeof MO8 == "object" && MO8 && !MO8.nodeType && MO8, AD5 = SB6 && SB6.exports === LZ7, $61 = AD5 && rA8.process, OD5 = function() {
        try {
            var q = SB6 && SB6.require && SB6.require("util").types;
            if (q) return q;
            return $61 && $61.binding && $61.binding("util")
        } catch (K) {}
    }(), Fg = OD5
})
// @from(Ln 1001, Col 4)
hZ7
// @from(Ln 1001, Col 9)
wD5
// @from(Ln 1001, Col 14)
HD6
// @from(Ln 1002, Col 4)
DO8 = L(() => {
    yZ7();
    XO8();
    WO8();
    hZ7 = Fg && Fg.isTypedArray, wD5 = hZ7 ? jD6(hZ7) : EZ7, HD6 = wD5
})
// @from(Ln 1009, Col 0)
function HD5(q, K) {
    var _ = uO(q),
        z = !_ && Ei(q),
        Y = !_ && !z && pg(q),
        A = !_ && !z && !Y && HD6(q),
        O = _ || z || Y || A,
        w = O ? DZ7(q.length, String) : [],
        $ = w.length;
    for (var j in q)
        if ((K || jD5.call(q, j)) && !(O && (j == "length" || Y && (j == "offset" || j == "parent") || A && (j == "buffer" || j == "byteLength" || j == "byteOffset") || G86(j, $)))) w.push(j);
    return w
}
// @from(Ln 1021, Col 4)
$D5
// @from(Ln 1021, Col 9)
jD5
// @from(Ln 1021, Col 14)
ZO8
// @from(Ln 1022, Col 4)
j61 = L(() => {
    ZZ7();
    LB6();
    YV();
    hB6();
    RB6();
    DO8();
    $D5 = Object.prototype, jD5 = $D5.hasOwnProperty;
    ZO8 = HD5
})
// @from(Ln 1033, Col 0)
function XD5(q) {
    var K = q && q.constructor,
        _ = typeof K == "function" && K.prototype || JD5;
    return q === _
}
// @from(Ln 1038, Col 4)
JD5
// @from(Ln 1038, Col 9)
JD6
// @from(Ln 1039, Col 4)
fO8 = L(() => {
    JD5 = Object.prototype;
    JD6 = XD5
})
// @from(Ln 1044, Col 0)
function MD5(q, K) {
    return function(_) {
        return q(K(_))
    }
}
// @from(Ln 1049, Col 4)
GO8
// @from(Ln 1050, Col 4)
H61 = L(() => {
    GO8 = MD5
})
// @from(Ln 1053, Col 4)
PD5
// @from(Ln 1053, Col 9)
RZ7
// @from(Ln 1054, Col 4)
SZ7 = L(() => {
    H61();
    PD5 = GO8(Object.keys, Object), RZ7 = PD5
})
// @from(Ln 1059, Col 0)
function ZD5(q) {
    if (!JD6(q)) return RZ7(q);
    var K = [];
    for (var _ in Object(q))
        if (DD5.call(q, _) && _ != "constructor") K.push(_);
    return K
}
// @from(Ln 1066, Col 4)
WD5
// @from(Ln 1066, Col 9)
DD5
// @from(Ln 1066, Col 14)
CZ7
// @from(Ln 1067, Col 4)
bZ7 = L(() => {
    fO8();
    SZ7();
    WD5 = Object.prototype, DD5 = WD5.hasOwnProperty;
    CZ7 = ZD5
})
// @from(Ln 1074, Col 0)
function fD5(q) {
    return q != null && $D6(q.length) && !qD6(q)
}
// @from(Ln 1077, Col 4)
gg
// @from(Ln 1078, Col 4)
XD6 = L(() => {
    oA8();
    JO8();
    gg = fD5
})
// @from(Ln 1084, Col 0)
function GD5(q) {
    return gg(q) ? ZO8(q) : CZ7(q)
}
// @from(Ln 1087, Col 4)
vC
// @from(Ln 1088, Col 4)
OY6 = L(() => {
    j61();
    bZ7();
    XD6();
    vC = GD5
})
// @from(Ln 1095, Col 0)
function vD5(q) {
    return AO8(q, vC, wD6)
}
// @from(Ln 1098, Col 4)
CB6
// @from(Ln 1099, Col 4)
J61 = L(() => {
    Y61();
    $O8();
    OY6();
    CB6 = vD5
})
// @from(Ln 1106, Col 0)
function ND5(q, K, _, z, Y, A) {
    var O = _ & TD5,
        w = CB6(q),
        $ = w.length,
        j = CB6(K),
        H = j.length;
    if ($ != H && !O) return !1;
    var J = $;
    while (J--) {
        var X = w[J];
        if (!(O ? X in K : kD5.call(K, X))) return !1
    }
    var M = A.get(q),
        P = A.get(K);
    if (M && P) return M == K && P == q;
    var W = !0;
    A.set(q, K), A.set(K, q);
    var D = O;
    while (++J < $) {
        X = w[J];
        var Z = q[X],
            G = K[X];
        if (z) var f = O ? z(G, Z, X, K, q, A) : z(Z, G, X, q, K, A);
        if (!(f === void 0 ? Z === G || Y(Z, G, _, z, A) : f)) {
            W = !1;
            break
        }
        D || (D = X == "constructor")
    }
    if (W && !D) {
        var v = q.constructor,
            V = K.constructor;
        if (v != V && (("constructor" in q) && ("constructor" in K)) && !(typeof v == "function" && v instanceof v && typeof V == "function" && V instanceof V)) W = !1
    }
    return A.delete(q), A.delete(K), W
}
// @from(Ln 1142, Col 4)
TD5 = 1
// @from(Ln 1143, Col 4)
VD5
// @from(Ln 1143, Col 9)
kD5
// @from(Ln 1143, Col 14)
IZ7
// @from(Ln 1144, Col 4)
xZ7 = L(() => {
    J61();
    VD5 = Object.prototype, kD5 = VD5.hasOwnProperty;
    IZ7 = ND5
})
// @from(Ln 1149, Col 4)
ED5
// @from(Ln 1149, Col 9)
vO8
// @from(Ln 1150, Col 4)
uZ7 = L(() => {
    D86();
    GC();
    ED5 = IN(oJ, "DataView"), vO8 = ED5
})
// @from(Ln 1155, Col 4)
yD5
// @from(Ln 1155, Col 9)
TO8
// @from(Ln 1156, Col 4)
mZ7 = L(() => {
    D86();
    GC();
    yD5 = IN(oJ, "Promise"), TO8 = yD5
})
// @from(Ln 1161, Col 4)
LD5
// @from(Ln 1161, Col 9)
v86
// @from(Ln 1162, Col 4)
X61 = L(() => {
    D86();
    GC();
    LD5 = IN(oJ, "Set"), v86 = LD5
})
// @from(Ln 1167, Col 4)
hD5
// @from(Ln 1167, Col 9)
VO8
// @from(Ln 1168, Col 4)
BZ7 = L(() => {
    D86();
    GC();
    hD5 = IN(oJ, "WeakMap"), VO8 = hD5
})
// @from(Ln 1173, Col 4)
pZ7 = "[object Map]"
// @from(Ln 1174, Col 4)
RD5 = "[object Object]"
// @from(Ln 1175, Col 4)
FZ7 = "[object Promise]"
// @from(Ln 1176, Col 4)
gZ7 = "[object Set]"
// @from(Ln 1177, Col 4)
UZ7 = "[object WeakMap]"
// @from(Ln 1178, Col 4)
QZ7 = "[object DataView]"
// @from(Ln 1179, Col 4)
SD5
// @from(Ln 1179, Col 9)
CD5
// @from(Ln 1179, Col 14)
bD5
// @from(Ln 1179, Col 19)
ID5
// @from(Ln 1179, Col 24)
xD5
// @from(Ln 1179, Col 29)
wY6
// @from(Ln 1179, Col 34)
yi
// @from(Ln 1180, Col 4)
bB6 = L(() => {
    uZ7();
    sA8();
    mZ7();
    X61();
    BZ7();
    YY6();
    se8();
    SD5 = ki(vO8), CD5 = ki(Z86), bD5 = ki(TO8), ID5 = ki(v86), xD5 = ki(VO8), wY6 = QL;
    if (vO8 && wY6(new vO8(new ArrayBuffer(1))) != QZ7 || Z86 && wY6(new Z86) != pZ7 || TO8 && wY6(TO8.resolve()) != FZ7 || v86 && wY6(new v86) != gZ7 || VO8 && wY6(new VO8) != UZ7) wY6 = function(q) {
        var K = QL(q),
            _ = K == RD5 ? q.constructor : void 0,
            z = _ ? ki(_) : "";
        if (z) switch (z) {
            case SD5:
                return QZ7;
            case CD5:
                return pZ7;
            case bD5:
                return FZ7;
            case ID5:
                return gZ7;
            case xD5:
                return UZ7
        }
        return K
    };
    yi = wY6
})
// @from(Ln 1210, Col 0)
function BD5(q, K, _, z, Y, A) {
    var O = uO(q),
        w = uO(K),
        $ = O ? cZ7 : yi(q),
        j = w ? cZ7 : yi(K);
    $ = $ == dZ7 ? kO8 : $, j = j == dZ7 ? kO8 : j;
    var H = $ == kO8,
        J = j == kO8,
        X = $ == j;
    if (X && pg(q)) {
        if (!pg(K)) return !1;
        O = !0, H = !1
    }
    if (X && !H) return A || (A = new mg), O || HD6(q) ? _O8(q, K, _, z, Y, A) : MZ7(q, K, $, _, z, Y, A);
    if (!(_ & uD5)) {
        var M = H && lZ7.call(q, "__wrapped__"),
            P = J && lZ7.call(K, "__wrapped__");
        if (M || P) {
            var W = M ? q.value() : q,
                D = P ? K.value() : K;
            return A || (A = new mg), Y(W, D, _, z, A)
        }
    }
    if (!X) return !1;
    return A || (A = new mg), IZ7(q, K, _, z, Y, A)
}
// @from(Ln 1236, Col 4)
uD5 = 1
// @from(Ln 1237, Col 4)
dZ7 = "[object Arguments]"
// @from(Ln 1238, Col 4)
cZ7 = "[object Array]"
// @from(Ln 1239, Col 4)
kO8 = "[object Object]"
// @from(Ln 1240, Col 4)
mD5
// @from(Ln 1240, Col 9)
lZ7
// @from(Ln 1240, Col 14)
nZ7
// @from(Ln 1241, Col 4)
iZ7 = L(() => {
    yB6();
    K61();
    PZ7();
    xZ7();
    bB6();
    YV();
    hB6();
    DO8();
    mD5 = Object.prototype, lZ7 = mD5.hasOwnProperty;
    nZ7 = BD5
})
// @from(Ln 1254, Col 0)
function rZ7(q, K, _, z, Y) {
    if (q === K) return !0;
    if (q == null || K == null || !TW(q) && !TW(K)) return q !== q && K !== K;
    return nZ7(q, K, _, z, rZ7, Y)
}
// @from(Ln 1259, Col 4)
MD6
// @from(Ln 1260, Col 4)
NO8 = L(() => {
    iZ7();
    Bg();
    MD6 = rZ7
})
// @from(Ln 1266, Col 0)
function gD5(q, K, _, z) {
    var Y = _.length,
        A = Y,
        O = !z;
    if (q == null) return !A;
    q = Object(q);
    while (Y--) {
        var w = _[Y];
        if (O && w[2] ? w[1] !== q[w[0]] : !(w[0] in q)) return !1
    }
    while (++Y < A) {
        w = _[Y];
        var $ = w[0],
            j = q[$],
            H = w[1];
        if (O && w[2]) {
            if (j === void 0 && !($ in q)) return !1
        } else {
            var J = new mg;
            if (z) var X = z(j, H, $, q, K, J);
            if (!(X === void 0 ? MD6(H, j, pD5 | FD5, z, J) : X)) return !1
        }
    }
    return !0
}
// @from(Ln 1291, Col 4)
pD5 = 1
// @from(Ln 1292, Col 4)
FD5 = 2
// @from(Ln 1293, Col 4)
oZ7
// @from(Ln 1294, Col 4)
aZ7 = L(() => {
    yB6();
    NO8();
    oZ7 = gD5
})
// @from(Ln 1300, Col 0)
function UD5(q) {
    return q === q && !xO(q)
}
// @from(Ln 1303, Col 4)
EO8
// @from(Ln 1304, Col 4)
M61 = L(() => {
    zV();
    EO8 = UD5
})
// @from(Ln 1309, Col 0)
function QD5(q) {
    var K = vC(q),
        _ = K.length;
    while (_--) {
        var z = K[_],
            Y = q[z];
        K[_] = [z, Y, EO8(Y)]
    }
    return K
}
// @from(Ln 1319, Col 4)
sZ7
// @from(Ln 1320, Col 4)
tZ7 = L(() => {
    M61();
    OY6();
    sZ7 = QD5
})
// @from(Ln 1326, Col 0)
function dD5(q, K) {
    return function(_) {
        if (_ == null) return !1;
        return _[q] === K && (K !== void 0 || (q in Object(_)))
    }
}
// @from(Ln 1332, Col 4)
yO8
// @from(Ln 1333, Col 4)
P61 = L(() => {
    yO8 = dD5
})
// @from(Ln 1337, Col 0)
function cD5(q) {
    var K = sZ7(q);
    if (K.length == 1 && K[0][2]) return yO8(K[0][0], K[0][1]);
    return function(_) {
        return _ === q || oZ7(_, q, K)
    }
}
// @from(Ln 1344, Col 4)
eZ7
// @from(Ln 1345, Col 4)
qf7 = L(() => {
    aZ7();
    tZ7();
    P61();
    eZ7 = cD5
})
// @from(Ln 1352, Col 0)
function nD5(q) {
    return typeof q == "symbol" || TW(q) && QL(q) == lD5
}
// @from(Ln 1355, Col 4)
lD5 = "[object Symbol]"
// @from(Ln 1356, Col 4)
T86
// @from(Ln 1357, Col 4)
IB6 = L(() => {
    YY6();
    Bg();
    T86 = nD5
})
// @from(Ln 1363, Col 0)
function oD5(q, K) {
    if (uO(q)) return !1;
    var _ = typeof q;
    if (_ == "number" || _ == "symbol" || _ == "boolean" || q == null || T86(q)) return !0;
    return rD5.test(q) || !iD5.test(q) || K != null && q in Object(K)
}
// @from(Ln 1369, Col 4)
iD5
// @from(Ln 1369, Col 9)
rD5
// @from(Ln 1369, Col 14)
PD6
// @from(Ln 1370, Col 4)
LO8 = L(() => {
    YV();
    IB6();
    iD5 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, rD5 = /^\w*$/;
    PD6 = oD5
})
// @from(Ln 1377, Col 0)
function W61(q, K) {
    if (typeof q != "function" || K != null && typeof K != "function") throw TypeError(aD5);
    var _ = function() {
        var z = arguments,
            Y = K ? K.apply(this, z) : z[0],
            A = _.cache;
        if (A.has(Y)) return A.get(Y);
        var O = q.apply(this, z);
        return _.cache = A.set(Y, O) || A, O
    };
    return _.cache = new(W61.Cache || AY6), _
}
// @from(Ln 1389, Col 4)
aD5 = "Expected a function"
// @from(Ln 1390, Col 4)
P1
// @from(Ln 1391, Col 4)
U4 = L(() => {
    tA8();
    W61.Cache = AY6;
    P1 = W61
})
// @from(Ln 1397, Col 0)
function tD5(q) {
    var K = P1(q, function(z) {
            if (_.size === sD5) _.clear();
            return z
        }),
        _ = K.cache;
    return K
}
// @from(Ln 1405, Col 4)
sD5 = 500
// @from(Ln 1406, Col 4)
Kf7
// @from(Ln 1407, Col 4)
_f7 = L(() => {
    U4();
    Kf7 = tD5
})
// @from(Ln 1411, Col 4)
eD5
// @from(Ln 1411, Col 9)
qZ5
// @from(Ln 1411, Col 14)
KZ5
// @from(Ln 1411, Col 19)
zf7
// @from(Ln 1412, Col 4)
Yf7 = L(() => {
    _f7();
    eD5 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, qZ5 = /\\(\\)?/g, KZ5 = Kf7(function(q) {
        var K = [];
        if (q.charCodeAt(0) === 46) K.push("");
        return q.replace(eD5, function(_, z, Y, A) {
            K.push(Y ? A.replace(qZ5, "$1") : z || _)
        }), K
    }), zf7 = KZ5
})
// @from(Ln 1423, Col 0)
function _Z5(q, K) {
    var _ = -1,
        z = q == null ? 0 : q.length,
        Y = Array(z);
    while (++_ < z) Y[_] = K(q[_], _, q);
    return Y
}
// @from(Ln 1430, Col 4)
V86
// @from(Ln 1431, Col 4)
xB6 = L(() => {
    V86 = _Z5
})
// @from(Ln 1435, Col 0)
function wf7(q) {
    if (typeof q == "string") return q;
    if (uO(q)) return V86(q, wf7) + "";
    if (T86(q)) return Of7 ? Of7.call(q) : "";
    var K = q + "";
    return K == "0" && 1 / q == -zZ5 ? "-0" : K
}
// @from(Ln 1442, Col 4)
zZ5 = 1 / 0
// @from(Ln 1443, Col 4)
Af7
// @from(Ln 1443, Col 9)
Of7
// @from(Ln 1443, Col 14)
$f7
// @from(Ln 1444, Col 4)
jf7 = L(() => {
    zY6();
    xB6();
    YV();
    IB6();
    Af7 = x0 ? x0.prototype : void 0, Of7 = Af7 ? Af7.toString : void 0;
    $f7 = wf7
})
// @from(Ln 1453, Col 0)
function YZ5(q) {
    return q == null ? "" : $f7(q)
}
// @from(Ln 1456, Col 4)
WD6
// @from(Ln 1457, Col 4)
hO8 = L(() => {
    jf7();
    WD6 = YZ5
})
// @from(Ln 1462, Col 0)
function AZ5(q, K) {
    if (uO(q)) return q;
    return PD6(q, K) ? [q] : zf7(WD6(q))
}
// @from(Ln 1466, Col 4)
TC
// @from(Ln 1467, Col 4)
$Y6 = L(() => {
    YV();
    LO8();
    Yf7();
    hO8();
    TC = AZ5
})
// @from(Ln 1475, Col 0)
function wZ5(q) {
    if (typeof q == "string" || T86(q)) return q;
    var K = q + "";
    return K == "0" && 1 / q == -OZ5 ? "-0" : K
}
// @from(Ln 1480, Col 4)
OZ5 = 1 / 0
// @from(Ln 1481, Col 4)
VC
// @from(Ln 1482, Col 4)
jY6 = L(() => {
    IB6();
    VC = wZ5
})
// @from(Ln 1487, Col 0)
function $Z5(q, K) {
    K = TC(K, q);
    var _ = 0,
        z = K.length;
    while (q != null && _ < z) q = q[VC(K[_++])];
    return _ && _ == z ? q : void 0
}
// @from(Ln 1494, Col 4)
k86
// @from(Ln 1495, Col 4)
uB6 = L(() => {
    $Y6();
    jY6();
    k86 = $Z5
})
// @from(Ln 1501, Col 0)
function jZ5(q, K, _) {
    var z = q == null ? void 0 : k86(q, K);
    return z === void 0 ? _ : z
}
// @from(Ln 1505, Col 4)
Hf7
// @from(Ln 1506, Col 4)
Jf7 = L(() => {
    uB6();
    Hf7 = jZ5
})
// @from(Ln 1511, Col 0)
function HZ5(q, K) {
    return q != null && K in Object(q)
}
// @from(Ln 1514, Col 4)
Xf7
// @from(Ln 1515, Col 4)
Mf7 = L(() => {
    Xf7 = HZ5
})
// @from(Ln 1519, Col 0)
function JZ5(q, K, _) {
    K = TC(K, q);
    var z = -1,
        Y = K.length,
        A = !1;
    while (++z < Y) {
        var O = VC(K[z]);
        if (!(A = q != null && _(q, O))) break;
        q = q[O]
    }
    if (A || ++z != Y) return A;
    return Y = q == null ? 0 : q.length, !!Y && $D6(Y) && G86(O, Y) && (uO(q) || Ei(q))
}
// @from(Ln 1532, Col 4)
Pf7
// @from(Ln 1533, Col 4)
Wf7 = L(() => {
    $Y6();
    LB6();
    YV();
    RB6();
    JO8();
    jY6();
    Pf7 = JZ5
})
// @from(Ln 1543, Col 0)
function XZ5(q, K) {
    return q != null && Pf7(q, K, Xf7)
}
// @from(Ln 1546, Col 4)
Df7
// @from(Ln 1547, Col 4)
Zf7 = L(() => {
    Mf7();
    Wf7();
    Df7 = XZ5
})
// @from(Ln 1553, Col 0)
function WZ5(q, K) {
    if (PD6(q) && EO8(K)) return yO8(VC(q), K);
    return function(_) {
        var z = Hf7(_, q);
        return z === void 0 && z === K ? Df7(_, q) : MD6(K, z, MZ5 | PZ5)
    }
}
// @from(Ln 1560, Col 4)
MZ5 = 1
// @from(Ln 1561, Col 4)
PZ5 = 2
// @from(Ln 1562, Col 4)
ff7
// @from(Ln 1563, Col 4)
Gf7 = L(() => {
    NO8();
    Jf7();
    Zf7();
    LO8();
    M61();
    P61();
    jY6();
    ff7 = WZ5
})
// @from(Ln 1574, Col 0)
function DZ5(q) {
    return q
}
// @from(Ln 1577, Col 4)
DD6
// @from(Ln 1578, Col 4)
RO8 = L(() => {
    DD6 = DZ5
})
// @from(Ln 1582, Col 0)
function ZZ5(q) {
    return function(K) {
        return K == null ? void 0 : K[q]
    }
}
// @from(Ln 1587, Col 4)
vf7
// @from(Ln 1588, Col 4)
Tf7 = L(() => {
    vf7 = ZZ5
})
// @from(Ln 1592, Col 0)
function fZ5(q) {
    return function(K) {
        return k86(K, q)
    }
}
// @from(Ln 1597, Col 4)
Vf7
// @from(Ln 1598, Col 4)
kf7 = L(() => {
    uB6();
    Vf7 = fZ5
})
// @from(Ln 1603, Col 0)
function GZ5(q) {
    return PD6(q) ? vf7(VC(q)) : Vf7(q)
}
// @from(Ln 1606, Col 4)
Nf7
// @from(Ln 1607, Col 4)
Ef7 = L(() => {
    Tf7();
    kf7();
    LO8();
    jY6();
    Nf7 = GZ5
})
// @from(Ln 1615, Col 0)
function vZ5(q) {
    if (typeof q == "function") return q;
    if (q == null) return DD6;
    if (typeof q == "object") return uO(q) ? ff7(q[0], q[1]) : eZ7(q);
    return Nf7(q)
}
// @from(Ln 1621, Col 4)
xN
// @from(Ln 1622, Col 4)
N86 = L(() => {
    qf7();
    Gf7();
    RO8();
    YV();
    Ef7();
    xN = vZ5
})
// @from(Ln 1631, Col 0)
function TZ5(q, K) {
    var _, z = -1,
        Y = q.length;
    while (++z < Y) {
        var A = K(q[z]);
        if (A !== void 0) _ = _ === void 0 ? A : _ + A
    }
    return _
}
// @from(Ln 1640, Col 4)
yf7
// @from(Ln 1641, Col 4)
Lf7 = L(() => {
    yf7 = TZ5
})
// @from(Ln 1645, Col 0)
function VZ5(q, K) {
    return q && q.length ? yf7(q, xN(K, 2)) : 0
}
// @from(Ln 1648, Col 4)
ZD6
// @from(Ln 1649, Col 4)
hf7 = L(() => {
    N86();
    Lf7();
    ZD6 = VZ5
})
// @from(Ln 1657, Col 4)
D61 = () => {}
// @from(Ln 1659, Col 0)
function Rf7() {
    return Z61
}
// @from(Ln 1663, Col 0)
function Sf7(q) {
    Z61 = q
}
// @from(Ln 1667, Col 0)
function Cf7(q) {
    return SO8.has(q) ? SO8.get(q) : void 0
}
// @from(Ln 1671, Col 0)
function bf7(q, K) {
    SO8.set(q, K)
}
// @from(Ln 1675, Col 0)
function If7(q) {
    return f61.get(q)
}
// @from(Ln 1679, Col 0)
function xf7(q, K) {
    f61.set(q, K)
}
// @from(Ln 1683, Col 0)
function u0() {
    Z61 = null, SO8.clear(), f61.clear()
}
// @from(Ln 1687, Col 0)
function CO8() {
    return G61
}
// @from(Ln 1691, Col 0)
function mf7(q) {
    G61 = q, uf7 = !0
}
// @from(Ln 1695, Col 0)
function Bf7() {
    G61 = void 0
}
// @from(Ln 1699, Col 0)
function pf7() {
    return uf7
}
// @from(Ln 1702, Col 4)
Z61 = null
// @from(Ln 1703, Col 4)
SO8
// @from(Ln 1703, Col 9)
f61
// @from(Ln 1703, Col 14)
G61
// @from(Ln 1703, Col 19)
uf7 = !1
// @from(Ln 1704, Col 4)
Li = L(() => {
    SO8 = new Map;
    f61 = new Map
})
// @from(Ln 1709, Col 0)
function S6(q) {
    if (!q) return !1;
    if (typeof q === "boolean") return q;
    let K = String(q).toLowerCase().trim();
    return ["1", "true", "yes", "on"].includes(K)
}
// @from(Ln 1716, Col 0)
function c5(q) {
    if (q === void 0) return !1;
    if (typeof q === "boolean") return !q;
    let K = String(q).toLowerCase().trim();
    return ["0", "false", "no", "off"].includes(K)
}
// @from(Ln 1723, Col 0)
function l5() {
    let q = new Set;
    return {
        subscribe(K) {
            return q.add(K), () => {
                q.delete(K)
            }
        },
        emit(...K) {
            let _;
            for (let z of q) try {
                z(...K)
            } catch (Y) {
                (_ ??= []).push(Y)
            }
            if (_) throw _.length === 1 ? _[0] : AggregateError(_, "Signal listener(s) threw")
        },
        clear() {
            q.clear()
        }
    }
}
// @from(Ln 1745, Col 4)
bO8 = () => {}
// @from(Ln 1746, Col 4)
nH = L(() => {
    bO8()
})
// @from(Ln 1749, Col 4)
CD6 = {}
// @from(Ln 1977, Col 0)
function Qf7() {
    let q = "";
    if (typeof process < "u" && typeof process.cwd === "function" && typeof Ff7 === "function") {
        let _ = kZ5();
        try {
            q = Ff7(_).normalize("NFC")
        } catch {
            q = _.normalize("NFC")
        }
    }
    return {
        originalCwd: q,
        projectRoot: q,
        totalCostUSD: 0,
        totalAPIDuration: 0,
        totalAPIDurationWithoutRetries: 0,
        totalToolDuration: 0,
        startTime: Date.now(),
        lastInteractionTime: Date.now(),
        totalLinesAdded: 0,
        totalLinesRemoved: 0,
        hasUnknownModelCost: !1,
        cwd: q,
        modelUsage: {},
        mainLoopModelOverride: void 0,
        initialMainLoopModel: null,
        modelStrings: null,
        isInteractive: !1,
        hasStreamingInput: !1,
        kairosActive: !1,
        strictToolResultPairing: !1,
        memoryToggledOff: !1,
        teamMemoryServerStatus: void 0,
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
        sessionId: mB6(),
        parentSessionId: void 0,
        loggerProvider: null,
        eventLogger: null,
        meterProvider: null,
        tracerProvider: null,
        agentColorMap: new Map,
        agentColorIndex: 0,
        lastAPIRequest: null,
        lastAPIRequestMessages: null,
        lastClassifierRequests: null,
        cachedClaudeMdContent: null,
        inMemoryErrorLog: [],
        inlinePlugins: [],
        chromeFlagOverride: void 0,
        useCoworkPlugins: !1,
        sessionBypassPermissionsMode: !1,
        scheduledTasksEnabled: !1,
        sessionCronTasks: [],
        loopChainStartedAt: Object.create(null),
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
        sdkOAuthTokenRefreshCallback: null,
        mainThreadAgentType: void 0,
        isRemoteMode: !1,
        replBridgeActive: !1,
        directConnectServerUrl: void 0,
        activeRoutine: void 0,
        systemPromptSectionCache: new Map,
        lastEmittedDate: null,
        additionalDirectoriesForClaudeMd: [],
        allowedChannels: [],
        hasDevChannels: !1,
        sessionProjectDir: null,
        promptCache1hAllowlist: null,
        afkModeHeaderLatched: null,
        fastModeHeaderLatched: null,
        cacheEditingHeaderLatched: null,
        thinkingClearLatched: null,
        promptId: null,
        lastMainRequestId: void 0,
        lastApiCompletionTimestamp: null,
        pendingPostCompaction: !1
    }
}
// @from(Ln 2089, Col 0)
function I8() {
    return B8.sessionId
}
// @from(Ln 2093, Col 0)
function T61(q = {}) {
    if (q.setCurrentAsParent) B8.parentSessionId = B8.sessionId;
    return B8.planSlugCache.delete(B8.sessionId), B8.sessionId = mB6(), B8.sessionProjectDir = null, B8.sessionId
}
// @from(Ln 2098, Col 0)
function V61() {
    return B8.parentSessionId
}
// @from(Ln 2102, Col 0)
function SZ(q, K = null) {
    if (B8.sessionId !== q) B8.planSlugCache.delete(B8.sessionId);
    B8.sessionId = q, B8.sessionProjectDir = K, k61.emit(q)
}
// @from(Ln 2107, Col 0)
function E86() {
    return B8.sessionProjectDir
}
// @from(Ln 2111, Col 0)
function Y7() {
    return B8.originalCwd
}
// @from(Ln 2115, Col 0)
function c9() {
    return B8.projectRoot
}
// @from(Ln 2119, Col 0)
function dL(q) {
    B8.originalCwd = q.normalize("NFC")
}
// @from(Ln 2123, Col 0)
function pB6(q) {
    B8.projectRoot = q.normalize("NFC")
}
// @from(Ln 2127, Col 0)
function tu() {
    return B8.cwd
}
// @from(Ln 2131, Col 0)
function E61(q) {
    B8.cwd = q.normalize("NFC")
}
// @from(Ln 2135, Col 0)
function y61() {
    return B8.directConnectServerUrl
}
// @from(Ln 2139, Col 0)
function NZ5(q) {
    B8.directConnectServerUrl = q
}
// @from(Ln 2143, Col 0)
function EZ5() {
    return B8.activeRoutine
}
// @from(Ln 2147, Col 0)
function yZ5(q) {
    B8.activeRoutine = q
}
// @from(Ln 2151, Col 0)
function L61(q, K) {
    B8.totalAPIDuration += q, B8.totalAPIDurationWithoutRetries += K
}
// @from(Ln 2155, Col 0)
function LZ5() {
    B8.totalAPIDuration = 0, B8.totalAPIDurationWithoutRetries = 0, B8.totalCostUSD = 0
}
// @from(Ln 2159, Col 0)
function h61(q, K, _) {
    B8.modelUsage[_] = K, B8.totalCostUSD += q
}
// @from(Ln 2163, Col 0)
function nX() {
    return B8.totalCostUSD
}
// @from(Ln 2167, Col 0)
function VW() {
    return B8.totalAPIDuration
}
// @from(Ln 2171, Col 0)
function fD6() {
    return Date.now() - B8.startTime
}
// @from(Ln 2175, Col 0)
function R61() {
    return B8.totalAPIDurationWithoutRetries
}
// @from(Ln 2179, Col 0)
function S61() {
    return B8.totalToolDuration
}
// @from(Ln 2183, Col 0)
function xO8(q) {
    B8.totalToolDuration += q
}
// @from(Ln 2187, Col 0)
function y86() {
    return B8.statsStore
}
// @from(Ln 2191, Col 0)
function C61(q) {
    B8.statsStore = q
}
// @from(Ln 2195, Col 0)
function hi(q) {
    if (q) df7();
    else b61 = !0
}
// @from(Ln 2200, Col 0)
function I61() {
    if (b61) df7()
}
// @from(Ln 2204, Col 0)
function df7() {
    B8.lastInteractionTime = Date.now(), b61 = !1, x61.emit()
}
// @from(Ln 2208, Col 0)
function uO8(q, K) {
    B8.totalLinesAdded += q, B8.totalLinesRemoved += K
}
// @from(Ln 2212, Col 0)
function HY6() {
    return B8.totalLinesAdded
}
// @from(Ln 2216, Col 0)
function JY6() {
    return B8.totalLinesRemoved
}
// @from(Ln 2220, Col 0)
function XY6() {
    return ZD6(Object.values(B8.modelUsage), "inputTokens")
}
// @from(Ln 2224, Col 0)
function eu() {
    return ZD6(Object.values(B8.modelUsage), "outputTokens")
}
// @from(Ln 2228, Col 0)
function FB6() {
    return ZD6(Object.values(B8.modelUsage), "cacheReadInputTokens")
}
// @from(Ln 2232, Col 0)
function gB6() {
    return ZD6(Object.values(B8.modelUsage), "cacheCreationInputTokens")
}
// @from(Ln 2236, Col 0)
function m61() {
    return ZD6(Object.values(B8.modelUsage), "webSearchRequests")
}
// @from(Ln 2240, Col 0)
function hZ5() {
    return eu() - B61
}
// @from(Ln 2244, Col 0)
function RZ5() {
    return p61
}
// @from(Ln 2248, Col 0)
function SZ5(q) {
    B61 = eu(), p61 = q, mO8 = 0
}
// @from(Ln 2252, Col 0)
function CZ5() {
    return mO8
}
// @from(Ln 2256, Col 0)
function bZ5() {
    mO8++
}
// @from(Ln 2260, Col 0)
function BO8() {
    B8.hasUnknownModelCost = !0
}
// @from(Ln 2264, Col 0)
function F61() {
    return B8.hasUnknownModelCost
}
// @from(Ln 2268, Col 0)
function UB6() {
    return B8.lastMainRequestId
}
// @from(Ln 2272, Col 0)
function g61(q) {
    B8.lastMainRequestId = q
}
// @from(Ln 2276, Col 0)
function Ri() {
    return B8.lastApiCompletionTimestamp
}
// @from(Ln 2280, Col 0)
function QB6(q) {
    B8.lastApiCompletionTimestamp = q
}
// @from(Ln 2284, Col 0)
function GD6() {
    B8.pendingPostCompaction = !0
}
// @from(Ln 2288, Col 0)
function U61() {
    let q = B8.pendingPostCompaction;
    return B8.pendingPostCompaction = !1, q
}
// @from(Ln 2293, Col 0)
function AV() {
    return B8.lastInteractionTime
}
// @from(Ln 2297, Col 0)
function c61(q) {
    Q61 = q, d61.emit()
}
// @from(Ln 2301, Col 0)
function vD6() {
    return Q61
}
// @from(Ln 2305, Col 0)
function n61() {
    let q = vD6();
    if (q !== void 0) return q;
    return Date.now() - AV() < pO8
}
// @from(Ln 2311, Col 0)
function i61() {
    if (IO8 = !0, BB6) clearTimeout(BB6);
    BB6 = setTimeout(() => {
        IO8 = !1, BB6 = void 0
    }, cf7), BB6.unref?.()
}
// @from(Ln 2318, Col 0)
function MY6() {
    return IO8
}
// @from(Ln 2321, Col 0)
async function dB6() {
    while (IO8) await new Promise((q) => setTimeout(q, cf7).unref?.())
}
// @from(Ln 2325, Col 0)
function OV() {
    return B8.modelUsage
}
// @from(Ln 2329, Col 0)
function r61(q) {
    return B8.modelUsage[q]
}
// @from(Ln 2333, Col 0)
function qm() {
    return B8.mainLoopModelOverride
}
// @from(Ln 2337, Col 0)
function cB6() {
    return B8.initialMainLoopModel
}
// @from(Ln 2341, Col 0)
function kW(q) {
    B8.mainLoopModelOverride = q
}
// @from(Ln 2345, Col 0)
function o61(q) {
    B8.initialMainLoopModel = q
}
// @from(Ln 2349, Col 0)
function eM() {
    return B8.sdkBetas
}
// @from(Ln 2353, Col 0)
function a61(q) {
    B8.sdkBetas = q
}
// @from(Ln 2357, Col 0)
function TD6() {
    return B8.sdkOAuthTokenRefreshCallback
}
// @from(Ln 2361, Col 0)
function s61(q) {
    B8.sdkOAuthTokenRefreshCallback = q
}
// @from(Ln 2365, Col 0)
function VD6() {
    B8.totalCostUSD = 0, B8.totalAPIDuration = 0, B8.totalAPIDurationWithoutRetries = 0, B8.totalToolDuration = 0, B8.startTime = Date.now(), B8.totalLinesAdded = 0, B8.totalLinesRemoved = 0, B8.hasUnknownModelCost = !1, B8.modelUsage = {}, B8.promptId = null
}
// @from(Ln 2369, Col 0)
function lB6({
    totalCostUSD: q,
    totalAPIDuration: K,
    totalAPIDurationWithoutRetries: _,
    totalToolDuration: z,
    totalLinesAdded: Y,
    totalLinesRemoved: A,
    lastDuration: O,
    modelUsage: w
}) {
    if (B8.totalCostUSD = q, B8.totalAPIDuration = K, B8.totalAPIDurationWithoutRetries = _, B8.totalToolDuration = z, B8.totalLinesAdded = Y, B8.totalLinesRemoved = A, w) B8.modelUsage = w;
    if (O) B8.startTime = Date.now() - O
}
// @from(Ln 2383, Col 0)
function lf7() {
    throw Error("resetStateForTests can only be called in tests")
}
// @from(Ln 2387, Col 0)
function kD6() {
    return B8.modelStrings
}
// @from(Ln 2391, Col 0)
function nB6(q) {
    B8.modelStrings = q
}
// @from(Ln 2395, Col 0)
function IZ5() {
    B8.modelStrings = null
}
// @from(Ln 2399, Col 0)
function t61(q, K) {
    B8.meter = q, B8.sessionCounter = K("claude_code.session.count", {
        description: "Count of CLI sessions started"
    }), B8.locCounter = K("claude_code.lines_of_code.count", {
        description: "Count of lines of code modified, with the 'type' attribute indicating whether lines were added or removed"
    }), B8.prCounter = K("claude_code.pull_request.count", {
        description: "Number of pull requests created"
    }), B8.commitCounter = K("claude_code.commit.count", {
        description: "Number of git commits created"
    }), B8.costCounter = K("claude_code.cost.usage", {
        description: "Cost of the Claude Code session",
        unit: "USD"
    }), B8.tokenCounter = K("claude_code.token.usage", {
        description: "Number of tokens used",
        unit: "tokens"
    }), B8.codeEditToolDecisionCounter = K("claude_code.code_edit_tool.decision", {
        description: "Count of code editing tool permission decisions (accept/reject) for Edit, Write, and NotebookEdit tools"
    }), B8.activeTimeCounter = K("claude_code.active_time.total", {
        description: "Total active time in seconds",
        unit: "s"
    })
}
// @from(Ln 2422, Col 0)
function xZ5() {
    return B8.meter
}
// @from(Ln 2426, Col 0)
function e61() {
    return B8.sessionCounter
}
// @from(Ln 2430, Col 0)
function FO8() {
    return B8.locCounter
}
// @from(Ln 2434, Col 0)
function iB6() {
    return B8.prCounter
}
// @from(Ln 2438, Col 0)
function q81() {
    return B8.commitCounter
}
// @from(Ln 2442, Col 0)
function K81() {
    return B8.costCounter
}
// @from(Ln 2446, Col 0)
function ND6() {
    return B8.tokenCounter
}
// @from(Ln 2450, Col 0)
function rB6() {
    return B8.codeEditToolDecisionCounter
}
// @from(Ln 2454, Col 0)
function _81() {
    return B8.activeTimeCounter
}
// @from(Ln 2458, Col 0)
function oB6() {
    return B8.loggerProvider
}
// @from(Ln 2462, Col 0)
function gO8(q) {
    B8.loggerProvider = q
}
// @from(Ln 2466, Col 0)
function z81() {
    return B8.eventLogger
}
// @from(Ln 2470, Col 0)
function UO8(q) {
    B8.eventLogger = q
}
// @from(Ln 2474, Col 0)
function Y81() {
    return B8.meterProvider
}
// @from(Ln 2478, Col 0)
function QO8(q) {
    B8.meterProvider = q
}
// @from(Ln 2482, Col 0)
function PY6() {
    return B8.tracerProvider
}
// @from(Ln 2486, Col 0)
function dO8(q) {
    B8.tracerProvider = q
}
// @from(Ln 2490, Col 0)
function I7() {
    return !B8.isInteractive
}
// @from(Ln 2494, Col 0)
function wV() {
    return B8.isInteractive
}
// @from(Ln 2498, Col 0)
function A81(q) {
    B8.isInteractive = q
}
// @from(Ln 2502, Col 0)
function O81() {
    return B8.hasStreamingInput
}
// @from(Ln 2506, Col 0)
function w81(q) {
    B8.hasStreamingInput = q
}
// @from(Ln 2510, Col 0)
function ED6() {
    return B8.clientType
}
// @from(Ln 2514, Col 0)
function $81(q) {
    B8.clientType = q
}
// @from(Ln 2518, Col 0)
function Ug() {
    return B8.sdkAgentProgressSummariesEnabled
}
// @from(Ln 2522, Col 0)
function j81(q) {
    B8.sdkAgentProgressSummariesEnabled = q
}
// @from(Ln 2526, Col 0)
function aG() {
    return B8.kairosActive
}
// @from(Ln 2530, Col 0)
function uZ5(q) {
    B8.kairosActive = q
}
// @from(Ln 2534, Col 0)
function H81() {
    return B8.strictToolResultPairing
}
// @from(Ln 2538, Col 0)
function mZ5(q) {
    B8.strictToolResultPairing = q
}
// @from(Ln 2542, Col 0)
function Qg() {
    return B8.memoryToggledOff
}
// @from(Ln 2546, Col 0)
function J81(q) {
    B8.memoryToggledOff = q
}
// @from(Ln 2550, Col 0)
function X81() {
    return B8.teamMemoryServerStatus
}
// @from(Ln 2554, Col 0)
function yD6(q) {
    B8.teamMemoryServerStatus = q
}
// @from(Ln 2558, Col 0)
function cL() {
    return B8.userMsgOptIn
}
// @from(Ln 2562, Col 0)
function dg(q) {
    B8.userMsgOptIn = q
}
// @from(Ln 2566, Col 0)
function BZ5() {
    return B8.sessionSource
}
// @from(Ln 2570, Col 0)
function M81(q) {
    B8.sessionSource = q
}
// @from(Ln 2574, Col 0)
function cO8() {
    return B8.questionPreviewFormat
}
// @from(Ln 2578, Col 0)
function lO8(q) {
    B8.questionPreviewFormat = q
}
// @from(Ln 2582, Col 0)
function nO8() {
    return B8.agentColorMap
}
// @from(Ln 2586, Col 0)
function L86() {
    return B8.flagSettingsPath
}
// @from(Ln 2590, Col 0)
function P81(q) {
    B8.flagSettingsPath = q
}
// @from(Ln 2594, Col 0)
function aB6() {
    return B8.flagSettingsInline
}
// @from(Ln 2598, Col 0)
function W81(q) {
    B8.flagSettingsInline = q
}
// @from(Ln 2602, Col 0)
function D81() {
    return B8.sessionIngressToken
}
// @from(Ln 2606, Col 0)
function WY6(q) {
    B8.sessionIngressToken = q
}
// @from(Ln 2610, Col 0)
function Z81() {
    return B8.oauthTokenFromFd
}
// @from(Ln 2614, Col 0)
function f81(q) {
    B8.oauthTokenFromFd = q
}
// @from(Ln 2618, Col 0)
function G81() {
    return B8.apiKeyFromFd
}
// @from(Ln 2622, Col 0)
function v81(q) {
    B8.apiKeyFromFd = q
}
// @from(Ln 2626, Col 0)
function T81(q) {
    B8.lastAPIRequest = q
}
// @from(Ln 2630, Col 0)
function V81() {
    return B8.lastAPIRequest
}
// @from(Ln 2634, Col 0)
function k81(q) {
    B8.lastAPIRequestMessages = q
}
// @from(Ln 2638, Col 0)
function pZ5() {
    return B8.lastAPIRequestMessages
}
// @from(Ln 2642, Col 0)
function sB6(q) {
    B8.lastClassifierRequests = q
}
// @from(Ln 2646, Col 0)
function nf7() {
    return B8.lastClassifierRequests
}
// @from(Ln 2650, Col 0)
function N81(q) {
    B8.cachedClaudeMdContent = q
}
// @from(Ln 2654, Col 0)
function E81() {
    return B8.cachedClaudeMdContent
}
// @from(Ln 2658, Col 0)
function FZ5(q) {
    if (B8.inMemoryErrorLog.length >= 100) B8.inMemoryErrorLog.shift();
    B8.inMemoryErrorLog.push(q)
}
// @from(Ln 2663, Col 0)
function y81() {
    return B8.allowedSettingSources
}
// @from(Ln 2667, Col 0)
function L81(q) {
    B8.allowedSettingSources = q
}
// @from(Ln 2671, Col 0)
function tB6() {
    return I7() && B8.clientType !== "claude-vscode"
}
// @from(Ln 2675, Col 0)
function h81(q) {
    B8.inlinePlugins = q
}
// @from(Ln 2679, Col 0)
function cg() {
    return B8.inlinePlugins
}
// @from(Ln 2683, Col 0)
function R81(q) {
    B8.chromeFlagOverride = q
}
// @from(Ln 2687, Col 0)
function eB6() {
    return B8.chromeFlagOverride
}
// @from(Ln 2691, Col 0)
function lL(q) {
    B8.useCoworkPlugins = q, u0()
}
// @from(Ln 2695, Col 0)
function qp6() {
    return B8.useCoworkPlugins
}
// @from(Ln 2699, Col 0)
function S81(q) {
    B8.sessionBypassPermissionsMode = q
}
// @from(Ln 2703, Col 0)
function C81() {
    return B8.sessionBypassPermissionsMode
}
// @from(Ln 2707, Col 0)
function Si(q) {
    B8.scheduledTasksEnabled = q
}
// @from(Ln 2711, Col 0)
function LD6() {
    return B8.scheduledTasksEnabled
}
// @from(Ln 2715, Col 0)
function nL() {
    return B8.sessionCronTasks
}
// @from(Ln 2719, Col 0)
function DY6(q) {
    B8.sessionCronTasks.push(q)
}
// @from(Ln 2723, Col 0)
function b81(q) {
    return B8.loopChainStartedAt[q]
}
// @from(Ln 2727, Col 0)
function iO8(q, K) {
    B8.loopChainStartedAt[q] = K
}
// @from(Ln 2731, Col 0)
function gZ5(q) {
    delete B8.loopChainStartedAt[q]
}
// @from(Ln 2735, Col 0)
function Ci(q) {
    if (q.length === 0) return 0;
    let K = new Set(q),
        _ = B8.sessionCronTasks.filter((Y) => !K.has(Y.id)),
        z = B8.sessionCronTasks.length - _.length;
    if (z === 0) return 0;
    return B8.sessionCronTasks = _, z
}
// @from(Ln 2744, Col 0)
function Kp6(q) {
    B8.sessionTrustAccepted = q
}
// @from(Ln 2748, Col 0)
function hD6() {
    return B8.sessionTrustAccepted
}
// @from(Ln 2752, Col 0)
function I81(q) {
    B8.sessionPersistenceDisabled = q
}
// @from(Ln 2756, Col 0)
function uN() {
    return B8.sessionPersistenceDisabled
}
// @from(Ln 2760, Col 0)
function _p6() {
    return B8.hasExitedPlanMode
}
// @from(Ln 2764, Col 0)
function iL(q) {
    B8.hasExitedPlanMode = q
}
// @from(Ln 2768, Col 0)
function x81() {
    return B8.needsPlanModeExitAttachment
}
// @from(Ln 2772, Col 0)
function Km(q) {
    B8.needsPlanModeExitAttachment = q
}
// @from(Ln 2776, Col 0)
function bi(q, K) {
    if (K === "plan" && q !== "plan") B8.needsPlanModeExitAttachment = !1;
    if (q === "plan" && K !== "plan") B8.needsPlanModeExitAttachment = !0
}
// @from(Ln 2781, Col 0)
function u81() {
    return B8.needsAutoModeExitAttachment
}
// @from(Ln 2785, Col 0)
function sG(q) {
    B8.needsAutoModeExitAttachment = q
}
// @from(Ln 2789, Col 0)
function m81(q, K) {
    if (q === "auto" && K === "plan" || q === "plan" && K === "auto") return;
    let _ = q === "auto",
        z = K === "auto";
    if (z && !_) B8.needsAutoModeExitAttachment = !1;
    if (_ && !z) B8.needsAutoModeExitAttachment = !0
}
// @from(Ln 2797, Col 0)
function B81() {
    return B8.lspRecommendationShownThisSession
}
// @from(Ln 2801, Col 0)
function p81(q) {
    B8.lspRecommendationShownThisSession = q
}
// @from(Ln 2805, Col 0)
function F81(q) {
    B8.initJsonSchema = q
}
// @from(Ln 2809, Col 0)
function rO8() {
    return B8.initJsonSchema
}
// @from(Ln 2813, Col 0)
function Ii(q) {
    if (!B8.registeredHooks) B8.registeredHooks = {};
    for (let [K, _] of Object.entries(q)) {
        let z = K;
        if (!B8.registeredHooks[z]) B8.registeredHooks[z] = [];
        B8.registeredHooks[z].push(..._)
    }
}
// @from(Ln 2822, Col 0)
function rL() {
    return B8.registeredHooks
}
// @from(Ln 2826, Col 0)
function UZ5() {
    B8.registeredHooks = null
}
// @from(Ln 2830, Col 0)
function oO8() {
    if (!B8.registeredHooks) return;
    let q = {};
    for (let [K, _] of Object.entries(B8.registeredHooks)) {
        let z = _.filter((Y) => !("pluginRoot" in Y));
        if (z.length > 0) q[K] = z
    }
    B8.registeredHooks = Object.keys(q).length > 0 ? q : null
}
// @from(Ln 2840, Col 0)
function h86() {
    return B8.planSlugCache
}
// @from(Ln 2844, Col 0)
function zp6() {
    return B8.sessionCreatedTeams
}
// @from(Ln 2848, Col 0)
function Yp6(q) {
    B8.teleportedSessionInfo = {
        isTeleported: !0,
        hasLoggedFirstMessage: !1,
        sessionId: q.sessionId
    }
}
// @from(Ln 2856, Col 0)
function aO8() {
    return B8.teleportedSessionInfo
}
// @from(Ln 2860, Col 0)
function sO8() {
    if (B8.teleportedSessionInfo) B8.teleportedSessionInfo.hasLoggedFirstMessage = !0
}
// @from(Ln 2864, Col 0)
function RD6(q, K, _, z = null) {
    let Y = `${z??""}:${q}`;
    B8.invokedSkills.set(Y, {
        skillName: q,
        skillPath: K,
        content: _,
        invokedAt: Date.now(),
        agentId: z
    })
}
// @from(Ln 2875, Col 0)
function QZ5() {
    return B8.invokedSkills
}
// @from(Ln 2879, Col 0)
function g81(q) {
    let K = q ?? null,
        _ = new Map;
    for (let [z, Y] of B8.invokedSkills)
        if (Y.agentId === K) _.set(z, Y);
    return _
}
// @from(Ln 2887, Col 0)
function U81(q) {
    if (!q || q.size === 0) {
        B8.invokedSkills.clear();
        return
    }
    for (let [K, _] of B8.invokedSkills)
        if (_.agentId === null || !q.has(_.agentId)) B8.invokedSkills.delete(K)
}
// @from(Ln 2896, Col 0)
function R86(q) {
    for (let [K, _] of B8.invokedSkills)
        if (_.agentId === q) B8.invokedSkills.delete(K)
}
// @from(Ln 2901, Col 0)
function if7(q, K) {
    return
}
// @from(Ln 2905, Col 0)
function rf7() {
    if (B8.slowOperations.length === 0) return Uf7;
    let q = Date.now();
    if (B8.slowOperations.some((K) => q - K.timestamp >= v61)) {
        if (B8.slowOperations = B8.slowOperations.filter((K) => q - K.timestamp < v61), B8.slowOperations.length === 0) return Uf7
    }
    return B8.slowOperations
}
// @from(Ln 2914, Col 0)
function lg() {
    return B8.mainThreadAgentType
}
// @from(Ln 2918, Col 0)
function _m(q) {
    B8.mainThreadAgentType = q
}
// @from(Ln 2922, Col 0)
function nK() {
    return B8.isRemoteMode
}
// @from(Ln 2926, Col 0)
function Q81(q) {
    B8.isRemoteMode = q
}
// @from(Ln 2930, Col 0)
function d81() {
    return B8.systemPromptSectionCache
}
// @from(Ln 2934, Col 0)
function c81(q, K) {
    B8.systemPromptSectionCache.set(q, K)
}
// @from(Ln 2938, Col 0)
function l81() {
    B8.systemPromptSectionCache.clear()
}
// @from(Ln 2942, Col 0)
function n81() {
    return B8.lastEmittedDate
}
// @from(Ln 2946, Col 0)
function SD6(q) {
    B8.lastEmittedDate = q
}
// @from(Ln 2950, Col 0)
function tG() {
    return B8.additionalDirectoriesForClaudeMd
}
// @from(Ln 2954, Col 0)
function Ap6(q) {
    B8.additionalDirectoriesForClaudeMd = q
}
// @from(Ln 2958, Col 0)
function qj() {
    return B8.allowedChannels
}
// @from(Ln 2962, Col 0)
function xi(q) {
    B8.allowedChannels = q
}
// @from(Ln 2966, Col 0)
function tO8() {
    return B8.hasDevChannels
}
// @from(Ln 2970, Col 0)
function eO8(q) {
    B8.hasDevChannels = q
}
// @from(Ln 2974, Col 0)
function i81() {
    return B8.promptCache1hAllowlist
}
// @from(Ln 2978, Col 0)
function r81(q) {
    B8.promptCache1hAllowlist = q
}
// @from(Ln 2982, Col 0)
function o81() {
    return B8.afkModeHeaderLatched
}
// @from(Ln 2986, Col 0)
function qw8(q) {
    B8.afkModeHeaderLatched = q
}
// @from(Ln 2990, Col 0)
function a81() {
    return B8.fastModeHeaderLatched
}
// @from(Ln 2994, Col 0)
function s81(q) {
    B8.fastModeHeaderLatched = q
}
// @from(Ln 2998, Col 0)
function t81() {
    return B8.cacheEditingHeaderLatched
}
// @from(Ln 3002, Col 0)
function dZ5(q) {
    B8.cacheEditingHeaderLatched = q
}
// @from(Ln 3006, Col 0)
function Op6() {
    return B8.thinkingClearLatched
}
// @from(Ln 3010, Col 0)
function wp6(q) {
    B8.thinkingClearLatched = q
}
// @from(Ln 3014, Col 0)
function e81() {
    B8.afkModeHeaderLatched = null, B8.fastModeHeaderLatched = null, B8.cacheEditingHeaderLatched = null, B8.thinkingClearLatched = null
}
// @from(Ln 3018, Col 0)
function $p6() {
    return B8.promptId
}
// @from(Ln 3022, Col 0)
function jp6(q) {
    B8.promptId = q
}
// @from(Ln 3026, Col 0)
function q11() {
    return B8.replBridgeActive ?? !1
}
// @from(Ln 3030, Col 0)
function K11(q) {
    if (B8.replBridgeActive === q) return;
    B8.replBridgeActive = q
}
// @from(Ln 3034, Col 4)
B8
// @from(Ln 3034, Col 8)
k61
// @from(Ln 3034, Col 13)
N61
// @from(Ln 3034, Col 18)
b61 = !1
// @from(Ln 3035, Col 4)
x61
// @from(Ln 3035, Col 9)
u61
// @from(Ln 3035, Col 14)
B61 = 0
// @from(Ln 3036, Col 4)
p61 = null
// @from(Ln 3037, Col 4)
mO8 = 0
// @from(Ln 3038, Col 4)
pO8 = 60000
// @from(Ln 3039, Col 4)
Q61 = void 0
// @from(Ln 3040, Col 4)
d61
// @from(Ln 3040, Col 9)
l61
// @from(Ln 3040, Col 14)
IO8 = !1
// @from(Ln 3041, Col 4)
BB6
// @from(Ln 3041, Col 9)
cf7 = 150
// @from(Ln 3042, Col 4)
gf7 = 10
// @from(Ln 3043, Col 4)
v61 = 1e4
// @from(Ln 3044, Col 4)
Uf7
// @from(Ln 3045, Col 4)
y8 = L(() => {
    hf7();
    D61();
    Li();
    nH();
    B8 = Qf7();
    k61 = l5(), N61 = k61.subscribe;
    x61 = l5(), u61 = x61.subscribe;
    d61 = l5();
    l61 = d61.subscribe;
    Uf7 = []
})
// @from(Ln 3058, Col 0)
function Kw8(q) {
    let K;
    for (let _ in q)
        if (_.startsWith("_PROTO_")) {
            if (K === void 0) K = {
                ...q
            };
            delete K[_]
        } return K ?? q
}
// @from(Ln 3069, Col 0)
function cZ5() {
    return {
        eventQueue: [],
        sink: null
    }
}
// @from(Ln 3076, Col 0)
function of7(q) {
    let K = _11;
    if (K.sink !== null) return;
    if (K.sink = q, K.eventQueue.length > 0) {
        let _ = K.eventQueue;
        K.eventQueue = [], queueMicrotask(() => {
            for (let z of _)
                if (z.async) q.logEventAsync(z.eventName, z.metadata);
                else q.logEvent(z.eventName, z.metadata)
        })
    }
}
// @from(Ln 3089, Col 0)
function d(q, K) {
    let _ = _11;
    if (_.sink === null) {
        _.eventQueue.push({
            eventName: q,
            metadata: K,
            async: !1
        });
        return
    }
    _.sink.logEvent(q, K)
}
// @from(Ln 3101, Col 0)
async function af7(q, K) {
    let _ = _11;
    if (_.sink === null) {
        _.eventQueue.push({
            eventName: q,
            metadata: K,
            async: !0
        });
        return
    }
    await _.sink.logEventAsync(q, K)
}
// @from(Ln 3113, Col 4)
_11
// @from(Ln 3114, Col 4)
C8 = L(() => {
    _11 = cZ5()
})
// @from(Ln 3118, Col 0)
function bD6({
    writeFn: q,
    flushIntervalMs: K = 1000,
    maxBufferSize: _ = 100,
    maxBufferBytes: z = 1 / 0,
    immediateMode: Y = !1
}) {
    let A = [],
        O = 0,
        w = null,
        $ = null;

    function j() {
        if (w) clearTimeout(w), w = null
    }

    function H() {
        if ($) q($.join("")), $ = null;
        if (A.length === 0) return;
        q(A.join("")), A = [], O = 0, j()
    }

    function J() {
        if (!w) w = setTimeout(H, K)
    }

    function X() {
        if ($) {
            $.push(...A), A = [], O = 0, j();
            return
        }
        let M = A;
        A = [], O = 0, j(), $ = M, setImmediate(() => {
            let P = $;
            if ($ = null, P) q(P.join(""))
        })
    }
    return {
        write(M) {
            if (Y) {
                q(M);
                return
            }
            if (A.push(M), O += M.length, J(), A.length >= _ || O >= z) X()
        },
        flush: H,
        dispose() {
            H()
        }
    }
}
// @from(Ln 3170, Col 0)
function eq(q) {
    return z11.add(q), () => z11.delete(q)
}
// @from(Ln 3173, Col 0)
async function _w8() {
    await Promise.all(Array.from(z11).map((q) => q()))
}
// @from(Ln 3176, Col 4)
z11
// @from(Ln 3177, Col 4)
R9 = L(() => {
    z11 = new Set
})
// @from(Ln 3181, Col 0)
function lZ5(q) {
    let K = [],
        _ = q.match(/^MCP server ["']([^"']+)["']/);
    if (_ && _[1]) K.push("mcp"), K.push(_[1].toLowerCase());
    else {
        let A = q.match(/^([^:[]+):/);
        if (A && A[1]) K.push(A[1].trim().toLowerCase())
    }
    let z = q.match(/^\[([^\]]+)]/);
    if (z && z[1]) K.push(z[1].trim().toLowerCase());
    if (q.toLowerCase().includes("1p event:")) K.push("1p");
    let Y = q.match(/:\s*([^:]+?)(?:\s+(?:type|mode|status|event))?:/);
    if (Y && Y[1]) {
        let A = Y[1].trim().toLowerCase();
        if (A.length < 30 && !A.includes(" ")) K.push(A)
    }
    return Array.from(new Set(K))
}
// @from(Ln 3200, Col 0)
function nZ5(q, K) {
    if (!K) return !0;
    if (q.length === 0) return !1;
    if (K.isExclusive) return !q.some((_) => K.exclude.includes(_));
    else return q.some((_) => K.include.includes(_))
}
// @from(Ln 3207, Col 0)
function tf7(q, K) {
    if (!K) return !0;
    let _ = lZ5(q);
    return nZ5(_, K)
}
// @from(Ln 3212, Col 4)
sf7
// @from(Ln 3213, Col 4)
ef7 = L(() => {
    U4();
    sf7 = P1((q) => {
        if (!q || q.trim() === "") return null;
        let K = q.split(",").map((A) => A.trim()).filter(Boolean);
        if (K.length === 0) return null;
        let _ = K.some((A) => A.startsWith("!")),
            z = K.some((A) => !A.startsWith("!"));
        if (_ && z) return null;
        let Y = K.map((A) => A.replace(/^!/, "").toLowerCase());
        return {
            include: _ ? [] : Y,
            exclude: _ ? Y : [],
            isExclusive: _
        }
    })
})
// @from(Ln 3237, Col 0)
function ID6() {
    return qG7(A7(), "teams")
}
// @from(Ln 3241, Col 0)
function xD6(q) {
    let K = process.env.NODE_OPTIONS;
    if (!K) return !1;
    return K.split(/\s+/).includes(q)
}
// @from(Ln 3247, Col 0)
function ui(q, K) {
    if (q === void 0) return K;
    let _ = parseInt(q, 10);
    return Number.isNaN(_) ? K : _
}
// @from(Ln 3253, Col 0)
function S9() {
    return S6(process.env.CLAUDE_CODE_SIMPLE) || process.argv.includes("--bare")
}
// @from(Ln 3257, Col 0)
function KG7(q) {
    let K = {};
    if (q)
        for (let _ of q) {
            let [z, ...Y] = _.split("=");
            if (!z || Y.length === 0) throw Error(`Invalid environment variable format: ${_}, environment variables should be added as: -e KEY1=value1 -e KEY2=value2`);
            K[z] = Y.join("=")
        }
    return K
}
// @from(Ln 3268, Col 0)
function oL() {
    return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1"
}
// @from(Ln 3272, Col 0)
function zw8() {
    return process.env.CLOUD_ML_REGION || "us-east5"
}
// @from(Ln 3276, Col 0)
function _G7() {
    return S6(process.env.CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR)
}
// @from(Ln 3280, Col 0)
function CZ() {
    return !1
}
// @from(Ln 3284, Col 0)
function kC() {
    return !1
}
// @from(Ln 3288, Col 0)
function zG7() {
    return {
        namespace: void 0,
        cluster: void 0
    }
}
// @from(Ln 3295, Col 0)
function uD6(q) {
    if (q) {
        let K = rZ5.find(([_]) => q.startsWith(_));
        if (K) return process.env[K[1]] || zw8()
    }
    return zw8()
}
// @from(Ln 3302, Col 4)
A7
// @from(Ln 3302, Col 8)
rZ5
// @from(Ln 3303, Col 4)
Q8 = L(() => {
    bO8();
    U4();
    bO8();
    A7 = P1(() => {
        return (process.env.CLAUDE_CONFIG_DIR ?? qG7(iZ5(), ".claude")).normalize("NFC")
    }, () => process.env.CLAUDE_CONFIG_DIR);
    rZ5 = [
        ["claude-haiku-4-5", "VERTEX_REGION_CLAUDE_HAIKU_4_5"],
        ["claude-3-5-haiku", "VERTEX_REGION_CLAUDE_3_5_HAIKU"],
        ["claude-3-5-sonnet", "VERTEX_REGION_CLAUDE_3_5_SONNET"],
        ["claude-3-7-sonnet", "VERTEX_REGION_CLAUDE_3_7_SONNET"],
        ["claude-opus-4-7", "VERTEX_REGION_CLAUDE_4_7_OPUS"],
        ["claude-opus-4-6", "VERTEX_REGION_CLAUDE_4_6_OPUS"],
        ["claude-opus-4-5", "VERTEX_REGION_CLAUDE_4_5_OPUS"],
        ["claude-opus-4-1", "VERTEX_REGION_CLAUDE_4_1_OPUS"],
        ["claude-opus-4", "VERTEX_REGION_CLAUDE_4_0_OPUS"],
        ["claude-sonnet-4-6", "VERTEX_REGION_CLAUDE_4_6_SONNET"],
        ["claude-sonnet-4-5", "VERTEX_REGION_CLAUDE_4_5_SONNET"],
        ["claude-sonnet-4", "VERTEX_REGION_CLAUDE_4_0_SONNET"]
    ]
})
// @from(Ln 3326, Col 0)
function N4(q, K, _, z, Y) {
    if (z === "m") throw TypeError("Private method is not writable");
    if (z === "a" && !Y) throw TypeError("Private accessor was defined without a setter");
    if (typeof K === "function" ? q !== K || !Y : !K.has(q)) throw TypeError("Cannot write private member to an object whose class did not declare it");
    return z === "a" ? Y.call(q, _) : Y ? Y.value = _ : K.set(q, _), _
}
// @from(Ln 3333, Col 0)
function U1(q, K, _, z) {
    if (_ === "a" && !z) throw TypeError("Private accessor was defined without a getter");
    if (typeof K === "function" ? q !== K || !z : !K.has(q)) throw TypeError("Cannot read private member from an object whose class did not declare it");
    return _ === "m" ? z : _ === "a" ? z.call(q) : z ? z.value : K.get(q)
}
// @from(Ln 3338, Col 4)
mi = () => {}
// @from(Ln 3339, Col 4)
Y11 = function() {
    let {
        crypto: q
    } = globalThis;
    if (q?.randomUUID) return Y11 = q.randomUUID.bind(q), q.randomUUID();
    let K = new Uint8Array(1),
        _ = q ? () => q.getRandomValues(K)[0] : () => Math.random() * 255 & 255;
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (z) => (+z ^ _() & 15 >> +z / 4).toString(16))
}
// @from(Ln 3349, Col 0)
function Bi(q) {
    return typeof q === "object" && q !== null && (("name" in q) && q.name === "AbortError" || ("message" in q) && String(q.message).includes("FetchRequestCanceledException"))
}
// @from(Ln 3352, Col 4)
Hp6 = (q) => {
    if (q instanceof Error) return q;
    if (typeof q === "object" && q !== null) {
        try {
            if (Object.prototype.toString.call(q) === "[object Error]") {
                let K = Error(q.message, q.cause ? {
                    cause: q.cause
                } : {});
                if (q.stack) K.stack = q.stack;
                if (q.cause && !K.cause) K.cause = q.cause;
                if (q.name) K.name = q.name;
                return K
            }
        } catch {}
        try {
            return Error(JSON.stringify(q))
        } catch {}
    }
    return Error(q)
}
// @from(Ln 3372, Col 4)
bq
// @from(Ln 3372, Col 8)
vq
// @from(Ln 3372, Col 12)
r_
// @from(Ln 3372, Col 16)
bZ
// @from(Ln 3372, Col 20)
ng
// @from(Ln 3372, Col 24)
Jp6
// @from(Ln 3372, Col 29)
ZY6
// @from(Ln 3372, Col 34)
Xp6
// @from(Ln 3372, Col 39)
fY6
// @from(Ln 3372, Col 44)
Mp6
// @from(Ln 3372, Col 49)
Pp6
// @from(Ln 3372, Col 54)
Wp6
// @from(Ln 3372, Col 59)
Dp6
// @from(Ln 3373, Col 4)
m0 = L(() => {
    bq = class bq extends Error {};
    vq = class vq extends bq {
        constructor(q, K, _, z, Y) {
            super(`${vq.makeMessage(q,K,_)}`);
            this.status = q, this.headers = z, this.requestID = z?.get("request-id"), this.error = K, this.type = Y ?? null
        }
        static makeMessage(q, K, _) {
            let z = K?.message ? typeof K.message === "string" ? K.message : JSON.stringify(K.message) : K ? JSON.stringify(K) : _;
            if (q && z) return `${q} ${z}`;
            if (q) return `${q} status code (no body)`;
            if (z) return z;
            return "(no status code or body)"
        }
        static generate(q, K, _, z) {
            if (!q || !z) return new bZ({
                message: _,
                cause: Hp6(K)
            });
            let Y = K,
                A = Y?.error?.type;
            if (q === 400) return new Jp6(q, Y, _, z, A);
            if (q === 401) return new ZY6(q, Y, _, z, A);
            if (q === 403) return new Xp6(q, Y, _, z, A);
            if (q === 404) return new fY6(q, Y, _, z, A);
            if (q === 409) return new Mp6(q, Y, _, z, A);
            if (q === 422) return new Pp6(q, Y, _, z, A);
            if (q === 429) return new Wp6(q, Y, _, z, A);
            if (q >= 500) return new Dp6(q, Y, _, z, A);
            return new vq(q, Y, _, z, A)
        }
    };
    r_ = class r_ extends vq {
        constructor({
            message: q
        } = {}) {
            super(void 0, void 0, q || "Request was aborted.", void 0)
        }
    };
    bZ = class bZ extends vq {
        constructor({
            message: q,
            cause: K
        }) {
            super(void 0, void 0, q || "Connection error.", void 0);
            if (K) this.cause = K
        }
    };
    ng = class ng extends bZ {
        constructor({
            message: q
        } = {}) {
            super({
                message: q ?? "Request timed out."
            })
        }
    };
    Jp6 = class Jp6 extends vq {};
    ZY6 = class ZY6 extends vq {};
    Xp6 = class Xp6 extends vq {};
    fY6 = class fY6 extends vq {};
    Mp6 = class Mp6 extends vq {};
    Pp6 = class Pp6 extends vq {};
    Wp6 = class Wp6 extends vq {};
    Dp6 = class Dp6 extends vq {}
})
// @from(Ln 3440, Col 0)
function Yw8(q) {
    if (typeof q !== "object") return {};
    return q ?? {}
}
// @from(Ln 3445, Col 0)
function w11(q) {
    if (!q) return !0;
    for (let K in q) return !1;
    return !0
}
// @from(Ln 3451, Col 0)
function AG7(q, K) {
    return Object.prototype.hasOwnProperty.call(q, K)
}
// @from(Ln 3454, Col 4)
aZ5
// @from(Ln 3454, Col 9)
YG7 = (q) => {
        return aZ5.test(q)
    }
// @from(Ln 3457, Col 4)
A11 = (q) => (A11 = Array.isArray, A11(q))
// @from(Ln 3458, Col 4)
O11
// @from(Ln 3458, Col 9)
OG7 = (q, K) => {
        if (typeof K !== "number" || !Number.isInteger(K)) throw new bq(`${q} must be an integer`);
        if (K < 0) throw new bq(`${q} must be a positive integer`);
        return K
    }
// @from(Ln 3463, Col 4)
Aw8 = (q) => {
        try {
            return JSON.parse(q)
        } catch (K) {
            return
        }
    }
// @from(Ln 3470, Col 4)
GY6 = L(() => {
    m0();
    aZ5 = /^[a-z][a-z0-9+.-]*:/i, O11 = A11
})
// @from(Ln 3474, Col 4)
wG7 = (q) => new Promise((K) => setTimeout(K, q))
// @from(Ln 3475, Col 4)
S86 = "0.81.0"
// @from(Ln 3477, Col 0)
function sZ5() {
    if (typeof Deno < "u" && Deno.build != null) return "deno";
    if (typeof EdgeRuntime < "u") return "edge";
    if (Object.prototype.toString.call(typeof globalThis.process < "u" ? globalThis.process : 0) === "[object process]") return "node";
    return "unknown"
}
// @from(Ln 3484, Col 0)
function eZ5() {
    if (typeof navigator > "u" || !navigator) return null;
    let q = [{
        key: "edge",
        pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    }, {
        key: "ie",
        pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    }, {
        key: "ie",
        pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
    }, {
        key: "chrome",
        pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    }, {
        key: "firefox",
        pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    }, {
        key: "safari",
        pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
    }];
    for (let {
            key: K,
            pattern: _
        }
        of q) {
        let z = _.exec(navigator.userAgent);
        if (z) {
            let Y = z[1] || 0,
                A = z[2] || 0,
                O = z[3] || 0;
            return {
                browser: K,
                version: `${Y}.${A}.${O}`
            }
        }
    }
    return null
}
// @from(Ln 3523, Col 4)
JG7 = () => {
        return typeof window < "u" && typeof window.document < "u" && typeof navigator < "u"
    }
// @from(Ln 3526, Col 4)
tZ5 = () => {
        let q = sZ5();
        if (q === "deno") return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": S86,
            "X-Stainless-OS": jG7(Deno.build.os),
            "X-Stainless-Arch": $G7(Deno.build.arch),
            "X-Stainless-Runtime": "deno",
            "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
        };
        if (typeof EdgeRuntime < "u") return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": S86,
            "X-Stainless-OS": "Unknown",
            "X-Stainless-Arch": `other:${EdgeRuntime}`,
            "X-Stainless-Runtime": "edge",
            "X-Stainless-Runtime-Version": globalThis.process.version
        };
        if (q === "node") return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": S86,
            "X-Stainless-OS": jG7(globalThis.process.platform ?? "unknown"),
            "X-Stainless-Arch": $G7(globalThis.process.arch ?? "unknown"),
            "X-Stainless-Runtime": "node",
            "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
        };
        let K = eZ5();
        if (K) return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": S86,
            "X-Stainless-OS": "Unknown",
            "X-Stainless-Arch": "unknown",
            "X-Stainless-Runtime": `browser:${K.browser}`,
            "X-Stainless-Runtime-Version": K.version
        };
        return {
            "X-Stainless-Lang": "js",
            "X-Stainless-Package-Version": S86,
            "X-Stainless-OS": "Unknown",
            "X-Stainless-Arch": "unknown",
            "X-Stainless-Runtime": "unknown",
            "X-Stainless-Runtime-Version": "unknown"
        }
    }
// @from(Ln 3570, Col 4)
$G7 = (q) => {
        if (q === "x32") return "x32";
        if (q === "x86_64" || q === "x64") return "x64";
        if (q === "arm") return "arm";
        if (q === "aarch64" || q === "arm64") return "arm64";
        if (q) return `other:${q}`;
        return "unknown"
    }
// @from(Ln 3578, Col 4)
jG7 = (q) => {
        if (q = q.toLowerCase(), q.includes("ios")) return "iOS";
        if (q === "android") return "Android";
        if (q === "darwin") return "MacOS";
        if (q === "win32") return "Windows";
        if (q === "freebsd") return "FreeBSD";
        if (q === "openbsd") return "OpenBSD";
        if (q === "linux") return "Linux";
        if (q) return `Other:${q}`;
        return "Unknown"
    }
// @from(Ln 3589, Col 4)
HG7
// @from(Ln 3589, Col 9)
XG7 = () => {
        return HG7 ?? (HG7 = tZ5())
    }
// @from(Ln 3592, Col 4)
$11 = () => {}
// @from(Ln 3594, Col 0)
function MG7() {
    if (typeof fetch < "u") return fetch;
    throw Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`")
}
// @from(Ln 3599, Col 0)
function j11(...q) {
    let K = globalThis.ReadableStream;
    if (typeof K > "u") throw Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
    return new K(...q)
}
// @from(Ln 3605, Col 0)
function Ow8(q) {
    let K = Symbol.asyncIterator in q ? q[Symbol.asyncIterator]() : q[Symbol.iterator]();
    return j11({
        start() {},
        async pull(_) {
            let {
                done: z,
                value: Y
            } = await K.next();
            if (z) _.close();
            else _.enqueue(Y)
        },
        async cancel() {
            await K.return?.()
        }
    })
}
// @from(Ln 3623, Col 0)
function Zp6(q) {
    if (q[Symbol.asyncIterator]) return q;
    let K = q.getReader();
    return {
        async next() {
            try {
                let _ = await K.read();
                if (_?.done) K.releaseLock();
                return _
            } catch (_) {
                throw K.releaseLock(), _
            }
        },
        async return () {
            let _ = K.cancel();
            return K.releaseLock(), await _, {
                done: !0,
                value: void 0
            }
        },
        [Symbol.asyncIterator]() {
            return this
        }
    }
}
// @from(Ln 3648, Col 0)
async function PG7(q) {
    if (q === null || typeof q !== "object") return;
    if (q[Symbol.asyncIterator]) {
        await q[Symbol.asyncIterator]().return?.();
        return
    }
    let K = q.getReader(),
        _ = K.cancel();
    K.releaseLock(), await _
}
// @from(Ln 3658, Col 4)
WG7 = ({
    headers: q,
    body: K
}) => {
    return {
        bodyHeaders: {
            "content-type": "application/json"
        },
        body: JSON.stringify(K)
    }
}
// @from(Ln 3670, Col 0)
function DG7(q) {
    return Object.entries(q).filter(([K, _]) => typeof _ < "u").map(([K, _]) => {
        if (typeof _ === "string" || typeof _ === "number" || typeof _ === "boolean") return `${encodeURIComponent(K)}=${encodeURIComponent(_)}`;
        if (_ === null) return `${encodeURIComponent(K)}=`;
        throw new bq(`Cannot stringify type ${typeof _}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`)
    }).join("&")
}
// @from(Ln 3677, Col 4)
ZG7 = L(() => {
    m0()
})
// @from(Ln 3681, Col 0)
function vG7(q) {
    let K = 0;
    for (let Y of q) K += Y.length;
    let _ = new Uint8Array(K),
        z = 0;
    for (let Y of q) _.set(Y, z), z += Y.length;
    return _
}
// @from(Ln 3690, Col 0)
function fp6(q) {
    let K;
    return (fG7 ?? (K = new globalThis.TextEncoder, fG7 = K.encode.bind(K)))(q)
}
// @from(Ln 3695, Col 0)
function H11(q) {
    let K;
    return (GG7 ?? (K = new globalThis.TextDecoder, GG7 = K.decode.bind(K)))(q)
}
// @from(Ln 3699, Col 4)
fG7
// @from(Ln 3699, Col 9)
GG7
// @from(Ln 3700, Col 0)
class C86 {
    constructor() {
        aL.set(this, void 0), sL.set(this, void 0), N4(this, aL, new Uint8Array, "f"), N4(this, sL, null, "f")
    }
    decode(q) {
        if (q == null) return [];
        let K = q instanceof ArrayBuffer ? new Uint8Array(q) : typeof q === "string" ? fp6(q) : q;
        N4(this, aL, vG7([U1(this, aL, "f"), K]), "f");
        let _ = [],
            z;
        while ((z = _f5(U1(this, aL, "f"), U1(this, sL, "f"))) != null) {
            if (z.carriage && U1(this, sL, "f") == null) {
                N4(this, sL, z.index, "f");
                continue
            }
            if (U1(this, sL, "f") != null && (z.index !== U1(this, sL, "f") + 1 || z.carriage)) {
                _.push(H11(U1(this, aL, "f").subarray(0, U1(this, sL, "f") - 1))), N4(this, aL, U1(this, aL, "f").subarray(U1(this, sL, "f")), "f"), N4(this, sL, null, "f");
                continue
            }
            let Y = U1(this, sL, "f") !== null ? z.preceding - 1 : z.preceding,
                A = H11(U1(this, aL, "f").subarray(0, Y));
            _.push(A), N4(this, aL, U1(this, aL, "f").subarray(z.index), "f"), N4(this, sL, null, "f")
        }
        return _
    }
    flush() {
        if (!U1(this, aL, "f").length) return [];
        return this.decode(`
`)
    }
}
// @from(Ln 3732, Col 0)
function _f5(q, K) {
    for (let Y = K ?? 0; Y < q.length; Y++) {
        if (q[Y] === 10) return {
            preceding: Y,
            index: Y + 1,
            carriage: !1
        };
        if (q[Y] === 13) return {
            preceding: Y,
            index: Y + 1,
            carriage: !0
        }
    }
    return null
}
// @from(Ln 3748, Col 0)
function TG7(q) {
    for (let z = 0; z < q.length - 1; z++) {
        if (q[z] === 10 && q[z + 1] === 10) return z + 2;
        if (q[z] === 13 && q[z + 1] === 13) return z + 2;
        if (q[z] === 13 && q[z + 1] === 10 && z + 3 < q.length && q[z + 2] === 13 && q[z + 3] === 10) return z + 4
    }
    return -1
}
// @from(Ln 3756, Col 4)
aL
// @from(Ln 3756, Col 8)
sL
// @from(Ln 3757, Col 4)
J11 = L(() => {
    mi();
    aL = new WeakMap, sL = new WeakMap;
    C86.NEWLINE_CHARS = new Set([`
`, "\r"]);
    C86.NEWLINE_REGEXP = /\r\n|[\n\r]/g
})
// @from(Ln 3765, Col 0)
function Gp6() {}
// @from(Ln 3767, Col 0)
function ww8(q, K, _) {
    if (!K || $w8[q] > $w8[_]) return Gp6;
    else return K[q].bind(K)
}
// @from(Ln 3772, Col 0)
function B0(q) {
    let K = q.logger,
        _ = q.logLevel ?? "off";
    if (!K) return zf5;
    let z = VG7.get(K);
    if (z && z[0] === _) return z[1];
    let Y = {
        error: ww8("error", K, _),
        warn: ww8("warn", K, _),
        info: ww8("info", K, _),
        debug: ww8("debug", K, _)
    };
    return VG7.set(K, [_, Y]), Y
}
// @from(Ln 3786, Col 4)
$w8
// @from(Ln 3786, Col 9)
X11 = (q, K, _) => {
        if (!q) return;
        if (AG7($w8, q)) return q;
        B0(_).warn(`${K} was set to ${JSON.stringify(q)}, expected one of ${JSON.stringify(Object.keys($w8))}`);
        return
    }
// @from(Ln 3792, Col 4)
zf5
// @from(Ln 3792, Col 9)
VG7
// @from(Ln 3792, Col 14)
pi = (q) => {
        if (q.options) q.options = {
            ...q.options
        }, delete q.options.headers;
        if (q.headers) q.headers = Object.fromEntries((q.headers instanceof Headers ? [...q.headers] : Object.entries(q.headers)).map(([K, _]) => [K, K.toLowerCase() === "x-api-key" || K.toLowerCase() === "authorization" || K.toLowerCase() === "cookie" || K.toLowerCase() === "set-cookie" ? "***" : _]));
        if ("retryOfRequestLogID" in q) {
            if (q.retryOfRequestLogID) q.retryOf = q.retryOfRequestLogID;
            delete q.retryOfRequestLogID
        }
        return q
    }
// @from(Ln 3803, Col 4)
jw8 = L(() => {
    GY6();
    $w8 = {
        off: 0,
        error: 200,
        warn: 300,
        info: 400,
        debug: 500
    };
    zf5 = {
        error: Gp6,
        warn: Gp6,
        info: Gp6,
        debug: Gp6
    }, VG7 = new WeakMap
})
// @from(Ln 3819, Col 0)
async function* Yf5(q, K) {
    if (!q.body) {
        if (K.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative") throw new bq("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
        throw new bq("Attempted to iterate over a response with no body")
    }
    let _ = new kG7,
        z = new C86,
        Y = Zp6(q.body);
    for await (let A of Af5(Y)) for (let O of z.decode(A)) {
        let w = _.decode(O);
        if (w) yield w
    }
    for (let A of z.flush()) {
        let O = _.decode(A);
        if (O) yield O
    }
}
// @from(Ln 3836, Col 0)
async function* Af5(q) {
    let K = new Uint8Array;
    for await (let _ of q) {
        if (_ == null) continue;
        let z = _ instanceof ArrayBuffer ? new Uint8Array(_) : typeof _ === "string" ? fp6(_) : _,
            Y = new Uint8Array(K.length + z.length);
        Y.set(K), Y.set(z, K.length), K = Y;
        let A;
        while ((A = TG7(K)) !== -1) yield K.slice(0, A), K = K.slice(A)
    }
    if (K.length > 0) yield K
}
// @from(Ln 3848, Col 0)
class kG7 {
    constructor() {
        this.event = null, this.data = [], this.chunks = []
    }
    decode(q) {
        if (q.endsWith("\r")) q = q.substring(0, q.length - 1);
        if (!q) {
            if (!this.event && !this.data.length) return null;
            let Y = {
                event: this.event,
                data: this.data.join(`
`),
                raw: this.chunks
            };
            return this.event = null, this.data = [], this.chunks = [], Y
        }
        if (this.chunks.push(q), q.startsWith(":")) return null;
        let [K, _, z] = Of5(q, ":");
        if (z.startsWith(" ")) z = z.substring(1);
        if (K === "event") this.event = z;
        else if (K === "data") this.data.push(z);
        return null
    }
}
// @from(Ln 3873, Col 0)
function Of5(q, K) {
    let _ = q.indexOf(K);
    if (_ !== -1) return [q.substring(0, _), K, q.substring(_ + K.length)];
    return [q, "", ""]
}
// @from(Ln 3878, Col 4)
vp6
// @from(Ln 3878, Col 9)
$V