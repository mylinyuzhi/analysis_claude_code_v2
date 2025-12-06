
// @from(Start 10608940, End 10622378)
IC2 = z((ZC2) => {
  Object.defineProperty(ZC2, "t", {
    value: !0
  });
  class C20 {
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
  class oH2 extends C20 {
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
  class tH2 {
    constructor(A = 0) {
      this.iteratorType = A
    }
    equals(A) {
      return this.T === A.T
    }
  }
  class eH2 {
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
  class AC2 extends eH2 {}

  function r1A() {
    throw RangeError("Iterator access denied!")
  }
  class QC2 extends AC2 {
    constructor(A = function(B, G) {
      if (B < G) return -1;
      if (B > G) return 1;
      return 0
    }, Q = !1) {
      super();
      this.v = void 0, this.A = A, this.enableIndex = Q, this.N = Q ? oH2 : C20, this.C = new this.N
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
        I = this.v,
        Y = [];
      while (Y.length || I)
        if (I) Y.push(I), I = I.i;
        else {
          if (I = Y.pop(), Z === Q) return I;
          G && G.push(I), B && B(I, Z, this), Z += 1, I = I.h
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
        I = this.A(Z.u, A);
      if (I === 0) return Z.l = Q, this.m;
      else if (I > 0) Z.i = new this.N(A, Q), Z.i.o = Z, G = Z.i, this.C.i = G;
      else {
        let Y = this.C.h,
          J = this.A(Y.u, A);
        if (J === 0) return Y.l = Q, this.m;
        else if (J < 0) Y.h = new this.N(A, Q), Y.h.o = Y, G = Y.h, this.C.h = G;
        else {
          if (B !== void 0) {
            let W = B.T;
            if (W !== this.C) {
              let X = this.A(W.u, A);
              if (X === 0) return W.l = Q, this.m;
              else if (X > 0) {
                let V = W.I(),
                  F = this.A(V.u, A);
                if (F === 0) return V.l = Q, this.m;
                else if (F < 0)
                  if (G = new this.N(A, Q), V.h === void 0) V.h = G, G.o = V;
                  else W.i = G, G.o = W
              }
            }
          }
          if (G === void 0) {
            G = this.v;
            while (!0) {
              let W = this.A(G.u, A);
              if (W > 0) {
                if (G.i === void 0) {
                  G.i = new this.N(A, Q), G.i.o = G, G = G.i;
                  break
                }
                G = G.i
              } else if (W < 0) {
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
        let Y = G.o;
        while (Y !== this.C) Y.M += 1, Y = Y.o
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
      if (B === this.C) r1A();
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
      if (Q === this.C) r1A();
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
  class BC2 extends tH2 {
    constructor(A, Q, B) {
      super(B);
      if (this.T = A, this.C = Q, this.iteratorType === 0) this.pre = function() {
        if (this.T === this.C.i) r1A();
        return this.T = this.T.I(), this
      }, this.next = function() {
        if (this.T === this.C) r1A();
        return this.T = this.T.B(), this
      };
      else this.pre = function() {
        if (this.T === this.C.h) r1A();
        return this.T = this.T.B(), this
      }, this.next = function() {
        if (this.T === this.C) r1A();
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
  class EP extends BC2 {
    constructor(A, Q, B, G) {
      super(A, Q, G);
      this.container = B
    }
    get pointer() {
      if (this.T === this.C) r1A();
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
      return new EP(this.T, this.C, this.container, this.iteratorType)
    }
  }
  class GC2 extends QC2 {
    constructor(A = [], Q, B) {
      super(Q, B);
      let G = this;
      A.forEach(function(Z) {
        G.setElement(Z[0], Z[1])
      })
    }
    begin() {
      return new EP(this.C.i || this.C, this.C, this)
    }
    end() {
      return new EP(this.C, this.C, this)
    }
    rBegin() {
      return new EP(this.C.h || this.C, this.C, this, 1)
    }
    rEnd() {
      return new EP(this.C, this.C, this, 1)
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
      return new EP(Q, this.C, this)
    }
    upperBound(A) {
      let Q = this.K(this.v, A);
      return new EP(Q, this.C, this)
    }
    reverseLowerBound(A) {
      let Q = this.L(this.v, A);
      return new EP(Q, this.C, this)
    }
    reverseUpperBound(A) {
      let Q = this.k(this.v, A);
      return new EP(Q, this.C, this)
    }
    forEach(A) {
      this.U(function(Q, B, G) {
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
      return new EP(Q, this.C, this)
    }
    getElementByKey(A) {
      return this.H(this.v, A).l
    }
    union(A) {
      let Q = this;
      return A.forEach(function(B) {
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
  ZC2.OrderedMap = GC2
})
// @from(Start 10622384, End 10622801)
v41 = z((JC2) => {
  Object.defineProperty(JC2, "__esModule", {
    value: !0
  });
  JC2.registerAdminService = aL5;
  JC2.addAdminServicesToServer = sL5;
  var YC2 = [];

  function aL5(A, Q) {
    YC2.push({
      getServiceDefinition: A,
      getHandlers: Q
    })
  }

  function sL5(A) {
    for (let {
        getServiceDefinition: Q,
        getHandlers: B
      }
      of YC2) A.addService(Q(), B())
  }
})
// @from(Start 10622807, End 10626782)
HC2 = z((KC2) => {
  Object.defineProperty(KC2, "__esModule", {
    value: !0
  });
  KC2.ClientDuplexStreamImpl = KC2.ClientWritableStreamImpl = KC2.ClientReadableStreamImpl = KC2.ClientUnaryCallImpl = void 0;
  KC2.callErrorFromStatus = eL5;
  var tL5 = UA("events"),
    E20 = UA("stream"),
    $OA = E6();

  function eL5(A, Q) {
    let B = `${A.code} ${$OA.Status[A.code]}: ${A.details}`,
      Z = `${Error(B).stack}
for call at
${Q}`;
    return Object.assign(Error(B), A, {
      stack: Z
    })
  }
  class WC2 extends tL5.EventEmitter {
    constructor() {
      super()
    }
    cancel() {
      var A;
      (A = this.call) === null || A === void 0 || A.cancelWithStatus($OA.Status.CANCELLED, "Cancelled on client")
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
  KC2.ClientUnaryCallImpl = WC2;
  class XC2 extends E20.Readable {
    constructor(A) {
      super({
        objectMode: !0
      });
      this.deserialize = A
    }
    cancel() {
      var A;
      (A = this.call) === null || A === void 0 || A.cancelWithStatus($OA.Status.CANCELLED, "Cancelled on client")
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
  KC2.ClientReadableStreamImpl = XC2;
  class VC2 extends E20.Writable {
    constructor(A) {
      super({
        objectMode: !0
      });
      this.serialize = A
    }
    cancel() {
      var A;
      (A = this.call) === null || A === void 0 || A.cancelWithStatus($OA.Status.CANCELLED, "Cancelled on client")
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
        I = Number(Q);
      if (!Number.isNaN(I)) Z.flags = I;
      (G = this.call) === null || G === void 0 || G.sendMessageWithContext(Z, A)
    }
    _final(A) {
      var Q;
      (Q = this.call) === null || Q === void 0 || Q.halfClose(), A()
    }
  }
  KC2.ClientWritableStreamImpl = VC2;
  class FC2 extends E20.Duplex {
    constructor(A, Q) {
      super({
        objectMode: !0
      });
      this.serialize = A, this.deserialize = Q
    }
    cancel() {
      var A;
      (A = this.call) === null || A === void 0 || A.cancelWithStatus($OA.Status.CANCELLED, "Cancelled on client")
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
        I = Number(Q);
      if (!Number.isNaN(I)) Z.flags = I;
      (G = this.call) === null || G === void 0 || G.sendMessageWithContext(Z, A)
    }
    _final(A) {
      var Q;
      (Q = this.call) === null || Q === void 0 || Q.halfClose(), A()
    }
  }
  KC2.ClientDuplexStreamImpl = FC2
})
// @from(Start 10626788, End 10628770)
o1A = z((EC2) => {
  Object.defineProperty(EC2, "__esModule", {
    value: !0
  });
  EC2.InterceptingListenerImpl = void 0;
  EC2.statusOrFromValue = IM5;
  EC2.statusOrFromError = YM5;
  EC2.isInterceptingListener = JM5;
  var ZM5 = YK();

  function IM5(A) {
    return {
      ok: !0,
      value: A
    }
  }

  function YM5(A) {
    var Q;
    return {
      ok: !1,
      error: Object.assign(Object.assign({}, A), {
        metadata: (Q = A.metadata) !== null && Q !== void 0 ? Q : new ZM5.Metadata
      })
    }
  }

  function JM5(A) {
    return A.onReceiveMetadata !== void 0 && A.onReceiveMetadata.length === 1
  }
  class CC2 {
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
  EC2.InterceptingListenerImpl = CC2
})
// @from(Start 10628776, End 10638297)
$20 = z((RC2) => {
  Object.defineProperty(RC2, "__esModule", {
    value: !0
  });
  RC2.InterceptingCall = RC2.RequesterBuilder = RC2.ListenerBuilder = RC2.InterceptorConfigurationError = void 0;
  RC2.getInterceptingCall = HM5;
  var FM5 = YK(),
    UC2 = o1A(),
    $C2 = E6(),
    wC2 = q41();
  class qOA extends Error {
    constructor(A) {
      super(A);
      this.name = "InterceptorConfigurationError", Error.captureStackTrace(this, qOA)
    }
  }
  RC2.InterceptorConfigurationError = qOA;
  class qC2 {
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
  RC2.ListenerBuilder = qC2;
  class NC2 {
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
  RC2.RequesterBuilder = NC2;
  var z20 = {
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
    wOA = {
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
  class LC2 {
    constructor(A, Q) {
      var B, G, Z, I;
      if (this.nextCall = A, this.processingMetadata = !1, this.pendingMessageContext = null, this.processingMessage = !1, this.pendingHalfClose = !1, Q) this.requester = {
        start: (B = Q.start) !== null && B !== void 0 ? B : wOA.start,
        sendMessage: (G = Q.sendMessage) !== null && G !== void 0 ? G : wOA.sendMessage,
        halfClose: (Z = Q.halfClose) !== null && Z !== void 0 ? Z : wOA.halfClose,
        cancel: (I = Q.cancel) !== null && I !== void 0 ? I : wOA.cancel
      };
      else this.requester = wOA
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
      var B, G, Z, I, Y, J;
      let W = {
        onReceiveMetadata: (G = (B = Q === null || Q === void 0 ? void 0 : Q.onReceiveMetadata) === null || B === void 0 ? void 0 : B.bind(Q)) !== null && G !== void 0 ? G : (X) => {},
        onReceiveMessage: (I = (Z = Q === null || Q === void 0 ? void 0 : Q.onReceiveMessage) === null || Z === void 0 ? void 0 : Z.bind(Q)) !== null && I !== void 0 ? I : (X) => {},
        onReceiveStatus: (J = (Y = Q === null || Q === void 0 ? void 0 : Q.onReceiveStatus) === null || Y === void 0 ? void 0 : Y.bind(Q)) !== null && J !== void 0 ? J : (X) => {}
      };
      this.processingMetadata = !0, this.requester.start(A, W, (X, V) => {
        var F, K, D;
        this.processingMetadata = !1;
        let H;
        if ((0, UC2.isInterceptingListener)(V)) H = V;
        else {
          let C = {
            onReceiveMetadata: (F = V.onReceiveMetadata) !== null && F !== void 0 ? F : z20.onReceiveMetadata,
            onReceiveMessage: (K = V.onReceiveMessage) !== null && K !== void 0 ? K : z20.onReceiveMessage,
            onReceiveStatus: (D = V.onReceiveStatus) !== null && D !== void 0 ? D : z20.onReceiveStatus
          };
          H = new UC2.InterceptingListenerImpl(C, W)
        }
        this.nextCall.start(X, H), this.processPendingMessage(), this.processPendingHalfClose()
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
  RC2.InterceptingCall = LC2;

  function KM5(A, Q, B) {
    var G, Z;
    let I = (G = B.deadline) !== null && G !== void 0 ? G : 1 / 0,
      Y = B.host,
      J = (Z = B.parent) !== null && Z !== void 0 ? Z : null,
      W = B.propagate_flags,
      X = B.credentials,
      V = A.createCall(Q, I, Y, J, W);
    if (X) V.setCredentials(X);
    return V
  }
  class U20 {
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
        this.call.cancelWithStatus($C2.Status.INTERNAL, `Request message serialization failure: ${(0,wC2.getErrorMessage)(G)}`);
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
          let I;
          try {
            I = this.methodDefinition.responseDeserialize(G)
          } catch (Y) {
            B = {
              code: $C2.Status.INTERNAL,
              details: `Response message parsing error: ${(0,wC2.getErrorMessage)(Y)}`,
              metadata: new FM5.Metadata
            }, this.call.cancelWithStatus(B.code, B.details);
            return
          }(Z = Q === null || Q === void 0 ? void 0 : Q.onReceiveMessage) === null || Z === void 0 || Z.call(Q, I)
        },
        onReceiveStatus: (G) => {
          var Z, I;
          if (B)(Z = Q === null || Q === void 0 ? void 0 : Q.onReceiveStatus) === null || Z === void 0 || Z.call(Q, B);
          else(I = Q === null || Q === void 0 ? void 0 : Q.onReceiveStatus) === null || I === void 0 || I.call(Q, G)
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
  class MC2 extends U20 {
    constructor(A, Q) {
      super(A, Q)
    }
    start(A, Q) {
      var B, G;
      let Z = !1,
        I = {
          onReceiveMetadata: (G = (B = Q === null || Q === void 0 ? void 0 : Q.onReceiveMetadata) === null || B === void 0 ? void 0 : B.bind(Q)) !== null && G !== void 0 ? G : (Y) => {},
          onReceiveMessage: (Y) => {
            var J;
            Z = !0, (J = Q === null || Q === void 0 ? void 0 : Q.onReceiveMessage) === null || J === void 0 || J.call(Q, Y)
          },
          onReceiveStatus: (Y) => {
            var J, W;
            if (!Z)(J = Q === null || Q === void 0 ? void 0 : Q.onReceiveMessage) === null || J === void 0 || J.call(Q, null);
            (W = Q === null || Q === void 0 ? void 0 : Q.onReceiveStatus) === null || W === void 0 || W.call(Q, Y)
          }
        };
      super.start(A, I), this.call.startRead()
    }
  }
  class OC2 extends U20 {}

  function DM5(A, Q, B) {
    let G = KM5(A, B.path, Q);
    if (B.responseStream) return new OC2(G, B);
    else return new MC2(G, B)
  }

  function HM5(A, Q, B, G) {
    if (A.clientInterceptors.length > 0 && A.clientInterceptorProviders.length > 0) throw new qOA("Both interceptors and interceptor_providers were passed as options to the client constructor. Only one of these is allowed.");
    if (A.callInterceptors.length > 0 && A.callInterceptorProviders.length > 0) throw new qOA("Both interceptors and interceptor_providers were passed as call options. Only one of these is allowed.");
    let Z = [];
    if (A.callInterceptors.length > 0 || A.callInterceptorProviders.length > 0) Z = [].concat(A.callInterceptors, A.callInterceptorProviders.map((J) => J(Q))).filter((J) => J);
    else Z = [].concat(A.clientInterceptors, A.clientInterceptorProviders.map((J) => J(Q))).filter((J) => J);
    let I = Object.assign({}, B, {
      method_definition: Q
    });
    return Z.reduceRight((J, W) => {
      return (X) => W(X, J)
    }, (J) => DM5(G, J, Q))(I)
  }
})
// @from(Start 10638303, End 10648238)
q20 = z((jC2) => {
  Object.defineProperty(jC2, "__esModule", {
    value: !0
  });
  jC2.Client = void 0;
  var ek = HC2(),
    $M5 = N20(),
    wM5 = mE(),
    ii = E6(),
    BJA = YK(),
    b41 = $20(),
    zP = Symbol(),
    GJA = Symbol(),
    ZJA = Symbol(),
    jh = Symbol();

  function w20(A) {
    return typeof A === "function"
  }

  function IJA(A) {
    var Q;
    return ((Q = A.stack) === null || Q === void 0 ? void 0 : Q.split(`
`).slice(1).join(`
`)) || "no stack trace available"
  }
  class PC2 {
    constructor(A, Q, B = {}) {
      var G, Z;
      if (B = Object.assign({}, B), this[GJA] = (G = B.interceptors) !== null && G !== void 0 ? G : [], delete B.interceptors, this[ZJA] = (Z = B.interceptor_providers) !== null && Z !== void 0 ? Z : [], delete B.interceptor_providers, this[GJA].length > 0 && this[ZJA].length > 0) throw Error("Both interceptors and interceptor_providers were passed as options to the client constructor. Only one of these is allowed.");
      if (this[jh] = B.callInvocationTransformer, delete B.callInvocationTransformer, B.channelOverride) this[zP] = B.channelOverride;
      else if (B.channelFactoryOverride) {
        let I = B.channelFactoryOverride;
        delete B.channelFactoryOverride, this[zP] = I(A, Q, B)
      } else this[zP] = new $M5.ChannelImplementation(A, Q, B)
    }
    close() {
      this[zP].close()
    }
    getChannel() {
      return this[zP]
    }
    waitForReady(A, Q) {
      let B = (G) => {
        if (G) {
          Q(Error("Failed to connect before the deadline"));
          return
        }
        let Z;
        try {
          Z = this[zP].getConnectivityState(!0)
        } catch (I) {
          Q(Error("The channel has been closed"));
          return
        }
        if (Z === wM5.ConnectivityState.READY) Q();
        else try {
          this[zP].watchConnectivityState(Z, A, B)
        } catch (I) {
          Q(Error("The channel has been closed"))
        }
      };
      setImmediate(B)
    }
    checkOptionalUnaryResponseArguments(A, Q, B) {
      if (w20(A)) return {
        metadata: new BJA.Metadata,
        options: {},
        callback: A
      };
      else if (w20(Q))
        if (A instanceof BJA.Metadata) return {
          metadata: A,
          options: {},
          callback: Q
        };
        else return {
          metadata: new BJA.Metadata,
          options: A,
          callback: Q
        };
      else {
        if (!(A instanceof BJA.Metadata && Q instanceof Object && w20(B))) throw Error("Incorrect arguments passed");
        return {
          metadata: A,
          options: Q,
          callback: B
        }
      }
    }
    makeUnaryRequest(A, Q, B, G, Z, I, Y) {
      var J, W;
      let X = this.checkOptionalUnaryResponseArguments(Z, I, Y),
        V = {
          path: A,
          requestStream: !1,
          responseStream: !1,
          requestSerialize: Q,
          responseDeserialize: B
        },
        F = {
          argument: G,
          metadata: X.metadata,
          call: new ek.ClientUnaryCallImpl,
          channel: this[zP],
          methodDefinition: V,
          callOptions: X.options,
          callback: X.callback
        };
      if (this[jh]) F = this[jh](F);
      let K = F.call,
        D = {
          clientInterceptors: this[GJA],
          clientInterceptorProviders: this[ZJA],
          callInterceptors: (J = F.callOptions.interceptors) !== null && J !== void 0 ? J : [],
          callInterceptorProviders: (W = F.callOptions.interceptor_providers) !== null && W !== void 0 ? W : []
        },
        H = (0, b41.getInterceptingCall)(D, F.methodDefinition, F.callOptions, F.channel);
      K.call = H;
      let C = null,
        E = !1,
        U = Error();
      return H.start(F.metadata, {
        onReceiveMetadata: (q) => {
          K.emit("metadata", q)
        },
        onReceiveMessage(q) {
          if (C !== null) H.cancelWithStatus(ii.Status.UNIMPLEMENTED, "Too many responses received");
          C = q
        },
        onReceiveStatus(q) {
          if (E) return;
          if (E = !0, q.code === ii.Status.OK)
            if (C === null) {
              let w = IJA(U);
              F.callback((0, ek.callErrorFromStatus)({
                code: ii.Status.UNIMPLEMENTED,
                details: "No message received",
                metadata: q.metadata
              }, w))
            } else F.callback(null, C);
          else {
            let w = IJA(U);
            F.callback((0, ek.callErrorFromStatus)(q, w))
          }
          U = null, K.emit("status", q)
        }
      }), H.sendMessage(G), H.halfClose(), K
    }
    makeClientStreamRequest(A, Q, B, G, Z, I) {
      var Y, J;
      let W = this.checkOptionalUnaryResponseArguments(G, Z, I),
        X = {
          path: A,
          requestStream: !0,
          responseStream: !1,
          requestSerialize: Q,
          responseDeserialize: B
        },
        V = {
          metadata: W.metadata,
          call: new ek.ClientWritableStreamImpl(Q),
          channel: this[zP],
          methodDefinition: X,
          callOptions: W.options,
          callback: W.callback
        };
      if (this[jh]) V = this[jh](V);
      let F = V.call,
        K = {
          clientInterceptors: this[GJA],
          clientInterceptorProviders: this[ZJA],
          callInterceptors: (Y = V.callOptions.interceptors) !== null && Y !== void 0 ? Y : [],
          callInterceptorProviders: (J = V.callOptions.interceptor_providers) !== null && J !== void 0 ? J : []
        },
        D = (0, b41.getInterceptingCall)(K, V.methodDefinition, V.callOptions, V.channel);
      F.call = D;
      let H = null,
        C = !1,
        E = Error();
      return D.start(V.metadata, {
        onReceiveMetadata: (U) => {
          F.emit("metadata", U)
        },
        onReceiveMessage(U) {
          if (H !== null) D.cancelWithStatus(ii.Status.UNIMPLEMENTED, "Too many responses received");
          H = U, D.startRead()
        },
        onReceiveStatus(U) {
          if (C) return;
          if (C = !0, U.code === ii.Status.OK)
            if (H === null) {
              let q = IJA(E);
              V.callback((0, ek.callErrorFromStatus)({
                code: ii.Status.UNIMPLEMENTED,
                details: "No message received",
                metadata: U.metadata
              }, q))
            } else V.callback(null, H);
          else {
            let q = IJA(E);
            V.callback((0, ek.callErrorFromStatus)(U, q))
          }
          E = null, F.emit("status", U)
        }
      }), F
    }
    checkMetadataAndOptions(A, Q) {
      let B, G;
      if (A instanceof BJA.Metadata)
        if (B = A, Q) G = Q;
        else G = {};
      else {
        if (A) G = A;
        else G = {};
        B = new BJA.Metadata
      }
      return {
        metadata: B,
        options: G
      }
    }
    makeServerStreamRequest(A, Q, B, G, Z, I) {
      var Y, J;
      let W = this.checkMetadataAndOptions(Z, I),
        X = {
          path: A,
          requestStream: !1,
          responseStream: !0,
          requestSerialize: Q,
          responseDeserialize: B
        },
        V = {
          argument: G,
          metadata: W.metadata,
          call: new ek.ClientReadableStreamImpl(B),
          channel: this[zP],
          methodDefinition: X,
          callOptions: W.options
        };
      if (this[jh]) V = this[jh](V);
      let F = V.call,
        K = {
          clientInterceptors: this[GJA],
          clientInterceptorProviders: this[ZJA],
          callInterceptors: (Y = V.callOptions.interceptors) !== null && Y !== void 0 ? Y : [],
          callInterceptorProviders: (J = V.callOptions.interceptor_providers) !== null && J !== void 0 ? J : []
        },
        D = (0, b41.getInterceptingCall)(K, V.methodDefinition, V.callOptions, V.channel);
      F.call = D;
      let H = !1,
        C = Error();
      return D.start(V.metadata, {
        onReceiveMetadata(E) {
          F.emit("metadata", E)
        },
        onReceiveMessage(E) {
          F.push(E)
        },
        onReceiveStatus(E) {
          if (H) return;
          if (H = !0, F.push(null), E.code !== ii.Status.OK) {
            let U = IJA(C);
            F.emit("error", (0, ek.callErrorFromStatus)(E, U))
          }
          C = null, F.emit("status", E)
        }
      }), D.sendMessage(G), D.halfClose(), F
    }
    makeBidiStreamRequest(A, Q, B, G, Z) {
      var I, Y;
      let J = this.checkMetadataAndOptions(G, Z),
        W = {
          path: A,
          requestStream: !0,
          responseStream: !0,
          requestSerialize: Q,
          responseDeserialize: B
        },
        X = {
          metadata: J.metadata,
          call: new ek.ClientDuplexStreamImpl(Q, B),
          channel: this[zP],
          methodDefinition: W,
          callOptions: J.options
        };
      if (this[jh]) X = this[jh](X);
      let V = X.call,
        F = {
          clientInterceptors: this[GJA],
          clientInterceptorProviders: this[ZJA],
          callInterceptors: (I = X.callOptions.interceptors) !== null && I !== void 0 ? I : [],
          callInterceptorProviders: (Y = X.callOptions.interceptor_providers) !== null && Y !== void 0 ? Y : []
        },
        K = (0, b41.getInterceptingCall)(F, X.methodDefinition, X.callOptions, X.channel);
      V.call = K;
      let D = !1,
        H = Error();
      return K.start(X.metadata, {
        onReceiveMetadata(C) {
          V.emit("metadata", C)
        },
        onReceiveMessage(C) {
          V.push(C)
        },
        onReceiveStatus(C) {
          if (D) return;
          if (D = !0, V.push(null), C.code !== ii.Status.OK) {
            let E = IJA(H);
            V.emit("error", (0, ek.callErrorFromStatus)(C, E))
          }
          H = null, V.emit("status", C)
        }
      }), V
    }
  }
  jC2.Client = PC2
})
// @from(Start 10648244, End 10650153)
f41 = z((kC2) => {
  Object.defineProperty(kC2, "__esModule", {
    value: !0
  });
  kC2.makeClientConstructor = _C2;
  kC2.loadPackageDefinition = MM5;
  var NOA = q20(),
    qM5 = {
      unary: NOA.Client.prototype.makeUnaryRequest,
      server_stream: NOA.Client.prototype.makeServerStreamRequest,
      client_stream: NOA.Client.prototype.makeClientStreamRequest,
      bidi: NOA.Client.prototype.makeBidiStreamRequest
    };

  function L20(A) {
    return ["__proto__", "prototype", "constructor"].includes(A)
  }

  function _C2(A, Q, B) {
    if (!B) B = {};
    class G extends NOA.Client {}
    return Object.keys(A).forEach((Z) => {
      if (L20(Z)) return;
      let I = A[Z],
        Y;
      if (typeof Z === "string" && Z.charAt(0) === "$") throw Error("Method names cannot start with $");
      if (I.requestStream)
        if (I.responseStream) Y = "bidi";
        else Y = "client_stream";
      else if (I.responseStream) Y = "server_stream";
      else Y = "unary";
      let {
        requestSerialize: J,
        responseDeserialize: W
      } = I, X = NM5(qM5[Y], I.path, J, W);
      if (G.prototype[Z] = X, Object.assign(G.prototype[Z], I), I.originalName && !L20(I.originalName)) G.prototype[I.originalName] = G.prototype[Z]
    }), G.service = A, G.serviceName = Q, G
  }

  function NM5(A, Q, B, G) {
    return function(...Z) {
      return A.call(this, Q, B, G, ...Z)
    }
  }

  function LM5(A) {
    return "format" in A
  }

  function MM5(A) {
    let Q = {};
    for (let B in A)
      if (Object.prototype.hasOwnProperty.call(A, B)) {
        let G = A[B],
          Z = B.split(".");
        if (Z.some((J) => L20(J))) continue;
        let I = Z[Z.length - 1],
          Y = Q;
        for (let J of Z.slice(0, -1)) {
          if (!Y[J]) Y[J] = {};
          Y = Y[J]
        }
        if (LM5(G)) Y[I] = G;
        else Y[I] = _C2(G, I, {})
      } return Q
  }
})
// @from(Start 10650159, End 10657986)
GE2 = z((ucG, BE2) => {
  var TM5 = 1 / 0,
    PM5 = "[object Symbol]",
    jM5 = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
    SM5 = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
    g41 = "\\ud800-\\udfff",
    uC2 = "\\u0300-\\u036f\\ufe20-\\ufe23",
    mC2 = "\\u20d0-\\u20f0",
    dC2 = "\\u2700-\\u27bf",
    cC2 = "a-z\\xdf-\\xf6\\xf8-\\xff",
    _M5 = "\\xac\\xb1\\xd7\\xf7",
    kM5 = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",
    yM5 = "\\u2000-\\u206f",
    xM5 = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
    pC2 = "A-Z\\xc0-\\xd6\\xd8-\\xde",
    lC2 = "\\ufe0e\\ufe0f",
    iC2 = _M5 + kM5 + yM5 + xM5,
    O20 = "['’]",
    vM5 = "[" + g41 + "]",
    yC2 = "[" + iC2 + "]",
    h41 = "[" + uC2 + mC2 + "]",
    nC2 = "\\d+",
    bM5 = "[" + dC2 + "]",
    aC2 = "[" + cC2 + "]",
    sC2 = "[^" + g41 + iC2 + nC2 + dC2 + cC2 + pC2 + "]",
    M20 = "\\ud83c[\\udffb-\\udfff]",
    fM5 = "(?:" + h41 + "|" + M20 + ")",
    rC2 = "[^" + g41 + "]",
    R20 = "(?:\\ud83c[\\udde6-\\uddff]){2}",
    T20 = "[\\ud800-\\udbff][\\udc00-\\udfff]",
    YJA = "[" + pC2 + "]",
    oC2 = "\\u200d",
    xC2 = "(?:" + aC2 + "|" + sC2 + ")",
    hM5 = "(?:" + YJA + "|" + sC2 + ")",
    vC2 = "(?:" + O20 + "(?:d|ll|m|re|s|t|ve))?",
    bC2 = "(?:" + O20 + "(?:D|LL|M|RE|S|T|VE))?",
    tC2 = fM5 + "?",
    eC2 = "[" + lC2 + "]?",
    gM5 = "(?:" + oC2 + "(?:" + [rC2, R20, T20].join("|") + ")" + eC2 + tC2 + ")*",
    AE2 = eC2 + tC2 + gM5,
    uM5 = "(?:" + [bM5, R20, T20].join("|") + ")" + AE2,
    mM5 = "(?:" + [rC2 + h41 + "?", h41, R20, T20, vM5].join("|") + ")",
    dM5 = RegExp(O20, "g"),
    cM5 = RegExp(h41, "g"),
    pM5 = RegExp(M20 + "(?=" + M20 + ")|" + mM5 + AE2, "g"),
    lM5 = RegExp([YJA + "?" + aC2 + "+" + vC2 + "(?=" + [yC2, YJA, "$"].join("|") + ")", hM5 + "+" + bC2 + "(?=" + [yC2, YJA + xC2, "$"].join("|") + ")", YJA + "?" + xC2 + "+" + vC2, YJA + "+" + bC2, nC2, uM5].join("|"), "g"),
    iM5 = RegExp("[" + oC2 + g41 + uC2 + mC2 + lC2 + "]"),
    nM5 = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
    aM5 = {
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
    sM5 = typeof global == "object" && global && global.Object === Object && global,
    rM5 = typeof self == "object" && self && self.Object === Object && self,
    oM5 = sM5 || rM5 || Function("return this")();

  function tM5(A, Q, B, G) {
    var Z = -1,
      I = A ? A.length : 0;
    if (G && I) B = A[++Z];
    while (++Z < I) B = Q(B, A[Z], Z, A);
    return B
  }

  function eM5(A) {
    return A.split("")
  }

  function AO5(A) {
    return A.match(jM5) || []
  }

  function QO5(A) {
    return function(Q) {
      return A == null ? void 0 : A[Q]
    }
  }
  var BO5 = QO5(aM5);

  function QE2(A) {
    return iM5.test(A)
  }

  function GO5(A) {
    return nM5.test(A)
  }

  function ZO5(A) {
    return QE2(A) ? IO5(A) : eM5(A)
  }

  function IO5(A) {
    return A.match(pM5) || []
  }

  function YO5(A) {
    return A.match(lM5) || []
  }
  var JO5 = Object.prototype,
    WO5 = JO5.toString,
    fC2 = oM5.Symbol,
    hC2 = fC2 ? fC2.prototype : void 0,
    gC2 = hC2 ? hC2.toString : void 0;

  function XO5(A, Q, B) {
    var G = -1,
      Z = A.length;
    if (Q < 0) Q = -Q > Z ? 0 : Z + Q;
    if (B = B > Z ? Z : B, B < 0) B += Z;
    Z = Q > B ? 0 : B - Q >>> 0, Q >>>= 0;
    var I = Array(Z);
    while (++G < Z) I[G] = A[G + Q];
    return I
  }

  function VO5(A) {
    if (typeof A == "string") return A;
    if (CO5(A)) return gC2 ? gC2.call(A) : "";
    var Q = A + "";
    return Q == "0" && 1 / A == -TM5 ? "-0" : Q
  }

  function FO5(A, Q, B) {
    var G = A.length;
    return B = B === void 0 ? G : B, !Q && B >= G ? A : XO5(A, Q, B)
  }

  function KO5(A) {
    return function(Q) {
      Q = u41(Q);
      var B = QE2(Q) ? ZO5(Q) : void 0,
        G = B ? B[0] : Q.charAt(0),
        Z = B ? FO5(B, 1).join("") : Q.slice(1);
      return G[A]() + Z
    }
  }

  function DO5(A) {
    return function(Q) {
      return tM5(wO5(UO5(Q).replace(dM5, "")), A, "")
    }
  }

  function HO5(A) {
    return !!A && typeof A == "object"
  }

  function CO5(A) {
    return typeof A == "symbol" || HO5(A) && WO5.call(A) == PM5
  }

  function u41(A) {
    return A == null ? "" : VO5(A)
  }
  var EO5 = DO5(function(A, Q, B) {
    return Q = Q.toLowerCase(), A + (B ? zO5(Q) : Q)
  });

  function zO5(A) {
    return $O5(u41(A).toLowerCase())
  }

  function UO5(A) {
    return A = u41(A), A && A.replace(SM5, BO5).replace(cM5, "")
  }
  var $O5 = KO5("toUpperCase");

  function wO5(A, Q, B) {
    if (A = u41(A), Q = B ? void 0 : Q, Q === void 0) return GO5(A) ? YO5(A) : AO5(A);
    return A.match(Q) || []
  }
  BE2.exports = EO5
})
// @from(Start 10657992, End 10659402)
IE2 = z((mcG, ZE2) => {
  ZE2.exports = P20;

  function P20(A, Q) {
    if (typeof A === "string") Q = A, A = void 0;
    var B = [];

    function G(I) {
      if (typeof I !== "string") {
        var Y = Z();
        if (P20.verbose) console.log("codegen: " + Y);
        if (Y = "return " + Y, I) {
          var J = Object.keys(I),
            W = Array(J.length + 1),
            X = Array(J.length),
            V = 0;
          while (V < J.length) W[V] = J[V], X[V] = I[J[V++]];
          return W[V] = Y, Function.apply(null, W).apply(null, X)
        }
        return Function(Y)()
      }
      var F = Array(arguments.length - 1),
        K = 0;
      while (K < F.length) F[K] = arguments[++K];
      if (K = 0, I = I.replace(/%([%dfijs])/g, function(H, C) {
          var E = F[K++];
          switch (C) {
            case "d":
            case "f":
              return String(Number(E));
            case "i":
              return String(Math.floor(E));
            case "j":
              return JSON.stringify(E);
            case "s":
              return String(E)
          }
          return "%"
        }), K !== F.length) throw Error("parameter count mismatch");
      return B.push(I), G
    }

    function Z(I) {
      return "function " + (I || Q || "") + "(" + (A && A.join(",") || "") + `){
  ` + B.join(`
  `) + `
}`
    }
    return G.toString = Z, G
  }
  P20.verbose = !1
})
// @from(Start 10659408, End 10660652)
JE2 = z((dcG, YE2) => {
  YE2.exports = LOA;
  var qO5 = XB0(),
    NO5 = FB0(),
    j20 = NO5("fs");

  function LOA(A, Q, B) {
    if (typeof Q === "function") B = Q, Q = {};
    else if (!Q) Q = {};
    if (!B) return qO5(LOA, this, A, Q);
    if (!Q.xhr && j20 && j20.readFile) return j20.readFile(A, function(Z, I) {
      return Z && typeof XMLHttpRequest < "u" ? LOA.xhr(A, Q, B) : Z ? B(Z) : B(null, Q.binary ? I : I.toString("utf8"))
    });
    return LOA.xhr(A, Q, B)
  }
  LOA.xhr = function(Q, B, G) {
    var Z = new XMLHttpRequest;
    if (Z.onreadystatechange = function() {
        if (Z.readyState !== 4) return;
        if (Z.status !== 0 && Z.status !== 200) return G(Error("status " + Z.status));
        if (B.binary) {
          var Y = Z.response;
          if (!Y) {
            Y = [];
            for (var J = 0; J < Z.responseText.length; ++J) Y.push(Z.responseText.charCodeAt(J) & 255)
          }
          return G(null, typeof Uint8Array < "u" ? new Uint8Array(Y) : Y)
        }
        return G(null, Z.responseText)
      }, B.binary) {
      if ("overrideMimeType" in Z) Z.overrideMimeType("text/plain; charset=x-user-defined");
      Z.responseType = "arraybuffer"
    }
    Z.open("GET", Q), Z.send()
  }
})
// @from(Start 10660658, End 10661443)
VE2 = z((XE2) => {
  var _20 = XE2,
    WE2 = _20.isAbsolute = function(Q) {
      return /^(?:\/|\w+:)/.test(Q)
    },
    S20 = _20.normalize = function(Q) {
      Q = Q.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
      var B = Q.split("/"),
        G = WE2(Q),
        Z = "";
      if (G) Z = B.shift() + "/";
      for (var I = 0; I < B.length;)
        if (B[I] === "..")
          if (I > 0 && B[I - 1] !== "..") B.splice(--I, 2);
          else if (G) B.splice(I, 1);
      else ++I;
      else if (B[I] === ".") B.splice(I, 1);
      else ++I;
      return Z + B.join("/")
    };
  _20.resolve = function(Q, B, G) {
    if (!G) B = S20(B);
    if (WE2(B)) return B;
    if (!G) Q = S20(Q);
    return (Q = Q.replace(/(?:\/|^)[^/]+$/, "")).length ? S20(Q + "/" + B) : B
  }
})
// @from(Start 10661449, End 10668291)
WJA = z((pcG, DE2) => {
  DE2.exports = H3;
  var m41 = ai();
  ((H3.prototype = Object.create(m41.prototype)).constructor = H3).className = "Namespace";
  var k20 = ni(),
    d41 = JK(),
    LO5 = A0A(),
    t1A, JJA, e1A;
  H3.fromJSON = function(Q, B) {
    return new H3(Q, B.options).addJSON(B.nested)
  };

  function FE2(A, Q) {
    if (!(A && A.length)) return;
    var B = {};
    for (var G = 0; G < A.length; ++G) B[A[G].name] = A[G].toJSON(Q);
    return B
  }
  H3.arrayToJSON = FE2;
  H3.isReservedId = function(Q, B) {
    if (Q) {
      for (var G = 0; G < Q.length; ++G)
        if (typeof Q[G] !== "string" && Q[G][0] <= B && Q[G][1] > B) return !0
    }
    return !1
  };
  H3.isReservedName = function(Q, B) {
    if (Q) {
      for (var G = 0; G < Q.length; ++G)
        if (Q[G] === B) return !0
    }
    return !1
  };

  function H3(A, Q) {
    m41.call(this, A, Q), this.nested = void 0, this._nestedArray = null, this._lookupCache = {}, this._needsRecursiveFeatureResolution = !0, this._needsRecursiveResolve = !0
  }

  function KE2(A) {
    A._nestedArray = null, A._lookupCache = {};
    var Q = A;
    while (Q = Q.parent) Q._lookupCache = {};
    return A
  }
  Object.defineProperty(H3.prototype, "nestedArray", {
    get: function() {
      return this._nestedArray || (this._nestedArray = d41.toArray(this.nested))
    }
  });
  H3.prototype.toJSON = function(Q) {
    return d41.toObject(["options", this.options, "nested", FE2(this.nestedArray, Q)])
  };
  H3.prototype.addJSON = function(Q) {
    var B = this;
    if (Q)
      for (var G = Object.keys(Q), Z = 0, I; Z < G.length; ++Z) I = Q[G[Z]], B.add((I.fields !== void 0 ? t1A.fromJSON : I.values !== void 0 ? e1A.fromJSON : I.methods !== void 0 ? JJA.fromJSON : I.id !== void 0 ? k20.fromJSON : H3.fromJSON)(G[Z], I));
    return this
  };
  H3.prototype.get = function(Q) {
    return this.nested && this.nested[Q] || null
  };
  H3.prototype.getEnum = function(Q) {
    if (this.nested && this.nested[Q] instanceof e1A) return this.nested[Q].values;
    throw Error("no such enum: " + Q)
  };
  H3.prototype.add = function(Q) {
    if (!(Q instanceof k20 && Q.extend !== void 0 || Q instanceof t1A || Q instanceof LO5 || Q instanceof e1A || Q instanceof JJA || Q instanceof H3)) throw TypeError("object must be a valid nested object");
    if (!this.nested) this.nested = {};
    else {
      var B = this.get(Q.name);
      if (B)
        if (B instanceof H3 && Q instanceof H3 && !(B instanceof t1A || B instanceof JJA)) {
          var G = B.nestedArray;
          for (var Z = 0; Z < G.length; ++Z) Q.add(G[Z]);
          if (this.remove(B), !this.nested) this.nested = {};
          Q.setOptions(B.options, !0)
        } else throw Error("duplicate name '" + Q.name + "' in " + this)
    }
    if (this.nested[Q.name] = Q, !(this instanceof t1A || this instanceof JJA || this instanceof e1A || this instanceof k20)) {
      if (!Q._edition) Q._edition = Q._defaultEdition
    }
    this._needsRecursiveFeatureResolution = !0, this._needsRecursiveResolve = !0;
    var I = this;
    while (I = I.parent) I._needsRecursiveFeatureResolution = !0, I._needsRecursiveResolve = !0;
    return Q.onAdd(this), KE2(this)
  };
  H3.prototype.remove = function(Q) {
    if (!(Q instanceof m41)) throw TypeError("object must be a ReflectionObject");
    if (Q.parent !== this) throw Error(Q + " is not a member of " + this);
    if (delete this.nested[Q.name], !Object.keys(this.nested).length) this.nested = void 0;
    return Q.onRemove(this), KE2(this)
  };
  H3.prototype.define = function(Q, B) {
    if (d41.isString(Q)) Q = Q.split(".");
    else if (!Array.isArray(Q)) throw TypeError("illegal path");
    if (Q && Q.length && Q[0] === "") throw Error("path must be relative");
    var G = this;
    while (Q.length > 0) {
      var Z = Q.shift();
      if (G.nested && G.nested[Z]) {
        if (G = G.nested[Z], !(G instanceof H3)) throw Error("path conflicts with non-namespace objects")
      } else G.add(G = new H3(Z))
    }
    if (B) G.addJSON(B);
    return G
  };
  H3.prototype.resolveAll = function() {
    if (!this._needsRecursiveResolve) return this;
    this._resolveFeaturesRecursive(this._edition);
    var Q = this.nestedArray,
      B = 0;
    this.resolve();
    while (B < Q.length)
      if (Q[B] instanceof H3) Q[B++].resolveAll();
      else Q[B++].resolve();
    return this._needsRecursiveResolve = !1, this
  };
  H3.prototype._resolveFeaturesRecursive = function(Q) {
    if (!this._needsRecursiveFeatureResolution) return this;
    return this._needsRecursiveFeatureResolution = !1, Q = this._edition || Q, m41.prototype._resolveFeaturesRecursive.call(this, Q), this.nestedArray.forEach((B) => {
      B._resolveFeaturesRecursive(Q)
    }), this
  };
  H3.prototype.lookup = function(Q, B, G) {
    if (typeof B === "boolean") G = B, B = void 0;
    else if (B && !Array.isArray(B)) B = [B];
    if (d41.isString(Q) && Q.length) {
      if (Q === ".") return this.root;
      Q = Q.split(".")
    } else if (!Q.length) return this;
    var Z = Q.join(".");
    if (Q[0] === "") return this.root.lookup(Q.slice(1), B);
    var I = this.root._fullyQualifiedObjects && this.root._fullyQualifiedObjects["." + Z];
    if (I && (!B || B.indexOf(I.constructor) > -1)) return I;
    if (I = this._lookupImpl(Q, Z), I && (!B || B.indexOf(I.constructor) > -1)) return I;
    if (G) return null;
    var Y = this;
    while (Y.parent) {
      if (I = Y.parent._lookupImpl(Q, Z), I && (!B || B.indexOf(I.constructor) > -1)) return I;
      Y = Y.parent
    }
    return null
  };
  H3.prototype._lookupImpl = function(Q, B) {
    if (Object.prototype.hasOwnProperty.call(this._lookupCache, B)) return this._lookupCache[B];
    var G = this.get(Q[0]),
      Z = null;
    if (G) {
      if (Q.length === 1) Z = G;
      else if (G instanceof H3) Q = Q.slice(1), Z = G._lookupImpl(Q, Q.join("."))
    } else
      for (var I = 0; I < this.nestedArray.length; ++I)
        if (this._nestedArray[I] instanceof H3 && (G = this._nestedArray[I]._lookupImpl(Q, B))) Z = G;
    return this._lookupCache[B] = Z, Z
  };
  H3.prototype.lookupType = function(Q) {
    var B = this.lookup(Q, [t1A]);
    if (!B) throw Error("no such type: " + Q);
    return B
  };
  H3.prototype.lookupEnum = function(Q) {
    var B = this.lookup(Q, [e1A]);
    if (!B) throw Error("no such Enum '" + Q + "' in " + this);
    return B
  };
  H3.prototype.lookupTypeOrEnum = function(Q) {
    var B = this.lookup(Q, [t1A, e1A]);
    if (!B) throw Error("no such Type or Enum '" + Q + "' in " + this);
    return B
  };
  H3.prototype.lookupService = function(Q) {
    var B = this.lookup(Q, [JJA]);
    if (!B) throw Error("no such Service '" + Q + "' in " + this);
    return B
  };
  H3._configure = function(A, Q, B) {
    t1A = A, JJA = Q, e1A = B
  }
})
// @from(Start 10668297, End 10669556)
c41 = z((lcG, HE2) => {
  HE2.exports = Sh;
  var y20 = ni();
  ((Sh.prototype = Object.create(y20.prototype)).constructor = Sh).className = "MapField";
  var MO5 = Q0A(),
    MOA = JK();

  function Sh(A, Q, B, G, Z, I) {
    if (y20.call(this, A, Q, G, void 0, void 0, Z, I), !MOA.isString(B)) throw TypeError("keyType must be a string");
    this.keyType = B, this.resolvedKeyType = null, this.map = !0
  }
  Sh.fromJSON = function(Q, B) {
    return new Sh(Q, B.id, B.keyType, B.type, B.options, B.comment)
  };
  Sh.prototype.toJSON = function(Q) {
    var B = Q ? Boolean(Q.keepComments) : !1;
    return MOA.toObject(["keyType", this.keyType, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", B ? this.comment : void 0])
  };
  Sh.prototype.resolve = function() {
    if (this.resolved) return this;
    if (MO5.mapKey[this.keyType] === void 0) throw Error("invalid key type: " + this.keyType);
    return y20.prototype.resolve.call(this)
  };
  Sh.d = function(Q, B, G) {
    if (typeof G === "function") G = MOA.decorateType(G).name;
    else if (G && typeof G === "object") G = MOA.decorateEnum(G).name;
    return function(I, Y) {
      MOA.decorateType(I.constructor).add(new Sh(Y, Q, B, G))
    }
  }
})
// @from(Start 10669562, End 10671248)
p41 = z((icG, CE2) => {
  CE2.exports = B0A;
  var x20 = ai();
  ((B0A.prototype = Object.create(x20.prototype)).constructor = B0A).className = "Method";
  var XJA = JK();

  function B0A(A, Q, B, G, Z, I, Y, J, W) {
    if (XJA.isObject(Z)) Y = Z, Z = I = void 0;
    else if (XJA.isObject(I)) Y = I, I = void 0;
    if (!(Q === void 0 || XJA.isString(Q))) throw TypeError("type must be a string");
    if (!XJA.isString(B)) throw TypeError("requestType must be a string");
    if (!XJA.isString(G)) throw TypeError("responseType must be a string");
    x20.call(this, A, Y), this.type = Q || "rpc", this.requestType = B, this.requestStream = Z ? !0 : void 0, this.responseType = G, this.responseStream = I ? !0 : void 0, this.resolvedRequestType = null, this.resolvedResponseType = null, this.comment = J, this.parsedOptions = W
  }
  B0A.fromJSON = function(Q, B) {
    return new B0A(Q, B.type, B.requestType, B.responseType, B.requestStream, B.responseStream, B.options, B.comment, B.parsedOptions)
  };
  B0A.prototype.toJSON = function(Q) {
    var B = Q ? Boolean(Q.keepComments) : !1;
    return XJA.toObject(["type", this.type !== "rpc" && this.type || void 0, "requestType", this.requestType, "requestStream", this.requestStream, "responseType", this.responseType, "responseStream", this.responseStream, "options", this.options, "comment", B ? this.comment : void 0, "parsedOptions", this.parsedOptions])
  };
  B0A.prototype.resolve = function() {
    if (this.resolved) return this;
    return this.resolvedRequestType = this.parent.lookupType(this.requestType), this.resolvedResponseType = this.parent.lookupType(this.responseType), x20.prototype.resolve.call(this)
  }
})
// @from(Start 10671254, End 10674135)
l41 = z((ncG, zE2) => {
  zE2.exports = qq;
  var _h = WJA();
  ((qq.prototype = Object.create(_h.prototype)).constructor = qq).className = "Service";
  var v20 = p41(),
    OOA = JK(),
    OO5 = LB0();

  function qq(A, Q) {
    _h.call(this, A, Q), this.methods = {}, this._methodsArray = null
  }
  qq.fromJSON = function(Q, B) {
    var G = new qq(Q, B.options);
    if (B.methods)
      for (var Z = Object.keys(B.methods), I = 0; I < Z.length; ++I) G.add(v20.fromJSON(Z[I], B.methods[Z[I]]));
    if (B.nested) G.addJSON(B.nested);
    if (B.edition) G._edition = B.edition;
    return G.comment = B.comment, G._defaultEdition = "proto3", G
  };
  qq.prototype.toJSON = function(Q) {
    var B = _h.prototype.toJSON.call(this, Q),
      G = Q ? Boolean(Q.keepComments) : !1;
    return OOA.toObject(["edition", this._editionToJSON(), "options", B && B.options || void 0, "methods", _h.arrayToJSON(this.methodsArray, Q) || {}, "nested", B && B.nested || void 0, "comment", G ? this.comment : void 0])
  };
  Object.defineProperty(qq.prototype, "methodsArray", {
    get: function() {
      return this._methodsArray || (this._methodsArray = OOA.toArray(this.methods))
    }
  });

  function EE2(A) {
    return A._methodsArray = null, A
  }
  qq.prototype.get = function(Q) {
    return this.methods[Q] || _h.prototype.get.call(this, Q)
  };
  qq.prototype.resolveAll = function() {
    if (!this._needsRecursiveResolve) return this;
    _h.prototype.resolve.call(this);
    var Q = this.methodsArray;
    for (var B = 0; B < Q.length; ++B) Q[B].resolve();
    return this
  };
  qq.prototype._resolveFeaturesRecursive = function(Q) {
    if (!this._needsRecursiveFeatureResolution) return this;
    return Q = this._edition || Q, _h.prototype._resolveFeaturesRecursive.call(this, Q), this.methodsArray.forEach((B) => {
      B._resolveFeaturesRecursive(Q)
    }), this
  };
  qq.prototype.add = function(Q) {
    if (this.get(Q.name)) throw Error("duplicate name '" + Q.name + "' in " + this);
    if (Q instanceof v20) return this.methods[Q.name] = Q, Q.parent = this, EE2(this);
    return _h.prototype.add.call(this, Q)
  };
  qq.prototype.remove = function(Q) {
    if (Q instanceof v20) {
      if (this.methods[Q.name] !== Q) throw Error(Q + " is not a member of " + this);
      return delete this.methods[Q.name], Q.parent = null, EE2(this)
    }
    return _h.prototype.remove.call(this, Q)
  };
  qq.prototype.create = function(Q, B, G) {
    var Z = new OO5.Service(Q, B, G);
    for (var I = 0, Y; I < this.methodsArray.length; ++I) {
      var J = OOA.lcFirst((Y = this._methodsArray[I]).resolve().name).replace(/[^$\w_]/g, "");
      Z[J] = OOA.codegen(["r", "c"], OOA.isReserved(J) ? J + "_" : J)("return this.rpcCall(m,q,s,r,c)")({
        m: Y,
        q: Y.resolvedRequestType.ctor,
        s: Y.resolvedResponseType.ctor
      })
    }
    return Z
  }
})
// @from(Start 10674141, End 10675005)
i41 = z((acG, UE2) => {
  UE2.exports = Ay;
  var RO5 = rk();

  function Ay(A) {
    if (A)
      for (var Q = Object.keys(A), B = 0; B < Q.length; ++B) this[Q[B]] = A[Q[B]]
  }
  Ay.create = function(Q) {
    return this.$type.create(Q)
  };
  Ay.encode = function(Q, B) {
    return this.$type.encode(Q, B)
  };
  Ay.encodeDelimited = function(Q, B) {
    return this.$type.encodeDelimited(Q, B)
  };
  Ay.decode = function(Q) {
    return this.$type.decode(Q)
  };
  Ay.decodeDelimited = function(Q) {
    return this.$type.decodeDelimited(Q)
  };
  Ay.verify = function(Q) {
    return this.$type.verify(Q)
  };
  Ay.fromObject = function(Q) {
    return this.$type.fromObject(Q)
  };
  Ay.toObject = function(Q, B) {
    return this.$type.toObject(Q, B)
  };
  Ay.prototype.toJSON = function() {
    return this.$type.toObject(this, RO5.toJSONOptions)
  }
})
// @from(Start 10675011, End 10677412)
b20 = z((scG, wE2) => {
  wE2.exports = jO5;
  var TO5 = UP(),
    kh = Q0A(),
    $E2 = JK();

  function PO5(A) {
    return "missing required '" + A.name + "'"
  }

  function jO5(A) {
    var Q = $E2.codegen(["r", "l", "e"], A.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (A.fieldsArray.filter(function(J) {
        return J.map
      }).length ? ",k,value" : ""))("while(r.pos<c){")("var t=r.uint32()")("if(t===e)")("break")("switch(t>>>3){"),
      B = 0;
    for (; B < A.fieldsArray.length; ++B) {
      var G = A._fieldsArray[B].resolve(),
        Z = G.resolvedType instanceof TO5 ? "int32" : G.type,
        I = "m" + $E2.safeProp(G.name);
      if (Q("case %i: {", G.id), G.map) {
        if (Q("if(%s===util.emptyObject)", I)("%s={}", I)("var c2 = r.uint32()+r.pos"), kh.defaults[G.keyType] !== void 0) Q("k=%j", kh.defaults[G.keyType]);
        else Q("k=null");
        if (kh.defaults[Z] !== void 0) Q("value=%j", kh.defaults[Z]);
        else Q("value=null");
        if (Q("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break", G.keyType)("case 2:"), kh.basic[Z] === void 0) Q("value=types[%i].decode(r,r.uint32())", B);
        else Q("value=r.%s()", Z);
        if (Q("break")("default:")("r.skipType(tag2&7)")("break")("}")("}"), kh.long[G.keyType] !== void 0) Q('%s[typeof k==="object"?util.longToHash(k):k]=value', I);
        else Q("%s[k]=value", I)
      } else if (G.repeated) {
        if (Q("if(!(%s&&%s.length))", I, I)("%s=[]", I), kh.packed[Z] !== void 0) Q("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", I, Z)("}else");
        if (kh.basic[Z] === void 0) Q(G.delimited ? "%s.push(types[%i].decode(r,undefined,((t&~7)|4)))" : "%s.push(types[%i].decode(r,r.uint32()))", I, B);
        else Q("%s.push(r.%s())", I, Z)
      } else if (kh.basic[Z] === void 0) Q(G.delimited ? "%s=types[%i].decode(r,undefined,((t&~7)|4))" : "%s=types[%i].decode(r,r.uint32())", I, B);
      else Q("%s=r.%s()", I, Z);
      Q("break")("}")
    }
    Q("default:")("r.skipType(t&7)")("break")("}")("}");
    for (B = 0; B < A._fieldsArray.length; ++B) {
      var Y = A._fieldsArray[B];
      if (Y.required) Q("if(!m.hasOwnProperty(%j))", Y.name)("throw util.ProtocolError(%j,{instance:m})", PO5(Y))
    }
    return Q("return m")
  }
})
// @from(Start 10677418, End 10680780)
g20 = z((rcG, qE2) => {
  qE2.exports = kO5;
  var SO5 = UP(),
    f20 = JK();

  function XO(A, Q) {
    return A.name + ": " + Q + (A.repeated && Q !== "array" ? "[]" : A.map && Q !== "object" ? "{k:" + A.keyType + "}" : "") + " expected"
  }

  function h20(A, Q, B, G) {
    if (Q.resolvedType)
      if (Q.resolvedType instanceof SO5) {
        A("switch(%s){", G)("default:")("return%j", XO(Q, "enum value"));
        for (var Z = Object.keys(Q.resolvedType.values), I = 0; I < Z.length; ++I) A("case %i:", Q.resolvedType.values[Z[I]]);
        A("break")("}")
      } else A("{")("var e=types[%i].verify(%s);", B, G)("if(e)")("return%j+e", Q.name + ".")("}");
    else switch (Q.type) {
      case "int32":
      case "uint32":
      case "sint32":
      case "fixed32":
      case "sfixed32":
        A("if(!util.isInteger(%s))", G)("return%j", XO(Q, "integer"));
        break;
      case "int64":
      case "uint64":
      case "sint64":
      case "fixed64":
      case "sfixed64":
        A("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", G, G, G, G)("return%j", XO(Q, "integer|Long"));
        break;
      case "float":
      case "double":
        A('if(typeof %s!=="number")', G)("return%j", XO(Q, "number"));
        break;
      case "bool":
        A('if(typeof %s!=="boolean")', G)("return%j", XO(Q, "boolean"));
        break;
      case "string":
        A("if(!util.isString(%s))", G)("return%j", XO(Q, "string"));
        break;
      case "bytes":
        A('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', G, G, G)("return%j", XO(Q, "buffer"));
        break
    }
    return A
  }

  function _O5(A, Q, B) {
    switch (Q.keyType) {
      case "int32":
      case "uint32":
      case "sint32":
      case "fixed32":
      case "sfixed32":
        A("if(!util.key32Re.test(%s))", B)("return%j", XO(Q, "integer key"));
        break;
      case "int64":
      case "uint64":
      case "sint64":
      case "fixed64":
      case "sfixed64":
        A("if(!util.key64Re.test(%s))", B)("return%j", XO(Q, "integer|Long key"));
        break;
      case "bool":
        A("if(!util.key2Re.test(%s))", B)("return%j", XO(Q, "boolean key"));
        break
    }
    return A
  }

  function kO5(A) {
    var Q = f20.codegen(["m"], A.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected"),
      B = A.oneofsArray,
      G = {};
    if (B.length) Q("var p={}");
    for (var Z = 0; Z < A.fieldsArray.length; ++Z) {
      var I = A._fieldsArray[Z].resolve(),
        Y = "m" + f20.safeProp(I.name);
      if (I.optional) Q("if(%s!=null&&m.hasOwnProperty(%j)){", Y, I.name);
      if (I.map) Q("if(!util.isObject(%s))", Y)("return%j", XO(I, "object"))("var k=Object.keys(%s)", Y)("for(var i=0;i<k.length;++i){"), _O5(Q, I, "k[i]"), h20(Q, I, Z, Y + "[k[i]]")("}");
      else if (I.repeated) Q("if(!Array.isArray(%s))", Y)("return%j", XO(I, "array"))("for(var i=0;i<%s.length;++i){", Y), h20(Q, I, Z, Y + "[i]")("}");
      else {
        if (I.partOf) {
          var J = f20.safeProp(I.partOf.name);
          if (G[I.partOf.name] === 1) Q("if(p%s===1)", J)("return%j", I.partOf.name + ": multiple values");
          G[I.partOf.name] = 1, Q("p%s=1", J)
        }
        h20(Q, I, Z, Y)
      }
      if (I.optional) Q("}")
    }
    return Q("return null")
  }
})
// @from(Start 10680786, End 10687274)
d20 = z((LE2) => {
  var NE2 = LE2,
    ROA = UP(),
    Qy = JK();

  function u20(A, Q, B, G) {
    var Z = !1;
    if (Q.resolvedType)
      if (Q.resolvedType instanceof ROA) {
        A("switch(d%s){", G);
        for (var I = Q.resolvedType.values, Y = Object.keys(I), J = 0; J < Y.length; ++J) {
          if (I[Y[J]] === Q.typeDefault && !Z) {
            if (A("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}', G, G, G), !Q.repeated) A("break");
            Z = !0
          }
          A("case%j:", Y[J])("case %i:", I[Y[J]])("m%s=%j", G, I[Y[J]])("break")
        }
        A("}")
      } else A('if(typeof d%s!=="object")', G)("throw TypeError(%j)", Q.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", G, B, G);
    else {
      var W = !1;
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
          W = !0;
        case "int64":
        case "sint64":
        case "fixed64":
        case "sfixed64":
          A("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", G, G, W)('else if(typeof d%s==="string")', G)("m%s=parseInt(d%s,10)", G, G)('else if(typeof d%s==="number")', G)("m%s=d%s", G, G)('else if(typeof d%s==="object")', G)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", G, G, G, W ? "true" : "");
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
  NE2.fromObject = function(Q) {
    var B = Q.fieldsArray,
      G = Qy.codegen(["d"], Q.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
    if (!B.length) return G("return new this.ctor");
    G("var m=new this.ctor");
    for (var Z = 0; Z < B.length; ++Z) {
      var I = B[Z].resolve(),
        Y = Qy.safeProp(I.name);
      if (I.map) G("if(d%s){", Y)('if(typeof d%s!=="object")', Y)("throw TypeError(%j)", I.fullName + ": object expected")("m%s={}", Y)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", Y), u20(G, I, Z, Y + "[ks[i]]")("}")("}");
      else if (I.repeated) G("if(d%s){", Y)("if(!Array.isArray(d%s))", Y)("throw TypeError(%j)", I.fullName + ": array expected")("m%s=[]", Y)("for(var i=0;i<d%s.length;++i){", Y), u20(G, I, Z, Y + "[i]")("}")("}");
      else {
        if (!(I.resolvedType instanceof ROA)) G("if(d%s!=null){", Y);
        if (u20(G, I, Z, Y), !(I.resolvedType instanceof ROA)) G("}")
      }
    }
    return G("return m")
  };

  function m20(A, Q, B, G) {
    if (Q.resolvedType)
      if (Q.resolvedType instanceof ROA) A("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", G, B, G, G, B, G, G);
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
  NE2.toObject = function(Q) {
    var B = Q.fieldsArray.slice().sort(Qy.compareFieldsById);
    if (!B.length) return Qy.codegen()("return {}");
    var G = Qy.codegen(["m", "o"], Q.name + "$toObject")("if(!o)")("o={}")("var d={}"),
      Z = [],
      I = [],
      Y = [],
      J = 0;
    for (; J < B.length; ++J)
      if (!B[J].partOf)(B[J].resolve().repeated ? Z : B[J].map ? I : Y).push(B[J]);
    if (Z.length) {
      G("if(o.arrays||o.defaults){");
      for (J = 0; J < Z.length; ++J) G("d%s=[]", Qy.safeProp(Z[J].name));
      G("}")
    }
    if (I.length) {
      G("if(o.objects||o.defaults){");
      for (J = 0; J < I.length; ++J) G("d%s={}", Qy.safeProp(I[J].name));
      G("}")
    }
    if (Y.length) {
      G("if(o.defaults){");
      for (J = 0; J < Y.length; ++J) {
        var W = Y[J],
          X = Qy.safeProp(W.name);
        if (W.resolvedType instanceof ROA) G("d%s=o.enums===String?%j:%j", X, W.resolvedType.valuesById[W.typeDefault], W.typeDefault);
        else if (W.long) G("if(util.Long){")("var n=new util.Long(%i,%i,%j)", W.typeDefault.low, W.typeDefault.high, W.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", X)("}else")("d%s=o.longs===String?%j:%i", X, W.typeDefault.toString(), W.typeDefault.toNumber());
        else if (W.bytes) {
          var V = "[" + Array.prototype.slice.call(W.typeDefault).join(",") + "]";
          G("if(o.bytes===String)d%s=%j", X, String.fromCharCode.apply(String, W.typeDefault))("else{")("d%s=%s", X, V)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", X, X)("}")
        } else G("d%s=%j", X, W.typeDefault)
      }
      G("}")
    }
    var F = !1;
    for (J = 0; J < B.length; ++J) {
      var W = B[J],
        K = Q._fieldsArray.indexOf(W),
        X = Qy.safeProp(W.name);
      if (W.map) {
        if (!F) F = !0, G("var ks2");
        G("if(m%s&&(ks2=Object.keys(m%s)).length){", X, X)("d%s={}", X)("for(var j=0;j<ks2.length;++j){"), m20(G, W, K, X + "[ks2[j]]")("}")
      } else if (W.repeated) G("if(m%s&&m%s.length){", X, X)("d%s=[]", X)("for(var j=0;j<m%s.length;++j){", X), m20(G, W, K, X + "[j]")("}");
      else if (G("if(m%s!=null&&m.hasOwnProperty(%j)){", X, W.name), m20(G, W, K, X), W.partOf) G("if(o.oneofs)")("d%s=%j", Qy.safeProp(W.partOf.name), W.name);
      G("}")
    }
    return G("return d")
  }
})
// @from(Start 10687280, End 10688529)
c20 = z((ME2) => {
  var yO5 = ME2,
    xO5 = i41();
  yO5[".google.protobuf.Any"] = {
    fromObject: function(A) {
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
    toObject: function(A, Q) {
      var B = "type.googleapis.com/",
        G = "",
        Z = "";
      if (Q && Q.json && A.type_url && A.value) {
        Z = A.type_url.substring(A.type_url.lastIndexOf("/") + 1), G = A.type_url.substring(0, A.type_url.lastIndexOf("/") + 1);
        var I = this.lookup(Z);
        if (I) A = I.decode(A.value)
      }
      if (!(A instanceof this.ctor) && A instanceof xO5) {
        var Y = A.$type.toObject(A, Q),
          J = A.$type.fullName[0] === "." ? A.$type.fullName.slice(1) : A.$type.fullName;
        if (G === "") G = B;
        return Z = G + J, Y["@type"] = Z, Y
      }
      return this.toObject(A, Q)
    }
  }
})
// @from(Start 10688535, End 10696945)
s41 = z((ecG, RE2) => {
  RE2.exports = UZ;
  var VO = WJA();
  ((UZ.prototype = Object.create(VO.prototype)).constructor = UZ).className = "Type";
  var vO5 = UP(),
    i20 = A0A(),
    n41 = ni(),
    bO5 = c41(),
    fO5 = l41(),
    p20 = i41(),
    l20 = H41(),
    hO5 = K41(),
    BC = JK(),
    gO5 = n20(),
    uO5 = b20(),
    mO5 = g20(),
    OE2 = d20(),
    dO5 = c20();

  function UZ(A, Q) {
    VO.call(this, A, Q), this.fields = {}, this.oneofs = void 0, this.extensions = void 0, this.reserved = void 0, this.group = void 0, this._fieldsById = null, this._fieldsArray = null, this._oneofsArray = null, this._ctor = null
  }
  Object.defineProperties(UZ.prototype, {
    fieldsById: {
      get: function() {
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
      get: function() {
        return this._fieldsArray || (this._fieldsArray = BC.toArray(this.fields))
      }
    },
    oneofsArray: {
      get: function() {
        return this._oneofsArray || (this._oneofsArray = BC.toArray(this.oneofs))
      }
    },
    ctor: {
      get: function() {
        return this._ctor || (this.ctor = UZ.generateConstructor(this)())
      },
      set: function(A) {
        var Q = A.prototype;
        if (!(Q instanceof p20))(A.prototype = new p20).constructor = A, BC.merge(A.prototype, Q);
        A.$type = A.prototype.$type = this, BC.merge(A, p20, !0), this._ctor = A;
        var B = 0;
        for (; B < this.fieldsArray.length; ++B) this._fieldsArray[B].resolve();
        var G = {};
        for (B = 0; B < this.oneofsArray.length; ++B) G[this._oneofsArray[B].resolve().name] = {
          get: BC.oneOfGetter(this._oneofsArray[B].oneof),
          set: BC.oneOfSetter(this._oneofsArray[B].oneof)
        };
        if (B) Object.defineProperties(A.prototype, G)
      }
    }
  });
  UZ.generateConstructor = function(Q) {
    var B = BC.codegen(["p"], Q.name);
    for (var G = 0, Z; G < Q.fieldsArray.length; ++G)
      if ((Z = Q._fieldsArray[G]).map) B("this%s={}", BC.safeProp(Z.name));
      else if (Z.repeated) B("this%s=[]", BC.safeProp(Z.name));
    return B("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]")
  };

  function a41(A) {
    return A._fieldsById = A._fieldsArray = A._oneofsArray = null, delete A.encode, delete A.decode, delete A.verify, A
  }
  UZ.fromJSON = function(Q, B) {
    var G = new UZ(Q, B.options);
    G.extensions = B.extensions, G.reserved = B.reserved;
    var Z = Object.keys(B.fields),
      I = 0;
    for (; I < Z.length; ++I) G.add((typeof B.fields[Z[I]].keyType < "u" ? bO5.fromJSON : n41.fromJSON)(Z[I], B.fields[Z[I]]));
    if (B.oneofs)
      for (Z = Object.keys(B.oneofs), I = 0; I < Z.length; ++I) G.add(i20.fromJSON(Z[I], B.oneofs[Z[I]]));
    if (B.nested)
      for (Z = Object.keys(B.nested), I = 0; I < Z.length; ++I) {
        var Y = B.nested[Z[I]];
        G.add((Y.id !== void 0 ? n41.fromJSON : Y.fields !== void 0 ? UZ.fromJSON : Y.values !== void 0 ? vO5.fromJSON : Y.methods !== void 0 ? fO5.fromJSON : VO.fromJSON)(Z[I], Y))
      }
    if (B.extensions && B.extensions.length) G.extensions = B.extensions;
    if (B.reserved && B.reserved.length) G.reserved = B.reserved;
    if (B.group) G.group = !0;
    if (B.comment) G.comment = B.comment;
    if (B.edition) G._edition = B.edition;
    return G._defaultEdition = "proto3", G
  };
  UZ.prototype.toJSON = function(Q) {
    var B = VO.prototype.toJSON.call(this, Q),
      G = Q ? Boolean(Q.keepComments) : !1;
    return BC.toObject(["edition", this._editionToJSON(), "options", B && B.options || void 0, "oneofs", VO.arrayToJSON(this.oneofsArray, Q), "fields", VO.arrayToJSON(this.fieldsArray.filter(function(Z) {
      return !Z.declaringField
    }), Q) || {}, "extensions", this.extensions && this.extensions.length ? this.extensions : void 0, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "group", this.group || void 0, "nested", B && B.nested || void 0, "comment", G ? this.comment : void 0])
  };
  UZ.prototype.resolveAll = function() {
    if (!this._needsRecursiveResolve) return this;
    VO.prototype.resolveAll.call(this);
    var Q = this.oneofsArray;
    G = 0;
    while (G < Q.length) Q[G++].resolve();
    var B = this.fieldsArray,
      G = 0;
    while (G < B.length) B[G++].resolve();
    return this
  };
  UZ.prototype._resolveFeaturesRecursive = function(Q) {
    if (!this._needsRecursiveFeatureResolution) return this;
    return Q = this._edition || Q, VO.prototype._resolveFeaturesRecursive.call(this, Q), this.oneofsArray.forEach((B) => {
      B._resolveFeatures(Q)
    }), this.fieldsArray.forEach((B) => {
      B._resolveFeatures(Q)
    }), this
  };
  UZ.prototype.get = function(Q) {
    return this.fields[Q] || this.oneofs && this.oneofs[Q] || this.nested && this.nested[Q] || null
  };
  UZ.prototype.add = function(Q) {
    if (this.get(Q.name)) throw Error("duplicate name '" + Q.name + "' in " + this);
    if (Q instanceof n41 && Q.extend === void 0) {
      if (this._fieldsById ? this._fieldsById[Q.id] : this.fieldsById[Q.id]) throw Error("duplicate id " + Q.id + " in " + this);
      if (this.isReservedId(Q.id)) throw Error("id " + Q.id + " is reserved in " + this);
      if (this.isReservedName(Q.name)) throw Error("name '" + Q.name + "' is reserved in " + this);
      if (Q.parent) Q.parent.remove(Q);
      return this.fields[Q.name] = Q, Q.message = this, Q.onAdd(this), a41(this)
    }
    if (Q instanceof i20) {
      if (!this.oneofs) this.oneofs = {};
      return this.oneofs[Q.name] = Q, Q.onAdd(this), a41(this)
    }
    return VO.prototype.add.call(this, Q)
  };
  UZ.prototype.remove = function(Q) {
    if (Q instanceof n41 && Q.extend === void 0) {
      if (!this.fields || this.fields[Q.name] !== Q) throw Error(Q + " is not a member of " + this);
      return delete this.fields[Q.name], Q.parent = null, Q.onRemove(this), a41(this)
    }
    if (Q instanceof i20) {
      if (!this.oneofs || this.oneofs[Q.name] !== Q) throw Error(Q + " is not a member of " + this);
      return delete this.oneofs[Q.name], Q.parent = null, Q.onRemove(this), a41(this)
    }
    return VO.prototype.remove.call(this, Q)
  };
  UZ.prototype.isReservedId = function(Q) {
    return VO.isReservedId(this.reserved, Q)
  };
  UZ.prototype.isReservedName = function(Q) {
    return VO.isReservedName(this.reserved, Q)
  };
  UZ.prototype.create = function(Q) {
    return new this.ctor(Q)
  };
  UZ.prototype.setup = function() {
    var Q = this.fullName,
      B = [];
    for (var G = 0; G < this.fieldsArray.length; ++G) B.push(this._fieldsArray[G].resolve().resolvedType);
    this.encode = gO5(this)({
      Writer: hO5,
      types: B,
      util: BC
    }), this.decode = uO5(this)({
      Reader: l20,
      types: B,
      util: BC
    }), this.verify = mO5(this)({
      types: B,
      util: BC
    }), this.fromObject = OE2.fromObject(this)({
      types: B,
      util: BC
    }), this.toObject = OE2.toObject(this)({
      types: B,
      util: BC
    });
    var Z = dO5[Q];
    if (Z) {
      var I = Object.create(this);
      I.fromObject = this.fromObject, this.fromObject = Z.fromObject.bind(I), I.toObject = this.toObject, this.toObject = Z.toObject.bind(I)
    }
    return this
  };
  UZ.prototype.encode = function(Q, B) {
    return this.setup().encode(Q, B)
  };
  UZ.prototype.encodeDelimited = function(Q, B) {
    return this.encode(Q, B && B.len ? B.fork() : B).ldelim()
  };
  UZ.prototype.decode = function(Q, B) {
    return this.setup().decode(Q, B)
  };
  UZ.prototype.decodeDelimited = function(Q) {
    if (!(Q instanceof l20)) Q = l20.create(Q);
    return this.decode(Q, Q.uint32())
  };
  UZ.prototype.verify = function(Q) {
    return this.setup().verify(Q)
  };
  UZ.prototype.fromObject = function(Q) {
    return this.setup().fromObject(Q)
  };
  UZ.prototype.toObject = function(Q, B) {
    return this.setup().toObject(Q, B)
  };
  UZ.d = function(Q) {
    return function(G) {
      BC.decorateType(G, Q)
    }
  }
})
// @from(Start 10696951, End 10701907)
e41 = z((ApG, jE2) => {
  jE2.exports = Nq;
  var t41 = WJA();
  ((Nq.prototype = Object.create(t41.prototype)).constructor = Nq).className = "Root";
  var r41 = ni(),
    a20 = UP(),
    cO5 = A0A(),
    si = JK(),
    s20, r20, TOA;

  function Nq(A) {
    t41.call(this, "", A), this.deferred = [], this.files = [], this._edition = "proto2", this._fullyQualifiedObjects = {}
  }
  Nq.fromJSON = function(Q, B) {
    if (!B) B = new Nq;
    if (Q.options) B.setOptions(Q.options);
    return B.addJSON(Q.nested).resolveAll()
  };
  Nq.prototype.resolvePath = si.path.resolve;
  Nq.prototype.fetch = si.fetch;

  function PE2() {}
  Nq.prototype.load = function A(Q, B, G) {
    if (typeof B === "function") G = B, B = void 0;
    var Z = this;
    if (!G) return si.asPromise(A, Z, Q, B);
    var I = G === PE2;

    function Y(D, H) {
      if (!G) return;
      if (I) throw D;
      if (H) H.resolveAll();
      var C = G;
      G = null, C(D, H)
    }

    function J(D) {
      var H = D.lastIndexOf("google/protobuf/");
      if (H > -1) {
        var C = D.substring(H);
        if (C in TOA) return C
      }
      return null
    }

    function W(D, H) {
      try {
        if (si.isString(H) && H.charAt(0) === "{") H = JSON.parse(H);
        if (!si.isString(H)) Z.setOptions(H.options).addJSON(H.nested);
        else {
          r20.filename = D;
          var C = r20(H, Z, B),
            E, U = 0;
          if (C.imports) {
            for (; U < C.imports.length; ++U)
              if (E = J(C.imports[U]) || Z.resolvePath(D, C.imports[U])) X(E)
          }
          if (C.weakImports) {
            for (U = 0; U < C.weakImports.length; ++U)
              if (E = J(C.weakImports[U]) || Z.resolvePath(D, C.weakImports[U])) X(E, !0)
          }
        }
      } catch (q) {
        Y(q)
      }
      if (!I && !V) Y(null, Z)
    }

    function X(D, H) {
      if (D = J(D) || D, Z.files.indexOf(D) > -1) return;
      if (Z.files.push(D), D in TOA) {
        if (I) W(D, TOA[D]);
        else ++V, setTimeout(function() {
          --V, W(D, TOA[D])
        });
        return
      }
      if (I) {
        var C;
        try {
          C = si.fs.readFileSync(D).toString("utf8")
        } catch (E) {
          if (!H) Y(E);
          return
        }
        W(D, C)
      } else ++V, Z.fetch(D, function(E, U) {
        if (--V, !G) return;
        if (E) {
          if (!H) Y(E);
          else if (!V) Y(null, Z);
          return
        }
        W(D, U)
      })
    }
    var V = 0;
    if (si.isString(Q)) Q = [Q];
    for (var F = 0, K; F < Q.length; ++F)
      if (K = Z.resolvePath("", Q[F])) X(K);
    if (I) return Z.resolveAll(), Z;
    if (!V) Y(null, Z);
    return Z
  };
  Nq.prototype.loadSync = function(Q, B) {
    if (!si.isNode) throw Error("not supported");
    return this.load(Q, B, PE2)
  };
  Nq.prototype.resolveAll = function() {
    if (!this._needsRecursiveResolve) return this;
    if (this.deferred.length) throw Error("unresolvable extensions: " + this.deferred.map(function(Q) {
      return "'extend " + Q.extend + "' in " + Q.parent.fullName
    }).join(", "));
    return t41.prototype.resolveAll.call(this)
  };
  var o41 = /^[A-Z]/;

  function TE2(A, Q) {
    var B = Q.parent.lookup(Q.extend);
    if (B) {
      var G = new r41(Q.fullName, Q.id, Q.type, Q.rule, void 0, Q.options);
      if (B.get(G.name)) return !0;
      return G.declaringField = Q, Q.extensionField = G, B.add(G), !0
    }
    return !1
  }
  Nq.prototype._handleAdd = function(Q) {
    if (Q instanceof r41) {
      if (Q.extend !== void 0 && !Q.extensionField) {
        if (!TE2(this, Q)) this.deferred.push(Q)
      }
    } else if (Q instanceof a20) {
      if (o41.test(Q.name)) Q.parent[Q.name] = Q.values
    } else if (!(Q instanceof cO5)) {
      if (Q instanceof s20)
        for (var B = 0; B < this.deferred.length;)
          if (TE2(this, this.deferred[B])) this.deferred.splice(B, 1);
          else ++B;
      for (var G = 0; G < Q.nestedArray.length; ++G) this._handleAdd(Q._nestedArray[G]);
      if (o41.test(Q.name)) Q.parent[Q.name] = Q
    }
    if (Q instanceof s20 || Q instanceof a20 || Q instanceof r41) this._fullyQualifiedObjects[Q.fullName] = Q
  };
  Nq.prototype._handleRemove = function(Q) {
    if (Q instanceof r41) {
      if (Q.extend !== void 0)
        if (Q.extensionField) Q.extensionField.parent.remove(Q.extensionField), Q.extensionField = null;
        else {
          var B = this.deferred.indexOf(Q);
          if (B > -1) this.deferred.splice(B, 1)
        }
    } else if (Q instanceof a20) {
      if (o41.test(Q.name)) delete Q.parent[Q.name]
    } else if (Q instanceof t41) {
      for (var G = 0; G < Q.nestedArray.length; ++G) this._handleRemove(Q._nestedArray[G]);
      if (o41.test(Q.name)) delete Q.parent[Q.name]
    }
    delete this._fullyQualifiedObjects[Q.fullName]
  };
  Nq._configure = function(A, Q, B) {
    s20 = A, r20 = Q, TOA = B
  }
})
// @from(Start 10701913, End 10704805)
JK = z((QpG, _E2) => {
  var xW = _E2.exports = rk(),
    SE2 = MB0(),
    o20, t20;
  xW.codegen = IE2();
  xW.fetch = JE2();
  xW.path = VE2();
  xW.fs = xW.inquire("fs");
  xW.toArray = function(Q) {
    if (Q) {
      var B = Object.keys(Q),
        G = Array(B.length),
        Z = 0;
      while (Z < B.length) G[Z] = Q[B[Z++]];
      return G
    }
    return []
  };
  xW.toObject = function(Q) {
    var B = {},
      G = 0;
    while (G < Q.length) {
      var Z = Q[G++],
        I = Q[G++];
      if (I !== void 0) B[Z] = I
    }
    return B
  };
  var pO5 = /\\/g,
    lO5 = /"/g;
  xW.isReserved = function(Q) {
    return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(Q)
  };
  xW.safeProp = function(Q) {
    if (!/^[$\w_]+$/.test(Q) || xW.isReserved(Q)) return '["' + Q.replace(pO5, "\\\\").replace(lO5, "\\\"") + '"]';
    return "." + Q
  };
  xW.ucFirst = function(Q) {
    return Q.charAt(0).toUpperCase() + Q.substring(1)
  };
  var iO5 = /_([a-z])/g;
  xW.camelCase = function(Q) {
    return Q.substring(0, 1) + Q.substring(1).replace(iO5, function(B, G) {
      return G.toUpperCase()
    })
  };
  xW.compareFieldsById = function(Q, B) {
    return Q.id - B.id
  };
  xW.decorateType = function(Q, B) {
    if (Q.$type) {
      if (B && Q.$type.name !== B) xW.decorateRoot.remove(Q.$type), Q.$type.name = B, xW.decorateRoot.add(Q.$type);
      return Q.$type
    }
    if (!o20) o20 = s41();
    var G = new o20(B || Q.name);
    return xW.decorateRoot.add(G), G.ctor = Q, Object.defineProperty(Q, "$type", {
      value: G,
      enumerable: !1
    }), Object.defineProperty(Q.prototype, "$type", {
      value: G,
      enumerable: !1
    }), G
  };
  var nO5 = 0;
  xW.decorateEnum = function(Q) {
    if (Q.$type) return Q.$type;
    if (!t20) t20 = UP();
    var B = new t20("Enum" + nO5++, Q);
    return xW.decorateRoot.add(B), Object.defineProperty(Q, "$type", {
      value: B,
      enumerable: !1
    }), B
  };
  xW.setProperty = function(Q, B, G, Z) {
    function I(Y, J, W) {
      var X = J.shift();
      if (X === "__proto__" || X === "prototype") return Y;
      if (J.length > 0) Y[X] = I(Y[X] || {}, J, W);
      else {
        var V = Y[X];
        if (V && Z) return Y;
        if (V) W = [].concat(V).concat(W);
        Y[X] = W
      }
      return Y
    }
    if (typeof Q !== "object") throw TypeError("dst must be an object");
    if (!B) throw TypeError("path must be specified");
    return B = B.split("."), I(Q, B, G)
  };
  Object.defineProperty(xW, "decorateRoot", {
    get: function() {
      return SE2.decorated || (SE2.decorated = new(e41()))
    }
  })
})
// @from(Start 10704811, End 10705473)
Q0A = z((kE2) => {
  var POA = kE2,
    aO5 = JK(),
    sO5 = ["double", "float", "int32", "uint32", "sint32", "fixed32", "sfixed32", "int64", "uint64", "sint64", "fixed64", "sfixed64", "bool", "string", "bytes"];

  function jOA(A, Q) {
    var B = 0,
      G = {};
    Q |= 0;
    while (B < A.length) G[sO5[B + Q]] = A[B++];
    return G
  }
  POA.basic = jOA([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2, 2]);
  POA.defaults = jOA([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, !1, "", aO5.emptyArray, null]);
  POA.long = jOA([0, 0, 0, 1, 1], 7);
  POA.mapKey = jOA([0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2], 2);
  POA.packed = jOA([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0])
})