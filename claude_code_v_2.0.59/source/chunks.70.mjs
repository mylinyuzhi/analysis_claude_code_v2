
// @from(Start 6556765, End 6568846)
nLB = z((Jr7, iLB) => {
  var CE6 = msA(),
    H0 = b_(),
    lLB = {
      integer: "integer",
      float: "float",
      approximate: "approximate"
    };

  function EE6(A, Q) {
    if (this.options.useExifOrientation || this.options.angle || this.options.rotationAngle) this.options.debuglog("ignoring previous rotate options");
    if (!H0.defined(A)) this.options.useExifOrientation = !0;
    else if (H0.integer(A) && !(A % 90)) this.options.angle = A;
    else if (H0.number(A)) {
      if (this.options.rotationAngle = A, H0.object(Q) && Q.background) {
        let B = CE6(Q.background);
        this.options.rotationBackground = [B.red(), B.green(), B.blue(), Math.round(B.alpha() * 255)]
      }
    } else throw H0.invalidParameterError("angle", "numeric", A);
    return this
  }

  function zE6(A) {
    return this.options.flip = H0.bool(A) ? A : !0, this
  }

  function UE6(A) {
    return this.options.flop = H0.bool(A) ? A : !0, this
  }

  function $E6(A, Q) {
    let B = [].concat(...A);
    if (B.length === 4 && B.every(H0.number)) this.options.affineMatrix = B;
    else throw H0.invalidParameterError("matrix", "1x4 or 2x2 array", A);
    if (H0.defined(Q))
      if (H0.object(Q)) {
        if (this._setBackgroundColourOption("affineBackground", Q.background), H0.defined(Q.idx))
          if (H0.number(Q.idx)) this.options.affineIdx = Q.idx;
          else throw H0.invalidParameterError("options.idx", "number", Q.idx);
        if (H0.defined(Q.idy))
          if (H0.number(Q.idy)) this.options.affineIdy = Q.idy;
          else throw H0.invalidParameterError("options.idy", "number", Q.idy);
        if (H0.defined(Q.odx))
          if (H0.number(Q.odx)) this.options.affineOdx = Q.odx;
          else throw H0.invalidParameterError("options.odx", "number", Q.odx);
        if (H0.defined(Q.ody))
          if (H0.number(Q.ody)) this.options.affineOdy = Q.ody;
          else throw H0.invalidParameterError("options.ody", "number", Q.ody);
        if (H0.defined(Q.interpolator))
          if (H0.inArray(Q.interpolator, Object.values(this.constructor.interpolators))) this.options.affineInterpolator = Q.interpolator;
          else throw H0.invalidParameterError("options.interpolator", "valid interpolator name", Q.interpolator)
      } else throw H0.invalidParameterError("options", "object", Q);
    return this
  }

  function wE6(A, Q, B) {
    if (!H0.defined(A)) this.options.sharpenSigma = -1;
    else if (H0.bool(A)) this.options.sharpenSigma = A ? -1 : 0;
    else if (H0.number(A) && H0.inRange(A, 0.01, 1e4)) {
      if (this.options.sharpenSigma = A, H0.defined(Q))
        if (H0.number(Q) && H0.inRange(Q, 0, 1e4)) this.options.sharpenM1 = Q;
        else throw H0.invalidParameterError("flat", "number between 0 and 10000", Q);
      if (H0.defined(B))
        if (H0.number(B) && H0.inRange(B, 0, 1e4)) this.options.sharpenM2 = B;
        else throw H0.invalidParameterError("jagged", "number between 0 and 10000", B)
    } else if (H0.plainObject(A)) {
      if (H0.number(A.sigma) && H0.inRange(A.sigma, 0.000001, 10)) this.options.sharpenSigma = A.sigma;
      else throw H0.invalidParameterError("options.sigma", "number between 0.000001 and 10", A.sigma);
      if (H0.defined(A.m1))
        if (H0.number(A.m1) && H0.inRange(A.m1, 0, 1e6)) this.options.sharpenM1 = A.m1;
        else throw H0.invalidParameterError("options.m1", "number between 0 and 1000000", A.m1);
      if (H0.defined(A.m2))
        if (H0.number(A.m2) && H0.inRange(A.m2, 0, 1e6)) this.options.sharpenM2 = A.m2;
        else throw H0.invalidParameterError("options.m2", "number between 0 and 1000000", A.m2);
      if (H0.defined(A.x1))
        if (H0.number(A.x1) && H0.inRange(A.x1, 0, 1e6)) this.options.sharpenX1 = A.x1;
        else throw H0.invalidParameterError("options.x1", "number between 0 and 1000000", A.x1);
      if (H0.defined(A.y2))
        if (H0.number(A.y2) && H0.inRange(A.y2, 0, 1e6)) this.options.sharpenY2 = A.y2;
        else throw H0.invalidParameterError("options.y2", "number between 0 and 1000000", A.y2);
      if (H0.defined(A.y3))
        if (H0.number(A.y3) && H0.inRange(A.y3, 0, 1e6)) this.options.sharpenY3 = A.y3;
        else throw H0.invalidParameterError("options.y3", "number between 0 and 1000000", A.y3)
    } else throw H0.invalidParameterError("sigma", "number between 0.01 and 10000", A);
    return this
  }

  function qE6(A) {
    if (!H0.defined(A)) this.options.medianSize = 3;
    else if (H0.integer(A) && H0.inRange(A, 1, 1000)) this.options.medianSize = A;
    else throw H0.invalidParameterError("size", "integer between 1 and 1000", A);
    return this
  }

  function NE6(A) {
    let Q;
    if (H0.number(A)) Q = A;
    else if (H0.plainObject(A)) {
      if (!H0.number(A.sigma)) throw H0.invalidParameterError("options.sigma", "number between 0.3 and 1000", Q);
      if (Q = A.sigma, "precision" in A)
        if (H0.string(lLB[A.precision])) this.options.precision = lLB[A.precision];
        else throw H0.invalidParameterError("precision", "one of: integer, float, approximate", A.precision);
      if ("minAmplitude" in A)
        if (H0.number(A.minAmplitude) && H0.inRange(A.minAmplitude, 0.001, 1)) this.options.minAmpl = A.minAmplitude;
        else throw H0.invalidParameterError("minAmplitude", "number between 0.001 and 1", A.minAmplitude)
    }
    if (!H0.defined(A)) this.options.blurSigma = -1;
    else if (H0.bool(A)) this.options.blurSigma = A ? -1 : 0;
    else if (H0.number(Q) && H0.inRange(Q, 0.3, 1000)) this.options.blurSigma = Q;
    else throw H0.invalidParameterError("sigma", "number between 0.3 and 1000", Q);
    return this
  }

  function LE6(A) {
    if (this.options.flatten = H0.bool(A) ? A : !0, H0.object(A)) this._setBackgroundColourOption("flattenBackground", A.background);
    return this
  }

  function ME6() {
    return this.options.unflatten = !0, this
  }

  function OE6(A, Q) {
    if (!H0.defined(A)) this.options.gamma = 2.2;
    else if (H0.number(A) && H0.inRange(A, 1, 3)) this.options.gamma = A;
    else throw H0.invalidParameterError("gamma", "number between 1.0 and 3.0", A);
    if (!H0.defined(Q)) this.options.gammaOut = this.options.gamma;
    else if (H0.number(Q) && H0.inRange(Q, 1, 3)) this.options.gammaOut = Q;
    else throw H0.invalidParameterError("gammaOut", "number between 1.0 and 3.0", Q);
    return this
  }

  function RE6(A) {
    if (this.options.negate = H0.bool(A) ? A : !0, H0.plainObject(A) && "alpha" in A)
      if (!H0.bool(A.alpha)) throw H0.invalidParameterError("alpha", "should be boolean value", A.alpha);
      else this.options.negateAlpha = A.alpha;
    return this
  }

  function TE6(A) {
    if (H0.plainObject(A)) {
      if (H0.defined(A.lower))
        if (H0.number(A.lower) && H0.inRange(A.lower, 0, 99)) this.options.normaliseLower = A.lower;
        else throw H0.invalidParameterError("lower", "number between 0 and 99", A.lower);
      if (H0.defined(A.upper))
        if (H0.number(A.upper) && H0.inRange(A.upper, 1, 100)) this.options.normaliseUpper = A.upper;
        else throw H0.invalidParameterError("upper", "number between 1 and 100", A.upper)
    }
    if (this.options.normaliseLower >= this.options.normaliseUpper) throw H0.invalidParameterError("range", "lower to be less than upper", `${this.options.normaliseLower} >= ${this.options.normaliseUpper}`);
    return this.options.normalise = !0, this
  }

  function PE6(A) {
    return this.normalise(A)
  }

  function jE6(A) {
    if (H0.plainObject(A)) {
      if (H0.integer(A.width) && A.width > 0) this.options.claheWidth = A.width;
      else throw H0.invalidParameterError("width", "integer greater than zero", A.width);
      if (H0.integer(A.height) && A.height > 0) this.options.claheHeight = A.height;
      else throw H0.invalidParameterError("height", "integer greater than zero", A.height);
      if (H0.defined(A.maxSlope))
        if (H0.integer(A.maxSlope) && H0.inRange(A.maxSlope, 0, 100)) this.options.claheMaxSlope = A.maxSlope;
        else throw H0.invalidParameterError("maxSlope", "integer between 0 and 100", A.maxSlope)
    } else throw H0.invalidParameterError("options", "plain object", A);
    return this
  }

  function SE6(A) {
    if (!H0.object(A) || !Array.isArray(A.kernel) || !H0.integer(A.width) || !H0.integer(A.height) || !H0.inRange(A.width, 3, 1001) || !H0.inRange(A.height, 3, 1001) || A.height * A.width !== A.kernel.length) throw Error("Invalid convolution kernel");
    if (!H0.integer(A.scale)) A.scale = A.kernel.reduce(function(Q, B) {
      return Q + B
    }, 0);
    if (A.scale < 1) A.scale = 1;
    if (!H0.integer(A.offset)) A.offset = 0;
    return this.options.convKernel = A, this
  }

  function _E6(A, Q) {
    if (!H0.defined(A)) this.options.threshold = 128;
    else if (H0.bool(A)) this.options.threshold = A ? 128 : 0;
    else if (H0.integer(A) && H0.inRange(A, 0, 255)) this.options.threshold = A;
    else throw H0.invalidParameterError("threshold", "integer between 0 and 255", A);
    if (!H0.object(Q) || Q.greyscale === !0 || Q.grayscale === !0) this.options.thresholdGrayscale = !0;
    else this.options.thresholdGrayscale = !1;
    return this
  }

  function kE6(A, Q, B) {
    if (this.options.boolean = this._createInputDescriptor(A, B), H0.string(Q) && H0.inArray(Q, ["and", "or", "eor"])) this.options.booleanOp = Q;
    else throw H0.invalidParameterError("operator", "one of: and, or, eor", Q);
    return this
  }

  function yE6(A, Q) {
    if (!H0.defined(A) && H0.number(Q)) A = 1;
    else if (H0.number(A) && !H0.defined(Q)) Q = 0;
    if (!H0.defined(A)) this.options.linearA = [];
    else if (H0.number(A)) this.options.linearA = [A];
    else if (Array.isArray(A) && A.length && A.every(H0.number)) this.options.linearA = A;
    else throw H0.invalidParameterError("a", "number or array of numbers", A);
    if (!H0.defined(Q)) this.options.linearB = [];
    else if (H0.number(Q)) this.options.linearB = [Q];
    else if (Array.isArray(Q) && Q.length && Q.every(H0.number)) this.options.linearB = Q;
    else throw H0.invalidParameterError("b", "number or array of numbers", Q);
    if (this.options.linearA.length !== this.options.linearB.length) throw Error("Expected a and b to be arrays of the same length");
    return this
  }

  function xE6(A) {
    if (!Array.isArray(A)) throw H0.invalidParameterError("inputMatrix", "array", A);
    if (A.length !== 3 && A.length !== 4) throw H0.invalidParameterError("inputMatrix", "3x3 or 4x4 array", A.length);
    let Q = A.flat().map(Number);
    if (Q.length !== 9 && Q.length !== 16) throw H0.invalidParameterError("inputMatrix", "cardinality of 9 or 16", Q.length);
    return this.options.recombMatrix = Q, this
  }

  function vE6(A) {
    if (!H0.plainObject(A)) throw H0.invalidParameterError("options", "plain object", A);
    if ("brightness" in A)
      if (H0.number(A.brightness) && A.brightness >= 0) this.options.brightness = A.brightness;
      else throw H0.invalidParameterError("brightness", "number above zero", A.brightness);
    if ("saturation" in A)
      if (H0.number(A.saturation) && A.saturation >= 0) this.options.saturation = A.saturation;
      else throw H0.invalidParameterError("saturation", "number above zero", A.saturation);
    if ("hue" in A)
      if (H0.integer(A.hue)) this.options.hue = A.hue % 360;
      else throw H0.invalidParameterError("hue", "number", A.hue);
    if ("lightness" in A)
      if (H0.number(A.lightness)) this.options.lightness = A.lightness;
      else throw H0.invalidParameterError("lightness", "number", A.lightness);
    return this
  }
  iLB.exports = function(A) {
    Object.assign(A.prototype, {
      rotate: EE6,
      flip: zE6,
      flop: UE6,
      affine: $E6,
      sharpen: wE6,
      median: qE6,
      blur: NE6,
      flatten: LE6,
      unflatten: ME6,
      gamma: OE6,
      negate: RE6,
      normalise: TE6,
      normalize: PE6,
      clahe: jE6,
      convolve: SE6,
      threshold: _E6,
      boolean: kE6,
      linear: yE6,
      recomb: xE6,
      modulate: vE6
    })
  }
})
// @from(Start 6568852, End 6570313)
rLB = z((Wr7, sLB) => {
  var bE6 = msA(),
    Gf = b_(),
    aLB = {
      multiband: "multiband",
      "b-w": "b-w",
      bw: "b-w",
      cmyk: "cmyk",
      srgb: "srgb"
    };

  function fE6(A) {
    return this._setBackgroundColourOption("tint", A), this
  }

  function hE6(A) {
    return this.options.greyscale = Gf.bool(A) ? A : !0, this
  }

  function gE6(A) {
    return this.greyscale(A)
  }

  function uE6(A) {
    if (!Gf.string(A)) throw Gf.invalidParameterError("colourspace", "string", A);
    return this.options.colourspacePipeline = A, this
  }

  function mE6(A) {
    return this.pipelineColourspace(A)
  }

  function dE6(A) {
    if (!Gf.string(A)) throw Gf.invalidParameterError("colourspace", "string", A);
    return this.options.colourspace = A, this
  }

  function cE6(A) {
    return this.toColourspace(A)
  }

  function pE6(A, Q) {
    if (Gf.defined(Q))
      if (Gf.object(Q) || Gf.string(Q)) {
        let B = bE6(Q);
        this.options[A] = [B.red(), B.green(), B.blue(), Math.round(B.alpha() * 255)]
      } else throw Gf.invalidParameterError("background", "object or string", Q)
  }
  sLB.exports = function(A) {
    Object.assign(A.prototype, {
      tint: fE6,
      greyscale: hE6,
      grayscale: gE6,
      pipelineColourspace: uE6,
      pipelineColorspace: mE6,
      toColourspace: dE6,
      toColorspace: cE6,
      _setBackgroundColourOption: pE6
    }), A.colourspace = aLB, A.colorspace = aLB
  }
})
// @from(Start 6570319, End 6571786)
tLB = z((Xr7, oLB) => {
  var g_ = b_(),
    lE6 = {
      and: "and",
      or: "or",
      eor: "eor"
    };

  function iE6() {
    return this.options.removeAlpha = !0, this
  }

  function nE6(A) {
    if (g_.defined(A))
      if (g_.number(A) && g_.inRange(A, 0, 1)) this.options.ensureAlpha = A;
      else throw g_.invalidParameterError("alpha", "number between 0 and 1", A);
    else this.options.ensureAlpha = 1;
    return this
  }

  function aE6(A) {
    let Q = {
      red: 0,
      green: 1,
      blue: 2,
      alpha: 3
    };
    if (Object.keys(Q).includes(A)) A = Q[A];
    if (g_.integer(A) && g_.inRange(A, 0, 4)) this.options.extractChannel = A;
    else throw g_.invalidParameterError("channel", "integer or one of: red, green, blue, alpha", A);
    return this
  }

  function sE6(A, Q) {
    if (Array.isArray(A)) A.forEach(function(B) {
      this.options.joinChannelIn.push(this._createInputDescriptor(B, Q))
    }, this);
    else this.options.joinChannelIn.push(this._createInputDescriptor(A, Q));
    return this
  }

  function rE6(A) {
    if (g_.string(A) && g_.inArray(A, ["and", "or", "eor"])) this.options.bandBoolOp = A;
    else throw g_.invalidParameterError("boolOp", "one of: and, or, eor", A);
    return this
  }
  oLB.exports = function(A) {
    Object.assign(A.prototype, {
      removeAlpha: iE6,
      ensureAlpha: nE6,
      extractChannel: aE6,
      joinChannel: sE6,
      bandbool: rE6
    }), A.bool = lE6
  }
})
// @from(Start 6571792, End 6596866)
ZMB = z((Vr7, GMB) => {
  var Zm1 = UA("node:path"),
    I1 = b_(),
    p7A = H$A(),
    eLB = new Map([
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
    oE6 = /\.(jp[2x]|j2[kc])$/i,
    AMB = () => Error("JP2 output requires libvips with support for OpenJPEG"),
    QMB = (A) => 1 << 31 - Math.clz32(Math.ceil(Math.log2(A)));

  function tE6(A, Q) {
    let B;
    if (!I1.string(A)) B = Error("Missing output file path");
    else if (I1.string(this.options.input.file) && Zm1.resolve(this.options.input.file) === Zm1.resolve(A)) B = Error("Cannot use same file for input and output");
    else if (oE6.test(Zm1.extname(A)) && !this.constructor.format.jp2k.output.file) B = AMB();
    if (B)
      if (I1.fn(Q)) Q(B);
      else return Promise.reject(B);
    else {
      this.options.fileOut = A;
      let G = Error();
      return this._pipeline(Q, G)
    }
    return this
  }

  function eE6(A, Q) {
    if (I1.object(A)) this._setBooleanOption("resolveWithObject", A.resolveWithObject);
    else if (this.options.resolveWithObject) this.options.resolveWithObject = !1;
    this.options.fileOut = "";
    let B = Error();
    return this._pipeline(I1.fn(A) ? A : Q, B)
  }

  function Az6() {
    return this.options.keepMetadata |= 1, this
  }

  function Qz6(A) {
    if (I1.object(A))
      for (let [Q, B] of Object.entries(A))
        if (I1.object(B))
          for (let [G, Z] of Object.entries(B))
            if (I1.string(Z)) this.options.withExif[`exif-${Q.toLowerCase()}-${G}`] = Z;
            else throw I1.invalidParameterError(`${Q}.${G}`, "string", Z);
    else throw I1.invalidParameterError(Q, "object", B);
    else throw I1.invalidParameterError("exif", "object", A);
    return this.options.withExifMerge = !1, this.keepExif()
  }

  function Bz6(A) {
    return this.withExif(A), this.options.withExifMerge = !0, this
  }

  function Gz6() {
    return this.options.keepMetadata |= 8, this
  }

  function Zz6(A, Q) {
    if (I1.string(A)) this.options.withIccProfile = A;
    else throw I1.invalidParameterError("icc", "string", A);
    if (this.keepIccProfile(), I1.object(Q)) {
      if (I1.defined(Q.attach))
        if (I1.bool(Q.attach)) {
          if (!Q.attach) this.options.keepMetadata &= -9
        } else throw I1.invalidParameterError("attach", "boolean", Q.attach)
    }
    return this
  }

  function Iz6() {
    return this.options.keepMetadata = 31, this
  }

  function Yz6(A) {
    if (this.keepMetadata(), this.withIccProfile("srgb"), I1.object(A)) {
      if (I1.defined(A.orientation))
        if (I1.integer(A.orientation) && I1.inRange(A.orientation, 1, 8)) this.options.withMetadataOrientation = A.orientation;
        else throw I1.invalidParameterError("orientation", "integer between 1 and 8", A.orientation);
      if (I1.defined(A.density))
        if (I1.number(A.density) && A.density > 0) this.options.withMetadataDensity = A.density;
        else throw I1.invalidParameterError("density", "positive number", A.density);
      if (I1.defined(A.icc)) this.withIccProfile(A.icc);
      if (I1.defined(A.exif)) this.withExifMerge(A.exif)
    }
    return this
  }

  function Jz6(A, Q) {
    let B = eLB.get((I1.object(A) && I1.string(A.id) ? A.id : A).toLowerCase());
    if (!B) throw I1.invalidParameterError("format", `one of: ${[...eLB.keys()].join(", ")}`, A);
    return this[B](Q)
  }

  function Wz6(A) {
    if (I1.object(A)) {
      if (I1.defined(A.quality))
        if (I1.integer(A.quality) && I1.inRange(A.quality, 1, 100)) this.options.jpegQuality = A.quality;
        else throw I1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      if (I1.defined(A.progressive)) this._setBooleanOption("jpegProgressive", A.progressive);
      if (I1.defined(A.chromaSubsampling))
        if (I1.string(A.chromaSubsampling) && I1.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.jpegChromaSubsampling = A.chromaSubsampling;
        else throw I1.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling);
      let Q = I1.bool(A.optimizeCoding) ? A.optimizeCoding : A.optimiseCoding;
      if (I1.defined(Q)) this._setBooleanOption("jpegOptimiseCoding", Q);
      if (I1.defined(A.mozjpeg))
        if (I1.bool(A.mozjpeg)) {
          if (A.mozjpeg) this.options.jpegTrellisQuantisation = !0, this.options.jpegOvershootDeringing = !0, this.options.jpegOptimiseScans = !0, this.options.jpegProgressive = !0, this.options.jpegQuantisationTable = 3
        } else throw I1.invalidParameterError("mozjpeg", "boolean", A.mozjpeg);
      let B = I1.bool(A.trellisQuantization) ? A.trellisQuantization : A.trellisQuantisation;
      if (I1.defined(B)) this._setBooleanOption("jpegTrellisQuantisation", B);
      if (I1.defined(A.overshootDeringing)) this._setBooleanOption("jpegOvershootDeringing", A.overshootDeringing);
      let G = I1.bool(A.optimizeScans) ? A.optimizeScans : A.optimiseScans;
      if (I1.defined(G)) {
        if (this._setBooleanOption("jpegOptimiseScans", G), G) this.options.jpegProgressive = !0
      }
      let Z = I1.number(A.quantizationTable) ? A.quantizationTable : A.quantisationTable;
      if (I1.defined(Z))
        if (I1.integer(Z) && I1.inRange(Z, 0, 8)) this.options.jpegQuantisationTable = Z;
        else throw I1.invalidParameterError("quantisationTable", "integer between 0 and 8", Z)
    }
    return this._updateFormatOut("jpeg", A)
  }

  function Xz6(A) {
    if (I1.object(A)) {
      if (I1.defined(A.progressive)) this._setBooleanOption("pngProgressive", A.progressive);
      if (I1.defined(A.compressionLevel))
        if (I1.integer(A.compressionLevel) && I1.inRange(A.compressionLevel, 0, 9)) this.options.pngCompressionLevel = A.compressionLevel;
        else throw I1.invalidParameterError("compressionLevel", "integer between 0 and 9", A.compressionLevel);
      if (I1.defined(A.adaptiveFiltering)) this._setBooleanOption("pngAdaptiveFiltering", A.adaptiveFiltering);
      let Q = A.colours || A.colors;
      if (I1.defined(Q))
        if (I1.integer(Q) && I1.inRange(Q, 2, 256)) this.options.pngBitdepth = QMB(Q);
        else throw I1.invalidParameterError("colours", "integer between 2 and 256", Q);
      if (I1.defined(A.palette)) this._setBooleanOption("pngPalette", A.palette);
      else if ([A.quality, A.effort, A.colours, A.colors, A.dither].some(I1.defined)) this._setBooleanOption("pngPalette", !0);
      if (this.options.pngPalette) {
        if (I1.defined(A.quality))
          if (I1.integer(A.quality) && I1.inRange(A.quality, 0, 100)) this.options.pngQuality = A.quality;
          else throw I1.invalidParameterError("quality", "integer between 0 and 100", A.quality);
        if (I1.defined(A.effort))
          if (I1.integer(A.effort) && I1.inRange(A.effort, 1, 10)) this.options.pngEffort = A.effort;
          else throw I1.invalidParameterError("effort", "integer between 1 and 10", A.effort);
        if (I1.defined(A.dither))
          if (I1.number(A.dither) && I1.inRange(A.dither, 0, 1)) this.options.pngDither = A.dither;
          else throw I1.invalidParameterError("dither", "number between 0.0 and 1.0", A.dither)
      }
    }
    return this._updateFormatOut("png", A)
  }

  function Vz6(A) {
    if (I1.object(A)) {
      if (I1.defined(A.quality))
        if (I1.integer(A.quality) && I1.inRange(A.quality, 1, 100)) this.options.webpQuality = A.quality;
        else throw I1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      if (I1.defined(A.alphaQuality))
        if (I1.integer(A.alphaQuality) && I1.inRange(A.alphaQuality, 0, 100)) this.options.webpAlphaQuality = A.alphaQuality;
        else throw I1.invalidParameterError("alphaQuality", "integer between 0 and 100", A.alphaQuality);
      if (I1.defined(A.lossless)) this._setBooleanOption("webpLossless", A.lossless);
      if (I1.defined(A.nearLossless)) this._setBooleanOption("webpNearLossless", A.nearLossless);
      if (I1.defined(A.smartSubsample)) this._setBooleanOption("webpSmartSubsample", A.smartSubsample);
      if (I1.defined(A.preset))
        if (I1.string(A.preset) && I1.inArray(A.preset, ["default", "photo", "picture", "drawing", "icon", "text"])) this.options.webpPreset = A.preset;
        else throw I1.invalidParameterError("preset", "one of: default, photo, picture, drawing, icon, text", A.preset);
      if (I1.defined(A.effort))
        if (I1.integer(A.effort) && I1.inRange(A.effort, 0, 6)) this.options.webpEffort = A.effort;
        else throw I1.invalidParameterError("effort", "integer between 0 and 6", A.effort);
      if (I1.defined(A.minSize)) this._setBooleanOption("webpMinSize", A.minSize);
      if (I1.defined(A.mixed)) this._setBooleanOption("webpMixed", A.mixed)
    }
    return BMB(A, this.options), this._updateFormatOut("webp", A)
  }

  function Fz6(A) {
    if (I1.object(A)) {
      if (I1.defined(A.reuse)) this._setBooleanOption("gifReuse", A.reuse);
      if (I1.defined(A.progressive)) this._setBooleanOption("gifProgressive", A.progressive);
      let Q = A.colours || A.colors;
      if (I1.defined(Q))
        if (I1.integer(Q) && I1.inRange(Q, 2, 256)) this.options.gifBitdepth = QMB(Q);
        else throw I1.invalidParameterError("colours", "integer between 2 and 256", Q);
      if (I1.defined(A.effort))
        if (I1.number(A.effort) && I1.inRange(A.effort, 1, 10)) this.options.gifEffort = A.effort;
        else throw I1.invalidParameterError("effort", "integer between 1 and 10", A.effort);
      if (I1.defined(A.dither))
        if (I1.number(A.dither) && I1.inRange(A.dither, 0, 1)) this.options.gifDither = A.dither;
        else throw I1.invalidParameterError("dither", "number between 0.0 and 1.0", A.dither);
      if (I1.defined(A.interFrameMaxError))
        if (I1.number(A.interFrameMaxError) && I1.inRange(A.interFrameMaxError, 0, 32)) this.options.gifInterFrameMaxError = A.interFrameMaxError;
        else throw I1.invalidParameterError("interFrameMaxError", "number between 0.0 and 32.0", A.interFrameMaxError);
      if (I1.defined(A.interPaletteMaxError))
        if (I1.number(A.interPaletteMaxError) && I1.inRange(A.interPaletteMaxError, 0, 256)) this.options.gifInterPaletteMaxError = A.interPaletteMaxError;
        else throw I1.invalidParameterError("interPaletteMaxError", "number between 0.0 and 256.0", A.interPaletteMaxError)
    }
    return BMB(A, this.options), this._updateFormatOut("gif", A)
  }

  function Kz6(A) {
    if (!this.constructor.format.jp2k.output.buffer) throw AMB();
    if (I1.object(A)) {
      if (I1.defined(A.quality))
        if (I1.integer(A.quality) && I1.inRange(A.quality, 1, 100)) this.options.jp2Quality = A.quality;
        else throw I1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      if (I1.defined(A.lossless))
        if (I1.bool(A.lossless)) this.options.jp2Lossless = A.lossless;
        else throw I1.invalidParameterError("lossless", "boolean", A.lossless);
      if (I1.defined(A.tileWidth))
        if (I1.integer(A.tileWidth) && I1.inRange(A.tileWidth, 1, 32768)) this.options.jp2TileWidth = A.tileWidth;
        else throw I1.invalidParameterError("tileWidth", "integer between 1 and 32768", A.tileWidth);
      if (I1.defined(A.tileHeight))
        if (I1.integer(A.tileHeight) && I1.inRange(A.tileHeight, 1, 32768)) this.options.jp2TileHeight = A.tileHeight;
        else throw I1.invalidParameterError("tileHeight", "integer between 1 and 32768", A.tileHeight);
      if (I1.defined(A.chromaSubsampling))
        if (I1.string(A.chromaSubsampling) && I1.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.jp2ChromaSubsampling = A.chromaSubsampling;
        else throw I1.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling)
    }
    return this._updateFormatOut("jp2", A)
  }

  function BMB(A, Q) {
    if (I1.object(A) && I1.defined(A.loop))
      if (I1.integer(A.loop) && I1.inRange(A.loop, 0, 65535)) Q.loop = A.loop;
      else throw I1.invalidParameterError("loop", "integer between 0 and 65535", A.loop);
    if (I1.object(A) && I1.defined(A.delay))
      if (I1.integer(A.delay) && I1.inRange(A.delay, 0, 65535)) Q.delay = [A.delay];
      else if (Array.isArray(A.delay) && A.delay.every(I1.integer) && A.delay.every((B) => I1.inRange(B, 0, 65535))) Q.delay = A.delay;
    else throw I1.invalidParameterError("delay", "integer or an array of integers between 0 and 65535", A.delay)
  }

  function Dz6(A) {
    if (I1.object(A)) {
      if (I1.defined(A.quality))
        if (I1.integer(A.quality) && I1.inRange(A.quality, 1, 100)) this.options.tiffQuality = A.quality;
        else throw I1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      if (I1.defined(A.bitdepth))
        if (I1.integer(A.bitdepth) && I1.inArray(A.bitdepth, [1, 2, 4, 8])) this.options.tiffBitdepth = A.bitdepth;
        else throw I1.invalidParameterError("bitdepth", "1, 2, 4 or 8", A.bitdepth);
      if (I1.defined(A.tile)) this._setBooleanOption("tiffTile", A.tile);
      if (I1.defined(A.tileWidth))
        if (I1.integer(A.tileWidth) && A.tileWidth > 0) this.options.tiffTileWidth = A.tileWidth;
        else throw I1.invalidParameterError("tileWidth", "integer greater than zero", A.tileWidth);
      if (I1.defined(A.tileHeight))
        if (I1.integer(A.tileHeight) && A.tileHeight > 0) this.options.tiffTileHeight = A.tileHeight;
        else throw I1.invalidParameterError("tileHeight", "integer greater than zero", A.tileHeight);
      if (I1.defined(A.miniswhite)) this._setBooleanOption("tiffMiniswhite", A.miniswhite);
      if (I1.defined(A.pyramid)) this._setBooleanOption("tiffPyramid", A.pyramid);
      if (I1.defined(A.xres))
        if (I1.number(A.xres) && A.xres > 0) this.options.tiffXres = A.xres;
        else throw I1.invalidParameterError("xres", "number greater than zero", A.xres);
      if (I1.defined(A.yres))
        if (I1.number(A.yres) && A.yres > 0) this.options.tiffYres = A.yres;
        else throw I1.invalidParameterError("yres", "number greater than zero", A.yres);
      if (I1.defined(A.compression))
        if (I1.string(A.compression) && I1.inArray(A.compression, ["none", "jpeg", "deflate", "packbits", "ccittfax4", "lzw", "webp", "zstd", "jp2k"])) this.options.tiffCompression = A.compression;
        else throw I1.invalidParameterError("compression", "one of: none, jpeg, deflate, packbits, ccittfax4, lzw, webp, zstd, jp2k", A.compression);
      if (I1.defined(A.predictor))
        if (I1.string(A.predictor) && I1.inArray(A.predictor, ["none", "horizontal", "float"])) this.options.tiffPredictor = A.predictor;
        else throw I1.invalidParameterError("predictor", "one of: none, horizontal, float", A.predictor);
      if (I1.defined(A.resolutionUnit))
        if (I1.string(A.resolutionUnit) && I1.inArray(A.resolutionUnit, ["inch", "cm"])) this.options.tiffResolutionUnit = A.resolutionUnit;
        else throw I1.invalidParameterError("resolutionUnit", "one of: inch, cm", A.resolutionUnit)
    }
    return this._updateFormatOut("tiff", A)
  }

  function Hz6(A) {
    return this.heif({
      ...A,
      compression: "av1"
    })
  }

  function Cz6(A) {
    if (I1.object(A)) {
      if (I1.string(A.compression) && I1.inArray(A.compression, ["av1", "hevc"])) this.options.heifCompression = A.compression;
      else throw I1.invalidParameterError("compression", "one of: av1, hevc", A.compression);
      if (I1.defined(A.quality))
        if (I1.integer(A.quality) && I1.inRange(A.quality, 1, 100)) this.options.heifQuality = A.quality;
        else throw I1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      if (I1.defined(A.lossless))
        if (I1.bool(A.lossless)) this.options.heifLossless = A.lossless;
        else throw I1.invalidParameterError("lossless", "boolean", A.lossless);
      if (I1.defined(A.effort))
        if (I1.integer(A.effort) && I1.inRange(A.effort, 0, 9)) this.options.heifEffort = A.effort;
        else throw I1.invalidParameterError("effort", "integer between 0 and 9", A.effort);
      if (I1.defined(A.chromaSubsampling))
        if (I1.string(A.chromaSubsampling) && I1.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.heifChromaSubsampling = A.chromaSubsampling;
        else throw I1.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling);
      if (I1.defined(A.bitdepth))
        if (I1.integer(A.bitdepth) && I1.inArray(A.bitdepth, [8, 10, 12])) {
          if (A.bitdepth !== 8 && this.constructor.versions.heif) throw I1.invalidParameterError("bitdepth when using prebuilt binaries", 8, A.bitdepth);
          this.options.heifBitdepth = A.bitdepth
        } else throw I1.invalidParameterError("bitdepth", "8, 10 or 12", A.bitdepth)
    } else throw I1.invalidParameterError("options", "Object", A);
    return this._updateFormatOut("heif", A)
  }

  function Ez6(A) {
    if (I1.object(A)) {
      if (I1.defined(A.quality))
        if (I1.integer(A.quality) && I1.inRange(A.quality, 1, 100)) this.options.jxlDistance = A.quality >= 30 ? 0.1 + (100 - A.quality) * 0.09 : 0.017666666666666667 * A.quality * A.quality - 1.15 * A.quality + 25;
        else throw I1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      else if (I1.defined(A.distance))
        if (I1.number(A.distance) && I1.inRange(A.distance, 0, 15)) this.options.jxlDistance = A.distance;
        else throw I1.invalidParameterError("distance", "number between 0.0 and 15.0", A.distance);
      if (I1.defined(A.decodingTier))
        if (I1.integer(A.decodingTier) && I1.inRange(A.decodingTier, 0, 4)) this.options.jxlDecodingTier = A.decodingTier;
        else throw I1.invalidParameterError("decodingTier", "integer between 0 and 4", A.decodingTier);
      if (I1.defined(A.lossless))
        if (I1.bool(A.lossless)) this.options.jxlLossless = A.lossless;
        else throw I1.invalidParameterError("lossless", "boolean", A.lossless);
      if (I1.defined(A.effort))
        if (I1.integer(A.effort) && I1.inRange(A.effort, 3, 9)) this.options.jxlEffort = A.effort;
        else throw I1.invalidParameterError("effort", "integer between 3 and 9", A.effort)
    }
    return this._updateFormatOut("jxl", A)
  }

  function zz6(A) {
    if (I1.object(A)) {
      if (I1.defined(A.depth))
        if (I1.string(A.depth) && I1.inArray(A.depth, ["char", "uchar", "short", "ushort", "int", "uint", "float", "complex", "double", "dpcomplex"])) this.options.rawDepth = A.depth;
        else throw I1.invalidParameterError("depth", "one of: char, uchar, short, ushort, int, uint, float, complex, double, dpcomplex", A.depth)
    }
    return this._updateFormatOut("raw")
  }

  function Uz6(A) {
    if (I1.object(A)) {
      if (I1.defined(A.size))
        if (I1.integer(A.size) && I1.inRange(A.size, 1, 8192)) this.options.tileSize = A.size;
        else throw I1.invalidParameterError("size", "integer between 1 and 8192", A.size);
      if (I1.defined(A.overlap))
        if (I1.integer(A.overlap) && I1.inRange(A.overlap, 0, 8192)) {
          if (A.overlap > this.options.tileSize) throw I1.invalidParameterError("overlap", `<= size (${this.options.tileSize})`, A.overlap);
          this.options.tileOverlap = A.overlap
        } else throw I1.invalidParameterError("overlap", "integer between 0 and 8192", A.overlap);
      if (I1.defined(A.container))
        if (I1.string(A.container) && I1.inArray(A.container, ["fs", "zip"])) this.options.tileContainer = A.container;
        else throw I1.invalidParameterError("container", "one of: fs, zip", A.container);
      if (I1.defined(A.layout))
        if (I1.string(A.layout) && I1.inArray(A.layout, ["dz", "google", "iiif", "iiif3", "zoomify"])) this.options.tileLayout = A.layout;
        else throw I1.invalidParameterError("layout", "one of: dz, google, iiif, iiif3, zoomify", A.layout);
      if (I1.defined(A.angle))
        if (I1.integer(A.angle) && !(A.angle % 90)) this.options.tileAngle = A.angle;
        else throw I1.invalidParameterError("angle", "positive/negative multiple of 90", A.angle);
      if (this._setBackgroundColourOption("tileBackground", A.background), I1.defined(A.depth))
        if (I1.string(A.depth) && I1.inArray(A.depth, ["onepixel", "onetile", "one"])) this.options.tileDepth = A.depth;
        else throw I1.invalidParameterError("depth", "one of: onepixel, onetile, one", A.depth);
      if (I1.defined(A.skipBlanks))
        if (I1.integer(A.skipBlanks) && I1.inRange(A.skipBlanks, -1, 65535)) this.options.tileSkipBlanks = A.skipBlanks;
        else throw I1.invalidParameterError("skipBlanks", "integer between -1 and 255/65535", A.skipBlanks);
      else if (I1.defined(A.layout) && A.layout === "google") this.options.tileSkipBlanks = 5;
      let Q = I1.bool(A.center) ? A.center : A.centre;
      if (I1.defined(Q)) this._setBooleanOption("tileCentre", Q);
      if (I1.defined(A.id))
        if (I1.string(A.id)) this.options.tileId = A.id;
        else throw I1.invalidParameterError("id", "string", A.id);
      if (I1.defined(A.basename))
        if (I1.string(A.basename)) this.options.tileBasename = A.basename;
        else throw I1.invalidParameterError("basename", "string", A.basename)
    }
    if (I1.inArray(this.options.formatOut, ["jpeg", "png", "webp"])) this.options.tileFormat = this.options.formatOut;
    else if (this.options.formatOut !== "input") throw I1.invalidParameterError("format", "one of: jpeg, png, webp", this.options.formatOut);
    return this._updateFormatOut("dz")
  }

  function $z6(A) {
    if (!I1.plainObject(A)) throw I1.invalidParameterError("options", "object", A);
    if (I1.integer(A.seconds) && I1.inRange(A.seconds, 0, 3600)) this.options.timeoutSeconds = A.seconds;
    else throw I1.invalidParameterError("seconds", "integer between 0 and 3600", A.seconds);
    return this
  }

  function wz6(A, Q) {
    if (!(I1.object(Q) && Q.force === !1)) this.options.formatOut = A;
    return this
  }

  function qz6(A, Q) {
    if (I1.bool(Q)) this.options[A] = Q;
    else throw I1.invalidParameterError(A, "boolean", Q)
  }

  function Nz6() {
    if (!this.options.streamOut) {
      this.options.streamOut = !0;
      let A = Error();
      this._pipeline(void 0, A)
    }
  }

  function Lz6(A, Q) {
    if (typeof A === "function") {
      if (this._isStreamInput()) this.on("finish", () => {
        this._flattenBufferIn(), p7A.pipeline(this.options, (B, G, Z) => {
          if (B) A(I1.nativeError(B, Q));
          else A(null, G, Z)
        })
      });
      else p7A.pipeline(this.options, (B, G, Z) => {
        if (B) A(I1.nativeError(B, Q));
        else A(null, G, Z)
      });
      return this
    } else if (this.options.streamOut) {
      if (this._isStreamInput()) {
        if (this.once("finish", () => {
            this._flattenBufferIn(), p7A.pipeline(this.options, (B, G, Z) => {
              if (B) this.emit("error", I1.nativeError(B, Q));
              else this.emit("info", Z), this.push(G);
              this.push(null), this.on("end", () => this.emit("close"))
            })
          }), this.streamInFinished) this.emit("finish")
      } else p7A.pipeline(this.options, (B, G, Z) => {
        if (B) this.emit("error", I1.nativeError(B, Q));
        else this.emit("info", Z), this.push(G);
        this.push(null), this.on("end", () => this.emit("close"))
      });
      return this
    } else if (this._isStreamInput()) return new Promise((B, G) => {
      this.once("finish", () => {
        this._flattenBufferIn(), p7A.pipeline(this.options, (Z, I, Y) => {
          if (Z) G(I1.nativeError(Z, Q));
          else if (this.options.resolveWithObject) B({
            data: I,
            info: Y
          });
          else B(I)
        })
      })
    });
    else return new Promise((B, G) => {
      p7A.pipeline(this.options, (Z, I, Y) => {
        if (Z) G(I1.nativeError(Z, Q));
        else if (this.options.resolveWithObject) B({
          data: I,
          info: Y
        });
        else B(I)
      })
    })
  }
  GMB.exports = function(A) {
    Object.assign(A.prototype, {
      toFile: tE6,
      toBuffer: eE6,
      keepExif: Az6,
      withExif: Qz6,
      withExifMerge: Bz6,
      keepIccProfile: Gz6,
      withIccProfile: Zz6,
      keepMetadata: Iz6,
      withMetadata: Yz6,
      toFormat: Jz6,
      jpeg: Wz6,
      jp2: Kz6,
      png: Xz6,
      webp: Vz6,
      tiff: Dz6,
      avif: Hz6,
      heif: Cz6,
      jxl: Ez6,
      gif: Fz6,
      raw: zz6,
      tile: Uz6,
      timeout: $z6,
      _updateFormatOut: wz6,
      _setBooleanOption: qz6,
      _read: Nz6,
      _pipeline: Lz6
    })
  }
})
// @from(Start 6596872, End 6599464)
WMB = z((Fr7, JMB) => {
  var Mz6 = UA("node:events"),
    csA = xsA(),
    HM = b_(),
    {
      runtimePlatformArch: Oz6
    } = iu1(),
    GE = H$A(),
    IMB = Oz6(),
    Im1 = GE.libvipsVersion(),
    Hp = GE.format();
  Hp.heif.output.alias = ["avif", "heic"];
  Hp.jpeg.output.alias = ["jpe", "jpg"];
  Hp.tiff.output.alias = ["tif"];
  Hp.jp2k.output.alias = ["j2c", "j2k", "jp2", "jpx"];
  var Rz6 = {
      nearest: "nearest",
      bilinear: "bilinear",
      bicubic: "bicubic",
      locallyBoundedBicubic: "lbb",
      nohalo: "nohalo",
      vertexSplitQuadraticBasisSpline: "vsqbs"
    },
    l7A = {
      vips: Im1.semver
    };
  if (!Im1.isGlobal)
    if (!Im1.isWasm) try {
      l7A = UA(`@img/sharp-${IMB}/versions`)
    } catch (A) {
      try {
        l7A = UA(`@img/sharp-libvips-${IMB}/versions`)
      } catch (Q) {}
    } else try {
      l7A = (() => {
        throw new Error("Cannot require module " + "@img/sharp-wasm32/versions");
      })()
    } catch (A) {}
  l7A.sharp = pu1().version;
  if (l7A.heif && Hp.heif) Hp.heif.input.fileSuffix = [".avif"], Hp.heif.output.alias = ["avif"];

  function YMB(A) {
    if (HM.bool(A))
      if (A) return GE.cache(50, 20, 100);
      else return GE.cache(0, 0, 0);
    else if (HM.object(A)) return GE.cache(A.memory, A.files, A.items);
    else return GE.cache()
  }
  YMB(!0);

  function Tz6(A) {
    return GE.concurrency(HM.integer(A) ? A : null)
  }
  if (csA.familySync() === csA.GLIBC && !GE._isUsingJemalloc()) GE.concurrency(1);
  else if (csA.familySync() === csA.MUSL && GE.concurrency() === 1024) GE.concurrency(UA("node:os").availableParallelism());
  var Pz6 = new Mz6.EventEmitter;

  function jz6() {
    return GE.counters()
  }

  function Sz6(A) {
    return GE.simd(HM.bool(A) ? A : null)
  }

  function _z6(A) {
    if (HM.object(A))
      if (Array.isArray(A.operation) && A.operation.every(HM.string)) GE.block(A.operation, !0);
      else throw HM.invalidParameterError("operation", "Array<string>", A.operation);
    else throw HM.invalidParameterError("options", "object", A)
  }

  function kz6(A) {
    if (HM.object(A))
      if (Array.isArray(A.operation) && A.operation.every(HM.string)) GE.block(A.operation, !1);
      else throw HM.invalidParameterError("operation", "Array<string>", A.operation);
    else throw HM.invalidParameterError("options", "object", A)
  }
  JMB.exports = function(A) {
    A.cache = YMB, A.concurrency = Tz6, A.counters = jz6, A.simd = Sz6, A.format = Hp, A.interpolators = Rz6, A.versions = l7A, A.queue = Pz6, A.block = _z6, A.unblock = kz6
  }
})
// @from(Start 6599470, End 6599637)
psA = z((Dr7, XMB) => {
  var Zf = ELB();
  bLB()(Zf);
  dLB()(Zf);
  pLB()(Zf);
  nLB()(Zf);
  rLB()(Zf);
  tLB()(Zf);
  ZMB()(Zf);
  WMB()(Zf);
  XMB.exports = Zf
})
// @from(Start 6599639, End 6600692)
async function i7A(A, Q, B) {
  try {
    let G = await Promise.resolve().then(() => BA(psA(), 1)),
      I = (G.default || G)(A),
      Y = await I.metadata();
    if (!Y.width || !Y.height) {
      if (Q > $$A) return {
        buffer: await I.jpeg({
          quality: 80
        }).toBuffer(),
        mediaType: "jpeg"
      }
    }
    let J = Y.width || 0,
      W = Y.height || 0,
      X = Y.format ?? B,
      V = X === "jpg" ? "jpeg" : X;
    if (Q <= $$A && J <= lsA && W <= isA) return {
      buffer: A,
      mediaType: V
    };
    if (J > lsA) W = Math.round(W * lsA / J), J = lsA;
    if (W > isA) J = Math.round(J * isA / W), W = isA;
    let F = await I.resize(J, W, {
      fit: "inside",
      withoutEnlargement: !0
    }).toBuffer();
    if (F.length > $$A) return {
      buffer: await I.jpeg({
        quality: 80
      }).toBuffer(),
      mediaType: "jpeg"
    };
    return {
      buffer: F,
      mediaType: V
    }
  } catch (G) {
    return AA(G), {
      buffer: A,
      mediaType: B === "jpg" ? "jpeg" : B
    }
  }
}
// @from(Start 6600693, End 6601067)
async function VMB(A) {
  if (A.source.type !== "base64") return A;
  let Q = Buffer.from(A.source.data, "base64"),
    B = Q.length,
    Z = A.source.media_type?.split("/")[1] || "png",
    I = await i7A(Q, B, Z);
  return {
    type: "image",
    source: {
      type: "base64",
      media_type: `image/${I.mediaType}`,
      data: I.buffer.toString("base64")
    }
  }
}
// @from(Start 6601068, End 6601878)
async function rt(A, Q = $$A, B) {
  let G = B?.split("/")[1] || "jpeg",
    Z = G === "jpg" ? "jpeg" : G;
  try {
    let I = await Promise.resolve().then(() => BA(psA(), 1)),
      Y = I.default || I,
      J = await Y(A).metadata(),
      W = J.format || Z,
      X = A.length,
      V = {
        imageBuffer: A,
        metadata: J,
        format: W,
        maxBytes: Q,
        originalSize: X,
        sharp: Y
      };
    if (X <= Q) return w$A(A, W, X);
    let F = await yz6(V);
    if (F) return F;
    if (W === "png") {
      let D = await vz6(V);
      if (D) return D
    }
    let K = await bz6(V, 50);
    if (K) return K;
    return await fz6(V)
  } catch (I) {
    return AA(I), {
      base64: A.toString("base64"),
      mediaType: `image/${Z}`,
      originalSize: A.length
    }
  }
}
// @from(Start 6601879, End 6601994)
async function FMB(A, Q, B) {
  let G = Math.floor(Q / 0.125),
    Z = Math.floor(G * 0.75);
  return rt(A, Z, B)
}
// @from(Start 6601995, End 6602306)
async function KMB(A, Q = $$A) {
  if (A.source.type !== "base64") return A;
  let B = Buffer.from(A.source.data, "base64");
  if (B.length <= Q) return A;
  let G = await rt(B, Q);
  return {
    type: "image",
    source: {
      type: "base64",
      media_type: G.mediaType,
      data: G.base64
    }
  }
}
// @from(Start 6602308, End 6602467)
function w$A(A, Q, B) {
  let G = Q === "jpg" ? "jpeg" : Q;
  return {
    base64: A.toString("base64"),
    mediaType: `image/${G}`,
    originalSize: B
  }
}
// @from(Start 6602468, End 6602917)
async function yz6(A) {
  let Q = [1, 0.75, 0.5, 0.25];
  for (let B of Q) {
    let G = Math.round((A.metadata.width || 2000) * B),
      Z = Math.round((A.metadata.height || 2000) * B),
      I = A.sharp(A.imageBuffer).resize(G, Z, {
        fit: "inside",
        withoutEnlargement: !0
      });
    I = xz6(I, A.format);
    let Y = await I.toBuffer();
    if (Y.length <= A.maxBytes) return w$A(Y, A.format, A.originalSize)
  }
  return null
}
// @from(Start 6602919, End 6603238)
function xz6(A, Q) {
  switch (Q) {
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
// @from(Start 6603239, End 6603535)
async function vz6(A) {
  let Q = await A.sharp(A.imageBuffer).resize(800, 800, {
    fit: "inside",
    withoutEnlargement: !0
  }).png({
    compressionLevel: 9,
    palette: !0,
    colors: 64
  }).toBuffer();
  if (Q.length <= A.maxBytes) return w$A(Q, "png", A.originalSize);
  return null
}
// @from(Start 6603536, End 6603795)
async function bz6(A, Q) {
  let B = await A.sharp(A.imageBuffer).resize(600, 600, {
    fit: "inside",
    withoutEnlargement: !0
  }).jpeg({
    quality: Q
  }).toBuffer();
  if (B.length <= A.maxBytes) return w$A(B, "jpeg", A.originalSize);
  return null
}
// @from(Start 6603796, End 6604010)
async function fz6(A) {
  let Q = await A.sharp(A.imageBuffer).resize(400, 400, {
    fit: "inside",
    withoutEnlargement: !0
  }).jpeg({
    quality: 20
  }).toBuffer();
  return w$A(Q, "jpeg", A.originalSize)
}
// @from(Start 6604015, End 6604028)
$$A = 3932160
// @from(Start 6604032, End 6604042)
lsA = 2000
// @from(Start 6604046, End 6604056)
isA = 2000
// @from(Start 6604062, End 6604086)
ot = L(() => {
  g1()
})
// @from(Start 6604221, End 6604625)
function mz6() {
  let A = process.platform,
    Q = {
      darwin: "No image found in clipboard. Use Cmd + Ctrl + Shift + 4 to copy a screenshot to clipboard.",
      win32: "No image found in clipboard. Use Print Screen to copy a screenshot to clipboard.",
      linux: "No image found in clipboard. Use appropriate screenshot tool to copy a screenshot to clipboard."
    };
  return Q[A] || Q.linux
}
// @from(Start 6604627, End 6606340)
function DMB() {
  let A = process.platform,
    Q = {
      darwin: "/tmp/claude_cli_latest_screenshot.png",
      linux: "/tmp/claude_cli_latest_screenshot.png",
      win32: process.env.TEMP ? `${process.env.TEMP}\\claude_cli_latest_screenshot.png` : "C:\\Temp\\claude_cli_latest_screenshot.png"
    },
    B = Q[A] || Q.linux,
    G = {
      darwin: {
        checkImage: "osascript -e 'the clipboard as «class PNGf»'",
        saveImage: `osascript -e 'set png_data to (the clipboard as «class PNGf»)' -e 'set fp to open for access POSIX file "${B}" with write permission' -e 'write png_data to fp' -e 'close access fp'`,
        getPath: "osascript -e 'get POSIX path of (the clipboard as «class furl»)'",
        deleteFile: `rm -f "${B}"`
      },
      linux: {
        checkImage: 'xclip -selection clipboard -t TARGETS -o 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp)" || wl-paste -l 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp)"',
        saveImage: `xclip -selection clipboard -t image/png -o > "${B}" 2>/dev/null || wl-paste --type image/png > "${B}"`,
        getPath: "xclip -selection clipboard -t text/plain -o 2>/dev/null || wl-paste 2>/dev/null",
        deleteFile: `rm -f "${B}"`
      },
      win32: {
        checkImage: 'powershell -NoProfile -Command "(Get-Clipboard -Format Image) -ne $null"',
        saveImage: `powershell -NoProfile -Command "$img = Get-Clipboard -Format Image; if ($img) { $img.Save('${B.replace(/\\/g,"\\\\")}', [System.Drawing.Imaging.ImageFormat]::Png) }"`,
        getPath: 'powershell -NoProfile -Command "Get-Clipboard"',
        deleteFile: `del /f "${B}"`
      }
    };
  return {
    commands: G[A] || G.linux,
    screenshotPath: B
  }
}
// @from(Start 6606341, End 6606829)
async function ssA() {
  let {
    commands: A,
    screenshotPath: Q
  } = DMB();
  try {
    nsA(A.checkImage, {
      stdio: "ignore"
    }), nsA(A.saveImage, {
      stdio: "ignore"
    });
    let B = RA().readFileBytesSync(Q),
      {
        buffer: G
      } = await i7A(B, B.length, "png"),
      Z = G.toString("base64"),
      I = CMB(Z);
    return nsA(A.deleteFile, {
      stdio: "ignore"
    }), {
      base64: Z,
      mediaType: I
    }
  } catch {
    return null
  }
}
// @from(Start 6606831, End 6607003)
function dz6() {
  let {
    commands: A
  } = DMB();
  try {
    return nsA(A.getPath, {
      encoding: "utf-8"
    }).trim()
  } catch (Q) {
    return AA(Q), null
  }
}
// @from(Start 6607005, End 6607589)
function CMB(A) {
  try {
    let Q = Buffer.from(A, "base64");
    if (Q.length < 4) return "image/png";
    if (Q[0] === 137 && Q[1] === 80 && Q[2] === 78 && Q[3] === 71) return "image/png";
    if (Q[0] === 255 && Q[1] === 216 && Q[2] === 255) return "image/jpeg";
    if (Q[0] === 71 && Q[1] === 73 && Q[2] === 70) return "image/gif";
    if (Q[0] === 82 && Q[1] === 73 && Q[2] === 70 && Q[3] === 70) {
      if (Q.length >= 12 && Q[8] === 87 && Q[9] === 69 && Q[10] === 66 && Q[11] === 80) return "image/webp"
    }
    return "image/png"
  } catch {
    return "image/png"
  }
}
// @from(Start 6607591, End 6607728)
function EMB(A) {
  if (A.startsWith('"') && A.endsWith('"') || A.startsWith("'") && A.endsWith("'")) return A.slice(1, -1);
  return A
}
// @from(Start 6607730, End 6607918)
function zMB(A) {
  if (process.platform === "win32") return A;
  let B = "__DOUBLE_BACKSLASH__";
  return A.replace(/\\\\/g, B).replace(/\\(.)/g, "$1").replace(new RegExp(B, "g"), "\\")
}
// @from(Start 6607920, End 6608001)
function Ym1(A) {
  let Q = EMB(A.trim()),
    B = zMB(Q);
  return HMB.test(B)
}
// @from(Start 6608003, End 6608106)
function cz6(A) {
  let Q = EMB(A.trim()),
    B = zMB(Q);
  if (HMB.test(B)) return B;
  return null
}
// @from(Start 6608107, End 6608624)
async function UMB(A) {
  let Q = cz6(A);
  if (!Q) return null;
  let B = Q,
    G;
  try {
    if (uz6(B)) G = RA().readFileBytesSync(B);
    else {
      let W = dz6();
      if (W && B === hz6(W)) G = RA().readFileBytesSync(W)
    }
  } catch (W) {
    return AA(W), null
  }
  if (!G) return null;
  let Z = gz6(B).slice(1).toLowerCase() || "png",
    {
      buffer: I
    } = await i7A(G, G.length, Z),
    Y = I.toString("base64"),
    J = CMB(Y);
  return {
    path: B,
    base64: Y,
    mediaType: J
  }
}
// @from(Start 6608629, End 6608632)
qr7
// @from(Start 6608634, End 6608643)
asA = 800
// @from(Start 6608647, End 6608650)
HMB
// @from(Start 6608656, End 6608748)
rsA = L(() => {
  AQ();
  g1();
  ot();
  qr7 = mz6();
  HMB = /\.(png|jpe?g|gif|webp)$/i
})
// @from(Start 6608751, End 6609012)
function osA({
  children: A
}) {
  let {
    marker: Q
  } = Cp.useContext(pz6);
  return Cp.default.createElement(S, {
    gap: 1
  }, Cp.default.createElement($, {
    dimColor: !0
  }, Q), Cp.default.createElement(S, {
    flexDirection: "column"
  }, A))
}
// @from(Start 6609017, End 6609019)
Cp
// @from(Start 6609021, End 6609024)
pz6
// @from(Start 6609030, End 6609121)
$MB = L(() => {
  hA();
  Cp = BA(VA(), 1), pz6 = Cp.createContext({
    marker: ""
  })
})
// @from(Start 6609124, End 6609797)
function qMB({
  children: A
}) {
  let {
    marker: Q
  } = DU.useContext(wMB), B = 0;
  for (let Z of DU.default.Children.toArray(A)) {
    if (!DU.isValidElement(Z) || Z.type !== osA) continue;
    B++
  }
  let G = String(B).length;
  return DU.default.createElement(S, {
    flexDirection: "column"
  }, DU.default.Children.map(A, (Z, I) => {
    if (!DU.isValidElement(Z) || Z.type !== osA) return Z;
    let Y = `${String(I+1).padStart(G)}.`,
      J = `${Q}${Y}`;
    return DU.default.createElement(wMB.Provider, {
      value: {
        marker: J
      }
    }, DU.default.createElement(lz6.Provider, {
      value: {
        marker: J
      }
    }, Z))
  }))
}
// @from(Start 6609802, End 6609804)
DU
// @from(Start 6609806, End 6609809)
wMB
// @from(Start 6609811, End 6609814)
lz6
// @from(Start 6609816, End 6609819)
q$A
// @from(Start 6609825, End 6610002)
Jm1 = L(() => {
  hA();
  $MB();
  DU = BA(VA(), 1), wMB = DU.createContext({
    marker: ""
  }), lz6 = DU.createContext({
    marker: ""
  });
  qMB.Item = osA;
  q$A = qMB
})
// @from(Start 6610043, End 6610179)
function LMB() {
  return Wm1().filter(({
    isCompletable: A,
    isEnabled: Q
  }) => A && Q).every(({
    isComplete: A
  }) => A)
}
// @from(Start 6610181, End 6610322)
function n7A() {
  let A = j5();
  if (LMB() && !A.hasCompletedProjectOnboarding) AY({
    ...A,
    hasCompletedProjectOnboarding: !0
  })
}
// @from(Start 6610324, End 6610744)
function Wm1() {
  let A = RA().existsSync(nz6(W0(), "CLAUDE.md")),
    Q = RMB(W0());
  return [{
    key: "workspace",
    text: "Ask Claude to create a new app or clone a repository",
    isComplete: !1,
    isCompletable: !0,
    isEnabled: Q
  }, {
    key: "claudemd",
    text: "Run /init to create a CLAUDE.md file with instructions for Claude",
    isComplete: A,
    isCompletable: !0,
    isEnabled: !Q
  }]
}
// @from(Start 6610746, End 6610867)
function OMB() {
  let A = j5();
  AY({
    ...A,
    projectOnboardingSeenCount: A.projectOnboardingSeenCount + 1
  })
}
// @from(Start 6610872, End 6610875)
iz6
// @from(Start 6610877, End 6610880)
NMB
// @from(Start 6610882, End 6610885)
MMB
// @from(Start 6610891, End 6611133)
N$A = L(() => {
  Jm1();
  hA();
  jQ();
  R9();
  U2();
  AQ();
  l2();
  iz6 = BA(VA(), 1), NMB = BA(VA(), 1);
  MMB = s1(() => {
    if (LMB() || j5().projectOnboardingSeenCount >= 4 || process.env.IS_DEMO) return !1;
    return !0
  })
})
// @from(Start 6611213, End 6611324)
function rz6(A) {
  let Q = N1();
  Q.appleTerminalSetupInProgress = !0, Q.appleTerminalBackupPath = A, c0(Q)
}
// @from(Start 6611326, End 6611405)
function L$A() {
  let A = N1();
  A.appleTerminalSetupInProgress = !1, c0(A)
}
// @from(Start 6611407, End 6611560)
function oz6() {
  let A = N1();
  return {
    inProgress: A.appleTerminalSetupInProgress ?? !1,
    backupPath: A.appleTerminalBackupPath || null
  }
}
// @from(Start 6611562, End 6611654)
function a7A() {
  return sz6(az6(), "Library", "Preferences", "com.apple.Terminal.plist")
}
// @from(Start 6611655, End 6612049)
async function TMB() {
  let A = a7A(),
    Q = `${A}.bak`;
  try {
    let {
      code: B
    } = await QQ("defaults", ["export", "com.apple.Terminal", A]);
    if (B !== 0) return null;
    if (RA().existsSync(A)) return await QQ("defaults", ["export", "com.apple.Terminal", Q]), rz6(Q), Q;
    return null
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), null
  }
}
// @from(Start 6612050, End 6612675)
async function tsA() {
  let {
    inProgress: A,
    backupPath: Q
  } = oz6();
  if (!A) return {
    status: "no_backup"
  };
  if (!Q || !RA().existsSync(Q)) return L$A(), {
    status: "no_backup"
  };
  try {
    let {
      code: B
    } = await QQ("defaults", ["import", "com.apple.Terminal", Q]);
    if (B !== 0) return {
      status: "failed",
      backupPath: Q
    };
    return await QQ("killall", ["cfprefsd"]), L$A(), {
      status: "restored"
    }
  } catch (B) {
    return AA(Error(`Failed to restore Terminal.app settings with: ${B}`)), L$A(), {
      status: "failed",
      backupPath: Q
    }
  }
}
// @from(Start 6612680, End 6612729)
Xm1 = L(() => {
  _8();
  g1();
  jQ();
  AQ()
})
// @from(Start 6612809, End 6612906)
function AU6(A) {
  let Q = N1();
  Q.iterm2SetupInProgress = !0, Q.iterm2BackupPath = A, c0(Q)
}
// @from(Start 6612908, End 6612980)
function s7A() {
  let A = N1();
  A.iterm2SetupInProgress = !1, c0(A)
}
// @from(Start 6612982, End 6613121)
function QU6() {
  let A = N1();
  return {
    inProgress: A.iterm2SetupInProgress ?? !1,
    backupPath: A.iterm2BackupPath || null
  }
}
// @from(Start 6613123, End 6613218)
function esA() {
  return ez6(tz6(), "Library", "Preferences", "com.googlecode.iterm2.plist")
}
// @from(Start 6613219, End 6613520)
async function PMB() {
  let A = esA(),
    Q = `${A}.bak`;
  try {
    if (await QQ("defaults", ["export", "com.googlecode.iterm2", A]), RA().existsSync(A)) return RA().copyFileSync(A, Q), AU6(Q), Q;
    return null
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), null
  }
}
// @from(Start 6613522, End 6613961)
function jMB() {
  let {
    inProgress: A,
    backupPath: Q
  } = QU6();
  if (!A) return {
    status: "no_backup"
  };
  if (!Q || !RA().existsSync(Q)) return s7A(), {
    status: "no_backup"
  };
  try {
    return RA().copyFileSync(Q, esA()), s7A(), {
      status: "restored"
    }
  } catch (B) {
    return AA(Error(`Failed to restore iTerm2 settings with: ${B}`)), s7A(), {
      status: "failed",
      backupPath: Q
    }
  }
}
// @from(Start 6613966, End 6614015)
Vm1 = L(() => {
  _8();
  g1();
  jQ();
  AQ()
})
// @from(Start 6614191, End 6614450)
function M$A() {
  return QrA() === "darwin" && (d0.terminal === "iTerm.app" || d0.terminal === "Apple_Terminal") || d0.terminal === "vscode" || d0.terminal === "cursor" || d0.terminal === "windsurf" || d0.terminal === "ghostty" || d0.terminal === "WezTerm"
}
// @from(Start 6614451, End 6615227)
async function Dm1(A) {
  let Q = "";
  switch (d0.terminal) {
    case "iTerm.app":
      Q = await YU6(A);
      break;
    case "Apple_Terminal":
      Q = await JU6(A);
      break;
    case "vscode":
      Q = Fm1("VSCode", A);
      break;
    case "cursor":
      Q = Fm1("Cursor", A);
      break;
    case "windsurf":
      Q = Fm1("Windsurf", A);
      break;
    case "ghostty":
      Q = await IU6(A);
      break;
    case "WezTerm":
      Q = await ZU6(A);
      break;
    case null:
      break
  }
  let B = N1();
  if (["iTerm.app", "vscode", "cursor", "windsurf", "ghostty", "WezTerm"].includes(d0.terminal ?? "")) B.shiftEnterKeyBindingInstalled = !0;
  else if (d0.terminal === "Apple_Terminal") B.optionAsMetaKeyInstalled = !0;
  return c0(B), n7A(), Q
}
// @from(Start 6615229, End 6615298)
function kMB() {
  return N1().shiftEnterKeyBindingInstalled === !0
}
// @from(Start 6615300, End 6615364)
function yMB() {
  return N1().optionAsMetaKeyInstalled === !0
}
// @from(Start 6615366, End 6615428)
function xMB() {
  return N1().hasUsedBackslashReturn === !0
}
// @from(Start 6615430, End 6615548)
function vMB() {
  let A = N1();
  if (!A.hasUsedBackslashReturn) c0({
    ...A,
    hasUsedBackslashReturn: !0
  })
}
// @from(Start 6615549, End 6617624)
async function ZU6(A) {
  let B = If(ArA(), ".wezterm.lua");
  try {
    let G = "",
      Z = !1;
    if (RA().existsSync(B)) {
      if (Z = !0, G = RA().readFileSync(B, {
          encoding: "utf-8"
        }), G.includes('mods="SHIFT"') && G.includes('key="Enter"')) return `${ZB("warning",A)("Found existing WezTerm Shift+Enter key binding. Remove it to continue.")}${m7}${tA.dim(`See ${B}`)}${m7}`;
      let I = Km1(4).toString("hex"),
        Y = `${B}.${I}.bak`;
      try {
        RA().copyFileSync(B, Y)
      } catch (J) {
        return AA(J instanceof Error ? J : Error(String(J))), `${ZB("warning",A)("Error backing up existing WezTerm config. Bailing out.")}${m7}${tA.dim(`See ${B}`)}${m7}${tA.dim(`Backup path: ${Y}`)}${m7}`
      }
    }
    if (!Z) G = `local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.keys = {
  {key="Enter", mods="SHIFT", action=wezterm.action{SendString="\\x1b\\r"}},
}

return config
`;
    else {
      let I = G.match(/config\.keys\s*=\s*\{([^}]*)\}/s);
      if (I) {
        let Y = I[1] ?? "",
          J = Y.trim() ? `${Y.trim()},
  {key="Enter", mods="SHIFT", action=wezterm.action{SendString="\\x1b\\r"}},` : `
  {key="Enter", mods="SHIFT", action=wezterm.action{SendString="\\x1b\\r"}},
`;
        G = G.replace(/config\.keys\s*=\s*\{[^}]*\}/s, `config.keys = {${J}}`)
      } else if (G.match(/return\s+config/s)) G = G.replace(/return\s+config/s, `config.keys = {
  {key="Enter", mods="SHIFT", action=wezterm.action{SendString="\\x1b\\r"}},
}

return config`);
      else G += `
config.keys = {
  {key="Enter", mods="SHIFT", action=wezterm.action{SendString="\\x1b\\r"}},
}
`
    }
    return RA().writeFileSync(B, G, {
      encoding: "utf-8",
      flush: !1
    }), `${ZB("success",A)("Installed WezTerm Shift+Enter key binding")}${m7}${ZB("success",A)("You may need to restart WezTerm for changes to take effect")}${m7}${tA.dim(`See ${B}`)}${m7}`
  } catch (G) {
    throw AA(G instanceof Error ? G : Error(String(G))), Error("Failed to install WezTerm Shift+Enter key binding")
  }
}
// @from(Start 6617625, End 6619299)
async function IU6(A) {
  let B = [],
    G = process.env.XDG_CONFIG_HOME;
  if (G) B.push(If(G, "ghostty", "config"));
  else B.push(If(ArA(), ".config", "ghostty", "config"));
  if (QrA() === "darwin") B.push(If(ArA(), "Library", "Application Support", "com.mitchellh.ghostty", "config"));
  let Z = null,
    I = !1;
  for (let Y of B)
    if (RA().existsSync(Y)) {
      Z = Y, I = !0;
      break
    } if (!Z) Z = B[0] ?? null, I = !1;
  if (!Z) throw Error("No valid config path found for Ghostty");
  try {
    let Y = "";
    if (I) {
      if (Y = RA().readFileSync(Z, {
          encoding: "utf-8"
        }), Y.includes("shift+enter")) return `${ZB("warning",A)("Found existing Ghostty Shift+Enter key binding. Remove it to continue.")}${m7}${tA.dim(`See ${Z}`)}${m7}`;
      let W = Km1(4).toString("hex"),
        X = `${Z}.${W}.bak`;
      try {
        RA().copyFileSync(Z, X)
      } catch {
        return `${ZB("warning",A)("Error backing up existing Ghostty config. Bailing out.")}${m7}${tA.dim(`See ${Z}`)}${m7}${tA.dim(`Backup path: ${X}`)}${m7}`
      }
    } else {
      let W = BU6(Z);
      if (!RA().existsSync(W)) RA().mkdirSync(W)
    }
    let J = Y;
    if (Y && !Y.endsWith(`
`)) J += `
`;
    return J += `keybind = shift+enter=text:\\x1b\\r
`, RA().writeFileSync(Z, J, {
      encoding: "utf-8",
      flush: !1
    }), `${ZB("success",A)("Installed Ghostty Shift+Enter key binding")}${m7}${ZB("success",A)("You may need to restart Ghostty for changes to take effect")}${m7}${tA.dim(`See ${Z}`)}${m7}`
  } catch (Y) {
    throw AA(Y instanceof Error ? Y : Error(String(Y))), Error("Failed to install Ghostty Shift+Enter key binding")
  }
}
// @from(Start 6619300, End 6620785)
async function YU6(A) {
  let Q = esA();
  try {
    if (!await PMB()) throw Error("Failed to create backup of iTerm2 preferences, bailing out");
    let {
      code: G
    } = await QQ("defaults", ["write", "com.googlecode.iterm2", "GlobalKeyMap", "-dict-add", "0xd-0x20000-0x24", `<dict>
        <key>Text</key>
        <string>\\n</string>
        <key>Action</key>
        <integer>12</integer>
        <key>Version</key>
        <integer>1</integer>
        <key>Keycode</key>
        <integer>13</integer>
        <key>Modifiers</key>
        <integer>131072</integer>
      </dict>`]);
    if (G !== 0) throw Error("Failed to install iTerm2 Shift+Enter key binding");
    return await QQ("defaults", ["export", "com.googlecode.iterm2", Q]), s7A(), `${ZB("success",A)("Installed iTerm2 Shift+Enter key binding")}${m7}${tA.dim("See iTerm2 → Preferences → Keys")}${m7}`
  } catch (B) {
    AA(B instanceof Error ? B : Error(String(B)));
    let G = N1().iterm2BackupPath,
      Z = !1;
    if (G && RA().existsSync(G)) try {
      await QQ("defaults", ["import", "com.googlecode.iterm2", G]), Z = !0, s7A()
    } catch (I) {
      AA(Error(`Failed to restore from backup: ${String(I)}`))
    }
    throw Error(`Failed to install iTerm2 Shift+Enter key binding. ${Z?"Your settings have been restored from backup.":G&&RA().existsSync(G)?`Restoring from backup failed, try manually with: defaults import com.googlecode.iterm2 ${G}`:"No backup was available to restore from."}`)
  }
}
// @from(Start 6620787, End 6622379)
function Fm1(A = "VSCode", Q) {
  let B = A === "VSCode" ? "Code" : A,
    G = If(ArA(), QrA() === "win32" ? If("AppData", "Roaming", B, "User") : QrA() === "darwin" ? If("Library", "Application Support", B, "User") : If(".config", B, "User")),
    Z = If(G, "keybindings.json");
  try {
    let I = "[]",
      Y = [];
    if (!RA().existsSync(G)) RA().mkdirSync(G);
    if (RA().existsSync(Z)) {
      I = RA().readFileSync(Z, {
        encoding: "utf-8"
      }), Y = Pr0(I) ?? [];
      let V = Km1(4).toString("hex"),
        F = `${Z}.${V}.bak`;
      try {
        RA().copyFileSync(Z, F)
      } catch {
        return `${ZB("warning",Q)(`Error backing up existing ${A} terminal keybindings. Bailing out.`)}${m7}${tA.dim(`See ${Z}`)}${m7}${tA.dim(`Backup path: ${F}`)}${m7}`
      }
    }
    if (Y.find((V) => V.key === "shift+enter" && V.command === "workbench.action.terminal.sendSequence" && V.when === "terminalFocus")) return `${ZB("warning",Q)(`Found existing ${A} terminal Shift+Enter key binding. Remove it to continue.`)}${m7}${tA.dim(`See ${Z}`)}${m7}`;
    let X = jr0(I, {
      key: "shift+enter",
      command: "workbench.action.terminal.sendSequence",
      args: {
        text: "\x1B\r"
      },
      when: "terminalFocus"
    });
    return RA().writeFileSync(Z, X, {
      encoding: "utf-8",
      flush: !1
    }), `${ZB("success",Q)(`Installed ${A} terminal Shift+Enter key binding`)}${m7}${tA.dim(`See ${Z}`)}${m7}`
  } catch (I) {
    throw AA(I instanceof Error ? I : Error(String(I))), Error(`Failed to install ${A} terminal Shift+Enter key binding`)
  }
}
// @from(Start 6622380, End 6622827)
async function SMB(A) {
  let {
    code: Q
  } = await QQ("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${A}':useOptionAsMetaKey bool true`, a7A()]);
  if (Q !== 0) {
    let {
      code: B
    } = await QQ("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${A}':useOptionAsMetaKey true`, a7A()]);
    if (B !== 0) return AA(Error(`Failed to enable Option as Meta key for Terminal.app profile: ${A}`)), !1
  }
  return !0
}
// @from(Start 6622828, End 6623242)
async function _MB(A) {
  let {
    code: Q
  } = await QQ("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${A}':Bell bool false`, a7A()]);
  if (Q !== 0) {
    let {
      code: B
    } = await QQ("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${A}':Bell false`, a7A()]);
    if (B !== 0) return AA(Error(`Failed to disable audio bell for Terminal.app profile: ${A}`)), !1
  }
  return !0
}
// @from(Start 6623243, End 6625020)
async function JU6(A) {
  try {
    if (!await TMB()) throw Error("Failed to create backup of Terminal.app preferences, bailing out");
    let {
      stdout: B,
      code: G
    } = await QQ("defaults", ["read", "com.apple.Terminal", "Default Window Settings"]);
    if (G !== 0 || !B.trim()) throw Error("Failed to read default Terminal.app profile");
    let {
      stdout: Z,
      code: I
    } = await QQ("defaults", ["read", "com.apple.Terminal", "Startup Window Settings"]);
    if (I !== 0 || !Z.trim()) throw Error("Failed to read startup Terminal.app profile");
    let Y = !1,
      J = B.trim(),
      W = await SMB(J),
      X = await _MB(J);
    if (W || X) Y = !0;
    let V = Z.trim();
    if (V !== J) {
      let F = await SMB(V),
        K = await _MB(V);
      if (F || K) Y = !0
    }
    if (!Y) throw Error("Failed to enable Option as Meta key or disable audio bell for any Terminal.app profile");
    return await QQ("killall", ["cfprefsd"]), L$A(), `${ZB("success",A)("Configured Terminal.app settings:")}${m7}${ZB("success",A)('- Enabled "Use Option as Meta key"')}${m7}${ZB("success",A)("- Switched to visual bell")}${m7}${tA.dim("Option+Enter will now enter a newline.")}${m7}${tA.dim("You must restart Terminal.app for changes to take effect.",A)}${m7}`
  } catch (Q) {
    AA(Q instanceof Error ? Q : Error(String(Q)));
    let B = await tsA(),
      G = "Failed to enable Option as Meta key for Terminal.app.";
    if (B.status === "restored") throw Error(`${G} Your settings have been restored from backup.`);
    else if (B.status === "failed") throw Error(`${G} Restoring from backup failed, try manually with: defaults import com.apple.Terminal ${B.backupPath}`);
    else throw Error(`${G} No backup was available to restore from.`)
  }
}
// @from(Start 6625025, End 6625028)
GU6
// @from(Start 6625030, End 6625032)
Ep
// @from(Start 6625038, End 6626352)
r7A = L(() => {
  F9();
  N$A();
  Xm1();
  jQ();
  c5();
  _8();
  AQ();
  Vm1();
  LF();
  g1();
  hA();
  Q3();
  GU6 = {
    type: "local-jsx",
    name: "terminal-setup",
    userFacingName() {
      return "terminal-setup"
    },
    description: d0.terminal === "Apple_Terminal" ? "Enable Option+Enter key binding for newlines and visual bell" : "Install Shift+Enter key binding for newlines",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      if (!M$A()) {
        let G = d0.terminal || "your current terminal",
          Z = dQ(),
          I = "";
        if (Z === "macos") I = `   • macOS: iTerm2, Apple Terminal
`;
        else if (Z === "windows") I = `   • Windows: Windows Terminal
`;
        let Y = `Terminal setup cannot be run from ${G}.

This command configures a convenient Shift+Enter shortcut for multi-line prompts.
${tA.dim("Note: You can already use backslash (\\) + return to add newlines.")}

To set up the shortcut (optional):
1. Exit tmux/screen temporarily
2. Run /terminal-setup directly in one of these terminals:
${I}   • IDE: VSCode, Cursor, Windsurf
   • Other: Ghostty, WezTerm
3. Return to tmux/screen - settings will persist`;
        return A(Y), null
      }
      let B = await Dm1(Q.options.theme);
      return A(B), null
    }
  };
  Ep = GU6
})
// @from(Start 6626393, End 6626459)
function GrA(A) {
  return (A.match(/\r\n|\r|\n/g) || []).length
}
// @from(Start 6626461, End 6626571)
function gMB(A, Q) {
  if (Q === 0) return `[Pasted text #${A}]`;
  return `[Pasted text #${A} +${Q} lines]`
}
// @from(Start 6626573, End 6626617)
function uMB(A) {
  return `[Image #${A}]`
}
// @from(Start 6626619, End 6626845)
function mMB(A) {
  let Q = /\[(Pasted text|Image|\.\.\.Truncated text) #(\d+)(?: \+\d+ lines)?(\.)*\]/g;
  return [...A.matchAll(Q)].map((G) => ({
    id: parseInt(G[2] || "0"),
    match: G[0]
  })).filter((G) => G.id > 0)
}
// @from(Start 6626847, End 6626889)
function VU6(A) {
  return JSON.parse(A)
}
// @from(Start 6626890, End 6627161)
async function* ZrA() {
  for (let B = Yf.length - 1; B >= 0; B--) yield Yf[B];
  let A = fMB(MQ(), "history.jsonl");
  if (!RA().existsSync(A)) return;
  for await (let B of fH0(A)) try {
    yield VU6(B)
  } catch (G) {
    g(`Failed to parse history line: ${G}`)
  }
}
// @from(Start 6627162, End 6627308)
async function* Cm1() {
  let A = uQ(),
    Q = 0;
  for await (let B of ZrA()) if (B.project === A) {
    if (yield B, Q++, Q >= WU6) break
  }
}
// @from(Start 6627309, End 6627898)
async function dMB() {
  if (Yf.length === 0) return;
  let A;
  try {
    let Q = fMB(MQ(), "history.jsonl"),
      B = RA();
    if (!B.existsSync(Q)) B.writeFileSync(Q, "", {
      encoding: "utf8",
      flush: !0,
      mode: 384
    });
    A = await hMB.lock(Q, {
      stale: 1e4,
      retries: {
        retries: 3,
        minTimeout: 50
      }
    });
    let G = Yf.map((Z) => JSON.stringify(Z) + `
`);
    Yf = [], B.appendFileSync(Q, G.join(""), {
      mode: 384
    })
  } catch (Q) {
    g(`Failed to write prompt history: ${Q}`)
  } finally {
    if (A) await A()
  }
}
// @from(Start 6627899, End 6628127)
async function cMB(A) {
  if (Hm1 || Yf.length === 0) return;
  if (A > 5) return;
  Hm1 = !0;
  try {
    await dMB()
  } finally {
    if (Hm1 = !1, Yf.length > 0) await new Promise((Q) => setTimeout(Q, 500)), cMB(A + 1)
  }
}
// @from(Start 6628128, End 6628559)
async function FU6(A) {
  let Q = typeof A === "string" ? {
      display: A,
      pastedContents: {}
    } : A,
    B = {};
  if (Q.pastedContents) {
    for (let [Z, I] of Object.entries(Q.pastedContents))
      if (I.type !== "image" && I.content.length <= XU6) B[Number(Z)] = I
  }
  let G = {
    ...Q,
    pastedContents: B,
    timestamp: Date.now(),
    project: uQ(),
    sessionId: e1()
  };
  Yf.push(G), BrA = cMB(0)
}
// @from(Start 6628561, End 6628692)
function Jf(A) {
  if (!bMB) bMB = !0, PG(async () => {
    if (BrA) await BrA;
    if (Yf.length > 0) await dMB()
  });
  FU6(A)
}
// @from(Start 6628697, End 6628700)
hMB
// @from(Start 6628702, End 6628711)
WU6 = 100
// @from(Start 6628715, End 6628725)
XU6 = 1024
// @from(Start 6628729, End 6628731)
Yf
// @from(Start 6628733, End 6628741)
Hm1 = !1
// @from(Start 6628745, End 6628755)
BrA = null
// @from(Start 6628759, End 6628767)
bMB = !1
// @from(Start 6628773, End 6628862)
zp = L(() => {
  hQ();
  AQ();
  _0();
  V0();
  HH();
  hMB = BA(T4A(), 1);
  Yf = []
})
// @from(Start 6628868, End 6628871)
Em1
// @from(Start 6628873, End 6628876)
KU6
// @from(Start 6628878, End 6628880)
HU
// @from(Start 6628882, End 6628884)
tt
// @from(Start 6628890, End 6629492)
Up = L(() => {
  Q3();
  Em1 = BA(KU(), 1), KU6 = dQ() !== "windows" || (ms() ? Em1.default.satisfies(process.versions.bun, ">=1.2.23") : Em1.default.satisfies(process.versions.node, ">=22.17.0 <23.0.0 || >=24.2.0")), HU = !KU6 ? {
    displayText: "alt+m",
    check: (A, Q) => Q.meta && (A === "m" || A === "M")
  } : {
    displayText: "shift+tab",
    check: (A, Q) => Q.tab && Q.shift
  }, tt = dQ() === "windows" ? {
    displayText: "alt+v",
    check: (A, Q) => Q.meta && (A === "v" || A === "V")
  } : {
    displayText: "ctrl+v",
    check: (A, Q) => Q.ctrl && (A === "v" || A === "V")
  }
})
// @from(Start 6629495, End 6629695)
function pMB(A, Q) {
  switch (Q) {
    case "bash":
      return `!${A}`;
    case "memorySelect":
      return `#${A}`;
    case "background":
      return `&${A}`;
    default:
      return A
  }
}
// @from(Start 6629697, End 6629886)
function Wf(A) {
  if (A.startsWith("!")) return "bash";
  if (A.startsWith("#")) return "memory";
  if (A.startsWith("&") && o2("tengu_web_tasks")) return "background";
  return "prompt"
}
// @from(Start 6629888, End 6629962)
function et(A) {
  if (Wf(A) === "prompt") return A;
  return A.slice(1)
}
// @from(Start 6629964, End 6630053)
function lMB(A) {
  return A === "!" || A === "#" || o2("tengu_web_tasks") && A === "&"
}
// @from(Start 6630058, End 6630083)
o7A = L(() => {
  u2()
})
// @from(Start 6630086, End 6630163)
function $p(A) {
  return A.filter((Q) => Q.data?.type !== "hook_progress")
}
// @from(Start 6630168, End 6630352)
ZE = () => ({
  mode: "default",
  additionalWorkingDirectories: new Map,
  alwaysAllowRules: {},
  alwaysDenyRules: {},
  alwaysAskRules: {},
  isBypassPermissionsModeAvailable: !1
})
// @from(Start 6630355, End 6630505)
function t7A(A) {
  let Q = IrA.useCallback((B) => {
    e7A();
    let G = l0();
    A(B, G)
  }, [A]);
  IrA.useEffect(() => fm.subscribe(Q), [Q])
}
// @from(Start 6630510, End 6630513)
IrA
// @from(Start 6630519, End 6630574)
YrA = L(() => {
  qKA();
  MB();
  IrA = BA(VA(), 1)
})
// @from(Start 6630577, End 6630706)
function WrA(A) {
  let Q = A.toLowerCase();
  return Q === "ultrathink" || Q === "think ultra hard" || Q === "think ultrahard"
}
// @from(Start 6630708, End 6630785)
function O$A(A, Q = !1) {
  let B = Q ? HU6 : DU6;
  return B[A % B.length]
}
// @from(Start 6630787, End 6631176)
function nMB(A, Q) {
  let B = [],
    G = 0;
  for (let Z of Q) {
    if (Z.start > G) B.push({
      text: A.slice(G, Z.start),
      isTrigger: !1,
      start: G
    });
    B.push({
      text: A.slice(Z.start, Z.end),
      isTrigger: !0,
      start: Z.start
    }), G = Z.end
  }
  if (G < A.length) B.push({
    text: A.slice(G),
    isTrigger: !1,
    start: G
  });
  return B
}
// @from(Start 6631178, End 6631491)
function Xf(A, Q) {
  if (process.env.MAX_THINKING_TOKENS) {
    let B = parseInt(process.env.MAX_THINKING_TOKENS, 10);
    if (B > 0) GA("tengu_thinking", {
      provider: _R(),
      tokenCount: B
    });
    return B
  }
  return Math.max(...A.filter((B) => B.type === "user" && !B.isMeta).map(zU6), Q ?? 0)
}
// @from(Start 6631493, End 6631555)
function EU6(A) {
  return A === "high" ? zm1.ULTRATHINK : 0
}
// @from(Start 6631557, End 6631994)
function zU6(A) {
  if (A.isMeta) return 0;
  if (A.thinkingMetadata) {
    let {
      level: G,
      disabled: Z
    } = A.thinkingMetadata;
    if (Z) return 0;
    let I = EU6(G);
    if (I > 0) GA("tengu_thinking", {
      provider: _R(),
      tokenCount: I
    });
    return I
  }
  let Q = UU6(A),
    {
      tokens: B
    } = Ae(Q);
  if (B > 0) GA("tengu_thinking", {
    provider: _R(),
    tokenCount: B
  });
  return B
}
// @from(Start 6631996, End 6632166)
function UU6(A) {
  if (typeof A.message.content === "string") return A.message.content;
  return A.message.content.map((Q) => Q.type === "text" ? Q.text : "").join("")
}
// @from(Start 6632168, End 6632312)
function Ae(A) {
  let Q = /\bultrathink\b/i.test(A);
  return {
    tokens: Q ? zm1.ULTRATHINK : zm1.NONE,
    level: Q ? "high" : "none"
  }
}
// @from(Start 6632314, End 6632520)
function XrA(A) {
  let Q = [],
    B = A.matchAll(CU6);
  for (let G of B)
    if (G.index !== void 0) Q.push({
      word: G[0],
      start: G.index,
      end: G.index + G[0].length
    });
  return Q
}
// @from(Start 6632522, End 6632888)
function VrA() {
  if (process.env.MAX_THINKING_TOKENS) return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
  let Q = l0().alwaysThinkingEnabled;
  if (Q === !0 || Q === !1) return Q;
  let B = k3();
  if (B.includes("claude-sonnet-4-5")) return !0;
  if (B.includes("claude-opus-4-5")) return BZ("tengu_deep_ocean_current", "on_by_default", !1);
  return !1
}
// @from(Start 6632893, End 6632896)
JrA
// @from(Start 6632898, End 6632901)
iMB
// @from(Start 6632903, End 6632906)
DU6
// @from(Start 6632908, End 6632911)
HU6
// @from(Start 6632913, End 6632916)
zm1
// @from(Start 6632918, End 6632921)
CU6
// @from(Start 6632927, End 6633495)
CU = L(() => {
  q0();
  u2();
  lK();
  MB();
  t2();
  JrA = {
    none: "text",
    high: "claude"
  }, iMB = {
    none: "promptBorderShimmer",
    high: "claudeShimmer"
  }, DU6 = ["rainbow_red", "rainbow_orange", "rainbow_yellow", "rainbow_green", "rainbow_blue", "rainbow_indigo", "rainbow_violet"], HU6 = ["rainbow_red_shimmer", "rainbow_orange_shimmer", "rainbow_yellow_shimmer", "rainbow_green_shimmer", "rainbow_blue_shimmer", "rainbow_indigo_shimmer", "rainbow_violet_shimmer"];
  zm1 = {
    ULTRATHINK: 31999,
    NONE: 0
  }, CU6 = /\bultrathink\b/gi
})
// @from(Start 6633498, End 6634642)
function wp() {
  return {
    settings: $T(),
    backgroundTasks: {},
    verbose: !1,
    mainLoopModel: null,
    mainLoopModelForSession: null,
    statusLineText: void 0,
    showExpandedTodos: !1,
    toolPermissionContext: ZE(),
    agentDefinitions: {
      activeAgents: [],
      allAgents: []
    },
    fileHistory: {
      snapshots: [],
      trackedFiles: new Set
    },
    mcp: {
      clients: [],
      tools: [],
      commands: [],
      resources: {}
    },
    plugins: {
      enabled: [],
      disabled: [],
      commands: [],
      agents: [],
      errors: [],
      installationStatus: {
        marketplaces: [],
        plugins: []
      }
    },
    todos: {},
    notifications: {
      current: null,
      queue: []
    },
    elicitation: {
      queue: []
    },
    thinkingEnabled: VrA(),
    feedbackSurvey: {
      timeLastShown: null,
      submitCountAtLastAppearance: null
    },
    sessionHooks: {},
    promptSuggestion: {
      text: null,
      shownAt: 0
    },
    queuedCommands: [],
    gitDiff: {
      stats: null,
      hunks: new Map,
      lastUpdated: 0,
      version: 0
    }
  }
}
// @from(Start 6634644, End 6635672)
function yG({
  children: A,
  initialState: Q,
  onChangeAppState: B
}) {
  if (IE.useContext(aMB)) throw Error("AppStateProvider can not be nested within another AppStateProvider");
  let [Z, I] = IE.useState({
    currentState: Q ?? wp(),
    previousState: null
  }), Y = IE.useCallback((W) => {
    I(({
      currentState: X
    }) => {
      let V = {
        currentState: W(X),
        previousState: X
      };
      return B?.({
        newState: V.currentState,
        oldState: V.previousState
      }), V
    })
  }, [B]), J = IE.useMemo(() => {
    let W = [Z.currentState, Y];
    return W.__IS_INITIALIZED__ = !0, W
  }, [Z.currentState, Y]);
  return t7A(IE.useCallback((W, X) => {
    g(`Settings changed from ${W}, updating AppState`);
    let V = IxA();
    Y((F) => ({
      ...F,
      settings: X,
      toolPermissionContext: rMB(F.toolPermissionContext, V)
    }))
  }, [Y])), IE.default.createElement(aMB.Provider, {
    value: !0
  }, IE.default.createElement(sMB.Provider, {
    value: J
  }, A))
}
// @from(Start 6635674, End 6635850)
function OQ() {
  let A = IE.useContext(sMB);
  if (!A.__IS_INITIALIZED__) throw ReferenceError("useAppState cannot be called outside of an <AppStateProvider />");
  return A
}
// @from(Start 6635855, End 6635857)
IE
// @from(Start 6635859, End 6635862)
sMB
// @from(Start 6635864, End 6635867)
aMB
// @from(Start 6635873, End 6636044)
z9 = L(() => {
  YrA();
  AZ();
  is();
  CU();
  MB();
  V0();
  IE = BA(VA(), 1);
  sMB = IE.default.createContext([{}, (A) => A]), aMB = IE.default.createContext(!1)
})
// @from(Start 6636047, End 6638109)
function vZ() {
  let [A, Q] = OQ(), B = R$A.useCallback(() => {
    Q((Z) => {
      let I = $U6(Z.notifications.queue);
      if (Z.notifications.current !== null || !I) return Z;
      return Qe = setTimeout(() => {
        Qe = null, Q((Y) => {
          if (Y.notifications.current?.key !== I.key) return Y;
          return {
            ...Y,
            notifications: {
              queue: Y.notifications.queue,
              current: null
            }
          }
        }), B()
      }, I.timeoutMs ?? oMB), {
        ...Z,
        notifications: {
          queue: Z.notifications.queue.filter((Y) => Y !== I),
          current: I
        }
      }
    })
  }, [Q]), G = R$A.useCallback((Z) => {
    if (Z.priority === "immediate") {
      if (Qe) clearTimeout(Qe), Qe = null;
      Qe = setTimeout(() => {
        Qe = null, Q((I) => {
          if (I.notifications.current?.key !== Z.key) return I;
          return {
            ...I,
            notifications: {
              queue: I.notifications.queue.filter((Y) => !Z.invalidates?.includes(Y.key)),
              current: null
            }
          }
        }), B()
      }, Z.timeoutMs ?? oMB), Q((I) => ({
        ...I,
        notifications: {
          current: Z,
          queue: [...I.notifications.current ? [I.notifications.current] : [], ...I.notifications.queue].filter((Y) => Y.priority !== "immediate" && !Z.invalidates?.includes(Y.key))
        }
      }));
      return
    }
    Q((I) => {
      if (Z.priority === "immediate") return I;
      let J = !new Set(I.notifications.queue.map((W) => W.key)).has(Z.key) && I.notifications.current?.key !== Z.key;
      return {
        ...I,
        notifications: {
          current: I.notifications.current,
          queue: J ? [...I.notifications.queue.filter((W) => W.priority !== "immediate" && !Z.invalidates?.includes(W.key)), Z] : I.notifications.queue
        }
      }
    }), B()
  }, [Q, B]);
  return R$A.useEffect(() => {
    if (A.notifications.queue.length > 0) B()
  }, []), {
    addNotification: G
  }
}
// @from(Start 6638111, End 6638253)
function $U6(A) {
  return A.sort((Q, B) => {
    let G = tMB[Q.priority] ?? 999,
      Z = tMB[B.priority] ?? 999;
    return G - Z
  })[0]
}
// @from(Start 6638258, End 6638261)
R$A
// @from(Start 6638263, End 6638273)
oMB = 8000
// @from(Start 6638277, End 6638286)
Qe = null
// @from(Start 6638290, End 6638293)
tMB
// @from(Start 6638299, End 6638416)
EU = L(() => {
  z9();
  R$A = BA(VA(), 1);
  tMB = {
    immediate: 0,
    high: 1,
    medium: 2,
    low: 3
  }
})
// @from(Start 6638419, End 6638513)
function eMB(A) {
  return function(Q) {
    return (new Map(A).get(Q) ?? (() => {}))(Q)
  }
}
// @from(Start 6638515, End 6644036)
function FrA({
  value: A,
  onChange: Q,
  onSubmit: B,
  onExit: G,
  onExitMessage: Z,
  onHistoryUp: I,
  onHistoryDown: Y,
  onHistoryReset: J,
  mask: W = "",
  multiline: X = !1,
  cursorChar: V,
  invert: F,
  columns: K,
  onImagePaste: D,
  disableCursorMovementForUpDownKeys: H = !1,
  externalOffset: C,
  onOffsetChange: E,
  inputFilter: U
}) {
  let q = C,
    w = E,
    N = j7.fromText(A, K, q),
    {
      addNotification: R
    } = vZ(),
    T = Bf((qA) => {
      Z?.(qA, "Ctrl-C")
    }, () => G?.(), () => {
      if (A) Q(""), w(0), J?.()
    }),
    y = Bf((qA) => {
      if (!A || !qA) return;
      R({
        key: "escape-again-to-clear",
        text: "Press Escape again to clear",
        priority: "immediate",
        timeoutMs: 1000
      })
    }, () => {
      if (A) {
        if (A.trim() !== "") Jf(A);
        Q(""), w(0), J?.()
      }
    });

  function v() {
    if (A.trim() !== "") Jf(A), J?.();
    return j7.fromText("", K, 0)
  }
  let x = Bf((qA) => {
    if (A !== "") return;
    Z?.(qA, "Ctrl-D")
  }, () => {
    if (A !== "") return;
    G?.()
  });

  function p() {
    if (N.text === "") return x(), N;
    return N.del()
  }

  function u() {
    if (!D) return;
    ssA().then((qA) => {
      if (qA) D(qA.base64, qA.mediaType);
      else R({
        key: "no-image-in-clipboard",
        text: `No image found in clipboard. Use ${tt.displayText} to paste images.`,
        priority: "immediate",
        timeoutMs: 1000
      })
    })
  }

  function e() {
    let {
      cursor: qA,
      killed: KA
    } = N.deleteToLineEnd();
    return SsA(KA, !0), qA
  }

  function l() {
    let {
      cursor: qA,
      killed: KA
    } = N.deleteToLineStart();
    return SsA(KA, !0), qA
  }

  function k() {
    let {
      cursor: qA,
      killed: KA
    } = N.deleteWordBefore();
    return SsA(KA, !0), qA
  }

  function m() {
    let qA = _NB();
    if (qA.length > 0) return N.insert(qA);
    return N
  }
  let o = eMB([
      ["a", () => N.startOfLine()],
      ["b", () => N.left()],
      ["c", T],
      ["d", p],
      ["e", () => N.endOfLine()],
      ["f", () => N.right()],
      ["h", () => N.backspace()],
      ["k", e],
      ["l", () => v()],
      ["n", () => NA()],
      ["p", () => zA()],
      ["u", l],
      ["w", k],
      ["y", m]
    ]),
    IA = eMB([
      ["b", () => N.prevWord()],
      ["f", () => N.nextWord()],
      ["d", () => N.deleteWordAfter()]
    ]);

  function FA(qA) {
    if (X && N.offset > 0 && N.text[N.offset - 1] === "\\") return vMB(), N.backspace().insert(`
`);
    if (qA.meta) return N.insert(`
`);
    B?.(A)
  }

  function zA() {
    if (H) return I?.(), N;
    let qA = N.up();
    if (!qA.equals(N)) return qA;
    if (X) {
      let KA = N.upLogicalLine();
      if (!KA.equals(N)) return KA
    }
    return I?.(), N
  }

  function NA() {
    if (H) return Y?.(), N;
    let qA = N.down();
    if (!qA.equals(N)) return qA;
    if (X) {
      let KA = N.downLogicalLine();
      if (!KA.equals(N)) return KA
    }
    return Y?.(), N
  }

  function OA(qA) {
    switch (!0) {
      case qA.escape:
        return () => {
          return y(), N
        };
      case (qA.leftArrow && (qA.ctrl || qA.meta || qA.fn)):
        return () => N.prevWord();
      case (qA.rightArrow && (qA.ctrl || qA.meta || qA.fn)):
        return () => N.nextWord();
      case qA.backspace:
        return qA.meta ? k : () => N.backspace();
      case qA.delete:
        return qA.meta ? e : () => N.del();
      case qA.ctrl:
        return o;
      case qA.home:
        return () => N.startOfLine();
      case qA.end:
        return () => N.endOfLine();
      case qA.pageDown:
        return () => N.endOfLine();
      case qA.pageUp:
        return () => N.startOfLine();
      case qA.meta:
        return IA;
      case qA.return:
        return () => FA(qA);
      case qA.tab:
        return () => N;
      case qA.upArrow:
        return zA;
      case qA.downArrow:
        return NA;
      case qA.leftArrow:
        return () => N.left();
      case qA.rightArrow:
        return () => N.right();
      default:
        return function(KA) {
          switch (!0) {
            case (KA === "\x1B[H" || KA === "\x1B[1~"):
              return N.startOfLine();
            case (KA === "\x1B[F" || KA === "\x1B[4~"):
              return N.endOfLine();
            default:
              if (N.isAtStart() && lMB(KA)) return N.insert(cY(KA).replace(/\r/g, `
`)).left();
              return N.insert(cY(KA).replace(/\r/g, `
`))
          }
        }
    }
  }

  function mA(qA, KA) {
    if (qA.ctrl && (KA === "k" || KA === "u" || KA === "w")) return !0;
    if (qA.meta && (qA.backspace || qA.delete)) return !0;
    return !1
  }

  function wA(qA, KA) {
    if (tt.check(qA, KA) && D) {
      u(), _sA();
      return
    }
    let yA = U ? U(qA, KA) : qA;
    if (yA === "" && qA !== "") return;
    if (!KA.backspace && !KA.delete && qA.includes("")) {
      let X1 = (qA.match(/\x7f/g) || []).length,
        WA = N;
      for (let EA = 0; EA < X1; EA++) WA = WA.backspace();
      if (!N.equals(WA)) {
        if (N.text !== WA.text) Q(WA.text);
        w(WA.offset)
      }
      _sA();
      return
    }
    if (!mA(KA, yA)) _sA();
    let oA = OA(KA)(yA);
    if (oA) {
      if (!N.equals(oA)) {
        if (N.text !== oA.text) Q(oA.text);
        w(oA.offset)
      }
    }
  }
  return {
    onInput: wA,
    renderedValue: N.render(V, W, F),
    offset: q,
    setOffset: w
  }
}
// @from(Start 6644041, End 6644135)
Um1 = L(() => {
  ET();
  wsA();
  cu1();
  rsA();
  r7A();
  zp();
  Up();
  o7A();
  EU()
})
// @from(Start 6644141, End 6646851)
GOB = z((Qt7, BOB) => {
  var wU6 = "Expected a function",
    AOB = NaN,
    qU6 = "[object Symbol]",
    NU6 = /^\s+|\s+$/g,
    LU6 = /^[-+]0x[0-9a-f]+$/i,
    MU6 = /^0b[01]+$/i,
    OU6 = /^0o[0-7]+$/i,
    RU6 = parseInt,
    TU6 = typeof global == "object" && global && global.Object === Object && global,
    PU6 = typeof self == "object" && self && self.Object === Object && self,
    jU6 = TU6 || PU6 || Function("return this")(),
    SU6 = Object.prototype,
    _U6 = SU6.toString,
    kU6 = Math.max,
    yU6 = Math.min,
    $m1 = function() {
      return jU6.Date.now()
    };

  function xU6(A, Q, B) {
    var G, Z, I, Y, J, W, X = 0,
      V = !1,
      F = !1,
      K = !0;
    if (typeof A != "function") throw TypeError(wU6);
    if (Q = QOB(Q) || 0, wm1(B)) V = !!B.leading, F = "maxWait" in B, I = F ? kU6(QOB(B.maxWait) || 0, Q) : I, K = "trailing" in B ? !!B.trailing : K;

    function D(T) {
      var y = G,
        v = Z;
      return G = Z = void 0, X = T, Y = A.apply(v, y), Y
    }

    function H(T) {
      return X = T, J = setTimeout(U, Q), V ? D(T) : Y
    }

    function C(T) {
      var y = T - W,
        v = T - X,
        x = Q - y;
      return F ? yU6(x, I - v) : x
    }

    function E(T) {
      var y = T - W,
        v = T - X;
      return W === void 0 || y >= Q || y < 0 || F && v >= I
    }

    function U() {
      var T = $m1();
      if (E(T)) return q(T);
      J = setTimeout(U, C(T))
    }

    function q(T) {
      if (J = void 0, K && G) return D(T);
      return G = Z = void 0, Y
    }

    function w() {
      if (J !== void 0) clearTimeout(J);
      X = 0, G = W = Z = J = void 0
    }

    function N() {
      return J === void 0 ? Y : q($m1())
    }

    function R() {
      var T = $m1(),
        y = E(T);
      if (G = arguments, Z = this, W = T, y) {
        if (J === void 0) return H(W);
        if (F) return J = setTimeout(U, Q), D(W)
      }
      if (J === void 0) J = setTimeout(U, Q);
      return Y
    }
    return R.cancel = w, R.flush = N, R
  }

  function wm1(A) {
    var Q = typeof A;
    return !!A && (Q == "object" || Q == "function")
  }

  function vU6(A) {
    return !!A && typeof A == "object"
  }

  function bU6(A) {
    return typeof A == "symbol" || vU6(A) && _U6.call(A) == qU6
  }

  function QOB(A) {
    if (typeof A == "number") return A;
    if (bU6(A)) return AOB;
    if (wm1(A)) {
      var Q = typeof A.valueOf == "function" ? A.valueOf() : A;
      A = wm1(Q) ? Q + "" : Q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = A.replace(NU6, "");
    var B = MU6.test(A);
    return B || OU6.test(A) ? RU6(A.slice(2), B ? 2 : 8) : LU6.test(A) ? AOB : +A
  }
  BOB.exports = xU6
})
// @from(Start 6646854, End 6647110)
function CI(A, Q) {
  let B = YE.useRef(A);
  fU6(() => {
    B.current = A
  }, [A]), YE.useEffect(() => {
    if (Q === null) return;
    let G = setInterval(() => {
      B.current()
    }, Q);
    return () => {
      clearInterval(G)
    }
  }, [Q])
}
// @from(Start 6647112, End 6647224)
function hU6(A) {
  let Q = YE.useRef(A);
  Q.current = A, YE.useEffect(() => () => {
    Q.current()
  }, [])
}
// @from(Start 6647226, End 6647715)
function qp(A, Q = 500, B) {
  let G = YE.useRef();
  hU6(() => {
    if (G.current) G.current.cancel()
  });
  let Z = YE.useMemo(() => {
    let I = qm1.default(A, Q, B),
      Y = (...J) => {
        return I(...J)
      };
    return Y.cancel = () => {
      I.cancel()
    }, Y.isPending = () => {
      return !!G.current
    }, Y.flush = () => {
      return I.flush()
    }, Y
  }, [A, Q, B]);
  return YE.useEffect(() => {
    G.current = qm1.default(A, Q, B)
  }, [A, Q, B]), Z
}
// @from(Start 6647720, End 6647722)
YE
// @from(Start 6647724, End 6647727)
qm1
// @from(Start 6647729, End 6647732)
fU6
// @from(Start 6647738, End 6647857)
JE = L(() => {
  YE = BA(VA(), 1), qm1 = BA(GOB(), 1), fU6 = typeof window < "u" ? YE.useLayoutEffect : YE.useEffect
})
// @from(Start 6647860, End 6650447)
function ZOB({
  onPaste: A,
  onInput: Q,
  onImagePaste: B
}) {
  let [G, Z] = wT.default.useState({
    chunks: [],
    timeoutId: null
  }), [I, Y] = wT.default.useState(!1), J = wT.default.useRef(!1), W = wT.default.useRef(!1), X = wT.default.useRef(!0), V = wT.default.useMemo(() => dQ() === "macos", []);
  wT.default.useEffect(() => {
    return () => {
      X.current = !1
    }
  }, []);
  let F = wT.default.useCallback(() => {
      if (!B || !X.current) return;
      ssA().then((E) => {
        if (E && X.current) B(E.base64, E.mediaType)
      }).catch((E) => {
        if (X.current) AA(E)
      }).finally(() => {
        if (X.current) Y(!1)
      })
    }, [B]),
    K = qp(F, gU6),
    D = wT.default.useCallback((E) => {
      if (E) clearTimeout(E);
      return setTimeout(() => {
        Z(({
          chunks: U
        }) => {
          let q = U.join("").replace(/\[I$/, "").replace(/\[O$/, "");
          if (B && Ym1(q)) {
            let w = /\/TemporaryItems\/.*screencaptureui.*\/Screenshot/i.test(q);
            return UMB(q).then((N) => {
              if (N) B(N.base64, N.mediaType);
              else if (w && V) K();
              else {
                if (A) A(q);
                Y(!1)
              }
            }), {
              chunks: [],
              timeoutId: null
            }
          }
          if (V && B && q.length === 0) return K(), {
            chunks: [],
            timeoutId: null
          };
          if (A) A(q);
          return Y(!1), {
            chunks: [],
            timeoutId: null
          }
        })
      }, uU6)
    }, [K, V, B, A]),
    {
      stdin: H
    } = Yp();
  return wT.default.useEffect(() => {
    if (!H) return;
    let E = (U) => {
      let q = U.toString();
      if (q.includes("\x1B[200~")) Y(!0), J.current = !0, W.current = !1;
      if (q.includes("\x1B[201~")) {
        if (Y(!1), V && J.current && !W.current && B) K();
        J.current = !1, W.current = !1, Z({
          chunks: [],
          timeoutId: null
        })
      }
    };
    return H.on("data", E), () => {
      H.off("data", E), Y(!1)
    }
  }, [H, B, K, V]), {
    wrappedOnInput: (E, U) => {
      if (J.current) W.current = !0;
      let q = Ym1(E);
      if (A && (E.length > asA || G.timeoutId || q || I)) {
        Z(({
          chunks: N,
          timeoutId: R
        }) => {
          return {
            chunks: [...N, E],
            timeoutId: D(R)
          }
        });
        return
      }
      if (Q(E, U), E.length > 10) Y(!1)
    },
    pasteState: G,
    isPasting: I
  }
}
// @from(Start 6650452, End 6650454)
wT
// @from(Start 6650456, End 6650464)
gU6 = 50
// @from(Start 6650468, End 6650477)
uU6 = 100
// @from(Start 6650483, End 6650561)
IOB = L(() => {
  hA();
  JE();
  rsA();
  Q3();
  g1();
  wT = BA(VA(), 1)
})
// @from(Start 6650564, End 6650918)
function YOB({
  placeholder: A,
  value: Q,
  showCursor: B,
  focus: G,
  terminalFocus: Z = !0
}) {
  let I = void 0;
  if (A) {
    if (I = tA.dim(A), B && G && Z) I = A.length > 0 ? tA.inverse(A[0]) + tA.dim(A.slice(1)) : tA.inverse(" ")
  }
  let Y = Q.length === 0 && Boolean(A);
  return {
    renderedPlaceholder: I,
    showPlaceholder: Y
  }
}
// @from(Start 6650923, End 6650948)
JOB = L(() => {
  F9()
})
// @from(Start 6650951, End 6651167)
function AGA({
  char: A,
  index: Q,
  glimmerIndex: B,
  messageColor: G,
  shimmerColor: Z
}) {
  let I = Q === B,
    Y = Math.abs(Q - B) === 1;
  return Nm1.createElement($, {
    color: I || Y ? Z : G
  }, A)
}
// @from(Start 6651172, End 6651175)
Nm1
// @from(Start 6651181, End 6651227)
KrA = L(() => {
  hA();
  Nm1 = BA(VA(), 1)
})