
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
// @from(Start 10515118, End 10515629)
uF2 = z((hF2) => {
  Object.defineProperty(hF2, "__esModule", {
    value: !0
  });
  hF2.hexToBinary = void 0;

  function fF2(A) {
    if (A >= 48 && A <= 57) return A - 48;
    if (A >= 97 && A <= 102) return A - 87;
    return A - 55
  }

  function mU5(A) {
    let Q = new Uint8Array(A.length / 2),
      B = 0;
    for (let G = 0; G < A.length; G += 2) {
      let Z = fF2(A.charCodeAt(G)),
        I = fF2(A.charCodeAt(G + 1));
      Q[B++] = Z << 4 | I
    }
    return Q
  }
  hF2.hexToBinary = mU5
})
// @from(Start 10515635, End 10516965)
E41 = z((lF2) => {
  Object.defineProperty(lF2, "__esModule", {
    value: !0
  });
  lF2.getOtlpEncoder = lF2.encodeAsString = lF2.encodeAsLongBits = lF2.toLongBits = lF2.hrTimeToNanos = void 0;
  var dU5 = e6(),
    RB0 = uF2();

  function TB0(A) {
    let Q = BigInt(1e9);
    return BigInt(A[0]) * Q + BigInt(A[1])
  }
  lF2.hrTimeToNanos = TB0;

  function dF2(A) {
    let Q = Number(BigInt.asUintN(32, A)),
      B = Number(BigInt.asUintN(32, A >> BigInt(32)));
    return {
      low: Q,
      high: B
    }
  }
  lF2.toLongBits = dF2;

  function PB0(A) {
    let Q = TB0(A);
    return dF2(Q)
  }
  lF2.encodeAsLongBits = PB0;

  function cF2(A) {
    return TB0(A).toString()
  }
  lF2.encodeAsString = cF2;
  var cU5 = typeof BigInt < "u" ? cF2 : dU5.hrTimeToNanoseconds;

  function mF2(A) {
    return A
  }

  function pF2(A) {
    if (A === void 0) return;
    return (0, RB0.hexToBinary)(A)
  }
  var pU5 = {
    encodeHrTime: PB0,
    encodeSpanContext: RB0.hexToBinary,
    encodeOptionalSpanContext: pF2
  };

  function lU5(A) {
    if (A === void 0) return pU5;
    let Q = A.useLongBits ?? !0,
      B = A.useHex ?? !1;
    return {
      encodeHrTime: Q ? PB0 : cU5,
      encodeSpanContext: B ? mF2 : RB0.hexToBinary,
      encodeOptionalSpanContext: B ? mF2 : pF2
    }
  }
  lF2.getOtlpEncoder = lU5
})
// @from(Start 10516971, End 10518397)
z41 = z((aF2) => {
  Object.defineProperty(aF2, "__esModule", {
    value: !0
  });
  aF2.toAnyValue = aF2.toKeyValue = aF2.toAttributes = aF2.createInstrumentationScope = aF2.createResource = void 0;

  function rU5(A) {
    let Q = {
        attributes: nF2(A.attributes),
        droppedAttributesCount: 0
      },
      B = A.schemaUrl;
    if (B && B !== "") Q.schemaUrl = B;
    return Q
  }
  aF2.createResource = rU5;

  function oU5(A) {
    return {
      name: A.name,
      version: A.version
    }
  }
  aF2.createInstrumentationScope = oU5;

  function nF2(A) {
    return Object.keys(A).map((Q) => jB0(Q, A[Q]))
  }
  aF2.toAttributes = nF2;

  function jB0(A, Q) {
    return {
      key: A,
      value: SB0(Q)
    }
  }
  aF2.toKeyValue = jB0;

  function SB0(A) {
    let Q = typeof A;
    if (Q === "string") return {
      stringValue: A
    };
    if (Q === "number") {
      if (!Number.isInteger(A)) return {
        doubleValue: A
      };
      return {
        intValue: A
      }
    }
    if (Q === "boolean") return {
      boolValue: A
    };
    if (A instanceof Uint8Array) return {
      bytesValue: A
    };
    if (Array.isArray(A)) return {
      arrayValue: {
        values: A.map(SB0)
      }
    };
    if (Q === "object" && A != null) return {
      kvlistValue: {
        values: Object.entries(A).map(([B, G]) => jB0(B, G))
      }
    };
    return {}
  }
  aF2.toAnyValue = SB0
})
// @from(Start 10518403, End 10520386)
_B0 = z((oF2) => {
  Object.defineProperty(oF2, "__esModule", {
    value: !0
  });
  oF2.toLogAttributes = oF2.createExportLogsServiceRequest = void 0;
  var B$5 = E41(),
    U41 = z41();

  function G$5(A, Q) {
    let B = (0, B$5.getOtlpEncoder)(Q);
    return {
      resourceLogs: I$5(A, B)
    }
  }
  oF2.createExportLogsServiceRequest = G$5;

  function Z$5(A) {
    let Q = new Map;
    for (let B of A) {
      let {
        resource: G,
        instrumentationScope: {
          name: Z,
          version: I = "",
          schemaUrl: Y = ""
        }
      } = B, J = Q.get(G);
      if (!J) J = new Map, Q.set(G, J);
      let W = `${Z}@${I}:${Y}`,
        X = J.get(W);
      if (!X) X = [], J.set(W, X);
      X.push(B)
    }
    return Q
  }

  function I$5(A, Q) {
    let B = Z$5(A);
    return Array.from(B, ([G, Z]) => {
      let I = (0, U41.createResource)(G);
      return {
        resource: I,
        scopeLogs: Array.from(Z, ([, Y]) => {
          return {
            scope: (0, U41.createInstrumentationScope)(Y[0].instrumentationScope),
            logRecords: Y.map((J) => Y$5(J, Q)),
            schemaUrl: Y[0].instrumentationScope.schemaUrl
          }
        }),
        schemaUrl: I.schemaUrl
      }
    })
  }

  function Y$5(A, Q) {
    return {
      timeUnixNano: Q.encodeHrTime(A.hrTime),
      observedTimeUnixNano: Q.encodeHrTime(A.hrTimeObserved),
      severityNumber: J$5(A.severityNumber),
      severityText: A.severityText,
      body: (0, U41.toAnyValue)(A.body),
      eventName: A.eventName,
      attributes: rF2(A.attributes),
      droppedAttributesCount: A.droppedAttributesCount,
      flags: A.spanContext?.traceFlags,
      traceId: Q.encodeOptionalSpanContext(A.spanContext?.traceId),
      spanId: Q.encodeOptionalSpanContext(A.spanContext?.spanId)
    }
  }

  function J$5(A) {
    return A
  }

  function rF2(A) {
    return Object.keys(A).map((Q) => (0, U41.toKeyValue)(Q, A[Q]))
  }
  oF2.toLogAttributes = rF2
})
// @from(Start 10520392, End 10520946)
BK2 = z((AK2) => {
  Object.defineProperty(AK2, "__esModule", {
    value: !0
  });
  AK2.ProtobufLogsSerializer = void 0;
  var eF2 = C41(),
    X$5 = _B0(),
    V$5 = eF2.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse,
    F$5 = eF2.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
  AK2.ProtobufLogsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, X$5.createExportLogsServiceRequest)(A);
      return F$5.encode(Q).finish()
    },
    deserializeResponse: (A) => {
      return V$5.decode(A)
    }
  }
})
// @from(Start 10520952, End 10521246)
GK2 = z((kB0) => {
  Object.defineProperty(kB0, "__esModule", {
    value: !0
  });
  kB0.ProtobufLogsSerializer = void 0;
  var K$5 = BK2();
  Object.defineProperty(kB0, "ProtobufLogsSerializer", {
    enumerable: !0,
    get: function() {
      return K$5.ProtobufLogsSerializer
    }
  })
})
// @from(Start 10521252, End 10521731)
IK2 = z((ZK2) => {
  Object.defineProperty(ZK2, "__esModule", {
    value: !0
  });
  ZK2.EAggregationTemporality = void 0;
  var H$5;
  (function(A) {
    A[A.AGGREGATION_TEMPORALITY_UNSPECIFIED = 0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED", A[A.AGGREGATION_TEMPORALITY_DELTA = 1] = "AGGREGATION_TEMPORALITY_DELTA", A[A.AGGREGATION_TEMPORALITY_CUMULATIVE = 2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"
  })(H$5 = ZK2.EAggregationTemporality || (ZK2.EAggregationTemporality = {}))
})
// @from(Start 10521737, End 10525481)
xB0 = z((KK2) => {
  Object.defineProperty(KK2, "__esModule", {
    value: !0
  });
  KK2.createExportMetricsServiceRequest = KK2.toMetric = KK2.toScopeMetrics = KK2.toResourceMetrics = void 0;
  var YK2 = K9(),
    aYA = vi(),
    JK2 = IK2(),
    C$5 = E41(),
    FOA = z41();

  function XK2(A, Q) {
    let B = (0, C$5.getOtlpEncoder)(Q),
      G = (0, FOA.createResource)(A.resource);
    return {
      resource: G,
      schemaUrl: G.schemaUrl,
      scopeMetrics: VK2(A.scopeMetrics, B)
    }
  }
  KK2.toResourceMetrics = XK2;

  function VK2(A, Q) {
    return Array.from(A.map((B) => ({
      scope: (0, FOA.createInstrumentationScope)(B.scope),
      metrics: B.metrics.map((G) => FK2(G, Q)),
      schemaUrl: B.scope.schemaUrl
    })))
  }
  KK2.toScopeMetrics = VK2;

  function FK2(A, Q) {
    let B = {
        name: A.descriptor.name,
        description: A.descriptor.description,
        unit: A.descriptor.unit
      },
      G = $$5(A.aggregationTemporality);
    switch (A.dataPointType) {
      case aYA.DataPointType.SUM:
        B.sum = {
          aggregationTemporality: G,
          isMonotonic: A.isMonotonic,
          dataPoints: WK2(A, Q)
        };
        break;
      case aYA.DataPointType.GAUGE:
        B.gauge = {
          dataPoints: WK2(A, Q)
        };
        break;
      case aYA.DataPointType.HISTOGRAM:
        B.histogram = {
          aggregationTemporality: G,
          dataPoints: z$5(A, Q)
        };
        break;
      case aYA.DataPointType.EXPONENTIAL_HISTOGRAM:
        B.exponentialHistogram = {
          aggregationTemporality: G,
          dataPoints: U$5(A, Q)
        };
        break
    }
    return B
  }
  KK2.toMetric = FK2;

  function E$5(A, Q, B) {
    let G = {
      attributes: (0, FOA.toAttributes)(A.attributes),
      startTimeUnixNano: B.encodeHrTime(A.startTime),
      timeUnixNano: B.encodeHrTime(A.endTime)
    };
    switch (Q) {
      case YK2.ValueType.INT:
        G.asInt = A.value;
        break;
      case YK2.ValueType.DOUBLE:
        G.asDouble = A.value;
        break
    }
    return G
  }

  function WK2(A, Q) {
    return A.dataPoints.map((B) => {
      return E$5(B, A.descriptor.valueType, Q)
    })
  }

  function z$5(A, Q) {
    return A.dataPoints.map((B) => {
      let G = B.value;
      return {
        attributes: (0, FOA.toAttributes)(B.attributes),
        bucketCounts: G.buckets.counts,
        explicitBounds: G.buckets.boundaries,
        count: G.count,
        sum: G.sum,
        min: G.min,
        max: G.max,
        startTimeUnixNano: Q.encodeHrTime(B.startTime),
        timeUnixNano: Q.encodeHrTime(B.endTime)
      }
    })
  }

  function U$5(A, Q) {
    return A.dataPoints.map((B) => {
      let G = B.value;
      return {
        attributes: (0, FOA.toAttributes)(B.attributes),
        count: G.count,
        min: G.min,
        max: G.max,
        sum: G.sum,
        positive: {
          offset: G.positive.offset,
          bucketCounts: G.positive.bucketCounts
        },
        negative: {
          offset: G.negative.offset,
          bucketCounts: G.negative.bucketCounts
        },
        scale: G.scale,
        zeroCount: G.zeroCount,
        startTimeUnixNano: Q.encodeHrTime(B.startTime),
        timeUnixNano: Q.encodeHrTime(B.endTime)
      }
    })
  }

  function $$5(A) {
    switch (A) {
      case aYA.AggregationTemporality.DELTA:
        return JK2.EAggregationTemporality.AGGREGATION_TEMPORALITY_DELTA;
      case aYA.AggregationTemporality.CUMULATIVE:
        return JK2.EAggregationTemporality.AGGREGATION_TEMPORALITY_CUMULATIVE
    }
  }

  function w$5(A, Q) {
    return {
      resourceMetrics: A.map((B) => XK2(B, Q))
    }
  }
  KK2.createExportMetricsServiceRequest = w$5
})
// @from(Start 10525487, End 10526064)
zK2 = z((CK2) => {
  Object.defineProperty(CK2, "__esModule", {
    value: !0
  });
  CK2.ProtobufMetricsSerializer = void 0;
  var HK2 = C41(),
    M$5 = xB0(),
    O$5 = HK2.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse,
    R$5 = HK2.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
  CK2.ProtobufMetricsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, M$5.createExportMetricsServiceRequest)([A]);
      return R$5.encode(Q).finish()
    },
    deserializeResponse: (A) => {
      return O$5.decode(A)
    }
  }
})
// @from(Start 10526070, End 10526373)
UK2 = z((vB0) => {
  Object.defineProperty(vB0, "__esModule", {
    value: !0
  });
  vB0.ProtobufMetricsSerializer = void 0;
  var T$5 = zK2();
  Object.defineProperty(vB0, "ProtobufMetricsSerializer", {
    enumerable: !0,
    get: function() {
      return T$5.ProtobufMetricsSerializer
    }
  })
})
// @from(Start 10526379, End 10529454)
bB0 = z((NK2) => {
  Object.defineProperty(NK2, "__esModule", {
    value: !0
  });
  NK2.createExportTraceServiceRequest = NK2.toOtlpSpanEvent = NK2.toOtlpLink = NK2.sdkSpanToOtlpSpan = void 0;
  var KOA = z41(),
    j$5 = E41();

  function $K2(A, Q) {
    let B = A.spanContext(),
      G = A.status,
      Z = A.parentSpanContext?.spanId ? Q.encodeSpanContext(A.parentSpanContext?.spanId) : void 0;
    return {
      traceId: Q.encodeSpanContext(B.traceId),
      spanId: Q.encodeSpanContext(B.spanId),
      parentSpanId: Z,
      traceState: B.traceState?.serialize(),
      name: A.name,
      kind: A.kind == null ? 0 : A.kind + 1,
      startTimeUnixNano: Q.encodeHrTime(A.startTime),
      endTimeUnixNano: Q.encodeHrTime(A.endTime),
      attributes: (0, KOA.toAttributes)(A.attributes),
      droppedAttributesCount: A.droppedAttributesCount,
      events: A.events.map((I) => qK2(I, Q)),
      droppedEventsCount: A.droppedEventsCount,
      status: {
        code: G.code,
        message: G.message
      },
      links: A.links.map((I) => wK2(I, Q)),
      droppedLinksCount: A.droppedLinksCount
    }
  }
  NK2.sdkSpanToOtlpSpan = $K2;

  function wK2(A, Q) {
    return {
      attributes: A.attributes ? (0, KOA.toAttributes)(A.attributes) : [],
      spanId: Q.encodeSpanContext(A.context.spanId),
      traceId: Q.encodeSpanContext(A.context.traceId),
      traceState: A.context.traceState?.serialize(),
      droppedAttributesCount: A.droppedAttributesCount || 0
    }
  }
  NK2.toOtlpLink = wK2;

  function qK2(A, Q) {
    return {
      attributes: A.attributes ? (0, KOA.toAttributes)(A.attributes) : [],
      name: A.name,
      timeUnixNano: Q.encodeHrTime(A.time),
      droppedAttributesCount: A.droppedAttributesCount || 0
    }
  }
  NK2.toOtlpSpanEvent = qK2;

  function S$5(A, Q) {
    let B = (0, j$5.getOtlpEncoder)(Q);
    return {
      resourceSpans: k$5(A, B)
    }
  }
  NK2.createExportTraceServiceRequest = S$5;

  function _$5(A) {
    let Q = new Map;
    for (let B of A) {
      let G = Q.get(B.resource);
      if (!G) G = new Map, Q.set(B.resource, G);
      let Z = `${B.instrumentationScope.name}@${B.instrumentationScope.version||""}:${B.instrumentationScope.schemaUrl||""}`,
        I = G.get(Z);
      if (!I) I = [], G.set(Z, I);
      I.push(B)
    }
    return Q
  }

  function k$5(A, Q) {
    let B = _$5(A),
      G = [],
      Z = B.entries(),
      I = Z.next();
    while (!I.done) {
      let [Y, J] = I.value, W = [], X = J.values(), V = X.next();
      while (!V.done) {
        let D = V.value;
        if (D.length > 0) {
          let H = D.map((C) => $K2(C, Q));
          W.push({
            scope: (0, KOA.createInstrumentationScope)(D[0].instrumentationScope),
            spans: H,
            schemaUrl: D[0].instrumentationScope.schemaUrl
          })
        }
        V = X.next()
      }
      let F = (0, KOA.createResource)(Y),
        K = {
          resource: F,
          scopeSpans: W,
          schemaUrl: F.schemaUrl
        };
      G.push(K), I = Z.next()
    }
    return G
  }
})
// @from(Start 10529460, End 10530021)
TK2 = z((OK2) => {
  Object.defineProperty(OK2, "__esModule", {
    value: !0
  });
  OK2.ProtobufTraceSerializer = void 0;
  var MK2 = C41(),
    b$5 = bB0(),
    f$5 = MK2.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse,
    h$5 = MK2.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
  OK2.ProtobufTraceSerializer = {
    serializeRequest: (A) => {
      let Q = (0, b$5.createExportTraceServiceRequest)(A);
      return h$5.encode(Q).finish()
    },
    deserializeResponse: (A) => {
      return f$5.decode(A)
    }
  }
})
// @from(Start 10530027, End 10530324)
PK2 = z((fB0) => {
  Object.defineProperty(fB0, "__esModule", {
    value: !0
  });
  fB0.ProtobufTraceSerializer = void 0;
  var g$5 = TK2();
  Object.defineProperty(fB0, "ProtobufTraceSerializer", {
    enumerable: !0,
    get: function() {
      return g$5.ProtobufTraceSerializer
    }
  })
})
// @from(Start 10530330, End 10530841)
_K2 = z((jK2) => {
  Object.defineProperty(jK2, "__esModule", {
    value: !0
  });
  jK2.JsonLogsSerializer = void 0;
  var m$5 = _B0();
  jK2.JsonLogsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, m$5.createExportLogsServiceRequest)(A, {
        useHex: !0,
        useLongBits: !1
      });
      return new TextEncoder().encode(JSON.stringify(Q))
    },
    deserializeResponse: (A) => {
      if (A.length === 0) return {};
      return JSON.parse(new TextDecoder().decode(A))
    }
  }
})
// @from(Start 10530847, End 10531129)
kK2 = z((hB0) => {
  Object.defineProperty(hB0, "__esModule", {
    value: !0
  });
  hB0.JsonLogsSerializer = void 0;
  var d$5 = _K2();
  Object.defineProperty(hB0, "JsonLogsSerializer", {
    enumerable: !0,
    get: function() {
      return d$5.JsonLogsSerializer
    }
  })
})
// @from(Start 10531135, End 10531637)
vK2 = z((yK2) => {
  Object.defineProperty(yK2, "__esModule", {
    value: !0
  });
  yK2.JsonMetricsSerializer = void 0;
  var p$5 = xB0();
  yK2.JsonMetricsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, p$5.createExportMetricsServiceRequest)([A], {
        useLongBits: !1
      });
      return new TextEncoder().encode(JSON.stringify(Q))
    },
    deserializeResponse: (A) => {
      if (A.length === 0) return {};
      return JSON.parse(new TextDecoder().decode(A))
    }
  }
})
// @from(Start 10531643, End 10531934)
bK2 = z((gB0) => {
  Object.defineProperty(gB0, "__esModule", {
    value: !0
  });
  gB0.JsonMetricsSerializer = void 0;
  var l$5 = vK2();
  Object.defineProperty(gB0, "JsonMetricsSerializer", {
    enumerable: !0,
    get: function() {
      return l$5.JsonMetricsSerializer
    }
  })
})
// @from(Start 10531940, End 10532454)
gK2 = z((fK2) => {
  Object.defineProperty(fK2, "__esModule", {
    value: !0
  });
  fK2.JsonTraceSerializer = void 0;
  var n$5 = bB0();
  fK2.JsonTraceSerializer = {
    serializeRequest: (A) => {
      let Q = (0, n$5.createExportTraceServiceRequest)(A, {
        useHex: !0,
        useLongBits: !1
      });
      return new TextEncoder().encode(JSON.stringify(Q))
    },
    deserializeResponse: (A) => {
      if (A.length === 0) return {};
      return JSON.parse(new TextDecoder().decode(A))
    }
  }
})
// @from(Start 10532460, End 10532745)
uK2 = z((uB0) => {
  Object.defineProperty(uB0, "__esModule", {
    value: !0
  });
  uB0.JsonTraceSerializer = void 0;
  var a$5 = gK2();
  Object.defineProperty(uB0, "JsonTraceSerializer", {
    enumerable: !0,
    get: function() {
      return a$5.JsonTraceSerializer
    }
  })
})
// @from(Start 10532751, End 10534013)
tk = z((gi) => {
  Object.defineProperty(gi, "__esModule", {
    value: !0
  });
  gi.JsonTraceSerializer = gi.JsonMetricsSerializer = gi.JsonLogsSerializer = gi.ProtobufTraceSerializer = gi.ProtobufMetricsSerializer = gi.ProtobufLogsSerializer = void 0;
  var r$5 = GK2();
  Object.defineProperty(gi, "ProtobufLogsSerializer", {
    enumerable: !0,
    get: function() {
      return r$5.ProtobufLogsSerializer
    }
  });
  var o$5 = UK2();
  Object.defineProperty(gi, "ProtobufMetricsSerializer", {
    enumerable: !0,
    get: function() {
      return o$5.ProtobufMetricsSerializer
    }
  });
  var t$5 = PK2();
  Object.defineProperty(gi, "ProtobufTraceSerializer", {
    enumerable: !0,
    get: function() {
      return t$5.ProtobufTraceSerializer
    }
  });
  var e$5 = kK2();
  Object.defineProperty(gi, "JsonLogsSerializer", {
    enumerable: !0,
    get: function() {
      return e$5.JsonLogsSerializer
    }
  });
  var Aw5 = bK2();
  Object.defineProperty(gi, "JsonMetricsSerializer", {
    enumerable: !0,
    get: function() {
      return Aw5.JsonMetricsSerializer
    }
  });
  var Qw5 = uK2();
  Object.defineProperty(gi, "JsonTraceSerializer", {
    enumerable: !0,
    get: function() {
      return Qw5.JsonTraceSerializer
    }
  })
})
// @from(Start 10534019, End 10534155)
cK2 = z((mK2) => {
  Object.defineProperty(mK2, "__esModule", {
    value: !0
  });
  mK2.VERSION = void 0;
  mK2.VERSION = "0.204.0"
})
// @from(Start 10534161, End 10534627)
iK2 = z((pK2) => {
  Object.defineProperty(pK2, "__esModule", {
    value: !0
  });
  pK2.validateAndNormalizeHeaders = void 0;
  var Gw5 = K9();

  function Zw5(A) {
    return () => {
      let Q = {};
      return Object.entries(A?.() ?? {}).forEach(([B, G]) => {
        if (typeof G < "u") Q[B] = String(G);
        else Gw5.diag.warn(`Header "${B}" has invalid value (${G}) and will be ignored`)
      }), Q
    }
  }
  pK2.validateAndNormalizeHeaders = Zw5
})
// @from(Start 10534633, End 10536218)
mB0 = z((sK2) => {
  Object.defineProperty(sK2, "__esModule", {
    value: !0
  });
  sK2.getHttpConfigurationDefaults = sK2.mergeOtlpHttpConfigurationWithDefaults = sK2.httpAgentFactoryFromOptions = void 0;
  var nK2 = JOA(),
    Iw5 = iK2();

  function Yw5(A, Q, B) {
    let G = {
        ...B()
      },
      Z = {};
    return () => {
      if (Q != null) Object.assign(Z, Q());
      if (A != null) Object.assign(Z, A());
      return Object.assign(Z, G)
    }
  }

  function Jw5(A) {
    if (A == null) return;
    try {
      let Q = globalThis.location?.href;
      return new URL(A, Q).href
    } catch {
      throw Error(`Configuration: Could not parse user-provided export URL: '${A}'`)
    }
  }

  function aK2(A) {
    return async (Q) => {
      let B = Q === "http:" ? import("http") : import("https"),
        {
          Agent: G
        } = await B;
      return new G(A)
    }
  }
  sK2.httpAgentFactoryFromOptions = aK2;

  function Ww5(A, Q, B) {
    return {
      ...(0, nK2.mergeOtlpSharedConfigurationWithDefaults)(A, Q, B),
      headers: Yw5((0, Iw5.validateAndNormalizeHeaders)(A.headers), Q.headers, B.headers),
      url: Jw5(A.url) ?? Q.url ?? B.url,
      agentFactory: A.agentFactory ?? Q.agentFactory ?? B.agentFactory
    }
  }
  sK2.mergeOtlpHttpConfigurationWithDefaults = Ww5;

  function Xw5(A, Q) {
    return {
      ...(0, nK2.getSharedConfigurationDefaults)(),
      headers: () => A,
      url: "http://localhost:4318/" + Q,
      agentFactory: aK2({
        keepAlive: !0
      })
    }
  }
  sK2.getHttpConfigurationDefaults = Xw5
})
// @from(Start 10536224, End 10536742)
eK2 = z((oK2) => {
  Object.defineProperty(oK2, "__esModule", {
    value: !0
  });
  oK2.parseRetryAfterToMills = oK2.isExportRetryable = void 0;

  function Kw5(A) {
    return [429, 502, 503, 504].includes(A)
  }
  oK2.isExportRetryable = Kw5;

  function Dw5(A) {
    if (A == null) return;
    let Q = Number.parseInt(A, 10);
    if (Number.isInteger(Q)) return Q > 0 ? Q * 1000 : -1;
    let B = new Date(A).getTime() - Date.now();
    if (B >= 0) return B;
    return 0
  }
  oK2.parseRetryAfterToMills = Dw5
})
// @from(Start 10536748, End 10538612)
ZD2 = z((BD2) => {
  Object.defineProperty(BD2, "__esModule", {
    value: !0
  });
  BD2.compressAndSend = BD2.sendWithHttp = void 0;
  var Cw5 = UA("zlib"),
    Ew5 = UA("stream"),
    AD2 = eK2(),
    zw5 = J41();

  function Uw5(A, Q, B, G, Z, I) {
    let Y = new URL(Q.url),
      J = {
        hostname: Y.hostname,
        port: Y.port,
        path: Y.pathname,
        method: "POST",
        headers: {
          ...Q.headers()
        },
        agent: B
      },
      W = A(J, (X) => {
        let V = [];
        X.on("data", (F) => V.push(F)), X.on("end", () => {
          if (X.statusCode && X.statusCode < 299) Z({
            status: "success",
            data: Buffer.concat(V)
          });
          else if (X.statusCode && (0, AD2.isExportRetryable)(X.statusCode)) Z({
            status: "retryable",
            retryInMillis: (0, AD2.parseRetryAfterToMills)(X.headers["retry-after"])
          });
          else {
            let F = new zw5.OTLPExporterError(X.statusMessage, X.statusCode, Buffer.concat(V).toString());
            Z({
              status: "failure",
              error: F
            })
          }
        })
      });
    W.setTimeout(I, () => {
      W.destroy(), Z({
        status: "failure",
        error: Error("Request Timeout")
      })
    }), W.on("error", (X) => {
      Z({
        status: "failure",
        error: X
      })
    }), QD2(W, Q.compression, G, (X) => {
      Z({
        status: "failure",
        error: X
      })
    })
  }
  BD2.sendWithHttp = Uw5;

  function QD2(A, Q, B, G) {
    let Z = $w5(B);
    if (Q === "gzip") A.setHeader("Content-Encoding", "gzip"), Z = Z.on("error", G).pipe(Cw5.createGzip()).on("error", G);
    Z.pipe(A).on("error", G)
  }
  BD2.compressAndSend = QD2;

  function $w5(A) {
    let Q = new Ew5.Readable;
    return Q.push(A), Q.push(null), Q
  }
})
// @from(Start 10538618, End 10539704)
WD2 = z((YD2) => {
  Object.defineProperty(YD2, "__esModule", {
    value: !0
  });
  YD2.createHttpExporterTransport = void 0;
  var qw5 = ZD2();
  class ID2 {
    _parameters;
    _utils = null;
    constructor(A) {
      this._parameters = A
    }
    async send(A, Q) {
      let {
        agent: B,
        request: G
      } = await this._loadUtils();
      return new Promise((Z) => {
        (0, qw5.sendWithHttp)(G, this._parameters, B, A, (I) => {
          Z(I)
        }, Q)
      })
    }
    shutdown() {}
    async _loadUtils() {
      let A = this._utils;
      if (A === null) {
        let Q = new URL(this._parameters.url).protocol,
          [B, G] = await Promise.all([this._parameters.agentFactory(Q), Nw5(Q)]);
        A = this._utils = {
          agent: B,
          request: G
        }
      }
      return A
    }
  }
  async function Nw5(A) {
    let Q = A === "http:" ? import("http") : import("https"),
      {
        request: B
      } = await Q;
    return B
  }

  function Lw5(A) {
    return new ID2(A)
  }
  YD2.createHttpExporterTransport = Lw5
})
// @from(Start 10539710, End 10540821)
DD2 = z((FD2) => {
  Object.defineProperty(FD2, "__esModule", {
    value: !0
  });
  FD2.createRetryingTransport = void 0;
  var Mw5 = 5,
    Ow5 = 1000,
    Rw5 = 5000,
    Tw5 = 1.5,
    XD2 = 0.2;

  function Pw5() {
    return Math.random() * (2 * XD2) - XD2
  }
  class VD2 {
    _transport;
    constructor(A) {
      this._transport = A
    }
    retry(A, Q, B) {
      return new Promise((G, Z) => {
        setTimeout(() => {
          this._transport.send(A, Q).then(G, Z)
        }, B)
      })
    }
    async send(A, Q) {
      let B = Date.now() + Q,
        G = await this._transport.send(A, Q),
        Z = Mw5,
        I = Ow5;
      while (G.status === "retryable" && Z > 0) {
        Z--;
        let Y = Math.max(Math.min(I, Rw5) + Pw5(), 0);
        I = I * Tw5;
        let J = G.retryInMillis ?? Y,
          W = B - Date.now();
        if (J > W) return G;
        G = await this.retry(A, W, J)
      }
      return G
    }
    shutdown() {
      return this._transport.shutdown()
    }
  }

  function jw5(A) {
    return new VD2(A.transport)
  }
  FD2.createRetryingTransport = jw5
})
// @from(Start 10540827, End 10541406)
ED2 = z((HD2) => {
  Object.defineProperty(HD2, "__esModule", {
    value: !0
  });
  HD2.createOtlpHttpExportDelegate = void 0;
  var Sw5 = IB0(),
    _w5 = WD2(),
    kw5 = ZB0(),
    yw5 = DD2();

  function xw5(A, Q) {
    return (0, Sw5.createOtlpExportDelegate)({
      transport: (0, yw5.createRetryingTransport)({
        transport: (0, _w5.createHttpExporterTransport)(A)
      }),
      serializer: Q,
      promiseHandler: (0, kw5.createBoundedQueueExportPromiseHandler)(A)
    }, {
      timeout: A.timeoutMillis
    })
  }
  HD2.createOtlpHttpExportDelegate = xw5
})
// @from(Start 10541412, End 10542549)
dB0 = z((wD2) => {
  Object.defineProperty(wD2, "__esModule", {
    value: !0
  });
  wD2.getSharedConfigurationFromEnvironment = void 0;
  var $D2 = K9();

  function zD2(A) {
    let Q = process.env[A]?.trim();
    if (Q != null && Q !== "") {
      let B = Number(Q);
      if (Number.isFinite(B) && B > 0) return B;
      $D2.diag.warn(`Configuration: ${A} is invalid, expected number greater than 0 (actual: ${Q})`)
    }
    return
  }

  function vw5(A) {
    let Q = zD2(`OTEL_EXPORTER_OTLP_${A}_TIMEOUT`),
      B = zD2("OTEL_EXPORTER_OTLP_TIMEOUT");
    return Q ?? B
  }

  function UD2(A) {
    let Q = process.env[A]?.trim();
    if (Q === "") return;
    if (Q == null || Q === "none" || Q === "gzip") return Q;
    $D2.diag.warn(`Configuration: ${A} is invalid, expected 'none' or 'gzip' (actual: '${Q}')`);
    return
  }

  function bw5(A) {
    let Q = UD2(`OTEL_EXPORTER_OTLP_${A}_COMPRESSION`),
      B = UD2("OTEL_EXPORTER_OTLP_COMPRESSION");
    return Q ?? B
  }

  function fw5(A) {
    return {
      timeoutMillis: vw5(A),
      compression: bw5(A)
    }
  }
  wD2.getSharedConfigurationFromEnvironment = fw5
})
// @from(Start 10542555, End 10544417)
MD2 = z((ND2) => {
  Object.defineProperty(ND2, "__esModule", {
    value: !0
  });
  ND2.getHttpConfigurationFromEnvironment = void 0;
  var ui = e6(),
    cB0 = K9(),
    hw5 = dB0(),
    gw5 = JOA();

  function uw5(A) {
    let Q = (0, ui.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${A}_HEADERS`),
      B = (0, ui.getStringFromEnv)("OTEL_EXPORTER_OTLP_HEADERS"),
      G = (0, ui.parseKeyPairsIntoRecord)(Q),
      Z = (0, ui.parseKeyPairsIntoRecord)(B);
    if (Object.keys(G).length === 0 && Object.keys(Z).length === 0) return;
    return Object.assign({}, (0, ui.parseKeyPairsIntoRecord)(B), (0, ui.parseKeyPairsIntoRecord)(Q))
  }

  function mw5(A) {
    try {
      return new URL(A).toString()
    } catch {
      cB0.diag.warn(`Configuration: Could not parse environment-provided export URL: '${A}', falling back to undefined`);
      return
    }
  }

  function dw5(A, Q) {
    try {
      new URL(A)
    } catch {
      cB0.diag.warn(`Configuration: Could not parse environment-provided export URL: '${A}', falling back to undefined`);
      return
    }
    if (!A.endsWith("/")) A = A + "/";
    A += Q;
    try {
      new URL(A)
    } catch {
      cB0.diag.warn(`Configuration: Provided URL appended with '${Q}' is not a valid URL, using 'undefined' instead of '${A}'`);
      return
    }
    return A
  }

  function cw5(A) {
    let Q = (0, ui.getStringFromEnv)("OTEL_EXPORTER_OTLP_ENDPOINT");
    if (Q === void 0) return;
    return dw5(Q, A)
  }

  function pw5(A) {
    let Q = (0, ui.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${A}_ENDPOINT`);
    if (Q === void 0) return;
    return mw5(Q)
  }

  function lw5(A, Q) {
    return {
      ...(0, hw5.getSharedConfigurationFromEnvironment)(A),
      url: pw5(A) ?? cw5(Q),
      headers: (0, gw5.wrapStaticHeadersInFunction)(uw5(A))
    }
  }
  ND2.getHttpConfigurationFromEnvironment = lw5
})
// @from(Start 10544423, End 10545457)
TD2 = z((OD2) => {
  Object.defineProperty(OD2, "__esModule", {
    value: !0
  });
  OD2.convertLegacyHttpOptions = void 0;
  var pB0 = mB0(),
    iw5 = MD2(),
    nw5 = K9(),
    aw5 = JOA();

  function sw5(A) {
    if (typeof A.httpAgentOptions === "function") return A.httpAgentOptions;
    let Q = A.httpAgentOptions;
    if (A.keepAlive != null) Q = {
      keepAlive: A.keepAlive,
      ...Q
    };
    if (Q != null) return (0, pB0.httpAgentFactoryFromOptions)(Q);
    else return
  }

  function rw5(A, Q, B, G) {
    if (A.metadata) nw5.diag.warn("Metadata cannot be set when using http");
    return (0, pB0.mergeOtlpHttpConfigurationWithDefaults)({
      url: A.url,
      headers: (0, aw5.wrapStaticHeadersInFunction)(A.headers),
      concurrencyLimit: A.concurrencyLimit,
      timeoutMillis: A.timeoutMillis,
      compression: A.compression,
      agentFactory: sw5(A)
    }, (0, iw5.getHttpConfigurationFromEnvironment)(Q, B), (0, pB0.getHttpConfigurationDefaults)(G, B))
  }
  OD2.convertLegacyHttpOptions = rw5
})
// @from(Start 10545463, End 10546437)
mi = z((sYA) => {
  Object.defineProperty(sYA, "__esModule", {
    value: !0
  });
  sYA.convertLegacyHttpOptions = sYA.getSharedConfigurationFromEnvironment = sYA.createOtlpHttpExportDelegate = sYA.httpAgentFactoryFromOptions = void 0;
  var ow5 = mB0();
  Object.defineProperty(sYA, "httpAgentFactoryFromOptions", {
    enumerable: !0,
    get: function() {
      return ow5.httpAgentFactoryFromOptions
    }
  });
  var tw5 = ED2();
  Object.defineProperty(sYA, "createOtlpHttpExportDelegate", {
    enumerable: !0,
    get: function() {
      return tw5.createOtlpHttpExportDelegate
    }
  });
  var ew5 = dB0();
  Object.defineProperty(sYA, "getSharedConfigurationFromEnvironment", {
    enumerable: !0,
    get: function() {
      return ew5.getSharedConfigurationFromEnvironment
    }
  });
  var Aq5 = TD2();
  Object.defineProperty(sYA, "convertLegacyHttpOptions", {
    enumerable: !0,
    get: function() {
      return Aq5.convertLegacyHttpOptions
    }
  })
})
// @from(Start 10546443, End 10547049)
kD2 = z((SD2) => {
  Object.defineProperty(SD2, "__esModule", {
    value: !0
  });
  SD2.OTLPMetricExporter = void 0;
  var Bq5 = WB0(),
    Gq5 = tk(),
    Zq5 = cK2(),
    PD2 = mi(),
    Iq5 = {
      "User-Agent": `OTel-OTLP-Exporter-JavaScript/${Zq5.VERSION}`
    };
  class jD2 extends Bq5.OTLPMetricExporterBase {
    constructor(A) {
      super((0, PD2.createOtlpHttpExportDelegate)((0, PD2.convertLegacyHttpOptions)(A ?? {}, "METRICS", "v1/metrics", {
        ...Iq5,
        "Content-Type": "application/json"
      }), Gq5.JsonMetricsSerializer), A)
    }
  }
  SD2.OTLPMetricExporter = jD2
})
// @from(Start 10547055, End 10547337)
yD2 = z((lB0) => {
  Object.defineProperty(lB0, "__esModule", {
    value: !0
  });
  lB0.OTLPMetricExporter = void 0;
  var Yq5 = kD2();
  Object.defineProperty(lB0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return Yq5.OTLPMetricExporter
    }
  })
})
// @from(Start 10547343, End 10547625)
xD2 = z((iB0) => {
  Object.defineProperty(iB0, "__esModule", {
    value: !0
  });
  iB0.OTLPMetricExporter = void 0;
  var Wq5 = yD2();
  Object.defineProperty(iB0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return Wq5.OTLPMetricExporter
    }
  })
})
// @from(Start 10547631, End 10548912)
w41 = z((di) => {
  Object.defineProperty(di, "__esModule", {
    value: !0
  });
  di.OTLPMetricExporterBase = di.LowMemoryTemporalitySelector = di.DeltaTemporalitySelector = di.CumulativeTemporalitySelector = di.AggregationTemporalityPreference = di.OTLPMetricExporter = void 0;
  var Vq5 = xD2();
  Object.defineProperty(di, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return Vq5.OTLPMetricExporter
    }
  });
  var Fq5 = BB0();
  Object.defineProperty(di, "AggregationTemporalityPreference", {
    enumerable: !0,
    get: function() {
      return Fq5.AggregationTemporalityPreference
    }
  });
  var $41 = WB0();
  Object.defineProperty(di, "CumulativeTemporalitySelector", {
    enumerable: !0,
    get: function() {
      return $41.CumulativeTemporalitySelector
    }
  });
  Object.defineProperty(di, "DeltaTemporalitySelector", {
    enumerable: !0,
    get: function() {
      return $41.DeltaTemporalitySelector
    }
  });
  Object.defineProperty(di, "LowMemoryTemporalitySelector", {
    enumerable: !0,
    get: function() {
      return $41.LowMemoryTemporalitySelector
    }
  });
  Object.defineProperty(di, "OTLPMetricExporterBase", {
    enumerable: !0,
    get: function() {
      return $41.OTLPMetricExporterBase
    }
  })
})
// @from(Start 10548918, End 10549054)
fD2 = z((vD2) => {
  Object.defineProperty(vD2, "__esModule", {
    value: !0
  });
  vD2.VERSION = void 0;
  vD2.VERSION = "0.204.0"
})
// @from(Start 10549060, End 10549644)
dD2 = z((uD2) => {
  Object.defineProperty(uD2, "__esModule", {
    value: !0
  });
  uD2.OTLPMetricExporter = void 0;
  var Dq5 = w41(),
    Hq5 = tk(),
    Cq5 = fD2(),
    hD2 = mi();
  class gD2 extends Dq5.OTLPMetricExporterBase {
    constructor(A) {
      super((0, hD2.createOtlpHttpExportDelegate)((0, hD2.convertLegacyHttpOptions)(A ?? {}, "METRICS", "v1/metrics", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${Cq5.VERSION}`,
        "Content-Type": "application/x-protobuf"
      }), Hq5.ProtobufMetricsSerializer), A)
    }
  }
  uD2.OTLPMetricExporter = gD2
})
// @from(Start 10549650, End 10549932)
cD2 = z((nB0) => {
  Object.defineProperty(nB0, "__esModule", {
    value: !0
  });
  nB0.OTLPMetricExporter = void 0;
  var Eq5 = dD2();
  Object.defineProperty(nB0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return Eq5.OTLPMetricExporter
    }
  })
})
// @from(Start 10549938, End 10550220)
pD2 = z((aB0) => {
  Object.defineProperty(aB0, "__esModule", {
    value: !0
  });
  aB0.OTLPMetricExporter = void 0;
  var Uq5 = cD2();
  Object.defineProperty(aB0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return Uq5.OTLPMetricExporter
    }
  })
})
// @from(Start 10550226, End 10550508)
lD2 = z((sB0) => {
  Object.defineProperty(sB0, "__esModule", {
    value: !0
  });
  sB0.OTLPMetricExporter = void 0;
  var wq5 = pD2();
  Object.defineProperty(sB0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return wq5.OTLPMetricExporter
    }
  })
})
// @from(Start 10550514, End 10552056)
E6 = z((sD2) => {
  Object.defineProperty(sD2, "__esModule", {
    value: !0
  });
  sD2.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = sD2.DEFAULT_MAX_SEND_MESSAGE_LENGTH = sD2.Propagate = sD2.LogVerbosity = sD2.Status = void 0;
  var iD2;
  (function(A) {
    A[A.OK = 0] = "OK", A[A.CANCELLED = 1] = "CANCELLED", A[A.UNKNOWN = 2] = "UNKNOWN", A[A.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", A[A.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", A[A.NOT_FOUND = 5] = "NOT_FOUND", A[A.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", A[A.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", A[A.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", A[A.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", A[A.ABORTED = 10] = "ABORTED", A[A.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", A[A.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", A[A.INTERNAL = 13] = "INTERNAL", A[A.UNAVAILABLE = 14] = "UNAVAILABLE", A[A.DATA_LOSS = 15] = "DATA_LOSS", A[A.UNAUTHENTICATED = 16] = "UNAUTHENTICATED"
  })(iD2 || (sD2.Status = iD2 = {}));
  var nD2;
  (function(A) {
    A[A.DEBUG = 0] = "DEBUG", A[A.INFO = 1] = "INFO", A[A.ERROR = 2] = "ERROR", A[A.NONE = 3] = "NONE"
  })(nD2 || (sD2.LogVerbosity = nD2 = {}));
  var aD2;
  (function(A) {
    A[A.DEADLINE = 1] = "DEADLINE", A[A.CENSUS_STATS_CONTEXT = 2] = "CENSUS_STATS_CONTEXT", A[A.CENSUS_TRACING_CONTEXT = 4] = "CENSUS_TRACING_CONTEXT", A[A.CANCELLATION = 8] = "CANCELLATION", A[A.DEFAULTS = 65535] = "DEFAULTS"
  })(aD2 || (sD2.Propagate = aD2 = {}));
  sD2.DEFAULT_MAX_SEND_MESSAGE_LENGTH = -1;
  sD2.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = 4194304
})
// @from(Start 10552062, End 10555380)
rB0 = z((DcG, Rq5) => {
  Rq5.exports = {
    name: "@grpc/grpc-js",
    version: "1.14.0",
    description: "gRPC Library for Node - pure JS implementation",
    homepage: "https://grpc.io/",
    repository: "https://github.com/grpc/grpc-node/tree/master/packages/grpc-js",
    main: "build/src/index.js",
    engines: {
      node: ">=12.10.0"
    },
    keywords: [],
    author: {
      name: "Google Inc."
    },
    types: "build/src/index.d.ts",
    license: "Apache-2.0",
    devDependencies: {
      "@grpc/proto-loader": "file:../proto-loader",
      "@types/gulp": "^4.0.17",
      "@types/gulp-mocha": "0.0.37",
      "@types/lodash": "^4.14.202",
      "@types/mocha": "^10.0.6",
      "@types/ncp": "^2.0.8",
      "@types/node": ">=20.11.20",
      "@types/pify": "^5.0.4",
      "@types/semver": "^7.5.8",
      "@typescript-eslint/eslint-plugin": "^7.1.0",
      "@typescript-eslint/parser": "^7.1.0",
      "@typescript-eslint/typescript-estree": "^7.1.0",
      "clang-format": "^1.8.0",
      eslint: "^8.42.0",
      "eslint-config-prettier": "^8.8.0",
      "eslint-plugin-node": "^11.1.0",
      "eslint-plugin-prettier": "^4.2.1",
      execa: "^2.0.3",
      gulp: "^4.0.2",
      "gulp-mocha": "^6.0.0",
      lodash: "^4.17.21",
      madge: "^5.0.1",
      "mocha-jenkins-reporter": "^0.4.1",
      ncp: "^2.0.0",
      pify: "^4.0.1",
      prettier: "^2.8.8",
      rimraf: "^3.0.2",
      semver: "^7.6.0",
      "ts-node": "^10.9.2",
      typescript: "^5.3.3"
    },
    contributors: [{
      name: "Google Inc."
    }],
    scripts: {
      build: "npm run compile",
      clean: "rimraf ./build",
      compile: "tsc -p .",
      format: 'clang-format -i -style="{Language: JavaScript, BasedOnStyle: Google, ColumnLimit: 80}" src/*.ts test/*.ts',
      lint: "eslint src/*.ts test/*.ts",
      prepare: "npm run copy-protos && npm run generate-types && npm run generate-test-types && npm run compile",
      test: "gulp test",
      check: "npm run lint",
      fix: "eslint --fix src/*.ts test/*.ts",
      pretest: "npm run generate-types && npm run generate-test-types && npm run compile",
      posttest: "npm run check && madge -c ./build/src",
      "generate-types": "proto-loader-gen-types --keepCase --longs String --enums String --defaults --oneofs --includeComments --includeDirs proto/ --include-dirs proto/ proto/xds/ proto/protoc-gen-validate/ -O src/generated/ --grpcLib ../index channelz.proto xds/service/orca/v3/orca.proto",
      "generate-test-types": "proto-loader-gen-types --keepCase --longs String --enums String --defaults --oneofs --includeComments --include-dirs test/fixtures/ -O test/generated/ --grpcLib ../../src/index test_service.proto echo_service.proto",
      "copy-protos": "node ./copy-protos"
    },
    dependencies: {
      "@grpc/proto-loader": "^0.8.0",
      "@js-sdsl/ordered-map": "^4.4.2"
    },
    files: ["src/**/*.ts", "build/src/**/*.{js,d.ts,js.map}", "proto/**/*.proto", "proto/**/LICENSE", "LICENSE", "deps/envoy-api/envoy/api/v2/**/*.proto", "deps/envoy-api/envoy/config/**/*.proto", "deps/envoy-api/envoy/service/**/*.proto", "deps/envoy-api/envoy/type/**/*.proto", "deps/udpa/udpa/**/*.proto", "deps/googleapis/google/api/*.proto", "deps/googleapis/google/rpc/*.proto", "deps/protoc-gen-validate/validate/**/*.proto"]
  }
})
// @from(Start 10555386, End 10557578)
zZ = z((eD2) => {
  var oB0, tB0, eB0, A20;
  Object.defineProperty(eD2, "__esModule", {
    value: !0
  });
  eD2.log = eD2.setLoggerVerbosity = eD2.setLogger = eD2.getLogger = void 0;
  eD2.trace = fq5;
  eD2.isTracerEnabled = tD2;
  var ci = E6(),
    Tq5 = UA("process"),
    Pq5 = rB0().version,
    jq5 = {
      error: (A, ...Q) => {
        console.error("E " + A, ...Q)
      },
      info: (A, ...Q) => {
        console.error("I " + A, ...Q)
      },
      debug: (A, ...Q) => {
        console.error("D " + A, ...Q)
      }
    },
    s1A = jq5,
    rYA = ci.LogVerbosity.ERROR,
    Sq5 = (tB0 = (oB0 = process.env.GRPC_NODE_VERBOSITY) !== null && oB0 !== void 0 ? oB0 : process.env.GRPC_VERBOSITY) !== null && tB0 !== void 0 ? tB0 : "";
  switch (Sq5.toUpperCase()) {
    case "DEBUG":
      rYA = ci.LogVerbosity.DEBUG;
      break;
    case "INFO":
      rYA = ci.LogVerbosity.INFO;
      break;
    case "ERROR":
      rYA = ci.LogVerbosity.ERROR;
      break;
    case "NONE":
      rYA = ci.LogVerbosity.NONE;
      break;
    default:
  }
  var _q5 = () => {
    return s1A
  };
  eD2.getLogger = _q5;
  var kq5 = (A) => {
    s1A = A
  };
  eD2.setLogger = kq5;
  var yq5 = (A) => {
    rYA = A
  };
  eD2.setLoggerVerbosity = yq5;
  var xq5 = (A, ...Q) => {
    let B;
    if (A >= rYA) {
      switch (A) {
        case ci.LogVerbosity.DEBUG:
          B = s1A.debug;
          break;
        case ci.LogVerbosity.INFO:
          B = s1A.info;
          break;
        case ci.LogVerbosity.ERROR:
          B = s1A.error;
          break
      }
      if (!B) B = s1A.error;
      if (B) B.bind(s1A)(...Q)
    }
  };
  eD2.log = xq5;
  var vq5 = (A20 = (eB0 = process.env.GRPC_NODE_TRACE) !== null && eB0 !== void 0 ? eB0 : process.env.GRPC_TRACE) !== null && A20 !== void 0 ? A20 : "",
    Q20 = new Set,
    oD2 = new Set;
  for (let A of vq5.split(","))
    if (A.startsWith("-")) oD2.add(A.substring(1));
    else Q20.add(A);
  var bq5 = Q20.has("all");

  function fq5(A, Q, B) {
    if (tD2(Q)) eD2.log(A, new Date().toISOString() + " | v" + Pq5 + " " + Tq5.pid + " | " + Q + " | " + B)
  }

  function tD2(A) {
    return !oD2.has(A) && (bq5 || Q20.has(A))
  }
})
// @from(Start 10557584, End 10557973)
q41 = z((AH2) => {
  Object.defineProperty(AH2, "__esModule", {
    value: !0
  });
  AH2.getErrorMessage = cq5;
  AH2.getErrorCode = pq5;

  function cq5(A) {
    if (A instanceof Error) return A.message;
    else return String(A)
  }

  function pq5(A) {
    if (typeof A === "object" && A !== null && "code" in A && typeof A.code === "number") return A.code;
    else return null
  }
})
// @from(Start 10557979, End 10561711)
YK = z((GH2) => {
  Object.defineProperty(GH2, "__esModule", {
    value: !0
  });
  GH2.Metadata = void 0;
  var nq5 = zZ(),
    aq5 = E6(),
    sq5 = q41(),
    rq5 = /^[:0-9a-z_.-]+$/,
    oq5 = /^[ -~]*$/;

  function tq5(A) {
    return rq5.test(A)
  }

  function eq5(A) {
    return oq5.test(A)
  }

  function BH2(A) {
    return A.endsWith("-bin")
  }

  function AN5(A) {
    return !A.startsWith("grpc-")
  }

  function N41(A) {
    return A.toLowerCase()
  }

  function QH2(A, Q) {
    if (!tq5(A)) throw Error('Metadata key "' + A + '" contains illegal characters');
    if (Q !== null && Q !== void 0)
      if (BH2(A)) {
        if (!Buffer.isBuffer(Q)) throw Error("keys that end with '-bin' must have Buffer values")
      } else {
        if (Buffer.isBuffer(Q)) throw Error("keys that don't end with '-bin' must have String values");
        if (!eq5(Q)) throw Error('Metadata string value "' + Q + '" contains illegal characters')
      }
  }
  class L41 {
    constructor(A = {}) {
      this.internalRepr = new Map, this.opaqueData = new Map, this.options = A
    }
    set(A, Q) {
      A = N41(A), QH2(A, Q), this.internalRepr.set(A, [Q])
    }
    add(A, Q) {
      A = N41(A), QH2(A, Q);
      let B = this.internalRepr.get(A);
      if (B === void 0) this.internalRepr.set(A, [Q]);
      else B.push(Q)
    }
    remove(A) {
      A = N41(A), this.internalRepr.delete(A)
    }
    get(A) {
      return A = N41(A), this.internalRepr.get(A) || []
    }
    getMap() {
      let A = {};
      for (let [Q, B] of this.internalRepr)
        if (B.length > 0) {
          let G = B[0];
          A[Q] = Buffer.isBuffer(G) ? Buffer.from(G) : G
        } return A
    }
    clone() {
      let A = new L41(this.options),
        Q = A.internalRepr;
      for (let [B, G] of this.internalRepr) {
        let Z = G.map((I) => {
          if (Buffer.isBuffer(I)) return Buffer.from(I);
          else return I
        });
        Q.set(B, Z)
      }
      return A
    }
    merge(A) {
      for (let [Q, B] of A.internalRepr) {
        let G = (this.internalRepr.get(Q) || []).concat(B);
        this.internalRepr.set(Q, G)
      }
    }
    setOptions(A) {
      this.options = A
    }
    getOptions() {
      return this.options
    }
    toHttp2Headers() {
      let A = {};
      for (let [Q, B] of this.internalRepr) {
        if (Q.startsWith(":")) continue;
        A[Q] = B.map(QN5)
      }
      return A
    }
    toJSON() {
      let A = {};
      for (let [Q, B] of this.internalRepr) A[Q] = B;
      return A
    }
    setOpaque(A, Q) {
      this.opaqueData.set(A, Q)
    }
    getOpaque(A) {
      return this.opaqueData.get(A)
    }
    static fromHttp2Headers(A) {
      let Q = new L41;
      for (let B of Object.keys(A)) {
        if (B.charAt(0) === ":") continue;
        let G = A[B];
        try {
          if (BH2(B)) {
            if (Array.isArray(G)) G.forEach((Z) => {
              Q.add(B, Buffer.from(Z, "base64"))
            });
            else if (G !== void 0)
              if (AN5(B)) G.split(",").forEach((Z) => {
                Q.add(B, Buffer.from(Z.trim(), "base64"))
              });
              else Q.add(B, Buffer.from(G, "base64"))
          } else if (Array.isArray(G)) G.forEach((Z) => {
            Q.add(B, Z)
          });
          else if (G !== void 0) Q.add(B, G)
        } catch (Z) {
          let I = `Failed to add metadata entry ${B}: ${G}. ${(0,sq5.getErrorMessage)(Z)}. For more information see https://github.com/grpc/grpc-node/issues/1173`;
          (0, nq5.log)(aq5.LogVerbosity.ERROR, I)
        }
      }
      return Q
    }
  }
  GH2.Metadata = L41;
  var QN5 = (A) => {
    return Buffer.isBuffer(A) ? A.toString("base64") : A
  }
})
// @from(Start 10561717, End 10564073)
O41 = z((IH2) => {
  Object.defineProperty(IH2, "__esModule", {
    value: !0
  });
  IH2.CallCredentials = void 0;
  var G20 = YK();

  function BN5(A) {
    return "getRequestHeaders" in A && typeof A.getRequestHeaders === "function"
  }
  class oYA {
    static createFromMetadataGenerator(A) {
      return new Z20(A)
    }
    static createFromGoogleCredential(A) {
      return oYA.createFromMetadataGenerator((Q, B) => {
        let G;
        if (BN5(A)) G = A.getRequestHeaders(Q.service_url);
        else G = new Promise((Z, I) => {
          A.getRequestMetadata(Q.service_url, (Y, J) => {
            if (Y) {
              I(Y);
              return
            }
            if (!J) {
              I(Error("Headers not set by metadata plugin"));
              return
            }
            Z(J)
          })
        });
        G.then((Z) => {
          let I = new G20.Metadata;
          for (let Y of Object.keys(Z)) I.add(Y, Z[Y]);
          B(null, I)
        }, (Z) => {
          B(Z)
        })
      })
    }
    static createEmpty() {
      return new I20
    }
  }
  IH2.CallCredentials = oYA;
  class M41 extends oYA {
    constructor(A) {
      super();
      this.creds = A
    }
    async generateMetadata(A) {
      let Q = new G20.Metadata,
        B = await Promise.all(this.creds.map((G) => G.generateMetadata(A)));
      for (let G of B) Q.merge(G);
      return Q
    }
    compose(A) {
      return new M41(this.creds.concat([A]))
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof M41) return this.creds.every((Q, B) => Q._equals(A.creds[B]));
      else return !1
    }
  }
  class Z20 extends oYA {
    constructor(A) {
      super();
      this.metadataGenerator = A
    }
    generateMetadata(A) {
      return new Promise((Q, B) => {
        this.metadataGenerator(A, (G, Z) => {
          if (Z !== void 0) Q(Z);
          else B(G)
        })
      })
    }
    compose(A) {
      return new M41([this, A])
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof Z20) return this.metadataGenerator === A.metadataGenerator;
      else return !1
    }
  }
  class I20 extends oYA {
    generateMetadata(A) {
      return Promise.resolve(new G20.Metadata)
    }
    compose(A) {
      return A
    }
    _equals(A) {
      return A instanceof I20
    }
  }
})
// @from(Start 10564079, End 10564513)
J20 = z((WH2) => {
  Object.defineProperty(WH2, "__esModule", {
    value: !0
  });
  WH2.CIPHER_SUITES = void 0;
  WH2.getDefaultRootsData = ZN5;
  var GN5 = UA("fs");
  WH2.CIPHER_SUITES = process.env.GRPC_SSL_CIPHER_SUITES;
  var JH2 = process.env.GRPC_DEFAULT_SSL_ROOTS_FILE_PATH,
    Y20 = null;

  function ZN5() {
    if (JH2) {
      if (Y20 === null) Y20 = GN5.readFileSync(JH2);
      return Y20
    }
    return null
  }
})
// @from(Start 10564519, End 10566024)
uE = z((FH2) => {
  Object.defineProperty(FH2, "__esModule", {
    value: !0
  });
  FH2.parseUri = JN5;
  FH2.splitHostPort = WN5;
  FH2.combineHostPort = XN5;
  FH2.uriToString = VN5;
  var YN5 = /^(?:([A-Za-z0-9+.-]+):)?(?:\/\/([^/]*)\/)?(.+)$/;

  function JN5(A) {
    let Q = YN5.exec(A);
    if (Q === null) return null;
    return {
      scheme: Q[1],
      authority: Q[2],
      path: Q[3]
    }
  }
  var VH2 = /^\d+$/;

  function WN5(A) {
    if (A.startsWith("[")) {
      let Q = A.indexOf("]");
      if (Q === -1) return null;
      let B = A.substring(1, Q);
      if (B.indexOf(":") === -1) return null;
      if (A.length > Q + 1)
        if (A[Q + 1] === ":") {
          let G = A.substring(Q + 2);
          if (VH2.test(G)) return {
            host: B,
            port: +G
          };
          else return null
        } else return null;
      else return {
        host: B
      }
    } else {
      let Q = A.split(":");
      if (Q.length === 2)
        if (VH2.test(Q[1])) return {
          host: Q[0],
          port: +Q[1]
        };
        else return null;
      else return {
        host: A
      }
    }
  }

  function XN5(A) {
    if (A.port === void 0) return A.host;
    else if (A.host.includes(":")) return `[${A.host}]:${A.port}`;
    else return `${A.host}:${A.port}`
  }

  function VN5(A) {
    let Q = "";
    if (A.scheme !== void 0) Q += A.scheme + ":";
    if (A.authority !== void 0) Q += "//" + A.authority + "/";
    return Q += A.path, Q
  }
})
// @from(Start 10566030, End 10567155)
CP = z((KH2) => {
  Object.defineProperty(KH2, "__esModule", {
    value: !0
  });
  KH2.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = void 0;
  KH2.registerResolver = CN5;
  KH2.registerDefaultScheme = EN5;
  KH2.createResolver = zN5;
  KH2.getDefaultAuthority = UN5;
  KH2.mapUriDefaultScheme = $N5;
  var X20 = uE();
  KH2.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = "grpc.internal.config_selector";
  var tYA = {},
    W20 = null;

  function CN5(A, Q) {
    tYA[A] = Q
  }

  function EN5(A) {
    W20 = A
  }

  function zN5(A, Q, B) {
    if (A.scheme !== void 0 && A.scheme in tYA) return new tYA[A.scheme](A, Q, B);
    else throw Error(`No resolver could be created for target ${(0,X20.uriToString)(A)}`)
  }

  function UN5(A) {
    if (A.scheme !== void 0 && A.scheme in tYA) return tYA[A.scheme].getDefaultAuthority(A);
    else throw Error(`Invalid target ${(0,X20.uriToString)(A)}`)
  }

  function $N5(A) {
    if (A.scheme === void 0 || !(A.scheme in tYA))
      if (W20 !== null) return {
        scheme: W20,
        authority: void 0,
        path: (0, X20.uriToString)(A)
      };
      else return null;
    return A
  }
})
// @from(Start 10567161, End 10577173)
AJA = z((zH2) => {
  Object.defineProperty(zH2, "__esModule", {
    value: !0
  });
  zH2.ChannelCredentials = void 0;
  zH2.createCertificateProviderChannelCredentials = PN5;
  var HOA = UA("tls"),
    P41 = O41(),
    F20 = J20(),
    HH2 = uE(),
    ON5 = CP(),
    RN5 = zZ(),
    TN5 = E6();

  function V20(A, Q) {
    if (A && !(A instanceof Buffer)) throw TypeError(`${Q}, if provided, must be a Buffer.`)
  }
  class eYA {
    compose(A) {
      return new T41(this, A)
    }
    static createSsl(A, Q, B, G) {
      var Z;
      if (V20(A, "Root certificate"), V20(Q, "Private key"), V20(B, "Certificate chain"), Q && !B) throw Error("Private key must be given with accompanying certificate chain");
      if (!Q && B) throw Error("Certificate chain must be given with accompanying private key");
      let I = (0, HOA.createSecureContext)({
        ca: (Z = A !== null && A !== void 0 ? A : (0, F20.getDefaultRootsData)()) !== null && Z !== void 0 ? Z : void 0,
        key: Q !== null && Q !== void 0 ? Q : void 0,
        cert: B !== null && B !== void 0 ? B : void 0,
        ciphers: F20.CIPHER_SUITES
      });
      return new R41(I, G !== null && G !== void 0 ? G : {})
    }
    static createFromSecureContext(A, Q) {
      return new R41(A, Q !== null && Q !== void 0 ? Q : {})
    }
    static createInsecure() {
      return new K20
    }
  }
  zH2.ChannelCredentials = eYA;
  class K20 extends eYA {
    constructor() {
      super()
    }
    compose(A) {
      throw Error("Cannot compose insecure credentials")
    }
    _isSecure() {
      return !1
    }
    _equals(A) {
      return A instanceof K20
    }
    _createSecureConnector(A, Q, B) {
      return {
        connect(G) {
          return Promise.resolve({
            socket: G,
            secure: !1
          })
        },
        waitForReady: () => {
          return Promise.resolve()
        },
        getCallCredentials: () => {
          return B !== null && B !== void 0 ? B : P41.CallCredentials.createEmpty()
        },
        destroy() {}
      }
    }
  }

  function CH2(A, Q, B, G) {
    var Z, I;
    let Y = {
        secureContext: A
      },
      J = B;
    if ("grpc.http_connect_target" in G) {
      let F = (0, HH2.parseUri)(G["grpc.http_connect_target"]);
      if (F) J = F
    }
    let W = (0, ON5.getDefaultAuthority)(J),
      X = (0, HH2.splitHostPort)(W),
      V = (Z = X === null || X === void 0 ? void 0 : X.host) !== null && Z !== void 0 ? Z : W;
    if (Y.host = V, Q.checkServerIdentity) Y.checkServerIdentity = Q.checkServerIdentity;
    if (Q.rejectUnauthorized !== void 0) Y.rejectUnauthorized = Q.rejectUnauthorized;
    if (Y.ALPNProtocols = ["h2"], G["grpc.ssl_target_name_override"]) {
      let F = G["grpc.ssl_target_name_override"],
        K = (I = Y.checkServerIdentity) !== null && I !== void 0 ? I : HOA.checkServerIdentity;
      Y.checkServerIdentity = (D, H) => {
        return K(F, H)
      }, Y.servername = F
    } else Y.servername = V;
    if (G["grpc-node.tls_enable_trace"]) Y.enableTrace = !0;
    return Y
  }
  class EH2 {
    constructor(A, Q) {
      this.connectionOptions = A, this.callCredentials = Q
    }
    connect(A) {
      let Q = Object.assign({
        socket: A
      }, this.connectionOptions);
      return new Promise((B, G) => {
        let Z = (0, HOA.connect)(Q, () => {
          var I;
          if (((I = this.connectionOptions.rejectUnauthorized) !== null && I !== void 0 ? I : !0) && !Z.authorized) {
            G(Z.authorizationError);
            return
          }
          B({
            socket: Z,
            secure: !0
          })
        });
        Z.on("error", (I) => {
          G(I)
        })
      })
    }
    waitForReady() {
      return Promise.resolve()
    }
    getCallCredentials() {
      return this.callCredentials
    }
    destroy() {}
  }
  class R41 extends eYA {
    constructor(A, Q) {
      super();
      this.secureContext = A, this.verifyOptions = Q
    }
    _isSecure() {
      return !0
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof R41) return this.secureContext === A.secureContext && this.verifyOptions.checkServerIdentity === A.verifyOptions.checkServerIdentity;
      else return !1
    }
    _createSecureConnector(A, Q, B) {
      let G = CH2(this.secureContext, this.verifyOptions, A, Q);
      return new EH2(G, B !== null && B !== void 0 ? B : P41.CallCredentials.createEmpty())
    }
  }
  class DOA extends eYA {
    constructor(A, Q, B) {
      super();
      this.caCertificateProvider = A, this.identityCertificateProvider = Q, this.verifyOptions = B, this.refcount = 0, this.latestCaUpdate = void 0, this.latestIdentityUpdate = void 0, this.caCertificateUpdateListener = this.handleCaCertificateUpdate.bind(this), this.identityCertificateUpdateListener = this.handleIdentityCertitificateUpdate.bind(this), this.secureContextWatchers = []
    }
    _isSecure() {
      return !0
    }
    _equals(A) {
      var Q, B;
      if (this === A) return !0;
      if (A instanceof DOA) return this.caCertificateProvider === A.caCertificateProvider && this.identityCertificateProvider === A.identityCertificateProvider && ((Q = this.verifyOptions) === null || Q === void 0 ? void 0 : Q.checkServerIdentity) === ((B = A.verifyOptions) === null || B === void 0 ? void 0 : B.checkServerIdentity);
      else return !1
    }
    ref() {
      var A;
      if (this.refcount === 0) this.caCertificateProvider.addCaCertificateListener(this.caCertificateUpdateListener), (A = this.identityCertificateProvider) === null || A === void 0 || A.addIdentityCertificateListener(this.identityCertificateUpdateListener);
      this.refcount += 1
    }
    unref() {
      var A;
      if (this.refcount -= 1, this.refcount === 0) this.caCertificateProvider.removeCaCertificateListener(this.caCertificateUpdateListener), (A = this.identityCertificateProvider) === null || A === void 0 || A.removeIdentityCertificateListener(this.identityCertificateUpdateListener)
    }
    _createSecureConnector(A, Q, B) {
      return this.ref(), new DOA.SecureConnectorImpl(this, A, Q, B !== null && B !== void 0 ? B : P41.CallCredentials.createEmpty())
    }
    maybeUpdateWatchers() {
      if (this.hasReceivedUpdates()) {
        for (let A of this.secureContextWatchers) A(this.getLatestSecureContext());
        this.secureContextWatchers = []
      }
    }
    handleCaCertificateUpdate(A) {
      this.latestCaUpdate = A, this.maybeUpdateWatchers()
    }
    handleIdentityCertitificateUpdate(A) {
      this.latestIdentityUpdate = A, this.maybeUpdateWatchers()
    }
    hasReceivedUpdates() {
      if (this.latestCaUpdate === void 0) return !1;
      if (this.identityCertificateProvider && this.latestIdentityUpdate === void 0) return !1;
      return !0
    }
    getSecureContext() {
      if (this.hasReceivedUpdates()) return Promise.resolve(this.getLatestSecureContext());
      else return new Promise((A) => {
        this.secureContextWatchers.push(A)
      })
    }
    getLatestSecureContext() {
      var A, Q;
      if (!this.latestCaUpdate) return null;
      if (this.identityCertificateProvider !== null && !this.latestIdentityUpdate) return null;
      try {
        return (0, HOA.createSecureContext)({
          ca: this.latestCaUpdate.caCertificate,
          key: (A = this.latestIdentityUpdate) === null || A === void 0 ? void 0 : A.privateKey,
          cert: (Q = this.latestIdentityUpdate) === null || Q === void 0 ? void 0 : Q.certificate,
          ciphers: F20.CIPHER_SUITES
        })
      } catch (B) {
        return (0, RN5.log)(TN5.LogVerbosity.ERROR, "Failed to createSecureContext with error " + B.message), null
      }
    }
  }
  DOA.SecureConnectorImpl = class {
    constructor(A, Q, B, G) {
      this.parent = A, this.channelTarget = Q, this.options = B, this.callCredentials = G
    }
    connect(A) {
      return new Promise((Q, B) => {
        let G = this.parent.getLatestSecureContext();
        if (!G) {
          B(Error("Failed to load credentials"));
          return
        }
        if (A.closed) B(Error("Socket closed while loading credentials"));
        let Z = CH2(G, this.parent.verifyOptions, this.channelTarget, this.options),
          I = Object.assign({
            socket: A
          }, Z),
          Y = () => {
            B(Error("Socket closed"))
          },
          J = (X) => {
            B(X)
          },
          W = (0, HOA.connect)(I, () => {
            var X;
            if (W.removeListener("close", Y), W.removeListener("error", J), ((X = this.parent.verifyOptions.rejectUnauthorized) !== null && X !== void 0 ? X : !0) && !W.authorized) {
              B(W.authorizationError);
              return
            }
            Q({
              socket: W,
              secure: !0
            })
          });
        W.once("close", Y), W.once("error", J)
      })
    }
    async waitForReady() {
      await this.parent.getSecureContext()
    }
    getCallCredentials() {
      return this.callCredentials
    }
    destroy() {
      this.parent.unref()
    }
  };

  function PN5(A, Q, B) {
    return new DOA(A, Q, B !== null && B !== void 0 ? B : {})
  }
  class T41 extends eYA {
    constructor(A, Q) {
      super();
      if (this.channelCredentials = A, this.callCredentials = Q, !A._isSecure()) throw Error("Cannot compose insecure credentials")
    }
    compose(A) {
      let Q = this.callCredentials.compose(A);
      return new T41(this.channelCredentials, Q)
    }
    _isSecure() {
      return !0
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof T41) return this.channelCredentials._equals(A.channelCredentials) && this.callCredentials._equals(A.callCredentials);
      else return !1
    }
    _createSecureConnector(A, Q, B) {
      let G = this.callCredentials.compose(B !== null && B !== void 0 ? B : P41.CallCredentials.createEmpty());
      return this.channelCredentials._createSecureConnector(A, Q, G)
    }
  }
})
// @from(Start 10577179, End 10579689)
li = z((wH2) => {
  Object.defineProperty(wH2, "__esModule", {
    value: !0
  });
  wH2.createChildChannelControlHelper = kN5;
  wH2.registerLoadBalancerType = yN5;
  wH2.registerDefaultLoadBalancerType = xN5;
  wH2.createLoadBalancer = vN5;
  wH2.isLoadBalancerNameRegistered = bN5;
  wH2.parseLoadBalancingConfig = $H2;
  wH2.getDefaultConfig = fN5;
  wH2.selectLbConfigFromList = hN5;
  var SN5 = zZ(),
    _N5 = E6();

  function kN5(A, Q) {
    var B, G, Z, I, Y, J, W, X, V, F;
    return {
      createSubchannel: (G = (B = Q.createSubchannel) === null || B === void 0 ? void 0 : B.bind(Q)) !== null && G !== void 0 ? G : A.createSubchannel.bind(A),
      updateState: (I = (Z = Q.updateState) === null || Z === void 0 ? void 0 : Z.bind(Q)) !== null && I !== void 0 ? I : A.updateState.bind(A),
      requestReresolution: (J = (Y = Q.requestReresolution) === null || Y === void 0 ? void 0 : Y.bind(Q)) !== null && J !== void 0 ? J : A.requestReresolution.bind(A),
      addChannelzChild: (X = (W = Q.addChannelzChild) === null || W === void 0 ? void 0 : W.bind(Q)) !== null && X !== void 0 ? X : A.addChannelzChild.bind(A),
      removeChannelzChild: (F = (V = Q.removeChannelzChild) === null || V === void 0 ? void 0 : V.bind(Q)) !== null && F !== void 0 ? F : A.removeChannelzChild.bind(A)
    }
  }
  var pi = {},
    COA = null;

  function yN5(A, Q, B) {
    pi[A] = {
      LoadBalancer: Q,
      LoadBalancingConfig: B
    }
  }

  function xN5(A) {
    COA = A
  }

  function vN5(A, Q) {
    let B = A.getLoadBalancerName();
    if (B in pi) return new pi[B].LoadBalancer(Q);
    else return null
  }

  function bN5(A) {
    return A in pi
  }

  function $H2(A) {
    let Q = Object.keys(A);
    if (Q.length !== 1) throw Error("Provided load balancing config has multiple conflicting entries");
    let B = Q[0];
    if (B in pi) try {
      return pi[B].LoadBalancingConfig.createFromJson(A[B])
    } catch (G) {
      throw Error(`${B}: ${G.message}`)
    } else throw Error(`Unrecognized load balancing config name ${B}`)
  }

  function fN5() {
    if (!COA) throw Error("No default load balancer type registered");
    return new pi[COA].LoadBalancingConfig
  }

  function hN5(A, Q = !1) {
    for (let B of A) try {
      return $H2(B)
    } catch (G) {
      (0, SN5.log)(_N5.LogVerbosity.DEBUG, "Config parsing failed with error", G.message);
      continue
    }
    if (Q)
      if (COA) return new pi[COA].LoadBalancingConfig;
      else return null;
    else return null
  }
})
// @from(Start 10579695, End 10589995)
D20 = z((LH2) => {
  Object.defineProperty(LH2, "__esModule", {
    value: !0
  });
  LH2.validateRetryThrottling = qH2;
  LH2.validateServiceConfig = NH2;
  LH2.extractAndSelectServiceConfig = BL5;
  var nN5 = UA("os"),
    j41 = E6(),
    S41 = /^\d+(\.\d{1,9})?s$/,
    aN5 = "node";

  function sN5(A) {
    if ("service" in A && A.service !== "") {
      if (typeof A.service !== "string") throw Error(`Invalid method config name: invalid service: expected type string, got ${typeof A.service}`);
      if ("method" in A && A.method !== "") {
        if (typeof A.method !== "string") throw Error(`Invalid method config name: invalid method: expected type string, got ${typeof A.service}`);
        return {
          service: A.service,
          method: A.method
        }
      } else return {
        service: A.service
      }
    } else {
      if ("method" in A && A.method !== void 0) throw Error("Invalid method config name: method set with empty or unset service");
      return {}
    }
  }

  function rN5(A) {
    if (!("maxAttempts" in A) || !Number.isInteger(A.maxAttempts) || A.maxAttempts < 2) throw Error("Invalid method config retry policy: maxAttempts must be an integer at least 2");
    if (!("initialBackoff" in A) || typeof A.initialBackoff !== "string" || !S41.test(A.initialBackoff)) throw Error("Invalid method config retry policy: initialBackoff must be a string consisting of a positive integer or decimal followed by s");
    if (!("maxBackoff" in A) || typeof A.maxBackoff !== "string" || !S41.test(A.maxBackoff)) throw Error("Invalid method config retry policy: maxBackoff must be a string consisting of a positive integer or decimal followed by s");
    if (!("backoffMultiplier" in A) || typeof A.backoffMultiplier !== "number" || A.backoffMultiplier <= 0) throw Error("Invalid method config retry policy: backoffMultiplier must be a number greater than 0");
    if (!(("retryableStatusCodes" in A) && Array.isArray(A.retryableStatusCodes))) throw Error("Invalid method config retry policy: retryableStatusCodes is required");
    if (A.retryableStatusCodes.length === 0) throw Error("Invalid method config retry policy: retryableStatusCodes must be non-empty");
    for (let Q of A.retryableStatusCodes)
      if (typeof Q === "number") {
        if (!Object.values(j41.Status).includes(Q)) throw Error("Invalid method config retry policy: retryableStatusCodes value not in status code range")
      } else if (typeof Q === "string") {
      if (!Object.values(j41.Status).includes(Q.toUpperCase())) throw Error("Invalid method config retry policy: retryableStatusCodes value not a status code name")
    } else throw Error("Invalid method config retry policy: retryableStatusCodes value must be a string or number");
    return {
      maxAttempts: A.maxAttempts,
      initialBackoff: A.initialBackoff,
      maxBackoff: A.maxBackoff,
      backoffMultiplier: A.backoffMultiplier,
      retryableStatusCodes: A.retryableStatusCodes
    }
  }

  function oN5(A) {
    if (!("maxAttempts" in A) || !Number.isInteger(A.maxAttempts) || A.maxAttempts < 2) throw Error("Invalid method config hedging policy: maxAttempts must be an integer at least 2");
    if ("hedgingDelay" in A && (typeof A.hedgingDelay !== "string" || !S41.test(A.hedgingDelay))) throw Error("Invalid method config hedging policy: hedgingDelay must be a string consisting of a positive integer followed by s");
    if ("nonFatalStatusCodes" in A && Array.isArray(A.nonFatalStatusCodes))
      for (let B of A.nonFatalStatusCodes)
        if (typeof B === "number") {
          if (!Object.values(j41.Status).includes(B)) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not in status code range")
        } else if (typeof B === "string") {
      if (!Object.values(j41.Status).includes(B.toUpperCase())) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not a status code name")
    } else throw Error("Invalid method config hedging policy: nonFatalStatusCodes value must be a string or number");
    let Q = {
      maxAttempts: A.maxAttempts
    };
    if (A.hedgingDelay) Q.hedgingDelay = A.hedgingDelay;
    if (A.nonFatalStatusCodes) Q.nonFatalStatusCodes = A.nonFatalStatusCodes;
    return Q
  }

  function tN5(A) {
    var Q;
    let B = {
      name: []
    };
    if (!("name" in A) || !Array.isArray(A.name)) throw Error("Invalid method config: invalid name array");
    for (let G of A.name) B.name.push(sN5(G));
    if ("waitForReady" in A) {
      if (typeof A.waitForReady !== "boolean") throw Error("Invalid method config: invalid waitForReady");
      B.waitForReady = A.waitForReady
    }
    if ("timeout" in A)
      if (typeof A.timeout === "object") {
        if (!("seconds" in A.timeout) || typeof A.timeout.seconds !== "number") throw Error("Invalid method config: invalid timeout.seconds");
        if (!("nanos" in A.timeout) || typeof A.timeout.nanos !== "number") throw Error("Invalid method config: invalid timeout.nanos");
        B.timeout = A.timeout
      } else if (typeof A.timeout === "string" && S41.test(A.timeout)) {
      let G = A.timeout.substring(0, A.timeout.length - 1).split(".");
      B.timeout = {
        seconds: G[0] | 0,
        nanos: ((Q = G[1]) !== null && Q !== void 0 ? Q : 0) | 0
      }
    } else throw Error("Invalid method config: invalid timeout");
    if ("maxRequestBytes" in A) {
      if (typeof A.maxRequestBytes !== "number") throw Error("Invalid method config: invalid maxRequestBytes");
      B.maxRequestBytes = A.maxRequestBytes
    }
    if ("maxResponseBytes" in A) {
      if (typeof A.maxResponseBytes !== "number") throw Error("Invalid method config: invalid maxRequestBytes");
      B.maxResponseBytes = A.maxResponseBytes
    }
    if ("retryPolicy" in A)
      if ("hedgingPolicy" in A) throw Error("Invalid method config: retryPolicy and hedgingPolicy cannot both be specified");
      else B.retryPolicy = rN5(A.retryPolicy);
    else if ("hedgingPolicy" in A) B.hedgingPolicy = oN5(A.hedgingPolicy);
    return B
  }

  function qH2(A) {
    if (!("maxTokens" in A) || typeof A.maxTokens !== "number" || A.maxTokens <= 0 || A.maxTokens > 1000) throw Error("Invalid retryThrottling: maxTokens must be a number in (0, 1000]");
    if (!("tokenRatio" in A) || typeof A.tokenRatio !== "number" || A.tokenRatio <= 0) throw Error("Invalid retryThrottling: tokenRatio must be a number greater than 0");
    return {
      maxTokens: +A.maxTokens.toFixed(3),
      tokenRatio: +A.tokenRatio.toFixed(3)
    }
  }

  function eN5(A) {
    if (!(typeof A === "object" && A !== null)) throw Error(`Invalid loadBalancingConfig: unexpected type ${typeof A}`);
    let Q = Object.keys(A);
    if (Q.length > 1) throw Error(`Invalid loadBalancingConfig: unexpected multiple keys ${Q}`);
    if (Q.length === 0) throw Error("Invalid loadBalancingConfig: load balancing policy name required");
    return {
      [Q[0]]: A[Q[0]]
    }
  }

  function NH2(A) {
    let Q = {
      loadBalancingConfig: [],
      methodConfig: []
    };
    if ("loadBalancingPolicy" in A)
      if (typeof A.loadBalancingPolicy === "string") Q.loadBalancingPolicy = A.loadBalancingPolicy;
      else throw Error("Invalid service config: invalid loadBalancingPolicy");
    if ("loadBalancingConfig" in A)
      if (Array.isArray(A.loadBalancingConfig))
        for (let G of A.loadBalancingConfig) Q.loadBalancingConfig.push(eN5(G));
      else throw Error("Invalid service config: invalid loadBalancingConfig");
    if ("methodConfig" in A) {
      if (Array.isArray(A.methodConfig))
        for (let G of A.methodConfig) Q.methodConfig.push(tN5(G))
    }
    if ("retryThrottling" in A) Q.retryThrottling = qH2(A.retryThrottling);
    let B = [];
    for (let G of Q.methodConfig)
      for (let Z of G.name) {
        for (let I of B)
          if (Z.service === I.service && Z.method === I.method) throw Error(`Invalid service config: duplicate name ${Z.service}/${Z.method}`);
        B.push(Z)
      }
    return Q
  }

  function AL5(A) {
    if (!("serviceConfig" in A)) throw Error("Invalid service config choice: missing service config");
    let Q = {
      serviceConfig: NH2(A.serviceConfig)
    };
    if ("clientLanguage" in A)
      if (Array.isArray(A.clientLanguage)) {
        Q.clientLanguage = [];
        for (let G of A.clientLanguage)
          if (typeof G === "string") Q.clientLanguage.push(G);
          else throw Error("Invalid service config choice: invalid clientLanguage")
      } else throw Error("Invalid service config choice: invalid clientLanguage");
    if ("clientHostname" in A)
      if (Array.isArray(A.clientHostname)) {
        Q.clientHostname = [];
        for (let G of A.clientHostname)
          if (typeof G === "string") Q.clientHostname.push(G);
          else throw Error("Invalid service config choice: invalid clientHostname")
      } else throw Error("Invalid service config choice: invalid clientHostname");
    if ("percentage" in A)
      if (typeof A.percentage === "number" && 0 <= A.percentage && A.percentage <= 100) Q.percentage = A.percentage;
      else throw Error("Invalid service config choice: invalid percentage");
    let B = ["clientLanguage", "percentage", "clientHostname", "serviceConfig"];
    for (let G in A)
      if (!B.includes(G)) throw Error(`Invalid service config choice: unexpected field ${G}`);
    return Q
  }

  function QL5(A, Q) {
    if (!Array.isArray(A)) throw Error("Invalid service config list");
    for (let B of A) {
      let G = AL5(B);
      if (typeof G.percentage === "number" && Q > G.percentage) continue;
      if (Array.isArray(G.clientHostname)) {
        let Z = !1;
        for (let I of G.clientHostname)
          if (I === nN5.hostname()) Z = !0;
        if (!Z) continue
      }
      if (Array.isArray(G.clientLanguage)) {
        let Z = !1;
        for (let I of G.clientLanguage)
          if (I === aN5) Z = !0;
        if (!Z) continue
      }
      return G.serviceConfig
    }
    throw Error("No matching service config found")
  }

  function BL5(A, Q) {
    for (let B of A)
      if (B.length > 0 && B[0].startsWith("grpc_config=")) {
        let G = B.join("").substring(12),
          Z = JSON.parse(G);
        return QL5(Z, Q)
      } return null
  }
})
// @from(Start 10590001, End 10590367)
mE = z((OH2) => {
  Object.defineProperty(OH2, "__esModule", {
    value: !0
  });
  OH2.ConnectivityState = void 0;
  var MH2;
  (function(A) {
    A[A.IDLE = 0] = "IDLE", A[A.CONNECTING = 1] = "CONNECTING", A[A.READY = 2] = "READY", A[A.TRANSIENT_FAILURE = 3] = "TRANSIENT_FAILURE", A[A.SHUTDOWN = 4] = "SHUTDOWN"
  })(MH2 || (OH2.ConnectivityState = MH2 = {}))
})
// @from(Start 10590373, End 10591740)
Ph = z((jH2) => {
  Object.defineProperty(jH2, "__esModule", {
    value: !0
  });
  jH2.QueuePicker = jH2.UnavailablePicker = jH2.PickResultType = void 0;
  var YL5 = YK(),
    JL5 = E6(),
    _41;
  (function(A) {
    A[A.COMPLETE = 0] = "COMPLETE", A[A.QUEUE = 1] = "QUEUE", A[A.TRANSIENT_FAILURE = 2] = "TRANSIENT_FAILURE", A[A.DROP = 3] = "DROP"
  })(_41 || (jH2.PickResultType = _41 = {}));
  class TH2 {
    constructor(A) {
      this.status = Object.assign({
        code: JL5.Status.UNAVAILABLE,
        details: "No connection established",
        metadata: new YL5.Metadata
      }, A)
    }
    pick(A) {
      return {
        pickResultType: _41.TRANSIENT_FAILURE,
        subchannel: null,
        status: this.status,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }
  jH2.UnavailablePicker = TH2;
  class PH2 {
    constructor(A, Q) {
      this.loadBalancer = A, this.childPicker = Q, this.calledExitIdle = !1
    }
    pick(A) {
      if (!this.calledExitIdle) process.nextTick(() => {
        this.loadBalancer.exitIdle()
      }), this.calledExitIdle = !0;
      if (this.childPicker) return this.childPicker.pick(A);
      else return {
        pickResultType: _41.QUEUE,
        subchannel: null,
        status: null,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }
  jH2.QueuePicker = PH2
})
// @from(Start 10591746, End 10594527)
QJA = z((_H2) => {
  Object.defineProperty(_H2, "__esModule", {
    value: !0
  });
  _H2.BackoffTimeout = void 0;
  var VL5 = E6(),
    FL5 = zZ(),
    KL5 = "backoff",
    DL5 = 1000,
    HL5 = 1.6,
    CL5 = 120000,
    EL5 = 0.2;

  function zL5(A, Q) {
    return Math.random() * (Q - A) + A
  }
  class k41 {
    constructor(A, Q) {
      if (this.callback = A, this.initialDelay = DL5, this.multiplier = HL5, this.maxDelay = CL5, this.jitter = EL5, this.running = !1, this.hasRef = !0, this.startTime = new Date, this.endTime = new Date, this.id = k41.getNextId(), Q) {
        if (Q.initialDelay) this.initialDelay = Q.initialDelay;
        if (Q.multiplier) this.multiplier = Q.multiplier;
        if (Q.jitter) this.jitter = Q.jitter;
        if (Q.maxDelay) this.maxDelay = Q.maxDelay
      }
      this.trace("constructed initialDelay=" + this.initialDelay + " multiplier=" + this.multiplier + " jitter=" + this.jitter + " maxDelay=" + this.maxDelay), this.nextDelay = this.initialDelay, this.timerId = setTimeout(() => {}, 0), clearTimeout(this.timerId)
    }
    static getNextId() {
      return this.nextId++
    }
    trace(A) {
      FL5.trace(VL5.LogVerbosity.DEBUG, KL5, "{" + this.id + "} " + A)
    }
    runTimer(A) {
      var Q, B;
      if (this.trace("runTimer(delay=" + A + ")"), this.endTime = this.startTime, this.endTime.setMilliseconds(this.endTime.getMilliseconds() + A), clearTimeout(this.timerId), this.timerId = setTimeout(() => {
          this.trace("timer fired"), this.running = !1, this.callback()
        }, A), !this.hasRef)(B = (Q = this.timerId).unref) === null || B === void 0 || B.call(Q)
    }
    runOnce() {
      this.trace("runOnce()"), this.running = !0, this.startTime = new Date, this.runTimer(this.nextDelay);
      let A = Math.min(this.nextDelay * this.multiplier, this.maxDelay),
        Q = A * this.jitter;
      this.nextDelay = A + zL5(-Q, Q)
    }
    stop() {
      this.trace("stop()"), clearTimeout(this.timerId), this.running = !1
    }
    reset() {
      if (this.trace("reset() running=" + this.running), this.nextDelay = this.initialDelay, this.running) {
        let A = new Date,
          Q = this.startTime;
        if (Q.setMilliseconds(Q.getMilliseconds() + this.nextDelay), clearTimeout(this.timerId), A < Q) this.runTimer(Q.getTime() - A.getTime());
        else this.running = !1
      }
    }
    isRunning() {
      return this.running
    }
    ref() {
      var A, Q;
      this.hasRef = !0, (Q = (A = this.timerId).ref) === null || Q === void 0 || Q.call(A)
    }
    unref() {
      var A, Q;
      this.hasRef = !1, (Q = (A = this.timerId).unref) === null || Q === void 0 || Q.call(A)
    }
    getEndTime() {
      return this.endTime
    }
  }
  _H2.BackoffTimeout = k41;
  k41.nextId = 0
})
// @from(Start 10594533, End 10597722)
y41 = z((xH2) => {
  Object.defineProperty(xH2, "__esModule", {
    value: !0
  });
  xH2.ChildLoadBalancerHandler = void 0;
  var UL5 = li(),
    $L5 = mE(),
    wL5 = "child_load_balancer_helper";
  class yH2 {
    constructor(A) {
      this.channelControlHelper = A, this.currentChild = null, this.pendingChild = null, this.latestConfig = null, this.ChildPolicyHelper = class {
        constructor(Q) {
          this.parent = Q, this.child = null
        }
        createSubchannel(Q, B) {
          return this.parent.channelControlHelper.createSubchannel(Q, B)
        }
        updateState(Q, B, G) {
          var Z;
          if (this.calledByPendingChild()) {
            if (Q === $L5.ConnectivityState.CONNECTING) return;
            (Z = this.parent.currentChild) === null || Z === void 0 || Z.destroy(), this.parent.currentChild = this.parent.pendingChild, this.parent.pendingChild = null
          } else if (!this.calledByCurrentChild()) return;
          this.parent.channelControlHelper.updateState(Q, B, G)
        }
        requestReresolution() {
          var Q;
          let B = (Q = this.parent.pendingChild) !== null && Q !== void 0 ? Q : this.parent.currentChild;
          if (this.child === B) this.parent.channelControlHelper.requestReresolution()
        }
        setChild(Q) {
          this.child = Q
        }
        addChannelzChild(Q) {
          this.parent.channelControlHelper.addChannelzChild(Q)
        }
        removeChannelzChild(Q) {
          this.parent.channelControlHelper.removeChannelzChild(Q)
        }
        calledByPendingChild() {
          return this.child === this.parent.pendingChild
        }
        calledByCurrentChild() {
          return this.child === this.parent.currentChild
        }
      }
    }
    configUpdateRequiresNewPolicyInstance(A, Q) {
      return A.getLoadBalancerName() !== Q.getLoadBalancerName()
    }
    updateAddressList(A, Q, B, G) {
      let Z;
      if (this.currentChild === null || this.latestConfig === null || this.configUpdateRequiresNewPolicyInstance(this.latestConfig, Q)) {
        let I = new this.ChildPolicyHelper(this),
          Y = (0, UL5.createLoadBalancer)(Q, I);
        if (I.setChild(Y), this.currentChild === null) this.currentChild = Y, Z = this.currentChild;
        else {
          if (this.pendingChild) this.pendingChild.destroy();
          this.pendingChild = Y, Z = this.pendingChild
        }
      } else if (this.pendingChild === null) Z = this.currentChild;
      else Z = this.pendingChild;
      return this.latestConfig = Q, Z.updateAddressList(A, Q, B, G)
    }
    exitIdle() {
      if (this.currentChild) {
        if (this.currentChild.exitIdle(), this.pendingChild) this.pendingChild.exitIdle()
      }
    }
    resetBackoff() {
      if (this.currentChild) {
        if (this.currentChild.resetBackoff(), this.pendingChild) this.pendingChild.resetBackoff()
      }
    }
    destroy() {
      if (this.currentChild) this.currentChild.destroy(), this.currentChild = null;
      if (this.pendingChild) this.pendingChild.destroy(), this.pendingChild = null
    }
    getTypeName() {
      return wL5
    }
  }
  xH2.ChildLoadBalancerHandler = yH2
})
// @from(Start 10597728, End 10604319)
mH2 = z((gH2) => {
  Object.defineProperty(gH2, "__esModule", {
    value: !0
  });
  gH2.ResolvingLoadBalancer = void 0;
  var qL5 = li(),
    NL5 = D20(),
    tU = mE(),
    bH2 = CP(),
    EOA = Ph(),
    LL5 = QJA(),
    H20 = E6(),
    ML5 = YK(),
    OL5 = zZ(),
    RL5 = E6(),
    TL5 = uE(),
    PL5 = y41(),
    jL5 = "resolving_load_balancer";

  function fH2(A) {
    OL5.trace(RL5.LogVerbosity.DEBUG, jL5, A)
  }
  var SL5 = ["SERVICE_AND_METHOD", "SERVICE", "EMPTY"];

  function _L5(A, Q, B, G) {
    for (let Z of B.name) switch (G) {
      case "EMPTY":
        if (!Z.service && !Z.method) return !0;
        break;
      case "SERVICE":
        if (Z.service === A && !Z.method) return !0;
        break;
      case "SERVICE_AND_METHOD":
        if (Z.service === A && Z.method === Q) return !0
    }
    return !1
  }

  function kL5(A, Q, B, G) {
    for (let Z of B)
      if (_L5(A, Q, Z, G)) return Z;
    return null
  }

  function yL5(A) {
    return {
      invoke(Q, B) {
        var G, Z;
        let I = Q.split("/").filter((W) => W.length > 0),
          Y = (G = I[0]) !== null && G !== void 0 ? G : "",
          J = (Z = I[1]) !== null && Z !== void 0 ? Z : "";
        if (A && A.methodConfig)
          for (let W of SL5) {
            let X = kL5(Y, J, A.methodConfig, W);
            if (X) return {
              methodConfig: X,
              pickInformation: {},
              status: H20.Status.OK,
              dynamicFilterFactories: []
            }
          }
        return {
          methodConfig: {
            name: []
          },
          pickInformation: {},
          status: H20.Status.OK,
          dynamicFilterFactories: []
        }
      },
      unref() {}
    }
  }
  class hH2 {
    constructor(A, Q, B, G, Z) {
      if (this.target = A, this.channelControlHelper = Q, this.channelOptions = B, this.onSuccessfulResolution = G, this.onFailedResolution = Z, this.latestChildState = tU.ConnectivityState.IDLE, this.latestChildPicker = new EOA.QueuePicker(this), this.latestChildErrorMessage = null, this.currentState = tU.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1, B["grpc.service_config"]) this.defaultServiceConfig = (0, NL5.validateServiceConfig)(JSON.parse(B["grpc.service_config"]));
      else this.defaultServiceConfig = {
        loadBalancingConfig: [],
        methodConfig: []
      };
      this.updateState(tU.ConnectivityState.IDLE, new EOA.QueuePicker(this), null), this.childLoadBalancer = new PL5.ChildLoadBalancerHandler({
        createSubchannel: Q.createSubchannel.bind(Q),
        requestReresolution: () => {
          if (this.backoffTimeout.isRunning()) fH2("requestReresolution delayed by backoff timer until " + this.backoffTimeout.getEndTime().toISOString()), this.continueResolving = !0;
          else this.updateResolution()
        },
        updateState: (Y, J, W) => {
          this.latestChildState = Y, this.latestChildPicker = J, this.latestChildErrorMessage = W, this.updateState(Y, J, W)
        },
        addChannelzChild: Q.addChannelzChild.bind(Q),
        removeChannelzChild: Q.removeChannelzChild.bind(Q)
      }), this.innerResolver = (0, bH2.createResolver)(A, this.handleResolverResult.bind(this), B);
      let I = {
        initialDelay: B["grpc.initial_reconnect_backoff_ms"],
        maxDelay: B["grpc.max_reconnect_backoff_ms"]
      };
      this.backoffTimeout = new LL5.BackoffTimeout(() => {
        if (this.continueResolving) this.updateResolution(), this.continueResolving = !1;
        else this.updateState(this.latestChildState, this.latestChildPicker, this.latestChildErrorMessage)
      }, I), this.backoffTimeout.unref()
    }
    handleResolverResult(A, Q, B, G) {
      var Z, I;
      this.backoffTimeout.stop(), this.backoffTimeout.reset();
      let Y = !0,
        J = null;
      if (B === null) J = this.defaultServiceConfig;
      else if (B.ok) J = B.value;
      else if (this.previousServiceConfig !== null) J = this.previousServiceConfig;
      else Y = !1, this.handleResolutionFailure(B.error);
      if (J !== null) {
        let W = (Z = J === null || J === void 0 ? void 0 : J.loadBalancingConfig) !== null && Z !== void 0 ? Z : [],
          X = (0, qL5.selectLbConfigFromList)(W, !0);
        if (X === null) Y = !1, this.handleResolutionFailure({
          code: H20.Status.UNAVAILABLE,
          details: "All load balancer options in service config are not compatible",
          metadata: new ML5.Metadata
        });
        else Y = this.childLoadBalancer.updateAddressList(A, X, Object.assign(Object.assign({}, this.channelOptions), Q), G)
      }
      if (Y) this.onSuccessfulResolution(J, (I = Q[bH2.CHANNEL_ARGS_CONFIG_SELECTOR_KEY]) !== null && I !== void 0 ? I : yL5(J));
      return Y
    }
    updateResolution() {
      if (this.innerResolver.updateResolution(), this.currentState === tU.ConnectivityState.IDLE) this.updateState(tU.ConnectivityState.CONNECTING, this.latestChildPicker, this.latestChildErrorMessage);
      this.backoffTimeout.runOnce()
    }
    updateState(A, Q, B) {
      if (fH2((0, TL5.uriToString)(this.target) + " " + tU.ConnectivityState[this.currentState] + " -> " + tU.ConnectivityState[A]), A === tU.ConnectivityState.IDLE) Q = new EOA.QueuePicker(this, Q);
      this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    handleResolutionFailure(A) {
      if (this.latestChildState === tU.ConnectivityState.IDLE) this.updateState(tU.ConnectivityState.TRANSIENT_FAILURE, new EOA.UnavailablePicker(A), A.details), this.onFailedResolution(A)
    }
    exitIdle() {
      if (this.currentState === tU.ConnectivityState.IDLE || this.currentState === tU.ConnectivityState.TRANSIENT_FAILURE)
        if (this.backoffTimeout.isRunning()) this.continueResolving = !0;
        else this.updateResolution();
      this.childLoadBalancer.exitIdle()
    }
    updateAddressList(A, Q) {
      throw Error("updateAddressList not supported on ResolvingLoadBalancer")
    }
    resetBackoff() {
      this.backoffTimeout.reset(), this.childLoadBalancer.resetBackoff()
    }
    destroy() {
      this.childLoadBalancer.destroy(), this.innerResolver.destroy(), this.backoffTimeout.reset(), this.backoffTimeout.stop(), this.latestChildState = tU.ConnectivityState.IDLE, this.latestChildPicker = new EOA.QueuePicker(this), this.currentState = tU.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1
    }
    getTypeName() {
      return "resolving_load_balancer"
    }
  }
  gH2.ResolvingLoadBalancer = hH2
})
// @from(Start 10604325, End 10605984)
pH2 = z((dH2) => {
  Object.defineProperty(dH2, "__esModule", {
    value: !0
  });
  dH2.recognizedOptions = void 0;
  dH2.channelOptionsEqual = xL5;
  dH2.recognizedOptions = {
    "grpc.ssl_target_name_override": !0,
    "grpc.primary_user_agent": !0,
    "grpc.secondary_user_agent": !0,
    "grpc.default_authority": !0,
    "grpc.keepalive_time_ms": !0,
    "grpc.keepalive_timeout_ms": !0,
    "grpc.keepalive_permit_without_calls": !0,
    "grpc.service_config": !0,
    "grpc.max_concurrent_streams": !0,
    "grpc.initial_reconnect_backoff_ms": !0,
    "grpc.max_reconnect_backoff_ms": !0,
    "grpc.use_local_subchannel_pool": !0,
    "grpc.max_send_message_length": !0,
    "grpc.max_receive_message_length": !0,
    "grpc.enable_http_proxy": !0,
    "grpc.enable_channelz": !0,
    "grpc.dns_min_time_between_resolutions_ms": !0,
    "grpc.enable_retries": !0,
    "grpc.per_rpc_retry_buffer_size": !0,
    "grpc.retry_buffer_size": !0,
    "grpc.max_connection_age_ms": !0,
    "grpc.max_connection_age_grace_ms": !0,
    "grpc-node.max_session_memory": !0,
    "grpc.service_config_disable_resolution": !0,
    "grpc.client_idle_timeout_ms": !0,
    "grpc-node.tls_enable_trace": !0,
    "grpc.lb.ring_hash.ring_size_cap": !0,
    "grpc-node.retry_max_attempts_limit": !0,
    "grpc-node.flow_control_window": !0,
    "grpc.server_call_metric_recording": !0
  };

  function xL5(A, Q) {
    let B = Object.keys(A).sort(),
      G = Object.keys(Q).sort();
    if (B.length !== G.length) return !1;
    for (let Z = 0; Z < B.length; Z += 1) {
      if (B[Z] !== G[Z]) return !1;
      if (A[B[Z]] !== Q[G[Z]]) return !1
    }
    return !0
  }
})
// @from(Start 10605990, End 10608934)
eU = z((sH2) => {
  Object.defineProperty(sH2, "__esModule", {
    value: !0
  });
  sH2.EndpointMap = void 0;
  sH2.isTcpSubchannelAddress = UOA;
  sH2.subchannelAddressEqual = x41;
  sH2.subchannelAddressToString = iH2;
  sH2.stringToSubchannelAddress = fL5;
  sH2.endpointEqual = hL5;
  sH2.endpointToString = gL5;
  sH2.endpointHasAddress = nH2;
  var lH2 = UA("net");

  function UOA(A) {
    return "port" in A
  }

  function x41(A, Q) {
    if (!A && !Q) return !0;
    if (!A || !Q) return !1;
    if (UOA(A)) return UOA(Q) && A.host === Q.host && A.port === Q.port;
    else return !UOA(Q) && A.path === Q.path
  }

  function iH2(A) {
    if (UOA(A))
      if ((0, lH2.isIPv6)(A.host)) return "[" + A.host + "]:" + A.port;
      else return A.host + ":" + A.port;
    else return A.path
  }
  var bL5 = 443;

  function fL5(A, Q) {
    if ((0, lH2.isIP)(A)) return {
      host: A,
      port: Q !== null && Q !== void 0 ? Q : bL5
    };
    else return {
      path: A
    }
  }

  function hL5(A, Q) {
    if (A.addresses.length !== Q.addresses.length) return !1;
    for (let B = 0; B < A.addresses.length; B++)
      if (!x41(A.addresses[B], Q.addresses[B])) return !1;
    return !0
  }

  function gL5(A) {
    return "[" + A.addresses.map(iH2).join(", ") + "]"
  }

  function nH2(A, Q) {
    for (let B of A.addresses)
      if (x41(B, Q)) return !0;
    return !1
  }

  function zOA(A, Q) {
    if (A.addresses.length !== Q.addresses.length) return !1;
    for (let B of A.addresses) {
      let G = !1;
      for (let Z of Q.addresses)
        if (x41(B, Z)) {
          G = !0;
          break
        } if (!G) return !1
    }
    return !0
  }
  class aH2 {
    constructor() {
      this.map = new Set
    }
    get size() {
      return this.map.size
    }
    getForSubchannelAddress(A) {
      for (let Q of this.map)
        if (nH2(Q.key, A)) return Q.value;
      return
    }
    deleteMissing(A) {
      let Q = [];
      for (let B of this.map) {
        let G = !1;
        for (let Z of A)
          if (zOA(Z, B.key)) G = !0;
        if (!G) Q.push(B.value), this.map.delete(B)
      }
      return Q
    }
    get(A) {
      for (let Q of this.map)
        if (zOA(A, Q.key)) return Q.value;
      return
    }
    set(A, Q) {
      for (let B of this.map)
        if (zOA(A, B.key)) {
          B.value = Q;
          return
        } this.map.add({
        key: A,
        value: Q
      })
    }
    delete(A) {
      for (let Q of this.map)
        if (zOA(A, Q.key)) {
          this.map.delete(Q);
          return
        }
    }
    has(A) {
      for (let Q of this.map)
        if (zOA(A, Q.key)) return !0;
      return !1
    }
    clear() {
      this.map.clear()
    }* keys() {
      for (let A of this.map) yield A.key
    }* values() {
      for (let A of this.map) yield A.value
    }* entries() {
      for (let A of this.map) yield [A.key, A.value]
    }
  }
  sH2.EndpointMap = aH2
})
// @from(Start 11084548, End 11099670)
Yq2 = z((Zq2) => {
  var C40;
  Object.defineProperty(Zq2, "__esModule", {
    value: !0
  });
  Zq2.OutlierDetectionLoadBalancer = Zq2.OutlierDetectionLoadBalancingConfig = void 0;
  Zq2.setup = zk5;
  var Jk5 = mE(),
    ew2 = E6(),
    W0A = aOA(),
    Aq2 = X40(),
    Wk5 = li(),
    Xk5 = y41(),
    Vk5 = Ph(),
    E40 = eU(),
    Fk5 = iOA(),
    Kk5 = zZ(),
    Dk5 = "outlier_detection";

  function XK(A) {
    Kk5.trace(ew2.LogVerbosity.DEBUG, Dk5, A)
  }
  var $40 = "outlier_detection",
    Hk5 = ((C40 = process.env.GRPC_EXPERIMENTAL_ENABLE_OUTLIER_DETECTION) !== null && C40 !== void 0 ? C40 : "true") === "true",
    Ck5 = {
      stdev_factor: 1900,
      enforcement_percentage: 100,
      minimum_hosts: 5,
      request_volume: 100
    },
    Ek5 = {
      threshold: 85,
      enforcement_percentage: 100,
      minimum_hosts: 5,
      request_volume: 50
    };

  function RJA(A, Q, B, G) {
    if (Q in A && A[Q] !== void 0 && typeof A[Q] !== B) {
      let Z = G ? `${G}.${Q}` : Q;
      throw Error(`outlier detection config ${Z} parse error: expected ${B}, got ${typeof A[Q]}`)
    }
  }

  function z40(A, Q, B) {
    let G = B ? `${B}.${Q}` : Q;
    if (Q in A && A[Q] !== void 0) {
      if (!(0, W0A.isDuration)(A[Q])) throw Error(`outlier detection config ${G} parse error: expected Duration, got ${typeof A[Q]}`);
      if (!(A[Q].seconds >= 0 && A[Q].seconds <= 315576000000 && A[Q].nanos >= 0 && A[Q].nanos <= 999999999)) throw Error(`outlier detection config ${G} parse error: values out of range for non-negative Duaration`)
    }
  }

  function g81(A, Q, B) {
    let G = B ? `${B}.${Q}` : Q;
    if (RJA(A, Q, "number", B), Q in A && A[Q] !== void 0 && !(A[Q] >= 0 && A[Q] <= 100)) throw Error(`outlier detection config ${G} parse error: value out of range for percentage (0-100)`)
  }
  class ARA {
    constructor(A, Q, B, G, Z, I, Y) {
      if (this.childPolicy = Y, Y.getLoadBalancerName() === "pick_first") throw Error("outlier_detection LB policy cannot have a pick_first child policy");
      this.intervalMs = A !== null && A !== void 0 ? A : 1e4, this.baseEjectionTimeMs = Q !== null && Q !== void 0 ? Q : 30000, this.maxEjectionTimeMs = B !== null && B !== void 0 ? B : 300000, this.maxEjectionPercent = G !== null && G !== void 0 ? G : 10, this.successRateEjection = Z ? Object.assign(Object.assign({}, Ck5), Z) : null, this.failurePercentageEjection = I ? Object.assign(Object.assign({}, Ek5), I) : null
    }
    getLoadBalancerName() {
      return $40
    }
    toJsonObject() {
      var A, Q;
      return {
        outlier_detection: {
          interval: (0, W0A.msToDuration)(this.intervalMs),
          base_ejection_time: (0, W0A.msToDuration)(this.baseEjectionTimeMs),
          max_ejection_time: (0, W0A.msToDuration)(this.maxEjectionTimeMs),
          max_ejection_percent: this.maxEjectionPercent,
          success_rate_ejection: (A = this.successRateEjection) !== null && A !== void 0 ? A : void 0,
          failure_percentage_ejection: (Q = this.failurePercentageEjection) !== null && Q !== void 0 ? Q : void 0,
          child_policy: [this.childPolicy.toJsonObject()]
        }
      }
    }
    getIntervalMs() {
      return this.intervalMs
    }
    getBaseEjectionTimeMs() {
      return this.baseEjectionTimeMs
    }
    getMaxEjectionTimeMs() {
      return this.maxEjectionTimeMs
    }
    getMaxEjectionPercent() {
      return this.maxEjectionPercent
    }
    getSuccessRateEjectionConfig() {
      return this.successRateEjection
    }
    getFailurePercentageEjectionConfig() {
      return this.failurePercentageEjection
    }
    getChildPolicy() {
      return this.childPolicy
    }
    static createFromJson(A) {
      var Q;
      if (z40(A, "interval"), z40(A, "base_ejection_time"), z40(A, "max_ejection_time"), g81(A, "max_ejection_percent"), "success_rate_ejection" in A && A.success_rate_ejection !== void 0) {
        if (typeof A.success_rate_ejection !== "object") throw Error("outlier detection config success_rate_ejection must be an object");
        RJA(A.success_rate_ejection, "stdev_factor", "number", "success_rate_ejection"), g81(A.success_rate_ejection, "enforcement_percentage", "success_rate_ejection"), RJA(A.success_rate_ejection, "minimum_hosts", "number", "success_rate_ejection"), RJA(A.success_rate_ejection, "request_volume", "number", "success_rate_ejection")
      }
      if ("failure_percentage_ejection" in A && A.failure_percentage_ejection !== void 0) {
        if (typeof A.failure_percentage_ejection !== "object") throw Error("outlier detection config failure_percentage_ejection must be an object");
        g81(A.failure_percentage_ejection, "threshold", "failure_percentage_ejection"), g81(A.failure_percentage_ejection, "enforcement_percentage", "failure_percentage_ejection"), RJA(A.failure_percentage_ejection, "minimum_hosts", "number", "failure_percentage_ejection"), RJA(A.failure_percentage_ejection, "request_volume", "number", "failure_percentage_ejection")
      }
      if (!("child_policy" in A) || !Array.isArray(A.child_policy)) throw Error("outlier detection config child_policy must be an array");
      let B = (0, Wk5.selectLbConfigFromList)(A.child_policy);
      if (!B) throw Error("outlier detection config child_policy: no valid recognized policy found");
      return new ARA(A.interval ? (0, W0A.durationToMs)(A.interval) : null, A.base_ejection_time ? (0, W0A.durationToMs)(A.base_ejection_time) : null, A.max_ejection_time ? (0, W0A.durationToMs)(A.max_ejection_time) : null, (Q = A.max_ejection_percent) !== null && Q !== void 0 ? Q : null, A.success_rate_ejection, A.failure_percentage_ejection, B)
    }
  }
  Zq2.OutlierDetectionLoadBalancingConfig = ARA;
  class Qq2 extends Fk5.BaseSubchannelWrapper {
    constructor(A, Q) {
      super(A);
      this.mapEntry = Q, this.refCount = 0
    }
    ref() {
      this.child.ref(), this.refCount += 1
    }
    unref() {
      if (this.child.unref(), this.refCount -= 1, this.refCount <= 0) {
        if (this.mapEntry) {
          let A = this.mapEntry.subchannelWrappers.indexOf(this);
          if (A >= 0) this.mapEntry.subchannelWrappers.splice(A, 1)
        }
      }
    }
    eject() {
      this.setHealthy(!1)
    }
    uneject() {
      this.setHealthy(!0)
    }
    getMapEntry() {
      return this.mapEntry
    }
    getWrappedSubchannel() {
      return this.child
    }
  }

  function U40() {
    return {
      success: 0,
      failure: 0
    }
  }
  class Bq2 {
    constructor() {
      this.activeBucket = U40(), this.inactiveBucket = U40()
    }
    addSuccess() {
      this.activeBucket.success += 1
    }
    addFailure() {
      this.activeBucket.failure += 1
    }
    switchBuckets() {
      this.inactiveBucket = this.activeBucket, this.activeBucket = U40()
    }
    getLastSuccesses() {
      return this.inactiveBucket.success
    }
    getLastFailures() {
      return this.inactiveBucket.failure
    }
  }
  class Gq2 {
    constructor(A, Q) {
      this.wrappedPicker = A, this.countCalls = Q
    }
    pick(A) {
      let Q = this.wrappedPicker.pick(A);
      if (Q.pickResultType === Vk5.PickResultType.COMPLETE) {
        let B = Q.subchannel,
          G = B.getMapEntry();
        if (G) {
          let Z = Q.onCallEnded;
          if (this.countCalls) Z = (I, Y, J) => {
            var W;
            if (I === ew2.Status.OK) G.counter.addSuccess();
            else G.counter.addFailure();
            (W = Q.onCallEnded) === null || W === void 0 || W.call(Q, I, Y, J)
          };
          return Object.assign(Object.assign({}, Q), {
            subchannel: B.getWrappedSubchannel(),
            onCallEnded: Z
          })
        } else return Object.assign(Object.assign({}, Q), {
          subchannel: B.getWrappedSubchannel()
        })
      } else return Q
    }
  }
  class w40 {
    constructor(A) {
      this.entryMap = new E40.EndpointMap, this.latestConfig = null, this.timerStartTime = null, this.childBalancer = new Xk5.ChildLoadBalancerHandler((0, Aq2.createChildChannelControlHelper)(A, {
        createSubchannel: (Q, B) => {
          let G = A.createSubchannel(Q, B),
            Z = this.entryMap.getForSubchannelAddress(Q),
            I = new Qq2(G, Z);
          if ((Z === null || Z === void 0 ? void 0 : Z.currentEjectionTimestamp) !== null) I.eject();
          return Z === null || Z === void 0 || Z.subchannelWrappers.push(I), I
        },
        updateState: (Q, B, G) => {
          if (Q === Jk5.ConnectivityState.READY) A.updateState(Q, new Gq2(B, this.isCountingEnabled()), G);
          else A.updateState(Q, B, G)
        }
      })), this.ejectionTimer = setInterval(() => {}, 0), clearInterval(this.ejectionTimer)
    }
    isCountingEnabled() {
      return this.latestConfig !== null && (this.latestConfig.getSuccessRateEjectionConfig() !== null || this.latestConfig.getFailurePercentageEjectionConfig() !== null)
    }
    getCurrentEjectionPercent() {
      let A = 0;
      for (let Q of this.entryMap.values())
        if (Q.currentEjectionTimestamp !== null) A += 1;
      return A * 100 / this.entryMap.size
    }
    runSuccessRateCheck(A) {
      if (!this.latestConfig) return;
      let Q = this.latestConfig.getSuccessRateEjectionConfig();
      if (!Q) return;
      XK("Running success rate check");
      let B = Q.request_volume,
        G = 0,
        Z = [];
      for (let [V, F] of this.entryMap.entries()) {
        let K = F.counter.getLastSuccesses(),
          D = F.counter.getLastFailures();
        if (XK("Stats for " + (0, E40.endpointToString)(V) + ": successes=" + K + " failures=" + D + " targetRequestVolume=" + B), K + D >= B) G += 1, Z.push(K / (K + D))
      }
      if (XK("Found " + G + " success rate candidates; currentEjectionPercent=" + this.getCurrentEjectionPercent() + " successRates=[" + Z + "]"), G < Q.minimum_hosts) return;
      let I = Z.reduce((V, F) => V + F) / Z.length,
        Y = 0;
      for (let V of Z) {
        let F = V - I;
        Y += F * F
      }
      let J = Y / Z.length,
        W = Math.sqrt(J),
        X = I - W * (Q.stdev_factor / 1000);
      XK("stdev=" + W + " ejectionThreshold=" + X);
      for (let [V, F] of this.entryMap.entries()) {
        if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
        let K = F.counter.getLastSuccesses(),
          D = F.counter.getLastFailures();
        if (K + D < B) continue;
        let H = K / (K + D);
        if (XK("Checking candidate " + V + " successRate=" + H), H < X) {
          let C = Math.random() * 100;
          if (XK("Candidate " + V + " randomNumber=" + C + " enforcement_percentage=" + Q.enforcement_percentage), C < Q.enforcement_percentage) XK("Ejecting candidate " + V), this.eject(F, A)
        }
      }
    }
    runFailurePercentageCheck(A) {
      if (!this.latestConfig) return;
      let Q = this.latestConfig.getFailurePercentageEjectionConfig();
      if (!Q) return;
      XK("Running failure percentage check. threshold=" + Q.threshold + " request volume threshold=" + Q.request_volume);
      let B = 0;
      for (let G of this.entryMap.values()) {
        let Z = G.counter.getLastSuccesses(),
          I = G.counter.getLastFailures();
        if (Z + I >= Q.request_volume) B += 1
      }
      if (B < Q.minimum_hosts) return;
      for (let [G, Z] of this.entryMap.entries()) {
        if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
        let I = Z.counter.getLastSuccesses(),
          Y = Z.counter.getLastFailures();
        if (XK("Candidate successes=" + I + " failures=" + Y), I + Y < Q.request_volume) continue;
        if (Y * 100 / (Y + I) > Q.threshold) {
          let W = Math.random() * 100;
          if (XK("Candidate " + G + " randomNumber=" + W + " enforcement_percentage=" + Q.enforcement_percentage), W < Q.enforcement_percentage) XK("Ejecting candidate " + G), this.eject(Z, A)
        }
      }
    }
    eject(A, Q) {
      A.currentEjectionTimestamp = new Date, A.ejectionTimeMultiplier += 1;
      for (let B of A.subchannelWrappers) B.eject()
    }
    uneject(A) {
      A.currentEjectionTimestamp = null;
      for (let Q of A.subchannelWrappers) Q.uneject()
    }
    switchAllBuckets() {
      for (let A of this.entryMap.values()) A.counter.switchBuckets()
    }
    startTimer(A) {
      var Q, B;
      this.ejectionTimer = setTimeout(() => this.runChecks(), A), (B = (Q = this.ejectionTimer).unref) === null || B === void 0 || B.call(Q)
    }
    runChecks() {
      let A = new Date;
      if (XK("Ejection timer running"), this.switchAllBuckets(), !this.latestConfig) return;
      this.timerStartTime = A, this.startTimer(this.latestConfig.getIntervalMs()), this.runSuccessRateCheck(A), this.runFailurePercentageCheck(A);
      for (let [Q, B] of this.entryMap.entries())
        if (B.currentEjectionTimestamp === null) {
          if (B.ejectionTimeMultiplier > 0) B.ejectionTimeMultiplier -= 1
        } else {
          let G = this.latestConfig.getBaseEjectionTimeMs(),
            Z = this.latestConfig.getMaxEjectionTimeMs(),
            I = new Date(B.currentEjectionTimestamp.getTime());
          if (I.setMilliseconds(I.getMilliseconds() + Math.min(G * B.ejectionTimeMultiplier, Math.max(G, Z))), I < new Date) XK("Unejecting " + Q), this.uneject(B)
        }
    }
    updateAddressList(A, Q, B, G) {
      if (!(Q instanceof ARA)) return !1;
      if (XK("Received update with config: " + JSON.stringify(Q.toJsonObject(), void 0, 2)), A.ok) {
        for (let I of A.value)
          if (!this.entryMap.has(I)) XK("Adding map entry for " + (0, E40.endpointToString)(I)), this.entryMap.set(I, {
            counter: new Bq2,
            currentEjectionTimestamp: null,
            ejectionTimeMultiplier: 0,
            subchannelWrappers: []
          });
        this.entryMap.deleteMissing(A.value)
      }
      let Z = Q.getChildPolicy();
      if (this.childBalancer.updateAddressList(A, Z, B, G), Q.getSuccessRateEjectionConfig() || Q.getFailurePercentageEjectionConfig())
        if (this.timerStartTime) {
          XK("Previous timer existed. Replacing timer"), clearTimeout(this.ejectionTimer);
          let I = Q.getIntervalMs() - (new Date().getTime() - this.timerStartTime.getTime());
          this.startTimer(I)
        } else XK("Starting new timer"), this.timerStartTime = new Date, this.startTimer(Q.getIntervalMs()), this.switchAllBuckets();
      else {
        XK("Counting disabled. Cancelling timer."), this.timerStartTime = null, clearTimeout(this.ejectionTimer);
        for (let I of this.entryMap.values()) this.uneject(I), I.ejectionTimeMultiplier = 0
      }
      return this.latestConfig = Q, !0
    }
    exitIdle() {
      this.childBalancer.exitIdle()
    }
    resetBackoff() {
      this.childBalancer.resetBackoff()
    }
    destroy() {
      clearTimeout(this.ejectionTimer), this.childBalancer.destroy()
    }
    getTypeName() {
      return $40
    }
  }
  Zq2.OutlierDetectionLoadBalancer = w40;

  function zk5() {
    if (Hk5)(0, Aq2.registerLoadBalancerType)($40, w40, ARA)
  }
})
// @from(Start 11099676, End 11101149)
Vq2 = z((Wq2) => {
  Object.defineProperty(Wq2, "__esModule", {
    value: !0
  });
  Wq2.PriorityQueue = void 0;
  var TJA = 0,
    q40 = (A) => Math.floor(A / 2),
    u81 = (A) => A * 2 + 1,
    QRA = (A) => A * 2 + 2;
  class Jq2 {
    constructor(A = (Q, B) => Q > B) {
      this.comparator = A, this.heap = []
    }
    size() {
      return this.heap.length
    }
    isEmpty() {
      return this.size() == 0
    }
    peek() {
      return this.heap[TJA]
    }
    push(...A) {
      return A.forEach((Q) => {
        this.heap.push(Q), this.siftUp()
      }), this.size()
    }
    pop() {
      let A = this.peek(),
        Q = this.size() - 1;
      if (Q > TJA) this.swap(TJA, Q);
      return this.heap.pop(), this.siftDown(), A
    }
    replace(A) {
      let Q = this.peek();
      return this.heap[TJA] = A, this.siftDown(), Q
    }
    greater(A, Q) {
      return this.comparator(this.heap[A], this.heap[Q])
    }
    swap(A, Q) {
      [this.heap[A], this.heap[Q]] = [this.heap[Q], this.heap[A]]
    }
    siftUp() {
      let A = this.size() - 1;
      while (A > TJA && this.greater(A, q40(A))) this.swap(A, q40(A)), A = q40(A)
    }
    siftDown() {
      let A = TJA;
      while (u81(A) < this.size() && this.greater(u81(A), A) || QRA(A) < this.size() && this.greater(QRA(A), A)) {
        let Q = QRA(A) < this.size() && this.greater(QRA(A), u81(A)) ? QRA(A) : u81(A);
        this.swap(A, Q), A = Q
      }
    }
  }
  Wq2.PriorityQueue = Jq2
})
// @from(Start 11101155, End 11111886)
$q2 = z((zq2) => {
  Object.defineProperty(zq2, "__esModule", {
    value: !0
  });
  zq2.WeightedRoundRobinLoadBalancingConfig = void 0;
  zq2.setup = Sk5;
  var VK = mE(),
    wk5 = E6(),
    Oq = aOA(),
    Dq2 = li(),
    qk5 = oOA(),
    Nk5 = zZ(),
    Hq2 = j81(),
    PJA = Ph(),
    Lk5 = Vq2(),
    Fq2 = eU(),
    Mk5 = "weighted_round_robin";

  function N40(A) {
    Nk5.trace(wk5.LogVerbosity.DEBUG, Mk5, A)
  }
  var L40 = "weighted_round_robin",
    Ok5 = 1e4,
    Rk5 = 1e4,
    Tk5 = 180000,
    Pk5 = 1000,
    jk5 = 1;

  function Kq2(A, Q, B) {
    if (Q in A && A[Q] !== void 0 && typeof A[Q] !== B) throw Error(`weighted round robin config ${Q} parse error: expected ${B}, got ${typeof A[Q]}`)
  }

  function m81(A, Q) {
    if (Q in A && A[Q] !== void 0 && A[Q] !== null) {
      let B;
      if ((0, Oq.isDuration)(A[Q])) B = A[Q];
      else if ((0, Oq.isDurationMessage)(A[Q])) B = (0, Oq.durationMessageToDuration)(A[Q]);
      else if (typeof A[Q] === "string") {
        let G = (0, Oq.parseDuration)(A[Q]);
        if (!G) throw Error(`weighted round robin config ${Q}: failed to parse duration string ${A[Q]}`);
        B = G
      } else throw Error(`weighted round robin config ${Q}: expected duration, got ${typeof A[Q]}`);
      return (0, Oq.durationToMs)(B)
    }
    return null
  }
  class BRA {
    constructor(A, Q, B, G, Z, I) {
      this.enableOobLoadReport = A !== null && A !== void 0 ? A : !1, this.oobLoadReportingPeriodMs = Q !== null && Q !== void 0 ? Q : Ok5, this.blackoutPeriodMs = B !== null && B !== void 0 ? B : Rk5, this.weightExpirationPeriodMs = G !== null && G !== void 0 ? G : Tk5, this.weightUpdatePeriodMs = Math.max(Z !== null && Z !== void 0 ? Z : Pk5, 100), this.errorUtilizationPenalty = I !== null && I !== void 0 ? I : jk5
    }
    getLoadBalancerName() {
      return L40
    }
    toJsonObject() {
      return {
        enable_oob_load_report: this.enableOobLoadReport,
        oob_load_reporting_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.oobLoadReportingPeriodMs)),
        blackout_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.blackoutPeriodMs)),
        weight_expiration_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.weightExpirationPeriodMs)),
        weight_update_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.weightUpdatePeriodMs)),
        error_utilization_penalty: this.errorUtilizationPenalty
      }
    }
    static createFromJson(A) {
      if (Kq2(A, "enable_oob_load_report", "boolean"), Kq2(A, "error_utilization_penalty", "number"), A.error_utilization_penalty < 0) throw Error("weighted round robin config error_utilization_penalty < 0");
      return new BRA(A.enable_oob_load_report, m81(A, "oob_load_reporting_period"), m81(A, "blackout_period"), m81(A, "weight_expiration_period"), m81(A, "weight_update_period"), A.error_utilization_penalty)
    }
    getEnableOobLoadReport() {
      return this.enableOobLoadReport
    }
    getOobLoadReportingPeriodMs() {
      return this.oobLoadReportingPeriodMs
    }
    getBlackoutPeriodMs() {
      return this.blackoutPeriodMs
    }
    getWeightExpirationPeriodMs() {
      return this.weightExpirationPeriodMs
    }
    getWeightUpdatePeriodMs() {
      return this.weightUpdatePeriodMs
    }
    getErrorUtilizationPenalty() {
      return this.errorUtilizationPenalty
    }
  }
  zq2.WeightedRoundRobinLoadBalancingConfig = BRA;
  class Cq2 {
    constructor(A, Q) {
      this.metricsHandler = Q, this.queue = new Lk5.PriorityQueue((Z, I) => Z.deadline < I.deadline);
      let B = A.filter((Z) => Z.weight > 0),
        G;
      if (B.length < 2) G = 1;
      else {
        let Z = 0;
        for (let {
            weight: I
          }
          of B) Z += I;
        G = Z / B.length
      }
      for (let Z of A) {
        let I = Z.weight > 0 ? 1 / Z.weight : G;
        this.queue.push({
          endpointName: Z.endpointName,
          picker: Z.picker,
          period: I,
          deadline: Math.random() * I
        })
      }
    }
    pick(A) {
      let Q = this.queue.pop();
      this.queue.push(Object.assign(Object.assign({}, Q), {
        deadline: Q.deadline + Q.period
      }));
      let B = Q.picker.pick(A);
      if (B.pickResultType === PJA.PickResultType.COMPLETE)
        if (this.metricsHandler) return Object.assign(Object.assign({}, B), {
          onCallEnded: (0, Hq2.createMetricsReader)((G) => this.metricsHandler(G, Q.endpointName), B.onCallEnded)
        });
        else {
          let G = B.subchannel;
          return Object.assign(Object.assign({}, B), {
            subchannel: G.getWrappedSubchannel()
          })
        }
      else return B
    }
  }
  class Eq2 {
    constructor(A) {
      this.channelControlHelper = A, this.latestConfig = null, this.children = new Map, this.currentState = VK.ConnectivityState.IDLE, this.updatesPaused = !1, this.lastError = null, this.weightUpdateTimer = null
    }
    countChildrenWithState(A) {
      let Q = 0;
      for (let B of this.children.values())
        if (B.child.getConnectivityState() === A) Q += 1;
      return Q
    }
    updateWeight(A, Q) {
      var B, G;
      let {
        rps_fractional: Z,
        application_utilization: I
      } = Q;
      if (I > 0 && Z > 0) I += Q.eps / Z * ((G = (B = this.latestConfig) === null || B === void 0 ? void 0 : B.getErrorUtilizationPenalty()) !== null && G !== void 0 ? G : 0);
      let Y = I === 0 ? 0 : Z / I;
      if (Y === 0) return;
      let J = new Date;
      if (A.nonEmptySince === null) A.nonEmptySince = J;
      A.lastUpdated = J, A.weight = Y
    }
    getWeight(A) {
      if (!this.latestConfig) return 0;
      let Q = new Date().getTime();
      if (Q - A.lastUpdated.getTime() >= this.latestConfig.getWeightExpirationPeriodMs()) return A.nonEmptySince = null, 0;
      let B = this.latestConfig.getBlackoutPeriodMs();
      if (B > 0 && (A.nonEmptySince === null || Q - A.nonEmptySince.getTime() < B)) return 0;
      return A.weight
    }
    calculateAndUpdateState() {
      if (this.updatesPaused || !this.latestConfig) return;
      if (this.countChildrenWithState(VK.ConnectivityState.READY) > 0) {
        let A = [];
        for (let [B, G] of this.children) {
          if (G.child.getConnectivityState() !== VK.ConnectivityState.READY) continue;
          A.push({
            endpointName: B,
            picker: G.child.getPicker(),
            weight: this.getWeight(G)
          })
        }
        N40("Created picker with weights: " + A.map((B) => B.endpointName + ":" + B.weight).join(","));
        let Q;
        if (!this.latestConfig.getEnableOobLoadReport()) Q = (B, G) => {
          let Z = this.children.get(G);
          if (Z) this.updateWeight(Z, B)
        };
        else Q = null;
        this.updateState(VK.ConnectivityState.READY, new Cq2(A, Q), null)
      } else if (this.countChildrenWithState(VK.ConnectivityState.CONNECTING) > 0) this.updateState(VK.ConnectivityState.CONNECTING, new PJA.QueuePicker(this), null);
      else if (this.countChildrenWithState(VK.ConnectivityState.TRANSIENT_FAILURE) > 0) {
        let A = `weighted_round_robin: No connection established. Last error: ${this.lastError}`;
        this.updateState(VK.ConnectivityState.TRANSIENT_FAILURE, new PJA.UnavailablePicker({
          details: A
        }), A)
      } else this.updateState(VK.ConnectivityState.IDLE, new PJA.QueuePicker(this), null);
      for (let {
          child: A
        }
        of this.children.values())
        if (A.getConnectivityState() === VK.ConnectivityState.IDLE) A.exitIdle()
    }
    updateState(A, Q, B) {
      N40(VK.ConnectivityState[this.currentState] + " -> " + VK.ConnectivityState[A]), this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    updateAddressList(A, Q, B, G) {
      var Z, I;
      if (!(Q instanceof BRA)) return !1;
      if (!A.ok) {
        if (this.children.size === 0) this.updateState(VK.ConnectivityState.TRANSIENT_FAILURE, new PJA.UnavailablePicker(A.error), A.error.details);
        return !0
      }
      if (A.value.length === 0) {
        let W = `No addresses resolved. Resolution note: ${G}`;
        return this.updateState(VK.ConnectivityState.TRANSIENT_FAILURE, new PJA.UnavailablePicker({
          details: W
        }), W), !1
      }
      N40("Connect to endpoint list " + A.value.map(Fq2.endpointToString));
      let Y = new Date,
        J = new Set;
      this.updatesPaused = !0, this.latestConfig = Q;
      for (let W of A.value) {
        let X = (0, Fq2.endpointToString)(W);
        J.add(X);
        let V = this.children.get(X);
        if (!V) V = {
          child: new qk5.LeafLoadBalancer(W, (0, Dq2.createChildChannelControlHelper)(this.channelControlHelper, {
            updateState: (F, K, D) => {
              if (this.currentState === VK.ConnectivityState.READY && F !== VK.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
              if (F === VK.ConnectivityState.READY) V.nonEmptySince = null;
              if (D) this.lastError = D;
              this.calculateAndUpdateState()
            },
            createSubchannel: (F, K) => {
              let D = this.channelControlHelper.createSubchannel(F, K);
              if (V === null || V === void 0 ? void 0 : V.oobMetricsListener) return new Hq2.OrcaOobMetricsSubchannelWrapper(D, V.oobMetricsListener, this.latestConfig.getOobLoadReportingPeriodMs());
              else return D
            }
          }), B, G),
          lastUpdated: Y,
          nonEmptySince: null,
          weight: 0,
          oobMetricsListener: null
        }, this.children.set(X, V);
        if (Q.getEnableOobLoadReport()) V.oobMetricsListener = (F) => {
          this.updateWeight(V, F)
        };
        else V.oobMetricsListener = null
      }
      for (let [W, X] of this.children)
        if (J.has(W)) X.child.startConnecting();
        else X.child.destroy(), this.children.delete(W);
      if (this.updatesPaused = !1, this.calculateAndUpdateState(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer);
      return this.weightUpdateTimer = (I = (Z = setInterval(() => {
        if (this.currentState === VK.ConnectivityState.READY) this.calculateAndUpdateState()
      }, Q.getWeightUpdatePeriodMs())).unref) === null || I === void 0 ? void 0 : I.call(Z), !0
    }
    exitIdle() {}
    resetBackoff() {}
    destroy() {
      for (let A of this.children.values()) A.child.destroy();
      if (this.children.clear(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer)
    }
    getTypeName() {
      return L40
    }
  }

  function Sk5() {
    (0, Dq2.registerLoadBalancerType)(L40, Eq2, BRA)
  }
})
// @from(Start 11111892, End 11118500)
GRA = z((zG) => {
  Object.defineProperty(zG, "__esModule", {
    value: !0
  });
  zG.experimental = zG.ServerMetricRecorder = zG.ServerInterceptingCall = zG.ResponderBuilder = zG.ServerListenerBuilder = zG.addAdminServicesToServer = zG.getChannelzHandlers = zG.getChannelzServiceDefinition = zG.InterceptorConfigurationError = zG.InterceptingCall = zG.RequesterBuilder = zG.ListenerBuilder = zG.StatusBuilder = zG.getClientChannel = zG.ServerCredentials = zG.Server = zG.setLogVerbosity = zG.setLogger = zG.load = zG.loadObject = zG.CallCredentials = zG.ChannelCredentials = zG.waitForClientReady = zG.closeClient = zG.Channel = zG.makeGenericClientConstructor = zG.makeClientConstructor = zG.loadPackageDefinition = zG.Client = zG.compressionAlgorithms = zG.propagate = zG.connectivityState = zG.status = zG.logVerbosity = zG.Metadata = zG.credentials = void 0;
  var d81 = O41();
  Object.defineProperty(zG, "CallCredentials", {
    enumerable: !0,
    get: function() {
      return d81.CallCredentials
    }
  });
  var kk5 = N20();
  Object.defineProperty(zG, "Channel", {
    enumerable: !0,
    get: function() {
      return kk5.ChannelImplementation
    }
  });
  var yk5 = w90();
  Object.defineProperty(zG, "compressionAlgorithms", {
    enumerable: !0,
    get: function() {
      return yk5.CompressionAlgorithms
    }
  });
  var xk5 = mE();
  Object.defineProperty(zG, "connectivityState", {
    enumerable: !0,
    get: function() {
      return xk5.ConnectivityState
    }
  });
  var c81 = AJA();
  Object.defineProperty(zG, "ChannelCredentials", {
    enumerable: !0,
    get: function() {
      return c81.ChannelCredentials
    }
  });
  var wq2 = q20();
  Object.defineProperty(zG, "Client", {
    enumerable: !0,
    get: function() {
      return wq2.Client
    }
  });
  var M40 = E6();
  Object.defineProperty(zG, "logVerbosity", {
    enumerable: !0,
    get: function() {
      return M40.LogVerbosity
    }
  });
  Object.defineProperty(zG, "status", {
    enumerable: !0,
    get: function() {
      return M40.Status
    }
  });
  Object.defineProperty(zG, "propagate", {
    enumerable: !0,
    get: function() {
      return M40.Propagate
    }
  });
  var qq2 = zZ(),
    O40 = f41();
  Object.defineProperty(zG, "loadPackageDefinition", {
    enumerable: !0,
    get: function() {
      return O40.loadPackageDefinition
    }
  });
  Object.defineProperty(zG, "makeClientConstructor", {
    enumerable: !0,
    get: function() {
      return O40.makeClientConstructor
    }
  });
  Object.defineProperty(zG, "makeGenericClientConstructor", {
    enumerable: !0,
    get: function() {
      return O40.makeClientConstructor
    }
  });
  var vk5 = YK();
  Object.defineProperty(zG, "Metadata", {
    enumerable: !0,
    get: function() {
      return vk5.Metadata
    }
  });
  var bk5 = Dw2();
  Object.defineProperty(zG, "Server", {
    enumerable: !0,
    get: function() {
      return bk5.Server
    }
  });
  var fk5 = T81();
  Object.defineProperty(zG, "ServerCredentials", {
    enumerable: !0,
    get: function() {
      return fk5.ServerCredentials
    }
  });
  var hk5 = zw2();
  Object.defineProperty(zG, "StatusBuilder", {
    enumerable: !0,
    get: function() {
      return hk5.StatusBuilder
    }
  });
  zG.credentials = {
    combineChannelCredentials: (A, ...Q) => {
      return Q.reduce((B, G) => B.compose(G), A)
    },
    combineCallCredentials: (A, ...Q) => {
      return Q.reduce((B, G) => B.compose(G), A)
    },
    createInsecure: c81.ChannelCredentials.createInsecure,
    createSsl: c81.ChannelCredentials.createSsl,
    createFromSecureContext: c81.ChannelCredentials.createFromSecureContext,
    createFromMetadataGenerator: d81.CallCredentials.createFromMetadataGenerator,
    createFromGoogleCredential: d81.CallCredentials.createFromGoogleCredential,
    createEmpty: d81.CallCredentials.createEmpty
  };
  var gk5 = (A) => A.close();
  zG.closeClient = gk5;
  var uk5 = (A, Q, B) => A.waitForReady(Q, B);
  zG.waitForClientReady = uk5;
  var mk5 = (A, Q) => {
    throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
  };
  zG.loadObject = mk5;
  var dk5 = (A, Q, B) => {
    throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
  };
  zG.load = dk5;
  var ck5 = (A) => {
    qq2.setLogger(A)
  };
  zG.setLogger = ck5;
  var pk5 = (A) => {
    qq2.setLoggerVerbosity(A)
  };
  zG.setLogVerbosity = pk5;
  var lk5 = (A) => {
    return wq2.Client.prototype.getChannel.call(A)
  };
  zG.getClientChannel = lk5;
  var p81 = $20();
  Object.defineProperty(zG, "ListenerBuilder", {
    enumerable: !0,
    get: function() {
      return p81.ListenerBuilder
    }
  });
  Object.defineProperty(zG, "RequesterBuilder", {
    enumerable: !0,
    get: function() {
      return p81.RequesterBuilder
    }
  });
  Object.defineProperty(zG, "InterceptingCall", {
    enumerable: !0,
    get: function() {
      return p81.InterceptingCall
    }
  });
  Object.defineProperty(zG, "InterceptorConfigurationError", {
    enumerable: !0,
    get: function() {
      return p81.InterceptorConfigurationError
    }
  });
  var Nq2 = ti();
  Object.defineProperty(zG, "getChannelzServiceDefinition", {
    enumerable: !0,
    get: function() {
      return Nq2.getChannelzServiceDefinition
    }
  });
  Object.defineProperty(zG, "getChannelzHandlers", {
    enumerable: !0,
    get: function() {
      return Nq2.getChannelzHandlers
    }
  });
  var ik5 = v41();
  Object.defineProperty(zG, "addAdminServicesToServer", {
    enumerable: !0,
    get: function() {
      return ik5.addAdminServicesToServer
    }
  });
  var R40 = Q40();
  Object.defineProperty(zG, "ServerListenerBuilder", {
    enumerable: !0,
    get: function() {
      return R40.ServerListenerBuilder
    }
  });
  Object.defineProperty(zG, "ResponderBuilder", {
    enumerable: !0,
    get: function() {
      return R40.ResponderBuilder
    }
  });
  Object.defineProperty(zG, "ServerInterceptingCall", {
    enumerable: !0,
    get: function() {
      return R40.ServerInterceptingCall
    }
  });
  var nk5 = j81();
  Object.defineProperty(zG, "ServerMetricRecorder", {
    enumerable: !0,
    get: function() {
      return nk5.ServerMetricRecorder
    }
  });
  var ak5 = X40();
  zG.experimental = ak5;
  var sk5 = _90(),
    rk5 = hw2(),
    ok5 = lw2(),
    tk5 = oOA(),
    ek5 = tw2(),
    Ay5 = Yq2(),
    Qy5 = $q2(),
    By5 = ti();
  (() => {
    sk5.setup(), rk5.setup(), ok5.setup(), tk5.setup(), ek5.setup(), Ay5.setup(), Qy5.setup(), By5.setup()
  })()
})
// @from(Start 11118506, End 11119161)
Rq2 = z((Mq2) => {
  Object.defineProperty(Mq2, "__esModule", {
    value: !0
  });
  Mq2.createServiceClientConstructor = void 0;
  var Fy5 = GRA();

  function Ky5(A, Q) {
    let B = {
      export: {
        path: A,
        requestStream: !1,
        responseStream: !1,
        requestSerialize: (G) => {
          return G
        },
        requestDeserialize: (G) => {
          return G
        },
        responseSerialize: (G) => {
          return G
        },
        responseDeserialize: (G) => {
          return G
        }
      }
    };
    return Fy5.makeGenericClientConstructor(B, Q)
  }
  Mq2.createServiceClientConstructor = Ky5
})
// @from(Start 11119167, End 11121458)
ZRA = z((Tq2) => {
  Object.defineProperty(Tq2, "__esModule", {
    value: !0
  });
  Tq2.createOtlpGrpcExporterTransport = Tq2.GrpcExporterTransport = Tq2.createEmptyMetadata = Tq2.createSslCredentials = Tq2.createInsecureCredentials = void 0;
  var Dy5 = 0,
    Hy5 = 2;

  function Cy5(A) {
    return A === "gzip" ? Hy5 : Dy5
  }

  function Ey5() {
    let {
      credentials: A
    } = GRA();
    return A.createInsecure()
  }
  Tq2.createInsecureCredentials = Ey5;

  function zy5(A, Q, B) {
    let {
      credentials: G
    } = GRA();
    return G.createSsl(A, Q, B)
  }
  Tq2.createSslCredentials = zy5;

  function Uy5() {
    let {
      Metadata: A
    } = GRA();
    return new A
  }
  Tq2.createEmptyMetadata = Uy5;
  class T40 {
    _parameters;
    _client;
    _metadata;
    constructor(A) {
      this._parameters = A
    }
    shutdown() {
      this._client?.close()
    }
    send(A, Q) {
      let B = Buffer.from(A);
      if (this._client == null) {
        let {
          createServiceClientConstructor: G
        } = Rq2();
        try {
          this._metadata = this._parameters.metadata()
        } catch (I) {
          return Promise.resolve({
            status: "failure",
            error: I
          })
        }
        let Z = G(this._parameters.grpcPath, this._parameters.grpcName);
        try {
          this._client = new Z(this._parameters.address, this._parameters.credentials(), {
            "grpc.default_compression_algorithm": Cy5(this._parameters.compression)
          })
        } catch (I) {
          return Promise.resolve({
            status: "failure",
            error: I
          })
        }
      }
      return new Promise((G) => {
        let Z = Date.now() + Q;
        if (this._metadata == null) return G({
          error: Error("metadata was null"),
          status: "failure"
        });
        this._client.export(B, this._metadata, {
          deadline: Z
        }, (I, Y) => {
          if (I) G({
            status: "failure",
            error: I
          });
          else G({
            data: Y,
            status: "success"
          })
        })
      })
    }
  }
  Tq2.GrpcExporterTransport = T40;

  function $y5(A) {
    return new T40(A)
  }
  Tq2.createOtlpGrpcExporterTransport = $y5
})
// @from(Start 11121464, End 11121600)
_q2 = z((jq2) => {
  Object.defineProperty(jq2, "__esModule", {
    value: !0
  });
  jq2.VERSION = void 0;
  jq2.VERSION = "0.204.0"
})
// @from(Start 11121606, End 11123557)
hq2 = z((bq2) => {
  Object.defineProperty(bq2, "__esModule", {
    value: !0
  });
  bq2.getOtlpGrpcDefaultConfiguration = bq2.mergeOtlpGrpcConfigurationWithDefaults = bq2.validateAndNormalizeUrl = void 0;
  var xq2 = sk(),
    IRA = ZRA(),
    My5 = _q2(),
    Oy5 = UA("url"),
    kq2 = K9();

  function vq2(A) {
    if (A = A.trim(), !A.match(/^([\w]{1,8}):\/\//)) A = `https://${A}`;
    let B = new Oy5.URL(A);
    if (B.protocol === "unix:") return A;
    if (B.pathname && B.pathname !== "/") kq2.diag.warn("URL path should not be set when using grpc, the path part of the URL will be ignored.");
    if (B.protocol !== "" && !B.protocol?.match(/^(http)s?:$/)) kq2.diag.warn("URL protocol should be http(s)://. Using http://.");
    return B.host
  }
  bq2.validateAndNormalizeUrl = vq2;

  function yq2(A, Q) {
    for (let [B, G] of Object.entries(Q.getMap()))
      if (A.get(B).length < 1) A.set(B, G)
  }

  function Ry5(A, Q, B) {
    let G = A.url ?? Q.url ?? B.url;
    return {
      ...(0, xq2.mergeOtlpSharedConfigurationWithDefaults)(A, Q, B),
      metadata: () => {
        let Z = B.metadata();
        return yq2(Z, A.metadata?.().clone() ?? (0, IRA.createEmptyMetadata)()), yq2(Z, Q.metadata?.() ?? (0, IRA.createEmptyMetadata)()), Z
      },
      url: vq2(G),
      credentials: A.credentials ?? Q.credentials?.(G) ?? B.credentials(G)
    }
  }
  bq2.mergeOtlpGrpcConfigurationWithDefaults = Ry5;

  function Ty5() {
    return {
      ...(0, xq2.getSharedConfigurationDefaults)(),
      metadata: () => {
        let A = (0, IRA.createEmptyMetadata)();
        return A.set("User-Agent", `OTel-OTLP-Exporter-JavaScript/${My5.VERSION}`), A
      },
      url: "http://localhost:4317",
      credentials: (A) => {
        if (A.startsWith("http://")) return () => (0, IRA.createInsecureCredentials)();
        else return () => (0, IRA.createSslCredentials)()
      }
    }
  }
  bq2.getOtlpGrpcDefaultConfiguration = Ty5
})
// @from(Start 11123563, End 11126631)
lq2 = z((cq2) => {
  Object.defineProperty(cq2, "__esModule", {
    value: !0
  });
  cq2.getOtlpGrpcConfigurationFromEnv = void 0;
  var gq2 = e6(),
    YRA = ZRA(),
    Sy5 = mi(),
    _y5 = UA("fs"),
    ky5 = UA("path"),
    mq2 = K9();

  function P40(A, Q) {
    if (A != null && A !== "") return A;
    if (Q != null && Q !== "") return Q;
    return
  }

  function yy5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_HEADERS`]?.trim(),
      B = process.env.OTEL_EXPORTER_OTLP_HEADERS?.trim(),
      G = (0, gq2.parseKeyPairsIntoRecord)(Q),
      Z = (0, gq2.parseKeyPairsIntoRecord)(B);
    if (Object.keys(G).length === 0 && Object.keys(Z).length === 0) return;
    let I = Object.assign({}, Z, G),
      Y = (0, YRA.createEmptyMetadata)();
    for (let [J, W] of Object.entries(I)) Y.set(J, W);
    return Y
  }

  function xy5(A) {
    let Q = yy5(A);
    if (Q == null) return;
    return () => Q
  }

  function vy5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_ENDPOINT`]?.trim(),
      B = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();
    return P40(Q, B)
  }

  function by5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_INSECURE`]?.toLowerCase().trim(),
      B = process.env.OTEL_EXPORTER_OTLP_INSECURE?.toLowerCase().trim();
    return P40(Q, B) === "true"
  }

  function j40(A, Q, B) {
    let G = process.env[A]?.trim(),
      Z = process.env[Q]?.trim(),
      I = P40(G, Z);
    if (I != null) try {
      return _y5.readFileSync(ky5.resolve(process.cwd(), I))
    } catch {
      mq2.diag.warn(B);
      return
    } else return
  }

  function fy5(A) {
    return j40(`OTEL_EXPORTER_OTLP_${A}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file")
  }

  function hy5(A) {
    return j40(`OTEL_EXPORTER_OTLP_${A}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file")
  }

  function uq2(A) {
    return j40(`OTEL_EXPORTER_OTLP_${A}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file")
  }

  function dq2(A) {
    let Q = hy5(A),
      B = fy5(A),
      G = uq2(A),
      Z = Q != null && B != null;
    if (G != null && !Z) return mq2.diag.warn("Client key and certificate must both be provided, but one was missing - attempting to create credentials from just the root certificate"), (0, YRA.createSslCredentials)(uq2(A));
    return (0, YRA.createSslCredentials)(G, Q, B)
  }

  function gy5(A) {
    if (by5(A)) return (0, YRA.createInsecureCredentials)();
    return dq2(A)
  }

  function uy5(A) {
    return {
      ...(0, Sy5.getSharedConfigurationFromEnvironment)(A),
      metadata: xy5(A),
      url: vy5(A),
      credentials: (Q) => {
        if (Q.startsWith("http://")) return () => {
          return (0, YRA.createInsecureCredentials)()
        };
        else if (Q.startsWith("https://")) return () => {
          return dq2(A)
        };
        return () => {
          return gy5(A)
        }
      }
    }
  }
  cq2.getOtlpGrpcConfigurationFromEnv = uy5
})
// @from(Start 11126637, End 11127440)
sq2 = z((nq2) => {
  Object.defineProperty(nq2, "__esModule", {
    value: !0
  });
  nq2.convertLegacyOtlpGrpcOptions = void 0;
  var my5 = K9(),
    iq2 = hq2(),
    dy5 = ZRA(),
    cy5 = lq2();

  function py5(A, Q) {
    if (A.headers) my5.diag.warn("Headers cannot be set when using grpc");
    let B = A.credentials;
    return (0, iq2.mergeOtlpGrpcConfigurationWithDefaults)({
      url: A.url,
      metadata: () => {
        return A.metadata ?? (0, dy5.createEmptyMetadata)()
      },
      compression: A.compression,
      timeoutMillis: A.timeoutMillis,
      concurrencyLimit: A.concurrencyLimit,
      credentials: B != null ? () => B : void 0
    }, (0, cy5.getOtlpGrpcConfigurationFromEnv)(Q), (0, iq2.getOtlpGrpcDefaultConfiguration)())
  }
  nq2.convertLegacyOtlpGrpcOptions = py5
})
// @from(Start 11127446, End 11127951)
tq2 = z((rq2) => {
  Object.defineProperty(rq2, "__esModule", {
    value: !0
  });
  rq2.createOtlpGrpcExportDelegate = void 0;
  var ly5 = sk(),
    iy5 = ZRA();

  function ny5(A, Q, B, G) {
    return (0, ly5.createOtlpNetworkExportDelegate)(A, Q, (0, iy5.createOtlpGrpcExporterTransport)({
      address: A.url,
      compression: A.compression,
      credentials: A.credentials,
      metadata: A.metadata,
      grpcName: B,
      grpcPath: G
    }))
  }
  rq2.createOtlpGrpcExportDelegate = ny5
})
// @from(Start 11127957, End 11128486)
i81 = z((l81) => {
  Object.defineProperty(l81, "__esModule", {
    value: !0
  });
  l81.createOtlpGrpcExportDelegate = l81.convertLegacyOtlpGrpcOptions = void 0;
  var ay5 = sq2();
  Object.defineProperty(l81, "convertLegacyOtlpGrpcOptions", {
    enumerable: !0,
    get: function() {
      return ay5.convertLegacyOtlpGrpcOptions
    }
  });
  var sy5 = tq2();
  Object.defineProperty(l81, "createOtlpGrpcExportDelegate", {
    enumerable: !0,
    get: function() {
      return sy5.createOtlpGrpcExportDelegate
    }
  })
})
// @from(Start 11128492, End 11129011)
GN2 = z((QN2) => {
  Object.defineProperty(QN2, "__esModule", {
    value: !0
  });
  QN2.OTLPMetricExporter = void 0;
  var oy5 = w41(),
    eq2 = i81(),
    ty5 = tk();
  class AN2 extends oy5.OTLPMetricExporterBase {
    constructor(A) {
      super((0, eq2.createOtlpGrpcExportDelegate)((0, eq2.convertLegacyOtlpGrpcOptions)(A ?? {}, "METRICS"), ty5.ProtobufMetricsSerializer, "MetricsExportService", "/opentelemetry.proto.collector.metrics.v1.MetricsService/Export"), A)
    }
  }
  QN2.OTLPMetricExporter = AN2
})
// @from(Start 11129017, End 11129299)
ZN2 = z((S40) => {
  Object.defineProperty(S40, "__esModule", {
    value: !0
  });
  S40.OTLPMetricExporter = void 0;
  var ey5 = GN2();
  Object.defineProperty(S40, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return ey5.OTLPMetricExporter
    }
  })
})
// @from(Start 11129305, End 11134065)
y40 = z((WN2) => {
  Object.defineProperty(WN2, "__esModule", {
    value: !0
  });
  WN2.PrometheusSerializer = void 0;
  var Qx5 = K9(),
    X0A = vi(),
    IN2 = e6();

  function a81(A) {
    return A.replace(/\\/g, "\\\\").replace(/\n/g, "\\n")
  }

  function YN2(A = "") {
    if (typeof A !== "string") A = JSON.stringify(A);
    return a81(A).replace(/"/g, "\\\"")
  }
  var Bx5 = /[^a-z0-9_]/gi,
    Gx5 = /_{2,}/g;

  function k40(A) {
    return A.replace(Bx5, "_").replace(Gx5, "_")
  }

  function _40(A, Q) {
    if (!A.endsWith("_total") && Q.dataPointType === X0A.DataPointType.SUM && Q.isMonotonic) A = A + "_total";
    return A
  }

  function Zx5(A) {
    if (A === 1 / 0) return "+Inf";
    else if (A === -1 / 0) return "-Inf";
    else return `${A}`
  }

  function Ix5(A) {
    switch (A.dataPointType) {
      case X0A.DataPointType.SUM:
        if (A.isMonotonic) return "counter";
        return "gauge";
      case X0A.DataPointType.GAUGE:
        return "gauge";
      case X0A.DataPointType.HISTOGRAM:
        return "histogram";
      default:
        return "untyped"
    }
  }

  function n81(A, Q, B, G, Z) {
    let I = !1,
      Y = "";
    for (let [J, W] of Object.entries(Q)) {
      let X = k40(J);
      I = !0, Y += `${Y.length>0?",":""}${X}="${YN2(W)}"`
    }
    if (Z)
      for (let [J, W] of Object.entries(Z)) {
        let X = k40(J);
        I = !0, Y += `${Y.length>0?",":""}${X}="${YN2(W)}"`
      }
    if (I) A += `{${Y}}`;
    return `${A} ${Zx5(B)}${G!==void 0?" "+String(G):""}
`
  }
  var Yx5 = "# no registered metrics";
  class JN2 {
    _prefix;
    _appendTimestamp;
    _additionalAttributes;
    _withResourceConstantLabels;
    constructor(A, Q = !1, B) {
      if (A) this._prefix = A + "_";
      this._appendTimestamp = Q, this._withResourceConstantLabels = B
    }
    serialize(A) {
      let Q = "";
      this._additionalAttributes = this._filterResourceConstantLabels(A.resource.attributes, this._withResourceConstantLabels);
      for (let B of A.scopeMetrics) Q += this._serializeScopeMetrics(B);
      if (Q === "") Q += Yx5;
      return this._serializeResource(A.resource) + Q
    }
    _filterResourceConstantLabels(A, Q) {
      if (Q) {
        let B = {};
        for (let [G, Z] of Object.entries(A))
          if (G.match(Q)) B[G] = Z;
        return B
      }
      return
    }
    _serializeScopeMetrics(A) {
      let Q = "";
      for (let B of A.metrics) Q += this._serializeMetricData(B) + `
`;
      return Q
    }
    _serializeMetricData(A) {
      let Q = k40(a81(A.descriptor.name));
      if (this._prefix) Q = `${this._prefix}${Q}`;
      let B = A.dataPointType;
      Q = _40(Q, A);
      let G = `# HELP ${Q} ${a81(A.descriptor.description||"description missing")}`,
        Z = A.descriptor.unit ? `
# UNIT ${Q} ${a81(A.descriptor.unit)}` : "",
        I = `# TYPE ${Q} ${Ix5(A)}`,
        Y = "";
      switch (B) {
        case X0A.DataPointType.SUM:
        case X0A.DataPointType.GAUGE: {
          Y = A.dataPoints.map((J) => this._serializeSingularDataPoint(Q, A, J)).join("");
          break
        }
        case X0A.DataPointType.HISTOGRAM: {
          Y = A.dataPoints.map((J) => this._serializeHistogramDataPoint(Q, A, J)).join("");
          break
        }
        default:
          Qx5.diag.error(`Unrecognizable DataPointType: ${B} for metric "${Q}"`)
      }
      return `${G}${Z}
${I}
${Y}`.trim()
    }
    _serializeSingularDataPoint(A, Q, B) {
      let G = "";
      A = _40(A, Q);
      let {
        value: Z,
        attributes: I
      } = B, Y = (0, IN2.hrTimeToMilliseconds)(B.endTime);
      return G += n81(A, I, Z, this._appendTimestamp ? Y : void 0, this._additionalAttributes), G
    }
    _serializeHistogramDataPoint(A, Q, B) {
      let G = "";
      A = _40(A, Q);
      let {
        attributes: Z,
        value: I
      } = B, Y = (0, IN2.hrTimeToMilliseconds)(B.endTime);
      for (let V of ["count", "sum"]) {
        let F = I[V];
        if (F != null) G += n81(A + "_" + V, Z, F, this._appendTimestamp ? Y : void 0, this._additionalAttributes)
      }
      let J = 0,
        W = I.buckets.counts.entries(),
        X = !1;
      for (let [V, F] of W) {
        J += F;
        let K = I.buckets.boundaries[V];
        if (K === void 0 && X) break;
        if (K === 1 / 0) X = !0;
        G += n81(A + "_bucket", Z, J, this._appendTimestamp ? Y : void 0, Object.assign({}, this._additionalAttributes ?? {}, {
          le: K === void 0 || K === 1 / 0 ? "+Inf" : String(K)
        }))
      }
      return G
    }
    _serializeResource(A) {
      return `# HELP target_info Target metadata
# TYPE target_info gauge
${n81("target_info",A.attributes,1).trim()}
`
    }
  }
  WN2.PrometheusSerializer = JN2
})
// @from(Start 11134071, End 11137598)
KN2 = z((VN2) => {
  Object.defineProperty(VN2, "__esModule", {
    value: !0
  });
  VN2.PrometheusExporter = void 0;
  var JRA = K9(),
    Jx5 = e6(),
    x40 = vi(),
    Wx5 = UA("http"),
    Xx5 = y40(),
    Vx5 = UA("url");
  class Zn extends x40.MetricReader {
    static DEFAULT_OPTIONS = {
      host: void 0,
      port: 9464,
      endpoint: "/metrics",
      prefix: "",
      appendTimestamp: !1,
      withResourceConstantLabels: void 0
    };
    _host;
    _port;
    _baseUrl;
    _endpoint;
    _server;
    _prefix;
    _appendTimestamp;
    _serializer;
    _startServerPromise;
    constructor(A = {}, Q = () => {}) {
      super({
        aggregationSelector: (G) => {
          return {
            type: x40.AggregationType.DEFAULT
          }
        },
        aggregationTemporalitySelector: (G) => x40.AggregationTemporality.CUMULATIVE,
        metricProducers: A.metricProducers
      });
      this._host = A.host || process.env.OTEL_EXPORTER_PROMETHEUS_HOST || Zn.DEFAULT_OPTIONS.host, this._port = A.port || Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT) || Zn.DEFAULT_OPTIONS.port, this._prefix = A.prefix || Zn.DEFAULT_OPTIONS.prefix, this._appendTimestamp = typeof A.appendTimestamp === "boolean" ? A.appendTimestamp : Zn.DEFAULT_OPTIONS.appendTimestamp;
      let B = A.withResourceConstantLabels || Zn.DEFAULT_OPTIONS.withResourceConstantLabels;
      if (this._server = (0, Wx5.createServer)(this._requestHandler).unref(), this._serializer = new Xx5.PrometheusSerializer(this._prefix, this._appendTimestamp, B), this._baseUrl = `http://${this._host}:${this._port}/`, this._endpoint = (A.endpoint || Zn.DEFAULT_OPTIONS.endpoint).replace(/^([^/])/, "/$1"), A.preventServerStart !== !0) this.startServer().then(Q, (G) => {
        JRA.diag.error(G), Q(G)
      });
      else if (Q) queueMicrotask(Q)
    }
    async onForceFlush() {}
    onShutdown() {
      return this.stopServer()
    }
    stopServer() {
      if (!this._server) return JRA.diag.debug("Prometheus stopServer() was called but server was never started."), Promise.resolve();
      else return new Promise((A) => {
        this._server.close((Q) => {
          if (!Q) JRA.diag.debug("Prometheus exporter was stopped");
          else if (Q.code !== "ERR_SERVER_NOT_RUNNING")(0, Jx5.globalErrorHandler)(Q);
          A()
        })
      })
    }
    startServer() {
      return this._startServerPromise ??= new Promise((A, Q) => {
        this._server.once("error", Q), this._server.listen({
          port: this._port,
          host: this._host
        }, () => {
          JRA.diag.debug(`Prometheus exporter server started: ${this._host}:${this._port}/${this._endpoint}`), A()
        })
      }), this._startServerPromise
    }
    getMetricsRequestHandler(A, Q) {
      this._exportMetrics(Q)
    }
    _requestHandler = (A, Q) => {
      if (A.url != null && new Vx5.URL(A.url, this._baseUrl).pathname === this._endpoint) this._exportMetrics(Q);
      else this._notFound(Q)
    };
    _exportMetrics = (A) => {
      A.statusCode = 200, A.setHeader("content-type", "text/plain"), this.collect().then((Q) => {
        let {
          resourceMetrics: B,
          errors: G
        } = Q;
        if (G.length) JRA.diag.error("PrometheusExporter: metrics collection errors", ...G);
        A.end(this._serializer.serialize(B))
      }, (Q) => {
        A.end(`# failed to export metrics: ${Q}`)
      })
    };
    _notFound = (A) => {
      A.statusCode = 404, A.end()
    }
  }
  VN2.PrometheusExporter = Zn
})
// @from(Start 11137604, End 11138079)
DN2 = z((s81) => {
  Object.defineProperty(s81, "__esModule", {
    value: !0
  });
  s81.PrometheusSerializer = s81.PrometheusExporter = void 0;
  var Fx5 = KN2();
  Object.defineProperty(s81, "PrometheusExporter", {
    enumerable: !0,
    get: function() {
      return Fx5.PrometheusExporter
    }
  });
  var Kx5 = y40();
  Object.defineProperty(s81, "PrometheusSerializer", {
    enumerable: !0,
    get: function() {
      return Kx5.PrometheusSerializer
    }
  })
})
// @from(Start 11138085, End 11138221)
EN2 = z((HN2) => {
  Object.defineProperty(HN2, "__esModule", {
    value: !0
  });
  HN2.VERSION = void 0;
  HN2.VERSION = "0.204.0"
})
// @from(Start 11138227, End 11138785)
qN2 = z(($N2) => {
  Object.defineProperty($N2, "__esModule", {
    value: !0
  });
  $N2.OTLPLogExporter = void 0;
  var Hx5 = sk(),
    Cx5 = tk(),
    zN2 = mi(),
    Ex5 = EN2();
  class UN2 extends Hx5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, zN2.createOtlpHttpExportDelegate)((0, zN2.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${Ex5.VERSION}`,
        "Content-Type": "application/x-protobuf"
      }), Cx5.ProtobufLogsSerializer))
    }
  }
  $N2.OTLPLogExporter = UN2
})
// @from(Start 11138791, End 11139064)
NN2 = z((v40) => {
  Object.defineProperty(v40, "__esModule", {
    value: !0
  });
  v40.OTLPLogExporter = void 0;
  var zx5 = qN2();
  Object.defineProperty(v40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return zx5.OTLPLogExporter
    }
  })
})
// @from(Start 11139070, End 11139343)
LN2 = z((b40) => {
  Object.defineProperty(b40, "__esModule", {
    value: !0
  });
  b40.OTLPLogExporter = void 0;
  var $x5 = NN2();
  Object.defineProperty(b40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return $x5.OTLPLogExporter
    }
  })
})
// @from(Start 11139349, End 11139622)
MN2 = z((f40) => {
  Object.defineProperty(f40, "__esModule", {
    value: !0
  });
  f40.OTLPLogExporter = void 0;
  var qx5 = LN2();
  Object.defineProperty(f40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return qx5.OTLPLogExporter
    }
  })
})
// @from(Start 11139628, End 11140115)
jN2 = z((TN2) => {
  Object.defineProperty(TN2, "__esModule", {
    value: !0
  });
  TN2.OTLPLogExporter = void 0;
  var ON2 = i81(),
    Lx5 = tk(),
    Mx5 = sk();
  class RN2 extends Mx5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, ON2.createOtlpGrpcExportDelegate)((0, ON2.convertLegacyOtlpGrpcOptions)(A, "LOGS"), Lx5.ProtobufLogsSerializer, "LogsExportService", "/opentelemetry.proto.collector.logs.v1.LogsService/Export"))
    }
  }
  TN2.OTLPLogExporter = RN2
})
// @from(Start 11140121, End 11140394)
SN2 = z((h40) => {
  Object.defineProperty(h40, "__esModule", {
    value: !0
  });
  h40.OTLPLogExporter = void 0;
  var Ox5 = jN2();
  Object.defineProperty(h40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return Ox5.OTLPLogExporter
    }
  })
})
// @from(Start 11140400, End 11140536)
yN2 = z((_N2) => {
  Object.defineProperty(_N2, "__esModule", {
    value: !0
  });
  _N2.VERSION = void 0;
  _N2.VERSION = "0.204.0"
})
// @from(Start 11140542, End 11141090)
hN2 = z((bN2) => {
  Object.defineProperty(bN2, "__esModule", {
    value: !0
  });
  bN2.OTLPLogExporter = void 0;
  var Tx5 = sk(),
    Px5 = tk(),
    jx5 = yN2(),
    xN2 = mi();
  class vN2 extends Tx5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, xN2.createOtlpHttpExportDelegate)((0, xN2.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${jx5.VERSION}`,
        "Content-Type": "application/json"
      }), Px5.JsonLogsSerializer))
    }
  }
  bN2.OTLPLogExporter = vN2
})
// @from(Start 11141096, End 11141369)
gN2 = z((g40) => {
  Object.defineProperty(g40, "__esModule", {
    value: !0
  });
  g40.OTLPLogExporter = void 0;
  var Sx5 = hN2();
  Object.defineProperty(g40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return Sx5.OTLPLogExporter
    }
  })
})
// @from(Start 11141375, End 11141648)
uN2 = z((u40) => {
  Object.defineProperty(u40, "__esModule", {
    value: !0
  });
  u40.OTLPLogExporter = void 0;
  var kx5 = gN2();
  Object.defineProperty(u40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return kx5.OTLPLogExporter
    }
  })
})
// @from(Start 11141654, End 11141927)
mN2 = z((m40) => {
  Object.defineProperty(m40, "__esModule", {
    value: !0
  });
  m40.OTLPLogExporter = void 0;
  var xx5 = uN2();
  Object.defineProperty(m40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return xx5.OTLPLogExporter
    }
  })
})
// @from(Start 11141933, End 11142093)
pN2 = z((dN2) => {
  Object.defineProperty(dN2, "__esModule", {
    value: !0
  });
  dN2.ExceptionEventName = void 0;
  dN2.ExceptionEventName = "exception"
})
// @from(Start 11142099, End 11148788)
aN2 = z((iN2) => {
  Object.defineProperty(iN2, "__esModule", {
    value: !0
  });
  iN2.SpanImpl = void 0;
  var KO = K9(),
    GC = e6(),
    V0A = qt(),
    bx5 = pN2();
  class lN2 {
    _spanContext;
    kind;
    parentSpanContext;
    attributes = {};
    links = [];
    events = [];
    startTime;
    resource;
    instrumentationScope;
    _droppedAttributesCount = 0;
    _droppedEventsCount = 0;
    _droppedLinksCount = 0;
    name;
    status = {
      code: KO.SpanStatusCode.UNSET
    };
    endTime = [0, 0];
    _ended = !1;
    _duration = [-1, -1];
    _spanProcessor;
    _spanLimits;
    _attributeValueLengthLimit;
    _performanceStartTime;
    _performanceOffset;
    _startTimeProvided;
    constructor(A) {
      let Q = Date.now();
      if (this._spanContext = A.spanContext, this._performanceStartTime = GC.otperformance.now(), this._performanceOffset = Q - (this._performanceStartTime + (0, GC.getTimeOrigin)()), this._startTimeProvided = A.startTime != null, this._spanLimits = A.spanLimits, this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0, this._spanProcessor = A.spanProcessor, this.name = A.name, this.parentSpanContext = A.parentSpanContext, this.kind = A.kind, this.links = A.links || [], this.startTime = this._getTime(A.startTime ?? Q), this.resource = A.resource, this.instrumentationScope = A.scope, A.attributes != null) this.setAttributes(A.attributes);
      this._spanProcessor.onStart(this, A.context)
    }
    spanContext() {
      return this._spanContext
    }
    setAttribute(A, Q) {
      if (Q == null || this._isSpanEnded()) return this;
      if (A.length === 0) return KO.diag.warn(`Invalid attribute key: ${A}`), this;
      if (!(0, GC.isAttributeValue)(Q)) return KO.diag.warn(`Invalid attribute value set for key: ${A}`), this;
      let {
        attributeCountLimit: B
      } = this._spanLimits;
      if (B !== void 0 && Object.keys(this.attributes).length >= B && !Object.prototype.hasOwnProperty.call(this.attributes, A)) return this._droppedAttributesCount++, this;
      return this.attributes[A] = this._truncateToSize(Q), this
    }
    setAttributes(A) {
      for (let [Q, B] of Object.entries(A)) this.setAttribute(Q, B);
      return this
    }
    addEvent(A, Q, B) {
      if (this._isSpanEnded()) return this;
      let {
        eventCountLimit: G
      } = this._spanLimits;
      if (G === 0) return KO.diag.warn("No events allowed."), this._droppedEventsCount++, this;
      if (G !== void 0 && this.events.length >= G) {
        if (this._droppedEventsCount === 0) KO.diag.debug("Dropping extra events.");
        this.events.shift(), this._droppedEventsCount++
      }
      if ((0, GC.isTimeInput)(Q)) {
        if (!(0, GC.isTimeInput)(B)) B = Q;
        Q = void 0
      }
      let Z = (0, GC.sanitizeAttributes)(Q);
      return this.events.push({
        name: A,
        attributes: Z,
        time: this._getTime(B),
        droppedAttributesCount: 0
      }), this
    }
    addLink(A) {
      return this.links.push(A), this
    }
    addLinks(A) {
      return this.links.push(...A), this
    }
    setStatus(A) {
      if (this._isSpanEnded()) return this;
      if (this.status = {
          ...A
        }, this.status.message != null && typeof A.message !== "string") KO.diag.warn(`Dropping invalid status.message of type '${typeof A.message}', expected 'string'`), delete this.status.message;
      return this
    }
    updateName(A) {
      if (this._isSpanEnded()) return this;
      return this.name = A, this
    }
    end(A) {
      if (this._isSpanEnded()) {
        KO.diag.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
        return
      }
      if (this._ended = !0, this.endTime = this._getTime(A), this._duration = (0, GC.hrTimeDuration)(this.startTime, this.endTime), this._duration[0] < 0) KO.diag.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime), this.endTime = this.startTime.slice(), this._duration = [0, 0];
      if (this._droppedEventsCount > 0) KO.diag.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
      this._spanProcessor.onEnd(this)
    }
    _getTime(A) {
      if (typeof A === "number" && A <= GC.otperformance.now()) return (0, GC.hrTime)(A + this._performanceOffset);
      if (typeof A === "number") return (0, GC.millisToHrTime)(A);
      if (A instanceof Date) return (0, GC.millisToHrTime)(A.getTime());
      if ((0, GC.isTimeInputHrTime)(A)) return A;
      if (this._startTimeProvided) return (0, GC.millisToHrTime)(Date.now());
      let Q = GC.otperformance.now() - this._performanceStartTime;
      return (0, GC.addHrTimes)(this.startTime, (0, GC.millisToHrTime)(Q))
    }
    isRecording() {
      return this._ended === !1
    }
    recordException(A, Q) {
      let B = {};
      if (typeof A === "string") B[V0A.ATTR_EXCEPTION_MESSAGE] = A;
      else if (A) {
        if (A.code) B[V0A.ATTR_EXCEPTION_TYPE] = A.code.toString();
        else if (A.name) B[V0A.ATTR_EXCEPTION_TYPE] = A.name;
        if (A.message) B[V0A.ATTR_EXCEPTION_MESSAGE] = A.message;
        if (A.stack) B[V0A.ATTR_EXCEPTION_STACKTRACE] = A.stack
      }
      if (B[V0A.ATTR_EXCEPTION_TYPE] || B[V0A.ATTR_EXCEPTION_MESSAGE]) this.addEvent(bx5.ExceptionEventName, B, Q);
      else KO.diag.warn(`Failed to record an exception ${A}`)
    }
    get duration() {
      return this._duration
    }
    get ended() {
      return this._ended
    }
    get droppedAttributesCount() {
      return this._droppedAttributesCount
    }
    get droppedEventsCount() {
      return this._droppedEventsCount
    }
    get droppedLinksCount() {
      return this._droppedLinksCount
    }
    _isSpanEnded() {
      if (this._ended) {
        let A = Error(`Operation attempted on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
        KO.diag.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, A)
      }
      return this._ended
    }
    _truncateToLimitUtil(A, Q) {
      if (A.length <= Q) return A;
      return A.substring(0, Q)
    }
    _truncateToSize(A) {
      let Q = this._attributeValueLengthLimit;
      if (Q <= 0) return KO.diag.warn(`Attribute value limit must be positive, got ${Q}`), A;
      if (typeof A === "string") return this._truncateToLimitUtil(A, Q);
      if (Array.isArray(A)) return A.map((B) => typeof B === "string" ? this._truncateToLimitUtil(B, Q) : B);
      return A
    }
  }
  iN2.SpanImpl = lN2
})
// @from(Start 11148794, End 11149124)
WRA = z((sN2) => {
  Object.defineProperty(sN2, "__esModule", {
    value: !0
  });
  sN2.SamplingDecision = void 0;
  var fx5;
  (function(A) {
    A[A.NOT_RECORD = 0] = "NOT_RECORD", A[A.RECORD = 1] = "RECORD", A[A.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
  })(fx5 = sN2.SamplingDecision || (sN2.SamplingDecision = {}))
})
// @from(Start 11149130, End 11149470)
r81 = z((oN2) => {
  Object.defineProperty(oN2, "__esModule", {
    value: !0
  });
  oN2.AlwaysOffSampler = void 0;
  var hx5 = WRA();
  class rN2 {
    shouldSample() {
      return {
        decision: hx5.SamplingDecision.NOT_RECORD
      }
    }
    toString() {
      return "AlwaysOffSampler"
    }
  }
  oN2.AlwaysOffSampler = rN2
})
// @from(Start 11149476, End 11149821)
o81 = z((AL2) => {
  Object.defineProperty(AL2, "__esModule", {
    value: !0
  });
  AL2.AlwaysOnSampler = void 0;
  var gx5 = WRA();
  class eN2 {
    shouldSample() {
      return {
        decision: gx5.SamplingDecision.RECORD_AND_SAMPLED
      }
    }
    toString() {
      return "AlwaysOnSampler"
    }
  }
  AL2.AlwaysOnSampler = eN2
})
// @from(Start 11149827, End 11151639)
p40 = z((ZL2) => {
  Object.defineProperty(ZL2, "__esModule", {
    value: !0
  });
  ZL2.ParentBasedSampler = void 0;
  var t81 = K9(),
    ux5 = e6(),
    BL2 = r81(),
    c40 = o81();
  class GL2 {
    _root;
    _remoteParentSampled;
    _remoteParentNotSampled;
    _localParentSampled;
    _localParentNotSampled;
    constructor(A) {
      if (this._root = A.root, !this._root)(0, ux5.globalErrorHandler)(Error("ParentBasedSampler must have a root sampler configured")), this._root = new c40.AlwaysOnSampler;
      this._remoteParentSampled = A.remoteParentSampled ?? new c40.AlwaysOnSampler, this._remoteParentNotSampled = A.remoteParentNotSampled ?? new BL2.AlwaysOffSampler, this._localParentSampled = A.localParentSampled ?? new c40.AlwaysOnSampler, this._localParentNotSampled = A.localParentNotSampled ?? new BL2.AlwaysOffSampler
    }
    shouldSample(A, Q, B, G, Z, I) {
      let Y = t81.trace.getSpanContext(A);
      if (!Y || !(0, t81.isSpanContextValid)(Y)) return this._root.shouldSample(A, Q, B, G, Z, I);
      if (Y.isRemote) {
        if (Y.traceFlags & t81.TraceFlags.SAMPLED) return this._remoteParentSampled.shouldSample(A, Q, B, G, Z, I);
        return this._remoteParentNotSampled.shouldSample(A, Q, B, G, Z, I)
      }
      if (Y.traceFlags & t81.TraceFlags.SAMPLED) return this._localParentSampled.shouldSample(A, Q, B, G, Z, I);
      return this._localParentNotSampled.shouldSample(A, Q, B, G, Z, I)
    }
    toString() {
      return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`
    }
  }
  ZL2.ParentBasedSampler = GL2
})
// @from(Start 11151645, End 11152656)
l40 = z((WL2) => {
  Object.defineProperty(WL2, "__esModule", {
    value: !0
  });
  WL2.TraceIdRatioBasedSampler = void 0;
  var mx5 = K9(),
    YL2 = WRA();
  class JL2 {
    _ratio;
    _upperBound;
    constructor(A = 0) {
      this._ratio = A, this._ratio = this._normalize(A), this._upperBound = Math.floor(this._ratio * 4294967295)
    }
    shouldSample(A, Q) {
      return {
        decision: (0, mx5.isValidTraceId)(Q) && this._accumulate(Q) < this._upperBound ? YL2.SamplingDecision.RECORD_AND_SAMPLED : YL2.SamplingDecision.NOT_RECORD
      }
    }
    toString() {
      return `TraceIdRatioBased{${this._ratio}}`
    }
    _normalize(A) {
      if (typeof A !== "number" || isNaN(A)) return 0;
      return A >= 1 ? 1 : A <= 0 ? 0 : A
    }
    _accumulate(A) {
      let Q = 0;
      for (let B = 0; B < A.length / 8; B++) {
        let G = B * 8,
          Z = parseInt(A.slice(G, G + 8), 16);
        Q = (Q ^ Z) >>> 0
      }
      return Q
    }
  }
  WL2.TraceIdRatioBasedSampler = JL2
})
// @from(Start 11152662, End 11155590)
a40 = z((HL2) => {
  Object.defineProperty(HL2, "__esModule", {
    value: !0
  });
  HL2.buildSamplerFromEnv = HL2.loadDefaultConfig = void 0;
  var n40 = K9(),
    Fy = e6(),
    VL2 = r81(),
    i40 = o81(),
    e81 = p40(),
    FL2 = l40(),
    Ky;
  (function(A) {
    A.AlwaysOff = "always_off", A.AlwaysOn = "always_on", A.ParentBasedAlwaysOff = "parentbased_always_off", A.ParentBasedAlwaysOn = "parentbased_always_on", A.ParentBasedTraceIdRatio = "parentbased_traceidratio", A.TraceIdRatio = "traceidratio"
  })(Ky || (Ky = {}));
  var A61 = 1;

  function dx5() {
    return {
      sampler: DL2(),
      forceFlushTimeoutMillis: 30000,
      generalLimits: {
        attributeValueLengthLimit: (0, Fy.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
        attributeCountLimit: (0, Fy.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? 128
      },
      spanLimits: {
        attributeValueLengthLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
        attributeCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? 128,
        linkCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_LINK_COUNT_LIMIT") ?? 128,
        eventCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_EVENT_COUNT_LIMIT") ?? 128,
        attributePerEventCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT") ?? 128,
        attributePerLinkCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT") ?? 128
      }
    }
  }
  HL2.loadDefaultConfig = dx5;

  function DL2() {
    let A = (0, Fy.getStringFromEnv)("OTEL_TRACES_SAMPLER") ?? Ky.ParentBasedAlwaysOn;
    switch (A) {
      case Ky.AlwaysOn:
        return new i40.AlwaysOnSampler;
      case Ky.AlwaysOff:
        return new VL2.AlwaysOffSampler;
      case Ky.ParentBasedAlwaysOn:
        return new e81.ParentBasedSampler({
          root: new i40.AlwaysOnSampler
        });
      case Ky.ParentBasedAlwaysOff:
        return new e81.ParentBasedSampler({
          root: new VL2.AlwaysOffSampler
        });
      case Ky.TraceIdRatio:
        return new FL2.TraceIdRatioBasedSampler(KL2());
      case Ky.ParentBasedTraceIdRatio:
        return new e81.ParentBasedSampler({
          root: new FL2.TraceIdRatioBasedSampler(KL2())
        });
      default:
        return n40.diag.error(`OTEL_TRACES_SAMPLER value "${A}" invalid, defaulting to "${Ky.ParentBasedAlwaysOn}".`), new e81.ParentBasedSampler({
          root: new i40.AlwaysOnSampler
        })
    }
  }
  HL2.buildSamplerFromEnv = DL2;

  function KL2() {
    let A = (0, Fy.getNumberFromEnv)("OTEL_TRACES_SAMPLER_ARG");
    if (A == null) return n40.diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${A61}.`), A61;
    if (A < 0 || A > 1) return n40.diag.error(`OTEL_TRACES_SAMPLER_ARG=${A} was given, but it is out of range ([0..1]), defaulting to ${A61}.`), A61;
    return A
  }
})
// @from(Start 11155596, End 11157018)
s40 = z((zL2) => {
  Object.defineProperty(zL2, "__esModule", {
    value: !0
  });
  zL2.reconfigureLimits = zL2.mergeConfig = zL2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = zL2.DEFAULT_ATTRIBUTE_COUNT_LIMIT = void 0;
  var EL2 = a40(),
    Q61 = e6();
  zL2.DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
  zL2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = 1 / 0;

  function px5(A) {
    let Q = {
        sampler: (0, EL2.buildSamplerFromEnv)()
      },
      B = (0, EL2.loadDefaultConfig)(),
      G = Object.assign({}, B, Q, A);
    return G.generalLimits = Object.assign({}, B.generalLimits, A.generalLimits || {}), G.spanLimits = Object.assign({}, B.spanLimits, A.spanLimits || {}), G
  }
  zL2.mergeConfig = px5;

  function lx5(A) {
    let Q = Object.assign({}, A.spanLimits);
    return Q.attributeCountLimit = A.spanLimits?.attributeCountLimit ?? A.generalLimits?.attributeCountLimit ?? (0, Q61.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? (0, Q61.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? zL2.DEFAULT_ATTRIBUTE_COUNT_LIMIT, Q.attributeValueLengthLimit = A.spanLimits?.attributeValueLengthLimit ?? A.generalLimits?.attributeValueLengthLimit ?? (0, Q61.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? (0, Q61.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? zL2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT, Object.assign({}, A, {
      spanLimits: Q
    })
  }
  zL2.reconfigureLimits = lx5
})
// @from(Start 11157024, End 11161747)
ML2 = z((NL2) => {
  Object.defineProperty(NL2, "__esModule", {
    value: !0
  });
  NL2.BatchSpanProcessorBase = void 0;
  var jJA = K9(),
    Dy = e6();
  class qL2 {
    _exporter;
    _maxExportBatchSize;
    _maxQueueSize;
    _scheduledDelayMillis;
    _exportTimeoutMillis;
    _isExporting = !1;
    _finishedSpans = [];
    _timer;
    _shutdownOnce;
    _droppedSpansCount = 0;
    constructor(A, Q) {
      if (this._exporter = A, this._maxExportBatchSize = typeof Q?.maxExportBatchSize === "number" ? Q.maxExportBatchSize : (0, Dy.getNumberFromEnv)("OTEL_BSP_MAX_EXPORT_BATCH_SIZE") ?? 512, this._maxQueueSize = typeof Q?.maxQueueSize === "number" ? Q.maxQueueSize : (0, Dy.getNumberFromEnv)("OTEL_BSP_MAX_QUEUE_SIZE") ?? 2048, this._scheduledDelayMillis = typeof Q?.scheduledDelayMillis === "number" ? Q.scheduledDelayMillis : (0, Dy.getNumberFromEnv)("OTEL_BSP_SCHEDULE_DELAY") ?? 5000, this._exportTimeoutMillis = typeof Q?.exportTimeoutMillis === "number" ? Q.exportTimeoutMillis : (0, Dy.getNumberFromEnv)("OTEL_BSP_EXPORT_TIMEOUT") ?? 30000, this._shutdownOnce = new Dy.BindOnceFuture(this._shutdown, this), this._maxExportBatchSize > this._maxQueueSize) jJA.diag.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"), this._maxExportBatchSize = this._maxQueueSize
    }
    forceFlush() {
      if (this._shutdownOnce.isCalled) return this._shutdownOnce.promise;
      return this._flushAll()
    }
    onStart(A, Q) {}
    onEnd(A) {
      if (this._shutdownOnce.isCalled) return;
      if ((A.spanContext().traceFlags & jJA.TraceFlags.SAMPLED) === 0) return;
      this._addToBuffer(A)
    }
    shutdown() {
      return this._shutdownOnce.call()
    }
    _shutdown() {
      return Promise.resolve().then(() => {
        return this.onShutdown()
      }).then(() => {
        return this._flushAll()
      }).then(() => {
        return this._exporter.shutdown()
      })
    }
    _addToBuffer(A) {
      if (this._finishedSpans.length >= this._maxQueueSize) {
        if (this._droppedSpansCount === 0) jJA.diag.debug("maxQueueSize reached, dropping spans");
        this._droppedSpansCount++;
        return
      }
      if (this._droppedSpansCount > 0) jJA.diag.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`), this._droppedSpansCount = 0;
      this._finishedSpans.push(A), this._maybeStartTimer()
    }
    _flushAll() {
      return new Promise((A, Q) => {
        let B = [],
          G = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
        for (let Z = 0, I = G; Z < I; Z++) B.push(this._flushOneBatch());
        Promise.all(B).then(() => {
          A()
        }).catch(Q)
      })
    }
    _flushOneBatch() {
      if (this._clearTimer(), this._finishedSpans.length === 0) return Promise.resolve();
      return new Promise((A, Q) => {
        let B = setTimeout(() => {
          Q(Error("Timeout"))
        }, this._exportTimeoutMillis);
        jJA.context.with((0, Dy.suppressTracing)(jJA.context.active()), () => {
          let G;
          if (this._finishedSpans.length <= this._maxExportBatchSize) G = this._finishedSpans, this._finishedSpans = [];
          else G = this._finishedSpans.splice(0, this._maxExportBatchSize);
          let Z = () => this._exporter.export(G, (Y) => {
              if (clearTimeout(B), Y.code === Dy.ExportResultCode.SUCCESS) A();
              else Q(Y.error ?? Error("BatchSpanProcessor: span export failed"))
            }),
            I = null;
          for (let Y = 0, J = G.length; Y < J; Y++) {
            let W = G[Y];
            if (W.resource.asyncAttributesPending && W.resource.waitForAsyncAttributes) I ??= [], I.push(W.resource.waitForAsyncAttributes())
          }
          if (I === null) Z();
          else Promise.all(I).then(Z, (Y) => {
            (0, Dy.globalErrorHandler)(Y), Q(Y)
          })
        })
      })
    }
    _maybeStartTimer() {
      if (this._isExporting) return;
      let A = () => {
        this._isExporting = !0, this._flushOneBatch().finally(() => {
          if (this._isExporting = !1, this._finishedSpans.length > 0) this._clearTimer(), this._maybeStartTimer()
        }).catch((Q) => {
          this._isExporting = !1, (0, Dy.globalErrorHandler)(Q)
        })
      };
      if (this._finishedSpans.length >= this._maxExportBatchSize) return A();
      if (this._timer !== void 0) return;
      this._timer = setTimeout(() => A(), this._scheduledDelayMillis), (0, Dy.unrefTimer)(this._timer)
    }
    _clearTimer() {
      if (this._timer !== void 0) clearTimeout(this._timer), this._timer = void 0
    }
  }
  NL2.BatchSpanProcessorBase = qL2
})
// @from(Start 11161753, End 11161997)
PL2 = z((RL2) => {
  Object.defineProperty(RL2, "__esModule", {
    value: !0
  });
  RL2.BatchSpanProcessor = void 0;
  var nx5 = ML2();
  class OL2 extends nx5.BatchSpanProcessorBase {
    onShutdown() {}
  }
  RL2.BatchSpanProcessor = OL2
})
// @from(Start 11162003, End 11162603)
xL2 = z((kL2) => {
  Object.defineProperty(kL2, "__esModule", {
    value: !0
  });
  kL2.RandomIdGenerator = void 0;
  var ax5 = 8,
    SL2 = 16;
  class _L2 {
    generateTraceId = jL2(SL2);
    generateSpanId = jL2(ax5)
  }
  kL2.RandomIdGenerator = _L2;
  var B61 = Buffer.allocUnsafe(SL2);

  function jL2(A) {
    return function() {
      for (let B = 0; B < A / 4; B++) B61.writeUInt32BE(Math.random() * 4294967296 >>> 0, B * 4);
      for (let B = 0; B < A; B++)
        if (B61[B] > 0) break;
        else if (B === A - 1) B61[A - 1] = 1;
      return B61.toString("hex", 0, A)
    }
  }
})
// @from(Start 11162609, End 11163075)
vL2 = z((G61) => {
  Object.defineProperty(G61, "__esModule", {
    value: !0
  });
  G61.RandomIdGenerator = G61.BatchSpanProcessor = void 0;
  var sx5 = PL2();
  Object.defineProperty(G61, "BatchSpanProcessor", {
    enumerable: !0,
    get: function() {
      return sx5.BatchSpanProcessor
    }
  });
  var rx5 = xL2();
  Object.defineProperty(G61, "RandomIdGenerator", {
    enumerable: !0,
    get: function() {
      return rx5.RandomIdGenerator
    }
  })
})
// @from(Start 11163081, End 11163528)
r40 = z((Z61) => {
  Object.defineProperty(Z61, "__esModule", {
    value: !0
  });
  Z61.RandomIdGenerator = Z61.BatchSpanProcessor = void 0;
  var bL2 = vL2();
  Object.defineProperty(Z61, "BatchSpanProcessor", {
    enumerable: !0,
    get: function() {
      return bL2.BatchSpanProcessor
    }
  });
  Object.defineProperty(Z61, "RandomIdGenerator", {
    enumerable: !0,
    get: function() {
      return bL2.RandomIdGenerator
    }
  })
})
// @from(Start 11163534, End 11166496)
uL2 = z((hL2) => {
  Object.defineProperty(hL2, "__esModule", {
    value: !0
  });
  hL2.Tracer = void 0;
  var cD = K9(),
    I61 = e6(),
    ex5 = aN2(),
    Av5 = s40(),
    Qv5 = r40();
  class fL2 {
    _sampler;
    _generalLimits;
    _spanLimits;
    _idGenerator;
    instrumentationScope;
    _resource;
    _spanProcessor;
    constructor(A, Q, B, G) {
      let Z = (0, Av5.mergeConfig)(Q);
      this._sampler = Z.sampler, this._generalLimits = Z.generalLimits, this._spanLimits = Z.spanLimits, this._idGenerator = Q.idGenerator || new Qv5.RandomIdGenerator, this._resource = B, this._spanProcessor = G, this.instrumentationScope = A
    }
    startSpan(A, Q = {}, B = cD.context.active()) {
      if (Q.root) B = cD.trace.deleteSpan(B);
      let G = cD.trace.getSpan(B);
      if ((0, I61.isTracingSuppressed)(B)) return cD.diag.debug("Instrumentation suppressed, returning Noop Span"), cD.trace.wrapSpanContext(cD.INVALID_SPAN_CONTEXT);
      let Z = G?.spanContext(),
        I = this._idGenerator.generateSpanId(),
        Y, J, W;
      if (!Z || !cD.trace.isSpanContextValid(Z)) J = this._idGenerator.generateTraceId();
      else J = Z.traceId, W = Z.traceState, Y = Z;
      let X = Q.kind ?? cD.SpanKind.INTERNAL,
        V = (Q.links ?? []).map((U) => {
          return {
            context: U.context,
            attributes: (0, I61.sanitizeAttributes)(U.attributes)
          }
        }),
        F = (0, I61.sanitizeAttributes)(Q.attributes),
        K = this._sampler.shouldSample(B, J, A, X, F, V);
      W = K.traceState ?? W;
      let D = K.decision === cD.SamplingDecision.RECORD_AND_SAMPLED ? cD.TraceFlags.SAMPLED : cD.TraceFlags.NONE,
        H = {
          traceId: J,
          spanId: I,
          traceFlags: D,
          traceState: W
        };
      if (K.decision === cD.SamplingDecision.NOT_RECORD) return cD.diag.debug("Recording is off, propagating context in a non-recording span"), cD.trace.wrapSpanContext(H);
      let C = (0, I61.sanitizeAttributes)(Object.assign(F, K.attributes));
      return new ex5.SpanImpl({
        resource: this._resource,
        scope: this.instrumentationScope,
        context: B,
        spanContext: H,
        name: A,
        kind: X,
        links: V,
        parentSpanContext: Y,
        attributes: C,
        startTime: Q.startTime,
        spanProcessor: this._spanProcessor,
        spanLimits: this._spanLimits
      })
    }
    startActiveSpan(A, Q, B, G) {
      let Z, I, Y;
      if (arguments.length < 2) return;
      else if (arguments.length === 2) Y = Q;
      else if (arguments.length === 3) Z = Q, Y = B;
      else Z = Q, I = B, Y = G;
      let J = I ?? cD.context.active(),
        W = this.startSpan(A, Z, J),
        X = cD.trace.setSpan(J, W);
      return cD.context.with(X, Y, void 0, W)
    }
    getGeneralLimits() {
      return this._generalLimits
    }
    getSpanLimits() {
      return this._spanLimits
    }
  }
  hL2.Tracer = fL2
})
// @from(Start 11166502, End 11167477)
pL2 = z((dL2) => {
  Object.defineProperty(dL2, "__esModule", {
    value: !0
  });
  dL2.MultiSpanProcessor = void 0;
  var Bv5 = e6();
  class mL2 {
    _spanProcessors;
    constructor(A) {
      this._spanProcessors = A
    }
    forceFlush() {
      let A = [];
      for (let Q of this._spanProcessors) A.push(Q.forceFlush());
      return new Promise((Q) => {
        Promise.all(A).then(() => {
          Q()
        }).catch((B) => {
          (0, Bv5.globalErrorHandler)(B || Error("MultiSpanProcessor: forceFlush failed")), Q()
        })
      })
    }
    onStart(A, Q) {
      for (let B of this._spanProcessors) B.onStart(A, Q)
    }
    onEnd(A) {
      for (let Q of this._spanProcessors) Q.onEnd(A)
    }
    shutdown() {
      let A = [];
      for (let Q of this._spanProcessors) A.push(Q.shutdown());
      return new Promise((Q, B) => {
        Promise.all(A).then(() => {
          Q()
        }, B)
      })
    }
  }
  dL2.MultiSpanProcessor = mL2
})
// @from(Start 11167483, End 11169704)
sL2 = z((nL2) => {
  Object.defineProperty(nL2, "__esModule", {
    value: !0
  });
  nL2.BasicTracerProvider = nL2.ForceFlushState = void 0;
  var Gv5 = e6(),
    Zv5 = t3A(),
    Iv5 = uL2(),
    Yv5 = a40(),
    Jv5 = pL2(),
    Wv5 = s40(),
    SJA;
  (function(A) {
    A[A.resolved = 0] = "resolved", A[A.timeout = 1] = "timeout", A[A.error = 2] = "error", A[A.unresolved = 3] = "unresolved"
  })(SJA = nL2.ForceFlushState || (nL2.ForceFlushState = {}));
  class iL2 {
    _config;
    _tracers = new Map;
    _resource;
    _activeSpanProcessor;
    constructor(A = {}) {
      let Q = (0, Gv5.merge)({}, (0, Yv5.loadDefaultConfig)(), (0, Wv5.reconfigureLimits)(A));
      this._resource = Q.resource ?? (0, Zv5.defaultResource)(), this._config = Object.assign({}, Q, {
        resource: this._resource
      });
      let B = [];
      if (A.spanProcessors?.length) B.push(...A.spanProcessors);
      this._activeSpanProcessor = new Jv5.MultiSpanProcessor(B)
    }
    getTracer(A, Q, B) {
      let G = `${A}@${Q||""}:${B?.schemaUrl||""}`;
      if (!this._tracers.has(G)) this._tracers.set(G, new Iv5.Tracer({
        name: A,
        version: Q,
        schemaUrl: B?.schemaUrl
      }, this._config, this._resource, this._activeSpanProcessor));
      return this._tracers.get(G)
    }
    forceFlush() {
      let A = this._config.forceFlushTimeoutMillis,
        Q = this._activeSpanProcessor._spanProcessors.map((B) => {
          return new Promise((G) => {
            let Z, I = setTimeout(() => {
              G(Error(`Span processor did not completed within timeout period of ${A} ms`)), Z = SJA.timeout
            }, A);
            B.forceFlush().then(() => {
              if (clearTimeout(I), Z !== SJA.timeout) Z = SJA.resolved, G(Z)
            }).catch((Y) => {
              clearTimeout(I), Z = SJA.error, G(Y)
            })
          })
        });
      return new Promise((B, G) => {
        Promise.all(Q).then((Z) => {
          let I = Z.filter((Y) => Y !== SJA.resolved);
          if (I.length > 0) G(I);
          else B()
        }).catch((Z) => G([Z]))
      })
    }
    shutdown() {
      return this._activeSpanProcessor.shutdown()
    }
  }
  nL2.BasicTracerProvider = iL2
})
// @from(Start 11169710, End 11170925)
eL2 = z((oL2) => {
  Object.defineProperty(oL2, "__esModule", {
    value: !0
  });
  oL2.ConsoleSpanExporter = void 0;
  var o40 = e6();
  class rL2 {
    export (A, Q) {
      return this._sendSpans(A, Q)
    }
    shutdown() {
      return this._sendSpans([]), this.forceFlush()
    }
    forceFlush() {
      return Promise.resolve()
    }
    _exportInfo(A) {
      return {
        resource: {
          attributes: A.resource.attributes
        },
        instrumentationScope: A.instrumentationScope,
        traceId: A.spanContext().traceId,
        parentSpanContext: A.parentSpanContext,
        traceState: A.spanContext().traceState?.serialize(),
        name: A.name,
        id: A.spanContext().spanId,
        kind: A.kind,
        timestamp: (0, o40.hrTimeToMicroseconds)(A.startTime),
        duration: (0, o40.hrTimeToMicroseconds)(A.duration),
        attributes: A.attributes,
        status: A.status,
        events: A.events,
        links: A.links
      }
    }
    _sendSpans(A, Q) {
      for (let B of A) console.dir(this._exportInfo(B), {
        depth: 3
      });
      if (Q) return Q({
        code: o40.ExportResultCode.SUCCESS
      })
    }
  }
  oL2.ConsoleSpanExporter = rL2
})
// @from(Start 11170931, End 11171718)
ZM2 = z((BM2) => {
  Object.defineProperty(BM2, "__esModule", {
    value: !0
  });
  BM2.InMemorySpanExporter = void 0;
  var AM2 = e6();
  class QM2 {
    _finishedSpans = [];
    _stopped = !1;
    export (A, Q) {
      if (this._stopped) return Q({
        code: AM2.ExportResultCode.FAILED,
        error: Error("Exporter has been stopped")
      });
      this._finishedSpans.push(...A), setTimeout(() => Q({
        code: AM2.ExportResultCode.SUCCESS
      }), 0)
    }
    shutdown() {
      return this._stopped = !0, this._finishedSpans = [], this.forceFlush()
    }
    forceFlush() {
      return Promise.resolve()
    }
    reset() {
      this._finishedSpans = []
    }
    getFinishedSpans() {
      return this._finishedSpans
    }
  }
  BM2.InMemorySpanExporter = QM2
})
// @from(Start 11171724, End 11173060)
WM2 = z((YM2) => {
  Object.defineProperty(YM2, "__esModule", {
    value: !0
  });
  YM2.SimpleSpanProcessor = void 0;
  var Xv5 = K9(),
    Y61 = e6();
  class IM2 {
    _exporter;
    _shutdownOnce;
    _pendingExports;
    constructor(A) {
      this._exporter = A, this._shutdownOnce = new Y61.BindOnceFuture(this._shutdown, this), this._pendingExports = new Set
    }
    async forceFlush() {
      if (await Promise.all(Array.from(this._pendingExports)), this._exporter.forceFlush) await this._exporter.forceFlush()
    }
    onStart(A, Q) {}
    onEnd(A) {
      if (this._shutdownOnce.isCalled) return;
      if ((A.spanContext().traceFlags & Xv5.TraceFlags.SAMPLED) === 0) return;
      let Q = this._doExport(A).catch((B) => (0, Y61.globalErrorHandler)(B));
      this._pendingExports.add(Q), Q.finally(() => this._pendingExports.delete(Q))
    }
    async _doExport(A) {
      if (A.resource.asyncAttributesPending) await A.resource.waitForAsyncAttributes?.();
      let Q = await Y61.internal._export(this._exporter, [A]);
      if (Q.code !== Y61.ExportResultCode.SUCCESS) throw Q.error ?? Error(`SimpleSpanProcessor: span export failed (status ${Q})`)
    }
    shutdown() {
      return this._shutdownOnce.call()
    }
    _shutdown() {
      return this._exporter.shutdown()
    }
  }
  YM2.SimpleSpanProcessor = IM2
})
// @from(Start 11173066, End 11173381)
KM2 = z((VM2) => {
  Object.defineProperty(VM2, "__esModule", {
    value: !0
  });
  VM2.NoopSpanProcessor = void 0;
  class XM2 {
    onStart(A, Q) {}
    onEnd(A) {}
    shutdown() {
      return Promise.resolve()
    }
    forceFlush() {
      return Promise.resolve()
    }
  }
  VM2.NoopSpanProcessor = XM2
})
// @from(Start 11173387, End 11175687)
HM2 = z((B$) => {
  Object.defineProperty(B$, "__esModule", {
    value: !0
  });
  B$.SamplingDecision = B$.TraceIdRatioBasedSampler = B$.ParentBasedSampler = B$.AlwaysOnSampler = B$.AlwaysOffSampler = B$.NoopSpanProcessor = B$.SimpleSpanProcessor = B$.InMemorySpanExporter = B$.ConsoleSpanExporter = B$.RandomIdGenerator = B$.BatchSpanProcessor = B$.BasicTracerProvider = void 0;
  var Vv5 = sL2();
  Object.defineProperty(B$, "BasicTracerProvider", {
    enumerable: !0,
    get: function() {
      return Vv5.BasicTracerProvider
    }
  });
  var DM2 = r40();
  Object.defineProperty(B$, "BatchSpanProcessor", {
    enumerable: !0,
    get: function() {
      return DM2.BatchSpanProcessor
    }
  });
  Object.defineProperty(B$, "RandomIdGenerator", {
    enumerable: !0,
    get: function() {
      return DM2.RandomIdGenerator
    }
  });
  var Fv5 = eL2();
  Object.defineProperty(B$, "ConsoleSpanExporter", {
    enumerable: !0,
    get: function() {
      return Fv5.ConsoleSpanExporter
    }
  });
  var Kv5 = ZM2();
  Object.defineProperty(B$, "InMemorySpanExporter", {
    enumerable: !0,
    get: function() {
      return Kv5.InMemorySpanExporter
    }
  });
  var Dv5 = WM2();
  Object.defineProperty(B$, "SimpleSpanProcessor", {
    enumerable: !0,
    get: function() {
      return Dv5.SimpleSpanProcessor
    }
  });
  var Hv5 = KM2();
  Object.defineProperty(B$, "NoopSpanProcessor", {
    enumerable: !0,
    get: function() {
      return Hv5.NoopSpanProcessor
    }
  });
  var Cv5 = r81();
  Object.defineProperty(B$, "AlwaysOffSampler", {
    enumerable: !0,
    get: function() {
      return Cv5.AlwaysOffSampler
    }
  });
  var Ev5 = o81();
  Object.defineProperty(B$, "AlwaysOnSampler", {
    enumerable: !0,
    get: function() {
      return Ev5.AlwaysOnSampler
    }
  });
  var zv5 = p40();
  Object.defineProperty(B$, "ParentBasedSampler", {
    enumerable: !0,
    get: function() {
      return zv5.ParentBasedSampler
    }
  });
  var Uv5 = l40();
  Object.defineProperty(B$, "TraceIdRatioBasedSampler", {
    enumerable: !0,
    get: function() {
      return Uv5.TraceIdRatioBasedSampler
    }
  });
  var $v5 = WRA();
  Object.defineProperty(B$, "SamplingDecision", {
    enumerable: !0,
    get: function() {
      return $v5.SamplingDecision
    }
  })
})
// @from(Start 11175693, End 11175829)
zM2 = z((CM2) => {
  Object.defineProperty(CM2, "__esModule", {
    value: !0
  });
  CM2.VERSION = void 0;
  CM2.VERSION = "0.204.0"
})
// @from(Start 11175835, End 11176402)
NM2 = z((wM2) => {
  Object.defineProperty(wM2, "__esModule", {
    value: !0
  });
  wM2.OTLPTraceExporter = void 0;
  var qv5 = sk(),
    Nv5 = tk(),
    Lv5 = zM2(),
    UM2 = mi();
  class $M2 extends qv5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, UM2.createOtlpHttpExportDelegate)((0, UM2.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${Lv5.VERSION}`,
        "Content-Type": "application/x-protobuf"
      }), Nv5.ProtobufTraceSerializer))
    }
  }
  wM2.OTLPTraceExporter = $M2
})
// @from(Start 11176408, End 11176687)
LM2 = z((t40) => {
  Object.defineProperty(t40, "__esModule", {
    value: !0
  });
  t40.OTLPTraceExporter = void 0;
  var Mv5 = NM2();
  Object.defineProperty(t40, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return Mv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11176693, End 11176972)
MM2 = z((e40) => {
  Object.defineProperty(e40, "__esModule", {
    value: !0
  });
  e40.OTLPTraceExporter = void 0;
  var Rv5 = LM2();
  Object.defineProperty(e40, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return Rv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11176978, End 11177257)
OM2 = z((A80) => {
  Object.defineProperty(A80, "__esModule", {
    value: !0
  });
  A80.OTLPTraceExporter = void 0;
  var Pv5 = MM2();
  Object.defineProperty(A80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return Pv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11177263, End 11177760)
SM2 = z((PM2) => {
  Object.defineProperty(PM2, "__esModule", {
    value: !0
  });
  PM2.OTLPTraceExporter = void 0;
  var RM2 = i81(),
    Sv5 = tk(),
    _v5 = sk();
  class TM2 extends _v5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, RM2.createOtlpGrpcExportDelegate)((0, RM2.convertLegacyOtlpGrpcOptions)(A, "TRACES"), Sv5.ProtobufTraceSerializer, "TraceExportService", "/opentelemetry.proto.collector.trace.v1.TraceService/Export"))
    }
  }
  PM2.OTLPTraceExporter = TM2
})
// @from(Start 11177766, End 11178045)
_M2 = z((Q80) => {
  Object.defineProperty(Q80, "__esModule", {
    value: !0
  });
  Q80.OTLPTraceExporter = void 0;
  var kv5 = SM2();
  Object.defineProperty(Q80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return kv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11178051, End 11178187)
xM2 = z((kM2) => {
  Object.defineProperty(kM2, "__esModule", {
    value: !0
  });
  kM2.VERSION = void 0;
  kM2.VERSION = "0.204.0"
})
// @from(Start 11178193, End 11178750)
gM2 = z((fM2) => {
  Object.defineProperty(fM2, "__esModule", {
    value: !0
  });
  fM2.OTLPTraceExporter = void 0;
  var xv5 = sk(),
    vv5 = xM2(),
    bv5 = tk(),
    vM2 = mi();
  class bM2 extends xv5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, vM2.createOtlpHttpExportDelegate)((0, vM2.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${vv5.VERSION}`,
        "Content-Type": "application/json"
      }), bv5.JsonTraceSerializer))
    }
  }
  fM2.OTLPTraceExporter = bM2
})
// @from(Start 11178756, End 11179035)
uM2 = z((B80) => {
  Object.defineProperty(B80, "__esModule", {
    value: !0
  });
  B80.OTLPTraceExporter = void 0;
  var fv5 = gM2();
  Object.defineProperty(B80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return fv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11179041, End 11179320)
mM2 = z((G80) => {
  Object.defineProperty(G80, "__esModule", {
    value: !0
  });
  G80.OTLPTraceExporter = void 0;
  var gv5 = uM2();
  Object.defineProperty(G80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return gv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11179326, End 11179605)
dM2 = z((Z80) => {
  Object.defineProperty(Z80, "__esModule", {
    value: !0
  });
  Z80.OTLPTraceExporter = void 0;
  var mv5 = mM2();
  Object.defineProperty(Z80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return mv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11179607, End 11179802)
class I80 {
  error(A, ...Q) {
    AA(Error(A))
  }
  warn(A, ...Q) {
    AA(Error(A))
  }
  info(A, ...Q) {
    return
  }
  debug(A, ...Q) {
    return
  }
  verbose(A, ...Q) {
    return
  }
}
// @from(Start 11179807, End 11179832)
cM2 = L(() => {
  g1()
})
// @from(Start 11179834, End 11180718)
async function pv5() {
  let A = DI();
  if (A.error) throw g(`Metrics opt-out check failed: ${A.error}`), Error(`Auth error: ${A.error}`);
  let Q = {
    "Content-Type": "application/json",
    "User-Agent": TV(),
    ...A.headers
  };
  try {
    let G = await YQ.get("https://api.anthropic.com/api/claude_code/organizations/metrics_enabled", {
      headers: Q,
      timeout: 5000
    });
    return g(`Metrics opt-out API response: enabled=${G.data.metrics_logging_enabled}, vcsLinking=${G.data.vcs_account_linking_enabled}`), {
      enabled: G.data.metrics_logging_enabled,
      vcsAccountLinkingEnabled: G.data.vcs_account_linking_enabled,
      hasError: !1
    }
  } catch (B) {
    return g(`Failed to check metrics opt-out status: ${B instanceof Error?B.message:String(B)}`), AA(B), {
      enabled: !1,
      vcsAccountLinkingEnabled: !1,
      hasError: !0
    }
  }
}
// @from(Start 11180719, End 11180938)
async function J61() {
  try {
    return await lv5()
  } catch (A) {
    return g("Metrics check failed, defaulting to disabled"), {
      enabled: !1,
      vcsAccountLinkingEnabled: !1,
      hasError: !0
    }
  }
}
// @from(Start 11180943, End 11180956)
cv5 = 3600000
// @from(Start 11180960, End 11180963)
lv5
// @from(Start 11180969, End 11181050)
Y80 = L(() => {
  O3();
  hbA();
  AE();
  V0();
  g1();
  lv5 = fbA(pv5, cv5)
})
// @from(Start 11181052, End 11184687)
class W80 {
  endpoint;
  timeout;
  pendingExports = [];
  isShutdown = !1;
  constructor(A = {}) {
    this.endpoint = "https://api.anthropic.com/api/claude_code/metrics", this.timeout = A.timeout || 5000
  }
  async export (A, Q) {
    if (this.isShutdown) {
      Q({
        code: _JA.ExportResultCode.FAILED,
        error: Error("Exporter has been shutdown")
      });
      return
    }
    let B = this.doExport(A, Q);
    this.pendingExports.push(B), B.finally(() => {
      let G = this.pendingExports.indexOf(B);
      if (G > -1) this.pendingExports.splice(G, 1)
    })
  }
  async doExport(A, Q) {
    try {
      if (!(await J61()).enabled) {
        g("Metrics export disabled by organization setting"), Q({
          code: _JA.ExportResultCode.SUCCESS
        });
        return
      }
      let G = this.transformMetricsForInternal(A),
        Z = DI();
      if (Z.error) {
        g(`Metrics export failed: ${Z.error}`), Q({
          code: _JA.ExportResultCode.FAILED,
          error: Error(Z.error)
        });
        return
      }
      let I = {
          "Content-Type": "application/json",
          "User-Agent": TV(),
          ...Z.headers
        },
        Y = await YQ.post(this.endpoint, G, {
          timeout: this.timeout,
          headers: I
        });
      g("BigQuery metrics exported successfully"), g(`BigQuery API Response: ${JSON.stringify(Y.data,null,2)}`), Q({
        code: _JA.ExportResultCode.SUCCESS
      })
    } catch (B) {
      g(`BigQuery metrics export failed: ${B instanceof Error?B.message:String(B)}`), AA(B), Q({
        code: _JA.ExportResultCode.FAILED,
        error: B instanceof Error ? B : Error("Unknown export error")
      })
    }
  }
  transformMetricsForInternal(A) {
    let Q = A.resource.attributes,
      B = {
        "service.name": Q["service.name"] || "claude-code",
        "service.version": Q["service.version"] || "unknown",
        "os.type": Q["os.type"] || "unknown",
        "os.version": Q["os.version"] || "unknown",
        "host.arch": Q["host.arch"] || "unknown",
        "aggregation.temporality": this.selectAggregationTemporality() === J80.AggregationTemporality.DELTA ? "delta" : "cumulative"
      };
    if (Q["wsl.version"]) B["wsl.version"] = Q["wsl.version"];
    if (BB()) {
      B["user.customer_type"] = "claude_ai";
      let Z = f4();
      if (Z) B["user.subscription_type"] = Z
    } else B["user.customer_type"] = "api";
    return {
      resource_attributes: B,
      metrics: A.scopeMetrics.flatMap((Z) => Z.metrics.map((I) => ({
        name: I.descriptor.name,
        description: I.descriptor.description,
        unit: I.descriptor.unit,
        data_points: this.extractDataPoints(I)
      })))
    }
  }
  extractDataPoints(A) {
    return (A.dataPoints || []).filter((B) => typeof B.value === "number").map((B) => ({
      attributes: this.convertAttributes(B.attributes),
      value: B.value,
      timestamp: this.hrTimeToISOString(B.endTime || B.startTime || [Date.now() / 1000, 0])
    }))
  }
  async shutdown() {
    this.isShutdown = !0, await this.forceFlush(), g("BigQuery metrics exporter shutdown complete")
  }
  async forceFlush() {
    await Promise.all(this.pendingExports), g("BigQuery metrics exporter flush complete")
  }
  convertAttributes(A) {
    let Q = {};
    if (A) {
      for (let [B, G] of Object.entries(A))
        if (G !== void 0 && G !== null) Q[B] = String(G)
    }
    return Q
  }
  hrTimeToISOString(A) {
    let [Q, B] = A;
    return new Date(Q * 1000 + B / 1e6).toISOString()
  }
  selectAggregationTemporality() {
    return J80.AggregationTemporality.DELTA
  }
}
// @from(Start 11184692, End 11184695)
J80
// @from(Start 11184697, End 11184700)
_JA
// @from(Start 11184706, End 11184812)
pM2 = L(() => {
  O3();
  V0();
  g1();
  AE();
  Y80();
  gB();
  J80 = BA(vi(), 1), _JA = BA(e6(), 1)
})
// @from(Start 11184815, End 11184928)
function X80(A) {
  let Q = iv5[A],
    B = process.env[A];
  if (B === void 0) return Q;
  return B === "true"
}
// @from(Start 11184930, End 11185792)
function kJA() {
  let A = hb(),
    Q = e1(),
    B = {
      "user.id": A
    };
  if (X80("OTEL_METRICS_INCLUDE_SESSION_ID")) B["session.id"] = Q;
  if (X80("OTEL_METRICS_INCLUDE_VERSION")) B["app.version"] = {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.VERSION;
  let G = t6();
  if (G) {
    let {
      organizationUuid: Z,
      emailAddress: I,
      accountUuid: Y
    } = G;
    if (Z) B["organization.id"] = Z;
    if (I) B["user.email"] = I;
    if (Y && X80("OTEL_METRICS_INCLUDE_ACCOUNT_UUID")) B["user.account_uuid"] = Y
  }
  if (WU.terminal) B["terminal.type"] = WU.terminal;
  return B
}
// @from(Start 11185797, End 11185800)
iv5
// @from(Start 11185806, End 11185991)
W61 = L(() => {
  _0();
  jQ();
  It();
  gB();
  iv5 = {
    OTEL_METRICS_INCLUDE_SESSION_ID: !0,
    OTEL_METRICS_INCLUDE_VERSION: !1,
    OTEL_METRICS_INCLUDE_ACCOUNT_UUID: !0
  }
})
// @from(Start 11186052, End 11186108)
function Cy(A) {
  return A.spanContext().spanId || ""
}
// @from(Start 11186110, End 11186183)
function NP() {
  return Y0(process.env.ENABLE_ENHANCED_TELEMETRY_BETA)
}
// @from(Start 11186185, End 11186276)
function Hy() {
  return eX.trace.getTracer("com.anthropic.claude_code.tracing", "1.0.0")
}
// @from(Start 11186278, End 11186363)
function FRA(A, Q = {}) {
  return {
    ...kJA(),
    "span.type": A,
    ...Q
  }
}
// @from(Start 11186365, End 11186876)
function nM2(A) {
  if (!NP()) return eX.trace.getActiveSpan() || Hy().startSpan("dummy");
  let Q = Hy(),
    G = Y0(process.env.OTEL_LOG_USER_PROMPTS) ? A : "<REDACTED>";
  lM2++;
  let Z = FRA("interaction", {
      user_prompt: G,
      user_prompt_length: A.length,
      "interaction.sequence": lM2
    }),
    I = Q.startSpan("claude_code.interaction", {
      attributes: Z
    }),
    Y = Cy(I);
  return dE.set(Y, {
    span: I,
    startTime: Date.now(),
    attributes: Z
  }), XRA.enterWith(I), I
}
// @from(Start 11186878, End 11187199)
function X61() {
  if (!NP()) return;
  let A = XRA.getStore();
  if (!A) return;
  let Q = Cy(A),
    B = dE.get(Q);
  if (!B) return;
  if (B.ended) return;
  let G = Date.now() - B.startTime;
  B.span.setAttributes({
    "interaction.duration_ms": G
  }), B.span.end(), B.ended = !0, dE.delete(Q), XRA.exit(() => {})
}
// @from(Start 11187201, End 11187706)
function aM2(A) {
  if (!NP()) return eX.trace.getActiveSpan() || Hy().startSpan("dummy");
  let Q = Hy(),
    B = XRA.getStore(),
    G = FRA("llm_request", {
      model: A,
      "llm_request.context": B ? "interaction" : "standalone"
    }),
    Z = B ? eX.trace.setSpan(eX.context.active(), B) : eX.context.active(),
    I = Q.startSpan("claude_code.llm_request", {
      attributes: G
    }, Z),
    Y = Cy(I);
  return dE.set(Y, {
    span: I,
    startTime: Date.now(),
    attributes: G
  }), I
}
// @from(Start 11187708, End 11188752)
function V80(A) {
  if (!NP()) return;
  let Q;
  for (let [, I] of Array.from(dE.entries()).reverse())
    if (I.attributes["span.type"] === "llm_request") {
      Q = I;
      break
    } if (!Q) return;
  let G = {
    duration_ms: Date.now() - Q.startTime
  };
  if (A) {
    if (A.inputTokens !== void 0) G.input_tokens = A.inputTokens;
    if (A.outputTokens !== void 0) G.output_tokens = A.outputTokens;
    if (A.cacheReadTokens !== void 0) G.cache_read_tokens = A.cacheReadTokens;
    if (A.cacheCreationTokens !== void 0) G.cache_creation_tokens = A.cacheCreationTokens;
    if (A.success !== void 0) G.success = A.success;
    if (A.statusCode !== void 0) G.status_code = A.statusCode;
    if (A.error !== void 0) G.error = A.error;
    if (A.attempt !== void 0) G.attempt = A.attempt;
    if (A.modelResponse !== void 0) {
      let I = Boolean(process.env.OTEL_LOG_MODEL_RESPONSE);
      G.model_response = I ? A.modelResponse : "<REDACTED>"
    }
  }
  Q.span.setAttributes(G), Q.span.end();
  let Z = Cy(Q.span);
  dE.delete(Z)
}
// @from(Start 11188754, End 11189219)
function sM2(A, Q) {
  if (!NP()) return eX.trace.getActiveSpan() || Hy().startSpan("dummy");
  let B = Hy(),
    G = XRA.getStore(),
    Z = FRA("tool", {
      tool_name: A,
      ...Q
    }),
    I = G ? eX.trace.setSpan(eX.context.active(), G) : eX.context.active(),
    Y = B.startSpan("claude_code.tool", {
      attributes: Z
    }, I),
    J = Cy(Y);
  return dE.set(J, {
    span: Y,
    startTime: Date.now(),
    attributes: Z
  }), VRA.enterWith(Y), Y
}
// @from(Start 11189221, End 11189656)
function rM2() {
  if (!NP()) return eX.trace.getActiveSpan() || Hy().startSpan("dummy");
  let A = Hy(),
    Q = VRA.getStore(),
    B = FRA("tool.blocked_on_user"),
    G = Q ? eX.trace.setSpan(eX.context.active(), Q) : eX.context.active(),
    Z = A.startSpan("claude_code.tool.blocked_on_user", {
      attributes: B
    }, G),
    I = Cy(Z);
  return dE.set(I, {
    span: Z,
    startTime: Date.now(),
    attributes: B
  }), Z
}
// @from(Start 11189658, End 11190062)
function F80(A, Q) {
  if (!NP()) return;
  let B;
  for (let [, Y] of Array.from(dE.entries()).reverse())
    if (Y.attributes["span.type"] === "tool.blocked_on_user") {
      B = Y;
      break
    } if (!B) return;
  let Z = {
    duration_ms: Date.now() - B.startTime
  };
  if (A) Z.decision = A;
  if (Q) Z.source = Q;
  B.span.setAttributes(Z), B.span.end();
  let I = Cy(B.span);
  dE.delete(I)
}
// @from(Start 11190064, End 11190487)
function oM2() {
  if (!NP()) return eX.trace.getActiveSpan() || Hy().startSpan("dummy");
  let A = Hy(),
    Q = VRA.getStore(),
    B = FRA("tool.execution"),
    G = Q ? eX.trace.setSpan(eX.context.active(), Q) : eX.context.active(),
    Z = A.startSpan("claude_code.tool.execution", {
      attributes: B
    }, G),
    I = Cy(Z);
  return dE.set(I, {
    span: Z,
    startTime: Date.now(),
    attributes: B
  }), Z
}
// @from(Start 11190489, End 11190950)
function K80(A) {
  if (!NP()) return;
  let Q;
  for (let [, I] of Array.from(dE.entries()).reverse())
    if (I.attributes["span.type"] === "tool.execution") {
      Q = I;
      break
    } if (!Q) return;
  let G = {
    duration_ms: Date.now() - Q.startTime
  };
  if (A) {
    if (A.success !== void 0) G.success = A.success;
    if (A.error !== void 0) G.error = A.error
  }
  Q.span.setAttributes(G), Q.span.end();
  let Z = Cy(Q.span);
  dE.delete(Z)
}
// @from(Start 11190952, End 11191308)
function V61() {
  if (!NP()) return;
  let A;
  for (let [, G] of Array.from(dE.entries()).reverse())
    if (G.attributes["span.type"] === "tool") {
      A = G;
      break
    } if (!A) return;
  let Q = Date.now() - A.startTime;
  A.span.setAttributes({
    duration_ms: Q
  }), A.span.end();
  let B = Cy(A.span);
  dE.delete(B), VRA.exit(() => {})
}
// @from(Start 11191310, End 11191515)
function av5(A, Q = nv5) {
  if (A.length <= Q) return {
    content: A,
    truncated: !1
  };
  return {
    content: A.slice(0, Q) + `

[TRUNCATED - Content exceeds 60KB limit]`,
    truncated: !0
  }
}
// @from(Start 11191517, End 11191582)
function sv5() {
  return Y0(process.env.OTEL_LOG_TOOL_CONTENT)
}
// @from(Start 11191584, End 11191965)
function tM2(A, Q) {
  if (!NP() || !sv5()) return;
  let B = VRA.getStore();
  if (!B) return;
  let G = {};
  for (let [Z, I] of Object.entries(Q))
    if (typeof I === "string") {
      let {
        content: Y,
        truncated: J
      } = av5(I);
      if (G[Z] = Y, J) G[`${Z}_truncated`] = !0, G[`${Z}_original_length`] = I.length
    } else G[Z] = I;
  B.addEvent(A, G)
}
// @from(Start 11191970, End 11191972)
eX
// @from(Start 11191974, End 11191977)
XRA
// @from(Start 11191979, End 11191982)
VRA
// @from(Start 11191984, End 11191986)
dE
// @from(Start 11191988, End 11191995)
lM2 = 0
// @from(Start 11191999, End 11192010)
nv5 = 61440
// @from(Start 11192016, End 11192114)
F0A = L(() => {
  W61();
  hQ();
  eX = BA(K9(), 1), XRA = new iM2, VRA = new iM2, dE = new Map
})
// @from(Start 11192117, End 11192411)
function ev5() {
  if (l0()?.otelHeadersHelper) process.env.OTEL_EXPORTER_OTLP_HEADERS = Object.entries(r4B()).map(([Q, B]) => `${Q}=${B}`).join(",");
  if (!process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE) process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE = "delta"
}
// @from(Start 11192413, End 11193919)
function Ab5() {
  let A = (process.env.OTEL_METRICS_EXPORTER || "").trim().split(",").filter(Boolean),
    Q = parseInt(process.env.OTEL_METRIC_EXPORT_INTERVAL || rv5.toString()),
    B = [];
  for (let G of A)
    if (G === "console") {
      let Z = new F61.ConsoleMetricExporter,
        I = Z.export.bind(Z);
      Z.export = (Y, J) => {
        if (Y.resource && Y.resource.attributes) g(`
=== Resource Attributes ===`), g(JSON.stringify(Y.resource.attributes)), g(`===========================
`);
        return I(Y, J)
      }, B.push(Z)
    } else if (G === "otlp") {
    let Z = process.env.OTEL_EXPORTER_OTLP_METRICS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
      I = z80();
    switch (Z) {
      case "grpc":
        B.push(new AO2.OTLPMetricExporter);
        break;
      case "http/json":
        B.push(new QO2.OTLPMetricExporter(I));
        break;
      case "http/protobuf":
        B.push(new eM2.OTLPMetricExporter(I));
        break;
      default:
        throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${Z}`)
    }
  } else if (G === "prometheus") B.push(new BO2.PrometheusExporter);
  else throw Error(`Unknown exporter type set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${G}`);
  return B.map((G) => {
    if ("export" in G) return new E80.PeriodicExportingMetricReader({
      exporter: G,
      exportIntervalMillis: Q
    });
    return G
  })
}
// @from(Start 11193921, End 11194790)
function Qb5() {
  let A = (process.env.OTEL_LOGS_EXPORTER || "").trim().split(",").filter(Boolean),
    Q = [];
  for (let B of A)
    if (B === "console") Q.push(new xJA.ConsoleLogRecordExporter);
    else if (B === "otlp") {
    let G = process.env.OTEL_EXPORTER_OTLP_LOGS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
      Z = z80();
    switch (G) {
      case "grpc":
        Q.push(new ZO2.OTLPLogExporter);
        break;
      case "http/json":
        Q.push(new IO2.OTLPLogExporter(Z));
        break;
      case "http/protobuf":
        Q.push(new GO2.OTLPLogExporter(Z));
        break;
      default:
        throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_LOGS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${G}`)
    }
  } else throw Error(`Unknown exporter type set in OTEL_LOGS_EXPORTER env var: ${B}`);
  return Q
}
// @from(Start 11194792, End 11195670)
function Bb5() {
  let A = (process.env.OTEL_TRACES_EXPORTER || "").trim().split(",").filter(Boolean),
    Q = [];
  for (let B of A)
    if (B === "console") Q.push(new vJA.ConsoleSpanExporter);
    else if (B === "otlp") {
    let G = process.env.OTEL_EXPORTER_OTLP_TRACES_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
      Z = z80();
    switch (G) {
      case "grpc":
        Q.push(new JO2.OTLPTraceExporter);
        break;
      case "http/json":
        Q.push(new WO2.OTLPTraceExporter(Z));
        break;
      case "http/protobuf":
        Q.push(new YO2.OTLPTraceExporter(Z));
        break;
      default:
        throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_TRACES_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${G}`)
    }
  } else throw Error(`Unknown exporter type set in OTEL_TRACES_EXPORTER env var: ${B}`);
  return Q
}
// @from(Start 11195672, End 11195744)
function D80() {
  return Y0(process.env.CLAUDE_CODE_ENABLE_TELEMETRY)
}
// @from(Start 11195746, End 11195887)
function Gb5() {
  let A = new W80;
  return new E80.PeriodicExportingMetricReader({
    exporter: A,
    exportIntervalMillis: 300000
  })
}
// @from(Start 11195889, End 11195997)
function Zb5() {
  let A = f4(),
    Q = BB() && (A === "enterprise" || A === "team");
  return a4B() || Q
}
// @from(Start 11195999, End 11199920)
function XO2() {
  M9("telemetry_init_start"), ev5(), yJA.diag.setLogger(new I80, yJA.DiagLogLevel.ERROR);
  let A = [];
  if (D80()) A.push(...Ab5());
  if (Zb5()) A.push(Gb5());
  let Q = dQ(),
    B = {
      [In.ATTR_SERVICE_NAME]: "claude-code",
      [In.ATTR_SERVICE_VERSION]: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION
    };
  if (Q === "wsl") {
    let K = ds();
    if (K) B["wsl.version"] = K
  }
  let G = LP.resourceFromAttributes(B),
    Z = LP.resourceFromAttributes(LP.osDetector.detect().attributes || {}),
    I = LP.hostDetector.detect(),
    Y = I.attributes?.[In.SEMRESATTRS_HOST_ARCH] ? {
      [In.SEMRESATTRS_HOST_ARCH]: I.attributes[In.SEMRESATTRS_HOST_ARCH]
    } : {},
    J = LP.resourceFromAttributes(Y),
    W = LP.resourceFromAttributes(LP.envDetector.detect().attributes || {}),
    X = G.merge(Z).merge(J).merge(W),
    V = new F61.MeterProvider({
      resource: X,
      views: [],
      readers: A
    });
  if (cE0(V), D80()) {
    let K = Qb5();
    if (K.length > 0) {
      let D = new xJA.LoggerProvider({
        resource: X,
        processors: K.map((C) => new xJA.BatchLogRecordProcessor(C, {
          scheduledDelayMillis: parseInt(process.env.OTEL_LOGS_EXPORT_INTERVAL || ov5.toString())
        }))
      });
      H80.logs.setGlobalLoggerProvider(D), gE0(D);
      let H = H80.logs.getLogger("com.anthropic.claude_code.events", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION);
      mE0(H), process.on("beforeExit", async () => {
        await D?.forceFlush()
      }), process.on("exit", () => {
        D?.forceFlush()
      })
    }
  }
  if (D80()) {
    if (Y0(process.env.ENABLE_ENHANCED_TELEMETRY_BETA)) {
      let K = Bb5();
      if (K.length > 0) {
        let D = K.map((C) => new vJA.BatchSpanProcessor(C, {
            scheduledDelayMillis: parseInt(process.env.OTEL_TRACES_EXPORT_INTERVAL || tv5.toString())
          })),
          H = new vJA.BasicTracerProvider({
            resource: X,
            spanProcessors: D
          });
        yJA.trace.setGlobalTracerProvider(H), pE0(H)
      }
    }
  }
  return PG(async () => {
    let K = parseInt(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS || "2000");
    try {
      X61();
      let D = [V.shutdown()],
        H = SX1();
      if (H) D.push(H.shutdown());
      let C = _X1();
      if (C) D.push(C.shutdown());
      await Promise.race([Promise.all(D), new Promise((E, U) => setTimeout(() => U(Error("OpenTelemetry shutdown timeout")), K))])
    } catch (D) {
      if (D instanceof Error && D.message.includes("timeout")) g(`
OpenTelemetry telemetry flush timed out after ${K}ms

To resolve this issue, you can:
1. Increase the timeout by setting CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS env var (e.g., 5000 for 5 seconds)
2. Check if your OpenTelemetry backend is experiencing scalability issues
3. Disable OpenTelemetry by unsetting CLAUDE_CODE_ENABLE_TELEMETRY env var

Current timeout: ${K}ms
`, {
        level: "error"
      });
      throw D
    }
  }), V.getMeter("com.anthropic.claude_code", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.VERSION)
}
// @from(Start 11199921, End 11200664)
async function VO2() {
  let A = dE0();
  if (!A) return;
  let Q = parseInt(process.env.CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS || "5000");
  try {
    let B = [A.forceFlush()],
      G = SX1();
    if (G) B.push(G.forceFlush());
    let Z = _X1();
    if (Z) B.push(Z.forceFlush());
    await Promise.race([Promise.all(B), new Promise((I, Y) => setTimeout(() => Y(Error("OpenTelemetry flush timeout")), Q))]), g("Telemetry flushed successfully")
  } catch (B) {
    if (B instanceof Error && B.message.includes("timeout")) g(`Telemetry flush timed out after ${Q}ms. Some metrics may not be exported.`, {
      level: "warn"
    });
    else g(`Telemetry flush failed: ${B instanceof Error?B.message:String(B)}`, {
      level: "error"
    })
  }
}
// @from(Start 11200666, End 11201046)
function z80() {
  let A = Sc(),
    Q = XT(),
    B = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!A || B && qiA(B)) return Q ? {
    httpAgentOptions: Q
  } : {};
  return {
    httpAgentOptions: (Z) => {
      return Q ? new C80.HttpsProxyAgent(A, {
        cert: Q.cert,
        key: Q.key,
        passphrase: Q.passphrase
      }) : new C80.HttpsProxyAgent(A)
    }
  }
}
// @from(Start 11201051, End 11201054)
yJA
// @from(Start 11201056, End 11201059)
H80
// @from(Start 11201061, End 11201064)
F61
// @from(Start 11201066, End 11201069)
eM2
// @from(Start 11201071, End 11201074)
AO2
// @from(Start 11201076, End 11201079)
QO2
// @from(Start 11201081, End 11201084)
BO2
// @from(Start 11201086, End 11201089)
E80
// @from(Start 11201091, End 11201094)
xJA
// @from(Start 11201096, End 11201099)
GO2
// @from(Start 11201101, End 11201104)
ZO2
// @from(Start 11201106, End 11201109)
IO2
// @from(Start 11201111, End 11201114)
vJA
// @from(Start 11201116, End 11201119)
YO2
// @from(Start 11201121, End 11201124)
JO2
// @from(Start 11201126, End 11201129)
WO2
// @from(Start 11201131, End 11201133)
LP
// @from(Start 11201135, End 11201137)
In
// @from(Start 11201139, End 11201142)
C80
// @from(Start 11201144, End 11201155)
rv5 = 60000
// @from(Start 11201159, End 11201169)
ov5 = 5000
// @from(Start 11201173, End 11201183)
tv5 = 5000
// @from(Start 11201189, End 11201698)
U80 = L(() => {
  cM2();
  pM2();
  HH();
  _c();
  gB();
  _0();
  F0A();
  Q3();
  gB();
  MB();
  V0();
  js();
  v3A();
  hQ();
  yJA = BA(K9(), 1), H80 = BA(Ef1(), 1), F61 = BA(vi(), 1), eM2 = BA(lD2(), 1), AO2 = BA(ZN2(), 1), QO2 = BA(w41(), 1), BO2 = BA(DN2(), 1), E80 = BA(vi(), 1), xJA = BA(sf1(), 1), GO2 = BA(MN2(), 1), ZO2 = BA(SN2(), 1), IO2 = BA(mN2(), 1), vJA = BA(HM2(), 1), YO2 = BA(OM2(), 1), JO2 = BA(_M2(), 1), WO2 = BA(dM2(), 1), LP = BA(t3A(), 1), In = BA(qt(), 1), C80 = BA(LEA(), 1)
})
// @from(Start 11201700, End 11202037)
async function w80({
  clearOnboarding: A = !1
}) {
  await VO2(), i4B(), Fw().delete(), K61();
  let B = N1();
  if (A) {
    if (B.hasCompletedOnboarding = !1, B.subscriptionNoticeCount = 0, B.hasAvailableSubscription = !1, B.customApiKeyResponses?.approved) B.customApiKeyResponses.approved = []
  }
  B.oauthAccount = void 0, c0(B)
}
// @from(Start 11202042, End 11202045)
$80
// @from(Start 11202047, End 11202151)
K61 = () => {
    M6.cache?.clear?.(), x4A(), TCB(), KCB(), Zt.cache?.clear?.(), yi.cache?.clear?.()
  }
// @from(Start 11202155, End 11202158)
FO2
// @from(Start 11202164, End 11202834)
D61 = L(() => {
  jQ();
  Bh();
  nt();
  hA();
  gB();
  mbA();
  CS();
  u2();
  gb();
  kW();
  hYA();
  U80();
  unA();
  $80 = BA(VA(), 1);
  FO2 = {
    type: "local-jsx",
    name: "logout",
    description: "Sign out from your Anthropic account",
    isEnabled: () => !process.env.DISABLE_LOGOUT_COMMAND,
    isHidden: !1,
    async call() {
      if (!gH()) await kJ();
      await w80({
        clearOnboarding: !0
      });
      let A = $80.createElement($, null, "Successfully logged out from your Anthropic account.");
      return setTimeout(() => {
        l5(0, "logout")
      }, 200), A
    },
    userFacingName() {
      return "logout"
    }
  }
})
// @from(Start 11202836, End 11205367)
class KRA {
  codeVerifier;
  authCodeListener = null;
  port = null;
  manualAuthCodeResolver = null;
  constructor() {
    this.codeVerifier = RY2()
  }
  async startOAuthFlow(A, Q) {
    this.authCodeListener = new jQ0, this.port = await this.authCodeListener.start();
    let B = TY2(this.codeVerifier),
      G = PY2(),
      Z = {
        codeChallenge: B,
        state: G,
        port: this.port,
        loginWithClaudeAi: Q?.loginWithClaudeAi,
        inferenceOnly: Q?.inferenceOnly,
        orgUUID: Q?.orgUUID
      },
      I = oz1({
        ...Z,
        isManual: !0
      }),
      Y = oz1({
        ...Z,
        isManual: !1
      }),
      J = await this.waitForAuthorizationCode(G, async () => {
        await A(I), await cZ(Y)
      }),
      W = this.authCodeListener?.hasPendingResponse() ?? !1;
    GA("tengu_oauth_auth_code_received", {
      automatic: W
    });
    try {
      let X = await Lo0(J, G, this.codeVerifier, this.port, !W, Q?.expiresIn);
      await w80({
        clearOnboarding: !1
      });
      let V = await tz1(X.access_token);
      if (X.account) ez1({
        accountUuid: X.account.uuid,
        emailAddress: X.account.email_address,
        organizationUuid: X.organization?.uuid,
        displayName: V.displayName,
        hasExtraUsageEnabled: V.hasExtraUsageEnabled ?? void 0
      });
      if (W) {
        let F = cbA(X.scope);
        this.authCodeListener?.handleSuccessRedirect(F)
      }
      return this.formatTokens(X, V.subscriptionType, V.rateLimitTier)
    } catch (X) {
      if (W) this.authCodeListener?.handleErrorRedirect();
      throw X
    } finally {
      this.authCodeListener?.close()
    }
  }
  async waitForAuthorizationCode(A, Q) {
    return new Promise((B, G) => {
      this.manualAuthCodeResolver = B, this.authCodeListener?.waitForAuthorization(A, Q).then((Z) => {
        this.manualAuthCodeResolver = null, B(Z)
      }).catch((Z) => {
        this.manualAuthCodeResolver = null, G(Z)
      })
    })
  }
  handleManualAuthCodeInput(A) {
    if (this.manualAuthCodeResolver) this.manualAuthCodeResolver(A.authorizationCode), this.manualAuthCodeResolver = null, this.authCodeListener?.close()
  }
  formatTokens(A, Q, B) {
    return {
      accessToken: A.access_token,
      refreshToken: A.refresh_token,
      expiresAt: Date.now() + A.expires_in * 1000,
      scopes: cbA(A.scope),
      subscriptionType: Q,
      rateLimitTier: B
    }
  }
  cleanup() {
    this.authCodeListener?.close(), this.manualAuthCodeResolver = null
  }
}
// @from(Start 11205372, End 11205440)
q80 = L(() => {
  gM();
  OY2();
  jY2();
  AL();
  D61();
  q0()
})
// @from(Start 11205443, End 11205514)
function dV(A, Q) {
  return A.flatMap((B, G) => G ? [Q(G), B] : [B])
}
// @from(Start 11205515, End 11205947)
async function Ib5() {
  try {
    if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY)) return !0;
    return await YQ.get("https://api.anthropic.com/api/hello", {
      timeout: 5000,
      headers: {
        "Cache-Control": "no-cache"
      }
    }), !0
  } catch (A) {
    if (!(A instanceof Nn0)) return !0;
    return A.code !== "EHOSTUNREACH"
  }
}
// @from(Start 11205949, End 11206352)
function N80() {
  let [A, Q] = H61.useState(null);
  return H61.useEffect(() => {
    let B = !0;
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
    let G = async () => {
      if (!B) return;
      let I = await Ib5();
      if (B) Q(I)
    };
    G();
    let Z = setInterval(G, Yb5);
    return () => {
      B = !1, clearInterval(Z)
    }
  }, []), {
    isConnected: A
  }
}
// @from(Start 11206357, End 11206360)
H61
// @from(Start 11206362, End 11206373)
Yb5 = 30000
// @from(Start 11206379, End 11206433)
KO2 = L(() => {
  O3();
  hQ();
  H61 = BA(VA(), 1)
})
// @from(Start 11206435, End 11208118)
class bJA {
  activeOperations = new Set;
  lastUserActivityTime = 0;
  lastCLIRecordedTime = Date.now();
  isCLIActive = !1;
  USER_ACTIVITY_TIMEOUT_MS = 5000;
  static instance = null;
  static getInstance() {
    if (!bJA.instance) bJA.instance = new bJA;
    return bJA.instance
  }
  recordUserActivity() {
    if (!this.isCLIActive && this.lastUserActivityTime !== 0) {
      let Q = (Date.now() - this.lastUserActivityTime) / 1000;
      if (Q > 0) {
        let B = jX1();
        if (B) {
          let G = this.USER_ACTIVITY_TIMEOUT_MS / 1000;
          if (Q < G) B.add(Q, {
            type: "user"
          })
        }
      }
    }
    this.lastUserActivityTime = Date.now()
  }
  startCLIActivity(A) {
    if (this.activeOperations.has(A)) this.endCLIActivity(A);
    let Q = this.activeOperations.size === 0;
    if (this.activeOperations.add(A), Q) this.isCLIActive = !0, this.lastCLIRecordedTime = Date.now()
  }
  endCLIActivity(A) {
    if (this.activeOperations.delete(A), this.activeOperations.size === 0) {
      let Q = Date.now(),
        B = (Q - this.lastCLIRecordedTime) / 1000;
      if (B > 0) {
        let G = jX1();
        if (G) G.add(B, {
          type: "cli"
        })
      }
      this.lastCLIRecordedTime = Q, this.isCLIActive = !1
    }
  }
  async trackOperation(A, Q) {
    this.startCLIActivity(A);
    try {
      return await Q()
    } finally {
      this.endCLIActivity(A)
    }
  }
  getActivityStates() {
    return {
      isUserActive: (Date.now() - this.lastUserActivityTime) / 1000 < this.USER_ACTIVITY_TIMEOUT_MS / 1000,
      isCLIActive: this.isCLIActive,
      activeOperationCount: this.activeOperations.size
    }
  }
}
// @from(Start 11208123, End 11208126)
DRA
// @from(Start 11208132, End 11208184)
L80 = L(() => {
  _0();
  DRA = bJA.getInstance()
})
// @from(Start 11208187, End 11208967)
function Yn({
  todos: A,
  isStandalone: Q = !1
}) {
  if (A.length === 0) return null;
  let B = FK.createElement(FK.Fragment, null, A.map((G, Z) => {
    let I = G.status === "completed" ? H1.checkboxOn : H1.checkboxOff;
    return FK.createElement(S, {
      key: Z
    }, FK.createElement($, {
      dimColor: G.status === "completed"
    }, I, " "), FK.createElement($, {
      bold: G.status === "in_progress",
      dimColor: G.status === "completed",
      strikethrough: G.status === "completed"
    }, G.content))
  }));
  if (Q) return FK.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    marginLeft: 2
  }, FK.createElement($, {
    bold: !0,
    dimColor: !0
  }, "Todos"), B);
  return FK.createElement(S, {
    flexDirection: "column"
  }, B)
}
// @from(Start 11208972, End 11208974)
FK
// @from(Start 11208980, End 11209033)
HRA = L(() => {
  hA();
  V9();
  FK = BA(VA(), 1)
})
// @from(Start 11209036, End 11209726)
function DO2({
  streamMode: A
}) {
  let [Q, B] = CRA.useState(null), [G, Z] = CRA.useState(null);
  if (CRA.useEffect(() => {
      if (A === "thinking" && Q === null) B(Date.now());
      else if (A !== "thinking" && Q !== null) Z(Date.now() - Q), B(null)
    }, [A, Q]), A === "thinking") return MP.createElement(S, {
    marginTop: 1
  }, MP.createElement($, {
    dimColor: !0
  }, "∴ Thinking…"));
  if (G !== null) return MP.createElement(S, {
    marginTop: 1
  }, MP.createElement($, {
    dimColor: !0
  }, "∴ Thought for ", Math.max(1, Math.round(G / 1000)), "s (", MP.createElement($, {
    dimColor: !0,
    bold: !0
  }, "ctrl+o"), " ", "to show thinking)"));
  return null
}
// @from(Start 11209731, End 11209733)
MP
// @from(Start 11209735, End 11209738)
CRA
// @from(Start 11209744, End 11209808)
HO2 = L(() => {
  hA();
  MP = BA(VA(), 1), CRA = BA(VA(), 1)
})
// @from(Start 11209811, End 11210017)
function ERA() {
  if (process.env.TERM === "xterm-ghostty") return ["·", "✢", "✳", "✶", "✻", "*"];
  return process.platform === "darwin" ? ["·", "✢", "✳", "✶", "✻", "✽"] : ["·", "✢", "*", "✶", "✻", "✽"]
}
// @from(Start 11210019, End 11210184)
function K0A(A, Q, B) {
  return {
    r: Math.round(A.r + (Q.r - A.r) * B),
    g: Math.round(A.g + (Q.g - A.g) * B),
    b: Math.round(A.b + (Q.b - A.b) * B)
  }
}
// @from(Start 11210186, End 11210242)
function fJA(A) {
  return `rgb(${A.r},${A.g},${A.b})`
}
// @from(Start 11210244, End 11210453)
function O80({
  char: A,
  flashOpacity: Q
}) {
  let Z = K0A({
    r: 215,
    g: 119,
    b: 87
  }, {
    r: 245,
    g: 149,
    b: 117
  }, Q);
  return M80.createElement($, {
    color: fJA(Z)
  }, A)
}
// @from(Start 11210458, End 11210461)
M80
// @from(Start 11210467, End 11210513)
R80 = L(() => {
  hA();
  M80 = BA(VA(), 1)
})
// @from(Start 11210516, End 11211493)
function T80({
  message: A,
  mode: Q,
  isConnected: B,
  messageColor: G,
  glimmerIndex: Z,
  flashOpacity: I,
  shimmerColor: Y,
  stalledIntensity: J = 0
}) {
  if (!A) return null;
  if (B === !1) return hJ.createElement($, {
    color: G
  }, A, " ");
  if (J > 0) {
    let V = K0A({
        r: 215,
        g: 119,
        b: 87
      }, {
        r: 171,
        g: 43,
        b: 63
      }, J),
      F = fJA(V);
    return hJ.createElement(hJ.Fragment, null, hJ.createElement($, {
      color: F
    }, A), hJ.createElement($, {
      color: F
    }, " "))
  }
  return hJ.createElement(hJ.Fragment, null, A.split("").map((W, X) => {
    if (Q === "tool-use") return hJ.createElement(O80, {
      key: X,
      char: W,
      flashOpacity: I
    });
    else return hJ.createElement(AGA, {
      key: X,
      char: W,
      index: X,
      glimmerIndex: Z,
      messageColor: G,
      shimmerColor: Y
    })
  }), hJ.createElement($, {
    color: G
  }, " "))
}
// @from(Start 11211498, End 11211500)
hJ
// @from(Start 11211506, End 11211569)
CO2 = L(() => {
  hA();
  R80();
  KrA();
  hJ = BA(VA(), 1)
})
// @from(Start 11211572, End 11212259)
function P80({
  frame: A,
  messageColor: Q,
  stalledIntensity: B = 0,
  isConnected: G
}) {
  let Z = zO2[A % zO2.length];
  if (G === !1) return Rq.createElement(S, {
    flexWrap: "wrap",
    height: 1,
    width: 2
  }, Rq.createElement($, {
    color: Q
  }, Z));
  if (B > 0) {
    let J = K0A({
      r: 215,
      g: 119,
      b: 87
    }, {
      r: 171,
      g: 43,
      b: 63
    }, B);
    return Rq.createElement(S, {
      flexWrap: "wrap",
      height: 1,
      width: 2
    }, Rq.createElement($, {
      color: fJA(J)
    }, Z))
  }
  return Rq.createElement(S, {
    flexWrap: "wrap",
    height: 1,
    width: 2
  }, Rq.createElement($, {
    color: Q
  }, Z))
}
// @from(Start 11212264, End 11212266)
Rq
// @from(Start 11212268, End 11212271)
EO2
// @from(Start 11212273, End 11212276)
zO2
// @from(Start 11212282, End 11212379)
UO2 = L(() => {
  hA();
  Rq = BA(VA(), 1), EO2 = ERA(), zO2 = [...EO2, ...[...EO2].reverse()]
})
// @from(Start 11212382, End 11212601)
function j80(A) {
  let [Q, B] = $O2.useState(0);
  return CI(() => {
    if (A === "tool-use") B(() => {
      let G = Date.now() / 1000;
      return (Math.sin(G * Math.PI) + 1) / 2
    });
    else B(0)
  }, 50), Q
}
// @from(Start 11212606, End 11212609)
$O2
// @from(Start 11212615, End 11212661)
wO2 = L(() => {
  JE();
  $O2 = BA(VA(), 1)
})
// @from(Start 11212664, End 11213240)
function S80(A, Q = !1) {
  let [B, G] = D0A.useState(0), [Z, I] = D0A.useState(0), Y = D0A.useRef(A);
  D0A.useEffect(() => {
    if (A > Y.current) G(0), I(0), Y.current = A
  }, [A]), CI(() => {
    if (A > 0 && A === Y.current && !Q) G((X) => X + 100);
    else if (A === 0 || Q) G(0)
  }, 100);
  let J = B > 3000 && !Q,
    W = J ? Math.min((B - 3000) / 2000, 1) : 0;
  return CI(() => {
    I((X) => {
      let V = W,
        F = V - X;
      if (Math.abs(F) < 0.01) return V;
      return X + F * 0.1
    })
  }, 50), {
    isStalled: J,
    stalledIntensity: Z
  }
}
// @from(Start 11213245, End 11213248)
D0A
// @from(Start 11213254, End 11213300)
qO2 = L(() => {
  JE();
  D0A = BA(VA(), 1)
})
// @from(Start 11213306, End 11213386)
NO2 = L(() => {
  R80();
  KrA();
  CO2();
  UO2();
  Lm1();
  wO2();
  qO2()
})
// @from(Start 11213389, End 11217108)
function OO2({
  mode: A,
  elapsedTimeMs: Q,
  spinnerTip: B,
  currentResponseLength: G,
  overrideColor: Z,
  overrideShimmerColor: I,
  overrideMessage: Y,
  spinnerSuffix: J,
  verbose: W,
  todos: X,
  hasActiveTools: V = !1
}) {
  let F = Vb5(),
    [K, D] = OP.useState(0),
    [H, C] = OP.useState(0),
    [E] = OQ(),
    {
      isConnected: U
    } = N80(),
    {
      columns: q
    } = WB(),
    w = X?.find((OA) => OA.status === "in_progress"),
    N = X?.find((OA) => OA.status === "pending"),
    R = OP.useMemo(() => as(F), [F]),
    T = (Y ?? w?.activeForm ?? R) + "…",
    {
      isStalled: y,
      stalledIntensity: v
    } = S80(G, V),
    x = T$A(A, T, U, y),
    p = j80(A),
    u = OP.useRef(G);
  OP.useEffect(() => {
    let OA = "spinner-" + A;
    return DRA.startCLIActivity(OA), () => {
      DRA.endCLIActivity(OA)
    }
  }, [A]), OP.useEffect(() => {
    u.current = G
  }, [G]), CI(() => {
    if (!U) {
      D(4);
      return
    }
    D((OA) => OA + 1)
  }, 120), CI(() => {
    C((OA) => {
      let mA = u.current - OA;
      if (mA <= 0) return OA;
      let wA;
      if (mA < 70) wA = 1;
      else if (mA < 200) wA = Math.max(2, Math.ceil(mA * 0.08));
      else wA = 18;
      return Math.min(OA + wA, u.current)
    })
  }, 10);
  let e = T.length + 2,
    l = 16,
    k = q > e + 20,
    m = X && X.length > 0 && k && q > e + l + 25,
    o = (W || Q > Wb5) && k && q > e + l + (m ? 25 : 0) + 25,
    IA = [...k ? [sB.createElement($, {
      dimColor: !0,
      key: "esc"
    }, sB.createElement(E4, {
      shortcut: "esc",
      action: "interrupt",
      bold: !0
    }))] : [], ...J ? [sB.createElement($, {
      dimColor: !0,
      key: "suffix"
    }, J)] : [], ...m ? [sB.createElement($, {
      dimColor: !0,
      key: "todo"
    }, sB.createElement(E4, {
      shortcut: "ctrl+t",
      action: `${E.showExpandedTodos?"hide":"show"} todos`,
      bold: !0
    }))] : [], ...o ? [sB.createElement($, {
      dimColor: !0,
      key: "elapsedTime"
    }, eC(Q)), sB.createElement(S, {
      flexDirection: "row",
      key: "tokens"
    }, sB.createElement(Xb5, {
      mode: A,
      key: "spinnerMode"
    }), sB.createElement($, {
      dimColor: !0
    }, JZ(Math.round(H / 4)), " tokens"))] : []];
  if (U === !1) IA.push(sB.createElement(S, {
    key: "offline"
  }, sB.createElement($, {
    color: "error",
    bold: !0
  }, "offline")));
  let FA = Z ?? (U === !1 ? "inactive" : "claude"),
    zA = I ?? "claudeShimmer",
    NA = IA.length > 0 ? sB.createElement(sB.Fragment, null, sB.createElement($, {
      dimColor: !0
    }, "("), dV(IA, (OA) => sB.createElement($, {
      dimColor: !0,
      key: `separator-${OA}`
    }, " ", "·", " ")), sB.createElement($, {
      dimColor: !0
    }, ")")) : null;
  return sB.createElement(S, {
    flexDirection: "column",
    width: "100%",
    alignItems: "flex-start"
  }, sB.createElement(DO2, {
    streamMode: A
  }), sB.createElement(S, {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 1,
    width: "100%"
  }, sB.createElement(P80, {
    frame: K,
    messageColor: FA,
    stalledIntensity: v,
    isConnected: U
  }), sB.createElement(T80, {
    message: T,
    mode: A,
    isConnected: U,
    messageColor: FA,
    glimmerIndex: x,
    flashOpacity: p,
    shimmerColor: zA,
    stalledIntensity: v
  }), NA), E.showExpandedTodos && X && X.length > 0 ? sB.createElement(S, {
    width: "100%",
    flexDirection: "column"
  }, sB.createElement(S0, null, sB.createElement(Yn, {
    todos: X
  }))) : N || B ? sB.createElement(S, {
    width: "100%"
  }, sB.createElement(S0, null, sB.createElement($, {
    dimColor: !0
  }, N ? `Next: ${N.content}` : `Tip: ${B}`))) : null)
}
// @from(Start 11217110, End 11217526)
function Xb5({
  mode: A
}) {
  switch (A) {
    case "tool-input":
    case "tool-use":
    case "responding":
    case "thinking":
      return sB.createElement(S, {
        width: 2
      }, sB.createElement($, {
        dimColor: !0
      }, H1.arrowDown));
    case "requesting":
      return sB.createElement(S, {
        width: 2
      }, sB.createElement($, {
        dimColor: !0
      }, H1.arrowUp))
  }
}
// @from(Start 11217528, End 11217831)
function g4() {
  let [A, Q] = OP.useState(0), {
    isConnected: B
  } = N80();
  return CI(() => {
    Q((Z) => (Z + 1) % MO2.length)
  }, 120), sB.createElement(S, {
    flexWrap: "wrap",
    height: 1,
    width: 2
  }, sB.createElement($, {
    color: B === !1 ? "inactive" : "text"
  }, MO2[A]))
}
// @from(Start 11217833, End 11217898)
function Vb5() {
  return snA("tengu_spinner_words", Jb5).words
}
// @from(Start 11217903, End 11217905)
sB
// @from(Start 11217907, End 11217909)
OP
// @from(Start 11217911, End 11217914)
LO2
// @from(Start 11217916, End 11217919)
MO2
// @from(Start 11217921, End 11217924)
Jb5
// @from(Start 11217926, End 11217937)
Wb5 = 30000
// @from(Start 11217943, End 11219321)
DY = L(() => {
  hA();
  LxA();
  JE();
  V9();
  KO2();
  L80();
  u2();
  q8();
  HRA();
  z9();
  i8();
  HO2();
  dF();
  NO2();
  sB = BA(VA(), 1), OP = BA(VA(), 1), LO2 = ERA(), MO2 = [...LO2, ...[...LO2].reverse()], Jb5 = {
    words: ["Accomplishing", "Actioning", "Actualizing", "Baking", "Booping", "Brewing", "Calculating", "Cerebrating", "Channelling", "Churning", "Clauding", "Coalescing", "Cogitating", "Computing", "Combobulating", "Concocting", "Considering", "Contemplating", "Cooking", "Crafting", "Creating", "Crunching", "Deciphering", "Deliberating", "Determining", "Discombobulating", "Doing", "Effecting", "Elucidating", "Enchanting", "Envisioning", "Finagling", "Flibbertigibbeting", "Forging", "Forming", "Frolicking", "Generating", "Germinating", "Hatching", "Herding", "Honking", "Ideating", "Imagining", "Incubating", "Inferring", "Manifesting", "Marinating", "Meandering", "Moseying", "Mulling", "Mustering", "Musing", "Noodling", "Percolating", "Perusing", "Philosophising", "Pontificating", "Pondering", "Processing", "Puttering", "Puzzling", "Reticulating", "Ruminating", "Scheming", "Schlepping", "Shimmying", "Simmering", "Smooshing", "Spelunking", "Spinning", "Stewing", "Sussing", "Synthesizing", "Thinking", "Tinkering", "Transmuting", "Unfurling", "Unravelling", "Vibing", "Wandering", "Whirring", "Wibbling", "Working", "Wrangling"]
  }
})
// @from(Start 11219327, End 11220660)
zRA = z((Db5) => {
  function Fb5(A, Q, B) {
    if (B === void 0) B = Array.prototype;
    if (A && typeof B.find === "function") return B.find.call(A, Q);
    for (var G = 0; G < A.length; G++)
      if (Object.prototype.hasOwnProperty.call(A, G)) {
        var Z = A[G];
        if (Q.call(void 0, Z, G, A)) return Z
      }
  }

  function _80(A, Q) {
    if (Q === void 0) Q = Object;
    return Q && typeof Q.freeze === "function" ? Q.freeze(A) : A
  }

  function Kb5(A, Q) {
    if (A === null || typeof A !== "object") throw TypeError("target is not an object");
    for (var B in Q)
      if (Object.prototype.hasOwnProperty.call(Q, B)) A[B] = Q[B];
    return A
  }
  var RO2 = _80({
      HTML: "text/html",
      isHTML: function(A) {
        return A === RO2.HTML
      },
      XML_APPLICATION: "application/xml",
      XML_TEXT: "text/xml",
      XML_XHTML_APPLICATION: "application/xhtml+xml",
      XML_SVG_IMAGE: "image/svg+xml"
    }),
    TO2 = _80({
      HTML: "http://www.w3.org/1999/xhtml",
      isHTML: function(A) {
        return A === TO2.HTML
      },
      SVG: "http://www.w3.org/2000/svg",
      XML: "http://www.w3.org/XML/1998/namespace",
      XMLNS: "http://www.w3.org/2000/xmlns/"
    });
  Db5.assign = Kb5;
  Db5.find = Fb5;
  Db5.freeze = _80;
  Db5.MIME_TYPE = RO2;
  Db5.NAMESPACE = TO2
})
// @from(Start 11220666, End 11248690)
d80 = z((kb5) => {
  var vO2 = zRA(),
    Ey = vO2.find,
    URA = vO2.NAMESPACE;

  function $b5(A) {
    return A !== ""
  }

  function wb5(A) {
    return A ? A.split(/[\t\n\f\r ]+/).filter($b5) : []
  }

  function qb5(A, Q) {
    if (!A.hasOwnProperty(Q)) A[Q] = !0;
    return A
  }

  function PO2(A) {
    if (!A) return [];
    var Q = wb5(A);
    return Object.keys(Q.reduce(qb5, {}))
  }

  function Nb5(A) {
    return function(Q) {
      return A && A.indexOf(Q) !== -1
    }
  }

  function wRA(A, Q) {
    for (var B in A)
      if (Object.prototype.hasOwnProperty.call(A, B)) Q[B] = A[B]
  }

  function Z$(A, Q) {
    var B = A.prototype;
    if (!(B instanceof Q)) {
      let Z = function() {};
      var G = Z;
      Z.prototype = Q.prototype, Z = new Z, wRA(B, Z), A.prototype = B = Z
    }
    if (B.constructor != A) {
      if (typeof A != "function") console.error("unknown Class:" + A);
      B.constructor = A
    }
  }
  var I$ = {},
    RP = I$.ELEMENT_NODE = 1,
    gJA = I$.ATTRIBUTE_NODE = 2,
    C61 = I$.TEXT_NODE = 3,
    bO2 = I$.CDATA_SECTION_NODE = 4,
    fO2 = I$.ENTITY_REFERENCE_NODE = 5,
    Lb5 = I$.ENTITY_NODE = 6,
    hO2 = I$.PROCESSING_INSTRUCTION_NODE = 7,
    gO2 = I$.COMMENT_NODE = 8,
    uO2 = I$.DOCUMENT_NODE = 9,
    mO2 = I$.DOCUMENT_TYPE_NODE = 10,
    gh = I$.DOCUMENT_FRAGMENT_NODE = 11,
    Mb5 = I$.NOTATION_NODE = 12,
    ZC = {},
    KK = {},
    bsG = ZC.INDEX_SIZE_ERR = (KK[1] = "Index size error", 1),
    fsG = ZC.DOMSTRING_SIZE_ERR = (KK[2] = "DOMString size error", 2),
    G$ = ZC.HIERARCHY_REQUEST_ERR = (KK[3] = "Hierarchy request error", 3),
    hsG = ZC.WRONG_DOCUMENT_ERR = (KK[4] = "Wrong document", 4),
    gsG = ZC.INVALID_CHARACTER_ERR = (KK[5] = "Invalid character", 5),
    usG = ZC.NO_DATA_ALLOWED_ERR = (KK[6] = "No data allowed", 6),
    msG = ZC.NO_MODIFICATION_ALLOWED_ERR = (KK[7] = "No modification allowed", 7),
    dO2 = ZC.NOT_FOUND_ERR = (KK[8] = "Not found", 8),
    dsG = ZC.NOT_SUPPORTED_ERR = (KK[9] = "Not supported", 9),
    jO2 = ZC.INUSE_ATTRIBUTE_ERR = (KK[10] = "Attribute in use", 10),
    csG = ZC.INVALID_STATE_ERR = (KK[11] = "Invalid state", 11),
    psG = ZC.SYNTAX_ERR = (KK[12] = "Syntax error", 12),
    lsG = ZC.INVALID_MODIFICATION_ERR = (KK[13] = "Invalid modification", 13),
    isG = ZC.NAMESPACE_ERR = (KK[14] = "Invalid namespace", 14),
    nsG = ZC.INVALID_ACCESS_ERR = (KK[15] = "Invalid access", 15);

  function fW(A, Q) {
    if (Q instanceof Error) var B = Q;
    else if (B = this, Error.call(this, KK[A]), this.message = KK[A], Error.captureStackTrace) Error.captureStackTrace(this, fW);
    if (B.code = A, Q) this.message = this.message + ": " + Q;
    return B
  }
  fW.prototype = Error.prototype;
  wRA(ZC, fW);

  function hh() {}
  hh.prototype = {
    length: 0,
    item: function(A) {
      return A >= 0 && A < this.length ? this[A] : null
    },
    toString: function(A, Q) {
      for (var B = [], G = 0; G < this.length; G++) hJA(this[G], B, A, Q);
      return B.join("")
    },
    filter: function(A) {
      return Array.prototype.filter.call(this, A)
    },
    indexOf: function(A) {
      return Array.prototype.indexOf.call(this, A)
    }
  };

  function uJA(A, Q) {
    this._node = A, this._refresh = Q, x80(this)
  }

  function x80(A) {
    var Q = A._node._inc || A._node.ownerDocument._inc;
    if (A._inc !== Q) {
      var B = A._refresh(A._node);
      if (AR2(A, "length", B.length), !A.$$length || B.length < A.$$length) {
        for (var G = B.length; G in A; G++)
          if (Object.prototype.hasOwnProperty.call(A, G)) delete A[G]
      }
      wRA(B, A), A._inc = Q
    }
  }
  uJA.prototype.item = function(A) {
    return x80(this), this[A] || null
  };
  Z$(uJA, hh);

  function E61() {}

  function cO2(A, Q) {
    var B = A.length;
    while (B--)
      if (A[B] === Q) return B
  }

  function SO2(A, Q, B, G) {
    if (G) Q[cO2(Q, G)] = B;
    else Q[Q.length++] = B;
    if (A) {
      B.ownerElement = A;
      var Z = A.ownerDocument;
      if (Z) G && iO2(Z, A, G), Ob5(Z, A, B)
    }
  }

  function _O2(A, Q, B) {
    var G = cO2(Q, B);
    if (G >= 0) {
      var Z = Q.length - 1;
      while (G < Z) Q[G] = Q[++G];
      if (Q.length = Z, A) {
        var I = A.ownerDocument;
        if (I) iO2(I, A, B), B.ownerElement = null
      }
    } else throw new fW(dO2, Error(A.tagName + "@" + B))
  }
  E61.prototype = {
    length: 0,
    item: hh.prototype.item,
    getNamedItem: function(A) {
      var Q = this.length;
      while (Q--) {
        var B = this[Q];
        if (B.nodeName == A) return B
      }
    },
    setNamedItem: function(A) {
      var Q = A.ownerElement;
      if (Q && Q != this._ownerElement) throw new fW(jO2);
      var B = this.getNamedItem(A.nodeName);
      return SO2(this._ownerElement, this, A, B), B
    },
    setNamedItemNS: function(A) {
      var Q = A.ownerElement,
        B;
      if (Q && Q != this._ownerElement) throw new fW(jO2);
      return B = this.getNamedItemNS(A.namespaceURI, A.localName), SO2(this._ownerElement, this, A, B), B
    },
    removeNamedItem: function(A) {
      var Q = this.getNamedItem(A);
      return _O2(this._ownerElement, this, Q), Q
    },
    removeNamedItemNS: function(A, Q) {
      var B = this.getNamedItemNS(A, Q);
      return _O2(this._ownerElement, this, B), B
    },
    getNamedItemNS: function(A, Q) {
      var B = this.length;
      while (B--) {
        var G = this[B];
        if (G.localName == Q && G.namespaceURI == A) return G
      }
      return null
    }
  };

  function pO2() {}
  pO2.prototype = {
    hasFeature: function(A, Q) {
      return !0
    },
    createDocument: function(A, Q, B) {
      var G = new qRA;
      if (G.implementation = this, G.childNodes = new hh, G.doctype = B || null, B) G.appendChild(B);
      if (Q) {
        var Z = G.createElementNS(A, Q);
        G.appendChild(Z)
      }
      return G
    },
    createDocumentType: function(A, Q, B) {
      var G = new $61;
      return G.name = A, G.nodeName = A, G.publicId = Q || "", G.systemId = B || "", G
    }
  };

  function UG() {}
  UG.prototype = {
    firstChild: null,
    lastChild: null,
    previousSibling: null,
    nextSibling: null,
    attributes: null,
    parentNode: null,
    childNodes: null,
    ownerDocument: null,
    nodeValue: null,
    namespaceURI: null,
    prefix: null,
    localName: null,
    insertBefore: function(A, Q) {
      return z61(this, A, Q)
    },
    replaceChild: function(A, Q) {
      if (z61(this, A, Q, aO2), Q) this.removeChild(Q)
    },
    removeChild: function(A) {
      return nO2(this, A)
    },
    appendChild: function(A) {
      return this.insertBefore(A, null)
    },
    hasChildNodes: function() {
      return this.firstChild != null
    },
    cloneNode: function(A) {
      return y80(this.ownerDocument || this, this, A)
    },
    normalize: function() {
      var A = this.firstChild;
      while (A) {
        var Q = A.nextSibling;
        if (Q && Q.nodeType == C61 && A.nodeType == C61) this.removeChild(Q), A.appendData(Q.data);
        else A.normalize(), A = Q
      }
    },
    isSupported: function(A, Q) {
      return this.ownerDocument.implementation.hasFeature(A, Q)
    },
    hasAttributes: function() {
      return this.attributes.length > 0
    },
    lookupPrefix: function(A) {
      var Q = this;
      while (Q) {
        var B = Q._nsMap;
        if (B) {
          for (var G in B)
            if (Object.prototype.hasOwnProperty.call(B, G) && B[G] === A) return G
        }
        Q = Q.nodeType == gJA ? Q.ownerDocument : Q.parentNode
      }
      return null
    },
    lookupNamespaceURI: function(A) {
      var Q = this;
      while (Q) {
        var B = Q._nsMap;
        if (B) {
          if (Object.prototype.hasOwnProperty.call(B, A)) return B[A]
        }
        Q = Q.nodeType == gJA ? Q.ownerDocument : Q.parentNode
      }
      return null
    },
    isDefaultNamespace: function(A) {
      var Q = this.lookupPrefix(A);
      return Q == null
    }
  };

  function lO2(A) {
    return A == "<" && "&lt;" || A == ">" && "&gt;" || A == "&" && "&amp;" || A == '"' && "&quot;" || "&#" + A.charCodeAt() + ";"
  }
  wRA(I$, UG);
  wRA(I$, UG.prototype);

  function $RA(A, Q) {
    if (Q(A)) return !0;
    if (A = A.firstChild)
      do
        if ($RA(A, Q)) return !0; while (A = A.nextSibling)
  }

  function qRA() {
    this.ownerDocument = this
  }

  function Ob5(A, Q, B) {
    A && A._inc++;
    var G = B.namespaceURI;
    if (G === URA.XMLNS) Q._nsMap[B.prefix ? B.localName : ""] = B.value
  }

  function iO2(A, Q, B, G) {
    A && A._inc++;
    var Z = B.namespaceURI;
    if (Z === URA.XMLNS) delete Q._nsMap[B.prefix ? B.localName : ""]
  }

  function v80(A, Q, B) {
    if (A && A._inc) {
      A._inc++;
      var G = Q.childNodes;
      if (B) G[G.length++] = B;
      else {
        var Z = Q.firstChild,
          I = 0;
        while (Z) G[I++] = Z, Z = Z.nextSibling;
        G.length = I, delete G[G.length]
      }
    }
  }

  function nO2(A, Q) {
    var {
      previousSibling: B,
      nextSibling: G
    } = Q;
    if (B) B.nextSibling = G;
    else A.firstChild = G;
    if (G) G.previousSibling = B;
    else A.lastChild = B;
    return Q.parentNode = null, Q.previousSibling = null, Q.nextSibling = null, v80(A.ownerDocument, A), Q
  }

  function Rb5(A) {
    return A && (A.nodeType === UG.DOCUMENT_NODE || A.nodeType === UG.DOCUMENT_FRAGMENT_NODE || A.nodeType === UG.ELEMENT_NODE)
  }

  function Tb5(A) {
    return A && (zy(A) || b80(A) || uh(A) || A.nodeType === UG.DOCUMENT_FRAGMENT_NODE || A.nodeType === UG.COMMENT_NODE || A.nodeType === UG.PROCESSING_INSTRUCTION_NODE)
  }

  function uh(A) {
    return A && A.nodeType === UG.DOCUMENT_TYPE_NODE
  }

  function zy(A) {
    return A && A.nodeType === UG.ELEMENT_NODE
  }

  function b80(A) {
    return A && A.nodeType === UG.TEXT_NODE
  }

  function kO2(A, Q) {
    var B = A.childNodes || [];
    if (Ey(B, zy) || uh(Q)) return !1;
    var G = Ey(B, uh);
    return !(Q && G && B.indexOf(G) > B.indexOf(Q))
  }

  function yO2(A, Q) {
    var B = A.childNodes || [];

    function G(I) {
      return zy(I) && I !== Q
    }
    if (Ey(B, G)) return !1;
    var Z = Ey(B, uh);
    return !(Q && Z && B.indexOf(Z) > B.indexOf(Q))
  }

  function Pb5(A, Q, B) {
    if (!Rb5(A)) throw new fW(G$, "Unexpected parent node type " + A.nodeType);
    if (B && B.parentNode !== A) throw new fW(dO2, "child not in parent");
    if (!Tb5(Q) || uh(Q) && A.nodeType !== UG.DOCUMENT_NODE) throw new fW(G$, "Unexpected node type " + Q.nodeType + " for parent node type " + A.nodeType)
  }

  function jb5(A, Q, B) {
    var G = A.childNodes || [],
      Z = Q.childNodes || [];
    if (Q.nodeType === UG.DOCUMENT_FRAGMENT_NODE) {
      var I = Z.filter(zy);
      if (I.length > 1 || Ey(Z, b80)) throw new fW(G$, "More than one element or text in fragment");
      if (I.length === 1 && !kO2(A, B)) throw new fW(G$, "Element in fragment can not be inserted before doctype")
    }
    if (zy(Q)) {
      if (!kO2(A, B)) throw new fW(G$, "Only one element can be added and only after doctype")
    }
    if (uh(Q)) {
      if (Ey(G, uh)) throw new fW(G$, "Only one doctype is allowed");
      var Y = Ey(G, zy);
      if (B && G.indexOf(Y) < G.indexOf(B)) throw new fW(G$, "Doctype can only be inserted before an element");
      if (!B && Y) throw new fW(G$, "Doctype can not be appended since element is present")
    }
  }

  function aO2(A, Q, B) {
    var G = A.childNodes || [],
      Z = Q.childNodes || [];
    if (Q.nodeType === UG.DOCUMENT_FRAGMENT_NODE) {
      var I = Z.filter(zy);
      if (I.length > 1 || Ey(Z, b80)) throw new fW(G$, "More than one element or text in fragment");
      if (I.length === 1 && !yO2(A, B)) throw new fW(G$, "Element in fragment can not be inserted before doctype")
    }
    if (zy(Q)) {
      if (!yO2(A, B)) throw new fW(G$, "Only one element can be added and only after doctype")
    }
    if (uh(Q)) {
      let W = function(X) {
        return uh(X) && X !== B
      };
      var J = W;
      if (Ey(G, W)) throw new fW(G$, "Only one doctype is allowed");
      var Y = Ey(G, zy);
      if (B && G.indexOf(Y) < G.indexOf(B)) throw new fW(G$, "Doctype can only be inserted before an element")
    }
  }

  function z61(A, Q, B, G) {
    if (Pb5(A, Q, B), A.nodeType === UG.DOCUMENT_NODE)(G || jb5)(A, Q, B);
    var Z = Q.parentNode;
    if (Z) Z.removeChild(Q);
    if (Q.nodeType === gh) {
      var I = Q.firstChild;
      if (I == null) return Q;
      var Y = Q.lastChild
    } else I = Y = Q;
    var J = B ? B.previousSibling : A.lastChild;
    if (I.previousSibling = J, Y.nextSibling = B, J) J.nextSibling = I;
    else A.firstChild = I;
    if (B == null) A.lastChild = Y;
    else B.previousSibling = Y;
    do I.parentNode = A; while (I !== Y && (I = I.nextSibling));
    if (v80(A.ownerDocument || A, A), Q.nodeType == gh) Q.firstChild = Q.lastChild = null;
    return Q
  }

  function Sb5(A, Q) {
    if (Q.parentNode) Q.parentNode.removeChild(Q);
    if (Q.parentNode = A, Q.previousSibling = A.lastChild, Q.nextSibling = null, Q.previousSibling) Q.previousSibling.nextSibling = Q;
    else A.firstChild = Q;
    return A.lastChild = Q, v80(A.ownerDocument, A, Q), Q
  }
  qRA.prototype = {
    nodeName: "#document",
    nodeType: uO2,
    doctype: null,
    documentElement: null,
    _inc: 1,
    insertBefore: function(A, Q) {
      if (A.nodeType == gh) {
        var B = A.firstChild;
        while (B) {
          var G = B.nextSibling;
          this.insertBefore(B, Q), B = G
        }
        return A
      }
      if (z61(this, A, Q), A.ownerDocument = this, this.documentElement === null && A.nodeType === RP) this.documentElement = A;
      return A
    },
    removeChild: function(A) {
      if (this.documentElement == A) this.documentElement = null;
      return nO2(this, A)
    },
    replaceChild: function(A, Q) {
      if (z61(this, A, Q, aO2), A.ownerDocument = this, Q) this.removeChild(Q);
      if (zy(A)) this.documentElement = A
    },
    importNode: function(A, Q) {
      return eO2(this, A, Q)
    },
    getElementById: function(A) {
      var Q = null;
      return $RA(this.documentElement, function(B) {
        if (B.nodeType == RP) {
          if (B.getAttribute("id") == A) return Q = B, !0
        }
      }), Q
    },
    getElementsByClassName: function(A) {
      var Q = PO2(A);
      return new uJA(this, function(B) {
        var G = [];
        if (Q.length > 0) $RA(B.documentElement, function(Z) {
          if (Z !== B && Z.nodeType === RP) {
            var I = Z.getAttribute("class");
            if (I) {
              var Y = A === I;
              if (!Y) {
                var J = PO2(I);
                Y = Q.every(Nb5(J))
              }
              if (Y) G.push(Z)
            }
          }
        });
        return G
      })
    },
    createElement: function(A) {
      var Q = new H0A;
      Q.ownerDocument = this, Q.nodeName = A, Q.tagName = A, Q.localName = A, Q.childNodes = new hh;
      var B = Q.attributes = new E61;
      return B._ownerElement = Q, Q
    },
    createDocumentFragment: function() {
      var A = new w61;
      return A.ownerDocument = this, A.childNodes = new hh, A
    },
    createTextNode: function(A) {
      var Q = new f80;
      return Q.ownerDocument = this, Q.appendData(A), Q
    },
    createComment: function(A) {
      var Q = new h80;
      return Q.ownerDocument = this, Q.appendData(A), Q
    },
    createCDATASection: function(A) {
      var Q = new g80;
      return Q.ownerDocument = this, Q.appendData(A), Q
    },
    createProcessingInstruction: function(A, Q) {
      var B = new m80;
      return B.ownerDocument = this, B.tagName = B.nodeName = B.target = A, B.nodeValue = B.data = Q, B
    },
    createAttribute: function(A) {
      var Q = new U61;
      return Q.ownerDocument = this, Q.name = A, Q.nodeName = A, Q.localName = A, Q.specified = !0, Q
    },
    createEntityReference: function(A) {
      var Q = new u80;
      return Q.ownerDocument = this, Q.nodeName = A, Q
    },
    createElementNS: function(A, Q) {
      var B = new H0A,
        G = Q.split(":"),
        Z = B.attributes = new E61;
      if (B.childNodes = new hh, B.ownerDocument = this, B.nodeName = Q, B.tagName = Q, B.namespaceURI = A, G.length == 2) B.prefix = G[0], B.localName = G[1];
      else B.localName = Q;
      return Z._ownerElement = B, B
    },
    createAttributeNS: function(A, Q) {
      var B = new U61,
        G = Q.split(":");
      if (B.ownerDocument = this, B.nodeName = Q, B.name = Q, B.namespaceURI = A, B.specified = !0, G.length == 2) B.prefix = G[0], B.localName = G[1];
      else B.localName = Q;
      return B
    }
  };
  Z$(qRA, UG);

  function H0A() {
    this._nsMap = {}
  }
  H0A.prototype = {
    nodeType: RP,
    hasAttribute: function(A) {
      return this.getAttributeNode(A) != null
    },
    getAttribute: function(A) {
      var Q = this.getAttributeNode(A);
      return Q && Q.value || ""
    },
    getAttributeNode: function(A) {
      return this.attributes.getNamedItem(A)
    },
    setAttribute: function(A, Q) {
      var B = this.ownerDocument.createAttribute(A);
      B.value = B.nodeValue = "" + Q, this.setAttributeNode(B)
    },
    removeAttribute: function(A) {
      var Q = this.getAttributeNode(A);
      Q && this.removeAttributeNode(Q)
    },
    appendChild: function(A) {
      if (A.nodeType === gh) return this.insertBefore(A, null);
      else return Sb5(this, A)
    },
    setAttributeNode: function(A) {
      return this.attributes.setNamedItem(A)
    },
    setAttributeNodeNS: function(A) {
      return this.attributes.setNamedItemNS(A)
    },
    removeAttributeNode: function(A) {
      return this.attributes.removeNamedItem(A.nodeName)
    },
    removeAttributeNS: function(A, Q) {
      var B = this.getAttributeNodeNS(A, Q);
      B && this.removeAttributeNode(B)
    },
    hasAttributeNS: function(A, Q) {
      return this.getAttributeNodeNS(A, Q) != null
    },
    getAttributeNS: function(A, Q) {
      var B = this.getAttributeNodeNS(A, Q);
      return B && B.value || ""
    },
    setAttributeNS: function(A, Q, B) {
      var G = this.ownerDocument.createAttributeNS(A, Q);
      G.value = G.nodeValue = "" + B, this.setAttributeNode(G)
    },
    getAttributeNodeNS: function(A, Q) {
      return this.attributes.getNamedItemNS(A, Q)
    },
    getElementsByTagName: function(A) {
      return new uJA(this, function(Q) {
        var B = [];
        return $RA(Q, function(G) {
          if (G !== Q && G.nodeType == RP && (A === "*" || G.tagName == A)) B.push(G)
        }), B
      })
    },
    getElementsByTagNameNS: function(A, Q) {
      return new uJA(this, function(B) {
        var G = [];
        return $RA(B, function(Z) {
          if (Z !== B && Z.nodeType === RP && (A === "*" || Z.namespaceURI === A) && (Q === "*" || Z.localName == Q)) G.push(Z)
        }), G
      })
    }
  };
  qRA.prototype.getElementsByTagName = H0A.prototype.getElementsByTagName;
  qRA.prototype.getElementsByTagNameNS = H0A.prototype.getElementsByTagNameNS;
  Z$(H0A, UG);

  function U61() {}
  U61.prototype.nodeType = gJA;
  Z$(U61, UG);

  function NRA() {}
  NRA.prototype = {
    data: "",
    substringData: function(A, Q) {
      return this.data.substring(A, A + Q)
    },
    appendData: function(A) {
      A = this.data + A, this.nodeValue = this.data = A, this.length = A.length
    },
    insertData: function(A, Q) {
      this.replaceData(A, 0, Q)
    },
    appendChild: function(A) {
      throw Error(KK[G$])
    },
    deleteData: function(A, Q) {
      this.replaceData(A, Q, "")
    },
    replaceData: function(A, Q, B) {
      var G = this.data.substring(0, A),
        Z = this.data.substring(A + Q);
      B = G + B + Z, this.nodeValue = this.data = B, this.length = B.length
    }
  };
  Z$(NRA, UG);

  function f80() {}
  f80.prototype = {
    nodeName: "#text",
    nodeType: C61,
    splitText: function(A) {
      var Q = this.data,
        B = Q.substring(A);
      Q = Q.substring(0, A), this.data = this.nodeValue = Q, this.length = Q.length;
      var G = this.ownerDocument.createTextNode(B);
      if (this.parentNode) this.parentNode.insertBefore(G, this.nextSibling);
      return G
    }
  };
  Z$(f80, NRA);

  function h80() {}
  h80.prototype = {
    nodeName: "#comment",
    nodeType: gO2
  };
  Z$(h80, NRA);

  function g80() {}
  g80.prototype = {
    nodeName: "#cdata-section",
    nodeType: bO2
  };
  Z$(g80, NRA);

  function $61() {}
  $61.prototype.nodeType = mO2;
  Z$($61, UG);

  function sO2() {}
  sO2.prototype.nodeType = Mb5;
  Z$(sO2, UG);

  function rO2() {}
  rO2.prototype.nodeType = Lb5;
  Z$(rO2, UG);

  function u80() {}
  u80.prototype.nodeType = fO2;
  Z$(u80, UG);

  function w61() {}
  w61.prototype.nodeName = "#document-fragment";
  w61.prototype.nodeType = gh;
  Z$(w61, UG);

  function m80() {}
  m80.prototype.nodeType = hO2;
  Z$(m80, UG);

  function oO2() {}
  oO2.prototype.serializeToString = function(A, Q, B) {
    return tO2.call(A, Q, B)
  };
  UG.prototype.toString = tO2;

  function tO2(A, Q) {
    var B = [],
      G = this.nodeType == 9 && this.documentElement || this,
      Z = G.prefix,
      I = G.namespaceURI;
    if (I && Z == null) {
      var Z = G.lookupPrefix(I);
      if (Z == null) var Y = [{
        namespace: I,
        prefix: null
      }]
    }
    return hJA(this, B, A, Q, Y), B.join("")
  }

  function xO2(A, Q, B) {
    var G = A.prefix || "",
      Z = A.namespaceURI;
    if (!Z) return !1;
    if (G === "xml" && Z === URA.XML || Z === URA.XMLNS) return !1;
    var I = B.length;
    while (I--) {
      var Y = B[I];
      if (Y.prefix === G) return Y.namespace !== Z
    }
    return !0
  }

  function k80(A, Q, B) {
    A.push(" ", Q, '="', B.replace(/[<>&"\t\n\r]/g, lO2), '"')
  }

  function hJA(A, Q, B, G, Z) {
    if (!Z) Z = [];
    if (G)
      if (A = G(A), A) {
        if (typeof A == "string") {
          Q.push(A);
          return
        }
      } else return;
    switch (A.nodeType) {
      case RP:
        var I = A.attributes,
          Y = I.length,
          U = A.firstChild,
          J = A.tagName;
        B = URA.isHTML(A.namespaceURI) || B;
        var W = J;
        if (!B && !A.prefix && A.namespaceURI) {
          var X;
          for (var V = 0; V < I.length; V++)
            if (I.item(V).name === "xmlns") {
              X = I.item(V).value;
              break
            } if (!X)
            for (var F = Z.length - 1; F >= 0; F--) {
              var K = Z[F];
              if (K.prefix === "" && K.namespace === A.namespaceURI) {
                X = K.namespace;
                break
              }
            }
          if (X !== A.namespaceURI)
            for (var F = Z.length - 1; F >= 0; F--) {
              var K = Z[F];
              if (K.namespace === A.namespaceURI) {
                if (K.prefix) W = K.prefix + ":" + J;
                break
              }
            }
        }
        Q.push("<", W);
        for (var D = 0; D < Y; D++) {
          var H = I.item(D);
          if (H.prefix == "xmlns") Z.push({
            prefix: H.localName,
            namespace: H.value
          });
          else if (H.nodeName == "xmlns") Z.push({
            prefix: "",
            namespace: H.value
          })
        }
        for (var D = 0; D < Y; D++) {
          var H = I.item(D);
          if (xO2(H, B, Z)) {
            var C = H.prefix || "",
              E = H.namespaceURI;
            k80(Q, C ? "xmlns:" + C : "xmlns", E), Z.push({
              prefix: C,
              namespace: E
            })
          }
          hJA(H, Q, B, G, Z)
        }
        if (J === W && xO2(A, B, Z)) {
          var C = A.prefix || "",
            E = A.namespaceURI;
          k80(Q, C ? "xmlns:" + C : "xmlns", E), Z.push({
            prefix: C,
            namespace: E
          })
        }
        if (U || B && !/^(?:meta|link|img|br|hr|input)$/i.test(J)) {
          if (Q.push(">"), B && /^script$/i.test(J))
            while (U) {
              if (U.data) Q.push(U.data);
              else hJA(U, Q, B, G, Z.slice());
              U = U.nextSibling
            } else
              while (U) hJA(U, Q, B, G, Z.slice()), U = U.nextSibling;
          Q.push("</", W, ">")
        } else Q.push("/>");
        return;
      case uO2:
      case gh:
        var U = A.firstChild;
        while (U) hJA(U, Q, B, G, Z.slice()), U = U.nextSibling;
        return;
      case gJA:
        return k80(Q, A.name, A.value);
      case C61:
        return Q.push(A.data.replace(/[<&>]/g, lO2));
      case bO2:
        return Q.push("<![CDATA[", A.data, "]]>");
      case gO2:
        return Q.push("<!--", A.data, "-->");
      case mO2:
        var {
          publicId: q, systemId: w
        } = A;
        if (Q.push("<!DOCTYPE ", A.name), q) {
          if (Q.push(" PUBLIC ", q), w && w != ".") Q.push(" ", w);
          Q.push(">")
        } else if (w && w != ".") Q.push(" SYSTEM ", w, ">");
        else {
          var N = A.internalSubset;
          if (N) Q.push(" [", N, "]");
          Q.push(">")
        }
        return;
      case hO2:
        return Q.push("<?", A.target, " ", A.data, "?>");
      case fO2:
        return Q.push("&", A.nodeName, ";");
      default:
        Q.push("??", A.nodeName)
    }
  }

  function eO2(A, Q, B) {
    var G;
    switch (Q.nodeType) {
      case RP:
        G = Q.cloneNode(!1), G.ownerDocument = A;
      case gh:
        break;
      case gJA:
        B = !0;
        break
    }
    if (!G) G = Q.cloneNode(!1);
    if (G.ownerDocument = A, G.parentNode = null, B) {
      var Z = Q.firstChild;
      while (Z) G.appendChild(eO2(A, Z, B)), Z = Z.nextSibling
    }
    return G
  }

  function y80(A, Q, B) {
    var G = new Q.constructor;
    for (var Z in Q)
      if (Object.prototype.hasOwnProperty.call(Q, Z)) {
        var I = Q[Z];
        if (typeof I != "object") {
          if (I != G[Z]) G[Z] = I
        }
      } if (Q.childNodes) G.childNodes = new hh;
    switch (G.ownerDocument = A, G.nodeType) {
      case RP:
        var Y = Q.attributes,
          J = G.attributes = new E61,
          W = Y.length;
        J._ownerElement = G;
        for (var X = 0; X < W; X++) G.setAttributeNode(y80(A, Y.item(X), !0));
        break;
      case gJA:
        B = !0
    }
    if (B) {
      var V = Q.firstChild;
      while (V) G.appendChild(y80(A, V, B)), V = V.nextSibling
    }
    return G
  }

  function AR2(A, Q, B) {
    A[Q] = B
  }
  try {
    if (Object.defineProperty) {
      let A = function(Q) {
        switch (Q.nodeType) {
          case RP:
          case gh:
            var B = [];
            Q = Q.firstChild;
            while (Q) {
              if (Q.nodeType !== 7 && Q.nodeType !== 8) B.push(A(Q));
              Q = Q.nextSibling
            }
            return B.join("");
          default:
            return Q.nodeValue
        }
      };
      _b5 = A, Object.defineProperty(uJA.prototype, "length", {
        get: function() {
          return x80(this), this.$$length
        }
      }), Object.defineProperty(UG.prototype, "textContent", {
        get: function() {
          return A(this)
        },
        set: function(Q) {
          switch (this.nodeType) {
            case RP:
            case gh:
              while (this.firstChild) this.removeChild(this.firstChild);
              if (Q || String(Q)) this.appendChild(this.ownerDocument.createTextNode(Q));
              break;
            default:
              this.data = Q, this.value = Q, this.nodeValue = Q
          }
        }
      }), AR2 = function(Q, B, G) {
        Q["$$" + B] = G
      }
    }
  } catch (A) {}
  var _b5;
  kb5.DocumentType = $61;
  kb5.DOMException = fW;
  kb5.DOMImplementation = pO2;
  kb5.Element = H0A;
  kb5.Node = UG;
  kb5.NodeList = hh;
  kb5.XMLSerializer = oO2
})
// @from(Start 12667933, End 12673076)
ts2 = z((os2) => {
  var {
    _optionalChain: en
  } = i0();
  Object.defineProperty(os2, "__esModule", {
    value: !0
  });
  var RPA = i0(),
    rs2 = $$(),
    uV3 = tn(),
    mV3 = ["aggregate", "bulkWrite", "countDocuments", "createIndex", "createIndexes", "deleteMany", "deleteOne", "distinct", "drop", "dropIndex", "dropIndexes", "estimatedDocumentCount", "find", "findOne", "findOneAndDelete", "findOneAndReplace", "findOneAndUpdate", "indexes", "indexExists", "indexInformation", "initializeOrderedBulkOp", "insertMany", "insertOne", "isCapped", "mapReduce", "options", "parallelCollectionScan", "rename", "replaceOne", "stats", "updateMany", "updateOne"],
    dV3 = {
      bulkWrite: ["operations"],
      countDocuments: ["query"],
      createIndex: ["fieldOrSpec"],
      createIndexes: ["indexSpecs"],
      deleteMany: ["filter"],
      deleteOne: ["filter"],
      distinct: ["key", "query"],
      dropIndex: ["indexName"],
      find: ["query"],
      findOne: ["query"],
      findOneAndDelete: ["filter"],
      findOneAndReplace: ["filter", "replacement"],
      findOneAndUpdate: ["filter", "update"],
      indexExists: ["indexes"],
      insertMany: ["docs"],
      insertOne: ["doc"],
      mapReduce: ["map", "reduce"],
      rename: ["newName"],
      replaceOne: ["filter", "doc"],
      updateMany: ["filter", "update"],
      updateOne: ["filter", "update"]
    };

  function cV3(A) {
    return A && typeof A === "object" && A.once && typeof A.once === "function"
  }
  class _G1 {
    static __initStatic() {
      this.id = "Mongo"
    }
    constructor(A = {}) {
      this.name = _G1.id, this._operations = Array.isArray(A.operations) ? A.operations : mV3, this._describeOperations = "describeOperations" in A ? A.describeOperations : !0, this._useMongoose = !!A.useMongoose
    }
    loadDependency() {
      let A = this._useMongoose ? "mongoose" : "mongodb";
      return this._module = this._module || RPA.loadModule(A)
    }
    setupOnce(A, Q) {
      if (uV3.shouldDisableAutoInstrumentation(Q)) {
        rs2.DEBUG_BUILD && RPA.logger.log("Mongo Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        let G = this._useMongoose ? "mongoose" : "mongodb";
        rs2.DEBUG_BUILD && RPA.logger.error(`Mongo Integration was unable to require \`${G}\` package.`);
        return
      }
      this._instrumentOperations(B.Collection, this._operations, Q)
    }
    _instrumentOperations(A, Q, B) {
      Q.forEach((G) => this._patchOperation(A, G, B))
    }
    _patchOperation(A, Q, B) {
      if (!(Q in A.prototype)) return;
      let G = this._getSpanContextFromOperationArguments.bind(this);
      RPA.fill(A.prototype, Q, function(Z) {
        return function(...I) {
          let Y = I[I.length - 1],
            J = B(),
            W = J.getScope(),
            X = J.getClient(),
            V = W.getSpan(),
            F = en([X, "optionalAccess", (D) => D.getOptions, "call", (D) => D(), "access", (D) => D.sendDefaultPii]);
          if (typeof Y !== "function" || Q === "mapReduce" && I.length === 2) {
            let D = en([V, "optionalAccess", (C) => C.startChild, "call", (C) => C(G(this, Q, I, F))]),
              H = Z.call(this, ...I);
            if (RPA.isThenable(H)) return H.then((C) => {
              return en([D, "optionalAccess", (E) => E.end, "call", (E) => E()]), C
            });
            else if (cV3(H)) {
              let C = H;
              try {
                C.once("close", () => {
                  en([D, "optionalAccess", (E) => E.end, "call", (E) => E()])
                })
              } catch (E) {
                en([D, "optionalAccess", (U) => U.end, "call", (U) => U()])
              }
              return C
            } else return en([D, "optionalAccess", (C) => C.end, "call", (C) => C()]), H
          }
          let K = en([V, "optionalAccess", (D) => D.startChild, "call", (D) => D(G(this, Q, I.slice(0, -1)))]);
          return Z.call(this, ...I.slice(0, -1), function(D, H) {
            en([K, "optionalAccess", (C) => C.end, "call", (C) => C()]), Y(D, H)
          })
        }
      })
    }
    _getSpanContextFromOperationArguments(A, Q, B, G = !1) {
      let Z = {
          "db.system": "mongodb",
          "db.name": A.dbName,
          "db.operation": Q,
          "db.mongodb.collection": A.collectionName
        },
        I = {
          op: "db",
          origin: "auto.db.mongo",
          description: Q,
          data: Z
        },
        Y = dV3[Q],
        J = Array.isArray(this._describeOperations) ? this._describeOperations.includes(Q) : this._describeOperations;
      if (!Y || !J || !G) return I;
      try {
        if (Q === "mapReduce") {
          let [W, X] = B;
          Z[Y[0]] = typeof W === "string" ? W : W.name || "<anonymous>", Z[Y[1]] = typeof X === "string" ? X : X.name || "<anonymous>"
        } else
          for (let W = 0; W < Y.length; W++) Z[`db.mongodb.${Y[W]}`] = JSON.stringify(B[W])
      } catch (W) {}
      return I
    }
  }
  _G1.__initStatic();
  os2.Mongo = _G1
})
// @from(Start 12673082, End 12674621)
Qr2 = z((Ar2) => {
  Object.defineProperty(Ar2, "__esModule", {
    value: !0
  });
  var LY0 = _4(),
    es2 = i0(),
    lV3 = $$(),
    iV3 = tn();

  function nV3(A) {
    return !!A && !!A.$use
  }
  class kG1 {
    static __initStatic() {
      this.id = "Prisma"
    }
    constructor(A = {}) {
      if (this.name = kG1.id, nV3(A.client) && !A.client._sentryInstrumented) {
        es2.addNonEnumerableProperty(A.client, "_sentryInstrumented", !0);
        let Q = {};
        try {
          let B = A.client._engineConfig;
          if (B) {
            let {
              activeProvider: G,
              clientVersion: Z
            } = B;
            if (G) Q["db.system"] = G;
            if (Z) Q["db.prisma.version"] = Z
          }
        } catch (B) {}
        A.client.$use((B, G) => {
          if (iV3.shouldDisableAutoInstrumentation(LY0.getCurrentHub)) return G(B);
          let {
            action: Z,
            model: I
          } = B;
          return LY0.startSpan({
            name: I ? `${I} ${Z}` : Z,
            onlyIfParent: !0,
            op: "db.prisma",
            attributes: {
              [LY0.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.db.prisma"
            },
            data: {
              ...Q,
              "db.operation": Z
            }
          }, () => G(B))
        })
      } else lV3.DEBUG_BUILD && es2.logger.warn("Unsupported Prisma client provided to PrismaIntegration. Provided client:", A.client)
    }
    setupOnce() {}
  }
  kG1.__initStatic();
  Ar2.Prisma = kG1
})
// @from(Start 12674627, End 12676371)
Zr2 = z((Gr2) => {
  var {
    _optionalChain: qXA
  } = i0();
  Object.defineProperty(Gr2, "__esModule", {
    value: !0
  });
  var TPA = i0(),
    Br2 = $$(),
    sV3 = tn();
  class yG1 {
    static __initStatic() {
      this.id = "GraphQL"
    }
    constructor() {
      this.name = yG1.id
    }
    loadDependency() {
      return this._module = this._module || TPA.loadModule("graphql/execution/execute.js")
    }
    setupOnce(A, Q) {
      if (sV3.shouldDisableAutoInstrumentation(Q)) {
        Br2.DEBUG_BUILD && TPA.logger.log("GraphQL Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        Br2.DEBUG_BUILD && TPA.logger.error("GraphQL Integration was unable to require graphql/execution package.");
        return
      }
      TPA.fill(B, "execute", function(G) {
        return function(...Z) {
          let I = Q().getScope(),
            Y = I.getSpan(),
            J = qXA([Y, "optionalAccess", (X) => X.startChild, "call", (X) => X({
              description: "execute",
              op: "graphql.execute",
              origin: "auto.graphql.graphql"
            })]);
          qXA([I, "optionalAccess", (X) => X.setSpan, "call", (X) => X(J)]);
          let W = G.call(this, ...Z);
          if (TPA.isThenable(W)) return W.then((X) => {
            return qXA([J, "optionalAccess", (V) => V.end, "call", (V) => V()]), qXA([I, "optionalAccess", (V) => V.setSpan, "call", (V) => V(Y)]), X
          });
          return qXA([J, "optionalAccess", (X) => X.end, "call", (X) => X()]), qXA([I, "optionalAccess", (X) => X.setSpan, "call", (X) => X(Y)]), W
        }
      })
    }
  }
  yG1.__initStatic();
  Gr2.GraphQL = yG1
})
// @from(Start 12676377, End 12679903)
Jr2 = z((Yr2) => {
  var {
    _optionalChain: MY0
  } = i0();
  Object.defineProperty(Yr2, "__esModule", {
    value: !0
  });
  var $C = i0(),
    xG1 = $$(),
    oV3 = tn();
  class vG1 {
    static __initStatic() {
      this.id = "Apollo"
    }
    constructor(A = {
      useNestjs: !1
    }) {
      this.name = vG1.id, this._useNest = !!A.useNestjs
    }
    loadDependency() {
      if (this._useNest) this._module = this._module || $C.loadModule("@nestjs/graphql");
      else this._module = this._module || $C.loadModule("apollo-server-core");
      return this._module
    }
    setupOnce(A, Q) {
      if (oV3.shouldDisableAutoInstrumentation(Q)) {
        xG1.DEBUG_BUILD && $C.logger.log("Apollo Integration is skipped because of instrumenter configuration.");
        return
      }
      if (this._useNest) {
        let B = this.loadDependency();
        if (!B) {
          xG1.DEBUG_BUILD && $C.logger.error("Apollo-NestJS Integration was unable to require @nestjs/graphql package.");
          return
        }
        $C.fill(B.GraphQLFactory.prototype, "mergeWithSchema", function(G) {
          return function(...Z) {
            return $C.fill(this.resolversExplorerService, "explore", function(I) {
              return function() {
                let Y = $C.arrayify(I.call(this));
                return Ir2(Y, Q)
              }
            }), G.call(this, ...Z)
          }
        })
      } else {
        let B = this.loadDependency();
        if (!B) {
          xG1.DEBUG_BUILD && $C.logger.error("Apollo Integration was unable to require apollo-server-core package.");
          return
        }
        $C.fill(B.ApolloServerBase.prototype, "constructSchema", function(G) {
          return function() {
            if (!this.config.resolvers) {
              if (xG1.DEBUG_BUILD) {
                if (this.config.schema) $C.logger.warn("Apollo integration is not able to trace `ApolloServer` instances constructed via `schema` property.If you are using NestJS with Apollo, please use `Sentry.Integrations.Apollo({ useNestjs: true })` instead."), $C.logger.warn();
                else if (this.config.modules) $C.logger.warn("Apollo integration is not able to trace `ApolloServer` instances constructed via `modules` property.");
                $C.logger.error("Skipping tracing as no resolvers found on the `ApolloServer` instance.")
              }
              return G.call(this)
            }
            let Z = $C.arrayify(this.config.resolvers);
            return this.config.resolvers = Ir2(Z, Q), G.call(this)
          }
        })
      }
    }
  }
  vG1.__initStatic();

  function Ir2(A, Q) {
    return A.map((B) => {
      return Object.keys(B).forEach((G) => {
        Object.keys(B[G]).forEach((Z) => {
          if (typeof B[G][Z] !== "function") return;
          tV3(B, G, Z, Q)
        })
      }), B
    })
  }

  function tV3(A, Q, B, G) {
    $C.fill(A[Q], B, function(Z) {
      return function(...I) {
        let J = G().getScope().getSpan(),
          W = MY0([J, "optionalAccess", (V) => V.startChild, "call", (V) => V({
            description: `${Q}.${B}`,
            op: "graphql.resolve",
            origin: "auto.graphql.apollo"
          })]),
          X = Z.call(this, ...I);
        if ($C.isThenable(X)) return X.then((V) => {
          return MY0([W, "optionalAccess", (F) => F.end, "call", (F) => F()]), V
        });
        return MY0([W, "optionalAccess", (V) => V.end, "call", (V) => V()]), X
      }
    })
  }
  Yr2.Apollo = vG1
})
// @from(Start 12679909, End 12680679)
Xr2 = z((Wr2, Aa) => {
  Object.defineProperty(Wr2, "__esModule", {
    value: !0
  });
  var AQA = i0(),
    AF3 = [() => {
      return new(AQA.dynamicRequire(Aa, "./apollo")).Apollo
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./apollo")).Apollo({
        useNestjs: !0
      })
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./graphql")).GraphQL
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./mongo")).Mongo
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./mongo")).Mongo({
        mongoose: !0
      })
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./mysql")).Mysql
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./postgres")).Postgres
    }];
  Wr2.lazyLoadedNodePerformanceMonitoringIntegrations = AF3
})
// @from(Start 12680685, End 12680833)
pq = z((Vr2) => {
  Object.defineProperty(Vr2, "__esModule", {
    value: !0
  });
  var BF3 = i0(),
    GF3 = BF3.GLOBAL_OBJ;
  Vr2.WINDOW = GF3
})
// @from(Start 12680839, End 12681692)
RY0 = z((Hr2) => {
  Object.defineProperty(Hr2, "__esModule", {
    value: !0
  });
  var Fr2 = _4(),
    Kr2 = i0(),
    Dr2 = $$(),
    OY0 = pq();

  function IF3() {
    if (OY0.WINDOW.document) OY0.WINDOW.document.addEventListener("visibilitychange", () => {
      let A = Fr2.getActiveTransaction();
      if (OY0.WINDOW.document.hidden && A) {
        let {
          op: B,
          status: G
        } = Fr2.spanToJSON(A);
        if (Dr2.DEBUG_BUILD && Kr2.logger.log(`[Tracing] Transaction: cancelled -> since tab moved to the background, op: ${B}`), !G) A.setStatus("cancelled");
        A.setTag("visibilitychange", "document.hidden"), A.end()
      }
    });
    else Dr2.DEBUG_BUILD && Kr2.logger.warn("[Tracing] Could not set up background tab detection due to lack of global document")
  }
  Hr2.registerBackgroundTabDetection = IF3
})
// @from(Start 12681698, End 12682035)
NXA = z((Cr2) => {
  Object.defineProperty(Cr2, "__esModule", {
    value: !0
  });
  var JF3 = (A, Q, B) => {
    let G, Z;
    return (I) => {
      if (Q.value >= 0) {
        if (I || B) {
          if (Z = Q.value - (G || 0), Z || G === void 0) G = Q.value, Q.delta = Z, A(Q)
        }
      }
    }
  };
  Cr2.bindReporter = JF3
})
// @from(Start 12682041, End 12682268)
zr2 = z((Er2) => {
  Object.defineProperty(Er2, "__esModule", {
    value: !0
  });
  var XF3 = () => {
    return `v3-${Date.now()}-${Math.floor(Math.random()*8999999999999)+1000000000000}`
  };
  Er2.generateUniqueID = XF3
})
// @from(Start 12682274, End 12683144)
jPA = z((Ur2) => {
  Object.defineProperty(Ur2, "__esModule", {
    value: !0
  });
  var PPA = pq(),
    FF3 = () => {
      let A = PPA.WINDOW.performance.timing,
        Q = PPA.WINDOW.performance.navigation.type,
        B = {
          entryType: "navigation",
          startTime: 0,
          type: Q == 2 ? "back_forward" : Q === 1 ? "reload" : "navigate"
        };
      for (let G in A)
        if (G !== "navigationStart" && G !== "toJSON") B[G] = Math.max(A[G] - A.navigationStart, 0);
      return B
    },
    KF3 = () => {
      if (PPA.WINDOW.__WEB_VITALS_POLYFILL__) return PPA.WINDOW.performance && (performance.getEntriesByType && performance.getEntriesByType("navigation")[0] || FF3());
      else return PPA.WINDOW.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0]
    };
  Ur2.getNavigationEntry = KF3
})
// @from(Start 12683150, End 12683392)
bG1 = z(($r2) => {
  Object.defineProperty($r2, "__esModule", {
    value: !0
  });
  var HF3 = jPA(),
    CF3 = () => {
      let A = HF3.getNavigationEntry();
      return A && A.activationStart || 0
    };
  $r2.getActivationStart = CF3
})
// @from(Start 12683398, End 12684049)
LXA = z((qr2) => {
  Object.defineProperty(qr2, "__esModule", {
    value: !0
  });
  var wr2 = pq(),
    zF3 = zr2(),
    UF3 = bG1(),
    $F3 = jPA(),
    wF3 = (A, Q) => {
      let B = $F3.getNavigationEntry(),
        G = "navigate";
      if (B)
        if (wr2.WINDOW.document && wr2.WINDOW.document.prerendering || UF3.getActivationStart() > 0) G = "prerender";
        else G = B.type.replace(/_/g, "-");
      return {
        name: A,
        value: typeof Q > "u" ? -1 : Q,
        rating: "good",
        delta: 0,
        entries: [],
        id: zF3.generateUniqueID(),
        navigationType: G
      }
    };
  qr2.initMetric = wF3
})
// @from(Start 12684055, End 12684502)
QQA = z((Nr2) => {
  Object.defineProperty(Nr2, "__esModule", {
    value: !0
  });
  var NF3 = (A, Q, B) => {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(A)) {
        let G = new PerformanceObserver((Z) => {
          Q(Z.getEntries())
        });
        return G.observe(Object.assign({
          type: A,
          buffered: !0
        }, B || {})), G
      }
    } catch (G) {}
    return
  };
  Nr2.observe = NF3
})
// @from(Start 12684508, End 12685015)
MXA = z((Mr2) => {
  Object.defineProperty(Mr2, "__esModule", {
    value: !0
  });
  var Lr2 = pq(),
    MF3 = (A, Q) => {
      let B = (G) => {
        if (G.type === "pagehide" || Lr2.WINDOW.document.visibilityState === "hidden") {
          if (A(G), Q) removeEventListener("visibilitychange", B, !0), removeEventListener("pagehide", B, !0)
        }
      };
      if (Lr2.WINDOW.document) addEventListener("visibilitychange", B, !0), addEventListener("pagehide", B, !0)
    };
  Mr2.onHidden = MF3
})
// @from(Start 12685021, End 12686015)
Rr2 = z((Or2) => {
  Object.defineProperty(Or2, "__esModule", {
    value: !0
  });
  var RF3 = NXA(),
    TF3 = LXA(),
    PF3 = QQA(),
    jF3 = MXA(),
    SF3 = (A, Q = {}) => {
      let B = TF3.initMetric("CLS", 0),
        G, Z = 0,
        I = [],
        Y = (W) => {
          W.forEach((X) => {
            if (!X.hadRecentInput) {
              let V = I[0],
                F = I[I.length - 1];
              if (Z && I.length !== 0 && X.startTime - F.startTime < 1000 && X.startTime - V.startTime < 5000) Z += X.value, I.push(X);
              else Z = X.value, I = [X];
              if (Z > B.value) {
                if (B.value = Z, B.entries = I, G) G()
              }
            }
          })
        },
        J = PF3.observe("layout-shift", Y);
      if (J) {
        G = RF3.bindReporter(A, B, Q.reportAllChanges);
        let W = () => {
          Y(J.takeRecords()), G(!0)
        };
        return jF3.onHidden(W), W
      }
      return
    };
  Or2.onCLS = SF3
})
// @from(Start 12686021, End 12686643)
gG1 = z((Tr2) => {
  Object.defineProperty(Tr2, "__esModule", {
    value: !0
  });
  var fG1 = pq(),
    kF3 = MXA(),
    hG1 = -1,
    yF3 = () => {
      if (fG1.WINDOW.document && fG1.WINDOW.document.visibilityState) hG1 = fG1.WINDOW.document.visibilityState === "hidden" && !fG1.WINDOW.document.prerendering ? 0 : 1 / 0
    },
    xF3 = () => {
      kF3.onHidden(({
        timeStamp: A
      }) => {
        hG1 = A
      }, !0)
    },
    vF3 = () => {
      if (hG1 < 0) yF3(), xF3();
      return {
        get firstHiddenTime() {
          return hG1
        }
      }
    };
  Tr2.getVisibilityWatcher = vF3
})
// @from(Start 12686649, End 12687309)
jr2 = z((Pr2) => {
  Object.defineProperty(Pr2, "__esModule", {
    value: !0
  });
  var fF3 = NXA(),
    hF3 = gG1(),
    gF3 = LXA(),
    uF3 = QQA(),
    mF3 = MXA(),
    dF3 = (A) => {
      let Q = hF3.getVisibilityWatcher(),
        B = gF3.initMetric("FID"),
        G, Z = (J) => {
          if (J.startTime < Q.firstHiddenTime) B.value = J.processingStart - J.startTime, B.entries.push(J), G(!0)
        },
        I = (J) => {
          J.forEach(Z)
        },
        Y = uF3.observe("first-input", I);
      if (G = fF3.bindReporter(A, B), Y) mF3.onHidden(() => {
        I(Y.takeRecords()), Y.disconnect()
      }, !0)
    };
  Pr2.onFID = dF3
})
// @from(Start 12687315, End 12688035)
kr2 = z((_r2) => {
  Object.defineProperty(_r2, "__esModule", {
    value: !0
  });
  var pF3 = QQA(),
    Sr2 = 0,
    TY0 = 1 / 0,
    uG1 = 0,
    lF3 = (A) => {
      A.forEach((Q) => {
        if (Q.interactionId) TY0 = Math.min(TY0, Q.interactionId), uG1 = Math.max(uG1, Q.interactionId), Sr2 = uG1 ? (uG1 - TY0) / 7 + 1 : 0
      })
    },
    PY0, iF3 = () => {
      return PY0 ? Sr2 : performance.interactionCount || 0
    },
    nF3 = () => {
      if ("interactionCount" in performance || PY0) return;
      PY0 = pF3.observe("event", lF3, {
        type: "event",
        buffered: !0,
        durationThreshold: 0
      })
    };
  _r2.getInteractionCount = iF3;
  _r2.initInteractionCountPolyfill = nF3
})
// @from(Start 12688041, End 12689993)
hr2 = z((fr2) => {
  Object.defineProperty(fr2, "__esModule", {
    value: !0
  });
  var rF3 = NXA(),
    oF3 = LXA(),
    tF3 = QQA(),
    eF3 = MXA(),
    vr2 = kr2(),
    br2 = () => {
      return vr2.getInteractionCount()
    },
    yr2 = 10,
    zg = [],
    jY0 = {},
    xr2 = (A) => {
      let Q = zg[zg.length - 1],
        B = jY0[A.interactionId];
      if (B || zg.length < yr2 || A.duration > Q.latency) {
        if (B) B.entries.push(A), B.latency = Math.max(B.latency, A.duration);
        else {
          let G = {
            id: A.interactionId,
            latency: A.duration,
            entries: [A]
          };
          jY0[G.id] = G, zg.push(G)
        }
        zg.sort((G, Z) => Z.latency - G.latency), zg.splice(yr2).forEach((G) => {
          delete jY0[G.id]
        })
      }
    },
    AK3 = () => {
      let A = Math.min(zg.length - 1, Math.floor(br2() / 50));
      return zg[A]
    },
    QK3 = (A, Q) => {
      Q = Q || {}, vr2.initInteractionCountPolyfill();
      let B = oF3.initMetric("INP"),
        G, Z = (Y) => {
          Y.forEach((W) => {
            if (W.interactionId) xr2(W);
            if (W.entryType === "first-input") {
              if (!zg.some((V) => {
                  return V.entries.some((F) => {
                    return W.duration === F.duration && W.startTime === F.startTime
                  })
                })) xr2(W)
            }
          });
          let J = AK3();
          if (J && J.latency !== B.value) B.value = J.latency, B.entries = J.entries, G()
        },
        I = tF3.observe("event", Z, {
          durationThreshold: Q.durationThreshold || 40
        });
      if (G = rF3.bindReporter(A, B, Q.reportAllChanges), I) I.observe({
        type: "first-input",
        buffered: !0
      }), eF3.onHidden(() => {
        if (Z(I.takeRecords()), B.value < 0 && br2() > 0) B.value = 0, B.entries = [];
        G(!0)
      })
    };
  fr2.onINP = QK3
})
// @from(Start 12689999, End 12691041)
mr2 = z((ur2) => {
  Object.defineProperty(ur2, "__esModule", {
    value: !0
  });
  var GK3 = pq(),
    ZK3 = NXA(),
    IK3 = bG1(),
    YK3 = gG1(),
    JK3 = LXA(),
    WK3 = QQA(),
    XK3 = MXA(),
    gr2 = {},
    VK3 = (A) => {
      let Q = YK3.getVisibilityWatcher(),
        B = JK3.initMetric("LCP"),
        G, Z = (Y) => {
          let J = Y[Y.length - 1];
          if (J) {
            let W = Math.max(J.startTime - IK3.getActivationStart(), 0);
            if (W < Q.firstHiddenTime) B.value = W, B.entries = [J], G()
          }
        },
        I = WK3.observe("largest-contentful-paint", Z);
      if (I) {
        G = ZK3.bindReporter(A, B);
        let Y = () => {
          if (!gr2[B.id]) Z(I.takeRecords()), I.disconnect(), gr2[B.id] = !0, G(!0)
        };
        return ["keydown", "click"].forEach((J) => {
          if (GK3.WINDOW.document) addEventListener(J, Y, {
            once: !0,
            capture: !0
          })
        }), XK3.onHidden(Y, !0), Y
      }
      return
    };
  ur2.onLCP = VK3
})
// @from(Start 12691047, End 12691944)
cr2 = z((dr2) => {
  Object.defineProperty(dr2, "__esModule", {
    value: !0
  });
  var SY0 = pq(),
    KK3 = NXA(),
    DK3 = bG1(),
    HK3 = jPA(),
    CK3 = LXA(),
    _Y0 = (A) => {
      if (!SY0.WINDOW.document) return;
      if (SY0.WINDOW.document.prerendering) addEventListener("prerenderingchange", () => _Y0(A), !0);
      else if (SY0.WINDOW.document.readyState !== "complete") addEventListener("load", () => _Y0(A), !0);
      else setTimeout(A, 0)
    },
    EK3 = (A, Q) => {
      Q = Q || {};
      let B = CK3.initMetric("TTFB"),
        G = KK3.bindReporter(A, B, Q.reportAllChanges);
      _Y0(() => {
        let Z = HK3.getNavigationEntry();
        if (Z) {
          if (B.value = Math.max(Z.responseStart - DK3.getActivationStart(), 0), B.value < 0 || B.value > performance.now()) return;
          B.entries = [Z], G(!0)
        }
      })
    };
  dr2.onTTFB = EK3
})
// @from(Start 12691950, End 12694421)
RXA = z((tr2) => {
  Object.defineProperty(tr2, "__esModule", {
    value: !0
  });
  var pr2 = i0(),
    UK3 = $$(),
    $K3 = Rr2(),
    wK3 = jr2(),
    qK3 = hr2(),
    NK3 = mr2(),
    LK3 = QQA(),
    MK3 = cr2(),
    SPA = {},
    mG1 = {},
    lr2, ir2, nr2, ar2, sr2;

  function OK3(A, Q = !1) {
    return _PA("cls", A, _K3, lr2, Q)
  }

  function RK3(A, Q = !1) {
    return _PA("lcp", A, yK3, nr2, Q)
  }

  function TK3(A) {
    return _PA("ttfb", A, xK3, ar2)
  }

  function PK3(A) {
    return _PA("fid", A, kK3, ir2)
  }

  function jK3(A) {
    return _PA("inp", A, vK3, sr2)
  }

  function SK3(A, Q) {
    if (rr2(A, Q), !mG1[A]) bK3(A), mG1[A] = !0;
    return or2(A, Q)
  }

  function OXA(A, Q) {
    let B = SPA[A];
    if (!B || !B.length) return;
    for (let G of B) try {
      G(Q)
    } catch (Z) {
      UK3.DEBUG_BUILD && pr2.logger.error(`Error while triggering instrumentation handler.
Type: ${A}
Name: ${pr2.getFunctionName(G)}
Error:`, Z)
    }
  }

  function _K3() {
    return $K3.onCLS((A) => {
      OXA("cls", {
        metric: A
      }), lr2 = A
    }, {
      reportAllChanges: !0
    })
  }

  function kK3() {
    return wK3.onFID((A) => {
      OXA("fid", {
        metric: A
      }), ir2 = A
    })
  }

  function yK3() {
    return NK3.onLCP((A) => {
      OXA("lcp", {
        metric: A
      }), nr2 = A
    })
  }

  function xK3() {
    return MK3.onTTFB((A) => {
      OXA("ttfb", {
        metric: A
      }), ar2 = A
    })
  }

  function vK3() {
    return qK3.onINP((A) => {
      OXA("inp", {
        metric: A
      }), sr2 = A
    })
  }

  function _PA(A, Q, B, G, Z = !1) {
    rr2(A, Q);
    let I;
    if (!mG1[A]) I = B(), mG1[A] = !0;
    if (G) Q({
      metric: G
    });
    return or2(A, Q, Z ? I : void 0)
  }

  function bK3(A) {
    let Q = {};
    if (A === "event") Q.durationThreshold = 0;
    LK3.observe(A, (B) => {
      OXA(A, {
        entries: B
      })
    }, Q)
  }

  function rr2(A, Q) {
    SPA[A] = SPA[A] || [], SPA[A].push(Q)
  }

  function or2(A, Q, B) {
    return () => {
      if (B) B();
      let G = SPA[A];
      if (!G) return;
      let Z = G.indexOf(Q);
      if (Z !== -1) G.splice(Z, 1)
    }
  }
  tr2.addClsInstrumentationHandler = OK3;
  tr2.addFidInstrumentationHandler = PK3;
  tr2.addInpInstrumentationHandler = jK3;
  tr2.addLcpInstrumentationHandler = RK3;
  tr2.addPerformanceInstrumentationHandler = SK3;
  tr2.addTtfbInstrumentationHandler = TK3
})
// @from(Start 12694427, End 12694832)
Ao2 = z((er2) => {
  Object.defineProperty(er2, "__esModule", {
    value: !0
  });

  function cK3(A) {
    return typeof A === "number" && isFinite(A)
  }

  function pK3(A, {
    startTimestamp: Q,
    ...B
  }) {
    if (Q && A.startTimestamp > Q) A.startTimestamp = Q;
    return A.startChild({
      startTimestamp: Q,
      ...B
    })
  }
  er2._startChild = pK3;
  er2.isMeasurementValue = cK3
})
// @from(Start 12694838, End 12708099)
xY0 = z((Io2) => {
  Object.defineProperty(Io2, "__esModule", {
    value: !0
  });
  var Ug = _4(),
    $Z = i0(),
    lq = $$(),
    BQA = RXA(),
    $g = pq(),
    nK3 = gG1(),
    wg = Ao2(),
    aK3 = jPA(),
    sK3 = 2147483647;

  function rV(A) {
    return A / 1000
  }

  function yY0() {
    return $g.WINDOW && $g.WINDOW.addEventListener && $g.WINDOW.performance
  }
  var Qo2 = 0,
    lJ = {},
    ay, kPA;

  function rK3() {
    let A = yY0();
    if (A && $Z.browserPerformanceTimeOrigin) {
      if (A.mark) $g.WINDOW.performance.mark("sentry-tracing-init");
      let Q = BD3(),
        B = AD3(),
        G = QD3(),
        Z = GD3();
      return () => {
        Q(), B(), G(), Z()
      }
    }
    return () => {
      return
    }
  }

  function oK3() {
    BQA.addPerformanceInstrumentationHandler("longtask", ({
      entries: A
    }) => {
      for (let Q of A) {
        let B = Ug.getActiveTransaction();
        if (!B) return;
        let G = rV($Z.browserPerformanceTimeOrigin + Q.startTime),
          Z = rV(Q.duration);
        B.startChild({
          description: "Main UI thread blocked",
          op: "ui.long-task",
          origin: "auto.ui.browser.metrics",
          startTimestamp: G,
          endTimestamp: G + Z
        })
      }
    })
  }

  function tK3() {
    BQA.addPerformanceInstrumentationHandler("event", ({
      entries: A
    }) => {
      for (let Q of A) {
        let B = Ug.getActiveTransaction();
        if (!B) return;
        if (Q.name === "click") {
          let G = rV($Z.browserPerformanceTimeOrigin + Q.startTime),
            Z = rV(Q.duration),
            I = {
              description: $Z.htmlTreeAsString(Q.target),
              op: `ui.interaction.${Q.name}`,
              origin: "auto.ui.browser.metrics",
              startTimestamp: G,
              endTimestamp: G + Z
            },
            Y = $Z.getComponentName(Q.target);
          if (Y) I.attributes = {
            "ui.component_name": Y
          };
          B.startChild(I)
        }
      }
    })
  }

  function eK3(A, Q) {
    if (yY0() && $Z.browserPerformanceTimeOrigin) {
      let G = ZD3(A, Q);
      return () => {
        G()
      }
    }
    return () => {
      return
    }
  }

  function AD3() {
    return BQA.addClsInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding CLS"), lJ.cls = {
        value: A.value,
        unit: ""
      }, kPA = Q
    }, !0)
  }

  function QD3() {
    return BQA.addLcpInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding LCP"), lJ.lcp = {
        value: A.value,
        unit: "millisecond"
      }, ay = Q
    }, !0)
  }

  function BD3() {
    return BQA.addFidInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      let B = rV($Z.browserPerformanceTimeOrigin),
        G = rV(Q.startTime);
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding FID"), lJ.fid = {
        value: A.value,
        unit: "millisecond"
      }, lJ["mark.fid"] = {
        value: B + G,
        unit: "second"
      }
    })
  }

  function GD3() {
    return BQA.addTtfbInstrumentationHandler(({
      metric: A
    }) => {
      if (!A.entries[A.entries.length - 1]) return;
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding TTFB"), lJ.ttfb = {
        value: A.value,
        unit: "millisecond"
      }
    })
  }
  var Bo2 = {
    click: "click",
    pointerdown: "click",
    pointerup: "click",
    mousedown: "click",
    mouseup: "click",
    touchstart: "click",
    touchend: "click",
    mouseover: "hover",
    mouseout: "hover",
    mouseenter: "hover",
    mouseleave: "hover",
    pointerover: "hover",
    pointerout: "hover",
    pointerenter: "hover",
    pointerleave: "hover",
    dragstart: "drag",
    dragend: "drag",
    drag: "drag",
    dragenter: "drag",
    dragleave: "drag",
    dragover: "drag",
    drop: "drag",
    keydown: "press",
    keyup: "press",
    keypress: "press",
    input: "press"
  };

  function ZD3(A, Q) {
    return BQA.addInpInstrumentationHandler(({
      metric: B
    }) => {
      if (B.value === void 0) return;
      let G = B.entries.find((w) => w.duration === B.value && Bo2[w.name] !== void 0),
        Z = Ug.getClient();
      if (!G || !Z) return;
      let I = Bo2[G.name],
        Y = Z.getOptions(),
        J = rV($Z.browserPerformanceTimeOrigin + G.startTime),
        W = rV(B.value),
        X = G.interactionId !== void 0 ? A[G.interactionId] : void 0;
      if (X === void 0) return;
      let {
        routeName: V,
        parentContext: F,
        activeTransaction: K,
        user: D,
        replayId: H
      } = X, C = D !== void 0 ? D.email || D.id || D.ip_address : void 0, E = K !== void 0 ? K.getProfileId() : void 0, U = new Ug.Span({
        startTimestamp: J,
        endTimestamp: J + W,
        op: `ui.interaction.${I}`,
        name: $Z.htmlTreeAsString(G.target),
        attributes: {
          release: Y.release,
          environment: Y.environment,
          transaction: V,
          ...C !== void 0 && C !== "" ? {
            user: C
          } : {},
          ...E !== void 0 ? {
            profile_id: E
          } : {},
          ...H !== void 0 ? {
            replay_id: H
          } : {}
        },
        exclusiveTime: B.value,
        measurements: {
          inp: {
            value: B.value,
            unit: "millisecond"
          }
        }
      }), q = FD3(F, Y, Q);
      if (!q) return;
      if (Math.random() < q) {
        let w = U ? Ug.createSpanEnvelope([U], Z.getDsn()) : void 0,
          N = Z && Z.getTransport();
        if (N && w) N.send(w).then(null, (R) => {
          lq.DEBUG_BUILD && $Z.logger.error("Error while sending interaction:", R)
        });
        return
      }
    })
  }

  function ID3(A) {
    let Q = yY0();
    if (!Q || !$g.WINDOW.performance.getEntries || !$Z.browserPerformanceTimeOrigin) return;
    lq.DEBUG_BUILD && $Z.logger.log("[Tracing] Adding & adjusting spans using Performance API");
    let B = rV($Z.browserPerformanceTimeOrigin),
      G = Q.getEntries(),
      {
        op: Z,
        start_timestamp: I
      } = Ug.spanToJSON(A);
    if (G.slice(Qo2).forEach((Y) => {
        let J = rV(Y.startTime),
          W = rV(Y.duration);
        if (A.op === "navigation" && I && B + J < I) return;
        switch (Y.entryType) {
          case "navigation": {
            YD3(A, Y, B);
            break
          }
          case "mark":
          case "paint":
          case "measure": {
            Go2(A, Y, J, W, B);
            let X = nK3.getVisibilityWatcher(),
              V = Y.startTime < X.firstHiddenTime;
            if (Y.name === "first-paint" && V) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding FP"), lJ.fp = {
              value: Y.startTime,
              unit: "millisecond"
            };
            if (Y.name === "first-contentful-paint" && V) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding FCP"), lJ.fcp = {
              value: Y.startTime,
              unit: "millisecond"
            };
            break
          }
          case "resource": {
            Zo2(A, Y, Y.name, J, W, B);
            break
          }
        }
      }), Qo2 = Math.max(G.length - 1, 0), WD3(A), Z === "pageload") {
      VD3(lJ), ["fcp", "fp", "lcp"].forEach((J) => {
        if (!lJ[J] || !I || B >= I) return;
        let W = lJ[J].value,
          X = B + rV(W),
          V = Math.abs((X - I) * 1000),
          F = V - W;
        lq.DEBUG_BUILD && $Z.logger.log(`[Measurements] Normalized ${J} from ${W} to ${V} (${F})`), lJ[J].value = V
      });
      let Y = lJ["mark.fid"];
      if (Y && lJ.fid) wg._startChild(A, {
        description: "first input delay",
        endTimestamp: Y.value + rV(lJ.fid.value),
        op: "ui.action",
        origin: "auto.ui.browser.metrics",
        startTimestamp: Y.value
      }), delete lJ["mark.fid"];
      if (!("fcp" in lJ)) delete lJ.cls;
      Object.keys(lJ).forEach((J) => {
        Ug.setMeasurement(J, lJ[J].value, lJ[J].unit)
      }), XD3(A)
    }
    ay = void 0, kPA = void 0, lJ = {}
  }

  function Go2(A, Q, B, G, Z) {
    let I = Z + B,
      Y = I + G;
    return wg._startChild(A, {
      description: Q.name,
      endTimestamp: Y,
      op: Q.entryType,
      origin: "auto.resource.browser.metrics",
      startTimestamp: I
    }), I
  }

  function YD3(A, Q, B) {
    ["unloadEvent", "redirect", "domContentLoadedEvent", "loadEvent", "connect"].forEach((G) => {
      dG1(A, Q, G, B)
    }), dG1(A, Q, "secureConnection", B, "TLS/SSL", "connectEnd"), dG1(A, Q, "fetch", B, "cache", "domainLookupStart"), dG1(A, Q, "domainLookup", B, "DNS"), JD3(A, Q, B)
  }

  function dG1(A, Q, B, G, Z, I) {
    let Y = I ? Q[I] : Q[`${B}End`],
      J = Q[`${B}Start`];
    if (!J || !Y) return;
    wg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: Z || B,
      startTimestamp: G + rV(J),
      endTimestamp: G + rV(Y)
    })
  }

  function JD3(A, Q, B) {
    if (Q.responseEnd) wg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: "request",
      startTimestamp: B + rV(Q.requestStart),
      endTimestamp: B + rV(Q.responseEnd)
    }), wg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: "response",
      startTimestamp: B + rV(Q.responseStart),
      endTimestamp: B + rV(Q.responseEnd)
    })
  }

  function Zo2(A, Q, B, G, Z, I) {
    if (Q.initiatorType === "xmlhttprequest" || Q.initiatorType === "fetch") return;
    let Y = $Z.parseUrl(B),
      J = {};
    if (kY0(J, Q, "transferSize", "http.response_transfer_size"), kY0(J, Q, "encodedBodySize", "http.response_content_length"), kY0(J, Q, "decodedBodySize", "http.decoded_response_content_length"), "renderBlockingStatus" in Q) J["resource.render_blocking_status"] = Q.renderBlockingStatus;
    if (Y.protocol) J["url.scheme"] = Y.protocol.split(":").pop();
    if (Y.host) J["server.address"] = Y.host;
    J["url.same_origin"] = B.includes($g.WINDOW.location.origin);
    let W = I + G,
      X = W + Z;
    wg._startChild(A, {
      description: B.replace($g.WINDOW.location.origin, ""),
      endTimestamp: X,
      op: Q.initiatorType ? `resource.${Q.initiatorType}` : "resource.other",
      origin: "auto.resource.browser.metrics",
      startTimestamp: W,
      data: J
    })
  }

  function WD3(A) {
    let Q = $g.WINDOW.navigator;
    if (!Q) return;
    let B = Q.connection;
    if (B) {
      if (B.effectiveType) A.setTag("effectiveConnectionType", B.effectiveType);
      if (B.type) A.setTag("connectionType", B.type);
      if (wg.isMeasurementValue(B.rtt)) lJ["connection.rtt"] = {
        value: B.rtt,
        unit: "millisecond"
      }
    }
    if (wg.isMeasurementValue(Q.deviceMemory)) A.setTag("deviceMemory", `${Q.deviceMemory} GB`);
    if (wg.isMeasurementValue(Q.hardwareConcurrency)) A.setTag("hardwareConcurrency", String(Q.hardwareConcurrency))
  }

  function XD3(A) {
    if (ay) {
      if (lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding LCP Data"), ay.element) A.setTag("lcp.element", $Z.htmlTreeAsString(ay.element));
      if (ay.id) A.setTag("lcp.id", ay.id);
      if (ay.url) A.setTag("lcp.url", ay.url.trim().slice(0, 200));
      A.setTag("lcp.size", ay.size)
    }
    if (kPA && kPA.sources) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding CLS Data"), kPA.sources.forEach((Q, B) => A.setTag(`cls.source.${B+1}`, $Z.htmlTreeAsString(Q.node)))
  }

  function kY0(A, Q, B, G) {
    let Z = Q[B];
    if (Z != null && Z < sK3) A[G] = Z
  }

  function VD3(A) {
    let Q = aK3.getNavigationEntry();
    if (!Q) return;
    let {
      responseStart: B,
      requestStart: G
    } = Q;
    if (G <= B) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding TTFB Request Time"), A["ttfb.requestTime"] = {
      value: B - G,
      unit: "millisecond"
    }
  }

  function FD3(A, Q, B) {
    if (!Ug.hasTracingEnabled(Q)) return !1;
    let G;
    if (A !== void 0 && typeof Q.tracesSampler === "function") G = Q.tracesSampler({
      transactionContext: A,
      name: A.name,
      parentSampled: A.parentSampled,
      attributes: {
        ...A.data,
        ...A.attributes
      },
      location: $g.WINDOW.location
    });
    else if (A !== void 0 && A.sampled !== void 0) G = A.sampled;
    else if (typeof Q.tracesSampleRate < "u") G = Q.tracesSampleRate;
    else G = 1;
    if (!Ug.isValidSampleRate(G)) return lq.DEBUG_BUILD && $Z.logger.warn("[Tracing] Discarding interaction span because of invalid sample rate."), !1;
    if (G === !0) return B;
    else if (G === !1) return 0;
    return G * B
  }
  Io2._addMeasureSpans = Go2;
  Io2._addResourceSpans = Zo2;
  Io2.addPerformanceEntries = ID3;
  Io2.startTrackingINP = eK3;
  Io2.startTrackingInteractions = tK3;
  Io2.startTrackingLongTasks = oK3;
  Io2.startTrackingWebVitals = rK3
})
// @from(Start 12708105, End 12711215)
vY0 = z((Jo2) => {
  Object.defineProperty(Jo2, "__esModule", {
    value: !0
  });
  var sy = _4(),
    GQA = i0();

  function $D3(A, Q, B, G, Z = "auto.http.browser") {
    if (!sy.hasTracingEnabled() || !A.fetchData) return;
    let I = Q(A.fetchData.url);
    if (A.endTimestamp && I) {
      let D = A.fetchData.__span;
      if (!D) return;
      let H = G[D];
      if (H) qD3(H, A), delete G[D];
      return
    }
    let Y = sy.getCurrentScope(),
      J = sy.getClient(),
      {
        method: W,
        url: X
      } = A.fetchData,
      V = wD3(X),
      F = V ? GQA.parseUrl(V).host : void 0,
      K = I ? sy.startInactiveSpan({
        name: `${W} ${X}`,
        onlyIfParent: !0,
        attributes: {
          url: X,
          type: "fetch",
          "http.method": W,
          "http.url": V,
          "server.address": F,
          [sy.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: Z
        },
        op: "http.client"
      }) : void 0;
    if (K) A.fetchData.__span = K.spanContext().spanId, G[K.spanContext().spanId] = K;
    if (B(A.fetchData.url) && J) {
      let D = A.args[0];
      A.args[1] = A.args[1] || {};
      let H = A.args[1];
      H.headers = Yo2(D, J, Y, H, K)
    }
    return K
  }

  function Yo2(A, Q, B, G, Z) {
    let I = Z || B.getSpan(),
      Y = sy.getIsolationScope(),
      {
        traceId: J,
        spanId: W,
        sampled: X,
        dsc: V
      } = {
        ...Y.getPropagationContext(),
        ...B.getPropagationContext()
      },
      F = I ? sy.spanToTraceHeader(I) : GQA.generateSentryTraceHeader(J, W, X),
      K = GQA.dynamicSamplingContextToSentryBaggageHeader(V || (I ? sy.getDynamicSamplingContextFromSpan(I) : sy.getDynamicSamplingContextFromClient(J, Q, B))),
      D = G.headers || (typeof Request < "u" && GQA.isInstanceOf(A, Request) ? A.headers : void 0);
    if (!D) return {
      "sentry-trace": F,
      baggage: K
    };
    else if (typeof Headers < "u" && GQA.isInstanceOf(D, Headers)) {
      let H = new Headers(D);
      if (H.append("sentry-trace", F), K) H.append(GQA.BAGGAGE_HEADER_NAME, K);
      return H
    } else if (Array.isArray(D)) {
      let H = [...D, ["sentry-trace", F]];
      if (K) H.push([GQA.BAGGAGE_HEADER_NAME, K]);
      return H
    } else {
      let H = "baggage" in D ? D.baggage : void 0,
        C = [];
      if (Array.isArray(H)) C.push(...H);
      else if (H) C.push(H);
      if (K) C.push(K);
      return {
        ...D,
        "sentry-trace": F,
        baggage: C.length > 0 ? C.join(",") : void 0
      }
    }
  }

  function wD3(A) {
    try {
      return new URL(A).href
    } catch (Q) {
      return
    }
  }

  function qD3(A, Q) {
    if (Q.response) {
      sy.setHttpStatus(A, Q.response.status);
      let B = Q.response && Q.response.headers && Q.response.headers.get("content-length");
      if (B) {
        let G = parseInt(B);
        if (G > 0) A.setAttribute("http.response_content_length", G)
      }
    } else if (Q.error) A.setStatus("internal_error");
    A.end()
  }
  Jo2.addTracingHeadersToFetchRequest = Yo2;
  Jo2.instrumentFetchRequest = $D3
})
// @from(Start 12711221, End 12716494)
pG1 = z((Do2) => {
  Object.defineProperty(Do2, "__esModule", {
    value: !0
  });
  var iP = _4(),
    nP = i0(),
    MD3 = vY0(),
    OD3 = RXA(),
    RD3 = pq(),
    cG1 = ["localhost", /^\/(?!\/)/],
    bY0 = {
      traceFetch: !0,
      traceXHR: !0,
      enableHTTPTimings: !0,
      tracingOrigins: cG1,
      tracePropagationTargets: cG1
    };

  function TD3(A) {
    let {
      traceFetch: Q,
      traceXHR: B,
      tracePropagationTargets: G,
      tracingOrigins: Z,
      shouldCreateSpanForRequest: I,
      enableHTTPTimings: Y
    } = {
      traceFetch: bY0.traceFetch,
      traceXHR: bY0.traceXHR,
      ...A
    }, J = typeof I === "function" ? I : (V) => !0, W = (V) => Vo2(V, G || Z), X = {};
    if (Q) nP.addFetchInstrumentationHandler((V) => {
      let F = MD3.instrumentFetchRequest(V, J, W, X);
      if (F) {
        let K = Ko2(V.fetchData.url),
          D = K ? nP.parseUrl(K).host : void 0;
        F.setAttributes({
          "http.url": K,
          "server.address": D
        })
      }
      if (Y && F) Wo2(F)
    });
    if (B) nP.addXhrInstrumentationHandler((V) => {
      let F = Fo2(V, J, W, X);
      if (Y && F) Wo2(F)
    })
  }

  function PD3(A) {
    return A.entryType === "resource" && "initiatorType" in A && typeof A.nextHopProtocol === "string" && (A.initiatorType === "fetch" || A.initiatorType === "xmlhttprequest")
  }

  function Wo2(A) {
    let {
      url: Q
    } = iP.spanToJSON(A).data || {};
    if (!Q || typeof Q !== "string") return;
    let B = OD3.addPerformanceInstrumentationHandler("resource", ({
      entries: G
    }) => {
      G.forEach((Z) => {
        if (PD3(Z) && Z.name.endsWith(Q)) jD3(Z).forEach((Y) => A.setAttribute(...Y)), setTimeout(B)
      })
    })
  }

  function Xo2(A) {
    let Q = "unknown",
      B = "unknown",
      G = "";
    for (let Z of A) {
      if (Z === "/") {
        [Q, B] = A.split("/");
        break
      }
      if (!isNaN(Number(Z))) {
        Q = G === "h" ? "http" : G, B = A.split(G)[1];
        break
      }
      G += Z
    }
    if (G === A) Q = G;
    return {
      name: Q,
      version: B
    }
  }

  function ry(A = 0) {
    return ((nP.browserPerformanceTimeOrigin || performance.timeOrigin) + A) / 1000
  }

  function jD3(A) {
    let {
      name: Q,
      version: B
    } = Xo2(A.nextHopProtocol), G = [];
    if (G.push(["network.protocol.version", B], ["network.protocol.name", Q]), !nP.browserPerformanceTimeOrigin) return G;
    return [...G, ["http.request.redirect_start", ry(A.redirectStart)],
      ["http.request.fetch_start", ry(A.fetchStart)],
      ["http.request.domain_lookup_start", ry(A.domainLookupStart)],
      ["http.request.domain_lookup_end", ry(A.domainLookupEnd)],
      ["http.request.connect_start", ry(A.connectStart)],
      ["http.request.secure_connection_start", ry(A.secureConnectionStart)],
      ["http.request.connection_end", ry(A.connectEnd)],
      ["http.request.request_start", ry(A.requestStart)],
      ["http.request.response_start", ry(A.responseStart)],
      ["http.request.response_end", ry(A.responseEnd)]
    ]
  }

  function Vo2(A, Q) {
    return nP.stringMatchesSomePattern(A, Q || cG1)
  }

  function Fo2(A, Q, B, G) {
    let Z = A.xhr,
      I = Z && Z[nP.SENTRY_XHR_DATA_KEY];
    if (!iP.hasTracingEnabled() || !Z || Z.__sentry_own_request__ || !I) return;
    let Y = Q(I.url);
    if (A.endTimestamp && Y) {
      let D = Z.__sentry_xhr_span_id__;
      if (!D) return;
      let H = G[D];
      if (H && I.status_code !== void 0) iP.setHttpStatus(H, I.status_code), H.end(), delete G[D];
      return
    }
    let J = iP.getCurrentScope(),
      W = iP.getIsolationScope(),
      X = Ko2(I.url),
      V = X ? nP.parseUrl(X).host : void 0,
      F = Y ? iP.startInactiveSpan({
        name: `${I.method} ${I.url}`,
        onlyIfParent: !0,
        attributes: {
          type: "xhr",
          "http.method": I.method,
          "http.url": X,
          url: I.url,
          "server.address": V,
          [iP.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.browser"
        },
        op: "http.client"
      }) : void 0;
    if (F) Z.__sentry_xhr_span_id__ = F.spanContext().spanId, G[Z.__sentry_xhr_span_id__] = F;
    let K = iP.getClient();
    if (Z.setRequestHeader && B(I.url) && K) {
      let {
        traceId: D,
        spanId: H,
        sampled: C,
        dsc: E
      } = {
        ...W.getPropagationContext(),
        ...J.getPropagationContext()
      }, U = F ? iP.spanToTraceHeader(F) : nP.generateSentryTraceHeader(D, H, C), q = nP.dynamicSamplingContextToSentryBaggageHeader(E || (F ? iP.getDynamicSamplingContextFromSpan(F) : iP.getDynamicSamplingContextFromClient(D, K, J)));
      SD3(Z, U, q)
    }
    return F
  }

  function SD3(A, Q, B) {
    try {
      if (A.setRequestHeader("sentry-trace", Q), B) A.setRequestHeader(nP.BAGGAGE_HEADER_NAME, B)
    } catch (G) {}
  }

  function Ko2(A) {
    try {
      return new URL(A, RD3.WINDOW.location.origin).href
    } catch (Q) {
      return
    }
  }
  Do2.DEFAULT_TRACE_PROPAGATION_TARGETS = cG1;
  Do2.defaultRequestInstrumentationOptions = bY0;
  Do2.extractNetworkProtocol = Xo2;
  Do2.instrumentOutgoingRequests = TD3;
  Do2.shouldAttachHeaders = Vo2;
  Do2.xhrCallback = Fo2
})
// @from(Start 12716500, End 12717791)
Eo2 = z((Co2) => {
  Object.defineProperty(Co2, "__esModule", {
    value: !0
  });
  var yPA = i0(),
    Ho2 = $$(),
    xPA = pq();

  function fD3(A, Q = !0, B = !0) {
    if (!xPA.WINDOW || !xPA.WINDOW.location) {
      Ho2.DEBUG_BUILD && yPA.logger.warn("Could not initialize routing instrumentation due to invalid location");
      return
    }
    let G = xPA.WINDOW.location.href,
      Z;
    if (Q) Z = A({
      name: xPA.WINDOW.location.pathname,
      startTimestamp: yPA.browserPerformanceTimeOrigin ? yPA.browserPerformanceTimeOrigin / 1000 : void 0,
      op: "pageload",
      origin: "auto.pageload.browser",
      metadata: {
        source: "url"
      }
    });
    if (B) yPA.addHistoryInstrumentationHandler(({
      to: I,
      from: Y
    }) => {
      if (Y === void 0 && G && G.indexOf(I) !== -1) {
        G = void 0;
        return
      }
      if (Y !== I) {
        if (G = void 0, Z) Ho2.DEBUG_BUILD && yPA.logger.log(`[Tracing] Finishing current transaction with op: ${Z.op}`), Z.end();
        Z = A({
          name: xPA.WINDOW.location.pathname,
          op: "navigation",
          origin: "auto.navigation.browser",
          metadata: {
            source: "url"
          }
        })
      }
    })
  }
  Co2.instrumentRoutingWithDefaults = fD3
})
// @from(Start 12717797, End 12727388)
Lo2 = z((No2) => {
  Object.defineProperty(No2, "__esModule", {
    value: !0
  });
  var aP = _4(),
    qg = i0(),
    Qa = $$(),
    gD3 = RY0(),
    zo2 = RXA(),
    vPA = xY0(),
    $o2 = pG1(),
    uD3 = Eo2(),
    ZQA = pq(),
    wo2 = "BrowserTracing",
    mD3 = {
      ...aP.TRACING_DEFAULTS,
      markBackgroundTransactions: !0,
      routingInstrumentation: uD3.instrumentRoutingWithDefaults,
      startTransactionOnLocationChange: !0,
      startTransactionOnPageLoad: !0,
      enableLongTask: !0,
      enableInp: !1,
      interactionsSampleRate: 1,
      _experiments: {},
      ...$o2.defaultRequestInstrumentationOptions
    },
    Uo2 = 10;
  class qo2 {
    constructor(A) {
      if (this.name = wo2, this._hasSetTracePropagationTargets = !1, aP.addTracingExtensions(), Qa.DEBUG_BUILD) this._hasSetTracePropagationTargets = !!(A && (A.tracePropagationTargets || A.tracingOrigins));
      if (this.options = {
          ...mD3,
          ...A
        }, this.options._experiments.enableLongTask !== void 0) this.options.enableLongTask = this.options._experiments.enableLongTask;
      if (A && !A.tracePropagationTargets && A.tracingOrigins) this.options.tracePropagationTargets = A.tracingOrigins;
      if (this._collectWebVitals = vPA.startTrackingWebVitals(), this._interactionIdToRouteNameMapping = {}, this.options.enableInp) vPA.startTrackingINP(this._interactionIdToRouteNameMapping, this.options.interactionsSampleRate);
      if (this.options.enableLongTask) vPA.startTrackingLongTasks();
      if (this.options._experiments.enableInteractions) vPA.startTrackingInteractions();
      this._latestRoute = {
        name: void 0,
        context: void 0
      }
    }
    setupOnce(A, Q) {
      this._getCurrentHub = Q;
      let G = Q().getClient(),
        Z = G && G.getOptions(),
        {
          routingInstrumentation: I,
          startTransactionOnLocationChange: Y,
          startTransactionOnPageLoad: J,
          markBackgroundTransactions: W,
          traceFetch: X,
          traceXHR: V,
          shouldCreateSpanForRequest: F,
          enableHTTPTimings: K,
          _experiments: D
        } = this.options,
        H = Z && Z.tracePropagationTargets,
        C = H || this.options.tracePropagationTargets;
      if (Qa.DEBUG_BUILD && this._hasSetTracePropagationTargets && H) qg.logger.warn("[Tracing] The `tracePropagationTargets` option was set in the BrowserTracing integration and top level `Sentry.init`. The top level `Sentry.init` value is being used.");
      if (I((E) => {
          let U = this._createRouteTransaction(E);
          return this.options._experiments.onStartRouteTransaction && this.options._experiments.onStartRouteTransaction(U, E, Q), U
        }, J, Y), W) gD3.registerBackgroundTabDetection();
      if (D.enableInteractions) this._registerInteractionListener();
      if (this.options.enableInp) this._registerInpInteractionListener();
      $o2.instrumentOutgoingRequests({
        traceFetch: X,
        traceXHR: V,
        tracePropagationTargets: C,
        shouldCreateSpanForRequest: F,
        enableHTTPTimings: K
      })
    }
    _createRouteTransaction(A) {
      if (!this._getCurrentHub) {
        Qa.DEBUG_BUILD && qg.logger.warn(`[Tracing] Did not create ${A.op} transaction because _getCurrentHub is invalid.`);
        return
      }
      let Q = this._getCurrentHub(),
        {
          beforeNavigate: B,
          idleTimeout: G,
          finalTimeout: Z,
          heartbeatInterval: I
        } = this.options,
        Y = A.op === "pageload",
        J;
      if (Y) {
        let K = Y ? fY0("sentry-trace") : "",
          D = Y ? fY0("baggage") : void 0,
          {
            traceId: H,
            dsc: C,
            parentSpanId: E,
            sampled: U
          } = qg.propagationContextFromHeaders(K, D);
        J = {
          traceId: H,
          parentSpanId: E,
          parentSampled: U,
          ...A,
          metadata: {
            ...A.metadata,
            dynamicSamplingContext: C
          },
          trimEnd: !0
        }
      } else J = {
        trimEnd: !0,
        ...A
      };
      let W = typeof B === "function" ? B(J) : J,
        X = W === void 0 ? {
          ...J,
          sampled: !1
        } : W;
      if (X.metadata = X.name !== J.name ? {
          ...X.metadata,
          source: "custom"
        } : X.metadata, this._latestRoute.name = X.name, this._latestRoute.context = X, X.sampled === !1) Qa.DEBUG_BUILD && qg.logger.log(`[Tracing] Will not send ${X.op} transaction because of beforeNavigate.`);
      Qa.DEBUG_BUILD && qg.logger.log(`[Tracing] Starting ${X.op} transaction on scope`);
      let {
        location: V
      } = ZQA.WINDOW, F = aP.startIdleTransaction(Q, X, G, Z, !0, {
        location: V
      }, I, Y);
      if (Y) {
        if (ZQA.WINDOW.document) {
          if (ZQA.WINDOW.document.addEventListener("readystatechange", () => {
              if (["interactive", "complete"].includes(ZQA.WINDOW.document.readyState)) F.sendAutoFinishSignal()
            }), ["interactive", "complete"].includes(ZQA.WINDOW.document.readyState)) F.sendAutoFinishSignal()
        }
      }
      return F.registerBeforeFinishCallback((K) => {
        this._collectWebVitals(), vPA.addPerformanceEntries(K)
      }), F
    }
    _registerInteractionListener() {
      let A, Q = () => {
        let {
          idleTimeout: B,
          finalTimeout: G,
          heartbeatInterval: Z
        } = this.options, I = "ui.action.click", Y = aP.getActiveTransaction();
        if (Y && Y.op && ["navigation", "pageload"].includes(Y.op)) {
          Qa.DEBUG_BUILD && qg.logger.warn("[Tracing] Did not create ui.action.click transaction because a pageload or navigation transaction is in progress.");
          return
        }
        if (A) A.setFinishReason("interactionInterrupted"), A.end(), A = void 0;
        if (!this._getCurrentHub) {
          Qa.DEBUG_BUILD && qg.logger.warn("[Tracing] Did not create ui.action.click transaction because _getCurrentHub is invalid.");
          return
        }
        if (!this._latestRoute.name) {
          Qa.DEBUG_BUILD && qg.logger.warn("[Tracing] Did not create ui.action.click transaction because _latestRouteName is missing.");
          return
        }
        let J = this._getCurrentHub(),
          {
            location: W
          } = ZQA.WINDOW,
          X = {
            name: this._latestRoute.name,
            op: "ui.action.click",
            trimEnd: !0,
            data: {
              [aP.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: this._latestRoute.context ? dD3(this._latestRoute.context) : "url"
            }
          };
        A = aP.startIdleTransaction(J, X, B, G, !0, {
          location: W
        }, Z)
      };
      ["click"].forEach((B) => {
        if (ZQA.WINDOW.document) addEventListener(B, Q, {
          once: !1,
          capture: !0
        })
      })
    }
    _registerInpInteractionListener() {
      let A = ({
        entries: Q
      }) => {
        let B = aP.getClient(),
          G = B !== void 0 && B.getIntegrationByName !== void 0 ? B.getIntegrationByName("Replay") : void 0,
          Z = G !== void 0 ? G.getReplayId() : void 0,
          I = aP.getActiveTransaction(),
          Y = aP.getCurrentScope(),
          J = Y !== void 0 ? Y.getUser() : void 0;
        Q.forEach((W) => {
          if (cD3(W)) {
            let X = W.interactionId;
            if (X === void 0) return;
            let V = this._interactionIdToRouteNameMapping[X],
              F = W.duration,
              K = W.startTime,
              D = Object.keys(this._interactionIdToRouteNameMapping),
              H = D.length > 0 ? D.reduce((C, E) => {
                return this._interactionIdToRouteNameMapping[C].duration < this._interactionIdToRouteNameMapping[E].duration ? C : E
              }) : void 0;
            if (W.entryType === "first-input") {
              if (D.map((E) => this._interactionIdToRouteNameMapping[E]).some((E) => {
                  return E.duration === F && E.startTime === K
                })) return
            }
            if (!X) return;
            if (V) V.duration = Math.max(V.duration, F);
            else if (D.length < Uo2 || H === void 0 || F > this._interactionIdToRouteNameMapping[H].duration) {
              let C = this._latestRoute.name,
                E = this._latestRoute.context;
              if (C && E) {
                if (H && Object.keys(this._interactionIdToRouteNameMapping).length >= Uo2) delete this._interactionIdToRouteNameMapping[H];
                this._interactionIdToRouteNameMapping[X] = {
                  routeName: C,
                  duration: F,
                  parentContext: E,
                  user: J,
                  activeTransaction: I,
                  replayId: Z,
                  startTime: K
                }
              }
            }
          }
        })
      };
      zo2.addPerformanceInstrumentationHandler("event", A), zo2.addPerformanceInstrumentationHandler("first-input", A)
    }
  }

  function fY0(A) {
    let Q = qg.getDomElement(`meta[name=${A}]`);
    return Q ? Q.getAttribute("content") : void 0
  }

  function dD3(A) {
    let Q = A.attributes && A.attributes[aP.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      B = A.data && A.data[aP.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      G = A.metadata && A.metadata.source;
    return Q || B || G
  }

  function cD3(A) {
    return "duration" in A
  }
  No2.BROWSER_TRACING_INTEGRATION_ID = wo2;
  No2.BrowserTracing = qo2;
  No2.getMetaContent = fY0
})
// @from(Start 12727394, End 12737215)
_o2 = z((So2) => {
  Object.defineProperty(So2, "__esModule", {
    value: !0
  });
  var pW = _4(),
    SO = i0(),
    Ba = $$(),
    nD3 = RY0(),
    Mo2 = RXA(),
    bPA = xY0(),
    Ro2 = pG1(),
    iq = pq(),
    To2 = "BrowserTracing",
    aD3 = {
      ...pW.TRACING_DEFAULTS,
      instrumentNavigation: !0,
      instrumentPageLoad: !0,
      markBackgroundSpan: !0,
      enableLongTask: !0,
      enableInp: !1,
      interactionsSampleRate: 1,
      _experiments: {},
      ...Ro2.defaultRequestInstrumentationOptions
    },
    sD3 = (A = {}) => {
      let Q = Ba.DEBUG_BUILD ? !!(A.tracePropagationTargets || A.tracingOrigins) : !1;
      if (pW.addTracingExtensions(), !A.tracePropagationTargets && A.tracingOrigins) A.tracePropagationTargets = A.tracingOrigins;
      let B = {
          ...aD3,
          ...A
        },
        G = bPA.startTrackingWebVitals(),
        Z = {};
      if (B.enableInp) bPA.startTrackingINP(Z, B.interactionsSampleRate);
      if (B.enableLongTask) bPA.startTrackingLongTasks();
      if (B._experiments.enableInteractions) bPA.startTrackingInteractions();
      let I = {
        name: void 0,
        context: void 0
      };

      function Y(J) {
        let W = pW.getCurrentHub(),
          {
            beforeStartSpan: X,
            idleTimeout: V,
            finalTimeout: F,
            heartbeatInterval: K
          } = B,
          D = J.op === "pageload",
          H;
        if (D) {
          let q = D ? hY0("sentry-trace") : "",
            w = D ? hY0("baggage") : void 0,
            {
              traceId: N,
              dsc: R,
              parentSpanId: T,
              sampled: y
            } = SO.propagationContextFromHeaders(q, w);
          H = {
            traceId: N,
            parentSpanId: T,
            parentSampled: y,
            ...J,
            metadata: {
              ...J.metadata,
              dynamicSamplingContext: R
            },
            trimEnd: !0
          }
        } else H = {
          trimEnd: !0,
          ...J
        };
        let C = X ? X(H) : H;
        if (C.metadata = C.name !== H.name ? {
            ...C.metadata,
            source: "custom"
          } : C.metadata, I.name = C.name, I.context = C, C.sampled === !1) Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Will not send ${C.op} transaction because of beforeNavigate.`);
        Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Starting ${C.op} transaction on scope`);
        let {
          location: E
        } = iq.WINDOW, U = pW.startIdleTransaction(W, C, V, F, !0, {
          location: E
        }, K, D);
        if (D && iq.WINDOW.document) {
          if (iq.WINDOW.document.addEventListener("readystatechange", () => {
              if (["interactive", "complete"].includes(iq.WINDOW.document.readyState)) U.sendAutoFinishSignal()
            }), ["interactive", "complete"].includes(iq.WINDOW.document.readyState)) U.sendAutoFinishSignal()
        }
        return U.registerBeforeFinishCallback((q) => {
          G(), bPA.addPerformanceEntries(q)
        }), U
      }
      return {
        name: To2,
        setupOnce: () => {},
        afterAllSetup(J) {
          let W = J.getOptions(),
            {
              markBackgroundSpan: X,
              traceFetch: V,
              traceXHR: F,
              shouldCreateSpanForRequest: K,
              enableHTTPTimings: D,
              _experiments: H
            } = B,
            C = W && W.tracePropagationTargets,
            E = C || B.tracePropagationTargets;
          if (Ba.DEBUG_BUILD && Q && C) SO.logger.warn("[Tracing] The `tracePropagationTargets` option was set in the BrowserTracing integration and top level `Sentry.init`. The top level `Sentry.init` value is being used.");
          let U, q = iq.WINDOW.location && iq.WINDOW.location.href;
          if (J.on) J.on("startNavigationSpan", (w) => {
            if (U) Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Finishing current transaction with op: ${pW.spanToJSON(U).op}`), U.end();
            U = Y({
              op: "navigation",
              ...w
            })
          }), J.on("startPageLoadSpan", (w) => {
            if (U) Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Finishing current transaction with op: ${pW.spanToJSON(U).op}`), U.end();
            U = Y({
              op: "pageload",
              ...w
            })
          });
          if (B.instrumentPageLoad && J.emit && iq.WINDOW.location) {
            let w = {
              name: iq.WINDOW.location.pathname,
              startTimestamp: SO.browserPerformanceTimeOrigin ? SO.browserPerformanceTimeOrigin / 1000 : void 0,
              origin: "auto.pageload.browser",
              attributes: {
                [pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url"
              }
            };
            Po2(J, w)
          }
          if (B.instrumentNavigation && J.emit && iq.WINDOW.location) SO.addHistoryInstrumentationHandler(({
            to: w,
            from: N
          }) => {
            if (N === void 0 && q && q.indexOf(w) !== -1) {
              q = void 0;
              return
            }
            if (N !== w) {
              q = void 0;
              let R = {
                name: iq.WINDOW.location.pathname,
                origin: "auto.navigation.browser",
                attributes: {
                  [pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url"
                }
              };
              jo2(J, R)
            }
          });
          if (X) nD3.registerBackgroundTabDetection();
          if (H.enableInteractions) rD3(B, I);
          if (B.enableInp) tD3(Z, I);
          Ro2.instrumentOutgoingRequests({
            traceFetch: V,
            traceXHR: F,
            tracePropagationTargets: E,
            shouldCreateSpanForRequest: K,
            enableHTTPTimings: D
          })
        },
        options: B
      }
    };

  function Po2(A, Q) {
    if (!A.emit) return;
    A.emit("startPageLoadSpan", Q);
    let B = pW.getActiveSpan();
    return (B && pW.spanToJSON(B).op) === "pageload" ? B : void 0
  }

  function jo2(A, Q) {
    if (!A.emit) return;
    A.emit("startNavigationSpan", Q);
    let B = pW.getActiveSpan();
    return (B && pW.spanToJSON(B).op) === "navigation" ? B : void 0
  }

  function hY0(A) {
    let Q = SO.getDomElement(`meta[name=${A}]`);
    return Q ? Q.getAttribute("content") : void 0
  }

  function rD3(A, Q) {
    let B, G = () => {
      let {
        idleTimeout: Z,
        finalTimeout: I,
        heartbeatInterval: Y
      } = A, J = "ui.action.click", W = pW.getActiveTransaction();
      if (W && W.op && ["navigation", "pageload"].includes(W.op)) {
        Ba.DEBUG_BUILD && SO.logger.warn("[Tracing] Did not create ui.action.click transaction because a pageload or navigation transaction is in progress.");
        return
      }
      if (B) B.setFinishReason("interactionInterrupted"), B.end(), B = void 0;
      if (!Q.name) {
        Ba.DEBUG_BUILD && SO.logger.warn("[Tracing] Did not create ui.action.click transaction because _latestRouteName is missing.");
        return
      }
      let {
        location: X
      } = iq.WINDOW, V = {
        name: Q.name,
        op: "ui.action.click",
        trimEnd: !0,
        data: {
          [pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: Q.context ? eD3(Q.context) : "url"
        }
      };
      B = pW.startIdleTransaction(pW.getCurrentHub(), V, Z, I, !0, {
        location: X
      }, Y)
    };
    ["click"].forEach((Z) => {
      if (iq.WINDOW.document) addEventListener(Z, G, {
        once: !1,
        capture: !0
      })
    })
  }

  function oD3(A) {
    return "duration" in A
  }
  var Oo2 = 10;

  function tD3(A, Q) {
    let B = ({
      entries: G
    }) => {
      let Z = pW.getClient(),
        I = Z !== void 0 && Z.getIntegrationByName !== void 0 ? Z.getIntegrationByName("Replay") : void 0,
        Y = I !== void 0 ? I.getReplayId() : void 0,
        J = pW.getActiveTransaction(),
        W = pW.getCurrentScope(),
        X = W !== void 0 ? W.getUser() : void 0;
      G.forEach((V) => {
        if (oD3(V)) {
          let F = V.interactionId;
          if (F === void 0) return;
          let K = A[F],
            D = V.duration,
            H = V.startTime,
            C = Object.keys(A),
            E = C.length > 0 ? C.reduce((U, q) => {
              return A[U].duration < A[q].duration ? U : q
            }) : void 0;
          if (V.entryType === "first-input") {
            if (C.map((q) => A[q]).some((q) => {
                return q.duration === D && q.startTime === H
              })) return
          }
          if (!F) return;
          if (K) K.duration = Math.max(K.duration, D);
          else if (C.length < Oo2 || E === void 0 || D > A[E].duration) {
            let {
              name: U,
              context: q
            } = Q;
            if (U && q) {
              if (E && Object.keys(A).length >= Oo2) delete A[E];
              A[F] = {
                routeName: U,
                duration: D,
                parentContext: q,
                user: X,
                activeTransaction: J,
                replayId: Y,
                startTime: H
              }
            }
          }
        }
      })
    };
    Mo2.addPerformanceInstrumentationHandler("event", B), Mo2.addPerformanceInstrumentationHandler("first-input", B)
  }

  function eD3(A) {
    let Q = A.attributes && A.attributes[pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      B = A.data && A.data[pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      G = A.metadata && A.metadata.source;
    return Q || B || G
  }
  So2.BROWSER_TRACING_INTEGRATION_ID = To2;
  So2.browserTracingIntegration = sD3;
  So2.getMetaContent = hY0;
  So2.startBrowserTracingNavigationSpan = jo2;
  So2.startBrowserTracingPageLoadSpan = Po2
})
// @from(Start 12737221, End 12738300)
xo2 = z((yo2, fPA) => {
  Object.defineProperty(yo2, "__esModule", {
    value: !0
  });
  var ko2 = _4(),
    TXA = i0();

  function IH3() {
    let A = ko2.getMainCarrier();
    if (!A.__SENTRY__) return;
    let Q = {
        mongodb() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/mongo")).Mongo
        },
        mongoose() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/mongo")).Mongo
        },
        mysql() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/mysql")).Mysql
        },
        pg() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/postgres")).Postgres
        }
      },
      B = Object.keys(Q).filter((G) => !!TXA.loadModule(G)).map((G) => {
        try {
          return Q[G]()
        } catch (Z) {
          return
        }
      }).filter((G) => G);
    if (B.length > 0) A.__SENTRY__.integrations = [...A.__SENTRY__.integrations || [], ...B]
  }

  function YH3() {
    if (ko2.addTracingExtensions(), TXA.isNodeEnv()) IH3()
  }
  yo2.addExtensionMethods = YH3
})
// @from(Start 12738306, End 12740470)
uY0 = z((go2) => {
  Object.defineProperty(go2, "__esModule", {
    value: !0
  });
  var Ng = _4(),
    vo2 = i0(),
    WH3 = ls2(),
    XH3 = ns2(),
    VH3 = ss2(),
    FH3 = ts2(),
    KH3 = Qr2(),
    DH3 = Zr2(),
    HH3 = Jr2(),
    CH3 = Xr2(),
    bo2 = Lo2(),
    gY0 = _o2(),
    fo2 = pG1(),
    lG1 = RXA(),
    ho2 = vY0(),
    EH3 = xo2();
  go2.IdleTransaction = Ng.IdleTransaction;
  go2.Span = Ng.Span;
  go2.SpanStatus = Ng.SpanStatus;
  go2.Transaction = Ng.Transaction;
  go2.extractTraceparentData = Ng.extractTraceparentData;
  go2.getActiveTransaction = Ng.getActiveTransaction;
  go2.hasTracingEnabled = Ng.hasTracingEnabled;
  go2.spanStatusfromHttpCode = Ng.spanStatusfromHttpCode;
  go2.startIdleTransaction = Ng.startIdleTransaction;
  go2.TRACEPARENT_REGEXP = vo2.TRACEPARENT_REGEXP;
  go2.stripUrlQueryAndFragment = vo2.stripUrlQueryAndFragment;
  go2.Express = WH3.Express;
  go2.Postgres = XH3.Postgres;
  go2.Mysql = VH3.Mysql;
  go2.Mongo = FH3.Mongo;
  go2.Prisma = KH3.Prisma;
  go2.GraphQL = DH3.GraphQL;
  go2.Apollo = HH3.Apollo;
  go2.lazyLoadedNodePerformanceMonitoringIntegrations = CH3.lazyLoadedNodePerformanceMonitoringIntegrations;
  go2.BROWSER_TRACING_INTEGRATION_ID = bo2.BROWSER_TRACING_INTEGRATION_ID;
  go2.BrowserTracing = bo2.BrowserTracing;
  go2.browserTracingIntegration = gY0.browserTracingIntegration;
  go2.startBrowserTracingNavigationSpan = gY0.startBrowserTracingNavigationSpan;
  go2.startBrowserTracingPageLoadSpan = gY0.startBrowserTracingPageLoadSpan;
  go2.defaultRequestInstrumentationOptions = fo2.defaultRequestInstrumentationOptions;
  go2.instrumentOutgoingRequests = fo2.instrumentOutgoingRequests;
  go2.addClsInstrumentationHandler = lG1.addClsInstrumentationHandler;
  go2.addFidInstrumentationHandler = lG1.addFidInstrumentationHandler;
  go2.addLcpInstrumentationHandler = lG1.addLcpInstrumentationHandler;
  go2.addPerformanceInstrumentationHandler = lG1.addPerformanceInstrumentationHandler;
  go2.addTracingHeadersToFetchRequest = ho2.addTracingHeadersToFetchRequest;
  go2.instrumentFetchRequest = ho2.instrumentFetchRequest;
  go2.addExtensionMethods = EH3.addExtensionMethods
})
// @from(Start 12740476, End 12741025)
mo2 = z((uo2) => {
  Object.defineProperty(uo2, "__esModule", {
    value: !0
  });
  var rH3 = uY0(),
    oH3 = i0();

  function tH3() {
    let A = rH3.lazyLoadedNodePerformanceMonitoringIntegrations.map((Q) => {
      try {
        return Q()
      } catch (B) {
        return
      }
    }).filter((Q) => !!Q);
    if (A.length === 0) oH3.logger.warn("Performance monitoring integrations could not be automatically loaded.");
    return A.filter((Q) => !!Q.loadDependency())
  }
  uo2.autoDiscoverNodePerformanceMonitoringIntegrations = tH3
})
// @from(Start 12741031, End 12741681)
mY0 = z((po2) => {
  Object.defineProperty(po2, "__esModule", {
    value: !0
  });
  var AC3 = UA("os"),
    QC3 = UA("util"),
    do2 = _4();
  class co2 extends do2.ServerRuntimeClient {
    constructor(A) {
      do2.applySdkMetadata(A, "node"), A.transportOptions = {
        textEncoder: new QC3.TextEncoder,
        ...A.transportOptions
      };
      let Q = {
        ...A,
        platform: "node",
        runtime: {
          name: "node",
          version: global.process.version
        },
        serverName: A.serverName || global.process.env.SENTRY_NAME || AC3.hostname()
      };
      super(Q)
    }
  }
  po2.NodeClient = co2
})
// @from(Start 12741687, End 12743326)
so2 = z((ao2) => {
  var {
    _nullishCoalesce: lo2
  } = i0();
  Object.defineProperty(ao2, "__esModule", {
    value: !0
  });
  var io2 = UA("http");
  UA("https");
  var oy = Symbol("AgentBaseInternalState");
  class no2 extends io2.Agent {
    constructor(A) {
      super(A);
      this[oy] = {}
    }
    isSecureEndpoint(A) {
      if (A) {
        if (typeof A.secureEndpoint === "boolean") return A.secureEndpoint;
        if (typeof A.protocol === "string") return A.protocol === "https:"
      }
      let {
        stack: Q
      } = Error();
      if (typeof Q !== "string") return !1;
      return Q.split(`
`).some((B) => B.indexOf("(https.js:") !== -1 || B.indexOf("node:https:") !== -1)
    }
    createSocket(A, Q, B) {
      let G = {
        ...Q,
        secureEndpoint: this.isSecureEndpoint(Q)
      };
      Promise.resolve().then(() => this.connect(A, G)).then((Z) => {
        if (Z instanceof io2.Agent) return Z.addRequest(A, G);
        this[oy].currentSocket = Z, super.createSocket(A, Q, B)
      }, B)
    }
    createConnection() {
      let A = this[oy].currentSocket;
      if (this[oy].currentSocket = void 0, !A) throw Error("No socket was returned in the `connect()` function");
      return A
    }
    get defaultPort() {
      return lo2(this[oy].defaultPort, () => this.protocol === "https:" ? 443 : 80)
    }
    set defaultPort(A) {
      if (this[oy]) this[oy].defaultPort = A
    }
    get protocol() {
      return lo2(this[oy].protocol, () => this.isSecureEndpoint() ? "https:" : "http:")
    }
    set protocol(A) {
      if (this[oy]) this[oy].protocol = A
    }
  }
  ao2.Agent = no2
})
// @from(Start 12743332, End 12745341)
oo2 = z((ro2) => {
  Object.defineProperty(ro2, "__esModule", {
    value: !0
  });
  var ZC3 = i0();

  function iG1(...A) {
    ZC3.logger.log("[https-proxy-agent:parse-proxy-response]", ...A)
  }

  function IC3(A) {
    return new Promise((Q, B) => {
      let G = 0,
        Z = [];

      function I() {
        let V = A.read();
        if (V) X(V);
        else A.once("readable", I)
      }

      function Y() {
        A.removeListener("end", J), A.removeListener("error", W), A.removeListener("readable", I)
      }

      function J() {
        Y(), iG1("onend"), B(Error("Proxy connection ended before receiving CONNECT response"))
      }

      function W(V) {
        Y(), iG1("onerror %o", V), B(V)
      }

      function X(V) {
        Z.push(V), G += V.length;
        let F = Buffer.concat(Z, G),
          K = F.indexOf(`\r
\r
`);
        if (K === -1) {
          iG1("have not received end of HTTP headers yet..."), I();
          return
        }
        let D = F.slice(0, K).toString("ascii").split(`\r
`),
          H = D.shift();
        if (!H) return A.destroy(), B(Error("No header received from proxy CONNECT response"));
        let C = H.split(" "),
          E = +C[1],
          U = C.slice(2).join(" "),
          q = {};
        for (let w of D) {
          if (!w) continue;
          let N = w.indexOf(":");
          if (N === -1) return A.destroy(), B(Error(`Invalid header from proxy CONNECT response: "${w}"`));
          let R = w.slice(0, N).toLowerCase(),
            T = w.slice(N + 1).trimStart(),
            y = q[R];
          if (typeof y === "string") q[R] = [y, T];
          else if (Array.isArray(y)) y.push(T);
          else q[R] = T
        }
        iG1("got proxy server response: %o %o", H, q), Y(), Q({
          connect: {
            statusCode: E,
            statusText: U,
            headers: q
          },
          buffered: F
        })
      }
      A.on("error", W), A.on("end", J), I()
    })
  }
  ro2.parseProxyResponse = IC3
})
// @from(Start 12745347, End 12748607)
Qt2 = z((At2) => {
  var {
    _nullishCoalesce: JC3,
    _optionalChain: WC3
  } = i0();
  Object.defineProperty(At2, "__esModule", {
    value: !0
  });
  var hPA = UA("net"),
    to2 = UA("tls"),
    XC3 = UA("url"),
    VC3 = i0(),
    FC3 = so2(),
    KC3 = oo2();

  function gPA(...A) {
    VC3.logger.log("[https-proxy-agent]", ...A)
  }
  class dY0 extends FC3.Agent {
    static __initStatic() {
      this.protocols = ["http", "https"]
    }
    constructor(A, Q) {
      super(Q);
      this.options = {}, this.proxy = typeof A === "string" ? new XC3.URL(A) : A, this.proxyHeaders = JC3(WC3([Q, "optionalAccess", (Z) => Z.headers]), () => ({})), gPA("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
      let B = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
        G = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        ALPNProtocols: ["http/1.1"],
        ...Q ? eo2(Q, "headers") : null,
        host: B,
        port: G
      }
    }
    async connect(A, Q) {
      let {
        proxy: B
      } = this;
      if (!Q.host) throw TypeError('No "host" provided');
      let G;
      if (B.protocol === "https:") {
        gPA("Creating `tls.Socket`: %o", this.connectOpts);
        let F = this.connectOpts.servername || this.connectOpts.host;
        G = to2.connect({
          ...this.connectOpts,
          servername: F && hPA.isIP(F) ? void 0 : F
        })
      } else gPA("Creating `net.Socket`: %o", this.connectOpts), G = hPA.connect(this.connectOpts);
      let Z = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
          ...this.proxyHeaders
        },
        I = hPA.isIPv6(Q.host) ? `[${Q.host}]` : Q.host,
        Y = `CONNECT ${I}:${Q.port} HTTP/1.1\r
`;
      if (B.username || B.password) {
        let F = `${decodeURIComponent(B.username)}:${decodeURIComponent(B.password)}`;
        Z["Proxy-Authorization"] = `Basic ${Buffer.from(F).toString("base64")}`
      }
      if (Z.Host = `${I}:${Q.port}`, !Z["Proxy-Connection"]) Z["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
      for (let F of Object.keys(Z)) Y += `${F}: ${Z[F]}\r
`;
      let J = KC3.parseProxyResponse(G);
      G.write(`${Y}\r
`);
      let {
        connect: W,
        buffered: X
      } = await J;
      if (A.emit("proxyConnect", W), this.emit("proxyConnect", W, A), W.statusCode === 200) {
        if (A.once("socket", DC3), Q.secureEndpoint) {
          gPA("Upgrading socket connection to TLS");
          let F = Q.servername || Q.host;
          return to2.connect({
            ...eo2(Q, "host", "path", "port"),
            socket: G,
            servername: hPA.isIP(F) ? void 0 : F
          })
        }
        return G
      }
      G.destroy();
      let V = new hPA.Socket({
        writable: !1
      });
      return V.readable = !0, A.once("socket", (F) => {
        gPA("Replaying proxy buffer for failed request"), F.push(X), F.push(null)
      }), V
    }
  }
  dY0.__initStatic();

  function DC3(A) {
    A.resume()
  }

  function eo2(A, ...Q) {
    let B = {},
      G;
    for (G in A)
      if (!Q.includes(G)) B[G] = A[G];
    return B
  }
  At2.HttpsProxyAgent = dY0
})
// @from(Start 12748613, End 12751142)
pY0 = z((Zt2) => {
  var {
    _nullishCoalesce: cY0
  } = i0();
  Object.defineProperty(Zt2, "__esModule", {
    value: !0
  });
  var CC3 = UA("http"),
    EC3 = UA("https"),
    zC3 = UA("stream"),
    Gt2 = UA("url"),
    UC3 = UA("zlib"),
    Bt2 = _4(),
    $C3 = i0(),
    wC3 = Qt2(),
    qC3 = 32768;

  function NC3(A) {
    return new zC3.Readable({
      read() {
        this.push(A), this.push(null)
      }
    })
  }

  function LC3(A) {
    let Q;
    try {
      Q = new Gt2.URL(A.url)
    } catch (W) {
      return $C3.consoleSandbox(() => {
        console.warn("[@sentry/node]: Invalid dsn or tunnel option, will not send any events. The tunnel option must be a full URL when used.")
      }), Bt2.createTransport(A, () => Promise.resolve({}))
    }
    let B = Q.protocol === "https:",
      G = MC3(Q, A.proxy || (B ? process.env.https_proxy : void 0) || process.env.http_proxy),
      Z = B ? EC3 : CC3,
      I = A.keepAlive === void 0 ? !1 : A.keepAlive,
      Y = G ? new wC3.HttpsProxyAgent(G) : new Z.Agent({
        keepAlive: I,
        maxSockets: 30,
        timeout: 2000
      }),
      J = OC3(A, cY0(A.httpModule, () => Z), Y);
    return Bt2.createTransport(A, J)
  }

  function MC3(A, Q) {
    let {
      no_proxy: B
    } = process.env;
    if (B && B.split(",").some((Z) => A.host.endsWith(Z) || A.hostname.endsWith(Z))) return;
    else return Q
  }

  function OC3(A, Q, B) {
    let {
      hostname: G,
      pathname: Z,
      port: I,
      protocol: Y,
      search: J
    } = new Gt2.URL(A.url);
    return function(X) {
      return new Promise((V, F) => {
        let K = NC3(X.body),
          D = {
            ...A.headers
          };
        if (X.body.length > qC3) D["content-encoding"] = "gzip", K = K.pipe(UC3.createGzip());
        let H = Q.request({
          method: "POST",
          agent: B,
          headers: D,
          hostname: G,
          path: `${Z}${J}`,
          port: I,
          protocol: Y,
          ca: A.caCerts
        }, (C) => {
          C.on("data", () => {}), C.on("end", () => {}), C.setEncoding("utf8");
          let E = cY0(C.headers["retry-after"], () => null),
            U = cY0(C.headers["x-sentry-rate-limits"], () => null);
          V({
            statusCode: C.statusCode,
            headers: {
              "retry-after": E,
              "x-sentry-rate-limits": Array.isArray(U) ? U[0] : U
            }
          })
        });
        H.on("error", F), K.pipe(H)
      })
    }
  }
  Zt2.makeNodeTransport = LC3
})
// @from(Start 12751148, End 12751327)
IQA = z((It2) => {
  Object.defineProperty(It2, "__esModule", {
    value: !0
  });
  var TC3 = i0(),
    PC3 = TC3.parseSemver(process.versions.node);
  It2.NODE_VERSION = PC3
})
// @from(Start 12751333, End 12752244)
Xt2 = z((Wt2) => {
  var {
    _optionalChain: SC3
  } = i0();
  Object.defineProperty(Wt2, "__esModule", {
    value: !0
  });
  var Yt2 = UA("domain"),
    YQA = _4();

  function Jt2() {
    return Yt2.active
  }

  function _C3() {
    let A = Jt2();
    if (!A) return;
    return YQA.ensureHubOnCarrier(A), YQA.getHubFromCarrier(A)
  }

  function kC3(A) {
    let Q = {};
    return YQA.ensureHubOnCarrier(Q, A), YQA.getHubFromCarrier(Q)
  }

  function yC3(A, Q) {
    let B = Jt2();
    if (B && SC3([Q, "optionalAccess", (Y) => Y.reuseExisting])) return A();
    let G = Yt2.create(),
      Z = B ? YQA.getHubFromCarrier(B) : void 0,
      I = kC3(Z);
    return YQA.setHubOnCarrier(G, I), G.bind(() => {
      return A()
    })()
  }

  function xC3() {
    YQA.setAsyncContextStrategy({
      getCurrentHub: _C3,
      runWithAsyncContext: yC3
    })
  }
  Wt2.setDomainAsyncContextStrategy = xC3
})
// @from(Start 12752250, End 12753017)
Ft2 = z((Vt2) => {
  var {
    _optionalChain: bC3
  } = i0();
  Object.defineProperty(Vt2, "__esModule", {
    value: !0
  });
  var lY0 = _4(),
    fC3 = UA("async_hooks"),
    nG1;

  function hC3() {
    if (!nG1) nG1 = new fC3.AsyncLocalStorage;

    function A() {
      return nG1.getStore()
    }

    function Q(G) {
      let Z = {};
      return lY0.ensureHubOnCarrier(Z, G), lY0.getHubFromCarrier(Z)
    }

    function B(G, Z) {
      let I = A();
      if (I && bC3([Z, "optionalAccess", (J) => J.reuseExisting])) return G();
      let Y = Q(I);
      return nG1.run(Y, () => {
        return G()
      })
    }
    lY0.setAsyncContextStrategy({
      getCurrentHub: A,
      runWithAsyncContext: B
    })
  }
  Vt2.setHooksAsyncContextStrategy = hC3
})
// @from(Start 12753023, End 12753345)
Dt2 = z((Kt2) => {
  Object.defineProperty(Kt2, "__esModule", {
    value: !0
  });
  var uC3 = IQA(),
    mC3 = Xt2(),
    dC3 = Ft2();

  function cC3() {
    if (uC3.NODE_VERSION.major >= 14) dC3.setHooksAsyncContextStrategy();
    else mC3.setDomainAsyncContextStrategy()
  }
  Kt2.setNodeAsyncContextStrategy = cC3
})
// @from(Start 12753351, End 12754202)
sG1 = z((zt2) => {
  Object.defineProperty(zt2, "__esModule", {
    value: !0
  });
  var lC3 = UA("util"),
    aG1 = _4(),
    Ht2 = i0(),
    Ct2 = "Console",
    iC3 = () => {
      return {
        name: Ct2,
        setupOnce() {},
        setup(A) {
          Ht2.addConsoleInstrumentationHandler(({
            args: Q,
            level: B
          }) => {
            if (aG1.getClient() !== A) return;
            aG1.addBreadcrumb({
              category: "console",
              level: Ht2.severityLevelFromString(B),
              message: lC3.format.apply(void 0, Q)
            }, {
              input: [...Q],
              level: B
            })
          })
        }
      }
    },
    Et2 = aG1.defineIntegration(iC3),
    nC3 = aG1.convertIntegrationFnToClass(Ct2, Et2);
  zt2.Console = nC3;
  zt2.consoleIntegration = Et2
})
// @from(Start 12754208, End 12762078)
rG1 = z((Tt2) => {
  var {
    _optionalChain: JQA
  } = i0();
  Object.defineProperty(Tt2, "__esModule", {
    value: !0
  });
  var rC3 = UA("child_process"),
    $t2 = UA("fs"),
    _O = UA("os"),
    oC3 = UA("path"),
    wt2 = UA("util"),
    qt2 = _4(),
    Nt2 = wt2.promisify($t2.readFile),
    Lt2 = wt2.promisify($t2.readdir),
    Mt2 = "Context",
    tC3 = (A = {}) => {
      let Q, B = {
        app: !0,
        os: !0,
        device: !0,
        culture: !0,
        cloudResource: !0,
        ...A
      };
      async function G(I) {
        if (Q === void 0) Q = Z();
        let Y = AE3(await Q);
        return I.contexts = {
          ...I.contexts,
          app: {
            ...Y.app,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.app])
          },
          os: {
            ...Y.os,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.os])
          },
          device: {
            ...Y.device,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.device])
          },
          culture: {
            ...Y.culture,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.culture])
          },
          cloud_resource: {
            ...Y.cloud_resource,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.cloud_resource])
          }
        }, I
      }
      async function Z() {
        let I = {};
        if (B.os) I.os = await QE3();
        if (B.app) I.app = GE3();
        if (B.device) I.device = Rt2(B.device);
        if (B.culture) {
          let Y = BE3();
          if (Y) I.culture = Y
        }
        if (B.cloudResource) I.cloud_resource = XE3();
        return I
      }
      return {
        name: Mt2,
        setupOnce() {},
        processEvent(I) {
          return G(I)
        }
      }
    },
    Ot2 = qt2.defineIntegration(tC3),
    eC3 = qt2.convertIntegrationFnToClass(Mt2, Ot2);

  function AE3(A) {
    if (JQA([A, "optionalAccess", (Q) => Q.app, "optionalAccess", (Q) => Q.app_memory])) A.app.app_memory = process.memoryUsage().rss;
    if (JQA([A, "optionalAccess", (Q) => Q.device, "optionalAccess", (Q) => Q.free_memory])) A.device.free_memory = _O.freemem();
    return A
  }
  async function QE3() {
    let A = _O.platform();
    switch (A) {
      case "darwin":
        return JE3();
      case "linux":
        return WE3();
      default:
        return {
          name: ZE3[A] || A, version: _O.release()
        }
    }
  }

  function BE3() {
    try {
      if (typeof process.versions.icu !== "string") return;
      let A = new Date(900000000);
      if (new Intl.DateTimeFormat("es", {
          month: "long"
        }).format(A) === "enero") {
        let B = Intl.DateTimeFormat().resolvedOptions();
        return {
          locale: B.locale,
          timezone: B.timeZone
        }
      }
    } catch (A) {}
    return
  }

  function GE3() {
    let A = process.memoryUsage().rss;
    return {
      app_start_time: new Date(Date.now() - process.uptime() * 1000).toISOString(),
      app_memory: A
    }
  }

  function Rt2(A) {
    let Q = {},
      B;
    try {
      B = _O.uptime && _O.uptime()
    } catch (G) {}
    if (typeof B === "number") Q.boot_time = new Date(Date.now() - B * 1000).toISOString();
    if (Q.arch = _O.arch(), A === !0 || A.memory) Q.memory_size = _O.totalmem(), Q.free_memory = _O.freemem();
    if (A === !0 || A.cpu) {
      let G = _O.cpus();
      if (G && G.length) {
        let Z = G[0];
        Q.processor_count = G.length, Q.cpu_description = Z.model, Q.processor_frequency = Z.speed
      }
    }
    return Q
  }
  var ZE3 = {
      aix: "IBM AIX",
      freebsd: "FreeBSD",
      openbsd: "OpenBSD",
      sunos: "SunOS",
      win32: "Windows"
    },
    IE3 = [{
      name: "fedora-release",
      distros: ["Fedora"]
    }, {
      name: "redhat-release",
      distros: ["Red Hat Linux", "Centos"]
    }, {
      name: "redhat_version",
      distros: ["Red Hat Linux"]
    }, {
      name: "SuSE-release",
      distros: ["SUSE Linux"]
    }, {
      name: "lsb-release",
      distros: ["Ubuntu Linux", "Arch Linux"]
    }, {
      name: "debian_version",
      distros: ["Debian"]
    }, {
      name: "debian_release",
      distros: ["Debian"]
    }, {
      name: "arch-release",
      distros: ["Arch Linux"]
    }, {
      name: "gentoo-release",
      distros: ["Gentoo Linux"]
    }, {
      name: "novell-release",
      distros: ["SUSE Linux"]
    }, {
      name: "alpine-release",
      distros: ["Alpine Linux"]
    }],
    YE3 = {
      alpine: (A) => A,
      arch: (A) => ty(/distrib_release=(.*)/, A),
      centos: (A) => ty(/release ([^ ]+)/, A),
      debian: (A) => A,
      fedora: (A) => ty(/release (..)/, A),
      mint: (A) => ty(/distrib_release=(.*)/, A),
      red: (A) => ty(/release ([^ ]+)/, A),
      suse: (A) => ty(/VERSION = (.*)\n/, A),
      ubuntu: (A) => ty(/distrib_release=(.*)/, A)
    };

  function ty(A, Q) {
    let B = A.exec(Q);
    return B ? B[1] : void 0
  }
  async function JE3() {
    let A = {
      kernel_version: _O.release(),
      name: "Mac OS X",
      version: `10.${Number(_O.release().split(".")[0])-4}`
    };
    try {
      let Q = await new Promise((B, G) => {
        rC3.execFile("/usr/bin/sw_vers", (Z, I) => {
          if (Z) {
            G(Z);
            return
          }
          B(I)
        })
      });
      A.name = ty(/^ProductName:\s+(.*)$/m, Q), A.version = ty(/^ProductVersion:\s+(.*)$/m, Q), A.build = ty(/^BuildVersion:\s+(.*)$/m, Q)
    } catch (Q) {}
    return A
  }

  function Ut2(A) {
    return A.split(" ")[0].toLowerCase()
  }
  async function WE3() {
    let A = {
      kernel_version: _O.release(),
      name: "Linux"
    };
    try {
      let Q = await Lt2("/etc"),
        B = IE3.find((J) => Q.includes(J.name));
      if (!B) return A;
      let G = oC3.join("/etc", B.name),
        Z = (await Nt2(G, {
          encoding: "utf-8"
        })).toLowerCase(),
        {
          distros: I
        } = B;
      A.name = I.find((J) => Z.indexOf(Ut2(J)) >= 0) || I[0];
      let Y = Ut2(A.name);
      A.version = YE3[Y](Z)
    } catch (Q) {}
    return A
  }

  function XE3() {
    if (process.env.VERCEL) return {
      "cloud.provider": "vercel",
      "cloud.region": process.env.VERCEL_REGION
    };
    else if (process.env.AWS_REGION) return {
      "cloud.provider": "aws",
      "cloud.region": process.env.AWS_REGION,
      "cloud.platform": process.env.AWS_EXECUTION_ENV
    };
    else if (process.env.GCP_PROJECT) return {
      "cloud.provider": "gcp"
    };
    else if (process.env.ALIYUN_REGION_ID) return {
      "cloud.provider": "alibaba_cloud",
      "cloud.region": process.env.ALIYUN_REGION_ID
    };
    else if (process.env.WEBSITE_SITE_NAME && process.env.REGION_NAME) return {
      "cloud.provider": "azure",
      "cloud.region": process.env.REGION_NAME
    };
    else if (process.env.IBM_CLOUD_REGION) return {
      "cloud.provider": "ibm_cloud",
      "cloud.region": process.env.IBM_CLOUD_REGION
    };
    else if (process.env.TENCENTCLOUD_REGION) return {
      "cloud.provider": "tencent_cloud",
      "cloud.region": process.env.TENCENTCLOUD_REGION,
      "cloud.account.id": process.env.TENCENTCLOUD_APPID,
      "cloud.availability_zone": process.env.TENCENTCLOUD_ZONE
    };
    else if (process.env.NETLIFY) return {
      "cloud.provider": "netlify"
    };
    else if (process.env.FLY_REGION) return {
      "cloud.provider": "fly.io",
      "cloud.region": process.env.FLY_REGION
    };
    else if (process.env.DYNO) return {
      "cloud.provider": "heroku"
    };
    else return
  }
  Tt2.Context = eC3;
  Tt2.getDeviceContext = Rt2;
  Tt2.nodeContextIntegration = Ot2;
  Tt2.readDirAsync = Lt2;
  Tt2.readFileAsync = Nt2
})
// @from(Start 12762084, End 12764161)
tG1 = z((kt2) => {
  var {
    _optionalChain: iY0
  } = i0();
  Object.defineProperty(kt2, "__esModule", {
    value: !0
  });
  var CE3 = UA("fs"),
    Pt2 = _4(),
    jt2 = i0(),
    oG1 = new jt2.LRUMap(100),
    EE3 = 7,
    St2 = "ContextLines";

  function zE3(A) {
    return new Promise((Q, B) => {
      CE3.readFile(A, "utf8", (G, Z) => {
        if (G) B(G);
        else Q(Z)
      })
    })
  }
  var UE3 = (A = {}) => {
      let Q = A.frameContextLines !== void 0 ? A.frameContextLines : EE3;
      return {
        name: St2,
        setupOnce() {},
        processEvent(B) {
          return wE3(B, Q)
        }
      }
    },
    _t2 = Pt2.defineIntegration(UE3),
    $E3 = Pt2.convertIntegrationFnToClass(St2, _t2);
  async function wE3(A, Q) {
    let B = {},
      G = [];
    if (Q > 0 && iY0([A, "access", (Z) => Z.exception, "optionalAccess", (Z) => Z.values]))
      for (let Z of A.exception.values) {
        if (!iY0([Z, "access", (I) => I.stacktrace, "optionalAccess", (I) => I.frames])) continue;
        for (let I = Z.stacktrace.frames.length - 1; I >= 0; I--) {
          let Y = Z.stacktrace.frames[I];
          if (Y.filename && !B[Y.filename] && !oG1.get(Y.filename)) G.push(NE3(Y.filename)), B[Y.filename] = 1
        }
      }
    if (G.length > 0) await Promise.all(G);
    if (Q > 0 && iY0([A, "access", (Z) => Z.exception, "optionalAccess", (Z) => Z.values])) {
      for (let Z of A.exception.values)
        if (Z.stacktrace && Z.stacktrace.frames) await qE3(Z.stacktrace.frames, Q)
    }
    return A
  }

  function qE3(A, Q) {
    for (let B of A)
      if (B.filename && B.context_line === void 0) {
        let G = oG1.get(B.filename);
        if (G) try {
          jt2.addContextToFrame(G, B, Q)
        } catch (Z) {}
      }
  }
  async function NE3(A) {
    let Q = oG1.get(A);
    if (Q === null) return null;
    if (Q !== void 0) return Q;
    let B = null;
    try {
      B = (await zE3(A)).split(`
`)
    } catch (G) {}
    return oG1.set(A, B), B
  }
  kt2.ContextLines = $E3;
  kt2.contextLinesIntegration = _t2
})
// @from(Start 12764167, End 12764340)
uPA = z((yt2) => {
  Object.defineProperty(yt2, "__esModule", {
    value: !0
  });
  var OE3 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  yt2.DEBUG_BUILD = OE3
})
// @from(Start 5158271, End 5158528)
async function T8B(A) {
  let {
    instance: Q,
    timeout: B,
    skipCache: G,
    allowStale: Z,
    backgroundSync: I
  } = A;
  if (!I) bH.backgroundSync = !1;
  return Do8({
    instance: Q,
    allowStale: Z,
    timeout: B,
    skipCache: G
  })
}
// @from(Start 5158530, End 5158624)
function Vo8(A) {
  let Q = izA(A),
    B = m3A.get(Q) || new Set;
  B.add(A), m3A.set(Q, B)
}
// @from(Start 5158626, End 5158679)
function P8B(A) {
  m3A.forEach((Q) => Q.delete(A))
}
// @from(Start 5158681, End 5158776)
function Fo8() {
  d3A.forEach((A) => {
    if (!A) return;
    A.state = "idle", Yb1(A)
  })
}
// @from(Start 5158778, End 5158891)
function Ko8() {
  d3A.forEach((A) => {
    if (!A) return;
    if (A.state !== "idle") return;
    Jb1(A)
  })
}
// @from(Start 5158892, End 5159064)
async function O8B() {
  try {
    if (!O_.localStorage) return;
    await O_.localStorage.setItem(bH.cacheKey, JSON.stringify(Array.from(ub.entries())))
  } catch (A) {}
}
// @from(Start 5159065, End 5159674)
async function Do8(A) {
  let {
    instance: Q,
    allowStale: B,
    timeout: G,
    skipCache: Z
  } = A, I = izA(Q), Y = Zb1(Q), J = new Date, W = new Date(J.getTime() - bH.maxAge + bH.staleTTL);
  await Ho8();
  let X = !bH.disableCache && !Z ? ub.get(Y) : void 0;
  if (X && (B || X.staleAt > J) && X.staleAt > W) {
    if (X.sse) c3A.add(I);
    if (X.staleAt < J) Gb1(Q);
    else Ib1(Q);
    return {
      data: X.data,
      success: !0,
      source: "cache"
    }
  } else return await ciA(Gb1(Q), G) || {
    data: null,
    success: !1,
    source: "timeout",
    error: Error("Timeout")
  }
}
// @from(Start 5159676, End 5159748)
function izA(A) {
  let [Q, B] = A.getApiInfo();
  return `${Q}||${B}`
}
// @from(Start 5159750, End 5160110)
function Zb1(A) {
  let Q = izA(A);
  if (!("isRemoteEval" in A) || !A.isRemoteEval()) return Q;
  let B = A.getAttributes(),
    G = A.getCacheKeyAttributes() || Object.keys(A.getAttributes()),
    Z = {};
  G.forEach((J) => {
    Z[J] = B[J]
  });
  let I = A.getForcedVariations(),
    Y = A.getUrl();
  return `${Q}||${JSON.stringify({ca:Z,fv:I,url:Y})}`
}
// @from(Start 5160111, End 5160665)
async function Ho8() {
  if (M8B) return;
  M8B = !0;
  try {
    if (O_.localStorage) {
      let A = await O_.localStorage.getItem(bH.cacheKey);
      if (!bH.disableCache && A) {
        let Q = JSON.parse(A);
        if (Q && Array.isArray(Q)) Q.forEach((B) => {
          let [G, Z] = B;
          ub.set(G, {
            ...Z,
            staleAt: new Date(Z.staleAt)
          })
        });
        j8B()
      }
    }
  } catch (A) {}
  if (!bH.disableIdleStreams) {
    let A = u3A.startIdleListener();
    if (A) u3A.stopIdleListener = A
  }
}
// @from(Start 5160667, End 5160992)
function j8B() {
  let A = Array.from(ub.entries()).map((B) => {
      let [G, Z] = B;
      return {
        key: G,
        staleAt: Z.staleAt.getTime()
      }
    }).sort((B, G) => B.staleAt - G.staleAt),
    Q = Math.min(Math.max(0, ub.size - bH.maxEntries), ub.size);
  for (let B = 0; B < Q; B++) ub.delete(A[B].key)
}
// @from(Start 5160994, End 5161397)
function S8B(A, Q, B) {
  let G = B.dateUpdated || "",
    Z = new Date(Date.now() + bH.staleTTL),
    I = !bH.disableCache ? ub.get(Q) : void 0;
  if (I && G && I.version === G) {
    I.staleAt = Z, O8B();
    return
  }
  if (!bH.disableCache) ub.set(Q, {
    data: B,
    version: G,
    staleAt: Z,
    sse: c3A.has(A)
  }), j8B();
  O8B();
  let Y = m3A.get(A);
  Y && Y.forEach((J) => Co8(J, B))
}
// @from(Start 5161398, End 5161468)
async function Co8(A, Q) {
  await A.setPayload(Q || A.getPayload())
}
// @from(Start 5161469, End 5162493)
async function Gb1(A) {
  let {
    apiHost: Q,
    apiRequestHeaders: B
  } = A.getApiHosts(), G = A.getClientKey(), Z = "isRemoteEval" in A && A.isRemoteEval(), I = izA(A), Y = Zb1(A), J = piA.get(Y);
  if (!J) J = (Z ? u3A.fetchRemoteEvalCall({
    host: Q,
    clientKey: G,
    payload: {
      attributes: A.getAttributes(),
      forcedVariations: A.getForcedVariations(),
      forcedFeatures: Array.from(A.getForcedFeatures().entries()),
      url: A.getUrl()
    },
    headers: B
  }) : u3A.fetchFeaturesCall({
    host: Q,
    clientKey: G,
    headers: B
  })).then((X) => {
    if (!X.ok) throw Error(`HTTP error: ${X.status}`);
    if (X.headers.get("x-sse-support") === "enabled") c3A.add(I);
    return X.json()
  }).then((X) => {
    return S8B(I, Y, X), Ib1(A), piA.delete(Y), {
      data: X,
      success: !0,
      source: "network"
    }
  }).catch((X) => {
    return piA.delete(Y), {
      data: null,
      source: "error",
      success: !1,
      error: X
    }
  }), piA.set(Y, J);
  return J
}
// @from(Start 5162495, End 5163399)
function Ib1(A) {
  let Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
    B = izA(A),
    G = Zb1(A),
    {
      streamingHost: Z,
      streamingHostRequestHeaders: I
    } = A.getApiHosts(),
    Y = A.getClientKey();
  if (Q) c3A.add(B);
  if (bH.backgroundSync && c3A.has(B) && O_.EventSource) {
    if (d3A.has(B)) return;
    let J = {
      src: null,
      host: Z,
      clientKey: Y,
      headers: I,
      cb: (W) => {
        try {
          if (W.type === "features-updated") {
            let X = m3A.get(B);
            X && X.forEach((V) => {
              Gb1(V)
            })
          } else if (W.type === "features") {
            let X = JSON.parse(W.data);
            S8B(B, G, X)
          }
          J.errors = 0
        } catch (X) {
          _8B(J)
        }
      },
      errors: 0,
      state: "active"
    };
    d3A.set(B, J), Jb1(J)
  }
}
// @from(Start 5163401, End 5163726)
function _8B(A) {
  if (A.state === "idle") return;
  if (A.errors++, A.errors > 3 || A.src && A.src.readyState === 2) {
    let Q = Math.pow(3, A.errors - 3) * (1000 + Math.random() * 1000);
    Yb1(A), setTimeout(() => {
      if (["idle", "active"].includes(A.state)) return;
      Jb1(A)
    }, Math.min(Q, 300000))
  }
}
// @from(Start 5163728, End 5163890)
function Yb1(A) {
  if (!A.src) return;
  if (A.src.onopen = null, A.src.onerror = null, A.src.close(), A.src = null, A.state === "active") A.state = "disabled"
}
// @from(Start 5163892, End 5164204)
function Jb1(A) {
  A.src = u3A.eventSourceCall({
    host: A.host,
    clientKey: A.clientKey,
    headers: A.headers
  }), A.state = "active", A.src.addEventListener("features", A.cb), A.src.addEventListener("features-updated", A.cb), A.src.onerror = () => _8B(A), A.src.onopen = () => {
    A.errors = 0
  }
}
// @from(Start 5164206, End 5164252)
function Eo8(A, Q) {
  Yb1(A), d3A.delete(Q)
}
// @from(Start 5164254, End 5164341)
function zo8() {
  c3A.clear(), d3A.forEach(Eo8), m3A.clear(), u3A.stopIdleListener()
}
// @from(Start 5164343, End 5164518)
function liA(A, Q) {
  if (Q.streaming) {
    if (!A.getClientKey()) throw Error("Must specify clientKey to enable streaming");
    if (Q.payload) Ib1(A, !0);
    Vo8(A)
  }
}
// @from(Start 5164523, End 5164525)
bH
// @from(Start 5164527, End 5164529)
O_
// @from(Start 5164531, End 5164534)
u3A
// @from(Start 5164536, End 5164539)
m3A
// @from(Start 5164541, End 5164549)
M8B = !1
// @from(Start 5164553, End 5164555)
ub
// @from(Start 5164557, End 5164560)
piA
// @from(Start 5164562, End 5164565)
d3A
// @from(Start 5164567, End 5164570)
c3A
// @from(Start 5164576, End 5166316)
k8B = L(() => {
  lzA();
  bH = {
    staleTTL: 60000,
    maxAge: 14400000,
    cacheKey: "gbFeaturesCache",
    backgroundSync: !0,
    maxEntries: 10,
    disableIdleStreams: !1,
    idleStreamInterval: 20000,
    disableCache: !1
  }, O_ = E8B(), u3A = {
    fetchFeaturesCall: (A) => {
      let {
        host: Q,
        clientKey: B,
        headers: G
      } = A;
      return O_.fetch(`${Q}/api/features/${B}`, {
        headers: G
      })
    },
    fetchRemoteEvalCall: (A) => {
      let {
        host: Q,
        clientKey: B,
        payload: G,
        headers: Z
      } = A, I = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...Z
        },
        body: JSON.stringify(G)
      };
      return O_.fetch(`${Q}/api/eval/${B}`, I)
    },
    eventSourceCall: (A) => {
      let {
        host: Q,
        clientKey: B,
        headers: G
      } = A;
      if (G) return new O_.EventSource(`${Q}/sub/${B}`, {
        headers: G
      });
      return new O_.EventSource(`${Q}/sub/${B}`)
    },
    startIdleListener: () => {
      let A;
      if (!(typeof window < "u" && typeof document < "u")) return;
      let B = () => {
        if (document.visibilityState === "visible") window.clearTimeout(A), Ko8();
        else if (document.visibilityState === "hidden") A = window.setTimeout(Fo8, bH.idleStreamInterval)
      };
      return document.addEventListener("visibilitychange", B), () => document.removeEventListener("visibilitychange", B)
    },
    stopIdleListener: () => {}
  };
  try {
    if (globalThis.localStorage) O_.localStorage = globalThis.localStorage
  } catch (A) {}
  m3A = new Map, ub = new Map, piA = new Map, d3A = new Map, c3A = new Set
})
// @from(Start 5166322, End 5175522)
p8B = z((c8B) => {
  Object.defineProperty(c8B, "__esModule", {
    value: !0
  });
  var b8B = /^[a-zA-Z:_][a-zA-Z0-9:_.-]*$/,
    Vb1 = {
      revert: function() {}
    },
    siA = new Map,
    Xb1 = new Set;

  function riA(A) {
    var Q = siA.get(A);
    return Q || siA.set(A, Q = {
      element: A,
      attributes: {}
    }), Q
  }

  function oiA(A, Q, B, G, Z) {
    var I = B(A),
      Y = {
        isDirty: !1,
        originalValue: I,
        virtualValue: I,
        mutations: [],
        el: A,
        _positionTimeout: null,
        observer: new MutationObserver(function() {
          if (Q !== "position" || !Y._positionTimeout) {
            Q === "position" && (Y._positionTimeout = setTimeout(function() {
              Y._positionTimeout = null
            }, 1000));
            var J = B(A);
            Q === "position" && J.parentNode === Y.virtualValue.parentNode && J.insertBeforeNode === Y.virtualValue.insertBeforeNode || J !== Y.virtualValue && (Y.originalValue = J, Z(Y))
          }
        }),
        mutationRunner: Z,
        setValue: G,
        getCurrentValue: B
      };
    return Q === "position" && A.parentNode ? Y.observer.observe(A.parentNode, {
      childList: !0,
      subtree: !0,
      attributes: !1,
      characterData: !1
    }) : Y.observer.observe(A, function(J) {
      return J === "html" ? {
        childList: !0,
        subtree: !0,
        attributes: !0,
        characterData: !0
      } : {
        childList: !1,
        subtree: !1,
        attributes: !0,
        attributeFilter: [J]
      }
    }(Q)), Y
  }

  function tiA(A, Q) {
    var B = Q.getCurrentValue(Q.el);
    Q.virtualValue = A, A && typeof A != "string" ? B && A.parentNode === B.parentNode && A.insertBeforeNode === B.insertBeforeNode || (Q.isDirty = !0, y8B()) : A !== B && (Q.isDirty = !0, y8B())
  }

  function Uo8(A) {
    var Q = A.originalValue;
    A.mutations.forEach(function(B) {
      return Q = B.mutate(Q)
    }), tiA(function(B) {
      return iiA || (iiA = document.createElement("div")), iiA.innerHTML = B, iiA.innerHTML
    }(Q), A)
  }

  function $o8(A) {
    var Q = new Set(A.originalValue.split(/\s+/).filter(Boolean));
    A.mutations.forEach(function(B) {
      return B.mutate(Q)
    }), tiA(Array.from(Q).filter(Boolean).join(" "), A)
  }

  function wo8(A) {
    var Q = A.originalValue;
    A.mutations.forEach(function(B) {
      return Q = B.mutate(Q)
    }), tiA(Q, A)
  }

  function qo8(A) {
    var Q = A.originalValue;
    A.mutations.forEach(function(B) {
      var G = function(Z) {
        var I = Z.insertBeforeSelector,
          Y = document.querySelector(Z.parentSelector);
        if (!Y) return null;
        var J = I ? document.querySelector(I) : null;
        return I && !J ? null : {
          parentNode: Y,
          insertBeforeNode: J
        }
      }(B.mutate());
      Q = G || Q
    }), tiA(Q, A)
  }
  var No8 = function(A) {
      return A.innerHTML
    },
    Lo8 = function(A, Q) {
      return A.innerHTML = Q
    };

  function f8B(A) {
    var Q = riA(A);
    return Q.html || (Q.html = oiA(A, "html", No8, Lo8, Uo8)), Q.html
  }
  var Mo8 = function(A) {
      return {
        parentNode: A.parentElement,
        insertBeforeNode: A.nextElementSibling
      }
    },
    Oo8 = function(A, Q) {
      Q.insertBeforeNode && !Q.parentNode.contains(Q.insertBeforeNode) || Q.parentNode.insertBefore(A, Q.insertBeforeNode)
    };

  function h8B(A) {
    var Q = riA(A);
    return Q.position || (Q.position = oiA(A, "position", Mo8, Oo8, qo8)), Q.position
  }
  var iiA, azA, Ro8 = function(A, Q) {
      return Q ? A.className = Q : A.removeAttribute("class")
    },
    To8 = function(A) {
      return A.className
    };

  function g8B(A) {
    var Q = riA(A);
    return Q.classes || (Q.classes = oiA(A, "class", To8, Ro8, $o8)), Q.classes
  }

  function u8B(A, Q) {
    var B, G = riA(A);
    return G.attributes[Q] || (G.attributes[Q] = oiA(A, Q, (B = Q, function(Z) {
      var I;
      return (I = Z.getAttribute(B)) != null ? I : null
    }), function(Z) {
      return function(I, Y) {
        return Y !== null ? I.setAttribute(Z, Y) : I.removeAttribute(Z)
      }
    }(Q), wo8)), G.attributes[Q]
  }

  function niA(A, Q, B) {
    if (B.isDirty) {
      B.isDirty = !1;
      var G = B.virtualValue;
      B.mutations.length || function(Z, I) {
        var Y, J, W = siA.get(Z);
        if (W)
          if (I === "html")(Y = W.html) == null || (J = Y.observer) == null || J.disconnect(), delete W.html;
          else if (I === "class") {
          var X, V;
          (X = W.classes) == null || (V = X.observer) == null || V.disconnect(), delete W.classes
        } else if (I === "position") {
          var F, K;
          (F = W.position) == null || (K = F.observer) == null || K.disconnect(), delete W.position
        } else {
          var D, H, C;
          (D = W.attributes) == null || (H = D[I]) == null || (C = H.observer) == null || C.disconnect(), delete W.attributes[I]
        }
      }(A, Q), B.setValue(A, G)
    }
  }

  function Po8(A, Q) {
    A.html && niA(Q, "html", A.html), A.classes && niA(Q, "class", A.classes), A.position && niA(Q, "position", A.position), Object.keys(A.attributes).forEach(function(B) {
      niA(Q, B, A.attributes[B])
    })
  }

  function y8B() {
    siA.forEach(Po8)
  }

  function m8B(A) {
    if (A.kind !== "position" || A.elements.size !== 1) {
      var Q = new Set(A.elements);
      document.querySelectorAll(A.selector).forEach(function(B) {
        Q.has(B) || (A.elements.add(B), function(G, Z) {
          var I = null;
          G.kind === "html" ? I = f8B(Z) : G.kind === "class" ? I = g8B(Z) : G.kind === "attribute" ? I = u8B(Z, G.attribute) : G.kind === "position" && (I = h8B(Z)), I && (I.mutations.push(G), I.mutationRunner(I))
        }(A, B))
      })
    }
  }

  function x8B() {
    Xb1.forEach(m8B)
  }

  function d8B() {
    typeof document < "u" && (azA || (azA = new MutationObserver(function() {
      x8B()
    })), x8B(), azA.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !1,
      characterData: !1
    }))
  }

  function eiA(A) {
    return typeof document > "u" ? Vb1 : (Xb1.add(A), m8B(A), {
      revert: function() {
        var Q;
        (Q = A).elements.forEach(function(B) {
          return function(G, Z) {
            var I = null;
            if (G.kind === "html" ? I = f8B(Z) : G.kind === "class" ? I = g8B(Z) : G.kind === "attribute" ? I = u8B(Z, G.attribute) : G.kind === "position" && (I = h8B(Z)), I) {
              var Y = I.mutations.indexOf(G);
              Y !== -1 && I.mutations.splice(Y, 1), I.mutationRunner(I)
            }
          }(Q, B)
        }), Q.elements.clear(), Xb1.delete(Q)
      }
    })
  }

  function Wb1(A, Q) {
    return eiA({
      kind: "html",
      elements: new Set,
      mutate: Q,
      selector: A
    })
  }

  function v8B(A, Q) {
    return eiA({
      kind: "position",
      elements: new Set,
      mutate: Q,
      selector: A
    })
  }

  function nzA(A, Q) {
    return eiA({
      kind: "class",
      elements: new Set,
      mutate: Q,
      selector: A
    })
  }

  function aiA(A, Q, B) {
    return b8B.test(Q) ? Q === "class" || Q === "className" ? nzA(A, function(G) {
      var Z = B(Array.from(G).join(" "));
      G.clear(), Z && Z.split(/\s+/g).filter(Boolean).forEach(function(I) {
        return G.add(I)
      })
    }) : eiA({
      kind: "attribute",
      attribute: Q,
      elements: new Set,
      mutate: B,
      selector: A
    }) : Vb1
  }
  d8B();
  var jo8 = {
    html: Wb1,
    classes: nzA,
    attribute: aiA,
    position: v8B,
    declarative: function(A) {
      var {
        selector: Q,
        action: B,
        value: G,
        attribute: Z,
        parentSelector: I,
        insertBeforeSelector: Y
      } = A;
      if (Z === "html") {
        if (B === "append") return Wb1(Q, function(J) {
          return J + (G != null ? G : "")
        });
        if (B === "set") return Wb1(Q, function() {
          return G != null ? G : ""
        })
      } else if (Z === "class") {
        if (B === "append") return nzA(Q, function(J) {
          G && J.add(G)
        });
        if (B === "remove") return nzA(Q, function(J) {
          G && J.delete(G)
        });
        if (B === "set") return nzA(Q, function(J) {
          J.clear(), G && J.add(G)
        })
      } else if (Z === "position") {
        if (B === "set" && I) return v8B(Q, function() {
          return {
            insertBeforeSelector: Y,
            parentSelector: I
          }
        })
      } else {
        if (B === "append") return aiA(Q, Z, function(J) {
          return J !== null ? J + (G != null ? G : "") : G != null ? G : ""
        });
        if (B === "set") return aiA(Q, Z, function() {
          return G != null ? G : ""
        });
        if (B === "remove") return aiA(Q, Z, function() {
          return null
        })
      }
      return Vb1
    }
  };
  c8B.connectGlobalObserver = d8B, c8B.default = jo8, c8B.disconnectGlobalObserver = function() {
    azA && azA.disconnect()
  }, c8B.validAttributeName = b8B
})
// @from(Start 5175525, End 5175949)
function gc(A, Q, B) {
  B = B || {};
  for (let [G, Z] of Object.entries(Q)) switch (G) {
    case "$or":
      if (!l8B(A, Z, B)) return !1;
      break;
    case "$nor":
      if (l8B(A, Z, B)) return !1;
      break;
    case "$and":
      if (!vo8(A, Z, B)) return !1;
      break;
    case "$not":
      if (gc(A, Z, B)) return !1;
      break;
    default:
      if (!szA(Z, So8(A, G), B)) return !1
  }
  return !0
}
// @from(Start 5175951, End 5176140)
function So8(A, Q) {
  let B = Q.split("."),
    G = A;
  for (let Z = 0; Z < B.length; Z++)
    if (G && typeof G === "object" && B[Z] in G) G = G[B[Z]];
    else return null;
  return G
}
// @from(Start 5176142, End 5176247)
function _o8(A) {
  if (!Fb1[A]) Fb1[A] = new RegExp(A.replace(/([^\\])\//g, "$1\\/"));
  return Fb1[A]
}
// @from(Start 5176249, End 5176626)
function szA(A, Q, B) {
  if (typeof A === "string") return Q + "" === A;
  if (typeof A === "number") return Q * 1 === A;
  if (typeof A === "boolean") return Q !== null && !!Q === A;
  if (A === null) return Q === null;
  if (Array.isArray(A) || !i8B(A)) return JSON.stringify(Q) === JSON.stringify(A);
  for (let G in A)
    if (!xo8(G, Q, A[G], B)) return !1;
  return !0
}
// @from(Start 5176628, End 5176748)
function i8B(A) {
  let Q = Object.keys(A);
  return Q.length > 0 && Q.filter((B) => B[0] === "$").length === Q.length
}
// @from(Start 5176750, End 5176965)
function ko8(A) {
  if (A === null) return "null";
  if (Array.isArray(A)) return "array";
  let Q = typeof A;
  if (["string", "number", "boolean", "object", "undefined"].includes(Q)) return Q;
  return "unknown"
}
// @from(Start 5176967, End 5177174)
function yo8(A, Q, B) {
  if (!Array.isArray(A)) return !1;
  let G = i8B(Q) ? (Z) => szA(Q, Z, B) : (Z) => gc(Z, Q, B);
  for (let Z = 0; Z < A.length; Z++)
    if (A[Z] && G(A[Z])) return !0;
  return !1
}
// @from(Start 5177176, End 5177282)
function AnA(A, Q) {
  if (Array.isArray(A)) return A.some((B) => Q.includes(B));
  return Q.includes(A)
}
// @from(Start 5177284, End 5178868)
function xo8(A, Q, B, G) {
  switch (A) {
    case "$veq":
      return aw(Q) === aw(B);
    case "$vne":
      return aw(Q) !== aw(B);
    case "$vgt":
      return aw(Q) > aw(B);
    case "$vgte":
      return aw(Q) >= aw(B);
    case "$vlt":
      return aw(Q) < aw(B);
    case "$vlte":
      return aw(Q) <= aw(B);
    case "$eq":
      return Q === B;
    case "$ne":
      return Q !== B;
    case "$lt":
      return Q < B;
    case "$lte":
      return Q <= B;
    case "$gt":
      return Q > B;
    case "$gte":
      return Q >= B;
    case "$exists":
      return B ? Q != null : Q == null;
    case "$in":
      if (!Array.isArray(B)) return !1;
      return AnA(Q, B);
    case "$inGroup":
      return AnA(Q, G[B] || []);
    case "$notInGroup":
      return !AnA(Q, G[B] || []);
    case "$nin":
      if (!Array.isArray(B)) return !1;
      return !AnA(Q, B);
    case "$not":
      return !szA(B, Q, G);
    case "$size":
      if (!Array.isArray(Q)) return !1;
      return szA(B, Q.length, G);
    case "$elemMatch":
      return yo8(Q, B, G);
    case "$all":
      if (!Array.isArray(Q)) return !1;
      for (let Z = 0; Z < B.length; Z++) {
        let I = !1;
        for (let Y = 0; Y < Q.length; Y++)
          if (szA(B[Z], Q[Y], G)) {
            I = !0;
            break
          } if (!I) return !1
      }
      return !0;
    case "$regex":
      try {
        return _o8(B).test(Q)
      } catch (Z) {
        return !1
      }
    case "$type":
      return ko8(Q) === B;
    default:
      return console.error("Unknown operator: " + A), !1
  }
}
// @from(Start 5178870, End 5179007)
function l8B(A, Q, B) {
  if (!Q.length) return !0;
  for (let G = 0; G < Q.length; G++)
    if (gc(A, Q[G], B)) return !0;
  return !1
}
// @from(Start 5179009, End 5179119)
function vo8(A, Q, B) {
  for (let G = 0; G < Q.length; G++)
    if (!gc(A, Q[G], B)) return !1;
  return !0
}
// @from(Start 5179124, End 5179127)
Fb1
// @from(Start 5179133, End 5179171)
n8B = L(() => {
  lzA();
  Fb1 = {}
})
// @from(Start 5179174, End 5179413)
function ho8(A) {
  let Q = new Map;
  if (A.global.forcedFeatureValues) A.global.forcedFeatureValues.forEach((B, G) => Q.set(G, B));
  if (A.user.forcedFeatureValues) A.user.forcedFeatureValues.forEach((B, G) => Q.set(G, B));
  return Q
}
// @from(Start 5179415, End 5179730)
function go8(A) {
  if (A.global.forcedVariations && A.user.forcedVariations) return {
    ...A.global.forcedVariations,
    ...A.user.forcedVariations
  };
  else if (A.global.forcedVariations) return A.global.forcedVariations;
  else if (A.user.forcedVariations) return A.user.forcedVariations;
  else return {}
}
// @from(Start 5179731, End 5179795)
async function p3A(A) {
  try {
    await A()
  } catch (Q) {}
}
// @from(Start 5179797, End 5180628)
function a8B(A, Q, B) {
  if (A.user.trackedExperiments) {
    let Z = GnA(Q, B);
    if (A.user.trackedExperiments.has(Z)) return [];
    A.user.trackedExperiments.add(Z)
  }
  if (A.user.enableDevMode && A.user.devLogs) A.user.devLogs.push({
    experiment: Q,
    result: B,
    timestamp: Date.now().toString(),
    logType: "experiment"
  });
  let G = [];
  if (A.global.trackingCallback) {
    let Z = A.global.trackingCallback;
    G.push(p3A(() => Z(Q, B, A.user)))
  }
  if (A.user.trackingCallback) {
    let Z = A.user.trackingCallback;
    G.push(p3A(() => Z(Q, B)))
  }
  if (A.global.eventLogger) {
    let Z = A.global.eventLogger;
    G.push(p3A(() => Z(fo8, {
      experimentId: Q.key,
      variationId: B.key,
      hashAttribute: B.hashAttribute,
      hashValue: B.hashValue
    }, A.user)))
  }
  return G
}
// @from(Start 5180630, End 5181510)
function uo8(A, Q, B) {
  if (A.user.trackedFeatureUsage) {
    let G = JSON.stringify(B.value);
    if (A.user.trackedFeatureUsage[Q] === G) return;
    if (A.user.trackedFeatureUsage[Q] = G, A.user.enableDevMode && A.user.devLogs) A.user.devLogs.push({
      featureKey: Q,
      result: B,
      timestamp: Date.now().toString(),
      logType: "feature"
    })
  }
  if (A.global.onFeatureUsage) {
    let G = A.global.onFeatureUsage;
    p3A(() => G(Q, B, A.user))
  }
  if (A.user.onFeatureUsage) {
    let G = A.user.onFeatureUsage;
    p3A(() => G(Q, B))
  }
  if (A.global.eventLogger) {
    let G = A.global.eventLogger;
    p3A(() => G(bo8, {
      feature: Q,
      source: B.source,
      value: B.value,
      ruleId: B.source === "defaultValue" ? "$default" : B.ruleId || "",
      variationId: B.experimentResult ? B.experimentResult.key : ""
    }, A.user))
  }
}
// @from(Start 5181512, End 5184351)
function QnA(A, Q) {
  if (Q.stack.evaluatedFeatures.has(A)) return uc(Q, A, null, "cyclicPrerequisite");
  Q.stack.evaluatedFeatures.add(A), Q.stack.id = A;
  let B = ho8(Q);
  if (B.has(A)) return uc(Q, A, B.get(A), "override");
  if (!Q.global.features || !Q.global.features[A]) return uc(Q, A, null, "unknownFeature");
  let G = Q.global.features[A];
  if (G.rules) {
    let Z = new Set(Q.stack.evaluatedFeatures);
    A: for (let I of G.rules) {
      if (I.parentConditions)
        for (let W of I.parentConditions) {
          Q.stack.evaluatedFeatures = new Set(Z);
          let X = QnA(W.id, Q);
          if (X.source === "cyclicPrerequisite") return uc(Q, A, null, "cyclicPrerequisite");
          let V = {
            value: X.value
          };
          if (!gc(V, W.condition || {})) {
            if (W.gate) return uc(Q, A, null, "prerequisite");
            continue A
          }
        }
      if (I.filters && o8B(I.filters, Q)) continue;
      if ("force" in I) {
        if (I.condition && !r8B(I.condition, Q)) continue;
        if (!mo8(Q, I.seed || A, I.hashAttribute, Q.user.saveStickyBucketAssignmentDoc && !I.disableStickyBucketing ? I.fallbackAttribute : void 0, I.range, I.coverage, I.hashVersion)) continue;
        if (I.tracks) I.tracks.forEach((W) => {
          if (!a8B(Q, W.experiment, W.result).length && Q.global.saveDeferredTrack) Q.global.saveDeferredTrack({
            experiment: W.experiment,
            result: W.result
          })
        });
        return uc(Q, A, I.force, "force", I.id)
      }
      if (!I.variations) continue;
      let Y = {
        variations: I.variations,
        key: I.key || A
      };
      if ("coverage" in I) Y.coverage = I.coverage;
      if (I.weights) Y.weights = I.weights;
      if (I.hashAttribute) Y.hashAttribute = I.hashAttribute;
      if (I.fallbackAttribute) Y.fallbackAttribute = I.fallbackAttribute;
      if (I.disableStickyBucketing) Y.disableStickyBucketing = I.disableStickyBucketing;
      if (I.bucketVersion !== void 0) Y.bucketVersion = I.bucketVersion;
      if (I.minBucketVersion !== void 0) Y.minBucketVersion = I.minBucketVersion;
      if (I.namespace) Y.namespace = I.namespace;
      if (I.meta) Y.meta = I.meta;
      if (I.ranges) Y.ranges = I.ranges;
      if (I.name) Y.name = I.name;
      if (I.phase) Y.phase = I.phase;
      if (I.seed) Y.seed = I.seed;
      if (I.hashVersion) Y.hashVersion = I.hashVersion;
      if (I.filters) Y.filters = I.filters;
      if (I.condition) Y.condition = I.condition;
      let {
        result: J
      } = BnA(Y, A, Q);
      if (Q.global.onExperimentEval && Q.global.onExperimentEval(Y, J), J.inExperiment && !J.passthrough) return uc(Q, A, J.value, "experiment", I.id, Y, J)
    }
  }
  return uc(Q, A, G.defaultValue === void 0 ? null : G.defaultValue, "defaultValue")
}
// @from(Start 5184353, End 5188154)
function BnA(A, Q, B) {
  let G = A.key,
    Z = A.variations.length;
  if (Z < 2) return {
    result: QY(B, A, -1, !1, Q)
  };
  if (B.global.enabled === !1 || B.user.enabled === !1) return {
    result: QY(B, A, -1, !1, Q)
  };
  if (A = do8(A, B), A.urlPatterns && !miA(B.user.url || "", A.urlPatterns)) return {
    result: QY(B, A, -1, !1, Q)
  };
  let I = w8B(G, B.user.url || "", Z);
  if (I !== null) return {
    result: QY(B, A, I, !1, Q)
  };
  let Y = go8(B);
  if (G in Y) {
    let E = Y[G];
    return {
      result: QY(B, A, E, !1, Q)
    }
  }
  if (A.status === "draft" || A.active === !1) return {
    result: QY(B, A, -1, !1, Q)
  };
  let {
    hashAttribute: J,
    hashValue: W
  } = Vt(B, A.hashAttribute, B.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing ? A.fallbackAttribute : void 0);
  if (!W) return {
    result: QY(B, A, -1, !1, Q)
  };
  let X = -1,
    V = !1,
    F = !1;
  if (B.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing) {
    let {
      variation: E,
      versionIsBlocked: U
    } = lo8({
      ctx: B,
      expKey: A.key,
      expBucketVersion: A.bucketVersion,
      expHashAttribute: A.hashAttribute,
      expFallbackAttribute: A.fallbackAttribute,
      expMinBucketVersion: A.minBucketVersion,
      expMeta: A.meta
    });
    V = E >= 0, X = E, F = !!U
  }
  if (!V) {
    if (A.filters) {
      if (o8B(A.filters, B)) return {
        result: QY(B, A, -1, !1, Q)
      }
    } else if (A.namespace && !z8B(W, A.namespace)) return {
      result: QY(B, A, -1, !1, Q)
    };
    if (A.include && !q8B(A.include)) return {
      result: QY(B, A, -1, !1, Q)
    };
    if (A.condition && !r8B(A.condition, B)) return {
      result: QY(B, A, -1, !1, Q)
    };
    if (A.parentConditions) {
      let E = new Set(B.stack.evaluatedFeatures);
      for (let U of A.parentConditions) {
        B.stack.evaluatedFeatures = new Set(E);
        let q = QnA(U.id, B);
        if (q.source === "cyclicPrerequisite") return {
          result: QY(B, A, -1, !1, Q)
        };
        let w = {
          value: q.value
        };
        if (!gc(w, U.condition || {})) return {
          result: QY(B, A, -1, !1, Q)
        }
      }
    }
    if (A.groups && !po8(A.groups, B)) return {
      result: QY(B, A, -1, !1, Q)
    }
  }
  if (A.url && !co8(A.url, B)) return {
    result: QY(B, A, -1, !1, Q)
  };
  let K = czA(A.seed || G, W, A.hashVersion || 1);
  if (K === null) return {
    result: QY(B, A, -1, !1, Q)
  };
  if (!V) {
    let E = A.ranges || $8B(Z, A.coverage === void 0 ? 1 : A.coverage, A.weights);
    X = U8B(K, E)
  }
  if (F) return {
    result: QY(B, A, -1, !1, Q, void 0, !0)
  };
  if (X < 0) return {
    result: QY(B, A, -1, !1, Q)
  };
  if ("force" in A) return {
    result: QY(B, A, A.force === void 0 ? -1 : A.force, !1, Q)
  };
  if (B.global.qaMode || B.user.qaMode) return {
    result: QY(B, A, -1, !1, Q)
  };
  if (A.status === "stopped") return {
    result: QY(B, A, -1, !1, Q)
  };
  let D = QY(B, A, X, !0, Q, K, V);
  if (B.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing) {
    let {
      changed: E,
      key: U,
      doc: q
    } = no8(B, J, pzA(W), {
      [Kb1(A.key, A.bucketVersion)]: D.key
    });
    if (E) B.user.stickyBucketAssignmentDocs = B.user.stickyBucketAssignmentDocs || {}, B.user.stickyBucketAssignmentDocs[U] = q, B.user.saveStickyBucketAssignmentDoc(q)
  }
  let H = a8B(B, A, D);
  if (H.length === 0 && B.global.saveDeferredTrack) B.global.saveDeferredTrack({
    experiment: A,
    result: D
  });
  let C = !H.length ? void 0 : H.length === 1 ? H[0] : Promise.all(H).then(() => {});
  return "changeId" in A && A.changeId && B.global.recordChangeId && B.global.recordChangeId(A.changeId), {
    result: D,
    trackingCall: C
  }
}
// @from(Start 5188156, End 5188393)
function uc(A, Q, B, G, Z, I, Y) {
  let J = {
    value: B,
    on: !!B,
    off: !B,
    source: G,
    ruleId: Z || ""
  };
  if (I) J.experiment = I;
  if (Y) J.experimentResult = Y;
  if (G !== "override") uo8(A, Q, J);
  return J
}
// @from(Start 5188395, End 5188488)
function s8B(A) {
  return {
    ...A.user.attributes,
    ...A.user.attributeOverrides
  }
}
// @from(Start 5188490, End 5188563)
function r8B(A, Q) {
  return gc(s8B(Q), A, Q.global.savedGroups || {})
}
// @from(Start 5188565, End 5188820)
function o8B(A, Q) {
  return A.some((B) => {
    let {
      hashValue: G
    } = Vt(Q, B.attribute);
    if (!G) return !0;
    let Z = czA(B.seed, G, B.hashVersion || 2);
    if (Z === null) return !0;
    return !B.ranges.some((I) => uiA(Z, I))
  })
}
// @from(Start 5188822, End 5189103)
function mo8(A, Q, B, G, Z, I, Y) {
  if (!Z && I === void 0) return !0;
  if (!Z && I === 0) return !1;
  let {
    hashValue: J
  } = Vt(A, B, G);
  if (!J) return !1;
  let W = czA(Q, J, Y || 1);
  if (W === null) return !1;
  return Z ? uiA(W, Z) : I !== void 0 ? W <= I : !0
}
// @from(Start 5189105, End 5189750)
function QY(A, Q, B, G, Z, I, Y) {
  let J = !0;
  if (B < 0 || B >= Q.variations.length) B = 0, J = !1;
  let {
    hashAttribute: W,
    hashValue: X
  } = Vt(A, Q.hashAttribute, A.user.saveStickyBucketAssignmentDoc && !Q.disableStickyBucketing ? Q.fallbackAttribute : void 0), V = Q.meta ? Q.meta[B] : {}, F = {
    key: V.key || "" + B,
    featureId: Z,
    inExperiment: J,
    hashUsed: G,
    variationId: B,
    value: Q.variations[B],
    hashAttribute: W,
    hashValue: X,
    stickyBucketUsed: !!Y
  };
  if (V.name) F.name = V.name;
  if (I !== void 0) F.bucket = I;
  if (V.passthrough) F.passthrough = V.passthrough;
  return F
}
// @from(Start 5189752, End 5189939)
function do8(A, Q) {
  let B = A.key,
    G = Q.global.overrides;
  if (G && G[B]) {
    if (A = Object.assign({}, A, G[B]), typeof A.url === "string") A.url = Bb1(A.url)
  }
  return A
}
// @from(Start 5189941, End 5190152)
function Vt(A, Q, B) {
  let G = Q || "id",
    Z = "",
    I = s8B(A);
  if (I[G]) Z = I[G];
  if (!Z && B) {
    if (I[B]) Z = I[B];
    if (Z) G = B
  }
  return {
    hashAttribute: G,
    hashValue: Z
  }
}
// @from(Start 5190154, End 5190353)
function co8(A, Q) {
  let B = Q.user.url;
  if (!B) return !1;
  let G = B.replace(/^https?:\/\//, "").replace(/^[^/]*\//, "/");
  if (A.test(B)) return !0;
  if (A.test(G)) return !0;
  return !1
}
// @from(Start 5190355, End 5190487)
function po8(A, Q) {
  let B = Q.global.groups || {};
  for (let G = 0; G < A.length; G++)
    if (B[A[G]]) return !0;
  return !1
}
// @from(Start 5190489, End 5191134)
function lo8(A) {
  let {
    ctx: Q,
    expKey: B,
    expBucketVersion: G,
    expHashAttribute: Z,
    expFallbackAttribute: I,
    expMinBucketVersion: Y,
    expMeta: J
  } = A;
  G = G || 0, Y = Y || 0, Z = Z || "id", J = J || [];
  let W = Kb1(B, G),
    X = io8(Q, Z, I);
  if (Y > 0)
    for (let K = 0; K <= Y; K++) {
      let D = Kb1(B, K);
      if (X[D] !== void 0) return {
        variation: -1,
        versionIsBlocked: !0
      }
    }
  let V = X[W];
  if (V === void 0) return {
    variation: -1
  };
  let F = J.findIndex((K) => K.key === V);
  if (F < 0) return {
    variation: -1
  };
  return {
    variation: F
  }
}
// @from(Start 5191136, End 5191192)
function Kb1(A, Q) {
  return Q = Q || 0, `${A}__${Q}`
}
// @from(Start 5191194, End 5191238)
function Db1(A, Q) {
  return `${A}||${Q}`
}
// @from(Start 5191240, End 5191749)
function io8(A, Q, B) {
  if (!A.user.stickyBucketAssignmentDocs) return {};
  let {
    hashAttribute: G,
    hashValue: Z
  } = Vt(A, Q), I = Db1(G, pzA(Z)), {
    hashAttribute: Y,
    hashValue: J
  } = Vt(A, B), W = J ? Db1(Y, pzA(J)) : null, X = {};
  if (W && A.user.stickyBucketAssignmentDocs[W]) Object.assign(X, A.user.stickyBucketAssignmentDocs[W].assignments || {});
  if (A.user.stickyBucketAssignmentDocs[I]) Object.assign(X, A.user.stickyBucketAssignmentDocs[I].assignments || {});
  return X
}
// @from(Start 5191751, End 5192164)
function no8(A, Q, B, G) {
  let Z = Db1(Q, B),
    I = A.user.stickyBucketAssignmentDocs && A.user.stickyBucketAssignmentDocs[Z] ? A.user.stickyBucketAssignmentDocs[Z].assignments || {} : {},
    Y = {
      ...I,
      ...G
    },
    J = JSON.stringify(I) !== JSON.stringify(Y);
  return {
    key: Z,
    doc: {
      attributeName: Q,
      attributeValue: B,
      assignments: Y
    },
    changed: J
  }
}
// @from(Start 5192166, End 5192718)
function ao8(A, Q) {
  let B = new Set,
    G = Q && Q.features ? Q.features : A.global.features || {},
    Z = Q && Q.experiments ? Q.experiments : A.global.experiments || [];
  return Object.keys(G).forEach((I) => {
    let Y = G[I];
    if (Y.rules) {
      for (let J of Y.rules)
        if (J.variations) {
          if (B.add(J.hashAttribute || "id"), J.fallbackAttribute) B.add(J.fallbackAttribute)
        }
    }
  }), Z.map((I) => {
    if (B.add(I.hashAttribute || "id"), I.fallbackAttribute) B.add(I.fallbackAttribute)
  }), Array.from(B)
}
// @from(Start 5192719, End 5192803)
async function t8B(A, Q, B) {
  let G = Hb1(A, B);
  return Q.getAllAssignments(G)
}
// @from(Start 5192805, End 5192950)
function Hb1(A, Q) {
  let B = {};
  return ao8(A, Q).forEach((Z) => {
    let {
      hashValue: I
    } = Vt(A, Z);
    B[Z] = pzA(I)
  }), B
}
// @from(Start 5192951, End 5193605)
async function e8B(A, Q, B) {
  if (A = {
      ...A
    }, A.encryptedFeatures) {
    try {
      A.features = JSON.parse(await Xt(A.encryptedFeatures, Q, B))
    } catch (G) {
      console.error(G)
    }
    delete A.encryptedFeatures
  }
  if (A.encryptedExperiments) {
    try {
      A.experiments = JSON.parse(await Xt(A.encryptedExperiments, Q, B))
    } catch (G) {
      console.error(G)
    }
    delete A.encryptedExperiments
  }
  if (A.encryptedSavedGroups) {
    try {
      A.savedGroups = JSON.parse(await Xt(A.encryptedSavedGroups, Q, B))
    } catch (G) {
      console.error(G)
    }
    delete A.encryptedSavedGroups
  }
  return A
}
// @from(Start 5193607, End 5193903)
function A6B(A) {
  let Q = A.apiHost || "https://cdn.growthbook.io";
  return {
    apiHost: Q.replace(/\/*$/, ""),
    streamingHost: (A.streamingHost || Q).replace(/\/*$/, ""),
    apiRequestHeaders: A.apiHostRequestHeaders,
    streamingHostRequestHeaders: A.streamingHostRequestHeaders
  }
}
// @from(Start 5193905, End 5193990)
function GnA(A, Q) {
  return Q.hashAttribute + Q.hashValue + A.key + Q.variationId
}
// @from(Start 5193995, End 5194020)
bo8 = "Feature Evaluated"
// @from(Start 5194024, End 5194049)
fo8 = "Experiment Viewed"
// @from(Start 5194055, End 5194090)
Q6B = L(() => {
  n8B();
  lzA()
})
// @from(Start 5194092, End 5212772)
class ZnA {
  constructor(A) {
    if (A = A || {}, this.version = so8, this._options = this.context = A, this._renderer = A.renderer || null, this._trackedExperiments = new Set, this._completedChangeIds = new Set, this._trackedFeatures = {}, this.debug = !!A.debug, this._subscriptions = new Set, this.ready = !1, this._assigned = new Map, this._activeAutoExperiments = new Map, this._triggeredExpKeys = new Set, this._initialized = !1, this._redirectedUrl = "", this._deferredTrackingCalls = new Map, this._autoExperimentsAllowed = !A.disableExperimentsOnLoad, this._destroyCallbacks = [], this.logs = [], this.log = this.log.bind(this), this._saveDeferredTrack = this._saveDeferredTrack.bind(this), this._fireSubscriptions = this._fireSubscriptions.bind(this), this._recordChangedId = this._recordChangedId.bind(this), A.remoteEval) {
      if (A.decryptionKey) throw Error("Encryption is not available for remoteEval");
      if (!A.clientKey) throw Error("Missing clientKey");
      let Q = !1;
      try {
        Q = !!new URL(A.apiHost || "").hostname.match(/growthbook\.io$/i)
      } catch (B) {}
      if (Q) throw Error("Cannot use remoteEval on GrowthBook Cloud")
    } else if (A.cacheKeyAttributes) throw Error("cacheKeyAttributes are only used for remoteEval");
    if (A.stickyBucketService) {
      let Q = A.stickyBucketService;
      this._saveStickyBucketAssignmentDoc = (B) => {
        return Q.saveAssignments(B)
      }
    }
    if (A.plugins)
      for (let Q of A.plugins) Q(this);
    if (A.features) this.ready = !0;
    if (l3A && A.enableDevMode) window._growthbook = this, document.dispatchEvent(new Event("gbloaded"));
    if (A.experiments) this.ready = !0, this._updateAllAutoExperiments();
    if (this._options.stickyBucketService && this._options.stickyBucketAssignmentDocs)
      for (let Q in this._options.stickyBucketAssignmentDocs) {
        let B = this._options.stickyBucketAssignmentDocs[Q];
        if (B) this._options.stickyBucketService.saveAssignments(B).catch(() => {})
      }
    if (this.ready) this.refreshStickyBuckets(this.getPayload())
  }
  async setPayload(A) {
    this._payload = A;
    let Q = await e8B(A, this._options.decryptionKey);
    if (this._decryptedPayload = Q, await this.refreshStickyBuckets(Q), Q.features) this._options.features = Q.features;
    if (Q.savedGroups) this._options.savedGroups = Q.savedGroups;
    if (Q.experiments) this._options.experiments = Q.experiments, this._updateAllAutoExperiments();
    this.ready = !0, this._render()
  }
  initSync(A) {
    this._initialized = !0;
    let Q = A.payload;
    if (Q.encryptedExperiments || Q.encryptedFeatures) throw Error("initSync does not support encrypted payloads");
    if (this._options.stickyBucketService && !this._options.stickyBucketAssignmentDocs) this._options.stickyBucketAssignmentDocs = this.generateStickyBucketAssignmentDocsSync(this._options.stickyBucketService, Q);
    if (this._payload = Q, this._decryptedPayload = Q, Q.features) this._options.features = Q.features;
    if (Q.experiments) this._options.experiments = Q.experiments, this._updateAllAutoExperiments();
    return this.ready = !0, liA(this, A), this
  }
  async init(A) {
    if (this._initialized = !0, A = A || {}, A.cacheSettings) R8B(A.cacheSettings);
    if (A.payload) return await this.setPayload(A.payload), liA(this, A), {
      success: !0,
      source: "init"
    };
    else {
      let {
        data: Q,
        ...B
      } = await this._refresh({
        ...A,
        allowStale: !0
      });
      return liA(this, A), await this.setPayload(Q || {}), B
    }
  }
  async loadFeatures(A) {
    A = A || {}, await this.init({
      skipCache: A.skipCache,
      timeout: A.timeout,
      streaming: (this._options.backgroundSync ?? !0) && (A.autoRefresh || this._options.subscribeToChanges)
    })
  }
  async refreshFeatures(A) {
    let Q = await this._refresh({
      ...A || {},
      allowStale: !1
    });
    if (Q.data) await this.setPayload(Q.data)
  }
  getApiInfo() {
    return [this.getApiHosts().apiHost, this.getClientKey()]
  }
  getApiHosts() {
    return A6B(this._options)
  }
  getClientKey() {
    return this._options.clientKey || ""
  }
  getPayload() {
    return this._payload || {
      features: this.getFeatures(),
      experiments: this.getExperiments()
    }
  }
  getDecryptedPayload() {
    return this._decryptedPayload || this.getPayload()
  }
  isRemoteEval() {
    return this._options.remoteEval || !1
  }
  getCacheKeyAttributes() {
    return this._options.cacheKeyAttributes
  }
  async _refresh(A) {
    let {
      timeout: Q,
      skipCache: B,
      allowStale: G,
      streaming: Z
    } = A;
    if (!this._options.clientKey) throw Error("Missing clientKey");
    return T8B({
      instance: this,
      timeout: Q,
      skipCache: B || this._options.disableCache,
      allowStale: G,
      backgroundSync: Z ?? this._options.backgroundSync ?? !0
    })
  }
  _render() {
    if (this._renderer) try {
      this._renderer()
    } catch (A) {
      console.error("Failed to render", A)
    }
  }
  setFeatures(A) {
    this._options.features = A, this.ready = !0, this._render()
  }
  async setEncryptedFeatures(A, Q, B) {
    let G = await Xt(A, Q || this._options.decryptionKey, B);
    this.setFeatures(JSON.parse(G))
  }
  setExperiments(A) {
    this._options.experiments = A, this.ready = !0, this._updateAllAutoExperiments()
  }
  async setEncryptedExperiments(A, Q, B) {
    let G = await Xt(A, Q || this._options.decryptionKey, B);
    this.setExperiments(JSON.parse(G))
  }
  async setAttributes(A) {
    if (this._options.attributes = A, this._options.stickyBucketService) await this.refreshStickyBuckets();
    if (this._options.remoteEval) {
      await this._refreshForRemoteEval();
      return
    }
    this._render(), this._updateAllAutoExperiments()
  }
  async updateAttributes(A) {
    return this.setAttributes({
      ...this._options.attributes,
      ...A
    })
  }
  async setAttributeOverrides(A) {
    if (this._options.attributeOverrides = A, this._options.stickyBucketService) await this.refreshStickyBuckets();
    if (this._options.remoteEval) {
      await this._refreshForRemoteEval();
      return
    }
    this._render(), this._updateAllAutoExperiments()
  }
  async setForcedVariations(A) {
    if (this._options.forcedVariations = A || {}, this._options.remoteEval) {
      await this._refreshForRemoteEval();
      return
    }
    this._render(), this._updateAllAutoExperiments()
  }
  setForcedFeatures(A) {
    this._options.forcedFeatureValues = A, this._render()
  }
  async setURL(A) {
    if (A === this._options.url) return;
    if (this._options.url = A, this._redirectedUrl = "", this._options.remoteEval) {
      await this._refreshForRemoteEval(), this._updateAllAutoExperiments(!0);
      return
    }
    this._updateAllAutoExperiments(!0)
  }
  getAttributes() {
    return {
      ...this._options.attributes,
      ...this._options.attributeOverrides
    }
  }
  getForcedVariations() {
    return this._options.forcedVariations || {}
  }
  getForcedFeatures() {
    return this._options.forcedFeatureValues || new Map
  }
  getStickyBucketAssignmentDocs() {
    return this._options.stickyBucketAssignmentDocs || {}
  }
  getUrl() {
    return this._options.url || ""
  }
  getFeatures() {
    return this._options.features || {}
  }
  getExperiments() {
    return this._options.experiments || []
  }
  getCompletedChangeIds() {
    return Array.from(this._completedChangeIds)
  }
  subscribe(A) {
    return this._subscriptions.add(A), () => {
      this._subscriptions.delete(A)
    }
  }
  async _refreshForRemoteEval() {
    if (!this._options.remoteEval) return;
    if (!this._initialized) return;
    let A = await this._refresh({
      allowStale: !1
    });
    if (A.data) await this.setPayload(A.data)
  }
  getAllResults() {
    return new Map(this._assigned)
  }
  onDestroy(A) {
    this._destroyCallbacks.push(A)
  }
  isDestroyed() {
    return !!this._destroyed
  }
  destroy() {
    if (this._destroyed = !0, this._destroyCallbacks.forEach((A) => {
        try {
          A()
        } catch (Q) {
          console.error(Q)
        }
      }), this._subscriptions.clear(), this._assigned.clear(), this._trackedExperiments.clear(), this._completedChangeIds.clear(), this._deferredTrackingCalls.clear(), this._trackedFeatures = {}, this._destroyCallbacks = [], this._payload = void 0, this._saveStickyBucketAssignmentDoc = void 0, P8B(this), this.logs = [], l3A && window._growthbook === this) delete window._growthbook;
    this._activeAutoExperiments.forEach((A) => {
      A.undo()
    }), this._activeAutoExperiments.clear(), this._triggeredExpKeys.clear()
  }
  setRenderer(A) {
    this._renderer = A
  }
  forceVariation(A, Q) {
    if (this._options.forcedVariations = this._options.forcedVariations || {}, this._options.forcedVariations[A] = Q, this._options.remoteEval) {
      this._refreshForRemoteEval();
      return
    }
    this._updateAllAutoExperiments(), this._render()
  }
  run(A) {
    let {
      result: Q
    } = BnA(A, null, this._getEvalContext());
    return this._fireSubscriptions(A, Q), Q
  }
  triggerExperiment(A) {
    if (this._triggeredExpKeys.add(A), !this._options.experiments) return null;
    return this._options.experiments.filter((B) => B.key === A).map((B) => {
      return this._runAutoExperiment(B)
    }).filter((B) => B !== null)
  }
  triggerAutoExperiments() {
    this._autoExperimentsAllowed = !0, this._updateAllAutoExperiments(!0)
  }
  _getEvalContext() {
    return {
      user: this._getUserContext(),
      global: this._getGlobalContext(),
      stack: {
        evaluatedFeatures: new Set
      }
    }
  }
  _getUserContext() {
    return {
      attributes: this._options.user ? {
        ...this._options.user,
        ...this._options.attributes
      } : this._options.attributes,
      enableDevMode: this._options.enableDevMode,
      blockedChangeIds: this._options.blockedChangeIds,
      stickyBucketAssignmentDocs: this._options.stickyBucketAssignmentDocs,
      url: this._getContextUrl(),
      forcedVariations: this._options.forcedVariations,
      forcedFeatureValues: this._options.forcedFeatureValues,
      attributeOverrides: this._options.attributeOverrides,
      saveStickyBucketAssignmentDoc: this._saveStickyBucketAssignmentDoc,
      trackingCallback: this._options.trackingCallback,
      onFeatureUsage: this._options.onFeatureUsage,
      devLogs: this.logs,
      trackedExperiments: this._trackedExperiments,
      trackedFeatureUsage: this._trackedFeatures
    }
  }
  _getGlobalContext() {
    return {
      features: this._options.features,
      experiments: this._options.experiments,
      log: this.log,
      enabled: this._options.enabled,
      qaMode: this._options.qaMode,
      savedGroups: this._options.savedGroups,
      groups: this._options.groups,
      overrides: this._options.overrides,
      onExperimentEval: this._subscriptions.size > 0 ? this._fireSubscriptions : void 0,
      recordChangeId: this._recordChangedId,
      saveDeferredTrack: this._saveDeferredTrack,
      eventLogger: this._options.eventLogger
    }
  }
  _runAutoExperiment(A, Q) {
    let B = this._activeAutoExperiments.get(A);
    if (A.manual && !this._triggeredExpKeys.has(A.key) && !B) return null;
    let G = this._isAutoExperimentBlockedByContext(A),
      Z, I;
    if (G) Z = QY(this._getEvalContext(), A, -1, !1, "");
    else({
      result: Z,
      trackingCall: I
    } = BnA(A, null, this._getEvalContext())), this._fireSubscriptions(A, Z);
    let Y = JSON.stringify(Z.value);
    if (!Q && Z.inExperiment && B && B.valueHash === Y) return Z;
    if (B) this._undoActiveAutoExperiment(A);
    if (Z.inExperiment) {
      let J = diA(A);
      if (J === "redirect" && Z.value.urlRedirect && A.urlPatterns) {
        let W = A.persistQueryString ? L8B(this._getContextUrl(), Z.value.urlRedirect) : Z.value.urlRedirect;
        if (miA(W, A.urlPatterns)) return this.log("Skipping redirect because original URL matches redirect URL", {
          id: A.key
        }), Z;
        this._redirectedUrl = W;
        let {
          navigate: X,
          delay: V
        } = this._getNavigateFunction();
        if (X)
          if (l3A) Promise.all([...I ? [ciA(I, this._options.maxNavigateDelay ?? 1000)] : [], new Promise((F) => window.setTimeout(F, this._options.navigateDelay ?? V))]).then(() => {
            try {
              X(W)
            } catch (F) {
              console.error(F)
            }
          });
          else try {
            X(W)
          } catch (F) {
            console.error(F)
          }
      } else if (J === "visual") {
        let W = this._options.applyDomChangesCallback ? this._options.applyDomChangesCallback(Z.value) : this._applyDOMChanges(Z.value);
        if (W) this._activeAutoExperiments.set(A, {
          undo: W,
          valueHash: Y
        })
      }
    }
    return Z
  }
  _undoActiveAutoExperiment(A) {
    let Q = this._activeAutoExperiments.get(A);
    if (Q) Q.undo(), this._activeAutoExperiments.delete(A)
  }
  _updateAllAutoExperiments(A) {
    if (!this._autoExperimentsAllowed) return;
    let Q = this._options.experiments || [],
      B = new Set(Q);
    this._activeAutoExperiments.forEach((G, Z) => {
      if (!B.has(Z)) G.undo(), this._activeAutoExperiments.delete(Z)
    });
    for (let G of Q) {
      let Z = this._runAutoExperiment(G, A);
      if (Z !== null && Z !== void 0 && Z.inExperiment && diA(G) === "redirect") break
    }
  }
  _fireSubscriptions(A, Q) {
    let B = A.key,
      G = this._assigned.get(B);
    if (!G || G.result.inExperiment !== Q.inExperiment || G.result.variationId !== Q.variationId) this._assigned.set(B, {
      experiment: A,
      result: Q
    }), this._subscriptions.forEach((Z) => {
      try {
        Z(A, Q)
      } catch (I) {
        console.error(I)
      }
    })
  }
  _recordChangedId(A) {
    this._completedChangeIds.add(A)
  }
  isOn(A) {
    return this.evalFeature(A).on
  }
  isOff(A) {
    return this.evalFeature(A).off
  }
  getFeatureValue(A, Q) {
    let B = this.evalFeature(A).value;
    return B === null ? Q : B
  }
  feature(A) {
    return this.evalFeature(A)
  }
  evalFeature(A) {
    return QnA(A, this._getEvalContext())
  }
  log(A, Q) {
    if (!this.debug) return;
    if (this._options.log) this._options.log(A, Q);
    else console.log(A, Q)
  }
  getDeferredTrackingCalls() {
    return Array.from(this._deferredTrackingCalls.values())
  }
  setDeferredTrackingCalls(A) {
    this._deferredTrackingCalls = new Map(A.filter((Q) => Q && Q.experiment && Q.result).map((Q) => {
      return [GnA(Q.experiment, Q.result), Q]
    }))
  }
  async fireDeferredTrackingCalls() {
    if (!this._options.trackingCallback) return;
    let A = [];
    this._deferredTrackingCalls.forEach((Q) => {
      if (!Q || !Q.experiment || !Q.result) console.error("Invalid deferred tracking call", {
        call: Q
      });
      else A.push(this._options.trackingCallback(Q.experiment, Q.result))
    }), this._deferredTrackingCalls.clear(), await Promise.all(A)
  }
  setTrackingCallback(A) {
    this._options.trackingCallback = A, this.fireDeferredTrackingCalls()
  }
  setEventLogger(A) {
    this._options.eventLogger = A
  }
  async logEvent(A, Q) {
    if (this._destroyed) {
      console.error("Cannot log event to destroyed GrowthBook instance");
      return
    }
    if (this._options.enableDevMode) this.logs.push({
      eventName: A,
      properties: Q,
      timestamp: Date.now().toString(),
      logType: "event"
    });
    if (this._options.eventLogger) try {
      await this._options.eventLogger(A, Q || {}, this._getUserContext())
    } catch (B) {
      console.error(B)
    } else console.error("No event logger configured")
  }
  _saveDeferredTrack(A) {
    this._deferredTrackingCalls.set(GnA(A.experiment, A.result), A)
  }
  _getContextUrl() {
    return this._options.url || (l3A ? window.location.href : "")
  }
  _isAutoExperimentBlockedByContext(A) {
    let Q = diA(A);
    if (Q === "visual") {
      if (this._options.disableVisualExperiments) return !0;
      if (this._options.disableJsInjection) {
        if (A.variations.some((B) => B.js)) return !0
      }
    } else if (Q === "redirect") {
      if (this._options.disableUrlRedirectExperiments) return !0;
      try {
        let B = new URL(this._getContextUrl());
        for (let G of A.variations) {
          if (!G || !G.urlRedirect) continue;
          let Z = new URL(G.urlRedirect);
          if (this._options.disableCrossOriginUrlRedirectExperiments) {
            if (Z.protocol !== B.protocol) return !0;
            if (Z.host !== B.host) return !0
          }
        }
      } catch (B) {
        return this.log("Error parsing current or redirect URL", {
          id: A.key,
          error: B
        }), !0
      }
    } else return !0;
    if (A.changeId && (this._options.blockedChangeIds || []).includes(A.changeId)) return !0;
    return !1
  }
  getRedirectUrl() {
    return this._redirectedUrl
  }
  _getNavigateFunction() {
    if (this._options.navigate) return {
      navigate: this._options.navigate,
      delay: 0
    };
    else if (l3A) return {
      navigate: (A) => {
        window.location.replace(A)
      },
      delay: 100
    };
    return {
      navigate: null,
      delay: 0
    }
  }
  _applyDOMChanges(A) {
    if (!l3A) return;
    let Q = [];
    if (A.css) {
      let B = document.createElement("style");
      B.innerHTML = A.css, document.head.appendChild(B), Q.push(() => B.remove())
    }
    if (A.js) {
      let B = document.createElement("script");
      if (B.innerHTML = A.js, this._options.jsInjectionNonce) B.nonce = this._options.jsInjectionNonce;
      document.head.appendChild(B), Q.push(() => B.remove())
    }
    if (A.domMutations) A.domMutations.forEach((B) => {
      Q.push(B6B.default.declarative(B).revert)
    });
    return () => {
      Q.forEach((B) => B())
    }
  }
  async refreshStickyBuckets(A) {
    if (this._options.stickyBucketService) {
      let Q = this._getEvalContext(),
        B = await t8B(Q, this._options.stickyBucketService, A);
      this._options.stickyBucketAssignmentDocs = B
    }
  }
  generateStickyBucketAssignmentDocsSync(A, Q) {
    if (!("getAllAssignmentsSync" in A)) {
      console.error("generating StickyBucketAssignmentDocs docs requires StickyBucketServiceSync");
      return
    }
    let B = this._getEvalContext(),
      G = Hb1(B, Q);
    return A.getAllAssignmentsSync(G)
  }
  inDevMode() {
    return !!this._options.enableDevMode
  }
}
// @from(Start 5212777, End 5212780)
B6B
// @from(Start 5212782, End 5212785)
l3A
// @from(Start 5212787, End 5212790)
so8
// @from(Start 5212796, End 5212927)
G6B = L(() => {
  lzA();
  k8B();
  Q6B();
  B6B = BA(p8B(), 1), l3A = typeof window < "u" && typeof document < "u", so8 = N8B()
})
// @from(Start 5212933, End 5212959)
Z6B = L(() => {
  G6B()
})
// @from(Start 5212962, End 5213206)
function fX() {
  return Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY) || !!process.env.DISABLE_TELEMETRY || !!process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
}
// @from(Start 5213211, End 5213235)
Ft = L(() => {
  hQ()
})
// @from(Start 5213241, End 5213428)
J6B = z((I6B) => {
  Object.defineProperty(I6B, "__esModule", {
    value: !0
  });
  I6B._globalThis = void 0;
  I6B._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Start 5213434, End 5214032)
W6B = z((Kt) => {
  var ro8 = Kt && Kt.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      Object.defineProperty(A, G, {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      })
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    oo8 = Kt && Kt.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) ro8(Q, A, B)
    };
  Object.defineProperty(Kt, "__esModule", {
    value: !0
  });
  oo8(J6B(), Kt)
})
// @from(Start 5214038, End 5214636)
X6B = z((Dt) => {
  var to8 = Dt && Dt.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      Object.defineProperty(A, G, {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      })
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    eo8 = Dt && Dt.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) to8(Q, A, B)
    };
  Object.defineProperty(Dt, "__esModule", {
    value: !0
  });
  eo8(W6B(), Dt)
})
// @from(Start 5214642, End 5214776)
Cb1 = z((V6B) => {
  Object.defineProperty(V6B, "__esModule", {
    value: !0
  });
  V6B.VERSION = void 0;
  V6B.VERSION = "1.9.0"
})
// @from(Start 5214782, End 5216013)
E6B = z((H6B) => {
  Object.defineProperty(H6B, "__esModule", {
    value: !0
  });
  H6B.isCompatible = H6B._makeCompatibilityCheck = void 0;
  var At8 = Cb1(),
    K6B = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;

  function D6B(A) {
    let Q = new Set([A]),
      B = new Set,
      G = A.match(K6B);
    if (!G) return () => !1;
    let Z = {
      major: +G[1],
      minor: +G[2],
      patch: +G[3],
      prerelease: G[4]
    };
    if (Z.prerelease != null) return function(W) {
      return W === A
    };

    function I(J) {
      return B.add(J), !1
    }

    function Y(J) {
      return Q.add(J), !0
    }
    return function(W) {
      if (Q.has(W)) return !0;
      if (B.has(W)) return !1;
      let X = W.match(K6B);
      if (!X) return I(W);
      let V = {
        major: +X[1],
        minor: +X[2],
        patch: +X[3],
        prerelease: X[4]
      };
      if (V.prerelease != null) return I(W);
      if (Z.major !== V.major) return I(W);
      if (Z.major === 0) {
        if (Z.minor === V.minor && Z.patch <= V.patch) return Y(W);
        return I(W)
      }
      if (Z.minor <= V.minor) return Y(W);
      return I(W)
    }
  }
  H6B._makeCompatibilityCheck = D6B;
  H6B.isCompatible = D6B(At8.VERSION)
})
// @from(Start 5216019, End 5217471)
Ht = z((z6B) => {
  Object.defineProperty(z6B, "__esModule", {
    value: !0
  });
  z6B.unregisterGlobal = z6B.getGlobal = z6B.registerGlobal = void 0;
  var Bt8 = X6B(),
    i3A = Cb1(),
    Gt8 = E6B(),
    Zt8 = i3A.VERSION.split(".")[0],
    rzA = Symbol.for(`opentelemetry.js.api.${Zt8}`),
    ozA = Bt8._globalThis;

  function It8(A, Q, B, G = !1) {
    var Z;
    let I = ozA[rzA] = (Z = ozA[rzA]) !== null && Z !== void 0 ? Z : {
      version: i3A.VERSION
    };
    if (!G && I[A]) {
      let Y = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${A}`);
      return B.error(Y.stack || Y.message), !1
    }
    if (I.version !== i3A.VERSION) {
      let Y = Error(`@opentelemetry/api: Registration of version v${I.version} for ${A} does not match previously registered API v${i3A.VERSION}`);
      return B.error(Y.stack || Y.message), !1
    }
    return I[A] = Q, B.debug(`@opentelemetry/api: Registered a global for ${A} v${i3A.VERSION}.`), !0
  }
  z6B.registerGlobal = It8;

  function Yt8(A) {
    var Q, B;
    let G = (Q = ozA[rzA]) === null || Q === void 0 ? void 0 : Q.version;
    if (!G || !(0, Gt8.isCompatible)(G)) return;
    return (B = ozA[rzA]) === null || B === void 0 ? void 0 : B[A]
  }
  z6B.getGlobal = Yt8;

  function Jt8(A, Q) {
    Q.debug(`@opentelemetry/api: Unregistering a global for ${A} v${i3A.VERSION}.`);
    let B = ozA[rzA];
    if (B) delete B[A]
  }
  z6B.unregisterGlobal = Jt8
})
// @from(Start 5217477, End 5218233)
N6B = z((w6B) => {
  Object.defineProperty(w6B, "__esModule", {
    value: !0
  });
  w6B.DiagComponentLogger = void 0;
  var Vt8 = Ht();
  class $6B {
    constructor(A) {
      this._namespace = A.namespace || "DiagComponentLogger"
    }
    debug(...A) {
      return tzA("debug", this._namespace, A)
    }
    error(...A) {
      return tzA("error", this._namespace, A)
    }
    info(...A) {
      return tzA("info", this._namespace, A)
    }
    warn(...A) {
      return tzA("warn", this._namespace, A)
    }
    verbose(...A) {
      return tzA("verbose", this._namespace, A)
    }
  }
  w6B.DiagComponentLogger = $6B;

  function tzA(A, Q, B) {
    let G = (0, Vt8.getGlobal)("diag");
    if (!G) return;
    return B.unshift(Q), G[A](...B)
  }
})
// @from(Start 5218239, End 5218625)
InA = z((L6B) => {
  Object.defineProperty(L6B, "__esModule", {
    value: !0
  });
  L6B.DiagLogLevel = void 0;
  var Ft8;
  (function(A) {
    A[A.NONE = 0] = "NONE", A[A.ERROR = 30] = "ERROR", A[A.WARN = 50] = "WARN", A[A.INFO = 60] = "INFO", A[A.DEBUG = 70] = "DEBUG", A[A.VERBOSE = 80] = "VERBOSE", A[A.ALL = 9999] = "ALL"
  })(Ft8 = L6B.DiagLogLevel || (L6B.DiagLogLevel = {}))
})
// @from(Start 5218631, End 5219379)
R6B = z((M6B) => {
  Object.defineProperty(M6B, "__esModule", {
    value: !0
  });
  M6B.createLogLevelDiagLogger = void 0;
  var mb = InA();

  function Kt8(A, Q) {
    if (A < mb.DiagLogLevel.NONE) A = mb.DiagLogLevel.NONE;
    else if (A > mb.DiagLogLevel.ALL) A = mb.DiagLogLevel.ALL;
    Q = Q || {};

    function B(G, Z) {
      let I = Q[G];
      if (typeof I === "function" && A >= Z) return I.bind(Q);
      return function() {}
    }
    return {
      error: B("error", mb.DiagLogLevel.ERROR),
      warn: B("warn", mb.DiagLogLevel.WARN),
      info: B("info", mb.DiagLogLevel.INFO),
      debug: B("debug", mb.DiagLogLevel.DEBUG),
      verbose: B("verbose", mb.DiagLogLevel.VERBOSE)
    }
  }
  M6B.createLogLevelDiagLogger = Kt8
})
// @from(Start 5219385, End 5221258)
Ct = z((P6B) => {
  Object.defineProperty(P6B, "__esModule", {
    value: !0
  });
  P6B.DiagAPI = void 0;
  var Dt8 = N6B(),
    Ht8 = R6B(),
    T6B = InA(),
    YnA = Ht(),
    Ct8 = "diag";
  class zb1 {
    constructor() {
      function A(G) {
        return function(...Z) {
          let I = (0, YnA.getGlobal)("diag");
          if (!I) return;
          return I[G](...Z)
        }
      }
      let Q = this,
        B = (G, Z = {
          logLevel: T6B.DiagLogLevel.INFO
        }) => {
          var I, Y, J;
          if (G === Q) {
            let V = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
            return Q.error((I = V.stack) !== null && I !== void 0 ? I : V.message), !1
          }
          if (typeof Z === "number") Z = {
            logLevel: Z
          };
          let W = (0, YnA.getGlobal)("diag"),
            X = (0, Ht8.createLogLevelDiagLogger)((Y = Z.logLevel) !== null && Y !== void 0 ? Y : T6B.DiagLogLevel.INFO, G);
          if (W && !Z.suppressOverrideMessage) {
            let V = (J = Error().stack) !== null && J !== void 0 ? J : "<failed to generate stacktrace>";
            W.warn(`Current logger will be overwritten from ${V}`), X.warn(`Current logger will overwrite one already registered from ${V}`)
          }
          return (0, YnA.registerGlobal)("diag", X, Q, !0)
        };
      Q.setLogger = B, Q.disable = () => {
        (0, YnA.unregisterGlobal)(Ct8, Q)
      }, Q.createComponentLogger = (G) => {
        return new Dt8.DiagComponentLogger(G)
      }, Q.verbose = A("verbose"), Q.debug = A("debug"), Q.info = A("info"), Q.warn = A("warn"), Q.error = A("error")
    }
    static instance() {
      if (!this._instance) this._instance = new zb1;
      return this._instance
    }
  }
  P6B.DiagAPI = zb1
})
// @from(Start 5221264, End 5222086)
k6B = z((S6B) => {
  Object.defineProperty(S6B, "__esModule", {
    value: !0
  });
  S6B.BaggageImpl = void 0;
  class n3A {
    constructor(A) {
      this._entries = A ? new Map(A) : new Map
    }
    getEntry(A) {
      let Q = this._entries.get(A);
      if (!Q) return;
      return Object.assign({}, Q)
    }
    getAllEntries() {
      return Array.from(this._entries.entries()).map(([A, Q]) => [A, Q])
    }
    setEntry(A, Q) {
      let B = new n3A(this._entries);
      return B._entries.set(A, Q), B
    }
    removeEntry(A) {
      let Q = new n3A(this._entries);
      return Q._entries.delete(A), Q
    }
    removeEntries(...A) {
      let Q = new n3A(this._entries);
      for (let B of A) Q._entries.delete(B);
      return Q
    }
    clear() {
      return new n3A
    }
  }
  S6B.BaggageImpl = n3A
})
// @from(Start 5222092, End 5222287)
v6B = z((y6B) => {
  Object.defineProperty(y6B, "__esModule", {
    value: !0
  });
  y6B.baggageEntryMetadataSymbol = void 0;
  y6B.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata")
})
// @from(Start 5222293, End 5222942)
Ub1 = z((b6B) => {
  Object.defineProperty(b6B, "__esModule", {
    value: !0
  });
  b6B.baggageEntryMetadataFromString = b6B.createBaggage = void 0;
  var Et8 = Ct(),
    zt8 = k6B(),
    Ut8 = v6B(),
    $t8 = Et8.DiagAPI.instance();

  function wt8(A = {}) {
    return new zt8.BaggageImpl(new Map(Object.entries(A)))
  }
  b6B.createBaggage = wt8;

  function qt8(A) {
    if (typeof A !== "string") $t8.error(`Cannot create baggage metadata from unknown type: ${typeof A}`), A = "";
    return {
      __TYPE__: Ut8.baggageEntryMetadataSymbol,
      toString() {
        return A
      }
    }
  }
  b6B.baggageEntryMetadataFromString = qt8
})
// @from(Start 5222948, End 5223605)
ezA = z((h6B) => {
  Object.defineProperty(h6B, "__esModule", {
    value: !0
  });
  h6B.ROOT_CONTEXT = h6B.createContextKey = void 0;

  function Lt8(A) {
    return Symbol.for(A)
  }
  h6B.createContextKey = Lt8;
  class JnA {
    constructor(A) {
      let Q = this;
      Q._currentContext = A ? new Map(A) : new Map, Q.getValue = (B) => Q._currentContext.get(B), Q.setValue = (B, G) => {
        let Z = new JnA(Q._currentContext);
        return Z._currentContext.set(B, G), Z
      }, Q.deleteValue = (B) => {
        let G = new JnA(Q._currentContext);
        return G._currentContext.delete(B), G
      }
    }
  }
  h6B.ROOT_CONTEXT = new JnA
})
// @from(Start 5223611, End 5224346)
c6B = z((m6B) => {
  Object.defineProperty(m6B, "__esModule", {
    value: !0
  });
  m6B.DiagConsoleLogger = void 0;
  var $b1 = [{
    n: "error",
    c: "error"
  }, {
    n: "warn",
    c: "warn"
  }, {
    n: "info",
    c: "info"
  }, {
    n: "debug",
    c: "debug"
  }, {
    n: "verbose",
    c: "trace"
  }];
  class u6B {
    constructor() {
      function A(Q) {
        return function(...B) {
          if (console) {
            let G = console[Q];
            if (typeof G !== "function") G = console.log;
            if (typeof G === "function") return G.apply(console, B)
          }
        }
      }
      for (let Q = 0; Q < $b1.length; Q++) this[$b1[Q].n] = A($b1[Q].c)
    }
  }
  m6B.DiagConsoleLogger = u6B
})
// @from(Start 5224352, End 5226778)
Pb1 = z((p6B) => {
  Object.defineProperty(p6B, "__esModule", {
    value: !0
  });
  p6B.createNoopMeter = p6B.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = p6B.NOOP_OBSERVABLE_GAUGE_METRIC = p6B.NOOP_OBSERVABLE_COUNTER_METRIC = p6B.NOOP_UP_DOWN_COUNTER_METRIC = p6B.NOOP_HISTOGRAM_METRIC = p6B.NOOP_GAUGE_METRIC = p6B.NOOP_COUNTER_METRIC = p6B.NOOP_METER = p6B.NoopObservableUpDownCounterMetric = p6B.NoopObservableGaugeMetric = p6B.NoopObservableCounterMetric = p6B.NoopObservableMetric = p6B.NoopHistogramMetric = p6B.NoopGaugeMetric = p6B.NoopUpDownCounterMetric = p6B.NoopCounterMetric = p6B.NoopMetric = p6B.NoopMeter = void 0;
  class wb1 {
    constructor() {}
    createGauge(A, Q) {
      return p6B.NOOP_GAUGE_METRIC
    }
    createHistogram(A, Q) {
      return p6B.NOOP_HISTOGRAM_METRIC
    }
    createCounter(A, Q) {
      return p6B.NOOP_COUNTER_METRIC
    }
    createUpDownCounter(A, Q) {
      return p6B.NOOP_UP_DOWN_COUNTER_METRIC
    }
    createObservableGauge(A, Q) {
      return p6B.NOOP_OBSERVABLE_GAUGE_METRIC
    }
    createObservableCounter(A, Q) {
      return p6B.NOOP_OBSERVABLE_COUNTER_METRIC
    }
    createObservableUpDownCounter(A, Q) {
      return p6B.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC
    }
    addBatchObservableCallback(A, Q) {}
    removeBatchObservableCallback(A) {}
  }
  p6B.NoopMeter = wb1;
  class a3A {}
  p6B.NoopMetric = a3A;
  class qb1 extends a3A {
    add(A, Q) {}
  }
  p6B.NoopCounterMetric = qb1;
  class Nb1 extends a3A {
    add(A, Q) {}
  }
  p6B.NoopUpDownCounterMetric = Nb1;
  class Lb1 extends a3A {
    record(A, Q) {}
  }
  p6B.NoopGaugeMetric = Lb1;
  class Mb1 extends a3A {
    record(A, Q) {}
  }
  p6B.NoopHistogramMetric = Mb1;
  class AUA {
    addCallback(A) {}
    removeCallback(A) {}
  }
  p6B.NoopObservableMetric = AUA;
  class Ob1 extends AUA {}
  p6B.NoopObservableCounterMetric = Ob1;
  class Rb1 extends AUA {}
  p6B.NoopObservableGaugeMetric = Rb1;
  class Tb1 extends AUA {}
  p6B.NoopObservableUpDownCounterMetric = Tb1;
  p6B.NOOP_METER = new wb1;
  p6B.NOOP_COUNTER_METRIC = new qb1;
  p6B.NOOP_GAUGE_METRIC = new Lb1;
  p6B.NOOP_HISTOGRAM_METRIC = new Mb1;
  p6B.NOOP_UP_DOWN_COUNTER_METRIC = new Nb1;
  p6B.NOOP_OBSERVABLE_COUNTER_METRIC = new Ob1;
  p6B.NOOP_OBSERVABLE_GAUGE_METRIC = new Rb1;
  p6B.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new Tb1;

  function Ot8() {
    return p6B.NOOP_METER
  }
  p6B.createNoopMeter = Ot8
})
// @from(Start 5226784, End 5227027)
Q5B = z((A5B) => {
  Object.defineProperty(A5B, "__esModule", {
    value: !0
  });
  A5B.ValueType = void 0;
  var bt8;
  (function(A) {
    A[A.INT = 0] = "INT", A[A.DOUBLE = 1] = "DOUBLE"
  })(bt8 = A5B.ValueType || (A5B.ValueType = {}))
})
// @from(Start 5227033, End 5227473)
Sb1 = z((B5B) => {
  Object.defineProperty(B5B, "__esModule", {
    value: !0
  });
  B5B.defaultTextMapSetter = B5B.defaultTextMapGetter = void 0;
  B5B.defaultTextMapGetter = {
    get(A, Q) {
      if (A == null) return;
      return A[Q]
    },
    keys(A) {
      if (A == null) return [];
      return Object.keys(A)
    }
  };
  B5B.defaultTextMapSetter = {
    set(A, Q, B) {
      if (A == null) return;
      A[Q] = B
    }
  }
})
// @from(Start 5227479, End 5227897)
J5B = z((I5B) => {
  Object.defineProperty(I5B, "__esModule", {
    value: !0
  });
  I5B.NoopContextManager = void 0;
  var ht8 = ezA();
  class Z5B {
    active() {
      return ht8.ROOT_CONTEXT
    }
    with(A, Q, B, ...G) {
      return Q.call(B, ...G)
    }
    bind(A, Q) {
      return Q
    }
    enable() {
      return this
    }
    disable() {
      return this
    }
  }
  I5B.NoopContextManager = Z5B
})
// @from(Start 5227903, End 5228840)
QUA = z((X5B) => {
  Object.defineProperty(X5B, "__esModule", {
    value: !0
  });
  X5B.ContextAPI = void 0;
  var gt8 = J5B(),
    _b1 = Ht(),
    W5B = Ct(),
    kb1 = "context",
    ut8 = new gt8.NoopContextManager;
  class yb1 {
    constructor() {}
    static getInstance() {
      if (!this._instance) this._instance = new yb1;
      return this._instance
    }
    setGlobalContextManager(A) {
      return (0, _b1.registerGlobal)(kb1, A, W5B.DiagAPI.instance())
    }
    active() {
      return this._getContextManager().active()
    }
    with(A, Q, B, ...G) {
      return this._getContextManager().with(A, Q, B, ...G)
    }
    bind(A, Q) {
      return this._getContextManager().bind(A, Q)
    }
    _getContextManager() {
      return (0, _b1.getGlobal)(kb1) || ut8
    }
    disable() {
      this._getContextManager().disable(), (0, _b1.unregisterGlobal)(kb1, W5B.DiagAPI.instance())
    }
  }
  X5B.ContextAPI = yb1
})
// @from(Start 5228846, End 5229096)
vb1 = z((F5B) => {
  Object.defineProperty(F5B, "__esModule", {
    value: !0
  });
  F5B.TraceFlags = void 0;
  var mt8;
  (function(A) {
    A[A.NONE = 0] = "NONE", A[A.SAMPLED = 1] = "SAMPLED"
  })(mt8 = F5B.TraceFlags || (F5B.TraceFlags = {}))
})
// @from(Start 5229102, End 5229527)
WnA = z((K5B) => {
  Object.defineProperty(K5B, "__esModule", {
    value: !0
  });
  K5B.INVALID_SPAN_CONTEXT = K5B.INVALID_TRACEID = K5B.INVALID_SPANID = void 0;
  var dt8 = vb1();
  K5B.INVALID_SPANID = "0000000000000000";
  K5B.INVALID_TRACEID = "00000000000000000000000000000000";
  K5B.INVALID_SPAN_CONTEXT = {
    traceId: K5B.INVALID_TRACEID,
    spanId: K5B.INVALID_SPANID,
    traceFlags: dt8.TraceFlags.NONE
  }
})
// @from(Start 5229533, End 5230253)
XnA = z((z5B) => {
  Object.defineProperty(z5B, "__esModule", {
    value: !0
  });
  z5B.NonRecordingSpan = void 0;
  var ct8 = WnA();
  class E5B {
    constructor(A = ct8.INVALID_SPAN_CONTEXT) {
      this._spanContext = A
    }
    spanContext() {
      return this._spanContext
    }
    setAttribute(A, Q) {
      return this
    }
    setAttributes(A) {
      return this
    }
    addEvent(A, Q) {
      return this
    }
    addLink(A) {
      return this
    }
    addLinks(A) {
      return this
    }
    setStatus(A) {
      return this
    }
    updateName(A) {
      return this
    }
    end(A) {}
    isRecording() {
      return !1
    }
    recordException(A, Q) {}
  }
  z5B.NonRecordingSpan = E5B
})
// @from(Start 5230259, End 5231174)
hb1 = z((w5B) => {
  Object.defineProperty(w5B, "__esModule", {
    value: !0
  });
  w5B.getSpanContext = w5B.setSpanContext = w5B.deleteSpan = w5B.setSpan = w5B.getActiveSpan = w5B.getSpan = void 0;
  var pt8 = ezA(),
    lt8 = XnA(),
    it8 = QUA(),
    bb1 = (0, pt8.createContextKey)("OpenTelemetry Context Key SPAN");

  function fb1(A) {
    return A.getValue(bb1) || void 0
  }
  w5B.getSpan = fb1;

  function nt8() {
    return fb1(it8.ContextAPI.getInstance().active())
  }
  w5B.getActiveSpan = nt8;

  function $5B(A, Q) {
    return A.setValue(bb1, Q)
  }
  w5B.setSpan = $5B;

  function at8(A) {
    return A.deleteValue(bb1)
  }
  w5B.deleteSpan = at8;

  function st8(A, Q) {
    return $5B(A, new lt8.NonRecordingSpan(Q))
  }
  w5B.setSpanContext = st8;

  function rt8(A) {
    var Q;
    return (Q = fb1(A)) === null || Q === void 0 ? void 0 : Q.spanContext()
  }
  w5B.getSpanContext = rt8
})
// @from(Start 5231180, End 5231860)
VnA = z((O5B) => {
  Object.defineProperty(O5B, "__esModule", {
    value: !0
  });
  O5B.wrapSpanContext = O5B.isSpanContextValid = O5B.isValidSpanId = O5B.isValidTraceId = void 0;
  var N5B = WnA(),
    Be8 = XnA(),
    Ge8 = /^([0-9a-f]{32})$/i,
    Ze8 = /^[0-9a-f]{16}$/i;

  function L5B(A) {
    return Ge8.test(A) && A !== N5B.INVALID_TRACEID
  }
  O5B.isValidTraceId = L5B;

  function M5B(A) {
    return Ze8.test(A) && A !== N5B.INVALID_SPANID
  }
  O5B.isValidSpanId = M5B;

  function Ie8(A) {
    return L5B(A.traceId) && M5B(A.spanId)
  }
  O5B.isSpanContextValid = Ie8;

  function Ye8(A) {
    return new Be8.NonRecordingSpan(A)
  }
  O5B.wrapSpanContext = Ye8
})
// @from(Start 5231866, End 5233015)
mb1 = z((j5B) => {
  Object.defineProperty(j5B, "__esModule", {
    value: !0
  });
  j5B.NoopTracer = void 0;
  var Ve8 = QUA(),
    T5B = hb1(),
    gb1 = XnA(),
    Fe8 = VnA(),
    ub1 = Ve8.ContextAPI.getInstance();
  class P5B {
    startSpan(A, Q, B = ub1.active()) {
      if (Boolean(Q === null || Q === void 0 ? void 0 : Q.root)) return new gb1.NonRecordingSpan;
      let Z = B && (0, T5B.getSpanContext)(B);
      if (Ke8(Z) && (0, Fe8.isSpanContextValid)(Z)) return new gb1.NonRecordingSpan(Z);
      else return new gb1.NonRecordingSpan
    }
    startActiveSpan(A, Q, B, G) {
      let Z, I, Y;
      if (arguments.length < 2) return;
      else if (arguments.length === 2) Y = Q;
      else if (arguments.length === 3) Z = Q, Y = B;
      else Z = Q, I = B, Y = G;
      let J = I !== null && I !== void 0 ? I : ub1.active(),
        W = this.startSpan(A, Z, J),
        X = (0, T5B.setSpan)(J, W);
      return ub1.with(X, Y, void 0, W)
    }
  }
  j5B.NoopTracer = P5B;

  function Ke8(A) {
    return typeof A === "object" && typeof A.spanId === "string" && typeof A.traceId === "string" && typeof A.traceFlags === "number"
  }
})
// @from(Start 5233021, End 5233787)
db1 = z((k5B) => {
  Object.defineProperty(k5B, "__esModule", {
    value: !0
  });
  k5B.ProxyTracer = void 0;
  var De8 = mb1(),
    He8 = new De8.NoopTracer;
  class _5B {
    constructor(A, Q, B, G) {
      this._provider = A, this.name = Q, this.version = B, this.options = G
    }
    startSpan(A, Q, B) {
      return this._getTracer().startSpan(A, Q, B)
    }
    startActiveSpan(A, Q, B, G) {
      let Z = this._getTracer();
      return Reflect.apply(Z.startActiveSpan, Z, arguments)
    }
    _getTracer() {
      if (this._delegate) return this._delegate;
      let A = this._provider.getDelegateTracer(this.name, this.version, this.options);
      if (!A) return He8;
      return this._delegate = A, this._delegate
    }
  }
  k5B.ProxyTracer = _5B
})
// @from(Start 5233793, End 5234045)
f5B = z((v5B) => {
  Object.defineProperty(v5B, "__esModule", {
    value: !0
  });
  v5B.NoopTracerProvider = void 0;
  var Ce8 = mb1();
  class x5B {
    getTracer(A, Q, B) {
      return new Ce8.NoopTracer
    }
  }
  v5B.NoopTracerProvider = x5B
})
// @from(Start 5234051, End 5234761)
cb1 = z((g5B) => {
  Object.defineProperty(g5B, "__esModule", {
    value: !0
  });
  g5B.ProxyTracerProvider = void 0;
  var Ee8 = db1(),
    ze8 = f5B(),
    Ue8 = new ze8.NoopTracerProvider;
  class h5B {
    getTracer(A, Q, B) {
      var G;
      return (G = this.getDelegateTracer(A, Q, B)) !== null && G !== void 0 ? G : new Ee8.ProxyTracer(this, A, Q, B)
    }
    getDelegate() {
      var A;
      return (A = this._delegate) !== null && A !== void 0 ? A : Ue8
    }
    setDelegate(A) {
      this._delegate = A
    }
    getDelegateTracer(A, Q, B) {
      var G;
      return (G = this._delegate) === null || G === void 0 ? void 0 : G.getTracer(A, Q, B)
    }
  }
  g5B.ProxyTracerProvider = h5B
})
// @from(Start 5234767, End 5235097)
d5B = z((m5B) => {
  Object.defineProperty(m5B, "__esModule", {
    value: !0
  });
  m5B.SamplingDecision = void 0;
  var $e8;
  (function(A) {
    A[A.NOT_RECORD = 0] = "NOT_RECORD", A[A.RECORD = 1] = "RECORD", A[A.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
  })($e8 = m5B.SamplingDecision || (m5B.SamplingDecision = {}))
})
// @from(Start 5235103, End 5235445)
p5B = z((c5B) => {
  Object.defineProperty(c5B, "__esModule", {
    value: !0
  });
  c5B.SpanKind = void 0;
  var we8;
  (function(A) {
    A[A.INTERNAL = 0] = "INTERNAL", A[A.SERVER = 1] = "SERVER", A[A.CLIENT = 2] = "CLIENT", A[A.PRODUCER = 3] = "PRODUCER", A[A.CONSUMER = 4] = "CONSUMER"
  })(we8 = c5B.SpanKind || (c5B.SpanKind = {}))
})
// @from(Start 5235451, End 5235731)
i5B = z((l5B) => {
  Object.defineProperty(l5B, "__esModule", {
    value: !0
  });
  l5B.SpanStatusCode = void 0;
  var qe8;
  (function(A) {
    A[A.UNSET = 0] = "UNSET", A[A.OK = 1] = "OK", A[A.ERROR = 2] = "ERROR"
  })(qe8 = l5B.SpanStatusCode || (l5B.SpanStatusCode = {}))
})
// @from(Start 5235737, End 5236242)
s5B = z((n5B) => {
  Object.defineProperty(n5B, "__esModule", {
    value: !0
  });
  n5B.validateValue = n5B.validateKey = void 0;
  var nb1 = "[_0-9a-z-*/]",
    Ne8 = `[a-z]${nb1}{0,255}`,
    Le8 = `[a-z0-9]${nb1}{0,240}@[a-z]${nb1}{0,13}`,
    Me8 = new RegExp(`^(?:${Ne8}|${Le8})$`),
    Oe8 = /^[ -~]{0,255}[!-~]$/,
    Re8 = /,|=/;

  function Te8(A) {
    return Me8.test(A)
  }
  n5B.validateKey = Te8;

  function Pe8(A) {
    return Oe8.test(A) && !Re8.test(A)
  }
  n5B.validateValue = Pe8
})
// @from(Start 5236248, End 5237771)
B3B = z((A3B) => {
  Object.defineProperty(A3B, "__esModule", {
    value: !0
  });
  A3B.TraceStateImpl = void 0;
  var r5B = s5B(),
    o5B = 32,
    Se8 = 512,
    t5B = ",",
    e5B = "=";
  class ab1 {
    constructor(A) {
      if (this._internalState = new Map, A) this._parse(A)
    }
    set(A, Q) {
      let B = this._clone();
      if (B._internalState.has(A)) B._internalState.delete(A);
      return B._internalState.set(A, Q), B
    }
    unset(A) {
      let Q = this._clone();
      return Q._internalState.delete(A), Q
    }
    get(A) {
      return this._internalState.get(A)
    }
    serialize() {
      return this._keys().reduce((A, Q) => {
        return A.push(Q + e5B + this.get(Q)), A
      }, []).join(t5B)
    }
    _parse(A) {
      if (A.length > Se8) return;
      if (this._internalState = A.split(t5B).reverse().reduce((Q, B) => {
          let G = B.trim(),
            Z = G.indexOf(e5B);
          if (Z !== -1) {
            let I = G.slice(0, Z),
              Y = G.slice(Z + 1, B.length);
            if ((0, r5B.validateKey)(I) && (0, r5B.validateValue)(Y)) Q.set(I, Y)
          }
          return Q
        }, new Map), this._internalState.size > o5B) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, o5B))
    }
    _keys() {
      return Array.from(this._internalState.keys()).reverse()
    }
    _clone() {
      let A = new ab1;
      return A._internalState = new Map(this._internalState), A
    }
  }
  A3B.TraceStateImpl = ab1
})
// @from(Start 5237777, End 5238006)
I3B = z((G3B) => {
  Object.defineProperty(G3B, "__esModule", {
    value: !0
  });
  G3B.createTraceState = void 0;
  var _e8 = B3B();

  function ke8(A) {
    return new _e8.TraceStateImpl(A)
  }
  G3B.createTraceState = ke8
})
// @from(Start 5238012, End 5238186)
W3B = z((Y3B) => {
  Object.defineProperty(Y3B, "__esModule", {
    value: !0
  });
  Y3B.context = void 0;
  var ye8 = QUA();
  Y3B.context = ye8.ContextAPI.getInstance()
})
// @from(Start 5238192, End 5238353)
F3B = z((X3B) => {
  Object.defineProperty(X3B, "__esModule", {
    value: !0
  });
  X3B.diag = void 0;
  var xe8 = Ct();
  X3B.diag = xe8.DiagAPI.instance()
})
// @from(Start 5238359, End 5238667)
H3B = z((K3B) => {
  Object.defineProperty(K3B, "__esModule", {
    value: !0
  });
  K3B.NOOP_METER_PROVIDER = K3B.NoopMeterProvider = void 0;
  var ve8 = Pb1();
  class sb1 {
    getMeter(A, Q, B) {
      return ve8.NOOP_METER
    }
  }
  K3B.NoopMeterProvider = sb1;
  K3B.NOOP_METER_PROVIDER = new sb1
})
// @from(Start 5238673, End 5239404)
U3B = z((E3B) => {
  Object.defineProperty(E3B, "__esModule", {
    value: !0
  });
  E3B.MetricsAPI = void 0;
  var fe8 = H3B(),
    rb1 = Ht(),
    C3B = Ct(),
    ob1 = "metrics";
  class tb1 {
    constructor() {}
    static getInstance() {
      if (!this._instance) this._instance = new tb1;
      return this._instance
    }
    setGlobalMeterProvider(A) {
      return (0, rb1.registerGlobal)(ob1, A, C3B.DiagAPI.instance())
    }
    getMeterProvider() {
      return (0, rb1.getGlobal)(ob1) || fe8.NOOP_METER_PROVIDER
    }
    getMeter(A, Q, B) {
      return this.getMeterProvider().getMeter(A, Q, B)
    }
    disable() {
      (0, rb1.unregisterGlobal)(ob1, C3B.DiagAPI.instance())
    }
  }
  E3B.MetricsAPI = tb1
})
// @from(Start 5239410, End 5239584)
q3B = z(($3B) => {
  Object.defineProperty($3B, "__esModule", {
    value: !0
  });
  $3B.metrics = void 0;
  var he8 = U3B();
  $3B.metrics = he8.MetricsAPI.getInstance()
})
// @from(Start 5239590, End 5239864)
O3B = z((L3B) => {
  Object.defineProperty(L3B, "__esModule", {
    value: !0
  });
  L3B.NoopTextMapPropagator = void 0;
  class N3B {
    inject(A, Q) {}
    extract(A, Q) {
      return A
    }
    fields() {
      return []
    }
  }
  L3B.NoopTextMapPropagator = N3B
})
// @from(Start 5239870, End 5240502)
j3B = z((T3B) => {
  Object.defineProperty(T3B, "__esModule", {
    value: !0
  });
  T3B.deleteBaggage = T3B.setBaggage = T3B.getActiveBaggage = T3B.getBaggage = void 0;
  var ge8 = QUA(),
    ue8 = ezA(),
    eb1 = (0, ue8.createContextKey)("OpenTelemetry Baggage Key");

  function R3B(A) {
    return A.getValue(eb1) || void 0
  }
  T3B.getBaggage = R3B;

  function me8() {
    return R3B(ge8.ContextAPI.getInstance().active())
  }
  T3B.getActiveBaggage = me8;

  function de8(A, Q) {
    return A.setValue(eb1, Q)
  }
  T3B.setBaggage = de8;

  function ce8(A) {
    return A.deleteValue(eb1)
  }
  T3B.deleteBaggage = ce8
})
// @from(Start 5240508, End 5241740)
x3B = z((k3B) => {
  Object.defineProperty(k3B, "__esModule", {
    value: !0
  });
  k3B.PropagationAPI = void 0;
  var Af1 = Ht(),
    ne8 = O3B(),
    S3B = Sb1(),
    FnA = j3B(),
    ae8 = Ub1(),
    _3B = Ct(),
    Qf1 = "propagation",
    se8 = new ne8.NoopTextMapPropagator;
  class Bf1 {
    constructor() {
      this.createBaggage = ae8.createBaggage, this.getBaggage = FnA.getBaggage, this.getActiveBaggage = FnA.getActiveBaggage, this.setBaggage = FnA.setBaggage, this.deleteBaggage = FnA.deleteBaggage
    }
    static getInstance() {
      if (!this._instance) this._instance = new Bf1;
      return this._instance
    }
    setGlobalPropagator(A) {
      return (0, Af1.registerGlobal)(Qf1, A, _3B.DiagAPI.instance())
    }
    inject(A, Q, B = S3B.defaultTextMapSetter) {
      return this._getGlobalPropagator().inject(A, Q, B)
    }
    extract(A, Q, B = S3B.defaultTextMapGetter) {
      return this._getGlobalPropagator().extract(A, Q, B)
    }
    fields() {
      return this._getGlobalPropagator().fields()
    }
    disable() {
      (0, Af1.unregisterGlobal)(Qf1, _3B.DiagAPI.instance())
    }
    _getGlobalPropagator() {
      return (0, Af1.getGlobal)(Qf1) || se8
    }
  }
  k3B.PropagationAPI = Bf1
})
// @from(Start 5241746, End 5241932)
f3B = z((v3B) => {
  Object.defineProperty(v3B, "__esModule", {
    value: !0
  });
  v3B.propagation = void 0;
  var re8 = x3B();
  v3B.propagation = re8.PropagationAPI.getInstance()
})
// @from(Start 5241938, End 5243226)
c3B = z((m3B) => {
  Object.defineProperty(m3B, "__esModule", {
    value: !0
  });
  m3B.TraceAPI = void 0;
  var Gf1 = Ht(),
    h3B = cb1(),
    g3B = VnA(),
    s3A = hb1(),
    u3B = Ct(),
    Zf1 = "trace";
  class If1 {
    constructor() {
      this._proxyTracerProvider = new h3B.ProxyTracerProvider, this.wrapSpanContext = g3B.wrapSpanContext, this.isSpanContextValid = g3B.isSpanContextValid, this.deleteSpan = s3A.deleteSpan, this.getSpan = s3A.getSpan, this.getActiveSpan = s3A.getActiveSpan, this.getSpanContext = s3A.getSpanContext, this.setSpan = s3A.setSpan, this.setSpanContext = s3A.setSpanContext
    }
    static getInstance() {
      if (!this._instance) this._instance = new If1;
      return this._instance
    }
    setGlobalTracerProvider(A) {
      let Q = (0, Gf1.registerGlobal)(Zf1, this._proxyTracerProvider, u3B.DiagAPI.instance());
      if (Q) this._proxyTracerProvider.setDelegate(A);
      return Q
    }
    getTracerProvider() {
      return (0, Gf1.getGlobal)(Zf1) || this._proxyTracerProvider
    }
    getTracer(A, Q) {
      return this.getTracerProvider().getTracer(A, Q)
    }
    disable() {
      (0, Gf1.unregisterGlobal)(Zf1, u3B.DiagAPI.instance()), this._proxyTracerProvider = new h3B.ProxyTracerProvider
    }
  }
  m3B.TraceAPI = If1
})
// @from(Start 5243232, End 5243400)
i3B = z((p3B) => {
  Object.defineProperty(p3B, "__esModule", {
    value: !0
  });
  p3B.trace = void 0;
  var oe8 = c3B();
  p3B.trace = oe8.TraceAPI.getInstance()
})
// @from(Start 5243406, End 5248189)
K9 = z((XG) => {
  Object.defineProperty(XG, "__esModule", {
    value: !0
  });
  XG.trace = XG.propagation = XG.metrics = XG.diag = XG.context = XG.INVALID_SPAN_CONTEXT = XG.INVALID_TRACEID = XG.INVALID_SPANID = XG.isValidSpanId = XG.isValidTraceId = XG.isSpanContextValid = XG.createTraceState = XG.TraceFlags = XG.SpanStatusCode = XG.SpanKind = XG.SamplingDecision = XG.ProxyTracerProvider = XG.ProxyTracer = XG.defaultTextMapSetter = XG.defaultTextMapGetter = XG.ValueType = XG.createNoopMeter = XG.DiagLogLevel = XG.DiagConsoleLogger = XG.ROOT_CONTEXT = XG.createContextKey = XG.baggageEntryMetadataFromString = void 0;
  var te8 = Ub1();
  Object.defineProperty(XG, "baggageEntryMetadataFromString", {
    enumerable: !0,
    get: function() {
      return te8.baggageEntryMetadataFromString
    }
  });
  var n3B = ezA();
  Object.defineProperty(XG, "createContextKey", {
    enumerable: !0,
    get: function() {
      return n3B.createContextKey
    }
  });
  Object.defineProperty(XG, "ROOT_CONTEXT", {
    enumerable: !0,
    get: function() {
      return n3B.ROOT_CONTEXT
    }
  });
  var ee8 = c6B();
  Object.defineProperty(XG, "DiagConsoleLogger", {
    enumerable: !0,
    get: function() {
      return ee8.DiagConsoleLogger
    }
  });
  var AA6 = InA();
  Object.defineProperty(XG, "DiagLogLevel", {
    enumerable: !0,
    get: function() {
      return AA6.DiagLogLevel
    }
  });
  var QA6 = Pb1();
  Object.defineProperty(XG, "createNoopMeter", {
    enumerable: !0,
    get: function() {
      return QA6.createNoopMeter
    }
  });
  var BA6 = Q5B();
  Object.defineProperty(XG, "ValueType", {
    enumerable: !0,
    get: function() {
      return BA6.ValueType
    }
  });
  var a3B = Sb1();
  Object.defineProperty(XG, "defaultTextMapGetter", {
    enumerable: !0,
    get: function() {
      return a3B.defaultTextMapGetter
    }
  });
  Object.defineProperty(XG, "defaultTextMapSetter", {
    enumerable: !0,
    get: function() {
      return a3B.defaultTextMapSetter
    }
  });
  var GA6 = db1();
  Object.defineProperty(XG, "ProxyTracer", {
    enumerable: !0,
    get: function() {
      return GA6.ProxyTracer
    }
  });
  var ZA6 = cb1();
  Object.defineProperty(XG, "ProxyTracerProvider", {
    enumerable: !0,
    get: function() {
      return ZA6.ProxyTracerProvider
    }
  });
  var IA6 = d5B();
  Object.defineProperty(XG, "SamplingDecision", {
    enumerable: !0,
    get: function() {
      return IA6.SamplingDecision
    }
  });
  var YA6 = p5B();
  Object.defineProperty(XG, "SpanKind", {
    enumerable: !0,
    get: function() {
      return YA6.SpanKind
    }
  });
  var JA6 = i5B();
  Object.defineProperty(XG, "SpanStatusCode", {
    enumerable: !0,
    get: function() {
      return JA6.SpanStatusCode
    }
  });
  var WA6 = vb1();
  Object.defineProperty(XG, "TraceFlags", {
    enumerable: !0,
    get: function() {
      return WA6.TraceFlags
    }
  });
  var XA6 = I3B();
  Object.defineProperty(XG, "createTraceState", {
    enumerable: !0,
    get: function() {
      return XA6.createTraceState
    }
  });
  var Yf1 = VnA();
  Object.defineProperty(XG, "isSpanContextValid", {
    enumerable: !0,
    get: function() {
      return Yf1.isSpanContextValid
    }
  });
  Object.defineProperty(XG, "isValidTraceId", {
    enumerable: !0,
    get: function() {
      return Yf1.isValidTraceId
    }
  });
  Object.defineProperty(XG, "isValidSpanId", {
    enumerable: !0,
    get: function() {
      return Yf1.isValidSpanId
    }
  });
  var Jf1 = WnA();
  Object.defineProperty(XG, "INVALID_SPANID", {
    enumerable: !0,
    get: function() {
      return Jf1.INVALID_SPANID
    }
  });
  Object.defineProperty(XG, "INVALID_TRACEID", {
    enumerable: !0,
    get: function() {
      return Jf1.INVALID_TRACEID
    }
  });
  Object.defineProperty(XG, "INVALID_SPAN_CONTEXT", {
    enumerable: !0,
    get: function() {
      return Jf1.INVALID_SPAN_CONTEXT
    }
  });
  var s3B = W3B();
  Object.defineProperty(XG, "context", {
    enumerable: !0,
    get: function() {
      return s3B.context
    }
  });
  var r3B = F3B();
  Object.defineProperty(XG, "diag", {
    enumerable: !0,
    get: function() {
      return r3B.diag
    }
  });
  var o3B = q3B();
  Object.defineProperty(XG, "metrics", {
    enumerable: !0,
    get: function() {
      return o3B.metrics
    }
  });
  var t3B = f3B();
  Object.defineProperty(XG, "propagation", {
    enumerable: !0,
    get: function() {
      return t3B.propagation
    }
  });
  var e3B = i3B();
  Object.defineProperty(XG, "trace", {
    enumerable: !0,
    get: function() {
      return e3B.trace
    }
  });
  XG.default = {
    context: s3B.context,
    diag: r3B.diag,
    metrics: o3B.metrics,
    propagation: t3B.propagation,
    trace: e3B.trace
  }
})
// @from(Start 5248195, End 5249100)
Q7B = z((A7B) => {
  Object.defineProperty(A7B, "__esModule", {
    value: !0
  });
  A7B.SeverityNumber = void 0;
  var KA6;
  (function(A) {
    A[A.UNSPECIFIED = 0] = "UNSPECIFIED", A[A.TRACE = 1] = "TRACE", A[A.TRACE2 = 2] = "TRACE2", A[A.TRACE3 = 3] = "TRACE3", A[A.TRACE4 = 4] = "TRACE4", A[A.DEBUG = 5] = "DEBUG", A[A.DEBUG2 = 6] = "DEBUG2", A[A.DEBUG3 = 7] = "DEBUG3", A[A.DEBUG4 = 8] = "DEBUG4", A[A.INFO = 9] = "INFO", A[A.INFO2 = 10] = "INFO2", A[A.INFO3 = 11] = "INFO3", A[A.INFO4 = 12] = "INFO4", A[A.WARN = 13] = "WARN", A[A.WARN2 = 14] = "WARN2", A[A.WARN3 = 15] = "WARN3", A[A.WARN4 = 16] = "WARN4", A[A.ERROR = 17] = "ERROR", A[A.ERROR2 = 18] = "ERROR2", A[A.ERROR3 = 19] = "ERROR3", A[A.ERROR4 = 20] = "ERROR4", A[A.FATAL = 21] = "FATAL", A[A.FATAL2 = 22] = "FATAL2", A[A.FATAL3 = 23] = "FATAL3", A[A.FATAL4 = 24] = "FATAL4"
  })(KA6 = A7B.SeverityNumber || (A7B.SeverityNumber = {}))
})
// @from(Start 5249106, End 5249322)
KnA = z((B7B) => {
  Object.defineProperty(B7B, "__esModule", {
    value: !0
  });
  B7B.NOOP_LOGGER = B7B.NoopLogger = void 0;
  class Xf1 {
    emit(A) {}
  }
  B7B.NoopLogger = Xf1;
  B7B.NOOP_LOGGER = new Xf1
})
// @from(Start 5249328, End 5249645)
DnA = z((Z7B) => {
  Object.defineProperty(Z7B, "__esModule", {
    value: !0
  });
  Z7B.NOOP_LOGGER_PROVIDER = Z7B.NoopLoggerProvider = void 0;
  var HA6 = KnA();
  class Vf1 {
    getLogger(A, Q, B) {
      return new HA6.NoopLogger
    }
  }
  Z7B.NoopLoggerProvider = Vf1;
  Z7B.NOOP_LOGGER_PROVIDER = new Vf1
})
// @from(Start 5249651, End 5250238)
Ff1 = z((J7B) => {
  Object.defineProperty(J7B, "__esModule", {
    value: !0
  });
  J7B.ProxyLogger = void 0;
  var EA6 = KnA();
  class Y7B {
    constructor(A, Q, B, G) {
      this._provider = A, this.name = Q, this.version = B, this.options = G
    }
    emit(A) {
      this._getLogger().emit(A)
    }
    _getLogger() {
      if (this._delegate) return this._delegate;
      let A = this._provider._getDelegateLogger(this.name, this.version, this.options);
      if (!A) return EA6.NOOP_LOGGER;
      return this._delegate = A, this._delegate
    }
  }
  J7B.ProxyLogger = Y7B
})
// @from(Start 5250244, End 5250941)
Kf1 = z((V7B) => {
  Object.defineProperty(V7B, "__esModule", {
    value: !0
  });
  V7B.ProxyLoggerProvider = void 0;
  var zA6 = DnA(),
    UA6 = Ff1();
  class X7B {
    getLogger(A, Q, B) {
      var G;
      return (G = this._getDelegateLogger(A, Q, B)) !== null && G !== void 0 ? G : new UA6.ProxyLogger(this, A, Q, B)
    }
    _getDelegate() {
      var A;
      return (A = this._delegate) !== null && A !== void 0 ? A : zA6.NOOP_LOGGER_PROVIDER
    }
    _setDelegate(A) {
      this._delegate = A
    }
    _getDelegateLogger(A, Q, B) {
      var G;
      return (G = this._delegate) === null || G === void 0 ? void 0 : G.getLogger(A, Q, B)
    }
  }
  V7B.ProxyLoggerProvider = X7B
})
// @from(Start 5250947, End 5251134)
H7B = z((K7B) => {
  Object.defineProperty(K7B, "__esModule", {
    value: !0
  });
  K7B._globalThis = void 0;
  K7B._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Start 5251140, End 5251401)
C7B = z((Df1) => {
  Object.defineProperty(Df1, "__esModule", {
    value: !0
  });
  Df1._globalThis = void 0;
  var $A6 = H7B();
  Object.defineProperty(Df1, "_globalThis", {
    enumerable: !0,
    get: function() {
      return $A6._globalThis
    }
  })
})
// @from(Start 5251407, End 5251668)
E7B = z((Hf1) => {
  Object.defineProperty(Hf1, "__esModule", {
    value: !0
  });
  Hf1._globalThis = void 0;
  var qA6 = C7B();
  Object.defineProperty(Hf1, "_globalThis", {
    enumerable: !0,
    get: function() {
      return qA6._globalThis
    }
  })
})
// @from(Start 5251674, End 5252128)
$7B = z((z7B) => {
  Object.defineProperty(z7B, "__esModule", {
    value: !0
  });
  z7B.API_BACKWARDS_COMPATIBILITY_VERSION = z7B.makeGetter = z7B._global = z7B.GLOBAL_LOGS_API_KEY = void 0;
  var LA6 = E7B();
  z7B.GLOBAL_LOGS_API_KEY = Symbol.for("io.opentelemetry.js.api.logs");
  z7B._global = LA6._globalThis;

  function MA6(A, Q, B) {
    return (G) => G === A ? Q : B
  }
  z7B.makeGetter = MA6;
  z7B.API_BACKWARDS_COMPATIBILITY_VERSION = 1
})
// @from(Start 5252134, End 5253313)
L7B = z((q7B) => {
  Object.defineProperty(q7B, "__esModule", {
    value: !0
  });
  q7B.LogsAPI = void 0;
  var BM = $7B(),
    PA6 = DnA(),
    w7B = Kf1();
  class Cf1 {
    constructor() {
      this._proxyLoggerProvider = new w7B.ProxyLoggerProvider
    }
    static getInstance() {
      if (!this._instance) this._instance = new Cf1;
      return this._instance
    }
    setGlobalLoggerProvider(A) {
      if (BM._global[BM.GLOBAL_LOGS_API_KEY]) return this.getLoggerProvider();
      return BM._global[BM.GLOBAL_LOGS_API_KEY] = (0, BM.makeGetter)(BM.API_BACKWARDS_COMPATIBILITY_VERSION, A, PA6.NOOP_LOGGER_PROVIDER), this._proxyLoggerProvider._setDelegate(A), A
    }
    getLoggerProvider() {
      var A, Q;
      return (Q = (A = BM._global[BM.GLOBAL_LOGS_API_KEY]) === null || A === void 0 ? void 0 : A.call(BM._global, BM.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && Q !== void 0 ? Q : this._proxyLoggerProvider
    }
    getLogger(A, Q, B) {
      return this.getLoggerProvider().getLogger(A, Q, B)
    }
    disable() {
      delete BM._global[BM.GLOBAL_LOGS_API_KEY], this._proxyLoggerProvider = new w7B.ProxyLoggerProvider
    }
  }
  q7B.LogsAPI = Cf1
})