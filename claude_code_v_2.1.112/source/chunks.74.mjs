
// @from(Ln 194036, Col 4)
sw4 = p((Dzw, aw4) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var u1 = Ld(),
        iw4 = {
            integer: "integer",
            float: "float",
            approximate: "approximate"
        };

    function Xg_(q, K) {
        if (!u1.defined(q)) return this.autoOrient();
        if (this.options.angle || this.options.rotationAngle) this.options.debuglog("ignoring previous rotate options"), this.options.angle = 0, this.options.rotationAngle = 0;
        if (u1.integer(q) && !(q % 90)) this.options.angle = q;
        else if (u1.number(q)) {
            if (this.options.rotationAngle = q, u1.object(K) && K.background) this._setBackgroundColourOption("rotationBackground", K.background)
        } else throw u1.invalidParameterError("angle", "numeric", q);
        return this
    }

    function Mg_() {
        return this.options.input.autoOrient = !0, this
    }

    function Pg_(q) {
        return this.options.flip = u1.bool(q) ? q : !0, this
    }

    function Wg_(q) {
        return this.options.flop = u1.bool(q) ? q : !0, this
    }

    function Dg_(q, K) {
        let _ = [].concat(...q);
        if (_.length === 4 && _.every(u1.number)) this.options.affineMatrix = _;
        else throw u1.invalidParameterError("matrix", "1x4 or 2x2 array", q);
        if (u1.defined(K))
            if (u1.object(K)) {
                if (this._setBackgroundColourOption("affineBackground", K.background), u1.defined(K.idx))
                    if (u1.number(K.idx)) this.options.affineIdx = K.idx;
                    else throw u1.invalidParameterError("options.idx", "number", K.idx);
                if (u1.defined(K.idy))
                    if (u1.number(K.idy)) this.options.affineIdy = K.idy;
                    else throw u1.invalidParameterError("options.idy", "number", K.idy);
                if (u1.defined(K.odx))
                    if (u1.number(K.odx)) this.options.affineOdx = K.odx;
                    else throw u1.invalidParameterError("options.odx", "number", K.odx);
                if (u1.defined(K.ody))
                    if (u1.number(K.ody)) this.options.affineOdy = K.ody;
                    else throw u1.invalidParameterError("options.ody", "number", K.ody);
                if (u1.defined(K.interpolator))
                    if (u1.inArray(K.interpolator, Object.values(this.constructor.interpolators))) this.options.affineInterpolator = K.interpolator;
                    else throw u1.invalidParameterError("options.interpolator", "valid interpolator name", K.interpolator)
            } else throw u1.invalidParameterError("options", "object", K);
        return this
    }

    function Zg_(q, K, _) {
        if (!u1.defined(q)) this.options.sharpenSigma = -1;
        else if (u1.bool(q)) this.options.sharpenSigma = q ? -1 : 0;
        else if (u1.number(q) && u1.inRange(q, 0.01, 1e4)) {
            if (this.options.sharpenSigma = q, u1.defined(K))
                if (u1.number(K) && u1.inRange(K, 0, 1e4)) this.options.sharpenM1 = K;
                else throw u1.invalidParameterError("flat", "number between 0 and 10000", K);
            if (u1.defined(_))
                if (u1.number(_) && u1.inRange(_, 0, 1e4)) this.options.sharpenM2 = _;
                else throw u1.invalidParameterError("jagged", "number between 0 and 10000", _)
        } else if (u1.plainObject(q)) {
            if (u1.number(q.sigma) && u1.inRange(q.sigma, 0.000001, 10)) this.options.sharpenSigma = q.sigma;
            else throw u1.invalidParameterError("options.sigma", "number between 0.000001 and 10", q.sigma);
            if (u1.defined(q.m1))
                if (u1.number(q.m1) && u1.inRange(q.m1, 0, 1e6)) this.options.sharpenM1 = q.m1;
                else throw u1.invalidParameterError("options.m1", "number between 0 and 1000000", q.m1);
            if (u1.defined(q.m2))
                if (u1.number(q.m2) && u1.inRange(q.m2, 0, 1e6)) this.options.sharpenM2 = q.m2;
                else throw u1.invalidParameterError("options.m2", "number between 0 and 1000000", q.m2);
            if (u1.defined(q.x1))
                if (u1.number(q.x1) && u1.inRange(q.x1, 0, 1e6)) this.options.sharpenX1 = q.x1;
                else throw u1.invalidParameterError("options.x1", "number between 0 and 1000000", q.x1);
            if (u1.defined(q.y2))
                if (u1.number(q.y2) && u1.inRange(q.y2, 0, 1e6)) this.options.sharpenY2 = q.y2;
                else throw u1.invalidParameterError("options.y2", "number between 0 and 1000000", q.y2);
            if (u1.defined(q.y3))
                if (u1.number(q.y3) && u1.inRange(q.y3, 0, 1e6)) this.options.sharpenY3 = q.y3;
                else throw u1.invalidParameterError("options.y3", "number between 0 and 1000000", q.y3)
        } else throw u1.invalidParameterError("sigma", "number between 0.01 and 10000", q);
        return this
    }

    function fg_(q) {
        if (!u1.defined(q)) this.options.medianSize = 3;
        else if (u1.integer(q) && u1.inRange(q, 1, 1000)) this.options.medianSize = q;
        else throw u1.invalidParameterError("size", "integer between 1 and 1000", q);
        return this
    }

    function Gg_(q) {
        let K;
        if (u1.number(q)) K = q;
        else if (u1.plainObject(q)) {
            if (!u1.number(q.sigma)) throw u1.invalidParameterError("options.sigma", "number between 0.3 and 1000", K);
            if (K = q.sigma, "precision" in q)
                if (u1.string(iw4[q.precision])) this.options.precision = iw4[q.precision];
                else throw u1.invalidParameterError("precision", "one of: integer, float, approximate", q.precision);
            if ("minAmplitude" in q)
                if (u1.number(q.minAmplitude) && u1.inRange(q.minAmplitude, 0.001, 1)) this.options.minAmpl = q.minAmplitude;
                else throw u1.invalidParameterError("minAmplitude", "number between 0.001 and 1", q.minAmplitude)
        }
        if (!u1.defined(q)) this.options.blurSigma = -1;
        else if (u1.bool(q)) this.options.blurSigma = q ? -1 : 0;
        else if (u1.number(K) && u1.inRange(K, 0.3, 1000)) this.options.blurSigma = K;
        else throw u1.invalidParameterError("sigma", "number between 0.3 and 1000", K);
        return this
    }

    function rw4(q) {
        if (!u1.defined(q)) this.options.dilateWidth = 1;
        else if (u1.integer(q) && q > 0) this.options.dilateWidth = q;
        else throw u1.invalidParameterError("dilate", "positive integer", rw4);
        return this
    }

    function ow4(q) {
        if (!u1.defined(q)) this.options.erodeWidth = 1;
        else if (u1.integer(q) && q > 0) this.options.erodeWidth = q;
        else throw u1.invalidParameterError("erode", "positive integer", ow4);
        return this
    }

    function vg_(q) {
        if (this.options.flatten = u1.bool(q) ? q : !0, u1.object(q)) this._setBackgroundColourOption("flattenBackground", q.background);
        return this
    }

    function Tg_() {
        return this.options.unflatten = !0, this
    }

    function Vg_(q, K) {
        if (!u1.defined(q)) this.options.gamma = 2.2;
        else if (u1.number(q) && u1.inRange(q, 1, 3)) this.options.gamma = q;
        else throw u1.invalidParameterError("gamma", "number between 1.0 and 3.0", q);
        if (!u1.defined(K)) this.options.gammaOut = this.options.gamma;
        else if (u1.number(K) && u1.inRange(K, 1, 3)) this.options.gammaOut = K;
        else throw u1.invalidParameterError("gammaOut", "number between 1.0 and 3.0", K);
        return this
    }

    function kg_(q) {
        if (this.options.negate = u1.bool(q) ? q : !0, u1.plainObject(q) && "alpha" in q)
            if (!u1.bool(q.alpha)) throw u1.invalidParameterError("alpha", "should be boolean value", q.alpha);
            else this.options.negateAlpha = q.alpha;
        return this
    }

    function Ng_(q) {
        if (u1.plainObject(q)) {
            if (u1.defined(q.lower))
                if (u1.number(q.lower) && u1.inRange(q.lower, 0, 99)) this.options.normaliseLower = q.lower;
                else throw u1.invalidParameterError("lower", "number between 0 and 99", q.lower);
            if (u1.defined(q.upper))
                if (u1.number(q.upper) && u1.inRange(q.upper, 1, 100)) this.options.normaliseUpper = q.upper;
                else throw u1.invalidParameterError("upper", "number between 1 and 100", q.upper)
        }
        if (this.options.normaliseLower >= this.options.normaliseUpper) throw u1.invalidParameterError("range", "lower to be less than upper", `${this.options.normaliseLower} >= ${this.options.normaliseUpper}`);
        return this.options.normalise = !0, this
    }

    function Eg_(q) {
        return this.normalise(q)
    }

    function yg_(q) {
        if (u1.plainObject(q)) {
            if (u1.integer(q.width) && q.width > 0) this.options.claheWidth = q.width;
            else throw u1.invalidParameterError("width", "integer greater than zero", q.width);
            if (u1.integer(q.height) && q.height > 0) this.options.claheHeight = q.height;
            else throw u1.invalidParameterError("height", "integer greater than zero", q.height);
            if (u1.defined(q.maxSlope))
                if (u1.integer(q.maxSlope) && u1.inRange(q.maxSlope, 0, 100)) this.options.claheMaxSlope = q.maxSlope;
                else throw u1.invalidParameterError("maxSlope", "integer between 0 and 100", q.maxSlope)
        } else throw u1.invalidParameterError("options", "plain object", q);
        return this
    }

    function Lg_(q) {
        if (!u1.object(q) || !Array.isArray(q.kernel) || !u1.integer(q.width) || !u1.integer(q.height) || !u1.inRange(q.width, 3, 1001) || !u1.inRange(q.height, 3, 1001) || q.height * q.width !== q.kernel.length) throw Error("Invalid convolution kernel");
        if (!u1.integer(q.scale)) q.scale = q.kernel.reduce((K, _) => K + _, 0);
        if (q.scale < 1) q.scale = 1;
        if (!u1.integer(q.offset)) q.offset = 0;
        return this.options.convKernel = q, this
    }

    function hg_(q, K) {
        if (!u1.defined(q)) this.options.threshold = 128;
        else if (u1.bool(q)) this.options.threshold = q ? 128 : 0;
        else if (u1.integer(q) && u1.inRange(q, 0, 255)) this.options.threshold = q;
        else throw u1.invalidParameterError("threshold", "integer between 0 and 255", q);
        if (!u1.object(K) || K.greyscale === !0 || K.grayscale === !0) this.options.thresholdGrayscale = !0;
        else this.options.thresholdGrayscale = !1;
        return this
    }

    function Rg_(q, K, _) {
        if (this.options.boolean = this._createInputDescriptor(q, _), u1.string(K) && u1.inArray(K, ["and", "or", "eor"])) this.options.booleanOp = K;
        else throw u1.invalidParameterError("operator", "one of: and, or, eor", K);
        return this
    }

    function Sg_(q, K) {
        if (!u1.defined(q) && u1.number(K)) q = 1;
        else if (u1.number(q) && !u1.defined(K)) K = 0;
        if (!u1.defined(q)) this.options.linearA = [];
        else if (u1.number(q)) this.options.linearA = [q];
        else if (Array.isArray(q) && q.length && q.every(u1.number)) this.options.linearA = q;
        else throw u1.invalidParameterError("a", "number or array of numbers", q);
        if (!u1.defined(K)) this.options.linearB = [];
        else if (u1.number(K)) this.options.linearB = [K];
        else if (Array.isArray(K) && K.length && K.every(u1.number)) this.options.linearB = K;
        else throw u1.invalidParameterError("b", "number or array of numbers", K);
        if (this.options.linearA.length !== this.options.linearB.length) throw Error("Expected a and b to be arrays of the same length");
        return this
    }

    function Cg_(q) {
        if (!Array.isArray(q)) throw u1.invalidParameterError("inputMatrix", "array", q);
        if (q.length !== 3 && q.length !== 4) throw u1.invalidParameterError("inputMatrix", "3x3 or 4x4 array", q.length);
        let K = q.flat().map(Number);
        if (K.length !== 9 && K.length !== 16) throw u1.invalidParameterError("inputMatrix", "cardinality of 9 or 16", K.length);
        return this.options.recombMatrix = K, this
    }

    function bg_(q) {
        if (!u1.plainObject(q)) throw u1.invalidParameterError("options", "plain object", q);
        if ("brightness" in q)
            if (u1.number(q.brightness) && q.brightness >= 0) this.options.brightness = q.brightness;
            else throw u1.invalidParameterError("brightness", "number above zero", q.brightness);
        if ("saturation" in q)
            if (u1.number(q.saturation) && q.saturation >= 0) this.options.saturation = q.saturation;
            else throw u1.invalidParameterError("saturation", "number above zero", q.saturation);
        if ("hue" in q)
            if (u1.integer(q.hue)) this.options.hue = q.hue % 360;
            else throw u1.invalidParameterError("hue", "number", q.hue);
        if ("lightness" in q)
            if (u1.number(q.lightness)) this.options.lightness = q.lightness;
            else throw u1.invalidParameterError("lightness", "number", q.lightness);
        return this
    }
    aw4.exports = (q) => {
        Object.assign(q.prototype, {
            autoOrient: Mg_,
            rotate: Xg_,
            flip: Pg_,
            flop: Wg_,
            affine: Dg_,
            sharpen: Zg_,
            erode: ow4,
            dilate: rw4,
            median: fg_,
            blur: Gg_,
            flatten: vg_,
            unflatten: Tg_,
            gamma: Vg_,
            negate: kg_,
            normalise: Ng_,
            normalize: Eg_,
            clahe: yg_,
            convolve: Lg_,
            threshold: hg_,
            boolean: Rg_,
            linear: Sg_,
            recomb: Cg_,
            modulate: bg_
        })
    }
})
// @from(Ln 194314, Col 4)
z24 = p((Zzw, _24) => {
    var {
        defineProperty: Im1,
        getOwnPropertyDescriptor: Ig_,
        getOwnPropertyNames: xg_
    } = Object, ug_ = Object.prototype.hasOwnProperty, mg_ = (q, K) => {
        for (var _ in K) Im1(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, Bg_ = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of xg_(K))
                if (!ug_.call(q, Y) && Y !== _) Im1(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = Ig_(K, Y)) || z.enumerable
                })
        }
        return q
    }, pg_ = (q) => Bg_(Im1({}, "__esModule", {
        value: !0
    }), q), tw4 = {};
    mg_(tw4, {
        default: () => tg_
    });
    _24.exports = pg_(tw4);
    var bd = {
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
        ew4 = Object.create(null);
    for (let q in bd)
        if (Object.hasOwn(bd, q)) ew4[bd[q]] = q;
    var aE = {
        to: {},
        get: {}
    };
    aE.get = function(q) {
        let K = q.slice(0, 3).toLowerCase(),
            _, z;
        switch (K) {
            case "hsl": {
                _ = aE.get.hsl(q), z = "hsl";
                break
            }
            case "hwb": {
                _ = aE.get.hwb(q), z = "hwb";
                break
            }
            default: {
                _ = aE.get.rgb(q), z = "rgb";
                break
            }
        }
        if (!_) return null;
        return {
            model: z,
            value: _
        }
    };
    aE.get.rgb = function(q) {
        if (!q) return null;
        let K = /^#([a-f\d]{3,4})$/i,
            _ = /^#([a-f\d]{6})([a-f\d]{2})?$/i,
            z = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/,
            Y = /^rgba?\(\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/,
            A = /^(\w+)$/,
            O = [0, 0, 0, 1],
            w, $, j;
        if (w = q.match(_)) {
            j = w[2], w = w[1];
            for ($ = 0; $ < 3; $++) {
                let H = $ * 2;
                O[$] = Number.parseInt(w.slice(H, H + 2), 16)
            }
            if (j) O[3] = Number.parseInt(j, 16) / 255
        } else if (w = q.match(K)) {
            w = w[1], j = w[3];
            for ($ = 0; $ < 3; $++) O[$] = Number.parseInt(w[$] + w[$], 16);
            if (j) O[3] = Number.parseInt(j + j, 16) / 255
        } else if (w = q.match(z)) {
            for ($ = 0; $ < 3; $++) O[$] = Number.parseInt(w[$ + 1], 10);
            if (w[4]) O[3] = w[5] ? Number.parseFloat(w[4]) * 0.01 : Number.parseFloat(w[4])
        } else if (w = q.match(Y)) {
            for ($ = 0; $ < 3; $++) O[$] = Math.round(Number.parseFloat(w[$ + 1]) * 2.55);
            if (w[4]) O[3] = w[5] ? Number.parseFloat(w[4]) * 0.01 : Number.parseFloat(w[4])
        } else if (w = q.match(A)) {
            if (w[1] === "transparent") return [0, 0, 0, 0];
            if (!Object.hasOwn(bd, w[1])) return null;
            return O = bd[w[1]], O[3] = 1, O
        } else return null;
        for ($ = 0; $ < 3; $++) O[$] = g46(O[$], 0, 255);
        return O[3] = g46(O[3], 0, 1), O
    };
    aE.get.hsl = function(q) {
        if (!q) return null;
        let K = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[,|/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
            _ = q.match(K);
        if (_) {
            let z = Number.parseFloat(_[4]),
                Y = (Number.parseFloat(_[1]) % 360 + 360) % 360,
                A = g46(Number.parseFloat(_[2]), 0, 100),
                O = g46(Number.parseFloat(_[3]), 0, 100),
                w = g46(Number.isNaN(z) ? 1 : z, 0, 1);
            return [Y, A, O, w]
        }
        return null
    };
    aE.get.hwb = function(q) {
        if (!q) return null;
        let K = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*[\s,]\s*([+-]?[\d.]+)%\s*[\s,]\s*([+-]?[\d.]+)%\s*(?:[\s,]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
            _ = q.match(K);
        if (_) {
            let z = Number.parseFloat(_[4]),
                Y = (Number.parseFloat(_[1]) % 360 + 360) % 360,
                A = g46(Number.parseFloat(_[2]), 0, 100),
                O = g46(Number.parseFloat(_[3]), 0, 100),
                w = g46(Number.isNaN(z) ? 1 : z, 0, 1);
            return [Y, A, O, w]
        }
        return null
    };
    aE.to.hex = function(...q) {
        return "#" + fy8(q[0]) + fy8(q[1]) + fy8(q[2]) + (q[3] < 1 ? fy8(Math.round(q[3] * 255)) : "")
    };
    aE.to.rgb = function(...q) {
        return q.length < 4 || q[3] === 1 ? "rgb(" + Math.round(q[0]) + ", " + Math.round(q[1]) + ", " + Math.round(q[2]) + ")" : "rgba(" + Math.round(q[0]) + ", " + Math.round(q[1]) + ", " + Math.round(q[2]) + ", " + q[3] + ")"
    };
    aE.to.rgb.percent = function(...q) {
        let K = Math.round(q[0] / 255 * 100),
            _ = Math.round(q[1] / 255 * 100),
            z = Math.round(q[2] / 255 * 100);
        return q.length < 4 || q[3] === 1 ? "rgb(" + K + "%, " + _ + "%, " + z + "%)" : "rgba(" + K + "%, " + _ + "%, " + z + "%, " + q[3] + ")"
    };
    aE.to.hsl = function(...q) {
        return q.length < 4 || q[3] === 1 ? "hsl(" + q[0] + ", " + q[1] + "%, " + q[2] + "%)" : "hsla(" + q[0] + ", " + q[1] + "%, " + q[2] + "%, " + q[3] + ")"
    };
    aE.to.hwb = function(...q) {
        let K = "";
        if (q.length >= 4 && q[3] !== 1) K = ", " + q[3];
        return "hwb(" + q[0] + ", " + q[1] + "%, " + q[2] + "%" + K + ")"
    };
    aE.to.keyword = function(...q) {
        return ew4[q.slice(0, 3)]
    };

    function g46(q, K, _) {
        return Math.min(Math.max(K, q), _)
    }

    function fy8(q) {
        let K = Math.round(q).toString(16).toUpperCase();
        return K.length < 2 ? "0" + K : K
    }
    var XE6 = aE,
        q24 = {};
    for (let q of Object.keys(bd)) q24[bd[q]] = q;
    var qK = {
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
        n$6 = qK,
        ta = 0.008856451679035631;

    function PE6(q) {
        let K = q > 0.0031308 ? 1.055 * q ** 0.4166666666666667 - 0.055 : q * 12.92;
        return Math.min(Math.max(0, K), 1)
    }

    function WE6(q) {
        return q > 0.04045 ? ((q + 0.055) / 1.055) ** 2.4 : q / 12.92
    }
    for (let q of Object.keys(qK)) {
        if (!("channels" in qK[q])) throw Error("missing channels property: " + q);
        if (!("labels" in qK[q])) throw Error("missing channel labels property: " + q);
        if (qK[q].labels.length !== qK[q].channels) throw Error("channel and label counts mismatch: " + q);
        let {
            channels: K,
            labels: _
        } = qK[q];
        delete qK[q].channels, delete qK[q].labels, Object.defineProperty(qK[q], "channels", {
            value: K
        }), Object.defineProperty(qK[q], "labels", {
            value: _
        })
    }
    qK.rgb.hsl = function(q) {
        let K = q[0] / 255,
            _ = q[1] / 255,
            z = q[2] / 255,
            Y = Math.min(K, _, z),
            A = Math.max(K, _, z),
            O = A - Y,
            w, $;
        switch (A) {
            case Y: {
                w = 0;
                break
            }
            case K: {
                w = (_ - z) / O;
                break
            }
            case _: {
                w = 2 + (z - K) / O;
                break
            }
            case z: {
                w = 4 + (K - _) / O;
                break
            }
        }
        if (w = Math.min(w * 60, 360), w < 0) w += 360;
        let j = (Y + A) / 2;
        if (A === Y) $ = 0;
        else if (j <= 0.5) $ = O / (A + Y);
        else $ = O / (2 - A - Y);
        return [w, $ * 100, j * 100]
    };
    qK.rgb.hsv = function(q) {
        let K, _, z, Y, A, O = q[0] / 255,
            w = q[1] / 255,
            $ = q[2] / 255,
            j = Math.max(O, w, $),
            H = j - Math.min(O, w, $),
            J = function(X) {
                return (j - X) / 6 / H + 0.5
            };
        if (H === 0) Y = 0, A = 0;
        else {
            switch (A = H / j, K = J(O), _ = J(w), z = J($), j) {
                case O: {
                    Y = z - _;
                    break
                }
                case w: {
                    Y = 0.3333333333333333 + K - z;
                    break
                }
                case $: {
                    Y = 0.6666666666666666 + _ - K;
                    break
                }
            }
            if (Y < 0) Y += 1;
            else if (Y > 1) Y -= 1
        }
        return [Y * 360, A * 100, j * 100]
    };
    qK.rgb.hwb = function(q) {
        let K = q[0],
            _ = q[1],
            z = q[2],
            Y = qK.rgb.hsl(q)[0],
            A = 0.00392156862745098 * Math.min(K, Math.min(_, z));
        return z = 1 - 0.00392156862745098 * Math.max(K, Math.max(_, z)), [Y, A * 100, z * 100]
    };
    qK.rgb.oklab = function(q) {
        let K = WE6(q[0] / 255),
            _ = WE6(q[1] / 255),
            z = WE6(q[2] / 255),
            Y = Math.cbrt(0.4122214708 * K + 0.5363325363 * _ + 0.0514459929 * z),
            A = Math.cbrt(0.2119034982 * K + 0.6806995451 * _ + 0.1073969566 * z),
            O = Math.cbrt(0.0883024619 * K + 0.2817188376 * _ + 0.6299787005 * z),
            w = 0.2104542553 * Y + 0.793617785 * A - 0.0040720468 * O,
            $ = 1.9779984951 * Y - 2.428592205 * A + 0.4505937099 * O,
            j = 0.0259040371 * Y + 0.7827717662 * A - 0.808675766 * O;
        return [w * 100, $ * 100, j * 100]
    };
    qK.rgb.cmyk = function(q) {
        let K = q[0] / 255,
            _ = q[1] / 255,
            z = q[2] / 255,
            Y = Math.min(1 - K, 1 - _, 1 - z),
            A = (1 - K - Y) / (1 - Y) || 0,
            O = (1 - _ - Y) / (1 - Y) || 0,
            w = (1 - z - Y) / (1 - Y) || 0;
        return [A * 100, O * 100, w * 100, Y * 100]
    };

    function Fg_(q, K) {
        return (q[0] - K[0]) ** 2 + (q[1] - K[1]) ** 2 + (q[2] - K[2]) ** 2
    }
    qK.rgb.keyword = function(q) {
        let K = q24[q];
        if (K) return K;
        let _ = Number.POSITIVE_INFINITY,
            z;
        for (let Y of Object.keys(bd)) {
            let A = bd[Y],
                O = Fg_(q, A);
            if (O < _) _ = O, z = Y
        }
        return z
    };
    qK.keyword.rgb = function(q) {
        return bd[q]
    };
    qK.rgb.xyz = function(q) {
        let K = WE6(q[0] / 255),
            _ = WE6(q[1] / 255),
            z = WE6(q[2] / 255),
            Y = K * 0.4124564 + _ * 0.3575761 + z * 0.1804375,
            A = K * 0.2126729 + _ * 0.7151522 + z * 0.072175,
            O = K * 0.0193339 + _ * 0.119192 + z * 0.9503041;
        return [Y * 100, A * 100, O * 100]
    };
    qK.rgb.lab = function(q) {
        let K = qK.rgb.xyz(q),
            _ = K[0],
            z = K[1],
            Y = K[2];
        _ /= 95.047, z /= 100, Y /= 108.883, _ = _ > ta ? _ ** 0.3333333333333333 : 7.787 * _ + 0.13793103448275862, z = z > ta ? z ** 0.3333333333333333 : 7.787 * z + 0.13793103448275862, Y = Y > ta ? Y ** 0.3333333333333333 : 7.787 * Y + 0.13793103448275862;
        let A = 116 * z - 16,
            O = 500 * (_ - z),
            w = 200 * (z - Y);
        return [A, O, w]
    };
    qK.hsl.rgb = function(q) {
        let K = q[0] / 360,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y, A;
        if (_ === 0) return A = z * 255, [A, A, A];
        let O = z < 0.5 ? z * (1 + _) : z + _ - z * _,
            w = 2 * z - O,
            $ = [0, 0, 0];
        for (let j = 0; j < 3; j++) {
            if (Y = K + 0.3333333333333333 * -(j - 1), Y < 0) Y++;
            if (Y > 1) Y--;
            if (6 * Y < 1) A = w + (O - w) * 6 * Y;
            else if (2 * Y < 1) A = O;
            else if (3 * Y < 2) A = w + (O - w) * (0.6666666666666666 - Y) * 6;
            else A = w;
            $[j] = A * 255
        }
        return $
    };
    qK.hsl.hsv = function(q) {
        let K = q[0],
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = _,
            A = Math.max(z, 0.01);
        z *= 2, _ *= z <= 1 ? z : 2 - z, Y *= A <= 1 ? A : 2 - A;
        let O = (z + _) / 2,
            w = z === 0 ? 2 * Y / (A + Y) : 2 * _ / (z + _);
        return [K, w * 100, O * 100]
    };
    qK.hsv.rgb = function(q) {
        let K = q[0] / 60,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = Math.floor(K) % 6,
            A = K - Math.floor(K),
            O = 255 * z * (1 - _),
            w = 255 * z * (1 - _ * A),
            $ = 255 * z * (1 - _ * (1 - A));
        switch (z *= 255, Y) {
            case 0:
                return [z, $, O];
            case 1:
                return [w, z, O];
            case 2:
                return [O, z, $];
            case 3:
                return [O, w, z];
            case 4:
                return [$, O, z];
            case 5:
                return [z, O, w]
        }
    };
    qK.hsv.hsl = function(q) {
        let K = q[0],
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = Math.max(z, 0.01),
            A, O;
        O = (2 - _) * z;
        let w = (2 - _) * Y;
        return A = _ * Y, A /= w <= 1 ? w : 2 - w, A = A || 0, O /= 2, [K, A * 100, O * 100]
    };
    qK.hwb.rgb = function(q) {
        let K = q[0] / 360,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = _ + z,
            A;
        if (Y > 1) _ /= Y, z /= Y;
        let O = Math.floor(6 * K),
            w = 1 - z;
        if (A = 6 * K - O, (O & 1) !== 0) A = 1 - A;
        let $ = _ + A * (w - _),
            j, H, J;
        switch (O) {
            default:
            case 6:
            case 0: {
                j = w, H = $, J = _;
                break
            }
            case 1: {
                j = $, H = w, J = _;
                break
            }
            case 2: {
                j = _, H = w, J = $;
                break
            }
            case 3: {
                j = _, H = $, J = w;
                break
            }
            case 4: {
                j = $, H = _, J = w;
                break
            }
            case 5: {
                j = w, H = _, J = $;
                break
            }
        }
        return [j * 255, H * 255, J * 255]
    };
    qK.cmyk.rgb = function(q) {
        let K = q[0] / 100,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = q[3] / 100,
            A = 1 - Math.min(1, K * (1 - Y) + Y),
            O = 1 - Math.min(1, _ * (1 - Y) + Y),
            w = 1 - Math.min(1, z * (1 - Y) + Y);
        return [A * 255, O * 255, w * 255]
    };
    qK.xyz.rgb = function(q) {
        let K = q[0] / 100,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y, A, O;
        return Y = K * 3.2404542 + _ * -1.5371385 + z * -0.4985314, A = K * -0.969266 + _ * 1.8760108 + z * 0.041556, O = K * 0.0556434 + _ * -0.2040259 + z * 1.0572252, Y = PE6(Y), A = PE6(A), O = PE6(O), [Y * 255, A * 255, O * 255]
    };
    qK.xyz.lab = function(q) {
        let K = q[0],
            _ = q[1],
            z = q[2];
        K /= 95.047, _ /= 100, z /= 108.883, K = K > ta ? K ** 0.3333333333333333 : 7.787 * K + 0.13793103448275862, _ = _ > ta ? _ ** 0.3333333333333333 : 7.787 * _ + 0.13793103448275862, z = z > ta ? z ** 0.3333333333333333 : 7.787 * z + 0.13793103448275862;
        let Y = 116 * _ - 16,
            A = 500 * (K - _),
            O = 200 * (_ - z);
        return [Y, A, O]
    };
    qK.xyz.oklab = function(q) {
        let K = q[0] / 100,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = Math.cbrt(0.8189330101 * K + 0.3618667424 * _ - 0.1288597137 * z),
            A = Math.cbrt(0.0329845436 * K + 0.9293118715 * _ + 0.0361456387 * z),
            O = Math.cbrt(0.0482003018 * K + 0.2643662691 * _ + 0.633851707 * z),
            w = 0.2104542553 * Y + 0.793617785 * A - 0.0040720468 * O,
            $ = 1.9779984951 * Y - 2.428592205 * A + 0.4505937099 * O,
            j = 0.0259040371 * Y + 0.7827717662 * A - 0.808675766 * O;
        return [w * 100, $ * 100, j * 100]
    };
    qK.oklab.oklch = function(q) {
        return qK.lab.lch(q)
    };
    qK.oklab.xyz = function(q) {
        let K = q[0] / 100,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = (0.999999998 * K + 0.396337792 * _ + 0.215803758 * z) ** 3,
            A = (1.000000008 * K - 0.105561342 * _ - 0.063854175 * z) ** 3,
            O = (1.000000055 * K - 0.089484182 * _ - 1.291485538 * z) ** 3,
            w = 1.227013851 * Y - 0.55779998 * A + 0.281256149 * O,
            $ = -0.040580178 * Y + 1.11225687 * A - 0.071676679 * O,
            j = -0.076381285 * Y - 0.421481978 * A + 1.58616322 * O;
        return [w * 100, $ * 100, j * 100]
    };
    qK.oklab.rgb = function(q) {
        let K = q[0] / 100,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = (K + 0.3963377774 * _ + 0.2158037573 * z) ** 3,
            A = (K - 0.1055613458 * _ - 0.0638541728 * z) ** 3,
            O = (K - 0.0894841775 * _ - 1.291485548 * z) ** 3,
            w = PE6(4.0767416621 * Y - 3.3077115913 * A + 0.2309699292 * O),
            $ = PE6(-1.2684380046 * Y + 2.6097574011 * A - 0.3413193965 * O),
            j = PE6(-0.0041960863 * Y - 0.7034186147 * A + 1.707614701 * O);
        return [w * 255, $ * 255, j * 255]
    };
    qK.oklch.oklab = function(q) {
        return qK.lch.lab(q)
    };
    qK.lab.xyz = function(q) {
        let K = q[0],
            _ = q[1],
            z = q[2],
            Y, A, O;
        A = (K + 16) / 116, Y = _ / 500 + A, O = A - z / 200;
        let w = A ** 3,
            $ = Y ** 3,
            j = O ** 3;
        return A = w > ta ? w : (A - 0.13793103448275862) / 7.787, Y = $ > ta ? $ : (Y - 0.13793103448275862) / 7.787, O = j > ta ? j : (O - 0.13793103448275862) / 7.787, Y *= 95.047, A *= 100, O *= 108.883, [Y, A, O]
    };
    qK.lab.lch = function(q) {
        let K = q[0],
            _ = q[1],
            z = q[2],
            Y;
        if (Y = Math.atan2(z, _) * 360 / 2 / Math.PI, Y < 0) Y += 360;
        let O = Math.sqrt(_ * _ + z * z);
        return [K, O, Y]
    };
    qK.lch.lab = function(q) {
        let K = q[0],
            _ = q[1],
            Y = q[2] / 360 * 2 * Math.PI,
            A = _ * Math.cos(Y),
            O = _ * Math.sin(Y);
        return [K, A, O]
    };
    qK.rgb.ansi16 = function(q, K = null) {
        let [_, z, Y] = q, A = K === null ? qK.rgb.hsv(q)[2] : K;
        if (A = Math.round(A / 50), A === 0) return 30;
        let O = 30 + (Math.round(Y / 255) << 2 | Math.round(z / 255) << 1 | Math.round(_ / 255));
        if (A === 2) O += 60;
        return O
    };
    qK.hsv.ansi16 = function(q) {
        return qK.rgb.ansi16(qK.hsv.rgb(q), q[2])
    };
    qK.rgb.ansi256 = function(q) {
        let K = q[0],
            _ = q[1],
            z = q[2];
        if (K >> 4 === _ >> 4 && _ >> 4 === z >> 4) {
            if (K < 8) return 16;
            if (K > 248) return 231;
            return Math.round((K - 8) / 247 * 24) + 232
        }
        return 16 + 36 * Math.round(K / 255 * 5) + 6 * Math.round(_ / 255 * 5) + Math.round(z / 255 * 5)
    };
    qK.ansi16.rgb = function(q) {
        q = q[0];
        let K = q % 10;
        if (K === 0 || K === 7) {
            if (q > 50) K += 3.5;
            return K = K / 10.5 * 255, [K, K, K]
        }
        let _ = (Math.trunc(q > 50) + 1) * 0.5,
            z = (K & 1) * _ * 255,
            Y = (K >> 1 & 1) * _ * 255,
            A = (K >> 2 & 1) * _ * 255;
        return [z, Y, A]
    };
    qK.ansi256.rgb = function(q) {
        if (q = q[0], q >= 232) {
            let A = (q - 232) * 10 + 8;
            return [A, A, A]
        }
        q -= 16;
        let K, _ = Math.floor(q / 36) / 5 * 255,
            z = Math.floor((K = q % 36) / 6) / 5 * 255,
            Y = K % 6 / 5 * 255;
        return [_, z, Y]
    };
    qK.rgb.hex = function(q) {
        let _ = (((Math.round(q[0]) & 255) << 16) + ((Math.round(q[1]) & 255) << 8) + (Math.round(q[2]) & 255)).toString(16).toUpperCase();
        return "000000".slice(_.length) + _
    };
    qK.hex.rgb = function(q) {
        let K = q.toString(16).match(/[a-f\d]{6}|[a-f\d]{3}/i);
        if (!K) return [0, 0, 0];
        let _ = K[0];
        if (K[0].length === 3) _ = [..._].map((w) => w + w).join("");
        let z = Number.parseInt(_, 16),
            Y = z >> 16 & 255,
            A = z >> 8 & 255,
            O = z & 255;
        return [Y, A, O]
    };
    qK.rgb.hcg = function(q) {
        let K = q[0] / 255,
            _ = q[1] / 255,
            z = q[2] / 255,
            Y = Math.max(Math.max(K, _), z),
            A = Math.min(Math.min(K, _), z),
            O = Y - A,
            w, $ = O < 1 ? A / (1 - O) : 0;
        if (O <= 0) w = 0;
        else if (Y === K) w = (_ - z) / O % 6;
        else if (Y === _) w = 2 + (z - K) / O;
        else w = 4 + (K - _) / O;
        return w /= 6, w %= 1, [w * 360, O * 100, $ * 100]
    };
    qK.hsl.hcg = function(q) {
        let K = q[1] / 100,
            _ = q[2] / 100,
            z = _ < 0.5 ? 2 * K * _ : 2 * K * (1 - _),
            Y = 0;
        if (z < 1) Y = (_ - 0.5 * z) / (1 - z);
        return [q[0], z * 100, Y * 100]
    };
    qK.hsv.hcg = function(q) {
        let K = q[1] / 100,
            _ = q[2] / 100,
            z = K * _,
            Y = 0;
        if (z < 1) Y = (_ - z) / (1 - z);
        return [q[0], z * 100, Y * 100]
    };
    qK.hcg.rgb = function(q) {
        let K = q[0] / 360,
            _ = q[1] / 100,
            z = q[2] / 100;
        if (_ === 0) return [z * 255, z * 255, z * 255];
        let Y = [0, 0, 0],
            A = K % 1 * 6,
            O = A % 1,
            w = 1 - O,
            $ = 0;
        switch (Math.floor(A)) {
            case 0: {
                Y[0] = 1, Y[1] = O, Y[2] = 0;
                break
            }
            case 1: {
                Y[0] = w, Y[1] = 1, Y[2] = 0;
                break
            }
            case 2: {
                Y[0] = 0, Y[1] = 1, Y[2] = O;
                break
            }
            case 3: {
                Y[0] = 0, Y[1] = w, Y[2] = 1;
                break
            }
            case 4: {
                Y[0] = O, Y[1] = 0, Y[2] = 1;
                break
            }
            default:
                Y[0] = 1, Y[1] = 0, Y[2] = w
        }
        return $ = (1 - _) * z, [(_ * Y[0] + $) * 255, (_ * Y[1] + $) * 255, (_ * Y[2] + $) * 255]
    };
    qK.hcg.hsv = function(q) {
        let K = q[1] / 100,
            _ = q[2] / 100,
            z = K + _ * (1 - K),
            Y = 0;
        if (z > 0) Y = K / z;
        return [q[0], Y * 100, z * 100]
    };
    qK.hcg.hsl = function(q) {
        let K = q[1] / 100,
            z = q[2] / 100 * (1 - K) + 0.5 * K,
            Y = 0;
        if (z > 0 && z < 0.5) Y = K / (2 * z);
        else if (z >= 0.5 && z < 1) Y = K / (2 * (1 - z));
        return [q[0], Y * 100, z * 100]
    };
    qK.hcg.hwb = function(q) {
        let K = q[1] / 100,
            _ = q[2] / 100,
            z = K + _ * (1 - K);
        return [q[0], (z - K) * 100, (1 - z) * 100]
    };
    qK.hwb.hcg = function(q) {
        let K = q[1] / 100,
            z = 1 - q[2] / 100,
            Y = z - K,
            A = 0;
        if (Y < 1) A = (z - Y) / (1 - Y);
        return [q[0], Y * 100, A * 100]
    };
    qK.apple.rgb = function(q) {
        return [q[0] / 65535 * 255, q[1] / 65535 * 255, q[2] / 65535 * 255]
    };
    qK.rgb.apple = function(q) {
        return [q[0] / 255 * 65535, q[1] / 255 * 65535, q[2] / 255 * 65535]
    };
    qK.gray.rgb = function(q) {
        return [q[0] / 100 * 255, q[0] / 100 * 255, q[0] / 100 * 255]
    };
    qK.gray.hsl = function(q) {
        return [0, 0, q[0]]
    };
    qK.gray.hsv = qK.gray.hsl;
    qK.gray.hwb = function(q) {
        return [0, 100, q[0]]
    };
    qK.gray.cmyk = function(q) {
        return [0, 0, 0, q[0]]
    };
    qK.gray.lab = function(q) {
        return [q[0], 0, 0]
    };
    qK.gray.hex = function(q) {
        let K = Math.round(q[0] / 100 * 255) & 255,
            z = ((K << 16) + (K << 8) + K).toString(16).toUpperCase();
        return "000000".slice(z.length) + z
    };
    qK.rgb.gray = function(q) {
        return [(q[0] + q[1] + q[2]) / 3 / 255 * 100]
    };

    function gg_() {
        let q = {},
            K = Object.keys(n$6);
        for (let {
                length: _
            } = K, z = 0; z < _; z++) q[K[z]] = {
            distance: -1,
            parent: null
        };
        return q
    }

    function Ug_(q) {
        let K = gg_(),
            _ = [q];
        K[q].distance = 0;
        while (_.length > 0) {
            let z = _.pop(),
                Y = Object.keys(n$6[z]);
            for (let {
                    length: A
                } = Y, O = 0; O < A; O++) {
                let w = Y[O],
                    $ = K[w];
                if ($.distance === -1) $.distance = K[z].distance + 1, $.parent = z, _.unshift(w)
            }
        }
        return K
    }

    function Qg_(q, K) {
        return function(_) {
            return K(q(_))
        }
    }

    function dg_(q, K) {
        let _ = [K[q].parent, q],
            z = n$6[K[q].parent][q],
            Y = K[q].parent;
        while (K[Y].parent) _.unshift(K[Y].parent), z = Qg_(n$6[K[Y].parent][Y], z), Y = K[Y].parent;
        return z.conversion = _, z
    }

    function cg_(q) {
        let K = Ug_(q),
            _ = {},
            z = Object.keys(K);
        for (let {
                length: Y
            } = z, A = 0; A < Y; A++) {
            let O = z[A];
            if (K[O].parent === null) continue;
            _[O] = dg_(O, K)
        }
        return _
    }
    var lg_ = cg_,
        ME6 = {},
        ng_ = Object.keys(n$6);

    function ig_(q) {
        let K = function(..._) {
            let z = _[0];
            if (z === void 0 || z === null) return z;
            if (z.length > 1) _ = z;
            return q(_)
        };
        if ("conversion" in q) K.conversion = q.conversion;
        return K
    }

    function rg_(q) {
        let K = function(..._) {
            let z = _[0];
            if (z === void 0 || z === null) return z;
            if (z.length > 1) _ = z;
            let Y = q(_);
            if (typeof Y === "object")
                for (let {
                        length: A
                    } = Y, O = 0; O < A; O++) Y[O] = Math.round(Y[O]);
            return Y
        };
        if ("conversion" in q) K.conversion = q.conversion;
        return K
    }
    for (let q of ng_) {
        ME6[q] = {}, Object.defineProperty(ME6[q], "channels", {
            value: n$6[q].channels
        }), Object.defineProperty(ME6[q], "labels", {
            value: n$6[q].labels
        });
        let K = lg_(q),
            _ = Object.keys(K);
        for (let z of _) {
            let Y = K[z];
            ME6[q][z] = rg_(Y), ME6[q][z].raw = ig_(Y)
        }
    }
    var DR = ME6,
        K24 = ["keyword", "gray", "hex"],
        Sm1 = {};
    for (let q of Object.keys(DR)) Sm1[[...DR[q].labels].sort().join("")] = q;
    var Cm1 = {};

    function GD(q, K) {
        if (!(this instanceof GD)) return new GD(q, K);
        if (K && K in K24) K = null;
        if (K && !(K in DR)) throw Error("Unknown model: " + K);
        let _, z;
        if (q == null) this.model = "rgb", this.color = [0, 0, 0], this.valpha = 1;
        else if (q instanceof GD) this.model = q.model, this.color = [...q.color], this.valpha = q.valpha;
        else if (typeof q === "string") {
            let Y = XE6.get(q);
            if (Y === null) throw Error("Unable to parse color from string: " + q);
            this.model = Y.model, z = DR[this.model].channels, this.color = Y.value.slice(0, z), this.valpha = typeof Y.value[z] === "number" ? Y.value[z] : 1
        } else if (q.length > 0) {
            this.model = K || "rgb", z = DR[this.model].channels;
            let Y = Array.prototype.slice.call(q, 0, z);
            this.color = bm1(Y, z), this.valpha = typeof q[z] === "number" ? q[z] : 1
        } else if (typeof q === "number") this.model = "rgb", this.color = [q >> 16 & 255, q >> 8 & 255, q & 255], this.valpha = 1;
        else {
            this.valpha = 1;
            let Y = Object.keys(q);
            if ("alpha" in q) Y.splice(Y.indexOf("alpha"), 1), this.valpha = typeof q.alpha === "number" ? q.alpha : 0;
            let A = Y.sort().join("");
            if (!(A in Sm1)) throw Error("Unable to parse color from object: " + JSON.stringify(q));
            this.model = Sm1[A];
            let {
                labels: O
            } = DR[this.model], w = [];
            for (_ = 0; _ < O.length; _++) w.push(q[O[_]]);
            this.color = bm1(w)
        }
        if (Cm1[this.model]) {
            z = DR[this.model].channels;
            for (_ = 0; _ < z; _++) {
                let Y = Cm1[this.model][_];
                if (Y) this.color[_] = Y(this.color[_])
            }
        }
        if (this.valpha = Math.max(0, Math.min(1, this.valpha)), Object.freeze) Object.freeze(this)
    }
    GD.prototype = {
        toString() {
            return this.string()
        },
        toJSON() {
            return this[this.model]()
        },
        string(q) {
            let K = this.model in XE6.to ? this : this.rgb();
            K = K.round(typeof q === "number" ? q : 1);
            let _ = K.valpha === 1 ? K.color : [...K.color, this.valpha];
            return XE6.to[K.model](..._)
        },
        percentString(q) {
            let K = this.rgb().round(typeof q === "number" ? q : 1),
                _ = K.valpha === 1 ? K.color : [...K.color, this.valpha];
            return XE6.to.rgb.percent(..._)
        },
        array() {
            return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha]
        },
        object() {
            let q = {},
                {
                    channels: K
                } = DR[this.model],
                {
                    labels: _
                } = DR[this.model];
            for (let z = 0; z < K; z++) q[_[z]] = this.color[z];
            if (this.valpha !== 1) q.alpha = this.valpha;
            return q
        },
        unitArray() {
            let q = this.rgb().color;
            if (q[0] /= 255, q[1] /= 255, q[2] /= 255, this.valpha !== 1) q.push(this.valpha);
            return q
        },
        unitObject() {
            let q = this.rgb().object();
            if (q.r /= 255, q.g /= 255, q.b /= 255, this.valpha !== 1) q.alpha = this.valpha;
            return q
        },
        round(q) {
            return q = Math.max(q || 0, 0), new GD([...this.color.map(ag_(q)), this.valpha], this.model)
        },
        alpha(q) {
            if (q !== void 0) return new GD([...this.color, Math.max(0, Math.min(1, q))], this.model);
            return this.valpha
        },
        red: JX("rgb", 0, dW(255)),
        green: JX("rgb", 1, dW(255)),
        blue: JX("rgb", 2, dW(255)),
        hue: JX(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (q) => (q % 360 + 360) % 360),
        saturationl: JX("hsl", 1, dW(100)),
        lightness: JX("hsl", 2, dW(100)),
        saturationv: JX("hsv", 1, dW(100)),
        value: JX("hsv", 2, dW(100)),
        chroma: JX("hcg", 1, dW(100)),
        gray: JX("hcg", 2, dW(100)),
        white: JX("hwb", 1, dW(100)),
        wblack: JX("hwb", 2, dW(100)),
        cyan: JX("cmyk", 0, dW(100)),
        magenta: JX("cmyk", 1, dW(100)),
        yellow: JX("cmyk", 2, dW(100)),
        black: JX("cmyk", 3, dW(100)),
        x: JX("xyz", 0, dW(95.047)),
        y: JX("xyz", 1, dW(100)),
        z: JX("xyz", 2, dW(108.833)),
        l: JX("lab", 0, dW(100)),
        a: JX("lab", 1),
        b: JX("lab", 2),
        keyword(q) {
            if (q !== void 0) return new GD(q);
            return DR[this.model].keyword(this.color)
        },
        hex(q) {
            if (q !== void 0) return new GD(q);
            return XE6.to.hex(...this.rgb().round().color)
        },
        hexa(q) {
            if (q !== void 0) return new GD(q);
            let K = this.rgb().round().color,
                _ = Math.round(this.valpha * 255).toString(16).toUpperCase();
            if (_.length === 1) _ = "0" + _;
            return XE6.to.hex(...K) + _
        },
        rgbNumber() {
            let q = this.rgb().color;
            return (q[0] & 255) << 16 | (q[1] & 255) << 8 | q[2] & 255
        },
        luminosity() {
            let q = this.rgb().color,
                K = [];
            for (let [_, z] of q.entries()) {
                let Y = z / 255;
                K[_] = Y <= 0.04045 ? Y / 12.92 : ((Y + 0.055) / 1.055) ** 2.4
            }
            return 0.2126 * K[0] + 0.7152 * K[1] + 0.0722 * K[2]
        },
        contrast(q) {
            let K = this.luminosity(),
                _ = q.luminosity();
            if (K > _) return (K + 0.05) / (_ + 0.05);
            return (_ + 0.05) / (K + 0.05)
        },
        level(q) {
            let K = this.contrast(q);
            if (K >= 7) return "AAA";
            return K >= 4.5 ? "AA" : ""
        },
        isDark() {
            let q = this.rgb().color;
            return (q[0] * 2126 + q[1] * 7152 + q[2] * 722) / 1e4 < 128
        },
        isLight() {
            return !this.isDark()
        },
        negate() {
            let q = this.rgb();
            for (let K = 0; K < 3; K++) q.color[K] = 255 - q.color[K];
            return q
        },
        lighten(q) {
            let K = this.hsl();
            return K.color[2] += K.color[2] * q, K
        },
        darken(q) {
            let K = this.hsl();
            return K.color[2] -= K.color[2] * q, K
        },
        saturate(q) {
            let K = this.hsl();
            return K.color[1] += K.color[1] * q, K
        },
        desaturate(q) {
            let K = this.hsl();
            return K.color[1] -= K.color[1] * q, K
        },
        whiten(q) {
            let K = this.hwb();
            return K.color[1] += K.color[1] * q, K
        },
        blacken(q) {
            let K = this.hwb();
            return K.color[2] += K.color[2] * q, K
        },
        grayscale() {
            let q = this.rgb().color,
                K = q[0] * 0.3 + q[1] * 0.59 + q[2] * 0.11;
            return GD.rgb(K, K, K)
        },
        fade(q) {
            return this.alpha(this.valpha - this.valpha * q)
        },
        opaquer(q) {
            return this.alpha(this.valpha + this.valpha * q)
        },
        rotate(q) {
            let K = this.hsl(),
                _ = K.color[0];
            return _ = (_ + q) % 360, _ = _ < 0 ? 360 + _ : _, K.color[0] = _, K
        },
        mix(q, K) {
            if (!q || !q.rgb) throw Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof q);
            let _ = q.rgb(),
                z = this.rgb(),
                Y = K === void 0 ? 0.5 : K,
                A = 2 * Y - 1,
                O = _.alpha() - z.alpha(),
                w = ((A * O === -1 ? A : (A + O) / (1 + A * O)) + 1) / 2,
                $ = 1 - w;
            return GD.rgb(w * _.red() + $ * z.red(), w * _.green() + $ * z.green(), w * _.blue() + $ * z.blue(), _.alpha() * Y + z.alpha() * (1 - Y))
        }
    };
    for (let q of Object.keys(DR)) {
        if (K24.includes(q)) continue;
        let {
            channels: K
        } = DR[q];
        GD.prototype[q] = function(..._) {
            if (this.model === q) return new GD(this);
            if (_.length > 0) return new GD(_, q);
            return new GD([...sg_(DR[this.model][q].raw(this.color)), this.valpha], q)
        }, GD[q] = function(..._) {
            let z = _[0];
            if (typeof z === "number") z = bm1(_, K);
            return new GD(z, q)
        }
    }

    function og_(q, K) {
        return Number(q.toFixed(K))
    }

    function ag_(q) {
        return function(K) {
            return og_(K, q)
        }
    }

    function JX(q, K, _) {
        q = Array.isArray(q) ? q : [q];
        for (let z of q)(Cm1[z] ||= [])[K] = _;
        return q = q[0],
            function(z) {
                let Y;
                if (z !== void 0) {
                    if (_) z = _(z);
                    return Y = this[q](), Y.color[K] = z, Y
                }
                if (Y = this[q]().color[K], _) Y = _(Y);
                return Y
            }
    }

    function dW(q) {
        return function(K) {
            return Math.max(0, Math.min(q, K))
        }
    }

    function sg_(q) {
        return Array.isArray(q) ? q : [q]
    }

    function bm1(q, K) {
        for (let _ = 0; _ < K; _++)
            if (typeof q[_] !== "number") q[_] = 0;
        return q
    }
    var tg_ = GD
})
// @from(Ln 195612, Col 4)
A24 = p((fzw, Y24) => {
    Y24.exports = z24().default
})
// @from(Ln 195615, Col 4)
j24 = p((Gzw, $24) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var eg_ = A24(),
        ea = Ld(),
        O24 = {
            multiband: "multiband",
            "b-w": "b-w",
            bw: "b-w",
            cmyk: "cmyk",
            srgb: "srgb"
        };

    function qU_(q) {
        return this._setBackgroundColourOption("tint", q), this
    }

    function KU_(q) {
        return this.options.greyscale = ea.bool(q) ? q : !0, this
    }

    function _U_(q) {
        return this.greyscale(q)
    }

    function zU_(q) {
        if (!ea.string(q)) throw ea.invalidParameterError("colourspace", "string", q);
        return this.options.colourspacePipeline = q, this
    }

    function YU_(q) {
        return this.pipelineColourspace(q)
    }

    function AU_(q) {
        if (!ea.string(q)) throw ea.invalidParameterError("colourspace", "string", q);
        return this.options.colourspace = q, this
    }

    function OU_(q) {
        return this.toColourspace(q)
    }

    function w24(q) {
        if (ea.object(q) || ea.string(q) && q.length >= 3 && q.length <= 200) {
            let K = eg_(q);
            return [K.red(), K.green(), K.blue(), Math.round(K.alpha() * 255)]
        } else throw ea.invalidParameterError("background", "object or string", q)
    }

    function wU_(q, K) {
        if (ea.defined(K)) this.options[q] = w24(K)
    }
    $24.exports = (q) => {
        Object.assign(q.prototype, {
            tint: qU_,
            greyscale: KU_,
            grayscale: _U_,
            pipelineColourspace: zU_,
            pipelineColorspace: YU_,
            toColourspace: AU_,
            toColorspace: OU_,
            _getBackgroundColourOption: w24,
            _setBackgroundColourOption: wU_
        }), q.colourspace = O24, q.colorspace = O24
    }
})
// @from(Ln 195684, Col 4)
J24 = p((vzw, H24) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var Id = Ld(),
        $U_ = {
            and: "and",
            or: "or",
            eor: "eor"
        };

    function jU_() {
        return this.options.removeAlpha = !0, this
    }

    function HU_(q) {
        if (Id.defined(q))
            if (Id.number(q) && Id.inRange(q, 0, 1)) this.options.ensureAlpha = q;
            else throw Id.invalidParameterError("alpha", "number between 0 and 1", q);
        else this.options.ensureAlpha = 1;
        return this
    }

    function JU_(q) {
        let K = {
            red: 0,
            green: 1,
            blue: 2,
            alpha: 3
        };
        if (Object.keys(K).includes(q)) q = K[q];
        if (Id.integer(q) && Id.inRange(q, 0, 4)) this.options.extractChannel = q;
        else throw Id.invalidParameterError("channel", "integer or one of: red, green, blue, alpha", q);
        return this
    }

    function XU_(q, K) {
        if (Array.isArray(q)) q.forEach(function(_) {
            this.options.joinChannelIn.push(this._createInputDescriptor(_, K))
        }, this);
        else this.options.joinChannelIn.push(this._createInputDescriptor(q, K));
        return this
    }

    function MU_(q) {
        if (Id.string(q) && Id.inArray(q, ["and", "or", "eor"])) this.options.bandBoolOp = q;
        else throw Id.invalidParameterError("boolOp", "one of: and, or, eor", q);
        return this
    }
    H24.exports = (q) => {
        Object.assign(q.prototype, {
            removeAlpha: jU_,
            ensureAlpha: HU_,
            extractChannel: JU_,
            joinChannel: XU_,
            bandbool: MU_
        }), q.bool = $U_
    }
})
// @from(Ln 195744, Col 4)
D24 = p((Tzw, W24) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var xm1 = d6("node:path"),
        S8 = Ld(),
        DE6 = Ns6(),
        X24 = new Map([
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
        PU_ = /\.(jp[2x]|j2[kc])$/i,
        M24 = () => Error("JP2 output requires libvips with support for OpenJPEG"),
        P24 = (q) => 1 << 31 - Math.clz32(Math.ceil(Math.log2(q)));

    function WU_(q, K) {
        let _;
        if (!S8.string(q)) _ = Error("Missing output file path");
        else if (S8.string(this.options.input.file) && xm1.resolve(this.options.input.file) === xm1.resolve(q)) _ = Error("Cannot use same file for input and output");
        else if (PU_.test(xm1.extname(q)) && !this.constructor.format.jp2k.output.file) _ = M24();
        if (_)
            if (S8.fn(K)) K(_);
            else return Promise.reject(_);
        else {
            this.options.fileOut = q;
            let z = Error();
            return this._pipeline(K, z)
        }
        return this
    }

    function DU_(q, K) {
        if (S8.object(q)) this._setBooleanOption("resolveWithObject", q.resolveWithObject);
        else if (this.options.resolveWithObject) this.options.resolveWithObject = !1;
        this.options.fileOut = "";
        let _ = Error();
        return this._pipeline(S8.fn(q) ? q : K, _)
    }

    function ZU_() {
        return this.options.keepMetadata |= 1, this
    }

    function fU_(q) {
        if (S8.object(q))
            for (let [K, _] of Object.entries(q))
                if (S8.object(_))
                    for (let [z, Y] of Object.entries(_))
                        if (S8.string(Y)) this.options.withExif[`exif-${K.toLowerCase()}-${z}`] = Y;
                        else throw S8.invalidParameterError(`${K}.${z}`, "string", Y);
        else throw S8.invalidParameterError(K, "object", _);
        else throw S8.invalidParameterError("exif", "object", q);
        return this.options.withExifMerge = !1, this.keepExif()
    }

    function GU_(q) {
        return this.withExif(q), this.options.withExifMerge = !0, this
    }

    function vU_() {
        return this.options.keepMetadata |= 8, this
    }

    function TU_(q, K) {
        if (S8.string(q)) this.options.withIccProfile = q;
        else throw S8.invalidParameterError("icc", "string", q);
        if (this.keepIccProfile(), S8.object(K)) {
            if (S8.defined(K.attach))
                if (S8.bool(K.attach)) {
                    if (!K.attach) this.options.keepMetadata &= -9
                } else throw S8.invalidParameterError("attach", "boolean", K.attach)
        }
        return this
    }

    function VU_() {
        return this.options.keepMetadata |= 2, this
    }

    function kU_(q) {
        if (S8.string(q) && q.length > 0) this.options.withXmp = q, this.options.keepMetadata |= 2;
        else throw S8.invalidParameterError("xmp", "non-empty string", q);
        return this
    }

    function NU_() {
        return this.options.keepMetadata = 31, this
    }

    function EU_(q) {
        if (this.keepMetadata(), this.withIccProfile("srgb"), S8.object(q)) {
            if (S8.defined(q.orientation))
                if (S8.integer(q.orientation) && S8.inRange(q.orientation, 1, 8)) this.options.withMetadataOrientation = q.orientation;
                else throw S8.invalidParameterError("orientation", "integer between 1 and 8", q.orientation);
            if (S8.defined(q.density))
                if (S8.number(q.density) && q.density > 0) this.options.withMetadataDensity = q.density;
                else throw S8.invalidParameterError("density", "positive number", q.density);
            if (S8.defined(q.icc)) this.withIccProfile(q.icc);
            if (S8.defined(q.exif)) this.withExifMerge(q.exif)
        }
        return this
    }

    function yU_(q, K) {
        let _ = X24.get((S8.object(q) && S8.string(q.id) ? q.id : q).toLowerCase());
        if (!_) throw S8.invalidParameterError("format", `one of: ${[...X24.keys()].join(", ")}`, q);
        return this[_](K)
    }

    function LU_(q) {
        if (S8.object(q)) {
            if (S8.defined(q.quality))
                if (S8.integer(q.quality) && S8.inRange(q.quality, 1, 100)) this.options.jpegQuality = q.quality;
                else throw S8.invalidParameterError("quality", "integer between 1 and 100", q.quality);
            if (S8.defined(q.progressive)) this._setBooleanOption("jpegProgressive", q.progressive);
            if (S8.defined(q.chromaSubsampling))
                if (S8.string(q.chromaSubsampling) && S8.inArray(q.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.jpegChromaSubsampling = q.chromaSubsampling;
                else throw S8.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", q.chromaSubsampling);
            let K = S8.bool(q.optimizeCoding) ? q.optimizeCoding : q.optimiseCoding;
            if (S8.defined(K)) this._setBooleanOption("jpegOptimiseCoding", K);
            if (S8.defined(q.mozjpeg))
                if (S8.bool(q.mozjpeg)) {
                    if (q.mozjpeg) this.options.jpegTrellisQuantisation = !0, this.options.jpegOvershootDeringing = !0, this.options.jpegOptimiseScans = !0, this.options.jpegProgressive = !0, this.options.jpegQuantisationTable = 3
                } else throw S8.invalidParameterError("mozjpeg", "boolean", q.mozjpeg);
            let _ = S8.bool(q.trellisQuantization) ? q.trellisQuantization : q.trellisQuantisation;
            if (S8.defined(_)) this._setBooleanOption("jpegTrellisQuantisation", _);
            if (S8.defined(q.overshootDeringing)) this._setBooleanOption("jpegOvershootDeringing", q.overshootDeringing);
            let z = S8.bool(q.optimizeScans) ? q.optimizeScans : q.optimiseScans;
            if (S8.defined(z)) {
                if (this._setBooleanOption("jpegOptimiseScans", z), z) this.options.jpegProgressive = !0
            }
            let Y = S8.number(q.quantizationTable) ? q.quantizationTable : q.quantisationTable;
            if (S8.defined(Y))
                if (S8.integer(Y) && S8.inRange(Y, 0, 8)) this.options.jpegQuantisationTable = Y;
                else throw S8.invalidParameterError("quantisationTable", "integer between 0 and 8", Y)
        }
        return this._updateFormatOut("jpeg", q)
    }

    function hU_(q) {
        if (S8.object(q)) {
            if (S8.defined(q.progressive)) this._setBooleanOption("pngProgressive", q.progressive);
            if (S8.defined(q.compressionLevel))
                if (S8.integer(q.compressionLevel) && S8.inRange(q.compressionLevel, 0, 9)) this.options.pngCompressionLevel = q.compressionLevel;
                else throw S8.invalidParameterError("compressionLevel", "integer between 0 and 9", q.compressionLevel);
            if (S8.defined(q.adaptiveFiltering)) this._setBooleanOption("pngAdaptiveFiltering", q.adaptiveFiltering);
            let K = q.colours || q.colors;
            if (S8.defined(K))
                if (S8.integer(K) && S8.inRange(K, 2, 256)) this.options.pngBitdepth = P24(K);
                else throw S8.invalidParameterError("colours", "integer between 2 and 256", K);
            if (S8.defined(q.palette)) this._setBooleanOption("pngPalette", q.palette);
            else if ([q.quality, q.effort, q.colours, q.colors, q.dither].some(S8.defined)) this._setBooleanOption("pngPalette", !0);
            if (this.options.pngPalette) {
                if (S8.defined(q.quality))
                    if (S8.integer(q.quality) && S8.inRange(q.quality, 0, 100)) this.options.pngQuality = q.quality;
                    else throw S8.invalidParameterError("quality", "integer between 0 and 100", q.quality);
                if (S8.defined(q.effort))
                    if (S8.integer(q.effort) && S8.inRange(q.effort, 1, 10)) this.options.pngEffort = q.effort;
                    else throw S8.invalidParameterError("effort", "integer between 1 and 10", q.effort);
                if (S8.defined(q.dither))
                    if (S8.number(q.dither) && S8.inRange(q.dither, 0, 1)) this.options.pngDither = q.dither;
                    else throw S8.invalidParameterError("dither", "number between 0.0 and 1.0", q.dither)
            }
        }
        return this._updateFormatOut("png", q)
    }

    function RU_(q) {
        if (S8.object(q)) {
            if (S8.defined(q.quality))
                if (S8.integer(q.quality) && S8.inRange(q.quality, 1, 100)) this.options.webpQuality = q.quality;
                else throw S8.invalidParameterError("quality", "integer between 1 and 100", q.quality);
            if (S8.defined(q.alphaQuality))
                if (S8.integer(q.alphaQuality) && S8.inRange(q.alphaQuality, 0, 100)) this.options.webpAlphaQuality = q.alphaQuality;
                else throw S8.invalidParameterError("alphaQuality", "integer between 0 and 100", q.alphaQuality);
            if (S8.defined(q.lossless)) this._setBooleanOption("webpLossless", q.lossless);
            if (S8.defined(q.nearLossless)) this._setBooleanOption("webpNearLossless", q.nearLossless);
            if (S8.defined(q.smartSubsample)) this._setBooleanOption("webpSmartSubsample", q.smartSubsample);
            if (S8.defined(q.smartDeblock)) this._setBooleanOption("webpSmartDeblock", q.smartDeblock);
            if (S8.defined(q.preset))
                if (S8.string(q.preset) && S8.inArray(q.preset, ["default", "photo", "picture", "drawing", "icon", "text"])) this.options.webpPreset = q.preset;
                else throw S8.invalidParameterError("preset", "one of: default, photo, picture, drawing, icon, text", q.preset);
            if (S8.defined(q.effort))
                if (S8.integer(q.effort) && S8.inRange(q.effort, 0, 6)) this.options.webpEffort = q.effort;
                else throw S8.invalidParameterError("effort", "integer between 0 and 6", q.effort);
            if (S8.defined(q.minSize)) this._setBooleanOption("webpMinSize", q.minSize);
            if (S8.defined(q.mixed)) this._setBooleanOption("webpMixed", q.mixed)
        }
        return um1(q, this.options), this._updateFormatOut("webp", q)
    }

    function SU_(q) {
        if (S8.object(q)) {
            if (S8.defined(q.reuse)) this._setBooleanOption("gifReuse", q.reuse);
            if (S8.defined(q.progressive)) this._setBooleanOption("gifProgressive", q.progressive);
            let K = q.colours || q.colors;
            if (S8.defined(K))
                if (S8.integer(K) && S8.inRange(K, 2, 256)) this.options.gifBitdepth = P24(K);
                else throw S8.invalidParameterError("colours", "integer between 2 and 256", K);
            if (S8.defined(q.effort))
                if (S8.number(q.effort) && S8.inRange(q.effort, 1, 10)) this.options.gifEffort = q.effort;
                else throw S8.invalidParameterError("effort", "integer between 1 and 10", q.effort);
            if (S8.defined(q.dither))
                if (S8.number(q.dither) && S8.inRange(q.dither, 0, 1)) this.options.gifDither = q.dither;
                else throw S8.invalidParameterError("dither", "number between 0.0 and 1.0", q.dither);
            if (S8.defined(q.interFrameMaxError))
                if (S8.number(q.interFrameMaxError) && S8.inRange(q.interFrameMaxError, 0, 32)) this.options.gifInterFrameMaxError = q.interFrameMaxError;
                else throw S8.invalidParameterError("interFrameMaxError", "number between 0.0 and 32.0", q.interFrameMaxError);
            if (S8.defined(q.interPaletteMaxError))
                if (S8.number(q.interPaletteMaxError) && S8.inRange(q.interPaletteMaxError, 0, 256)) this.options.gifInterPaletteMaxError = q.interPaletteMaxError;
                else throw S8.invalidParameterError("interPaletteMaxError", "number between 0.0 and 256.0", q.interPaletteMaxError);
            if (S8.defined(q.keepDuplicateFrames))
                if (S8.bool(q.keepDuplicateFrames)) this._setBooleanOption("gifKeepDuplicateFrames", q.keepDuplicateFrames);
                else throw S8.invalidParameterError("keepDuplicateFrames", "boolean", q.keepDuplicateFrames)
        }
        return um1(q, this.options), this._updateFormatOut("gif", q)
    }

    function CU_(q) {
        if (!this.constructor.format.jp2k.output.buffer) throw M24();
        if (S8.object(q)) {
            if (S8.defined(q.quality))
                if (S8.integer(q.quality) && S8.inRange(q.quality, 1, 100)) this.options.jp2Quality = q.quality;
                else throw S8.invalidParameterError("quality", "integer between 1 and 100", q.quality);
            if (S8.defined(q.lossless))
                if (S8.bool(q.lossless)) this.options.jp2Lossless = q.lossless;
                else throw S8.invalidParameterError("lossless", "boolean", q.lossless);
            if (S8.defined(q.tileWidth))
                if (S8.integer(q.tileWidth) && S8.inRange(q.tileWidth, 1, 32768)) this.options.jp2TileWidth = q.tileWidth;
                else throw S8.invalidParameterError("tileWidth", "integer between 1 and 32768", q.tileWidth);
            if (S8.defined(q.tileHeight))
                if (S8.integer(q.tileHeight) && S8.inRange(q.tileHeight, 1, 32768)) this.options.jp2TileHeight = q.tileHeight;
                else throw S8.invalidParameterError("tileHeight", "integer between 1 and 32768", q.tileHeight);
            if (S8.defined(q.chromaSubsampling))
                if (S8.string(q.chromaSubsampling) && S8.inArray(q.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.jp2ChromaSubsampling = q.chromaSubsampling;
                else throw S8.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", q.chromaSubsampling)
        }
        return this._updateFormatOut("jp2", q)
    }

    function um1(q, K) {
        if (S8.object(q) && S8.defined(q.loop))
            if (S8.integer(q.loop) && S8.inRange(q.loop, 0, 65535)) K.loop = q.loop;
            else throw S8.invalidParameterError("loop", "integer between 0 and 65535", q.loop);
        if (S8.object(q) && S8.defined(q.delay))
            if (S8.integer(q.delay) && S8.inRange(q.delay, 0, 65535)) K.delay = [q.delay];
            else if (Array.isArray(q.delay) && q.delay.every(S8.integer) && q.delay.every((_) => S8.inRange(_, 0, 65535))) K.delay = q.delay;
        else throw S8.invalidParameterError("delay", "integer or an array of integers between 0 and 65535", q.delay)
    }

    function bU_(q) {
        if (S8.object(q)) {
            if (S8.defined(q.quality))
                if (S8.integer(q.quality) && S8.inRange(q.quality, 1, 100)) this.options.tiffQuality = q.quality;
                else throw S8.invalidParameterError("quality", "integer between 1 and 100", q.quality);
            if (S8.defined(q.bitdepth))
                if (S8.integer(q.bitdepth) && S8.inArray(q.bitdepth, [1, 2, 4, 8])) this.options.tiffBitdepth = q.bitdepth;
                else throw S8.invalidParameterError("bitdepth", "1, 2, 4 or 8", q.bitdepth);
            if (S8.defined(q.tile)) this._setBooleanOption("tiffTile", q.tile);
            if (S8.defined(q.tileWidth))
                if (S8.integer(q.tileWidth) && q.tileWidth > 0) this.options.tiffTileWidth = q.tileWidth;
                else throw S8.invalidParameterError("tileWidth", "integer greater than zero", q.tileWidth);
            if (S8.defined(q.tileHeight))
                if (S8.integer(q.tileHeight) && q.tileHeight > 0) this.options.tiffTileHeight = q.tileHeight;
                else throw S8.invalidParameterError("tileHeight", "integer greater than zero", q.tileHeight);
            if (S8.defined(q.miniswhite)) this._setBooleanOption("tiffMiniswhite", q.miniswhite);
            if (S8.defined(q.pyramid)) this._setBooleanOption("tiffPyramid", q.pyramid);
            if (S8.defined(q.xres))
                if (S8.number(q.xres) && q.xres > 0) this.options.tiffXres = q.xres;
                else throw S8.invalidParameterError("xres", "number greater than zero", q.xres);
            if (S8.defined(q.yres))
                if (S8.number(q.yres) && q.yres > 0) this.options.tiffYres = q.yres;
                else throw S8.invalidParameterError("yres", "number greater than zero", q.yres);
            if (S8.defined(q.compression))
                if (S8.string(q.compression) && S8.inArray(q.compression, ["none", "jpeg", "deflate", "packbits", "ccittfax4", "lzw", "webp", "zstd", "jp2k"])) this.options.tiffCompression = q.compression;
                else throw S8.invalidParameterError("compression", "one of: none, jpeg, deflate, packbits, ccittfax4, lzw, webp, zstd, jp2k", q.compression);
            if (S8.defined(q.bigtiff)) this._setBooleanOption("tiffBigtiff", q.bigtiff);
            if (S8.defined(q.predictor))
                if (S8.string(q.predictor) && S8.inArray(q.predictor, ["none", "horizontal", "float"])) this.options.tiffPredictor = q.predictor;
                else throw S8.invalidParameterError("predictor", "one of: none, horizontal, float", q.predictor);
            if (S8.defined(q.resolutionUnit))
                if (S8.string(q.resolutionUnit) && S8.inArray(q.resolutionUnit, ["inch", "cm"])) this.options.tiffResolutionUnit = q.resolutionUnit;
                else throw S8.invalidParameterError("resolutionUnit", "one of: inch, cm", q.resolutionUnit)
        }
        return this._updateFormatOut("tiff", q)
    }

    function IU_(q) {
        return this.heif({
            ...q,
            compression: "av1"
        })
    }

    function xU_(q) {
        if (S8.object(q)) {
            if (S8.string(q.compression) && S8.inArray(q.compression, ["av1", "hevc"])) this.options.heifCompression = q.compression;
            else throw S8.invalidParameterError("compression", "one of: av1, hevc", q.compression);
            if (S8.defined(q.quality))
                if (S8.integer(q.quality) && S8.inRange(q.quality, 1, 100)) this.options.heifQuality = q.quality;
                else throw S8.invalidParameterError("quality", "integer between 1 and 100", q.quality);
            if (S8.defined(q.lossless))
                if (S8.bool(q.lossless)) this.options.heifLossless = q.lossless;
                else throw S8.invalidParameterError("lossless", "boolean", q.lossless);
            if (S8.defined(q.effort))
                if (S8.integer(q.effort) && S8.inRange(q.effort, 0, 9)) this.options.heifEffort = q.effort;
                else throw S8.invalidParameterError("effort", "integer between 0 and 9", q.effort);
            if (S8.defined(q.chromaSubsampling))
                if (S8.string(q.chromaSubsampling) && S8.inArray(q.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.heifChromaSubsampling = q.chromaSubsampling;
                else throw S8.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", q.chromaSubsampling);
            if (S8.defined(q.bitdepth))
                if (S8.integer(q.bitdepth) && S8.inArray(q.bitdepth, [8, 10, 12])) {
                    if (q.bitdepth !== 8 && this.constructor.versions.heif) throw S8.invalidParameterError("bitdepth when using prebuilt binaries", 8, q.bitdepth);
                    this.options.heifBitdepth = q.bitdepth
                } else throw S8.invalidParameterError("bitdepth", "8, 10 or 12", q.bitdepth)
        } else throw S8.invalidParameterError("options", "Object", q);
        return this._updateFormatOut("heif", q)
    }

    function uU_(q) {
        if (S8.object(q)) {
            if (S8.defined(q.quality))
                if (S8.integer(q.quality) && S8.inRange(q.quality, 1, 100)) this.options.jxlDistance = q.quality >= 30 ? 0.1 + (100 - q.quality) * 0.09 : 0.017666666666666667 * q.quality * q.quality - 1.15 * q.quality + 25;
                else throw S8.invalidParameterError("quality", "integer between 1 and 100", q.quality);
            else if (S8.defined(q.distance))
                if (S8.number(q.distance) && S8.inRange(q.distance, 0, 15)) this.options.jxlDistance = q.distance;
                else throw S8.invalidParameterError("distance", "number between 0.0 and 15.0", q.distance);
            if (S8.defined(q.decodingTier))
                if (S8.integer(q.decodingTier) && S8.inRange(q.decodingTier, 0, 4)) this.options.jxlDecodingTier = q.decodingTier;
                else throw S8.invalidParameterError("decodingTier", "integer between 0 and 4", q.decodingTier);
            if (S8.defined(q.lossless))
                if (S8.bool(q.lossless)) this.options.jxlLossless = q.lossless;
                else throw S8.invalidParameterError("lossless", "boolean", q.lossless);
            if (S8.defined(q.effort))
                if (S8.integer(q.effort) && S8.inRange(q.effort, 1, 9)) this.options.jxlEffort = q.effort;
                else throw S8.invalidParameterError("effort", "integer between 1 and 9", q.effort)
        }
        return um1(q, this.options), this._updateFormatOut("jxl", q)
    }

    function mU_(q) {
        if (S8.object(q)) {
            if (S8.defined(q.depth))
                if (S8.string(q.depth) && S8.inArray(q.depth, ["char", "uchar", "short", "ushort", "int", "uint", "float", "complex", "double", "dpcomplex"])) this.options.rawDepth = q.depth;
                else throw S8.invalidParameterError("depth", "one of: char, uchar, short, ushort, int, uint, float, complex, double, dpcomplex", q.depth)
        }
        return this._updateFormatOut("raw")
    }

    function BU_(q) {
        if (S8.object(q)) {
            if (S8.defined(q.size))
                if (S8.integer(q.size) && S8.inRange(q.size, 1, 8192)) this.options.tileSize = q.size;
                else throw S8.invalidParameterError("size", "integer between 1 and 8192", q.size);
            if (S8.defined(q.overlap))
                if (S8.integer(q.overlap) && S8.inRange(q.overlap, 0, 8192)) {
                    if (q.overlap > this.options.tileSize) throw S8.invalidParameterError("overlap", `<= size (${this.options.tileSize})`, q.overlap);
                    this.options.tileOverlap = q.overlap
                } else throw S8.invalidParameterError("overlap", "integer between 0 and 8192", q.overlap);
            if (S8.defined(q.container))
                if (S8.string(q.container) && S8.inArray(q.container, ["fs", "zip"])) this.options.tileContainer = q.container;
                else throw S8.invalidParameterError("container", "one of: fs, zip", q.container);
            if (S8.defined(q.layout))
                if (S8.string(q.layout) && S8.inArray(q.layout, ["dz", "google", "iiif", "iiif3", "zoomify"])) this.options.tileLayout = q.layout;
                else throw S8.invalidParameterError("layout", "one of: dz, google, iiif, iiif3, zoomify", q.layout);
            if (S8.defined(q.angle))
                if (S8.integer(q.angle) && !(q.angle % 90)) this.options.tileAngle = q.angle;
                else throw S8.invalidParameterError("angle", "positive/negative multiple of 90", q.angle);
            if (this._setBackgroundColourOption("tileBackground", q.background), S8.defined(q.depth))
                if (S8.string(q.depth) && S8.inArray(q.depth, ["onepixel", "onetile", "one"])) this.options.tileDepth = q.depth;
                else throw S8.invalidParameterError("depth", "one of: onepixel, onetile, one", q.depth);
            if (S8.defined(q.skipBlanks))
                if (S8.integer(q.skipBlanks) && S8.inRange(q.skipBlanks, -1, 65535)) this.options.tileSkipBlanks = q.skipBlanks;
                else throw S8.invalidParameterError("skipBlanks", "integer between -1 and 255/65535", q.skipBlanks);
            else if (S8.defined(q.layout) && q.layout === "google") this.options.tileSkipBlanks = 5;
            let K = S8.bool(q.center) ? q.center : q.centre;
            if (S8.defined(K)) this._setBooleanOption("tileCentre", K);
            if (S8.defined(q.id))
                if (S8.string(q.id)) this.options.tileId = q.id;
                else throw S8.invalidParameterError("id", "string", q.id);
            if (S8.defined(q.basename))
                if (S8.string(q.basename)) this.options.tileBasename = q.basename;
                else throw S8.invalidParameterError("basename", "string", q.basename)
        }
        if (S8.inArray(this.options.formatOut, ["jpeg", "png", "webp"])) this.options.tileFormat = this.options.formatOut;
        else if (this.options.formatOut !== "input") throw S8.invalidParameterError("format", "one of: jpeg, png, webp", this.options.formatOut);
        return this._updateFormatOut("dz")
    }

    function pU_(q) {
        if (!S8.plainObject(q)) throw S8.invalidParameterError("options", "object", q);
        if (S8.integer(q.seconds) && S8.inRange(q.seconds, 0, 3600)) this.options.timeoutSeconds = q.seconds;
        else throw S8.invalidParameterError("seconds", "integer between 0 and 3600", q.seconds);
        return this
    }

    function FU_(q, K) {
        if (!(S8.object(K) && K.force === !1)) this.options.formatOut = q;
        return this
    }

    function gU_(q, K) {
        if (S8.bool(K)) this.options[q] = K;
        else throw S8.invalidParameterError(q, "boolean", K)
    }

    function UU_() {
        if (!this.options.streamOut) {
            this.options.streamOut = !0;
            let q = Error();
            this._pipeline(void 0, q)
        }
    }

    function QU_(q, K) {
        if (typeof q === "function") {
            if (this._isStreamInput()) this.on("finish", () => {
                this._flattenBufferIn(), DE6.pipeline(this.options, (_, z, Y) => {
                    if (_) q(S8.nativeError(_, K));
                    else q(null, z, Y)
                })
            });
            else DE6.pipeline(this.options, (_, z, Y) => {
                if (_) q(S8.nativeError(_, K));
                else q(null, z, Y)
            });
            return this
        } else if (this.options.streamOut) {
            if (this._isStreamInput()) {
                if (this.once("finish", () => {
                        this._flattenBufferIn(), DE6.pipeline(this.options, (_, z, Y) => {
                            if (_) this.emit("error", S8.nativeError(_, K));
                            else this.emit("info", Y), this.push(z);
                            this.push(null), this.on("end", () => this.emit("close"))
                        })
                    }), this.streamInFinished) this.emit("finish")
            } else DE6.pipeline(this.options, (_, z, Y) => {
                if (_) this.emit("error", S8.nativeError(_, K));
                else this.emit("info", Y), this.push(z);
                this.push(null), this.on("end", () => this.emit("close"))
            });
            return this
        } else if (this._isStreamInput()) return new Promise((_, z) => {
            this.once("finish", () => {
                this._flattenBufferIn(), DE6.pipeline(this.options, (Y, A, O) => {
                    if (Y) z(S8.nativeError(Y, K));
                    else if (this.options.resolveWithObject) _({
                        data: A,
                        info: O
                    });
                    else _(A)
                })
            })
        });
        else return new Promise((_, z) => {
            DE6.pipeline(this.options, (Y, A, O) => {
                if (Y) z(S8.nativeError(Y, K));
                else if (this.options.resolveWithObject) _({
                    data: A,
                    info: O
                });
                else _(A)
            })
        })
    }
    W24.exports = (q) => {
        Object.assign(q.prototype, {
            toFile: WU_,
            toBuffer: DU_,
            keepExif: ZU_,
            withExif: fU_,
            withExifMerge: GU_,
            keepIccProfile: vU_,
            withIccProfile: TU_,
            keepXmp: VU_,
            withXmp: kU_,
            keepMetadata: NU_,
            withMetadata: EU_,
            toFormat: yU_,
            jpeg: LU_,
            jp2: CU_,
            png: hU_,
            webp: RU_,
            tiff: bU_,
            avif: IU_,
            heif: xU_,
            jxl: uU_,
            gif: SU_,
            raw: mU_,
            tile: BU_,
            timeout: pU_,
            _updateFormatOut: FU_,
            _setBooleanOption: gU_,
            _read: UU_,
            _pipeline: QU_
        })
    }
})
// @from(Ln 196260, Col 4)
v24 = p((Vzw, G24) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var dU_ = d6("node:events"),
        Gy8 = Ay8(),
        SI = Ld(),
        {
            runtimePlatformArch: cU_
        } = Nm1(),
        Hk = Ns6(),
        Z24 = cU_(),
        mm1 = Hk.libvipsVersion(),
        U46 = Hk.format();
    U46.heif.output.alias = ["avif", "heic"];
    U46.jpeg.output.alias = ["jpe", "jpg"];
    U46.tiff.output.alias = ["tif"];
    U46.jp2k.output.alias = ["j2c", "j2k", "jp2", "jpx"];
    var lU_ = {
            nearest: "nearest",
            bilinear: "bilinear",
            bicubic: "bicubic",
            locallyBoundedBicubic: "lbb",
            nohalo: "nohalo",
            vertexSplitQuadraticBasisSpline: "vsqbs"
        },
        ZE6 = {
            vips: mm1.semver
        };
    if (!mm1.isGlobal)
        if (!mm1.isWasm) try {
            ZE6 = d6(`@img/sharp-${Z24}/versions`)
        } catch (q) {
            try {
                ZE6 = d6(`@img/sharp-libvips-${Z24}/versions`)
            } catch (K) {}
        } else try {
            ZE6 = (() => {
                throw new Error("Cannot require module " + "@img/sharp-wasm32/versions");
            })()
        } catch (q) {}
    ZE6.sharp = Vm1().version;
    if (ZE6.heif && U46.heif) U46.heif.input.fileSuffix = [".avif"], U46.heif.output.alias = ["avif"];

    function f24(q) {
        if (SI.bool(q))
            if (q) return Hk.cache(50, 20, 100);
            else return Hk.cache(0, 0, 0);
        else if (SI.object(q)) return Hk.cache(q.memory, q.files, q.items);
        else return Hk.cache()
    }
    f24(!0);

    function nU_(q) {
        return Hk.concurrency(SI.integer(q) ? q : null)
    }
    if (Gy8.familySync() === Gy8.GLIBC && !Hk._isUsingJemalloc()) Hk.concurrency(1);
    else if (Gy8.familySync() === Gy8.MUSL && Hk.concurrency() === 1024) Hk.concurrency(d6("node:os").availableParallelism());
    var iU_ = new dU_.EventEmitter;

    function rU_() {
        return Hk.counters()
    }

    function oU_(q) {
        return Hk.simd(SI.bool(q) ? q : null)
    }

    function aU_(q) {
        if (SI.object(q))
            if (Array.isArray(q.operation) && q.operation.every(SI.string)) Hk.block(q.operation, !0);
            else throw SI.invalidParameterError("operation", "Array<string>", q.operation);
        else throw SI.invalidParameterError("options", "object", q)
    }

    function sU_(q) {
        if (SI.object(q))
            if (Array.isArray(q.operation) && q.operation.every(SI.string)) Hk.block(q.operation, !1);
            else throw SI.invalidParameterError("operation", "Array<string>", q.operation);
        else throw SI.invalidParameterError("options", "object", q)
    }
    G24.exports = (q) => {
        q.cache = f24, q.concurrency = nU_, q.counters = rU_, q.simd = oU_, q.format = U46, q.interpolators = lU_, q.versions = ZE6, q.queue = iU_, q.block = aU_, q.unblock = sU_
    }
})
// @from(Ln 196346, Col 4)
Bm1 = p((Nzw, T24) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var qs = uw4();
    pw4()(qs);
    cw4()(qs);
    nw4()(qs);
    sw4()(qs);
    j24()(qs);
    J24()(qs);
    D24()(qs);
    v24()(qs);
    T24.exports = qs
})
// @from(Ln 196362, Col 0)
async function i$6() {
    if (vy8) return vy8.default;
    if (v$()) try {
        let _ = await Promise.resolve().then(() => (_y8(), Ky8)),
            z = _.sharp || _.default;
        return vy8 = {
            default: z
        }, z
    } catch {
        console.warn("Native image processor not available, falling back to sharp")
    }
    let q = await Promise.resolve().then(() => K6(Bm1(), 1)),
        K = tU_(q);
    return vy8 = {
        default: K
    }, K
}
// @from(Ln 196380, Col 0)
function tU_(q) {
    return typeof q === "function" ? q : q.default
}
// @from(Ln 196383, Col 4)
vy8 = null
// @from(Ln 196384, Col 4)
pm1 = () => {}
// @from(Ln 196386, Col 0)
function fE6(q) {
    if (q.length < 4) return "image/png";
    if (q[0] === 137 && q[1] === 80 && q[2] === 78 && q[3] === 71) return "image/png";
    if (q[0] === 255 && q[1] === 216 && q[2] === 255) return "image/jpeg";
    if (q[0] === 71 && q[1] === 73 && q[2] === 70) return "image/gif";
    if (q[0] === 82 && q[1] === 73 && q[2] === 70 && q[3] === 70 && q.length >= 12 && q[8] === 87 && q[9] === 69 && q[10] === 66 && q[11] === 80) return "image/webp";
    return "image/png"
}
// @from(Ln 196395, Col 0)
function Es6(q) {
    try {
        let K = Buffer.from(q, "base64");
        return fE6(K)
    } catch {
        return "image/png"
    }
}
// @from(Ln 196403, Col 4)
V24 = 10485760
// @from(Ln 196404, Col 4)
Fm1 = 512000
// @from(Ln 196405, Col 4)
Ks
// @from(Ln 196405, Col 8)
k24 = 33554432
// @from(Ln 196406, Col 4)
ys6 = 20971520
// @from(Ln 196407, Col 4)
N24 = 100
// @from(Ln 196408, Col 4)
E24 = 3145728
// @from(Ln 196409, Col 4)
gm1 = 104857600
// @from(Ln 196410, Col 4)
r$6 = 20
// @from(Ln 196411, Col 4)
Ty8 = 10
// @from(Ln 196412, Col 4)
y24 = 100
// @from(Ln 196413, Col 4)
L24 = 600
// @from(Ln 196414, Col 4)
h24 = 20
// @from(Ln 196415, Col 4)
_s = L(() => {
    Ks = {
        maxWidth: 2000,
        maxHeight: 2000,
        maxBase64Size: 5242880,
        targetRawSize: 3932160
    }
})
// @from(Ln 196424, Col 0)
function C24(q) {
    if (q instanceof Error) {
        let _ = q;
        if (_.code === "MODULE_NOT_FOUND" || _.code === "ERR_MODULE_NOT_FOUND" || _.code === "ERR_DLOPEN_FAILED") return R24;
        if (_.code === "EACCES" || _.code === "EPERM") return YQ_;
        if (_.code === "ENOMEM") return S24
    }
    let K = b6(q);
    if (K.includes("Native image processor module not available")) return R24;
    if (K.includes("unsupported image format") || K.includes("Input buffer") || K.includes("Input file is missing") || K.includes("Input file has corrupt header") || K.includes("corrupt header") || K.includes("corrupt image") || K.includes("premature end") || K.includes("zlib: data error") || K.includes("zero width") || K.includes("zero height")) return eU_;
    if (K.includes("pixel limit") || K.includes("too many pixels") || K.includes("exceeds pixel") || K.includes("image dimensions")) return KQ_;
    if (K.includes("out of memory") || K.includes("Cannot allocate") || K.includes("memory allocation")) return S24;
    if (K.includes("timeout") || K.includes("timed out")) return _Q_;
    if (K.includes("Vips")) return zQ_;
    return qQ_
}
// @from(Ln 196441, Col 0)
function b24(q) {
    let K = 5381;
    for (let _ = 0; _ < q.length; _++) K = (K << 5) + K + q.charCodeAt(_) | 0;
    return K >>> 0
}