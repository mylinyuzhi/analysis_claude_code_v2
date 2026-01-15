
// @from(Ln 35622, Col 2)
d84 = (A) => {
    let Q;
    return A && (typeof FormData === "function" && A instanceof FormData || ow(A.append) && ((Q = opA(A)) === "formdata" || Q === "object" && ow(A.toString) && A.toString() === "[object FormData]"))
  }
// @from(Ln 35626, Col 2)
c84
// @from(Ln 35626, Col 7)
p84
// @from(Ln 35626, Col 12)
l84
// @from(Ln 35626, Col 17)
i84
// @from(Ln 35626, Col 22)
n84
// @from(Ln 35626, Col 27)
a84 = (A) => A.trim ? A.trim() : A.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
// @from(Ln 35627, Col 2)
K1A
// @from(Ln 35627, Col 7)
s4Q = (A) => !MUA(A) && A !== K1A
// @from(Ln 35628, Col 2)
o84 = (A, Q, B, {
    allOwnKeys: G
  } = {}) => {
    return RUA(Q, (Z, Y) => {
      if (B && ow(Z)) A[Y] = OUA(Z, B);
      else A[Y] = Z
    }, {
      allOwnKeys: G
    }), A
  }
// @from(Ln 35638, Col 2)
r84 = (A) => {
    if (A.charCodeAt(0) === 65279) A = A.slice(1);
    return A
  }
// @from(Ln 35642, Col 2)
s84 = (A, Q, B, G) => {
    A.prototype = Object.create(Q.prototype, G), A.prototype.constructor = A, Object.defineProperty(A, "super", {
      value: Q.prototype
    }), B && Object.assign(A.prototype, B)
  }
// @from(Ln 35647, Col 2)
t84 = (A, Q, B, G) => {
    let Z, Y, J, X = {};
    if (Q = Q || {}, A == null) return Q;
    do {
      Z = Object.getOwnPropertyNames(A), Y = Z.length;
      while (Y-- > 0)
        if (J = Z[Y], (!G || G(J, A, Q)) && !X[J]) Q[J] = A[J], X[J] = !0;
      A = B !== !1 && YM1(A)
    } while (A && (!B || B(A, Q)) && A !== Object.prototype);
    return Q
  }
// @from(Ln 35658, Col 2)
e84 = (A, Q, B) => {
    if (A = String(A), B === void 0 || B > A.length) B = A.length;
    B -= Q.length;
    let G = A.indexOf(Q, B);
    return G !== -1 && G === B
  }
// @from(Ln 35664, Col 2)
A54 = (A) => {
    if (!A) return null;
    if (CGA(A)) return A;
    let Q = A.length;
    if (!o4Q(Q)) return null;
    let B = Array(Q);
    while (Q-- > 0) B[Q] = A[Q];
    return B
  }
// @from(Ln 35673, Col 2)
Q54
// @from(Ln 35673, Col 7)
B54 = (A, Q) => {
    let G = (A && A[Symbol.iterator]).call(A),
      Z;
    while ((Z = G.next()) && !Z.done) {
      let Y = Z.value;
      Q.call(A, Y[0], Y[1])
    }
  }
// @from(Ln 35681, Col 2)
G54 = (A, Q) => {
    let B, G = [];
    while ((B = A.exec(Q)) !== null) G.push(B);
    return G
  }
// @from(Ln 35686, Col 2)
Z54
// @from(Ln 35686, Col 7)
Y54 = (A) => {
    return A.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (B, G, Z) {
      return G.toUpperCase() + Z
    })
  }
// @from(Ln 35691, Col 2)
n4Q
// @from(Ln 35691, Col 7)
J54
// @from(Ln 35691, Col 12)
t4Q = (A, Q) => {
    let B = Object.getOwnPropertyDescriptors(A),
      G = {};
    RUA(B, (Z, Y) => {
      let J;
      if ((J = Q(Z, Y, A)) !== !1) G[Y] = J || Z
    }), Object.defineProperties(A, G)
  }
// @from(Ln 35699, Col 2)
X54 = (A) => {
    t4Q(A, (Q, B) => {
      if (ow(A) && ["arguments", "caller", "callee"].indexOf(B) !== -1) return !1;
      let G = A[B];
      if (!ow(G)) return;
      if (Q.enumerable = !1, "writable" in Q) {
        Q.writable = !1;
        return
      }
      if (!Q.set) Q.set = () => {
        throw Error("Can not rewrite read-only method '" + B + "'")
      }
    })
  }
// @from(Ln 35713, Col 2)
I54 = (A, Q) => {
    let B = {},
      G = (Z) => {
        Z.forEach((Y) => {
          B[Y] = !0
        })
      };
    return CGA(A) ? G(A) : G(String(A).split(Q)), B
  }
// @from(Ln 35722, Col 2)
D54 = () => {}
// @from(Ln 35723, Col 2)
W54 = (A, Q) => {
    return A != null && Number.isFinite(A = +A) ? A : Q
  }
// @from(Ln 35726, Col 2)
V54 = (A) => {
    let Q = [, , , , , , , , , , ],
      B = (G, Z) => {
        if (spA(G)) {
          if (Q.indexOf(G) >= 0) return;
          if (!("toJSON" in G)) {
            Q[Z] = G;
            let Y = CGA(G) ? [] : {};
            return RUA(G, (J, X) => {
              let I = B(J, Z + 1);
              !MUA(I) && (Y[X] = I)
            }), Q[Z] = void 0, Y
          }
        }
        return G
      };
    return B(A, 0)
  }
// @from(Ln 35744, Col 2)
F54
// @from(Ln 35744, Col 7)
H54 = (A) => A && (spA(A) || ow(A)) && ow(A.then) && ow(A.catch)
// @from(Ln 35745, Col 2)
e4Q
// @from(Ln 35745, Col 7)
E54
// @from(Ln 35745, Col 12)
d1
// @from(Ln 35746, Col 4)
aZ = w(() => {
  ({
    toString: x84
  } = Object.prototype), {
    getPrototypeOf: YM1
  } = Object, opA = ((A) => (Q) => {
    let B = x84.call(Q);
    return A[B] || (A[B] = B.slice(8, -1).toLowerCase())
  })(Object.create(null)), {
    isArray: CGA
  } = Array, MUA = rpA("undefined");
  a4Q = UT("ArrayBuffer");
  k84 = rpA("string"), ow = rpA("function"), o4Q = rpA("number"), f84 = UT("Date"), h84 = UT("File"), g84 = UT("Blob"), u84 = UT("FileList"), c84 = UT("URLSearchParams"), [p84, l84, i84, n84] = ["ReadableStream", "Request", "Response", "Headers"].map(UT);
  K1A = (() => {
    if (typeof globalThis < "u") return globalThis;
    return typeof self < "u" ? self : typeof window < "u" ? window : global
  })();
  Q54 = ((A) => {
    return (Q) => {
      return A && Q instanceof A
    }
  })(typeof Uint8Array < "u" && YM1(Uint8Array)), Z54 = UT("HTMLFormElement"), n4Q = (({
    hasOwnProperty: A
  }) => (Q, B) => A.call(Q, B))(Object.prototype), J54 = UT("RegExp");
  F54 = UT("AsyncFunction"), e4Q = ((A, Q) => {
    if (A) return setImmediate;
    return Q ? ((B, G) => {
      return K1A.addEventListener("message", ({
        source: Z,
        data: Y
      }) => {
        if (Z === K1A && Y === B) G.length && G.shift()()
      }, !1), (Z) => {
        G.push(Z), K1A.postMessage(B, "*")
      }
    })(`axios@${Math.random()}`, []) : (B) => setTimeout(B)
  })(typeof setImmediate === "function", ow(K1A.postMessage)), E54 = typeof queueMicrotask < "u" ? queueMicrotask.bind(K1A) : typeof process < "u" && process.nextTick || e4Q, d1 = {
    isArray: CGA,
    isArrayBuffer: a4Q,
    isBuffer: y84,
    isFormData: d84,
    isArrayBufferView: v84,
    isString: k84,
    isNumber: o4Q,
    isBoolean: b84,
    isObject: spA,
    isPlainObject: apA,
    isReadableStream: p84,
    isRequest: l84,
    isResponse: i84,
    isHeaders: n84,
    isUndefined: MUA,
    isDate: f84,
    isFile: h84,
    isBlob: g84,
    isRegExp: J54,
    isFunction: ow,
    isStream: m84,
    isURLSearchParams: c84,
    isTypedArray: Q54,
    isFileList: u84,
    forEach: RUA,
    merge: ZM1,
    extend: o84,
    trim: a84,
    stripBOM: r84,
    inherits: s84,
    toFlatObject: t84,
    kindOf: opA,
    kindOfTest: UT,
    endsWith: e84,
    toArray: A54,
    forEachEntry: B54,
    matchAll: G54,
    isHTMLForm: Z54,
    hasOwnProperty: n4Q,
    hasOwnProp: n4Q,
    reduceDescriptors: t4Q,
    freezeMethods: X54,
    toObjectSet: I54,
    toCamelCase: Y54,
    noop: D54,
    toFiniteNumber: W54,
    findKey: r4Q,
    global: K1A,
    isContextDefined: s4Q,
    isSpecCompliantForm: K54,
    toJSONObject: V54,
    isAsyncFn: F54,
    isThenable: H54,
    setImmediate: e4Q,
    asap: E54
  }
})
// @from(Ln 35841, Col 0)
function UGA(A, Q, B, G, Z) {
  if (Error.call(this), Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  else this.stack = Error().stack;
  if (this.message = A, this.name = "AxiosError", Q && (this.code = Q), B && (this.config = B), G && (this.request = G), Z) this.response = Z, this.status = Z.status ? Z.status : null
}
// @from(Ln 35846, Col 4)
A6Q
// @from(Ln 35846, Col 9)
Q6Q
// @from(Ln 35846, Col 14)
F2
// @from(Ln 35847, Col 4)
rw = w(() => {
  aZ();
  d1.inherits(UGA, Error, {
    toJSON: function () {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: d1.toJSONObject(this.config),
        code: this.code,
        status: this.status
      }
    }
  });
  A6Q = UGA.prototype, Q6Q = {};
  ["ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION", "ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK", "ERR_FR_TOO_MANY_REDIRECTS", "ERR_DEPRECATED", "ERR_BAD_RESPONSE", "ERR_BAD_REQUEST", "ERR_CANCELED", "ERR_NOT_SUPPORT", "ERR_INVALID_URL"].forEach((A) => {
    Q6Q[A] = {
      value: A
    }
  });
  Object.defineProperties(UGA, Q6Q);
  Object.defineProperty(A6Q, "isAxiosError", {
    value: !0
  });
  UGA.from = (A, Q, B, G, Z, Y) => {
    let J = Object.create(A6Q);
    return d1.toFlatObject(A, J, function (I) {
      return I !== Error.prototype
    }, (X) => {
      return X !== "isAxiosError"
    }), UGA.call(J, A.message, Q, B, G, Z), J.cause = A, J.name = A.name, Y && Object.assign(J, Y), J
  };
  F2 = UGA
})
// @from(Ln 35886, Col 4)
Z6Q = U((Ie7, G6Q) => {
  var B6Q = NA("stream").Stream,
    z54 = NA("util");
  G6Q.exports = qT;

  function qT() {
    this.source = null, this.dataSize = 0, this.maxDataSize = 1048576, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = []
  }
  z54.inherits(qT, B6Q);
  qT.create = function (A, Q) {
    var B = new this;
    Q = Q || {};
    for (var G in Q) B[G] = Q[G];
    B.source = A;
    var Z = A.emit;
    if (A.emit = function () {
        return B._handleEmit(arguments), Z.apply(A, arguments)
      }, A.on("error", function () {}), B.pauseStream) A.pause();
    return B
  };
  Object.defineProperty(qT.prototype, "readable", {
    configurable: !0,
    enumerable: !0,
    get: function () {
      return this.source.readable
    }
  });
  qT.prototype.setEncoding = function () {
    return this.source.setEncoding.apply(this.source, arguments)
  };
  qT.prototype.resume = function () {
    if (!this._released) this.release();
    this.source.resume()
  };
  qT.prototype.pause = function () {
    this.source.pause()
  };
  qT.prototype.release = function () {
    this._released = !0, this._bufferedEvents.forEach(function (A) {
      this.emit.apply(this, A)
    }.bind(this)), this._bufferedEvents = []
  };
  qT.prototype.pipe = function () {
    var A = B6Q.prototype.pipe.apply(this, arguments);
    return this.resume(), A
  };
  qT.prototype._handleEmit = function (A) {
    if (this._released) {
      this.emit.apply(this, A);
      return
    }
    if (A[0] === "data") this.dataSize += A[1].length, this._checkIfMaxDataSizeExceeded();
    this._bufferedEvents.push(A)
  };
  qT.prototype._checkIfMaxDataSizeExceeded = function () {
    if (this._maxDataSizeExceeded) return;
    if (this.dataSize <= this.maxDataSize) return;
    this._maxDataSizeExceeded = !0;
    var A = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this.emit("error", Error(A))
  }
})
// @from(Ln 35948, Col 4)
I6Q = U((De7, X6Q) => {
  var $54 = NA("util"),
    J6Q = NA("stream").Stream,
    Y6Q = Z6Q();
  X6Q.exports = yI;

  function yI() {
    this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2097152, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1
  }
  $54.inherits(yI, J6Q);
  yI.create = function (A) {
    var Q = new this;
    A = A || {};
    for (var B in A) Q[B] = A[B];
    return Q
  };
  yI.isStreamLike = function (A) {
    return typeof A !== "function" && typeof A !== "string" && typeof A !== "boolean" && typeof A !== "number" && !Buffer.isBuffer(A)
  };
  yI.prototype.append = function (A) {
    var Q = yI.isStreamLike(A);
    if (Q) {
      if (!(A instanceof Y6Q)) {
        var B = Y6Q.create(A, {
          maxDataSize: 1 / 0,
          pauseStream: this.pauseStreams
        });
        A.on("data", this._checkDataSize.bind(this)), A = B
      }
      if (this._handleErrors(A), this.pauseStreams) A.pause()
    }
    return this._streams.push(A), this
  };
  yI.prototype.pipe = function (A, Q) {
    return J6Q.prototype.pipe.call(this, A, Q), this.resume(), A
  };
  yI.prototype._getNext = function () {
    if (this._currentStream = null, this._insideLoop) {
      this._pendingNext = !0;
      return
    }
    this._insideLoop = !0;
    try {
      do this._pendingNext = !1, this._realGetNext(); while (this._pendingNext)
    } finally {
      this._insideLoop = !1
    }
  };
  yI.prototype._realGetNext = function () {
    var A = this._streams.shift();
    if (typeof A > "u") {
      this.end();
      return
    }
    if (typeof A !== "function") {
      this._pipeNext(A);
      return
    }
    var Q = A;
    Q(function (B) {
      var G = yI.isStreamLike(B);
      if (G) B.on("data", this._checkDataSize.bind(this)), this._handleErrors(B);
      this._pipeNext(B)
    }.bind(this))
  };
  yI.prototype._pipeNext = function (A) {
    this._currentStream = A;
    var Q = yI.isStreamLike(A);
    if (Q) {
      A.on("end", this._getNext.bind(this)), A.pipe(this, {
        end: !1
      });
      return
    }
    var B = A;
    this.write(B), this._getNext()
  };
  yI.prototype._handleErrors = function (A) {
    var Q = this;
    A.on("error", function (B) {
      Q._emitError(B)
    })
  };
  yI.prototype.write = function (A) {
    this.emit("data", A)
  };
  yI.prototype.pause = function () {
    if (!this.pauseStreams) return;
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
    this.emit("pause")
  };
  yI.prototype.resume = function () {
    if (!this._released) this._released = !0, this.writable = !0, this._getNext();
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
    this.emit("resume")
  };
  yI.prototype.end = function () {
    this._reset(), this.emit("end")
  };
  yI.prototype.destroy = function () {
    this._reset(), this.emit("close")
  };
  yI.prototype._reset = function () {
    this.writable = !1, this._streams = [], this._currentStream = null
  };
  yI.prototype._checkDataSize = function () {
    if (this._updateDataSize(), this.dataSize <= this.maxDataSize) return;
    var A = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this._emitError(Error(A))
  };
  yI.prototype._updateDataSize = function () {
    this.dataSize = 0;
    var A = this;
    if (this._streams.forEach(function (Q) {
        if (!Q.dataSize) return;
        A.dataSize += Q.dataSize
      }), this._currentStream && this._currentStream.dataSize) this.dataSize += this._currentStream.dataSize
  };
  yI.prototype._emitError = function (A) {
    this._reset(), this.emit("error", A)
  }
})