
// @from(Ln 484587, Col 4)
qvq = v(() => {
    WUA();
    GUA();
    kE6();
    fUA();
    yE6();
    tTq();
    Qf1 = {
        am: "am",
        pm: "pm",
        midnight: "midnight",
        noon: "noon",
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
    }, VUA = {
        G: function(A, q, K) {
            let Y = A.getFullYear() > 0 ? 1 : 0;
            switch (q) {
                case "G":
                case "GG":
                case "GGG":
                    return K.era(Y, {
                        width: "abbreviated"
                    });
                case "GGGGG":
                    return K.era(Y, {
                        width: "narrow"
                    });
                case "GGGG":
                default:
                    return K.era(Y, {
                        width: "wide"
                    })
            }
        },
        y: function(A, q, K) {
            if (q === "yo") {
                let Y = A.getFullYear(),
                    z = Y > 0 ? Y : 1 - Y;
                return K.ordinalNumber(z, {
                    unit: "year"
                })
            }
            return nc.y(A, q)
        },
        Y: function(A, q, K, Y) {
            let z = RE6(A, Y),
                w = z > 0 ? z : 1 - z;
            if (q === "YY") {
                let H = w % 100;
                return Bz(H, 2)
            }
            if (q === "Yo") return K.ordinalNumber(w, {
                unit: "year"
            });
            return Bz(w, q.length)
        },
        R: function(A, q) {
            let K = EE6(A);
            return Bz(K, q.length)
        },
        u: function(A, q) {
            let K = A.getFullYear();
            return Bz(K, q.length)
        },
        Q: function(A, q, K) {
            let Y = Math.ceil((A.getMonth() + 1) / 3);
            switch (q) {
                case "Q":
                    return String(Y);
                case "QQ":
                    return Bz(Y, 2);
                case "Qo":
                    return K.ordinalNumber(Y, {
                        unit: "quarter"
                    });
                case "QQQ":
                    return K.quarter(Y, {
                        width: "abbreviated",
                        context: "formatting"
                    });
                case "QQQQQ":
                    return K.quarter(Y, {
                        width: "narrow",
                        context: "formatting"
                    });
                case "QQQQ":
                default:
                    return K.quarter(Y, {
                        width: "wide",
                        context: "formatting"
                    })
            }
        },
        q: function(A, q, K) {
            let Y = Math.ceil((A.getMonth() + 1) / 3);
            switch (q) {
                case "q":
                    return String(Y);
                case "qq":
                    return Bz(Y, 2);
                case "qo":
                    return K.ordinalNumber(Y, {
                        unit: "quarter"
                    });
                case "qqq":
                    return K.quarter(Y, {
                        width: "abbreviated",
                        context: "standalone"
                    });
                case "qqqqq":
                    return K.quarter(Y, {
                        width: "narrow",
                        context: "standalone"
                    });
                case "qqqq":
                default:
                    return K.quarter(Y, {
                        width: "wide",
                        context: "standalone"
                    })
            }
        },
        M: function(A, q, K) {
            let Y = A.getMonth();
            switch (q) {
                case "M":
                case "MM":
                    return nc.M(A, q);
                case "Mo":
                    return K.ordinalNumber(Y + 1, {
                        unit: "month"
                    });
                case "MMM":
                    return K.month(Y, {
                        width: "abbreviated",
                        context: "formatting"
                    });
                case "MMMMM":
                    return K.month(Y, {
                        width: "narrow",
                        context: "formatting"
                    });
                case "MMMM":
                default:
                    return K.month(Y, {
                        width: "wide",
                        context: "formatting"
                    })
            }
        },
        L: function(A, q, K) {
            let Y = A.getMonth();
            switch (q) {
                case "L":
                    return String(Y + 1);
                case "LL":
                    return Bz(Y + 1, 2);
                case "Lo":
                    return K.ordinalNumber(Y + 1, {
                        unit: "month"
                    });
                case "LLL":
                    return K.month(Y, {
                        width: "abbreviated",
                        context: "standalone"
                    });
                case "LLLLL":
                    return K.month(Y, {
                        width: "narrow",
                        context: "standalone"
                    });
                case "LLLL":
                default:
                    return K.month(Y, {
                        width: "wide",
                        context: "standalone"
                    })
            }
        },
        w: function(A, q, K, Y) {
            let z = sTq(A, Y);
            if (q === "wo") return K.ordinalNumber(z, {
                unit: "week"
            });
            return Bz(z, q.length)
        },
        I: function(A, q, K) {
            let Y = oTq(A);
            if (q === "Io") return K.ordinalNumber(Y, {
                unit: "week"
            });
            return Bz(Y, q.length)
        },
        d: function(A, q, K) {
            if (q === "do") return K.ordinalNumber(A.getDate(), {
                unit: "date"
            });
            return nc.d(A, q)
        },
        D: function(A, q, K) {
            let Y = rTq(A);
            if (q === "Do") return K.ordinalNumber(Y, {
                unit: "dayOfYear"
            });
            return Bz(Y, q.length)
        },
        E: function(A, q, K) {
            let Y = A.getDay();
            switch (q) {
                case "E":
                case "EE":
                case "EEE":
                    return K.day(Y, {
                        width: "abbreviated",
                        context: "formatting"
                    });
                case "EEEEE":
                    return K.day(Y, {
                        width: "narrow",
                        context: "formatting"
                    });
                case "EEEEEE":
                    return K.day(Y, {
                        width: "short",
                        context: "formatting"
                    });
                case "EEEE":
                default:
                    return K.day(Y, {
                        width: "wide",
                        context: "formatting"
                    })
            }
        },
        e: function(A, q, K, Y) {
            let z = A.getDay(),
                w = (z - Y.weekStartsOn + 8) % 7 || 7;
            switch (q) {
                case "e":
                    return String(w);
                case "ee":
                    return Bz(w, 2);
                case "eo":
                    return K.ordinalNumber(w, {
                        unit: "day"
                    });
                case "eee":
                    return K.day(z, {
                        width: "abbreviated",
                        context: "formatting"
                    });
                case "eeeee":
                    return K.day(z, {
                        width: "narrow",
                        context: "formatting"
                    });
                case "eeeeee":
                    return K.day(z, {
                        width: "short",
                        context: "formatting"
                    });
                case "eeee":
                default:
                    return K.day(z, {
                        width: "wide",
                        context: "formatting"
                    })
            }
        },
        c: function(A, q, K, Y) {
            let z = A.getDay(),
                w = (z - Y.weekStartsOn + 8) % 7 || 7;
            switch (q) {
                case "c":
                    return String(w);
                case "cc":
                    return Bz(w, q.length);
                case "co":
                    return K.ordinalNumber(w, {
                        unit: "day"
                    });
                case "ccc":
                    return K.day(z, {
                        width: "abbreviated",
                        context: "standalone"
                    });
                case "ccccc":
                    return K.day(z, {
                        width: "narrow",
                        context: "standalone"
                    });
                case "cccccc":
                    return K.day(z, {
                        width: "short",
                        context: "standalone"
                    });
                case "cccc":
                default:
                    return K.day(z, {
                        width: "wide",
                        context: "standalone"
                    })
            }
        },
        i: function(A, q, K) {
            let Y = A.getDay(),
                z = Y === 0 ? 7 : Y;
            switch (q) {
                case "i":
                    return String(z);
                case "ii":
                    return Bz(z, q.length);
                case "io":
                    return K.ordinalNumber(z, {
                        unit: "day"
                    });
                case "iii":
                    return K.day(Y, {
                        width: "abbreviated",
                        context: "formatting"
                    });
                case "iiiii":
                    return K.day(Y, {
                        width: "narrow",
                        context: "formatting"
                    });
                case "iiiiii":
                    return K.day(Y, {
                        width: "short",
                        context: "formatting"
                    });
                case "iiii":
                default:
                    return K.day(Y, {
                        width: "wide",
                        context: "formatting"
                    })
            }
        },
        a: function(A, q, K) {
            let z = A.getHours() / 12 >= 1 ? "pm" : "am";
            switch (q) {
                case "a":
                case "aa":
                    return K.dayPeriod(z, {
                        width: "abbreviated",
                        context: "formatting"
                    });
                case "aaa":
                    return K.dayPeriod(z, {
                        width: "abbreviated",
                        context: "formatting"
                    }).toLowerCase();
                case "aaaaa":
                    return K.dayPeriod(z, {
                        width: "narrow",
                        context: "formatting"
                    });
                case "aaaa":
                default:
                    return K.dayPeriod(z, {
                        width: "wide",
                        context: "formatting"
                    })
            }
        },
        b: function(A, q, K) {
            let Y = A.getHours(),
                z;
            if (Y === 12) z = Qf1.noon;
            else if (Y === 0) z = Qf1.midnight;
            else z = Y / 12 >= 1 ? "pm" : "am";
            switch (q) {
                case "b":
                case "bb":
                    return K.dayPeriod(z, {
                        width: "abbreviated",
                        context: "formatting"
                    });
                case "bbb":
                    return K.dayPeriod(z, {
                        width: "abbreviated",
                        context: "formatting"
                    }).toLowerCase();
                case "bbbbb":
                    return K.dayPeriod(z, {
                        width: "narrow",
                        context: "formatting"
                    });
                case "bbbb":
                default:
                    return K.dayPeriod(z, {
                        width: "wide",
                        context: "formatting"
                    })
            }
        },
        B: function(A, q, K) {
            let Y = A.getHours(),
                z;
            if (Y >= 17) z = Qf1.evening;
            else if (Y >= 12) z = Qf1.afternoon;
            else if (Y >= 4) z = Qf1.morning;
            else z = Qf1.night;
            switch (q) {
                case "B":
                case "BB":
                case "BBB":
                    return K.dayPeriod(z, {
                        width: "abbreviated",
                        context: "formatting"
                    });
                case "BBBBB":
                    return K.dayPeriod(z, {
                        width: "narrow",
                        context: "formatting"
                    });
                case "BBBB":
                default:
                    return K.dayPeriod(z, {
                        width: "wide",
                        context: "formatting"
                    })
            }
        },
        h: function(A, q, K) {
            if (q === "ho") {
                let Y = A.getHours() % 12;
                if (Y === 0) Y = 12;
                return K.ordinalNumber(Y, {
                    unit: "hour"
                })
            }
            return nc.h(A, q)
        },
        H: function(A, q, K) {
            if (q === "Ho") return K.ordinalNumber(A.getHours(), {
                unit: "hour"
            });
            return nc.H(A, q)
        },
        K: function(A, q, K) {
            let Y = A.getHours() % 12;
            if (q === "Ko") return K.ordinalNumber(Y, {
                unit: "hour"
            });
            return Bz(Y, q.length)
        },
        k: function(A, q, K) {
            let Y = A.getHours();
            if (Y === 0) Y = 24;
            if (q === "ko") return K.ordinalNumber(Y, {
                unit: "hour"
            });
            return Bz(Y, q.length)
        },
        m: function(A, q, K) {
            if (q === "mo") return K.ordinalNumber(A.getMinutes(), {
                unit: "minute"
            });
            return nc.m(A, q)
        },
        s: function(A, q, K) {
            if (q === "so") return K.ordinalNumber(A.getSeconds(), {
                unit: "second"
            });
            return nc.s(A, q)
        },
        S: function(A, q) {
            return nc.S(A, q)
        },
        X: function(A, q, K) {
            let Y = A.getTimezoneOffset();
            if (Y === 0) return "Z";
            switch (q) {
                case "X":
                    return Avq(Y);
                case "XXXX":
                case "XX":
                    return LY1(Y);
                case "XXXXX":
                case "XXX":
                default:
                    return LY1(Y, ":")
            }
        },
        x: function(A, q, K) {
            let Y = A.getTimezoneOffset();
            switch (q) {
                case "x":
                    return Avq(Y);
                case "xxxx":
                case "xx":
                    return LY1(Y);
                case "xxxxx":
                case "xxx":
                default:
                    return LY1(Y, ":")
            }
        },
        O: function(A, q, K) {
            let Y = A.getTimezoneOffset();
            switch (q) {
                case "O":
                case "OO":
                case "OOO":
                    return "GMT" + eTq(Y, ":");
                case "OOOO":
                default:
                    return "GMT" + LY1(Y, ":")
            }
        },
        z: function(A, q, K) {
            let Y = A.getTimezoneOffset();
            switch (q) {
                case "z":
                case "zz":
                case "zzz":
                    return "GMT" + eTq(Y, ":");
                case "zzzz":
                default:
                    return "GMT" + LY1(Y, ":")
            }
        },
        t: function(A, q, K) {
            let Y = Math.trunc(+A / 1000);
            return Bz(Y, q.length)
        },
        T: function(A, q, K) {
            return Bz(+A, q.length)
        }
    }
})
// @from(Ln 485123, Col 4)
Kvq = (A, q) => {
        switch (A) {
            case "P":
                return q.date({
                    width: "short"
                });
            case "PP":
                return q.date({
                    width: "medium"
                });
            case "PPP":
                return q.date({
                    width: "long"
                });
            case "PPPP":
            default:
                return q.date({
                    width: "full"
                })
        }
    }
// @from(Ln 485144, Col 4)
Yvq = (A, q) => {
        switch (A) {
            case "p":
                return q.time({
                    width: "short"
                });
            case "pp":
                return q.time({
                    width: "medium"
                });
            case "ppp":
                return q.time({
                    width: "long"
                });
            case "pppp":
            default:
                return q.time({
                    width: "full"
                })
        }
    }
// @from(Ln 485165, Col 4)
cPz = (A, q) => {
        let K = A.match(/(P+)(p+)?/) || [],
            Y = K[1],
            z = K[2];
        if (!z) return Kvq(A, q);
        let w;
        switch (Y) {
            case "P":
                w = q.dateTime({
                    width: "short"
                });
                break;
            case "PP":
                w = q.dateTime({
                    width: "medium"
                });
                break;
            case "PPP":
                w = q.dateTime({
                    width: "long"
                });
                break;
            case "PPPP":
            default:
                w = q.dateTime({
                    width: "full"
                });
                break
        }
        return w.replace("{{date}}", Kvq(Y, q)).replace("{{time}}", Yvq(z, q))
    }
// @from(Ln 485196, Col 4)
zvq
// @from(Ln 485197, Col 4)
wvq = v(() => {
    zvq = {
        p: Yvq,
        P: cPz
    }
})
// @from(Ln 485204, Col 0)
function Hvq(A) {
    return lPz.test(A)
}
// @from(Ln 485208, Col 0)
function $vq(A) {
    return iPz.test(A)
}
// @from(Ln 485212, Col 0)
function Ovq(A, q, K) {
    let Y = rPz(A, q, K);
    if (console.warn(Y), nPz.includes(A)) throw RangeError(Y)
}
// @from(Ln 485217, Col 0)
function rPz(A, q, K) {
    let Y = A[0] === "Y" ? "years" : "days of the month";
    return `Use \`${A.toLowerCase()}\` instead of \`${A}\` (in \`${q}\`) for formatting ${Y} to the input \`${K}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`
}
// @from(Ln 485221, Col 4)
lPz
// @from(Ln 485221, Col 9)
iPz
// @from(Ln 485221, Col 14)
nPz
// @from(Ln 485222, Col 4)
_vq = v(() => {
    lPz = /^D+$/, iPz = /^Y+$/, nPz = ["D", "DD", "YY", "YYYY"]
})
// @from(Ln 485226, Col 0)
function Jvq(A, q, K) {
    let Y = W11(),
        z = K?.locale ?? Y.locale ?? PUA,
        w = K?.firstWeekContainsDate ?? K?.locale?.options?.firstWeekContainsDate ?? Y.firstWeekContainsDate ?? Y.locale?.options?.firstWeekContainsDate ?? 1,
        H = K?.weekStartsOn ?? K?.locale?.options?.weekStartsOn ?? Y.weekStartsOn ?? Y.locale?.options?.weekStartsOn ?? 0,
        $ = n_(A, K?.in);
    if (!UNq($)) throw RangeError("Invalid time value");
    let O = q.match(aPz).map((J) => {
        let X = J[0];
        if (X === "p" || X === "P") {
            let D = zvq[X];
            return D(J, z.formatLong)
        }
        return J
    }).join("").match(oPz).map((J) => {
        if (J === "''") return {
            isToken: !1,
            value: "'"
        };
        let X = J[0];
        if (X === "'") return {
            isToken: !1,
            value: AWz(J)
        };
        if (VUA[X]) return {
            isToken: !0,
            value: J
        };
        if (X.match(ePz)) throw RangeError("Format string contains an unescaped latin alphabet character `" + X + "`");
        return {
            isToken: !1,
            value: J
        }
    });
    if (z.localize.preprocessor) O = z.localize.preprocessor($, O);
    let _ = {
        firstWeekContainsDate: w,
        weekStartsOn: H,
        locale: z
    };
    return O.map((J) => {
        if (!J.isToken) return J.value;
        let X = J.value;
        if (!K?.useAdditionalWeekYearTokens && $vq(X) || !K?.useAdditionalDayOfYearTokens && Hvq(X)) Ovq(X, q, String(A));
        let D = VUA[X[0]];
        return D($, X, z.localize, _)
    }).join("")
}
// @from(Ln 485275, Col 0)
function AWz(A) {
    let q = A.match(sPz);
    if (!q) return A;
    return q[1].replace(tPz, "'")
}
// @from(Ln 485280, Col 4)
oPz
// @from(Ln 485280, Col 9)
aPz
// @from(Ln 485280, Col 14)
sPz
// @from(Ln 485280, Col 19)
tPz
// @from(Ln 485280, Col 24)
ePz
// @from(Ln 485281, Col 4)
Xvq = v(() => {
    nTq();
    ac1();
    qvq();
    wvq();
    _vq();
    jUA();
    mE();
    oPz = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, aPz = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, sPz = /^'([^]*?)'?$/, tPz = /''/g, ePz = /[a-zA-Z]/
})
// @from(Ln 485291, Col 4)
Dvq = () => {}
// @from(Ln 485292, Col 4)
jvq = () => {}
// @from(Ln 485293, Col 4)
Mvq = () => {}
// @from(Ln 485294, Col 4)
Pvq = () => {}
// @from(Ln 485295, Col 4)
Wvq = () => {}
// @from(Ln 485296, Col 4)
Gvq = () => {}
// @from(Ln 485297, Col 4)
Zvq = () => {}
// @from(Ln 485298, Col 4)
fvq = () => {}
// @from(Ln 485299, Col 4)
Vvq = () => {}
// @from(Ln 485300, Col 4)
Nvq = () => {}
// @from(Ln 485301, Col 4)
Tvq = () => {}
// @from(Ln 485302, Col 4)
vvq = () => {}
// @from(Ln 485303, Col 4)
Evq = () => {}
// @from(Ln 485304, Col 4)
kvq = () => {}
// @from(Ln 485305, Col 4)
Lvq = () => {}
// @from(Ln 485306, Col 4)
Rvq = () => {}
// @from(Ln 485307, Col 4)
yvq = () => {}
// @from(Ln 485308, Col 4)
Cvq = () => {}
// @from(Ln 485309, Col 4)
Svq = () => {}
// @from(Ln 485310, Col 4)
hvq = () => {}
// @from(Ln 485311, Col 4)
Ivq = () => {}
// @from(Ln 485312, Col 4)
xvq = () => {}
// @from(Ln 485313, Col 4)
bvq = () => {}
// @from(Ln 485314, Col 4)
uvq = () => {}
// @from(Ln 485315, Col 4)
Bvq = () => {}
// @from(Ln 485316, Col 4)
mvq = () => {}
// @from(Ln 485317, Col 4)
Fvq = () => {}
// @from(Ln 485318, Col 4)
Qvq = () => {}
// @from(Ln 485319, Col 4)
gvq = () => {}
// @from(Ln 485320, Col 4)
Uvq = () => {}
// @from(Ln 485321, Col 4)
pvq = () => {}
// @from(Ln 485322, Col 4)
dvq = () => {}
// @from(Ln 485323, Col 4)
cvq = () => {}
// @from(Ln 485324, Col 4)
lvq = () => {}
// @from(Ln 485325, Col 4)
ivq = () => {}
// @from(Ln 485326, Col 4)
nvq = () => {}
// @from(Ln 485327, Col 4)
rvq = () => {}
// @from(Ln 485328, Col 4)
ovq = () => {}
// @from(Ln 485329, Col 4)
avq = () => {}
// @from(Ln 485330, Col 4)
svq = () => {}
// @from(Ln 485331, Col 4)
tvq = () => {}
// @from(Ln 485332, Col 4)
evq = () => {}
// @from(Ln 485333, Col 4)
AEq = () => {}
// @from(Ln 485334, Col 4)
qEq = () => {}
// @from(Ln 485335, Col 4)
KEq = () => {}
// @from(Ln 485336, Col 4)
YEq = () => {}
// @from(Ln 485337, Col 4)
zEq = () => {}
// @from(Ln 485338, Col 4)
wEq = () => {}
// @from(Ln 485339, Col 4)
HEq = () => {}
// @from(Ln 485340, Col 4)
$Eq = () => {}
// @from(Ln 485341, Col 4)
OEq = () => {}
// @from(Ln 485342, Col 4)
_Eq = () => {}
// @from(Ln 485343, Col 4)
JEq = () => {}
// @from(Ln 485344, Col 4)
XEq = () => {}
// @from(Ln 485345, Col 4)
DEq = () => {}
// @from(Ln 485346, Col 4)
jEq = () => {}
// @from(Ln 485347, Col 4)
MEq = () => {}
// @from(Ln 485348, Col 4)
PEq = () => {}
// @from(Ln 485349, Col 4)
WEq = () => {}
// @from(Ln 485350, Col 4)
GEq = () => {}
// @from(Ln 485351, Col 4)
ZEq = () => {}
// @from(Ln 485352, Col 4)
fEq = () => {}
// @from(Ln 485353, Col 4)
VEq = () => {}
// @from(Ln 485354, Col 4)
NEq = () => {}
// @from(Ln 485355, Col 4)
TEq = () => {}
// @from(Ln 485356, Col 4)
vEq = () => {}
// @from(Ln 485357, Col 4)
EEq = () => {}
// @from(Ln 485358, Col 4)
kEq = () => {}
// @from(Ln 485359, Col 4)
LEq = () => {}
// @from(Ln 485360, Col 4)
REq = () => {}
// @from(Ln 485361, Col 4)
yEq = () => {}
// @from(Ln 485362, Col 4)
CEq = () => {}
// @from(Ln 485363, Col 4)
SEq = () => {}
// @from(Ln 485364, Col 4)
hEq = () => {}
// @from(Ln 485365, Col 4)
IEq = () => {}
// @from(Ln 485366, Col 4)
xEq = () => {}
// @from(Ln 485367, Col 4)
bEq = () => {}
// @from(Ln 485368, Col 4)
uEq = () => {}
// @from(Ln 485369, Col 4)
BEq = () => {}
// @from(Ln 485370, Col 4)
mEq = () => {}
// @from(Ln 485371, Col 4)
FEq = () => {}
// @from(Ln 485372, Col 4)
QEq = () => {}
// @from(Ln 485373, Col 4)
gEq = () => {}
// @from(Ln 485374, Col 4)
UEq = () => {}
// @from(Ln 485375, Col 4)
pEq = () => {}
// @from(Ln 485376, Col 4)
dEq = () => {}
// @from(Ln 485377, Col 4)
cEq = () => {}
// @from(Ln 485378, Col 4)
lEq = () => {}
// @from(Ln 485379, Col 4)
iEq = () => {}
// @from(Ln 485380, Col 4)
nEq = () => {}
// @from(Ln 485381, Col 4)
rEq = () => {}
// @from(Ln 485382, Col 4)
oEq = () => {}
// @from(Ln 485383, Col 4)
aEq = () => {}
// @from(Ln 485384, Col 4)
sEq = () => {}
// @from(Ln 485385, Col 4)
tEq = () => {}
// @from(Ln 485386, Col 4)
eEq = () => {}
// @from(Ln 485387, Col 4)
Akq = () => {}
// @from(Ln 485388, Col 4)
qkq = () => {}
// @from(Ln 485389, Col 4)
Kkq = () => {}
// @from(Ln 485390, Col 4)
Ykq = () => {}
// @from(Ln 485391, Col 4)
zkq = () => {}
// @from(Ln 485392, Col 4)
wkq = () => {}
// @from(Ln 485393, Col 4)
Hkq = () => {}
// @from(Ln 485394, Col 4)
$kq = () => {}
// @from(Ln 485395, Col 4)
Okq = () => {}
// @from(Ln 485396, Col 4)
_kq = () => {}
// @from(Ln 485397, Col 4)
Jkq = () => {}
// @from(Ln 485398, Col 4)
Xkq = () => {}
// @from(Ln 485399, Col 4)
Dkq = () => {}
// @from(Ln 485400, Col 4)
jkq = () => {}
// @from(Ln 485401, Col 4)
Mkq = () => {}
// @from(Ln 485402, Col 4)
Pkq = () => {}
// @from(Ln 485403, Col 4)
Wkq = () => {}
// @from(Ln 485404, Col 4)
Gkq = () => {}
// @from(Ln 485405, Col 4)
Zkq = () => {}
// @from(Ln 485406, Col 4)
fkq = () => {}
// @from(Ln 485407, Col 4)
Vkq = () => {}
// @from(Ln 485408, Col 4)
Nkq = () => {}
// @from(Ln 485409, Col 4)
Tkq = () => {}
// @from(Ln 485410, Col 4)
vkq = () => {}
// @from(Ln 485411, Col 4)
Ekq = () => {}
// @from(Ln 485412, Col 4)
kkq = () => {}
// @from(Ln 485413, Col 4)
Lkq = () => {}
// @from(Ln 485414, Col 4)
Rkq = () => {}
// @from(Ln 485415, Col 4)
ykq = () => {}
// @from(Ln 485416, Col 4)
Ckq = () => {}
// @from(Ln 485417, Col 4)
Skq = () => {}
// @from(Ln 485418, Col 4)
hkq = () => {}
// @from(Ln 485419, Col 4)
Ikq = () => {}
// @from(Ln 485420, Col 4)
xkq = () => {}
// @from(Ln 485421, Col 4)
bkq = () => {}
// @from(Ln 485422, Col 4)
ukq = () => {}
// @from(Ln 485423, Col 4)
Bkq = () => {}
// @from(Ln 485424, Col 4)
mkq = () => {}
// @from(Ln 485425, Col 4)
Fkq = () => {}
// @from(Ln 485426, Col 4)
Qkq = () => {}
// @from(Ln 485427, Col 4)
gkq = () => {}
// @from(Ln 485428, Col 4)
Ukq = () => {}
// @from(Ln 485429, Col 4)
pkq = () => {}
// @from(Ln 485430, Col 4)
dkq = () => {}
// @from(Ln 485431, Col 4)
ckq = () => {}
// @from(Ln 485432, Col 4)
lkq = () => {}
// @from(Ln 485433, Col 4)
ikq = () => {}
// @from(Ln 485434, Col 4)
nkq = () => {}
// @from(Ln 485435, Col 4)
rkq = () => {}
// @from(Ln 485436, Col 4)
okq = () => {}
// @from(Ln 485437, Col 4)
akq = () => {}
// @from(Ln 485438, Col 4)
skq = () => {}
// @from(Ln 485439, Col 4)
tkq = () => {}
// @from(Ln 485440, Col 4)
ekq = () => {}
// @from(Ln 485441, Col 4)
ALq = () => {}
// @from(Ln 485442, Col 4)
qLq = () => {}
// @from(Ln 485443, Col 4)
KLq = () => {}
// @from(Ln 485444, Col 4)
YLq = () => {}
// @from(Ln 485445, Col 4)
zLq = () => {}
// @from(Ln 485446, Col 4)
wLq = v(() => {
    JNq();
    MNq();
    ONq();
    WNq();
    vNq();
    PNq();
    ENq();
    _Nq();
    kNq();
    LNq();
    RNq();
    yNq();
    CNq();
    INq();
    xNq();
    bNq();
    uNq();
    BNq();
    P11();
    mNq();
    FNq();
    pNq();
    JUA();
    dNq();
    cNq();
    lNq();
    nNq();
    rNq();
    oNq();
    aNq();
    sNq();
    eNq();
    ATq();
    qTq();
    wTq();
    HTq();
    $Tq();
    OTq();
    _Tq();
    JTq();
    XTq();
    DTq();
    jTq();
    PTq();
    WTq();
    GTq();
    fTq();
    TTq();
    vTq();
    KTq();
    ETq();
    kTq();
    RTq();
    yTq();
    CTq();
    YTq();
    STq();
    hTq();
    ITq();
    xTq();
    LTq();
    VTq();
    bTq();
    Xvq();
    Dvq();
    jvq();
    Mvq();
    Pvq();
    Wvq();
    Gvq();
    Zvq();
    fvq();
    Vvq();
    Nvq();
    Tvq();
    vvq();
    Evq();
    kvq();
    WUA();
    Lvq();
    yvq();
    Cvq();
    Svq();
    hvq();
    Ivq();
    GUA();
    kE6();
    xvq();
    bvq();
    uvq();
    Bvq();
    mvq();
    iNq();
    Fvq();
    Qvq();
    gvq();
    fUA();
    Uvq();
    yE6();
    dvq();
    cvq();
    lvq();
    ivq();
    nvq();
    rvq();
    ovq();
    avq();
    svq();
    tvq();
    evq();
    DUA();
    AEq();
    qEq();
    KEq();
    YEq();
    zEq();
    zTq();
    Rvq();
    XEq();
    DEq();
    jEq();
    QNq();
    PEq();
    GEq();
    ZEq();
    VEq();
    NEq();
    TEq();
    EEq();
    WEq();
    kEq();
    XNq();
    DNq();
    LEq();
    REq();
    yEq();
    CEq();
    SEq();
    hEq();
    IEq();
    xEq();
    bEq();
    uEq();
    BEq();
    mEq();
    jUA();
    FEq();
    jNq();
    QEq();
    UEq();
    pEq();
    cEq();
    lEq();
    pvq();
    iEq();
    dEq();
    nEq();
    rEq();
    SNq();
    oEq();
    aEq();
    sEq();
    tEq();
    hNq();
    eEq();
    Akq();
    qkq();
    Kkq();
    Ykq();
    zkq();
    wkq();
    Hkq();
    $kq();
    Okq();
    _kq();
    Jkq();
    Xkq();
    JEq();
    Dkq();
    jkq();
    Mkq();
    Pkq();
    Wkq();
    Gkq();
    Zkq();
    fkq();
    Vkq();
    Nkq();
    Tkq();
    vkq();
    Ekq();
    kkq();
    Lkq();
    Rkq();
    ykq();
    Skq();
    hkq();
    OEq();
    Ikq();
    xkq();
    bkq();
    _Eq();
    $Eq();
    TNq();
    ukq();
    Bkq();
    Ckq();
    mkq();
    Fkq();
    HEq();
    Qkq();
    gkq();
    _UA();
    Ukq();
    MEq();
    sc1();
    XUA();
    fEq();
    ZTq();
    MTq();
    vEq();
    pkq();
    dkq();
    Bf1();
    ZUA();
    MUA();
    ckq();
    ikq();
    nkq();
    gEq();
    rkq();
    tNq();
    okq();
    akq();
    lkq();
    skq();
    tkq();
    ekq();
    ALq();
    mE();
    wEq();
    qLq();
    KLq();
    YLq();
    zLq()
})
// @from(Ln 485694, Col 0)
function HLq() {
    let A = e(15),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = [], A[0] = q;
    else q = A[0];
    let [K, Y] = tc1.useState(q), [z, w] = tc1.useState(0), H, $;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) H = () => {
        let M = b8.getSandboxViolationStore();
        return M.subscribe((W) => {
            Y(W.slice(-10)), w(M.getTotalCount())
        })
    }, $ = [], A[1] = H, A[2] = $;
    else H = A[1], $ = A[2];
    if (tc1.useEffect(H, $), !b8.isSandboxingEnabled() || eA() === "linux") return null;
    if (z === 0) return null;
    let O = z === 1 ? "operation" : "operations",
        _;
    if (A[3] !== O || A[4] !== z) _ = Wf.createElement(I, {
        marginLeft: 0
    }, Wf.createElement(V, {
        color: "permission"
    }, "⧈ Sandbox blocked ", z, " total", " ", O)), A[3] = O, A[4] = z, A[5] = _;
    else _ = A[5];
    let J;
    if (A[6] !== K) J = K.map(qWz), A[6] = K, A[7] = J;
    else J = A[7];
    let X = Math.min(10, K.length),
        D;
    if (A[8] !== X || A[9] !== z) D = Wf.createElement(I, {
        paddingLeft: 2
    }, Wf.createElement(V, {
        dimColor: !0
    }, "… showing last ", X, " of ", z)), A[8] = X, A[9] = z, A[10] = D;
    else D = A[10];
    let j;
    if (A[11] !== _ || A[12] !== J || A[13] !== D) j = Wf.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, _, J, D), A[11] = _, A[12] = J, A[13] = D, A[14] = j;
    else j = A[14];
    return j
}
// @from(Ln 485737, Col 0)
function qWz(A, q) {
    return Wf.createElement(I, {
        key: `${A.timestamp.getTime()}-${q}`,
        paddingLeft: 2
    }, Wf.createElement(V, {
        dimColor: !0
    }, Jvq(A.timestamp, "h:mm:ssa"), A.command ? ` ${A.command}:` : "", " ", A.line))
}
// @from(Ln 485745, Col 4)
Wf
// @from(Ln 485745, Col 8)
tc1
// @from(Ln 485746, Col 4)
$Lq = v(() => {
    i1();
    m1();
    k2();
    wLq();
    x3();
    Wf = o(X1(), 1), tc1 = o(X1(), 1)
})
// @from(Ln 485755, Col 0)
function _Lq(A) {
    let q = e(6),
        {
            mcpClients: K
        } = A,
        Y;
    if (q[0] !== K) Y = K === void 0 ? [] : K, q[0] = K, q[1] = Y;
    else Y = q[1];
    let z = Y,
        {
            addNotification: w
        } = iq(),
        H, $;
    if (q[2] !== w || q[3] !== z) H = () => {
        if (Nq()) return;
        let O = z.filter(YWz),
            _ = z.filter(KWz);
        if (O.length === 0 && _.length === 0) return;
        if (O.length > 0) w({
            key: "mcp-failed",
            jsx: mj.createElement(mj.Fragment, null, mj.createElement(V, {
                color: "error"
            }, O.length, " MCP", " ", O.length === 1 ? "server" : "servers", " failed"), mj.createElement(V, {
                dimColor: !0
            }, " · /mcp")),
            priority: "medium"
        });
        if (_.length) w({
            key: "mcp-needs-auth",
            jsx: mj.createElement(mj.Fragment, null, mj.createElement(V, {
                color: "warning"
            }, _.length, " MCP", " ", _.length === 1 ? "server needs" : "servers need", " ", "auth"), mj.createElement(V, {
                dimColor: !0
            }, " · /mcp")),
            priority: "medium"
        })
    }, $ = [w, z], q[2] = w, q[3] = z, q[4] = H, q[5] = $;
    else H = q[4], $ = q[5];
    OLq.useEffect(H, $)
}
// @from(Ln 485796, Col 0)
function KWz(A) {
    return A.type === "needs-auth" && A.config.type !== "claudeai-proxy"
}
// @from(Ln 485800, Col 0)
function YWz(A) {
    return A.type === "failed" && A.config.type !== "sse-ide" && A.config.type !== "ws-ide" && A.config.type !== "claudeai-proxy"
}
// @from(Ln 485803, Col 4)
mj
// @from(Ln 485803, Col 8)
OLq
// @from(Ln 485804, Col 4)
JLq = v(() => {
    i1();
    m1();
    B6();
    h2();
    mj = o(X1(), 1), OLq = o(X1(), 1)
})
// @from(Ln 485812, Col 0)
function XLq() {
    let A = e(9),
        {
            addNotification: q
        } = iq(),
        K = L7(),
        [Y, z] = jG.useState(!0),
        w;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) w = new Set, A[0] = w;
    else w = A[0];
    let H = jG.useRef(w),
        $;
    if (A[1] !== q || A[2] !== K) $ = (j, M) => {
        let P = `${j}:${M}`;
        if (H.current.has(P)) return;
        H.current.add(P), h(`LSP error: ${j} - ${M}`), K((G) => {
            let f = new Set(G.plugins.errors.map(wWz)),
                Z = `generic-error:${j}:${M}`;
            if (f.has(Z)) return G;
            return {
                ...G,
                plugins: {
                    ...G.plugins,
                    errors: [...G.plugins.errors, {
                        type: "generic-error",
                        source: j,
                        error: M
                    }]
                }
            }
        });
        let W = j.startsWith("plugin:") ? j.split(":")[1] ?? j : j;
        q({
            key: `lsp-error-${j}`,
            jsx: jG.createElement(jG.Fragment, null, jG.createElement(V, {
                color: "error"
            }, "LSP for ", W, " failed"), jG.createElement(V, {
                dimColor: !0
            }, " · /plugin for details")),
            priority: "medium",
            timeoutMs: 8000
        })
    }, A[1] = q, A[2] = K, A[3] = $;
    else $ = A[3];
    let O = $,
        _;
    if (A[4] !== O) _ = () => {
        if (Nq()) return;
        let j = W51();
        if (j.status === "failed") {
            O("lsp-manager", j.error.message), z(!1);
            return
        }
        if (j.status === "pending" || j.status === "not-started") return;
        let M = md();
        if (M) {
            let P = M.getAllServers();
            for (let [W, G] of P)
                if (G.state === "error" && G.lastError) O(W, G.lastError.message)
        }
    }, A[4] = O, A[5] = _;
    else _ = A[5];
    let J = _;
    RX(J, Y ? zWz : null);
    let X, D;
    if (A[6] !== J) X = () => {
        if (Nq()) return;
        J()
    }, D = [J], A[6] = J, A[7] = X, A[8] = D;
    else X = A[7], D = A[8];
    jG.useEffect(X, D)
}
// @from(Ln 485885, Col 0)
function wWz(A) {
    if (A.type === "generic-error") return `generic-error:${A.source}:${A.error}`;
    return `${A.type}:${A.source}`
}
// @from(Ln 485889, Col 4)
jG
// @from(Ln 485889, Col 8)
zWz = 5000
// @from(Ln 485890, Col 4)
DLq = v(() => {
    i1();
    m1();
    B6();
    h2();
    d8();
    XZ();
    Ot();
    Z6();
    jG = o(X1(), 1)
})
// @from(Ln 485901, Col 0)
async function MLq(A) {
    if (!A || !A.trim()) return h("[binaryCheck] Empty command provided, returning false"), !1;
    let q = A.trim(),
        K = jLq.get(q);
    if (K !== void 0) return h(`[binaryCheck] Cache hit for '${q}': ${K}`), K;
    let Y = !1;
    if (await mf(q).catch(() => null)) Y = !0;
    return jLq.set(q, Y), h(`[binaryCheck] Binary '${q}' ${Y?"found":"not found"}`), Y
}
// @from(Ln 485910, Col 4)
jLq
// @from(Ln 485911, Col 4)
PLq = v(() => {
    Z6();
    WQ();
    jLq = new Map
})
// @from(Ln 485920, Col 0)
function OWz(A) {
    return NT.has(A.toLowerCase())
}
// @from(Ln 485924, Col 0)
function _Wz(A) {
    if (!A) return null;
    if (typeof A === "string") return h("[lspRecommendation] Skipping string path lspServers (not readable from marketplace)"), null;
    if (Array.isArray(A)) {
        for (let q of A) {
            if (typeof q === "string") continue;
            let K = GLq(q);
            if (K) return K
        }
        return null
    }
    return GLq(A)
}
// @from(Ln 485938, Col 0)
function WLq(A) {
    return typeof A === "object" && A !== null
}
// @from(Ln 485942, Col 0)
function GLq(A) {
    let q = new Set,
        K = null;
    for (let [Y, z] of Object.entries(A)) {
        if (!WLq(z)) continue;
        if (!K && typeof z.command === "string") K = z.command;
        let w = z.extensionToLanguage;
        if (WLq(w))
            for (let H of Object.keys(w)) q.add(H.toLowerCase())
    }
    if (!K || q.size === 0) return null;
    return {
        extensions: q,
        command: K
    }
}
// @from(Ln 485958, Col 0)
async function JWz() {
    let A = new Map;
    try {
        let q = await n5();
        for (let K of Object.keys(q)) try {
            let Y = await NZ(K),
                z = OWz(K);
            for (let w of Y.plugins) {
                if (!w.lspServers) continue;
                let H = _Wz(w.lspServers);
                if (!H) continue;
                let $ = `${w.name}@${K}`;
                A.set($, {
                    entry: w,
                    marketplaceName: K,
                    extensions: H.extensions,
                    command: H.command,
                    isOfficial: z
                })
            }
        } catch (Y) {
            h(`[lspRecommendation] Failed to load marketplace ${K}: ${Y}`)
        }
    } catch (q) {
        h(`[lspRecommendation] Failed to load marketplaces config: ${q}`)
    }
    return A
}
// @from(Ln 485986, Col 0)
async function ZLq(A) {
    if (XWz()) return h("[lspRecommendation] Recommendations are disabled"), [];
    let q = HWz(A).toLowerCase();
    if (!q) return h("[lspRecommendation] No file extension found"), [];
    h(`[lspRecommendation] Looking for LSP plugins for ${q}`);
    let K = await JWz(),
        z = f6().lspRecommendationNeverPlugins ?? [],
        w = [];
    for (let [$, O] of K) {
        if (!O.extensions.has(q)) continue;
        if (z.includes($)) {
            h(`[lspRecommendation] Skipping ${$} (in never suggest list)`);
            continue
        }
        if (BM($)) {
            h(`[lspRecommendation] Skipping ${$} (already installed)`);
            continue
        }
        w.push({
            info: O,
            pluginId: $
        })
    }
    let H = [];
    for (let {
            info: $,
            pluginId: O
        }
        of w)
        if (await MLq($.command)) H.push({
            info: $,
            pluginId: O
        }), h(`[lspRecommendation] Binary '${$.command}' found for ${O}`);
        else h(`[lspRecommendation] Skipping ${O} (binary '${$.command}' not found)`);
    return H.sort(($, O) => {
        if ($.info.isOfficial && !O.info.isOfficial) return -1;
        if (!$.info.isOfficial && O.info.isOfficial) return 1;
        return 0
    }), H.map(({
        info: $,
        pluginId: O
    }) => ({
        pluginId: O,
        pluginName: $.entry.name,
        marketplaceName: $.marketplaceName,
        description: $.entry.description,
        isOfficial: $.isOfficial,
        extensions: Array.from($.extensions),
        command: $.command
    }))
}
// @from(Ln 486038, Col 0)
function fLq(A) {
    jA((q) => {
        let K = q.lspRecommendationNeverPlugins ?? [];
        if (K.includes(A)) return q;
        return {
            ...q,
            lspRecommendationNeverPlugins: [...K, A]
        }
    }), h(`[lspRecommendation] Added ${A} to never suggest`)
}
// @from(Ln 486049, Col 0)
function VLq() {
    jA((A) => {
        let q = (A.lspRecommendationIgnoredCount ?? 0) + 1;
        return {
            ...A,
            lspRecommendationIgnoredCount: q
        }
    }), h("[lspRecommendation] Incremented ignored count")
}
// @from(Ln 486059, Col 0)
function XWz() {
    let A = f6();
    return A.lspRecommendationDisabled === !0 || (A.lspRecommendationIgnoredCount ?? 0) >= $Wz
}
// @from(Ln 486063, Col 4)
$Wz = 5
// @from(Ln 486064, Col 4)
NLq = v(() => {
    p$();
    N0();
    mM();
    PLq();
    cA();
    Z6()
})
// @from(Ln 486077, Col 0)
function TLq() {
    let A = e(11),
        q = v6(WWz),
        {
            addNotification: K
        } = iq(),
        [Y, z] = yy.useState(null),
        w;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) w = new Set, A[0] = w;
    else w = A[0];
    let H = yy.useRef(w),
        $ = yy.useRef(!1),
        O, _;
    if (A[1] !== Y || A[2] !== q) O = () => {
        if (Nq()) return;
        if (Y) return;
        if ($.current) return;
        if (AR6()) return;
        let j = [];
        for (let P of q)
            if (!H.current.has(P)) H.current.add(P), j.push(P);
        if (j.length === 0) return;
        $.current = !0, M(j).finally(() => {
            $.current = !1
        });
        async function M(P) {
            for (let W of P) try {
                let f = (await ZLq(W))[0];
                if (f) {
                    h(`[useLspPluginRecommendation] Found match: ${f.pluginName} for ${W}`), z({
                        pluginId: f.pluginId,
                        pluginName: f.pluginName,
                        pluginDescription: f.description,
                        fileExtension: DWz(W),
                        shownAt: Date.now()
                    }), qR6(!0);
                    return
                }
            } catch (G) {
                let f = G;
                K1(f instanceof Error ? f : Error(String(f)))
            }
        }
    }, _ = [q, Y], A[1] = Y, A[2] = q, A[3] = O, A[4] = _;
    else O = A[3], _ = A[4];
    yy.useEffect(O, _);
    let J;
    if (A[5] !== K || A[6] !== Y) J = (j) => {
        if (!Y) return;
        let {
            pluginId: M,
            pluginName: P,
            shownAt: W
        } = Y;
        h(`[useLspPluginRecommendation] User response: ${j} for ${P}`);
        A: switch (j) {
            case "yes": {
                GWz(M, P, K);
                break A
            }
            case "no": {
                let G = Date.now() - W;
                if (G >= MWz) h(`[useLspPluginRecommendation] Timeout detected (${G}ms), incrementing ignored count`), VLq();
                break A
            }
            case "never": {
                fLq(M);
                break A
            }
            case "disable":
                jA(PWz)
        }
        z(null)
    }, A[5] = K, A[6] = Y, A[7] = J;
    else J = A[7];
    let X = J,
        D;
    if (A[8] !== X || A[9] !== Y) D = {
        recommendation: Y,
        handleResponse: X
    }, A[8] = X, A[9] = Y, A[10] = D;
    else D = A[10];
    return D
}
// @from(Ln 486162, Col 0)
function PWz(A) {
    if (A.lspRecommendationDisabled) return A;
    return {
        ...A,
        lspRecommendationDisabled: !0
    }
}
// @from(Ln 486170, Col 0)
function WWz(A) {
    return A.fileHistory.trackedFiles
}
// @from(Ln 486173, Col 0)
async function GWz(A, q, K) {
    try {
        h(`[useLspPluginRecommendation] Installing plugin: ${A}`);
        let Y = await a0(A);
        if (!Y) throw Error(`Plugin ${A} not found in marketplace`);
        let z = typeof Y.entry.source === "string" ? jWz(Y.marketplaceInstallLocation, Y.entry.source) : void 0;
        await HE(A, Y.entry, "user", void 0, z);
        let w = y7("userSettings");
        Z7("userSettings", {
            enabledPlugins: {
                ...w?.enabledPlugins,
                [A]: !0
            }
        }), h(`[useLspPluginRecommendation] Plugin installed: ${A}`), K({
            key: "lsp-plugin-installed",
            jsx: yy.createElement(V, {
                color: "success"
            }, l1.tick, " ", q, " installed · restart to apply"),
            priority: "immediate",
            timeoutMs: 5000
        })
    } catch (Y) {
        K1(Y instanceof Error ? Y : Error(String(Y))), K({
            key: "lsp-plugin-install-failed",
            jsx: yy.createElement(V, {
                color: "error"
            }, "Failed to install ", q),
            priority: "immediate",
            timeoutMs: 5000
        })
    }
}
// @from(Ln 486205, Col 4)
yy
// @from(Ln 486205, Col 8)
MWz = 28000
// @from(Ln 486206, Col 4)
vLq = v(() => {
    i1();
    b7();
    m1();
    d8();
    h2();
    cA();
    B6();
    y6();
    Z6();
    NLq();
    ad();
    p$();
    p8();
    yy = o(X1(), 1)
})
// @from(Ln 486223, Col 0)
function ELq() {}
// @from(Ln 486225, Col 0)
function kLq({
    pluginName: A,
    pluginDescription: q,
    fileExtension: K,
    onResponse: Y
}) {
    let z = p3.useRef(Y);
    z.current = Y, p3.useEffect(() => {
        let $ = setTimeout(() => {
            z.current("no")
        }, ZWz);
        return () => clearTimeout($)
    }, []);

    function w($) {
        switch ($) {
            case "yes":
                Y("yes");
                break;
            case "no":
                Y("no");
                break;
            case "never":
                Y("never");
                break;
            case "disable":
                Y("disable");
                break
        }
    }
    return p3.createElement(Bw, {
        title: "LSP Plugin Recommendation"
    }, p3.createElement(I, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, p3.createElement(I, {
        marginBottom: 1
    }, p3.createElement(V, {
        dimColor: !0
    }, "LSP provides code intelligence like go-to-definition and error checking")), p3.createElement(I, null, p3.createElement(V, {
        dimColor: !0
    }, "Plugin:"), p3.createElement(V, null, " ", A)), q && p3.createElement(I, null, p3.createElement(V, {
        dimColor: !0
    }, q)), p3.createElement(I, null, p3.createElement(V, {
        dimColor: !0
    }, "Triggered by:"), p3.createElement(V, null, " ", K, " files")), p3.createElement(I, {
        marginTop: 1
    }, p3.createElement(V, null, "Would you like to install this LSP plugin?")), p3.createElement(I, null, p3.createElement(kA, {
        options: [{
            label: p3.createElement(V, null, "Yes, install ", p3.createElement(V, {
                bold: !0
            }, A)),
            value: "yes"
        }, {
            label: "No, not now",
            value: "no"
        }, {
            label: p3.createElement(V, null, "Never for ", p3.createElement(V, {
                bold: !0
            }, A)),
            value: "never"
        }, {
            label: "Disable all LSP recommendations",
            value: "disable"
        }],
        onChange: w,
        onCancel: () => Y("no")
    }))))
}
// @from(Ln 486295, Col 4)
p3
// @from(Ln 486295, Col 8)
ZWz = 30000
// @from(Ln 486296, Col 4)
LLq = v(() => {
    m1();
    U5();
    Bv();
    p3 = o(X1(), 1)
})
// @from(Ln 486303, Col 0)
function yLq() {
    let A = e(20),
        {
            addNotification: q
        } = iq(),
        K = v6(NWz),
        Y;
    A: {
        if (!K) {
            let P;
            if (A[0] === Symbol.for("react.memo_cache_sentinel")) P = {
                totalFailed: 0,
                failedMarketplacesCount: 0,
                failedPluginsCount: 0
            }, A[0] = P;
            else P = A[0];
            Y = P;
            break A
        }
        let _;
        if (A[1] !== K.marketplaces) _ = K.marketplaces.filter(VWz),
        A[1] = K.marketplaces,
        A[2] = _;
        else _ = A[2];
        let J = _,
            X;
        if (A[3] !== K.plugins) X = K.plugins.filter(fWz),
        A[3] = K.plugins,
        A[4] = X;
        else X = A[4];
        let D = X,
            j = J.length + D.length,
            M;
        if (A[5] !== J.length || A[6] !== D.length || A[7] !== j) M = {
            totalFailed: j,
            failedMarketplacesCount: J.length,
            failedPluginsCount: D.length
        },
        A[5] = J.length,
        A[6] = D.length,
        A[7] = j,
        A[8] = M;
        else M = A[8];Y = M
    }
    let {
        totalFailed: z,
        failedMarketplacesCount: w,
        failedPluginsCount: H
    } = Y, $;
    if (A[9] !== q || A[10] !== w || A[11] !== H || A[12] !== K || A[13] !== z) $ = () => {
        if (Nq()) return;
        if (!K) {
            h("No installation status to monitor");
            return
        }
        if (z === 0) return;
        if (h(`Plugin installation status: ${w} failed marketplaces, ${H} failed plugins`), z === 0) return;
        h(`Adding notification for ${z} failed installations`), q({
            key: "plugin-install-failed",
            jsx: EF.createElement(EF.Fragment, null, EF.createElement(V, {
                color: "error"
            }, z, " plugin", z === 1 ? "" : "s", " failed to install"), EF.createElement(V, {
                dimColor: !0
            }, " · /plugin for details")),
            priority: "medium"
        })
    }, A[9] = q, A[10] = w, A[11] = H, A[12] = K, A[13] = z, A[14] = $;
    else $ = A[14];
    let O;
    if (A[15] !== q || A[16] !== w || A[17] !== H || A[18] !== z) O = [q, z, w, H], A[15] = q, A[16] = w, A[17] = H, A[18] = z, A[19] = O;
    else O = A[19];
    RLq.useEffect($, O)
}
// @from(Ln 486377, Col 0)
function fWz(A) {
    return A.status === "failed"
}
// @from(Ln 486381, Col 0)
function VWz(A) {
    return A.status === "failed"
}
// @from(Ln 486385, Col 0)
function NWz(A) {
    return A.plugins.installationStatus
}
// @from(Ln 486388, Col 4)
EF
// @from(Ln 486388, Col 8)
RLq
// @from(Ln 486389, Col 4)
CLq = v(() => {
    i1();
    m1();
    B6();
    h2();
    d8();
    Z6();
    EF = o(X1(), 1), RLq = o(X1(), 1)
})
// @from(Ln 486399, Col 0)
function SLq() {
    let A = e(7),
        {
            addNotification: q
        } = iq(),
        K;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) K = [], A[0] = K;
    else K = A[0];
    let [Y, z] = ec1.useState(K), w, H;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) w = () => {
        if (Nq()) return;
        return ojq((J) => {
            h(`Plugin autoupdate notification: ${J.length} plugin(s) updated`), z(J)
        })
    }, H = [], A[1] = w, A[2] = H;
    else w = A[1], H = A[2];
    ec1.useEffect(w, H);
    let $, O;
    if (A[3] !== q || A[4] !== Y) $ = () => {
        if (Nq()) return;
        if (Y.length === 0) return;
        let _ = Y.map(TWz),
            J = _.length <= 2 ? _.join(" and ") : `${_.length} plugins`;
        q({
            key: "plugin-autoupdate-restart",
            jsx: kF.createElement(kF.Fragment, null, kF.createElement(V, {
                color: "success"
            }, _.length === 1 ? "Plugin" : "Plugins", " updated:", " ", J), kF.createElement(V, {
                dimColor: !0
            }, " · Restart to apply")),
            priority: "low",
            timeoutMs: 1e4
        }), h(`Showing plugin autoupdate notification for: ${_.join(", ")}`)
    }, O = [Y, q], A[3] = q, A[4] = Y, A[5] = $, A[6] = O;
    else $ = A[5], O = A[6];
    ec1.useEffect($, O)
}
// @from(Ln 486437, Col 0)
function TWz(A) {
    let q = A.indexOf("@");
    return q > 0 ? A.substring(0, q) : A
}
// @from(Ln 486441, Col 4)
kF
// @from(Ln 486441, Col 8)
ec1
// @from(Ln 486442, Col 4)
hLq = v(() => {
    i1();
    m1();
    B6();
    h2();
    CQA();
    Z6();
    kF = o(X1(), 1), ec1 = o(X1(), 1)
})
// @from(Ln 486451, Col 0)
async function ILq(A) {
    if (h("performStartupChecks called"), !$H(!0)) {
        h("Trust not accepted for current directory - skipping plugin installations");
        return
    }
    try {
        h("Starting background plugin installations"), await cV6(A)
    } catch (q) {
        h(`Error initiating background plugin installations: ${q}`)
    }
}
// @from(Ln 486462, Col 4)
xLq = v(() => {
    Z6();
    lV6();
    cA()
})
// @from(Ln 486468, Col 0)
function bLq(A) {
    let q = e(17),
        {
            addNotification: K
        } = iq(),
        Y = Eo(),
        z;
    if (q[0] !== Y || q[1] !== A) z = fHA(Y, A), q[0] = Y, q[1] = A, q[2] = z;
    else z = q[2];
    let w = z,
        H;
    if (q[3] !== Y) H = VHA(Y), q[3] = Y, q[4] = H;
    else H = q[4];
    let $ = H,
        O = RY1.useRef(null),
        _;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) _ = dK(), q[5] = _;
    else _ = q[5];
    let J = _,
        X;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) X = iu(), q[6] = X;
    else X = q[6];
    let D = X,
        j = J === "team" || J === "enterprise",
        [M, P] = RY1.useState(!1),
        W, G;
    if (q[7] !== K || q[8] !== Y.isUsingOverage || q[9] !== M || q[10] !== $) W = () => {
        if (Nq()) return;
        if (Y.isUsingOverage && !M && (!j || D)) K({
            key: "limit-reached",
            text: $,
            priority: "immediate"
        }), P(!0);
        else if (!Y.isUsingOverage && M) P(!1)
    }, G = [Y.isUsingOverage, $, M, K, D, j], q[7] = K, q[8] = Y.isUsingOverage, q[9] = M, q[10] = $, q[11] = W, q[12] = G;
    else W = q[11], G = q[12];
    RY1.useEffect(W, G);
    let f, Z;
    if (q[13] !== K || q[14] !== w) f = () => {
        if (Nq()) return;
        if (w && w !== O.current) O.current = w, K({
            key: "rate-limit-warning",
            jsx: Al1.createElement(V, null, Al1.createElement(V, {
                color: "warning"
            }, w)),
            priority: "high"
        })
    }, Z = [w, K], q[13] = K, q[14] = w, q[15] = f, q[16] = Z;
    else f = q[15], Z = q[16];
    RY1.useEffect(f, Z)
}
// @from(Ln 486519, Col 4)
Al1
// @from(Ln 486519, Col 9)
RY1
// @from(Ln 486520, Col 4)
uLq = v(() => {
    i1();
    B6();
    h2();
    nu();
    m1();
    cA();
    J7();
    Al1 = o(X1(), 1), RY1 = o(X1(), 1)
})
// @from(Ln 486531, Col 0)
function BLq() {}
// @from(Ln 486533, Col 0)
function mLq(A) {
    let q = e(4),
        {
            addNotification: K
        } = iq(),
        Y = CE6.useRef(null),
        z, w;
    if (q[0] !== K || q[1] !== A) z = () => {
        if (Nq()) return;
        let H = tT6(A);
        if (H && H !== Y.current) Y.current = H, K({
            key: "model-deprecation-warning",
            text: H,
            color: "warning",
            priority: "high"
        });
        if (!H) Y.current = null
    }, w = [A, K], q[0] = K, q[1] = A, q[2] = z, q[3] = w;
    else z = q[2], w = q[3];
    CE6.useEffect(z, w)
}
// @from(Ln 486554, Col 4)
CE6
// @from(Ln 486555, Col 4)
FLq = v(() => {
    i1();
    B6();
    h2();
    tFA();
    CE6 = o(X1(), 1)
})
// @from(Ln 486563, Col 0)
function QLq() {
    let A = e(3),
        {
            addNotification: q
        } = iq(),
        K = SE6.useRef(!1),
        Y, z;
    if (A[0] !== q) Y = () => {
        if (Nq()) return;
        if (K.current || D9() || J6(process.env.DISABLE_INSTALLATION_CHECKS)) return;
        om().then((w) => {
            if (K.current || w === "development") return;
            K.current = !0, q({
                timeoutMs: 15000,
                key: "npm-deprecation-warning",
                text: vWz,
                color: "warning",
                priority: "high"
            })
        })
    }, z = [q], A[0] = q, A[1] = Y, A[2] = z;
    else Y = A[1], z = A[2];
    SE6.useEffect(Y, z)
}
// @from(Ln 486587, Col 4)
SE6
// @from(Ln 486587, Col 9)
vWz = "Claude Code has switched from npm to native installer. Run `claude install` or see https://docs.anthropic.com/en/docs/claude-code/getting-started for more options."
// @from(Ln 486588, Col 4)
gLq = v(() => {
    i1();
    B6();
    h2();
    am();
    hA();
    SE6 = o(X1(), 1)
})
// @from(Ln 486597, Col 0)
function ULq() {
    let A = e(3),
        {
            addNotification: q
        } = iq(),
        K = hE6.useRef(!1),
        Y, z;
    if (A[0] !== q) Y = () => {
        if (Nq()) return;
        if (K.current) return;
        if (_i8()) K.current = !0, q({
            timeoutMs: 15000,
            key: "programdata-deprecation-warning",
            text: EWz,
            color: "warning",
            priority: "high"
        })
    }, z = [q], A[0] = q, A[1] = Y, A[2] = z;
    else Y = A[1], z = A[2];
    hE6.useEffect(Y, z)
}
// @from(Ln 486618, Col 4)
hE6
// @from(Ln 486618, Col 9)
EWz = "This device contains a C:\\ProgramData\\ClaudeCode\\managed-settings.json file. In a future version of Claude Code, managed settings at this location will no longer be applied. Contact your administrator to migrate this file to C:\\Program Files\\ClaudeCode\\managed-settings.json"
// @from(Ln 486619, Col 4)
pLq = v(() => {
    i1();
    B6();
    h2();
    p8();
    hE6 = o(X1(), 1)
})
// @from(Ln 486627, Col 0)
function dLq(A) {
    let q = e(21),
        {
            ideSelection: K,
            mcpClients: Y,
            ideInstallationStatus: z
        } = A,
        {
            addNotification: w
        } = iq(),
        H = Rf1(Y),
        $;
    if (q[0] !== z) $ = z ? Oh(z?.ideType) : !1, q[0] = z, q[1] = $;
    else $ = q[1];
    let O = $,
        _ = z?.error || O,
        J = H === "connected" && (K?.filePath || K?.text && K.lineCount > 0),
        X = H === "connected" && !J,
        D = _ && !O && !X && !J,
        j = _ && O && !X && !J,
        M, P;
    if (q[2] !== w || q[3] !== H || q[4] !== j) M = () => {
        if (Nq()) return;
        if (bX() || H !== null || j) return;
        Ub1(!0).then((k) => {
            let y = k[0]?.name;
            if (y) w({
                key: "ide-status-hint",
                text: `${l1.circle} /ide for ${y}`,
                priority: "low"
            })
        })
    }, P = [w, H, j], q[2] = w, q[3] = H, q[4] = j, q[5] = M, q[6] = P;
    else M = q[5], P = q[6];
    ql1.useEffect(M, P);
    let W, G;
    if (q[7] !== w || q[8] !== H || q[9] !== D || q[10] !== j) W = () => {
        if (Nq()) return;
        if (D || j || H !== "disconnected") return;
        w({
            key: "ide-status-disconnected",
            text: `${l1.circle} IDE disconnected`,
            color: "error",
            priority: "medium"
        })
    }, G = [w, H, D, j], q[7] = w, q[8] = H, q[9] = D, q[10] = j, q[11] = W, q[12] = G;
    else W = q[11], G = q[12];
    ql1.useEffect(W, G);
    let f, Z;
    if (q[13] !== w || q[14] !== j) f = () => {
        if (Nq()) return;
        if (!j) return;
        w({
            key: "ide-status-jetbrains-disconnected",
            text: "IDE plugin not connected · /status for info",
            priority: "medium"
        })
    }, Z = [w, j], q[13] = w, q[14] = j, q[15] = f, q[16] = Z;
    else f = q[15], Z = q[16];
    ql1.useEffect(f, Z);
    let N, T;
    if (q[17] !== w || q[18] !== D) N = () => {
        if (Nq()) return;
        if (!D) return;
        w({
            key: "ide-status-install-error",
            text: "IDE extension install failed (see /status for info)",
            color: "error",
            priority: "medium"
        })
    }, T = [w, D], q[17] = w, q[18] = D, q[19] = N, q[20] = T;
    else N = q[19], T = q[20];
    ql1.useEffect(N, T)
}
// @from(Ln 486701, Col 4)
ql1
// @from(Ln 486702, Col 4)
cLq = v(() => {
    i1();
    B6();
    h2();
    q$();
    mv6();
    b7();
    ql1 = o(X1(), 1)
})
// @from(Ln 486712, Col 0)
function iLq() {
    let A = e(3),
        {
            addNotification: q
        } = iq(),
        K, Y;
    if (A[0] !== q) K = () => {
        if (Nq()) return;
        let w = f6().opusProMigrationTimestamp;
        if (w) {
            if (Date.now() - w < 3000) q({
                key: "opus-pro-update",
                text: "Model updated to Opus 4.5",
                color: "suggestion",
                priority: "high",
                timeoutMs: 3000
            })
        }
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    lLq.useEffect(K, Y)
}
// @from(Ln 486734, Col 4)
lLq
// @from(Ln 486735, Col 4)
nLq = v(() => {
    i1();
    B6();
    h2();
    cA();
    lLq = o(X1(), 1)
})
// @from(Ln 486743, Col 0)
function kWz(A) {
    let q = A.toLowerCase();
    if (q.includes("opus-4-6")) return null;
    if (q.includes("opus-4-5")) return "Opus 4.5";
    if (q.includes("opus-4-1")) return "Opus 4.1";
    if (q.includes("opus-4")) return "Opus 4";
    return null
}
// @from(Ln 486752, Col 0)
function oLq() {
    let A = e(3),
        {
            addNotification: q
        } = iq(),
        K, Y;
    if (A[0] !== q) K = () => {
        if (Nq()) return;
        if (E4() !== "firstParty") return;
        let w = l3(),
            H = kWz(w);
        if (!H) return;
        c("tengu_opus46_upgrade_nudge_shown", {
            currentModel: w
        }), q({
            key: "opus-46-upgrade-nudge",
            jsx: Kl1.createElement(V, {
                color: "suggestion"
            }, "Currently using ", H, ". Opus 4.6 is our best model for coding", Kl1.createElement(V, {
                color: "text",
                dimColor: !0
            }, " ", "· /model to upgrade")),
            priority: "medium",
            timeoutMs: 1e4
        })
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    rLq.useEffect(K, Y)
}
// @from(Ln 486781, Col 4)
Kl1
// @from(Ln 486781, Col 9)
rLq
// @from(Ln 486782, Col 4)
aLq = v(() => {
    i1();
    m1();
    B6();
    h2();
    UH();
    e7();
    u6();
    Kl1 = o(X1(), 1), rLq = o(X1(), 1)
})
// @from(Ln 486793, Col 0)
function tLq() {
    let A = e(3),
        {
            addNotification: q
        } = iq(),
        K, Y;
    if (A[0] !== q) K = () => {
        if (Nq()) return;
        if (f6().subscriptionNoticeCount ?? 0 >= LWz) return;
        yWz().then((z) => {
            if (z === null) return;
            jA(RWz), c("tengu_switch_to_subscription_notice_shown", {}), q({
                key: "switch-to-subscription",
                jsx: Yl1.createElement(V, {
                    color: "suggestion"
                }, "Use your existing Claude ", z, " plan with Claude Code", Yl1.createElement(V, {
                    color: "text",
                    dimColor: !0
                }, " ", "· /login to activate")),
                priority: "low"
            })
        })
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    sLq.useEffect(K, Y)
}
// @from(Ln 486820, Col 0)
function RWz(A) {
    return {
        ...A,
        subscriptionNoticeCount: (A.subscriptionNoticeCount ?? 0) + 1
    }
}
// @from(Ln 486826, Col 0)
async function yWz() {
    if (i8()) return null;
    let A = await os1();
    if (!A) return null;
    if (A.account.has_claude_max) return "Max";
    if (A.account.has_claude_pro) return "Pro";
    return null
}
// @from(Ln 486834, Col 4)
Yl1
// @from(Ln 486834, Col 9)
sLq
// @from(Ln 486834, Col 14)
LWz = 3
// @from(Ln 486835, Col 4)
eLq = v(() => {
    i1();
    m1();
    pv1();
    B6();
    cA();
    u6();
    J7();
    h2();
    Yl1 = o(X1(), 1), sLq = o(X1(), 1)
})
// @from(Ln 486847, Col 0)
function ARq(A) {
    if (!("text" in A)) return 1;
    let q = A.text.match(/^(\d+)/);
    return q?.[1] ? parseInt(q[1], 10) : 1
}
// @from(Ln 486853, Col 0)
function CWz(A, q) {
    return qRq(ARq(A) + 1)
}
// @from(Ln 486857, Col 0)
function qRq(A) {
    return {
        key: "teammate-spawn",
        text: A === 1 ? "1 agent spawned" : `${A} agents spawned`,
        priority: "low",
        timeoutMs: 5000,
        fold: CWz
    }
}
// @from(Ln 486867, Col 0)
function SWz(A, q) {
    return KRq(ARq(A) + 1)
}
// @from(Ln 486871, Col 0)
function KRq(A) {
    return {
        key: "teammate-shutdown",
        text: A === 1 ? "1 agent shut down" : `${A} agents shut down`,
        priority: "low",
        timeoutMs: 5000,
        fold: SWz
    }
}
// @from(Ln 486881, Col 0)
function YRq() {
    let A = v6((z) => z.tasks),
        {
            addNotification: q
        } = iq(),
        K = zl1.useRef(new Set),
        Y = zl1.useRef(new Set);
    zl1.useEffect(() => {
        if (Nq()) return;
        for (let [z, w] of Object.entries(A)) {
            if (!pO(w)) continue;
            if (w.status === "running" && !K.current.has(z)) K.current.add(z), q(qRq(1));
            if (w.status === "completed" && !Y.current.has(z)) Y.current.add(z), q(KRq(1))
        }
    }, [A, q])
}
// @from(Ln 486897, Col 4)
zl1
// @from(Ln 486898, Col 4)
zRq = v(() => {
    B6();
    d8();
    h2();
    zl1 = o(X1(), 1)
})
// @from(Ln 486905, Col 0)
function ORq() {
    let A = e(13),
        {
            addNotification: q
        } = iq(),
        K = v6(bWz),
        Y = L7(),
        z, w;
    if (A[0] !== q || A[1] !== K || A[2] !== Y) z = () => {
        if (Nq()) return;
        if (!i4()) return;
        return f17((J) => {
            if (J) q({
                key: $Rq,
                color: "penguin",
                priority: "immediate",
                text: "Fast mode is now available · /fast to turn on"
            });
            else if (K) Y(xWz), q({
                key: $Rq,
                color: "warning",
                priority: "immediate",
                text: "Fast mode has been disabled by your organization"
            })
        })
    }, w = [q, K, Y], A[0] = q, A[1] = K, A[2] = Y, A[3] = z, A[4] = w;
    else z = A[3], w = A[4];
    IE6.useEffect(z, w);
    let H, $;
    if (A[5] !== q || A[6] !== Y) H = () => {
        if (Nq()) return;
        if (!i4()) return;
        return G17((J) => {
            Y(IWz), q({
                key: hWz,
                color: "warning",
                priority: "immediate",
                text: J
            })
        })
    }, $ = [q, Y], A[5] = q, A[6] = Y, A[7] = H, A[8] = $;
    else H = A[7], $ = A[8];
    IE6.useEffect(H, $);
    let O, _;
    if (A[9] !== q || A[10] !== K) O = () => {
        if (Nq()) return;
        if (!K) return;
        return M17({
            onCooldownTriggered(J) {
                let X = Xz(J - Date.now(), {
                    hideTrailingZeros: !0
                });
                q({
                    key: wRq,
                    invalidates: [HRq],
                    text: `Fast limit reached and temporarily disabled · resets in ${X}`,
                    color: "warning",
                    priority: "immediate"
                })
            },
            onCooldownExpired() {
                q({
                    key: HRq,
                    invalidates: [wRq],
                    color: "penguin",
                    text: "Fast limit reset · now using fast mode",
                    priority: "immediate"
                })
            }
        })
    }, _ = [q, K], A[9] = q, A[10] = K, A[11] = O, A[12] = _;
    else O = A[11], _ = A[12];
    IE6.useEffect(O, _)
}
// @from(Ln 486980, Col 0)
function IWz(A) {
    return {
        ...A,
        fastMode: !1
    }
}
// @from(Ln 486987, Col 0)
function xWz(A) {
    return {
        ...A,
        fastMode: !1
    }
}
// @from(Ln 486994, Col 0)
function bWz(A) {
    return A.fastMode
}
// @from(Ln 486997, Col 4)
IE6
// @from(Ln 486997, Col 9)
wRq = "fast-mode-cooldown-started"
// @from(Ln 486998, Col 4)
HRq = "fast-mode-cooldown-expired"
// @from(Ln 486999, Col 4)
$Rq = "fast-mode-org-changed"
// @from(Ln 487000, Col 4)
hWz = "fast-mode-overage-rejected"
// @from(Ln 487001, Col 4)
_Rq = v(() => {
    i1();
    B6();
    h2();
    OJ();
    d8();
    vq();
    IE6 = o(X1(), 1)
})
// @from(Ln 487011, Col 0)
function JRq(A) {
    let q = e(8),
        {
            onRun: K,
            onCancel: Y,
            reason: z
        } = A,
        w = xE6.useRef(!1),
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = {
        context: "Confirmation"
    }, q[0] = H;
    else H = q[0];
    DA("confirm:no", Y, H);
    let $, O;
    if (q[1] !== K) $ = () => {
        if (!w.current) w.current = !0, K()
    }, O = [K], q[1] = K, q[2] = $, q[3] = O;
    else $ = q[2], O = q[3];
    xE6.useEffect($, O);
    let _;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) _ = EP.createElement(I, null, EP.createElement(V, {
        bold: !0
    }, "Running feedback capture...")), q[4] = _;
    else _ = q[4];
    let J;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) J = EP.createElement(I, null, EP.createElement(V, {
        dimColor: !0
    }, "Press ", EP.createElement(YA, {
        shortcut: "Esc",
        action: "cancel"
    }), " anytime")), q[5] = J;
    else J = q[5];
    let X;
    if (q[6] !== z) X = EP.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, _, J, EP.createElement(I, null, EP.createElement(V, {
        dimColor: !0
    }, "Reason: ", z))), q[6] = z, q[7] = X;
    else X = q[7];
    return X
}
// @from(Ln 487055, Col 0)
function NUA(A) {
    return !1;
    switch (A) {
        case "feedback_survey_bad":
            return !0;
        case "feedback_survey_good":
            return !1;
        default:
            return !1
    }
}
// @from(Ln 487067, Col 0)
function XRq(A) {
    return "/issue"
}
// @from(Ln 487071, Col 0)
function DRq(A) {
    switch (A) {
        case "feedback_survey_bad":
            return 'You responded "Bad" to the feedback survey';
        case "feedback_survey_good":
            return 'You responded "Good" to the feedback survey';
        default:
            return "Unknown reason"
    }
}
// @from(Ln 487081, Col 4)
EP
// @from(Ln 487081, Col 8)
xE6
// @from(Ln 487082, Col 4)
jRq = v(() => {
    i1();
    m1();
    K7();
    wK();
    EP = o(X1(), 1), xE6 = o(X1(), 1)
})
// @from(Ln 487089, Col 4)
MRq
// @from(Ln 487089, Col 9)
uWz
// @from(Ln 487090, Col 4)
PRq = v(() => {
    i1();
    m1();
    B6();
    MRq = o(X1(), 1), uWz = o(X1(), 1)
})
// @from(Ln 487096, Col 4)
WRq = {}
// @from(Ln 487104, Col 0)
function QWz(A) {
    let q = e(4),
        {
            showAllInTranscript: K
        } = A,
        Y = RK("app:toggleTranscript", "Global", "ctrl+o"),
        z = RK("transcript:toggleShowAll", "Transcript", "ctrl+e"),
        w = K ? "collapse" : "show all",
        H;
    if (q[0] !== z || q[1] !== w || q[2] !== Y) H = V7.createElement(I, {
        alignItems: "center",
        alignSelf: "center",
        borderTopDimColor: !0,
        borderBottom: !1,
        borderLeft: !1,
        borderRight: !1,
        borderStyle: "single",
        marginTop: 1,
        paddingLeft: 2,
        width: "100%"
    }, V7.createElement(V, {
        dimColor: !0
    }, "Showing detailed transcript · ", Y, " to toggle ·", " ", z, " to ", w)), q[0] = z, q[1] = w, q[2] = Y, q[3] = H;
    else H = q[3];
    return H
}