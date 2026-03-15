
// @from(Ln 135881, Col 0)
function NP7(A) {
    let q = vP7.createServer();
    return q.setRulesetValidator(async (K) => {
        try {
            let {
                destAddress: Y,
                destPort: z
            } = K;
            if (wA(`Connection request to ${Y}:${z}`), !await A.filter(z, Y)) return wA(`Connection blocked to ${Y}:${z}`, {
                level: "error"
            }), !1;
            return wA(`Connection allowed to ${Y}:${z}`), !0
        } catch (Y) {
            return wA(`Error validating connection: ${Y}`, {
                level: "error"
            }), !1
        }
    }), {
        server: q,
        getPort() {
            try {
                let K = q?.server;
                if (K && typeof K?.address === "function") {
                    let Y = K.address();
                    if (Y && typeof Y === "object" && "port" in Y) return Y.port
                }
            } catch (K) {
                wA(`Error getting port: ${K}`, {
                    level: "error"
                })
            }
            return
        },
        listen(K, Y) {
            return new Promise((z, _) => {
                let w = () => {
                    let O = this.getPort();
                    if (O) wA(`SOCKS proxy listening on ${Y}:${O}`), z(O);
                    else _(Error("Failed to get SOCKS proxy server port"))
                };
                q.listen(K, Y, w)
            })
        },
        async close() {
            return new Promise((K, Y) => {
                q.close((z) => {
                    if (z) {
                        let _ = z.message?.toLowerCase() || "";
                        if (!(_.includes("not running") || _.includes("already closed") || _.includes("not listening"))) {
                            Y(z);
                            return
                        }
                    }
                    K()
                })
            })
        },
        unref() {
            try {
                let K = q?.server;
                if (K && typeof K?.unref === "function") K.unref()
            } catch (K) {
                wA(`Error calling unref: ${K}`, {
                    level: "error"
                })
            }
        }
    }
}
// @from(Ln 135950, Col 4)
vP7
// @from(Ln 135951, Col 4)
VP7 = E(() => {
    vP7 = t(TP7(), 1)
})
// @from(Ln 135958, Col 0)
function JU(A) {
    if (typeof globalThis.Bun < "u") return globalThis.Bun.which(A);
    let q = rR3("which", [A], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 1000
    });
    if (q.status === 0 && q.stdout) return q.stdout.trim();
    return null
}
// @from(Ln 135968, Col 4)
Dx6 = () => {}
// @from(Ln 135970, Col 0)
function oR3() {
    this.__data__ = [], this.size = 0
}
// @from(Ln 135973, Col 4)
kP7
// @from(Ln 135974, Col 4)
EP7 = E(() => {
    kP7 = oR3
})
// @from(Ln 135978, Col 0)
function aR3(A, q) {
    return A === q || A !== A && q !== q
}
// @from(Ln 135981, Col 4)
b_1
// @from(Ln 135982, Col 4)
i28 = E(() => {
    b_1 = aR3
})
// @from(Ln 135986, Col 0)
function sR3(A, q) {
    var K = A.length;
    while (K--)
        if (b_1(A[K][0], q)) return K;
    return -1
}
// @from(Ln 135992, Col 4)
ma
// @from(Ln 135993, Col 4)
Xx6 = E(() => {
    i28();
    ma = sR3
})
// @from(Ln 135998, Col 0)
function Ah3(A) {
    var q = this.__data__,
        K = ma(q, A);
    if (K < 0) return !1;
    var Y = q.length - 1;
    if (K == Y) q.pop();
    else eR3.call(q, K, 1);
    return --this.size, !0
}
// @from(Ln 136007, Col 4)
tR3
// @from(Ln 136007, Col 9)
eR3
// @from(Ln 136007, Col 14)
yP7
// @from(Ln 136008, Col 4)
LP7 = E(() => {
    Xx6();
    tR3 = Array.prototype, eR3 = tR3.splice;
    yP7 = Ah3
})
// @from(Ln 136014, Col 0)
function qh3(A) {
    var q = this.__data__,
        K = ma(q, A);
    return K < 0 ? void 0 : q[K][1]
}
// @from(Ln 136019, Col 4)
RP7
// @from(Ln 136020, Col 4)
hP7 = E(() => {
    Xx6();
    RP7 = qh3
})
// @from(Ln 136025, Col 0)
function Kh3(A) {
    return ma(this.__data__, A) > -1
}
// @from(Ln 136028, Col 4)
SP7
// @from(Ln 136029, Col 4)
CP7 = E(() => {
    Xx6();
    SP7 = Kh3
})
// @from(Ln 136034, Col 0)
function Yh3(A, q) {
    var K = this.__data__,
        Y = ma(K, A);
    if (Y < 0) ++this.size, K.push([A, q]);
    else K[Y][1] = q;
    return this
}
// @from(Ln 136041, Col 4)
IP7
// @from(Ln 136042, Col 4)
bP7 = E(() => {
    Xx6();
    IP7 = Yh3
})
// @from(Ln 136047, Col 0)
function nM6(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 136056, Col 4)
Ba
// @from(Ln 136057, Col 4)
Px6 = E(() => {
    EP7();
    LP7();
    hP7();
    CP7();
    bP7();
    nM6.prototype.clear = kP7;
    nM6.prototype.delete = yP7;
    nM6.prototype.get = RP7;
    nM6.prototype.has = SP7;
    nM6.prototype.set = IP7;
    Ba = nM6
})
// @from(Ln 136071, Col 0)
function zh3() {
    this.__data__ = new Ba, this.size = 0
}
// @from(Ln 136074, Col 4)
xP7
// @from(Ln 136075, Col 4)
uP7 = E(() => {
    Px6();
    xP7 = zh3
})
// @from(Ln 136080, Col 0)
function _h3(A) {
    var q = this.__data__,
        K = q.delete(A);
    return this.size = q.size, K
}
// @from(Ln 136085, Col 4)
mP7
// @from(Ln 136086, Col 4)
BP7 = E(() => {
    mP7 = _h3
})
// @from(Ln 136090, Col 0)
function wh3(A) {
    return this.__data__.get(A)
}
// @from(Ln 136093, Col 4)
gP7
// @from(Ln 136094, Col 4)
FP7 = E(() => {
    gP7 = wh3
})
// @from(Ln 136098, Col 0)
function Oh3(A) {
    return this.__data__.has(A)
}
// @from(Ln 136101, Col 4)
pP7
// @from(Ln 136102, Col 4)
QP7 = E(() => {
    pP7 = Oh3
})
// @from(Ln 136105, Col 4)
$h3
// @from(Ln 136105, Col 9)
x_1
// @from(Ln 136106, Col 4)
n28 = E(() => {
    $h3 = typeof global == "object" && global && global.Object === Object && global, x_1 = $h3
})
// @from(Ln 136109, Col 4)
Hh3
// @from(Ln 136109, Col 9)
jh3
// @from(Ln 136109, Col 14)
CJ
// @from(Ln 136110, Col 4)
EC = E(() => {
    n28();
    Hh3 = typeof self == "object" && self && self.Object === Object && self, jh3 = x_1 || Hh3 || Function("return this")(), CJ = jh3
})
// @from(Ln 136114, Col 4)
Jh3
// @from(Ln 136114, Col 9)
MU
// @from(Ln 136115, Col 4)
u_1 = E(() => {
    EC();
    Jh3 = CJ.Symbol, MU = Jh3
})
// @from(Ln 136120, Col 0)
function Xh3(A) {
    var q = Mh3.call(A, Wx6),
        K = A[Wx6];
    try {
        A[Wx6] = void 0;
        var Y = !0
    } catch (_) {}
    var z = Dh3.call(A);
    if (Y)
        if (q) A[Wx6] = K;
        else delete A[Wx6];
    return z
}
// @from(Ln 136133, Col 4)
UP7
// @from(Ln 136133, Col 9)
Mh3
// @from(Ln 136133, Col 14)
Dh3
// @from(Ln 136133, Col 19)
Wx6
// @from(Ln 136133, Col 24)
dP7
// @from(Ln 136134, Col 4)
cP7 = E(() => {
    u_1();
    UP7 = Object.prototype, Mh3 = UP7.hasOwnProperty, Dh3 = UP7.toString, Wx6 = MU ? MU.toStringTag : void 0;
    dP7 = Xh3
})
// @from(Ln 136140, Col 0)
function Zh3(A) {
    return Wh3.call(A)
}
// @from(Ln 136143, Col 4)
Ph3
// @from(Ln 136143, Col 9)
Wh3
// @from(Ln 136143, Col 14)
lP7
// @from(Ln 136144, Col 4)
iP7 = E(() => {
    Ph3 = Object.prototype, Wh3 = Ph3.toString;
    lP7 = Zh3
})
// @from(Ln 136149, Col 0)
function Th3(A) {
    if (A == null) return A === void 0 ? fh3 : Gh3;
    return nP7 && nP7 in Object(A) ? dP7(A) : lP7(A)
}
// @from(Ln 136153, Col 4)
Gh3 = "[object Null]"
// @from(Ln 136154, Col 4)
fh3 = "[object Undefined]"
// @from(Ln 136155, Col 4)
nP7
// @from(Ln 136155, Col 9)
DU
// @from(Ln 136156, Col 4)
Zx6 = E(() => {
    u_1();
    cP7();
    iP7();
    nP7 = MU ? MU.toStringTag : void 0;
    DU = Th3
})
// @from(Ln 136164, Col 0)
function vh3(A) {
    var q = typeof A;
    return A != null && (q == "object" || q == "function")
}
// @from(Ln 136168, Col 4)
wm
// @from(Ln 136169, Col 4)
rM6 = E(() => {
    wm = vh3
})
// @from(Ln 136173, Col 0)
function yh3(A) {
    if (!wm(A)) return !1;
    var q = DU(A);
    return q == Vh3 || q == kh3 || q == Nh3 || q == Eh3
}
// @from(Ln 136178, Col 4)
Nh3 = "[object AsyncFunction]"
// @from(Ln 136179, Col 4)
Vh3 = "[object Function]"
// @from(Ln 136180, Col 4)
kh3 = "[object GeneratorFunction]"
// @from(Ln 136181, Col 4)
Eh3 = "[object Proxy]"
// @from(Ln 136182, Col 4)
m_1
// @from(Ln 136183, Col 4)
r28 = E(() => {
    Zx6();
    rM6();
    m_1 = yh3
})
// @from(Ln 136188, Col 4)
Lh3
// @from(Ln 136188, Col 9)
B_1
// @from(Ln 136189, Col 4)
rP7 = E(() => {
    EC();
    Lh3 = CJ["__core-js_shared__"], B_1 = Lh3
})
// @from(Ln 136194, Col 0)
function Rh3(A) {
    return !!oP7 && oP7 in A
}
// @from(Ln 136197, Col 4)
oP7
// @from(Ln 136197, Col 9)
aP7
// @from(Ln 136198, Col 4)
sP7 = E(() => {
    rP7();
    oP7 = function() {
        var A = /[^.]+$/.exec(B_1 && B_1.keys && B_1.keys.IE_PROTO || "");
        return A ? "Symbol(src)_1." + A : ""
    }();
    aP7 = Rh3
})
// @from(Ln 136207, Col 0)
function Ch3(A) {
    if (A != null) {
        try {
            return Sh3.call(A)
        } catch (q) {}
        try {
            return A + ""
        } catch (q) {}
    }
    return ""
}
// @from(Ln 136218, Col 4)
hh3
// @from(Ln 136218, Col 9)
Sh3
// @from(Ln 136218, Col 14)
XU
// @from(Ln 136219, Col 4)
o28 = E(() => {
    hh3 = Function.prototype, Sh3 = hh3.toString;
    XU = Ch3
})
// @from(Ln 136224, Col 0)
function Fh3(A) {
    if (!wm(A) || aP7(A)) return !1;
    var q = m_1(A) ? gh3 : bh3;
    return q.test(XU(A))
}
// @from(Ln 136229, Col 4)
Ih3
// @from(Ln 136229, Col 9)
bh3
// @from(Ln 136229, Col 14)
xh3
// @from(Ln 136229, Col 19)
uh3
// @from(Ln 136229, Col 24)
mh3
// @from(Ln 136229, Col 29)
Bh3
// @from(Ln 136229, Col 34)
gh3
// @from(Ln 136229, Col 39)
tP7
// @from(Ln 136230, Col 4)
eP7 = E(() => {
    r28();
    sP7();
    rM6();
    o28();
    Ih3 = /[\\^$.*+?()[\]{}|]/g, bh3 = /^\[object .+?Constructor\]$/, xh3 = Function.prototype, uh3 = Object.prototype, mh3 = xh3.toString, Bh3 = uh3.hasOwnProperty, gh3 = RegExp("^" + mh3.call(Bh3).replace(Ih3, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    tP7 = Fh3
})
// @from(Ln 136239, Col 0)
function ph3(A, q) {
    return A == null ? void 0 : A[q]
}
// @from(Ln 136242, Col 4)
A07
// @from(Ln 136243, Col 4)
q07 = E(() => {
    A07 = ph3
})
// @from(Ln 136247, Col 0)
function Qh3(A, q) {
    var K = A07(A, q);
    return tP7(K) ? K : void 0
}
// @from(Ln 136251, Col 4)
Ov
// @from(Ln 136252, Col 4)
ga = E(() => {
    eP7();
    q07();
    Ov = Qh3
})
// @from(Ln 136257, Col 4)
Uh3
// @from(Ln 136257, Col 9)
Fa
// @from(Ln 136258, Col 4)
g_1 = E(() => {
    ga();
    EC();
    Uh3 = Ov(CJ, "Map"), Fa = Uh3
})
// @from(Ln 136263, Col 4)
dh3
// @from(Ln 136263, Col 9)
PU
// @from(Ln 136264, Col 4)
Gx6 = E(() => {
    ga();
    dh3 = Ov(Object, "create"), PU = dh3
})
// @from(Ln 136269, Col 0)
function ch3() {
    this.__data__ = PU ? PU(null) : {}, this.size = 0
}
// @from(Ln 136272, Col 4)
K07
// @from(Ln 136273, Col 4)
Y07 = E(() => {
    Gx6();
    K07 = ch3
})
// @from(Ln 136278, Col 0)
function lh3(A) {
    var q = this.has(A) && delete this.__data__[A];
    return this.size -= q ? 1 : 0, q
}
// @from(Ln 136282, Col 4)
z07
// @from(Ln 136283, Col 4)
_07 = E(() => {
    z07 = lh3
})
// @from(Ln 136287, Col 0)
function oh3(A) {
    var q = this.__data__;
    if (PU) {
        var K = q[A];
        return K === ih3 ? void 0 : K
    }
    return rh3.call(q, A) ? q[A] : void 0
}
// @from(Ln 136295, Col 4)
ih3 = "__lodash_hash_undefined__"
// @from(Ln 136296, Col 4)
nh3
// @from(Ln 136296, Col 9)
rh3
// @from(Ln 136296, Col 14)
w07
// @from(Ln 136297, Col 4)
O07 = E(() => {
    Gx6();
    nh3 = Object.prototype, rh3 = nh3.hasOwnProperty;
    w07 = oh3
})
// @from(Ln 136303, Col 0)
function th3(A) {
    var q = this.__data__;
    return PU ? q[A] !== void 0 : sh3.call(q, A)
}
// @from(Ln 136307, Col 4)
ah3
// @from(Ln 136307, Col 9)
sh3
// @from(Ln 136307, Col 14)
$07
// @from(Ln 136308, Col 4)
H07 = E(() => {
    Gx6();
    ah3 = Object.prototype, sh3 = ah3.hasOwnProperty;
    $07 = th3
})
// @from(Ln 136314, Col 0)
function AS3(A, q) {
    var K = this.__data__;
    return this.size += this.has(A) ? 0 : 1, K[A] = PU && q === void 0 ? eh3 : q, this
}
// @from(Ln 136318, Col 4)
eh3 = "__lodash_hash_undefined__"
// @from(Ln 136319, Col 4)
j07
// @from(Ln 136320, Col 4)
J07 = E(() => {
    Gx6();
    j07 = AS3
})
// @from(Ln 136325, Col 0)
function oM6(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 136334, Col 4)
a28
// @from(Ln 136335, Col 4)
M07 = E(() => {
    Y07();
    _07();
    O07();
    H07();
    J07();
    oM6.prototype.clear = K07;
    oM6.prototype.delete = z07;
    oM6.prototype.get = w07;
    oM6.prototype.has = $07;
    oM6.prototype.set = j07;
    a28 = oM6
})
// @from(Ln 136349, Col 0)
function qS3() {
    this.size = 0, this.__data__ = {
        hash: new a28,
        map: new(Fa || Ba),
        string: new a28
    }
}
// @from(Ln 136356, Col 4)
D07
// @from(Ln 136357, Col 4)
X07 = E(() => {
    M07();
    Px6();
    g_1();
    D07 = qS3
})
// @from(Ln 136364, Col 0)
function KS3(A) {
    var q = typeof A;
    return q == "string" || q == "number" || q == "symbol" || q == "boolean" ? A !== "__proto__" : A === null
}
// @from(Ln 136368, Col 4)
P07
// @from(Ln 136369, Col 4)
W07 = E(() => {
    P07 = KS3
})
// @from(Ln 136373, Col 0)
function YS3(A, q) {
    var K = A.__data__;
    return P07(q) ? K[typeof q == "string" ? "string" : "hash"] : K.map
}
// @from(Ln 136377, Col 4)
pa
// @from(Ln 136378, Col 4)
fx6 = E(() => {
    W07();
    pa = YS3
})
// @from(Ln 136383, Col 0)
function zS3(A) {
    var q = pa(this, A).delete(A);
    return this.size -= q ? 1 : 0, q
}
// @from(Ln 136387, Col 4)
Z07
// @from(Ln 136388, Col 4)
G07 = E(() => {
    fx6();
    Z07 = zS3
})
// @from(Ln 136393, Col 0)
function _S3(A) {
    return pa(this, A).get(A)
}
// @from(Ln 136396, Col 4)
f07
// @from(Ln 136397, Col 4)
T07 = E(() => {
    fx6();
    f07 = _S3
})
// @from(Ln 136402, Col 0)
function wS3(A) {
    return pa(this, A).has(A)
}
// @from(Ln 136405, Col 4)
v07
// @from(Ln 136406, Col 4)
N07 = E(() => {
    fx6();
    v07 = wS3
})
// @from(Ln 136411, Col 0)
function OS3(A, q) {
    var K = pa(this, A),
        Y = K.size;
    return K.set(A, q), this.size += K.size == Y ? 0 : 1, this
}
// @from(Ln 136416, Col 4)
V07
// @from(Ln 136417, Col 4)
k07 = E(() => {
    fx6();
    V07 = OS3
})
// @from(Ln 136422, Col 0)
function aM6(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 136431, Col 4)
E07
// @from(Ln 136432, Col 4)
y07 = E(() => {
    X07();
    G07();
    T07();
    N07();
    k07();
    aM6.prototype.clear = D07;
    aM6.prototype.delete = Z07;
    aM6.prototype.get = f07;
    aM6.prototype.has = v07;
    aM6.prototype.set = V07;
    E07 = aM6
})
// @from(Ln 136446, Col 0)
function HS3(A, q) {
    var K = this.__data__;
    if (K instanceof Ba) {
        var Y = K.__data__;
        if (!Fa || Y.length < $S3 - 1) return Y.push([A, q]), this.size = ++K.size, this;
        K = this.__data__ = new E07(Y)
    }
    return K.set(A, q), this.size = K.size, this
}
// @from(Ln 136455, Col 4)
$S3 = 200
// @from(Ln 136456, Col 4)
L07
// @from(Ln 136457, Col 4)
R07 = E(() => {
    Px6();
    g_1();
    y07();
    L07 = HS3
})
// @from(Ln 136464, Col 0)
function sM6(A) {
    var q = this.__data__ = new Ba(A);
    this.size = q.size
}
// @from(Ln 136468, Col 4)
h07
// @from(Ln 136469, Col 4)
S07 = E(() => {
    Px6();
    uP7();
    BP7();
    FP7();
    QP7();
    R07();
    sM6.prototype.clear = xP7;
    sM6.prototype.delete = mP7;
    sM6.prototype.get = gP7;
    sM6.prototype.has = pP7;
    sM6.prototype.set = L07;
    h07 = sM6
})
// @from(Ln 136484, Col 0)
function jS3(A, q) {
    var K = -1,
        Y = A == null ? 0 : A.length;
    while (++K < Y)
        if (q(A[K], K, A) === !1) break;
    return A
}
// @from(Ln 136491, Col 4)
C07
// @from(Ln 136492, Col 4)
I07 = E(() => {
    C07 = jS3
})
// @from(Ln 136495, Col 4)
JS3
// @from(Ln 136495, Col 9)
s28
// @from(Ln 136496, Col 4)
b07 = E(() => {
    ga();
    JS3 = function() {
        try {
            var A = Ov(Object, "defineProperty");
            return A({}, "", {}), A
        } catch (q) {}
    }(), s28 = JS3
})
// @from(Ln 136506, Col 0)
function MS3(A, q, K) {
    if (q == "__proto__" && s28) s28(A, q, {
        configurable: !0,
        enumerable: !0,
        value: K,
        writable: !0
    });
    else A[q] = K
}
// @from(Ln 136515, Col 4)
F_1
// @from(Ln 136516, Col 4)
t28 = E(() => {
    b07();
    F_1 = MS3
})
// @from(Ln 136521, Col 0)
function PS3(A, q, K) {
    var Y = A[q];
    if (!(XS3.call(A, q) && b_1(Y, K)) || K === void 0 && !(q in A)) F_1(A, q, K)
}
// @from(Ln 136525, Col 4)
DS3
// @from(Ln 136525, Col 9)
XS3
// @from(Ln 136525, Col 14)
p_1
// @from(Ln 136526, Col 4)
e28 = E(() => {
    t28();
    i28();
    DS3 = Object.prototype, XS3 = DS3.hasOwnProperty;
    p_1 = PS3
})
// @from(Ln 136533, Col 0)
function WS3(A, q, K, Y) {
    var z = !K;
    K || (K = {});
    var _ = -1,
        w = q.length;
    while (++_ < w) {
        var O = q[_],
            $ = Y ? Y(K[O], A[O], O, K, A) : void 0;
        if ($ === void 0) $ = A[O];
        if (z) F_1(K, O, $);
        else p_1(K, O, $)
    }
    return K
}
// @from(Ln 136547, Col 4)
Qa
// @from(Ln 136548, Col 4)
Tx6 = E(() => {
    e28();
    t28();
    Qa = WS3
})
// @from(Ln 136554, Col 0)
function ZS3(A, q) {
    var K = -1,
        Y = Array(A);
    while (++K < A) Y[K] = q(K);
    return Y
}
// @from(Ln 136560, Col 4)
x07
// @from(Ln 136561, Col 4)
u07 = E(() => {
    x07 = ZS3
})
// @from(Ln 136565, Col 0)
function GS3(A) {
    return A != null && typeof A == "object"
}
// @from(Ln 136568, Col 4)
Om
// @from(Ln 136569, Col 4)
tM6 = E(() => {
    Om = GS3
})
// @from(Ln 136573, Col 0)
function TS3(A) {
    return Om(A) && DU(A) == fS3
}
// @from(Ln 136576, Col 4)
fS3 = "[object Arguments]"
// @from(Ln 136577, Col 4)
Aw8
// @from(Ln 136578, Col 4)
m07 = E(() => {
    Zx6();
    tM6();
    Aw8 = TS3
})
// @from(Ln 136583, Col 4)
B07
// @from(Ln 136583, Col 9)
vS3
// @from(Ln 136583, Col 14)
NS3
// @from(Ln 136583, Col 19)
VS3
// @from(Ln 136583, Col 24)
g07
// @from(Ln 136584, Col 4)
F07 = E(() => {
    m07();
    tM6();
    B07 = Object.prototype, vS3 = B07.hasOwnProperty, NS3 = B07.propertyIsEnumerable, VS3 = Aw8(function() {
        return arguments
    }()) ? Aw8 : function(A) {
        return Om(A) && vS3.call(A, "callee") && !NS3.call(A, "callee")
    }, g07 = VS3
})
// @from(Ln 136593, Col 4)
kS3
// @from(Ln 136593, Col 9)
eM6
// @from(Ln 136594, Col 4)
Q_1 = E(() => {
    kS3 = Array.isArray, eM6 = kS3
})
// @from(Ln 136598, Col 0)
function ES3() {
    return !1
}
// @from(Ln 136601, Col 4)
p07
// @from(Ln 136602, Col 4)
Q07 = E(() => {
    p07 = ES3
})
// @from(Ln 136605, Col 4)
d_1 = {}
// @from(Ln 136609, Col 4)
c07
// @from(Ln 136609, Col 9)
U07
// @from(Ln 136609, Col 14)
yS3
// @from(Ln 136609, Col 19)
d07
// @from(Ln 136609, Col 24)
LS3
// @from(Ln 136609, Col 29)
RS3
// @from(Ln 136609, Col 34)
vx6
// @from(Ln 136610, Col 4)
qw8 = E(() => {
    EC();
    Q07();
    c07 = typeof d_1 == "object" && d_1 && !d_1.nodeType && d_1, U07 = c07 && typeof U_1 == "object" && U_1 && !U_1.nodeType && U_1, yS3 = U07 && U07.exports === c07, d07 = yS3 ? CJ.Buffer : void 0, LS3 = d07 ? d07.isBuffer : void 0, RS3 = LS3 || p07, vx6 = RS3
})
// @from(Ln 136616, Col 0)
function CS3(A, q) {
    var K = typeof A;
    return q = q == null ? hS3 : q, !!q && (K == "number" || K != "symbol" && SS3.test(A)) && (A > -1 && A % 1 == 0 && A < q)
}
// @from(Ln 136620, Col 4)
hS3 = 9007199254740991
// @from(Ln 136621, Col 4)
SS3
// @from(Ln 136621, Col 9)
l07
// @from(Ln 136622, Col 4)
i07 = E(() => {
    SS3 = /^(?:0|[1-9]\d*)$/;
    l07 = CS3
})
// @from(Ln 136627, Col 0)
function bS3(A) {
    return typeof A == "number" && A > -1 && A % 1 == 0 && A <= IS3
}
// @from(Ln 136630, Col 4)
IS3 = 9007199254740991
// @from(Ln 136631, Col 4)
c_1
// @from(Ln 136632, Col 4)
Kw8 = E(() => {
    c_1 = bS3
})
// @from(Ln 136636, Col 0)
function zC3(A) {
    return Om(A) && c_1(A.length) && !!JO[DU(A)]
}
// @from(Ln 136639, Col 4)
xS3 = "[object Arguments]"
// @from(Ln 136640, Col 4)
uS3 = "[object Array]"
// @from(Ln 136641, Col 4)
mS3 = "[object Boolean]"
// @from(Ln 136642, Col 4)
BS3 = "[object Date]"
// @from(Ln 136643, Col 4)
gS3 = "[object Error]"
// @from(Ln 136644, Col 4)
FS3 = "[object Function]"
// @from(Ln 136645, Col 4)
pS3 = "[object Map]"
// @from(Ln 136646, Col 4)
QS3 = "[object Number]"
// @from(Ln 136647, Col 4)
US3 = "[object Object]"
// @from(Ln 136648, Col 4)
dS3 = "[object RegExp]"
// @from(Ln 136649, Col 4)
cS3 = "[object Set]"
// @from(Ln 136650, Col 4)
lS3 = "[object String]"
// @from(Ln 136651, Col 4)
iS3 = "[object WeakMap]"
// @from(Ln 136652, Col 4)
nS3 = "[object ArrayBuffer]"
// @from(Ln 136653, Col 4)
rS3 = "[object DataView]"
// @from(Ln 136654, Col 4)
oS3 = "[object Float32Array]"
// @from(Ln 136655, Col 4)
aS3 = "[object Float64Array]"
// @from(Ln 136656, Col 4)
sS3 = "[object Int8Array]"
// @from(Ln 136657, Col 4)
tS3 = "[object Int16Array]"
// @from(Ln 136658, Col 4)
eS3 = "[object Int32Array]"
// @from(Ln 136659, Col 4)
AC3 = "[object Uint8Array]"
// @from(Ln 136660, Col 4)
qC3 = "[object Uint8ClampedArray]"
// @from(Ln 136661, Col 4)
KC3 = "[object Uint16Array]"
// @from(Ln 136662, Col 4)
YC3 = "[object Uint32Array]"
// @from(Ln 136663, Col 4)
JO
// @from(Ln 136663, Col 8)
n07
// @from(Ln 136664, Col 4)
r07 = E(() => {
    Zx6();
    Kw8();
    tM6();
    JO = {};
    JO[oS3] = JO[aS3] = JO[sS3] = JO[tS3] = JO[eS3] = JO[AC3] = JO[qC3] = JO[KC3] = JO[YC3] = !0;
    JO[xS3] = JO[uS3] = JO[nS3] = JO[mS3] = JO[rS3] = JO[BS3] = JO[gS3] = JO[FS3] = JO[pS3] = JO[QS3] = JO[US3] = JO[dS3] = JO[cS3] = JO[lS3] = JO[iS3] = !1;
    n07 = zC3
})
// @from(Ln 136674, Col 0)
function _C3(A) {
    return function(q) {
        return A(q)
    }
}
// @from(Ln 136679, Col 4)
AD6
// @from(Ln 136680, Col 4)
l_1 = E(() => {
    AD6 = _C3
})
// @from(Ln 136683, Col 4)
n_1 = {}
// @from(Ln 136687, Col 4)
o07
// @from(Ln 136687, Col 9)
Nx6
// @from(Ln 136687, Col 14)
wC3
// @from(Ln 136687, Col 19)
Yw8
// @from(Ln 136687, Col 24)
OC3
// @from(Ln 136687, Col 29)
$m
// @from(Ln 136688, Col 4)
r_1 = E(() => {
    n28();
    o07 = typeof n_1 == "object" && n_1 && !n_1.nodeType && n_1, Nx6 = o07 && typeof i_1 == "object" && i_1 && !i_1.nodeType && i_1, wC3 = Nx6 && Nx6.exports === o07, Yw8 = wC3 && x_1.process, OC3 = function() {
        try {
            var A = Nx6 && Nx6.require && Nx6.require("util").types;
            if (A) return A;
            return Yw8 && Yw8.binding && Yw8.binding("util")
        } catch (q) {}
    }(), $m = OC3
})
// @from(Ln 136698, Col 4)
a07
// @from(Ln 136698, Col 9)
$C3
// @from(Ln 136698, Col 14)
s07
// @from(Ln 136699, Col 4)
t07 = E(() => {
    r07();
    l_1();
    r_1();
    a07 = $m && $m.isTypedArray, $C3 = a07 ? AD6(a07) : n07, s07 = $C3
})
// @from(Ln 136706, Col 0)
function JC3(A, q) {
    var K = eM6(A),
        Y = !K && g07(A),
        z = !K && !Y && vx6(A),
        _ = !K && !Y && !z && s07(A),
        w = K || Y || z || _,
        O = w ? x07(A.length, String) : [],
        $ = O.length;
    for (var H in A)
        if ((q || jC3.call(A, H)) && !(w && (H == "length" || z && (H == "offset" || H == "parent") || _ && (H == "buffer" || H == "byteLength" || H == "byteOffset") || l07(H, $)))) O.push(H);
    return O
}
// @from(Ln 136718, Col 4)
HC3
// @from(Ln 136718, Col 9)
jC3
// @from(Ln 136718, Col 14)
o_1
// @from(Ln 136719, Col 4)
zw8 = E(() => {
    u07();
    F07();
    Q_1();
    qw8();
    i07();
    t07();
    HC3 = Object.prototype, jC3 = HC3.hasOwnProperty;
    o_1 = JC3
})
// @from(Ln 136730, Col 0)
function DC3(A) {
    var q = A && A.constructor,
        K = typeof q == "function" && q.prototype || MC3;
    return A === K
}
// @from(Ln 136735, Col 4)
MC3
// @from(Ln 136735, Col 9)
qD6
// @from(Ln 136736, Col 4)
a_1 = E(() => {
    MC3 = Object.prototype;
    qD6 = DC3
})
// @from(Ln 136741, Col 0)
function XC3(A, q) {
    return function(K) {
        return A(q(K))
    }
}
// @from(Ln 136746, Col 4)
s_1
// @from(Ln 136747, Col 4)
_w8 = E(() => {
    s_1 = XC3
})
// @from(Ln 136750, Col 4)
PC3
// @from(Ln 136750, Col 9)
e07
// @from(Ln 136751, Col 4)
AW7 = E(() => {
    _w8();
    PC3 = s_1(Object.keys, Object), e07 = PC3
})
// @from(Ln 136756, Col 0)
function GC3(A) {
    if (!qD6(A)) return e07(A);
    var q = [];
    for (var K in Object(A))
        if (ZC3.call(A, K) && K != "constructor") q.push(K);
    return q
}
// @from(Ln 136763, Col 4)
WC3
// @from(Ln 136763, Col 9)
ZC3
// @from(Ln 136763, Col 14)
qW7
// @from(Ln 136764, Col 4)
KW7 = E(() => {
    a_1();
    AW7();
    WC3 = Object.prototype, ZC3 = WC3.hasOwnProperty;
    qW7 = GC3
})
// @from(Ln 136771, Col 0)
function fC3(A) {
    return A != null && c_1(A.length) && !m_1(A)
}
// @from(Ln 136774, Col 4)
t_1
// @from(Ln 136775, Col 4)
ww8 = E(() => {
    r28();
    Kw8();
    t_1 = fC3
})
// @from(Ln 136781, Col 0)
function TC3(A) {
    return t_1(A) ? o_1(A) : qW7(A)
}
// @from(Ln 136784, Col 4)
KD6
// @from(Ln 136785, Col 4)
e_1 = E(() => {
    zw8();
    KW7();
    ww8();
    KD6 = TC3
})
// @from(Ln 136792, Col 0)
function vC3(A, q) {
    return A && Qa(q, KD6(q), A)
}
// @from(Ln 136795, Col 4)
YW7
// @from(Ln 136796, Col 4)
zW7 = E(() => {
    Tx6();
    e_1();
    YW7 = vC3
})
// @from(Ln 136802, Col 0)
function NC3(A) {
    var q = [];
    if (A != null)
        for (var K in Object(A)) q.push(K);
    return q
}
// @from(Ln 136808, Col 4)
_W7
// @from(Ln 136809, Col 4)
wW7 = E(() => {
    _W7 = NC3
})
// @from(Ln 136813, Col 0)
function EC3(A) {
    if (!wm(A)) return _W7(A);
    var q = qD6(A),
        K = [];
    for (var Y in A)
        if (!(Y == "constructor" && (q || !kC3.call(A, Y)))) K.push(Y);
    return K
}
// @from(Ln 136821, Col 4)
VC3
// @from(Ln 136821, Col 9)
kC3
// @from(Ln 136821, Col 14)
OW7
// @from(Ln 136822, Col 4)
$W7 = E(() => {
    rM6();
    a_1();
    wW7();
    VC3 = Object.prototype, kC3 = VC3.hasOwnProperty;
    OW7 = EC3
})
// @from(Ln 136830, Col 0)
function yC3(A) {
    return t_1(A) ? o_1(A, !0) : OW7(A)
}
// @from(Ln 136833, Col 4)
YD6
// @from(Ln 136834, Col 4)
A21 = E(() => {
    zw8();
    $W7();
    ww8();
    YD6 = yC3
})
// @from(Ln 136841, Col 0)
function LC3(A, q) {
    return A && Qa(q, YD6(q), A)
}
// @from(Ln 136844, Col 4)
HW7
// @from(Ln 136845, Col 4)
jW7 = E(() => {
    Tx6();
    A21();
    HW7 = LC3
})
// @from(Ln 136850, Col 4)
K21 = {}
// @from(Ln 136855, Col 0)
function hC3(A, q) {
    if (q) return A.slice();
    var K = A.length,
        Y = DW7 ? DW7(K) : new A.constructor(K);
    return A.copy(Y), Y
}
// @from(Ln 136861, Col 4)
XW7
// @from(Ln 136861, Col 9)
JW7
// @from(Ln 136861, Col 14)
RC3
// @from(Ln 136861, Col 19)
MW7
// @from(Ln 136861, Col 24)
DW7
// @from(Ln 136861, Col 29)
Ow8
// @from(Ln 136862, Col 4)
PW7 = E(() => {
    EC();
    XW7 = typeof K21 == "object" && K21 && !K21.nodeType && K21, JW7 = XW7 && typeof q21 == "object" && q21 && !q21.nodeType && q21, RC3 = JW7 && JW7.exports === XW7, MW7 = RC3 ? CJ.Buffer : void 0, DW7 = MW7 ? MW7.allocUnsafe : void 0;
    Ow8 = hC3
})
// @from(Ln 136868, Col 0)
function SC3(A, q) {
    var K = -1,
        Y = A.length;
    q || (q = Array(Y));
    while (++K < Y) q[K] = A[K];
    return q
}
// @from(Ln 136875, Col 4)
WW7
// @from(Ln 136876, Col 4)
ZW7 = E(() => {
    WW7 = SC3
})
// @from(Ln 136880, Col 0)
function CC3(A, q) {
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
// @from(Ln 136891, Col 4)
GW7
// @from(Ln 136892, Col 4)
fW7 = E(() => {
    GW7 = CC3
})
// @from(Ln 136896, Col 0)
function IC3() {
    return []
}
// @from(Ln 136899, Col 4)
Y21
// @from(Ln 136900, Col 4)
$w8 = E(() => {
    Y21 = IC3
})
// @from(Ln 136903, Col 4)
bC3
// @from(Ln 136903, Col 9)
xC3
// @from(Ln 136903, Col 14)
TW7
// @from(Ln 136903, Col 19)
uC3
// @from(Ln 136903, Col 24)
zD6
// @from(Ln 136904, Col 4)
z21 = E(() => {
    fW7();
    $w8();
    bC3 = Object.prototype, xC3 = bC3.propertyIsEnumerable, TW7 = Object.getOwnPropertySymbols, uC3 = !TW7 ? Y21 : function(A) {
        if (A == null) return [];
        return A = Object(A), GW7(TW7(A), function(q) {
            return xC3.call(A, q)
        })
    }, zD6 = uC3
})
// @from(Ln 136915, Col 0)
function mC3(A, q) {
    return Qa(A, zD6(A), q)
}
// @from(Ln 136918, Col 4)
vW7
// @from(Ln 136919, Col 4)
NW7 = E(() => {
    Tx6();
    z21();
    vW7 = mC3
})
// @from(Ln 136925, Col 0)
function BC3(A, q) {
    var K = -1,
        Y = q.length,
        z = A.length;
    while (++K < Y) A[z + K] = q[K];
    return A
}
// @from(Ln 136932, Col 4)
_21
// @from(Ln 136933, Col 4)
Hw8 = E(() => {
    _21 = BC3
})
// @from(Ln 136936, Col 4)
gC3
// @from(Ln 136936, Col 9)
w21
// @from(Ln 136937, Col 4)
jw8 = E(() => {
    _w8();
    gC3 = s_1(Object.getPrototypeOf, Object), w21 = gC3
})
// @from(Ln 136941, Col 4)
FC3
// @from(Ln 136941, Col 9)
pC3
// @from(Ln 136941, Col 14)
O21
// @from(Ln 136942, Col 4)
Jw8 = E(() => {
    Hw8();
    jw8();
    z21();
    $w8();
    FC3 = Object.getOwnPropertySymbols, pC3 = !FC3 ? Y21 : function(A) {
        var q = [];
        while (A) _21(q, zD6(A)), A = w21(A);
        return q
    }, O21 = pC3
})
// @from(Ln 136954, Col 0)
function QC3(A, q) {
    return Qa(A, O21(A), q)
}
// @from(Ln 136957, Col 4)
VW7
// @from(Ln 136958, Col 4)
kW7 = E(() => {
    Tx6();
    Jw8();
    VW7 = QC3
})
// @from(Ln 136964, Col 0)
function UC3(A, q, K) {
    var Y = q(A);
    return eM6(A) ? Y : _21(Y, K(A))
}
// @from(Ln 136968, Col 4)
$21
// @from(Ln 136969, Col 4)
Mw8 = E(() => {
    Hw8();
    Q_1();
    $21 = UC3
})
// @from(Ln 136975, Col 0)
function dC3(A) {
    return $21(A, KD6, zD6)
}
// @from(Ln 136978, Col 4)
EW7
// @from(Ln 136979, Col 4)
yW7 = E(() => {
    Mw8();
    z21();
    e_1();
    EW7 = dC3
})
// @from(Ln 136986, Col 0)
function cC3(A) {
    return $21(A, YD6, O21)
}
// @from(Ln 136989, Col 4)
LW7
// @from(Ln 136990, Col 4)
RW7 = E(() => {
    Mw8();
    Jw8();
    A21();
    LW7 = cC3
})
// @from(Ln 136996, Col 4)
lC3
// @from(Ln 136996, Col 9)
H21
// @from(Ln 136997, Col 4)
hW7 = E(() => {
    ga();
    EC();
    lC3 = Ov(CJ, "DataView"), H21 = lC3
})
// @from(Ln 137002, Col 4)
iC3
// @from(Ln 137002, Col 9)
j21
// @from(Ln 137003, Col 4)
SW7 = E(() => {
    ga();
    EC();
    iC3 = Ov(CJ, "Promise"), j21 = iC3
})
// @from(Ln 137008, Col 4)
nC3
// @from(Ln 137008, Col 9)
J21
// @from(Ln 137009, Col 4)
CW7 = E(() => {
    ga();
    EC();
    nC3 = Ov(CJ, "Set"), J21 = nC3
})
// @from(Ln 137014, Col 4)
rC3
// @from(Ln 137014, Col 9)
M21
// @from(Ln 137015, Col 4)
IW7 = E(() => {
    ga();
    EC();
    rC3 = Ov(CJ, "WeakMap"), M21 = rC3
})
// @from(Ln 137020, Col 4)
bW7 = "[object Map]"
// @from(Ln 137021, Col 4)
oC3 = "[object Object]"
// @from(Ln 137022, Col 4)
xW7 = "[object Promise]"
// @from(Ln 137023, Col 4)
uW7 = "[object Set]"
// @from(Ln 137024, Col 4)
mW7 = "[object WeakMap]"
// @from(Ln 137025, Col 4)
BW7 = "[object DataView]"
// @from(Ln 137026, Col 4)
aC3
// @from(Ln 137026, Col 9)
sC3
// @from(Ln 137026, Col 14)
tC3
// @from(Ln 137026, Col 19)
eC3
// @from(Ln 137026, Col 24)
AI3
// @from(Ln 137026, Col 29)
xq6
// @from(Ln 137026, Col 34)
_D6
// @from(Ln 137027, Col 4)
D21 = E(() => {
    hW7();
    g_1();
    SW7();
    CW7();
    IW7();
    Zx6();
    o28();
    aC3 = XU(H21), sC3 = XU(Fa), tC3 = XU(j21), eC3 = XU(J21), AI3 = XU(M21), xq6 = DU;
    if (H21 && xq6(new H21(new ArrayBuffer(1))) != BW7 || Fa && xq6(new Fa) != bW7 || j21 && xq6(j21.resolve()) != xW7 || J21 && xq6(new J21) != uW7 || M21 && xq6(new M21) != mW7) xq6 = function(A) {
        var q = DU(A),
            K = q == oC3 ? A.constructor : void 0,
            Y = K ? XU(K) : "";
        if (Y) switch (Y) {
            case aC3:
                return BW7;
            case sC3:
                return bW7;
            case tC3:
                return xW7;
            case eC3:
                return uW7;
            case AI3:
                return mW7
        }
        return q
    };
    _D6 = xq6
})
// @from(Ln 137057, Col 0)
function YI3(A) {
    var q = A.length,
        K = new A.constructor(q);
    if (q && typeof A[0] == "string" && KI3.call(A, "index")) K.index = A.index, K.input = A.input;
    return K
}
// @from(Ln 137063, Col 4)
qI3
// @from(Ln 137063, Col 9)
KI3
// @from(Ln 137063, Col 14)
gW7
// @from(Ln 137064, Col 4)
FW7 = E(() => {
    qI3 = Object.prototype, KI3 = qI3.hasOwnProperty;
    gW7 = YI3
})
// @from(Ln 137068, Col 4)
zI3
// @from(Ln 137068, Col 9)
Dw8
// @from(Ln 137069, Col 4)
pW7 = E(() => {
    EC();
    zI3 = CJ.Uint8Array, Dw8 = zI3
})
// @from(Ln 137074, Col 0)
function _I3(A) {
    var q = new A.constructor(A.byteLength);
    return new Dw8(q).set(new Dw8(A)), q
}
// @from(Ln 137078, Col 4)
wD6
// @from(Ln 137079, Col 4)
X21 = E(() => {
    pW7();
    wD6 = _I3
})
// @from(Ln 137084, Col 0)
function wI3(A, q) {
    var K = q ? wD6(A.buffer) : A.buffer;
    return new A.constructor(K, A.byteOffset, A.byteLength)
}
// @from(Ln 137088, Col 4)
QW7
// @from(Ln 137089, Col 4)
UW7 = E(() => {
    X21();
    QW7 = wI3
})
// @from(Ln 137094, Col 0)
function $I3(A) {
    var q = new A.constructor(A.source, OI3.exec(A));
    return q.lastIndex = A.lastIndex, q
}
// @from(Ln 137098, Col 4)
OI3
// @from(Ln 137098, Col 9)
dW7
// @from(Ln 137099, Col 4)
cW7 = E(() => {
    OI3 = /\w*$/;
    dW7 = $I3
})
// @from(Ln 137104, Col 0)
function HI3(A) {
    return iW7 ? Object(iW7.call(A)) : {}
}
// @from(Ln 137107, Col 4)
lW7
// @from(Ln 137107, Col 9)
iW7
// @from(Ln 137107, Col 14)
nW7
// @from(Ln 137108, Col 4)
rW7 = E(() => {
    u_1();
    lW7 = MU ? MU.prototype : void 0, iW7 = lW7 ? lW7.valueOf : void 0;
    nW7 = HI3
})
// @from(Ln 137114, Col 0)
function jI3(A, q) {
    var K = q ? wD6(A.buffer) : A.buffer;
    return new A.constructor(K, A.byteOffset, A.length)
}
// @from(Ln 137118, Col 4)
oW7
// @from(Ln 137119, Col 4)
aW7 = E(() => {
    X21();
    oW7 = jI3
})
// @from(Ln 137124, Col 0)
function SI3(A, q, K) {
    var Y = A.constructor;
    switch (q) {
        case fI3:
            return wD6(A);
        case JI3:
        case MI3:
            return new Y(+A);
        case TI3:
            return QW7(A, K);
        case vI3:
        case NI3:
        case VI3:
        case kI3:
        case EI3:
        case yI3:
        case LI3:
        case RI3:
        case hI3:
            return oW7(A, K);
        case DI3:
            return new Y;
        case XI3:
        case ZI3:
            return new Y(A);
        case PI3:
            return dW7(A);
        case WI3:
            return new Y;
        case GI3:
            return nW7(A)
    }
}
// @from(Ln 137157, Col 4)
JI3 = "[object Boolean]"
// @from(Ln 137158, Col 4)
MI3 = "[object Date]"
// @from(Ln 137159, Col 4)
DI3 = "[object Map]"
// @from(Ln 137160, Col 4)
XI3 = "[object Number]"
// @from(Ln 137161, Col 4)
PI3 = "[object RegExp]"
// @from(Ln 137162, Col 4)
WI3 = "[object Set]"
// @from(Ln 137163, Col 4)
ZI3 = "[object String]"
// @from(Ln 137164, Col 4)
GI3 = "[object Symbol]"
// @from(Ln 137165, Col 4)
fI3 = "[object ArrayBuffer]"
// @from(Ln 137166, Col 4)
TI3 = "[object DataView]"
// @from(Ln 137167, Col 4)
vI3 = "[object Float32Array]"
// @from(Ln 137168, Col 4)
NI3 = "[object Float64Array]"
// @from(Ln 137169, Col 4)
VI3 = "[object Int8Array]"
// @from(Ln 137170, Col 4)
kI3 = "[object Int16Array]"
// @from(Ln 137171, Col 4)
EI3 = "[object Int32Array]"
// @from(Ln 137172, Col 4)
yI3 = "[object Uint8Array]"
// @from(Ln 137173, Col 4)
LI3 = "[object Uint8ClampedArray]"
// @from(Ln 137174, Col 4)
RI3 = "[object Uint16Array]"
// @from(Ln 137175, Col 4)
hI3 = "[object Uint32Array]"
// @from(Ln 137176, Col 4)
sW7
// @from(Ln 137177, Col 4)
tW7 = E(() => {
    X21();
    UW7();
    cW7();
    rW7();
    aW7();
    sW7 = SI3
})
// @from(Ln 137185, Col 4)
eW7
// @from(Ln 137185, Col 9)
CI3
// @from(Ln 137185, Col 14)
AZ7
// @from(Ln 137186, Col 4)
qZ7 = E(() => {
    rM6();
    eW7 = Object.create, CI3 = function() {
        function A() {}
        return function(q) {
            if (!wm(q)) return {};
            if (eW7) return eW7(q);
            A.prototype = q;
            var K = new A;
            return A.prototype = void 0, K
        }
    }(), AZ7 = CI3
})
// @from(Ln 137200, Col 0)
function II3(A) {
    return typeof A.constructor == "function" && !qD6(A) ? AZ7(w21(A)) : {}
}
// @from(Ln 137203, Col 4)
KZ7
// @from(Ln 137204, Col 4)
YZ7 = E(() => {
    qZ7();
    jw8();
    a_1();
    KZ7 = II3
})
// @from(Ln 137211, Col 0)
function xI3(A) {
    return Om(A) && _D6(A) == bI3
}
// @from(Ln 137214, Col 4)
bI3 = "[object Map]"
// @from(Ln 137215, Col 4)
zZ7
// @from(Ln 137216, Col 4)
_Z7 = E(() => {
    D21();
    tM6();
    zZ7 = xI3
})
// @from(Ln 137221, Col 4)
wZ7
// @from(Ln 137221, Col 9)
uI3
// @from(Ln 137221, Col 14)
OZ7
// @from(Ln 137222, Col 4)
$Z7 = E(() => {
    _Z7();
    l_1();
    r_1();
    wZ7 = $m && $m.isMap, uI3 = wZ7 ? AD6(wZ7) : zZ7, OZ7 = uI3
})
// @from(Ln 137229, Col 0)
function BI3(A) {
    return Om(A) && _D6(A) == mI3
}
// @from(Ln 137232, Col 4)
mI3 = "[object Set]"
// @from(Ln 137233, Col 4)
HZ7
// @from(Ln 137234, Col 4)
jZ7 = E(() => {
    D21();
    tM6();
    HZ7 = BI3
})
// @from(Ln 137239, Col 4)
JZ7
// @from(Ln 137239, Col 9)
gI3
// @from(Ln 137239, Col 14)
MZ7
// @from(Ln 137240, Col 4)
DZ7 = E(() => {
    jZ7();
    l_1();
    r_1();
    JZ7 = $m && $m.isSet, gI3 = JZ7 ? AD6(JZ7) : HZ7, MZ7 = gI3
})
// @from(Ln 137247, Col 0)
function P21(A, q, K, Y, z, _) {
    var w, O = q & FI3,
        $ = q & pI3,
        H = q & QI3;
    if (K) w = z ? K(A, Y, z, _) : K(A);
    if (w !== void 0) return w;
    if (!wm(A)) return A;
    var j = eM6(A);
    if (j) {
        if (w = gW7(A), !O) return WW7(A, w)
    } else {
        var J = _D6(A),
            M = J == PZ7 || J == iI3;
        if (vx6(A)) return Ow8(A, O);
        if (J == WZ7 || J == XZ7 || M && !z) {
            if (w = $ || M ? {} : KZ7(A), !O) return $ ? VW7(A, HW7(w, A)) : vW7(A, YW7(w, A))
        } else {
            if (!Rw[J]) return z ? A : {};
            w = sW7(A, J, O)
        }
    }
    _ || (_ = new h07);
    var D = _.get(A);
    if (D) return D;
    if (_.set(A, w), MZ7(A)) A.forEach(function(W) {
        w.add(P21(W, q, K, W, A, _))
    });
    else if (OZ7(A)) A.forEach(function(W, Z) {
        w.set(Z, P21(W, q, K, Z, A, _))
    });
    var X = H ? $ ? LW7 : EW7 : $ ? YD6 : KD6,
        P = j ? void 0 : X(A);
    return C07(P || A, function(W, Z) {
        if (P) Z = W, W = A[Z];
        p_1(w, Z, P21(W, q, K, Z, A, _))
    }), w
}
// @from(Ln 137284, Col 4)
FI3 = 1
// @from(Ln 137285, Col 4)
pI3 = 2
// @from(Ln 137286, Col 4)
QI3 = 4
// @from(Ln 137287, Col 4)
XZ7 = "[object Arguments]"
// @from(Ln 137288, Col 4)
UI3 = "[object Array]"
// @from(Ln 137289, Col 4)
dI3 = "[object Boolean]"
// @from(Ln 137290, Col 4)
cI3 = "[object Date]"
// @from(Ln 137291, Col 4)
lI3 = "[object Error]"
// @from(Ln 137292, Col 4)
PZ7 = "[object Function]"
// @from(Ln 137293, Col 4)
iI3 = "[object GeneratorFunction]"
// @from(Ln 137294, Col 4)
nI3 = "[object Map]"
// @from(Ln 137295, Col 4)
rI3 = "[object Number]"
// @from(Ln 137296, Col 4)
WZ7 = "[object Object]"
// @from(Ln 137297, Col 4)
oI3 = "[object RegExp]"
// @from(Ln 137298, Col 4)
aI3 = "[object Set]"
// @from(Ln 137299, Col 4)
sI3 = "[object String]"
// @from(Ln 137300, Col 4)
tI3 = "[object Symbol]"
// @from(Ln 137301, Col 4)
eI3 = "[object WeakMap]"
// @from(Ln 137302, Col 4)
Ab3 = "[object ArrayBuffer]"
// @from(Ln 137303, Col 4)
qb3 = "[object DataView]"
// @from(Ln 137304, Col 4)
Kb3 = "[object Float32Array]"
// @from(Ln 137305, Col 4)
Yb3 = "[object Float64Array]"
// @from(Ln 137306, Col 4)
zb3 = "[object Int8Array]"
// @from(Ln 137307, Col 4)
_b3 = "[object Int16Array]"
// @from(Ln 137308, Col 4)
wb3 = "[object Int32Array]"
// @from(Ln 137309, Col 4)
Ob3 = "[object Uint8Array]"
// @from(Ln 137310, Col 4)
$b3 = "[object Uint8ClampedArray]"
// @from(Ln 137311, Col 4)
Hb3 = "[object Uint16Array]"
// @from(Ln 137312, Col 4)
jb3 = "[object Uint32Array]"
// @from(Ln 137313, Col 4)
Rw
// @from(Ln 137313, Col 8)
ZZ7
// @from(Ln 137314, Col 4)
GZ7 = E(() => {
    S07();
    I07();
    e28();
    zW7();
    jW7();
    PW7();
    ZW7();
    NW7();
    kW7();
    yW7();
    RW7();
    D21();
    FW7();
    tW7();
    YZ7();
    Q_1();
    qw8();
    $Z7();
    rM6();
    DZ7();
    e_1();
    A21();
    Rw = {};
    Rw[XZ7] = Rw[UI3] = Rw[Ab3] = Rw[qb3] = Rw[dI3] = Rw[cI3] = Rw[Kb3] = Rw[Yb3] = Rw[zb3] = Rw[_b3] = Rw[wb3] = Rw[nI3] = Rw[rI3] = Rw[WZ7] = Rw[oI3] = Rw[aI3] = Rw[sI3] = Rw[tI3] = Rw[Ob3] = Rw[$b3] = Rw[Hb3] = Rw[jb3] = !0;
    Rw[lI3] = Rw[PZ7] = Rw[eI3] = !1;
    ZZ7 = P21
})
// @from(Ln 137343, Col 0)
function Db3(A) {
    return ZZ7(A, Jb3 | Mb3)
}
// @from(Ln 137346, Col 4)
Jb3 = 1
// @from(Ln 137347, Col 4)
Mb3 = 4
// @from(Ln 137348, Col 4)
Xw8
// @from(Ln 137349, Col 4)
fZ7 = E(() => {
    GZ7();
    Xw8 = Db3
})
// @from(Ln 137353, Col 4)
TZ7 = E(() => {
    fZ7()
})
// @from(Ln 137358, Col 0)
function Pw8() {
    if (process.platform !== "linux") return;
    try {
        let A = vZ7.readFileSync("/proc/version", {
                encoding: "utf8"
            }),
            q = A.match(/WSL(\d+)/i);
        if (q && q[1]) return q[1];
        if (A.toLowerCase().includes("microsoft")) return "1";
        return
    } catch {
        return
    }
}
// @from(Ln 137373, Col 0)
function $v() {
    switch (process.platform) {
        case "darwin":
            return "macos";
        case "linux":
            return "linux";
        case "win32":
            return "windows";
        default:
            return "unknown"
    }
}
// @from(Ln 137385, Col 4)
W21 = () => {}
// @from(Ln 137392, Col 0)
async function VZ7(A, q, K, Y = {
    command: "rg"
}) {
    let {
        command: z,
        args: _ = [],
        argv0: w
    } = Y, O = Xb3(z, [..._, ...A, q], {
        argv0: w,
        signal: K,
        timeout: 1e4,
        windowsHide: !0
    }), [$, H, j] = await Promise.all([NZ7(O.stdout), NZ7(O.stderr), new Promise((J, M) => {
        O.on("close", J), O.on("error", M)
    })]);
    if (j === 0) return $.trim().split(`
`).filter(Boolean);
    if (j === 1) return [];
    throw Error(`ripgrep failed with exit code ${j}: ${H}`)
}
// @from(Ln 137412, Col 4)
kZ7 = E(() => {
    Dx6()
})
// @from(Ln 137421, Col 0)
function G21() {
    return [...Pb3.filter((A) => A !== ".git"), ".claude/commands", ".claude/agents"]
}
// @from(Ln 137425, Col 0)
function Zw8(A) {
    return A.toLowerCase()
}
// @from(Ln 137429, Col 0)
function zk(A) {
    return A.includes("*") || A.includes("?") || A.includes("[") || A.includes("]")
}
// @from(Ln 137433, Col 0)
function mq6(A) {
    return A.replace(/\/\*\*$/, "") || "/"
}
// @from(Ln 137437, Col 0)
function Z21(A, q) {
    let K = FG.normalize(A),
        Y = FG.normalize(q);
    if (Y === K) return !1;
    if (K.startsWith("/tmp/") && Y === "/private" + K) return !1;
    if (K.startsWith("/var/") && Y === "/private" + K) return !1;
    if (K.startsWith("/private/tmp/") && Y === K) return !1;
    if (K.startsWith("/private/var/") && Y === K) return !1;
    if (Y === "/") return !0;
    if (Y.split("/").filter(Boolean).length <= 1) return !0;
    if (K.startsWith(Y + "/")) return !0;
    let _ = K;
    if (K.startsWith("/tmp/")) _ = "/private" + K;
    else if (K.startsWith("/var/")) _ = "/private" + K;
    if (_ !== K && _.startsWith(Y + "/")) return !0;
    let w = Y.startsWith(K + "/"),
        O = _ !== K && Y.startsWith(_ + "/");
    if (Y !== K && !(_ !== K && Y === _) && !w && !O) return !0;
    return !1
}
// @from(Ln 137458, Col 0)
function EL(A) {
    let q = process.cwd(),
        K = A;
    if (A === "~") K = Ww8();
    else if (A.startsWith("~/")) K = Ww8() + A.slice(1);
    else if (A.startsWith("./") || A.startsWith("../")) K = FG.resolve(q, A);
    else if (!FG.isAbsolute(A)) K = FG.resolve(q, A);
    if (zk(K)) {
        let Y = K.split(/[*?[\]]/)[0];
        if (Y && Y !== "/") {
            let z = Y.endsWith("/") ? Y.slice(0, -1) : FG.dirname(Y);
            try {
                let _ = uq6.realpathSync(z);
                if (!Z21(z, _)) {
                    let w = K.slice(z.length);
                    return _ + w
                }
            } catch {}
        }
        return K
    }
    try {
        let Y = uq6.realpathSync(K);
        if (Z21(K, Y));
        else K = Y
    } catch {}
    return K
}
// @from(Ln 137487, Col 0)
function kx6() {
    let A = Ww8();
    return ["/dev/stdout", "/dev/stderr", "/dev/null", "/dev/tty", "/dev/dtracehelper", "/dev/autofs_nowait", "/tmp/claude", "/private/tmp/claude", FG.join(A, ".npm/_logs"), FG.join(A, ".claude/debug")]
}
// @from(Ln 137492, Col 0)
function f21(A, q) {
    let Y = ["SANDBOX_RUNTIME=1", `TMPDIR=${process.env.CLAUDE_TMPDIR||"/tmp/claude"}`];
    if (!A && !q) return Y;
    let z = ["localhost", "127.0.0.1", "::1", "*.local", ".local", "169.254.0.0/16", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"].join(",");
    if (Y.push(`NO_PROXY=${z}`), Y.push(`no_proxy=${z}`), A) Y.push(`HTTP_PROXY=http://localhost:${A}`), Y.push(`HTTPS_PROXY=http://localhost:${A}`), Y.push(`http_proxy=http://localhost:${A}`), Y.push(`https_proxy=http://localhost:${A}`);
    if (q) {
        if (Y.push(`ALL_PROXY=socks5h://localhost:${q}`), Y.push(`all_proxy=socks5h://localhost:${q}`), $v() === "macos") Y.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='nc -X 5 -x localhost:${q} %h %p'`);
        if (Y.push(`FTP_PROXY=socks5h://localhost:${q}`), Y.push(`ftp_proxy=socks5h://localhost:${q}`), Y.push(`RSYNC_PROXY=localhost:${q}`), Y.push(`DOCKER_HTTP_PROXY=http://localhost:${A||q}`), Y.push(`DOCKER_HTTPS_PROXY=http://localhost:${A||q}`), A) Y.push("CLOUDSDK_PROXY_TYPE=https"), Y.push("CLOUDSDK_PROXY_ADDRESS=localhost"), Y.push(`CLOUDSDK_PROXY_PORT=${A}`);
        Y.push(`GRPC_PROXY=socks5h://localhost:${q}`), Y.push(`grpc_proxy=socks5h://localhost:${q}`)
    }
    return Y
}
// @from(Ln 137505, Col 0)
function T21(A) {
    let q = A.slice(0, 100);
    return Buffer.from(q).toString("base64")
}
// @from(Ln 137510, Col 0)
function EZ7(A) {
    return Buffer.from(A, "base64").toString("utf8")
}
// @from(Ln 137514, Col 0)
function OD6(A) {
    return "^" + A.replace(/[.^$+{}()|\\]/g, "\\$&").replace(/\[([^\]]*?)$/g, "\\[$1").replace(/\*\*\//g, "__GLOBSTAR_SLASH__").replace(/\*\*/g, "__GLOBSTAR__").replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]").replace(/__GLOBSTAR_SLASH__/g, "(.*/)?").replace(/__GLOBSTAR__/g, ".*") + "$"
}
// @from(Ln 137518, Col 0)
function Gw8(A) {
    let q = EL(A),
        K = q.split(/[*?[\]]/)[0];
    if (!K || K === "/") return wA(`[Sandbox] Glob pattern too broad, skipping: ${A}`), [];
    let Y = K.endsWith("/") ? K.slice(0, -1) : FG.dirname(K);
    if (!uq6.existsSync(Y)) return wA(`[Sandbox] Base directory for glob does not exist: ${Y}`), [];
    let z = new RegExp(OD6(q)),
        _ = [];
    try {
        let w = uq6.readdirSync(Y, {
            recursive: !0,
            withFileTypes: !0
        });
        for (let O of w) {
            let $ = O.parentPath ?? O.path ?? Y,
                H = FG.join($, O.name);
            if (z.test(H)) _.push(H)
        }
    } catch (w) {
        wA(`[Sandbox] Error expanding glob pattern ${A}: ${w}`)
    }
    return _
}
// @from(Ln 137541, Col 4)
Vx6
// @from(Ln 137541, Col 9)
Pb3
// @from(Ln 137542, Col 4)
$D6 = E(() => {
    W21();
    Vx6 = [".gitconfig", ".gitmodules", ".bashrc", ".bash_profile", ".zshrc", ".zprofile", ".profile", ".ripgreprc", ".mcp.json"], Pb3 = [".git", ".vscode", ".idea"]
})
// @from(Ln 137561, Col 0)
function yZ7() {
    if (vw8) return vw8;
    let A = [];
    try {
        let K = Gb3("npm root -g", {
            encoding: "utf8",
            timeout: 5000,
            stdio: ["pipe", "pipe", "ignore"]
        }).trim();
        if (K) A.push(yL(K, "@anthropic-ai", "sandbox-runtime"))
    } catch {}
    let q = fb3();
    return A.push(yL("/usr", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), yL("/usr", "local", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), yL("/opt", "homebrew", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), yL(q, ".npm", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), yL(q, ".npm-global", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime")), vw8 = A, A
}
// @from(Ln 137576, Col 0)
function Nw8() {
    let A = process.arch;
    switch (A) {
        case "x64":
        case "x86_64":
            return "x64";
        case "arm64":
        case "aarch64":
            return "arm64";
        case "ia32":
        case "x86":
            return wA("[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking. The current seccomp filter only blocks socket(AF_UNIX, ...), but on 32-bit x86, socketcall() can be used to bypass this.", {
                level: "error"
            }), null;
        default:
            return wA(`[SeccompFilter] Unsupported architecture: ${A}. Only x64 and arm64 are supported.`), null
    }
}
// @from(Ln 137595, Col 0)
function LZ7(A) {
    let q = Nw8();
    if (!q) return [];
    let K = Wb3(Zb3(import.meta.url)),
        Y = yL("vendor", "seccomp", q, A);
    return [yL(K, Y), yL(K, "..", "..", Y), yL(K, "..", Y)]
}
// @from(Ln 137603, Col 0)
function Vw8(A) {
    let q = A ?? "";
    if (fw8.has(q)) return fw8.get(q);
    let K = Tb3(A);
    return fw8.set(q, K), K
}
// @from(Ln 137610, Col 0)
function Tb3(A) {
    if (A) {
        if (Bq6.existsSync(A)) return wA(`[SeccompFilter] Using BPF filter from explicit path: ${A}`), A;
        wA(`[SeccompFilter] Explicit path provided but file not found: ${A}`)
    }
    let q = Nw8();
    if (!q) return wA(`[SeccompFilter] Cannot find pre-generated BPF filter: unsupported architecture ${process.arch}`), null;
    wA(`[SeccompFilter] Detected architecture: ${q}`);
    for (let K of LZ7("unix-block.bpf"))
        if (Bq6.existsSync(K)) return wA(`[SeccompFilter] Found pre-generated BPF filter: ${K} (${q})`), K;
    for (let K of yZ7()) {
        let Y = yL(K, "vendor", "seccomp", q, "unix-block.bpf");
        if (Bq6.existsSync(Y)) return wA(`[SeccompFilter] Found pre-generated BPF filter in global install: ${Y} (${q})`), Y
    }
    return wA(`[SeccompFilter] Pre-generated BPF filter not found in any expected location (${q})`), null
}
// @from(Ln 137627, Col 0)
function Ex6(A) {
    let q = A ?? "";
    if (Tw8.has(q)) return Tw8.get(q);
    let K = vb3(A);
    return Tw8.set(q, K), K
}
// @from(Ln 137634, Col 0)
function vb3(A) {
    if (A) {
        if (Bq6.existsSync(A)) return wA(`[SeccompFilter] Using apply-seccomp binary from explicit path: ${A}`), A;
        wA(`[SeccompFilter] Explicit path provided but file not found: ${A}`)
    }
    let q = Nw8();
    if (!q) return wA(`[SeccompFilter] Cannot find apply-seccomp binary: unsupported architecture ${process.arch}`), null;
    wA(`[SeccompFilter] Looking for apply-seccomp binary for architecture: ${q}`);
    for (let K of LZ7("apply-seccomp"))
        if (Bq6.existsSync(K)) return wA(`[SeccompFilter] Found apply-seccomp binary: ${K} (${q})`), K;
    for (let K of yZ7()) {
        let Y = yL(K, "vendor", "seccomp", q, "apply-seccomp");
        if (Bq6.existsSync(Y)) return wA(`[SeccompFilter] Found apply-seccomp binary in global install: ${Y} (${q})`), Y
    }
    return wA(`[SeccompFilter] apply-seccomp binary not found in any expected location (${q})`), null
}
// @from(Ln 137651, Col 0)
function RZ7(A) {
    let q = Vw8(A);
    if (q) return wA("[SeccompFilter] Using pre-generated BPF filter"), q;
    return wA("[SeccompFilter] Pre-generated BPF filter not available for this architecture. Only x64 and arm64 are supported.", {
        level: "error"
    }), null
}
// @from(Ln 137659, Col 0)
function kw8(A) {}
// @from(Ln 137660, Col 4)
fw8
// @from(Ln 137660, Col 9)
Tw8
// @from(Ln 137660, Col 14)
vw8 = null
// @from(Ln 137661, Col 4)
hZ7 = E(() => {
    fw8 = new Map, Tw8 = new Map
})
// @from(Ln 137678, Col 0)
function Vb3(A, q) {
    let K = A.split(IJ.sep),
        Y = "";
    for (let z of K) {
        if (!z) continue;
        let _ = Y + IJ.sep + z;
        try {
            if ($2.lstatSync(_).isSymbolicLink()) {
                if (q.some(($) => _.startsWith($ + "/") || _ === $)) return _
            }
        } catch {
            break
        }
        Y = _
    }
    return null
}
// @from(Ln 137696, Col 0)
function kb3(A) {
    let q = A.split(IJ.sep),
        K = "";
    for (let Y of q) {
        if (!Y) continue;
        let z = K + IJ.sep + Y;
        try {
            let _ = $2.statSync(z);
            if (_.isFile() || _.isSymbolicLink()) return !0
        } catch {
            break
        }
        K = z
    }
    return !1
}
// @from(Ln 137713, Col 0)
function Eb3(A) {
    let q = A.split(IJ.sep),
        K = "";
    for (let Y of q) {
        if (!Y) continue;
        let z = K + IJ.sep + Y;
        if (!$2.existsSync(z)) return z;
        K = z
    }
    return A
}
// @from(Ln 137724, Col 0)
async function yb3(A = {
    command: "rg"
}, q = Rw8, K = !1, Y) {
    let z = process.cwd(),
        _ = new AbortController,
        w = Y ?? _.signal,
        O = G21(),
        $ = [...Vx6.map((D) => IJ.resolve(z, D)), ...O.map((D) => IJ.resolve(z, D))],
        H = IJ.resolve(z, ".git"),
        j = !1;
    try {
        j = $2.statSync(H).isDirectory()
    } catch {}
    if (j) {
        if ($.push(IJ.resolve(z, ".git/hooks")), !K) $.push(IJ.resolve(z, ".git/config"))
    }
    let J = [];
    for (let D of Vx6) J.push("--iglob", D);
    for (let D of O) J.push("--iglob", `**/${D}/**`);
    if (J.push("--iglob", "**/.git/hooks/**"), !K) J.push("--iglob", "**/.git/config");
    let M = [];
    try {
        M = await VZ7(["--files", "--hidden", "--max-depth", String(q), ...J, "-g", "!**/node_modules/**"], z, w, A)
    } catch (D) {
        wA(`[Sandbox] ripgrep scan failed: ${D}`)
    }
    for (let D of M) {
        let X = IJ.resolve(z, D),
            P = !1;
        for (let W of [...O, ".git"]) {
            let Z = Zw8(W),
                G = X.split(IJ.sep),
                f = G.findIndex((v) => Zw8(v) === Z);
            if (f !== -1) {
                if (W === ".git") {
                    let v = G.slice(0, f + 1).join(IJ.sep);
                    if (D.includes(".git/hooks")) $.push(IJ.join(v, "hooks"));
                    else if (D.includes(".git/config")) $.push(IJ.join(v, "config"))
                } else $.push(G.slice(0, f + 1).join(IJ.sep));
                P = !0;
                break
            }
        }
        if (!P) $.push(X)
    }
    return [...new Set($)]
}
// @from(Ln 137772, Col 0)
function Lw8() {
    if (IZ7) return;
    process.on("exit", () => {
        for (let A of yw8) try {
            kw8(A)
        } catch {}
        hw8()
    }), IZ7 = !0
}
// @from(Ln 137782, Col 0)
function hw8() {
    for (let A of v21) try {
        let q = $2.statSync(A);
        if (q.isFile() && q.size === 0) $2.unlinkSync(A), wA(`[Sandbox Linux] Cleaned up bwrap mount point (file): ${A}`);
        else if (q.isDirectory()) {
            if ($2.readdirSync(A).length === 0) $2.rmdirSync(A), wA(`[Sandbox Linux] Cleaned up bwrap mount point (dir): ${A}`)
        }
    } catch {}
    v21.clear()
}
// @from(Ln 137793, Col 0)
function bZ7(A) {
    let q = [],
        K = [];
    if (JU("bwrap") === null) q.push("bubblewrap (bwrap) not installed");
    if (JU("socat") === null) q.push("socat not installed");
    let Y = Vw8(A?.bpfPath) !== null,
        z = Ex6(A?.applyPath) !== null;
    if (!Y || !z) K.push("seccomp not available - unix socket access not restricted");
    return {
        warnings: K,
        errors: q
    }
}
// @from(Ln 137806, Col 0)
async function xZ7(A, q) {
    let K = Nb3(8).toString("hex"),
        Y = CZ7(Ew8(), `claude-http-${K}.sock`),
        z = CZ7(Ew8(), `claude-socks-${K}.sock`),
        _ = [`UNIX-LISTEN:${Y},fork,reuseaddr`, `TCP:localhost:${A},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
    wA(`Starting HTTP bridge: socat ${_.join(" ")}`);
    let w = SZ7("socat", _, {
        stdio: "ignore"
    });
    if (!w.pid) throw Error("Failed to start HTTP bridge process");
    w.on("error", (j) => {
        wA(`HTTP bridge process error: ${j}`, {
            level: "error"
        })
    }), w.on("exit", (j, J) => {
        wA(`HTTP bridge process exited with code ${j}, signal ${J}`, {
            level: j === 0 ? "info" : "error"
        })
    });
    let O = [`UNIX-LISTEN:${z},fork,reuseaddr`, `TCP:localhost:${q},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
    wA(`Starting SOCKS bridge: socat ${O.join(" ")}`);
    let $ = SZ7("socat", O, {
        stdio: "ignore"
    });
    if (!$.pid) {
        if (w.pid) try {
            process.kill(w.pid, "SIGTERM")
        } catch {}
        throw Error("Failed to start SOCKS bridge process")
    }
    $.on("error", (j) => {
        wA(`SOCKS bridge process error: ${j}`, {
            level: "error"
        })
    }), $.on("exit", (j, J) => {
        wA(`SOCKS bridge process exited with code ${j}, signal ${J}`, {
            level: j === 0 ? "info" : "error"
        })
    });
    let H = 5;
    for (let j = 0; j < H; j++) {
        if (!w.pid || w.killed || !$.pid || $.killed) throw Error("Linux bridge process died unexpectedly");
        try {
            if ($2.existsSync(Y) && $2.existsSync(z)) {
                wA(`Linux bridges ready after ${j+1} attempts`);
                break
            }
        } catch (J) {
            wA(`Error checking sockets (attempt ${j+1}): ${J}`, {
                level: "error"
            })
        }
        if (j === H - 1) {
            if (w.pid) try {
                process.kill(w.pid, "SIGTERM")
            } catch {}
            if ($.pid) try {
                process.kill($.pid, "SIGTERM")
            } catch {}
            throw Error(`Failed to create bridge sockets after ${H} attempts`)
        }
        await new Promise((J) => setTimeout(J, j * 100))
    }
    return {
        httpSocketPath: Y,
        socksSocketPath: z,
        httpBridgeProcess: w,
        socksBridgeProcess: $,
        httpProxyPort: A,
        socksProxyPort: q
    }
}
// @from(Ln 137879, Col 0)
function Lb3(A, q, K, Y, z, _) {
    let w = z || "bash",
        O = [`socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${A} >/dev/null 2>&1 &`, `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${q} >/dev/null 2>&1 &`, 'trap "kill %1 %2 2>/dev/null; exit" EXIT'];
    if (Y) {
        let $ = Ex6(_);
        if (!$) throw Error("apply-seccomp binary not found. This should have been caught earlier. Ensure vendor/seccomp/{x64,arm64}/apply-seccomp binaries are included in the package.");
        let H = gq6.default.quote([$, Y, w, "-c", K]),
            j = [...O, H].join(`
`);
        return `${w} -c ${gq6.default.quote([j])}`
    } else {
        let $ = [...O, `eval ${gq6.default.quote([K])}`].join(`
`);
        return `${w} -c ${gq6.default.quote([$])}`
    }
}
// @from(Ln 137895, Col 0)
async function Rb3(A, q, K = {
    command: "rg"
}, Y = Rw8, z = !1, _) {
    let w = [];
    if (q) {
        w.push("--ro-bind", "/", "/");
        let $ = [];
        for (let j of q.allowOnly || []) {
            let J = EL(j);
            if (wA(`[Sandbox Linux] Processing write path: ${j} -> ${J}`), J.startsWith("/dev/")) {
                wA(`[Sandbox Linux] Skipping /dev path: ${J}`);
                continue
            }
            if (!$2.existsSync(J)) {
                wA(`[Sandbox Linux] Skipping non-existent write path: ${J}`);
                continue
            }
            try {
                let M = $2.realpathSync(J),
                    D = J.replace(/\/+$/, "");
                if (M !== D && Z21(J, M)) {
                    wA(`[Sandbox Linux] Skipping symlink write path pointing outside expected location: ${j} -> ${M}`);
                    continue
                }
            } catch {
                wA(`[Sandbox Linux] Skipping write path that could not be resolved: ${J}`);
                continue
            }
            w.push("--bind", J, J), $.push(J)
        }
        let H = [...q.denyWithinAllow || [], ...await yb3(K, Y, z, _)];
        for (let j of H) {
            let J = EL(j);
            if (J.startsWith("/dev/")) continue;
            let M = Vb3(J, $);
            if (M) {
                w.push("--ro-bind", "/dev/null", M), wA(`[Sandbox Linux] Mounted /dev/null at symlink ${M} to prevent symlink replacement attack`);
                continue
            }
            if (!$2.existsSync(J)) {
                if (kb3(J)) {
                    wA(`[Sandbox Linux] Skipping deny path with file ancestor (cannot create paths under a file): ${J}`);
                    continue
                }
                let X = IJ.dirname(J);
                while (X !== "/" && !$2.existsSync(X)) X = IJ.dirname(X);
                if ($.some((W) => X.startsWith(W + "/") || X === W || J.startsWith(W + "/"))) {
                    let W = Eb3(J);
                    if (W !== J) {
                        let Z = $2.mkdtempSync(IJ.join(Ew8(), "claude-empty-"));
                        w.push("--ro-bind", Z, W), v21.add(W), Lw8(), wA(`[Sandbox Linux] Mounted empty dir at ${W} to block creation of ${J}`)
                    } else w.push("--ro-bind", "/dev/null", W), v21.add(W), Lw8(), wA(`[Sandbox Linux] Mounted /dev/null at ${W} to block creation of ${J}`)
                } else wA(`[Sandbox Linux] Skipping non-existent deny path not within allowed paths: ${J}`);
                continue
            }
            if ($.some((X) => J.startsWith(X + "/") || J === X)) w.push("--ro-bind", J, J);
            else wA(`[Sandbox Linux] Skipping deny path not within allowed paths: ${J}`)
        }
    } else w.push("--bind", "/", "/");
    let O = [...A?.denyOnly || []];
    if ($2.existsSync("/etc/ssh/ssh_config.d")) O.push("/etc/ssh/ssh_config.d");
    for (let $ of O) {
        let H = EL($);
        if (!$2.existsSync(H)) {
            wA(`[Sandbox Linux] Skipping non-existent read deny path: ${H}`);
            continue
        }
        if ($2.statSync(H).isDirectory()) w.push("--tmpfs", H);
        else w.push("--ro-bind", "/dev/null", H)
    }
    return w
}
// @from(Ln 137967, Col 0)
async function uZ7(A) {
    let {
        command: q,
        needsNetworkRestriction: K,
        httpSocketPath: Y,
        socksSocketPath: z,
        httpProxyPort: _,
        socksProxyPort: w,
        readConfig: O,
        writeConfig: $,
        enableWeakerNestedSandbox: H,
        allowAllUnixSockets: j,
        binShell: J,
        ripgrepConfig: M = {
            command: "rg"
        },
        mandatoryDenySearchDepth: D = Rw8,
        allowGitConfig: X = !1,
        seccompConfig: P,
        abortSignal: W
    } = A, Z = O && O.denyOnly.length > 0, G = $ !== void 0;
    if (!K && !Z && !G) return q;
    let f = ["--new-session", "--die-with-parent"],
        v = void 0;
    try {
        if (!j) {
            v = RZ7(P?.bpfPath) ?? void 0;
            let u = Ex6(P?.applyPath);
            if (!v || !u) wA("[Sandbox Linux] Seccomp binaries not available - unix socket blocking disabled. Install @anthropic-ai/sandbox-runtime globally for full protection.", {
                level: "warn"
            }), v = void 0;
            else {
                if (!v.includes("/vendor/seccomp/")) yw8.add(v), Lw8();
                wA("[Sandbox Linux] Generated seccomp BPF filter for Unix socket blocking")
            }
        } else wA("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
        if (K) {
            if (f.push("--unshare-net"), Y && z) {
                if (!$2.existsSync(Y)) throw Error(`Linux HTTP bridge socket does not exist: ${Y}. The bridge process may have died. Try reinitializing the sandbox.`);
                if (!$2.existsSync(z)) throw Error(`Linux SOCKS bridge socket does not exist: ${z}. The bridge process may have died. Try reinitializing the sandbox.`);
                f.push("--bind", Y, Y), f.push("--bind", z, z);
                let u = f21(3128, 1080);
                if (f.push(...u.flatMap((I) => {
                        let g = I.indexOf("="),
                            B = I.slice(0, g),
                            b = I.slice(g + 1);
                        return ["--setenv", B, b]
                    })), _ !== void 0) f.push("--setenv", "CLAUDE_CODE_HOST_HTTP_PROXY_PORT", String(_));
                if (w !== void 0) f.push("--setenv", "CLAUDE_CODE_HOST_SOCKS_PROXY_PORT", String(w))
            }
        }
        let N = await Rb3(O, $, M, D, X, W);
        if (f.push(...N), f.push("--dev", "/dev"), f.push("--unshare-pid"), !H) f.push("--proc", "/proc");
        let V = J || "bash",
            L = JU(V);
        if (!L) throw Error(`Shell '${V}' not found in PATH`);
        if (f.push("--", L, "-c"), K && Y && z) {
            let u = Lb3(Y, z, q, v, L, P?.applyPath);
            f.push(u)
        } else if (v) {
            let u = Ex6(P?.applyPath);
            if (!u) throw Error("apply-seccomp binary not found. This should have been caught earlier. Ensure vendor/seccomp/{x64,arm64}/apply-seccomp binaries are included in the package.");
            let I = gq6.default.quote([u, v, L, "-c", q]);
            f.push(I)
        } else f.push(q);
        let h = gq6.default.quote(["bwrap", ...f]),
            R = [];
        if (K) R.push("network");
        if (Z || G) R.push("filesystem");
        if (v) R.push("seccomp(unix-block)");
        return wA(`[Sandbox Linux] Wrapped command with bwrap (${R.join(", ")} restrictions)`), h
    } catch (N) {
        if (v && !v.includes("/vendor/seccomp/")) {
            yw8.delete(v);
            try {
                kw8(v)
            } catch (V) {
                wA(`[Sandbox Linux] Failed to clean up seccomp filter on error: ${V}`, {
                    level: "error"
                })
            }
        }
        throw N
    }
}
// @from(Ln 138052, Col 4)
gq6
// @from(Ln 138052, Col 9)
Rw8 = 3
// @from(Ln 138053, Col 4)
yw8
// @from(Ln 138053, Col 9)
v21
// @from(Ln 138053, Col 14)
IZ7 = !1
// @from(Ln 138054, Col 4)
mZ7 = E(() => {
    Dx6();
    kZ7();
    $D6();
    hZ7();
    gq6 = t(J91(), 1);
    yw8 = new Set, v21 = new Set
})
// @from(Ln 138067, Col 0)
function Sb3(A = !1) {
    let q = process.cwd(),
        K = [];
    for (let Y of Vx6) K.push(WU.resolve(q, Y)), K.push(`**/${Y}`);
    for (let Y of G21()) K.push(WU.resolve(q, Y)), K.push(`**/${Y}/**`);
    if (K.push(WU.resolve(q, ".git/hooks")), K.push("**/.git/hooks/**"), !A) K.push(WU.resolve(q, ".git/config")), K.push("**/.git/config");
    return [...new Set(K)]
}
// @from(Ln 138076, Col 0)
function Cb3(A) {
    return `CMD64_${T21(A)}_END_${FZ7}`
}
// @from(Ln 138080, Col 0)
function BZ7(A) {
    let q = [],
        K = WU.dirname(A);
    while (K !== "/" && K !== ".") {
        q.push(K);
        let Y = WU.dirname(K);
        if (Y === K) break;
        K = Y
    }
    return q
}
// @from(Ln 138092, Col 0)
function pZ7(A, q) {
    let K = [];
    for (let Y of A) {
        let z = EL(Y);
        if (zk(z)) {
            let _ = OD6(z);
            K.push("(deny file-write-unlink", `  (regex ${Hv(_)})`, `  (with message "${q}"))`);
            let w = z.split(/[*?[\]]/)[0];
            if (w && w !== "/") {
                let O = w.endsWith("/") ? w.slice(0, -1) : WU.dirname(w);
                K.push("(deny file-write-unlink", `  (literal ${Hv(O)})`, `  (with message "${q}"))`);
                for (let $ of BZ7(O)) K.push("(deny file-write-unlink", `  (literal ${Hv($)})`, `  (with message "${q}"))`)
            }
        } else {
            K.push("(deny file-write-unlink", `  (subpath ${Hv(z)})`, `  (with message "${q}"))`);
            for (let _ of BZ7(z)) K.push("(deny file-write-unlink", `  (literal ${Hv(_)})`, `  (with message "${q}"))`)
        }
    }
    return K
}
// @from(Ln 138113, Col 0)
function Ib3(A, q) {
    if (!A) return ["(allow file-read*)"];
    let K = [];
    K.push("(allow file-read*)");
    for (let Y of A.denyOnly || []) {
        let z = EL(Y);
        if (zk(z)) {
            let _ = OD6(z);
            K.push("(deny file-read*", `  (regex ${Hv(_)})`, `  (with message "${q}"))`)
        } else K.push("(deny file-read*", `  (subpath ${Hv(z)})`, `  (with message "${q}"))`)
    }
    return K.push(...pZ7(A.denyOnly || [], q)), K
}
// @from(Ln 138127, Col 0)
function bb3(A, q, K = !1) {
    if (!A) return ["(allow file-write*)"];
    let Y = [],
        z = ub3();
    for (let w of z) {
        let O = EL(w);
        Y.push("(allow file-write*", `  (subpath ${Hv(O)})`, `  (with message "${q}"))`)
    }
    for (let w of A.allowOnly || []) {
        let O = EL(w);
        if (zk(O)) {
            let $ = OD6(O);
            Y.push("(allow file-write*", `  (regex ${Hv($)})`, `  (with message "${q}"))`)
        } else Y.push("(allow file-write*", `  (subpath ${Hv(O)})`, `  (with message "${q}"))`)
    }
    let _ = [...A.denyWithinAllow || [], ...Sb3(K)];
    for (let w of _) {
        let O = EL(w);
        if (zk(O)) {
            let $ = OD6(O);
            Y.push("(deny file-write*", `  (regex ${Hv($)})`, `  (with message "${q}"))`)
        } else Y.push("(deny file-write*", `  (subpath ${Hv(O)})`, `  (with message "${q}"))`)
    }
    return Y.push(...pZ7(_, q)), Y
}
// @from(Ln 138153, Col 0)
function xb3({
    readConfig: A,
    writeConfig: q,
    httpProxyPort: K,
    socksProxyPort: Y,
    needsNetworkRestriction: z,
    allowUnixSockets: _,
    allowAllUnixSockets: w,
    allowLocalBinding: O,
    allowPty: $,
    allowGitConfig: H = !1,
    enableWeakerNetworkIsolation: j = !1,
    logTag: J
}) {
    let M = ["(version 1)", `(deny default (with message "${J}"))`, "", `; LogTag: ${J}`, "", "; Essential permissions - based on Chrome sandbox policy", "; Process permissions", "(allow process-exec)", "(allow process-fork)", "(allow process-info* (target same-sandbox))", "(allow signal (target same-sandbox))", "(allow mach-priv-task-port (target same-sandbox))", "", "; User preferences", "(allow user-preference-read)", "", "; Mach IPC - specific services only (no wildcard)", "(allow mach-lookup", '  (global-name "com.apple.audio.systemsoundserver")', '  (global-name "com.apple.distributed_notifications@Uv3")', '  (global-name "com.apple.FontObjectsServer")', '  (global-name "com.apple.fonts")', '  (global-name "com.apple.logd")', '  (global-name "com.apple.lsd.mapdb")', '  (global-name "com.apple.PowerManagement.control")', '  (global-name "com.apple.system.logger")', '  (global-name "com.apple.system.notification_center")', '  (global-name "com.apple.system.opendirectoryd.libinfo")', '  (global-name "com.apple.system.opendirectoryd.membership")', '  (global-name "com.apple.bsd.dirhelper")', '  (global-name "com.apple.securityd.xpc")', '  (global-name "com.apple.coreservices.launchservicesd")', ")", "", ...j ? ["; trustd.agent - needed for Go TLS certificate verification (weaker network isolation)", '(allow mach-lookup (global-name "com.apple.trustd.agent"))'] : [], "", "; POSIX IPC - shared memory", "(allow ipc-posix-shm)", "", "; POSIX IPC - semaphores for Python multiprocessing", "(allow ipc-posix-sem)", "", "; IOKit - specific operations only", "(allow iokit-open", '  (iokit-registry-entry-class "IOSurfaceRootUserClient")', '  (iokit-registry-entry-class "RootDomainUserClient")', '  (iokit-user-client-class "IOSurfaceSendRight")', ")", "", "; IOKit properties", "(allow iokit-get-properties)", "", "; Specific safe system-sockets, doesn't allow network access", "(allow system-socket (require-all (socket-domain AF_SYSTEM) (socket-protocol 2)))", "", "; sysctl - specific sysctls only", "(allow sysctl-read", '  (sysctl-name "hw.activecpu")', '  (sysctl-name "hw.busfrequency_compat")', '  (sysctl-name "hw.byteorder")', '  (sysctl-name "hw.cacheconfig")', '  (sysctl-name "hw.cachelinesize_compat")', '  (sysctl-name "hw.cpufamily")', '  (sysctl-name "hw.cpufrequency")', '  (sysctl-name "hw.cpufrequency_compat")', '  (sysctl-name "hw.cputype")', '  (sysctl-name "hw.l1dcachesize_compat")', '  (sysctl-name "hw.l1icachesize_compat")', '  (sysctl-name "hw.l2cachesize_compat")', '  (sysctl-name "hw.l3cachesize_compat")', '  (sysctl-name "hw.logicalcpu")', '  (sysctl-name "hw.logicalcpu_max")', '  (sysctl-name "hw.machine")', '  (sysctl-name "hw.memsize")', '  (sysctl-name "hw.ncpu")', '  (sysctl-name "hw.nperflevels")', '  (sysctl-name "hw.packages")', '  (sysctl-name "hw.pagesize_compat")', '  (sysctl-name "hw.pagesize")', '  (sysctl-name "hw.physicalcpu")', '  (sysctl-name "hw.physicalcpu_max")', '  (sysctl-name "hw.tbfrequency_compat")', '  (sysctl-name "hw.vectorunit")', '  (sysctl-name "kern.argmax")', '  (sysctl-name "kern.bootargs")', '  (sysctl-name "kern.hostname")', '  (sysctl-name "kern.maxfiles")', '  (sysctl-name "kern.maxfilesperproc")', '  (sysctl-name "kern.maxproc")', '  (sysctl-name "kern.ngroups")', '  (sysctl-name "kern.osproductversion")', '  (sysctl-name "kern.osrelease")', '  (sysctl-name "kern.ostype")', '  (sysctl-name "kern.osvariant_status")', '  (sysctl-name "kern.osversion")', '  (sysctl-name "kern.secure_kernel")', '  (sysctl-name "kern.tcsm_available")', '  (sysctl-name "kern.tcsm_enable")', '  (sysctl-name "kern.usrstack64")', '  (sysctl-name "kern.version")', '  (sysctl-name "kern.willshutdown")', '  (sysctl-name "machdep.cpu.brand_string")', '  (sysctl-name "machdep.ptrauth_enabled")', '  (sysctl-name "security.mac.lockdown_mode_state")', '  (sysctl-name "sysctl.proc_cputype")', '  (sysctl-name "vm.loadavg")', '  (sysctl-name-prefix "hw.optional.arm")', '  (sysctl-name-prefix "hw.optional.arm.")', '  (sysctl-name-prefix "hw.optional.armv8_")', '  (sysctl-name-prefix "hw.perflevel")', '  (sysctl-name-prefix "kern.proc.all")', '  (sysctl-name-prefix "kern.proc.pgrp.")', '  (sysctl-name-prefix "kern.proc.pid.")', '  (sysctl-name-prefix "machdep.cpu.")', '  (sysctl-name-prefix "net.routetable.")', ")", "", "; V8 thread calculations", "(allow sysctl-write", '  (sysctl-name "kern.tcsm_enable")', ")", "", "; Distributed notifications", "(allow distributed-notification-post)", "", "; Specific mach-lookup permissions for security operations", '(allow mach-lookup (global-name "com.apple.SecurityServer"))', "", "; File I/O on device files", '(allow file-ioctl (literal "/dev/null"))', '(allow file-ioctl (literal "/dev/zero"))', '(allow file-ioctl (literal "/dev/random"))', '(allow file-ioctl (literal "/dev/urandom"))', '(allow file-ioctl (literal "/dev/dtracehelper"))', '(allow file-ioctl (literal "/dev/tty"))', "", "(allow file-ioctl file-read-data file-write-data", "  (require-all", '    (literal "/dev/null")', "    (vnode-type CHARACTER-DEVICE)", "  )", ")", ""];
    if (M.push("; Network"), !z) M.push("(allow network*)");
    else {
        if (O) M.push('(allow network-bind (local ip "*:*"))'), M.push('(allow network-inbound (local ip "*:*"))'), M.push('(allow network-outbound (local ip "*:*"))');
        if (w) M.push("(allow system-socket (socket-domain AF_UNIX))"), M.push('(allow network-bind (local unix-socket (path-regex #"^/")))'), M.push('(allow network-outbound (remote unix-socket (path-regex #"^/")))');
        else if (_ && _.length > 0) {
            M.push("(allow system-socket (socket-domain AF_UNIX))");
            for (let D of _) {
                let X = EL(D);
                M.push(`(allow network-bind (local unix-socket (subpath ${Hv(X)})))`), M.push(`(allow network-outbound (remote unix-socket (subpath ${Hv(X)})))`)
            }
        }
        if (K !== void 0) M.push(`(allow network-bind (local ip "localhost:${K}"))`), M.push(`(allow network-inbound (local ip "localhost:${K}"))`), M.push(`(allow network-outbound (remote ip "localhost:${K}"))`);
        if (Y !== void 0) M.push(`(allow network-bind (local ip "localhost:${Y}"))`), M.push(`(allow network-inbound (local ip "localhost:${Y}"))`), M.push(`(allow network-outbound (remote ip "localhost:${Y}"))`)
    }
    if (M.push(""), M.push("; File read"), M.push(...Ib3(A, J)), M.push(""), M.push("; File write"), M.push(...bb3(q, J, H)), $) M.push(""), M.push("; Pseudo-terminal (pty) support"), M.push("(allow pseudo-tty)"), M.push("(allow file-ioctl"), M.push('  (literal "/dev/ptmx")'), M.push('  (regex #"^/dev/ttys")'), M.push(")"), M.push("(allow file-read* file-write*"), M.push('  (literal "/dev/ptmx")'), M.push('  (regex #"^/dev/ttys")'), M.push(")");
    return M.join(`
`)
}
// @from(Ln 138187, Col 0)
function Hv(A) {
    return JSON.stringify(A)
}
// @from(Ln 138191, Col 0)
function ub3() {
    let A = process.env.TMPDIR;
    if (!A) return [];
    if (!A.match(/^\/(private\/)?var\/folders\/[^/]{2}\/[^/]+\/T\/?$/)) return [];
    let K = A.replace(/\/T\/?$/, "");
    if (K.startsWith("/private/var/")) return [K, K.replace("/private", "")];
    else if (K.startsWith("/var/")) return [K, "/private" + K];
    return [K]
}
// @from(Ln 138201, Col 0)
function QZ7(A) {
    let {
        command: q,
        needsNetworkRestriction: K,
        httpProxyPort: Y,
        socksProxyPort: z,
        allowUnixSockets: _,
        allowAllUnixSockets: w,
        allowLocalBinding: O,
        readConfig: $,
        writeConfig: H,
        allowPty: j,
        allowGitConfig: J = !1,
        enableWeakerNetworkIsolation: M = !1,
        binShell: D
    } = A, X = $ && $.denyOnly.length > 0;
    if (!K && !X && H === void 0) return q;
    let W = Cb3(q),
        Z = xb3({
            readConfig: $,
            writeConfig: H,
            httpProxyPort: Y,
            socksProxyPort: z,
            needsNetworkRestriction: K,
            allowUnixSockets: _,
            allowAllUnixSockets: w,
            allowLocalBinding: O,
            allowPty: j,
            allowGitConfig: J,
            enableWeakerNetworkIsolation: M,
            logTag: W
        }),
        G = f21(Y, z),
        f = D || "bash",
        v = JU(f);
    if (!v) throw Error(`Shell '${f}' not found in PATH`);
    let N = gZ7.default.quote(["env", ...G, "sandbox-exec", "-p", Z, v, "-c", q]);
    return wA(`[Sandbox macOS] Applied restrictions - network: ${!!(Y||z)}, read: ${$?"allowAllExcept"in $?"allowAllExcept":"denyAllExcept":"none"}, write: ${H?"allowAllExcept"in H?"allowAllExcept":"denyAllExcept":"none"}`), N
}
// @from(Ln 138241, Col 0)
function UZ7(A, q) {
    let K = /CMD64_(.+?)_END/,
        Y = /Sandbox:\s+(.+)$/,
        z = q?.["*"] || [],
        _ = q ? Object.entries(q).filter(([O]) => O !== "*") : [],
        w = hb3("log", ["stream", "--predicate", `(eventMessage ENDSWITH "${FZ7}")`, "--style", "compact"]);
    return w.stdout?.on("data", (O) => {
        let $ = O.toString().split(`
`),
            H = $.find((P) => P.includes("Sandbox:") && P.includes("deny")),
            j = $.find((P) => P.startsWith("CMD64_"));
        if (!H) return;
        let J = H.match(Y);
        if (!J?.[1]) return;
        let M = J[1],
            D, X;
        if (j) {
            if (X = j.match(K)?.[1], X) try {
                D = EZ7(X)
            } catch {}
        }
        if (M.includes("mDNSResponder") || M.includes("mach-lookup com.apple.diagnosticd") || M.includes("mach-lookup com.apple.analyticsd")) return;
        if (q && D) {
            if (z.length > 0) {
                if (z.some((W) => M.includes(W))) return
            }
            for (let [P, W] of _)
                if (D.includes(P)) {
                    if (W.some((G) => M.includes(G))) return
                }
        }
        A({
            line: M,
            command: D,
            encodedCommand: X,
            timestamp: new Date
        })
    }), w.stderr?.on("data", (O) => {
        wA(`[Sandbox Monitor] Log stream stderr: ${O.toString()}`)
    }), w.on("error", (O) => {
        wA(`[Sandbox Monitor] Failed to start log stream: ${O.message}`)
    }), w.on("exit", (O) => {
        wA(`[Sandbox Monitor] Log stream exited with code: ${O}`)
    }), () => {
        wA("[Sandbox Monitor] Stopping log monitor"), w.kill("SIGTERM")
    }
}
// @from(Ln 138288, Col 4)
gZ7
// @from(Ln 138288, Col 9)
FZ7
// @from(Ln 138289, Col 4)
dZ7 = E(() => {
    Dx6();
    $D6();
    gZ7 = t(J91(), 1);
    FZ7 = `_${Math.random().toString(36).slice(2,11)}_SBX`
})
// @from(Ln 138295, Col 0)
class HD6 {
    constructor() {
        this.violations = [], this.totalCount = 0, this.maxSize = 100, this.listeners = new Set
    }
    addViolation(A) {
        if (this.violations.push(A), this.totalCount++, this.violations.length > this.maxSize) this.violations = this.violations.slice(-this.maxSize);
        this.notifyListeners()
    }
    getViolations(A) {
        if (A === void 0) return [...this.violations];
        return this.violations.slice(-A)
    }
    getCount() {
        return this.violations.length
    }
    getTotalCount() {
        return this.totalCount
    }
    getViolationsForCommand(A) {
        let q = T21(A);
        return this.violations.filter((K) => K.encodedCommand === q)
    }
    clear() {
        this.violations = [], this.notifyListeners()
    }
    subscribe(A) {
        return this.listeners.add(A), A(this.getViolations()), () => {
            this.listeners.delete(A)
        }
    }
    notifyListeners() {
        let A = this.getViolations();
        this.listeners.forEach((q) => q(A))
    }
}
// @from(Ln 138330, Col 4)
Sw8 = E(() => {
    $D6()
})
// @from(Ln 138338, Col 0)
function mb3() {
    if (cZ7) return;
    let A = () => xw8().catch((q) => {
        wA(`Cleanup failed in registerCleanup ${q}`, {
            level: "error"
        })
    });
    process.once("exit", A), process.once("SIGINT", A), process.once("SIGTERM", A), cZ7 = !0
}
// @from(Ln 138348, Col 0)
function bw8(A, q) {
    if (q.startsWith("*.")) {
        let K = q.substring(2);
        return A.toLowerCase().endsWith("." + K.toLowerCase())
    }
    return A.toLowerCase() === q.toLowerCase()
}
// @from(Ln 138355, Col 0)
async function nZ7(A, q, K) {
    if (!R5) return wA("No config available, denying network request"), !1;
    for (let Y of R5.network.deniedDomains)
        if (bw8(q, Y)) return wA(`Denied by config rule: ${q}:${A}`), !1;
    for (let Y of R5.network.allowedDomains)
        if (bw8(q, Y)) return wA(`Allowed by config rule: ${q}:${A}`), !0;
    if (!K) return wA(`No matching config rule, denying: ${q}:${A}`), !1;
    wA(`No matching config rule, asking user: ${q}:${A}`);
    try {
        if (await K({
                host: q,
                port: A
            })) return wA(`User allowed: ${q}:${A}`), !0;
        else return wA(`User denied: ${q}:${A}`), !1
    } catch (Y) {
        return wA(`Error in permission callback: ${Y}`, {
            level: "error"
        }), !1
    }
}
// @from(Ln 138376, Col 0)
function Bb3(A) {
    if (!R5?.network.mitmProxy) return;
    let {
        socketPath: q,
        domains: K
    } = R5.network.mitmProxy;
    for (let Y of K)
        if (bw8(A, Y)) return wA(`Host ${A} matches MITM pattern ${Y}`), q;
    return
}
// @from(Ln 138386, Col 0)
async function gb3(A) {
    return jD6 = MP7({
        filter: (q, K) => nZ7(q, K, A),
        getMitmSocketPath: Bb3
    }), new Promise((q, K) => {
        if (!jD6) {
            K(Error("HTTP proxy server undefined before listen"));
            return
        }
        let Y = jD6;
        Y.once("error", K), Y.once("listening", () => {
            let z = Y.address();
            if (z && typeof z === "object") Y.unref(), wA(`HTTP proxy listening on localhost:${z.port}`), q(z.port);
            else K(Error("Failed to get proxy server address"))
        }), Y.listen(0, "127.0.0.1")
    })
}
// @from(Ln 138403, Col 0)
async function Fb3(A) {
    return Fq6 = NP7({
        filter: (q, K) => nZ7(q, K, A)
    }), new Promise((q, K) => {
        if (!Fq6) {
            K(Error("SOCKS proxy server undefined before listen"));
            return
        }
        Fq6.listen(0, "127.0.0.1").then((Y) => {
            Fq6?.unref(), q(Y)
        }).catch(K)
    })
}
// @from(Ln 138416, Col 0)
async function pb3(A, q, K = !1) {
    if (Ua) {
        await Ua;
        return
    }
    R5 = A;
    let Y = oZ7();
    if (Y.errors.length > 0) throw Error(`Sandbox dependencies not available: ${Y.errors.join(", ")}`);
    if (K && $v() === "macos") N21 = UZ7(V21.addViolation.bind(V21), R5.ignoreViolations), wA("Started macOS sandbox log monitor");
    mb3(), Ua = (async () => {
        try {
            let z;
            if (R5.network.httpProxyPort !== void 0) z = R5.network.httpProxyPort, wA(`Using external HTTP proxy on port ${z}`);
            else z = await gb3(q);
            let _;
            if (R5.network.socksProxyPort !== void 0) _ = R5.network.socksProxyPort, wA(`Using external SOCKS proxy on port ${_}`);
            else _ = await Fb3(q);
            let w;
            if ($v() === "linux") w = await xZ7(z, _);
            let O = {
                httpProxyPort: z,
                socksProxyPort: _,
                linuxBridge: w
            };
            return LL = O, wA("Network infrastructure initialized"), O
        } catch (z) {
            throw Ua = void 0, LL = void 0, xw8().catch((_) => {
                wA(`Cleanup failed in initializationPromise ${_}`, {
                    level: "error"
                })
            }), z
        }
    })(), await Ua
}
// @from(Ln 138451, Col 0)
function rZ7() {
    let A = $v();
    if (A === "linux") return Pw8() !== "1";
    return A === "macos"
}
// @from(Ln 138457, Col 0)
function Qb3() {
    return R5 !== void 0
}
// @from(Ln 138461, Col 0)
function oZ7(A) {
    if (!rZ7()) return {
        errors: ["Unsupported platform"],
        warnings: []
    };
    let q = [],
        K = [],
        Y = A ?? R5?.ripgrep ?? {
            command: "rg"
        };
    if (JU(Y.command) === null) q.push(`ripgrep (${Y.command}) not found`);
    if ($v() === "linux") {
        let _ = bZ7(R5?.seccomp);
        q.push(..._.errors), K.push(..._.warnings)
    }
    return {
        errors: q,
        warnings: K
    }
}
// @from(Ln 138482, Col 0)
function Ub3() {
    if (!R5) return {
        denyOnly: []
    };
    let A = [];
    for (let q of R5.filesystem.denyRead) {
        let K = mq6(q);
        if ($v() === "linux" && zk(K)) {
            let Y = Gw8(q);
            wA(`[Sandbox] Expanded glob pattern "${q}" to ${Y.length} paths on Linux`), A.push(...Y)
        } else A.push(K)
    }
    return {
        denyOnly: A
    }
}
// @from(Ln 138499, Col 0)
function db3() {
    if (!R5) return {
        allowOnly: kx6(),
        denyWithinAllow: []
    };
    let A = R5.filesystem.allowWrite.map((Y) => mq6(Y)).filter((Y) => {
            if ($v() === "linux" && zk(Y)) return wA(`Skipping glob pattern on Linux/WSL: ${Y}`), !1;
            return !0
        }),
        q = R5.filesystem.denyWrite.map((Y) => mq6(Y)).filter((Y) => {
            if ($v() === "linux" && zk(Y)) return wA(`Skipping glob pattern on Linux/WSL: ${Y}`), !1;
            return !0
        });
    return {
        allowOnly: [...kx6(), ...A],
        denyWithinAllow: q
    }
}
// @from(Ln 138518, Col 0)
function cb3() {
    if (!R5) return {};
    let A = R5.network.allowedDomains,
        q = R5.network.deniedDomains;
    return {
        ...A.length > 0 && {
            allowedHosts: A
        },
        ...q.length > 0 && {
            deniedHosts: q
        }
    }
}
// @from(Ln 138532, Col 0)
function aZ7() {
    return R5?.network?.allowUnixSockets
}
// @from(Ln 138536, Col 0)
function lZ7() {
    return R5?.network?.allowAllUnixSockets
}
// @from(Ln 138540, Col 0)
function sZ7() {
    return R5?.network?.allowLocalBinding
}
// @from(Ln 138544, Col 0)
function tZ7() {
    return R5?.ignoreViolations
}
// @from(Ln 138548, Col 0)
function eZ7() {
    return R5?.enableWeakerNestedSandbox
}
// @from(Ln 138552, Col 0)
function lb3() {
    return R5?.enableWeakerNetworkIsolation
}
// @from(Ln 138556, Col 0)
function ib3() {
    return R5?.ripgrep ?? {
        command: "rg"
    }
}
// @from(Ln 138562, Col 0)
function nb3() {
    return R5?.mandatoryDenySearchDepth ?? 3
}
// @from(Ln 138566, Col 0)
function iZ7() {
    return R5?.filesystem?.allowGitConfig ?? !1
}
// @from(Ln 138570, Col 0)
function rb3() {
    return R5?.seccomp
}
// @from(Ln 138574, Col 0)
function AG7() {
    return LL?.httpProxyPort
}
// @from(Ln 138578, Col 0)
function qG7() {
    return LL?.socksProxyPort
}
// @from(Ln 138582, Col 0)
function KG7() {
    return LL?.linuxBridge?.httpSocketPath
}
// @from(Ln 138586, Col 0)
function YG7() {
    return LL?.linuxBridge?.socksSocketPath
}
// @from(Ln 138589, Col 0)
async function zG7() {
    if (!R5) return !1;
    if (Ua) try {
        return await Ua, !0
    } catch {
        return !1
    }
    return LL !== void 0
}
// @from(Ln 138598, Col 0)
async function ob3(A, q, K, Y) {
    let z = $v(),
        _ = (P) => P.map((W) => mq6(W)).filter((W) => {
            if ($v() === "linux" && zk(W)) return wA(`[Sandbox] Skipping glob write pattern on Linux: ${W}`), !1;
            return !0
        }),
        w = _(K?.filesystem?.allowWrite ?? R5?.filesystem.allowWrite ?? []),
        O = {
            allowOnly: [...kx6(), ...w],
            denyWithinAllow: _(K?.filesystem?.denyWrite ?? R5?.filesystem.denyWrite ?? [])
        },
        $ = K?.filesystem?.denyRead ?? R5?.filesystem.denyRead ?? [],
        H = [];
    for (let P of $) {
        let W = mq6(P);
        if ($v() === "linux" && zk(W)) H.push(...Gw8(P));
        else H.push(W)
    }
    let j = {
            denyOnly: H
        },
        J = K?.network?.allowedDomains !== void 0 || R5?.network?.allowedDomains !== void 0,
        M = J,
        D = J;
    if (D) await zG7();
    let X = K?.allowPty ?? R5?.allowPty;
    switch (z) {
        case "macos":
            return QZ7({
                command: A,
                needsNetworkRestriction: M,
                httpProxyPort: D ? AG7() : void 0,
                socksProxyPort: D ? qG7() : void 0,
                readConfig: j,
                writeConfig: O,
                allowUnixSockets: aZ7(),
                allowAllUnixSockets: lZ7(),
                allowLocalBinding: sZ7(),
                ignoreViolations: tZ7(),
                allowPty: X,
                allowGitConfig: iZ7(),
                enableWeakerNetworkIsolation: lb3(),
                binShell: q
            });
        case "linux":
            return uZ7({
                command: A,
                needsNetworkRestriction: M,
                httpSocketPath: D ? KG7() : void 0,
                socksSocketPath: D ? YG7() : void 0,
                httpProxyPort: D ? LL?.httpProxyPort : void 0,
                socksProxyPort: D ? LL?.socksProxyPort : void 0,
                readConfig: j,
                writeConfig: O,
                enableWeakerNestedSandbox: eZ7(),
                allowAllUnixSockets: lZ7(),
                binShell: q,
                ripgrepConfig: ib3(),
                mandatoryDenySearchDepth: nb3(),
                allowGitConfig: iZ7(),
                seccompConfig: rb3(),
                abortSignal: Y
            });
        default:
            throw Error(`Sandbox configuration is not supported on platform: ${z}`)
    }
}
// @from(Ln 138666, Col 0)
function ab3() {
    return R5
}
// @from(Ln 138670, Col 0)
function sb3(A) {
    R5 = Xw8(A), wA("Sandbox configuration updated")
}
// @from(Ln 138674, Col 0)
function _G7() {
    hw8()
}
// @from(Ln 138677, Col 0)
async function xw8() {
    if (_G7(), N21) N21(), N21 = void 0;
    if (LL?.linuxBridge) {
        let {
            httpSocketPath: q,
            socksSocketPath: K,
            httpBridgeProcess: Y,
            socksBridgeProcess: z
        } = LL.linuxBridge, _ = [];
        if (Y.pid && !Y.killed) try {
            process.kill(Y.pid, "SIGTERM"), wA("Sent SIGTERM to HTTP bridge process"), _.push(new Promise((w) => {
                Y.once("exit", () => {
                    wA("HTTP bridge process exited"), w()
                }), setTimeout(() => {
                    if (!Y.killed) {
                        wA("HTTP bridge did not exit, forcing SIGKILL", {
                            level: "warn"
                        });
                        try {
                            if (Y.pid) process.kill(Y.pid, "SIGKILL")
                        } catch {}
                    }
                    w()
                }, 5000)
            }))
        } catch (w) {
            if (w.code !== "ESRCH") wA(`Error killing HTTP bridge: ${w}`, {
                level: "error"
            })
        }
        if (z.pid && !z.killed) try {
            process.kill(z.pid, "SIGTERM"), wA("Sent SIGTERM to SOCKS bridge process"), _.push(new Promise((w) => {
                z.once("exit", () => {
                    wA("SOCKS bridge process exited"), w()
                }), setTimeout(() => {
                    if (!z.killed) {
                        wA("SOCKS bridge did not exit, forcing SIGKILL", {
                            level: "warn"
                        });
                        try {
                            if (z.pid) process.kill(z.pid, "SIGKILL")
                        } catch {}
                    }
                    w()
                }, 5000)
            }))
        } catch (w) {
            if (w.code !== "ESRCH") wA(`Error killing SOCKS bridge: ${w}`, {
                level: "error"
            })
        }
        if (await Promise.all(_), q) try {
            Iw8.rmSync(q, {
                force: !0
            }), wA("Cleaned up HTTP socket")
        } catch (w) {
            wA(`HTTP socket cleanup error: ${w}`, {
                level: "error"
            })
        }
        if (K) try {
            Iw8.rmSync(K, {
                force: !0
            }), wA("Cleaned up SOCKS socket")
        } catch (w) {
            wA(`SOCKS socket cleanup error: ${w}`, {
                level: "error"
            })
        }
    }
    let A = [];
    if (jD6) {
        let q = jD6,
            K = new Promise((Y) => {
                q.close((z) => {
                    if (z && z.message !== "Server is not running.") wA(`Error closing HTTP proxy server: ${z.message}`, {
                        level: "error"
                    });
                    Y()
                })
            });
        A.push(K)
    }
    if (Fq6) {
        let q = Fq6.close().catch((K) => {
            wA(`Error closing SOCKS proxy server: ${K.message}`, {
                level: "error"
            })
        });
        A.push(q)
    }
    await Promise.all(A), jD6 = void 0, Fq6 = void 0, LL = void 0, Ua = void 0
}
// @from(Ln 138771, Col 0)
function tb3() {
    return V21
}
// @from(Ln 138775, Col 0)
function eb3(A, q) {
    if (!R5) return q;
    let K = V21.getViolationsForCommand(A);
    if (K.length === 0) return q;
    let Y = q;
    Y += Cw8 + "<sandbox_violations>" + Cw8;
    for (let z of K) Y += z.line + Cw8;
    return Y += "</sandbox_violations>", Y
}
// @from(Ln 138785, Col 0)
function Ax3() {
    if ($v() !== "linux" || !R5) return [];
    let A = [],
        q = [...R5.filesystem.allowWrite, ...R5.filesystem.denyWrite];
    for (let K of q) {
        let Y = mq6(K);
        if (zk(Y)) A.push(K)
    }
    return A
}
// @from(Ln 138795, Col 4)
R5
// @from(Ln 138795, Col 8)
jD6
// @from(Ln 138795, Col 13)
Fq6
// @from(Ln 138795, Col 18)
LL
// @from(Ln 138795, Col 22)
Ua
// @from(Ln 138795, Col 26)
cZ7 = !1
// @from(Ln 138796, Col 4)
N21
// @from(Ln 138796, Col 9)
V21
// @from(Ln 138796, Col 14)
aO
// @from(Ln 138797, Col 4)
wG7 = E(() => {
    DP7();
    VP7();
    Dx6();
    TZ7();
    W21();
    mZ7();
    dZ7();
    $D6();
    Sw8();
    V21 = new HD6;
    aO = {
        initialize: pb3,
        isSupportedPlatform: rZ7,
        isSandboxingEnabled: Qb3,
        checkDependencies: oZ7,
        getFsReadConfig: Ub3,
        getFsWriteConfig: db3,
        getNetworkRestrictionConfig: cb3,
        getAllowUnixSockets: aZ7,
        getAllowLocalBinding: sZ7,
        getIgnoreViolations: tZ7,
        getEnableWeakerNestedSandbox: eZ7,
        getProxyPort: AG7,
        getSocksProxyPort: qG7,
        getLinuxHttpSocketPath: KG7,
        getLinuxSocksSocketPath: YG7,
        waitForNetworkInitialization: zG7,
        wrapWithSandbox: ob3,
        cleanupAfterCommand: _G7,
        reset: xw8,
        getSandboxViolationStore: tb3,
        annotateStderrWithSandboxFailures: eb3,
        getLinuxGlobPatternWarnings: Ax3,
        getConfig: ab3,
        updateConfig: sb3
    }
})
// @from(Ln 138835, Col 4)
mw8
// @from(Ln 138835, Col 9)
uw8
// @from(Ln 138835, Col 14)
qx3
// @from(Ln 138835, Col 19)
OG7
// @from(Ln 138835, Col 24)
$G7
// @from(Ln 138835, Col 29)
HG7
// @from(Ln 138835, Col 34)
jG7
// @from(Ln 138835, Col 39)
Kx3
// @from(Ln 138835, Col 44)
Bw8