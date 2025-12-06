
// @from(Start 4587520, End 4600471)
S6 = z((sj7, YeQ) => {
  var MEA = UA("node:assert"),
    {
      kDestroyed: itQ,
      kBodyUsed: c5A,
      kListeners: Fy1,
      kBody: ltQ
    } = tI(),
    {
      IncomingMessage: Yf8
    } = UA("node:http"),
    cpA = UA("node:stream"),
    Jf8 = UA("node:net"),
    {
      Blob: Wf8
    } = UA("node:buffer"),
    Xf8 = UA("node:util"),
    {
      stringify: Vf8
    } = UA("node:querystring"),
    {
      EventEmitter: Ff8
    } = UA("node:events"),
    {
      InvalidArgumentError: SF
    } = R7(),
    {
      headerNameLowerCasedRecord: Kf8
    } = mpA(),
    {
      tree: ntQ
    } = ptQ(),
    [Df8, Hf8] = process.versions.node.split(".").map((A) => Number(A));
  class Ky1 {
    constructor(A) {
      this[ltQ] = A, this[c5A] = !1
    }
    async * [Symbol.asyncIterator]() {
      MEA(!this[c5A], "disturbed"), this[c5A] = !0, yield* this[ltQ]
    }
  }

  function Cf8(A) {
    if (ppA(A)) {
      if (ttQ(A) === 0) A.on("data", function() {
        MEA(!1)
      });
      if (typeof A.readableDidRead !== "boolean") A[c5A] = !1, Ff8.prototype.on.call(A, "data", function() {
        this[c5A] = !0
      });
      return A
    } else if (A && typeof A.pipeTo === "function") return new Ky1(A);
    else if (A && typeof A !== "string" && !ArrayBuffer.isView(A) && otQ(A)) return new Ky1(A);
    else return A
  }

  function Ef8() {}

  function ppA(A) {
    return A && typeof A === "object" && typeof A.pipe === "function" && typeof A.on === "function"
  }

  function atQ(A) {
    if (A === null) return !1;
    else if (A instanceof Wf8) return !0;
    else if (typeof A !== "object") return !1;
    else {
      let Q = A[Symbol.toStringTag];
      return (Q === "Blob" || Q === "File") && (("stream" in A) && typeof A.stream === "function" || ("arrayBuffer" in A) && typeof A.arrayBuffer === "function")
    }
  }

  function zf8(A, Q) {
    if (A.includes("?") || A.includes("#")) throw Error('Query params cannot be passed when url already contains "?" or "#".');
    let B = Vf8(Q);
    if (B) A += "?" + B;
    return A
  }

  function stQ(A) {
    let Q = parseInt(A, 10);
    return Q === Number(A) && Q >= 0 && Q <= 65535
  }

  function dpA(A) {
    return A != null && A[0] === "h" && A[1] === "t" && A[2] === "t" && A[3] === "p" && (A[4] === ":" || A[4] === "s" && A[5] === ":")
  }

  function rtQ(A) {
    if (typeof A === "string") {
      if (A = new URL(A), !dpA(A.origin || A.protocol)) throw new SF("Invalid URL protocol: the URL must start with `http:` or `https:`.");
      return A
    }
    if (!A || typeof A !== "object") throw new SF("Invalid URL: The URL argument must be a non-null object.");
    if (!(A instanceof URL)) {
      if (A.port != null && A.port !== "" && stQ(A.port) === !1) throw new SF("Invalid URL: port must be a valid integer or a string representation of an integer.");
      if (A.path != null && typeof A.path !== "string") throw new SF("Invalid URL path: the path must be a string or null/undefined.");
      if (A.pathname != null && typeof A.pathname !== "string") throw new SF("Invalid URL pathname: the pathname must be a string or null/undefined.");
      if (A.hostname != null && typeof A.hostname !== "string") throw new SF("Invalid URL hostname: the hostname must be a string or null/undefined.");
      if (A.origin != null && typeof A.origin !== "string") throw new SF("Invalid URL origin: the origin must be a string or null/undefined.");
      if (!dpA(A.origin || A.protocol)) throw new SF("Invalid URL protocol: the URL must start with `http:` or `https:`.");
      let Q = A.port != null ? A.port : A.protocol === "https:" ? 443 : 80,
        B = A.origin != null ? A.origin : `${A.protocol||""}//${A.hostname||""}:${Q}`,
        G = A.path != null ? A.path : `${A.pathname||""}${A.search||""}`;
      if (B[B.length - 1] === "/") B = B.slice(0, B.length - 1);
      if (G && G[0] !== "/") G = `/${G}`;
      return new URL(`${B}${G}`)
    }
    if (!dpA(A.origin || A.protocol)) throw new SF("Invalid URL protocol: the URL must start with `http:` or `https:`.");
    return A
  }

  function Uf8(A) {
    if (A = rtQ(A), A.pathname !== "/" || A.search || A.hash) throw new SF("invalid url");
    return A
  }

  function $f8(A) {
    if (A[0] === "[") {
      let B = A.indexOf("]");
      return MEA(B !== -1), A.substring(1, B)
    }
    let Q = A.indexOf(":");
    if (Q === -1) return A;
    return A.substring(0, Q)
  }

  function wf8(A) {
    if (!A) return null;
    MEA(typeof A === "string");
    let Q = $f8(A);
    if (Jf8.isIP(Q)) return "";
    return Q
  }

  function qf8(A) {
    return JSON.parse(JSON.stringify(A))
  }

  function Nf8(A) {
    return A != null && typeof A[Symbol.asyncIterator] === "function"
  }

  function otQ(A) {
    return A != null && (typeof A[Symbol.iterator] === "function" || typeof A[Symbol.asyncIterator] === "function")
  }

  function ttQ(A) {
    if (A == null) return 0;
    else if (ppA(A)) {
      let Q = A._readableState;
      return Q && Q.objectMode === !1 && Q.ended === !0 && Number.isFinite(Q.length) ? Q.length : null
    } else if (atQ(A)) return A.size != null ? A.size : null;
    else if (QeQ(A)) return A.byteLength;
    return null
  }

  function etQ(A) {
    return A && !!(A.destroyed || A[itQ] || cpA.isDestroyed?.(A))
  }

  function Lf8(A, Q) {
    if (A == null || !ppA(A) || etQ(A)) return;
    if (typeof A.destroy === "function") {
      if (Object.getPrototypeOf(A).constructor === Yf8) A.socket = null;
      A.destroy(Q)
    } else if (Q) queueMicrotask(() => {
      A.emit("error", Q)
    });
    if (A.destroyed !== !0) A[itQ] = !0
  }
  var Mf8 = /timeout=(\d+)/;

  function Of8(A) {
    let Q = A.toString().match(Mf8);
    return Q ? parseInt(Q[1], 10) * 1000 : null
  }

  function AeQ(A) {
    return typeof A === "string" ? Kf8[A] ?? A.toLowerCase() : ntQ.lookup(A) ?? A.toString("latin1").toLowerCase()
  }

  function Rf8(A) {
    return ntQ.lookup(A) ?? A.toString("latin1").toLowerCase()
  }

  function Tf8(A, Q) {
    if (Q === void 0) Q = {};
    for (let B = 0; B < A.length; B += 2) {
      let G = AeQ(A[B]),
        Z = Q[G];
      if (Z) {
        if (typeof Z === "string") Z = [Z], Q[G] = Z;
        Z.push(A[B + 1].toString("utf8"))
      } else {
        let I = A[B + 1];
        if (typeof I === "string") Q[G] = I;
        else Q[G] = Array.isArray(I) ? I.map((Y) => Y.toString("utf8")) : I.toString("utf8")
      }
    }
    if ("content-length" in Q && "content-disposition" in Q) Q["content-disposition"] = Buffer.from(Q["content-disposition"]).toString("latin1");
    return Q
  }

  function Pf8(A) {
    let Q = A.length,
      B = Array(Q),
      G = !1,
      Z = -1,
      I, Y, J = 0;
    for (let W = 0; W < A.length; W += 2) {
      if (I = A[W], Y = A[W + 1], typeof I !== "string" && (I = I.toString()), typeof Y !== "string" && (Y = Y.toString("utf8")), J = I.length, J === 14 && I[7] === "-" && (I === "content-length" || I.toLowerCase() === "content-length")) G = !0;
      else if (J === 19 && I[7] === "-" && (I === "content-disposition" || I.toLowerCase() === "content-disposition")) Z = W + 1;
      B[W] = I, B[W + 1] = Y
    }
    if (G && Z !== -1) B[Z] = Buffer.from(B[Z]).toString("latin1");
    return B
  }

  function QeQ(A) {
    return A instanceof Uint8Array || Buffer.isBuffer(A)
  }

  function jf8(A, Q, B) {
    if (!A || typeof A !== "object") throw new SF("handler must be an object");
    if (typeof A.onConnect !== "function") throw new SF("invalid onConnect method");
    if (typeof A.onError !== "function") throw new SF("invalid onError method");
    if (typeof A.onBodySent !== "function" && A.onBodySent !== void 0) throw new SF("invalid onBodySent method");
    if (B || Q === "CONNECT") {
      if (typeof A.onUpgrade !== "function") throw new SF("invalid onUpgrade method")
    } else {
      if (typeof A.onHeaders !== "function") throw new SF("invalid onHeaders method");
      if (typeof A.onData !== "function") throw new SF("invalid onData method");
      if (typeof A.onComplete !== "function") throw new SF("invalid onComplete method")
    }
  }

  function Sf8(A) {
    return !!(A && (cpA.isDisturbed(A) || A[c5A]))
  }

  function _f8(A) {
    return !!(A && cpA.isErrored(A))
  }

  function kf8(A) {
    return !!(A && cpA.isReadable(A))
  }

  function yf8(A) {
    return {
      localAddress: A.localAddress,
      localPort: A.localPort,
      remoteAddress: A.remoteAddress,
      remotePort: A.remotePort,
      remoteFamily: A.remoteFamily,
      timeout: A.timeout,
      bytesWritten: A.bytesWritten,
      bytesRead: A.bytesRead
    }
  }

  function xf8(A) {
    let Q;
    return new ReadableStream({
      async start() {
        Q = A[Symbol.asyncIterator]()
      },
      async pull(B) {
        let {
          done: G,
          value: Z
        } = await Q.next();
        if (G) queueMicrotask(() => {
          B.close(), B.byobRequest?.respond(0)
        });
        else {
          let I = Buffer.isBuffer(Z) ? Z : Buffer.from(Z);
          if (I.byteLength) B.enqueue(new Uint8Array(I))
        }
        return B.desiredSize > 0
      },
      async cancel(B) {
        await Q.return()
      },
      type: "bytes"
    })
  }

  function vf8(A) {
    return A && typeof A === "object" && typeof A.append === "function" && typeof A.delete === "function" && typeof A.get === "function" && typeof A.getAll === "function" && typeof A.has === "function" && typeof A.set === "function" && A[Symbol.toStringTag] === "FormData"
  }

  function bf8(A, Q) {
    if ("addEventListener" in A) return A.addEventListener("abort", Q, {
      once: !0
    }), () => A.removeEventListener("abort", Q);
    return A.addListener("abort", Q), () => A.removeListener("abort", Q)
  }
  var ff8 = typeof String.prototype.toWellFormed === "function",
    hf8 = typeof String.prototype.isWellFormed === "function";

  function BeQ(A) {
    return ff8 ? `${A}`.toWellFormed() : Xf8.toUSVString(A)
  }

  function gf8(A) {
    return hf8 ? `${A}`.isWellFormed() : BeQ(A) === `${A}`
  }

  function GeQ(A) {
    switch (A) {
      case 34:
      case 40:
      case 41:
      case 44:
      case 47:
      case 58:
      case 59:
      case 60:
      case 61:
      case 62:
      case 63:
      case 64:
      case 91:
      case 92:
      case 93:
      case 123:
      case 125:
        return !1;
      default:
        return A >= 33 && A <= 126
    }
  }

  function uf8(A) {
    if (A.length === 0) return !1;
    for (let Q = 0; Q < A.length; ++Q)
      if (!GeQ(A.charCodeAt(Q))) return !1;
    return !0
  }
  var mf8 = /[^\t\x20-\x7e\x80-\xff]/;

  function df8(A) {
    return !mf8.test(A)
  }

  function cf8(A) {
    if (A == null || A === "") return {
      start: 0,
      end: null,
      size: null
    };
    let Q = A ? A.match(/^bytes (\d+)-(\d+)\/(\d+)?$/) : null;
    return Q ? {
      start: parseInt(Q[1]),
      end: Q[2] ? parseInt(Q[2]) : null,
      size: Q[3] ? parseInt(Q[3]) : null
    } : null
  }

  function pf8(A, Q, B) {
    return (A[Fy1] ??= []).push([Q, B]), A.on(Q, B), A
  }

  function lf8(A) {
    for (let [Q, B] of A[Fy1] ?? []) A.removeListener(Q, B);
    A[Fy1] = null
  }

  function if8(A, Q, B) {
    try {
      Q.onError(B), MEA(Q.aborted)
    } catch (G) {
      A.emit("error", G)
    }
  }
  var ZeQ = Object.create(null);
  ZeQ.enumerable = !0;
  var Dy1 = {
      delete: "DELETE",
      DELETE: "DELETE",
      get: "GET",
      GET: "GET",
      head: "HEAD",
      HEAD: "HEAD",
      options: "OPTIONS",
      OPTIONS: "OPTIONS",
      post: "POST",
      POST: "POST",
      put: "PUT",
      PUT: "PUT"
    },
    IeQ = {
      ...Dy1,
      patch: "patch",
      PATCH: "PATCH"
    };
  Object.setPrototypeOf(Dy1, null);
  Object.setPrototypeOf(IeQ, null);
  YeQ.exports = {
    kEnumerableProperty: ZeQ,
    nop: Ef8,
    isDisturbed: Sf8,
    isErrored: _f8,
    isReadable: kf8,
    toUSVString: BeQ,
    isUSVString: gf8,
    isBlobLike: atQ,
    parseOrigin: Uf8,
    parseURL: rtQ,
    getServerName: wf8,
    isStream: ppA,
    isIterable: otQ,
    isAsyncIterable: Nf8,
    isDestroyed: etQ,
    headerNameToString: AeQ,
    bufferToLowerCasedHeaderName: Rf8,
    addListener: pf8,
    removeAllListeners: lf8,
    errorRequest: if8,
    parseRawHeaders: Pf8,
    parseHeaders: Tf8,
    parseKeepAliveTimeout: Of8,
    destroy: Lf8,
    bodyLength: ttQ,
    deepClone: qf8,
    ReadableStreamFrom: xf8,
    isBuffer: QeQ,
    validateHandler: jf8,
    getSocketInfo: yf8,
    isFormDataLike: vf8,
    buildURL: zf8,
    addAbortListener: bf8,
    isValidHTTPToken: uf8,
    isValidHeaderValue: df8,
    isTokenCharCode: GeQ,
    parseRangeHeader: cf8,
    normalizedMethodRecordsBase: Dy1,
    normalizedMethodRecords: IeQ,
    isValidPort: stQ,
    isHttpOrHttpsPrefixed: dpA,
    nodeMajor: Df8,
    nodeMinor: Hf8,
    safeHTTPMethods: ["GET", "HEAD", "OPTIONS", "TRACE"],
    wrapRequestBody: Cf8
  }
})
// @from(Start 4600477, End 4605478)
p5A = z((rj7, WeQ) => {
  var h7 = UA("node:diagnostics_channel"),
    Cy1 = UA("node:util"),
    lpA = Cy1.debuglog("undici"),
    Hy1 = Cy1.debuglog("fetch"),
    ko = Cy1.debuglog("websocket"),
    JeQ = !1,
    nf8 = {
      beforeConnect: h7.channel("undici:client:beforeConnect"),
      connected: h7.channel("undici:client:connected"),
      connectError: h7.channel("undici:client:connectError"),
      sendHeaders: h7.channel("undici:client:sendHeaders"),
      create: h7.channel("undici:request:create"),
      bodySent: h7.channel("undici:request:bodySent"),
      headers: h7.channel("undici:request:headers"),
      trailers: h7.channel("undici:request:trailers"),
      error: h7.channel("undici:request:error"),
      open: h7.channel("undici:websocket:open"),
      close: h7.channel("undici:websocket:close"),
      socketError: h7.channel("undici:websocket:socket_error"),
      ping: h7.channel("undici:websocket:ping"),
      pong: h7.channel("undici:websocket:pong")
    };
  if (lpA.enabled || Hy1.enabled) {
    let A = Hy1.enabled ? Hy1 : lpA;
    h7.channel("undici:client:beforeConnect").subscribe((Q) => {
      let {
        connectParams: {
          version: B,
          protocol: G,
          port: Z,
          host: I
        }
      } = Q;
      A("connecting to %s using %s%s", `${I}${Z?`:${Z}`:""}`, G, B)
    }), h7.channel("undici:client:connected").subscribe((Q) => {
      let {
        connectParams: {
          version: B,
          protocol: G,
          port: Z,
          host: I
        }
      } = Q;
      A("connected to %s using %s%s", `${I}${Z?`:${Z}`:""}`, G, B)
    }), h7.channel("undici:client:connectError").subscribe((Q) => {
      let {
        connectParams: {
          version: B,
          protocol: G,
          port: Z,
          host: I
        },
        error: Y
      } = Q;
      A("connection to %s using %s%s errored - %s", `${I}${Z?`:${Z}`:""}`, G, B, Y.message)
    }), h7.channel("undici:client:sendHeaders").subscribe((Q) => {
      let {
        request: {
          method: B,
          path: G,
          origin: Z
        }
      } = Q;
      A("sending request to %s %s/%s", B, Z, G)
    }), h7.channel("undici:request:headers").subscribe((Q) => {
      let {
        request: {
          method: B,
          path: G,
          origin: Z
        },
        response: {
          statusCode: I
        }
      } = Q;
      A("received response to %s %s/%s - HTTP %d", B, Z, G, I)
    }), h7.channel("undici:request:trailers").subscribe((Q) => {
      let {
        request: {
          method: B,
          path: G,
          origin: Z
        }
      } = Q;
      A("trailers received from %s %s/%s", B, Z, G)
    }), h7.channel("undici:request:error").subscribe((Q) => {
      let {
        request: {
          method: B,
          path: G,
          origin: Z
        },
        error: I
      } = Q;
      A("request to %s %s/%s errored - %s", B, Z, G, I.message)
    }), JeQ = !0
  }
  if (ko.enabled) {
    if (!JeQ) {
      let A = lpA.enabled ? lpA : ko;
      h7.channel("undici:client:beforeConnect").subscribe((Q) => {
        let {
          connectParams: {
            version: B,
            protocol: G,
            port: Z,
            host: I
          }
        } = Q;
        A("connecting to %s%s using %s%s", I, Z ? `:${Z}` : "", G, B)
      }), h7.channel("undici:client:connected").subscribe((Q) => {
        let {
          connectParams: {
            version: B,
            protocol: G,
            port: Z,
            host: I
          }
        } = Q;
        A("connected to %s%s using %s%s", I, Z ? `:${Z}` : "", G, B)
      }), h7.channel("undici:client:connectError").subscribe((Q) => {
        let {
          connectParams: {
            version: B,
            protocol: G,
            port: Z,
            host: I
          },
          error: Y
        } = Q;
        A("connection to %s%s using %s%s errored - %s", I, Z ? `:${Z}` : "", G, B, Y.message)
      }), h7.channel("undici:client:sendHeaders").subscribe((Q) => {
        let {
          request: {
            method: B,
            path: G,
            origin: Z
          }
        } = Q;
        A("sending request to %s %s/%s", B, Z, G)
      })
    }
    h7.channel("undici:websocket:open").subscribe((A) => {
      let {
        address: {
          address: Q,
          port: B
        }
      } = A;
      ko("connection opened %s%s", Q, B ? `:${B}` : "")
    }), h7.channel("undici:websocket:close").subscribe((A) => {
      let {
        websocket: Q,
        code: B,
        reason: G
      } = A;
      ko("closed connection to %s - %s %s", Q.url, B, G)
    }), h7.channel("undici:websocket:socket_error").subscribe((A) => {
      ko("connection errored - %s", A.message)
    }), h7.channel("undici:websocket:ping").subscribe((A) => {
      ko("ping received")
    }), h7.channel("undici:websocket:pong").subscribe((A) => {
      ko("pong received")
    })
  }
  WeQ.exports = {
    channels: nf8
  }
})
// @from(Start 4605484, End 4613355)
HeQ = z((oj7, DeQ) => {
  var {
    InvalidArgumentError: dY,
    NotSupportedError: af8
  } = R7(), Lb = UA("node:assert"), {
    isValidHTTPToken: FeQ,
    isValidHeaderValue: XeQ,
    isStream: sf8,
    destroy: rf8,
    isBuffer: of8,
    isFormDataLike: tf8,
    isIterable: ef8,
    isBlobLike: Ah8,
    buildURL: Qh8,
    validateHandler: Bh8,
    getServerName: Gh8,
    normalizedMethodRecords: Zh8
  } = S6(), {
    channels: Y_
  } = p5A(), {
    headerNameLowerCasedRecord: VeQ
  } = mpA(), Ih8 = /[^\u0021-\u00ff]/, aL = Symbol("handler");
  class KeQ {
    constructor(A, {
      path: Q,
      method: B,
      body: G,
      headers: Z,
      query: I,
      idempotent: Y,
      blocking: J,
      upgrade: W,
      headersTimeout: X,
      bodyTimeout: V,
      reset: F,
      throwOnError: K,
      expectContinue: D,
      servername: H
    }, C) {
      if (typeof Q !== "string") throw new dY("path must be a string");
      else if (Q[0] !== "/" && !(Q.startsWith("http://") || Q.startsWith("https://")) && B !== "CONNECT") throw new dY("path must be an absolute URL or start with a slash");
      else if (Ih8.test(Q)) throw new dY("invalid request path");
      if (typeof B !== "string") throw new dY("method must be a string");
      else if (Zh8[B] === void 0 && !FeQ(B)) throw new dY("invalid request method");
      if (W && typeof W !== "string") throw new dY("upgrade must be a string");
      if (X != null && (!Number.isFinite(X) || X < 0)) throw new dY("invalid headersTimeout");
      if (V != null && (!Number.isFinite(V) || V < 0)) throw new dY("invalid bodyTimeout");
      if (F != null && typeof F !== "boolean") throw new dY("invalid reset");
      if (D != null && typeof D !== "boolean") throw new dY("invalid expectContinue");
      if (this.headersTimeout = X, this.bodyTimeout = V, this.throwOnError = K === !0, this.method = B, this.abort = null, G == null) this.body = null;
      else if (sf8(G)) {
        this.body = G;
        let E = this.body._readableState;
        if (!E || !E.autoDestroy) this.endHandler = function() {
          rf8(this)
        }, this.body.on("end", this.endHandler);
        this.errorHandler = (U) => {
          if (this.abort) this.abort(U);
          else this.error = U
        }, this.body.on("error", this.errorHandler)
      } else if (of8(G)) this.body = G.byteLength ? G : null;
      else if (ArrayBuffer.isView(G)) this.body = G.buffer.byteLength ? Buffer.from(G.buffer, G.byteOffset, G.byteLength) : null;
      else if (G instanceof ArrayBuffer) this.body = G.byteLength ? Buffer.from(G) : null;
      else if (typeof G === "string") this.body = G.length ? Buffer.from(G) : null;
      else if (tf8(G) || ef8(G) || Ah8(G)) this.body = G;
      else throw new dY("body must be a string, a Buffer, a Readable stream, an iterable, or an async iterable");
      if (this.completed = !1, this.aborted = !1, this.upgrade = W || null, this.path = I ? Qh8(Q, I) : Q, this.origin = A, this.idempotent = Y == null ? B === "HEAD" || B === "GET" : Y, this.blocking = J == null ? !1 : J, this.reset = F == null ? null : F, this.host = null, this.contentLength = null, this.contentType = null, this.headers = [], this.expectContinue = D != null ? D : !1, Array.isArray(Z)) {
        if (Z.length % 2 !== 0) throw new dY("headers array must be even");
        for (let E = 0; E < Z.length; E += 2) ipA(this, Z[E], Z[E + 1])
      } else if (Z && typeof Z === "object")
        if (Z[Symbol.iterator])
          for (let E of Z) {
            if (!Array.isArray(E) || E.length !== 2) throw new dY("headers must be in key-value pair format");
            ipA(this, E[0], E[1])
          } else {
            let E = Object.keys(Z);
            for (let U = 0; U < E.length; ++U) ipA(this, E[U], Z[E[U]])
          } else if (Z != null) throw new dY("headers must be an object or an array");
      if (Bh8(C, B, W), this.servername = H || Gh8(this.host), this[aL] = C, Y_.create.hasSubscribers) Y_.create.publish({
        request: this
      })
    }
    onBodySent(A) {
      if (this[aL].onBodySent) try {
        return this[aL].onBodySent(A)
      } catch (Q) {
        this.abort(Q)
      }
    }
    onRequestSent() {
      if (Y_.bodySent.hasSubscribers) Y_.bodySent.publish({
        request: this
      });
      if (this[aL].onRequestSent) try {
        return this[aL].onRequestSent()
      } catch (A) {
        this.abort(A)
      }
    }
    onConnect(A) {
      if (Lb(!this.aborted), Lb(!this.completed), this.error) A(this.error);
      else return this.abort = A, this[aL].onConnect(A)
    }
    onResponseStarted() {
      return this[aL].onResponseStarted?.()
    }
    onHeaders(A, Q, B, G) {
      if (Lb(!this.aborted), Lb(!this.completed), Y_.headers.hasSubscribers) Y_.headers.publish({
        request: this,
        response: {
          statusCode: A,
          headers: Q,
          statusText: G
        }
      });
      try {
        return this[aL].onHeaders(A, Q, B, G)
      } catch (Z) {
        this.abort(Z)
      }
    }
    onData(A) {
      Lb(!this.aborted), Lb(!this.completed);
      try {
        return this[aL].onData(A)
      } catch (Q) {
        return this.abort(Q), !1
      }
    }
    onUpgrade(A, Q, B) {
      return Lb(!this.aborted), Lb(!this.completed), this[aL].onUpgrade(A, Q, B)
    }
    onComplete(A) {
      if (this.onFinally(), Lb(!this.aborted), this.completed = !0, Y_.trailers.hasSubscribers) Y_.trailers.publish({
        request: this,
        trailers: A
      });
      try {
        return this[aL].onComplete(A)
      } catch (Q) {
        this.onError(Q)
      }
    }
    onError(A) {
      if (this.onFinally(), Y_.error.hasSubscribers) Y_.error.publish({
        request: this,
        error: A
      });
      if (this.aborted) return;
      return this.aborted = !0, this[aL].onError(A)
    }
    onFinally() {
      if (this.errorHandler) this.body.off("error", this.errorHandler), this.errorHandler = null;
      if (this.endHandler) this.body.off("end", this.endHandler), this.endHandler = null
    }
    addHeader(A, Q) {
      return ipA(this, A, Q), this
    }
  }

  function ipA(A, Q, B) {
    if (B && (typeof B === "object" && !Array.isArray(B))) throw new dY(`invalid ${Q} header`);
    else if (B === void 0) return;
    let G = VeQ[Q];
    if (G === void 0) {
      if (G = Q.toLowerCase(), VeQ[G] === void 0 && !FeQ(G)) throw new dY("invalid header key")
    }
    if (Array.isArray(B)) {
      let Z = [];
      for (let I = 0; I < B.length; I++)
        if (typeof B[I] === "string") {
          if (!XeQ(B[I])) throw new dY(`invalid ${Q} header`);
          Z.push(B[I])
        } else if (B[I] === null) Z.push("");
      else if (typeof B[I] === "object") throw new dY(`invalid ${Q} header`);
      else Z.push(`${B[I]}`);
      B = Z
    } else if (typeof B === "string") {
      if (!XeQ(B)) throw new dY(`invalid ${Q} header`)
    } else if (B === null) B = "";
    else B = `${B}`;
    if (A.host === null && G === "host") {
      if (typeof B !== "string") throw new dY("invalid host header");
      A.host = B
    } else if (A.contentLength === null && G === "content-length") {
      if (A.contentLength = parseInt(B, 10), !Number.isFinite(A.contentLength)) throw new dY("invalid content-length header")
    } else if (A.contentType === null && G === "content-type") A.contentType = B, A.headers.push(Q, B);
    else if (G === "transfer-encoding" || G === "keep-alive" || G === "upgrade") throw new dY(`invalid ${G} header`);
    else if (G === "connection") {
      let Z = typeof B === "string" ? B.toLowerCase() : null;
      if (Z !== "close" && Z !== "keep-alive") throw new dY("invalid connection header");
      if (Z === "close") A.reset = !0
    } else if (G === "expect") throw new af8("expect header not supported");
    else A.headers.push(Q, B)
  }
  DeQ.exports = KeQ
})
// @from(Start 4613361, End 4614385)
OEA = z((tj7, EeQ) => {
  var Yh8 = UA("node:events");
  class Ey1 extends Yh8 {
    dispatch() {
      throw Error("not implemented")
    }
    close() {
      throw Error("not implemented")
    }
    destroy() {
      throw Error("not implemented")
    }
    compose(...A) {
      let Q = Array.isArray(A[0]) ? A[0] : A,
        B = this.dispatch.bind(this);
      for (let G of Q) {
        if (G == null) continue;
        if (typeof G !== "function") throw TypeError(`invalid interceptor, expected function received ${typeof G}`);
        if (B = G(B), B == null || typeof B !== "function" || B.length !== 2) throw TypeError("invalid interceptor")
      }
      return new CeQ(this, B)
    }
  }
  class CeQ extends Ey1 {
    #A = null;
    #Q = null;
    constructor(A, Q) {
      super();
      this.#A = A, this.#Q = Q
    }
    dispatch(...A) {
      this.#Q(...A)
    }
    close(...A) {
      return this.#A.close(...A)
    }
    destroy(...A) {
      return this.#A.destroy(...A)
    }
  }
  EeQ.exports = Ey1
})
// @from(Start 4614391, End 4617538)
a5A = z((ej7, UeQ) => {
  var Jh8 = OEA(),
    {
      ClientDestroyedError: zy1,
      ClientClosedError: Wh8,
      InvalidArgumentError: l5A
    } = R7(),
    {
      kDestroy: Xh8,
      kClose: Vh8,
      kClosed: REA,
      kDestroyed: i5A,
      kDispatch: Uy1,
      kInterceptors: yo
    } = tI(),
    Mb = Symbol("onDestroyed"),
    n5A = Symbol("onClosed"),
    npA = Symbol("Intercepted Dispatch");
  class zeQ extends Jh8 {
    constructor() {
      super();
      this[i5A] = !1, this[Mb] = null, this[REA] = !1, this[n5A] = []
    }
    get destroyed() {
      return this[i5A]
    }
    get closed() {
      return this[REA]
    }
    get interceptors() {
      return this[yo]
    }
    set interceptors(A) {
      if (A) {
        for (let Q = A.length - 1; Q >= 0; Q--)
          if (typeof this[yo][Q] !== "function") throw new l5A("interceptor must be an function")
      }
      this[yo] = A
    }
    close(A) {
      if (A === void 0) return new Promise((B, G) => {
        this.close((Z, I) => {
          return Z ? G(Z) : B(I)
        })
      });
      if (typeof A !== "function") throw new l5A("invalid callback");
      if (this[i5A]) {
        queueMicrotask(() => A(new zy1, null));
        return
      }
      if (this[REA]) {
        if (this[n5A]) this[n5A].push(A);
        else queueMicrotask(() => A(null, null));
        return
      }
      this[REA] = !0, this[n5A].push(A);
      let Q = () => {
        let B = this[n5A];
        this[n5A] = null;
        for (let G = 0; G < B.length; G++) B[G](null, null)
      };
      this[Vh8]().then(() => this.destroy()).then(() => {
        queueMicrotask(Q)
      })
    }
    destroy(A, Q) {
      if (typeof A === "function") Q = A, A = null;
      if (Q === void 0) return new Promise((G, Z) => {
        this.destroy(A, (I, Y) => {
          return I ? Z(I) : G(Y)
        })
      });
      if (typeof Q !== "function") throw new l5A("invalid callback");
      if (this[i5A]) {
        if (this[Mb]) this[Mb].push(Q);
        else queueMicrotask(() => Q(null, null));
        return
      }
      if (!A) A = new zy1;
      this[i5A] = !0, this[Mb] = this[Mb] || [], this[Mb].push(Q);
      let B = () => {
        let G = this[Mb];
        this[Mb] = null;
        for (let Z = 0; Z < G.length; Z++) G[Z](null, null)
      };
      this[Xh8](A).then(() => {
        queueMicrotask(B)
      })
    } [npA](A, Q) {
      if (!this[yo] || this[yo].length === 0) return this[npA] = this[Uy1], this[Uy1](A, Q);
      let B = this[Uy1].bind(this);
      for (let G = this[yo].length - 1; G >= 0; G--) B = this[yo][G](B);
      return this[npA] = B, B(A, Q)
    }
    dispatch(A, Q) {
      if (!Q || typeof Q !== "object") throw new l5A("handler must be an object");
      try {
        if (!A || typeof A !== "object") throw new l5A("opts must be an object.");
        if (this[i5A] || this[Mb]) throw new zy1;
        if (this[REA]) throw new Wh8;
        return this[npA](A, Q)
      } catch (B) {
        if (typeof Q.onError !== "function") throw new l5A("invalid onError method");
        return Q.onError(B), !1
      }
    }
  }
  UeQ.exports = zeQ
})
// @from(Start 4617544, End 4619295)
Ry1 = z((AS7, NeQ) => {
  var s5A = 0,
    $y1 = 1000,
    wy1 = ($y1 >> 1) - 1,
    Ob, qy1 = Symbol("kFastTimer"),
    Rb = [],
    Ny1 = -2,
    Ly1 = -1,
    weQ = 0,
    $eQ = 1;

  function My1() {
    s5A += wy1;
    let A = 0,
      Q = Rb.length;
    while (A < Q) {
      let B = Rb[A];
      if (B._state === weQ) B._idleStart = s5A - wy1, B._state = $eQ;
      else if (B._state === $eQ && s5A >= B._idleStart + B._idleTimeout) B._state = Ly1, B._idleStart = -1, B._onTimeout(B._timerArg);
      if (B._state === Ly1) {
        if (B._state = Ny1, --Q !== 0) Rb[A] = Rb[Q]
      } else ++A
    }
    if (Rb.length = Q, Rb.length !== 0) qeQ()
  }

  function qeQ() {
    if (Ob) Ob.refresh();
    else if (clearTimeout(Ob), Ob = setTimeout(My1, wy1), Ob.unref) Ob.unref()
  }
  class Oy1 {
    [qy1] = !0;
    _state = Ny1;
    _idleTimeout = -1;
    _idleStart = -1;
    _onTimeout;
    _timerArg;
    constructor(A, Q, B) {
      this._onTimeout = A, this._idleTimeout = Q, this._timerArg = B, this.refresh()
    }
    refresh() {
      if (this._state === Ny1) Rb.push(this);
      if (!Ob || Rb.length === 1) qeQ();
      this._state = weQ
    }
    clear() {
      this._state = Ly1, this._idleStart = -1
    }
  }
  NeQ.exports = {
    setTimeout(A, Q, B) {
      return Q <= $y1 ? setTimeout(A, Q, B) : new Oy1(A, Q, B)
    },
    clearTimeout(A) {
      if (A[qy1]) A.clear();
      else clearTimeout(A)
    },
    setFastTimeout(A, Q, B) {
      return new Oy1(A, Q, B)
    },
    clearFastTimeout(A) {
      A.clear()
    },
    now() {
      return s5A
    },
    tick(A = 0) {
      s5A += A - $y1 + 1, My1(), My1()
    },
    reset() {
      s5A = 0, Rb.length = 0, clearTimeout(Ob), Ob = null
    },
    kFastTimer: qy1
  }
})
// @from(Start 4619301, End 4623852)
TEA = z((QS7, TeQ) => {
  var Fh8 = UA("node:net"),
    LeQ = UA("node:assert"),
    ReQ = S6(),
    {
      InvalidArgumentError: Kh8,
      ConnectTimeoutError: Dh8
    } = R7(),
    apA = Ry1();

  function MeQ() {}
  var Ty1, Py1;
  if (global.FinalizationRegistry && !(process.env.NODE_V8_COVERAGE || process.env.UNDICI_NO_FG)) Py1 = class {
    constructor(Q) {
      this._maxCachedSessions = Q, this._sessionCache = new Map, this._sessionRegistry = new global.FinalizationRegistry((B) => {
        if (this._sessionCache.size < this._maxCachedSessions) return;
        let G = this._sessionCache.get(B);
        if (G !== void 0 && G.deref() === void 0) this._sessionCache.delete(B)
      })
    }
    get(Q) {
      let B = this._sessionCache.get(Q);
      return B ? B.deref() : null
    }
    set(Q, B) {
      if (this._maxCachedSessions === 0) return;
      this._sessionCache.set(Q, new WeakRef(B)), this._sessionRegistry.register(B, Q)
    }
  };
  else Py1 = class {
    constructor(Q) {
      this._maxCachedSessions = Q, this._sessionCache = new Map
    }
    get(Q) {
      return this._sessionCache.get(Q)
    }
    set(Q, B) {
      if (this._maxCachedSessions === 0) return;
      if (this._sessionCache.size >= this._maxCachedSessions) {
        let {
          value: G
        } = this._sessionCache.keys().next();
        this._sessionCache.delete(G)
      }
      this._sessionCache.set(Q, B)
    }
  };

  function Hh8({
    allowH2: A,
    maxCachedSessions: Q,
    socketPath: B,
    timeout: G,
    session: Z,
    ...I
  }) {
    if (Q != null && (!Number.isInteger(Q) || Q < 0)) throw new Kh8("maxCachedSessions must be a positive integer or zero");
    let Y = {
        path: B,
        ...I
      },
      J = new Py1(Q == null ? 100 : Q);
    return G = G == null ? 1e4 : G, A = A != null ? A : !1,
      function({
        hostname: X,
        host: V,
        protocol: F,
        port: K,
        servername: D,
        localAddress: H,
        httpSocket: C
      }, E) {
        let U;
        if (F === "https:") {
          if (!Ty1) Ty1 = UA("node:tls");
          D = D || Y.servername || ReQ.getServerName(V) || null;
          let w = D || X;
          LeQ(w);
          let N = Z || J.get(w) || null;
          K = K || 443, U = Ty1.connect({
            highWaterMark: 16384,
            ...Y,
            servername: D,
            session: N,
            localAddress: H,
            ALPNProtocols: A ? ["http/1.1", "h2"] : ["http/1.1"],
            socket: C,
            port: K,
            host: X
          }), U.on("session", function(R) {
            J.set(w, R)
          })
        } else LeQ(!C, "httpSocket can only be sent on TLS update"), K = K || 80, U = Fh8.connect({
          highWaterMark: 65536,
          ...Y,
          localAddress: H,
          port: K,
          host: X
        });
        if (Y.keepAlive == null || Y.keepAlive) {
          let w = Y.keepAliveInitialDelay === void 0 ? 60000 : Y.keepAliveInitialDelay;
          U.setKeepAlive(!0, w)
        }
        let q = Ch8(new WeakRef(U), {
          timeout: G,
          hostname: X,
          port: K
        });
        return U.setNoDelay(!0).once(F === "https:" ? "secureConnect" : "connect", function() {
          if (queueMicrotask(q), E) {
            let w = E;
            E = null, w(null, this)
          }
        }).on("error", function(w) {
          if (queueMicrotask(q), E) {
            let N = E;
            E = null, N(w)
          }
        }), U
      }
  }
  var Ch8 = process.platform === "win32" ? (A, Q) => {
    if (!Q.timeout) return MeQ;
    let B = null,
      G = null,
      Z = apA.setFastTimeout(() => {
        B = setImmediate(() => {
          G = setImmediate(() => OeQ(A.deref(), Q))
        })
      }, Q.timeout);
    return () => {
      apA.clearFastTimeout(Z), clearImmediate(B), clearImmediate(G)
    }
  } : (A, Q) => {
    if (!Q.timeout) return MeQ;
    let B = null,
      G = apA.setFastTimeout(() => {
        B = setImmediate(() => {
          OeQ(A.deref(), Q)
        })
      }, Q.timeout);
    return () => {
      apA.clearFastTimeout(G), clearImmediate(B)
    }
  };

  function OeQ(A, Q) {
    if (A == null) return;
    let B = "Connect Timeout Error";
    if (Array.isArray(A.autoSelectFamilyAttemptedAddresses)) B += ` (attempted addresses: ${A.autoSelectFamilyAttemptedAddresses.join(", ")},`;
    else B += ` (attempted address: ${Q.hostname}:${Q.port},`;
    B += ` timeout: ${Q.timeout}ms)`, ReQ.destroy(A, new Dh8(B))
  }
  TeQ.exports = Hh8
})
// @from(Start 4623858, End 4624148)
SeQ = z((PeQ) => {
  Object.defineProperty(PeQ, "__esModule", {
    value: !0
  });
  PeQ.enumToMap = void 0;

  function Eh8(A) {
    let Q = {};
    return Object.keys(A).forEach((B) => {
      let G = A[B];
      if (typeof G === "number") Q[B] = G
    }), Q
  }
  PeQ.enumToMap = Eh8
})
// @from(Start 4624154, End 4631478)
neQ = z((heQ) => {
  Object.defineProperty(heQ, "__esModule", {
    value: !0
  });
  heQ.SPECIAL_HEADERS = heQ.HEADER_STATE = heQ.MINOR = heQ.MAJOR = heQ.CONNECTION_TOKEN_CHARS = heQ.HEADER_CHARS = heQ.TOKEN = heQ.STRICT_TOKEN = heQ.HEX = heQ.URL_CHAR = heQ.STRICT_URL_CHAR = heQ.USERINFO_CHARS = heQ.MARK = heQ.ALPHANUM = heQ.NUM = heQ.HEX_MAP = heQ.NUM_MAP = heQ.ALPHA = heQ.FINISH = heQ.H_METHOD_MAP = heQ.METHOD_MAP = heQ.METHODS_RTSP = heQ.METHODS_ICE = heQ.METHODS_HTTP = heQ.METHODS = heQ.LENIENT_FLAGS = heQ.FLAGS = heQ.TYPE = heQ.ERROR = void 0;
  var zh8 = SeQ(),
    Uh8;
  (function(A) {
    A[A.OK = 0] = "OK", A[A.INTERNAL = 1] = "INTERNAL", A[A.STRICT = 2] = "STRICT", A[A.LF_EXPECTED = 3] = "LF_EXPECTED", A[A.UNEXPECTED_CONTENT_LENGTH = 4] = "UNEXPECTED_CONTENT_LENGTH", A[A.CLOSED_CONNECTION = 5] = "CLOSED_CONNECTION", A[A.INVALID_METHOD = 6] = "INVALID_METHOD", A[A.INVALID_URL = 7] = "INVALID_URL", A[A.INVALID_CONSTANT = 8] = "INVALID_CONSTANT", A[A.INVALID_VERSION = 9] = "INVALID_VERSION", A[A.INVALID_HEADER_TOKEN = 10] = "INVALID_HEADER_TOKEN", A[A.INVALID_CONTENT_LENGTH = 11] = "INVALID_CONTENT_LENGTH", A[A.INVALID_CHUNK_SIZE = 12] = "INVALID_CHUNK_SIZE", A[A.INVALID_STATUS = 13] = "INVALID_STATUS", A[A.INVALID_EOF_STATE = 14] = "INVALID_EOF_STATE", A[A.INVALID_TRANSFER_ENCODING = 15] = "INVALID_TRANSFER_ENCODING", A[A.CB_MESSAGE_BEGIN = 16] = "CB_MESSAGE_BEGIN", A[A.CB_HEADERS_COMPLETE = 17] = "CB_HEADERS_COMPLETE", A[A.CB_MESSAGE_COMPLETE = 18] = "CB_MESSAGE_COMPLETE", A[A.CB_CHUNK_HEADER = 19] = "CB_CHUNK_HEADER", A[A.CB_CHUNK_COMPLETE = 20] = "CB_CHUNK_COMPLETE", A[A.PAUSED = 21] = "PAUSED", A[A.PAUSED_UPGRADE = 22] = "PAUSED_UPGRADE", A[A.PAUSED_H2_UPGRADE = 23] = "PAUSED_H2_UPGRADE", A[A.USER = 24] = "USER"
  })(Uh8 = heQ.ERROR || (heQ.ERROR = {}));
  var $h8;
  (function(A) {
    A[A.BOTH = 0] = "BOTH", A[A.REQUEST = 1] = "REQUEST", A[A.RESPONSE = 2] = "RESPONSE"
  })($h8 = heQ.TYPE || (heQ.TYPE = {}));
  var wh8;
  (function(A) {
    A[A.CONNECTION_KEEP_ALIVE = 1] = "CONNECTION_KEEP_ALIVE", A[A.CONNECTION_CLOSE = 2] = "CONNECTION_CLOSE", A[A.CONNECTION_UPGRADE = 4] = "CONNECTION_UPGRADE", A[A.CHUNKED = 8] = "CHUNKED", A[A.UPGRADE = 16] = "UPGRADE", A[A.CONTENT_LENGTH = 32] = "CONTENT_LENGTH", A[A.SKIPBODY = 64] = "SKIPBODY", A[A.TRAILING = 128] = "TRAILING", A[A.TRANSFER_ENCODING = 512] = "TRANSFER_ENCODING"
  })(wh8 = heQ.FLAGS || (heQ.FLAGS = {}));
  var qh8;
  (function(A) {
    A[A.HEADERS = 1] = "HEADERS", A[A.CHUNKED_LENGTH = 2] = "CHUNKED_LENGTH", A[A.KEEP_ALIVE = 4] = "KEEP_ALIVE"
  })(qh8 = heQ.LENIENT_FLAGS || (heQ.LENIENT_FLAGS = {}));
  var c9;
  (function(A) {
    A[A.DELETE = 0] = "DELETE", A[A.GET = 1] = "GET", A[A.HEAD = 2] = "HEAD", A[A.POST = 3] = "POST", A[A.PUT = 4] = "PUT", A[A.CONNECT = 5] = "CONNECT", A[A.OPTIONS = 6] = "OPTIONS", A[A.TRACE = 7] = "TRACE", A[A.COPY = 8] = "COPY", A[A.LOCK = 9] = "LOCK", A[A.MKCOL = 10] = "MKCOL", A[A.MOVE = 11] = "MOVE", A[A.PROPFIND = 12] = "PROPFIND", A[A.PROPPATCH = 13] = "PROPPATCH", A[A.SEARCH = 14] = "SEARCH", A[A.UNLOCK = 15] = "UNLOCK", A[A.BIND = 16] = "BIND", A[A.REBIND = 17] = "REBIND", A[A.UNBIND = 18] = "UNBIND", A[A.ACL = 19] = "ACL", A[A.REPORT = 20] = "REPORT", A[A.MKACTIVITY = 21] = "MKACTIVITY", A[A.CHECKOUT = 22] = "CHECKOUT", A[A.MERGE = 23] = "MERGE", A[A["M-SEARCH"] = 24] = "M-SEARCH", A[A.NOTIFY = 25] = "NOTIFY", A[A.SUBSCRIBE = 26] = "SUBSCRIBE", A[A.UNSUBSCRIBE = 27] = "UNSUBSCRIBE", A[A.PATCH = 28] = "PATCH", A[A.PURGE = 29] = "PURGE", A[A.MKCALENDAR = 30] = "MKCALENDAR", A[A.LINK = 31] = "LINK", A[A.UNLINK = 32] = "UNLINK", A[A.SOURCE = 33] = "SOURCE", A[A.PRI = 34] = "PRI", A[A.DESCRIBE = 35] = "DESCRIBE", A[A.ANNOUNCE = 36] = "ANNOUNCE", A[A.SETUP = 37] = "SETUP", A[A.PLAY = 38] = "PLAY", A[A.PAUSE = 39] = "PAUSE", A[A.TEARDOWN = 40] = "TEARDOWN", A[A.GET_PARAMETER = 41] = "GET_PARAMETER", A[A.SET_PARAMETER = 42] = "SET_PARAMETER", A[A.REDIRECT = 43] = "REDIRECT", A[A.RECORD = 44] = "RECORD", A[A.FLUSH = 45] = "FLUSH"
  })(c9 = heQ.METHODS || (heQ.METHODS = {}));
  heQ.METHODS_HTTP = [c9.DELETE, c9.GET, c9.HEAD, c9.POST, c9.PUT, c9.CONNECT, c9.OPTIONS, c9.TRACE, c9.COPY, c9.LOCK, c9.MKCOL, c9.MOVE, c9.PROPFIND, c9.PROPPATCH, c9.SEARCH, c9.UNLOCK, c9.BIND, c9.REBIND, c9.UNBIND, c9.ACL, c9.REPORT, c9.MKACTIVITY, c9.CHECKOUT, c9.MERGE, c9["M-SEARCH"], c9.NOTIFY, c9.SUBSCRIBE, c9.UNSUBSCRIBE, c9.PATCH, c9.PURGE, c9.MKCALENDAR, c9.LINK, c9.UNLINK, c9.PRI, c9.SOURCE];
  heQ.METHODS_ICE = [c9.SOURCE];
  heQ.METHODS_RTSP = [c9.OPTIONS, c9.DESCRIBE, c9.ANNOUNCE, c9.SETUP, c9.PLAY, c9.PAUSE, c9.TEARDOWN, c9.GET_PARAMETER, c9.SET_PARAMETER, c9.REDIRECT, c9.RECORD, c9.FLUSH, c9.GET, c9.POST];
  heQ.METHOD_MAP = zh8.enumToMap(c9);
  heQ.H_METHOD_MAP = {};
  Object.keys(heQ.METHOD_MAP).forEach((A) => {
    if (/^H/.test(A)) heQ.H_METHOD_MAP[A] = heQ.METHOD_MAP[A]
  });
  var Nh8;
  (function(A) {
    A[A.SAFE = 0] = "SAFE", A[A.SAFE_WITH_CB = 1] = "SAFE_WITH_CB", A[A.UNSAFE = 2] = "UNSAFE"
  })(Nh8 = heQ.FINISH || (heQ.FINISH = {}));
  heQ.ALPHA = [];
  for (let A = 65; A <= 90; A++) heQ.ALPHA.push(String.fromCharCode(A)), heQ.ALPHA.push(String.fromCharCode(A + 32));
  heQ.NUM_MAP = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9
  };
  heQ.HEX_MAP = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15
  };
  heQ.NUM = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  heQ.ALPHANUM = heQ.ALPHA.concat(heQ.NUM);
  heQ.MARK = ["-", "_", ".", "!", "~", "*", "'", "(", ")"];
  heQ.USERINFO_CHARS = heQ.ALPHANUM.concat(heQ.MARK).concat(["%", ";", ":", "&", "=", "+", "$", ","]);
  heQ.STRICT_URL_CHAR = ["!", '"', "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~"].concat(heQ.ALPHANUM);
  heQ.URL_CHAR = heQ.STRICT_URL_CHAR.concat(["\t", "\f"]);
  for (let A = 128; A <= 255; A++) heQ.URL_CHAR.push(A);
  heQ.HEX = heQ.NUM.concat(["a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"]);
  heQ.STRICT_TOKEN = ["!", "#", "$", "%", "&", "'", "*", "+", "-", ".", "^", "_", "`", "|", "~"].concat(heQ.ALPHANUM);
  heQ.TOKEN = heQ.STRICT_TOKEN.concat([" "]);
  heQ.HEADER_CHARS = ["\t"];
  for (let A = 32; A <= 255; A++)
    if (A !== 127) heQ.HEADER_CHARS.push(A);
  heQ.CONNECTION_TOKEN_CHARS = heQ.HEADER_CHARS.filter((A) => A !== 44);
  heQ.MAJOR = heQ.NUM_MAP;
  heQ.MINOR = heQ.MAJOR;
  var r5A;
  (function(A) {
    A[A.GENERAL = 0] = "GENERAL", A[A.CONNECTION = 1] = "CONNECTION", A[A.CONTENT_LENGTH = 2] = "CONTENT_LENGTH", A[A.TRANSFER_ENCODING = 3] = "TRANSFER_ENCODING", A[A.UPGRADE = 4] = "UPGRADE", A[A.CONNECTION_KEEP_ALIVE = 5] = "CONNECTION_KEEP_ALIVE", A[A.CONNECTION_CLOSE = 6] = "CONNECTION_CLOSE", A[A.CONNECTION_UPGRADE = 7] = "CONNECTION_UPGRADE", A[A.TRANSFER_ENCODING_CHUNKED = 8] = "TRANSFER_ENCODING_CHUNKED"
  })(r5A = heQ.HEADER_STATE || (heQ.HEADER_STATE = {}));
  heQ.SPECIAL_HEADERS = {
    connection: r5A.CONNECTION,
    "content-length": r5A.CONTENT_LENGTH,
    "proxy-connection": r5A.CONNECTION,
    "transfer-encoding": r5A.TRANSFER_ENCODING,
    upgrade: r5A.UPGRADE
  }
})
// @from(Start 4781946, End 4800409)
xw = z((VS7, SAB) => {
  var {
    Transform: Fg8
  } = UA("node:stream"), HAB = UA("node:zlib"), {
    redirectStatusSet: Kg8,
    referrerPolicySet: Dg8,
    badPortsSet: Hg8
  } = PEA(), {
    getGlobalOrigin: CAB
  } = xy1(), {
    collectASequenceOfCodePoints: xo,
    collectAnHTTPQuotedString: Cg8,
    removeChars: Eg8,
    parseMIMEType: zg8
  } = QU(), {
    performance: Ug8
  } = UA("node:perf_hooks"), {
    isBlobLike: $g8,
    ReadableStreamFrom: wg8,
    isValidHTTPToken: EAB,
    normalizedMethodRecordsBase: qg8
  } = S6(), vo = UA("node:assert"), {
    isUint8Array: Ng8
  } = UA("node:util/types"), {
    webidl: SEA
  } = zD(), zAB = [], QlA;
  try {
    QlA = UA("node:crypto");
    let A = ["sha256", "sha384", "sha512"];
    zAB = QlA.getHashes().filter((Q) => A.includes(Q))
  } catch {}

  function UAB(A) {
    let Q = A.urlList,
      B = Q.length;
    return B === 0 ? null : Q[B - 1].toString()
  }

  function Lg8(A, Q) {
    if (!Kg8.has(A.status)) return null;
    let B = A.headersList.get("location", !0);
    if (B !== null && wAB(B)) {
      if (!$AB(B)) B = Mg8(B);
      B = new URL(B, UAB(A))
    }
    if (B && !B.hash) B.hash = Q;
    return B
  }

  function $AB(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (B > 126 || B < 32) return !1
    }
    return !0
  }

  function Mg8(A) {
    return Buffer.from(A, "binary").toString("utf8")
  }

  function kEA(A) {
    return A.urlList[A.urlList.length - 1]
  }

  function Og8(A) {
    let Q = kEA(A);
    if (OAB(Q) && Hg8.has(Q.port)) return "blocked";
    return "allowed"
  }

  function Rg8(A) {
    return A instanceof Error || (A?.constructor?.name === "Error" || A?.constructor?.name === "DOMException")
  }

  function Tg8(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (!(B === 9 || B >= 32 && B <= 126 || B >= 128 && B <= 255)) return !1
    }
    return !0
  }
  var Pg8 = EAB;

  function wAB(A) {
    return (A[0] === "\t" || A[0] === " " || A[A.length - 1] === "\t" || A[A.length - 1] === " " || A.includes(`
`) || A.includes("\r") || A.includes("\x00")) === !1
  }

  function jg8(A, Q) {
    let {
      headersList: B
    } = Q, G = (B.get("referrer-policy", !0) ?? "").split(","), Z = "";
    if (G.length > 0)
      for (let I = G.length; I !== 0; I--) {
        let Y = G[I - 1].trim();
        if (Dg8.has(Y)) {
          Z = Y;
          break
        }
      }
    if (Z !== "") A.referrerPolicy = Z
  }

  function Sg8() {
    return "allowed"
  }

  function _g8() {
    return "success"
  }

  function kg8() {
    return "success"
  }

  function yg8(A) {
    let Q = null;
    Q = A.mode, A.headersList.set("sec-fetch-mode", Q, !0)
  }

  function xg8(A) {
    let Q = A.origin;
    if (Q === "client" || Q === void 0) return;
    if (A.responseTainting === "cors" || A.mode === "websocket") A.headersList.append("origin", Q, !0);
    else if (A.method !== "GET" && A.method !== "HEAD") {
      switch (A.referrerPolicy) {
        case "no-referrer":
          Q = null;
          break;
        case "no-referrer-when-downgrade":
        case "strict-origin":
        case "strict-origin-when-cross-origin":
          if (A.origin && hy1(A.origin) && !hy1(kEA(A))) Q = null;
          break;
        case "same-origin":
          if (!BlA(A, kEA(A))) Q = null;
          break;
        default:
      }
      A.headersList.append("origin", Q, !0)
    }
  }

  function t5A(A, Q) {
    return A
  }

  function vg8(A, Q, B) {
    if (!A?.startTime || A.startTime < Q) return {
      domainLookupStartTime: Q,
      domainLookupEndTime: Q,
      connectionStartTime: Q,
      connectionEndTime: Q,
      secureConnectionStartTime: Q,
      ALPNNegotiatedProtocol: A?.ALPNNegotiatedProtocol
    };
    return {
      domainLookupStartTime: t5A(A.domainLookupStartTime, B),
      domainLookupEndTime: t5A(A.domainLookupEndTime, B),
      connectionStartTime: t5A(A.connectionStartTime, B),
      connectionEndTime: t5A(A.connectionEndTime, B),
      secureConnectionStartTime: t5A(A.secureConnectionStartTime, B),
      ALPNNegotiatedProtocol: A.ALPNNegotiatedProtocol
    }
  }

  function bg8(A) {
    return t5A(Ug8.now(), A)
  }

  function fg8(A) {
    return {
      startTime: A.startTime ?? 0,
      redirectStartTime: 0,
      redirectEndTime: 0,
      postRedirectStartTime: A.startTime ?? 0,
      finalServiceWorkerStartTime: 0,
      finalNetworkResponseStartTime: 0,
      finalNetworkRequestStartTime: 0,
      endTime: 0,
      encodedBodySize: 0,
      decodedBodySize: 0,
      finalConnectionTimingInfo: null
    }
  }

  function qAB() {
    return {
      referrerPolicy: "strict-origin-when-cross-origin"
    }
  }

  function hg8(A) {
    return {
      referrerPolicy: A.referrerPolicy
    }
  }

  function gg8(A) {
    let Q = A.referrerPolicy;
    vo(Q);
    let B = null;
    if (A.referrer === "client") {
      let J = CAB();
      if (!J || J.origin === "null") return "no-referrer";
      B = new URL(J)
    } else if (A.referrer instanceof URL) B = A.referrer;
    let G = fy1(B),
      Z = fy1(B, !0);
    if (G.toString().length > 4096) G = Z;
    let I = BlA(A, G),
      Y = _EA(G) && !_EA(A.url);
    switch (Q) {
      case "origin":
        return Z != null ? Z : fy1(B, !0);
      case "unsafe-url":
        return G;
      case "same-origin":
        return I ? Z : "no-referrer";
      case "origin-when-cross-origin":
        return I ? G : Z;
      case "strict-origin-when-cross-origin": {
        let J = kEA(A);
        if (BlA(G, J)) return G;
        if (_EA(G) && !_EA(J)) return "no-referrer";
        return Z
      }
      case "strict-origin":
      case "no-referrer-when-downgrade":
      default:
        return Y ? "no-referrer" : Z
    }
  }

  function fy1(A, Q) {
    if (vo(A instanceof URL), A = new URL(A), A.protocol === "file:" || A.protocol === "about:" || A.protocol === "blank:") return "no-referrer";
    if (A.username = "", A.password = "", A.hash = "", Q) A.pathname = "", A.search = "";
    return A
  }

  function _EA(A) {
    if (!(A instanceof URL)) return !1;
    if (A.href === "about:blank" || A.href === "about:srcdoc") return !0;
    if (A.protocol === "data:") return !0;
    if (A.protocol === "file:") return !0;
    return Q(A.origin);

    function Q(B) {
      if (B == null || B === "null") return !1;
      let G = new URL(B);
      if (G.protocol === "https:" || G.protocol === "wss:") return !0;
      if (/^127(?:\.[0-9]+){0,2}\.[0-9]+$|^\[(?:0*:)*?:?0*1\]$/.test(G.hostname) || (G.hostname === "localhost" || G.hostname.includes("localhost.")) || G.hostname.endsWith(".localhost")) return !0;
      return !1
    }
  }

  function ug8(A, Q) {
    if (QlA === void 0) return !0;
    let B = NAB(Q);
    if (B === "no metadata") return !0;
    if (B.length === 0) return !0;
    let G = dg8(B),
      Z = cg8(B, G);
    for (let I of Z) {
      let {
        algo: Y,
        hash: J
      } = I, W = QlA.createHash(Y).update(A).digest("base64");
      if (W[W.length - 1] === "=")
        if (W[W.length - 2] === "=") W = W.slice(0, -2);
        else W = W.slice(0, -1);
      if (pg8(W, J)) return !0
    }
    return !1
  }
  var mg8 = /(?<algo>sha256|sha384|sha512)-((?<hash>[A-Za-z0-9+/]+|[A-Za-z0-9_-]+)={0,2}(?:\s|$)( +[!-~]*)?)?/i;

  function NAB(A) {
    let Q = [],
      B = !0;
    for (let G of A.split(" ")) {
      B = !1;
      let Z = mg8.exec(G);
      if (Z === null || Z.groups === void 0 || Z.groups.algo === void 0) continue;
      let I = Z.groups.algo.toLowerCase();
      if (zAB.includes(I)) Q.push(Z.groups)
    }
    if (B === !0) return "no metadata";
    return Q
  }

  function dg8(A) {
    let Q = A[0].algo;
    if (Q[3] === "5") return Q;
    for (let B = 1; B < A.length; ++B) {
      let G = A[B];
      if (G.algo[3] === "5") {
        Q = "sha512";
        break
      } else if (Q[3] === "3") continue;
      else if (G.algo[3] === "3") Q = "sha384"
    }
    return Q
  }

  function cg8(A, Q) {
    if (A.length === 1) return A;
    let B = 0;
    for (let G = 0; G < A.length; ++G)
      if (A[G].algo === Q) A[B++] = A[G];
    return A.length = B, A
  }

  function pg8(A, Q) {
    if (A.length !== Q.length) return !1;
    for (let B = 0; B < A.length; ++B)
      if (A[B] !== Q[B]) {
        if (A[B] === "+" && Q[B] === "-" || A[B] === "/" && Q[B] === "_") continue;
        return !1
      } return !0
  }

  function lg8(A) {}

  function BlA(A, Q) {
    if (A.origin === Q.origin && A.origin === "null") return !0;
    if (A.protocol === Q.protocol && A.hostname === Q.hostname && A.port === Q.port) return !0;
    return !1
  }

  function ig8() {
    let A, Q;
    return {
      promise: new Promise((G, Z) => {
        A = G, Q = Z
      }),
      resolve: A,
      reject: Q
    }
  }

  function ng8(A) {
    return A.controller.state === "aborted"
  }

  function ag8(A) {
    return A.controller.state === "aborted" || A.controller.state === "terminated"
  }

  function sg8(A) {
    return qg8[A.toLowerCase()] ?? A
  }

  function rg8(A) {
    let Q = JSON.stringify(A);
    if (Q === void 0) throw TypeError("Value is not JSON serializable");
    return vo(typeof Q === "string"), Q
  }
  var og8 = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

  function LAB(A, Q, B = 0, G = 1) {
    class Z {
      #A;
      #Q;
      #B;
      constructor(I, Y) {
        this.#A = I, this.#Q = Y, this.#B = 0
      }
      next() {
        if (typeof this !== "object" || this === null || !(#A in this)) throw TypeError(`'next' called on an object that does not implement interface ${A} Iterator.`);
        let I = this.#B,
          Y = this.#A[Q],
          J = Y.length;
        if (I >= J) return {
          value: void 0,
          done: !0
        };
        let {
          [B]: W, [G]: X
        } = Y[I];
        this.#B = I + 1;
        let V;
        switch (this.#Q) {
          case "key":
            V = W;
            break;
          case "value":
            V = X;
            break;
          case "key+value":
            V = [W, X];
            break
        }
        return {
          value: V,
          done: !1
        }
      }
    }
    return delete Z.prototype.constructor, Object.setPrototypeOf(Z.prototype, og8), Object.defineProperties(Z.prototype, {
        [Symbol.toStringTag]: {
          writable: !1,
          enumerable: !1,
          configurable: !0,
          value: `${A} Iterator`
        },
        next: {
          writable: !0,
          enumerable: !0,
          configurable: !0
        }
      }),
      function(I, Y) {
        return new Z(I, Y)
      }
  }

  function tg8(A, Q, B, G = 0, Z = 1) {
    let I = LAB(A, B, G, Z),
      Y = {
        keys: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function() {
            return SEA.brandCheck(this, Q), I(this, "key")
          }
        },
        values: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function() {
            return SEA.brandCheck(this, Q), I(this, "value")
          }
        },
        entries: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function() {
            return SEA.brandCheck(this, Q), I(this, "key+value")
          }
        },
        forEach: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function(W, X = globalThis) {
            if (SEA.brandCheck(this, Q), SEA.argumentLengthCheck(arguments, 1, `${A}.forEach`), typeof W !== "function") throw TypeError(`Failed to execute 'forEach' on '${A}': parameter 1 is not of type 'Function'.`);
            for (let {
                0: V,
                1: F
              }
              of I(this, "key+value")) W.call(X, F, V, this)
          }
        }
      };
    return Object.defineProperties(Q.prototype, {
      ...Y,
      [Symbol.iterator]: {
        writable: !0,
        enumerable: !1,
        configurable: !0,
        value: Y.entries.value
      }
    })
  }
  async function eg8(A, Q, B) {
    let G = Q,
      Z = B,
      I;
    try {
      I = A.stream.getReader()
    } catch (Y) {
      Z(Y);
      return
    }
    try {
      G(await MAB(I))
    } catch (Y) {
      Z(Y)
    }
  }

  function Au8(A) {
    return A instanceof ReadableStream || A[Symbol.toStringTag] === "ReadableStream" && typeof A.tee === "function"
  }

  function Qu8(A) {
    try {
      A.close(), A.byobRequest?.respond(0)
    } catch (Q) {
      if (!Q.message.includes("Controller is already closed") && !Q.message.includes("ReadableStream is already closed")) throw Q
    }
  }
  var Bu8 = /[^\x00-\xFF]/;

  function AlA(A) {
    return vo(!Bu8.test(A)), A
  }
  async function MAB(A) {
    let Q = [],
      B = 0;
    while (!0) {
      let {
        done: G,
        value: Z
      } = await A.read();
      if (G) return Buffer.concat(Q, B);
      if (!Ng8(Z)) throw TypeError("Received non-Uint8Array chunk");
      Q.push(Z), B += Z.length
    }
  }

  function Gu8(A) {
    vo("protocol" in A);
    let Q = A.protocol;
    return Q === "about:" || Q === "blob:" || Q === "data:"
  }

  function hy1(A) {
    return typeof A === "string" && A[5] === ":" && A[0] === "h" && A[1] === "t" && A[2] === "t" && A[3] === "p" && A[4] === "s" || A.protocol === "https:"
  }

  function OAB(A) {
    vo("protocol" in A);
    let Q = A.protocol;
    return Q === "http:" || Q === "https:"
  }

  function Zu8(A, Q) {
    let B = A;
    if (!B.startsWith("bytes")) return "failure";
    let G = {
      position: 5
    };
    if (Q) xo((W) => W === "\t" || W === " ", B, G);
    if (B.charCodeAt(G.position) !== 61) return "failure";
    if (G.position++, Q) xo((W) => W === "\t" || W === " ", B, G);
    let Z = xo((W) => {
        let X = W.charCodeAt(0);
        return X >= 48 && X <= 57
      }, B, G),
      I = Z.length ? Number(Z) : null;
    if (Q) xo((W) => W === "\t" || W === " ", B, G);
    if (B.charCodeAt(G.position) !== 45) return "failure";
    if (G.position++, Q) xo((W) => W === "\t" || W === " ", B, G);
    let Y = xo((W) => {
        let X = W.charCodeAt(0);
        return X >= 48 && X <= 57
      }, B, G),
      J = Y.length ? Number(Y) : null;
    if (G.position < B.length) return "failure";
    if (J === null && I === null) return "failure";
    if (I > J) return "failure";
    return {
      rangeStartValue: I,
      rangeEndValue: J
    }
  }

  function Iu8(A, Q, B) {
    let G = "bytes ";
    return G += AlA(`${A}`), G += "-", G += AlA(`${Q}`), G += "/", G += AlA(`${B}`), G
  }
  class RAB extends Fg8 {
    #A;
    constructor(A) {
      super();
      this.#A = A
    }
    _transform(A, Q, B) {
      if (!this._inflateStream) {
        if (A.length === 0) {
          B();
          return
        }
        this._inflateStream = (A[0] & 15) === 8 ? HAB.createInflate(this.#A) : HAB.createInflateRaw(this.#A), this._inflateStream.on("data", this.push.bind(this)), this._inflateStream.on("end", () => this.push(null)), this._inflateStream.on("error", (G) => this.destroy(G))
      }
      this._inflateStream.write(A, Q, B)
    }
    _final(A) {
      if (this._inflateStream) this._inflateStream.end(), this._inflateStream = null;
      A()
    }
  }

  function Yu8(A) {
    return new RAB(A)
  }

  function Ju8(A) {
    let Q = null,
      B = null,
      G = null,
      Z = TAB("content-type", A);
    if (Z === null) return "failure";
    for (let I of Z) {
      let Y = zg8(I);
      if (Y === "failure" || Y.essence === "*/*") continue;
      if (G = Y, G.essence !== B) {
        if (Q = null, G.parameters.has("charset")) Q = G.parameters.get("charset");
        B = G.essence
      } else if (!G.parameters.has("charset") && Q !== null) G.parameters.set("charset", Q)
    }
    if (G == null) return "failure";
    return G
  }

  function Wu8(A) {
    let Q = A,
      B = {
        position: 0
      },
      G = [],
      Z = "";
    while (B.position < Q.length) {
      if (Z += xo((I) => I !== '"' && I !== ",", Q, B), B.position < Q.length)
        if (Q.charCodeAt(B.position) === 34) {
          if (Z += Cg8(Q, B), B.position < Q.length) continue
        } else vo(Q.charCodeAt(B.position) === 44), B.position++;
      Z = Eg8(Z, !0, !0, (I) => I === 9 || I === 32), G.push(Z), Z = ""
    }
    return G
  }

  function TAB(A, Q) {
    let B = Q.get(A, !0);
    if (B === null) return null;
    return Wu8(B)
  }
  var Xu8 = new TextDecoder;

  function Vu8(A) {
    if (A.length === 0) return "";
    if (A[0] === 239 && A[1] === 187 && A[2] === 191) A = A.subarray(3);
    return Xu8.decode(A)
  }
  class PAB {
    get baseUrl() {
      return CAB()
    }
    get origin() {
      return this.baseUrl?.origin
    }
    policyContainer = qAB()
  }
  class jAB {
    settingsObject = new PAB
  }
  var Fu8 = new jAB;
  SAB.exports = {
    isAborted: ng8,
    isCancelled: ag8,
    isValidEncodedURL: $AB,
    createDeferredPromise: ig8,
    ReadableStreamFrom: wg8,
    tryUpgradeRequestToAPotentiallyTrustworthyURL: lg8,
    clampAndCoarsenConnectionTimingInfo: vg8,
    coarsenedSharedCurrentTime: bg8,
    determineRequestsReferrer: gg8,
    makePolicyContainer: qAB,
    clonePolicyContainer: hg8,
    appendFetchMetadata: yg8,
    appendRequestOriginHeader: xg8,
    TAOCheck: kg8,
    corsCheck: _g8,
    crossOriginResourcePolicyCheck: Sg8,
    createOpaqueTimingInfo: fg8,
    setRequestReferrerPolicyOnRedirect: jg8,
    isValidHTTPToken: EAB,
    requestBadPort: Og8,
    requestCurrentURL: kEA,
    responseURL: UAB,
    responseLocationURL: Lg8,
    isBlobLike: $g8,
    isURLPotentiallyTrustworthy: _EA,
    isValidReasonPhrase: Tg8,
    sameOrigin: BlA,
    normalizeMethod: sg8,
    serializeJavascriptValueToJSONString: rg8,
    iteratorMixin: tg8,
    createIterator: LAB,
    isValidHeaderName: Pg8,
    isValidHeaderValue: wAB,
    isErrorLike: Rg8,
    fullyReadBody: eg8,
    bytesMatch: ug8,
    isReadableStreamLike: Au8,
    readableStreamClose: Qu8,
    isomorphicEncode: AlA,
    urlIsLocal: Gu8,
    urlHasHttpsScheme: hy1,
    urlIsHttpHttpsScheme: OAB,
    readAllBytes: MAB,
    simpleRangeHeaderValue: Zu8,
    buildContentRange: Iu8,
    parseMetadata: NAB,
    createInflate: Yu8,
    extractMimeType: Ju8,
    getDecodeSplit: TAB,
    utf8DecodeBytes: Vu8,
    environmentSettingsObject: Fu8
  }
})
// @from(Start 4800415, End 4800618)
Kc = z((FS7, _AB) => {
  _AB.exports = {
    kUrl: Symbol("url"),
    kHeaders: Symbol("headers"),
    kSignal: Symbol("signal"),
    kState: Symbol("state"),
    kDispatcher: Symbol("dispatcher")
  }
})
// @from(Start 4800624, End 4802062)
gy1 = z((KS7, kAB) => {
  var {
    Blob: Ku8,
    File: Du8
  } = UA("node:buffer"), {
    kState: Tb
  } = Kc(), {
    webidl: W_
  } = zD();
  class X_ {
    constructor(A, Q, B = {}) {
      let G = Q,
        Z = B.type,
        I = B.lastModified ?? Date.now();
      this[Tb] = {
        blobLike: A,
        name: G,
        type: Z,
        lastModified: I
      }
    }
    stream(...A) {
      return W_.brandCheck(this, X_), this[Tb].blobLike.stream(...A)
    }
    arrayBuffer(...A) {
      return W_.brandCheck(this, X_), this[Tb].blobLike.arrayBuffer(...A)
    }
    slice(...A) {
      return W_.brandCheck(this, X_), this[Tb].blobLike.slice(...A)
    }
    text(...A) {
      return W_.brandCheck(this, X_), this[Tb].blobLike.text(...A)
    }
    get size() {
      return W_.brandCheck(this, X_), this[Tb].blobLike.size
    }
    get type() {
      return W_.brandCheck(this, X_), this[Tb].blobLike.type
    }
    get name() {
      return W_.brandCheck(this, X_), this[Tb].name
    }
    get lastModified() {
      return W_.brandCheck(this, X_), this[Tb].lastModified
    }
    get[Symbol.toStringTag]() {
      return "File"
    }
  }
  W_.converters.Blob = W_.interfaceConverter(Ku8);

  function Hu8(A) {
    return A instanceof Du8 || A && (typeof A.stream === "function" || typeof A.arrayBuffer === "function") && A[Symbol.toStringTag] === "File"
  }
  kAB.exports = {
    FileLike: X_,
    isFileLike: Hu8
  }
})
// @from(Start 4802068, End 4806219)
yEA = z((DS7, fAB) => {
  var {
    isBlobLike: GlA,
    iteratorMixin: Cu8
  } = xw(), {
    kState: oC
  } = Kc(), {
    kEnumerableProperty: e5A
  } = S6(), {
    FileLike: yAB,
    isFileLike: Eu8
  } = gy1(), {
    webidl: yZ
  } = zD(), {
    File: bAB
  } = UA("node:buffer"), xAB = UA("node:util"), vAB = globalThis.File ?? bAB;
  class V_ {
    constructor(A) {
      if (yZ.util.markAsUncloneable(this), A !== void 0) throw yZ.errors.conversionFailed({
        prefix: "FormData constructor",
        argument: "Argument 1",
        types: ["undefined"]
      });
      this[oC] = []
    }
    append(A, Q, B = void 0) {
      yZ.brandCheck(this, V_);
      let G = "FormData.append";
      if (yZ.argumentLengthCheck(arguments, 2, G), arguments.length === 3 && !GlA(Q)) throw TypeError("Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'");
      A = yZ.converters.USVString(A, G, "name"), Q = GlA(Q) ? yZ.converters.Blob(Q, G, "value", {
        strict: !1
      }) : yZ.converters.USVString(Q, G, "value"), B = arguments.length === 3 ? yZ.converters.USVString(B, G, "filename") : void 0;
      let Z = uy1(A, Q, B);
      this[oC].push(Z)
    }
    delete(A) {
      yZ.brandCheck(this, V_);
      let Q = "FormData.delete";
      yZ.argumentLengthCheck(arguments, 1, Q), A = yZ.converters.USVString(A, Q, "name"), this[oC] = this[oC].filter((B) => B.name !== A)
    }
    get(A) {
      yZ.brandCheck(this, V_);
      let Q = "FormData.get";
      yZ.argumentLengthCheck(arguments, 1, Q), A = yZ.converters.USVString(A, Q, "name");
      let B = this[oC].findIndex((G) => G.name === A);
      if (B === -1) return null;
      return this[oC][B].value
    }
    getAll(A) {
      yZ.brandCheck(this, V_);
      let Q = "FormData.getAll";
      return yZ.argumentLengthCheck(arguments, 1, Q), A = yZ.converters.USVString(A, Q, "name"), this[oC].filter((B) => B.name === A).map((B) => B.value)
    }
    has(A) {
      yZ.brandCheck(this, V_);
      let Q = "FormData.has";
      return yZ.argumentLengthCheck(arguments, 1, Q), A = yZ.converters.USVString(A, Q, "name"), this[oC].findIndex((B) => B.name === A) !== -1
    }
    set(A, Q, B = void 0) {
      yZ.brandCheck(this, V_);
      let G = "FormData.set";
      if (yZ.argumentLengthCheck(arguments, 2, G), arguments.length === 3 && !GlA(Q)) throw TypeError("Failed to execute 'set' on 'FormData': parameter 2 is not of type 'Blob'");
      A = yZ.converters.USVString(A, G, "name"), Q = GlA(Q) ? yZ.converters.Blob(Q, G, "name", {
        strict: !1
      }) : yZ.converters.USVString(Q, G, "name"), B = arguments.length === 3 ? yZ.converters.USVString(B, G, "name") : void 0;
      let Z = uy1(A, Q, B),
        I = this[oC].findIndex((Y) => Y.name === A);
      if (I !== -1) this[oC] = [...this[oC].slice(0, I), Z, ...this[oC].slice(I + 1).filter((Y) => Y.name !== A)];
      else this[oC].push(Z)
    } [xAB.inspect.custom](A, Q) {
      let B = this[oC].reduce((Z, I) => {
        if (Z[I.name])
          if (Array.isArray(Z[I.name])) Z[I.name].push(I.value);
          else Z[I.name] = [Z[I.name], I.value];
        else Z[I.name] = I.value;
        return Z
      }, {
        __proto__: null
      });
      Q.depth ??= A, Q.colors ??= !0;
      let G = xAB.formatWithOptions(Q, B);
      return `FormData ${G.slice(G.indexOf("]")+2)}`
    }
  }
  Cu8("FormData", V_, oC, "name", "value");
  Object.defineProperties(V_.prototype, {
    append: e5A,
    delete: e5A,
    get: e5A,
    getAll: e5A,
    has: e5A,
    set: e5A,
    [Symbol.toStringTag]: {
      value: "FormData",
      configurable: !0
    }
  });

  function uy1(A, Q, B) {
    if (typeof Q === "string");
    else {
      if (!Eu8(Q)) Q = Q instanceof Blob ? new vAB([Q], "blob", {
        type: Q.type
      }) : new yAB(Q, "blob", {
        type: Q.type
      });
      if (B !== void 0) {
        let G = {
          type: Q.type,
          lastModified: Q.lastModified
        };
        Q = Q instanceof bAB ? new vAB([Q], B, G) : new yAB(Q, B, G)
      }
    }
    return {
      name: A,
      value: Q
    }
  }
  fAB.exports = {
    FormData: V_,
    makeEntry: uy1
  }
})
// @from(Start 4806225, End 4811459)
cAB = z((HS7, dAB) => {
  var {
    isUSVString: hAB,
    bufferToLowerCasedHeaderName: zu8
  } = S6(), {
    utf8DecodeBytes: Uu8
  } = xw(), {
    HTTP_TOKEN_CODEPOINTS: $u8,
    isomorphicDecode: gAB
  } = QU(), {
    isFileLike: wu8
  } = gy1(), {
    makeEntry: qu8
  } = yEA(), ZlA = UA("node:assert"), {
    File: Nu8
  } = UA("node:buffer"), Lu8 = globalThis.File ?? Nu8, Mu8 = Buffer.from('form-data; name="'), uAB = Buffer.from("; filename"), Ou8 = Buffer.from("--"), Ru8 = Buffer.from(`--\r
`);

  function Tu8(A) {
    for (let Q = 0; Q < A.length; ++Q)
      if ((A.charCodeAt(Q) & -128) !== 0) return !1;
    return !0
  }

  function Pu8(A) {
    let Q = A.length;
    if (Q < 27 || Q > 70) return !1;
    for (let B = 0; B < Q; ++B) {
      let G = A.charCodeAt(B);
      if (!(G >= 48 && G <= 57 || G >= 65 && G <= 90 || G >= 97 && G <= 122 || G === 39 || G === 45 || G === 95)) return !1
    }
    return !0
  }

  function ju8(A, Q) {
    ZlA(Q !== "failure" && Q.essence === "multipart/form-data");
    let B = Q.parameters.get("boundary");
    if (B === void 0) return "failure";
    let G = Buffer.from(`--${B}`, "utf8"),
      Z = [],
      I = {
        position: 0
      };
    while (A[I.position] === 13 && A[I.position + 1] === 10) I.position += 2;
    let Y = A.length;
    while (A[Y - 1] === 10 && A[Y - 2] === 13) Y -= 2;
    if (Y !== A.length) A = A.subarray(0, Y);
    while (!0) {
      if (A.subarray(I.position, I.position + G.length).equals(G)) I.position += G.length;
      else return "failure";
      if (I.position === A.length - 2 && IlA(A, Ou8, I) || I.position === A.length - 4 && IlA(A, Ru8, I)) return Z;
      if (A[I.position] !== 13 || A[I.position + 1] !== 10) return "failure";
      I.position += 2;
      let J = Su8(A, I);
      if (J === "failure") return "failure";
      let {
        name: W,
        filename: X,
        contentType: V,
        encoding: F
      } = J;
      I.position += 2;
      let K;
      {
        let H = A.indexOf(G.subarray(2), I.position);
        if (H === -1) return "failure";
        if (K = A.subarray(I.position, H - 4), I.position += K.length, F === "base64") K = Buffer.from(K.toString(), "base64")
      }
      if (A[I.position] !== 13 || A[I.position + 1] !== 10) return "failure";
      else I.position += 2;
      let D;
      if (X !== null) {
        if (V ??= "text/plain", !Tu8(V)) V = "";
        D = new Lu8([K], X, {
          type: V
        })
      } else D = Uu8(Buffer.from(K));
      ZlA(hAB(W)), ZlA(typeof D === "string" && hAB(D) || wu8(D)), Z.push(qu8(W, D, X))
    }
  }

  function Su8(A, Q) {
    let B = null,
      G = null,
      Z = null,
      I = null;
    while (!0) {
      if (A[Q.position] === 13 && A[Q.position + 1] === 10) {
        if (B === null) return "failure";
        return {
          name: B,
          filename: G,
          contentType: Z,
          encoding: I
        }
      }
      let Y = A3A((J) => J !== 10 && J !== 13 && J !== 58, A, Q);
      if (Y = my1(Y, !0, !0, (J) => J === 9 || J === 32), !$u8.test(Y.toString())) return "failure";
      if (A[Q.position] !== 58) return "failure";
      switch (Q.position++, A3A((J) => J === 32 || J === 9, A, Q), zu8(Y)) {
        case "content-disposition": {
          if (B = G = null, !IlA(A, Mu8, Q)) return "failure";
          if (Q.position += 17, B = mAB(A, Q), B === null) return "failure";
          if (IlA(A, uAB, Q)) {
            let J = Q.position + uAB.length;
            if (A[J] === 42) Q.position += 1, J += 1;
            if (A[J] !== 61 || A[J + 1] !== 34) return "failure";
            if (Q.position += 12, G = mAB(A, Q), G === null) return "failure"
          }
          break
        }
        case "content-type": {
          let J = A3A((W) => W !== 10 && W !== 13, A, Q);
          J = my1(J, !1, !0, (W) => W === 9 || W === 32), Z = gAB(J);
          break
        }
        case "content-transfer-encoding": {
          let J = A3A((W) => W !== 10 && W !== 13, A, Q);
          J = my1(J, !1, !0, (W) => W === 9 || W === 32), I = gAB(J);
          break
        }
        default:
          A3A((J) => J !== 10 && J !== 13, A, Q)
      }
      if (A[Q.position] !== 13 && A[Q.position + 1] !== 10) return "failure";
      else Q.position += 2
    }
  }

  function mAB(A, Q) {
    ZlA(A[Q.position - 1] === 34);
    let B = A3A((G) => G !== 10 && G !== 13 && G !== 34, A, Q);
    if (A[Q.position] !== 34) return null;
    else Q.position++;
    return B = new TextDecoder().decode(B).replace(/%0A/ig, `
`).replace(/%0D/ig, "\r").replace(/%22/g, '"'), B
  }

  function A3A(A, Q, B) {
    let G = B.position;
    while (G < Q.length && A(Q[G])) ++G;
    return Q.subarray(B.position, B.position = G)
  }

  function my1(A, Q, B, G) {
    let Z = 0,
      I = A.length - 1;
    if (Q)
      while (Z < A.length && G(A[Z])) Z++;
    if (B)
      while (I > 0 && G(A[I])) I--;
    return Z === 0 && I === A.length - 1 ? A : A.subarray(Z, I + 1)
  }

  function IlA(A, Q, B) {
    if (A.length < Q.length) return !1;
    for (let G = 0; G < Q.length; G++)
      if (Q[G] !== A[B.position + G]) return !1;
    return !0
  }
  dAB.exports = {
    multipartFormDataParser: ju8,
    validateBoundary: Pu8
  }
})
// @from(Start 4811465, End 4818772)
G3A = z((CS7, oAB) => {
  var xEA = S6(),
    {
      ReadableStreamFrom: _u8,
      isBlobLike: pAB,
      isReadableStreamLike: ku8,
      readableStreamClose: yu8,
      createDeferredPromise: xu8,
      fullyReadBody: vu8,
      extractMimeType: bu8,
      utf8DecodeBytes: nAB
    } = xw(),
    {
      FormData: lAB
    } = yEA(),
    {
      kState: B3A
    } = Kc(),
    {
      webidl: fu8
    } = zD(),
    {
      Blob: hu8
    } = UA("node:buffer"),
    dy1 = UA("node:assert"),
    {
      isErrored: aAB,
      isDisturbed: gu8
    } = UA("node:stream"),
    {
      isArrayBuffer: uu8
    } = UA("node:util/types"),
    {
      serializeAMimeType: mu8
    } = QU(),
    {
      multipartFormDataParser: du8
    } = cAB(),
    cy1;
  try {
    let A = UA("node:crypto");
    cy1 = (Q) => A.randomInt(0, Q)
  } catch {
    cy1 = (A) => Math.floor(Math.random(A))
  }
  var YlA = new TextEncoder;

  function cu8() {}
  var py1 = globalThis.FinalizationRegistry && process.version.indexOf("v18") !== 0,
    ly1;
  if (py1) ly1 = new FinalizationRegistry((A) => {
    let Q = A.deref();
    if (Q && !Q.locked && !gu8(Q) && !aAB(Q)) Q.cancel("Response object has been garbage collected").catch(cu8)
  });

  function sAB(A, Q = !1) {
    let B = null;
    if (A instanceof ReadableStream) B = A;
    else if (pAB(A)) B = A.stream();
    else B = new ReadableStream({
      async pull(W) {
        let X = typeof Z === "string" ? YlA.encode(Z) : Z;
        if (X.byteLength) W.enqueue(X);
        queueMicrotask(() => yu8(W))
      },
      start() {},
      type: "bytes"
    });
    dy1(ku8(B));
    let G = null,
      Z = null,
      I = null,
      Y = null;
    if (typeof A === "string") Z = A, Y = "text/plain;charset=UTF-8";
    else if (A instanceof URLSearchParams) Z = A.toString(), Y = "application/x-www-form-urlencoded;charset=UTF-8";
    else if (uu8(A)) Z = new Uint8Array(A.slice());
    else if (ArrayBuffer.isView(A)) Z = new Uint8Array(A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength));
    else if (xEA.isFormDataLike(A)) {
      let W = `----formdata-undici-0${`${cy1(100000000000)}`.padStart(11,"0")}`,
        X = `--${W}\r
Content-Disposition: form-data`; /*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
      let V = (E) => E.replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"),
        F = (E) => E.replace(/\r?\n|\r/g, `\r
`),
        K = [],
        D = new Uint8Array([13, 10]);
      I = 0;
      let H = !1;
      for (let [E, U] of A)
        if (typeof U === "string") {
          let q = YlA.encode(X + `; name="${V(F(E))}"\r
\r
${F(U)}\r
`);
          K.push(q), I += q.byteLength
        } else {
          let q = YlA.encode(`${X}; name="${V(F(E))}"` + (U.name ? `; filename="${V(U.name)}"` : "") + `\r
Content-Type: ${U.type||"application/octet-stream"}\r
\r
`);
          if (K.push(q, U, D), typeof U.size === "number") I += q.byteLength + U.size + D.byteLength;
          else H = !0
        } let C = YlA.encode(`--${W}--`);
      if (K.push(C), I += C.byteLength, H) I = null;
      Z = A, G = async function*() {
        for (let E of K)
          if (E.stream) yield* E.stream();
          else yield E
      }, Y = `multipart/form-data; boundary=${W}`
    } else if (pAB(A)) {
      if (Z = A, I = A.size, A.type) Y = A.type
    } else if (typeof A[Symbol.asyncIterator] === "function") {
      if (Q) throw TypeError("keepalive");
      if (xEA.isDisturbed(A) || A.locked) throw TypeError("Response body object should not be disturbed or locked");
      B = A instanceof ReadableStream ? A : _u8(A)
    }
    if (typeof Z === "string" || xEA.isBuffer(Z)) I = Buffer.byteLength(Z);
    if (G != null) {
      let W;
      B = new ReadableStream({
        async start() {
          W = G(A)[Symbol.asyncIterator]()
        },
        async pull(X) {
          let {
            value: V,
            done: F
          } = await W.next();
          if (F) queueMicrotask(() => {
            X.close(), X.byobRequest?.respond(0)
          });
          else if (!aAB(B)) {
            let K = new Uint8Array(V);
            if (K.byteLength) X.enqueue(K)
          }
          return X.desiredSize > 0
        },
        async cancel(X) {
          await W.return()
        },
        type: "bytes"
      })
    }
    return [{
      stream: B,
      source: Z,
      length: I
    }, Y]
  }

  function pu8(A, Q = !1) {
    if (A instanceof ReadableStream) dy1(!xEA.isDisturbed(A), "The body has already been consumed."), dy1(!A.locked, "The stream is locked.");
    return sAB(A, Q)
  }

  function lu8(A, Q) {
    let [B, G] = Q.stream.tee();
    if (py1) ly1.register(A, new WeakRef(B));
    return Q.stream = B, {
      stream: G,
      length: Q.length,
      source: Q.source
    }
  }

  function iu8(A) {
    if (A.aborted) throw new DOMException("The operation was aborted.", "AbortError")
  }

  function nu8(A) {
    return {
      blob() {
        return Q3A(this, (B) => {
          let G = iAB(this);
          if (G === null) G = "";
          else if (G) G = mu8(G);
          return new hu8([B], {
            type: G
          })
        }, A)
      },
      arrayBuffer() {
        return Q3A(this, (B) => {
          return new Uint8Array(B).buffer
        }, A)
      },
      text() {
        return Q3A(this, nAB, A)
      },
      json() {
        return Q3A(this, su8, A)
      },
      formData() {
        return Q3A(this, (B) => {
          let G = iAB(this);
          if (G !== null) switch (G.essence) {
            case "multipart/form-data": {
              let Z = du8(B, G);
              if (Z === "failure") throw TypeError("Failed to parse body as FormData.");
              let I = new lAB;
              return I[B3A] = Z, I
            }
            case "application/x-www-form-urlencoded": {
              let Z = new URLSearchParams(B.toString()),
                I = new lAB;
              for (let [Y, J] of Z) I.append(Y, J);
              return I
            }
          }
          throw TypeError('Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded".')
        }, A)
      },
      bytes() {
        return Q3A(this, (B) => {
          return new Uint8Array(B)
        }, A)
      }
    }
  }

  function au8(A) {
    Object.assign(A.prototype, nu8(A))
  }
  async function Q3A(A, Q, B) {
    if (fu8.brandCheck(A, B), rAB(A)) throw TypeError("Body is unusable: Body has already been read");
    iu8(A[B3A]);
    let G = xu8(),
      Z = (Y) => G.reject(Y),
      I = (Y) => {
        try {
          G.resolve(Q(Y))
        } catch (J) {
          Z(J)
        }
      };
    if (A[B3A].body == null) return I(Buffer.allocUnsafe(0)), G.promise;
    return await vu8(A[B3A].body, I, Z), G.promise
  }

  function rAB(A) {
    let Q = A[B3A].body;
    return Q != null && (Q.stream.locked || xEA.isDisturbed(Q.stream))
  }

  function su8(A) {
    return JSON.parse(nAB(A))
  }

  function iAB(A) {
    let Q = A[B3A].headersList,
      B = bu8(Q);
    if (B === "failure") return null;
    return B
  }
  oAB.exports = {
    extractBody: sAB,
    safelyExtractBody: pu8,
    cloneBody: lu8,
    mixinBody: au8,
    streamRegistry: ly1,
    hasFinalizationRegistry: py1,
    bodyUnusable: rAB
  }
})
// @from(Start 4818778, End 4841781)
X1B = z((ES7, W1B) => {
  var J4 = UA("node:assert"),
    a4 = S6(),
    {
      channels: tAB
    } = p5A(),
    iy1 = Ry1(),
    {
      RequestContentLengthMismatchError: bo,
      ResponseContentLengthMismatchError: ru8,
      RequestAbortedError: Z1B,
      HeadersTimeoutError: ou8,
      HeadersOverflowError: tu8,
      SocketError: KlA,
      InformationalError: Z3A,
      BodyTimeoutError: eu8,
      HTTPParserError: Am8,
      ResponseExceededMaxSizeError: Qm8
    } = R7(),
    {
      kUrl: I1B,
      kReset: BU,
      kClient: ry1,
      kParser: OJ,
      kBlocking: fEA,
      kRunning: SH,
      kPending: Bm8,
      kSize: eAB,
      kWriting: Hc,
      kQueue: QT,
      kNoRef: vEA,
      kKeepAliveDefaultTimeout: Gm8,
      kHostHeader: Zm8,
      kPendingIdx: Im8,
      kRunningIdx: sL,
      kError: rL,
      kPipelining: VlA,
      kSocket: I3A,
      kKeepAliveTimeoutValue: DlA,
      kMaxHeadersSize: ny1,
      kKeepAliveMaxTimeout: Ym8,
      kKeepAliveTimeoutThreshold: Jm8,
      kHeadersTimeout: Wm8,
      kBodyTimeout: Xm8,
      kStrictContentLength: oy1,
      kMaxRequests: A1B,
      kCounter: Vm8,
      kMaxResponseSize: Fm8,
      kOnError: Km8,
      kResume: Dc,
      kHTTPContext: Y1B
    } = tI(),
    F_ = neQ(),
    Dm8 = Buffer.alloc(0),
    JlA = Buffer[Symbol.species],
    WlA = a4.addListener,
    Hm8 = a4.removeAllListeners,
    ay1;
  async function Cm8() {
    let A = process.env.JEST_WORKER_ID ? ky1() : void 0,
      Q;
    try {
      Q = await WebAssembly.compile(reQ())
    } catch (B) {
      Q = await WebAssembly.compile(A || ky1())
    }
    return await WebAssembly.instantiate(Q, {
      env: {
        wasm_on_url: (B, G, Z) => {
          return 0
        },
        wasm_on_status: (B, G, Z) => {
          J4(RV.ptr === B);
          let I = G - D_ + K_.byteOffset;
          return RV.onStatus(new JlA(K_.buffer, I, Z)) || 0
        },
        wasm_on_message_begin: (B) => {
          return J4(RV.ptr === B), RV.onMessageBegin() || 0
        },
        wasm_on_header_field: (B, G, Z) => {
          J4(RV.ptr === B);
          let I = G - D_ + K_.byteOffset;
          return RV.onHeaderField(new JlA(K_.buffer, I, Z)) || 0
        },
        wasm_on_header_value: (B, G, Z) => {
          J4(RV.ptr === B);
          let I = G - D_ + K_.byteOffset;
          return RV.onHeaderValue(new JlA(K_.buffer, I, Z)) || 0
        },
        wasm_on_headers_complete: (B, G, Z, I) => {
          return J4(RV.ptr === B), RV.onHeadersComplete(G, Boolean(Z), Boolean(I)) || 0
        },
        wasm_on_body: (B, G, Z) => {
          J4(RV.ptr === B);
          let I = G - D_ + K_.byteOffset;
          return RV.onBody(new JlA(K_.buffer, I, Z)) || 0
        },
        wasm_on_message_complete: (B) => {
          return J4(RV.ptr === B), RV.onMessageComplete() || 0
        }
      }
    })
  }
  var sy1 = null,
    ty1 = Cm8();
  ty1.catch();
  var RV = null,
    K_ = null,
    XlA = 0,
    D_ = null,
    Em8 = 0,
    bEA = 1,
    Y3A = 2 | bEA,
    FlA = 4 | bEA,
    ey1 = 8 | Em8;
  class J1B {
    constructor(A, Q, {
      exports: B
    }) {
      J4(Number.isFinite(A[ny1]) && A[ny1] > 0), this.llhttp = B, this.ptr = this.llhttp.llhttp_alloc(F_.TYPE.RESPONSE), this.client = A, this.socket = Q, this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.statusCode = null, this.statusText = "", this.upgrade = !1, this.headers = [], this.headersSize = 0, this.headersMaxSize = A[ny1], this.shouldKeepAlive = !1, this.paused = !1, this.resume = this.resume.bind(this), this.bytesRead = 0, this.keepAlive = "", this.contentLength = "", this.connection = "", this.maxResponseSize = A[Fm8]
    }
    setTimeout(A, Q) {
      if (A !== this.timeoutValue || Q & bEA ^ this.timeoutType & bEA) {
        if (this.timeout) iy1.clearTimeout(this.timeout), this.timeout = null;
        if (A)
          if (Q & bEA) this.timeout = iy1.setFastTimeout(Q1B, A, new WeakRef(this));
          else this.timeout = setTimeout(Q1B, A, new WeakRef(this)), this.timeout.unref();
        this.timeoutValue = A
      } else if (this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      this.timeoutType = Q
    }
    resume() {
      if (this.socket.destroyed || !this.paused) return;
      if (J4(this.ptr != null), J4(RV == null), this.llhttp.llhttp_resume(this.ptr), J4(this.timeoutType === FlA), this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      this.paused = !1, this.execute(this.socket.read() || Dm8), this.readMore()
    }
    readMore() {
      while (!this.paused && this.ptr) {
        let A = this.socket.read();
        if (A === null) break;
        this.execute(A)
      }
    }
    execute(A) {
      J4(this.ptr != null), J4(RV == null), J4(!this.paused);
      let {
        socket: Q,
        llhttp: B
      } = this;
      if (A.length > XlA) {
        if (D_) B.free(D_);
        XlA = Math.ceil(A.length / 4096) * 4096, D_ = B.malloc(XlA)
      }
      new Uint8Array(B.memory.buffer, D_, XlA).set(A);
      try {
        let G;
        try {
          K_ = A, RV = this, G = B.llhttp_execute(this.ptr, D_, A.length)
        } catch (I) {
          throw I
        } finally {
          RV = null, K_ = null
        }
        let Z = B.llhttp_get_error_pos(this.ptr) - D_;
        if (G === F_.ERROR.PAUSED_UPGRADE) this.onUpgrade(A.slice(Z));
        else if (G === F_.ERROR.PAUSED) this.paused = !0, Q.unshift(A.slice(Z));
        else if (G !== F_.ERROR.OK) {
          let I = B.llhttp_get_error_reason(this.ptr),
            Y = "";
          if (I) {
            let J = new Uint8Array(B.memory.buffer, I).indexOf(0);
            Y = "Response does not match the HTTP/1.1 protocol (" + Buffer.from(B.memory.buffer, I, J).toString() + ")"
          }
          throw new Am8(Y, F_.ERROR[G], A.slice(Z))
        }
      } catch (G) {
        a4.destroy(Q, G)
      }
    }
    destroy() {
      J4(this.ptr != null), J4(RV == null), this.llhttp.llhttp_free(this.ptr), this.ptr = null, this.timeout && iy1.clearTimeout(this.timeout), this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.paused = !1
    }
    onStatus(A) {
      this.statusText = A.toString()
    }
    onMessageBegin() {
      let {
        socket: A,
        client: Q
      } = this;
      if (A.destroyed) return -1;
      let B = Q[QT][Q[sL]];
      if (!B) return -1;
      B.onResponseStarted()
    }
    onHeaderField(A) {
      let Q = this.headers.length;
      if ((Q & 1) === 0) this.headers.push(A);
      else this.headers[Q - 1] = Buffer.concat([this.headers[Q - 1], A]);
      this.trackHeader(A.length)
    }
    onHeaderValue(A) {
      let Q = this.headers.length;
      if ((Q & 1) === 1) this.headers.push(A), Q += 1;
      else this.headers[Q - 1] = Buffer.concat([this.headers[Q - 1], A]);
      let B = this.headers[Q - 2];
      if (B.length === 10) {
        let G = a4.bufferToLowerCasedHeaderName(B);
        if (G === "keep-alive") this.keepAlive += A.toString();
        else if (G === "connection") this.connection += A.toString()
      } else if (B.length === 14 && a4.bufferToLowerCasedHeaderName(B) === "content-length") this.contentLength += A.toString();
      this.trackHeader(A.length)
    }
    trackHeader(A) {
      if (this.headersSize += A, this.headersSize >= this.headersMaxSize) a4.destroy(this.socket, new tu8)
    }
    onUpgrade(A) {
      let {
        upgrade: Q,
        client: B,
        socket: G,
        headers: Z,
        statusCode: I
      } = this;
      J4(Q), J4(B[I3A] === G), J4(!G.destroyed), J4(!this.paused), J4((Z.length & 1) === 0);
      let Y = B[QT][B[sL]];
      J4(Y), J4(Y.upgrade || Y.method === "CONNECT"), this.statusCode = null, this.statusText = "", this.shouldKeepAlive = null, this.headers = [], this.headersSize = 0, G.unshift(A), G[OJ].destroy(), G[OJ] = null, G[ry1] = null, G[rL] = null, Hm8(G), B[I3A] = null, B[Y1B] = null, B[QT][B[sL]++] = null, B.emit("disconnect", B[I1B], [B], new Z3A("upgrade"));
      try {
        Y.onUpgrade(I, Z, G)
      } catch (J) {
        a4.destroy(G, J)
      }
      B[Dc]()
    }
    onHeadersComplete(A, Q, B) {
      let {
        client: G,
        socket: Z,
        headers: I,
        statusText: Y
      } = this;
      if (Z.destroyed) return -1;
      let J = G[QT][G[sL]];
      if (!J) return -1;
      if (J4(!this.upgrade), J4(this.statusCode < 200), A === 100) return a4.destroy(Z, new KlA("bad response", a4.getSocketInfo(Z))), -1;
      if (Q && !J.upgrade) return a4.destroy(Z, new KlA("bad upgrade", a4.getSocketInfo(Z))), -1;
      if (J4(this.timeoutType === Y3A), this.statusCode = A, this.shouldKeepAlive = B || J.method === "HEAD" && !Z[BU] && this.connection.toLowerCase() === "keep-alive", this.statusCode >= 200) {
        let X = J.bodyTimeout != null ? J.bodyTimeout : G[Xm8];
        this.setTimeout(X, FlA)
      } else if (this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      if (J.method === "CONNECT") return J4(G[SH] === 1), this.upgrade = !0, 2;
      if (Q) return J4(G[SH] === 1), this.upgrade = !0, 2;
      if (J4((this.headers.length & 1) === 0), this.headers = [], this.headersSize = 0, this.shouldKeepAlive && G[VlA]) {
        let X = this.keepAlive ? a4.parseKeepAliveTimeout(this.keepAlive) : null;
        if (X != null) {
          let V = Math.min(X - G[Jm8], G[Ym8]);
          if (V <= 0) Z[BU] = !0;
          else G[DlA] = V
        } else G[DlA] = G[Gm8]
      } else Z[BU] = !0;
      let W = J.onHeaders(A, I, this.resume, Y) === !1;
      if (J.aborted) return -1;
      if (J.method === "HEAD") return 1;
      if (A < 200) return 1;
      if (Z[fEA]) Z[fEA] = !1, G[Dc]();
      return W ? F_.ERROR.PAUSED : 0
    }
    onBody(A) {
      let {
        client: Q,
        socket: B,
        statusCode: G,
        maxResponseSize: Z
      } = this;
      if (B.destroyed) return -1;
      let I = Q[QT][Q[sL]];
      if (J4(I), J4(this.timeoutType === FlA), this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      if (J4(G >= 200), Z > -1 && this.bytesRead + A.length > Z) return a4.destroy(B, new Qm8), -1;
      if (this.bytesRead += A.length, I.onData(A) === !1) return F_.ERROR.PAUSED
    }
    onMessageComplete() {
      let {
        client: A,
        socket: Q,
        statusCode: B,
        upgrade: G,
        headers: Z,
        contentLength: I,
        bytesRead: Y,
        shouldKeepAlive: J
      } = this;
      if (Q.destroyed && (!B || J)) return -1;
      if (G) return;
      J4(B >= 100), J4((this.headers.length & 1) === 0);
      let W = A[QT][A[sL]];
      if (J4(W), this.statusCode = null, this.statusText = "", this.bytesRead = 0, this.contentLength = "", this.keepAlive = "", this.connection = "", this.headers = [], this.headersSize = 0, B < 200) return;
      if (W.method !== "HEAD" && I && Y !== parseInt(I, 10)) return a4.destroy(Q, new ru8), -1;
      if (W.onComplete(Z), A[QT][A[sL]++] = null, Q[Hc]) return J4(A[SH] === 0), a4.destroy(Q, new Z3A("reset")), F_.ERROR.PAUSED;
      else if (!J) return a4.destroy(Q, new Z3A("reset")), F_.ERROR.PAUSED;
      else if (Q[BU] && A[SH] === 0) return a4.destroy(Q, new Z3A("reset")), F_.ERROR.PAUSED;
      else if (A[VlA] == null || A[VlA] === 1) setImmediate(() => A[Dc]());
      else A[Dc]()
    }
  }

  function Q1B(A) {
    let {
      socket: Q,
      timeoutType: B,
      client: G,
      paused: Z
    } = A.deref();
    if (B === Y3A) {
      if (!Q[Hc] || Q.writableNeedDrain || G[SH] > 1) J4(!Z, "cannot be paused while waiting for headers"), a4.destroy(Q, new ou8)
    } else if (B === FlA) {
      if (!Z) a4.destroy(Q, new eu8)
    } else if (B === ey1) J4(G[SH] === 0 && G[DlA]), a4.destroy(Q, new Z3A("socket idle timeout"))
  }
  async function zm8(A, Q) {
    if (A[I3A] = Q, !sy1) sy1 = await ty1, ty1 = null;
    Q[vEA] = !1, Q[Hc] = !1, Q[BU] = !1, Q[fEA] = !1, Q[OJ] = new J1B(A, Q, sy1), WlA(Q, "error", function(G) {
      J4(G.code !== "ERR_TLS_CERT_ALTNAME_INVALID");
      let Z = this[OJ];
      if (G.code === "ECONNRESET" && Z.statusCode && !Z.shouldKeepAlive) {
        Z.onMessageComplete();
        return
      }
      this[rL] = G, this[ry1][Km8](G)
    }), WlA(Q, "readable", function() {
      let G = this[OJ];
      if (G) G.readMore()
    }), WlA(Q, "end", function() {
      let G = this[OJ];
      if (G.statusCode && !G.shouldKeepAlive) {
        G.onMessageComplete();
        return
      }
      a4.destroy(this, new KlA("other side closed", a4.getSocketInfo(this)))
    }), WlA(Q, "close", function() {
      let G = this[ry1],
        Z = this[OJ];
      if (Z) {
        if (!this[rL] && Z.statusCode && !Z.shouldKeepAlive) Z.onMessageComplete();
        this[OJ].destroy(), this[OJ] = null
      }
      let I = this[rL] || new KlA("closed", a4.getSocketInfo(this));
      if (G[I3A] = null, G[Y1B] = null, G.destroyed) {
        J4(G[Bm8] === 0);
        let Y = G[QT].splice(G[sL]);
        for (let J = 0; J < Y.length; J++) {
          let W = Y[J];
          a4.errorRequest(G, W, I)
        }
      } else if (G[SH] > 0 && I.code !== "UND_ERR_INFO") {
        let Y = G[QT][G[sL]];
        G[QT][G[sL]++] = null, a4.errorRequest(G, Y, I)
      }
      G[Im8] = G[sL], J4(G[SH] === 0), G.emit("disconnect", G[I1B], [G], I), G[Dc]()
    });
    let B = !1;
    return Q.on("close", () => {
      B = !0
    }), {
      version: "h1",
      defaultPipelining: 1,
      write(...G) {
        return wm8(A, ...G)
      },
      resume() {
        Um8(A)
      },
      destroy(G, Z) {
        if (B) queueMicrotask(Z);
        else Q.destroy(G).on("close", Z)
      },
      get destroyed() {
        return Q.destroyed
      },
      busy(G) {
        if (Q[Hc] || Q[BU] || Q[fEA]) return !0;
        if (G) {
          if (A[SH] > 0 && !G.idempotent) return !0;
          if (A[SH] > 0 && (G.upgrade || G.method === "CONNECT")) return !0;
          if (A[SH] > 0 && a4.bodyLength(G.body) !== 0 && (a4.isStream(G.body) || a4.isAsyncIterable(G.body) || a4.isFormDataLike(G.body))) return !0
        }
        return !1
      }
    }
  }

  function Um8(A) {
    let Q = A[I3A];
    if (Q && !Q.destroyed) {
      if (A[eAB] === 0) {
        if (!Q[vEA] && Q.unref) Q.unref(), Q[vEA] = !0
      } else if (Q[vEA] && Q.ref) Q.ref(), Q[vEA] = !1;
      if (A[eAB] === 0) {
        if (Q[OJ].timeoutType !== ey1) Q[OJ].setTimeout(A[DlA], ey1)
      } else if (A[SH] > 0 && Q[OJ].statusCode < 200) {
        if (Q[OJ].timeoutType !== Y3A) {
          let B = A[QT][A[sL]],
            G = B.headersTimeout != null ? B.headersTimeout : A[Wm8];
          Q[OJ].setTimeout(G, Y3A)
        }
      }
    }
  }

  function $m8(A) {
    return A !== "GET" && A !== "HEAD" && A !== "OPTIONS" && A !== "TRACE" && A !== "CONNECT"
  }

  function wm8(A, Q) {
    let {
      method: B,
      path: G,
      host: Z,
      upgrade: I,
      blocking: Y,
      reset: J
    } = Q, {
      body: W,
      headers: X,
      contentLength: V
    } = Q, F = B === "PUT" || B === "POST" || B === "PATCH" || B === "QUERY" || B === "PROPFIND" || B === "PROPPATCH";
    if (a4.isFormDataLike(W)) {
      if (!ay1) ay1 = G3A().extractBody;
      let [E, U] = ay1(W);
      if (Q.contentType == null) X.push("content-type", U);
      W = E.stream, V = E.length
    } else if (a4.isBlobLike(W) && Q.contentType == null && W.type) X.push("content-type", W.type);
    if (W && typeof W.read === "function") W.read(0);
    let K = a4.bodyLength(W);
    if (V = K ?? V, V === null) V = Q.contentLength;
    if (V === 0 && !F) V = null;
    if ($m8(B) && V > 0 && Q.contentLength !== null && Q.contentLength !== V) {
      if (A[oy1]) return a4.errorRequest(A, Q, new bo), !1;
      process.emitWarning(new bo)
    }
    let D = A[I3A],
      H = (E) => {
        if (Q.aborted || Q.completed) return;
        a4.errorRequest(A, Q, E || new Z1B), a4.destroy(W), a4.destroy(D, new Z3A("aborted"))
      };
    try {
      Q.onConnect(H)
    } catch (E) {
      a4.errorRequest(A, Q, E)
    }
    if (Q.aborted) return !1;
    if (B === "HEAD") D[BU] = !0;
    if (I || B === "CONNECT") D[BU] = !0;
    if (J != null) D[BU] = J;
    if (A[A1B] && D[Vm8]++ >= A[A1B]) D[BU] = !0;
    if (Y) D[fEA] = !0;
    let C = `${B} ${G} HTTP/1.1\r
`;
    if (typeof Z === "string") C += `host: ${Z}\r
`;
    else C += A[Zm8];
    if (I) C += `connection: upgrade\r
upgrade: ${I}\r
`;
    else if (A[VlA] && !D[BU]) C += `connection: keep-alive\r
`;
    else C += `connection: close\r
`;
    if (Array.isArray(X))
      for (let E = 0; E < X.length; E += 2) {
        let U = X[E + 0],
          q = X[E + 1];
        if (Array.isArray(q))
          for (let w = 0; w < q.length; w++) C += `${U}: ${q[w]}\r
`;
        else C += `${U}: ${q}\r
`
      }
    if (tAB.sendHeaders.hasSubscribers) tAB.sendHeaders.publish({
      request: Q,
      headers: C,
      socket: D
    });
    if (!W || K === 0) B1B(H, null, A, Q, D, V, C, F);
    else if (a4.isBuffer(W)) B1B(H, W, A, Q, D, V, C, F);
    else if (a4.isBlobLike(W))
      if (typeof W.stream === "function") G1B(H, W.stream(), A, Q, D, V, C, F);
      else Nm8(H, W, A, Q, D, V, C, F);
    else if (a4.isStream(W)) qm8(H, W, A, Q, D, V, C, F);
    else if (a4.isIterable(W)) G1B(H, W, A, Q, D, V, C, F);
    else J4(!1);
    return !0
  }

  function qm8(A, Q, B, G, Z, I, Y, J) {
    J4(I !== 0 || B[SH] === 0, "stream body cannot be pipelined");
    let W = !1,
      X = new Ax1({
        abort: A,
        socket: Z,
        request: G,
        contentLength: I,
        client: B,
        expectsPayload: J,
        header: Y
      }),
      V = function(H) {
        if (W) return;
        try {
          if (!X.write(H) && this.pause) this.pause()
        } catch (C) {
          a4.destroy(this, C)
        }
      },
      F = function() {
        if (W) return;
        if (Q.resume) Q.resume()
      },
      K = function() {
        if (queueMicrotask(() => {
            Q.removeListener("error", D)
          }), !W) {
          let H = new Z1B;
          queueMicrotask(() => D(H))
        }
      },
      D = function(H) {
        if (W) return;
        if (W = !0, J4(Z.destroyed || Z[Hc] && B[SH] <= 1), Z.off("drain", F).off("error", D), Q.removeListener("data", V).removeListener("end", D).removeListener("close", K), !H) try {
          X.end()
        } catch (C) {
          H = C
        }
        if (X.destroy(H), H && (H.code !== "UND_ERR_INFO" || H.message !== "reset")) a4.destroy(Q, H);
        else a4.destroy(Q)
      };
    if (Q.on("data", V).on("end", D).on("error", D).on("close", K), Q.resume) Q.resume();
    if (Z.on("drain", F).on("error", D), Q.errorEmitted ?? Q.errored) setImmediate(() => D(Q.errored));
    else if (Q.endEmitted ?? Q.readableEnded) setImmediate(() => D(null));
    if (Q.closeEmitted ?? Q.closed) setImmediate(K)
  }

  function B1B(A, Q, B, G, Z, I, Y, J) {
    try {
      if (!Q)
        if (I === 0) Z.write(`${Y}content-length: 0\r
\r
`, "latin1");
        else J4(I === null, "no body must not have content length"), Z.write(`${Y}\r
`, "latin1");
      else if (a4.isBuffer(Q)) {
        if (J4(I === Q.byteLength, "buffer body must have content length"), Z.cork(), Z.write(`${Y}content-length: ${I}\r
\r
`, "latin1"), Z.write(Q), Z.uncork(), G.onBodySent(Q), !J && G.reset !== !1) Z[BU] = !0
      }
      G.onRequestSent(), B[Dc]()
    } catch (W) {
      A(W)
    }
  }
  async function Nm8(A, Q, B, G, Z, I, Y, J) {
    J4(I === Q.size, "blob body must have content length");
    try {
      if (I != null && I !== Q.size) throw new bo;
      let W = Buffer.from(await Q.arrayBuffer());
      if (Z.cork(), Z.write(`${Y}content-length: ${I}\r
\r
`, "latin1"), Z.write(W), Z.uncork(), G.onBodySent(W), G.onRequestSent(), !J && G.reset !== !1) Z[BU] = !0;
      B[Dc]()
    } catch (W) {
      A(W)
    }
  }
  async function G1B(A, Q, B, G, Z, I, Y, J) {
    J4(I !== 0 || B[SH] === 0, "iterator body cannot be pipelined");
    let W = null;

    function X() {
      if (W) {
        let K = W;
        W = null, K()
      }
    }
    let V = () => new Promise((K, D) => {
      if (J4(W === null), Z[rL]) D(Z[rL]);
      else W = K
    });
    Z.on("close", X).on("drain", X);
    let F = new Ax1({
      abort: A,
      socket: Z,
      request: G,
      contentLength: I,
      client: B,
      expectsPayload: J,
      header: Y
    });
    try {
      for await (let K of Q) {
        if (Z[rL]) throw Z[rL];
        if (!F.write(K)) await V()
      }
      F.end()
    } catch (K) {
      F.destroy(K)
    } finally {
      Z.off("close", X).off("drain", X)
    }
  }
  class Ax1 {
    constructor({
      abort: A,
      socket: Q,
      request: B,
      contentLength: G,
      client: Z,
      expectsPayload: I,
      header: Y
    }) {
      this.socket = Q, this.request = B, this.contentLength = G, this.client = Z, this.bytesWritten = 0, this.expectsPayload = I, this.header = Y, this.abort = A, Q[Hc] = !0
    }
    write(A) {
      let {
        socket: Q,
        request: B,
        contentLength: G,
        client: Z,
        bytesWritten: I,
        expectsPayload: Y,
        header: J
      } = this;
      if (Q[rL]) throw Q[rL];
      if (Q.destroyed) return !1;
      let W = Buffer.byteLength(A);
      if (!W) return !0;
      if (G !== null && I + W > G) {
        if (Z[oy1]) throw new bo;
        process.emitWarning(new bo)
      }
      if (Q.cork(), I === 0) {
        if (!Y && B.reset !== !1) Q[BU] = !0;
        if (G === null) Q.write(`${J}transfer-encoding: chunked\r
`, "latin1");
        else Q.write(`${J}content-length: ${G}\r
\r
`, "latin1")
      }
      if (G === null) Q.write(`\r
${W.toString(16)}\r
`, "latin1");
      this.bytesWritten += W;
      let X = Q.write(A);
      if (Q.uncork(), B.onBodySent(A), !X) {
        if (Q[OJ].timeout && Q[OJ].timeoutType === Y3A) {
          if (Q[OJ].timeout.refresh) Q[OJ].timeout.refresh()
        }
      }
      return X
    }
    end() {
      let {
        socket: A,
        contentLength: Q,
        client: B,
        bytesWritten: G,
        expectsPayload: Z,
        header: I,
        request: Y
      } = this;
      if (Y.onRequestSent(), A[Hc] = !1, A[rL]) throw A[rL];
      if (A.destroyed) return;
      if (G === 0)
        if (Z) A.write(`${I}content-length: 0\r
\r
`, "latin1");
        else A.write(`${I}\r
`, "latin1");
      else if (Q === null) A.write(`\r
0\r
\r
`, "latin1");
      if (Q !== null && G !== Q)
        if (B[oy1]) throw new bo;
        else process.emitWarning(new bo);
      if (A[OJ].timeout && A[OJ].timeoutType === Y3A) {
        if (A[OJ].timeout.refresh) A[OJ].timeout.refresh()
      }
      B[Dc]()
    }
    destroy(A) {
      let {
        socket: Q,
        client: B,
        abort: G
      } = this;
      if (Q[Hc] = !1, A) J4(B[SH] <= 1, "pipeline should only contain this request"), G(A)
    }
  }
  W1B.exports = zm8
})
// @from(Start 4841787, End 4851736)
z1B = z((zS7, E1B) => {
  var oL = UA("node:assert"),
    {
      pipeline: Lm8
    } = UA("node:stream"),
    T5 = S6(),
    {
      RequestContentLengthMismatchError: Qx1,
      RequestAbortedError: V1B,
      SocketError: hEA,
      InformationalError: Bx1
    } = R7(),
    {
      kUrl: HlA,
      kReset: ElA,
      kClient: J3A,
      kRunning: zlA,
      kPending: Mm8,
      kQueue: Cc,
      kPendingIdx: Gx1,
      kRunningIdx: BT,
      kError: ZT,
      kSocket: _F,
      kStrictContentLength: Om8,
      kOnError: Zx1,
      kMaxConcurrentStreams: C1B,
      kHTTP2Session: GT,
      kResume: Ec,
      kSize: Rm8,
      kHTTPContext: Tm8
    } = tI(),
    Pb = Symbol("open streams"),
    F1B, K1B = !1,
    ClA;
  try {
    ClA = UA("node:http2")
  } catch {
    ClA = {
      constants: {}
    }
  }
  var {
    constants: {
      HTTP2_HEADER_AUTHORITY: Pm8,
      HTTP2_HEADER_METHOD: jm8,
      HTTP2_HEADER_PATH: Sm8,
      HTTP2_HEADER_SCHEME: _m8,
      HTTP2_HEADER_CONTENT_LENGTH: km8,
      HTTP2_HEADER_EXPECT: ym8,
      HTTP2_HEADER_STATUS: xm8
    }
  } = ClA;

  function vm8(A) {
    let Q = [];
    for (let [B, G] of Object.entries(A))
      if (Array.isArray(G))
        for (let Z of G) Q.push(Buffer.from(B), Buffer.from(Z));
      else Q.push(Buffer.from(B), Buffer.from(G));
    return Q
  }
  async function bm8(A, Q) {
    if (A[_F] = Q, !K1B) K1B = !0, process.emitWarning("H2 support is experimental, expect them to change at any time.", {
      code: "UNDICI-H2"
    });
    let B = ClA.connect(A[HlA], {
      createConnection: () => Q,
      peerMaxConcurrentStreams: A[C1B]
    });
    B[Pb] = 0, B[J3A] = A, B[_F] = Q, T5.addListener(B, "error", hm8), T5.addListener(B, "frameError", gm8), T5.addListener(B, "end", um8), T5.addListener(B, "goaway", mm8), T5.addListener(B, "close", function() {
      let {
        [J3A]: Z
      } = this, {
        [_F]: I
      } = Z, Y = this[_F][ZT] || this[ZT] || new hEA("closed", T5.getSocketInfo(I));
      if (Z[GT] = null, Z.destroyed) {
        oL(Z[Mm8] === 0);
        let J = Z[Cc].splice(Z[BT]);
        for (let W = 0; W < J.length; W++) {
          let X = J[W];
          T5.errorRequest(Z, X, Y)
        }
      }
    }), B.unref(), A[GT] = B, Q[GT] = B, T5.addListener(Q, "error", function(Z) {
      oL(Z.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[ZT] = Z, this[J3A][Zx1](Z)
    }), T5.addListener(Q, "end", function() {
      T5.destroy(this, new hEA("other side closed", T5.getSocketInfo(this)))
    }), T5.addListener(Q, "close", function() {
      let Z = this[ZT] || new hEA("closed", T5.getSocketInfo(this));
      if (A[_F] = null, this[GT] != null) this[GT].destroy(Z);
      A[Gx1] = A[BT], oL(A[zlA] === 0), A.emit("disconnect", A[HlA], [A], Z), A[Ec]()
    });
    let G = !1;
    return Q.on("close", () => {
      G = !0
    }), {
      version: "h2",
      defaultPipelining: 1 / 0,
      write(...Z) {
        return cm8(A, ...Z)
      },
      resume() {
        fm8(A)
      },
      destroy(Z, I) {
        if (G) queueMicrotask(I);
        else Q.destroy(Z).on("close", I)
      },
      get destroyed() {
        return Q.destroyed
      },
      busy() {
        return !1
      }
    }
  }

  function fm8(A) {
    let Q = A[_F];
    if (Q?.destroyed === !1)
      if (A[Rm8] === 0 && A[C1B] === 0) Q.unref(), A[GT].unref();
      else Q.ref(), A[GT].ref()
  }

  function hm8(A) {
    oL(A.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[_F][ZT] = A, this[J3A][Zx1](A)
  }

  function gm8(A, Q, B) {
    if (B === 0) {
      let G = new Bx1(`HTTP/2: "frameError" received - type ${A}, code ${Q}`);
      this[_F][ZT] = G, this[J3A][Zx1](G)
    }
  }

  function um8() {
    let A = new hEA("other side closed", T5.getSocketInfo(this[_F]));
    this.destroy(A), T5.destroy(this[_F], A)
  }

  function mm8(A) {
    let Q = this[ZT] || new hEA(`HTTP/2: "GOAWAY" frame received with code ${A}`, T5.getSocketInfo(this)),
      B = this[J3A];
    if (B[_F] = null, B[Tm8] = null, this[GT] != null) this[GT].destroy(Q), this[GT] = null;
    if (T5.destroy(this[_F], Q), B[BT] < B[Cc].length) {
      let G = B[Cc][B[BT]];
      B[Cc][B[BT]++] = null, T5.errorRequest(B, G, Q), B[Gx1] = B[BT]
    }
    oL(B[zlA] === 0), B.emit("disconnect", B[HlA], [B], Q), B[Ec]()
  }

  function dm8(A) {
    return A !== "GET" && A !== "HEAD" && A !== "OPTIONS" && A !== "TRACE" && A !== "CONNECT"
  }

  function cm8(A, Q) {
    let B = A[GT],
      {
        method: G,
        path: Z,
        host: I,
        upgrade: Y,
        expectContinue: J,
        signal: W,
        headers: X
      } = Q,
      {
        body: V
      } = Q;
    if (Y) return T5.errorRequest(A, Q, Error("Upgrade not supported for H2")), !1;
    let F = {};
    for (let N = 0; N < X.length; N += 2) {
      let R = X[N + 0],
        T = X[N + 1];
      if (Array.isArray(T))
        for (let y = 0; y < T.length; y++)
          if (F[R]) F[R] += `,${T[y]}`;
          else F[R] = T[y];
      else F[R] = T
    }
    let K, {
      hostname: D,
      port: H
    } = A[HlA];
    F[Pm8] = I || `${D}${H?`:${H}`:""}`, F[jm8] = G;
    let C = (N) => {
      if (Q.aborted || Q.completed) return;
      if (N = N || new V1B, T5.errorRequest(A, Q, N), K != null) T5.destroy(K, N);
      T5.destroy(V, N), A[Cc][A[BT]++] = null, A[Ec]()
    };
    try {
      Q.onConnect(C)
    } catch (N) {
      T5.errorRequest(A, Q, N)
    }
    if (Q.aborted) return !1;
    if (G === "CONNECT") {
      if (B.ref(), K = B.request(F, {
          endStream: !1,
          signal: W
        }), K.id && !K.pending) Q.onUpgrade(null, null, K), ++B[Pb], A[Cc][A[BT]++] = null;
      else K.once("ready", () => {
        Q.onUpgrade(null, null, K), ++B[Pb], A[Cc][A[BT]++] = null
      });
      return K.once("close", () => {
        if (B[Pb] -= 1, B[Pb] === 0) B.unref()
      }), !0
    }
    F[Sm8] = Z, F[_m8] = "https";
    let E = G === "PUT" || G === "POST" || G === "PATCH";
    if (V && typeof V.read === "function") V.read(0);
    let U = T5.bodyLength(V);
    if (T5.isFormDataLike(V)) {
      F1B ??= G3A().extractBody;
      let [N, R] = F1B(V);
      F["content-type"] = R, V = N.stream, U = N.length
    }
    if (U == null) U = Q.contentLength;
    if (U === 0 || !E) U = null;
    if (dm8(G) && U > 0 && Q.contentLength != null && Q.contentLength !== U) {
      if (A[Om8]) return T5.errorRequest(A, Q, new Qx1), !1;
      process.emitWarning(new Qx1)
    }
    if (U != null) oL(V, "no body must not have content length"), F[km8] = `${U}`;
    B.ref();
    let q = G === "GET" || G === "HEAD" || V === null;
    if (J) F[ym8] = "100-continue", K = B.request(F, {
      endStream: q,
      signal: W
    }), K.once("continue", w);
    else K = B.request(F, {
      endStream: q,
      signal: W
    }), w();
    return ++B[Pb], K.once("response", (N) => {
      let {
        [xm8]: R, ...T
      } = N;
      if (Q.onResponseStarted(), Q.aborted) {
        let y = new V1B;
        T5.errorRequest(A, Q, y), T5.destroy(K, y);
        return
      }
      if (Q.onHeaders(Number(R), vm8(T), K.resume.bind(K), "") === !1) K.pause();
      K.on("data", (y) => {
        if (Q.onData(y) === !1) K.pause()
      })
    }), K.once("end", () => {
      if (K.state?.state == null || K.state.state < 6) Q.onComplete([]);
      if (B[Pb] === 0) B.unref();
      C(new Bx1("HTTP/2: stream half-closed (remote)")), A[Cc][A[BT]++] = null, A[Gx1] = A[BT], A[Ec]()
    }), K.once("close", () => {
      if (B[Pb] -= 1, B[Pb] === 0) B.unref()
    }), K.once("error", function(N) {
      C(N)
    }), K.once("frameError", (N, R) => {
      C(new Bx1(`HTTP/2: "frameError" received - type ${N}, code ${R}`))
    }), !0;

    function w() {
      if (!V || U === 0) D1B(C, K, null, A, Q, A[_F], U, E);
      else if (T5.isBuffer(V)) D1B(C, K, V, A, Q, A[_F], U, E);
      else if (T5.isBlobLike(V))
        if (typeof V.stream === "function") H1B(C, K, V.stream(), A, Q, A[_F], U, E);
        else lm8(C, K, V, A, Q, A[_F], U, E);
      else if (T5.isStream(V)) pm8(C, A[_F], E, K, V, A, Q, U);
      else if (T5.isIterable(V)) H1B(C, K, V, A, Q, A[_F], U, E);
      else oL(!1)
    }
  }

  function D1B(A, Q, B, G, Z, I, Y, J) {
    try {
      if (B != null && T5.isBuffer(B)) oL(Y === B.byteLength, "buffer body must have content length"), Q.cork(), Q.write(B), Q.uncork(), Q.end(), Z.onBodySent(B);
      if (!J) I[ElA] = !0;
      Z.onRequestSent(), G[Ec]()
    } catch (W) {
      A(W)
    }
  }

  function pm8(A, Q, B, G, Z, I, Y, J) {
    oL(J !== 0 || I[zlA] === 0, "stream body cannot be pipelined");
    let W = Lm8(Z, G, (V) => {
      if (V) T5.destroy(W, V), A(V);
      else {
        if (T5.removeAllListeners(W), Y.onRequestSent(), !B) Q[ElA] = !0;
        I[Ec]()
      }
    });
    T5.addListener(W, "data", X);

    function X(V) {
      Y.onBodySent(V)
    }
  }
  async function lm8(A, Q, B, G, Z, I, Y, J) {
    oL(Y === B.size, "blob body must have content length");
    try {
      if (Y != null && Y !== B.size) throw new Qx1;
      let W = Buffer.from(await B.arrayBuffer());
      if (Q.cork(), Q.write(W), Q.uncork(), Q.end(), Z.onBodySent(W), Z.onRequestSent(), !J) I[ElA] = !0;
      G[Ec]()
    } catch (W) {
      A(W)
    }
  }
  async function H1B(A, Q, B, G, Z, I, Y, J) {
    oL(Y !== 0 || G[zlA] === 0, "iterator body cannot be pipelined");
    let W = null;

    function X() {
      if (W) {
        let F = W;
        W = null, F()
      }
    }
    let V = () => new Promise((F, K) => {
      if (oL(W === null), I[ZT]) K(I[ZT]);
      else W = F
    });
    Q.on("close", X).on("drain", X);
    try {
      for await (let F of B) {
        if (I[ZT]) throw I[ZT];
        let K = Q.write(F);
        if (Z.onBodySent(F), !K) await V()
      }
      if (Q.end(), Z.onRequestSent(), !J) I[ElA] = !0;
      G[Ec]()
    } catch (F) {
      A(F)
    } finally {
      Q.off("close", X).off("drain", X)
    }
  }
  E1B.exports = bm8
})
// @from(Start 4851742, End 4855902)
UlA = z((US7, q1B) => {
  var H_ = S6(),
    {
      kBodyUsed: gEA
    } = tI(),
    Yx1 = UA("node:assert"),
    {
      InvalidArgumentError: im8
    } = R7(),
    nm8 = UA("node:events"),
    am8 = [300, 301, 302, 303, 307, 308],
    U1B = Symbol("body");
  class Ix1 {
    constructor(A) {
      this[U1B] = A, this[gEA] = !1
    }
    async * [Symbol.asyncIterator]() {
      Yx1(!this[gEA], "disturbed"), this[gEA] = !0, yield* this[U1B]
    }
  }
  class w1B {
    constructor(A, Q, B, G) {
      if (Q != null && (!Number.isInteger(Q) || Q < 0)) throw new im8("maxRedirections must be a positive number");
      if (H_.validateHandler(G, B.method, B.upgrade), this.dispatch = A, this.location = null, this.abort = null, this.opts = {
          ...B,
          maxRedirections: 0
        }, this.maxRedirections = Q, this.handler = G, this.history = [], this.redirectionLimitReached = !1, H_.isStream(this.opts.body)) {
        if (H_.bodyLength(this.opts.body) === 0) this.opts.body.on("data", function() {
          Yx1(!1)
        });
        if (typeof this.opts.body.readableDidRead !== "boolean") this.opts.body[gEA] = !1, nm8.prototype.on.call(this.opts.body, "data", function() {
          this[gEA] = !0
        })
      } else if (this.opts.body && typeof this.opts.body.pipeTo === "function") this.opts.body = new Ix1(this.opts.body);
      else if (this.opts.body && typeof this.opts.body !== "string" && !ArrayBuffer.isView(this.opts.body) && H_.isIterable(this.opts.body)) this.opts.body = new Ix1(this.opts.body)
    }
    onConnect(A) {
      this.abort = A, this.handler.onConnect(A, {
        history: this.history
      })
    }
    onUpgrade(A, Q, B) {
      this.handler.onUpgrade(A, Q, B)
    }
    onError(A) {
      this.handler.onError(A)
    }
    onHeaders(A, Q, B, G) {
      if (this.location = this.history.length >= this.maxRedirections || H_.isDisturbed(this.opts.body) ? null : sm8(A, Q), this.opts.throwOnMaxRedirect && this.history.length >= this.maxRedirections) {
        if (this.request) this.request.abort(Error("max redirects"));
        this.redirectionLimitReached = !0, this.abort(Error("max redirects"));
        return
      }
      if (this.opts.origin) this.history.push(new URL(this.opts.path, this.opts.origin));
      if (!this.location) return this.handler.onHeaders(A, Q, B, G);
      let {
        origin: Z,
        pathname: I,
        search: Y
      } = H_.parseURL(new URL(this.location, this.opts.origin && new URL(this.opts.path, this.opts.origin))), J = Y ? `${I}${Y}` : I;
      if (this.opts.headers = rm8(this.opts.headers, A === 303, this.opts.origin !== Z), this.opts.path = J, this.opts.origin = Z, this.opts.maxRedirections = 0, this.opts.query = null, A === 303 && this.opts.method !== "HEAD") this.opts.method = "GET", this.opts.body = null
    }
    onData(A) {
      if (this.location);
      else return this.handler.onData(A)
    }
    onComplete(A) {
      if (this.location) this.location = null, this.abort = null, this.dispatch(this.opts, this);
      else this.handler.onComplete(A)
    }
    onBodySent(A) {
      if (this.handler.onBodySent) this.handler.onBodySent(A)
    }
  }

  function sm8(A, Q) {
    if (am8.indexOf(A) === -1) return null;
    for (let B = 0; B < Q.length; B += 2)
      if (Q[B].length === 8 && H_.headerNameToString(Q[B]) === "location") return Q[B + 1]
  }

  function $1B(A, Q, B) {
    if (A.length === 4) return H_.headerNameToString(A) === "host";
    if (Q && H_.headerNameToString(A).startsWith("content-")) return !0;
    if (B && (A.length === 13 || A.length === 6 || A.length === 19)) {
      let G = H_.headerNameToString(A);
      return G === "authorization" || G === "cookie" || G === "proxy-authorization"
    }
    return !1
  }

  function rm8(A, Q, B) {
    let G = [];
    if (Array.isArray(A)) {
      for (let Z = 0; Z < A.length; Z += 2)
        if (!$1B(A[Z], Q, B)) G.push(A[Z], A[Z + 1])
    } else if (A && typeof A === "object") {
      for (let Z of Object.keys(A))
        if (!$1B(Z, Q, B)) G.push(Z, A[Z])
    } else Yx1(A == null, "headers must be an object or an array");
    return G
  }
  q1B.exports = w1B
})
// @from(Start 4855908, End 4856305)
$lA = z(($S7, N1B) => {
  var om8 = UlA();

  function tm8({
    maxRedirections: A
  }) {
    return (Q) => {
      return function(G, Z) {
        let {
          maxRedirections: I = A
        } = G;
        if (!I) return Q(G, Z);
        let Y = new om8(Q, I, G, Z);
        return G = {
          ...G,
          maxRedirections: 0
        }, Q(G, Y)
      }
    }
  }
  N1B.exports = tm8
})
// @from(Start 4856311, End 4867636)
iEA = z((wS7, y1B) => {
  var jb = UA("node:assert"),
    P1B = UA("node:net"),
    em8 = UA("node:http"),
    fo = S6(),
    {
      channels: W3A
    } = p5A(),
    Ad8 = HeQ(),
    Qd8 = a5A(),
    {
      InvalidArgumentError: NW,
      InformationalError: Bd8,
      ClientDestroyedError: Gd8
    } = R7(),
    Zd8 = TEA(),
    {
      kUrl: C_,
      kServerName: zc,
      kClient: Id8,
      kBusy: Jx1,
      kConnect: Yd8,
      kResuming: ho,
      kRunning: pEA,
      kPending: lEA,
      kSize: cEA,
      kQueue: IT,
      kConnected: Jd8,
      kConnecting: X3A,
      kNeedDrain: $c,
      kKeepAliveDefaultTimeout: L1B,
      kHostHeader: Wd8,
      kPendingIdx: YT,
      kRunningIdx: Sb,
      kError: Xd8,
      kPipelining: wlA,
      kKeepAliveTimeoutValue: Vd8,
      kMaxHeadersSize: Fd8,
      kKeepAliveMaxTimeout: Kd8,
      kKeepAliveTimeoutThreshold: Dd8,
      kHeadersTimeout: Hd8,
      kBodyTimeout: Cd8,
      kStrictContentLength: Ed8,
      kConnector: uEA,
      kMaxRedirections: zd8,
      kMaxRequests: Wx1,
      kCounter: Ud8,
      kClose: $d8,
      kDestroy: wd8,
      kDispatch: qd8,
      kInterceptors: M1B,
      kLocalAddress: mEA,
      kMaxResponseSize: Nd8,
      kOnError: Ld8,
      kHTTPContext: LW,
      kMaxConcurrentStreams: Md8,
      kResume: dEA
    } = tI(),
    Od8 = X1B(),
    Rd8 = z1B(),
    O1B = !1,
    Uc = Symbol("kClosedResolve"),
    R1B = () => {};

  function j1B(A) {
    return A[wlA] ?? A[LW]?.defaultPipelining ?? 1
  }
  class S1B extends Qd8 {
    constructor(A, {
      interceptors: Q,
      maxHeaderSize: B,
      headersTimeout: G,
      socketTimeout: Z,
      requestTimeout: I,
      connectTimeout: Y,
      bodyTimeout: J,
      idleTimeout: W,
      keepAlive: X,
      keepAliveTimeout: V,
      maxKeepAliveTimeout: F,
      keepAliveMaxTimeout: K,
      keepAliveTimeoutThreshold: D,
      socketPath: H,
      pipelining: C,
      tls: E,
      strictContentLength: U,
      maxCachedSessions: q,
      maxRedirections: w,
      connect: N,
      maxRequestsPerClient: R,
      localAddress: T,
      maxResponseSize: y,
      autoSelectFamily: v,
      autoSelectFamilyAttemptTimeout: x,
      maxConcurrentStreams: p,
      allowH2: u
    } = {}) {
      super();
      if (X !== void 0) throw new NW("unsupported keepAlive, use pipelining=0 instead");
      if (Z !== void 0) throw new NW("unsupported socketTimeout, use headersTimeout & bodyTimeout instead");
      if (I !== void 0) throw new NW("unsupported requestTimeout, use headersTimeout & bodyTimeout instead");
      if (W !== void 0) throw new NW("unsupported idleTimeout, use keepAliveTimeout instead");
      if (F !== void 0) throw new NW("unsupported maxKeepAliveTimeout, use keepAliveMaxTimeout instead");
      if (B != null && !Number.isFinite(B)) throw new NW("invalid maxHeaderSize");
      if (H != null && typeof H !== "string") throw new NW("invalid socketPath");
      if (Y != null && (!Number.isFinite(Y) || Y < 0)) throw new NW("invalid connectTimeout");
      if (V != null && (!Number.isFinite(V) || V <= 0)) throw new NW("invalid keepAliveTimeout");
      if (K != null && (!Number.isFinite(K) || K <= 0)) throw new NW("invalid keepAliveMaxTimeout");
      if (D != null && !Number.isFinite(D)) throw new NW("invalid keepAliveTimeoutThreshold");
      if (G != null && (!Number.isInteger(G) || G < 0)) throw new NW("headersTimeout must be a positive integer or zero");
      if (J != null && (!Number.isInteger(J) || J < 0)) throw new NW("bodyTimeout must be a positive integer or zero");
      if (N != null && typeof N !== "function" && typeof N !== "object") throw new NW("connect must be a function or an object");
      if (w != null && (!Number.isInteger(w) || w < 0)) throw new NW("maxRedirections must be a positive number");
      if (R != null && (!Number.isInteger(R) || R < 0)) throw new NW("maxRequestsPerClient must be a positive number");
      if (T != null && (typeof T !== "string" || P1B.isIP(T) === 0)) throw new NW("localAddress must be valid string IP address");
      if (y != null && (!Number.isInteger(y) || y < -1)) throw new NW("maxResponseSize must be a positive number");
      if (x != null && (!Number.isInteger(x) || x < -1)) throw new NW("autoSelectFamilyAttemptTimeout must be a positive number");
      if (u != null && typeof u !== "boolean") throw new NW("allowH2 must be a valid boolean value");
      if (p != null && (typeof p !== "number" || p < 1)) throw new NW("maxConcurrentStreams must be a positive integer, greater than 0");
      if (typeof N !== "function") N = Zd8({
        ...E,
        maxCachedSessions: q,
        allowH2: u,
        socketPath: H,
        timeout: Y,
        ...v ? {
          autoSelectFamily: v,
          autoSelectFamilyAttemptTimeout: x
        } : void 0,
        ...N
      });
      if (Q?.Client && Array.isArray(Q.Client)) {
        if (this[M1B] = Q.Client, !O1B) O1B = !0, process.emitWarning("Client.Options#interceptor is deprecated. Use Dispatcher#compose instead.", {
          code: "UNDICI-CLIENT-INTERCEPTOR-DEPRECATED"
        })
      } else this[M1B] = [Td8({
        maxRedirections: w
      })];
      this[C_] = fo.parseOrigin(A), this[uEA] = N, this[wlA] = C != null ? C : 1, this[Fd8] = B || em8.maxHeaderSize, this[L1B] = V == null ? 4000 : V, this[Kd8] = K == null ? 600000 : K, this[Dd8] = D == null ? 2000 : D, this[Vd8] = this[L1B], this[zc] = null, this[mEA] = T != null ? T : null, this[ho] = 0, this[$c] = 0, this[Wd8] = `host: ${this[C_].hostname}${this[C_].port?`:${this[C_].port}`:""}\r
`, this[Cd8] = J != null ? J : 300000, this[Hd8] = G != null ? G : 300000, this[Ed8] = U == null ? !0 : U, this[zd8] = w, this[Wx1] = R, this[Uc] = null, this[Nd8] = y > -1 ? y : -1, this[Md8] = p != null ? p : 100, this[LW] = null, this[IT] = [], this[Sb] = 0, this[YT] = 0, this[dEA] = (e) => Xx1(this, e), this[Ld8] = (e) => _1B(this, e)
    }
    get pipelining() {
      return this[wlA]
    }
    set pipelining(A) {
      this[wlA] = A, this[dEA](!0)
    }
    get[lEA]() {
      return this[IT].length - this[YT]
    }
    get[pEA]() {
      return this[YT] - this[Sb]
    }
    get[cEA]() {
      return this[IT].length - this[Sb]
    }
    get[Jd8]() {
      return !!this[LW] && !this[X3A] && !this[LW].destroyed
    }
    get[Jx1]() {
      return Boolean(this[LW]?.busy(null) || this[cEA] >= (j1B(this) || 1) || this[lEA] > 0)
    } [Yd8](A) {
      k1B(this), this.once("connect", A)
    } [qd8](A, Q) {
      let B = A.origin || this[C_].origin,
        G = new Ad8(B, A, Q);
      if (this[IT].push(G), this[ho]);
      else if (fo.bodyLength(G.body) == null && fo.isIterable(G.body)) this[ho] = 1, queueMicrotask(() => Xx1(this));
      else this[dEA](!0);
      if (this[ho] && this[$c] !== 2 && this[Jx1]) this[$c] = 2;
      return this[$c] < 2
    }
    async [$d8]() {
      return new Promise((A) => {
        if (this[cEA]) this[Uc] = A;
        else A(null)
      })
    }
    async [wd8](A) {
      return new Promise((Q) => {
        let B = this[IT].splice(this[YT]);
        for (let Z = 0; Z < B.length; Z++) {
          let I = B[Z];
          fo.errorRequest(this, I, A)
        }
        let G = () => {
          if (this[Uc]) this[Uc](), this[Uc] = null;
          Q(null)
        };
        if (this[LW]) this[LW].destroy(A, G), this[LW] = null;
        else queueMicrotask(G);
        this[dEA]()
      })
    }
  }
  var Td8 = $lA();

  function _1B(A, Q) {
    if (A[pEA] === 0 && Q.code !== "UND_ERR_INFO" && Q.code !== "UND_ERR_SOCKET") {
      jb(A[YT] === A[Sb]);
      let B = A[IT].splice(A[Sb]);
      for (let G = 0; G < B.length; G++) {
        let Z = B[G];
        fo.errorRequest(A, Z, Q)
      }
      jb(A[cEA] === 0)
    }
  }
  async function k1B(A) {
    jb(!A[X3A]), jb(!A[LW]);
    let {
      host: Q,
      hostname: B,
      protocol: G,
      port: Z
    } = A[C_];
    if (B[0] === "[") {
      let I = B.indexOf("]");
      jb(I !== -1);
      let Y = B.substring(1, I);
      jb(P1B.isIP(Y)), B = Y
    }
    if (A[X3A] = !0, W3A.beforeConnect.hasSubscribers) W3A.beforeConnect.publish({
      connectParams: {
        host: Q,
        hostname: B,
        protocol: G,
        port: Z,
        version: A[LW]?.version,
        servername: A[zc],
        localAddress: A[mEA]
      },
      connector: A[uEA]
    });
    try {
      let I = await new Promise((Y, J) => {
        A[uEA]({
          host: Q,
          hostname: B,
          protocol: G,
          port: Z,
          servername: A[zc],
          localAddress: A[mEA]
        }, (W, X) => {
          if (W) J(W);
          else Y(X)
        })
      });
      if (A.destroyed) {
        fo.destroy(I.on("error", R1B), new Gd8);
        return
      }
      jb(I);
      try {
        A[LW] = I.alpnProtocol === "h2" ? await Rd8(A, I) : await Od8(A, I)
      } catch (Y) {
        throw I.destroy().on("error", R1B), Y
      }
      if (A[X3A] = !1, I[Ud8] = 0, I[Wx1] = A[Wx1], I[Id8] = A, I[Xd8] = null, W3A.connected.hasSubscribers) W3A.connected.publish({
        connectParams: {
          host: Q,
          hostname: B,
          protocol: G,
          port: Z,
          version: A[LW]?.version,
          servername: A[zc],
          localAddress: A[mEA]
        },
        connector: A[uEA],
        socket: I
      });
      A.emit("connect", A[C_], [A])
    } catch (I) {
      if (A.destroyed) return;
      if (A[X3A] = !1, W3A.connectError.hasSubscribers) W3A.connectError.publish({
        connectParams: {
          host: Q,
          hostname: B,
          protocol: G,
          port: Z,
          version: A[LW]?.version,
          servername: A[zc],
          localAddress: A[mEA]
        },
        connector: A[uEA],
        error: I
      });
      if (I.code === "ERR_TLS_CERT_ALTNAME_INVALID") {
        jb(A[pEA] === 0);
        while (A[lEA] > 0 && A[IT][A[YT]].servername === A[zc]) {
          let Y = A[IT][A[YT]++];
          fo.errorRequest(A, Y, I)
        }
      } else _1B(A, I);
      A.emit("connectionError", A[C_], [A], I)
    }
    A[dEA]()
  }

  function T1B(A) {
    A[$c] = 0, A.emit("drain", A[C_], [A])
  }

  function Xx1(A, Q) {
    if (A[ho] === 2) return;
    if (A[ho] = 2, Pd8(A, Q), A[ho] = 0, A[Sb] > 256) A[IT].splice(0, A[Sb]), A[YT] -= A[Sb], A[Sb] = 0
  }

  function Pd8(A, Q) {
    while (!0) {
      if (A.destroyed) {
        jb(A[lEA] === 0);
        return
      }
      if (A[Uc] && !A[cEA]) {
        A[Uc](), A[Uc] = null;
        return
      }
      if (A[LW]) A[LW].resume();
      if (A[Jx1]) A[$c] = 2;
      else if (A[$c] === 2) {
        if (Q) A[$c] = 1, queueMicrotask(() => T1B(A));
        else T1B(A);
        continue
      }
      if (A[lEA] === 0) return;
      if (A[pEA] >= (j1B(A) || 1)) return;
      let B = A[IT][A[YT]];
      if (A[C_].protocol === "https:" && A[zc] !== B.servername) {
        if (A[pEA] > 0) return;
        A[zc] = B.servername, A[LW]?.destroy(new Bd8("servername changed"), () => {
          A[LW] = null, Xx1(A)
        })
      }
      if (A[X3A]) return;
      if (!A[LW]) {
        k1B(A);
        return
      }
      if (A[LW].destroyed) return;
      if (A[LW].busy(B)) return;
      if (!B.aborted && A[LW].write(B)) A[YT]++;
      else A[IT].splice(A[YT], 1)
    }
  }
  y1B.exports = S1B
})
// @from(Start 4867642, End 4868590)
Fx1 = z((qS7, x1B) => {
  class Vx1 {
    constructor() {
      this.bottom = 0, this.top = 0, this.list = Array(2048), this.next = null
    }
    isEmpty() {
      return this.top === this.bottom
    }
    isFull() {
      return (this.top + 1 & 2047) === this.bottom
    }
    push(A) {
      this.list[this.top] = A, this.top = this.top + 1 & 2047
    }
    shift() {
      let A = this.list[this.bottom];
      if (A === void 0) return null;
      return this.list[this.bottom] = void 0, this.bottom = this.bottom + 1 & 2047, A
    }
  }
  x1B.exports = class {
    constructor() {
      this.head = this.tail = new Vx1
    }
    isEmpty() {
      return this.head.isEmpty()
    }
    push(Q) {
      if (this.head.isFull()) this.head = this.head.next = new Vx1;
      this.head.push(Q)
    }
    shift() {
      let Q = this.tail,
        B = Q.shift();
      if (Q.isEmpty() && Q.next !== null) this.tail = Q.next;
      return B
    }
  }
})
// @from(Start 4868596, End 4869168)
f1B = z((NS7, b1B) => {
  var {
    kFree: jd8,
    kConnected: Sd8,
    kPending: _d8,
    kQueued: kd8,
    kRunning: yd8,
    kSize: xd8
  } = tI(), go = Symbol("pool");
  class v1B {
    constructor(A) {
      this[go] = A
    }
    get connected() {
      return this[go][Sd8]
    }
    get free() {
      return this[go][jd8]
    }
    get pending() {
      return this[go][_d8]
    }
    get queued() {
      return this[go][kd8]
    }
    get running() {
      return this[go][yd8]
    }
    get size() {
      return this[go][xd8]
    }
  }
  b1B.exports = v1B
})
// @from(Start 4869174, End 4872604)
Ex1 = z((LS7, a1B) => {
  var vd8 = a5A(),
    bd8 = Fx1(),
    {
      kConnected: Kx1,
      kSize: h1B,
      kRunning: g1B,
      kPending: u1B,
      kQueued: nEA,
      kBusy: fd8,
      kFree: hd8,
      kUrl: gd8,
      kClose: ud8,
      kDestroy: md8,
      kDispatch: dd8
    } = tI(),
    cd8 = f1B(),
    GU = Symbol("clients"),
    tC = Symbol("needDrain"),
    aEA = Symbol("queue"),
    Dx1 = Symbol("closed resolve"),
    Hx1 = Symbol("onDrain"),
    m1B = Symbol("onConnect"),
    d1B = Symbol("onDisconnect"),
    c1B = Symbol("onConnectionError"),
    Cx1 = Symbol("get dispatcher"),
    l1B = Symbol("add client"),
    i1B = Symbol("remove client"),
    p1B = Symbol("stats");
  class n1B extends vd8 {
    constructor() {
      super();
      this[aEA] = new bd8, this[GU] = [], this[nEA] = 0;
      let A = this;
      this[Hx1] = function(B, G) {
        let Z = A[aEA],
          I = !1;
        while (!I) {
          let Y = Z.shift();
          if (!Y) break;
          A[nEA]--, I = !this.dispatch(Y.opts, Y.handler)
        }
        if (this[tC] = I, !this[tC] && A[tC]) A[tC] = !1, A.emit("drain", B, [A, ...G]);
        if (A[Dx1] && Z.isEmpty()) Promise.all(A[GU].map((Y) => Y.close())).then(A[Dx1])
      }, this[m1B] = (Q, B) => {
        A.emit("connect", Q, [A, ...B])
      }, this[d1B] = (Q, B, G) => {
        A.emit("disconnect", Q, [A, ...B], G)
      }, this[c1B] = (Q, B, G) => {
        A.emit("connectionError", Q, [A, ...B], G)
      }, this[p1B] = new cd8(this)
    }
    get[fd8]() {
      return this[tC]
    }
    get[Kx1]() {
      return this[GU].filter((A) => A[Kx1]).length
    }
    get[hd8]() {
      return this[GU].filter((A) => A[Kx1] && !A[tC]).length
    }
    get[u1B]() {
      let A = this[nEA];
      for (let {
          [u1B]: Q
        }
        of this[GU]) A += Q;
      return A
    }
    get[g1B]() {
      let A = 0;
      for (let {
          [g1B]: Q
        }
        of this[GU]) A += Q;
      return A
    }
    get[h1B]() {
      let A = this[nEA];
      for (let {
          [h1B]: Q
        }
        of this[GU]) A += Q;
      return A
    }
    get stats() {
      return this[p1B]
    }
    async [ud8]() {
      if (this[aEA].isEmpty()) await Promise.all(this[GU].map((A) => A.close()));
      else await new Promise((A) => {
        this[Dx1] = A
      })
    }
    async [md8](A) {
      while (!0) {
        let Q = this[aEA].shift();
        if (!Q) break;
        Q.handler.onError(A)
      }
      await Promise.all(this[GU].map((Q) => Q.destroy(A)))
    } [dd8](A, Q) {
      let B = this[Cx1]();
      if (!B) this[tC] = !0, this[aEA].push({
        opts: A,
        handler: Q
      }), this[nEA]++;
      else if (!B.dispatch(A, Q)) B[tC] = !0, this[tC] = !this[Cx1]();
      return !this[tC]
    } [l1B](A) {
      if (A.on("drain", this[Hx1]).on("connect", this[m1B]).on("disconnect", this[d1B]).on("connectionError", this[c1B]), this[GU].push(A), this[tC]) queueMicrotask(() => {
        if (this[tC]) this[Hx1](A[gd8], [this, A])
      });
      return this
    } [i1B](A) {
      A.close(() => {
        let Q = this[GU].indexOf(A);
        if (Q !== -1) this[GU].splice(Q, 1)
      }), this[tC] = this[GU].some((Q) => !Q[tC] && Q.closed !== !0 && Q.destroyed !== !0)
    }
  }
  a1B.exports = {
    PoolBase: n1B,
    kClients: GU,
    kNeedDrain: tC,
    kAddClient: l1B,
    kRemoveClient: i1B,
    kGetDispatcher: Cx1
  }
})
// @from(Start 4872610, End 4874549)
V3A = z((MS7, A0B) => {
  var {
    PoolBase: pd8,
    kClients: s1B,
    kNeedDrain: ld8,
    kAddClient: id8,
    kGetDispatcher: nd8
  } = Ex1(), ad8 = iEA(), {
    InvalidArgumentError: zx1
  } = R7(), r1B = S6(), {
    kUrl: o1B,
    kInterceptors: sd8
  } = tI(), rd8 = TEA(), Ux1 = Symbol("options"), $x1 = Symbol("connections"), t1B = Symbol("factory");

  function od8(A, Q) {
    return new ad8(A, Q)
  }
  class e1B extends pd8 {
    constructor(A, {
      connections: Q,
      factory: B = od8,
      connect: G,
      connectTimeout: Z,
      tls: I,
      maxCachedSessions: Y,
      socketPath: J,
      autoSelectFamily: W,
      autoSelectFamilyAttemptTimeout: X,
      allowH2: V,
      ...F
    } = {}) {
      super();
      if (Q != null && (!Number.isFinite(Q) || Q < 0)) throw new zx1("invalid connections");
      if (typeof B !== "function") throw new zx1("factory must be a function.");
      if (G != null && typeof G !== "function" && typeof G !== "object") throw new zx1("connect must be a function or an object");
      if (typeof G !== "function") G = rd8({
        ...I,
        maxCachedSessions: Y,
        allowH2: V,
        socketPath: J,
        timeout: Z,
        ...W ? {
          autoSelectFamily: W,
          autoSelectFamilyAttemptTimeout: X
        } : void 0,
        ...G
      });
      this[sd8] = F.interceptors?.Pool && Array.isArray(F.interceptors.Pool) ? F.interceptors.Pool : [], this[$x1] = Q || null, this[o1B] = r1B.parseOrigin(A), this[Ux1] = {
        ...r1B.deepClone(F),
        connect: G,
        allowH2: V
      }, this[Ux1].interceptors = F.interceptors ? {
        ...F.interceptors
      } : void 0, this[t1B] = B
    } [nd8]() {
      for (let A of this[s1B])
        if (!A[ld8]) return A;
      if (!this[$x1] || this[s1B].length < this[$x1]) {
        let A = this[t1B](this[o1B], this[Ux1]);
        return this[id8](A), A
      }
    }
  }
  A0B.exports = e1B
})
// @from(Start 4874555, End 4877916)
Y0B = z((OS7, I0B) => {
  var {
    BalancedPoolMissingUpstreamError: td8,
    InvalidArgumentError: ed8
  } = R7(), {
    PoolBase: Ac8,
    kClients: _H,
    kNeedDrain: sEA,
    kAddClient: Qc8,
    kRemoveClient: Bc8,
    kGetDispatcher: Gc8
  } = Ex1(), Zc8 = V3A(), {
    kUrl: wx1,
    kInterceptors: Ic8
  } = tI(), {
    parseOrigin: Q0B
  } = S6(), B0B = Symbol("factory"), qlA = Symbol("options"), G0B = Symbol("kGreatestCommonDivisor"), uo = Symbol("kCurrentWeight"), mo = Symbol("kIndex"), tL = Symbol("kWeight"), NlA = Symbol("kMaxWeightPerServer"), LlA = Symbol("kErrorPenalty");

  function Yc8(A, Q) {
    if (A === 0) return Q;
    while (Q !== 0) {
      let B = Q;
      Q = A % Q, A = B
    }
    return A
  }

  function Jc8(A, Q) {
    return new Zc8(A, Q)
  }
  class Z0B extends Ac8 {
    constructor(A = [], {
      factory: Q = Jc8,
      ...B
    } = {}) {
      super();
      if (this[qlA] = B, this[mo] = -1, this[uo] = 0, this[NlA] = this[qlA].maxWeightPerServer || 100, this[LlA] = this[qlA].errorPenalty || 15, !Array.isArray(A)) A = [A];
      if (typeof Q !== "function") throw new ed8("factory must be a function.");
      this[Ic8] = B.interceptors?.BalancedPool && Array.isArray(B.interceptors.BalancedPool) ? B.interceptors.BalancedPool : [], this[B0B] = Q;
      for (let G of A) this.addUpstream(G);
      this._updateBalancedPoolStats()
    }
    addUpstream(A) {
      let Q = Q0B(A).origin;
      if (this[_H].find((G) => G[wx1].origin === Q && G.closed !== !0 && G.destroyed !== !0)) return this;
      let B = this[B0B](Q, Object.assign({}, this[qlA]));
      this[Qc8](B), B.on("connect", () => {
        B[tL] = Math.min(this[NlA], B[tL] + this[LlA])
      }), B.on("connectionError", () => {
        B[tL] = Math.max(1, B[tL] - this[LlA]), this._updateBalancedPoolStats()
      }), B.on("disconnect", (...G) => {
        let Z = G[2];
        if (Z && Z.code === "UND_ERR_SOCKET") B[tL] = Math.max(1, B[tL] - this[LlA]), this._updateBalancedPoolStats()
      });
      for (let G of this[_H]) G[tL] = this[NlA];
      return this._updateBalancedPoolStats(), this
    }
    _updateBalancedPoolStats() {
      let A = 0;
      for (let Q = 0; Q < this[_H].length; Q++) A = Yc8(this[_H][Q][tL], A);
      this[G0B] = A
    }
    removeUpstream(A) {
      let Q = Q0B(A).origin,
        B = this[_H].find((G) => G[wx1].origin === Q && G.closed !== !0 && G.destroyed !== !0);
      if (B) this[Bc8](B);
      return this
    }
    get upstreams() {
      return this[_H].filter((A) => A.closed !== !0 && A.destroyed !== !0).map((A) => A[wx1].origin)
    } [Gc8]() {
      if (this[_H].length === 0) throw new td8;
      if (!this[_H].find((Z) => !Z[sEA] && Z.closed !== !0 && Z.destroyed !== !0)) return;
      if (this[_H].map((Z) => Z[sEA]).reduce((Z, I) => Z && I, !0)) return;
      let B = 0,
        G = this[_H].findIndex((Z) => !Z[sEA]);
      while (B++ < this[_H].length) {
        this[mo] = (this[mo] + 1) % this[_H].length;
        let Z = this[_H][this[mo]];
        if (Z[tL] > this[_H][G][tL] && !Z[sEA]) G = this[mo];
        if (this[mo] === 0) {
          if (this[uo] = this[uo] - this[G0B], this[uo] <= 0) this[uo] = this[NlA]
        }
        if (Z[tL] >= this[uo] && !Z[sEA]) return Z
      }
      return this[uo] = this[_H][G][tL], this[mo] = G, this[_H][G]
    }
  }
  I0B.exports = Z0B
})
// @from(Start 4877922, End 4880606)
F3A = z((RS7, H0B) => {
  var {
    InvalidArgumentError: MlA
  } = R7(), {
    kClients: wc,
    kRunning: J0B,
    kClose: Wc8,
    kDestroy: Xc8,
    kDispatch: Vc8,
    kInterceptors: Fc8
  } = tI(), Kc8 = a5A(), Dc8 = V3A(), Hc8 = iEA(), Cc8 = S6(), Ec8 = $lA(), W0B = Symbol("onConnect"), X0B = Symbol("onDisconnect"), V0B = Symbol("onConnectionError"), zc8 = Symbol("maxRedirections"), F0B = Symbol("onDrain"), K0B = Symbol("factory"), qx1 = Symbol("options");

  function Uc8(A, Q) {
    return Q && Q.connections === 1 ? new Hc8(A, Q) : new Dc8(A, Q)
  }
  class D0B extends Kc8 {
    constructor({
      factory: A = Uc8,
      maxRedirections: Q = 0,
      connect: B,
      ...G
    } = {}) {
      super();
      if (typeof A !== "function") throw new MlA("factory must be a function.");
      if (B != null && typeof B !== "function" && typeof B !== "object") throw new MlA("connect must be a function or an object");
      if (!Number.isInteger(Q) || Q < 0) throw new MlA("maxRedirections must be a positive number");
      if (B && typeof B !== "function") B = {
        ...B
      };
      this[Fc8] = G.interceptors?.Agent && Array.isArray(G.interceptors.Agent) ? G.interceptors.Agent : [Ec8({
        maxRedirections: Q
      })], this[qx1] = {
        ...Cc8.deepClone(G),
        connect: B
      }, this[qx1].interceptors = G.interceptors ? {
        ...G.interceptors
      } : void 0, this[zc8] = Q, this[K0B] = A, this[wc] = new Map, this[F0B] = (Z, I) => {
        this.emit("drain", Z, [this, ...I])
      }, this[W0B] = (Z, I) => {
        this.emit("connect", Z, [this, ...I])
      }, this[X0B] = (Z, I, Y) => {
        this.emit("disconnect", Z, [this, ...I], Y)
      }, this[V0B] = (Z, I, Y) => {
        this.emit("connectionError", Z, [this, ...I], Y)
      }
    }
    get[J0B]() {
      let A = 0;
      for (let Q of this[wc].values()) A += Q[J0B];
      return A
    } [Vc8](A, Q) {
      let B;
      if (A.origin && (typeof A.origin === "string" || A.origin instanceof URL)) B = String(A.origin);
      else throw new MlA("opts.origin must be a non-empty string or URL.");
      let G = this[wc].get(B);
      if (!G) G = this[K0B](A.origin, this[qx1]).on("drain", this[F0B]).on("connect", this[W0B]).on("disconnect", this[X0B]).on("connectionError", this[V0B]), this[wc].set(B, G);
      return G.dispatch(A, Q)
    }
    async [Wc8]() {
      let A = [];
      for (let Q of this[wc].values()) A.push(Q.close());
      this[wc].clear(), await Promise.all(A)
    }
    async [Xc8](A) {
      let Q = [];
      for (let B of this[wc].values()) Q.push(B.destroy(A));
      this[wc].clear(), await Promise.all(Q)
    }
  }
  H0B.exports = D0B
})
// @from(Start 4880612, End 4884765)
Lx1 = z((TS7, $0B) => {
  var {
    kProxy: $c8,
    kClose: wc8,
    kDestroy: qc8,
    kInterceptors: Nc8
  } = tI(), {
    URL: rEA
  } = UA("node:url"), Lc8 = F3A(), Mc8 = V3A(), Oc8 = a5A(), {
    InvalidArgumentError: TlA,
    RequestAbortedError: Rc8,
    SecureProxyConnectionError: Tc8
  } = R7(), C0B = TEA(), OlA = Symbol("proxy agent"), RlA = Symbol("proxy client"), oEA = Symbol("proxy headers"), Nx1 = Symbol("request tls settings"), E0B = Symbol("proxy tls settings"), z0B = Symbol("connect endpoint function");

  function Pc8(A) {
    return A === "https:" ? 443 : 80
  }

  function jc8(A, Q) {
    return new Mc8(A, Q)
  }
  var Sc8 = () => {};
  class U0B extends Oc8 {
    constructor(A) {
      super();
      if (!A || typeof A === "object" && !(A instanceof rEA) && !A.uri) throw new TlA("Proxy uri is mandatory");
      let {
        clientFactory: Q = jc8
      } = A;
      if (typeof Q !== "function") throw new TlA("Proxy opts.clientFactory must be a function.");
      let B = this.#A(A),
        {
          href: G,
          origin: Z,
          port: I,
          protocol: Y,
          username: J,
          password: W,
          hostname: X
        } = B;
      if (this[$c8] = {
          uri: G,
          protocol: Y
        }, this[Nc8] = A.interceptors?.ProxyAgent && Array.isArray(A.interceptors.ProxyAgent) ? A.interceptors.ProxyAgent : [], this[Nx1] = A.requestTls, this[E0B] = A.proxyTls, this[oEA] = A.headers || {}, A.auth && A.token) throw new TlA("opts.auth cannot be used in combination with opts.token");
      else if (A.auth) this[oEA]["proxy-authorization"] = `Basic ${A.auth}`;
      else if (A.token) this[oEA]["proxy-authorization"] = A.token;
      else if (J && W) this[oEA]["proxy-authorization"] = `Basic ${Buffer.from(`${decodeURIComponent(J)}:${decodeURIComponent(W)}`).toString("base64")}`;
      let V = C0B({
        ...A.proxyTls
      });
      this[z0B] = C0B({
        ...A.requestTls
      }), this[RlA] = Q(B, {
        connect: V
      }), this[OlA] = new Lc8({
        ...A,
        connect: async (F, K) => {
          let D = F.host;
          if (!F.port) D += `:${Pc8(F.protocol)}`;
          try {
            let {
              socket: H,
              statusCode: C
            } = await this[RlA].connect({
              origin: Z,
              port: I,
              path: D,
              signal: F.signal,
              headers: {
                ...this[oEA],
                host: F.host
              },
              servername: this[E0B]?.servername || X
            });
            if (C !== 200) H.on("error", Sc8).destroy(), K(new Rc8(`Proxy response (${C}) !== 200 when HTTP Tunneling`));
            if (F.protocol !== "https:") {
              K(null, H);
              return
            }
            let E;
            if (this[Nx1]) E = this[Nx1].servername;
            else E = F.servername;
            this[z0B]({
              ...F,
              servername: E,
              httpSocket: H
            }, K)
          } catch (H) {
            if (H.code === "ERR_TLS_CERT_ALTNAME_INVALID") K(new Tc8(H));
            else K(H)
          }
        }
      })
    }
    dispatch(A, Q) {
      let B = _c8(A.headers);
      if (kc8(B), B && !("host" in B) && !("Host" in B)) {
        let {
          host: G
        } = new rEA(A.origin);
        B.host = G
      }
      return this[OlA].dispatch({
        ...A,
        headers: B
      }, Q)
    }
    #A(A) {
      if (typeof A === "string") return new rEA(A);
      else if (A instanceof rEA) return A;
      else return new rEA(A.uri)
    }
    async [wc8]() {
      await this[OlA].close(), await this[RlA].close()
    }
    async [qc8]() {
      await this[OlA].destroy(), await this[RlA].destroy()
    }
  }

  function _c8(A) {
    if (Array.isArray(A)) {
      let Q = {};
      for (let B = 0; B < A.length; B += 2) Q[A[B]] = A[B + 1];
      return Q
    }
    return A
  }

  function kc8(A) {
    if (A && Object.keys(A).find((B) => B.toLowerCase() === "proxy-authorization")) throw new TlA("Proxy-Authorization should be sent in ProxyAgent constructor")
  }
  $0B.exports = U0B
})
// @from(Start 4884771, End 4887660)
R0B = z((PS7, O0B) => {
  var yc8 = a5A(),
    {
      kClose: xc8,
      kDestroy: vc8,
      kClosed: w0B,
      kDestroyed: q0B,
      kDispatch: bc8,
      kNoProxyAgent: tEA,
      kHttpProxyAgent: qc,
      kHttpsProxyAgent: co
    } = tI(),
    N0B = Lx1(),
    fc8 = F3A(),
    hc8 = {
      "http:": 80,
      "https:": 443
    },
    L0B = !1;
  class M0B extends yc8 {
    #A = null;
    #Q = null;
    #B = null;
    constructor(A = {}) {
      super();
      if (this.#B = A, !L0B) L0B = !0, process.emitWarning("EnvHttpProxyAgent is experimental, expect them to change at any time.", {
        code: "UNDICI-EHPA"
      });
      let {
        httpProxy: Q,
        httpsProxy: B,
        noProxy: G,
        ...Z
      } = A;
      this[tEA] = new fc8(Z);
      let I = Q ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
      if (I) this[qc] = new N0B({
        ...Z,
        uri: I
      });
      else this[qc] = this[tEA];
      let Y = B ?? process.env.https_proxy ?? process.env.HTTPS_PROXY;
      if (Y) this[co] = new N0B({
        ...Z,
        uri: Y
      });
      else this[co] = this[qc];
      this.#J()
    } [bc8](A, Q) {
      let B = new URL(A.origin);
      return this.#Z(B).dispatch(A, Q)
    }
    async [xc8]() {
      if (await this[tEA].close(), !this[qc][w0B]) await this[qc].close();
      if (!this[co][w0B]) await this[co].close()
    }
    async [vc8](A) {
      if (await this[tEA].destroy(A), !this[qc][q0B]) await this[qc].destroy(A);
      if (!this[co][q0B]) await this[co].destroy(A)
    }
    #Z(A) {
      let {
        protocol: Q,
        host: B,
        port: G
      } = A;
      if (B = B.replace(/:\d*$/, "").toLowerCase(), G = Number.parseInt(G, 10) || hc8[Q] || 0, !this.#G(B, G)) return this[tEA];
      if (Q === "https:") return this[co];
      return this[qc]
    }
    #G(A, Q) {
      if (this.#I) this.#J();
      if (this.#Q.length === 0) return !0;
      if (this.#A === "*") return !1;
      for (let B = 0; B < this.#Q.length; B++) {
        let G = this.#Q[B];
        if (G.port && G.port !== Q) continue;
        if (!/^[.*]/.test(G.hostname)) {
          if (A === G.hostname) return !1
        } else if (A.endsWith(G.hostname.replace(/^\*/, ""))) return !1
      }
      return !0
    }
    #J() {
      let A = this.#B.noProxy ?? this.#V,
        Q = A.split(/[,\s]/),
        B = [];
      for (let G = 0; G < Q.length; G++) {
        let Z = Q[G];
        if (!Z) continue;
        let I = Z.match(/^(.+):(\d+)$/);
        B.push({
          hostname: (I ? I[1] : Z).toLowerCase(),
          port: I ? Number.parseInt(I[2], 10) : 0
        })
      }
      this.#A = A, this.#Q = B
    }
    get #I() {
      if (this.#B.noProxy !== void 0) return !1;
      return this.#A !== this.#V
    }
    get #V() {
      return process.env.no_proxy ?? process.env.NO_PROXY ?? ""
    }
  }
  O0B.exports = M0B
})
// @from(Start 4887666, End 4894367)
PlA = z((jS7, S0B) => {
  var K3A = UA("node:assert"),
    {
      kRetryHandlerDefaultRetry: T0B
    } = tI(),
    {
      RequestRetryError: eEA
    } = R7(),
    {
      isDisturbed: P0B,
      parseHeaders: gc8,
      parseRangeHeader: j0B,
      wrapRequestBody: uc8
    } = S6();

  function mc8(A) {
    let Q = Date.now();
    return new Date(A).getTime() - Q
  }
  class Mx1 {
    constructor(A, Q) {
      let {
        retryOptions: B,
        ...G
      } = A, {
        retry: Z,
        maxRetries: I,
        maxTimeout: Y,
        minTimeout: J,
        timeoutFactor: W,
        methods: X,
        errorCodes: V,
        retryAfter: F,
        statusCodes: K
      } = B ?? {};
      this.dispatch = Q.dispatch, this.handler = Q.handler, this.opts = {
        ...G,
        body: uc8(A.body)
      }, this.abort = null, this.aborted = !1, this.retryOpts = {
        retry: Z ?? Mx1[T0B],
        retryAfter: F ?? !0,
        maxTimeout: Y ?? 30000,
        minTimeout: J ?? 500,
        timeoutFactor: W ?? 2,
        maxRetries: I ?? 5,
        methods: X ?? ["GET", "HEAD", "OPTIONS", "PUT", "DELETE", "TRACE"],
        statusCodes: K ?? [500, 502, 503, 504, 429],
        errorCodes: V ?? ["ECONNRESET", "ECONNREFUSED", "ENOTFOUND", "ENETDOWN", "ENETUNREACH", "EHOSTDOWN", "EHOSTUNREACH", "EPIPE", "UND_ERR_SOCKET"]
      }, this.retryCount = 0, this.retryCountCheckpoint = 0, this.start = 0, this.end = null, this.etag = null, this.resume = null, this.handler.onConnect((D) => {
        if (this.aborted = !0, this.abort) this.abort(D);
        else this.reason = D
      })
    }
    onRequestSent() {
      if (this.handler.onRequestSent) this.handler.onRequestSent()
    }
    onUpgrade(A, Q, B) {
      if (this.handler.onUpgrade) this.handler.onUpgrade(A, Q, B)
    }
    onConnect(A) {
      if (this.aborted) A(this.reason);
      else this.abort = A
    }
    onBodySent(A) {
      if (this.handler.onBodySent) return this.handler.onBodySent(A)
    }
    static[T0B](A, {
      state: Q,
      opts: B
    }, G) {
      let {
        statusCode: Z,
        code: I,
        headers: Y
      } = A, {
        method: J,
        retryOptions: W
      } = B, {
        maxRetries: X,
        minTimeout: V,
        maxTimeout: F,
        timeoutFactor: K,
        statusCodes: D,
        errorCodes: H,
        methods: C
      } = W, {
        counter: E
      } = Q;
      if (I && I !== "UND_ERR_REQ_RETRY" && !H.includes(I)) {
        G(A);
        return
      }
      if (Array.isArray(C) && !C.includes(J)) {
        G(A);
        return
      }
      if (Z != null && Array.isArray(D) && !D.includes(Z)) {
        G(A);
        return
      }
      if (E > X) {
        G(A);
        return
      }
      let U = Y?.["retry-after"];
      if (U) U = Number(U), U = Number.isNaN(U) ? mc8(U) : U * 1000;
      let q = U > 0 ? Math.min(U, F) : Math.min(V * K ** (E - 1), F);
      setTimeout(() => G(null), q)
    }
    onHeaders(A, Q, B, G) {
      let Z = gc8(Q);
      if (this.retryCount += 1, A >= 300)
        if (this.retryOpts.statusCodes.includes(A) === !1) return this.handler.onHeaders(A, Q, B, G);
        else return this.abort(new eEA("Request failed", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
      if (this.resume != null) {
        if (this.resume = null, A !== 206 && (this.start > 0 || A !== 200)) return this.abort(new eEA("server does not support the range header and the payload was partially consumed", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
        let Y = j0B(Z["content-range"]);
        if (!Y) return this.abort(new eEA("Content-Range mismatch", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
        if (this.etag != null && this.etag !== Z.etag) return this.abort(new eEA("ETag mismatch", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
        let {
          start: J,
          size: W,
          end: X = W - 1
        } = Y;
        return K3A(this.start === J, "content-range mismatch"), K3A(this.end == null || this.end === X, "content-range mismatch"), this.resume = B, !0
      }
      if (this.end == null) {
        if (A === 206) {
          let Y = j0B(Z["content-range"]);
          if (Y == null) return this.handler.onHeaders(A, Q, B, G);
          let {
            start: J,
            size: W,
            end: X = W - 1
          } = Y;
          K3A(J != null && Number.isFinite(J), "content-range mismatch"), K3A(X != null && Number.isFinite(X), "invalid content-length"), this.start = J, this.end = X
        }
        if (this.end == null) {
          let Y = Z["content-length"];
          this.end = Y != null ? Number(Y) - 1 : null
        }
        if (K3A(Number.isFinite(this.start)), K3A(this.end == null || Number.isFinite(this.end), "invalid content-length"), this.resume = B, this.etag = Z.etag != null ? Z.etag : null, this.etag != null && this.etag.startsWith("W/")) this.etag = null;
        return this.handler.onHeaders(A, Q, B, G)
      }
      let I = new eEA("Request failed", A, {
        headers: Z,
        data: {
          count: this.retryCount
        }
      });
      return this.abort(I), !1
    }
    onData(A) {
      return this.start += A.length, this.handler.onData(A)
    }
    onComplete(A) {
      return this.retryCount = 0, this.handler.onComplete(A)
    }
    onError(A) {
      if (this.aborted || P0B(this.opts.body)) return this.handler.onError(A);
      if (this.retryCount - this.retryCountCheckpoint > 0) this.retryCount = this.retryCountCheckpoint + (this.retryCount - this.retryCountCheckpoint);
      else this.retryCount += 1;
      this.retryOpts.retry(A, {
        state: {
          counter: this.retryCount
        },
        opts: {
          retryOptions: this.retryOpts,
          ...this.opts
        }
      }, Q.bind(this));

      function Q(B) {
        if (B != null || this.aborted || P0B(this.opts.body)) return this.handler.onError(B);
        if (this.start !== 0) {
          let G = {
            range: `bytes=${this.start}-${this.end??""}`
          };
          if (this.etag != null) G["if-match"] = this.etag;
          this.opts = {
            ...this.opts,
            headers: {
              ...this.opts.headers,
              ...G
            }
          }
        }
        try {
          this.retryCountCheckpoint = this.retryCount, this.dispatch(this.opts, this)
        } catch (G) {
          this.handler.onError(G)
        }
      }
    }
  }
  S0B.exports = Mx1
})
// @from(Start 4894373, End 4894920)
y0B = z((SS7, k0B) => {
  var dc8 = OEA(),
    cc8 = PlA();
  class _0B extends dc8 {
    #A = null;
    #Q = null;
    constructor(A, Q = {}) {
      super(Q);
      this.#A = A, this.#Q = Q
    }
    dispatch(A, Q) {
      let B = new cc8({
        ...A,
        retryOptions: this.#Q
      }, {
        dispatch: this.#A.dispatch.bind(this.#A),
        handler: Q
      });
      return this.#A.dispatch(A, B)
    }
    close() {
      return this.#A.close()
    }
    destroy() {
      return this.#A.destroy()
    }
  }
  k0B.exports = _0B
})
// @from(Start 4894926, End 4900762)
jx1 = z((_S7, c0B) => {
  var h0B = UA("node:assert"),
    {
      Readable: pc8
    } = UA("node:stream"),
    {
      RequestAbortedError: g0B,
      NotSupportedError: lc8,
      InvalidArgumentError: ic8,
      AbortError: Ox1
    } = R7(),
    u0B = S6(),
    {
      ReadableStreamFrom: nc8
    } = S6(),
    vw = Symbol("kConsume"),
    AzA = Symbol("kReading"),
    Nc = Symbol("kBody"),
    x0B = Symbol("kAbort"),
    m0B = Symbol("kContentType"),
    v0B = Symbol("kContentLength"),
    ac8 = () => {};
  class d0B extends pc8 {
    constructor({
      resume: A,
      abort: Q,
      contentType: B = "",
      contentLength: G,
      highWaterMark: Z = 65536
    }) {
      super({
        autoDestroy: !0,
        read: A,
        highWaterMark: Z
      });
      this._readableState.dataEmitted = !1, this[x0B] = Q, this[vw] = null, this[Nc] = null, this[m0B] = B, this[v0B] = G, this[AzA] = !1
    }
    destroy(A) {
      if (!A && !this._readableState.endEmitted) A = new g0B;
      if (A) this[x0B]();
      return super.destroy(A)
    }
    _destroy(A, Q) {
      if (!this[AzA]) setImmediate(() => {
        Q(A)
      });
      else Q(A)
    }
    on(A, ...Q) {
      if (A === "data" || A === "readable") this[AzA] = !0;
      return super.on(A, ...Q)
    }
    addListener(A, ...Q) {
      return this.on(A, ...Q)
    }
    off(A, ...Q) {
      let B = super.off(A, ...Q);
      if (A === "data" || A === "readable") this[AzA] = this.listenerCount("data") > 0 || this.listenerCount("readable") > 0;
      return B
    }
    removeListener(A, ...Q) {
      return this.off(A, ...Q)
    }
    push(A) {
      if (this[vw] && A !== null) return Tx1(this[vw], A), this[AzA] ? super.push(A) : !0;
      return super.push(A)
    }
    async text() {
      return QzA(this, "text")
    }
    async json() {
      return QzA(this, "json")
    }
    async blob() {
      return QzA(this, "blob")
    }
    async bytes() {
      return QzA(this, "bytes")
    }
    async arrayBuffer() {
      return QzA(this, "arrayBuffer")
    }
    async formData() {
      throw new lc8
    }
    get bodyUsed() {
      return u0B.isDisturbed(this)
    }
    get body() {
      if (!this[Nc]) {
        if (this[Nc] = nc8(this), this[vw]) this[Nc].getReader(), h0B(this[Nc].locked)
      }
      return this[Nc]
    }
    async dump(A) {
      let Q = Number.isFinite(A?.limit) ? A.limit : 131072,
        B = A?.signal;
      if (B != null && (typeof B !== "object" || !("aborted" in B))) throw new ic8("signal must be an AbortSignal");
      if (B?.throwIfAborted(), this._readableState.closeEmitted) return null;
      return await new Promise((G, Z) => {
        if (this[v0B] > Q) this.destroy(new Ox1);
        let I = () => {
          this.destroy(B.reason ?? new Ox1)
        };
        B?.addEventListener("abort", I), this.on("close", function() {
          if (B?.removeEventListener("abort", I), B?.aborted) Z(B.reason ?? new Ox1);
          else G(null)
        }).on("error", ac8).on("data", function(Y) {
          if (Q -= Y.length, Q <= 0) this.destroy()
        }).resume()
      })
    }
  }

  function sc8(A) {
    return A[Nc] && A[Nc].locked === !0 || A[vw]
  }

  function rc8(A) {
    return u0B.isDisturbed(A) || sc8(A)
  }
  async function QzA(A, Q) {
    return h0B(!A[vw]), new Promise((B, G) => {
      if (rc8(A)) {
        let Z = A._readableState;
        if (Z.destroyed && Z.closeEmitted === !1) A.on("error", (I) => {
          G(I)
        }).on("close", () => {
          G(TypeError("unusable"))
        });
        else G(Z.errored ?? TypeError("unusable"))
      } else queueMicrotask(() => {
        A[vw] = {
          type: Q,
          stream: A,
          resolve: B,
          reject: G,
          length: 0,
          body: []
        }, A.on("error", function(Z) {
          Px1(this[vw], Z)
        }).on("close", function() {
          if (this[vw].body !== null) Px1(this[vw], new g0B)
        }), oc8(A[vw])
      })
    })
  }

  function oc8(A) {
    if (A.body === null) return;
    let {
      _readableState: Q
    } = A.stream;
    if (Q.bufferIndex) {
      let B = Q.bufferIndex,
        G = Q.buffer.length;
      for (let Z = B; Z < G; Z++) Tx1(A, Q.buffer[Z])
    } else
      for (let B of Q.buffer) Tx1(A, B);
    if (Q.endEmitted) f0B(this[vw]);
    else A.stream.on("end", function() {
      f0B(this[vw])
    });
    A.stream.resume();
    while (A.stream.read() != null);
  }

  function Rx1(A, Q) {
    if (A.length === 0 || Q === 0) return "";
    let B = A.length === 1 ? A[0] : Buffer.concat(A, Q),
      G = B.length,
      Z = G > 2 && B[0] === 239 && B[1] === 187 && B[2] === 191 ? 3 : 0;
    return B.utf8Slice(Z, G)
  }

  function b0B(A, Q) {
    if (A.length === 0 || Q === 0) return new Uint8Array(0);
    if (A.length === 1) return new Uint8Array(A[0]);
    let B = new Uint8Array(Buffer.allocUnsafeSlow(Q).buffer),
      G = 0;
    for (let Z = 0; Z < A.length; ++Z) {
      let I = A[Z];
      B.set(I, G), G += I.length
    }
    return B
  }

  function f0B(A) {
    let {
      type: Q,
      body: B,
      resolve: G,
      stream: Z,
      length: I
    } = A;
    try {
      if (Q === "text") G(Rx1(B, I));
      else if (Q === "json") G(JSON.parse(Rx1(B, I)));
      else if (Q === "arrayBuffer") G(b0B(B, I).buffer);
      else if (Q === "blob") G(new Blob(B, {
        type: Z[m0B]
      }));
      else if (Q === "bytes") G(b0B(B, I));
      Px1(A)
    } catch (Y) {
      Z.destroy(Y)
    }
  }

  function Tx1(A, Q) {
    A.length += Q.length, A.body.push(Q)
  }

  function Px1(A, Q) {
    if (A.body === null) return;
    if (Q) A.reject(Q);
    else A.resolve();
    A.type = null, A.stream = null, A.resolve = null, A.reject = null, A.length = 0, A.body = null
  }
  c0B.exports = {
    Readable: d0B,
    chunksDecode: Rx1
  }
})
// @from(Start 4900768, End 4902288)
Sx1 = z((kS7, a0B) => {
  var tc8 = UA("node:assert"),
    {
      ResponseStatusCodeError: p0B
    } = R7(),
    {
      chunksDecode: l0B
    } = jx1();
  async function ec8({
    callback: A,
    body: Q,
    contentType: B,
    statusCode: G,
    statusMessage: Z,
    headers: I
  }) {
    tc8(Q);
    let Y = [],
      J = 0;
    try {
      for await (let F of Q) if (Y.push(F), J += F.length, J > 131072) {
        Y = [], J = 0;
        break
      }
    } catch {
      Y = [], J = 0
    }
    let W = `Response status code ${G}${Z?`: ${Z}`:""}`;
    if (G === 204 || !B || !J) {
      queueMicrotask(() => A(new p0B(W, G, I)));
      return
    }
    let X = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    let V;
    try {
      if (i0B(B)) V = JSON.parse(l0B(Y, J));
      else if (n0B(B)) V = l0B(Y, J)
    } catch {} finally {
      Error.stackTraceLimit = X
    }
    queueMicrotask(() => A(new p0B(W, G, I, V)))
  }
  var i0B = (A) => {
      return A.length > 15 && A[11] === "/" && A[0] === "a" && A[1] === "p" && A[2] === "p" && A[3] === "l" && A[4] === "i" && A[5] === "c" && A[6] === "a" && A[7] === "t" && A[8] === "i" && A[9] === "o" && A[10] === "n" && A[12] === "j" && A[13] === "s" && A[14] === "o" && A[15] === "n"
    },
    n0B = (A) => {
      return A.length > 4 && A[4] === "/" && A[0] === "t" && A[1] === "e" && A[2] === "x" && A[3] === "t"
    };
  a0B.exports = {
    getResolveErrorBodyCallback: ec8,
    isContentTypeApplicationJson: i0B,
    isContentTypeText: n0B
  }
})
// @from(Start 4902294, End 4907038)
o0B = z((yS7, kx1) => {
  var Ap8 = UA("node:assert"),
    {
      Readable: Qp8
    } = jx1(),
    {
      InvalidArgumentError: D3A,
      RequestAbortedError: s0B
    } = R7(),
    bw = S6(),
    {
      getResolveErrorBodyCallback: Bp8
    } = Sx1(),
    {
      AsyncResource: Gp8
    } = UA("node:async_hooks");
  class _x1 extends Gp8 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new D3A("invalid opts");
      let {
        signal: B,
        method: G,
        opaque: Z,
        body: I,
        onInfo: Y,
        responseHeaders: J,
        throwOnError: W,
        highWaterMark: X
      } = A;
      try {
        if (typeof Q !== "function") throw new D3A("invalid callback");
        if (X && (typeof X !== "number" || X < 0)) throw new D3A("invalid highWaterMark");
        if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new D3A("signal must be an EventEmitter or EventTarget");
        if (G === "CONNECT") throw new D3A("invalid method");
        if (Y && typeof Y !== "function") throw new D3A("invalid onInfo callback");
        super("UNDICI_REQUEST")
      } catch (V) {
        if (bw.isStream(I)) bw.destroy(I.on("error", bw.nop), V);
        throw V
      }
      if (this.method = G, this.responseHeaders = J || null, this.opaque = Z || null, this.callback = Q, this.res = null, this.abort = null, this.body = I, this.trailers = {}, this.context = null, this.onInfo = Y || null, this.throwOnError = W, this.highWaterMark = X, this.signal = B, this.reason = null, this.removeAbortListener = null, bw.isStream(I)) I.on("error", (V) => {
        this.onError(V)
      });
      if (this.signal)
        if (this.signal.aborted) this.reason = this.signal.reason ?? new s0B;
        else this.removeAbortListener = bw.addAbortListener(this.signal, () => {
          if (this.reason = this.signal.reason ?? new s0B, this.res) bw.destroy(this.res.on("error", bw.nop), this.reason);
          else if (this.abort) this.abort(this.reason);
          if (this.removeAbortListener) this.res?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
        })
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      Ap8(this.callback), this.abort = A, this.context = Q
    }
    onHeaders(A, Q, B, G) {
      let {
        callback: Z,
        opaque: I,
        abort: Y,
        context: J,
        responseHeaders: W,
        highWaterMark: X
      } = this, V = W === "raw" ? bw.parseRawHeaders(Q) : bw.parseHeaders(Q);
      if (A < 200) {
        if (this.onInfo) this.onInfo({
          statusCode: A,
          headers: V
        });
        return
      }
      let F = W === "raw" ? bw.parseHeaders(Q) : V,
        K = F["content-type"],
        D = F["content-length"],
        H = new Qp8({
          resume: B,
          abort: Y,
          contentType: K,
          contentLength: this.method !== "HEAD" && D ? Number(D) : null,
          highWaterMark: X
        });
      if (this.removeAbortListener) H.on("close", this.removeAbortListener);
      if (this.callback = null, this.res = H, Z !== null)
        if (this.throwOnError && A >= 400) this.runInAsyncScope(Bp8, null, {
          callback: Z,
          body: H,
          contentType: K,
          statusCode: A,
          statusMessage: G,
          headers: V
        });
        else this.runInAsyncScope(Z, null, null, {
          statusCode: A,
          headers: V,
          trailers: this.trailers,
          opaque: I,
          body: H,
          context: J
        })
    }
    onData(A) {
      return this.res.push(A)
    }
    onComplete(A) {
      bw.parseHeaders(A, this.trailers), this.res.push(null)
    }
    onError(A) {
      let {
        res: Q,
        callback: B,
        body: G,
        opaque: Z
      } = this;
      if (B) this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(B, null, A, {
          opaque: Z
        })
      });
      if (Q) this.res = null, queueMicrotask(() => {
        bw.destroy(Q, A)
      });
      if (G) this.body = null, bw.destroy(G, A);
      if (this.removeAbortListener) Q?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
    }
  }

  function r0B(A, Q) {
    if (Q === void 0) return new Promise((B, G) => {
      r0B.call(this, A, (Z, I) => {
        return Z ? G(Z) : B(I)
      })
    });
    try {
      this.dispatch(A, new _x1(A, Q))
    } catch (B) {
      if (typeof Q !== "function") throw B;
      let G = A?.opaque;
      queueMicrotask(() => Q(B, {
        opaque: G
      }))
    }
  }
  kx1.exports = r0B;
  kx1.exports.RequestHandler = _x1
})
// @from(Start 4907044, End 4907829)
BzA = z((xS7, AQB) => {
  var {
    addAbortListener: Zp8
  } = S6(), {
    RequestAbortedError: Ip8
  } = R7(), H3A = Symbol("kListener"), E_ = Symbol("kSignal");

  function t0B(A) {
    if (A.abort) A.abort(A[E_]?.reason);
    else A.reason = A[E_]?.reason ?? new Ip8;
    e0B(A)
  }

  function Yp8(A, Q) {
    if (A.reason = null, A[E_] = null, A[H3A] = null, !Q) return;
    if (Q.aborted) {
      t0B(A);
      return
    }
    A[E_] = Q, A[H3A] = () => {
      t0B(A)
    }, Zp8(A[E_], A[H3A])
  }

  function e0B(A) {
    if (!A[E_]) return;
    if ("removeEventListener" in A[E_]) A[E_].removeEventListener("abort", A[H3A]);
    else A[E_].removeListener("abort", A[H3A]);
    A[E_] = null, A[H3A] = null
  }
  AQB.exports = {
    addSignal: Yp8,
    removeSignal: e0B
  }
})
// @from(Start 4907835, End 4912393)
IQB = z((vS7, ZQB) => {
  var Jp8 = UA("node:assert"),
    {
      finished: Wp8,
      PassThrough: Xp8
    } = UA("node:stream"),
    {
      InvalidArgumentError: C3A,
      InvalidReturnValueError: Vp8
    } = R7(),
    JT = S6(),
    {
      getResolveErrorBodyCallback: Fp8
    } = Sx1(),
    {
      AsyncResource: Kp8
    } = UA("node:async_hooks"),
    {
      addSignal: Dp8,
      removeSignal: QQB
    } = BzA();
  class BQB extends Kp8 {
    constructor(A, Q, B) {
      if (!A || typeof A !== "object") throw new C3A("invalid opts");
      let {
        signal: G,
        method: Z,
        opaque: I,
        body: Y,
        onInfo: J,
        responseHeaders: W,
        throwOnError: X
      } = A;
      try {
        if (typeof B !== "function") throw new C3A("invalid callback");
        if (typeof Q !== "function") throw new C3A("invalid factory");
        if (G && typeof G.on !== "function" && typeof G.addEventListener !== "function") throw new C3A("signal must be an EventEmitter or EventTarget");
        if (Z === "CONNECT") throw new C3A("invalid method");
        if (J && typeof J !== "function") throw new C3A("invalid onInfo callback");
        super("UNDICI_STREAM")
      } catch (V) {
        if (JT.isStream(Y)) JT.destroy(Y.on("error", JT.nop), V);
        throw V
      }
      if (this.responseHeaders = W || null, this.opaque = I || null, this.factory = Q, this.callback = B, this.res = null, this.abort = null, this.context = null, this.trailers = null, this.body = Y, this.onInfo = J || null, this.throwOnError = X || !1, JT.isStream(Y)) Y.on("error", (V) => {
        this.onError(V)
      });
      Dp8(this, G)
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      Jp8(this.callback), this.abort = A, this.context = Q
    }
    onHeaders(A, Q, B, G) {
      let {
        factory: Z,
        opaque: I,
        context: Y,
        callback: J,
        responseHeaders: W
      } = this, X = W === "raw" ? JT.parseRawHeaders(Q) : JT.parseHeaders(Q);
      if (A < 200) {
        if (this.onInfo) this.onInfo({
          statusCode: A,
          headers: X
        });
        return
      }
      this.factory = null;
      let V;
      if (this.throwOnError && A >= 400) {
        let D = (W === "raw" ? JT.parseHeaders(Q) : X)["content-type"];
        V = new Xp8, this.callback = null, this.runInAsyncScope(Fp8, null, {
          callback: J,
          body: V,
          contentType: D,
          statusCode: A,
          statusMessage: G,
          headers: X
        })
      } else {
        if (Z === null) return;
        if (V = this.runInAsyncScope(Z, null, {
            statusCode: A,
            headers: X,
            opaque: I,
            context: Y
          }), !V || typeof V.write !== "function" || typeof V.end !== "function" || typeof V.on !== "function") throw new Vp8("expected Writable");
        Wp8(V, {
          readable: !1
        }, (K) => {
          let {
            callback: D,
            res: H,
            opaque: C,
            trailers: E,
            abort: U
          } = this;
          if (this.res = null, K || !H.readable) JT.destroy(H, K);
          if (this.callback = null, this.runInAsyncScope(D, null, K || null, {
              opaque: C,
              trailers: E
            }), K) U()
        })
      }
      return V.on("drain", B), this.res = V, (V.writableNeedDrain !== void 0 ? V.writableNeedDrain : V._writableState?.needDrain) !== !0
    }
    onData(A) {
      let {
        res: Q
      } = this;
      return Q ? Q.write(A) : !0
    }
    onComplete(A) {
      let {
        res: Q
      } = this;
      if (QQB(this), !Q) return;
      this.trailers = JT.parseHeaders(A), Q.end()
    }
    onError(A) {
      let {
        res: Q,
        callback: B,
        opaque: G,
        body: Z
      } = this;
      if (QQB(this), this.factory = null, Q) this.res = null, JT.destroy(Q, A);
      else if (B) this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(B, null, A, {
          opaque: G
        })
      });
      if (Z) this.body = null, JT.destroy(Z, A)
    }
  }

  function GQB(A, Q, B) {
    if (B === void 0) return new Promise((G, Z) => {
      GQB.call(this, A, Q, (I, Y) => {
        return I ? Z(I) : G(Y)
      })
    });
    try {
      this.dispatch(A, new BQB(A, Q, B))
    } catch (G) {
      if (typeof B !== "function") throw G;
      let Z = A?.opaque;
      queueMicrotask(() => B(G, {
        opaque: Z
      }))
    }
  }
  ZQB.exports = GQB
})
// @from(Start 4912399, End 4917220)
KQB = z((bS7, FQB) => {
  var {
    Readable: JQB,
    Duplex: Hp8,
    PassThrough: Cp8
  } = UA("node:stream"), {
    InvalidArgumentError: GzA,
    InvalidReturnValueError: Ep8,
    RequestAbortedError: yx1
  } = R7(), eL = S6(), {
    AsyncResource: zp8
  } = UA("node:async_hooks"), {
    addSignal: Up8,
    removeSignal: $p8
  } = BzA(), YQB = UA("node:assert"), E3A = Symbol("resume");
  class WQB extends JQB {
    constructor() {
      super({
        autoDestroy: !0
      });
      this[E3A] = null
    }
    _read() {
      let {
        [E3A]: A
      } = this;
      if (A) this[E3A] = null, A()
    }
    _destroy(A, Q) {
      this._read(), Q(A)
    }
  }
  class XQB extends JQB {
    constructor(A) {
      super({
        autoDestroy: !0
      });
      this[E3A] = A
    }
    _read() {
      this[E3A]()
    }
    _destroy(A, Q) {
      if (!A && !this._readableState.endEmitted) A = new yx1;
      Q(A)
    }
  }
  class VQB extends zp8 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new GzA("invalid opts");
      if (typeof Q !== "function") throw new GzA("invalid handler");
      let {
        signal: B,
        method: G,
        opaque: Z,
        onInfo: I,
        responseHeaders: Y
      } = A;
      if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new GzA("signal must be an EventEmitter or EventTarget");
      if (G === "CONNECT") throw new GzA("invalid method");
      if (I && typeof I !== "function") throw new GzA("invalid onInfo callback");
      super("UNDICI_PIPELINE");
      this.opaque = Z || null, this.responseHeaders = Y || null, this.handler = Q, this.abort = null, this.context = null, this.onInfo = I || null, this.req = new WQB().on("error", eL.nop), this.ret = new Hp8({
        readableObjectMode: A.objectMode,
        autoDestroy: !0,
        read: () => {
          let {
            body: J
          } = this;
          if (J?.resume) J.resume()
        },
        write: (J, W, X) => {
          let {
            req: V
          } = this;
          if (V.push(J, W) || V._readableState.destroyed) X();
          else V[E3A] = X
        },
        destroy: (J, W) => {
          let {
            body: X,
            req: V,
            res: F,
            ret: K,
            abort: D
          } = this;
          if (!J && !K._readableState.endEmitted) J = new yx1;
          if (D && J) D();
          eL.destroy(X, J), eL.destroy(V, J), eL.destroy(F, J), $p8(this), W(J)
        }
      }).on("prefinish", () => {
        let {
          req: J
        } = this;
        J.push(null)
      }), this.res = null, Up8(this, B)
    }
    onConnect(A, Q) {
      let {
        ret: B,
        res: G
      } = this;
      if (this.reason) {
        A(this.reason);
        return
      }
      YQB(!G, "pipeline cannot be retried"), YQB(!B.destroyed), this.abort = A, this.context = Q
    }
    onHeaders(A, Q, B) {
      let {
        opaque: G,
        handler: Z,
        context: I
      } = this;
      if (A < 200) {
        if (this.onInfo) {
          let J = this.responseHeaders === "raw" ? eL.parseRawHeaders(Q) : eL.parseHeaders(Q);
          this.onInfo({
            statusCode: A,
            headers: J
          })
        }
        return
      }
      this.res = new XQB(B);
      let Y;
      try {
        this.handler = null;
        let J = this.responseHeaders === "raw" ? eL.parseRawHeaders(Q) : eL.parseHeaders(Q);
        Y = this.runInAsyncScope(Z, null, {
          statusCode: A,
          headers: J,
          opaque: G,
          body: this.res,
          context: I
        })
      } catch (J) {
        throw this.res.on("error", eL.nop), J
      }
      if (!Y || typeof Y.on !== "function") throw new Ep8("expected Readable");
      Y.on("data", (J) => {
        let {
          ret: W,
          body: X
        } = this;
        if (!W.push(J) && X.pause) X.pause()
      }).on("error", (J) => {
        let {
          ret: W
        } = this;
        eL.destroy(W, J)
      }).on("end", () => {
        let {
          ret: J
        } = this;
        J.push(null)
      }).on("close", () => {
        let {
          ret: J
        } = this;
        if (!J._readableState.ended) eL.destroy(J, new yx1)
      }), this.body = Y
    }
    onData(A) {
      let {
        res: Q
      } = this;
      return Q.push(A)
    }
    onComplete(A) {
      let {
        res: Q
      } = this;
      Q.push(null)
    }
    onError(A) {
      let {
        ret: Q
      } = this;
      this.handler = null, eL.destroy(Q, A)
    }
  }

  function wp8(A, Q) {
    try {
      let B = new VQB(A, Q);
      return this.dispatch({
        ...A,
        body: B.req
      }, B), B.ret
    } catch (B) {
      return new Cp8().destroy(B)
    }
  }
  FQB.exports = wp8
})
// @from(Start 4917226, End 4919458)
$QB = z((fS7, UQB) => {
  var {
    InvalidArgumentError: xx1,
    SocketError: qp8
  } = R7(), {
    AsyncResource: Np8
  } = UA("node:async_hooks"), DQB = S6(), {
    addSignal: Lp8,
    removeSignal: HQB
  } = BzA(), CQB = UA("node:assert");
  class EQB extends Np8 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new xx1("invalid opts");
      if (typeof Q !== "function") throw new xx1("invalid callback");
      let {
        signal: B,
        opaque: G,
        responseHeaders: Z
      } = A;
      if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new xx1("signal must be an EventEmitter or EventTarget");
      super("UNDICI_UPGRADE");
      this.responseHeaders = Z || null, this.opaque = G || null, this.callback = Q, this.abort = null, this.context = null, Lp8(this, B)
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      CQB(this.callback), this.abort = A, this.context = null
    }
    onHeaders() {
      throw new qp8("bad upgrade", null)
    }
    onUpgrade(A, Q, B) {
      CQB(A === 101);
      let {
        callback: G,
        opaque: Z,
        context: I
      } = this;
      HQB(this), this.callback = null;
      let Y = this.responseHeaders === "raw" ? DQB.parseRawHeaders(Q) : DQB.parseHeaders(Q);
      this.runInAsyncScope(G, null, null, {
        headers: Y,
        socket: B,
        opaque: Z,
        context: I
      })
    }
    onError(A) {
      let {
        callback: Q,
        opaque: B
      } = this;
      if (HQB(this), Q) this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(Q, null, A, {
          opaque: B
        })
      })
    }
  }

  function zQB(A, Q) {
    if (Q === void 0) return new Promise((B, G) => {
      zQB.call(this, A, (Z, I) => {
        return Z ? G(Z) : B(I)
      })
    });
    try {
      let B = new EQB(A, Q);
      this.dispatch({
        ...A,
        method: A.method || "GET",
        upgrade: A.protocol || "Websocket"
      }, B)
    } catch (B) {
      if (typeof Q !== "function") throw B;
      let G = A?.opaque;
      queueMicrotask(() => Q(B, {
        opaque: G
      }))
    }
  }
  UQB.exports = zQB
})
// @from(Start 4919464, End 4921681)
OQB = z((hS7, MQB) => {
  var Mp8 = UA("node:assert"),
    {
      AsyncResource: Op8
    } = UA("node:async_hooks"),
    {
      InvalidArgumentError: vx1,
      SocketError: Rp8
    } = R7(),
    wQB = S6(),
    {
      addSignal: Tp8,
      removeSignal: qQB
    } = BzA();
  class NQB extends Op8 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new vx1("invalid opts");
      if (typeof Q !== "function") throw new vx1("invalid callback");
      let {
        signal: B,
        opaque: G,
        responseHeaders: Z
      } = A;
      if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new vx1("signal must be an EventEmitter or EventTarget");
      super("UNDICI_CONNECT");
      this.opaque = G || null, this.responseHeaders = Z || null, this.callback = Q, this.abort = null, Tp8(this, B)
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      Mp8(this.callback), this.abort = A, this.context = Q
    }
    onHeaders() {
      throw new Rp8("bad connect", null)
    }
    onUpgrade(A, Q, B) {
      let {
        callback: G,
        opaque: Z,
        context: I
      } = this;
      qQB(this), this.callback = null;
      let Y = Q;
      if (Y != null) Y = this.responseHeaders === "raw" ? wQB.parseRawHeaders(Q) : wQB.parseHeaders(Q);
      this.runInAsyncScope(G, null, null, {
        statusCode: A,
        headers: Y,
        socket: B,
        opaque: Z,
        context: I
      })
    }
    onError(A) {
      let {
        callback: Q,
        opaque: B
      } = this;
      if (qQB(this), Q) this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(Q, null, A, {
          opaque: B
        })
      })
    }
  }

  function LQB(A, Q) {
    if (Q === void 0) return new Promise((B, G) => {
      LQB.call(this, A, (Z, I) => {
        return Z ? G(Z) : B(I)
      })
    });
    try {
      let B = new NQB(A, Q);
      this.dispatch({
        ...A,
        method: "CONNECT"
      }, B)
    } catch (B) {
      if (typeof Q !== "function") throw B;
      let G = A?.opaque;
      queueMicrotask(() => Q(B, {
        opaque: G
      }))
    }
  }
  MQB.exports = LQB
})
// @from(Start 4921687, End 4921827)
RQB = z((Pp8, z3A) => {
  Pp8.request = o0B();
  Pp8.stream = IQB();
  Pp8.pipeline = KQB();
  Pp8.upgrade = $QB();
  Pp8.connect = OQB()
})
// @from(Start 4921833, End 4922226)
fx1 = z((gS7, TQB) => {
  var {
    UndiciError: xp8
  } = R7();
  class bx1 extends xp8 {
    constructor(A) {
      super(A);
      Error.captureStackTrace(this, bx1), this.name = "MockNotMatchedError", this.message = A || "The request does not match any registered mock dispatches", this.code = "UND_MOCK_ERR_MOCK_NOT_MATCHED"
    }
  }
  TQB.exports = {
    MockNotMatchedError: bx1
  }
})
// @from(Start 4922232, End 4923052)
U3A = z((uS7, PQB) => {
  PQB.exports = {
    kAgent: Symbol("agent"),
    kOptions: Symbol("options"),
    kFactory: Symbol("factory"),
    kDispatches: Symbol("dispatches"),
    kDispatchKey: Symbol("dispatch key"),
    kDefaultHeaders: Symbol("default headers"),
    kDefaultTrailers: Symbol("default trailers"),
    kContentLength: Symbol("content length"),
    kMockAgent: Symbol("mock agent"),
    kMockAgentSet: Symbol("mock agent set"),
    kMockAgentGet: Symbol("mock agent get"),
    kMockDispatch: Symbol("mock dispatch"),
    kClose: Symbol("close"),
    kOriginalClose: Symbol("original agent close"),
    kOrigin: Symbol("origin"),
    kIsMockActive: Symbol("is mock active"),
    kNetConnect: Symbol("net connect"),
    kGetNetConnect: Symbol("get net connect"),
    kConnected: Symbol("connected")
  }
})
// @from(Start 4923058, End 4930006)
ZzA = z((mS7, gQB) => {
  var {
    MockNotMatchedError: po
  } = fx1(), {
    kDispatches: jlA,
    kMockAgent: vp8,
    kOriginalDispatch: bp8,
    kOrigin: fp8,
    kGetNetConnect: hp8
  } = U3A(), {
    buildURL: gp8
  } = S6(), {
    STATUS_CODES: up8
  } = UA("node:http"), {
    types: {
      isPromise: mp8
    }
  } = UA("node:util");

  function _b(A, Q) {
    if (typeof A === "string") return A === Q;
    if (A instanceof RegExp) return A.test(Q);
    if (typeof A === "function") return A(Q) === !0;
    return !1
  }

  function SQB(A) {
    return Object.fromEntries(Object.entries(A).map(([Q, B]) => {
      return [Q.toLocaleLowerCase(), B]
    }))
  }

  function _QB(A, Q) {
    if (Array.isArray(A)) {
      for (let B = 0; B < A.length; B += 2)
        if (A[B].toLocaleLowerCase() === Q.toLocaleLowerCase()) return A[B + 1];
      return
    } else if (typeof A.get === "function") return A.get(Q);
    else return SQB(A)[Q.toLocaleLowerCase()]
  }

  function ux1(A) {
    let Q = A.slice(),
      B = [];
    for (let G = 0; G < Q.length; G += 2) B.push([Q[G], Q[G + 1]]);
    return Object.fromEntries(B)
  }

  function kQB(A, Q) {
    if (typeof A.headers === "function") {
      if (Array.isArray(Q)) Q = ux1(Q);
      return A.headers(Q ? SQB(Q) : {})
    }
    if (typeof A.headers > "u") return !0;
    if (typeof Q !== "object" || typeof A.headers !== "object") return !1;
    for (let [B, G] of Object.entries(A.headers)) {
      let Z = _QB(Q, B);
      if (!_b(G, Z)) return !1
    }
    return !0
  }

  function jQB(A) {
    if (typeof A !== "string") return A;
    let Q = A.split("?");
    if (Q.length !== 2) return A;
    let B = new URLSearchParams(Q.pop());
    return B.sort(), [...Q, B.toString()].join("?")
  }

  function dp8(A, {
    path: Q,
    method: B,
    body: G,
    headers: Z
  }) {
    let I = _b(A.path, Q),
      Y = _b(A.method, B),
      J = typeof A.body < "u" ? _b(A.body, G) : !0,
      W = kQB(A, Z);
    return I && Y && J && W
  }

  function yQB(A) {
    if (Buffer.isBuffer(A)) return A;
    else if (A instanceof Uint8Array) return A;
    else if (A instanceof ArrayBuffer) return A;
    else if (typeof A === "object") return JSON.stringify(A);
    else return A.toString()
  }

  function xQB(A, Q) {
    let B = Q.query ? gp8(Q.path, Q.query) : Q.path,
      G = typeof B === "string" ? jQB(B) : B,
      Z = A.filter(({
        consumed: I
      }) => !I).filter(({
        path: I
      }) => _b(jQB(I), G));
    if (Z.length === 0) throw new po(`Mock dispatch not matched for path '${G}'`);
    if (Z = Z.filter(({
        method: I
      }) => _b(I, Q.method)), Z.length === 0) throw new po(`Mock dispatch not matched for method '${Q.method}' on path '${G}'`);
    if (Z = Z.filter(({
        body: I
      }) => typeof I < "u" ? _b(I, Q.body) : !0), Z.length === 0) throw new po(`Mock dispatch not matched for body '${Q.body}' on path '${G}'`);
    if (Z = Z.filter((I) => kQB(I, Q.headers)), Z.length === 0) {
      let I = typeof Q.headers === "object" ? JSON.stringify(Q.headers) : Q.headers;
      throw new po(`Mock dispatch not matched for headers '${I}' on path '${G}'`)
    }
    return Z[0]
  }

  function cp8(A, Q, B) {
    let G = {
        timesInvoked: 0,
        times: 1,
        persist: !1,
        consumed: !1
      },
      Z = typeof B === "function" ? {
        callback: B
      } : {
        ...B
      },
      I = {
        ...G,
        ...Q,
        pending: !0,
        data: {
          error: null,
          ...Z
        }
      };
    return A.push(I), I
  }

  function hx1(A, Q) {
    let B = A.findIndex((G) => {
      if (!G.consumed) return !1;
      return dp8(G, Q)
    });
    if (B !== -1) A.splice(B, 1)
  }

  function vQB(A) {
    let {
      path: Q,
      method: B,
      body: G,
      headers: Z,
      query: I
    } = A;
    return {
      path: Q,
      method: B,
      body: G,
      headers: Z,
      query: I
    }
  }

  function gx1(A) {
    let Q = Object.keys(A),
      B = [];
    for (let G = 0; G < Q.length; ++G) {
      let Z = Q[G],
        I = A[Z],
        Y = Buffer.from(`${Z}`);
      if (Array.isArray(I))
        for (let J = 0; J < I.length; ++J) B.push(Y, Buffer.from(`${I[J]}`));
      else B.push(Y, Buffer.from(`${I}`))
    }
    return B
  }

  function bQB(A) {
    return up8[A] || "unknown"
  }
  async function pp8(A) {
    let Q = [];
    for await (let B of A) Q.push(B);
    return Buffer.concat(Q).toString("utf8")
  }

  function fQB(A, Q) {
    let B = vQB(A),
      G = xQB(this[jlA], B);
    if (G.timesInvoked++, G.data.callback) G.data = {
      ...G.data,
      ...G.data.callback(A)
    };
    let {
      data: {
        statusCode: Z,
        data: I,
        headers: Y,
        trailers: J,
        error: W
      },
      delay: X,
      persist: V
    } = G, {
      timesInvoked: F,
      times: K
    } = G;
    if (G.consumed = !V && F >= K, G.pending = F < K, W !== null) return hx1(this[jlA], B), Q.onError(W), !0;
    if (typeof X === "number" && X > 0) setTimeout(() => {
      D(this[jlA])
    }, X);
    else D(this[jlA]);

    function D(C, E = I) {
      let U = Array.isArray(A.headers) ? ux1(A.headers) : A.headers,
        q = typeof E === "function" ? E({
          ...A,
          headers: U
        }) : E;
      if (mp8(q)) {
        q.then((T) => D(C, T));
        return
      }
      let w = yQB(q),
        N = gx1(Y),
        R = gx1(J);
      Q.onConnect?.((T) => Q.onError(T), null), Q.onHeaders?.(Z, N, H, bQB(Z)), Q.onData?.(Buffer.from(w)), Q.onComplete?.(R), hx1(C, B)
    }

    function H() {}
    return !0
  }

  function lp8() {
    let A = this[vp8],
      Q = this[fp8],
      B = this[bp8];
    return function(Z, I) {
      if (A.isMockActive) try {
        fQB.call(this, Z, I)
      } catch (Y) {
        if (Y instanceof po) {
          let J = A[hp8]();
          if (J === !1) throw new po(`${Y.message}: subsequent request to origin ${Q} was not allowed (net.connect disabled)`);
          if (hQB(J, Q)) B.call(this, Z, I);
          else throw new po(`${Y.message}: subsequent request to origin ${Q} was not allowed (net.connect is not enabled for this origin)`)
        } else throw Y
      } else B.call(this, Z, I)
    }
  }

  function hQB(A, Q) {
    let B = new URL(Q);
    if (A === !0) return !0;
    else if (Array.isArray(A) && A.some((G) => _b(G, B.host))) return !0;
    return !1
  }

  function ip8(A) {
    if (A) {
      let {
        agent: Q,
        ...B
      } = A;
      return B
    }
  }
  gQB.exports = {
    getResponseData: yQB,
    getMockDispatch: xQB,
    addMockDispatch: cp8,
    deleteMockDispatch: hx1,
    buildKey: vQB,
    generateKeyValues: gx1,
    matchValue: _b,
    getResponse: pp8,
    getStatusText: bQB,
    mockDispatch: fQB,
    buildMockDispatch: lp8,
    checkNetConnect: hQB,
    buildMockOptions: ip8,
    getHeaderByName: _QB,
    buildHeadersFromArray: ux1
  }
})
// @from(Start 4930012, End 4933649)
ix1 = z((rp8, lx1) => {
  var {
    getResponseData: np8,
    buildKey: ap8,
    addMockDispatch: mx1
  } = ZzA(), {
    kDispatches: SlA,
    kDispatchKey: _lA,
    kDefaultHeaders: dx1,
    kDefaultTrailers: cx1,
    kContentLength: px1,
    kMockDispatch: klA
  } = U3A(), {
    InvalidArgumentError: z_
  } = R7(), {
    buildURL: sp8
  } = S6();
  class IzA {
    constructor(A) {
      this[klA] = A
    }
    delay(A) {
      if (typeof A !== "number" || !Number.isInteger(A) || A <= 0) throw new z_("waitInMs must be a valid integer > 0");
      return this[klA].delay = A, this
    }
    persist() {
      return this[klA].persist = !0, this
    }
    times(A) {
      if (typeof A !== "number" || !Number.isInteger(A) || A <= 0) throw new z_("repeatTimes must be a valid integer > 0");
      return this[klA].times = A, this
    }
  }
  class uQB {
    constructor(A, Q) {
      if (typeof A !== "object") throw new z_("opts must be an object");
      if (typeof A.path > "u") throw new z_("opts.path must be defined");
      if (typeof A.method > "u") A.method = "GET";
      if (typeof A.path === "string")
        if (A.query) A.path = sp8(A.path, A.query);
        else {
          let B = new URL(A.path, "data://");
          A.path = B.pathname + B.search
        } if (typeof A.method === "string") A.method = A.method.toUpperCase();
      this[_lA] = ap8(A), this[SlA] = Q, this[dx1] = {}, this[cx1] = {}, this[px1] = !1
    }
    createMockScopeDispatchData({
      statusCode: A,
      data: Q,
      responseOptions: B
    }) {
      let G = np8(Q),
        Z = this[px1] ? {
          "content-length": G.length
        } : {},
        I = {
          ...this[dx1],
          ...Z,
          ...B.headers
        },
        Y = {
          ...this[cx1],
          ...B.trailers
        };
      return {
        statusCode: A,
        data: Q,
        headers: I,
        trailers: Y
      }
    }
    validateReplyParameters(A) {
      if (typeof A.statusCode > "u") throw new z_("statusCode must be defined");
      if (typeof A.responseOptions !== "object" || A.responseOptions === null) throw new z_("responseOptions must be an object")
    }
    reply(A) {
      if (typeof A === "function") {
        let Z = (Y) => {
            let J = A(Y);
            if (typeof J !== "object" || J === null) throw new z_("reply options callback must return an object");
            let W = {
              data: "",
              responseOptions: {},
              ...J
            };
            return this.validateReplyParameters(W), {
              ...this.createMockScopeDispatchData(W)
            }
          },
          I = mx1(this[SlA], this[_lA], Z);
        return new IzA(I)
      }
      let Q = {
        statusCode: A,
        data: arguments[1] === void 0 ? "" : arguments[1],
        responseOptions: arguments[2] === void 0 ? {} : arguments[2]
      };
      this.validateReplyParameters(Q);
      let B = this.createMockScopeDispatchData(Q),
        G = mx1(this[SlA], this[_lA], B);
      return new IzA(G)
    }
    replyWithError(A) {
      if (typeof A > "u") throw new z_("error must be defined");
      let Q = mx1(this[SlA], this[_lA], {
        error: A
      });
      return new IzA(Q)
    }
    defaultReplyHeaders(A) {
      if (typeof A > "u") throw new z_("headers must be defined");
      return this[dx1] = A, this
    }
    defaultReplyTrailers(A) {
      if (typeof A > "u") throw new z_("trailers must be defined");
      return this[cx1] = A, this
    }
    replyContentLength() {
      return this[px1] = !0, this
    }
  }
  rp8.MockInterceptor = uQB;
  rp8.MockScope = IzA
})
// @from(Start 4933655, End 4934694)
ax1 = z((dS7, aQB) => {
  var {
    promisify: ep8
  } = UA("node:util"), Al8 = iEA(), {
    buildMockDispatch: Ql8
  } = ZzA(), {
    kDispatches: mQB,
    kMockAgent: dQB,
    kClose: cQB,
    kOriginalClose: pQB,
    kOrigin: lQB,
    kOriginalDispatch: Bl8,
    kConnected: nx1
  } = U3A(), {
    MockInterceptor: Gl8
  } = ix1(), iQB = tI(), {
    InvalidArgumentError: Zl8
  } = R7();
  class nQB extends Al8 {
    constructor(A, Q) {
      super(A, Q);
      if (!Q || !Q.agent || typeof Q.agent.dispatch !== "function") throw new Zl8("Argument opts.agent must implement Agent");
      this[dQB] = Q.agent, this[lQB] = A, this[mQB] = [], this[nx1] = 1, this[Bl8] = this.dispatch, this[pQB] = this.close.bind(this), this.dispatch = Ql8.call(this), this.close = this[cQB]
    }
    get[iQB.kConnected]() {
      return this[nx1]
    }
    intercept(A) {
      return new Gl8(A, this[mQB])
    }
    async [cQB]() {
      await ep8(this[pQB])(), this[nx1] = 0, this[dQB][iQB.kClients].delete(this[lQB])
    }
  }
  aQB.exports = nQB
})
// @from(Start 4934700, End 4935739)
rx1 = z((cS7, BBB) => {
  var {
    promisify: Il8
  } = UA("node:util"), Yl8 = V3A(), {
    buildMockDispatch: Jl8
  } = ZzA(), {
    kDispatches: sQB,
    kMockAgent: rQB,
    kClose: oQB,
    kOriginalClose: tQB,
    kOrigin: eQB,
    kOriginalDispatch: Wl8,
    kConnected: sx1
  } = U3A(), {
    MockInterceptor: Xl8
  } = ix1(), ABB = tI(), {
    InvalidArgumentError: Vl8
  } = R7();
  class QBB extends Yl8 {
    constructor(A, Q) {
      super(A, Q);
      if (!Q || !Q.agent || typeof Q.agent.dispatch !== "function") throw new Vl8("Argument opts.agent must implement Agent");
      this[rQB] = Q.agent, this[eQB] = A, this[sQB] = [], this[sx1] = 1, this[Wl8] = this.dispatch, this[tQB] = this.close.bind(this), this.dispatch = Jl8.call(this), this.close = this[oQB]
    }
    get[ABB.kConnected]() {
      return this[sx1]
    }
    intercept(A) {
      return new Xl8(A, this[sQB])
    }
    async [oQB]() {
      await Il8(this[tQB])(), this[sx1] = 0, this[rQB][ABB.kClients].delete(this[eQB])
    }
  }
  BBB.exports = QBB
})
// @from(Start 4935745, End 4936254)
ZBB = z((pS7, GBB) => {
  var Fl8 = {
      pronoun: "it",
      is: "is",
      was: "was",
      this: "this"
    },
    Kl8 = {
      pronoun: "they",
      is: "are",
      was: "were",
      this: "these"
    };
  GBB.exports = class {
    constructor(Q, B) {
      this.singular = Q, this.plural = B
    }
    pluralize(Q) {
      let B = Q === 1,
        G = B ? Fl8 : Kl8,
        Z = B ? this.singular : this.plural;
      return {
        ...G,
        count: Q,
        noun: Z
      }
    }
  }
})
// @from(Start 4936260, End 4937269)
YBB = z((lS7, IBB) => {
  var {
    Transform: Dl8
  } = UA("node:stream"), {
    Console: Hl8
  } = UA("node:console"), Cl8 = process.versions.icu ? "✅" : "Y ", El8 = process.versions.icu ? "❌" : "N ";
  IBB.exports = class {
    constructor({
      disableColors: Q
    } = {}) {
      this.transform = new Dl8({
        transform(B, G, Z) {
          Z(null, B)
        }
      }), this.logger = new Hl8({
        stdout: this.transform,
        inspectOptions: {
          colors: !Q && !0
        }
      })
    }
    format(Q) {
      let B = Q.map(({
        method: G,
        path: Z,
        data: {
          statusCode: I
        },
        persist: Y,
        times: J,
        timesInvoked: W,
        origin: X
      }) => ({
        Method: G,
        Origin: X,
        Path: Z,
        "Status code": I,
        Persistent: Y ? Cl8 : El8,
        Invocations: W,
        Remaining: Y ? 1 / 0 : J - W
      }));
      return this.logger.table(B), this.transform.read().toString()
    }
  }
})
// @from(Start 4937275, End 4940117)
FBB = z((iS7, VBB) => {
  var {
    kClients: lo
  } = tI(), zl8 = F3A(), {
    kAgent: ox1,
    kMockAgentSet: ylA,
    kMockAgentGet: JBB,
    kDispatches: tx1,
    kIsMockActive: xlA,
    kNetConnect: io,
    kGetNetConnect: Ul8,
    kOptions: vlA,
    kFactory: blA
  } = U3A(), $l8 = ax1(), wl8 = rx1(), {
    matchValue: ql8,
    buildMockOptions: Nl8
  } = ZzA(), {
    InvalidArgumentError: WBB,
    UndiciError: Ll8
  } = R7(), Ml8 = OEA(), Ol8 = ZBB(), Rl8 = YBB();
  class XBB extends Ml8 {
    constructor(A) {
      super(A);
      if (this[io] = !0, this[xlA] = !0, A?.agent && typeof A.agent.dispatch !== "function") throw new WBB("Argument opts.agent must implement Agent");
      let Q = A?.agent ? A.agent : new zl8(A);
      this[ox1] = Q, this[lo] = Q[lo], this[vlA] = Nl8(A)
    }
    get(A) {
      let Q = this[JBB](A);
      if (!Q) Q = this[blA](A), this[ylA](A, Q);
      return Q
    }
    dispatch(A, Q) {
      return this.get(A.origin), this[ox1].dispatch(A, Q)
    }
    async close() {
      await this[ox1].close(), this[lo].clear()
    }
    deactivate() {
      this[xlA] = !1
    }
    activate() {
      this[xlA] = !0
    }
    enableNetConnect(A) {
      if (typeof A === "string" || typeof A === "function" || A instanceof RegExp)
        if (Array.isArray(this[io])) this[io].push(A);
        else this[io] = [A];
      else if (typeof A > "u") this[io] = !0;
      else throw new WBB("Unsupported matcher. Must be one of String|Function|RegExp.")
    }
    disableNetConnect() {
      this[io] = !1
    }
    get isMockActive() {
      return this[xlA]
    } [ylA](A, Q) {
      this[lo].set(A, Q)
    } [blA](A) {
      let Q = Object.assign({
        agent: this
      }, this[vlA]);
      return this[vlA] && this[vlA].connections === 1 ? new $l8(A, Q) : new wl8(A, Q)
    } [JBB](A) {
      let Q = this[lo].get(A);
      if (Q) return Q;
      if (typeof A !== "string") {
        let B = this[blA]("http://localhost:9999");
        return this[ylA](A, B), B
      }
      for (let [B, G] of Array.from(this[lo]))
        if (G && typeof B !== "string" && ql8(B, A)) {
          let Z = this[blA](A);
          return this[ylA](A, Z), Z[tx1] = G[tx1], Z
        }
    } [Ul8]() {
      return this[io]
    }
    pendingInterceptors() {
      let A = this[lo];
      return Array.from(A.entries()).flatMap(([Q, B]) => B[tx1].map((G) => ({
        ...G,
        origin: Q
      }))).filter(({
        pending: Q
      }) => Q)
    }
    assertNoPendingInterceptors({
      pendingInterceptorsFormatter: A = new Rl8
    } = {}) {
      let Q = this.pendingInterceptors();
      if (Q.length === 0) return;
      let B = new Ol8("interceptor", "interceptors").pluralize(Q.length);
      throw new Ll8(`
${B.count} ${B.noun} ${B.is} pending:

${A.format(Q)}
`.trim())
    }
  }
  VBB.exports = XBB
})
// @from(Start 4940123, End 4940701)
flA = z((nS7, CBB) => {
  var KBB = Symbol.for("undici.globalDispatcher.1"),
    {
      InvalidArgumentError: Tl8
    } = R7(),
    Pl8 = F3A();
  if (HBB() === void 0) DBB(new Pl8);

  function DBB(A) {
    if (!A || typeof A.dispatch !== "function") throw new Tl8("Argument agent must implement Agent");
    Object.defineProperty(globalThis, KBB, {
      value: A,
      writable: !0,
      enumerable: !1,
      configurable: !1
    })
  }

  function HBB() {
    return globalThis[KBB]
  }
  CBB.exports = {
    setGlobalDispatcher: DBB,
    getGlobalDispatcher: HBB
  }
})
// @from(Start 4940707, End 4941453)
hlA = z((aS7, EBB) => {
  EBB.exports = class {
    #A;
    constructor(Q) {
      if (typeof Q !== "object" || Q === null) throw TypeError("handler must be an object");
      this.#A = Q
    }
    onConnect(...Q) {
      return this.#A.onConnect?.(...Q)
    }
    onError(...Q) {
      return this.#A.onError?.(...Q)
    }
    onUpgrade(...Q) {
      return this.#A.onUpgrade?.(...Q)
    }
    onResponseStarted(...Q) {
      return this.#A.onResponseStarted?.(...Q)
    }
    onHeaders(...Q) {
      return this.#A.onHeaders?.(...Q)
    }
    onData(...Q) {
      return this.#A.onData?.(...Q)
    }
    onComplete(...Q) {
      return this.#A.onComplete?.(...Q)
    }
    onBodySent(...Q) {
      return this.#A.onBodySent?.(...Q)
    }
  }
})
// @from(Start 4941459, End 4941799)
UBB = z((sS7, zBB) => {
  var jl8 = UlA();
  zBB.exports = (A) => {
    let Q = A?.maxRedirections;
    return (B) => {
      return function(Z, I) {
        let {
          maxRedirections: Y = Q,
          ...J
        } = Z;
        if (!Y) return B(Z, I);
        let W = new jl8(B, Y, Z, I);
        return B(J, W)
      }
    }
  }
})
// @from(Start 4941805, End 4942144)
wBB = z((rS7, $BB) => {
  var Sl8 = PlA();
  $BB.exports = (A) => {
    return (Q) => {
      return function(G, Z) {
        return Q(G, new Sl8({
          ...G,
          retryOptions: {
            ...A,
            ...G.retryOptions
          }
        }, {
          handler: Z,
          dispatch: Q
        }))
      }
    }
  }
})
// @from(Start 4942150, End 4943790)
LBB = z((oS7, NBB) => {
  var _l8 = S6(),
    {
      InvalidArgumentError: kl8,
      RequestAbortedError: yl8
    } = R7(),
    xl8 = hlA();
  class qBB extends xl8 {
    #A = 1048576;
    #Q = null;
    #B = !1;
    #Z = !1;
    #G = 0;
    #J = null;
    #I = null;
    constructor({
      maxSize: A
    }, Q) {
      super(Q);
      if (A != null && (!Number.isFinite(A) || A < 1)) throw new kl8("maxSize must be a number greater than 0");
      this.#A = A ?? this.#A, this.#I = Q
    }
    onConnect(A) {
      this.#Q = A, this.#I.onConnect(this.#V.bind(this))
    }
    #V(A) {
      this.#Z = !0, this.#J = A
    }
    onHeaders(A, Q, B, G) {
      let I = _l8.parseHeaders(Q)["content-length"];
      if (I != null && I > this.#A) throw new yl8(`Response size (${I}) larger than maxSize (${this.#A})`);
      if (this.#Z) return !0;
      return this.#I.onHeaders(A, Q, B, G)
    }
    onError(A) {
      if (this.#B) return;
      A = this.#J ?? A, this.#I.onError(A)
    }
    onData(A) {
      if (this.#G = this.#G + A.length, this.#G >= this.#A)
        if (this.#B = !0, this.#Z) this.#I.onError(this.#J);
        else this.#I.onComplete([]);
      return !0
    }
    onComplete(A) {
      if (this.#B) return;
      if (this.#Z) {
        this.#I.onError(this.reason);
        return
      }
      this.#I.onComplete(A)
    }
  }

  function vl8({
    maxSize: A
  } = {
    maxSize: 1048576
  }) {
    return (Q) => {
      return function(G, Z) {
        let {
          dumpMaxSize: I = A
        } = G, Y = new qBB({
          maxSize: I
        }, Z);
        return Q(G, Y)
      }
    }
  }
  NBB.exports = vl8
})
// @from(Start 4943796, End 4949999)
PBB = z((tS7, TBB) => {
  var {
    isIP: bl8
  } = UA("node:net"), {
    lookup: fl8
  } = UA("node:dns"), hl8 = hlA(), {
    InvalidArgumentError: $3A,
    InformationalError: gl8
  } = R7(), MBB = Math.pow(2, 31) - 1;
  class OBB {
    #A = 0;
    #Q = 0;
    #B = new Map;
    dualStack = !0;
    affinity = null;
    lookup = null;
    pick = null;
    constructor(A) {
      this.#A = A.maxTTL, this.#Q = A.maxItems, this.dualStack = A.dualStack, this.affinity = A.affinity, this.lookup = A.lookup ?? this.#Z, this.pick = A.pick ?? this.#G
    }
    get full() {
      return this.#B.size === this.#Q
    }
    runLookup(A, Q, B) {
      let G = this.#B.get(A.hostname);
      if (G == null && this.full) {
        B(null, A.origin);
        return
      }
      let Z = {
        affinity: this.affinity,
        dualStack: this.dualStack,
        lookup: this.lookup,
        pick: this.pick,
        ...Q.dns,
        maxTTL: this.#A,
        maxItems: this.#Q
      };
      if (G == null) this.lookup(A, Z, (I, Y) => {
        if (I || Y == null || Y.length === 0) {
          B(I ?? new gl8("No DNS entries found"));
          return
        }
        this.setRecords(A, Y);
        let J = this.#B.get(A.hostname),
          W = this.pick(A, J, Z.affinity),
          X;
        if (typeof W.port === "number") X = `:${W.port}`;
        else if (A.port !== "") X = `:${A.port}`;
        else X = "";
        B(null, `${A.protocol}//${W.family===6?`[${W.address}]`:W.address}${X}`)
      });
      else {
        let I = this.pick(A, G, Z.affinity);
        if (I == null) {
          this.#B.delete(A.hostname), this.runLookup(A, Q, B);
          return
        }
        let Y;
        if (typeof I.port === "number") Y = `:${I.port}`;
        else if (A.port !== "") Y = `:${A.port}`;
        else Y = "";
        B(null, `${A.protocol}//${I.family===6?`[${I.address}]`:I.address}${Y}`)
      }
    }
    #Z(A, Q, B) {
      fl8(A.hostname, {
        all: !0,
        family: this.dualStack === !1 ? this.affinity : 0,
        order: "ipv4first"
      }, (G, Z) => {
        if (G) return B(G);
        let I = new Map;
        for (let Y of Z) I.set(`${Y.address}:${Y.family}`, Y);
        B(null, I.values())
      })
    }
    #G(A, Q, B) {
      let G = null,
        {
          records: Z,
          offset: I
        } = Q,
        Y;
      if (this.dualStack) {
        if (B == null)
          if (I == null || I === MBB) Q.offset = 0, B = 4;
          else Q.offset++, B = (Q.offset & 1) === 1 ? 6 : 4;
        if (Z[B] != null && Z[B].ips.length > 0) Y = Z[B];
        else Y = Z[B === 4 ? 6 : 4]
      } else Y = Z[B];
      if (Y == null || Y.ips.length === 0) return G;
      if (Y.offset == null || Y.offset === MBB) Y.offset = 0;
      else Y.offset++;
      let J = Y.offset % Y.ips.length;
      if (G = Y.ips[J] ?? null, G == null) return G;
      if (Date.now() - G.timestamp > G.ttl) return Y.ips.splice(J, 1), this.pick(A, Q, B);
      return G
    }
    setRecords(A, Q) {
      let B = Date.now(),
        G = {
          records: {
            4: null,
            6: null
          }
        };
      for (let Z of Q) {
        if (Z.timestamp = B, typeof Z.ttl === "number") Z.ttl = Math.min(Z.ttl, this.#A);
        else Z.ttl = this.#A;
        let I = G.records[Z.family] ?? {
          ips: []
        };
        I.ips.push(Z), G.records[Z.family] = I
      }
      this.#B.set(A.hostname, G)
    }
    getHandler(A, Q) {
      return new RBB(this, A, Q)
    }
  }
  class RBB extends hl8 {
    #A = null;
    #Q = null;
    #B = null;
    #Z = null;
    #G = null;
    constructor(A, {
      origin: Q,
      handler: B,
      dispatch: G
    }, Z) {
      super(B);
      this.#G = Q, this.#Z = B, this.#Q = {
        ...Z
      }, this.#A = A, this.#B = G
    }
    onError(A) {
      switch (A.code) {
        case "ETIMEDOUT":
        case "ECONNREFUSED": {
          if (this.#A.dualStack) {
            this.#A.runLookup(this.#G, this.#Q, (Q, B) => {
              if (Q) return this.#Z.onError(Q);
              let G = {
                ...this.#Q,
                origin: B
              };
              this.#B(G, this)
            });
            return
          }
          this.#Z.onError(A);
          return
        }
        case "ENOTFOUND":
          this.#A.deleteRecord(this.#G);
        default:
          this.#Z.onError(A);
          break
      }
    }
  }
  TBB.exports = (A) => {
    if (A?.maxTTL != null && (typeof A?.maxTTL !== "number" || A?.maxTTL < 0)) throw new $3A("Invalid maxTTL. Must be a positive number");
    if (A?.maxItems != null && (typeof A?.maxItems !== "number" || A?.maxItems < 1)) throw new $3A("Invalid maxItems. Must be a positive number and greater than zero");
    if (A?.affinity != null && A?.affinity !== 4 && A?.affinity !== 6) throw new $3A("Invalid affinity. Must be either 4 or 6");
    if (A?.dualStack != null && typeof A?.dualStack !== "boolean") throw new $3A("Invalid dualStack. Must be a boolean");
    if (A?.lookup != null && typeof A?.lookup !== "function") throw new $3A("Invalid lookup. Must be a function");
    if (A?.pick != null && typeof A?.pick !== "function") throw new $3A("Invalid pick. Must be a function");
    let Q = A?.dualStack ?? !0,
      B;
    if (Q) B = A?.affinity ?? null;
    else B = A?.affinity ?? 4;
    let G = {
        maxTTL: A?.maxTTL ?? 1e4,
        lookup: A?.lookup ?? null,
        pick: A?.pick ?? null,
        dualStack: Q,
        affinity: B,
        maxItems: A?.maxItems ?? 1 / 0
      },
      Z = new OBB(G);
    return (I) => {
      return function(J, W) {
        let X = J.origin.constructor === URL ? J.origin : new URL(J.origin);
        if (bl8(X.hostname) !== 0) return I(J, W);
        return Z.runLookup(X, J, (V, F) => {
          if (V) return W.onError(V);
          let K = null;
          K = {
            ...J,
            servername: X.hostname,
            origin: F,
            headers: {
              host: X.hostname,
              ...J.headers
            }
          }, I(K, Z.getHandler({
            origin: X,
            dispatch: I,
            handler: W
          }, J))
        }), !0
      }
    }
  }
})
// @from(Start 4950005, End 4959536)
no = z((eS7, vBB) => {
  var {
    kConstruct: ul8
  } = tI(), {
    kEnumerableProperty: w3A
  } = S6(), {
    iteratorMixin: ml8,
    isValidHeaderName: YzA,
    isValidHeaderValue: SBB
  } = xw(), {
    webidl: X3
  } = zD(), ex1 = UA("node:assert"), glA = UA("node:util"), vX = Symbol("headers map"), fw = Symbol("headers map sorted");

  function jBB(A) {
    return A === 10 || A === 13 || A === 9 || A === 32
  }

  function _BB(A) {
    let Q = 0,
      B = A.length;
    while (B > Q && jBB(A.charCodeAt(B - 1))) --B;
    while (B > Q && jBB(A.charCodeAt(Q))) ++Q;
    return Q === 0 && B === A.length ? A : A.substring(Q, B)
  }

  function kBB(A, Q) {
    if (Array.isArray(Q))
      for (let B = 0; B < Q.length; ++B) {
        let G = Q[B];
        if (G.length !== 2) throw X3.errors.exception({
          header: "Headers constructor",
          message: `expected name/value pair to be length 2, found ${G.length}.`
        });
        Av1(A, G[0], G[1])
      } else if (typeof Q === "object" && Q !== null) {
        let B = Object.keys(Q);
        for (let G = 0; G < B.length; ++G) Av1(A, B[G], Q[B[G]])
      } else throw X3.errors.conversionFailed({
        prefix: "Headers constructor",
        argument: "Argument 1",
        types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
      })
  }

  function Av1(A, Q, B) {
    if (B = _BB(B), !YzA(Q)) throw X3.errors.invalidArgument({
      prefix: "Headers.append",
      value: Q,
      type: "header name"
    });
    else if (!SBB(B)) throw X3.errors.invalidArgument({
      prefix: "Headers.append",
      value: B,
      type: "header value"
    });
    if (xBB(A) === "immutable") throw TypeError("immutable");
    return Qv1(A).append(Q, B, !1)
  }

  function yBB(A, Q) {
    return A[0] < Q[0] ? -1 : 1
  }
  class ulA {
    cookies = null;
    constructor(A) {
      if (A instanceof ulA) this[vX] = new Map(A[vX]), this[fw] = A[fw], this.cookies = A.cookies === null ? null : [...A.cookies];
      else this[vX] = new Map(A), this[fw] = null
    }
    contains(A, Q) {
      return this[vX].has(Q ? A : A.toLowerCase())
    }
    clear() {
      this[vX].clear(), this[fw] = null, this.cookies = null
    }
    append(A, Q, B) {
      this[fw] = null;
      let G = B ? A : A.toLowerCase(),
        Z = this[vX].get(G);
      if (Z) {
        let I = G === "cookie" ? "; " : ", ";
        this[vX].set(G, {
          name: Z.name,
          value: `${Z.value}${I}${Q}`
        })
      } else this[vX].set(G, {
        name: A,
        value: Q
      });
      if (G === "set-cookie")(this.cookies ??= []).push(Q)
    }
    set(A, Q, B) {
      this[fw] = null;
      let G = B ? A : A.toLowerCase();
      if (G === "set-cookie") this.cookies = [Q];
      this[vX].set(G, {
        name: A,
        value: Q
      })
    }
    delete(A, Q) {
      if (this[fw] = null, !Q) A = A.toLowerCase();
      if (A === "set-cookie") this.cookies = null;
      this[vX].delete(A)
    }
    get(A, Q) {
      return this[vX].get(Q ? A : A.toLowerCase())?.value ?? null
    }*[Symbol.iterator]() {
      for (let {
          0: A,
          1: {
            value: Q
          }
        }
        of this[vX]) yield [A, Q]
    }
    get entries() {
      let A = {};
      if (this[vX].size !== 0)
        for (let {
            name: Q,
            value: B
          }
          of this[vX].values()) A[Q] = B;
      return A
    }
    rawValues() {
      return this[vX].values()
    }
    get entriesList() {
      let A = [];
      if (this[vX].size !== 0)
        for (let {
            0: Q,
            1: {
              name: B,
              value: G
            }
          }
          of this[vX])
          if (Q === "set-cookie")
            for (let Z of this.cookies) A.push([B, Z]);
          else A.push([B, G]);
      return A
    }
    toSortedArray() {
      let A = this[vX].size,
        Q = Array(A);
      if (A <= 32) {
        if (A === 0) return Q;
        let B = this[vX][Symbol.iterator](),
          G = B.next().value;
        Q[0] = [G[0], G[1].value], ex1(G[1].value !== null);
        for (let Z = 1, I = 0, Y = 0, J = 0, W = 0, X, V; Z < A; ++Z) {
          V = B.next().value, X = Q[Z] = [V[0], V[1].value], ex1(X[1] !== null), J = 0, Y = Z;
          while (J < Y)
            if (W = J + (Y - J >> 1), Q[W][0] <= X[0]) J = W + 1;
            else Y = W;
          if (Z !== W) {
            I = Z;
            while (I > J) Q[I] = Q[--I];
            Q[J] = X
          }
        }
        if (!B.next().done) throw TypeError("Unreachable");
        return Q
      } else {
        let B = 0;
        for (let {
            0: G,
            1: {
              value: Z
            }
          }
          of this[vX]) Q[B++] = [G, Z], ex1(Z !== null);
        return Q.sort(yBB)
      }
    }
  }
  class kH {
    #A;
    #Q;
    constructor(A = void 0) {
      if (X3.util.markAsUncloneable(this), A === ul8) return;
      if (this.#Q = new ulA, this.#A = "none", A !== void 0) A = X3.converters.HeadersInit(A, "Headers contructor", "init"), kBB(this, A)
    }
    append(A, Q) {
      X3.brandCheck(this, kH), X3.argumentLengthCheck(arguments, 2, "Headers.append");
      let B = "Headers.append";
      return A = X3.converters.ByteString(A, B, "name"), Q = X3.converters.ByteString(Q, B, "value"), Av1(this, A, Q)
    }
    delete(A) {
      X3.brandCheck(this, kH), X3.argumentLengthCheck(arguments, 1, "Headers.delete");
      let Q = "Headers.delete";
      if (A = X3.converters.ByteString(A, Q, "name"), !YzA(A)) throw X3.errors.invalidArgument({
        prefix: "Headers.delete",
        value: A,
        type: "header name"
      });
      if (this.#A === "immutable") throw TypeError("immutable");
      if (!this.#Q.contains(A, !1)) return;
      this.#Q.delete(A, !1)
    }
    get(A) {
      X3.brandCheck(this, kH), X3.argumentLengthCheck(arguments, 1, "Headers.get");
      let Q = "Headers.get";
      if (A = X3.converters.ByteString(A, Q, "name"), !YzA(A)) throw X3.errors.invalidArgument({
        prefix: Q,
        value: A,
        type: "header name"
      });
      return this.#Q.get(A, !1)
    }
    has(A) {
      X3.brandCheck(this, kH), X3.argumentLengthCheck(arguments, 1, "Headers.has");
      let Q = "Headers.has";
      if (A = X3.converters.ByteString(A, Q, "name"), !YzA(A)) throw X3.errors.invalidArgument({
        prefix: Q,
        value: A,
        type: "header name"
      });
      return this.#Q.contains(A, !1)
    }
    set(A, Q) {
      X3.brandCheck(this, kH), X3.argumentLengthCheck(arguments, 2, "Headers.set");
      let B = "Headers.set";
      if (A = X3.converters.ByteString(A, B, "name"), Q = X3.converters.ByteString(Q, B, "value"), Q = _BB(Q), !YzA(A)) throw X3.errors.invalidArgument({
        prefix: B,
        value: A,
        type: "header name"
      });
      else if (!SBB(Q)) throw X3.errors.invalidArgument({
        prefix: B,
        value: Q,
        type: "header value"
      });
      if (this.#A === "immutable") throw TypeError("immutable");
      this.#Q.set(A, Q, !1)
    }
    getSetCookie() {
      X3.brandCheck(this, kH);
      let A = this.#Q.cookies;
      if (A) return [...A];
      return []
    }
    get[fw]() {
      if (this.#Q[fw]) return this.#Q[fw];
      let A = [],
        Q = this.#Q.toSortedArray(),
        B = this.#Q.cookies;
      if (B === null || B.length === 1) return this.#Q[fw] = Q;
      for (let G = 0; G < Q.length; ++G) {
        let {
          0: Z,
          1: I
        } = Q[G];
        if (Z === "set-cookie")
          for (let Y = 0; Y < B.length; ++Y) A.push([Z, B[Y]]);
        else A.push([Z, I])
      }
      return this.#Q[fw] = A
    } [glA.inspect.custom](A, Q) {
      return Q.depth ??= A, `Headers ${glA.formatWithOptions(Q,this.#Q.entries)}`
    }
    static getHeadersGuard(A) {
      return A.#A
    }
    static setHeadersGuard(A, Q) {
      A.#A = Q
    }
    static getHeadersList(A) {
      return A.#Q
    }
    static setHeadersList(A, Q) {
      A.#Q = Q
    }
  }
  var {
    getHeadersGuard: xBB,
    setHeadersGuard: dl8,
    getHeadersList: Qv1,
    setHeadersList: cl8
  } = kH;
  Reflect.deleteProperty(kH, "getHeadersGuard");
  Reflect.deleteProperty(kH, "setHeadersGuard");
  Reflect.deleteProperty(kH, "getHeadersList");
  Reflect.deleteProperty(kH, "setHeadersList");
  ml8("Headers", kH, fw, 0, 1);
  Object.defineProperties(kH.prototype, {
    append: w3A,
    delete: w3A,
    get: w3A,
    has: w3A,
    set: w3A,
    getSetCookie: w3A,
    [Symbol.toStringTag]: {
      value: "Headers",
      configurable: !0
    },
    [glA.inspect.custom]: {
      enumerable: !1
    }
  });
  X3.converters.HeadersInit = function(A, Q, B) {
    if (X3.util.Type(A) === "Object") {
      let G = Reflect.get(A, Symbol.iterator);
      if (!glA.types.isProxy(A) && G === kH.prototype.entries) try {
        return Qv1(A).entriesList
      } catch {}
      if (typeof G === "function") return X3.converters["sequence<sequence<ByteString>>"](A, Q, B, G.bind(A));
      return X3.converters["record<ByteString, ByteString>"](A, Q, B)
    }
    throw X3.errors.conversionFailed({
      prefix: "Headers constructor",
      argument: "Argument 1",
      types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
    })
  };
  vBB.exports = {
    fill: kBB,
    compareHeaderName: yBB,
    Headers: kH,
    HeadersList: ulA,
    getHeadersGuard: xBB,
    setHeadersGuard: dl8,
    setHeadersList: cl8,
    getHeadersList: Qv1
  }
})
// @from(Start 4959542, End 4968608)
WzA = z((A_7, lBB) => {
  var {
    Headers: mBB,
    HeadersList: bBB,
    fill: pl8,
    getHeadersGuard: ll8,
    setHeadersGuard: dBB,
    setHeadersList: cBB
  } = no(), {
    extractBody: fBB,
    cloneBody: il8,
    mixinBody: nl8,
    hasFinalizationRegistry: al8,
    streamRegistry: sl8,
    bodyUnusable: rl8
  } = G3A(), Bv1 = S6(), hBB = UA("node:util"), {
    kEnumerableProperty: hw
  } = Bv1, {
    isValidReasonPhrase: ol8,
    isCancelled: tl8,
    isAborted: el8,
    isBlobLike: Ai8,
    serializeJavascriptValueToJSONString: Qi8,
    isErrorLike: Bi8,
    isomorphicEncode: Gi8,
    environmentSettingsObject: Zi8
  } = xw(), {
    redirectStatusSet: Ii8,
    nullBodyStatus: Yi8
  } = PEA(), {
    kState: RJ,
    kHeaders: kb
  } = Kc(), {
    webidl: p8
  } = zD(), {
    FormData: Ji8
  } = yEA(), {
    URLSerializer: gBB
  } = QU(), {
    kConstruct: dlA
  } = tI(), Gv1 = UA("node:assert"), {
    types: Wi8
  } = UA("node:util"), Xi8 = new TextEncoder("utf-8");
  class yH {
    static error() {
      return JzA(clA(), "immutable")
    }
    static json(A, Q = {}) {
      if (p8.argumentLengthCheck(arguments, 1, "Response.json"), Q !== null) Q = p8.converters.ResponseInit(Q);
      let B = Xi8.encode(Qi8(A)),
        G = fBB(B),
        Z = JzA(q3A({}), "response");
      return uBB(Z, Q, {
        body: G[0],
        type: "application/json"
      }), Z
    }
    static redirect(A, Q = 302) {
      p8.argumentLengthCheck(arguments, 1, "Response.redirect"), A = p8.converters.USVString(A), Q = p8.converters["unsigned short"](Q);
      let B;
      try {
        B = new URL(A, Zi8.settingsObject.baseUrl)
      } catch (I) {
        throw TypeError(`Failed to parse URL from ${A}`, {
          cause: I
        })
      }
      if (!Ii8.has(Q)) throw RangeError(`Invalid status code ${Q}`);
      let G = JzA(q3A({}), "immutable");
      G[RJ].status = Q;
      let Z = Gi8(gBB(B));
      return G[RJ].headersList.append("location", Z, !0), G
    }
    constructor(A = null, Q = {}) {
      if (p8.util.markAsUncloneable(this), A === dlA) return;
      if (A !== null) A = p8.converters.BodyInit(A);
      Q = p8.converters.ResponseInit(Q), this[RJ] = q3A({}), this[kb] = new mBB(dlA), dBB(this[kb], "response"), cBB(this[kb], this[RJ].headersList);
      let B = null;
      if (A != null) {
        let [G, Z] = fBB(A);
        B = {
          body: G,
          type: Z
        }
      }
      uBB(this, Q, B)
    }
    get type() {
      return p8.brandCheck(this, yH), this[RJ].type
    }
    get url() {
      p8.brandCheck(this, yH);
      let A = this[RJ].urlList,
        Q = A[A.length - 1] ?? null;
      if (Q === null) return "";
      return gBB(Q, !0)
    }
    get redirected() {
      return p8.brandCheck(this, yH), this[RJ].urlList.length > 1
    }
    get status() {
      return p8.brandCheck(this, yH), this[RJ].status
    }
    get ok() {
      return p8.brandCheck(this, yH), this[RJ].status >= 200 && this[RJ].status <= 299
    }
    get statusText() {
      return p8.brandCheck(this, yH), this[RJ].statusText
    }
    get headers() {
      return p8.brandCheck(this, yH), this[kb]
    }
    get body() {
      return p8.brandCheck(this, yH), this[RJ].body ? this[RJ].body.stream : null
    }
    get bodyUsed() {
      return p8.brandCheck(this, yH), !!this[RJ].body && Bv1.isDisturbed(this[RJ].body.stream)
    }
    clone() {
      if (p8.brandCheck(this, yH), rl8(this)) throw p8.errors.exception({
        header: "Response.clone",
        message: "Body has already been consumed."
      });
      let A = Zv1(this[RJ]);
      return JzA(A, ll8(this[kb]))
    } [hBB.inspect.custom](A, Q) {
      if (Q.depth === null) Q.depth = 2;
      Q.colors ??= !0;
      let B = {
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        body: this.body,
        bodyUsed: this.bodyUsed,
        ok: this.ok,
        redirected: this.redirected,
        type: this.type,
        url: this.url
      };
      return `Response ${hBB.formatWithOptions(Q,B)}`
    }
  }
  nl8(yH);
  Object.defineProperties(yH.prototype, {
    type: hw,
    url: hw,
    status: hw,
    ok: hw,
    redirected: hw,
    statusText: hw,
    headers: hw,
    clone: hw,
    body: hw,
    bodyUsed: hw,
    [Symbol.toStringTag]: {
      value: "Response",
      configurable: !0
    }
  });
  Object.defineProperties(yH, {
    json: hw,
    redirect: hw,
    error: hw
  });

  function Zv1(A) {
    if (A.internalResponse) return pBB(Zv1(A.internalResponse), A.type);
    let Q = q3A({
      ...A,
      body: null
    });
    if (A.body != null) Q.body = il8(Q, A.body);
    return Q
  }

  function q3A(A) {
    return {
      aborted: !1,
      rangeRequested: !1,
      timingAllowPassed: !1,
      requestIncludesCredentials: !1,
      type: "default",
      status: 200,
      timingInfo: null,
      cacheState: "",
      statusText: "",
      ...A,
      headersList: A?.headersList ? new bBB(A?.headersList) : new bBB,
      urlList: A?.urlList ? [...A.urlList] : []
    }
  }

  function clA(A) {
    let Q = Bi8(A);
    return q3A({
      type: "error",
      status: 0,
      error: Q ? A : Error(A ? String(A) : A),
      aborted: A && A.name === "AbortError"
    })
  }

  function Vi8(A) {
    return A.type === "error" && A.status === 0
  }

  function mlA(A, Q) {
    return Q = {
      internalResponse: A,
      ...Q
    }, new Proxy(A, {
      get(B, G) {
        return G in Q ? Q[G] : B[G]
      },
      set(B, G, Z) {
        return Gv1(!(G in Q)), B[G] = Z, !0
      }
    })
  }

  function pBB(A, Q) {
    if (Q === "basic") return mlA(A, {
      type: "basic",
      headersList: A.headersList
    });
    else if (Q === "cors") return mlA(A, {
      type: "cors",
      headersList: A.headersList
    });
    else if (Q === "opaque") return mlA(A, {
      type: "opaque",
      urlList: Object.freeze([]),
      status: 0,
      statusText: "",
      body: null
    });
    else if (Q === "opaqueredirect") return mlA(A, {
      type: "opaqueredirect",
      status: 0,
      statusText: "",
      headersList: [],
      body: null
    });
    else Gv1(!1)
  }

  function Fi8(A, Q = null) {
    return Gv1(tl8(A)), el8(A) ? clA(Object.assign(new DOMException("The operation was aborted.", "AbortError"), {
      cause: Q
    })) : clA(Object.assign(new DOMException("Request was cancelled."), {
      cause: Q
    }))
  }

  function uBB(A, Q, B) {
    if (Q.status !== null && (Q.status < 200 || Q.status > 599)) throw RangeError('init["status"] must be in the range of 200 to 599, inclusive.');
    if ("statusText" in Q && Q.statusText != null) {
      if (!ol8(String(Q.statusText))) throw TypeError("Invalid statusText")
    }
    if ("status" in Q && Q.status != null) A[RJ].status = Q.status;
    if ("statusText" in Q && Q.statusText != null) A[RJ].statusText = Q.statusText;
    if ("headers" in Q && Q.headers != null) pl8(A[kb], Q.headers);
    if (B) {
      if (Yi8.includes(A.status)) throw p8.errors.exception({
        header: "Response constructor",
        message: `Invalid response status code ${A.status}`
      });
      if (A[RJ].body = B.body, B.type != null && !A[RJ].headersList.contains("content-type", !0)) A[RJ].headersList.append("content-type", B.type, !0)
    }
  }

  function JzA(A, Q) {
    let B = new yH(dlA);
    if (B[RJ] = A, B[kb] = new mBB(dlA), cBB(B[kb], A.headersList), dBB(B[kb], Q), al8 && A.body?.stream) sl8.register(B, new WeakRef(A.body.stream));
    return B
  }
  p8.converters.ReadableStream = p8.interfaceConverter(ReadableStream);
  p8.converters.FormData = p8.interfaceConverter(Ji8);
  p8.converters.URLSearchParams = p8.interfaceConverter(URLSearchParams);
  p8.converters.XMLHttpRequestBodyInit = function(A, Q, B) {
    if (typeof A === "string") return p8.converters.USVString(A, Q, B);
    if (Ai8(A)) return p8.converters.Blob(A, Q, B, {
      strict: !1
    });
    if (ArrayBuffer.isView(A) || Wi8.isArrayBuffer(A)) return p8.converters.BufferSource(A, Q, B);
    if (Bv1.isFormDataLike(A)) return p8.converters.FormData(A, Q, B, {
      strict: !1
    });
    if (A instanceof URLSearchParams) return p8.converters.URLSearchParams(A, Q, B);
    return p8.converters.DOMString(A, Q, B)
  };
  p8.converters.BodyInit = function(A, Q, B) {
    if (A instanceof ReadableStream) return p8.converters.ReadableStream(A, Q, B);
    if (A?.[Symbol.asyncIterator]) return A;
    return p8.converters.XMLHttpRequestBodyInit(A, Q, B)
  };
  p8.converters.ResponseInit = p8.dictionaryConverter([{
    key: "status",
    converter: p8.converters["unsigned short"],
    defaultValue: () => 200
  }, {
    key: "statusText",
    converter: p8.converters.ByteString,
    defaultValue: () => ""
  }, {
    key: "headers",
    converter: p8.converters.HeadersInit
  }]);
  lBB.exports = {
    isNetworkError: Vi8,
    makeNetworkError: clA,
    makeResponse: q3A,
    makeAppropriateNetworkError: Fi8,
    filterResponse: pBB,
    Response: yH,
    cloneResponse: Zv1,
    fromInnerResponse: JzA
  }
})
// @from(Start 4968614, End 4969406)
oBB = z((Q_7, rBB) => {
  var {
    kConnected: iBB,
    kSize: nBB
  } = tI();
  class aBB {
    constructor(A) {
      this.value = A
    }
    deref() {
      return this.value[iBB] === 0 && this.value[nBB] === 0 ? void 0 : this.value
    }
  }
  class sBB {
    constructor(A) {
      this.finalizer = A
    }
    register(A, Q) {
      if (A.on) A.on("disconnect", () => {
        if (A[iBB] === 0 && A[nBB] === 0) this.finalizer(Q)
      })
    }
    unregister(A) {}
  }
  rBB.exports = function() {
    if (process.env.NODE_V8_COVERAGE && process.version.startsWith("v18")) return process._rawDebug("Using compatibility WeakRef and FinalizationRegistry"), {
      WeakRef: aBB,
      FinalizationRegistry: sBB
    };
    return {
      WeakRef,
      FinalizationRegistry
    }
  }
})