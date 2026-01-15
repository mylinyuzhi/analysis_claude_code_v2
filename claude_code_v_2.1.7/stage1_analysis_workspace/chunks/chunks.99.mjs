
// @from(Ln 283111, Col 4)
MJ1 = U((xD2, yD2) => {
  Object.defineProperty(xD2, "__esModule", {
    value: !0
  });
  var D4 = sW0(),
    K0 = D4.Reader,
    L3 = D4.Writer,
    hA = D4.util,
    yA = D4.roots.default || (D4.roots.default = {});
  yA.opentelemetry = function () {
    var A = {};
    return A.proto = function () {
      var Q = {};
      return Q.common = function () {
        var B = {};
        return B.v1 = function () {
          var G = {};
          return G.AnyValue = function () {
            function Z(J) {
              if (J) {
                for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                  if (J[X[I]] != null) this[X[I]] = J[X[I]]
              }
            }
            Z.prototype.stringValue = null, Z.prototype.boolValue = null, Z.prototype.intValue = null, Z.prototype.doubleValue = null, Z.prototype.arrayValue = null, Z.prototype.kvlistValue = null, Z.prototype.bytesValue = null;
            var Y;
            return Object.defineProperty(Z.prototype, "value", {
              get: hA.oneOfGetter(Y = ["stringValue", "boolValue", "intValue", "doubleValue", "arrayValue", "kvlistValue", "bytesValue"]),
              set: hA.oneOfSetter(Y)
            }), Z.create = function (X) {
              return new Z(X)
            }, Z.encode = function (X, I) {
              if (!I) I = L3.create();
              if (X.stringValue != null && Object.hasOwnProperty.call(X, "stringValue")) I.uint32(10).string(X.stringValue);
              if (X.boolValue != null && Object.hasOwnProperty.call(X, "boolValue")) I.uint32(16).bool(X.boolValue);
              if (X.intValue != null && Object.hasOwnProperty.call(X, "intValue")) I.uint32(24).int64(X.intValue);
              if (X.doubleValue != null && Object.hasOwnProperty.call(X, "doubleValue")) I.uint32(33).double(X.doubleValue);
              if (X.arrayValue != null && Object.hasOwnProperty.call(X, "arrayValue")) yA.opentelemetry.proto.common.v1.ArrayValue.encode(X.arrayValue, I.uint32(42).fork()).ldelim();
              if (X.kvlistValue != null && Object.hasOwnProperty.call(X, "kvlistValue")) yA.opentelemetry.proto.common.v1.KeyValueList.encode(X.kvlistValue, I.uint32(50).fork()).ldelim();
              if (X.bytesValue != null && Object.hasOwnProperty.call(X, "bytesValue")) I.uint32(58).bytes(X.bytesValue);
              return I
            }, Z.encodeDelimited = function (X, I) {
              return this.encode(X, I).ldelim()
            }, Z.decode = function (X, I, D) {
              if (!(X instanceof K0)) X = K0.create(X);
              var W = I === void 0 ? X.len : X.pos + I,
                K = new yA.opentelemetry.proto.common.v1.AnyValue;
              while (X.pos < W) {
                var V = X.uint32();
                if (V === D) break;
                switch (V >>> 3) {
                  case 1: {
                    K.stringValue = X.string();
                    break
                  }
                  case 2: {
                    K.boolValue = X.bool();
                    break
                  }
                  case 3: {
                    K.intValue = X.int64();
                    break
                  }
                  case 4: {
                    K.doubleValue = X.double();
                    break
                  }
                  case 5: {
                    K.arrayValue = yA.opentelemetry.proto.common.v1.ArrayValue.decode(X, X.uint32());
                    break
                  }
                  case 6: {
                    K.kvlistValue = yA.opentelemetry.proto.common.v1.KeyValueList.decode(X, X.uint32());
                    break
                  }
                  case 7: {
                    K.bytesValue = X.bytes();
                    break
                  }
                  default:
                    X.skipType(V & 7);
                    break
                }
              }
              return K
            }, Z.decodeDelimited = function (X) {
              if (!(X instanceof K0)) X = new K0(X);
              return this.decode(X, X.uint32())
            }, Z.verify = function (X) {
              if (typeof X !== "object" || X === null) return "object expected";
              var I = {};
              if (X.stringValue != null && X.hasOwnProperty("stringValue")) {
                if (I.value = 1, !hA.isString(X.stringValue)) return "stringValue: string expected"
              }
              if (X.boolValue != null && X.hasOwnProperty("boolValue")) {
                if (I.value === 1) return "value: multiple values";
                if (I.value = 1, typeof X.boolValue !== "boolean") return "boolValue: boolean expected"
              }
              if (X.intValue != null && X.hasOwnProperty("intValue")) {
                if (I.value === 1) return "value: multiple values";
                if (I.value = 1, !hA.isInteger(X.intValue) && !(X.intValue && hA.isInteger(X.intValue.low) && hA.isInteger(X.intValue.high))) return "intValue: integer|Long expected"
              }
              if (X.doubleValue != null && X.hasOwnProperty("doubleValue")) {
                if (I.value === 1) return "value: multiple values";
                if (I.value = 1, typeof X.doubleValue !== "number") return "doubleValue: number expected"
              }
              if (X.arrayValue != null && X.hasOwnProperty("arrayValue")) {
                if (I.value === 1) return "value: multiple values";
                I.value = 1;
                {
                  var D = yA.opentelemetry.proto.common.v1.ArrayValue.verify(X.arrayValue);
                  if (D) return "arrayValue." + D
                }
              }
              if (X.kvlistValue != null && X.hasOwnProperty("kvlistValue")) {
                if (I.value === 1) return "value: multiple values";
                I.value = 1;
                {
                  var D = yA.opentelemetry.proto.common.v1.KeyValueList.verify(X.kvlistValue);
                  if (D) return "kvlistValue." + D
                }
              }
              if (X.bytesValue != null && X.hasOwnProperty("bytesValue")) {
                if (I.value === 1) return "value: multiple values";
                if (I.value = 1, !(X.bytesValue && typeof X.bytesValue.length === "number" || hA.isString(X.bytesValue))) return "bytesValue: buffer expected"
              }
              return null
            }, Z.fromObject = function (X) {
              if (X instanceof yA.opentelemetry.proto.common.v1.AnyValue) return X;
              var I = new yA.opentelemetry.proto.common.v1.AnyValue;
              if (X.stringValue != null) I.stringValue = String(X.stringValue);
              if (X.boolValue != null) I.boolValue = Boolean(X.boolValue);
              if (X.intValue != null) {
                if (hA.Long)(I.intValue = hA.Long.fromValue(X.intValue)).unsigned = !1;
                else if (typeof X.intValue === "string") I.intValue = parseInt(X.intValue, 10);
                else if (typeof X.intValue === "number") I.intValue = X.intValue;
                else if (typeof X.intValue === "object") I.intValue = new hA.LongBits(X.intValue.low >>> 0, X.intValue.high >>> 0).toNumber()
              }
              if (X.doubleValue != null) I.doubleValue = Number(X.doubleValue);
              if (X.arrayValue != null) {
                if (typeof X.arrayValue !== "object") throw TypeError(".opentelemetry.proto.common.v1.AnyValue.arrayValue: object expected");
                I.arrayValue = yA.opentelemetry.proto.common.v1.ArrayValue.fromObject(X.arrayValue)
              }
              if (X.kvlistValue != null) {
                if (typeof X.kvlistValue !== "object") throw TypeError(".opentelemetry.proto.common.v1.AnyValue.kvlistValue: object expected");
                I.kvlistValue = yA.opentelemetry.proto.common.v1.KeyValueList.fromObject(X.kvlistValue)
              }
              if (X.bytesValue != null) {
                if (typeof X.bytesValue === "string") hA.base64.decode(X.bytesValue, I.bytesValue = hA.newBuffer(hA.base64.length(X.bytesValue)), 0);
                else if (X.bytesValue.length >= 0) I.bytesValue = X.bytesValue
              }
              return I
            }, Z.toObject = function (X, I) {
              if (!I) I = {};
              var D = {};
              if (X.stringValue != null && X.hasOwnProperty("stringValue")) {
                if (D.stringValue = X.stringValue, I.oneofs) D.value = "stringValue"
              }
              if (X.boolValue != null && X.hasOwnProperty("boolValue")) {
                if (D.boolValue = X.boolValue, I.oneofs) D.value = "boolValue"
              }
              if (X.intValue != null && X.hasOwnProperty("intValue")) {
                if (typeof X.intValue === "number") D.intValue = I.longs === String ? String(X.intValue) : X.intValue;
                else D.intValue = I.longs === String ? hA.Long.prototype.toString.call(X.intValue) : I.longs === Number ? new hA.LongBits(X.intValue.low >>> 0, X.intValue.high >>> 0).toNumber() : X.intValue;
                if (I.oneofs) D.value = "intValue"
              }
              if (X.doubleValue != null && X.hasOwnProperty("doubleValue")) {
                if (D.doubleValue = I.json && !isFinite(X.doubleValue) ? String(X.doubleValue) : X.doubleValue, I.oneofs) D.value = "doubleValue"
              }
              if (X.arrayValue != null && X.hasOwnProperty("arrayValue")) {
                if (D.arrayValue = yA.opentelemetry.proto.common.v1.ArrayValue.toObject(X.arrayValue, I), I.oneofs) D.value = "arrayValue"
              }
              if (X.kvlistValue != null && X.hasOwnProperty("kvlistValue")) {
                if (D.kvlistValue = yA.opentelemetry.proto.common.v1.KeyValueList.toObject(X.kvlistValue, I), I.oneofs) D.value = "kvlistValue"
              }
              if (X.bytesValue != null && X.hasOwnProperty("bytesValue")) {
                if (D.bytesValue = I.bytes === String ? hA.base64.encode(X.bytesValue, 0, X.bytesValue.length) : I.bytes === Array ? Array.prototype.slice.call(X.bytesValue) : X.bytesValue, I.oneofs) D.value = "bytesValue"
              }
              return D
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (X) {
              if (X === void 0) X = "type.googleapis.com";
              return X + "/opentelemetry.proto.common.v1.AnyValue"
            }, Z
          }(), G.ArrayValue = function () {
            function Z(Y) {
              if (this.values = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.values = hA.emptyArray, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.values != null && J.values.length)
                for (var I = 0; I < J.values.length; ++I) yA.opentelemetry.proto.common.v1.AnyValue.encode(J.values[I], X.uint32(10).fork()).ldelim();
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.common.v1.ArrayValue;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(W.values && W.values.length)) W.values = [];
                    W.values.push(yA.opentelemetry.proto.common.v1.AnyValue.decode(J, J.uint32()));
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.values != null && J.hasOwnProperty("values")) {
                if (!Array.isArray(J.values)) return "values: array expected";
                for (var X = 0; X < J.values.length; ++X) {
                  var I = yA.opentelemetry.proto.common.v1.AnyValue.verify(J.values[X]);
                  if (I) return "values." + I
                }
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.common.v1.ArrayValue) return J;
              var X = new yA.opentelemetry.proto.common.v1.ArrayValue;
              if (J.values) {
                if (!Array.isArray(J.values)) throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: array expected");
                X.values = [];
                for (var I = 0; I < J.values.length; ++I) {
                  if (typeof J.values[I] !== "object") throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: object expected");
                  X.values[I] = yA.opentelemetry.proto.common.v1.AnyValue.fromObject(J.values[I])
                }
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.values = [];
              if (J.values && J.values.length) {
                I.values = [];
                for (var D = 0; D < J.values.length; ++D) I.values[D] = yA.opentelemetry.proto.common.v1.AnyValue.toObject(J.values[D], X)
              }
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.common.v1.ArrayValue"
            }, Z
          }(), G.KeyValueList = function () {
            function Z(Y) {
              if (this.values = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.values = hA.emptyArray, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.values != null && J.values.length)
                for (var I = 0; I < J.values.length; ++I) yA.opentelemetry.proto.common.v1.KeyValue.encode(J.values[I], X.uint32(10).fork()).ldelim();
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.common.v1.KeyValueList;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(W.values && W.values.length)) W.values = [];
                    W.values.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.values != null && J.hasOwnProperty("values")) {
                if (!Array.isArray(J.values)) return "values: array expected";
                for (var X = 0; X < J.values.length; ++X) {
                  var I = yA.opentelemetry.proto.common.v1.KeyValue.verify(J.values[X]);
                  if (I) return "values." + I
                }
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.common.v1.KeyValueList) return J;
              var X = new yA.opentelemetry.proto.common.v1.KeyValueList;
              if (J.values) {
                if (!Array.isArray(J.values)) throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: array expected");
                X.values = [];
                for (var I = 0; I < J.values.length; ++I) {
                  if (typeof J.values[I] !== "object") throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: object expected");
                  X.values[I] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.values[I])
                }
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.values = [];
              if (J.values && J.values.length) {
                I.values = [];
                for (var D = 0; D < J.values.length; ++D) I.values[D] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(J.values[D], X)
              }
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.common.v1.KeyValueList"
            }, Z
          }(), G.KeyValue = function () {
            function Z(Y) {
              if (Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.key = null, Z.prototype.value = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.key != null && Object.hasOwnProperty.call(J, "key")) X.uint32(10).string(J.key);
              if (J.value != null && Object.hasOwnProperty.call(J, "value")) yA.opentelemetry.proto.common.v1.AnyValue.encode(J.value, X.uint32(18).fork()).ldelim();
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.common.v1.KeyValue;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    W.key = J.string();
                    break
                  }
                  case 2: {
                    W.value = yA.opentelemetry.proto.common.v1.AnyValue.decode(J, J.uint32());
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.key != null && J.hasOwnProperty("key")) {
                if (!hA.isString(J.key)) return "key: string expected"
              }
              if (J.value != null && J.hasOwnProperty("value")) {
                var X = yA.opentelemetry.proto.common.v1.AnyValue.verify(J.value);
                if (X) return "value." + X
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.common.v1.KeyValue) return J;
              var X = new yA.opentelemetry.proto.common.v1.KeyValue;
              if (J.key != null) X.key = String(J.key);
              if (J.value != null) {
                if (typeof J.value !== "object") throw TypeError(".opentelemetry.proto.common.v1.KeyValue.value: object expected");
                X.value = yA.opentelemetry.proto.common.v1.AnyValue.fromObject(J.value)
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.defaults) I.key = "", I.value = null;
              if (J.key != null && J.hasOwnProperty("key")) I.key = J.key;
              if (J.value != null && J.hasOwnProperty("value")) I.value = yA.opentelemetry.proto.common.v1.AnyValue.toObject(J.value, X);
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.common.v1.KeyValue"
            }, Z
          }(), G.InstrumentationScope = function () {
            function Z(Y) {
              if (this.attributes = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.name = null, Z.prototype.version = null, Z.prototype.attributes = hA.emptyArray, Z.prototype.droppedAttributesCount = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.name != null && Object.hasOwnProperty.call(J, "name")) X.uint32(10).string(J.name);
              if (J.version != null && Object.hasOwnProperty.call(J, "version")) X.uint32(18).string(J.version);
              if (J.attributes != null && J.attributes.length)
                for (var I = 0; I < J.attributes.length; ++I) yA.opentelemetry.proto.common.v1.KeyValue.encode(J.attributes[I], X.uint32(26).fork()).ldelim();
              if (J.droppedAttributesCount != null && Object.hasOwnProperty.call(J, "droppedAttributesCount")) X.uint32(32).uint32(J.droppedAttributesCount);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.common.v1.InstrumentationScope;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    W.name = J.string();
                    break
                  }
                  case 2: {
                    W.version = J.string();
                    break
                  }
                  case 3: {
                    if (!(W.attributes && W.attributes.length)) W.attributes = [];
                    W.attributes.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                    break
                  }
                  case 4: {
                    W.droppedAttributesCount = J.uint32();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.name != null && J.hasOwnProperty("name")) {
                if (!hA.isString(J.name)) return "name: string expected"
              }
              if (J.version != null && J.hasOwnProperty("version")) {
                if (!hA.isString(J.version)) return "version: string expected"
              }
              if (J.attributes != null && J.hasOwnProperty("attributes")) {
                if (!Array.isArray(J.attributes)) return "attributes: array expected";
                for (var X = 0; X < J.attributes.length; ++X) {
                  var I = yA.opentelemetry.proto.common.v1.KeyValue.verify(J.attributes[X]);
                  if (I) return "attributes." + I
                }
              }
              if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) {
                if (!hA.isInteger(J.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.common.v1.InstrumentationScope) return J;
              var X = new yA.opentelemetry.proto.common.v1.InstrumentationScope;
              if (J.name != null) X.name = String(J.name);
              if (J.version != null) X.version = String(J.version);
              if (J.attributes) {
                if (!Array.isArray(J.attributes)) throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: array expected");
                X.attributes = [];
                for (var I = 0; I < J.attributes.length; ++I) {
                  if (typeof J.attributes[I] !== "object") throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: object expected");
                  X.attributes[I] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.attributes[I])
                }
              }
              if (J.droppedAttributesCount != null) X.droppedAttributesCount = J.droppedAttributesCount >>> 0;
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.attributes = [];
              if (X.defaults) I.name = "", I.version = "", I.droppedAttributesCount = 0;
              if (J.name != null && J.hasOwnProperty("name")) I.name = J.name;
              if (J.version != null && J.hasOwnProperty("version")) I.version = J.version;
              if (J.attributes && J.attributes.length) {
                I.attributes = [];
                for (var D = 0; D < J.attributes.length; ++D) I.attributes[D] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(J.attributes[D], X)
              }
              if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) I.droppedAttributesCount = J.droppedAttributesCount;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.common.v1.InstrumentationScope"
            }, Z
          }(), G.EntityRef = function () {
            function Z(Y) {
              if (this.idKeys = [], this.descriptionKeys = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.schemaUrl = null, Z.prototype.type = null, Z.prototype.idKeys = hA.emptyArray, Z.prototype.descriptionKeys = hA.emptyArray, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.schemaUrl != null && Object.hasOwnProperty.call(J, "schemaUrl")) X.uint32(10).string(J.schemaUrl);
              if (J.type != null && Object.hasOwnProperty.call(J, "type")) X.uint32(18).string(J.type);
              if (J.idKeys != null && J.idKeys.length)
                for (var I = 0; I < J.idKeys.length; ++I) X.uint32(26).string(J.idKeys[I]);
              if (J.descriptionKeys != null && J.descriptionKeys.length)
                for (var I = 0; I < J.descriptionKeys.length; ++I) X.uint32(34).string(J.descriptionKeys[I]);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.common.v1.EntityRef;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    W.schemaUrl = J.string();
                    break
                  }
                  case 2: {
                    W.type = J.string();
                    break
                  }
                  case 3: {
                    if (!(W.idKeys && W.idKeys.length)) W.idKeys = [];
                    W.idKeys.push(J.string());
                    break
                  }
                  case 4: {
                    if (!(W.descriptionKeys && W.descriptionKeys.length)) W.descriptionKeys = [];
                    W.descriptionKeys.push(J.string());
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) {
                if (!hA.isString(J.schemaUrl)) return "schemaUrl: string expected"
              }
              if (J.type != null && J.hasOwnProperty("type")) {
                if (!hA.isString(J.type)) return "type: string expected"
              }
              if (J.idKeys != null && J.hasOwnProperty("idKeys")) {
                if (!Array.isArray(J.idKeys)) return "idKeys: array expected";
                for (var X = 0; X < J.idKeys.length; ++X)
                  if (!hA.isString(J.idKeys[X])) return "idKeys: string[] expected"
              }
              if (J.descriptionKeys != null && J.hasOwnProperty("descriptionKeys")) {
                if (!Array.isArray(J.descriptionKeys)) return "descriptionKeys: array expected";
                for (var X = 0; X < J.descriptionKeys.length; ++X)
                  if (!hA.isString(J.descriptionKeys[X])) return "descriptionKeys: string[] expected"
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.common.v1.EntityRef) return J;
              var X = new yA.opentelemetry.proto.common.v1.EntityRef;
              if (J.schemaUrl != null) X.schemaUrl = String(J.schemaUrl);
              if (J.type != null) X.type = String(J.type);
              if (J.idKeys) {
                if (!Array.isArray(J.idKeys)) throw TypeError(".opentelemetry.proto.common.v1.EntityRef.idKeys: array expected");
                X.idKeys = [];
                for (var I = 0; I < J.idKeys.length; ++I) X.idKeys[I] = String(J.idKeys[I])
              }
              if (J.descriptionKeys) {
                if (!Array.isArray(J.descriptionKeys)) throw TypeError(".opentelemetry.proto.common.v1.EntityRef.descriptionKeys: array expected");
                X.descriptionKeys = [];
                for (var I = 0; I < J.descriptionKeys.length; ++I) X.descriptionKeys[I] = String(J.descriptionKeys[I])
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.idKeys = [], I.descriptionKeys = [];
              if (X.defaults) I.schemaUrl = "", I.type = "";
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) I.schemaUrl = J.schemaUrl;
              if (J.type != null && J.hasOwnProperty("type")) I.type = J.type;
              if (J.idKeys && J.idKeys.length) {
                I.idKeys = [];
                for (var D = 0; D < J.idKeys.length; ++D) I.idKeys[D] = J.idKeys[D]
              }
              if (J.descriptionKeys && J.descriptionKeys.length) {
                I.descriptionKeys = [];
                for (var D = 0; D < J.descriptionKeys.length; ++D) I.descriptionKeys[D] = J.descriptionKeys[D]
              }
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.common.v1.EntityRef"
            }, Z
          }(), G
        }(), B
      }(), Q.resource = function () {
        var B = {};
        return B.v1 = function () {
          var G = {};
          return G.Resource = function () {
            function Z(Y) {
              if (this.attributes = [], this.entityRefs = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.attributes = hA.emptyArray, Z.prototype.droppedAttributesCount = null, Z.prototype.entityRefs = hA.emptyArray, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.attributes != null && J.attributes.length)
                for (var I = 0; I < J.attributes.length; ++I) yA.opentelemetry.proto.common.v1.KeyValue.encode(J.attributes[I], X.uint32(10).fork()).ldelim();
              if (J.droppedAttributesCount != null && Object.hasOwnProperty.call(J, "droppedAttributesCount")) X.uint32(16).uint32(J.droppedAttributesCount);
              if (J.entityRefs != null && J.entityRefs.length)
                for (var I = 0; I < J.entityRefs.length; ++I) yA.opentelemetry.proto.common.v1.EntityRef.encode(J.entityRefs[I], X.uint32(26).fork()).ldelim();
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.resource.v1.Resource;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(W.attributes && W.attributes.length)) W.attributes = [];
                    W.attributes.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                    break
                  }
                  case 2: {
                    W.droppedAttributesCount = J.uint32();
                    break
                  }
                  case 3: {
                    if (!(W.entityRefs && W.entityRefs.length)) W.entityRefs = [];
                    W.entityRefs.push(yA.opentelemetry.proto.common.v1.EntityRef.decode(J, J.uint32()));
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.attributes != null && J.hasOwnProperty("attributes")) {
                if (!Array.isArray(J.attributes)) return "attributes: array expected";
                for (var X = 0; X < J.attributes.length; ++X) {
                  var I = yA.opentelemetry.proto.common.v1.KeyValue.verify(J.attributes[X]);
                  if (I) return "attributes." + I
                }
              }
              if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) {
                if (!hA.isInteger(J.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
              }
              if (J.entityRefs != null && J.hasOwnProperty("entityRefs")) {
                if (!Array.isArray(J.entityRefs)) return "entityRefs: array expected";
                for (var X = 0; X < J.entityRefs.length; ++X) {
                  var I = yA.opentelemetry.proto.common.v1.EntityRef.verify(J.entityRefs[X]);
                  if (I) return "entityRefs." + I
                }
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.resource.v1.Resource) return J;
              var X = new yA.opentelemetry.proto.resource.v1.Resource;
              if (J.attributes) {
                if (!Array.isArray(J.attributes)) throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: array expected");
                X.attributes = [];
                for (var I = 0; I < J.attributes.length; ++I) {
                  if (typeof J.attributes[I] !== "object") throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: object expected");
                  X.attributes[I] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.attributes[I])
                }
              }
              if (J.droppedAttributesCount != null) X.droppedAttributesCount = J.droppedAttributesCount >>> 0;
              if (J.entityRefs) {
                if (!Array.isArray(J.entityRefs)) throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: array expected");
                X.entityRefs = [];
                for (var I = 0; I < J.entityRefs.length; ++I) {
                  if (typeof J.entityRefs[I] !== "object") throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: object expected");
                  X.entityRefs[I] = yA.opentelemetry.proto.common.v1.EntityRef.fromObject(J.entityRefs[I])
                }
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.attributes = [], I.entityRefs = [];
              if (X.defaults) I.droppedAttributesCount = 0;
              if (J.attributes && J.attributes.length) {
                I.attributes = [];
                for (var D = 0; D < J.attributes.length; ++D) I.attributes[D] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(J.attributes[D], X)
              }
              if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) I.droppedAttributesCount = J.droppedAttributesCount;
              if (J.entityRefs && J.entityRefs.length) {
                I.entityRefs = [];
                for (var D = 0; D < J.entityRefs.length; ++D) I.entityRefs[D] = yA.opentelemetry.proto.common.v1.EntityRef.toObject(J.entityRefs[D], X)
              }
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.resource.v1.Resource"
            }, Z
          }(), G
        }(), B
      }(), Q.trace = function () {
        var B = {};
        return B.v1 = function () {
          var G = {};
          return G.TracesData = function () {
            function Z(Y) {
              if (this.resourceSpans = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.resourceSpans = hA.emptyArray, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.resourceSpans != null && J.resourceSpans.length)
                for (var I = 0; I < J.resourceSpans.length; ++I) yA.opentelemetry.proto.trace.v1.ResourceSpans.encode(J.resourceSpans[I], X.uint32(10).fork()).ldelim();
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.trace.v1.TracesData;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(W.resourceSpans && W.resourceSpans.length)) W.resourceSpans = [];
                    W.resourceSpans.push(yA.opentelemetry.proto.trace.v1.ResourceSpans.decode(J, J.uint32()));
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.resourceSpans != null && J.hasOwnProperty("resourceSpans")) {
                if (!Array.isArray(J.resourceSpans)) return "resourceSpans: array expected";
                for (var X = 0; X < J.resourceSpans.length; ++X) {
                  var I = yA.opentelemetry.proto.trace.v1.ResourceSpans.verify(J.resourceSpans[X]);
                  if (I) return "resourceSpans." + I
                }
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.trace.v1.TracesData) return J;
              var X = new yA.opentelemetry.proto.trace.v1.TracesData;
              if (J.resourceSpans) {
                if (!Array.isArray(J.resourceSpans)) throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: array expected");
                X.resourceSpans = [];
                for (var I = 0; I < J.resourceSpans.length; ++I) {
                  if (typeof J.resourceSpans[I] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: object expected");
                  X.resourceSpans[I] = yA.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(J.resourceSpans[I])
                }
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.resourceSpans = [];
              if (J.resourceSpans && J.resourceSpans.length) {
                I.resourceSpans = [];
                for (var D = 0; D < J.resourceSpans.length; ++D) I.resourceSpans[D] = yA.opentelemetry.proto.trace.v1.ResourceSpans.toObject(J.resourceSpans[D], X)
              }
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.trace.v1.TracesData"
            }, Z
          }(), G.ResourceSpans = function () {
            function Z(Y) {
              if (this.scopeSpans = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.resource = null, Z.prototype.scopeSpans = hA.emptyArray, Z.prototype.schemaUrl = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.resource != null && Object.hasOwnProperty.call(J, "resource")) yA.opentelemetry.proto.resource.v1.Resource.encode(J.resource, X.uint32(10).fork()).ldelim();
              if (J.scopeSpans != null && J.scopeSpans.length)
                for (var I = 0; I < J.scopeSpans.length; ++I) yA.opentelemetry.proto.trace.v1.ScopeSpans.encode(J.scopeSpans[I], X.uint32(18).fork()).ldelim();
              if (J.schemaUrl != null && Object.hasOwnProperty.call(J, "schemaUrl")) X.uint32(26).string(J.schemaUrl);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.trace.v1.ResourceSpans;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    W.resource = yA.opentelemetry.proto.resource.v1.Resource.decode(J, J.uint32());
                    break
                  }
                  case 2: {
                    if (!(W.scopeSpans && W.scopeSpans.length)) W.scopeSpans = [];
                    W.scopeSpans.push(yA.opentelemetry.proto.trace.v1.ScopeSpans.decode(J, J.uint32()));
                    break
                  }
                  case 3: {
                    W.schemaUrl = J.string();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.resource != null && J.hasOwnProperty("resource")) {
                var X = yA.opentelemetry.proto.resource.v1.Resource.verify(J.resource);
                if (X) return "resource." + X
              }
              if (J.scopeSpans != null && J.hasOwnProperty("scopeSpans")) {
                if (!Array.isArray(J.scopeSpans)) return "scopeSpans: array expected";
                for (var I = 0; I < J.scopeSpans.length; ++I) {
                  var X = yA.opentelemetry.proto.trace.v1.ScopeSpans.verify(J.scopeSpans[I]);
                  if (X) return "scopeSpans." + X
                }
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) {
                if (!hA.isString(J.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.trace.v1.ResourceSpans) return J;
              var X = new yA.opentelemetry.proto.trace.v1.ResourceSpans;
              if (J.resource != null) {
                if (typeof J.resource !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.resource: object expected");
                X.resource = yA.opentelemetry.proto.resource.v1.Resource.fromObject(J.resource)
              }
              if (J.scopeSpans) {
                if (!Array.isArray(J.scopeSpans)) throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: array expected");
                X.scopeSpans = [];
                for (var I = 0; I < J.scopeSpans.length; ++I) {
                  if (typeof J.scopeSpans[I] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: object expected");
                  X.scopeSpans[I] = yA.opentelemetry.proto.trace.v1.ScopeSpans.fromObject(J.scopeSpans[I])
                }
              }
              if (J.schemaUrl != null) X.schemaUrl = String(J.schemaUrl);
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.scopeSpans = [];
              if (X.defaults) I.resource = null, I.schemaUrl = "";
              if (J.resource != null && J.hasOwnProperty("resource")) I.resource = yA.opentelemetry.proto.resource.v1.Resource.toObject(J.resource, X);
              if (J.scopeSpans && J.scopeSpans.length) {
                I.scopeSpans = [];
                for (var D = 0; D < J.scopeSpans.length; ++D) I.scopeSpans[D] = yA.opentelemetry.proto.trace.v1.ScopeSpans.toObject(J.scopeSpans[D], X)
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) I.schemaUrl = J.schemaUrl;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.trace.v1.ResourceSpans"
            }, Z
          }(), G.ScopeSpans = function () {
            function Z(Y) {
              if (this.spans = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.scope = null, Z.prototype.spans = hA.emptyArray, Z.prototype.schemaUrl = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.scope != null && Object.hasOwnProperty.call(J, "scope")) yA.opentelemetry.proto.common.v1.InstrumentationScope.encode(J.scope, X.uint32(10).fork()).ldelim();
              if (J.spans != null && J.spans.length)
                for (var I = 0; I < J.spans.length; ++I) yA.opentelemetry.proto.trace.v1.Span.encode(J.spans[I], X.uint32(18).fork()).ldelim();
              if (J.schemaUrl != null && Object.hasOwnProperty.call(J, "schemaUrl")) X.uint32(26).string(J.schemaUrl);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.trace.v1.ScopeSpans;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    W.scope = yA.opentelemetry.proto.common.v1.InstrumentationScope.decode(J, J.uint32());
                    break
                  }
                  case 2: {
                    if (!(W.spans && W.spans.length)) W.spans = [];
                    W.spans.push(yA.opentelemetry.proto.trace.v1.Span.decode(J, J.uint32()));
                    break
                  }
                  case 3: {
                    W.schemaUrl = J.string();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.scope != null && J.hasOwnProperty("scope")) {
                var X = yA.opentelemetry.proto.common.v1.InstrumentationScope.verify(J.scope);
                if (X) return "scope." + X
              }
              if (J.spans != null && J.hasOwnProperty("spans")) {
                if (!Array.isArray(J.spans)) return "spans: array expected";
                for (var I = 0; I < J.spans.length; ++I) {
                  var X = yA.opentelemetry.proto.trace.v1.Span.verify(J.spans[I]);
                  if (X) return "spans." + X
                }
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) {
                if (!hA.isString(J.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.trace.v1.ScopeSpans) return J;
              var X = new yA.opentelemetry.proto.trace.v1.ScopeSpans;
              if (J.scope != null) {
                if (typeof J.scope !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.scope: object expected");
                X.scope = yA.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(J.scope)
              }
              if (J.spans) {
                if (!Array.isArray(J.spans)) throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: array expected");
                X.spans = [];
                for (var I = 0; I < J.spans.length; ++I) {
                  if (typeof J.spans[I] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: object expected");
                  X.spans[I] = yA.opentelemetry.proto.trace.v1.Span.fromObject(J.spans[I])
                }
              }
              if (J.schemaUrl != null) X.schemaUrl = String(J.schemaUrl);
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.spans = [];
              if (X.defaults) I.scope = null, I.schemaUrl = "";
              if (J.scope != null && J.hasOwnProperty("scope")) I.scope = yA.opentelemetry.proto.common.v1.InstrumentationScope.toObject(J.scope, X);
              if (J.spans && J.spans.length) {
                I.spans = [];
                for (var D = 0; D < J.spans.length; ++D) I.spans[D] = yA.opentelemetry.proto.trace.v1.Span.toObject(J.spans[D], X)
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) I.schemaUrl = J.schemaUrl;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.trace.v1.ScopeSpans"
            }, Z
          }(), G.Span = function () {
            function Z(Y) {
              if (this.attributes = [], this.events = [], this.links = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.traceId = null, Z.prototype.spanId = null, Z.prototype.traceState = null, Z.prototype.parentSpanId = null, Z.prototype.flags = null, Z.prototype.name = null, Z.prototype.kind = null, Z.prototype.startTimeUnixNano = null, Z.prototype.endTimeUnixNano = null, Z.prototype.attributes = hA.emptyArray, Z.prototype.droppedAttributesCount = null, Z.prototype.events = hA.emptyArray, Z.prototype.droppedEventsCount = null, Z.prototype.links = hA.emptyArray, Z.prototype.droppedLinksCount = null, Z.prototype.status = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.traceId != null && Object.hasOwnProperty.call(J, "traceId")) X.uint32(10).bytes(J.traceId);
              if (J.spanId != null && Object.hasOwnProperty.call(J, "spanId")) X.uint32(18).bytes(J.spanId);
              if (J.traceState != null && Object.hasOwnProperty.call(J, "traceState")) X.uint32(26).string(J.traceState);
              if (J.parentSpanId != null && Object.hasOwnProperty.call(J, "parentSpanId")) X.uint32(34).bytes(J.parentSpanId);
              if (J.name != null && Object.hasOwnProperty.call(J, "name")) X.uint32(42).string(J.name);
              if (J.kind != null && Object.hasOwnProperty.call(J, "kind")) X.uint32(48).int32(J.kind);
              if (J.startTimeUnixNano != null && Object.hasOwnProperty.call(J, "startTimeUnixNano")) X.uint32(57).fixed64(J.startTimeUnixNano);
              if (J.endTimeUnixNano != null && Object.hasOwnProperty.call(J, "endTimeUnixNano")) X.uint32(65).fixed64(J.endTimeUnixNano);
              if (J.attributes != null && J.attributes.length)
                for (var I = 0; I < J.attributes.length; ++I) yA.opentelemetry.proto.common.v1.KeyValue.encode(J.attributes[I], X.uint32(74).fork()).ldelim();
              if (J.droppedAttributesCount != null && Object.hasOwnProperty.call(J, "droppedAttributesCount")) X.uint32(80).uint32(J.droppedAttributesCount);
              if (J.events != null && J.events.length)
                for (var I = 0; I < J.events.length; ++I) yA.opentelemetry.proto.trace.v1.Span.Event.encode(J.events[I], X.uint32(90).fork()).ldelim();
              if (J.droppedEventsCount != null && Object.hasOwnProperty.call(J, "droppedEventsCount")) X.uint32(96).uint32(J.droppedEventsCount);
              if (J.links != null && J.links.length)
                for (var I = 0; I < J.links.length; ++I) yA.opentelemetry.proto.trace.v1.Span.Link.encode(J.links[I], X.uint32(106).fork()).ldelim();
              if (J.droppedLinksCount != null && Object.hasOwnProperty.call(J, "droppedLinksCount")) X.uint32(112).uint32(J.droppedLinksCount);
              if (J.status != null && Object.hasOwnProperty.call(J, "status")) yA.opentelemetry.proto.trace.v1.Status.encode(J.status, X.uint32(122).fork()).ldelim();
              if (J.flags != null && Object.hasOwnProperty.call(J, "flags")) X.uint32(133).fixed32(J.flags);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.trace.v1.Span;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    W.traceId = J.bytes();
                    break
                  }
                  case 2: {
                    W.spanId = J.bytes();
                    break
                  }
                  case 3: {
                    W.traceState = J.string();
                    break
                  }
                  case 4: {
                    W.parentSpanId = J.bytes();
                    break
                  }
                  case 16: {
                    W.flags = J.fixed32();
                    break
                  }
                  case 5: {
                    W.name = J.string();
                    break
                  }
                  case 6: {
                    W.kind = J.int32();
                    break
                  }
                  case 7: {
                    W.startTimeUnixNano = J.fixed64();
                    break
                  }
                  case 8: {
                    W.endTimeUnixNano = J.fixed64();
                    break
                  }
                  case 9: {
                    if (!(W.attributes && W.attributes.length)) W.attributes = [];
                    W.attributes.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                    break
                  }
                  case 10: {
                    W.droppedAttributesCount = J.uint32();
                    break
                  }
                  case 11: {
                    if (!(W.events && W.events.length)) W.events = [];
                    W.events.push(yA.opentelemetry.proto.trace.v1.Span.Event.decode(J, J.uint32()));
                    break
                  }
                  case 12: {
                    W.droppedEventsCount = J.uint32();
                    break
                  }
                  case 13: {
                    if (!(W.links && W.links.length)) W.links = [];
                    W.links.push(yA.opentelemetry.proto.trace.v1.Span.Link.decode(J, J.uint32()));
                    break
                  }
                  case 14: {
                    W.droppedLinksCount = J.uint32();
                    break
                  }
                  case 15: {
                    W.status = yA.opentelemetry.proto.trace.v1.Status.decode(J, J.uint32());
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.traceId != null && J.hasOwnProperty("traceId")) {
                if (!(J.traceId && typeof J.traceId.length === "number" || hA.isString(J.traceId))) return "traceId: buffer expected"
              }
              if (J.spanId != null && J.hasOwnProperty("spanId")) {
                if (!(J.spanId && typeof J.spanId.length === "number" || hA.isString(J.spanId))) return "spanId: buffer expected"
              }
              if (J.traceState != null && J.hasOwnProperty("traceState")) {
                if (!hA.isString(J.traceState)) return "traceState: string expected"
              }
              if (J.parentSpanId != null && J.hasOwnProperty("parentSpanId")) {
                if (!(J.parentSpanId && typeof J.parentSpanId.length === "number" || hA.isString(J.parentSpanId))) return "parentSpanId: buffer expected"
              }
              if (J.flags != null && J.hasOwnProperty("flags")) {
                if (!hA.isInteger(J.flags)) return "flags: integer expected"
              }
              if (J.name != null && J.hasOwnProperty("name")) {
                if (!hA.isString(J.name)) return "name: string expected"
              }
              if (J.kind != null && J.hasOwnProperty("kind")) switch (J.kind) {
                default:
                  return "kind: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                  break
              }
              if (J.startTimeUnixNano != null && J.hasOwnProperty("startTimeUnixNano")) {
                if (!hA.isInteger(J.startTimeUnixNano) && !(J.startTimeUnixNano && hA.isInteger(J.startTimeUnixNano.low) && hA.isInteger(J.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
              }
              if (J.endTimeUnixNano != null && J.hasOwnProperty("endTimeUnixNano")) {
                if (!hA.isInteger(J.endTimeUnixNano) && !(J.endTimeUnixNano && hA.isInteger(J.endTimeUnixNano.low) && hA.isInteger(J.endTimeUnixNano.high))) return "endTimeUnixNano: integer|Long expected"
              }
              if (J.attributes != null && J.hasOwnProperty("attributes")) {
                if (!Array.isArray(J.attributes)) return "attributes: array expected";
                for (var X = 0; X < J.attributes.length; ++X) {
                  var I = yA.opentelemetry.proto.common.v1.KeyValue.verify(J.attributes[X]);
                  if (I) return "attributes." + I
                }
              }
              if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) {
                if (!hA.isInteger(J.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
              }
              if (J.events != null && J.hasOwnProperty("events")) {
                if (!Array.isArray(J.events)) return "events: array expected";
                for (var X = 0; X < J.events.length; ++X) {
                  var I = yA.opentelemetry.proto.trace.v1.Span.Event.verify(J.events[X]);
                  if (I) return "events." + I
                }
              }
              if (J.droppedEventsCount != null && J.hasOwnProperty("droppedEventsCount")) {
                if (!hA.isInteger(J.droppedEventsCount)) return "droppedEventsCount: integer expected"
              }
              if (J.links != null && J.hasOwnProperty("links")) {
                if (!Array.isArray(J.links)) return "links: array expected";
                for (var X = 0; X < J.links.length; ++X) {
                  var I = yA.opentelemetry.proto.trace.v1.Span.Link.verify(J.links[X]);
                  if (I) return "links." + I
                }
              }
              if (J.droppedLinksCount != null && J.hasOwnProperty("droppedLinksCount")) {
                if (!hA.isInteger(J.droppedLinksCount)) return "droppedLinksCount: integer expected"
              }
              if (J.status != null && J.hasOwnProperty("status")) {
                var I = yA.opentelemetry.proto.trace.v1.Status.verify(J.status);
                if (I) return "status." + I
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.trace.v1.Span) return J;
              var X = new yA.opentelemetry.proto.trace.v1.Span;
              if (J.traceId != null) {
                if (typeof J.traceId === "string") hA.base64.decode(J.traceId, X.traceId = hA.newBuffer(hA.base64.length(J.traceId)), 0);
                else if (J.traceId.length >= 0) X.traceId = J.traceId
              }
              if (J.spanId != null) {
                if (typeof J.spanId === "string") hA.base64.decode(J.spanId, X.spanId = hA.newBuffer(hA.base64.length(J.spanId)), 0);
                else if (J.spanId.length >= 0) X.spanId = J.spanId
              }
              if (J.traceState != null) X.traceState = String(J.traceState);
              if (J.parentSpanId != null) {
                if (typeof J.parentSpanId === "string") hA.base64.decode(J.parentSpanId, X.parentSpanId = hA.newBuffer(hA.base64.length(J.parentSpanId)), 0);
                else if (J.parentSpanId.length >= 0) X.parentSpanId = J.parentSpanId
              }
              if (J.flags != null) X.flags = J.flags >>> 0;
              if (J.name != null) X.name = String(J.name);
              switch (J.kind) {
                default:
                  if (typeof J.kind === "number") {
                    X.kind = J.kind;
                    break
                  }
                  break;
                case "SPAN_KIND_UNSPECIFIED":
                case 0:
                  X.kind = 0;
                  break;
                case "SPAN_KIND_INTERNAL":
                case 1:
                  X.kind = 1;
                  break;
                case "SPAN_KIND_SERVER":
                case 2:
                  X.kind = 2;
                  break;
                case "SPAN_KIND_CLIENT":
                case 3:
                  X.kind = 3;
                  break;
                case "SPAN_KIND_PRODUCER":
                case 4:
                  X.kind = 4;
                  break;
                case "SPAN_KIND_CONSUMER":
                case 5:
                  X.kind = 5;
                  break
              }
              if (J.startTimeUnixNano != null) {
                if (hA.Long)(X.startTimeUnixNano = hA.Long.fromValue(J.startTimeUnixNano)).unsigned = !1;
                else if (typeof J.startTimeUnixNano === "string") X.startTimeUnixNano = parseInt(J.startTimeUnixNano, 10);
                else if (typeof J.startTimeUnixNano === "number") X.startTimeUnixNano = J.startTimeUnixNano;
                else if (typeof J.startTimeUnixNano === "object") X.startTimeUnixNano = new hA.LongBits(J.startTimeUnixNano.low >>> 0, J.startTimeUnixNano.high >>> 0).toNumber()
              }
              if (J.endTimeUnixNano != null) {
                if (hA.Long)(X.endTimeUnixNano = hA.Long.fromValue(J.endTimeUnixNano)).unsigned = !1;
                else if (typeof J.endTimeUnixNano === "string") X.endTimeUnixNano = parseInt(J.endTimeUnixNano, 10);
                else if (typeof J.endTimeUnixNano === "number") X.endTimeUnixNano = J.endTimeUnixNano;
                else if (typeof J.endTimeUnixNano === "object") X.endTimeUnixNano = new hA.LongBits(J.endTimeUnixNano.low >>> 0, J.endTimeUnixNano.high >>> 0).toNumber()
              }
              if (J.attributes) {
                if (!Array.isArray(J.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: array expected");
                X.attributes = [];
                for (var I = 0; I < J.attributes.length; ++I) {
                  if (typeof J.attributes[I] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: object expected");
                  X.attributes[I] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.attributes[I])
                }
              }
              if (J.droppedAttributesCount != null) X.droppedAttributesCount = J.droppedAttributesCount >>> 0;
              if (J.events) {
                if (!Array.isArray(J.events)) throw TypeError(".opentelemetry.proto.trace.v1.Span.events: array expected");
                X.events = [];
                for (var I = 0; I < J.events.length; ++I) {
                  if (typeof J.events[I] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.events: object expected");
                  X.events[I] = yA.opentelemetry.proto.trace.v1.Span.Event.fromObject(J.events[I])
                }
              }
              if (J.droppedEventsCount != null) X.droppedEventsCount = J.droppedEventsCount >>> 0;
              if (J.links) {
                if (!Array.isArray(J.links)) throw TypeError(".opentelemetry.proto.trace.v1.Span.links: array expected");
                X.links = [];
                for (var I = 0; I < J.links.length; ++I) {
                  if (typeof J.links[I] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.links: object expected");
                  X.links[I] = yA.opentelemetry.proto.trace.v1.Span.Link.fromObject(J.links[I])
                }
              }
              if (J.droppedLinksCount != null) X.droppedLinksCount = J.droppedLinksCount >>> 0;
              if (J.status != null) {
                if (typeof J.status !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.status: object expected");
                X.status = yA.opentelemetry.proto.trace.v1.Status.fromObject(J.status)
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.attributes = [], I.events = [], I.links = [];
              if (X.defaults) {
                if (X.bytes === String) I.traceId = "";
                else if (I.traceId = [], X.bytes !== Array) I.traceId = hA.newBuffer(I.traceId);
                if (X.bytes === String) I.spanId = "";
                else if (I.spanId = [], X.bytes !== Array) I.spanId = hA.newBuffer(I.spanId);
                if (I.traceState = "", X.bytes === String) I.parentSpanId = "";
                else if (I.parentSpanId = [], X.bytes !== Array) I.parentSpanId = hA.newBuffer(I.parentSpanId);
                if (I.name = "", I.kind = X.enums === String ? "SPAN_KIND_UNSPECIFIED" : 0, hA.Long) {
                  var D = new hA.Long(0, 0, !1);
                  I.startTimeUnixNano = X.longs === String ? D.toString() : X.longs === Number ? D.toNumber() : D
                } else I.startTimeUnixNano = X.longs === String ? "0" : 0;
                if (hA.Long) {
                  var D = new hA.Long(0, 0, !1);
                  I.endTimeUnixNano = X.longs === String ? D.toString() : X.longs === Number ? D.toNumber() : D
                } else I.endTimeUnixNano = X.longs === String ? "0" : 0;
                I.droppedAttributesCount = 0, I.droppedEventsCount = 0, I.droppedLinksCount = 0, I.status = null, I.flags = 0
              }
              if (J.traceId != null && J.hasOwnProperty("traceId")) I.traceId = X.bytes === String ? hA.base64.encode(J.traceId, 0, J.traceId.length) : X.bytes === Array ? Array.prototype.slice.call(J.traceId) : J.traceId;
              if (J.spanId != null && J.hasOwnProperty("spanId")) I.spanId = X.bytes === String ? hA.base64.encode(J.spanId, 0, J.spanId.length) : X.bytes === Array ? Array.prototype.slice.call(J.spanId) : J.spanId;
              if (J.traceState != null && J.hasOwnProperty("traceState")) I.traceState = J.traceState;
              if (J.parentSpanId != null && J.hasOwnProperty("parentSpanId")) I.parentSpanId = X.bytes === String ? hA.base64.encode(J.parentSpanId, 0, J.parentSpanId.length) : X.bytes === Array ? Array.prototype.slice.call(J.parentSpanId) : J.parentSpanId;
              if (J.name != null && J.hasOwnProperty("name")) I.name = J.name;
              if (J.kind != null && J.hasOwnProperty("kind")) I.kind = X.enums === String ? yA.opentelemetry.proto.trace.v1.Span.SpanKind[J.kind] === void 0 ? J.kind : yA.opentelemetry.proto.trace.v1.Span.SpanKind[J.kind] : J.kind;
              if (J.startTimeUnixNano != null && J.hasOwnProperty("startTimeUnixNano"))
                if (typeof J.startTimeUnixNano === "number") I.startTimeUnixNano = X.longs === String ? String(J.startTimeUnixNano) : J.startTimeUnixNano;
                else I.startTimeUnixNano = X.longs === String ? hA.Long.prototype.toString.call(J.startTimeUnixNano) : X.longs === Number ? new hA.LongBits(J.startTimeUnixNano.low >>> 0, J.startTimeUnixNano.high >>> 0).toNumber() : J.startTimeUnixNano;
              if (J.endTimeUnixNano != null && J.hasOwnProperty("endTimeUnixNano"))
                if (typeof J.endTimeUnixNano === "number") I.endTimeUnixNano = X.longs === String ? String(J.endTimeUnixNano) : J.endTimeUnixNano;
                else I.endTimeUnixNano = X.longs === String ? hA.Long.prototype.toString.call(J.endTimeUnixNano) : X.longs === Number ? new hA.LongBits(J.endTimeUnixNano.low >>> 0, J.endTimeUnixNano.high >>> 0).toNumber() : J.endTimeUnixNano;
              if (J.attributes && J.attributes.length) {
                I.attributes = [];
                for (var W = 0; W < J.attributes.length; ++W) I.attributes[W] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(J.attributes[W], X)
              }
              if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) I.droppedAttributesCount = J.droppedAttributesCount;
              if (J.events && J.events.length) {
                I.events = [];
                for (var W = 0; W < J.events.length; ++W) I.events[W] = yA.opentelemetry.proto.trace.v1.Span.Event.toObject(J.events[W], X)
              }
              if (J.droppedEventsCount != null && J.hasOwnProperty("droppedEventsCount")) I.droppedEventsCount = J.droppedEventsCount;
              if (J.links && J.links.length) {
                I.links = [];
                for (var W = 0; W < J.links.length; ++W) I.links[W] = yA.opentelemetry.proto.trace.v1.Span.Link.toObject(J.links[W], X)
              }
              if (J.droppedLinksCount != null && J.hasOwnProperty("droppedLinksCount")) I.droppedLinksCount = J.droppedLinksCount;
              if (J.status != null && J.hasOwnProperty("status")) I.status = yA.opentelemetry.proto.trace.v1.Status.toObject(J.status, X);
              if (J.flags != null && J.hasOwnProperty("flags")) I.flags = J.flags;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.trace.v1.Span"
            }, Z.SpanKind = function () {
              var Y = {},
                J = Object.create(Y);
              return J[Y[0] = "SPAN_KIND_UNSPECIFIED"] = 0, J[Y[1] = "SPAN_KIND_INTERNAL"] = 1, J[Y[2] = "SPAN_KIND_SERVER"] = 2, J[Y[3] = "SPAN_KIND_CLIENT"] = 3, J[Y[4] = "SPAN_KIND_PRODUCER"] = 4, J[Y[5] = "SPAN_KIND_CONSUMER"] = 5, J
            }(), Z.Event = function () {
              function Y(J) {
                if (this.attributes = [], J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.timeUnixNano = null, Y.prototype.name = null, Y.prototype.attributes = hA.emptyArray, Y.prototype.droppedAttributesCount = null, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.timeUnixNano != null && Object.hasOwnProperty.call(X, "timeUnixNano")) I.uint32(9).fixed64(X.timeUnixNano);
                if (X.name != null && Object.hasOwnProperty.call(X, "name")) I.uint32(18).string(X.name);
                if (X.attributes != null && X.attributes.length)
                  for (var D = 0; D < X.attributes.length; ++D) yA.opentelemetry.proto.common.v1.KeyValue.encode(X.attributes[D], I.uint32(26).fork()).ldelim();
                if (X.droppedAttributesCount != null && Object.hasOwnProperty.call(X, "droppedAttributesCount")) I.uint32(32).uint32(X.droppedAttributesCount);
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.trace.v1.Span.Event;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      K.timeUnixNano = X.fixed64();
                      break
                    }
                    case 2: {
                      K.name = X.string();
                      break
                    }
                    case 3: {
                      if (!(K.attributes && K.attributes.length)) K.attributes = [];
                      K.attributes.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(X, X.uint32()));
                      break
                    }
                    case 4: {
                      K.droppedAttributesCount = X.uint32();
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.timeUnixNano != null && X.hasOwnProperty("timeUnixNano")) {
                  if (!hA.isInteger(X.timeUnixNano) && !(X.timeUnixNano && hA.isInteger(X.timeUnixNano.low) && hA.isInteger(X.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                }
                if (X.name != null && X.hasOwnProperty("name")) {
                  if (!hA.isString(X.name)) return "name: string expected"
                }
                if (X.attributes != null && X.hasOwnProperty("attributes")) {
                  if (!Array.isArray(X.attributes)) return "attributes: array expected";
                  for (var I = 0; I < X.attributes.length; ++I) {
                    var D = yA.opentelemetry.proto.common.v1.KeyValue.verify(X.attributes[I]);
                    if (D) return "attributes." + D
                  }
                }
                if (X.droppedAttributesCount != null && X.hasOwnProperty("droppedAttributesCount")) {
                  if (!hA.isInteger(X.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.trace.v1.Span.Event) return X;
                var I = new yA.opentelemetry.proto.trace.v1.Span.Event;
                if (X.timeUnixNano != null) {
                  if (hA.Long)(I.timeUnixNano = hA.Long.fromValue(X.timeUnixNano)).unsigned = !1;
                  else if (typeof X.timeUnixNano === "string") I.timeUnixNano = parseInt(X.timeUnixNano, 10);
                  else if (typeof X.timeUnixNano === "number") I.timeUnixNano = X.timeUnixNano;
                  else if (typeof X.timeUnixNano === "object") I.timeUnixNano = new hA.LongBits(X.timeUnixNano.low >>> 0, X.timeUnixNano.high >>> 0).toNumber()
                }
                if (X.name != null) I.name = String(X.name);
                if (X.attributes) {
                  if (!Array.isArray(X.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: array expected");
                  I.attributes = [];
                  for (var D = 0; D < X.attributes.length; ++D) {
                    if (typeof X.attributes[D] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: object expected");
                    I.attributes[D] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(X.attributes[D])
                  }
                }
                if (X.droppedAttributesCount != null) I.droppedAttributesCount = X.droppedAttributesCount >>> 0;
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.arrays || I.defaults) D.attributes = [];
                if (I.defaults) {
                  if (hA.Long) {
                    var W = new hA.Long(0, 0, !1);
                    D.timeUnixNano = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                  } else D.timeUnixNano = I.longs === String ? "0" : 0;
                  D.name = "", D.droppedAttributesCount = 0
                }
                if (X.timeUnixNano != null && X.hasOwnProperty("timeUnixNano"))
                  if (typeof X.timeUnixNano === "number") D.timeUnixNano = I.longs === String ? String(X.timeUnixNano) : X.timeUnixNano;
                  else D.timeUnixNano = I.longs === String ? hA.Long.prototype.toString.call(X.timeUnixNano) : I.longs === Number ? new hA.LongBits(X.timeUnixNano.low >>> 0, X.timeUnixNano.high >>> 0).toNumber() : X.timeUnixNano;
                if (X.name != null && X.hasOwnProperty("name")) D.name = X.name;
                if (X.attributes && X.attributes.length) {
                  D.attributes = [];
                  for (var K = 0; K < X.attributes.length; ++K) D.attributes[K] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(X.attributes[K], I)
                }
                if (X.droppedAttributesCount != null && X.hasOwnProperty("droppedAttributesCount")) D.droppedAttributesCount = X.droppedAttributesCount;
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.trace.v1.Span.Event"
              }, Y
            }(), Z.Link = function () {
              function Y(J) {
                if (this.attributes = [], J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.traceId = null, Y.prototype.spanId = null, Y.prototype.traceState = null, Y.prototype.attributes = hA.emptyArray, Y.prototype.droppedAttributesCount = null, Y.prototype.flags = null, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.traceId != null && Object.hasOwnProperty.call(X, "traceId")) I.uint32(10).bytes(X.traceId);
                if (X.spanId != null && Object.hasOwnProperty.call(X, "spanId")) I.uint32(18).bytes(X.spanId);
                if (X.traceState != null && Object.hasOwnProperty.call(X, "traceState")) I.uint32(26).string(X.traceState);
                if (X.attributes != null && X.attributes.length)
                  for (var D = 0; D < X.attributes.length; ++D) yA.opentelemetry.proto.common.v1.KeyValue.encode(X.attributes[D], I.uint32(34).fork()).ldelim();
                if (X.droppedAttributesCount != null && Object.hasOwnProperty.call(X, "droppedAttributesCount")) I.uint32(40).uint32(X.droppedAttributesCount);
                if (X.flags != null && Object.hasOwnProperty.call(X, "flags")) I.uint32(53).fixed32(X.flags);
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.trace.v1.Span.Link;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      K.traceId = X.bytes();
                      break
                    }
                    case 2: {
                      K.spanId = X.bytes();
                      break
                    }
                    case 3: {
                      K.traceState = X.string();
                      break
                    }
                    case 4: {
                      if (!(K.attributes && K.attributes.length)) K.attributes = [];
                      K.attributes.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(X, X.uint32()));
                      break
                    }
                    case 5: {
                      K.droppedAttributesCount = X.uint32();
                      break
                    }
                    case 6: {
                      K.flags = X.fixed32();
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.traceId != null && X.hasOwnProperty("traceId")) {
                  if (!(X.traceId && typeof X.traceId.length === "number" || hA.isString(X.traceId))) return "traceId: buffer expected"
                }
                if (X.spanId != null && X.hasOwnProperty("spanId")) {
                  if (!(X.spanId && typeof X.spanId.length === "number" || hA.isString(X.spanId))) return "spanId: buffer expected"
                }
                if (X.traceState != null && X.hasOwnProperty("traceState")) {
                  if (!hA.isString(X.traceState)) return "traceState: string expected"
                }
                if (X.attributes != null && X.hasOwnProperty("attributes")) {
                  if (!Array.isArray(X.attributes)) return "attributes: array expected";
                  for (var I = 0; I < X.attributes.length; ++I) {
                    var D = yA.opentelemetry.proto.common.v1.KeyValue.verify(X.attributes[I]);
                    if (D) return "attributes." + D
                  }
                }
                if (X.droppedAttributesCount != null && X.hasOwnProperty("droppedAttributesCount")) {
                  if (!hA.isInteger(X.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                }
                if (X.flags != null && X.hasOwnProperty("flags")) {
                  if (!hA.isInteger(X.flags)) return "flags: integer expected"
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.trace.v1.Span.Link) return X;
                var I = new yA.opentelemetry.proto.trace.v1.Span.Link;
                if (X.traceId != null) {
                  if (typeof X.traceId === "string") hA.base64.decode(X.traceId, I.traceId = hA.newBuffer(hA.base64.length(X.traceId)), 0);
                  else if (X.traceId.length >= 0) I.traceId = X.traceId
                }
                if (X.spanId != null) {
                  if (typeof X.spanId === "string") hA.base64.decode(X.spanId, I.spanId = hA.newBuffer(hA.base64.length(X.spanId)), 0);
                  else if (X.spanId.length >= 0) I.spanId = X.spanId
                }
                if (X.traceState != null) I.traceState = String(X.traceState);
                if (X.attributes) {
                  if (!Array.isArray(X.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: array expected");
                  I.attributes = [];
                  for (var D = 0; D < X.attributes.length; ++D) {
                    if (typeof X.attributes[D] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: object expected");
                    I.attributes[D] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(X.attributes[D])
                  }
                }
                if (X.droppedAttributesCount != null) I.droppedAttributesCount = X.droppedAttributesCount >>> 0;
                if (X.flags != null) I.flags = X.flags >>> 0;
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.arrays || I.defaults) D.attributes = [];
                if (I.defaults) {
                  if (I.bytes === String) D.traceId = "";
                  else if (D.traceId = [], I.bytes !== Array) D.traceId = hA.newBuffer(D.traceId);
                  if (I.bytes === String) D.spanId = "";
                  else if (D.spanId = [], I.bytes !== Array) D.spanId = hA.newBuffer(D.spanId);
                  D.traceState = "", D.droppedAttributesCount = 0, D.flags = 0
                }
                if (X.traceId != null && X.hasOwnProperty("traceId")) D.traceId = I.bytes === String ? hA.base64.encode(X.traceId, 0, X.traceId.length) : I.bytes === Array ? Array.prototype.slice.call(X.traceId) : X.traceId;
                if (X.spanId != null && X.hasOwnProperty("spanId")) D.spanId = I.bytes === String ? hA.base64.encode(X.spanId, 0, X.spanId.length) : I.bytes === Array ? Array.prototype.slice.call(X.spanId) : X.spanId;
                if (X.traceState != null && X.hasOwnProperty("traceState")) D.traceState = X.traceState;
                if (X.attributes && X.attributes.length) {
                  D.attributes = [];
                  for (var W = 0; W < X.attributes.length; ++W) D.attributes[W] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(X.attributes[W], I)
                }
                if (X.droppedAttributesCount != null && X.hasOwnProperty("droppedAttributesCount")) D.droppedAttributesCount = X.droppedAttributesCount;
                if (X.flags != null && X.hasOwnProperty("flags")) D.flags = X.flags;
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.trace.v1.Span.Link"
              }, Y
            }(), Z
          }(), G.Status = function () {
            function Z(Y) {
              if (Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.message = null, Z.prototype.code = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.message != null && Object.hasOwnProperty.call(J, "message")) X.uint32(18).string(J.message);
              if (J.code != null && Object.hasOwnProperty.call(J, "code")) X.uint32(24).int32(J.code);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.trace.v1.Status;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 2: {
                    W.message = J.string();
                    break
                  }
                  case 3: {
                    W.code = J.int32();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.message != null && J.hasOwnProperty("message")) {
                if (!hA.isString(J.message)) return "message: string expected"
              }
              if (J.code != null && J.hasOwnProperty("code")) switch (J.code) {
                default:
                  return "code: enum value expected";
                case 0:
                case 1:
                case 2:
                  break
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.trace.v1.Status) return J;
              var X = new yA.opentelemetry.proto.trace.v1.Status;
              if (J.message != null) X.message = String(J.message);
              switch (J.code) {
                default:
                  if (typeof J.code === "number") {
                    X.code = J.code;
                    break
                  }
                  break;
                case "STATUS_CODE_UNSET":
                case 0:
                  X.code = 0;
                  break;
                case "STATUS_CODE_OK":
                case 1:
                  X.code = 1;
                  break;
                case "STATUS_CODE_ERROR":
                case 2:
                  X.code = 2;
                  break
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.defaults) I.message = "", I.code = X.enums === String ? "STATUS_CODE_UNSET" : 0;
              if (J.message != null && J.hasOwnProperty("message")) I.message = J.message;
              if (J.code != null && J.hasOwnProperty("code")) I.code = X.enums === String ? yA.opentelemetry.proto.trace.v1.Status.StatusCode[J.code] === void 0 ? J.code : yA.opentelemetry.proto.trace.v1.Status.StatusCode[J.code] : J.code;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.trace.v1.Status"
            }, Z.StatusCode = function () {
              var Y = {},
                J = Object.create(Y);
              return J[Y[0] = "STATUS_CODE_UNSET"] = 0, J[Y[1] = "STATUS_CODE_OK"] = 1, J[Y[2] = "STATUS_CODE_ERROR"] = 2, J
            }(), Z
          }(), G.SpanFlags = function () {
            var Z = {},
              Y = Object.create(Z);
            return Y[Z[0] = "SPAN_FLAGS_DO_NOT_USE"] = 0, Y[Z[255] = "SPAN_FLAGS_TRACE_FLAGS_MASK"] = 255, Y[Z[256] = "SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK"] = 256, Y[Z[512] = "SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK"] = 512, Y
          }(), G
        }(), B
      }(), Q.collector = function () {
        var B = {};
        return B.trace = function () {
          var G = {};
          return G.v1 = function () {
            var Z = {};
            return Z.TraceService = function () {
              function Y(J, X, I) {
                D4.rpc.Service.call(this, J, X, I)
              }
              return (Y.prototype = Object.create(D4.rpc.Service.prototype)).constructor = Y, Y.create = function (X, I, D) {
                return new this(X, I, D)
              }, Object.defineProperty(Y.prototype.export = function J(X, I) {
                return this.rpcCall(J, yA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest, yA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse, X, I)
              }, "name", {
                value: "Export"
              }), Y
            }(), Z.ExportTraceServiceRequest = function () {
              function Y(J) {
                if (this.resourceSpans = [], J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.resourceSpans = hA.emptyArray, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.resourceSpans != null && X.resourceSpans.length)
                  for (var D = 0; D < X.resourceSpans.length; ++D) yA.opentelemetry.proto.trace.v1.ResourceSpans.encode(X.resourceSpans[D], I.uint32(10).fork()).ldelim();
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      if (!(K.resourceSpans && K.resourceSpans.length)) K.resourceSpans = [];
                      K.resourceSpans.push(yA.opentelemetry.proto.trace.v1.ResourceSpans.decode(X, X.uint32()));
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.resourceSpans != null && X.hasOwnProperty("resourceSpans")) {
                  if (!Array.isArray(X.resourceSpans)) return "resourceSpans: array expected";
                  for (var I = 0; I < X.resourceSpans.length; ++I) {
                    var D = yA.opentelemetry.proto.trace.v1.ResourceSpans.verify(X.resourceSpans[I]);
                    if (D) return "resourceSpans." + D
                  }
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest) return X;
                var I = new yA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
                if (X.resourceSpans) {
                  if (!Array.isArray(X.resourceSpans)) throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: array expected");
                  I.resourceSpans = [];
                  for (var D = 0; D < X.resourceSpans.length; ++D) {
                    if (typeof X.resourceSpans[D] !== "object") throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: object expected");
                    I.resourceSpans[D] = yA.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(X.resourceSpans[D])
                  }
                }
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.arrays || I.defaults) D.resourceSpans = [];
                if (X.resourceSpans && X.resourceSpans.length) {
                  D.resourceSpans = [];
                  for (var W = 0; W < X.resourceSpans.length; ++W) D.resourceSpans[W] = yA.opentelemetry.proto.trace.v1.ResourceSpans.toObject(X.resourceSpans[W], I)
                }
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest"
              }, Y
            }(), Z.ExportTraceServiceResponse = function () {
              function Y(J) {
                if (J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.partialSuccess = null, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.partialSuccess != null && Object.hasOwnProperty.call(X, "partialSuccess")) yA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.encode(X.partialSuccess, I.uint32(10).fork()).ldelim();
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      K.partialSuccess = yA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.decode(X, X.uint32());
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.partialSuccess != null && X.hasOwnProperty("partialSuccess")) {
                  var I = yA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.verify(X.partialSuccess);
                  if (I) return "partialSuccess." + I
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse) return X;
                var I = new yA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;
                if (X.partialSuccess != null) {
                  if (typeof X.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse.partialSuccess: object expected");
                  I.partialSuccess = yA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.fromObject(X.partialSuccess)
                }
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.defaults) D.partialSuccess = null;
                if (X.partialSuccess != null && X.hasOwnProperty("partialSuccess")) D.partialSuccess = yA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.toObject(X.partialSuccess, I);
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse"
              }, Y
            }(), Z.ExportTracePartialSuccess = function () {
              function Y(J) {
                if (J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.rejectedSpans = null, Y.prototype.errorMessage = null, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.rejectedSpans != null && Object.hasOwnProperty.call(X, "rejectedSpans")) I.uint32(8).int64(X.rejectedSpans);
                if (X.errorMessage != null && Object.hasOwnProperty.call(X, "errorMessage")) I.uint32(18).string(X.errorMessage);
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      K.rejectedSpans = X.int64();
                      break
                    }
                    case 2: {
                      K.errorMessage = X.string();
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.rejectedSpans != null && X.hasOwnProperty("rejectedSpans")) {
                  if (!hA.isInteger(X.rejectedSpans) && !(X.rejectedSpans && hA.isInteger(X.rejectedSpans.low) && hA.isInteger(X.rejectedSpans.high))) return "rejectedSpans: integer|Long expected"
                }
                if (X.errorMessage != null && X.hasOwnProperty("errorMessage")) {
                  if (!hA.isString(X.errorMessage)) return "errorMessage: string expected"
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess) return X;
                var I = new yA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;
                if (X.rejectedSpans != null) {
                  if (hA.Long)(I.rejectedSpans = hA.Long.fromValue(X.rejectedSpans)).unsigned = !1;
                  else if (typeof X.rejectedSpans === "string") I.rejectedSpans = parseInt(X.rejectedSpans, 10);
                  else if (typeof X.rejectedSpans === "number") I.rejectedSpans = X.rejectedSpans;
                  else if (typeof X.rejectedSpans === "object") I.rejectedSpans = new hA.LongBits(X.rejectedSpans.low >>> 0, X.rejectedSpans.high >>> 0).toNumber()
                }
                if (X.errorMessage != null) I.errorMessage = String(X.errorMessage);
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.defaults) {
                  if (hA.Long) {
                    var W = new hA.Long(0, 0, !1);
                    D.rejectedSpans = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                  } else D.rejectedSpans = I.longs === String ? "0" : 0;
                  D.errorMessage = ""
                }
                if (X.rejectedSpans != null && X.hasOwnProperty("rejectedSpans"))
                  if (typeof X.rejectedSpans === "number") D.rejectedSpans = I.longs === String ? String(X.rejectedSpans) : X.rejectedSpans;
                  else D.rejectedSpans = I.longs === String ? hA.Long.prototype.toString.call(X.rejectedSpans) : I.longs === Number ? new hA.LongBits(X.rejectedSpans.low >>> 0, X.rejectedSpans.high >>> 0).toNumber() : X.rejectedSpans;
                if (X.errorMessage != null && X.hasOwnProperty("errorMessage")) D.errorMessage = X.errorMessage;
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess"
              }, Y
            }(), Z
          }(), G
        }(), B.metrics = function () {
          var G = {};
          return G.v1 = function () {
            var Z = {};
            return Z.MetricsService = function () {
              function Y(J, X, I) {
                D4.rpc.Service.call(this, J, X, I)
              }
              return (Y.prototype = Object.create(D4.rpc.Service.prototype)).constructor = Y, Y.create = function (X, I, D) {
                return new this(X, I, D)
              }, Object.defineProperty(Y.prototype.export = function J(X, I) {
                return this.rpcCall(J, yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest, yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse, X, I)
              }, "name", {
                value: "Export"
              }), Y
            }(), Z.ExportMetricsServiceRequest = function () {
              function Y(J) {
                if (this.resourceMetrics = [], J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.resourceMetrics = hA.emptyArray, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.resourceMetrics != null && X.resourceMetrics.length)
                  for (var D = 0; D < X.resourceMetrics.length; ++D) yA.opentelemetry.proto.metrics.v1.ResourceMetrics.encode(X.resourceMetrics[D], I.uint32(10).fork()).ldelim();
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      if (!(K.resourceMetrics && K.resourceMetrics.length)) K.resourceMetrics = [];
                      K.resourceMetrics.push(yA.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(X, X.uint32()));
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.resourceMetrics != null && X.hasOwnProperty("resourceMetrics")) {
                  if (!Array.isArray(X.resourceMetrics)) return "resourceMetrics: array expected";
                  for (var I = 0; I < X.resourceMetrics.length; ++I) {
                    var D = yA.opentelemetry.proto.metrics.v1.ResourceMetrics.verify(X.resourceMetrics[I]);
                    if (D) return "resourceMetrics." + D
                  }
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest) return X;
                var I = new yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
                if (X.resourceMetrics) {
                  if (!Array.isArray(X.resourceMetrics)) throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: array expected");
                  I.resourceMetrics = [];
                  for (var D = 0; D < X.resourceMetrics.length; ++D) {
                    if (typeof X.resourceMetrics[D] !== "object") throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: object expected");
                    I.resourceMetrics[D] = yA.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(X.resourceMetrics[D])
                  }
                }
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.arrays || I.defaults) D.resourceMetrics = [];
                if (X.resourceMetrics && X.resourceMetrics.length) {
                  D.resourceMetrics = [];
                  for (var W = 0; W < X.resourceMetrics.length; ++W) D.resourceMetrics[W] = yA.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(X.resourceMetrics[W], I)
                }
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest"
              }, Y
            }(), Z.ExportMetricsServiceResponse = function () {
              function Y(J) {
                if (J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.partialSuccess = null, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.partialSuccess != null && Object.hasOwnProperty.call(X, "partialSuccess")) yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.encode(X.partialSuccess, I.uint32(10).fork()).ldelim();
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      K.partialSuccess = yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.decode(X, X.uint32());
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.partialSuccess != null && X.hasOwnProperty("partialSuccess")) {
                  var I = yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.verify(X.partialSuccess);
                  if (I) return "partialSuccess." + I
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse) return X;
                var I = new yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;
                if (X.partialSuccess != null) {
                  if (typeof X.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse.partialSuccess: object expected");
                  I.partialSuccess = yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.fromObject(X.partialSuccess)
                }
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.defaults) D.partialSuccess = null;
                if (X.partialSuccess != null && X.hasOwnProperty("partialSuccess")) D.partialSuccess = yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.toObject(X.partialSuccess, I);
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse"
              }, Y
            }(), Z.ExportMetricsPartialSuccess = function () {
              function Y(J) {
                if (J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.rejectedDataPoints = null, Y.prototype.errorMessage = null, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.rejectedDataPoints != null && Object.hasOwnProperty.call(X, "rejectedDataPoints")) I.uint32(8).int64(X.rejectedDataPoints);
                if (X.errorMessage != null && Object.hasOwnProperty.call(X, "errorMessage")) I.uint32(18).string(X.errorMessage);
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      K.rejectedDataPoints = X.int64();
                      break
                    }
                    case 2: {
                      K.errorMessage = X.string();
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.rejectedDataPoints != null && X.hasOwnProperty("rejectedDataPoints")) {
                  if (!hA.isInteger(X.rejectedDataPoints) && !(X.rejectedDataPoints && hA.isInteger(X.rejectedDataPoints.low) && hA.isInteger(X.rejectedDataPoints.high))) return "rejectedDataPoints: integer|Long expected"
                }
                if (X.errorMessage != null && X.hasOwnProperty("errorMessage")) {
                  if (!hA.isString(X.errorMessage)) return "errorMessage: string expected"
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess) return X;
                var I = new yA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;
                if (X.rejectedDataPoints != null) {
                  if (hA.Long)(I.rejectedDataPoints = hA.Long.fromValue(X.rejectedDataPoints)).unsigned = !1;
                  else if (typeof X.rejectedDataPoints === "string") I.rejectedDataPoints = parseInt(X.rejectedDataPoints, 10);
                  else if (typeof X.rejectedDataPoints === "number") I.rejectedDataPoints = X.rejectedDataPoints;
                  else if (typeof X.rejectedDataPoints === "object") I.rejectedDataPoints = new hA.LongBits(X.rejectedDataPoints.low >>> 0, X.rejectedDataPoints.high >>> 0).toNumber()
                }
                if (X.errorMessage != null) I.errorMessage = String(X.errorMessage);
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.defaults) {
                  if (hA.Long) {
                    var W = new hA.Long(0, 0, !1);
                    D.rejectedDataPoints = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                  } else D.rejectedDataPoints = I.longs === String ? "0" : 0;
                  D.errorMessage = ""
                }
                if (X.rejectedDataPoints != null && X.hasOwnProperty("rejectedDataPoints"))
                  if (typeof X.rejectedDataPoints === "number") D.rejectedDataPoints = I.longs === String ? String(X.rejectedDataPoints) : X.rejectedDataPoints;
                  else D.rejectedDataPoints = I.longs === String ? hA.Long.prototype.toString.call(X.rejectedDataPoints) : I.longs === Number ? new hA.LongBits(X.rejectedDataPoints.low >>> 0, X.rejectedDataPoints.high >>> 0).toNumber() : X.rejectedDataPoints;
                if (X.errorMessage != null && X.hasOwnProperty("errorMessage")) D.errorMessage = X.errorMessage;
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess"
              }, Y
            }(), Z
          }(), G
        }(), B.logs = function () {
          var G = {};
          return G.v1 = function () {
            var Z = {};
            return Z.LogsService = function () {
              function Y(J, X, I) {
                D4.rpc.Service.call(this, J, X, I)
              }
              return (Y.prototype = Object.create(D4.rpc.Service.prototype)).constructor = Y, Y.create = function (X, I, D) {
                return new this(X, I, D)
              }, Object.defineProperty(Y.prototype.export = function J(X, I) {
                return this.rpcCall(J, yA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest, yA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse, X, I)
              }, "name", {
                value: "Export"
              }), Y
            }(), Z.ExportLogsServiceRequest = function () {
              function Y(J) {
                if (this.resourceLogs = [], J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.resourceLogs = hA.emptyArray, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.resourceLogs != null && X.resourceLogs.length)
                  for (var D = 0; D < X.resourceLogs.length; ++D) yA.opentelemetry.proto.logs.v1.ResourceLogs.encode(X.resourceLogs[D], I.uint32(10).fork()).ldelim();
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      if (!(K.resourceLogs && K.resourceLogs.length)) K.resourceLogs = [];
                      K.resourceLogs.push(yA.opentelemetry.proto.logs.v1.ResourceLogs.decode(X, X.uint32()));
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.resourceLogs != null && X.hasOwnProperty("resourceLogs")) {
                  if (!Array.isArray(X.resourceLogs)) return "resourceLogs: array expected";
                  for (var I = 0; I < X.resourceLogs.length; ++I) {
                    var D = yA.opentelemetry.proto.logs.v1.ResourceLogs.verify(X.resourceLogs[I]);
                    if (D) return "resourceLogs." + D
                  }
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest) return X;
                var I = new yA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
                if (X.resourceLogs) {
                  if (!Array.isArray(X.resourceLogs)) throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: array expected");
                  I.resourceLogs = [];
                  for (var D = 0; D < X.resourceLogs.length; ++D) {
                    if (typeof X.resourceLogs[D] !== "object") throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: object expected");
                    I.resourceLogs[D] = yA.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(X.resourceLogs[D])
                  }
                }
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.arrays || I.defaults) D.resourceLogs = [];
                if (X.resourceLogs && X.resourceLogs.length) {
                  D.resourceLogs = [];
                  for (var W = 0; W < X.resourceLogs.length; ++W) D.resourceLogs[W] = yA.opentelemetry.proto.logs.v1.ResourceLogs.toObject(X.resourceLogs[W], I)
                }
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest"
              }, Y
            }(), Z.ExportLogsServiceResponse = function () {
              function Y(J) {
                if (J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.partialSuccess = null, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.partialSuccess != null && Object.hasOwnProperty.call(X, "partialSuccess")) yA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.encode(X.partialSuccess, I.uint32(10).fork()).ldelim();
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      K.partialSuccess = yA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.decode(X, X.uint32());
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.partialSuccess != null && X.hasOwnProperty("partialSuccess")) {
                  var I = yA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.verify(X.partialSuccess);
                  if (I) return "partialSuccess." + I
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse) return X;
                var I = new yA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;
                if (X.partialSuccess != null) {
                  if (typeof X.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse.partialSuccess: object expected");
                  I.partialSuccess = yA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.fromObject(X.partialSuccess)
                }
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.defaults) D.partialSuccess = null;
                if (X.partialSuccess != null && X.hasOwnProperty("partialSuccess")) D.partialSuccess = yA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.toObject(X.partialSuccess, I);
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse"
              }, Y
            }(), Z.ExportLogsPartialSuccess = function () {
              function Y(J) {
                if (J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.rejectedLogRecords = null, Y.prototype.errorMessage = null, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.rejectedLogRecords != null && Object.hasOwnProperty.call(X, "rejectedLogRecords")) I.uint32(8).int64(X.rejectedLogRecords);
                if (X.errorMessage != null && Object.hasOwnProperty.call(X, "errorMessage")) I.uint32(18).string(X.errorMessage);
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      K.rejectedLogRecords = X.int64();
                      break
                    }
                    case 2: {
                      K.errorMessage = X.string();
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.rejectedLogRecords != null && X.hasOwnProperty("rejectedLogRecords")) {
                  if (!hA.isInteger(X.rejectedLogRecords) && !(X.rejectedLogRecords && hA.isInteger(X.rejectedLogRecords.low) && hA.isInteger(X.rejectedLogRecords.high))) return "rejectedLogRecords: integer|Long expected"
                }
                if (X.errorMessage != null && X.hasOwnProperty("errorMessage")) {
                  if (!hA.isString(X.errorMessage)) return "errorMessage: string expected"
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess) return X;
                var I = new yA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;
                if (X.rejectedLogRecords != null) {
                  if (hA.Long)(I.rejectedLogRecords = hA.Long.fromValue(X.rejectedLogRecords)).unsigned = !1;
                  else if (typeof X.rejectedLogRecords === "string") I.rejectedLogRecords = parseInt(X.rejectedLogRecords, 10);
                  else if (typeof X.rejectedLogRecords === "number") I.rejectedLogRecords = X.rejectedLogRecords;
                  else if (typeof X.rejectedLogRecords === "object") I.rejectedLogRecords = new hA.LongBits(X.rejectedLogRecords.low >>> 0, X.rejectedLogRecords.high >>> 0).toNumber()
                }
                if (X.errorMessage != null) I.errorMessage = String(X.errorMessage);
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.defaults) {
                  if (hA.Long) {
                    var W = new hA.Long(0, 0, !1);
                    D.rejectedLogRecords = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                  } else D.rejectedLogRecords = I.longs === String ? "0" : 0;
                  D.errorMessage = ""
                }
                if (X.rejectedLogRecords != null && X.hasOwnProperty("rejectedLogRecords"))
                  if (typeof X.rejectedLogRecords === "number") D.rejectedLogRecords = I.longs === String ? String(X.rejectedLogRecords) : X.rejectedLogRecords;
                  else D.rejectedLogRecords = I.longs === String ? hA.Long.prototype.toString.call(X.rejectedLogRecords) : I.longs === Number ? new hA.LongBits(X.rejectedLogRecords.low >>> 0, X.rejectedLogRecords.high >>> 0).toNumber() : X.rejectedLogRecords;
                if (X.errorMessage != null && X.hasOwnProperty("errorMessage")) D.errorMessage = X.errorMessage;
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess"
              }, Y
            }(), Z
          }(), G
        }(), B
      }(), Q.metrics = function () {
        var B = {};
        return B.v1 = function () {
          var G = {};
          return G.MetricsData = function () {
            function Z(Y) {
              if (this.resourceMetrics = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.resourceMetrics = hA.emptyArray, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.resourceMetrics != null && J.resourceMetrics.length)
                for (var I = 0; I < J.resourceMetrics.length; ++I) yA.opentelemetry.proto.metrics.v1.ResourceMetrics.encode(J.resourceMetrics[I], X.uint32(10).fork()).ldelim();
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.metrics.v1.MetricsData;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(W.resourceMetrics && W.resourceMetrics.length)) W.resourceMetrics = [];
                    W.resourceMetrics.push(yA.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(J, J.uint32()));
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.resourceMetrics != null && J.hasOwnProperty("resourceMetrics")) {
                if (!Array.isArray(J.resourceMetrics)) return "resourceMetrics: array expected";
                for (var X = 0; X < J.resourceMetrics.length; ++X) {
                  var I = yA.opentelemetry.proto.metrics.v1.ResourceMetrics.verify(J.resourceMetrics[X]);
                  if (I) return "resourceMetrics." + I
                }
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.metrics.v1.MetricsData) return J;
              var X = new yA.opentelemetry.proto.metrics.v1.MetricsData;
              if (J.resourceMetrics) {
                if (!Array.isArray(J.resourceMetrics)) throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: array expected");
                X.resourceMetrics = [];
                for (var I = 0; I < J.resourceMetrics.length; ++I) {
                  if (typeof J.resourceMetrics[I] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: object expected");
                  X.resourceMetrics[I] = yA.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(J.resourceMetrics[I])
                }
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.resourceMetrics = [];
              if (J.resourceMetrics && J.resourceMetrics.length) {
                I.resourceMetrics = [];
                for (var D = 0; D < J.resourceMetrics.length; ++D) I.resourceMetrics[D] = yA.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(J.resourceMetrics[D], X)
              }
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.MetricsData"
            }, Z
          }(), G.ResourceMetrics = function () {
            function Z(Y) {
              if (this.scopeMetrics = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.resource = null, Z.prototype.scopeMetrics = hA.emptyArray, Z.prototype.schemaUrl = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.resource != null && Object.hasOwnProperty.call(J, "resource")) yA.opentelemetry.proto.resource.v1.Resource.encode(J.resource, X.uint32(10).fork()).ldelim();
              if (J.scopeMetrics != null && J.scopeMetrics.length)
                for (var I = 0; I < J.scopeMetrics.length; ++I) yA.opentelemetry.proto.metrics.v1.ScopeMetrics.encode(J.scopeMetrics[I], X.uint32(18).fork()).ldelim();
              if (J.schemaUrl != null && Object.hasOwnProperty.call(J, "schemaUrl")) X.uint32(26).string(J.schemaUrl);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.metrics.v1.ResourceMetrics;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    W.resource = yA.opentelemetry.proto.resource.v1.Resource.decode(J, J.uint32());
                    break
                  }
                  case 2: {
                    if (!(W.scopeMetrics && W.scopeMetrics.length)) W.scopeMetrics = [];
                    W.scopeMetrics.push(yA.opentelemetry.proto.metrics.v1.ScopeMetrics.decode(J, J.uint32()));
                    break
                  }
                  case 3: {
                    W.schemaUrl = J.string();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.resource != null && J.hasOwnProperty("resource")) {
                var X = yA.opentelemetry.proto.resource.v1.Resource.verify(J.resource);
                if (X) return "resource." + X
              }
              if (J.scopeMetrics != null && J.hasOwnProperty("scopeMetrics")) {
                if (!Array.isArray(J.scopeMetrics)) return "scopeMetrics: array expected";
                for (var I = 0; I < J.scopeMetrics.length; ++I) {
                  var X = yA.opentelemetry.proto.metrics.v1.ScopeMetrics.verify(J.scopeMetrics[I]);
                  if (X) return "scopeMetrics." + X
                }
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) {
                if (!hA.isString(J.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.metrics.v1.ResourceMetrics) return J;
              var X = new yA.opentelemetry.proto.metrics.v1.ResourceMetrics;
              if (J.resource != null) {
                if (typeof J.resource !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.resource: object expected");
                X.resource = yA.opentelemetry.proto.resource.v1.Resource.fromObject(J.resource)
              }
              if (J.scopeMetrics) {
                if (!Array.isArray(J.scopeMetrics)) throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: array expected");
                X.scopeMetrics = [];
                for (var I = 0; I < J.scopeMetrics.length; ++I) {
                  if (typeof J.scopeMetrics[I] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: object expected");
                  X.scopeMetrics[I] = yA.opentelemetry.proto.metrics.v1.ScopeMetrics.fromObject(J.scopeMetrics[I])
                }
              }
              if (J.schemaUrl != null) X.schemaUrl = String(J.schemaUrl);
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.scopeMetrics = [];
              if (X.defaults) I.resource = null, I.schemaUrl = "";
              if (J.resource != null && J.hasOwnProperty("resource")) I.resource = yA.opentelemetry.proto.resource.v1.Resource.toObject(J.resource, X);
              if (J.scopeMetrics && J.scopeMetrics.length) {
                I.scopeMetrics = [];
                for (var D = 0; D < J.scopeMetrics.length; ++D) I.scopeMetrics[D] = yA.opentelemetry.proto.metrics.v1.ScopeMetrics.toObject(J.scopeMetrics[D], X)
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) I.schemaUrl = J.schemaUrl;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.ResourceMetrics"
            }, Z
          }(), G.ScopeMetrics = function () {
            function Z(Y) {
              if (this.metrics = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.scope = null, Z.prototype.metrics = hA.emptyArray, Z.prototype.schemaUrl = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.scope != null && Object.hasOwnProperty.call(J, "scope")) yA.opentelemetry.proto.common.v1.InstrumentationScope.encode(J.scope, X.uint32(10).fork()).ldelim();
              if (J.metrics != null && J.metrics.length)
                for (var I = 0; I < J.metrics.length; ++I) yA.opentelemetry.proto.metrics.v1.Metric.encode(J.metrics[I], X.uint32(18).fork()).ldelim();
              if (J.schemaUrl != null && Object.hasOwnProperty.call(J, "schemaUrl")) X.uint32(26).string(J.schemaUrl);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.metrics.v1.ScopeMetrics;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    W.scope = yA.opentelemetry.proto.common.v1.InstrumentationScope.decode(J, J.uint32());
                    break
                  }
                  case 2: {
                    if (!(W.metrics && W.metrics.length)) W.metrics = [];
                    W.metrics.push(yA.opentelemetry.proto.metrics.v1.Metric.decode(J, J.uint32()));
                    break
                  }
                  case 3: {
                    W.schemaUrl = J.string();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.scope != null && J.hasOwnProperty("scope")) {
                var X = yA.opentelemetry.proto.common.v1.InstrumentationScope.verify(J.scope);
                if (X) return "scope." + X
              }
              if (J.metrics != null && J.hasOwnProperty("metrics")) {
                if (!Array.isArray(J.metrics)) return "metrics: array expected";
                for (var I = 0; I < J.metrics.length; ++I) {
                  var X = yA.opentelemetry.proto.metrics.v1.Metric.verify(J.metrics[I]);
                  if (X) return "metrics." + X
                }
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) {
                if (!hA.isString(J.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.metrics.v1.ScopeMetrics) return J;
              var X = new yA.opentelemetry.proto.metrics.v1.ScopeMetrics;
              if (J.scope != null) {
                if (typeof J.scope !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.scope: object expected");
                X.scope = yA.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(J.scope)
              }
              if (J.metrics) {
                if (!Array.isArray(J.metrics)) throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: array expected");
                X.metrics = [];
                for (var I = 0; I < J.metrics.length; ++I) {
                  if (typeof J.metrics[I] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: object expected");
                  X.metrics[I] = yA.opentelemetry.proto.metrics.v1.Metric.fromObject(J.metrics[I])
                }
              }
              if (J.schemaUrl != null) X.schemaUrl = String(J.schemaUrl);
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.metrics = [];
              if (X.defaults) I.scope = null, I.schemaUrl = "";
              if (J.scope != null && J.hasOwnProperty("scope")) I.scope = yA.opentelemetry.proto.common.v1.InstrumentationScope.toObject(J.scope, X);
              if (J.metrics && J.metrics.length) {
                I.metrics = [];
                for (var D = 0; D < J.metrics.length; ++D) I.metrics[D] = yA.opentelemetry.proto.metrics.v1.Metric.toObject(J.metrics[D], X)
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) I.schemaUrl = J.schemaUrl;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.ScopeMetrics"
            }, Z
          }(), G.Metric = function () {
            function Z(J) {
              if (this.metadata = [], J) {
                for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                  if (J[X[I]] != null) this[X[I]] = J[X[I]]
              }
            }
            Z.prototype.name = null, Z.prototype.description = null, Z.prototype.unit = null, Z.prototype.gauge = null, Z.prototype.sum = null, Z.prototype.histogram = null, Z.prototype.exponentialHistogram = null, Z.prototype.summary = null, Z.prototype.metadata = hA.emptyArray;
            var Y;
            return Object.defineProperty(Z.prototype, "data", {
              get: hA.oneOfGetter(Y = ["gauge", "sum", "histogram", "exponentialHistogram", "summary"]),
              set: hA.oneOfSetter(Y)
            }), Z.create = function (X) {
              return new Z(X)
            }, Z.encode = function (X, I) {
              if (!I) I = L3.create();
              if (X.name != null && Object.hasOwnProperty.call(X, "name")) I.uint32(10).string(X.name);
              if (X.description != null && Object.hasOwnProperty.call(X, "description")) I.uint32(18).string(X.description);
              if (X.unit != null && Object.hasOwnProperty.call(X, "unit")) I.uint32(26).string(X.unit);
              if (X.gauge != null && Object.hasOwnProperty.call(X, "gauge")) yA.opentelemetry.proto.metrics.v1.Gauge.encode(X.gauge, I.uint32(42).fork()).ldelim();
              if (X.sum != null && Object.hasOwnProperty.call(X, "sum")) yA.opentelemetry.proto.metrics.v1.Sum.encode(X.sum, I.uint32(58).fork()).ldelim();
              if (X.histogram != null && Object.hasOwnProperty.call(X, "histogram")) yA.opentelemetry.proto.metrics.v1.Histogram.encode(X.histogram, I.uint32(74).fork()).ldelim();
              if (X.exponentialHistogram != null && Object.hasOwnProperty.call(X, "exponentialHistogram")) yA.opentelemetry.proto.metrics.v1.ExponentialHistogram.encode(X.exponentialHistogram, I.uint32(82).fork()).ldelim();
              if (X.summary != null && Object.hasOwnProperty.call(X, "summary")) yA.opentelemetry.proto.metrics.v1.Summary.encode(X.summary, I.uint32(90).fork()).ldelim();
              if (X.metadata != null && X.metadata.length)
                for (var D = 0; D < X.metadata.length; ++D) yA.opentelemetry.proto.common.v1.KeyValue.encode(X.metadata[D], I.uint32(98).fork()).ldelim();
              return I
            }, Z.encodeDelimited = function (X, I) {
              return this.encode(X, I).ldelim()
            }, Z.decode = function (X, I, D) {
              if (!(X instanceof K0)) X = K0.create(X);
              var W = I === void 0 ? X.len : X.pos + I,
                K = new yA.opentelemetry.proto.metrics.v1.Metric;
              while (X.pos < W) {
                var V = X.uint32();
                if (V === D) break;
                switch (V >>> 3) {
                  case 1: {
                    K.name = X.string();
                    break
                  }
                  case 2: {
                    K.description = X.string();
                    break
                  }
                  case 3: {
                    K.unit = X.string();
                    break
                  }
                  case 5: {
                    K.gauge = yA.opentelemetry.proto.metrics.v1.Gauge.decode(X, X.uint32());
                    break
                  }
                  case 7: {
                    K.sum = yA.opentelemetry.proto.metrics.v1.Sum.decode(X, X.uint32());
                    break
                  }
                  case 9: {
                    K.histogram = yA.opentelemetry.proto.metrics.v1.Histogram.decode(X, X.uint32());
                    break
                  }
                  case 10: {
                    K.exponentialHistogram = yA.opentelemetry.proto.metrics.v1.ExponentialHistogram.decode(X, X.uint32());
                    break
                  }
                  case 11: {
                    K.summary = yA.opentelemetry.proto.metrics.v1.Summary.decode(X, X.uint32());
                    break
                  }
                  case 12: {
                    if (!(K.metadata && K.metadata.length)) K.metadata = [];
                    K.metadata.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(X, X.uint32()));
                    break
                  }
                  default:
                    X.skipType(V & 7);
                    break
                }
              }
              return K
            }, Z.decodeDelimited = function (X) {
              if (!(X instanceof K0)) X = new K0(X);
              return this.decode(X, X.uint32())
            }, Z.verify = function (X) {
              if (typeof X !== "object" || X === null) return "object expected";
              var I = {};
              if (X.name != null && X.hasOwnProperty("name")) {
                if (!hA.isString(X.name)) return "name: string expected"
              }
              if (X.description != null && X.hasOwnProperty("description")) {
                if (!hA.isString(X.description)) return "description: string expected"
              }
              if (X.unit != null && X.hasOwnProperty("unit")) {
                if (!hA.isString(X.unit)) return "unit: string expected"
              }
              if (X.gauge != null && X.hasOwnProperty("gauge")) {
                I.data = 1;
                {
                  var D = yA.opentelemetry.proto.metrics.v1.Gauge.verify(X.gauge);
                  if (D) return "gauge." + D
                }
              }
              if (X.sum != null && X.hasOwnProperty("sum")) {
                if (I.data === 1) return "data: multiple values";
                I.data = 1;
                {
                  var D = yA.opentelemetry.proto.metrics.v1.Sum.verify(X.sum);
                  if (D) return "sum." + D
                }
              }
              if (X.histogram != null && X.hasOwnProperty("histogram")) {
                if (I.data === 1) return "data: multiple values";
                I.data = 1;
                {
                  var D = yA.opentelemetry.proto.metrics.v1.Histogram.verify(X.histogram);
                  if (D) return "histogram." + D
                }
              }
              if (X.exponentialHistogram != null && X.hasOwnProperty("exponentialHistogram")) {
                if (I.data === 1) return "data: multiple values";
                I.data = 1;
                {
                  var D = yA.opentelemetry.proto.metrics.v1.ExponentialHistogram.verify(X.exponentialHistogram);
                  if (D) return "exponentialHistogram." + D
                }
              }
              if (X.summary != null && X.hasOwnProperty("summary")) {
                if (I.data === 1) return "data: multiple values";
                I.data = 1;
                {
                  var D = yA.opentelemetry.proto.metrics.v1.Summary.verify(X.summary);
                  if (D) return "summary." + D
                }
              }
              if (X.metadata != null && X.hasOwnProperty("metadata")) {
                if (!Array.isArray(X.metadata)) return "metadata: array expected";
                for (var W = 0; W < X.metadata.length; ++W) {
                  var D = yA.opentelemetry.proto.common.v1.KeyValue.verify(X.metadata[W]);
                  if (D) return "metadata." + D
                }
              }
              return null
            }, Z.fromObject = function (X) {
              if (X instanceof yA.opentelemetry.proto.metrics.v1.Metric) return X;
              var I = new yA.opentelemetry.proto.metrics.v1.Metric;
              if (X.name != null) I.name = String(X.name);
              if (X.description != null) I.description = String(X.description);
              if (X.unit != null) I.unit = String(X.unit);
              if (X.gauge != null) {
                if (typeof X.gauge !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.gauge: object expected");
                I.gauge = yA.opentelemetry.proto.metrics.v1.Gauge.fromObject(X.gauge)
              }
              if (X.sum != null) {
                if (typeof X.sum !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.sum: object expected");
                I.sum = yA.opentelemetry.proto.metrics.v1.Sum.fromObject(X.sum)
              }
              if (X.histogram != null) {
                if (typeof X.histogram !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.histogram: object expected");
                I.histogram = yA.opentelemetry.proto.metrics.v1.Histogram.fromObject(X.histogram)
              }
              if (X.exponentialHistogram != null) {
                if (typeof X.exponentialHistogram !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.exponentialHistogram: object expected");
                I.exponentialHistogram = yA.opentelemetry.proto.metrics.v1.ExponentialHistogram.fromObject(X.exponentialHistogram)
              }
              if (X.summary != null) {
                if (typeof X.summary !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.summary: object expected");
                I.summary = yA.opentelemetry.proto.metrics.v1.Summary.fromObject(X.summary)
              }
              if (X.metadata) {
                if (!Array.isArray(X.metadata)) throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: array expected");
                I.metadata = [];
                for (var D = 0; D < X.metadata.length; ++D) {
                  if (typeof X.metadata[D] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: object expected");
                  I.metadata[D] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(X.metadata[D])
                }
              }
              return I
            }, Z.toObject = function (X, I) {
              if (!I) I = {};
              var D = {};
              if (I.arrays || I.defaults) D.metadata = [];
              if (I.defaults) D.name = "", D.description = "", D.unit = "";
              if (X.name != null && X.hasOwnProperty("name")) D.name = X.name;
              if (X.description != null && X.hasOwnProperty("description")) D.description = X.description;
              if (X.unit != null && X.hasOwnProperty("unit")) D.unit = X.unit;
              if (X.gauge != null && X.hasOwnProperty("gauge")) {
                if (D.gauge = yA.opentelemetry.proto.metrics.v1.Gauge.toObject(X.gauge, I), I.oneofs) D.data = "gauge"
              }
              if (X.sum != null && X.hasOwnProperty("sum")) {
                if (D.sum = yA.opentelemetry.proto.metrics.v1.Sum.toObject(X.sum, I), I.oneofs) D.data = "sum"
              }
              if (X.histogram != null && X.hasOwnProperty("histogram")) {
                if (D.histogram = yA.opentelemetry.proto.metrics.v1.Histogram.toObject(X.histogram, I), I.oneofs) D.data = "histogram"
              }
              if (X.exponentialHistogram != null && X.hasOwnProperty("exponentialHistogram")) {
                if (D.exponentialHistogram = yA.opentelemetry.proto.metrics.v1.ExponentialHistogram.toObject(X.exponentialHistogram, I), I.oneofs) D.data = "exponentialHistogram"
              }
              if (X.summary != null && X.hasOwnProperty("summary")) {
                if (D.summary = yA.opentelemetry.proto.metrics.v1.Summary.toObject(X.summary, I), I.oneofs) D.data = "summary"
              }
              if (X.metadata && X.metadata.length) {
                D.metadata = [];
                for (var W = 0; W < X.metadata.length; ++W) D.metadata[W] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(X.metadata[W], I)
              }
              return D
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (X) {
              if (X === void 0) X = "type.googleapis.com";
              return X + "/opentelemetry.proto.metrics.v1.Metric"
            }, Z
          }(), G.Gauge = function () {
            function Z(Y) {
              if (this.dataPoints = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.dataPoints = hA.emptyArray, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.dataPoints != null && J.dataPoints.length)
                for (var I = 0; I < J.dataPoints.length; ++I) yA.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(J.dataPoints[I], X.uint32(10).fork()).ldelim();
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.metrics.v1.Gauge;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(W.dataPoints && W.dataPoints.length)) W.dataPoints = [];
                    W.dataPoints.push(yA.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(J, J.uint32()));
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.dataPoints != null && J.hasOwnProperty("dataPoints")) {
                if (!Array.isArray(J.dataPoints)) return "dataPoints: array expected";
                for (var X = 0; X < J.dataPoints.length; ++X) {
                  var I = yA.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(J.dataPoints[X]);
                  if (I) return "dataPoints." + I
                }
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.metrics.v1.Gauge) return J;
              var X = new yA.opentelemetry.proto.metrics.v1.Gauge;
              if (J.dataPoints) {
                if (!Array.isArray(J.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: array expected");
                X.dataPoints = [];
                for (var I = 0; I < J.dataPoints.length; ++I) {
                  if (typeof J.dataPoints[I] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: object expected");
                  X.dataPoints[I] = yA.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(J.dataPoints[I])
                }
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.dataPoints = [];
              if (J.dataPoints && J.dataPoints.length) {
                I.dataPoints = [];
                for (var D = 0; D < J.dataPoints.length; ++D) I.dataPoints[D] = yA.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(J.dataPoints[D], X)
              }
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.Gauge"
            }, Z
          }(), G.Sum = function () {
            function Z(Y) {
              if (this.dataPoints = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.dataPoints = hA.emptyArray, Z.prototype.aggregationTemporality = null, Z.prototype.isMonotonic = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.dataPoints != null && J.dataPoints.length)
                for (var I = 0; I < J.dataPoints.length; ++I) yA.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(J.dataPoints[I], X.uint32(10).fork()).ldelim();
              if (J.aggregationTemporality != null && Object.hasOwnProperty.call(J, "aggregationTemporality")) X.uint32(16).int32(J.aggregationTemporality);
              if (J.isMonotonic != null && Object.hasOwnProperty.call(J, "isMonotonic")) X.uint32(24).bool(J.isMonotonic);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.metrics.v1.Sum;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(W.dataPoints && W.dataPoints.length)) W.dataPoints = [];
                    W.dataPoints.push(yA.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(J, J.uint32()));
                    break
                  }
                  case 2: {
                    W.aggregationTemporality = J.int32();
                    break
                  }
                  case 3: {
                    W.isMonotonic = J.bool();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.dataPoints != null && J.hasOwnProperty("dataPoints")) {
                if (!Array.isArray(J.dataPoints)) return "dataPoints: array expected";
                for (var X = 0; X < J.dataPoints.length; ++X) {
                  var I = yA.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(J.dataPoints[X]);
                  if (I) return "dataPoints." + I
                }
              }
              if (J.aggregationTemporality != null && J.hasOwnProperty("aggregationTemporality")) switch (J.aggregationTemporality) {
                default:
                  return "aggregationTemporality: enum value expected";
                case 0:
                case 1:
                case 2:
                  break
              }
              if (J.isMonotonic != null && J.hasOwnProperty("isMonotonic")) {
                if (typeof J.isMonotonic !== "boolean") return "isMonotonic: boolean expected"
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.metrics.v1.Sum) return J;
              var X = new yA.opentelemetry.proto.metrics.v1.Sum;
              if (J.dataPoints) {
                if (!Array.isArray(J.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: array expected");
                X.dataPoints = [];
                for (var I = 0; I < J.dataPoints.length; ++I) {
                  if (typeof J.dataPoints[I] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: object expected");
                  X.dataPoints[I] = yA.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(J.dataPoints[I])
                }
              }
              switch (J.aggregationTemporality) {
                default:
                  if (typeof J.aggregationTemporality === "number") {
                    X.aggregationTemporality = J.aggregationTemporality;
                    break
                  }
                  break;
                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                case 0:
                  X.aggregationTemporality = 0;
                  break;
                case "AGGREGATION_TEMPORALITY_DELTA":
                case 1:
                  X.aggregationTemporality = 1;
                  break;
                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                case 2:
                  X.aggregationTemporality = 2;
                  break
              }
              if (J.isMonotonic != null) X.isMonotonic = Boolean(J.isMonotonic);
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.dataPoints = [];
              if (X.defaults) I.aggregationTemporality = X.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0, I.isMonotonic = !1;
              if (J.dataPoints && J.dataPoints.length) {
                I.dataPoints = [];
                for (var D = 0; D < J.dataPoints.length; ++D) I.dataPoints[D] = yA.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(J.dataPoints[D], X)
              }
              if (J.aggregationTemporality != null && J.hasOwnProperty("aggregationTemporality")) I.aggregationTemporality = X.enums === String ? yA.opentelemetry.proto.metrics.v1.AggregationTemporality[J.aggregationTemporality] === void 0 ? J.aggregationTemporality : yA.opentelemetry.proto.metrics.v1.AggregationTemporality[J.aggregationTemporality] : J.aggregationTemporality;
              if (J.isMonotonic != null && J.hasOwnProperty("isMonotonic")) I.isMonotonic = J.isMonotonic;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.Sum"
            }, Z
          }(), G.Histogram = function () {
            function Z(Y) {
              if (this.dataPoints = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.dataPoints = hA.emptyArray, Z.prototype.aggregationTemporality = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.dataPoints != null && J.dataPoints.length)
                for (var I = 0; I < J.dataPoints.length; ++I) yA.opentelemetry.proto.metrics.v1.HistogramDataPoint.encode(J.dataPoints[I], X.uint32(10).fork()).ldelim();
              if (J.aggregationTemporality != null && Object.hasOwnProperty.call(J, "aggregationTemporality")) X.uint32(16).int32(J.aggregationTemporality);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.metrics.v1.Histogram;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(W.dataPoints && W.dataPoints.length)) W.dataPoints = [];
                    W.dataPoints.push(yA.opentelemetry.proto.metrics.v1.HistogramDataPoint.decode(J, J.uint32()));
                    break
                  }
                  case 2: {
                    W.aggregationTemporality = J.int32();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.dataPoints != null && J.hasOwnProperty("dataPoints")) {
                if (!Array.isArray(J.dataPoints)) return "dataPoints: array expected";
                for (var X = 0; X < J.dataPoints.length; ++X) {
                  var I = yA.opentelemetry.proto.metrics.v1.HistogramDataPoint.verify(J.dataPoints[X]);
                  if (I) return "dataPoints." + I
                }
              }
              if (J.aggregationTemporality != null && J.hasOwnProperty("aggregationTemporality")) switch (J.aggregationTemporality) {
                default:
                  return "aggregationTemporality: enum value expected";
                case 0:
                case 1:
                case 2:
                  break
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.metrics.v1.Histogram) return J;
              var X = new yA.opentelemetry.proto.metrics.v1.Histogram;
              if (J.dataPoints) {
                if (!Array.isArray(J.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: array expected");
                X.dataPoints = [];
                for (var I = 0; I < J.dataPoints.length; ++I) {
                  if (typeof J.dataPoints[I] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: object expected");
                  X.dataPoints[I] = yA.opentelemetry.proto.metrics.v1.HistogramDataPoint.fromObject(J.dataPoints[I])
                }
              }
              switch (J.aggregationTemporality) {
                default:
                  if (typeof J.aggregationTemporality === "number") {
                    X.aggregationTemporality = J.aggregationTemporality;
                    break
                  }
                  break;
                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                case 0:
                  X.aggregationTemporality = 0;
                  break;
                case "AGGREGATION_TEMPORALITY_DELTA":
                case 1:
                  X.aggregationTemporality = 1;
                  break;
                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                case 2:
                  X.aggregationTemporality = 2;
                  break
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.dataPoints = [];
              if (X.defaults) I.aggregationTemporality = X.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
              if (J.dataPoints && J.dataPoints.length) {
                I.dataPoints = [];
                for (var D = 0; D < J.dataPoints.length; ++D) I.dataPoints[D] = yA.opentelemetry.proto.metrics.v1.HistogramDataPoint.toObject(J.dataPoints[D], X)
              }
              if (J.aggregationTemporality != null && J.hasOwnProperty("aggregationTemporality")) I.aggregationTemporality = X.enums === String ? yA.opentelemetry.proto.metrics.v1.AggregationTemporality[J.aggregationTemporality] === void 0 ? J.aggregationTemporality : yA.opentelemetry.proto.metrics.v1.AggregationTemporality[J.aggregationTemporality] : J.aggregationTemporality;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.Histogram"
            }, Z
          }(), G.ExponentialHistogram = function () {
            function Z(Y) {
              if (this.dataPoints = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.dataPoints = hA.emptyArray, Z.prototype.aggregationTemporality = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.dataPoints != null && J.dataPoints.length)
                for (var I = 0; I < J.dataPoints.length; ++I) yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.encode(J.dataPoints[I], X.uint32(10).fork()).ldelim();
              if (J.aggregationTemporality != null && Object.hasOwnProperty.call(J, "aggregationTemporality")) X.uint32(16).int32(J.aggregationTemporality);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.metrics.v1.ExponentialHistogram;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(W.dataPoints && W.dataPoints.length)) W.dataPoints = [];
                    W.dataPoints.push(yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.decode(J, J.uint32()));
                    break
                  }
                  case 2: {
                    W.aggregationTemporality = J.int32();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.dataPoints != null && J.hasOwnProperty("dataPoints")) {
                if (!Array.isArray(J.dataPoints)) return "dataPoints: array expected";
                for (var X = 0; X < J.dataPoints.length; ++X) {
                  var I = yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.verify(J.dataPoints[X]);
                  if (I) return "dataPoints." + I
                }
              }
              if (J.aggregationTemporality != null && J.hasOwnProperty("aggregationTemporality")) switch (J.aggregationTemporality) {
                default:
                  return "aggregationTemporality: enum value expected";
                case 0:
                case 1:
                case 2:
                  break
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.metrics.v1.ExponentialHistogram) return J;
              var X = new yA.opentelemetry.proto.metrics.v1.ExponentialHistogram;
              if (J.dataPoints) {
                if (!Array.isArray(J.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: array expected");
                X.dataPoints = [];
                for (var I = 0; I < J.dataPoints.length; ++I) {
                  if (typeof J.dataPoints[I] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: object expected");
                  X.dataPoints[I] = yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.fromObject(J.dataPoints[I])
                }
              }
              switch (J.aggregationTemporality) {
                default:
                  if (typeof J.aggregationTemporality === "number") {
                    X.aggregationTemporality = J.aggregationTemporality;
                    break
                  }
                  break;
                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                case 0:
                  X.aggregationTemporality = 0;
                  break;
                case "AGGREGATION_TEMPORALITY_DELTA":
                case 1:
                  X.aggregationTemporality = 1;
                  break;
                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                case 2:
                  X.aggregationTemporality = 2;
                  break
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.dataPoints = [];
              if (X.defaults) I.aggregationTemporality = X.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
              if (J.dataPoints && J.dataPoints.length) {
                I.dataPoints = [];
                for (var D = 0; D < J.dataPoints.length; ++D) I.dataPoints[D] = yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.toObject(J.dataPoints[D], X)
              }
              if (J.aggregationTemporality != null && J.hasOwnProperty("aggregationTemporality")) I.aggregationTemporality = X.enums === String ? yA.opentelemetry.proto.metrics.v1.AggregationTemporality[J.aggregationTemporality] === void 0 ? J.aggregationTemporality : yA.opentelemetry.proto.metrics.v1.AggregationTemporality[J.aggregationTemporality] : J.aggregationTemporality;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.ExponentialHistogram"
            }, Z
          }(), G.Summary = function () {
            function Z(Y) {
              if (this.dataPoints = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.dataPoints = hA.emptyArray, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.dataPoints != null && J.dataPoints.length)
                for (var I = 0; I < J.dataPoints.length; ++I) yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.encode(J.dataPoints[I], X.uint32(10).fork()).ldelim();
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.metrics.v1.Summary;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(W.dataPoints && W.dataPoints.length)) W.dataPoints = [];
                    W.dataPoints.push(yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.decode(J, J.uint32()));
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.dataPoints != null && J.hasOwnProperty("dataPoints")) {
                if (!Array.isArray(J.dataPoints)) return "dataPoints: array expected";
                for (var X = 0; X < J.dataPoints.length; ++X) {
                  var I = yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.verify(J.dataPoints[X]);
                  if (I) return "dataPoints." + I
                }
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.metrics.v1.Summary) return J;
              var X = new yA.opentelemetry.proto.metrics.v1.Summary;
              if (J.dataPoints) {
                if (!Array.isArray(J.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: array expected");
                X.dataPoints = [];
                for (var I = 0; I < J.dataPoints.length; ++I) {
                  if (typeof J.dataPoints[I] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: object expected");
                  X.dataPoints[I] = yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.fromObject(J.dataPoints[I])
                }
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.dataPoints = [];
              if (J.dataPoints && J.dataPoints.length) {
                I.dataPoints = [];
                for (var D = 0; D < J.dataPoints.length; ++D) I.dataPoints[D] = yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.toObject(J.dataPoints[D], X)
              }
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.Summary"
            }, Z
          }(), G.AggregationTemporality = function () {
            var Z = {},
              Y = Object.create(Z);
            return Y[Z[0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED"] = 0, Y[Z[1] = "AGGREGATION_TEMPORALITY_DELTA"] = 1, Y[Z[2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"] = 2, Y
          }(), G.DataPointFlags = function () {
            var Z = {},
              Y = Object.create(Z);
            return Y[Z[0] = "DATA_POINT_FLAGS_DO_NOT_USE"] = 0, Y[Z[1] = "DATA_POINT_FLAGS_NO_RECORDED_VALUE_MASK"] = 1, Y
          }(), G.NumberDataPoint = function () {
            function Z(J) {
              if (this.attributes = [], this.exemplars = [], J) {
                for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                  if (J[X[I]] != null) this[X[I]] = J[X[I]]
              }
            }
            Z.prototype.attributes = hA.emptyArray, Z.prototype.startTimeUnixNano = null, Z.prototype.timeUnixNano = null, Z.prototype.asDouble = null, Z.prototype.asInt = null, Z.prototype.exemplars = hA.emptyArray, Z.prototype.flags = null;
            var Y;
            return Object.defineProperty(Z.prototype, "value", {
              get: hA.oneOfGetter(Y = ["asDouble", "asInt"]),
              set: hA.oneOfSetter(Y)
            }), Z.create = function (X) {
              return new Z(X)
            }, Z.encode = function (X, I) {
              if (!I) I = L3.create();
              if (X.startTimeUnixNano != null && Object.hasOwnProperty.call(X, "startTimeUnixNano")) I.uint32(17).fixed64(X.startTimeUnixNano);
              if (X.timeUnixNano != null && Object.hasOwnProperty.call(X, "timeUnixNano")) I.uint32(25).fixed64(X.timeUnixNano);
              if (X.asDouble != null && Object.hasOwnProperty.call(X, "asDouble")) I.uint32(33).double(X.asDouble);
              if (X.exemplars != null && X.exemplars.length)
                for (var D = 0; D < X.exemplars.length; ++D) yA.opentelemetry.proto.metrics.v1.Exemplar.encode(X.exemplars[D], I.uint32(42).fork()).ldelim();
              if (X.asInt != null && Object.hasOwnProperty.call(X, "asInt")) I.uint32(49).sfixed64(X.asInt);
              if (X.attributes != null && X.attributes.length)
                for (var D = 0; D < X.attributes.length; ++D) yA.opentelemetry.proto.common.v1.KeyValue.encode(X.attributes[D], I.uint32(58).fork()).ldelim();
              if (X.flags != null && Object.hasOwnProperty.call(X, "flags")) I.uint32(64).uint32(X.flags);
              return I
            }, Z.encodeDelimited = function (X, I) {
              return this.encode(X, I).ldelim()
            }, Z.decode = function (X, I, D) {
              if (!(X instanceof K0)) X = K0.create(X);
              var W = I === void 0 ? X.len : X.pos + I,
                K = new yA.opentelemetry.proto.metrics.v1.NumberDataPoint;
              while (X.pos < W) {
                var V = X.uint32();
                if (V === D) break;
                switch (V >>> 3) {
                  case 7: {
                    if (!(K.attributes && K.attributes.length)) K.attributes = [];
                    K.attributes.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(X, X.uint32()));
                    break
                  }
                  case 2: {
                    K.startTimeUnixNano = X.fixed64();
                    break
                  }
                  case 3: {
                    K.timeUnixNano = X.fixed64();
                    break
                  }
                  case 4: {
                    K.asDouble = X.double();
                    break
                  }
                  case 6: {
                    K.asInt = X.sfixed64();
                    break
                  }
                  case 5: {
                    if (!(K.exemplars && K.exemplars.length)) K.exemplars = [];
                    K.exemplars.push(yA.opentelemetry.proto.metrics.v1.Exemplar.decode(X, X.uint32()));
                    break
                  }
                  case 8: {
                    K.flags = X.uint32();
                    break
                  }
                  default:
                    X.skipType(V & 7);
                    break
                }
              }
              return K
            }, Z.decodeDelimited = function (X) {
              if (!(X instanceof K0)) X = new K0(X);
              return this.decode(X, X.uint32())
            }, Z.verify = function (X) {
              if (typeof X !== "object" || X === null) return "object expected";
              var I = {};
              if (X.attributes != null && X.hasOwnProperty("attributes")) {
                if (!Array.isArray(X.attributes)) return "attributes: array expected";
                for (var D = 0; D < X.attributes.length; ++D) {
                  var W = yA.opentelemetry.proto.common.v1.KeyValue.verify(X.attributes[D]);
                  if (W) return "attributes." + W
                }
              }
              if (X.startTimeUnixNano != null && X.hasOwnProperty("startTimeUnixNano")) {
                if (!hA.isInteger(X.startTimeUnixNano) && !(X.startTimeUnixNano && hA.isInteger(X.startTimeUnixNano.low) && hA.isInteger(X.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
              }
              if (X.timeUnixNano != null && X.hasOwnProperty("timeUnixNano")) {
                if (!hA.isInteger(X.timeUnixNano) && !(X.timeUnixNano && hA.isInteger(X.timeUnixNano.low) && hA.isInteger(X.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (X.asDouble != null && X.hasOwnProperty("asDouble")) {
                if (I.value = 1, typeof X.asDouble !== "number") return "asDouble: number expected"
              }
              if (X.asInt != null && X.hasOwnProperty("asInt")) {
                if (I.value === 1) return "value: multiple values";
                if (I.value = 1, !hA.isInteger(X.asInt) && !(X.asInt && hA.isInteger(X.asInt.low) && hA.isInteger(X.asInt.high))) return "asInt: integer|Long expected"
              }
              if (X.exemplars != null && X.hasOwnProperty("exemplars")) {
                if (!Array.isArray(X.exemplars)) return "exemplars: array expected";
                for (var D = 0; D < X.exemplars.length; ++D) {
                  var W = yA.opentelemetry.proto.metrics.v1.Exemplar.verify(X.exemplars[D]);
                  if (W) return "exemplars." + W
                }
              }
              if (X.flags != null && X.hasOwnProperty("flags")) {
                if (!hA.isInteger(X.flags)) return "flags: integer expected"
              }
              return null
            }, Z.fromObject = function (X) {
              if (X instanceof yA.opentelemetry.proto.metrics.v1.NumberDataPoint) return X;
              var I = new yA.opentelemetry.proto.metrics.v1.NumberDataPoint;
              if (X.attributes) {
                if (!Array.isArray(X.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: array expected");
                I.attributes = [];
                for (var D = 0; D < X.attributes.length; ++D) {
                  if (typeof X.attributes[D] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: object expected");
                  I.attributes[D] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(X.attributes[D])
                }
              }
              if (X.startTimeUnixNano != null) {
                if (hA.Long)(I.startTimeUnixNano = hA.Long.fromValue(X.startTimeUnixNano)).unsigned = !1;
                else if (typeof X.startTimeUnixNano === "string") I.startTimeUnixNano = parseInt(X.startTimeUnixNano, 10);
                else if (typeof X.startTimeUnixNano === "number") I.startTimeUnixNano = X.startTimeUnixNano;
                else if (typeof X.startTimeUnixNano === "object") I.startTimeUnixNano = new hA.LongBits(X.startTimeUnixNano.low >>> 0, X.startTimeUnixNano.high >>> 0).toNumber()
              }
              if (X.timeUnixNano != null) {
                if (hA.Long)(I.timeUnixNano = hA.Long.fromValue(X.timeUnixNano)).unsigned = !1;
                else if (typeof X.timeUnixNano === "string") I.timeUnixNano = parseInt(X.timeUnixNano, 10);
                else if (typeof X.timeUnixNano === "number") I.timeUnixNano = X.timeUnixNano;
                else if (typeof X.timeUnixNano === "object") I.timeUnixNano = new hA.LongBits(X.timeUnixNano.low >>> 0, X.timeUnixNano.high >>> 0).toNumber()
              }
              if (X.asDouble != null) I.asDouble = Number(X.asDouble);
              if (X.asInt != null) {
                if (hA.Long)(I.asInt = hA.Long.fromValue(X.asInt)).unsigned = !1;
                else if (typeof X.asInt === "string") I.asInt = parseInt(X.asInt, 10);
                else if (typeof X.asInt === "number") I.asInt = X.asInt;
                else if (typeof X.asInt === "object") I.asInt = new hA.LongBits(X.asInt.low >>> 0, X.asInt.high >>> 0).toNumber()
              }
              if (X.exemplars) {
                if (!Array.isArray(X.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: array expected");
                I.exemplars = [];
                for (var D = 0; D < X.exemplars.length; ++D) {
                  if (typeof X.exemplars[D] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: object expected");
                  I.exemplars[D] = yA.opentelemetry.proto.metrics.v1.Exemplar.fromObject(X.exemplars[D])
                }
              }
              if (X.flags != null) I.flags = X.flags >>> 0;
              return I
            }, Z.toObject = function (X, I) {
              if (!I) I = {};
              var D = {};
              if (I.arrays || I.defaults) D.exemplars = [], D.attributes = [];
              if (I.defaults) {
                if (hA.Long) {
                  var W = new hA.Long(0, 0, !1);
                  D.startTimeUnixNano = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                } else D.startTimeUnixNano = I.longs === String ? "0" : 0;
                if (hA.Long) {
                  var W = new hA.Long(0, 0, !1);
                  D.timeUnixNano = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                } else D.timeUnixNano = I.longs === String ? "0" : 0;
                D.flags = 0
              }
              if (X.startTimeUnixNano != null && X.hasOwnProperty("startTimeUnixNano"))
                if (typeof X.startTimeUnixNano === "number") D.startTimeUnixNano = I.longs === String ? String(X.startTimeUnixNano) : X.startTimeUnixNano;
                else D.startTimeUnixNano = I.longs === String ? hA.Long.prototype.toString.call(X.startTimeUnixNano) : I.longs === Number ? new hA.LongBits(X.startTimeUnixNano.low >>> 0, X.startTimeUnixNano.high >>> 0).toNumber() : X.startTimeUnixNano;
              if (X.timeUnixNano != null && X.hasOwnProperty("timeUnixNano"))
                if (typeof X.timeUnixNano === "number") D.timeUnixNano = I.longs === String ? String(X.timeUnixNano) : X.timeUnixNano;
                else D.timeUnixNano = I.longs === String ? hA.Long.prototype.toString.call(X.timeUnixNano) : I.longs === Number ? new hA.LongBits(X.timeUnixNano.low >>> 0, X.timeUnixNano.high >>> 0).toNumber() : X.timeUnixNano;
              if (X.asDouble != null && X.hasOwnProperty("asDouble")) {
                if (D.asDouble = I.json && !isFinite(X.asDouble) ? String(X.asDouble) : X.asDouble, I.oneofs) D.value = "asDouble"
              }
              if (X.exemplars && X.exemplars.length) {
                D.exemplars = [];
                for (var K = 0; K < X.exemplars.length; ++K) D.exemplars[K] = yA.opentelemetry.proto.metrics.v1.Exemplar.toObject(X.exemplars[K], I)
              }
              if (X.asInt != null && X.hasOwnProperty("asInt")) {
                if (typeof X.asInt === "number") D.asInt = I.longs === String ? String(X.asInt) : X.asInt;
                else D.asInt = I.longs === String ? hA.Long.prototype.toString.call(X.asInt) : I.longs === Number ? new hA.LongBits(X.asInt.low >>> 0, X.asInt.high >>> 0).toNumber() : X.asInt;
                if (I.oneofs) D.value = "asInt"
              }
              if (X.attributes && X.attributes.length) {
                D.attributes = [];
                for (var K = 0; K < X.attributes.length; ++K) D.attributes[K] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(X.attributes[K], I)
              }
              if (X.flags != null && X.hasOwnProperty("flags")) D.flags = X.flags;
              return D
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (X) {
              if (X === void 0) X = "type.googleapis.com";
              return X + "/opentelemetry.proto.metrics.v1.NumberDataPoint"
            }, Z
          }(), G.HistogramDataPoint = function () {
            function Z(J) {
              if (this.attributes = [], this.bucketCounts = [], this.explicitBounds = [], this.exemplars = [], J) {
                for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                  if (J[X[I]] != null) this[X[I]] = J[X[I]]
              }
            }
            Z.prototype.attributes = hA.emptyArray, Z.prototype.startTimeUnixNano = null, Z.prototype.timeUnixNano = null, Z.prototype.count = null, Z.prototype.sum = null, Z.prototype.bucketCounts = hA.emptyArray, Z.prototype.explicitBounds = hA.emptyArray, Z.prototype.exemplars = hA.emptyArray, Z.prototype.flags = null, Z.prototype.min = null, Z.prototype.max = null;
            var Y;
            return Object.defineProperty(Z.prototype, "_sum", {
              get: hA.oneOfGetter(Y = ["sum"]),
              set: hA.oneOfSetter(Y)
            }), Object.defineProperty(Z.prototype, "_min", {
              get: hA.oneOfGetter(Y = ["min"]),
              set: hA.oneOfSetter(Y)
            }), Object.defineProperty(Z.prototype, "_max", {
              get: hA.oneOfGetter(Y = ["max"]),
              set: hA.oneOfSetter(Y)
            }), Z.create = function (X) {
              return new Z(X)
            }, Z.encode = function (X, I) {
              if (!I) I = L3.create();
              if (X.startTimeUnixNano != null && Object.hasOwnProperty.call(X, "startTimeUnixNano")) I.uint32(17).fixed64(X.startTimeUnixNano);
              if (X.timeUnixNano != null && Object.hasOwnProperty.call(X, "timeUnixNano")) I.uint32(25).fixed64(X.timeUnixNano);
              if (X.count != null && Object.hasOwnProperty.call(X, "count")) I.uint32(33).fixed64(X.count);
              if (X.sum != null && Object.hasOwnProperty.call(X, "sum")) I.uint32(41).double(X.sum);
              if (X.bucketCounts != null && X.bucketCounts.length) {
                I.uint32(50).fork();
                for (var D = 0; D < X.bucketCounts.length; ++D) I.fixed64(X.bucketCounts[D]);
                I.ldelim()
              }
              if (X.explicitBounds != null && X.explicitBounds.length) {
                I.uint32(58).fork();
                for (var D = 0; D < X.explicitBounds.length; ++D) I.double(X.explicitBounds[D]);
                I.ldelim()
              }
              if (X.exemplars != null && X.exemplars.length)
                for (var D = 0; D < X.exemplars.length; ++D) yA.opentelemetry.proto.metrics.v1.Exemplar.encode(X.exemplars[D], I.uint32(66).fork()).ldelim();
              if (X.attributes != null && X.attributes.length)
                for (var D = 0; D < X.attributes.length; ++D) yA.opentelemetry.proto.common.v1.KeyValue.encode(X.attributes[D], I.uint32(74).fork()).ldelim();
              if (X.flags != null && Object.hasOwnProperty.call(X, "flags")) I.uint32(80).uint32(X.flags);
              if (X.min != null && Object.hasOwnProperty.call(X, "min")) I.uint32(89).double(X.min);
              if (X.max != null && Object.hasOwnProperty.call(X, "max")) I.uint32(97).double(X.max);
              return I
            }, Z.encodeDelimited = function (X, I) {
              return this.encode(X, I).ldelim()
            }, Z.decode = function (X, I, D) {
              if (!(X instanceof K0)) X = K0.create(X);
              var W = I === void 0 ? X.len : X.pos + I,
                K = new yA.opentelemetry.proto.metrics.v1.HistogramDataPoint;
              while (X.pos < W) {
                var V = X.uint32();
                if (V === D) break;
                switch (V >>> 3) {
                  case 9: {
                    if (!(K.attributes && K.attributes.length)) K.attributes = [];
                    K.attributes.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(X, X.uint32()));
                    break
                  }
                  case 2: {
                    K.startTimeUnixNano = X.fixed64();
                    break
                  }
                  case 3: {
                    K.timeUnixNano = X.fixed64();
                    break
                  }
                  case 4: {
                    K.count = X.fixed64();
                    break
                  }
                  case 5: {
                    K.sum = X.double();
                    break
                  }
                  case 6: {
                    if (!(K.bucketCounts && K.bucketCounts.length)) K.bucketCounts = [];
                    if ((V & 7) === 2) {
                      var F = X.uint32() + X.pos;
                      while (X.pos < F) K.bucketCounts.push(X.fixed64())
                    } else K.bucketCounts.push(X.fixed64());
                    break
                  }
                  case 7: {
                    if (!(K.explicitBounds && K.explicitBounds.length)) K.explicitBounds = [];
                    if ((V & 7) === 2) {
                      var F = X.uint32() + X.pos;
                      while (X.pos < F) K.explicitBounds.push(X.double())
                    } else K.explicitBounds.push(X.double());
                    break
                  }
                  case 8: {
                    if (!(K.exemplars && K.exemplars.length)) K.exemplars = [];
                    K.exemplars.push(yA.opentelemetry.proto.metrics.v1.Exemplar.decode(X, X.uint32()));
                    break
                  }
                  case 10: {
                    K.flags = X.uint32();
                    break
                  }
                  case 11: {
                    K.min = X.double();
                    break
                  }
                  case 12: {
                    K.max = X.double();
                    break
                  }
                  default:
                    X.skipType(V & 7);
                    break
                }
              }
              return K
            }, Z.decodeDelimited = function (X) {
              if (!(X instanceof K0)) X = new K0(X);
              return this.decode(X, X.uint32())
            }, Z.verify = function (X) {
              if (typeof X !== "object" || X === null) return "object expected";
              var I = {};
              if (X.attributes != null && X.hasOwnProperty("attributes")) {
                if (!Array.isArray(X.attributes)) return "attributes: array expected";
                for (var D = 0; D < X.attributes.length; ++D) {
                  var W = yA.opentelemetry.proto.common.v1.KeyValue.verify(X.attributes[D]);
                  if (W) return "attributes." + W
                }
              }
              if (X.startTimeUnixNano != null && X.hasOwnProperty("startTimeUnixNano")) {
                if (!hA.isInteger(X.startTimeUnixNano) && !(X.startTimeUnixNano && hA.isInteger(X.startTimeUnixNano.low) && hA.isInteger(X.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
              }
              if (X.timeUnixNano != null && X.hasOwnProperty("timeUnixNano")) {
                if (!hA.isInteger(X.timeUnixNano) && !(X.timeUnixNano && hA.isInteger(X.timeUnixNano.low) && hA.isInteger(X.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (X.count != null && X.hasOwnProperty("count")) {
                if (!hA.isInteger(X.count) && !(X.count && hA.isInteger(X.count.low) && hA.isInteger(X.count.high))) return "count: integer|Long expected"
              }
              if (X.sum != null && X.hasOwnProperty("sum")) {
                if (I._sum = 1, typeof X.sum !== "number") return "sum: number expected"
              }
              if (X.bucketCounts != null && X.hasOwnProperty("bucketCounts")) {
                if (!Array.isArray(X.bucketCounts)) return "bucketCounts: array expected";
                for (var D = 0; D < X.bucketCounts.length; ++D)
                  if (!hA.isInteger(X.bucketCounts[D]) && !(X.bucketCounts[D] && hA.isInteger(X.bucketCounts[D].low) && hA.isInteger(X.bucketCounts[D].high))) return "bucketCounts: integer|Long[] expected"
              }
              if (X.explicitBounds != null && X.hasOwnProperty("explicitBounds")) {
                if (!Array.isArray(X.explicitBounds)) return "explicitBounds: array expected";
                for (var D = 0; D < X.explicitBounds.length; ++D)
                  if (typeof X.explicitBounds[D] !== "number") return "explicitBounds: number[] expected"
              }
              if (X.exemplars != null && X.hasOwnProperty("exemplars")) {
                if (!Array.isArray(X.exemplars)) return "exemplars: array expected";
                for (var D = 0; D < X.exemplars.length; ++D) {
                  var W = yA.opentelemetry.proto.metrics.v1.Exemplar.verify(X.exemplars[D]);
                  if (W) return "exemplars." + W
                }
              }
              if (X.flags != null && X.hasOwnProperty("flags")) {
                if (!hA.isInteger(X.flags)) return "flags: integer expected"
              }
              if (X.min != null && X.hasOwnProperty("min")) {
                if (I._min = 1, typeof X.min !== "number") return "min: number expected"
              }
              if (X.max != null && X.hasOwnProperty("max")) {
                if (I._max = 1, typeof X.max !== "number") return "max: number expected"
              }
              return null
            }, Z.fromObject = function (X) {
              if (X instanceof yA.opentelemetry.proto.metrics.v1.HistogramDataPoint) return X;
              var I = new yA.opentelemetry.proto.metrics.v1.HistogramDataPoint;
              if (X.attributes) {
                if (!Array.isArray(X.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: array expected");
                I.attributes = [];
                for (var D = 0; D < X.attributes.length; ++D) {
                  if (typeof X.attributes[D] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: object expected");
                  I.attributes[D] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(X.attributes[D])
                }
              }
              if (X.startTimeUnixNano != null) {
                if (hA.Long)(I.startTimeUnixNano = hA.Long.fromValue(X.startTimeUnixNano)).unsigned = !1;
                else if (typeof X.startTimeUnixNano === "string") I.startTimeUnixNano = parseInt(X.startTimeUnixNano, 10);
                else if (typeof X.startTimeUnixNano === "number") I.startTimeUnixNano = X.startTimeUnixNano;
                else if (typeof X.startTimeUnixNano === "object") I.startTimeUnixNano = new hA.LongBits(X.startTimeUnixNano.low >>> 0, X.startTimeUnixNano.high >>> 0).toNumber()
              }
              if (X.timeUnixNano != null) {
                if (hA.Long)(I.timeUnixNano = hA.Long.fromValue(X.timeUnixNano)).unsigned = !1;
                else if (typeof X.timeUnixNano === "string") I.timeUnixNano = parseInt(X.timeUnixNano, 10);
                else if (typeof X.timeUnixNano === "number") I.timeUnixNano = X.timeUnixNano;
                else if (typeof X.timeUnixNano === "object") I.timeUnixNano = new hA.LongBits(X.timeUnixNano.low >>> 0, X.timeUnixNano.high >>> 0).toNumber()
              }
              if (X.count != null) {
                if (hA.Long)(I.count = hA.Long.fromValue(X.count)).unsigned = !1;
                else if (typeof X.count === "string") I.count = parseInt(X.count, 10);
                else if (typeof X.count === "number") I.count = X.count;
                else if (typeof X.count === "object") I.count = new hA.LongBits(X.count.low >>> 0, X.count.high >>> 0).toNumber()
              }
              if (X.sum != null) I.sum = Number(X.sum);
              if (X.bucketCounts) {
                if (!Array.isArray(X.bucketCounts)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.bucketCounts: array expected");
                I.bucketCounts = [];
                for (var D = 0; D < X.bucketCounts.length; ++D)
                  if (hA.Long)(I.bucketCounts[D] = hA.Long.fromValue(X.bucketCounts[D])).unsigned = !1;
                  else if (typeof X.bucketCounts[D] === "string") I.bucketCounts[D] = parseInt(X.bucketCounts[D], 10);
                else if (typeof X.bucketCounts[D] === "number") I.bucketCounts[D] = X.bucketCounts[D];
                else if (typeof X.bucketCounts[D] === "object") I.bucketCounts[D] = new hA.LongBits(X.bucketCounts[D].low >>> 0, X.bucketCounts[D].high >>> 0).toNumber()
              }
              if (X.explicitBounds) {
                if (!Array.isArray(X.explicitBounds)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.explicitBounds: array expected");
                I.explicitBounds = [];
                for (var D = 0; D < X.explicitBounds.length; ++D) I.explicitBounds[D] = Number(X.explicitBounds[D])
              }
              if (X.exemplars) {
                if (!Array.isArray(X.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: array expected");
                I.exemplars = [];
                for (var D = 0; D < X.exemplars.length; ++D) {
                  if (typeof X.exemplars[D] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: object expected");
                  I.exemplars[D] = yA.opentelemetry.proto.metrics.v1.Exemplar.fromObject(X.exemplars[D])
                }
              }
              if (X.flags != null) I.flags = X.flags >>> 0;
              if (X.min != null) I.min = Number(X.min);
              if (X.max != null) I.max = Number(X.max);
              return I
            }, Z.toObject = function (X, I) {
              if (!I) I = {};
              var D = {};
              if (I.arrays || I.defaults) D.bucketCounts = [], D.explicitBounds = [], D.exemplars = [], D.attributes = [];
              if (I.defaults) {
                if (hA.Long) {
                  var W = new hA.Long(0, 0, !1);
                  D.startTimeUnixNano = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                } else D.startTimeUnixNano = I.longs === String ? "0" : 0;
                if (hA.Long) {
                  var W = new hA.Long(0, 0, !1);
                  D.timeUnixNano = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                } else D.timeUnixNano = I.longs === String ? "0" : 0;
                if (hA.Long) {
                  var W = new hA.Long(0, 0, !1);
                  D.count = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                } else D.count = I.longs === String ? "0" : 0;
                D.flags = 0
              }
              if (X.startTimeUnixNano != null && X.hasOwnProperty("startTimeUnixNano"))
                if (typeof X.startTimeUnixNano === "number") D.startTimeUnixNano = I.longs === String ? String(X.startTimeUnixNano) : X.startTimeUnixNano;
                else D.startTimeUnixNano = I.longs === String ? hA.Long.prototype.toString.call(X.startTimeUnixNano) : I.longs === Number ? new hA.LongBits(X.startTimeUnixNano.low >>> 0, X.startTimeUnixNano.high >>> 0).toNumber() : X.startTimeUnixNano;
              if (X.timeUnixNano != null && X.hasOwnProperty("timeUnixNano"))
                if (typeof X.timeUnixNano === "number") D.timeUnixNano = I.longs === String ? String(X.timeUnixNano) : X.timeUnixNano;
                else D.timeUnixNano = I.longs === String ? hA.Long.prototype.toString.call(X.timeUnixNano) : I.longs === Number ? new hA.LongBits(X.timeUnixNano.low >>> 0, X.timeUnixNano.high >>> 0).toNumber() : X.timeUnixNano;
              if (X.count != null && X.hasOwnProperty("count"))
                if (typeof X.count === "number") D.count = I.longs === String ? String(X.count) : X.count;
                else D.count = I.longs === String ? hA.Long.prototype.toString.call(X.count) : I.longs === Number ? new hA.LongBits(X.count.low >>> 0, X.count.high >>> 0).toNumber() : X.count;
              if (X.sum != null && X.hasOwnProperty("sum")) {
                if (D.sum = I.json && !isFinite(X.sum) ? String(X.sum) : X.sum, I.oneofs) D._sum = "sum"
              }
              if (X.bucketCounts && X.bucketCounts.length) {
                D.bucketCounts = [];
                for (var K = 0; K < X.bucketCounts.length; ++K)
                  if (typeof X.bucketCounts[K] === "number") D.bucketCounts[K] = I.longs === String ? String(X.bucketCounts[K]) : X.bucketCounts[K];
                  else D.bucketCounts[K] = I.longs === String ? hA.Long.prototype.toString.call(X.bucketCounts[K]) : I.longs === Number ? new hA.LongBits(X.bucketCounts[K].low >>> 0, X.bucketCounts[K].high >>> 0).toNumber() : X.bucketCounts[K]
              }
              if (X.explicitBounds && X.explicitBounds.length) {
                D.explicitBounds = [];
                for (var K = 0; K < X.explicitBounds.length; ++K) D.explicitBounds[K] = I.json && !isFinite(X.explicitBounds[K]) ? String(X.explicitBounds[K]) : X.explicitBounds[K]
              }
              if (X.exemplars && X.exemplars.length) {
                D.exemplars = [];
                for (var K = 0; K < X.exemplars.length; ++K) D.exemplars[K] = yA.opentelemetry.proto.metrics.v1.Exemplar.toObject(X.exemplars[K], I)
              }
              if (X.attributes && X.attributes.length) {
                D.attributes = [];
                for (var K = 0; K < X.attributes.length; ++K) D.attributes[K] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(X.attributes[K], I)
              }
              if (X.flags != null && X.hasOwnProperty("flags")) D.flags = X.flags;
              if (X.min != null && X.hasOwnProperty("min")) {
                if (D.min = I.json && !isFinite(X.min) ? String(X.min) : X.min, I.oneofs) D._min = "min"
              }
              if (X.max != null && X.hasOwnProperty("max")) {
                if (D.max = I.json && !isFinite(X.max) ? String(X.max) : X.max, I.oneofs) D._max = "max"
              }
              return D
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (X) {
              if (X === void 0) X = "type.googleapis.com";
              return X + "/opentelemetry.proto.metrics.v1.HistogramDataPoint"
            }, Z
          }(), G.ExponentialHistogramDataPoint = function () {
            function Z(J) {
              if (this.attributes = [], this.exemplars = [], J) {
                for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                  if (J[X[I]] != null) this[X[I]] = J[X[I]]
              }
            }
            Z.prototype.attributes = hA.emptyArray, Z.prototype.startTimeUnixNano = null, Z.prototype.timeUnixNano = null, Z.prototype.count = null, Z.prototype.sum = null, Z.prototype.scale = null, Z.prototype.zeroCount = null, Z.prototype.positive = null, Z.prototype.negative = null, Z.prototype.flags = null, Z.prototype.exemplars = hA.emptyArray, Z.prototype.min = null, Z.prototype.max = null, Z.prototype.zeroThreshold = null;
            var Y;
            return Object.defineProperty(Z.prototype, "_sum", {
              get: hA.oneOfGetter(Y = ["sum"]),
              set: hA.oneOfSetter(Y)
            }), Object.defineProperty(Z.prototype, "_min", {
              get: hA.oneOfGetter(Y = ["min"]),
              set: hA.oneOfSetter(Y)
            }), Object.defineProperty(Z.prototype, "_max", {
              get: hA.oneOfGetter(Y = ["max"]),
              set: hA.oneOfSetter(Y)
            }), Z.create = function (X) {
              return new Z(X)
            }, Z.encode = function (X, I) {
              if (!I) I = L3.create();
              if (X.attributes != null && X.attributes.length)
                for (var D = 0; D < X.attributes.length; ++D) yA.opentelemetry.proto.common.v1.KeyValue.encode(X.attributes[D], I.uint32(10).fork()).ldelim();
              if (X.startTimeUnixNano != null && Object.hasOwnProperty.call(X, "startTimeUnixNano")) I.uint32(17).fixed64(X.startTimeUnixNano);
              if (X.timeUnixNano != null && Object.hasOwnProperty.call(X, "timeUnixNano")) I.uint32(25).fixed64(X.timeUnixNano);
              if (X.count != null && Object.hasOwnProperty.call(X, "count")) I.uint32(33).fixed64(X.count);
              if (X.sum != null && Object.hasOwnProperty.call(X, "sum")) I.uint32(41).double(X.sum);
              if (X.scale != null && Object.hasOwnProperty.call(X, "scale")) I.uint32(48).sint32(X.scale);
              if (X.zeroCount != null && Object.hasOwnProperty.call(X, "zeroCount")) I.uint32(57).fixed64(X.zeroCount);
              if (X.positive != null && Object.hasOwnProperty.call(X, "positive")) yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode(X.positive, I.uint32(66).fork()).ldelim();
              if (X.negative != null && Object.hasOwnProperty.call(X, "negative")) yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode(X.negative, I.uint32(74).fork()).ldelim();
              if (X.flags != null && Object.hasOwnProperty.call(X, "flags")) I.uint32(80).uint32(X.flags);
              if (X.exemplars != null && X.exemplars.length)
                for (var D = 0; D < X.exemplars.length; ++D) yA.opentelemetry.proto.metrics.v1.Exemplar.encode(X.exemplars[D], I.uint32(90).fork()).ldelim();
              if (X.min != null && Object.hasOwnProperty.call(X, "min")) I.uint32(97).double(X.min);
              if (X.max != null && Object.hasOwnProperty.call(X, "max")) I.uint32(105).double(X.max);
              if (X.zeroThreshold != null && Object.hasOwnProperty.call(X, "zeroThreshold")) I.uint32(113).double(X.zeroThreshold);
              return I
            }, Z.encodeDelimited = function (X, I) {
              return this.encode(X, I).ldelim()
            }, Z.decode = function (X, I, D) {
              if (!(X instanceof K0)) X = K0.create(X);
              var W = I === void 0 ? X.len : X.pos + I,
                K = new yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;
              while (X.pos < W) {
                var V = X.uint32();
                if (V === D) break;
                switch (V >>> 3) {
                  case 1: {
                    if (!(K.attributes && K.attributes.length)) K.attributes = [];
                    K.attributes.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(X, X.uint32()));
                    break
                  }
                  case 2: {
                    K.startTimeUnixNano = X.fixed64();
                    break
                  }
                  case 3: {
                    K.timeUnixNano = X.fixed64();
                    break
                  }
                  case 4: {
                    K.count = X.fixed64();
                    break
                  }
                  case 5: {
                    K.sum = X.double();
                    break
                  }
                  case 6: {
                    K.scale = X.sint32();
                    break
                  }
                  case 7: {
                    K.zeroCount = X.fixed64();
                    break
                  }
                  case 8: {
                    K.positive = yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(X, X.uint32());
                    break
                  }
                  case 9: {
                    K.negative = yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(X, X.uint32());
                    break
                  }
                  case 10: {
                    K.flags = X.uint32();
                    break
                  }
                  case 11: {
                    if (!(K.exemplars && K.exemplars.length)) K.exemplars = [];
                    K.exemplars.push(yA.opentelemetry.proto.metrics.v1.Exemplar.decode(X, X.uint32()));
                    break
                  }
                  case 12: {
                    K.min = X.double();
                    break
                  }
                  case 13: {
                    K.max = X.double();
                    break
                  }
                  case 14: {
                    K.zeroThreshold = X.double();
                    break
                  }
                  default:
                    X.skipType(V & 7);
                    break
                }
              }
              return K
            }, Z.decodeDelimited = function (X) {
              if (!(X instanceof K0)) X = new K0(X);
              return this.decode(X, X.uint32())
            }, Z.verify = function (X) {
              if (typeof X !== "object" || X === null) return "object expected";
              var I = {};
              if (X.attributes != null && X.hasOwnProperty("attributes")) {
                if (!Array.isArray(X.attributes)) return "attributes: array expected";
                for (var D = 0; D < X.attributes.length; ++D) {
                  var W = yA.opentelemetry.proto.common.v1.KeyValue.verify(X.attributes[D]);
                  if (W) return "attributes." + W
                }
              }
              if (X.startTimeUnixNano != null && X.hasOwnProperty("startTimeUnixNano")) {
                if (!hA.isInteger(X.startTimeUnixNano) && !(X.startTimeUnixNano && hA.isInteger(X.startTimeUnixNano.low) && hA.isInteger(X.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
              }
              if (X.timeUnixNano != null && X.hasOwnProperty("timeUnixNano")) {
                if (!hA.isInteger(X.timeUnixNano) && !(X.timeUnixNano && hA.isInteger(X.timeUnixNano.low) && hA.isInteger(X.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (X.count != null && X.hasOwnProperty("count")) {
                if (!hA.isInteger(X.count) && !(X.count && hA.isInteger(X.count.low) && hA.isInteger(X.count.high))) return "count: integer|Long expected"
              }
              if (X.sum != null && X.hasOwnProperty("sum")) {
                if (I._sum = 1, typeof X.sum !== "number") return "sum: number expected"
              }
              if (X.scale != null && X.hasOwnProperty("scale")) {
                if (!hA.isInteger(X.scale)) return "scale: integer expected"
              }
              if (X.zeroCount != null && X.hasOwnProperty("zeroCount")) {
                if (!hA.isInteger(X.zeroCount) && !(X.zeroCount && hA.isInteger(X.zeroCount.low) && hA.isInteger(X.zeroCount.high))) return "zeroCount: integer|Long expected"
              }
              if (X.positive != null && X.hasOwnProperty("positive")) {
                var W = yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify(X.positive);
                if (W) return "positive." + W
              }
              if (X.negative != null && X.hasOwnProperty("negative")) {
                var W = yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify(X.negative);
                if (W) return "negative." + W
              }
              if (X.flags != null && X.hasOwnProperty("flags")) {
                if (!hA.isInteger(X.flags)) return "flags: integer expected"
              }
              if (X.exemplars != null && X.hasOwnProperty("exemplars")) {
                if (!Array.isArray(X.exemplars)) return "exemplars: array expected";
                for (var D = 0; D < X.exemplars.length; ++D) {
                  var W = yA.opentelemetry.proto.metrics.v1.Exemplar.verify(X.exemplars[D]);
                  if (W) return "exemplars." + W
                }
              }
              if (X.min != null && X.hasOwnProperty("min")) {
                if (I._min = 1, typeof X.min !== "number") return "min: number expected"
              }
              if (X.max != null && X.hasOwnProperty("max")) {
                if (I._max = 1, typeof X.max !== "number") return "max: number expected"
              }
              if (X.zeroThreshold != null && X.hasOwnProperty("zeroThreshold")) {
                if (typeof X.zeroThreshold !== "number") return "zeroThreshold: number expected"
              }
              return null
            }, Z.fromObject = function (X) {
              if (X instanceof yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint) return X;
              var I = new yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;
              if (X.attributes) {
                if (!Array.isArray(X.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: array expected");
                I.attributes = [];
                for (var D = 0; D < X.attributes.length; ++D) {
                  if (typeof X.attributes[D] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: object expected");
                  I.attributes[D] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(X.attributes[D])
                }
              }
              if (X.startTimeUnixNano != null) {
                if (hA.Long)(I.startTimeUnixNano = hA.Long.fromValue(X.startTimeUnixNano)).unsigned = !1;
                else if (typeof X.startTimeUnixNano === "string") I.startTimeUnixNano = parseInt(X.startTimeUnixNano, 10);
                else if (typeof X.startTimeUnixNano === "number") I.startTimeUnixNano = X.startTimeUnixNano;
                else if (typeof X.startTimeUnixNano === "object") I.startTimeUnixNano = new hA.LongBits(X.startTimeUnixNano.low >>> 0, X.startTimeUnixNano.high >>> 0).toNumber()
              }
              if (X.timeUnixNano != null) {
                if (hA.Long)(I.timeUnixNano = hA.Long.fromValue(X.timeUnixNano)).unsigned = !1;
                else if (typeof X.timeUnixNano === "string") I.timeUnixNano = parseInt(X.timeUnixNano, 10);
                else if (typeof X.timeUnixNano === "number") I.timeUnixNano = X.timeUnixNano;
                else if (typeof X.timeUnixNano === "object") I.timeUnixNano = new hA.LongBits(X.timeUnixNano.low >>> 0, X.timeUnixNano.high >>> 0).toNumber()
              }
              if (X.count != null) {
                if (hA.Long)(I.count = hA.Long.fromValue(X.count)).unsigned = !1;
                else if (typeof X.count === "string") I.count = parseInt(X.count, 10);
                else if (typeof X.count === "number") I.count = X.count;
                else if (typeof X.count === "object") I.count = new hA.LongBits(X.count.low >>> 0, X.count.high >>> 0).toNumber()
              }
              if (X.sum != null) I.sum = Number(X.sum);
              if (X.scale != null) I.scale = X.scale | 0;
              if (X.zeroCount != null) {
                if (hA.Long)(I.zeroCount = hA.Long.fromValue(X.zeroCount)).unsigned = !1;
                else if (typeof X.zeroCount === "string") I.zeroCount = parseInt(X.zeroCount, 10);
                else if (typeof X.zeroCount === "number") I.zeroCount = X.zeroCount;
                else if (typeof X.zeroCount === "object") I.zeroCount = new hA.LongBits(X.zeroCount.low >>> 0, X.zeroCount.high >>> 0).toNumber()
              }
              if (X.positive != null) {
                if (typeof X.positive !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.positive: object expected");
                I.positive = yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(X.positive)
              }
              if (X.negative != null) {
                if (typeof X.negative !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.negative: object expected");
                I.negative = yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(X.negative)
              }
              if (X.flags != null) I.flags = X.flags >>> 0;
              if (X.exemplars) {
                if (!Array.isArray(X.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: array expected");
                I.exemplars = [];
                for (var D = 0; D < X.exemplars.length; ++D) {
                  if (typeof X.exemplars[D] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: object expected");
                  I.exemplars[D] = yA.opentelemetry.proto.metrics.v1.Exemplar.fromObject(X.exemplars[D])
                }
              }
              if (X.min != null) I.min = Number(X.min);
              if (X.max != null) I.max = Number(X.max);
              if (X.zeroThreshold != null) I.zeroThreshold = Number(X.zeroThreshold);
              return I
            }, Z.toObject = function (X, I) {
              if (!I) I = {};
              var D = {};
              if (I.arrays || I.defaults) D.attributes = [], D.exemplars = [];
              if (I.defaults) {
                if (hA.Long) {
                  var W = new hA.Long(0, 0, !1);
                  D.startTimeUnixNano = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                } else D.startTimeUnixNano = I.longs === String ? "0" : 0;
                if (hA.Long) {
                  var W = new hA.Long(0, 0, !1);
                  D.timeUnixNano = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                } else D.timeUnixNano = I.longs === String ? "0" : 0;
                if (hA.Long) {
                  var W = new hA.Long(0, 0, !1);
                  D.count = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                } else D.count = I.longs === String ? "0" : 0;
                if (D.scale = 0, hA.Long) {
                  var W = new hA.Long(0, 0, !1);
                  D.zeroCount = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                } else D.zeroCount = I.longs === String ? "0" : 0;
                D.positive = null, D.negative = null, D.flags = 0, D.zeroThreshold = 0
              }
              if (X.attributes && X.attributes.length) {
                D.attributes = [];
                for (var K = 0; K < X.attributes.length; ++K) D.attributes[K] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(X.attributes[K], I)
              }
              if (X.startTimeUnixNano != null && X.hasOwnProperty("startTimeUnixNano"))
                if (typeof X.startTimeUnixNano === "number") D.startTimeUnixNano = I.longs === String ? String(X.startTimeUnixNano) : X.startTimeUnixNano;
                else D.startTimeUnixNano = I.longs === String ? hA.Long.prototype.toString.call(X.startTimeUnixNano) : I.longs === Number ? new hA.LongBits(X.startTimeUnixNano.low >>> 0, X.startTimeUnixNano.high >>> 0).toNumber() : X.startTimeUnixNano;
              if (X.timeUnixNano != null && X.hasOwnProperty("timeUnixNano"))
                if (typeof X.timeUnixNano === "number") D.timeUnixNano = I.longs === String ? String(X.timeUnixNano) : X.timeUnixNano;
                else D.timeUnixNano = I.longs === String ? hA.Long.prototype.toString.call(X.timeUnixNano) : I.longs === Number ? new hA.LongBits(X.timeUnixNano.low >>> 0, X.timeUnixNano.high >>> 0).toNumber() : X.timeUnixNano;
              if (X.count != null && X.hasOwnProperty("count"))
                if (typeof X.count === "number") D.count = I.longs === String ? String(X.count) : X.count;
                else D.count = I.longs === String ? hA.Long.prototype.toString.call(X.count) : I.longs === Number ? new hA.LongBits(X.count.low >>> 0, X.count.high >>> 0).toNumber() : X.count;
              if (X.sum != null && X.hasOwnProperty("sum")) {
                if (D.sum = I.json && !isFinite(X.sum) ? String(X.sum) : X.sum, I.oneofs) D._sum = "sum"
              }
              if (X.scale != null && X.hasOwnProperty("scale")) D.scale = X.scale;
              if (X.zeroCount != null && X.hasOwnProperty("zeroCount"))
                if (typeof X.zeroCount === "number") D.zeroCount = I.longs === String ? String(X.zeroCount) : X.zeroCount;
                else D.zeroCount = I.longs === String ? hA.Long.prototype.toString.call(X.zeroCount) : I.longs === Number ? new hA.LongBits(X.zeroCount.low >>> 0, X.zeroCount.high >>> 0).toNumber() : X.zeroCount;
              if (X.positive != null && X.hasOwnProperty("positive")) D.positive = yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(X.positive, I);
              if (X.negative != null && X.hasOwnProperty("negative")) D.negative = yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(X.negative, I);
              if (X.flags != null && X.hasOwnProperty("flags")) D.flags = X.flags;
              if (X.exemplars && X.exemplars.length) {
                D.exemplars = [];
                for (var K = 0; K < X.exemplars.length; ++K) D.exemplars[K] = yA.opentelemetry.proto.metrics.v1.Exemplar.toObject(X.exemplars[K], I)
              }
              if (X.min != null && X.hasOwnProperty("min")) {
                if (D.min = I.json && !isFinite(X.min) ? String(X.min) : X.min, I.oneofs) D._min = "min"
              }
              if (X.max != null && X.hasOwnProperty("max")) {
                if (D.max = I.json && !isFinite(X.max) ? String(X.max) : X.max, I.oneofs) D._max = "max"
              }
              if (X.zeroThreshold != null && X.hasOwnProperty("zeroThreshold")) D.zeroThreshold = I.json && !isFinite(X.zeroThreshold) ? String(X.zeroThreshold) : X.zeroThreshold;
              return D
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (X) {
              if (X === void 0) X = "type.googleapis.com";
              return X + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint"
            }, Z.Buckets = function () {
              function J(X) {
                if (this.bucketCounts = [], X) {
                  for (var I = Object.keys(X), D = 0; D < I.length; ++D)
                    if (X[I[D]] != null) this[I[D]] = X[I[D]]
                }
              }
              return J.prototype.offset = null, J.prototype.bucketCounts = hA.emptyArray, J.create = function (I) {
                return new J(I)
              }, J.encode = function (I, D) {
                if (!D) D = L3.create();
                if (I.offset != null && Object.hasOwnProperty.call(I, "offset")) D.uint32(8).sint32(I.offset);
                if (I.bucketCounts != null && I.bucketCounts.length) {
                  D.uint32(18).fork();
                  for (var W = 0; W < I.bucketCounts.length; ++W) D.uint64(I.bucketCounts[W]);
                  D.ldelim()
                }
                return D
              }, J.encodeDelimited = function (I, D) {
                return this.encode(I, D).ldelim()
              }, J.decode = function (I, D, W) {
                if (!(I instanceof K0)) I = K0.create(I);
                var K = D === void 0 ? I.len : I.pos + D,
                  V = new yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;
                while (I.pos < K) {
                  var F = I.uint32();
                  if (F === W) break;
                  switch (F >>> 3) {
                    case 1: {
                      V.offset = I.sint32();
                      break
                    }
                    case 2: {
                      if (!(V.bucketCounts && V.bucketCounts.length)) V.bucketCounts = [];
                      if ((F & 7) === 2) {
                        var H = I.uint32() + I.pos;
                        while (I.pos < H) V.bucketCounts.push(I.uint64())
                      } else V.bucketCounts.push(I.uint64());
                      break
                    }
                    default:
                      I.skipType(F & 7);
                      break
                  }
                }
                return V
              }, J.decodeDelimited = function (I) {
                if (!(I instanceof K0)) I = new K0(I);
                return this.decode(I, I.uint32())
              }, J.verify = function (I) {
                if (typeof I !== "object" || I === null) return "object expected";
                if (I.offset != null && I.hasOwnProperty("offset")) {
                  if (!hA.isInteger(I.offset)) return "offset: integer expected"
                }
                if (I.bucketCounts != null && I.hasOwnProperty("bucketCounts")) {
                  if (!Array.isArray(I.bucketCounts)) return "bucketCounts: array expected";
                  for (var D = 0; D < I.bucketCounts.length; ++D)
                    if (!hA.isInteger(I.bucketCounts[D]) && !(I.bucketCounts[D] && hA.isInteger(I.bucketCounts[D].low) && hA.isInteger(I.bucketCounts[D].high))) return "bucketCounts: integer|Long[] expected"
                }
                return null
              }, J.fromObject = function (I) {
                if (I instanceof yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets) return I;
                var D = new yA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;
                if (I.offset != null) D.offset = I.offset | 0;
                if (I.bucketCounts) {
                  if (!Array.isArray(I.bucketCounts)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.bucketCounts: array expected");
                  D.bucketCounts = [];
                  for (var W = 0; W < I.bucketCounts.length; ++W)
                    if (hA.Long)(D.bucketCounts[W] = hA.Long.fromValue(I.bucketCounts[W])).unsigned = !0;
                    else if (typeof I.bucketCounts[W] === "string") D.bucketCounts[W] = parseInt(I.bucketCounts[W], 10);
                  else if (typeof I.bucketCounts[W] === "number") D.bucketCounts[W] = I.bucketCounts[W];
                  else if (typeof I.bucketCounts[W] === "object") D.bucketCounts[W] = new hA.LongBits(I.bucketCounts[W].low >>> 0, I.bucketCounts[W].high >>> 0).toNumber(!0)
                }
                return D
              }, J.toObject = function (I, D) {
                if (!D) D = {};
                var W = {};
                if (D.arrays || D.defaults) W.bucketCounts = [];
                if (D.defaults) W.offset = 0;
                if (I.offset != null && I.hasOwnProperty("offset")) W.offset = I.offset;
                if (I.bucketCounts && I.bucketCounts.length) {
                  W.bucketCounts = [];
                  for (var K = 0; K < I.bucketCounts.length; ++K)
                    if (typeof I.bucketCounts[K] === "number") W.bucketCounts[K] = D.longs === String ? String(I.bucketCounts[K]) : I.bucketCounts[K];
                    else W.bucketCounts[K] = D.longs === String ? hA.Long.prototype.toString.call(I.bucketCounts[K]) : D.longs === Number ? new hA.LongBits(I.bucketCounts[K].low >>> 0, I.bucketCounts[K].high >>> 0).toNumber(!0) : I.bucketCounts[K]
                }
                return W
              }, J.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, J.getTypeUrl = function (I) {
                if (I === void 0) I = "type.googleapis.com";
                return I + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets"
              }, J
            }(), Z
          }(), G.SummaryDataPoint = function () {
            function Z(Y) {
              if (this.attributes = [], this.quantileValues = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.attributes = hA.emptyArray, Z.prototype.startTimeUnixNano = null, Z.prototype.timeUnixNano = null, Z.prototype.count = null, Z.prototype.sum = null, Z.prototype.quantileValues = hA.emptyArray, Z.prototype.flags = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.startTimeUnixNano != null && Object.hasOwnProperty.call(J, "startTimeUnixNano")) X.uint32(17).fixed64(J.startTimeUnixNano);
              if (J.timeUnixNano != null && Object.hasOwnProperty.call(J, "timeUnixNano")) X.uint32(25).fixed64(J.timeUnixNano);
              if (J.count != null && Object.hasOwnProperty.call(J, "count")) X.uint32(33).fixed64(J.count);
              if (J.sum != null && Object.hasOwnProperty.call(J, "sum")) X.uint32(41).double(J.sum);
              if (J.quantileValues != null && J.quantileValues.length)
                for (var I = 0; I < J.quantileValues.length; ++I) yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.encode(J.quantileValues[I], X.uint32(50).fork()).ldelim();
              if (J.attributes != null && J.attributes.length)
                for (var I = 0; I < J.attributes.length; ++I) yA.opentelemetry.proto.common.v1.KeyValue.encode(J.attributes[I], X.uint32(58).fork()).ldelim();
              if (J.flags != null && Object.hasOwnProperty.call(J, "flags")) X.uint32(64).uint32(J.flags);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.metrics.v1.SummaryDataPoint;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 7: {
                    if (!(W.attributes && W.attributes.length)) W.attributes = [];
                    W.attributes.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                    break
                  }
                  case 2: {
                    W.startTimeUnixNano = J.fixed64();
                    break
                  }
                  case 3: {
                    W.timeUnixNano = J.fixed64();
                    break
                  }
                  case 4: {
                    W.count = J.fixed64();
                    break
                  }
                  case 5: {
                    W.sum = J.double();
                    break
                  }
                  case 6: {
                    if (!(W.quantileValues && W.quantileValues.length)) W.quantileValues = [];
                    W.quantileValues.push(yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.decode(J, J.uint32()));
                    break
                  }
                  case 8: {
                    W.flags = J.uint32();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.attributes != null && J.hasOwnProperty("attributes")) {
                if (!Array.isArray(J.attributes)) return "attributes: array expected";
                for (var X = 0; X < J.attributes.length; ++X) {
                  var I = yA.opentelemetry.proto.common.v1.KeyValue.verify(J.attributes[X]);
                  if (I) return "attributes." + I
                }
              }
              if (J.startTimeUnixNano != null && J.hasOwnProperty("startTimeUnixNano")) {
                if (!hA.isInteger(J.startTimeUnixNano) && !(J.startTimeUnixNano && hA.isInteger(J.startTimeUnixNano.low) && hA.isInteger(J.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
              }
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano")) {
                if (!hA.isInteger(J.timeUnixNano) && !(J.timeUnixNano && hA.isInteger(J.timeUnixNano.low) && hA.isInteger(J.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (J.count != null && J.hasOwnProperty("count")) {
                if (!hA.isInteger(J.count) && !(J.count && hA.isInteger(J.count.low) && hA.isInteger(J.count.high))) return "count: integer|Long expected"
              }
              if (J.sum != null && J.hasOwnProperty("sum")) {
                if (typeof J.sum !== "number") return "sum: number expected"
              }
              if (J.quantileValues != null && J.hasOwnProperty("quantileValues")) {
                if (!Array.isArray(J.quantileValues)) return "quantileValues: array expected";
                for (var X = 0; X < J.quantileValues.length; ++X) {
                  var I = yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.verify(J.quantileValues[X]);
                  if (I) return "quantileValues." + I
                }
              }
              if (J.flags != null && J.hasOwnProperty("flags")) {
                if (!hA.isInteger(J.flags)) return "flags: integer expected"
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.metrics.v1.SummaryDataPoint) return J;
              var X = new yA.opentelemetry.proto.metrics.v1.SummaryDataPoint;
              if (J.attributes) {
                if (!Array.isArray(J.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: array expected");
                X.attributes = [];
                for (var I = 0; I < J.attributes.length; ++I) {
                  if (typeof J.attributes[I] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: object expected");
                  X.attributes[I] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.attributes[I])
                }
              }
              if (J.startTimeUnixNano != null) {
                if (hA.Long)(X.startTimeUnixNano = hA.Long.fromValue(J.startTimeUnixNano)).unsigned = !1;
                else if (typeof J.startTimeUnixNano === "string") X.startTimeUnixNano = parseInt(J.startTimeUnixNano, 10);
                else if (typeof J.startTimeUnixNano === "number") X.startTimeUnixNano = J.startTimeUnixNano;
                else if (typeof J.startTimeUnixNano === "object") X.startTimeUnixNano = new hA.LongBits(J.startTimeUnixNano.low >>> 0, J.startTimeUnixNano.high >>> 0).toNumber()
              }
              if (J.timeUnixNano != null) {
                if (hA.Long)(X.timeUnixNano = hA.Long.fromValue(J.timeUnixNano)).unsigned = !1;
                else if (typeof J.timeUnixNano === "string") X.timeUnixNano = parseInt(J.timeUnixNano, 10);
                else if (typeof J.timeUnixNano === "number") X.timeUnixNano = J.timeUnixNano;
                else if (typeof J.timeUnixNano === "object") X.timeUnixNano = new hA.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber()
              }
              if (J.count != null) {
                if (hA.Long)(X.count = hA.Long.fromValue(J.count)).unsigned = !1;
                else if (typeof J.count === "string") X.count = parseInt(J.count, 10);
                else if (typeof J.count === "number") X.count = J.count;
                else if (typeof J.count === "object") X.count = new hA.LongBits(J.count.low >>> 0, J.count.high >>> 0).toNumber()
              }
              if (J.sum != null) X.sum = Number(J.sum);
              if (J.quantileValues) {
                if (!Array.isArray(J.quantileValues)) throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: array expected");
                X.quantileValues = [];
                for (var I = 0; I < J.quantileValues.length; ++I) {
                  if (typeof J.quantileValues[I] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: object expected");
                  X.quantileValues[I] = yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.fromObject(J.quantileValues[I])
                }
              }
              if (J.flags != null) X.flags = J.flags >>> 0;
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.quantileValues = [], I.attributes = [];
              if (X.defaults) {
                if (hA.Long) {
                  var D = new hA.Long(0, 0, !1);
                  I.startTimeUnixNano = X.longs === String ? D.toString() : X.longs === Number ? D.toNumber() : D
                } else I.startTimeUnixNano = X.longs === String ? "0" : 0;
                if (hA.Long) {
                  var D = new hA.Long(0, 0, !1);
                  I.timeUnixNano = X.longs === String ? D.toString() : X.longs === Number ? D.toNumber() : D
                } else I.timeUnixNano = X.longs === String ? "0" : 0;
                if (hA.Long) {
                  var D = new hA.Long(0, 0, !1);
                  I.count = X.longs === String ? D.toString() : X.longs === Number ? D.toNumber() : D
                } else I.count = X.longs === String ? "0" : 0;
                I.sum = 0, I.flags = 0
              }
              if (J.startTimeUnixNano != null && J.hasOwnProperty("startTimeUnixNano"))
                if (typeof J.startTimeUnixNano === "number") I.startTimeUnixNano = X.longs === String ? String(J.startTimeUnixNano) : J.startTimeUnixNano;
                else I.startTimeUnixNano = X.longs === String ? hA.Long.prototype.toString.call(J.startTimeUnixNano) : X.longs === Number ? new hA.LongBits(J.startTimeUnixNano.low >>> 0, J.startTimeUnixNano.high >>> 0).toNumber() : J.startTimeUnixNano;
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano"))
                if (typeof J.timeUnixNano === "number") I.timeUnixNano = X.longs === String ? String(J.timeUnixNano) : J.timeUnixNano;
                else I.timeUnixNano = X.longs === String ? hA.Long.prototype.toString.call(J.timeUnixNano) : X.longs === Number ? new hA.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber() : J.timeUnixNano;
              if (J.count != null && J.hasOwnProperty("count"))
                if (typeof J.count === "number") I.count = X.longs === String ? String(J.count) : J.count;
                else I.count = X.longs === String ? hA.Long.prototype.toString.call(J.count) : X.longs === Number ? new hA.LongBits(J.count.low >>> 0, J.count.high >>> 0).toNumber() : J.count;
              if (J.sum != null && J.hasOwnProperty("sum")) I.sum = X.json && !isFinite(J.sum) ? String(J.sum) : J.sum;
              if (J.quantileValues && J.quantileValues.length) {
                I.quantileValues = [];
                for (var W = 0; W < J.quantileValues.length; ++W) I.quantileValues[W] = yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.toObject(J.quantileValues[W], X)
              }
              if (J.attributes && J.attributes.length) {
                I.attributes = [];
                for (var W = 0; W < J.attributes.length; ++W) I.attributes[W] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(J.attributes[W], X)
              }
              if (J.flags != null && J.hasOwnProperty("flags")) I.flags = J.flags;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.SummaryDataPoint"
            }, Z.ValueAtQuantile = function () {
              function Y(J) {
                if (J) {
                  for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                    if (J[X[I]] != null) this[X[I]] = J[X[I]]
                }
              }
              return Y.prototype.quantile = null, Y.prototype.value = null, Y.create = function (X) {
                return new Y(X)
              }, Y.encode = function (X, I) {
                if (!I) I = L3.create();
                if (X.quantile != null && Object.hasOwnProperty.call(X, "quantile")) I.uint32(9).double(X.quantile);
                if (X.value != null && Object.hasOwnProperty.call(X, "value")) I.uint32(17).double(X.value);
                return I
              }, Y.encodeDelimited = function (X, I) {
                return this.encode(X, I).ldelim()
              }, Y.decode = function (X, I, D) {
                if (!(X instanceof K0)) X = K0.create(X);
                var W = I === void 0 ? X.len : X.pos + I,
                  K = new yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;
                while (X.pos < W) {
                  var V = X.uint32();
                  if (V === D) break;
                  switch (V >>> 3) {
                    case 1: {
                      K.quantile = X.double();
                      break
                    }
                    case 2: {
                      K.value = X.double();
                      break
                    }
                    default:
                      X.skipType(V & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function (X) {
                if (!(X instanceof K0)) X = new K0(X);
                return this.decode(X, X.uint32())
              }, Y.verify = function (X) {
                if (typeof X !== "object" || X === null) return "object expected";
                if (X.quantile != null && X.hasOwnProperty("quantile")) {
                  if (typeof X.quantile !== "number") return "quantile: number expected"
                }
                if (X.value != null && X.hasOwnProperty("value")) {
                  if (typeof X.value !== "number") return "value: number expected"
                }
                return null
              }, Y.fromObject = function (X) {
                if (X instanceof yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile) return X;
                var I = new yA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;
                if (X.quantile != null) I.quantile = Number(X.quantile);
                if (X.value != null) I.value = Number(X.value);
                return I
              }, Y.toObject = function (X, I) {
                if (!I) I = {};
                var D = {};
                if (I.defaults) D.quantile = 0, D.value = 0;
                if (X.quantile != null && X.hasOwnProperty("quantile")) D.quantile = I.json && !isFinite(X.quantile) ? String(X.quantile) : X.quantile;
                if (X.value != null && X.hasOwnProperty("value")) D.value = I.json && !isFinite(X.value) ? String(X.value) : X.value;
                return D
              }, Y.prototype.toJSON = function () {
                return this.constructor.toObject(this, D4.util.toJSONOptions)
              }, Y.getTypeUrl = function (X) {
                if (X === void 0) X = "type.googleapis.com";
                return X + "/opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile"
              }, Y
            }(), Z
          }(), G.Exemplar = function () {
            function Z(J) {
              if (this.filteredAttributes = [], J) {
                for (var X = Object.keys(J), I = 0; I < X.length; ++I)
                  if (J[X[I]] != null) this[X[I]] = J[X[I]]
              }
            }
            Z.prototype.filteredAttributes = hA.emptyArray, Z.prototype.timeUnixNano = null, Z.prototype.asDouble = null, Z.prototype.asInt = null, Z.prototype.spanId = null, Z.prototype.traceId = null;
            var Y;
            return Object.defineProperty(Z.prototype, "value", {
              get: hA.oneOfGetter(Y = ["asDouble", "asInt"]),
              set: hA.oneOfSetter(Y)
            }), Z.create = function (X) {
              return new Z(X)
            }, Z.encode = function (X, I) {
              if (!I) I = L3.create();
              if (X.timeUnixNano != null && Object.hasOwnProperty.call(X, "timeUnixNano")) I.uint32(17).fixed64(X.timeUnixNano);
              if (X.asDouble != null && Object.hasOwnProperty.call(X, "asDouble")) I.uint32(25).double(X.asDouble);
              if (X.spanId != null && Object.hasOwnProperty.call(X, "spanId")) I.uint32(34).bytes(X.spanId);
              if (X.traceId != null && Object.hasOwnProperty.call(X, "traceId")) I.uint32(42).bytes(X.traceId);
              if (X.asInt != null && Object.hasOwnProperty.call(X, "asInt")) I.uint32(49).sfixed64(X.asInt);
              if (X.filteredAttributes != null && X.filteredAttributes.length)
                for (var D = 0; D < X.filteredAttributes.length; ++D) yA.opentelemetry.proto.common.v1.KeyValue.encode(X.filteredAttributes[D], I.uint32(58).fork()).ldelim();
              return I
            }, Z.encodeDelimited = function (X, I) {
              return this.encode(X, I).ldelim()
            }, Z.decode = function (X, I, D) {
              if (!(X instanceof K0)) X = K0.create(X);
              var W = I === void 0 ? X.len : X.pos + I,
                K = new yA.opentelemetry.proto.metrics.v1.Exemplar;
              while (X.pos < W) {
                var V = X.uint32();
                if (V === D) break;
                switch (V >>> 3) {
                  case 7: {
                    if (!(K.filteredAttributes && K.filteredAttributes.length)) K.filteredAttributes = [];
                    K.filteredAttributes.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(X, X.uint32()));
                    break
                  }
                  case 2: {
                    K.timeUnixNano = X.fixed64();
                    break
                  }
                  case 3: {
                    K.asDouble = X.double();
                    break
                  }
                  case 6: {
                    K.asInt = X.sfixed64();
                    break
                  }
                  case 4: {
                    K.spanId = X.bytes();
                    break
                  }
                  case 5: {
                    K.traceId = X.bytes();
                    break
                  }
                  default:
                    X.skipType(V & 7);
                    break
                }
              }
              return K
            }, Z.decodeDelimited = function (X) {
              if (!(X instanceof K0)) X = new K0(X);
              return this.decode(X, X.uint32())
            }, Z.verify = function (X) {
              if (typeof X !== "object" || X === null) return "object expected";
              var I = {};
              if (X.filteredAttributes != null && X.hasOwnProperty("filteredAttributes")) {
                if (!Array.isArray(X.filteredAttributes)) return "filteredAttributes: array expected";
                for (var D = 0; D < X.filteredAttributes.length; ++D) {
                  var W = yA.opentelemetry.proto.common.v1.KeyValue.verify(X.filteredAttributes[D]);
                  if (W) return "filteredAttributes." + W
                }
              }
              if (X.timeUnixNano != null && X.hasOwnProperty("timeUnixNano")) {
                if (!hA.isInteger(X.timeUnixNano) && !(X.timeUnixNano && hA.isInteger(X.timeUnixNano.low) && hA.isInteger(X.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (X.asDouble != null && X.hasOwnProperty("asDouble")) {
                if (I.value = 1, typeof X.asDouble !== "number") return "asDouble: number expected"
              }
              if (X.asInt != null && X.hasOwnProperty("asInt")) {
                if (I.value === 1) return "value: multiple values";
                if (I.value = 1, !hA.isInteger(X.asInt) && !(X.asInt && hA.isInteger(X.asInt.low) && hA.isInteger(X.asInt.high))) return "asInt: integer|Long expected"
              }
              if (X.spanId != null && X.hasOwnProperty("spanId")) {
                if (!(X.spanId && typeof X.spanId.length === "number" || hA.isString(X.spanId))) return "spanId: buffer expected"
              }
              if (X.traceId != null && X.hasOwnProperty("traceId")) {
                if (!(X.traceId && typeof X.traceId.length === "number" || hA.isString(X.traceId))) return "traceId: buffer expected"
              }
              return null
            }, Z.fromObject = function (X) {
              if (X instanceof yA.opentelemetry.proto.metrics.v1.Exemplar) return X;
              var I = new yA.opentelemetry.proto.metrics.v1.Exemplar;
              if (X.filteredAttributes) {
                if (!Array.isArray(X.filteredAttributes)) throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: array expected");
                I.filteredAttributes = [];
                for (var D = 0; D < X.filteredAttributes.length; ++D) {
                  if (typeof X.filteredAttributes[D] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: object expected");
                  I.filteredAttributes[D] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(X.filteredAttributes[D])
                }
              }
              if (X.timeUnixNano != null) {
                if (hA.Long)(I.timeUnixNano = hA.Long.fromValue(X.timeUnixNano)).unsigned = !1;
                else if (typeof X.timeUnixNano === "string") I.timeUnixNano = parseInt(X.timeUnixNano, 10);
                else if (typeof X.timeUnixNano === "number") I.timeUnixNano = X.timeUnixNano;
                else if (typeof X.timeUnixNano === "object") I.timeUnixNano = new hA.LongBits(X.timeUnixNano.low >>> 0, X.timeUnixNano.high >>> 0).toNumber()
              }
              if (X.asDouble != null) I.asDouble = Number(X.asDouble);
              if (X.asInt != null) {
                if (hA.Long)(I.asInt = hA.Long.fromValue(X.asInt)).unsigned = !1;
                else if (typeof X.asInt === "string") I.asInt = parseInt(X.asInt, 10);
                else if (typeof X.asInt === "number") I.asInt = X.asInt;
                else if (typeof X.asInt === "object") I.asInt = new hA.LongBits(X.asInt.low >>> 0, X.asInt.high >>> 0).toNumber()
              }
              if (X.spanId != null) {
                if (typeof X.spanId === "string") hA.base64.decode(X.spanId, I.spanId = hA.newBuffer(hA.base64.length(X.spanId)), 0);
                else if (X.spanId.length >= 0) I.spanId = X.spanId
              }
              if (X.traceId != null) {
                if (typeof X.traceId === "string") hA.base64.decode(X.traceId, I.traceId = hA.newBuffer(hA.base64.length(X.traceId)), 0);
                else if (X.traceId.length >= 0) I.traceId = X.traceId
              }
              return I
            }, Z.toObject = function (X, I) {
              if (!I) I = {};
              var D = {};
              if (I.arrays || I.defaults) D.filteredAttributes = [];
              if (I.defaults) {
                if (hA.Long) {
                  var W = new hA.Long(0, 0, !1);
                  D.timeUnixNano = I.longs === String ? W.toString() : I.longs === Number ? W.toNumber() : W
                } else D.timeUnixNano = I.longs === String ? "0" : 0;
                if (I.bytes === String) D.spanId = "";
                else if (D.spanId = [], I.bytes !== Array) D.spanId = hA.newBuffer(D.spanId);
                if (I.bytes === String) D.traceId = "";
                else if (D.traceId = [], I.bytes !== Array) D.traceId = hA.newBuffer(D.traceId)
              }
              if (X.timeUnixNano != null && X.hasOwnProperty("timeUnixNano"))
                if (typeof X.timeUnixNano === "number") D.timeUnixNano = I.longs === String ? String(X.timeUnixNano) : X.timeUnixNano;
                else D.timeUnixNano = I.longs === String ? hA.Long.prototype.toString.call(X.timeUnixNano) : I.longs === Number ? new hA.LongBits(X.timeUnixNano.low >>> 0, X.timeUnixNano.high >>> 0).toNumber() : X.timeUnixNano;
              if (X.asDouble != null && X.hasOwnProperty("asDouble")) {
                if (D.asDouble = I.json && !isFinite(X.asDouble) ? String(X.asDouble) : X.asDouble, I.oneofs) D.value = "asDouble"
              }
              if (X.spanId != null && X.hasOwnProperty("spanId")) D.spanId = I.bytes === String ? hA.base64.encode(X.spanId, 0, X.spanId.length) : I.bytes === Array ? Array.prototype.slice.call(X.spanId) : X.spanId;
              if (X.traceId != null && X.hasOwnProperty("traceId")) D.traceId = I.bytes === String ? hA.base64.encode(X.traceId, 0, X.traceId.length) : I.bytes === Array ? Array.prototype.slice.call(X.traceId) : X.traceId;
              if (X.asInt != null && X.hasOwnProperty("asInt")) {
                if (typeof X.asInt === "number") D.asInt = I.longs === String ? String(X.asInt) : X.asInt;
                else D.asInt = I.longs === String ? hA.Long.prototype.toString.call(X.asInt) : I.longs === Number ? new hA.LongBits(X.asInt.low >>> 0, X.asInt.high >>> 0).toNumber() : X.asInt;
                if (I.oneofs) D.value = "asInt"
              }
              if (X.filteredAttributes && X.filteredAttributes.length) {
                D.filteredAttributes = [];
                for (var K = 0; K < X.filteredAttributes.length; ++K) D.filteredAttributes[K] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(X.filteredAttributes[K], I)
              }
              return D
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (X) {
              if (X === void 0) X = "type.googleapis.com";
              return X + "/opentelemetry.proto.metrics.v1.Exemplar"
            }, Z
          }(), G
        }(), B
      }(), Q.logs = function () {
        var B = {};
        return B.v1 = function () {
          var G = {};
          return G.LogsData = function () {
            function Z(Y) {
              if (this.resourceLogs = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.resourceLogs = hA.emptyArray, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.resourceLogs != null && J.resourceLogs.length)
                for (var I = 0; I < J.resourceLogs.length; ++I) yA.opentelemetry.proto.logs.v1.ResourceLogs.encode(J.resourceLogs[I], X.uint32(10).fork()).ldelim();
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.logs.v1.LogsData;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(W.resourceLogs && W.resourceLogs.length)) W.resourceLogs = [];
                    W.resourceLogs.push(yA.opentelemetry.proto.logs.v1.ResourceLogs.decode(J, J.uint32()));
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.resourceLogs != null && J.hasOwnProperty("resourceLogs")) {
                if (!Array.isArray(J.resourceLogs)) return "resourceLogs: array expected";
                for (var X = 0; X < J.resourceLogs.length; ++X) {
                  var I = yA.opentelemetry.proto.logs.v1.ResourceLogs.verify(J.resourceLogs[X]);
                  if (I) return "resourceLogs." + I
                }
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.logs.v1.LogsData) return J;
              var X = new yA.opentelemetry.proto.logs.v1.LogsData;
              if (J.resourceLogs) {
                if (!Array.isArray(J.resourceLogs)) throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: array expected");
                X.resourceLogs = [];
                for (var I = 0; I < J.resourceLogs.length; ++I) {
                  if (typeof J.resourceLogs[I] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: object expected");
                  X.resourceLogs[I] = yA.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(J.resourceLogs[I])
                }
              }
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.resourceLogs = [];
              if (J.resourceLogs && J.resourceLogs.length) {
                I.resourceLogs = [];
                for (var D = 0; D < J.resourceLogs.length; ++D) I.resourceLogs[D] = yA.opentelemetry.proto.logs.v1.ResourceLogs.toObject(J.resourceLogs[D], X)
              }
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.logs.v1.LogsData"
            }, Z
          }(), G.ResourceLogs = function () {
            function Z(Y) {
              if (this.scopeLogs = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.resource = null, Z.prototype.scopeLogs = hA.emptyArray, Z.prototype.schemaUrl = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.resource != null && Object.hasOwnProperty.call(J, "resource")) yA.opentelemetry.proto.resource.v1.Resource.encode(J.resource, X.uint32(10).fork()).ldelim();
              if (J.scopeLogs != null && J.scopeLogs.length)
                for (var I = 0; I < J.scopeLogs.length; ++I) yA.opentelemetry.proto.logs.v1.ScopeLogs.encode(J.scopeLogs[I], X.uint32(18).fork()).ldelim();
              if (J.schemaUrl != null && Object.hasOwnProperty.call(J, "schemaUrl")) X.uint32(26).string(J.schemaUrl);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.logs.v1.ResourceLogs;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    W.resource = yA.opentelemetry.proto.resource.v1.Resource.decode(J, J.uint32());
                    break
                  }
                  case 2: {
                    if (!(W.scopeLogs && W.scopeLogs.length)) W.scopeLogs = [];
                    W.scopeLogs.push(yA.opentelemetry.proto.logs.v1.ScopeLogs.decode(J, J.uint32()));
                    break
                  }
                  case 3: {
                    W.schemaUrl = J.string();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.resource != null && J.hasOwnProperty("resource")) {
                var X = yA.opentelemetry.proto.resource.v1.Resource.verify(J.resource);
                if (X) return "resource." + X
              }
              if (J.scopeLogs != null && J.hasOwnProperty("scopeLogs")) {
                if (!Array.isArray(J.scopeLogs)) return "scopeLogs: array expected";
                for (var I = 0; I < J.scopeLogs.length; ++I) {
                  var X = yA.opentelemetry.proto.logs.v1.ScopeLogs.verify(J.scopeLogs[I]);
                  if (X) return "scopeLogs." + X
                }
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) {
                if (!hA.isString(J.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.logs.v1.ResourceLogs) return J;
              var X = new yA.opentelemetry.proto.logs.v1.ResourceLogs;
              if (J.resource != null) {
                if (typeof J.resource !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.resource: object expected");
                X.resource = yA.opentelemetry.proto.resource.v1.Resource.fromObject(J.resource)
              }
              if (J.scopeLogs) {
                if (!Array.isArray(J.scopeLogs)) throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: array expected");
                X.scopeLogs = [];
                for (var I = 0; I < J.scopeLogs.length; ++I) {
                  if (typeof J.scopeLogs[I] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: object expected");
                  X.scopeLogs[I] = yA.opentelemetry.proto.logs.v1.ScopeLogs.fromObject(J.scopeLogs[I])
                }
              }
              if (J.schemaUrl != null) X.schemaUrl = String(J.schemaUrl);
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.scopeLogs = [];
              if (X.defaults) I.resource = null, I.schemaUrl = "";
              if (J.resource != null && J.hasOwnProperty("resource")) I.resource = yA.opentelemetry.proto.resource.v1.Resource.toObject(J.resource, X);
              if (J.scopeLogs && J.scopeLogs.length) {
                I.scopeLogs = [];
                for (var D = 0; D < J.scopeLogs.length; ++D) I.scopeLogs[D] = yA.opentelemetry.proto.logs.v1.ScopeLogs.toObject(J.scopeLogs[D], X)
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) I.schemaUrl = J.schemaUrl;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.logs.v1.ResourceLogs"
            }, Z
          }(), G.ScopeLogs = function () {
            function Z(Y) {
              if (this.logRecords = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.scope = null, Z.prototype.logRecords = hA.emptyArray, Z.prototype.schemaUrl = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.scope != null && Object.hasOwnProperty.call(J, "scope")) yA.opentelemetry.proto.common.v1.InstrumentationScope.encode(J.scope, X.uint32(10).fork()).ldelim();
              if (J.logRecords != null && J.logRecords.length)
                for (var I = 0; I < J.logRecords.length; ++I) yA.opentelemetry.proto.logs.v1.LogRecord.encode(J.logRecords[I], X.uint32(18).fork()).ldelim();
              if (J.schemaUrl != null && Object.hasOwnProperty.call(J, "schemaUrl")) X.uint32(26).string(J.schemaUrl);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.logs.v1.ScopeLogs;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    W.scope = yA.opentelemetry.proto.common.v1.InstrumentationScope.decode(J, J.uint32());
                    break
                  }
                  case 2: {
                    if (!(W.logRecords && W.logRecords.length)) W.logRecords = [];
                    W.logRecords.push(yA.opentelemetry.proto.logs.v1.LogRecord.decode(J, J.uint32()));
                    break
                  }
                  case 3: {
                    W.schemaUrl = J.string();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.scope != null && J.hasOwnProperty("scope")) {
                var X = yA.opentelemetry.proto.common.v1.InstrumentationScope.verify(J.scope);
                if (X) return "scope." + X
              }
              if (J.logRecords != null && J.hasOwnProperty("logRecords")) {
                if (!Array.isArray(J.logRecords)) return "logRecords: array expected";
                for (var I = 0; I < J.logRecords.length; ++I) {
                  var X = yA.opentelemetry.proto.logs.v1.LogRecord.verify(J.logRecords[I]);
                  if (X) return "logRecords." + X
                }
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) {
                if (!hA.isString(J.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.logs.v1.ScopeLogs) return J;
              var X = new yA.opentelemetry.proto.logs.v1.ScopeLogs;
              if (J.scope != null) {
                if (typeof J.scope !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.scope: object expected");
                X.scope = yA.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(J.scope)
              }
              if (J.logRecords) {
                if (!Array.isArray(J.logRecords)) throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: array expected");
                X.logRecords = [];
                for (var I = 0; I < J.logRecords.length; ++I) {
                  if (typeof J.logRecords[I] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: object expected");
                  X.logRecords[I] = yA.opentelemetry.proto.logs.v1.LogRecord.fromObject(J.logRecords[I])
                }
              }
              if (J.schemaUrl != null) X.schemaUrl = String(J.schemaUrl);
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.logRecords = [];
              if (X.defaults) I.scope = null, I.schemaUrl = "";
              if (J.scope != null && J.hasOwnProperty("scope")) I.scope = yA.opentelemetry.proto.common.v1.InstrumentationScope.toObject(J.scope, X);
              if (J.logRecords && J.logRecords.length) {
                I.logRecords = [];
                for (var D = 0; D < J.logRecords.length; ++D) I.logRecords[D] = yA.opentelemetry.proto.logs.v1.LogRecord.toObject(J.logRecords[D], X)
              }
              if (J.schemaUrl != null && J.hasOwnProperty("schemaUrl")) I.schemaUrl = J.schemaUrl;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.logs.v1.ScopeLogs"
            }, Z
          }(), G.SeverityNumber = function () {
            var Z = {},
              Y = Object.create(Z);
            return Y[Z[0] = "SEVERITY_NUMBER_UNSPECIFIED"] = 0, Y[Z[1] = "SEVERITY_NUMBER_TRACE"] = 1, Y[Z[2] = "SEVERITY_NUMBER_TRACE2"] = 2, Y[Z[3] = "SEVERITY_NUMBER_TRACE3"] = 3, Y[Z[4] = "SEVERITY_NUMBER_TRACE4"] = 4, Y[Z[5] = "SEVERITY_NUMBER_DEBUG"] = 5, Y[Z[6] = "SEVERITY_NUMBER_DEBUG2"] = 6, Y[Z[7] = "SEVERITY_NUMBER_DEBUG3"] = 7, Y[Z[8] = "SEVERITY_NUMBER_DEBUG4"] = 8, Y[Z[9] = "SEVERITY_NUMBER_INFO"] = 9, Y[Z[10] = "SEVERITY_NUMBER_INFO2"] = 10, Y[Z[11] = "SEVERITY_NUMBER_INFO3"] = 11, Y[Z[12] = "SEVERITY_NUMBER_INFO4"] = 12, Y[Z[13] = "SEVERITY_NUMBER_WARN"] = 13, Y[Z[14] = "SEVERITY_NUMBER_WARN2"] = 14, Y[Z[15] = "SEVERITY_NUMBER_WARN3"] = 15, Y[Z[16] = "SEVERITY_NUMBER_WARN4"] = 16, Y[Z[17] = "SEVERITY_NUMBER_ERROR"] = 17, Y[Z[18] = "SEVERITY_NUMBER_ERROR2"] = 18, Y[Z[19] = "SEVERITY_NUMBER_ERROR3"] = 19, Y[Z[20] = "SEVERITY_NUMBER_ERROR4"] = 20, Y[Z[21] = "SEVERITY_NUMBER_FATAL"] = 21, Y[Z[22] = "SEVERITY_NUMBER_FATAL2"] = 22, Y[Z[23] = "SEVERITY_NUMBER_FATAL3"] = 23, Y[Z[24] = "SEVERITY_NUMBER_FATAL4"] = 24, Y
          }(), G.LogRecordFlags = function () {
            var Z = {},
              Y = Object.create(Z);
            return Y[Z[0] = "LOG_RECORD_FLAGS_DO_NOT_USE"] = 0, Y[Z[255] = "LOG_RECORD_FLAGS_TRACE_FLAGS_MASK"] = 255, Y
          }(), G.LogRecord = function () {
            function Z(Y) {
              if (this.attributes = [], Y) {
                for (var J = Object.keys(Y), X = 0; X < J.length; ++X)
                  if (Y[J[X]] != null) this[J[X]] = Y[J[X]]
              }
            }
            return Z.prototype.timeUnixNano = null, Z.prototype.observedTimeUnixNano = null, Z.prototype.severityNumber = null, Z.prototype.severityText = null, Z.prototype.body = null, Z.prototype.attributes = hA.emptyArray, Z.prototype.droppedAttributesCount = null, Z.prototype.flags = null, Z.prototype.traceId = null, Z.prototype.spanId = null, Z.prototype.eventName = null, Z.create = function (J) {
              return new Z(J)
            }, Z.encode = function (J, X) {
              if (!X) X = L3.create();
              if (J.timeUnixNano != null && Object.hasOwnProperty.call(J, "timeUnixNano")) X.uint32(9).fixed64(J.timeUnixNano);
              if (J.severityNumber != null && Object.hasOwnProperty.call(J, "severityNumber")) X.uint32(16).int32(J.severityNumber);
              if (J.severityText != null && Object.hasOwnProperty.call(J, "severityText")) X.uint32(26).string(J.severityText);
              if (J.body != null && Object.hasOwnProperty.call(J, "body")) yA.opentelemetry.proto.common.v1.AnyValue.encode(J.body, X.uint32(42).fork()).ldelim();
              if (J.attributes != null && J.attributes.length)
                for (var I = 0; I < J.attributes.length; ++I) yA.opentelemetry.proto.common.v1.KeyValue.encode(J.attributes[I], X.uint32(50).fork()).ldelim();
              if (J.droppedAttributesCount != null && Object.hasOwnProperty.call(J, "droppedAttributesCount")) X.uint32(56).uint32(J.droppedAttributesCount);
              if (J.flags != null && Object.hasOwnProperty.call(J, "flags")) X.uint32(69).fixed32(J.flags);
              if (J.traceId != null && Object.hasOwnProperty.call(J, "traceId")) X.uint32(74).bytes(J.traceId);
              if (J.spanId != null && Object.hasOwnProperty.call(J, "spanId")) X.uint32(82).bytes(J.spanId);
              if (J.observedTimeUnixNano != null && Object.hasOwnProperty.call(J, "observedTimeUnixNano")) X.uint32(89).fixed64(J.observedTimeUnixNano);
              if (J.eventName != null && Object.hasOwnProperty.call(J, "eventName")) X.uint32(98).string(J.eventName);
              return X
            }, Z.encodeDelimited = function (J, X) {
              return this.encode(J, X).ldelim()
            }, Z.decode = function (J, X, I) {
              if (!(J instanceof K0)) J = K0.create(J);
              var D = X === void 0 ? J.len : J.pos + X,
                W = new yA.opentelemetry.proto.logs.v1.LogRecord;
              while (J.pos < D) {
                var K = J.uint32();
                if (K === I) break;
                switch (K >>> 3) {
                  case 1: {
                    W.timeUnixNano = J.fixed64();
                    break
                  }
                  case 11: {
                    W.observedTimeUnixNano = J.fixed64();
                    break
                  }
                  case 2: {
                    W.severityNumber = J.int32();
                    break
                  }
                  case 3: {
                    W.severityText = J.string();
                    break
                  }
                  case 5: {
                    W.body = yA.opentelemetry.proto.common.v1.AnyValue.decode(J, J.uint32());
                    break
                  }
                  case 6: {
                    if (!(W.attributes && W.attributes.length)) W.attributes = [];
                    W.attributes.push(yA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                    break
                  }
                  case 7: {
                    W.droppedAttributesCount = J.uint32();
                    break
                  }
                  case 8: {
                    W.flags = J.fixed32();
                    break
                  }
                  case 9: {
                    W.traceId = J.bytes();
                    break
                  }
                  case 10: {
                    W.spanId = J.bytes();
                    break
                  }
                  case 12: {
                    W.eventName = J.string();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return W
            }, Z.decodeDelimited = function (J) {
              if (!(J instanceof K0)) J = new K0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function (J) {
              if (typeof J !== "object" || J === null) return "object expected";
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano")) {
                if (!hA.isInteger(J.timeUnixNano) && !(J.timeUnixNano && hA.isInteger(J.timeUnixNano.low) && hA.isInteger(J.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (J.observedTimeUnixNano != null && J.hasOwnProperty("observedTimeUnixNano")) {
                if (!hA.isInteger(J.observedTimeUnixNano) && !(J.observedTimeUnixNano && hA.isInteger(J.observedTimeUnixNano.low) && hA.isInteger(J.observedTimeUnixNano.high))) return "observedTimeUnixNano: integer|Long expected"
              }
              if (J.severityNumber != null && J.hasOwnProperty("severityNumber")) switch (J.severityNumber) {
                default:
                  return "severityNumber: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                  break
              }
              if (J.severityText != null && J.hasOwnProperty("severityText")) {
                if (!hA.isString(J.severityText)) return "severityText: string expected"
              }
              if (J.body != null && J.hasOwnProperty("body")) {
                var X = yA.opentelemetry.proto.common.v1.AnyValue.verify(J.body);
                if (X) return "body." + X
              }
              if (J.attributes != null && J.hasOwnProperty("attributes")) {
                if (!Array.isArray(J.attributes)) return "attributes: array expected";
                for (var I = 0; I < J.attributes.length; ++I) {
                  var X = yA.opentelemetry.proto.common.v1.KeyValue.verify(J.attributes[I]);
                  if (X) return "attributes." + X
                }
              }
              if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) {
                if (!hA.isInteger(J.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
              }
              if (J.flags != null && J.hasOwnProperty("flags")) {
                if (!hA.isInteger(J.flags)) return "flags: integer expected"
              }
              if (J.traceId != null && J.hasOwnProperty("traceId")) {
                if (!(J.traceId && typeof J.traceId.length === "number" || hA.isString(J.traceId))) return "traceId: buffer expected"
              }
              if (J.spanId != null && J.hasOwnProperty("spanId")) {
                if (!(J.spanId && typeof J.spanId.length === "number" || hA.isString(J.spanId))) return "spanId: buffer expected"
              }
              if (J.eventName != null && J.hasOwnProperty("eventName")) {
                if (!hA.isString(J.eventName)) return "eventName: string expected"
              }
              return null
            }, Z.fromObject = function (J) {
              if (J instanceof yA.opentelemetry.proto.logs.v1.LogRecord) return J;
              var X = new yA.opentelemetry.proto.logs.v1.LogRecord;
              if (J.timeUnixNano != null) {
                if (hA.Long)(X.timeUnixNano = hA.Long.fromValue(J.timeUnixNano)).unsigned = !1;
                else if (typeof J.timeUnixNano === "string") X.timeUnixNano = parseInt(J.timeUnixNano, 10);
                else if (typeof J.timeUnixNano === "number") X.timeUnixNano = J.timeUnixNano;
                else if (typeof J.timeUnixNano === "object") X.timeUnixNano = new hA.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber()
              }
              if (J.observedTimeUnixNano != null) {
                if (hA.Long)(X.observedTimeUnixNano = hA.Long.fromValue(J.observedTimeUnixNano)).unsigned = !1;
                else if (typeof J.observedTimeUnixNano === "string") X.observedTimeUnixNano = parseInt(J.observedTimeUnixNano, 10);
                else if (typeof J.observedTimeUnixNano === "number") X.observedTimeUnixNano = J.observedTimeUnixNano;
                else if (typeof J.observedTimeUnixNano === "object") X.observedTimeUnixNano = new hA.LongBits(J.observedTimeUnixNano.low >>> 0, J.observedTimeUnixNano.high >>> 0).toNumber()
              }
              switch (J.severityNumber) {
                default:
                  if (typeof J.severityNumber === "number") {
                    X.severityNumber = J.severityNumber;
                    break
                  }
                  break;
                case "SEVERITY_NUMBER_UNSPECIFIED":
                case 0:
                  X.severityNumber = 0;
                  break;
                case "SEVERITY_NUMBER_TRACE":
                case 1:
                  X.severityNumber = 1;
                  break;
                case "SEVERITY_NUMBER_TRACE2":
                case 2:
                  X.severityNumber = 2;
                  break;
                case "SEVERITY_NUMBER_TRACE3":
                case 3:
                  X.severityNumber = 3;
                  break;
                case "SEVERITY_NUMBER_TRACE4":
                case 4:
                  X.severityNumber = 4;
                  break;
                case "SEVERITY_NUMBER_DEBUG":
                case 5:
                  X.severityNumber = 5;
                  break;
                case "SEVERITY_NUMBER_DEBUG2":
                case 6:
                  X.severityNumber = 6;
                  break;
                case "SEVERITY_NUMBER_DEBUG3":
                case 7:
                  X.severityNumber = 7;
                  break;
                case "SEVERITY_NUMBER_DEBUG4":
                case 8:
                  X.severityNumber = 8;
                  break;
                case "SEVERITY_NUMBER_INFO":
                case 9:
                  X.severityNumber = 9;
                  break;
                case "SEVERITY_NUMBER_INFO2":
                case 10:
                  X.severityNumber = 10;
                  break;
                case "SEVERITY_NUMBER_INFO3":
                case 11:
                  X.severityNumber = 11;
                  break;
                case "SEVERITY_NUMBER_INFO4":
                case 12:
                  X.severityNumber = 12;
                  break;
                case "SEVERITY_NUMBER_WARN":
                case 13:
                  X.severityNumber = 13;
                  break;
                case "SEVERITY_NUMBER_WARN2":
                case 14:
                  X.severityNumber = 14;
                  break;
                case "SEVERITY_NUMBER_WARN3":
                case 15:
                  X.severityNumber = 15;
                  break;
                case "SEVERITY_NUMBER_WARN4":
                case 16:
                  X.severityNumber = 16;
                  break;
                case "SEVERITY_NUMBER_ERROR":
                case 17:
                  X.severityNumber = 17;
                  break;
                case "SEVERITY_NUMBER_ERROR2":
                case 18:
                  X.severityNumber = 18;
                  break;
                case "SEVERITY_NUMBER_ERROR3":
                case 19:
                  X.severityNumber = 19;
                  break;
                case "SEVERITY_NUMBER_ERROR4":
                case 20:
                  X.severityNumber = 20;
                  break;
                case "SEVERITY_NUMBER_FATAL":
                case 21:
                  X.severityNumber = 21;
                  break;
                case "SEVERITY_NUMBER_FATAL2":
                case 22:
                  X.severityNumber = 22;
                  break;
                case "SEVERITY_NUMBER_FATAL3":
                case 23:
                  X.severityNumber = 23;
                  break;
                case "SEVERITY_NUMBER_FATAL4":
                case 24:
                  X.severityNumber = 24;
                  break
              }
              if (J.severityText != null) X.severityText = String(J.severityText);
              if (J.body != null) {
                if (typeof J.body !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.body: object expected");
                X.body = yA.opentelemetry.proto.common.v1.AnyValue.fromObject(J.body)
              }
              if (J.attributes) {
                if (!Array.isArray(J.attributes)) throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: array expected");
                X.attributes = [];
                for (var I = 0; I < J.attributes.length; ++I) {
                  if (typeof J.attributes[I] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: object expected");
                  X.attributes[I] = yA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.attributes[I])
                }
              }
              if (J.droppedAttributesCount != null) X.droppedAttributesCount = J.droppedAttributesCount >>> 0;
              if (J.flags != null) X.flags = J.flags >>> 0;
              if (J.traceId != null) {
                if (typeof J.traceId === "string") hA.base64.decode(J.traceId, X.traceId = hA.newBuffer(hA.base64.length(J.traceId)), 0);
                else if (J.traceId.length >= 0) X.traceId = J.traceId
              }
              if (J.spanId != null) {
                if (typeof J.spanId === "string") hA.base64.decode(J.spanId, X.spanId = hA.newBuffer(hA.base64.length(J.spanId)), 0);
                else if (J.spanId.length >= 0) X.spanId = J.spanId
              }
              if (J.eventName != null) X.eventName = String(J.eventName);
              return X
            }, Z.toObject = function (J, X) {
              if (!X) X = {};
              var I = {};
              if (X.arrays || X.defaults) I.attributes = [];
              if (X.defaults) {
                if (hA.Long) {
                  var D = new hA.Long(0, 0, !1);
                  I.timeUnixNano = X.longs === String ? D.toString() : X.longs === Number ? D.toNumber() : D
                } else I.timeUnixNano = X.longs === String ? "0" : 0;
                if (I.severityNumber = X.enums === String ? "SEVERITY_NUMBER_UNSPECIFIED" : 0, I.severityText = "", I.body = null, I.droppedAttributesCount = 0, I.flags = 0, X.bytes === String) I.traceId = "";
                else if (I.traceId = [], X.bytes !== Array) I.traceId = hA.newBuffer(I.traceId);
                if (X.bytes === String) I.spanId = "";
                else if (I.spanId = [], X.bytes !== Array) I.spanId = hA.newBuffer(I.spanId);
                if (hA.Long) {
                  var D = new hA.Long(0, 0, !1);
                  I.observedTimeUnixNano = X.longs === String ? D.toString() : X.longs === Number ? D.toNumber() : D
                } else I.observedTimeUnixNano = X.longs === String ? "0" : 0;
                I.eventName = ""
              }
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano"))
                if (typeof J.timeUnixNano === "number") I.timeUnixNano = X.longs === String ? String(J.timeUnixNano) : J.timeUnixNano;
                else I.timeUnixNano = X.longs === String ? hA.Long.prototype.toString.call(J.timeUnixNano) : X.longs === Number ? new hA.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber() : J.timeUnixNano;
              if (J.severityNumber != null && J.hasOwnProperty("severityNumber")) I.severityNumber = X.enums === String ? yA.opentelemetry.proto.logs.v1.SeverityNumber[J.severityNumber] === void 0 ? J.severityNumber : yA.opentelemetry.proto.logs.v1.SeverityNumber[J.severityNumber] : J.severityNumber;
              if (J.severityText != null && J.hasOwnProperty("severityText")) I.severityText = J.severityText;
              if (J.body != null && J.hasOwnProperty("body")) I.body = yA.opentelemetry.proto.common.v1.AnyValue.toObject(J.body, X);
              if (J.attributes && J.attributes.length) {
                I.attributes = [];
                for (var W = 0; W < J.attributes.length; ++W) I.attributes[W] = yA.opentelemetry.proto.common.v1.KeyValue.toObject(J.attributes[W], X)
              }
              if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) I.droppedAttributesCount = J.droppedAttributesCount;
              if (J.flags != null && J.hasOwnProperty("flags")) I.flags = J.flags;
              if (J.traceId != null && J.hasOwnProperty("traceId")) I.traceId = X.bytes === String ? hA.base64.encode(J.traceId, 0, J.traceId.length) : X.bytes === Array ? Array.prototype.slice.call(J.traceId) : J.traceId;
              if (J.spanId != null && J.hasOwnProperty("spanId")) I.spanId = X.bytes === String ? hA.base64.encode(J.spanId, 0, J.spanId.length) : X.bytes === Array ? Array.prototype.slice.call(J.spanId) : J.spanId;
              if (J.observedTimeUnixNano != null && J.hasOwnProperty("observedTimeUnixNano"))
                if (typeof J.observedTimeUnixNano === "number") I.observedTimeUnixNano = X.longs === String ? String(J.observedTimeUnixNano) : J.observedTimeUnixNano;
                else I.observedTimeUnixNano = X.longs === String ? hA.Long.prototype.toString.call(J.observedTimeUnixNano) : X.longs === Number ? new hA.LongBits(J.observedTimeUnixNano.low >>> 0, J.observedTimeUnixNano.high >>> 0).toNumber() : J.observedTimeUnixNano;
              if (J.eventName != null && J.hasOwnProperty("eventName")) I.eventName = J.eventName;
              return I
            }, Z.prototype.toJSON = function () {
              return this.constructor.toObject(this, D4.util.toJSONOptions)
            }, Z.getTypeUrl = function (J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.logs.v1.LogRecord"
            }, Z
          }(), G
        }(), B
      }(), Q
    }(), A
  }();
  yD2.exports = yA
})