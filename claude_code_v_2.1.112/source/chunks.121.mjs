
// @from(Ln 300054, Col 4)
km8 = p((us4, ms4) => {
    Object.defineProperty(us4, "__esModule", {
        value: !0
    });
    var m5 = ds1(),
        S1 = m5.Reader,
        t9 = m5.Writer,
        t6 = m5.util,
        r6 = m5.roots.default || (m5.roots.default = {});
    r6.opentelemetry = function() {
        var q = {};
        return q.proto = function() {
            var K = {};
            return K.common = function() {
                var _ = {};
                return _.v1 = function() {
                    var z = {};
                    return z.AnyValue = function() {
                        function Y(O) {
                            if (O) {
                                for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                    if (O[w[$]] != null) this[w[$]] = O[w[$]]
                            }
                        }
                        Y.prototype.stringValue = null, Y.prototype.boolValue = null, Y.prototype.intValue = null, Y.prototype.doubleValue = null, Y.prototype.arrayValue = null, Y.prototype.kvlistValue = null, Y.prototype.bytesValue = null;
                        var A;
                        return Object.defineProperty(Y.prototype, "value", {
                            get: t6.oneOfGetter(A = ["stringValue", "boolValue", "intValue", "doubleValue", "arrayValue", "kvlistValue", "bytesValue"]),
                            set: t6.oneOfSetter(A)
                        }), Y.create = function(w) {
                            return new Y(w)
                        }, Y.encode = function(w, $) {
                            if (!$) $ = t9.create();
                            if (w.stringValue != null && Object.hasOwnProperty.call(w, "stringValue")) $.uint32(10).string(w.stringValue);
                            if (w.boolValue != null && Object.hasOwnProperty.call(w, "boolValue")) $.uint32(16).bool(w.boolValue);
                            if (w.intValue != null && Object.hasOwnProperty.call(w, "intValue")) $.uint32(24).int64(w.intValue);
                            if (w.doubleValue != null && Object.hasOwnProperty.call(w, "doubleValue")) $.uint32(33).double(w.doubleValue);
                            if (w.arrayValue != null && Object.hasOwnProperty.call(w, "arrayValue")) r6.opentelemetry.proto.common.v1.ArrayValue.encode(w.arrayValue, $.uint32(42).fork()).ldelim();
                            if (w.kvlistValue != null && Object.hasOwnProperty.call(w, "kvlistValue")) r6.opentelemetry.proto.common.v1.KeyValueList.encode(w.kvlistValue, $.uint32(50).fork()).ldelim();
                            if (w.bytesValue != null && Object.hasOwnProperty.call(w, "bytesValue")) $.uint32(58).bytes(w.bytesValue);
                            return $
                        }, Y.encodeDelimited = function(w, $) {
                            return this.encode(w, $).ldelim()
                        }, Y.decode = function(w, $, j) {
                            if (!(w instanceof S1)) w = S1.create(w);
                            var H = $ === void 0 ? w.len : w.pos + $,
                                J = new r6.opentelemetry.proto.common.v1.AnyValue;
                            while (w.pos < H) {
                                var X = w.uint32();
                                if (X === j) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.stringValue = w.string();
                                        break
                                    }
                                    case 2: {
                                        J.boolValue = w.bool();
                                        break
                                    }
                                    case 3: {
                                        J.intValue = w.int64();
                                        break
                                    }
                                    case 4: {
                                        J.doubleValue = w.double();
                                        break
                                    }
                                    case 5: {
                                        J.arrayValue = r6.opentelemetry.proto.common.v1.ArrayValue.decode(w, w.uint32());
                                        break
                                    }
                                    case 6: {
                                        J.kvlistValue = r6.opentelemetry.proto.common.v1.KeyValueList.decode(w, w.uint32());
                                        break
                                    }
                                    case 7: {
                                        J.bytesValue = w.bytes();
                                        break
                                    }
                                    default:
                                        w.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, Y.decodeDelimited = function(w) {
                            if (!(w instanceof S1)) w = new S1(w);
                            return this.decode(w, w.uint32())
                        }, Y.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            var $ = {};
                            if (w.stringValue != null && w.hasOwnProperty("stringValue")) {
                                if ($.value = 1, !t6.isString(w.stringValue)) return "stringValue: string expected"
                            }
                            if (w.boolValue != null && w.hasOwnProperty("boolValue")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, typeof w.boolValue !== "boolean") return "boolValue: boolean expected"
                            }
                            if (w.intValue != null && w.hasOwnProperty("intValue")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, !t6.isInteger(w.intValue) && !(w.intValue && t6.isInteger(w.intValue.low) && t6.isInteger(w.intValue.high))) return "intValue: integer|Long expected"
                            }
                            if (w.doubleValue != null && w.hasOwnProperty("doubleValue")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, typeof w.doubleValue !== "number") return "doubleValue: number expected"
                            }
                            if (w.arrayValue != null && w.hasOwnProperty("arrayValue")) {
                                if ($.value === 1) return "value: multiple values";
                                $.value = 1;
                                {
                                    var j = r6.opentelemetry.proto.common.v1.ArrayValue.verify(w.arrayValue);
                                    if (j) return "arrayValue." + j
                                }
                            }
                            if (w.kvlistValue != null && w.hasOwnProperty("kvlistValue")) {
                                if ($.value === 1) return "value: multiple values";
                                $.value = 1;
                                {
                                    var j = r6.opentelemetry.proto.common.v1.KeyValueList.verify(w.kvlistValue);
                                    if (j) return "kvlistValue." + j
                                }
                            }
                            if (w.bytesValue != null && w.hasOwnProperty("bytesValue")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, !(w.bytesValue && typeof w.bytesValue.length === "number" || t6.isString(w.bytesValue))) return "bytesValue: buffer expected"
                            }
                            return null
                        }, Y.fromObject = function(w) {
                            if (w instanceof r6.opentelemetry.proto.common.v1.AnyValue) return w;
                            var $ = new r6.opentelemetry.proto.common.v1.AnyValue;
                            if (w.stringValue != null) $.stringValue = String(w.stringValue);
                            if (w.boolValue != null) $.boolValue = Boolean(w.boolValue);
                            if (w.intValue != null) {
                                if (t6.Long)($.intValue = t6.Long.fromValue(w.intValue)).unsigned = !1;
                                else if (typeof w.intValue === "string") $.intValue = parseInt(w.intValue, 10);
                                else if (typeof w.intValue === "number") $.intValue = w.intValue;
                                else if (typeof w.intValue === "object") $.intValue = new t6.LongBits(w.intValue.low >>> 0, w.intValue.high >>> 0).toNumber()
                            }
                            if (w.doubleValue != null) $.doubleValue = Number(w.doubleValue);
                            if (w.arrayValue != null) {
                                if (typeof w.arrayValue !== "object") throw TypeError(".opentelemetry.proto.common.v1.AnyValue.arrayValue: object expected");
                                $.arrayValue = r6.opentelemetry.proto.common.v1.ArrayValue.fromObject(w.arrayValue)
                            }
                            if (w.kvlistValue != null) {
                                if (typeof w.kvlistValue !== "object") throw TypeError(".opentelemetry.proto.common.v1.AnyValue.kvlistValue: object expected");
                                $.kvlistValue = r6.opentelemetry.proto.common.v1.KeyValueList.fromObject(w.kvlistValue)
                            }
                            if (w.bytesValue != null) {
                                if (typeof w.bytesValue === "string") t6.base64.decode(w.bytesValue, $.bytesValue = t6.newBuffer(t6.base64.length(w.bytesValue)), 0);
                                else if (w.bytesValue.length >= 0) $.bytesValue = w.bytesValue
                            }
                            return $
                        }, Y.toObject = function(w, $) {
                            if (!$) $ = {};
                            var j = {};
                            if (w.stringValue != null && w.hasOwnProperty("stringValue")) {
                                if (j.stringValue = w.stringValue, $.oneofs) j.value = "stringValue"
                            }
                            if (w.boolValue != null && w.hasOwnProperty("boolValue")) {
                                if (j.boolValue = w.boolValue, $.oneofs) j.value = "boolValue"
                            }
                            if (w.intValue != null && w.hasOwnProperty("intValue")) {
                                if (typeof w.intValue === "number") j.intValue = $.longs === String ? String(w.intValue) : w.intValue;
                                else j.intValue = $.longs === String ? t6.Long.prototype.toString.call(w.intValue) : $.longs === Number ? new t6.LongBits(w.intValue.low >>> 0, w.intValue.high >>> 0).toNumber() : w.intValue;
                                if ($.oneofs) j.value = "intValue"
                            }
                            if (w.doubleValue != null && w.hasOwnProperty("doubleValue")) {
                                if (j.doubleValue = $.json && !isFinite(w.doubleValue) ? String(w.doubleValue) : w.doubleValue, $.oneofs) j.value = "doubleValue"
                            }
                            if (w.arrayValue != null && w.hasOwnProperty("arrayValue")) {
                                if (j.arrayValue = r6.opentelemetry.proto.common.v1.ArrayValue.toObject(w.arrayValue, $), $.oneofs) j.value = "arrayValue"
                            }
                            if (w.kvlistValue != null && w.hasOwnProperty("kvlistValue")) {
                                if (j.kvlistValue = r6.opentelemetry.proto.common.v1.KeyValueList.toObject(w.kvlistValue, $), $.oneofs) j.value = "kvlistValue"
                            }
                            if (w.bytesValue != null && w.hasOwnProperty("bytesValue")) {
                                if (j.bytesValue = $.bytes === String ? t6.base64.encode(w.bytesValue, 0, w.bytesValue.length) : $.bytes === Array ? Array.prototype.slice.call(w.bytesValue) : w.bytesValue, $.oneofs) j.value = "bytesValue"
                            }
                            return j
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.common.v1.AnyValue"
                        }, Y
                    }(), z.ArrayValue = function() {
                        function Y(A) {
                            if (this.values = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.values = t6.emptyArray, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.values != null && O.values.length)
                                for (var $ = 0; $ < O.values.length; ++$) r6.opentelemetry.proto.common.v1.AnyValue.encode(O.values[$], w.uint32(10).fork()).ldelim();
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.common.v1.ArrayValue;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(H.values && H.values.length)) H.values = [];
                                        H.values.push(r6.opentelemetry.proto.common.v1.AnyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.values != null && O.hasOwnProperty("values")) {
                                if (!Array.isArray(O.values)) return "values: array expected";
                                for (var w = 0; w < O.values.length; ++w) {
                                    var $ = r6.opentelemetry.proto.common.v1.AnyValue.verify(O.values[w]);
                                    if ($) return "values." + $
                                }
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.common.v1.ArrayValue) return O;
                            var w = new r6.opentelemetry.proto.common.v1.ArrayValue;
                            if (O.values) {
                                if (!Array.isArray(O.values)) throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: array expected");
                                w.values = [];
                                for (var $ = 0; $ < O.values.length; ++$) {
                                    if (typeof O.values[$] !== "object") throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: object expected");
                                    w.values[$] = r6.opentelemetry.proto.common.v1.AnyValue.fromObject(O.values[$])
                                }
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.values = [];
                            if (O.values && O.values.length) {
                                $.values = [];
                                for (var j = 0; j < O.values.length; ++j) $.values[j] = r6.opentelemetry.proto.common.v1.AnyValue.toObject(O.values[j], w)
                            }
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.common.v1.ArrayValue"
                        }, Y
                    }(), z.KeyValueList = function() {
                        function Y(A) {
                            if (this.values = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.values = t6.emptyArray, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.values != null && O.values.length)
                                for (var $ = 0; $ < O.values.length; ++$) r6.opentelemetry.proto.common.v1.KeyValue.encode(O.values[$], w.uint32(10).fork()).ldelim();
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.common.v1.KeyValueList;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(H.values && H.values.length)) H.values = [];
                                        H.values.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.values != null && O.hasOwnProperty("values")) {
                                if (!Array.isArray(O.values)) return "values: array expected";
                                for (var w = 0; w < O.values.length; ++w) {
                                    var $ = r6.opentelemetry.proto.common.v1.KeyValue.verify(O.values[w]);
                                    if ($) return "values." + $
                                }
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.common.v1.KeyValueList) return O;
                            var w = new r6.opentelemetry.proto.common.v1.KeyValueList;
                            if (O.values) {
                                if (!Array.isArray(O.values)) throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: array expected");
                                w.values = [];
                                for (var $ = 0; $ < O.values.length; ++$) {
                                    if (typeof O.values[$] !== "object") throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: object expected");
                                    w.values[$] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.values[$])
                                }
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.values = [];
                            if (O.values && O.values.length) {
                                $.values = [];
                                for (var j = 0; j < O.values.length; ++j) $.values[j] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(O.values[j], w)
                            }
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.common.v1.KeyValueList"
                        }, Y
                    }(), z.KeyValue = function() {
                        function Y(A) {
                            if (A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.key = null, Y.prototype.value = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.key != null && Object.hasOwnProperty.call(O, "key")) w.uint32(10).string(O.key);
                            if (O.value != null && Object.hasOwnProperty.call(O, "value")) r6.opentelemetry.proto.common.v1.AnyValue.encode(O.value, w.uint32(18).fork()).ldelim();
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.common.v1.KeyValue;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        H.key = O.string();
                                        break
                                    }
                                    case 2: {
                                        H.value = r6.opentelemetry.proto.common.v1.AnyValue.decode(O, O.uint32());
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.key != null && O.hasOwnProperty("key")) {
                                if (!t6.isString(O.key)) return "key: string expected"
                            }
                            if (O.value != null && O.hasOwnProperty("value")) {
                                var w = r6.opentelemetry.proto.common.v1.AnyValue.verify(O.value);
                                if (w) return "value." + w
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.common.v1.KeyValue) return O;
                            var w = new r6.opentelemetry.proto.common.v1.KeyValue;
                            if (O.key != null) w.key = String(O.key);
                            if (O.value != null) {
                                if (typeof O.value !== "object") throw TypeError(".opentelemetry.proto.common.v1.KeyValue.value: object expected");
                                w.value = r6.opentelemetry.proto.common.v1.AnyValue.fromObject(O.value)
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.defaults) $.key = "", $.value = null;
                            if (O.key != null && O.hasOwnProperty("key")) $.key = O.key;
                            if (O.value != null && O.hasOwnProperty("value")) $.value = r6.opentelemetry.proto.common.v1.AnyValue.toObject(O.value, w);
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.common.v1.KeyValue"
                        }, Y
                    }(), z.InstrumentationScope = function() {
                        function Y(A) {
                            if (this.attributes = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.name = null, Y.prototype.version = null, Y.prototype.attributes = t6.emptyArray, Y.prototype.droppedAttributesCount = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.name != null && Object.hasOwnProperty.call(O, "name")) w.uint32(10).string(O.name);
                            if (O.version != null && Object.hasOwnProperty.call(O, "version")) w.uint32(18).string(O.version);
                            if (O.attributes != null && O.attributes.length)
                                for (var $ = 0; $ < O.attributes.length; ++$) r6.opentelemetry.proto.common.v1.KeyValue.encode(O.attributes[$], w.uint32(26).fork()).ldelim();
                            if (O.droppedAttributesCount != null && Object.hasOwnProperty.call(O, "droppedAttributesCount")) w.uint32(32).uint32(O.droppedAttributesCount);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.common.v1.InstrumentationScope;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        H.name = O.string();
                                        break
                                    }
                                    case 2: {
                                        H.version = O.string();
                                        break
                                    }
                                    case 3: {
                                        if (!(H.attributes && H.attributes.length)) H.attributes = [];
                                        H.attributes.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    case 4: {
                                        H.droppedAttributesCount = O.uint32();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.name != null && O.hasOwnProperty("name")) {
                                if (!t6.isString(O.name)) return "name: string expected"
                            }
                            if (O.version != null && O.hasOwnProperty("version")) {
                                if (!t6.isString(O.version)) return "version: string expected"
                            }
                            if (O.attributes != null && O.hasOwnProperty("attributes")) {
                                if (!Array.isArray(O.attributes)) return "attributes: array expected";
                                for (var w = 0; w < O.attributes.length; ++w) {
                                    var $ = r6.opentelemetry.proto.common.v1.KeyValue.verify(O.attributes[w]);
                                    if ($) return "attributes." + $
                                }
                            }
                            if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) {
                                if (!t6.isInteger(O.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.common.v1.InstrumentationScope) return O;
                            var w = new r6.opentelemetry.proto.common.v1.InstrumentationScope;
                            if (O.name != null) w.name = String(O.name);
                            if (O.version != null) w.version = String(O.version);
                            if (O.attributes) {
                                if (!Array.isArray(O.attributes)) throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: array expected");
                                w.attributes = [];
                                for (var $ = 0; $ < O.attributes.length; ++$) {
                                    if (typeof O.attributes[$] !== "object") throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: object expected");
                                    w.attributes[$] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.attributes[$])
                                }
                            }
                            if (O.droppedAttributesCount != null) w.droppedAttributesCount = O.droppedAttributesCount >>> 0;
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.attributes = [];
                            if (w.defaults) $.name = "", $.version = "", $.droppedAttributesCount = 0;
                            if (O.name != null && O.hasOwnProperty("name")) $.name = O.name;
                            if (O.version != null && O.hasOwnProperty("version")) $.version = O.version;
                            if (O.attributes && O.attributes.length) {
                                $.attributes = [];
                                for (var j = 0; j < O.attributes.length; ++j) $.attributes[j] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(O.attributes[j], w)
                            }
                            if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) $.droppedAttributesCount = O.droppedAttributesCount;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.common.v1.InstrumentationScope"
                        }, Y
                    }(), z.EntityRef = function() {
                        function Y(A) {
                            if (this.idKeys = [], this.descriptionKeys = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.schemaUrl = null, Y.prototype.type = null, Y.prototype.idKeys = t6.emptyArray, Y.prototype.descriptionKeys = t6.emptyArray, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.schemaUrl != null && Object.hasOwnProperty.call(O, "schemaUrl")) w.uint32(10).string(O.schemaUrl);
                            if (O.type != null && Object.hasOwnProperty.call(O, "type")) w.uint32(18).string(O.type);
                            if (O.idKeys != null && O.idKeys.length)
                                for (var $ = 0; $ < O.idKeys.length; ++$) w.uint32(26).string(O.idKeys[$]);
                            if (O.descriptionKeys != null && O.descriptionKeys.length)
                                for (var $ = 0; $ < O.descriptionKeys.length; ++$) w.uint32(34).string(O.descriptionKeys[$]);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.common.v1.EntityRef;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        H.schemaUrl = O.string();
                                        break
                                    }
                                    case 2: {
                                        H.type = O.string();
                                        break
                                    }
                                    case 3: {
                                        if (!(H.idKeys && H.idKeys.length)) H.idKeys = [];
                                        H.idKeys.push(O.string());
                                        break
                                    }
                                    case 4: {
                                        if (!(H.descriptionKeys && H.descriptionKeys.length)) H.descriptionKeys = [];
                                        H.descriptionKeys.push(O.string());
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) {
                                if (!t6.isString(O.schemaUrl)) return "schemaUrl: string expected"
                            }
                            if (O.type != null && O.hasOwnProperty("type")) {
                                if (!t6.isString(O.type)) return "type: string expected"
                            }
                            if (O.idKeys != null && O.hasOwnProperty("idKeys")) {
                                if (!Array.isArray(O.idKeys)) return "idKeys: array expected";
                                for (var w = 0; w < O.idKeys.length; ++w)
                                    if (!t6.isString(O.idKeys[w])) return "idKeys: string[] expected"
                            }
                            if (O.descriptionKeys != null && O.hasOwnProperty("descriptionKeys")) {
                                if (!Array.isArray(O.descriptionKeys)) return "descriptionKeys: array expected";
                                for (var w = 0; w < O.descriptionKeys.length; ++w)
                                    if (!t6.isString(O.descriptionKeys[w])) return "descriptionKeys: string[] expected"
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.common.v1.EntityRef) return O;
                            var w = new r6.opentelemetry.proto.common.v1.EntityRef;
                            if (O.schemaUrl != null) w.schemaUrl = String(O.schemaUrl);
                            if (O.type != null) w.type = String(O.type);
                            if (O.idKeys) {
                                if (!Array.isArray(O.idKeys)) throw TypeError(".opentelemetry.proto.common.v1.EntityRef.idKeys: array expected");
                                w.idKeys = [];
                                for (var $ = 0; $ < O.idKeys.length; ++$) w.idKeys[$] = String(O.idKeys[$])
                            }
                            if (O.descriptionKeys) {
                                if (!Array.isArray(O.descriptionKeys)) throw TypeError(".opentelemetry.proto.common.v1.EntityRef.descriptionKeys: array expected");
                                w.descriptionKeys = [];
                                for (var $ = 0; $ < O.descriptionKeys.length; ++$) w.descriptionKeys[$] = String(O.descriptionKeys[$])
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.idKeys = [], $.descriptionKeys = [];
                            if (w.defaults) $.schemaUrl = "", $.type = "";
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) $.schemaUrl = O.schemaUrl;
                            if (O.type != null && O.hasOwnProperty("type")) $.type = O.type;
                            if (O.idKeys && O.idKeys.length) {
                                $.idKeys = [];
                                for (var j = 0; j < O.idKeys.length; ++j) $.idKeys[j] = O.idKeys[j]
                            }
                            if (O.descriptionKeys && O.descriptionKeys.length) {
                                $.descriptionKeys = [];
                                for (var j = 0; j < O.descriptionKeys.length; ++j) $.descriptionKeys[j] = O.descriptionKeys[j]
                            }
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.common.v1.EntityRef"
                        }, Y
                    }(), z
                }(), _
            }(), K.resource = function() {
                var _ = {};
                return _.v1 = function() {
                    var z = {};
                    return z.Resource = function() {
                        function Y(A) {
                            if (this.attributes = [], this.entityRefs = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.attributes = t6.emptyArray, Y.prototype.droppedAttributesCount = null, Y.prototype.entityRefs = t6.emptyArray, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.attributes != null && O.attributes.length)
                                for (var $ = 0; $ < O.attributes.length; ++$) r6.opentelemetry.proto.common.v1.KeyValue.encode(O.attributes[$], w.uint32(10).fork()).ldelim();
                            if (O.droppedAttributesCount != null && Object.hasOwnProperty.call(O, "droppedAttributesCount")) w.uint32(16).uint32(O.droppedAttributesCount);
                            if (O.entityRefs != null && O.entityRefs.length)
                                for (var $ = 0; $ < O.entityRefs.length; ++$) r6.opentelemetry.proto.common.v1.EntityRef.encode(O.entityRefs[$], w.uint32(26).fork()).ldelim();
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.resource.v1.Resource;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(H.attributes && H.attributes.length)) H.attributes = [];
                                        H.attributes.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    case 2: {
                                        H.droppedAttributesCount = O.uint32();
                                        break
                                    }
                                    case 3: {
                                        if (!(H.entityRefs && H.entityRefs.length)) H.entityRefs = [];
                                        H.entityRefs.push(r6.opentelemetry.proto.common.v1.EntityRef.decode(O, O.uint32()));
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.attributes != null && O.hasOwnProperty("attributes")) {
                                if (!Array.isArray(O.attributes)) return "attributes: array expected";
                                for (var w = 0; w < O.attributes.length; ++w) {
                                    var $ = r6.opentelemetry.proto.common.v1.KeyValue.verify(O.attributes[w]);
                                    if ($) return "attributes." + $
                                }
                            }
                            if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) {
                                if (!t6.isInteger(O.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            if (O.entityRefs != null && O.hasOwnProperty("entityRefs")) {
                                if (!Array.isArray(O.entityRefs)) return "entityRefs: array expected";
                                for (var w = 0; w < O.entityRefs.length; ++w) {
                                    var $ = r6.opentelemetry.proto.common.v1.EntityRef.verify(O.entityRefs[w]);
                                    if ($) return "entityRefs." + $
                                }
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.resource.v1.Resource) return O;
                            var w = new r6.opentelemetry.proto.resource.v1.Resource;
                            if (O.attributes) {
                                if (!Array.isArray(O.attributes)) throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: array expected");
                                w.attributes = [];
                                for (var $ = 0; $ < O.attributes.length; ++$) {
                                    if (typeof O.attributes[$] !== "object") throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: object expected");
                                    w.attributes[$] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.attributes[$])
                                }
                            }
                            if (O.droppedAttributesCount != null) w.droppedAttributesCount = O.droppedAttributesCount >>> 0;
                            if (O.entityRefs) {
                                if (!Array.isArray(O.entityRefs)) throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: array expected");
                                w.entityRefs = [];
                                for (var $ = 0; $ < O.entityRefs.length; ++$) {
                                    if (typeof O.entityRefs[$] !== "object") throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: object expected");
                                    w.entityRefs[$] = r6.opentelemetry.proto.common.v1.EntityRef.fromObject(O.entityRefs[$])
                                }
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.attributes = [], $.entityRefs = [];
                            if (w.defaults) $.droppedAttributesCount = 0;
                            if (O.attributes && O.attributes.length) {
                                $.attributes = [];
                                for (var j = 0; j < O.attributes.length; ++j) $.attributes[j] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(O.attributes[j], w)
                            }
                            if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) $.droppedAttributesCount = O.droppedAttributesCount;
                            if (O.entityRefs && O.entityRefs.length) {
                                $.entityRefs = [];
                                for (var j = 0; j < O.entityRefs.length; ++j) $.entityRefs[j] = r6.opentelemetry.proto.common.v1.EntityRef.toObject(O.entityRefs[j], w)
                            }
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.resource.v1.Resource"
                        }, Y
                    }(), z
                }(), _
            }(), K.trace = function() {
                var _ = {};
                return _.v1 = function() {
                    var z = {};
                    return z.TracesData = function() {
                        function Y(A) {
                            if (this.resourceSpans = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.resourceSpans = t6.emptyArray, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.resourceSpans != null && O.resourceSpans.length)
                                for (var $ = 0; $ < O.resourceSpans.length; ++$) r6.opentelemetry.proto.trace.v1.ResourceSpans.encode(O.resourceSpans[$], w.uint32(10).fork()).ldelim();
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.trace.v1.TracesData;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(H.resourceSpans && H.resourceSpans.length)) H.resourceSpans = [];
                                        H.resourceSpans.push(r6.opentelemetry.proto.trace.v1.ResourceSpans.decode(O, O.uint32()));
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.resourceSpans != null && O.hasOwnProperty("resourceSpans")) {
                                if (!Array.isArray(O.resourceSpans)) return "resourceSpans: array expected";
                                for (var w = 0; w < O.resourceSpans.length; ++w) {
                                    var $ = r6.opentelemetry.proto.trace.v1.ResourceSpans.verify(O.resourceSpans[w]);
                                    if ($) return "resourceSpans." + $
                                }
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.trace.v1.TracesData) return O;
                            var w = new r6.opentelemetry.proto.trace.v1.TracesData;
                            if (O.resourceSpans) {
                                if (!Array.isArray(O.resourceSpans)) throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: array expected");
                                w.resourceSpans = [];
                                for (var $ = 0; $ < O.resourceSpans.length; ++$) {
                                    if (typeof O.resourceSpans[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: object expected");
                                    w.resourceSpans[$] = r6.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(O.resourceSpans[$])
                                }
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.resourceSpans = [];
                            if (O.resourceSpans && O.resourceSpans.length) {
                                $.resourceSpans = [];
                                for (var j = 0; j < O.resourceSpans.length; ++j) $.resourceSpans[j] = r6.opentelemetry.proto.trace.v1.ResourceSpans.toObject(O.resourceSpans[j], w)
                            }
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.trace.v1.TracesData"
                        }, Y
                    }(), z.ResourceSpans = function() {
                        function Y(A) {
                            if (this.scopeSpans = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.resource = null, Y.prototype.scopeSpans = t6.emptyArray, Y.prototype.schemaUrl = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.resource != null && Object.hasOwnProperty.call(O, "resource")) r6.opentelemetry.proto.resource.v1.Resource.encode(O.resource, w.uint32(10).fork()).ldelim();
                            if (O.scopeSpans != null && O.scopeSpans.length)
                                for (var $ = 0; $ < O.scopeSpans.length; ++$) r6.opentelemetry.proto.trace.v1.ScopeSpans.encode(O.scopeSpans[$], w.uint32(18).fork()).ldelim();
                            if (O.schemaUrl != null && Object.hasOwnProperty.call(O, "schemaUrl")) w.uint32(26).string(O.schemaUrl);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.trace.v1.ResourceSpans;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        H.resource = r6.opentelemetry.proto.resource.v1.Resource.decode(O, O.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(H.scopeSpans && H.scopeSpans.length)) H.scopeSpans = [];
                                        H.scopeSpans.push(r6.opentelemetry.proto.trace.v1.ScopeSpans.decode(O, O.uint32()));
                                        break
                                    }
                                    case 3: {
                                        H.schemaUrl = O.string();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.resource != null && O.hasOwnProperty("resource")) {
                                var w = r6.opentelemetry.proto.resource.v1.Resource.verify(O.resource);
                                if (w) return "resource." + w
                            }
                            if (O.scopeSpans != null && O.hasOwnProperty("scopeSpans")) {
                                if (!Array.isArray(O.scopeSpans)) return "scopeSpans: array expected";
                                for (var $ = 0; $ < O.scopeSpans.length; ++$) {
                                    var w = r6.opentelemetry.proto.trace.v1.ScopeSpans.verify(O.scopeSpans[$]);
                                    if (w) return "scopeSpans." + w
                                }
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) {
                                if (!t6.isString(O.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.trace.v1.ResourceSpans) return O;
                            var w = new r6.opentelemetry.proto.trace.v1.ResourceSpans;
                            if (O.resource != null) {
                                if (typeof O.resource !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.resource: object expected");
                                w.resource = r6.opentelemetry.proto.resource.v1.Resource.fromObject(O.resource)
                            }
                            if (O.scopeSpans) {
                                if (!Array.isArray(O.scopeSpans)) throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: array expected");
                                w.scopeSpans = [];
                                for (var $ = 0; $ < O.scopeSpans.length; ++$) {
                                    if (typeof O.scopeSpans[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: object expected");
                                    w.scopeSpans[$] = r6.opentelemetry.proto.trace.v1.ScopeSpans.fromObject(O.scopeSpans[$])
                                }
                            }
                            if (O.schemaUrl != null) w.schemaUrl = String(O.schemaUrl);
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.scopeSpans = [];
                            if (w.defaults) $.resource = null, $.schemaUrl = "";
                            if (O.resource != null && O.hasOwnProperty("resource")) $.resource = r6.opentelemetry.proto.resource.v1.Resource.toObject(O.resource, w);
                            if (O.scopeSpans && O.scopeSpans.length) {
                                $.scopeSpans = [];
                                for (var j = 0; j < O.scopeSpans.length; ++j) $.scopeSpans[j] = r6.opentelemetry.proto.trace.v1.ScopeSpans.toObject(O.scopeSpans[j], w)
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) $.schemaUrl = O.schemaUrl;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.trace.v1.ResourceSpans"
                        }, Y
                    }(), z.ScopeSpans = function() {
                        function Y(A) {
                            if (this.spans = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.scope = null, Y.prototype.spans = t6.emptyArray, Y.prototype.schemaUrl = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.scope != null && Object.hasOwnProperty.call(O, "scope")) r6.opentelemetry.proto.common.v1.InstrumentationScope.encode(O.scope, w.uint32(10).fork()).ldelim();
                            if (O.spans != null && O.spans.length)
                                for (var $ = 0; $ < O.spans.length; ++$) r6.opentelemetry.proto.trace.v1.Span.encode(O.spans[$], w.uint32(18).fork()).ldelim();
                            if (O.schemaUrl != null && Object.hasOwnProperty.call(O, "schemaUrl")) w.uint32(26).string(O.schemaUrl);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.trace.v1.ScopeSpans;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        H.scope = r6.opentelemetry.proto.common.v1.InstrumentationScope.decode(O, O.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(H.spans && H.spans.length)) H.spans = [];
                                        H.spans.push(r6.opentelemetry.proto.trace.v1.Span.decode(O, O.uint32()));
                                        break
                                    }
                                    case 3: {
                                        H.schemaUrl = O.string();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.scope != null && O.hasOwnProperty("scope")) {
                                var w = r6.opentelemetry.proto.common.v1.InstrumentationScope.verify(O.scope);
                                if (w) return "scope." + w
                            }
                            if (O.spans != null && O.hasOwnProperty("spans")) {
                                if (!Array.isArray(O.spans)) return "spans: array expected";
                                for (var $ = 0; $ < O.spans.length; ++$) {
                                    var w = r6.opentelemetry.proto.trace.v1.Span.verify(O.spans[$]);
                                    if (w) return "spans." + w
                                }
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) {
                                if (!t6.isString(O.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.trace.v1.ScopeSpans) return O;
                            var w = new r6.opentelemetry.proto.trace.v1.ScopeSpans;
                            if (O.scope != null) {
                                if (typeof O.scope !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.scope: object expected");
                                w.scope = r6.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(O.scope)
                            }
                            if (O.spans) {
                                if (!Array.isArray(O.spans)) throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: array expected");
                                w.spans = [];
                                for (var $ = 0; $ < O.spans.length; ++$) {
                                    if (typeof O.spans[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: object expected");
                                    w.spans[$] = r6.opentelemetry.proto.trace.v1.Span.fromObject(O.spans[$])
                                }
                            }
                            if (O.schemaUrl != null) w.schemaUrl = String(O.schemaUrl);
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.spans = [];
                            if (w.defaults) $.scope = null, $.schemaUrl = "";
                            if (O.scope != null && O.hasOwnProperty("scope")) $.scope = r6.opentelemetry.proto.common.v1.InstrumentationScope.toObject(O.scope, w);
                            if (O.spans && O.spans.length) {
                                $.spans = [];
                                for (var j = 0; j < O.spans.length; ++j) $.spans[j] = r6.opentelemetry.proto.trace.v1.Span.toObject(O.spans[j], w)
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) $.schemaUrl = O.schemaUrl;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.trace.v1.ScopeSpans"
                        }, Y
                    }(), z.Span = function() {
                        function Y(A) {
                            if (this.attributes = [], this.events = [], this.links = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.traceId = null, Y.prototype.spanId = null, Y.prototype.traceState = null, Y.prototype.parentSpanId = null, Y.prototype.flags = null, Y.prototype.name = null, Y.prototype.kind = null, Y.prototype.startTimeUnixNano = null, Y.prototype.endTimeUnixNano = null, Y.prototype.attributes = t6.emptyArray, Y.prototype.droppedAttributesCount = null, Y.prototype.events = t6.emptyArray, Y.prototype.droppedEventsCount = null, Y.prototype.links = t6.emptyArray, Y.prototype.droppedLinksCount = null, Y.prototype.status = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.traceId != null && Object.hasOwnProperty.call(O, "traceId")) w.uint32(10).bytes(O.traceId);
                            if (O.spanId != null && Object.hasOwnProperty.call(O, "spanId")) w.uint32(18).bytes(O.spanId);
                            if (O.traceState != null && Object.hasOwnProperty.call(O, "traceState")) w.uint32(26).string(O.traceState);
                            if (O.parentSpanId != null && Object.hasOwnProperty.call(O, "parentSpanId")) w.uint32(34).bytes(O.parentSpanId);
                            if (O.name != null && Object.hasOwnProperty.call(O, "name")) w.uint32(42).string(O.name);
                            if (O.kind != null && Object.hasOwnProperty.call(O, "kind")) w.uint32(48).int32(O.kind);
                            if (O.startTimeUnixNano != null && Object.hasOwnProperty.call(O, "startTimeUnixNano")) w.uint32(57).fixed64(O.startTimeUnixNano);
                            if (O.endTimeUnixNano != null && Object.hasOwnProperty.call(O, "endTimeUnixNano")) w.uint32(65).fixed64(O.endTimeUnixNano);
                            if (O.attributes != null && O.attributes.length)
                                for (var $ = 0; $ < O.attributes.length; ++$) r6.opentelemetry.proto.common.v1.KeyValue.encode(O.attributes[$], w.uint32(74).fork()).ldelim();
                            if (O.droppedAttributesCount != null && Object.hasOwnProperty.call(O, "droppedAttributesCount")) w.uint32(80).uint32(O.droppedAttributesCount);
                            if (O.events != null && O.events.length)
                                for (var $ = 0; $ < O.events.length; ++$) r6.opentelemetry.proto.trace.v1.Span.Event.encode(O.events[$], w.uint32(90).fork()).ldelim();
                            if (O.droppedEventsCount != null && Object.hasOwnProperty.call(O, "droppedEventsCount")) w.uint32(96).uint32(O.droppedEventsCount);
                            if (O.links != null && O.links.length)
                                for (var $ = 0; $ < O.links.length; ++$) r6.opentelemetry.proto.trace.v1.Span.Link.encode(O.links[$], w.uint32(106).fork()).ldelim();
                            if (O.droppedLinksCount != null && Object.hasOwnProperty.call(O, "droppedLinksCount")) w.uint32(112).uint32(O.droppedLinksCount);
                            if (O.status != null && Object.hasOwnProperty.call(O, "status")) r6.opentelemetry.proto.trace.v1.Status.encode(O.status, w.uint32(122).fork()).ldelim();
                            if (O.flags != null && Object.hasOwnProperty.call(O, "flags")) w.uint32(133).fixed32(O.flags);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.trace.v1.Span;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        H.traceId = O.bytes();
                                        break
                                    }
                                    case 2: {
                                        H.spanId = O.bytes();
                                        break
                                    }
                                    case 3: {
                                        H.traceState = O.string();
                                        break
                                    }
                                    case 4: {
                                        H.parentSpanId = O.bytes();
                                        break
                                    }
                                    case 16: {
                                        H.flags = O.fixed32();
                                        break
                                    }
                                    case 5: {
                                        H.name = O.string();
                                        break
                                    }
                                    case 6: {
                                        H.kind = O.int32();
                                        break
                                    }
                                    case 7: {
                                        H.startTimeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 8: {
                                        H.endTimeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 9: {
                                        if (!(H.attributes && H.attributes.length)) H.attributes = [];
                                        H.attributes.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    case 10: {
                                        H.droppedAttributesCount = O.uint32();
                                        break
                                    }
                                    case 11: {
                                        if (!(H.events && H.events.length)) H.events = [];
                                        H.events.push(r6.opentelemetry.proto.trace.v1.Span.Event.decode(O, O.uint32()));
                                        break
                                    }
                                    case 12: {
                                        H.droppedEventsCount = O.uint32();
                                        break
                                    }
                                    case 13: {
                                        if (!(H.links && H.links.length)) H.links = [];
                                        H.links.push(r6.opentelemetry.proto.trace.v1.Span.Link.decode(O, O.uint32()));
                                        break
                                    }
                                    case 14: {
                                        H.droppedLinksCount = O.uint32();
                                        break
                                    }
                                    case 15: {
                                        H.status = r6.opentelemetry.proto.trace.v1.Status.decode(O, O.uint32());
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.traceId != null && O.hasOwnProperty("traceId")) {
                                if (!(O.traceId && typeof O.traceId.length === "number" || t6.isString(O.traceId))) return "traceId: buffer expected"
                            }
                            if (O.spanId != null && O.hasOwnProperty("spanId")) {
                                if (!(O.spanId && typeof O.spanId.length === "number" || t6.isString(O.spanId))) return "spanId: buffer expected"
                            }
                            if (O.traceState != null && O.hasOwnProperty("traceState")) {
                                if (!t6.isString(O.traceState)) return "traceState: string expected"
                            }
                            if (O.parentSpanId != null && O.hasOwnProperty("parentSpanId")) {
                                if (!(O.parentSpanId && typeof O.parentSpanId.length === "number" || t6.isString(O.parentSpanId))) return "parentSpanId: buffer expected"
                            }
                            if (O.flags != null && O.hasOwnProperty("flags")) {
                                if (!t6.isInteger(O.flags)) return "flags: integer expected"
                            }
                            if (O.name != null && O.hasOwnProperty("name")) {
                                if (!t6.isString(O.name)) return "name: string expected"
                            }
                            if (O.kind != null && O.hasOwnProperty("kind")) switch (O.kind) {
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
                            if (O.startTimeUnixNano != null && O.hasOwnProperty("startTimeUnixNano")) {
                                if (!t6.isInteger(O.startTimeUnixNano) && !(O.startTimeUnixNano && t6.isInteger(O.startTimeUnixNano.low) && t6.isInteger(O.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (O.endTimeUnixNano != null && O.hasOwnProperty("endTimeUnixNano")) {
                                if (!t6.isInteger(O.endTimeUnixNano) && !(O.endTimeUnixNano && t6.isInteger(O.endTimeUnixNano.low) && t6.isInteger(O.endTimeUnixNano.high))) return "endTimeUnixNano: integer|Long expected"
                            }
                            if (O.attributes != null && O.hasOwnProperty("attributes")) {
                                if (!Array.isArray(O.attributes)) return "attributes: array expected";
                                for (var w = 0; w < O.attributes.length; ++w) {
                                    var $ = r6.opentelemetry.proto.common.v1.KeyValue.verify(O.attributes[w]);
                                    if ($) return "attributes." + $
                                }
                            }
                            if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) {
                                if (!t6.isInteger(O.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            if (O.events != null && O.hasOwnProperty("events")) {
                                if (!Array.isArray(O.events)) return "events: array expected";
                                for (var w = 0; w < O.events.length; ++w) {
                                    var $ = r6.opentelemetry.proto.trace.v1.Span.Event.verify(O.events[w]);
                                    if ($) return "events." + $
                                }
                            }
                            if (O.droppedEventsCount != null && O.hasOwnProperty("droppedEventsCount")) {
                                if (!t6.isInteger(O.droppedEventsCount)) return "droppedEventsCount: integer expected"
                            }
                            if (O.links != null && O.hasOwnProperty("links")) {
                                if (!Array.isArray(O.links)) return "links: array expected";
                                for (var w = 0; w < O.links.length; ++w) {
                                    var $ = r6.opentelemetry.proto.trace.v1.Span.Link.verify(O.links[w]);
                                    if ($) return "links." + $
                                }
                            }
                            if (O.droppedLinksCount != null && O.hasOwnProperty("droppedLinksCount")) {
                                if (!t6.isInteger(O.droppedLinksCount)) return "droppedLinksCount: integer expected"
                            }
                            if (O.status != null && O.hasOwnProperty("status")) {
                                var $ = r6.opentelemetry.proto.trace.v1.Status.verify(O.status);
                                if ($) return "status." + $
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.trace.v1.Span) return O;
                            var w = new r6.opentelemetry.proto.trace.v1.Span;
                            if (O.traceId != null) {
                                if (typeof O.traceId === "string") t6.base64.decode(O.traceId, w.traceId = t6.newBuffer(t6.base64.length(O.traceId)), 0);
                                else if (O.traceId.length >= 0) w.traceId = O.traceId
                            }
                            if (O.spanId != null) {
                                if (typeof O.spanId === "string") t6.base64.decode(O.spanId, w.spanId = t6.newBuffer(t6.base64.length(O.spanId)), 0);
                                else if (O.spanId.length >= 0) w.spanId = O.spanId
                            }
                            if (O.traceState != null) w.traceState = String(O.traceState);
                            if (O.parentSpanId != null) {
                                if (typeof O.parentSpanId === "string") t6.base64.decode(O.parentSpanId, w.parentSpanId = t6.newBuffer(t6.base64.length(O.parentSpanId)), 0);
                                else if (O.parentSpanId.length >= 0) w.parentSpanId = O.parentSpanId
                            }
                            if (O.flags != null) w.flags = O.flags >>> 0;
                            if (O.name != null) w.name = String(O.name);
                            switch (O.kind) {
                                default:
                                    if (typeof O.kind === "number") {
                                        w.kind = O.kind;
                                        break
                                    }
                                    break;
                                case "SPAN_KIND_UNSPECIFIED":
                                case 0:
                                    w.kind = 0;
                                    break;
                                case "SPAN_KIND_INTERNAL":
                                case 1:
                                    w.kind = 1;
                                    break;
                                case "SPAN_KIND_SERVER":
                                case 2:
                                    w.kind = 2;
                                    break;
                                case "SPAN_KIND_CLIENT":
                                case 3:
                                    w.kind = 3;
                                    break;
                                case "SPAN_KIND_PRODUCER":
                                case 4:
                                    w.kind = 4;
                                    break;
                                case "SPAN_KIND_CONSUMER":
                                case 5:
                                    w.kind = 5;
                                    break
                            }
                            if (O.startTimeUnixNano != null) {
                                if (t6.Long)(w.startTimeUnixNano = t6.Long.fromValue(O.startTimeUnixNano)).unsigned = !1;
                                else if (typeof O.startTimeUnixNano === "string") w.startTimeUnixNano = parseInt(O.startTimeUnixNano, 10);
                                else if (typeof O.startTimeUnixNano === "number") w.startTimeUnixNano = O.startTimeUnixNano;
                                else if (typeof O.startTimeUnixNano === "object") w.startTimeUnixNano = new t6.LongBits(O.startTimeUnixNano.low >>> 0, O.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.endTimeUnixNano != null) {
                                if (t6.Long)(w.endTimeUnixNano = t6.Long.fromValue(O.endTimeUnixNano)).unsigned = !1;
                                else if (typeof O.endTimeUnixNano === "string") w.endTimeUnixNano = parseInt(O.endTimeUnixNano, 10);
                                else if (typeof O.endTimeUnixNano === "number") w.endTimeUnixNano = O.endTimeUnixNano;
                                else if (typeof O.endTimeUnixNano === "object") w.endTimeUnixNano = new t6.LongBits(O.endTimeUnixNano.low >>> 0, O.endTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.attributes) {
                                if (!Array.isArray(O.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: array expected");
                                w.attributes = [];
                                for (var $ = 0; $ < O.attributes.length; ++$) {
                                    if (typeof O.attributes[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: object expected");
                                    w.attributes[$] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.attributes[$])
                                }
                            }
                            if (O.droppedAttributesCount != null) w.droppedAttributesCount = O.droppedAttributesCount >>> 0;
                            if (O.events) {
                                if (!Array.isArray(O.events)) throw TypeError(".opentelemetry.proto.trace.v1.Span.events: array expected");
                                w.events = [];
                                for (var $ = 0; $ < O.events.length; ++$) {
                                    if (typeof O.events[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.events: object expected");
                                    w.events[$] = r6.opentelemetry.proto.trace.v1.Span.Event.fromObject(O.events[$])
                                }
                            }
                            if (O.droppedEventsCount != null) w.droppedEventsCount = O.droppedEventsCount >>> 0;
                            if (O.links) {
                                if (!Array.isArray(O.links)) throw TypeError(".opentelemetry.proto.trace.v1.Span.links: array expected");
                                w.links = [];
                                for (var $ = 0; $ < O.links.length; ++$) {
                                    if (typeof O.links[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.links: object expected");
                                    w.links[$] = r6.opentelemetry.proto.trace.v1.Span.Link.fromObject(O.links[$])
                                }
                            }
                            if (O.droppedLinksCount != null) w.droppedLinksCount = O.droppedLinksCount >>> 0;
                            if (O.status != null) {
                                if (typeof O.status !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.status: object expected");
                                w.status = r6.opentelemetry.proto.trace.v1.Status.fromObject(O.status)
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.attributes = [], $.events = [], $.links = [];
                            if (w.defaults) {
                                if (w.bytes === String) $.traceId = "";
                                else if ($.traceId = [], w.bytes !== Array) $.traceId = t6.newBuffer($.traceId);
                                if (w.bytes === String) $.spanId = "";
                                else if ($.spanId = [], w.bytes !== Array) $.spanId = t6.newBuffer($.spanId);
                                if ($.traceState = "", w.bytes === String) $.parentSpanId = "";
                                else if ($.parentSpanId = [], w.bytes !== Array) $.parentSpanId = t6.newBuffer($.parentSpanId);
                                if ($.name = "", $.kind = w.enums === String ? "SPAN_KIND_UNSPECIFIED" : 0, t6.Long) {
                                    var j = new t6.Long(0, 0, !1);
                                    $.startTimeUnixNano = w.longs === String ? j.toString() : w.longs === Number ? j.toNumber() : j
                                } else $.startTimeUnixNano = w.longs === String ? "0" : 0;
                                if (t6.Long) {
                                    var j = new t6.Long(0, 0, !1);
                                    $.endTimeUnixNano = w.longs === String ? j.toString() : w.longs === Number ? j.toNumber() : j
                                } else $.endTimeUnixNano = w.longs === String ? "0" : 0;
                                $.droppedAttributesCount = 0, $.droppedEventsCount = 0, $.droppedLinksCount = 0, $.status = null, $.flags = 0
                            }
                            if (O.traceId != null && O.hasOwnProperty("traceId")) $.traceId = w.bytes === String ? t6.base64.encode(O.traceId, 0, O.traceId.length) : w.bytes === Array ? Array.prototype.slice.call(O.traceId) : O.traceId;
                            if (O.spanId != null && O.hasOwnProperty("spanId")) $.spanId = w.bytes === String ? t6.base64.encode(O.spanId, 0, O.spanId.length) : w.bytes === Array ? Array.prototype.slice.call(O.spanId) : O.spanId;
                            if (O.traceState != null && O.hasOwnProperty("traceState")) $.traceState = O.traceState;
                            if (O.parentSpanId != null && O.hasOwnProperty("parentSpanId")) $.parentSpanId = w.bytes === String ? t6.base64.encode(O.parentSpanId, 0, O.parentSpanId.length) : w.bytes === Array ? Array.prototype.slice.call(O.parentSpanId) : O.parentSpanId;
                            if (O.name != null && O.hasOwnProperty("name")) $.name = O.name;
                            if (O.kind != null && O.hasOwnProperty("kind")) $.kind = w.enums === String ? r6.opentelemetry.proto.trace.v1.Span.SpanKind[O.kind] === void 0 ? O.kind : r6.opentelemetry.proto.trace.v1.Span.SpanKind[O.kind] : O.kind;
                            if (O.startTimeUnixNano != null && O.hasOwnProperty("startTimeUnixNano"))
                                if (typeof O.startTimeUnixNano === "number") $.startTimeUnixNano = w.longs === String ? String(O.startTimeUnixNano) : O.startTimeUnixNano;
                                else $.startTimeUnixNano = w.longs === String ? t6.Long.prototype.toString.call(O.startTimeUnixNano) : w.longs === Number ? new t6.LongBits(O.startTimeUnixNano.low >>> 0, O.startTimeUnixNano.high >>> 0).toNumber() : O.startTimeUnixNano;
                            if (O.endTimeUnixNano != null && O.hasOwnProperty("endTimeUnixNano"))
                                if (typeof O.endTimeUnixNano === "number") $.endTimeUnixNano = w.longs === String ? String(O.endTimeUnixNano) : O.endTimeUnixNano;
                                else $.endTimeUnixNano = w.longs === String ? t6.Long.prototype.toString.call(O.endTimeUnixNano) : w.longs === Number ? new t6.LongBits(O.endTimeUnixNano.low >>> 0, O.endTimeUnixNano.high >>> 0).toNumber() : O.endTimeUnixNano;
                            if (O.attributes && O.attributes.length) {
                                $.attributes = [];
                                for (var H = 0; H < O.attributes.length; ++H) $.attributes[H] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(O.attributes[H], w)
                            }
                            if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) $.droppedAttributesCount = O.droppedAttributesCount;
                            if (O.events && O.events.length) {
                                $.events = [];
                                for (var H = 0; H < O.events.length; ++H) $.events[H] = r6.opentelemetry.proto.trace.v1.Span.Event.toObject(O.events[H], w)
                            }
                            if (O.droppedEventsCount != null && O.hasOwnProperty("droppedEventsCount")) $.droppedEventsCount = O.droppedEventsCount;
                            if (O.links && O.links.length) {
                                $.links = [];
                                for (var H = 0; H < O.links.length; ++H) $.links[H] = r6.opentelemetry.proto.trace.v1.Span.Link.toObject(O.links[H], w)
                            }
                            if (O.droppedLinksCount != null && O.hasOwnProperty("droppedLinksCount")) $.droppedLinksCount = O.droppedLinksCount;
                            if (O.status != null && O.hasOwnProperty("status")) $.status = r6.opentelemetry.proto.trace.v1.Status.toObject(O.status, w);
                            if (O.flags != null && O.hasOwnProperty("flags")) $.flags = O.flags;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.trace.v1.Span"
                        }, Y.SpanKind = function() {
                            var A = {},
                                O = Object.create(A);
                            return O[A[0] = "SPAN_KIND_UNSPECIFIED"] = 0, O[A[1] = "SPAN_KIND_INTERNAL"] = 1, O[A[2] = "SPAN_KIND_SERVER"] = 2, O[A[3] = "SPAN_KIND_CLIENT"] = 3, O[A[4] = "SPAN_KIND_PRODUCER"] = 4, O[A[5] = "SPAN_KIND_CONSUMER"] = 5, O
                        }(), Y.Event = function() {
                            function A(O) {
                                if (this.attributes = [], O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.timeUnixNano = null, A.prototype.name = null, A.prototype.attributes = t6.emptyArray, A.prototype.droppedAttributesCount = null, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.timeUnixNano != null && Object.hasOwnProperty.call(w, "timeUnixNano")) $.uint32(9).fixed64(w.timeUnixNano);
                                if (w.name != null && Object.hasOwnProperty.call(w, "name")) $.uint32(18).string(w.name);
                                if (w.attributes != null && w.attributes.length)
                                    for (var j = 0; j < w.attributes.length; ++j) r6.opentelemetry.proto.common.v1.KeyValue.encode(w.attributes[j], $.uint32(26).fork()).ldelim();
                                if (w.droppedAttributesCount != null && Object.hasOwnProperty.call(w, "droppedAttributesCount")) $.uint32(32).uint32(w.droppedAttributesCount);
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.trace.v1.Span.Event;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            J.timeUnixNano = w.fixed64();
                                            break
                                        }
                                        case 2: {
                                            J.name = w.string();
                                            break
                                        }
                                        case 3: {
                                            if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                            J.attributes.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                            break
                                        }
                                        case 4: {
                                            J.droppedAttributesCount = w.uint32();
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano")) {
                                    if (!t6.isInteger(w.timeUnixNano) && !(w.timeUnixNano && t6.isInteger(w.timeUnixNano.low) && t6.isInteger(w.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                                }
                                if (w.name != null && w.hasOwnProperty("name")) {
                                    if (!t6.isString(w.name)) return "name: string expected"
                                }
                                if (w.attributes != null && w.hasOwnProperty("attributes")) {
                                    if (!Array.isArray(w.attributes)) return "attributes: array expected";
                                    for (var $ = 0; $ < w.attributes.length; ++$) {
                                        var j = r6.opentelemetry.proto.common.v1.KeyValue.verify(w.attributes[$]);
                                        if (j) return "attributes." + j
                                    }
                                }
                                if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) {
                                    if (!t6.isInteger(w.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.trace.v1.Span.Event) return w;
                                var $ = new r6.opentelemetry.proto.trace.v1.Span.Event;
                                if (w.timeUnixNano != null) {
                                    if (t6.Long)($.timeUnixNano = t6.Long.fromValue(w.timeUnixNano)).unsigned = !1;
                                    else if (typeof w.timeUnixNano === "string") $.timeUnixNano = parseInt(w.timeUnixNano, 10);
                                    else if (typeof w.timeUnixNano === "number") $.timeUnixNano = w.timeUnixNano;
                                    else if (typeof w.timeUnixNano === "object") $.timeUnixNano = new t6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber()
                                }
                                if (w.name != null) $.name = String(w.name);
                                if (w.attributes) {
                                    if (!Array.isArray(w.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: array expected");
                                    $.attributes = [];
                                    for (var j = 0; j < w.attributes.length; ++j) {
                                        if (typeof w.attributes[j] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: object expected");
                                        $.attributes[j] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.attributes[j])
                                    }
                                }
                                if (w.droppedAttributesCount != null) $.droppedAttributesCount = w.droppedAttributesCount >>> 0;
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.arrays || $.defaults) j.attributes = [];
                                if ($.defaults) {
                                    if (t6.Long) {
                                        var H = new t6.Long(0, 0, !1);
                                        j.timeUnixNano = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                    } else j.timeUnixNano = $.longs === String ? "0" : 0;
                                    j.name = "", j.droppedAttributesCount = 0
                                }
                                if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano"))
                                    if (typeof w.timeUnixNano === "number") j.timeUnixNano = $.longs === String ? String(w.timeUnixNano) : w.timeUnixNano;
                                    else j.timeUnixNano = $.longs === String ? t6.Long.prototype.toString.call(w.timeUnixNano) : $.longs === Number ? new t6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber() : w.timeUnixNano;
                                if (w.name != null && w.hasOwnProperty("name")) j.name = w.name;
                                if (w.attributes && w.attributes.length) {
                                    j.attributes = [];
                                    for (var J = 0; J < w.attributes.length; ++J) j.attributes[J] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(w.attributes[J], $)
                                }
                                if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) j.droppedAttributesCount = w.droppedAttributesCount;
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.trace.v1.Span.Event"
                            }, A
                        }(), Y.Link = function() {
                            function A(O) {
                                if (this.attributes = [], O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.traceId = null, A.prototype.spanId = null, A.prototype.traceState = null, A.prototype.attributes = t6.emptyArray, A.prototype.droppedAttributesCount = null, A.prototype.flags = null, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.traceId != null && Object.hasOwnProperty.call(w, "traceId")) $.uint32(10).bytes(w.traceId);
                                if (w.spanId != null && Object.hasOwnProperty.call(w, "spanId")) $.uint32(18).bytes(w.spanId);
                                if (w.traceState != null && Object.hasOwnProperty.call(w, "traceState")) $.uint32(26).string(w.traceState);
                                if (w.attributes != null && w.attributes.length)
                                    for (var j = 0; j < w.attributes.length; ++j) r6.opentelemetry.proto.common.v1.KeyValue.encode(w.attributes[j], $.uint32(34).fork()).ldelim();
                                if (w.droppedAttributesCount != null && Object.hasOwnProperty.call(w, "droppedAttributesCount")) $.uint32(40).uint32(w.droppedAttributesCount);
                                if (w.flags != null && Object.hasOwnProperty.call(w, "flags")) $.uint32(53).fixed32(w.flags);
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.trace.v1.Span.Link;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            J.traceId = w.bytes();
                                            break
                                        }
                                        case 2: {
                                            J.spanId = w.bytes();
                                            break
                                        }
                                        case 3: {
                                            J.traceState = w.string();
                                            break
                                        }
                                        case 4: {
                                            if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                            J.attributes.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                            break
                                        }
                                        case 5: {
                                            J.droppedAttributesCount = w.uint32();
                                            break
                                        }
                                        case 6: {
                                            J.flags = w.fixed32();
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.traceId != null && w.hasOwnProperty("traceId")) {
                                    if (!(w.traceId && typeof w.traceId.length === "number" || t6.isString(w.traceId))) return "traceId: buffer expected"
                                }
                                if (w.spanId != null && w.hasOwnProperty("spanId")) {
                                    if (!(w.spanId && typeof w.spanId.length === "number" || t6.isString(w.spanId))) return "spanId: buffer expected"
                                }
                                if (w.traceState != null && w.hasOwnProperty("traceState")) {
                                    if (!t6.isString(w.traceState)) return "traceState: string expected"
                                }
                                if (w.attributes != null && w.hasOwnProperty("attributes")) {
                                    if (!Array.isArray(w.attributes)) return "attributes: array expected";
                                    for (var $ = 0; $ < w.attributes.length; ++$) {
                                        var j = r6.opentelemetry.proto.common.v1.KeyValue.verify(w.attributes[$]);
                                        if (j) return "attributes." + j
                                    }
                                }
                                if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) {
                                    if (!t6.isInteger(w.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                                }
                                if (w.flags != null && w.hasOwnProperty("flags")) {
                                    if (!t6.isInteger(w.flags)) return "flags: integer expected"
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.trace.v1.Span.Link) return w;
                                var $ = new r6.opentelemetry.proto.trace.v1.Span.Link;
                                if (w.traceId != null) {
                                    if (typeof w.traceId === "string") t6.base64.decode(w.traceId, $.traceId = t6.newBuffer(t6.base64.length(w.traceId)), 0);
                                    else if (w.traceId.length >= 0) $.traceId = w.traceId
                                }
                                if (w.spanId != null) {
                                    if (typeof w.spanId === "string") t6.base64.decode(w.spanId, $.spanId = t6.newBuffer(t6.base64.length(w.spanId)), 0);
                                    else if (w.spanId.length >= 0) $.spanId = w.spanId
                                }
                                if (w.traceState != null) $.traceState = String(w.traceState);
                                if (w.attributes) {
                                    if (!Array.isArray(w.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: array expected");
                                    $.attributes = [];
                                    for (var j = 0; j < w.attributes.length; ++j) {
                                        if (typeof w.attributes[j] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: object expected");
                                        $.attributes[j] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.attributes[j])
                                    }
                                }
                                if (w.droppedAttributesCount != null) $.droppedAttributesCount = w.droppedAttributesCount >>> 0;
                                if (w.flags != null) $.flags = w.flags >>> 0;
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.arrays || $.defaults) j.attributes = [];
                                if ($.defaults) {
                                    if ($.bytes === String) j.traceId = "";
                                    else if (j.traceId = [], $.bytes !== Array) j.traceId = t6.newBuffer(j.traceId);
                                    if ($.bytes === String) j.spanId = "";
                                    else if (j.spanId = [], $.bytes !== Array) j.spanId = t6.newBuffer(j.spanId);
                                    j.traceState = "", j.droppedAttributesCount = 0, j.flags = 0
                                }
                                if (w.traceId != null && w.hasOwnProperty("traceId")) j.traceId = $.bytes === String ? t6.base64.encode(w.traceId, 0, w.traceId.length) : $.bytes === Array ? Array.prototype.slice.call(w.traceId) : w.traceId;
                                if (w.spanId != null && w.hasOwnProperty("spanId")) j.spanId = $.bytes === String ? t6.base64.encode(w.spanId, 0, w.spanId.length) : $.bytes === Array ? Array.prototype.slice.call(w.spanId) : w.spanId;
                                if (w.traceState != null && w.hasOwnProperty("traceState")) j.traceState = w.traceState;
                                if (w.attributes && w.attributes.length) {
                                    j.attributes = [];
                                    for (var H = 0; H < w.attributes.length; ++H) j.attributes[H] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(w.attributes[H], $)
                                }
                                if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) j.droppedAttributesCount = w.droppedAttributesCount;
                                if (w.flags != null && w.hasOwnProperty("flags")) j.flags = w.flags;
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.trace.v1.Span.Link"
                            }, A
                        }(), Y
                    }(), z.Status = function() {
                        function Y(A) {
                            if (A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.message = null, Y.prototype.code = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.message != null && Object.hasOwnProperty.call(O, "message")) w.uint32(18).string(O.message);
                            if (O.code != null && Object.hasOwnProperty.call(O, "code")) w.uint32(24).int32(O.code);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.trace.v1.Status;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 2: {
                                        H.message = O.string();
                                        break
                                    }
                                    case 3: {
                                        H.code = O.int32();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.message != null && O.hasOwnProperty("message")) {
                                if (!t6.isString(O.message)) return "message: string expected"
                            }
                            if (O.code != null && O.hasOwnProperty("code")) switch (O.code) {
                                default:
                                    return "code: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.trace.v1.Status) return O;
                            var w = new r6.opentelemetry.proto.trace.v1.Status;
                            if (O.message != null) w.message = String(O.message);
                            switch (O.code) {
                                default:
                                    if (typeof O.code === "number") {
                                        w.code = O.code;
                                        break
                                    }
                                    break;
                                case "STATUS_CODE_UNSET":
                                case 0:
                                    w.code = 0;
                                    break;
                                case "STATUS_CODE_OK":
                                case 1:
                                    w.code = 1;
                                    break;
                                case "STATUS_CODE_ERROR":
                                case 2:
                                    w.code = 2;
                                    break
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.defaults) $.message = "", $.code = w.enums === String ? "STATUS_CODE_UNSET" : 0;
                            if (O.message != null && O.hasOwnProperty("message")) $.message = O.message;
                            if (O.code != null && O.hasOwnProperty("code")) $.code = w.enums === String ? r6.opentelemetry.proto.trace.v1.Status.StatusCode[O.code] === void 0 ? O.code : r6.opentelemetry.proto.trace.v1.Status.StatusCode[O.code] : O.code;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.trace.v1.Status"
                        }, Y.StatusCode = function() {
                            var A = {},
                                O = Object.create(A);
                            return O[A[0] = "STATUS_CODE_UNSET"] = 0, O[A[1] = "STATUS_CODE_OK"] = 1, O[A[2] = "STATUS_CODE_ERROR"] = 2, O
                        }(), Y
                    }(), z.SpanFlags = function() {
                        var Y = {},
                            A = Object.create(Y);
                        return A[Y[0] = "SPAN_FLAGS_DO_NOT_USE"] = 0, A[Y[255] = "SPAN_FLAGS_TRACE_FLAGS_MASK"] = 255, A[Y[256] = "SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK"] = 256, A[Y[512] = "SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK"] = 512, A
                    }(), z
                }(), _
            }(), K.collector = function() {
                var _ = {};
                return _.trace = function() {
                    var z = {};
                    return z.v1 = function() {
                        var Y = {};
                        return Y.TraceService = function() {
                            function A(O, w, $) {
                                m5.rpc.Service.call(this, O, w, $)
                            }
                            return (A.prototype = Object.create(m5.rpc.Service.prototype)).constructor = A, A.create = function(w, $, j) {
                                return new this(w, $, j)
                            }, Object.defineProperty(A.prototype.export = function O(w, $) {
                                return this.rpcCall(O, r6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest, r6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse, w, $)
                            }, "name", {
                                value: "Export"
                            }), A
                        }(), Y.ExportTraceServiceRequest = function() {
                            function A(O) {
                                if (this.resourceSpans = [], O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.resourceSpans = t6.emptyArray, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.resourceSpans != null && w.resourceSpans.length)
                                    for (var j = 0; j < w.resourceSpans.length; ++j) r6.opentelemetry.proto.trace.v1.ResourceSpans.encode(w.resourceSpans[j], $.uint32(10).fork()).ldelim();
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            if (!(J.resourceSpans && J.resourceSpans.length)) J.resourceSpans = [];
                                            J.resourceSpans.push(r6.opentelemetry.proto.trace.v1.ResourceSpans.decode(w, w.uint32()));
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.resourceSpans != null && w.hasOwnProperty("resourceSpans")) {
                                    if (!Array.isArray(w.resourceSpans)) return "resourceSpans: array expected";
                                    for (var $ = 0; $ < w.resourceSpans.length; ++$) {
                                        var j = r6.opentelemetry.proto.trace.v1.ResourceSpans.verify(w.resourceSpans[$]);
                                        if (j) return "resourceSpans." + j
                                    }
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest) return w;
                                var $ = new r6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
                                if (w.resourceSpans) {
                                    if (!Array.isArray(w.resourceSpans)) throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: array expected");
                                    $.resourceSpans = [];
                                    for (var j = 0; j < w.resourceSpans.length; ++j) {
                                        if (typeof w.resourceSpans[j] !== "object") throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: object expected");
                                        $.resourceSpans[j] = r6.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(w.resourceSpans[j])
                                    }
                                }
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.arrays || $.defaults) j.resourceSpans = [];
                                if (w.resourceSpans && w.resourceSpans.length) {
                                    j.resourceSpans = [];
                                    for (var H = 0; H < w.resourceSpans.length; ++H) j.resourceSpans[H] = r6.opentelemetry.proto.trace.v1.ResourceSpans.toObject(w.resourceSpans[H], $)
                                }
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest"
                            }, A
                        }(), Y.ExportTraceServiceResponse = function() {
                            function A(O) {
                                if (O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.partialSuccess = null, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.partialSuccess != null && Object.hasOwnProperty.call(w, "partialSuccess")) r6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.encode(w.partialSuccess, $.uint32(10).fork()).ldelim();
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            J.partialSuccess = r6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.decode(w, w.uint32());
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.partialSuccess != null && w.hasOwnProperty("partialSuccess")) {
                                    var $ = r6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.verify(w.partialSuccess);
                                    if ($) return "partialSuccess." + $
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse) return w;
                                var $ = new r6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;
                                if (w.partialSuccess != null) {
                                    if (typeof w.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse.partialSuccess: object expected");
                                    $.partialSuccess = r6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.fromObject(w.partialSuccess)
                                }
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.defaults) j.partialSuccess = null;
                                if (w.partialSuccess != null && w.hasOwnProperty("partialSuccess")) j.partialSuccess = r6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.toObject(w.partialSuccess, $);
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse"
                            }, A
                        }(), Y.ExportTracePartialSuccess = function() {
                            function A(O) {
                                if (O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.rejectedSpans = null, A.prototype.errorMessage = null, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.rejectedSpans != null && Object.hasOwnProperty.call(w, "rejectedSpans")) $.uint32(8).int64(w.rejectedSpans);
                                if (w.errorMessage != null && Object.hasOwnProperty.call(w, "errorMessage")) $.uint32(18).string(w.errorMessage);
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            J.rejectedSpans = w.int64();
                                            break
                                        }
                                        case 2: {
                                            J.errorMessage = w.string();
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.rejectedSpans != null && w.hasOwnProperty("rejectedSpans")) {
                                    if (!t6.isInteger(w.rejectedSpans) && !(w.rejectedSpans && t6.isInteger(w.rejectedSpans.low) && t6.isInteger(w.rejectedSpans.high))) return "rejectedSpans: integer|Long expected"
                                }
                                if (w.errorMessage != null && w.hasOwnProperty("errorMessage")) {
                                    if (!t6.isString(w.errorMessage)) return "errorMessage: string expected"
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess) return w;
                                var $ = new r6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;
                                if (w.rejectedSpans != null) {
                                    if (t6.Long)($.rejectedSpans = t6.Long.fromValue(w.rejectedSpans)).unsigned = !1;
                                    else if (typeof w.rejectedSpans === "string") $.rejectedSpans = parseInt(w.rejectedSpans, 10);
                                    else if (typeof w.rejectedSpans === "number") $.rejectedSpans = w.rejectedSpans;
                                    else if (typeof w.rejectedSpans === "object") $.rejectedSpans = new t6.LongBits(w.rejectedSpans.low >>> 0, w.rejectedSpans.high >>> 0).toNumber()
                                }
                                if (w.errorMessage != null) $.errorMessage = String(w.errorMessage);
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.defaults) {
                                    if (t6.Long) {
                                        var H = new t6.Long(0, 0, !1);
                                        j.rejectedSpans = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                    } else j.rejectedSpans = $.longs === String ? "0" : 0;
                                    j.errorMessage = ""
                                }
                                if (w.rejectedSpans != null && w.hasOwnProperty("rejectedSpans"))
                                    if (typeof w.rejectedSpans === "number") j.rejectedSpans = $.longs === String ? String(w.rejectedSpans) : w.rejectedSpans;
                                    else j.rejectedSpans = $.longs === String ? t6.Long.prototype.toString.call(w.rejectedSpans) : $.longs === Number ? new t6.LongBits(w.rejectedSpans.low >>> 0, w.rejectedSpans.high >>> 0).toNumber() : w.rejectedSpans;
                                if (w.errorMessage != null && w.hasOwnProperty("errorMessage")) j.errorMessage = w.errorMessage;
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess"
                            }, A
                        }(), Y
                    }(), z
                }(), _.metrics = function() {
                    var z = {};
                    return z.v1 = function() {
                        var Y = {};
                        return Y.MetricsService = function() {
                            function A(O, w, $) {
                                m5.rpc.Service.call(this, O, w, $)
                            }
                            return (A.prototype = Object.create(m5.rpc.Service.prototype)).constructor = A, A.create = function(w, $, j) {
                                return new this(w, $, j)
                            }, Object.defineProperty(A.prototype.export = function O(w, $) {
                                return this.rpcCall(O, r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest, r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse, w, $)
                            }, "name", {
                                value: "Export"
                            }), A
                        }(), Y.ExportMetricsServiceRequest = function() {
                            function A(O) {
                                if (this.resourceMetrics = [], O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.resourceMetrics = t6.emptyArray, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.resourceMetrics != null && w.resourceMetrics.length)
                                    for (var j = 0; j < w.resourceMetrics.length; ++j) r6.opentelemetry.proto.metrics.v1.ResourceMetrics.encode(w.resourceMetrics[j], $.uint32(10).fork()).ldelim();
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            if (!(J.resourceMetrics && J.resourceMetrics.length)) J.resourceMetrics = [];
                                            J.resourceMetrics.push(r6.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(w, w.uint32()));
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.resourceMetrics != null && w.hasOwnProperty("resourceMetrics")) {
                                    if (!Array.isArray(w.resourceMetrics)) return "resourceMetrics: array expected";
                                    for (var $ = 0; $ < w.resourceMetrics.length; ++$) {
                                        var j = r6.opentelemetry.proto.metrics.v1.ResourceMetrics.verify(w.resourceMetrics[$]);
                                        if (j) return "resourceMetrics." + j
                                    }
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest) return w;
                                var $ = new r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
                                if (w.resourceMetrics) {
                                    if (!Array.isArray(w.resourceMetrics)) throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: array expected");
                                    $.resourceMetrics = [];
                                    for (var j = 0; j < w.resourceMetrics.length; ++j) {
                                        if (typeof w.resourceMetrics[j] !== "object") throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: object expected");
                                        $.resourceMetrics[j] = r6.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(w.resourceMetrics[j])
                                    }
                                }
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.arrays || $.defaults) j.resourceMetrics = [];
                                if (w.resourceMetrics && w.resourceMetrics.length) {
                                    j.resourceMetrics = [];
                                    for (var H = 0; H < w.resourceMetrics.length; ++H) j.resourceMetrics[H] = r6.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(w.resourceMetrics[H], $)
                                }
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest"
                            }, A
                        }(), Y.ExportMetricsServiceResponse = function() {
                            function A(O) {
                                if (O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.partialSuccess = null, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.partialSuccess != null && Object.hasOwnProperty.call(w, "partialSuccess")) r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.encode(w.partialSuccess, $.uint32(10).fork()).ldelim();
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            J.partialSuccess = r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.decode(w, w.uint32());
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.partialSuccess != null && w.hasOwnProperty("partialSuccess")) {
                                    var $ = r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.verify(w.partialSuccess);
                                    if ($) return "partialSuccess." + $
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse) return w;
                                var $ = new r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;
                                if (w.partialSuccess != null) {
                                    if (typeof w.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse.partialSuccess: object expected");
                                    $.partialSuccess = r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.fromObject(w.partialSuccess)
                                }
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.defaults) j.partialSuccess = null;
                                if (w.partialSuccess != null && w.hasOwnProperty("partialSuccess")) j.partialSuccess = r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.toObject(w.partialSuccess, $);
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse"
                            }, A
                        }(), Y.ExportMetricsPartialSuccess = function() {
                            function A(O) {
                                if (O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.rejectedDataPoints = null, A.prototype.errorMessage = null, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.rejectedDataPoints != null && Object.hasOwnProperty.call(w, "rejectedDataPoints")) $.uint32(8).int64(w.rejectedDataPoints);
                                if (w.errorMessage != null && Object.hasOwnProperty.call(w, "errorMessage")) $.uint32(18).string(w.errorMessage);
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            J.rejectedDataPoints = w.int64();
                                            break
                                        }
                                        case 2: {
                                            J.errorMessage = w.string();
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.rejectedDataPoints != null && w.hasOwnProperty("rejectedDataPoints")) {
                                    if (!t6.isInteger(w.rejectedDataPoints) && !(w.rejectedDataPoints && t6.isInteger(w.rejectedDataPoints.low) && t6.isInteger(w.rejectedDataPoints.high))) return "rejectedDataPoints: integer|Long expected"
                                }
                                if (w.errorMessage != null && w.hasOwnProperty("errorMessage")) {
                                    if (!t6.isString(w.errorMessage)) return "errorMessage: string expected"
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess) return w;
                                var $ = new r6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;
                                if (w.rejectedDataPoints != null) {
                                    if (t6.Long)($.rejectedDataPoints = t6.Long.fromValue(w.rejectedDataPoints)).unsigned = !1;
                                    else if (typeof w.rejectedDataPoints === "string") $.rejectedDataPoints = parseInt(w.rejectedDataPoints, 10);
                                    else if (typeof w.rejectedDataPoints === "number") $.rejectedDataPoints = w.rejectedDataPoints;
                                    else if (typeof w.rejectedDataPoints === "object") $.rejectedDataPoints = new t6.LongBits(w.rejectedDataPoints.low >>> 0, w.rejectedDataPoints.high >>> 0).toNumber()
                                }
                                if (w.errorMessage != null) $.errorMessage = String(w.errorMessage);
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.defaults) {
                                    if (t6.Long) {
                                        var H = new t6.Long(0, 0, !1);
                                        j.rejectedDataPoints = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                    } else j.rejectedDataPoints = $.longs === String ? "0" : 0;
                                    j.errorMessage = ""
                                }
                                if (w.rejectedDataPoints != null && w.hasOwnProperty("rejectedDataPoints"))
                                    if (typeof w.rejectedDataPoints === "number") j.rejectedDataPoints = $.longs === String ? String(w.rejectedDataPoints) : w.rejectedDataPoints;
                                    else j.rejectedDataPoints = $.longs === String ? t6.Long.prototype.toString.call(w.rejectedDataPoints) : $.longs === Number ? new t6.LongBits(w.rejectedDataPoints.low >>> 0, w.rejectedDataPoints.high >>> 0).toNumber() : w.rejectedDataPoints;
                                if (w.errorMessage != null && w.hasOwnProperty("errorMessage")) j.errorMessage = w.errorMessage;
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess"
                            }, A
                        }(), Y
                    }(), z
                }(), _.logs = function() {
                    var z = {};
                    return z.v1 = function() {
                        var Y = {};
                        return Y.LogsService = function() {
                            function A(O, w, $) {
                                m5.rpc.Service.call(this, O, w, $)
                            }
                            return (A.prototype = Object.create(m5.rpc.Service.prototype)).constructor = A, A.create = function(w, $, j) {
                                return new this(w, $, j)
                            }, Object.defineProperty(A.prototype.export = function O(w, $) {
                                return this.rpcCall(O, r6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest, r6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse, w, $)
                            }, "name", {
                                value: "Export"
                            }), A
                        }(), Y.ExportLogsServiceRequest = function() {
                            function A(O) {
                                if (this.resourceLogs = [], O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.resourceLogs = t6.emptyArray, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.resourceLogs != null && w.resourceLogs.length)
                                    for (var j = 0; j < w.resourceLogs.length; ++j) r6.opentelemetry.proto.logs.v1.ResourceLogs.encode(w.resourceLogs[j], $.uint32(10).fork()).ldelim();
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            if (!(J.resourceLogs && J.resourceLogs.length)) J.resourceLogs = [];
                                            J.resourceLogs.push(r6.opentelemetry.proto.logs.v1.ResourceLogs.decode(w, w.uint32()));
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.resourceLogs != null && w.hasOwnProperty("resourceLogs")) {
                                    if (!Array.isArray(w.resourceLogs)) return "resourceLogs: array expected";
                                    for (var $ = 0; $ < w.resourceLogs.length; ++$) {
                                        var j = r6.opentelemetry.proto.logs.v1.ResourceLogs.verify(w.resourceLogs[$]);
                                        if (j) return "resourceLogs." + j
                                    }
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest) return w;
                                var $ = new r6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
                                if (w.resourceLogs) {
                                    if (!Array.isArray(w.resourceLogs)) throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: array expected");
                                    $.resourceLogs = [];
                                    for (var j = 0; j < w.resourceLogs.length; ++j) {
                                        if (typeof w.resourceLogs[j] !== "object") throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: object expected");
                                        $.resourceLogs[j] = r6.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(w.resourceLogs[j])
                                    }
                                }
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.arrays || $.defaults) j.resourceLogs = [];
                                if (w.resourceLogs && w.resourceLogs.length) {
                                    j.resourceLogs = [];
                                    for (var H = 0; H < w.resourceLogs.length; ++H) j.resourceLogs[H] = r6.opentelemetry.proto.logs.v1.ResourceLogs.toObject(w.resourceLogs[H], $)
                                }
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest"
                            }, A
                        }(), Y.ExportLogsServiceResponse = function() {
                            function A(O) {
                                if (O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.partialSuccess = null, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.partialSuccess != null && Object.hasOwnProperty.call(w, "partialSuccess")) r6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.encode(w.partialSuccess, $.uint32(10).fork()).ldelim();
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            J.partialSuccess = r6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.decode(w, w.uint32());
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.partialSuccess != null && w.hasOwnProperty("partialSuccess")) {
                                    var $ = r6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.verify(w.partialSuccess);
                                    if ($) return "partialSuccess." + $
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse) return w;
                                var $ = new r6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;
                                if (w.partialSuccess != null) {
                                    if (typeof w.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse.partialSuccess: object expected");
                                    $.partialSuccess = r6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.fromObject(w.partialSuccess)
                                }
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.defaults) j.partialSuccess = null;
                                if (w.partialSuccess != null && w.hasOwnProperty("partialSuccess")) j.partialSuccess = r6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.toObject(w.partialSuccess, $);
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse"
                            }, A
                        }(), Y.ExportLogsPartialSuccess = function() {
                            function A(O) {
                                if (O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.rejectedLogRecords = null, A.prototype.errorMessage = null, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.rejectedLogRecords != null && Object.hasOwnProperty.call(w, "rejectedLogRecords")) $.uint32(8).int64(w.rejectedLogRecords);
                                if (w.errorMessage != null && Object.hasOwnProperty.call(w, "errorMessage")) $.uint32(18).string(w.errorMessage);
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            J.rejectedLogRecords = w.int64();
                                            break
                                        }
                                        case 2: {
                                            J.errorMessage = w.string();
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.rejectedLogRecords != null && w.hasOwnProperty("rejectedLogRecords")) {
                                    if (!t6.isInteger(w.rejectedLogRecords) && !(w.rejectedLogRecords && t6.isInteger(w.rejectedLogRecords.low) && t6.isInteger(w.rejectedLogRecords.high))) return "rejectedLogRecords: integer|Long expected"
                                }
                                if (w.errorMessage != null && w.hasOwnProperty("errorMessage")) {
                                    if (!t6.isString(w.errorMessage)) return "errorMessage: string expected"
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess) return w;
                                var $ = new r6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;
                                if (w.rejectedLogRecords != null) {
                                    if (t6.Long)($.rejectedLogRecords = t6.Long.fromValue(w.rejectedLogRecords)).unsigned = !1;
                                    else if (typeof w.rejectedLogRecords === "string") $.rejectedLogRecords = parseInt(w.rejectedLogRecords, 10);
                                    else if (typeof w.rejectedLogRecords === "number") $.rejectedLogRecords = w.rejectedLogRecords;
                                    else if (typeof w.rejectedLogRecords === "object") $.rejectedLogRecords = new t6.LongBits(w.rejectedLogRecords.low >>> 0, w.rejectedLogRecords.high >>> 0).toNumber()
                                }
                                if (w.errorMessage != null) $.errorMessage = String(w.errorMessage);
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.defaults) {
                                    if (t6.Long) {
                                        var H = new t6.Long(0, 0, !1);
                                        j.rejectedLogRecords = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                    } else j.rejectedLogRecords = $.longs === String ? "0" : 0;
                                    j.errorMessage = ""
                                }
                                if (w.rejectedLogRecords != null && w.hasOwnProperty("rejectedLogRecords"))
                                    if (typeof w.rejectedLogRecords === "number") j.rejectedLogRecords = $.longs === String ? String(w.rejectedLogRecords) : w.rejectedLogRecords;
                                    else j.rejectedLogRecords = $.longs === String ? t6.Long.prototype.toString.call(w.rejectedLogRecords) : $.longs === Number ? new t6.LongBits(w.rejectedLogRecords.low >>> 0, w.rejectedLogRecords.high >>> 0).toNumber() : w.rejectedLogRecords;
                                if (w.errorMessage != null && w.hasOwnProperty("errorMessage")) j.errorMessage = w.errorMessage;
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess"
                            }, A
                        }(), Y
                    }(), z
                }(), _
            }(), K.metrics = function() {
                var _ = {};
                return _.v1 = function() {
                    var z = {};
                    return z.MetricsData = function() {
                        function Y(A) {
                            if (this.resourceMetrics = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.resourceMetrics = t6.emptyArray, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.resourceMetrics != null && O.resourceMetrics.length)
                                for (var $ = 0; $ < O.resourceMetrics.length; ++$) r6.opentelemetry.proto.metrics.v1.ResourceMetrics.encode(O.resourceMetrics[$], w.uint32(10).fork()).ldelim();
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.metrics.v1.MetricsData;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(H.resourceMetrics && H.resourceMetrics.length)) H.resourceMetrics = [];
                                        H.resourceMetrics.push(r6.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(O, O.uint32()));
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.resourceMetrics != null && O.hasOwnProperty("resourceMetrics")) {
                                if (!Array.isArray(O.resourceMetrics)) return "resourceMetrics: array expected";
                                for (var w = 0; w < O.resourceMetrics.length; ++w) {
                                    var $ = r6.opentelemetry.proto.metrics.v1.ResourceMetrics.verify(O.resourceMetrics[w]);
                                    if ($) return "resourceMetrics." + $
                                }
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.metrics.v1.MetricsData) return O;
                            var w = new r6.opentelemetry.proto.metrics.v1.MetricsData;
                            if (O.resourceMetrics) {
                                if (!Array.isArray(O.resourceMetrics)) throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: array expected");
                                w.resourceMetrics = [];
                                for (var $ = 0; $ < O.resourceMetrics.length; ++$) {
                                    if (typeof O.resourceMetrics[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: object expected");
                                    w.resourceMetrics[$] = r6.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(O.resourceMetrics[$])
                                }
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.resourceMetrics = [];
                            if (O.resourceMetrics && O.resourceMetrics.length) {
                                $.resourceMetrics = [];
                                for (var j = 0; j < O.resourceMetrics.length; ++j) $.resourceMetrics[j] = r6.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(O.resourceMetrics[j], w)
                            }
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.MetricsData"
                        }, Y
                    }(), z.ResourceMetrics = function() {
                        function Y(A) {
                            if (this.scopeMetrics = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.resource = null, Y.prototype.scopeMetrics = t6.emptyArray, Y.prototype.schemaUrl = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.resource != null && Object.hasOwnProperty.call(O, "resource")) r6.opentelemetry.proto.resource.v1.Resource.encode(O.resource, w.uint32(10).fork()).ldelim();
                            if (O.scopeMetrics != null && O.scopeMetrics.length)
                                for (var $ = 0; $ < O.scopeMetrics.length; ++$) r6.opentelemetry.proto.metrics.v1.ScopeMetrics.encode(O.scopeMetrics[$], w.uint32(18).fork()).ldelim();
                            if (O.schemaUrl != null && Object.hasOwnProperty.call(O, "schemaUrl")) w.uint32(26).string(O.schemaUrl);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.metrics.v1.ResourceMetrics;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        H.resource = r6.opentelemetry.proto.resource.v1.Resource.decode(O, O.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(H.scopeMetrics && H.scopeMetrics.length)) H.scopeMetrics = [];
                                        H.scopeMetrics.push(r6.opentelemetry.proto.metrics.v1.ScopeMetrics.decode(O, O.uint32()));
                                        break
                                    }
                                    case 3: {
                                        H.schemaUrl = O.string();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.resource != null && O.hasOwnProperty("resource")) {
                                var w = r6.opentelemetry.proto.resource.v1.Resource.verify(O.resource);
                                if (w) return "resource." + w
                            }
                            if (O.scopeMetrics != null && O.hasOwnProperty("scopeMetrics")) {
                                if (!Array.isArray(O.scopeMetrics)) return "scopeMetrics: array expected";
                                for (var $ = 0; $ < O.scopeMetrics.length; ++$) {
                                    var w = r6.opentelemetry.proto.metrics.v1.ScopeMetrics.verify(O.scopeMetrics[$]);
                                    if (w) return "scopeMetrics." + w
                                }
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) {
                                if (!t6.isString(O.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.metrics.v1.ResourceMetrics) return O;
                            var w = new r6.opentelemetry.proto.metrics.v1.ResourceMetrics;
                            if (O.resource != null) {
                                if (typeof O.resource !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.resource: object expected");
                                w.resource = r6.opentelemetry.proto.resource.v1.Resource.fromObject(O.resource)
                            }
                            if (O.scopeMetrics) {
                                if (!Array.isArray(O.scopeMetrics)) throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: array expected");
                                w.scopeMetrics = [];
                                for (var $ = 0; $ < O.scopeMetrics.length; ++$) {
                                    if (typeof O.scopeMetrics[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: object expected");
                                    w.scopeMetrics[$] = r6.opentelemetry.proto.metrics.v1.ScopeMetrics.fromObject(O.scopeMetrics[$])
                                }
                            }
                            if (O.schemaUrl != null) w.schemaUrl = String(O.schemaUrl);
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.scopeMetrics = [];
                            if (w.defaults) $.resource = null, $.schemaUrl = "";
                            if (O.resource != null && O.hasOwnProperty("resource")) $.resource = r6.opentelemetry.proto.resource.v1.Resource.toObject(O.resource, w);
                            if (O.scopeMetrics && O.scopeMetrics.length) {
                                $.scopeMetrics = [];
                                for (var j = 0; j < O.scopeMetrics.length; ++j) $.scopeMetrics[j] = r6.opentelemetry.proto.metrics.v1.ScopeMetrics.toObject(O.scopeMetrics[j], w)
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) $.schemaUrl = O.schemaUrl;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.ResourceMetrics"
                        }, Y
                    }(), z.ScopeMetrics = function() {
                        function Y(A) {
                            if (this.metrics = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.scope = null, Y.prototype.metrics = t6.emptyArray, Y.prototype.schemaUrl = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.scope != null && Object.hasOwnProperty.call(O, "scope")) r6.opentelemetry.proto.common.v1.InstrumentationScope.encode(O.scope, w.uint32(10).fork()).ldelim();
                            if (O.metrics != null && O.metrics.length)
                                for (var $ = 0; $ < O.metrics.length; ++$) r6.opentelemetry.proto.metrics.v1.Metric.encode(O.metrics[$], w.uint32(18).fork()).ldelim();
                            if (O.schemaUrl != null && Object.hasOwnProperty.call(O, "schemaUrl")) w.uint32(26).string(O.schemaUrl);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.metrics.v1.ScopeMetrics;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        H.scope = r6.opentelemetry.proto.common.v1.InstrumentationScope.decode(O, O.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(H.metrics && H.metrics.length)) H.metrics = [];
                                        H.metrics.push(r6.opentelemetry.proto.metrics.v1.Metric.decode(O, O.uint32()));
                                        break
                                    }
                                    case 3: {
                                        H.schemaUrl = O.string();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.scope != null && O.hasOwnProperty("scope")) {
                                var w = r6.opentelemetry.proto.common.v1.InstrumentationScope.verify(O.scope);
                                if (w) return "scope." + w
                            }
                            if (O.metrics != null && O.hasOwnProperty("metrics")) {
                                if (!Array.isArray(O.metrics)) return "metrics: array expected";
                                for (var $ = 0; $ < O.metrics.length; ++$) {
                                    var w = r6.opentelemetry.proto.metrics.v1.Metric.verify(O.metrics[$]);
                                    if (w) return "metrics." + w
                                }
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) {
                                if (!t6.isString(O.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.metrics.v1.ScopeMetrics) return O;
                            var w = new r6.opentelemetry.proto.metrics.v1.ScopeMetrics;
                            if (O.scope != null) {
                                if (typeof O.scope !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.scope: object expected");
                                w.scope = r6.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(O.scope)
                            }
                            if (O.metrics) {
                                if (!Array.isArray(O.metrics)) throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: array expected");
                                w.metrics = [];
                                for (var $ = 0; $ < O.metrics.length; ++$) {
                                    if (typeof O.metrics[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: object expected");
                                    w.metrics[$] = r6.opentelemetry.proto.metrics.v1.Metric.fromObject(O.metrics[$])
                                }
                            }
                            if (O.schemaUrl != null) w.schemaUrl = String(O.schemaUrl);
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.metrics = [];
                            if (w.defaults) $.scope = null, $.schemaUrl = "";
                            if (O.scope != null && O.hasOwnProperty("scope")) $.scope = r6.opentelemetry.proto.common.v1.InstrumentationScope.toObject(O.scope, w);
                            if (O.metrics && O.metrics.length) {
                                $.metrics = [];
                                for (var j = 0; j < O.metrics.length; ++j) $.metrics[j] = r6.opentelemetry.proto.metrics.v1.Metric.toObject(O.metrics[j], w)
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) $.schemaUrl = O.schemaUrl;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.ScopeMetrics"
                        }, Y
                    }(), z.Metric = function() {
                        function Y(O) {
                            if (this.metadata = [], O) {
                                for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                    if (O[w[$]] != null) this[w[$]] = O[w[$]]
                            }
                        }
                        Y.prototype.name = null, Y.prototype.description = null, Y.prototype.unit = null, Y.prototype.gauge = null, Y.prototype.sum = null, Y.prototype.histogram = null, Y.prototype.exponentialHistogram = null, Y.prototype.summary = null, Y.prototype.metadata = t6.emptyArray;
                        var A;
                        return Object.defineProperty(Y.prototype, "data", {
                            get: t6.oneOfGetter(A = ["gauge", "sum", "histogram", "exponentialHistogram", "summary"]),
                            set: t6.oneOfSetter(A)
                        }), Y.create = function(w) {
                            return new Y(w)
                        }, Y.encode = function(w, $) {
                            if (!$) $ = t9.create();
                            if (w.name != null && Object.hasOwnProperty.call(w, "name")) $.uint32(10).string(w.name);
                            if (w.description != null && Object.hasOwnProperty.call(w, "description")) $.uint32(18).string(w.description);
                            if (w.unit != null && Object.hasOwnProperty.call(w, "unit")) $.uint32(26).string(w.unit);
                            if (w.gauge != null && Object.hasOwnProperty.call(w, "gauge")) r6.opentelemetry.proto.metrics.v1.Gauge.encode(w.gauge, $.uint32(42).fork()).ldelim();
                            if (w.sum != null && Object.hasOwnProperty.call(w, "sum")) r6.opentelemetry.proto.metrics.v1.Sum.encode(w.sum, $.uint32(58).fork()).ldelim();
                            if (w.histogram != null && Object.hasOwnProperty.call(w, "histogram")) r6.opentelemetry.proto.metrics.v1.Histogram.encode(w.histogram, $.uint32(74).fork()).ldelim();
                            if (w.exponentialHistogram != null && Object.hasOwnProperty.call(w, "exponentialHistogram")) r6.opentelemetry.proto.metrics.v1.ExponentialHistogram.encode(w.exponentialHistogram, $.uint32(82).fork()).ldelim();
                            if (w.summary != null && Object.hasOwnProperty.call(w, "summary")) r6.opentelemetry.proto.metrics.v1.Summary.encode(w.summary, $.uint32(90).fork()).ldelim();
                            if (w.metadata != null && w.metadata.length)
                                for (var j = 0; j < w.metadata.length; ++j) r6.opentelemetry.proto.common.v1.KeyValue.encode(w.metadata[j], $.uint32(98).fork()).ldelim();
                            return $
                        }, Y.encodeDelimited = function(w, $) {
                            return this.encode(w, $).ldelim()
                        }, Y.decode = function(w, $, j) {
                            if (!(w instanceof S1)) w = S1.create(w);
                            var H = $ === void 0 ? w.len : w.pos + $,
                                J = new r6.opentelemetry.proto.metrics.v1.Metric;
                            while (w.pos < H) {
                                var X = w.uint32();
                                if (X === j) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.name = w.string();
                                        break
                                    }
                                    case 2: {
                                        J.description = w.string();
                                        break
                                    }
                                    case 3: {
                                        J.unit = w.string();
                                        break
                                    }
                                    case 5: {
                                        J.gauge = r6.opentelemetry.proto.metrics.v1.Gauge.decode(w, w.uint32());
                                        break
                                    }
                                    case 7: {
                                        J.sum = r6.opentelemetry.proto.metrics.v1.Sum.decode(w, w.uint32());
                                        break
                                    }
                                    case 9: {
                                        J.histogram = r6.opentelemetry.proto.metrics.v1.Histogram.decode(w, w.uint32());
                                        break
                                    }
                                    case 10: {
                                        J.exponentialHistogram = r6.opentelemetry.proto.metrics.v1.ExponentialHistogram.decode(w, w.uint32());
                                        break
                                    }
                                    case 11: {
                                        J.summary = r6.opentelemetry.proto.metrics.v1.Summary.decode(w, w.uint32());
                                        break
                                    }
                                    case 12: {
                                        if (!(J.metadata && J.metadata.length)) J.metadata = [];
                                        J.metadata.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    default:
                                        w.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, Y.decodeDelimited = function(w) {
                            if (!(w instanceof S1)) w = new S1(w);
                            return this.decode(w, w.uint32())
                        }, Y.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            var $ = {};
                            if (w.name != null && w.hasOwnProperty("name")) {
                                if (!t6.isString(w.name)) return "name: string expected"
                            }
                            if (w.description != null && w.hasOwnProperty("description")) {
                                if (!t6.isString(w.description)) return "description: string expected"
                            }
                            if (w.unit != null && w.hasOwnProperty("unit")) {
                                if (!t6.isString(w.unit)) return "unit: string expected"
                            }
                            if (w.gauge != null && w.hasOwnProperty("gauge")) {
                                $.data = 1;
                                {
                                    var j = r6.opentelemetry.proto.metrics.v1.Gauge.verify(w.gauge);
                                    if (j) return "gauge." + j
                                }
                            }
                            if (w.sum != null && w.hasOwnProperty("sum")) {
                                if ($.data === 1) return "data: multiple values";
                                $.data = 1;
                                {
                                    var j = r6.opentelemetry.proto.metrics.v1.Sum.verify(w.sum);
                                    if (j) return "sum." + j
                                }
                            }
                            if (w.histogram != null && w.hasOwnProperty("histogram")) {
                                if ($.data === 1) return "data: multiple values";
                                $.data = 1;
                                {
                                    var j = r6.opentelemetry.proto.metrics.v1.Histogram.verify(w.histogram);
                                    if (j) return "histogram." + j
                                }
                            }
                            if (w.exponentialHistogram != null && w.hasOwnProperty("exponentialHistogram")) {
                                if ($.data === 1) return "data: multiple values";
                                $.data = 1;
                                {
                                    var j = r6.opentelemetry.proto.metrics.v1.ExponentialHistogram.verify(w.exponentialHistogram);
                                    if (j) return "exponentialHistogram." + j
                                }
                            }
                            if (w.summary != null && w.hasOwnProperty("summary")) {
                                if ($.data === 1) return "data: multiple values";
                                $.data = 1;
                                {
                                    var j = r6.opentelemetry.proto.metrics.v1.Summary.verify(w.summary);
                                    if (j) return "summary." + j
                                }
                            }
                            if (w.metadata != null && w.hasOwnProperty("metadata")) {
                                if (!Array.isArray(w.metadata)) return "metadata: array expected";
                                for (var H = 0; H < w.metadata.length; ++H) {
                                    var j = r6.opentelemetry.proto.common.v1.KeyValue.verify(w.metadata[H]);
                                    if (j) return "metadata." + j
                                }
                            }
                            return null
                        }, Y.fromObject = function(w) {
                            if (w instanceof r6.opentelemetry.proto.metrics.v1.Metric) return w;
                            var $ = new r6.opentelemetry.proto.metrics.v1.Metric;
                            if (w.name != null) $.name = String(w.name);
                            if (w.description != null) $.description = String(w.description);
                            if (w.unit != null) $.unit = String(w.unit);
                            if (w.gauge != null) {
                                if (typeof w.gauge !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.gauge: object expected");
                                $.gauge = r6.opentelemetry.proto.metrics.v1.Gauge.fromObject(w.gauge)
                            }
                            if (w.sum != null) {
                                if (typeof w.sum !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.sum: object expected");
                                $.sum = r6.opentelemetry.proto.metrics.v1.Sum.fromObject(w.sum)
                            }
                            if (w.histogram != null) {
                                if (typeof w.histogram !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.histogram: object expected");
                                $.histogram = r6.opentelemetry.proto.metrics.v1.Histogram.fromObject(w.histogram)
                            }
                            if (w.exponentialHistogram != null) {
                                if (typeof w.exponentialHistogram !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.exponentialHistogram: object expected");
                                $.exponentialHistogram = r6.opentelemetry.proto.metrics.v1.ExponentialHistogram.fromObject(w.exponentialHistogram)
                            }
                            if (w.summary != null) {
                                if (typeof w.summary !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.summary: object expected");
                                $.summary = r6.opentelemetry.proto.metrics.v1.Summary.fromObject(w.summary)
                            }
                            if (w.metadata) {
                                if (!Array.isArray(w.metadata)) throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: array expected");
                                $.metadata = [];
                                for (var j = 0; j < w.metadata.length; ++j) {
                                    if (typeof w.metadata[j] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: object expected");
                                    $.metadata[j] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.metadata[j])
                                }
                            }
                            return $
                        }, Y.toObject = function(w, $) {
                            if (!$) $ = {};
                            var j = {};
                            if ($.arrays || $.defaults) j.metadata = [];
                            if ($.defaults) j.name = "", j.description = "", j.unit = "";
                            if (w.name != null && w.hasOwnProperty("name")) j.name = w.name;
                            if (w.description != null && w.hasOwnProperty("description")) j.description = w.description;
                            if (w.unit != null && w.hasOwnProperty("unit")) j.unit = w.unit;
                            if (w.gauge != null && w.hasOwnProperty("gauge")) {
                                if (j.gauge = r6.opentelemetry.proto.metrics.v1.Gauge.toObject(w.gauge, $), $.oneofs) j.data = "gauge"
                            }
                            if (w.sum != null && w.hasOwnProperty("sum")) {
                                if (j.sum = r6.opentelemetry.proto.metrics.v1.Sum.toObject(w.sum, $), $.oneofs) j.data = "sum"
                            }
                            if (w.histogram != null && w.hasOwnProperty("histogram")) {
                                if (j.histogram = r6.opentelemetry.proto.metrics.v1.Histogram.toObject(w.histogram, $), $.oneofs) j.data = "histogram"
                            }
                            if (w.exponentialHistogram != null && w.hasOwnProperty("exponentialHistogram")) {
                                if (j.exponentialHistogram = r6.opentelemetry.proto.metrics.v1.ExponentialHistogram.toObject(w.exponentialHistogram, $), $.oneofs) j.data = "exponentialHistogram"
                            }
                            if (w.summary != null && w.hasOwnProperty("summary")) {
                                if (j.summary = r6.opentelemetry.proto.metrics.v1.Summary.toObject(w.summary, $), $.oneofs) j.data = "summary"
                            }
                            if (w.metadata && w.metadata.length) {
                                j.metadata = [];
                                for (var H = 0; H < w.metadata.length; ++H) j.metadata[H] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(w.metadata[H], $)
                            }
                            return j
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.Metric"
                        }, Y
                    }(), z.Gauge = function() {
                        function Y(A) {
                            if (this.dataPoints = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.dataPoints = t6.emptyArray, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.dataPoints != null && O.dataPoints.length)
                                for (var $ = 0; $ < O.dataPoints.length; ++$) r6.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(O.dataPoints[$], w.uint32(10).fork()).ldelim();
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.metrics.v1.Gauge;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(H.dataPoints && H.dataPoints.length)) H.dataPoints = [];
                                        H.dataPoints.push(r6.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(O, O.uint32()));
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.dataPoints != null && O.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(O.dataPoints)) return "dataPoints: array expected";
                                for (var w = 0; w < O.dataPoints.length; ++w) {
                                    var $ = r6.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(O.dataPoints[w]);
                                    if ($) return "dataPoints." + $
                                }
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.metrics.v1.Gauge) return O;
                            var w = new r6.opentelemetry.proto.metrics.v1.Gauge;
                            if (O.dataPoints) {
                                if (!Array.isArray(O.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: array expected");
                                w.dataPoints = [];
                                for (var $ = 0; $ < O.dataPoints.length; ++$) {
                                    if (typeof O.dataPoints[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: object expected");
                                    w.dataPoints[$] = r6.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(O.dataPoints[$])
                                }
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.dataPoints = [];
                            if (O.dataPoints && O.dataPoints.length) {
                                $.dataPoints = [];
                                for (var j = 0; j < O.dataPoints.length; ++j) $.dataPoints[j] = r6.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(O.dataPoints[j], w)
                            }
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.Gauge"
                        }, Y
                    }(), z.Sum = function() {
                        function Y(A) {
                            if (this.dataPoints = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.dataPoints = t6.emptyArray, Y.prototype.aggregationTemporality = null, Y.prototype.isMonotonic = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.dataPoints != null && O.dataPoints.length)
                                for (var $ = 0; $ < O.dataPoints.length; ++$) r6.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(O.dataPoints[$], w.uint32(10).fork()).ldelim();
                            if (O.aggregationTemporality != null && Object.hasOwnProperty.call(O, "aggregationTemporality")) w.uint32(16).int32(O.aggregationTemporality);
                            if (O.isMonotonic != null && Object.hasOwnProperty.call(O, "isMonotonic")) w.uint32(24).bool(O.isMonotonic);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.metrics.v1.Sum;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(H.dataPoints && H.dataPoints.length)) H.dataPoints = [];
                                        H.dataPoints.push(r6.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(O, O.uint32()));
                                        break
                                    }
                                    case 2: {
                                        H.aggregationTemporality = O.int32();
                                        break
                                    }
                                    case 3: {
                                        H.isMonotonic = O.bool();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.dataPoints != null && O.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(O.dataPoints)) return "dataPoints: array expected";
                                for (var w = 0; w < O.dataPoints.length; ++w) {
                                    var $ = r6.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(O.dataPoints[w]);
                                    if ($) return "dataPoints." + $
                                }
                            }
                            if (O.aggregationTemporality != null && O.hasOwnProperty("aggregationTemporality")) switch (O.aggregationTemporality) {
                                default:
                                    return "aggregationTemporality: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            if (O.isMonotonic != null && O.hasOwnProperty("isMonotonic")) {
                                if (typeof O.isMonotonic !== "boolean") return "isMonotonic: boolean expected"
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.metrics.v1.Sum) return O;
                            var w = new r6.opentelemetry.proto.metrics.v1.Sum;
                            if (O.dataPoints) {
                                if (!Array.isArray(O.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: array expected");
                                w.dataPoints = [];
                                for (var $ = 0; $ < O.dataPoints.length; ++$) {
                                    if (typeof O.dataPoints[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: object expected");
                                    w.dataPoints[$] = r6.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(O.dataPoints[$])
                                }
                            }
                            switch (O.aggregationTemporality) {
                                default:
                                    if (typeof O.aggregationTemporality === "number") {
                                        w.aggregationTemporality = O.aggregationTemporality;
                                        break
                                    }
                                    break;
                                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                                case 0:
                                    w.aggregationTemporality = 0;
                                    break;
                                case "AGGREGATION_TEMPORALITY_DELTA":
                                case 1:
                                    w.aggregationTemporality = 1;
                                    break;
                                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                                case 2:
                                    w.aggregationTemporality = 2;
                                    break
                            }
                            if (O.isMonotonic != null) w.isMonotonic = Boolean(O.isMonotonic);
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.dataPoints = [];
                            if (w.defaults) $.aggregationTemporality = w.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0, $.isMonotonic = !1;
                            if (O.dataPoints && O.dataPoints.length) {
                                $.dataPoints = [];
                                for (var j = 0; j < O.dataPoints.length; ++j) $.dataPoints[j] = r6.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(O.dataPoints[j], w)
                            }
                            if (O.aggregationTemporality != null && O.hasOwnProperty("aggregationTemporality")) $.aggregationTemporality = w.enums === String ? r6.opentelemetry.proto.metrics.v1.AggregationTemporality[O.aggregationTemporality] === void 0 ? O.aggregationTemporality : r6.opentelemetry.proto.metrics.v1.AggregationTemporality[O.aggregationTemporality] : O.aggregationTemporality;
                            if (O.isMonotonic != null && O.hasOwnProperty("isMonotonic")) $.isMonotonic = O.isMonotonic;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.Sum"
                        }, Y
                    }(), z.Histogram = function() {
                        function Y(A) {
                            if (this.dataPoints = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.dataPoints = t6.emptyArray, Y.prototype.aggregationTemporality = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.dataPoints != null && O.dataPoints.length)
                                for (var $ = 0; $ < O.dataPoints.length; ++$) r6.opentelemetry.proto.metrics.v1.HistogramDataPoint.encode(O.dataPoints[$], w.uint32(10).fork()).ldelim();
                            if (O.aggregationTemporality != null && Object.hasOwnProperty.call(O, "aggregationTemporality")) w.uint32(16).int32(O.aggregationTemporality);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.metrics.v1.Histogram;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(H.dataPoints && H.dataPoints.length)) H.dataPoints = [];
                                        H.dataPoints.push(r6.opentelemetry.proto.metrics.v1.HistogramDataPoint.decode(O, O.uint32()));
                                        break
                                    }
                                    case 2: {
                                        H.aggregationTemporality = O.int32();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.dataPoints != null && O.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(O.dataPoints)) return "dataPoints: array expected";
                                for (var w = 0; w < O.dataPoints.length; ++w) {
                                    var $ = r6.opentelemetry.proto.metrics.v1.HistogramDataPoint.verify(O.dataPoints[w]);
                                    if ($) return "dataPoints." + $
                                }
                            }
                            if (O.aggregationTemporality != null && O.hasOwnProperty("aggregationTemporality")) switch (O.aggregationTemporality) {
                                default:
                                    return "aggregationTemporality: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.metrics.v1.Histogram) return O;
                            var w = new r6.opentelemetry.proto.metrics.v1.Histogram;
                            if (O.dataPoints) {
                                if (!Array.isArray(O.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: array expected");
                                w.dataPoints = [];
                                for (var $ = 0; $ < O.dataPoints.length; ++$) {
                                    if (typeof O.dataPoints[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: object expected");
                                    w.dataPoints[$] = r6.opentelemetry.proto.metrics.v1.HistogramDataPoint.fromObject(O.dataPoints[$])
                                }
                            }
                            switch (O.aggregationTemporality) {
                                default:
                                    if (typeof O.aggregationTemporality === "number") {
                                        w.aggregationTemporality = O.aggregationTemporality;
                                        break
                                    }
                                    break;
                                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                                case 0:
                                    w.aggregationTemporality = 0;
                                    break;
                                case "AGGREGATION_TEMPORALITY_DELTA":
                                case 1:
                                    w.aggregationTemporality = 1;
                                    break;
                                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                                case 2:
                                    w.aggregationTemporality = 2;
                                    break
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.dataPoints = [];
                            if (w.defaults) $.aggregationTemporality = w.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
                            if (O.dataPoints && O.dataPoints.length) {
                                $.dataPoints = [];
                                for (var j = 0; j < O.dataPoints.length; ++j) $.dataPoints[j] = r6.opentelemetry.proto.metrics.v1.HistogramDataPoint.toObject(O.dataPoints[j], w)
                            }
                            if (O.aggregationTemporality != null && O.hasOwnProperty("aggregationTemporality")) $.aggregationTemporality = w.enums === String ? r6.opentelemetry.proto.metrics.v1.AggregationTemporality[O.aggregationTemporality] === void 0 ? O.aggregationTemporality : r6.opentelemetry.proto.metrics.v1.AggregationTemporality[O.aggregationTemporality] : O.aggregationTemporality;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.Histogram"
                        }, Y
                    }(), z.ExponentialHistogram = function() {
                        function Y(A) {
                            if (this.dataPoints = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.dataPoints = t6.emptyArray, Y.prototype.aggregationTemporality = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.dataPoints != null && O.dataPoints.length)
                                for (var $ = 0; $ < O.dataPoints.length; ++$) r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.encode(O.dataPoints[$], w.uint32(10).fork()).ldelim();
                            if (O.aggregationTemporality != null && Object.hasOwnProperty.call(O, "aggregationTemporality")) w.uint32(16).int32(O.aggregationTemporality);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.metrics.v1.ExponentialHistogram;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(H.dataPoints && H.dataPoints.length)) H.dataPoints = [];
                                        H.dataPoints.push(r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.decode(O, O.uint32()));
                                        break
                                    }
                                    case 2: {
                                        H.aggregationTemporality = O.int32();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.dataPoints != null && O.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(O.dataPoints)) return "dataPoints: array expected";
                                for (var w = 0; w < O.dataPoints.length; ++w) {
                                    var $ = r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.verify(O.dataPoints[w]);
                                    if ($) return "dataPoints." + $
                                }
                            }
                            if (O.aggregationTemporality != null && O.hasOwnProperty("aggregationTemporality")) switch (O.aggregationTemporality) {
                                default:
                                    return "aggregationTemporality: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.metrics.v1.ExponentialHistogram) return O;
                            var w = new r6.opentelemetry.proto.metrics.v1.ExponentialHistogram;
                            if (O.dataPoints) {
                                if (!Array.isArray(O.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: array expected");
                                w.dataPoints = [];
                                for (var $ = 0; $ < O.dataPoints.length; ++$) {
                                    if (typeof O.dataPoints[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: object expected");
                                    w.dataPoints[$] = r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.fromObject(O.dataPoints[$])
                                }
                            }
                            switch (O.aggregationTemporality) {
                                default:
                                    if (typeof O.aggregationTemporality === "number") {
                                        w.aggregationTemporality = O.aggregationTemporality;
                                        break
                                    }
                                    break;
                                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                                case 0:
                                    w.aggregationTemporality = 0;
                                    break;
                                case "AGGREGATION_TEMPORALITY_DELTA":
                                case 1:
                                    w.aggregationTemporality = 1;
                                    break;
                                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                                case 2:
                                    w.aggregationTemporality = 2;
                                    break
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.dataPoints = [];
                            if (w.defaults) $.aggregationTemporality = w.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
                            if (O.dataPoints && O.dataPoints.length) {
                                $.dataPoints = [];
                                for (var j = 0; j < O.dataPoints.length; ++j) $.dataPoints[j] = r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.toObject(O.dataPoints[j], w)
                            }
                            if (O.aggregationTemporality != null && O.hasOwnProperty("aggregationTemporality")) $.aggregationTemporality = w.enums === String ? r6.opentelemetry.proto.metrics.v1.AggregationTemporality[O.aggregationTemporality] === void 0 ? O.aggregationTemporality : r6.opentelemetry.proto.metrics.v1.AggregationTemporality[O.aggregationTemporality] : O.aggregationTemporality;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.ExponentialHistogram"
                        }, Y
                    }(), z.Summary = function() {
                        function Y(A) {
                            if (this.dataPoints = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.dataPoints = t6.emptyArray, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.dataPoints != null && O.dataPoints.length)
                                for (var $ = 0; $ < O.dataPoints.length; ++$) r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.encode(O.dataPoints[$], w.uint32(10).fork()).ldelim();
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.metrics.v1.Summary;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(H.dataPoints && H.dataPoints.length)) H.dataPoints = [];
                                        H.dataPoints.push(r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.decode(O, O.uint32()));
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.dataPoints != null && O.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(O.dataPoints)) return "dataPoints: array expected";
                                for (var w = 0; w < O.dataPoints.length; ++w) {
                                    var $ = r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.verify(O.dataPoints[w]);
                                    if ($) return "dataPoints." + $
                                }
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.metrics.v1.Summary) return O;
                            var w = new r6.opentelemetry.proto.metrics.v1.Summary;
                            if (O.dataPoints) {
                                if (!Array.isArray(O.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: array expected");
                                w.dataPoints = [];
                                for (var $ = 0; $ < O.dataPoints.length; ++$) {
                                    if (typeof O.dataPoints[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: object expected");
                                    w.dataPoints[$] = r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.fromObject(O.dataPoints[$])
                                }
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.dataPoints = [];
                            if (O.dataPoints && O.dataPoints.length) {
                                $.dataPoints = [];
                                for (var j = 0; j < O.dataPoints.length; ++j) $.dataPoints[j] = r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.toObject(O.dataPoints[j], w)
                            }
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.Summary"
                        }, Y
                    }(), z.AggregationTemporality = function() {
                        var Y = {},
                            A = Object.create(Y);
                        return A[Y[0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED"] = 0, A[Y[1] = "AGGREGATION_TEMPORALITY_DELTA"] = 1, A[Y[2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"] = 2, A
                    }(), z.DataPointFlags = function() {
                        var Y = {},
                            A = Object.create(Y);
                        return A[Y[0] = "DATA_POINT_FLAGS_DO_NOT_USE"] = 0, A[Y[1] = "DATA_POINT_FLAGS_NO_RECORDED_VALUE_MASK"] = 1, A
                    }(), z.NumberDataPoint = function() {
                        function Y(O) {
                            if (this.attributes = [], this.exemplars = [], O) {
                                for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                    if (O[w[$]] != null) this[w[$]] = O[w[$]]
                            }
                        }
                        Y.prototype.attributes = t6.emptyArray, Y.prototype.startTimeUnixNano = null, Y.prototype.timeUnixNano = null, Y.prototype.asDouble = null, Y.prototype.asInt = null, Y.prototype.exemplars = t6.emptyArray, Y.prototype.flags = null;
                        var A;
                        return Object.defineProperty(Y.prototype, "value", {
                            get: t6.oneOfGetter(A = ["asDouble", "asInt"]),
                            set: t6.oneOfSetter(A)
                        }), Y.create = function(w) {
                            return new Y(w)
                        }, Y.encode = function(w, $) {
                            if (!$) $ = t9.create();
                            if (w.startTimeUnixNano != null && Object.hasOwnProperty.call(w, "startTimeUnixNano")) $.uint32(17).fixed64(w.startTimeUnixNano);
                            if (w.timeUnixNano != null && Object.hasOwnProperty.call(w, "timeUnixNano")) $.uint32(25).fixed64(w.timeUnixNano);
                            if (w.asDouble != null && Object.hasOwnProperty.call(w, "asDouble")) $.uint32(33).double(w.asDouble);
                            if (w.exemplars != null && w.exemplars.length)
                                for (var j = 0; j < w.exemplars.length; ++j) r6.opentelemetry.proto.metrics.v1.Exemplar.encode(w.exemplars[j], $.uint32(42).fork()).ldelim();
                            if (w.asInt != null && Object.hasOwnProperty.call(w, "asInt")) $.uint32(49).sfixed64(w.asInt);
                            if (w.attributes != null && w.attributes.length)
                                for (var j = 0; j < w.attributes.length; ++j) r6.opentelemetry.proto.common.v1.KeyValue.encode(w.attributes[j], $.uint32(58).fork()).ldelim();
                            if (w.flags != null && Object.hasOwnProperty.call(w, "flags")) $.uint32(64).uint32(w.flags);
                            return $
                        }, Y.encodeDelimited = function(w, $) {
                            return this.encode(w, $).ldelim()
                        }, Y.decode = function(w, $, j) {
                            if (!(w instanceof S1)) w = S1.create(w);
                            var H = $ === void 0 ? w.len : w.pos + $,
                                J = new r6.opentelemetry.proto.metrics.v1.NumberDataPoint;
                            while (w.pos < H) {
                                var X = w.uint32();
                                if (X === j) break;
                                switch (X >>> 3) {
                                    case 7: {
                                        if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                        J.attributes.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.startTimeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 3: {
                                        J.timeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 4: {
                                        J.asDouble = w.double();
                                        break
                                    }
                                    case 6: {
                                        J.asInt = w.sfixed64();
                                        break
                                    }
                                    case 5: {
                                        if (!(J.exemplars && J.exemplars.length)) J.exemplars = [];
                                        J.exemplars.push(r6.opentelemetry.proto.metrics.v1.Exemplar.decode(w, w.uint32()));
                                        break
                                    }
                                    case 8: {
                                        J.flags = w.uint32();
                                        break
                                    }
                                    default:
                                        w.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, Y.decodeDelimited = function(w) {
                            if (!(w instanceof S1)) w = new S1(w);
                            return this.decode(w, w.uint32())
                        }, Y.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            var $ = {};
                            if (w.attributes != null && w.hasOwnProperty("attributes")) {
                                if (!Array.isArray(w.attributes)) return "attributes: array expected";
                                for (var j = 0; j < w.attributes.length; ++j) {
                                    var H = r6.opentelemetry.proto.common.v1.KeyValue.verify(w.attributes[j]);
                                    if (H) return "attributes." + H
                                }
                            }
                            if (w.startTimeUnixNano != null && w.hasOwnProperty("startTimeUnixNano")) {
                                if (!t6.isInteger(w.startTimeUnixNano) && !(w.startTimeUnixNano && t6.isInteger(w.startTimeUnixNano.low) && t6.isInteger(w.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano")) {
                                if (!t6.isInteger(w.timeUnixNano) && !(w.timeUnixNano && t6.isInteger(w.timeUnixNano.low) && t6.isInteger(w.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (w.asDouble != null && w.hasOwnProperty("asDouble")) {
                                if ($.value = 1, typeof w.asDouble !== "number") return "asDouble: number expected"
                            }
                            if (w.asInt != null && w.hasOwnProperty("asInt")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, !t6.isInteger(w.asInt) && !(w.asInt && t6.isInteger(w.asInt.low) && t6.isInteger(w.asInt.high))) return "asInt: integer|Long expected"
                            }
                            if (w.exemplars != null && w.hasOwnProperty("exemplars")) {
                                if (!Array.isArray(w.exemplars)) return "exemplars: array expected";
                                for (var j = 0; j < w.exemplars.length; ++j) {
                                    var H = r6.opentelemetry.proto.metrics.v1.Exemplar.verify(w.exemplars[j]);
                                    if (H) return "exemplars." + H
                                }
                            }
                            if (w.flags != null && w.hasOwnProperty("flags")) {
                                if (!t6.isInteger(w.flags)) return "flags: integer expected"
                            }
                            return null
                        }, Y.fromObject = function(w) {
                            if (w instanceof r6.opentelemetry.proto.metrics.v1.NumberDataPoint) return w;
                            var $ = new r6.opentelemetry.proto.metrics.v1.NumberDataPoint;
                            if (w.attributes) {
                                if (!Array.isArray(w.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: array expected");
                                $.attributes = [];
                                for (var j = 0; j < w.attributes.length; ++j) {
                                    if (typeof w.attributes[j] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: object expected");
                                    $.attributes[j] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.attributes[j])
                                }
                            }
                            if (w.startTimeUnixNano != null) {
                                if (t6.Long)($.startTimeUnixNano = t6.Long.fromValue(w.startTimeUnixNano)).unsigned = !1;
                                else if (typeof w.startTimeUnixNano === "string") $.startTimeUnixNano = parseInt(w.startTimeUnixNano, 10);
                                else if (typeof w.startTimeUnixNano === "number") $.startTimeUnixNano = w.startTimeUnixNano;
                                else if (typeof w.startTimeUnixNano === "object") $.startTimeUnixNano = new t6.LongBits(w.startTimeUnixNano.low >>> 0, w.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.timeUnixNano != null) {
                                if (t6.Long)($.timeUnixNano = t6.Long.fromValue(w.timeUnixNano)).unsigned = !1;
                                else if (typeof w.timeUnixNano === "string") $.timeUnixNano = parseInt(w.timeUnixNano, 10);
                                else if (typeof w.timeUnixNano === "number") $.timeUnixNano = w.timeUnixNano;
                                else if (typeof w.timeUnixNano === "object") $.timeUnixNano = new t6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.asDouble != null) $.asDouble = Number(w.asDouble);
                            if (w.asInt != null) {
                                if (t6.Long)($.asInt = t6.Long.fromValue(w.asInt)).unsigned = !1;
                                else if (typeof w.asInt === "string") $.asInt = parseInt(w.asInt, 10);
                                else if (typeof w.asInt === "number") $.asInt = w.asInt;
                                else if (typeof w.asInt === "object") $.asInt = new t6.LongBits(w.asInt.low >>> 0, w.asInt.high >>> 0).toNumber()
                            }
                            if (w.exemplars) {
                                if (!Array.isArray(w.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: array expected");
                                $.exemplars = [];
                                for (var j = 0; j < w.exemplars.length; ++j) {
                                    if (typeof w.exemplars[j] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: object expected");
                                    $.exemplars[j] = r6.opentelemetry.proto.metrics.v1.Exemplar.fromObject(w.exemplars[j])
                                }
                            }
                            if (w.flags != null) $.flags = w.flags >>> 0;
                            return $
                        }, Y.toObject = function(w, $) {
                            if (!$) $ = {};
                            var j = {};
                            if ($.arrays || $.defaults) j.exemplars = [], j.attributes = [];
                            if ($.defaults) {
                                if (t6.Long) {
                                    var H = new t6.Long(0, 0, !1);
                                    j.startTimeUnixNano = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                } else j.startTimeUnixNano = $.longs === String ? "0" : 0;
                                if (t6.Long) {
                                    var H = new t6.Long(0, 0, !1);
                                    j.timeUnixNano = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                } else j.timeUnixNano = $.longs === String ? "0" : 0;
                                j.flags = 0
                            }
                            if (w.startTimeUnixNano != null && w.hasOwnProperty("startTimeUnixNano"))
                                if (typeof w.startTimeUnixNano === "number") j.startTimeUnixNano = $.longs === String ? String(w.startTimeUnixNano) : w.startTimeUnixNano;
                                else j.startTimeUnixNano = $.longs === String ? t6.Long.prototype.toString.call(w.startTimeUnixNano) : $.longs === Number ? new t6.LongBits(w.startTimeUnixNano.low >>> 0, w.startTimeUnixNano.high >>> 0).toNumber() : w.startTimeUnixNano;
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano"))
                                if (typeof w.timeUnixNano === "number") j.timeUnixNano = $.longs === String ? String(w.timeUnixNano) : w.timeUnixNano;
                                else j.timeUnixNano = $.longs === String ? t6.Long.prototype.toString.call(w.timeUnixNano) : $.longs === Number ? new t6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber() : w.timeUnixNano;
                            if (w.asDouble != null && w.hasOwnProperty("asDouble")) {
                                if (j.asDouble = $.json && !isFinite(w.asDouble) ? String(w.asDouble) : w.asDouble, $.oneofs) j.value = "asDouble"
                            }
                            if (w.exemplars && w.exemplars.length) {
                                j.exemplars = [];
                                for (var J = 0; J < w.exemplars.length; ++J) j.exemplars[J] = r6.opentelemetry.proto.metrics.v1.Exemplar.toObject(w.exemplars[J], $)
                            }
                            if (w.asInt != null && w.hasOwnProperty("asInt")) {
                                if (typeof w.asInt === "number") j.asInt = $.longs === String ? String(w.asInt) : w.asInt;
                                else j.asInt = $.longs === String ? t6.Long.prototype.toString.call(w.asInt) : $.longs === Number ? new t6.LongBits(w.asInt.low >>> 0, w.asInt.high >>> 0).toNumber() : w.asInt;
                                if ($.oneofs) j.value = "asInt"
                            }
                            if (w.attributes && w.attributes.length) {
                                j.attributes = [];
                                for (var J = 0; J < w.attributes.length; ++J) j.attributes[J] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(w.attributes[J], $)
                            }
                            if (w.flags != null && w.hasOwnProperty("flags")) j.flags = w.flags;
                            return j
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.NumberDataPoint"
                        }, Y
                    }(), z.HistogramDataPoint = function() {
                        function Y(O) {
                            if (this.attributes = [], this.bucketCounts = [], this.explicitBounds = [], this.exemplars = [], O) {
                                for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                    if (O[w[$]] != null) this[w[$]] = O[w[$]]
                            }
                        }
                        Y.prototype.attributes = t6.emptyArray, Y.prototype.startTimeUnixNano = null, Y.prototype.timeUnixNano = null, Y.prototype.count = null, Y.prototype.sum = null, Y.prototype.bucketCounts = t6.emptyArray, Y.prototype.explicitBounds = t6.emptyArray, Y.prototype.exemplars = t6.emptyArray, Y.prototype.flags = null, Y.prototype.min = null, Y.prototype.max = null;
                        var A;
                        return Object.defineProperty(Y.prototype, "_sum", {
                            get: t6.oneOfGetter(A = ["sum"]),
                            set: t6.oneOfSetter(A)
                        }), Object.defineProperty(Y.prototype, "_min", {
                            get: t6.oneOfGetter(A = ["min"]),
                            set: t6.oneOfSetter(A)
                        }), Object.defineProperty(Y.prototype, "_max", {
                            get: t6.oneOfGetter(A = ["max"]),
                            set: t6.oneOfSetter(A)
                        }), Y.create = function(w) {
                            return new Y(w)
                        }, Y.encode = function(w, $) {
                            if (!$) $ = t9.create();
                            if (w.startTimeUnixNano != null && Object.hasOwnProperty.call(w, "startTimeUnixNano")) $.uint32(17).fixed64(w.startTimeUnixNano);
                            if (w.timeUnixNano != null && Object.hasOwnProperty.call(w, "timeUnixNano")) $.uint32(25).fixed64(w.timeUnixNano);
                            if (w.count != null && Object.hasOwnProperty.call(w, "count")) $.uint32(33).fixed64(w.count);
                            if (w.sum != null && Object.hasOwnProperty.call(w, "sum")) $.uint32(41).double(w.sum);
                            if (w.bucketCounts != null && w.bucketCounts.length) {
                                $.uint32(50).fork();
                                for (var j = 0; j < w.bucketCounts.length; ++j) $.fixed64(w.bucketCounts[j]);
                                $.ldelim()
                            }
                            if (w.explicitBounds != null && w.explicitBounds.length) {
                                $.uint32(58).fork();
                                for (var j = 0; j < w.explicitBounds.length; ++j) $.double(w.explicitBounds[j]);
                                $.ldelim()
                            }
                            if (w.exemplars != null && w.exemplars.length)
                                for (var j = 0; j < w.exemplars.length; ++j) r6.opentelemetry.proto.metrics.v1.Exemplar.encode(w.exemplars[j], $.uint32(66).fork()).ldelim();
                            if (w.attributes != null && w.attributes.length)
                                for (var j = 0; j < w.attributes.length; ++j) r6.opentelemetry.proto.common.v1.KeyValue.encode(w.attributes[j], $.uint32(74).fork()).ldelim();
                            if (w.flags != null && Object.hasOwnProperty.call(w, "flags")) $.uint32(80).uint32(w.flags);
                            if (w.min != null && Object.hasOwnProperty.call(w, "min")) $.uint32(89).double(w.min);
                            if (w.max != null && Object.hasOwnProperty.call(w, "max")) $.uint32(97).double(w.max);
                            return $
                        }, Y.encodeDelimited = function(w, $) {
                            return this.encode(w, $).ldelim()
                        }, Y.decode = function(w, $, j) {
                            if (!(w instanceof S1)) w = S1.create(w);
                            var H = $ === void 0 ? w.len : w.pos + $,
                                J = new r6.opentelemetry.proto.metrics.v1.HistogramDataPoint;
                            while (w.pos < H) {
                                var X = w.uint32();
                                if (X === j) break;
                                switch (X >>> 3) {
                                    case 9: {
                                        if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                        J.attributes.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.startTimeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 3: {
                                        J.timeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 4: {
                                        J.count = w.fixed64();
                                        break
                                    }
                                    case 5: {
                                        J.sum = w.double();
                                        break
                                    }
                                    case 6: {
                                        if (!(J.bucketCounts && J.bucketCounts.length)) J.bucketCounts = [];
                                        if ((X & 7) === 2) {
                                            var M = w.uint32() + w.pos;
                                            while (w.pos < M) J.bucketCounts.push(w.fixed64())
                                        } else J.bucketCounts.push(w.fixed64());
                                        break
                                    }
                                    case 7: {
                                        if (!(J.explicitBounds && J.explicitBounds.length)) J.explicitBounds = [];
                                        if ((X & 7) === 2) {
                                            var M = w.uint32() + w.pos;
                                            while (w.pos < M) J.explicitBounds.push(w.double())
                                        } else J.explicitBounds.push(w.double());
                                        break
                                    }
                                    case 8: {
                                        if (!(J.exemplars && J.exemplars.length)) J.exemplars = [];
                                        J.exemplars.push(r6.opentelemetry.proto.metrics.v1.Exemplar.decode(w, w.uint32()));
                                        break
                                    }
                                    case 10: {
                                        J.flags = w.uint32();
                                        break
                                    }
                                    case 11: {
                                        J.min = w.double();
                                        break
                                    }
                                    case 12: {
                                        J.max = w.double();
                                        break
                                    }
                                    default:
                                        w.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, Y.decodeDelimited = function(w) {
                            if (!(w instanceof S1)) w = new S1(w);
                            return this.decode(w, w.uint32())
                        }, Y.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            var $ = {};
                            if (w.attributes != null && w.hasOwnProperty("attributes")) {
                                if (!Array.isArray(w.attributes)) return "attributes: array expected";
                                for (var j = 0; j < w.attributes.length; ++j) {
                                    var H = r6.opentelemetry.proto.common.v1.KeyValue.verify(w.attributes[j]);
                                    if (H) return "attributes." + H
                                }
                            }
                            if (w.startTimeUnixNano != null && w.hasOwnProperty("startTimeUnixNano")) {
                                if (!t6.isInteger(w.startTimeUnixNano) && !(w.startTimeUnixNano && t6.isInteger(w.startTimeUnixNano.low) && t6.isInteger(w.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano")) {
                                if (!t6.isInteger(w.timeUnixNano) && !(w.timeUnixNano && t6.isInteger(w.timeUnixNano.low) && t6.isInteger(w.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (w.count != null && w.hasOwnProperty("count")) {
                                if (!t6.isInteger(w.count) && !(w.count && t6.isInteger(w.count.low) && t6.isInteger(w.count.high))) return "count: integer|Long expected"
                            }
                            if (w.sum != null && w.hasOwnProperty("sum")) {
                                if ($._sum = 1, typeof w.sum !== "number") return "sum: number expected"
                            }
                            if (w.bucketCounts != null && w.hasOwnProperty("bucketCounts")) {
                                if (!Array.isArray(w.bucketCounts)) return "bucketCounts: array expected";
                                for (var j = 0; j < w.bucketCounts.length; ++j)
                                    if (!t6.isInteger(w.bucketCounts[j]) && !(w.bucketCounts[j] && t6.isInteger(w.bucketCounts[j].low) && t6.isInteger(w.bucketCounts[j].high))) return "bucketCounts: integer|Long[] expected"
                            }
                            if (w.explicitBounds != null && w.hasOwnProperty("explicitBounds")) {
                                if (!Array.isArray(w.explicitBounds)) return "explicitBounds: array expected";
                                for (var j = 0; j < w.explicitBounds.length; ++j)
                                    if (typeof w.explicitBounds[j] !== "number") return "explicitBounds: number[] expected"
                            }
                            if (w.exemplars != null && w.hasOwnProperty("exemplars")) {
                                if (!Array.isArray(w.exemplars)) return "exemplars: array expected";
                                for (var j = 0; j < w.exemplars.length; ++j) {
                                    var H = r6.opentelemetry.proto.metrics.v1.Exemplar.verify(w.exemplars[j]);
                                    if (H) return "exemplars." + H
                                }
                            }
                            if (w.flags != null && w.hasOwnProperty("flags")) {
                                if (!t6.isInteger(w.flags)) return "flags: integer expected"
                            }
                            if (w.min != null && w.hasOwnProperty("min")) {
                                if ($._min = 1, typeof w.min !== "number") return "min: number expected"
                            }
                            if (w.max != null && w.hasOwnProperty("max")) {
                                if ($._max = 1, typeof w.max !== "number") return "max: number expected"
                            }
                            return null
                        }, Y.fromObject = function(w) {
                            if (w instanceof r6.opentelemetry.proto.metrics.v1.HistogramDataPoint) return w;
                            var $ = new r6.opentelemetry.proto.metrics.v1.HistogramDataPoint;
                            if (w.attributes) {
                                if (!Array.isArray(w.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: array expected");
                                $.attributes = [];
                                for (var j = 0; j < w.attributes.length; ++j) {
                                    if (typeof w.attributes[j] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: object expected");
                                    $.attributes[j] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.attributes[j])
                                }
                            }
                            if (w.startTimeUnixNano != null) {
                                if (t6.Long)($.startTimeUnixNano = t6.Long.fromValue(w.startTimeUnixNano)).unsigned = !1;
                                else if (typeof w.startTimeUnixNano === "string") $.startTimeUnixNano = parseInt(w.startTimeUnixNano, 10);
                                else if (typeof w.startTimeUnixNano === "number") $.startTimeUnixNano = w.startTimeUnixNano;
                                else if (typeof w.startTimeUnixNano === "object") $.startTimeUnixNano = new t6.LongBits(w.startTimeUnixNano.low >>> 0, w.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.timeUnixNano != null) {
                                if (t6.Long)($.timeUnixNano = t6.Long.fromValue(w.timeUnixNano)).unsigned = !1;
                                else if (typeof w.timeUnixNano === "string") $.timeUnixNano = parseInt(w.timeUnixNano, 10);
                                else if (typeof w.timeUnixNano === "number") $.timeUnixNano = w.timeUnixNano;
                                else if (typeof w.timeUnixNano === "object") $.timeUnixNano = new t6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.count != null) {
                                if (t6.Long)($.count = t6.Long.fromValue(w.count)).unsigned = !1;
                                else if (typeof w.count === "string") $.count = parseInt(w.count, 10);
                                else if (typeof w.count === "number") $.count = w.count;
                                else if (typeof w.count === "object") $.count = new t6.LongBits(w.count.low >>> 0, w.count.high >>> 0).toNumber()
                            }
                            if (w.sum != null) $.sum = Number(w.sum);
                            if (w.bucketCounts) {
                                if (!Array.isArray(w.bucketCounts)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.bucketCounts: array expected");
                                $.bucketCounts = [];
                                for (var j = 0; j < w.bucketCounts.length; ++j)
                                    if (t6.Long)($.bucketCounts[j] = t6.Long.fromValue(w.bucketCounts[j])).unsigned = !1;
                                    else if (typeof w.bucketCounts[j] === "string") $.bucketCounts[j] = parseInt(w.bucketCounts[j], 10);
                                else if (typeof w.bucketCounts[j] === "number") $.bucketCounts[j] = w.bucketCounts[j];
                                else if (typeof w.bucketCounts[j] === "object") $.bucketCounts[j] = new t6.LongBits(w.bucketCounts[j].low >>> 0, w.bucketCounts[j].high >>> 0).toNumber()
                            }
                            if (w.explicitBounds) {
                                if (!Array.isArray(w.explicitBounds)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.explicitBounds: array expected");
                                $.explicitBounds = [];
                                for (var j = 0; j < w.explicitBounds.length; ++j) $.explicitBounds[j] = Number(w.explicitBounds[j])
                            }
                            if (w.exemplars) {
                                if (!Array.isArray(w.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: array expected");
                                $.exemplars = [];
                                for (var j = 0; j < w.exemplars.length; ++j) {
                                    if (typeof w.exemplars[j] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: object expected");
                                    $.exemplars[j] = r6.opentelemetry.proto.metrics.v1.Exemplar.fromObject(w.exemplars[j])
                                }
                            }
                            if (w.flags != null) $.flags = w.flags >>> 0;
                            if (w.min != null) $.min = Number(w.min);
                            if (w.max != null) $.max = Number(w.max);
                            return $
                        }, Y.toObject = function(w, $) {
                            if (!$) $ = {};
                            var j = {};
                            if ($.arrays || $.defaults) j.bucketCounts = [], j.explicitBounds = [], j.exemplars = [], j.attributes = [];
                            if ($.defaults) {
                                if (t6.Long) {
                                    var H = new t6.Long(0, 0, !1);
                                    j.startTimeUnixNano = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                } else j.startTimeUnixNano = $.longs === String ? "0" : 0;
                                if (t6.Long) {
                                    var H = new t6.Long(0, 0, !1);
                                    j.timeUnixNano = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                } else j.timeUnixNano = $.longs === String ? "0" : 0;
                                if (t6.Long) {
                                    var H = new t6.Long(0, 0, !1);
                                    j.count = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                } else j.count = $.longs === String ? "0" : 0;
                                j.flags = 0
                            }
                            if (w.startTimeUnixNano != null && w.hasOwnProperty("startTimeUnixNano"))
                                if (typeof w.startTimeUnixNano === "number") j.startTimeUnixNano = $.longs === String ? String(w.startTimeUnixNano) : w.startTimeUnixNano;
                                else j.startTimeUnixNano = $.longs === String ? t6.Long.prototype.toString.call(w.startTimeUnixNano) : $.longs === Number ? new t6.LongBits(w.startTimeUnixNano.low >>> 0, w.startTimeUnixNano.high >>> 0).toNumber() : w.startTimeUnixNano;
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano"))
                                if (typeof w.timeUnixNano === "number") j.timeUnixNano = $.longs === String ? String(w.timeUnixNano) : w.timeUnixNano;
                                else j.timeUnixNano = $.longs === String ? t6.Long.prototype.toString.call(w.timeUnixNano) : $.longs === Number ? new t6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber() : w.timeUnixNano;
                            if (w.count != null && w.hasOwnProperty("count"))
                                if (typeof w.count === "number") j.count = $.longs === String ? String(w.count) : w.count;
                                else j.count = $.longs === String ? t6.Long.prototype.toString.call(w.count) : $.longs === Number ? new t6.LongBits(w.count.low >>> 0, w.count.high >>> 0).toNumber() : w.count;
                            if (w.sum != null && w.hasOwnProperty("sum")) {
                                if (j.sum = $.json && !isFinite(w.sum) ? String(w.sum) : w.sum, $.oneofs) j._sum = "sum"
                            }
                            if (w.bucketCounts && w.bucketCounts.length) {
                                j.bucketCounts = [];
                                for (var J = 0; J < w.bucketCounts.length; ++J)
                                    if (typeof w.bucketCounts[J] === "number") j.bucketCounts[J] = $.longs === String ? String(w.bucketCounts[J]) : w.bucketCounts[J];
                                    else j.bucketCounts[J] = $.longs === String ? t6.Long.prototype.toString.call(w.bucketCounts[J]) : $.longs === Number ? new t6.LongBits(w.bucketCounts[J].low >>> 0, w.bucketCounts[J].high >>> 0).toNumber() : w.bucketCounts[J]
                            }
                            if (w.explicitBounds && w.explicitBounds.length) {
                                j.explicitBounds = [];
                                for (var J = 0; J < w.explicitBounds.length; ++J) j.explicitBounds[J] = $.json && !isFinite(w.explicitBounds[J]) ? String(w.explicitBounds[J]) : w.explicitBounds[J]
                            }
                            if (w.exemplars && w.exemplars.length) {
                                j.exemplars = [];
                                for (var J = 0; J < w.exemplars.length; ++J) j.exemplars[J] = r6.opentelemetry.proto.metrics.v1.Exemplar.toObject(w.exemplars[J], $)
                            }
                            if (w.attributes && w.attributes.length) {
                                j.attributes = [];
                                for (var J = 0; J < w.attributes.length; ++J) j.attributes[J] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(w.attributes[J], $)
                            }
                            if (w.flags != null && w.hasOwnProperty("flags")) j.flags = w.flags;
                            if (w.min != null && w.hasOwnProperty("min")) {
                                if (j.min = $.json && !isFinite(w.min) ? String(w.min) : w.min, $.oneofs) j._min = "min"
                            }
                            if (w.max != null && w.hasOwnProperty("max")) {
                                if (j.max = $.json && !isFinite(w.max) ? String(w.max) : w.max, $.oneofs) j._max = "max"
                            }
                            return j
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.HistogramDataPoint"
                        }, Y
                    }(), z.ExponentialHistogramDataPoint = function() {
                        function Y(O) {
                            if (this.attributes = [], this.exemplars = [], O) {
                                for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                    if (O[w[$]] != null) this[w[$]] = O[w[$]]
                            }
                        }
                        Y.prototype.attributes = t6.emptyArray, Y.prototype.startTimeUnixNano = null, Y.prototype.timeUnixNano = null, Y.prototype.count = null, Y.prototype.sum = null, Y.prototype.scale = null, Y.prototype.zeroCount = null, Y.prototype.positive = null, Y.prototype.negative = null, Y.prototype.flags = null, Y.prototype.exemplars = t6.emptyArray, Y.prototype.min = null, Y.prototype.max = null, Y.prototype.zeroThreshold = null;
                        var A;
                        return Object.defineProperty(Y.prototype, "_sum", {
                            get: t6.oneOfGetter(A = ["sum"]),
                            set: t6.oneOfSetter(A)
                        }), Object.defineProperty(Y.prototype, "_min", {
                            get: t6.oneOfGetter(A = ["min"]),
                            set: t6.oneOfSetter(A)
                        }), Object.defineProperty(Y.prototype, "_max", {
                            get: t6.oneOfGetter(A = ["max"]),
                            set: t6.oneOfSetter(A)
                        }), Y.create = function(w) {
                            return new Y(w)
                        }, Y.encode = function(w, $) {
                            if (!$) $ = t9.create();
                            if (w.attributes != null && w.attributes.length)
                                for (var j = 0; j < w.attributes.length; ++j) r6.opentelemetry.proto.common.v1.KeyValue.encode(w.attributes[j], $.uint32(10).fork()).ldelim();
                            if (w.startTimeUnixNano != null && Object.hasOwnProperty.call(w, "startTimeUnixNano")) $.uint32(17).fixed64(w.startTimeUnixNano);
                            if (w.timeUnixNano != null && Object.hasOwnProperty.call(w, "timeUnixNano")) $.uint32(25).fixed64(w.timeUnixNano);
                            if (w.count != null && Object.hasOwnProperty.call(w, "count")) $.uint32(33).fixed64(w.count);
                            if (w.sum != null && Object.hasOwnProperty.call(w, "sum")) $.uint32(41).double(w.sum);
                            if (w.scale != null && Object.hasOwnProperty.call(w, "scale")) $.uint32(48).sint32(w.scale);
                            if (w.zeroCount != null && Object.hasOwnProperty.call(w, "zeroCount")) $.uint32(57).fixed64(w.zeroCount);
                            if (w.positive != null && Object.hasOwnProperty.call(w, "positive")) r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode(w.positive, $.uint32(66).fork()).ldelim();
                            if (w.negative != null && Object.hasOwnProperty.call(w, "negative")) r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode(w.negative, $.uint32(74).fork()).ldelim();
                            if (w.flags != null && Object.hasOwnProperty.call(w, "flags")) $.uint32(80).uint32(w.flags);
                            if (w.exemplars != null && w.exemplars.length)
                                for (var j = 0; j < w.exemplars.length; ++j) r6.opentelemetry.proto.metrics.v1.Exemplar.encode(w.exemplars[j], $.uint32(90).fork()).ldelim();
                            if (w.min != null && Object.hasOwnProperty.call(w, "min")) $.uint32(97).double(w.min);
                            if (w.max != null && Object.hasOwnProperty.call(w, "max")) $.uint32(105).double(w.max);
                            if (w.zeroThreshold != null && Object.hasOwnProperty.call(w, "zeroThreshold")) $.uint32(113).double(w.zeroThreshold);
                            return $
                        }, Y.encodeDelimited = function(w, $) {
                            return this.encode(w, $).ldelim()
                        }, Y.decode = function(w, $, j) {
                            if (!(w instanceof S1)) w = S1.create(w);
                            var H = $ === void 0 ? w.len : w.pos + $,
                                J = new r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;
                            while (w.pos < H) {
                                var X = w.uint32();
                                if (X === j) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                        J.attributes.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.startTimeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 3: {
                                        J.timeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 4: {
                                        J.count = w.fixed64();
                                        break
                                    }
                                    case 5: {
                                        J.sum = w.double();
                                        break
                                    }
                                    case 6: {
                                        J.scale = w.sint32();
                                        break
                                    }
                                    case 7: {
                                        J.zeroCount = w.fixed64();
                                        break
                                    }
                                    case 8: {
                                        J.positive = r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(w, w.uint32());
                                        break
                                    }
                                    case 9: {
                                        J.negative = r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(w, w.uint32());
                                        break
                                    }
                                    case 10: {
                                        J.flags = w.uint32();
                                        break
                                    }
                                    case 11: {
                                        if (!(J.exemplars && J.exemplars.length)) J.exemplars = [];
                                        J.exemplars.push(r6.opentelemetry.proto.metrics.v1.Exemplar.decode(w, w.uint32()));
                                        break
                                    }
                                    case 12: {
                                        J.min = w.double();
                                        break
                                    }
                                    case 13: {
                                        J.max = w.double();
                                        break
                                    }
                                    case 14: {
                                        J.zeroThreshold = w.double();
                                        break
                                    }
                                    default:
                                        w.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, Y.decodeDelimited = function(w) {
                            if (!(w instanceof S1)) w = new S1(w);
                            return this.decode(w, w.uint32())
                        }, Y.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            var $ = {};
                            if (w.attributes != null && w.hasOwnProperty("attributes")) {
                                if (!Array.isArray(w.attributes)) return "attributes: array expected";
                                for (var j = 0; j < w.attributes.length; ++j) {
                                    var H = r6.opentelemetry.proto.common.v1.KeyValue.verify(w.attributes[j]);
                                    if (H) return "attributes." + H
                                }
                            }
                            if (w.startTimeUnixNano != null && w.hasOwnProperty("startTimeUnixNano")) {
                                if (!t6.isInteger(w.startTimeUnixNano) && !(w.startTimeUnixNano && t6.isInteger(w.startTimeUnixNano.low) && t6.isInteger(w.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano")) {
                                if (!t6.isInteger(w.timeUnixNano) && !(w.timeUnixNano && t6.isInteger(w.timeUnixNano.low) && t6.isInteger(w.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (w.count != null && w.hasOwnProperty("count")) {
                                if (!t6.isInteger(w.count) && !(w.count && t6.isInteger(w.count.low) && t6.isInteger(w.count.high))) return "count: integer|Long expected"
                            }
                            if (w.sum != null && w.hasOwnProperty("sum")) {
                                if ($._sum = 1, typeof w.sum !== "number") return "sum: number expected"
                            }
                            if (w.scale != null && w.hasOwnProperty("scale")) {
                                if (!t6.isInteger(w.scale)) return "scale: integer expected"
                            }
                            if (w.zeroCount != null && w.hasOwnProperty("zeroCount")) {
                                if (!t6.isInteger(w.zeroCount) && !(w.zeroCount && t6.isInteger(w.zeroCount.low) && t6.isInteger(w.zeroCount.high))) return "zeroCount: integer|Long expected"
                            }
                            if (w.positive != null && w.hasOwnProperty("positive")) {
                                var H = r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify(w.positive);
                                if (H) return "positive." + H
                            }
                            if (w.negative != null && w.hasOwnProperty("negative")) {
                                var H = r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify(w.negative);
                                if (H) return "negative." + H
                            }
                            if (w.flags != null && w.hasOwnProperty("flags")) {
                                if (!t6.isInteger(w.flags)) return "flags: integer expected"
                            }
                            if (w.exemplars != null && w.hasOwnProperty("exemplars")) {
                                if (!Array.isArray(w.exemplars)) return "exemplars: array expected";
                                for (var j = 0; j < w.exemplars.length; ++j) {
                                    var H = r6.opentelemetry.proto.metrics.v1.Exemplar.verify(w.exemplars[j]);
                                    if (H) return "exemplars." + H
                                }
                            }
                            if (w.min != null && w.hasOwnProperty("min")) {
                                if ($._min = 1, typeof w.min !== "number") return "min: number expected"
                            }
                            if (w.max != null && w.hasOwnProperty("max")) {
                                if ($._max = 1, typeof w.max !== "number") return "max: number expected"
                            }
                            if (w.zeroThreshold != null && w.hasOwnProperty("zeroThreshold")) {
                                if (typeof w.zeroThreshold !== "number") return "zeroThreshold: number expected"
                            }
                            return null
                        }, Y.fromObject = function(w) {
                            if (w instanceof r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint) return w;
                            var $ = new r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;
                            if (w.attributes) {
                                if (!Array.isArray(w.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: array expected");
                                $.attributes = [];
                                for (var j = 0; j < w.attributes.length; ++j) {
                                    if (typeof w.attributes[j] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: object expected");
                                    $.attributes[j] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.attributes[j])
                                }
                            }
                            if (w.startTimeUnixNano != null) {
                                if (t6.Long)($.startTimeUnixNano = t6.Long.fromValue(w.startTimeUnixNano)).unsigned = !1;
                                else if (typeof w.startTimeUnixNano === "string") $.startTimeUnixNano = parseInt(w.startTimeUnixNano, 10);
                                else if (typeof w.startTimeUnixNano === "number") $.startTimeUnixNano = w.startTimeUnixNano;
                                else if (typeof w.startTimeUnixNano === "object") $.startTimeUnixNano = new t6.LongBits(w.startTimeUnixNano.low >>> 0, w.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.timeUnixNano != null) {
                                if (t6.Long)($.timeUnixNano = t6.Long.fromValue(w.timeUnixNano)).unsigned = !1;
                                else if (typeof w.timeUnixNano === "string") $.timeUnixNano = parseInt(w.timeUnixNano, 10);
                                else if (typeof w.timeUnixNano === "number") $.timeUnixNano = w.timeUnixNano;
                                else if (typeof w.timeUnixNano === "object") $.timeUnixNano = new t6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.count != null) {
                                if (t6.Long)($.count = t6.Long.fromValue(w.count)).unsigned = !1;
                                else if (typeof w.count === "string") $.count = parseInt(w.count, 10);
                                else if (typeof w.count === "number") $.count = w.count;
                                else if (typeof w.count === "object") $.count = new t6.LongBits(w.count.low >>> 0, w.count.high >>> 0).toNumber()
                            }
                            if (w.sum != null) $.sum = Number(w.sum);
                            if (w.scale != null) $.scale = w.scale | 0;
                            if (w.zeroCount != null) {
                                if (t6.Long)($.zeroCount = t6.Long.fromValue(w.zeroCount)).unsigned = !1;
                                else if (typeof w.zeroCount === "string") $.zeroCount = parseInt(w.zeroCount, 10);
                                else if (typeof w.zeroCount === "number") $.zeroCount = w.zeroCount;
                                else if (typeof w.zeroCount === "object") $.zeroCount = new t6.LongBits(w.zeroCount.low >>> 0, w.zeroCount.high >>> 0).toNumber()
                            }
                            if (w.positive != null) {
                                if (typeof w.positive !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.positive: object expected");
                                $.positive = r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(w.positive)
                            }
                            if (w.negative != null) {
                                if (typeof w.negative !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.negative: object expected");
                                $.negative = r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(w.negative)
                            }
                            if (w.flags != null) $.flags = w.flags >>> 0;
                            if (w.exemplars) {
                                if (!Array.isArray(w.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: array expected");
                                $.exemplars = [];
                                for (var j = 0; j < w.exemplars.length; ++j) {
                                    if (typeof w.exemplars[j] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: object expected");
                                    $.exemplars[j] = r6.opentelemetry.proto.metrics.v1.Exemplar.fromObject(w.exemplars[j])
                                }
                            }
                            if (w.min != null) $.min = Number(w.min);
                            if (w.max != null) $.max = Number(w.max);
                            if (w.zeroThreshold != null) $.zeroThreshold = Number(w.zeroThreshold);
                            return $
                        }, Y.toObject = function(w, $) {
                            if (!$) $ = {};
                            var j = {};
                            if ($.arrays || $.defaults) j.attributes = [], j.exemplars = [];
                            if ($.defaults) {
                                if (t6.Long) {
                                    var H = new t6.Long(0, 0, !1);
                                    j.startTimeUnixNano = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                } else j.startTimeUnixNano = $.longs === String ? "0" : 0;
                                if (t6.Long) {
                                    var H = new t6.Long(0, 0, !1);
                                    j.timeUnixNano = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                } else j.timeUnixNano = $.longs === String ? "0" : 0;
                                if (t6.Long) {
                                    var H = new t6.Long(0, 0, !1);
                                    j.count = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                } else j.count = $.longs === String ? "0" : 0;
                                if (j.scale = 0, t6.Long) {
                                    var H = new t6.Long(0, 0, !1);
                                    j.zeroCount = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                } else j.zeroCount = $.longs === String ? "0" : 0;
                                j.positive = null, j.negative = null, j.flags = 0, j.zeroThreshold = 0
                            }
                            if (w.attributes && w.attributes.length) {
                                j.attributes = [];
                                for (var J = 0; J < w.attributes.length; ++J) j.attributes[J] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(w.attributes[J], $)
                            }
                            if (w.startTimeUnixNano != null && w.hasOwnProperty("startTimeUnixNano"))
                                if (typeof w.startTimeUnixNano === "number") j.startTimeUnixNano = $.longs === String ? String(w.startTimeUnixNano) : w.startTimeUnixNano;
                                else j.startTimeUnixNano = $.longs === String ? t6.Long.prototype.toString.call(w.startTimeUnixNano) : $.longs === Number ? new t6.LongBits(w.startTimeUnixNano.low >>> 0, w.startTimeUnixNano.high >>> 0).toNumber() : w.startTimeUnixNano;
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano"))
                                if (typeof w.timeUnixNano === "number") j.timeUnixNano = $.longs === String ? String(w.timeUnixNano) : w.timeUnixNano;
                                else j.timeUnixNano = $.longs === String ? t6.Long.prototype.toString.call(w.timeUnixNano) : $.longs === Number ? new t6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber() : w.timeUnixNano;
                            if (w.count != null && w.hasOwnProperty("count"))
                                if (typeof w.count === "number") j.count = $.longs === String ? String(w.count) : w.count;
                                else j.count = $.longs === String ? t6.Long.prototype.toString.call(w.count) : $.longs === Number ? new t6.LongBits(w.count.low >>> 0, w.count.high >>> 0).toNumber() : w.count;
                            if (w.sum != null && w.hasOwnProperty("sum")) {
                                if (j.sum = $.json && !isFinite(w.sum) ? String(w.sum) : w.sum, $.oneofs) j._sum = "sum"
                            }
                            if (w.scale != null && w.hasOwnProperty("scale")) j.scale = w.scale;
                            if (w.zeroCount != null && w.hasOwnProperty("zeroCount"))
                                if (typeof w.zeroCount === "number") j.zeroCount = $.longs === String ? String(w.zeroCount) : w.zeroCount;
                                else j.zeroCount = $.longs === String ? t6.Long.prototype.toString.call(w.zeroCount) : $.longs === Number ? new t6.LongBits(w.zeroCount.low >>> 0, w.zeroCount.high >>> 0).toNumber() : w.zeroCount;
                            if (w.positive != null && w.hasOwnProperty("positive")) j.positive = r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(w.positive, $);
                            if (w.negative != null && w.hasOwnProperty("negative")) j.negative = r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(w.negative, $);
                            if (w.flags != null && w.hasOwnProperty("flags")) j.flags = w.flags;
                            if (w.exemplars && w.exemplars.length) {
                                j.exemplars = [];
                                for (var J = 0; J < w.exemplars.length; ++J) j.exemplars[J] = r6.opentelemetry.proto.metrics.v1.Exemplar.toObject(w.exemplars[J], $)
                            }
                            if (w.min != null && w.hasOwnProperty("min")) {
                                if (j.min = $.json && !isFinite(w.min) ? String(w.min) : w.min, $.oneofs) j._min = "min"
                            }
                            if (w.max != null && w.hasOwnProperty("max")) {
                                if (j.max = $.json && !isFinite(w.max) ? String(w.max) : w.max, $.oneofs) j._max = "max"
                            }
                            if (w.zeroThreshold != null && w.hasOwnProperty("zeroThreshold")) j.zeroThreshold = $.json && !isFinite(w.zeroThreshold) ? String(w.zeroThreshold) : w.zeroThreshold;
                            return j
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint"
                        }, Y.Buckets = function() {
                            function O(w) {
                                if (this.bucketCounts = [], w) {
                                    for (var $ = Object.keys(w), j = 0; j < $.length; ++j)
                                        if (w[$[j]] != null) this[$[j]] = w[$[j]]
                                }
                            }
                            return O.prototype.offset = null, O.prototype.bucketCounts = t6.emptyArray, O.create = function($) {
                                return new O($)
                            }, O.encode = function($, j) {
                                if (!j) j = t9.create();
                                if ($.offset != null && Object.hasOwnProperty.call($, "offset")) j.uint32(8).sint32($.offset);
                                if ($.bucketCounts != null && $.bucketCounts.length) {
                                    j.uint32(18).fork();
                                    for (var H = 0; H < $.bucketCounts.length; ++H) j.uint64($.bucketCounts[H]);
                                    j.ldelim()
                                }
                                return j
                            }, O.encodeDelimited = function($, j) {
                                return this.encode($, j).ldelim()
                            }, O.decode = function($, j, H) {
                                if (!($ instanceof S1)) $ = S1.create($);
                                var J = j === void 0 ? $.len : $.pos + j,
                                    X = new r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;
                                while ($.pos < J) {
                                    var M = $.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            X.offset = $.sint32();
                                            break
                                        }
                                        case 2: {
                                            if (!(X.bucketCounts && X.bucketCounts.length)) X.bucketCounts = [];
                                            if ((M & 7) === 2) {
                                                var P = $.uint32() + $.pos;
                                                while ($.pos < P) X.bucketCounts.push($.uint64())
                                            } else X.bucketCounts.push($.uint64());
                                            break
                                        }
                                        default:
                                            $.skipType(M & 7);
                                            break
                                    }
                                }
                                return X
                            }, O.decodeDelimited = function($) {
                                if (!($ instanceof S1)) $ = new S1($);
                                return this.decode($, $.uint32())
                            }, O.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.offset != null && $.hasOwnProperty("offset")) {
                                    if (!t6.isInteger($.offset)) return "offset: integer expected"
                                }
                                if ($.bucketCounts != null && $.hasOwnProperty("bucketCounts")) {
                                    if (!Array.isArray($.bucketCounts)) return "bucketCounts: array expected";
                                    for (var j = 0; j < $.bucketCounts.length; ++j)
                                        if (!t6.isInteger($.bucketCounts[j]) && !($.bucketCounts[j] && t6.isInteger($.bucketCounts[j].low) && t6.isInteger($.bucketCounts[j].high))) return "bucketCounts: integer|Long[] expected"
                                }
                                return null
                            }, O.fromObject = function($) {
                                if ($ instanceof r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets) return $;
                                var j = new r6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;
                                if ($.offset != null) j.offset = $.offset | 0;
                                if ($.bucketCounts) {
                                    if (!Array.isArray($.bucketCounts)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.bucketCounts: array expected");
                                    j.bucketCounts = [];
                                    for (var H = 0; H < $.bucketCounts.length; ++H)
                                        if (t6.Long)(j.bucketCounts[H] = t6.Long.fromValue($.bucketCounts[H])).unsigned = !0;
                                        else if (typeof $.bucketCounts[H] === "string") j.bucketCounts[H] = parseInt($.bucketCounts[H], 10);
                                    else if (typeof $.bucketCounts[H] === "number") j.bucketCounts[H] = $.bucketCounts[H];
                                    else if (typeof $.bucketCounts[H] === "object") j.bucketCounts[H] = new t6.LongBits($.bucketCounts[H].low >>> 0, $.bucketCounts[H].high >>> 0).toNumber(!0)
                                }
                                return j
                            }, O.toObject = function($, j) {
                                if (!j) j = {};
                                var H = {};
                                if (j.arrays || j.defaults) H.bucketCounts = [];
                                if (j.defaults) H.offset = 0;
                                if ($.offset != null && $.hasOwnProperty("offset")) H.offset = $.offset;
                                if ($.bucketCounts && $.bucketCounts.length) {
                                    H.bucketCounts = [];
                                    for (var J = 0; J < $.bucketCounts.length; ++J)
                                        if (typeof $.bucketCounts[J] === "number") H.bucketCounts[J] = j.longs === String ? String($.bucketCounts[J]) : $.bucketCounts[J];
                                        else H.bucketCounts[J] = j.longs === String ? t6.Long.prototype.toString.call($.bucketCounts[J]) : j.longs === Number ? new t6.LongBits($.bucketCounts[J].low >>> 0, $.bucketCounts[J].high >>> 0).toNumber(!0) : $.bucketCounts[J]
                                }
                                return H
                            }, O.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, O.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets"
                            }, O
                        }(), Y
                    }(), z.SummaryDataPoint = function() {
                        function Y(A) {
                            if (this.attributes = [], this.quantileValues = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.attributes = t6.emptyArray, Y.prototype.startTimeUnixNano = null, Y.prototype.timeUnixNano = null, Y.prototype.count = null, Y.prototype.sum = null, Y.prototype.quantileValues = t6.emptyArray, Y.prototype.flags = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.startTimeUnixNano != null && Object.hasOwnProperty.call(O, "startTimeUnixNano")) w.uint32(17).fixed64(O.startTimeUnixNano);
                            if (O.timeUnixNano != null && Object.hasOwnProperty.call(O, "timeUnixNano")) w.uint32(25).fixed64(O.timeUnixNano);
                            if (O.count != null && Object.hasOwnProperty.call(O, "count")) w.uint32(33).fixed64(O.count);
                            if (O.sum != null && Object.hasOwnProperty.call(O, "sum")) w.uint32(41).double(O.sum);
                            if (O.quantileValues != null && O.quantileValues.length)
                                for (var $ = 0; $ < O.quantileValues.length; ++$) r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.encode(O.quantileValues[$], w.uint32(50).fork()).ldelim();
                            if (O.attributes != null && O.attributes.length)
                                for (var $ = 0; $ < O.attributes.length; ++$) r6.opentelemetry.proto.common.v1.KeyValue.encode(O.attributes[$], w.uint32(58).fork()).ldelim();
                            if (O.flags != null && Object.hasOwnProperty.call(O, "flags")) w.uint32(64).uint32(O.flags);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.metrics.v1.SummaryDataPoint;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 7: {
                                        if (!(H.attributes && H.attributes.length)) H.attributes = [];
                                        H.attributes.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    case 2: {
                                        H.startTimeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 3: {
                                        H.timeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 4: {
                                        H.count = O.fixed64();
                                        break
                                    }
                                    case 5: {
                                        H.sum = O.double();
                                        break
                                    }
                                    case 6: {
                                        if (!(H.quantileValues && H.quantileValues.length)) H.quantileValues = [];
                                        H.quantileValues.push(r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.decode(O, O.uint32()));
                                        break
                                    }
                                    case 8: {
                                        H.flags = O.uint32();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.attributes != null && O.hasOwnProperty("attributes")) {
                                if (!Array.isArray(O.attributes)) return "attributes: array expected";
                                for (var w = 0; w < O.attributes.length; ++w) {
                                    var $ = r6.opentelemetry.proto.common.v1.KeyValue.verify(O.attributes[w]);
                                    if ($) return "attributes." + $
                                }
                            }
                            if (O.startTimeUnixNano != null && O.hasOwnProperty("startTimeUnixNano")) {
                                if (!t6.isInteger(O.startTimeUnixNano) && !(O.startTimeUnixNano && t6.isInteger(O.startTimeUnixNano.low) && t6.isInteger(O.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano")) {
                                if (!t6.isInteger(O.timeUnixNano) && !(O.timeUnixNano && t6.isInteger(O.timeUnixNano.low) && t6.isInteger(O.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (O.count != null && O.hasOwnProperty("count")) {
                                if (!t6.isInteger(O.count) && !(O.count && t6.isInteger(O.count.low) && t6.isInteger(O.count.high))) return "count: integer|Long expected"
                            }
                            if (O.sum != null && O.hasOwnProperty("sum")) {
                                if (typeof O.sum !== "number") return "sum: number expected"
                            }
                            if (O.quantileValues != null && O.hasOwnProperty("quantileValues")) {
                                if (!Array.isArray(O.quantileValues)) return "quantileValues: array expected";
                                for (var w = 0; w < O.quantileValues.length; ++w) {
                                    var $ = r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.verify(O.quantileValues[w]);
                                    if ($) return "quantileValues." + $
                                }
                            }
                            if (O.flags != null && O.hasOwnProperty("flags")) {
                                if (!t6.isInteger(O.flags)) return "flags: integer expected"
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.metrics.v1.SummaryDataPoint) return O;
                            var w = new r6.opentelemetry.proto.metrics.v1.SummaryDataPoint;
                            if (O.attributes) {
                                if (!Array.isArray(O.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: array expected");
                                w.attributes = [];
                                for (var $ = 0; $ < O.attributes.length; ++$) {
                                    if (typeof O.attributes[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: object expected");
                                    w.attributes[$] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.attributes[$])
                                }
                            }
                            if (O.startTimeUnixNano != null) {
                                if (t6.Long)(w.startTimeUnixNano = t6.Long.fromValue(O.startTimeUnixNano)).unsigned = !1;
                                else if (typeof O.startTimeUnixNano === "string") w.startTimeUnixNano = parseInt(O.startTimeUnixNano, 10);
                                else if (typeof O.startTimeUnixNano === "number") w.startTimeUnixNano = O.startTimeUnixNano;
                                else if (typeof O.startTimeUnixNano === "object") w.startTimeUnixNano = new t6.LongBits(O.startTimeUnixNano.low >>> 0, O.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.timeUnixNano != null) {
                                if (t6.Long)(w.timeUnixNano = t6.Long.fromValue(O.timeUnixNano)).unsigned = !1;
                                else if (typeof O.timeUnixNano === "string") w.timeUnixNano = parseInt(O.timeUnixNano, 10);
                                else if (typeof O.timeUnixNano === "number") w.timeUnixNano = O.timeUnixNano;
                                else if (typeof O.timeUnixNano === "object") w.timeUnixNano = new t6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.count != null) {
                                if (t6.Long)(w.count = t6.Long.fromValue(O.count)).unsigned = !1;
                                else if (typeof O.count === "string") w.count = parseInt(O.count, 10);
                                else if (typeof O.count === "number") w.count = O.count;
                                else if (typeof O.count === "object") w.count = new t6.LongBits(O.count.low >>> 0, O.count.high >>> 0).toNumber()
                            }
                            if (O.sum != null) w.sum = Number(O.sum);
                            if (O.quantileValues) {
                                if (!Array.isArray(O.quantileValues)) throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: array expected");
                                w.quantileValues = [];
                                for (var $ = 0; $ < O.quantileValues.length; ++$) {
                                    if (typeof O.quantileValues[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: object expected");
                                    w.quantileValues[$] = r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.fromObject(O.quantileValues[$])
                                }
                            }
                            if (O.flags != null) w.flags = O.flags >>> 0;
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.quantileValues = [], $.attributes = [];
                            if (w.defaults) {
                                if (t6.Long) {
                                    var j = new t6.Long(0, 0, !1);
                                    $.startTimeUnixNano = w.longs === String ? j.toString() : w.longs === Number ? j.toNumber() : j
                                } else $.startTimeUnixNano = w.longs === String ? "0" : 0;
                                if (t6.Long) {
                                    var j = new t6.Long(0, 0, !1);
                                    $.timeUnixNano = w.longs === String ? j.toString() : w.longs === Number ? j.toNumber() : j
                                } else $.timeUnixNano = w.longs === String ? "0" : 0;
                                if (t6.Long) {
                                    var j = new t6.Long(0, 0, !1);
                                    $.count = w.longs === String ? j.toString() : w.longs === Number ? j.toNumber() : j
                                } else $.count = w.longs === String ? "0" : 0;
                                $.sum = 0, $.flags = 0
                            }
                            if (O.startTimeUnixNano != null && O.hasOwnProperty("startTimeUnixNano"))
                                if (typeof O.startTimeUnixNano === "number") $.startTimeUnixNano = w.longs === String ? String(O.startTimeUnixNano) : O.startTimeUnixNano;
                                else $.startTimeUnixNano = w.longs === String ? t6.Long.prototype.toString.call(O.startTimeUnixNano) : w.longs === Number ? new t6.LongBits(O.startTimeUnixNano.low >>> 0, O.startTimeUnixNano.high >>> 0).toNumber() : O.startTimeUnixNano;
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano"))
                                if (typeof O.timeUnixNano === "number") $.timeUnixNano = w.longs === String ? String(O.timeUnixNano) : O.timeUnixNano;
                                else $.timeUnixNano = w.longs === String ? t6.Long.prototype.toString.call(O.timeUnixNano) : w.longs === Number ? new t6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber() : O.timeUnixNano;
                            if (O.count != null && O.hasOwnProperty("count"))
                                if (typeof O.count === "number") $.count = w.longs === String ? String(O.count) : O.count;
                                else $.count = w.longs === String ? t6.Long.prototype.toString.call(O.count) : w.longs === Number ? new t6.LongBits(O.count.low >>> 0, O.count.high >>> 0).toNumber() : O.count;
                            if (O.sum != null && O.hasOwnProperty("sum")) $.sum = w.json && !isFinite(O.sum) ? String(O.sum) : O.sum;
                            if (O.quantileValues && O.quantileValues.length) {
                                $.quantileValues = [];
                                for (var H = 0; H < O.quantileValues.length; ++H) $.quantileValues[H] = r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.toObject(O.quantileValues[H], w)
                            }
                            if (O.attributes && O.attributes.length) {
                                $.attributes = [];
                                for (var H = 0; H < O.attributes.length; ++H) $.attributes[H] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(O.attributes[H], w)
                            }
                            if (O.flags != null && O.hasOwnProperty("flags")) $.flags = O.flags;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.SummaryDataPoint"
                        }, Y.ValueAtQuantile = function() {
                            function A(O) {
                                if (O) {
                                    for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                        if (O[w[$]] != null) this[w[$]] = O[w[$]]
                                }
                            }
                            return A.prototype.quantile = null, A.prototype.value = null, A.create = function(w) {
                                return new A(w)
                            }, A.encode = function(w, $) {
                                if (!$) $ = t9.create();
                                if (w.quantile != null && Object.hasOwnProperty.call(w, "quantile")) $.uint32(9).double(w.quantile);
                                if (w.value != null && Object.hasOwnProperty.call(w, "value")) $.uint32(17).double(w.value);
                                return $
                            }, A.encodeDelimited = function(w, $) {
                                return this.encode(w, $).ldelim()
                            }, A.decode = function(w, $, j) {
                                if (!(w instanceof S1)) w = S1.create(w);
                                var H = $ === void 0 ? w.len : w.pos + $,
                                    J = new r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;
                                while (w.pos < H) {
                                    var X = w.uint32();
                                    if (X === j) break;
                                    switch (X >>> 3) {
                                        case 1: {
                                            J.quantile = w.double();
                                            break
                                        }
                                        case 2: {
                                            J.value = w.double();
                                            break
                                        }
                                        default:
                                            w.skipType(X & 7);
                                            break
                                    }
                                }
                                return J
                            }, A.decodeDelimited = function(w) {
                                if (!(w instanceof S1)) w = new S1(w);
                                return this.decode(w, w.uint32())
                            }, A.verify = function(w) {
                                if (typeof w !== "object" || w === null) return "object expected";
                                if (w.quantile != null && w.hasOwnProperty("quantile")) {
                                    if (typeof w.quantile !== "number") return "quantile: number expected"
                                }
                                if (w.value != null && w.hasOwnProperty("value")) {
                                    if (typeof w.value !== "number") return "value: number expected"
                                }
                                return null
                            }, A.fromObject = function(w) {
                                if (w instanceof r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile) return w;
                                var $ = new r6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;
                                if (w.quantile != null) $.quantile = Number(w.quantile);
                                if (w.value != null) $.value = Number(w.value);
                                return $
                            }, A.toObject = function(w, $) {
                                if (!$) $ = {};
                                var j = {};
                                if ($.defaults) j.quantile = 0, j.value = 0;
                                if (w.quantile != null && w.hasOwnProperty("quantile")) j.quantile = $.json && !isFinite(w.quantile) ? String(w.quantile) : w.quantile;
                                if (w.value != null && w.hasOwnProperty("value")) j.value = $.json && !isFinite(w.value) ? String(w.value) : w.value;
                                return j
                            }, A.prototype.toJSON = function() {
                                return this.constructor.toObject(this, m5.util.toJSONOptions)
                            }, A.getTypeUrl = function(w) {
                                if (w === void 0) w = "type.googleapis.com";
                                return w + "/opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile"
                            }, A
                        }(), Y
                    }(), z.Exemplar = function() {
                        function Y(O) {
                            if (this.filteredAttributes = [], O) {
                                for (var w = Object.keys(O), $ = 0; $ < w.length; ++$)
                                    if (O[w[$]] != null) this[w[$]] = O[w[$]]
                            }
                        }
                        Y.prototype.filteredAttributes = t6.emptyArray, Y.prototype.timeUnixNano = null, Y.prototype.asDouble = null, Y.prototype.asInt = null, Y.prototype.spanId = null, Y.prototype.traceId = null;
                        var A;
                        return Object.defineProperty(Y.prototype, "value", {
                            get: t6.oneOfGetter(A = ["asDouble", "asInt"]),
                            set: t6.oneOfSetter(A)
                        }), Y.create = function(w) {
                            return new Y(w)
                        }, Y.encode = function(w, $) {
                            if (!$) $ = t9.create();
                            if (w.timeUnixNano != null && Object.hasOwnProperty.call(w, "timeUnixNano")) $.uint32(17).fixed64(w.timeUnixNano);
                            if (w.asDouble != null && Object.hasOwnProperty.call(w, "asDouble")) $.uint32(25).double(w.asDouble);
                            if (w.spanId != null && Object.hasOwnProperty.call(w, "spanId")) $.uint32(34).bytes(w.spanId);
                            if (w.traceId != null && Object.hasOwnProperty.call(w, "traceId")) $.uint32(42).bytes(w.traceId);
                            if (w.asInt != null && Object.hasOwnProperty.call(w, "asInt")) $.uint32(49).sfixed64(w.asInt);
                            if (w.filteredAttributes != null && w.filteredAttributes.length)
                                for (var j = 0; j < w.filteredAttributes.length; ++j) r6.opentelemetry.proto.common.v1.KeyValue.encode(w.filteredAttributes[j], $.uint32(58).fork()).ldelim();
                            return $
                        }, Y.encodeDelimited = function(w, $) {
                            return this.encode(w, $).ldelim()
                        }, Y.decode = function(w, $, j) {
                            if (!(w instanceof S1)) w = S1.create(w);
                            var H = $ === void 0 ? w.len : w.pos + $,
                                J = new r6.opentelemetry.proto.metrics.v1.Exemplar;
                            while (w.pos < H) {
                                var X = w.uint32();
                                if (X === j) break;
                                switch (X >>> 3) {
                                    case 7: {
                                        if (!(J.filteredAttributes && J.filteredAttributes.length)) J.filteredAttributes = [];
                                        J.filteredAttributes.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.timeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 3: {
                                        J.asDouble = w.double();
                                        break
                                    }
                                    case 6: {
                                        J.asInt = w.sfixed64();
                                        break
                                    }
                                    case 4: {
                                        J.spanId = w.bytes();
                                        break
                                    }
                                    case 5: {
                                        J.traceId = w.bytes();
                                        break
                                    }
                                    default:
                                        w.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, Y.decodeDelimited = function(w) {
                            if (!(w instanceof S1)) w = new S1(w);
                            return this.decode(w, w.uint32())
                        }, Y.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            var $ = {};
                            if (w.filteredAttributes != null && w.hasOwnProperty("filteredAttributes")) {
                                if (!Array.isArray(w.filteredAttributes)) return "filteredAttributes: array expected";
                                for (var j = 0; j < w.filteredAttributes.length; ++j) {
                                    var H = r6.opentelemetry.proto.common.v1.KeyValue.verify(w.filteredAttributes[j]);
                                    if (H) return "filteredAttributes." + H
                                }
                            }
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano")) {
                                if (!t6.isInteger(w.timeUnixNano) && !(w.timeUnixNano && t6.isInteger(w.timeUnixNano.low) && t6.isInteger(w.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (w.asDouble != null && w.hasOwnProperty("asDouble")) {
                                if ($.value = 1, typeof w.asDouble !== "number") return "asDouble: number expected"
                            }
                            if (w.asInt != null && w.hasOwnProperty("asInt")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, !t6.isInteger(w.asInt) && !(w.asInt && t6.isInteger(w.asInt.low) && t6.isInteger(w.asInt.high))) return "asInt: integer|Long expected"
                            }
                            if (w.spanId != null && w.hasOwnProperty("spanId")) {
                                if (!(w.spanId && typeof w.spanId.length === "number" || t6.isString(w.spanId))) return "spanId: buffer expected"
                            }
                            if (w.traceId != null && w.hasOwnProperty("traceId")) {
                                if (!(w.traceId && typeof w.traceId.length === "number" || t6.isString(w.traceId))) return "traceId: buffer expected"
                            }
                            return null
                        }, Y.fromObject = function(w) {
                            if (w instanceof r6.opentelemetry.proto.metrics.v1.Exemplar) return w;
                            var $ = new r6.opentelemetry.proto.metrics.v1.Exemplar;
                            if (w.filteredAttributes) {
                                if (!Array.isArray(w.filteredAttributes)) throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: array expected");
                                $.filteredAttributes = [];
                                for (var j = 0; j < w.filteredAttributes.length; ++j) {
                                    if (typeof w.filteredAttributes[j] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: object expected");
                                    $.filteredAttributes[j] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.filteredAttributes[j])
                                }
                            }
                            if (w.timeUnixNano != null) {
                                if (t6.Long)($.timeUnixNano = t6.Long.fromValue(w.timeUnixNano)).unsigned = !1;
                                else if (typeof w.timeUnixNano === "string") $.timeUnixNano = parseInt(w.timeUnixNano, 10);
                                else if (typeof w.timeUnixNano === "number") $.timeUnixNano = w.timeUnixNano;
                                else if (typeof w.timeUnixNano === "object") $.timeUnixNano = new t6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.asDouble != null) $.asDouble = Number(w.asDouble);
                            if (w.asInt != null) {
                                if (t6.Long)($.asInt = t6.Long.fromValue(w.asInt)).unsigned = !1;
                                else if (typeof w.asInt === "string") $.asInt = parseInt(w.asInt, 10);
                                else if (typeof w.asInt === "number") $.asInt = w.asInt;
                                else if (typeof w.asInt === "object") $.asInt = new t6.LongBits(w.asInt.low >>> 0, w.asInt.high >>> 0).toNumber()
                            }
                            if (w.spanId != null) {
                                if (typeof w.spanId === "string") t6.base64.decode(w.spanId, $.spanId = t6.newBuffer(t6.base64.length(w.spanId)), 0);
                                else if (w.spanId.length >= 0) $.spanId = w.spanId
                            }
                            if (w.traceId != null) {
                                if (typeof w.traceId === "string") t6.base64.decode(w.traceId, $.traceId = t6.newBuffer(t6.base64.length(w.traceId)), 0);
                                else if (w.traceId.length >= 0) $.traceId = w.traceId
                            }
                            return $
                        }, Y.toObject = function(w, $) {
                            if (!$) $ = {};
                            var j = {};
                            if ($.arrays || $.defaults) j.filteredAttributes = [];
                            if ($.defaults) {
                                if (t6.Long) {
                                    var H = new t6.Long(0, 0, !1);
                                    j.timeUnixNano = $.longs === String ? H.toString() : $.longs === Number ? H.toNumber() : H
                                } else j.timeUnixNano = $.longs === String ? "0" : 0;
                                if ($.bytes === String) j.spanId = "";
                                else if (j.spanId = [], $.bytes !== Array) j.spanId = t6.newBuffer(j.spanId);
                                if ($.bytes === String) j.traceId = "";
                                else if (j.traceId = [], $.bytes !== Array) j.traceId = t6.newBuffer(j.traceId)
                            }
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano"))
                                if (typeof w.timeUnixNano === "number") j.timeUnixNano = $.longs === String ? String(w.timeUnixNano) : w.timeUnixNano;
                                else j.timeUnixNano = $.longs === String ? t6.Long.prototype.toString.call(w.timeUnixNano) : $.longs === Number ? new t6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber() : w.timeUnixNano;
                            if (w.asDouble != null && w.hasOwnProperty("asDouble")) {
                                if (j.asDouble = $.json && !isFinite(w.asDouble) ? String(w.asDouble) : w.asDouble, $.oneofs) j.value = "asDouble"
                            }
                            if (w.spanId != null && w.hasOwnProperty("spanId")) j.spanId = $.bytes === String ? t6.base64.encode(w.spanId, 0, w.spanId.length) : $.bytes === Array ? Array.prototype.slice.call(w.spanId) : w.spanId;
                            if (w.traceId != null && w.hasOwnProperty("traceId")) j.traceId = $.bytes === String ? t6.base64.encode(w.traceId, 0, w.traceId.length) : $.bytes === Array ? Array.prototype.slice.call(w.traceId) : w.traceId;
                            if (w.asInt != null && w.hasOwnProperty("asInt")) {
                                if (typeof w.asInt === "number") j.asInt = $.longs === String ? String(w.asInt) : w.asInt;
                                else j.asInt = $.longs === String ? t6.Long.prototype.toString.call(w.asInt) : $.longs === Number ? new t6.LongBits(w.asInt.low >>> 0, w.asInt.high >>> 0).toNumber() : w.asInt;
                                if ($.oneofs) j.value = "asInt"
                            }
                            if (w.filteredAttributes && w.filteredAttributes.length) {
                                j.filteredAttributes = [];
                                for (var J = 0; J < w.filteredAttributes.length; ++J) j.filteredAttributes[J] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(w.filteredAttributes[J], $)
                            }
                            return j
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.Exemplar"
                        }, Y
                    }(), z
                }(), _
            }(), K.logs = function() {
                var _ = {};
                return _.v1 = function() {
                    var z = {};
                    return z.LogsData = function() {
                        function Y(A) {
                            if (this.resourceLogs = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.resourceLogs = t6.emptyArray, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.resourceLogs != null && O.resourceLogs.length)
                                for (var $ = 0; $ < O.resourceLogs.length; ++$) r6.opentelemetry.proto.logs.v1.ResourceLogs.encode(O.resourceLogs[$], w.uint32(10).fork()).ldelim();
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.logs.v1.LogsData;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(H.resourceLogs && H.resourceLogs.length)) H.resourceLogs = [];
                                        H.resourceLogs.push(r6.opentelemetry.proto.logs.v1.ResourceLogs.decode(O, O.uint32()));
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.resourceLogs != null && O.hasOwnProperty("resourceLogs")) {
                                if (!Array.isArray(O.resourceLogs)) return "resourceLogs: array expected";
                                for (var w = 0; w < O.resourceLogs.length; ++w) {
                                    var $ = r6.opentelemetry.proto.logs.v1.ResourceLogs.verify(O.resourceLogs[w]);
                                    if ($) return "resourceLogs." + $
                                }
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.logs.v1.LogsData) return O;
                            var w = new r6.opentelemetry.proto.logs.v1.LogsData;
                            if (O.resourceLogs) {
                                if (!Array.isArray(O.resourceLogs)) throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: array expected");
                                w.resourceLogs = [];
                                for (var $ = 0; $ < O.resourceLogs.length; ++$) {
                                    if (typeof O.resourceLogs[$] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: object expected");
                                    w.resourceLogs[$] = r6.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(O.resourceLogs[$])
                                }
                            }
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.resourceLogs = [];
                            if (O.resourceLogs && O.resourceLogs.length) {
                                $.resourceLogs = [];
                                for (var j = 0; j < O.resourceLogs.length; ++j) $.resourceLogs[j] = r6.opentelemetry.proto.logs.v1.ResourceLogs.toObject(O.resourceLogs[j], w)
                            }
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.logs.v1.LogsData"
                        }, Y
                    }(), z.ResourceLogs = function() {
                        function Y(A) {
                            if (this.scopeLogs = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.resource = null, Y.prototype.scopeLogs = t6.emptyArray, Y.prototype.schemaUrl = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.resource != null && Object.hasOwnProperty.call(O, "resource")) r6.opentelemetry.proto.resource.v1.Resource.encode(O.resource, w.uint32(10).fork()).ldelim();
                            if (O.scopeLogs != null && O.scopeLogs.length)
                                for (var $ = 0; $ < O.scopeLogs.length; ++$) r6.opentelemetry.proto.logs.v1.ScopeLogs.encode(O.scopeLogs[$], w.uint32(18).fork()).ldelim();
                            if (O.schemaUrl != null && Object.hasOwnProperty.call(O, "schemaUrl")) w.uint32(26).string(O.schemaUrl);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.logs.v1.ResourceLogs;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        H.resource = r6.opentelemetry.proto.resource.v1.Resource.decode(O, O.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(H.scopeLogs && H.scopeLogs.length)) H.scopeLogs = [];
                                        H.scopeLogs.push(r6.opentelemetry.proto.logs.v1.ScopeLogs.decode(O, O.uint32()));
                                        break
                                    }
                                    case 3: {
                                        H.schemaUrl = O.string();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.resource != null && O.hasOwnProperty("resource")) {
                                var w = r6.opentelemetry.proto.resource.v1.Resource.verify(O.resource);
                                if (w) return "resource." + w
                            }
                            if (O.scopeLogs != null && O.hasOwnProperty("scopeLogs")) {
                                if (!Array.isArray(O.scopeLogs)) return "scopeLogs: array expected";
                                for (var $ = 0; $ < O.scopeLogs.length; ++$) {
                                    var w = r6.opentelemetry.proto.logs.v1.ScopeLogs.verify(O.scopeLogs[$]);
                                    if (w) return "scopeLogs." + w
                                }
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) {
                                if (!t6.isString(O.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.logs.v1.ResourceLogs) return O;
                            var w = new r6.opentelemetry.proto.logs.v1.ResourceLogs;
                            if (O.resource != null) {
                                if (typeof O.resource !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.resource: object expected");
                                w.resource = r6.opentelemetry.proto.resource.v1.Resource.fromObject(O.resource)
                            }
                            if (O.scopeLogs) {
                                if (!Array.isArray(O.scopeLogs)) throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: array expected");
                                w.scopeLogs = [];
                                for (var $ = 0; $ < O.scopeLogs.length; ++$) {
                                    if (typeof O.scopeLogs[$] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: object expected");
                                    w.scopeLogs[$] = r6.opentelemetry.proto.logs.v1.ScopeLogs.fromObject(O.scopeLogs[$])
                                }
                            }
                            if (O.schemaUrl != null) w.schemaUrl = String(O.schemaUrl);
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.scopeLogs = [];
                            if (w.defaults) $.resource = null, $.schemaUrl = "";
                            if (O.resource != null && O.hasOwnProperty("resource")) $.resource = r6.opentelemetry.proto.resource.v1.Resource.toObject(O.resource, w);
                            if (O.scopeLogs && O.scopeLogs.length) {
                                $.scopeLogs = [];
                                for (var j = 0; j < O.scopeLogs.length; ++j) $.scopeLogs[j] = r6.opentelemetry.proto.logs.v1.ScopeLogs.toObject(O.scopeLogs[j], w)
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) $.schemaUrl = O.schemaUrl;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.logs.v1.ResourceLogs"
                        }, Y
                    }(), z.ScopeLogs = function() {
                        function Y(A) {
                            if (this.logRecords = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.scope = null, Y.prototype.logRecords = t6.emptyArray, Y.prototype.schemaUrl = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.scope != null && Object.hasOwnProperty.call(O, "scope")) r6.opentelemetry.proto.common.v1.InstrumentationScope.encode(O.scope, w.uint32(10).fork()).ldelim();
                            if (O.logRecords != null && O.logRecords.length)
                                for (var $ = 0; $ < O.logRecords.length; ++$) r6.opentelemetry.proto.logs.v1.LogRecord.encode(O.logRecords[$], w.uint32(18).fork()).ldelim();
                            if (O.schemaUrl != null && Object.hasOwnProperty.call(O, "schemaUrl")) w.uint32(26).string(O.schemaUrl);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.logs.v1.ScopeLogs;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        H.scope = r6.opentelemetry.proto.common.v1.InstrumentationScope.decode(O, O.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(H.logRecords && H.logRecords.length)) H.logRecords = [];
                                        H.logRecords.push(r6.opentelemetry.proto.logs.v1.LogRecord.decode(O, O.uint32()));
                                        break
                                    }
                                    case 3: {
                                        H.schemaUrl = O.string();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.scope != null && O.hasOwnProperty("scope")) {
                                var w = r6.opentelemetry.proto.common.v1.InstrumentationScope.verify(O.scope);
                                if (w) return "scope." + w
                            }
                            if (O.logRecords != null && O.hasOwnProperty("logRecords")) {
                                if (!Array.isArray(O.logRecords)) return "logRecords: array expected";
                                for (var $ = 0; $ < O.logRecords.length; ++$) {
                                    var w = r6.opentelemetry.proto.logs.v1.LogRecord.verify(O.logRecords[$]);
                                    if (w) return "logRecords." + w
                                }
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) {
                                if (!t6.isString(O.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.logs.v1.ScopeLogs) return O;
                            var w = new r6.opentelemetry.proto.logs.v1.ScopeLogs;
                            if (O.scope != null) {
                                if (typeof O.scope !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.scope: object expected");
                                w.scope = r6.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(O.scope)
                            }
                            if (O.logRecords) {
                                if (!Array.isArray(O.logRecords)) throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: array expected");
                                w.logRecords = [];
                                for (var $ = 0; $ < O.logRecords.length; ++$) {
                                    if (typeof O.logRecords[$] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: object expected");
                                    w.logRecords[$] = r6.opentelemetry.proto.logs.v1.LogRecord.fromObject(O.logRecords[$])
                                }
                            }
                            if (O.schemaUrl != null) w.schemaUrl = String(O.schemaUrl);
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.logRecords = [];
                            if (w.defaults) $.scope = null, $.schemaUrl = "";
                            if (O.scope != null && O.hasOwnProperty("scope")) $.scope = r6.opentelemetry.proto.common.v1.InstrumentationScope.toObject(O.scope, w);
                            if (O.logRecords && O.logRecords.length) {
                                $.logRecords = [];
                                for (var j = 0; j < O.logRecords.length; ++j) $.logRecords[j] = r6.opentelemetry.proto.logs.v1.LogRecord.toObject(O.logRecords[j], w)
                            }
                            if (O.schemaUrl != null && O.hasOwnProperty("schemaUrl")) $.schemaUrl = O.schemaUrl;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.logs.v1.ScopeLogs"
                        }, Y
                    }(), z.SeverityNumber = function() {
                        var Y = {},
                            A = Object.create(Y);
                        return A[Y[0] = "SEVERITY_NUMBER_UNSPECIFIED"] = 0, A[Y[1] = "SEVERITY_NUMBER_TRACE"] = 1, A[Y[2] = "SEVERITY_NUMBER_TRACE2"] = 2, A[Y[3] = "SEVERITY_NUMBER_TRACE3"] = 3, A[Y[4] = "SEVERITY_NUMBER_TRACE4"] = 4, A[Y[5] = "SEVERITY_NUMBER_DEBUG"] = 5, A[Y[6] = "SEVERITY_NUMBER_DEBUG2"] = 6, A[Y[7] = "SEVERITY_NUMBER_DEBUG3"] = 7, A[Y[8] = "SEVERITY_NUMBER_DEBUG4"] = 8, A[Y[9] = "SEVERITY_NUMBER_INFO"] = 9, A[Y[10] = "SEVERITY_NUMBER_INFO2"] = 10, A[Y[11] = "SEVERITY_NUMBER_INFO3"] = 11, A[Y[12] = "SEVERITY_NUMBER_INFO4"] = 12, A[Y[13] = "SEVERITY_NUMBER_WARN"] = 13, A[Y[14] = "SEVERITY_NUMBER_WARN2"] = 14, A[Y[15] = "SEVERITY_NUMBER_WARN3"] = 15, A[Y[16] = "SEVERITY_NUMBER_WARN4"] = 16, A[Y[17] = "SEVERITY_NUMBER_ERROR"] = 17, A[Y[18] = "SEVERITY_NUMBER_ERROR2"] = 18, A[Y[19] = "SEVERITY_NUMBER_ERROR3"] = 19, A[Y[20] = "SEVERITY_NUMBER_ERROR4"] = 20, A[Y[21] = "SEVERITY_NUMBER_FATAL"] = 21, A[Y[22] = "SEVERITY_NUMBER_FATAL2"] = 22, A[Y[23] = "SEVERITY_NUMBER_FATAL3"] = 23, A[Y[24] = "SEVERITY_NUMBER_FATAL4"] = 24, A
                    }(), z.LogRecordFlags = function() {
                        var Y = {},
                            A = Object.create(Y);
                        return A[Y[0] = "LOG_RECORD_FLAGS_DO_NOT_USE"] = 0, A[Y[255] = "LOG_RECORD_FLAGS_TRACE_FLAGS_MASK"] = 255, A
                    }(), z.LogRecord = function() {
                        function Y(A) {
                            if (this.attributes = [], A) {
                                for (var O = Object.keys(A), w = 0; w < O.length; ++w)
                                    if (A[O[w]] != null) this[O[w]] = A[O[w]]
                            }
                        }
                        return Y.prototype.timeUnixNano = null, Y.prototype.observedTimeUnixNano = null, Y.prototype.severityNumber = null, Y.prototype.severityText = null, Y.prototype.body = null, Y.prototype.attributes = t6.emptyArray, Y.prototype.droppedAttributesCount = null, Y.prototype.flags = null, Y.prototype.traceId = null, Y.prototype.spanId = null, Y.prototype.eventName = null, Y.create = function(O) {
                            return new Y(O)
                        }, Y.encode = function(O, w) {
                            if (!w) w = t9.create();
                            if (O.timeUnixNano != null && Object.hasOwnProperty.call(O, "timeUnixNano")) w.uint32(9).fixed64(O.timeUnixNano);
                            if (O.severityNumber != null && Object.hasOwnProperty.call(O, "severityNumber")) w.uint32(16).int32(O.severityNumber);
                            if (O.severityText != null && Object.hasOwnProperty.call(O, "severityText")) w.uint32(26).string(O.severityText);
                            if (O.body != null && Object.hasOwnProperty.call(O, "body")) r6.opentelemetry.proto.common.v1.AnyValue.encode(O.body, w.uint32(42).fork()).ldelim();
                            if (O.attributes != null && O.attributes.length)
                                for (var $ = 0; $ < O.attributes.length; ++$) r6.opentelemetry.proto.common.v1.KeyValue.encode(O.attributes[$], w.uint32(50).fork()).ldelim();
                            if (O.droppedAttributesCount != null && Object.hasOwnProperty.call(O, "droppedAttributesCount")) w.uint32(56).uint32(O.droppedAttributesCount);
                            if (O.flags != null && Object.hasOwnProperty.call(O, "flags")) w.uint32(69).fixed32(O.flags);
                            if (O.traceId != null && Object.hasOwnProperty.call(O, "traceId")) w.uint32(74).bytes(O.traceId);
                            if (O.spanId != null && Object.hasOwnProperty.call(O, "spanId")) w.uint32(82).bytes(O.spanId);
                            if (O.observedTimeUnixNano != null && Object.hasOwnProperty.call(O, "observedTimeUnixNano")) w.uint32(89).fixed64(O.observedTimeUnixNano);
                            if (O.eventName != null && Object.hasOwnProperty.call(O, "eventName")) w.uint32(98).string(O.eventName);
                            return w
                        }, Y.encodeDelimited = function(O, w) {
                            return this.encode(O, w).ldelim()
                        }, Y.decode = function(O, w, $) {
                            if (!(O instanceof S1)) O = S1.create(O);
                            var j = w === void 0 ? O.len : O.pos + w,
                                H = new r6.opentelemetry.proto.logs.v1.LogRecord;
                            while (O.pos < j) {
                                var J = O.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        H.timeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 11: {
                                        H.observedTimeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 2: {
                                        H.severityNumber = O.int32();
                                        break
                                    }
                                    case 3: {
                                        H.severityText = O.string();
                                        break
                                    }
                                    case 5: {
                                        H.body = r6.opentelemetry.proto.common.v1.AnyValue.decode(O, O.uint32());
                                        break
                                    }
                                    case 6: {
                                        if (!(H.attributes && H.attributes.length)) H.attributes = [];
                                        H.attributes.push(r6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    case 7: {
                                        H.droppedAttributesCount = O.uint32();
                                        break
                                    }
                                    case 8: {
                                        H.flags = O.fixed32();
                                        break
                                    }
                                    case 9: {
                                        H.traceId = O.bytes();
                                        break
                                    }
                                    case 10: {
                                        H.spanId = O.bytes();
                                        break
                                    }
                                    case 12: {
                                        H.eventName = O.string();
                                        break
                                    }
                                    default:
                                        O.skipType(J & 7);
                                        break
                                }
                            }
                            return H
                        }, Y.decodeDelimited = function(O) {
                            if (!(O instanceof S1)) O = new S1(O);
                            return this.decode(O, O.uint32())
                        }, Y.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano")) {
                                if (!t6.isInteger(O.timeUnixNano) && !(O.timeUnixNano && t6.isInteger(O.timeUnixNano.low) && t6.isInteger(O.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (O.observedTimeUnixNano != null && O.hasOwnProperty("observedTimeUnixNano")) {
                                if (!t6.isInteger(O.observedTimeUnixNano) && !(O.observedTimeUnixNano && t6.isInteger(O.observedTimeUnixNano.low) && t6.isInteger(O.observedTimeUnixNano.high))) return "observedTimeUnixNano: integer|Long expected"
                            }
                            if (O.severityNumber != null && O.hasOwnProperty("severityNumber")) switch (O.severityNumber) {
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
                            if (O.severityText != null && O.hasOwnProperty("severityText")) {
                                if (!t6.isString(O.severityText)) return "severityText: string expected"
                            }
                            if (O.body != null && O.hasOwnProperty("body")) {
                                var w = r6.opentelemetry.proto.common.v1.AnyValue.verify(O.body);
                                if (w) return "body." + w
                            }
                            if (O.attributes != null && O.hasOwnProperty("attributes")) {
                                if (!Array.isArray(O.attributes)) return "attributes: array expected";
                                for (var $ = 0; $ < O.attributes.length; ++$) {
                                    var w = r6.opentelemetry.proto.common.v1.KeyValue.verify(O.attributes[$]);
                                    if (w) return "attributes." + w
                                }
                            }
                            if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) {
                                if (!t6.isInteger(O.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            if (O.flags != null && O.hasOwnProperty("flags")) {
                                if (!t6.isInteger(O.flags)) return "flags: integer expected"
                            }
                            if (O.traceId != null && O.hasOwnProperty("traceId")) {
                                if (!(O.traceId && typeof O.traceId.length === "number" || t6.isString(O.traceId))) return "traceId: buffer expected"
                            }
                            if (O.spanId != null && O.hasOwnProperty("spanId")) {
                                if (!(O.spanId && typeof O.spanId.length === "number" || t6.isString(O.spanId))) return "spanId: buffer expected"
                            }
                            if (O.eventName != null && O.hasOwnProperty("eventName")) {
                                if (!t6.isString(O.eventName)) return "eventName: string expected"
                            }
                            return null
                        }, Y.fromObject = function(O) {
                            if (O instanceof r6.opentelemetry.proto.logs.v1.LogRecord) return O;
                            var w = new r6.opentelemetry.proto.logs.v1.LogRecord;
                            if (O.timeUnixNano != null) {
                                if (t6.Long)(w.timeUnixNano = t6.Long.fromValue(O.timeUnixNano)).unsigned = !1;
                                else if (typeof O.timeUnixNano === "string") w.timeUnixNano = parseInt(O.timeUnixNano, 10);
                                else if (typeof O.timeUnixNano === "number") w.timeUnixNano = O.timeUnixNano;
                                else if (typeof O.timeUnixNano === "object") w.timeUnixNano = new t6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.observedTimeUnixNano != null) {
                                if (t6.Long)(w.observedTimeUnixNano = t6.Long.fromValue(O.observedTimeUnixNano)).unsigned = !1;
                                else if (typeof O.observedTimeUnixNano === "string") w.observedTimeUnixNano = parseInt(O.observedTimeUnixNano, 10);
                                else if (typeof O.observedTimeUnixNano === "number") w.observedTimeUnixNano = O.observedTimeUnixNano;
                                else if (typeof O.observedTimeUnixNano === "object") w.observedTimeUnixNano = new t6.LongBits(O.observedTimeUnixNano.low >>> 0, O.observedTimeUnixNano.high >>> 0).toNumber()
                            }
                            switch (O.severityNumber) {
                                default:
                                    if (typeof O.severityNumber === "number") {
                                        w.severityNumber = O.severityNumber;
                                        break
                                    }
                                    break;
                                case "SEVERITY_NUMBER_UNSPECIFIED":
                                case 0:
                                    w.severityNumber = 0;
                                    break;
                                case "SEVERITY_NUMBER_TRACE":
                                case 1:
                                    w.severityNumber = 1;
                                    break;
                                case "SEVERITY_NUMBER_TRACE2":
                                case 2:
                                    w.severityNumber = 2;
                                    break;
                                case "SEVERITY_NUMBER_TRACE3":
                                case 3:
                                    w.severityNumber = 3;
                                    break;
                                case "SEVERITY_NUMBER_TRACE4":
                                case 4:
                                    w.severityNumber = 4;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG":
                                case 5:
                                    w.severityNumber = 5;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG2":
                                case 6:
                                    w.severityNumber = 6;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG3":
                                case 7:
                                    w.severityNumber = 7;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG4":
                                case 8:
                                    w.severityNumber = 8;
                                    break;
                                case "SEVERITY_NUMBER_INFO":
                                case 9:
                                    w.severityNumber = 9;
                                    break;
                                case "SEVERITY_NUMBER_INFO2":
                                case 10:
                                    w.severityNumber = 10;
                                    break;
                                case "SEVERITY_NUMBER_INFO3":
                                case 11:
                                    w.severityNumber = 11;
                                    break;
                                case "SEVERITY_NUMBER_INFO4":
                                case 12:
                                    w.severityNumber = 12;
                                    break;
                                case "SEVERITY_NUMBER_WARN":
                                case 13:
                                    w.severityNumber = 13;
                                    break;
                                case "SEVERITY_NUMBER_WARN2":
                                case 14:
                                    w.severityNumber = 14;
                                    break;
                                case "SEVERITY_NUMBER_WARN3":
                                case 15:
                                    w.severityNumber = 15;
                                    break;
                                case "SEVERITY_NUMBER_WARN4":
                                case 16:
                                    w.severityNumber = 16;
                                    break;
                                case "SEVERITY_NUMBER_ERROR":
                                case 17:
                                    w.severityNumber = 17;
                                    break;
                                case "SEVERITY_NUMBER_ERROR2":
                                case 18:
                                    w.severityNumber = 18;
                                    break;
                                case "SEVERITY_NUMBER_ERROR3":
                                case 19:
                                    w.severityNumber = 19;
                                    break;
                                case "SEVERITY_NUMBER_ERROR4":
                                case 20:
                                    w.severityNumber = 20;
                                    break;
                                case "SEVERITY_NUMBER_FATAL":
                                case 21:
                                    w.severityNumber = 21;
                                    break;
                                case "SEVERITY_NUMBER_FATAL2":
                                case 22:
                                    w.severityNumber = 22;
                                    break;
                                case "SEVERITY_NUMBER_FATAL3":
                                case 23:
                                    w.severityNumber = 23;
                                    break;
                                case "SEVERITY_NUMBER_FATAL4":
                                case 24:
                                    w.severityNumber = 24;
                                    break
                            }
                            if (O.severityText != null) w.severityText = String(O.severityText);
                            if (O.body != null) {
                                if (typeof O.body !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.body: object expected");
                                w.body = r6.opentelemetry.proto.common.v1.AnyValue.fromObject(O.body)
                            }
                            if (O.attributes) {
                                if (!Array.isArray(O.attributes)) throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: array expected");
                                w.attributes = [];
                                for (var $ = 0; $ < O.attributes.length; ++$) {
                                    if (typeof O.attributes[$] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: object expected");
                                    w.attributes[$] = r6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.attributes[$])
                                }
                            }
                            if (O.droppedAttributesCount != null) w.droppedAttributesCount = O.droppedAttributesCount >>> 0;
                            if (O.flags != null) w.flags = O.flags >>> 0;
                            if (O.traceId != null) {
                                if (typeof O.traceId === "string") t6.base64.decode(O.traceId, w.traceId = t6.newBuffer(t6.base64.length(O.traceId)), 0);
                                else if (O.traceId.length >= 0) w.traceId = O.traceId
                            }
                            if (O.spanId != null) {
                                if (typeof O.spanId === "string") t6.base64.decode(O.spanId, w.spanId = t6.newBuffer(t6.base64.length(O.spanId)), 0);
                                else if (O.spanId.length >= 0) w.spanId = O.spanId
                            }
                            if (O.eventName != null) w.eventName = String(O.eventName);
                            return w
                        }, Y.toObject = function(O, w) {
                            if (!w) w = {};
                            var $ = {};
                            if (w.arrays || w.defaults) $.attributes = [];
                            if (w.defaults) {
                                if (t6.Long) {
                                    var j = new t6.Long(0, 0, !1);
                                    $.timeUnixNano = w.longs === String ? j.toString() : w.longs === Number ? j.toNumber() : j
                                } else $.timeUnixNano = w.longs === String ? "0" : 0;
                                if ($.severityNumber = w.enums === String ? "SEVERITY_NUMBER_UNSPECIFIED" : 0, $.severityText = "", $.body = null, $.droppedAttributesCount = 0, $.flags = 0, w.bytes === String) $.traceId = "";
                                else if ($.traceId = [], w.bytes !== Array) $.traceId = t6.newBuffer($.traceId);
                                if (w.bytes === String) $.spanId = "";
                                else if ($.spanId = [], w.bytes !== Array) $.spanId = t6.newBuffer($.spanId);
                                if (t6.Long) {
                                    var j = new t6.Long(0, 0, !1);
                                    $.observedTimeUnixNano = w.longs === String ? j.toString() : w.longs === Number ? j.toNumber() : j
                                } else $.observedTimeUnixNano = w.longs === String ? "0" : 0;
                                $.eventName = ""
                            }
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano"))
                                if (typeof O.timeUnixNano === "number") $.timeUnixNano = w.longs === String ? String(O.timeUnixNano) : O.timeUnixNano;
                                else $.timeUnixNano = w.longs === String ? t6.Long.prototype.toString.call(O.timeUnixNano) : w.longs === Number ? new t6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber() : O.timeUnixNano;
                            if (O.severityNumber != null && O.hasOwnProperty("severityNumber")) $.severityNumber = w.enums === String ? r6.opentelemetry.proto.logs.v1.SeverityNumber[O.severityNumber] === void 0 ? O.severityNumber : r6.opentelemetry.proto.logs.v1.SeverityNumber[O.severityNumber] : O.severityNumber;
                            if (O.severityText != null && O.hasOwnProperty("severityText")) $.severityText = O.severityText;
                            if (O.body != null && O.hasOwnProperty("body")) $.body = r6.opentelemetry.proto.common.v1.AnyValue.toObject(O.body, w);
                            if (O.attributes && O.attributes.length) {
                                $.attributes = [];
                                for (var H = 0; H < O.attributes.length; ++H) $.attributes[H] = r6.opentelemetry.proto.common.v1.KeyValue.toObject(O.attributes[H], w)
                            }
                            if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) $.droppedAttributesCount = O.droppedAttributesCount;
                            if (O.flags != null && O.hasOwnProperty("flags")) $.flags = O.flags;
                            if (O.traceId != null && O.hasOwnProperty("traceId")) $.traceId = w.bytes === String ? t6.base64.encode(O.traceId, 0, O.traceId.length) : w.bytes === Array ? Array.prototype.slice.call(O.traceId) : O.traceId;
                            if (O.spanId != null && O.hasOwnProperty("spanId")) $.spanId = w.bytes === String ? t6.base64.encode(O.spanId, 0, O.spanId.length) : w.bytes === Array ? Array.prototype.slice.call(O.spanId) : O.spanId;
                            if (O.observedTimeUnixNano != null && O.hasOwnProperty("observedTimeUnixNano"))
                                if (typeof O.observedTimeUnixNano === "number") $.observedTimeUnixNano = w.longs === String ? String(O.observedTimeUnixNano) : O.observedTimeUnixNano;
                                else $.observedTimeUnixNano = w.longs === String ? t6.Long.prototype.toString.call(O.observedTimeUnixNano) : w.longs === Number ? new t6.LongBits(O.observedTimeUnixNano.low >>> 0, O.observedTimeUnixNano.high >>> 0).toNumber() : O.observedTimeUnixNano;
                            if (O.eventName != null && O.hasOwnProperty("eventName")) $.eventName = O.eventName;
                            return $
                        }, Y.prototype.toJSON = function() {
                            return this.constructor.toObject(this, m5.util.toJSONOptions)
                        }, Y.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.logs.v1.LogRecord"
                        }, Y
                    }(), z
                }(), _
            }(), K
        }(), q
    }();
    ms4.exports = r6
})