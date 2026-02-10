
// @from(Ln 3897, Col 0)
function P5(A) {
    let q = A.replace(/[^a-zA-Z0-9_-]/g, "_");
    if (A.startsWith("claude.ai ")) q = q.replace(/_+/g, "_").replace(/^_|_$/g, "");
    return q
}
// @from(Ln 3903, Col 0)
function VD(A) {
    let q = A.split("__"),
        [K, Y, ...z] = q;
    if (K !== "mcp" || !Y) return null;
    let w = z.length > 0 ? z.join("__") : void 0;
    return {
        serverName: Y,
        toolName: w
    }
}
// @from(Ln 3914, Col 0)
function Ql(A) {
    return `mcp__${P5(A)}__`
}
// @from(Ln 3918, Col 0)
function Fn1(A, q) {
    let K = `mcp__${P5(q)}__`;
    return A.replace(K, "")
}
// @from(Ln 3923, Col 0)
function Qn1(A) {
    let q = A.replace(/\s*\(MCP\)\s*$/, "");
    q = q.trim();
    let K = q.indexOf(" - ");
    if (K !== -1) return q.substring(K + 3).trim();
    return q
}
// @from(Ln 3930, Col 4)
_T = () => {}
// @from(Ln 3932, Col 0)
function SBq(A, q, K) {
    switch (K.length) {
        case 0:
            return A.call(q);
        case 1:
            return A.call(q, K[0]);
        case 2:
            return A.call(q, K[0], K[1]);
        case 3:
            return A.call(q, K[0], K[1], K[2])
    }
    return A.apply(q, K)
}
// @from(Ln 3945, Col 4)
DiA
// @from(Ln 3946, Col 4)
jiA = v(() => {
    DiA = SBq
})
// @from(Ln 3950, Col 0)
function hBq() {}
// @from(Ln 3951, Col 4)
OQ
// @from(Ln 3952, Col 4)
SR6 = v(() => {
    OQ = hBq
})
// @from(Ln 3956, Col 0)
function uBq(A) {
    var q = 0,
        K = 0;
    return function() {
        var Y = bBq(),
            z = xBq - (Y - K);
        if (K = Y, z > 0) {
            if (++q >= IBq) return arguments[0]
        } else q = 0;
        return A.apply(void 0, arguments)
    }
}
// @from(Ln 3968, Col 4)
IBq = 800
// @from(Ln 3969, Col 4)
xBq = 16
// @from(Ln 3970, Col 4)
bBq
// @from(Ln 3970, Col 9)
MiA
// @from(Ln 3971, Col 4)
PiA = v(() => {
    bBq = Date.now;
    MiA = uBq
})
// @from(Ln 3976, Col 0)
function BBq(A) {
    return function() {
        return A
    }
}
// @from(Ln 3981, Col 4)
WiA
// @from(Ln 3982, Col 4)
GiA = v(() => {
    WiA = BBq
})
// @from(Ln 3985, Col 4)
mBq
// @from(Ln 3985, Col 9)
ZiA
// @from(Ln 3986, Col 4)
fiA = v(() => {
    GiA();
    DR6();
    Yn1();
    mBq = !ez1 ? cz1 : function(A, q) {
        return ez1(A, "toString", {
            configurable: !0,
            enumerable: !1,
            value: WiA(q),
            writable: !0
        })
    }, ZiA = mBq
})
// @from(Ln 3999, Col 4)
FBq
// @from(Ln 3999, Col 9)
gn1
// @from(Ln 4000, Col 4)
hR6 = v(() => {
    fiA();
    PiA();
    FBq = MiA(ZiA), gn1 = FBq
})
// @from(Ln 4006, Col 0)
function QBq(A, q, K, Y) {
    var z = A.length,
        w = K + (Y ? 1 : -1);
    while (Y ? w-- : ++w < z)
        if (q(A[w], w, A)) return w;
    return -1
}
// @from(Ln 4013, Col 4)
ViA
// @from(Ln 4014, Col 4)
NiA = v(() => {
    ViA = QBq
})
// @from(Ln 4018, Col 0)
function gBq(A) {
    return A !== A
}
// @from(Ln 4021, Col 4)
TiA
// @from(Ln 4022, Col 4)
viA = v(() => {
    TiA = gBq
})
// @from(Ln 4026, Col 0)
function UBq(A, q, K) {
    var Y = K - 1,
        z = A.length;
    while (++Y < z)
        if (A[Y] === q) return Y;
    return -1
}
// @from(Ln 4033, Col 4)
EiA
// @from(Ln 4034, Col 4)
kiA = v(() => {
    EiA = UBq
})
// @from(Ln 4038, Col 0)
function pBq(A, q, K) {
    return q === q ? EiA(A, q, K) : ViA(A, TiA, K)
}
// @from(Ln 4041, Col 4)
LiA
// @from(Ln 4042, Col 4)
RiA = v(() => {
    NiA();
    viA();
    kiA();
    LiA = pBq
})
// @from(Ln 4049, Col 0)
function dBq(A, q) {
    var K = A == null ? 0 : A.length;
    return !!K && LiA(A, q, 0) > -1
}
// @from(Ln 4053, Col 4)
yiA
// @from(Ln 4054, Col 4)
CiA = v(() => {
    RiA();
    yiA = dBq
})
// @from(Ln 4059, Col 0)
function cBq(A, q, K) {
    return q = SiA(q === void 0 ? A.length - 1 : q, 0),
        function() {
            var Y = arguments,
                z = -1,
                w = SiA(Y.length - q, 0),
                H = Array(w);
            while (++z < w) H[z] = Y[q + z];
            z = -1;
            var $ = Array(q + 1);
            while (++z < q) $[z] = Y[z];
            return $[q] = K(H), DiA(A, this, $)
        }
}
// @from(Ln 4073, Col 4)
SiA
// @from(Ln 4073, Col 9)
Un1
// @from(Ln 4074, Col 4)
IR6 = v(() => {
    jiA();
    SiA = Math.max;
    Un1 = cBq
})
// @from(Ln 4080, Col 0)
function lBq(A, q) {
    return gn1(Un1(A, q, cz1), A + "")
}
// @from(Ln 4083, Col 4)
hiA
// @from(Ln 4084, Col 4)
IiA = v(() => {
    Yn1();
    IR6();
    hR6();
    hiA = lBq
})
// @from(Ln 4091, Col 0)
function iBq(A, q, K) {
    if (!WO(K)) return !1;
    var Y = typeof q;
    if (Y == "number" ? Nx(K) && Cl(q, K.length) : Y == "string" && (q in K)) return Wx(K[q], A);
    return !1
}
// @from(Ln 4097, Col 4)
xiA
// @from(Ln 4098, Col 4)
biA = v(() => {
    Ez1();
    Bz1();
    iV1();
    tE();
    xiA = iBq
})
// @from(Ln 4106, Col 0)
function nBq(A) {
    return hiA(function(q, K) {
        var Y = -1,
            z = K.length,
            w = z > 1 ? K[z - 1] : void 0,
            H = z > 2 ? K[2] : void 0;
        if (w = A.length > 3 && typeof w == "function" ? (z--, w) : void 0, H && xiA(K[0], K[1], H)) w = z < 3 ? void 0 : w, z = 1;
        q = Object(q);
        while (++Y < z) {
            var $ = K[Y];
            if ($) A(q, $, Y, w)
        }
        return q
    })
}
// @from(Ln 4121, Col 4)
uiA
// @from(Ln 4122, Col 4)
BiA = v(() => {
    IiA();
    biA();
    uiA = nBq
})
// @from(Ln 4128, Col 0)
function rBq(A) {
    return gz(A) || YQ(A) || !!(miA && A && A[miA])
}
// @from(Ln 4131, Col 4)
miA
// @from(Ln 4131, Col 9)
FiA
// @from(Ln 4132, Col 4)
QiA = v(() => {
    n11();
    cV1();
    RG();
    miA = P0 ? P0.isConcatSpreadable : void 0;
    FiA = rBq
})
// @from(Ln 4140, Col 0)
function giA(A, q, K, Y, z) {
    var w = -1,
        H = A.length;
    K || (K = FiA), z || (z = []);
    while (++w < H) {
        var $ = A[w];
        if (q > 0 && K($))
            if (q > 1) giA($, q - 1, K, Y, z);
            else Sz1(z, $);
        else if (!Y) z[z.length] = $
    }
    return z
}
// @from(Ln 4153, Col 4)
UiA
// @from(Ln 4154, Col 4)
piA = v(() => {
    Ci1();
    QiA();
    UiA = giA
})
// @from(Ln 4160, Col 0)
function oBq(A) {
    var q = A == null ? 0 : A.length;
    return q ? UiA(A, 1) : []
}
// @from(Ln 4164, Col 4)
diA
// @from(Ln 4165, Col 4)
ciA = v(() => {
    piA();
    diA = oBq
})
// @from(Ln 4170, Col 0)
function aBq(A) {
    return gn1(Un1(A, void 0, diA), A + "")
}
// @from(Ln 4173, Col 4)
liA
// @from(Ln 4174, Col 4)
iiA = v(() => {
    ciA();
    IR6();
    hR6();
    liA = aBq
})
// @from(Ln 4181, Col 0)
function Kmq(A) {
    if (!fD(A) || zT(A) != sBq) return !1;
    var q = q21(A);
    if (q === null) return !0;
    var K = Amq.call(q, "constructor") && q.constructor;
    return typeof K == "function" && K instanceof K && niA.call(K) == qmq
}
// @from(Ln 4188, Col 4)
sBq = "[object Object]"
// @from(Ln 4189, Col 4)
tBq
// @from(Ln 4189, Col 9)
eBq
// @from(Ln 4189, Col 14)
niA
// @from(Ln 4189, Col 19)
Amq
// @from(Ln 4189, Col 24)
qmq
// @from(Ln 4189, Col 29)
z21
// @from(Ln 4190, Col 4)
pn1 = v(() => {
    r11();
    Ln1();
    Zx();
    tBq = Function.prototype, eBq = Object.prototype, niA = tBq.toString, Amq = eBq.hasOwnProperty, qmq = niA.call(Object);
    z21 = Kmq
})
// @from(Ln 4198, Col 0)
function Ymq(A, q, K) {
    var Y = -1,
        z = A.length;
    if (q < 0) q = -q > z ? 0 : z + q;
    if (K = K > z ? z : K, K < 0) K += z;
    z = q > K ? 0 : K - q >>> 0, q >>>= 0;
    var w = Array(z);
    while (++Y < z) w[Y] = A[Y + q];
    return w
}
// @from(Ln 4208, Col 4)
dn1
// @from(Ln 4209, Col 4)
xR6 = v(() => {
    dn1 = Ymq
})
// @from(Ln 4213, Col 0)
function zmq(A, q, K) {
    var Y = A.length;
    return K = K === void 0 ? Y : K, !q && K >= Y ? A : dn1(A, q, K)
}
// @from(Ln 4217, Col 4)
riA
// @from(Ln 4218, Col 4)
oiA = v(() => {
    xR6();
    riA = zmq
})
// @from(Ln 4223, Col 0)
function jmq(A) {
    return Dmq.test(A)
}
// @from(Ln 4226, Col 4)
wmq = "\\ud800-\\udfff"
// @from(Ln 4227, Col 4)
Hmq = "\\u0300-\\u036f"
// @from(Ln 4228, Col 4)
$mq = "\\ufe20-\\ufe2f"
// @from(Ln 4229, Col 4)
Omq = "\\u20d0-\\u20ff"
// @from(Ln 4230, Col 4)
_mq
// @from(Ln 4230, Col 9)
Jmq = "\\ufe0e\\ufe0f"
// @from(Ln 4231, Col 4)
Xmq = "\\u200d"
// @from(Ln 4232, Col 4)
Dmq
// @from(Ln 4232, Col 9)
cn1
// @from(Ln 4233, Col 4)
bR6 = v(() => {
    _mq = Hmq + $mq + Omq, Dmq = RegExp("[" + Xmq + wmq + _mq + Jmq + "]");
    cn1 = jmq
})
// @from(Ln 4238, Col 0)
function Mmq(A) {
    return A.split("")
}
// @from(Ln 4241, Col 4)
aiA
// @from(Ln 4242, Col 4)
siA = v(() => {
    aiA = Mmq
})
// @from(Ln 4246, Col 0)
function Rmq(A) {
    return A.match(Lmq) || []
}
// @from(Ln 4249, Col 4)
tiA = "\\ud800-\\udfff"
// @from(Ln 4250, Col 4)
Pmq = "\\u0300-\\u036f"
// @from(Ln 4251, Col 4)
Wmq = "\\ufe20-\\ufe2f"
// @from(Ln 4252, Col 4)
Gmq = "\\u20d0-\\u20ff"
// @from(Ln 4253, Col 4)
Zmq
// @from(Ln 4253, Col 9)
fmq = "\\ufe0e\\ufe0f"
// @from(Ln 4254, Col 4)
Vmq
// @from(Ln 4254, Col 9)
uR6
// @from(Ln 4254, Col 14)
BR6 = "\\ud83c[\\udffb-\\udfff]"
// @from(Ln 4255, Col 4)
Nmq
// @from(Ln 4255, Col 9)
eiA
// @from(Ln 4255, Col 14)
AnA = "(?:\\ud83c[\\udde6-\\uddff]){2}"
// @from(Ln 4256, Col 4)
qnA = "[\\ud800-\\udbff][\\udc00-\\udfff]"
// @from(Ln 4257, Col 4)
Tmq = "\\u200d"
// @from(Ln 4258, Col 4)
KnA
// @from(Ln 4258, Col 9)
YnA
// @from(Ln 4258, Col 14)
vmq
// @from(Ln 4258, Col 19)
Emq
// @from(Ln 4258, Col 24)
kmq
// @from(Ln 4258, Col 29)
Lmq
// @from(Ln 4258, Col 34)
znA
// @from(Ln 4259, Col 4)
wnA = v(() => {
    Zmq = Pmq + Wmq + Gmq, Vmq = "[" + tiA + "]", uR6 = "[" + Zmq + "]", Nmq = "(?:" + uR6 + "|" + BR6 + ")", eiA = "[^" + tiA + "]", KnA = Nmq + "?", YnA = "[" + fmq + "]?", vmq = "(?:" + Tmq + "(?:" + [eiA, AnA, qnA].join("|") + ")" + YnA + KnA + ")*", Emq = YnA + KnA + vmq, kmq = "(?:" + [eiA + uR6 + "?", uR6, AnA, qnA, Vmq].join("|") + ")", Lmq = RegExp(BR6 + "(?=" + BR6 + ")|" + kmq + Emq, "g");
    znA = Rmq
})
// @from(Ln 4264, Col 0)
function ymq(A) {
    return cn1(A) ? znA(A) : aiA(A)
}
// @from(Ln 4267, Col 4)
HnA
// @from(Ln 4268, Col 4)
$nA = v(() => {
    siA();
    bR6();
    wnA();
    HnA = ymq
})
// @from(Ln 4275, Col 0)
function Cmq(A) {
    return function(q) {
        q = Uz1(q);
        var K = cn1(q) ? HnA(q) : void 0,
            Y = K ? K[0] : q.charAt(0),
            z = K ? riA(K, 1).join("") : q.slice(1);
        return Y[A]() + z
    }
}
// @from(Ln 4284, Col 4)
OnA
// @from(Ln 4285, Col 4)
_nA = v(() => {
    oiA();
    bR6();
    $nA();
    qn1();
    OnA = Cmq
})
// @from(Ln 4292, Col 4)
Smq
// @from(Ln 4292, Col 9)
JnA
// @from(Ln 4293, Col 4)
XnA = v(() => {
    _nA();
    Smq = OnA("toUpperCase"), JnA = Smq
})
// @from(Ln 4298, Col 0)
function hmq(A) {
    return JnA(Uz1(A).toLowerCase())
}
// @from(Ln 4301, Col 4)
_Q
// @from(Ln 4302, Col 4)
TN1 = v(() => {
    qn1();
    XnA();
    _Q = hmq
})
// @from(Ln 4308, Col 0)
function Imq(A, q, K, Y) {
    var z = -1,
        w = A == null ? 0 : A.length;
    while (++z < w) {
        var H = A[z];
        q(Y, H, K(H), A)
    }
    return Y
}
// @from(Ln 4317, Col 4)
DnA
// @from(Ln 4318, Col 4)
jnA = v(() => {
    DnA = Imq
})
// @from(Ln 4322, Col 0)
function xmq(A) {
    return function(q, K, Y) {
        var z = -1,
            w = Object(q),
            H = Y(q),
            $ = H.length;
        while ($--) {
            var O = H[A ? $ : ++z];
            if (K(w[O], O, w) === !1) break
        }
        return q
    }
}
// @from(Ln 4335, Col 4)
MnA
// @from(Ln 4336, Col 4)
PnA = v(() => {
    MnA = xmq
})
// @from(Ln 4339, Col 4)
bmq
// @from(Ln 4339, Col 9)
ln1
// @from(Ln 4340, Col 4)
mR6 = v(() => {
    PnA();
    bmq = MnA(), ln1 = bmq
})
// @from(Ln 4345, Col 0)
function umq(A, q) {
    return A && ln1(A, q, eE)
}
// @from(Ln 4348, Col 4)
in1
// @from(Ln 4349, Col 4)
FR6 = v(() => {
    mR6();
    a11();
    in1 = umq
})
// @from(Ln 4355, Col 0)
function Bmq(A, q) {
    return function(K, Y) {
        if (K == null) return K;
        if (!Nx(K)) return A(K, Y);
        var z = K.length,
            w = q ? z : -1,
            H = Object(K);
        while (q ? w-- : ++w < z)
            if (Y(H[w], w, H) === !1) break;
        return K
    }
}
// @from(Ln 4367, Col 4)
WnA
// @from(Ln 4368, Col 4)
GnA = v(() => {
    Bz1();
    WnA = Bmq
})
// @from(Ln 4372, Col 4)
mmq
// @from(Ln 4372, Col 9)
nn1
// @from(Ln 4373, Col 4)
QR6 = v(() => {
    FR6();
    GnA();
    mmq = WnA(in1), nn1 = mmq
})
// @from(Ln 4379, Col 0)
function Fmq(A, q, K, Y) {
    return nn1(A, function(z, w, H) {
        q(Y, z, K(z), H)
    }), Y
}
// @from(Ln 4384, Col 4)
ZnA
// @from(Ln 4385, Col 4)
fnA = v(() => {
    QR6();
    ZnA = Fmq
})
// @from(Ln 4390, Col 0)
function Qmq(A, q) {
    return function(K, Y) {
        var z = gz(K) ? DnA : ZnA,
            w = q ? q() : {};
        return z(K, A, vx(Y, 2), w)
    }
}
// @from(Ln 4397, Col 4)
VnA
// @from(Ln 4398, Col 4)
NnA = v(() => {
    jnA();
    fnA();
    lz1();
    RG();
    VnA = Qmq
})
// @from(Ln 4406, Col 0)
function gmq(A, q, K) {
    if (K !== void 0 && !Wx(A[q], K) || K === void 0 && !(q in A)) xl(A, q, K)
}
// @from(Ln 4409, Col 4)
vN1
// @from(Ln 4410, Col 4)
gR6 = v(() => {
    GN1();
    Ez1();
    vN1 = gmq
})
// @from(Ln 4416, Col 0)
function Umq(A) {
    return fD(A) && Nx(A)
}
// @from(Ln 4419, Col 4)
TnA
// @from(Ln 4420, Col 4)
vnA = v(() => {
    Bz1();
    Zx();
    TnA = Umq
})
// @from(Ln 4426, Col 0)
function pmq(A, q) {
    if (q === "constructor" && typeof A[q] === "function") return;
    if (q == "__proto__") return;
    return A[q]
}
// @from(Ln 4431, Col 4)
EN1
// @from(Ln 4432, Col 4)
UR6 = v(() => {
    EN1 = pmq
})
// @from(Ln 4436, Col 0)
function dmq(A) {
    return Kk(A, Lx(A))
}
// @from(Ln 4439, Col 4)
EnA
// @from(Ln 4440, Col 4)
knA = v(() => {
    J61();
    A21();
    EnA = dmq
})
// @from(Ln 4446, Col 0)
function cmq(A, q, K, Y, z, w, H) {
    var $ = EN1(A, K),
        O = EN1(q, K),
        _ = H.get(O);
    if (_) {
        vN1(A, K, _);
        return
    }
    var J = w ? w($, O, K + "", A, q, H) : void 0,
        X = J === void 0;
    if (X) {
        var D = gz(O),
            j = !D && fx(O),
            M = !D && !j && bz1(O);
        if (J = O, D || j || M)
            if (gz($)) J = $;
            else if (TnA($)) J = kn1($);
        else if (j) X = !1, J = fN1(O, !0);
        else if (M) X = !1, J = Sn1(O, !0);
        else J = [];
        else if (z21(O) || YQ(O)) {
            if (J = $, YQ($)) J = EnA($);
            else if (!WO($) || Tz1($)) J = hn1(O)
        } else X = !1
    }
    if (X) H.set(O, J), z(J, O, Y, w, H), H.delete(O);
    vN1(A, K, J)
}
// @from(Ln 4474, Col 4)
LnA
// @from(Ln 4475, Col 4)
RnA = v(() => {
    gR6();
    jR6();
    GR6();
    MR6();
    ZR6();
    cV1();
    RG();
    vnA();
    lV1();
    Vi1();
    tE();
    pn1();
    Ui1();
    UR6();
    knA();
    LnA = cmq
})
// @from(Ln 4494, Col 0)
function ynA(A, q, K, Y, z) {
    if (A === q) return;
    ln1(q, function(w, H) {
        if (z || (z = new Gx), WO(w)) LnA(A, q, H, K, ynA, Y, z);
        else {
            var $ = Y ? Y(EN1(A, H), w, H + "", A, q, z) : void 0;
            if ($ === void 0) $ = w;
            vN1(A, H, $)
        }
    }, Lx)
}
// @from(Ln 4505, Col 4)
CnA
// @from(Ln 4506, Col 4)
SnA = v(() => {
    dV1();
    gR6();
    mR6();
    RnA();
    tE();
    A21();
    UR6();
    CnA = ynA
})
// @from(Ln 4516, Col 4)
lmq
// @from(Ln 4516, Col 9)
kN1
// @from(Ln 4517, Col 4)
hnA = v(() => {
    SnA();
    BiA();
    lmq = uiA(function(A, q, K, Y) {
        CnA(A, q, K, Y)
    }), kN1 = lmq
})
// @from(Ln 4525, Col 0)
function imq(A, q, K) {
    var Y = -1,
        z = A == null ? 0 : A.length;
    while (++Y < z)
        if (K(q, A[Y])) return !0;
    return !1
}
// @from(Ln 4532, Col 4)
InA
// @from(Ln 4533, Col 4)
xnA = v(() => {
    InA = imq
})
// @from(Ln 4537, Col 0)
function nmq(A) {
    var q = A == null ? 0 : A.length;
    return q ? A[q - 1] : void 0
}
// @from(Ln 4541, Col 4)
gP
// @from(Ln 4542, Col 4)
P61 = v(() => {
    gP = nmq
})
// @from(Ln 4546, Col 0)
function rmq(A, q) {
    var K = [];
    return nn1(A, function(Y, z, w) {
        if (q(Y, z, w)) K.push(Y)
    }), K
}
// @from(Ln 4552, Col 4)
bnA
// @from(Ln 4553, Col 4)
unA = v(() => {
    QR6();
    bnA = rmq
})
// @from(Ln 4558, Col 0)
function omq(A, q) {
    return gz1(q, function(K) {
        return A[K]
    })
}
// @from(Ln 4563, Col 4)
BnA
// @from(Ln 4564, Col 4)
mnA = v(() => {
    An1();
    BnA = omq
})
// @from(Ln 4569, Col 0)
function amq(A) {
    return A == null ? [] : BnA(A, eE(A))
}
// @from(Ln 4572, Col 4)
FnA
// @from(Ln 4573, Col 4)
QnA = v(() => {
    mnA();
    a11();
    FnA = amq
})
// @from(Ln 4579, Col 0)
function smq(A, q) {
    return q.length < 2 ? A : dz1(A, dn1(q, 0, -1))
}
// @from(Ln 4582, Col 4)
gnA
// @from(Ln 4583, Col 4)
UnA = v(() => {
    Kn1();
    xR6();
    gnA = smq
})
// @from(Ln 4589, Col 0)
function tmq(A, q) {
    return mz1(A, q)
}
// @from(Ln 4592, Col 4)
W61
// @from(Ln 4593, Col 4)
pR6 = v(() => {
    oi1();
    W61 = tmq
})
// @from(Ln 4598, Col 0)
function emq(A, q) {
    var K = {};
    return q = vx(q, 3), in1(A, function(Y, z, w) {
        xl(K, z, q(Y, z, w))
    }), K
}
// @from(Ln 4604, Col 4)
G61
// @from(Ln 4605, Col 4)
rn1 = v(() => {
    GN1();
    FR6();
    lz1();
    G61 = emq
})
// @from(Ln 4612, Col 0)
function qFq(A) {
    if (typeof A != "function") throw TypeError(AFq);
    return function() {
        var q = arguments;
        switch (q.length) {
            case 0:
                return !A.call(this);
            case 1:
                return !A.call(this, q[0]);
            case 2:
                return !A.call(this, q[0], q[1]);
            case 3:
                return !A.call(this, q[0], q[1], q[2])
        }
        return !A.apply(this, q)
    }
}
// @from(Ln 4629, Col 4)
AFq = "Expected a function"
// @from(Ln 4630, Col 4)
pnA
// @from(Ln 4631, Col 4)
dnA = v(() => {
    pnA = qFq
})
// @from(Ln 4635, Col 0)
function KFq(A, q) {
    return q = Tx(q, A), A = gnA(A, q), A == null || delete A[Ak(gP(q))]
}
// @from(Ln 4638, Col 4)
cnA
// @from(Ln 4639, Col 4)
lnA = v(() => {
    pz1();
    P61();
    UnA();
    t11();
    cnA = KFq
})
// @from(Ln 4647, Col 0)
function YFq(A) {
    return z21(A) ? void 0 : A
}
// @from(Ln 4650, Col 4)
inA
// @from(Ln 4651, Col 4)
nnA = v(() => {
    pn1();
    inA = YFq
})
// @from(Ln 4655, Col 4)
zFq = 1
// @from(Ln 4656, Col 4)
wFq = 2
// @from(Ln 4657, Col 4)
HFq = 4
// @from(Ln 4658, Col 4)
$Fq
// @from(Ln 4658, Col 9)
w21
// @from(Ln 4659, Col 4)
dR6 = v(() => {
    An1();
    fR6();
    lnA();
    pz1();
    J61();
    nnA();
    iiA();
    WR6();
    $Fq = liA(function(A, q) {
        var K = {};
        if (A == null) return K;
        var Y = !1;
        if (q = gz1(q, function(w) {
                return w = Tx(w, A), Y || (Y = w.length > 1), w
            }), Kk(A, yn1(A), K), Y) K = xn1(K, zFq | wFq | HFq, inA);
        var z = q.length;
        while (z--) cnA(K, q[z]);
        return K
    }), w21 = $Fq
})
// @from(Ln 4681, Col 0)
function OFq(A, q, K, Y) {
    if (!WO(A)) return A;
    q = Tx(q, A);
    var z = -1,
        w = q.length,
        H = w - 1,
        $ = A;
    while ($ != null && ++z < w) {
        var O = Ak(q[z]),
            _ = K;
        if (O === "__proto__" || O === "constructor" || O === "prototype") return A;
        if (z != H) {
            var J = $[O];
            if (_ = Y ? Y(J, O, $) : void 0, _ === void 0) _ = WO(J) ? J : Cl(q[z + 1]) ? [] : {}
        }
        bl($, O, _), $ = $[O]
    }
    return A
}
// @from(Ln 4700, Col 4)
rnA
// @from(Ln 4701, Col 4)
onA = v(() => {
    ZN1();
    pz1();
    iV1();
    tE();
    t11();
    rnA = OFq
})
// @from(Ln 4709, Col 4)
_Fq
// @from(Ln 4709, Col 9)
anA
// @from(Ln 4710, Col 4)
snA = v(() => {
    NnA();
    _Fq = VnA(function(A, q, K) {
        A[K ? 0 : 1].push(q)
    }, function() {
        return [
            [],
            []
        ]
    }), anA = _Fq
})
// @from(Ln 4722, Col 0)
function DFq(A, q) {
    return A + JFq(XFq() * (q - A + 1))
}
// @from(Ln 4725, Col 4)
JFq
// @from(Ln 4725, Col 9)
XFq
// @from(Ln 4725, Col 14)
tnA
// @from(Ln 4726, Col 4)
enA = v(() => {
    JFq = Math.floor, XFq = Math.random;
    tnA = DFq
})
// @from(Ln 4731, Col 0)
function jFq(A, q) {
    var K = gz(A) ? hi1 : bnA;
    return K(A, pnA(vx(q, 3)))
}
// @from(Ln 4735, Col 4)
Cx
// @from(Ln 4736, Col 4)
cR6 = v(() => {
    ok6();
    unA();
    lz1();
    RG();
    dnA();
    Cx = jFq
})
// @from(Ln 4745, Col 0)
function MFq(A) {
    var q = A.length;
    return q ? A[tnA(0, q - 1)] : void 0
}
// @from(Ln 4749, Col 4)
on1
// @from(Ln 4750, Col 4)
lR6 = v(() => {
    enA();
    on1 = MFq
})
// @from(Ln 4755, Col 0)
function PFq(A) {
    return on1(FnA(A))
}
// @from(Ln 4758, Col 4)
ArA
// @from(Ln 4759, Col 4)
qrA = v(() => {
    lR6();
    QnA();
    ArA = PFq
})
// @from(Ln 4765, Col 0)
function WFq(A) {
    var q = gz(A) ? on1 : ArA;
    return q(A)
}
// @from(Ln 4769, Col 4)
pj
// @from(Ln 4770, Col 4)
gl = v(() => {
    lR6();
    qrA();
    RG();
    pj = WFq
})
// @from(Ln 4777, Col 0)
function GFq(A, q, K, Y) {
    return Y = typeof Y == "function" ? Y : void 0, A == null ? A : rnA(A, q, K, Y)
}
// @from(Ln 4780, Col 4)
KrA
// @from(Ln 4781, Col 4)
YrA = v(() => {
    onA();
    KrA = GFq
})
// @from(Ln 4785, Col 4)
ZFq = 1 / 0
// @from(Ln 4786, Col 4)
fFq
// @from(Ln 4786, Col 9)
zrA
// @from(Ln 4787, Col 4)
wrA = v(() => {
    KL6();
    SR6();
    yi1();
    fFq = !(Sl && 1 / Cz1(new Sl([, -0]))[1] == ZFq) ? OQ : function(A) {
        return new Sl(A)
    }, zrA = fFq
})
// @from(Ln 4796, Col 0)
function NFq(A, q, K) {
    var Y = -1,
        z = yiA,
        w = A.length,
        H = !0,
        $ = [],
        O = $;
    if (K) H = !1, z = InA;
    else if (w >= VFq) {
        var _ = q ? null : zrA(A);
        if (_) return Cz1(_);
        H = !1, z = Li1, O = new ki1
    } else O = q ? [] : $;
    A: while (++Y < w) {
        var J = A[Y],
            X = q ? q(J) : J;
        if (J = K || J !== 0 ? J : 0, H && X === X) {
            var D = O.length;
            while (D--)
                if (O[D] === X) continue A;
            if (q) O.push(X);
            $.push(J)
        } else if (!z(O, X, K)) {
            if (O !== $) O.push(X);
            $.push(J)
        }
    }
    return $
}
// @from(Ln 4825, Col 4)
VFq = 200
// @from(Ln 4826, Col 4)
HrA
// @from(Ln 4827, Col 4)
$rA = v(() => {
    dk6();
    CiA();
    xnA();
    ck6();
    wrA();
    yi1();
    HrA = NFq
})
// @from(Ln 4837, Col 0)
function TFq(A, q) {
    return A && A.length ? HrA(A, vx(q, 2)) : []
}
// @from(Ln 4840, Col 4)
Sx
// @from(Ln 4841, Col 4)
H21 = v(() => {
    lz1();
    $rA();
    Sx = TFq
})
// @from(Ln 4847, Col 0)
function vFq(A, q, K) {
    var Y = -1,
        z = A.length,
        w = q.length,
        H = {};
    while (++Y < z) {
        var $ = Y < w ? q[Y] : void 0;
        K(H, A[Y], $)
    }
    return H
}
// @from(Ln 4858, Col 4)
OrA
// @from(Ln 4859, Col 4)
_rA = v(() => {
    OrA = vFq
})
// @from(Ln 4863, Col 0)
function EFq(A, q) {
    return OrA(A || [], q || [], bl)
}
// @from(Ln 4866, Col 4)
JrA
// @from(Ln 4867, Col 4)
XrA = v(() => {
    ZN1();
    _rA();
    JrA = EFq
})
// @from(Ln 4872, Col 4)
an1 = v(() => {
    pR6();
    zq()
})
// @from(Ln 4877, Col 0)
function MrA() {
    return jrA
}
// @from(Ln 4881, Col 0)
function iR6(A) {
    let q = 2166136261,
        K = A.length;
    for (let Y = 0; Y < K; Y++) q ^= A.charCodeAt(Y), q += (q << 1) + (q << 4) + (q << 7) + (q << 8) + (q << 24);
    return q >>> 0
}
// @from(Ln 4888, Col 0)
function LN1(A, q, K) {
    if (K === 2) return iR6(iR6(A + q) + "") % 1e4 / 1e4;
    if (K === 1) return iR6(q + A) % 1000 / 1000;
    return null
}
// @from(Ln 4894, Col 0)
function kFq(A) {
    if (A <= 0) return [];
    return Array(A).fill(1 / A)
}
// @from(Ln 4899, Col 0)
function sn1(A, q) {
    return A >= q[0] && A < q[1]
}
// @from(Ln 4903, Col 0)
function PrA(A, q) {
    let K = LN1("__" + q[0], A, 1);
    if (K === null) return !1;
    return K >= q[1] && K < q[2]
}
// @from(Ln 4909, Col 0)
function WrA(A, q) {
    for (let K = 0; K < q.length; K++)
        if (sn1(A, q[K])) return K;
    return -1
}
// @from(Ln 4915, Col 0)
function rR6(A) {
    try {
        let q = A.replace(/([^\\])\//g, "$1\\/");
        return new RegExp(q)
    } catch (q) {
        console.error(q);
        return
    }
}
// @from(Ln 4925, Col 0)
function tn1(A, q) {
    if (!q.length) return !1;
    let K = !1,
        Y = !1;
    for (let z = 0; z < q.length; z++) {
        let w = yFq(A, q[z].type, q[z].pattern);
        if (q[z].include === !1) {
            if (w) return !1
        } else if (K = !0, w) Y = !0
    }
    return Y || !K
}
// @from(Ln 4938, Col 0)
function LFq(A, q, K) {
    try {
        let Y = q.replace(/[*.+?^${}()|[\]\\]/g, "\\$&").replace(/_____/g, ".*");
        if (K) Y = "\\/?" + Y.replace(/(^\/|\/$)/g, "") + "\\/?";
        return new RegExp("^" + Y + "$", "i").test(A)
    } catch (Y) {
        return !1
    }
}
// @from(Ln 4948, Col 0)
function RFq(A, q) {
    try {
        let K = new URL(q.replace(/^([^:/?]*)\./i, "https://$1.").replace(/\*/g, "_____"), "https://_____"),
            Y = [
                [A.host, K.host, !1],
                [A.pathname, K.pathname, !0]
            ];
        if (K.hash) Y.push([A.hash, K.hash, !1]);
        return K.searchParams.forEach((z, w) => {
            Y.push([A.searchParams.get(w) || "", z, !1])
        }), !Y.some((z) => !LFq(z[0], z[1], z[2]))
    } catch (K) {
        return !1
    }
}
// @from(Ln 4964, Col 0)
function yFq(A, q, K) {
    try {
        let Y = new URL(A, "https://_");
        if (q === "regex") {
            let z = rR6(K);
            if (!z) return !1;
            return z.test(Y.href) || z.test(Y.href.substring(Y.origin.length))
        } else if (q === "simple") return RFq(Y, K);
        return !1
    } catch (Y) {
        return !1
    }
}
// @from(Ln 4978, Col 0)
function GrA(A, q, K) {
    if (q = q === void 0 ? 1 : q, q < 0) q = 0;
    else if (q > 1) q = 1;
    let Y = kFq(A);
    if (K = K || Y, K.length !== A) K = Y;
    let z = K.reduce((H, $) => $ + H, 0);
    if (z < 0.99 || z > 1.01) K = Y;
    let w = 0;
    return K.map((H) => {
        let $ = w;
        return w += H, [$, $ + q * H]
    })
}
// @from(Ln 4992, Col 0)
function ZrA(A, q, K) {
    if (!q) return null;
    let Y = q.split("?")[1];
    if (!Y) return null;
    let z = Y.replace(/#.*/, "").split("&").map((w) => w.split("=", 2)).filter((w) => {
        let [H] = w;
        return H === A
    }).map((w) => {
        let [, H] = w;
        return parseInt(H)
    });
    if (z.length > 0 && z[0] >= 0 && z[0] < K) return z[0];
    return null
}
// @from(Ln 5007, Col 0)
function frA(A) {
    try {
        return A()
    } catch (q) {
        return console.error(q), !1
    }
}
// @from(Ln 5014, Col 0)
async function Z61(A, q, K) {
    if (q = q || "", K = K || globalThis.crypto && globalThis.crypto.subtle || jrA.SubtleCrypto, !K) throw Error("No SubtleCrypto implementation found");
    try {
        let Y = await K.importKey("raw", nR6(q), {
                name: "AES-CBC",
                length: 128
            }, !0, ["encrypt", "decrypt"]),
            [z, w] = A.split("."),
            H = await K.decrypt({
                name: "AES-CBC",
                iv: nR6(z)
            }, Y, nR6(w));
        return new TextDecoder().decode(H)
    } catch (Y) {
        throw Error("Failed to decrypt")
    }
}
// @from(Ln 5032, Col 0)
function RN1(A) {
    if (typeof A === "string") return A;
    return JSON.stringify(A)
}
// @from(Ln 5037, Col 0)
function JT(A) {
    if (typeof A === "number") A = A + "";
    if (!A || typeof A !== "string") A = "0";
    let q = A.replace(/(^v|\+.*$)/g, "").split(/[-.]/);
    if (q.length === 3) q.push("~");
    return q.map((K) => K.match(/^[0-9]+$/) ? K.padStart(5, " ") : K).join("-")
}
// @from(Ln 5045, Col 0)
function VrA() {
    let A;
    try {
        A = "1.6.1"
    } catch (q) {
        A = ""
    }
    return A
}
// @from(Ln 5055, Col 0)
function NrA(A, q) {
    let K, Y;
    try {
        K = new URL(A), Y = new URL(q)
    } catch (z) {
        return console.error(`Unable to merge query strings: ${z}`), q
    }
    return K.searchParams.forEach((z, w) => {
        if (Y.searchParams.has(w)) return;
        Y.searchParams.set(w, z)
    }), Y.toString()
}
// @from(Ln 5068, Col 0)
function DrA(A) {
    return typeof A === "object" && A !== null
}
// @from(Ln 5072, Col 0)
function en1(A) {
    if (A.urlPatterns && A.variations.some((q) => DrA(q) && ("urlRedirect" in q))) return "redirect";
    else if (A.variations.some((q) => DrA(q) && (q.domMutations || ("js" in q) || ("css" in q)))) return "visual";
    return "unknown"
}
// @from(Ln 5077, Col 0)
async function Ar1(A, q) {
    return new Promise((K) => {
        let Y = !1,
            z, w = (H) => {
                if (Y) return;
                Y = !0, z && clearTimeout(z), K(H || null)
            };
        if (q) z = setTimeout(() => w(), q);
        A.then((H) => w(H)).catch(() => w())
    })
}
// @from(Ln 5088, Col 4)
jrA
// @from(Ln 5088, Col 9)
nR6 = (A) => Uint8Array.from(atob(A), (q) => q.charCodeAt(0))
// @from(Ln 5089, Col 4)
yN1 = v(() => {
    jrA = {
        fetch: globalThis.fetch ? globalThis.fetch.bind(globalThis) : void 0,
        SubtleCrypto: globalThis.crypto ? globalThis.crypto.subtle : void 0,
        EventSource: globalThis.EventSource
    }
})
// @from(Ln 5097, Col 0)
function ErA(A) {
    if (Object.assign(UP, A), !UP.backgroundSync) BFq()
}
// @from(Ln 5100, Col 0)
async function krA(A) {
    let {
        instance: q,
        timeout: K,
        skipCache: Y,
        allowStale: z,
        backgroundSync: w
    } = A;
    if (!w) UP.backgroundSync = !1;
    return IFq({
        instance: q,
        allowStale: z,
        timeout: K,
        skipCache: Y
    })
}
// @from(Ln 5117, Col 0)
function CFq(A) {
    let q = CN1(A),
        K = O21.get(q) || new Set;
    K.add(A), O21.set(q, K)
}
// @from(Ln 5123, Col 0)
function LrA(A) {
    O21.forEach((q) => q.delete(A))
}
// @from(Ln 5127, Col 0)
function SFq() {
    _21.forEach((A) => {
        if (!A) return;
        A.state = "idle", tR6(A)
    })
}
// @from(Ln 5134, Col 0)
function hFq() {
    _21.forEach((A) => {
        if (!A) return;
        if (A.state !== "idle") return;
        eR6(A)
    })
}
// @from(Ln 5141, Col 0)
async function vrA() {
    try {
        if (!hx.localStorage) return;
        await hx.localStorage.setItem(UP.cacheKey, JSON.stringify(Array.from(JQ.entries())))
    } catch (A) {}
}
// @from(Ln 5147, Col 0)
async function IFq(A) {
    let {
        instance: q,
        allowStale: K,
        timeout: Y,
        skipCache: z
    } = A, w = CN1(q), H = aR6(q), $ = new Date, O = new Date($.getTime() - UP.maxAge + UP.staleTTL);
    await xFq();
    let _ = !UP.disableCache && !z ? JQ.get(H) : void 0;
    if (_ && (K || _.staleAt > $) && _.staleAt > O) {
        if (_.sse) J21.add(w);
        if (_.staleAt < $) oR6(q);
        else sR6(q);
        return {
            data: _.data,
            success: !0,
            source: "cache"
        }
    } else return await Ar1(oR6(q), Y) || {
        data: null,
        success: !1,
        source: "timeout",
        error: Error("Timeout")
    }
}
// @from(Ln 5173, Col 0)
function CN1(A) {
    let [q, K] = A.getApiInfo();
    return `${q}||${K}`
}
// @from(Ln 5178, Col 0)
function aR6(A) {
    let q = CN1(A);
    if (!("isRemoteEval" in A) || !A.isRemoteEval()) return q;
    let K = A.getAttributes(),
        Y = A.getCacheKeyAttributes() || Object.keys(A.getAttributes()),
        z = {};
    Y.forEach(($) => {
        z[$] = K[$]
    });
    let w = A.getForcedVariations(),
        H = A.getUrl();
    return `${q}||${JSON.stringify({ca:z,fv:w,url:H})}`
}
// @from(Ln 5191, Col 0)
async function xFq() {
    if (TrA) return;
    TrA = !0;
    try {
        if (hx.localStorage) {
            let A = await hx.localStorage.getItem(UP.cacheKey);
            if (!UP.disableCache && A) {
                let q = JSON.parse(A);
                if (q && Array.isArray(q)) q.forEach((K) => {
                    let [Y, z] = K;
                    JQ.set(Y, {
                        ...z,
                        staleAt: new Date(z.staleAt)
                    })
                });
                RrA()
            }
        }
    } catch (A) {}
    if (!UP.disableIdleStreams) {
        let A = $21.startIdleListener();
        if (A) $21.stopIdleListener = A
    }
}
// @from(Ln 5216, Col 0)
function RrA() {
    let A = Array.from(JQ.entries()).map((K) => {
            let [Y, z] = K;
            return {
                key: Y,
                staleAt: z.staleAt.getTime()
            }
        }).sort((K, Y) => K.staleAt - Y.staleAt),
        q = Math.min(Math.max(0, JQ.size - UP.maxEntries), JQ.size);
    for (let K = 0; K < q; K++) JQ.delete(A[K].key)
}
// @from(Ln 5228, Col 0)
function yrA(A, q, K) {
    let Y = K.dateUpdated || "",
        z = new Date(Date.now() + UP.staleTTL),
        w = !UP.disableCache ? JQ.get(q) : void 0;
    if (w && Y && w.version === Y) {
        w.staleAt = z, vrA();
        return
    }
    if (!UP.disableCache) JQ.set(q, {
        data: K,
        version: Y,
        staleAt: z,
        sse: J21.has(A)
    }), RrA();
    vrA();
    let H = O21.get(A);
    H && H.forEach(($) => bFq($, K))
}
// @from(Ln 5246, Col 0)
async function bFq(A, q) {
    await A.setPayload(q || A.getPayload())
}
// @from(Ln 5249, Col 0)
async function oR6(A) {
    let {
        apiHost: q,
        apiRequestHeaders: K
    } = A.getApiHosts(), Y = A.getClientKey(), z = "isRemoteEval" in A && A.isRemoteEval(), w = CN1(A), H = aR6(A), $ = qr1.get(H);
    if (!$) $ = (z ? $21.fetchRemoteEvalCall({
        host: q,
        clientKey: Y,
        payload: {
            attributes: A.getAttributes(),
            forcedVariations: A.getForcedVariations(),
            forcedFeatures: Array.from(A.getForcedFeatures().entries()),
            url: A.getUrl()
        },
        headers: K
    }) : $21.fetchFeaturesCall({
        host: q,
        clientKey: Y,
        headers: K
    })).then((_) => {
        if (!_.ok) throw Error(`HTTP error: ${_.status}`);
        if (_.headers.get("x-sse-support") === "enabled") J21.add(w);
        return _.json()
    }).then((_) => {
        return yrA(w, H, _), sR6(A), qr1.delete(H), {
            data: _,
            success: !0,
            source: "network"
        }
    }).catch((_) => {
        return qr1.delete(H), {
            data: null,
            source: "error",
            success: !1,
            error: _
        }
    }), qr1.set(H, $);
    return $
}
// @from(Ln 5289, Col 0)
function sR6(A) {
    let q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
        K = CN1(A),
        Y = aR6(A),
        {
            streamingHost: z,
            streamingHostRequestHeaders: w
        } = A.getApiHosts(),
        H = A.getClientKey();
    if (q) J21.add(K);
    if (UP.backgroundSync && J21.has(K) && hx.EventSource) {
        if (_21.has(K)) return;
        let $ = {
            src: null,
            host: z,
            clientKey: H,
            headers: w,
            cb: (O) => {
                try {
                    if (O.type === "features-updated") {
                        let _ = O21.get(K);
                        _ && _.forEach((J) => {
                            oR6(J)
                        })
                    } else if (O.type === "features") {
                        let _ = JSON.parse(O.data);
                        yrA(K, Y, _)
                    }
                    $.errors = 0
                } catch (_) {
                    CrA($)
                }
            },
            errors: 0,
            state: "active"
        };
        _21.set(K, $), eR6($)
    }
}
// @from(Ln 5329, Col 0)
function CrA(A) {
    if (A.state === "idle") return;
    if (A.errors++, A.errors > 3 || A.src && A.src.readyState === 2) {
        let q = Math.pow(3, A.errors - 3) * (1000 + Math.random() * 1000);
        tR6(A), setTimeout(() => {
            if (["idle", "active"].includes(A.state)) return;
            eR6(A)
        }, Math.min(q, 300000))
    }
}
// @from(Ln 5340, Col 0)
function tR6(A) {
    if (!A.src) return;
    if (A.src.onopen = null, A.src.onerror = null, A.src.close(), A.src = null, A.state === "active") A.state = "disabled"
}
// @from(Ln 5345, Col 0)
function eR6(A) {
    A.src = $21.eventSourceCall({
        host: A.host,
        clientKey: A.clientKey,
        headers: A.headers
    }), A.state = "active", A.src.addEventListener("features", A.cb), A.src.addEventListener("features-updated", A.cb), A.src.onerror = () => CrA(A), A.src.onopen = () => {
        A.errors = 0
    }
}
// @from(Ln 5355, Col 0)
function uFq(A, q) {
    tR6(A), _21.delete(q)
}
// @from(Ln 5359, Col 0)
function BFq() {
    J21.clear(), _21.forEach(uFq), O21.clear(), $21.stopIdleListener()
}
// @from(Ln 5363, Col 0)
function Kr1(A, q) {
    if (q.streaming) {
        if (!A.getClientKey()) throw Error("Must specify clientKey to enable streaming");
        if (q.payload) sR6(A, !0);
        CFq(A)
    }
}
// @from(Ln 5370, Col 4)
UP
// @from(Ln 5370, Col 8)
hx
// @from(Ln 5370, Col 12)
$21
// @from(Ln 5370, Col 17)
O21
// @from(Ln 5370, Col 22)
TrA = !1
// @from(Ln 5371, Col 4)
JQ
// @from(Ln 5371, Col 8)
qr1
// @from(Ln 5371, Col 13)
_21
// @from(Ln 5371, Col 18)
J21
// @from(Ln 5372, Col 4)
SrA = v(() => {
    yN1();
    UP = {
        staleTTL: 60000,
        maxAge: 14400000,
        cacheKey: "gbFeaturesCache",
        backgroundSync: !0,
        maxEntries: 10,
        disableIdleStreams: !1,
        idleStreamInterval: 20000,
        disableCache: !1
    }, hx = MrA(), $21 = {
        fetchFeaturesCall: (A) => {
            let {
                host: q,
                clientKey: K,
                headers: Y
            } = A;
            return hx.fetch(`${q}/api/features/${K}`, {
                headers: Y
            })
        },
        fetchRemoteEvalCall: (A) => {
            let {
                host: q,
                clientKey: K,
                payload: Y,
                headers: z
            } = A, w = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...z
                },
                body: JSON.stringify(Y)
            };
            return hx.fetch(`${q}/api/eval/${K}`, w)
        },
        eventSourceCall: (A) => {
            let {
                host: q,
                clientKey: K,
                headers: Y
            } = A;
            if (Y) return new hx.EventSource(`${q}/sub/${K}`, {
                headers: Y
            });
            return new hx.EventSource(`${q}/sub/${K}`)
        },
        startIdleListener: () => {
            let A;
            if (!(typeof window < "u" && typeof document < "u")) return;
            let K = () => {
                if (document.visibilityState === "visible") window.clearTimeout(A), hFq();
                else if (document.visibilityState === "hidden") A = window.setTimeout(SFq, UP.idleStreamInterval)
            };
            return document.addEventListener("visibilitychange", K), () => document.removeEventListener("visibilitychange", K)
        },
        stopIdleListener: () => {}
    };
    try {
        if (globalThis.localStorage) hx.localStorage = globalThis.localStorage
    } catch (A) {}
    O21 = new Map, JQ = new Map, qr1 = new Map, _21 = new Map, J21 = new Set
})
// @from(Ln 5437, Col 4)
prA = R((UrA) => {
    Object.defineProperty(UrA, "__esModule", {
        value: !0
    });
    var brA = /^[a-zA-Z:_][a-zA-Z0-9:_.-]*$/,
        Ky6 = {
            revert: function() {}
        },
        Hr1 = new Map,
        qy6 = new Set;

    function $r1(A) {
        var q = Hr1.get(A);
        return q || Hr1.set(A, q = {
            element: A,
            attributes: {}
        }), q
    }

    function Or1(A, q, K, Y, z) {
        var w = K(A),
            H = {
                isDirty: !1,
                originalValue: w,
                virtualValue: w,
                mutations: [],
                el: A,
                _positionTimeout: null,
                observer: new MutationObserver(function() {
                    if (q !== "position" || !H._positionTimeout) {
                        q === "position" && (H._positionTimeout = setTimeout(function() {
                            H._positionTimeout = null
                        }, 1000));
                        var $ = K(A);
                        q === "position" && $.parentNode === H.virtualValue.parentNode && $.insertBeforeNode === H.virtualValue.insertBeforeNode || $ !== H.virtualValue && (H.originalValue = $, z(H))
                    }
                }),
                mutationRunner: z,
                setValue: Y,
                getCurrentValue: K
            };
        return q === "position" && A.parentNode ? H.observer.observe(A.parentNode, {
            childList: !0,
            subtree: !0,
            attributes: !1,
            characterData: !1
        }) : H.observer.observe(A, function($) {
            return $ === "html" ? {
                childList: !0,
                subtree: !0,
                attributes: !0,
                characterData: !0
            } : {
                childList: !1,
                subtree: !1,
                attributes: !0,
                attributeFilter: [$]
            }
        }(q)), H
    }

    function _r1(A, q) {
        var K = q.getCurrentValue(q.el);
        q.virtualValue = A, A && typeof A != "string" ? K && A.parentNode === K.parentNode && A.insertBeforeNode === K.insertBeforeNode || (q.isDirty = !0, hrA()) : A !== K && (q.isDirty = !0, hrA())
    }

    function mFq(A) {
        var q = A.originalValue;
        A.mutations.forEach(function(K) {
            return q = K.mutate(q)
        }), _r1(function(K) {
            return Yr1 || (Yr1 = document.createElement("div")), Yr1.innerHTML = K, Yr1.innerHTML
        }(q), A)
    }

    function FFq(A) {
        var q = new Set(A.originalValue.split(/\s+/).filter(Boolean));
        A.mutations.forEach(function(K) {
            return K.mutate(q)
        }), _r1(Array.from(q).filter(Boolean).join(" "), A)
    }

    function QFq(A) {
        var q = A.originalValue;
        A.mutations.forEach(function(K) {
            return q = K.mutate(q)
        }), _r1(q, A)
    }

    function gFq(A) {
        var q = A.originalValue;
        A.mutations.forEach(function(K) {
            var Y = function(z) {
                var w = z.insertBeforeSelector,
                    H = document.querySelector(z.parentSelector);
                if (!H) return null;
                var $ = w ? document.querySelector(w) : null;
                return w && !$ ? null : {
                    parentNode: H,
                    insertBeforeNode: $
                }
            }(K.mutate());
            q = Y || q
        }), _r1(q, A)
    }
    var UFq = function(A) {
            return A.innerHTML
        },
        pFq = function(A, q) {
            return A.innerHTML = q
        };

    function urA(A) {
        var q = $r1(A);
        return q.html || (q.html = Or1(A, "html", UFq, pFq, mFq)), q.html
    }
    var dFq = function(A) {
            return {
                parentNode: A.parentElement,
                insertBeforeNode: A.nextElementSibling
            }
        },
        cFq = function(A, q) {
            q.insertBeforeNode && !q.parentNode.contains(q.insertBeforeNode) || q.parentNode.insertBefore(A, q.insertBeforeNode)
        };

    function BrA(A) {
        var q = $r1(A);
        return q.position || (q.position = Or1(A, "position", dFq, cFq, gFq)), q.position
    }
    var Yr1, hN1, lFq = function(A, q) {
            return q ? A.className = q : A.removeAttribute("class")
        },
        iFq = function(A) {
            return A.className
        };

    function mrA(A) {
        var q = $r1(A);
        return q.classes || (q.classes = Or1(A, "class", iFq, lFq, FFq)), q.classes
    }

    function FrA(A, q) {
        var K, Y = $r1(A);
        return Y.attributes[q] || (Y.attributes[q] = Or1(A, q, (K = q, function(z) {
            var w;
            return (w = z.getAttribute(K)) != null ? w : null
        }), function(z) {
            return function(w, H) {
                return H !== null ? w.setAttribute(z, H) : w.removeAttribute(z)
            }
        }(q), QFq)), Y.attributes[q]
    }

    function zr1(A, q, K) {
        if (K.isDirty) {
            K.isDirty = !1;
            var Y = K.virtualValue;
            K.mutations.length || function(z, w) {
                var H, $, O = Hr1.get(z);
                if (O)
                    if (w === "html")(H = O.html) == null || ($ = H.observer) == null || $.disconnect(), delete O.html;
                    else if (w === "class") {
                    var _, J;
                    (_ = O.classes) == null || (J = _.observer) == null || J.disconnect(), delete O.classes
                } else if (w === "position") {
                    var X, D;
                    (X = O.position) == null || (D = X.observer) == null || D.disconnect(), delete O.position
                } else {
                    var j, M, P;
                    (j = O.attributes) == null || (M = j[w]) == null || (P = M.observer) == null || P.disconnect(), delete O.attributes[w]
                }
            }(A, q), K.setValue(A, Y)
        }
    }

    function nFq(A, q) {
        A.html && zr1(q, "html", A.html), A.classes && zr1(q, "class", A.classes), A.position && zr1(q, "position", A.position), Object.keys(A.attributes).forEach(function(K) {
            zr1(q, K, A.attributes[K])
        })
    }

    function hrA() {
        Hr1.forEach(nFq)
    }

    function QrA(A) {
        if (A.kind !== "position" || A.elements.size !== 1) {
            var q = new Set(A.elements);
            document.querySelectorAll(A.selector).forEach(function(K) {
                q.has(K) || (A.elements.add(K), function(Y, z) {
                    var w = null;
                    Y.kind === "html" ? w = urA(z) : Y.kind === "class" ? w = mrA(z) : Y.kind === "attribute" ? w = FrA(z, Y.attribute) : Y.kind === "position" && (w = BrA(z)), w && (w.mutations.push(Y), w.mutationRunner(w))
                }(A, K))
            })
        }
    }

    function IrA() {
        qy6.forEach(QrA)
    }

    function grA() {
        typeof document < "u" && (hN1 || (hN1 = new MutationObserver(function() {
            IrA()
        })), IrA(), hN1.observe(document.documentElement, {
            childList: !0,
            subtree: !0,
            attributes: !1,
            characterData: !1
        }))
    }

    function Jr1(A) {
        return typeof document > "u" ? Ky6 : (qy6.add(A), QrA(A), {
            revert: function() {
                var q;
                (q = A).elements.forEach(function(K) {
                    return function(Y, z) {
                        var w = null;
                        if (Y.kind === "html" ? w = urA(z) : Y.kind === "class" ? w = mrA(z) : Y.kind === "attribute" ? w = FrA(z, Y.attribute) : Y.kind === "position" && (w = BrA(z)), w) {
                            var H = w.mutations.indexOf(Y);
                            H !== -1 && w.mutations.splice(H, 1), w.mutationRunner(w)
                        }
                    }(q, K)
                }), q.elements.clear(), qy6.delete(q)
            }
        })
    }

    function Ay6(A, q) {
        return Jr1({
            kind: "html",
            elements: new Set,
            mutate: q,
            selector: A
        })
    }

    function xrA(A, q) {
        return Jr1({
            kind: "position",
            elements: new Set,
            mutate: q,
            selector: A
        })
    }

    function SN1(A, q) {
        return Jr1({
            kind: "class",
            elements: new Set,
            mutate: q,
            selector: A
        })
    }

    function wr1(A, q, K) {
        return brA.test(q) ? q === "class" || q === "className" ? SN1(A, function(Y) {
            var z = K(Array.from(Y).join(" "));
            Y.clear(), z && z.split(/\s+/g).filter(Boolean).forEach(function(w) {
                return Y.add(w)
            })
        }) : Jr1({
            kind: "attribute",
            attribute: q,
            elements: new Set,
            mutate: K,
            selector: A
        }) : Ky6
    }
    grA();
    var rFq = {
        html: Ay6,
        classes: SN1,
        attribute: wr1,
        position: xrA,
        declarative: function(A) {
            var {
                selector: q,
                action: K,
                value: Y,
                attribute: z,
                parentSelector: w,
                insertBeforeSelector: H
            } = A;
            if (z === "html") {
                if (K === "append") return Ay6(q, function($) {
                    return $ + (Y != null ? Y : "")
                });
                if (K === "set") return Ay6(q, function() {
                    return Y != null ? Y : ""
                })
            } else if (z === "class") {
                if (K === "append") return SN1(q, function($) {
                    Y && $.add(Y)
                });
                if (K === "remove") return SN1(q, function($) {
                    Y && $.delete(Y)
                });
                if (K === "set") return SN1(q, function($) {
                    $.clear(), Y && $.add(Y)
                })
            } else if (z === "position") {
                if (K === "set" && w) return xrA(q, function() {
                    return {
                        insertBeforeSelector: H,
                        parentSelector: w
                    }
                })
            } else {
                if (K === "append") return wr1(q, z, function($) {
                    return $ !== null ? $ + (Y != null ? Y : "") : Y != null ? Y : ""
                });
                if (K === "set") return wr1(q, z, function() {
                    return Y != null ? Y : ""
                });
                if (K === "remove") return wr1(q, z, function() {
                    return null
                })
            }
            return Ky6
        }
    };
    UrA.connectGlobalObserver = grA, UrA.default = rFq, UrA.disconnectGlobalObserver = function() {
        hN1 && hN1.disconnect()
    }, UrA.validAttributeName = brA
})
// @from(Ln 5766, Col 0)
function Ul(A, q, K) {
    K = K || {};
    for (let [Y, z] of Object.entries(q)) switch (Y) {
        case "$or":
            if (!drA(A, z, K)) return !1;
            break;
        case "$nor":
            if (drA(A, z, K)) return !1;
            break;
        case "$and":
            if (!AQq(A, z, K)) return !1;
            break;
        case "$not":
            if (Ul(A, z, K)) return !1;
            break;
        default:
            if (!IN1(z, oFq(A, Y), K)) return !1
    }
    return !0
}
// @from(Ln 5787, Col 0)
function oFq(A, q) {
    let K = q.split("."),
        Y = A;
    for (let z = 0; z < K.length; z++)
        if (Y && typeof Y === "object" && K[z] in Y) Y = Y[K[z]];
        else return null;
    return Y
}
// @from(Ln 5796, Col 0)
function aFq(A) {
    if (!Yy6[A]) Yy6[A] = new RegExp(A.replace(/([^\\])\//g, "$1\\/"));
    return Yy6[A]
}
// @from(Ln 5801, Col 0)
function IN1(A, q, K) {
    if (typeof A === "string") return q + "" === A;
    if (typeof A === "number") return q * 1 === A;
    if (typeof A === "boolean") return q !== null && !!q === A;
    if (A === null) return q === null;
    if (Array.isArray(A) || !crA(A)) return JSON.stringify(q) === JSON.stringify(A);
    for (let Y in A)
        if (!eFq(Y, q, A[Y], K)) return !1;
    return !0
}
// @from(Ln 5812, Col 0)
function crA(A) {
    let q = Object.keys(A);
    return q.length > 0 && q.filter((K) => K[0] === "$").length === q.length
}
// @from(Ln 5817, Col 0)
function sFq(A) {
    if (A === null) return "null";
    if (Array.isArray(A)) return "array";
    let q = typeof A;
    if (["string", "number", "boolean", "object", "undefined"].includes(q)) return q;
    return "unknown"
}
// @from(Ln 5825, Col 0)
function tFq(A, q, K) {
    if (!Array.isArray(A)) return !1;
    let Y = crA(q) ? (z) => IN1(q, z, K) : (z) => Ul(z, q, K);
    for (let z = 0; z < A.length; z++)
        if (A[z] && Y(A[z])) return !0;
    return !1
}
// @from(Ln 5833, Col 0)
function Xr1(A, q) {
    if (Array.isArray(A)) return A.some((K) => q.includes(K));
    return q.includes(A)
}
// @from(Ln 5838, Col 0)
function eFq(A, q, K, Y) {
    switch (A) {
        case "$veq":
            return JT(q) === JT(K);
        case "$vne":
            return JT(q) !== JT(K);
        case "$vgt":
            return JT(q) > JT(K);
        case "$vgte":
            return JT(q) >= JT(K);
        case "$vlt":
            return JT(q) < JT(K);
        case "$vlte":
            return JT(q) <= JT(K);
        case "$eq":
            return q === K;
        case "$ne":
            return q !== K;
        case "$lt":
            return q < K;
        case "$lte":
            return q <= K;
        case "$gt":
            return q > K;
        case "$gte":
            return q >= K;
        case "$exists":
            return K ? q != null : q == null;
        case "$in":
            if (!Array.isArray(K)) return !1;
            return Xr1(q, K);
        case "$inGroup":
            return Xr1(q, Y[K] || []);
        case "$notInGroup":
            return !Xr1(q, Y[K] || []);
        case "$nin":
            if (!Array.isArray(K)) return !1;
            return !Xr1(q, K);
        case "$not":
            return !IN1(K, q, Y);
        case "$size":
            if (!Array.isArray(q)) return !1;
            return IN1(K, q.length, Y);
        case "$elemMatch":
            return tFq(q, K, Y);
        case "$all":
            if (!Array.isArray(q)) return !1;
            for (let z = 0; z < K.length; z++) {
                let w = !1;
                for (let H = 0; H < q.length; H++)
                    if (IN1(K[z], q[H], Y)) {
                        w = !0;
                        break
                    } if (!w) return !1
            }
            return !0;
        case "$regex":
            try {
                return aFq(K).test(q)
            } catch (z) {
                return !1
            }
        case "$type":
            return sFq(q) === K;
        default:
            return console.error("Unknown operator: " + A), !1
    }
}
// @from(Ln 5907, Col 0)
function drA(A, q, K) {
    if (!q.length) return !0;
    for (let Y = 0; Y < q.length; Y++)
        if (Ul(A, q[Y], K)) return !0;
    return !1
}
// @from(Ln 5914, Col 0)
function AQq(A, q, K) {
    for (let Y = 0; Y < q.length; Y++)
        if (!Ul(A, q[Y], K)) return !1;
    return !0
}
// @from(Ln 5919, Col 4)
Yy6
// @from(Ln 5920, Col 4)
lrA = v(() => {
    yN1();
    Yy6 = {}
})
// @from(Ln 5925, Col 0)
function YQq(A) {
    let q = new Map;
    if (A.global.forcedFeatureValues) A.global.forcedFeatureValues.forEach((K, Y) => q.set(Y, K));
    if (A.user.forcedFeatureValues) A.user.forcedFeatureValues.forEach((K, Y) => q.set(Y, K));
    return q
}
// @from(Ln 5932, Col 0)
function zQq(A) {
    if (A.global.forcedVariations && A.user.forcedVariations) return {
        ...A.global.forcedVariations,
        ...A.user.forcedVariations
    };
    else if (A.global.forcedVariations) return A.global.forcedVariations;
    else if (A.user.forcedVariations) return A.user.forcedVariations;
    else return {}
}
// @from(Ln 5941, Col 0)
async function X21(A) {
    try {
        await A()
    } catch (q) {}
}
// @from(Ln 5947, Col 0)
function irA(A, q, K) {
    if (A.user.trackedExperiments) {
        let z = Mr1(q, K);
        if (A.user.trackedExperiments.has(z)) return [];
        A.user.trackedExperiments.add(z)
    }
    if (A.user.enableDevMode && A.user.devLogs) A.user.devLogs.push({
        experiment: q,
        result: K,
        timestamp: Date.now().toString(),
        logType: "experiment"
    });
    let Y = [];
    if (A.global.trackingCallback) {
        let z = A.global.trackingCallback;
        Y.push(X21(() => z(q, K, A.user)))
    }
    if (A.user.trackingCallback) {
        let z = A.user.trackingCallback;
        Y.push(X21(() => z(q, K)))
    }
    if (A.global.eventLogger) {
        let z = A.global.eventLogger;
        Y.push(X21(() => z(KQq, {
            experimentId: q.key,
            variationId: K.key,
            hashAttribute: K.hashAttribute,
            hashValue: K.hashValue
        }, A.user)))
    }
    return Y
}
// @from(Ln 5980, Col 0)
function wQq(A, q, K) {
    if (A.user.trackedFeatureUsage) {
        let Y = JSON.stringify(K.value);
        if (A.user.trackedFeatureUsage[q] === Y) return;
        if (A.user.trackedFeatureUsage[q] = Y, A.user.enableDevMode && A.user.devLogs) A.user.devLogs.push({
            featureKey: q,
            result: K,
            timestamp: Date.now().toString(),
            logType: "feature"
        })
    }
    if (A.global.onFeatureUsage) {
        let Y = A.global.onFeatureUsage;
        X21(() => Y(q, K, A.user))
    }
    if (A.user.onFeatureUsage) {
        let Y = A.user.onFeatureUsage;
        X21(() => Y(q, K))
    }
    if (A.global.eventLogger) {
        let Y = A.global.eventLogger;
        X21(() => Y(qQq, {
            feature: q,
            source: K.source,
            value: K.value,
            ruleId: K.source === "defaultValue" ? "$default" : K.ruleId || "",
            variationId: K.experimentResult ? K.experimentResult.key : ""
        }, A.user))
    }
}
// @from(Ln 6011, Col 0)
function Dr1(A, q) {
    if (q.stack.evaluatedFeatures.has(A)) return pl(q, A, null, "cyclicPrerequisite");
    q.stack.evaluatedFeatures.add(A), q.stack.id = A;
    let K = YQq(q);
    if (K.has(A)) return pl(q, A, K.get(A), "override");
    if (!q.global.features || !q.global.features[A]) return pl(q, A, null, "unknownFeature");
    let Y = q.global.features[A];
    if (Y.rules) {
        let z = new Set(q.stack.evaluatedFeatures);
        A: for (let w of Y.rules) {
            if (w.parentConditions)
                for (let O of w.parentConditions) {
                    q.stack.evaluatedFeatures = new Set(z);
                    let _ = Dr1(O.id, q);
                    if (_.source === "cyclicPrerequisite") return pl(q, A, null, "cyclicPrerequisite");
                    let J = {
                        value: _.value
                    };
                    if (!Ul(J, O.condition || {})) {
                        if (O.gate) return pl(q, A, null, "prerequisite");
                        continue A
                    }
                }
            if (w.filters && orA(w.filters, q)) continue;
            if ("force" in w) {
                if (w.condition && !rrA(w.condition, q)) continue;
                if (!HQq(q, w.seed || A, w.hashAttribute, q.user.saveStickyBucketAssignmentDoc && !w.disableStickyBucketing ? w.fallbackAttribute : void 0, w.range, w.coverage, w.hashVersion)) continue;
                if (w.tracks) w.tracks.forEach((O) => {
                    if (!irA(q, O.experiment, O.result).length && q.global.saveDeferredTrack) q.global.saveDeferredTrack({
                        experiment: O.experiment,
                        result: O.result
                    })
                });
                return pl(q, A, w.force, "force", w.id)
            }
            if (!w.variations) continue;
            let H = {
                variations: w.variations,
                key: w.key || A
            };
            if ("coverage" in w) H.coverage = w.coverage;
            if (w.weights) H.weights = w.weights;
            if (w.hashAttribute) H.hashAttribute = w.hashAttribute;
            if (w.fallbackAttribute) H.fallbackAttribute = w.fallbackAttribute;
            if (w.disableStickyBucketing) H.disableStickyBucketing = w.disableStickyBucketing;
            if (w.bucketVersion !== void 0) H.bucketVersion = w.bucketVersion;
            if (w.minBucketVersion !== void 0) H.minBucketVersion = w.minBucketVersion;
            if (w.namespace) H.namespace = w.namespace;
            if (w.meta) H.meta = w.meta;
            if (w.ranges) H.ranges = w.ranges;
            if (w.name) H.name = w.name;
            if (w.phase) H.phase = w.phase;
            if (w.seed) H.seed = w.seed;
            if (w.hashVersion) H.hashVersion = w.hashVersion;
            if (w.filters) H.filters = w.filters;
            if (w.condition) H.condition = w.condition;
            let {
                result: $
            } = jr1(H, A, q);
            if (q.global.onExperimentEval && q.global.onExperimentEval(H, $), $.inExperiment && !$.passthrough) return pl(q, A, $.value, "experiment", w.id, H, $)
        }
    }
    return pl(q, A, Y.defaultValue === void 0 ? null : Y.defaultValue, "defaultValue")
}
// @from(Ln 6076, Col 0)
function jr1(A, q, K) {
    let Y = A.key,
        z = A.variations.length;
    if (z < 2) return {
        result: N$(K, A, -1, !1, q)
    };
    if (K.global.enabled === !1 || K.user.enabled === !1) return {
        result: N$(K, A, -1, !1, q)
    };
    if (A = $Qq(A, K), A.urlPatterns && !tn1(K.user.url || "", A.urlPatterns)) return {
        result: N$(K, A, -1, !1, q)
    };
    let w = ZrA(Y, K.user.url || "", z);
    if (w !== null) return {
        result: N$(K, A, w, !1, q)
    };
    let H = zQq(K);
    if (Y in H) {
        let W = H[Y];
        return {
            result: N$(K, A, W, !1, q)
        }
    }
    if (A.status === "draft" || A.active === !1) return {
        result: N$(K, A, -1, !1, q)
    };
    let {
        hashAttribute: $,
        hashValue: O
    } = f61(K, A.hashAttribute, K.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing ? A.fallbackAttribute : void 0);
    if (!O) return {
        result: N$(K, A, -1, !1, q)
    };
    let _ = -1,
        J = !1,
        X = !1;
    if (K.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing) {
        let {
            variation: W,
            versionIsBlocked: G
        } = JQq({
            ctx: K,
            expKey: A.key,
            expBucketVersion: A.bucketVersion,
            expHashAttribute: A.hashAttribute,
            expFallbackAttribute: A.fallbackAttribute,
            expMinBucketVersion: A.minBucketVersion,
            expMeta: A.meta
        });
        J = W >= 0, _ = W, X = !!G
    }
    if (!J) {
        if (A.filters) {
            if (orA(A.filters, K)) return {
                result: N$(K, A, -1, !1, q)
            }
        } else if (A.namespace && !PrA(O, A.namespace)) return {
            result: N$(K, A, -1, !1, q)
        };
        if (A.include && !frA(A.include)) return {
            result: N$(K, A, -1, !1, q)
        };
        if (A.condition && !rrA(A.condition, K)) return {
            result: N$(K, A, -1, !1, q)
        };
        if (A.parentConditions) {
            let W = new Set(K.stack.evaluatedFeatures);
            for (let G of A.parentConditions) {
                K.stack.evaluatedFeatures = new Set(W);
                let f = Dr1(G.id, K);
                if (f.source === "cyclicPrerequisite") return {
                    result: N$(K, A, -1, !1, q)
                };
                let Z = {
                    value: f.value
                };
                if (!Ul(Z, G.condition || {})) return {
                    result: N$(K, A, -1, !1, q)
                }
            }
        }
        if (A.groups && !_Qq(A.groups, K)) return {
            result: N$(K, A, -1, !1, q)
        }
    }
    if (A.url && !OQq(A.url, K)) return {
        result: N$(K, A, -1, !1, q)
    };
    let D = LN1(A.seed || Y, O, A.hashVersion || 1);
    if (D === null) return {
        result: N$(K, A, -1, !1, q)
    };
    if (!J) {
        let W = A.ranges || GrA(z, A.coverage === void 0 ? 1 : A.coverage, A.weights);
        _ = WrA(D, W)
    }
    if (X) return {
        result: N$(K, A, -1, !1, q, void 0, !0)
    };
    if (_ < 0) return {
        result: N$(K, A, -1, !1, q)
    };
    if ("force" in A) return {
        result: N$(K, A, A.force === void 0 ? -1 : A.force, !1, q)
    };
    if (K.global.qaMode || K.user.qaMode) return {
        result: N$(K, A, -1, !1, q)
    };
    if (A.status === "stopped") return {
        result: N$(K, A, -1, !1, q)
    };
    let j = N$(K, A, _, !0, q, D, J);
    if (K.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing) {
        let {
            changed: W,
            key: G,
            doc: f
        } = DQq(K, $, RN1(O), {
            [zy6(A.key, A.bucketVersion)]: j.key
        });
        if (W) K.user.stickyBucketAssignmentDocs = K.user.stickyBucketAssignmentDocs || {}, K.user.stickyBucketAssignmentDocs[G] = f, K.user.saveStickyBucketAssignmentDoc(f)
    }
    let M = irA(K, A, j);
    if (M.length === 0 && K.global.saveDeferredTrack) K.global.saveDeferredTrack({
        experiment: A,
        result: j
    });
    let P = !M.length ? void 0 : M.length === 1 ? M[0] : Promise.all(M).then(() => {});
    return "changeId" in A && A.changeId && K.global.recordChangeId && K.global.recordChangeId(A.changeId), {
        result: j,
        trackingCall: P
    }
}
// @from(Ln 6210, Col 0)
function pl(A, q, K, Y, z, w, H) {
    let $ = {
        value: K,
        on: !!K,
        off: !K,
        source: Y,
        ruleId: z || ""
    };
    if (w) $.experiment = w;
    if (H) $.experimentResult = H;
    if (Y !== "override") wQq(A, q, $);
    return $
}
// @from(Ln 6224, Col 0)
function nrA(A) {
    return {
        ...A.user.attributes,
        ...A.user.attributeOverrides
    }
}
// @from(Ln 6231, Col 0)
function rrA(A, q) {
    return Ul(nrA(q), A, q.global.savedGroups || {})
}
// @from(Ln 6235, Col 0)
function orA(A, q) {
    return A.some((K) => {
        let {
            hashValue: Y
        } = f61(q, K.attribute);
        if (!Y) return !0;
        let z = LN1(K.seed, Y, K.hashVersion || 2);
        if (z === null) return !0;
        return !K.ranges.some((w) => sn1(z, w))
    })
}
// @from(Ln 6247, Col 0)
function HQq(A, q, K, Y, z, w, H) {
    if (!z && w === void 0) return !0;
    if (!z && w === 0) return !1;
    let {
        hashValue: $
    } = f61(A, K, Y);
    if (!$) return !1;
    let O = LN1(q, $, H || 1);
    if (O === null) return !1;
    return z ? sn1(O, z) : w !== void 0 ? O <= w : !0
}
// @from(Ln 6259, Col 0)
function N$(A, q, K, Y, z, w, H) {
    let $ = !0;
    if (K < 0 || K >= q.variations.length) K = 0, $ = !1;
    let {
        hashAttribute: O,
        hashValue: _
    } = f61(A, q.hashAttribute, A.user.saveStickyBucketAssignmentDoc && !q.disableStickyBucketing ? q.fallbackAttribute : void 0), J = q.meta ? q.meta[K] : {}, X = {
        key: J.key || "" + K,
        featureId: z,
        inExperiment: $,
        hashUsed: Y,
        variationId: K,
        value: q.variations[K],
        hashAttribute: O,
        hashValue: _,
        stickyBucketUsed: !!H
    };
    if (J.name) X.name = J.name;
    if (w !== void 0) X.bucket = w;
    if (J.passthrough) X.passthrough = J.passthrough;
    return X
}
// @from(Ln 6282, Col 0)
function $Qq(A, q) {
    let K = A.key,
        Y = q.global.overrides;
    if (Y && Y[K]) {
        if (A = Object.assign({}, A, Y[K]), typeof A.url === "string") A.url = rR6(A.url)
    }
    return A
}
// @from(Ln 6291, Col 0)
function f61(A, q, K) {
    let Y = q || "id",
        z = "",
        w = nrA(A);
    if (w[Y]) z = w[Y];
    if (!z && K) {
        if (w[K]) z = w[K];
        if (z) Y = K
    }
    return {
        hashAttribute: Y,
        hashValue: z
    }
}
// @from(Ln 6306, Col 0)
function OQq(A, q) {
    let K = q.user.url;
    if (!K) return !1;
    let Y = K.replace(/^https?:\/\//, "").replace(/^[^/]*\//, "/");
    if (A.test(K)) return !0;
    if (A.test(Y)) return !0;
    return !1
}
// @from(Ln 6315, Col 0)
function _Qq(A, q) {
    let K = q.global.groups || {};
    for (let Y = 0; Y < A.length; Y++)
        if (K[A[Y]]) return !0;
    return !1
}
// @from(Ln 6322, Col 0)
function JQq(A) {
    let {
        ctx: q,
        expKey: K,
        expBucketVersion: Y,
        expHashAttribute: z,
        expFallbackAttribute: w,
        expMinBucketVersion: H,
        expMeta: $
    } = A;
    Y = Y || 0, H = H || 0, z = z || "id", $ = $ || [];
    let O = zy6(K, Y),
        _ = XQq(q, z, w);
    if (H > 0)
        for (let D = 0; D <= H; D++) {
            let j = zy6(K, D);
            if (_[j] !== void 0) return {
                variation: -1,
                versionIsBlocked: !0
            }
        }
    let J = _[O];
    if (J === void 0) return {
        variation: -1
    };
    let X = $.findIndex((D) => D.key === J);
    if (X < 0) return {
        variation: -1
    };
    return {
        variation: X
    }
}
// @from(Ln 6356, Col 0)
function zy6(A, q) {
    return q = q || 0, `${A}__${q}`
}
// @from(Ln 6360, Col 0)
function wy6(A, q) {
    return `${A}||${q}`
}
// @from(Ln 6364, Col 0)
function XQq(A, q, K) {
    if (!A.user.stickyBucketAssignmentDocs) return {};
    let {
        hashAttribute: Y,
        hashValue: z
    } = f61(A, q), w = wy6(Y, RN1(z)), {
        hashAttribute: H,
        hashValue: $
    } = f61(A, K), O = $ ? wy6(H, RN1($)) : null, _ = {};
    if (O && A.user.stickyBucketAssignmentDocs[O]) Object.assign(_, A.user.stickyBucketAssignmentDocs[O].assignments || {});
    if (A.user.stickyBucketAssignmentDocs[w]) Object.assign(_, A.user.stickyBucketAssignmentDocs[w].assignments || {});
    return _
}
// @from(Ln 6378, Col 0)
function DQq(A, q, K, Y) {
    let z = wy6(q, K),
        w = A.user.stickyBucketAssignmentDocs && A.user.stickyBucketAssignmentDocs[z] ? A.user.stickyBucketAssignmentDocs[z].assignments || {} : {},
        H = {
            ...w,
            ...Y
        },
        $ = JSON.stringify(w) !== JSON.stringify(H);
    return {
        key: z,
        doc: {
            attributeName: q,
            attributeValue: K,
            assignments: H
        },
        changed: $
    }
}
// @from(Ln 6397, Col 0)
function jQq(A, q) {
    let K = new Set,
        Y = q && q.features ? q.features : A.global.features || {},
        z = q && q.experiments ? q.experiments : A.global.experiments || [];
    return Object.keys(Y).forEach((w) => {
        let H = Y[w];
        if (H.rules) {
            for (let $ of H.rules)
                if ($.variations) {
                    if (K.add($.hashAttribute || "id"), $.fallbackAttribute) K.add($.fallbackAttribute)
                }
        }
    }), z.map((w) => {
        if (K.add(w.hashAttribute || "id"), w.fallbackAttribute) K.add(w.fallbackAttribute)
    }), Array.from(K)
}
// @from(Ln 6413, Col 0)
async function arA(A, q, K) {
    let Y = Hy6(A, K);
    return q.getAllAssignments(Y)
}
// @from(Ln 6418, Col 0)
function Hy6(A, q) {
    let K = {};
    return jQq(A, q).forEach((z) => {
        let {
            hashValue: w
        } = f61(A, z);
        K[z] = RN1(w)
    }), K
}
// @from(Ln 6427, Col 0)
async function srA(A, q, K) {
    if (A = {
            ...A
        }, A.encryptedFeatures) {
        try {
            A.features = JSON.parse(await Z61(A.encryptedFeatures, q, K))
        } catch (Y) {
            console.error(Y)
        }
        delete A.encryptedFeatures
    }
    if (A.encryptedExperiments) {
        try {
            A.experiments = JSON.parse(await Z61(A.encryptedExperiments, q, K))
        } catch (Y) {
            console.error(Y)
        }
        delete A.encryptedExperiments
    }
    if (A.encryptedSavedGroups) {
        try {
            A.savedGroups = JSON.parse(await Z61(A.encryptedSavedGroups, q, K))
        } catch (Y) {
            console.error(Y)
        }
        delete A.encryptedSavedGroups
    }
    return A
}
// @from(Ln 6457, Col 0)
function trA(A) {
    let q = A.apiHost || "https://cdn.growthbook.io";
    return {
        apiHost: q.replace(/\/*$/, ""),
        streamingHost: (A.streamingHost || q).replace(/\/*$/, ""),
        apiRequestHeaders: A.apiHostRequestHeaders,
        streamingHostRequestHeaders: A.streamingHostRequestHeaders
    }
}
// @from(Ln 6467, Col 0)
function Mr1(A, q) {
    return q.hashAttribute + q.hashValue + A.key + q.variationId
}
// @from(Ln 6470, Col 4)
qQq = "Feature Evaluated"
// @from(Ln 6471, Col 4)
KQq = "Experiment Viewed"
// @from(Ln 6472, Col 4)
erA = v(() => {
    lrA();
    yN1()
})
// @from(Ln 6476, Col 0)
class Pr1 {
    constructor(A) {
        if (A = A || {}, this.version = MQq, this._options = this.context = A, this._renderer = A.renderer || null, this._trackedExperiments = new Set, this._completedChangeIds = new Set, this._trackedFeatures = {}, this.debug = !!A.debug, this._subscriptions = new Set, this.ready = !1, this._assigned = new Map, this._activeAutoExperiments = new Map, this._triggeredExpKeys = new Set, this._initialized = !1, this._redirectedUrl = "", this._deferredTrackingCalls = new Map, this._autoExperimentsAllowed = !A.disableExperimentsOnLoad, this._destroyCallbacks = [], this.logs = [], this.log = this.log.bind(this), this._saveDeferredTrack = this._saveDeferredTrack.bind(this), this._fireSubscriptions = this._fireSubscriptions.bind(this), this._recordChangedId = this._recordChangedId.bind(this), A.remoteEval) {
            if (A.decryptionKey) throw Error("Encryption is not available for remoteEval");
            if (!A.clientKey) throw Error("Missing clientKey");
            let q = !1;
            try {
                q = !!new URL(A.apiHost || "").hostname.match(/growthbook\.io$/i)
            } catch (K) {}
            if (q) throw Error("Cannot use remoteEval on GrowthBook Cloud")
        } else if (A.cacheKeyAttributes) throw Error("cacheKeyAttributes are only used for remoteEval");
        if (A.stickyBucketService) {
            let q = A.stickyBucketService;
            this._saveStickyBucketAssignmentDoc = (K) => {
                return q.saveAssignments(K)
            }
        }
        if (A.plugins)
            for (let q of A.plugins) q(this);
        if (A.features) this.ready = !0;
        if (D21 && A.enableDevMode) window._growthbook = this, document.dispatchEvent(new Event("gbloaded"));
        if (A.experiments) this.ready = !0, this._updateAllAutoExperiments();
        if (this._options.stickyBucketService && this._options.stickyBucketAssignmentDocs)
            for (let q in this._options.stickyBucketAssignmentDocs) {
                let K = this._options.stickyBucketAssignmentDocs[q];
                if (K) this._options.stickyBucketService.saveAssignments(K).catch(() => {})
            }
        if (this.ready) this.refreshStickyBuckets(this.getPayload())
    }
    async setPayload(A) {
        this._payload = A;
        let q = await srA(A, this._options.decryptionKey);
        if (this._decryptedPayload = q, await this.refreshStickyBuckets(q), q.features) this._options.features = q.features;
        if (q.savedGroups) this._options.savedGroups = q.savedGroups;
        if (q.experiments) this._options.experiments = q.experiments, this._updateAllAutoExperiments();
        this.ready = !0, this._render()
    }
    initSync(A) {
        this._initialized = !0;
        let q = A.payload;
        if (q.encryptedExperiments || q.encryptedFeatures) throw Error("initSync does not support encrypted payloads");
        if (this._options.stickyBucketService && !this._options.stickyBucketAssignmentDocs) this._options.stickyBucketAssignmentDocs = this.generateStickyBucketAssignmentDocsSync(this._options.stickyBucketService, q);
        if (this._payload = q, this._decryptedPayload = q, q.features) this._options.features = q.features;
        if (q.experiments) this._options.experiments = q.experiments, this._updateAllAutoExperiments();
        return this.ready = !0, Kr1(this, A), this
    }
    async init(A) {
        if (this._initialized = !0, A = A || {}, A.cacheSettings) ErA(A.cacheSettings);
        if (A.payload) return await this.setPayload(A.payload), Kr1(this, A), {
            success: !0,
            source: "init"
        };
        else {
            let {
                data: q,
                ...K
            } = await this._refresh({
                ...A,
                allowStale: !0
            });
            return Kr1(this, A), await this.setPayload(q || {}), K
        }
    }
    async loadFeatures(A) {
        A = A || {}, await this.init({
            skipCache: A.skipCache,
            timeout: A.timeout,
            streaming: (this._options.backgroundSync ?? !0) && (A.autoRefresh || this._options.subscribeToChanges)
        })
    }
    async refreshFeatures(A) {
        let q = await this._refresh({
            ...A || {},
            allowStale: !1
        });
        if (q.data) await this.setPayload(q.data)
    }
    getApiInfo() {
        return [this.getApiHosts().apiHost, this.getClientKey()]
    }
    getApiHosts() {
        return trA(this._options)
    }
    getClientKey() {
        return this._options.clientKey || ""
    }
    getPayload() {
        return this._payload || {
            features: this.getFeatures(),
            experiments: this.getExperiments()
        }
    }
    getDecryptedPayload() {
        return this._decryptedPayload || this.getPayload()
    }
    isRemoteEval() {
        return this._options.remoteEval || !1
    }
    getCacheKeyAttributes() {
        return this._options.cacheKeyAttributes
    }
    async _refresh(A) {
        let {
            timeout: q,
            skipCache: K,
            allowStale: Y,
            streaming: z
        } = A;
        if (!this._options.clientKey) throw Error("Missing clientKey");
        return krA({
            instance: this,
            timeout: q,
            skipCache: K || this._options.disableCache,
            allowStale: Y,
            backgroundSync: z ?? this._options.backgroundSync ?? !0
        })
    }
    _render() {
        if (this._renderer) try {
            this._renderer()
        } catch (A) {
            console.error("Failed to render", A)
        }
    }
    setFeatures(A) {
        this._options.features = A, this.ready = !0, this._render()
    }
    async setEncryptedFeatures(A, q, K) {
        let Y = await Z61(A, q || this._options.decryptionKey, K);
        this.setFeatures(JSON.parse(Y))
    }
    setExperiments(A) {
        this._options.experiments = A, this.ready = !0, this._updateAllAutoExperiments()
    }
    async setEncryptedExperiments(A, q, K) {
        let Y = await Z61(A, q || this._options.decryptionKey, K);
        this.setExperiments(JSON.parse(Y))
    }
    async setAttributes(A) {
        if (this._options.attributes = A, this._options.stickyBucketService) await this.refreshStickyBuckets();
        if (this._options.remoteEval) {
            await this._refreshForRemoteEval();
            return
        }
        this._render(), this._updateAllAutoExperiments()
    }
    async updateAttributes(A) {
        return this.setAttributes({
            ...this._options.attributes,
            ...A
        })
    }
    async setAttributeOverrides(A) {
        if (this._options.attributeOverrides = A, this._options.stickyBucketService) await this.refreshStickyBuckets();
        if (this._options.remoteEval) {
            await this._refreshForRemoteEval();
            return
        }
        this._render(), this._updateAllAutoExperiments()
    }
    async setForcedVariations(A) {
        if (this._options.forcedVariations = A || {}, this._options.remoteEval) {
            await this._refreshForRemoteEval();
            return
        }
        this._render(), this._updateAllAutoExperiments()
    }
    setForcedFeatures(A) {
        this._options.forcedFeatureValues = A, this._render()
    }
    async setURL(A) {
        if (A === this._options.url) return;
        if (this._options.url = A, this._redirectedUrl = "", this._options.remoteEval) {
            await this._refreshForRemoteEval(), this._updateAllAutoExperiments(!0);
            return
        }
        this._updateAllAutoExperiments(!0)
    }
    getAttributes() {
        return {
            ...this._options.attributes,
            ...this._options.attributeOverrides
        }
    }
    getForcedVariations() {
        return this._options.forcedVariations || {}
    }
    getForcedFeatures() {
        return this._options.forcedFeatureValues || new Map
    }
    getStickyBucketAssignmentDocs() {
        return this._options.stickyBucketAssignmentDocs || {}
    }
    getUrl() {
        return this._options.url || ""
    }
    getFeatures() {
        return this._options.features || {}
    }
    getExperiments() {
        return this._options.experiments || []
    }
    getCompletedChangeIds() {
        return Array.from(this._completedChangeIds)
    }
    subscribe(A) {
        return this._subscriptions.add(A), () => {
            this._subscriptions.delete(A)
        }
    }
    async _refreshForRemoteEval() {
        if (!this._options.remoteEval) return;
        if (!this._initialized) return;
        let A = await this._refresh({
            allowStale: !1
        });
        if (A.data) await this.setPayload(A.data)
    }
    getAllResults() {
        return new Map(this._assigned)
    }
    onDestroy(A) {
        this._destroyCallbacks.push(A)
    }
    isDestroyed() {
        return !!this._destroyed
    }
    destroy() {
        if (this._destroyed = !0, this._destroyCallbacks.forEach((A) => {
                try {
                    A()
                } catch (q) {
                    console.error(q)
                }
            }), this._subscriptions.clear(), this._assigned.clear(), this._trackedExperiments.clear(), this._completedChangeIds.clear(), this._deferredTrackingCalls.clear(), this._trackedFeatures = {}, this._destroyCallbacks = [], this._payload = void 0, this._saveStickyBucketAssignmentDoc = void 0, LrA(this), this.logs = [], D21 && window._growthbook === this) delete window._growthbook;
        this._activeAutoExperiments.forEach((A) => {
            A.undo()
        }), this._activeAutoExperiments.clear(), this._triggeredExpKeys.clear()
    }
    setRenderer(A) {
        this._renderer = A
    }
    forceVariation(A, q) {
        if (this._options.forcedVariations = this._options.forcedVariations || {}, this._options.forcedVariations[A] = q, this._options.remoteEval) {
            this._refreshForRemoteEval();
            return
        }
        this._updateAllAutoExperiments(), this._render()
    }
    run(A) {
        let {
            result: q
        } = jr1(A, null, this._getEvalContext());
        return this._fireSubscriptions(A, q), q
    }
    triggerExperiment(A) {
        if (this._triggeredExpKeys.add(A), !this._options.experiments) return null;
        return this._options.experiments.filter((K) => K.key === A).map((K) => {
            return this._runAutoExperiment(K)
        }).filter((K) => K !== null)
    }
    triggerAutoExperiments() {
        this._autoExperimentsAllowed = !0, this._updateAllAutoExperiments(!0)
    }
    _getEvalContext() {
        return {
            user: this._getUserContext(),
            global: this._getGlobalContext(),
            stack: {
                evaluatedFeatures: new Set
            }
        }
    }
    _getUserContext() {
        return {
            attributes: this._options.user ? {
                ...this._options.user,
                ...this._options.attributes
            } : this._options.attributes,
            enableDevMode: this._options.enableDevMode,
            blockedChangeIds: this._options.blockedChangeIds,
            stickyBucketAssignmentDocs: this._options.stickyBucketAssignmentDocs,
            url: this._getContextUrl(),
            forcedVariations: this._options.forcedVariations,
            forcedFeatureValues: this._options.forcedFeatureValues,
            attributeOverrides: this._options.attributeOverrides,
            saveStickyBucketAssignmentDoc: this._saveStickyBucketAssignmentDoc,
            trackingCallback: this._options.trackingCallback,
            onFeatureUsage: this._options.onFeatureUsage,
            devLogs: this.logs,
            trackedExperiments: this._trackedExperiments,
            trackedFeatureUsage: this._trackedFeatures
        }
    }
    _getGlobalContext() {
        return {
            features: this._options.features,
            experiments: this._options.experiments,
            log: this.log,
            enabled: this._options.enabled,
            qaMode: this._options.qaMode,
            savedGroups: this._options.savedGroups,
            groups: this._options.groups,
            overrides: this._options.overrides,
            onExperimentEval: this._subscriptions.size > 0 ? this._fireSubscriptions : void 0,
            recordChangeId: this._recordChangedId,
            saveDeferredTrack: this._saveDeferredTrack,
            eventLogger: this._options.eventLogger
        }
    }
    _runAutoExperiment(A, q) {
        let K = this._activeAutoExperiments.get(A);
        if (A.manual && !this._triggeredExpKeys.has(A.key) && !K) return null;
        let Y = this._isAutoExperimentBlockedByContext(A),
            z, w;
        if (Y) z = N$(this._getEvalContext(), A, -1, !1, "");
        else({
            result: z,
            trackingCall: w
        } = jr1(A, null, this._getEvalContext())), this._fireSubscriptions(A, z);
        let H = JSON.stringify(z.value);
        if (!q && z.inExperiment && K && K.valueHash === H) return z;
        if (K) this._undoActiveAutoExperiment(A);
        if (z.inExperiment) {
            let $ = en1(A);
            if ($ === "redirect" && z.value.urlRedirect && A.urlPatterns) {
                let O = A.persistQueryString ? NrA(this._getContextUrl(), z.value.urlRedirect) : z.value.urlRedirect;
                if (tn1(O, A.urlPatterns)) return this.log("Skipping redirect because original URL matches redirect URL", {
                    id: A.key
                }), z;
                this._redirectedUrl = O;
                let {
                    navigate: _,
                    delay: J
                } = this._getNavigateFunction();
                if (_)
                    if (D21) Promise.all([...w ? [Ar1(w, this._options.maxNavigateDelay ?? 1000)] : [], new Promise((X) => window.setTimeout(X, this._options.navigateDelay ?? J))]).then(() => {
                        try {
                            _(O)
                        } catch (X) {
                            console.error(X)
                        }
                    });
                    else try {
                        _(O)
                    } catch (X) {
                        console.error(X)
                    }
            } else if ($ === "visual") {
                let O = this._options.applyDomChangesCallback ? this._options.applyDomChangesCallback(z.value) : this._applyDOMChanges(z.value);
                if (O) this._activeAutoExperiments.set(A, {
                    undo: O,
                    valueHash: H
                })
            }
        }
        return z
    }
    _undoActiveAutoExperiment(A) {
        let q = this._activeAutoExperiments.get(A);
        if (q) q.undo(), this._activeAutoExperiments.delete(A)
    }
    _updateAllAutoExperiments(A) {
        if (!this._autoExperimentsAllowed) return;
        let q = this._options.experiments || [],
            K = new Set(q);
        this._activeAutoExperiments.forEach((Y, z) => {
            if (!K.has(z)) Y.undo(), this._activeAutoExperiments.delete(z)
        });
        for (let Y of q) {
            let z = this._runAutoExperiment(Y, A);
            if (z !== null && z !== void 0 && z.inExperiment && en1(Y) === "redirect") break
        }
    }
    _fireSubscriptions(A, q) {
        let K = A.key,
            Y = this._assigned.get(K);
        if (!Y || Y.result.inExperiment !== q.inExperiment || Y.result.variationId !== q.variationId) this._assigned.set(K, {
            experiment: A,
            result: q
        }), this._subscriptions.forEach((z) => {
            try {
                z(A, q)
            } catch (w) {
                console.error(w)
            }
        })
    }
    _recordChangedId(A) {
        this._completedChangeIds.add(A)
    }
    isOn(A) {
        return this.evalFeature(A).on
    }
    isOff(A) {
        return this.evalFeature(A).off
    }
    getFeatureValue(A, q) {
        let K = this.evalFeature(A).value;
        return K === null ? q : K
    }
    feature(A) {
        return this.evalFeature(A)
    }
    evalFeature(A) {
        return Dr1(A, this._getEvalContext())
    }
    log(A, q) {
        if (!this.debug) return;
        if (this._options.log) this._options.log(A, q);
        else console.log(A, q)
    }
    getDeferredTrackingCalls() {
        return Array.from(this._deferredTrackingCalls.values())
    }
    setDeferredTrackingCalls(A) {
        this._deferredTrackingCalls = new Map(A.filter((q) => q && q.experiment && q.result).map((q) => {
            return [Mr1(q.experiment, q.result), q]
        }))
    }
    async fireDeferredTrackingCalls() {
        if (!this._options.trackingCallback) return;
        let A = [];
        this._deferredTrackingCalls.forEach((q) => {
            if (!q || !q.experiment || !q.result) console.error("Invalid deferred tracking call", {
                call: q
            });
            else A.push(this._options.trackingCallback(q.experiment, q.result))
        }), this._deferredTrackingCalls.clear(), await Promise.all(A)
    }
    setTrackingCallback(A) {
        this._options.trackingCallback = A, this.fireDeferredTrackingCalls()
    }
    setEventLogger(A) {
        this._options.eventLogger = A
    }
    async logEvent(A, q) {
        if (this._destroyed) {
            console.error("Cannot log event to destroyed GrowthBook instance");
            return
        }
        if (this._options.enableDevMode) this.logs.push({
            eventName: A,
            properties: q,
            timestamp: Date.now().toString(),
            logType: "event"
        });
        if (this._options.eventLogger) try {
            await this._options.eventLogger(A, q || {}, this._getUserContext())
        } catch (K) {
            console.error(K)
        } else console.error("No event logger configured")
    }
    _saveDeferredTrack(A) {
        this._deferredTrackingCalls.set(Mr1(A.experiment, A.result), A)
    }
    _getContextUrl() {
        return this._options.url || (D21 ? window.location.href : "")
    }
    _isAutoExperimentBlockedByContext(A) {
        let q = en1(A);
        if (q === "visual") {
            if (this._options.disableVisualExperiments) return !0;
            if (this._options.disableJsInjection) {
                if (A.variations.some((K) => K.js)) return !0
            }
        } else if (q === "redirect") {
            if (this._options.disableUrlRedirectExperiments) return !0;
            try {
                let K = new URL(this._getContextUrl());
                for (let Y of A.variations) {
                    if (!Y || !Y.urlRedirect) continue;
                    let z = new URL(Y.urlRedirect);
                    if (this._options.disableCrossOriginUrlRedirectExperiments) {
                        if (z.protocol !== K.protocol) return !0;
                        if (z.host !== K.host) return !0
                    }
                }
            } catch (K) {
                return this.log("Error parsing current or redirect URL", {
                    id: A.key,
                    error: K
                }), !0
            }
        } else return !0;
        if (A.changeId && (this._options.blockedChangeIds || []).includes(A.changeId)) return !0;
        return !1
    }
    getRedirectUrl() {
        return this._redirectedUrl
    }
    _getNavigateFunction() {
        if (this._options.navigate) return {
            navigate: this._options.navigate,
            delay: 0
        };
        else if (D21) return {
            navigate: (A) => {
                window.location.replace(A)
            },
            delay: 100
        };
        return {
            navigate: null,
            delay: 0
        }
    }
    _applyDOMChanges(A) {
        if (!D21) return;
        let q = [];
        if (A.css) {
            let K = document.createElement("style");
            K.innerHTML = A.css, document.head.appendChild(K), q.push(() => K.remove())
        }
        if (A.js) {
            let K = document.createElement("script");
            if (K.innerHTML = A.js, this._options.jsInjectionNonce) K.nonce = this._options.jsInjectionNonce;
            document.head.appendChild(K), q.push(() => K.remove())
        }
        if (A.domMutations) A.domMutations.forEach((K) => {
            q.push(AoA.default.declarative(K).revert)
        });
        return () => {
            q.forEach((K) => K())
        }
    }
    async refreshStickyBuckets(A) {
        if (this._options.stickyBucketService) {
            let q = this._getEvalContext(),
                K = await arA(q, this._options.stickyBucketService, A);
            this._options.stickyBucketAssignmentDocs = K
        }
    }
    generateStickyBucketAssignmentDocsSync(A, q) {
        if (!("getAllAssignmentsSync" in A)) {
            console.error("generating StickyBucketAssignmentDocs docs requires StickyBucketServiceSync");
            return
        }
        let K = this._getEvalContext(),
            Y = Hy6(K, q);
        return A.getAllAssignmentsSync(Y)
    }
    inDevMode() {
        return !!this._options.enableDevMode
    }
}
// @from(Ln 7022, Col 4)
AoA
// @from(Ln 7022, Col 9)
D21
// @from(Ln 7022, Col 14)
MQq
// @from(Ln 7023, Col 4)
qoA = v(() => {
    yN1();
    SrA();
    erA();
    AoA = o(prA(), 1), D21 = typeof window < "u" && typeof document < "u", MQq = VrA()
})
// @from(Ln 7029, Col 4)
KoA = v(() => {
    qoA()
})
// @from(Ln 7032, Col 4)
YoA = "sdk-zAZezfDKGoZuXXKe"
// @from(Ln 7033, Col 4)
zoA = v(() => {
    hA()
})
// @from(Ln 7036, Col 4)
W2 = R((woA) => {
    Object.defineProperty(woA, "__esModule", {
        value: !0
    });
    woA.isFunction = void 0;

    function PQq(A) {
        return typeof A === "function"
    }
    woA.isFunction = PQq
})
// @from(Ln 7047, Col 4)
dl = R(($oA) => {
    Object.defineProperty($oA, "__esModule", {
        value: !0
    });
    $oA.createErrorClass = void 0;

    function WQq(A) {
        var q = function(Y) {
                Error.call(Y), Y.stack = Error().stack
            },
            K = A(q);
        return K.prototype = Object.create(Error.prototype), K.prototype.constructor = K, K
    }
    $oA.createErrorClass = WQq
})
// @from(Ln 7062, Col 4)
$y6 = R((_oA) => {
    Object.defineProperty(_oA, "__esModule", {
        value: !0
    });
    _oA.UnsubscriptionError = void 0;
    var GQq = dl();
    _oA.UnsubscriptionError = GQq.createErrorClass(function(A) {
        return function(K) {
            A(this), this.message = K ? K.length + ` errors occurred during unsubscription:
` + K.map(function(Y, z) {
                return z + 1 + ") " + Y.toString()
            }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = K
        }
    })
})
// @from(Ln 7078, Col 4)
XQ = R((XoA) => {
    Object.defineProperty(XoA, "__esModule", {
        value: !0
    });
    XoA.arrRemove = void 0;

    function ZQq(A, q) {
        if (A) {
            var K = A.indexOf(q);
            0 <= K && A.splice(K, 1)
        }
    }
    XoA.arrRemove = ZQq
})