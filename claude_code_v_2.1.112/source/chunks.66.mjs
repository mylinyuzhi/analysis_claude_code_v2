
// @from(Ln 171165, Col 0)
function aK4(q, K, _, z, Y) {
    let A = [],
        O = {
            state: K,
            buffer: ""
        },
        w = _ + q,
        $ = 0,
        j = 0,
        H = 0,
        J = () => {
            if ($ > j) {
                let M = w.slice(j, $);
                if (M) A.push({
                    type: "text",
                    value: M
                })
            }
            j = $
        },
        X = (M) => {
            if (M) A.push({
                type: "sequence",
                value: M
            });
            O.state = "ground", j = $
        };
    while ($ < w.length) {
        let M = w.charCodeAt($);
        switch (O.state) {
            case "ground":
                if (M === ZI.ESC) J(), H = $, O.state = "escape", $++;
                else if (M === ZI.DEL)
                    if (OR_.test(w.slice(j, $))) $++;
                    else J(), $++, A.push({
                        type: "text",
                        value: ""
                    }), j = $;
                else if (M < 32 && w.length < 64) {
                    if (J(), $++, M === 13 && w.charCodeAt($) === 10) $++;
                    A.push({
                        type: "text",
                        value: String.fromCharCode(M)
                    }), j = $
                } else $++;
                break;
            case "escape":
                if (M === $R.CSI) O.state = "csi", $++;
                else if (M === $R.OSC) O.state = "osc", $++;
                else if (M === $R.DCS) O.state = "dcs", $++;
                else if (M === $R.APC) O.state = "apc", $++;
                else if (M === 79) O.state = "ss3", $++;
                else if (Y && (M === 32 || M === 13 || M === 10 || M === 9)) $++, A.push({
                    type: "text",
                    value: w.slice(H, $)
                }), O.state = "ground", j = $;
                else if (zN8(M)) O.state = "escapeIntermediate", $++;
                else if (M === ZI.DEL) $++, A.push({
                    type: "text",
                    value: w.slice(H, $)
                }), O.state = "ground", j = $;
                else if (Fb1(M)) $++, X(w.slice(H, $));
                else if (M === ZI.ESC) X(w.slice(H, $)), H = $, O.state = "escape", $++;
                else if (M < 32) $++, A.push({
                    type: "text",
                    value: w.slice(H, $)
                }), O.state = "ground", j = $;
                else O.state = "ground", j = H;
                break;
            case "escapeIntermediate":
                if (zN8(M)) $++;
                else if (Fb1(M)) $++, X(w.slice(H, $));
                else O.state = "ground", j = H;
                break;
            case "csi":
                if (Y && M === 77 && $ - H === 2 && ($ + 1 >= w.length || w.charCodeAt($ + 1) >= 32) && ($ + 2 >= w.length || w.charCodeAt($ + 2) >= 32) && ($ + 3 >= w.length || w.charCodeAt($ + 3) >= 32)) {
                    if ($ + 4 <= w.length) $ += 4, X(w.slice(H, $));
                    else $ = w.length;
                    break
                }
                if (F44(M)) $++, X(w.slice(H, $));
                else if (p44(M) || zN8(M)) $++;
                else O.state = "ground", j = H;
                break;
            case "ss3":
                if (M >= 64 && M <= 126) $++, X(w.slice(H, $));
                else O.state = "ground", j = H;
                break;
            case "osc":
                if (M === ZI.BEL) $++, X(w.slice(H, $));
                else if (M === ZI.ESC && $ + 1 < w.length && w.charCodeAt($ + 1) === $R.ST) $ += 2, X(w.slice(H, $));
                else $++;
                break;
            case "dcs":
            case "apc":
                if (M === ZI.BEL) $++, X(w.slice(H, $));
                else if (M === ZI.ESC && $ + 1 < w.length && w.charCodeAt($ + 1) === $R.ST) $ += 2, X(w.slice(H, $));
                else $++;
                break
        }
    }
    if (O.state === "ground") J();
    else if (z) {
        let M = w.slice(H);
        if (M) A.push({
            type: "sequence",
            value: M
        });
        O.state = "ground"
    } else O.buffer = w.slice(H);
    return {
        tokens: A,
        state: O
    }
}
// @from(Ln 171280, Col 4)
OR_
// @from(Ln 171281, Col 4)
va6 = L(() => {
    Z46();
    GI();
    OR_ = /^\[M[\x60-\x7f][\x20-\uffff]?$/
})
// @from(Ln 171290, Col 0)
function sK4(q) {
    return {
        kind: "key",
        name: "",
        fn: !1,
        ctrl: !1,
        meta: !1,
        shift: !1,
        option: !1,
        super: !1,
        sequence: q,
        raw: q,
        isPasted: !0
    }
}
// @from(Ln 171306, Col 0)
function vR_(q) {
    if (q.startsWith("\x1B[")) {
        let K;
        if (K = XR_.exec(q)) return {
            type: "decrpm",
            mode: parseInt(K[1], 10),
            status: parseInt(K[2], 10)
        };
        if (K = MR_.exec(q)) return {
            type: "da1",
            params: tK4(K[1])
        };
        if (K = PR_.exec(q)) return {
            type: "da2",
            params: tK4(K[1])
        };
        if (K = WR_.exec(q)) return {
            type: "kittyKeyboard",
            flags: parseInt(K[1], 10)
        };
        if (K = DR_.exec(q)) return {
            type: "cursorPosition",
            row: parseInt(K[1], 10),
            col: parseInt(K[2], 10)
        };
        if (K = ZR_.exec(q)) return {
            type: "themeNotify",
            dark: K[1] === "1"
        };
        return null
    }
    if (q.startsWith("\x1B]")) {
        let K = fR_.exec(q);
        if (K) return {
            type: "osc",
            code: parseInt(K[1], 10),
            data: K[2]
        }
    }
    if (q.startsWith("\x1BP")) {
        let K = GR_.exec(q);
        if (K) return {
            type: "xtversion",
            name: K[1]
        }
    }
    return null
}
// @from(Ln 171355, Col 0)
function tK4(q) {
    if (!q) return [];
    return q.split(";").map((K) => parseInt(K, 10))
}
// @from(Ln 171360, Col 0)
function TR_(q) {
    if (wR_.isBuffer(q))
        if (q[0] > 127 && q[1] === void 0) return q[0] -= 128, "\x1B" + String(q);
        else return String(q);
    else if (q !== void 0 && typeof q !== "string") return String(q);
    else if (!q) return "";
    else return q
}
// @from(Ln 171369, Col 0)
function A54(q, K = "") {
    let _ = K === null,
        z = _ ? "" : TR_(K),
        Y = q._tokenizer ?? T46({
            x10Mouse: !0
        }),
        A = _ ? Y.flush() : Y.feed(z),
        O = [],
        w = q.mode === "IN_PASTE",
        $ = q.pasteBuffer;
    for (let H of A)
        if (H.type === "sequence")
            if (H.value === o44) w = !0, $ = "";
            else if (H.value === a44) O.push(sK4($)), w = !1, $ = "";
    else if (w) $ += H.value;
    else {
        let J = vR_(H.value);
        if (J) O.push({
            kind: "response",
            sequence: H.value,
            response: J
        });
        else {
            let X = K54(H.value);
            if (X) O.push(X);
            else O.push(ZI1(H.value))
        }
    } else if (H.type === "text")
        if (w) $ += H.value;
        else if (/^\[<\d+;\d+;\d+[Mm]$/.test(H.value) || /^\[M[\x60-\x7f][\x20-\uffff]{2}$/.test(H.value)) {
        let J = "\x1B" + H.value,
            X = K54(J);
        O.push(X ?? ZI1(J))
    } else O.push(ZI1(H.value));
    if (_ && w && $) O.push(sK4($)), w = !1, $ = "";
    let j = {
        mode: w ? "IN_PASTE" : "NORMAL",
        incomplete: Y.buffer(),
        pasteBuffer: $,
        _tokenizer: Y
    };
    return [O, j]
}
// @from(Ln 171413, Col 0)
function eK4(q) {
    let K = q - 1;
    return {
        shift: !!(K & 1),
        meta: !!(K & 2),
        ctrl: !!(K & 4),
        super: !!(K & 8)
    }
}
// @from(Ln 171423, Col 0)
function q54(q) {
    switch (q) {
        case 9:
            return "tab";
        case 13:
            return "return";
        case 27:
            return "escape";
        case 32:
            return "space";
        case 127:
            return "backspace";
        case 57399:
            return "0";
        case 57400:
            return "1";
        case 57401:
            return "2";
        case 57402:
            return "3";
        case 57403:
            return "4";
        case 57404:
            return "5";
        case 57405:
            return "6";
        case 57406:
            return "7";
        case 57407:
            return "8";
        case 57408:
            return "9";
        case 57409:
            return ".";
        case 57410:
            return "/";
        case 57411:
            return "*";
        case 57412:
            return "-";
        case 57413:
            return "+";
        case 57414:
            return "return";
        case 57415:
            return "=";
        default:
            if (q >= 32 && q <= 126) return String.fromCharCode(q).toLowerCase();
            return
    }
}
// @from(Ln 171475, Col 0)
function K54(q) {
    let K = z54.exec(q);
    if (!K) return null;
    let _ = parseInt(K[1], 10);
    if ((_ & 64) !== 0) return null;
    return {
        kind: "mouse",
        button: _,
        action: K[4] === "M" ? "press" : "release",
        col: parseInt(K[2], 10),
        row: parseInt(K[3], 10),
        sequence: q
    }
}
// @from(Ln 171490, Col 0)
function ZI1(q = "") {
    let K, _ = {
        kind: "key",
        name: "",
        fn: !1,
        ctrl: !1,
        meta: !1,
        shift: !1,
        option: !1,
        super: !1,
        sequence: q,
        raw: q,
        isPasted: !1
    };
    _.sequence = _.sequence || q || _.name;
    let z;
    if (z = HR_.exec(q)) {
        let Y = parseInt(z[1], 10),
            A = z[2] ? parseInt(z[2], 10) : 1,
            O = eK4(A);
        return {
            kind: "key",
            name: q54(Y),
            fn: !1,
            ctrl: O.ctrl,
            meta: O.meta,
            shift: O.shift,
            option: !1,
            super: O.super,
            sequence: q,
            raw: q,
            isPasted: !1
        }
    }
    if (z = JR_.exec(q)) {
        let Y = eK4(parseInt(z[1], 10));
        return {
            kind: "key",
            name: q54(parseInt(z[2], 10)),
            fn: !1,
            ctrl: Y.ctrl,
            meta: Y.meta,
            shift: Y.shift,
            option: !1,
            super: Y.super,
            sequence: q,
            raw: q,
            isPasted: !1
        }
    }
    if (z = z54.exec(q)) {
        let Y = parseInt(z[1], 10);
        return _54(q, Y) ?? V46(q, "mouse", !1)
    }
    if (q.length === 6 && q.startsWith("\x1B[M")) {
        let Y = q.charCodeAt(3) - 32;
        return _54(q, Y) ?? V46(q, "mouse", !1)
    }
    if (q === "\r" || q === "\x1B\r") _.raw = void 0, _.name = "return", _.meta = q.length === 2;
    else if (q === `
` || q === `\x1B
`) _.name = "enter", _.meta = q.length === 2;
    else if (q === "\t" || q === "\x1B\t") _.name = "tab", _.meta = q.length === 2;
    else if (q === "\b" || q === "\x1B\b") _.name = "backspace", _.meta = q.charAt(0) === "\x1B";
    else if (q === "" || q === "\x1B") _.name = "backspace", _.meta = q.charAt(0) === "\x1B";
    else if (q === "\x1B" || q === "\x1B\x1B") _.name = "escape", _.meta = q.length === 2;
    else if (q === " " || q === "\x1B ") _.name = "space", _.meta = q.length === 2;
    else if (q === "\x1C") _.name = "\\", _.ctrl = !0;
    else if (q === "\x1D") _.name = "]", _.ctrl = !0;
    else if (q === "\x1E") _.name = "^", _.ctrl = !0;
    else if (q === "\x1F") _.name = "_", _.ctrl = !0;
    else if (q <= "\x1A" && q.length === 1) _.name = String.fromCharCode(q.charCodeAt(0) + 97 - 1), _.ctrl = !0;
    else if (q.length === 1 && q >= "0" && q <= "9") _.name = "number";
    else if (q.length === 1 && q >= "a" && q <= "z") _.name = q;
    else if (q.length === 1 && q >= "A" && q <= "Z") _.name = q.toLowerCase(), _.shift = !0;
    else if (K = $R_.exec(q)) _.meta = !0, _.shift = /^[A-Z]$/.test(K[1]), _.name = K[1].toLowerCase();
    else if (K = jR_.exec(q)) {
        let Y = [...q];
        if (Y[0] === "\x1B" && Y[1] === "\x1B") _.option = !0;
        let A = [K[1], K[2], K[4], K[6]].filter(Boolean).join(""),
            O = (K[3] || K[5] || 1) - 1;
        _.ctrl = !!(O & 4), _.meta = !!(O & 2), _.super = !!(O & 8), _.shift = !!(O & 1), _.code = A, _.name = O54[A], _.shift = VR_(A) || _.shift, _.ctrl = kR_(A) || _.ctrl
    }
    if (_.raw === "\x1Bb") _.meta = !0, _.name = "left";
    else if (_.raw === "\x1Bf") _.meta = !0, _.name = "right";
    switch (q) {
        case "\x1B[1~":
            return V46(q, "home", !1);
        case "\x1B[4~":
            return V46(q, "end", !1);
        case "\x1B[5~":
            return V46(q, "pageup", !1);
        case "\x1B[6~":
            return V46(q, "pagedown", !1);
        case "\x1B[1;5D":
            return V46(q, "left", !0);
        case "\x1B[1;5C":
            return V46(q, "right", !0)
    }
    return _
}
// @from(Ln 171592, Col 0)
function _54(q, K) {
    let _ = K & 67;
    if (_ !== 64 && _ !== 65) return null;
    return {
        kind: "key",
        name: _ === 64 ? "wheelup" : "wheeldown",
        ctrl: (K & 16) !== 0,
        meta: (K & 8) !== 0,
        shift: (K & 4) !== 0,
        option: !1,
        super: !1,
        fn: !1,
        sequence: q,
        raw: q,
        isPasted: !1
    }
}
// @from(Ln 171610, Col 0)
function V46(q, K, _) {
    return {
        kind: "key",
        name: K,
        ctrl: _,
        meta: !1,
        shift: !1,
        option: !1,
        super: !1,
        fn: !1,
        sequence: q,
        raw: q,
        isPasted: !1
    }
}
// @from(Ln 171625, Col 4)
$R_
// @from(Ln 171625, Col 9)
jR_
// @from(Ln 171625, Col 14)
HR_
// @from(Ln 171625, Col 19)
JR_
// @from(Ln 171625, Col 24)
XR_
// @from(Ln 171625, Col 29)
MR_
// @from(Ln 171625, Col 34)
PR_
// @from(Ln 171625, Col 39)
WR_
// @from(Ln 171625, Col 44)
DR_
// @from(Ln 171625, Col 49)
ZR_
// @from(Ln 171625, Col 54)
fR_
// @from(Ln 171625, Col 59)
GR_
// @from(Ln 171625, Col 64)
z54
// @from(Ln 171625, Col 69)
Y54
// @from(Ln 171625, Col 74)
O54
// @from(Ln 171625, Col 79)
w54
// @from(Ln 171625, Col 84)
VR_ = (q) => {
        return ["[a", "[b", "[c", "[d", "[e", "[2$", "[3$", "[5$", "[6$", "[7$", "[8$", "[Z"].includes(q)
    }
// @from(Ln 171628, Col 4)
kR_ = (q) => {
        return ["Oa", "Ob", "Oc", "Od", "Oe", "[2^", "[3^", "[5^", "[6^", "[7^", "[8^"].includes(q)
    }
// @from(Ln 171631, Col 4)
fI1 = L(() => {
    GI();
    va6();
    $R_ = /^(?:\x1b)([a-zA-Z0-9])$/, jR_ = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/, HR_ = /^\x1b\[(\d+)(?:;(\d+))?u/, JR_ = /^\x1b\[27;(\d+);(\d+)~/, XR_ = /^\x1b\[\?(\d+);(\d+)\$y$/, MR_ = /^\x1b\[\?([\d;]*)c$/, PR_ = /^\x1b\[>([\d;]*)c$/, WR_ = /^\x1b\[\?(\d+)u$/, DR_ = /^\x1b\[\?(\d+);(\d+)R$/, ZR_ = /^\x1b\[\?997;([12])n$/, fR_ = /^\x1b\](\d+);(.*?)(?:\x07|\x1b\\)$/s, GR_ = /^\x1bP>\|(.*?)(?:\x07|\x1b\\)$/s, z54 = /^\x1b\[<(\d+);(\d+);(\d+)([Mm])$/;
    Y54 = {
        mode: "NORMAL",
        incomplete: "",
        pasteBuffer: ""
    };
    O54 = {
        OP: "f1",
        OQ: "f2",
        OR: "f3",
        OS: "f4",
        Op: "0",
        Oq: "1",
        Or: "2",
        Os: "3",
        Ot: "4",
        Ou: "5",
        Ov: "6",
        Ow: "7",
        Ox: "8",
        Oy: "9",
        Oj: "*",
        Ok: "+",
        Ol: ",",
        Om: "-",
        On: ".",
        Oo: "/",
        OM: "return",
        "[11~": "f1",
        "[12~": "f2",
        "[13~": "f3",
        "[14~": "f4",
        "[[A": "f1",
        "[[B": "f2",
        "[[C": "f3",
        "[[D": "f4",
        "[[E": "f5",
        "[15~": "f5",
        "[17~": "f6",
        "[18~": "f7",
        "[19~": "f8",
        "[20~": "f9",
        "[21~": "f10",
        "[23~": "f11",
        "[24~": "f12",
        "[A": "up",
        "[B": "down",
        "[C": "right",
        "[D": "left",
        "[E": "clear",
        "[F": "end",
        "[H": "home",
        OA: "up",
        OB: "down",
        OC: "right",
        OD: "left",
        OE: "clear",
        OF: "end",
        OH: "home",
        "[1~": "home",
        "[2~": "insert",
        "[3~": "delete",
        "[4~": "end",
        "[5~": "pageup",
        "[6~": "pagedown",
        "[[5~": "pageup",
        "[[6~": "pagedown",
        "[7~": "home",
        "[8~": "end",
        "[a": "up",
        "[b": "down",
        "[c": "right",
        "[d": "left",
        "[e": "clear",
        "[2$": "insert",
        "[3$": "delete",
        "[5$": "pageup",
        "[6$": "pagedown",
        "[7$": "home",
        "[8$": "end",
        Oa: "up",
        Ob: "down",
        Oc: "right",
        Od: "left",
        Oe: "clear",
        "[2^": "insert",
        "[3^": "delete",
        "[5^": "pageup",
        "[6^": "pagedown",
        "[7^": "home",
        "[8^": "end",
        "[Z": "tab"
    }, w54 = [...Object.values(O54).filter((q) => q.length > 1), "escape", "backspace", "wheelup", "wheeldown", "mouse"]
})
// @from(Ln 171729, Col 0)
function NR_(q) {
    let K = {
            upArrow: q.name === "up",
            downArrow: q.name === "down",
            leftArrow: q.name === "left",
            rightArrow: q.name === "right",
            pageDown: q.name === "pagedown",
            pageUp: q.name === "pageup",
            wheelUp: q.name === "wheelup",
            wheelDown: q.name === "wheeldown",
            home: q.name === "home",
            end: q.name === "end",
            return: q.name === "return",
            escape: q.name === "escape",
            fn: q.fn,
            ctrl: q.ctrl,
            shift: q.shift,
            tab: q.name === "tab",
            backspace: q.name === "backspace",
            delete: q.name === "delete",
            meta: q.meta || q.name === "escape" || q.option,
            super: q.super
        },
        _ = q.ctrl ? q.name : q.sequence;
    if (_ === void 0) _ = "";
    if (q.ctrl && _ === "space") _ = " ";
    if (q.code && !q.name) _ = "";
    if (!q.name && /^(\x1b?\[<\d[\d;]*[Mm]?)+$/.test(_)) _ = "";
    if (_.startsWith("\x1B")) _ = _.slice(1);
    let z = !1;
    if (/^\[\d/.test(_) && _.endsWith("u")) {
        if (!q.name) _ = "";
        else _ = q.name === "space" ? " " : q.name === "escape" ? "" : q.name;
        z = !0
    }
    if (_.startsWith("[27;") && _.endsWith("~")) {
        if (!q.name) _ = "";
        else _ = q.name === "space" ? " " : q.name === "escape" ? "" : q.name;
        z = !0
    }
    if (q.code && q.code[0] === "O" && q.name && q.name.length === 1) _ = q.name, z = !0;
    if (!z && q.name && w54.includes(q.name)) _ = "";
    if (_.length === 1 && typeof _[0] === "string" && _[0] >= "A" && _[0] <= "Z") K.shift = !0;
    if (z && K.shift && !K.ctrl && _.length === 1 && _ >= "a" && _ <= "z") _ = _.toUpperCase();
    return [K, _]
}
// @from(Ln 171775, Col 4)
Ta6
// @from(Ln 171776, Col 4)
GI1 = L(() => {
    fI1();
    Ta6 = class Ta6 extends OR {
        keypress;
        key;
        input;
        constructor(q) {
            super();
            let [K, _] = NR_(q);
            this.keypress = q, this.key = K, this.input = _
        }
    }
})
// @from(Ln 171789, Col 4)
PN6
// @from(Ln 171790, Col 4)
vI1 = L(() => {
    PN6 = class PN6 extends OR {
        type;
        constructor(q) {
            super();
            this.type = q
        }
    }
})
// @from(Ln 171800, Col 0)
function kI1(q, K) {
    var _ = q.length;
    q.push(K);
    q: for (; 0 < _;) {
        var z = _ - 1 >>> 1,
            Y = q[z];
        if (0 < vN8(Y, K)) q[z] = K, q[_] = Y, _ = z;
        else break q
    }
}
// @from(Ln 171811, Col 0)
function jd(q) {
    return q.length === 0 ? null : q[0]
}
// @from(Ln 171815, Col 0)
function NN8(q) {
    if (q.length === 0) return null;
    var K = q[0],
        _ = q.pop();
    if (_ !== K) {
        q[0] = _;
        q: for (var z = 0, Y = q.length, A = Y >>> 1; z < A;) {
            var O = 2 * (z + 1) - 1,
                w = q[O],
                $ = O + 1,
                j = q[$];
            if (0 > vN8(w, _)) $ < Y && 0 > vN8(j, w) ? (q[z] = j, q[$] = _, z = $) : (q[z] = w, q[O] = _, z = O);
            else if ($ < Y && 0 > vN8(j, _)) q[z] = j, q[$] = _, z = $;
            else break q
        }
    }
    return K
}
// @from(Ln 171834, Col 0)
function vN8(q, K) {
    var _ = q.sortIndex - K.sortIndex;
    return _ !== 0 ? _ : q.id - K.id
}
// @from(Ln 171839, Col 0)
function VN8(q) {
    for (var K = jd(k46); K !== null;) {
        if (K.callback === null) NN8(k46);
        else if (K.startTime <= q) NN8(k46), K.sortIndex = K.expirationTime, kI1(pa, K);
        else break;
        K = jd(k46)
    }
}
// @from(Ln 171848, Col 0)
function RI1(q) {
    if (ka6 = !1, VN8(q), !Va6)
        if (jd(pa) !== null) Va6 = !0, DN6 || (DN6 = !0, WN6());
        else {
            var K = jd(k46);
            K !== null && SI1(RI1, K.startTime - q)
        }
}
// @from(Ln 171857, Col 0)
function X54() {
    return hI1 ? !0 : Hd() - J54 < yR_ ? !1 : !0
}
// @from(Ln 171861, Col 0)
function VI1() {
    if (hI1 = !1, DN6) {
        var q = Hd();
        J54 = q;
        var K = !0;
        try {
            q: {
                Va6 = !1,
                ka6 && (ka6 = !1, H54(Na6), Na6 = -1),
                yI1 = !0;
                var _ = TI1;
                try {
                    K: {
                        VN8(q);
                        for (VI = jd(pa); VI !== null && !(VI.expirationTime > q && X54());) {
                            var z = VI.callback;
                            if (typeof z === "function") {
                                VI.callback = null, TI1 = VI.priorityLevel;
                                var Y = z(VI.expirationTime <= q);
                                if (q = Hd(), typeof Y === "function") {
                                    VI.callback = Y, VN8(q), K = !0;
                                    break K
                                }
                                VI === jd(pa) && NN8(pa), VN8(q)
                            } else NN8(pa);
                            VI = jd(pa)
                        }
                        if (VI !== null) K = !0;
                        else {
                            var A = jd(k46);
                            A !== null && SI1(RI1, A.startTime - q), K = !1
                        }
                    }
                    break q
                }
                finally {
                    VI = null, TI1 = _, yI1 = !1
                }
                K = void 0
            }
        }
        finally {
            K ? WN6() : DN6 = !1
        }
    }
}
// @from(Ln 171908, Col 0)
function SI1(q, K) {
    Na6 = j54(function() {
        q(Hd())
    }, K)
}
// @from(Ln 171913, Col 4)
Hd = void 0
// @from(Ln 171914, Col 4)
NI1
// @from(Ln 171914, Col 9)
TN8
// @from(Ln 171914, Col 14)
EI1
// @from(Ln 171914, Col 19)
pa
// @from(Ln 171914, Col 23)
k46
// @from(Ln 171914, Col 28)
ER_ = 1
// @from(Ln 171915, Col 4)
VI = null
// @from(Ln 171916, Col 4)
TI1 = 3
// @from(Ln 171917, Col 4)
yI1 = !1
// @from(Ln 171918, Col 4)
Va6 = !1
// @from(Ln 171919, Col 4)
ka6 = !1
// @from(Ln 171920, Col 4)
hI1 = !1
// @from(Ln 171921, Col 4)
j54
// @from(Ln 171921, Col 9)
H54
// @from(Ln 171921, Col 14)
$54
// @from(Ln 171921, Col 19)
DN6 = !1
// @from(Ln 171922, Col 4)
Na6 = -1
// @from(Ln 171923, Col 4)
yR_ = 5
// @from(Ln 171924, Col 4)
J54 = -1
// @from(Ln 171925, Col 4)
WN6
// @from(Ln 171925, Col 9)
kN8
// @from(Ln 171925, Col 14)
LI1
// @from(Ln 171925, Col 19)
CI1 = 5
// @from(Ln 171926, Col 4)
bI1 = 1
// @from(Ln 171927, Col 4)
EN8 = 3
// @from(Ln 171928, Col 4)
II1 = 2
// @from(Ln 171929, Col 4)
xI1 = function(q) {
        q.callback = null
    }
// @from(Ln 171932, Col 4)
uI1 = function() {
        hI1 = !0
    }
// @from(Ln 171935, Col 4)
yN8 = function(q, K, _) {
        var z = Hd();
        switch (typeof _ === "object" && _ !== null ? (_ = _.delay, _ = typeof _ === "number" && 0 < _ ? z + _ : z) : _ = z, q) {
            case 1:
                var Y = -1;
                break;
            case 2:
                Y = 250;
                break;
            case 5:
                Y = 1073741823;
                break;
            case 4:
                Y = 1e4;
                break;
            default:
                Y = 5000
        }
        return Y = _ + Y, q = {
            id: ER_++,
            callback: K,
            priorityLevel: q,
            startTime: _,
            expirationTime: Y,
            sortIndex: -1
        }, _ > z ? (q.sortIndex = _, kI1(k46, q), jd(pa) === null && q === jd(k46) && (ka6 ? (H54(Na6), Na6 = -1) : ka6 = !0, SI1(RI1, _ - z))) : (q.sortIndex = Y, kI1(pa, q), Va6 || yI1 || (Va6 = !0, DN6 || (DN6 = !0, WN6()))), q
    }
// @from(Ln 171962, Col 4)
mI1
// @from(Ln 171963, Col 4)
P54 = L(() => {
    if (typeof performance === "object" && typeof performance.now === "function") NI1 = performance, Hd = function() {
        return NI1.now()
    };
    else TN8 = Date, EI1 = TN8.now(), Hd = function() {
        return TN8.now() - EI1
    };
    pa = [], k46 = [], j54 = typeof setTimeout === "function" ? setTimeout : null, H54 = typeof clearTimeout === "function" ? clearTimeout : null, $54 = typeof setImmediate < "u" ? setImmediate : null;
    if (typeof $54 === "function") WN6 = function() {
        $54(VI1)
    };
    else if (typeof MessageChannel < "u") kN8 = new MessageChannel, LI1 = kN8.port2, kN8.port1.onmessage = VI1, WN6 = function() {
        LI1.postMessage(null)
    };
    else WN6 = function() {
        j54(VI1, 0)
    };
    mI1 = X54
})