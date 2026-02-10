
// @from(Ln 193121, Col 4)
CT7 = R((dn2, yT7) => {
    var zw = ru(),
        iHA = {
            clear: "clear",
            source: "source",
            over: "over",
            in: "in",
            out: "out",
            atop: "atop",
            dest: "dest",
            "dest-over": "dest-over",
            "dest-in": "dest-in",
            "dest-out": "dest-out",
            "dest-atop": "dest-atop",
            xor: "xor",
            add: "add",
            saturate: "saturate",
            multiply: "multiply",
            screen: "screen",
            overlay: "overlay",
            darken: "darken",
            lighten: "lighten",
            "colour-dodge": "colour-dodge",
            "color-dodge": "colour-dodge",
            "colour-burn": "colour-burn",
            "color-burn": "colour-burn",
            "hard-light": "hard-light",
            "soft-light": "soft-light",
            difference: "difference",
            exclusion: "exclusion"
        };

    function l79(A) {
        if (!Array.isArray(A)) throw zw.invalidParameterError("images to composite", "array", A);
        return this.options.composite = A.map((q) => {
            if (!zw.object(q)) throw zw.invalidParameterError("image to composite", "object", q);
            let K = this._inputOptionsFromObject(q),
                Y = {
                    input: this._createInputDescriptor(q.input, K, {
                        allowStream: !1
                    }),
                    blend: "over",
                    tile: !1,
                    left: 0,
                    top: 0,
                    hasOffset: !1,
                    gravity: 0,
                    premultiplied: !1
                };
            if (zw.defined(q.blend))
                if (zw.string(iHA[q.blend])) Y.blend = iHA[q.blend];
                else throw zw.invalidParameterError("blend", "valid blend name", q.blend);
            if (zw.defined(q.tile))
                if (zw.bool(q.tile)) Y.tile = q.tile;
                else throw zw.invalidParameterError("tile", "boolean", q.tile);
            if (zw.defined(q.left))
                if (zw.integer(q.left)) Y.left = q.left;
                else throw zw.invalidParameterError("left", "integer", q.left);
            if (zw.defined(q.top))
                if (zw.integer(q.top)) Y.top = q.top;
                else throw zw.invalidParameterError("top", "integer", q.top);
            if (zw.defined(q.top) !== zw.defined(q.left)) throw Error("Expected both left and top to be set");
            else Y.hasOffset = zw.integer(q.top) && zw.integer(q.left);
            if (zw.defined(q.gravity))
                if (zw.integer(q.gravity) && zw.inRange(q.gravity, 0, 8)) Y.gravity = q.gravity;
                else if (zw.string(q.gravity) && zw.integer(this.constructor.gravity[q.gravity])) Y.gravity = this.constructor.gravity[q.gravity];
            else throw zw.invalidParameterError("gravity", "valid gravity", q.gravity);
            if (zw.defined(q.premultiplied))
                if (zw.bool(q.premultiplied)) Y.premultiplied = q.premultiplied;
                else throw zw.invalidParameterError("premultiplied", "boolean", q.premultiplied);
            return Y
        }), this
    }
    yT7.exports = function(A) {
        A.prototype.composite = l79, A.blend = iHA
    }
})
// @from(Ln 193198, Col 4)
IT7 = R((cn2, hT7) => {
    var i79 = H26(),
        VA = ru(),
        ST7 = {
            integer: "integer",
            float: "float",
            approximate: "approximate"
        };

    function n79(A, q) {
        if (this.options.useExifOrientation || this.options.angle || this.options.rotationAngle) this.options.debuglog("ignoring previous rotate options");
        if (!VA.defined(A)) this.options.useExifOrientation = !0;
        else if (VA.integer(A) && !(A % 90)) this.options.angle = A;
        else if (VA.number(A)) {
            if (this.options.rotationAngle = A, VA.object(q) && q.background) {
                let K = i79(q.background);
                this.options.rotationBackground = [K.red(), K.green(), K.blue(), Math.round(K.alpha() * 255)]
            }
        } else throw VA.invalidParameterError("angle", "numeric", A);
        return this
    }

    function r79(A) {
        return this.options.flip = VA.bool(A) ? A : !0, this
    }

    function o79(A) {
        return this.options.flop = VA.bool(A) ? A : !0, this
    }

    function a79(A, q) {
        let K = [].concat(...A);
        if (K.length === 4 && K.every(VA.number)) this.options.affineMatrix = K;
        else throw VA.invalidParameterError("matrix", "1x4 or 2x2 array", A);
        if (VA.defined(q))
            if (VA.object(q)) {
                if (this._setBackgroundColourOption("affineBackground", q.background), VA.defined(q.idx))
                    if (VA.number(q.idx)) this.options.affineIdx = q.idx;
                    else throw VA.invalidParameterError("options.idx", "number", q.idx);
                if (VA.defined(q.idy))
                    if (VA.number(q.idy)) this.options.affineIdy = q.idy;
                    else throw VA.invalidParameterError("options.idy", "number", q.idy);
                if (VA.defined(q.odx))
                    if (VA.number(q.odx)) this.options.affineOdx = q.odx;
                    else throw VA.invalidParameterError("options.odx", "number", q.odx);
                if (VA.defined(q.ody))
                    if (VA.number(q.ody)) this.options.affineOdy = q.ody;
                    else throw VA.invalidParameterError("options.ody", "number", q.ody);
                if (VA.defined(q.interpolator))
                    if (VA.inArray(q.interpolator, Object.values(this.constructor.interpolators))) this.options.affineInterpolator = q.interpolator;
                    else throw VA.invalidParameterError("options.interpolator", "valid interpolator name", q.interpolator)
            } else throw VA.invalidParameterError("options", "object", q);
        return this
    }

    function s79(A, q, K) {
        if (!VA.defined(A)) this.options.sharpenSigma = -1;
        else if (VA.bool(A)) this.options.sharpenSigma = A ? -1 : 0;
        else if (VA.number(A) && VA.inRange(A, 0.01, 1e4)) {
            if (this.options.sharpenSigma = A, VA.defined(q))
                if (VA.number(q) && VA.inRange(q, 0, 1e4)) this.options.sharpenM1 = q;
                else throw VA.invalidParameterError("flat", "number between 0 and 10000", q);
            if (VA.defined(K))
                if (VA.number(K) && VA.inRange(K, 0, 1e4)) this.options.sharpenM2 = K;
                else throw VA.invalidParameterError("jagged", "number between 0 and 10000", K)
        } else if (VA.plainObject(A)) {
            if (VA.number(A.sigma) && VA.inRange(A.sigma, 0.000001, 10)) this.options.sharpenSigma = A.sigma;
            else throw VA.invalidParameterError("options.sigma", "number between 0.000001 and 10", A.sigma);
            if (VA.defined(A.m1))
                if (VA.number(A.m1) && VA.inRange(A.m1, 0, 1e6)) this.options.sharpenM1 = A.m1;
                else throw VA.invalidParameterError("options.m1", "number between 0 and 1000000", A.m1);
            if (VA.defined(A.m2))
                if (VA.number(A.m2) && VA.inRange(A.m2, 0, 1e6)) this.options.sharpenM2 = A.m2;
                else throw VA.invalidParameterError("options.m2", "number between 0 and 1000000", A.m2);
            if (VA.defined(A.x1))
                if (VA.number(A.x1) && VA.inRange(A.x1, 0, 1e6)) this.options.sharpenX1 = A.x1;
                else throw VA.invalidParameterError("options.x1", "number between 0 and 1000000", A.x1);
            if (VA.defined(A.y2))
                if (VA.number(A.y2) && VA.inRange(A.y2, 0, 1e6)) this.options.sharpenY2 = A.y2;
                else throw VA.invalidParameterError("options.y2", "number between 0 and 1000000", A.y2);
            if (VA.defined(A.y3))
                if (VA.number(A.y3) && VA.inRange(A.y3, 0, 1e6)) this.options.sharpenY3 = A.y3;
                else throw VA.invalidParameterError("options.y3", "number between 0 and 1000000", A.y3)
        } else throw VA.invalidParameterError("sigma", "number between 0.01 and 10000", A);
        return this
    }

    function t79(A) {
        if (!VA.defined(A)) this.options.medianSize = 3;
        else if (VA.integer(A) && VA.inRange(A, 1, 1000)) this.options.medianSize = A;
        else throw VA.invalidParameterError("size", "integer between 1 and 1000", A);
        return this
    }

    function e79(A) {
        let q;
        if (VA.number(A)) q = A;
        else if (VA.plainObject(A)) {
            if (!VA.number(A.sigma)) throw VA.invalidParameterError("options.sigma", "number between 0.3 and 1000", q);
            if (q = A.sigma, "precision" in A)
                if (VA.string(ST7[A.precision])) this.options.precision = ST7[A.precision];
                else throw VA.invalidParameterError("precision", "one of: integer, float, approximate", A.precision);
            if ("minAmplitude" in A)
                if (VA.number(A.minAmplitude) && VA.inRange(A.minAmplitude, 0.001, 1)) this.options.minAmpl = A.minAmplitude;
                else throw VA.invalidParameterError("minAmplitude", "number between 0.001 and 1", A.minAmplitude)
        }
        if (!VA.defined(A)) this.options.blurSigma = -1;
        else if (VA.bool(A)) this.options.blurSigma = A ? -1 : 0;
        else if (VA.number(q) && VA.inRange(q, 0.3, 1000)) this.options.blurSigma = q;
        else throw VA.invalidParameterError("sigma", "number between 0.3 and 1000", q);
        return this
    }

    function A49(A) {
        if (this.options.flatten = VA.bool(A) ? A : !0, VA.object(A)) this._setBackgroundColourOption("flattenBackground", A.background);
        return this
    }

    function q49() {
        return this.options.unflatten = !0, this
    }

    function K49(A, q) {
        if (!VA.defined(A)) this.options.gamma = 2.2;
        else if (VA.number(A) && VA.inRange(A, 1, 3)) this.options.gamma = A;
        else throw VA.invalidParameterError("gamma", "number between 1.0 and 3.0", A);
        if (!VA.defined(q)) this.options.gammaOut = this.options.gamma;
        else if (VA.number(q) && VA.inRange(q, 1, 3)) this.options.gammaOut = q;
        else throw VA.invalidParameterError("gammaOut", "number between 1.0 and 3.0", q);
        return this
    }

    function Y49(A) {
        if (this.options.negate = VA.bool(A) ? A : !0, VA.plainObject(A) && "alpha" in A)
            if (!VA.bool(A.alpha)) throw VA.invalidParameterError("alpha", "should be boolean value", A.alpha);
            else this.options.negateAlpha = A.alpha;
        return this
    }

    function z49(A) {
        if (VA.plainObject(A)) {
            if (VA.defined(A.lower))
                if (VA.number(A.lower) && VA.inRange(A.lower, 0, 99)) this.options.normaliseLower = A.lower;
                else throw VA.invalidParameterError("lower", "number between 0 and 99", A.lower);
            if (VA.defined(A.upper))
                if (VA.number(A.upper) && VA.inRange(A.upper, 1, 100)) this.options.normaliseUpper = A.upper;
                else throw VA.invalidParameterError("upper", "number between 1 and 100", A.upper)
        }
        if (this.options.normaliseLower >= this.options.normaliseUpper) throw VA.invalidParameterError("range", "lower to be less than upper", `${this.options.normaliseLower} >= ${this.options.normaliseUpper}`);
        return this.options.normalise = !0, this
    }

    function w49(A) {
        return this.normalise(A)
    }

    function H49(A) {
        if (VA.plainObject(A)) {
            if (VA.integer(A.width) && A.width > 0) this.options.claheWidth = A.width;
            else throw VA.invalidParameterError("width", "integer greater than zero", A.width);
            if (VA.integer(A.height) && A.height > 0) this.options.claheHeight = A.height;
            else throw VA.invalidParameterError("height", "integer greater than zero", A.height);
            if (VA.defined(A.maxSlope))
                if (VA.integer(A.maxSlope) && VA.inRange(A.maxSlope, 0, 100)) this.options.claheMaxSlope = A.maxSlope;
                else throw VA.invalidParameterError("maxSlope", "integer between 0 and 100", A.maxSlope)
        } else throw VA.invalidParameterError("options", "plain object", A);
        return this
    }

    function $49(A) {
        if (!VA.object(A) || !Array.isArray(A.kernel) || !VA.integer(A.width) || !VA.integer(A.height) || !VA.inRange(A.width, 3, 1001) || !VA.inRange(A.height, 3, 1001) || A.height * A.width !== A.kernel.length) throw Error("Invalid convolution kernel");
        if (!VA.integer(A.scale)) A.scale = A.kernel.reduce(function(q, K) {
            return q + K
        }, 0);
        if (A.scale < 1) A.scale = 1;
        if (!VA.integer(A.offset)) A.offset = 0;
        return this.options.convKernel = A, this
    }

    function O49(A, q) {
        if (!VA.defined(A)) this.options.threshold = 128;
        else if (VA.bool(A)) this.options.threshold = A ? 128 : 0;
        else if (VA.integer(A) && VA.inRange(A, 0, 255)) this.options.threshold = A;
        else throw VA.invalidParameterError("threshold", "integer between 0 and 255", A);
        if (!VA.object(q) || q.greyscale === !0 || q.grayscale === !0) this.options.thresholdGrayscale = !0;
        else this.options.thresholdGrayscale = !1;
        return this
    }

    function _49(A, q, K) {
        if (this.options.boolean = this._createInputDescriptor(A, K), VA.string(q) && VA.inArray(q, ["and", "or", "eor"])) this.options.booleanOp = q;
        else throw VA.invalidParameterError("operator", "one of: and, or, eor", q);
        return this
    }

    function J49(A, q) {
        if (!VA.defined(A) && VA.number(q)) A = 1;
        else if (VA.number(A) && !VA.defined(q)) q = 0;
        if (!VA.defined(A)) this.options.linearA = [];
        else if (VA.number(A)) this.options.linearA = [A];
        else if (Array.isArray(A) && A.length && A.every(VA.number)) this.options.linearA = A;
        else throw VA.invalidParameterError("a", "number or array of numbers", A);
        if (!VA.defined(q)) this.options.linearB = [];
        else if (VA.number(q)) this.options.linearB = [q];
        else if (Array.isArray(q) && q.length && q.every(VA.number)) this.options.linearB = q;
        else throw VA.invalidParameterError("b", "number or array of numbers", q);
        if (this.options.linearA.length !== this.options.linearB.length) throw Error("Expected a and b to be arrays of the same length");
        return this
    }

    function X49(A) {
        if (!Array.isArray(A)) throw VA.invalidParameterError("inputMatrix", "array", A);
        if (A.length !== 3 && A.length !== 4) throw VA.invalidParameterError("inputMatrix", "3x3 or 4x4 array", A.length);
        let q = A.flat().map(Number);
        if (q.length !== 9 && q.length !== 16) throw VA.invalidParameterError("inputMatrix", "cardinality of 9 or 16", q.length);
        return this.options.recombMatrix = q, this
    }

    function D49(A) {
        if (!VA.plainObject(A)) throw VA.invalidParameterError("options", "plain object", A);
        if ("brightness" in A)
            if (VA.number(A.brightness) && A.brightness >= 0) this.options.brightness = A.brightness;
            else throw VA.invalidParameterError("brightness", "number above zero", A.brightness);
        if ("saturation" in A)
            if (VA.number(A.saturation) && A.saturation >= 0) this.options.saturation = A.saturation;
            else throw VA.invalidParameterError("saturation", "number above zero", A.saturation);
        if ("hue" in A)
            if (VA.integer(A.hue)) this.options.hue = A.hue % 360;
            else throw VA.invalidParameterError("hue", "number", A.hue);
        if ("lightness" in A)
            if (VA.number(A.lightness)) this.options.lightness = A.lightness;
            else throw VA.invalidParameterError("lightness", "number", A.lightness);
        return this
    }
    hT7.exports = function(A) {
        Object.assign(A.prototype, {
            rotate: n79,
            flip: r79,
            flop: o79,
            affine: a79,
            sharpen: s79,
            median: t79,
            blur: e79,
            flatten: A49,
            unflatten: q49,
            gamma: K49,
            negate: Y49,
            normalise: z49,
            normalize: w49,
            clahe: H49,
            convolve: $49,
            threshold: O49,
            boolean: _49,
            linear: J49,
            recomb: X49,
            modulate: D49
        })
    }
})
// @from(Ln 193457, Col 4)
uT7 = R((ln2, bT7) => {
    var j49 = H26(),
        gU = ru(),
        xT7 = {
            multiband: "multiband",
            "b-w": "b-w",
            bw: "b-w",
            cmyk: "cmyk",
            srgb: "srgb"
        };

    function M49(A) {
        return this._setBackgroundColourOption("tint", A), this
    }

    function P49(A) {
        return this.options.greyscale = gU.bool(A) ? A : !0, this
    }

    function W49(A) {
        return this.greyscale(A)
    }

    function G49(A) {
        if (!gU.string(A)) throw gU.invalidParameterError("colourspace", "string", A);
        return this.options.colourspacePipeline = A, this
    }

    function Z49(A) {
        return this.pipelineColourspace(A)
    }

    function f49(A) {
        if (!gU.string(A)) throw gU.invalidParameterError("colourspace", "string", A);
        return this.options.colourspace = A, this
    }

    function V49(A) {
        return this.toColourspace(A)
    }

    function N49(A, q) {
        if (gU.defined(q))
            if (gU.object(q) || gU.string(q)) {
                let K = j49(q);
                this.options[A] = [K.red(), K.green(), K.blue(), Math.round(K.alpha() * 255)]
            } else throw gU.invalidParameterError("background", "object or string", q)
    }
    bT7.exports = function(A) {
        Object.assign(A.prototype, {
            tint: M49,
            greyscale: P49,
            grayscale: W49,
            pipelineColourspace: G49,
            pipelineColorspace: Z49,
            toColourspace: f49,
            toColorspace: V49,
            _setBackgroundColourOption: N49
        }), A.colourspace = xT7, A.colorspace = xT7
    }
})
// @from(Ln 193518, Col 4)
mT7 = R((in2, BT7) => {
    var tu = ru(),
        T49 = {
            and: "and",
            or: "or",
            eor: "eor"
        };

    function v49() {
        return this.options.removeAlpha = !0, this
    }

    function E49(A) {
        if (tu.defined(A))
            if (tu.number(A) && tu.inRange(A, 0, 1)) this.options.ensureAlpha = A;
            else throw tu.invalidParameterError("alpha", "number between 0 and 1", A);
        else this.options.ensureAlpha = 1;
        return this
    }

    function k49(A) {
        let q = {
            red: 0,
            green: 1,
            blue: 2,
            alpha: 3
        };
        if (Object.keys(q).includes(A)) A = q[A];
        if (tu.integer(A) && tu.inRange(A, 0, 4)) this.options.extractChannel = A;
        else throw tu.invalidParameterError("channel", "integer or one of: red, green, blue, alpha", A);
        return this
    }

    function L49(A, q) {
        if (Array.isArray(A)) A.forEach(function(K) {
            this.options.joinChannelIn.push(this._createInputDescriptor(K, q))
        }, this);
        else this.options.joinChannelIn.push(this._createInputDescriptor(A, q));
        return this
    }

    function R49(A) {
        if (tu.string(A) && tu.inArray(A, ["and", "or", "eor"])) this.options.bandBoolOp = A;
        else throw tu.invalidParameterError("boolOp", "one of: and, or, eor", A);
        return this
    }
    BT7.exports = function(A) {
        Object.assign(A.prototype, {
            removeAlpha: v49,
            ensureAlpha: E49,
            extractChannel: k49,
            joinChannel: L49,
            bandbool: R49
        }), A.bool = T49
    }
})
// @from(Ln 193574, Col 4)
dT7 = R((nn2, pT7) => {
    var nHA = h1("node:path"),
        $6 = ru(),
        jD1 = $x1(),
        FT7 = new Map([
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
        y49 = /\.(jp[2x]|j2[kc])$/i,
        QT7 = () => Error("JP2 output requires libvips with support for OpenJPEG"),
        gT7 = (A) => 1 << 31 - Math.clz32(Math.ceil(Math.log2(A)));

    function C49(A, q) {
        let K;
        if (!$6.string(A)) K = Error("Missing output file path");
        else if ($6.string(this.options.input.file) && nHA.resolve(this.options.input.file) === nHA.resolve(A)) K = Error("Cannot use same file for input and output");
        else if (y49.test(nHA.extname(A)) && !this.constructor.format.jp2k.output.file) K = QT7();
        if (K)
            if ($6.fn(q)) q(K);
            else return Promise.reject(K);
        else {
            this.options.fileOut = A;
            let Y = Error();
            return this._pipeline(q, Y)
        }
        return this
    }

    function S49(A, q) {
        if ($6.object(A)) this._setBooleanOption("resolveWithObject", A.resolveWithObject);
        else if (this.options.resolveWithObject) this.options.resolveWithObject = !1;
        this.options.fileOut = "";
        let K = Error();
        return this._pipeline($6.fn(A) ? A : q, K)
    }

    function h49() {
        return this.options.keepMetadata |= 1, this
    }

    function I49(A) {
        if ($6.object(A))
            for (let [q, K] of Object.entries(A))
                if ($6.object(K))
                    for (let [Y, z] of Object.entries(K))
                        if ($6.string(z)) this.options.withExif[`exif-${q.toLowerCase()}-${Y}`] = z;
                        else throw $6.invalidParameterError(`${q}.${Y}`, "string", z);
        else throw $6.invalidParameterError(q, "object", K);
        else throw $6.invalidParameterError("exif", "object", A);
        return this.options.withExifMerge = !1, this.keepExif()
    }

    function x49(A) {
        return this.withExif(A), this.options.withExifMerge = !0, this
    }

    function b49() {
        return this.options.keepMetadata |= 8, this
    }

    function u49(A, q) {
        if ($6.string(A)) this.options.withIccProfile = A;
        else throw $6.invalidParameterError("icc", "string", A);
        if (this.keepIccProfile(), $6.object(q)) {
            if ($6.defined(q.attach))
                if ($6.bool(q.attach)) {
                    if (!q.attach) this.options.keepMetadata &= -9
                } else throw $6.invalidParameterError("attach", "boolean", q.attach)
        }
        return this
    }

    function B49() {
        return this.options.keepMetadata = 31, this
    }

    function m49(A) {
        if (this.keepMetadata(), this.withIccProfile("srgb"), $6.object(A)) {
            if ($6.defined(A.orientation))
                if ($6.integer(A.orientation) && $6.inRange(A.orientation, 1, 8)) this.options.withMetadataOrientation = A.orientation;
                else throw $6.invalidParameterError("orientation", "integer between 1 and 8", A.orientation);
            if ($6.defined(A.density))
                if ($6.number(A.density) && A.density > 0) this.options.withMetadataDensity = A.density;
                else throw $6.invalidParameterError("density", "positive number", A.density);
            if ($6.defined(A.icc)) this.withIccProfile(A.icc);
            if ($6.defined(A.exif)) this.withExifMerge(A.exif)
        }
        return this
    }

    function F49(A, q) {
        let K = FT7.get(($6.object(A) && $6.string(A.id) ? A.id : A).toLowerCase());
        if (!K) throw $6.invalidParameterError("format", `one of: ${[...FT7.keys()].join(", ")}`, A);
        return this[K](q)
    }

    function Q49(A) {
        if ($6.object(A)) {
            if ($6.defined(A.quality))
                if ($6.integer(A.quality) && $6.inRange(A.quality, 1, 100)) this.options.jpegQuality = A.quality;
                else throw $6.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            if ($6.defined(A.progressive)) this._setBooleanOption("jpegProgressive", A.progressive);
            if ($6.defined(A.chromaSubsampling))
                if ($6.string(A.chromaSubsampling) && $6.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.jpegChromaSubsampling = A.chromaSubsampling;
                else throw $6.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling);
            let q = $6.bool(A.optimizeCoding) ? A.optimizeCoding : A.optimiseCoding;
            if ($6.defined(q)) this._setBooleanOption("jpegOptimiseCoding", q);
            if ($6.defined(A.mozjpeg))
                if ($6.bool(A.mozjpeg)) {
                    if (A.mozjpeg) this.options.jpegTrellisQuantisation = !0, this.options.jpegOvershootDeringing = !0, this.options.jpegOptimiseScans = !0, this.options.jpegProgressive = !0, this.options.jpegQuantisationTable = 3
                } else throw $6.invalidParameterError("mozjpeg", "boolean", A.mozjpeg);
            let K = $6.bool(A.trellisQuantization) ? A.trellisQuantization : A.trellisQuantisation;
            if ($6.defined(K)) this._setBooleanOption("jpegTrellisQuantisation", K);
            if ($6.defined(A.overshootDeringing)) this._setBooleanOption("jpegOvershootDeringing", A.overshootDeringing);
            let Y = $6.bool(A.optimizeScans) ? A.optimizeScans : A.optimiseScans;
            if ($6.defined(Y)) {
                if (this._setBooleanOption("jpegOptimiseScans", Y), Y) this.options.jpegProgressive = !0
            }
            let z = $6.number(A.quantizationTable) ? A.quantizationTable : A.quantisationTable;
            if ($6.defined(z))
                if ($6.integer(z) && $6.inRange(z, 0, 8)) this.options.jpegQuantisationTable = z;
                else throw $6.invalidParameterError("quantisationTable", "integer between 0 and 8", z)
        }
        return this._updateFormatOut("jpeg", A)
    }

    function g49(A) {
        if ($6.object(A)) {
            if ($6.defined(A.progressive)) this._setBooleanOption("pngProgressive", A.progressive);
            if ($6.defined(A.compressionLevel))
                if ($6.integer(A.compressionLevel) && $6.inRange(A.compressionLevel, 0, 9)) this.options.pngCompressionLevel = A.compressionLevel;
                else throw $6.invalidParameterError("compressionLevel", "integer between 0 and 9", A.compressionLevel);
            if ($6.defined(A.adaptiveFiltering)) this._setBooleanOption("pngAdaptiveFiltering", A.adaptiveFiltering);
            let q = A.colours || A.colors;
            if ($6.defined(q))
                if ($6.integer(q) && $6.inRange(q, 2, 256)) this.options.pngBitdepth = gT7(q);
                else throw $6.invalidParameterError("colours", "integer between 2 and 256", q);
            if ($6.defined(A.palette)) this._setBooleanOption("pngPalette", A.palette);
            else if ([A.quality, A.effort, A.colours, A.colors, A.dither].some($6.defined)) this._setBooleanOption("pngPalette", !0);
            if (this.options.pngPalette) {
                if ($6.defined(A.quality))
                    if ($6.integer(A.quality) && $6.inRange(A.quality, 0, 100)) this.options.pngQuality = A.quality;
                    else throw $6.invalidParameterError("quality", "integer between 0 and 100", A.quality);
                if ($6.defined(A.effort))
                    if ($6.integer(A.effort) && $6.inRange(A.effort, 1, 10)) this.options.pngEffort = A.effort;
                    else throw $6.invalidParameterError("effort", "integer between 1 and 10", A.effort);
                if ($6.defined(A.dither))
                    if ($6.number(A.dither) && $6.inRange(A.dither, 0, 1)) this.options.pngDither = A.dither;
                    else throw $6.invalidParameterError("dither", "number between 0.0 and 1.0", A.dither)
            }
        }
        return this._updateFormatOut("png", A)
    }

    function U49(A) {
        if ($6.object(A)) {
            if ($6.defined(A.quality))
                if ($6.integer(A.quality) && $6.inRange(A.quality, 1, 100)) this.options.webpQuality = A.quality;
                else throw $6.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            if ($6.defined(A.alphaQuality))
                if ($6.integer(A.alphaQuality) && $6.inRange(A.alphaQuality, 0, 100)) this.options.webpAlphaQuality = A.alphaQuality;
                else throw $6.invalidParameterError("alphaQuality", "integer between 0 and 100", A.alphaQuality);
            if ($6.defined(A.lossless)) this._setBooleanOption("webpLossless", A.lossless);
            if ($6.defined(A.nearLossless)) this._setBooleanOption("webpNearLossless", A.nearLossless);
            if ($6.defined(A.smartSubsample)) this._setBooleanOption("webpSmartSubsample", A.smartSubsample);
            if ($6.defined(A.preset))
                if ($6.string(A.preset) && $6.inArray(A.preset, ["default", "photo", "picture", "drawing", "icon", "text"])) this.options.webpPreset = A.preset;
                else throw $6.invalidParameterError("preset", "one of: default, photo, picture, drawing, icon, text", A.preset);
            if ($6.defined(A.effort))
                if ($6.integer(A.effort) && $6.inRange(A.effort, 0, 6)) this.options.webpEffort = A.effort;
                else throw $6.invalidParameterError("effort", "integer between 0 and 6", A.effort);
            if ($6.defined(A.minSize)) this._setBooleanOption("webpMinSize", A.minSize);
            if ($6.defined(A.mixed)) this._setBooleanOption("webpMixed", A.mixed)
        }
        return UT7(A, this.options), this._updateFormatOut("webp", A)
    }

    function p49(A) {
        if ($6.object(A)) {
            if ($6.defined(A.reuse)) this._setBooleanOption("gifReuse", A.reuse);
            if ($6.defined(A.progressive)) this._setBooleanOption("gifProgressive", A.progressive);
            let q = A.colours || A.colors;
            if ($6.defined(q))
                if ($6.integer(q) && $6.inRange(q, 2, 256)) this.options.gifBitdepth = gT7(q);
                else throw $6.invalidParameterError("colours", "integer between 2 and 256", q);
            if ($6.defined(A.effort))
                if ($6.number(A.effort) && $6.inRange(A.effort, 1, 10)) this.options.gifEffort = A.effort;
                else throw $6.invalidParameterError("effort", "integer between 1 and 10", A.effort);
            if ($6.defined(A.dither))
                if ($6.number(A.dither) && $6.inRange(A.dither, 0, 1)) this.options.gifDither = A.dither;
                else throw $6.invalidParameterError("dither", "number between 0.0 and 1.0", A.dither);
            if ($6.defined(A.interFrameMaxError))
                if ($6.number(A.interFrameMaxError) && $6.inRange(A.interFrameMaxError, 0, 32)) this.options.gifInterFrameMaxError = A.interFrameMaxError;
                else throw $6.invalidParameterError("interFrameMaxError", "number between 0.0 and 32.0", A.interFrameMaxError);
            if ($6.defined(A.interPaletteMaxError))
                if ($6.number(A.interPaletteMaxError) && $6.inRange(A.interPaletteMaxError, 0, 256)) this.options.gifInterPaletteMaxError = A.interPaletteMaxError;
                else throw $6.invalidParameterError("interPaletteMaxError", "number between 0.0 and 256.0", A.interPaletteMaxError)
        }
        return UT7(A, this.options), this._updateFormatOut("gif", A)
    }

    function d49(A) {
        if (!this.constructor.format.jp2k.output.buffer) throw QT7();
        if ($6.object(A)) {
            if ($6.defined(A.quality))
                if ($6.integer(A.quality) && $6.inRange(A.quality, 1, 100)) this.options.jp2Quality = A.quality;
                else throw $6.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            if ($6.defined(A.lossless))
                if ($6.bool(A.lossless)) this.options.jp2Lossless = A.lossless;
                else throw $6.invalidParameterError("lossless", "boolean", A.lossless);
            if ($6.defined(A.tileWidth))
                if ($6.integer(A.tileWidth) && $6.inRange(A.tileWidth, 1, 32768)) this.options.jp2TileWidth = A.tileWidth;
                else throw $6.invalidParameterError("tileWidth", "integer between 1 and 32768", A.tileWidth);
            if ($6.defined(A.tileHeight))
                if ($6.integer(A.tileHeight) && $6.inRange(A.tileHeight, 1, 32768)) this.options.jp2TileHeight = A.tileHeight;
                else throw $6.invalidParameterError("tileHeight", "integer between 1 and 32768", A.tileHeight);
            if ($6.defined(A.chromaSubsampling))
                if ($6.string(A.chromaSubsampling) && $6.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.jp2ChromaSubsampling = A.chromaSubsampling;
                else throw $6.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling)
        }
        return this._updateFormatOut("jp2", A)
    }

    function UT7(A, q) {
        if ($6.object(A) && $6.defined(A.loop))
            if ($6.integer(A.loop) && $6.inRange(A.loop, 0, 65535)) q.loop = A.loop;
            else throw $6.invalidParameterError("loop", "integer between 0 and 65535", A.loop);
        if ($6.object(A) && $6.defined(A.delay))
            if ($6.integer(A.delay) && $6.inRange(A.delay, 0, 65535)) q.delay = [A.delay];
            else if (Array.isArray(A.delay) && A.delay.every($6.integer) && A.delay.every((K) => $6.inRange(K, 0, 65535))) q.delay = A.delay;
        else throw $6.invalidParameterError("delay", "integer or an array of integers between 0 and 65535", A.delay)
    }

    function c49(A) {
        if ($6.object(A)) {
            if ($6.defined(A.quality))
                if ($6.integer(A.quality) && $6.inRange(A.quality, 1, 100)) this.options.tiffQuality = A.quality;
                else throw $6.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            if ($6.defined(A.bitdepth))
                if ($6.integer(A.bitdepth) && $6.inArray(A.bitdepth, [1, 2, 4, 8])) this.options.tiffBitdepth = A.bitdepth;
                else throw $6.invalidParameterError("bitdepth", "1, 2, 4 or 8", A.bitdepth);
            if ($6.defined(A.tile)) this._setBooleanOption("tiffTile", A.tile);
            if ($6.defined(A.tileWidth))
                if ($6.integer(A.tileWidth) && A.tileWidth > 0) this.options.tiffTileWidth = A.tileWidth;
                else throw $6.invalidParameterError("tileWidth", "integer greater than zero", A.tileWidth);
            if ($6.defined(A.tileHeight))
                if ($6.integer(A.tileHeight) && A.tileHeight > 0) this.options.tiffTileHeight = A.tileHeight;
                else throw $6.invalidParameterError("tileHeight", "integer greater than zero", A.tileHeight);
            if ($6.defined(A.miniswhite)) this._setBooleanOption("tiffMiniswhite", A.miniswhite);
            if ($6.defined(A.pyramid)) this._setBooleanOption("tiffPyramid", A.pyramid);
            if ($6.defined(A.xres))
                if ($6.number(A.xres) && A.xres > 0) this.options.tiffXres = A.xres;
                else throw $6.invalidParameterError("xres", "number greater than zero", A.xres);
            if ($6.defined(A.yres))
                if ($6.number(A.yres) && A.yres > 0) this.options.tiffYres = A.yres;
                else throw $6.invalidParameterError("yres", "number greater than zero", A.yres);
            if ($6.defined(A.compression))
                if ($6.string(A.compression) && $6.inArray(A.compression, ["none", "jpeg", "deflate", "packbits", "ccittfax4", "lzw", "webp", "zstd", "jp2k"])) this.options.tiffCompression = A.compression;
                else throw $6.invalidParameterError("compression", "one of: none, jpeg, deflate, packbits, ccittfax4, lzw, webp, zstd, jp2k", A.compression);
            if ($6.defined(A.predictor))
                if ($6.string(A.predictor) && $6.inArray(A.predictor, ["none", "horizontal", "float"])) this.options.tiffPredictor = A.predictor;
                else throw $6.invalidParameterError("predictor", "one of: none, horizontal, float", A.predictor);
            if ($6.defined(A.resolutionUnit))
                if ($6.string(A.resolutionUnit) && $6.inArray(A.resolutionUnit, ["inch", "cm"])) this.options.tiffResolutionUnit = A.resolutionUnit;
                else throw $6.invalidParameterError("resolutionUnit", "one of: inch, cm", A.resolutionUnit)
        }
        return this._updateFormatOut("tiff", A)
    }

    function l49(A) {
        return this.heif({
            ...A,
            compression: "av1"
        })
    }

    function i49(A) {
        if ($6.object(A)) {
            if ($6.string(A.compression) && $6.inArray(A.compression, ["av1", "hevc"])) this.options.heifCompression = A.compression;
            else throw $6.invalidParameterError("compression", "one of: av1, hevc", A.compression);
            if ($6.defined(A.quality))
                if ($6.integer(A.quality) && $6.inRange(A.quality, 1, 100)) this.options.heifQuality = A.quality;
                else throw $6.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            if ($6.defined(A.lossless))
                if ($6.bool(A.lossless)) this.options.heifLossless = A.lossless;
                else throw $6.invalidParameterError("lossless", "boolean", A.lossless);
            if ($6.defined(A.effort))
                if ($6.integer(A.effort) && $6.inRange(A.effort, 0, 9)) this.options.heifEffort = A.effort;
                else throw $6.invalidParameterError("effort", "integer between 0 and 9", A.effort);
            if ($6.defined(A.chromaSubsampling))
                if ($6.string(A.chromaSubsampling) && $6.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.heifChromaSubsampling = A.chromaSubsampling;
                else throw $6.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling);
            if ($6.defined(A.bitdepth))
                if ($6.integer(A.bitdepth) && $6.inArray(A.bitdepth, [8, 10, 12])) {
                    if (A.bitdepth !== 8 && this.constructor.versions.heif) throw $6.invalidParameterError("bitdepth when using prebuilt binaries", 8, A.bitdepth);
                    this.options.heifBitdepth = A.bitdepth
                } else throw $6.invalidParameterError("bitdepth", "8, 10 or 12", A.bitdepth)
        } else throw $6.invalidParameterError("options", "Object", A);
        return this._updateFormatOut("heif", A)
    }

    function n49(A) {
        if ($6.object(A)) {
            if ($6.defined(A.quality))
                if ($6.integer(A.quality) && $6.inRange(A.quality, 1, 100)) this.options.jxlDistance = A.quality >= 30 ? 0.1 + (100 - A.quality) * 0.09 : 0.017666666666666667 * A.quality * A.quality - 1.15 * A.quality + 25;
                else throw $6.invalidParameterError("quality", "integer between 1 and 100", A.quality);
            else if ($6.defined(A.distance))
                if ($6.number(A.distance) && $6.inRange(A.distance, 0, 15)) this.options.jxlDistance = A.distance;
                else throw $6.invalidParameterError("distance", "number between 0.0 and 15.0", A.distance);
            if ($6.defined(A.decodingTier))
                if ($6.integer(A.decodingTier) && $6.inRange(A.decodingTier, 0, 4)) this.options.jxlDecodingTier = A.decodingTier;
                else throw $6.invalidParameterError("decodingTier", "integer between 0 and 4", A.decodingTier);
            if ($6.defined(A.lossless))
                if ($6.bool(A.lossless)) this.options.jxlLossless = A.lossless;
                else throw $6.invalidParameterError("lossless", "boolean", A.lossless);
            if ($6.defined(A.effort))
                if ($6.integer(A.effort) && $6.inRange(A.effort, 3, 9)) this.options.jxlEffort = A.effort;
                else throw $6.invalidParameterError("effort", "integer between 3 and 9", A.effort)
        }
        return this._updateFormatOut("jxl", A)
    }

    function r49(A) {
        if ($6.object(A)) {
            if ($6.defined(A.depth))
                if ($6.string(A.depth) && $6.inArray(A.depth, ["char", "uchar", "short", "ushort", "int", "uint", "float", "complex", "double", "dpcomplex"])) this.options.rawDepth = A.depth;
                else throw $6.invalidParameterError("depth", "one of: char, uchar, short, ushort, int, uint, float, complex, double, dpcomplex", A.depth)
        }
        return this._updateFormatOut("raw")
    }

    function o49(A) {
        if ($6.object(A)) {
            if ($6.defined(A.size))
                if ($6.integer(A.size) && $6.inRange(A.size, 1, 8192)) this.options.tileSize = A.size;
                else throw $6.invalidParameterError("size", "integer between 1 and 8192", A.size);
            if ($6.defined(A.overlap))
                if ($6.integer(A.overlap) && $6.inRange(A.overlap, 0, 8192)) {
                    if (A.overlap > this.options.tileSize) throw $6.invalidParameterError("overlap", `<= size (${this.options.tileSize})`, A.overlap);
                    this.options.tileOverlap = A.overlap
                } else throw $6.invalidParameterError("overlap", "integer between 0 and 8192", A.overlap);
            if ($6.defined(A.container))
                if ($6.string(A.container) && $6.inArray(A.container, ["fs", "zip"])) this.options.tileContainer = A.container;
                else throw $6.invalidParameterError("container", "one of: fs, zip", A.container);
            if ($6.defined(A.layout))
                if ($6.string(A.layout) && $6.inArray(A.layout, ["dz", "google", "iiif", "iiif3", "zoomify"])) this.options.tileLayout = A.layout;
                else throw $6.invalidParameterError("layout", "one of: dz, google, iiif, iiif3, zoomify", A.layout);
            if ($6.defined(A.angle))
                if ($6.integer(A.angle) && !(A.angle % 90)) this.options.tileAngle = A.angle;
                else throw $6.invalidParameterError("angle", "positive/negative multiple of 90", A.angle);
            if (this._setBackgroundColourOption("tileBackground", A.background), $6.defined(A.depth))
                if ($6.string(A.depth) && $6.inArray(A.depth, ["onepixel", "onetile", "one"])) this.options.tileDepth = A.depth;
                else throw $6.invalidParameterError("depth", "one of: onepixel, onetile, one", A.depth);
            if ($6.defined(A.skipBlanks))
                if ($6.integer(A.skipBlanks) && $6.inRange(A.skipBlanks, -1, 65535)) this.options.tileSkipBlanks = A.skipBlanks;
                else throw $6.invalidParameterError("skipBlanks", "integer between -1 and 255/65535", A.skipBlanks);
            else if ($6.defined(A.layout) && A.layout === "google") this.options.tileSkipBlanks = 5;
            let q = $6.bool(A.center) ? A.center : A.centre;
            if ($6.defined(q)) this._setBooleanOption("tileCentre", q);
            if ($6.defined(A.id))
                if ($6.string(A.id)) this.options.tileId = A.id;
                else throw $6.invalidParameterError("id", "string", A.id);
            if ($6.defined(A.basename))
                if ($6.string(A.basename)) this.options.tileBasename = A.basename;
                else throw $6.invalidParameterError("basename", "string", A.basename)
        }
        if ($6.inArray(this.options.formatOut, ["jpeg", "png", "webp"])) this.options.tileFormat = this.options.formatOut;
        else if (this.options.formatOut !== "input") throw $6.invalidParameterError("format", "one of: jpeg, png, webp", this.options.formatOut);
        return this._updateFormatOut("dz")
    }

    function a49(A) {
        if (!$6.plainObject(A)) throw $6.invalidParameterError("options", "object", A);
        if ($6.integer(A.seconds) && $6.inRange(A.seconds, 0, 3600)) this.options.timeoutSeconds = A.seconds;
        else throw $6.invalidParameterError("seconds", "integer between 0 and 3600", A.seconds);
        return this
    }

    function s49(A, q) {
        if (!($6.object(q) && q.force === !1)) this.options.formatOut = A;
        return this
    }

    function t49(A, q) {
        if ($6.bool(q)) this.options[A] = q;
        else throw $6.invalidParameterError(A, "boolean", q)
    }

    function e49() {
        if (!this.options.streamOut) {
            this.options.streamOut = !0;
            let A = Error();
            this._pipeline(void 0, A)
        }
    }

    function Aq9(A, q) {
        if (typeof A === "function") {
            if (this._isStreamInput()) this.on("finish", () => {
                this._flattenBufferIn(), jD1.pipeline(this.options, (K, Y, z) => {
                    if (K) A($6.nativeError(K, q));
                    else A(null, Y, z)
                })
            });
            else jD1.pipeline(this.options, (K, Y, z) => {
                if (K) A($6.nativeError(K, q));
                else A(null, Y, z)
            });
            return this
        } else if (this.options.streamOut) {
            if (this._isStreamInput()) {
                if (this.once("finish", () => {
                        this._flattenBufferIn(), jD1.pipeline(this.options, (K, Y, z) => {
                            if (K) this.emit("error", $6.nativeError(K, q));
                            else this.emit("info", z), this.push(Y);
                            this.push(null), this.on("end", () => this.emit("close"))
                        })
                    }), this.streamInFinished) this.emit("finish")
            } else jD1.pipeline(this.options, (K, Y, z) => {
                if (K) this.emit("error", $6.nativeError(K, q));
                else this.emit("info", z), this.push(Y);
                this.push(null), this.on("end", () => this.emit("close"))
            });
            return this
        } else if (this._isStreamInput()) return new Promise((K, Y) => {
            this.once("finish", () => {
                this._flattenBufferIn(), jD1.pipeline(this.options, (z, w, H) => {
                    if (z) Y($6.nativeError(z, q));
                    else if (this.options.resolveWithObject) K({
                        data: w,
                        info: H
                    });
                    else K(w)
                })
            })
        });
        else return new Promise((K, Y) => {
            jD1.pipeline(this.options, (z, w, H) => {
                if (z) Y($6.nativeError(z, q));
                else if (this.options.resolveWithObject) K({
                    data: w,
                    info: H
                });
                else K(w)
            })
        })
    }
    pT7.exports = function(A) {
        Object.assign(A.prototype, {
            toFile: C49,
            toBuffer: S49,
            keepExif: h49,
            withExif: I49,
            withExifMerge: x49,
            keepIccProfile: b49,
            withIccProfile: u49,
            keepMetadata: B49,
            withMetadata: m49,
            toFormat: F49,
            jpeg: Q49,
            jp2: d49,
            png: g49,
            webp: U49,
            tiff: c49,
            avif: l49,
            heif: i49,
            jxl: n49,
            gif: p49,
            raw: r49,
            tile: o49,
            timeout: a49,
            _updateFormatOut: s49,
            _setBooleanOption: t49,
            _read: e49,
            _pipeline: Aq9
        })
    }
})
// @from(Ln 194069, Col 4)
nT7 = R((rn2, iT7) => {
    var qq9 = h1("node:events"),
        O26 = lz6(),
        pL = ru(),
        {
            runtimePlatformArch: Kq9
        } = uHA(),
        OZ = $x1(),
        cT7 = Kq9(),
        rHA = OZ.libvipsVersion(),
        So = OZ.format();
    So.heif.output.alias = ["avif", "heic"];
    So.jpeg.output.alias = ["jpe", "jpg"];
    So.tiff.output.alias = ["tif"];
    So.jp2k.output.alias = ["j2c", "j2k", "jp2", "jpx"];
    var Yq9 = {
            nearest: "nearest",
            bilinear: "bilinear",
            bicubic: "bicubic",
            locallyBoundedBicubic: "lbb",
            nohalo: "nohalo",
            vertexSplitQuadraticBasisSpline: "vsqbs"
        },
        MD1 = {
            vips: rHA.semver
        };
    if (!rHA.isGlobal)
        if (!rHA.isWasm) try {
            MD1 = h1(`@img/sharp-${cT7}/versions`)
        } catch (A) {
            try {
                MD1 = h1(`@img/sharp-libvips-${cT7}/versions`)
            } catch (q) {}
        } else try {
            MD1 = (() => {
                throw new Error("Cannot require module " + "@img/sharp-wasm32/versions");
            })()
        } catch (A) {}
    MD1.sharp = xHA().version;
    if (MD1.heif && So.heif) So.heif.input.fileSuffix = [".avif"], So.heif.output.alias = ["avif"];

    function lT7(A) {
        if (pL.bool(A))
            if (A) return OZ.cache(50, 20, 100);
            else return OZ.cache(0, 0, 0);
        else if (pL.object(A)) return OZ.cache(A.memory, A.files, A.items);
        else return OZ.cache()
    }
    lT7(!0);

    function zq9(A) {
        return OZ.concurrency(pL.integer(A) ? A : null)
    }
    if (O26.familySync() === O26.GLIBC && !OZ._isUsingJemalloc()) OZ.concurrency(1);
    else if (O26.familySync() === O26.MUSL && OZ.concurrency() === 1024) OZ.concurrency(h1("node:os").availableParallelism());
    var wq9 = new qq9.EventEmitter;

    function Hq9() {
        return OZ.counters()
    }

    function $q9(A) {
        return OZ.simd(pL.bool(A) ? A : null)
    }

    function Oq9(A) {
        if (pL.object(A))
            if (Array.isArray(A.operation) && A.operation.every(pL.string)) OZ.block(A.operation, !0);
            else throw pL.invalidParameterError("operation", "Array<string>", A.operation);
        else throw pL.invalidParameterError("options", "object", A)
    }

    function _q9(A) {
        if (pL.object(A))
            if (Array.isArray(A.operation) && A.operation.every(pL.string)) OZ.block(A.operation, !1);
            else throw pL.invalidParameterError("operation", "Array<string>", A.operation);
        else throw pL.invalidParameterError("options", "object", A)
    }
    iT7.exports = function(A) {
        A.cache = lT7, A.concurrency = zq9, A.counters = Hq9, A.simd = $q9, A.format = So, A.interpolators = Yq9, A.versions = MD1, A.queue = wq9, A.block = Oq9, A.unblock = _q9
    }
})
// @from(Ln 194151, Col 4)
oHA = R((an2, rT7) => {
    var UU = qT7();
    NT7()(UU);
    RT7()(UU);
    CT7()(UU);
    IT7()(UU);
    uT7()(UU);
    mT7()(UU);
    dT7()(UU);
    nT7()(UU);
    rT7.exports = UU
})
// @from(Ln 194163, Col 0)
async function aHA() {
    if (_26) return _26.default;
    if (D9()) try {
        let K = await Promise.resolve().then(() => (vV7(), TV7)),
            Y = K.sharp || K.default;
        return _26 = {
            default: Y
        }, Y
    } catch {
        console.warn("Native image processor not available, falling back to sharp")
    }
    let A = await Promise.resolve().then(() => o(oHA(), 1)),
        q = A?.default || A;
    return _26 = {
        default: q
    }, q
}
// @from(Ln 194180, Col 4)
_26 = null
// @from(Ln 194181, Col 4)
oT7 = () => {}
// @from(Ln 194183, Col 0)
function Dq9(A) {
    if (A instanceof Error) {
        let K = A;
        if (K.code === "MODULE_NOT_FOUND" || K.code === "ERR_MODULE_NOT_FOUND" || K.code === "ERR_DLOPEN_FAILED") return aT7
    }
    let q = A instanceof Error ? A.message : String(A);
    if (q.includes("Native image processor module not available")) return aT7;
    if (q.includes("unsupported image format") || q.includes("Input buffer") || q.includes("Input file is missing") || q.includes("Input file has corrupt header")) return Jq9;
    return Xq9
}
// @from(Ln 194194, Col 0)
function pU(A) {
    if (A < 1024) return `${A} B`;
    if (A < 1048576) return `${(A/1024).toFixed(1)} KB`;
    return `${(A/1048576).toFixed(1)} MB`
}
// @from(Ln 194199, Col 0)
async function eu(A, q, K) {
    try {
        let Y = await aHA(),
            w = await Y(A).metadata(),
            H = w.format ?? K,
            $ = H === "jpg" ? "jpeg" : H;
        if (!w.width || !w.height) {
            if (q > pS) return {
                buffer: await Y(A).jpeg({
                    quality: 80
                }).toBuffer(),
                mediaType: "jpeg"
            };
            return {
                buffer: A,
                mediaType: $
            }
        }
        let {
            width: O,
            height: _
        } = w, J = O, X = _;
        if (q <= pS && J <= KD1 && X <= YD1) return {
            buffer: A,
            mediaType: $,
            dimensions: {
                originalWidth: O,
                originalHeight: _,
                displayWidth: J,
                displayHeight: X
            }
        };
        let D = J > KD1 || X > YD1,
            j = $ === "png";
        if (!D && q > pS) {
            if (j) {
                let P = await Y(A).png({
                    compressionLevel: 9,
                    palette: !0
                }).toBuffer();
                if (P.length <= pS) return {
                    buffer: P,
                    mediaType: "png",
                    dimensions: {
                        originalWidth: O,
                        originalHeight: _,
                        displayWidth: J,
                        displayHeight: X
                    }
                }
            }
            for (let P of [80, 60, 40, 20]) {
                let W = await Y(A).jpeg({
                    quality: P
                }).toBuffer();
                if (W.length <= pS) return {
                    buffer: W,
                    mediaType: "jpeg",
                    dimensions: {
                        originalWidth: O,
                        originalHeight: _,
                        displayWidth: J,
                        displayHeight: X
                    }
                }
            }
        }
        if (J > KD1) X = Math.round(X * KD1 / J), J = KD1;
        if (X > YD1) J = Math.round(J * YD1 / X), X = YD1;
        h(`Resizing to ${J}x${X}`);
        let M = await Y(A).resize(J, X, {
            fit: "inside",
            withoutEnlargement: !0
        }).toBuffer();
        if (M.length > pS) {
            if (j) {
                let f = await Y(A).resize(J, X, {
                    fit: "inside",
                    withoutEnlargement: !0
                }).png({
                    compressionLevel: 9,
                    palette: !0
                }).toBuffer();
                if (f.length <= pS) return {
                    buffer: f,
                    mediaType: "png",
                    dimensions: {
                        originalWidth: O,
                        originalHeight: _,
                        displayWidth: J,
                        displayHeight: X
                    }
                }
            }
            for (let f of [80, 60, 40, 20]) {
                let Z = await Y(A).resize(J, X, {
                    fit: "inside",
                    withoutEnlargement: !0
                }).jpeg({
                    quality: f
                }).toBuffer();
                if (Z.length <= pS) return {
                    buffer: Z,
                    mediaType: "jpeg",
                    dimensions: {
                        originalWidth: O,
                        originalHeight: _,
                        displayWidth: J,
                        displayHeight: X
                    }
                }
            }
            let P = Math.min(J, 1000),
                W = Math.round(X * P / Math.max(J, 1));
            h("Still too large, compressing with JPEG");
            let G = await Y(A).resize(P, W, {
                fit: "inside",
                withoutEnlargement: !0
            }).jpeg({
                quality: 20
            }).toBuffer();
            return h(`JPEG compressed buffer size: ${G.length}`), {
                buffer: G,
                mediaType: "jpeg",
                dimensions: {
                    originalWidth: O,
                    originalHeight: _,
                    displayWidth: P,
                    displayHeight: W
                }
            }
        }
        return {
            buffer: M,
            mediaType: $,
            dimensions: {
                originalWidth: O,
                originalHeight: _,
                displayWidth: J,
                displayHeight: X
            }
        }
    } catch (Y) {
        K1(Y);
        let z = Dq9(Y);
        c("tengu_image_resize_failed", {
            original_size_bytes: q,
            error_type: z
        });
        let H = PD1(A).slice(6),
            $ = Math.ceil(q * 4 / 3);
        if ($ <= qD1) return c("tengu_image_resize_fallback", {
            original_size_bytes: q,
            base64_size_bytes: $,
            error_type: z
        }), {
            buffer: A,
            mediaType: H
        };
        throw new e41(`Unable to resize image (${pU(q)} raw, ${pU($)} base64). The image exceeds the 5MB API limit and compression failed. Please resize the image manually or use a smaller image.`)
    }
}
// @from(Ln 194361, Col 0)
async function Aq1(A) {
    if (A.source.type !== "base64") return {
        block: A
    };
    let q = Buffer.from(A.source.data, "base64"),
        K = q.length,
        z = A.source.media_type?.split("/")[1] || "png",
        w = await eu(q, K, z);
    return {
        block: {
            type: "image",
            source: {
                type: "base64",
                media_type: `image/${w.mediaType}`,
                data: w.buffer.toString("base64")
            }
        },
        dimensions: w.dimensions
    }
}
// @from(Ln 194381, Col 0)
async function J26(A, q = pS, K) {
    let Y = K?.split("/")[1] || "jpeg",
        z = Y === "jpg" ? "jpeg" : Y;
    try {
        let w = await aHA(),
            H = await w(A).metadata(),
            $ = H.format || z,
            O = A.length,
            _ = {
                imageBuffer: A,
                metadata: H,
                format: $,
                maxBytes: q,
                originalSize: O
            };
        if (O <= q) return Dx1(A, $, O);
        let J = await jq9(_, w);
        if (J) return J;
        if ($ === "png") {
            let D = await Pq9(_, w);
            if (D) return D
        }
        let X = await Wq9(_, 50, w);
        if (X) return X;
        return await Gq9(_, w)
    } catch (w) {
        if (K1(w), c("tengu_image_compress_failed", {
                original_size_bytes: A.length,
                max_bytes: q
            }), A.length <= q) {
            let H = PD1(A);
            return {
                base64: A.toString("base64"),
                mediaType: H,
                originalSize: A.length
            }
        }
        throw new e41(`Unable to compress image (${pU(A.length)}) to fit within ${pU(q)}. Please use a smaller image.`)
    }
}
// @from(Ln 194421, Col 0)
async function sT7(A, q, K) {
    let Y = Math.floor(q / 0.125),
        z = Math.floor(Y * 0.75);
    return J26(A, z, K)
}
// @from(Ln 194426, Col 0)
async function tT7(A, q = pS) {
    if (A.source.type !== "base64") return A;
    let K = Buffer.from(A.source.data, "base64");
    if (K.length <= q) return A;
    let Y = await J26(K, q);
    return {
        type: "image",
        source: {
            type: "base64",
            media_type: Y.mediaType,
            data: Y.base64
        }
    }
}
// @from(Ln 194441, Col 0)
function Dx1(A, q, K) {
    let Y = q === "jpg" ? "jpeg" : q;
    return {
        base64: A.toString("base64"),
        mediaType: `image/${Y}`,
        originalSize: K
    }
}
// @from(Ln 194449, Col 0)
async function jq9(A, q) {
    let K = [1, 0.75, 0.5, 0.25];
    for (let Y of K) {
        let z = Math.round((A.metadata.width || 2000) * Y),
            w = Math.round((A.metadata.height || 2000) * Y),
            H = q(A.imageBuffer).resize(z, w, {
                fit: "inside",
                withoutEnlargement: !0
            });
        H = Mq9(H, A.format);
        let $ = await H.toBuffer();
        if ($.length <= A.maxBytes) return Dx1($, A.format, A.originalSize)
    }
    return null
}
// @from(Ln 194465, Col 0)
function Mq9(A, q) {
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
// @from(Ln 194485, Col 0)
async function Pq9(A, q) {
    let K = await q(A.imageBuffer).resize(800, 800, {
        fit: "inside",
        withoutEnlargement: !0
    }).png({
        compressionLevel: 9,
        palette: !0,
        colors: 64
    }).toBuffer();
    if (K.length <= A.maxBytes) return Dx1(K, "png", A.originalSize);
    return null
}
// @from(Ln 194497, Col 0)
async function Wq9(A, q, K) {
    let Y = await K(A.imageBuffer).resize(600, 600, {
        fit: "inside",
        withoutEnlargement: !0
    }).jpeg({
        quality: q
    }).toBuffer();
    if (Y.length <= A.maxBytes) return Dx1(Y, "jpeg", A.originalSize);
    return null
}
// @from(Ln 194507, Col 0)
async function Gq9(A, q) {
    let K = await q(A.imageBuffer).resize(400, 400, {
        fit: "inside",
        withoutEnlargement: !0
    }).jpeg({
        quality: 20
    }).toBuffer();
    return Dx1(K, "jpeg", A.originalSize)
}
// @from(Ln 194517, Col 0)
function PD1(A) {
    if (A.length < 4) return "image/png";
    if (A[0] === 137 && A[1] === 80 && A[2] === 78 && A[3] === 71) return "image/png";
    if (A[0] === 255 && A[1] === 216 && A[2] === 255) return "image/jpeg";
    if (A[0] === 71 && A[1] === 73 && A[2] === 70) return "image/gif";
    if (A[0] === 82 && A[1] === 73 && A[2] === 70 && A[3] === 70) {
        if (A.length >= 12 && A[8] === 87 && A[9] === 69 && A[10] === 66 && A[11] === 80) return "image/webp"
    }
    return "image/png"
}
// @from(Ln 194528, Col 0)
function sHA(A) {
    try {
        let q = Buffer.from(A, "base64");
        return PD1(q)
    } catch {
        return "image/png"
    }
}
// @from(Ln 194537, Col 0)
function WD1(A, q) {
    let {
        originalWidth: K,
        originalHeight: Y,
        displayWidth: z,
        displayHeight: w
    } = A;
    if (!K || !Y || !z || !w || z <= 0 || w <= 0) {
        if (q) return `[Image source: ${q}]`;
        return null
    }
    let H = K !== z || Y !== w;
    if (!H && !q) return null;
    let $ = [];
    if (q) $.push(`source: ${q}`);
    if (H) {
        let O = K / z;
        $.push(`original ${K}x${Y}, displayed at ${z}x${w}. Multiply coordinates by ${O.toFixed(2)} to map to original image.`)
    }
    return `[Image: ${$.join(", ")}]`
}
// @from(Ln 194558, Col 4)
aT7 = 1
// @from(Ln 194559, Col 4)
Jq9 = 2
// @from(Ln 194560, Col 4)
Xq9 = 3
// @from(Ln 194561, Col 4)
e41
// @from(Ln 194562, Col 4)
dL = v(() => {
    y6();
    Z6();
    u6();
    oT7();
    o41();
    e41 = class e41 extends Error {
        constructor(A) {
            super(A);
            this.name = "ImageResizeError"
        }
    }
})
// @from(Ln 194576, Col 0)
function Zq9(A) {
    if (typeof A !== "object" || A === null) return !1;
    let q = A;
    if (q.type !== "image") return !1;
    if (typeof q.source !== "object" || q.source === null) return !1;
    let K = q.source;
    return K.type === "base64" && typeof K.data === "string"
}
// @from(Ln 194585, Col 0)
function eT7(A) {
    let q = [],
        K = 0;
    for (let Y of A) {
        if (typeof Y !== "object" || Y === null) continue;
        let z = Y;
        if (z.type !== "user") continue;
        let w = z.message;
        if (!w) continue;
        let H = w.content;
        if (typeof H === "string" || !Array.isArray(H)) continue;
        for (let $ of H)
            if (Zq9($)) {
                K++;
                let O = $.source.data.length;
                if (O > qD1) c("tengu_image_api_validation_failed", {
                    base64_size_bytes: O,
                    max_bytes: qD1
                }), q.push({
                    index: K,
                    size: O
                })
            }
    }
    if (q.length > 0) throw new GD1(q, qD1)
}
// @from(Ln 194611, Col 4)
GD1
// @from(Ln 194612, Col 4)
X26 = v(() => {
    u6();
    o41();
    dL();
    GD1 = class GD1 extends Error {
        constructor(A, q) {
            let K, Y = A[0];
            if (A.length === 1 && Y) K = `Image base64 size (${pU(Y.size)}) exceeds API limit (${pU(q)}). Please resize the image before sending.`;
            else K = `${A.length} images exceed the API limit (${pU(q)}): ` + A.map((z) => `Image ${z.index}: ${pU(z.size)}`).join(", ") + ". Please resize these images before sending.";
            super(K);
            this.name = "ImageSizeError"
        }
    }
})
// @from(Ln 194627, Col 0)
function eHA() {
    let A = `max ${fV7} pages, ${L2(zD1)}`;
    return w4() ? `PDF too large (${A}). Try reading the file a different way (e.g., extract text with pdftotext).` : `PDF too large (${A}). Double press esc to go back and try again, or use pdftotext to convert to text first.`
}
// @from(Ln 194632, Col 0)
function A$A() {
    return w4() ? "PDF is password protected. Try using a CLI tool to extract or convert the PDF." : "PDF is password protected. Please double press esc to edit your message and try again."
}
// @from(Ln 194636, Col 0)
function D26() {
    return w4() ? "Image was too large. Try resizing the image or using a different approach." : "Image was too large. Double press esc to go back and try again with a smaller image."
}
// @from(Ln 194640, Col 0)
function q$A() {
    let A = `max ${L2(zD1)}`;
    return w4() ? `Request too large (${A}). Try with a smaller file.` : `Request too large (${A}). Double press esc to go back and try with a smaller file.`
}
// @from(Ln 194645, Col 0)
function Vq9() {
    return w4() ? "Your account does not have access to Claude. Please login again or contact your administrator." : W26
}
// @from(Ln 194649, Col 0)
function Nq9() {
    return w4() ? "Your organization does not have access to Claude. Please login again or contact your administrator." : fq9
}
// @from(Ln 194653, Col 0)
function Tq9(A, q, K) {
    try {
        let Y = -1;
        for (let $ = 0; $ < K.length; $++) {
            let O = K[$];
            if (!O) continue;
            let _ = O.message.content;
            if (Array.isArray(_)) {
                for (let J of _)
                    if (J.type === "tool_use" && "id" in J && J.id === A) {
                        Y = $;
                        break
                    }
            }
            if (Y !== -1) break
        }
        let z = -1;
        for (let $ = 0; $ < q.length; $++) {
            let O = q[$];
            if (!O) continue;
            if (O.type === "assistant" && "message" in O) {
                let _ = O.message.content;
                if (Array.isArray(_)) {
                    for (let J of _)
                        if (J.type === "tool_use" && "id" in J && J.id === A) {
                            z = $;
                            break
                        }
                }
            }
            if (z !== -1) break
        }
        let w = [];
        for (let $ = Y + 1; $ < K.length; $++) {
            let O = K[$];
            if (!O) continue;
            let _ = O.message.content;
            if (Array.isArray(_))
                for (let J of _) {
                    let X = O.message.role;
                    if (J.type === "tool_use" && "id" in J) w.push(`${X}:tool_use:${J.id}`);
                    else if (J.type === "tool_result" && "tool_use_id" in J) w.push(`${X}:tool_result:${J.tool_use_id}`);
                    else if (J.type === "text") w.push(`${X}:text`);
                    else if (J.type === "thinking") w.push(`${X}:thinking`);
                    else if (J.type === "image") w.push(`${X}:image`);
                    else w.push(`${X}:${J.type}`)
                } else if (typeof _ === "string") w.push(`${O.message.role}:string_content`)
        }
        let H = [];
        for (let $ = z + 1; $ < q.length; $++) {
            let O = q[$];
            if (!O) continue;
            switch (O.type) {
                case "user":
                case "assistant": {
                    if ("message" in O) {
                        let _ = O.message.content;
                        if (Array.isArray(_))
                            for (let J of _) {
                                let X = O.message.role;
                                if (J.type === "tool_use" && "id" in J) H.push(`${X}:tool_use:${J.id}`);
                                else if (J.type === "tool_result" && "tool_use_id" in J) H.push(`${X}:tool_result:${J.tool_use_id}`);
                                else if (J.type === "text") H.push(`${X}:text`);
                                else if (J.type === "thinking") H.push(`${X}:thinking`);
                                else if (J.type === "image") H.push(`${X}:image`);
                                else H.push(`${X}:${J.type}`)
                            } else if (typeof _ === "string") H.push(`${O.message.role}:string_content`)
                    }
                    break
                }
                case "attachment":
                    if ("attachment" in O) H.push(`attachment:${O.attachment.type}`);
                    break;
                case "system":
                    if ("subtype" in O) H.push(`system:${O.subtype}`);
                    break;
                case "progress":
                    if ("progress" in O && O.progress && typeof O.progress === "object" && "type" in O.progress) H.push(`progress:${O.progress.type??"unknown"}`);
                    else H.push("progress:unknown");
                    break
            }
        }
        c("tengu_tool_use_tool_result_mismatch_error", {
            toolUseId: A,
            normalizedSequence: w.join(", "),
            preNormalizedSequence: H.join(", "),
            normalizedMessageCount: K.length,
            originalMessageCount: q.length,
            normalizedToolUseIndex: Y,
            originalToolUseIndex: z
        })
    } catch (Y) {}
}
// @from(Ln 194747, Col 0)
function Z26(A, q, K) {
    if (A instanceof Au || A instanceof OW && A.message.toLowerCase().includes("timeout")) return pY({
        content: G26,
        error: "unknown"
    });
    if (A instanceof GD1 || A instanceof e41) return pY({
        content: D26()
    });
    if (A instanceof Error && A.message.includes(qq1)) return pY({
        content: qq1,
        error: "rate_limit"
    });
    if (A instanceof k4 && A.status === 429 && eX1(i8())) {
        let Y = A.headers?.get?.("anthropic-ratelimit-unified-representative-claim"),
            z = A.headers?.get?.("anthropic-ratelimit-unified-overage-status");
        if (Y || z) {
            let w = {
                    status: "rejected",
                    unifiedRateLimitFallbackAvailable: !1,
                    isUsingOverage: !1
                },
                H = A.headers?.get?.("anthropic-ratelimit-unified-reset");
            if (H) w.resetsAt = Number(H);
            if (Y) w.rateLimitType = Y;
            if (z) w.overageStatus = z;
            let $ = A.headers?.get?.("anthropic-ratelimit-unified-overage-reset");
            if ($) w.overageResetsAt = Number($);
            let O = A.headers?.get?.("anthropic-ratelimit-unified-overage-disabled-reason");
            if (O) w.overageDisabledReason = O;
            let _ = ZHA(w, q);
            if (_) return pY({
                content: _,
                error: "rate_limit"
            });
            return pY({
                content: Kq1,
                error: "rate_limit"
            })
        }
        return pY({
            content: `${QO}: Rate limit reached`,
            error: "rate_limit"
        })
    }
    if (A instanceof Error && A.message.toLowerCase().includes("prompt is too long")) return pY({
        content: dU,
        error: "invalid_request"
    });
    if (A instanceof Error && /maximum of \d+ PDF pages/.test(A.message)) return pY({
        content: eHA(),
        error: "invalid_request"
    });
    if (A instanceof Error && A.message.includes("The PDF specified is password protected")) return pY({
        content: A$A(),
        error: "invalid_request"
    });
    if (A instanceof k4 && A.status === 400 && A.message.includes("image exceeds") && A.message.includes("maximum")) return pY({
        content: D26()
    });
    if (A instanceof k4 && A.status === 413) return pY({
        content: q$A(),
        error: "invalid_request"
    });
    if (A instanceof k4 && A.status === 400 && A.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after")) {
        if (K?.messages && K?.messagesForAPI) {
            let Y = A.message.match(/toolu_[a-zA-Z0-9]+/),
                z = Y ? Y[0] : null;
            if (z) Tq9(z, K.messages, K.messagesForAPI)
        } {
            let z = w4() ? "" : " Run /rewind to recover the conversation.";
            return pY({
                content: "API Error: 400 due to tool use concurrency issues." + z,
                error: "invalid_request"
            })
        }
    }
    if (A instanceof k4 && A.status === 400 && A.message.includes("unexpected `tool_use_id` found in `tool_result`")) c("tengu_unexpected_tool_result", {});
    if (i8() && A instanceof k4 && A.status === 400 && A.message.toLowerCase().includes("invalid model name") && (p_1(q) || q === "opus")) return pY({
        content: "Claude Opus is not available with the Claude Pro plan. If you have updated your subscription plan recently, run /logout and /login for the plan to take effect.",
        error: "invalid_request"
    });
    if (A instanceof Error && A.message.includes("Your credit balance is too low")) return pY({
        content: j26,
        error: "billing_error"
    });
    if (A instanceof Error && A.message.toLowerCase().includes("x-api-key")) {
        let {
            source: Y
        } = yO();
        return pY({
            error: "authentication_failed",
            content: Y === "ANTHROPIC_API_KEY" || Y === "apiKeyHelper" ? P26 : M26
        })
    }
    if (A instanceof k4 && A.status === 403 && A.message.includes("OAuth token has been revoked")) return pY({
        error: "authentication_failed",
        content: Vq9()
    });
    if (A instanceof k4 && (A.status === 401 || A.status === 403) && A.message.includes("OAuth authentication is currently not allowed for this organization")) return pY({
        error: "authentication_failed",
        content: Nq9()
    });
    if (A instanceof k4 && (A.status === 401 || A.status === 403)) return pY({
        error: "authentication_failed",
        content: w4() ? `Failed to authenticate. ${QO}: ${A.message}` : `${QO}: ${A.message} · Please run /login`
    });
    if (J6(process.env.CLAUDE_CODE_USE_BEDROCK) && A instanceof Error && A.message.toLowerCase().includes("model id")) return pY({
        content: `${QO} (${q}): ${A.message}`,
        error: "invalid_request"
    });
    if (A instanceof k4 && A.status === 404) return pY({
        content: w4() ? `There's an issue with the selected model (${q}). It may not exist or you may not have access to it. Use --model to pick a different model.` : `There's an issue with the selected model (${q}). It may not exist or you may not have access to it. Run /model to pick a different model.`,
        error: "invalid_request"
    });
    if (A instanceof OW) return pY({
        content: `${QO}: ${Uz6(A)}`,
        error: "unknown"
    });
    if (A instanceof Error) return pY({
        content: `${QO}: ${A.message}`,
        error: "unknown"
    });
    return pY({
        content: QO,
        error: "unknown"
    })
}
// @from(Ln 194875, Col 0)
function Av7(A) {
    if (A instanceof Error && A.message === "Request was aborted.") return "aborted";
    if (A instanceof Au || A instanceof OW && A.message.toLowerCase().includes("timeout")) return "api_timeout";
    if (A instanceof Error && A.message.includes(tHA)) return "repeated_529";
    if (A instanceof Error && A.message.includes(qq1)) return "capacity_off_switch";
    if (A instanceof k4 && A.status === 429) return "rate_limit";
    if (A instanceof k4 && (A.status === 529 || A.message?.includes('"type":"overloaded_error"'))) return "server_overload";
    if (A instanceof Error && A.message.toLowerCase().includes(dU.toLowerCase())) return "prompt_too_long";
    if (A instanceof Error && /maximum of \d+ PDF pages/.test(A.message)) return "pdf_too_large";
    if (A instanceof Error && A.message.includes("The PDF specified is password protected")) return "pdf_password_protected";
    if (A instanceof k4 && A.status === 400 && A.message.includes("image exceeds") && A.message.includes("maximum")) return "image_too_large";
    if (A instanceof k4 && A.status === 400 && A.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after")) return "tool_use_mismatch";
    if (A instanceof k4 && A.status === 400 && A.message.includes("unexpected `tool_use_id` found in `tool_result`")) return "unexpected_tool_result";
    if (A instanceof k4 && A.status === 400 && A.message.toLowerCase().includes("invalid model name")) return "invalid_model";
    if (A instanceof Error && A.message.toLowerCase().includes(j26.toLowerCase())) return "credit_balance_low";
    if (A instanceof Error && A.message.toLowerCase().includes("x-api-key")) return "invalid_api_key";
    if (A instanceof k4 && A.status === 403 && A.message.includes("OAuth token has been revoked")) return "token_revoked";
    if (A instanceof k4 && (A.status === 401 || A.status === 403) && A.message.includes("OAuth authentication is currently not allowed for this organization")) return "oauth_org_not_allowed";
    if (A instanceof k4 && (A.status === 401 || A.status === 403)) return "auth_error";
    if (J6(process.env.CLAUDE_CODE_USE_BEDROCK) && A instanceof Error && A.message.toLowerCase().includes("model id")) return "bedrock_model_access";
    if (A instanceof k4) {
        let q = A.status;
        if (q >= 500) return "server_error";
        if (q >= 400) return "client_error"
    }
    if (A instanceof OW) {
        if (Kx1(A)?.isSSLError) return "ssl_cert_error";
        return "connection_error"
    }
    return "unknown"
}
// @from(Ln 194907, Col 0)
function qv7(A, q) {
    if (A !== "refusal") return;
    c("tengu_refusal_api_response", {});
    let K = w4() ? `${QO}: Claude Code is unable to respond to this request, which appears to violate our Usage Policy (https://www.anthropic.com/legal/aup). Try rephrasing the request or attempting a different approach.` : `${QO}: Claude Code is unable to respond to this request, which appears to violate our Usage Policy (https://www.anthropic.com/legal/aup). Please double press esc to edit your last message or start a new session for Claude Code to assist with a different task.`;
    return pY({
        content: K + (q !== "claude-sonnet-4-20250514" ? " If you are seeing this refusal repeatedly, try running /model claude-sonnet-4-20250514 to switch models." : ""),
        error: "invalid_request"
    })
}
// @from(Ln 194916, Col 4)
QO = "API Error"
// @from(Ln 194917, Col 4)
dU = "Prompt is too long"
// @from(Ln 194918, Col 4)
j26 = "Credit balance is too low"
// @from(Ln 194919, Col 4)
M26 = "Not logged in · Please run /login"
// @from(Ln 194920, Col 4)
P26 = "Invalid API key · Fix external API key"
// @from(Ln 194921, Col 4)
W26 = "OAuth token revoked · Please run /login"
// @from(Ln 194922, Col 4)
tHA = "Repeated 529 Overloaded errors"
// @from(Ln 194923, Col 4)
qq1 = "Opus is experiencing high load, please use /model to switch to Sonnet"
// @from(Ln 194924, Col 4)
G26 = "Request timed out"
// @from(Ln 194925, Col 4)
fq9 = "Your account does not have access to Claude Code. Please run /login."
// @from(Ln 194926, Col 4)
AB = v(() => {
    GV();
    J7();
    N8();
    e7();
    u6();
    nu();
    qx1();
    hA();
    B6();
    o41();
    wq();
    QU();
    X26();
    dL()
})
// @from(Ln 194942, Col 0)
async function* V26(A, q, K) {
    let Y = Cq9(K),
        z = {
            model: K.model,
            maxThinkingTokens: K.maxThinkingTokens,
            ...i4() ? {
                fastMode: K.fastMode
            } : {}
        },
        w = null,
        H = 0,
        $;
    for (let O = 1; O <= Y + 1; O++) {
        if (K.signal?.aborted) throw new Oz;
        let _ = i4() ? z.fastMode && !Kv() : !1;
        try {
            if (w === null || $ instanceof k4 && $.status === 401 || wv7($)) {
                if ($ instanceof k4 && $.status === 401) {
                    let J = a4()?.accessToken;
                    if (J) await EO1(J)
                }
                w = await A()
            }
            return await q(w, O, z)
        } catch (J) {
            if ($ = J, h(`API error (attempt ${O}/${Y+1}): ${J instanceof k4?`${J.status} ${J.message}`:J instanceof Error?J.message:String(J)}`, {
                    level: "error"
                }), _ && J instanceof k4 && (J.status === 429 || Kv7(J))) {
                let M = J.headers?.get("anthropic-ratelimit-unified-overage-disabled-reason");
                if (M !== null && M !== void 0) {
                    Z17(M), z.fastMode = !1;
                    continue
                }
                let P = xq9(J);
                if (P !== null && P < hq9) {
                    await dS(P, K.signal);
                    continue
                }
                let W = Math.max(P ?? Sq9, Iq9);
                if (P17(Date.now() + W), i4()) z.fastMode = !1;
                continue
            }
            if (_ && Lq9(J)) {
                W17(), z.fastMode = !1;
                continue
            }
            if (Kv7(J) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !i8() && p_1(K.model))) {
                if (H++, H >= Eq9) {
                    if (K.fallbackModel) throw c("tengu_api_opus_fallback_triggered", {
                        original_model: K.model,
                        fallback_model: K.fallbackModel,
                        provider: qb()
                    }), new f26(K.model, K.fallbackModel);
                    if (!process.env.IS_SANDBOX) throw c("tengu_api_custom_529_overloaded_error", {}), new qB(Error(tHA), z)
                }
            }
            if (O > Y) throw new qB(J, z);
            if (!Rq9(J) && (!(J instanceof k4) || !yq9(J))) throw new qB(J, z);
            if (J instanceof k4) {
                let M = zv7(J);
                if (M) {
                    let {
                        inputTokens: P,
                        contextLimit: W
                    } = M, G = 1000, f = Math.max(0, W - P - 1000);
                    if (f < K$A) throw K1(Error(`availableContext ${f} is less than FLOOR_OUTPUT_TOKENS ${K$A}`)), J;
                    let Z = (z.maxThinkingTokens || 0) + 1,
                        N = Math.max(K$A, f, Z);
                    z.maxTokensOverride = N, c("tengu_max_tokens_context_overflow_adjustment", {
                        inputTokens: P,
                        contextLimit: W,
                        adjustedMaxTokens: N,
                        attempt: O
                    });
                    continue
                }
            }
            let D = Yv7(J),
                j = cU(O, D);
            if (J instanceof k4) yield Hv7(J, j, O, Y);
            c("tengu_api_retry", {
                attempt: O,
                delayMs: j,
                error: J.message,
                status: J.status,
                provider: qb()
            }), await dS(j, K.signal)
        }
    }
    throw new qB($, z)
}
// @from(Ln 195034, Col 0)
function Yv7(A) {
    return (A.headers?.["retry-after"] || A.headers?.get?.("retry-after")) ?? null
}
// @from(Ln 195038, Col 0)
function cU(A, q) {
    if (q) {
        let z = parseInt(q, 10);
        if (!isNaN(z)) return z * 1000
    }
    let K = Math.min(kq9 * Math.pow(2, A - 1), 32000),
        Y = Math.random() * 0.25 * K;
    return K + Y
}
// @from(Ln 195048, Col 0)
function zv7(A) {
    if (A.status !== 400 || !A.message) return;
    if (!A.message.includes("input length and `max_tokens` exceed context limit")) return;
    let q = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/,
        K = A.message.match(q);
    if (!K || K.length !== 4) return;
    if (!K[1] || !K[2] || !K[3]) {
        K1(Error("Unable to parse max_tokens from max_tokens exceed context limit error message"));
        return
    }
    let Y = parseInt(K[1], 10),
        z = parseInt(K[2], 10),
        w = parseInt(K[3], 10);
    if (isNaN(Y) || isNaN(z) || isNaN(w)) return;
    return {
        inputTokens: Y,
        maxTokens: z,
        contextLimit: w
    }
}
// @from(Ln 195069, Col 0)
function Lq9(A) {
    if (!(A instanceof k4)) return !1;
    return A.status === 400 && (A.message?.includes("Fast mode is not enabled") ?? !1)
}
// @from(Ln 195074, Col 0)
function Kv7(A) {
    if (!(A instanceof k4)) return !1;
    return A.status === 529 || (A.message?.includes('"type":"overloaded_error"') ?? !1)
}
// @from(Ln 195079, Col 0)
function wv7(A) {
    if (J6(process.env.CLAUDE_CODE_USE_BEDROCK)) {
        if (XR8(A) || A instanceof k4 && A.status === 403) return !0
    }
    return !1
}
// @from(Ln 195086, Col 0)
function Rq9(A) {
    if (wv7(A)) return n86(), !0;
    return !1
}
// @from(Ln 195091, Col 0)
function yq9(A) {
    if (MV7(A)) return !1;
    if (A.message?.includes('"type":"overloaded_error"')) return !0;
    if (zv7(A)) return !0;
    let q = A.headers?.get("x-should-retry");
    if (q === "true" && !i8()) return !0;
    if (q === "false") {
        let K = A.status !== void 0 && A.status >= 500;
        return !1
    }
    if (A instanceof OW) return !0;
    if (!A.status) return !1;
    if (A.status === 408) return !0;
    if (A.status === 409) return !0;
    if (A.status === 429) return !i8();
    if (A.status === 401) return i86(), !0;
    if (A.status && A.status >= 500) return !0;
    return !1
}
// @from(Ln 195111, Col 0)
function Cq9(A) {
    if (A.maxRetries) return A.maxRetries;
    if (process.env.CLAUDE_CODE_MAX_RETRIES) return parseInt(process.env.CLAUDE_CODE_MAX_RETRIES, 10);
    return vq9
}
// @from(Ln 195117, Col 0)
function xq9(A) {
    let q = Yv7(A);
    if (q) {
        let K = parseInt(q, 10);
        if (!isNaN(K)) return K * 1000
    }
    return null
}
// @from(Ln 195125, Col 4)
vq9 = 10
// @from(Ln 195126, Col 4)
K$A = 3000
// @from(Ln 195127, Col 4)
Eq9 = 3
// @from(Ln 195128, Col 4)
kq9 = 500
// @from(Ln 195129, Col 4)
qB
// @from(Ln 195129, Col 8)
f26
// @from(Ln 195129, Col 13)
Sq9 = 1800000
// @from(Ln 195130, Col 4)
hq9 = 20000
// @from(Ln 195131, Col 4)
Iq9 = 600000
// @from(Ln 195132, Col 4)
Yq1 = v(() => {
    GV();
    y6();
    Z6();
    e7();
    UH();
    J7();
    u6();
    AB();
    zn6();
    qx1();
    N8();
    QU();
    hA();
    OJ();
    qB = class qB extends Error {
        originalError;
        retryContext;
        constructor(A, q) {
            let K = A instanceof Error ? A.message : String(A);
            super(K);
            this.originalError = A;
            this.retryContext = q;
            if (this.name = "RetryError", A instanceof Error && A.stack) this.stack = A.stack
        }
    };
    f26 = class f26 extends Error {
        originalModel;
        fallbackModel;
        constructor(A, q) {
            super(`Model fallback triggered: ${A} -> ${q}`);
            this.originalModel = A;
            this.fallbackModel = q;
            this.name = "FallbackTriggeredError"
        }
    }
})
// @from(Ln 195180, Col 0)
function mq9(A) {
    return A instanceof Error
}
// @from(Ln 195184, Col 0)
function _v7() {
    if (zq1) return;
    if (KB()) zq1 = new Promise((A) => {
        lU = A, setTimeout(() => {
            if (lU) h("Policy limits: Loading promise timed out, resolving anyway"), lU(), lU = null
        }, Uq9)
    })
}
// @from(Ln 195193, Col 0)
function N26() {
    return bq9(O8(), Fq9)
}
// @from(Ln 195197, Col 0)
function pq9() {
    return `${P4().BASE_API_URL}/api/claude_code/policy_limits`
}
// @from(Ln 195201, Col 0)
function z$A(A) {
    if (Array.isArray(A)) return A.map(z$A);
    if (A !== null && typeof A === "object") {
        let q = {};
        for (let [K, Y] of Object.entries(A).sort(([z], [w]) => z.localeCompare(w))) q[K] = z$A(Y);
        return q
    }
    return A
}
// @from(Ln 195211, Col 0)
function dq9(A) {
    let q = z$A(A),
        K = Q1(q);
    return `sha256:${uq9("sha256").update(K).digest("hex")}`
}
// @from(Ln 195217, Col 0)
function KB() {
    if (E4() !== "firstParty") return !1;
    if (!OH1()) return !1;
    try {
        let {
            key: q
        } = yO({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
        if (q) return !0
    } catch {}
    let A = a4();
    if (!A?.accessToken) return !1;
    if (!A.scopes?.includes(Fx)) return !1;
    if (A.subscriptionType !== "enterprise") return !1;
    return !0
}
// @from(Ln 195234, Col 0)
async function Jv7() {
    if (zq1) await zq1
}
// @from(Ln 195238, Col 0)
function cq9() {
    try {
        let {
            key: q
        } = yO({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
        if (q) return {
            headers: {
                "x-api-key": q
            }
        }
    } catch {}
    let A = a4();
    if (A?.accessToken) return {
        headers: {
            Authorization: `Bearer ${A.accessToken}`,
            "anthropic-beta": uf
        }
    };
    return {
        headers: {},
        error: "No authentication available"
    }
}
// @from(Ln 195263, Col 0)
async function lq9(A) {
    let q = null;
    for (let K = 1; K <= Y$A + 1; K++) {
        if (q = await iq9(A), q.success) return q;
        if (q.skipRetry) return q;
        if (K > Y$A) return q;
        let Y = cU(K);
        h(`Policy limits: Retry ${K}/${Y$A} after ${Y}ms`), await dS(Y)
    }
    return q
}
// @from(Ln 195274, Col 0)
async function iq9(A) {
    try {
        await XM();
        let q = cq9();
        if (q.error) return {
            success: !1,
            error: "Authentication required for policy limits",
            skipRetry: !0
        };
        let K = pq9(),
            Y = {
                ...q.headers,
                "User-Agent": XH()
            };
        if (A) Y["If-None-Match"] = `"${A}"`;
        let z = await sA.get(K, {
            headers: Y,
            timeout: Qq9,
            validateStatus: (H) => H === 200 || H === 304 || H === 404
        });
        if (z.status === 304) return h("Policy limits: Using cached restrictions (304)"), {
            success: !0,
            restrictions: null,
            etag: A
        };
        if (z.status === 404) return h("Policy limits: No restrictions found (404)"), {
            success: !0,
            restrictions: {},
            etag: void 0
        };
        let w = eqA.safeParse(z.data);
        if (!w.success) return h(`Policy limits: Invalid response format - ${w.error.message}`), {
            success: !1,
            error: "Invalid policy limits format"
        };
        return h("Policy limits: Fetched successfully"), {
            success: !0,
            restrictions: w.data.restrictions
        }
    } catch (q) {
        if (sA.isAxiosError(q)) {
            if (q.response?.status === 401 || q.response?.status === 403) return {
                success: !1,
                error: "Not authorized for policy limits",
                skipRetry: !0
            };
            if (q.code === "ECONNABORTED") return {
                success: !1,
                error: "Policy limits request timeout"
            };
            if (q.code === "ECONNREFUSED" || q.code === "ENOTFOUND") return {
                success: !1,
                error: "Cannot connect to server"
            }
        }
        return {
            success: !1,
            error: q instanceof Error ? q.message : "Unknown error"
        }
    }
}
// @from(Ln 195336, Col 0)
function Xv7() {
    try {
        let A = Bq9(N26(), "utf-8"),
            q = j9(A, !1),
            K = eqA.safeParse(q);
        if (!K.success) return null;
        return K.data.restrictions
    } catch {
        return null
    }
}
// @from(Ln 195348, Col 0)
function nq9(A) {
    try {
        let q = N26();
        ek(q, Q1({
            restrictions: A
        }, null, 2), {
            encoding: "utf-8",
            mode: 384
        }), h(`Policy limits: Saved to ${q}`)
    } catch (q) {
        h(`Policy limits: Failed to save - ${q instanceof Error?q.message:"unknown error"}`)
    }
}
// @from(Ln 195361, Col 0)
async function w$A() {
    if (!KB()) return null;
    let A = Xv7(),
        q = A ? dq9(A) : void 0;
    try {
        let K = await lq9(q);
        if (!K.success) {
            if (A) return h("Policy limits: Using stale cache after fetch failure"), Zv = A, A;
            return null
        }
        if (K.restrictions === null && A) return h("Policy limits: Cache still valid (304 Not Modified)"), Zv = A, A;
        let Y = K.restrictions || {};
        if (Object.keys(Y).length > 0) return Zv = Y, nq9(Y), h("Policy limits: Applied new restrictions successfully"), Y;
        Zv = Y;
        try {
            Ov7(N26()), h("Policy limits: Deleted cached file (404 response)")
        } catch (w) {
            if (mq9(w) && w.code !== "ENOENT") h(`Policy limits: Failed to delete cached file - ${w.message}`)
        }
        return Y
    } catch {
        if (A) return h("Policy limits: Using stale cache after error"), Zv = A, A;
        return null
    }
}
// @from(Ln 195387, Col 0)
function p0(A) {
    let q = rq9();
    if (!q) return !0;
    let K = q[A];
    if (!K) return !0;
    return K.allowed
}
// @from(Ln 195395, Col 0)
function rq9() {
    if (!KB()) return null;
    if (Zv) return Zv;
    let A = Xv7();
    if (A) return Zv = A, A;
    return null
}
// @from(Ln 195402, Col 0)
async function Dv7() {
    if (KB() && !zq1) zq1 = new Promise((A) => {
        lU = A
    });
    try {
        if (await w$A(), KB()) aq9()
    } finally {
        if (lU) lU(), lU = null
    }
}
// @from(Ln 195412, Col 0)
async function T26() {
    if (H$A(), !KB()) return;
    await w$A(), h("Policy limits: Refreshed after auth change")
}
// @from(Ln 195417, Col 0)
function H$A() {
    jv7(), Zv = null, zq1 = null, lU = null;
    try {
        Ov7(N26())
    } catch {}
}
// @from(Ln 195423, Col 0)
async function oq9() {
    if (!KB()) return;
    let A = Zv ? Q1(Zv) : null;
    try {
        if (await w$A(), (Zv ? Q1(Zv) : null) !== A) h("Policy limits: Changed during background poll")
    } catch {}
}
// @from(Ln 195431, Col 0)
function aq9() {
    if (jx1 !== null) return;
    if (!KB()) return;
    if (jx1 = setInterval(() => {
            oq9()
        }, gq9), !$v7) $v7 = !0, Tq(async () => jv7())
}
// @from(Ln 195439, Col 0)
function jv7() {
    if (jx1 !== null) clearInterval(jx1), jx1 = null
}
// @from(Ln 195442, Col 4)
Fq9 = "policy-limits.json"
// @from(Ln 195443, Col 4)
Qq9 = 1e4
// @from(Ln 195444, Col 4)
Y$A = 5
// @from(Ln 195445, Col 4)
gq9 = 3600000
// @from(Ln 195446, Col 4)
jx1 = null
// @from(Ln 195447, Col 4)
$v7 = !1
// @from(Ln 195448, Col 4)
zq1 = null
// @from(Ln 195449, Col 4)
lU = null
// @from(Ln 195450, Col 4)
Uq9 = 30000
// @from(Ln 195451, Col 4)
Zv = null
// @from(Ln 195452, Col 4)
mV = v(() => {
    y5();
    B0();
    Z6();
    Uz();
    J7();
    Sq7();
    hA();
    UH();
    wq();
    AH();
    Yq1();
    QU();
    Tz();
    m6()
})
// @from(Ln 195468, Col 4)
Mv7 = v(() => {
    B6();
    cA();
    N7();
    p8();
    s2();
    J7();
    mV();
    hA()
})
// @from(Ln 195479, Col 0)
function Pv7() {
    return !1
}
// @from(Ln 195483, Col 0)
function u8(A) {
    if (!Pv7()) return;
    let Y = (f6().featureUsage ?? {})[A],
        z = {
            firstUsedAt: Y?.firstUsedAt ?? Date.now(),
            usageCount: (Y?.usageCount ?? 0) + 1
        };
    if (!Y || Y.usageCount !== z.usageCount) jA((w) => ({
        ...w,
        featureUsage: {
            ...w.featureUsage,
            [A]: z
        }
    }))
}
// @from(Ln 195498, Col 4)
v3 = v(() => {
    cA();
    Mv7()
})
// @from(Ln 195503, Col 0)
function qK9(A, q, K, Y) {
    if (q.length > 0) A61();
    for (let z of q) {
        let w = z.sequence;
        if (w === PA7) {
            A.handleTerminalFocus(!0);
            let $ = new ZJ1("terminalfocus");
            A.internal_eventEmitter.emit("terminalfocus", $);
            continue
        }
        if (w === WA7) {
            A.handleTerminalFocus(!1);
            let $ = new ZJ1("terminalblur");
            A.internal_eventEmitter.emit("terminalblur", $);
            continue
        }
        if (z.name === "z" && z.ctrl && AK9) {
            A.handleSuspend();
            continue
        }
        A.handleInput(w);
        let H = new pC1(z);
        A.internal_eventEmitter.emit("input", H)
    }
}
// @from(Ln 195528, Col 4)
lS
// @from(Ln 195528, Col 8)
Wv7
// @from(Ln 195528, Col 13)
sq9 = "\t"
// @from(Ln 195529, Col 4)
tq9 = "\x1B[Z"
// @from(Ln 195530, Col 4)
eq9 = "\x1B"
// @from(Ln 195531, Col 4)
AK9
// @from(Ln 195531, Col 9)
v26