
// @from(Start 10204997, End 10515112)
C41 = z((vF2, bF2) => {
  Object.defineProperty(vF2, "__esModule", {
    value: !0
  });
  var _9 = OB0(),
    B0 = _9.Reader,
    M8 = _9.Writer,
    _A = _9.util,
    PA = _9.roots.default || (_9.roots.default = {});
  PA.opentelemetry = function() {
    var A = {};
    return A.proto = function() {
      var Q = {};
      return Q.common = function() {
        var B = {};
        return B.v1 = function() {
          var G = {};
          return G.AnyValue = function() {
            function Z(Y) {
              if (Y) {
                for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                  if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
              }
            }
            Z.prototype.stringValue = null, Z.prototype.boolValue = null, Z.prototype.intValue = null, Z.prototype.doubleValue = null, Z.prototype.arrayValue = null, Z.prototype.kvlistValue = null, Z.prototype.bytesValue = null;
            var I;
            return Object.defineProperty(Z.prototype, "value", {
              get: _A.oneOfGetter(I = ["stringValue", "boolValue", "intValue", "doubleValue", "arrayValue", "kvlistValue", "bytesValue"]),
              set: _A.oneOfSetter(I)
            }), Z.create = function(J) {
              return new Z(J)
            }, Z.encode = function(J, W) {
              if (!W) W = M8.create();
              if (J.stringValue != null && Object.hasOwnProperty.call(J, "stringValue")) W.uint32(10).string(J.stringValue);
              if (J.boolValue != null && Object.hasOwnProperty.call(J, "boolValue")) W.uint32(16).bool(J.boolValue);
              if (J.intValue != null && Object.hasOwnProperty.call(J, "intValue")) W.uint32(24).int64(J.intValue);
              if (J.doubleValue != null && Object.hasOwnProperty.call(J, "doubleValue")) W.uint32(33).double(J.doubleValue);
              if (J.arrayValue != null && Object.hasOwnProperty.call(J, "arrayValue")) PA.opentelemetry.proto.common.v1.ArrayValue.encode(J.arrayValue, W.uint32(42).fork()).ldelim();
              if (J.kvlistValue != null && Object.hasOwnProperty.call(J, "kvlistValue")) PA.opentelemetry.proto.common.v1.KeyValueList.encode(J.kvlistValue, W.uint32(50).fork()).ldelim();
              if (J.bytesValue != null && Object.hasOwnProperty.call(J, "bytesValue")) W.uint32(58).bytes(J.bytesValue);
              return W
            }, Z.encodeDelimited = function(J, W) {
              return this.encode(J, W).ldelim()
            }, Z.decode = function(J, W, X) {
              if (!(J instanceof B0)) J = B0.create(J);
              var V = W === void 0 ? J.len : J.pos + W,
                F = new PA.opentelemetry.proto.common.v1.AnyValue;
              while (J.pos < V) {
                var K = J.uint32();
                if (K === X) break;
                switch (K >>> 3) {
                  case 1: {
                    F.stringValue = J.string();
                    break
                  }
                  case 2: {
                    F.boolValue = J.bool();
                    break
                  }
                  case 3: {
                    F.intValue = J.int64();
                    break
                  }
                  case 4: {
                    F.doubleValue = J.double();
                    break
                  }
                  case 5: {
                    F.arrayValue = PA.opentelemetry.proto.common.v1.ArrayValue.decode(J, J.uint32());
                    break
                  }
                  case 6: {
                    F.kvlistValue = PA.opentelemetry.proto.common.v1.KeyValueList.decode(J, J.uint32());
                    break
                  }
                  case 7: {
                    F.bytesValue = J.bytes();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return F
            }, Z.decodeDelimited = function(J) {
              if (!(J instanceof B0)) J = new B0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function(J) {
              if (typeof J !== "object" || J === null) return "object expected";
              var W = {};
              if (J.stringValue != null && J.hasOwnProperty("stringValue")) {
                if (W.value = 1, !_A.isString(J.stringValue)) return "stringValue: string expected"
              }
              if (J.boolValue != null && J.hasOwnProperty("boolValue")) {
                if (W.value === 1) return "value: multiple values";
                if (W.value = 1, typeof J.boolValue !== "boolean") return "boolValue: boolean expected"
              }
              if (J.intValue != null && J.hasOwnProperty("intValue")) {
                if (W.value === 1) return "value: multiple values";
                if (W.value = 1, !_A.isInteger(J.intValue) && !(J.intValue && _A.isInteger(J.intValue.low) && _A.isInteger(J.intValue.high))) return "intValue: integer|Long expected"
              }
              if (J.doubleValue != null && J.hasOwnProperty("doubleValue")) {
                if (W.value === 1) return "value: multiple values";
                if (W.value = 1, typeof J.doubleValue !== "number") return "doubleValue: number expected"
              }
              if (J.arrayValue != null && J.hasOwnProperty("arrayValue")) {
                if (W.value === 1) return "value: multiple values";
                W.value = 1;
                {
                  var X = PA.opentelemetry.proto.common.v1.ArrayValue.verify(J.arrayValue);
                  if (X) return "arrayValue." + X
                }
              }
              if (J.kvlistValue != null && J.hasOwnProperty("kvlistValue")) {
                if (W.value === 1) return "value: multiple values";
                W.value = 1;
                {
                  var X = PA.opentelemetry.proto.common.v1.KeyValueList.verify(J.kvlistValue);
                  if (X) return "kvlistValue." + X
                }
              }
              if (J.bytesValue != null && J.hasOwnProperty("bytesValue")) {
                if (W.value === 1) return "value: multiple values";
                if (W.value = 1, !(J.bytesValue && typeof J.bytesValue.length === "number" || _A.isString(J.bytesValue))) return "bytesValue: buffer expected"
              }
              return null
            }, Z.fromObject = function(J) {
              if (J instanceof PA.opentelemetry.proto.common.v1.AnyValue) return J;
              var W = new PA.opentelemetry.proto.common.v1.AnyValue;
              if (J.stringValue != null) W.stringValue = String(J.stringValue);
              if (J.boolValue != null) W.boolValue = Boolean(J.boolValue);
              if (J.intValue != null) {
                if (_A.Long)(W.intValue = _A.Long.fromValue(J.intValue)).unsigned = !1;
                else if (typeof J.intValue === "string") W.intValue = parseInt(J.intValue, 10);
                else if (typeof J.intValue === "number") W.intValue = J.intValue;
                else if (typeof J.intValue === "object") W.intValue = new _A.LongBits(J.intValue.low >>> 0, J.intValue.high >>> 0).toNumber()
              }
              if (J.doubleValue != null) W.doubleValue = Number(J.doubleValue);
              if (J.arrayValue != null) {
                if (typeof J.arrayValue !== "object") throw TypeError(".opentelemetry.proto.common.v1.AnyValue.arrayValue: object expected");
                W.arrayValue = PA.opentelemetry.proto.common.v1.ArrayValue.fromObject(J.arrayValue)
              }
              if (J.kvlistValue != null) {
                if (typeof J.kvlistValue !== "object") throw TypeError(".opentelemetry.proto.common.v1.AnyValue.kvlistValue: object expected");
                W.kvlistValue = PA.opentelemetry.proto.common.v1.KeyValueList.fromObject(J.kvlistValue)
              }
              if (J.bytesValue != null) {
                if (typeof J.bytesValue === "string") _A.base64.decode(J.bytesValue, W.bytesValue = _A.newBuffer(_A.base64.length(J.bytesValue)), 0);
                else if (J.bytesValue.length >= 0) W.bytesValue = J.bytesValue
              }
              return W
            }, Z.toObject = function(J, W) {
              if (!W) W = {};
              var X = {};
              if (J.stringValue != null && J.hasOwnProperty("stringValue")) {
                if (X.stringValue = J.stringValue, W.oneofs) X.value = "stringValue"
              }
              if (J.boolValue != null && J.hasOwnProperty("boolValue")) {
                if (X.boolValue = J.boolValue, W.oneofs) X.value = "boolValue"
              }
              if (J.intValue != null && J.hasOwnProperty("intValue")) {
                if (typeof J.intValue === "number") X.intValue = W.longs === String ? String(J.intValue) : J.intValue;
                else X.intValue = W.longs === String ? _A.Long.prototype.toString.call(J.intValue) : W.longs === Number ? new _A.LongBits(J.intValue.low >>> 0, J.intValue.high >>> 0).toNumber() : J.intValue;
                if (W.oneofs) X.value = "intValue"
              }
              if (J.doubleValue != null && J.hasOwnProperty("doubleValue")) {
                if (X.doubleValue = W.json && !isFinite(J.doubleValue) ? String(J.doubleValue) : J.doubleValue, W.oneofs) X.value = "doubleValue"
              }
              if (J.arrayValue != null && J.hasOwnProperty("arrayValue")) {
                if (X.arrayValue = PA.opentelemetry.proto.common.v1.ArrayValue.toObject(J.arrayValue, W), W.oneofs) X.value = "arrayValue"
              }
              if (J.kvlistValue != null && J.hasOwnProperty("kvlistValue")) {
                if (X.kvlistValue = PA.opentelemetry.proto.common.v1.KeyValueList.toObject(J.kvlistValue, W), W.oneofs) X.value = "kvlistValue"
              }
              if (J.bytesValue != null && J.hasOwnProperty("bytesValue")) {
                if (X.bytesValue = W.bytes === String ? _A.base64.encode(J.bytesValue, 0, J.bytesValue.length) : W.bytes === Array ? Array.prototype.slice.call(J.bytesValue) : J.bytesValue, W.oneofs) X.value = "bytesValue"
              }
              return X
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.common.v1.AnyValue"
            }, Z
          }(), G.ArrayValue = function() {
            function Z(I) {
              if (this.values = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.values = _A.emptyArray, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.values != null && Y.values.length)
                for (var W = 0; W < Y.values.length; ++W) PA.opentelemetry.proto.common.v1.AnyValue.encode(Y.values[W], J.uint32(10).fork()).ldelim();
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.common.v1.ArrayValue;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    if (!(V.values && V.values.length)) V.values = [];
                    V.values.push(PA.opentelemetry.proto.common.v1.AnyValue.decode(Y, Y.uint32()));
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.values != null && Y.hasOwnProperty("values")) {
                if (!Array.isArray(Y.values)) return "values: array expected";
                for (var J = 0; J < Y.values.length; ++J) {
                  var W = PA.opentelemetry.proto.common.v1.AnyValue.verify(Y.values[J]);
                  if (W) return "values." + W
                }
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.common.v1.ArrayValue) return Y;
              var J = new PA.opentelemetry.proto.common.v1.ArrayValue;
              if (Y.values) {
                if (!Array.isArray(Y.values)) throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: array expected");
                J.values = [];
                for (var W = 0; W < Y.values.length; ++W) {
                  if (typeof Y.values[W] !== "object") throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: object expected");
                  J.values[W] = PA.opentelemetry.proto.common.v1.AnyValue.fromObject(Y.values[W])
                }
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.values = [];
              if (Y.values && Y.values.length) {
                W.values = [];
                for (var X = 0; X < Y.values.length; ++X) W.values[X] = PA.opentelemetry.proto.common.v1.AnyValue.toObject(Y.values[X], J)
              }
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.common.v1.ArrayValue"
            }, Z
          }(), G.KeyValueList = function() {
            function Z(I) {
              if (this.values = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.values = _A.emptyArray, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.values != null && Y.values.length)
                for (var W = 0; W < Y.values.length; ++W) PA.opentelemetry.proto.common.v1.KeyValue.encode(Y.values[W], J.uint32(10).fork()).ldelim();
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.common.v1.KeyValueList;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    if (!(V.values && V.values.length)) V.values = [];
                    V.values.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(Y, Y.uint32()));
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.values != null && Y.hasOwnProperty("values")) {
                if (!Array.isArray(Y.values)) return "values: array expected";
                for (var J = 0; J < Y.values.length; ++J) {
                  var W = PA.opentelemetry.proto.common.v1.KeyValue.verify(Y.values[J]);
                  if (W) return "values." + W
                }
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.common.v1.KeyValueList) return Y;
              var J = new PA.opentelemetry.proto.common.v1.KeyValueList;
              if (Y.values) {
                if (!Array.isArray(Y.values)) throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: array expected");
                J.values = [];
                for (var W = 0; W < Y.values.length; ++W) {
                  if (typeof Y.values[W] !== "object") throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: object expected");
                  J.values[W] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(Y.values[W])
                }
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.values = [];
              if (Y.values && Y.values.length) {
                W.values = [];
                for (var X = 0; X < Y.values.length; ++X) W.values[X] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(Y.values[X], J)
              }
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.common.v1.KeyValueList"
            }, Z
          }(), G.KeyValue = function() {
            function Z(I) {
              if (I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.key = null, Z.prototype.value = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.key != null && Object.hasOwnProperty.call(Y, "key")) J.uint32(10).string(Y.key);
              if (Y.value != null && Object.hasOwnProperty.call(Y, "value")) PA.opentelemetry.proto.common.v1.AnyValue.encode(Y.value, J.uint32(18).fork()).ldelim();
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.common.v1.KeyValue;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    V.key = Y.string();
                    break
                  }
                  case 2: {
                    V.value = PA.opentelemetry.proto.common.v1.AnyValue.decode(Y, Y.uint32());
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.key != null && Y.hasOwnProperty("key")) {
                if (!_A.isString(Y.key)) return "key: string expected"
              }
              if (Y.value != null && Y.hasOwnProperty("value")) {
                var J = PA.opentelemetry.proto.common.v1.AnyValue.verify(Y.value);
                if (J) return "value." + J
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.common.v1.KeyValue) return Y;
              var J = new PA.opentelemetry.proto.common.v1.KeyValue;
              if (Y.key != null) J.key = String(Y.key);
              if (Y.value != null) {
                if (typeof Y.value !== "object") throw TypeError(".opentelemetry.proto.common.v1.KeyValue.value: object expected");
                J.value = PA.opentelemetry.proto.common.v1.AnyValue.fromObject(Y.value)
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.defaults) W.key = "", W.value = null;
              if (Y.key != null && Y.hasOwnProperty("key")) W.key = Y.key;
              if (Y.value != null && Y.hasOwnProperty("value")) W.value = PA.opentelemetry.proto.common.v1.AnyValue.toObject(Y.value, J);
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.common.v1.KeyValue"
            }, Z
          }(), G.InstrumentationScope = function() {
            function Z(I) {
              if (this.attributes = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.name = null, Z.prototype.version = null, Z.prototype.attributes = _A.emptyArray, Z.prototype.droppedAttributesCount = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.name != null && Object.hasOwnProperty.call(Y, "name")) J.uint32(10).string(Y.name);
              if (Y.version != null && Object.hasOwnProperty.call(Y, "version")) J.uint32(18).string(Y.version);
              if (Y.attributes != null && Y.attributes.length)
                for (var W = 0; W < Y.attributes.length; ++W) PA.opentelemetry.proto.common.v1.KeyValue.encode(Y.attributes[W], J.uint32(26).fork()).ldelim();
              if (Y.droppedAttributesCount != null && Object.hasOwnProperty.call(Y, "droppedAttributesCount")) J.uint32(32).uint32(Y.droppedAttributesCount);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.common.v1.InstrumentationScope;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    V.name = Y.string();
                    break
                  }
                  case 2: {
                    V.version = Y.string();
                    break
                  }
                  case 3: {
                    if (!(V.attributes && V.attributes.length)) V.attributes = [];
                    V.attributes.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(Y, Y.uint32()));
                    break
                  }
                  case 4: {
                    V.droppedAttributesCount = Y.uint32();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.name != null && Y.hasOwnProperty("name")) {
                if (!_A.isString(Y.name)) return "name: string expected"
              }
              if (Y.version != null && Y.hasOwnProperty("version")) {
                if (!_A.isString(Y.version)) return "version: string expected"
              }
              if (Y.attributes != null && Y.hasOwnProperty("attributes")) {
                if (!Array.isArray(Y.attributes)) return "attributes: array expected";
                for (var J = 0; J < Y.attributes.length; ++J) {
                  var W = PA.opentelemetry.proto.common.v1.KeyValue.verify(Y.attributes[J]);
                  if (W) return "attributes." + W
                }
              }
              if (Y.droppedAttributesCount != null && Y.hasOwnProperty("droppedAttributesCount")) {
                if (!_A.isInteger(Y.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.common.v1.InstrumentationScope) return Y;
              var J = new PA.opentelemetry.proto.common.v1.InstrumentationScope;
              if (Y.name != null) J.name = String(Y.name);
              if (Y.version != null) J.version = String(Y.version);
              if (Y.attributes) {
                if (!Array.isArray(Y.attributes)) throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: array expected");
                J.attributes = [];
                for (var W = 0; W < Y.attributes.length; ++W) {
                  if (typeof Y.attributes[W] !== "object") throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: object expected");
                  J.attributes[W] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(Y.attributes[W])
                }
              }
              if (Y.droppedAttributesCount != null) J.droppedAttributesCount = Y.droppedAttributesCount >>> 0;
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.attributes = [];
              if (J.defaults) W.name = "", W.version = "", W.droppedAttributesCount = 0;
              if (Y.name != null && Y.hasOwnProperty("name")) W.name = Y.name;
              if (Y.version != null && Y.hasOwnProperty("version")) W.version = Y.version;
              if (Y.attributes && Y.attributes.length) {
                W.attributes = [];
                for (var X = 0; X < Y.attributes.length; ++X) W.attributes[X] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(Y.attributes[X], J)
              }
              if (Y.droppedAttributesCount != null && Y.hasOwnProperty("droppedAttributesCount")) W.droppedAttributesCount = Y.droppedAttributesCount;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.common.v1.InstrumentationScope"
            }, Z
          }(), G.EntityRef = function() {
            function Z(I) {
              if (this.idKeys = [], this.descriptionKeys = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.schemaUrl = null, Z.prototype.type = null, Z.prototype.idKeys = _A.emptyArray, Z.prototype.descriptionKeys = _A.emptyArray, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.schemaUrl != null && Object.hasOwnProperty.call(Y, "schemaUrl")) J.uint32(10).string(Y.schemaUrl);
              if (Y.type != null && Object.hasOwnProperty.call(Y, "type")) J.uint32(18).string(Y.type);
              if (Y.idKeys != null && Y.idKeys.length)
                for (var W = 0; W < Y.idKeys.length; ++W) J.uint32(26).string(Y.idKeys[W]);
              if (Y.descriptionKeys != null && Y.descriptionKeys.length)
                for (var W = 0; W < Y.descriptionKeys.length; ++W) J.uint32(34).string(Y.descriptionKeys[W]);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.common.v1.EntityRef;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    V.schemaUrl = Y.string();
                    break
                  }
                  case 2: {
                    V.type = Y.string();
                    break
                  }
                  case 3: {
                    if (!(V.idKeys && V.idKeys.length)) V.idKeys = [];
                    V.idKeys.push(Y.string());
                    break
                  }
                  case 4: {
                    if (!(V.descriptionKeys && V.descriptionKeys.length)) V.descriptionKeys = [];
                    V.descriptionKeys.push(Y.string());
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) {
                if (!_A.isString(Y.schemaUrl)) return "schemaUrl: string expected"
              }
              if (Y.type != null && Y.hasOwnProperty("type")) {
                if (!_A.isString(Y.type)) return "type: string expected"
              }
              if (Y.idKeys != null && Y.hasOwnProperty("idKeys")) {
                if (!Array.isArray(Y.idKeys)) return "idKeys: array expected";
                for (var J = 0; J < Y.idKeys.length; ++J)
                  if (!_A.isString(Y.idKeys[J])) return "idKeys: string[] expected"
              }
              if (Y.descriptionKeys != null && Y.hasOwnProperty("descriptionKeys")) {
                if (!Array.isArray(Y.descriptionKeys)) return "descriptionKeys: array expected";
                for (var J = 0; J < Y.descriptionKeys.length; ++J)
                  if (!_A.isString(Y.descriptionKeys[J])) return "descriptionKeys: string[] expected"
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.common.v1.EntityRef) return Y;
              var J = new PA.opentelemetry.proto.common.v1.EntityRef;
              if (Y.schemaUrl != null) J.schemaUrl = String(Y.schemaUrl);
              if (Y.type != null) J.type = String(Y.type);
              if (Y.idKeys) {
                if (!Array.isArray(Y.idKeys)) throw TypeError(".opentelemetry.proto.common.v1.EntityRef.idKeys: array expected");
                J.idKeys = [];
                for (var W = 0; W < Y.idKeys.length; ++W) J.idKeys[W] = String(Y.idKeys[W])
              }
              if (Y.descriptionKeys) {
                if (!Array.isArray(Y.descriptionKeys)) throw TypeError(".opentelemetry.proto.common.v1.EntityRef.descriptionKeys: array expected");
                J.descriptionKeys = [];
                for (var W = 0; W < Y.descriptionKeys.length; ++W) J.descriptionKeys[W] = String(Y.descriptionKeys[W])
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.idKeys = [], W.descriptionKeys = [];
              if (J.defaults) W.schemaUrl = "", W.type = "";
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) W.schemaUrl = Y.schemaUrl;
              if (Y.type != null && Y.hasOwnProperty("type")) W.type = Y.type;
              if (Y.idKeys && Y.idKeys.length) {
                W.idKeys = [];
                for (var X = 0; X < Y.idKeys.length; ++X) W.idKeys[X] = Y.idKeys[X]
              }
              if (Y.descriptionKeys && Y.descriptionKeys.length) {
                W.descriptionKeys = [];
                for (var X = 0; X < Y.descriptionKeys.length; ++X) W.descriptionKeys[X] = Y.descriptionKeys[X]
              }
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.common.v1.EntityRef"
            }, Z
          }(), G
        }(), B
      }(), Q.resource = function() {
        var B = {};
        return B.v1 = function() {
          var G = {};
          return G.Resource = function() {
            function Z(I) {
              if (this.attributes = [], this.entityRefs = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.attributes = _A.emptyArray, Z.prototype.droppedAttributesCount = null, Z.prototype.entityRefs = _A.emptyArray, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.attributes != null && Y.attributes.length)
                for (var W = 0; W < Y.attributes.length; ++W) PA.opentelemetry.proto.common.v1.KeyValue.encode(Y.attributes[W], J.uint32(10).fork()).ldelim();
              if (Y.droppedAttributesCount != null && Object.hasOwnProperty.call(Y, "droppedAttributesCount")) J.uint32(16).uint32(Y.droppedAttributesCount);
              if (Y.entityRefs != null && Y.entityRefs.length)
                for (var W = 0; W < Y.entityRefs.length; ++W) PA.opentelemetry.proto.common.v1.EntityRef.encode(Y.entityRefs[W], J.uint32(26).fork()).ldelim();
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.resource.v1.Resource;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    if (!(V.attributes && V.attributes.length)) V.attributes = [];
                    V.attributes.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(Y, Y.uint32()));
                    break
                  }
                  case 2: {
                    V.droppedAttributesCount = Y.uint32();
                    break
                  }
                  case 3: {
                    if (!(V.entityRefs && V.entityRefs.length)) V.entityRefs = [];
                    V.entityRefs.push(PA.opentelemetry.proto.common.v1.EntityRef.decode(Y, Y.uint32()));
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.attributes != null && Y.hasOwnProperty("attributes")) {
                if (!Array.isArray(Y.attributes)) return "attributes: array expected";
                for (var J = 0; J < Y.attributes.length; ++J) {
                  var W = PA.opentelemetry.proto.common.v1.KeyValue.verify(Y.attributes[J]);
                  if (W) return "attributes." + W
                }
              }
              if (Y.droppedAttributesCount != null && Y.hasOwnProperty("droppedAttributesCount")) {
                if (!_A.isInteger(Y.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
              }
              if (Y.entityRefs != null && Y.hasOwnProperty("entityRefs")) {
                if (!Array.isArray(Y.entityRefs)) return "entityRefs: array expected";
                for (var J = 0; J < Y.entityRefs.length; ++J) {
                  var W = PA.opentelemetry.proto.common.v1.EntityRef.verify(Y.entityRefs[J]);
                  if (W) return "entityRefs." + W
                }
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.resource.v1.Resource) return Y;
              var J = new PA.opentelemetry.proto.resource.v1.Resource;
              if (Y.attributes) {
                if (!Array.isArray(Y.attributes)) throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: array expected");
                J.attributes = [];
                for (var W = 0; W < Y.attributes.length; ++W) {
                  if (typeof Y.attributes[W] !== "object") throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: object expected");
                  J.attributes[W] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(Y.attributes[W])
                }
              }
              if (Y.droppedAttributesCount != null) J.droppedAttributesCount = Y.droppedAttributesCount >>> 0;
              if (Y.entityRefs) {
                if (!Array.isArray(Y.entityRefs)) throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: array expected");
                J.entityRefs = [];
                for (var W = 0; W < Y.entityRefs.length; ++W) {
                  if (typeof Y.entityRefs[W] !== "object") throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: object expected");
                  J.entityRefs[W] = PA.opentelemetry.proto.common.v1.EntityRef.fromObject(Y.entityRefs[W])
                }
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.attributes = [], W.entityRefs = [];
              if (J.defaults) W.droppedAttributesCount = 0;
              if (Y.attributes && Y.attributes.length) {
                W.attributes = [];
                for (var X = 0; X < Y.attributes.length; ++X) W.attributes[X] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(Y.attributes[X], J)
              }
              if (Y.droppedAttributesCount != null && Y.hasOwnProperty("droppedAttributesCount")) W.droppedAttributesCount = Y.droppedAttributesCount;
              if (Y.entityRefs && Y.entityRefs.length) {
                W.entityRefs = [];
                for (var X = 0; X < Y.entityRefs.length; ++X) W.entityRefs[X] = PA.opentelemetry.proto.common.v1.EntityRef.toObject(Y.entityRefs[X], J)
              }
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.resource.v1.Resource"
            }, Z
          }(), G
        }(), B
      }(), Q.trace = function() {
        var B = {};
        return B.v1 = function() {
          var G = {};
          return G.TracesData = function() {
            function Z(I) {
              if (this.resourceSpans = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.resourceSpans = _A.emptyArray, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.resourceSpans != null && Y.resourceSpans.length)
                for (var W = 0; W < Y.resourceSpans.length; ++W) PA.opentelemetry.proto.trace.v1.ResourceSpans.encode(Y.resourceSpans[W], J.uint32(10).fork()).ldelim();
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.trace.v1.TracesData;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    if (!(V.resourceSpans && V.resourceSpans.length)) V.resourceSpans = [];
                    V.resourceSpans.push(PA.opentelemetry.proto.trace.v1.ResourceSpans.decode(Y, Y.uint32()));
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.resourceSpans != null && Y.hasOwnProperty("resourceSpans")) {
                if (!Array.isArray(Y.resourceSpans)) return "resourceSpans: array expected";
                for (var J = 0; J < Y.resourceSpans.length; ++J) {
                  var W = PA.opentelemetry.proto.trace.v1.ResourceSpans.verify(Y.resourceSpans[J]);
                  if (W) return "resourceSpans." + W
                }
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.trace.v1.TracesData) return Y;
              var J = new PA.opentelemetry.proto.trace.v1.TracesData;
              if (Y.resourceSpans) {
                if (!Array.isArray(Y.resourceSpans)) throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: array expected");
                J.resourceSpans = [];
                for (var W = 0; W < Y.resourceSpans.length; ++W) {
                  if (typeof Y.resourceSpans[W] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: object expected");
                  J.resourceSpans[W] = PA.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(Y.resourceSpans[W])
                }
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.resourceSpans = [];
              if (Y.resourceSpans && Y.resourceSpans.length) {
                W.resourceSpans = [];
                for (var X = 0; X < Y.resourceSpans.length; ++X) W.resourceSpans[X] = PA.opentelemetry.proto.trace.v1.ResourceSpans.toObject(Y.resourceSpans[X], J)
              }
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.trace.v1.TracesData"
            }, Z
          }(), G.ResourceSpans = function() {
            function Z(I) {
              if (this.scopeSpans = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.resource = null, Z.prototype.scopeSpans = _A.emptyArray, Z.prototype.schemaUrl = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.resource != null && Object.hasOwnProperty.call(Y, "resource")) PA.opentelemetry.proto.resource.v1.Resource.encode(Y.resource, J.uint32(10).fork()).ldelim();
              if (Y.scopeSpans != null && Y.scopeSpans.length)
                for (var W = 0; W < Y.scopeSpans.length; ++W) PA.opentelemetry.proto.trace.v1.ScopeSpans.encode(Y.scopeSpans[W], J.uint32(18).fork()).ldelim();
              if (Y.schemaUrl != null && Object.hasOwnProperty.call(Y, "schemaUrl")) J.uint32(26).string(Y.schemaUrl);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.trace.v1.ResourceSpans;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    V.resource = PA.opentelemetry.proto.resource.v1.Resource.decode(Y, Y.uint32());
                    break
                  }
                  case 2: {
                    if (!(V.scopeSpans && V.scopeSpans.length)) V.scopeSpans = [];
                    V.scopeSpans.push(PA.opentelemetry.proto.trace.v1.ScopeSpans.decode(Y, Y.uint32()));
                    break
                  }
                  case 3: {
                    V.schemaUrl = Y.string();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.resource != null && Y.hasOwnProperty("resource")) {
                var J = PA.opentelemetry.proto.resource.v1.Resource.verify(Y.resource);
                if (J) return "resource." + J
              }
              if (Y.scopeSpans != null && Y.hasOwnProperty("scopeSpans")) {
                if (!Array.isArray(Y.scopeSpans)) return "scopeSpans: array expected";
                for (var W = 0; W < Y.scopeSpans.length; ++W) {
                  var J = PA.opentelemetry.proto.trace.v1.ScopeSpans.verify(Y.scopeSpans[W]);
                  if (J) return "scopeSpans." + J
                }
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) {
                if (!_A.isString(Y.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.trace.v1.ResourceSpans) return Y;
              var J = new PA.opentelemetry.proto.trace.v1.ResourceSpans;
              if (Y.resource != null) {
                if (typeof Y.resource !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.resource: object expected");
                J.resource = PA.opentelemetry.proto.resource.v1.Resource.fromObject(Y.resource)
              }
              if (Y.scopeSpans) {
                if (!Array.isArray(Y.scopeSpans)) throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: array expected");
                J.scopeSpans = [];
                for (var W = 0; W < Y.scopeSpans.length; ++W) {
                  if (typeof Y.scopeSpans[W] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: object expected");
                  J.scopeSpans[W] = PA.opentelemetry.proto.trace.v1.ScopeSpans.fromObject(Y.scopeSpans[W])
                }
              }
              if (Y.schemaUrl != null) J.schemaUrl = String(Y.schemaUrl);
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.scopeSpans = [];
              if (J.defaults) W.resource = null, W.schemaUrl = "";
              if (Y.resource != null && Y.hasOwnProperty("resource")) W.resource = PA.opentelemetry.proto.resource.v1.Resource.toObject(Y.resource, J);
              if (Y.scopeSpans && Y.scopeSpans.length) {
                W.scopeSpans = [];
                for (var X = 0; X < Y.scopeSpans.length; ++X) W.scopeSpans[X] = PA.opentelemetry.proto.trace.v1.ScopeSpans.toObject(Y.scopeSpans[X], J)
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) W.schemaUrl = Y.schemaUrl;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.trace.v1.ResourceSpans"
            }, Z
          }(), G.ScopeSpans = function() {
            function Z(I) {
              if (this.spans = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.scope = null, Z.prototype.spans = _A.emptyArray, Z.prototype.schemaUrl = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.scope != null && Object.hasOwnProperty.call(Y, "scope")) PA.opentelemetry.proto.common.v1.InstrumentationScope.encode(Y.scope, J.uint32(10).fork()).ldelim();
              if (Y.spans != null && Y.spans.length)
                for (var W = 0; W < Y.spans.length; ++W) PA.opentelemetry.proto.trace.v1.Span.encode(Y.spans[W], J.uint32(18).fork()).ldelim();
              if (Y.schemaUrl != null && Object.hasOwnProperty.call(Y, "schemaUrl")) J.uint32(26).string(Y.schemaUrl);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.trace.v1.ScopeSpans;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    V.scope = PA.opentelemetry.proto.common.v1.InstrumentationScope.decode(Y, Y.uint32());
                    break
                  }
                  case 2: {
                    if (!(V.spans && V.spans.length)) V.spans = [];
                    V.spans.push(PA.opentelemetry.proto.trace.v1.Span.decode(Y, Y.uint32()));
                    break
                  }
                  case 3: {
                    V.schemaUrl = Y.string();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.scope != null && Y.hasOwnProperty("scope")) {
                var J = PA.opentelemetry.proto.common.v1.InstrumentationScope.verify(Y.scope);
                if (J) return "scope." + J
              }
              if (Y.spans != null && Y.hasOwnProperty("spans")) {
                if (!Array.isArray(Y.spans)) return "spans: array expected";
                for (var W = 0; W < Y.spans.length; ++W) {
                  var J = PA.opentelemetry.proto.trace.v1.Span.verify(Y.spans[W]);
                  if (J) return "spans." + J
                }
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) {
                if (!_A.isString(Y.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.trace.v1.ScopeSpans) return Y;
              var J = new PA.opentelemetry.proto.trace.v1.ScopeSpans;
              if (Y.scope != null) {
                if (typeof Y.scope !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.scope: object expected");
                J.scope = PA.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(Y.scope)
              }
              if (Y.spans) {
                if (!Array.isArray(Y.spans)) throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: array expected");
                J.spans = [];
                for (var W = 0; W < Y.spans.length; ++W) {
                  if (typeof Y.spans[W] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: object expected");
                  J.spans[W] = PA.opentelemetry.proto.trace.v1.Span.fromObject(Y.spans[W])
                }
              }
              if (Y.schemaUrl != null) J.schemaUrl = String(Y.schemaUrl);
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.spans = [];
              if (J.defaults) W.scope = null, W.schemaUrl = "";
              if (Y.scope != null && Y.hasOwnProperty("scope")) W.scope = PA.opentelemetry.proto.common.v1.InstrumentationScope.toObject(Y.scope, J);
              if (Y.spans && Y.spans.length) {
                W.spans = [];
                for (var X = 0; X < Y.spans.length; ++X) W.spans[X] = PA.opentelemetry.proto.trace.v1.Span.toObject(Y.spans[X], J)
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) W.schemaUrl = Y.schemaUrl;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.trace.v1.ScopeSpans"
            }, Z
          }(), G.Span = function() {
            function Z(I) {
              if (this.attributes = [], this.events = [], this.links = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.traceId = null, Z.prototype.spanId = null, Z.prototype.traceState = null, Z.prototype.parentSpanId = null, Z.prototype.flags = null, Z.prototype.name = null, Z.prototype.kind = null, Z.prototype.startTimeUnixNano = null, Z.prototype.endTimeUnixNano = null, Z.prototype.attributes = _A.emptyArray, Z.prototype.droppedAttributesCount = null, Z.prototype.events = _A.emptyArray, Z.prototype.droppedEventsCount = null, Z.prototype.links = _A.emptyArray, Z.prototype.droppedLinksCount = null, Z.prototype.status = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.traceId != null && Object.hasOwnProperty.call(Y, "traceId")) J.uint32(10).bytes(Y.traceId);
              if (Y.spanId != null && Object.hasOwnProperty.call(Y, "spanId")) J.uint32(18).bytes(Y.spanId);
              if (Y.traceState != null && Object.hasOwnProperty.call(Y, "traceState")) J.uint32(26).string(Y.traceState);
              if (Y.parentSpanId != null && Object.hasOwnProperty.call(Y, "parentSpanId")) J.uint32(34).bytes(Y.parentSpanId);
              if (Y.name != null && Object.hasOwnProperty.call(Y, "name")) J.uint32(42).string(Y.name);
              if (Y.kind != null && Object.hasOwnProperty.call(Y, "kind")) J.uint32(48).int32(Y.kind);
              if (Y.startTimeUnixNano != null && Object.hasOwnProperty.call(Y, "startTimeUnixNano")) J.uint32(57).fixed64(Y.startTimeUnixNano);
              if (Y.endTimeUnixNano != null && Object.hasOwnProperty.call(Y, "endTimeUnixNano")) J.uint32(65).fixed64(Y.endTimeUnixNano);
              if (Y.attributes != null && Y.attributes.length)
                for (var W = 0; W < Y.attributes.length; ++W) PA.opentelemetry.proto.common.v1.KeyValue.encode(Y.attributes[W], J.uint32(74).fork()).ldelim();
              if (Y.droppedAttributesCount != null && Object.hasOwnProperty.call(Y, "droppedAttributesCount")) J.uint32(80).uint32(Y.droppedAttributesCount);
              if (Y.events != null && Y.events.length)
                for (var W = 0; W < Y.events.length; ++W) PA.opentelemetry.proto.trace.v1.Span.Event.encode(Y.events[W], J.uint32(90).fork()).ldelim();
              if (Y.droppedEventsCount != null && Object.hasOwnProperty.call(Y, "droppedEventsCount")) J.uint32(96).uint32(Y.droppedEventsCount);
              if (Y.links != null && Y.links.length)
                for (var W = 0; W < Y.links.length; ++W) PA.opentelemetry.proto.trace.v1.Span.Link.encode(Y.links[W], J.uint32(106).fork()).ldelim();
              if (Y.droppedLinksCount != null && Object.hasOwnProperty.call(Y, "droppedLinksCount")) J.uint32(112).uint32(Y.droppedLinksCount);
              if (Y.status != null && Object.hasOwnProperty.call(Y, "status")) PA.opentelemetry.proto.trace.v1.Status.encode(Y.status, J.uint32(122).fork()).ldelim();
              if (Y.flags != null && Object.hasOwnProperty.call(Y, "flags")) J.uint32(133).fixed32(Y.flags);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.trace.v1.Span;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    V.traceId = Y.bytes();
                    break
                  }
                  case 2: {
                    V.spanId = Y.bytes();
                    break
                  }
                  case 3: {
                    V.traceState = Y.string();
                    break
                  }
                  case 4: {
                    V.parentSpanId = Y.bytes();
                    break
                  }
                  case 16: {
                    V.flags = Y.fixed32();
                    break
                  }
                  case 5: {
                    V.name = Y.string();
                    break
                  }
                  case 6: {
                    V.kind = Y.int32();
                    break
                  }
                  case 7: {
                    V.startTimeUnixNano = Y.fixed64();
                    break
                  }
                  case 8: {
                    V.endTimeUnixNano = Y.fixed64();
                    break
                  }
                  case 9: {
                    if (!(V.attributes && V.attributes.length)) V.attributes = [];
                    V.attributes.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(Y, Y.uint32()));
                    break
                  }
                  case 10: {
                    V.droppedAttributesCount = Y.uint32();
                    break
                  }
                  case 11: {
                    if (!(V.events && V.events.length)) V.events = [];
                    V.events.push(PA.opentelemetry.proto.trace.v1.Span.Event.decode(Y, Y.uint32()));
                    break
                  }
                  case 12: {
                    V.droppedEventsCount = Y.uint32();
                    break
                  }
                  case 13: {
                    if (!(V.links && V.links.length)) V.links = [];
                    V.links.push(PA.opentelemetry.proto.trace.v1.Span.Link.decode(Y, Y.uint32()));
                    break
                  }
                  case 14: {
                    V.droppedLinksCount = Y.uint32();
                    break
                  }
                  case 15: {
                    V.status = PA.opentelemetry.proto.trace.v1.Status.decode(Y, Y.uint32());
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.traceId != null && Y.hasOwnProperty("traceId")) {
                if (!(Y.traceId && typeof Y.traceId.length === "number" || _A.isString(Y.traceId))) return "traceId: buffer expected"
              }
              if (Y.spanId != null && Y.hasOwnProperty("spanId")) {
                if (!(Y.spanId && typeof Y.spanId.length === "number" || _A.isString(Y.spanId))) return "spanId: buffer expected"
              }
              if (Y.traceState != null && Y.hasOwnProperty("traceState")) {
                if (!_A.isString(Y.traceState)) return "traceState: string expected"
              }
              if (Y.parentSpanId != null && Y.hasOwnProperty("parentSpanId")) {
                if (!(Y.parentSpanId && typeof Y.parentSpanId.length === "number" || _A.isString(Y.parentSpanId))) return "parentSpanId: buffer expected"
              }
              if (Y.flags != null && Y.hasOwnProperty("flags")) {
                if (!_A.isInteger(Y.flags)) return "flags: integer expected"
              }
              if (Y.name != null && Y.hasOwnProperty("name")) {
                if (!_A.isString(Y.name)) return "name: string expected"
              }
              if (Y.kind != null && Y.hasOwnProperty("kind")) switch (Y.kind) {
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
              if (Y.startTimeUnixNano != null && Y.hasOwnProperty("startTimeUnixNano")) {
                if (!_A.isInteger(Y.startTimeUnixNano) && !(Y.startTimeUnixNano && _A.isInteger(Y.startTimeUnixNano.low) && _A.isInteger(Y.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
              }
              if (Y.endTimeUnixNano != null && Y.hasOwnProperty("endTimeUnixNano")) {
                if (!_A.isInteger(Y.endTimeUnixNano) && !(Y.endTimeUnixNano && _A.isInteger(Y.endTimeUnixNano.low) && _A.isInteger(Y.endTimeUnixNano.high))) return "endTimeUnixNano: integer|Long expected"
              }
              if (Y.attributes != null && Y.hasOwnProperty("attributes")) {
                if (!Array.isArray(Y.attributes)) return "attributes: array expected";
                for (var J = 0; J < Y.attributes.length; ++J) {
                  var W = PA.opentelemetry.proto.common.v1.KeyValue.verify(Y.attributes[J]);
                  if (W) return "attributes." + W
                }
              }
              if (Y.droppedAttributesCount != null && Y.hasOwnProperty("droppedAttributesCount")) {
                if (!_A.isInteger(Y.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
              }
              if (Y.events != null && Y.hasOwnProperty("events")) {
                if (!Array.isArray(Y.events)) return "events: array expected";
                for (var J = 0; J < Y.events.length; ++J) {
                  var W = PA.opentelemetry.proto.trace.v1.Span.Event.verify(Y.events[J]);
                  if (W) return "events." + W
                }
              }
              if (Y.droppedEventsCount != null && Y.hasOwnProperty("droppedEventsCount")) {
                if (!_A.isInteger(Y.droppedEventsCount)) return "droppedEventsCount: integer expected"
              }
              if (Y.links != null && Y.hasOwnProperty("links")) {
                if (!Array.isArray(Y.links)) return "links: array expected";
                for (var J = 0; J < Y.links.length; ++J) {
                  var W = PA.opentelemetry.proto.trace.v1.Span.Link.verify(Y.links[J]);
                  if (W) return "links." + W
                }
              }
              if (Y.droppedLinksCount != null && Y.hasOwnProperty("droppedLinksCount")) {
                if (!_A.isInteger(Y.droppedLinksCount)) return "droppedLinksCount: integer expected"
              }
              if (Y.status != null && Y.hasOwnProperty("status")) {
                var W = PA.opentelemetry.proto.trace.v1.Status.verify(Y.status);
                if (W) return "status." + W
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.trace.v1.Span) return Y;
              var J = new PA.opentelemetry.proto.trace.v1.Span;
              if (Y.traceId != null) {
                if (typeof Y.traceId === "string") _A.base64.decode(Y.traceId, J.traceId = _A.newBuffer(_A.base64.length(Y.traceId)), 0);
                else if (Y.traceId.length >= 0) J.traceId = Y.traceId
              }
              if (Y.spanId != null) {
                if (typeof Y.spanId === "string") _A.base64.decode(Y.spanId, J.spanId = _A.newBuffer(_A.base64.length(Y.spanId)), 0);
                else if (Y.spanId.length >= 0) J.spanId = Y.spanId
              }
              if (Y.traceState != null) J.traceState = String(Y.traceState);
              if (Y.parentSpanId != null) {
                if (typeof Y.parentSpanId === "string") _A.base64.decode(Y.parentSpanId, J.parentSpanId = _A.newBuffer(_A.base64.length(Y.parentSpanId)), 0);
                else if (Y.parentSpanId.length >= 0) J.parentSpanId = Y.parentSpanId
              }
              if (Y.flags != null) J.flags = Y.flags >>> 0;
              if (Y.name != null) J.name = String(Y.name);
              switch (Y.kind) {
                default:
                  if (typeof Y.kind === "number") {
                    J.kind = Y.kind;
                    break
                  }
                  break;
                case "SPAN_KIND_UNSPECIFIED":
                case 0:
                  J.kind = 0;
                  break;
                case "SPAN_KIND_INTERNAL":
                case 1:
                  J.kind = 1;
                  break;
                case "SPAN_KIND_SERVER":
                case 2:
                  J.kind = 2;
                  break;
                case "SPAN_KIND_CLIENT":
                case 3:
                  J.kind = 3;
                  break;
                case "SPAN_KIND_PRODUCER":
                case 4:
                  J.kind = 4;
                  break;
                case "SPAN_KIND_CONSUMER":
                case 5:
                  J.kind = 5;
                  break
              }
              if (Y.startTimeUnixNano != null) {
                if (_A.Long)(J.startTimeUnixNano = _A.Long.fromValue(Y.startTimeUnixNano)).unsigned = !1;
                else if (typeof Y.startTimeUnixNano === "string") J.startTimeUnixNano = parseInt(Y.startTimeUnixNano, 10);
                else if (typeof Y.startTimeUnixNano === "number") J.startTimeUnixNano = Y.startTimeUnixNano;
                else if (typeof Y.startTimeUnixNano === "object") J.startTimeUnixNano = new _A.LongBits(Y.startTimeUnixNano.low >>> 0, Y.startTimeUnixNano.high >>> 0).toNumber()
              }
              if (Y.endTimeUnixNano != null) {
                if (_A.Long)(J.endTimeUnixNano = _A.Long.fromValue(Y.endTimeUnixNano)).unsigned = !1;
                else if (typeof Y.endTimeUnixNano === "string") J.endTimeUnixNano = parseInt(Y.endTimeUnixNano, 10);
                else if (typeof Y.endTimeUnixNano === "number") J.endTimeUnixNano = Y.endTimeUnixNano;
                else if (typeof Y.endTimeUnixNano === "object") J.endTimeUnixNano = new _A.LongBits(Y.endTimeUnixNano.low >>> 0, Y.endTimeUnixNano.high >>> 0).toNumber()
              }
              if (Y.attributes) {
                if (!Array.isArray(Y.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: array expected");
                J.attributes = [];
                for (var W = 0; W < Y.attributes.length; ++W) {
                  if (typeof Y.attributes[W] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: object expected");
                  J.attributes[W] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(Y.attributes[W])
                }
              }
              if (Y.droppedAttributesCount != null) J.droppedAttributesCount = Y.droppedAttributesCount >>> 0;
              if (Y.events) {
                if (!Array.isArray(Y.events)) throw TypeError(".opentelemetry.proto.trace.v1.Span.events: array expected");
                J.events = [];
                for (var W = 0; W < Y.events.length; ++W) {
                  if (typeof Y.events[W] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.events: object expected");
                  J.events[W] = PA.opentelemetry.proto.trace.v1.Span.Event.fromObject(Y.events[W])
                }
              }
              if (Y.droppedEventsCount != null) J.droppedEventsCount = Y.droppedEventsCount >>> 0;
              if (Y.links) {
                if (!Array.isArray(Y.links)) throw TypeError(".opentelemetry.proto.trace.v1.Span.links: array expected");
                J.links = [];
                for (var W = 0; W < Y.links.length; ++W) {
                  if (typeof Y.links[W] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.links: object expected");
                  J.links[W] = PA.opentelemetry.proto.trace.v1.Span.Link.fromObject(Y.links[W])
                }
              }
              if (Y.droppedLinksCount != null) J.droppedLinksCount = Y.droppedLinksCount >>> 0;
              if (Y.status != null) {
                if (typeof Y.status !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.status: object expected");
                J.status = PA.opentelemetry.proto.trace.v1.Status.fromObject(Y.status)
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.attributes = [], W.events = [], W.links = [];
              if (J.defaults) {
                if (J.bytes === String) W.traceId = "";
                else if (W.traceId = [], J.bytes !== Array) W.traceId = _A.newBuffer(W.traceId);
                if (J.bytes === String) W.spanId = "";
                else if (W.spanId = [], J.bytes !== Array) W.spanId = _A.newBuffer(W.spanId);
                if (W.traceState = "", J.bytes === String) W.parentSpanId = "";
                else if (W.parentSpanId = [], J.bytes !== Array) W.parentSpanId = _A.newBuffer(W.parentSpanId);
                if (W.name = "", W.kind = J.enums === String ? "SPAN_KIND_UNSPECIFIED" : 0, _A.Long) {
                  var X = new _A.Long(0, 0, !1);
                  W.startTimeUnixNano = J.longs === String ? X.toString() : J.longs === Number ? X.toNumber() : X
                } else W.startTimeUnixNano = J.longs === String ? "0" : 0;
                if (_A.Long) {
                  var X = new _A.Long(0, 0, !1);
                  W.endTimeUnixNano = J.longs === String ? X.toString() : J.longs === Number ? X.toNumber() : X
                } else W.endTimeUnixNano = J.longs === String ? "0" : 0;
                W.droppedAttributesCount = 0, W.droppedEventsCount = 0, W.droppedLinksCount = 0, W.status = null, W.flags = 0
              }
              if (Y.traceId != null && Y.hasOwnProperty("traceId")) W.traceId = J.bytes === String ? _A.base64.encode(Y.traceId, 0, Y.traceId.length) : J.bytes === Array ? Array.prototype.slice.call(Y.traceId) : Y.traceId;
              if (Y.spanId != null && Y.hasOwnProperty("spanId")) W.spanId = J.bytes === String ? _A.base64.encode(Y.spanId, 0, Y.spanId.length) : J.bytes === Array ? Array.prototype.slice.call(Y.spanId) : Y.spanId;
              if (Y.traceState != null && Y.hasOwnProperty("traceState")) W.traceState = Y.traceState;
              if (Y.parentSpanId != null && Y.hasOwnProperty("parentSpanId")) W.parentSpanId = J.bytes === String ? _A.base64.encode(Y.parentSpanId, 0, Y.parentSpanId.length) : J.bytes === Array ? Array.prototype.slice.call(Y.parentSpanId) : Y.parentSpanId;
              if (Y.name != null && Y.hasOwnProperty("name")) W.name = Y.name;
              if (Y.kind != null && Y.hasOwnProperty("kind")) W.kind = J.enums === String ? PA.opentelemetry.proto.trace.v1.Span.SpanKind[Y.kind] === void 0 ? Y.kind : PA.opentelemetry.proto.trace.v1.Span.SpanKind[Y.kind] : Y.kind;
              if (Y.startTimeUnixNano != null && Y.hasOwnProperty("startTimeUnixNano"))
                if (typeof Y.startTimeUnixNano === "number") W.startTimeUnixNano = J.longs === String ? String(Y.startTimeUnixNano) : Y.startTimeUnixNano;
                else W.startTimeUnixNano = J.longs === String ? _A.Long.prototype.toString.call(Y.startTimeUnixNano) : J.longs === Number ? new _A.LongBits(Y.startTimeUnixNano.low >>> 0, Y.startTimeUnixNano.high >>> 0).toNumber() : Y.startTimeUnixNano;
              if (Y.endTimeUnixNano != null && Y.hasOwnProperty("endTimeUnixNano"))
                if (typeof Y.endTimeUnixNano === "number") W.endTimeUnixNano = J.longs === String ? String(Y.endTimeUnixNano) : Y.endTimeUnixNano;
                else W.endTimeUnixNano = J.longs === String ? _A.Long.prototype.toString.call(Y.endTimeUnixNano) : J.longs === Number ? new _A.LongBits(Y.endTimeUnixNano.low >>> 0, Y.endTimeUnixNano.high >>> 0).toNumber() : Y.endTimeUnixNano;
              if (Y.attributes && Y.attributes.length) {
                W.attributes = [];
                for (var V = 0; V < Y.attributes.length; ++V) W.attributes[V] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(Y.attributes[V], J)
              }
              if (Y.droppedAttributesCount != null && Y.hasOwnProperty("droppedAttributesCount")) W.droppedAttributesCount = Y.droppedAttributesCount;
              if (Y.events && Y.events.length) {
                W.events = [];
                for (var V = 0; V < Y.events.length; ++V) W.events[V] = PA.opentelemetry.proto.trace.v1.Span.Event.toObject(Y.events[V], J)
              }
              if (Y.droppedEventsCount != null && Y.hasOwnProperty("droppedEventsCount")) W.droppedEventsCount = Y.droppedEventsCount;
              if (Y.links && Y.links.length) {
                W.links = [];
                for (var V = 0; V < Y.links.length; ++V) W.links[V] = PA.opentelemetry.proto.trace.v1.Span.Link.toObject(Y.links[V], J)
              }
              if (Y.droppedLinksCount != null && Y.hasOwnProperty("droppedLinksCount")) W.droppedLinksCount = Y.droppedLinksCount;
              if (Y.status != null && Y.hasOwnProperty("status")) W.status = PA.opentelemetry.proto.trace.v1.Status.toObject(Y.status, J);
              if (Y.flags != null && Y.hasOwnProperty("flags")) W.flags = Y.flags;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.trace.v1.Span"
            }, Z.SpanKind = function() {
              var I = {},
                Y = Object.create(I);
              return Y[I[0] = "SPAN_KIND_UNSPECIFIED"] = 0, Y[I[1] = "SPAN_KIND_INTERNAL"] = 1, Y[I[2] = "SPAN_KIND_SERVER"] = 2, Y[I[3] = "SPAN_KIND_CLIENT"] = 3, Y[I[4] = "SPAN_KIND_PRODUCER"] = 4, Y[I[5] = "SPAN_KIND_CONSUMER"] = 5, Y
            }(), Z.Event = function() {
              function I(Y) {
                if (this.attributes = [], Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.timeUnixNano = null, I.prototype.name = null, I.prototype.attributes = _A.emptyArray, I.prototype.droppedAttributesCount = null, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.timeUnixNano != null && Object.hasOwnProperty.call(J, "timeUnixNano")) W.uint32(9).fixed64(J.timeUnixNano);
                if (J.name != null && Object.hasOwnProperty.call(J, "name")) W.uint32(18).string(J.name);
                if (J.attributes != null && J.attributes.length)
                  for (var X = 0; X < J.attributes.length; ++X) PA.opentelemetry.proto.common.v1.KeyValue.encode(J.attributes[X], W.uint32(26).fork()).ldelim();
                if (J.droppedAttributesCount != null && Object.hasOwnProperty.call(J, "droppedAttributesCount")) W.uint32(32).uint32(J.droppedAttributesCount);
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.trace.v1.Span.Event;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      F.timeUnixNano = J.fixed64();
                      break
                    }
                    case 2: {
                      F.name = J.string();
                      break
                    }
                    case 3: {
                      if (!(F.attributes && F.attributes.length)) F.attributes = [];
                      F.attributes.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                      break
                    }
                    case 4: {
                      F.droppedAttributesCount = J.uint32();
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano")) {
                  if (!_A.isInteger(J.timeUnixNano) && !(J.timeUnixNano && _A.isInteger(J.timeUnixNano.low) && _A.isInteger(J.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                }
                if (J.name != null && J.hasOwnProperty("name")) {
                  if (!_A.isString(J.name)) return "name: string expected"
                }
                if (J.attributes != null && J.hasOwnProperty("attributes")) {
                  if (!Array.isArray(J.attributes)) return "attributes: array expected";
                  for (var W = 0; W < J.attributes.length; ++W) {
                    var X = PA.opentelemetry.proto.common.v1.KeyValue.verify(J.attributes[W]);
                    if (X) return "attributes." + X
                  }
                }
                if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) {
                  if (!_A.isInteger(J.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.trace.v1.Span.Event) return J;
                var W = new PA.opentelemetry.proto.trace.v1.Span.Event;
                if (J.timeUnixNano != null) {
                  if (_A.Long)(W.timeUnixNano = _A.Long.fromValue(J.timeUnixNano)).unsigned = !1;
                  else if (typeof J.timeUnixNano === "string") W.timeUnixNano = parseInt(J.timeUnixNano, 10);
                  else if (typeof J.timeUnixNano === "number") W.timeUnixNano = J.timeUnixNano;
                  else if (typeof J.timeUnixNano === "object") W.timeUnixNano = new _A.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber()
                }
                if (J.name != null) W.name = String(J.name);
                if (J.attributes) {
                  if (!Array.isArray(J.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: array expected");
                  W.attributes = [];
                  for (var X = 0; X < J.attributes.length; ++X) {
                    if (typeof J.attributes[X] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: object expected");
                    W.attributes[X] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.attributes[X])
                  }
                }
                if (J.droppedAttributesCount != null) W.droppedAttributesCount = J.droppedAttributesCount >>> 0;
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.arrays || W.defaults) X.attributes = [];
                if (W.defaults) {
                  if (_A.Long) {
                    var V = new _A.Long(0, 0, !1);
                    X.timeUnixNano = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                  } else X.timeUnixNano = W.longs === String ? "0" : 0;
                  X.name = "", X.droppedAttributesCount = 0
                }
                if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano"))
                  if (typeof J.timeUnixNano === "number") X.timeUnixNano = W.longs === String ? String(J.timeUnixNano) : J.timeUnixNano;
                  else X.timeUnixNano = W.longs === String ? _A.Long.prototype.toString.call(J.timeUnixNano) : W.longs === Number ? new _A.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber() : J.timeUnixNano;
                if (J.name != null && J.hasOwnProperty("name")) X.name = J.name;
                if (J.attributes && J.attributes.length) {
                  X.attributes = [];
                  for (var F = 0; F < J.attributes.length; ++F) X.attributes[F] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(J.attributes[F], W)
                }
                if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) X.droppedAttributesCount = J.droppedAttributesCount;
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.trace.v1.Span.Event"
              }, I
            }(), Z.Link = function() {
              function I(Y) {
                if (this.attributes = [], Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.traceId = null, I.prototype.spanId = null, I.prototype.traceState = null, I.prototype.attributes = _A.emptyArray, I.prototype.droppedAttributesCount = null, I.prototype.flags = null, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.traceId != null && Object.hasOwnProperty.call(J, "traceId")) W.uint32(10).bytes(J.traceId);
                if (J.spanId != null && Object.hasOwnProperty.call(J, "spanId")) W.uint32(18).bytes(J.spanId);
                if (J.traceState != null && Object.hasOwnProperty.call(J, "traceState")) W.uint32(26).string(J.traceState);
                if (J.attributes != null && J.attributes.length)
                  for (var X = 0; X < J.attributes.length; ++X) PA.opentelemetry.proto.common.v1.KeyValue.encode(J.attributes[X], W.uint32(34).fork()).ldelim();
                if (J.droppedAttributesCount != null && Object.hasOwnProperty.call(J, "droppedAttributesCount")) W.uint32(40).uint32(J.droppedAttributesCount);
                if (J.flags != null && Object.hasOwnProperty.call(J, "flags")) W.uint32(53).fixed32(J.flags);
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.trace.v1.Span.Link;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      F.traceId = J.bytes();
                      break
                    }
                    case 2: {
                      F.spanId = J.bytes();
                      break
                    }
                    case 3: {
                      F.traceState = J.string();
                      break
                    }
                    case 4: {
                      if (!(F.attributes && F.attributes.length)) F.attributes = [];
                      F.attributes.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                      break
                    }
                    case 5: {
                      F.droppedAttributesCount = J.uint32();
                      break
                    }
                    case 6: {
                      F.flags = J.fixed32();
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.traceId != null && J.hasOwnProperty("traceId")) {
                  if (!(J.traceId && typeof J.traceId.length === "number" || _A.isString(J.traceId))) return "traceId: buffer expected"
                }
                if (J.spanId != null && J.hasOwnProperty("spanId")) {
                  if (!(J.spanId && typeof J.spanId.length === "number" || _A.isString(J.spanId))) return "spanId: buffer expected"
                }
                if (J.traceState != null && J.hasOwnProperty("traceState")) {
                  if (!_A.isString(J.traceState)) return "traceState: string expected"
                }
                if (J.attributes != null && J.hasOwnProperty("attributes")) {
                  if (!Array.isArray(J.attributes)) return "attributes: array expected";
                  for (var W = 0; W < J.attributes.length; ++W) {
                    var X = PA.opentelemetry.proto.common.v1.KeyValue.verify(J.attributes[W]);
                    if (X) return "attributes." + X
                  }
                }
                if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) {
                  if (!_A.isInteger(J.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                }
                if (J.flags != null && J.hasOwnProperty("flags")) {
                  if (!_A.isInteger(J.flags)) return "flags: integer expected"
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.trace.v1.Span.Link) return J;
                var W = new PA.opentelemetry.proto.trace.v1.Span.Link;
                if (J.traceId != null) {
                  if (typeof J.traceId === "string") _A.base64.decode(J.traceId, W.traceId = _A.newBuffer(_A.base64.length(J.traceId)), 0);
                  else if (J.traceId.length >= 0) W.traceId = J.traceId
                }
                if (J.spanId != null) {
                  if (typeof J.spanId === "string") _A.base64.decode(J.spanId, W.spanId = _A.newBuffer(_A.base64.length(J.spanId)), 0);
                  else if (J.spanId.length >= 0) W.spanId = J.spanId
                }
                if (J.traceState != null) W.traceState = String(J.traceState);
                if (J.attributes) {
                  if (!Array.isArray(J.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: array expected");
                  W.attributes = [];
                  for (var X = 0; X < J.attributes.length; ++X) {
                    if (typeof J.attributes[X] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: object expected");
                    W.attributes[X] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.attributes[X])
                  }
                }
                if (J.droppedAttributesCount != null) W.droppedAttributesCount = J.droppedAttributesCount >>> 0;
                if (J.flags != null) W.flags = J.flags >>> 0;
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.arrays || W.defaults) X.attributes = [];
                if (W.defaults) {
                  if (W.bytes === String) X.traceId = "";
                  else if (X.traceId = [], W.bytes !== Array) X.traceId = _A.newBuffer(X.traceId);
                  if (W.bytes === String) X.spanId = "";
                  else if (X.spanId = [], W.bytes !== Array) X.spanId = _A.newBuffer(X.spanId);
                  X.traceState = "", X.droppedAttributesCount = 0, X.flags = 0
                }
                if (J.traceId != null && J.hasOwnProperty("traceId")) X.traceId = W.bytes === String ? _A.base64.encode(J.traceId, 0, J.traceId.length) : W.bytes === Array ? Array.prototype.slice.call(J.traceId) : J.traceId;
                if (J.spanId != null && J.hasOwnProperty("spanId")) X.spanId = W.bytes === String ? _A.base64.encode(J.spanId, 0, J.spanId.length) : W.bytes === Array ? Array.prototype.slice.call(J.spanId) : J.spanId;
                if (J.traceState != null && J.hasOwnProperty("traceState")) X.traceState = J.traceState;
                if (J.attributes && J.attributes.length) {
                  X.attributes = [];
                  for (var V = 0; V < J.attributes.length; ++V) X.attributes[V] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(J.attributes[V], W)
                }
                if (J.droppedAttributesCount != null && J.hasOwnProperty("droppedAttributesCount")) X.droppedAttributesCount = J.droppedAttributesCount;
                if (J.flags != null && J.hasOwnProperty("flags")) X.flags = J.flags;
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.trace.v1.Span.Link"
              }, I
            }(), Z
          }(), G.Status = function() {
            function Z(I) {
              if (I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.message = null, Z.prototype.code = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.message != null && Object.hasOwnProperty.call(Y, "message")) J.uint32(18).string(Y.message);
              if (Y.code != null && Object.hasOwnProperty.call(Y, "code")) J.uint32(24).int32(Y.code);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.trace.v1.Status;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 2: {
                    V.message = Y.string();
                    break
                  }
                  case 3: {
                    V.code = Y.int32();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.message != null && Y.hasOwnProperty("message")) {
                if (!_A.isString(Y.message)) return "message: string expected"
              }
              if (Y.code != null && Y.hasOwnProperty("code")) switch (Y.code) {
                default:
                  return "code: enum value expected";
                case 0:
                case 1:
                case 2:
                  break
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.trace.v1.Status) return Y;
              var J = new PA.opentelemetry.proto.trace.v1.Status;
              if (Y.message != null) J.message = String(Y.message);
              switch (Y.code) {
                default:
                  if (typeof Y.code === "number") {
                    J.code = Y.code;
                    break
                  }
                  break;
                case "STATUS_CODE_UNSET":
                case 0:
                  J.code = 0;
                  break;
                case "STATUS_CODE_OK":
                case 1:
                  J.code = 1;
                  break;
                case "STATUS_CODE_ERROR":
                case 2:
                  J.code = 2;
                  break
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.defaults) W.message = "", W.code = J.enums === String ? "STATUS_CODE_UNSET" : 0;
              if (Y.message != null && Y.hasOwnProperty("message")) W.message = Y.message;
              if (Y.code != null && Y.hasOwnProperty("code")) W.code = J.enums === String ? PA.opentelemetry.proto.trace.v1.Status.StatusCode[Y.code] === void 0 ? Y.code : PA.opentelemetry.proto.trace.v1.Status.StatusCode[Y.code] : Y.code;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.trace.v1.Status"
            }, Z.StatusCode = function() {
              var I = {},
                Y = Object.create(I);
              return Y[I[0] = "STATUS_CODE_UNSET"] = 0, Y[I[1] = "STATUS_CODE_OK"] = 1, Y[I[2] = "STATUS_CODE_ERROR"] = 2, Y
            }(), Z
          }(), G.SpanFlags = function() {
            var Z = {},
              I = Object.create(Z);
            return I[Z[0] = "SPAN_FLAGS_DO_NOT_USE"] = 0, I[Z[255] = "SPAN_FLAGS_TRACE_FLAGS_MASK"] = 255, I[Z[256] = "SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK"] = 256, I[Z[512] = "SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK"] = 512, I
          }(), G
        }(), B
      }(), Q.collector = function() {
        var B = {};
        return B.trace = function() {
          var G = {};
          return G.v1 = function() {
            var Z = {};
            return Z.TraceService = function() {
              function I(Y, J, W) {
                _9.rpc.Service.call(this, Y, J, W)
              }
              return (I.prototype = Object.create(_9.rpc.Service.prototype)).constructor = I, I.create = function(J, W, X) {
                return new this(J, W, X)
              }, Object.defineProperty(I.prototype.export = function Y(J, W) {
                return this.rpcCall(Y, PA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest, PA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse, J, W)
              }, "name", {
                value: "Export"
              }), I
            }(), Z.ExportTraceServiceRequest = function() {
              function I(Y) {
                if (this.resourceSpans = [], Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.resourceSpans = _A.emptyArray, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.resourceSpans != null && J.resourceSpans.length)
                  for (var X = 0; X < J.resourceSpans.length; ++X) PA.opentelemetry.proto.trace.v1.ResourceSpans.encode(J.resourceSpans[X], W.uint32(10).fork()).ldelim();
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      if (!(F.resourceSpans && F.resourceSpans.length)) F.resourceSpans = [];
                      F.resourceSpans.push(PA.opentelemetry.proto.trace.v1.ResourceSpans.decode(J, J.uint32()));
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.resourceSpans != null && J.hasOwnProperty("resourceSpans")) {
                  if (!Array.isArray(J.resourceSpans)) return "resourceSpans: array expected";
                  for (var W = 0; W < J.resourceSpans.length; ++W) {
                    var X = PA.opentelemetry.proto.trace.v1.ResourceSpans.verify(J.resourceSpans[W]);
                    if (X) return "resourceSpans." + X
                  }
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest) return J;
                var W = new PA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
                if (J.resourceSpans) {
                  if (!Array.isArray(J.resourceSpans)) throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: array expected");
                  W.resourceSpans = [];
                  for (var X = 0; X < J.resourceSpans.length; ++X) {
                    if (typeof J.resourceSpans[X] !== "object") throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: object expected");
                    W.resourceSpans[X] = PA.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(J.resourceSpans[X])
                  }
                }
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.arrays || W.defaults) X.resourceSpans = [];
                if (J.resourceSpans && J.resourceSpans.length) {
                  X.resourceSpans = [];
                  for (var V = 0; V < J.resourceSpans.length; ++V) X.resourceSpans[V] = PA.opentelemetry.proto.trace.v1.ResourceSpans.toObject(J.resourceSpans[V], W)
                }
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest"
              }, I
            }(), Z.ExportTraceServiceResponse = function() {
              function I(Y) {
                if (Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.partialSuccess = null, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.partialSuccess != null && Object.hasOwnProperty.call(J, "partialSuccess")) PA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.encode(J.partialSuccess, W.uint32(10).fork()).ldelim();
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      F.partialSuccess = PA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.decode(J, J.uint32());
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.partialSuccess != null && J.hasOwnProperty("partialSuccess")) {
                  var W = PA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.verify(J.partialSuccess);
                  if (W) return "partialSuccess." + W
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse) return J;
                var W = new PA.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;
                if (J.partialSuccess != null) {
                  if (typeof J.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse.partialSuccess: object expected");
                  W.partialSuccess = PA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.fromObject(J.partialSuccess)
                }
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.defaults) X.partialSuccess = null;
                if (J.partialSuccess != null && J.hasOwnProperty("partialSuccess")) X.partialSuccess = PA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.toObject(J.partialSuccess, W);
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse"
              }, I
            }(), Z.ExportTracePartialSuccess = function() {
              function I(Y) {
                if (Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.rejectedSpans = null, I.prototype.errorMessage = null, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.rejectedSpans != null && Object.hasOwnProperty.call(J, "rejectedSpans")) W.uint32(8).int64(J.rejectedSpans);
                if (J.errorMessage != null && Object.hasOwnProperty.call(J, "errorMessage")) W.uint32(18).string(J.errorMessage);
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      F.rejectedSpans = J.int64();
                      break
                    }
                    case 2: {
                      F.errorMessage = J.string();
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.rejectedSpans != null && J.hasOwnProperty("rejectedSpans")) {
                  if (!_A.isInteger(J.rejectedSpans) && !(J.rejectedSpans && _A.isInteger(J.rejectedSpans.low) && _A.isInteger(J.rejectedSpans.high))) return "rejectedSpans: integer|Long expected"
                }
                if (J.errorMessage != null && J.hasOwnProperty("errorMessage")) {
                  if (!_A.isString(J.errorMessage)) return "errorMessage: string expected"
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess) return J;
                var W = new PA.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;
                if (J.rejectedSpans != null) {
                  if (_A.Long)(W.rejectedSpans = _A.Long.fromValue(J.rejectedSpans)).unsigned = !1;
                  else if (typeof J.rejectedSpans === "string") W.rejectedSpans = parseInt(J.rejectedSpans, 10);
                  else if (typeof J.rejectedSpans === "number") W.rejectedSpans = J.rejectedSpans;
                  else if (typeof J.rejectedSpans === "object") W.rejectedSpans = new _A.LongBits(J.rejectedSpans.low >>> 0, J.rejectedSpans.high >>> 0).toNumber()
                }
                if (J.errorMessage != null) W.errorMessage = String(J.errorMessage);
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.defaults) {
                  if (_A.Long) {
                    var V = new _A.Long(0, 0, !1);
                    X.rejectedSpans = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                  } else X.rejectedSpans = W.longs === String ? "0" : 0;
                  X.errorMessage = ""
                }
                if (J.rejectedSpans != null && J.hasOwnProperty("rejectedSpans"))
                  if (typeof J.rejectedSpans === "number") X.rejectedSpans = W.longs === String ? String(J.rejectedSpans) : J.rejectedSpans;
                  else X.rejectedSpans = W.longs === String ? _A.Long.prototype.toString.call(J.rejectedSpans) : W.longs === Number ? new _A.LongBits(J.rejectedSpans.low >>> 0, J.rejectedSpans.high >>> 0).toNumber() : J.rejectedSpans;
                if (J.errorMessage != null && J.hasOwnProperty("errorMessage")) X.errorMessage = J.errorMessage;
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess"
              }, I
            }(), Z
          }(), G
        }(), B.metrics = function() {
          var G = {};
          return G.v1 = function() {
            var Z = {};
            return Z.MetricsService = function() {
              function I(Y, J, W) {
                _9.rpc.Service.call(this, Y, J, W)
              }
              return (I.prototype = Object.create(_9.rpc.Service.prototype)).constructor = I, I.create = function(J, W, X) {
                return new this(J, W, X)
              }, Object.defineProperty(I.prototype.export = function Y(J, W) {
                return this.rpcCall(Y, PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest, PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse, J, W)
              }, "name", {
                value: "Export"
              }), I
            }(), Z.ExportMetricsServiceRequest = function() {
              function I(Y) {
                if (this.resourceMetrics = [], Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.resourceMetrics = _A.emptyArray, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.resourceMetrics != null && J.resourceMetrics.length)
                  for (var X = 0; X < J.resourceMetrics.length; ++X) PA.opentelemetry.proto.metrics.v1.ResourceMetrics.encode(J.resourceMetrics[X], W.uint32(10).fork()).ldelim();
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      if (!(F.resourceMetrics && F.resourceMetrics.length)) F.resourceMetrics = [];
                      F.resourceMetrics.push(PA.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(J, J.uint32()));
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.resourceMetrics != null && J.hasOwnProperty("resourceMetrics")) {
                  if (!Array.isArray(J.resourceMetrics)) return "resourceMetrics: array expected";
                  for (var W = 0; W < J.resourceMetrics.length; ++W) {
                    var X = PA.opentelemetry.proto.metrics.v1.ResourceMetrics.verify(J.resourceMetrics[W]);
                    if (X) return "resourceMetrics." + X
                  }
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest) return J;
                var W = new PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
                if (J.resourceMetrics) {
                  if (!Array.isArray(J.resourceMetrics)) throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: array expected");
                  W.resourceMetrics = [];
                  for (var X = 0; X < J.resourceMetrics.length; ++X) {
                    if (typeof J.resourceMetrics[X] !== "object") throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: object expected");
                    W.resourceMetrics[X] = PA.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(J.resourceMetrics[X])
                  }
                }
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.arrays || W.defaults) X.resourceMetrics = [];
                if (J.resourceMetrics && J.resourceMetrics.length) {
                  X.resourceMetrics = [];
                  for (var V = 0; V < J.resourceMetrics.length; ++V) X.resourceMetrics[V] = PA.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(J.resourceMetrics[V], W)
                }
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest"
              }, I
            }(), Z.ExportMetricsServiceResponse = function() {
              function I(Y) {
                if (Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.partialSuccess = null, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.partialSuccess != null && Object.hasOwnProperty.call(J, "partialSuccess")) PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.encode(J.partialSuccess, W.uint32(10).fork()).ldelim();
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      F.partialSuccess = PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.decode(J, J.uint32());
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.partialSuccess != null && J.hasOwnProperty("partialSuccess")) {
                  var W = PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.verify(J.partialSuccess);
                  if (W) return "partialSuccess." + W
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse) return J;
                var W = new PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;
                if (J.partialSuccess != null) {
                  if (typeof J.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse.partialSuccess: object expected");
                  W.partialSuccess = PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.fromObject(J.partialSuccess)
                }
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.defaults) X.partialSuccess = null;
                if (J.partialSuccess != null && J.hasOwnProperty("partialSuccess")) X.partialSuccess = PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.toObject(J.partialSuccess, W);
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse"
              }, I
            }(), Z.ExportMetricsPartialSuccess = function() {
              function I(Y) {
                if (Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.rejectedDataPoints = null, I.prototype.errorMessage = null, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.rejectedDataPoints != null && Object.hasOwnProperty.call(J, "rejectedDataPoints")) W.uint32(8).int64(J.rejectedDataPoints);
                if (J.errorMessage != null && Object.hasOwnProperty.call(J, "errorMessage")) W.uint32(18).string(J.errorMessage);
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      F.rejectedDataPoints = J.int64();
                      break
                    }
                    case 2: {
                      F.errorMessage = J.string();
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.rejectedDataPoints != null && J.hasOwnProperty("rejectedDataPoints")) {
                  if (!_A.isInteger(J.rejectedDataPoints) && !(J.rejectedDataPoints && _A.isInteger(J.rejectedDataPoints.low) && _A.isInteger(J.rejectedDataPoints.high))) return "rejectedDataPoints: integer|Long expected"
                }
                if (J.errorMessage != null && J.hasOwnProperty("errorMessage")) {
                  if (!_A.isString(J.errorMessage)) return "errorMessage: string expected"
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess) return J;
                var W = new PA.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;
                if (J.rejectedDataPoints != null) {
                  if (_A.Long)(W.rejectedDataPoints = _A.Long.fromValue(J.rejectedDataPoints)).unsigned = !1;
                  else if (typeof J.rejectedDataPoints === "string") W.rejectedDataPoints = parseInt(J.rejectedDataPoints, 10);
                  else if (typeof J.rejectedDataPoints === "number") W.rejectedDataPoints = J.rejectedDataPoints;
                  else if (typeof J.rejectedDataPoints === "object") W.rejectedDataPoints = new _A.LongBits(J.rejectedDataPoints.low >>> 0, J.rejectedDataPoints.high >>> 0).toNumber()
                }
                if (J.errorMessage != null) W.errorMessage = String(J.errorMessage);
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.defaults) {
                  if (_A.Long) {
                    var V = new _A.Long(0, 0, !1);
                    X.rejectedDataPoints = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                  } else X.rejectedDataPoints = W.longs === String ? "0" : 0;
                  X.errorMessage = ""
                }
                if (J.rejectedDataPoints != null && J.hasOwnProperty("rejectedDataPoints"))
                  if (typeof J.rejectedDataPoints === "number") X.rejectedDataPoints = W.longs === String ? String(J.rejectedDataPoints) : J.rejectedDataPoints;
                  else X.rejectedDataPoints = W.longs === String ? _A.Long.prototype.toString.call(J.rejectedDataPoints) : W.longs === Number ? new _A.LongBits(J.rejectedDataPoints.low >>> 0, J.rejectedDataPoints.high >>> 0).toNumber() : J.rejectedDataPoints;
                if (J.errorMessage != null && J.hasOwnProperty("errorMessage")) X.errorMessage = J.errorMessage;
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess"
              }, I
            }(), Z
          }(), G
        }(), B.logs = function() {
          var G = {};
          return G.v1 = function() {
            var Z = {};
            return Z.LogsService = function() {
              function I(Y, J, W) {
                _9.rpc.Service.call(this, Y, J, W)
              }
              return (I.prototype = Object.create(_9.rpc.Service.prototype)).constructor = I, I.create = function(J, W, X) {
                return new this(J, W, X)
              }, Object.defineProperty(I.prototype.export = function Y(J, W) {
                return this.rpcCall(Y, PA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest, PA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse, J, W)
              }, "name", {
                value: "Export"
              }), I
            }(), Z.ExportLogsServiceRequest = function() {
              function I(Y) {
                if (this.resourceLogs = [], Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.resourceLogs = _A.emptyArray, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.resourceLogs != null && J.resourceLogs.length)
                  for (var X = 0; X < J.resourceLogs.length; ++X) PA.opentelemetry.proto.logs.v1.ResourceLogs.encode(J.resourceLogs[X], W.uint32(10).fork()).ldelim();
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      if (!(F.resourceLogs && F.resourceLogs.length)) F.resourceLogs = [];
                      F.resourceLogs.push(PA.opentelemetry.proto.logs.v1.ResourceLogs.decode(J, J.uint32()));
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.resourceLogs != null && J.hasOwnProperty("resourceLogs")) {
                  if (!Array.isArray(J.resourceLogs)) return "resourceLogs: array expected";
                  for (var W = 0; W < J.resourceLogs.length; ++W) {
                    var X = PA.opentelemetry.proto.logs.v1.ResourceLogs.verify(J.resourceLogs[W]);
                    if (X) return "resourceLogs." + X
                  }
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest) return J;
                var W = new PA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
                if (J.resourceLogs) {
                  if (!Array.isArray(J.resourceLogs)) throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: array expected");
                  W.resourceLogs = [];
                  for (var X = 0; X < J.resourceLogs.length; ++X) {
                    if (typeof J.resourceLogs[X] !== "object") throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: object expected");
                    W.resourceLogs[X] = PA.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(J.resourceLogs[X])
                  }
                }
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.arrays || W.defaults) X.resourceLogs = [];
                if (J.resourceLogs && J.resourceLogs.length) {
                  X.resourceLogs = [];
                  for (var V = 0; V < J.resourceLogs.length; ++V) X.resourceLogs[V] = PA.opentelemetry.proto.logs.v1.ResourceLogs.toObject(J.resourceLogs[V], W)
                }
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest"
              }, I
            }(), Z.ExportLogsServiceResponse = function() {
              function I(Y) {
                if (Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.partialSuccess = null, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.partialSuccess != null && Object.hasOwnProperty.call(J, "partialSuccess")) PA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.encode(J.partialSuccess, W.uint32(10).fork()).ldelim();
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      F.partialSuccess = PA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.decode(J, J.uint32());
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.partialSuccess != null && J.hasOwnProperty("partialSuccess")) {
                  var W = PA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.verify(J.partialSuccess);
                  if (W) return "partialSuccess." + W
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse) return J;
                var W = new PA.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;
                if (J.partialSuccess != null) {
                  if (typeof J.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse.partialSuccess: object expected");
                  W.partialSuccess = PA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.fromObject(J.partialSuccess)
                }
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.defaults) X.partialSuccess = null;
                if (J.partialSuccess != null && J.hasOwnProperty("partialSuccess")) X.partialSuccess = PA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.toObject(J.partialSuccess, W);
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse"
              }, I
            }(), Z.ExportLogsPartialSuccess = function() {
              function I(Y) {
                if (Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.rejectedLogRecords = null, I.prototype.errorMessage = null, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.rejectedLogRecords != null && Object.hasOwnProperty.call(J, "rejectedLogRecords")) W.uint32(8).int64(J.rejectedLogRecords);
                if (J.errorMessage != null && Object.hasOwnProperty.call(J, "errorMessage")) W.uint32(18).string(J.errorMessage);
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      F.rejectedLogRecords = J.int64();
                      break
                    }
                    case 2: {
                      F.errorMessage = J.string();
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.rejectedLogRecords != null && J.hasOwnProperty("rejectedLogRecords")) {
                  if (!_A.isInteger(J.rejectedLogRecords) && !(J.rejectedLogRecords && _A.isInteger(J.rejectedLogRecords.low) && _A.isInteger(J.rejectedLogRecords.high))) return "rejectedLogRecords: integer|Long expected"
                }
                if (J.errorMessage != null && J.hasOwnProperty("errorMessage")) {
                  if (!_A.isString(J.errorMessage)) return "errorMessage: string expected"
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess) return J;
                var W = new PA.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;
                if (J.rejectedLogRecords != null) {
                  if (_A.Long)(W.rejectedLogRecords = _A.Long.fromValue(J.rejectedLogRecords)).unsigned = !1;
                  else if (typeof J.rejectedLogRecords === "string") W.rejectedLogRecords = parseInt(J.rejectedLogRecords, 10);
                  else if (typeof J.rejectedLogRecords === "number") W.rejectedLogRecords = J.rejectedLogRecords;
                  else if (typeof J.rejectedLogRecords === "object") W.rejectedLogRecords = new _A.LongBits(J.rejectedLogRecords.low >>> 0, J.rejectedLogRecords.high >>> 0).toNumber()
                }
                if (J.errorMessage != null) W.errorMessage = String(J.errorMessage);
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.defaults) {
                  if (_A.Long) {
                    var V = new _A.Long(0, 0, !1);
                    X.rejectedLogRecords = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                  } else X.rejectedLogRecords = W.longs === String ? "0" : 0;
                  X.errorMessage = ""
                }
                if (J.rejectedLogRecords != null && J.hasOwnProperty("rejectedLogRecords"))
                  if (typeof J.rejectedLogRecords === "number") X.rejectedLogRecords = W.longs === String ? String(J.rejectedLogRecords) : J.rejectedLogRecords;
                  else X.rejectedLogRecords = W.longs === String ? _A.Long.prototype.toString.call(J.rejectedLogRecords) : W.longs === Number ? new _A.LongBits(J.rejectedLogRecords.low >>> 0, J.rejectedLogRecords.high >>> 0).toNumber() : J.rejectedLogRecords;
                if (J.errorMessage != null && J.hasOwnProperty("errorMessage")) X.errorMessage = J.errorMessage;
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess"
              }, I
            }(), Z
          }(), G
        }(), B
      }(), Q.metrics = function() {
        var B = {};
        return B.v1 = function() {
          var G = {};
          return G.MetricsData = function() {
            function Z(I) {
              if (this.resourceMetrics = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.resourceMetrics = _A.emptyArray, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.resourceMetrics != null && Y.resourceMetrics.length)
                for (var W = 0; W < Y.resourceMetrics.length; ++W) PA.opentelemetry.proto.metrics.v1.ResourceMetrics.encode(Y.resourceMetrics[W], J.uint32(10).fork()).ldelim();
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.metrics.v1.MetricsData;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    if (!(V.resourceMetrics && V.resourceMetrics.length)) V.resourceMetrics = [];
                    V.resourceMetrics.push(PA.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(Y, Y.uint32()));
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.resourceMetrics != null && Y.hasOwnProperty("resourceMetrics")) {
                if (!Array.isArray(Y.resourceMetrics)) return "resourceMetrics: array expected";
                for (var J = 0; J < Y.resourceMetrics.length; ++J) {
                  var W = PA.opentelemetry.proto.metrics.v1.ResourceMetrics.verify(Y.resourceMetrics[J]);
                  if (W) return "resourceMetrics." + W
                }
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.metrics.v1.MetricsData) return Y;
              var J = new PA.opentelemetry.proto.metrics.v1.MetricsData;
              if (Y.resourceMetrics) {
                if (!Array.isArray(Y.resourceMetrics)) throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: array expected");
                J.resourceMetrics = [];
                for (var W = 0; W < Y.resourceMetrics.length; ++W) {
                  if (typeof Y.resourceMetrics[W] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: object expected");
                  J.resourceMetrics[W] = PA.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(Y.resourceMetrics[W])
                }
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.resourceMetrics = [];
              if (Y.resourceMetrics && Y.resourceMetrics.length) {
                W.resourceMetrics = [];
                for (var X = 0; X < Y.resourceMetrics.length; ++X) W.resourceMetrics[X] = PA.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(Y.resourceMetrics[X], J)
              }
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.metrics.v1.MetricsData"
            }, Z
          }(), G.ResourceMetrics = function() {
            function Z(I) {
              if (this.scopeMetrics = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.resource = null, Z.prototype.scopeMetrics = _A.emptyArray, Z.prototype.schemaUrl = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.resource != null && Object.hasOwnProperty.call(Y, "resource")) PA.opentelemetry.proto.resource.v1.Resource.encode(Y.resource, J.uint32(10).fork()).ldelim();
              if (Y.scopeMetrics != null && Y.scopeMetrics.length)
                for (var W = 0; W < Y.scopeMetrics.length; ++W) PA.opentelemetry.proto.metrics.v1.ScopeMetrics.encode(Y.scopeMetrics[W], J.uint32(18).fork()).ldelim();
              if (Y.schemaUrl != null && Object.hasOwnProperty.call(Y, "schemaUrl")) J.uint32(26).string(Y.schemaUrl);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.metrics.v1.ResourceMetrics;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    V.resource = PA.opentelemetry.proto.resource.v1.Resource.decode(Y, Y.uint32());
                    break
                  }
                  case 2: {
                    if (!(V.scopeMetrics && V.scopeMetrics.length)) V.scopeMetrics = [];
                    V.scopeMetrics.push(PA.opentelemetry.proto.metrics.v1.ScopeMetrics.decode(Y, Y.uint32()));
                    break
                  }
                  case 3: {
                    V.schemaUrl = Y.string();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.resource != null && Y.hasOwnProperty("resource")) {
                var J = PA.opentelemetry.proto.resource.v1.Resource.verify(Y.resource);
                if (J) return "resource." + J
              }
              if (Y.scopeMetrics != null && Y.hasOwnProperty("scopeMetrics")) {
                if (!Array.isArray(Y.scopeMetrics)) return "scopeMetrics: array expected";
                for (var W = 0; W < Y.scopeMetrics.length; ++W) {
                  var J = PA.opentelemetry.proto.metrics.v1.ScopeMetrics.verify(Y.scopeMetrics[W]);
                  if (J) return "scopeMetrics." + J
                }
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) {
                if (!_A.isString(Y.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.metrics.v1.ResourceMetrics) return Y;
              var J = new PA.opentelemetry.proto.metrics.v1.ResourceMetrics;
              if (Y.resource != null) {
                if (typeof Y.resource !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.resource: object expected");
                J.resource = PA.opentelemetry.proto.resource.v1.Resource.fromObject(Y.resource)
              }
              if (Y.scopeMetrics) {
                if (!Array.isArray(Y.scopeMetrics)) throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: array expected");
                J.scopeMetrics = [];
                for (var W = 0; W < Y.scopeMetrics.length; ++W) {
                  if (typeof Y.scopeMetrics[W] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: object expected");
                  J.scopeMetrics[W] = PA.opentelemetry.proto.metrics.v1.ScopeMetrics.fromObject(Y.scopeMetrics[W])
                }
              }
              if (Y.schemaUrl != null) J.schemaUrl = String(Y.schemaUrl);
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.scopeMetrics = [];
              if (J.defaults) W.resource = null, W.schemaUrl = "";
              if (Y.resource != null && Y.hasOwnProperty("resource")) W.resource = PA.opentelemetry.proto.resource.v1.Resource.toObject(Y.resource, J);
              if (Y.scopeMetrics && Y.scopeMetrics.length) {
                W.scopeMetrics = [];
                for (var X = 0; X < Y.scopeMetrics.length; ++X) W.scopeMetrics[X] = PA.opentelemetry.proto.metrics.v1.ScopeMetrics.toObject(Y.scopeMetrics[X], J)
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) W.schemaUrl = Y.schemaUrl;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.metrics.v1.ResourceMetrics"
            }, Z
          }(), G.ScopeMetrics = function() {
            function Z(I) {
              if (this.metrics = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.scope = null, Z.prototype.metrics = _A.emptyArray, Z.prototype.schemaUrl = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.scope != null && Object.hasOwnProperty.call(Y, "scope")) PA.opentelemetry.proto.common.v1.InstrumentationScope.encode(Y.scope, J.uint32(10).fork()).ldelim();
              if (Y.metrics != null && Y.metrics.length)
                for (var W = 0; W < Y.metrics.length; ++W) PA.opentelemetry.proto.metrics.v1.Metric.encode(Y.metrics[W], J.uint32(18).fork()).ldelim();
              if (Y.schemaUrl != null && Object.hasOwnProperty.call(Y, "schemaUrl")) J.uint32(26).string(Y.schemaUrl);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.metrics.v1.ScopeMetrics;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    V.scope = PA.opentelemetry.proto.common.v1.InstrumentationScope.decode(Y, Y.uint32());
                    break
                  }
                  case 2: {
                    if (!(V.metrics && V.metrics.length)) V.metrics = [];
                    V.metrics.push(PA.opentelemetry.proto.metrics.v1.Metric.decode(Y, Y.uint32()));
                    break
                  }
                  case 3: {
                    V.schemaUrl = Y.string();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.scope != null && Y.hasOwnProperty("scope")) {
                var J = PA.opentelemetry.proto.common.v1.InstrumentationScope.verify(Y.scope);
                if (J) return "scope." + J
              }
              if (Y.metrics != null && Y.hasOwnProperty("metrics")) {
                if (!Array.isArray(Y.metrics)) return "metrics: array expected";
                for (var W = 0; W < Y.metrics.length; ++W) {
                  var J = PA.opentelemetry.proto.metrics.v1.Metric.verify(Y.metrics[W]);
                  if (J) return "metrics." + J
                }
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) {
                if (!_A.isString(Y.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.metrics.v1.ScopeMetrics) return Y;
              var J = new PA.opentelemetry.proto.metrics.v1.ScopeMetrics;
              if (Y.scope != null) {
                if (typeof Y.scope !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.scope: object expected");
                J.scope = PA.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(Y.scope)
              }
              if (Y.metrics) {
                if (!Array.isArray(Y.metrics)) throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: array expected");
                J.metrics = [];
                for (var W = 0; W < Y.metrics.length; ++W) {
                  if (typeof Y.metrics[W] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: object expected");
                  J.metrics[W] = PA.opentelemetry.proto.metrics.v1.Metric.fromObject(Y.metrics[W])
                }
              }
              if (Y.schemaUrl != null) J.schemaUrl = String(Y.schemaUrl);
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.metrics = [];
              if (J.defaults) W.scope = null, W.schemaUrl = "";
              if (Y.scope != null && Y.hasOwnProperty("scope")) W.scope = PA.opentelemetry.proto.common.v1.InstrumentationScope.toObject(Y.scope, J);
              if (Y.metrics && Y.metrics.length) {
                W.metrics = [];
                for (var X = 0; X < Y.metrics.length; ++X) W.metrics[X] = PA.opentelemetry.proto.metrics.v1.Metric.toObject(Y.metrics[X], J)
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) W.schemaUrl = Y.schemaUrl;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.metrics.v1.ScopeMetrics"
            }, Z
          }(), G.Metric = function() {
            function Z(Y) {
              if (this.metadata = [], Y) {
                for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                  if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
              }
            }
            Z.prototype.name = null, Z.prototype.description = null, Z.prototype.unit = null, Z.prototype.gauge = null, Z.prototype.sum = null, Z.prototype.histogram = null, Z.prototype.exponentialHistogram = null, Z.prototype.summary = null, Z.prototype.metadata = _A.emptyArray;
            var I;
            return Object.defineProperty(Z.prototype, "data", {
              get: _A.oneOfGetter(I = ["gauge", "sum", "histogram", "exponentialHistogram", "summary"]),
              set: _A.oneOfSetter(I)
            }), Z.create = function(J) {
              return new Z(J)
            }, Z.encode = function(J, W) {
              if (!W) W = M8.create();
              if (J.name != null && Object.hasOwnProperty.call(J, "name")) W.uint32(10).string(J.name);
              if (J.description != null && Object.hasOwnProperty.call(J, "description")) W.uint32(18).string(J.description);
              if (J.unit != null && Object.hasOwnProperty.call(J, "unit")) W.uint32(26).string(J.unit);
              if (J.gauge != null && Object.hasOwnProperty.call(J, "gauge")) PA.opentelemetry.proto.metrics.v1.Gauge.encode(J.gauge, W.uint32(42).fork()).ldelim();
              if (J.sum != null && Object.hasOwnProperty.call(J, "sum")) PA.opentelemetry.proto.metrics.v1.Sum.encode(J.sum, W.uint32(58).fork()).ldelim();
              if (J.histogram != null && Object.hasOwnProperty.call(J, "histogram")) PA.opentelemetry.proto.metrics.v1.Histogram.encode(J.histogram, W.uint32(74).fork()).ldelim();
              if (J.exponentialHistogram != null && Object.hasOwnProperty.call(J, "exponentialHistogram")) PA.opentelemetry.proto.metrics.v1.ExponentialHistogram.encode(J.exponentialHistogram, W.uint32(82).fork()).ldelim();
              if (J.summary != null && Object.hasOwnProperty.call(J, "summary")) PA.opentelemetry.proto.metrics.v1.Summary.encode(J.summary, W.uint32(90).fork()).ldelim();
              if (J.metadata != null && J.metadata.length)
                for (var X = 0; X < J.metadata.length; ++X) PA.opentelemetry.proto.common.v1.KeyValue.encode(J.metadata[X], W.uint32(98).fork()).ldelim();
              return W
            }, Z.encodeDelimited = function(J, W) {
              return this.encode(J, W).ldelim()
            }, Z.decode = function(J, W, X) {
              if (!(J instanceof B0)) J = B0.create(J);
              var V = W === void 0 ? J.len : J.pos + W,
                F = new PA.opentelemetry.proto.metrics.v1.Metric;
              while (J.pos < V) {
                var K = J.uint32();
                if (K === X) break;
                switch (K >>> 3) {
                  case 1: {
                    F.name = J.string();
                    break
                  }
                  case 2: {
                    F.description = J.string();
                    break
                  }
                  case 3: {
                    F.unit = J.string();
                    break
                  }
                  case 5: {
                    F.gauge = PA.opentelemetry.proto.metrics.v1.Gauge.decode(J, J.uint32());
                    break
                  }
                  case 7: {
                    F.sum = PA.opentelemetry.proto.metrics.v1.Sum.decode(J, J.uint32());
                    break
                  }
                  case 9: {
                    F.histogram = PA.opentelemetry.proto.metrics.v1.Histogram.decode(J, J.uint32());
                    break
                  }
                  case 10: {
                    F.exponentialHistogram = PA.opentelemetry.proto.metrics.v1.ExponentialHistogram.decode(J, J.uint32());
                    break
                  }
                  case 11: {
                    F.summary = PA.opentelemetry.proto.metrics.v1.Summary.decode(J, J.uint32());
                    break
                  }
                  case 12: {
                    if (!(F.metadata && F.metadata.length)) F.metadata = [];
                    F.metadata.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return F
            }, Z.decodeDelimited = function(J) {
              if (!(J instanceof B0)) J = new B0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function(J) {
              if (typeof J !== "object" || J === null) return "object expected";
              var W = {};
              if (J.name != null && J.hasOwnProperty("name")) {
                if (!_A.isString(J.name)) return "name: string expected"
              }
              if (J.description != null && J.hasOwnProperty("description")) {
                if (!_A.isString(J.description)) return "description: string expected"
              }
              if (J.unit != null && J.hasOwnProperty("unit")) {
                if (!_A.isString(J.unit)) return "unit: string expected"
              }
              if (J.gauge != null && J.hasOwnProperty("gauge")) {
                W.data = 1;
                {
                  var X = PA.opentelemetry.proto.metrics.v1.Gauge.verify(J.gauge);
                  if (X) return "gauge." + X
                }
              }
              if (J.sum != null && J.hasOwnProperty("sum")) {
                if (W.data === 1) return "data: multiple values";
                W.data = 1;
                {
                  var X = PA.opentelemetry.proto.metrics.v1.Sum.verify(J.sum);
                  if (X) return "sum." + X
                }
              }
              if (J.histogram != null && J.hasOwnProperty("histogram")) {
                if (W.data === 1) return "data: multiple values";
                W.data = 1;
                {
                  var X = PA.opentelemetry.proto.metrics.v1.Histogram.verify(J.histogram);
                  if (X) return "histogram." + X
                }
              }
              if (J.exponentialHistogram != null && J.hasOwnProperty("exponentialHistogram")) {
                if (W.data === 1) return "data: multiple values";
                W.data = 1;
                {
                  var X = PA.opentelemetry.proto.metrics.v1.ExponentialHistogram.verify(J.exponentialHistogram);
                  if (X) return "exponentialHistogram." + X
                }
              }
              if (J.summary != null && J.hasOwnProperty("summary")) {
                if (W.data === 1) return "data: multiple values";
                W.data = 1;
                {
                  var X = PA.opentelemetry.proto.metrics.v1.Summary.verify(J.summary);
                  if (X) return "summary." + X
                }
              }
              if (J.metadata != null && J.hasOwnProperty("metadata")) {
                if (!Array.isArray(J.metadata)) return "metadata: array expected";
                for (var V = 0; V < J.metadata.length; ++V) {
                  var X = PA.opentelemetry.proto.common.v1.KeyValue.verify(J.metadata[V]);
                  if (X) return "metadata." + X
                }
              }
              return null
            }, Z.fromObject = function(J) {
              if (J instanceof PA.opentelemetry.proto.metrics.v1.Metric) return J;
              var W = new PA.opentelemetry.proto.metrics.v1.Metric;
              if (J.name != null) W.name = String(J.name);
              if (J.description != null) W.description = String(J.description);
              if (J.unit != null) W.unit = String(J.unit);
              if (J.gauge != null) {
                if (typeof J.gauge !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.gauge: object expected");
                W.gauge = PA.opentelemetry.proto.metrics.v1.Gauge.fromObject(J.gauge)
              }
              if (J.sum != null) {
                if (typeof J.sum !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.sum: object expected");
                W.sum = PA.opentelemetry.proto.metrics.v1.Sum.fromObject(J.sum)
              }
              if (J.histogram != null) {
                if (typeof J.histogram !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.histogram: object expected");
                W.histogram = PA.opentelemetry.proto.metrics.v1.Histogram.fromObject(J.histogram)
              }
              if (J.exponentialHistogram != null) {
                if (typeof J.exponentialHistogram !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.exponentialHistogram: object expected");
                W.exponentialHistogram = PA.opentelemetry.proto.metrics.v1.ExponentialHistogram.fromObject(J.exponentialHistogram)
              }
              if (J.summary != null) {
                if (typeof J.summary !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.summary: object expected");
                W.summary = PA.opentelemetry.proto.metrics.v1.Summary.fromObject(J.summary)
              }
              if (J.metadata) {
                if (!Array.isArray(J.metadata)) throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: array expected");
                W.metadata = [];
                for (var X = 0; X < J.metadata.length; ++X) {
                  if (typeof J.metadata[X] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: object expected");
                  W.metadata[X] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.metadata[X])
                }
              }
              return W
            }, Z.toObject = function(J, W) {
              if (!W) W = {};
              var X = {};
              if (W.arrays || W.defaults) X.metadata = [];
              if (W.defaults) X.name = "", X.description = "", X.unit = "";
              if (J.name != null && J.hasOwnProperty("name")) X.name = J.name;
              if (J.description != null && J.hasOwnProperty("description")) X.description = J.description;
              if (J.unit != null && J.hasOwnProperty("unit")) X.unit = J.unit;
              if (J.gauge != null && J.hasOwnProperty("gauge")) {
                if (X.gauge = PA.opentelemetry.proto.metrics.v1.Gauge.toObject(J.gauge, W), W.oneofs) X.data = "gauge"
              }
              if (J.sum != null && J.hasOwnProperty("sum")) {
                if (X.sum = PA.opentelemetry.proto.metrics.v1.Sum.toObject(J.sum, W), W.oneofs) X.data = "sum"
              }
              if (J.histogram != null && J.hasOwnProperty("histogram")) {
                if (X.histogram = PA.opentelemetry.proto.metrics.v1.Histogram.toObject(J.histogram, W), W.oneofs) X.data = "histogram"
              }
              if (J.exponentialHistogram != null && J.hasOwnProperty("exponentialHistogram")) {
                if (X.exponentialHistogram = PA.opentelemetry.proto.metrics.v1.ExponentialHistogram.toObject(J.exponentialHistogram, W), W.oneofs) X.data = "exponentialHistogram"
              }
              if (J.summary != null && J.hasOwnProperty("summary")) {
                if (X.summary = PA.opentelemetry.proto.metrics.v1.Summary.toObject(J.summary, W), W.oneofs) X.data = "summary"
              }
              if (J.metadata && J.metadata.length) {
                X.metadata = [];
                for (var V = 0; V < J.metadata.length; ++V) X.metadata[V] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(J.metadata[V], W)
              }
              return X
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.Metric"
            }, Z
          }(), G.Gauge = function() {
            function Z(I) {
              if (this.dataPoints = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.dataPoints = _A.emptyArray, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.dataPoints != null && Y.dataPoints.length)
                for (var W = 0; W < Y.dataPoints.length; ++W) PA.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(Y.dataPoints[W], J.uint32(10).fork()).ldelim();
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.metrics.v1.Gauge;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    if (!(V.dataPoints && V.dataPoints.length)) V.dataPoints = [];
                    V.dataPoints.push(PA.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(Y, Y.uint32()));
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.dataPoints != null && Y.hasOwnProperty("dataPoints")) {
                if (!Array.isArray(Y.dataPoints)) return "dataPoints: array expected";
                for (var J = 0; J < Y.dataPoints.length; ++J) {
                  var W = PA.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(Y.dataPoints[J]);
                  if (W) return "dataPoints." + W
                }
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.metrics.v1.Gauge) return Y;
              var J = new PA.opentelemetry.proto.metrics.v1.Gauge;
              if (Y.dataPoints) {
                if (!Array.isArray(Y.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: array expected");
                J.dataPoints = [];
                for (var W = 0; W < Y.dataPoints.length; ++W) {
                  if (typeof Y.dataPoints[W] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: object expected");
                  J.dataPoints[W] = PA.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(Y.dataPoints[W])
                }
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.dataPoints = [];
              if (Y.dataPoints && Y.dataPoints.length) {
                W.dataPoints = [];
                for (var X = 0; X < Y.dataPoints.length; ++X) W.dataPoints[X] = PA.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(Y.dataPoints[X], J)
              }
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.metrics.v1.Gauge"
            }, Z
          }(), G.Sum = function() {
            function Z(I) {
              if (this.dataPoints = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.dataPoints = _A.emptyArray, Z.prototype.aggregationTemporality = null, Z.prototype.isMonotonic = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.dataPoints != null && Y.dataPoints.length)
                for (var W = 0; W < Y.dataPoints.length; ++W) PA.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(Y.dataPoints[W], J.uint32(10).fork()).ldelim();
              if (Y.aggregationTemporality != null && Object.hasOwnProperty.call(Y, "aggregationTemporality")) J.uint32(16).int32(Y.aggregationTemporality);
              if (Y.isMonotonic != null && Object.hasOwnProperty.call(Y, "isMonotonic")) J.uint32(24).bool(Y.isMonotonic);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.metrics.v1.Sum;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    if (!(V.dataPoints && V.dataPoints.length)) V.dataPoints = [];
                    V.dataPoints.push(PA.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(Y, Y.uint32()));
                    break
                  }
                  case 2: {
                    V.aggregationTemporality = Y.int32();
                    break
                  }
                  case 3: {
                    V.isMonotonic = Y.bool();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.dataPoints != null && Y.hasOwnProperty("dataPoints")) {
                if (!Array.isArray(Y.dataPoints)) return "dataPoints: array expected";
                for (var J = 0; J < Y.dataPoints.length; ++J) {
                  var W = PA.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(Y.dataPoints[J]);
                  if (W) return "dataPoints." + W
                }
              }
              if (Y.aggregationTemporality != null && Y.hasOwnProperty("aggregationTemporality")) switch (Y.aggregationTemporality) {
                default:
                  return "aggregationTemporality: enum value expected";
                case 0:
                case 1:
                case 2:
                  break
              }
              if (Y.isMonotonic != null && Y.hasOwnProperty("isMonotonic")) {
                if (typeof Y.isMonotonic !== "boolean") return "isMonotonic: boolean expected"
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.metrics.v1.Sum) return Y;
              var J = new PA.opentelemetry.proto.metrics.v1.Sum;
              if (Y.dataPoints) {
                if (!Array.isArray(Y.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: array expected");
                J.dataPoints = [];
                for (var W = 0; W < Y.dataPoints.length; ++W) {
                  if (typeof Y.dataPoints[W] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: object expected");
                  J.dataPoints[W] = PA.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(Y.dataPoints[W])
                }
              }
              switch (Y.aggregationTemporality) {
                default:
                  if (typeof Y.aggregationTemporality === "number") {
                    J.aggregationTemporality = Y.aggregationTemporality;
                    break
                  }
                  break;
                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                case 0:
                  J.aggregationTemporality = 0;
                  break;
                case "AGGREGATION_TEMPORALITY_DELTA":
                case 1:
                  J.aggregationTemporality = 1;
                  break;
                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                case 2:
                  J.aggregationTemporality = 2;
                  break
              }
              if (Y.isMonotonic != null) J.isMonotonic = Boolean(Y.isMonotonic);
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.dataPoints = [];
              if (J.defaults) W.aggregationTemporality = J.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0, W.isMonotonic = !1;
              if (Y.dataPoints && Y.dataPoints.length) {
                W.dataPoints = [];
                for (var X = 0; X < Y.dataPoints.length; ++X) W.dataPoints[X] = PA.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(Y.dataPoints[X], J)
              }
              if (Y.aggregationTemporality != null && Y.hasOwnProperty("aggregationTemporality")) W.aggregationTemporality = J.enums === String ? PA.opentelemetry.proto.metrics.v1.AggregationTemporality[Y.aggregationTemporality] === void 0 ? Y.aggregationTemporality : PA.opentelemetry.proto.metrics.v1.AggregationTemporality[Y.aggregationTemporality] : Y.aggregationTemporality;
              if (Y.isMonotonic != null && Y.hasOwnProperty("isMonotonic")) W.isMonotonic = Y.isMonotonic;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.metrics.v1.Sum"
            }, Z
          }(), G.Histogram = function() {
            function Z(I) {
              if (this.dataPoints = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.dataPoints = _A.emptyArray, Z.prototype.aggregationTemporality = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.dataPoints != null && Y.dataPoints.length)
                for (var W = 0; W < Y.dataPoints.length; ++W) PA.opentelemetry.proto.metrics.v1.HistogramDataPoint.encode(Y.dataPoints[W], J.uint32(10).fork()).ldelim();
              if (Y.aggregationTemporality != null && Object.hasOwnProperty.call(Y, "aggregationTemporality")) J.uint32(16).int32(Y.aggregationTemporality);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.metrics.v1.Histogram;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    if (!(V.dataPoints && V.dataPoints.length)) V.dataPoints = [];
                    V.dataPoints.push(PA.opentelemetry.proto.metrics.v1.HistogramDataPoint.decode(Y, Y.uint32()));
                    break
                  }
                  case 2: {
                    V.aggregationTemporality = Y.int32();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.dataPoints != null && Y.hasOwnProperty("dataPoints")) {
                if (!Array.isArray(Y.dataPoints)) return "dataPoints: array expected";
                for (var J = 0; J < Y.dataPoints.length; ++J) {
                  var W = PA.opentelemetry.proto.metrics.v1.HistogramDataPoint.verify(Y.dataPoints[J]);
                  if (W) return "dataPoints." + W
                }
              }
              if (Y.aggregationTemporality != null && Y.hasOwnProperty("aggregationTemporality")) switch (Y.aggregationTemporality) {
                default:
                  return "aggregationTemporality: enum value expected";
                case 0:
                case 1:
                case 2:
                  break
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.metrics.v1.Histogram) return Y;
              var J = new PA.opentelemetry.proto.metrics.v1.Histogram;
              if (Y.dataPoints) {
                if (!Array.isArray(Y.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: array expected");
                J.dataPoints = [];
                for (var W = 0; W < Y.dataPoints.length; ++W) {
                  if (typeof Y.dataPoints[W] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: object expected");
                  J.dataPoints[W] = PA.opentelemetry.proto.metrics.v1.HistogramDataPoint.fromObject(Y.dataPoints[W])
                }
              }
              switch (Y.aggregationTemporality) {
                default:
                  if (typeof Y.aggregationTemporality === "number") {
                    J.aggregationTemporality = Y.aggregationTemporality;
                    break
                  }
                  break;
                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                case 0:
                  J.aggregationTemporality = 0;
                  break;
                case "AGGREGATION_TEMPORALITY_DELTA":
                case 1:
                  J.aggregationTemporality = 1;
                  break;
                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                case 2:
                  J.aggregationTemporality = 2;
                  break
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.dataPoints = [];
              if (J.defaults) W.aggregationTemporality = J.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
              if (Y.dataPoints && Y.dataPoints.length) {
                W.dataPoints = [];
                for (var X = 0; X < Y.dataPoints.length; ++X) W.dataPoints[X] = PA.opentelemetry.proto.metrics.v1.HistogramDataPoint.toObject(Y.dataPoints[X], J)
              }
              if (Y.aggregationTemporality != null && Y.hasOwnProperty("aggregationTemporality")) W.aggregationTemporality = J.enums === String ? PA.opentelemetry.proto.metrics.v1.AggregationTemporality[Y.aggregationTemporality] === void 0 ? Y.aggregationTemporality : PA.opentelemetry.proto.metrics.v1.AggregationTemporality[Y.aggregationTemporality] : Y.aggregationTemporality;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.metrics.v1.Histogram"
            }, Z
          }(), G.ExponentialHistogram = function() {
            function Z(I) {
              if (this.dataPoints = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.dataPoints = _A.emptyArray, Z.prototype.aggregationTemporality = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.dataPoints != null && Y.dataPoints.length)
                for (var W = 0; W < Y.dataPoints.length; ++W) PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.encode(Y.dataPoints[W], J.uint32(10).fork()).ldelim();
              if (Y.aggregationTemporality != null && Object.hasOwnProperty.call(Y, "aggregationTemporality")) J.uint32(16).int32(Y.aggregationTemporality);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.metrics.v1.ExponentialHistogram;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    if (!(V.dataPoints && V.dataPoints.length)) V.dataPoints = [];
                    V.dataPoints.push(PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.decode(Y, Y.uint32()));
                    break
                  }
                  case 2: {
                    V.aggregationTemporality = Y.int32();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.dataPoints != null && Y.hasOwnProperty("dataPoints")) {
                if (!Array.isArray(Y.dataPoints)) return "dataPoints: array expected";
                for (var J = 0; J < Y.dataPoints.length; ++J) {
                  var W = PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.verify(Y.dataPoints[J]);
                  if (W) return "dataPoints." + W
                }
              }
              if (Y.aggregationTemporality != null && Y.hasOwnProperty("aggregationTemporality")) switch (Y.aggregationTemporality) {
                default:
                  return "aggregationTemporality: enum value expected";
                case 0:
                case 1:
                case 2:
                  break
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.metrics.v1.ExponentialHistogram) return Y;
              var J = new PA.opentelemetry.proto.metrics.v1.ExponentialHistogram;
              if (Y.dataPoints) {
                if (!Array.isArray(Y.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: array expected");
                J.dataPoints = [];
                for (var W = 0; W < Y.dataPoints.length; ++W) {
                  if (typeof Y.dataPoints[W] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: object expected");
                  J.dataPoints[W] = PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.fromObject(Y.dataPoints[W])
                }
              }
              switch (Y.aggregationTemporality) {
                default:
                  if (typeof Y.aggregationTemporality === "number") {
                    J.aggregationTemporality = Y.aggregationTemporality;
                    break
                  }
                  break;
                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                case 0:
                  J.aggregationTemporality = 0;
                  break;
                case "AGGREGATION_TEMPORALITY_DELTA":
                case 1:
                  J.aggregationTemporality = 1;
                  break;
                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                case 2:
                  J.aggregationTemporality = 2;
                  break
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.dataPoints = [];
              if (J.defaults) W.aggregationTemporality = J.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
              if (Y.dataPoints && Y.dataPoints.length) {
                W.dataPoints = [];
                for (var X = 0; X < Y.dataPoints.length; ++X) W.dataPoints[X] = PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.toObject(Y.dataPoints[X], J)
              }
              if (Y.aggregationTemporality != null && Y.hasOwnProperty("aggregationTemporality")) W.aggregationTemporality = J.enums === String ? PA.opentelemetry.proto.metrics.v1.AggregationTemporality[Y.aggregationTemporality] === void 0 ? Y.aggregationTemporality : PA.opentelemetry.proto.metrics.v1.AggregationTemporality[Y.aggregationTemporality] : Y.aggregationTemporality;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.metrics.v1.ExponentialHistogram"
            }, Z
          }(), G.Summary = function() {
            function Z(I) {
              if (this.dataPoints = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.dataPoints = _A.emptyArray, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.dataPoints != null && Y.dataPoints.length)
                for (var W = 0; W < Y.dataPoints.length; ++W) PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.encode(Y.dataPoints[W], J.uint32(10).fork()).ldelim();
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.metrics.v1.Summary;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    if (!(V.dataPoints && V.dataPoints.length)) V.dataPoints = [];
                    V.dataPoints.push(PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.decode(Y, Y.uint32()));
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.dataPoints != null && Y.hasOwnProperty("dataPoints")) {
                if (!Array.isArray(Y.dataPoints)) return "dataPoints: array expected";
                for (var J = 0; J < Y.dataPoints.length; ++J) {
                  var W = PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.verify(Y.dataPoints[J]);
                  if (W) return "dataPoints." + W
                }
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.metrics.v1.Summary) return Y;
              var J = new PA.opentelemetry.proto.metrics.v1.Summary;
              if (Y.dataPoints) {
                if (!Array.isArray(Y.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: array expected");
                J.dataPoints = [];
                for (var W = 0; W < Y.dataPoints.length; ++W) {
                  if (typeof Y.dataPoints[W] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: object expected");
                  J.dataPoints[W] = PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.fromObject(Y.dataPoints[W])
                }
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.dataPoints = [];
              if (Y.dataPoints && Y.dataPoints.length) {
                W.dataPoints = [];
                for (var X = 0; X < Y.dataPoints.length; ++X) W.dataPoints[X] = PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.toObject(Y.dataPoints[X], J)
              }
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.metrics.v1.Summary"
            }, Z
          }(), G.AggregationTemporality = function() {
            var Z = {},
              I = Object.create(Z);
            return I[Z[0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED"] = 0, I[Z[1] = "AGGREGATION_TEMPORALITY_DELTA"] = 1, I[Z[2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"] = 2, I
          }(), G.DataPointFlags = function() {
            var Z = {},
              I = Object.create(Z);
            return I[Z[0] = "DATA_POINT_FLAGS_DO_NOT_USE"] = 0, I[Z[1] = "DATA_POINT_FLAGS_NO_RECORDED_VALUE_MASK"] = 1, I
          }(), G.NumberDataPoint = function() {
            function Z(Y) {
              if (this.attributes = [], this.exemplars = [], Y) {
                for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                  if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
              }
            }
            Z.prototype.attributes = _A.emptyArray, Z.prototype.startTimeUnixNano = null, Z.prototype.timeUnixNano = null, Z.prototype.asDouble = null, Z.prototype.asInt = null, Z.prototype.exemplars = _A.emptyArray, Z.prototype.flags = null;
            var I;
            return Object.defineProperty(Z.prototype, "value", {
              get: _A.oneOfGetter(I = ["asDouble", "asInt"]),
              set: _A.oneOfSetter(I)
            }), Z.create = function(J) {
              return new Z(J)
            }, Z.encode = function(J, W) {
              if (!W) W = M8.create();
              if (J.startTimeUnixNano != null && Object.hasOwnProperty.call(J, "startTimeUnixNano")) W.uint32(17).fixed64(J.startTimeUnixNano);
              if (J.timeUnixNano != null && Object.hasOwnProperty.call(J, "timeUnixNano")) W.uint32(25).fixed64(J.timeUnixNano);
              if (J.asDouble != null && Object.hasOwnProperty.call(J, "asDouble")) W.uint32(33).double(J.asDouble);
              if (J.exemplars != null && J.exemplars.length)
                for (var X = 0; X < J.exemplars.length; ++X) PA.opentelemetry.proto.metrics.v1.Exemplar.encode(J.exemplars[X], W.uint32(42).fork()).ldelim();
              if (J.asInt != null && Object.hasOwnProperty.call(J, "asInt")) W.uint32(49).sfixed64(J.asInt);
              if (J.attributes != null && J.attributes.length)
                for (var X = 0; X < J.attributes.length; ++X) PA.opentelemetry.proto.common.v1.KeyValue.encode(J.attributes[X], W.uint32(58).fork()).ldelim();
              if (J.flags != null && Object.hasOwnProperty.call(J, "flags")) W.uint32(64).uint32(J.flags);
              return W
            }, Z.encodeDelimited = function(J, W) {
              return this.encode(J, W).ldelim()
            }, Z.decode = function(J, W, X) {
              if (!(J instanceof B0)) J = B0.create(J);
              var V = W === void 0 ? J.len : J.pos + W,
                F = new PA.opentelemetry.proto.metrics.v1.NumberDataPoint;
              while (J.pos < V) {
                var K = J.uint32();
                if (K === X) break;
                switch (K >>> 3) {
                  case 7: {
                    if (!(F.attributes && F.attributes.length)) F.attributes = [];
                    F.attributes.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                    break
                  }
                  case 2: {
                    F.startTimeUnixNano = J.fixed64();
                    break
                  }
                  case 3: {
                    F.timeUnixNano = J.fixed64();
                    break
                  }
                  case 4: {
                    F.asDouble = J.double();
                    break
                  }
                  case 6: {
                    F.asInt = J.sfixed64();
                    break
                  }
                  case 5: {
                    if (!(F.exemplars && F.exemplars.length)) F.exemplars = [];
                    F.exemplars.push(PA.opentelemetry.proto.metrics.v1.Exemplar.decode(J, J.uint32()));
                    break
                  }
                  case 8: {
                    F.flags = J.uint32();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return F
            }, Z.decodeDelimited = function(J) {
              if (!(J instanceof B0)) J = new B0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function(J) {
              if (typeof J !== "object" || J === null) return "object expected";
              var W = {};
              if (J.attributes != null && J.hasOwnProperty("attributes")) {
                if (!Array.isArray(J.attributes)) return "attributes: array expected";
                for (var X = 0; X < J.attributes.length; ++X) {
                  var V = PA.opentelemetry.proto.common.v1.KeyValue.verify(J.attributes[X]);
                  if (V) return "attributes." + V
                }
              }
              if (J.startTimeUnixNano != null && J.hasOwnProperty("startTimeUnixNano")) {
                if (!_A.isInteger(J.startTimeUnixNano) && !(J.startTimeUnixNano && _A.isInteger(J.startTimeUnixNano.low) && _A.isInteger(J.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
              }
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano")) {
                if (!_A.isInteger(J.timeUnixNano) && !(J.timeUnixNano && _A.isInteger(J.timeUnixNano.low) && _A.isInteger(J.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (J.asDouble != null && J.hasOwnProperty("asDouble")) {
                if (W.value = 1, typeof J.asDouble !== "number") return "asDouble: number expected"
              }
              if (J.asInt != null && J.hasOwnProperty("asInt")) {
                if (W.value === 1) return "value: multiple values";
                if (W.value = 1, !_A.isInteger(J.asInt) && !(J.asInt && _A.isInteger(J.asInt.low) && _A.isInteger(J.asInt.high))) return "asInt: integer|Long expected"
              }
              if (J.exemplars != null && J.hasOwnProperty("exemplars")) {
                if (!Array.isArray(J.exemplars)) return "exemplars: array expected";
                for (var X = 0; X < J.exemplars.length; ++X) {
                  var V = PA.opentelemetry.proto.metrics.v1.Exemplar.verify(J.exemplars[X]);
                  if (V) return "exemplars." + V
                }
              }
              if (J.flags != null && J.hasOwnProperty("flags")) {
                if (!_A.isInteger(J.flags)) return "flags: integer expected"
              }
              return null
            }, Z.fromObject = function(J) {
              if (J instanceof PA.opentelemetry.proto.metrics.v1.NumberDataPoint) return J;
              var W = new PA.opentelemetry.proto.metrics.v1.NumberDataPoint;
              if (J.attributes) {
                if (!Array.isArray(J.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: array expected");
                W.attributes = [];
                for (var X = 0; X < J.attributes.length; ++X) {
                  if (typeof J.attributes[X] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: object expected");
                  W.attributes[X] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.attributes[X])
                }
              }
              if (J.startTimeUnixNano != null) {
                if (_A.Long)(W.startTimeUnixNano = _A.Long.fromValue(J.startTimeUnixNano)).unsigned = !1;
                else if (typeof J.startTimeUnixNano === "string") W.startTimeUnixNano = parseInt(J.startTimeUnixNano, 10);
                else if (typeof J.startTimeUnixNano === "number") W.startTimeUnixNano = J.startTimeUnixNano;
                else if (typeof J.startTimeUnixNano === "object") W.startTimeUnixNano = new _A.LongBits(J.startTimeUnixNano.low >>> 0, J.startTimeUnixNano.high >>> 0).toNumber()
              }
              if (J.timeUnixNano != null) {
                if (_A.Long)(W.timeUnixNano = _A.Long.fromValue(J.timeUnixNano)).unsigned = !1;
                else if (typeof J.timeUnixNano === "string") W.timeUnixNano = parseInt(J.timeUnixNano, 10);
                else if (typeof J.timeUnixNano === "number") W.timeUnixNano = J.timeUnixNano;
                else if (typeof J.timeUnixNano === "object") W.timeUnixNano = new _A.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber()
              }
              if (J.asDouble != null) W.asDouble = Number(J.asDouble);
              if (J.asInt != null) {
                if (_A.Long)(W.asInt = _A.Long.fromValue(J.asInt)).unsigned = !1;
                else if (typeof J.asInt === "string") W.asInt = parseInt(J.asInt, 10);
                else if (typeof J.asInt === "number") W.asInt = J.asInt;
                else if (typeof J.asInt === "object") W.asInt = new _A.LongBits(J.asInt.low >>> 0, J.asInt.high >>> 0).toNumber()
              }
              if (J.exemplars) {
                if (!Array.isArray(J.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: array expected");
                W.exemplars = [];
                for (var X = 0; X < J.exemplars.length; ++X) {
                  if (typeof J.exemplars[X] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: object expected");
                  W.exemplars[X] = PA.opentelemetry.proto.metrics.v1.Exemplar.fromObject(J.exemplars[X])
                }
              }
              if (J.flags != null) W.flags = J.flags >>> 0;
              return W
            }, Z.toObject = function(J, W) {
              if (!W) W = {};
              var X = {};
              if (W.arrays || W.defaults) X.exemplars = [], X.attributes = [];
              if (W.defaults) {
                if (_A.Long) {
                  var V = new _A.Long(0, 0, !1);
                  X.startTimeUnixNano = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                } else X.startTimeUnixNano = W.longs === String ? "0" : 0;
                if (_A.Long) {
                  var V = new _A.Long(0, 0, !1);
                  X.timeUnixNano = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                } else X.timeUnixNano = W.longs === String ? "0" : 0;
                X.flags = 0
              }
              if (J.startTimeUnixNano != null && J.hasOwnProperty("startTimeUnixNano"))
                if (typeof J.startTimeUnixNano === "number") X.startTimeUnixNano = W.longs === String ? String(J.startTimeUnixNano) : J.startTimeUnixNano;
                else X.startTimeUnixNano = W.longs === String ? _A.Long.prototype.toString.call(J.startTimeUnixNano) : W.longs === Number ? new _A.LongBits(J.startTimeUnixNano.low >>> 0, J.startTimeUnixNano.high >>> 0).toNumber() : J.startTimeUnixNano;
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano"))
                if (typeof J.timeUnixNano === "number") X.timeUnixNano = W.longs === String ? String(J.timeUnixNano) : J.timeUnixNano;
                else X.timeUnixNano = W.longs === String ? _A.Long.prototype.toString.call(J.timeUnixNano) : W.longs === Number ? new _A.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber() : J.timeUnixNano;
              if (J.asDouble != null && J.hasOwnProperty("asDouble")) {
                if (X.asDouble = W.json && !isFinite(J.asDouble) ? String(J.asDouble) : J.asDouble, W.oneofs) X.value = "asDouble"
              }
              if (J.exemplars && J.exemplars.length) {
                X.exemplars = [];
                for (var F = 0; F < J.exemplars.length; ++F) X.exemplars[F] = PA.opentelemetry.proto.metrics.v1.Exemplar.toObject(J.exemplars[F], W)
              }
              if (J.asInt != null && J.hasOwnProperty("asInt")) {
                if (typeof J.asInt === "number") X.asInt = W.longs === String ? String(J.asInt) : J.asInt;
                else X.asInt = W.longs === String ? _A.Long.prototype.toString.call(J.asInt) : W.longs === Number ? new _A.LongBits(J.asInt.low >>> 0, J.asInt.high >>> 0).toNumber() : J.asInt;
                if (W.oneofs) X.value = "asInt"
              }
              if (J.attributes && J.attributes.length) {
                X.attributes = [];
                for (var F = 0; F < J.attributes.length; ++F) X.attributes[F] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(J.attributes[F], W)
              }
              if (J.flags != null && J.hasOwnProperty("flags")) X.flags = J.flags;
              return X
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.NumberDataPoint"
            }, Z
          }(), G.HistogramDataPoint = function() {
            function Z(Y) {
              if (this.attributes = [], this.bucketCounts = [], this.explicitBounds = [], this.exemplars = [], Y) {
                for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                  if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
              }
            }
            Z.prototype.attributes = _A.emptyArray, Z.prototype.startTimeUnixNano = null, Z.prototype.timeUnixNano = null, Z.prototype.count = null, Z.prototype.sum = null, Z.prototype.bucketCounts = _A.emptyArray, Z.prototype.explicitBounds = _A.emptyArray, Z.prototype.exemplars = _A.emptyArray, Z.prototype.flags = null, Z.prototype.min = null, Z.prototype.max = null;
            var I;
            return Object.defineProperty(Z.prototype, "_sum", {
              get: _A.oneOfGetter(I = ["sum"]),
              set: _A.oneOfSetter(I)
            }), Object.defineProperty(Z.prototype, "_min", {
              get: _A.oneOfGetter(I = ["min"]),
              set: _A.oneOfSetter(I)
            }), Object.defineProperty(Z.prototype, "_max", {
              get: _A.oneOfGetter(I = ["max"]),
              set: _A.oneOfSetter(I)
            }), Z.create = function(J) {
              return new Z(J)
            }, Z.encode = function(J, W) {
              if (!W) W = M8.create();
              if (J.startTimeUnixNano != null && Object.hasOwnProperty.call(J, "startTimeUnixNano")) W.uint32(17).fixed64(J.startTimeUnixNano);
              if (J.timeUnixNano != null && Object.hasOwnProperty.call(J, "timeUnixNano")) W.uint32(25).fixed64(J.timeUnixNano);
              if (J.count != null && Object.hasOwnProperty.call(J, "count")) W.uint32(33).fixed64(J.count);
              if (J.sum != null && Object.hasOwnProperty.call(J, "sum")) W.uint32(41).double(J.sum);
              if (J.bucketCounts != null && J.bucketCounts.length) {
                W.uint32(50).fork();
                for (var X = 0; X < J.bucketCounts.length; ++X) W.fixed64(J.bucketCounts[X]);
                W.ldelim()
              }
              if (J.explicitBounds != null && J.explicitBounds.length) {
                W.uint32(58).fork();
                for (var X = 0; X < J.explicitBounds.length; ++X) W.double(J.explicitBounds[X]);
                W.ldelim()
              }
              if (J.exemplars != null && J.exemplars.length)
                for (var X = 0; X < J.exemplars.length; ++X) PA.opentelemetry.proto.metrics.v1.Exemplar.encode(J.exemplars[X], W.uint32(66).fork()).ldelim();
              if (J.attributes != null && J.attributes.length)
                for (var X = 0; X < J.attributes.length; ++X) PA.opentelemetry.proto.common.v1.KeyValue.encode(J.attributes[X], W.uint32(74).fork()).ldelim();
              if (J.flags != null && Object.hasOwnProperty.call(J, "flags")) W.uint32(80).uint32(J.flags);
              if (J.min != null && Object.hasOwnProperty.call(J, "min")) W.uint32(89).double(J.min);
              if (J.max != null && Object.hasOwnProperty.call(J, "max")) W.uint32(97).double(J.max);
              return W
            }, Z.encodeDelimited = function(J, W) {
              return this.encode(J, W).ldelim()
            }, Z.decode = function(J, W, X) {
              if (!(J instanceof B0)) J = B0.create(J);
              var V = W === void 0 ? J.len : J.pos + W,
                F = new PA.opentelemetry.proto.metrics.v1.HistogramDataPoint;
              while (J.pos < V) {
                var K = J.uint32();
                if (K === X) break;
                switch (K >>> 3) {
                  case 9: {
                    if (!(F.attributes && F.attributes.length)) F.attributes = [];
                    F.attributes.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                    break
                  }
                  case 2: {
                    F.startTimeUnixNano = J.fixed64();
                    break
                  }
                  case 3: {
                    F.timeUnixNano = J.fixed64();
                    break
                  }
                  case 4: {
                    F.count = J.fixed64();
                    break
                  }
                  case 5: {
                    F.sum = J.double();
                    break
                  }
                  case 6: {
                    if (!(F.bucketCounts && F.bucketCounts.length)) F.bucketCounts = [];
                    if ((K & 7) === 2) {
                      var D = J.uint32() + J.pos;
                      while (J.pos < D) F.bucketCounts.push(J.fixed64())
                    } else F.bucketCounts.push(J.fixed64());
                    break
                  }
                  case 7: {
                    if (!(F.explicitBounds && F.explicitBounds.length)) F.explicitBounds = [];
                    if ((K & 7) === 2) {
                      var D = J.uint32() + J.pos;
                      while (J.pos < D) F.explicitBounds.push(J.double())
                    } else F.explicitBounds.push(J.double());
                    break
                  }
                  case 8: {
                    if (!(F.exemplars && F.exemplars.length)) F.exemplars = [];
                    F.exemplars.push(PA.opentelemetry.proto.metrics.v1.Exemplar.decode(J, J.uint32()));
                    break
                  }
                  case 10: {
                    F.flags = J.uint32();
                    break
                  }
                  case 11: {
                    F.min = J.double();
                    break
                  }
                  case 12: {
                    F.max = J.double();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return F
            }, Z.decodeDelimited = function(J) {
              if (!(J instanceof B0)) J = new B0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function(J) {
              if (typeof J !== "object" || J === null) return "object expected";
              var W = {};
              if (J.attributes != null && J.hasOwnProperty("attributes")) {
                if (!Array.isArray(J.attributes)) return "attributes: array expected";
                for (var X = 0; X < J.attributes.length; ++X) {
                  var V = PA.opentelemetry.proto.common.v1.KeyValue.verify(J.attributes[X]);
                  if (V) return "attributes." + V
                }
              }
              if (J.startTimeUnixNano != null && J.hasOwnProperty("startTimeUnixNano")) {
                if (!_A.isInteger(J.startTimeUnixNano) && !(J.startTimeUnixNano && _A.isInteger(J.startTimeUnixNano.low) && _A.isInteger(J.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
              }
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano")) {
                if (!_A.isInteger(J.timeUnixNano) && !(J.timeUnixNano && _A.isInteger(J.timeUnixNano.low) && _A.isInteger(J.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (J.count != null && J.hasOwnProperty("count")) {
                if (!_A.isInteger(J.count) && !(J.count && _A.isInteger(J.count.low) && _A.isInteger(J.count.high))) return "count: integer|Long expected"
              }
              if (J.sum != null && J.hasOwnProperty("sum")) {
                if (W._sum = 1, typeof J.sum !== "number") return "sum: number expected"
              }
              if (J.bucketCounts != null && J.hasOwnProperty("bucketCounts")) {
                if (!Array.isArray(J.bucketCounts)) return "bucketCounts: array expected";
                for (var X = 0; X < J.bucketCounts.length; ++X)
                  if (!_A.isInteger(J.bucketCounts[X]) && !(J.bucketCounts[X] && _A.isInteger(J.bucketCounts[X].low) && _A.isInteger(J.bucketCounts[X].high))) return "bucketCounts: integer|Long[] expected"
              }
              if (J.explicitBounds != null && J.hasOwnProperty("explicitBounds")) {
                if (!Array.isArray(J.explicitBounds)) return "explicitBounds: array expected";
                for (var X = 0; X < J.explicitBounds.length; ++X)
                  if (typeof J.explicitBounds[X] !== "number") return "explicitBounds: number[] expected"
              }
              if (J.exemplars != null && J.hasOwnProperty("exemplars")) {
                if (!Array.isArray(J.exemplars)) return "exemplars: array expected";
                for (var X = 0; X < J.exemplars.length; ++X) {
                  var V = PA.opentelemetry.proto.metrics.v1.Exemplar.verify(J.exemplars[X]);
                  if (V) return "exemplars." + V
                }
              }
              if (J.flags != null && J.hasOwnProperty("flags")) {
                if (!_A.isInteger(J.flags)) return "flags: integer expected"
              }
              if (J.min != null && J.hasOwnProperty("min")) {
                if (W._min = 1, typeof J.min !== "number") return "min: number expected"
              }
              if (J.max != null && J.hasOwnProperty("max")) {
                if (W._max = 1, typeof J.max !== "number") return "max: number expected"
              }
              return null
            }, Z.fromObject = function(J) {
              if (J instanceof PA.opentelemetry.proto.metrics.v1.HistogramDataPoint) return J;
              var W = new PA.opentelemetry.proto.metrics.v1.HistogramDataPoint;
              if (J.attributes) {
                if (!Array.isArray(J.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: array expected");
                W.attributes = [];
                for (var X = 0; X < J.attributes.length; ++X) {
                  if (typeof J.attributes[X] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: object expected");
                  W.attributes[X] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.attributes[X])
                }
              }
              if (J.startTimeUnixNano != null) {
                if (_A.Long)(W.startTimeUnixNano = _A.Long.fromValue(J.startTimeUnixNano)).unsigned = !1;
                else if (typeof J.startTimeUnixNano === "string") W.startTimeUnixNano = parseInt(J.startTimeUnixNano, 10);
                else if (typeof J.startTimeUnixNano === "number") W.startTimeUnixNano = J.startTimeUnixNano;
                else if (typeof J.startTimeUnixNano === "object") W.startTimeUnixNano = new _A.LongBits(J.startTimeUnixNano.low >>> 0, J.startTimeUnixNano.high >>> 0).toNumber()
              }
              if (J.timeUnixNano != null) {
                if (_A.Long)(W.timeUnixNano = _A.Long.fromValue(J.timeUnixNano)).unsigned = !1;
                else if (typeof J.timeUnixNano === "string") W.timeUnixNano = parseInt(J.timeUnixNano, 10);
                else if (typeof J.timeUnixNano === "number") W.timeUnixNano = J.timeUnixNano;
                else if (typeof J.timeUnixNano === "object") W.timeUnixNano = new _A.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber()
              }
              if (J.count != null) {
                if (_A.Long)(W.count = _A.Long.fromValue(J.count)).unsigned = !1;
                else if (typeof J.count === "string") W.count = parseInt(J.count, 10);
                else if (typeof J.count === "number") W.count = J.count;
                else if (typeof J.count === "object") W.count = new _A.LongBits(J.count.low >>> 0, J.count.high >>> 0).toNumber()
              }
              if (J.sum != null) W.sum = Number(J.sum);
              if (J.bucketCounts) {
                if (!Array.isArray(J.bucketCounts)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.bucketCounts: array expected");
                W.bucketCounts = [];
                for (var X = 0; X < J.bucketCounts.length; ++X)
                  if (_A.Long)(W.bucketCounts[X] = _A.Long.fromValue(J.bucketCounts[X])).unsigned = !1;
                  else if (typeof J.bucketCounts[X] === "string") W.bucketCounts[X] = parseInt(J.bucketCounts[X], 10);
                else if (typeof J.bucketCounts[X] === "number") W.bucketCounts[X] = J.bucketCounts[X];
                else if (typeof J.bucketCounts[X] === "object") W.bucketCounts[X] = new _A.LongBits(J.bucketCounts[X].low >>> 0, J.bucketCounts[X].high >>> 0).toNumber()
              }
              if (J.explicitBounds) {
                if (!Array.isArray(J.explicitBounds)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.explicitBounds: array expected");
                W.explicitBounds = [];
                for (var X = 0; X < J.explicitBounds.length; ++X) W.explicitBounds[X] = Number(J.explicitBounds[X])
              }
              if (J.exemplars) {
                if (!Array.isArray(J.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: array expected");
                W.exemplars = [];
                for (var X = 0; X < J.exemplars.length; ++X) {
                  if (typeof J.exemplars[X] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: object expected");
                  W.exemplars[X] = PA.opentelemetry.proto.metrics.v1.Exemplar.fromObject(J.exemplars[X])
                }
              }
              if (J.flags != null) W.flags = J.flags >>> 0;
              if (J.min != null) W.min = Number(J.min);
              if (J.max != null) W.max = Number(J.max);
              return W
            }, Z.toObject = function(J, W) {
              if (!W) W = {};
              var X = {};
              if (W.arrays || W.defaults) X.bucketCounts = [], X.explicitBounds = [], X.exemplars = [], X.attributes = [];
              if (W.defaults) {
                if (_A.Long) {
                  var V = new _A.Long(0, 0, !1);
                  X.startTimeUnixNano = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                } else X.startTimeUnixNano = W.longs === String ? "0" : 0;
                if (_A.Long) {
                  var V = new _A.Long(0, 0, !1);
                  X.timeUnixNano = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                } else X.timeUnixNano = W.longs === String ? "0" : 0;
                if (_A.Long) {
                  var V = new _A.Long(0, 0, !1);
                  X.count = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                } else X.count = W.longs === String ? "0" : 0;
                X.flags = 0
              }
              if (J.startTimeUnixNano != null && J.hasOwnProperty("startTimeUnixNano"))
                if (typeof J.startTimeUnixNano === "number") X.startTimeUnixNano = W.longs === String ? String(J.startTimeUnixNano) : J.startTimeUnixNano;
                else X.startTimeUnixNano = W.longs === String ? _A.Long.prototype.toString.call(J.startTimeUnixNano) : W.longs === Number ? new _A.LongBits(J.startTimeUnixNano.low >>> 0, J.startTimeUnixNano.high >>> 0).toNumber() : J.startTimeUnixNano;
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano"))
                if (typeof J.timeUnixNano === "number") X.timeUnixNano = W.longs === String ? String(J.timeUnixNano) : J.timeUnixNano;
                else X.timeUnixNano = W.longs === String ? _A.Long.prototype.toString.call(J.timeUnixNano) : W.longs === Number ? new _A.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber() : J.timeUnixNano;
              if (J.count != null && J.hasOwnProperty("count"))
                if (typeof J.count === "number") X.count = W.longs === String ? String(J.count) : J.count;
                else X.count = W.longs === String ? _A.Long.prototype.toString.call(J.count) : W.longs === Number ? new _A.LongBits(J.count.low >>> 0, J.count.high >>> 0).toNumber() : J.count;
              if (J.sum != null && J.hasOwnProperty("sum")) {
                if (X.sum = W.json && !isFinite(J.sum) ? String(J.sum) : J.sum, W.oneofs) X._sum = "sum"
              }
              if (J.bucketCounts && J.bucketCounts.length) {
                X.bucketCounts = [];
                for (var F = 0; F < J.bucketCounts.length; ++F)
                  if (typeof J.bucketCounts[F] === "number") X.bucketCounts[F] = W.longs === String ? String(J.bucketCounts[F]) : J.bucketCounts[F];
                  else X.bucketCounts[F] = W.longs === String ? _A.Long.prototype.toString.call(J.bucketCounts[F]) : W.longs === Number ? new _A.LongBits(J.bucketCounts[F].low >>> 0, J.bucketCounts[F].high >>> 0).toNumber() : J.bucketCounts[F]
              }
              if (J.explicitBounds && J.explicitBounds.length) {
                X.explicitBounds = [];
                for (var F = 0; F < J.explicitBounds.length; ++F) X.explicitBounds[F] = W.json && !isFinite(J.explicitBounds[F]) ? String(J.explicitBounds[F]) : J.explicitBounds[F]
              }
              if (J.exemplars && J.exemplars.length) {
                X.exemplars = [];
                for (var F = 0; F < J.exemplars.length; ++F) X.exemplars[F] = PA.opentelemetry.proto.metrics.v1.Exemplar.toObject(J.exemplars[F], W)
              }
              if (J.attributes && J.attributes.length) {
                X.attributes = [];
                for (var F = 0; F < J.attributes.length; ++F) X.attributes[F] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(J.attributes[F], W)
              }
              if (J.flags != null && J.hasOwnProperty("flags")) X.flags = J.flags;
              if (J.min != null && J.hasOwnProperty("min")) {
                if (X.min = W.json && !isFinite(J.min) ? String(J.min) : J.min, W.oneofs) X._min = "min"
              }
              if (J.max != null && J.hasOwnProperty("max")) {
                if (X.max = W.json && !isFinite(J.max) ? String(J.max) : J.max, W.oneofs) X._max = "max"
              }
              return X
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.HistogramDataPoint"
            }, Z
          }(), G.ExponentialHistogramDataPoint = function() {
            function Z(Y) {
              if (this.attributes = [], this.exemplars = [], Y) {
                for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                  if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
              }
            }
            Z.prototype.attributes = _A.emptyArray, Z.prototype.startTimeUnixNano = null, Z.prototype.timeUnixNano = null, Z.prototype.count = null, Z.prototype.sum = null, Z.prototype.scale = null, Z.prototype.zeroCount = null, Z.prototype.positive = null, Z.prototype.negative = null, Z.prototype.flags = null, Z.prototype.exemplars = _A.emptyArray, Z.prototype.min = null, Z.prototype.max = null, Z.prototype.zeroThreshold = null;
            var I;
            return Object.defineProperty(Z.prototype, "_sum", {
              get: _A.oneOfGetter(I = ["sum"]),
              set: _A.oneOfSetter(I)
            }), Object.defineProperty(Z.prototype, "_min", {
              get: _A.oneOfGetter(I = ["min"]),
              set: _A.oneOfSetter(I)
            }), Object.defineProperty(Z.prototype, "_max", {
              get: _A.oneOfGetter(I = ["max"]),
              set: _A.oneOfSetter(I)
            }), Z.create = function(J) {
              return new Z(J)
            }, Z.encode = function(J, W) {
              if (!W) W = M8.create();
              if (J.attributes != null && J.attributes.length)
                for (var X = 0; X < J.attributes.length; ++X) PA.opentelemetry.proto.common.v1.KeyValue.encode(J.attributes[X], W.uint32(10).fork()).ldelim();
              if (J.startTimeUnixNano != null && Object.hasOwnProperty.call(J, "startTimeUnixNano")) W.uint32(17).fixed64(J.startTimeUnixNano);
              if (J.timeUnixNano != null && Object.hasOwnProperty.call(J, "timeUnixNano")) W.uint32(25).fixed64(J.timeUnixNano);
              if (J.count != null && Object.hasOwnProperty.call(J, "count")) W.uint32(33).fixed64(J.count);
              if (J.sum != null && Object.hasOwnProperty.call(J, "sum")) W.uint32(41).double(J.sum);
              if (J.scale != null && Object.hasOwnProperty.call(J, "scale")) W.uint32(48).sint32(J.scale);
              if (J.zeroCount != null && Object.hasOwnProperty.call(J, "zeroCount")) W.uint32(57).fixed64(J.zeroCount);
              if (J.positive != null && Object.hasOwnProperty.call(J, "positive")) PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode(J.positive, W.uint32(66).fork()).ldelim();
              if (J.negative != null && Object.hasOwnProperty.call(J, "negative")) PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode(J.negative, W.uint32(74).fork()).ldelim();
              if (J.flags != null && Object.hasOwnProperty.call(J, "flags")) W.uint32(80).uint32(J.flags);
              if (J.exemplars != null && J.exemplars.length)
                for (var X = 0; X < J.exemplars.length; ++X) PA.opentelemetry.proto.metrics.v1.Exemplar.encode(J.exemplars[X], W.uint32(90).fork()).ldelim();
              if (J.min != null && Object.hasOwnProperty.call(J, "min")) W.uint32(97).double(J.min);
              if (J.max != null && Object.hasOwnProperty.call(J, "max")) W.uint32(105).double(J.max);
              if (J.zeroThreshold != null && Object.hasOwnProperty.call(J, "zeroThreshold")) W.uint32(113).double(J.zeroThreshold);
              return W
            }, Z.encodeDelimited = function(J, W) {
              return this.encode(J, W).ldelim()
            }, Z.decode = function(J, W, X) {
              if (!(J instanceof B0)) J = B0.create(J);
              var V = W === void 0 ? J.len : J.pos + W,
                F = new PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;
              while (J.pos < V) {
                var K = J.uint32();
                if (K === X) break;
                switch (K >>> 3) {
                  case 1: {
                    if (!(F.attributes && F.attributes.length)) F.attributes = [];
                    F.attributes.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                    break
                  }
                  case 2: {
                    F.startTimeUnixNano = J.fixed64();
                    break
                  }
                  case 3: {
                    F.timeUnixNano = J.fixed64();
                    break
                  }
                  case 4: {
                    F.count = J.fixed64();
                    break
                  }
                  case 5: {
                    F.sum = J.double();
                    break
                  }
                  case 6: {
                    F.scale = J.sint32();
                    break
                  }
                  case 7: {
                    F.zeroCount = J.fixed64();
                    break
                  }
                  case 8: {
                    F.positive = PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(J, J.uint32());
                    break
                  }
                  case 9: {
                    F.negative = PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(J, J.uint32());
                    break
                  }
                  case 10: {
                    F.flags = J.uint32();
                    break
                  }
                  case 11: {
                    if (!(F.exemplars && F.exemplars.length)) F.exemplars = [];
                    F.exemplars.push(PA.opentelemetry.proto.metrics.v1.Exemplar.decode(J, J.uint32()));
                    break
                  }
                  case 12: {
                    F.min = J.double();
                    break
                  }
                  case 13: {
                    F.max = J.double();
                    break
                  }
                  case 14: {
                    F.zeroThreshold = J.double();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return F
            }, Z.decodeDelimited = function(J) {
              if (!(J instanceof B0)) J = new B0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function(J) {
              if (typeof J !== "object" || J === null) return "object expected";
              var W = {};
              if (J.attributes != null && J.hasOwnProperty("attributes")) {
                if (!Array.isArray(J.attributes)) return "attributes: array expected";
                for (var X = 0; X < J.attributes.length; ++X) {
                  var V = PA.opentelemetry.proto.common.v1.KeyValue.verify(J.attributes[X]);
                  if (V) return "attributes." + V
                }
              }
              if (J.startTimeUnixNano != null && J.hasOwnProperty("startTimeUnixNano")) {
                if (!_A.isInteger(J.startTimeUnixNano) && !(J.startTimeUnixNano && _A.isInteger(J.startTimeUnixNano.low) && _A.isInteger(J.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
              }
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano")) {
                if (!_A.isInteger(J.timeUnixNano) && !(J.timeUnixNano && _A.isInteger(J.timeUnixNano.low) && _A.isInteger(J.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (J.count != null && J.hasOwnProperty("count")) {
                if (!_A.isInteger(J.count) && !(J.count && _A.isInteger(J.count.low) && _A.isInteger(J.count.high))) return "count: integer|Long expected"
              }
              if (J.sum != null && J.hasOwnProperty("sum")) {
                if (W._sum = 1, typeof J.sum !== "number") return "sum: number expected"
              }
              if (J.scale != null && J.hasOwnProperty("scale")) {
                if (!_A.isInteger(J.scale)) return "scale: integer expected"
              }
              if (J.zeroCount != null && J.hasOwnProperty("zeroCount")) {
                if (!_A.isInteger(J.zeroCount) && !(J.zeroCount && _A.isInteger(J.zeroCount.low) && _A.isInteger(J.zeroCount.high))) return "zeroCount: integer|Long expected"
              }
              if (J.positive != null && J.hasOwnProperty("positive")) {
                var V = PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify(J.positive);
                if (V) return "positive." + V
              }
              if (J.negative != null && J.hasOwnProperty("negative")) {
                var V = PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify(J.negative);
                if (V) return "negative." + V
              }
              if (J.flags != null && J.hasOwnProperty("flags")) {
                if (!_A.isInteger(J.flags)) return "flags: integer expected"
              }
              if (J.exemplars != null && J.hasOwnProperty("exemplars")) {
                if (!Array.isArray(J.exemplars)) return "exemplars: array expected";
                for (var X = 0; X < J.exemplars.length; ++X) {
                  var V = PA.opentelemetry.proto.metrics.v1.Exemplar.verify(J.exemplars[X]);
                  if (V) return "exemplars." + V
                }
              }
              if (J.min != null && J.hasOwnProperty("min")) {
                if (W._min = 1, typeof J.min !== "number") return "min: number expected"
              }
              if (J.max != null && J.hasOwnProperty("max")) {
                if (W._max = 1, typeof J.max !== "number") return "max: number expected"
              }
              if (J.zeroThreshold != null && J.hasOwnProperty("zeroThreshold")) {
                if (typeof J.zeroThreshold !== "number") return "zeroThreshold: number expected"
              }
              return null
            }, Z.fromObject = function(J) {
              if (J instanceof PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint) return J;
              var W = new PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;
              if (J.attributes) {
                if (!Array.isArray(J.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: array expected");
                W.attributes = [];
                for (var X = 0; X < J.attributes.length; ++X) {
                  if (typeof J.attributes[X] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: object expected");
                  W.attributes[X] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.attributes[X])
                }
              }
              if (J.startTimeUnixNano != null) {
                if (_A.Long)(W.startTimeUnixNano = _A.Long.fromValue(J.startTimeUnixNano)).unsigned = !1;
                else if (typeof J.startTimeUnixNano === "string") W.startTimeUnixNano = parseInt(J.startTimeUnixNano, 10);
                else if (typeof J.startTimeUnixNano === "number") W.startTimeUnixNano = J.startTimeUnixNano;
                else if (typeof J.startTimeUnixNano === "object") W.startTimeUnixNano = new _A.LongBits(J.startTimeUnixNano.low >>> 0, J.startTimeUnixNano.high >>> 0).toNumber()
              }
              if (J.timeUnixNano != null) {
                if (_A.Long)(W.timeUnixNano = _A.Long.fromValue(J.timeUnixNano)).unsigned = !1;
                else if (typeof J.timeUnixNano === "string") W.timeUnixNano = parseInt(J.timeUnixNano, 10);
                else if (typeof J.timeUnixNano === "number") W.timeUnixNano = J.timeUnixNano;
                else if (typeof J.timeUnixNano === "object") W.timeUnixNano = new _A.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber()
              }
              if (J.count != null) {
                if (_A.Long)(W.count = _A.Long.fromValue(J.count)).unsigned = !1;
                else if (typeof J.count === "string") W.count = parseInt(J.count, 10);
                else if (typeof J.count === "number") W.count = J.count;
                else if (typeof J.count === "object") W.count = new _A.LongBits(J.count.low >>> 0, J.count.high >>> 0).toNumber()
              }
              if (J.sum != null) W.sum = Number(J.sum);
              if (J.scale != null) W.scale = J.scale | 0;
              if (J.zeroCount != null) {
                if (_A.Long)(W.zeroCount = _A.Long.fromValue(J.zeroCount)).unsigned = !1;
                else if (typeof J.zeroCount === "string") W.zeroCount = parseInt(J.zeroCount, 10);
                else if (typeof J.zeroCount === "number") W.zeroCount = J.zeroCount;
                else if (typeof J.zeroCount === "object") W.zeroCount = new _A.LongBits(J.zeroCount.low >>> 0, J.zeroCount.high >>> 0).toNumber()
              }
              if (J.positive != null) {
                if (typeof J.positive !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.positive: object expected");
                W.positive = PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(J.positive)
              }
              if (J.negative != null) {
                if (typeof J.negative !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.negative: object expected");
                W.negative = PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(J.negative)
              }
              if (J.flags != null) W.flags = J.flags >>> 0;
              if (J.exemplars) {
                if (!Array.isArray(J.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: array expected");
                W.exemplars = [];
                for (var X = 0; X < J.exemplars.length; ++X) {
                  if (typeof J.exemplars[X] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: object expected");
                  W.exemplars[X] = PA.opentelemetry.proto.metrics.v1.Exemplar.fromObject(J.exemplars[X])
                }
              }
              if (J.min != null) W.min = Number(J.min);
              if (J.max != null) W.max = Number(J.max);
              if (J.zeroThreshold != null) W.zeroThreshold = Number(J.zeroThreshold);
              return W
            }, Z.toObject = function(J, W) {
              if (!W) W = {};
              var X = {};
              if (W.arrays || W.defaults) X.attributes = [], X.exemplars = [];
              if (W.defaults) {
                if (_A.Long) {
                  var V = new _A.Long(0, 0, !1);
                  X.startTimeUnixNano = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                } else X.startTimeUnixNano = W.longs === String ? "0" : 0;
                if (_A.Long) {
                  var V = new _A.Long(0, 0, !1);
                  X.timeUnixNano = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                } else X.timeUnixNano = W.longs === String ? "0" : 0;
                if (_A.Long) {
                  var V = new _A.Long(0, 0, !1);
                  X.count = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                } else X.count = W.longs === String ? "0" : 0;
                if (X.scale = 0, _A.Long) {
                  var V = new _A.Long(0, 0, !1);
                  X.zeroCount = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                } else X.zeroCount = W.longs === String ? "0" : 0;
                X.positive = null, X.negative = null, X.flags = 0, X.zeroThreshold = 0
              }
              if (J.attributes && J.attributes.length) {
                X.attributes = [];
                for (var F = 0; F < J.attributes.length; ++F) X.attributes[F] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(J.attributes[F], W)
              }
              if (J.startTimeUnixNano != null && J.hasOwnProperty("startTimeUnixNano"))
                if (typeof J.startTimeUnixNano === "number") X.startTimeUnixNano = W.longs === String ? String(J.startTimeUnixNano) : J.startTimeUnixNano;
                else X.startTimeUnixNano = W.longs === String ? _A.Long.prototype.toString.call(J.startTimeUnixNano) : W.longs === Number ? new _A.LongBits(J.startTimeUnixNano.low >>> 0, J.startTimeUnixNano.high >>> 0).toNumber() : J.startTimeUnixNano;
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano"))
                if (typeof J.timeUnixNano === "number") X.timeUnixNano = W.longs === String ? String(J.timeUnixNano) : J.timeUnixNano;
                else X.timeUnixNano = W.longs === String ? _A.Long.prototype.toString.call(J.timeUnixNano) : W.longs === Number ? new _A.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber() : J.timeUnixNano;
              if (J.count != null && J.hasOwnProperty("count"))
                if (typeof J.count === "number") X.count = W.longs === String ? String(J.count) : J.count;
                else X.count = W.longs === String ? _A.Long.prototype.toString.call(J.count) : W.longs === Number ? new _A.LongBits(J.count.low >>> 0, J.count.high >>> 0).toNumber() : J.count;
              if (J.sum != null && J.hasOwnProperty("sum")) {
                if (X.sum = W.json && !isFinite(J.sum) ? String(J.sum) : J.sum, W.oneofs) X._sum = "sum"
              }
              if (J.scale != null && J.hasOwnProperty("scale")) X.scale = J.scale;
              if (J.zeroCount != null && J.hasOwnProperty("zeroCount"))
                if (typeof J.zeroCount === "number") X.zeroCount = W.longs === String ? String(J.zeroCount) : J.zeroCount;
                else X.zeroCount = W.longs === String ? _A.Long.prototype.toString.call(J.zeroCount) : W.longs === Number ? new _A.LongBits(J.zeroCount.low >>> 0, J.zeroCount.high >>> 0).toNumber() : J.zeroCount;
              if (J.positive != null && J.hasOwnProperty("positive")) X.positive = PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(J.positive, W);
              if (J.negative != null && J.hasOwnProperty("negative")) X.negative = PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(J.negative, W);
              if (J.flags != null && J.hasOwnProperty("flags")) X.flags = J.flags;
              if (J.exemplars && J.exemplars.length) {
                X.exemplars = [];
                for (var F = 0; F < J.exemplars.length; ++F) X.exemplars[F] = PA.opentelemetry.proto.metrics.v1.Exemplar.toObject(J.exemplars[F], W)
              }
              if (J.min != null && J.hasOwnProperty("min")) {
                if (X.min = W.json && !isFinite(J.min) ? String(J.min) : J.min, W.oneofs) X._min = "min"
              }
              if (J.max != null && J.hasOwnProperty("max")) {
                if (X.max = W.json && !isFinite(J.max) ? String(J.max) : J.max, W.oneofs) X._max = "max"
              }
              if (J.zeroThreshold != null && J.hasOwnProperty("zeroThreshold")) X.zeroThreshold = W.json && !isFinite(J.zeroThreshold) ? String(J.zeroThreshold) : J.zeroThreshold;
              return X
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint"
            }, Z.Buckets = function() {
              function Y(J) {
                if (this.bucketCounts = [], J) {
                  for (var W = Object.keys(J), X = 0; X < W.length; ++X)
                    if (J[W[X]] != null) this[W[X]] = J[W[X]]
                }
              }
              return Y.prototype.offset = null, Y.prototype.bucketCounts = _A.emptyArray, Y.create = function(W) {
                return new Y(W)
              }, Y.encode = function(W, X) {
                if (!X) X = M8.create();
                if (W.offset != null && Object.hasOwnProperty.call(W, "offset")) X.uint32(8).sint32(W.offset);
                if (W.bucketCounts != null && W.bucketCounts.length) {
                  X.uint32(18).fork();
                  for (var V = 0; V < W.bucketCounts.length; ++V) X.uint64(W.bucketCounts[V]);
                  X.ldelim()
                }
                return X
              }, Y.encodeDelimited = function(W, X) {
                return this.encode(W, X).ldelim()
              }, Y.decode = function(W, X, V) {
                if (!(W instanceof B0)) W = B0.create(W);
                var F = X === void 0 ? W.len : W.pos + X,
                  K = new PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;
                while (W.pos < F) {
                  var D = W.uint32();
                  if (D === V) break;
                  switch (D >>> 3) {
                    case 1: {
                      K.offset = W.sint32();
                      break
                    }
                    case 2: {
                      if (!(K.bucketCounts && K.bucketCounts.length)) K.bucketCounts = [];
                      if ((D & 7) === 2) {
                        var H = W.uint32() + W.pos;
                        while (W.pos < H) K.bucketCounts.push(W.uint64())
                      } else K.bucketCounts.push(W.uint64());
                      break
                    }
                    default:
                      W.skipType(D & 7);
                      break
                  }
                }
                return K
              }, Y.decodeDelimited = function(W) {
                if (!(W instanceof B0)) W = new B0(W);
                return this.decode(W, W.uint32())
              }, Y.verify = function(W) {
                if (typeof W !== "object" || W === null) return "object expected";
                if (W.offset != null && W.hasOwnProperty("offset")) {
                  if (!_A.isInteger(W.offset)) return "offset: integer expected"
                }
                if (W.bucketCounts != null && W.hasOwnProperty("bucketCounts")) {
                  if (!Array.isArray(W.bucketCounts)) return "bucketCounts: array expected";
                  for (var X = 0; X < W.bucketCounts.length; ++X)
                    if (!_A.isInteger(W.bucketCounts[X]) && !(W.bucketCounts[X] && _A.isInteger(W.bucketCounts[X].low) && _A.isInteger(W.bucketCounts[X].high))) return "bucketCounts: integer|Long[] expected"
                }
                return null
              }, Y.fromObject = function(W) {
                if (W instanceof PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets) return W;
                var X = new PA.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;
                if (W.offset != null) X.offset = W.offset | 0;
                if (W.bucketCounts) {
                  if (!Array.isArray(W.bucketCounts)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.bucketCounts: array expected");
                  X.bucketCounts = [];
                  for (var V = 0; V < W.bucketCounts.length; ++V)
                    if (_A.Long)(X.bucketCounts[V] = _A.Long.fromValue(W.bucketCounts[V])).unsigned = !0;
                    else if (typeof W.bucketCounts[V] === "string") X.bucketCounts[V] = parseInt(W.bucketCounts[V], 10);
                  else if (typeof W.bucketCounts[V] === "number") X.bucketCounts[V] = W.bucketCounts[V];
                  else if (typeof W.bucketCounts[V] === "object") X.bucketCounts[V] = new _A.LongBits(W.bucketCounts[V].low >>> 0, W.bucketCounts[V].high >>> 0).toNumber(!0)
                }
                return X
              }, Y.toObject = function(W, X) {
                if (!X) X = {};
                var V = {};
                if (X.arrays || X.defaults) V.bucketCounts = [];
                if (X.defaults) V.offset = 0;
                if (W.offset != null && W.hasOwnProperty("offset")) V.offset = W.offset;
                if (W.bucketCounts && W.bucketCounts.length) {
                  V.bucketCounts = [];
                  for (var F = 0; F < W.bucketCounts.length; ++F)
                    if (typeof W.bucketCounts[F] === "number") V.bucketCounts[F] = X.longs === String ? String(W.bucketCounts[F]) : W.bucketCounts[F];
                    else V.bucketCounts[F] = X.longs === String ? _A.Long.prototype.toString.call(W.bucketCounts[F]) : X.longs === Number ? new _A.LongBits(W.bucketCounts[F].low >>> 0, W.bucketCounts[F].high >>> 0).toNumber(!0) : W.bucketCounts[F]
                }
                return V
              }, Y.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, Y.getTypeUrl = function(W) {
                if (W === void 0) W = "type.googleapis.com";
                return W + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets"
              }, Y
            }(), Z
          }(), G.SummaryDataPoint = function() {
            function Z(I) {
              if (this.attributes = [], this.quantileValues = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.attributes = _A.emptyArray, Z.prototype.startTimeUnixNano = null, Z.prototype.timeUnixNano = null, Z.prototype.count = null, Z.prototype.sum = null, Z.prototype.quantileValues = _A.emptyArray, Z.prototype.flags = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.startTimeUnixNano != null && Object.hasOwnProperty.call(Y, "startTimeUnixNano")) J.uint32(17).fixed64(Y.startTimeUnixNano);
              if (Y.timeUnixNano != null && Object.hasOwnProperty.call(Y, "timeUnixNano")) J.uint32(25).fixed64(Y.timeUnixNano);
              if (Y.count != null && Object.hasOwnProperty.call(Y, "count")) J.uint32(33).fixed64(Y.count);
              if (Y.sum != null && Object.hasOwnProperty.call(Y, "sum")) J.uint32(41).double(Y.sum);
              if (Y.quantileValues != null && Y.quantileValues.length)
                for (var W = 0; W < Y.quantileValues.length; ++W) PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.encode(Y.quantileValues[W], J.uint32(50).fork()).ldelim();
              if (Y.attributes != null && Y.attributes.length)
                for (var W = 0; W < Y.attributes.length; ++W) PA.opentelemetry.proto.common.v1.KeyValue.encode(Y.attributes[W], J.uint32(58).fork()).ldelim();
              if (Y.flags != null && Object.hasOwnProperty.call(Y, "flags")) J.uint32(64).uint32(Y.flags);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.metrics.v1.SummaryDataPoint;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 7: {
                    if (!(V.attributes && V.attributes.length)) V.attributes = [];
                    V.attributes.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(Y, Y.uint32()));
                    break
                  }
                  case 2: {
                    V.startTimeUnixNano = Y.fixed64();
                    break
                  }
                  case 3: {
                    V.timeUnixNano = Y.fixed64();
                    break
                  }
                  case 4: {
                    V.count = Y.fixed64();
                    break
                  }
                  case 5: {
                    V.sum = Y.double();
                    break
                  }
                  case 6: {
                    if (!(V.quantileValues && V.quantileValues.length)) V.quantileValues = [];
                    V.quantileValues.push(PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.decode(Y, Y.uint32()));
                    break
                  }
                  case 8: {
                    V.flags = Y.uint32();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.attributes != null && Y.hasOwnProperty("attributes")) {
                if (!Array.isArray(Y.attributes)) return "attributes: array expected";
                for (var J = 0; J < Y.attributes.length; ++J) {
                  var W = PA.opentelemetry.proto.common.v1.KeyValue.verify(Y.attributes[J]);
                  if (W) return "attributes." + W
                }
              }
              if (Y.startTimeUnixNano != null && Y.hasOwnProperty("startTimeUnixNano")) {
                if (!_A.isInteger(Y.startTimeUnixNano) && !(Y.startTimeUnixNano && _A.isInteger(Y.startTimeUnixNano.low) && _A.isInteger(Y.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
              }
              if (Y.timeUnixNano != null && Y.hasOwnProperty("timeUnixNano")) {
                if (!_A.isInteger(Y.timeUnixNano) && !(Y.timeUnixNano && _A.isInteger(Y.timeUnixNano.low) && _A.isInteger(Y.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (Y.count != null && Y.hasOwnProperty("count")) {
                if (!_A.isInteger(Y.count) && !(Y.count && _A.isInteger(Y.count.low) && _A.isInteger(Y.count.high))) return "count: integer|Long expected"
              }
              if (Y.sum != null && Y.hasOwnProperty("sum")) {
                if (typeof Y.sum !== "number") return "sum: number expected"
              }
              if (Y.quantileValues != null && Y.hasOwnProperty("quantileValues")) {
                if (!Array.isArray(Y.quantileValues)) return "quantileValues: array expected";
                for (var J = 0; J < Y.quantileValues.length; ++J) {
                  var W = PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.verify(Y.quantileValues[J]);
                  if (W) return "quantileValues." + W
                }
              }
              if (Y.flags != null && Y.hasOwnProperty("flags")) {
                if (!_A.isInteger(Y.flags)) return "flags: integer expected"
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.metrics.v1.SummaryDataPoint) return Y;
              var J = new PA.opentelemetry.proto.metrics.v1.SummaryDataPoint;
              if (Y.attributes) {
                if (!Array.isArray(Y.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: array expected");
                J.attributes = [];
                for (var W = 0; W < Y.attributes.length; ++W) {
                  if (typeof Y.attributes[W] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: object expected");
                  J.attributes[W] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(Y.attributes[W])
                }
              }
              if (Y.startTimeUnixNano != null) {
                if (_A.Long)(J.startTimeUnixNano = _A.Long.fromValue(Y.startTimeUnixNano)).unsigned = !1;
                else if (typeof Y.startTimeUnixNano === "string") J.startTimeUnixNano = parseInt(Y.startTimeUnixNano, 10);
                else if (typeof Y.startTimeUnixNano === "number") J.startTimeUnixNano = Y.startTimeUnixNano;
                else if (typeof Y.startTimeUnixNano === "object") J.startTimeUnixNano = new _A.LongBits(Y.startTimeUnixNano.low >>> 0, Y.startTimeUnixNano.high >>> 0).toNumber()
              }
              if (Y.timeUnixNano != null) {
                if (_A.Long)(J.timeUnixNano = _A.Long.fromValue(Y.timeUnixNano)).unsigned = !1;
                else if (typeof Y.timeUnixNano === "string") J.timeUnixNano = parseInt(Y.timeUnixNano, 10);
                else if (typeof Y.timeUnixNano === "number") J.timeUnixNano = Y.timeUnixNano;
                else if (typeof Y.timeUnixNano === "object") J.timeUnixNano = new _A.LongBits(Y.timeUnixNano.low >>> 0, Y.timeUnixNano.high >>> 0).toNumber()
              }
              if (Y.count != null) {
                if (_A.Long)(J.count = _A.Long.fromValue(Y.count)).unsigned = !1;
                else if (typeof Y.count === "string") J.count = parseInt(Y.count, 10);
                else if (typeof Y.count === "number") J.count = Y.count;
                else if (typeof Y.count === "object") J.count = new _A.LongBits(Y.count.low >>> 0, Y.count.high >>> 0).toNumber()
              }
              if (Y.sum != null) J.sum = Number(Y.sum);
              if (Y.quantileValues) {
                if (!Array.isArray(Y.quantileValues)) throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: array expected");
                J.quantileValues = [];
                for (var W = 0; W < Y.quantileValues.length; ++W) {
                  if (typeof Y.quantileValues[W] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: object expected");
                  J.quantileValues[W] = PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.fromObject(Y.quantileValues[W])
                }
              }
              if (Y.flags != null) J.flags = Y.flags >>> 0;
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.quantileValues = [], W.attributes = [];
              if (J.defaults) {
                if (_A.Long) {
                  var X = new _A.Long(0, 0, !1);
                  W.startTimeUnixNano = J.longs === String ? X.toString() : J.longs === Number ? X.toNumber() : X
                } else W.startTimeUnixNano = J.longs === String ? "0" : 0;
                if (_A.Long) {
                  var X = new _A.Long(0, 0, !1);
                  W.timeUnixNano = J.longs === String ? X.toString() : J.longs === Number ? X.toNumber() : X
                } else W.timeUnixNano = J.longs === String ? "0" : 0;
                if (_A.Long) {
                  var X = new _A.Long(0, 0, !1);
                  W.count = J.longs === String ? X.toString() : J.longs === Number ? X.toNumber() : X
                } else W.count = J.longs === String ? "0" : 0;
                W.sum = 0, W.flags = 0
              }
              if (Y.startTimeUnixNano != null && Y.hasOwnProperty("startTimeUnixNano"))
                if (typeof Y.startTimeUnixNano === "number") W.startTimeUnixNano = J.longs === String ? String(Y.startTimeUnixNano) : Y.startTimeUnixNano;
                else W.startTimeUnixNano = J.longs === String ? _A.Long.prototype.toString.call(Y.startTimeUnixNano) : J.longs === Number ? new _A.LongBits(Y.startTimeUnixNano.low >>> 0, Y.startTimeUnixNano.high >>> 0).toNumber() : Y.startTimeUnixNano;
              if (Y.timeUnixNano != null && Y.hasOwnProperty("timeUnixNano"))
                if (typeof Y.timeUnixNano === "number") W.timeUnixNano = J.longs === String ? String(Y.timeUnixNano) : Y.timeUnixNano;
                else W.timeUnixNano = J.longs === String ? _A.Long.prototype.toString.call(Y.timeUnixNano) : J.longs === Number ? new _A.LongBits(Y.timeUnixNano.low >>> 0, Y.timeUnixNano.high >>> 0).toNumber() : Y.timeUnixNano;
              if (Y.count != null && Y.hasOwnProperty("count"))
                if (typeof Y.count === "number") W.count = J.longs === String ? String(Y.count) : Y.count;
                else W.count = J.longs === String ? _A.Long.prototype.toString.call(Y.count) : J.longs === Number ? new _A.LongBits(Y.count.low >>> 0, Y.count.high >>> 0).toNumber() : Y.count;
              if (Y.sum != null && Y.hasOwnProperty("sum")) W.sum = J.json && !isFinite(Y.sum) ? String(Y.sum) : Y.sum;
              if (Y.quantileValues && Y.quantileValues.length) {
                W.quantileValues = [];
                for (var V = 0; V < Y.quantileValues.length; ++V) W.quantileValues[V] = PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.toObject(Y.quantileValues[V], J)
              }
              if (Y.attributes && Y.attributes.length) {
                W.attributes = [];
                for (var V = 0; V < Y.attributes.length; ++V) W.attributes[V] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(Y.attributes[V], J)
              }
              if (Y.flags != null && Y.hasOwnProperty("flags")) W.flags = Y.flags;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.metrics.v1.SummaryDataPoint"
            }, Z.ValueAtQuantile = function() {
              function I(Y) {
                if (Y) {
                  for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                    if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
                }
              }
              return I.prototype.quantile = null, I.prototype.value = null, I.create = function(J) {
                return new I(J)
              }, I.encode = function(J, W) {
                if (!W) W = M8.create();
                if (J.quantile != null && Object.hasOwnProperty.call(J, "quantile")) W.uint32(9).double(J.quantile);
                if (J.value != null && Object.hasOwnProperty.call(J, "value")) W.uint32(17).double(J.value);
                return W
              }, I.encodeDelimited = function(J, W) {
                return this.encode(J, W).ldelim()
              }, I.decode = function(J, W, X) {
                if (!(J instanceof B0)) J = B0.create(J);
                var V = W === void 0 ? J.len : J.pos + W,
                  F = new PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;
                while (J.pos < V) {
                  var K = J.uint32();
                  if (K === X) break;
                  switch (K >>> 3) {
                    case 1: {
                      F.quantile = J.double();
                      break
                    }
                    case 2: {
                      F.value = J.double();
                      break
                    }
                    default:
                      J.skipType(K & 7);
                      break
                  }
                }
                return F
              }, I.decodeDelimited = function(J) {
                if (!(J instanceof B0)) J = new B0(J);
                return this.decode(J, J.uint32())
              }, I.verify = function(J) {
                if (typeof J !== "object" || J === null) return "object expected";
                if (J.quantile != null && J.hasOwnProperty("quantile")) {
                  if (typeof J.quantile !== "number") return "quantile: number expected"
                }
                if (J.value != null && J.hasOwnProperty("value")) {
                  if (typeof J.value !== "number") return "value: number expected"
                }
                return null
              }, I.fromObject = function(J) {
                if (J instanceof PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile) return J;
                var W = new PA.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;
                if (J.quantile != null) W.quantile = Number(J.quantile);
                if (J.value != null) W.value = Number(J.value);
                return W
              }, I.toObject = function(J, W) {
                if (!W) W = {};
                var X = {};
                if (W.defaults) X.quantile = 0, X.value = 0;
                if (J.quantile != null && J.hasOwnProperty("quantile")) X.quantile = W.json && !isFinite(J.quantile) ? String(J.quantile) : J.quantile;
                if (J.value != null && J.hasOwnProperty("value")) X.value = W.json && !isFinite(J.value) ? String(J.value) : J.value;
                return X
              }, I.prototype.toJSON = function() {
                return this.constructor.toObject(this, _9.util.toJSONOptions)
              }, I.getTypeUrl = function(J) {
                if (J === void 0) J = "type.googleapis.com";
                return J + "/opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile"
              }, I
            }(), Z
          }(), G.Exemplar = function() {
            function Z(Y) {
              if (this.filteredAttributes = [], Y) {
                for (var J = Object.keys(Y), W = 0; W < J.length; ++W)
                  if (Y[J[W]] != null) this[J[W]] = Y[J[W]]
              }
            }
            Z.prototype.filteredAttributes = _A.emptyArray, Z.prototype.timeUnixNano = null, Z.prototype.asDouble = null, Z.prototype.asInt = null, Z.prototype.spanId = null, Z.prototype.traceId = null;
            var I;
            return Object.defineProperty(Z.prototype, "value", {
              get: _A.oneOfGetter(I = ["asDouble", "asInt"]),
              set: _A.oneOfSetter(I)
            }), Z.create = function(J) {
              return new Z(J)
            }, Z.encode = function(J, W) {
              if (!W) W = M8.create();
              if (J.timeUnixNano != null && Object.hasOwnProperty.call(J, "timeUnixNano")) W.uint32(17).fixed64(J.timeUnixNano);
              if (J.asDouble != null && Object.hasOwnProperty.call(J, "asDouble")) W.uint32(25).double(J.asDouble);
              if (J.spanId != null && Object.hasOwnProperty.call(J, "spanId")) W.uint32(34).bytes(J.spanId);
              if (J.traceId != null && Object.hasOwnProperty.call(J, "traceId")) W.uint32(42).bytes(J.traceId);
              if (J.asInt != null && Object.hasOwnProperty.call(J, "asInt")) W.uint32(49).sfixed64(J.asInt);
              if (J.filteredAttributes != null && J.filteredAttributes.length)
                for (var X = 0; X < J.filteredAttributes.length; ++X) PA.opentelemetry.proto.common.v1.KeyValue.encode(J.filteredAttributes[X], W.uint32(58).fork()).ldelim();
              return W
            }, Z.encodeDelimited = function(J, W) {
              return this.encode(J, W).ldelim()
            }, Z.decode = function(J, W, X) {
              if (!(J instanceof B0)) J = B0.create(J);
              var V = W === void 0 ? J.len : J.pos + W,
                F = new PA.opentelemetry.proto.metrics.v1.Exemplar;
              while (J.pos < V) {
                var K = J.uint32();
                if (K === X) break;
                switch (K >>> 3) {
                  case 7: {
                    if (!(F.filteredAttributes && F.filteredAttributes.length)) F.filteredAttributes = [];
                    F.filteredAttributes.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(J, J.uint32()));
                    break
                  }
                  case 2: {
                    F.timeUnixNano = J.fixed64();
                    break
                  }
                  case 3: {
                    F.asDouble = J.double();
                    break
                  }
                  case 6: {
                    F.asInt = J.sfixed64();
                    break
                  }
                  case 4: {
                    F.spanId = J.bytes();
                    break
                  }
                  case 5: {
                    F.traceId = J.bytes();
                    break
                  }
                  default:
                    J.skipType(K & 7);
                    break
                }
              }
              return F
            }, Z.decodeDelimited = function(J) {
              if (!(J instanceof B0)) J = new B0(J);
              return this.decode(J, J.uint32())
            }, Z.verify = function(J) {
              if (typeof J !== "object" || J === null) return "object expected";
              var W = {};
              if (J.filteredAttributes != null && J.hasOwnProperty("filteredAttributes")) {
                if (!Array.isArray(J.filteredAttributes)) return "filteredAttributes: array expected";
                for (var X = 0; X < J.filteredAttributes.length; ++X) {
                  var V = PA.opentelemetry.proto.common.v1.KeyValue.verify(J.filteredAttributes[X]);
                  if (V) return "filteredAttributes." + V
                }
              }
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano")) {
                if (!_A.isInteger(J.timeUnixNano) && !(J.timeUnixNano && _A.isInteger(J.timeUnixNano.low) && _A.isInteger(J.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (J.asDouble != null && J.hasOwnProperty("asDouble")) {
                if (W.value = 1, typeof J.asDouble !== "number") return "asDouble: number expected"
              }
              if (J.asInt != null && J.hasOwnProperty("asInt")) {
                if (W.value === 1) return "value: multiple values";
                if (W.value = 1, !_A.isInteger(J.asInt) && !(J.asInt && _A.isInteger(J.asInt.low) && _A.isInteger(J.asInt.high))) return "asInt: integer|Long expected"
              }
              if (J.spanId != null && J.hasOwnProperty("spanId")) {
                if (!(J.spanId && typeof J.spanId.length === "number" || _A.isString(J.spanId))) return "spanId: buffer expected"
              }
              if (J.traceId != null && J.hasOwnProperty("traceId")) {
                if (!(J.traceId && typeof J.traceId.length === "number" || _A.isString(J.traceId))) return "traceId: buffer expected"
              }
              return null
            }, Z.fromObject = function(J) {
              if (J instanceof PA.opentelemetry.proto.metrics.v1.Exemplar) return J;
              var W = new PA.opentelemetry.proto.metrics.v1.Exemplar;
              if (J.filteredAttributes) {
                if (!Array.isArray(J.filteredAttributes)) throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: array expected");
                W.filteredAttributes = [];
                for (var X = 0; X < J.filteredAttributes.length; ++X) {
                  if (typeof J.filteredAttributes[X] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: object expected");
                  W.filteredAttributes[X] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(J.filteredAttributes[X])
                }
              }
              if (J.timeUnixNano != null) {
                if (_A.Long)(W.timeUnixNano = _A.Long.fromValue(J.timeUnixNano)).unsigned = !1;
                else if (typeof J.timeUnixNano === "string") W.timeUnixNano = parseInt(J.timeUnixNano, 10);
                else if (typeof J.timeUnixNano === "number") W.timeUnixNano = J.timeUnixNano;
                else if (typeof J.timeUnixNano === "object") W.timeUnixNano = new _A.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber()
              }
              if (J.asDouble != null) W.asDouble = Number(J.asDouble);
              if (J.asInt != null) {
                if (_A.Long)(W.asInt = _A.Long.fromValue(J.asInt)).unsigned = !1;
                else if (typeof J.asInt === "string") W.asInt = parseInt(J.asInt, 10);
                else if (typeof J.asInt === "number") W.asInt = J.asInt;
                else if (typeof J.asInt === "object") W.asInt = new _A.LongBits(J.asInt.low >>> 0, J.asInt.high >>> 0).toNumber()
              }
              if (J.spanId != null) {
                if (typeof J.spanId === "string") _A.base64.decode(J.spanId, W.spanId = _A.newBuffer(_A.base64.length(J.spanId)), 0);
                else if (J.spanId.length >= 0) W.spanId = J.spanId
              }
              if (J.traceId != null) {
                if (typeof J.traceId === "string") _A.base64.decode(J.traceId, W.traceId = _A.newBuffer(_A.base64.length(J.traceId)), 0);
                else if (J.traceId.length >= 0) W.traceId = J.traceId
              }
              return W
            }, Z.toObject = function(J, W) {
              if (!W) W = {};
              var X = {};
              if (W.arrays || W.defaults) X.filteredAttributes = [];
              if (W.defaults) {
                if (_A.Long) {
                  var V = new _A.Long(0, 0, !1);
                  X.timeUnixNano = W.longs === String ? V.toString() : W.longs === Number ? V.toNumber() : V
                } else X.timeUnixNano = W.longs === String ? "0" : 0;
                if (W.bytes === String) X.spanId = "";
                else if (X.spanId = [], W.bytes !== Array) X.spanId = _A.newBuffer(X.spanId);
                if (W.bytes === String) X.traceId = "";
                else if (X.traceId = [], W.bytes !== Array) X.traceId = _A.newBuffer(X.traceId)
              }
              if (J.timeUnixNano != null && J.hasOwnProperty("timeUnixNano"))
                if (typeof J.timeUnixNano === "number") X.timeUnixNano = W.longs === String ? String(J.timeUnixNano) : J.timeUnixNano;
                else X.timeUnixNano = W.longs === String ? _A.Long.prototype.toString.call(J.timeUnixNano) : W.longs === Number ? new _A.LongBits(J.timeUnixNano.low >>> 0, J.timeUnixNano.high >>> 0).toNumber() : J.timeUnixNano;
              if (J.asDouble != null && J.hasOwnProperty("asDouble")) {
                if (X.asDouble = W.json && !isFinite(J.asDouble) ? String(J.asDouble) : J.asDouble, W.oneofs) X.value = "asDouble"
              }
              if (J.spanId != null && J.hasOwnProperty("spanId")) X.spanId = W.bytes === String ? _A.base64.encode(J.spanId, 0, J.spanId.length) : W.bytes === Array ? Array.prototype.slice.call(J.spanId) : J.spanId;
              if (J.traceId != null && J.hasOwnProperty("traceId")) X.traceId = W.bytes === String ? _A.base64.encode(J.traceId, 0, J.traceId.length) : W.bytes === Array ? Array.prototype.slice.call(J.traceId) : J.traceId;
              if (J.asInt != null && J.hasOwnProperty("asInt")) {
                if (typeof J.asInt === "number") X.asInt = W.longs === String ? String(J.asInt) : J.asInt;
                else X.asInt = W.longs === String ? _A.Long.prototype.toString.call(J.asInt) : W.longs === Number ? new _A.LongBits(J.asInt.low >>> 0, J.asInt.high >>> 0).toNumber() : J.asInt;
                if (W.oneofs) X.value = "asInt"
              }
              if (J.filteredAttributes && J.filteredAttributes.length) {
                X.filteredAttributes = [];
                for (var F = 0; F < J.filteredAttributes.length; ++F) X.filteredAttributes[F] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(J.filteredAttributes[F], W)
              }
              return X
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(J) {
              if (J === void 0) J = "type.googleapis.com";
              return J + "/opentelemetry.proto.metrics.v1.Exemplar"
            }, Z
          }(), G
        }(), B
      }(), Q.logs = function() {
        var B = {};
        return B.v1 = function() {
          var G = {};
          return G.LogsData = function() {
            function Z(I) {
              if (this.resourceLogs = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.resourceLogs = _A.emptyArray, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.resourceLogs != null && Y.resourceLogs.length)
                for (var W = 0; W < Y.resourceLogs.length; ++W) PA.opentelemetry.proto.logs.v1.ResourceLogs.encode(Y.resourceLogs[W], J.uint32(10).fork()).ldelim();
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.logs.v1.LogsData;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    if (!(V.resourceLogs && V.resourceLogs.length)) V.resourceLogs = [];
                    V.resourceLogs.push(PA.opentelemetry.proto.logs.v1.ResourceLogs.decode(Y, Y.uint32()));
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.resourceLogs != null && Y.hasOwnProperty("resourceLogs")) {
                if (!Array.isArray(Y.resourceLogs)) return "resourceLogs: array expected";
                for (var J = 0; J < Y.resourceLogs.length; ++J) {
                  var W = PA.opentelemetry.proto.logs.v1.ResourceLogs.verify(Y.resourceLogs[J]);
                  if (W) return "resourceLogs." + W
                }
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.logs.v1.LogsData) return Y;
              var J = new PA.opentelemetry.proto.logs.v1.LogsData;
              if (Y.resourceLogs) {
                if (!Array.isArray(Y.resourceLogs)) throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: array expected");
                J.resourceLogs = [];
                for (var W = 0; W < Y.resourceLogs.length; ++W) {
                  if (typeof Y.resourceLogs[W] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: object expected");
                  J.resourceLogs[W] = PA.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(Y.resourceLogs[W])
                }
              }
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.resourceLogs = [];
              if (Y.resourceLogs && Y.resourceLogs.length) {
                W.resourceLogs = [];
                for (var X = 0; X < Y.resourceLogs.length; ++X) W.resourceLogs[X] = PA.opentelemetry.proto.logs.v1.ResourceLogs.toObject(Y.resourceLogs[X], J)
              }
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.logs.v1.LogsData"
            }, Z
          }(), G.ResourceLogs = function() {
            function Z(I) {
              if (this.scopeLogs = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.resource = null, Z.prototype.scopeLogs = _A.emptyArray, Z.prototype.schemaUrl = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.resource != null && Object.hasOwnProperty.call(Y, "resource")) PA.opentelemetry.proto.resource.v1.Resource.encode(Y.resource, J.uint32(10).fork()).ldelim();
              if (Y.scopeLogs != null && Y.scopeLogs.length)
                for (var W = 0; W < Y.scopeLogs.length; ++W) PA.opentelemetry.proto.logs.v1.ScopeLogs.encode(Y.scopeLogs[W], J.uint32(18).fork()).ldelim();
              if (Y.schemaUrl != null && Object.hasOwnProperty.call(Y, "schemaUrl")) J.uint32(26).string(Y.schemaUrl);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.logs.v1.ResourceLogs;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    V.resource = PA.opentelemetry.proto.resource.v1.Resource.decode(Y, Y.uint32());
                    break
                  }
                  case 2: {
                    if (!(V.scopeLogs && V.scopeLogs.length)) V.scopeLogs = [];
                    V.scopeLogs.push(PA.opentelemetry.proto.logs.v1.ScopeLogs.decode(Y, Y.uint32()));
                    break
                  }
                  case 3: {
                    V.schemaUrl = Y.string();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.resource != null && Y.hasOwnProperty("resource")) {
                var J = PA.opentelemetry.proto.resource.v1.Resource.verify(Y.resource);
                if (J) return "resource." + J
              }
              if (Y.scopeLogs != null && Y.hasOwnProperty("scopeLogs")) {
                if (!Array.isArray(Y.scopeLogs)) return "scopeLogs: array expected";
                for (var W = 0; W < Y.scopeLogs.length; ++W) {
                  var J = PA.opentelemetry.proto.logs.v1.ScopeLogs.verify(Y.scopeLogs[W]);
                  if (J) return "scopeLogs." + J
                }
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) {
                if (!_A.isString(Y.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.logs.v1.ResourceLogs) return Y;
              var J = new PA.opentelemetry.proto.logs.v1.ResourceLogs;
              if (Y.resource != null) {
                if (typeof Y.resource !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.resource: object expected");
                J.resource = PA.opentelemetry.proto.resource.v1.Resource.fromObject(Y.resource)
              }
              if (Y.scopeLogs) {
                if (!Array.isArray(Y.scopeLogs)) throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: array expected");
                J.scopeLogs = [];
                for (var W = 0; W < Y.scopeLogs.length; ++W) {
                  if (typeof Y.scopeLogs[W] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: object expected");
                  J.scopeLogs[W] = PA.opentelemetry.proto.logs.v1.ScopeLogs.fromObject(Y.scopeLogs[W])
                }
              }
              if (Y.schemaUrl != null) J.schemaUrl = String(Y.schemaUrl);
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.scopeLogs = [];
              if (J.defaults) W.resource = null, W.schemaUrl = "";
              if (Y.resource != null && Y.hasOwnProperty("resource")) W.resource = PA.opentelemetry.proto.resource.v1.Resource.toObject(Y.resource, J);
              if (Y.scopeLogs && Y.scopeLogs.length) {
                W.scopeLogs = [];
                for (var X = 0; X < Y.scopeLogs.length; ++X) W.scopeLogs[X] = PA.opentelemetry.proto.logs.v1.ScopeLogs.toObject(Y.scopeLogs[X], J)
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) W.schemaUrl = Y.schemaUrl;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.logs.v1.ResourceLogs"
            }, Z
          }(), G.ScopeLogs = function() {
            function Z(I) {
              if (this.logRecords = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.scope = null, Z.prototype.logRecords = _A.emptyArray, Z.prototype.schemaUrl = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.scope != null && Object.hasOwnProperty.call(Y, "scope")) PA.opentelemetry.proto.common.v1.InstrumentationScope.encode(Y.scope, J.uint32(10).fork()).ldelim();
              if (Y.logRecords != null && Y.logRecords.length)
                for (var W = 0; W < Y.logRecords.length; ++W) PA.opentelemetry.proto.logs.v1.LogRecord.encode(Y.logRecords[W], J.uint32(18).fork()).ldelim();
              if (Y.schemaUrl != null && Object.hasOwnProperty.call(Y, "schemaUrl")) J.uint32(26).string(Y.schemaUrl);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.logs.v1.ScopeLogs;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    V.scope = PA.opentelemetry.proto.common.v1.InstrumentationScope.decode(Y, Y.uint32());
                    break
                  }
                  case 2: {
                    if (!(V.logRecords && V.logRecords.length)) V.logRecords = [];
                    V.logRecords.push(PA.opentelemetry.proto.logs.v1.LogRecord.decode(Y, Y.uint32()));
                    break
                  }
                  case 3: {
                    V.schemaUrl = Y.string();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.scope != null && Y.hasOwnProperty("scope")) {
                var J = PA.opentelemetry.proto.common.v1.InstrumentationScope.verify(Y.scope);
                if (J) return "scope." + J
              }
              if (Y.logRecords != null && Y.hasOwnProperty("logRecords")) {
                if (!Array.isArray(Y.logRecords)) return "logRecords: array expected";
                for (var W = 0; W < Y.logRecords.length; ++W) {
                  var J = PA.opentelemetry.proto.logs.v1.LogRecord.verify(Y.logRecords[W]);
                  if (J) return "logRecords." + J
                }
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) {
                if (!_A.isString(Y.schemaUrl)) return "schemaUrl: string expected"
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.logs.v1.ScopeLogs) return Y;
              var J = new PA.opentelemetry.proto.logs.v1.ScopeLogs;
              if (Y.scope != null) {
                if (typeof Y.scope !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.scope: object expected");
                J.scope = PA.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(Y.scope)
              }
              if (Y.logRecords) {
                if (!Array.isArray(Y.logRecords)) throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: array expected");
                J.logRecords = [];
                for (var W = 0; W < Y.logRecords.length; ++W) {
                  if (typeof Y.logRecords[W] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: object expected");
                  J.logRecords[W] = PA.opentelemetry.proto.logs.v1.LogRecord.fromObject(Y.logRecords[W])
                }
              }
              if (Y.schemaUrl != null) J.schemaUrl = String(Y.schemaUrl);
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.logRecords = [];
              if (J.defaults) W.scope = null, W.schemaUrl = "";
              if (Y.scope != null && Y.hasOwnProperty("scope")) W.scope = PA.opentelemetry.proto.common.v1.InstrumentationScope.toObject(Y.scope, J);
              if (Y.logRecords && Y.logRecords.length) {
                W.logRecords = [];
                for (var X = 0; X < Y.logRecords.length; ++X) W.logRecords[X] = PA.opentelemetry.proto.logs.v1.LogRecord.toObject(Y.logRecords[X], J)
              }
              if (Y.schemaUrl != null && Y.hasOwnProperty("schemaUrl")) W.schemaUrl = Y.schemaUrl;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.logs.v1.ScopeLogs"
            }, Z
          }(), G.SeverityNumber = function() {
            var Z = {},
              I = Object.create(Z);
            return I[Z[0] = "SEVERITY_NUMBER_UNSPECIFIED"] = 0, I[Z[1] = "SEVERITY_NUMBER_TRACE"] = 1, I[Z[2] = "SEVERITY_NUMBER_TRACE2"] = 2, I[Z[3] = "SEVERITY_NUMBER_TRACE3"] = 3, I[Z[4] = "SEVERITY_NUMBER_TRACE4"] = 4, I[Z[5] = "SEVERITY_NUMBER_DEBUG"] = 5, I[Z[6] = "SEVERITY_NUMBER_DEBUG2"] = 6, I[Z[7] = "SEVERITY_NUMBER_DEBUG3"] = 7, I[Z[8] = "SEVERITY_NUMBER_DEBUG4"] = 8, I[Z[9] = "SEVERITY_NUMBER_INFO"] = 9, I[Z[10] = "SEVERITY_NUMBER_INFO2"] = 10, I[Z[11] = "SEVERITY_NUMBER_INFO3"] = 11, I[Z[12] = "SEVERITY_NUMBER_INFO4"] = 12, I[Z[13] = "SEVERITY_NUMBER_WARN"] = 13, I[Z[14] = "SEVERITY_NUMBER_WARN2"] = 14, I[Z[15] = "SEVERITY_NUMBER_WARN3"] = 15, I[Z[16] = "SEVERITY_NUMBER_WARN4"] = 16, I[Z[17] = "SEVERITY_NUMBER_ERROR"] = 17, I[Z[18] = "SEVERITY_NUMBER_ERROR2"] = 18, I[Z[19] = "SEVERITY_NUMBER_ERROR3"] = 19, I[Z[20] = "SEVERITY_NUMBER_ERROR4"] = 20, I[Z[21] = "SEVERITY_NUMBER_FATAL"] = 21, I[Z[22] = "SEVERITY_NUMBER_FATAL2"] = 22, I[Z[23] = "SEVERITY_NUMBER_FATAL3"] = 23, I[Z[24] = "SEVERITY_NUMBER_FATAL4"] = 24, I
          }(), G.LogRecordFlags = function() {
            var Z = {},
              I = Object.create(Z);
            return I[Z[0] = "LOG_RECORD_FLAGS_DO_NOT_USE"] = 0, I[Z[255] = "LOG_RECORD_FLAGS_TRACE_FLAGS_MASK"] = 255, I
          }(), G.LogRecord = function() {
            function Z(I) {
              if (this.attributes = [], I) {
                for (var Y = Object.keys(I), J = 0; J < Y.length; ++J)
                  if (I[Y[J]] != null) this[Y[J]] = I[Y[J]]
              }
            }
            return Z.prototype.timeUnixNano = null, Z.prototype.observedTimeUnixNano = null, Z.prototype.severityNumber = null, Z.prototype.severityText = null, Z.prototype.body = null, Z.prototype.attributes = _A.emptyArray, Z.prototype.droppedAttributesCount = null, Z.prototype.flags = null, Z.prototype.traceId = null, Z.prototype.spanId = null, Z.prototype.eventName = null, Z.create = function(Y) {
              return new Z(Y)
            }, Z.encode = function(Y, J) {
              if (!J) J = M8.create();
              if (Y.timeUnixNano != null && Object.hasOwnProperty.call(Y, "timeUnixNano")) J.uint32(9).fixed64(Y.timeUnixNano);
              if (Y.severityNumber != null && Object.hasOwnProperty.call(Y, "severityNumber")) J.uint32(16).int32(Y.severityNumber);
              if (Y.severityText != null && Object.hasOwnProperty.call(Y, "severityText")) J.uint32(26).string(Y.severityText);
              if (Y.body != null && Object.hasOwnProperty.call(Y, "body")) PA.opentelemetry.proto.common.v1.AnyValue.encode(Y.body, J.uint32(42).fork()).ldelim();
              if (Y.attributes != null && Y.attributes.length)
                for (var W = 0; W < Y.attributes.length; ++W) PA.opentelemetry.proto.common.v1.KeyValue.encode(Y.attributes[W], J.uint32(50).fork()).ldelim();
              if (Y.droppedAttributesCount != null && Object.hasOwnProperty.call(Y, "droppedAttributesCount")) J.uint32(56).uint32(Y.droppedAttributesCount);
              if (Y.flags != null && Object.hasOwnProperty.call(Y, "flags")) J.uint32(69).fixed32(Y.flags);
              if (Y.traceId != null && Object.hasOwnProperty.call(Y, "traceId")) J.uint32(74).bytes(Y.traceId);
              if (Y.spanId != null && Object.hasOwnProperty.call(Y, "spanId")) J.uint32(82).bytes(Y.spanId);
              if (Y.observedTimeUnixNano != null && Object.hasOwnProperty.call(Y, "observedTimeUnixNano")) J.uint32(89).fixed64(Y.observedTimeUnixNano);
              if (Y.eventName != null && Object.hasOwnProperty.call(Y, "eventName")) J.uint32(98).string(Y.eventName);
              return J
            }, Z.encodeDelimited = function(Y, J) {
              return this.encode(Y, J).ldelim()
            }, Z.decode = function(Y, J, W) {
              if (!(Y instanceof B0)) Y = B0.create(Y);
              var X = J === void 0 ? Y.len : Y.pos + J,
                V = new PA.opentelemetry.proto.logs.v1.LogRecord;
              while (Y.pos < X) {
                var F = Y.uint32();
                if (F === W) break;
                switch (F >>> 3) {
                  case 1: {
                    V.timeUnixNano = Y.fixed64();
                    break
                  }
                  case 11: {
                    V.observedTimeUnixNano = Y.fixed64();
                    break
                  }
                  case 2: {
                    V.severityNumber = Y.int32();
                    break
                  }
                  case 3: {
                    V.severityText = Y.string();
                    break
                  }
                  case 5: {
                    V.body = PA.opentelemetry.proto.common.v1.AnyValue.decode(Y, Y.uint32());
                    break
                  }
                  case 6: {
                    if (!(V.attributes && V.attributes.length)) V.attributes = [];
                    V.attributes.push(PA.opentelemetry.proto.common.v1.KeyValue.decode(Y, Y.uint32()));
                    break
                  }
                  case 7: {
                    V.droppedAttributesCount = Y.uint32();
                    break
                  }
                  case 8: {
                    V.flags = Y.fixed32();
                    break
                  }
                  case 9: {
                    V.traceId = Y.bytes();
                    break
                  }
                  case 10: {
                    V.spanId = Y.bytes();
                    break
                  }
                  case 12: {
                    V.eventName = Y.string();
                    break
                  }
                  default:
                    Y.skipType(F & 7);
                    break
                }
              }
              return V
            }, Z.decodeDelimited = function(Y) {
              if (!(Y instanceof B0)) Y = new B0(Y);
              return this.decode(Y, Y.uint32())
            }, Z.verify = function(Y) {
              if (typeof Y !== "object" || Y === null) return "object expected";
              if (Y.timeUnixNano != null && Y.hasOwnProperty("timeUnixNano")) {
                if (!_A.isInteger(Y.timeUnixNano) && !(Y.timeUnixNano && _A.isInteger(Y.timeUnixNano.low) && _A.isInteger(Y.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
              }
              if (Y.observedTimeUnixNano != null && Y.hasOwnProperty("observedTimeUnixNano")) {
                if (!_A.isInteger(Y.observedTimeUnixNano) && !(Y.observedTimeUnixNano && _A.isInteger(Y.observedTimeUnixNano.low) && _A.isInteger(Y.observedTimeUnixNano.high))) return "observedTimeUnixNano: integer|Long expected"
              }
              if (Y.severityNumber != null && Y.hasOwnProperty("severityNumber")) switch (Y.severityNumber) {
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
              if (Y.severityText != null && Y.hasOwnProperty("severityText")) {
                if (!_A.isString(Y.severityText)) return "severityText: string expected"
              }
              if (Y.body != null && Y.hasOwnProperty("body")) {
                var J = PA.opentelemetry.proto.common.v1.AnyValue.verify(Y.body);
                if (J) return "body." + J
              }
              if (Y.attributes != null && Y.hasOwnProperty("attributes")) {
                if (!Array.isArray(Y.attributes)) return "attributes: array expected";
                for (var W = 0; W < Y.attributes.length; ++W) {
                  var J = PA.opentelemetry.proto.common.v1.KeyValue.verify(Y.attributes[W]);
                  if (J) return "attributes." + J
                }
              }
              if (Y.droppedAttributesCount != null && Y.hasOwnProperty("droppedAttributesCount")) {
                if (!_A.isInteger(Y.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
              }
              if (Y.flags != null && Y.hasOwnProperty("flags")) {
                if (!_A.isInteger(Y.flags)) return "flags: integer expected"
              }
              if (Y.traceId != null && Y.hasOwnProperty("traceId")) {
                if (!(Y.traceId && typeof Y.traceId.length === "number" || _A.isString(Y.traceId))) return "traceId: buffer expected"
              }
              if (Y.spanId != null && Y.hasOwnProperty("spanId")) {
                if (!(Y.spanId && typeof Y.spanId.length === "number" || _A.isString(Y.spanId))) return "spanId: buffer expected"
              }
              if (Y.eventName != null && Y.hasOwnProperty("eventName")) {
                if (!_A.isString(Y.eventName)) return "eventName: string expected"
              }
              return null
            }, Z.fromObject = function(Y) {
              if (Y instanceof PA.opentelemetry.proto.logs.v1.LogRecord) return Y;
              var J = new PA.opentelemetry.proto.logs.v1.LogRecord;
              if (Y.timeUnixNano != null) {
                if (_A.Long)(J.timeUnixNano = _A.Long.fromValue(Y.timeUnixNano)).unsigned = !1;
                else if (typeof Y.timeUnixNano === "string") J.timeUnixNano = parseInt(Y.timeUnixNano, 10);
                else if (typeof Y.timeUnixNano === "number") J.timeUnixNano = Y.timeUnixNano;
                else if (typeof Y.timeUnixNano === "object") J.timeUnixNano = new _A.LongBits(Y.timeUnixNano.low >>> 0, Y.timeUnixNano.high >>> 0).toNumber()
              }
              if (Y.observedTimeUnixNano != null) {
                if (_A.Long)(J.observedTimeUnixNano = _A.Long.fromValue(Y.observedTimeUnixNano)).unsigned = !1;
                else if (typeof Y.observedTimeUnixNano === "string") J.observedTimeUnixNano = parseInt(Y.observedTimeUnixNano, 10);
                else if (typeof Y.observedTimeUnixNano === "number") J.observedTimeUnixNano = Y.observedTimeUnixNano;
                else if (typeof Y.observedTimeUnixNano === "object") J.observedTimeUnixNano = new _A.LongBits(Y.observedTimeUnixNano.low >>> 0, Y.observedTimeUnixNano.high >>> 0).toNumber()
              }
              switch (Y.severityNumber) {
                default:
                  if (typeof Y.severityNumber === "number") {
                    J.severityNumber = Y.severityNumber;
                    break
                  }
                  break;
                case "SEVERITY_NUMBER_UNSPECIFIED":
                case 0:
                  J.severityNumber = 0;
                  break;
                case "SEVERITY_NUMBER_TRACE":
                case 1:
                  J.severityNumber = 1;
                  break;
                case "SEVERITY_NUMBER_TRACE2":
                case 2:
                  J.severityNumber = 2;
                  break;
                case "SEVERITY_NUMBER_TRACE3":
                case 3:
                  J.severityNumber = 3;
                  break;
                case "SEVERITY_NUMBER_TRACE4":
                case 4:
                  J.severityNumber = 4;
                  break;
                case "SEVERITY_NUMBER_DEBUG":
                case 5:
                  J.severityNumber = 5;
                  break;
                case "SEVERITY_NUMBER_DEBUG2":
                case 6:
                  J.severityNumber = 6;
                  break;
                case "SEVERITY_NUMBER_DEBUG3":
                case 7:
                  J.severityNumber = 7;
                  break;
                case "SEVERITY_NUMBER_DEBUG4":
                case 8:
                  J.severityNumber = 8;
                  break;
                case "SEVERITY_NUMBER_INFO":
                case 9:
                  J.severityNumber = 9;
                  break;
                case "SEVERITY_NUMBER_INFO2":
                case 10:
                  J.severityNumber = 10;
                  break;
                case "SEVERITY_NUMBER_INFO3":
                case 11:
                  J.severityNumber = 11;
                  break;
                case "SEVERITY_NUMBER_INFO4":
                case 12:
                  J.severityNumber = 12;
                  break;
                case "SEVERITY_NUMBER_WARN":
                case 13:
                  J.severityNumber = 13;
                  break;
                case "SEVERITY_NUMBER_WARN2":
                case 14:
                  J.severityNumber = 14;
                  break;
                case "SEVERITY_NUMBER_WARN3":
                case 15:
                  J.severityNumber = 15;
                  break;
                case "SEVERITY_NUMBER_WARN4":
                case 16:
                  J.severityNumber = 16;
                  break;
                case "SEVERITY_NUMBER_ERROR":
                case 17:
                  J.severityNumber = 17;
                  break;
                case "SEVERITY_NUMBER_ERROR2":
                case 18:
                  J.severityNumber = 18;
                  break;
                case "SEVERITY_NUMBER_ERROR3":
                case 19:
                  J.severityNumber = 19;
                  break;
                case "SEVERITY_NUMBER_ERROR4":
                case 20:
                  J.severityNumber = 20;
                  break;
                case "SEVERITY_NUMBER_FATAL":
                case 21:
                  J.severityNumber = 21;
                  break;
                case "SEVERITY_NUMBER_FATAL2":
                case 22:
                  J.severityNumber = 22;
                  break;
                case "SEVERITY_NUMBER_FATAL3":
                case 23:
                  J.severityNumber = 23;
                  break;
                case "SEVERITY_NUMBER_FATAL4":
                case 24:
                  J.severityNumber = 24;
                  break
              }
              if (Y.severityText != null) J.severityText = String(Y.severityText);
              if (Y.body != null) {
                if (typeof Y.body !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.body: object expected");
                J.body = PA.opentelemetry.proto.common.v1.AnyValue.fromObject(Y.body)
              }
              if (Y.attributes) {
                if (!Array.isArray(Y.attributes)) throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: array expected");
                J.attributes = [];
                for (var W = 0; W < Y.attributes.length; ++W) {
                  if (typeof Y.attributes[W] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: object expected");
                  J.attributes[W] = PA.opentelemetry.proto.common.v1.KeyValue.fromObject(Y.attributes[W])
                }
              }
              if (Y.droppedAttributesCount != null) J.droppedAttributesCount = Y.droppedAttributesCount >>> 0;
              if (Y.flags != null) J.flags = Y.flags >>> 0;
              if (Y.traceId != null) {
                if (typeof Y.traceId === "string") _A.base64.decode(Y.traceId, J.traceId = _A.newBuffer(_A.base64.length(Y.traceId)), 0);
                else if (Y.traceId.length >= 0) J.traceId = Y.traceId
              }
              if (Y.spanId != null) {
                if (typeof Y.spanId === "string") _A.base64.decode(Y.spanId, J.spanId = _A.newBuffer(_A.base64.length(Y.spanId)), 0);
                else if (Y.spanId.length >= 0) J.spanId = Y.spanId
              }
              if (Y.eventName != null) J.eventName = String(Y.eventName);
              return J
            }, Z.toObject = function(Y, J) {
              if (!J) J = {};
              var W = {};
              if (J.arrays || J.defaults) W.attributes = [];
              if (J.defaults) {
                if (_A.Long) {
                  var X = new _A.Long(0, 0, !1);
                  W.timeUnixNano = J.longs === String ? X.toString() : J.longs === Number ? X.toNumber() : X
                } else W.timeUnixNano = J.longs === String ? "0" : 0;
                if (W.severityNumber = J.enums === String ? "SEVERITY_NUMBER_UNSPECIFIED" : 0, W.severityText = "", W.body = null, W.droppedAttributesCount = 0, W.flags = 0, J.bytes === String) W.traceId = "";
                else if (W.traceId = [], J.bytes !== Array) W.traceId = _A.newBuffer(W.traceId);
                if (J.bytes === String) W.spanId = "";
                else if (W.spanId = [], J.bytes !== Array) W.spanId = _A.newBuffer(W.spanId);
                if (_A.Long) {
                  var X = new _A.Long(0, 0, !1);
                  W.observedTimeUnixNano = J.longs === String ? X.toString() : J.longs === Number ? X.toNumber() : X
                } else W.observedTimeUnixNano = J.longs === String ? "0" : 0;
                W.eventName = ""
              }
              if (Y.timeUnixNano != null && Y.hasOwnProperty("timeUnixNano"))
                if (typeof Y.timeUnixNano === "number") W.timeUnixNano = J.longs === String ? String(Y.timeUnixNano) : Y.timeUnixNano;
                else W.timeUnixNano = J.longs === String ? _A.Long.prototype.toString.call(Y.timeUnixNano) : J.longs === Number ? new _A.LongBits(Y.timeUnixNano.low >>> 0, Y.timeUnixNano.high >>> 0).toNumber() : Y.timeUnixNano;
              if (Y.severityNumber != null && Y.hasOwnProperty("severityNumber")) W.severityNumber = J.enums === String ? PA.opentelemetry.proto.logs.v1.SeverityNumber[Y.severityNumber] === void 0 ? Y.severityNumber : PA.opentelemetry.proto.logs.v1.SeverityNumber[Y.severityNumber] : Y.severityNumber;
              if (Y.severityText != null && Y.hasOwnProperty("severityText")) W.severityText = Y.severityText;
              if (Y.body != null && Y.hasOwnProperty("body")) W.body = PA.opentelemetry.proto.common.v1.AnyValue.toObject(Y.body, J);
              if (Y.attributes && Y.attributes.length) {
                W.attributes = [];
                for (var V = 0; V < Y.attributes.length; ++V) W.attributes[V] = PA.opentelemetry.proto.common.v1.KeyValue.toObject(Y.attributes[V], J)
              }
              if (Y.droppedAttributesCount != null && Y.hasOwnProperty("droppedAttributesCount")) W.droppedAttributesCount = Y.droppedAttributesCount;
              if (Y.flags != null && Y.hasOwnProperty("flags")) W.flags = Y.flags;
              if (Y.traceId != null && Y.hasOwnProperty("traceId")) W.traceId = J.bytes === String ? _A.base64.encode(Y.traceId, 0, Y.traceId.length) : J.bytes === Array ? Array.prototype.slice.call(Y.traceId) : Y.traceId;
              if (Y.spanId != null && Y.hasOwnProperty("spanId")) W.spanId = J.bytes === String ? _A.base64.encode(Y.spanId, 0, Y.spanId.length) : J.bytes === Array ? Array.prototype.slice.call(Y.spanId) : Y.spanId;
              if (Y.observedTimeUnixNano != null && Y.hasOwnProperty("observedTimeUnixNano"))
                if (typeof Y.observedTimeUnixNano === "number") W.observedTimeUnixNano = J.longs === String ? String(Y.observedTimeUnixNano) : Y.observedTimeUnixNano;
                else W.observedTimeUnixNano = J.longs === String ? _A.Long.prototype.toString.call(Y.observedTimeUnixNano) : J.longs === Number ? new _A.LongBits(Y.observedTimeUnixNano.low >>> 0, Y.observedTimeUnixNano.high >>> 0).toNumber() : Y.observedTimeUnixNano;
              if (Y.eventName != null && Y.hasOwnProperty("eventName")) W.eventName = Y.eventName;
              return W
            }, Z.prototype.toJSON = function() {
              return this.constructor.toObject(this, _9.util.toJSONOptions)
            }, Z.getTypeUrl = function(Y) {
              if (Y === void 0) Y = "type.googleapis.com";
              return Y + "/opentelemetry.proto.logs.v1.LogRecord"
            }, Z
          }(), G
        }(), B
      }(), Q
    }(), A
  }();
  bF2.exports = PA
})