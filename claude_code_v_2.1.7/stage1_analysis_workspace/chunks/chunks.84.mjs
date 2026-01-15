
// @from(Ln 244262, Col 4)
L51 = U((MGZ, ptB) => {
  var IKA = ftB(),
    YO = XZ0(),
    ctB = ["keyword", "gray", "hex"],
    IZ0 = {};
  for (let A of Object.keys(YO)) IZ0[[...YO[A].labels].sort().join("")] = A;
  var w51 = {};

  function EF(A, Q) {
    if (!(this instanceof EF)) return new EF(A, Q);
    if (Q && Q in ctB) Q = null;
    if (Q && !(Q in YO)) throw Error("Unknown model: " + Q);
    let B, G;
    if (A == null) this.model = "rgb", this.color = [0, 0, 0], this.valpha = 1;
    else if (A instanceof EF) this.model = A.model, this.color = [...A.color], this.valpha = A.valpha;
    else if (typeof A === "string") {
      let Z = IKA.get(A);
      if (Z === null) throw Error("Unable to parse color from string: " + A);
      this.model = Z.model, G = YO[this.model].channels, this.color = Z.value.slice(0, G), this.valpha = typeof Z.value[G] === "number" ? Z.value[G] : 1
    } else if (A.length > 0) {
      this.model = Q || "rgb", G = YO[this.model].channels;
      let Z = Array.prototype.slice.call(A, 0, G);
      this.color = DZ0(Z, G), this.valpha = typeof A[G] === "number" ? A[G] : 1
    } else if (typeof A === "number") this.model = "rgb", this.color = [A >> 16 & 255, A >> 8 & 255, A & 255], this.valpha = 1;
    else {
      this.valpha = 1;
      let Z = Object.keys(A);
      if ("alpha" in A) Z.splice(Z.indexOf("alpha"), 1), this.valpha = typeof A.alpha === "number" ? A.alpha : 0;
      let Y = Z.sort().join("");
      if (!(Y in IZ0)) throw Error("Unable to parse color from object: " + JSON.stringify(A));
      this.model = IZ0[Y];
      let {
        labels: J
      } = YO[this.model], X = [];
      for (B = 0; B < J.length; B++) X.push(A[J[B]]);
      this.color = DZ0(X)
    }
    if (w51[this.model]) {
      G = YO[this.model].channels;
      for (B = 0; B < G; B++) {
        let Z = w51[this.model][B];
        if (Z) this.color[B] = Z(this.color[B])
      }
    }
    if (this.valpha = Math.max(0, Math.min(1, this.valpha)), Object.freeze) Object.freeze(this)
  }
  EF.prototype = {
    toString() {
      return this.string()
    },
    toJSON() {
      return this[this.model]()
    },
    string(A) {
      let Q = this.model in IKA.to ? this : this.rgb();
      Q = Q.round(typeof A === "number" ? A : 1);
      let B = Q.valpha === 1 ? Q.color : [...Q.color, this.valpha];
      return IKA.to[Q.model](B)
    },
    percentString(A) {
      let Q = this.rgb().round(typeof A === "number" ? A : 1),
        B = Q.valpha === 1 ? Q.color : [...Q.color, this.valpha];
      return IKA.to.rgb.percent(B)
    },
    array() {
      return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha]
    },
    object() {
      let A = {},
        {
          channels: Q
        } = YO[this.model],
        {
          labels: B
        } = YO[this.model];
      for (let G = 0; G < Q; G++) A[B[G]] = this.color[G];
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
      return A = Math.max(A || 0, 0), new EF([...this.color.map(io8(A)), this.valpha], this.model)
    },
    alpha(A) {
      if (A !== void 0) return new EF([...this.color, Math.max(0, Math.min(1, A))], this.model);
      return this.valpha
    },
    red: rI("rgb", 0, tK(255)),
    green: rI("rgb", 1, tK(255)),
    blue: rI("rgb", 2, tK(255)),
    hue: rI(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (A) => (A % 360 + 360) % 360),
    saturationl: rI("hsl", 1, tK(100)),
    lightness: rI("hsl", 2, tK(100)),
    saturationv: rI("hsv", 1, tK(100)),
    value: rI("hsv", 2, tK(100)),
    chroma: rI("hcg", 1, tK(100)),
    gray: rI("hcg", 2, tK(100)),
    white: rI("hwb", 1, tK(100)),
    wblack: rI("hwb", 2, tK(100)),
    cyan: rI("cmyk", 0, tK(100)),
    magenta: rI("cmyk", 1, tK(100)),
    yellow: rI("cmyk", 2, tK(100)),
    black: rI("cmyk", 3, tK(100)),
    x: rI("xyz", 0, tK(95.047)),
    y: rI("xyz", 1, tK(100)),
    z: rI("xyz", 2, tK(108.833)),
    l: rI("lab", 0, tK(100)),
    a: rI("lab", 1),
    b: rI("lab", 2),
    keyword(A) {
      if (A !== void 0) return new EF(A);
      return YO[this.model].keyword(this.color)
    },
    hex(A) {
      if (A !== void 0) return new EF(A);
      return IKA.to.hex(this.rgb().round().color)
    },
    hexa(A) {
      if (A !== void 0) return new EF(A);
      let Q = this.rgb().round().color,
        B = Math.round(this.valpha * 255).toString(16).toUpperCase();
      if (B.length === 1) B = "0" + B;
      return IKA.to.hex(Q) + B
    },
    rgbNumber() {
      let A = this.rgb().color;
      return (A[0] & 255) << 16 | (A[1] & 255) << 8 | A[2] & 255
    },
    luminosity() {
      let A = this.rgb().color,
        Q = [];
      for (let [B, G] of A.entries()) {
        let Z = G / 255;
        Q[B] = Z <= 0.04045 ? Z / 12.92 : ((Z + 0.055) / 1.055) ** 2.4
      }
      return 0.2126 * Q[0] + 0.7152 * Q[1] + 0.0722 * Q[2]
    },
    contrast(A) {
      let Q = this.luminosity(),
        B = A.luminosity();
      if (Q > B) return (Q + 0.05) / (B + 0.05);
      return (B + 0.05) / (Q + 0.05)
    },
    level(A) {
      let Q = this.contrast(A);
      if (Q >= 7) return "AAA";
      return Q >= 4.5 ? "AA" : ""
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
      for (let Q = 0; Q < 3; Q++) A.color[Q] = 255 - A.color[Q];
      return A
    },
    lighten(A) {
      let Q = this.hsl();
      return Q.color[2] += Q.color[2] * A, Q
    },
    darken(A) {
      let Q = this.hsl();
      return Q.color[2] -= Q.color[2] * A, Q
    },
    saturate(A) {
      let Q = this.hsl();
      return Q.color[1] += Q.color[1] * A, Q
    },
    desaturate(A) {
      let Q = this.hsl();
      return Q.color[1] -= Q.color[1] * A, Q
    },
    whiten(A) {
      let Q = this.hwb();
      return Q.color[1] += Q.color[1] * A, Q
    },
    blacken(A) {
      let Q = this.hwb();
      return Q.color[2] += Q.color[2] * A, Q
    },
    grayscale() {
      let A = this.rgb().color,
        Q = A[0] * 0.3 + A[1] * 0.59 + A[2] * 0.11;
      return EF.rgb(Q, Q, Q)
    },
    fade(A) {
      return this.alpha(this.valpha - this.valpha * A)
    },
    opaquer(A) {
      return this.alpha(this.valpha + this.valpha * A)
    },
    rotate(A) {
      let Q = this.hsl(),
        B = Q.color[0];
      return B = (B + A) % 360, B = B < 0 ? 360 + B : B, Q.color[0] = B, Q
    },
    mix(A, Q) {
      if (!A || !A.rgb) throw Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof A);
      let B = A.rgb(),
        G = this.rgb(),
        Z = Q === void 0 ? 0.5 : Q,
        Y = 2 * Z - 1,
        J = B.alpha() - G.alpha(),
        X = ((Y * J === -1 ? Y : (Y + J) / (1 + Y * J)) + 1) / 2,
        I = 1 - X;
      return EF.rgb(X * B.red() + I * G.red(), X * B.green() + I * G.green(), X * B.blue() + I * G.blue(), B.alpha() * Z + G.alpha() * (1 - Z))
    }
  };
  for (let A of Object.keys(YO)) {
    if (ctB.includes(A)) continue;
    let {
      channels: Q
    } = YO[A];
    EF.prototype[A] = function (...B) {
      if (this.model === A) return new EF(this);
      if (B.length > 0) return new EF(B, A);
      return new EF([...no8(YO[this.model][A].raw(this.color)), this.valpha], A)
    }, EF[A] = function (...B) {
      let G = B[0];
      if (typeof G === "number") G = DZ0(B, Q);
      return new EF(G, A)
    }
  }

  function lo8(A, Q) {
    return Number(A.toFixed(Q))
  }

  function io8(A) {
    return function (Q) {
      return lo8(Q, A)
    }
  }

  function rI(A, Q, B) {
    A = Array.isArray(A) ? A : [A];
    for (let G of A)(w51[G] || (w51[G] = []))[Q] = B;
    return A = A[0],
      function (G) {
        let Z;
        if (G !== void 0) {
          if (B) G = B(G);
          return Z = this[A](), Z.color[Q] = G, Z
        }
        if (Z = this[A]().color[Q], B) Z = B(Z);
        return Z
      }
  }

  function tK(A) {
    return function (Q) {
      return Math.max(0, Math.min(A, Q))
    }
  }

  function no8(A) {
    return Array.isArray(A) ? A : [A]
  }

  function DZ0(A, Q) {
    for (let B = 0; B < Q; B++)
      if (typeof A[B] !== "number") A[B] = 0;
    return A
  }
  ptB.exports = EF
})
// @from(Ln 244541, Col 4)
ntB = U((RGZ, itB) => {
  var ao8 = L51(),
    e0 = Gb(),
    to = SSA(),
    oo8 = {
      left: "low",
      center: "centre",
      centre: "centre",
      right: "high"
    };

  function ltB(A) {
    let {
      raw: Q,
      density: B,
      limitInputPixels: G,
      ignoreIcc: Z,
      unlimited: Y,
      sequentialRead: J,
      failOn: X,
      failOnError: I,
      animated: D,
      page: W,
      pages: K,
      subifd: V
    } = A;
    return [Q, B, G, Z, Y, J, X, I, D, W, K, V].some(e0.defined) ? {
      raw: Q,
      density: B,
      limitInputPixels: G,
      ignoreIcc: Z,
      unlimited: Y,
      sequentialRead: J,
      failOn: X,
      failOnError: I,
      animated: D,
      page: W,
      pages: K,
      subifd: V
    } : void 0
  }

  function ro8(A, Q, B) {
    let G = {
      failOn: "warning",
      limitInputPixels: Math.pow(16383, 2),
      ignoreIcc: !1,
      unlimited: !1,
      sequentialRead: !0
    };
    if (e0.string(A)) G.file = A;
    else if (e0.buffer(A)) {
      if (A.length === 0) throw Error("Input Buffer is empty");
      G.buffer = A
    } else if (e0.arrayBuffer(A)) {
      if (A.byteLength === 0) throw Error("Input bit Array is empty");
      G.buffer = Buffer.from(A, 0, A.byteLength)
    } else if (e0.typedArray(A)) {
      if (A.length === 0) throw Error("Input Bit Array is empty");
      G.buffer = Buffer.from(A.buffer, A.byteOffset, A.byteLength)
    } else if (e0.plainObject(A) && !e0.defined(Q)) {
      if (Q = A, ltB(Q)) G.buffer = []
    } else if (!e0.defined(A) && !e0.defined(Q) && e0.object(B) && B.allowStream) G.buffer = [];
    else throw Error(`Unsupported input '${A}' of type ${typeof A}${e0.defined(Q)?` when also providing options of type ${typeof Q}`:""}`);
    if (e0.object(Q)) {
      if (e0.defined(Q.failOnError))
        if (e0.bool(Q.failOnError)) G.failOn = Q.failOnError ? "warning" : "none";
        else throw e0.invalidParameterError("failOnError", "boolean", Q.failOnError);
      if (e0.defined(Q.failOn))
        if (e0.string(Q.failOn) && e0.inArray(Q.failOn, ["none", "truncated", "error", "warning"])) G.failOn = Q.failOn;
        else throw e0.invalidParameterError("failOn", "one of: none, truncated, error, warning", Q.failOn);
      if (e0.defined(Q.density))
        if (e0.inRange(Q.density, 1, 1e5)) G.density = Q.density;
        else throw e0.invalidParameterError("density", "number between 1 and 100000", Q.density);
      if (e0.defined(Q.ignoreIcc))
        if (e0.bool(Q.ignoreIcc)) G.ignoreIcc = Q.ignoreIcc;
        else throw e0.invalidParameterError("ignoreIcc", "boolean", Q.ignoreIcc);
      if (e0.defined(Q.limitInputPixels))
        if (e0.bool(Q.limitInputPixels)) G.limitInputPixels = Q.limitInputPixels ? Math.pow(16383, 2) : 0;
        else if (e0.integer(Q.limitInputPixels) && e0.inRange(Q.limitInputPixels, 0, Number.MAX_SAFE_INTEGER)) G.limitInputPixels = Q.limitInputPixels;
      else throw e0.invalidParameterError("limitInputPixels", "positive integer", Q.limitInputPixels);
      if (e0.defined(Q.unlimited))
        if (e0.bool(Q.unlimited)) G.unlimited = Q.unlimited;
        else throw e0.invalidParameterError("unlimited", "boolean", Q.unlimited);
      if (e0.defined(Q.sequentialRead))
        if (e0.bool(Q.sequentialRead)) G.sequentialRead = Q.sequentialRead;
        else throw e0.invalidParameterError("sequentialRead", "boolean", Q.sequentialRead);
      if (e0.defined(Q.raw))
        if (e0.object(Q.raw) && e0.integer(Q.raw.width) && Q.raw.width > 0 && e0.integer(Q.raw.height) && Q.raw.height > 0 && e0.integer(Q.raw.channels) && e0.inRange(Q.raw.channels, 1, 4)) switch (G.rawWidth = Q.raw.width, G.rawHeight = Q.raw.height, G.rawChannels = Q.raw.channels, G.rawPremultiplied = !!Q.raw.premultiplied, A.constructor) {
          case Uint8Array:
          case Uint8ClampedArray:
            G.rawDepth = "uchar";
            break;
          case Int8Array:
            G.rawDepth = "char";
            break;
          case Uint16Array:
            G.rawDepth = "ushort";
            break;
          case Int16Array:
            G.rawDepth = "short";
            break;
          case Uint32Array:
            G.rawDepth = "uint";
            break;
          case Int32Array:
            G.rawDepth = "int";
            break;
          case Float32Array:
            G.rawDepth = "float";
            break;
          case Float64Array:
            G.rawDepth = "double";
            break;
          default:
            G.rawDepth = "uchar";
            break
        } else throw Error("Expected width, height and channels for raw pixel input");
      if (e0.defined(Q.animated))
        if (e0.bool(Q.animated)) G.pages = Q.animated ? -1 : 1;
        else throw e0.invalidParameterError("animated", "boolean", Q.animated);
      if (e0.defined(Q.pages))
        if (e0.integer(Q.pages) && e0.inRange(Q.pages, -1, 1e5)) G.pages = Q.pages;
        else throw e0.invalidParameterError("pages", "integer between -1 and 100000", Q.pages);
      if (e0.defined(Q.page))
        if (e0.integer(Q.page) && e0.inRange(Q.page, 0, 1e5)) G.page = Q.page;
        else throw e0.invalidParameterError("page", "integer between 0 and 100000", Q.page);
      if (e0.defined(Q.level))
        if (e0.integer(Q.level) && e0.inRange(Q.level, 0, 256)) G.level = Q.level;
        else throw e0.invalidParameterError("level", "integer between 0 and 256", Q.level);
      if (e0.defined(Q.subifd))
        if (e0.integer(Q.subifd) && e0.inRange(Q.subifd, -1, 1e5)) G.subifd = Q.subifd;
        else throw e0.invalidParameterError("subifd", "integer between -1 and 100000", Q.subifd);
      if (e0.defined(Q.create))
        if (e0.object(Q.create) && e0.integer(Q.create.width) && Q.create.width > 0 && e0.integer(Q.create.height) && Q.create.height > 0 && e0.integer(Q.create.channels)) {
          if (G.createWidth = Q.create.width, G.createHeight = Q.create.height, G.createChannels = Q.create.channels, e0.defined(Q.create.noise)) {
            if (!e0.object(Q.create.noise)) throw Error("Expected noise to be an object");
            if (!e0.inArray(Q.create.noise.type, ["gaussian"])) throw Error("Only gaussian noise is supported at the moment");
            if (!e0.inRange(Q.create.channels, 1, 4)) throw e0.invalidParameterError("create.channels", "number between 1 and 4", Q.create.channels);
            if (G.createNoiseType = Q.create.noise.type, e0.number(Q.create.noise.mean) && e0.inRange(Q.create.noise.mean, 0, 1e4)) G.createNoiseMean = Q.create.noise.mean;
            else throw e0.invalidParameterError("create.noise.mean", "number between 0 and 10000", Q.create.noise.mean);
            if (e0.number(Q.create.noise.sigma) && e0.inRange(Q.create.noise.sigma, 0, 1e4)) G.createNoiseSigma = Q.create.noise.sigma;
            else throw e0.invalidParameterError("create.noise.sigma", "number between 0 and 10000", Q.create.noise.sigma)
          } else if (e0.defined(Q.create.background)) {
            if (!e0.inRange(Q.create.channels, 3, 4)) throw e0.invalidParameterError("create.channels", "number between 3 and 4", Q.create.channels);
            let Z = ao8(Q.create.background);
            G.createBackground = [Z.red(), Z.green(), Z.blue(), Math.round(Z.alpha() * 255)]
          } else throw Error("Expected valid noise or background to create a new input image");
          delete G.buffer
        } else throw Error("Expected valid width, height and channels to create a new input image");
      if (e0.defined(Q.text))
        if (e0.object(Q.text) && e0.string(Q.text.text)) {
          if (G.textValue = Q.text.text, e0.defined(Q.text.height) && e0.defined(Q.text.dpi)) throw Error("Expected only one of dpi or height");
          if (e0.defined(Q.text.font))
            if (e0.string(Q.text.font)) G.textFont = Q.text.font;
            else throw e0.invalidParameterError("text.font", "string", Q.text.font);
          if (e0.defined(Q.text.fontfile))
            if (e0.string(Q.text.fontfile)) G.textFontfile = Q.text.fontfile;
            else throw e0.invalidParameterError("text.fontfile", "string", Q.text.fontfile);
          if (e0.defined(Q.text.width))
            if (e0.integer(Q.text.width) && Q.text.width > 0) G.textWidth = Q.text.width;
            else throw e0.invalidParameterError("text.width", "positive integer", Q.text.width);
          if (e0.defined(Q.text.height))
            if (e0.integer(Q.text.height) && Q.text.height > 0) G.textHeight = Q.text.height;
            else throw e0.invalidParameterError("text.height", "positive integer", Q.text.height);
          if (e0.defined(Q.text.align))
            if (e0.string(Q.text.align) && e0.string(this.constructor.align[Q.text.align])) G.textAlign = this.constructor.align[Q.text.align];
            else throw e0.invalidParameterError("text.align", "valid alignment", Q.text.align);
          if (e0.defined(Q.text.justify))
            if (e0.bool(Q.text.justify)) G.textJustify = Q.text.justify;
            else throw e0.invalidParameterError("text.justify", "boolean", Q.text.justify);
          if (e0.defined(Q.text.dpi))
            if (e0.integer(Q.text.dpi) && e0.inRange(Q.text.dpi, 1, 1e6)) G.textDpi = Q.text.dpi;
            else throw e0.invalidParameterError("text.dpi", "integer between 1 and 1000000", Q.text.dpi);
          if (e0.defined(Q.text.rgba))
            if (e0.bool(Q.text.rgba)) G.textRgba = Q.text.rgba;
            else throw e0.invalidParameterError("text.rgba", "bool", Q.text.rgba);
          if (e0.defined(Q.text.spacing))
            if (e0.integer(Q.text.spacing) && e0.inRange(Q.text.spacing, -1e6, 1e6)) G.textSpacing = Q.text.spacing;
            else throw e0.invalidParameterError("text.spacing", "integer between -1000000 and 1000000", Q.text.spacing);
          if (e0.defined(Q.text.wrap))
            if (e0.string(Q.text.wrap) && e0.inArray(Q.text.wrap, ["word", "char", "word-char", "none"])) G.textWrap = Q.text.wrap;
            else throw e0.invalidParameterError("text.wrap", "one of: word, char, word-char, none", Q.text.wrap);
          delete G.buffer
        } else throw Error("Expected a valid string to create an image with text.")
    } else if (e0.defined(Q)) throw Error("Invalid input options " + Q);
    return G
  }

  function so8(A, Q, B) {
    if (Array.isArray(this.options.input.buffer))
      if (e0.buffer(A)) {
        if (this.options.input.buffer.length === 0) this.on("finish", () => {
          this.streamInFinished = !0
        });
        this.options.input.buffer.push(A), B()
      } else B(Error("Non-Buffer data on Writable Stream"));
    else B(Error("Unexpected data on Writable Stream"))
  }

  function to8() {
    if (this._isStreamInput()) this.options.input.buffer = Buffer.concat(this.options.input.buffer)
  }

  function eo8() {
    return Array.isArray(this.options.input.buffer)
  }

  function Ar8(A) {
    let Q = Error();
    if (e0.fn(A)) {
      if (this._isStreamInput()) this.on("finish", () => {
        this._flattenBufferIn(), to.metadata(this.options, (B, G) => {
          if (B) A(e0.nativeError(B, Q));
          else A(null, G)
        })
      });
      else to.metadata(this.options, (B, G) => {
        if (B) A(e0.nativeError(B, Q));
        else A(null, G)
      });
      return this
    } else if (this._isStreamInput()) return new Promise((B, G) => {
      let Z = () => {
        this._flattenBufferIn(), to.metadata(this.options, (Y, J) => {
          if (Y) G(e0.nativeError(Y, Q));
          else B(J)
        })
      };
      if (this.writableFinished) Z();
      else this.once("finish", Z)
    });
    else return new Promise((B, G) => {
      to.metadata(this.options, (Z, Y) => {
        if (Z) G(e0.nativeError(Z, Q));
        else B(Y)
      })
    })
  }

  function Qr8(A) {
    let Q = Error();
    if (e0.fn(A)) {
      if (this._isStreamInput()) this.on("finish", () => {
        this._flattenBufferIn(), to.stats(this.options, (B, G) => {
          if (B) A(e0.nativeError(B, Q));
          else A(null, G)
        })
      });
      else to.stats(this.options, (B, G) => {
        if (B) A(e0.nativeError(B, Q));
        else A(null, G)
      });
      return this
    } else if (this._isStreamInput()) return new Promise((B, G) => {
      this.on("finish", function () {
        this._flattenBufferIn(), to.stats(this.options, (Z, Y) => {
          if (Z) G(e0.nativeError(Z, Q));
          else B(Y)
        })
      })
    });
    else return new Promise((B, G) => {
      to.stats(this.options, (Z, Y) => {
        if (Z) G(e0.nativeError(Z, Q));
        else B(Y)
      })
    })
  }
  itB.exports = function (A) {
    Object.assign(A.prototype, {
      _inputOptionsFromObject: ltB,
      _createInputDescriptor: ro8,
      _write: so8,
      _flattenBufferIn: to8,
      _isStreamInput: eo8,
      metadata: Ar8,
      stats: Qr8
    }), A.align = oo8
  }
})
// @from(Ln 244822, Col 4)
etB = U((_GZ, ttB) => {
  var b9 = Gb(),
    otB = {
      center: 0,
      centre: 0,
      north: 1,
      east: 2,
      south: 3,
      west: 4,
      northeast: 5,
      southeast: 6,
      southwest: 7,
      northwest: 8
    },
    rtB = {
      top: 1,
      right: 2,
      bottom: 3,
      left: 4,
      "right top": 5,
      "right bottom": 6,
      "left bottom": 7,
      "left top": 8
    },
    atB = {
      background: "background",
      copy: "copy",
      repeat: "repeat",
      mirror: "mirror"
    },
    stB = {
      entropy: 16,
      attention: 17
    },
    WZ0 = {
      nearest: "nearest",
      linear: "linear",
      cubic: "cubic",
      mitchell: "mitchell",
      lanczos2: "lanczos2",
      lanczos3: "lanczos3"
    },
    Br8 = {
      contain: "contain",
      cover: "cover",
      fill: "fill",
      inside: "inside",
      outside: "outside"
    },
    Gr8 = {
      contain: "embed",
      cover: "crop",
      fill: "ignore_aspect",
      inside: "max",
      outside: "min"
    };

  function KZ0(A) {
    return A.angle % 360 !== 0 || A.useExifOrientation === !0 || A.rotationAngle !== 0
  }

  function O51(A) {
    return A.width !== -1 || A.height !== -1
  }

  function Zr8(A, Q, B) {
    if (O51(this.options)) this.options.debuglog("ignoring previous resize options");
    if (this.options.widthPost !== -1) this.options.debuglog("operation order will be: extract, resize, extract");
    if (b9.defined(A))
      if (b9.object(A) && !b9.defined(B)) B = A;
      else if (b9.integer(A) && A > 0) this.options.width = A;
    else throw b9.invalidParameterError("width", "positive integer", A);
    else this.options.width = -1;
    if (b9.defined(Q))
      if (b9.integer(Q) && Q > 0) this.options.height = Q;
      else throw b9.invalidParameterError("height", "positive integer", Q);
    else this.options.height = -1;
    if (b9.object(B)) {
      if (b9.defined(B.width))
        if (b9.integer(B.width) && B.width > 0) this.options.width = B.width;
        else throw b9.invalidParameterError("width", "positive integer", B.width);
      if (b9.defined(B.height))
        if (b9.integer(B.height) && B.height > 0) this.options.height = B.height;
        else throw b9.invalidParameterError("height", "positive integer", B.height);
      if (b9.defined(B.fit)) {
        let G = Gr8[B.fit];
        if (b9.string(G)) this.options.canvas = G;
        else throw b9.invalidParameterError("fit", "valid fit", B.fit)
      }
      if (b9.defined(B.position)) {
        let G = b9.integer(B.position) ? B.position : stB[B.position] || rtB[B.position] || otB[B.position];
        if (b9.integer(G) && (b9.inRange(G, 0, 8) || b9.inRange(G, 16, 17))) this.options.position = G;
        else throw b9.invalidParameterError("position", "valid position/gravity/strategy", B.position)
      }
      if (this._setBackgroundColourOption("resizeBackground", B.background), b9.defined(B.kernel))
        if (b9.string(WZ0[B.kernel])) this.options.kernel = WZ0[B.kernel];
        else throw b9.invalidParameterError("kernel", "valid kernel name", B.kernel);
      if (b9.defined(B.withoutEnlargement)) this._setBooleanOption("withoutEnlargement", B.withoutEnlargement);
      if (b9.defined(B.withoutReduction)) this._setBooleanOption("withoutReduction", B.withoutReduction);
      if (b9.defined(B.fastShrinkOnLoad)) this._setBooleanOption("fastShrinkOnLoad", B.fastShrinkOnLoad)
    }
    if (KZ0(this.options) && O51(this.options)) this.options.rotateBeforePreExtract = !0;
    return this
  }

  function Yr8(A) {
    if (b9.integer(A) && A > 0) this.options.extendTop = A, this.options.extendBottom = A, this.options.extendLeft = A, this.options.extendRight = A;
    else if (b9.object(A)) {
      if (b9.defined(A.top))
        if (b9.integer(A.top) && A.top >= 0) this.options.extendTop = A.top;
        else throw b9.invalidParameterError("top", "positive integer", A.top);
      if (b9.defined(A.bottom))
        if (b9.integer(A.bottom) && A.bottom >= 0) this.options.extendBottom = A.bottom;
        else throw b9.invalidParameterError("bottom", "positive integer", A.bottom);
      if (b9.defined(A.left))
        if (b9.integer(A.left) && A.left >= 0) this.options.extendLeft = A.left;
        else throw b9.invalidParameterError("left", "positive integer", A.left);
      if (b9.defined(A.right))
        if (b9.integer(A.right) && A.right >= 0) this.options.extendRight = A.right;
        else throw b9.invalidParameterError("right", "positive integer", A.right);
      if (this._setBackgroundColourOption("extendBackground", A.background), b9.defined(A.extendWith))
        if (b9.string(atB[A.extendWith])) this.options.extendWith = atB[A.extendWith];
        else throw b9.invalidParameterError("extendWith", "one of: background, copy, repeat, mirror", A.extendWith)
    } else throw b9.invalidParameterError("extend", "integer or object", A);
    return this
  }

  function Jr8(A) {
    let Q = O51(this.options) || this.options.widthPre !== -1 ? "Post" : "Pre";
    if (this.options[`width${Q}`] !== -1) this.options.debuglog("ignoring previous extract options");
    if (["left", "top", "width", "height"].forEach(function (B) {
        let G = A[B];
        if (b9.integer(G) && G >= 0) this.options[B + (B === "left" || B === "top" ? "Offset" : "") + Q] = G;
        else throw b9.invalidParameterError(B, "integer", G)
      }, this), KZ0(this.options) && !O51(this.options)) {
      if (this.options.widthPre === -1 || this.options.widthPost === -1) this.options.rotateBeforePreExtract = !0
    }
    return this
  }

  function Xr8(A) {
    if (this.options.trimThreshold = 10, b9.defined(A))
      if (b9.object(A)) {
        if (b9.defined(A.background)) this._setBackgroundColourOption("trimBackground", A.background);
        if (b9.defined(A.threshold))
          if (b9.number(A.threshold) && A.threshold >= 0) this.options.trimThreshold = A.threshold;
          else throw b9.invalidParameterError("threshold", "positive number", A.threshold);
        if (b9.defined(A.lineArt)) this._setBooleanOption("trimLineArt", A.lineArt)
      } else throw b9.invalidParameterError("trim", "object", A);
    if (KZ0(this.options)) this.options.rotateBeforePreExtract = !0;
    return this
  }
  ttB.exports = function (A) {
    Object.assign(A.prototype, {
      resize: Zr8,
      extend: Yr8,
      extract: Jr8,
      trim: Xr8
    }), A.gravity = otB, A.strategy = stB, A.kernel = WZ0, A.fit = Br8, A.position = rtB
  }
})
// @from(Ln 244983, Col 4)
QeB = U((jGZ, AeB) => {
  var vZ = Gb(),
    VZ0 = {
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

  function Ir8(A) {
    if (!Array.isArray(A)) throw vZ.invalidParameterError("images to composite", "array", A);
    return this.options.composite = A.map((Q) => {
      if (!vZ.object(Q)) throw vZ.invalidParameterError("image to composite", "object", Q);
      let B = this._inputOptionsFromObject(Q),
        G = {
          input: this._createInputDescriptor(Q.input, B, {
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
      if (vZ.defined(Q.blend))
        if (vZ.string(VZ0[Q.blend])) G.blend = VZ0[Q.blend];
        else throw vZ.invalidParameterError("blend", "valid blend name", Q.blend);
      if (vZ.defined(Q.tile))
        if (vZ.bool(Q.tile)) G.tile = Q.tile;
        else throw vZ.invalidParameterError("tile", "boolean", Q.tile);
      if (vZ.defined(Q.left))
        if (vZ.integer(Q.left)) G.left = Q.left;
        else throw vZ.invalidParameterError("left", "integer", Q.left);
      if (vZ.defined(Q.top))
        if (vZ.integer(Q.top)) G.top = Q.top;
        else throw vZ.invalidParameterError("top", "integer", Q.top);
      if (vZ.defined(Q.top) !== vZ.defined(Q.left)) throw Error("Expected both left and top to be set");
      else G.hasOffset = vZ.integer(Q.top) && vZ.integer(Q.left);
      if (vZ.defined(Q.gravity))
        if (vZ.integer(Q.gravity) && vZ.inRange(Q.gravity, 0, 8)) G.gravity = Q.gravity;
        else if (vZ.string(Q.gravity) && vZ.integer(this.constructor.gravity[Q.gravity])) G.gravity = this.constructor.gravity[Q.gravity];
      else throw vZ.invalidParameterError("gravity", "valid gravity", Q.gravity);
      if (vZ.defined(Q.premultiplied))
        if (vZ.bool(Q.premultiplied)) G.premultiplied = Q.premultiplied;
        else throw vZ.invalidParameterError("premultiplied", "boolean", Q.premultiplied);
      return G
    }), this
  }
  AeB.exports = function (A) {
    A.prototype.composite = Ir8, A.blend = VZ0
  }
})
// @from(Ln 245060, Col 4)
ZeB = U((TGZ, GeB) => {
  var Dr8 = L51(),
    _0 = Gb(),
    BeB = {
      integer: "integer",
      float: "float",
      approximate: "approximate"
    };

  function Wr8(A, Q) {
    if (this.options.useExifOrientation || this.options.angle || this.options.rotationAngle) this.options.debuglog("ignoring previous rotate options");
    if (!_0.defined(A)) this.options.useExifOrientation = !0;
    else if (_0.integer(A) && !(A % 90)) this.options.angle = A;
    else if (_0.number(A)) {
      if (this.options.rotationAngle = A, _0.object(Q) && Q.background) {
        let B = Dr8(Q.background);
        this.options.rotationBackground = [B.red(), B.green(), B.blue(), Math.round(B.alpha() * 255)]
      }
    } else throw _0.invalidParameterError("angle", "numeric", A);
    return this
  }

  function Kr8(A) {
    return this.options.flip = _0.bool(A) ? A : !0, this
  }

  function Vr8(A) {
    return this.options.flop = _0.bool(A) ? A : !0, this
  }

  function Fr8(A, Q) {
    let B = [].concat(...A);
    if (B.length === 4 && B.every(_0.number)) this.options.affineMatrix = B;
    else throw _0.invalidParameterError("matrix", "1x4 or 2x2 array", A);
    if (_0.defined(Q))
      if (_0.object(Q)) {
        if (this._setBackgroundColourOption("affineBackground", Q.background), _0.defined(Q.idx))
          if (_0.number(Q.idx)) this.options.affineIdx = Q.idx;
          else throw _0.invalidParameterError("options.idx", "number", Q.idx);
        if (_0.defined(Q.idy))
          if (_0.number(Q.idy)) this.options.affineIdy = Q.idy;
          else throw _0.invalidParameterError("options.idy", "number", Q.idy);
        if (_0.defined(Q.odx))
          if (_0.number(Q.odx)) this.options.affineOdx = Q.odx;
          else throw _0.invalidParameterError("options.odx", "number", Q.odx);
        if (_0.defined(Q.ody))
          if (_0.number(Q.ody)) this.options.affineOdy = Q.ody;
          else throw _0.invalidParameterError("options.ody", "number", Q.ody);
        if (_0.defined(Q.interpolator))
          if (_0.inArray(Q.interpolator, Object.values(this.constructor.interpolators))) this.options.affineInterpolator = Q.interpolator;
          else throw _0.invalidParameterError("options.interpolator", "valid interpolator name", Q.interpolator)
      } else throw _0.invalidParameterError("options", "object", Q);
    return this
  }

  function Hr8(A, Q, B) {
    if (!_0.defined(A)) this.options.sharpenSigma = -1;
    else if (_0.bool(A)) this.options.sharpenSigma = A ? -1 : 0;
    else if (_0.number(A) && _0.inRange(A, 0.01, 1e4)) {
      if (this.options.sharpenSigma = A, _0.defined(Q))
        if (_0.number(Q) && _0.inRange(Q, 0, 1e4)) this.options.sharpenM1 = Q;
        else throw _0.invalidParameterError("flat", "number between 0 and 10000", Q);
      if (_0.defined(B))
        if (_0.number(B) && _0.inRange(B, 0, 1e4)) this.options.sharpenM2 = B;
        else throw _0.invalidParameterError("jagged", "number between 0 and 10000", B)
    } else if (_0.plainObject(A)) {
      if (_0.number(A.sigma) && _0.inRange(A.sigma, 0.000001, 10)) this.options.sharpenSigma = A.sigma;
      else throw _0.invalidParameterError("options.sigma", "number between 0.000001 and 10", A.sigma);
      if (_0.defined(A.m1))
        if (_0.number(A.m1) && _0.inRange(A.m1, 0, 1e6)) this.options.sharpenM1 = A.m1;
        else throw _0.invalidParameterError("options.m1", "number between 0 and 1000000", A.m1);
      if (_0.defined(A.m2))
        if (_0.number(A.m2) && _0.inRange(A.m2, 0, 1e6)) this.options.sharpenM2 = A.m2;
        else throw _0.invalidParameterError("options.m2", "number between 0 and 1000000", A.m2);
      if (_0.defined(A.x1))
        if (_0.number(A.x1) && _0.inRange(A.x1, 0, 1e6)) this.options.sharpenX1 = A.x1;
        else throw _0.invalidParameterError("options.x1", "number between 0 and 1000000", A.x1);
      if (_0.defined(A.y2))
        if (_0.number(A.y2) && _0.inRange(A.y2, 0, 1e6)) this.options.sharpenY2 = A.y2;
        else throw _0.invalidParameterError("options.y2", "number between 0 and 1000000", A.y2);
      if (_0.defined(A.y3))
        if (_0.number(A.y3) && _0.inRange(A.y3, 0, 1e6)) this.options.sharpenY3 = A.y3;
        else throw _0.invalidParameterError("options.y3", "number between 0 and 1000000", A.y3)
    } else throw _0.invalidParameterError("sigma", "number between 0.01 and 10000", A);
    return this
  }

  function Er8(A) {
    if (!_0.defined(A)) this.options.medianSize = 3;
    else if (_0.integer(A) && _0.inRange(A, 1, 1000)) this.options.medianSize = A;
    else throw _0.invalidParameterError("size", "integer between 1 and 1000", A);
    return this
  }

  function zr8(A) {
    let Q;
    if (_0.number(A)) Q = A;
    else if (_0.plainObject(A)) {
      if (!_0.number(A.sigma)) throw _0.invalidParameterError("options.sigma", "number between 0.3 and 1000", Q);
      if (Q = A.sigma, "precision" in A)
        if (_0.string(BeB[A.precision])) this.options.precision = BeB[A.precision];
        else throw _0.invalidParameterError("precision", "one of: integer, float, approximate", A.precision);
      if ("minAmplitude" in A)
        if (_0.number(A.minAmplitude) && _0.inRange(A.minAmplitude, 0.001, 1)) this.options.minAmpl = A.minAmplitude;
        else throw _0.invalidParameterError("minAmplitude", "number between 0.001 and 1", A.minAmplitude)
    }
    if (!_0.defined(A)) this.options.blurSigma = -1;
    else if (_0.bool(A)) this.options.blurSigma = A ? -1 : 0;
    else if (_0.number(Q) && _0.inRange(Q, 0.3, 1000)) this.options.blurSigma = Q;
    else throw _0.invalidParameterError("sigma", "number between 0.3 and 1000", Q);
    return this
  }

  function $r8(A) {
    if (this.options.flatten = _0.bool(A) ? A : !0, _0.object(A)) this._setBackgroundColourOption("flattenBackground", A.background);
    return this
  }

  function Cr8() {
    return this.options.unflatten = !0, this
  }

  function Ur8(A, Q) {
    if (!_0.defined(A)) this.options.gamma = 2.2;
    else if (_0.number(A) && _0.inRange(A, 1, 3)) this.options.gamma = A;
    else throw _0.invalidParameterError("gamma", "number between 1.0 and 3.0", A);
    if (!_0.defined(Q)) this.options.gammaOut = this.options.gamma;
    else if (_0.number(Q) && _0.inRange(Q, 1, 3)) this.options.gammaOut = Q;
    else throw _0.invalidParameterError("gammaOut", "number between 1.0 and 3.0", Q);
    return this
  }

  function qr8(A) {
    if (this.options.negate = _0.bool(A) ? A : !0, _0.plainObject(A) && "alpha" in A)
      if (!_0.bool(A.alpha)) throw _0.invalidParameterError("alpha", "should be boolean value", A.alpha);
      else this.options.negateAlpha = A.alpha;
    return this
  }

  function Nr8(A) {
    if (_0.plainObject(A)) {
      if (_0.defined(A.lower))
        if (_0.number(A.lower) && _0.inRange(A.lower, 0, 99)) this.options.normaliseLower = A.lower;
        else throw _0.invalidParameterError("lower", "number between 0 and 99", A.lower);
      if (_0.defined(A.upper))
        if (_0.number(A.upper) && _0.inRange(A.upper, 1, 100)) this.options.normaliseUpper = A.upper;
        else throw _0.invalidParameterError("upper", "number between 1 and 100", A.upper)
    }
    if (this.options.normaliseLower >= this.options.normaliseUpper) throw _0.invalidParameterError("range", "lower to be less than upper", `${this.options.normaliseLower} >= ${this.options.normaliseUpper}`);
    return this.options.normalise = !0, this
  }

  function wr8(A) {
    return this.normalise(A)
  }

  function Lr8(A) {
    if (_0.plainObject(A)) {
      if (_0.integer(A.width) && A.width > 0) this.options.claheWidth = A.width;
      else throw _0.invalidParameterError("width", "integer greater than zero", A.width);
      if (_0.integer(A.height) && A.height > 0) this.options.claheHeight = A.height;
      else throw _0.invalidParameterError("height", "integer greater than zero", A.height);
      if (_0.defined(A.maxSlope))
        if (_0.integer(A.maxSlope) && _0.inRange(A.maxSlope, 0, 100)) this.options.claheMaxSlope = A.maxSlope;
        else throw _0.invalidParameterError("maxSlope", "integer between 0 and 100", A.maxSlope)
    } else throw _0.invalidParameterError("options", "plain object", A);
    return this
  }

  function Or8(A) {
    if (!_0.object(A) || !Array.isArray(A.kernel) || !_0.integer(A.width) || !_0.integer(A.height) || !_0.inRange(A.width, 3, 1001) || !_0.inRange(A.height, 3, 1001) || A.height * A.width !== A.kernel.length) throw Error("Invalid convolution kernel");
    if (!_0.integer(A.scale)) A.scale = A.kernel.reduce(function (Q, B) {
      return Q + B
    }, 0);
    if (A.scale < 1) A.scale = 1;
    if (!_0.integer(A.offset)) A.offset = 0;
    return this.options.convKernel = A, this
  }

  function Mr8(A, Q) {
    if (!_0.defined(A)) this.options.threshold = 128;
    else if (_0.bool(A)) this.options.threshold = A ? 128 : 0;
    else if (_0.integer(A) && _0.inRange(A, 0, 255)) this.options.threshold = A;
    else throw _0.invalidParameterError("threshold", "integer between 0 and 255", A);
    if (!_0.object(Q) || Q.greyscale === !0 || Q.grayscale === !0) this.options.thresholdGrayscale = !0;
    else this.options.thresholdGrayscale = !1;
    return this
  }

  function Rr8(A, Q, B) {
    if (this.options.boolean = this._createInputDescriptor(A, B), _0.string(Q) && _0.inArray(Q, ["and", "or", "eor"])) this.options.booleanOp = Q;
    else throw _0.invalidParameterError("operator", "one of: and, or, eor", Q);
    return this
  }

  function _r8(A, Q) {
    if (!_0.defined(A) && _0.number(Q)) A = 1;
    else if (_0.number(A) && !_0.defined(Q)) Q = 0;
    if (!_0.defined(A)) this.options.linearA = [];
    else if (_0.number(A)) this.options.linearA = [A];
    else if (Array.isArray(A) && A.length && A.every(_0.number)) this.options.linearA = A;
    else throw _0.invalidParameterError("a", "number or array of numbers", A);
    if (!_0.defined(Q)) this.options.linearB = [];
    else if (_0.number(Q)) this.options.linearB = [Q];
    else if (Array.isArray(Q) && Q.length && Q.every(_0.number)) this.options.linearB = Q;
    else throw _0.invalidParameterError("b", "number or array of numbers", Q);
    if (this.options.linearA.length !== this.options.linearB.length) throw Error("Expected a and b to be arrays of the same length");
    return this
  }

  function jr8(A) {
    if (!Array.isArray(A)) throw _0.invalidParameterError("inputMatrix", "array", A);
    if (A.length !== 3 && A.length !== 4) throw _0.invalidParameterError("inputMatrix", "3x3 or 4x4 array", A.length);
    let Q = A.flat().map(Number);
    if (Q.length !== 9 && Q.length !== 16) throw _0.invalidParameterError("inputMatrix", "cardinality of 9 or 16", Q.length);
    return this.options.recombMatrix = Q, this
  }

  function Tr8(A) {
    if (!_0.plainObject(A)) throw _0.invalidParameterError("options", "plain object", A);
    if ("brightness" in A)
      if (_0.number(A.brightness) && A.brightness >= 0) this.options.brightness = A.brightness;
      else throw _0.invalidParameterError("brightness", "number above zero", A.brightness);
    if ("saturation" in A)
      if (_0.number(A.saturation) && A.saturation >= 0) this.options.saturation = A.saturation;
      else throw _0.invalidParameterError("saturation", "number above zero", A.saturation);
    if ("hue" in A)
      if (_0.integer(A.hue)) this.options.hue = A.hue % 360;
      else throw _0.invalidParameterError("hue", "number", A.hue);
    if ("lightness" in A)
      if (_0.number(A.lightness)) this.options.lightness = A.lightness;
      else throw _0.invalidParameterError("lightness", "number", A.lightness);
    return this
  }
  GeB.exports = function (A) {
    Object.assign(A.prototype, {
      rotate: Wr8,
      flip: Kr8,
      flop: Vr8,
      affine: Fr8,
      sharpen: Hr8,
      median: Er8,
      blur: zr8,
      flatten: $r8,
      unflatten: Cr8,
      gamma: Ur8,
      negate: qr8,
      normalise: Nr8,
      normalize: wr8,
      clahe: Lr8,
      convolve: Or8,
      threshold: Mr8,
      boolean: Rr8,
      linear: _r8,
      recomb: jr8,
      modulate: Tr8
    })
  }
})
// @from(Ln 245319, Col 4)
XeB = U((PGZ, JeB) => {
  var Pr8 = L51(),
    Qd = Gb(),
    YeB = {
      multiband: "multiband",
      "b-w": "b-w",
      bw: "b-w",
      cmyk: "cmyk",
      srgb: "srgb"
    };

  function Sr8(A) {
    return this._setBackgroundColourOption("tint", A), this
  }

  function xr8(A) {
    return this.options.greyscale = Qd.bool(A) ? A : !0, this
  }

  function yr8(A) {
    return this.greyscale(A)
  }

  function vr8(A) {
    if (!Qd.string(A)) throw Qd.invalidParameterError("colourspace", "string", A);
    return this.options.colourspacePipeline = A, this
  }

  function kr8(A) {
    return this.pipelineColourspace(A)
  }

  function br8(A) {
    if (!Qd.string(A)) throw Qd.invalidParameterError("colourspace", "string", A);
    return this.options.colourspace = A, this
  }

  function fr8(A) {
    return this.toColourspace(A)
  }

  function hr8(A, Q) {
    if (Qd.defined(Q))
      if (Qd.object(Q) || Qd.string(Q)) {
        let B = Pr8(Q);
        this.options[A] = [B.red(), B.green(), B.blue(), Math.round(B.alpha() * 255)]
      } else throw Qd.invalidParameterError("background", "object or string", Q)
  }
  JeB.exports = function (A) {
    Object.assign(A.prototype, {
      tint: Sr8,
      greyscale: xr8,
      grayscale: yr8,
      pipelineColourspace: vr8,
      pipelineColorspace: kr8,
      toColourspace: br8,
      toColorspace: fr8,
      _setBackgroundColourOption: hr8
    }), A.colourspace = YeB, A.colorspace = YeB
  }
})
// @from(Ln 245380, Col 4)
DeB = U((SGZ, IeB) => {
  var Xb = Gb(),
    gr8 = {
      and: "and",
      or: "or",
      eor: "eor"
    };

  function ur8() {
    return this.options.removeAlpha = !0, this
  }

  function mr8(A) {
    if (Xb.defined(A))
      if (Xb.number(A) && Xb.inRange(A, 0, 1)) this.options.ensureAlpha = A;
      else throw Xb.invalidParameterError("alpha", "number between 0 and 1", A);
    else this.options.ensureAlpha = 1;
    return this
  }

  function dr8(A) {
    let Q = {
      red: 0,
      green: 1,
      blue: 2,
      alpha: 3
    };
    if (Object.keys(Q).includes(A)) A = Q[A];
    if (Xb.integer(A) && Xb.inRange(A, 0, 4)) this.options.extractChannel = A;
    else throw Xb.invalidParameterError("channel", "integer or one of: red, green, blue, alpha", A);
    return this
  }

  function cr8(A, Q) {
    if (Array.isArray(A)) A.forEach(function (B) {
      this.options.joinChannelIn.push(this._createInputDescriptor(B, Q))
    }, this);
    else this.options.joinChannelIn.push(this._createInputDescriptor(A, Q));
    return this
  }

  function pr8(A) {
    if (Xb.string(A) && Xb.inArray(A, ["and", "or", "eor"])) this.options.bandBoolOp = A;
    else throw Xb.invalidParameterError("boolOp", "one of: and, or, eor", A);
    return this
  }
  IeB.exports = function (A) {
    Object.assign(A.prototype, {
      removeAlpha: ur8,
      ensureAlpha: mr8,
      extractChannel: dr8,
      joinChannel: cr8,
      bandbool: pr8
    }), A.bool = gr8
  }
})
// @from(Ln 245436, Col 4)
EeB = U((xGZ, HeB) => {
  var FZ0 = NA("node:path"),
    X1 = Gb(),
    DKA = SSA(),
    WeB = new Map([
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
    lr8 = /\.(jp[2x]|j2[kc])$/i,
    KeB = () => Error("JP2 output requires libvips with support for OpenJPEG"),
    VeB = (A) => 1 << 31 - Math.clz32(Math.ceil(Math.log2(A)));

  function ir8(A, Q) {
    let B;
    if (!X1.string(A)) B = Error("Missing output file path");
    else if (X1.string(this.options.input.file) && FZ0.resolve(this.options.input.file) === FZ0.resolve(A)) B = Error("Cannot use same file for input and output");
    else if (lr8.test(FZ0.extname(A)) && !this.constructor.format.jp2k.output.file) B = KeB();
    if (B)
      if (X1.fn(Q)) Q(B);
      else return Promise.reject(B);
    else {
      this.options.fileOut = A;
      let G = Error();
      return this._pipeline(Q, G)
    }
    return this
  }

  function nr8(A, Q) {
    if (X1.object(A)) this._setBooleanOption("resolveWithObject", A.resolveWithObject);
    else if (this.options.resolveWithObject) this.options.resolveWithObject = !1;
    this.options.fileOut = "";
    let B = Error();
    return this._pipeline(X1.fn(A) ? A : Q, B)
  }

  function ar8() {
    return this.options.keepMetadata |= 1, this
  }

  function or8(A) {
    if (X1.object(A))
      for (let [Q, B] of Object.entries(A))
        if (X1.object(B))
          for (let [G, Z] of Object.entries(B))
            if (X1.string(Z)) this.options.withExif[`exif-${Q.toLowerCase()}-${G}`] = Z;
            else throw X1.invalidParameterError(`${Q}.${G}`, "string", Z);
    else throw X1.invalidParameterError(Q, "object", B);
    else throw X1.invalidParameterError("exif", "object", A);
    return this.options.withExifMerge = !1, this.keepExif()
  }

  function rr8(A) {
    return this.withExif(A), this.options.withExifMerge = !0, this
  }

  function sr8() {
    return this.options.keepMetadata |= 8, this
  }

  function tr8(A, Q) {
    if (X1.string(A)) this.options.withIccProfile = A;
    else throw X1.invalidParameterError("icc", "string", A);
    if (this.keepIccProfile(), X1.object(Q)) {
      if (X1.defined(Q.attach))
        if (X1.bool(Q.attach)) {
          if (!Q.attach) this.options.keepMetadata &= -9
        } else throw X1.invalidParameterError("attach", "boolean", Q.attach)
    }
    return this
  }

  function er8() {
    return this.options.keepMetadata = 31, this
  }

  function As8(A) {
    if (this.keepMetadata(), this.withIccProfile("srgb"), X1.object(A)) {
      if (X1.defined(A.orientation))
        if (X1.integer(A.orientation) && X1.inRange(A.orientation, 1, 8)) this.options.withMetadataOrientation = A.orientation;
        else throw X1.invalidParameterError("orientation", "integer between 1 and 8", A.orientation);
      if (X1.defined(A.density))
        if (X1.number(A.density) && A.density > 0) this.options.withMetadataDensity = A.density;
        else throw X1.invalidParameterError("density", "positive number", A.density);
      if (X1.defined(A.icc)) this.withIccProfile(A.icc);
      if (X1.defined(A.exif)) this.withExifMerge(A.exif)
    }
    return this
  }

  function Qs8(A, Q) {
    let B = WeB.get((X1.object(A) && X1.string(A.id) ? A.id : A).toLowerCase());
    if (!B) throw X1.invalidParameterError("format", `one of: ${[...WeB.keys()].join(", ")}`, A);
    return this[B](Q)
  }

  function Bs8(A) {
    if (X1.object(A)) {
      if (X1.defined(A.quality))
        if (X1.integer(A.quality) && X1.inRange(A.quality, 1, 100)) this.options.jpegQuality = A.quality;
        else throw X1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      if (X1.defined(A.progressive)) this._setBooleanOption("jpegProgressive", A.progressive);
      if (X1.defined(A.chromaSubsampling))
        if (X1.string(A.chromaSubsampling) && X1.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.jpegChromaSubsampling = A.chromaSubsampling;
        else throw X1.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling);
      let Q = X1.bool(A.optimizeCoding) ? A.optimizeCoding : A.optimiseCoding;
      if (X1.defined(Q)) this._setBooleanOption("jpegOptimiseCoding", Q);
      if (X1.defined(A.mozjpeg))
        if (X1.bool(A.mozjpeg)) {
          if (A.mozjpeg) this.options.jpegTrellisQuantisation = !0, this.options.jpegOvershootDeringing = !0, this.options.jpegOptimiseScans = !0, this.options.jpegProgressive = !0, this.options.jpegQuantisationTable = 3
        } else throw X1.invalidParameterError("mozjpeg", "boolean", A.mozjpeg);
      let B = X1.bool(A.trellisQuantization) ? A.trellisQuantization : A.trellisQuantisation;
      if (X1.defined(B)) this._setBooleanOption("jpegTrellisQuantisation", B);
      if (X1.defined(A.overshootDeringing)) this._setBooleanOption("jpegOvershootDeringing", A.overshootDeringing);
      let G = X1.bool(A.optimizeScans) ? A.optimizeScans : A.optimiseScans;
      if (X1.defined(G)) {
        if (this._setBooleanOption("jpegOptimiseScans", G), G) this.options.jpegProgressive = !0
      }
      let Z = X1.number(A.quantizationTable) ? A.quantizationTable : A.quantisationTable;
      if (X1.defined(Z))
        if (X1.integer(Z) && X1.inRange(Z, 0, 8)) this.options.jpegQuantisationTable = Z;
        else throw X1.invalidParameterError("quantisationTable", "integer between 0 and 8", Z)
    }
    return this._updateFormatOut("jpeg", A)
  }

  function Gs8(A) {
    if (X1.object(A)) {
      if (X1.defined(A.progressive)) this._setBooleanOption("pngProgressive", A.progressive);
      if (X1.defined(A.compressionLevel))
        if (X1.integer(A.compressionLevel) && X1.inRange(A.compressionLevel, 0, 9)) this.options.pngCompressionLevel = A.compressionLevel;
        else throw X1.invalidParameterError("compressionLevel", "integer between 0 and 9", A.compressionLevel);
      if (X1.defined(A.adaptiveFiltering)) this._setBooleanOption("pngAdaptiveFiltering", A.adaptiveFiltering);
      let Q = A.colours || A.colors;
      if (X1.defined(Q))
        if (X1.integer(Q) && X1.inRange(Q, 2, 256)) this.options.pngBitdepth = VeB(Q);
        else throw X1.invalidParameterError("colours", "integer between 2 and 256", Q);
      if (X1.defined(A.palette)) this._setBooleanOption("pngPalette", A.palette);
      else if ([A.quality, A.effort, A.colours, A.colors, A.dither].some(X1.defined)) this._setBooleanOption("pngPalette", !0);
      if (this.options.pngPalette) {
        if (X1.defined(A.quality))
          if (X1.integer(A.quality) && X1.inRange(A.quality, 0, 100)) this.options.pngQuality = A.quality;
          else throw X1.invalidParameterError("quality", "integer between 0 and 100", A.quality);
        if (X1.defined(A.effort))
          if (X1.integer(A.effort) && X1.inRange(A.effort, 1, 10)) this.options.pngEffort = A.effort;
          else throw X1.invalidParameterError("effort", "integer between 1 and 10", A.effort);
        if (X1.defined(A.dither))
          if (X1.number(A.dither) && X1.inRange(A.dither, 0, 1)) this.options.pngDither = A.dither;
          else throw X1.invalidParameterError("dither", "number between 0.0 and 1.0", A.dither)
      }
    }
    return this._updateFormatOut("png", A)
  }

  function Zs8(A) {
    if (X1.object(A)) {
      if (X1.defined(A.quality))
        if (X1.integer(A.quality) && X1.inRange(A.quality, 1, 100)) this.options.webpQuality = A.quality;
        else throw X1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      if (X1.defined(A.alphaQuality))
        if (X1.integer(A.alphaQuality) && X1.inRange(A.alphaQuality, 0, 100)) this.options.webpAlphaQuality = A.alphaQuality;
        else throw X1.invalidParameterError("alphaQuality", "integer between 0 and 100", A.alphaQuality);
      if (X1.defined(A.lossless)) this._setBooleanOption("webpLossless", A.lossless);
      if (X1.defined(A.nearLossless)) this._setBooleanOption("webpNearLossless", A.nearLossless);
      if (X1.defined(A.smartSubsample)) this._setBooleanOption("webpSmartSubsample", A.smartSubsample);
      if (X1.defined(A.preset))
        if (X1.string(A.preset) && X1.inArray(A.preset, ["default", "photo", "picture", "drawing", "icon", "text"])) this.options.webpPreset = A.preset;
        else throw X1.invalidParameterError("preset", "one of: default, photo, picture, drawing, icon, text", A.preset);
      if (X1.defined(A.effort))
        if (X1.integer(A.effort) && X1.inRange(A.effort, 0, 6)) this.options.webpEffort = A.effort;
        else throw X1.invalidParameterError("effort", "integer between 0 and 6", A.effort);
      if (X1.defined(A.minSize)) this._setBooleanOption("webpMinSize", A.minSize);
      if (X1.defined(A.mixed)) this._setBooleanOption("webpMixed", A.mixed)
    }
    return FeB(A, this.options), this._updateFormatOut("webp", A)
  }

  function Ys8(A) {
    if (X1.object(A)) {
      if (X1.defined(A.reuse)) this._setBooleanOption("gifReuse", A.reuse);
      if (X1.defined(A.progressive)) this._setBooleanOption("gifProgressive", A.progressive);
      let Q = A.colours || A.colors;
      if (X1.defined(Q))
        if (X1.integer(Q) && X1.inRange(Q, 2, 256)) this.options.gifBitdepth = VeB(Q);
        else throw X1.invalidParameterError("colours", "integer between 2 and 256", Q);
      if (X1.defined(A.effort))
        if (X1.number(A.effort) && X1.inRange(A.effort, 1, 10)) this.options.gifEffort = A.effort;
        else throw X1.invalidParameterError("effort", "integer between 1 and 10", A.effort);
      if (X1.defined(A.dither))
        if (X1.number(A.dither) && X1.inRange(A.dither, 0, 1)) this.options.gifDither = A.dither;
        else throw X1.invalidParameterError("dither", "number between 0.0 and 1.0", A.dither);
      if (X1.defined(A.interFrameMaxError))
        if (X1.number(A.interFrameMaxError) && X1.inRange(A.interFrameMaxError, 0, 32)) this.options.gifInterFrameMaxError = A.interFrameMaxError;
        else throw X1.invalidParameterError("interFrameMaxError", "number between 0.0 and 32.0", A.interFrameMaxError);
      if (X1.defined(A.interPaletteMaxError))
        if (X1.number(A.interPaletteMaxError) && X1.inRange(A.interPaletteMaxError, 0, 256)) this.options.gifInterPaletteMaxError = A.interPaletteMaxError;
        else throw X1.invalidParameterError("interPaletteMaxError", "number between 0.0 and 256.0", A.interPaletteMaxError)
    }
    return FeB(A, this.options), this._updateFormatOut("gif", A)
  }

  function Js8(A) {
    if (!this.constructor.format.jp2k.output.buffer) throw KeB();
    if (X1.object(A)) {
      if (X1.defined(A.quality))
        if (X1.integer(A.quality) && X1.inRange(A.quality, 1, 100)) this.options.jp2Quality = A.quality;
        else throw X1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      if (X1.defined(A.lossless))
        if (X1.bool(A.lossless)) this.options.jp2Lossless = A.lossless;
        else throw X1.invalidParameterError("lossless", "boolean", A.lossless);
      if (X1.defined(A.tileWidth))
        if (X1.integer(A.tileWidth) && X1.inRange(A.tileWidth, 1, 32768)) this.options.jp2TileWidth = A.tileWidth;
        else throw X1.invalidParameterError("tileWidth", "integer between 1 and 32768", A.tileWidth);
      if (X1.defined(A.tileHeight))
        if (X1.integer(A.tileHeight) && X1.inRange(A.tileHeight, 1, 32768)) this.options.jp2TileHeight = A.tileHeight;
        else throw X1.invalidParameterError("tileHeight", "integer between 1 and 32768", A.tileHeight);
      if (X1.defined(A.chromaSubsampling))
        if (X1.string(A.chromaSubsampling) && X1.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.jp2ChromaSubsampling = A.chromaSubsampling;
        else throw X1.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling)
    }
    return this._updateFormatOut("jp2", A)
  }

  function FeB(A, Q) {
    if (X1.object(A) && X1.defined(A.loop))
      if (X1.integer(A.loop) && X1.inRange(A.loop, 0, 65535)) Q.loop = A.loop;
      else throw X1.invalidParameterError("loop", "integer between 0 and 65535", A.loop);
    if (X1.object(A) && X1.defined(A.delay))
      if (X1.integer(A.delay) && X1.inRange(A.delay, 0, 65535)) Q.delay = [A.delay];
      else if (Array.isArray(A.delay) && A.delay.every(X1.integer) && A.delay.every((B) => X1.inRange(B, 0, 65535))) Q.delay = A.delay;
    else throw X1.invalidParameterError("delay", "integer or an array of integers between 0 and 65535", A.delay)
  }

  function Xs8(A) {
    if (X1.object(A)) {
      if (X1.defined(A.quality))
        if (X1.integer(A.quality) && X1.inRange(A.quality, 1, 100)) this.options.tiffQuality = A.quality;
        else throw X1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      if (X1.defined(A.bitdepth))
        if (X1.integer(A.bitdepth) && X1.inArray(A.bitdepth, [1, 2, 4, 8])) this.options.tiffBitdepth = A.bitdepth;
        else throw X1.invalidParameterError("bitdepth", "1, 2, 4 or 8", A.bitdepth);
      if (X1.defined(A.tile)) this._setBooleanOption("tiffTile", A.tile);
      if (X1.defined(A.tileWidth))
        if (X1.integer(A.tileWidth) && A.tileWidth > 0) this.options.tiffTileWidth = A.tileWidth;
        else throw X1.invalidParameterError("tileWidth", "integer greater than zero", A.tileWidth);
      if (X1.defined(A.tileHeight))
        if (X1.integer(A.tileHeight) && A.tileHeight > 0) this.options.tiffTileHeight = A.tileHeight;
        else throw X1.invalidParameterError("tileHeight", "integer greater than zero", A.tileHeight);
      if (X1.defined(A.miniswhite)) this._setBooleanOption("tiffMiniswhite", A.miniswhite);
      if (X1.defined(A.pyramid)) this._setBooleanOption("tiffPyramid", A.pyramid);
      if (X1.defined(A.xres))
        if (X1.number(A.xres) && A.xres > 0) this.options.tiffXres = A.xres;
        else throw X1.invalidParameterError("xres", "number greater than zero", A.xres);
      if (X1.defined(A.yres))
        if (X1.number(A.yres) && A.yres > 0) this.options.tiffYres = A.yres;
        else throw X1.invalidParameterError("yres", "number greater than zero", A.yres);
      if (X1.defined(A.compression))
        if (X1.string(A.compression) && X1.inArray(A.compression, ["none", "jpeg", "deflate", "packbits", "ccittfax4", "lzw", "webp", "zstd", "jp2k"])) this.options.tiffCompression = A.compression;
        else throw X1.invalidParameterError("compression", "one of: none, jpeg, deflate, packbits, ccittfax4, lzw, webp, zstd, jp2k", A.compression);
      if (X1.defined(A.predictor))
        if (X1.string(A.predictor) && X1.inArray(A.predictor, ["none", "horizontal", "float"])) this.options.tiffPredictor = A.predictor;
        else throw X1.invalidParameterError("predictor", "one of: none, horizontal, float", A.predictor);
      if (X1.defined(A.resolutionUnit))
        if (X1.string(A.resolutionUnit) && X1.inArray(A.resolutionUnit, ["inch", "cm"])) this.options.tiffResolutionUnit = A.resolutionUnit;
        else throw X1.invalidParameterError("resolutionUnit", "one of: inch, cm", A.resolutionUnit)
    }
    return this._updateFormatOut("tiff", A)
  }

  function Is8(A) {
    return this.heif({
      ...A,
      compression: "av1"
    })
  }

  function Ds8(A) {
    if (X1.object(A)) {
      if (X1.string(A.compression) && X1.inArray(A.compression, ["av1", "hevc"])) this.options.heifCompression = A.compression;
      else throw X1.invalidParameterError("compression", "one of: av1, hevc", A.compression);
      if (X1.defined(A.quality))
        if (X1.integer(A.quality) && X1.inRange(A.quality, 1, 100)) this.options.heifQuality = A.quality;
        else throw X1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      if (X1.defined(A.lossless))
        if (X1.bool(A.lossless)) this.options.heifLossless = A.lossless;
        else throw X1.invalidParameterError("lossless", "boolean", A.lossless);
      if (X1.defined(A.effort))
        if (X1.integer(A.effort) && X1.inRange(A.effort, 0, 9)) this.options.heifEffort = A.effort;
        else throw X1.invalidParameterError("effort", "integer between 0 and 9", A.effort);
      if (X1.defined(A.chromaSubsampling))
        if (X1.string(A.chromaSubsampling) && X1.inArray(A.chromaSubsampling, ["4:2:0", "4:4:4"])) this.options.heifChromaSubsampling = A.chromaSubsampling;
        else throw X1.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", A.chromaSubsampling);
      if (X1.defined(A.bitdepth))
        if (X1.integer(A.bitdepth) && X1.inArray(A.bitdepth, [8, 10, 12])) {
          if (A.bitdepth !== 8 && this.constructor.versions.heif) throw X1.invalidParameterError("bitdepth when using prebuilt binaries", 8, A.bitdepth);
          this.options.heifBitdepth = A.bitdepth
        } else throw X1.invalidParameterError("bitdepth", "8, 10 or 12", A.bitdepth)
    } else throw X1.invalidParameterError("options", "Object", A);
    return this._updateFormatOut("heif", A)
  }

  function Ws8(A) {
    if (X1.object(A)) {
      if (X1.defined(A.quality))
        if (X1.integer(A.quality) && X1.inRange(A.quality, 1, 100)) this.options.jxlDistance = A.quality >= 30 ? 0.1 + (100 - A.quality) * 0.09 : 0.017666666666666667 * A.quality * A.quality - 1.15 * A.quality + 25;
        else throw X1.invalidParameterError("quality", "integer between 1 and 100", A.quality);
      else if (X1.defined(A.distance))
        if (X1.number(A.distance) && X1.inRange(A.distance, 0, 15)) this.options.jxlDistance = A.distance;
        else throw X1.invalidParameterError("distance", "number between 0.0 and 15.0", A.distance);
      if (X1.defined(A.decodingTier))
        if (X1.integer(A.decodingTier) && X1.inRange(A.decodingTier, 0, 4)) this.options.jxlDecodingTier = A.decodingTier;
        else throw X1.invalidParameterError("decodingTier", "integer between 0 and 4", A.decodingTier);
      if (X1.defined(A.lossless))
        if (X1.bool(A.lossless)) this.options.jxlLossless = A.lossless;
        else throw X1.invalidParameterError("lossless", "boolean", A.lossless);
      if (X1.defined(A.effort))
        if (X1.integer(A.effort) && X1.inRange(A.effort, 3, 9)) this.options.jxlEffort = A.effort;
        else throw X1.invalidParameterError("effort", "integer between 3 and 9", A.effort)
    }
    return this._updateFormatOut("jxl", A)
  }

  function Ks8(A) {
    if (X1.object(A)) {
      if (X1.defined(A.depth))
        if (X1.string(A.depth) && X1.inArray(A.depth, ["char", "uchar", "short", "ushort", "int", "uint", "float", "complex", "double", "dpcomplex"])) this.options.rawDepth = A.depth;
        else throw X1.invalidParameterError("depth", "one of: char, uchar, short, ushort, int, uint, float, complex, double, dpcomplex", A.depth)
    }
    return this._updateFormatOut("raw")
  }

  function Vs8(A) {
    if (X1.object(A)) {
      if (X1.defined(A.size))
        if (X1.integer(A.size) && X1.inRange(A.size, 1, 8192)) this.options.tileSize = A.size;
        else throw X1.invalidParameterError("size", "integer between 1 and 8192", A.size);
      if (X1.defined(A.overlap))
        if (X1.integer(A.overlap) && X1.inRange(A.overlap, 0, 8192)) {
          if (A.overlap > this.options.tileSize) throw X1.invalidParameterError("overlap", `<= size (${this.options.tileSize})`, A.overlap);
          this.options.tileOverlap = A.overlap
        } else throw X1.invalidParameterError("overlap", "integer between 0 and 8192", A.overlap);
      if (X1.defined(A.container))
        if (X1.string(A.container) && X1.inArray(A.container, ["fs", "zip"])) this.options.tileContainer = A.container;
        else throw X1.invalidParameterError("container", "one of: fs, zip", A.container);
      if (X1.defined(A.layout))
        if (X1.string(A.layout) && X1.inArray(A.layout, ["dz", "google", "iiif", "iiif3", "zoomify"])) this.options.tileLayout = A.layout;
        else throw X1.invalidParameterError("layout", "one of: dz, google, iiif, iiif3, zoomify", A.layout);
      if (X1.defined(A.angle))
        if (X1.integer(A.angle) && !(A.angle % 90)) this.options.tileAngle = A.angle;
        else throw X1.invalidParameterError("angle", "positive/negative multiple of 90", A.angle);
      if (this._setBackgroundColourOption("tileBackground", A.background), X1.defined(A.depth))
        if (X1.string(A.depth) && X1.inArray(A.depth, ["onepixel", "onetile", "one"])) this.options.tileDepth = A.depth;
        else throw X1.invalidParameterError("depth", "one of: onepixel, onetile, one", A.depth);
      if (X1.defined(A.skipBlanks))
        if (X1.integer(A.skipBlanks) && X1.inRange(A.skipBlanks, -1, 65535)) this.options.tileSkipBlanks = A.skipBlanks;
        else throw X1.invalidParameterError("skipBlanks", "integer between -1 and 255/65535", A.skipBlanks);
      else if (X1.defined(A.layout) && A.layout === "google") this.options.tileSkipBlanks = 5;
      let Q = X1.bool(A.center) ? A.center : A.centre;
      if (X1.defined(Q)) this._setBooleanOption("tileCentre", Q);
      if (X1.defined(A.id))
        if (X1.string(A.id)) this.options.tileId = A.id;
        else throw X1.invalidParameterError("id", "string", A.id);
      if (X1.defined(A.basename))
        if (X1.string(A.basename)) this.options.tileBasename = A.basename;
        else throw X1.invalidParameterError("basename", "string", A.basename)
    }
    if (X1.inArray(this.options.formatOut, ["jpeg", "png", "webp"])) this.options.tileFormat = this.options.formatOut;
    else if (this.options.formatOut !== "input") throw X1.invalidParameterError("format", "one of: jpeg, png, webp", this.options.formatOut);
    return this._updateFormatOut("dz")
  }

  function Fs8(A) {
    if (!X1.plainObject(A)) throw X1.invalidParameterError("options", "object", A);
    if (X1.integer(A.seconds) && X1.inRange(A.seconds, 0, 3600)) this.options.timeoutSeconds = A.seconds;
    else throw X1.invalidParameterError("seconds", "integer between 0 and 3600", A.seconds);
    return this
  }

  function Hs8(A, Q) {
    if (!(X1.object(Q) && Q.force === !1)) this.options.formatOut = A;
    return this
  }

  function Es8(A, Q) {
    if (X1.bool(Q)) this.options[A] = Q;
    else throw X1.invalidParameterError(A, "boolean", Q)
  }

  function zs8() {
    if (!this.options.streamOut) {
      this.options.streamOut = !0;
      let A = Error();
      this._pipeline(void 0, A)
    }
  }

  function $s8(A, Q) {
    if (typeof A === "function") {
      if (this._isStreamInput()) this.on("finish", () => {
        this._flattenBufferIn(), DKA.pipeline(this.options, (B, G, Z) => {
          if (B) A(X1.nativeError(B, Q));
          else A(null, G, Z)
        })
      });
      else DKA.pipeline(this.options, (B, G, Z) => {
        if (B) A(X1.nativeError(B, Q));
        else A(null, G, Z)
      });
      return this
    } else if (this.options.streamOut) {
      if (this._isStreamInput()) {
        if (this.once("finish", () => {
            this._flattenBufferIn(), DKA.pipeline(this.options, (B, G, Z) => {
              if (B) this.emit("error", X1.nativeError(B, Q));
              else this.emit("info", Z), this.push(G);
              this.push(null), this.on("end", () => this.emit("close"))
            })
          }), this.streamInFinished) this.emit("finish")
      } else DKA.pipeline(this.options, (B, G, Z) => {
        if (B) this.emit("error", X1.nativeError(B, Q));
        else this.emit("info", Z), this.push(G);
        this.push(null), this.on("end", () => this.emit("close"))
      });
      return this
    } else if (this._isStreamInput()) return new Promise((B, G) => {
      this.once("finish", () => {
        this._flattenBufferIn(), DKA.pipeline(this.options, (Z, Y, J) => {
          if (Z) G(X1.nativeError(Z, Q));
          else if (this.options.resolveWithObject) B({
            data: Y,
            info: J
          });
          else B(Y)
        })
      })
    });
    else return new Promise((B, G) => {
      DKA.pipeline(this.options, (Z, Y, J) => {
        if (Z) G(X1.nativeError(Z, Q));
        else if (this.options.resolveWithObject) B({
          data: Y,
          info: J
        });
        else B(Y)
      })
    })
  }
  HeB.exports = function (A) {
    Object.assign(A.prototype, {
      toFile: ir8,
      toBuffer: nr8,
      keepExif: ar8,
      withExif: or8,
      withExifMerge: rr8,
      keepIccProfile: sr8,
      withIccProfile: tr8,
      keepMetadata: er8,
      withMetadata: As8,
      toFormat: Qs8,
      jpeg: Bs8,
      jp2: Js8,
      png: Gs8,
      webp: Zs8,
      tiff: Xs8,
      avif: Is8,
      heif: Ds8,
      jxl: Ws8,
      gif: Ys8,
      raw: Ks8,
      tile: Vs8,
      timeout: Fs8,
      _updateFormatOut: Hs8,
      _setBooleanOption: Es8,
      _read: zs8,
      _pipeline: $s8
    })
  }
})
// @from(Ln 245931, Col 4)
UeB = U((yGZ, CeB) => {
  var Cs8 = NA("node:events"),
    M51 = I51(),
    j_ = Gb(),
    {
      runtimePlatformArch: Us8
    } = QZ0(),
    gC = SSA(),
    zeB = Us8(),
    HZ0 = gC.libvipsVersion(),
    eo = gC.format();
  eo.heif.output.alias = ["avif", "heic"];
  eo.jpeg.output.alias = ["jpe", "jpg"];
  eo.tiff.output.alias = ["tif"];
  eo.jp2k.output.alias = ["j2c", "j2k", "jp2", "jpx"];
  var qs8 = {
      nearest: "nearest",
      bilinear: "bilinear",
      bicubic: "bicubic",
      locallyBoundedBicubic: "lbb",
      nohalo: "nohalo",
      vertexSplitQuadraticBasisSpline: "vsqbs"
    },
    WKA = {
      vips: HZ0.semver
    };
  if (!HZ0.isGlobal)
    if (!HZ0.isWasm) try {
      WKA = NA(`@img/sharp-${zeB}/versions`)
    } catch (A) {
      try {
        WKA = NA(`@img/sharp-libvips-${zeB}/versions`)
      } catch (Q) {}
    } else try {
      WKA = (() => {
        throw new Error("Cannot require module " + "@img/sharp-wasm32/versions");
      })()
    } catch (A) {}
  WKA.sharp = eG0().version;
  if (WKA.heif && eo.heif) eo.heif.input.fileSuffix = [".avif"], eo.heif.output.alias = ["avif"];

  function $eB(A) {
    if (j_.bool(A))
      if (A) return gC.cache(50, 20, 100);
      else return gC.cache(0, 0, 0);
    else if (j_.object(A)) return gC.cache(A.memory, A.files, A.items);
    else return gC.cache()
  }
  $eB(!0);

  function Ns8(A) {
    return gC.concurrency(j_.integer(A) ? A : null)
  }
  if (M51.familySync() === M51.GLIBC && !gC._isUsingJemalloc()) gC.concurrency(1);
  else if (M51.familySync() === M51.MUSL && gC.concurrency() === 1024) gC.concurrency(NA("node:os").availableParallelism());
  var ws8 = new Cs8.EventEmitter;

  function Ls8() {
    return gC.counters()
  }

  function Os8(A) {
    return gC.simd(j_.bool(A) ? A : null)
  }

  function Ms8(A) {
    if (j_.object(A))
      if (Array.isArray(A.operation) && A.operation.every(j_.string)) gC.block(A.operation, !0);
      else throw j_.invalidParameterError("operation", "Array<string>", A.operation);
    else throw j_.invalidParameterError("options", "object", A)
  }

  function Rs8(A) {
    if (j_.object(A))
      if (Array.isArray(A.operation) && A.operation.every(j_.string)) gC.block(A.operation, !1);
      else throw j_.invalidParameterError("operation", "Array<string>", A.operation);
    else throw j_.invalidParameterError("options", "object", A)
  }
  CeB.exports = function (A) {
    A.cache = $eB, A.concurrency = Ns8, A.counters = Ls8, A.simd = Os8, A.format = eo, A.interpolators = qs8, A.versions = WKA, A.queue = ws8, A.block = Ms8, A.unblock = Rs8
  }
})
// @from(Ln 246013, Col 4)
EZ0 = U((kGZ, qeB) => {
  var Bd = _tB();
  ntB()(Bd);
  etB()(Bd);
  QeB()(Bd);
  ZeB()(Bd);
  XeB()(Bd);
  DeB()(Bd);
  EeB()(Bd);
  UeB()(Bd);
  qeB.exports = Bd
})
// @from(Ln 246025, Col 0)
async function zZ0() {
  if (R51) return R51.default;
  if (LG()) try {
    let B = await Promise.resolve().then(() => (orB(), arB)),
      G = B.sharp || B.default;
    return R51 = {
      default: G
    }, G
  } catch {
    console.warn("Native image processor not available, falling back to sharp")
  }
  let A = await Promise.resolve().then(() => c(EZ0(), 1)),
    Q = A?.default || A;
  return R51 = {
    default: Q
  }, Q
}
// @from(Ln 246042, Col 4)
R51 = null
// @from(Ln 246043, Col 4)
NeB = () => {}
// @from(Ln 246045, Col 0)
function Ts8(A) {
  if (A instanceof Error) {
    let B = A;
    if (B.code === "MODULE_NOT_FOUND" || B.code === "ERR_MODULE_NOT_FOUND" || B.code === "ERR_DLOPEN_FAILED") return weB
  }
  let Q = A instanceof Error ? A.message : String(A);
  if (Q.includes("Native image processor module not available")) return weB;
  if (Q.includes("unsupported image format") || Q.includes("Input buffer") || Q.includes("Input file is missing") || Q.includes("Input file has corrupt header")) return _s8;
  return js8
}
// @from(Ln 246056, Col 0)
function Gd(A) {
  if (A < 1024) return `${A} B`;
  if (A < 1048576) return `${(A/1024).toFixed(1)} KB`;
  return `${(A/1048576).toFixed(1)} MB`
}
// @from(Ln 246061, Col 0)
async function KKA(A, Q, B) {
  try {
    let G = await zZ0(),
      Y = await G(A).metadata(),
      J = Y.format ?? B,
      X = J === "jpg" ? "jpeg" : J;
    if (!Y.width || !Y.height) {
      if (Q > qP) return {
        buffer: await G(A).jpeg({
          quality: 80
        }).toBuffer(),
        mediaType: "jpeg"
      };
      return {
        buffer: A,
        mediaType: X
      }
    }
    let {
      width: I,
      height: D
    } = Y, W = I, K = D;
    if (Q <= qP && W <= JIA && K <= XIA) return {
      buffer: A,
      mediaType: X,
      dimensions: {
        originalWidth: I,
        originalHeight: D,
        displayWidth: W,
        displayHeight: K
      }
    };
    let V = W > JIA || K > XIA,
      F = X === "png";
    if (!V && Q > qP) {
      if (F) {
        let E = await G(A).png({
          compressionLevel: 9,
          palette: !0
        }).toBuffer();
        if (E.length <= qP) return {
          buffer: E,
          mediaType: "png",
          dimensions: {
            originalWidth: I,
            originalHeight: D,
            displayWidth: W,
            displayHeight: K
          }
        }
      }
      for (let E of [80, 60, 40, 20]) {
        let z = await G(A).jpeg({
          quality: E
        }).toBuffer();
        if (z.length <= qP) return {
          buffer: z,
          mediaType: "jpeg",
          dimensions: {
            originalWidth: I,
            originalHeight: D,
            displayWidth: W,
            displayHeight: K
          }
        }
      }
    }
    if (W > JIA) K = Math.round(K * JIA / W), W = JIA;
    if (K > XIA) W = Math.round(W * XIA / K), K = XIA;
    k(`Resizing to ${W}x${K}`);
    let H = await G(A).resize(W, K, {
      fit: "inside",
      withoutEnlargement: !0
    }).toBuffer();
    if (H.length > qP) {
      if (F) {
        let O = await G(A).resize(W, K, {
          fit: "inside",
          withoutEnlargement: !0
        }).png({
          compressionLevel: 9,
          palette: !0
        }).toBuffer();
        if (O.length <= qP) return {
          buffer: O,
          mediaType: "png",
          dimensions: {
            originalWidth: I,
            originalHeight: D,
            displayWidth: W,
            displayHeight: K
          }
        }
      }
      for (let O of [80, 60, 40, 20]) {
        let L = await G(A).resize(W, K, {
          fit: "inside",
          withoutEnlargement: !0
        }).jpeg({
          quality: O
        }).toBuffer();
        if (L.length <= qP) return {
          buffer: L,
          mediaType: "jpeg",
          dimensions: {
            originalWidth: I,
            originalHeight: D,
            displayWidth: W,
            displayHeight: K
          }
        }
      }
      let E = Math.min(W, 1000),
        z = Math.round(K * E / Math.max(W, 1));
      k("Still too large, compressing with JPEG");
      let $ = await G(A).resize(E, z, {
        fit: "inside",
        withoutEnlargement: !0
      }).jpeg({
        quality: 20
      }).toBuffer();
      return k(`JPEG compressed buffer size: ${$.length}`), {
        buffer: $,
        mediaType: "jpeg",
        dimensions: {
          originalWidth: I,
          originalHeight: D,
          displayWidth: E,
          displayHeight: z
        }
      }
    }
    return {
      buffer: H,
      mediaType: X,
      dimensions: {
        originalWidth: I,
        originalHeight: D,
        displayWidth: W,
        displayHeight: K
      }
    }
  } catch (G) {
    e(G);
    let Z = Ts8(G);
    l("tengu_image_resize_failed", {
      original_size_bytes: Q,
      error_type: Z
    });
    let Y = B === "jpg" ? "jpeg" : B,
      J = Math.ceil(Q * 4 / 3);
    if (J <= YIA) return l("tengu_image_resize_fallback", {
      original_size_bytes: Q,
      base64_size_bytes: J,
      error_type: Z
    }), {
      buffer: A,
      mediaType: Y
    };
    throw new S9A(`Unable to resize image (${Gd(Q)} raw, ${Gd(J)} base64). The image exceeds the 5MB API limit and compression failed. Please resize the image manually or use a smaller image.`)
  }
}
// @from(Ln 246223, Col 0)
async function $Z0(A) {
  if (A.source.type !== "base64") return {
    block: A
  };
  let Q = Buffer.from(A.source.data, "base64"),
    B = Q.length,
    Z = A.source.media_type?.split("/")[1] || "png",
    Y = await KKA(Q, B, Z);
  return {
    block: {
      type: "image",
      source: {
        type: "base64",
        media_type: `image/${Y.mediaType}`,
        data: Y.buffer.toString("base64")
      }
    },
    dimensions: Y.dimensions
  }
}
// @from(Ln 246243, Col 0)
async function x9A(A, Q = qP, B) {
  let G = B?.split("/")[1] || "jpeg",
    Z = G === "jpg" ? "jpeg" : G;
  try {
    let Y = await zZ0(),
      J = await Y(A).metadata(),
      X = J.format || Z,
      I = A.length,
      D = {
        imageBuffer: A,
        metadata: J,
        format: X,
        maxBytes: Q,
        originalSize: I
      };
    if (I <= Q) return bSA(A, X, I);
    let W = await Ps8(D, Y);
    if (W) return W;
    if (X === "png") {
      let V = await xs8(D, Y);
      if (V) return V
    }
    let K = await ys8(D, 50, Y);
    if (K) return K;
    return await vs8(D, Y)
  } catch (Y) {
    if (e(Y), l("tengu_image_compress_failed", {
        original_size_bytes: A.length,
        max_bytes: Q
      }), A.length <= Q) return {
      base64: A.toString("base64"),
      mediaType: `image/${Z}`,
      originalSize: A.length
    };
    throw new S9A(`Unable to compress image (${Gd(A.length)}) to fit within ${Gd(Q)}. Please use a smaller image.`)
  }
}
// @from(Ln 246280, Col 0)
async function LeB(A, Q, B) {
  let G = Math.floor(Q / 0.125),
    Z = Math.floor(G * 0.75);
  return x9A(A, Z, B)
}
// @from(Ln 246285, Col 0)
async function OeB(A, Q = qP) {
  if (A.source.type !== "base64") return A;
  let B = Buffer.from(A.source.data, "base64");
  if (B.length <= Q) return A;
  let G = await x9A(B, Q);
  return {
    type: "image",
    source: {
      type: "base64",
      media_type: G.mediaType,
      data: G.base64
    }
  }
}
// @from(Ln 246300, Col 0)
function bSA(A, Q, B) {
  let G = Q === "jpg" ? "jpeg" : Q;
  return {
    base64: A.toString("base64"),
    mediaType: `image/${G}`,
    originalSize: B
  }
}
// @from(Ln 246308, Col 0)
async function Ps8(A, Q) {
  let B = [1, 0.75, 0.5, 0.25];
  for (let G of B) {
    let Z = Math.round((A.metadata.width || 2000) * G),
      Y = Math.round((A.metadata.height || 2000) * G),
      J = Q(A.imageBuffer).resize(Z, Y, {
        fit: "inside",
        withoutEnlargement: !0
      });
    J = Ss8(J, A.format);
    let X = await J.toBuffer();
    if (X.length <= A.maxBytes) return bSA(X, A.format, A.originalSize)
  }
  return null
}
// @from(Ln 246324, Col 0)
function Ss8(A, Q) {
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
// @from(Ln 246344, Col 0)
async function xs8(A, Q) {
  let B = await Q(A.imageBuffer).resize(800, 800, {
    fit: "inside",
    withoutEnlargement: !0
  }).png({
    compressionLevel: 9,
    palette: !0,
    colors: 64
  }).toBuffer();
  if (B.length <= A.maxBytes) return bSA(B, "png", A.originalSize);
  return null
}
// @from(Ln 246356, Col 0)
async function ys8(A, Q, B) {
  let G = await B(A.imageBuffer).resize(600, 600, {
    fit: "inside",
    withoutEnlargement: !0
  }).jpeg({
    quality: Q
  }).toBuffer();
  if (G.length <= A.maxBytes) return bSA(G, "jpeg", A.originalSize);
  return null
}
// @from(Ln 246366, Col 0)
async function vs8(A, Q) {
  let B = await Q(A.imageBuffer).resize(400, 400, {
    fit: "inside",
    withoutEnlargement: !0
  }).jpeg({
    quality: 20
  }).toBuffer();
  return bSA(B, "jpeg", A.originalSize)
}
// @from(Ln 246376, Col 0)
function VKA(A, Q) {
  let {
    originalWidth: B,
    originalHeight: G,
    displayWidth: Z,
    displayHeight: Y
  } = A;
  if (!B || !G || !Z || !Y || Z <= 0 || Y <= 0) {
    if (Q) return `[Image source: ${Q}]`;
    return null
  }
  let J = B !== Z || G !== Y;
  if (!J && !Q) return null;
  let X = [];
  if (Q) X.push(`source: ${Q}`);
  if (J) {
    let I = B / Z;
    X.push(`original ${B}x${G}, displayed at ${Z}x${Y}. Multiply coordinates by ${I.toFixed(2)} to map to original image.`)
  }
  return `[Image: ${X.join(", ")}]`
}
// @from(Ln 246397, Col 4)
weB = 1
// @from(Ln 246398, Col 2)
_s8 = 2
// @from(Ln 246399, Col 2)
js8 = 3
// @from(Ln 246400, Col 2)
S9A
// @from(Ln 246401, Col 4)
Ib = w(() => {
  v1();
  T1();
  Z0();
  NeB();
  n01();
  S9A = class S9A extends Error {
    constructor(A) {
      super(A);
      this.name = "ImageResizeError"
    }
  }
})
// @from(Ln 246415, Col 0)
function ks8(A) {
  if (typeof A !== "object" || A === null) return !1;
  let Q = A;
  if (Q.type !== "image") return !1;
  if (typeof Q.source !== "object" || Q.source === null) return !1;
  let B = Q.source;
  return B.type === "base64" && typeof B.data === "string"
}
// @from(Ln 246424, Col 0)
function MeB(A) {
  let Q = [],
    B = 0;
  for (let G of A) {
    if (typeof G !== "object" || G === null) continue;
    let Z = G;
    if (Z.type !== "user") continue;
    let Y = Z.message;
    if (!Y) continue;
    let J = Y.content;
    if (typeof J === "string" || !Array.isArray(J)) continue;
    for (let X of J)
      if (ks8(X)) {
        B++;
        let I = X.source.data.length;
        if (I > YIA) l("tengu_image_api_validation_failed", {
          base64_size_bytes: I,
          max_bytes: YIA
        }), Q.push({
          index: B,
          size: I
        })
      }
  }
  if (Q.length > 0) throw new FKA(Q, YIA)
}
// @from(Ln 246450, Col 4)
FKA
// @from(Ln 246451, Col 4)
_51 = w(() => {
  Z0();
  n01();
  Ib();
  FKA = class FKA extends Error {
    constructor(A, Q) {
      let B, G = A[0];
      if (A.length === 1 && G) B = `Image base64 size (${Gd(G.size)}) exceeds API limit (${Gd(Q)}). Please resize the image before sending.`;
      else B = `${A.length} images exceed the API limit (${Gd(Q)}): ` + A.map((Z) => `Image ${Z.index}: ${Gd(Z.size)}`).join(", ") + ". Please resize these images before sending.";
      super(B);
      this.name = "ImageSizeError"
    }
  }
})
// @from(Ln 246466, Col 0)
function bs8() {
  return p2() ? "PDF too large. Try reading the file a different way (e.g., extract text with a CLI tool)." : "PDF too large. Please double press esc to edit your message and try again."
}
// @from(Ln 246470, Col 0)
function fs8() {
  return p2() ? "PDF is password protected. Try using a CLI tool to extract or convert the PDF." : "PDF is password protected. Please double press esc to edit your message and try again."
}
// @from(Ln 246474, Col 0)
function ReB() {
  return p2() ? "Image was too large. Try resizing the image or using a different approach." : "Image was too large. Double press esc to go back and try again with a smaller image."
}
// @from(Ln 246478, Col 0)
function hs8() {
  return p2() ? "Request too large. Try with a smaller file." : "Request too large. Double press esc to go back and try with a smaller file."
}
// @from(Ln 246482, Col 0)
function us8(A, Q, B) {
  try {
    let G = -1;
    for (let X = 0; X < B.length; X++) {
      let I = B[X];
      if (!I) continue;
      let D = I.message.content;
      if (Array.isArray(D)) {
        for (let W of D)
          if (W.type === "tool_use" && "id" in W && W.id === A) {
            G = X;
            break
          }
      }
      if (G !== -1) break
    }
    let Z = -1;
    for (let X = 0; X < Q.length; X++) {
      let I = Q[X];
      if (!I) continue;
      if (I.type === "assistant" && "message" in I) {
        let D = I.message.content;
        if (Array.isArray(D)) {
          for (let W of D)
            if (W.type === "tool_use" && "id" in W && W.id === A) {
              Z = X;
              break
            }
        }
      }
      if (Z !== -1) break
    }
    let Y = [];
    for (let X = G + 1; X < B.length; X++) {
      let I = B[X];
      if (!I) continue;
      let D = I.message.content;
      if (Array.isArray(D))
        for (let W of D) {
          let K = I.message.role;
          if (W.type === "tool_use" && "id" in W) Y.push(`${K}:tool_use:${W.id}`);
          else if (W.type === "tool_result" && "tool_use_id" in W) Y.push(`${K}:tool_result:${W.tool_use_id}`);
          else if (W.type === "text") Y.push(`${K}:text`);
          else if (W.type === "thinking") Y.push(`${K}:thinking`);
          else if (W.type === "image") Y.push(`${K}:image`);
          else Y.push(`${K}:${W.type}`)
        } else if (typeof D === "string") Y.push(`${I.message.role}:string_content`)
    }
    let J = [];
    for (let X = Z + 1; X < Q.length; X++) {
      let I = Q[X];
      if (!I) continue;
      switch (I.type) {
        case "user":
        case "assistant": {
          if ("message" in I) {
            let D = I.message.content;
            if (Array.isArray(D))
              for (let W of D) {
                let K = I.message.role;
                if (W.type === "tool_use" && "id" in W) J.push(`${K}:tool_use:${W.id}`);
                else if (W.type === "tool_result" && "tool_use_id" in W) J.push(`${K}:tool_result:${W.tool_use_id}`);
                else if (W.type === "text") J.push(`${K}:text`);
                else if (W.type === "thinking") J.push(`${K}:thinking`);
                else if (W.type === "image") J.push(`${K}:image`);
                else J.push(`${K}:${W.type}`)
              } else if (typeof D === "string") J.push(`${I.message.role}:string_content`)
          }
          break
        }
        case "attachment":
          if ("attachment" in I) J.push(`attachment:${I.attachment.type}`);
          break;
        case "system":
          if ("subtype" in I) J.push(`system:${I.subtype}`);
          break;
        case "progress":
          if ("progress" in I && I.progress && typeof I.progress === "object" && "type" in I.progress) J.push(`progress:${I.progress.type??"unknown"}`);
          else J.push("progress:unknown");
          break
      }
    }
    l("tengu_tool_use_tool_result_mismatch_error", {
      toolUseId: A,
      normalizedSequence: Y.join(", "),
      preNormalizedSequence: J.join(", "),
      normalizedMessageCount: B.length,
      originalMessageCount: Q.length,
      normalizedToolUseIndex: G,
      originalToolUseIndex: Z
    })
  } catch (G) {}
}
// @from(Ln 246576, Col 0)
function UZ0(A, Q, B) {
  if (A instanceof $k || A instanceof zC && A.message.toLowerCase().includes("timeout")) return DZ({
    content: x51,
    error: "unknown"
  });
  if (A instanceof FKA || A instanceof S9A) return DZ({
    content: ReB()
  });
  if (A instanceof Error && A.message.includes(y9A)) return DZ({
    content: y9A,
    error: "rate_limit"
  });
  if (A instanceof D9 && A.status === 429 && eWA(qB())) {
    let G = A.headers?.get?.("anthropic-ratelimit-unified-representative-claim"),
      Z = A.headers?.get?.("anthropic-ratelimit-unified-overage-status");
    if (G || Z) {
      let Y = {
          status: "rejected",
          unifiedRateLimitFallbackAvailable: !1,
          isUsingOverage: !1
        },
        J = A.headers?.get?.("anthropic-ratelimit-unified-reset");
      if (J) Y.resetsAt = Number(J);
      if (G) Y.rateLimitType = G;
      if (Z) Y.overageStatus = Z;
      let X = A.headers?.get?.("anthropic-ratelimit-unified-overage-reset");
      if (X) Y.overageResetsAt = Number(X);
      let I = A.headers?.get?.("anthropic-ratelimit-unified-overage-disabled-reason");
      if (I) Y.overageDisabledReason = I;
      let D = gG0(Y, Q);
      if (D) return DZ({
        content: D,
        error: "rate_limit"
      });
      return DZ({
        content: v9A,
        error: "rate_limit"
      })
    }
    return DZ({
      content: `${tW}: Rate limit reached`,
      error: "rate_limit"
    })
  }
  if (A instanceof Error && A.message.toLowerCase().includes("prompt is too long")) return DZ({
    content: Ar,
    error: "invalid_request"
  });
  if (A instanceof Error && /maximum of \d+ PDF pages/.test(A.message)) return DZ({
    content: bs8(),
    error: "invalid_request"
  });
  if (A instanceof Error && A.message.includes("The PDF specified is password protected")) return DZ({
    content: fs8(),
    error: "invalid_request"
  });
  if (A instanceof D9 && A.status === 400 && A.message.includes("image exceeds") && A.message.includes("maximum")) return DZ({
    content: ReB()
  });
  if (A instanceof D9 && A.status === 413) return DZ({
    content: hs8(),
    error: "invalid_request"
  });
  if (A instanceof D9 && A.status === 400 && A.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after")) {
    if (B?.messages && B?.messagesForAPI) {
      let G = A.message.match(/toolu_[a-zA-Z0-9]+/),
        Z = G ? G[0] : null;
      if (Z) us8(Z, B.messages, B.messagesForAPI)
    } {
      let Z = p2() ? "" : " Run /rewind to recover the conversation.";
      return DZ({
        content: "API Error: 400 due to tool use concurrency issues." + Z,
        error: "invalid_request"
      })
    }
  }
  if (A instanceof D9 && A.status === 400 && A.message.includes("unexpected `tool_use_id` found in `tool_result`")) l("tengu_unexpected_tool_result", {});
  if (qB() && A instanceof D9 && A.status === 400 && A.message.toLowerCase().includes("invalid model name") && (oJA(Q) || Q === "opus")) return DZ({
    content: "Claude Opus is not available with the Claude Pro plan. If you have updated your subscription plan recently, run /logout and /login for the plan to take effect.",
    error: "invalid_request"
  });
  if (A instanceof Error && A.message.includes("Your credit balance is too low")) return DZ({
    content: j51,
    error: "billing_error"
  });
  if (A instanceof Error && A.message.toLowerCase().includes("x-api-key")) {
    let {
      source: G
    } = Oz();
    return DZ({
      error: "authentication_failed",
      content: G === "ANTHROPIC_API_KEY" || G === "apiKeyHelper" ? P51 : T51
    })
  }
  if (A instanceof D9 && A.status === 403 && A.message.includes("OAuth token has been revoked")) return DZ({
    error: "authentication_failed",
    content: S51
  });
  if (A instanceof D9 && (A.status === 401 || A.status === 403) && A.message.includes("OAuth authentication is currently not allowed for this organization")) return DZ({
    error: "authentication_failed",
    content: gs8
  });
  if (A instanceof D9 && (A.status === 401 || A.status === 403)) return DZ({
    error: "authentication_failed",
    content: `${tW}: ${A.message} · Please run /login`
  });
  if (a1(process.env.CLAUDE_CODE_USE_BEDROCK) && A instanceof Error && A.message.toLowerCase().includes("model id")) return DZ({
    content: `${tW} (${Q}): ${A.message}`,
    error: "invalid_request"
  });
  if (A instanceof Error) return DZ({
    content: `${tW}: ${A.message}`,
    error: "unknown"
  });
  return DZ({
    content: tW,
    error: "unknown"
  })
}
// @from(Ln 246696, Col 0)
function _eB(A) {
  if (A instanceof Error && A.message === "Request was aborted.") return "aborted";
  if (A instanceof $k || A instanceof zC && A.message.toLowerCase().includes("timeout")) return "api_timeout";
  if (A instanceof Error && A.message.includes(CZ0)) return "repeated_529";
  if (A instanceof Error && A.message.includes(y9A)) return "capacity_off_switch";
  if (A instanceof D9 && A.status === 429) return "rate_limit";
  if (A instanceof D9 && (A.status === 529 || A.message?.includes('"type":"overloaded_error"'))) return "server_overload";
  if (A instanceof Error && A.message.toLowerCase().includes(Ar.toLowerCase())) return "prompt_too_long";
  if (A instanceof Error && /maximum of \d+ PDF pages/.test(A.message)) return "pdf_too_large";
  if (A instanceof Error && A.message.includes("The PDF specified is password protected")) return "pdf_password_protected";
  if (A instanceof D9 && A.status === 400 && A.message.includes("image exceeds") && A.message.includes("maximum")) return "image_too_large";
  if (A instanceof D9 && A.status === 400 && A.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after")) return "tool_use_mismatch";
  if (A instanceof D9 && A.status === 400 && A.message.includes("unexpected `tool_use_id` found in `tool_result`")) return "unexpected_tool_result";
  if (A instanceof D9 && A.status === 400 && A.message.toLowerCase().includes("invalid model name")) return "invalid_model";
  if (A instanceof Error && A.message.toLowerCase().includes(j51.toLowerCase())) return "credit_balance_low";
  if (A instanceof Error && A.message.toLowerCase().includes("x-api-key")) return "invalid_api_key";
  if (A instanceof D9 && A.status === 403 && A.message.includes("OAuth token has been revoked")) return "token_revoked";
  if (A instanceof D9 && (A.status === 401 || A.status === 403) && A.message.includes("OAuth authentication is currently not allowed for this organization")) return "oauth_org_not_allowed";
  if (A instanceof D9 && (A.status === 401 || A.status === 403)) return "auth_error";
  if (a1(process.env.CLAUDE_CODE_USE_BEDROCK) && A instanceof Error && A.message.toLowerCase().includes("model id")) return "bedrock_model_access";
  if (A instanceof D9) {
    let Q = A.status;
    if (Q >= 500) return "server_error";
    if (Q >= 400) return "client_error"
  }
  if (A instanceof zC) {
    if (RSA(A)?.isSSLError) return "ssl_cert_error";
    return "connection_error"
  }
  return "unknown"
}
// @from(Ln 246728, Col 0)
function jeB(A, Q) {
  if (A !== "refusal") return;
  l("tengu_refusal_api_response", {});
  let B = p2() ? `${tW}: Claude Code is unable to respond to this request, which appears to violate our Usage Policy (https://www.anthropic.com/legal/aup). Try rephrasing the request or attempting a different approach.` : `${tW}: Claude Code is unable to respond to this request, which appears to violate our Usage Policy (https://www.anthropic.com/legal/aup). Please double press esc to edit your last message or start a new session for Claude Code to assist with a different task.`;
  return DZ({
    content: B + (Q !== "claude-sonnet-4-20250514" ? " If you are seeing this refusal repeatedly, try running /model claude-sonnet-4-20250514 to switch models." : ""),
    error: "invalid_request"
  })
}
// @from(Ln 246737, Col 4)
tW = "API Error"
// @from(Ln 246738, Col 2)
Ar = "Prompt is too long"
// @from(Ln 246739, Col 2)
j51 = "Credit balance is too low"
// @from(Ln 246740, Col 2)
T51 = "Invalid API key · Please run /login"
// @from(Ln 246741, Col 2)
P51 = "Invalid API key · Fix external API key"
// @from(Ln 246742, Col 2)
JO = "(no content)"
// @from(Ln 246743, Col 2)
S51 = "OAuth token revoked · Please run /login"
// @from(Ln 246744, Col 2)
CZ0 = "Repeated 529 Overloaded errors"
// @from(Ln 246745, Col 2)
y9A = "Opus is experiencing high load, please use /model to switch to Sonnet"
// @from(Ln 246746, Col 2)
x51 = "Request timed out"
// @from(Ln 246747, Col 2)
gs8 = "Your account does not have access to Claude Code. Please run /login."
// @from(Ln 246748, Col 4)
XO = w(() => {
  vk();
  Q2();
  tQ();
  l2();
  Z0();
  IS();
  MSA();
  fQ();
  C0();
  _9A();
  _51();
  Ib()
})