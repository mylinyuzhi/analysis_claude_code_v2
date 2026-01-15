
// @from(Ln 291648, Col 4)
FF2 = U((VF2) => {
  Object.defineProperty(VF2, "t", {
    value: !0
  });
  class gK0 {
    constructor(A, Q, B = 1) {
      this.i = void 0, this.h = void 0, this.o = void 0, this.u = A, this.l = Q, this.p = B
    }
    I() {
      let A = this,
        Q = A.o.o === A;
      if (Q && A.p === 1) A = A.h;
      else if (A.i) {
        A = A.i;
        while (A.h) A = A.h
      } else {
        if (Q) return A.o;
        let B = A.o;
        while (B.i === A) A = B, B = A.o;
        A = B
      }
      return A
    }
    B() {
      let A = this;
      if (A.h) {
        A = A.h;
        while (A.i) A = A.i;
        return A
      } else {
        let Q = A.o;
        while (Q.h === A) A = Q, Q = A.o;
        if (A.h !== Q) return Q;
        else return A
      }
    }
    _() {
      let A = this.o,
        Q = this.h,
        B = Q.i;
      if (A.o === this) A.o = Q;
      else if (A.i === this) A.i = Q;
      else A.h = Q;
      if (Q.o = A, Q.i = this, this.o = Q, this.h = B, B) B.o = this;
      return Q
    }
    g() {
      let A = this.o,
        Q = this.i,
        B = Q.h;
      if (A.o === this) A.o = Q;
      else if (A.i === this) A.i = Q;
      else A.h = Q;
      if (Q.o = A, Q.h = this, this.o = Q, this.i = B, B) B.o = this;
      return Q
    }
  }
  class YF2 extends gK0 {
    constructor() {
      super(...arguments);
      this.M = 1
    }
    _() {
      let A = super._();
      return this.O(), A.O(), A
    }
    g() {
      let A = super.g();
      return this.O(), A.O(), A
    }
    O() {
      if (this.M = 1, this.i) this.M += this.i.M;
      if (this.h) this.M += this.h.M
    }
  }
  class JF2 {
    constructor(A = 0) {
      this.iteratorType = A
    }
    equals(A) {
      return this.T === A.T
    }
  }
  class XF2 {
    constructor() {
      this.m = 0
    }
    get length() {
      return this.m
    }
    size() {
      return this.m
    }
    empty() {
      return this.m === 0
    }
  }
  class IF2 extends XF2 {}

  function o4A() {
    throw RangeError("Iterator access denied!")
  }
  class DF2 extends IF2 {
    constructor(A = function (B, G) {
      if (B < G) return -1;
      if (B > G) return 1;
      return 0
    }, Q = !1) {
      super();
      this.v = void 0, this.A = A, this.enableIndex = Q, this.N = Q ? YF2 : gK0, this.C = new this.N
    }
    R(A, Q) {
      let B = this.C;
      while (A) {
        let G = this.A(A.u, Q);
        if (G < 0) A = A.h;
        else if (G > 0) B = A, A = A.i;
        else return A
      }
      return B
    }
    K(A, Q) {
      let B = this.C;
      while (A)
        if (this.A(A.u, Q) <= 0) A = A.h;
        else B = A, A = A.i;
      return B
    }
    L(A, Q) {
      let B = this.C;
      while (A) {
        let G = this.A(A.u, Q);
        if (G < 0) B = A, A = A.h;
        else if (G > 0) A = A.i;
        else return A
      }
      return B
    }
    k(A, Q) {
      let B = this.C;
      while (A)
        if (this.A(A.u, Q) < 0) B = A, A = A.h;
        else A = A.i;
      return B
    }
    P(A) {
      while (!0) {
        let Q = A.o;
        if (Q === this.C) return;
        if (A.p === 1) {
          A.p = 0;
          return
        }
        if (A === Q.i) {
          let B = Q.h;
          if (B.p === 1)
            if (B.p = 0, Q.p = 1, Q === this.v) this.v = Q._();
            else Q._();
          else if (B.h && B.h.p === 1) {
            if (B.p = Q.p, Q.p = 0, B.h.p = 0, Q === this.v) this.v = Q._();
            else Q._();
            return
          } else if (B.i && B.i.p === 1) B.p = 1, B.i.p = 0, B.g();
          else B.p = 1, A = Q
        } else {
          let B = Q.i;
          if (B.p === 1)
            if (B.p = 0, Q.p = 1, Q === this.v) this.v = Q.g();
            else Q.g();
          else if (B.i && B.i.p === 1) {
            if (B.p = Q.p, Q.p = 0, B.i.p = 0, Q === this.v) this.v = Q.g();
            else Q.g();
            return
          } else if (B.h && B.h.p === 1) B.p = 1, B.h.p = 0, B._();
          else B.p = 1, A = Q
        }
      }
    }
    S(A) {
      if (this.m === 1) {
        this.clear();
        return
      }
      let Q = A;
      while (Q.i || Q.h) {
        if (Q.h) {
          Q = Q.h;
          while (Q.i) Q = Q.i
        } else Q = Q.i;
        let G = A.u;
        A.u = Q.u, Q.u = G;
        let Z = A.l;
        A.l = Q.l, Q.l = Z, A = Q
      }
      if (this.C.i === Q) this.C.i = Q.o;
      else if (this.C.h === Q) this.C.h = Q.o;
      this.P(Q);
      let B = Q.o;
      if (Q === B.i) B.i = void 0;
      else B.h = void 0;
      if (this.m -= 1, this.v.p = 0, this.enableIndex)
        while (B !== this.C) B.M -= 1, B = B.o
    }
    U(A) {
      let Q = typeof A === "number" ? A : void 0,
        B = typeof A === "function" ? A : void 0,
        G = typeof A > "u" ? [] : void 0,
        Z = 0,
        Y = this.v,
        J = [];
      while (J.length || Y)
        if (Y) J.push(Y), Y = Y.i;
        else {
          if (Y = J.pop(), Z === Q) return Y;
          G && G.push(Y), B && B(Y, Z, this), Z += 1, Y = Y.h
        } return G
    }
    j(A) {
      while (!0) {
        let Q = A.o;
        if (Q.p === 0) return;
        let B = Q.o;
        if (Q === B.i) {
          let G = B.h;
          if (G && G.p === 1) {
            if (G.p = Q.p = 0, B === this.v) return;
            B.p = 1, A = B;
            continue
          } else if (A === Q.h) {
            if (A.p = 0, A.i) A.i.o = Q;
            if (A.h) A.h.o = B;
            if (Q.h = A.i, B.i = A.h, A.i = Q, A.h = B, B === this.v) this.v = A, this.C.o = A;
            else {
              let Z = B.o;
              if (Z.i === B) Z.i = A;
              else Z.h = A
            }
            A.o = B.o, Q.o = A, B.o = A, B.p = 1
          } else {
            if (Q.p = 0, B === this.v) this.v = B.g();
            else B.g();
            B.p = 1;
            return
          }
        } else {
          let G = B.i;
          if (G && G.p === 1) {
            if (G.p = Q.p = 0, B === this.v) return;
            B.p = 1, A = B;
            continue
          } else if (A === Q.i) {
            if (A.p = 0, A.i) A.i.o = B;
            if (A.h) A.h.o = Q;
            if (B.h = A.i, Q.i = A.h, A.i = B, A.h = Q, B === this.v) this.v = A, this.C.o = A;
            else {
              let Z = B.o;
              if (Z.i === B) Z.i = A;
              else Z.h = A
            }
            A.o = B.o, Q.o = A, B.o = A, B.p = 1
          } else {
            if (Q.p = 0, B === this.v) this.v = B._();
            else B._();
            B.p = 1;
            return
          }
        }
        if (this.enableIndex) Q.O(), B.O(), A.O();
        return
      }
    }
    q(A, Q, B) {
      if (this.v === void 0) return this.m += 1, this.v = new this.N(A, Q, 0), this.v.o = this.C, this.C.o = this.C.i = this.C.h = this.v, this.m;
      let G, Z = this.C.i,
        Y = this.A(Z.u, A);
      if (Y === 0) return Z.l = Q, this.m;
      else if (Y > 0) Z.i = new this.N(A, Q), Z.i.o = Z, G = Z.i, this.C.i = G;
      else {
        let J = this.C.h,
          X = this.A(J.u, A);
        if (X === 0) return J.l = Q, this.m;
        else if (X < 0) J.h = new this.N(A, Q), J.h.o = J, G = J.h, this.C.h = G;
        else {
          if (B !== void 0) {
            let I = B.T;
            if (I !== this.C) {
              let D = this.A(I.u, A);
              if (D === 0) return I.l = Q, this.m;
              else if (D > 0) {
                let W = I.I(),
                  K = this.A(W.u, A);
                if (K === 0) return W.l = Q, this.m;
                else if (K < 0)
                  if (G = new this.N(A, Q), W.h === void 0) W.h = G, G.o = W;
                  else I.i = G, G.o = I
              }
            }
          }
          if (G === void 0) {
            G = this.v;
            while (!0) {
              let I = this.A(G.u, A);
              if (I > 0) {
                if (G.i === void 0) {
                  G.i = new this.N(A, Q), G.i.o = G, G = G.i;
                  break
                }
                G = G.i
              } else if (I < 0) {
                if (G.h === void 0) {
                  G.h = new this.N(A, Q), G.h.o = G, G = G.h;
                  break
                }
                G = G.h
              } else return G.l = Q, this.m
            }
          }
        }
      }
      if (this.enableIndex) {
        let J = G.o;
        while (J !== this.C) J.M += 1, J = J.o
      }
      return this.j(G), this.m += 1, this.m
    }
    H(A, Q) {
      while (A) {
        let B = this.A(A.u, Q);
        if (B < 0) A = A.h;
        else if (B > 0) A = A.i;
        else return A
      }
      return A || this.C
    }
    clear() {
      this.m = 0, this.v = void 0, this.C.o = void 0, this.C.i = this.C.h = void 0
    }
    updateKeyByIterator(A, Q) {
      let B = A.T;
      if (B === this.C) o4A();
      if (this.m === 1) return B.u = Q, !0;
      let G = B.B().u;
      if (B === this.C.i) {
        if (this.A(G, Q) > 0) return B.u = Q, !0;
        return !1
      }
      let Z = B.I().u;
      if (B === this.C.h) {
        if (this.A(Z, Q) < 0) return B.u = Q, !0;
        return !1
      }
      if (this.A(Z, Q) >= 0 || this.A(G, Q) <= 0) return !1;
      return B.u = Q, !0
    }
    eraseElementByPos(A) {
      if (A < 0 || A > this.m - 1) throw RangeError();
      let Q = this.U(A);
      return this.S(Q), this.m
    }
    eraseElementByKey(A) {
      if (this.m === 0) return !1;
      let Q = this.H(this.v, A);
      if (Q === this.C) return !1;
      return this.S(Q), !0
    }
    eraseElementByIterator(A) {
      let Q = A.T;
      if (Q === this.C) o4A();
      let B = Q.h === void 0;
      if (A.iteratorType === 0) {
        if (B) A.next()
      } else if (!B || Q.i === void 0) A.next();
      return this.S(Q), A
    }
    getHeight() {
      if (this.m === 0) return 0;

      function A(Q) {
        if (!Q) return 0;
        return Math.max(A(Q.i), A(Q.h)) + 1
      }
      return A(this.v)
    }
  }
  class WF2 extends JF2 {
    constructor(A, Q, B) {
      super(B);
      if (this.T = A, this.C = Q, this.iteratorType === 0) this.pre = function () {
        if (this.T === this.C.i) o4A();
        return this.T = this.T.I(), this
      }, this.next = function () {
        if (this.T === this.C) o4A();
        return this.T = this.T.B(), this
      };
      else this.pre = function () {
        if (this.T === this.C.h) o4A();
        return this.T = this.T.B(), this
      }, this.next = function () {
        if (this.T === this.C) o4A();
        return this.T = this.T.I(), this
      }
    }
    get index() {
      let A = this.T,
        Q = this.C.o;
      if (A === this.C) {
        if (Q) return Q.M - 1;
        return 0
      }
      let B = 0;
      if (A.i) B += A.i.M;
      while (A !== Q) {
        let G = A.o;
        if (A === G.h) {
          if (B += 1, G.i) B += G.i.M
        }
        A = G
      }
      return B
    }
    isAccessible() {
      return this.T !== this.C
    }
  }
  class uS extends WF2 {
    constructor(A, Q, B, G) {
      super(A, Q, G);
      this.container = B
    }
    get pointer() {
      if (this.T === this.C) o4A();
      let A = this;
      return new Proxy([], {
        get(Q, B) {
          if (B === "0") return A.T.u;
          else if (B === "1") return A.T.l;
          return Q[0] = A.T.u, Q[1] = A.T.l, Q[B]
        },
        set(Q, B, G) {
          if (B !== "1") throw TypeError("prop must be 1");
          return A.T.l = G, !0
        }
      })
    }
    copy() {
      return new uS(this.T, this.C, this.container, this.iteratorType)
    }
  }
  class KF2 extends DF2 {
    constructor(A = [], Q, B) {
      super(Q, B);
      let G = this;
      A.forEach(function (Z) {
        G.setElement(Z[0], Z[1])
      })
    }
    begin() {
      return new uS(this.C.i || this.C, this.C, this)
    }
    end() {
      return new uS(this.C, this.C, this)
    }
    rBegin() {
      return new uS(this.C.h || this.C, this.C, this, 1)
    }
    rEnd() {
      return new uS(this.C, this.C, this, 1)
    }
    front() {
      if (this.m === 0) return;
      let A = this.C.i;
      return [A.u, A.l]
    }
    back() {
      if (this.m === 0) return;
      let A = this.C.h;
      return [A.u, A.l]
    }
    lowerBound(A) {
      let Q = this.R(this.v, A);
      return new uS(Q, this.C, this)
    }
    upperBound(A) {
      let Q = this.K(this.v, A);
      return new uS(Q, this.C, this)
    }
    reverseLowerBound(A) {
      let Q = this.L(this.v, A);
      return new uS(Q, this.C, this)
    }
    reverseUpperBound(A) {
      let Q = this.k(this.v, A);
      return new uS(Q, this.C, this)
    }
    forEach(A) {
      this.U(function (Q, B, G) {
        A([Q.u, Q.l], B, G)
      })
    }
    setElement(A, Q, B) {
      return this.q(A, Q, B)
    }
    getElementByPos(A) {
      if (A < 0 || A > this.m - 1) throw RangeError();
      let Q = this.U(A);
      return [Q.u, Q.l]
    }
    find(A) {
      let Q = this.H(this.v, A);
      return new uS(Q, this.C, this)
    }
    getElementByKey(A) {
      return this.H(this.v, A).l
    }
    union(A) {
      let Q = this;
      return A.forEach(function (B) {
        Q.setElement(B[0], B[1])
      }), this.m
    }*[Symbol.iterator]() {
      let A = this.m,
        Q = this.U();
      for (let B = 0; B < A; ++B) {
        let G = Q[B];
        yield [G.u, G.l]
      }
    }
  }
  VF2.OrderedMap = KF2
})
// @from(Ln 292178, Col 4)
nJ1 = U((EF2) => {
  Object.defineProperty(EF2, "__esModule", {
    value: !0
  });
  EF2.registerAdminService = yU5;
  EF2.addAdminServicesToServer = vU5;
  var HF2 = [];

  function yU5(A, Q) {
    HF2.push({
      getServiceDefinition: A,
      getHandlers: Q
    })
  }

  function vU5(A) {
    for (let {
        getServiceDefinition: Q,
        getHandlers: B
      }
      of HF2) A.addService(Q(), B())
  }
})
// @from(Ln 292201, Col 4)
wF2 = U((qF2) => {
  Object.defineProperty(qF2, "__esModule", {
    value: !0
  });
  qF2.ClientDuplexStreamImpl = qF2.ClientWritableStreamImpl = qF2.ClientReadableStreamImpl = qF2.ClientUnaryCallImpl = void 0;
  qF2.callErrorFromStatus = hU5;
  var fU5 = NA("events"),
    uK0 = NA("stream"),
    VvA = j8();

  function hU5(A, Q) {
    let B = `${A.code} ${VvA.Status[A.code]}: ${A.details}`,
      Z = `${Error(B).stack}
for call at
${Q}`;
    return Object.assign(Error(B), A, {
      stack: Z
    })
  }
  class zF2 extends fU5.EventEmitter {
    constructor() {
      super()
    }
    cancel() {
      var A;
      (A = this.call) === null || A === void 0 || A.cancelWithStatus(VvA.Status.CANCELLED, "Cancelled on client")
    }
    getPeer() {
      var A, Q;
      return (Q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && Q !== void 0 ? Q : "unknown"
    }
    getAuthContext() {
      var A, Q;
      return (Q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && Q !== void 0 ? Q : null
    }
  }
  qF2.ClientUnaryCallImpl = zF2;
  class $F2 extends uK0.Readable {
    constructor(A) {
      super({
        objectMode: !0
      });
      this.deserialize = A
    }
    cancel() {
      var A;
      (A = this.call) === null || A === void 0 || A.cancelWithStatus(VvA.Status.CANCELLED, "Cancelled on client")
    }
    getPeer() {
      var A, Q;
      return (Q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && Q !== void 0 ? Q : "unknown"
    }
    getAuthContext() {
      var A, Q;
      return (Q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && Q !== void 0 ? Q : null
    }
    _read(A) {
      var Q;
      (Q = this.call) === null || Q === void 0 || Q.startRead()
    }
  }
  qF2.ClientReadableStreamImpl = $F2;
  class CF2 extends uK0.Writable {
    constructor(A) {
      super({
        objectMode: !0
      });
      this.serialize = A
    }
    cancel() {
      var A;
      (A = this.call) === null || A === void 0 || A.cancelWithStatus(VvA.Status.CANCELLED, "Cancelled on client")
    }
    getPeer() {
      var A, Q;
      return (Q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && Q !== void 0 ? Q : "unknown"
    }
    getAuthContext() {
      var A, Q;
      return (Q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && Q !== void 0 ? Q : null
    }
    _write(A, Q, B) {
      var G;
      let Z = {
          callback: B
        },
        Y = Number(Q);
      if (!Number.isNaN(Y)) Z.flags = Y;
      (G = this.call) === null || G === void 0 || G.sendMessageWithContext(Z, A)
    }
    _final(A) {
      var Q;
      (Q = this.call) === null || Q === void 0 || Q.halfClose(), A()
    }
  }
  qF2.ClientWritableStreamImpl = CF2;
  class UF2 extends uK0.Duplex {
    constructor(A, Q) {
      super({
        objectMode: !0
      });
      this.serialize = A, this.deserialize = Q
    }
    cancel() {
      var A;
      (A = this.call) === null || A === void 0 || A.cancelWithStatus(VvA.Status.CANCELLED, "Cancelled on client")
    }
    getPeer() {
      var A, Q;
      return (Q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && Q !== void 0 ? Q : "unknown"
    }
    getAuthContext() {
      var A, Q;
      return (Q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && Q !== void 0 ? Q : null
    }
    _read(A) {
      var Q;
      (Q = this.call) === null || Q === void 0 || Q.startRead()
    }
    _write(A, Q, B) {
      var G;
      let Z = {
          callback: B
        },
        Y = Number(Q);
      if (!Number.isNaN(Y)) Z.flags = Y;
      (G = this.call) === null || G === void 0 || G.sendMessageWithContext(Z, A)
    }
    _final(A) {
      var Q;
      (Q = this.call) === null || Q === void 0 || Q.halfClose(), A()
    }
  }
  qF2.ClientDuplexStreamImpl = UF2
})
// @from(Ln 292336, Col 4)
r4A = U((OF2) => {
  Object.defineProperty(OF2, "__esModule", {
    value: !0
  });
  OF2.InterceptingListenerImpl = void 0;
  OF2.statusOrFromValue = pU5;
  OF2.statusOrFromError = lU5;
  OF2.isInterceptingListener = iU5;
  var cU5 = jF();

  function pU5(A) {
    return {
      ok: !0,
      value: A
    }
  }

  function lU5(A) {
    var Q;
    return {
      ok: !1,
      error: Object.assign(Object.assign({}, A), {
        metadata: (Q = A.metadata) !== null && Q !== void 0 ? Q : new cU5.Metadata
      })
    }
  }

  function iU5(A) {
    return A.onReceiveMetadata !== void 0 && A.onReceiveMetadata.length === 1
  }
  class LF2 {
    constructor(A, Q) {
      this.listener = A, this.nextListener = Q, this.processingMetadata = !1, this.hasPendingMessage = !1, this.processingMessage = !1, this.pendingStatus = null
    }
    processPendingMessage() {
      if (this.hasPendingMessage) this.nextListener.onReceiveMessage(this.pendingMessage), this.pendingMessage = null, this.hasPendingMessage = !1
    }
    processPendingStatus() {
      if (this.pendingStatus) this.nextListener.onReceiveStatus(this.pendingStatus)
    }
    onReceiveMetadata(A) {
      this.processingMetadata = !0, this.listener.onReceiveMetadata(A, (Q) => {
        this.processingMetadata = !1, this.nextListener.onReceiveMetadata(Q), this.processPendingMessage(), this.processPendingStatus()
      })
    }
    onReceiveMessage(A) {
      this.processingMessage = !0, this.listener.onReceiveMessage(A, (Q) => {
        if (this.processingMessage = !1, this.processingMetadata) this.pendingMessage = Q, this.hasPendingMessage = !0;
        else this.nextListener.onReceiveMessage(Q), this.processPendingStatus()
      })
    }
    onReceiveStatus(A) {
      this.listener.onReceiveStatus(A, (Q) => {
        if (this.processingMetadata || this.processingMessage) this.pendingStatus = Q;
        else this.nextListener.onReceiveStatus(Q)
      })
    }
  }
  OF2.InterceptingListenerImpl = LF2
})
// @from(Ln 292396, Col 4)
cK0 = U((vF2) => {
  Object.defineProperty(vF2, "__esModule", {
    value: !0
  });
  vF2.InterceptingCall = vF2.RequesterBuilder = vF2.ListenerBuilder = vF2.InterceptorConfigurationError = void 0;
  vF2.getInterceptingCall = eU5;
  var rU5 = jF(),
    RF2 = r4A(),
    _F2 = j8(),
    jF2 = yJ1();
  class HvA extends Error {
    constructor(A) {
      super(A);
      this.name = "InterceptorConfigurationError", Error.captureStackTrace(this, HvA)
    }
  }
  vF2.InterceptorConfigurationError = HvA;
  class TF2 {
    constructor() {
      this.metadata = void 0, this.message = void 0, this.status = void 0
    }
    withOnReceiveMetadata(A) {
      return this.metadata = A, this
    }
    withOnReceiveMessage(A) {
      return this.message = A, this
    }
    withOnReceiveStatus(A) {
      return this.status = A, this
    }
    build() {
      return {
        onReceiveMetadata: this.metadata,
        onReceiveMessage: this.message,
        onReceiveStatus: this.status
      }
    }
  }
  vF2.ListenerBuilder = TF2;
  class PF2 {
    constructor() {
      this.start = void 0, this.message = void 0, this.halfClose = void 0, this.cancel = void 0
    }
    withStart(A) {
      return this.start = A, this
    }
    withSendMessage(A) {
      return this.message = A, this
    }
    withHalfClose(A) {
      return this.halfClose = A, this
    }
    withCancel(A) {
      return this.cancel = A, this
    }
    build() {
      return {
        start: this.start,
        sendMessage: this.message,
        halfClose: this.halfClose,
        cancel: this.cancel
      }
    }
  }
  vF2.RequesterBuilder = PF2;
  var mK0 = {
      onReceiveMetadata: (A, Q) => {
        Q(A)
      },
      onReceiveMessage: (A, Q) => {
        Q(A)
      },
      onReceiveStatus: (A, Q) => {
        Q(A)
      }
    },
    FvA = {
      start: (A, Q, B) => {
        B(A, Q)
      },
      sendMessage: (A, Q) => {
        Q(A)
      },
      halfClose: (A) => {
        A()
      },
      cancel: (A) => {
        A()
      }
    };
  class SF2 {
    constructor(A, Q) {
      var B, G, Z, Y;
      if (this.nextCall = A, this.processingMetadata = !1, this.pendingMessageContext = null, this.processingMessage = !1, this.pendingHalfClose = !1, Q) this.requester = {
        start: (B = Q.start) !== null && B !== void 0 ? B : FvA.start,
        sendMessage: (G = Q.sendMessage) !== null && G !== void 0 ? G : FvA.sendMessage,
        halfClose: (Z = Q.halfClose) !== null && Z !== void 0 ? Z : FvA.halfClose,
        cancel: (Y = Q.cancel) !== null && Y !== void 0 ? Y : FvA.cancel
      };
      else this.requester = FvA
    }
    cancelWithStatus(A, Q) {
      this.requester.cancel(() => {
        this.nextCall.cancelWithStatus(A, Q)
      })
    }
    getPeer() {
      return this.nextCall.getPeer()
    }
    processPendingMessage() {
      if (this.pendingMessageContext) this.nextCall.sendMessageWithContext(this.pendingMessageContext, this.pendingMessage), this.pendingMessageContext = null, this.pendingMessage = null
    }
    processPendingHalfClose() {
      if (this.pendingHalfClose) this.nextCall.halfClose()
    }
    start(A, Q) {
      var B, G, Z, Y, J, X;
      let I = {
        onReceiveMetadata: (G = (B = Q === null || Q === void 0 ? void 0 : Q.onReceiveMetadata) === null || B === void 0 ? void 0 : B.bind(Q)) !== null && G !== void 0 ? G : (D) => {},
        onReceiveMessage: (Y = (Z = Q === null || Q === void 0 ? void 0 : Q.onReceiveMessage) === null || Z === void 0 ? void 0 : Z.bind(Q)) !== null && Y !== void 0 ? Y : (D) => {},
        onReceiveStatus: (X = (J = Q === null || Q === void 0 ? void 0 : Q.onReceiveStatus) === null || J === void 0 ? void 0 : J.bind(Q)) !== null && X !== void 0 ? X : (D) => {}
      };
      this.processingMetadata = !0, this.requester.start(A, I, (D, W) => {
        var K, V, F;
        this.processingMetadata = !1;
        let H;
        if ((0, RF2.isInterceptingListener)(W)) H = W;
        else {
          let E = {
            onReceiveMetadata: (K = W.onReceiveMetadata) !== null && K !== void 0 ? K : mK0.onReceiveMetadata,
            onReceiveMessage: (V = W.onReceiveMessage) !== null && V !== void 0 ? V : mK0.onReceiveMessage,
            onReceiveStatus: (F = W.onReceiveStatus) !== null && F !== void 0 ? F : mK0.onReceiveStatus
          };
          H = new RF2.InterceptingListenerImpl(E, I)
        }
        this.nextCall.start(D, H), this.processPendingMessage(), this.processPendingHalfClose()
      })
    }
    sendMessageWithContext(A, Q) {
      this.processingMessage = !0, this.requester.sendMessage(Q, (B) => {
        if (this.processingMessage = !1, this.processingMetadata) this.pendingMessageContext = A, this.pendingMessage = Q;
        else this.nextCall.sendMessageWithContext(A, B), this.processPendingHalfClose()
      })
    }
    sendMessage(A) {
      this.sendMessageWithContext({}, A)
    }
    startRead() {
      this.nextCall.startRead()
    }
    halfClose() {
      this.requester.halfClose(() => {
        if (this.processingMetadata || this.processingMessage) this.pendingHalfClose = !0;
        else this.nextCall.halfClose()
      })
    }
    getAuthContext() {
      return this.nextCall.getAuthContext()
    }
  }
  vF2.InterceptingCall = SF2;

  function sU5(A, Q, B) {
    var G, Z;
    let Y = (G = B.deadline) !== null && G !== void 0 ? G : 1 / 0,
      J = B.host,
      X = (Z = B.parent) !== null && Z !== void 0 ? Z : null,
      I = B.propagate_flags,
      D = B.credentials,
      W = A.createCall(Q, Y, J, X, I);
    if (D) W.setCredentials(D);
    return W
  }
  class dK0 {
    constructor(A, Q) {
      this.call = A, this.methodDefinition = Q
    }
    cancelWithStatus(A, Q) {
      this.call.cancelWithStatus(A, Q)
    }
    getPeer() {
      return this.call.getPeer()
    }
    sendMessageWithContext(A, Q) {
      let B;
      try {
        B = this.methodDefinition.requestSerialize(Q)
      } catch (G) {
        this.call.cancelWithStatus(_F2.Status.INTERNAL, `Request message serialization failure: ${(0,jF2.getErrorMessage)(G)}`);
        return
      }
      this.call.sendMessageWithContext(A, B)
    }
    sendMessage(A) {
      this.sendMessageWithContext({}, A)
    }
    start(A, Q) {
      let B = null;
      this.call.start(A, {
        onReceiveMetadata: (G) => {
          var Z;
          (Z = Q === null || Q === void 0 ? void 0 : Q.onReceiveMetadata) === null || Z === void 0 || Z.call(Q, G)
        },
        onReceiveMessage: (G) => {
          var Z;
          let Y;
          try {
            Y = this.methodDefinition.responseDeserialize(G)
          } catch (J) {
            B = {
              code: _F2.Status.INTERNAL,
              details: `Response message parsing error: ${(0,jF2.getErrorMessage)(J)}`,
              metadata: new rU5.Metadata
            }, this.call.cancelWithStatus(B.code, B.details);
            return
          }(Z = Q === null || Q === void 0 ? void 0 : Q.onReceiveMessage) === null || Z === void 0 || Z.call(Q, Y)
        },
        onReceiveStatus: (G) => {
          var Z, Y;
          if (B)(Z = Q === null || Q === void 0 ? void 0 : Q.onReceiveStatus) === null || Z === void 0 || Z.call(Q, B);
          else(Y = Q === null || Q === void 0 ? void 0 : Q.onReceiveStatus) === null || Y === void 0 || Y.call(Q, G)
        }
      })
    }
    startRead() {
      this.call.startRead()
    }
    halfClose() {
      this.call.halfClose()
    }
    getAuthContext() {
      return this.call.getAuthContext()
    }
  }
  class xF2 extends dK0 {
    constructor(A, Q) {
      super(A, Q)
    }
    start(A, Q) {
      var B, G;
      let Z = !1,
        Y = {
          onReceiveMetadata: (G = (B = Q === null || Q === void 0 ? void 0 : Q.onReceiveMetadata) === null || B === void 0 ? void 0 : B.bind(Q)) !== null && G !== void 0 ? G : (J) => {},
          onReceiveMessage: (J) => {
            var X;
            Z = !0, (X = Q === null || Q === void 0 ? void 0 : Q.onReceiveMessage) === null || X === void 0 || X.call(Q, J)
          },
          onReceiveStatus: (J) => {
            var X, I;
            if (!Z)(X = Q === null || Q === void 0 ? void 0 : Q.onReceiveMessage) === null || X === void 0 || X.call(Q, null);
            (I = Q === null || Q === void 0 ? void 0 : Q.onReceiveStatus) === null || I === void 0 || I.call(Q, J)
          }
        };
      super.start(A, Y), this.call.startRead()
    }
  }
  class yF2 extends dK0 {}

  function tU5(A, Q, B) {
    let G = sU5(A, B.path, Q);
    if (B.responseStream) return new yF2(G, B);
    else return new xF2(G, B)
  }

  function eU5(A, Q, B, G) {
    if (A.clientInterceptors.length > 0 && A.clientInterceptorProviders.length > 0) throw new HvA("Both interceptors and interceptor_providers were passed as options to the client constructor. Only one of these is allowed.");
    if (A.callInterceptors.length > 0 && A.callInterceptorProviders.length > 0) throw new HvA("Both interceptors and interceptor_providers were passed as call options. Only one of these is allowed.");
    let Z = [];
    if (A.callInterceptors.length > 0 || A.callInterceptorProviders.length > 0) Z = [].concat(A.callInterceptors, A.callInterceptorProviders.map((X) => X(Q))).filter((X) => X);
    else Z = [].concat(A.clientInterceptors, A.clientInterceptorProviders.map((X) => X(Q))).filter((X) => X);
    let Y = Object.assign({}, B, {
      method_definition: Q
    });
    return Z.reduceRight((X, I) => {
      return (D) => I(D, X)
    }, (X) => tU5(G, X, Q))(Y)
  }
})
// @from(Ln 292674, Col 4)
lK0 = U((fF2) => {
  Object.defineProperty(fF2, "__esModule", {
    value: !0
  });
  fF2.Client = void 0;
  var sb = wF2(),
    Zq5 = iK0(),
    Yq5 = XU(),
    Js = j8(),
    EFA = jF(),
    aJ1 = cK0(),
    mS = Symbol(),
    zFA = Symbol(),
    $FA = Symbol(),
    cd = Symbol();

  function pK0(A) {
    return typeof A === "function"
  }

  function CFA(A) {
    var Q;
    return ((Q = A.stack) === null || Q === void 0 ? void 0 : Q.split(`
`).slice(1).join(`
`)) || "no stack trace available"
  }
  class bF2 {
    constructor(A, Q, B = {}) {
      var G, Z;
      if (B = Object.assign({}, B), this[zFA] = (G = B.interceptors) !== null && G !== void 0 ? G : [], delete B.interceptors, this[$FA] = (Z = B.interceptor_providers) !== null && Z !== void 0 ? Z : [], delete B.interceptor_providers, this[zFA].length > 0 && this[$FA].length > 0) throw Error("Both interceptors and interceptor_providers were passed as options to the client constructor. Only one of these is allowed.");
      if (this[cd] = B.callInvocationTransformer, delete B.callInvocationTransformer, B.channelOverride) this[mS] = B.channelOverride;
      else if (B.channelFactoryOverride) {
        let Y = B.channelFactoryOverride;
        delete B.channelFactoryOverride, this[mS] = Y(A, Q, B)
      } else this[mS] = new Zq5.ChannelImplementation(A, Q, B)
    }
    close() {
      this[mS].close()
    }
    getChannel() {
      return this[mS]
    }
    waitForReady(A, Q) {
      let B = (G) => {
        if (G) {
          Q(Error("Failed to connect before the deadline"));
          return
        }
        let Z;
        try {
          Z = this[mS].getConnectivityState(!0)
        } catch (Y) {
          Q(Error("The channel has been closed"));
          return
        }
        if (Z === Yq5.ConnectivityState.READY) Q();
        else try {
          this[mS].watchConnectivityState(Z, A, B)
        } catch (Y) {
          Q(Error("The channel has been closed"))
        }
      };
      setImmediate(B)
    }
    checkOptionalUnaryResponseArguments(A, Q, B) {
      if (pK0(A)) return {
        metadata: new EFA.Metadata,
        options: {},
        callback: A
      };
      else if (pK0(Q))
        if (A instanceof EFA.Metadata) return {
          metadata: A,
          options: {},
          callback: Q
        };
        else return {
          metadata: new EFA.Metadata,
          options: A,
          callback: Q
        };
      else {
        if (!(A instanceof EFA.Metadata && Q instanceof Object && pK0(B))) throw Error("Incorrect arguments passed");
        return {
          metadata: A,
          options: Q,
          callback: B
        }
      }
    }
    makeUnaryRequest(A, Q, B, G, Z, Y, J) {
      var X, I;
      let D = this.checkOptionalUnaryResponseArguments(Z, Y, J),
        W = {
          path: A,
          requestStream: !1,
          responseStream: !1,
          requestSerialize: Q,
          responseDeserialize: B
        },
        K = {
          argument: G,
          metadata: D.metadata,
          call: new sb.ClientUnaryCallImpl,
          channel: this[mS],
          methodDefinition: W,
          callOptions: D.options,
          callback: D.callback
        };
      if (this[cd]) K = this[cd](K);
      let V = K.call,
        F = {
          clientInterceptors: this[zFA],
          clientInterceptorProviders: this[$FA],
          callInterceptors: (X = K.callOptions.interceptors) !== null && X !== void 0 ? X : [],
          callInterceptorProviders: (I = K.callOptions.interceptor_providers) !== null && I !== void 0 ? I : []
        },
        H = (0, aJ1.getInterceptingCall)(F, K.methodDefinition, K.callOptions, K.channel);
      V.call = H;
      let E = null,
        z = !1,
        $ = Error();
      return H.start(K.metadata, {
        onReceiveMetadata: (O) => {
          V.emit("metadata", O)
        },
        onReceiveMessage(O) {
          if (E !== null) H.cancelWithStatus(Js.Status.UNIMPLEMENTED, "Too many responses received");
          E = O
        },
        onReceiveStatus(O) {
          if (z) return;
          if (z = !0, O.code === Js.Status.OK)
            if (E === null) {
              let L = CFA($);
              K.callback((0, sb.callErrorFromStatus)({
                code: Js.Status.UNIMPLEMENTED,
                details: "No message received",
                metadata: O.metadata
              }, L))
            } else K.callback(null, E);
          else {
            let L = CFA($);
            K.callback((0, sb.callErrorFromStatus)(O, L))
          }
          $ = null, V.emit("status", O)
        }
      }), H.sendMessage(G), H.halfClose(), V
    }
    makeClientStreamRequest(A, Q, B, G, Z, Y) {
      var J, X;
      let I = this.checkOptionalUnaryResponseArguments(G, Z, Y),
        D = {
          path: A,
          requestStream: !0,
          responseStream: !1,
          requestSerialize: Q,
          responseDeserialize: B
        },
        W = {
          metadata: I.metadata,
          call: new sb.ClientWritableStreamImpl(Q),
          channel: this[mS],
          methodDefinition: D,
          callOptions: I.options,
          callback: I.callback
        };
      if (this[cd]) W = this[cd](W);
      let K = W.call,
        V = {
          clientInterceptors: this[zFA],
          clientInterceptorProviders: this[$FA],
          callInterceptors: (J = W.callOptions.interceptors) !== null && J !== void 0 ? J : [],
          callInterceptorProviders: (X = W.callOptions.interceptor_providers) !== null && X !== void 0 ? X : []
        },
        F = (0, aJ1.getInterceptingCall)(V, W.methodDefinition, W.callOptions, W.channel);
      K.call = F;
      let H = null,
        E = !1,
        z = Error();
      return F.start(W.metadata, {
        onReceiveMetadata: ($) => {
          K.emit("metadata", $)
        },
        onReceiveMessage($) {
          if (H !== null) F.cancelWithStatus(Js.Status.UNIMPLEMENTED, "Too many responses received");
          H = $, F.startRead()
        },
        onReceiveStatus($) {
          if (E) return;
          if (E = !0, $.code === Js.Status.OK)
            if (H === null) {
              let O = CFA(z);
              W.callback((0, sb.callErrorFromStatus)({
                code: Js.Status.UNIMPLEMENTED,
                details: "No message received",
                metadata: $.metadata
              }, O))
            } else W.callback(null, H);
          else {
            let O = CFA(z);
            W.callback((0, sb.callErrorFromStatus)($, O))
          }
          z = null, K.emit("status", $)
        }
      }), K
    }
    checkMetadataAndOptions(A, Q) {
      let B, G;
      if (A instanceof EFA.Metadata)
        if (B = A, Q) G = Q;
        else G = {};
      else {
        if (A) G = A;
        else G = {};
        B = new EFA.Metadata
      }
      return {
        metadata: B,
        options: G
      }
    }
    makeServerStreamRequest(A, Q, B, G, Z, Y) {
      var J, X;
      let I = this.checkMetadataAndOptions(Z, Y),
        D = {
          path: A,
          requestStream: !1,
          responseStream: !0,
          requestSerialize: Q,
          responseDeserialize: B
        },
        W = {
          argument: G,
          metadata: I.metadata,
          call: new sb.ClientReadableStreamImpl(B),
          channel: this[mS],
          methodDefinition: D,
          callOptions: I.options
        };
      if (this[cd]) W = this[cd](W);
      let K = W.call,
        V = {
          clientInterceptors: this[zFA],
          clientInterceptorProviders: this[$FA],
          callInterceptors: (J = W.callOptions.interceptors) !== null && J !== void 0 ? J : [],
          callInterceptorProviders: (X = W.callOptions.interceptor_providers) !== null && X !== void 0 ? X : []
        },
        F = (0, aJ1.getInterceptingCall)(V, W.methodDefinition, W.callOptions, W.channel);
      K.call = F;
      let H = !1,
        E = Error();
      return F.start(W.metadata, {
        onReceiveMetadata(z) {
          K.emit("metadata", z)
        },
        onReceiveMessage(z) {
          K.push(z)
        },
        onReceiveStatus(z) {
          if (H) return;
          if (H = !0, K.push(null), z.code !== Js.Status.OK) {
            let $ = CFA(E);
            K.emit("error", (0, sb.callErrorFromStatus)(z, $))
          }
          E = null, K.emit("status", z)
        }
      }), F.sendMessage(G), F.halfClose(), K
    }
    makeBidiStreamRequest(A, Q, B, G, Z) {
      var Y, J;
      let X = this.checkMetadataAndOptions(G, Z),
        I = {
          path: A,
          requestStream: !0,
          responseStream: !0,
          requestSerialize: Q,
          responseDeserialize: B
        },
        D = {
          metadata: X.metadata,
          call: new sb.ClientDuplexStreamImpl(Q, B),
          channel: this[mS],
          methodDefinition: I,
          callOptions: X.options
        };
      if (this[cd]) D = this[cd](D);
      let W = D.call,
        K = {
          clientInterceptors: this[zFA],
          clientInterceptorProviders: this[$FA],
          callInterceptors: (Y = D.callOptions.interceptors) !== null && Y !== void 0 ? Y : [],
          callInterceptorProviders: (J = D.callOptions.interceptor_providers) !== null && J !== void 0 ? J : []
        },
        V = (0, aJ1.getInterceptingCall)(K, D.methodDefinition, D.callOptions, D.channel);
      W.call = V;
      let F = !1,
        H = Error();
      return V.start(D.metadata, {
        onReceiveMetadata(E) {
          W.emit("metadata", E)
        },
        onReceiveMessage(E) {
          W.push(E)
        },
        onReceiveStatus(E) {
          if (F) return;
          if (F = !0, W.push(null), E.code !== Js.Status.OK) {
            let z = CFA(H);
            W.emit("error", (0, sb.callErrorFromStatus)(E, z))
          }
          H = null, W.emit("status", E)
        }
      }), W
    }
  }
  fF2.Client = bF2
})
// @from(Ln 292992, Col 4)
oJ1 = U((uF2) => {
  Object.defineProperty(uF2, "__esModule", {
    value: !0
  });
  uF2.makeClientConstructor = gF2;
  uF2.loadPackageDefinition = Dq5;
  var EvA = lK0(),
    Jq5 = {
      unary: EvA.Client.prototype.makeUnaryRequest,
      server_stream: EvA.Client.prototype.makeServerStreamRequest,
      client_stream: EvA.Client.prototype.makeClientStreamRequest,
      bidi: EvA.Client.prototype.makeBidiStreamRequest
    };

  function nK0(A) {
    return ["__proto__", "prototype", "constructor"].includes(A)
  }

  function gF2(A, Q, B) {
    if (!B) B = {};
    class G extends EvA.Client {}
    return Object.keys(A).forEach((Z) => {
      if (nK0(Z)) return;
      let Y = A[Z],
        J;
      if (typeof Z === "string" && Z.charAt(0) === "$") throw Error("Method names cannot start with $");
      if (Y.requestStream)
        if (Y.responseStream) J = "bidi";
        else J = "client_stream";
      else if (Y.responseStream) J = "server_stream";
      else J = "unary";
      let {
        requestSerialize: X,
        responseDeserialize: I
      } = Y, D = Xq5(Jq5[J], Y.path, X, I);
      if (G.prototype[Z] = D, Object.assign(G.prototype[Z], Y), Y.originalName && !nK0(Y.originalName)) G.prototype[Y.originalName] = G.prototype[Z]
    }), G.service = A, G.serviceName = Q, G
  }

  function Xq5(A, Q, B, G) {
    return function (...Z) {
      return A.call(this, Q, B, G, ...Z)
    }
  }

  function Iq5(A) {
    return "format" in A
  }

  function Dq5(A) {
    let Q = {};
    for (let B in A)
      if (Object.prototype.hasOwnProperty.call(A, B)) {
        let G = A[B],
          Z = B.split(".");
        if (Z.some((X) => nK0(X))) continue;
        let Y = Z[Z.length - 1],
          J = Q;
        for (let X of Z.slice(0, -1)) {
          if (!J[X]) J[X] = {};
          J = J[X]
        }
        if (Iq5(G)) J[Y] = G;
        else J[Y] = gF2(G, Y, {})
      } return Q
  }
})
// @from(Ln 293059, Col 4)
KH2 = U((CSZ, WH2) => {
  var Vq5 = 1 / 0,
    Fq5 = "[object Symbol]",
    Hq5 = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
    Eq5 = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
    sJ1 = "\\ud800-\\udfff",
    aF2 = "\\u0300-\\u036f\\ufe20-\\ufe23",
    oF2 = "\\u20d0-\\u20f0",
    rF2 = "\\u2700-\\u27bf",
    sF2 = "a-z\\xdf-\\xf6\\xf8-\\xff",
    zq5 = "\\xac\\xb1\\xd7\\xf7",
    $q5 = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",
    Cq5 = "\\u2000-\\u206f",
    Uq5 = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
    tF2 = "A-Z\\xc0-\\xd6\\xd8-\\xde",
    eF2 = "\\ufe0e\\ufe0f",
    AH2 = zq5 + $q5 + Cq5 + Uq5,
    oK0 = "['’]",
    qq5 = "[" + sJ1 + "]",
    mF2 = "[" + AH2 + "]",
    rJ1 = "[" + aF2 + oF2 + "]",
    QH2 = "\\d+",
    Nq5 = "[" + rF2 + "]",
    BH2 = "[" + sF2 + "]",
    GH2 = "[^" + sJ1 + AH2 + QH2 + rF2 + sF2 + tF2 + "]",
    aK0 = "\\ud83c[\\udffb-\\udfff]",
    wq5 = "(?:" + rJ1 + "|" + aK0 + ")",
    ZH2 = "[^" + sJ1 + "]",
    rK0 = "(?:\\ud83c[\\udde6-\\uddff]){2}",
    sK0 = "[\\ud800-\\udbff][\\udc00-\\udfff]",
    UFA = "[" + tF2 + "]",
    YH2 = "\\u200d",
    dF2 = "(?:" + BH2 + "|" + GH2 + ")",
    Lq5 = "(?:" + UFA + "|" + GH2 + ")",
    cF2 = "(?:" + oK0 + "(?:d|ll|m|re|s|t|ve))?",
    pF2 = "(?:" + oK0 + "(?:D|LL|M|RE|S|T|VE))?",
    JH2 = wq5 + "?",
    XH2 = "[" + eF2 + "]?",
    Oq5 = "(?:" + YH2 + "(?:" + [ZH2, rK0, sK0].join("|") + ")" + XH2 + JH2 + ")*",
    IH2 = XH2 + JH2 + Oq5,
    Mq5 = "(?:" + [Nq5, rK0, sK0].join("|") + ")" + IH2,
    Rq5 = "(?:" + [ZH2 + rJ1 + "?", rJ1, rK0, sK0, qq5].join("|") + ")",
    _q5 = RegExp(oK0, "g"),
    jq5 = RegExp(rJ1, "g"),
    Tq5 = RegExp(aK0 + "(?=" + aK0 + ")|" + Rq5 + IH2, "g"),
    Pq5 = RegExp([UFA + "?" + BH2 + "+" + cF2 + "(?=" + [mF2, UFA, "$"].join("|") + ")", Lq5 + "+" + pF2 + "(?=" + [mF2, UFA + dF2, "$"].join("|") + ")", UFA + "?" + dF2 + "+" + cF2, UFA + "+" + pF2, QH2, Mq5].join("|"), "g"),
    Sq5 = RegExp("[" + YH2 + sJ1 + aF2 + oF2 + eF2 + "]"),
    xq5 = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
    yq5 = {
      "À": "A",
      "Á": "A",
      "Â": "A",
      "Ã": "A",
      "Ä": "A",
      "Å": "A",
      "à": "a",
      "á": "a",
      "â": "a",
      "ã": "a",
      "ä": "a",
      "å": "a",
      "Ç": "C",
      "ç": "c",
      "Ð": "D",
      "ð": "d",
      "È": "E",
      "É": "E",
      "Ê": "E",
      "Ë": "E",
      "è": "e",
      "é": "e",
      "ê": "e",
      "ë": "e",
      "Ì": "I",
      "Í": "I",
      "Î": "I",
      "Ï": "I",
      "ì": "i",
      "í": "i",
      "î": "i",
      "ï": "i",
      "Ñ": "N",
      "ñ": "n",
      "Ò": "O",
      "Ó": "O",
      "Ô": "O",
      "Õ": "O",
      "Ö": "O",
      "Ø": "O",
      "ò": "o",
      "ó": "o",
      "ô": "o",
      "õ": "o",
      "ö": "o",
      "ø": "o",
      "Ù": "U",
      "Ú": "U",
      "Û": "U",
      "Ü": "U",
      "ù": "u",
      "ú": "u",
      "û": "u",
      "ü": "u",
      "Ý": "Y",
      "ý": "y",
      "ÿ": "y",
      "Æ": "Ae",
      "æ": "ae",
      "Þ": "Th",
      "þ": "th",
      "ß": "ss",
      "Ā": "A",
      "Ă": "A",
      "Ą": "A",
      "ā": "a",
      "ă": "a",
      "ą": "a",
      "Ć": "C",
      "Ĉ": "C",
      "Ċ": "C",
      "Č": "C",
      "ć": "c",
      "ĉ": "c",
      "ċ": "c",
      "č": "c",
      "Ď": "D",
      "Đ": "D",
      "ď": "d",
      "đ": "d",
      "Ē": "E",
      "Ĕ": "E",
      "Ė": "E",
      "Ę": "E",
      "Ě": "E",
      "ē": "e",
      "ĕ": "e",
      "ė": "e",
      "ę": "e",
      "ě": "e",
      "Ĝ": "G",
      "Ğ": "G",
      "Ġ": "G",
      "Ģ": "G",
      "ĝ": "g",
      "ğ": "g",
      "ġ": "g",
      "ģ": "g",
      "Ĥ": "H",
      "Ħ": "H",
      "ĥ": "h",
      "ħ": "h",
      "Ĩ": "I",
      "Ī": "I",
      "Ĭ": "I",
      "Į": "I",
      "İ": "I",
      "ĩ": "i",
      "ī": "i",
      "ĭ": "i",
      "į": "i",
      "ı": "i",
      "Ĵ": "J",
      "ĵ": "j",
      "Ķ": "K",
      "ķ": "k",
      "ĸ": "k",
      "Ĺ": "L",
      "Ļ": "L",
      "Ľ": "L",
      "Ŀ": "L",
      "Ł": "L",
      "ĺ": "l",
      "ļ": "l",
      "ľ": "l",
      "ŀ": "l",
      "ł": "l",
      "Ń": "N",
      "Ņ": "N",
      "Ň": "N",
      "Ŋ": "N",
      "ń": "n",
      "ņ": "n",
      "ň": "n",
      "ŋ": "n",
      "Ō": "O",
      "Ŏ": "O",
      "Ő": "O",
      "ō": "o",
      "ŏ": "o",
      "ő": "o",
      "Ŕ": "R",
      "Ŗ": "R",
      "Ř": "R",
      "ŕ": "r",
      "ŗ": "r",
      "ř": "r",
      "Ś": "S",
      "Ŝ": "S",
      "Ş": "S",
      "Š": "S",
      "ś": "s",
      "ŝ": "s",
      "ş": "s",
      "š": "s",
      "Ţ": "T",
      "Ť": "T",
      "Ŧ": "T",
      "ţ": "t",
      "ť": "t",
      "ŧ": "t",
      "Ũ": "U",
      "Ū": "U",
      "Ŭ": "U",
      "Ů": "U",
      "Ű": "U",
      "Ų": "U",
      "ũ": "u",
      "ū": "u",
      "ŭ": "u",
      "ů": "u",
      "ű": "u",
      "ų": "u",
      "Ŵ": "W",
      "ŵ": "w",
      "Ŷ": "Y",
      "ŷ": "y",
      "Ÿ": "Y",
      "Ź": "Z",
      "Ż": "Z",
      "Ž": "Z",
      "ź": "z",
      "ż": "z",
      "ž": "z",
      "Ĳ": "IJ",
      "ĳ": "ij",
      "Œ": "Oe",
      "œ": "oe",
      "ŉ": "'n",
      "ſ": "ss"
    },
    vq5 = typeof global == "object" && global && global.Object === Object && global,
    kq5 = typeof self == "object" && self && self.Object === Object && self,
    bq5 = vq5 || kq5 || Function("return this")();

  function fq5(A, Q, B, G) {
    var Z = -1,
      Y = A ? A.length : 0;
    if (G && Y) B = A[++Z];
    while (++Z < Y) B = Q(B, A[Z], Z, A);
    return B
  }

  function hq5(A) {
    return A.split("")
  }

  function gq5(A) {
    return A.match(Hq5) || []
  }

  function uq5(A) {
    return function (Q) {
      return A == null ? void 0 : A[Q]
    }
  }
  var mq5 = uq5(yq5);

  function DH2(A) {
    return Sq5.test(A)
  }

  function dq5(A) {
    return xq5.test(A)
  }

  function cq5(A) {
    return DH2(A) ? pq5(A) : hq5(A)
  }

  function pq5(A) {
    return A.match(Tq5) || []
  }

  function lq5(A) {
    return A.match(Pq5) || []
  }
  var iq5 = Object.prototype,
    nq5 = iq5.toString,
    lF2 = bq5.Symbol,
    iF2 = lF2 ? lF2.prototype : void 0,
    nF2 = iF2 ? iF2.toString : void 0;

  function aq5(A, Q, B) {
    var G = -1,
      Z = A.length;
    if (Q < 0) Q = -Q > Z ? 0 : Z + Q;
    if (B = B > Z ? Z : B, B < 0) B += Z;
    Z = Q > B ? 0 : B - Q >>> 0, Q >>>= 0;
    var Y = Array(Z);
    while (++G < Z) Y[G] = A[G + Q];
    return Y
  }

  function oq5(A) {
    if (typeof A == "string") return A;
    if (AN5(A)) return nF2 ? nF2.call(A) : "";
    var Q = A + "";
    return Q == "0" && 1 / A == -Vq5 ? "-0" : Q
  }

  function rq5(A, Q, B) {
    var G = A.length;
    return B = B === void 0 ? G : B, !Q && B >= G ? A : aq5(A, Q, B)
  }

  function sq5(A) {
    return function (Q) {
      Q = tJ1(Q);
      var B = DH2(Q) ? cq5(Q) : void 0,
        G = B ? B[0] : Q.charAt(0),
        Z = B ? rq5(B, 1).join("") : Q.slice(1);
      return G[A]() + Z
    }
  }

  function tq5(A) {
    return function (Q) {
      return fq5(YN5(GN5(Q).replace(_q5, "")), A, "")
    }
  }

  function eq5(A) {
    return !!A && typeof A == "object"
  }

  function AN5(A) {
    return typeof A == "symbol" || eq5(A) && nq5.call(A) == Fq5
  }

  function tJ1(A) {
    return A == null ? "" : oq5(A)
  }
  var QN5 = tq5(function (A, Q, B) {
    return Q = Q.toLowerCase(), A + (B ? BN5(Q) : Q)
  });

  function BN5(A) {
    return ZN5(tJ1(A).toLowerCase())
  }

  function GN5(A) {
    return A = tJ1(A), A && A.replace(Eq5, mq5).replace(jq5, "")
  }
  var ZN5 = sq5("toUpperCase");

  function YN5(A, Q, B) {
    if (A = tJ1(A), Q = B ? void 0 : Q, Q === void 0) return dq5(A) ? lq5(A) : gq5(A);
    return A.match(Q) || []
  }
  WH2.exports = QN5
})
// @from(Ln 293420, Col 4)
FH2 = U((USZ, VH2) => {
  VH2.exports = tK0;

  function tK0(A, Q) {
    if (typeof A === "string") Q = A, A = void 0;
    var B = [];

    function G(Y) {
      if (typeof Y !== "string") {
        var J = Z();
        if (tK0.verbose) console.log("codegen: " + J);
        if (J = "return " + J, Y) {
          var X = Object.keys(Y),
            I = Array(X.length + 1),
            D = Array(X.length),
            W = 0;
          while (W < X.length) I[W] = X[W], D[W] = Y[X[W++]];
          return I[W] = J, Function.apply(null, I).apply(null, D)
        }
        return Function(J)()
      }
      var K = Array(arguments.length - 1),
        V = 0;
      while (V < K.length) K[V] = arguments[++V];
      if (V = 0, Y = Y.replace(/%([%dfijs])/g, function (H, E) {
          var z = K[V++];
          switch (E) {
            case "d":
            case "f":
              return String(Number(z));
            case "i":
              return String(Math.floor(z));
            case "j":
              return JSON.stringify(z);
            case "s":
              return String(z)
          }
          return "%"
        }), V !== K.length) throw Error("parameter count mismatch");
      return B.push(Y), G
    }

    function Z(Y) {
      return "function " + (Y || Q || "") + "(" + (A && A.join(",") || "") + `){
  ` + B.join(`
  `) + `
}`
    }
    return G.toString = Z, G
  }
  tK0.verbose = !1
})
// @from(Ln 293472, Col 4)
EH2 = U((qSZ, HH2) => {
  HH2.exports = zvA;
  var JN5 = vW0(),
    XN5 = fW0(),
    eK0 = XN5("fs");

  function zvA(A, Q, B) {
    if (typeof Q === "function") B = Q, Q = {};
    else if (!Q) Q = {};
    if (!B) return JN5(zvA, this, A, Q);
    if (!Q.xhr && eK0 && eK0.readFile) return eK0.readFile(A, function (Z, Y) {
      return Z && typeof XMLHttpRequest < "u" ? zvA.xhr(A, Q, B) : Z ? B(Z) : B(null, Q.binary ? Y : Y.toString("utf8"))
    });
    return zvA.xhr(A, Q, B)
  }
  zvA.xhr = function (Q, B, G) {
    var Z = new XMLHttpRequest;
    if (Z.onreadystatechange = function () {
        if (Z.readyState !== 4) return;
        if (Z.status !== 0 && Z.status !== 200) return G(Error("status " + Z.status));
        if (B.binary) {
          var J = Z.response;
          if (!J) {
            J = [];
            for (var X = 0; X < Z.responseText.length; ++X) J.push(Z.responseText.charCodeAt(X) & 255)
          }
          return G(null, typeof Uint8Array < "u" ? new Uint8Array(J) : J)
        }
        return G(null, Z.responseText)
      }, B.binary) {
      if ("overrideMimeType" in Z) Z.overrideMimeType("text/plain; charset=x-user-defined");
      Z.responseType = "arraybuffer"
    }
    Z.open("GET", Q), Z.send()
  }
})
// @from(Ln 293508, Col 4)
CH2 = U(($H2) => {
  var QV0 = $H2,
    zH2 = QV0.isAbsolute = function (Q) {
      return /^(?:\/|\w+:)/.test(Q)
    },
    AV0 = QV0.normalize = function (Q) {
      Q = Q.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
      var B = Q.split("/"),
        G = zH2(Q),
        Z = "";
      if (G) Z = B.shift() + "/";
      for (var Y = 0; Y < B.length;)
        if (B[Y] === "..")
          if (Y > 0 && B[Y - 1] !== "..") B.splice(--Y, 2);
          else if (G) B.splice(Y, 1);
      else ++Y;
      else if (B[Y] === ".") B.splice(Y, 1);
      else ++Y;
      return Z + B.join("/")
    };
  QV0.resolve = function (Q, B, G) {
    if (!G) B = AV0(B);
    if (zH2(B)) return B;
    if (!G) Q = AV0(Q);
    return (Q = Q.replace(/(?:\/|^)[^/]+$/, "")).length ? AV0(Q + "/" + B) : B
  }
})
// @from(Ln 293535, Col 4)
NFA = U((wSZ, NH2) => {
  NH2.exports = Y7;
  var eJ1 = Is();
  ((Y7.prototype = Object.create(eJ1.prototype)).constructor = Y7).className = "Namespace";
  var BV0 = Xs(),
    AX1 = TF(),
    IN5 = e4A(),
    s4A, qFA, t4A;
  Y7.fromJSON = function (Q, B) {
    return new Y7(Q, B.options).addJSON(B.nested)
  };

  function UH2(A, Q) {
    if (!(A && A.length)) return;
    var B = {};
    for (var G = 0; G < A.length; ++G) B[A[G].name] = A[G].toJSON(Q);
    return B
  }
  Y7.arrayToJSON = UH2;
  Y7.isReservedId = function (Q, B) {
    if (Q) {
      for (var G = 0; G < Q.length; ++G)
        if (typeof Q[G] !== "string" && Q[G][0] <= B && Q[G][1] > B) return !0
    }
    return !1
  };
  Y7.isReservedName = function (Q, B) {
    if (Q) {
      for (var G = 0; G < Q.length; ++G)
        if (Q[G] === B) return !0
    }
    return !1
  };

  function Y7(A, Q) {
    eJ1.call(this, A, Q), this.nested = void 0, this._nestedArray = null, this._lookupCache = {}, this._needsRecursiveFeatureResolution = !0, this._needsRecursiveResolve = !0
  }

  function qH2(A) {
    A._nestedArray = null, A._lookupCache = {};
    var Q = A;
    while (Q = Q.parent) Q._lookupCache = {};
    return A
  }
  Object.defineProperty(Y7.prototype, "nestedArray", {
    get: function () {
      return this._nestedArray || (this._nestedArray = AX1.toArray(this.nested))
    }
  });
  Y7.prototype.toJSON = function (Q) {
    return AX1.toObject(["options", this.options, "nested", UH2(this.nestedArray, Q)])
  };
  Y7.prototype.addJSON = function (Q) {
    var B = this;
    if (Q)
      for (var G = Object.keys(Q), Z = 0, Y; Z < G.length; ++Z) Y = Q[G[Z]], B.add((Y.fields !== void 0 ? s4A.fromJSON : Y.values !== void 0 ? t4A.fromJSON : Y.methods !== void 0 ? qFA.fromJSON : Y.id !== void 0 ? BV0.fromJSON : Y7.fromJSON)(G[Z], Y));
    return this
  };
  Y7.prototype.get = function (Q) {
    return this.nested && this.nested[Q] || null
  };
  Y7.prototype.getEnum = function (Q) {
    if (this.nested && this.nested[Q] instanceof t4A) return this.nested[Q].values;
    throw Error("no such enum: " + Q)
  };
  Y7.prototype.add = function (Q) {
    if (!(Q instanceof BV0 && Q.extend !== void 0 || Q instanceof s4A || Q instanceof IN5 || Q instanceof t4A || Q instanceof qFA || Q instanceof Y7)) throw TypeError("object must be a valid nested object");
    if (!this.nested) this.nested = {};
    else {
      var B = this.get(Q.name);
      if (B)
        if (B instanceof Y7 && Q instanceof Y7 && !(B instanceof s4A || B instanceof qFA)) {
          var G = B.nestedArray;
          for (var Z = 0; Z < G.length; ++Z) Q.add(G[Z]);
          if (this.remove(B), !this.nested) this.nested = {};
          Q.setOptions(B.options, !0)
        } else throw Error("duplicate name '" + Q.name + "' in " + this)
    }
    if (this.nested[Q.name] = Q, !(this instanceof s4A || this instanceof qFA || this instanceof t4A || this instanceof BV0)) {
      if (!Q._edition) Q._edition = Q._defaultEdition
    }
    this._needsRecursiveFeatureResolution = !0, this._needsRecursiveResolve = !0;
    var Y = this;
    while (Y = Y.parent) Y._needsRecursiveFeatureResolution = !0, Y._needsRecursiveResolve = !0;
    return Q.onAdd(this), qH2(this)
  };
  Y7.prototype.remove = function (Q) {
    if (!(Q instanceof eJ1)) throw TypeError("object must be a ReflectionObject");
    if (Q.parent !== this) throw Error(Q + " is not a member of " + this);
    if (delete this.nested[Q.name], !Object.keys(this.nested).length) this.nested = void 0;
    return Q.onRemove(this), qH2(this)
  };
  Y7.prototype.define = function (Q, B) {
    if (AX1.isString(Q)) Q = Q.split(".");
    else if (!Array.isArray(Q)) throw TypeError("illegal path");
    if (Q && Q.length && Q[0] === "") throw Error("path must be relative");
    var G = this;
    while (Q.length > 0) {
      var Z = Q.shift();
      if (G.nested && G.nested[Z]) {
        if (G = G.nested[Z], !(G instanceof Y7)) throw Error("path conflicts with non-namespace objects")
      } else G.add(G = new Y7(Z))
    }
    if (B) G.addJSON(B);
    return G
  };
  Y7.prototype.resolveAll = function () {
    if (!this._needsRecursiveResolve) return this;
    this._resolveFeaturesRecursive(this._edition);
    var Q = this.nestedArray,
      B = 0;
    this.resolve();
    while (B < Q.length)
      if (Q[B] instanceof Y7) Q[B++].resolveAll();
      else Q[B++].resolve();
    return this._needsRecursiveResolve = !1, this
  };
  Y7.prototype._resolveFeaturesRecursive = function (Q) {
    if (!this._needsRecursiveFeatureResolution) return this;
    return this._needsRecursiveFeatureResolution = !1, Q = this._edition || Q, eJ1.prototype._resolveFeaturesRecursive.call(this, Q), this.nestedArray.forEach((B) => {
      B._resolveFeaturesRecursive(Q)
    }), this
  };
  Y7.prototype.lookup = function (Q, B, G) {
    if (typeof B === "boolean") G = B, B = void 0;
    else if (B && !Array.isArray(B)) B = [B];
    if (AX1.isString(Q) && Q.length) {
      if (Q === ".") return this.root;
      Q = Q.split(".")
    } else if (!Q.length) return this;
    var Z = Q.join(".");
    if (Q[0] === "") return this.root.lookup(Q.slice(1), B);
    var Y = this.root._fullyQualifiedObjects && this.root._fullyQualifiedObjects["." + Z];
    if (Y && (!B || B.indexOf(Y.constructor) > -1)) return Y;
    if (Y = this._lookupImpl(Q, Z), Y && (!B || B.indexOf(Y.constructor) > -1)) return Y;
    if (G) return null;
    var J = this;
    while (J.parent) {
      if (Y = J.parent._lookupImpl(Q, Z), Y && (!B || B.indexOf(Y.constructor) > -1)) return Y;
      J = J.parent
    }
    return null
  };
  Y7.prototype._lookupImpl = function (Q, B) {
    if (Object.prototype.hasOwnProperty.call(this._lookupCache, B)) return this._lookupCache[B];
    var G = this.get(Q[0]),
      Z = null;
    if (G) {
      if (Q.length === 1) Z = G;
      else if (G instanceof Y7) Q = Q.slice(1), Z = G._lookupImpl(Q, Q.join("."))
    } else
      for (var Y = 0; Y < this.nestedArray.length; ++Y)
        if (this._nestedArray[Y] instanceof Y7 && (G = this._nestedArray[Y]._lookupImpl(Q, B))) Z = G;
    return this._lookupCache[B] = Z, Z
  };
  Y7.prototype.lookupType = function (Q) {
    var B = this.lookup(Q, [s4A]);
    if (!B) throw Error("no such type: " + Q);
    return B
  };
  Y7.prototype.lookupEnum = function (Q) {
    var B = this.lookup(Q, [t4A]);
    if (!B) throw Error("no such Enum '" + Q + "' in " + this);
    return B
  };
  Y7.prototype.lookupTypeOrEnum = function (Q) {
    var B = this.lookup(Q, [s4A, t4A]);
    if (!B) throw Error("no such Type or Enum '" + Q + "' in " + this);
    return B
  };
  Y7.prototype.lookupService = function (Q) {
    var B = this.lookup(Q, [qFA]);
    if (!B) throw Error("no such Service '" + Q + "' in " + this);
    return B
  };
  Y7._configure = function (A, Q, B) {
    s4A = A, qFA = Q, t4A = B
  }
})
// @from(Ln 293714, Col 4)
QX1 = U((LSZ, wH2) => {
  wH2.exports = pd;
  var GV0 = Xs();
  ((pd.prototype = Object.create(GV0.prototype)).constructor = pd).className = "MapField";
  var DN5 = A6A(),
    $vA = TF();

  function pd(A, Q, B, G, Z, Y) {
    if (GV0.call(this, A, Q, G, void 0, void 0, Z, Y), !$vA.isString(B)) throw TypeError("keyType must be a string");
    this.keyType = B, this.resolvedKeyType = null, this.map = !0
  }
  pd.fromJSON = function (Q, B) {
    return new pd(Q, B.id, B.keyType, B.type, B.options, B.comment)
  };
  pd.prototype.toJSON = function (Q) {
    var B = Q ? Boolean(Q.keepComments) : !1;
    return $vA.toObject(["keyType", this.keyType, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", B ? this.comment : void 0])
  };
  pd.prototype.resolve = function () {
    if (this.resolved) return this;
    if (DN5.mapKey[this.keyType] === void 0) throw Error("invalid key type: " + this.keyType);
    return GV0.prototype.resolve.call(this)
  };
  pd.d = function (Q, B, G) {
    if (typeof G === "function") G = $vA.decorateType(G).name;
    else if (G && typeof G === "object") G = $vA.decorateEnum(G).name;
    return function (Y, J) {
      $vA.decorateType(Y.constructor).add(new pd(J, Q, B, G))
    }
  }
})
// @from(Ln 293745, Col 4)
BX1 = U((OSZ, LH2) => {
  LH2.exports = Q6A;
  var ZV0 = Is();
  ((Q6A.prototype = Object.create(ZV0.prototype)).constructor = Q6A).className = "Method";
  var wFA = TF();

  function Q6A(A, Q, B, G, Z, Y, J, X, I) {
    if (wFA.isObject(Z)) J = Z, Z = Y = void 0;
    else if (wFA.isObject(Y)) J = Y, Y = void 0;
    if (!(Q === void 0 || wFA.isString(Q))) throw TypeError("type must be a string");
    if (!wFA.isString(B)) throw TypeError("requestType must be a string");
    if (!wFA.isString(G)) throw TypeError("responseType must be a string");
    ZV0.call(this, A, J), this.type = Q || "rpc", this.requestType = B, this.requestStream = Z ? !0 : void 0, this.responseType = G, this.responseStream = Y ? !0 : void 0, this.resolvedRequestType = null, this.resolvedResponseType = null, this.comment = X, this.parsedOptions = I
  }
  Q6A.fromJSON = function (Q, B) {
    return new Q6A(Q, B.type, B.requestType, B.responseType, B.requestStream, B.responseStream, B.options, B.comment, B.parsedOptions)
  };
  Q6A.prototype.toJSON = function (Q) {
    var B = Q ? Boolean(Q.keepComments) : !1;
    return wFA.toObject(["type", this.type !== "rpc" && this.type || void 0, "requestType", this.requestType, "requestStream", this.requestStream, "responseType", this.responseType, "responseStream", this.responseStream, "options", this.options, "comment", B ? this.comment : void 0, "parsedOptions", this.parsedOptions])
  };
  Q6A.prototype.resolve = function () {
    if (this.resolved) return this;
    return this.resolvedRequestType = this.parent.lookupType(this.requestType), this.resolvedResponseType = this.parent.lookupType(this.responseType), ZV0.prototype.resolve.call(this)
  }
})
// @from(Ln 293771, Col 4)
GX1 = U((MSZ, MH2) => {
  MH2.exports = $O;
  var ld = NFA();
  (($O.prototype = Object.create(ld.prototype)).constructor = $O).className = "Service";
  var YV0 = BX1(),
    CvA = TF(),
    WN5 = oW0();

  function $O(A, Q) {
    ld.call(this, A, Q), this.methods = {}, this._methodsArray = null
  }
  $O.fromJSON = function (Q, B) {
    var G = new $O(Q, B.options);
    if (B.methods)
      for (var Z = Object.keys(B.methods), Y = 0; Y < Z.length; ++Y) G.add(YV0.fromJSON(Z[Y], B.methods[Z[Y]]));
    if (B.nested) G.addJSON(B.nested);
    if (B.edition) G._edition = B.edition;
    return G.comment = B.comment, G._defaultEdition = "proto3", G
  };
  $O.prototype.toJSON = function (Q) {
    var B = ld.prototype.toJSON.call(this, Q),
      G = Q ? Boolean(Q.keepComments) : !1;
    return CvA.toObject(["edition", this._editionToJSON(), "options", B && B.options || void 0, "methods", ld.arrayToJSON(this.methodsArray, Q) || {}, "nested", B && B.nested || void 0, "comment", G ? this.comment : void 0])
  };
  Object.defineProperty($O.prototype, "methodsArray", {
    get: function () {
      return this._methodsArray || (this._methodsArray = CvA.toArray(this.methods))
    }
  });

  function OH2(A) {
    return A._methodsArray = null, A
  }
  $O.prototype.get = function (Q) {
    return this.methods[Q] || ld.prototype.get.call(this, Q)
  };
  $O.prototype.resolveAll = function () {
    if (!this._needsRecursiveResolve) return this;
    ld.prototype.resolve.call(this);
    var Q = this.methodsArray;
    for (var B = 0; B < Q.length; ++B) Q[B].resolve();
    return this
  };
  $O.prototype._resolveFeaturesRecursive = function (Q) {
    if (!this._needsRecursiveFeatureResolution) return this;
    return Q = this._edition || Q, ld.prototype._resolveFeaturesRecursive.call(this, Q), this.methodsArray.forEach((B) => {
      B._resolveFeaturesRecursive(Q)
    }), this
  };
  $O.prototype.add = function (Q) {
    if (this.get(Q.name)) throw Error("duplicate name '" + Q.name + "' in " + this);
    if (Q instanceof YV0) return this.methods[Q.name] = Q, Q.parent = this, OH2(this);
    return ld.prototype.add.call(this, Q)
  };
  $O.prototype.remove = function (Q) {
    if (Q instanceof YV0) {
      if (this.methods[Q.name] !== Q) throw Error(Q + " is not a member of " + this);
      return delete this.methods[Q.name], Q.parent = null, OH2(this)
    }
    return ld.prototype.remove.call(this, Q)
  };
  $O.prototype.create = function (Q, B, G) {
    var Z = new WN5.Service(Q, B, G);
    for (var Y = 0, J; Y < this.methodsArray.length; ++Y) {
      var X = CvA.lcFirst((J = this._methodsArray[Y]).resolve().name).replace(/[^$\w_]/g, "");
      Z[X] = CvA.codegen(["r", "c"], CvA.isReserved(X) ? X + "_" : X)("return this.rpcCall(m,q,s,r,c)")({
        m: J,
        q: J.resolvedRequestType.ctor,
        s: J.resolvedResponseType.ctor
      })
    }
    return Z
  }
})
// @from(Ln 293845, Col 4)
ZX1 = U((RSZ, RH2) => {
  RH2.exports = tb;
  var KN5 = nb();

  function tb(A) {
    if (A)
      for (var Q = Object.keys(A), B = 0; B < Q.length; ++B) this[Q[B]] = A[Q[B]]
  }
  tb.create = function (Q) {
    return this.$type.create(Q)
  };
  tb.encode = function (Q, B) {
    return this.$type.encode(Q, B)
  };
  tb.encodeDelimited = function (Q, B) {
    return this.$type.encodeDelimited(Q, B)
  };
  tb.decode = function (Q) {
    return this.$type.decode(Q)
  };
  tb.decodeDelimited = function (Q) {
    return this.$type.decodeDelimited(Q)
  };
  tb.verify = function (Q) {
    return this.$type.verify(Q)
  };
  tb.fromObject = function (Q) {
    return this.$type.fromObject(Q)
  };
  tb.toObject = function (Q, B) {
    return this.$type.toObject(Q, B)
  };
  tb.prototype.toJSON = function () {
    return this.$type.toObject(this, KN5.toJSONOptions)
  }
})
// @from(Ln 293881, Col 4)
JV0 = U((_SZ, jH2) => {
  jH2.exports = HN5;
  var VN5 = dS(),
    id = A6A(),
    _H2 = TF();

  function FN5(A) {
    return "missing required '" + A.name + "'"
  }

  function HN5(A) {
    var Q = _H2.codegen(["r", "l", "e"], A.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (A.fieldsArray.filter(function (X) {
        return X.map
      }).length ? ",k,value" : ""))("while(r.pos<c){")("var t=r.uint32()")("if(t===e)")("break")("switch(t>>>3){"),
      B = 0;
    for (; B < A.fieldsArray.length; ++B) {
      var G = A._fieldsArray[B].resolve(),
        Z = G.resolvedType instanceof VN5 ? "int32" : G.type,
        Y = "m" + _H2.safeProp(G.name);
      if (Q("case %i: {", G.id), G.map) {
        if (Q("if(%s===util.emptyObject)", Y)("%s={}", Y)("var c2 = r.uint32()+r.pos"), id.defaults[G.keyType] !== void 0) Q("k=%j", id.defaults[G.keyType]);
        else Q("k=null");
        if (id.defaults[Z] !== void 0) Q("value=%j", id.defaults[Z]);
        else Q("value=null");
        if (Q("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break", G.keyType)("case 2:"), id.basic[Z] === void 0) Q("value=types[%i].decode(r,r.uint32())", B);
        else Q("value=r.%s()", Z);
        if (Q("break")("default:")("r.skipType(tag2&7)")("break")("}")("}"), id.long[G.keyType] !== void 0) Q('%s[typeof k==="object"?util.longToHash(k):k]=value', Y);
        else Q("%s[k]=value", Y)
      } else if (G.repeated) {
        if (Q("if(!(%s&&%s.length))", Y, Y)("%s=[]", Y), id.packed[Z] !== void 0) Q("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", Y, Z)("}else");
        if (id.basic[Z] === void 0) Q(G.delimited ? "%s.push(types[%i].decode(r,undefined,((t&~7)|4)))" : "%s.push(types[%i].decode(r,r.uint32()))", Y, B);
        else Q("%s.push(r.%s())", Y, Z)
      } else if (id.basic[Z] === void 0) Q(G.delimited ? "%s=types[%i].decode(r,undefined,((t&~7)|4))" : "%s=types[%i].decode(r,r.uint32())", Y, B);
      else Q("%s=r.%s()", Y, Z);
      Q("break")("}")
    }
    Q("default:")("r.skipType(t&7)")("break")("}")("}");
    for (B = 0; B < A._fieldsArray.length; ++B) {
      var J = A._fieldsArray[B];
      if (J.required) Q("if(!m.hasOwnProperty(%j))", J.name)("throw util.ProtocolError(%j,{instance:m})", FN5(J))
    }
    return Q("return m")
  }
})
// @from(Ln 293925, Col 4)
DV0 = U((jSZ, TH2) => {
  TH2.exports = $N5;
  var EN5 = dS(),
    XV0 = TF();

  function r_(A, Q) {
    return A.name + ": " + Q + (A.repeated && Q !== "array" ? "[]" : A.map && Q !== "object" ? "{k:" + A.keyType + "}" : "") + " expected"
  }

  function IV0(A, Q, B, G) {
    if (Q.resolvedType)
      if (Q.resolvedType instanceof EN5) {
        A("switch(%s){", G)("default:")("return%j", r_(Q, "enum value"));
        for (var Z = Object.keys(Q.resolvedType.values), Y = 0; Y < Z.length; ++Y) A("case %i:", Q.resolvedType.values[Z[Y]]);
        A("break")("}")
      } else A("{")("var e=types[%i].verify(%s);", B, G)("if(e)")("return%j+e", Q.name + ".")("}");
    else switch (Q.type) {
      case "int32":
      case "uint32":
      case "sint32":
      case "fixed32":
      case "sfixed32":
        A("if(!util.isInteger(%s))", G)("return%j", r_(Q, "integer"));
        break;
      case "int64":
      case "uint64":
      case "sint64":
      case "fixed64":
      case "sfixed64":
        A("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", G, G, G, G)("return%j", r_(Q, "integer|Long"));
        break;
      case "float":
      case "double":
        A('if(typeof %s!=="number")', G)("return%j", r_(Q, "number"));
        break;
      case "bool":
        A('if(typeof %s!=="boolean")', G)("return%j", r_(Q, "boolean"));
        break;
      case "string":
        A("if(!util.isString(%s))", G)("return%j", r_(Q, "string"));
        break;
      case "bytes":
        A('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', G, G, G)("return%j", r_(Q, "buffer"));
        break
    }
    return A
  }

  function zN5(A, Q, B) {
    switch (Q.keyType) {
      case "int32":
      case "uint32":
      case "sint32":
      case "fixed32":
      case "sfixed32":
        A("if(!util.key32Re.test(%s))", B)("return%j", r_(Q, "integer key"));
        break;
      case "int64":
      case "uint64":
      case "sint64":
      case "fixed64":
      case "sfixed64":
        A("if(!util.key64Re.test(%s))", B)("return%j", r_(Q, "integer|Long key"));
        break;
      case "bool":
        A("if(!util.key2Re.test(%s))", B)("return%j", r_(Q, "boolean key"));
        break
    }
    return A
  }

  function $N5(A) {
    var Q = XV0.codegen(["m"], A.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected"),
      B = A.oneofsArray,
      G = {};
    if (B.length) Q("var p={}");
    for (var Z = 0; Z < A.fieldsArray.length; ++Z) {
      var Y = A._fieldsArray[Z].resolve(),
        J = "m" + XV0.safeProp(Y.name);
      if (Y.optional) Q("if(%s!=null&&m.hasOwnProperty(%j)){", J, Y.name);
      if (Y.map) Q("if(!util.isObject(%s))", J)("return%j", r_(Y, "object"))("var k=Object.keys(%s)", J)("for(var i=0;i<k.length;++i){"), zN5(Q, Y, "k[i]"), IV0(Q, Y, Z, J + "[k[i]]")("}");
      else if (Y.repeated) Q("if(!Array.isArray(%s))", J)("return%j", r_(Y, "array"))("for(var i=0;i<%s.length;++i){", J), IV0(Q, Y, Z, J + "[i]")("}");
      else {
        if (Y.partOf) {
          var X = XV0.safeProp(Y.partOf.name);
          if (G[Y.partOf.name] === 1) Q("if(p%s===1)", X)("return%j", Y.partOf.name + ": multiple values");
          G[Y.partOf.name] = 1, Q("p%s=1", X)
        }
        IV0(Q, Y, Z, J)
      }
      if (Y.optional) Q("}")
    }
    return Q("return null")
  }
})
// @from(Ln 294020, Col 4)
VV0 = U((SH2) => {
  var PH2 = SH2,
    UvA = dS(),
    eb = TF();

  function WV0(A, Q, B, G) {
    var Z = !1;
    if (Q.resolvedType)
      if (Q.resolvedType instanceof UvA) {
        A("switch(d%s){", G);
        for (var Y = Q.resolvedType.values, J = Object.keys(Y), X = 0; X < J.length; ++X) {
          if (Y[J[X]] === Q.typeDefault && !Z) {
            if (A("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}', G, G, G), !Q.repeated) A("break");
            Z = !0
          }
          A("case%j:", J[X])("case %i:", Y[J[X]])("m%s=%j", G, Y[J[X]])("break")
        }
        A("}")
      } else A('if(typeof d%s!=="object")', G)("throw TypeError(%j)", Q.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", G, B, G);
    else {
      var I = !1;
      switch (Q.type) {
        case "double":
        case "float":
          A("m%s=Number(d%s)", G, G);
          break;
        case "uint32":
        case "fixed32":
          A("m%s=d%s>>>0", G, G);
          break;
        case "int32":
        case "sint32":
        case "sfixed32":
          A("m%s=d%s|0", G, G);
          break;
        case "uint64":
          I = !0;
        case "int64":
        case "sint64":
        case "fixed64":
        case "sfixed64":
          A("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", G, G, I)('else if(typeof d%s==="string")', G)("m%s=parseInt(d%s,10)", G, G)('else if(typeof d%s==="number")', G)("m%s=d%s", G, G)('else if(typeof d%s==="object")', G)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", G, G, G, I ? "true" : "");
          break;
        case "bytes":
          A('if(typeof d%s==="string")', G)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", G, G, G)("else if(d%s.length >= 0)", G)("m%s=d%s", G, G);
          break;
        case "string":
          A("m%s=String(d%s)", G, G);
          break;
        case "bool":
          A("m%s=Boolean(d%s)", G, G);
          break
      }
    }
    return A
  }
  PH2.fromObject = function (Q) {
    var B = Q.fieldsArray,
      G = eb.codegen(["d"], Q.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
    if (!B.length) return G("return new this.ctor");
    G("var m=new this.ctor");
    for (var Z = 0; Z < B.length; ++Z) {
      var Y = B[Z].resolve(),
        J = eb.safeProp(Y.name);
      if (Y.map) G("if(d%s){", J)('if(typeof d%s!=="object")', J)("throw TypeError(%j)", Y.fullName + ": object expected")("m%s={}", J)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", J), WV0(G, Y, Z, J + "[ks[i]]")("}")("}");
      else if (Y.repeated) G("if(d%s){", J)("if(!Array.isArray(d%s))", J)("throw TypeError(%j)", Y.fullName + ": array expected")("m%s=[]", J)("for(var i=0;i<d%s.length;++i){", J), WV0(G, Y, Z, J + "[i]")("}")("}");
      else {
        if (!(Y.resolvedType instanceof UvA)) G("if(d%s!=null){", J);
        if (WV0(G, Y, Z, J), !(Y.resolvedType instanceof UvA)) G("}")
      }
    }
    return G("return m")
  };

  function KV0(A, Q, B, G) {
    if (Q.resolvedType)
      if (Q.resolvedType instanceof UvA) A("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", G, B, G, G, B, G, G);
      else A("d%s=types[%i].toObject(m%s,o)", G, B, G);
    else {
      var Z = !1;
      switch (Q.type) {
        case "double":
        case "float":
          A("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", G, G, G, G);
          break;
        case "uint64":
          Z = !0;
        case "int64":
        case "sint64":
        case "fixed64":
        case "sfixed64":
          A('if(typeof m%s==="number")', G)("d%s=o.longs===String?String(m%s):m%s", G, G, G)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", G, G, G, G, Z ? "true" : "", G);
          break;
        case "bytes":
          A("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", G, G, G, G, G);
          break;
        default:
          A("d%s=m%s", G, G);
          break
      }
    }
    return A
  }
  PH2.toObject = function (Q) {
    var B = Q.fieldsArray.slice().sort(eb.compareFieldsById);
    if (!B.length) return eb.codegen()("return {}");
    var G = eb.codegen(["m", "o"], Q.name + "$toObject")("if(!o)")("o={}")("var d={}"),
      Z = [],
      Y = [],
      J = [],
      X = 0;
    for (; X < B.length; ++X)
      if (!B[X].partOf)(B[X].resolve().repeated ? Z : B[X].map ? Y : J).push(B[X]);
    if (Z.length) {
      G("if(o.arrays||o.defaults){");
      for (X = 0; X < Z.length; ++X) G("d%s=[]", eb.safeProp(Z[X].name));
      G("}")
    }
    if (Y.length) {
      G("if(o.objects||o.defaults){");
      for (X = 0; X < Y.length; ++X) G("d%s={}", eb.safeProp(Y[X].name));
      G("}")
    }
    if (J.length) {
      G("if(o.defaults){");
      for (X = 0; X < J.length; ++X) {
        var I = J[X],
          D = eb.safeProp(I.name);
        if (I.resolvedType instanceof UvA) G("d%s=o.enums===String?%j:%j", D, I.resolvedType.valuesById[I.typeDefault], I.typeDefault);
        else if (I.long) G("if(util.Long){")("var n=new util.Long(%i,%i,%j)", I.typeDefault.low, I.typeDefault.high, I.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", D)("}else")("d%s=o.longs===String?%j:%i", D, I.typeDefault.toString(), I.typeDefault.toNumber());
        else if (I.bytes) {
          var W = "[" + Array.prototype.slice.call(I.typeDefault).join(",") + "]";
          G("if(o.bytes===String)d%s=%j", D, String.fromCharCode.apply(String, I.typeDefault))("else{")("d%s=%s", D, W)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", D, D)("}")
        } else G("d%s=%j", D, I.typeDefault)
      }
      G("}")
    }
    var K = !1;
    for (X = 0; X < B.length; ++X) {
      var I = B[X],
        V = Q._fieldsArray.indexOf(I),
        D = eb.safeProp(I.name);
      if (I.map) {
        if (!K) K = !0, G("var ks2");
        G("if(m%s&&(ks2=Object.keys(m%s)).length){", D, D)("d%s={}", D)("for(var j=0;j<ks2.length;++j){"), KV0(G, I, V, D + "[ks2[j]]")("}")
      } else if (I.repeated) G("if(m%s&&m%s.length){", D, D)("d%s=[]", D)("for(var j=0;j<m%s.length;++j){", D), KV0(G, I, V, D + "[j]")("}");
      else if (G("if(m%s!=null&&m.hasOwnProperty(%j)){", D, I.name), KV0(G, I, V, D), I.partOf) G("if(o.oneofs)")("d%s=%j", eb.safeProp(I.partOf.name), I.name);
      G("}")
    }
    return G("return d")
  }
})
// @from(Ln 294172, Col 4)
FV0 = U((xH2) => {
  var CN5 = xH2,
    UN5 = ZX1();
  CN5[".google.protobuf.Any"] = {
    fromObject: function (A) {
      if (A && A["@type"]) {
        var Q = A["@type"].substring(A["@type"].lastIndexOf("/") + 1),
          B = this.lookup(Q);
        if (B) {
          var G = A["@type"].charAt(0) === "." ? A["@type"].slice(1) : A["@type"];
          if (G.indexOf("/") === -1) G = "/" + G;
          return this.create({
            type_url: G,
            value: B.encode(B.fromObject(A)).finish()
          })
        }
      }
      return this.fromObject(A)
    },
    toObject: function (A, Q) {
      var B = "type.googleapis.com/",
        G = "",
        Z = "";
      if (Q && Q.json && A.type_url && A.value) {
        Z = A.type_url.substring(A.type_url.lastIndexOf("/") + 1), G = A.type_url.substring(0, A.type_url.lastIndexOf("/") + 1);
        var Y = this.lookup(Z);
        if (Y) A = Y.decode(A.value)
      }
      if (!(A instanceof this.ctor) && A instanceof UN5) {
        var J = A.$type.toObject(A, Q),
          X = A.$type.fullName[0] === "." ? A.$type.fullName.slice(1) : A.$type.fullName;
        if (G === "") G = B;
        return Z = G + X, J["@type"] = Z, J
      }
      return this.toObject(A, Q)
    }
  }
})
// @from(Ln 294210, Col 4)
XX1 = U((SSZ, vH2) => {
  vH2.exports = KY;
  var s_ = NFA();
  ((KY.prototype = Object.create(s_.prototype)).constructor = KY).className = "Type";
  var qN5 = dS(),
    zV0 = e4A(),
    YX1 = Xs(),
    NN5 = QX1(),
    wN5 = GX1(),
    HV0 = ZX1(),
    EV0 = OJ1(),
    LN5 = wJ1(),
    rz = TF(),
    ON5 = $V0(),
    MN5 = JV0(),
    RN5 = DV0(),
    yH2 = VV0(),
    _N5 = FV0();

  function KY(A, Q) {
    s_.call(this, A, Q), this.fields = {}, this.oneofs = void 0, this.extensions = void 0, this.reserved = void 0, this.group = void 0, this._fieldsById = null, this._fieldsArray = null, this._oneofsArray = null, this._ctor = null
  }
  Object.defineProperties(KY.prototype, {
    fieldsById: {
      get: function () {
        if (this._fieldsById) return this._fieldsById;
        this._fieldsById = {};
        for (var A = Object.keys(this.fields), Q = 0; Q < A.length; ++Q) {
          var B = this.fields[A[Q]],
            G = B.id;
          if (this._fieldsById[G]) throw Error("duplicate id " + G + " in " + this);
          this._fieldsById[G] = B
        }
        return this._fieldsById
      }
    },
    fieldsArray: {
      get: function () {
        return this._fieldsArray || (this._fieldsArray = rz.toArray(this.fields))
      }
    },
    oneofsArray: {
      get: function () {
        return this._oneofsArray || (this._oneofsArray = rz.toArray(this.oneofs))
      }
    },
    ctor: {
      get: function () {
        return this._ctor || (this.ctor = KY.generateConstructor(this)())
      },
      set: function (A) {
        var Q = A.prototype;
        if (!(Q instanceof HV0))(A.prototype = new HV0).constructor = A, rz.merge(A.prototype, Q);
        A.$type = A.prototype.$type = this, rz.merge(A, HV0, !0), this._ctor = A;
        var B = 0;
        for (; B < this.fieldsArray.length; ++B) this._fieldsArray[B].resolve();
        var G = {};
        for (B = 0; B < this.oneofsArray.length; ++B) G[this._oneofsArray[B].resolve().name] = {
          get: rz.oneOfGetter(this._oneofsArray[B].oneof),
          set: rz.oneOfSetter(this._oneofsArray[B].oneof)
        };
        if (B) Object.defineProperties(A.prototype, G)
      }
    }
  });
  KY.generateConstructor = function (Q) {
    var B = rz.codegen(["p"], Q.name);
    for (var G = 0, Z; G < Q.fieldsArray.length; ++G)
      if ((Z = Q._fieldsArray[G]).map) B("this%s={}", rz.safeProp(Z.name));
      else if (Z.repeated) B("this%s=[]", rz.safeProp(Z.name));
    return B("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]")
  };

  function JX1(A) {
    return A._fieldsById = A._fieldsArray = A._oneofsArray = null, delete A.encode, delete A.decode, delete A.verify, A
  }
  KY.fromJSON = function (Q, B) {
    var G = new KY(Q, B.options);
    G.extensions = B.extensions, G.reserved = B.reserved;
    var Z = Object.keys(B.fields),
      Y = 0;
    for (; Y < Z.length; ++Y) G.add((typeof B.fields[Z[Y]].keyType < "u" ? NN5.fromJSON : YX1.fromJSON)(Z[Y], B.fields[Z[Y]]));
    if (B.oneofs)
      for (Z = Object.keys(B.oneofs), Y = 0; Y < Z.length; ++Y) G.add(zV0.fromJSON(Z[Y], B.oneofs[Z[Y]]));
    if (B.nested)
      for (Z = Object.keys(B.nested), Y = 0; Y < Z.length; ++Y) {
        var J = B.nested[Z[Y]];
        G.add((J.id !== void 0 ? YX1.fromJSON : J.fields !== void 0 ? KY.fromJSON : J.values !== void 0 ? qN5.fromJSON : J.methods !== void 0 ? wN5.fromJSON : s_.fromJSON)(Z[Y], J))
      }
    if (B.extensions && B.extensions.length) G.extensions = B.extensions;
    if (B.reserved && B.reserved.length) G.reserved = B.reserved;
    if (B.group) G.group = !0;
    if (B.comment) G.comment = B.comment;
    if (B.edition) G._edition = B.edition;
    return G._defaultEdition = "proto3", G
  };
  KY.prototype.toJSON = function (Q) {
    var B = s_.prototype.toJSON.call(this, Q),
      G = Q ? Boolean(Q.keepComments) : !1;
    return rz.toObject(["edition", this._editionToJSON(), "options", B && B.options || void 0, "oneofs", s_.arrayToJSON(this.oneofsArray, Q), "fields", s_.arrayToJSON(this.fieldsArray.filter(function (Z) {
      return !Z.declaringField
    }), Q) || {}, "extensions", this.extensions && this.extensions.length ? this.extensions : void 0, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "group", this.group || void 0, "nested", B && B.nested || void 0, "comment", G ? this.comment : void 0])
  };
  KY.prototype.resolveAll = function () {
    if (!this._needsRecursiveResolve) return this;
    s_.prototype.resolveAll.call(this);
    var Q = this.oneofsArray;
    G = 0;
    while (G < Q.length) Q[G++].resolve();
    var B = this.fieldsArray,
      G = 0;
    while (G < B.length) B[G++].resolve();
    return this
  };
  KY.prototype._resolveFeaturesRecursive = function (Q) {
    if (!this._needsRecursiveFeatureResolution) return this;
    return Q = this._edition || Q, s_.prototype._resolveFeaturesRecursive.call(this, Q), this.oneofsArray.forEach((B) => {
      B._resolveFeatures(Q)
    }), this.fieldsArray.forEach((B) => {
      B._resolveFeatures(Q)
    }), this
  };
  KY.prototype.get = function (Q) {
    return this.fields[Q] || this.oneofs && this.oneofs[Q] || this.nested && this.nested[Q] || null
  };
  KY.prototype.add = function (Q) {
    if (this.get(Q.name)) throw Error("duplicate name '" + Q.name + "' in " + this);
    if (Q instanceof YX1 && Q.extend === void 0) {
      if (this._fieldsById ? this._fieldsById[Q.id] : this.fieldsById[Q.id]) throw Error("duplicate id " + Q.id + " in " + this);
      if (this.isReservedId(Q.id)) throw Error("id " + Q.id + " is reserved in " + this);
      if (this.isReservedName(Q.name)) throw Error("name '" + Q.name + "' is reserved in " + this);
      if (Q.parent) Q.parent.remove(Q);
      return this.fields[Q.name] = Q, Q.message = this, Q.onAdd(this), JX1(this)
    }
    if (Q instanceof zV0) {
      if (!this.oneofs) this.oneofs = {};
      return this.oneofs[Q.name] = Q, Q.onAdd(this), JX1(this)
    }
    return s_.prototype.add.call(this, Q)
  };
  KY.prototype.remove = function (Q) {
    if (Q instanceof YX1 && Q.extend === void 0) {
      if (!this.fields || this.fields[Q.name] !== Q) throw Error(Q + " is not a member of " + this);
      return delete this.fields[Q.name], Q.parent = null, Q.onRemove(this), JX1(this)
    }
    if (Q instanceof zV0) {
      if (!this.oneofs || this.oneofs[Q.name] !== Q) throw Error(Q + " is not a member of " + this);
      return delete this.oneofs[Q.name], Q.parent = null, Q.onRemove(this), JX1(this)
    }
    return s_.prototype.remove.call(this, Q)
  };
  KY.prototype.isReservedId = function (Q) {
    return s_.isReservedId(this.reserved, Q)
  };
  KY.prototype.isReservedName = function (Q) {
    return s_.isReservedName(this.reserved, Q)
  };
  KY.prototype.create = function (Q) {
    return new this.ctor(Q)
  };
  KY.prototype.setup = function () {
    var Q = this.fullName,
      B = [];
    for (var G = 0; G < this.fieldsArray.length; ++G) B.push(this._fieldsArray[G].resolve().resolvedType);
    this.encode = ON5(this)({
      Writer: LN5,
      types: B,
      util: rz
    }), this.decode = MN5(this)({
      Reader: EV0,
      types: B,
      util: rz
    }), this.verify = RN5(this)({
      types: B,
      util: rz
    }), this.fromObject = yH2.fromObject(this)({
      types: B,
      util: rz
    }), this.toObject = yH2.toObject(this)({
      types: B,
      util: rz
    });
    var Z = _N5[Q];
    if (Z) {
      var Y = Object.create(this);
      Y.fromObject = this.fromObject, this.fromObject = Z.fromObject.bind(Y), Y.toObject = this.toObject, this.toObject = Z.toObject.bind(Y)
    }
    return this
  };
  KY.prototype.encode = function (Q, B) {
    return this.setup().encode(Q, B)
  };
  KY.prototype.encodeDelimited = function (Q, B) {
    return this.encode(Q, B && B.len ? B.fork() : B).ldelim()
  };
  KY.prototype.decode = function (Q, B) {
    return this.setup().decode(Q, B)
  };
  KY.prototype.decodeDelimited = function (Q) {
    if (!(Q instanceof EV0)) Q = EV0.create(Q);
    return this.decode(Q, Q.uint32())
  };
  KY.prototype.verify = function (Q) {
    return this.setup().verify(Q)
  };
  KY.prototype.fromObject = function (Q) {
    return this.setup().fromObject(Q)
  };
  KY.prototype.toObject = function (Q, B) {
    return this.setup().toObject(Q, B)
  };
  KY.d = function (Q) {
    return function (G) {
      rz.decorateType(G, Q)
    }
  }
})
// @from(Ln 294427, Col 4)
KX1 = U((xSZ, fH2) => {
  fH2.exports = CO;
  var WX1 = NFA();
  ((CO.prototype = Object.create(WX1.prototype)).constructor = CO).className = "Root";
  var IX1 = Xs(),
    CV0 = dS(),
    jN5 = e4A(),
    Ds = TF(),
    UV0, qV0, qvA;

  function CO(A) {
    WX1.call(this, "", A), this.deferred = [], this.files = [], this._edition = "proto2", this._fullyQualifiedObjects = {}
  }
  CO.fromJSON = function (Q, B) {
    if (!B) B = new CO;
    if (Q.options) B.setOptions(Q.options);
    return B.addJSON(Q.nested).resolveAll()
  };
  CO.prototype.resolvePath = Ds.path.resolve;
  CO.prototype.fetch = Ds.fetch;

  function bH2() {}
  CO.prototype.load = function A(Q, B, G) {
    if (typeof B === "function") G = B, B = void 0;
    var Z = this;
    if (!G) return Ds.asPromise(A, Z, Q, B);
    var Y = G === bH2;

    function J(F, H) {
      if (!G) return;
      if (Y) throw F;
      if (H) H.resolveAll();
      var E = G;
      G = null, E(F, H)
    }

    function X(F) {
      var H = F.lastIndexOf("google/protobuf/");
      if (H > -1) {
        var E = F.substring(H);
        if (E in qvA) return E
      }
      return null
    }

    function I(F, H) {
      try {
        if (Ds.isString(H) && H.charAt(0) === "{") H = JSON.parse(H);
        if (!Ds.isString(H)) Z.setOptions(H.options).addJSON(H.nested);
        else {
          qV0.filename = F;
          var E = qV0(H, Z, B),
            z, $ = 0;
          if (E.imports) {
            for (; $ < E.imports.length; ++$)
              if (z = X(E.imports[$]) || Z.resolvePath(F, E.imports[$])) D(z)
          }
          if (E.weakImports) {
            for ($ = 0; $ < E.weakImports.length; ++$)
              if (z = X(E.weakImports[$]) || Z.resolvePath(F, E.weakImports[$])) D(z, !0)
          }
        }
      } catch (O) {
        J(O)
      }
      if (!Y && !W) J(null, Z)
    }

    function D(F, H) {
      if (F = X(F) || F, Z.files.indexOf(F) > -1) return;
      if (Z.files.push(F), F in qvA) {
        if (Y) I(F, qvA[F]);
        else ++W, setTimeout(function () {
          --W, I(F, qvA[F])
        });
        return
      }
      if (Y) {
        var E;
        try {
          E = Ds.fs.readFileSync(F).toString("utf8")
        } catch (z) {
          if (!H) J(z);
          return
        }
        I(F, E)
      } else ++W, Z.fetch(F, function (z, $) {
        if (--W, !G) return;
        if (z) {
          if (!H) J(z);
          else if (!W) J(null, Z);
          return
        }
        I(F, $)
      })
    }
    var W = 0;
    if (Ds.isString(Q)) Q = [Q];
    for (var K = 0, V; K < Q.length; ++K)
      if (V = Z.resolvePath("", Q[K])) D(V);
    if (Y) return Z.resolveAll(), Z;
    if (!W) J(null, Z);
    return Z
  };
  CO.prototype.loadSync = function (Q, B) {
    if (!Ds.isNode) throw Error("not supported");
    return this.load(Q, B, bH2)
  };
  CO.prototype.resolveAll = function () {
    if (!this._needsRecursiveResolve) return this;
    if (this.deferred.length) throw Error("unresolvable extensions: " + this.deferred.map(function (Q) {
      return "'extend " + Q.extend + "' in " + Q.parent.fullName
    }).join(", "));
    return WX1.prototype.resolveAll.call(this)
  };
  var DX1 = /^[A-Z]/;

  function kH2(A, Q) {
    var B = Q.parent.lookup(Q.extend);
    if (B) {
      var G = new IX1(Q.fullName, Q.id, Q.type, Q.rule, void 0, Q.options);
      if (B.get(G.name)) return !0;
      return G.declaringField = Q, Q.extensionField = G, B.add(G), !0
    }
    return !1
  }
  CO.prototype._handleAdd = function (Q) {
    if (Q instanceof IX1) {
      if (Q.extend !== void 0 && !Q.extensionField) {
        if (!kH2(this, Q)) this.deferred.push(Q)
      }
    } else if (Q instanceof CV0) {
      if (DX1.test(Q.name)) Q.parent[Q.name] = Q.values
    } else if (!(Q instanceof jN5)) {
      if (Q instanceof UV0)
        for (var B = 0; B < this.deferred.length;)
          if (kH2(this, this.deferred[B])) this.deferred.splice(B, 1);
          else ++B;
      for (var G = 0; G < Q.nestedArray.length; ++G) this._handleAdd(Q._nestedArray[G]);
      if (DX1.test(Q.name)) Q.parent[Q.name] = Q
    }
    if (Q instanceof UV0 || Q instanceof CV0 || Q instanceof IX1) this._fullyQualifiedObjects[Q.fullName] = Q
  };
  CO.prototype._handleRemove = function (Q) {
    if (Q instanceof IX1) {
      if (Q.extend !== void 0)
        if (Q.extensionField) Q.extensionField.parent.remove(Q.extensionField), Q.extensionField = null;
        else {
          var B = this.deferred.indexOf(Q);
          if (B > -1) this.deferred.splice(B, 1)
        }
    } else if (Q instanceof CV0) {
      if (DX1.test(Q.name)) delete Q.parent[Q.name]
    } else if (Q instanceof WX1) {
      for (var G = 0; G < Q.nestedArray.length; ++G) this._handleRemove(Q._nestedArray[G]);
      if (DX1.test(Q.name)) delete Q.parent[Q.name]
    }
    delete this._fullyQualifiedObjects[Q.fullName]
  };
  CO._configure = function (A, Q, B) {
    UV0 = A, qV0 = Q, qvA = B
  }
})
// @from(Ln 294590, Col 4)
TF = U((ySZ, gH2) => {
  var aD = gH2.exports = nb(),
    hH2 = rW0(),
    NV0, wV0;
  aD.codegen = FH2();
  aD.fetch = EH2();
  aD.path = CH2();
  aD.fs = aD.inquire("fs");
  aD.toArray = function (Q) {
    if (Q) {
      var B = Object.keys(Q),
        G = Array(B.length),
        Z = 0;
      while (Z < B.length) G[Z] = Q[B[Z++]];
      return G
    }
    return []
  };
  aD.toObject = function (Q) {
    var B = {},
      G = 0;
    while (G < Q.length) {
      var Z = Q[G++],
        Y = Q[G++];
      if (Y !== void 0) B[Z] = Y
    }
    return B
  };
  var TN5 = /\\/g,
    PN5 = /"/g;
  aD.isReserved = function (Q) {
    return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(Q)
  };
  aD.safeProp = function (Q) {
    if (!/^[$\w_]+$/.test(Q) || aD.isReserved(Q)) return '["' + Q.replace(TN5, "\\\\").replace(PN5, "\\\"") + '"]';
    return "." + Q
  };
  aD.ucFirst = function (Q) {
    return Q.charAt(0).toUpperCase() + Q.substring(1)
  };
  var SN5 = /_([a-z])/g;
  aD.camelCase = function (Q) {
    return Q.substring(0, 1) + Q.substring(1).replace(SN5, function (B, G) {
      return G.toUpperCase()
    })
  };
  aD.compareFieldsById = function (Q, B) {
    return Q.id - B.id
  };
  aD.decorateType = function (Q, B) {
    if (Q.$type) {
      if (B && Q.$type.name !== B) aD.decorateRoot.remove(Q.$type), Q.$type.name = B, aD.decorateRoot.add(Q.$type);
      return Q.$type
    }
    if (!NV0) NV0 = XX1();
    var G = new NV0(B || Q.name);
    return aD.decorateRoot.add(G), G.ctor = Q, Object.defineProperty(Q, "$type", {
      value: G,
      enumerable: !1
    }), Object.defineProperty(Q.prototype, "$type", {
      value: G,
      enumerable: !1
    }), G
  };
  var xN5 = 0;
  aD.decorateEnum = function (Q) {
    if (Q.$type) return Q.$type;
    if (!wV0) wV0 = dS();
    var B = new wV0("Enum" + xN5++, Q);
    return aD.decorateRoot.add(B), Object.defineProperty(Q, "$type", {
      value: B,
      enumerable: !1
    }), B
  };
  aD.setProperty = function (Q, B, G, Z) {
    function Y(J, X, I) {
      var D = X.shift();
      if (D === "__proto__" || D === "prototype") return J;
      if (X.length > 0) J[D] = Y(J[D] || {}, X, I);
      else {
        var W = J[D];
        if (W && Z) return J;
        if (W) I = [].concat(W).concat(I);
        J[D] = I
      }
      return J
    }
    if (typeof Q !== "object") throw TypeError("dst must be an object");
    if (!B) throw TypeError("path must be specified");
    return B = B.split("."), Y(Q, B, G)
  };
  Object.defineProperty(aD, "decorateRoot", {
    get: function () {
      return hH2.decorated || (hH2.decorated = new(KX1()))
    }
  })
})
// @from(Ln 294687, Col 4)
A6A = U((uH2) => {
  var NvA = uH2,
    yN5 = TF(),
    vN5 = ["double", "float", "int32", "uint32", "sint32", "fixed32", "sfixed32", "int64", "uint64", "sint64", "fixed64", "sfixed64", "bool", "string", "bytes"];

  function wvA(A, Q) {
    var B = 0,
      G = {};
    Q |= 0;
    while (B < A.length) G[vN5[B + Q]] = A[B++];
    return G
  }
  NvA.basic = wvA([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2, 2]);
  NvA.defaults = wvA([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, !1, "", yN5.emptyArray, null]);
  NvA.long = wvA([0, 0, 0, 1, 1], 7);
  NvA.mapKey = wvA([0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2], 2);
  NvA.packed = wvA([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0])
})