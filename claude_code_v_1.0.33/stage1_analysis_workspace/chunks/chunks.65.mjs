
// @from(Start 5876575, End 5879956)
vzB = z((Tc7, xzB) => {
  var {
    kForOnEventAttribute: bUA,
    kListener: Kg1
  } = tb(), TzB = Symbol("kCode"), PzB = Symbol("kData"), jzB = Symbol("kError"), SzB = Symbol("kMessage"), _zB = Symbol("kReason"), M7A = Symbol("kTarget"), kzB = Symbol("kType"), yzB = Symbol("kWasClean");
  class tc {
    constructor(A) {
      this[M7A] = null, this[kzB] = A
    }
    get target() {
      return this[M7A]
    }
    get type() {
      return this[kzB]
    }
  }
  Object.defineProperty(tc.prototype, "target", {
    enumerable: !0
  });
  Object.defineProperty(tc.prototype, "type", {
    enumerable: !0
  });
  class O7A extends tc {
    constructor(A, Q = {}) {
      super(A);
      this[TzB] = Q.code === void 0 ? 0 : Q.code, this[_zB] = Q.reason === void 0 ? "" : Q.reason, this[yzB] = Q.wasClean === void 0 ? !1 : Q.wasClean
    }
    get code() {
      return this[TzB]
    }
    get reason() {
      return this[_zB]
    }
    get wasClean() {
      return this[yzB]
    }
  }
  Object.defineProperty(O7A.prototype, "code", {
    enumerable: !0
  });
  Object.defineProperty(O7A.prototype, "reason", {
    enumerable: !0
  });
  Object.defineProperty(O7A.prototype, "wasClean", {
    enumerable: !0
  });
  class fUA extends tc {
    constructor(A, Q = {}) {
      super(A);
      this[jzB] = Q.error === void 0 ? null : Q.error, this[SzB] = Q.message === void 0 ? "" : Q.message
    }
    get error() {
      return this[jzB]
    }
    get message() {
      return this[SzB]
    }
  }
  Object.defineProperty(fUA.prototype, "error", {
    enumerable: !0
  });
  Object.defineProperty(fUA.prototype, "message", {
    enumerable: !0
  });
  class LaA extends tc {
    constructor(A, Q = {}) {
      super(A);
      this[PzB] = Q.data === void 0 ? null : Q.data
    }
    get data() {
      return this[PzB]
    }
  }
  Object.defineProperty(LaA.prototype, "data", {
    enumerable: !0
  });
  var gW6 = {
    addEventListener(A, Q, B = {}) {
      for (let Z of this.listeners(A))
        if (!B[bUA] && Z[Kg1] === Q && !Z[bUA]) return;
      let G;
      if (A === "message") G = function(I, Y) {
        let J = new LaA("message", {
          data: Y ? I : I.toString()
        });
        J[M7A] = this, NaA(Q, this, J)
      };
      else if (A === "close") G = function(I, Y) {
        let J = new O7A("close", {
          code: I,
          reason: Y.toString(),
          wasClean: this._closeFrameReceived && this._closeFrameSent
        });
        J[M7A] = this, NaA(Q, this, J)
      };
      else if (A === "error") G = function(I) {
        let Y = new fUA("error", {
          error: I,
          message: I.message
        });
        Y[M7A] = this, NaA(Q, this, Y)
      };
      else if (A === "open") G = function() {
        let I = new tc("open");
        I[M7A] = this, NaA(Q, this, I)
      };
      else return;
      if (G[bUA] = !!B[bUA], G[Kg1] = Q, B.once) this.once(A, G);
      else this.on(A, G)
    },
    removeEventListener(A, Q) {
      for (let B of this.listeners(A))
        if (B[Kg1] === Q && !B[bUA]) {
          this.removeListener(A, B);
          break
        }
    }
  };
  xzB.exports = {
    CloseEvent: O7A,
    ErrorEvent: fUA,
    Event: tc,
    EventTarget: gW6,
    MessageEvent: LaA
  };

  function NaA(A, Q, B) {
    if (typeof A === "object" && A.handleEvent) A.handleEvent.call(A, B);
    else A.call(Q, B)
  }
})
// @from(Start 5879962, End 5883241)
Dg1 = z((Pc7, bzB) => {
  var {
    tokenChars: hUA
  } = q7A();

  function S_(A, Q, B) {
    if (A[Q] === void 0) A[Q] = [B];
    else A[Q].push(B)
  }

  function uW6(A) {
    let Q = Object.create(null),
      B = Object.create(null),
      G = !1,
      Z = !1,
      I = !1,
      Y, J, W = -1,
      X = -1,
      V = -1,
      F = 0;
    for (; F < A.length; F++)
      if (X = A.charCodeAt(F), Y === void 0)
        if (V === -1 && hUA[X] === 1) {
          if (W === -1) W = F
        } else if (F !== 0 && (X === 32 || X === 9)) {
      if (V === -1 && W !== -1) V = F
    } else if (X === 59 || X === 44) {
      if (W === -1) throw SyntaxError(`Unexpected character at index ${F}`);
      if (V === -1) V = F;
      let D = A.slice(W, V);
      if (X === 44) S_(Q, D, B), B = Object.create(null);
      else Y = D;
      W = V = -1
    } else throw SyntaxError(`Unexpected character at index ${F}`);
    else if (J === void 0)
      if (V === -1 && hUA[X] === 1) {
        if (W === -1) W = F
      } else if (X === 32 || X === 9) {
      if (V === -1 && W !== -1) V = F
    } else if (X === 59 || X === 44) {
      if (W === -1) throw SyntaxError(`Unexpected character at index ${F}`);
      if (V === -1) V = F;
      if (S_(B, A.slice(W, V), !0), X === 44) S_(Q, Y, B), B = Object.create(null), Y = void 0;
      W = V = -1
    } else if (X === 61 && W !== -1 && V === -1) J = A.slice(W, F), W = V = -1;
    else throw SyntaxError(`Unexpected character at index ${F}`);
    else if (Z) {
      if (hUA[X] !== 1) throw SyntaxError(`Unexpected character at index ${F}`);
      if (W === -1) W = F;
      else if (!G) G = !0;
      Z = !1
    } else if (I)
      if (hUA[X] === 1) {
        if (W === -1) W = F
      } else if (X === 34 && W !== -1) I = !1, V = F;
    else if (X === 92) Z = !0;
    else throw SyntaxError(`Unexpected character at index ${F}`);
    else if (X === 34 && A.charCodeAt(F - 1) === 61) I = !0;
    else if (V === -1 && hUA[X] === 1) {
      if (W === -1) W = F
    } else if (W !== -1 && (X === 32 || X === 9)) {
      if (V === -1) V = F
    } else if (X === 59 || X === 44) {
      if (W === -1) throw SyntaxError(`Unexpected character at index ${F}`);
      if (V === -1) V = F;
      let D = A.slice(W, V);
      if (G) D = D.replace(/\\/g, ""), G = !1;
      if (S_(B, J, D), X === 44) S_(Q, Y, B), B = Object.create(null), Y = void 0;
      J = void 0, W = V = -1
    } else throw SyntaxError(`Unexpected character at index ${F}`);
    if (W === -1 || I || X === 32 || X === 9) throw SyntaxError("Unexpected end of input");
    if (V === -1) V = F;
    let K = A.slice(W, V);
    if (Y === void 0) S_(Q, K, B);
    else {
      if (J === void 0) S_(B, K, !0);
      else if (G) S_(B, J, K.replace(/\\/g, ""));
      else S_(B, J, K);
      S_(Q, Y, B)
    }
    return Q
  }

  function mW6(A) {
    return Object.keys(A).map((Q) => {
      let B = A[Q];
      if (!Array.isArray(B)) B = [B];
      return B.map((G) => {
        return [Q].concat(Object.keys(G).map((Z) => {
          let I = G[Z];
          if (!Array.isArray(I)) I = [I];
          return I.map((Y) => Y === !0 ? Z : `${Z}=${Y}`).join("; ")
        })).join("; ")
      }).join(", ")
    }).join(", ")
  }
  bzB.exports = {
    format: mW6,
    parse: uW6
  }
})
// @from(Start 5883247, End 5901575)
TaA = z((_c7, azB) => {
  var dW6 = UA("events"),
    cW6 = UA("https"),
    pW6 = UA("http"),
    gzB = UA("net"),
    lW6 = UA("tls"),
    {
      randomBytes: iW6,
      createHash: nW6
    } = UA("crypto"),
    {
      Duplex: jc7,
      Readable: Sc7
    } = UA("stream"),
    {
      URL: Hg1
    } = UA("url"),
    ec = vUA(),
    aW6 = Xg1(),
    sW6 = Fg1(),
    {
      isBlob: rW6
    } = q7A(),
    {
      BINARY_TYPES: fzB,
      EMPTY_BUFFER: MaA,
      GUID: oW6,
      kForOnEventAttribute: Cg1,
      kListener: tW6,
      kStatusCode: eW6,
      kWebSocket: xF,
      NOOP: uzB
    } = tb(),
    {
      EventTarget: {
        addEventListener: AX6,
        removeEventListener: QX6
      }
    } = vzB(),
    {
      format: BX6,
      parse: GX6
    } = Dg1(),
    {
      toBuffer: ZX6
    } = yUA(),
    mzB = Symbol("kAborted"),
    Eg1 = [8, 13],
    Af = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"],
    IX6 = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
  class D8 extends dW6 {
    constructor(A, Q, B) {
      super();
      if (this._binaryType = fzB[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = MaA, this._closeTimer = null, this._errorEmitted = !1, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = D8.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, A !== null) {
        if (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, Q === void 0) Q = [];
        else if (!Array.isArray(Q))
          if (typeof Q === "object" && Q !== null) B = Q, Q = [];
          else Q = [Q];
        dzB(this, A, Q, B)
      } else this._autoPong = B.autoPong, this._isServer = !0
    }
    get binaryType() {
      return this._binaryType
    }
    set binaryType(A) {
      if (!fzB.includes(A)) return;
      if (this._binaryType = A, this._receiver) this._receiver._binaryType = A
    }
    get bufferedAmount() {
      if (!this._socket) return this._bufferedAmount;
      return this._socket._writableState.length + this._sender._bufferedBytes
    }
    get extensions() {
      return Object.keys(this._extensions).join()
    }
    get isPaused() {
      return this._paused
    }
    get onclose() {
      return null
    }
    get onerror() {
      return null
    }
    get onopen() {
      return null
    }
    get onmessage() {
      return null
    }
    get protocol() {
      return this._protocol
    }
    get readyState() {
      return this._readyState
    }
    get url() {
      return this._url
    }
    setSocket(A, Q, B) {
      let G = new aW6({
          allowSynchronousEvents: B.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: B.maxPayload,
          skipUTF8Validation: B.skipUTF8Validation
        }),
        Z = new sW6(A, this._extensions, B.generateMask);
      if (this._receiver = G, this._sender = Z, this._socket = A, G[xF] = this, Z[xF] = this, A[xF] = this, G.on("conclude", WX6), G.on("drain", XX6), G.on("error", VX6), G.on("message", FX6), G.on("ping", KX6), G.on("pong", DX6), Z.onerror = HX6, A.setTimeout) A.setTimeout(0);
      if (A.setNoDelay) A.setNoDelay();
      if (Q.length > 0) A.unshift(Q);
      A.on("close", lzB), A.on("data", RaA), A.on("end", izB), A.on("error", nzB), this._readyState = D8.OPEN, this.emit("open")
    }
    emitClose() {
      if (!this._socket) {
        this._readyState = D8.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
        return
      }
      if (this._extensions[ec.extensionName]) this._extensions[ec.extensionName].cleanup();
      this._receiver.removeAllListeners(), this._readyState = D8.CLOSED, this.emit("close", this._closeCode, this._closeMessage)
    }
    close(A, Q) {
      if (this.readyState === D8.CLOSED) return;
      if (this.readyState === D8.CONNECTING) {
        tw(this, this._req, "WebSocket was closed before the connection was established");
        return
      }
      if (this.readyState === D8.CLOSING) {
        if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
        return
      }
      this._readyState = D8.CLOSING, this._sender.close(A, Q, !this._isServer, (B) => {
        if (B) return;
        if (this._closeFrameSent = !0, this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end()
      }), pzB(this)
    }
    pause() {
      if (this.readyState === D8.CONNECTING || this.readyState === D8.CLOSED) return;
      this._paused = !0, this._socket.pause()
    }
    ping(A, Q, B) {
      if (this.readyState === D8.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof A === "function") B = A, A = Q = void 0;
      else if (typeof Q === "function") B = Q, Q = void 0;
      if (typeof A === "number") A = A.toString();
      if (this.readyState !== D8.OPEN) {
        zg1(this, A, B);
        return
      }
      if (Q === void 0) Q = !this._isServer;
      this._sender.ping(A || MaA, Q, B)
    }
    pong(A, Q, B) {
      if (this.readyState === D8.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof A === "function") B = A, A = Q = void 0;
      else if (typeof Q === "function") B = Q, Q = void 0;
      if (typeof A === "number") A = A.toString();
      if (this.readyState !== D8.OPEN) {
        zg1(this, A, B);
        return
      }
      if (Q === void 0) Q = !this._isServer;
      this._sender.pong(A || MaA, Q, B)
    }
    resume() {
      if (this.readyState === D8.CONNECTING || this.readyState === D8.CLOSED) return;
      if (this._paused = !1, !this._receiver._writableState.needDrain) this._socket.resume()
    }
    send(A, Q, B) {
      if (this.readyState === D8.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof Q === "function") B = Q, Q = {};
      if (typeof A === "number") A = A.toString();
      if (this.readyState !== D8.OPEN) {
        zg1(this, A, B);
        return
      }
      let G = {
        binary: typeof A !== "string",
        mask: !this._isServer,
        compress: !0,
        fin: !0,
        ...Q
      };
      if (!this._extensions[ec.extensionName]) G.compress = !1;
      this._sender.send(A || MaA, G, B)
    }
    terminate() {
      if (this.readyState === D8.CLOSED) return;
      if (this.readyState === D8.CONNECTING) {
        tw(this, this._req, "WebSocket was closed before the connection was established");
        return
      }
      if (this._socket) this._readyState = D8.CLOSING, this._socket.destroy()
    }
  }
  Object.defineProperty(D8, "CONNECTING", {
    enumerable: !0,
    value: Af.indexOf("CONNECTING")
  });
  Object.defineProperty(D8.prototype, "CONNECTING", {
    enumerable: !0,
    value: Af.indexOf("CONNECTING")
  });
  Object.defineProperty(D8, "OPEN", {
    enumerable: !0,
    value: Af.indexOf("OPEN")
  });
  Object.defineProperty(D8.prototype, "OPEN", {
    enumerable: !0,
    value: Af.indexOf("OPEN")
  });
  Object.defineProperty(D8, "CLOSING", {
    enumerable: !0,
    value: Af.indexOf("CLOSING")
  });
  Object.defineProperty(D8.prototype, "CLOSING", {
    enumerable: !0,
    value: Af.indexOf("CLOSING")
  });
  Object.defineProperty(D8, "CLOSED", {
    enumerable: !0,
    value: Af.indexOf("CLOSED")
  });
  Object.defineProperty(D8.prototype, "CLOSED", {
    enumerable: !0,
    value: Af.indexOf("CLOSED")
  });
  ["binaryType", "bufferedAmount", "extensions", "isPaused", "protocol", "readyState", "url"].forEach((A) => {
    Object.defineProperty(D8.prototype, A, {
      enumerable: !0
    })
  });
  ["open", "error", "close", "message"].forEach((A) => {
    Object.defineProperty(D8.prototype, `on${A}`, {
      enumerable: !0,
      get() {
        for (let Q of this.listeners(A))
          if (Q[Cg1]) return Q[tW6];
        return null
      },
      set(Q) {
        for (let B of this.listeners(A))
          if (B[Cg1]) {
            this.removeListener(A, B);
            break
          } if (typeof Q !== "function") return;
        this.addEventListener(A, Q, {
          [Cg1]: !0
        })
      }
    })
  });
  D8.prototype.addEventListener = AX6;
  D8.prototype.removeEventListener = QX6;
  azB.exports = D8;

  function dzB(A, Q, B, G) {
    let Z = {
      allowSynchronousEvents: !0,
      autoPong: !0,
      protocolVersion: Eg1[1],
      maxPayload: 104857600,
      skipUTF8Validation: !1,
      perMessageDeflate: !0,
      followRedirects: !1,
      maxRedirects: 10,
      ...G,
      socketPath: void 0,
      hostname: void 0,
      protocol: void 0,
      timeout: void 0,
      method: "GET",
      host: void 0,
      path: void 0,
      port: void 0
    };
    if (A._autoPong = Z.autoPong, !Eg1.includes(Z.protocolVersion)) throw RangeError(`Unsupported protocol version: ${Z.protocolVersion} (supported versions: ${Eg1.join(", ")})`);
    let I;
    if (Q instanceof Hg1) I = Q;
    else try {
      I = new Hg1(Q)
    } catch (C) {
      throw SyntaxError(`Invalid URL: ${Q}`)
    }
    if (I.protocol === "http:") I.protocol = "ws:";
    else if (I.protocol === "https:") I.protocol = "wss:";
    A._url = I.href;
    let Y = I.protocol === "wss:",
      J = I.protocol === "ws+unix:",
      W;
    if (I.protocol !== "ws:" && !Y && !J) W = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
    else if (J && !I.pathname) W = "The URL's pathname is empty";
    else if (I.hash) W = "The URL contains a fragment identifier";
    if (W) {
      let C = SyntaxError(W);
      if (A._redirects === 0) throw C;
      else {
        OaA(A, C);
        return
      }
    }
    let X = Y ? 443 : 80,
      V = iW6(16).toString("base64"),
      F = Y ? cW6.request : pW6.request,
      K = new Set,
      D;
    if (Z.createConnection = Z.createConnection || (Y ? JX6 : YX6), Z.defaultPort = Z.defaultPort || X, Z.port = I.port || X, Z.host = I.hostname.startsWith("[") ? I.hostname.slice(1, -1) : I.hostname, Z.headers = {
        ...Z.headers,
        "Sec-WebSocket-Version": Z.protocolVersion,
        "Sec-WebSocket-Key": V,
        Connection: "Upgrade",
        Upgrade: "websocket"
      }, Z.path = I.pathname + I.search, Z.timeout = Z.handshakeTimeout, Z.perMessageDeflate) D = new ec(Z.perMessageDeflate !== !0 ? Z.perMessageDeflate : {}, !1, Z.maxPayload), Z.headers["Sec-WebSocket-Extensions"] = BX6({
      [ec.extensionName]: D.offer()
    });
    if (B.length) {
      for (let C of B) {
        if (typeof C !== "string" || !IX6.test(C) || K.has(C)) throw SyntaxError("An invalid or duplicated subprotocol was specified");
        K.add(C)
      }
      Z.headers["Sec-WebSocket-Protocol"] = B.join(",")
    }
    if (Z.origin)
      if (Z.protocolVersion < 13) Z.headers["Sec-WebSocket-Origin"] = Z.origin;
      else Z.headers.Origin = Z.origin;
    if (I.username || I.password) Z.auth = `${I.username}:${I.password}`;
    if (J) {
      let C = Z.path.split(":");
      Z.socketPath = C[0], Z.path = C[1]
    }
    let H;
    if (Z.followRedirects) {
      if (A._redirects === 0) {
        A._originalIpc = J, A._originalSecure = Y, A._originalHostOrSocketPath = J ? Z.socketPath : I.host;
        let C = G && G.headers;
        if (G = {
            ...G,
            headers: {}
          }, C)
          for (let [E, U] of Object.entries(C)) G.headers[E.toLowerCase()] = U
      } else if (A.listenerCount("redirect") === 0) {
        let C = J ? A._originalIpc ? Z.socketPath === A._originalHostOrSocketPath : !1 : A._originalIpc ? !1 : I.host === A._originalHostOrSocketPath;
        if (!C || A._originalSecure && !Y) {
          if (delete Z.headers.authorization, delete Z.headers.cookie, !C) delete Z.headers.host;
          Z.auth = void 0
        }
      }
      if (Z.auth && !G.headers.authorization) G.headers.authorization = "Basic " + Buffer.from(Z.auth).toString("base64");
      if (H = A._req = F(Z), A._redirects) A.emit("redirect", A.url, H)
    } else H = A._req = F(Z);
    if (Z.timeout) H.on("timeout", () => {
      tw(A, H, "Opening handshake has timed out")
    });
    if (H.on("error", (C) => {
        if (H === null || H[mzB]) return;
        H = A._req = null, OaA(A, C)
      }), H.on("response", (C) => {
        let E = C.headers.location,
          U = C.statusCode;
        if (E && Z.followRedirects && U >= 300 && U < 400) {
          if (++A._redirects > Z.maxRedirects) {
            tw(A, H, "Maximum redirects exceeded");
            return
          }
          H.abort();
          let q;
          try {
            q = new Hg1(E, Q)
          } catch (w) {
            let N = SyntaxError(`Invalid URL: ${E}`);
            OaA(A, N);
            return
          }
          dzB(A, q, B, G)
        } else if (!A.emit("unexpected-response", H, C)) tw(A, H, `Unexpected server response: ${C.statusCode}`)
      }), H.on("upgrade", (C, E, U) => {
        if (A.emit("upgrade", C), A.readyState !== D8.CONNECTING) return;
        H = A._req = null;
        let q = C.headers.upgrade;
        if (q === void 0 || q.toLowerCase() !== "websocket") {
          tw(A, E, "Invalid Upgrade header");
          return
        }
        let w = nW6("sha1").update(V + oW6).digest("base64");
        if (C.headers["sec-websocket-accept"] !== w) {
          tw(A, E, "Invalid Sec-WebSocket-Accept header");
          return
        }
        let N = C.headers["sec-websocket-protocol"],
          R;
        if (N !== void 0) {
          if (!K.size) R = "Server sent a subprotocol but none was requested";
          else if (!K.has(N)) R = "Server sent an invalid subprotocol"
        } else if (K.size) R = "Server sent no subprotocol";
        if (R) {
          tw(A, E, R);
          return
        }
        if (N) A._protocol = N;
        let T = C.headers["sec-websocket-extensions"];
        if (T !== void 0) {
          if (!D) {
            tw(A, E, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
            return
          }
          let y;
          try {
            y = GX6(T)
          } catch (x) {
            tw(A, E, "Invalid Sec-WebSocket-Extensions header");
            return
          }
          let v = Object.keys(y);
          if (v.length !== 1 || v[0] !== ec.extensionName) {
            tw(A, E, "Server indicated an extension that was not requested");
            return
          }
          try {
            D.accept(y[ec.extensionName])
          } catch (x) {
            tw(A, E, "Invalid Sec-WebSocket-Extensions header");
            return
          }
          A._extensions[ec.extensionName] = D
        }
        A.setSocket(E, U, {
          allowSynchronousEvents: Z.allowSynchronousEvents,
          generateMask: Z.generateMask,
          maxPayload: Z.maxPayload,
          skipUTF8Validation: Z.skipUTF8Validation
        })
      }), Z.finishRequest) Z.finishRequest(H, A);
    else H.end()
  }

  function OaA(A, Q) {
    A._readyState = D8.CLOSING, A._errorEmitted = !0, A.emit("error", Q), A.emitClose()
  }

  function YX6(A) {
    return A.path = A.socketPath, gzB.connect(A)
  }

  function JX6(A) {
    if (A.path = void 0, !A.servername && A.servername !== "") A.servername = gzB.isIP(A.host) ? "" : A.host;
    return lW6.connect(A)
  }

  function tw(A, Q, B) {
    A._readyState = D8.CLOSING;
    let G = Error(B);
    if (Error.captureStackTrace(G, tw), Q.setHeader) {
      if (Q[mzB] = !0, Q.abort(), Q.socket && !Q.socket.destroyed) Q.socket.destroy();
      process.nextTick(OaA, A, G)
    } else Q.destroy(G), Q.once("error", A.emit.bind(A, "error")), Q.once("close", A.emitClose.bind(A))
  }

  function zg1(A, Q, B) {
    if (Q) {
      let G = rW6(Q) ? Q.size : ZX6(Q).length;
      if (A._socket) A._sender._bufferedBytes += G;
      else A._bufferedAmount += G
    }
    if (B) {
      let G = Error(`WebSocket is not open: readyState ${A.readyState} (${Af[A.readyState]})`);
      process.nextTick(B, G)
    }
  }

  function WX6(A, Q) {
    let B = this[xF];
    if (B._closeFrameReceived = !0, B._closeMessage = Q, B._closeCode = A, B._socket[xF] === void 0) return;
    if (B._socket.removeListener("data", RaA), process.nextTick(czB, B._socket), A === 1005) B.close();
    else B.close(A, Q)
  }

  function XX6() {
    let A = this[xF];
    if (!A.isPaused) A._socket.resume()
  }

  function VX6(A) {
    let Q = this[xF];
    if (Q._socket[xF] !== void 0) Q._socket.removeListener("data", RaA), process.nextTick(czB, Q._socket), Q.close(A[eW6]);
    if (!Q._errorEmitted) Q._errorEmitted = !0, Q.emit("error", A)
  }

  function hzB() {
    this[xF].emitClose()
  }

  function FX6(A, Q) {
    this[xF].emit("message", A, Q)
  }

  function KX6(A) {
    let Q = this[xF];
    if (Q._autoPong) Q.pong(A, !this._isServer, uzB);
    Q.emit("ping", A)
  }

  function DX6(A) {
    this[xF].emit("pong", A)
  }

  function czB(A) {
    A.resume()
  }

  function HX6(A) {
    let Q = this[xF];
    if (Q.readyState === D8.CLOSED) return;
    if (Q.readyState === D8.OPEN) Q._readyState = D8.CLOSING, pzB(Q);
    if (this._socket.end(), !Q._errorEmitted) Q._errorEmitted = !0, Q.emit("error", A)
  }

  function pzB(A) {
    A._closeTimer = setTimeout(A._socket.destroy.bind(A._socket), 30000)
  }

  function lzB() {
    let A = this[xF];
    this.removeListener("close", lzB), this.removeListener("data", RaA), this.removeListener("end", izB), A._readyState = D8.CLOSING;
    let Q;
    if (!this._readableState.endEmitted && !A._closeFrameReceived && !A._receiver._writableState.errorEmitted && (Q = A._socket.read()) !== null) A._receiver.write(Q);
    if (A._receiver.end(), this[xF] = void 0, clearTimeout(A._closeTimer), A._receiver._writableState.finished || A._receiver._writableState.errorEmitted) A.emitClose();
    else A._receiver.on("error", hzB), A._receiver.on("finish", hzB)
  }

  function RaA(A) {
    if (!this[xF]._receiver.write(A)) this.pause()
  }

  function izB() {
    let A = this[xF];
    A._readyState = D8.CLOSING, A._receiver.end(), this.end()
  }

  function nzB() {
    let A = this[xF];
    if (this.removeListener("error", nzB), this.on("error", uzB), A) A._readyState = D8.CLOSING, this.destroy()
  }
})
// @from(Start 5901581, End 5903545)
tzB = z((yc7, ozB) => {
  var kc7 = TaA(),
    {
      Duplex: CX6
    } = UA("stream");

  function szB(A) {
    A.emit("close")
  }

  function EX6() {
    if (!this.destroyed && this._writableState.finished) this.destroy()
  }

  function rzB(A) {
    if (this.removeListener("error", rzB), this.destroy(), this.listenerCount("error") === 0) this.emit("error", A)
  }

  function zX6(A, Q) {
    let B = !0,
      G = new CX6({
        ...Q,
        autoDestroy: !1,
        emitClose: !1,
        objectMode: !1,
        writableObjectMode: !1
      });
    return A.on("message", function(I, Y) {
      let J = !Y && G._readableState.objectMode ? I.toString() : I;
      if (!G.push(J)) A.pause()
    }), A.once("error", function(I) {
      if (G.destroyed) return;
      B = !1, G.destroy(I)
    }), A.once("close", function() {
      if (G.destroyed) return;
      G.push(null)
    }), G._destroy = function(Z, I) {
      if (A.readyState === A.CLOSED) {
        I(Z), process.nextTick(szB, G);
        return
      }
      let Y = !1;
      if (A.once("error", function(W) {
          Y = !0, I(W)
        }), A.once("close", function() {
          if (!Y) I(Z);
          process.nextTick(szB, G)
        }), B) A.terminate()
    }, G._final = function(Z) {
      if (A.readyState === A.CONNECTING) {
        A.once("open", function() {
          G._final(Z)
        });
        return
      }
      if (A._socket === null) return;
      if (A._socket._writableState.finished) {
        if (Z(), G._readableState.endEmitted) G.destroy()
      } else A._socket.once("finish", function() {
        Z()
      }), A.close()
    }, G._read = function() {
      if (A.isPaused) A.resume()
    }, G._write = function(Z, I, Y) {
      if (A.readyState === A.CONNECTING) {
        A.once("open", function() {
          G._write(Z, I, Y)
        });
        return
      }
      A.send(Z, Y)
    }, G.on("end", EX6), G.on("error", rzB), G
  }
  ozB.exports = zX6
})
// @from(Start 5903551, End 5904521)
AUB = z((xc7, ezB) => {
  var {
    tokenChars: UX6
  } = q7A();

  function $X6(A) {
    let Q = new Set,
      B = -1,
      G = -1,
      Z = 0;
    for (Z; Z < A.length; Z++) {
      let Y = A.charCodeAt(Z);
      if (G === -1 && UX6[Y] === 1) {
        if (B === -1) B = Z
      } else if (Z !== 0 && (Y === 32 || Y === 9)) {
        if (G === -1 && B !== -1) G = Z
      } else if (Y === 44) {
        if (B === -1) throw SyntaxError(`Unexpected character at index ${Z}`);
        if (G === -1) G = Z;
        let J = A.slice(B, G);
        if (Q.has(J)) throw SyntaxError(`The "${J}" subprotocol is duplicated`);
        Q.add(J), B = G = -1
      } else throw SyntaxError(`Unexpected character at index ${Z}`)
    }
    if (B === -1 || G !== -1) throw SyntaxError("Unexpected end of input");
    let I = A.slice(B, Z);
    if (Q.has(I)) throw SyntaxError(`The "${I}" subprotocol is duplicated`);
    return Q.add(I), Q
  }
  ezB.exports = {
    parse: $X6
  }
})
// @from(Start 5904527, End 5912192)
IUB = z((bc7, ZUB) => {
  var wX6 = UA("events"),
    PaA = UA("http"),
    {
      Duplex: vc7
    } = UA("stream"),
    {
      createHash: qX6
    } = UA("crypto"),
    QUB = Dg1(),
    mt = vUA(),
    NX6 = AUB(),
    LX6 = TaA(),
    {
      GUID: MX6,
      kWebSocket: OX6
    } = tb(),
    RX6 = /^[+/0-9A-Za-z]{22}==$/;
  class GUB extends wX6 {
    constructor(A, Q) {
      super();
      if (A = {
          allowSynchronousEvents: !0,
          autoPong: !0,
          maxPayload: 104857600,
          skipUTF8Validation: !1,
          perMessageDeflate: !1,
          handleProtocols: null,
          clientTracking: !0,
          verifyClient: null,
          noServer: !1,
          backlog: null,
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: LX6,
          ...A
        }, A.port == null && !A.server && !A.noServer || A.port != null && (A.server || A.noServer) || A.server && A.noServer) throw TypeError('One and only one of the "port", "server", or "noServer" options must be specified');
      if (A.port != null) this._server = PaA.createServer((B, G) => {
        let Z = PaA.STATUS_CODES[426];
        G.writeHead(426, {
          "Content-Length": Z.length,
          "Content-Type": "text/plain"
        }), G.end(Z)
      }), this._server.listen(A.port, A.host, A.backlog, Q);
      else if (A.server) this._server = A.server;
      if (this._server) {
        let B = this.emit.bind(this, "connection");
        this._removeListeners = TX6(this._server, {
          listening: this.emit.bind(this, "listening"),
          error: this.emit.bind(this, "error"),
          upgrade: (G, Z, I) => {
            this.handleUpgrade(G, Z, I, B)
          }
        })
      }
      if (A.perMessageDeflate === !0) A.perMessageDeflate = {};
      if (A.clientTracking) this.clients = new Set, this._shouldEmitClose = !1;
      this.options = A, this._state = 0
    }
    address() {
      if (this.options.noServer) throw Error('The server is operating in "noServer" mode');
      if (!this._server) return null;
      return this._server.address()
    }
    close(A) {
      if (this._state === 2) {
        if (A) this.once("close", () => {
          A(Error("The server is not running"))
        });
        process.nextTick(gUA, this);
        return
      }
      if (A) this.once("close", A);
      if (this._state === 1) return;
      if (this._state = 1, this.options.noServer || this.options.server) {
        if (this._server) this._removeListeners(), this._removeListeners = this._server = null;
        if (this.clients)
          if (!this.clients.size) process.nextTick(gUA, this);
          else this._shouldEmitClose = !0;
        else process.nextTick(gUA, this)
      } else {
        let Q = this._server;
        this._removeListeners(), this._removeListeners = this._server = null, Q.close(() => {
          gUA(this)
        })
      }
    }
    shouldHandle(A) {
      if (this.options.path) {
        let Q = A.url.indexOf("?");
        if ((Q !== -1 ? A.url.slice(0, Q) : A.url) !== this.options.path) return !1
      }
      return !0
    }
    handleUpgrade(A, Q, B, G) {
      Q.on("error", BUB);
      let Z = A.headers["sec-websocket-key"],
        I = A.headers.upgrade,
        Y = +A.headers["sec-websocket-version"];
      if (A.method !== "GET") {
        dt(this, A, Q, 405, "Invalid HTTP method");
        return
      }
      if (I === void 0 || I.toLowerCase() !== "websocket") {
        dt(this, A, Q, 400, "Invalid Upgrade header");
        return
      }
      if (Z === void 0 || !RX6.test(Z)) {
        dt(this, A, Q, 400, "Missing or invalid Sec-WebSocket-Key header");
        return
      }
      if (Y !== 13 && Y !== 8) {
        dt(this, A, Q, 400, "Missing or invalid Sec-WebSocket-Version header", {
          "Sec-WebSocket-Version": "13, 8"
        });
        return
      }
      if (!this.shouldHandle(A)) {
        uUA(Q, 400);
        return
      }
      let J = A.headers["sec-websocket-protocol"],
        W = new Set;
      if (J !== void 0) try {
        W = NX6.parse(J)
      } catch (F) {
        dt(this, A, Q, 400, "Invalid Sec-WebSocket-Protocol header");
        return
      }
      let X = A.headers["sec-websocket-extensions"],
        V = {};
      if (this.options.perMessageDeflate && X !== void 0) {
        let F = new mt(this.options.perMessageDeflate, !0, this.options.maxPayload);
        try {
          let K = QUB.parse(X);
          if (K[mt.extensionName]) F.accept(K[mt.extensionName]), V[mt.extensionName] = F
        } catch (K) {
          dt(this, A, Q, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
          return
        }
      }
      if (this.options.verifyClient) {
        let F = {
          origin: A.headers[`${Y===8?"sec-websocket-origin":"origin"}`],
          secure: !!(A.socket.authorized || A.socket.encrypted),
          req: A
        };
        if (this.options.verifyClient.length === 2) {
          this.options.verifyClient(F, (K, D, H, C) => {
            if (!K) return uUA(Q, D || 401, H, C);
            this.completeUpgrade(V, Z, W, A, Q, B, G)
          });
          return
        }
        if (!this.options.verifyClient(F)) return uUA(Q, 401)
      }
      this.completeUpgrade(V, Z, W, A, Q, B, G)
    }
    completeUpgrade(A, Q, B, G, Z, I, Y) {
      if (!Z.readable || !Z.writable) return Z.destroy();
      if (Z[OX6]) throw Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
      if (this._state > 0) return uUA(Z, 503);
      let W = ["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${qX6("sha1").update(Q+MX6).digest("base64")}`],
        X = new this.options.WebSocket(null, void 0, this.options);
      if (B.size) {
        let V = this.options.handleProtocols ? this.options.handleProtocols(B, G) : B.values().next().value;
        if (V) W.push(`Sec-WebSocket-Protocol: ${V}`), X._protocol = V
      }
      if (A[mt.extensionName]) {
        let V = A[mt.extensionName].params,
          F = QUB.format({
            [mt.extensionName]: [V]
          });
        W.push(`Sec-WebSocket-Extensions: ${F}`), X._extensions = A
      }
      if (this.emit("headers", W, G), Z.write(W.concat(`\r
`).join(`\r
`)), Z.removeListener("error", BUB), X.setSocket(Z, I, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        }), this.clients) this.clients.add(X), X.on("close", () => {
        if (this.clients.delete(X), this._shouldEmitClose && !this.clients.size) process.nextTick(gUA, this)
      });
      Y(X, G)
    }
  }
  ZUB.exports = GUB;

  function TX6(A, Q) {
    for (let B of Object.keys(Q)) A.on(B, Q[B]);
    return function() {
      for (let G of Object.keys(Q)) A.removeListener(G, Q[G])
    }
  }

  function gUA(A) {
    A._state = 2, A.emit("close")
  }

  function BUB() {
    this.destroy()
  }

  function uUA(A, Q, B, G) {
    B = B || PaA.STATUS_CODES[Q], G = {
      Connection: "close",
      "Content-Type": "text/html",
      "Content-Length": Buffer.byteLength(B),
      ...G
    }, A.once("finish", A.destroy), A.end(`HTTP/1.1 ${Q} ${PaA.STATUS_CODES[Q]}\r
` + Object.keys(G).map((Z) => `${Z}: ${G[Z]}`).join(`\r
`) + `\r
\r
` + B)
  }

  function dt(A, Q, B, G, Z, I) {
    if (A.listenerCount("wsClientError")) {
      let Y = Error(Z);
      Error.captureStackTrace(Y, dt), A.emit("wsClientError", Y, B, Q)
    } else uUA(B, G, Z, I)
  }
})
// @from(Start 5912198, End 5912201)
PX6
// @from(Start 5912203, End 5912206)
jX6
// @from(Start 5912208, End 5912211)
SX6
// @from(Start 5912213, End 5912216)
mUA
// @from(Start 5912218, End 5912221)
_X6
// @from(Start 5912223, End 5912225)
__
// @from(Start 5912231, End 5912368)
dUA = L(() => {
  PX6 = BA(tzB(), 1), jX6 = BA(Xg1(), 1), SX6 = BA(Fg1(), 1), mUA = BA(TaA(), 1), _X6 = BA(IUB(), 1), __ = mUA.default
})
// @from(Start 5912374, End 5912377)
jaA
// @from(Start 5912383, End 5913134)
YUB = L(() => {
  dUA();
  jaA = global;
  jaA.WebSocket ||= __;
  jaA.window ||= global;
  jaA.self ||= global;
  jaA.window.__REACT_DEVTOOLS_COMPONENT_FILTERS__ = [{
    type: 1,
    value: 7,
    isEnabled: !0
  }, {
    type: 2,
    value: "InternalApp",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalAppContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalStdoutContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalStderrContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalStdinContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalFocusContext",
    isEnabled: !0,
    isValid: !0
  }]
})