
// @from(Ln 462380, Col 4)
ZUK = p((MpY) => {
    var JpY = d6("fs"),
        XpY = WUK().PNG,
        O27 = L_8();
    MpY.render = function(K, _) {
        let z = O27.getOptions(_),
            Y = z.rendererOpts,
            A = O27.getImageWidth(K.modules.size, z);
        Y.width = A, Y.height = A;
        let O = new XpY(Y);
        return O27.qrToImageData(O.data, K, z), O
    };
    MpY.renderToDataURL = function(K, _, z) {
        if (typeof z > "u") z = _, _ = void 0;
        MpY.renderToBuffer(K, _, function(Y, A) {
            if (Y) z(Y);
            let O = "data:image/png;base64,";
            O += A.toString("base64"), z(null, O)
        })
    };
    MpY.renderToBuffer = function(K, _, z) {
        if (typeof z > "u") z = _, _ = void 0;
        let Y = MpY.render(K, _),
            A = [];
        Y.on("error", z), Y.on("data", function(O) {
            A.push(O)
        }), Y.on("end", function() {
            z(null, Buffer.concat(A))
        }), Y.pack()
    };
    MpY.renderToFile = function(K, _, z, Y) {
        if (typeof Y > "u") Y = z, z = void 0;
        let A = !1,
            O = (...$) => {
                if (A) return;
                A = !0, Y.apply(null, $)
            },
            w = JpY.createWriteStream(K);
        w.on("error", O), w.on("close", O), MpY.renderToFileStream(w, _, z)
    };
    MpY.renderToFileStream = function(K, _, z) {
        MpY.render(_, z).pack().pipe(K)
    }
})
// @from(Ln 462424, Col 4)
GUK = p((VpY) => {
    var fpY = L_8(),
        GpY = {
            WW: " ",
            WB: "▄",
            BB: "█",
            BW: "▀"
        },
        vpY = {
            BB: " ",
            BW: "▄",
            WW: "█",
            WB: "▀"
        };

    function TpY(q, K, _) {
        if (q && K) return _.BB;
        if (q && !K) return _.BW;
        if (!q && K) return _.WB;
        return _.WW
    }
    VpY.render = function(q, K, _) {
        let z = fpY.getOptions(K),
            Y = GpY;
        if (z.color.dark.hex === "#ffffff" || z.color.light.hex === "#000000") Y = vpY;
        let A = q.modules.size,
            O = q.modules.data,
            w = "",
            $ = Array(A + z.margin * 2 + 1).join(Y.WW);
        $ = Array(z.margin / 2 + 1).join($ + `
`);
        let j = Array(z.margin + 1).join(Y.WW);
        w += $;
        for (let H = 0; H < A; H += 2) {
            w += j;
            for (let J = 0; J < A; J++) {
                let X = O[H * A + J],
                    M = O[(H + 1) * A + J];
                w += TpY(X, M, Y)
            }
            w += j + `
`
        }
        if (w += $.slice(0, -1), typeof _ === "function") _(null, w);
        return w
    };
    VpY.renderToFile = function(K, _, z, Y) {
        if (typeof Y > "u") Y = z, z = void 0;
        let A = d6("fs"),
            O = VpY.render(_, z);
        A.writeFile(K, O, Y)
    }
})
// @from(Ln 462477, Col 4)
vUK = p((NpY) => {
    NpY.render = function(q, K, _) {
        let z = q.modules.size,
            Y = q.modules.data,
            A = "\x1B[40m  \x1B[0m",
            O = "\x1B[47m  \x1B[0m",
            w = "",
            $ = Array(z + 3).join("\x1B[47m  \x1B[0m"),
            j = Array(2).join("\x1B[47m  \x1B[0m");
        w += $ + `
`;
        for (let H = 0; H < z; ++H) {
            w += "\x1B[47m  \x1B[0m";
            for (let J = 0; J < z; J++) w += Y[H * z + J] ? "\x1B[40m  \x1B[0m" : "\x1B[47m  \x1B[0m";
            w += j + `
`
        }
        if (w += $ + `
`, typeof _ === "function") _(null, w);
        return w
    }
})
// @from(Ln 462499, Col 4)
kUK = p((RpY) => {
    var ypY = "\x1B[47m\x1B[30m",
        LpY = "\x1B[40m\x1B[37m",
        hpY = function(q, K, _) {
            return {
                "00": "\x1B[0m " + q,
                "01": "\x1B[0m" + K + "▄" + q,
                "02": "\x1B[0m" + _ + "▄" + q,
                10: "\x1B[0m" + K + "▀" + q,
                11: " ",
                12: "▄",
                20: "\x1B[0m" + _ + "▀" + q,
                21: "▀",
                22: "█"
            }
        },
        TUK = function(q, K, _, z) {
            let Y = K + 1;
            if (_ >= Y || z >= Y || z < -1 || _ < -1) return "0";
            if (_ >= K || z >= K || z < 0 || _ < 0) return "1";
            let A = z * K + _;
            return q[A] ? "2" : "1"
        },
        VUK = function(q, K, _, z) {
            return TUK(q, K, _, z) + TUK(q, K, _, z + 1)
        };
    RpY.render = function(q, K, _) {
        let z = q.modules.size,
            Y = q.modules.data,
            A = !!(K && K.inverse),
            O = K && K.inverse ? LpY : ypY,
            j = hpY(O, A ? "\x1B[30m" : "\x1B[37m", A ? "\x1B[37m" : "\x1B[30m"),
            H = `\x1B[0m
` + O,
            J = O;
        for (let X = -1; X < z + 1; X += 2) {
            for (let M = -1; M < z; M++) J += j[VUK(Y, z, M, X)];
            J += j[VUK(Y, z, z, X)] + H
        }
        if (J += "\x1B[0m", typeof _ === "function") _(null, J);
        return J
    }
})
// @from(Ln 462542, Col 4)
NUK = p((IpY) => {
    var CpY = vUK(),
        bpY = kUK();
    IpY.render = function(q, K, _) {
        if (K && K.small) return bpY.render(q, K, _);
        return CpY.render(q, K, _)
    }
})
// @from(Ln 462550, Col 4)
j27 = p((BpY) => {
    var upY = L_8();

    function EUK(q, K) {
        let _ = q.a / 255,
            z = K + '="' + q.hex + '"';
        return _ < 1 ? z + " " + K + '-opacity="' + _.toFixed(2).slice(1) + '"' : z
    }

    function $27(q, K, _) {
        let z = q + K;
        if (typeof _ < "u") z += " " + _;
        return z
    }

    function mpY(q, K, _) {
        let z = "",
            Y = 0,
            A = !1,
            O = 0;
        for (let w = 0; w < q.length; w++) {
            let $ = Math.floor(w % K),
                j = Math.floor(w / K);
            if (!$ && !A) A = !0;
            if (q[w]) {
                if (O++, !(w > 0 && $ > 0 && q[w - 1])) z += A ? $27("M", $ + _, 0.5 + j + _) : $27("m", Y, 0), Y = 0, A = !1;
                if (!($ + 1 < K && q[w + 1])) z += $27("h", O), O = 0
            } else Y++
        }
        return z
    }
    BpY.render = function(K, _, z) {
        let Y = upY.getOptions(_),
            A = K.modules.size,
            O = K.modules.data,
            w = A + Y.margin * 2,
            $ = !Y.color.light.a ? "" : "<path " + EUK(Y.color.light, "fill") + ' d="M0 0h' + w + "v" + w + 'H0z"/>',
            j = "<path " + EUK(Y.color.dark, "stroke") + ' d="' + mpY(O, A, Y.margin) + '"/>',
            H = 'viewBox="0 0 ' + w + " " + w + '"',
            X = '<svg xmlns="http://www.w3.org/2000/svg" ' + (!Y.width ? "" : 'width="' + Y.width + '" height="' + Y.width + '" ') + H + ' shape-rendering="crispEdges">' + $ + j + `</svg>
`;
        if (typeof z === "function") z(null, X);
        return X
    }
})
// @from(Ln 462595, Col 4)
LUK = p((gpY) => {
    var FpY = j27();
    gpY.render = FpY.render;
    gpY.renderToFile = function(K, _, z, Y) {
        if (typeof Y > "u") Y = z, z = void 0;
        let A = d6("fs"),
            w = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + gpY.render(_, z);
        A.writeFile(K, w, Y)
    }
})
// @from(Ln 462605, Col 4)
RUK = p((cpY) => {
    var H27 = L_8();

    function QpY(q, K, _) {
        if (q.clearRect(0, 0, K.width, K.height), !K.style) K.style = {};
        K.height = _, K.width = _, K.style.height = _ + "px", K.style.width = _ + "px"
    }

    function dpY() {
        try {
            return document.createElement("canvas")
        } catch (q) {
            throw Error("You need to specify a canvas element")
        }
    }
    cpY.render = function(K, _, z) {
        let Y = z,
            A = _;
        if (typeof Y > "u" && (!_ || !_.getContext)) Y = _, _ = void 0;
        if (!_) A = dpY();
        Y = H27.getOptions(Y);
        let O = H27.getImageWidth(K.modules.size, Y),
            w = A.getContext("2d"),
            $ = w.createImageData(O, O);
        return H27.qrToImageData($.data, K, Y), QpY(w, A, O), w.putImageData($, 0, 0), A
    };
    cpY.renderToDataURL = function(K, _, z) {
        let Y = z;
        if (typeof Y > "u" && (!_ || !_.getContext)) Y = _, _ = void 0;
        if (!Y) Y = {};
        let A = cpY.render(K, _, Y),
            O = Y.type || "image/png",
            w = Y.rendererOpts || {};
        return A.toDataURL(O, w.quality)
    }
})
// @from(Ln 462641, Col 4)
CUK = p((rpY) => {
    var npY = Tw7(),
        J27 = lw7(),
        SUK = RUK(),
        ipY = j27();

    function X27(q, K, _, z, Y) {
        let A = [].slice.call(arguments, 1),
            O = A.length,
            w = typeof A[O - 1] === "function";
        if (!w && !npY()) throw Error("Callback required as last argument");
        if (w) {
            if (O < 2) throw Error("Too few arguments provided");
            if (O === 2) Y = _, _ = K, K = z = void 0;
            else if (O === 3)
                if (K.getContext && typeof Y > "u") Y = z, z = void 0;
                else Y = z, z = _, _ = K, K = void 0
        } else {
            if (O < 1) throw Error("Too few arguments provided");
            if (O === 1) _ = K, K = z = void 0;
            else if (O === 2 && !K.getContext) z = _, _ = K, K = void 0;
            return new Promise(function($, j) {
                try {
                    let H = J27.create(_, z);
                    $(q(H, K, z))
                } catch (H) {
                    j(H)
                }
            })
        }
        try {
            let $ = J27.create(_, z);
            Y(null, q($, K, z))
        } catch ($) {
            Y($)
        }
    }
    rpY.create = J27.create;
    rpY.toCanvas = X27.bind(null, SUK.render);
    rpY.toDataURL = X27.bind(null, SUK.renderToDataURL);
    rpY.toString = X27.bind(null, function(q, K, _) {
        return ipY.render(q, _)
    })
})
// @from(Ln 462686, Col 0)
function zFY(q, K, _) {
    if (typeof q > "u") throw Error("String required as first argument");
    if (typeof _ > "u") _ = K, K = {};
    if (typeof _ !== "function")
        if (!epY()) throw Error("Callback required as last argument");
        else K = _ || {}, _ = null;
    return {
        opts: K,
        cb: _
    }
}
// @from(Ln 462698, Col 0)
function YFY(q) {
    switch (q) {
        case "svg":
            return _FY;
        case "terminal":
            return KFY;
        case "utf8":
        default:
            return qFY
    }
}
// @from(Ln 462710, Col 0)
function AFY(q, K, _) {
    if (!_.cb) return new Promise(function(z, Y) {
        try {
            let A = M27.create(K, _.opts);
            return q(A, _.opts, function(O, w) {
                return O ? Y(O) : z(w)
            })
        } catch (A) {
            Y(A)
        }
    });
    try {
        let z = M27.create(K, _.opts);
        return q(z, _.opts, _.cb)
    } catch (z) {
        _.cb(z)
    }
}
// @from(Ln 462728, Col 4)
epY
// @from(Ln 462728, Col 9)
M27
// @from(Ln 462728, Col 14)
tqj
// @from(Ln 462728, Col 19)
qFY
// @from(Ln 462728, Col 24)
KFY
// @from(Ln 462728, Col 29)
_FY
// @from(Ln 462728, Col 34)
OFY
// @from(Ln 462728, Col 39)
wFY
// @from(Ln 462728, Col 44)
yu = function(K, _, z) {
    let Y = zFY(K, _, z),
        A = Y.opts ? Y.opts.type : void 0,
        O = YFY(A);
    return AFY(O.render, K, Y)
}
// @from(Ln 462734, Col 4)
lx6 = L(() => {
    epY = Tw7(), M27 = lw7(), tqj = ZUK(), qFY = GUK(), KFY = NUK(), _FY = LUK();
    OFY = M27.create, wFY = CUK().toCanvas
})
// @from(Ln 462738, Col 4)
bUK = {}
// @from(Ln 462743, Col 0)
function $FY(q) {
    let K = s(52),
        {
            onDone: _
        } = q,
        [z, Y] = h_8.useState("ios"),
        A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = {
        ios: "",
        android: ""
    }, K[0] = A;
    else A = K[0];
    let [O, w] = h_8.useState(A), {
        url: $
    } = P27[z], j = O[z], H, J;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) H = () => {
        (async function() {
            let [$6, H6] = await Promise.all([yu(P27.ios.url, {
                type: "utf8",
                errorCorrectionLevel: "L"
            }), yu(P27.android.url, {
                type: "utf8",
                errorCorrectionLevel: "L"
            })]);
            w({
                ios: $6,
                android: H6
            })
        })().catch(XFY)
    }, J = [], K[1] = H, K[2] = J;
    else H = K[1], J = K[2];
    h_8.useEffect(H, J);
    let X;
    if (K[3] !== _) X = () => {
        _()
    }, K[3] = _, K[4] = X;
    else X = K[4];
    let M = X,
        P;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) P = {
        context: "Confirmation"
    }, K[5] = P;
    else P = K[5];
    G1("confirm:no", M, P);
    let W;
    if (K[6] !== _) W = function(J6) {
        if (J6.key === "q" && !J6.ctrl && !J6.meta || J6.ctrl && J6.key === "c") {
            J6.preventDefault(), _();
            return
        }
        if (J6.key === "tab" || J6.key === "left" || J6.key === "right") J6.preventDefault(), Y(JFY)
    }, K[6] = _, K[7] = W;
    else W = K[7];
    let D = W,
        Z, G, f, v, V, k, N, R, h;
    if (K[8] !== D || K[9] !== j) {
        let O6 = j.split(`
`).filter(HFY);
        if (G = A_, Z = u, N = "column", R = 0, h = !0, f = D, K[19] === Symbol.for("react.memo_cache_sentinel")) v = LO.createElement(T, null, " "), V = LO.createElement(T, null, " "), K[19] = v, K[20] = V;
        else v = K[19], V = K[20];
        k = O6.map(jFY), K[8] = D, K[9] = j, K[10] = Z, K[11] = G, K[12] = f, K[13] = v, K[14] = V, K[15] = k, K[16] = N, K[17] = R, K[18] = h
    } else Z = K[10], G = K[11], f = K[12], v = K[13], V = K[14], k = K[15], N = K[16], R = K[17], h = K[18];
    let C, x;
    if (K[21] === Symbol.for("react.memo_cache_sentinel")) C = LO.createElement(T, null, " "), x = LO.createElement(T, null, " "), K[21] = C, K[22] = x;
    else C = K[21], x = K[22];
    let B = z === "ios",
        m = z === "ios",
        S;
    if (K[23] !== B || K[24] !== m) S = LO.createElement(T, {
        bold: B,
        underline: m
    }, "iOS"), K[23] = B, K[24] = m, K[25] = S;
    else S = K[25];
    let F;
    if (K[26] === Symbol.for("react.memo_cache_sentinel")) F = LO.createElement(T, {
        dimColor: !0
    }, " / "), K[26] = F;
    else F = K[26];
    let U = z === "android",
        g = z === "android",
        c;
    if (K[27] !== U || K[28] !== g) c = LO.createElement(T, {
        bold: U,
        underline: g
    }, "Android"), K[27] = U, K[28] = g, K[29] = c;
    else c = K[29];
    let n;
    if (K[30] !== S || K[31] !== c) n = LO.createElement(T, null, S, F, c), K[30] = S, K[31] = c, K[32] = n;
    else n = K[32];
    let l;
    if (K[33] === Symbol.for("react.memo_cache_sentinel")) l = LO.createElement(T, {
        dimColor: !0
    }, "(tab to switch, esc to close)"), K[33] = l;
    else l = K[33];
    let z6;
    if (K[34] !== n) z6 = LO.createElement(u, {
        flexDirection: "row",
        gap: 2
    }, n, l), K[34] = n, K[35] = z6;
    else z6 = K[35];
    let A6;
    if (K[36] !== $) A6 = LO.createElement(T, {
        dimColor: !0
    }, $), K[36] = $, K[37] = A6;
    else A6 = K[37];
    let e;
    if (K[38] !== Z || K[39] !== f || K[40] !== v || K[41] !== V || K[42] !== k || K[43] !== z6 || K[44] !== A6 || K[45] !== N || K[46] !== R || K[47] !== h) e = LO.createElement(Z, {
        flexDirection: N,
        tabIndex: R,
        autoFocus: h,
        onKeyDown: f
    }, v, V, k, C, x, z6, A6), K[38] = Z, K[39] = f, K[40] = v, K[41] = V, K[42] = k, K[43] = z6, K[44] = A6, K[45] = N, K[46] = R, K[47] = h, K[48] = e;
    else e = K[48];
    let i;
    if (K[49] !== G || K[50] !== e) i = LO.createElement(G, null, e), K[49] = G, K[50] = e, K[51] = i;
    else i = K[51];
    return i
}
// @from(Ln 462862, Col 0)
function jFY(q, K) {
    return LO.createElement(T, {
        key: K
    }, q)
}
// @from(Ln 462868, Col 0)
function HFY(q) {
    return q.length > 0
}
// @from(Ln 462872, Col 0)
function JFY(q) {
    return q === "ios" ? "android" : "ios"
}
// @from(Ln 462876, Col 0)
function XFY() {}
// @from(Ln 462877, Col 0)
async function MFY(q) {
    return LO.createElement($FY, {
        onDone: q
    })
}
// @from(Ln 462882, Col 4)
LO
// @from(Ln 462882, Col 8)
h_8
// @from(Ln 462882, Col 13)
P27
// @from(Ln 462883, Col 4)
IUK = L(() => {
    o6();
    lx6();
    DJ();
    g6();
    C7();
    LO = K6(P6(), 1), h_8 = K6(P6(), 1), P27 = {
        ios: {
            url: "https://apps.apple.com/app/claude-by-anthropic/id6473753684"
        },
        android: {
            url: "https://play.google.com/store/apps/details?id=com.anthropic.claude"
        }
    }
})
// @from(Ln 462898, Col 4)
PFY
// @from(Ln 462898, Col 9)
W27
// @from(Ln 462899, Col 4)
xUK = L(() => {
    PFY = {
        type: "local-jsx",
        name: "mobile",
        aliases: ["ios", "android"],
        description: "Show QR code to download the Claude mobile app",
        load: () => Promise.resolve().then(() => (IUK(), bUK))
    }, W27 = PFY
})
// @from(Ln 462908, Col 4)
uUK
// @from(Ln 462909, Col 4)
mUK = L(() => {
    uUK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 462917, Col 0)
function UUK(q) {
    let K = s(10),
        {
            live: _,
            boxRef: z,
            children: Y
        } = q,
        A;
    if (K[0] !== Y) A = _z.createElement(u, {
        flexDirection: "column",
        width: D27 - 4,
        height: pUK
    }, Y), K[0] = Y, K[1] = A;
    else A = K[1];
    let O = !_,
        w = _ ? "claude" : void 0,
        $ = _ ? `${dZ} try it` : `  ${YX8} demo`,
        j;
    if (K[2] !== O || K[3] !== w || K[4] !== $) j = _z.createElement(u, {
        position: "absolute",
        marginLeft: D27 - 12
    }, _z.createElement(T, {
        dimColor: O,
        color: w
    }, $)), K[2] = O, K[3] = w, K[4] = $, K[5] = j;
    else j = K[5];
    let H;
    if (K[6] !== z || K[7] !== A || K[8] !== j) H = _z.createElement(u, {
        ref: z,
        borderStyle: "round",
        borderColor: "inactive",
        paddingX: 1,
        width: D27,
        height: pUK + 2
    }, A, j), K[6] = z, K[7] = A, K[8] = j, K[9] = H;
    else H = K[9];
    return H
}
// @from(Ln 462956, Col 0)
function DFY(q) {
    let K = q.startsWith("#"),
        _ = K ? q.slice(1) : q,
        z = [],
        Y = 0;
    for (let A of _.matchAll(WFY)) {
        if (A.index > Y) z.push({
            text: _.slice(Y, A.index)
        });
        z.push({
            text: A[2],
            color: A[1]
        }), Y = A.index + A[0].length
    }
    if (Y < _.length) z.push({
        text: _.slice(Y)
    });
    if (z.length === 0) z.push({
        text: ""
    });
    return {
        dim: K,
        segments: z
    }
}
// @from(Ln 462982, Col 0)
function yn(q) {
    let K = s(7),
        {
            frames: _
        } = q,
        z;
    if (K[0] !== _) z = _.map(GFY), K[0] = _, K[1] = z;
    else z = K[1];
    let Y = z,
        A = iO().prefersReducedMotion ?? !1,
        [O, w] = _O(A ? null : BUK),
        $ = Math.floor(w / BUK) % Y.length,
        j = Y[$],
        H;
    if (K[2] !== j) H = j.map(ZFY), K[2] = j, K[3] = H;
    else H = K[3];
    let J;
    if (K[4] !== O || K[5] !== H) J = _z.createElement(UUK, {
        boxRef: O
    }, H), K[4] = O, K[5] = H, K[6] = J;
    else J = K[6];
    return J
}
// @from(Ln 463006, Col 0)
function ZFY(q, K) {
    return _z.createElement(T, {
        key: K,
        dimColor: q.dim
    }, q.segments.map(fFY))
}
// @from(Ln 463013, Col 0)
function fFY(q, K) {
    return _z.createElement(T, {
        key: K,
        color: q.color
    }, q.text)
}
// @from(Ln 463020, Col 0)
function GFY(q) {
    return q.split(`
`).map(DFY)
}
// @from(Ln 463025, Col 0)
function NFY(q) {
    let K = [];
    for (let _ = 0; _ < q; _++) K.push({
        x: Math.floor(Math.random() * dUK),
        delay: Math.random() * 400,
        speed: 0.7 + Math.random() * 0.6,
        char: LJ(VFY),
        color: LJ(kFY)
    });
    return K
}
// @from(Ln 463037, Col 0)
function cUK({
    onDone: q
}) {
    let K = i_6.useMemo(() => NFY(40), []),
        _ = iO().prefersReducedMotion ?? !1,
        [z, Y] = _O(_ ? null : vFY),
        A = i_6.useRef(Y),
        O = Y - A.current;
    i_6.useEffect(() => {
        let $ = setTimeout(q, gUK + 600);
        return () => clearTimeout($)
    }, [q]);
    let w = Array.from({
        length: ei8
    }, () => []);
    for (let $ of K) {
        let j = Math.max(0, O - $.delay),
            H = Math.floor(j / gUK * ei8 * $.speed);
        if (H >= 0 && H < ei8) w[H].push($)
    }
    for (let $ of w) $.sort((j, H) => j.x - H.x);
    return _z.createElement(u, {
        ref: z,
        position: "absolute",
        marginLeft: TFY,
        flexDirection: "column",
        width: dUK,
        height: ei8
    }, w.map(($, j) => {
        let H = 0;
        return _z.createElement(u, {
            key: j,
            height: 1
        }, $.map((J, X) => {
            let M = Math.max(0, J.x - H);
            return H = Math.max(H, J.x) + 1, _z.createElement(T, {
                key: X
            }, " ".repeat(M), _z.createElement(T, {
                color: J.color
            }, J.char))
        }))
    }))
}
// @from(Ln 463081, Col 0)
function lUK(q) {
    let K = s(14),
        {
            text: _
        } = q,
        z = N1(_),
        Y = iO().prefersReducedMotion ?? !1,
        [A, O] = _O(Y ? null : FUK),
        w = z + 20,
        $ = Math.floor(O / FUK) % w - 10,
        j;
    if (K[0] !== $ || K[1] !== _) j = GF8(_, $), K[0] = $, K[1] = _, K[2] = j;
    else j = K[2];
    let {
        before: H,
        shimmer: J,
        after: X
    } = j, M;
    if (K[3] !== H) M = _z.createElement(T, {
        bold: !0,
        color: "claude"
    }, H), K[3] = H, K[4] = M;
    else M = K[4];
    let P;
    if (K[5] !== J) P = _z.createElement(T, {
        bold: !0,
        color: "claudeShimmer"
    }, J), K[5] = J, K[6] = P;
    else P = K[6];
    let W;
    if (K[7] !== X) W = _z.createElement(T, {
        bold: !0,
        color: "claude"
    }, X), K[7] = X, K[8] = W;
    else W = K[8];
    let D;
    if (K[9] !== A || K[10] !== M || K[11] !== P || K[12] !== W) D = _z.createElement(u, {
        ref: A
    }, M, P, W), K[9] = A, K[10] = M, K[11] = P, K[12] = W, K[13] = D;
    else D = K[13];
    return D
}
// @from(Ln 463124, Col 0)
function nUK() {
    let q = s(11),
        [K, _] = i_6.useState(0),
        z = QUK[K],
        Y = V3("chat:cycleMode", "Chat", "shift+tab"),
        A, O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) A = {
        "confirm:cycleMode": () => _(EFY)
    }, O = {
        context: "Confirmation"
    }, q[0] = A, q[1] = O;
    else A = q[0], O = q[1];
    L7(A, O);
    let w;
    if (q[2] !== Y) w = _z.createElement(T, {
        dimColor: !0
    }, "Press ", Y, " now", `

`), q[2] = Y, q[3] = w;
    else w = q[3];
    let $ = z.symbol ? `${z.symbol} ` : "  ",
        j;
    if (q[4] !== z.color || q[5] !== z.label || q[6] !== $) j = _z.createElement(T, {
        color: z.color
    }, $, z.label), q[4] = z.color, q[5] = z.label, q[6] = $, q[7] = j;
    else j = q[7];
    let H;
    if (q[8] !== w || q[9] !== j) H = _z.createElement(UUK, {
        live: !0
    }, _z.createElement(T, null, w, j)), q[8] = w, q[9] = j, q[10] = H;
    else H = q[10];
    return H
}
// @from(Ln 463158, Col 0)
function EFY(q) {
    return (q + 1) % QUK.length
}
// @from(Ln 463161, Col 4)
_z
// @from(Ln 463161, Col 8)
i_6
// @from(Ln 463161, Col 13)
BUK = 3000
// @from(Ln 463162, Col 4)
D27 = 48
// @from(Ln 463163, Col 4)
pUK = 3
// @from(Ln 463164, Col 4)
WFY
// @from(Ln 463164, Col 9)
QUK
// @from(Ln 463164, Col 14)
FUK = 80
// @from(Ln 463165, Col 4)
vFY = 60
// @from(Ln 463166, Col 4)
gUK = 1400
// @from(Ln 463167, Col 4)
ei8 = 16
// @from(Ln 463168, Col 4)
TFY = 60
// @from(Ln 463169, Col 4)
dUK = 100
// @from(Ln 463170, Col 4)
VFY
// @from(Ln 463170, Col 9)
kFY
// @from(Ln 463171, Col 4)
Z27 = L(() => {
    o6();
    uc();
    $96();
    A3();
    tE();
    n5();
    g6();
    C7();
    RM();
    _z = K6(P6(), 1), i_6 = K6(P6(), 1);
    WFY = /\[(\w+):([^\]]*)\]/g;
    QUK = [{
        label: "default",
        symbol: "",
        color: "text"
    }, {
        label: "accept edits on",
        symbol: "⏵⏵",
        color: "autoAccept"
    }, {
        label: "plan mode on",
        symbol: AX8,
        color: "planMode"
    }, {
        label: "auto mode on",
        symbol: "⏵⏵",
        color: "warning"
    }], VFY = [dZ, eH, $9, "·"], kFY = ["claude", "success", "warning", "suggestion", "autoAccept"]
})
// @from(Ln 463202, Col 0)
function nx6(q) {
    let K = s(2),
        {
            children: _
        } = q,
        z;
    if (K[0] !== _) z = M1.createElement(T, {
        bold: !0,
        color: "claude"
    }, _), K[0] = _, K[1] = z;
    else z = K[1];
    return z
}
// @from(Ln 463216, Col 0)
function Ij(q) {
    let K = s(2),
        {
            children: _
        } = q,
        z;
    if (K[0] !== _) z = M1.createElement(T, {
        color: "suggestion"
    }, _), K[0] = _, K[1] = z;
    else z = K[1];
    return z
}
// @from(Ln 463229, Col 0)
function iUK() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = M1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, M1.createElement(z1, null, M1.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "select"
    }), M1.createElement(A8, {
        chord: "enter",
        action: "open"
    }), M1.createElement(A8, {
        chord: "escape",
        action: "close"
    }))), q[0] = K;
    else K = q[0];
    return K
}
// @from(Ln 463252, Col 0)
function rUK() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = M1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, M1.createElement(z1, null, M1.createElement(A8, {
        chord: "enter",
        action: "mark done"
    }), M1.createElement(A8, {
        chord: "escape",
        action: "back"
    }))), q[0] = K;
    else K = q[0];
    return K
}
// @from(Ln 463268, Col 4)
M1
// @from(Ln 463268, Col 8)
Xg
// @from(Ln 463269, Col 4)
oUK = L(() => {
    o6();
    g6();
    Nq();
    u7();
    Z27();
    M1 = K6(P6(), 1);
    Xg = [{
        id: "at-mentions",
        title: "Talk to your codebase",
        tagline: "@ files, line refs",
        body: M1.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, M1.createElement(T, null, "Type ", M1.createElement(nx6, null, "@"), " anywhere in your prompt to fuzzy-find and attach a file. Claude reads it before answering — no more pasting code."), M1.createElement(yn, {
            frames: [`> what does [suggestion:@]
#type a file name…`, `> what does [suggestion:@src/auth.ts]
  [suggestion:❯ src/auth.ts]
#   src/auth.test.ts`, `> what does [suggestion:@src/auth.ts] do?
#◐ Reading src/auth.ts…`, `> what does [suggestion:@src/auth.ts] do?
Exports validateToken() which
checks JWT expiry and signature.`]
        }), M1.createElement(T, null, "Reference specific lines with ", M1.createElement(Ij, null, "src/app.ts:42"), " and Claude jumps straight there. Works in both directions: Claude cites files the same way, so you can click to open them in your editor."), M1.createElement(T, {
            dimColor: !0
        }, "Also try: ", M1.createElement(Ij, null, "@folder/"), " to attach a whole directory tree."))
    }, {
        id: "modes",
        title: "Steer with modes",
        tagline: "shift+tab, plan, auto",
        body: M1.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, M1.createElement(T, null, "Press ", M1.createElement(nx6, null, "shift+tab"), " to cycle permission modes. Each mode changes how much Claude asks before acting:"), M1.createElement(nUK, null), M1.createElement(u, {
            flexDirection: "column",
            paddingLeft: 2
        }, M1.createElement(T, null, M1.createElement(T, {
            color: "success"
        }, "default"), " — ask before every edit"), M1.createElement(T, null, M1.createElement(T, {
            color: "autoAccept"
        }, "accept edits"), " — edit freely, ask for commands"), M1.createElement(T, null, M1.createElement(T, {
            color: "planMode"
        }, "plan"), " — research and propose, never touch files"), M1.createElement(T, null, M1.createElement(T, {
            color: "warning"
        }, "auto"), " — Claude decides what is safe")), M1.createElement(T, {
            dimColor: !0
        }, "Use ", M1.createElement(T, {
            color: "planMode"
        }, "plan"), " for big refactors you want to review first. Use ", M1.createElement(T, {
            color: "warning"
        }, "auto"), " for long unattended tasks. Run ", M1.createElement(Ij, null, "/permissions"), " to pre-allow specific commands so Claude stops asking about them."))
    }, {
        id: "undo",
        title: "Undo anything",
        tagline: "/rewind, Esc-Esc",
        body: M1.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, M1.createElement(T, null, "Claude checkpoints your files before every edit. Press", " ", M1.createElement(nx6, null, "Esc Esc"), " (double-tap) to open ", M1.createElement(Ij, null, "/rewind"), " and roll back to any prior state — code, conversation, or both."), M1.createElement(yn, {
            frames: [`[success:✓] Updated regex in parser.ts
#[error:8 tests failing]`, `#press Esc Esc
Rewind to:
  [suggestion:❯ before parser.ts edit]`, `#[success:✓] parser.ts restored
> try a simpler approach
#◐ thinking…`]
        }), M1.createElement(T, null, "Went down the wrong path? Rewind to before the detour and try a different prompt. Your git history stays clean."), M1.createElement(T, {
            dimColor: !0
        }, "Also: ", M1.createElement(Ij, null, "/clear"), " wipes conversation but keeps files.", " ", M1.createElement(Ij, null, "/branch"), " forks the conversation to try two approaches."))
    }, {
        id: "background",
        title: "Run in the background",
        tagline: "tasks, /tasks",
        body: M1.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, M1.createElement(T, null, "Long builds and test suites do not have to block you. Add", " ", M1.createElement(nx6, null, "&"), " to any bash command and it runs in the background — you keep chatting, Claude notifies you when it finishes."), M1.createElement(yn, {
            frames: [`> run the test suite [claude:&]
#task started in background`, `> now fix the lint in app.ts
#◐ Editing app.ts…
#[warning:◐] bun test · 12s`, `> now fix the lint in app.ts
[success:✓] Removed unused import
#[warning:◐] bun test · 28s`, `> now fix the lint in app.ts
[success:✓] Removed unused import
#[success:✓] bun test · 284 pass`]
        }), M1.createElement(T, null, "Run ", M1.createElement(Ij, null, "/tasks"), " to see everything in flight. Claude can read task output mid-run and react to failures automatically."), M1.createElement(T, {
            dimColor: !0
        }, "Subagents and workflows also run as tasks — it is all one queue."))
    }, {
        id: "memory",
        title: "Teach Claude your rules",
        tagline: "CLAUDE.md, /memory",
        body: M1.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, M1.createElement(T, null, "Drop a ", M1.createElement(Ij, null, "CLAUDE.md"), " file in your repo and Claude reads it at the start of every session. Put your conventions there: test commands, style rules, do-not-touch directories."), M1.createElement(yn, {
            frames: [`#─ CLAUDE.md ─
#Run tests with: [suggestion:bun test]
#Never edit src/legacy/`, `> add tests for the cache
#◐ reading CLAUDE.md…`, `> add tests for the cache
Writing cache.test.ts,
running [suggestion:bun test] to verify.`]
        }), M1.createElement(T, null, "Run ", M1.createElement(Ij, null, "/init"), " to generate a starter CLAUDE.md from your codebase. Run ", M1.createElement(Ij, null, "/memory"), " to edit it inline."), M1.createElement(T, {
            dimColor: !0
        }, "Works at three levels: repo, your home directory (all projects), and per-directory overrides."))
    }, {
        id: "mcp",
        title: "Extend with tools",
        tagline: "MCP, /mcp",
        body: M1.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, M1.createElement(T, null, "MCP servers give Claude new tools: read your Slack, query your database, control your browser. Run ", M1.createElement(Ij, null, "/mcp"), " to browse and connect servers."), M1.createElement(yn, {
            frames: [`> [suggestion:/mcp]
Connected servers:
  [success:✓] slack    [success:✓] github`, `> anything urgent in #eng?
#◐ [suggestion:slack] · reading channel…`, `Boris posted about the merge
freeze. Also 3 PRs await
your review on github.`]
        }), M1.createElement(T, null, 'Once connected, tools appear automatically — ask Claude to "check my calendar" or "search our Notion" and it just works.'), M1.createElement(T, {
            dimColor: !0
        }, "From your shell:", " ", M1.createElement(Ij, null, "claude mcp add my-server -- npx some-mcp-pkg"), " to wire one up without leaving the terminal."))
    }, {
        id: "automate",
        title: "Automate your workflow",
        tagline: "skills, hooks",
        body: M1.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, M1.createElement(T, null, "Save a prompt to ", M1.createElement(Ij, null, ".claude/skills/deploy/SKILL.md"), " and it becomes ", M1.createElement(Ij, null, "/deploy"), " — type it, Claude runs it. Run", " ", M1.createElement(Ij, null, "/skills"), " to see what you have."), M1.createElement(yn, {
            frames: [`> [suggestion:/deploy] staging
#◐ skill: deploy`, `[success:✓] built
[success:✓] tests pass
#◐ pushing to staging…`, `[success:✓] deployed
#[suggestion:staging.app.com]
#PostToolUse hook ran prettier`]
        }), M1.createElement(T, null, "Hooks run your own scripts on events: before a tool call, after a response, on session start. Use them to enforce rules, log activity, or inject context. Run ", M1.createElement(Ij, null, "/hooks"), " to see what fires when."), M1.createElement(T, {
            dimColor: !0
        }, "Run ", M1.createElement(Ij, null, "/install-github-app"), " to let Claude review PRs when tagged."))
    }, {
        id: "subagents",
        title: "Multiply yourself",
        tagline: "subagents, /agents",
        body: M1.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, M1.createElement(T, null, 'Claude can spawn copies of itself to work in parallel. Ask it to "use subagents to search these 5 directories" and watch the fan-out.'), M1.createElement(yn, {
            frames: [`> find any error handling bugs
#◐ Spawning 3 agents…`, `#[warning:◐] agent-1 · scanning api
#[warning:◐] agent-2 · scanning utils
#[warning:◐] agent-3 · scanning cli`, `#[success:✓] agent-1 · found reject
#[warning:◐] agent-2 · scanning utils
#[success:✓] agent-3 · no issues`, `Found 2 issues:
  [suggestion:api/fetch.ts:42] unhandled
  [suggestion:utils/retry.ts:18] swallowed`]
        }), M1.createElement(T, null, "Define specialized agents in ", M1.createElement(Ij, null, ".claude/agents/"), " — a test runner, a code reviewer, a docs writer — each with its own tools and instructions. Run ", M1.createElement(Ij, null, "/agents"), " to manage them."), M1.createElement(T, {
            dimColor: !0
        }, "Subagents run in isolated context. For true parallel sessions on separate branches, launch with ", M1.createElement(Ij, null, "claude --worktree"), "."))
    }, {
        id: "cross-device",
        title: "Code from anywhere",
        tagline: "/remote-control, /teleport",
        body: M1.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, M1.createElement(T, null, "Run ", M1.createElement(Ij, null, "/remote-control"), " and this terminal becomes visible on your phone and at claude.ai/code. Watch output, send prompts, approve tool calls — all from another device while this session keeps running."), M1.createElement(yn, {
            frames: [`> [suggestion:/remote-control]
#◐ connecting…`, `[success:✓] connected
see this session at
[suggestion:claude.ai/code/abc123]`, `#─ on your phone ─
#abc123 · running tests
[warning:◐] 142 of 284`, `#─ on your phone ─
#abc123 · [success:✓] all pass
> ship it`]
        }), M1.createElement(T, null, "Started a session on the web and want to move it here? Run", " ", M1.createElement(Ij, null, "/teleport"), " to pull it into this terminal with full history."), M1.createElement(T, {
            dimColor: !0
        }, "Kick off a long task, close your laptop, check progress from your phone."))
    }, {
        id: "model-dial",
        title: "Dial the model",
        tagline: "/model, /effort",
        body: M1.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, M1.createElement(T, null, "Run ", M1.createElement(Ij, null, "/model"), " to switch models. Opus for hard problems, Sonnet for most work, Haiku for quick questions. Each trades speed for depth."), M1.createElement(yn, {
            frames: [`> [suggestion:/effort] high
#effort set to [claude:high]`, `> why is the list page slow?
#[claude:◐ thinking deeply…]`, `Three hypotheses, ranked:
 1. N+1 query in loader
 2. missing index on users`]
        }), M1.createElement(T, null, M1.createElement(Ij, null, "/effort"), " controls how long Claude thinks before answering.", " ", M1.createElement(nx6, null, "high"), " for tricky bugs, ", M1.createElement(nx6, null, "low"), " when you just need a quick edit."), M1.createElement(T, {
            dimColor: !0
        }, "Also: ", M1.createElement(Ij, null, "/fast"), " toggles fast mode — same model, faster output."))
    }]
})
// @from(Ln 463463, Col 0)
function aUK(q) {
    let K = s(47),
        {
            onExit: _
        } = q,
        [z, Y] = R_8.useState(yFY),
        [A, O] = R_8.useState(null),
        [w, $] = R_8.useState(Xg[0].id),
        [j, H] = R_8.useState(!1),
        J;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) J = () => H(!1), K[0] = J;
    else J = K[0];
    let X = J,
        M;
    if (K[1] !== z) M = function(c) {
        $(c.id), O(c), d("tengu_powerup_lesson_opened", {
            lesson_id: c.id,
            was_already_unlocked: z.has(c.id),
            unlocked_count: z.size
        })
    }, K[1] = z, K[2] = M;
    else M = K[2];
    let P = M,
        W;
    if (K[3] !== z) W = function(c) {
        if (z.has(c)) return;
        let n = new Set(z).add(c);
        if (Y(n), d8((l) => ({
                ...l,
                powerupsUnlocked: [...n]
            })), d("tengu_powerup_lesson_completed", {
                lesson_id: c,
                unlocked_count: n.size,
                all_unlocked: n.size === Xg.length
            }), n.size === Xg.length) H(!0)
    }, K[3] = z, K[4] = W;
    else W = K[4];
    let D = W,
        Z;
    if (K[5] !== z) Z = Xg.map((g) => {
        let c = z.has(g.id),
            n = `${c?e6.tick:e6.circle} ${g.title}`;
        return {
            label: c ? e9.createElement(T, {
                color: "success"
            }, n) : n,
            value: g.id,
            description: g.tagline
        }
    }), K[5] = z, K[6] = Z;
    else Z = K[6];
    let G = Z;
    if (A) {
        let g;
        if (K[7] !== z || K[8] !== A.id) g = z.has(A.id), K[7] = z, K[8] = A.id, K[9] = g;
        else g = K[9];
        let c;
        if (K[10] !== D || K[11] !== A.id) c = () => {
            D(A.id), O(null)
        }, K[10] = D, K[11] = A.id, K[12] = c;
        else c = K[12];
        let n;
        if (K[13] === Symbol.for("react.memo_cache_sentinel")) n = () => O(null), K[13] = n;
        else n = K[13];
        let l;
        if (K[14] !== g || K[15] !== c || K[16] !== A) l = e9.createElement(hFY, {
            lesson: A,
            isUnlocked: g,
            onDone: c,
            onBack: n
        }), K[14] = g, K[15] = c, K[16] = A, K[17] = l;
        else l = K[17];
        return l
    }
    let f = z.size === Xg.length,
        v;
    if (K[18] !== f) v = f ? e9.createElement(lUK, {
        text: "All powered up"
    }) : e9.createElement(T, {
        bold: !0,
        color: "claude"
    }, "Power-ups"), K[18] = f, K[19] = v;
    else v = K[19];
    let V;
    if (K[20] !== z.size) V = e9.createElement(T, {
        dimColor: !0
    }, " ", z.size, "/", Xg.length, " unlocked", " "), K[20] = z.size, K[21] = V;
    else V = K[21];
    let k = z.size / Xg.length,
        N;
    if (K[22] !== k) N = e9.createElement(wP6, {
        ratio: k,
        width: 16,
        fillColor: "claude",
        emptyColor: "inactive"
    }), K[22] = k, K[23] = N;
    else N = K[23];
    let R;
    if (K[24] !== v || K[25] !== V || K[26] !== N) R = e9.createElement(u, {
        marginBottom: 1
    }, v, V, N), K[24] = v, K[25] = V, K[26] = N, K[27] = R;
    else R = K[27];
    let h = f ? "Now go build something." : "Each power-up teaches one thing Claude Code can do that most people miss. Open one, read it, try it, mark it done.",
        C;
    if (K[28] !== h) C = e9.createElement(u, {
        marginBottom: 1
    }, e9.createElement(T, {
        dimColor: !0,
        wrap: "wrap"
    }, h)), K[28] = h, K[29] = C;
    else C = K[29];
    let x;
    if (K[30] !== P) x = (g) => {
        let c = Xg.find((n) => n.id === g);
        if (c) P(c)
    }, K[30] = P, K[31] = x;
    else x = K[31];
    let B;
    if (K[32] !== _) B = () => _("Power-ups closed"), K[32] = _, K[33] = B;
    else B = K[33];
    let m;
    if (K[34] !== G || K[35] !== w || K[36] !== x || K[37] !== B) m = e9.createElement(A1, {
        options: G,
        hideIndexes: !0,
        visibleOptionCount: Xg.length,
        defaultFocusValue: w,
        onChange: x,
        onCancel: B
    }), K[34] = G, K[35] = w, K[36] = x, K[37] = B, K[38] = m;
    else m = K[38];
    let S;
    if (K[39] === Symbol.for("react.memo_cache_sentinel")) S = e9.createElement(u, {
        marginTop: 1
    }, e9.createElement(iUK, null)), K[39] = S;
    else S = K[39];
    let F;
    if (K[40] !== j) F = j && e9.createElement(cUK, {
        onDone: X
    }), K[40] = j, K[41] = F;
    else F = K[41];
    let U;
    if (K[42] !== C || K[43] !== m || K[44] !== F || K[45] !== R) U = e9.createElement(A_, {
        color: "claude"
    }, e9.createElement(u, {
        flexDirection: "column"
    }, R, C, m, S, F)), K[42] = C, K[43] = m, K[44] = F, K[45] = R, K[46] = U;
    else U = K[46];
    return U
}
// @from(Ln 463613, Col 0)
function yFY() {
    let q = H8().powerupsUnlocked ?? [];
    return new Set(q.filter(LFY))
}
// @from(Ln 463618, Col 0)
function LFY(q) {
    return Xg.some((K) => K.id === q)
}
// @from(Ln 463622, Col 0)
function hFY(q) {
    let K = s(15),
        {
            lesson: _,
            isUnlocked: z,
            onDone: Y,
            onBack: A
        } = q,
        O;
    if (K[0] !== A || K[1] !== Y) O = {
        "confirm:yes": Y,
        "confirm:no": A
    }, K[0] = A, K[1] = Y, K[2] = O;
    else O = K[2];
    let w;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) w = {
        context: "Confirmation"
    }, K[3] = w;
    else w = K[3];
    L7(O, w);
    let $ = z ? "success" : "pending",
        j;
    if (K[4] !== $) j = e9.createElement(D4, {
        status: $,
        withSpace: !0
    }), K[4] = $, K[5] = j;
    else j = K[5];
    let H;
    if (K[6] !== _.title) H = e9.createElement(T, {
        bold: !0,
        color: "claude"
    }, _.title), K[6] = _.title, K[7] = H;
    else H = K[7];
    let J;
    if (K[8] !== j || K[9] !== H) J = e9.createElement(u, null, j, H), K[8] = j, K[9] = H, K[10] = J;
    else J = K[10];
    let X;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) X = e9.createElement(rUK, null), K[11] = X;
    else X = K[11];
    let M;
    if (K[12] !== _.body || K[13] !== J) M = e9.createElement(A_, {
        color: "claude"
    }, e9.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, J, _.body, X)), K[12] = _.body, K[13] = J, K[14] = M;
    else M = K[14];
    return M
}
// @from(Ln 463671, Col 4)
e9
// @from(Ln 463671, Col 8)
R_8
// @from(Ln 463672, Col 4)
sUK = L(() => {
    o6();
    Qq();
    g6();
    C7();
    C8();
    h1();
    gK();
    DJ();
    Jl8();
    Y2();
    Z27();
    oUK();
    e9 = K6(P6(), 1), R_8 = K6(P6(), 1)
})
// @from(Ln 463687, Col 4)
tUK = {}
// @from(Ln 463691, Col 4)
f27
// @from(Ln 463691, Col 9)
RFY = async (q) => {
    return f27.createElement(aUK, {
        onExit: (K) => q(K, {
            display: "system"
        })
    })
}
// @from(Ln 463698, Col 4)
eUK = L(() => {
    sUK();
    f27 = K6(P6(), 1)
})
// @from(Ln 463702, Col 4)
qQK
// @from(Ln 463703, Col 4)
KQK = L(() => {
    qQK = {
        type: "local-jsx",
        name: "powerup",
        description: "Discover Claude Code features through quick interactive lessons",
        load: () => Promise.resolve().then(() => (eUK(), tUK))
    }
})
// @from(Ln 463721, Col 0)
function v27() {
    return CFY(A7(), "cache", "changelog.md")
}
// @from(Ln 463724, Col 0)
async function OQK() {
    let q = H8();
    if (!q.cachedChangelog) return;
    let K = v27();
    try {
        await _QK(YQK(K), {
            recursive: !0
        }), await zQK(K, q.cachedChangelog, {
            encoding: "utf-8",
            flag: "wx"
        })
    } catch {}
    d8(({
        cachedChangelog: _,
        ...z
    }) => z)
}
// @from(Ln 463741, Col 0)
async function T27() {
    if (I7()) return;
    if (o3()) return;
    let q = IFY,
        K = await Z1.get(q);
    if (K.status === 200) {
        let _ = K.data;
        if (_ === iP6) return;
        let z = v27();
        await _QK(YQK(z), {
            recursive: !0
        }), await zQK(z, _, {
            encoding: "utf-8"
        }), iP6 = _;
        let Y = Date.now();
        d8((A) => ({
            ...A,
            changelogLastFetched: Y
        }))
    }
}
// @from(Ln 463762, Col 0)
async function V27() {
    if (iP6 !== null) return iP6;
    let q = v27();
    try {
        let K = await SFY(q, "utf-8");
        return iP6 = K, K
    } catch {
        return iP6 = "", ""
    }
}
// @from(Ln 463773, Col 0)
function qr8() {
    return iP6 ?? ""
}
// @from(Ln 463777, Col 0)
function Kr8(q) {
    try {
        if (!q) return {};
        let K = {},
            _ = q.split(/^## /gm).slice(1);
        for (let z of _) {
            let Y = z.trim().split(`
`);
            if (Y.length === 0) continue;
            let A = Y[0];
            if (!A) continue;
            let O = i5(A, " - ").trim();
            if (!O) continue;
            let w = Y.slice(1).filter(($) => $.trim().startsWith("- ")).map(($) => $.trim().substring(2).trim()).filter(Boolean);
            if (w.length > 0) K[O] = w
        }
        return K
    } catch (K) {
        return j6(r1(K)), {}
    }
}
// @from(Ln 463799, Col 0)
function wQK(q, K, _ = qr8()) {
    try {
        let z = Kr8(_),
            Y = G27.coerce(q),
            A = K ? G27.coerce(K) : null;
        if (!A || Y && RP(Y.version, A.version)) return Object.entries(z).filter(([O]) => !A || RP(O, A.version)).sort(([O], [w]) => RP(O, w) ? -1 : 1).flatMap(([O, w]) => w).filter(Boolean).slice(0, bFY)
    } catch (z) {
        return j6(r1(z)), []
    }
    return []
}
// @from(Ln 463811, Col 0)
function $QK(q = qr8()) {
    try {
        let K = Kr8(q);
        return Object.keys(K).sort((z, Y) => RP(z, Y) ? 1 : -1).map((z) => {
            let Y = K[z];
            if (!Y || Y.length === 0) return null;
            let A = Y.filter(Boolean);
            if (A.length === 0) return null;
            return [z, A]
        }).filter((z) => z !== null)
    } catch (K) {
        return j6(r1(K)), []
    }
}
// @from(Ln 463825, Col 0)
async function jQK(q, K = {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.112",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-04-16T18:33:19Z"
}.VERSION) {
    let _ = await V27();
    if (q !== K || !_) T27().catch((A) => j6(r1(A)));
    let z = wQK(K, q, _);
    return {
        hasReleaseNotes: z.length > 0,
        releaseNotes: z
    }
}
// @from(Ln 463842, Col 0)
function HQK(q, K = {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.112",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-04-16T18:33:19Z"
}.VERSION) {
    let _ = wQK(K, q);
    return {
        hasReleaseNotes: _.length > 0,
        releaseNotes: _
    }
}
// @from(Ln 463856, Col 4)
G27
// @from(Ln 463856, Col 9)
bFY = 5
// @from(Ln 463857, Col 4)
AQK = "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md"
// @from(Ln 463858, Col 4)
IFY = "https://raw.githubusercontent.com/anthropics/claude-code/refs/heads/main/CHANGELOG.md"
// @from(Ln 463859, Col 4)
iP6 = null
// @from(Ln 463860, Col 4)
ix6 = L(() => {
    CK();
    y8();
    h1();
    Q8();
    m8();
    U8();
    G$();
    G27 = K6(Pd(), 1)
})
// @from(Ln 463870, Col 4)
MQK = {}
// @from(Ln 463875, Col 0)
function XQK(q, K) {
    let _ = `Version ${q}:`,
        z = K.map((Y) => `· ${Y}`).join(`
`);
    return `${_}
${z}`
}
// @from(Ln 463883, Col 0)
function xFY(q) {
    return q.slice().sort(([K], [_]) => RP(K, _) ? 1 : -1).map(([K, _]) => XQK(K, _)).join(`

`)
}
// @from(Ln 463888, Col 0)
async function uFY(q) {
    try {
        let z = new Promise((Y, A) => setTimeout((O) => O(Error("Timeout")), 500, A));
        await Promise.race([T27(), z])
    } catch {}
    let K = await V27(),
        _ = $QK(K).slice().sort(([z], [Y]) => RP(z, Y) ? -1 : 1);
    if (_.length === 0) return q(`See the full changelog at: ${AQK}`, {
        display: "system"
    }), null;
    return rx6.default.createElement(mFY, {
        notes: _,
        onDone: q
    })
}
// @from(Ln 463904, Col 0)
function mFY(q) {
    let K = s(20),
        {
            notes: _,
            onDone: z
        } = q,
        Y = `${_.length} versions`,
        A;
    if (K[0] !== Y) A = {
        label: "Show all",
        description: Y,
        value: JQK
    }, K[0] = Y, K[1] = A;
    else A = K[1];
    let O;
    if (K[2] !== _ || K[3] !== A) O = [A, ..._.map(BFY)], K[2] = _, K[3] = A, K[4] = O;
    else O = K[4];
    let w = O,
        $;
    if (K[5] !== _ || K[6] !== z) $ = function(D) {
        if (D === JQK) {
            z(xFY(_), {
                display: "system"
            });
            return
        }
        let Z = _.find((G) => {
            let [f] = G;
            return f === D
        });
        if (!Z) {
            z(void 0, {
                display: "skip"
            });
            return
        }
        z(XQK(Z[0], Z[1]), {
            display: "system"
        })
    }, K[5] = _, K[6] = z, K[7] = $;
    else $ = K[7];
    let j = $,
        H;
    if (K[8] !== z) H = () => z(void 0, {
        display: "skip"
    }), K[8] = z, K[9] = H;
    else H = K[9];
    let J;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) J = rx6.default.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, rx6.default.createElement(T, {
        dimColor: !0
    }, "Select a version to view its notes.")), K[10] = J;
    else J = K[10];
    let X;
    if (K[11] !== z) X = () => z(void 0, {
        display: "skip"
    }), K[11] = z, K[12] = X;
    else X = K[12];
    let M;
    if (K[13] !== j || K[14] !== w || K[15] !== X) M = rx6.default.createElement(A1, {
        options: w,
        visibleOptionCount: 10,
        onChange: j,
        onCancel: X
    }), K[13] = j, K[14] = w, K[15] = X, K[16] = M;
    else M = K[16];
    let P;
    if (K[17] !== H || K[18] !== M) P = rx6.default.createElement(R1, {
        title: "Release notes",
        onCancel: H
    }, J, M), K[17] = H, K[18] = M, K[19] = P;
    else P = K[19];
    return P
}
// @from(Ln 463981, Col 0)
function BFY(q) {
    let [K, _] = q;
    return {
        label: `Version ${K}`,
        description: `${_.length} ${_.length===1?"item":"items"}`,
        value: K
    }
}
// @from(Ln 463989, Col 4)
rx6
// @from(Ln 463989, Col 9)
JQK = "__show_all__"
// @from(Ln 463990, Col 4)
PQK = L(() => {
    o6();
    gK();
    S4();
    g6();
    ix6();
    rx6 = K6(P6(), 1)
})
// @from(Ln 463998, Col 4)
pFY
// @from(Ln 463998, Col 9)
k27
// @from(Ln 463999, Col 4)
WQK = L(() => {
    pFY = {
        description: "View release notes",
        name: "release-notes",
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (PQK(), MQK))
    }, k27 = pFY
})
// @from(Ln 464007, Col 4)
JKj
// @from(Ln 464008, Col 4)
S_8 = L(() => {
    p7();
    Q8();
    Zb6();
    e8();
    JKj = C6(() => y.object({
        state: y.string(),
        detail: y.string(),
        tempo: y.enum(["active", "idle", "blocked"]).optional(),
        needs_you: y.boolean().optional(),
        needs: y.string().optional(),
        output: y.record(y.string(), y.string()).nullable().default(null),
        children: y.array(y.object({
            id: y.string(),
            href: y.string()
        })).nullable().default(null),
        linkScanOffset: y.number().default(0),
        linkScanPath: y.string().optional(),
        template: y.string(),
        routine: y.string().optional(),
        intent: y.string(),
        initialPrompt: y.string().optional(),
        name: y.string().optional(),
        sessionId: y.string(),
        cwd: y.string(),
        createdAt: y.string(),
        updatedAt: y.string(),
        firstTerminalAt: y.string().nullable().default(null),
        worktreePath: y.string().optional(),
        worktreeBranch: y.string().optional(),
        worktreeHookBased: y.boolean().optional(),
        originCwd: y.string().optional(),
        tmuxSocket: y.string().optional(),
        sortOrder: y.number().optional(),
        pinned: y.boolean().optional()
    }).transform(({
        needs_you: q,
        ...K
    }) => ({
        ...K,
        tempo: K.tempo ?? (q ? "blocked" : "idle")
    })))
})
// @from(Ln 464052, Col 0)
function ZQK() {
    return o3() || S6(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE)
}
// @from(Ln 464056, Col 0)
function _r8(q) {
    let K = [];
    for (let z of q) {
        if (z.type !== "user" && z.type !== "assistant") continue;
        if ("isMeta" in z && z.isMeta) continue;
        if ("origin" in z && z.origin && z.origin.kind !== "human") continue;
        let Y = z.message.content;
        if (typeof Y === "string") K.push(Y);
        else if (Array.isArray(Y)) {
            for (let A of Y)
                if ("type" in A && A.type === "text" && "text" in A) K.push(A.text)
        }
    }
    let _ = K.join(`
`);
    return _.length > DQK ? _.slice(-DQK) : _
}
// @from(Ln 464073, Col 0)
async function oe(q, K) {
    let _ = q.trim();
    if (_.length < FFY) return null;
    try {
        let z = await ov({
                systemPrompt: sK([gFY]),
                userPrompt: _,
                outputFormat: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: {
                            title: {
                                type: "string"
                            }
                        },
                        required: ["title"],
                        additionalProperties: !1
                    }
                },
                signal: K,
                options: {
                    querySource: "generate_session_title",
                    agents: [],
                    isNonInteractiveSession: I7(),
                    hasAppendSystemPrompt: !1,
                    mcpTools: []
                }
            }),
            Y = s5(z.message.content),
            A = UFY().safeParse(k5(Y)),
            O = A.success ? A.data.title.trim() || null : null;
        return d("tengu_session_title_generated", {
            success: O !== null
        }), O
    } catch (z) {
        return E(`generateSessionTitle failed: ${z}`, {
            level: "error"
        }), d("tengu_session_title_generated", {
            success: !1
        }), null
    }
}
// @from(Ln 464116, Col 4)
DQK = 1000
// @from(Ln 464117, Col 4)
FFY = 10
// @from(Ln 464118, Col 4)
gFY = `Generate a concise, sentence-case title (3-7 words) that captures the main topic or goal of this coding session. The title should be clear enough that the user recognizes the session in a list. Use sentence case: capitalize only the first word and proper nouns.

Return JSON with a single "title" field.

Good examples:
{"title": "Fix login button on mobile"}
{"title": "Add OAuth authentication"}
{"title": "Debug failing CI tests"}
{"title": "Refactor API client error handling"}

Bad (too vague): {"title": "Code changes"}
Bad (too long): {"title": "Investigate and fix the issue where the login button does not respond on mobile devices"}
Bad (wrong case): {"title": "Fix Login Button On Mobile"}`
// @from(Ln 464131, Col 4)
UFY
// @from(Ln 464132, Col 4)
ox6 = L(() => {
    p7();
    y8();
    C8();
    O2();
    K8();
    Q8();
    mO();
    _7();
    G$();
    UFY = C6(() => y.object({
        title: y.string()
    }))
})
// @from(Ln 464146, Col 0)
async function zr8(q, K) {
    let _ = _r8(q);
    if (!_) return null;
    try {
        let z = await ov({
                systemPrompt: sK(['Generate a short kebab-case name (2-4 words) that captures the main topic of this conversation. Use lowercase words separated by hyphens. Examples: "fix-login-bug", "add-auth-feature", "refactor-api-client", "debug-test-failures". Return JSON with a "name" field.']),
                userPrompt: _,
                outputFormat: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string"
                            }
                        },
                        required: ["name"],
                        additionalProperties: !1
                    }
                },
                signal: K,
                options: {
                    querySource: "rename_generate_name",
                    agents: [],
                    isNonInteractiveSession: !1,
                    hasAppendSystemPrompt: !1,
                    mcpTools: []
                }
            }),
            Y = s5(z.message.content),
            A = k5(Y);
        if (A && typeof A === "object" && "name" in A && typeof A.name === "string") return A.name;
        return null
    } catch (z) {
        return E(`generateSessionName failed: ${b6(z)}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 464185, Col 4)
N27 = L(() => {
    O2();
    K8();
    m8();
    mO();
    _7();
    ox6()
})
// @from(Ln 464193, Col 4)
fQK = {}
// @from(Ln 464197, Col 0)
async function E27(q, K, _) {
    if (!q) return {
        sources: [],
        outcomes: []
    };
    let {
        parseGitRemote: z,
        parseGitHubRepository: Y
    } = await Promise.resolve().then(() => (gZ(), GQ6)), {
        getDefaultBranch: A
    } = await Promise.resolve().then(() => (pK(), oJ8)), O = (j, H, J, X) => ({
        sources: [{
            type: "git_repository",
            url: `https://${j}/${H}/${J}`,
            revision: X
        }],
        outcomes: [{
            type: "git_repository",
            git_info: {
                type: "github",
                repo: `${H}/${J}`,
                branches: X ? [X] : []
            }
        }]
    }), w = z(q);
    if (w) {
        let j = K || _ || await A() || void 0;
        return O(w.host, w.owner, w.name, j)
    }
    let $ = Y(q);
    if ($) {
        let [j, H] = $.split("/");
        if (j && H) {
            let J = K || _ || await A() || void 0;
            return O("github.com", j, H, J)
        }
    }
    return {
        sources: [],
        outcomes: []
    }
}
// @from(Ln 464239, Col 4)
ax6 = {}
// @from(Ln 464246, Col 0)
async function QFY({
    environmentId: q,
    title: K,
    events: _,
    gitRepoUrl: z,
    branch: Y,
    signal: A,
    baseUrl: O,
    getAccessToken: w,
    permissionMode: $
}) {
    let {
        getClaudeAIOAuthTokens: j
    } = await Promise.resolve().then(() => (T7(), zR)), {
        getOrganizationUUID: H
    } = await Promise.resolve().then(() => (YD(), ZT6)), {
        getOauthConfig: J
    } = await Promise.resolve().then(() => (z3(), QU6)), {
        getOAuthHeaders: X
    } = await Promise.resolve().then(() => (VX(), CR6)), {
        getMainLoopModel: M
    } = await Promise.resolve().then(() => (Sq(), cZ8)), {
        getOriginalCwd: P
    } = await Promise.resolve().then(() => (y8(), CD6)), {
        default: W
    } = await Promise.resolve().then(() => (CK(), Jf6)), D = w?.() ?? j()?.accessToken;
    if (!D) return E("[bridge] No access token for session creation"), null;
    let Z = await H();
    if (!Z) return E("[bridge] No org UUID for session creation"), null;
    let {
        sources: G,
        outcomes: f
    } = await E27(z, Y), v = {
        ...K !== void 0 && {
            title: K
        },
        events: _,
        session_context: {
            sources: G,
            outcomes: f,
            model: M(),
            cwd: P(),
            reuse_outcome_branches: !0
        },
        environment_id: q,
        source: "remote-control",
        ...$ && {
            permission_mode: $
        }
    }, V = {
        ...X(D),
        "anthropic-beta": "ccr-byoc-2025-07-29",
        "x-organization-uuid": Z
    }, k = `${O??J().BASE_API_URL}/v1/sessions`, N;
    try {
        N = await W.post(k, v, {
            headers: V,
            signal: A,
            validateStatus: (C) => C < 500
        })
    } catch (C) {
        return E(`[bridge] Session creation request failed: ${b6(C)}`), null
    }
    if (!(N.status === 200 || N.status === 201)) {
        let C = Du(N.data);
        return E(`[bridge] Session creation failed with status ${N.status}${C?`: ${C}`:""}`), null
    }
    let h = N.data;
    if (!h || typeof h !== "object" || !("id" in h) || typeof h.id !== "string") return E("[bridge] No session ID in response"), null;
    return h.id
}
// @from(Ln 464317, Col 0)
async function y27(q, K) {
    let {
        getClaudeAIOAuthTokens: _
    } = await Promise.resolve().then(() => (T7(), zR)), {
        getOrganizationUUID: z
    } = await Promise.resolve().then(() => (YD(), ZT6)), {
        getOauthConfig: Y
    } = await Promise.resolve().then(() => (z3(), QU6)), {
        getOAuthHeaders: A
    } = await Promise.resolve().then(() => (VX(), CR6)), {
        default: O
    } = await Promise.resolve().then(() => (CK(), Jf6)), w = K?.getAccessToken?.() ?? _()?.accessToken;
    if (!w) return E("[bridge] No access token for session fetch"), null;
    let $ = await z();
    if (!$) return E("[bridge] No org UUID for session fetch"), null;
    let j = {
            ...A(w),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": $
        },
        H = ER(q),
        J = `${K?.baseUrl??Y().BASE_API_URL}/v1/sessions/${H}`;
    E(`[bridge] Fetching session ${H}`);
    let X;
    try {
        X = await O.get(J, {
            headers: j,
            timeout: 1e4,
            validateStatus: (M) => M < 500
        })
    } catch (M) {
        return E(`[bridge] Session fetch request failed: ${b6(M)}`), null
    }
    if (X.status !== 200) {
        let M = Du(X.data);
        return E(`[bridge] Session fetch failed with status ${X.status}${M?`: ${M}`:""}`), null
    }
    return X.data
}
// @from(Ln 464356, Col 0)
async function dFY(q, K) {
    let {
        getClaudeAIOAuthTokens: _
    } = await Promise.resolve().then(() => (T7(), zR)), {
        getOrganizationUUID: z
    } = await Promise.resolve().then(() => (YD(), ZT6)), {
        getOauthConfig: Y
    } = await Promise.resolve().then(() => (z3(), QU6)), {
        getOAuthHeaders: A
    } = await Promise.resolve().then(() => (VX(), CR6)), {
        default: O
    } = await Promise.resolve().then(() => (CK(), Jf6)), w = K?.getAccessToken?.() ?? _()?.accessToken;
    if (!w) {
        E("[bridge] No access token for session archive");
        return
    }
    let $ = await z();
    if (!$) {
        E("[bridge] No org UUID for session archive");
        return
    }
    let j = {
            ...A(w),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": $
        },
        H = `${K?.baseUrl??Y().BASE_API_URL}/v1/sessions/${q}/archive`;
    E(`[bridge] Archiving session ${q}`);
    let J = await O.post(H, {}, {
        headers: j,
        timeout: K?.timeoutMs ?? 1e4,
        validateStatus: (X) => X < 500
    });
    if (J.status === 200) E(`[bridge] Session ${q} archived successfully`);
    else {
        let X = Du(J.data);
        E(`[bridge] Session archive failed with status ${J.status}${X?`: ${X}`:""}`)
    }
}
// @from(Ln 464395, Col 0)
async function L27(q, K, _) {
    let {
        getClaudeAIOAuthTokens: z
    } = await Promise.resolve().then(() => (T7(), zR)), {
        getOrganizationUUID: Y
    } = await Promise.resolve().then(() => (YD(), ZT6)), {
        getOauthConfig: A
    } = await Promise.resolve().then(() => (z3(), QU6)), {
        getOAuthHeaders: O
    } = await Promise.resolve().then(() => (VX(), CR6)), {
        default: w
    } = await Promise.resolve().then(() => (CK(), Jf6)), $ = _?.getAccessToken?.() ?? z()?.accessToken;
    if (!$) {
        E("[bridge] No access token for session title update");
        return
    }
    let j = await Y();
    if (!j) {
        E("[bridge] No org UUID for session title update");
        return
    }
    let H = {
            ...O($),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": j
        },
        J = ER(q),
        X = `${_?.baseUrl??A().BASE_API_URL}/v1/sessions/${J}`;
    E(`[bridge] Updating session title: ${J} → ${K}`);
    try {
        let M = await w.patch(X, {
            title: K
        }, {
            headers: H,
            timeout: 1e4,
            validateStatus: (P) => P < 500
        });
        if (M.status === 200) E("[bridge] Session title updated successfully");
        else {
            let P = Du(M.data);
            E(`[bridge] Session title update failed with status ${M.status}${P?`: ${P}`:""}`)
        }
    } catch (M) {
        E(`[bridge] Session title update request failed: ${b6(M)}`)
    }
}
// @from(Ln 464441, Col 4)
rP6 = L(() => {
    K8();
    m8();
    Qe()
})
// @from(Ln 464446, Col 4)
GQK = {}
// @from(Ln 464450, Col 0)
async function cFY(q, K, _) {
    if (Lz()) return q("Cannot rename: This session is a swarm teammate. Teammate names are set by the team leader.", {
        display: "system"
    }), null;
    let z;
    if (!_ || _.trim() === "") {
        let $ = await zr8(H2(K.messages), K.abortController.signal);
        if (!$) return q("Could not generate a name: no conversation context yet. Usage: /rename <name>", {
            display: "system"
        }), null;
        z = $
    } else z = _.trim();
    let Y = I8(),
        A = bY();
    await AN(Y, z, A);
    let w = K.getAppState().replBridgeSessionId;
    if (w) {
        let $ = rb6();
        Promise.resolve().then(() => (rP6(), ax6)).then(({
            updateBridgeSessionTitle: j
        }) => j(w, z, {
            baseUrl: a96(),
            getAccessToken: $ ? () => $ : void 0
        }).catch(() => {}))
    }
    return await oP6(Y, z, A), K.setAppState(($) => ({
        ...$,
        standaloneAgentContext: {
            ...$.standaloneAgentContext,
            name: z
        }
    })), q(`Session renamed to: ${z}`, {
        display: "system"
    }), null
}
// @from(Ln 464485, Col 4)
vQK = L(() => {
    y8();
    qn();
    S_8();
    _7();
    g4();
    zY();
    N27()
})
// @from(Ln 464494, Col 4)
lFY
// @from(Ln 464494, Col 9)
TQK
// @from(Ln 464495, Col 4)
VQK = L(() => {
    lFY = {
        type: "local-jsx",
        name: "rename",
        description: "Rename the current conversation",
        immediate: !0,
        argumentHint: "[name]",
        load: () => Promise.resolve().then(() => (vQK(), GQK))
    }, TQK = lFY
})
// @from(Ln 464506, Col 0)
function ae(q) {
    return !Array.isArray ? SQK(q) === "[object Array]" : Array.isArray(q)
}
// @from(Ln 464510, Col 0)
function iFY(q) {
    if (typeof q == "string") return q;
    let K = q + "";
    return K == "0" && 1 / q == -nFY ? "-0" : K
}
// @from(Ln 464516, Col 0)
function rFY(q) {
    return q == null ? "" : iFY(q)
}
// @from(Ln 464520, Col 0)
function Ln(q) {
    return typeof q === "string"
}
// @from(Ln 464524, Col 0)
function hQK(q) {
    return typeof q === "number"
}
// @from(Ln 464528, Col 0)
function oFY(q) {
    return q === !0 || q === !1 || aFY(q) && SQK(q) == "[object Boolean]"
}
// @from(Ln 464532, Col 0)
function RQK(q) {
    return typeof q === "object"
}
// @from(Ln 464536, Col 0)
function aFY(q) {
    return RQK(q) && q !== null
}
// @from(Ln 464540, Col 0)
function BS(q) {
    return q !== void 0 && q !== null
}
// @from(Ln 464544, Col 0)
function h27(q) {
    return !q.trim().length
}
// @from(Ln 464548, Col 0)
function SQK(q) {
    return q == null ? q === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(q)
}
// @from(Ln 464551, Col 0)
class CQK {
    constructor(q) {
        this._keys = [], this._keyMap = {};
        let K = 0;
        q.forEach((_) => {
            let z = bQK(_);
            this._keys.push(z), this._keyMap[z.id] = z, K += z.weight
        }), this._keys.forEach((_) => {
            _.weight /= K
        })
    }
    get(q) {
        return this._keyMap[q]
    }
    keys() {
        return this._keys
    }
    toJSON() {
        return JSON.stringify(this._keys)
    }
}
// @from(Ln 464573, Col 0)
function bQK(q) {
    let K = null,
        _ = null,
        z = null,
        Y = 1,
        A = null;
    if (Ln(q) || ae(q)) z = q, K = NQK(q), _ = R27(q);
    else {
        if (!kQK.call(q, "name")) throw Error(qgY("name"));
        let O = q.name;
        if (z = O, kQK.call(q, "weight")) {
            if (Y = q.weight, Y <= 0) throw Error(KgY(O))
        }
        K = NQK(O), _ = R27(O), A = q.getFn
    }
    return {
        path: K,
        id: _,
        weight: Y,
        src: z,
        getFn: A
    }
}
// @from(Ln 464597, Col 0)
function NQK(q) {
    return ae(q) ? q : q.split(".")
}
// @from(Ln 464601, Col 0)
function R27(q) {
    return ae(q) ? q.join(".") : q
}
// @from(Ln 464605, Col 0)
function _gY(q, K) {
    let _ = [],
        z = !1,
        Y = (A, O, w) => {
            if (!BS(A)) return;
            if (!O[w]) _.push(A);
            else {
                let $ = O[w],
                    j = A[$];
                if (!BS(j)) return;
                if (w === O.length - 1 && (Ln(j) || hQK(j) || oFY(j))) _.push(rFY(j));
                else if (ae(j)) {
                    z = !0;
                    for (let H = 0, J = j.length; H < J; H += 1) Y(j[H], O, w + 1)
                } else if (O.length) Y(j, O, w + 1)
            }
        };
    return Y(q, Ln(K) ? K.split(".") : K, 0), z ? _ : _[0]
}
// @from(Ln 464625, Col 0)
function $gY(q = 1, K = 3) {
    let _ = new Map,
        z = Math.pow(10, K);
    return {
        get(Y) {
            let A = Y.match(wgY).length;
            if (_.has(A)) return _.get(A);
            let O = 1 / Math.pow(A, 0.5 * q),
                w = parseFloat(Math.round(O * z) / z);
            return _.set(A, w), w
        },
        clear() {
            _.clear()
        }
    }
}
// @from(Ln 464641, Col 0)
class Or8 {
    constructor({
        getFn: q = y9.getFn,
        fieldNormWeight: K = y9.fieldNormWeight
    } = {}) {
        this.norm = $gY(K, 3), this.getFn = q, this.isCreated = !1, this.setIndexRecords()
    }
    setSources(q = []) {
        this.docs = q
    }
    setIndexRecords(q = []) {
        this.records = q
    }
    setKeys(q = []) {
        this.keys = q, this._keysMap = {}, q.forEach((K, _) => {
            this._keysMap[K.id] = _
        })
    }
    create() {
        if (this.isCreated || !this.docs.length) return;
        if (this.isCreated = !0, Ln(this.docs[0])) this.docs.forEach((q, K) => {
            this._addString(q, K)
        });
        else this.docs.forEach((q, K) => {
            this._addObject(q, K)
        });
        this.norm.clear()
    }
    add(q) {
        let K = this.size();
        if (Ln(q)) this._addString(q, K);
        else this._addObject(q, K)
    }
    removeAt(q) {
        this.records.splice(q, 1);
        for (let K = q, _ = this.size(); K < _; K += 1) this.records[K].i -= 1
    }
    getValueForItemAtKeyId(q, K) {
        return q[this._keysMap[K]]
    }
    size() {
        return this.records.length
    }
    _addString(q, K) {
        if (!BS(q) || h27(q)) return;
        let _ = {
            v: q,
            i: K,
            n: this.norm.get(q)
        };
        this.records.push(_)
    }
    _addObject(q, K) {
        let _ = {
            i: K,
            $: {}
        };
        this.keys.forEach((z, Y) => {
            let A = z.getFn ? z.getFn(q) : this.getFn(q, z.path);
            if (!BS(A)) return;
            if (ae(A)) {
                let O = [],
                    w = [{
                        nestedArrIndex: -1,
                        value: A
                    }];
                while (w.length) {
                    let {
                        nestedArrIndex: $,
                        value: j
                    } = w.pop();
                    if (!BS(j)) continue;
                    if (Ln(j) && !h27(j)) {
                        let H = {
                            v: j,
                            i: $,
                            n: this.norm.get(j)
                        };
                        O.push(H)
                    } else if (ae(j)) j.forEach((H, J) => {
                        w.push({
                            nestedArrIndex: J,
                            value: H
                        })
                    })
                }
                _.$[Y] = O
            } else if (Ln(A) && !h27(A)) {
                let O = {
                    v: A,
                    n: this.norm.get(A)
                };
                _.$[Y] = O
            }
        }), this.records.push(_)
    }
    toJSON() {
        return {
            keys: this.keys,
            records: this.records
        }
    }
}
// @from(Ln 464745, Col 0)
function IQK(q, K, {
    getFn: _ = y9.getFn,
    fieldNormWeight: z = y9.fieldNormWeight
} = {}) {
    let Y = new Or8({
        getFn: _,
        fieldNormWeight: z
    });
    return Y.setKeys(q.map(bQK)), Y.setSources(K), Y.create(), Y
}
// @from(Ln 464756, Col 0)
function jgY(q, {
    getFn: K = y9.getFn,
    fieldNormWeight: _ = y9.fieldNormWeight
} = {}) {
    let {
        keys: z,
        records: Y
    } = q, A = new Or8({
        getFn: K,
        fieldNormWeight: _
    });
    return A.setKeys(z), A.setIndexRecords(Y), A
}
// @from(Ln 464770, Col 0)
function Yr8(q, {
    errors: K = 0,
    currentLocation: _ = 0,
    expectedLocation: z = 0,
    distance: Y = y9.distance,
    ignoreLocation: A = y9.ignoreLocation
} = {}) {
    let O = K / q.length;
    if (A) return O;
    let w = Math.abs(z - _);
    if (!Y) return w ? 1 : O;
    return O + w / Y
}
// @from(Ln 464784, Col 0)
function HgY(q = [], K = y9.minMatchCharLength) {
    let _ = [],
        z = -1,
        Y = -1,
        A = 0;
    for (let O = q.length; A < O; A += 1) {
        let w = q[A];
        if (w && z === -1) z = A;
        else if (!w && z !== -1) {
            if (Y = A - 1, Y - z + 1 >= K) _.push([z, Y]);
            z = -1
        }
    }
    if (q[A - 1] && A - z >= K) _.push([z, A - 1]);
    return _
}
// @from(Ln 464801, Col 0)
function JgY(q, K, _, {
    location: z = y9.location,
    distance: Y = y9.distance,
    threshold: A = y9.threshold,
    findAllMatches: O = y9.findAllMatches,
    minMatchCharLength: w = y9.minMatchCharLength,
    includeMatches: $ = y9.includeMatches,
    ignoreLocation: j = y9.ignoreLocation
} = {}) {
    if (K.length > aP6) throw Error(eFY(aP6));
    let H = K.length,
        J = q.length,
        X = Math.max(0, Math.min(z, J)),
        M = A,
        P = X,
        W = w > 1 || $,
        D = W ? Array(J) : [],
        Z;
    while ((Z = q.indexOf(K, P)) > -1) {
        let N = Yr8(K, {
            currentLocation: Z,
            expectedLocation: X,
            distance: Y,
            ignoreLocation: j
        });
        if (M = Math.min(N, M), P = Z + H, W) {
            let R = 0;
            while (R < H) D[Z + R] = 1, R += 1
        }
    }
    P = -1;
    let G = [],
        f = 1,
        v = H + J,
        V = 1 << H - 1;
    for (let N = 0; N < H; N += 1) {
        let R = 0,
            h = v;
        while (R < h) {
            if (Yr8(K, {
                    errors: N,
                    currentLocation: X + h,
                    expectedLocation: X,
                    distance: Y,
                    ignoreLocation: j
                }) <= M) R = h;
            else v = h;
            h = Math.floor((v - R) / 2 + R)
        }
        v = h;
        let C = Math.max(1, X - h + 1),
            x = O ? J : Math.min(X + h, J) + H,
            B = Array(x + 2);
        B[x + 1] = (1 << N) - 1;
        for (let S = x; S >= C; S -= 1) {
            let F = S - 1,
                U = _[q.charAt(F)];
            if (W) D[F] = +!!U;
            if (B[S] = (B[S + 1] << 1 | 1) & U, N) B[S] |= (G[S + 1] | G[S]) << 1 | 1 | G[S + 1];
            if (B[S] & V) {
                if (f = Yr8(K, {
                        errors: N,
                        currentLocation: F,
                        expectedLocation: X,
                        distance: Y,
                        ignoreLocation: j
                    }), f <= M) {
                    if (M = f, P = F, P <= X) break;
                    C = Math.max(1, 2 * X - P)
                }
            }
        }
        if (Yr8(K, {
                errors: N + 1,
                currentLocation: X,
                expectedLocation: X,
                distance: Y,
                ignoreLocation: j
            }) > M) break;
        G = B
    }
    let k = {
        isMatch: P >= 0,
        score: Math.max(0.001, f)
    };
    if (W) {
        let N = HgY(D, w);
        if (!N.length) k.isMatch = !1;
        else if ($) k.indices = N
    }
    return k
}
// @from(Ln 464894, Col 0)
function XgY(q) {
    let K = {};
    for (let _ = 0, z = q.length; _ < z; _ += 1) {
        let Y = q.charAt(_);
        K[Y] = (K[Y] || 0) | 1 << z - _ - 1
    }
    return K
}
// @from(Ln 464902, Col 0)
class u27 {
    constructor(q, {
        location: K = y9.location,
        threshold: _ = y9.threshold,
        distance: z = y9.distance,
        includeMatches: Y = y9.includeMatches,
        findAllMatches: A = y9.findAllMatches,
        minMatchCharLength: O = y9.minMatchCharLength,
        isCaseSensitive: w = y9.isCaseSensitive,
        ignoreLocation: $ = y9.ignoreLocation
    } = {}) {
        if (this.options = {
                location: K,
                threshold: _,
                distance: z,
                includeMatches: Y,
                findAllMatches: A,
                minMatchCharLength: O,
                isCaseSensitive: w,
                ignoreLocation: $
            }, this.pattern = w ? q : q.toLowerCase(), this.chunks = [], !this.pattern.length) return;
        let j = (J, X) => {
                this.chunks.push({
                    pattern: J,
                    alphabet: XgY(J),
                    startIndex: X
                })
            },
            H = this.pattern.length;
        if (H > aP6) {
            let J = 0,
                X = H % aP6,
                M = H - X;
            while (J < M) j(this.pattern.substr(J, aP6), J), J += aP6;
            if (X) {
                let P = H - aP6;
                j(this.pattern.substr(P), P)
            }
        } else j(this.pattern, 0)
    }
    searchIn(q) {
        let {
            isCaseSensitive: K,
            includeMatches: _
        } = this.options;
        if (!K) q = q.toLowerCase();
        if (this.pattern === q) {
            let M = {
                isMatch: !0,
                score: 0
            };
            if (_) M.indices = [
                [0, q.length - 1]
            ];
            return M
        }
        let {
            location: z,
            distance: Y,
            threshold: A,
            findAllMatches: O,
            minMatchCharLength: w,
            ignoreLocation: $
        } = this.options, j = [], H = 0, J = !1;
        this.chunks.forEach(({
            pattern: M,
            alphabet: P,
            startIndex: W
        }) => {
            let {
                isMatch: D,
                score: Z,
                indices: G
            } = JgY(q, M, P, {
                location: z + W,
                distance: Y,
                threshold: A,
                findAllMatches: O,
                minMatchCharLength: w,
                includeMatches: _,
                ignoreLocation: $
            });
            if (D) J = !0;
            if (H += Z, D && G) j = [...j, ...G]
        });
        let X = {
            isMatch: J,
            score: J ? H / this.chunks.length : 1
        };
        if (J && _) X.indices = j;
        return X
    }
}
// @from(Ln 464995, Col 0)
class se {
    constructor(q) {
        this.pattern = q
    }
    static isMultiMatch(q) {
        return EQK(q, this.multiRegex)
    }
    static isSingleMatch(q) {
        return EQK(q, this.singleRegex)
    }
    search() {}
}
// @from(Ln 465008, Col 0)
function EQK(q, K) {
    let _ = q.match(K);
    return _ ? _[1] : null
}
// @from(Ln 465013, Col 0)
function WgY(q, K = {}) {
    return q.split(PgY).map((_) => {
        let z = _.trim().split(MgY).filter((A) => A && !!A.trim()),
            Y = [];
        for (let A = 0, O = z.length; A < O; A += 1) {
            let w = z[A],
                $ = !1,
                j = -1;
            while (!$ && ++j < yQK) {
                let H = S27[j],
                    J = H.isMultiMatch(w);
                if (J) Y.push(new H(J, K)), $ = !0
            }
            if ($) continue;
            j = -1;
            while (++j < yQK) {
                let H = S27[j],
                    J = H.isSingleMatch(w);
                if (J) {
                    Y.push(new H(J, K));
                    break
                }
            }
        }
        return Y
    })
}
// @from(Ln 465040, Col 0)
class gQK {
    constructor(q, {
        isCaseSensitive: K = y9.isCaseSensitive,
        includeMatches: _ = y9.includeMatches,
        minMatchCharLength: z = y9.minMatchCharLength,
        ignoreLocation: Y = y9.ignoreLocation,
        findAllMatches: A = y9.findAllMatches,
        location: O = y9.location,
        threshold: w = y9.threshold,
        distance: $ = y9.distance
    } = {}) {
        this.query = null, this.options = {
            isCaseSensitive: K,
            includeMatches: _,
            minMatchCharLength: z,
            findAllMatches: A,
            ignoreLocation: Y,
            location: O,
            threshold: w,
            distance: $
        }, this.pattern = K ? q : q.toLowerCase(), this.query = WgY(this.pattern, this.options)
    }
    static condition(q, K) {
        return K.useExtendedSearch
    }
    searchIn(q) {
        let K = this.query;
        if (!K) return {
            isMatch: !1,
            score: 1
        };
        let {
            includeMatches: _,
            isCaseSensitive: z
        } = this.options;
        q = z ? q : q.toLowerCase();
        let Y = 0,
            A = [],
            O = 0;
        for (let w = 0, $ = K.length; w < $; w += 1) {
            let j = K[w];
            A.length = 0, Y = 0;
            for (let H = 0, J = j.length; H < J; H += 1) {
                let X = j[H],
                    {
                        isMatch: M,
                        indices: P,
                        score: W
                    } = X.search(q);
                if (M) {
                    if (Y += 1, O += W, _) {
                        let D = X.constructor.type;
                        if (DgY.has(D)) A = [...A, ...P];
                        else A.push(P)
                    }
                } else {
                    O = 0, Y = 0, A.length = 0;
                    break
                }
            }
            if (Y) {
                let H = {
                    isMatch: !0,
                    score: O / Y
                };
                if (_) H.indices = A;
                return H
            }
        }
        return {
            isMatch: !1,
            score: 1
        }
    }
}
// @from(Ln 465116, Col 0)
function ZgY(...q) {
    C27.push(...q)
}
// @from(Ln 465120, Col 0)
function b27(q, K) {
    for (let _ = 0, z = C27.length; _ < z; _ += 1) {
        let Y = C27[_];
        if (Y.condition(q, K)) return new Y(q, K)
    }
    return new u27(q, K)
}
// @from(Ln 465128, Col 0)
function UQK(q, K, {
    auto: _ = !0
} = {}) {
    let z = (Y) => {
        let A = Object.keys(Y),
            O = fgY(Y);
        if (!O && A.length > 1 && !x27(Y)) return z(LQK(Y));
        if (GgY(Y)) {
            let $ = O ? Y[I27.PATH] : A[0],
                j = O ? Y[I27.PATTERN] : Y[$];
            if (!Ln(j)) throw Error(tFY($));
            let H = {
                keyId: R27($),
                pattern: j
            };
            if (_) H.searcher = b27(j, K);
            return H
        }
        let w = {
            children: [],
            operator: A[0]
        };
        return A.forEach(($) => {
            let j = Y[$];
            if (ae(j)) j.forEach((H) => {
                w.children.push(z(H))
            })
        }), w
    };
    if (!x27(q)) q = LQK(q);
    return z(q)
}
// @from(Ln 465161, Col 0)
function vgY(q, {
    ignoreFieldNorm: K = y9.ignoreFieldNorm
}) {
    q.forEach((_) => {
        let z = 1;
        _.matches.forEach(({
            key: Y,
            norm: A,
            score: O
        }) => {
            let w = Y ? Y.weight : null;
            z *= Math.pow(O === 0 && w ? Number.EPSILON : O, (w || 1) * (K ? 1 : A))
        }), _.score = z
    })
}
// @from(Ln 465177, Col 0)
function TgY(q, K) {
    let _ = q.matches;
    if (K.matches = [], !BS(_)) return;
    _.forEach((z) => {
        if (!BS(z.indices) || !z.indices.length) return;
        let {
            indices: Y,
            value: A
        } = z, O = {
            indices: Y,
            value: A
        };
        if (z.key) O.key = z.key.src;
        if (z.idx > -1) O.refIndex = z.idx;
        K.matches.push(O)
    })
}
// @from(Ln 465195, Col 0)
function VgY(q, K) {
    K.score = q.score
}
// @from(Ln 465199, Col 0)
function kgY(q, K, {
    includeMatches: _ = y9.includeMatches,
    includeScore: z = y9.includeScore
} = {}) {
    let Y = [];
    if (_) Y.push(TgY);
    if (z) Y.push(VgY);
    return q.map((A) => {
        let {
            idx: O
        } = A, w = {
            item: K[O],
            refIndex: O
        };
        if (Y.length) Y.forEach(($) => {
            $(A, w)
        });
        return w
    })
}
// @from(Ln 465219, Col 0)
class Lu {
    constructor(q, K = {}, _) {
        this.options = {
            ...y9,
            ...K
        }, this.options.useExtendedSearch, this._keyStore = new CQK(this.options.keys), this.setCollection(q, _)
    }
    setCollection(q, K) {
        if (this._docs = q, K && !(K instanceof Or8)) throw Error(sFY);
        this._myIndex = K || IQK(this.options.keys, this._docs, {
            getFn: this.options.getFn,
            fieldNormWeight: this.options.fieldNormWeight
        })
    }
    add(q) {
        if (!BS(q)) return;
        this._docs.push(q), this._myIndex.add(q)
    }
    remove(q = () => !1) {
        let K = [];
        for (let _ = 0, z = this._docs.length; _ < z; _ += 1) {
            let Y = this._docs[_];
            if (q(Y, _)) this.removeAt(_), _ -= 1, z -= 1, K.push(Y)
        }
        return K
    }
    removeAt(q) {
        this._docs.splice(q, 1), this._myIndex.removeAt(q)
    }
    getIndex() {
        return this._myIndex
    }
    search(q, {
        limit: K = -1
    } = {}) {
        let {
            includeMatches: _,
            includeScore: z,
            shouldSort: Y,
            sortFn: A,
            ignoreFieldNorm: O
        } = this.options, w = Ln(q) ? Ln(this._docs[0]) ? this._searchStringList(q) : this._searchObjectList(q) : this._searchLogical(q);
        if (vgY(w, {
                ignoreFieldNorm: O
            }), Y) w.sort(A);
        if (hQK(K) && K > -1) w = w.slice(0, K);
        return kgY(w, this._docs, {
            includeMatches: _,
            includeScore: z
        })
    }
    _searchStringList(q) {
        let K = b27(q, this.options),
            {
                records: _
            } = this._myIndex,
            z = [];
        return _.forEach(({
            v: Y,
            i: A,
            n: O
        }) => {
            if (!BS(Y)) return;
            let {
                isMatch: w,
                score: $,
                indices: j
            } = K.searchIn(Y);
            if (w) z.push({
                item: Y,
                idx: A,
                matches: [{
                    score: $,
                    value: Y,
                    norm: O,
                    indices: j
                }]
            })
        }), z
    }
    _searchLogical(q) {
        let K = UQK(q, this.options),
            _ = (O, w, $) => {
                if (!O.children) {
                    let {
                        keyId: H,
                        searcher: J
                    } = O, X = this._findMatches({
                        key: this._keyStore.get(H),
                        value: this._myIndex.getValueForItemAtKeyId(w, H),
                        searcher: J
                    });
                    if (X && X.length) return [{
                        idx: $,
                        item: w,
                        matches: X
                    }];
                    return []
                }
                let j = [];
                for (let H = 0, J = O.children.length; H < J; H += 1) {
                    let X = O.children[H],
                        M = _(X, w, $);
                    if (M.length) j.push(...M);
                    else if (O.operator === Ar8.AND) return []
                }
                return j
            },
            z = this._myIndex.records,
            Y = {},
            A = [];
        return z.forEach(({
            $: O,
            i: w
        }) => {
            if (BS(O)) {
                let $ = _(K, O, w);
                if ($.length) {
                    if (!Y[w]) Y[w] = {
                        idx: w,
                        item: O,
                        matches: []
                    }, A.push(Y[w]);
                    $.forEach(({
                        matches: j
                    }) => {
                        Y[w].matches.push(...j)
                    })
                }
            }
        }), A
    }
    _searchObjectList(q) {
        let K = b27(q, this.options),
            {
                keys: _,
                records: z
            } = this._myIndex,
            Y = [];
        return z.forEach(({
            $: A,
            i: O
        }) => {
            if (!BS(A)) return;
            let w = [];
            if (_.forEach(($, j) => {
                    w.push(...this._findMatches({
                        key: $,
                        value: A[j],
                        searcher: K
                    }))
                }), w.length) Y.push({
                idx: O,
                item: A,
                matches: w
            })
        }), Y
    }
    _findMatches({
        key: q,
        value: K,
        searcher: _
    }) {
        if (!BS(K)) return [];
        let z = [];
        if (ae(K)) K.forEach(({
            v: Y,
            i: A,
            n: O
        }) => {
            if (!BS(Y)) return;
            let {
                isMatch: w,
                score: $,
                indices: j
            } = _.searchIn(Y);
            if (w) z.push({
                score: $,
                key: q,
                value: Y,
                idx: A,
                norm: O,
                indices: j
            })
        });
        else {
            let {
                v: Y,
                n: A
            } = K, {
                isMatch: O,
                score: w,
                indices: $
            } = _.searchIn(Y);
            if (O) z.push({
                score: w,
                key: q,
                value: Y,
                norm: A,
                indices: $
            })
        }
        return z
    }
}
// @from(Ln 465424, Col 4)
nFY = 1 / 0
// @from(Ln 465425, Col 4)
sFY = "Incorrect 'index' type"
// @from(Ln 465426, Col 4)
tFY = (q) => `Invalid value for key ${q}`
// @from(Ln 465427, Col 4)
eFY = (q) => `Pattern length exceeds max of ${q}.`
// @from(Ln 465428, Col 4)
qgY = (q) => `Missing ${q} property in key`
// @from(Ln 465429, Col 4)
KgY = (q) => `Property 'weight' in key '${q}' must be a positive integer`
// @from(Ln 465430, Col 4)
kQK
// @from(Ln 465430, Col 9)
zgY
// @from(Ln 465430, Col 14)
YgY
// @from(Ln 465430, Col 19)
AgY
// @from(Ln 465430, Col 24)
OgY
// @from(Ln 465430, Col 29)
y9
// @from(Ln 465430, Col 33)
wgY
// @from(Ln 465430, Col 38)
aP6 = 32
// @from(Ln 465431, Col 4)
xQK
// @from(Ln 465431, Col 9)
uQK
// @from(Ln 465431, Col 14)
mQK
// @from(Ln 465431, Col 19)
BQK
// @from(Ln 465431, Col 24)
pQK
// @from(Ln 465431, Col 29)
FQK
// @from(Ln 465431, Col 34)
m27
// @from(Ln 465431, Col 39)
B27
// @from(Ln 465431, Col 44)
S27
// @from(Ln 465431, Col 49)
yQK
// @from(Ln 465431, Col 54)
MgY
// @from(Ln 465431, Col 59)
PgY = "|"
// @from(Ln 465432, Col 4)
DgY
// @from(Ln 465432, Col 9)
C27
// @from(Ln 465432, Col 14)
Ar8
// @from(Ln 465432, Col 19)
I27
// @from(Ln 465432, Col 24)
x27 = (q) => !!(q[Ar8.AND] || q[Ar8.OR])
// @from(Ln 465433, Col 4)
fgY = (q) => !!q[I27.PATH]
// @from(Ln 465434, Col 4)
GgY = (q) => !ae(q) && RQK(q) && !x27(q)
// @from(Ln 465435, Col 4)
LQK = (q) => ({
        [Ar8.AND]: Object.keys(q).map((K) => ({
            [K]: q[K]
        }))
    })