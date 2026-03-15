
// @from(Ln 225082, Col 4)
f44 = x((fg2, G44) => {
    var {
        defineProperty: Dv8,
        getOwnPropertyDescriptor: Dy9,
        getOwnPropertyNames: Xy9
    } = Object, Py9 = Object.prototype.hasOwnProperty, Wy9 = (A, q) => {
        for (var K in q) Dv8(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Zy9 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Xy9(q))
                if (!Py9.call(A, z) && z !== K) Dv8(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Dy9(q, z)) || Y.enumerable
                })
        }
        return A
    }, Gy9 = (A) => Zy9(Dv8({}, "__esModule", {
        value: !0
    }), A), X44 = {};
    Wy9(X44, {
        default: () => Iy9
    });
    G44.exports = Gy9(X44);
    var VB = {
            aliceblue: [240, 248, 255],
            antiquewhite: [250, 235, 215],
            aqua: [0, 255, 255],
            aquamarine: [127, 255, 212],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            bisque: [255, 228, 196],
            black: [0, 0, 0],
            blanchedalmond: [255, 235, 205],
            blue: [0, 0, 255],
            blueviolet: [138, 43, 226],
            brown: [165, 42, 42],
            burlywood: [222, 184, 135],
            cadetblue: [95, 158, 160],
            chartreuse: [127, 255, 0],
            chocolate: [210, 105, 30],
            coral: [255, 127, 80],
            cornflowerblue: [100, 149, 237],
            cornsilk: [255, 248, 220],
            crimson: [220, 20, 60],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgoldenrod: [184, 134, 11],
            darkgray: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkgrey: [169, 169, 169],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkseagreen: [143, 188, 143],
            darkslateblue: [72, 61, 139],
            darkslategray: [47, 79, 79],
            darkslategrey: [47, 79, 79],
            darkturquoise: [0, 206, 209],
            darkviolet: [148, 0, 211],
            deeppink: [255, 20, 147],
            deepskyblue: [0, 191, 255],
            dimgray: [105, 105, 105],
            dimgrey: [105, 105, 105],
            dodgerblue: [30, 144, 255],
            firebrick: [178, 34, 34],
            floralwhite: [255, 250, 240],
            forestgreen: [34, 139, 34],
            fuchsia: [255, 0, 255],
            gainsboro: [220, 220, 220],
            ghostwhite: [248, 248, 255],
            gold: [255, 215, 0],
            goldenrod: [218, 165, 32],
            gray: [128, 128, 128],
            green: [0, 128, 0],
            greenyellow: [173, 255, 47],
            grey: [128, 128, 128],
            honeydew: [240, 255, 240],
            hotpink: [255, 105, 180],
            indianred: [205, 92, 92],
            indigo: [75, 0, 130],
            ivory: [255, 255, 240],
            khaki: [240, 230, 140],
            lavender: [230, 230, 250],
            lavenderblush: [255, 240, 245],
            lawngreen: [124, 252, 0],
            lemonchiffon: [255, 250, 205],
            lightblue: [173, 216, 230],
            lightcoral: [240, 128, 128],
            lightcyan: [224, 255, 255],
            lightgoldenrodyellow: [250, 250, 210],
            lightgray: [211, 211, 211],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightsalmon: [255, 160, 122],
            lightseagreen: [32, 178, 170],
            lightskyblue: [135, 206, 250],
            lightslategray: [119, 136, 153],
            lightslategrey: [119, 136, 153],
            lightsteelblue: [176, 196, 222],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            limegreen: [50, 205, 50],
            linen: [250, 240, 230],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            mediumaquamarine: [102, 205, 170],
            mediumblue: [0, 0, 205],
            mediumorchid: [186, 85, 211],
            mediumpurple: [147, 112, 219],
            mediumseagreen: [60, 179, 113],
            mediumslateblue: [123, 104, 238],
            mediumspringgreen: [0, 250, 154],
            mediumturquoise: [72, 209, 204],
            mediumvioletred: [199, 21, 133],
            midnightblue: [25, 25, 112],
            mintcream: [245, 255, 250],
            mistyrose: [255, 228, 225],
            moccasin: [255, 228, 181],
            navajowhite: [255, 222, 173],
            navy: [0, 0, 128],
            oldlace: [253, 245, 230],
            olive: [128, 128, 0],
            olivedrab: [107, 142, 35],
            orange: [255, 165, 0],
            orangered: [255, 69, 0],
            orchid: [218, 112, 214],
            palegoldenrod: [238, 232, 170],
            palegreen: [152, 251, 152],
            paleturquoise: [175, 238, 238],
            palevioletred: [219, 112, 147],
            papayawhip: [255, 239, 213],
            peachpuff: [255, 218, 185],
            peru: [205, 133, 63],
            pink: [255, 192, 203],
            plum: [221, 160, 221],
            powderblue: [176, 224, 230],
            purple: [128, 0, 128],
            rebeccapurple: [102, 51, 153],
            red: [255, 0, 0],
            rosybrown: [188, 143, 143],
            royalblue: [65, 105, 225],
            saddlebrown: [139, 69, 19],
            salmon: [250, 128, 114],
            sandybrown: [244, 164, 96],
            seagreen: [46, 139, 87],
            seashell: [255, 245, 238],
            sienna: [160, 82, 45],
            silver: [192, 192, 192],
            skyblue: [135, 206, 235],
            slateblue: [106, 90, 205],
            slategray: [112, 128, 144],
            slategrey: [112, 128, 144],
            snow: [255, 250, 250],
            springgreen: [0, 255, 127],
            steelblue: [70, 130, 180],
            tan: [210, 180, 140],
            teal: [0, 128, 128],
            thistle: [216, 191, 216],
            tomato: [255, 99, 71],
            turquoise: [64, 224, 208],
            violet: [238, 130, 238],
            wheat: [245, 222, 179],
            white: [255, 255, 255],
            whitesmoke: [245, 245, 245],
            yellow: [255, 255, 0],
            yellowgreen: [154, 205, 50]
        },
        P44 = Object.create(null);
    for (let A in VB)
        if (Object.hasOwn(VB, A)) P44[VB[A]] = A;
    var mv = {
        to: {},
        get: {}
    };
    mv.get = function(A) {
        let q = A.slice(0, 3).toLowerCase(),
            K, Y;
        switch (q) {
            case "hsl": {
                K = mv.get.hsl(A), Y = "hsl";
                break
            }
            case "hwb": {
                K = mv.get.hwb(A), Y = "hwb";
                break
            }
            default: {
                K = mv.get.rgb(A), Y = "rgb";
                break
            }
        }
        if (!K) return null;
        return {
            model: Y,
            value: K
        }
    };
    mv.get.rgb = function(A) {
        if (!A) return null;
        let q = /^#([a-f\d]{3,4})$/i,
            K = /^#([a-f\d]{6})([a-f\d]{2})?$/i,
            Y = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/,
            z = /^rgba?\(\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/,
            _ = /^(\w+)$/,
            w = [0, 0, 0, 1],
            O, $, H;
        if (O = A.match(K)) {
            H = O[2], O = O[1];
            for ($ = 0; $ < 3; $++) {
                let j = $ * 2;
                w[$] = Number.parseInt(O.slice(j, j + 2), 16)
            }
            if (H) w[3] = Number.parseInt(H, 16) / 255
        } else if (O = A.match(q)) {
            O = O[1], H = O[3];
            for ($ = 0; $ < 3; $++) w[$] = Number.parseInt(O[$] + O[$], 16);
            if (H) w[3] = Number.parseInt(H + H, 16) / 255
        } else if (O = A.match(Y)) {
            for ($ = 0; $ < 3; $++) w[$] = Number.parseInt(O[$ + 1], 10);
            if (O[4]) w[3] = O[5] ? Number.parseFloat(O[4]) * 0.01 : Number.parseFloat(O[4])
        } else if (O = A.match(z)) {
            for ($ = 0; $ < 3; $++) w[$] = Math.round(Number.parseFloat(O[$ + 1]) * 2.55);
            if (O[4]) w[3] = O[5] ? Number.parseFloat(O[4]) * 0.01 : Number.parseFloat(O[4])
        } else if (O = A.match(_)) {
            if (O[1] === "transparent") return [0, 0, 0, 0];
            if (!Object.hasOwn(VB, O[1])) return null;
            return w = VB[O[1]], w[3] = 1, w
        } else return null;
        for ($ = 0; $ < 3; $++) w[$] = Lt(w[$], 0, 255);
        return w[3] = Lt(w[3], 0, 1), w
    };
    mv.get.hsl = function(A) {
        if (!A) return null;
        let q = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[,|/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
            K = A.match(q);
        if (K) {
            let Y = Number.parseFloat(K[4]),
                z = (Number.parseFloat(K[1]) % 360 + 360) % 360,
                _ = Lt(Number.parseFloat(K[2]), 0, 100),
                w = Lt(Number.parseFloat(K[3]), 0, 100),
                O = Lt(Number.isNaN(Y) ? 1 : Y, 0, 1);
            return [z, _, w, O]
        }
        return null
    };
    mv.get.hwb = function(A) {
        if (!A) return null;
        let q = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*[\s,]\s*([+-]?[\d.]+)%\s*[\s,]\s*([+-]?[\d.]+)%\s*(?:[\s,]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
            K = A.match(q);
        if (K) {
            let Y = Number.parseFloat(K[4]),
                z = (Number.parseFloat(K[1]) % 360 + 360) % 360,
                _ = Lt(Number.parseFloat(K[2]), 0, 100),
                w = Lt(Number.parseFloat(K[3]), 0, 100),
                O = Lt(Number.isNaN(Y) ? 1 : Y, 0, 1);
            return [z, _, w, O]
        }
        return null
    };
    mv.to.hex = function(...A) {
        return "#" + pX1(A[0]) + pX1(A[1]) + pX1(A[2]) + (A[3] < 1 ? pX1(Math.round(A[3] * 255)) : "")
    };
    mv.to.rgb = function(...A) {
        return A.length < 4 || A[3] === 1 ? "rgb(" + Math.round(A[0]) + ", " + Math.round(A[1]) + ", " + Math.round(A[2]) + ")" : "rgba(" + Math.round(A[0]) + ", " + Math.round(A[1]) + ", " + Math.round(A[2]) + ", " + A[3] + ")"
    };
    mv.to.rgb.percent = function(...A) {
        let q = Math.round(A[0] / 255 * 100),
            K = Math.round(A[1] / 255 * 100),
            Y = Math.round(A[2] / 255 * 100);
        return A.length < 4 || A[3] === 1 ? "rgb(" + q + "%, " + K + "%, " + Y + "%)" : "rgba(" + q + "%, " + K + "%, " + Y + "%, " + A[3] + ")"
    };
    mv.to.hsl = function(...A) {
        return A.length < 4 || A[3] === 1 ? "hsl(" + A[0] + ", " + A[1] + "%, " + A[2] + "%)" : "hsla(" + A[0] + ", " + A[1] + "%, " + A[2] + "%, " + A[3] + ")"
    };
    mv.to.hwb = function(...A) {
        let q = "";
        if (A.length >= 4 && A[3] !== 1) q = ", " + A[3];
        return "hwb(" + A[0] + ", " + A[1] + "%, " + A[2] + "%" + q + ")"
    };
    mv.to.keyword = function(...A) {
        return P44[A.slice(0, 3)]
    };

    function Lt(A, q, K) {
        return Math.min(Math.max(q, A), K)
    }

    function pX1(A) {
        let q = Math.round(A).toString(16).toUpperCase();
        return q.length < 2 ? "0" + q : q
    }
    var e06 = mv,
        W44 = {};
    for (let A of Object.keys(VB)) W44[VB[A]] = A;
    var N4 = {
            rgb: {
                channels: 3,
                labels: "rgb"
            },
            hsl: {
                channels: 3,
                labels: "hsl"
            },
            hsv: {
                channels: 3,
                labels: "hsv"
            },
            hwb: {
                channels: 3,
                labels: "hwb"
            },
            cmyk: {
                channels: 4,
                labels: "cmyk"
            },
            xyz: {
                channels: 3,
                labels: "xyz"
            },
            lab: {
                channels: 3,
                labels: "lab"
            },
            oklab: {
                channels: 3,
                labels: ["okl", "oka", "okb"]
            },
            lch: {
                channels: 3,
                labels: "lch"
            },
            oklch: {
                channels: 3,
                labels: ["okl", "okc", "okh"]
            },
            hex: {
                channels: 1,
                labels: ["hex"]
            },
            keyword: {
                channels: 1,
                labels: ["keyword"]
            },
            ansi16: {
                channels: 1,
                labels: ["ansi16"]
            },
            ansi256: {
                channels: 1,
                labels: ["ansi256"]
            },
            hcg: {
                channels: 3,
                labels: ["h", "c", "g"]
            },
            apple: {
                channels: 3,
                labels: ["r16", "g16", "b16"]
            },
            gray: {
                channels: 1,
                labels: ["gray"]
            }
        },
        T36 = N4,
        Bd = 0.008856451679035631;

    function qW6(A) {
        let q = A > 0.0031308 ? 1.055 * A ** 0.4166666666666667 - 0.055 : A * 12.92;
        return Math.min(Math.max(0, q), 1)
    }

    function KW6(A) {
        return A > 0.04045 ? ((A + 0.055) / 1.055) ** 2.4 : A / 12.92
    }
    for (let A of Object.keys(N4)) {
        if (!("channels" in N4[A])) throw Error("missing channels property: " + A);
        if (!("labels" in N4[A])) throw Error("missing channel labels property: " + A);
        if (N4[A].labels.length !== N4[A].channels) throw Error("channel and label counts mismatch: " + A);
        let {
            channels: q,
            labels: K
        } = N4[A];
        delete N4[A].channels, delete N4[A].labels, Object.defineProperty(N4[A], "channels", {
            value: q
        }), Object.defineProperty(N4[A], "labels", {
            value: K
        })
    }
    N4.rgb.hsl = function(A) {
        let q = A[0] / 255,
            K = A[1] / 255,
            Y = A[2] / 255,
            z = Math.min(q, K, Y),
            _ = Math.max(q, K, Y),
            w = _ - z,
            O, $;
        switch (_) {
            case z: {
                O = 0;
                break
            }
            case q: {
                O = (K - Y) / w;
                break
            }
            case K: {
                O = 2 + (Y - q) / w;
                break
            }
            case Y: {
                O = 4 + (q - K) / w;
                break
            }
        }
        if (O = Math.min(O * 60, 360), O < 0) O += 360;
        let H = (z + _) / 2;
        if (_ === z) $ = 0;
        else if (H <= 0.5) $ = w / (_ + z);
        else $ = w / (2 - _ - z);
        return [O, $ * 100, H * 100]
    };
    N4.rgb.hsv = function(A) {
        let q, K, Y, z, _, w = A[0] / 255,
            O = A[1] / 255,
            $ = A[2] / 255,
            H = Math.max(w, O, $),
            j = H - Math.min(w, O, $),
            J = function(M) {
                return (H - M) / 6 / j + 0.5
            };
        if (j === 0) z = 0, _ = 0;
        else {
            switch (_ = j / H, q = J(w), K = J(O), Y = J($), H) {
                case w: {
                    z = Y - K;
                    break
                }
                case O: {
                    z = 0.3333333333333333 + q - Y;
                    break
                }
                case $: {
                    z = 0.6666666666666666 + K - q;
                    break
                }
            }
            if (z < 0) z += 1;
            else if (z > 1) z -= 1
        }
        return [z * 360, _ * 100, H * 100]
    };
    N4.rgb.hwb = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2],
            z = N4.rgb.hsl(A)[0],
            _ = 0.00392156862745098 * Math.min(q, Math.min(K, Y));
        return Y = 1 - 0.00392156862745098 * Math.max(q, Math.max(K, Y)), [z, _ * 100, Y * 100]
    };
    N4.rgb.oklab = function(A) {
        let q = KW6(A[0] / 255),
            K = KW6(A[1] / 255),
            Y = KW6(A[2] / 255),
            z = Math.cbrt(0.4122214708 * q + 0.5363325363 * K + 0.0514459929 * Y),
            _ = Math.cbrt(0.2119034982 * q + 0.6806995451 * K + 0.1073969566 * Y),
            w = Math.cbrt(0.0883024619 * q + 0.2817188376 * K + 0.6299787005 * Y),
            O = 0.2104542553 * z + 0.793617785 * _ - 0.0040720468 * w,
            $ = 1.9779984951 * z - 2.428592205 * _ + 0.4505937099 * w,
            H = 0.0259040371 * z + 0.7827717662 * _ - 0.808675766 * w;
        return [O * 100, $ * 100, H * 100]
    };
    N4.rgb.cmyk = function(A) {
        let q = A[0] / 255,
            K = A[1] / 255,
            Y = A[2] / 255,
            z = Math.min(1 - q, 1 - K, 1 - Y),
            _ = (1 - q - z) / (1 - z) || 0,
            w = (1 - K - z) / (1 - z) || 0,
            O = (1 - Y - z) / (1 - z) || 0;
        return [_ * 100, w * 100, O * 100, z * 100]
    };

    function fy9(A, q) {
        return (A[0] - q[0]) ** 2 + (A[1] - q[1]) ** 2 + (A[2] - q[2]) ** 2
    }
    N4.rgb.keyword = function(A) {
        let q = W44[A];
        if (q) return q;
        let K = Number.POSITIVE_INFINITY,
            Y;
        for (let z of Object.keys(VB)) {
            let _ = VB[z],
                w = fy9(A, _);
            if (w < K) K = w, Y = z
        }
        return Y
    };
    N4.keyword.rgb = function(A) {
        return VB[A]
    };
    N4.rgb.xyz = function(A) {
        let q = KW6(A[0] / 255),
            K = KW6(A[1] / 255),
            Y = KW6(A[2] / 255),
            z = q * 0.4124564 + K * 0.3575761 + Y * 0.1804375,
            _ = q * 0.2126729 + K * 0.7151522 + Y * 0.072175,
            w = q * 0.0193339 + K * 0.119192 + Y * 0.9503041;
        return [z * 100, _ * 100, w * 100]
    };
    N4.rgb.lab = function(A) {
        let q = N4.rgb.xyz(A),
            K = q[0],
            Y = q[1],
            z = q[2];
        K /= 95.047, Y /= 100, z /= 108.883, K = K > Bd ? K ** 0.3333333333333333 : 7.787 * K + 0.13793103448275862, Y = Y > Bd ? Y ** 0.3333333333333333 : 7.787 * Y + 0.13793103448275862, z = z > Bd ? z ** 0.3333333333333333 : 7.787 * z + 0.13793103448275862;
        let _ = 116 * Y - 16,
            w = 500 * (K - Y),
            O = 200 * (Y - z);
        return [_, w, O]
    };
    N4.hsl.rgb = function(A) {
        let q = A[0] / 360,
            K = A[1] / 100,
            Y = A[2] / 100,
            z, _;
        if (K === 0) return _ = Y * 255, [_, _, _];
        let w = Y < 0.5 ? Y * (1 + K) : Y + K - Y * K,
            O = 2 * Y - w,
            $ = [0, 0, 0];
        for (let H = 0; H < 3; H++) {
            if (z = q + 0.3333333333333333 * -(H - 1), z < 0) z++;
            if (z > 1) z--;
            if (6 * z < 1) _ = O + (w - O) * 6 * z;
            else if (2 * z < 1) _ = w;
            else if (3 * z < 2) _ = O + (w - O) * (0.6666666666666666 - z) * 6;
            else _ = O;
            $[H] = _ * 255
        }
        return $
    };
    N4.hsl.hsv = function(A) {
        let q = A[0],
            K = A[1] / 100,
            Y = A[2] / 100,
            z = K,
            _ = Math.max(Y, 0.01);
        Y *= 2, K *= Y <= 1 ? Y : 2 - Y, z *= _ <= 1 ? _ : 2 - _;
        let w = (Y + K) / 2,
            O = Y === 0 ? 2 * z / (_ + z) : 2 * K / (Y + K);
        return [q, O * 100, w * 100]
    };
    N4.hsv.rgb = function(A) {
        let q = A[0] / 60,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = Math.floor(q) % 6,
            _ = q - Math.floor(q),
            w = 255 * Y * (1 - K),
            O = 255 * Y * (1 - K * _),
            $ = 255 * Y * (1 - K * (1 - _));
        switch (Y *= 255, z) {
            case 0:
                return [Y, $, w];
            case 1:
                return [O, Y, w];
            case 2:
                return [w, Y, $];
            case 3:
                return [w, O, Y];
            case 4:
                return [$, w, Y];
            case 5:
                return [Y, w, O]
        }
    };
    N4.hsv.hsl = function(A) {
        let q = A[0],
            K = A[1] / 100,
            Y = A[2] / 100,
            z = Math.max(Y, 0.01),
            _, w;
        w = (2 - K) * Y;
        let O = (2 - K) * z;
        return _ = K * z, _ /= O <= 1 ? O : 2 - O, _ = _ || 0, w /= 2, [q, _ * 100, w * 100]
    };
    N4.hwb.rgb = function(A) {
        let q = A[0] / 360,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = K + Y,
            _;
        if (z > 1) K /= z, Y /= z;
        let w = Math.floor(6 * q),
            O = 1 - Y;
        if (_ = 6 * q - w, (w & 1) !== 0) _ = 1 - _;
        let $ = K + _ * (O - K),
            H, j, J;
        switch (w) {
            default:
            case 6:
            case 0: {
                H = O, j = $, J = K;
                break
            }
            case 1: {
                H = $, j = O, J = K;
                break
            }
            case 2: {
                H = K, j = O, J = $;
                break
            }
            case 3: {
                H = K, j = $, J = O;
                break
            }
            case 4: {
                H = $, j = K, J = O;
                break
            }
            case 5: {
                H = O, j = K, J = $;
                break
            }
        }
        return [H * 255, j * 255, J * 255]
    };
    N4.cmyk.rgb = function(A) {
        let q = A[0] / 100,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = A[3] / 100,
            _ = 1 - Math.min(1, q * (1 - z) + z),
            w = 1 - Math.min(1, K * (1 - z) + z),
            O = 1 - Math.min(1, Y * (1 - z) + z);
        return [_ * 255, w * 255, O * 255]
    };
    N4.xyz.rgb = function(A) {
        let q = A[0] / 100,
            K = A[1] / 100,
            Y = A[2] / 100,
            z, _, w;
        return z = q * 3.2404542 + K * -1.5371385 + Y * -0.4985314, _ = q * -0.969266 + K * 1.8760108 + Y * 0.041556, w = q * 0.0556434 + K * -0.2040259 + Y * 1.0572252, z = qW6(z), _ = qW6(_), w = qW6(w), [z * 255, _ * 255, w * 255]
    };
    N4.xyz.lab = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2];
        q /= 95.047, K /= 100, Y /= 108.883, q = q > Bd ? q ** 0.3333333333333333 : 7.787 * q + 0.13793103448275862, K = K > Bd ? K ** 0.3333333333333333 : 7.787 * K + 0.13793103448275862, Y = Y > Bd ? Y ** 0.3333333333333333 : 7.787 * Y + 0.13793103448275862;
        let z = 116 * K - 16,
            _ = 500 * (q - K),
            w = 200 * (K - Y);
        return [z, _, w]
    };
    N4.xyz.oklab = function(A) {
        let q = A[0] / 100,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = Math.cbrt(0.8189330101 * q + 0.3618667424 * K - 0.1288597137 * Y),
            _ = Math.cbrt(0.0329845436 * q + 0.9293118715 * K + 0.0361456387 * Y),
            w = Math.cbrt(0.0482003018 * q + 0.2643662691 * K + 0.633851707 * Y),
            O = 0.2104542553 * z + 0.793617785 * _ - 0.0040720468 * w,
            $ = 1.9779984951 * z - 2.428592205 * _ + 0.4505937099 * w,
            H = 0.0259040371 * z + 0.7827717662 * _ - 0.808675766 * w;
        return [O * 100, $ * 100, H * 100]
    };
    N4.oklab.oklch = function(A) {
        return N4.lab.lch(A)
    };
    N4.oklab.xyz = function(A) {
        let q = A[0] / 100,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = (0.999999998 * q + 0.396337792 * K + 0.215803758 * Y) ** 3,
            _ = (1.000000008 * q - 0.105561342 * K - 0.063854175 * Y) ** 3,
            w = (1.000000055 * q - 0.089484182 * K - 1.291485538 * Y) ** 3,
            O = 1.227013851 * z - 0.55779998 * _ + 0.281256149 * w,
            $ = -0.040580178 * z + 1.11225687 * _ - 0.071676679 * w,
            H = -0.076381285 * z - 0.421481978 * _ + 1.58616322 * w;
        return [O * 100, $ * 100, H * 100]
    };
    N4.oklab.rgb = function(A) {
        let q = A[0] / 100,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = (q + 0.3963377774 * K + 0.2158037573 * Y) ** 3,
            _ = (q - 0.1055613458 * K - 0.0638541728 * Y) ** 3,
            w = (q - 0.0894841775 * K - 1.291485548 * Y) ** 3,
            O = qW6(4.0767416621 * z - 3.3077115913 * _ + 0.2309699292 * w),
            $ = qW6(-1.2684380046 * z + 2.6097574011 * _ - 0.3413193965 * w),
            H = qW6(-0.0041960863 * z - 0.7034186147 * _ + 1.707614701 * w);
        return [O * 255, $ * 255, H * 255]
    };
    N4.oklch.oklab = function(A) {
        return N4.lch.lab(A)
    };
    N4.lab.xyz = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2],
            z, _, w;
        _ = (q + 16) / 116, z = K / 500 + _, w = _ - Y / 200;
        let O = _ ** 3,
            $ = z ** 3,
            H = w ** 3;
        return _ = O > Bd ? O : (_ - 0.13793103448275862) / 7.787, z = $ > Bd ? $ : (z - 0.13793103448275862) / 7.787, w = H > Bd ? H : (w - 0.13793103448275862) / 7.787, z *= 95.047, _ *= 100, w *= 108.883, [z, _, w]
    };
    N4.lab.lch = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2],
            z;
        if (z = Math.atan2(Y, K) * 360 / 2 / Math.PI, z < 0) z += 360;
        let w = Math.sqrt(K * K + Y * Y);
        return [q, w, z]
    };
    N4.lch.lab = function(A) {
        let q = A[0],
            K = A[1],
            z = A[2] / 360 * 2 * Math.PI,
            _ = K * Math.cos(z),
            w = K * Math.sin(z);
        return [q, _, w]
    };
    N4.rgb.ansi16 = function(A, q = null) {
        let [K, Y, z] = A, _ = q === null ? N4.rgb.hsv(A)[2] : q;
        if (_ = Math.round(_ / 50), _ === 0) return 30;
        let w = 30 + (Math.round(z / 255) << 2 | Math.round(Y / 255) << 1 | Math.round(K / 255));
        if (_ === 2) w += 60;
        return w
    };
    N4.hsv.ansi16 = function(A) {
        return N4.rgb.ansi16(N4.hsv.rgb(A), A[2])
    };
    N4.rgb.ansi256 = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2];
        if (q >> 4 === K >> 4 && K >> 4 === Y >> 4) {
            if (q < 8) return 16;
            if (q > 248) return 231;
            return Math.round((q - 8) / 247 * 24) + 232
        }
        return 16 + 36 * Math.round(q / 255 * 5) + 6 * Math.round(K / 255 * 5) + Math.round(Y / 255 * 5)
    };
    N4.ansi16.rgb = function(A) {
        A = A[0];
        let q = A % 10;
        if (q === 0 || q === 7) {
            if (A > 50) q += 3.5;
            return q = q / 10.5 * 255, [q, q, q]
        }
        let K = (Math.trunc(A > 50) + 1) * 0.5,
            Y = (q & 1) * K * 255,
            z = (q >> 1 & 1) * K * 255,
            _ = (q >> 2 & 1) * K * 255;
        return [Y, z, _]
    };
    N4.ansi256.rgb = function(A) {
        if (A = A[0], A >= 232) {
            let _ = (A - 232) * 10 + 8;
            return [_, _, _]
        }
        A -= 16;
        let q, K = Math.floor(A / 36) / 5 * 255,
            Y = Math.floor((q = A % 36) / 6) / 5 * 255,
            z = q % 6 / 5 * 255;
        return [K, Y, z]
    };
    N4.rgb.hex = function(A) {
        let K = (((Math.round(A[0]) & 255) << 16) + ((Math.round(A[1]) & 255) << 8) + (Math.round(A[2]) & 255)).toString(16).toUpperCase();
        return "000000".slice(K.length) + K
    };
    N4.hex.rgb = function(A) {
        let q = A.toString(16).match(/[a-f\d]{6}|[a-f\d]{3}/i);
        if (!q) return [0, 0, 0];
        let K = q[0];
        if (q[0].length === 3) K = [...K].map((O) => O + O).join("");
        let Y = Number.parseInt(K, 16),
            z = Y >> 16 & 255,
            _ = Y >> 8 & 255,
            w = Y & 255;
        return [z, _, w]
    };
    N4.rgb.hcg = function(A) {
        let q = A[0] / 255,
            K = A[1] / 255,
            Y = A[2] / 255,
            z = Math.max(Math.max(q, K), Y),
            _ = Math.min(Math.min(q, K), Y),
            w = z - _,
            O, $ = w < 1 ? _ / (1 - w) : 0;
        if (w <= 0) O = 0;
        else if (z === q) O = (K - Y) / w % 6;
        else if (z === K) O = 2 + (Y - q) / w;
        else O = 4 + (q - K) / w;
        return O /= 6, O %= 1, [O * 360, w * 100, $ * 100]
    };
    N4.hsl.hcg = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = K < 0.5 ? 2 * q * K : 2 * q * (1 - K),
            z = 0;
        if (Y < 1) z = (K - 0.5 * Y) / (1 - Y);
        return [A[0], Y * 100, z * 100]
    };
    N4.hsv.hcg = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = q * K,
            z = 0;
        if (Y < 1) z = (K - Y) / (1 - Y);
        return [A[0], Y * 100, z * 100]
    };
    N4.hcg.rgb = function(A) {
        let q = A[0] / 360,
            K = A[1] / 100,
            Y = A[2] / 100;
        if (K === 0) return [Y * 255, Y * 255, Y * 255];
        let z = [0, 0, 0],
            _ = q % 1 * 6,
            w = _ % 1,
            O = 1 - w,
            $ = 0;
        switch (Math.floor(_)) {
            case 0: {
                z[0] = 1, z[1] = w, z[2] = 0;
                break
            }
            case 1: {
                z[0] = O, z[1] = 1, z[2] = 0;
                break
            }
            case 2: {
                z[0] = 0, z[1] = 1, z[2] = w;
                break
            }
            case 3: {
                z[0] = 0, z[1] = O, z[2] = 1;
                break
            }
            case 4: {
                z[0] = w, z[1] = 0, z[2] = 1;
                break
            }
            default:
                z[0] = 1, z[1] = 0, z[2] = O
        }
        return $ = (1 - K) * Y, [(K * z[0] + $) * 255, (K * z[1] + $) * 255, (K * z[2] + $) * 255]
    };
    N4.hcg.hsv = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = q + K * (1 - q),
            z = 0;
        if (Y > 0) z = q / Y;
        return [A[0], z * 100, Y * 100]
    };
    N4.hcg.hsl = function(A) {
        let q = A[1] / 100,
            Y = A[2] / 100 * (1 - q) + 0.5 * q,
            z = 0;
        if (Y > 0 && Y < 0.5) z = q / (2 * Y);
        else if (Y >= 0.5 && Y < 1) z = q / (2 * (1 - Y));
        return [A[0], z * 100, Y * 100]
    };
    N4.hcg.hwb = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = q + K * (1 - q);
        return [A[0], (Y - q) * 100, (1 - Y) * 100]
    };
    N4.hwb.hcg = function(A) {
        let q = A[1] / 100,
            Y = 1 - A[2] / 100,
            z = Y - q,
            _ = 0;
        if (z < 1) _ = (Y - z) / (1 - z);
        return [A[0], z * 100, _ * 100]
    };
    N4.apple.rgb = function(A) {
        return [A[0] / 65535 * 255, A[1] / 65535 * 255, A[2] / 65535 * 255]
    };
    N4.rgb.apple = function(A) {
        return [A[0] / 255 * 65535, A[1] / 255 * 65535, A[2] / 255 * 65535]
    };
    N4.gray.rgb = function(A) {
        return [A[0] / 100 * 255, A[0] / 100 * 255, A[0] / 100 * 255]
    };
    N4.gray.hsl = function(A) {
        return [0, 0, A[0]]
    };
    N4.gray.hsv = N4.gray.hsl;
    N4.gray.hwb = function(A) {
        return [0, 100, A[0]]
    };
    N4.gray.cmyk = function(A) {
        return [0, 0, 0, A[0]]
    };
    N4.gray.lab = function(A) {
        return [A[0], 0, 0]
    };
    N4.gray.hex = function(A) {
        let q = Math.round(A[0] / 100 * 255) & 255,
            Y = ((q << 16) + (q << 8) + q).toString(16).toUpperCase();
        return "000000".slice(Y.length) + Y
    };
    N4.rgb.gray = function(A) {
        return [(A[0] + A[1] + A[2]) / 3 / 255 * 100]
    };

    function Ty9() {
        let A = {},
            q = Object.keys(T36);
        for (let {
                length: K
            } = q, Y = 0; Y < K; Y++) A[q[Y]] = {
            distance: -1,
            parent: null
        };
        return A
    }

    function vy9(A) {
        let q = Ty9(),
            K = [A];
        q[A].distance = 0;
        while (K.length > 0) {
            let Y = K.pop(),
                z = Object.keys(T36[Y]);
            for (let {
                    length: _
                } = z, w = 0; w < _; w++) {
                let O = z[w],
                    $ = q[O];
                if ($.distance === -1) $.distance = q[Y].distance + 1, $.parent = Y, K.unshift(O)
            }
        }
        return q
    }

    function Ny9(A, q) {
        return function(K) {
            return q(A(K))
        }
    }

    function Vy9(A, q) {
        let K = [q[A].parent, A],
            Y = T36[q[A].parent][A],
            z = q[A].parent;
        while (q[z].parent) K.unshift(q[z].parent), Y = Ny9(T36[q[z].parent][z], Y), z = q[z].parent;
        return Y.conversion = K, Y
    }

    function ky9(A) {
        let q = vy9(A),
            K = {},
            Y = Object.keys(q);
        for (let {
                length: z
            } = Y, _ = 0; _ < z; _++) {
            let w = Y[_];
            if (q[w].parent === null) continue;
            K[w] = Vy9(w, q)
        }
        return K
    }
    var Ey9 = ky9,
        AW6 = {},
        yy9 = Object.keys(T36);

    function Ly9(A) {
        let q = function(...K) {
            let Y = K[0];
            if (Y === void 0 || Y === null) return Y;
            if (Y.length > 1) K = Y;
            return A(K)
        };
        if ("conversion" in A) q.conversion = A.conversion;
        return q
    }

    function Ry9(A) {
        let q = function(...K) {
            let Y = K[0];
            if (Y === void 0 || Y === null) return Y;
            if (Y.length > 1) K = Y;
            let z = A(K);
            if (typeof z === "object")
                for (let {
                        length: _
                    } = z, w = 0; w < _; w++) z[w] = Math.round(z[w]);
            return z
        };
        if ("conversion" in A) q.conversion = A.conversion;
        return q
    }
    for (let A of yy9) {
        AW6[A] = {}, Object.defineProperty(AW6[A], "channels", {
            value: T36[A].channels
        }), Object.defineProperty(AW6[A], "labels", {
            value: T36[A].labels
        });
        let q = Ey9(A),
            K = Object.keys(q);
        for (let Y of K) {
            let z = q[Y];
            AW6[A][Y] = Ry9(z), AW6[A][Y].raw = Ly9(z)
        }
    }
    var mk = AW6,
        Z44 = ["keyword", "gray", "hex"],
        jv8 = {};
    for (let A of Object.keys(mk)) jv8[[...mk[A].labels].sort().join("")] = A;
    var Jv8 = {};

    function XX(A, q) {
        if (!(this instanceof XX)) return new XX(A, q);
        if (q && q in Z44) q = null;
        if (q && !(q in mk)) throw Error("Unknown model: " + q);
        let K, Y;
        if (A == null) this.model = "rgb", this.color = [0, 0, 0], this.valpha = 1;
        else if (A instanceof XX) this.model = A.model, this.color = [...A.color], this.valpha = A.valpha;
        else if (typeof A === "string") {
            let z = e06.get(A);
            if (z === null) throw Error("Unable to parse color from string: " + A);
            this.model = z.model, Y = mk[this.model].channels, this.color = z.value.slice(0, Y), this.valpha = typeof z.value[Y] === "number" ? z.value[Y] : 1
        } else if (A.length > 0) {
            this.model = q || "rgb", Y = mk[this.model].channels;
            let z = Array.prototype.slice.call(A, 0, Y);
            this.color = Mv8(z, Y), this.valpha = typeof A[Y] === "number" ? A[Y] : 1
        } else if (typeof A === "number") this.model = "rgb", this.color = [A >> 16 & 255, A >> 8 & 255, A & 255], this.valpha = 1;
        else {
            this.valpha = 1;
            let z = Object.keys(A);
            if ("alpha" in A) z.splice(z.indexOf("alpha"), 1), this.valpha = typeof A.alpha === "number" ? A.alpha : 0;
            let _ = z.sort().join("");
            if (!(_ in jv8)) throw Error("Unable to parse color from object: " + JSON.stringify(A));
            this.model = jv8[_];
            let {
                labels: w
            } = mk[this.model], O = [];
            for (K = 0; K < w.length; K++) O.push(A[w[K]]);
            this.color = Mv8(O)
        }
        if (Jv8[this.model]) {
            Y = mk[this.model].channels;
            for (K = 0; K < Y; K++) {
                let z = Jv8[this.model][K];
                if (z) this.color[K] = z(this.color[K])
            }
        }
        if (this.valpha = Math.max(0, Math.min(1, this.valpha)), Object.freeze) Object.freeze(this)
    }
    XX.prototype = {
        toString() {
            return this.string()
        },
        toJSON() {
            return this[this.model]()
        },
        string(A) {
            let q = this.model in e06.to ? this : this.rgb();
            q = q.round(typeof A === "number" ? A : 1);
            let K = q.valpha === 1 ? q.color : [...q.color, this.valpha];
            return e06.to[q.model](...K)
        },
        percentString(A) {
            let q = this.rgb().round(typeof A === "number" ? A : 1),
                K = q.valpha === 1 ? q.color : [...q.color, this.valpha];
            return e06.to.rgb.percent(...K)
        },
        array() {
            return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha]
        },
        object() {
            let A = {},
                {
                    channels: q
                } = mk[this.model],
                {
                    labels: K
                } = mk[this.model];
            for (let Y = 0; Y < q; Y++) A[K[Y]] = this.color[Y];
            if (this.valpha !== 1) A.alpha = this.valpha;
            return A
        },
        unitArray() {
            let A = this.rgb().color;
            if (A[0] /= 255, A[1] /= 255, A[2] /= 255, this.valpha !== 1) A.push(this.valpha);
            return A
        },
        unitObject() {
            let A = this.rgb().object();
            if (A.r /= 255, A.g /= 255, A.b /= 255, this.valpha !== 1) A.alpha = this.valpha;
            return A
        },
        round(A) {
            return A = Math.max(A || 0, 0), new XX([...this.color.map(Sy9(A)), this.valpha], this.model)
        },
        alpha(A) {
            if (A !== void 0) return new XX([...this.color, Math.max(0, Math.min(1, A))], this.model);
            return this.valpha
        },
        red: nH("rgb", 0, rM(255)),
        green: nH("rgb", 1, rM(255)),
        blue: nH("rgb", 2, rM(255)),
        hue: nH(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (A) => (A % 360 + 360) % 360),
        saturationl: nH("hsl", 1, rM(100)),
        lightness: nH("hsl", 2, rM(100)),
        saturationv: nH("hsv", 1, rM(100)),
        value: nH("hsv", 2, rM(100)),
        chroma: nH("hcg", 1, rM(100)),
        gray: nH("hcg", 2, rM(100)),
        white: nH("hwb", 1, rM(100)),
        wblack: nH("hwb", 2, rM(100)),
        cyan: nH("cmyk", 0, rM(100)),
        magenta: nH("cmyk", 1, rM(100)),
        yellow: nH("cmyk", 2, rM(100)),
        black: nH("cmyk", 3, rM(100)),
        x: nH("xyz", 0, rM(95.047)),
        y: nH("xyz", 1, rM(100)),
        z: nH("xyz", 2, rM(108.833)),
        l: nH("lab", 0, rM(100)),
        a: nH("lab", 1),
        b: nH("lab", 2),
        keyword(A) {
            if (A !== void 0) return new XX(A);
            return mk[this.model].keyword(this.color)
        },
        hex(A) {
            if (A !== void 0) return new XX(A);
            return e06.to.hex(...this.rgb().round().color)
        },
        hexa(A) {
            if (A !== void 0) return new XX(A);
            let q = this.rgb().round().color,
                K = Math.round(this.valpha * 255).toString(16).toUpperCase();
            if (K.length === 1) K = "0" + K;
            return e06.to.hex(...q) + K
        },
        rgbNumber() {
            let A = this.rgb().color;
            return (A[0] & 255) << 16 | (A[1] & 255) << 8 | A[2] & 255
        },
        luminosity() {
            let A = this.rgb().color,
                q = [];
            for (let [K, Y] of A.entries()) {
                let z = Y / 255;
                q[K] = z <= 0.04045 ? z / 12.92 : ((z + 0.055) / 1.055) ** 2.4
            }
            return 0.2126 * q[0] + 0.7152 * q[1] + 0.0722 * q[2]
        },
        contrast(A) {
            let q = this.luminosity(),
                K = A.luminosity();
            if (q > K) return (q + 0.05) / (K + 0.05);
            return (K + 0.05) / (q + 0.05)
        },
        level(A) {
            let q = this.contrast(A);
            if (q >= 7) return "AAA";
            return q >= 4.5 ? "AA" : ""
        },
        isDark() {
            let A = this.rgb().color;
            return (A[0] * 2126 + A[1] * 7152 + A[2] * 722) / 1e4 < 128
        },
        isLight() {
            return !this.isDark()
        },
        negate() {
            let A = this.rgb();
            for (let q = 0; q < 3; q++) A.color[q] = 255 - A.color[q];
            return A
        },
        lighten(A) {
            let q = this.hsl();
            return q.color[2] += q.color[2] * A, q
        },
        darken(A) {
            let q = this.hsl();
            return q.color[2] -= q.color[2] * A, q
        },
        saturate(A) {
            let q = this.hsl();
            return q.color[1] += q.color[1] * A, q
        },
        desaturate(A) {
            let q = this.hsl();
            return q.color[1] -= q.color[1] * A, q
        },
        whiten(A) {
            let q = this.hwb();
            return q.color[1] += q.color[1] * A, q
        },
        blacken(A) {
            let q = this.hwb();
            return q.color[2] += q.color[2] * A, q
        },
        grayscale() {
            let A = this.rgb().color,
                q = A[0] * 0.3 + A[1] * 0.59 + A[2] * 0.11;
            return XX.rgb(q, q, q)
        },
        fade(A) {
            return this.alpha(this.valpha - this.valpha * A)
        },
        opaquer(A) {
            return this.alpha(this.valpha + this.valpha * A)
        },
        rotate(A) {
            let q = this.hsl(),
                K = q.color[0];
            return K = (K + A) % 360, K = K < 0 ? 360 + K : K, q.color[0] = K, q
        },
        mix(A, q) {
            if (!A || !A.rgb) throw Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof A);
            let K = A.rgb(),
                Y = this.rgb(),
                z = q === void 0 ? 0.5 : q,
                _ = 2 * z - 1,
                w = K.alpha() - Y.alpha(),
                O = ((_ * w === -1 ? _ : (_ + w) / (1 + _ * w)) + 1) / 2,
                $ = 1 - O;
            return XX.rgb(O * K.red() + $ * Y.red(), O * K.green() + $ * Y.green(), O * K.blue() + $ * Y.blue(), K.alpha() * z + Y.alpha() * (1 - z))
        }
    };
    for (let A of Object.keys(mk)) {
        if (Z44.includes(A)) continue;
        let {
            channels: q
        } = mk[A];
        XX.prototype[A] = function(...K) {
            if (this.model === A) return new XX(this);
            if (K.length > 0) return new XX(K, A);
            return new XX([...Cy9(mk[this.model][A].raw(this.color)), this.valpha], A)
        }, XX[A] = function(...K) {
            let Y = K[0];
            if (typeof Y === "number") Y = Mv8(K, q);
            return new XX(Y, A)
        }
    }

    function hy9(A, q) {
        return Number(A.toFixed(q))
    }

    function Sy9(A) {
        return function(q) {
            return hy9(q, A)
        }
    }

    function nH(A, q, K) {
        A = Array.isArray(A) ? A : [A];
        for (let Y of A)(Jv8[Y] ||= [])[q] = K;
        return A = A[0],
            function(Y) {
                let z;
                if (Y !== void 0) {
                    if (K) Y = K(Y);
                    return z = this[A](), z.color[q] = Y, z
                }
                if (z = this[A]().color[q], K) z = K(z);
                return z
            }
    }

    function rM(A) {
        return function(q) {
            return Math.max(0, Math.min(A, q))
        }
    }

    function Cy9(A) {
        return Array.isArray(A) ? A : [A]
    }

    function Mv8(A, q) {
        for (let K = 0; K < q; K++)
            if (typeof A[K] !== "number") A[K] = 0;
        return A
    }
    var Iy9 = XX
})
// @from(Ln 226380, Col 4)
v44 = x((Tg2, T44) => {
    T44.exports = f44().default
})
// @from(Ln 226383, Col 4)
E44 = x((vg2, k44) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var by9 = v44(),
        gd = GB(),
        N44 = {
            multiband: "multiband",
            "b-w": "b-w",
            bw: "b-w",
            cmyk: "cmyk",
            srgb: "srgb"
        };

    function xy9(A) {
        return this._setBackgroundColourOption("tint", A), this
    }

    function uy9(A) {
        return this.options.greyscale = gd.bool(A) ? A : !0, this
    }

    function my9(A) {
        return this.greyscale(A)
    }

    function By9(A) {
        if (!gd.string(A)) throw gd.invalidParameterError("colourspace", "string", A);
        return this.options.colourspacePipeline = A, this
    }

    function gy9(A) {
        return this.pipelineColourspace(A)
    }

    function Fy9(A) {
        if (!gd.string(A)) throw gd.invalidParameterError("colourspace", "string", A);
        return this.options.colourspace = A, this
    }

    function py9(A) {
        return this.toColourspace(A)
    }

    function V44(A) {
        if (gd.object(A) || gd.string(A) && A.length >= 3 && A.length <= 200) {
            let q = by9(A);
            return [q.red(), q.green(), q.blue(), Math.round(q.alpha() * 255)]
        } else throw gd.invalidParameterError("background", "object or string", A)
    }

    function Qy9(A, q) {
        if (gd.defined(q)) this.options[A] = V44(q)
    }
    k44.exports = (A) => {
        Object.assign(A.prototype, {
            tint: xy9,
            greyscale: uy9,
            grayscale: my9,
            pipelineColourspace: By9,
            pipelineColorspace: gy9,
            toColourspace: Fy9,
            toColorspace: py9,
            _getBackgroundColourOption: V44,
            _setBackgroundColourOption: Qy9
        }), A.colourspace = N44, A.colorspace = N44
    }
})
// @from(Ln 226452, Col 4)
L44 = x((Ng2, y44) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var kB = GB(),
        Uy9 = {
            and: "and",
            or: "or",
            eor: "eor"
        };

    function dy9() {
        return this.options.removeAlpha = !0, this
    }

    function cy9(A) {
        if (kB.defined(A))
            if (kB.number(A) && kB.inRange(A, 0, 1)) this.options.ensureAlpha = A;
            else throw kB.invalidParameterError("alpha", "number between 0 and 1", A);
        else this.options.ensureAlpha = 1;
        return this
    }

    function ly9(A) {
        let q = {
            red: 0,
            green: 1,
            blue: 2,
            alpha: 3
        };
        if (Object.keys(q).includes(A)) A = q[A];
        if (kB.integer(A) && kB.inRange(A, 0, 4)) this.options.extractChannel = A;
        else throw kB.invalidParameterError("channel", "integer or one of: red, green, blue, alpha", A);
        return this
    }

    function iy9(A, q) {
        if (Array.isArray(A)) A.forEach(function(K) {
            this.options.joinChannelIn.push(this._createInputDescriptor(K, q))
        }, this);
        else this.options.joinChannelIn.push(this._createInputDescriptor(A, q));
        return this
    }

    function ny9(A) {
        if (kB.string(A) && kB.inArray(A, ["and", "or", "eor"])) this.options.bandBoolOp = A;
        else throw kB.invalidParameterError("boolOp", "one of: and, or, eor", A);
        return this
    }
    y44.exports = (A) => {
        Object.assign(A.prototype, {
            removeAlpha: dy9,
            ensureAlpha: cy9,
            extractChannel: ly9,
            joinChannel: iy9,
            bandbool: ny9
        }), A.bool = Uy9
    }
})
// @from(Ln 226512, Col 4)
I44 = x((Vg2, C44) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var Xv8 = x6("node:path"),
        j1 = GB(),
        YW6 = gF6(),
        R44 = new Map([
            ["heic", "heif"],
            ["heif", "heif"],
            ["avif", "avif"],
            ["jpeg", "jpeg"],
            ["jpg", "jpeg"],
            ["jpe", "jpeg"],
            ["tile", "tile"],
            ["dz", "tile"],
            ["png", "png"],
            ["raw", "raw"],
            ["tiff", "tiff"],
            ["tif", "tiff"],
            ["webp", "webp"],
            ["gif", "gif"],
            ["jp2", "jp2"],
            ["jpx", "jp2"],
            ["j2k", "jp2"],
            ["j2c", "jp2"],
            ["jxl", "jxl"]
        ]),
        ry9 = /\.(jp[2x]|j2[kc])$/i,
        h44 = () => Error("JP2 output requires libvips with support for OpenJPEG"),
        S44 = (A) => 1 << 31 - Math.clz32(Math.ceil(Math.log2(A)));

    function oy9(A, q) {
        let K;
        if (!j1.string(A)) K = Error("Missing output file path");
        else if (j1.string(this.options.input.file) && Xv8.resolve(this.options.input.file) === Xv8.resolve(A)) K = Error("Cannot use same file for input and output");
        else if (ry9.test(Xv8.extname(A)) && !this.constructor.format.jp2k.output.file) K = h44();
        if (K)
            if (j1.fn(q)) q(K);
            else return Promise.reject(K);
        else {
            this.options.fileOut = A;
            let Y = Error();
            return this._pipeline(q, Y)
        }
        return this
    }

    function ay9(A, q) {
        if (j1.object(A)) this._setBooleanOption("resolveWithObject", A.resolveWithObject);
        else if (this.options.resolveWithObject) this.options.resolveWithObject = !1;
        this.options.fileOut = "";
        let K = Error();
        return this._pipeline(j1.fn(A) ? A : q, K)
    }

    function sy9() {
        return this.options.keepMetadata |= 1, this
    }

    function ty9(A) {
        if (j1.object(A))
            for (let [q, K] of Object.entries(A))
                if (j1.object(K))
                    for (let [Y, z] of Object.entries(K))
                        if (j1.string(z)) this.options.withExif[`exif-${q.toLowerCase()}-${Y}`] = z;
                        else throw j1.invalidParameterError(`${q}.${Y}`, "string", z);
        else throw j1.invalidParameterError(q, "object", K);
        else throw j1.invalidParameterError("exif", "object", A);
        return this.options.withExifMerge = !1, this.keepExif()
    }

    function ey9(A) {
        return this.withExif(A), this.options.withExifMerge = !0, this
    }

    function AL9() {
        return this.options.keepMetadata |= 8, this
    }

    function qL9(A, q) {
        if (j1.string(A)) this.options.withIccProfile = A;
        else throw j1.invalidParameterError("icc", "string", A);
        if (this.keepIccProfile(), j1.object(q)) {
            if (j1.defined(q.attach))
                if (j1.bool(q.attach)) {
                    if (!q.attach) this.options.keepMetadata &= -9
                } else throw j1.invalidParameterError("attach", "boolean", q.attach)
        }
        return this
    }

    function KL9() {
        return this.options.keepMetadata |= 2, this
    }

    function YL9(A) {
        if (j1.string(A) && A.length > 0) this.options.withXmp = A, this.options.keepMetadata |= 2;
        else throw j1.invalidParameterError("xmp", "non-empty string", A);
        return this
    }

    function zL9() {
        return this.options.keepMetadata = 31, this
    }

    function _L9(A) {
        if (this.keepMetadata(), this.withIccProfile("srgb"), j1.object(A)) {
            if (j1.defined(A.orientation))
                if (j1.integer(A.orientation) && j1.inRange(A.orientation, 1, 8)) this.options.withMetadataOrientation = A.orientation;
                else throw j1.invalidParameterError("orientation", "integer between 1 and 8", A.orientation);
            if (j1.defined(A.density))
                if (j1.number(A.density) && A.density > 0) this.options.withMetadataDensity = A.density;
                else throw j1.invalidParameterError("density", "positive number", A.density);
            if (j1.defined(A.icc)) this.withIccProfile(A.icc);
            if (j1.defined(A.exif)) this.withExifMerge(A.exif)
        }
        return this
    }

    function wL9(A, q) {
        let K = R44.get((j1.object(A) && j1.string(A.id) ? A.id : A).toLowerCase());
        if (!K) throw j1.invalidParameterError("format", `one of: ${[...R44.keys()].join(", ")}`, A);
        return this[K](q)
    }

    function OL9(A) {
        if (j1.object(A)) {
            if (j1.defined(A.quality))
                if (j1.integer(A.quality) && j1.inRange(A.quality, 1, 100)) this.options.jpegQuality = A.quality;
                else throw j1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            if (j1.defined(A.progressive)) this._setBooleanOption("jpegProgressive", A.progressive);
            if (j1.defined(A.chromaSubsampling))
                if (j1.string(A.chromaSubsampling) && j1.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.jpegChromaSubsampling = A.chromaSubsampling;
                else throw j1.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling);
            let q = j1.bool(A.optimizeCoding) ? A.optimizeCoding : A.optimiseCoding;
            if (j1.defined(q)) this._setBooleanOption("jpegOptimiseCoding", q);
            if (j1.defined(A.mozjpeg))
                if (j1.bool(A.mozjpeg)) {
                    if (A.mozjpeg) this.options.jpegTrellisQuantisation = !0, this.options.jpegOvershootDeringing = !0, this.options.jpegOptimiseScans = !0, this.options.jpegProgressive = !0, this.options.jpegQuantisationTable = 3
                } else throw j1.invalidParameterError("mozjpeg", "boolean", A.mozjpeg);
            let K = j1.bool(A.trellisQuantization) ? A.trellisQuantization : A.trellisQuantisation;
            if (j1.defined(K)) this._setBooleanOption("jpegTrellisQuantisation", K);
            if (j1.defined(A.overshootDeringing)) this._setBooleanOption("jpegOvershootDeringing", A.overshootDeringing);
            let Y = j1.bool(A.optimizeScans) ? A.optimizeScans : A.optimiseScans;
            if (j1.defined(Y)) {
                if (this._setBooleanOption("jpegOptimiseScans", Y), Y) this.options.jpegProgressive = !0
            }
            let z = j1.number(A.quantizationTable) ? A.quantizationTable : A.quantisationTable;
            if (j1.defined(z))
                if (j1.integer(z) && j1.inRange(z, 0, 8)) this.options.jpegQuantisationTable = z;
                else throw j1.invalidParameterError("quantisationTable", "integer between 0 and 8", z)
        }
        return this._updateFormatOut("jpeg", A)
    }

    function $L9(A) {
        if (j1.object(A)) {
            if (j1.defined(A.progressive)) this._setBooleanOption("pngProgressive", A.progressive);
            if (j1.defined(A.compressionLevel))
                if (j1.integer(A.compressionLevel) && j1.inRange(A.compressionLevel, 0, 9)) this.options.pngCompressionLevel = A.compressionLevel;
                else throw j1.invalidParameterError("compressionLevel", "integer between 0 and 9", A.compressionLevel);
            if (j1.defined(A.adaptiveFiltering)) this._setBooleanOption("pngAdaptiveFiltering", A.adaptiveFiltering);
            let q = A.colours || A.colors;
            if (j1.defined(q))
                if (j1.integer(q) && j1.inRange(q, 2, 256)) this.options.pngBitdepth = S44(q);
                else throw j1.invalidParameterError("colours", "integer between 2 and 256", q);
            if (j1.defined(A.palette)) this._setBooleanOption("pngPalette", A.palette);
            else if ([A.quality, A.effort, A.colours, A.colors, A.dither].some(j1.defined)) this._setBooleanOption("pngPalette", !0);
            if (this.options.pngPalette) {
                if (j1.defined(A.quality))
                    if (j1.integer(A.quality) && j1.inRange(A.quality, 0, 100)) this.options.pngQuality = A.quality;
                    else throw j1.invalidParameterError("quality", "integer between 0 and 100", A.quality);
                if (j1.defined(A.effort))
                    if (j1.integer(A.effort) && j1.inRange(A.effort, 1, 10)) this.options.pngEffort = A.effort;
                    else throw j1.invalidParameterError("effort", "integer between 1 and 10", A.effort);
                if (j1.defined(A.dither))
                    if (j1.number(A.dither) && j1.inRange(A.dither, 0, 1)) this.options.pngDither = A.dither;
                    else throw j1.invalidParameterError("dither", "number between 0.0 and 1.0", A.dither)
            }
        }
        return this._updateFormatOut("png", A)
    }

    function HL9(A) {
        if (j1.object(A)) {
            if (j1.defined(A.quality))
                if (j1.integer(A.quality) && j1.inRange(A.quality, 1, 100)) this.options.webpQuality = A.quality;
                else throw j1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            if (j1.defined(A.alphaQuality))
                if (j1.integer(A.alphaQuality) && j1.inRange(A.alphaQuality, 0, 100)) this.options.webpAlphaQuality = A.alphaQuality;
                else throw j1.invalidParameterError("alphaQuality", "integer between 0 and 100", A.alphaQuality);
            if (j1.defined(A.lossless)) this._setBooleanOption("webpLossless", A.lossless);
            if (j1.defined(A.nearLossless)) this._setBooleanOption("webpNearLossless", A.nearLossless);
            if (j1.defined(A.smartSubsample)) this._setBooleanOption("webpSmartSubsample", A.smartSubsample);
            if (j1.defined(A.smartDeblock)) this._setBooleanOption("webpSmartDeblock", A.smartDeblock);
            if (j1.defined(A.preset))
                if (j1.string(A.preset) && j1.inArray(A.preset, ["default", "photo", "picture", "drawing", "icon", "text"])) this.options.webpPreset = A.preset;
                else throw j1.invalidParameterError("preset", "one of: default, photo, picture, drawing, icon, text", A.preset);
            if (j1.defined(A.effort))
                if (j1.integer(A.effort) && j1.inRange(A.effort, 0, 6)) this.options.webpEffort = A.effort;
                else throw j1.invalidParameterError("effort", "integer between 0 and 6", A.effort);
            if (j1.defined(A.minSize)) this._setBooleanOption("webpMinSize", A.minSize);
            if (j1.defined(A.mixed)) this._setBooleanOption("webpMixed", A.mixed)
        }
        return Pv8(A, this.options), this._updateFormatOut("webp", A)
    }

    function jL9(A) {
        if (j1.object(A)) {
            if (j1.defined(A.reuse)) this._setBooleanOption("gifReuse", A.reuse);
            if (j1.defined(A.progressive)) this._setBooleanOption("gifProgressive", A.progressive);
            let q = A.colours || A.colors;
            if (j1.defined(q))
                if (j1.integer(q) && j1.inRange(q, 2, 256)) this.options.gifBitdepth = S44(q);
                else throw j1.invalidParameterError("colours", "integer between 2 and 256", q);
            if (j1.defined(A.effort))
                if (j1.number(A.effort) && j1.inRange(A.effort, 1, 10)) this.options.gifEffort = A.effort;
                else throw j1.invalidParameterError("effort", "integer between 1 and 10", A.effort);
            if (j1.defined(A.dither))
                if (j1.number(A.dither) && j1.inRange(A.dither, 0, 1)) this.options.gifDither = A.dither;
                else throw j1.invalidParameterError("dither", "number between 0.0 and 1.0", A.dither);
            if (j1.defined(A.interFrameMaxError))
                if (j1.number(A.interFrameMaxError) && j1.inRange(A.interFrameMaxError, 0, 32)) this.options.gifInterFrameMaxError = A.interFrameMaxError;
                else throw j1.invalidParameterError("interFrameMaxError", "number between 0.0 and 32.0", A.interFrameMaxError);
            if (j1.defined(A.interPaletteMaxError))
                if (j1.number(A.interPaletteMaxError) && j1.inRange(A.interPaletteMaxError, 0, 256)) this.options.gifInterPaletteMaxError = A.interPaletteMaxError;
                else throw j1.invalidParameterError("interPaletteMaxError", "number between 0.0 and 256.0", A.interPaletteMaxError);
            if (j1.defined(A.keepDuplicateFrames))
                if (j1.bool(A.keepDuplicateFrames)) this._setBooleanOption("gifKeepDuplicateFrames", A.keepDuplicateFrames);
                else throw j1.invalidParameterError("keepDuplicateFrames", "boolean", A.keepDuplicateFrames)
        }
        return Pv8(A, this.options), this._updateFormatOut("gif", A)
    }

    function JL9(A) {
        if (!this.constructor.format.jp2k.output.buffer) throw h44();
        if (j1.object(A)) {
            if (j1.defined(A.quality))
                if (j1.integer(A.quality) && j1.inRange(A.quality, 1, 100)) this.options.jp2Quality = A.quality;
                else throw j1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            if (j1.defined(A.lossless))
                if (j1.bool(A.lossless)) this.options.jp2Lossless = A.lossless;
                else throw j1.invalidParameterError("lossless", "boolean", A.lossless);
            if (j1.defined(A.tileWidth))
                if (j1.integer(A.tileWidth) && j1.inRange(A.tileWidth, 1, 32768)) this.options.jp2TileWidth = A.tileWidth;
                else throw j1.invalidParameterError("tileWidth", "integer between 1 and 32768", A.tileWidth);
            if (j1.defined(A.tileHeight))
                if (j1.integer(A.tileHeight) && j1.inRange(A.tileHeight, 1, 32768)) this.options.jp2TileHeight = A.tileHeight;
                else throw j1.invalidParameterError("tileHeight", "integer between 1 and 32768", A.tileHeight);
            if (j1.defined(A.chromaSubsampling))
                if (j1.string(A.chromaSubsampling) && j1.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.jp2ChromaSubsampling = A.chromaSubsampling;
                else throw j1.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling)
        }
        return this._updateFormatOut("jp2", A)
    }

    function Pv8(A, q) {
        if (j1.object(A) && j1.defined(A.loop))
            if (j1.integer(A.loop) && j1.inRange(A.loop, 0, 65535)) q.loop = A.loop;
            else throw j1.invalidParameterError("loop", "integer between 0 and 65535", A.loop);
        if (j1.object(A) && j1.defined(A.delay))
            if (j1.integer(A.delay) && j1.inRange(A.delay, 0, 65535)) q.delay = [A.delay];
            else if (Array.isArray(A.delay) && A.delay.every(j1.integer) && A.delay.every((K) => j1.inRange(K, 0, 65535))) q.delay = A.delay;
        else throw j1.invalidParameterError("delay", "integer or an array of integers between 0 and 65535", A.delay)
    }

    function ML9(A) {
        if (j1.object(A)) {
            if (j1.defined(A.quality))
                if (j1.integer(A.quality) && j1.inRange(A.quality, 1, 100)) this.options.tiffQuality = A.quality;
                else throw j1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            if (j1.defined(A.bitdepth))
                if (j1.integer(A.bitdepth) && j1.inArray(A.bitdepth, [1, 2, 4, 8])) this.options.tiffBitdepth = A.bitdepth;
                else throw j1.invalidParameterError("bitdepth", "1, 2, 4 or 8", A.bitdepth);
            if (j1.defined(A.tile)) this._setBooleanOption("tiffTile", A.tile);
            if (j1.defined(A.tileWidth))
                if (j1.integer(A.tileWidth) && A.tileWidth > 0) this.options.tiffTileWidth = A.tileWidth;
                else throw j1.invalidParameterError("tileWidth", "integer greater than zero", A.tileWidth);
            if (j1.defined(A.tileHeight))
                if (j1.integer(A.tileHeight) && A.tileHeight > 0) this.options.tiffTileHeight = A.tileHeight;
                else throw j1.invalidParameterError("tileHeight", "integer greater than zero", A.tileHeight);
            if (j1.defined(A.miniswhite)) this._setBooleanOption("tiffMiniswhite", A.miniswhite);
            if (j1.defined(A.pyramid)) this._setBooleanOption("tiffPyramid", A.pyramid);
            if (j1.defined(A.xres))
                if (j1.number(A.xres) && A.xres > 0) this.options.tiffXres = A.xres;
                else throw j1.invalidParameterError("xres", "number greater than zero", A.xres);
            if (j1.defined(A.yres))
                if (j1.number(A.yres) && A.yres > 0) this.options.tiffYres = A.yres;
                else throw j1.invalidParameterError("yres", "number greater than zero", A.yres);
            if (j1.defined(A.compression))
                if (j1.string(A.compression) && j1.inArray(A.compression, ["none", "jpeg", "deflate", "packbits", "ccittfax4", "lzw", "webp", "zstd", "jp2k"])) this.options.tiffCompression = A.compression;
                else throw j1.invalidParameterError("compression", "one of: none, jpeg, deflate, packbits, ccittfax4, lzw, webp, zstd, jp2k", A.compression);
            if (j1.defined(A.bigtiff)) this._setBooleanOption("tiffBigtiff", A.bigtiff);
            if (j1.defined(A.predictor))
                if (j1.string(A.predictor) && j1.inArray(A.predictor, ["none", "horizontal", "float"])) this.options.tiffPredictor = A.predictor;
                else throw j1.invalidParameterError("predictor", "one of: none, horizontal, float", A.predictor);
            if (j1.defined(A.resolutionUnit))
                if (j1.string(A.resolutionUnit) && j1.inArray(A.resolutionUnit, ["inch", "cm"])) this.options.tiffResolutionUnit = A.resolutionUnit;
                else throw j1.invalidParameterError("resolutionUnit", "one of: inch, cm", A.resolutionUnit)
        }
        return this._updateFormatOut("tiff", A)
    }

    function DL9(A) {
        return this.heif({
            ...A,
            compression: "av1"
        })
    }

    function XL9(A) {
        if (j1.object(A)) {
            if (j1.string(A.compression) && j1.inArray(A.compression, ["av1", "hevc"])) this.options.heifCompression = A.compression;
            else throw j1.invalidParameterError("compression", "one of: av1, hevc", A.compression);
            if (j1.defined(A.quality))
                if (j1.integer(A.quality) && j1.inRange(A.quality, 1, 100)) this.options.heifQuality = A.quality;
                else throw j1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            if (j1.defined(A.lossless))
                if (j1.bool(A.lossless)) this.options.heifLossless = A.lossless;
                else throw j1.invalidParameterError("lossless", "boolean", A.lossless);
            if (j1.defined(A.effort))
                if (j1.integer(A.effort) && j1.inRange(A.effort, 0, 9)) this.options.heifEffort = A.effort;
                else throw j1.invalidParameterError("effort", "integer between 0 and 9", A.effort);
            if (j1.defined(A.chromaSubsampling))
                if (j1.string(A.chromaSubsampling) && j1.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.heifChromaSubsampling = A.chromaSubsampling;
                else throw j1.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling);
            if (j1.defined(A.bitdepth))
                if (j1.integer(A.bitdepth) && j1.inArray(A.bitdepth, [8, 10, 12])) {
                    if (A.bitdepth !== 8 && this.constructor.versions.heif) throw j1.invalidParameterError("bitdepth when using prebuilt binaries", 8, A.bitdepth);
                    this.options.heifBitdepth = A.bitdepth
                } else throw j1.invalidParameterError("bitdepth", "8, 10 or 12", A.bitdepth)
        } else throw j1.invalidParameterError("options", "Object", A);
        return this._updateFormatOut("heif", A)
    }

    function PL9(A) {
        if (j1.object(A)) {
            if (j1.defined(A.quality))
                if (j1.integer(A.quality) && j1.inRange(A.quality, 1, 100)) this.options.jxlDistance = A.quality >= 30 ? 0.1 + (100 - A.quality) * 0.09 : 0.017666666666666667 * A.quality * A.quality - 1.15 * A.quality + 25;
                else throw j1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            else if (j1.defined(A.distance))
                if (j1.number(A.distance) && j1.inRange(A.distance, 0, 15)) this.options.jxlDistance = A.distance;
                else throw j1.invalidParameterError("distance", "number between 0.0 and 15.0", A.distance);
            if (j1.defined(A.decodingTier))
                if (j1.integer(A.decodingTier) && j1.inRange(A.decodingTier, 0, 4)) this.options.jxlDecodingTier = A.decodingTier;
                else throw j1.invalidParameterError("decodingTier", "integer between 0 and 4", A.decodingTier);
            if (j1.defined(A.lossless))
                if (j1.bool(A.lossless)) this.options.jxlLossless = A.lossless;
                else throw j1.invalidParameterError("lossless", "boolean", A.lossless);
            if (j1.defined(A.effort))
                if (j1.integer(A.effort) && j1.inRange(A.effort, 1, 9)) this.options.jxlEffort = A.effort;
                else throw j1.invalidParameterError("effort", "integer between 1 and 9", A.effort)
        }
        return Pv8(A, this.options), this._updateFormatOut("jxl", A)
    }

    function WL9(A) {
        if (j1.object(A)) {
            if (j1.defined(A.depth))
                if (j1.string(A.depth) && j1.inArray(A.depth, ["char", "uchar", "short", "ushort", "int", "uint", "float", "complex", "double", "dpcomplex"])) this.options.rawDepth = A.depth;
                else throw j1.invalidParameterError("depth", "one of: char, uchar, short, ushort, int, uint, float, complex, double, dpcomplex", A.depth)
        }
        return this._updateFormatOut("raw")
    }

    function ZL9(A) {
        if (j1.object(A)) {
            if (j1.defined(A.size))
                if (j1.integer(A.size) && j1.inRange(A.size, 1, 8192)) this.options.tileSize = A.size;
                else throw j1.invalidParameterError("size", "integer between 1 and 8192", A.size);
            if (j1.defined(A.overlap))
                if (j1.integer(A.overlap) && j1.inRange(A.overlap, 0, 8192)) {
                    if (A.overlap > this.options.tileSize) throw j1.invalidParameterError("overlap", `<= size (${this.options.tileSize})`, A.overlap);
                    this.options.tileOverlap = A.overlap
                } else throw j1.invalidParameterError("overlap", "integer between 0 and 8192", A.overlap);
            if (j1.defined(A.container))
                if (j1.string(A.container) && j1.inArray(A.container, ["fs", "zip"])) this.options.tileContainer = A.container;
                else throw j1.invalidParameterError("container", "one of: fs, zip", A.container);
            if (j1.defined(A.layout))
                if (j1.string(A.layout) && j1.inArray(A.layout, ["dz", "google", "iiif", "iiif3", "zoomify"])) this.options.tileLayout = A.layout;
                else throw j1.invalidParameterError("layout", "one of: dz, google, iiif, iiif3, zoomify", A.layout);
            if (j1.defined(A.angle))
                if (j1.integer(A.angle) && !(A.angle % 90)) this.options.tileAngle = A.angle;
                else throw j1.invalidParameterError("angle", "positive/negative multiple of 90", A.angle);
            if (this._setBackgroundColourOption("tileBackground", A.background), j1.defined(A.depth))
                if (j1.string(A.depth) && j1.inArray(A.depth, ["onepixel", "onetile", "one"])) this.options.tileDepth = A.depth;
                else throw j1.invalidParameterError("depth", "one of: onepixel, onetile, one", A.depth);
            if (j1.defined(A.skipBlanks))
                if (j1.integer(A.skipBlanks) && j1.inRange(A.skipBlanks, -1, 65535)) this.options.tileSkipBlanks = A.skipBlanks;
                else throw j1.invalidParameterError("skipBlanks", "integer between -1 and 255/65535", A.skipBlanks);
            else if (j1.defined(A.layout) && A.layout === "google") this.options.tileSkipBlanks = 5;
            let q = j1.bool(A.center) ? A.center : A.centre;
            if (j1.defined(q)) this._setBooleanOption("tileCentre", q);
            if (j1.defined(A.id))
                if (j1.string(A.id)) this.options.tileId = A.id;
                else throw j1.invalidParameterError("id", "string", A.id);
            if (j1.defined(A.basename))
                if (j1.string(A.basename)) this.options.tileBasename = A.basename;
                else throw j1.invalidParameterError("basename", "string", A.basename)
        }
        if (j1.inArray(this.options.formatOut, ["jpeg", "png", "webp"])) this.options.tileFormat = this.options.formatOut;
        else if (this.options.formatOut !== "input") throw j1.invalidParameterError("format", "one of: jpeg, png, webp", this.options.formatOut);
        return this._updateFormatOut("dz")
    }

    function GL9(A) {
        if (!j1.plainObject(A)) throw j1.invalidParameterError("options", "object", A);
        if (j1.integer(A.seconds) && j1.inRange(A.seconds, 0, 3600)) this.options.timeoutSeconds = A.seconds;
        else throw j1.invalidParameterError("seconds", "integer between 0 and 3600", A.seconds);
        return this
    }

    function fL9(A, q) {
        if (!(j1.object(q) && q.force === !1)) this.options.formatOut = A;
        return this
    }

    function TL9(A, q) {
        if (j1.bool(q)) this.options[A] = q;
        else throw j1.invalidParameterError(A, "boolean", q)
    }

    function vL9() {
        if (!this.options.streamOut) {
            this.options.streamOut = !0;
            let A = Error();
            this._pipeline(void 0, A)
        }
    }

    function NL9(A, q) {
        if (typeof A === "function") {
            if (this._isStreamInput()) this.on("finish", () => {
                this._flattenBufferIn(), YW6.pipeline(this.options, (K, Y, z) => {
                    if (K) A(j1.nativeError(K, q));
                    else A(null, Y, z)
                })
            });
            else YW6.pipeline(this.options, (K, Y, z) => {
                if (K) A(j1.nativeError(K, q));
                else A(null, Y, z)
            });
            return this
        } else if (this.options.streamOut) {
            if (this._isStreamInput()) {
                if (this.once("finish", () => {
                        this._flattenBufferIn(), YW6.pipeline(this.options, (K, Y, z) => {
                            if (K) this.emit("error", j1.nativeError(K, q));
                            else this.emit("info", z), this.push(Y);
                            this.push(null), this.on("end", () => this.emit("close"))
                        })
                    }), this.streamInFinished) this.emit("finish")
            } else YW6.pipeline(this.options, (K, Y, z) => {
                if (K) this.emit("error", j1.nativeError(K, q));
                else this.emit("info", z), this.push(Y);
                this.push(null), this.on("end", () => this.emit("close"))
            });
            return this
        } else if (this._isStreamInput()) return new Promise((K, Y) => {
            this.once("finish", () => {
                this._flattenBufferIn(), YW6.pipeline(this.options, (z, _, w) => {
                    if (z) Y(j1.nativeError(z, q));
                    else if (this.options.resolveWithObject) K({
                        data: _,
                        info: w
                    });
                    else K(_)
                })
            })
        });
        else return new Promise((K, Y) => {
            YW6.pipeline(this.options, (z, _, w) => {
                if (z) Y(j1.nativeError(z, q));
                else if (this.options.resolveWithObject) K({
                    data: _,
                    info: w
                });
                else K(_)
            })
        })
    }
    C44.exports = (A) => {
        Object.assign(A.prototype, {
            toFile: oy9,
            toBuffer: ay9,
            keepExif: sy9,
            withExif: ty9,
            withExifMerge: ey9,
            keepIccProfile: AL9,
            withIccProfile: qL9,
            keepXmp: KL9,
            withXmp: YL9,
            keepMetadata: zL9,
            withMetadata: _L9,
            toFormat: wL9,
            jpeg: OL9,
            jp2: JL9,
            png: $L9,
            webp: HL9,
            tiff: ML9,
            avif: DL9,
            heif: XL9,
            jxl: PL9,
            gif: jL9,
            raw: WL9,
            tile: ZL9,
            timeout: GL9,
            _updateFormatOut: fL9,
            _setBooleanOption: TL9,
            _read: vL9,
            _pipeline: NL9
        })
    }
})
// @from(Ln 227028, Col 4)
m44 = x((kg2, u44) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var VL9 = x6("node:events"),
        QX1 = LX1(),
        HR = GB(),
        {
            runtimePlatformArch: kL9
        } = zv8(),
        Pf = gF6(),
        b44 = kL9(),
        Wv8 = Pf.libvipsVersion(),
        Rt = Pf.format();
    Rt.heif.output.alias = ["avif", "heic"];
    Rt.jpeg.output.alias = ["jpe", "jpg"];
    Rt.tiff.output.alias = ["tif"];
    Rt.jp2k.output.alias = ["j2c", "j2k", "jp2", "jpx"];
    var EL9 = {
            nearest: "nearest",
            bilinear: "bilinear",
            bicubic: "bicubic",
            locallyBoundedBicubic: "lbb",
            nohalo: "nohalo",
            vertexSplitQuadraticBasisSpline: "vsqbs"
        },
        zW6 = {
            vips: Wv8.semver
        };
    if (!Wv8.isGlobal)
        if (!Wv8.isWasm) try {
            zW6 = x6(`@img/sharp-${b44}/versions`)
        } catch (A) {
            try {
                zW6 = x6(`@img/sharp-libvips-${b44}/versions`)
            } catch (q) {}
        } else try {
            zW6 = (() => {
                throw new Error("Cannot require module " + "@img/sharp-wasm32/versions");
            })()
        } catch (A) {}
    zW6.sharp = Kv8().version;
    if (zW6.heif && Rt.heif) Rt.heif.input.fileSuffix = [".avif"], Rt.heif.output.alias = ["avif"];

    function x44(A) {
        if (HR.bool(A))
            if (A) return Pf.cache(50, 20, 100);
            else return Pf.cache(0, 0, 0);
        else if (HR.object(A)) return Pf.cache(A.memory, A.files, A.items);
        else return Pf.cache()
    }
    x44(!0);

    function yL9(A) {
        return Pf.concurrency(HR.integer(A) ? A : null)
    }
    if (QX1.familySync() === QX1.GLIBC && !Pf._isUsingJemalloc()) Pf.concurrency(1);
    else if (QX1.familySync() === QX1.MUSL && Pf.concurrency() === 1024) Pf.concurrency(x6("node:os").availableParallelism());
    var LL9 = new VL9.EventEmitter;

    function RL9() {
        return Pf.counters()
    }

    function hL9(A) {
        return Pf.simd(HR.bool(A) ? A : null)
    }

    function SL9(A) {
        if (HR.object(A))
            if (Array.isArray(A.operation) && A.operation.every(HR.string)) Pf.block(A.operation, !0);
            else throw HR.invalidParameterError("operation", "Array<string>", A.operation);
        else throw HR.invalidParameterError("options", "object", A)
    }

    function CL9(A) {
        if (HR.object(A))
            if (Array.isArray(A.operation) && A.operation.every(HR.string)) Pf.block(A.operation, !1);
            else throw HR.invalidParameterError("operation", "Array<string>", A.operation);
        else throw HR.invalidParameterError("options", "object", A)
    }
    u44.exports = (A) => {
        A.cache = x44, A.concurrency = yL9, A.counters = RL9, A.simd = hL9, A.format = Rt, A.interpolators = EL9, A.versions = zW6, A.queue = LL9, A.block = SL9, A.unblock = CL9
    }
})
// @from(Ln 227114, Col 4)
Zv8 = x((yg2, B44) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var Fd = s74();
    A44()(Fd);
    w44()(Fd);
    $44()(Fd);
    D44()(Fd);
    E44()(Fd);
    L44()(Fd);
    I44()(Fd);
    m44()(Fd);
    B44.exports = Fd
})
// @from(Ln 227130, Col 0)
async function _W6() {
    if (UX1) return UX1.default;
    if (rY()) try {
        let K = await Promise.resolve().then(() => (kX1(), VX1)),
            Y = K.sharp || K.default;
        return UX1 = {
            default: Y
        }, Y
    } catch {
        console.warn("Native image processor not available, falling back to sharp")
    }
    let A = await Promise.resolve().then(() => t(Zv8(), 1)),
        q = A?.default || A;
    return UX1 = {
        default: q
    }, q
}
// @from(Ln 227147, Col 4)
UX1 = null
// @from(Ln 227148, Col 4)
Gv8 = () => {}
// @from(Ln 227150, Col 0)
function p44(A) {
    if (A instanceof Error) {
        let K = A;
        if (K.code === "MODULE_NOT_FOUND" || K.code === "ERR_MODULE_NOT_FOUND" || K.code === "ERR_DLOPEN_FAILED") return g44;
        if (K.code === "EACCES" || K.code === "EPERM") return BL9;
        if (K.code === "ENOMEM") return F44
    }
    let q = _1(A);
    if (q.includes("Native image processor module not available")) return g44;
    if (q.includes("unsupported image format") || q.includes("Input buffer") || q.includes("Input file is missing") || q.includes("Input file has corrupt header") || q.includes("corrupt header") || q.includes("corrupt image") || q.includes("premature end") || q.includes("zlib: data error") || q.includes("zero width") || q.includes("zero height")) return IL9;
    if (q.includes("pixel limit") || q.includes("too many pixels") || q.includes("exceeds pixel") || q.includes("image dimensions")) return xL9;
    if (q.includes("out of memory") || q.includes("Cannot allocate") || q.includes("memory allocation")) return F44;
    if (q.includes("timeout") || q.includes("timed out")) return uL9;
    if (q.includes("Vips")) return mL9;
    return bL9
}
// @from(Ln 227167, Col 0)
function Q44(A) {
    let q = 5381;
    for (let K = 0; K < A.length; K++) q = (q << 5) + q + A.charCodeAt(K) | 0;
    return q >>> 0
}
// @from(Ln 227172, Col 0)
async function Bk(A, q, K) {
    try {
        let Y = await _W6(),
            _ = await Y(A).metadata(),
            w = _.format ?? K,
            O = w === "jpg" ? "jpeg" : w;
        if (!_.width || !_.height) {
            if (q > xk) return {
                buffer: await Y(A).jpeg({
                    quality: 80
                }).toBuffer(),
                mediaType: "jpeg"
            };
            return {
                buffer: A,
                mediaType: O
            }
        }
        let {
            width: $,
            height: H
        } = _, j = $, J = H;
        if (q <= xk && j <= WB && J <= ZB) return {
            buffer: A,
            mediaType: O,
            dimensions: {
                originalWidth: $,
                originalHeight: H,
                displayWidth: j,
                displayHeight: J
            }
        };
        let M = j > WB || J > ZB,
            D = O === "png";
        if (!M && q > xk) {
            if (D) {
                let P = await Y(A).png({
                    compressionLevel: 9,
                    palette: !0
                }).toBuffer();
                if (P.length <= xk) return {
                    buffer: P,
                    mediaType: "png",
                    dimensions: {
                        originalWidth: $,
                        originalHeight: H,
                        displayWidth: j,
                        displayHeight: J
                    }
                }
            }
            for (let P of [80, 60, 40, 20]) {
                let W = await Y(A).jpeg({
                    quality: P
                }).toBuffer();
                if (W.length <= xk) return {
                    buffer: W,
                    mediaType: "jpeg",
                    dimensions: {
                        originalWidth: $,
                        originalHeight: H,
                        displayWidth: j,
                        displayHeight: J
                    }
                }
            }
        }
        if (j > WB) J = Math.round(J * WB / j), j = WB;
        if (J > ZB) j = Math.round(j * ZB / J), J = ZB;
        k(`Resizing to ${j}x${J}`);
        let X = await Y(A).resize(j, J, {
            fit: "inside",
            withoutEnlargement: !0
        }).toBuffer();
        if (X.length > xk) {
            if (D) {
                let G = await Y(A).resize(j, J, {
                    fit: "inside",
                    withoutEnlargement: !0
                }).png({
                    compressionLevel: 9,
                    palette: !0
                }).toBuffer();
                if (G.length <= xk) return {
                    buffer: G,
                    mediaType: "png",
                    dimensions: {
                        originalWidth: $,
                        originalHeight: H,
                        displayWidth: j,
                        displayHeight: J
                    }
                }
            }
            for (let G of [80, 60, 40, 20]) {
                let f = await Y(A).resize(j, J, {
                    fit: "inside",
                    withoutEnlargement: !0
                }).jpeg({
                    quality: G
                }).toBuffer();
                if (f.length <= xk) return {
                    buffer: f,
                    mediaType: "jpeg",
                    dimensions: {
                        originalWidth: $,
                        originalHeight: H,
                        displayWidth: j,
                        displayHeight: J
                    }
                }
            }
            let P = Math.min(j, 1000),
                W = Math.round(J * P / Math.max(j, 1));
            k("Still too large, compressing with JPEG");
            let Z = await Y(A).resize(P, W, {
                fit: "inside",
                withoutEnlargement: !0
            }).jpeg({
                quality: 20
            }).toBuffer();
            return k(`JPEG compressed buffer size: ${Z.length}`), {
                buffer: Z,
                mediaType: "jpeg",
                dimensions: {
                    originalWidth: $,
                    originalHeight: H,
                    displayWidth: P,
                    displayHeight: W
                }
            }
        }
        return {
            buffer: X,
            mediaType: O,
            dimensions: {
                originalWidth: $,
                originalHeight: H,
                displayWidth: j,
                displayHeight: J
            }
        }
    } catch (Y) {
        _6(Y);
        let z = p44(Y),
            _ = _1(Y);
        d("tengu_image_resize_failed", {
            original_size_bytes: q,
            error_type: z,
            error_message_hash: Q44(_)
        });
        let O = pF6(A).slice(6),
            $ = Math.ceil(q * 4 / 3),
            H = A.length >= 24 && A[0] === 137 && A[1] === 80 && A[2] === 78 && A[3] === 71 && (A.readUInt32BE(16) > WB || A.readUInt32BE(20) > ZB);
        if ($ <= d06 && !H) return d("tengu_image_resize_fallback", {
            original_size_bytes: q,
            base64_size_bytes: $,
            error_type: z
        }), {
            buffer: A,
            mediaType: O
        };
        throw new pd(H ? `Unable to resize image — dimensions exceed the ${WB}x${ZB}px limit and image processing failed. Please resize the image to reduce its pixel dimensions.` : `Unable to resize image (${xq(q)} raw, ${xq($)} base64). The image exceeds the 5MB API limit and compression failed. Please resize the image manually or use a smaller image.`)
    }
}
// @from(Ln 227337, Col 0)
async function Qd(A) {
    if (A.source.type !== "base64") return {
        block: A
    };
    let q = Buffer.from(A.source.data, "base64"),
        K = q.length,
        z = A.source.media_type?.split("/")[1] || "png",
        _ = await Bk(q, K, z);
    return {
        block: {
            type: "image",
            source: {
                type: "base64",
                media_type: `image/${_.mediaType}`,
                data: _.buffer.toString("base64")
            }
        },
        dimensions: _.dimensions
    }
}
// @from(Ln 227357, Col 0)
async function U44(A, q = xk, K) {
    let Y = K?.split("/")[1] || "jpeg",
        z = Y === "jpg" ? "jpeg" : Y;
    try {
        let _ = await _W6(),
            w = await _(A).metadata(),
            O = w.format || z,
            $ = A.length,
            H = {
                imageBuffer: A,
                metadata: w,
                format: O,
                maxBytes: q,
                originalSize: $
            };
        if ($ <= q) return FF6(A, O, $);
        let j = await gL9(H, _);
        if (j) return j;
        if (O === "png") {
            let M = await pL9(H, _);
            if (M) return M
        }
        let J = await QL9(H, 50, _);
        if (J) return J;
        return await UL9(H, _)
    } catch (_) {
        _6(_);
        let w = p44(_),
            O = _1(_);
        if (d("tengu_image_compress_failed", {
                original_size_bytes: A.length,
                max_bytes: q,
                error_type: w,
                error_message_hash: Q44(O)
            }), A.length <= q) {
            let $ = pF6(A);
            return {
                base64: A.toString("base64"),
                mediaType: $,
                originalSize: A.length
            }
        }
        throw new pd(`Unable to compress image (${xq(A.length)}) to fit within ${xq(q)}. Please use a smaller image.`)
    }
}
// @from(Ln 227402, Col 0)
async function d44(A, q, K) {
    let Y = Math.floor(q / 0.125),
        z = Math.floor(Y * 0.75);
    return U44(A, z, K)
}
// @from(Ln 227407, Col 0)
async function c44(A, q = xk) {
    if (A.source.type !== "base64") return A;
    let K = Buffer.from(A.source.data, "base64");
    if (K.length <= q) return A;
    let Y = await U44(K, q);
    return {
        type: "image",
        source: {
            type: "base64",
            media_type: Y.mediaType,
            data: Y.base64
        }
    }
}
// @from(Ln 227422, Col 0)
function FF6(A, q, K) {
    let Y = q === "jpg" ? "jpeg" : q;
    return {
        base64: A.toString("base64"),
        mediaType: `image/${Y}`,
        originalSize: K
    }
}
// @from(Ln 227430, Col 0)
async function gL9(A, q) {
    let K = [1, 0.75, 0.5, 0.25];
    for (let Y of K) {
        let z = Math.round((A.metadata.width || 2000) * Y),
            _ = Math.round((A.metadata.height || 2000) * Y),
            w = q(A.imageBuffer).resize(z, _, {
                fit: "inside",
                withoutEnlargement: !0
            });
        w = FL9(w, A.format);
        let O = await w.toBuffer();
        if (O.length <= A.maxBytes) return FF6(O, A.format, A.originalSize)
    }
    return null
}
// @from(Ln 227446, Col 0)
function FL9(A, q) {
    switch (q) {
        case "png":
            return A.png({
                compressionLevel: 9,
                palette: !0
            });
        case "jpeg":
        case "jpg":
            return A.jpeg({
                quality: 80
            });
        case "webp":
            return A.webp({
                quality: 80
            });
        default:
            return A
    }
}
// @from(Ln 227466, Col 0)
async function pL9(A, q) {
    let K = await q(A.imageBuffer).resize(800, 800, {
        fit: "inside",
        withoutEnlargement: !0
    }).png({
        compressionLevel: 9,
        palette: !0,
        colors: 64
    }).toBuffer();
    if (K.length <= A.maxBytes) return FF6(K, "png", A.originalSize);
    return null
}
// @from(Ln 227478, Col 0)
async function QL9(A, q, K) {
    let Y = await K(A.imageBuffer).resize(600, 600, {
        fit: "inside",
        withoutEnlargement: !0
    }).jpeg({
        quality: q
    }).toBuffer();
    if (Y.length <= A.maxBytes) return FF6(Y, "jpeg", A.originalSize);
    return null
}
// @from(Ln 227488, Col 0)
async function UL9(A, q) {
    let K = await q(A.imageBuffer).resize(400, 400, {
        fit: "inside",
        withoutEnlargement: !0
    }).jpeg({
        quality: 20
    }).toBuffer();
    return FF6(K, "jpeg", A.originalSize)
}
// @from(Ln 227498, Col 0)
function pF6(A) {
    if (A.length < 4) return "image/png";
    if (A[0] === 137 && A[1] === 80 && A[2] === 78 && A[3] === 71) return "image/png";
    if (A[0] === 255 && A[1] === 216 && A[2] === 255) return "image/jpeg";
    if (A[0] === 71 && A[1] === 73 && A[2] === 70) return "image/gif";
    if (A[0] === 82 && A[1] === 73 && A[2] === 70 && A[3] === 70) {
        if (A.length >= 12 && A[8] === 87 && A[9] === 69 && A[10] === 66 && A[11] === 80) return "image/webp"
    }
    return "image/png"
}
// @from(Ln 227509, Col 0)
function fv8(A) {
    try {
        let q = Buffer.from(A, "base64");
        return pF6(q)
    } catch {
        return "image/png"
    }
}
// @from(Ln 227518, Col 0)
function wW6(A, q) {
    let {
        originalWidth: K,
        originalHeight: Y,
        displayWidth: z,
        displayHeight: _
    } = A;
    if (!K || !Y || !z || !_ || z <= 0 || _ <= 0) {
        if (q) return `[Image source: ${q}]`;
        return null
    }
    let w = K !== z || Y !== _;
    if (!w && !q) return null;
    let O = [];
    if (q) O.push(`source: ${q}`);
    if (w) {
        let $ = K / z;
        O.push(`original ${K}x${Y}, displayed at ${z}x${_}. Multiply coordinates by ${$.toFixed(2)} to map to original image.`)
    }
    return `[Image: ${O.join(", ")}]`
}
// @from(Ln 227539, Col 4)
g44 = 1
// @from(Ln 227540, Col 4)
IL9 = 2
// @from(Ln 227541, Col 4)
bL9 = 3
// @from(Ln 227542, Col 4)
xL9 = 4
// @from(Ln 227543, Col 4)
F44 = 5
// @from(Ln 227544, Col 4)
uL9 = 6
// @from(Ln 227545, Col 4)
mL9 = 7
// @from(Ln 227546, Col 4)
BL9 = 8
// @from(Ln 227547, Col 4)
pd
// @from(Ln 227548, Col 4)
jR = E(() => {
    k1();
    H1();
    Z7();
    V1();
    Gv8();
    s8();
    pd = class pd extends Error {
        constructor(A) {
            super(A);
            this.name = "ImageResizeError"
        }
    }
})
// @from(Ln 227563, Col 0)
function Tv8(A) {
    if (!A.isApiErrorMessage) return !1;
    let q = A.message.content;
    if (!Array.isArray(q)) return !1;
    return q.some((K) => K.type === "text" && K.text.startsWith(EB))
}
// @from(Ln 227570, Col 0)
function kv8() {
    let A = `max ${DA4} pages, ${xq(c06)}`;
    return q7() ? `PDF too large (${A}). Try reading the file a different way (e.g., extract text with pdftotext).` : `PDF too large (${A}). Double press esc to go back and try again, or use pdftotext to convert to text first.`
}
// @from(Ln 227575, Col 0)
function Ev8() {
    return q7() ? "PDF is password protected. Try using a CLI tool to extract or convert the PDF." : "PDF is password protected. Please double press esc to edit your message and try again."
}
// @from(Ln 227579, Col 0)
function yv8() {
    return q7() ? "The PDF file was not valid. Try converting it to text first (e.g., pdftotext)." : "The PDF file was not valid. Double press esc to go back and try again with a different file."
}
// @from(Ln 227583, Col 0)
function dX1() {
    return q7() ? "Image was too large. Try resizing the image or using a different approach." : "Image was too large. Double press esc to go back and try again with a smaller image."
}
// @from(Ln 227587, Col 0)
function Lv8() {
    let A = `max ${xq(c06)}`;
    return q7() ? `Request too large (${A}). Try with a smaller file.` : `Request too large (${A}). Double press esc to go back and try with a smaller file.`
}
// @from(Ln 227592, Col 0)
function cL9() {
    return q7() ? "Your account does not have access to Claude. Please login again or contact your administrator." : nX1
}
// @from(Ln 227596, Col 0)
function lL9() {
    return q7() ? "Your organization does not have access to Claude. Please login again or contact your administrator." : dL9
}