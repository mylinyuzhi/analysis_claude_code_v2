
// @from(Ln 177927, Col 0)
class pI1 {
    yoga;
    constructor(q) {
        this.yoga = q
    }
    insertChild(q, K) {
        this.yoga.insertChild(q.yoga, K)
    }
    removeChild(q) {
        this.yoga.removeChild(q.yoga)
    }
    getChildCount() {
        return this.yoga.getChildCount()
    }
    getParent() {
        let q = this.yoga.getParent();
        return q ? new pI1(q) : null
    }
    calculateLayout(q, K) {
        this.yoga.calculateLayout(q, void 0, 1)
    }
    setMeasureFunc(q) {
        this.yoga.setMeasureFunc(q)
    }
    unsetMeasureFunc() {
        this.yoga.unsetMeasureFunc()
    }
    markDirty() {
        this.yoga.markDirty()
    }
    getComputedLeft() {
        return this.yoga.getComputedLeft()
    }
    getComputedTop() {
        return this.yoga.getComputedTop()
    }
    getComputedWidth() {
        return this.yoga.getComputedWidth()
    }
    getComputedHeight() {
        return this.yoga.getComputedHeight()
    }
    getComputedBorder(q) {
        return this.yoga.getComputedBorder(q)
    }
    getComputedPadding(q) {
        return this.yoga.getComputedPadding(q)
    }
    setWidth(q) {
        this.yoga.setWidth(q)
    }
    setWidthPercent(q) {
        this.yoga.setWidthPercent(q)
    }
    setWidthAuto() {
        this.yoga.setWidthAuto()
    }
    setHeight(q) {
        this.yoga.setHeight(q)
    }
    setHeightPercent(q) {
        this.yoga.setHeightPercent(q)
    }
    setHeightAuto() {
        this.yoga.setHeightAuto()
    }
    setMinWidth(q) {
        this.yoga.setMinWidth(q)
    }
    setMinWidthPercent(q) {
        this.yoga.setMinWidthPercent(q)
    }
    setMinHeight(q) {
        this.yoga.setMinHeight(q)
    }
    setMinHeightPercent(q) {
        this.yoga.setMinHeightPercent(q)
    }
    setMaxWidth(q) {
        this.yoga.setMaxWidth(q)
    }
    setMaxWidthPercent(q) {
        this.yoga.setMaxWidthPercent(q)
    }
    setMaxHeight(q) {
        this.yoga.setMaxHeight(q)
    }
    setMaxHeightPercent(q) {
        this.yoga.setMaxHeightPercent(q)
    }
    setFlexDirection(q) {
        this.yoga.setFlexDirection(q)
    }
    setFlexGrow(q) {
        this.yoga.setFlexGrow(q)
    }
    setFlexShrink(q) {
        this.yoga.setFlexShrink(q)
    }
    setFlexBasis(q) {
        this.yoga.setFlexBasis(q)
    }
    setFlexBasisPercent(q) {
        this.yoga.setFlexBasisPercent(q)
    }
    setFlexWrap(q) {
        this.yoga.setFlexWrap(q)
    }
    setAlignItems(q) {
        this.yoga.setAlignItems(q)
    }
    setAlignSelf(q) {
        this.yoga.setAlignSelf(q)
    }
    setJustifyContent(q) {
        this.yoga.setJustifyContent(q)
    }
    setDisplay(q) {
        this.yoga.setDisplay(q)
    }
    getDisplay() {
        return this.yoga.getDisplay()
    }
    setPositionType(q) {
        this.yoga.setPositionType(q)
    }
    setPosition(q, K) {
        this.yoga.setPosition(q, K)
    }
    setPositionPercent(q, K) {
        this.yoga.setPositionPercent(q, K)
    }
    setOverflow(q) {
        this.yoga.setOverflow(q)
    }
    setMargin(q, K) {
        this.yoga.setMargin(q, K)
    }
    setMarginAuto(q) {
        this.yoga.setMarginAuto(q)
    }
    setPadding(q, K) {
        this.yoga.setPadding(q, K)
    }
    setBorder(q, K) {
        this.yoga.setBorder(q, K)
    }
    setGap(q, K) {
        this.yoga.setGap(q, K)
    }
    free() {
        this.yoga.free()
    }
    freeRecursive() {
        this.yoga.freeRecursive()
    }
}
// @from(Ln 178085, Col 0)
function D54() {
    return new pI1(nK4.Node.create())
}
// @from(Ln 178088, Col 4)
Z54 = L(() => {
    GN8()
})
// @from(Ln 178092, Col 0)
function f54() {
    return D54()
}
// @from(Ln 178095, Col 4)
G54 = L(() => {
    Z54()
})
// @from(Ln 178098, Col 4)
ZN6 = L(() => {
    YI1()
})
// @from(Ln 178102, Col 0)
function hN8(q) {
    let K = LN8.get(q);
    if (K !== void 0) return K;
    let _ = N1(q);
    if (LN8.size >= RR_) LN8.clear();
    return LN8.set(q, _), _
}
// @from(Ln 178109, Col 4)
LN8
// @from(Ln 178109, Col 9)
RR_ = 4096
// @from(Ln 178110, Col 4)
FI1 = L(() => {
    n5();
    LN8 = new Map
})
// @from(Ln 178115, Col 0)
function SR_(q, K) {
    if (q.length === 0) return {
        width: 0,
        height: 0
    };
    let _ = K <= 0 || !Number.isFinite(K),
        z = 0,
        Y = 0,
        A = 0;
    while (A <= q.length) {
        let O = q.indexOf(`
`, A),
            w = O === -1 ? q.substring(A) : q.substring(A, O),
            $ = hN8(w);
        if (Y = Math.max(Y, $), _) z++;
        else z += $ === 0 ? 1 : Math.ceil($ / K);
        if (O === -1) break;
        A = O + 1
    }
    return {
        width: Y,
        height: z
    }
}
// @from(Ln 178139, Col 4)
fN6
// @from(Ln 178140, Col 4)
gI1 = L(() => {
    FI1();
    fN6 = SR_
})
// @from(Ln 178145, Col 0)
function v54(q, K, _) {
    let z = ya6.get(q);
    if (z) z.push(K);
    else ya6.set(q, [K]);
    if (_) UI1 = !0
}
// @from(Ln 178152, Col 0)
function T54() {
    let q = UI1;
    return UI1 = !1, q
}
// @from(Ln 178156, Col 4)
S$
// @from(Ln 178156, Col 8)
ya6
// @from(Ln 178156, Col 13)
UI1 = !1
// @from(Ln 178157, Col 4)
v$6 = L(() => {
    S$ = new WeakMap, ya6 = new WeakMap
})
// @from(Ln 178161, Col 0)
function RN8(q, K = {}, _, z = []) {
    let Y = q.textStyles ? {
        ...K,
        ...q.textStyles
    } : K;
    for (let A of q.childNodes) {
        if (A === void 0) continue;
        if (A.nodeName === "#text") {
            if (A.nodeValue.length > 0) z.push({
                text: A.nodeValue,
                styles: Y,
                hyperlink: _
            })
        } else if (A.nodeName === "ink-text" || A.nodeName === "ink-virtual-text") RN8(A, Y, _, z);
        else if (A.nodeName === "ink-link") {
            let O = A.attributes.href;
            RN8(A, Y, O || _, z)
        }
    }
    return z
}
// @from(Ln 178183, Col 0)
function QI1(q) {
    let K = "";
    for (let _ of q.childNodes) {
        if (_ === void 0) continue;
        if (_.nodeName === "#text") K += _.nodeValue;
        else if (_.nodeName === "ink-text" || _.nodeName === "ink-virtual-text") K += QI1(_);
        else if (_.nodeName === "ink-link") K += QI1(_)
    }
    return K
}
// @from(Ln 178193, Col 4)
V54
// @from(Ln 178194, Col 4)
dI1 = L(() => {
    V54 = QI1
})
// @from(Ln 178198, Col 0)
function k54(q, K = CR_) {
    if (!q.includes("\t")) return q;
    let _ = T46(),
        z = _.feed(q);
    z.push(..._.flush());
    let Y = "",
        A = 0;
    for (let O of z)
        if (O.type === "sequence") Y += O.value;
        else {
            let w = O.value.split(/(\t|\n)/);
            for (let $ of w)
                if ($ === "\t") {
                    let j = K - A % K;
                    Y += " ".repeat(j), A += j
                } else if ($ === `
`) Y += $, A = 0;
            else Y += $, A += N1($)
        } return Y
}
// @from(Ln 178218, Col 4)
CR_ = 8
// @from(Ln 178219, Col 4)
N54 = L(() => {
    n5();
    va6()
})
// @from(Ln 178224, Col 0)
function xR_() {
    let q = new Map;
    for (let [K, _] of Object.entries(HH)) {
        for (let [z, Y] of Object.entries(_)) HH[z] = {
            open: `\x1B[${Y[0]}m`,
            close: `\x1B[${Y[1]}m`
        }, _[z] = HH[z], q.set(Y[0], Y[1]);
        Object.defineProperty(HH, K, {
            value: _,
            enumerable: !1
        })
    }
    return Object.defineProperty(HH, "codes", {
        value: q,
        enumerable: !1
    }), HH.color.close = "\x1B[39m", HH.bgColor.close = "\x1B[49m", HH.color.ansi = E54(), HH.color.ansi256 = y54(), HH.color.ansi16m = L54(), HH.bgColor.ansi = E54(10), HH.bgColor.ansi256 = y54(10), HH.bgColor.ansi16m = L54(10), Object.defineProperties(HH, {
        rgbToAnsi256: {
            value: (K, _, z) => {
                if (K === _ && _ === z) {
                    if (K < 8) return 16;
                    if (K > 248) return 231;
                    return Math.round((K - 8) / 247 * 24) + 232
                }
                return 16 + 36 * Math.round(K / 255 * 5) + 6 * Math.round(_ / 255 * 5) + Math.round(z / 255 * 5)
            },
            enumerable: !1
        },
        hexToRgb: {
            value: (K) => {
                let _ = /[a-f\d]{6}|[a-f\d]{3}/i.exec(K.toString(16));
                if (!_) return [0, 0, 0];
                let [z] = _;
                if (z.length === 3) z = [...z].map((A) => A + A).join("");
                let Y = Number.parseInt(z, 16);
                return [Y >> 16 & 255, Y >> 8 & 255, Y & 255]
            },
            enumerable: !1
        },
        hexToAnsi256: {
            value: (K) => HH.rgbToAnsi256(...HH.hexToRgb(K)),
            enumerable: !1
        },
        ansi256ToAnsi: {
            value: (K) => {
                if (K < 8) return 30 + K;
                if (K < 16) return 90 + (K - 8);
                let _, z, Y;
                if (K >= 232) _ = ((K - 232) * 10 + 8) / 255, z = _, Y = _;
                else {
                    K -= 16;
                    let w = K % 36;
                    _ = Math.floor(K / 36) / 5, z = Math.floor(w / 6) / 5, Y = w % 6 / 5
                }
                let A = Math.max(_, z, Y) * 2;
                if (A === 0) return 30;
                let O = 30 + (Math.round(Y) << 2 | Math.round(z) << 1 | Math.round(_));
                if (A === 2) O += 60;
                return O
            },
            enumerable: !1
        },
        rgbToAnsi: {
            value: (K, _, z) => HH.ansi256ToAnsi(HH.rgbToAnsi256(K, _, z)),
            enumerable: !1
        },
        hexToAnsi: {
            value: (K) => HH.ansi256ToAnsi(HH.hexToAnsi256(K)),
            enumerable: !1
        }
    }), HH
}
// @from(Ln 178295, Col 4)
E54 = (q = 0) => (K) => `\x1B[${K+q}m`
// @from(Ln 178296, Col 4)
y54 = (q = 0) => (K) => `\x1B[${38+q};5;${K}m`
// @from(Ln 178297, Col 4)
L54 = (q = 0) => (K, _, z) => `\x1B[${38+q};2;${K};${_};${z}m`
// @from(Ln 178298, Col 4)
HH
// @from(Ln 178298, Col 8)
l6w
// @from(Ln 178298, Col 13)
bR_
// @from(Ln 178298, Col 18)
IR_
// @from(Ln 178298, Col 23)
n6w
// @from(Ln 178298, Col 28)
uR_
// @from(Ln 178298, Col 33)
PD
// @from(Ln 178299, Col 4)
SN8 = L(() => {
    HH = {
        modifier: {
            reset: [0, 0],
            bold: [1, 22],
            dim: [2, 22],
            italic: [3, 23],
            underline: [4, 24],
            overline: [53, 55],
            inverse: [7, 27],
            hidden: [8, 28],
            strikethrough: [9, 29]
        },
        color: {
            black: [30, 39],
            red: [31, 39],
            green: [32, 39],
            yellow: [33, 39],
            blue: [34, 39],
            magenta: [35, 39],
            cyan: [36, 39],
            white: [37, 39],
            blackBright: [90, 39],
            gray: [90, 39],
            grey: [90, 39],
            redBright: [91, 39],
            greenBright: [92, 39],
            yellowBright: [93, 39],
            blueBright: [94, 39],
            magentaBright: [95, 39],
            cyanBright: [96, 39],
            whiteBright: [97, 39]
        },
        bgColor: {
            bgBlack: [40, 49],
            bgRed: [41, 49],
            bgGreen: [42, 49],
            bgYellow: [43, 49],
            bgBlue: [44, 49],
            bgMagenta: [45, 49],
            bgCyan: [46, 49],
            bgWhite: [47, 49],
            bgBlackBright: [100, 49],
            bgGray: [100, 49],
            bgGrey: [100, 49],
            bgRedBright: [101, 49],
            bgGreenBright: [102, 49],
            bgYellowBright: [103, 49],
            bgBlueBright: [104, 49],
            bgMagentaBright: [105, 49],
            bgCyanBright: [106, 49],
            bgWhiteBright: [107, 49]
        }
    }, l6w = Object.keys(HH.modifier), bR_ = Object.keys(HH.color), IR_ = Object.keys(HH.bgColor), n6w = [...bR_, ...IR_];
    uR_ = xR_(), PD = uR_
})
// @from(Ln 178356, Col 0)
function nI1(q) {
    if (CN8.has(q)) return q;
    if (cI1.has(q)) return cI1.get(q);
    if (q.startsWith(bN8)) return mR_;
    if (q = q.slice(2), q.startsWith("38")) return PD.color.close;
    else if (q.startsWith("48")) return PD.bgColor.close;
    let K = PD.codes.get(parseInt(q, 10));
    if (K) return PD.color.ansi(K);
    else return PD.reset.open
}
// @from(Ln 178367, Col 0)
function HR(q) {
    return q.map((K) => K.code).join("")
}
// @from(Ln 178370, Col 4)
h54
// @from(Ln 178370, Col 9)
R54
// @from(Ln 178370, Col 14)
S54
// @from(Ln 178370, Col 19)
CN8
// @from(Ln 178370, Col 24)
cI1
// @from(Ln 178370, Col 29)
bN8 = "\x1B]8;;"
// @from(Ln 178371, Col 4)
lI1
// @from(Ln 178371, Col 9)
C54 = "\x07"
// @from(Ln 178372, Col 4)
o6w
// @from(Ln 178372, Col 9)
mR_
// @from(Ln 178373, Col 4)
La6 = L(() => {
    SN8();
    h54 = new Set([27, 155]), R54 = "[".codePointAt(0), S54 = "]".codePointAt(0), CN8 = new Set, cI1 = new Map;
    for (let [q, K] of PD.codes) CN8.add(PD.color.ansi(K)), cI1.set(PD.color.ansi(q), PD.color.ansi(K));
    lI1 = bN8.split("").map((q) => q.charCodeAt(0)), o6w = C54.charCodeAt(0), mR_ = `\x1B]8;;${C54}`
})
// @from(Ln 178380, Col 0)
function N46(q) {
    return IN8([], q)
}
// @from(Ln 178384, Col 0)
function IN8(q, K) {
    let _ = [...q];
    for (let z of K)
        if (z.code === PD.reset.open) _ = [];
        else if (CN8.has(z.code)) _ = _.filter((Y) => Y.endCode !== z.code);
    else if (z.code === PD.bold.open || z.code === PD.dim.open) {
        if (!_.find((A) => A.code === z.code && A.endCode === z.endCode)) _.push(z)
    } else _ = _.filter((A) => A.endCode !== z.endCode), _.push(z);
    return _
}
// @from(Ln 178394, Col 4)
xN8 = L(() => {
    SN8();
    La6()
})
// @from(Ln 178399, Col 0)
function T$6(q) {
    return N46(q).reverse().map((K) => ({
        ...K,
        code: K.endCode
    }))
}
// @from(Ln 178405, Col 4)
iI1 = L(() => {
    xN8()
})
// @from(Ln 178409, Col 0)
function V$6(q, K) {
    let _ = new Set(K.map((Y) => Y.endCode)),
        z = new Set(q.map((Y) => Y.code));
    return [...T$6(q.filter((Y) => !_.has(Y.endCode))), ...K.filter((Y) => !z.has(Y.code))]
}
// @from(Ln 178414, Col 4)
rI1 = L(() => {
    iI1()
})
// @from(Ln 178418, Col 0)
function b54(q) {
    let K = [],
        _ = [];
    for (let z of q)
        if (z.type === "ansi") K = IN8(K, [z]);
        else if (z.type === "char") _.push({
        ...z,
        styles: [...K]
    });
    return _
}
// @from(Ln 178429, Col 4)
I54 = L(() => {
    La6();
    rI1();
    xN8()
})
// @from(Ln 178435, Col 0)
function oI1(q) {
    if (!Number.isInteger(q)) return !1;
    return zF6(q) || YF6(q)
}
// @from(Ln 178439, Col 4)
x54 = L(() => {
    q28()
})
// @from(Ln 178443, Col 0)
function BR_(q, K) {
    q = q.slice(K);
    for (let z = 1; z < lI1.length; z++)
        if (q.charCodeAt(z) !== lI1[z]) return;
    let _ = q.indexOf("\x07", bN8.length);
    if (_ === -1) return;
    return q.slice(0, _ + 1)
}
// @from(Ln 178452, Col 0)
function QR_(q) {
    for (let K = 2; K < q.length; K++) {
        let _ = q.charCodeAt(K);
        if (_ === UR_) return K;
        if (_ === gR_) continue;
        if (_ >= pR_ && _ <= FR_) continue;
        break
    }
    return -1
}
// @from(Ln 178463, Col 0)
function dR_(q, K) {
    q = q.slice(K);
    let _ = QR_(q);
    if (_ === -1) return;
    return q.slice(0, _ + 1)
}
// @from(Ln 178470, Col 0)
function cR_(q) {
    if (!q.includes(";")) return [q];
    let K = q.slice(2, -1).split(";"),
        _ = [];
    for (let z = 0; z < K.length; z++) {
        let Y = K[z];
        if (Y === "38" || Y === "48") {
            if (z + 2 < K.length && K[z + 1] === "5") {
                _.push(K.slice(z, z + 3).join(";")), z += 2;
                continue
            } else if (z + 4 < K.length && K[z + 1] === "2") {
                _.push(K.slice(z, z + 5).join(";")), z += 4;
                continue
            }
        }
        _.push(Y)
    }
    return _.map((z) => `\x1B[${z}m`)
}
// @from(Ln 178490, Col 0)
function GN6(q, K = Number.POSITIVE_INFINITY) {
    let _ = [],
        z = 0,
        Y = 0;
    while (z < q.length) {
        let A = q.codePointAt(z);
        if (h54.has(A)) {
            let $, j = q.codePointAt(z + 1);
            if (j === S54) {
                if ($ = BR_(q, z), $) _.push({
                    type: "ansi",
                    code: $,
                    endCode: nI1($)
                })
            } else if (j === R54) {
                if ($ = dR_(q, z), $) {
                    let H = cR_($);
                    for (let J of H) _.push({
                        type: "ansi",
                        code: J,
                        endCode: nI1(J)
                    })
                }
            }
            if ($) {
                z += $.length;
                continue
            }
        }
        let O = oI1(A),
            w = String.fromCodePoint(A);
        if (_.push({
                type: "char",
                value: w,
                fullWidth: O
            }), z += w.length, Y += O ? 2 : w.length, Y >= K) break
    }
    return _
}
// @from(Ln 178529, Col 4)
pR_ = 48
// @from(Ln 178530, Col 4)
FR_ = 57
// @from(Ln 178531, Col 4)
gR_ = 59
// @from(Ln 178532, Col 4)
UR_ = 109
// @from(Ln 178533, Col 4)
u54 = L(() => {
    x54();
    La6()
})
// @from(Ln 178537, Col 4)
vN6 = L(() => {
    La6();
    rI1();
    xN8();
    iI1();
    I54();
    u54()
})
// @from(Ln 178546, Col 0)
function nR_(q) {
    let K = T46(),
        _ = [...K.feed(q), ...K.flush()],
        z = [];
    for (let Y of _) {
        if (Y.type === "text") {
            for (let O of Y.value) z.push({
                type: "char",
                value: O
            });
            continue
        }
        let A = Y.value;
        if (A.charCodeAt(1) === $R.CSI && A.endsWith("m")) {
            for (let O of GN6(A))
                if (O.type === "ansi") z.push(O)
        } else if (A.startsWith("\x1B]8;") && (A.endsWith(dE) || A.endsWith(m54))) {
            let O = A.endsWith(m54) ? A.slice(0, -2) + dE : A;
            z.push({
                type: "ansi",
                code: O,
                endCode: lR_
            })
        }
    }
    return z
}
// @from(Ln 178574, Col 0)
function iR_(q) {
    return q.code === q.endCode
}
// @from(Ln 178578, Col 0)
function B54(q) {
    return q.filter((K) => !iR_(K))
}
// @from(Ln 178582, Col 0)
function vf(q, K, _) {
    let z = nR_(q),
        Y = [],
        A = 0,
        O = "",
        w = !1;
    for (let j of z) {
        let H = j.type === "ansi" ? 0 : N1(j.value);
        if (_ !== void 0 && A >= _) {
            if (j.type === "ansi" || H > 0 || !w) break
        }
        if (j.type === "ansi") {
            if (Y.push(j), w) O += j.code
        } else {
            if (!w && A >= K) {
                if (K > 0 && H === 0) continue;
                w = !0, Y = B54(N46(Y)), O = HR(Y)
            }
            if (w) O += j.value;
            A += H
        }
    }
    let $ = B54(N46(Y));
    return O += HR(T$6($)), O
}
// @from(Ln 178607, Col 4)
m54 = "\x1B\\"
// @from(Ln 178608, Col 4)
lR_
// @from(Ln 178609, Col 4)
k$6 = L(() => {
    vN6();
    n5();
    Z46();
    va6();
    lR_ = `\x1B]8;;${dE}`
})
// @from(Ln 178616, Col 4)
F54 = p((E8w, p54) => {
    p54.exports = () => {
        return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE89\uDE8F-\uDEC2\uDEC6\uDECE-\uDEDC\uDEDF-\uDEE9]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g
    }
})
// @from(Ln 178622, Col 0)
function N$6(q, K = {}) {
    if (typeof q !== "string" || q.length === 0) return 0;
    let {
        ambiguousIsNarrow: _ = !0,
        countAnsiEscapeCodes: z = !1
    } = K;
    if (!z) q = LY6(q);
    if (q.length === 0) return 0;
    let Y = 0,
        A = {
            ambiguousAsWide: !_
        };
    for (let {
            segment: O
        }
        of rR_.segment(q)) {
        let w = O.codePointAt(0);
        if (w <= 31 || w >= 127 && w <= 159) continue;
        if (w >= 8203 && w <= 8207 || w === 65279) continue;
        if (w >= 768 && w <= 879 || w >= 6832 && w <= 6911 || w >= 7616 && w <= 7679 || w >= 8400 && w <= 8447 || w >= 65056 && w <= 65071) continue;
        if (w >= 55296 && w <= 57343) continue;
        if (w >= 65024 && w <= 65039) continue;
        if (oR_.test(O)) continue;
        if (g54.default().test(O)) {
            Y += 2;
            continue
        }
        Y += AF6(w, A)
    }
    return Y
}
// @from(Ln 178653, Col 4)
g54
// @from(Ln 178653, Col 9)
rR_
// @from(Ln 178653, Col 14)
oR_
// @from(Ln 178654, Col 4)
U54 = L(() => {
    K28();
    q28();
    g54 = K6(F54(), 1), rR_ = new Intl.Segmenter, oR_ = /^\p{Default_Ignorable_Code_Point}$/u
})
// @from(Ln 178660, Col 0)
function tI1(q, K, _) {
    return String(q).normalize().replaceAll(`\r
`, `
`).split(`
`).map((z) => qS_(z, K, _)).join(`
`)
}
// @from(Ln 178667, Col 4)
mN8
// @from(Ln 178667, Col 9)
aR_ = 39
// @from(Ln 178668, Col 4)
sI1 = "\x07"
// @from(Ln 178669, Col 4)
c54 = "["
// @from(Ln 178670, Col 4)
sR_ = "]"
// @from(Ln 178671, Col 4)
l54 = "m"
// @from(Ln 178672, Col 4)
uN8
// @from(Ln 178672, Col 9)
Q54 = (q) => `${mN8.values().next().value}${c54}${q}${l54}`
// @from(Ln 178673, Col 4)
d54 = (q) => `${mN8.values().next().value}${uN8}${q}${sI1}`
// @from(Ln 178674, Col 4)
tR_ = (q) => q.split(" ").map((K) => N$6(K))
// @from(Ln 178675, Col 4)
aI1 = (q, K, _) => {
        let z = [...K],
            Y = !1,
            A = !1,
            O = N$6(LY6(q.at(-1)));
        for (let [w, $] of z.entries()) {
            let j = N$6($);
            if (O + j <= _) q[q.length - 1] += $;
            else q.push($), O = 0;
            if (mN8.has($)) Y = !0, A = z.slice(w + 1, w + 1 + uN8.length).join("") === uN8;
            if (Y) {
                if (A) {
                    if ($ === sI1) Y = !1, A = !1
                } else if ($ === l54) Y = !1;
                continue
            }
            if (O += j, O === _ && w < z.length - 1) q.push(""), O = 0
        }
        if (!O && q.at(-1).length > 0 && q.length > 1) q[q.length - 2] += q.pop()
    }
// @from(Ln 178695, Col 4)
eR_ = (q) => {
        let K = q.split(" "),
            _ = K.length;
        while (_ > 0) {
            if (N$6(K[_ - 1]) > 0) break;
            _--
        }
        if (_ === K.length) return q;
        return K.slice(0, _).join(" ") + K.slice(_).join("")
    }
// @from(Ln 178705, Col 4)
qS_ = (q, K, _ = {}) => {
        if (_.trim !== !1 && q.trim() === "") return "";
        let z = "",
            Y, A, O = tR_(q),
            w = [""];
        for (let [J, X] of q.split(" ").entries()) {
            if (_.trim !== !1) w[w.length - 1] = w.at(-1).trimStart();
            let M = N$6(w.at(-1));
            if (J !== 0) {
                if (M >= K && (_.wordWrap === !1 || _.trim === !1)) w.push(""), M = 0;
                if (M > 0 || _.trim === !1) w[w.length - 1] += " ", M++
            }
            if (_.hard && O[J] > K) {
                let P = K - M,
                    W = 1 + Math.floor((O[J] - P - 1) / K);
                if (Math.floor((O[J] - 1) / K) < W) w.push("");
                aI1(w, X, K);
                continue
            }
            if (M + O[J] > K && M > 0 && O[J] > 0) {
                if (_.wordWrap === !1 && M < K) {
                    aI1(w, X, K);
                    continue
                }
                w.push("")
            }
            if (M + O[J] > K && _.wordWrap === !1) {
                aI1(w, X, K);
                continue
            }
            w[w.length - 1] += X
        }
        if (_.trim !== !1) w = w.map((J) => eR_(J));
        let $ = w.join(`
`),
            j = [...$],
            H = 0;
        for (let [J, X] of j.entries()) {
            if (z += X, mN8.has(X)) {
                let {
                    groups: P
                } = new RegExp(`(?:\\${c54}(?<code>\\d+)m|\\${uN8}(?<uri>.*)${sI1})`).exec($.slice(H)) || {
                    groups: {}
                };
                if (P.code !== void 0) {
                    let W = Number.parseFloat(P.code);
                    Y = W === aR_ ? void 0 : W
                } else if (P.uri !== void 0) A = P.uri.length === 0 ? void 0 : P.uri
            }
            let M = PD.codes.get(Number(Y));
            if (j[J + 1] === `
`) {
                if (A) z += d54("");
                if (Y && M) z += Q54(M)
            } else if (X === `
`) {
                if (Y && M) z += Q54(Y);
                if (A) z += d54(A)
            }
            H += X.length
        }
        return z
    }
// @from(Ln 178768, Col 4)
n54 = L(() => {
    U54();
    K28();
    SN8();
    mN8 = new Set(["\x1B", ""]), uN8 = `${sR_}8;;`
})
// @from(Ln 178775, Col 0)
function E46(q, K, _) {
    if (!(K > 0)) return q;
    return _S_(q, K, _)
}
// @from(Ln 178779, Col 4)
KS_
// @from(Ln 178779, Col 9)
_S_
// @from(Ln 178780, Col 4)
ha6 = L(() => {
    n54();
    KS_ = typeof Bun < "u" && typeof Bun.wrapAnsi === "function" ? Bun.wrapAnsi : null, _S_ = KS_ ?? tI1
})
// @from(Ln 178785, Col 0)
function pN8(q, K, _) {
    let z = vf(q, K, _);
    return N1(z) > _ - K ? vf(q, K, _ - 1) : z
}
// @from(Ln 178790, Col 0)
function zS_(q, K, _) {
    if (K < 1) return "";
    if (K === 1) return BN8;
    let z = N1(q);
    if (z <= K) return q;
    if (_ === "start") return BN8 + pN8(q, z - K + 1, z);
    if (_ === "middle") {
        let Y = Math.floor(K / 2);
        return pN8(q, 0, Y) + BN8 + pN8(q, z - (K - Y) + 1, z)
    }
    return pN8(q, 0, K - 1) + BN8
}
// @from(Ln 178803, Col 0)
function JR(q, K, _ = "wrap") {
    if (_ === "wrap") return E46(q, K, {
        trim: !1,
        hard: !0
    });
    if (_ === "wrap-trim") return E46(q, K, {
        trim: !0,
        hard: !0
    });
    if (_ === "end" || _ === "middle" || _.startsWith("truncate")) {
        let z = "end";
        if (_ === "truncate-middle" || _ === "middle") z = "middle";
        if (_ === "truncate-start") z = "start";
        return zS_(q, K, z)
    }
    return q
}
// @from(Ln 178820, Col 4)
BN8 = "…"
// @from(Ln 178821, Col 4)
FN8 = L(() => {
    k$6();
    n5();
    ha6()
})
// @from(Ln 178827, Col 0)
function eI1(q) {
    let K = q;
    while (K && !K.hasAbsoluteDescendant) K.hasAbsoluteDescendant = !0, K = K.parentNode
}
// @from(Ln 178832, Col 0)
function i54(q, K, _ = !1) {
    if (K.nodeName === "#text") return;
    let z = K,
        Y = _ || z.style.position === "absolute",
        A = S$.get(z);
    if (A) v54(q, A, Y), S$.delete(z);
    for (let O of z.childNodes) i54(q, O, Y)
}
// @from(Ln 178841, Col 0)
function YS_(q, K) {
    return o54(q, K)
}
// @from(Ln 178845, Col 0)
function o54(q, K) {
    if (q === K) return !0;
    if (q === void 0 || K === void 0) return !1;
    let _ = Object.keys(q),
        z = Object.keys(K);
    if (_.length !== z.length) return !1;
    for (let Y of _)
        if (!Object.hasOwn(K, Y) || q[Y] !== K[Y]) return !1;
    return !0
}
// @from(Ln 178856, Col 0)
function wS_(q) {
    return q.nodeName !== "#text"
}
// @from(Ln 178860, Col 0)
function t54(q, K) {
    let _ = [];
    return z(q, 0), _;

    function z(Y, A) {
        let O = Y.yogaNode;
        if (!O || O.getDisplay() === 1) return;
        let w = A + O.getComputedTop(),
            $ = O.getComputedHeight();
        if (K < w || K >= w + $) return;
        if (Y.debugOwnerChain) _ = Y.debugOwnerChain;
        for (let j of Y.childNodes)
            if (wS_(j)) z(j, w)
    }
}
// @from(Ln 178875, Col 4)
Ra6 = (q) => {
        let _ = {
            nodeName: q,
            style: {},
            attributes: {},
            childNodes: [],
            parentNode: void 0,
            yogaNode: q !== "ink-virtual-text" && q !== "ink-link" && q !== "ink-progress" ? f54() : void 0,
            dirty: !1
        };
        if (q === "ink-text") _.yogaNode?.setMeasureFunc(AS_.bind(null, _));
        else if (q === "ink-raw-ansi") _.yogaNode?.setMeasureFunc(OS_.bind(null, _));
        return _
    }
// @from(Ln 178889, Col 4)
gN8 = (q, K) => {
        if (K.parentNode) Sa6(K.parentNode, K);
        if (K.parentNode = q, q.childNodes.push(K), K.yogaNode) q.yogaNode?.insertChild(K.yogaNode, q.yogaNode.getChildCount());
        if (K.style.position === "absolute" || K.hasAbsoluteDescendant) eI1(q);
        WD(q)
    }
// @from(Ln 178895, Col 4)
qx1 = (q, K, _) => {
        if (K.parentNode) Sa6(K.parentNode, K);
        if (K.parentNode = q, K.style.position === "absolute" || K.nodeName !== "#text" && K.hasAbsoluteDescendant) eI1(q);
        let z = q.childNodes.indexOf(_);
        if (z >= 0) {
            let Y = 0;
            if (K.yogaNode && q.yogaNode) {
                for (let A = 0; A < z; A++)
                    if (q.childNodes[A]?.yogaNode) Y++
            }
            if (q.childNodes.splice(z, 0, K), K.yogaNode && q.yogaNode) q.yogaNode.insertChild(K.yogaNode, Y);
            WD(q);
            return
        }
        if (q.childNodes.push(K), K.yogaNode) q.yogaNode?.insertChild(K.yogaNode, q.yogaNode.getChildCount());
        WD(q)
    }
// @from(Ln 178912, Col 4)
Sa6 = (q, K) => {
        if (K.yogaNode) K.parentNode?.yogaNode?.removeChild(K.yogaNode);
        i54(q, K), K.parentNode = void 0;
        let _ = q.childNodes.indexOf(K);
        if (_ >= 0) q.childNodes.splice(_, 1);
        WD(q)
    }
// @from(Ln 178919, Col 4)
Kx1 = (q, K, _) => {
        if (K === "children") return;
        if (q.attributes[K] === _) return;
        q.attributes[K] = _, WD(q)
    }
// @from(Ln 178924, Col 4)
_x1 = (q, K) => {
        if (YS_(q.style, K)) return;
        let _ = K.position === "absolute" && q.style.position !== "absolute";
        if (q.style = K, _ && q.parentNode) eI1(q.parentNode);
        WD(q)
    }
// @from(Ln 178930, Col 4)
r54 = (q, K) => {
        if (o54(q.textStyles, K)) return;
        q.textStyles = K, WD(q)
    }
// @from(Ln 178934, Col 4)
a54 = (q) => {
        let K = {
            nodeName: "#text",
            nodeValue: q,
            yogaNode: void 0,
            parentNode: void 0,
            style: {}
        };
        return Ca6(K, q), K
    }
// @from(Ln 178944, Col 4)
AS_ = function(q, K, _) {
        let z = q.nodeName === "#text" ? q.nodeValue : V54(q),
            Y = k54(z),
            A = fN6(Y, K);
        if (A.width <= K) return A;
        if (A.width >= 1 && K > 0 && K < 1) return A;
        if (Y.includes(`
`) && _ === 0) {
            let $ = Math.max(K, A.width);
            return fN6(Y, $)
        }
        let O = q.style?.textWrap ?? "wrap",
            w = JR(Y, K, O);
        return fN6(w, K)
    }
// @from(Ln 178959, Col 4)
OS_ = function(q) {
        return {
            width: q.attributes.rawWidth,
            height: q.attributes.rawHeight
        }
    }
// @from(Ln 178965, Col 4)
WD = (q) => {
        let K = q,
            _ = !1;
        while (K) {
            if (K.nodeName !== "#text") {
                if (K.dirty = !0, !_ && (K.nodeName === "ink-text" || K.nodeName === "ink-raw-ansi") && K.yogaNode) K.yogaNode.markDirty(), _ = !0
            }
            K = K.parentNode
        }
    }
// @from(Ln 178975, Col 4)
s54 = (q) => {
        let K = q;
        while (K?.parentNode) K = K.parentNode;
        if (K && K.nodeName !== "#text") K.onRender?.()
    }
// @from(Ln 178980, Col 4)
Ca6 = (q, K) => {
        if (typeof K !== "string") K = String(K);
        if (q.nodeValue === K) return;
        q.nodeValue = K, WD(q)
    }
// @from(Ln 178985, Col 4)
zx1 = (q) => {
        if ("childNodes" in q)
            for (let K of q.childNodes) zx1(K);
        q.yogaNode = void 0
    }
// @from(Ln 178990, Col 4)
TN6 = L(() => {
    G54();
    ZN6();
    gI1();
    v$6();
    dI1();
    N54();
    FN8()
})
// @from(Ln 178999, Col 4)
e54
// @from(Ln 178999, Col 9)
Yx1
// @from(Ln 178999, Col 14)
Ax1
// @from(Ln 179000, Col 4)
Ox1 = L(() => {
    e54 = {
        keydown: {
            bubble: "onKeyDown",
            capture: "onKeyDownCapture"
        },
        focus: {
            bubble: "onFocus",
            capture: "onFocusCapture"
        },
        blur: {
            bubble: "onBlur",
            capture: "onBlurCapture"
        },
        paste: {
            bubble: "onPaste",
            capture: "onPasteCapture"
        },
        wheel: {
            bubble: "onWheel",
            capture: "onWheelCapture"
        },
        resize: {
            bubble: "onResize"
        },
        click: {
            bubble: "onClick"
        }
    }, Yx1 = new Set(["onKeyDown", "onKeyDownCapture", "onPaste", "onPasteCapture", "onWheel", "onWheelCapture"]), Ax1 = new Set(["onKeyDown", "onKeyDownCapture", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onPaste", "onPasteCapture", "onWheel", "onWheelCapture", "onResize", "onClick", "onMouseEnter", "onMouseLeave"])
})
// @from(Ln 179031, Col 0)
function q34(q, K, _) {
    let z = q._eventHandlers;
    if (!z) return;
    let Y = e54[K];
    if (!Y) return;
    let A = _ ? Y.capture : Y.bubble;
    if (!A) return;
    return z[A]
}
// @from(Ln 179041, Col 0)
function jS_(q, K) {
    let _ = [],
        z = q;
    while (z) {
        let Y = z === q,
            A = q34(z, K.type, !0),
            O = q34(z, K.type, !1);
        if (A) _.unshift({
            node: z,
            handler: A,
            phase: Y ? "at_target" : "capturing"
        });
        if (O && (K.bubbles || Y)) _.push({
            node: z,
            handler: O,
            phase: Y ? "at_target" : "bubbling"
        });
        z = z.parentNode
    }
    return _
}
// @from(Ln 179063, Col 0)
function HS_(q, K) {
    let _;
    for (let {
            node: z,
            handler: Y,
            phase: A
        }
        of q) {
        if (K._isImmediatePropagationStopped()) break;
        if (K._isPropagationStopped() && z !== _) break;
        K._setEventPhase(A), K._setCurrentTarget(z), K._prepareForTarget(z);
        try {
            Y(K)
        } catch (O) {
            j6(O)
        }
        _ = z
    }
}
// @from(Ln 179083, Col 0)
function JS_(q) {
    switch (q) {
        case "keydown":
        case "keyup":
        case "click":
        case "focus":
        case "blur":
        case "paste":
            return _I1;
        case "resize":
        case "scroll":
        case "wheel":
        case "mousemove":
            return JN8;
        default:
            return Ma6
    }
}
// @from(Ln 179101, Col 0)
class wx1 {
    currentEvent = null;
    currentUpdatePriority = Ma6;
    discreteUpdates = null;
    resolveEventPriority() {
        if (this.currentUpdatePriority !== zI1) return this.currentUpdatePriority;
        if (this.currentEvent) return JS_(this.currentEvent.type);
        return Ma6
    }
    dispatch(q, K) {
        let _ = this.currentEvent;
        this.currentEvent = K;
        try {
            K._setTarget(q);
            let z = jS_(q, K);
            return HS_(z, K), K._setEventPhase("none"), K._setCurrentTarget(null), !K.defaultPrevented
        } finally {
            this.currentEvent = _
        }
    }
    dispatchDiscrete(q, K) {
        if (!this.discreteUpdates) return this.dispatch(q, K);
        return this.discreteUpdates((_, z) => this.dispatch(_, z), q, K, void 0, void 0)
    }
    dispatchContinuous(q, K) {
        let _ = this.currentUpdatePriority;
        try {
            return this.currentUpdatePriority = JN8, this.dispatch(q, K)
        } finally {
            this.currentUpdatePriority = _
        }
    }
}
// @from(Ln 179134, Col 4)
K34 = L(() => {
    XN8();
    U8();
    Ox1()
})
// @from(Ln 179139, Col 4)
Fa
// @from(Ln 179140, Col 4)
ba6 = L(() => {
    Fa = class Fa extends OR {
        type;
        timeStamp;
        bubbles;
        cancelable;
        _target = null;
        _currentTarget = null;
        _eventPhase = "none";
        _propagationStopped = !1;
        _defaultPrevented = !1;
        constructor(q, K) {
            super();
            this.type = q, this.timeStamp = performance.now(), this.bubbles = K?.bubbles ?? !0, this.cancelable = K?.cancelable ?? !0
        }
        get target() {
            return this._target
        }
        get currentTarget() {
            return this._currentTarget
        }
        get eventPhase() {
            return this._eventPhase
        }
        get defaultPrevented() {
            return this._defaultPrevented
        }
        stopPropagation() {
            this._propagationStopped = !0
        }
        stopImmediatePropagation() {
            super.stopImmediatePropagation(), this._propagationStopped = !0
        }
        preventDefault() {
            if (this.cancelable) this._defaultPrevented = !0
        }
        _setTarget(q) {
            this._target = q
        }
        _setCurrentTarget(q) {
            this._currentTarget = q
        }
        _setEventPhase(q) {
            this._eventPhase = q
        }
        _isPropagationStopped() {
            return this._propagationStopped
        }
        _isImmediatePropagationStopped() {
            return this.didStopImmediatePropagation()
        }
        _prepareForTarget(q) {}
    }
})
// @from(Ln 179194, Col 4)
E$6
// @from(Ln 179195, Col 4)
_34 = L(() => {
    ba6();
    E$6 = class E$6 extends Fa {
        relatedTarget;
        constructor(q, K = null) {
            super(q, {
                bubbles: !0,
                cancelable: !1
            });
            this.relatedTarget = K
        }
    }
})
// @from(Ln 179208, Col 0)
class VN6 {
    activeElement = null;
    dispatchFocusEvent;
    enabled = !0;
    focusStack = [];
    listeners = new Set;
    constructor(q) {
        this.dispatchFocusEvent = q
    }
    subscribe = (q) => {
        return this.listeners.add(q), () => this.listeners.delete(q)
    };
    notify() {
        for (let q of this.listeners) q()
    }
    focus(q) {
        if (q === this.activeElement) return;
        if (!this.enabled) return;
        let K = this.activeElement;
        if (K) {
            let _ = this.focusStack.indexOf(K);
            if (_ !== -1) this.focusStack.splice(_, 1);
            if (this.focusStack.push(K), this.focusStack.length > XS_) this.focusStack.shift();
            this.dispatchFocusEvent(K, new E$6("blur", q))
        }
        this.activeElement = q, this.dispatchFocusEvent(q, new E$6("focus", K)), this.notify()
    }
    blur() {
        if (!this.activeElement) return;
        let q = this.activeElement;
        this.activeElement = null, this.dispatchFocusEvent(q, new E$6("blur", null)), this.notify()
    }
    handleNodeRemoved(q, K) {
        if (this.focusStack = this.focusStack.filter((z) => z !== q && $x1(z, K)), !this.activeElement) return;
        if (this.activeElement !== q && $x1(this.activeElement, K)) return;
        let _ = this.activeElement;
        this.activeElement = null, this.dispatchFocusEvent(_, new E$6("blur", null));
        while (this.focusStack.length > 0) {
            let z = this.focusStack.pop();
            if ($x1(z, K)) {
                this.activeElement = z, this.dispatchFocusEvent(z, new E$6("focus", _)), this.notify();
                return
            }
        }
        this.notify()
    }
    handleAutoFocus(q) {
        this.focus(q)
    }
    handleClickFocus(q) {
        if (typeof q.attributes.tabIndex !== "number") return;
        this.focus(q)
    }
    enable() {
        this.enabled = !0
    }
    disable() {
        this.enabled = !1
    }
    focusNext(q) {
        this.moveFocus(1, q)
    }
    focusPrevious(q) {
        this.moveFocus(-1, q)
    }
    focusDirection(q, K) {
        if (!this.enabled) return !1;
        if (!this.activeElement) return this.moveFocus(1, K), !0;
        let _ = O34(this.activeElement);
        if (!_) return !1;
        let z = null,
            Y = 1 / 0;
        for (let A of z34(K)) {
            if (A === this.activeElement) continue;
            let O = O34(A);
            if (!O) continue;
            let w = MS_(_, O, q);
            if (w < Y) Y = w, z = A
        }
        if (z) return this.focus(z), !0;
        return !1
    }
    moveFocus(q, K) {
        if (!this.enabled) return;
        let _ = z34(K);
        if (_.length === 0) return;
        let z = this.activeElement ? _.indexOf(this.activeElement) : -1,
            Y = z === -1 ? q === 1 ? 0 : _.length - 1 : (z + q + _.length) % _.length,
            A = _[Y];
        if (A) this.focus(A)
    }
}
// @from(Ln 179301, Col 0)
function z34(q) {
    let K = [];
    return w34(q, K), K
}
// @from(Ln 179306, Col 0)
function w34(q, K) {
    let _ = q.attributes.tabIndex;
    if (typeof _ === "number" && _ >= 0) K.push(q);
    for (let z of q.childNodes)
        if (z.nodeName !== "#text") w34(z, K)
}
// @from(Ln 179313, Col 0)
function MS_(q, K, _) {
    let z = q.x + q.width / 2,
        Y = q.y + q.height / 2,
        A = K.x + K.width / 2,
        O = K.y + K.height / 2,
        w = _ === "left" || _ === "right",
        $ = _ === "right" || _ === "down" ? 1 : -1,
        j = (w ? A - z : O - Y) * $;
    if (j <= 0) return 1 / 0;
    let H = w ? Y34(Y, K.y, K.height) : Y34(z, K.x, K.width),
        J = w ? A34(q.y, q.height, K.y, K.height) : A34(q.x, q.width, K.x, K.width);
    return j + (w ? 2 : 0.5) * H - J
}
// @from(Ln 179327, Col 0)
function Y34(q, K, _) {
    if (q < K) return K - q;
    if (q > K + _) return q - (K + _);
    return 0
}
// @from(Ln 179333, Col 0)
function A34(q, K, _, z) {
    return Math.max(0, Math.min(q + K, _ + z) - Math.max(q, _))
}
// @from(Ln 179337, Col 0)
function O34(q) {
    let K = S$.get(q);
    if (K) return K;
    let _ = q.yogaNode;
    if (!_) return;
    let z = _.getComputedLeft(),
        Y = _.getComputedTop(),
        A = q.parentNode;
    while (A) {
        let O = S$.get(A);
        if (O) return {
            x: O.x + z,
            y: O.y + Y,
            width: _.getComputedWidth(),
            height: _.getComputedHeight()
        };
        if (A.yogaNode) z += A.yogaNode.getComputedLeft(), Y += A.yogaNode.getComputedTop();
        A = A.parentNode
    }
    return
}
// @from(Ln 179359, Col 0)
function $x1(q, K) {
    let _ = q;
    while (_) {
        if (_ === K) return !0;
        _ = _.parentNode
    }
    return !1
}
// @from(Ln 179368, Col 0)
function UN8(q) {
    let K = q;
    while (K) {
        if (K.focusManager) return K;
        K = K.parentNode
    }
    throw Error("Node is not in a tree with a FocusManager")
}
// @from(Ln 179377, Col 0)
function cE(q) {
    return UN8(q).focusManager
}
// @from(Ln 179380, Col 4)
XS_ = 32
// @from(Ln 179381, Col 4)
lB = L(() => {
    _34();
    v$6()
})
// @from(Ln 179386, Col 0)
function PS_(q) {
    return q === "absolute" ? 2 : 1
}
// @from(Ln 179390, Col 0)
function WS_(q) {
    return q === "none" ? 1 : 0
}
// @from(Ln 179394, Col 0)
function DS_(q) {
    switch (q) {
        case "wrap":
            return 1;
        case "wrap-reverse":
            return 2;
        default:
            return 0
    }
}
// @from(Ln 179405, Col 0)
function ZS_(q) {
    switch (q) {
        case "row":
            return 2;
        case "row-reverse":
            return 3;
        case "column-reverse":
            return 1;
        default:
            return 0
    }
}
// @from(Ln 179418, Col 0)
function $34(q, K) {
    switch (q) {
        case "auto":
            return 0;
        case "stretch":
            return 4;
        case "flex-start":
            return 1;
        case "center":
            return 2;
        case "flex-end":
            return 3;
        default:
            return K
    }
}
// @from(Ln 179435, Col 0)
function fS_(q) {
    switch (q) {
        case "center":
            return 1;
        case "flex-end":
            return 2;
        case "space-between":
            return 3;
        case "space-around":
            return 4;
        case "space-evenly":
            return 5;
        default:
            return 0
    }
}
// @from(Ln 179452, Col 0)
function QN8(q, K, _) {
    if (typeof _ === "string") q.setPositionPercent(K, Number.parseInt(_, 10));
    else if (typeof _ === "number") q.setPosition(K, _);
    else q.setPosition(K, Number.NaN)
}
// @from(Ln 179457, Col 4)
GS_ = (q, K) => {
        if ("position" in K) q.setPositionType(PS_(K.position));
        if ("top" in K) QN8(q, 1, K.top);
        if ("bottom" in K) QN8(q, 3, K.bottom);
        if ("left" in K) QN8(q, 0, K.left);
        if ("right" in K) QN8(q, 2, K.right)
    }
// @from(Ln 179464, Col 4)
vS_ = (q, K) => {
        let _ = K.overflowY ?? K.overflow,
            z = K.overflowX ?? K.overflow;
        if (_ === "scroll" || z === "scroll") q.setOverflow(2);
        else if (_ === "hidden" || z === "hidden") q.setOverflow(1);
        else if ("overflow" in K || "overflowX" in K || "overflowY" in K) q.setOverflow(0)
    }
// @from(Ln 179471, Col 4)
TS_ = (q, K) => {
        if ("margin" in K) q.setMargin(8, K.margin ?? 0);
        if ("marginX" in K) q.setMargin(6, K.marginX ?? 0);
        if ("marginY" in K) q.setMargin(7, K.marginY ?? 0);
        if ("marginLeft" in K) {
            let _ = K.marginLeft;
            if (_ === "auto") q.setMarginAuto(4);
            else q.setMargin(4, _ || 0)
        }
        if ("marginRight" in K) {
            let _ = K.marginRight;
            if (_ === "auto") q.setMarginAuto(5);
            else q.setMargin(5, _ || 0)
        }
        if ("marginTop" in K) q.setMargin(1, K.marginTop || 0);
        if ("marginBottom" in K) q.setMargin(3, K.marginBottom || 0)
    }
// @from(Ln 179488, Col 4)
VS_ = (q, K) => {
        if ("padding" in K) q.setPadding(8, K.padding ?? 0);
        if ("paddingX" in K) q.setPadding(6, K.paddingX ?? 0);
        if ("paddingY" in K) q.setPadding(7, K.paddingY ?? 0);
        if ("paddingLeft" in K) q.setPadding(0, K.paddingLeft || 0);
        if ("paddingRight" in K) q.setPadding(2, K.paddingRight || 0);
        if ("paddingTop" in K) q.setPadding(1, K.paddingTop || 0);
        if ("paddingBottom" in K) q.setPadding(3, K.paddingBottom || 0)
    }
// @from(Ln 179497, Col 4)
kS_ = (q, K) => {
        if ("flexGrow" in K) q.setFlexGrow(K.flexGrow ?? 0);
        if ("flexShrink" in K) {
            let _ = K.flexShrink;
            q.setFlexShrink(typeof _ === "number" ? _ : 1)
        }
        if ("flexWrap" in K) q.setFlexWrap(DS_(K.flexWrap));
        if ("flexDirection" in K) q.setFlexDirection(ZS_(K.flexDirection));
        if ("flexBasis" in K) {
            let _ = K.flexBasis;
            if (typeof _ === "number") q.setFlexBasis(_);
            else if (typeof _ === "string") q.setFlexBasisPercent(Number.parseInt(_, 10));
            else q.setFlexBasis(Number.NaN)
        }
        if ("alignItems" in K) q.setAlignItems($34(K.alignItems, 4));
        if ("alignSelf" in K) q.setAlignSelf($34(K.alignSelf, 0));
        if ("justifyContent" in K) q.setJustifyContent(fS_(K.justifyContent))
    }
// @from(Ln 179515, Col 4)
NS_ = (q, K) => {
        if ("width" in K) {
            let _ = K.width;
            if (typeof _ === "number") q.setWidth(_);
            else if (typeof _ === "string") q.setWidthPercent(Number.parseInt(_, 10));
            else q.setWidthAuto()
        }
        if ("height" in K) {
            let _ = K.height;
            if (typeof _ === "number") q.setHeight(_);
            else if (typeof _ === "string") q.setHeightPercent(Number.parseInt(_, 10));
            else q.setHeightAuto()
        }
        if ("minWidth" in K) {
            let _ = K.minWidth;
            if (typeof _ === "string") q.setMinWidthPercent(Number.parseInt(_, 10));
            else q.setMinWidth(_ ?? 0)
        }
        if ("minHeight" in K) {
            let _ = K.minHeight;
            if (typeof _ === "string") q.setMinHeightPercent(Number.parseInt(_, 10));
            else q.setMinHeight(_ ?? 0)
        }
        if ("maxWidth" in K) {
            let _ = K.maxWidth;
            if (typeof _ === "string") q.setMaxWidthPercent(Number.parseInt(_, 10));
            else q.setMaxWidth(_ ?? 0)
        }
        if ("maxHeight" in K) {
            let _ = K.maxHeight;
            if (typeof _ === "string") q.setMaxHeightPercent(Number.parseInt(_, 10));
            else q.setMaxHeight(_ ?? 0)
        }
    }
// @from(Ln 179549, Col 4)
ES_ = (q, K) => {
        if ("display" in K) q.setDisplay(WS_(K.display))
    }
// @from(Ln 179552, Col 4)
yS_ = (q, K, _) => {
        let z = _ ?? K;
        if ("borderStyle" in K) {
            let Y = K.borderStyle ? 1 : 0;
            q.setBorder(1, z.borderTop !== !1 ? Y : 0), q.setBorder(3, z.borderBottom !== !1 ? Y : 0), q.setBorder(0, z.borderLeft !== !1 ? Y : 0), q.setBorder(2, z.borderRight !== !1 ? Y : 0)
        } else {
            let Y = z.borderStyle ? 1 : 0;
            if ("borderTop" in K) q.setBorder(1, K.borderTop === !1 ? 0 : Y);
            if ("borderBottom" in K) q.setBorder(3, K.borderBottom === !1 ? 0 : Y);
            if ("borderLeft" in K) q.setBorder(0, K.borderLeft === !1 ? 0 : Y);
            if ("borderRight" in K) q.setBorder(2, K.borderRight === !1 ? 0 : Y)
        }
    }
// @from(Ln 179565, Col 4)
LS_ = (q, K) => {
        if ("gap" in K) q.setGap(2, K.gap ?? 0);
        if ("columnGap" in K) q.setGap(0, K.columnGap ?? 0);
        if ("rowGap" in K) q.setGap(1, K.rowGap ?? 0)
    }
// @from(Ln 179570, Col 4)
hS_ = (q, K = {}, _) => {
        GS_(q, K), vS_(q, K), TS_(q, K), VS_(q, K), kS_(q, K), NS_(q, K), ES_(q, K), yS_(q, K, _), LS_(q, K)
    }
// @from(Ln 179573, Col 4)
jx1
// @from(Ln 179574, Col 4)
j34 = L(() => {
    ZN6();
    jx1 = hS_
})
// @from(Ln 179582, Col 0)
function W34(q, K, _) {
    if (!q._eventHandlers) q._eventHandlers = {};
    q._eventHandlers[K] = _
}
// @from(Ln 179587, Col 0)
function RS_(q) {
    let K = q._eventHandlers;
    if (!K) return !1;
    for (let _ of Yx1)
        if (K[_] != null) return !0;
    return !1
}
// @from(Ln 179595, Col 0)
function D34(q, K) {
    if (q.setRawMode) q.setRawMode(K > 0);
    else q._pendingRawModeDelta = (q._pendingRawModeDelta ?? 0) + K
}
// @from(Ln 179600, Col 0)
function X34(q, K) {
    let _ = RS_(q);
    if (_ === !!q._holdsRawModeRef) return;
    q._holdsRawModeRef = _, D34(K, _ ? 1 : -1)
}
// @from(Ln 179606, Col 0)
function Px1(q, K) {
    if (q._holdsRawModeRef) q._holdsRawModeRef = !1, D34(K, -1);
    for (let _ of q.childNodes)
        if (_.nodeName !== "#text") Px1(_, K)
}
// @from(Ln 179612, Col 0)
function SS_(q, K, _) {
    if (K === "children") return;
    if (K === "style") {
        if (_x1(q, _), q.yogaNode) jx1(q.yogaNode, _);
        return
    }
    if (K === "textStyles") {
        q.textStyles = _;
        return
    }
    if (Ax1.has(K)) {
        W34(q, K, _);
        return
    }
    Kx1(q, K, _)
}
// @from(Ln 179629, Col 0)
function CS_(q) {
    let K = [],
        _ = new Set,
        z = q;
    for (let Y = 0; z && Y < 50; Y++) {
        if (_.has(z)) break;
        _.add(z);
        let A = z.elementType,
            O = typeof A === "function" ? A.displayName || A.name : typeof A === "string" ? void 0 : A?.displayName || A?.name;
        if (O && O !== K.at(-1)) K.push(O);
        z = z._debugOwner ?? z.return
    }
    return K
}
// @from(Ln 179644, Col 0)
function Dx1() {
    if (Hx1 === void 0) Hx1 = S6(process.env.CLAUDE_CODE_DEBUG_REPAINTS);
    return Hx1
}
// @from(Ln 179649, Col 0)
function Z34(q) {
    Zx1 = q
}
// @from(Ln 179653, Col 0)
function f34() {
    return Zx1
}
// @from(Ln 179657, Col 0)
function G34() {
    Ia6 = performance.now()
}
// @from(Ln 179661, Col 0)
function v34() {
    return fx1
}
// @from(Ln 179665, Col 0)
function T34() {
    Zx1 = 0, fx1 = 0, Ia6 = 0
}
// @from(Ln 179668, Col 4)
P34
// @from(Ln 179668, Col 9)
H34 = (q, K) => {
        if (q === K) return;
        if (!q) return K;
        let _ = {},
            z = !1;
        for (let Y of Object.keys(q))
            if (K ? !Object.hasOwn(K, Y) : !0) _[Y] = void 0, z = !0;
        if (K) {
            for (let Y of Object.keys(K))
                if (K[Y] !== q[Y]) _[Y] = K[Y], z = !0
        }
        return z ? _ : void 0
    }
// @from(Ln 179681, Col 4)
J34 = (q) => {
        let K = q.yogaNode;
        if (K) K.unsetMeasureFunc(), zx1(q), K.freeRecursive()
    }
// @from(Ln 179685, Col 4)
Hx1
// @from(Ln 179685, Col 9)
iB
// @from(Ln 179685, Col 13)
nB
// @from(Ln 179685, Col 17)
Jx1 = 0
// @from(Ln 179686, Col 4)
M34 = 0
// @from(Ln 179687, Col 4)
Xx1 = 0
// @from(Ln 179688, Col 4)
cN8 = 0
// @from(Ln 179689, Col 4)
lN8 = 0
// @from(Ln 179690, Col 4)
Mx1 = 0
// @from(Ln 179691, Col 4)
Zx1 = 0
// @from(Ln 179692, Col 4)
fx1 = 0
// @from(Ln 179693, Col 4)
Ia6 = 0
// @from(Ln 179694, Col 4)
Wx1
// @from(Ln 179694, Col 9)
Jd
// @from(Ln 179695, Col 4)
xa6 = L(() => {
    GN8();
    Q8();
    TN6();
    K34();
    Ox1();
    lB();
    ZN6();
    j34();
    P34 = K6(W54(), 1);
    iB = new wx1, nB = process.env.CLAUDE_CODE_COMMIT_LOG;
    Wx1 = P34.default({
        getRootHostContext: () => ({
            isInsideText: !1
        }),
        prepareForCommit: () => {
            if (nB) Mx1 = performance.now();
            return null
        },
        preparePortalMount: () => null,
        clearContainer: () => !1,
        resetAfterCommit(q) {
            if (fx1 = Ia6 > 0 ? performance.now() - Ia6 : 0, Ia6 = 0, nB) {
                let z = performance.now();
                Jx1++;
                let Y = Xx1 > 0 ? z - Xx1 : 0;
                if (Y > cN8) cN8 = Y;
                Xx1 = z;
                let A = Mx1 > 0 ? z - Mx1 : 0;
                if (Y > 30 || A > 20 || lN8 > 50) dN8(nB, `${z.toFixed(1)} gap=${Y.toFixed(1)}ms reconcile=${A.toFixed(1)}ms creates=${lN8}
`);
                if (lN8 = 0, z - M34 > 1000) dN8(nB, `${z.toFixed(1)} commits=${Jx1}/s maxGap=${cN8.toFixed(1)}ms
`), Jx1 = 0, cN8 = 0, M34 = z
            }
            let K = nB ? performance.now() : 0;
            if (typeof q.onComputeLayout === "function") q.onComputeLayout();
            if (nB) {
                let z = performance.now() - K;
                if (z > 20) {
                    let Y = fN8();
                    dN8(nB, `${K.toFixed(1)} SLOW_YOGA ${z.toFixed(1)}ms visited=${Y.visited} measured=${Y.measured} hits=${Y.cacheHits} live=${Y.live}
`)
                }
            }
            let _ = nB ? performance.now() : 0;
            if (q.onRender?.(), nB) {
                let z = performance.now() - _;
                if (z > 10) dN8(nB, `${_.toFixed(1)} SLOW_PAINT ${z.toFixed(1)}ms
`)
            }
        },
        getChildHostContext(q, K) {
            let _ = q.isInsideText,
                z = K === "ink-text" || K === "ink-virtual-text" || K === "ink-link";
            if (_ === z) return q;
            return {
                isInsideText: z
            }
        },
        shouldSetTextContent: () => !1,
        createInstance(q, K, _, z, Y) {
            if (z.isInsideText && q === "ink-box") throw Error("<Box> can't be nested inside <Text> component");
            let A = q === "ink-text" && z.isInsideText ? "ink-virtual-text" : q,
                O = Ra6(A);
            if (nB) lN8++;
            for (let [w, $] of Object.entries(K)) SS_(O, w, $);
            if (X34(O, _), Dx1()) O.debugOwnerChain = CS_(Y);
            return O
        },
        createTextInstance(q, K, _) {
            if (!_.isInsideText) throw Error(`Text string "${q}" must be rendered inside <Text> component`);
            return a54(q)
        },
        resetTextContent() {},
        hideTextInstance(q) {
            Ca6(q, "")
        },
        unhideTextInstance(q, K) {
            Ca6(q, K)
        },
        getPublicInstance: (q) => q,
        hideInstance(q) {
            q.isHidden = !0, q.yogaNode?.setDisplay(1), WD(q)
        },
        unhideInstance(q) {
            q.isHidden = !1, q.yogaNode?.setDisplay(0), WD(q)
        },
        appendInitialChild: gN8,
        appendChild: gN8,
        insertBefore: qx1,
        finalizeInitialChildren(q, K, _) {
            return _.autoFocus === !0
        },
        commitMount(q) {
            cE(q).handleAutoFocus(q)
        },
        isPrimaryRenderer: !0,
        supportsMutation: !0,
        supportsPersistence: !1,
        supportsHydration: !1,
        scheduleTimeout: setTimeout,
        cancelTimeout: clearTimeout,
        noTimeout: -1,
        getCurrentUpdatePriority: () => iB.currentUpdatePriority,
        beforeActiveInstanceBlur() {},
        afterActiveInstanceBlur() {},
        detachDeletedInstance() {},
        getInstanceFromNode: () => null,
        prepareScopeUpdate() {},
        getInstanceFromScope: () => null,
        appendChildToContainer: gN8,
        insertInContainerBefore: qx1,
        removeChildFromContainer(q, K) {
            Sa6(q, K), J34(K), cE(q).handleNodeRemoved(K, q), Px1(K, q)
        },
        commitUpdate(q, K, _, z) {
            let Y = H34(_, z),
                A = H34(_.style, z.style),
                O = !1;
            if (Y)
                for (let [w, $] of Object.entries(Y)) {
                    if (w === "style") {
                        _x1(q, $);
                        continue
                    }
                    if (w === "textStyles") {
                        r54(q, $);
                        continue
                    }
                    if (Ax1.has(w)) {
                        if (W34(q, w, $), Yx1.has(w)) O = !0;
                        continue
                    }
                    Kx1(q, w, $)
                }
            if (O) X34(q, UN8(q));
            if (A && q.yogaNode) jx1(q.yogaNode, A, z.style)
        },
        commitTextUpdate(q, K, _) {
            Ca6(q, _)
        },
        removeChild(q, K) {
            if (Sa6(q, K), J34(K), K.nodeName !== "#text") {
                let _ = UN8(q);
                _.focusManager.handleNodeRemoved(K, _), Px1(K, _)
            }
        },
        maySuspendCommit() {
            return !1
        },
        preloadInstance() {
            return !0
        },
        startSuspendingCommit() {},
        suspendInstance() {},
        waitForCommitToBeReady() {
            return null
        },
        NotPendingTransition: null,
        HostTransitionContext: {
            $$typeof: Symbol.for("react.context"),
            _currentValue: null
        },
        setCurrentUpdatePriority(q) {
            iB.currentUpdatePriority = q
        },
        resolveUpdatePriority() {
            return iB.resolveEventPriority()
        },
        resetFormInstance() {},
        requestPostPaintCallback() {},
        shouldAttemptEagerTransition() {
            return !1
        },
        trackSchedulerEvent() {},
        resolveEventType() {
            return iB.currentEvent?.type ?? null
        },
        resolveEventTimeStamp() {
            return iB.currentEvent?.timeStamp ?? -1.1
        }
    });
    iB.discreteUpdates = Wx1.discreteUpdates.bind(Wx1);
    Jd = Wx1
})
// @from(Ln 179881, Col 0)
function y46(q, K) {
    let _ = Math.min(q.x, K.x),
        z = Math.min(q.y, K.y),
        Y = Math.max(q.x + q.width, K.x + K.width),
        A = Math.max(q.y + q.height, K.y + K.height);
    return {
        x: _,
        y: z,
        width: Y - _,
        height: A - z
    }
}
// @from(Ln 179894, Col 0)
function lE(q, K, _) {
    if (K !== void 0 && q < K) return K;
    if (_ !== void 0 && q > _) return _;
    return q
}
// @from(Ln 179899, Col 4)
y$6 = () => {}
// @from(Ln 179901, Col 0)
function MJ(q, K) {
    if (q === void 0) return;
    if (Number.isInteger(q)) return;
    E(`${K} should be an integer, got ${q}`, {
        level: "warn"
    })
}
// @from(Ln 179908, Col 4)
Gx1 = L(() => {
    K8()
})
// @from(Ln 179911, Col 0)
class ua6 {
    strings = [" ", ""];
    stringMap = new Map([
        [" ", 0],
        ["", 1]
    ]);
    ascii = BS_();
    intern(q) {
        if (q.length === 1) {
            let z = q.charCodeAt(0);
            if (z < 128) {
                let Y = this.ascii[z];
                if (Y !== -1) return Y;
                let A = this.strings.length;
                return this.strings.push(q), this.ascii[z] = A, A
            }
        }
        let K = this.stringMap.get(q);
        if (K !== void 0) return K;
        let _ = this.strings.length;
        return this.strings.push(q), this.stringMap.set(q, _), _
    }
    get(q) {
        return this.strings[q] ?? " "
    }
}
// @from(Ln 179937, Col 0)
class ma6 {
    strings = [""];
    stringMap = new Map;
    intern(q) {
        if (!q) return 0;
        let K = this.stringMap.get(q);
        if (K === void 0) K = this.strings.length, this.strings.push(q), this.stringMap.set(q, K);
        return K
    }
    get(q) {
        return q === 0 ? void 0 : this.strings[q]
    }
}
// @from(Ln 179950, Col 0)
class rN8 {
    ids = new Map;
    styles = [];
    transitionCache = new Map;
    none;
    constructor() {
        this.none = this.intern([])
    }
    intern(q) {
        let K = q.length === 0 ? "" : q.map((z) => z.code).join("\x00"),
            _ = this.ids.get(K);
        if (_ === void 0) {
            let z = this.styles.length;
            this.styles.push(q.length === 0 ? [] : q), _ = z << 1 | (q.length > 0 && mS_(q) ? 1 : 0), this.ids.set(K, _)
        }
        return _
    }
    get(q) {
        return this.styles[q >>> 1] ?? []
    }
    transition(q, K) {
        if (q === K) return "";
        let _ = q * 1048576 + K,
            z = this.transitionCache.get(_);
        if (z === void 0) z = HR(V$6(this.get(q), this.get(K))), this.transitionCache.set(_, z);
        return z
    }
    inverseCache = new Map;
    withInverse(q) {
        let K = this.inverseCache.get(q);
        if (K === void 0) {
            let _ = this.get(q);
            K = _.some((Y) => Y.endCode === "\x1B[27m") ? q : this.intern([..._, k34]), this.inverseCache.set(q, K)
        }
        return K
    }
    currentMatchCache = new Map;
    withCurrentMatch(q) {
        let K = this.currentMatchCache.get(q);
        if (K === void 0) {
            let _ = this.get(q),
                z = _.filter((Y) => Y.endCode !== "\x1B[39m" && Y.endCode !== "\x1B[49m");
            if (z.push(xS_), !_.some((Y) => Y.endCode === "\x1B[27m")) z.push(k34);
            if (!_.some((Y) => Y.endCode === "\x1B[22m")) z.push(bS_);
            if (!_.some((Y) => Y.endCode === "\x1B[24m")) z.push(IS_);
            K = this.intern(z), this.currentMatchCache.set(q, K)
        }
        return K
    }
    selectionBgCode = null;
    selectionBgCache = new Map;
    setSelectionBg(q) {
        if (this.selectionBgCode?.code === q?.code) return;
        this.selectionBgCode = q, this.selectionBgCache.clear()
    }
    withSelectionBg(q) {
        let K = this.selectionBgCode;
        if (K === null) return this.withInverse(q);
        let _ = this.selectionBgCache.get(q);
        if (_ === void 0) {
            let z = this.get(q).filter((Y) => Y.endCode !== "\x1B[49m" && Y.endCode !== "\x1B[27m");
            z.push(K), _ = this.intern(z), this.selectionBgCache.set(q, _)
        }
        return _
    }
}
// @from(Ln 180017, Col 0)
function mS_(q) {
    for (let K of q)
        if (uS_.has(K.endCode)) return !0;
    return !1
}
// @from(Ln 180023, Col 0)
function BS_() {
    let q = new Int32Array(128);
    return q.fill(-1), q[32] = nN8, q
}
// @from(Ln 180028, Col 0)
function L46(q, K, _) {
    return q << kN6 | K << NN6 | _
}
// @from(Ln 180032, Col 0)
function E34(q, K) {
    if (q.width !== K.width || q.height !== K.height) return !1;
    let _ = q.width * q.height * 2,
        z = q.cells,
        Y = K.cells;
    for (let A = 0; A < _; A++)
        if (z[A] !== Y[A]) return !1;
    return !0
}
// @from(Ln 180042, Col 0)
function vx1(q, K) {
    return q << 16 | K & 65535
}
// @from(Ln 180046, Col 0)
function pS_(q, K) {
    let _ = K << 1;
    return q.cells[_] === 0 && q.cells[_ | 1] === 0
}
// @from(Ln 180051, Col 0)
function pa6(q, K, _) {
    if (K < 0 || _ < 0 || K >= q.width || _ >= q.height) return !0;
    return pS_(q, _ * q.width + K)
}
// @from(Ln 180056, Col 0)
function FS_(q, K) {
    return q.hyperlinkPool.intern(K)
}
// @from(Ln 180060, Col 0)
function ga(q, K, _, z, Y) {
    if (MJ(q, "createScreen width"), MJ(K, "createScreen height"), !Number.isInteger(q) || q < 0) q = Math.max(0, Math.floor(q) || 0);
    if (!Number.isInteger(K) || K < 0) K = Math.max(0, Math.floor(K) || 0);
    let A = q * K,
        O = new ArrayBuffer(A << 3),
        w = new Int32Array(O),
        $ = new BigInt64Array(O);
    return {
        width: q,
        height: K,
        cells: w,
        cells64: $,
        charPool: z,
        hyperlinkPool: Y,
        emptyStyleId: _.none,
        damage: void 0,
        noSelect: new Uint8Array(A),
        softWrap: new Int32Array(K)
    }
}
// @from(Ln 180081, Col 0)
function Tx1(q, K, _) {
    if (MJ(K, "resetScreen width"), MJ(_, "resetScreen height"), !Number.isInteger(K) || K < 0) K = Math.max(0, Math.floor(K) || 0);
    if (!Number.isInteger(_) || _ < 0) _ = Math.max(0, Math.floor(_) || 0);
    let z = K * _;
    if (q.cells64.length < z) {
        let Y = new ArrayBuffer(z << 3);
        q.cells = new Int32Array(Y), q.cells64 = new BigInt64Array(Y), q.noSelect = new Uint8Array(z)
    }
    if (q.softWrap.length < _) q.softWrap = new Int32Array(_);
    q.cells64.fill(iN8, 0, z), q.noSelect.fill(0, 0, z), q.softWrap.fill(0, 0, _), q.width = K, q.height = _, q.damage = void 0
}
// @from(Ln 180093, Col 0)
function y34(q, K, _) {
    let {
        charPool: z,
        hyperlinkPool: Y
    } = q;
    if (z === K && Y === _) return;
    let A = q.width * q.height,
        O = q.cells;
    for (let w = 0; w < A << 1; w += 2) {
        let $ = O[w];
        O[w] = K.intern(z.get($));
        let j = O[w + 1],
            H = j >>> NN6 & Ba6;
        if (H !== 0) {
            let J = Y.get(H),
                X = _.intern(J),
                M = j >>> kN6,
                P = j & rB;
            O[w + 1] = L46(M, X, P)
        }
    }
    q.charPool = K, q.hyperlinkPool = _
}
// @from(Ln 180117, Col 0)
function Tf(q, K, _) {
    if (K < 0 || _ < 0 || K >= q.width || _ >= q.height) return;
    return Ua(q, _ * q.width + K)
}
// @from(Ln 180122, Col 0)
function Ua(q, K) {
    let _ = K << 1,
        z = q.cells[_ + 1],
        Y = z >>> NN6 & Ba6;
    return {
        char: q.charPool.get(q.cells[_]),
        styleId: z >>> kN6,
        width: z & rB,
        hyperlink: Y === 0 ? void 0 : q.hyperlinkPool.get(Y)
    }
}
// @from(Ln 180134, Col 0)
function L34(q, K, _, z, Y) {
    let A = z << 1,
        O = q[A];
    if (O === 1) return;
    let w = q[A + 1];
    if (O === 0 && (w & 262140) === 0) {
        let j = w >>> kN6;
        if (j === 0 || j === Y) return
    }
    let $ = w >>> NN6 & Ba6;
    return {
        char: K.get(O),
        styleId: w >>> kN6,
        width: w & rB,
        hyperlink: $ === 0 ? void 0 : _.get($)
    }
}
// @from(Ln 180152, Col 0)
function h46(q, K, _) {
    let z = K | 1,
        Y = q.cells[z];
    _.char = q.charPool.get(q.cells[K]), _.styleId = Y >>> kN6, _.width = Y & rB;
    let A = Y >>> NN6 & Ba6;
    _.hyperlink = A === 0 ? void 0 : q.hyperlinkPool.get(A)
}
// @from(Ln 180160, Col 0)
function h34(q, K, _) {
    if (K < 0 || _ < 0 || K >= q.width || _ >= q.height) return;
    let z = _ * q.width + K << 1;
    return q.charPool.get(q.cells[z])
}
// @from(Ln 180166, Col 0)
function oN8(q, K, _, z) {
    if (K < 0 || _ < 0 || K >= q.width || _ >= q.height) return;
    let Y = _ * q.width + K << 1,
        A = q.cells,
        O = A[Y + 1] & rB;
    if (O === 1 && z.width !== 1) {
        if (K + 1 < q.width) {
            let J = Y + 2;
            if ((A[J + 1] & rB) === 2) A[J] = nN8, A[J + 1] = L46(q.emptyStyleId, 0, 0)
        }
    }
    let w = -1;
    if (O === 2 && z.width !== 2) {
        if (K > 0) {
            let H = Y - 2;
            if ((A[H + 1] & rB) === 1) A[H] = nN8, A[H + 1] = L46(q.emptyStyleId, 0, 0), w = K - 1
        }
    }
    A[Y] = gS_(q, z.char), A[Y + 1] = L46(z.styleId, FS_(q, z.hyperlink), z.width);
    let $ = w >= 0 ? Math.min(K, w) : K,
        j = q.damage;
    if (j) {
        let H = j.x + j.width,
            J = j.y + j.height;
        if ($ < j.x) j.width += j.x - $, j.x = $;
        else if (K >= H) j.width = K - j.x + 1;
        if (_ < j.y) j.height += j.y - _, j.y = _;
        else if (_ >= J) j.height = _ - j.y + 1
    } else q.damage = {
        x: $,
        y: _,
        width: K - $ + 1,
        height: 1
    };
    if (z.width === 1) {
        let H = K + 1;
        if (H < q.width) {
            let J = Y + 2;
            if ((A[J + 1] & rB) === 1) {
                let M = J + 2;
                if (H + 1 < q.width && (A[M + 1] & rB) === 2) A[M] = nN8, A[M + 1] = L46(q.emptyStyleId, 0, 0)
            }
            A[J] = N34, A[J + 1] = L46(q.emptyStyleId, 0, 2);
            let X = q.damage;
            if (X && H >= X.x + X.width) X.width = H - X.x + 1
        }
    }
}
// @from(Ln 180215, Col 0)
function EN6(q, K, _, z) {
    if (K < 0 || _ < 0 || K >= q.width || _ >= q.height) return;
    let Y = _ * q.width + K << 1,
        A = q.cells,
        O = A[Y + 1],
        w = O & rB;
    if (w === 2 || w === 3) return;
    let $ = O >>> NN6 & Ba6;
    A[Y + 1] = L46(z, $, w);
    let j = q.damage;
    if (j) q.damage = y46(j, {
        x: K,
        y: _,
        width: 1,
        height: 1
    });
    else q.damage = {
        x: K,
        y: _,
        width: 1,
        height: 1
    }
}
// @from(Ln 180239, Col 0)
function gS_(q, K) {
    return q.charPool.intern(K)
}
// @from(Ln 180243, Col 0)
function Vx1(q, K, _, z, Y, A) {
    if (_ = Math.max(0, _), z = Math.max(0, z), _ >= Y || z >= A) return;
    let O = Y - _,
        w = K.width << 1,
        $ = q.width << 1,
        j = O << 1,
        H = K.cells,
        J = q.cells,
        X = K.noSelect,
        M = q.noSelect;
    if (q.softWrap.set(K.softWrap.subarray(z, A), z), _ === 0 && Y === K.width && K.width === q.width) {
        let W = z * w,
            D = (A - z) * w;
        J.set(H.subarray(W, W + D), W);
        let Z = z * K.width,
            G = (A - z) * K.width;
        M.set(X.subarray(Z, Z + G), Z)
    } else {
        let W = z * w + (_ << 1),
            D = z * $ + (_ << 1),
            Z = z * K.width + _,
            G = z * q.width + _;
        for (let f = z; f < A; f++) J.set(H.subarray(W, W + j), D), M.set(X.subarray(Z, Z + O), G), W += w, D += $, Z += K.width, G += q.width
    }
    let P = {
        x: _,
        y: z,
        width: O,
        height: A - z
    };
    if (q.damage) q.damage = y46(q.damage, P);
    else q.damage = P;
    if (Y < q.width) {
        let W = z * K.width + (Y - 1) << 1,
            D = z * q.width + Y << 1,
            Z = !1;
        for (let G = z; G < A; G++) {
            if ((H[W + 1] & rB) === 1) J[D] = N34, J[D + 1] = L46(q.emptyStyleId, 0, 2), Z = !0;
            W += w, D += $
        }
        if (Z && q.damage) {
            if (q.damage.x + q.damage.width === Y) q.damage = {
                ...q.damage,
                width: q.damage.width + 1
            }
        }
    }
}
// @from(Ln 180292, Col 0)
function aN8(q, K, _, z) {
    if (z === 0 || K < 0 || _ >= q.height || K > _) return;
    let {
        width: Y,
        cells64: A,
        noSelect: O,
        softWrap: w
    } = q;
    if (Math.abs(z) > _ - K) {
        A.fill(iN8, K * Y, (_ + 1) * Y), O.fill(0, K * Y, (_ + 1) * Y), w.fill(0, K, _ + 1);
        return
    }
    if (z > 0) A.copyWithin(K * Y, (K + z) * Y, (_ + 1) * Y), O.copyWithin(K * Y, (K + z) * Y, (_ + 1) * Y), w.copyWithin(K, K + z, _ + 1), A.fill(iN8, (_ - z + 1) * Y, (_ + 1) * Y), O.fill(0, (_ - z + 1) * Y, (_ + 1) * Y), w.fill(0, _ - z + 1, _ + 1);
    else A.copyWithin((K - z) * Y, K * Y, (_ + z + 1) * Y), O.copyWithin((K - z) * Y, K * Y, (_ + z + 1) * Y), w.copyWithin(K - z, K, _ + z + 1), A.fill(iN8, K * Y, (K - z) * Y), O.fill(0, K * Y, (K - z) * Y), w.fill(0, K, K - z)
}
// @from(Ln 180308, Col 0)
function S34(q) {
    for (let K of q) {
        let _ = K.code;
        if (_.length < 5 || !_.startsWith(L$6)) continue;
        let z = _.match(R34);
        if (z) return z[1] || null
    }
    return null
}
// @from(Ln 180318, Col 0)
function C34(q) {
    return q.filter((K) => !K.code.startsWith(L$6) || !R34.test(K.code))
}
// @from(Ln 180322, Col 0)
function b34(q, K, _) {
    let z = q.width,
        Y = K.width,
        A = q.height,
        O = K.height,
        w;
    if (z === 0 && A === 0) w = {
        x: 0,
        y: 0,
        width: Y,
        height: O
    };
    else if (K.damage) {
        if (w = K.damage, q.damage) w = y46(w, q.damage)
    } else if (q.damage) w = q.damage;
    else w = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    if (A > O) w = y46(w, {
        x: 0,
        y: O,
        width: z,
        height: A - O
    });
    if (z > Y) w = y46(w, {
        x: Y,
        y: 0,
        width: z - Y,
        height: A
    });
    let $ = Math.max(A, O),
        j = Math.max(z, Y),
        H = Math.min(w.y + w.height, $),
        J = Math.min(w.x + w.width, j);
    if (z === Y) return lS_(q, K, w.x, J, w.y, H, _);
    return nS_(q, K, w.x, J, w.y, H, _)
}
// @from(Ln 180363, Col 0)
function US_(q, K, _, z) {
    for (let Y = 0; Y < z; Y++, _ += 2) {
        let A = _ | 1;
        if (q[_] !== K[_] || q[A] !== K[A]) return Y
    }
    return z
}
// @from(Ln 180371, Col 0)
function QS_(q, K, _, z, Y, A, O, w, $, j, H) {
    let J = O;
    while (J < w) {
        let X = US_(q, K, Y, w - J);
        if (J += X, Y += X << 1, J >= w) break;
        if (h46(_, Y, $), h46(z, Y, j), H(J, A, $, j)) return !0;
        J++, Y += 2
    }
    return !1
}
// @from(Ln 180382, Col 0)
function dS_(q, K, _, z, Y, A, O) {
    for (let w = z; w < Y; w++, K += 2)
        if (h46(q, K, A), O(w, _, A, void 0)) return !0;
    return !1
}
// @from(Ln 180388, Col 0)
function cS_(q, K, _, z, Y, A, O, w) {
    for (let $ = Y; $ < A; $++, _ += 2) {
        if (q[_] === 0 && q[_ | 1] === 0) continue;
        if (h46(K, _, O), w($, z, void 0, O)) return !0
    }
    return !1
}
// @from(Ln 180396, Col 0)
function lS_(q, K, _, z, Y, A, O) {
    let w = q.cells,
        $ = K.cells,
        j = q.width,
        H = q.height,
        J = K.height,
        X = j << 1,
        M = {
            char: " ",
            styleId: 0,
            width: 0,
            hyperlink: void 0
        },
        P = {
            char: " ",
            styleId: 0,
            width: 0,
            hyperlink: void 0
        },
        W = Math.min(z, j),
        D = Y * j + _ << 1;
    for (let Z = Y; Z < A; Z++) {
        let G = Z < H,
            f = Z < J;
        if (G && f) {
            if (QS_(w, $, q, K, D, Z, _, W, M, P, O)) return !0
        } else if (G) {
            if (dS_(q, D, Z, _, W, M, O)) return !0
        } else if (f) {
            if (cS_($, K, D, Z, _, W, P, O)) return !0
        }
        D += X
    }
    return !1
}
// @from(Ln 180432, Col 0)
function nS_(q, K, _, z, Y, A, O) {
    let w = q.width,
        $ = K.width,
        j = q.cells,
        H = K.cells,
        J = {
            char: " ",
            styleId: 0,
            width: 0,
            hyperlink: void 0
        },
        X = {
            char: " ",
            styleId: 0,
            width: 0,
            hyperlink: void 0
        },
        M = w << 1,
        P = $ << 1,
        W = Y * w + _ << 1,
        D = Y * $ + _ << 1;
    for (let Z = Y; Z < A; Z++) {
        let G = Z < q.height,
            f = Z < K.height,
            v = G ? Math.min(z, w) : _,
            V = f ? Math.min(z, $) : _,
            k = Math.min(v, V),
            N = W,
            R = D;
        for (let h = _; h < k; h++) {
            if (j[N] === H[R] && j[N + 1] === H[R + 1]) {
                N += 2, R += 2;
                continue
            }
            if (h46(q, N, J), h46(K, R, X), N += 2, R += 2, O(h, Z, J, X)) return !0
        }
        if (v > k) {
            N = W + (k - _ << 1);
            for (let h = k; h < v; h++)
                if (h46(q, N, J), N += 2, O(h, Z, J, void 0)) return !0
        }
        if (V > k) {
            R = D + (k - _ << 1);
            for (let h = k; h < V; h++) {
                if (H[R] === 0 && H[R | 1] === 0) {
                    R += 2;
                    continue
                }
                if (h46(K, R, X), R += 2, O(h, Z, void 0, X)) return !0
            }
        }
        W += M, D += P
    }
    return !1
}
// @from(Ln 180488, Col 0)
function I34(q, K, _, z, Y) {
    let A = Math.min(K + z, q.width),
        O = Math.min(_ + Y, q.height),
        w = q.noSelect,
        $ = q.width;
    for (let j = Math.max(0, _); j < O; j++) {
        let H = j * $;
        w.fill(1, H + Math.max(0, K), H + A)
    }
}
// @from(Ln 180498, Col 4)
k34
// @from(Ln 180498, Col 9)
bS_
// @from(Ln 180498, Col 14)
IS_
// @from(Ln 180498, Col 19)
xS_
// @from(Ln 180498, Col 24)
uS_
// @from(Ln 180498, Col 29)
nN8 = 0
// @from(Ln 180499, Col 4)
N34 = 1
// @from(Ln 180500, Col 4)
kN6 = 17
// @from(Ln 180501, Col 4)
NN6 = 2
// @from(Ln 180502, Col 4)
Ba6 = 32767
// @from(Ln 180503, Col 4)
rB = 3
// @from(Ln 180504, Col 4)
iN8 = 0n
// @from(Ln 180505, Col 4)
R34
// @from(Ln 180505, Col 9)
L$6
// @from(Ln 180506, Col 4)
Xd = L(() => {
    vN6();
    y$6();
    Z46();
    Gx1();
    k34 = {
        type: "ansi",
        code: "\x1B[7m",
        endCode: "\x1B[27m"
    }, bS_ = {
        type: "ansi",
        code: "\x1B[1m",
        endCode: "\x1B[22m"
    }, IS_ = {
        type: "ansi",
        code: "\x1B[4m",
        endCode: "\x1B[24m"
    }, xS_ = {
        type: "ansi",
        code: "\x1B[33m",
        endCode: "\x1B[39m"
    };
    uS_ = new Set(["\x1B[49m", "\x1B[27m", "\x1B[24m", "\x1B[29m", "\x1B[55m"]);
    R34 = new RegExp(`^${wR}\\]8${D46}${D46}([^${dE}]*)${dE}$`), L$6 = `${wR}]8${D46}`
})
// @from(Ln 180532, Col 0)
function x34() {
    return {
        anchor: null,
        focus: null,
        isDragging: !1,
        anchorSpan: null,
        scrolledOffAbove: [],
        scrolledOffBelow: [],
        scrolledOffAboveSW: [],
        scrolledOffBelowSW: [],
        lastPressHadAlt: !1
    }
}
// @from(Ln 180546, Col 0)
function tN8(q, K, _) {
    q.anchor = {
        col: K,
        row: _
    }, q.focus = null, q.isDragging = !0, q.anchorSpan = null, q.scrolledOffAbove = [], q.scrolledOffBelow = [], q.scrolledOffAboveSW = [], q.scrolledOffBelowSW = [], q.virtualAnchorRow = void 0, q.virtualFocusRow = void 0, q.lastPressHadAlt = !1
}
// @from(Ln 180553, Col 0)
function u34(q, K, _) {
    if (!q.isDragging) return;
    if (!q.focus && q.anchor && q.anchor.col === K && q.anchor.row === _) return;
    q.focus = {
        col: K,
        row: _
    }
}
// @from(Ln 180562, Col 0)
function yN6(q) {
    q.isDragging = !1
}
// @from(Ln 180566, Col 0)
function ga6(q) {
    q.anchor = null, q.focus = null, q.isDragging = !1, q.anchorSpan = null, q.scrolledOffAbove = [], q.scrolledOffBelow = [], q.scrolledOffAboveSW = [], q.scrolledOffBelowSW = [], q.virtualAnchorRow = void 0, q.virtualFocusRow = void 0, q.lastPressHadAlt = !1
}
// @from(Ln 180570, Col 0)
function sN8(q) {
    if (q === " " || q === "") return 0;
    if (iS_.test(q)) return 1;
    return 2
}
// @from(Ln 180576, Col 0)
function m34(q, K, _) {
    if (_ < 0 || _ >= q.height) return null;
    let {
        width: z,
        noSelect: Y
    } = q, A = _ * z, O = K;
    if (O > 0) {
        let J = Tf(q, O, _);
        if (J && J.width === 2) O -= 1
    }
    if (O < 0 || O >= z || Y[A + O] === 1) return null;
    let w = Tf(q, O, _);
    if (!w) return null;
    let $ = sN8(w.char),
        j = O;
    while (j > 0) {
        let J = j - 1;
        if (Y[A + J] === 1) break;
        let X = Tf(q, J, _);
        if (!X) break;
        if (X.width === 2) {
            if (J === 0 || Y[A + J - 1] === 1) break;
            let M = Tf(q, J - 1, _);
            if (!M || sN8(M.char) !== $) break;
            j = J - 1;
            continue
        }
        if (sN8(X.char) !== $) break;
        j = J
    }
    let H = O;
    while (H < z - 1) {
        let J = H + 1;
        if (Y[A + J] === 1) break;
        let X = Tf(q, J, _);
        if (!X) break;
        if (X.width === 2) {
            H = J;
            continue
        }
        if (sN8(X.char) !== $) break;
        H = J
    }
    return {
        lo: j,
        hi: H
    }
}
// @from(Ln 180625, Col 0)
function Ex1(q, K) {
    if (q.row !== K.row) return q.row < K.row ? -1 : 1;
    if (q.col !== K.col) return q.col < K.col ? -1 : 1;
    return 0
}
// @from(Ln 180631, Col 0)
function B34(q, K, _, z) {
    let Y = m34(K, _, z);
    if (!Y) return;
    let A = {
            col: Y.lo,
            row: z
        },
        O = {
            col: Y.hi,
            row: z
        };
    q.anchor = A, q.focus = O, q.isDragging = !0, q.anchorSpan = {
        lo: A,
        hi: O,
        kind: "word"
    }
}
// @from(Ln 180649, Col 0)
function kx1(q) {
    if (q.length !== 1) return !1;
    let K = q.charCodeAt(0);
    return K >= 33 && K <= 126 && !rS_.has(q)
}
// @from(Ln 180655, Col 0)
function p34(q, K, _) {
    if (_ < 0 || _ >= q.height) return;
    let {
        width: z,
        noSelect: Y
    } = q, A = _ * z, O = K;
    if (O > 0) {
        let Z = Tf(q, O, _);
        if (Z && Z.width === 2) O -= 1
    }
    if (O < 0 || O >= z || Y[A + O] === 1) return;
    let w = Tf(q, O, _);
    if (!w || !kx1(w.char)) return;
    let $ = O;
    while ($ > 0) {
        let Z = $ - 1;
        if (Y[A + Z] === 1) break;
        let G = Tf(q, Z, _);
        if (!G || G.width !== 0 || !kx1(G.char)) break;
        $ = Z
    }
    let j = O;
    while (j < z - 1) {
        let Z = j + 1;
        if (Y[A + Z] === 1) break;
        let G = Tf(q, Z, _);
        if (!G || G.width !== 0 || !kx1(G.char)) break;
        j = Z
    }
    let H = "";
    for (let Z = $; Z <= j; Z++) H += Tf(q, Z, _).char;
    let J = O - $,
        X = /(?:https?|file):\/\//g,
        M = -1,
        P = H.length;
    for (let Z; Z = X.exec(H);) {
        if (Z.index > J) {
            P = Z.index;
            break
        }
        M = Z.index
    }
    if (M < 0) return;
    let W = H.slice(M, P),
        D = {
            ")": "(",
            "]": "[",
            "}": "{"
        };
    while (W.length > 0) {
        let Z = W.at(-1);
        if (".,;:!?".includes(Z)) {
            W = W.slice(0, -1);
            continue
        }
        let G = D[Z];
        if (!G) break;
        let f = 0,
            v = 0;
        for (let V = 0; V < W.length; V++) {
            let k = W.charAt(V);
            if (k === G) f++;
            else if (k === Z) v++
        }
        if (v > f) W = W.slice(0, -1);
        else break
    }
    if (J >= M + W.length) return;
    return W
}
// @from(Ln 180726, Col 0)
function F34(q, K, _) {
    if (_ < 0 || _ >= K.height) return;
    let z = {
            col: 0,
            row: _
        },
        Y = {
            col: K.width - 1,
            row: _
        };
    q.anchor = z, q.focus = Y, q.isDragging = !0, q.anchorSpan = {
        lo: z,
        hi: Y,
        kind: "line"
    }
}
// @from(Ln 180743, Col 0)
function g34(q, K, _, z) {
    if (!q.isDragging || !q.anchorSpan) return;
    let Y = q.anchorSpan,
        A, O;
    if (Y.kind === "word") {
        let w = m34(K, _, z);
        A = {
            col: w ? w.lo : _,
            row: z
        }, O = {
            col: w ? w.hi : _,
            row: z
        }
    } else {
        let w = lE(z, 0, K.height - 1);
        A = {
            col: 0,
            row: w
        }, O = {
            col: K.width - 1,
            row: w
        }
    }
    if (Ex1(O, Y.lo) < 0) q.anchor = Y.hi, q.focus = A;
    else if (Ex1(A, Y.hi) > 0) q.anchor = Y.lo, q.focus = O;
    else q.anchor = Y.lo, q.focus = Y.hi
}
// @from(Ln 180771, Col 0)
function U34(q, K, _) {
    if (!q.focus) return;
    q.anchorSpan = null, q.focus = {
        col: K,
        row: _
    }, q.virtualFocusRow = void 0
}
// @from(Ln 180779, Col 0)
function Q34(q, K, _, z, Y) {
    if (!q.anchor || !q.focus) return;
    let A = (q.virtualAnchorRow ?? q.anchor.row) + K,
        O = (q.virtualFocusRow ?? q.focus.row) + K;
    if (A < _ && O < _ || A > z && O > z) {
        ga6(q);
        return
    }
    let w = Math.min(q.virtualAnchorRow ?? q.anchor.row, q.virtualFocusRow ?? q.focus.row),
        $ = Math.max(q.virtualAnchorRow ?? q.anchor.row, q.virtualFocusRow ?? q.focus.row),
        j = Math.max(0, _ - w),
        H = Math.max(0, $ - z),
        J = Math.max(0, _ - Math.min(A, O)),
        X = Math.max(0, Math.max(A, O) - z);
    if (J < j) {
        let P = Math.min(j - J, q.scrolledOffAbove.length);
        q.scrolledOffAbove.length -= P, q.scrolledOffAboveSW.length = q.scrolledOffAbove.length
    }
    if (X < H) {
        let P = H - X;
        q.scrolledOffBelow.splice(0, P), q.scrolledOffBelowSW.splice(0, P)
    }
    if (q.scrolledOffAbove.length > J) q.scrolledOffAbove = J > 0 ? q.scrolledOffAbove.slice(-J) : [], q.scrolledOffAboveSW = J > 0 ? q.scrolledOffAboveSW.slice(-J) : [];
    if (q.scrolledOffBelow.length > X) q.scrolledOffBelow = q.scrolledOffBelow.slice(0, X), q.scrolledOffBelowSW = q.scrolledOffBelowSW.slice(0, X);
    let M = (P, W) => {
        if (W < _) return {
            col: 0,
            row: _
        };
        if (W > z) return {
            col: Y - 1,
            row: z
        };
        return {
            col: P.col,
            row: W
        }
    };
    if (q.anchor = M(q.anchor, A), q.focus = M(q.focus, O), q.virtualAnchorRow = A < _ || A > z ? A : void 0, q.virtualFocusRow = O < _ || O > z ? O : void 0, q.anchorSpan) {
        let P = (W) => {
            let D = W.row + K;
            if (D < _) return {
                col: 0,
                row: _
            };
            if (D > z) return {
                col: Y - 1,
                row: z
            };
            return {
                col: W.col,
                row: D
            }
        };
        q.anchorSpan = {
            lo: P(q.anchorSpan.lo),
            hi: P(q.anchorSpan.hi),
            kind: q.anchorSpan.kind
        }
    }
}
// @from(Ln 180841, Col 0)
function eN8(q, K, _, z) {
    if (!q.anchor) return;
    let Y = (q.virtualAnchorRow ?? q.anchor.row) + K;
    if (q.anchor = {
            col: q.anchor.col,
            row: lE(Y, _, z)
        }, q.virtualAnchorRow = Y < _ || Y > z ? Y : void 0, q.anchorSpan) {
        let A = (O) => ({
            col: O.col,
            row: lE(O.row + K, _, z)
        });
        q.anchorSpan = {
            lo: A(q.anchorSpan.lo),
            hi: A(q.anchorSpan.hi),
            kind: q.anchorSpan.kind
        }
    }
}