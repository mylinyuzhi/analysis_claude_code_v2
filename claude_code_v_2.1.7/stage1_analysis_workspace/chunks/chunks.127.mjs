
// @from(Ln 373323, Col 4)
kfA = U((DXY, ln2) => {
  var Aw0 = H8();
  ln2.exports = Aw0.jsbn = Aw0.jsbn || {};
  var uc, IA7 = 244837814094590,
    hn2 = (IA7 & 16777215) == 15715070;

  function cQ(A, Q, B) {
    if (this.data = [], A != null)
      if (typeof A == "number") this.fromNumber(A, Q, B);
      else if (Q == null && typeof A != "string") this.fromString(A, 256);
    else this.fromString(A, Q)
  }
  Aw0.jsbn.BigInteger = cQ;

  function j7() {
    return new cQ(null)
  }

  function DA7(A, Q, B, G, Z, Y) {
    while (--Y >= 0) {
      var J = Q * this.data[A++] + B.data[G] + Z;
      Z = Math.floor(J / 67108864), B.data[G++] = J & 67108863
    }
    return Z
  }

  function WA7(A, Q, B, G, Z, Y) {
    var J = Q & 32767,
      X = Q >> 15;
    while (--Y >= 0) {
      var I = this.data[A] & 32767,
        D = this.data[A++] >> 15,
        W = X * I + D * J;
      I = J * I + ((W & 32767) << 15) + B.data[G] + (Z & 1073741823), Z = (I >>> 30) + (W >>> 15) + X * D + (Z >>> 30), B.data[G++] = I & 1073741823
    }
    return Z
  }

  function gn2(A, Q, B, G, Z, Y) {
    var J = Q & 16383,
      X = Q >> 14;
    while (--Y >= 0) {
      var I = this.data[A] & 16383,
        D = this.data[A++] >> 14,
        W = X * I + D * J;
      I = J * I + ((W & 16383) << 14) + B.data[G] + Z, Z = (I >> 28) + (W >> 14) + X * D, B.data[G++] = I & 268435455
    }
    return Z
  }
  if (typeof navigator > "u") cQ.prototype.am = gn2, uc = 28;
  else if (hn2 && navigator.appName == "Microsoft Internet Explorer") cQ.prototype.am = WA7, uc = 30;
  else if (hn2 && navigator.appName != "Netscape") cQ.prototype.am = DA7, uc = 26;
  else cQ.prototype.am = gn2, uc = 28;
  cQ.prototype.DB = uc;
  cQ.prototype.DM = (1 << uc) - 1;
  cQ.prototype.DV = 1 << uc;
  var Qw0 = 52;
  cQ.prototype.FV = Math.pow(2, Qw0);
  cQ.prototype.F1 = Qw0 - uc;
  cQ.prototype.F2 = 2 * uc - Qw0;
  var KA7 = "0123456789abcdefghijklmnopqrstuvwxyz",
    oV1 = [],
    MEA, Ij;
  MEA = 48;
  for (Ij = 0; Ij <= 9; ++Ij) oV1[MEA++] = Ij;
  MEA = 97;
  for (Ij = 10; Ij < 36; ++Ij) oV1[MEA++] = Ij;
  MEA = 65;
  for (Ij = 10; Ij < 36; ++Ij) oV1[MEA++] = Ij;

  function un2(A) {
    return KA7.charAt(A)
  }

  function mn2(A, Q) {
    var B = oV1[A.charCodeAt(Q)];
    return B == null ? -1 : B
  }

  function VA7(A) {
    for (var Q = this.t - 1; Q >= 0; --Q) A.data[Q] = this.data[Q];
    A.t = this.t, A.s = this.s
  }

  function FA7(A) {
    if (this.t = 1, this.s = A < 0 ? -1 : 0, A > 0) this.data[0] = A;
    else if (A < -1) this.data[0] = A + this.DV;
    else this.t = 0
  }

  function vt(A) {
    var Q = j7();
    return Q.fromInt(A), Q
  }

  function HA7(A, Q) {
    var B;
    if (Q == 16) B = 4;
    else if (Q == 8) B = 3;
    else if (Q == 256) B = 8;
    else if (Q == 2) B = 1;
    else if (Q == 32) B = 5;
    else if (Q == 4) B = 2;
    else {
      this.fromRadix(A, Q);
      return
    }
    this.t = 0, this.s = 0;
    var G = A.length,
      Z = !1,
      Y = 0;
    while (--G >= 0) {
      var J = B == 8 ? A[G] & 255 : mn2(A, G);
      if (J < 0) {
        if (A.charAt(G) == "-") Z = !0;
        continue
      }
      if (Z = !1, Y == 0) this.data[this.t++] = J;
      else if (Y + B > this.DB) this.data[this.t - 1] |= (J & (1 << this.DB - Y) - 1) << Y, this.data[this.t++] = J >> this.DB - Y;
      else this.data[this.t - 1] |= J << Y;
      if (Y += B, Y >= this.DB) Y -= this.DB
    }
    if (B == 8 && (A[0] & 128) != 0) {
      if (this.s = -1, Y > 0) this.data[this.t - 1] |= (1 << this.DB - Y) - 1 << Y
    }
    if (this.clamp(), Z) cQ.ZERO.subTo(this, this)
  }

  function EA7() {
    var A = this.s & this.DM;
    while (this.t > 0 && this.data[this.t - 1] == A) --this.t
  }

  function zA7(A) {
    if (this.s < 0) return "-" + this.negate().toString(A);
    var Q;
    if (A == 16) Q = 4;
    else if (A == 8) Q = 3;
    else if (A == 2) Q = 1;
    else if (A == 32) Q = 5;
    else if (A == 4) Q = 2;
    else return this.toRadix(A);
    var B = (1 << Q) - 1,
      G, Z = !1,
      Y = "",
      J = this.t,
      X = this.DB - J * this.DB % Q;
    if (J-- > 0) {
      if (X < this.DB && (G = this.data[J] >> X) > 0) Z = !0, Y = un2(G);
      while (J >= 0) {
        if (X < Q) G = (this.data[J] & (1 << X) - 1) << Q - X, G |= this.data[--J] >> (X += this.DB - Q);
        else if (G = this.data[J] >> (X -= Q) & B, X <= 0) X += this.DB, --J;
        if (G > 0) Z = !0;
        if (Z) Y += un2(G)
      }
    }
    return Z ? Y : "0"
  }

  function $A7() {
    var A = j7();
    return cQ.ZERO.subTo(this, A), A
  }

  function CA7() {
    return this.s < 0 ? this.negate() : this
  }

  function UA7(A) {
    var Q = this.s - A.s;
    if (Q != 0) return Q;
    var B = this.t;
    if (Q = B - A.t, Q != 0) return this.s < 0 ? -Q : Q;
    while (--B >= 0)
      if ((Q = this.data[B] - A.data[B]) != 0) return Q;
    return 0
  }

  function rV1(A) {
    var Q = 1,
      B;
    if ((B = A >>> 16) != 0) A = B, Q += 16;
    if ((B = A >> 8) != 0) A = B, Q += 8;
    if ((B = A >> 4) != 0) A = B, Q += 4;
    if ((B = A >> 2) != 0) A = B, Q += 2;
    if ((B = A >> 1) != 0) A = B, Q += 1;
    return Q
  }

  function qA7() {
    if (this.t <= 0) return 0;
    return this.DB * (this.t - 1) + rV1(this.data[this.t - 1] ^ this.s & this.DM)
  }

  function NA7(A, Q) {
    var B;
    for (B = this.t - 1; B >= 0; --B) Q.data[B + A] = this.data[B];
    for (B = A - 1; B >= 0; --B) Q.data[B] = 0;
    Q.t = this.t + A, Q.s = this.s
  }

  function wA7(A, Q) {
    for (var B = A; B < this.t; ++B) Q.data[B - A] = this.data[B];
    Q.t = Math.max(this.t - A, 0), Q.s = this.s
  }

  function LA7(A, Q) {
    var B = A % this.DB,
      G = this.DB - B,
      Z = (1 << G) - 1,
      Y = Math.floor(A / this.DB),
      J = this.s << B & this.DM,
      X;
    for (X = this.t - 1; X >= 0; --X) Q.data[X + Y + 1] = this.data[X] >> G | J, J = (this.data[X] & Z) << B;
    for (X = Y - 1; X >= 0; --X) Q.data[X] = 0;
    Q.data[Y] = J, Q.t = this.t + Y + 1, Q.s = this.s, Q.clamp()
  }

  function OA7(A, Q) {
    Q.s = this.s;
    var B = Math.floor(A / this.DB);
    if (B >= this.t) {
      Q.t = 0;
      return
    }
    var G = A % this.DB,
      Z = this.DB - G,
      Y = (1 << G) - 1;
    Q.data[0] = this.data[B] >> G;
    for (var J = B + 1; J < this.t; ++J) Q.data[J - B - 1] |= (this.data[J] & Y) << Z, Q.data[J - B] = this.data[J] >> G;
    if (G > 0) Q.data[this.t - B - 1] |= (this.s & Y) << Z;
    Q.t = this.t - B, Q.clamp()
  }

  function MA7(A, Q) {
    var B = 0,
      G = 0,
      Z = Math.min(A.t, this.t);
    while (B < Z) G += this.data[B] - A.data[B], Q.data[B++] = G & this.DM, G >>= this.DB;
    if (A.t < this.t) {
      G -= A.s;
      while (B < this.t) G += this.data[B], Q.data[B++] = G & this.DM, G >>= this.DB;
      G += this.s
    } else {
      G += this.s;
      while (B < A.t) G -= A.data[B], Q.data[B++] = G & this.DM, G >>= this.DB;
      G -= A.s
    }
    if (Q.s = G < 0 ? -1 : 0, G < -1) Q.data[B++] = this.DV + G;
    else if (G > 0) Q.data[B++] = G;
    Q.t = B, Q.clamp()
  }

  function RA7(A, Q) {
    var B = this.abs(),
      G = A.abs(),
      Z = B.t;
    Q.t = Z + G.t;
    while (--Z >= 0) Q.data[Z] = 0;
    for (Z = 0; Z < G.t; ++Z) Q.data[Z + B.t] = B.am(0, G.data[Z], Q, Z, 0, B.t);
    if (Q.s = 0, Q.clamp(), this.s != A.s) cQ.ZERO.subTo(Q, Q)
  }

  function _A7(A) {
    var Q = this.abs(),
      B = A.t = 2 * Q.t;
    while (--B >= 0) A.data[B] = 0;
    for (B = 0; B < Q.t - 1; ++B) {
      var G = Q.am(B, Q.data[B], A, 2 * B, 0, 1);
      if ((A.data[B + Q.t] += Q.am(B + 1, 2 * Q.data[B], A, 2 * B + 1, G, Q.t - B - 1)) >= Q.DV) A.data[B + Q.t] -= Q.DV, A.data[B + Q.t + 1] = 1
    }
    if (A.t > 0) A.data[A.t - 1] += Q.am(B, Q.data[B], A, 2 * B, 0, 1);
    A.s = 0, A.clamp()
  }

  function jA7(A, Q, B) {
    var G = A.abs();
    if (G.t <= 0) return;
    var Z = this.abs();
    if (Z.t < G.t) {
      if (Q != null) Q.fromInt(0);
      if (B != null) this.copyTo(B);
      return
    }
    if (B == null) B = j7();
    var Y = j7(),
      J = this.s,
      X = A.s,
      I = this.DB - rV1(G.data[G.t - 1]);
    if (I > 0) G.lShiftTo(I, Y), Z.lShiftTo(I, B);
    else G.copyTo(Y), Z.copyTo(B);
    var D = Y.t,
      W = Y.data[D - 1];
    if (W == 0) return;
    var K = W * (1 << this.F1) + (D > 1 ? Y.data[D - 2] >> this.F2 : 0),
      V = this.FV / K,
      F = (1 << this.F1) / K,
      H = 1 << this.F2,
      E = B.t,
      z = E - D,
      $ = Q == null ? j7() : Q;
    if (Y.dlShiftTo(z, $), B.compareTo($) >= 0) B.data[B.t++] = 1, B.subTo($, B);
    cQ.ONE.dlShiftTo(D, $), $.subTo(Y, Y);
    while (Y.t < D) Y.data[Y.t++] = 0;
    while (--z >= 0) {
      var O = B.data[--E] == W ? this.DM : Math.floor(B.data[E] * V + (B.data[E - 1] + H) * F);
      if ((B.data[E] += Y.am(0, O, B, z, 0, D)) < O) {
        Y.dlShiftTo(z, $), B.subTo($, B);
        while (B.data[E] < --O) B.subTo($, B)
      }
    }
    if (Q != null) {
      if (B.drShiftTo(D, Q), J != X) cQ.ZERO.subTo(Q, Q)
    }
    if (B.t = D, B.clamp(), I > 0) B.rShiftTo(I, B);
    if (J < 0) cQ.ZERO.subTo(B, B)
  }

  function TA7(A) {
    var Q = j7();
    if (this.abs().divRemTo(A, null, Q), this.s < 0 && Q.compareTo(cQ.ZERO) > 0) A.subTo(Q, Q);
    return Q
  }

  function X3A(A) {
    this.m = A
  }

  function PA7(A) {
    if (A.s < 0 || A.compareTo(this.m) >= 0) return A.mod(this.m);
    else return A
  }

  function SA7(A) {
    return A
  }

  function xA7(A) {
    A.divRemTo(this.m, null, A)
  }

  function yA7(A, Q, B) {
    A.multiplyTo(Q, B), this.reduce(B)
  }

  function vA7(A, Q) {
    A.squareTo(Q), this.reduce(Q)
  }
  X3A.prototype.convert = PA7;
  X3A.prototype.revert = SA7;
  X3A.prototype.reduce = xA7;
  X3A.prototype.mulTo = yA7;
  X3A.prototype.sqrTo = vA7;

  function kA7() {
    if (this.t < 1) return 0;
    var A = this.data[0];
    if ((A & 1) == 0) return 0;
    var Q = A & 3;
    return Q = Q * (2 - (A & 15) * Q) & 15, Q = Q * (2 - (A & 255) * Q) & 255, Q = Q * (2 - ((A & 65535) * Q & 65535)) & 65535, Q = Q * (2 - A * Q % this.DV) % this.DV, Q > 0 ? this.DV - Q : -Q
  }

  function I3A(A) {
    this.m = A, this.mp = A.invDigit(), this.mpl = this.mp & 32767, this.mph = this.mp >> 15, this.um = (1 << A.DB - 15) - 1, this.mt2 = 2 * A.t
  }

  function bA7(A) {
    var Q = j7();
    if (A.abs().dlShiftTo(this.m.t, Q), Q.divRemTo(this.m, null, Q), A.s < 0 && Q.compareTo(cQ.ZERO) > 0) this.m.subTo(Q, Q);
    return Q
  }

  function fA7(A) {
    var Q = j7();
    return A.copyTo(Q), this.reduce(Q), Q
  }

  function hA7(A) {
    while (A.t <= this.mt2) A.data[A.t++] = 0;
    for (var Q = 0; Q < this.m.t; ++Q) {
      var B = A.data[Q] & 32767,
        G = B * this.mpl + ((B * this.mph + (A.data[Q] >> 15) * this.mpl & this.um) << 15) & A.DM;
      B = Q + this.m.t, A.data[B] += this.m.am(0, G, A, Q, 0, this.m.t);
      while (A.data[B] >= A.DV) A.data[B] -= A.DV, A.data[++B]++
    }
    if (A.clamp(), A.drShiftTo(this.m.t, A), A.compareTo(this.m) >= 0) A.subTo(this.m, A)
  }

  function gA7(A, Q) {
    A.squareTo(Q), this.reduce(Q)
  }

  function uA7(A, Q, B) {
    A.multiplyTo(Q, B), this.reduce(B)
  }
  I3A.prototype.convert = bA7;
  I3A.prototype.revert = fA7;
  I3A.prototype.reduce = hA7;
  I3A.prototype.mulTo = uA7;
  I3A.prototype.sqrTo = gA7;

  function mA7() {
    return (this.t > 0 ? this.data[0] & 1 : this.s) == 0
  }

  function dA7(A, Q) {
    if (A > 4294967295 || A < 1) return cQ.ONE;
    var B = j7(),
      G = j7(),
      Z = Q.convert(this),
      Y = rV1(A) - 1;
    Z.copyTo(B);
    while (--Y >= 0)
      if (Q.sqrTo(B, G), (A & 1 << Y) > 0) Q.mulTo(G, Z, B);
      else {
        var J = B;
        B = G, G = J
      } return Q.revert(B)
  }

  function cA7(A, Q) {
    var B;
    if (A < 256 || Q.isEven()) B = new X3A(Q);
    else B = new I3A(Q);
    return this.exp(A, B)
  }
  cQ.prototype.copyTo = VA7;
  cQ.prototype.fromInt = FA7;
  cQ.prototype.fromString = HA7;
  cQ.prototype.clamp = EA7;
  cQ.prototype.dlShiftTo = NA7;
  cQ.prototype.drShiftTo = wA7;
  cQ.prototype.lShiftTo = LA7;
  cQ.prototype.rShiftTo = OA7;
  cQ.prototype.subTo = MA7;
  cQ.prototype.multiplyTo = RA7;
  cQ.prototype.squareTo = _A7;
  cQ.prototype.divRemTo = jA7;
  cQ.prototype.invDigit = kA7;
  cQ.prototype.isEven = mA7;
  cQ.prototype.exp = dA7;
  cQ.prototype.toString = zA7;
  cQ.prototype.negate = $A7;
  cQ.prototype.abs = CA7;
  cQ.prototype.compareTo = UA7;
  cQ.prototype.bitLength = qA7;
  cQ.prototype.mod = TA7;
  cQ.prototype.modPowInt = cA7;
  cQ.ZERO = vt(0);
  cQ.ONE = vt(1);

  function pA7() {
    var A = j7();
    return this.copyTo(A), A
  }

  function lA7() {
    if (this.s < 0) {
      if (this.t == 1) return this.data[0] - this.DV;
      else if (this.t == 0) return -1
    } else if (this.t == 1) return this.data[0];
    else if (this.t == 0) return 0;
    return (this.data[1] & (1 << 32 - this.DB) - 1) << this.DB | this.data[0]
  }

  function iA7() {
    return this.t == 0 ? this.s : this.data[0] << 24 >> 24
  }

  function nA7() {
    return this.t == 0 ? this.s : this.data[0] << 16 >> 16
  }

  function aA7(A) {
    return Math.floor(Math.LN2 * this.DB / Math.log(A))
  }

  function oA7() {
    if (this.s < 0) return -1;
    else if (this.t <= 0 || this.t == 1 && this.data[0] <= 0) return 0;
    else return 1
  }

  function rA7(A) {
    if (A == null) A = 10;
    if (this.signum() == 0 || A < 2 || A > 36) return "0";
    var Q = this.chunkSize(A),
      B = Math.pow(A, Q),
      G = vt(B),
      Z = j7(),
      Y = j7(),
      J = "";
    this.divRemTo(G, Z, Y);
    while (Z.signum() > 0) J = (B + Y.intValue()).toString(A).substr(1) + J, Z.divRemTo(G, Z, Y);
    return Y.intValue().toString(A) + J
  }

  function sA7(A, Q) {
    if (this.fromInt(0), Q == null) Q = 10;
    var B = this.chunkSize(Q),
      G = Math.pow(Q, B),
      Z = !1,
      Y = 0,
      J = 0;
    for (var X = 0; X < A.length; ++X) {
      var I = mn2(A, X);
      if (I < 0) {
        if (A.charAt(X) == "-" && this.signum() == 0) Z = !0;
        continue
      }
      if (J = Q * J + I, ++Y >= B) this.dMultiply(G), this.dAddOffset(J, 0), Y = 0, J = 0
    }
    if (Y > 0) this.dMultiply(Math.pow(Q, Y)), this.dAddOffset(J, 0);
    if (Z) cQ.ZERO.subTo(this, this)
  }

  function tA7(A, Q, B) {
    if (typeof Q == "number")
      if (A < 2) this.fromInt(1);
      else {
        if (this.fromNumber(A, B), !this.testBit(A - 1)) this.bitwiseTo(cQ.ONE.shiftLeft(A - 1), Bw0, this);
        if (this.isEven()) this.dAddOffset(1, 0);
        while (!this.isProbablePrime(Q))
          if (this.dAddOffset(2, 0), this.bitLength() > A) this.subTo(cQ.ONE.shiftLeft(A - 1), this)
      }
    else {
      var G = [],
        Z = A & 7;
      if (G.length = (A >> 3) + 1, Q.nextBytes(G), Z > 0) G[0] &= (1 << Z) - 1;
      else G[0] = 0;
      this.fromString(G, 256)
    }
  }

  function eA7() {
    var A = this.t,
      Q = [];
    Q[0] = this.s;
    var B = this.DB - A * this.DB % 8,
      G, Z = 0;
    if (A-- > 0) {
      if (B < this.DB && (G = this.data[A] >> B) != (this.s & this.DM) >> B) Q[Z++] = G | this.s << this.DB - B;
      while (A >= 0) {
        if (B < 8) G = (this.data[A] & (1 << B) - 1) << 8 - B, G |= this.data[--A] >> (B += this.DB - 8);
        else if (G = this.data[A] >> (B -= 8) & 255, B <= 0) B += this.DB, --A;
        if ((G & 128) != 0) G |= -256;
        if (Z == 0 && (this.s & 128) != (G & 128)) ++Z;
        if (Z > 0 || G != this.s) Q[Z++] = G
      }
    }
    return Q
  }

  function A17(A) {
    return this.compareTo(A) == 0
  }

  function Q17(A) {
    return this.compareTo(A) < 0 ? this : A
  }

  function B17(A) {
    return this.compareTo(A) > 0 ? this : A
  }

  function G17(A, Q, B) {
    var G, Z, Y = Math.min(A.t, this.t);
    for (G = 0; G < Y; ++G) B.data[G] = Q(this.data[G], A.data[G]);
    if (A.t < this.t) {
      Z = A.s & this.DM;
      for (G = Y; G < this.t; ++G) B.data[G] = Q(this.data[G], Z);
      B.t = this.t
    } else {
      Z = this.s & this.DM;
      for (G = Y; G < A.t; ++G) B.data[G] = Q(Z, A.data[G]);
      B.t = A.t
    }
    B.s = Q(this.s, A.s), B.clamp()
  }

  function Z17(A, Q) {
    return A & Q
  }

  function Y17(A) {
    var Q = j7();
    return this.bitwiseTo(A, Z17, Q), Q
  }

  function Bw0(A, Q) {
    return A | Q
  }

  function J17(A) {
    var Q = j7();
    return this.bitwiseTo(A, Bw0, Q), Q
  }

  function dn2(A, Q) {
    return A ^ Q
  }

  function X17(A) {
    var Q = j7();
    return this.bitwiseTo(A, dn2, Q), Q
  }

  function cn2(A, Q) {
    return A & ~Q
  }

  function I17(A) {
    var Q = j7();
    return this.bitwiseTo(A, cn2, Q), Q
  }

  function D17() {
    var A = j7();
    for (var Q = 0; Q < this.t; ++Q) A.data[Q] = this.DM & ~this.data[Q];
    return A.t = this.t, A.s = ~this.s, A
  }

  function W17(A) {
    var Q = j7();
    if (A < 0) this.rShiftTo(-A, Q);
    else this.lShiftTo(A, Q);
    return Q
  }

  function K17(A) {
    var Q = j7();
    if (A < 0) this.lShiftTo(-A, Q);
    else this.rShiftTo(A, Q);
    return Q
  }

  function V17(A) {
    if (A == 0) return -1;
    var Q = 0;
    if ((A & 65535) == 0) A >>= 16, Q += 16;
    if ((A & 255) == 0) A >>= 8, Q += 8;
    if ((A & 15) == 0) A >>= 4, Q += 4;
    if ((A & 3) == 0) A >>= 2, Q += 2;
    if ((A & 1) == 0) ++Q;
    return Q
  }

  function F17() {
    for (var A = 0; A < this.t; ++A)
      if (this.data[A] != 0) return A * this.DB + V17(this.data[A]);
    if (this.s < 0) return this.t * this.DB;
    return -1
  }

  function H17(A) {
    var Q = 0;
    while (A != 0) A &= A - 1, ++Q;
    return Q
  }

  function E17() {
    var A = 0,
      Q = this.s & this.DM;
    for (var B = 0; B < this.t; ++B) A += H17(this.data[B] ^ Q);
    return A
  }

  function z17(A) {
    var Q = Math.floor(A / this.DB);
    if (Q >= this.t) return this.s != 0;
    return (this.data[Q] & 1 << A % this.DB) != 0
  }

  function $17(A, Q) {
    var B = cQ.ONE.shiftLeft(A);
    return this.bitwiseTo(B, Q, B), B
  }

  function C17(A) {
    return this.changeBit(A, Bw0)
  }

  function U17(A) {
    return this.changeBit(A, cn2)
  }

  function q17(A) {
    return this.changeBit(A, dn2)
  }

  function N17(A, Q) {
    var B = 0,
      G = 0,
      Z = Math.min(A.t, this.t);
    while (B < Z) G += this.data[B] + A.data[B], Q.data[B++] = G & this.DM, G >>= this.DB;
    if (A.t < this.t) {
      G += A.s;
      while (B < this.t) G += this.data[B], Q.data[B++] = G & this.DM, G >>= this.DB;
      G += this.s
    } else {
      G += this.s;
      while (B < A.t) G += A.data[B], Q.data[B++] = G & this.DM, G >>= this.DB;
      G += A.s
    }
    if (Q.s = G < 0 ? -1 : 0, G > 0) Q.data[B++] = G;
    else if (G < -1) Q.data[B++] = this.DV + G;
    Q.t = B, Q.clamp()
  }

  function w17(A) {
    var Q = j7();
    return this.addTo(A, Q), Q
  }

  function L17(A) {
    var Q = j7();
    return this.subTo(A, Q), Q
  }

  function O17(A) {
    var Q = j7();
    return this.multiplyTo(A, Q), Q
  }

  function M17(A) {
    var Q = j7();
    return this.divRemTo(A, Q, null), Q
  }

  function R17(A) {
    var Q = j7();
    return this.divRemTo(A, null, Q), Q
  }

  function _17(A) {
    var Q = j7(),
      B = j7();
    return this.divRemTo(A, Q, B), [Q, B]
  }

  function j17(A) {
    this.data[this.t] = this.am(0, A - 1, this, 0, 0, this.t), ++this.t, this.clamp()
  }

  function T17(A, Q) {
    if (A == 0) return;
    while (this.t <= Q) this.data[this.t++] = 0;
    this.data[Q] += A;
    while (this.data[Q] >= this.DV) {
      if (this.data[Q] -= this.DV, ++Q >= this.t) this.data[this.t++] = 0;
      ++this.data[Q]
    }
  }

  function vfA() {}

  function pn2(A) {
    return A
  }

  function P17(A, Q, B) {
    A.multiplyTo(Q, B)
  }

  function S17(A, Q) {
    A.squareTo(Q)
  }
  vfA.prototype.convert = pn2;
  vfA.prototype.revert = pn2;
  vfA.prototype.mulTo = P17;
  vfA.prototype.sqrTo = S17;

  function x17(A) {
    return this.exp(A, new vfA)
  }

  function y17(A, Q, B) {
    var G = Math.min(this.t + A.t, Q);
    B.s = 0, B.t = G;
    while (G > 0) B.data[--G] = 0;
    var Z;
    for (Z = B.t - this.t; G < Z; ++G) B.data[G + this.t] = this.am(0, A.data[G], B, G, 0, this.t);
    for (Z = Math.min(A.t, Q); G < Z; ++G) this.am(0, A.data[G], B, G, 0, Q - G);
    B.clamp()
  }

  function v17(A, Q, B) {
    --Q;
    var G = B.t = this.t + A.t - Q;
    B.s = 0;
    while (--G >= 0) B.data[G] = 0;
    for (G = Math.max(Q - this.t, 0); G < A.t; ++G) B.data[this.t + G - Q] = this.am(Q - G, A.data[G], B, 0, 0, this.t + G - Q);
    B.clamp(), B.drShiftTo(1, B)
  }

  function REA(A) {
    this.r2 = j7(), this.q3 = j7(), cQ.ONE.dlShiftTo(2 * A.t, this.r2), this.mu = this.r2.divide(A), this.m = A
  }

  function k17(A) {
    if (A.s < 0 || A.t > 2 * this.m.t) return A.mod(this.m);
    else if (A.compareTo(this.m) < 0) return A;
    else {
      var Q = j7();
      return A.copyTo(Q), this.reduce(Q), Q
    }
  }

  function b17(A) {
    return A
  }

  function f17(A) {
    if (A.drShiftTo(this.m.t - 1, this.r2), A.t > this.m.t + 1) A.t = this.m.t + 1, A.clamp();
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    while (A.compareTo(this.r2) < 0) A.dAddOffset(1, this.m.t + 1);
    A.subTo(this.r2, A);
    while (A.compareTo(this.m) >= 0) A.subTo(this.m, A)
  }

  function h17(A, Q) {
    A.squareTo(Q), this.reduce(Q)
  }

  function g17(A, Q, B) {
    A.multiplyTo(Q, B), this.reduce(B)
  }
  REA.prototype.convert = k17;
  REA.prototype.revert = b17;
  REA.prototype.reduce = f17;
  REA.prototype.mulTo = g17;
  REA.prototype.sqrTo = h17;

  function u17(A, Q) {
    var B = A.bitLength(),
      G, Z = vt(1),
      Y;
    if (B <= 0) return Z;
    else if (B < 18) G = 1;
    else if (B < 48) G = 3;
    else if (B < 144) G = 4;
    else if (B < 768) G = 5;
    else G = 6;
    if (B < 8) Y = new X3A(Q);
    else if (Q.isEven()) Y = new REA(Q);
    else Y = new I3A(Q);
    var J = [],
      X = 3,
      I = G - 1,
      D = (1 << G) - 1;
    if (J[1] = Y.convert(this), G > 1) {
      var W = j7();
      Y.sqrTo(J[1], W);
      while (X <= D) J[X] = j7(), Y.mulTo(W, J[X - 2], J[X]), X += 2
    }
    var K = A.t - 1,
      V, F = !0,
      H = j7(),
      E;
    B = rV1(A.data[K]) - 1;
    while (K >= 0) {
      if (B >= I) V = A.data[K] >> B - I & D;
      else if (V = (A.data[K] & (1 << B + 1) - 1) << I - B, K > 0) V |= A.data[K - 1] >> this.DB + B - I;
      X = G;
      while ((V & 1) == 0) V >>= 1, --X;
      if ((B -= X) < 0) B += this.DB, --K;
      if (F) J[V].copyTo(Z), F = !1;
      else {
        while (X > 1) Y.sqrTo(Z, H), Y.sqrTo(H, Z), X -= 2;
        if (X > 0) Y.sqrTo(Z, H);
        else E = Z, Z = H, H = E;
        Y.mulTo(H, J[V], Z)
      }
      while (K >= 0 && (A.data[K] & 1 << B) == 0)
        if (Y.sqrTo(Z, H), E = Z, Z = H, H = E, --B < 0) B = this.DB - 1, --K
    }
    return Y.revert(Z)
  }

  function m17(A) {
    var Q = this.s < 0 ? this.negate() : this.clone(),
      B = A.s < 0 ? A.negate() : A.clone();
    if (Q.compareTo(B) < 0) {
      var G = Q;
      Q = B, B = G
    }
    var Z = Q.getLowestSetBit(),
      Y = B.getLowestSetBit();
    if (Y < 0) return Q;
    if (Z < Y) Y = Z;
    if (Y > 0) Q.rShiftTo(Y, Q), B.rShiftTo(Y, B);
    while (Q.signum() > 0) {
      if ((Z = Q.getLowestSetBit()) > 0) Q.rShiftTo(Z, Q);
      if ((Z = B.getLowestSetBit()) > 0) B.rShiftTo(Z, B);
      if (Q.compareTo(B) >= 0) Q.subTo(B, Q), Q.rShiftTo(1, Q);
      else B.subTo(Q, B), B.rShiftTo(1, B)
    }
    if (Y > 0) B.lShiftTo(Y, B);
    return B
  }

  function d17(A) {
    if (A <= 0) return 0;
    var Q = this.DV % A,
      B = this.s < 0 ? A - 1 : 0;
    if (this.t > 0)
      if (Q == 0) B = this.data[0] % A;
      else
        for (var G = this.t - 1; G >= 0; --G) B = (Q * B + this.data[G]) % A;
    return B
  }

  function c17(A) {
    var Q = A.isEven();
    if (this.isEven() && Q || A.signum() == 0) return cQ.ZERO;
    var B = A.clone(),
      G = this.clone(),
      Z = vt(1),
      Y = vt(0),
      J = vt(0),
      X = vt(1);
    while (B.signum() != 0) {
      while (B.isEven()) {
        if (B.rShiftTo(1, B), Q) {
          if (!Z.isEven() || !Y.isEven()) Z.addTo(this, Z), Y.subTo(A, Y);
          Z.rShiftTo(1, Z)
        } else if (!Y.isEven()) Y.subTo(A, Y);
        Y.rShiftTo(1, Y)
      }
      while (G.isEven()) {
        if (G.rShiftTo(1, G), Q) {
          if (!J.isEven() || !X.isEven()) J.addTo(this, J), X.subTo(A, X);
          J.rShiftTo(1, J)
        } else if (!X.isEven()) X.subTo(A, X);
        X.rShiftTo(1, X)
      }
      if (B.compareTo(G) >= 0) {
        if (B.subTo(G, B), Q) Z.subTo(J, Z);
        Y.subTo(X, Y)
      } else {
        if (G.subTo(B, G), Q) J.subTo(Z, J);
        X.subTo(Y, X)
      }
    }
    if (G.compareTo(cQ.ONE) != 0) return cQ.ZERO;
    if (X.compareTo(A) >= 0) return X.subtract(A);
    if (X.signum() < 0) X.addTo(A, X);
    else return X;
    if (X.signum() < 0) return X.add(A);
    else return X
  }
  var wx = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509],
    p17 = 67108864 / wx[wx.length - 1];

  function l17(A) {
    var Q, B = this.abs();
    if (B.t == 1 && B.data[0] <= wx[wx.length - 1]) {
      for (Q = 0; Q < wx.length; ++Q)
        if (B.data[0] == wx[Q]) return !0;
      return !1
    }
    if (B.isEven()) return !1;
    Q = 1;
    while (Q < wx.length) {
      var G = wx[Q],
        Z = Q + 1;
      while (Z < wx.length && G < p17) G *= wx[Z++];
      G = B.modInt(G);
      while (Q < Z)
        if (G % wx[Q++] == 0) return !1
    }
    return B.millerRabin(A)
  }

  function i17(A) {
    var Q = this.subtract(cQ.ONE),
      B = Q.getLowestSetBit();
    if (B <= 0) return !1;
    var G = Q.shiftRight(B),
      Z = n17(),
      Y;
    for (var J = 0; J < A; ++J) {
      do Y = new cQ(this.bitLength(), Z); while (Y.compareTo(cQ.ONE) <= 0 || Y.compareTo(Q) >= 0);
      var X = Y.modPow(G, this);
      if (X.compareTo(cQ.ONE) != 0 && X.compareTo(Q) != 0) {
        var I = 1;
        while (I++ < B && X.compareTo(Q) != 0)
          if (X = X.modPowInt(2, this), X.compareTo(cQ.ONE) == 0) return !1;
        if (X.compareTo(Q) != 0) return !1
      }
    }
    return !0
  }

  function n17() {
    return {
      nextBytes: function (A) {
        for (var Q = 0; Q < A.length; ++Q) A[Q] = Math.floor(Math.random() * 256)
      }
    }
  }
  cQ.prototype.chunkSize = aA7;
  cQ.prototype.toRadix = rA7;
  cQ.prototype.fromRadix = sA7;
  cQ.prototype.fromNumber = tA7;
  cQ.prototype.bitwiseTo = G17;
  cQ.prototype.changeBit = $17;
  cQ.prototype.addTo = N17;
  cQ.prototype.dMultiply = j17;
  cQ.prototype.dAddOffset = T17;
  cQ.prototype.multiplyLowerTo = y17;
  cQ.prototype.multiplyUpperTo = v17;
  cQ.prototype.modInt = d17;
  cQ.prototype.millerRabin = i17;
  cQ.prototype.clone = pA7;
  cQ.prototype.intValue = lA7;
  cQ.prototype.byteValue = iA7;
  cQ.prototype.shortValue = nA7;
  cQ.prototype.signum = oA7;
  cQ.prototype.toByteArray = eA7;
  cQ.prototype.equals = A17;
  cQ.prototype.min = Q17;
  cQ.prototype.max = B17;
  cQ.prototype.and = Y17;
  cQ.prototype.or = J17;
  cQ.prototype.xor = X17;
  cQ.prototype.andNot = I17;
  cQ.prototype.not = D17;
  cQ.prototype.shiftLeft = W17;
  cQ.prototype.shiftRight = K17;
  cQ.prototype.getLowestSetBit = F17;
  cQ.prototype.bitCount = E17;
  cQ.prototype.testBit = z17;
  cQ.prototype.setBit = C17;
  cQ.prototype.clearBit = U17;
  cQ.prototype.flipBit = q17;
  cQ.prototype.add = w17;
  cQ.prototype.subtract = L17;
  cQ.prototype.multiply = O17;
  cQ.prototype.divide = M17;
  cQ.prototype.remainder = R17;
  cQ.prototype.divideAndRemainder = _17;
  cQ.prototype.modPow = u17;
  cQ.prototype.modInverse = c17;
  cQ.prototype.pow = x17;
  cQ.prototype.gcd = m17;
  cQ.prototype.isProbablePrime = l17
})
// @from(Ln 374371, Col 4)
_EA = U((WXY, on2) => {
  var bf = H8();
  Sf();
  _7();
  var nn2 = on2.exports = bf.sha1 = bf.sha1 || {};
  bf.md.sha1 = bf.md.algorithms.sha1 = nn2;
  nn2.create = function () {
    if (!an2) a17();
    var A = null,
      Q = bf.util.createBuffer(),
      B = Array(80),
      G = {
        algorithm: "sha1",
        blockLength: 64,
        digestLength: 20,
        messageLength: 0,
        fullMessageLength: null,
        messageLengthSize: 8
      };
    return G.start = function () {
      G.messageLength = 0, G.fullMessageLength = G.messageLength64 = [];
      var Z = G.messageLengthSize / 4;
      for (var Y = 0; Y < Z; ++Y) G.fullMessageLength.push(0);
      return Q = bf.util.createBuffer(), A = {
        h0: 1732584193,
        h1: 4023233417,
        h2: 2562383102,
        h3: 271733878,
        h4: 3285377520
      }, G
    }, G.start(), G.update = function (Z, Y) {
      if (Y === "utf8") Z = bf.util.encodeUtf8(Z);
      var J = Z.length;
      G.messageLength += J, J = [J / 4294967296 >>> 0, J >>> 0];
      for (var X = G.fullMessageLength.length - 1; X >= 0; --X) G.fullMessageLength[X] += J[1], J[1] = J[0] + (G.fullMessageLength[X] / 4294967296 >>> 0), G.fullMessageLength[X] = G.fullMessageLength[X] >>> 0, J[0] = J[1] / 4294967296 >>> 0;
      if (Q.putBytes(Z), in2(A, B, Q), Q.read > 2048 || Q.length() === 0) Q.compact();
      return G
    }, G.digest = function () {
      var Z = bf.util.createBuffer();
      Z.putBytes(Q.bytes());
      var Y = G.fullMessageLength[G.fullMessageLength.length - 1] + G.messageLengthSize,
        J = Y & G.blockLength - 1;
      Z.putBytes(Gw0.substr(0, G.blockLength - J));
      var X, I, D = G.fullMessageLength[0] * 8;
      for (var W = 0; W < G.fullMessageLength.length - 1; ++W) X = G.fullMessageLength[W + 1] * 8, I = X / 4294967296 >>> 0, D += I, Z.putInt32(D >>> 0), D = X >>> 0;
      Z.putInt32(D);
      var K = {
        h0: A.h0,
        h1: A.h1,
        h2: A.h2,
        h3: A.h3,
        h4: A.h4
      };
      in2(K, B, Z);
      var V = bf.util.createBuffer();
      return V.putInt32(K.h0), V.putInt32(K.h1), V.putInt32(K.h2), V.putInt32(K.h3), V.putInt32(K.h4), V
    }, G
  };
  var Gw0 = null,
    an2 = !1;

  function a17() {
    Gw0 = String.fromCharCode(128), Gw0 += bf.util.fillString(String.fromCharCode(0), 64), an2 = !0
  }

  function in2(A, Q, B) {
    var G, Z, Y, J, X, I, D, W, K = B.length();
    while (K >= 64) {
      Z = A.h0, Y = A.h1, J = A.h2, X = A.h3, I = A.h4;
      for (W = 0; W < 16; ++W) G = B.getInt32(), Q[W] = G, D = X ^ Y & (J ^ X), G = (Z << 5 | Z >>> 27) + D + I + 1518500249 + G, I = X, X = J, J = (Y << 30 | Y >>> 2) >>> 0, Y = Z, Z = G;
      for (; W < 20; ++W) G = Q[W - 3] ^ Q[W - 8] ^ Q[W - 14] ^ Q[W - 16], G = G << 1 | G >>> 31, Q[W] = G, D = X ^ Y & (J ^ X), G = (Z << 5 | Z >>> 27) + D + I + 1518500249 + G, I = X, X = J, J = (Y << 30 | Y >>> 2) >>> 0, Y = Z, Z = G;
      for (; W < 32; ++W) G = Q[W - 3] ^ Q[W - 8] ^ Q[W - 14] ^ Q[W - 16], G = G << 1 | G >>> 31, Q[W] = G, D = Y ^ J ^ X, G = (Z << 5 | Z >>> 27) + D + I + 1859775393 + G, I = X, X = J, J = (Y << 30 | Y >>> 2) >>> 0, Y = Z, Z = G;
      for (; W < 40; ++W) G = Q[W - 6] ^ Q[W - 16] ^ Q[W - 28] ^ Q[W - 32], G = G << 2 | G >>> 30, Q[W] = G, D = Y ^ J ^ X, G = (Z << 5 | Z >>> 27) + D + I + 1859775393 + G, I = X, X = J, J = (Y << 30 | Y >>> 2) >>> 0, Y = Z, Z = G;
      for (; W < 60; ++W) G = Q[W - 6] ^ Q[W - 16] ^ Q[W - 28] ^ Q[W - 32], G = G << 2 | G >>> 30, Q[W] = G, D = Y & J | X & (Y ^ J), G = (Z << 5 | Z >>> 27) + D + I + 2400959708 + G, I = X, X = J, J = (Y << 30 | Y >>> 2) >>> 0, Y = Z, Z = G;
      for (; W < 80; ++W) G = Q[W - 6] ^ Q[W - 16] ^ Q[W - 28] ^ Q[W - 32], G = G << 2 | G >>> 30, Q[W] = G, D = Y ^ J ^ X, G = (Z << 5 | Z >>> 27) + D + I + 3395469782 + G, I = X, X = J, J = (Y << 30 | Y >>> 2) >>> 0, Y = Z, Z = G;
      A.h0 = A.h0 + Z | 0, A.h1 = A.h1 + Y | 0, A.h2 = A.h2 + J | 0, A.h3 = A.h3 + X | 0, A.h4 = A.h4 + I | 0, K -= 64
    }
  }
})
// @from(Ln 374450, Col 4)
Zw0 = U((KXY, sn2) => {
  var ff = H8();
  _7();
  Xj();
  _EA();
  var rn2 = sn2.exports = ff.pkcs1 = ff.pkcs1 || {};
  rn2.encode_rsa_oaep = function (A, Q, B) {
    var G, Z, Y, J;
    if (typeof B === "string") G = B, Z = arguments[3] || void 0, Y = arguments[4] || void 0;
    else if (B) {
      if (G = B.label || void 0, Z = B.seed || void 0, Y = B.md || void 0, B.mgf1 && B.mgf1.md) J = B.mgf1.md
    }
    if (!Y) Y = ff.md.sha1.create();
    else Y.start();
    if (!J) J = Y;
    var X = Math.ceil(A.n.bitLength() / 8),
      I = X - 2 * Y.digestLength - 2;
    if (Q.length > I) {
      var D = Error("RSAES-OAEP input message length is too long.");
      throw D.length = Q.length, D.maxLength = I, D
    }
    if (!G) G = "";
    Y.update(G, "raw");
    var W = Y.digest(),
      K = "",
      V = I - Q.length;
    for (var F = 0; F < V; F++) K += "\x00";
    var H = W.getBytes() + K + "\x01" + Q;
    if (!Z) Z = ff.random.getBytes(Y.digestLength);
    else if (Z.length !== Y.digestLength) {
      var D = Error("Invalid RSAES-OAEP seed. The seed length must match the digest length.");
      throw D.seedLength = Z.length, D.digestLength = Y.digestLength, D
    }
    var E = sV1(Z, X - Y.digestLength - 1, J),
      z = ff.util.xorBytes(H, E, H.length),
      $ = sV1(z, Y.digestLength, J),
      O = ff.util.xorBytes(Z, $, Z.length);
    return "\x00" + O + z
  };
  rn2.decode_rsa_oaep = function (A, Q, B) {
    var G, Z, Y;
    if (typeof B === "string") G = B, Z = arguments[3] || void 0;
    else if (B) {
      if (G = B.label || void 0, Z = B.md || void 0, B.mgf1 && B.mgf1.md) Y = B.mgf1.md
    }
    var J = Math.ceil(A.n.bitLength() / 8);
    if (Q.length !== J) {
      var z = Error("RSAES-OAEP encoded message length is invalid.");
      throw z.length = Q.length, z.expectedLength = J, z
    }
    if (Z === void 0) Z = ff.md.sha1.create();
    else Z.start();
    if (!Y) Y = Z;
    if (J < 2 * Z.digestLength + 2) throw Error("RSAES-OAEP key is too short for the hash function.");
    if (!G) G = "";
    Z.update(G, "raw");
    var X = Z.digest().getBytes(),
      I = Q.charAt(0),
      D = Q.substring(1, Z.digestLength + 1),
      W = Q.substring(1 + Z.digestLength),
      K = sV1(W, Z.digestLength, Y),
      V = ff.util.xorBytes(D, K, D.length),
      F = sV1(V, J - Z.digestLength - 1, Y),
      H = ff.util.xorBytes(W, F, W.length),
      E = H.substring(0, Z.digestLength),
      z = I !== "\x00";
    for (var $ = 0; $ < Z.digestLength; ++$) z |= X.charAt($) !== E.charAt($);
    var O = 1,
      L = Z.digestLength;
    for (var M = Z.digestLength; M < H.length; M++) {
      var _ = H.charCodeAt(M),
        j = _ & 1 ^ 1,
        x = O ? 65534 : 0;
      z |= _ & x, O = O & j, L += O
    }
    if (z || H.charCodeAt(L) !== 1) throw Error("Invalid RSAES-OAEP padding.");
    return H.substring(L + 1)
  };

  function sV1(A, Q, B) {
    if (!B) B = ff.md.sha1.create();
    var G = "",
      Z = Math.ceil(Q / B.digestLength);
    for (var Y = 0; Y < Z; ++Y) {
      var J = String.fromCharCode(Y >> 24 & 255, Y >> 16 & 255, Y >> 8 & 255, Y & 255);
      B.start(), B.update(A + J), G += B.digest().getBytes()
    }
    return G.substring(0, Q)
  }
})
// @from(Ln 374540, Col 4)
Jw0 = U((VXY, Yw0) => {
  var kt = H8();
  _7();
  kfA();
  Xj();
  (function () {
    if (kt.prime) {
      Yw0.exports = kt.prime;
      return
    }
    var A = Yw0.exports = kt.prime = kt.prime || {},
      Q = kt.jsbn.BigInteger,
      B = [6, 4, 2, 4, 2, 4, 6, 2],
      G = new Q(null);
    G.fromInt(30);
    var Z = function (K, V) {
      return K | V
    };
    A.generateProbablePrime = function (K, V, F) {
      if (typeof V === "function") F = V, V = {};
      V = V || {};
      var H = V.algorithm || "PRIMEINC";
      if (typeof H === "string") H = {
        name: H
      };
      H.options = H.options || {};
      var E = V.prng || kt.random,
        z = {
          nextBytes: function ($) {
            var O = E.getBytesSync($.length);
            for (var L = 0; L < $.length; ++L) $[L] = O.charCodeAt(L)
          }
        };
      if (H.name === "PRIMEINC") return Y(K, z, H.options, F);
      throw Error("Invalid prime generation algorithm: " + H.name)
    };

    function Y(K, V, F, H) {
      if ("workers" in F) return I(K, V, F, H);
      return J(K, V, F, H)
    }

    function J(K, V, F, H) {
      var E = D(K, V),
        z = 0,
        $ = W(E.bitLength());
      if ("millerRabinTests" in F) $ = F.millerRabinTests;
      var O = 10;
      if ("maxBlockTime" in F) O = F.maxBlockTime;
      X(E, K, V, z, $, O, H)
    }

    function X(K, V, F, H, E, z, $) {
      var O = +new Date;
      do {
        if (K.bitLength() > V) K = D(V, F);
        if (K.isProbablePrime(E)) return $(null, K);
        K.dAddOffset(B[H++ % 8], 0)
      } while (z < 0 || +new Date - O < z);
      kt.util.setImmediate(function () {
        X(K, V, F, H, E, z, $)
      })
    }

    function I(K, V, F, H) {
      if (typeof Worker > "u") return J(K, V, F, H);
      var E = D(K, V),
        z = F.workers,
        $ = F.workLoad || 100,
        O = $ * 30 / 8,
        L = F.workerScript || "forge/prime.worker.js";
      if (z === -1) return kt.util.estimateCores(function (_, j) {
        if (_) j = 2;
        z = j - 1, M()
      });
      M();

      function M() {
        z = Math.max(1, z);
        var _ = [];
        for (var j = 0; j < z; ++j) _[j] = new Worker(L);
        var x = z;
        for (var j = 0; j < z; ++j) _[j].addEventListener("message", S);
        var b = !1;

        function S(u) {
          if (b) return;
          --x;
          var f = u.data;
          if (f.found) {
            for (var AA = 0; AA < _.length; ++AA) _[AA].terminate();
            return b = !0, H(null, new Q(f.prime, 16))
          }
          if (E.bitLength() > K) E = D(K, V);
          var n = E.toString(16);
          u.target.postMessage({
            hex: n,
            workLoad: $
          }), E.dAddOffset(O, 0)
        }
      }
    }

    function D(K, V) {
      var F = new Q(K, V),
        H = K - 1;
      if (!F.testBit(H)) F.bitwiseTo(Q.ONE.shiftLeft(H), Z, F);
      return F.dAddOffset(31 - F.mod(G).byteValue(), 0), F
    }

    function W(K) {
      if (K <= 100) return 27;
      if (K <= 150) return 18;
      if (K <= 200) return 15;
      if (K <= 250) return 12;
      if (K <= 300) return 9;
      if (K <= 350) return 8;
      if (K <= 400) return 7;
      if (K <= 500) return 6;
      if (K <= 600) return 5;
      if (K <= 800) return 4;
      if (K <= 1250) return 3;
      return 2
    }
  })()
})
// @from(Ln 374666, Col 4)
bfA = U((FXY, Za2) => {
  var W4 = H8();
  Nx();
  kfA();
  yt();
  Zw0();
  Jw0();
  Xj();
  _7();
  if (typeof n5 > "u") n5 = W4.jsbn.BigInteger;
  var n5, Xw0 = W4.util.isNodejs ? NA("crypto") : null,
    w0 = W4.asn1,
    Dj = W4.util;
  W4.pki = W4.pki || {};
  Za2.exports = W4.pki.rsa = W4.rsa = W4.rsa || {};
  var M3 = W4.pki,
    o17 = [6, 4, 2, 4, 2, 4, 6, 2],
    r17 = {
      name: "PrivateKeyInfo",
      tagClass: w0.Class.UNIVERSAL,
      type: w0.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "PrivateKeyInfo.version",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyVersion"
      }, {
        name: "PrivateKeyInfo.privateKeyAlgorithm",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "AlgorithmIdentifier.algorithm",
          tagClass: w0.Class.UNIVERSAL,
          type: w0.Type.OID,
          constructed: !1,
          capture: "privateKeyOid"
        }]
      }, {
        name: "PrivateKeyInfo",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.OCTETSTRING,
        constructed: !1,
        capture: "privateKey"
      }]
    },
    s17 = {
      name: "RSAPrivateKey",
      tagClass: w0.Class.UNIVERSAL,
      type: w0.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "RSAPrivateKey.version",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyVersion"
      }, {
        name: "RSAPrivateKey.modulus",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyModulus"
      }, {
        name: "RSAPrivateKey.publicExponent",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyPublicExponent"
      }, {
        name: "RSAPrivateKey.privateExponent",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyPrivateExponent"
      }, {
        name: "RSAPrivateKey.prime1",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyPrime1"
      }, {
        name: "RSAPrivateKey.prime2",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyPrime2"
      }, {
        name: "RSAPrivateKey.exponent1",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyExponent1"
      }, {
        name: "RSAPrivateKey.exponent2",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyExponent2"
      }, {
        name: "RSAPrivateKey.coefficient",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyCoefficient"
      }]
    },
    t17 = {
      name: "RSAPublicKey",
      tagClass: w0.Class.UNIVERSAL,
      type: w0.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "RSAPublicKey.modulus",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "publicKeyModulus"
      }, {
        name: "RSAPublicKey.exponent",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.INTEGER,
        constructed: !1,
        capture: "publicKeyExponent"
      }]
    },
    e17 = W4.pki.rsa.publicKeyValidator = {
      name: "SubjectPublicKeyInfo",
      tagClass: w0.Class.UNIVERSAL,
      type: w0.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "subjectPublicKeyInfo",
      value: [{
        name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "AlgorithmIdentifier.algorithm",
          tagClass: w0.Class.UNIVERSAL,
          type: w0.Type.OID,
          constructed: !1,
          capture: "publicKeyOid"
        }]
      }, {
        name: "SubjectPublicKeyInfo.subjectPublicKey",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.BITSTRING,
        constructed: !1,
        value: [{
          name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
          tagClass: w0.Class.UNIVERSAL,
          type: w0.Type.SEQUENCE,
          constructed: !0,
          optional: !0,
          captureAsn1: "rsaPublicKey"
        }]
      }]
    },
    A07 = {
      name: "DigestInfo",
      tagClass: w0.Class.UNIVERSAL,
      type: w0.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "DigestInfo.DigestAlgorithm",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
          tagClass: w0.Class.UNIVERSAL,
          type: w0.Type.OID,
          constructed: !1,
          capture: "algorithmIdentifier"
        }, {
          name: "DigestInfo.DigestAlgorithm.parameters",
          tagClass: w0.Class.UNIVERSAL,
          type: w0.Type.NULL,
          capture: "parameters",
          optional: !0,
          constructed: !1
        }]
      }, {
        name: "DigestInfo.digest",
        tagClass: w0.Class.UNIVERSAL,
        type: w0.Type.OCTETSTRING,
        constructed: !1,
        capture: "digest"
      }]
    },
    Q07 = function (A) {
      var Q;
      if (A.algorithm in M3.oids) Q = M3.oids[A.algorithm];
      else {
        var B = Error("Unknown message digest algorithm.");
        throw B.algorithm = A.algorithm, B
      }
      var G = w0.oidToDer(Q).getBytes(),
        Z = w0.create(w0.Class.UNIVERSAL, w0.Type.SEQUENCE, !0, []),
        Y = w0.create(w0.Class.UNIVERSAL, w0.Type.SEQUENCE, !0, []);
      Y.value.push(w0.create(w0.Class.UNIVERSAL, w0.Type.OID, !1, G)), Y.value.push(w0.create(w0.Class.UNIVERSAL, w0.Type.NULL, !1, ""));
      var J = w0.create(w0.Class.UNIVERSAL, w0.Type.OCTETSTRING, !1, A.digest().getBytes());
      return Z.value.push(Y), Z.value.push(J), w0.toDer(Z).getBytes()
    },
    Ba2 = function (A, Q, B) {
      if (B) return A.modPow(Q.e, Q.n);
      if (!Q.p || !Q.q) return A.modPow(Q.d, Q.n);
      if (!Q.dP) Q.dP = Q.d.mod(Q.p.subtract(n5.ONE));
      if (!Q.dQ) Q.dQ = Q.d.mod(Q.q.subtract(n5.ONE));
      if (!Q.qInv) Q.qInv = Q.q.modInverse(Q.p);
      var G;
      do G = new n5(W4.util.bytesToHex(W4.random.getBytes(Q.n.bitLength() / 8)), 16); while (G.compareTo(Q.n) >= 0 || !G.gcd(Q.n).equals(n5.ONE));
      A = A.multiply(G.modPow(Q.e, Q.n)).mod(Q.n);
      var Z = A.mod(Q.p).modPow(Q.dP, Q.p),
        Y = A.mod(Q.q).modPow(Q.dQ, Q.q);
      while (Z.compareTo(Y) < 0) Z = Z.add(Q.p);
      var J = Z.subtract(Y).multiply(Q.qInv).mod(Q.p).multiply(Q.q).add(Y);
      return J = J.multiply(G.modInverse(Q.n)).mod(Q.n), J
    };
  M3.rsa.encrypt = function (A, Q, B) {
    var G = B,
      Z, Y = Math.ceil(Q.n.bitLength() / 8);
    if (B !== !1 && B !== !0) G = B === 2, Z = Ga2(A, Q, B);
    else Z = W4.util.createBuffer(), Z.putBytes(A);
    var J = new n5(Z.toHex(), 16),
      X = Ba2(J, Q, G),
      I = X.toString(16),
      D = W4.util.createBuffer(),
      W = Y - Math.ceil(I.length / 2);
    while (W > 0) D.putByte(0), --W;
    return D.putBytes(W4.util.hexToBytes(I)), D.getBytes()
  };
  M3.rsa.decrypt = function (A, Q, B, G) {
    var Z = Math.ceil(Q.n.bitLength() / 8);
    if (A.length !== Z) {
      var Y = Error("Encrypted message length is invalid.");
      throw Y.length = A.length, Y.expected = Z, Y
    }
    var J = new n5(W4.util.createBuffer(A).toHex(), 16);
    if (J.compareTo(Q.n) >= 0) throw Error("Encrypted message is invalid.");
    var X = Ba2(J, Q, B),
      I = X.toString(16),
      D = W4.util.createBuffer(),
      W = Z - Math.ceil(I.length / 2);
    while (W > 0) D.putByte(0), --W;
    if (D.putBytes(W4.util.hexToBytes(I)), G !== !1) return tV1(D.getBytes(), Q, B);
    return D.getBytes()
  };
  M3.rsa.createKeyPairGenerationState = function (A, Q, B) {
    if (typeof A === "string") A = parseInt(A, 10);
    A = A || 2048, B = B || {};
    var G = B.prng || W4.random,
      Z = {
        nextBytes: function (X) {
          var I = G.getBytesSync(X.length);
          for (var D = 0; D < X.length; ++D) X[D] = I.charCodeAt(D)
        }
      },
      Y = B.algorithm || "PRIMEINC",
      J;
    if (Y === "PRIMEINC") J = {
      algorithm: Y,
      state: 0,
      bits: A,
      rng: Z,
      eInt: Q || 65537,
      e: new n5(null),
      p: null,
      q: null,
      qBits: A >> 1,
      pBits: A - (A >> 1),
      pqState: 0,
      num: null,
      keys: null
    }, J.e.fromInt(J.eInt);
    else throw Error("Invalid key generation algorithm: " + Y);
    return J
  };
  M3.rsa.stepKeyPairGenerationState = function (A, Q) {
    if (!("algorithm" in A)) A.algorithm = "PRIMEINC";
    var B = new n5(null);
    B.fromInt(30);
    var G = 0,
      Z = function (K, V) {
        return K | V
      },
      Y = +new Date,
      J, X = 0;
    while (A.keys === null && (Q <= 0 || X < Q)) {
      if (A.state === 0) {
        var I = A.p === null ? A.pBits : A.qBits,
          D = I - 1;
        if (A.pqState === 0) {
          if (A.num = new n5(I, A.rng), !A.num.testBit(D)) A.num.bitwiseTo(n5.ONE.shiftLeft(D), Z, A.num);
          A.num.dAddOffset(31 - A.num.mod(B).byteValue(), 0), G = 0, ++A.pqState
        } else if (A.pqState === 1)
          if (A.num.bitLength() > I) A.pqState = 0;
          else if (A.num.isProbablePrime(G07(A.num.bitLength()))) ++A.pqState;
        else A.num.dAddOffset(o17[G++ % 8], 0);
        else if (A.pqState === 2) A.pqState = A.num.subtract(n5.ONE).gcd(A.e).compareTo(n5.ONE) === 0 ? 3 : 0;
        else if (A.pqState === 3) {
          if (A.pqState = 0, A.p === null) A.p = A.num;
          else A.q = A.num;
          if (A.p !== null && A.q !== null) ++A.state;
          A.num = null
        }
      } else if (A.state === 1) {
        if (A.p.compareTo(A.q) < 0) A.num = A.p, A.p = A.q, A.q = A.num;
        ++A.state
      } else if (A.state === 2) A.p1 = A.p.subtract(n5.ONE), A.q1 = A.q.subtract(n5.ONE), A.phi = A.p1.multiply(A.q1), ++A.state;
      else if (A.state === 3)
        if (A.phi.gcd(A.e).compareTo(n5.ONE) === 0) ++A.state;
        else A.p = null, A.q = null, A.state = 0;
      else if (A.state === 4)
        if (A.n = A.p.multiply(A.q), A.n.bitLength() === A.bits) ++A.state;
        else A.q = null, A.state = 0;
      else if (A.state === 5) {
        var W = A.e.modInverse(A.phi);
        A.keys = {
          privateKey: M3.rsa.setPrivateKey(A.n, A.e, W, A.p, A.q, W.mod(A.p1), W.mod(A.q1), A.q.modInverse(A.p)),
          publicKey: M3.rsa.setPublicKey(A.n, A.e)
        }
      }
      J = +new Date, X += J - Y, Y = J
    }
    return A.keys !== null
  };
  M3.rsa.generateKeyPair = function (A, Q, B, G) {
    if (arguments.length === 1) {
      if (typeof A === "object") B = A, A = void 0;
      else if (typeof A === "function") G = A, A = void 0
    } else if (arguments.length === 2)
      if (typeof A === "number") {
        if (typeof Q === "function") G = Q, Q = void 0;
        else if (typeof Q !== "number") B = Q, Q = void 0
      } else B = A, G = Q, A = void 0, Q = void 0;
    else if (arguments.length === 3)
      if (typeof Q === "number") {
        if (typeof B === "function") G = B, B = void 0
      } else G = B, B = Q, Q = void 0;
    if (B = B || {}, A === void 0) A = B.bits || 2048;
    if (Q === void 0) Q = B.e || 65537;
    if (!W4.options.usePureJavaScript && !B.prng && A >= 256 && A <= 16384 && (Q === 65537 || Q === 3)) {
      if (G) {
        if (tn2("generateKeyPair")) return Xw0.generateKeyPair("rsa", {
          modulusLength: A,
          publicExponent: Q,
          publicKeyEncoding: {
            type: "spki",
            format: "pem"
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
          }
        }, function (X, I, D) {
          if (X) return G(X);
          G(null, {
            privateKey: M3.privateKeyFromPem(D),
            publicKey: M3.publicKeyFromPem(I)
          })
        });
        if (en2("generateKey") && en2("exportKey")) return Dj.globalScope.crypto.subtle.generateKey({
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: A,
          publicExponent: Qa2(Q),
          hash: {
            name: "SHA-256"
          }
        }, !0, ["sign", "verify"]).then(function (X) {
          return Dj.globalScope.crypto.subtle.exportKey("pkcs8", X.privateKey)
        }).then(void 0, function (X) {
          G(X)
        }).then(function (X) {
          if (X) {
            var I = M3.privateKeyFromAsn1(w0.fromDer(W4.util.createBuffer(X)));
            G(null, {
              privateKey: I,
              publicKey: M3.setRsaPublicKey(I.n, I.e)
            })
          }
        });
        if (Aa2("generateKey") && Aa2("exportKey")) {
          var Z = Dj.globalScope.msCrypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: A,
            publicExponent: Qa2(Q),
            hash: {
              name: "SHA-256"
            }
          }, !0, ["sign", "verify"]);
          Z.oncomplete = function (X) {
            var I = X.target.result,
              D = Dj.globalScope.msCrypto.subtle.exportKey("pkcs8", I.privateKey);
            D.oncomplete = function (W) {
              var K = W.target.result,
                V = M3.privateKeyFromAsn1(w0.fromDer(W4.util.createBuffer(K)));
              G(null, {
                privateKey: V,
                publicKey: M3.setRsaPublicKey(V.n, V.e)
              })
            }, D.onerror = function (W) {
              G(W)
            }
          }, Z.onerror = function (X) {
            G(X)
          };
          return
        }
      } else if (tn2("generateKeyPairSync")) {
        var Y = Xw0.generateKeyPairSync("rsa", {
          modulusLength: A,
          publicExponent: Q,
          publicKeyEncoding: {
            type: "spki",
            format: "pem"
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
          }
        });
        return {
          privateKey: M3.privateKeyFromPem(Y.privateKey),
          publicKey: M3.publicKeyFromPem(Y.publicKey)
        }
      }
    }
    var J = M3.rsa.createKeyPairGenerationState(A, Q, B);
    if (!G) return M3.rsa.stepKeyPairGenerationState(J, 0), J.keys;
    B07(J, B, G)
  };
  M3.setRsaPublicKey = M3.rsa.setPublicKey = function (A, Q) {
    var B = {
      n: A,
      e: Q
    };
    return B.encrypt = function (G, Z, Y) {
      if (typeof Z === "string") Z = Z.toUpperCase();
      else if (Z === void 0) Z = "RSAES-PKCS1-V1_5";
      if (Z === "RSAES-PKCS1-V1_5") Z = {
        encode: function (X, I, D) {
          return Ga2(X, I, 2).getBytes()
        }
      };
      else if (Z === "RSA-OAEP" || Z === "RSAES-OAEP") Z = {
        encode: function (X, I) {
          return W4.pkcs1.encode_rsa_oaep(I, X, Y)
        }
      };
      else if (["RAW", "NONE", "NULL", null].indexOf(Z) !== -1) Z = {
        encode: function (X) {
          return X
        }
      };
      else if (typeof Z === "string") throw Error('Unsupported encryption scheme: "' + Z + '".');
      var J = Z.encode(G, B, !0);
      return M3.rsa.encrypt(J, B, !0)
    }, B.verify = function (G, Z, Y, J) {
      if (typeof Y === "string") Y = Y.toUpperCase();
      else if (Y === void 0) Y = "RSASSA-PKCS1-V1_5";
      if (J === void 0) J = {
        _parseAllDigestBytes: !0
      };
      if (!("_parseAllDigestBytes" in J)) J._parseAllDigestBytes = !0;
      if (Y === "RSASSA-PKCS1-V1_5") Y = {
        verify: function (I, D) {
          D = tV1(D, B, !0);
          var W = w0.fromDer(D, {
              parseAllBytes: J._parseAllDigestBytes
            }),
            K = {},
            V = [];
          if (!w0.validate(W, A07, K, V)) {
            var F = Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value.");
            throw F.errors = V, F
          }
          var H = w0.derToOid(K.algorithmIdentifier);
          if (!(H === W4.oids.md2 || H === W4.oids.md5 || H === W4.oids.sha1 || H === W4.oids.sha224 || H === W4.oids.sha256 || H === W4.oids.sha384 || H === W4.oids.sha512 || H === W4.oids["sha512-224"] || H === W4.oids["sha512-256"])) {
            var F = Error("Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.");
            throw F.oid = H, F
          }
          if (H === W4.oids.md2 || H === W4.oids.md5) {
            if (!("parameters" in K)) throw Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifer NULL parameters.")
          }
          return I === K.digest
        }
      };
      else if (Y === "NONE" || Y === "NULL" || Y === null) Y = {
        verify: function (I, D) {
          return D = tV1(D, B, !0), I === D
        }
      };
      var X = M3.rsa.decrypt(Z, B, !0, !1);
      return Y.verify(G, X, B.n.bitLength())
    }, B
  };
  M3.setRsaPrivateKey = M3.rsa.setPrivateKey = function (A, Q, B, G, Z, Y, J, X) {
    var I = {
      n: A,
      e: Q,
      d: B,
      p: G,
      q: Z,
      dP: Y,
      dQ: J,
      qInv: X
    };
    return I.decrypt = function (D, W, K) {
      if (typeof W === "string") W = W.toUpperCase();
      else if (W === void 0) W = "RSAES-PKCS1-V1_5";
      var V = M3.rsa.decrypt(D, I, !1, !1);
      if (W === "RSAES-PKCS1-V1_5") W = {
        decode: tV1
      };
      else if (W === "RSA-OAEP" || W === "RSAES-OAEP") W = {
        decode: function (F, H) {
          return W4.pkcs1.decode_rsa_oaep(H, F, K)
        }
      };
      else if (["RAW", "NONE", "NULL", null].indexOf(W) !== -1) W = {
        decode: function (F) {
          return F
        }
      };
      else throw Error('Unsupported encryption scheme: "' + W + '".');
      return W.decode(V, I, !1)
    }, I.sign = function (D, W) {
      var K = !1;
      if (typeof W === "string") W = W.toUpperCase();
      if (W === void 0 || W === "RSASSA-PKCS1-V1_5") W = {
        encode: Q07
      }, K = 1;
      else if (W === "NONE" || W === "NULL" || W === null) W = {
        encode: function () {
          return D
        }
      }, K = 1;
      var V = W.encode(D, I.n.bitLength());
      return M3.rsa.encrypt(V, I, K)
    }, I
  };
  M3.wrapRsaPrivateKey = function (A) {
    return w0.create(w0.Class.UNIVERSAL, w0.Type.SEQUENCE, !0, [w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, w0.integerToDer(0).getBytes()), w0.create(w0.Class.UNIVERSAL, w0.Type.SEQUENCE, !0, [w0.create(w0.Class.UNIVERSAL, w0.Type.OID, !1, w0.oidToDer(M3.oids.rsaEncryption).getBytes()), w0.create(w0.Class.UNIVERSAL, w0.Type.NULL, !1, "")]), w0.create(w0.Class.UNIVERSAL, w0.Type.OCTETSTRING, !1, w0.toDer(A).getBytes())])
  };
  M3.privateKeyFromAsn1 = function (A) {
    var Q = {},
      B = [];
    if (w0.validate(A, r17, Q, B)) A = w0.fromDer(W4.util.createBuffer(Q.privateKey));
    if (Q = {}, B = [], !w0.validate(A, s17, Q, B)) {
      var G = Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
      throw G.errors = B, G
    }
    var Z, Y, J, X, I, D, W, K;
    return Z = W4.util.createBuffer(Q.privateKeyModulus).toHex(), Y = W4.util.createBuffer(Q.privateKeyPublicExponent).toHex(), J = W4.util.createBuffer(Q.privateKeyPrivateExponent).toHex(), X = W4.util.createBuffer(Q.privateKeyPrime1).toHex(), I = W4.util.createBuffer(Q.privateKeyPrime2).toHex(), D = W4.util.createBuffer(Q.privateKeyExponent1).toHex(), W = W4.util.createBuffer(Q.privateKeyExponent2).toHex(), K = W4.util.createBuffer(Q.privateKeyCoefficient).toHex(), M3.setRsaPrivateKey(new n5(Z, 16), new n5(Y, 16), new n5(J, 16), new n5(X, 16), new n5(I, 16), new n5(D, 16), new n5(W, 16), new n5(K, 16))
  };
  M3.privateKeyToAsn1 = M3.privateKeyToRSAPrivateKey = function (A) {
    return w0.create(w0.Class.UNIVERSAL, w0.Type.SEQUENCE, !0, [w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, w0.integerToDer(0).getBytes()), w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, hf(A.n)), w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, hf(A.e)), w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, hf(A.d)), w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, hf(A.p)), w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, hf(A.q)), w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, hf(A.dP)), w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, hf(A.dQ)), w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, hf(A.qInv))])
  };
  M3.publicKeyFromAsn1 = function (A) {
    var Q = {},
      B = [];
    if (w0.validate(A, e17, Q, B)) {
      var G = w0.derToOid(Q.publicKeyOid);
      if (G !== M3.oids.rsaEncryption) {
        var Z = Error("Cannot read public key. Unknown OID.");
        throw Z.oid = G, Z
      }
      A = Q.rsaPublicKey
    }
    if (B = [], !w0.validate(A, t17, Q, B)) {
      var Z = Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.");
      throw Z.errors = B, Z
    }
    var Y = W4.util.createBuffer(Q.publicKeyModulus).toHex(),
      J = W4.util.createBuffer(Q.publicKeyExponent).toHex();
    return M3.setRsaPublicKey(new n5(Y, 16), new n5(J, 16))
  };
  M3.publicKeyToAsn1 = M3.publicKeyToSubjectPublicKeyInfo = function (A) {
    return w0.create(w0.Class.UNIVERSAL, w0.Type.SEQUENCE, !0, [w0.create(w0.Class.UNIVERSAL, w0.Type.SEQUENCE, !0, [w0.create(w0.Class.UNIVERSAL, w0.Type.OID, !1, w0.oidToDer(M3.oids.rsaEncryption).getBytes()), w0.create(w0.Class.UNIVERSAL, w0.Type.NULL, !1, "")]), w0.create(w0.Class.UNIVERSAL, w0.Type.BITSTRING, !1, [M3.publicKeyToRSAPublicKey(A)])])
  };
  M3.publicKeyToRSAPublicKey = function (A) {
    return w0.create(w0.Class.UNIVERSAL, w0.Type.SEQUENCE, !0, [w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, hf(A.n)), w0.create(w0.Class.UNIVERSAL, w0.Type.INTEGER, !1, hf(A.e))])
  };

  function Ga2(A, Q, B) {
    var G = W4.util.createBuffer(),
      Z = Math.ceil(Q.n.bitLength() / 8);
    if (A.length > Z - 11) {
      var Y = Error("Message is too long for PKCS#1 v1.5 padding.");
      throw Y.length = A.length, Y.max = Z - 11, Y
    }
    G.putByte(0), G.putByte(B);
    var J = Z - 3 - A.length,
      X;
    if (B === 0 || B === 1) {
      X = B === 0 ? 0 : 255;
      for (var I = 0; I < J; ++I) G.putByte(X)
    } else
      while (J > 0) {
        var D = 0,
          W = W4.random.getBytes(J);
        for (var I = 0; I < J; ++I)
          if (X = W.charCodeAt(I), X === 0) ++D;
          else G.putByte(X);
        J = D
      }
    return G.putByte(0), G.putBytes(A), G
  }

  function tV1(A, Q, B, G) {
    var Z = Math.ceil(Q.n.bitLength() / 8),
      Y = W4.util.createBuffer(A),
      J = Y.getByte(),
      X = Y.getByte();
    if (J !== 0 || B && X !== 0 && X !== 1 || !B && X != 2 || B && X === 0 && typeof G > "u") throw Error("Encryption block is invalid.");
    var I = 0;
    if (X === 0) {
      I = Z - 3 - G;
      for (var D = 0; D < I; ++D)
        if (Y.getByte() !== 0) throw Error("Encryption block is invalid.")
    } else if (X === 1) {
      I = 0;
      while (Y.length() > 1) {
        if (Y.getByte() !== 255) {
          --Y.read;
          break
        }++I
      }
    } else if (X === 2) {
      I = 0;
      while (Y.length() > 1) {
        if (Y.getByte() === 0) {
          --Y.read;
          break
        }++I
      }
    }
    var W = Y.getByte();
    if (W !== 0 || I !== Z - 3 - Y.length()) throw Error("Encryption block is invalid.");
    return Y.getBytes()
  }

  function B07(A, Q, B) {
    if (typeof Q === "function") B = Q, Q = {};
    Q = Q || {};
    var G = {
      algorithm: {
        name: Q.algorithm || "PRIMEINC",
        options: {
          workers: Q.workers || 2,
          workLoad: Q.workLoad || 100,
          workerScript: Q.workerScript
        }
      }
    };
    if ("prng" in Q) G.prng = Q.prng;
    Z();

    function Z() {
      Y(A.pBits, function (X, I) {
        if (X) return B(X);
        if (A.p = I, A.q !== null) return J(X, A.q);
        Y(A.qBits, J)
      })
    }

    function Y(X, I) {
      W4.prime.generateProbablePrime(X, G, I)
    }

    function J(X, I) {
      if (X) return B(X);
      if (A.q = I, A.p.compareTo(A.q) < 0) {
        var D = A.p;
        A.p = A.q, A.q = D
      }
      if (A.p.subtract(n5.ONE).gcd(A.e).compareTo(n5.ONE) !== 0) {
        A.p = null, Z();
        return
      }
      if (A.q.subtract(n5.ONE).gcd(A.e).compareTo(n5.ONE) !== 0) {
        A.q = null, Y(A.qBits, J);
        return
      }
      if (A.p1 = A.p.subtract(n5.ONE), A.q1 = A.q.subtract(n5.ONE), A.phi = A.p1.multiply(A.q1), A.phi.gcd(A.e).compareTo(n5.ONE) !== 0) {
        A.p = A.q = null, Z();
        return
      }
      if (A.n = A.p.multiply(A.q), A.n.bitLength() !== A.bits) {
        A.q = null, Y(A.qBits, J);
        return
      }
      var W = A.e.modInverse(A.phi);
      A.keys = {
        privateKey: M3.rsa.setPrivateKey(A.n, A.e, W, A.p, A.q, W.mod(A.p1), W.mod(A.q1), A.q.modInverse(A.p)),
        publicKey: M3.rsa.setPublicKey(A.n, A.e)
      }, B(null, A.keys)
    }
  }

  function hf(A) {
    var Q = A.toString(16);
    if (Q[0] >= "8") Q = "00" + Q;
    var B = W4.util.hexToBytes(Q);
    if (B.length > 1 && (B.charCodeAt(0) === 0 && (B.charCodeAt(1) & 128) === 0 || B.charCodeAt(0) === 255 && (B.charCodeAt(1) & 128) === 128)) return B.substr(1);
    return B
  }

  function G07(A) {
    if (A <= 100) return 27;
    if (A <= 150) return 18;
    if (A <= 200) return 15;
    if (A <= 250) return 12;
    if (A <= 300) return 9;
    if (A <= 350) return 8;
    if (A <= 400) return 7;
    if (A <= 500) return 6;
    if (A <= 600) return 5;
    if (A <= 800) return 4;
    if (A <= 1250) return 3;
    return 2
  }

  function tn2(A) {
    return W4.util.isNodejs && typeof Xw0[A] === "function"
  }

  function en2(A) {
    return typeof Dj.globalScope < "u" && typeof Dj.globalScope.crypto === "object" && typeof Dj.globalScope.crypto.subtle === "object" && typeof Dj.globalScope.crypto.subtle[A] === "function"
  }

  function Aa2(A) {
    return typeof Dj.globalScope < "u" && typeof Dj.globalScope.msCrypto === "object" && typeof Dj.globalScope.msCrypto.subtle === "object" && typeof Dj.globalScope.msCrypto.subtle[A] === "function"
  }

  function Qa2(A) {
    var Q = W4.util.hexToBytes(A.toString(16)),
      B = new Uint8Array(Q.length);
    for (var G = 0; G < Q.length; ++G) B[G] = Q.charCodeAt(G);
    return B
  }
})
// @from(Ln 375412, Col 4)
Dw0 = U((HXY, Ia2) => {
  var S2 = H8();
  xt();
  Nx();
  yfA();
  Sf();
  yt();
  nV1();
  J3A();
  Xj();
  eN0();
  bfA();
  _7();
  if (typeof Iw0 > "u") Iw0 = S2.jsbn.BigInteger;
  var Iw0, ZQ = S2.asn1,
    t3 = S2.pki = S2.pki || {};
  Ia2.exports = t3.pbe = S2.pbe = S2.pbe || {};
  var D3A = t3.oids,
    Z07 = {
      name: "EncryptedPrivateKeyInfo",
      tagClass: ZQ.Class.UNIVERSAL,
      type: ZQ.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
        tagClass: ZQ.Class.UNIVERSAL,
        type: ZQ.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "AlgorithmIdentifier.algorithm",
          tagClass: ZQ.Class.UNIVERSAL,
          type: ZQ.Type.OID,
          constructed: !1,
          capture: "encryptionOid"
        }, {
          name: "AlgorithmIdentifier.parameters",
          tagClass: ZQ.Class.UNIVERSAL,
          type: ZQ.Type.SEQUENCE,
          constructed: !0,
          captureAsn1: "encryptionParams"
        }]
      }, {
        name: "EncryptedPrivateKeyInfo.encryptedData",
        tagClass: ZQ.Class.UNIVERSAL,
        type: ZQ.Type.OCTETSTRING,
        constructed: !1,
        capture: "encryptedData"
      }]
    },
    Y07 = {
      name: "PBES2Algorithms",
      tagClass: ZQ.Class.UNIVERSAL,
      type: ZQ.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "PBES2Algorithms.keyDerivationFunc",
        tagClass: ZQ.Class.UNIVERSAL,
        type: ZQ.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "PBES2Algorithms.keyDerivationFunc.oid",
          tagClass: ZQ.Class.UNIVERSAL,
          type: ZQ.Type.OID,
          constructed: !1,
          capture: "kdfOid"
        }, {
          name: "PBES2Algorithms.params",
          tagClass: ZQ.Class.UNIVERSAL,
          type: ZQ.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "PBES2Algorithms.params.salt",
            tagClass: ZQ.Class.UNIVERSAL,
            type: ZQ.Type.OCTETSTRING,
            constructed: !1,
            capture: "kdfSalt"
          }, {
            name: "PBES2Algorithms.params.iterationCount",
            tagClass: ZQ.Class.UNIVERSAL,
            type: ZQ.Type.INTEGER,
            constructed: !1,
            capture: "kdfIterationCount"
          }, {
            name: "PBES2Algorithms.params.keyLength",
            tagClass: ZQ.Class.UNIVERSAL,
            type: ZQ.Type.INTEGER,
            constructed: !1,
            optional: !0,
            capture: "keyLength"
          }, {
            name: "PBES2Algorithms.params.prf",
            tagClass: ZQ.Class.UNIVERSAL,
            type: ZQ.Type.SEQUENCE,
            constructed: !0,
            optional: !0,
            value: [{
              name: "PBES2Algorithms.params.prf.algorithm",
              tagClass: ZQ.Class.UNIVERSAL,
              type: ZQ.Type.OID,
              constructed: !1,
              capture: "prfOid"
            }]
          }]
        }]
      }, {
        name: "PBES2Algorithms.encryptionScheme",
        tagClass: ZQ.Class.UNIVERSAL,
        type: ZQ.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "PBES2Algorithms.encryptionScheme.oid",
          tagClass: ZQ.Class.UNIVERSAL,
          type: ZQ.Type.OID,
          constructed: !1,
          capture: "encOid"
        }, {
          name: "PBES2Algorithms.encryptionScheme.iv",
          tagClass: ZQ.Class.UNIVERSAL,
          type: ZQ.Type.OCTETSTRING,
          constructed: !1,
          capture: "encIv"
        }]
      }]
    },
    J07 = {
      name: "pkcs-12PbeParams",
      tagClass: ZQ.Class.UNIVERSAL,
      type: ZQ.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "pkcs-12PbeParams.salt",
        tagClass: ZQ.Class.UNIVERSAL,
        type: ZQ.Type.OCTETSTRING,
        constructed: !1,
        capture: "salt"
      }, {
        name: "pkcs-12PbeParams.iterations",
        tagClass: ZQ.Class.UNIVERSAL,
        type: ZQ.Type.INTEGER,
        constructed: !1,
        capture: "iterations"
      }]
    };
  t3.encryptPrivateKeyInfo = function (A, Q, B) {
    B = B || {}, B.saltSize = B.saltSize || 8, B.count = B.count || 2048, B.algorithm = B.algorithm || "aes128", B.prfAlgorithm = B.prfAlgorithm || "sha1";
    var G = S2.random.getBytesSync(B.saltSize),
      Z = B.count,
      Y = ZQ.integerToDer(Z),
      J, X, I;
    if (B.algorithm.indexOf("aes") === 0 || B.algorithm === "des") {
      var D, W, K;
      switch (B.algorithm) {
        case "aes128":
          J = 16, D = 16, W = D3A["aes128-CBC"], K = S2.aes.createEncryptionCipher;
          break;
        case "aes192":
          J = 24, D = 16, W = D3A["aes192-CBC"], K = S2.aes.createEncryptionCipher;
          break;
        case "aes256":
          J = 32, D = 16, W = D3A["aes256-CBC"], K = S2.aes.createEncryptionCipher;
          break;
        case "des":
          J = 8, D = 8, W = D3A.desCBC, K = S2.des.createEncryptionCipher;
          break;
        default:
          var V = Error("Cannot encrypt private key. Unknown encryption algorithm.");
          throw V.algorithm = B.algorithm, V
      }
      var F = "hmacWith" + B.prfAlgorithm.toUpperCase(),
        H = Xa2(F),
        E = S2.pkcs5.pbkdf2(Q, G, Z, J, H),
        z = S2.random.getBytesSync(D),
        $ = K(E);
      $.start(z), $.update(ZQ.toDer(A)), $.finish(), I = $.output.getBytes();
      var O = X07(G, Y, J, F);
      X = ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.SEQUENCE, !0, [ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.OID, !1, ZQ.oidToDer(D3A.pkcs5PBES2).getBytes()), ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.SEQUENCE, !0, [ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.SEQUENCE, !0, [ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.OID, !1, ZQ.oidToDer(D3A.pkcs5PBKDF2).getBytes()), O]), ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.SEQUENCE, !0, [ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.OID, !1, ZQ.oidToDer(W).getBytes()), ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.OCTETSTRING, !1, z)])])])
    } else if (B.algorithm === "3des") {
      J = 24;
      var L = new S2.util.ByteBuffer(G),
        E = t3.pbe.generatePkcs12Key(Q, L, 1, Z, J),
        z = t3.pbe.generatePkcs12Key(Q, L, 2, Z, J),
        $ = S2.des.createEncryptionCipher(E);
      $.start(z), $.update(ZQ.toDer(A)), $.finish(), I = $.output.getBytes(), X = ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.SEQUENCE, !0, [ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.OID, !1, ZQ.oidToDer(D3A["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()), ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.SEQUENCE, !0, [ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.OCTETSTRING, !1, G), ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.INTEGER, !1, Y.getBytes())])])
    } else {
      var V = Error("Cannot encrypt private key. Unknown encryption algorithm.");
      throw V.algorithm = B.algorithm, V
    }
    var M = ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.SEQUENCE, !0, [X, ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.OCTETSTRING, !1, I)]);
    return M
  };
  t3.decryptPrivateKeyInfo = function (A, Q) {
    var B = null,
      G = {},
      Z = [];
    if (!ZQ.validate(A, Z07, G, Z)) {
      var Y = Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      throw Y.errors = Z, Y
    }
    var J = ZQ.derToOid(G.encryptionOid),
      X = t3.pbe.getCipher(J, G.encryptionParams, Q),
      I = S2.util.createBuffer(G.encryptedData);
    if (X.update(I), X.finish()) B = ZQ.fromDer(X.output);
    return B
  };
  t3.encryptedPrivateKeyToPem = function (A, Q) {
    var B = {
      type: "ENCRYPTED PRIVATE KEY",
      body: ZQ.toDer(A).getBytes()
    };
    return S2.pem.encode(B, {
      maxline: Q
    })
  };
  t3.encryptedPrivateKeyFromPem = function (A) {
    var Q = S2.pem.decode(A)[0];
    if (Q.type !== "ENCRYPTED PRIVATE KEY") {
      var B = Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".');
      throw B.headerType = Q.type, B
    }
    if (Q.procType && Q.procType.type === "ENCRYPTED") throw Error("Could not convert encrypted private key from PEM; PEM is encrypted.");
    return ZQ.fromDer(Q.body)
  };
  t3.encryptRsaPrivateKey = function (A, Q, B) {
    if (B = B || {}, !B.legacy) {
      var G = t3.wrapRsaPrivateKey(t3.privateKeyToAsn1(A));
      return G = t3.encryptPrivateKeyInfo(G, Q, B), t3.encryptedPrivateKeyToPem(G)
    }
    var Z, Y, J, X;
    switch (B.algorithm) {
      case "aes128":
        Z = "AES-128-CBC", J = 16, Y = S2.random.getBytesSync(16), X = S2.aes.createEncryptionCipher;
        break;
      case "aes192":
        Z = "AES-192-CBC", J = 24, Y = S2.random.getBytesSync(16), X = S2.aes.createEncryptionCipher;
        break;
      case "aes256":
        Z = "AES-256-CBC", J = 32, Y = S2.random.getBytesSync(16), X = S2.aes.createEncryptionCipher;
        break;
      case "3des":
        Z = "DES-EDE3-CBC", J = 24, Y = S2.random.getBytesSync(8), X = S2.des.createEncryptionCipher;
        break;
      case "des":
        Z = "DES-CBC", J = 8, Y = S2.random.getBytesSync(8), X = S2.des.createEncryptionCipher;
        break;
      default:
        var I = Error('Could not encrypt RSA private key; unsupported encryption algorithm "' + B.algorithm + '".');
        throw I.algorithm = B.algorithm, I
    }
    var D = S2.pbe.opensslDeriveBytes(Q, Y.substr(0, 8), J),
      W = X(D);
    W.start(Y), W.update(ZQ.toDer(t3.privateKeyToAsn1(A))), W.finish();
    var K = {
      type: "RSA PRIVATE KEY",
      procType: {
        version: "4",
        type: "ENCRYPTED"
      },
      dekInfo: {
        algorithm: Z,
        parameters: S2.util.bytesToHex(Y).toUpperCase()
      },
      body: W.output.getBytes()
    };
    return S2.pem.encode(K)
  };
  t3.decryptRsaPrivateKey = function (A, Q) {
    var B = null,
      G = S2.pem.decode(A)[0];
    if (G.type !== "ENCRYPTED PRIVATE KEY" && G.type !== "PRIVATE KEY" && G.type !== "RSA PRIVATE KEY") {
      var Z = Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".');
      throw Z.headerType = Z, Z
    }
    if (G.procType && G.procType.type === "ENCRYPTED") {
      var Y, J;
      switch (G.dekInfo.algorithm) {
        case "DES-CBC":
          Y = 8, J = S2.des.createDecryptionCipher;
          break;
        case "DES-EDE3-CBC":
          Y = 24, J = S2.des.createDecryptionCipher;
          break;
        case "AES-128-CBC":
          Y = 16, J = S2.aes.createDecryptionCipher;
          break;
        case "AES-192-CBC":
          Y = 24, J = S2.aes.createDecryptionCipher;
          break;
        case "AES-256-CBC":
          Y = 32, J = S2.aes.createDecryptionCipher;
          break;
        case "RC2-40-CBC":
          Y = 5, J = function (K) {
            return S2.rc2.createDecryptionCipher(K, 40)
          };
          break;
        case "RC2-64-CBC":
          Y = 8, J = function (K) {
            return S2.rc2.createDecryptionCipher(K, 64)
          };
          break;
        case "RC2-128-CBC":
          Y = 16, J = function (K) {
            return S2.rc2.createDecryptionCipher(K, 128)
          };
          break;
        default:
          var Z = Error('Could not decrypt private key; unsupported encryption algorithm "' + G.dekInfo.algorithm + '".');
          throw Z.algorithm = G.dekInfo.algorithm, Z
      }
      var X = S2.util.hexToBytes(G.dekInfo.parameters),
        I = S2.pbe.opensslDeriveBytes(Q, X.substr(0, 8), Y),
        D = J(I);
      if (D.start(X), D.update(S2.util.createBuffer(G.body)), D.finish()) B = D.output.getBytes();
      else return B
    } else B = G.body;
    if (G.type === "ENCRYPTED PRIVATE KEY") B = t3.decryptPrivateKeyInfo(ZQ.fromDer(B), Q);
    else B = ZQ.fromDer(B);
    if (B !== null) B = t3.privateKeyFromAsn1(B);
    return B
  };
  t3.pbe.generatePkcs12Key = function (A, Q, B, G, Z, Y) {
    var J, X;
    if (typeof Y > "u" || Y === null) {
      if (!("sha1" in S2.md)) throw Error('"sha1" hash algorithm unavailable.');
      Y = S2.md.sha1.create()
    }
    var {
      digestLength: I,
      blockLength: D
    } = Y, W = new S2.util.ByteBuffer, K = new S2.util.ByteBuffer;
    if (A !== null && A !== void 0) {
      for (X = 0; X < A.length; X++) K.putInt16(A.charCodeAt(X));
      K.putInt16(0)
    }
    var V = K.length(),
      F = Q.length(),
      H = new S2.util.ByteBuffer;
    H.fillWithByte(B, D);
    var E = D * Math.ceil(F / D),
      z = new S2.util.ByteBuffer;
    for (X = 0; X < E; X++) z.putByte(Q.at(X % F));
    var $ = D * Math.ceil(V / D),
      O = new S2.util.ByteBuffer;
    for (X = 0; X < $; X++) O.putByte(K.at(X % V));
    var L = z;
    L.putBuffer(O);
    var M = Math.ceil(Z / I);
    for (var _ = 1; _ <= M; _++) {
      var j = new S2.util.ByteBuffer;
      j.putBytes(H.bytes()), j.putBytes(L.bytes());
      for (var x = 0; x < G; x++) Y.start(), Y.update(j.getBytes()), j = Y.digest();
      var b = new S2.util.ByteBuffer;
      for (X = 0; X < D; X++) b.putByte(j.at(X % I));
      var S = Math.ceil(F / D) + Math.ceil(V / D),
        u = new S2.util.ByteBuffer;
      for (J = 0; J < S; J++) {
        var f = new S2.util.ByteBuffer(L.getBytes(D)),
          AA = 511;
        for (X = b.length() - 1; X >= 0; X--) AA = AA >> 8, AA += b.at(X) + f.at(X), f.setAt(X, AA & 255);
        u.putBuffer(f)
      }
      L = u, W.putBuffer(j)
    }
    return W.truncate(W.length() - Z), W
  };
  t3.pbe.getCipher = function (A, Q, B) {
    switch (A) {
      case t3.oids.pkcs5PBES2:
        return t3.pbe.getCipherForPBES2(A, Q, B);
      case t3.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
      case t3.oids["pbewithSHAAnd40BitRC2-CBC"]:
        return t3.pbe.getCipherForPKCS12PBE(A, Q, B);
      default:
        var G = Error("Cannot read encrypted PBE data block. Unsupported OID.");
        throw G.oid = A, G.supportedOids = ["pkcs5PBES2", "pbeWithSHAAnd3-KeyTripleDES-CBC", "pbewithSHAAnd40BitRC2-CBC"], G
    }
  };
  t3.pbe.getCipherForPBES2 = function (A, Q, B) {
    var G = {},
      Z = [];
    if (!ZQ.validate(Q, Y07, G, Z)) {
      var Y = Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      throw Y.errors = Z, Y
    }
    if (A = ZQ.derToOid(G.kdfOid), A !== t3.oids.pkcs5PBKDF2) {
      var Y = Error("Cannot read encrypted private key. Unsupported key derivation function OID.");
      throw Y.oid = A, Y.supportedOids = ["pkcs5PBKDF2"], Y
    }
    if (A = ZQ.derToOid(G.encOid), A !== t3.oids["aes128-CBC"] && A !== t3.oids["aes192-CBC"] && A !== t3.oids["aes256-CBC"] && A !== t3.oids["des-EDE3-CBC"] && A !== t3.oids.desCBC) {
      var Y = Error("Cannot read encrypted private key. Unsupported encryption scheme OID.");
      throw Y.oid = A, Y.supportedOids = ["aes128-CBC", "aes192-CBC", "aes256-CBC", "des-EDE3-CBC", "desCBC"], Y
    }
    var J = G.kdfSalt,
      X = S2.util.createBuffer(G.kdfIterationCount);
    X = X.getInt(X.length() << 3);
    var I, D;
    switch (t3.oids[A]) {
      case "aes128-CBC":
        I = 16, D = S2.aes.createDecryptionCipher;
        break;
      case "aes192-CBC":
        I = 24, D = S2.aes.createDecryptionCipher;
        break;
      case "aes256-CBC":
        I = 32, D = S2.aes.createDecryptionCipher;
        break;
      case "des-EDE3-CBC":
        I = 24, D = S2.des.createDecryptionCipher;
        break;
      case "desCBC":
        I = 8, D = S2.des.createDecryptionCipher;
        break
    }
    var W = Ja2(G.prfOid),
      K = S2.pkcs5.pbkdf2(B, J, X, I, W),
      V = G.encIv,
      F = D(K);
    return F.start(V), F
  };
  t3.pbe.getCipherForPKCS12PBE = function (A, Q, B) {
    var G = {},
      Z = [];
    if (!ZQ.validate(Q, J07, G, Z)) {
      var Y = Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      throw Y.errors = Z, Y
    }
    var J = S2.util.createBuffer(G.salt),
      X = S2.util.createBuffer(G.iterations);
    X = X.getInt(X.length() << 3);
    var I, D, W;
    switch (A) {
      case t3.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
        I = 24, D = 8, W = S2.des.startDecrypting;
        break;
      case t3.oids["pbewithSHAAnd40BitRC2-CBC"]:
        I = 5, D = 8, W = function (E, z) {
          var $ = S2.rc2.createDecryptionCipher(E, 40);
          return $.start(z, null), $
        };
        break;
      default:
        var Y = Error("Cannot read PKCS #12 PBE data block. Unsupported OID.");
        throw Y.oid = A, Y
    }
    var K = Ja2(G.prfOid),
      V = t3.pbe.generatePkcs12Key(B, J, 1, X, I, K);
    K.start();
    var F = t3.pbe.generatePkcs12Key(B, J, 2, X, D, K);
    return W(V, F)
  };
  t3.pbe.opensslDeriveBytes = function (A, Q, B, G) {
    if (typeof G > "u" || G === null) {
      if (!("md5" in S2.md)) throw Error('"md5" hash algorithm unavailable.');
      G = S2.md.md5.create()
    }
    if (Q === null) Q = "";
    var Z = [Ya2(G, A + Q)];
    for (var Y = 16, J = 1; Y < B; ++J, Y += 16) Z.push(Ya2(G, Z[J - 1] + A + Q));
    return Z.join("").substr(0, B)
  };

  function Ya2(A, Q) {
    return A.start().update(Q).digest().getBytes()
  }

  function Ja2(A) {
    var Q;
    if (!A) Q = "hmacWithSHA1";
    else if (Q = t3.oids[ZQ.derToOid(A)], !Q) {
      var B = Error("Unsupported PRF OID.");
      throw B.oid = A, B.supported = ["hmacWithSHA1", "hmacWithSHA224", "hmacWithSHA256", "hmacWithSHA384", "hmacWithSHA512"], B
    }
    return Xa2(Q)
  }

  function Xa2(A) {
    var Q = S2.md;
    switch (A) {
      case "hmacWithSHA224":
        Q = S2.md.sha512;
      case "hmacWithSHA1":
      case "hmacWithSHA256":
      case "hmacWithSHA384":
      case "hmacWithSHA512":
        A = A.substr(8).toLowerCase();
        break;
      default:
        var B = Error("Unsupported PRF algorithm.");
        throw B.algorithm = A, B.supported = ["hmacWithSHA1", "hmacWithSHA224", "hmacWithSHA256", "hmacWithSHA384", "hmacWithSHA512"], B
    }
    if (!Q || !(A in Q)) throw Error("Unknown hash algorithm: " + A);
    return Q[A].create()
  }

  function X07(A, Q, B, G) {
    var Z = ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.SEQUENCE, !0, [ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.OCTETSTRING, !1, A), ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.INTEGER, !1, Q.getBytes())]);
    if (G !== "hmacWithSHA1") Z.value.push(ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.INTEGER, !1, S2.util.hexToBytes(B.toString(16))), ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.SEQUENCE, !0, [ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.OID, !1, ZQ.oidToDer(t3.oids[G]).getBytes()), ZQ.create(ZQ.Class.UNIVERSAL, ZQ.Type.NULL, !1, "")]));
    return Z
  }
})
// @from(Ln 375912, Col 4)
Ww0 = U((EXY, Ka2) => {
  var jEA = H8();
  Nx();
  _7();
  var L2 = jEA.asn1,
    TEA = Ka2.exports = jEA.pkcs7asn1 = jEA.pkcs7asn1 || {};
  jEA.pkcs7 = jEA.pkcs7 || {};
  jEA.pkcs7.asn1 = TEA;
  var Da2 = {
    name: "ContentInfo",
    tagClass: L2.Class.UNIVERSAL,
    type: L2.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "ContentInfo.ContentType",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.OID,
      constructed: !1,
      capture: "contentType"
    }, {
      name: "ContentInfo.content",
      tagClass: L2.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: !0,
      optional: !0,
      captureAsn1: "content"
    }]
  };
  TEA.contentInfoValidator = Da2;
  var Wa2 = {
    name: "EncryptedContentInfo",
    tagClass: L2.Class.UNIVERSAL,
    type: L2.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "EncryptedContentInfo.contentType",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.OID,
      constructed: !1,
      capture: "contentType"
    }, {
      name: "EncryptedContentInfo.contentEncryptionAlgorithm",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "EncryptedContentInfo.contentEncryptionAlgorithm.algorithm",
        tagClass: L2.Class.UNIVERSAL,
        type: L2.Type.OID,
        constructed: !1,
        capture: "encAlgorithm"
      }, {
        name: "EncryptedContentInfo.contentEncryptionAlgorithm.parameter",
        tagClass: L2.Class.UNIVERSAL,
        captureAsn1: "encParameter"
      }]
    }, {
      name: "EncryptedContentInfo.encryptedContent",
      tagClass: L2.Class.CONTEXT_SPECIFIC,
      type: 0,
      capture: "encryptedContent",
      captureAsn1: "encryptedContentAsn1"
    }]
  };
  TEA.envelopedDataValidator = {
    name: "EnvelopedData",
    tagClass: L2.Class.UNIVERSAL,
    type: L2.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "EnvelopedData.Version",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.INTEGER,
      constructed: !1,
      capture: "version"
    }, {
      name: "EnvelopedData.RecipientInfos",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.SET,
      constructed: !0,
      captureAsn1: "recipientInfos"
    }].concat(Wa2)
  };
  TEA.encryptedDataValidator = {
    name: "EncryptedData",
    tagClass: L2.Class.UNIVERSAL,
    type: L2.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "EncryptedData.Version",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.INTEGER,
      constructed: !1,
      capture: "version"
    }].concat(Wa2)
  };
  var I07 = {
    name: "SignerInfo",
    tagClass: L2.Class.UNIVERSAL,
    type: L2.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "SignerInfo.version",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.INTEGER,
      constructed: !1
    }, {
      name: "SignerInfo.issuerAndSerialNumber",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "SignerInfo.issuerAndSerialNumber.issuer",
        tagClass: L2.Class.UNIVERSAL,
        type: L2.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "issuer"
      }, {
        name: "SignerInfo.issuerAndSerialNumber.serialNumber",
        tagClass: L2.Class.UNIVERSAL,
        type: L2.Type.INTEGER,
        constructed: !1,
        capture: "serial"
      }]
    }, {
      name: "SignerInfo.digestAlgorithm",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "SignerInfo.digestAlgorithm.algorithm",
        tagClass: L2.Class.UNIVERSAL,
        type: L2.Type.OID,
        constructed: !1,
        capture: "digestAlgorithm"
      }, {
        name: "SignerInfo.digestAlgorithm.parameter",
        tagClass: L2.Class.UNIVERSAL,
        constructed: !1,
        captureAsn1: "digestParameter",
        optional: !0
      }]
    }, {
      name: "SignerInfo.authenticatedAttributes",
      tagClass: L2.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: !0,
      optional: !0,
      capture: "authenticatedAttributes"
    }, {
      name: "SignerInfo.digestEncryptionAlgorithm",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.SEQUENCE,
      constructed: !0,
      capture: "signatureAlgorithm"
    }, {
      name: "SignerInfo.encryptedDigest",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.OCTETSTRING,
      constructed: !1,
      capture: "signature"
    }, {
      name: "SignerInfo.unauthenticatedAttributes",
      tagClass: L2.Class.CONTEXT_SPECIFIC,
      type: 1,
      constructed: !0,
      optional: !0,
      capture: "unauthenticatedAttributes"
    }]
  };
  TEA.signedDataValidator = {
    name: "SignedData",
    tagClass: L2.Class.UNIVERSAL,
    type: L2.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "SignedData.Version",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.INTEGER,
      constructed: !1,
      capture: "version"
    }, {
      name: "SignedData.DigestAlgorithms",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.SET,
      constructed: !0,
      captureAsn1: "digestAlgorithms"
    }, Da2, {
      name: "SignedData.Certificates",
      tagClass: L2.Class.CONTEXT_SPECIFIC,
      type: 0,
      optional: !0,
      captureAsn1: "certificates"
    }, {
      name: "SignedData.CertificateRevocationLists",
      tagClass: L2.Class.CONTEXT_SPECIFIC,
      type: 1,
      optional: !0,
      captureAsn1: "crls"
    }, {
      name: "SignedData.SignerInfos",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.SET,
      capture: "signerInfos",
      optional: !0,
      value: [I07]
    }]
  };
  TEA.recipientInfoValidator = {
    name: "RecipientInfo",
    tagClass: L2.Class.UNIVERSAL,
    type: L2.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "RecipientInfo.version",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.INTEGER,
      constructed: !1,
      capture: "version"
    }, {
      name: "RecipientInfo.issuerAndSerial",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "RecipientInfo.issuerAndSerial.issuer",
        tagClass: L2.Class.UNIVERSAL,
        type: L2.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "issuer"
      }, {
        name: "RecipientInfo.issuerAndSerial.serialNumber",
        tagClass: L2.Class.UNIVERSAL,
        type: L2.Type.INTEGER,
        constructed: !1,
        capture: "serial"
      }]
    }, {
      name: "RecipientInfo.keyEncryptionAlgorithm",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "RecipientInfo.keyEncryptionAlgorithm.algorithm",
        tagClass: L2.Class.UNIVERSAL,
        type: L2.Type.OID,
        constructed: !1,
        capture: "encAlgorithm"
      }, {
        name: "RecipientInfo.keyEncryptionAlgorithm.parameter",
        tagClass: L2.Class.UNIVERSAL,
        constructed: !1,
        captureAsn1: "encParameter",
        optional: !0
      }]
    }, {
      name: "RecipientInfo.encryptedKey",
      tagClass: L2.Class.UNIVERSAL,
      type: L2.Type.OCTETSTRING,
      constructed: !1,
      capture: "encKey"
    }]
  }
})
// @from(Ln 376176, Col 4)
Kw0 = U((zXY, Va2) => {
  var W3A = H8();
  _7();
  W3A.mgf = W3A.mgf || {};
  var D07 = Va2.exports = W3A.mgf.mgf1 = W3A.mgf1 = W3A.mgf1 || {};
  D07.create = function (A) {
    var Q = {
      generate: function (B, G) {
        var Z = new W3A.util.ByteBuffer,
          Y = Math.ceil(G / A.digestLength);
        for (var J = 0; J < Y; J++) {
          var X = new W3A.util.ByteBuffer;
          X.putInt32(J), A.start(), A.update(B + X.getBytes()), Z.putBuffer(A.digest())
        }
        return Z.truncate(Z.length() - G), Z.getBytes()
      }
    };
    return Q
  }
})
// @from(Ln 376196, Col 4)
Ha2 = U(($XY, Fa2) => {
  var eV1 = H8();
  Kw0();
  Fa2.exports = eV1.mgf = eV1.mgf || {};
  eV1.mgf.mgf1 = eV1.mgf1
})
// @from(Ln 376202, Col 4)
AF1 = U((CXY, Ea2) => {
  var K3A = H8();
  Xj();
  _7();
  var W07 = Ea2.exports = K3A.pss = K3A.pss || {};
  W07.create = function (A) {
    if (arguments.length === 3) A = {
      md: arguments[0],
      mgf: arguments[1],
      saltLength: arguments[2]
    };
    var {
      md: Q,
      mgf: B
    } = A, G = Q.digestLength, Z = A.salt || null;
    if (typeof Z === "string") Z = K3A.util.createBuffer(Z);
    var Y;
    if ("saltLength" in A) Y = A.saltLength;
    else if (Z !== null) Y = Z.length();
    else throw Error("Salt length not specified or specific salt not given.");
    if (Z !== null && Z.length() !== Y) throw Error("Given salt length does not match length of given salt.");
    var J = A.prng || K3A.random,
      X = {};
    return X.encode = function (I, D) {
      var W, K = D - 1,
        V = Math.ceil(K / 8),
        F = I.digest().getBytes();
      if (V < G + Y + 2) throw Error("Message is too long to encrypt.");
      var H;
      if (Z === null) H = J.getBytesSync(Y);
      else H = Z.bytes();
      var E = new K3A.util.ByteBuffer;
      E.fillWithByte(0, 8), E.putBytes(F), E.putBytes(H), Q.start(), Q.update(E.getBytes());
      var z = Q.digest().getBytes(),
        $ = new K3A.util.ByteBuffer;
      $.fillWithByte(0, V - Y - G - 2), $.putByte(1), $.putBytes(H);
      var O = $.getBytes(),
        L = V - G - 1,
        M = B.generate(z, L),
        _ = "";
      for (W = 0; W < L; W++) _ += String.fromCharCode(O.charCodeAt(W) ^ M.charCodeAt(W));
      var j = 65280 >> 8 * V - K & 255;
      return _ = String.fromCharCode(_.charCodeAt(0) & ~j) + _.substr(1), _ + z + String.fromCharCode(188)
    }, X.verify = function (I, D, W) {
      var K, V = W - 1,
        F = Math.ceil(V / 8);
      if (D = D.substr(-F), F < G + Y + 2) throw Error("Inconsistent parameters to PSS signature verification.");
      if (D.charCodeAt(F - 1) !== 188) throw Error("Encoded message does not end in 0xBC.");
      var H = F - G - 1,
        E = D.substr(0, H),
        z = D.substr(H, G),
        $ = 65280 >> 8 * F - V & 255;
      if ((E.charCodeAt(0) & $) !== 0) throw Error("Bits beyond keysize not zero as expected.");
      var O = B.generate(z, H),
        L = "";
      for (K = 0; K < H; K++) L += String.fromCharCode(E.charCodeAt(K) ^ O.charCodeAt(K));
      L = String.fromCharCode(L.charCodeAt(0) & ~$) + L.substr(1);
      var M = F - G - Y - 2;
      for (K = 0; K < M; K++)
        if (L.charCodeAt(K) !== 0) throw Error("Leftmost octets not zero as expected");
      if (L.charCodeAt(M) !== 1) throw Error("Inconsistent PSS signature, 0x01 marker not found");
      var _ = L.substr(-Y),
        j = new K3A.util.ByteBuffer;
      j.fillWithByte(0, 8), j.putBytes(I), j.putBytes(_), Q.start(), Q.update(j.getBytes());
      var x = Q.digest().getBytes();
      return z === x
    }, X
  }
})