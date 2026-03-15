
// @from(Ln 293887, Col 4)
Mf1 = x((VR4, kR4) => {
    Object.defineProperty(VR4, "__esModule", {
        value: !0
    });
    var oq = hh8(),
        $8 = oq.Reader,
        n5 = oq.Writer,
        r6 = oq.util,
        p6 = oq.roots.default || (oq.roots.default = {});
    p6.opentelemetry = function() {
        var A = {};
        return A.proto = function() {
            var q = {};
            return q.common = function() {
                var K = {};
                return K.v1 = function() {
                    var Y = {};
                    return Y.AnyValue = function() {
                        function z(w) {
                            if (w) {
                                for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                    if (w[O[$]] != null) this[O[$]] = w[O[$]]
                            }
                        }
                        z.prototype.stringValue = null, z.prototype.boolValue = null, z.prototype.intValue = null, z.prototype.doubleValue = null, z.prototype.arrayValue = null, z.prototype.kvlistValue = null, z.prototype.bytesValue = null;
                        var _;
                        return Object.defineProperty(z.prototype, "value", {
                            get: r6.oneOfGetter(_ = ["stringValue", "boolValue", "intValue", "doubleValue", "arrayValue", "kvlistValue", "bytesValue"]),
                            set: r6.oneOfSetter(_)
                        }), z.create = function(O) {
                            return new z(O)
                        }, z.encode = function(O, $) {
                            if (!$) $ = n5.create();
                            if (O.stringValue != null && Object.hasOwnProperty.call(O, "stringValue")) $.uint32(10).string(O.stringValue);
                            if (O.boolValue != null && Object.hasOwnProperty.call(O, "boolValue")) $.uint32(16).bool(O.boolValue);
                            if (O.intValue != null && Object.hasOwnProperty.call(O, "intValue")) $.uint32(24).int64(O.intValue);
                            if (O.doubleValue != null && Object.hasOwnProperty.call(O, "doubleValue")) $.uint32(33).double(O.doubleValue);
                            if (O.arrayValue != null && Object.hasOwnProperty.call(O, "arrayValue")) p6.opentelemetry.proto.common.v1.ArrayValue.encode(O.arrayValue, $.uint32(42).fork()).ldelim();
                            if (O.kvlistValue != null && Object.hasOwnProperty.call(O, "kvlistValue")) p6.opentelemetry.proto.common.v1.KeyValueList.encode(O.kvlistValue, $.uint32(50).fork()).ldelim();
                            if (O.bytesValue != null && Object.hasOwnProperty.call(O, "bytesValue")) $.uint32(58).bytes(O.bytesValue);
                            return $
                        }, z.encodeDelimited = function(O, $) {
                            return this.encode(O, $).ldelim()
                        }, z.decode = function(O, $, H) {
                            if (!(O instanceof $8)) O = $8.create(O);
                            var j = $ === void 0 ? O.len : O.pos + $,
                                J = new p6.opentelemetry.proto.common.v1.AnyValue;
                            while (O.pos < j) {
                                var M = O.uint32();
                                if (M === H) break;
                                switch (M >>> 3) {
                                    case 1: {
                                        J.stringValue = O.string();
                                        break
                                    }
                                    case 2: {
                                        J.boolValue = O.bool();
                                        break
                                    }
                                    case 3: {
                                        J.intValue = O.int64();
                                        break
                                    }
                                    case 4: {
                                        J.doubleValue = O.double();
                                        break
                                    }
                                    case 5: {
                                        J.arrayValue = p6.opentelemetry.proto.common.v1.ArrayValue.decode(O, O.uint32());
                                        break
                                    }
                                    case 6: {
                                        J.kvlistValue = p6.opentelemetry.proto.common.v1.KeyValueList.decode(O, O.uint32());
                                        break
                                    }
                                    case 7: {
                                        J.bytesValue = O.bytes();
                                        break
                                    }
                                    default:
                                        O.skipType(M & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(O) {
                            if (!(O instanceof $8)) O = new $8(O);
                            return this.decode(O, O.uint32())
                        }, z.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            var $ = {};
                            if (O.stringValue != null && O.hasOwnProperty("stringValue")) {
                                if ($.value = 1, !r6.isString(O.stringValue)) return "stringValue: string expected"
                            }
                            if (O.boolValue != null && O.hasOwnProperty("boolValue")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, typeof O.boolValue !== "boolean") return "boolValue: boolean expected"
                            }
                            if (O.intValue != null && O.hasOwnProperty("intValue")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, !r6.isInteger(O.intValue) && !(O.intValue && r6.isInteger(O.intValue.low) && r6.isInteger(O.intValue.high))) return "intValue: integer|Long expected"
                            }
                            if (O.doubleValue != null && O.hasOwnProperty("doubleValue")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, typeof O.doubleValue !== "number") return "doubleValue: number expected"
                            }
                            if (O.arrayValue != null && O.hasOwnProperty("arrayValue")) {
                                if ($.value === 1) return "value: multiple values";
                                $.value = 1;
                                {
                                    var H = p6.opentelemetry.proto.common.v1.ArrayValue.verify(O.arrayValue);
                                    if (H) return "arrayValue." + H
                                }
                            }
                            if (O.kvlistValue != null && O.hasOwnProperty("kvlistValue")) {
                                if ($.value === 1) return "value: multiple values";
                                $.value = 1;
                                {
                                    var H = p6.opentelemetry.proto.common.v1.KeyValueList.verify(O.kvlistValue);
                                    if (H) return "kvlistValue." + H
                                }
                            }
                            if (O.bytesValue != null && O.hasOwnProperty("bytesValue")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, !(O.bytesValue && typeof O.bytesValue.length === "number" || r6.isString(O.bytesValue))) return "bytesValue: buffer expected"
                            }
                            return null
                        }, z.fromObject = function(O) {
                            if (O instanceof p6.opentelemetry.proto.common.v1.AnyValue) return O;
                            var $ = new p6.opentelemetry.proto.common.v1.AnyValue;
                            if (O.stringValue != null) $.stringValue = String(O.stringValue);
                            if (O.boolValue != null) $.boolValue = Boolean(O.boolValue);
                            if (O.intValue != null) {
                                if (r6.Long)($.intValue = r6.Long.fromValue(O.intValue)).unsigned = !1;
                                else if (typeof O.intValue === "string") $.intValue = parseInt(O.intValue, 10);
                                else if (typeof O.intValue === "number") $.intValue = O.intValue;
                                else if (typeof O.intValue === "object") $.intValue = new r6.LongBits(O.intValue.low >>> 0, O.intValue.high >>> 0).toNumber()
                            }
                            if (O.doubleValue != null) $.doubleValue = Number(O.doubleValue);
                            if (O.arrayValue != null) {
                                if (typeof O.arrayValue !== "object") throw TypeError(".opentelemetry.proto.common.v1.AnyValue.arrayValue: object expected");
                                $.arrayValue = p6.opentelemetry.proto.common.v1.ArrayValue.fromObject(O.arrayValue)
                            }
                            if (O.kvlistValue != null) {
                                if (typeof O.kvlistValue !== "object") throw TypeError(".opentelemetry.proto.common.v1.AnyValue.kvlistValue: object expected");
                                $.kvlistValue = p6.opentelemetry.proto.common.v1.KeyValueList.fromObject(O.kvlistValue)
                            }
                            if (O.bytesValue != null) {
                                if (typeof O.bytesValue === "string") r6.base64.decode(O.bytesValue, $.bytesValue = r6.newBuffer(r6.base64.length(O.bytesValue)), 0);
                                else if (O.bytesValue.length >= 0) $.bytesValue = O.bytesValue
                            }
                            return $
                        }, z.toObject = function(O, $) {
                            if (!$) $ = {};
                            var H = {};
                            if (O.stringValue != null && O.hasOwnProperty("stringValue")) {
                                if (H.stringValue = O.stringValue, $.oneofs) H.value = "stringValue"
                            }
                            if (O.boolValue != null && O.hasOwnProperty("boolValue")) {
                                if (H.boolValue = O.boolValue, $.oneofs) H.value = "boolValue"
                            }
                            if (O.intValue != null && O.hasOwnProperty("intValue")) {
                                if (typeof O.intValue === "number") H.intValue = $.longs === String ? String(O.intValue) : O.intValue;
                                else H.intValue = $.longs === String ? r6.Long.prototype.toString.call(O.intValue) : $.longs === Number ? new r6.LongBits(O.intValue.low >>> 0, O.intValue.high >>> 0).toNumber() : O.intValue;
                                if ($.oneofs) H.value = "intValue"
                            }
                            if (O.doubleValue != null && O.hasOwnProperty("doubleValue")) {
                                if (H.doubleValue = $.json && !isFinite(O.doubleValue) ? String(O.doubleValue) : O.doubleValue, $.oneofs) H.value = "doubleValue"
                            }
                            if (O.arrayValue != null && O.hasOwnProperty("arrayValue")) {
                                if (H.arrayValue = p6.opentelemetry.proto.common.v1.ArrayValue.toObject(O.arrayValue, $), $.oneofs) H.value = "arrayValue"
                            }
                            if (O.kvlistValue != null && O.hasOwnProperty("kvlistValue")) {
                                if (H.kvlistValue = p6.opentelemetry.proto.common.v1.KeyValueList.toObject(O.kvlistValue, $), $.oneofs) H.value = "kvlistValue"
                            }
                            if (O.bytesValue != null && O.hasOwnProperty("bytesValue")) {
                                if (H.bytesValue = $.bytes === String ? r6.base64.encode(O.bytesValue, 0, O.bytesValue.length) : $.bytes === Array ? Array.prototype.slice.call(O.bytesValue) : O.bytesValue, $.oneofs) H.value = "bytesValue"
                            }
                            return H
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.common.v1.AnyValue"
                        }, z
                    }(), Y.ArrayValue = function() {
                        function z(_) {
                            if (this.values = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.values = r6.emptyArray, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.values != null && w.values.length)
                                for (var $ = 0; $ < w.values.length; ++$) p6.opentelemetry.proto.common.v1.AnyValue.encode(w.values[$], O.uint32(10).fork()).ldelim();
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.common.v1.ArrayValue;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(j.values && j.values.length)) j.values = [];
                                        j.values.push(p6.opentelemetry.proto.common.v1.AnyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.values != null && w.hasOwnProperty("values")) {
                                if (!Array.isArray(w.values)) return "values: array expected";
                                for (var O = 0; O < w.values.length; ++O) {
                                    var $ = p6.opentelemetry.proto.common.v1.AnyValue.verify(w.values[O]);
                                    if ($) return "values." + $
                                }
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.common.v1.ArrayValue) return w;
                            var O = new p6.opentelemetry.proto.common.v1.ArrayValue;
                            if (w.values) {
                                if (!Array.isArray(w.values)) throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: array expected");
                                O.values = [];
                                for (var $ = 0; $ < w.values.length; ++$) {
                                    if (typeof w.values[$] !== "object") throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: object expected");
                                    O.values[$] = p6.opentelemetry.proto.common.v1.AnyValue.fromObject(w.values[$])
                                }
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.values = [];
                            if (w.values && w.values.length) {
                                $.values = [];
                                for (var H = 0; H < w.values.length; ++H) $.values[H] = p6.opentelemetry.proto.common.v1.AnyValue.toObject(w.values[H], O)
                            }
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.common.v1.ArrayValue"
                        }, z
                    }(), Y.KeyValueList = function() {
                        function z(_) {
                            if (this.values = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.values = r6.emptyArray, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.values != null && w.values.length)
                                for (var $ = 0; $ < w.values.length; ++$) p6.opentelemetry.proto.common.v1.KeyValue.encode(w.values[$], O.uint32(10).fork()).ldelim();
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.common.v1.KeyValueList;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(j.values && j.values.length)) j.values = [];
                                        j.values.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.values != null && w.hasOwnProperty("values")) {
                                if (!Array.isArray(w.values)) return "values: array expected";
                                for (var O = 0; O < w.values.length; ++O) {
                                    var $ = p6.opentelemetry.proto.common.v1.KeyValue.verify(w.values[O]);
                                    if ($) return "values." + $
                                }
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.common.v1.KeyValueList) return w;
                            var O = new p6.opentelemetry.proto.common.v1.KeyValueList;
                            if (w.values) {
                                if (!Array.isArray(w.values)) throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: array expected");
                                O.values = [];
                                for (var $ = 0; $ < w.values.length; ++$) {
                                    if (typeof w.values[$] !== "object") throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: object expected");
                                    O.values[$] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.values[$])
                                }
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.values = [];
                            if (w.values && w.values.length) {
                                $.values = [];
                                for (var H = 0; H < w.values.length; ++H) $.values[H] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(w.values[H], O)
                            }
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.common.v1.KeyValueList"
                        }, z
                    }(), Y.KeyValue = function() {
                        function z(_) {
                            if (_) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.key = null, z.prototype.value = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.key != null && Object.hasOwnProperty.call(w, "key")) O.uint32(10).string(w.key);
                            if (w.value != null && Object.hasOwnProperty.call(w, "value")) p6.opentelemetry.proto.common.v1.AnyValue.encode(w.value, O.uint32(18).fork()).ldelim();
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.common.v1.KeyValue;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        j.key = w.string();
                                        break
                                    }
                                    case 2: {
                                        j.value = p6.opentelemetry.proto.common.v1.AnyValue.decode(w, w.uint32());
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.key != null && w.hasOwnProperty("key")) {
                                if (!r6.isString(w.key)) return "key: string expected"
                            }
                            if (w.value != null && w.hasOwnProperty("value")) {
                                var O = p6.opentelemetry.proto.common.v1.AnyValue.verify(w.value);
                                if (O) return "value." + O
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.common.v1.KeyValue) return w;
                            var O = new p6.opentelemetry.proto.common.v1.KeyValue;
                            if (w.key != null) O.key = String(w.key);
                            if (w.value != null) {
                                if (typeof w.value !== "object") throw TypeError(".opentelemetry.proto.common.v1.KeyValue.value: object expected");
                                O.value = p6.opentelemetry.proto.common.v1.AnyValue.fromObject(w.value)
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.defaults) $.key = "", $.value = null;
                            if (w.key != null && w.hasOwnProperty("key")) $.key = w.key;
                            if (w.value != null && w.hasOwnProperty("value")) $.value = p6.opentelemetry.proto.common.v1.AnyValue.toObject(w.value, O);
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.common.v1.KeyValue"
                        }, z
                    }(), Y.InstrumentationScope = function() {
                        function z(_) {
                            if (this.attributes = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.name = null, z.prototype.version = null, z.prototype.attributes = r6.emptyArray, z.prototype.droppedAttributesCount = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.name != null && Object.hasOwnProperty.call(w, "name")) O.uint32(10).string(w.name);
                            if (w.version != null && Object.hasOwnProperty.call(w, "version")) O.uint32(18).string(w.version);
                            if (w.attributes != null && w.attributes.length)
                                for (var $ = 0; $ < w.attributes.length; ++$) p6.opentelemetry.proto.common.v1.KeyValue.encode(w.attributes[$], O.uint32(26).fork()).ldelim();
                            if (w.droppedAttributesCount != null && Object.hasOwnProperty.call(w, "droppedAttributesCount")) O.uint32(32).uint32(w.droppedAttributesCount);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.common.v1.InstrumentationScope;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        j.name = w.string();
                                        break
                                    }
                                    case 2: {
                                        j.version = w.string();
                                        break
                                    }
                                    case 3: {
                                        if (!(j.attributes && j.attributes.length)) j.attributes = [];
                                        j.attributes.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    case 4: {
                                        j.droppedAttributesCount = w.uint32();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.name != null && w.hasOwnProperty("name")) {
                                if (!r6.isString(w.name)) return "name: string expected"
                            }
                            if (w.version != null && w.hasOwnProperty("version")) {
                                if (!r6.isString(w.version)) return "version: string expected"
                            }
                            if (w.attributes != null && w.hasOwnProperty("attributes")) {
                                if (!Array.isArray(w.attributes)) return "attributes: array expected";
                                for (var O = 0; O < w.attributes.length; ++O) {
                                    var $ = p6.opentelemetry.proto.common.v1.KeyValue.verify(w.attributes[O]);
                                    if ($) return "attributes." + $
                                }
                            }
                            if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) {
                                if (!r6.isInteger(w.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.common.v1.InstrumentationScope) return w;
                            var O = new p6.opentelemetry.proto.common.v1.InstrumentationScope;
                            if (w.name != null) O.name = String(w.name);
                            if (w.version != null) O.version = String(w.version);
                            if (w.attributes) {
                                if (!Array.isArray(w.attributes)) throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: array expected");
                                O.attributes = [];
                                for (var $ = 0; $ < w.attributes.length; ++$) {
                                    if (typeof w.attributes[$] !== "object") throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: object expected");
                                    O.attributes[$] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.attributes[$])
                                }
                            }
                            if (w.droppedAttributesCount != null) O.droppedAttributesCount = w.droppedAttributesCount >>> 0;
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.attributes = [];
                            if (O.defaults) $.name = "", $.version = "", $.droppedAttributesCount = 0;
                            if (w.name != null && w.hasOwnProperty("name")) $.name = w.name;
                            if (w.version != null && w.hasOwnProperty("version")) $.version = w.version;
                            if (w.attributes && w.attributes.length) {
                                $.attributes = [];
                                for (var H = 0; H < w.attributes.length; ++H) $.attributes[H] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(w.attributes[H], O)
                            }
                            if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) $.droppedAttributesCount = w.droppedAttributesCount;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.common.v1.InstrumentationScope"
                        }, z
                    }(), Y.EntityRef = function() {
                        function z(_) {
                            if (this.idKeys = [], this.descriptionKeys = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.schemaUrl = null, z.prototype.type = null, z.prototype.idKeys = r6.emptyArray, z.prototype.descriptionKeys = r6.emptyArray, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.schemaUrl != null && Object.hasOwnProperty.call(w, "schemaUrl")) O.uint32(10).string(w.schemaUrl);
                            if (w.type != null && Object.hasOwnProperty.call(w, "type")) O.uint32(18).string(w.type);
                            if (w.idKeys != null && w.idKeys.length)
                                for (var $ = 0; $ < w.idKeys.length; ++$) O.uint32(26).string(w.idKeys[$]);
                            if (w.descriptionKeys != null && w.descriptionKeys.length)
                                for (var $ = 0; $ < w.descriptionKeys.length; ++$) O.uint32(34).string(w.descriptionKeys[$]);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.common.v1.EntityRef;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        j.schemaUrl = w.string();
                                        break
                                    }
                                    case 2: {
                                        j.type = w.string();
                                        break
                                    }
                                    case 3: {
                                        if (!(j.idKeys && j.idKeys.length)) j.idKeys = [];
                                        j.idKeys.push(w.string());
                                        break
                                    }
                                    case 4: {
                                        if (!(j.descriptionKeys && j.descriptionKeys.length)) j.descriptionKeys = [];
                                        j.descriptionKeys.push(w.string());
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) {
                                if (!r6.isString(w.schemaUrl)) return "schemaUrl: string expected"
                            }
                            if (w.type != null && w.hasOwnProperty("type")) {
                                if (!r6.isString(w.type)) return "type: string expected"
                            }
                            if (w.idKeys != null && w.hasOwnProperty("idKeys")) {
                                if (!Array.isArray(w.idKeys)) return "idKeys: array expected";
                                for (var O = 0; O < w.idKeys.length; ++O)
                                    if (!r6.isString(w.idKeys[O])) return "idKeys: string[] expected"
                            }
                            if (w.descriptionKeys != null && w.hasOwnProperty("descriptionKeys")) {
                                if (!Array.isArray(w.descriptionKeys)) return "descriptionKeys: array expected";
                                for (var O = 0; O < w.descriptionKeys.length; ++O)
                                    if (!r6.isString(w.descriptionKeys[O])) return "descriptionKeys: string[] expected"
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.common.v1.EntityRef) return w;
                            var O = new p6.opentelemetry.proto.common.v1.EntityRef;
                            if (w.schemaUrl != null) O.schemaUrl = String(w.schemaUrl);
                            if (w.type != null) O.type = String(w.type);
                            if (w.idKeys) {
                                if (!Array.isArray(w.idKeys)) throw TypeError(".opentelemetry.proto.common.v1.EntityRef.idKeys: array expected");
                                O.idKeys = [];
                                for (var $ = 0; $ < w.idKeys.length; ++$) O.idKeys[$] = String(w.idKeys[$])
                            }
                            if (w.descriptionKeys) {
                                if (!Array.isArray(w.descriptionKeys)) throw TypeError(".opentelemetry.proto.common.v1.EntityRef.descriptionKeys: array expected");
                                O.descriptionKeys = [];
                                for (var $ = 0; $ < w.descriptionKeys.length; ++$) O.descriptionKeys[$] = String(w.descriptionKeys[$])
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.idKeys = [], $.descriptionKeys = [];
                            if (O.defaults) $.schemaUrl = "", $.type = "";
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) $.schemaUrl = w.schemaUrl;
                            if (w.type != null && w.hasOwnProperty("type")) $.type = w.type;
                            if (w.idKeys && w.idKeys.length) {
                                $.idKeys = [];
                                for (var H = 0; H < w.idKeys.length; ++H) $.idKeys[H] = w.idKeys[H]
                            }
                            if (w.descriptionKeys && w.descriptionKeys.length) {
                                $.descriptionKeys = [];
                                for (var H = 0; H < w.descriptionKeys.length; ++H) $.descriptionKeys[H] = w.descriptionKeys[H]
                            }
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.common.v1.EntityRef"
                        }, z
                    }(), Y
                }(), K
            }(), q.resource = function() {
                var K = {};
                return K.v1 = function() {
                    var Y = {};
                    return Y.Resource = function() {
                        function z(_) {
                            if (this.attributes = [], this.entityRefs = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.attributes = r6.emptyArray, z.prototype.droppedAttributesCount = null, z.prototype.entityRefs = r6.emptyArray, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.attributes != null && w.attributes.length)
                                for (var $ = 0; $ < w.attributes.length; ++$) p6.opentelemetry.proto.common.v1.KeyValue.encode(w.attributes[$], O.uint32(10).fork()).ldelim();
                            if (w.droppedAttributesCount != null && Object.hasOwnProperty.call(w, "droppedAttributesCount")) O.uint32(16).uint32(w.droppedAttributesCount);
                            if (w.entityRefs != null && w.entityRefs.length)
                                for (var $ = 0; $ < w.entityRefs.length; ++$) p6.opentelemetry.proto.common.v1.EntityRef.encode(w.entityRefs[$], O.uint32(26).fork()).ldelim();
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.resource.v1.Resource;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(j.attributes && j.attributes.length)) j.attributes = [];
                                        j.attributes.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    case 2: {
                                        j.droppedAttributesCount = w.uint32();
                                        break
                                    }
                                    case 3: {
                                        if (!(j.entityRefs && j.entityRefs.length)) j.entityRefs = [];
                                        j.entityRefs.push(p6.opentelemetry.proto.common.v1.EntityRef.decode(w, w.uint32()));
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.attributes != null && w.hasOwnProperty("attributes")) {
                                if (!Array.isArray(w.attributes)) return "attributes: array expected";
                                for (var O = 0; O < w.attributes.length; ++O) {
                                    var $ = p6.opentelemetry.proto.common.v1.KeyValue.verify(w.attributes[O]);
                                    if ($) return "attributes." + $
                                }
                            }
                            if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) {
                                if (!r6.isInteger(w.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            if (w.entityRefs != null && w.hasOwnProperty("entityRefs")) {
                                if (!Array.isArray(w.entityRefs)) return "entityRefs: array expected";
                                for (var O = 0; O < w.entityRefs.length; ++O) {
                                    var $ = p6.opentelemetry.proto.common.v1.EntityRef.verify(w.entityRefs[O]);
                                    if ($) return "entityRefs." + $
                                }
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.resource.v1.Resource) return w;
                            var O = new p6.opentelemetry.proto.resource.v1.Resource;
                            if (w.attributes) {
                                if (!Array.isArray(w.attributes)) throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: array expected");
                                O.attributes = [];
                                for (var $ = 0; $ < w.attributes.length; ++$) {
                                    if (typeof w.attributes[$] !== "object") throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: object expected");
                                    O.attributes[$] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.attributes[$])
                                }
                            }
                            if (w.droppedAttributesCount != null) O.droppedAttributesCount = w.droppedAttributesCount >>> 0;
                            if (w.entityRefs) {
                                if (!Array.isArray(w.entityRefs)) throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: array expected");
                                O.entityRefs = [];
                                for (var $ = 0; $ < w.entityRefs.length; ++$) {
                                    if (typeof w.entityRefs[$] !== "object") throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: object expected");
                                    O.entityRefs[$] = p6.opentelemetry.proto.common.v1.EntityRef.fromObject(w.entityRefs[$])
                                }
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.attributes = [], $.entityRefs = [];
                            if (O.defaults) $.droppedAttributesCount = 0;
                            if (w.attributes && w.attributes.length) {
                                $.attributes = [];
                                for (var H = 0; H < w.attributes.length; ++H) $.attributes[H] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(w.attributes[H], O)
                            }
                            if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) $.droppedAttributesCount = w.droppedAttributesCount;
                            if (w.entityRefs && w.entityRefs.length) {
                                $.entityRefs = [];
                                for (var H = 0; H < w.entityRefs.length; ++H) $.entityRefs[H] = p6.opentelemetry.proto.common.v1.EntityRef.toObject(w.entityRefs[H], O)
                            }
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.resource.v1.Resource"
                        }, z
                    }(), Y
                }(), K
            }(), q.trace = function() {
                var K = {};
                return K.v1 = function() {
                    var Y = {};
                    return Y.TracesData = function() {
                        function z(_) {
                            if (this.resourceSpans = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.resourceSpans = r6.emptyArray, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.resourceSpans != null && w.resourceSpans.length)
                                for (var $ = 0; $ < w.resourceSpans.length; ++$) p6.opentelemetry.proto.trace.v1.ResourceSpans.encode(w.resourceSpans[$], O.uint32(10).fork()).ldelim();
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.trace.v1.TracesData;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(j.resourceSpans && j.resourceSpans.length)) j.resourceSpans = [];
                                        j.resourceSpans.push(p6.opentelemetry.proto.trace.v1.ResourceSpans.decode(w, w.uint32()));
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.resourceSpans != null && w.hasOwnProperty("resourceSpans")) {
                                if (!Array.isArray(w.resourceSpans)) return "resourceSpans: array expected";
                                for (var O = 0; O < w.resourceSpans.length; ++O) {
                                    var $ = p6.opentelemetry.proto.trace.v1.ResourceSpans.verify(w.resourceSpans[O]);
                                    if ($) return "resourceSpans." + $
                                }
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.trace.v1.TracesData) return w;
                            var O = new p6.opentelemetry.proto.trace.v1.TracesData;
                            if (w.resourceSpans) {
                                if (!Array.isArray(w.resourceSpans)) throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: array expected");
                                O.resourceSpans = [];
                                for (var $ = 0; $ < w.resourceSpans.length; ++$) {
                                    if (typeof w.resourceSpans[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: object expected");
                                    O.resourceSpans[$] = p6.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(w.resourceSpans[$])
                                }
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.resourceSpans = [];
                            if (w.resourceSpans && w.resourceSpans.length) {
                                $.resourceSpans = [];
                                for (var H = 0; H < w.resourceSpans.length; ++H) $.resourceSpans[H] = p6.opentelemetry.proto.trace.v1.ResourceSpans.toObject(w.resourceSpans[H], O)
                            }
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.trace.v1.TracesData"
                        }, z
                    }(), Y.ResourceSpans = function() {
                        function z(_) {
                            if (this.scopeSpans = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.resource = null, z.prototype.scopeSpans = r6.emptyArray, z.prototype.schemaUrl = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.resource != null && Object.hasOwnProperty.call(w, "resource")) p6.opentelemetry.proto.resource.v1.Resource.encode(w.resource, O.uint32(10).fork()).ldelim();
                            if (w.scopeSpans != null && w.scopeSpans.length)
                                for (var $ = 0; $ < w.scopeSpans.length; ++$) p6.opentelemetry.proto.trace.v1.ScopeSpans.encode(w.scopeSpans[$], O.uint32(18).fork()).ldelim();
                            if (w.schemaUrl != null && Object.hasOwnProperty.call(w, "schemaUrl")) O.uint32(26).string(w.schemaUrl);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.trace.v1.ResourceSpans;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        j.resource = p6.opentelemetry.proto.resource.v1.Resource.decode(w, w.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(j.scopeSpans && j.scopeSpans.length)) j.scopeSpans = [];
                                        j.scopeSpans.push(p6.opentelemetry.proto.trace.v1.ScopeSpans.decode(w, w.uint32()));
                                        break
                                    }
                                    case 3: {
                                        j.schemaUrl = w.string();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.resource != null && w.hasOwnProperty("resource")) {
                                var O = p6.opentelemetry.proto.resource.v1.Resource.verify(w.resource);
                                if (O) return "resource." + O
                            }
                            if (w.scopeSpans != null && w.hasOwnProperty("scopeSpans")) {
                                if (!Array.isArray(w.scopeSpans)) return "scopeSpans: array expected";
                                for (var $ = 0; $ < w.scopeSpans.length; ++$) {
                                    var O = p6.opentelemetry.proto.trace.v1.ScopeSpans.verify(w.scopeSpans[$]);
                                    if (O) return "scopeSpans." + O
                                }
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) {
                                if (!r6.isString(w.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.trace.v1.ResourceSpans) return w;
                            var O = new p6.opentelemetry.proto.trace.v1.ResourceSpans;
                            if (w.resource != null) {
                                if (typeof w.resource !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.resource: object expected");
                                O.resource = p6.opentelemetry.proto.resource.v1.Resource.fromObject(w.resource)
                            }
                            if (w.scopeSpans) {
                                if (!Array.isArray(w.scopeSpans)) throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: array expected");
                                O.scopeSpans = [];
                                for (var $ = 0; $ < w.scopeSpans.length; ++$) {
                                    if (typeof w.scopeSpans[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: object expected");
                                    O.scopeSpans[$] = p6.opentelemetry.proto.trace.v1.ScopeSpans.fromObject(w.scopeSpans[$])
                                }
                            }
                            if (w.schemaUrl != null) O.schemaUrl = String(w.schemaUrl);
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.scopeSpans = [];
                            if (O.defaults) $.resource = null, $.schemaUrl = "";
                            if (w.resource != null && w.hasOwnProperty("resource")) $.resource = p6.opentelemetry.proto.resource.v1.Resource.toObject(w.resource, O);
                            if (w.scopeSpans && w.scopeSpans.length) {
                                $.scopeSpans = [];
                                for (var H = 0; H < w.scopeSpans.length; ++H) $.scopeSpans[H] = p6.opentelemetry.proto.trace.v1.ScopeSpans.toObject(w.scopeSpans[H], O)
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) $.schemaUrl = w.schemaUrl;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.trace.v1.ResourceSpans"
                        }, z
                    }(), Y.ScopeSpans = function() {
                        function z(_) {
                            if (this.spans = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.scope = null, z.prototype.spans = r6.emptyArray, z.prototype.schemaUrl = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.scope != null && Object.hasOwnProperty.call(w, "scope")) p6.opentelemetry.proto.common.v1.InstrumentationScope.encode(w.scope, O.uint32(10).fork()).ldelim();
                            if (w.spans != null && w.spans.length)
                                for (var $ = 0; $ < w.spans.length; ++$) p6.opentelemetry.proto.trace.v1.Span.encode(w.spans[$], O.uint32(18).fork()).ldelim();
                            if (w.schemaUrl != null && Object.hasOwnProperty.call(w, "schemaUrl")) O.uint32(26).string(w.schemaUrl);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.trace.v1.ScopeSpans;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        j.scope = p6.opentelemetry.proto.common.v1.InstrumentationScope.decode(w, w.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(j.spans && j.spans.length)) j.spans = [];
                                        j.spans.push(p6.opentelemetry.proto.trace.v1.Span.decode(w, w.uint32()));
                                        break
                                    }
                                    case 3: {
                                        j.schemaUrl = w.string();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.scope != null && w.hasOwnProperty("scope")) {
                                var O = p6.opentelemetry.proto.common.v1.InstrumentationScope.verify(w.scope);
                                if (O) return "scope." + O
                            }
                            if (w.spans != null && w.hasOwnProperty("spans")) {
                                if (!Array.isArray(w.spans)) return "spans: array expected";
                                for (var $ = 0; $ < w.spans.length; ++$) {
                                    var O = p6.opentelemetry.proto.trace.v1.Span.verify(w.spans[$]);
                                    if (O) return "spans." + O
                                }
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) {
                                if (!r6.isString(w.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.trace.v1.ScopeSpans) return w;
                            var O = new p6.opentelemetry.proto.trace.v1.ScopeSpans;
                            if (w.scope != null) {
                                if (typeof w.scope !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.scope: object expected");
                                O.scope = p6.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(w.scope)
                            }
                            if (w.spans) {
                                if (!Array.isArray(w.spans)) throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: array expected");
                                O.spans = [];
                                for (var $ = 0; $ < w.spans.length; ++$) {
                                    if (typeof w.spans[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: object expected");
                                    O.spans[$] = p6.opentelemetry.proto.trace.v1.Span.fromObject(w.spans[$])
                                }
                            }
                            if (w.schemaUrl != null) O.schemaUrl = String(w.schemaUrl);
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.spans = [];
                            if (O.defaults) $.scope = null, $.schemaUrl = "";
                            if (w.scope != null && w.hasOwnProperty("scope")) $.scope = p6.opentelemetry.proto.common.v1.InstrumentationScope.toObject(w.scope, O);
                            if (w.spans && w.spans.length) {
                                $.spans = [];
                                for (var H = 0; H < w.spans.length; ++H) $.spans[H] = p6.opentelemetry.proto.trace.v1.Span.toObject(w.spans[H], O)
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) $.schemaUrl = w.schemaUrl;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.trace.v1.ScopeSpans"
                        }, z
                    }(), Y.Span = function() {
                        function z(_) {
                            if (this.attributes = [], this.events = [], this.links = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.traceId = null, z.prototype.spanId = null, z.prototype.traceState = null, z.prototype.parentSpanId = null, z.prototype.flags = null, z.prototype.name = null, z.prototype.kind = null, z.prototype.startTimeUnixNano = null, z.prototype.endTimeUnixNano = null, z.prototype.attributes = r6.emptyArray, z.prototype.droppedAttributesCount = null, z.prototype.events = r6.emptyArray, z.prototype.droppedEventsCount = null, z.prototype.links = r6.emptyArray, z.prototype.droppedLinksCount = null, z.prototype.status = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.traceId != null && Object.hasOwnProperty.call(w, "traceId")) O.uint32(10).bytes(w.traceId);
                            if (w.spanId != null && Object.hasOwnProperty.call(w, "spanId")) O.uint32(18).bytes(w.spanId);
                            if (w.traceState != null && Object.hasOwnProperty.call(w, "traceState")) O.uint32(26).string(w.traceState);
                            if (w.parentSpanId != null && Object.hasOwnProperty.call(w, "parentSpanId")) O.uint32(34).bytes(w.parentSpanId);
                            if (w.name != null && Object.hasOwnProperty.call(w, "name")) O.uint32(42).string(w.name);
                            if (w.kind != null && Object.hasOwnProperty.call(w, "kind")) O.uint32(48).int32(w.kind);
                            if (w.startTimeUnixNano != null && Object.hasOwnProperty.call(w, "startTimeUnixNano")) O.uint32(57).fixed64(w.startTimeUnixNano);
                            if (w.endTimeUnixNano != null && Object.hasOwnProperty.call(w, "endTimeUnixNano")) O.uint32(65).fixed64(w.endTimeUnixNano);
                            if (w.attributes != null && w.attributes.length)
                                for (var $ = 0; $ < w.attributes.length; ++$) p6.opentelemetry.proto.common.v1.KeyValue.encode(w.attributes[$], O.uint32(74).fork()).ldelim();
                            if (w.droppedAttributesCount != null && Object.hasOwnProperty.call(w, "droppedAttributesCount")) O.uint32(80).uint32(w.droppedAttributesCount);
                            if (w.events != null && w.events.length)
                                for (var $ = 0; $ < w.events.length; ++$) p6.opentelemetry.proto.trace.v1.Span.Event.encode(w.events[$], O.uint32(90).fork()).ldelim();
                            if (w.droppedEventsCount != null && Object.hasOwnProperty.call(w, "droppedEventsCount")) O.uint32(96).uint32(w.droppedEventsCount);
                            if (w.links != null && w.links.length)
                                for (var $ = 0; $ < w.links.length; ++$) p6.opentelemetry.proto.trace.v1.Span.Link.encode(w.links[$], O.uint32(106).fork()).ldelim();
                            if (w.droppedLinksCount != null && Object.hasOwnProperty.call(w, "droppedLinksCount")) O.uint32(112).uint32(w.droppedLinksCount);
                            if (w.status != null && Object.hasOwnProperty.call(w, "status")) p6.opentelemetry.proto.trace.v1.Status.encode(w.status, O.uint32(122).fork()).ldelim();
                            if (w.flags != null && Object.hasOwnProperty.call(w, "flags")) O.uint32(133).fixed32(w.flags);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.trace.v1.Span;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        j.traceId = w.bytes();
                                        break
                                    }
                                    case 2: {
                                        j.spanId = w.bytes();
                                        break
                                    }
                                    case 3: {
                                        j.traceState = w.string();
                                        break
                                    }
                                    case 4: {
                                        j.parentSpanId = w.bytes();
                                        break
                                    }
                                    case 16: {
                                        j.flags = w.fixed32();
                                        break
                                    }
                                    case 5: {
                                        j.name = w.string();
                                        break
                                    }
                                    case 6: {
                                        j.kind = w.int32();
                                        break
                                    }
                                    case 7: {
                                        j.startTimeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 8: {
                                        j.endTimeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 9: {
                                        if (!(j.attributes && j.attributes.length)) j.attributes = [];
                                        j.attributes.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    case 10: {
                                        j.droppedAttributesCount = w.uint32();
                                        break
                                    }
                                    case 11: {
                                        if (!(j.events && j.events.length)) j.events = [];
                                        j.events.push(p6.opentelemetry.proto.trace.v1.Span.Event.decode(w, w.uint32()));
                                        break
                                    }
                                    case 12: {
                                        j.droppedEventsCount = w.uint32();
                                        break
                                    }
                                    case 13: {
                                        if (!(j.links && j.links.length)) j.links = [];
                                        j.links.push(p6.opentelemetry.proto.trace.v1.Span.Link.decode(w, w.uint32()));
                                        break
                                    }
                                    case 14: {
                                        j.droppedLinksCount = w.uint32();
                                        break
                                    }
                                    case 15: {
                                        j.status = p6.opentelemetry.proto.trace.v1.Status.decode(w, w.uint32());
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.traceId != null && w.hasOwnProperty("traceId")) {
                                if (!(w.traceId && typeof w.traceId.length === "number" || r6.isString(w.traceId))) return "traceId: buffer expected"
                            }
                            if (w.spanId != null && w.hasOwnProperty("spanId")) {
                                if (!(w.spanId && typeof w.spanId.length === "number" || r6.isString(w.spanId))) return "spanId: buffer expected"
                            }
                            if (w.traceState != null && w.hasOwnProperty("traceState")) {
                                if (!r6.isString(w.traceState)) return "traceState: string expected"
                            }
                            if (w.parentSpanId != null && w.hasOwnProperty("parentSpanId")) {
                                if (!(w.parentSpanId && typeof w.parentSpanId.length === "number" || r6.isString(w.parentSpanId))) return "parentSpanId: buffer expected"
                            }
                            if (w.flags != null && w.hasOwnProperty("flags")) {
                                if (!r6.isInteger(w.flags)) return "flags: integer expected"
                            }
                            if (w.name != null && w.hasOwnProperty("name")) {
                                if (!r6.isString(w.name)) return "name: string expected"
                            }
                            if (w.kind != null && w.hasOwnProperty("kind")) switch (w.kind) {
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
                            if (w.startTimeUnixNano != null && w.hasOwnProperty("startTimeUnixNano")) {
                                if (!r6.isInteger(w.startTimeUnixNano) && !(w.startTimeUnixNano && r6.isInteger(w.startTimeUnixNano.low) && r6.isInteger(w.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (w.endTimeUnixNano != null && w.hasOwnProperty("endTimeUnixNano")) {
                                if (!r6.isInteger(w.endTimeUnixNano) && !(w.endTimeUnixNano && r6.isInteger(w.endTimeUnixNano.low) && r6.isInteger(w.endTimeUnixNano.high))) return "endTimeUnixNano: integer|Long expected"
                            }
                            if (w.attributes != null && w.hasOwnProperty("attributes")) {
                                if (!Array.isArray(w.attributes)) return "attributes: array expected";
                                for (var O = 0; O < w.attributes.length; ++O) {
                                    var $ = p6.opentelemetry.proto.common.v1.KeyValue.verify(w.attributes[O]);
                                    if ($) return "attributes." + $
                                }
                            }
                            if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) {
                                if (!r6.isInteger(w.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            if (w.events != null && w.hasOwnProperty("events")) {
                                if (!Array.isArray(w.events)) return "events: array expected";
                                for (var O = 0; O < w.events.length; ++O) {
                                    var $ = p6.opentelemetry.proto.trace.v1.Span.Event.verify(w.events[O]);
                                    if ($) return "events." + $
                                }
                            }
                            if (w.droppedEventsCount != null && w.hasOwnProperty("droppedEventsCount")) {
                                if (!r6.isInteger(w.droppedEventsCount)) return "droppedEventsCount: integer expected"
                            }
                            if (w.links != null && w.hasOwnProperty("links")) {
                                if (!Array.isArray(w.links)) return "links: array expected";
                                for (var O = 0; O < w.links.length; ++O) {
                                    var $ = p6.opentelemetry.proto.trace.v1.Span.Link.verify(w.links[O]);
                                    if ($) return "links." + $
                                }
                            }
                            if (w.droppedLinksCount != null && w.hasOwnProperty("droppedLinksCount")) {
                                if (!r6.isInteger(w.droppedLinksCount)) return "droppedLinksCount: integer expected"
                            }
                            if (w.status != null && w.hasOwnProperty("status")) {
                                var $ = p6.opentelemetry.proto.trace.v1.Status.verify(w.status);
                                if ($) return "status." + $
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.trace.v1.Span) return w;
                            var O = new p6.opentelemetry.proto.trace.v1.Span;
                            if (w.traceId != null) {
                                if (typeof w.traceId === "string") r6.base64.decode(w.traceId, O.traceId = r6.newBuffer(r6.base64.length(w.traceId)), 0);
                                else if (w.traceId.length >= 0) O.traceId = w.traceId
                            }
                            if (w.spanId != null) {
                                if (typeof w.spanId === "string") r6.base64.decode(w.spanId, O.spanId = r6.newBuffer(r6.base64.length(w.spanId)), 0);
                                else if (w.spanId.length >= 0) O.spanId = w.spanId
                            }
                            if (w.traceState != null) O.traceState = String(w.traceState);
                            if (w.parentSpanId != null) {
                                if (typeof w.parentSpanId === "string") r6.base64.decode(w.parentSpanId, O.parentSpanId = r6.newBuffer(r6.base64.length(w.parentSpanId)), 0);
                                else if (w.parentSpanId.length >= 0) O.parentSpanId = w.parentSpanId
                            }
                            if (w.flags != null) O.flags = w.flags >>> 0;
                            if (w.name != null) O.name = String(w.name);
                            switch (w.kind) {
                                default:
                                    if (typeof w.kind === "number") {
                                        O.kind = w.kind;
                                        break
                                    }
                                    break;
                                case "SPAN_KIND_UNSPECIFIED":
                                case 0:
                                    O.kind = 0;
                                    break;
                                case "SPAN_KIND_INTERNAL":
                                case 1:
                                    O.kind = 1;
                                    break;
                                case "SPAN_KIND_SERVER":
                                case 2:
                                    O.kind = 2;
                                    break;
                                case "SPAN_KIND_CLIENT":
                                case 3:
                                    O.kind = 3;
                                    break;
                                case "SPAN_KIND_PRODUCER":
                                case 4:
                                    O.kind = 4;
                                    break;
                                case "SPAN_KIND_CONSUMER":
                                case 5:
                                    O.kind = 5;
                                    break
                            }
                            if (w.startTimeUnixNano != null) {
                                if (r6.Long)(O.startTimeUnixNano = r6.Long.fromValue(w.startTimeUnixNano)).unsigned = !1;
                                else if (typeof w.startTimeUnixNano === "string") O.startTimeUnixNano = parseInt(w.startTimeUnixNano, 10);
                                else if (typeof w.startTimeUnixNano === "number") O.startTimeUnixNano = w.startTimeUnixNano;
                                else if (typeof w.startTimeUnixNano === "object") O.startTimeUnixNano = new r6.LongBits(w.startTimeUnixNano.low >>> 0, w.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.endTimeUnixNano != null) {
                                if (r6.Long)(O.endTimeUnixNano = r6.Long.fromValue(w.endTimeUnixNano)).unsigned = !1;
                                else if (typeof w.endTimeUnixNano === "string") O.endTimeUnixNano = parseInt(w.endTimeUnixNano, 10);
                                else if (typeof w.endTimeUnixNano === "number") O.endTimeUnixNano = w.endTimeUnixNano;
                                else if (typeof w.endTimeUnixNano === "object") O.endTimeUnixNano = new r6.LongBits(w.endTimeUnixNano.low >>> 0, w.endTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.attributes) {
                                if (!Array.isArray(w.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: array expected");
                                O.attributes = [];
                                for (var $ = 0; $ < w.attributes.length; ++$) {
                                    if (typeof w.attributes[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: object expected");
                                    O.attributes[$] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.attributes[$])
                                }
                            }
                            if (w.droppedAttributesCount != null) O.droppedAttributesCount = w.droppedAttributesCount >>> 0;
                            if (w.events) {
                                if (!Array.isArray(w.events)) throw TypeError(".opentelemetry.proto.trace.v1.Span.events: array expected");
                                O.events = [];
                                for (var $ = 0; $ < w.events.length; ++$) {
                                    if (typeof w.events[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.events: object expected");
                                    O.events[$] = p6.opentelemetry.proto.trace.v1.Span.Event.fromObject(w.events[$])
                                }
                            }
                            if (w.droppedEventsCount != null) O.droppedEventsCount = w.droppedEventsCount >>> 0;
                            if (w.links) {
                                if (!Array.isArray(w.links)) throw TypeError(".opentelemetry.proto.trace.v1.Span.links: array expected");
                                O.links = [];
                                for (var $ = 0; $ < w.links.length; ++$) {
                                    if (typeof w.links[$] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.links: object expected");
                                    O.links[$] = p6.opentelemetry.proto.trace.v1.Span.Link.fromObject(w.links[$])
                                }
                            }
                            if (w.droppedLinksCount != null) O.droppedLinksCount = w.droppedLinksCount >>> 0;
                            if (w.status != null) {
                                if (typeof w.status !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.status: object expected");
                                O.status = p6.opentelemetry.proto.trace.v1.Status.fromObject(w.status)
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.attributes = [], $.events = [], $.links = [];
                            if (O.defaults) {
                                if (O.bytes === String) $.traceId = "";
                                else if ($.traceId = [], O.bytes !== Array) $.traceId = r6.newBuffer($.traceId);
                                if (O.bytes === String) $.spanId = "";
                                else if ($.spanId = [], O.bytes !== Array) $.spanId = r6.newBuffer($.spanId);
                                if ($.traceState = "", O.bytes === String) $.parentSpanId = "";
                                else if ($.parentSpanId = [], O.bytes !== Array) $.parentSpanId = r6.newBuffer($.parentSpanId);
                                if ($.name = "", $.kind = O.enums === String ? "SPAN_KIND_UNSPECIFIED" : 0, r6.Long) {
                                    var H = new r6.Long(0, 0, !1);
                                    $.startTimeUnixNano = O.longs === String ? H.toString() : O.longs === Number ? H.toNumber() : H
                                } else $.startTimeUnixNano = O.longs === String ? "0" : 0;
                                if (r6.Long) {
                                    var H = new r6.Long(0, 0, !1);
                                    $.endTimeUnixNano = O.longs === String ? H.toString() : O.longs === Number ? H.toNumber() : H
                                } else $.endTimeUnixNano = O.longs === String ? "0" : 0;
                                $.droppedAttributesCount = 0, $.droppedEventsCount = 0, $.droppedLinksCount = 0, $.status = null, $.flags = 0
                            }
                            if (w.traceId != null && w.hasOwnProperty("traceId")) $.traceId = O.bytes === String ? r6.base64.encode(w.traceId, 0, w.traceId.length) : O.bytes === Array ? Array.prototype.slice.call(w.traceId) : w.traceId;
                            if (w.spanId != null && w.hasOwnProperty("spanId")) $.spanId = O.bytes === String ? r6.base64.encode(w.spanId, 0, w.spanId.length) : O.bytes === Array ? Array.prototype.slice.call(w.spanId) : w.spanId;
                            if (w.traceState != null && w.hasOwnProperty("traceState")) $.traceState = w.traceState;
                            if (w.parentSpanId != null && w.hasOwnProperty("parentSpanId")) $.parentSpanId = O.bytes === String ? r6.base64.encode(w.parentSpanId, 0, w.parentSpanId.length) : O.bytes === Array ? Array.prototype.slice.call(w.parentSpanId) : w.parentSpanId;
                            if (w.name != null && w.hasOwnProperty("name")) $.name = w.name;
                            if (w.kind != null && w.hasOwnProperty("kind")) $.kind = O.enums === String ? p6.opentelemetry.proto.trace.v1.Span.SpanKind[w.kind] === void 0 ? w.kind : p6.opentelemetry.proto.trace.v1.Span.SpanKind[w.kind] : w.kind;
                            if (w.startTimeUnixNano != null && w.hasOwnProperty("startTimeUnixNano"))
                                if (typeof w.startTimeUnixNano === "number") $.startTimeUnixNano = O.longs === String ? String(w.startTimeUnixNano) : w.startTimeUnixNano;
                                else $.startTimeUnixNano = O.longs === String ? r6.Long.prototype.toString.call(w.startTimeUnixNano) : O.longs === Number ? new r6.LongBits(w.startTimeUnixNano.low >>> 0, w.startTimeUnixNano.high >>> 0).toNumber() : w.startTimeUnixNano;
                            if (w.endTimeUnixNano != null && w.hasOwnProperty("endTimeUnixNano"))
                                if (typeof w.endTimeUnixNano === "number") $.endTimeUnixNano = O.longs === String ? String(w.endTimeUnixNano) : w.endTimeUnixNano;
                                else $.endTimeUnixNano = O.longs === String ? r6.Long.prototype.toString.call(w.endTimeUnixNano) : O.longs === Number ? new r6.LongBits(w.endTimeUnixNano.low >>> 0, w.endTimeUnixNano.high >>> 0).toNumber() : w.endTimeUnixNano;
                            if (w.attributes && w.attributes.length) {
                                $.attributes = [];
                                for (var j = 0; j < w.attributes.length; ++j) $.attributes[j] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(w.attributes[j], O)
                            }
                            if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) $.droppedAttributesCount = w.droppedAttributesCount;
                            if (w.events && w.events.length) {
                                $.events = [];
                                for (var j = 0; j < w.events.length; ++j) $.events[j] = p6.opentelemetry.proto.trace.v1.Span.Event.toObject(w.events[j], O)
                            }
                            if (w.droppedEventsCount != null && w.hasOwnProperty("droppedEventsCount")) $.droppedEventsCount = w.droppedEventsCount;
                            if (w.links && w.links.length) {
                                $.links = [];
                                for (var j = 0; j < w.links.length; ++j) $.links[j] = p6.opentelemetry.proto.trace.v1.Span.Link.toObject(w.links[j], O)
                            }
                            if (w.droppedLinksCount != null && w.hasOwnProperty("droppedLinksCount")) $.droppedLinksCount = w.droppedLinksCount;
                            if (w.status != null && w.hasOwnProperty("status")) $.status = p6.opentelemetry.proto.trace.v1.Status.toObject(w.status, O);
                            if (w.flags != null && w.hasOwnProperty("flags")) $.flags = w.flags;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.trace.v1.Span"
                        }, z.SpanKind = function() {
                            var _ = {},
                                w = Object.create(_);
                            return w[_[0] = "SPAN_KIND_UNSPECIFIED"] = 0, w[_[1] = "SPAN_KIND_INTERNAL"] = 1, w[_[2] = "SPAN_KIND_SERVER"] = 2, w[_[3] = "SPAN_KIND_CLIENT"] = 3, w[_[4] = "SPAN_KIND_PRODUCER"] = 4, w[_[5] = "SPAN_KIND_CONSUMER"] = 5, w
                        }(), z.Event = function() {
                            function _(w) {
                                if (this.attributes = [], w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.timeUnixNano = null, _.prototype.name = null, _.prototype.attributes = r6.emptyArray, _.prototype.droppedAttributesCount = null, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.timeUnixNano != null && Object.hasOwnProperty.call(O, "timeUnixNano")) $.uint32(9).fixed64(O.timeUnixNano);
                                if (O.name != null && Object.hasOwnProperty.call(O, "name")) $.uint32(18).string(O.name);
                                if (O.attributes != null && O.attributes.length)
                                    for (var H = 0; H < O.attributes.length; ++H) p6.opentelemetry.proto.common.v1.KeyValue.encode(O.attributes[H], $.uint32(26).fork()).ldelim();
                                if (O.droppedAttributesCount != null && Object.hasOwnProperty.call(O, "droppedAttributesCount")) $.uint32(32).uint32(O.droppedAttributesCount);
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.trace.v1.Span.Event;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            J.timeUnixNano = O.fixed64();
                                            break
                                        }
                                        case 2: {
                                            J.name = O.string();
                                            break
                                        }
                                        case 3: {
                                            if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                            J.attributes.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                            break
                                        }
                                        case 4: {
                                            J.droppedAttributesCount = O.uint32();
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano")) {
                                    if (!r6.isInteger(O.timeUnixNano) && !(O.timeUnixNano && r6.isInteger(O.timeUnixNano.low) && r6.isInteger(O.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                                }
                                if (O.name != null && O.hasOwnProperty("name")) {
                                    if (!r6.isString(O.name)) return "name: string expected"
                                }
                                if (O.attributes != null && O.hasOwnProperty("attributes")) {
                                    if (!Array.isArray(O.attributes)) return "attributes: array expected";
                                    for (var $ = 0; $ < O.attributes.length; ++$) {
                                        var H = p6.opentelemetry.proto.common.v1.KeyValue.verify(O.attributes[$]);
                                        if (H) return "attributes." + H
                                    }
                                }
                                if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) {
                                    if (!r6.isInteger(O.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.trace.v1.Span.Event) return O;
                                var $ = new p6.opentelemetry.proto.trace.v1.Span.Event;
                                if (O.timeUnixNano != null) {
                                    if (r6.Long)($.timeUnixNano = r6.Long.fromValue(O.timeUnixNano)).unsigned = !1;
                                    else if (typeof O.timeUnixNano === "string") $.timeUnixNano = parseInt(O.timeUnixNano, 10);
                                    else if (typeof O.timeUnixNano === "number") $.timeUnixNano = O.timeUnixNano;
                                    else if (typeof O.timeUnixNano === "object") $.timeUnixNano = new r6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber()
                                }
                                if (O.name != null) $.name = String(O.name);
                                if (O.attributes) {
                                    if (!Array.isArray(O.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: array expected");
                                    $.attributes = [];
                                    for (var H = 0; H < O.attributes.length; ++H) {
                                        if (typeof O.attributes[H] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: object expected");
                                        $.attributes[H] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.attributes[H])
                                    }
                                }
                                if (O.droppedAttributesCount != null) $.droppedAttributesCount = O.droppedAttributesCount >>> 0;
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.arrays || $.defaults) H.attributes = [];
                                if ($.defaults) {
                                    if (r6.Long) {
                                        var j = new r6.Long(0, 0, !1);
                                        H.timeUnixNano = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                    } else H.timeUnixNano = $.longs === String ? "0" : 0;
                                    H.name = "", H.droppedAttributesCount = 0
                                }
                                if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano"))
                                    if (typeof O.timeUnixNano === "number") H.timeUnixNano = $.longs === String ? String(O.timeUnixNano) : O.timeUnixNano;
                                    else H.timeUnixNano = $.longs === String ? r6.Long.prototype.toString.call(O.timeUnixNano) : $.longs === Number ? new r6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber() : O.timeUnixNano;
                                if (O.name != null && O.hasOwnProperty("name")) H.name = O.name;
                                if (O.attributes && O.attributes.length) {
                                    H.attributes = [];
                                    for (var J = 0; J < O.attributes.length; ++J) H.attributes[J] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(O.attributes[J], $)
                                }
                                if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) H.droppedAttributesCount = O.droppedAttributesCount;
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.trace.v1.Span.Event"
                            }, _
                        }(), z.Link = function() {
                            function _(w) {
                                if (this.attributes = [], w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.traceId = null, _.prototype.spanId = null, _.prototype.traceState = null, _.prototype.attributes = r6.emptyArray, _.prototype.droppedAttributesCount = null, _.prototype.flags = null, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.traceId != null && Object.hasOwnProperty.call(O, "traceId")) $.uint32(10).bytes(O.traceId);
                                if (O.spanId != null && Object.hasOwnProperty.call(O, "spanId")) $.uint32(18).bytes(O.spanId);
                                if (O.traceState != null && Object.hasOwnProperty.call(O, "traceState")) $.uint32(26).string(O.traceState);
                                if (O.attributes != null && O.attributes.length)
                                    for (var H = 0; H < O.attributes.length; ++H) p6.opentelemetry.proto.common.v1.KeyValue.encode(O.attributes[H], $.uint32(34).fork()).ldelim();
                                if (O.droppedAttributesCount != null && Object.hasOwnProperty.call(O, "droppedAttributesCount")) $.uint32(40).uint32(O.droppedAttributesCount);
                                if (O.flags != null && Object.hasOwnProperty.call(O, "flags")) $.uint32(53).fixed32(O.flags);
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.trace.v1.Span.Link;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            J.traceId = O.bytes();
                                            break
                                        }
                                        case 2: {
                                            J.spanId = O.bytes();
                                            break
                                        }
                                        case 3: {
                                            J.traceState = O.string();
                                            break
                                        }
                                        case 4: {
                                            if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                            J.attributes.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                            break
                                        }
                                        case 5: {
                                            J.droppedAttributesCount = O.uint32();
                                            break
                                        }
                                        case 6: {
                                            J.flags = O.fixed32();
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.traceId != null && O.hasOwnProperty("traceId")) {
                                    if (!(O.traceId && typeof O.traceId.length === "number" || r6.isString(O.traceId))) return "traceId: buffer expected"
                                }
                                if (O.spanId != null && O.hasOwnProperty("spanId")) {
                                    if (!(O.spanId && typeof O.spanId.length === "number" || r6.isString(O.spanId))) return "spanId: buffer expected"
                                }
                                if (O.traceState != null && O.hasOwnProperty("traceState")) {
                                    if (!r6.isString(O.traceState)) return "traceState: string expected"
                                }
                                if (O.attributes != null && O.hasOwnProperty("attributes")) {
                                    if (!Array.isArray(O.attributes)) return "attributes: array expected";
                                    for (var $ = 0; $ < O.attributes.length; ++$) {
                                        var H = p6.opentelemetry.proto.common.v1.KeyValue.verify(O.attributes[$]);
                                        if (H) return "attributes." + H
                                    }
                                }
                                if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) {
                                    if (!r6.isInteger(O.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                                }
                                if (O.flags != null && O.hasOwnProperty("flags")) {
                                    if (!r6.isInteger(O.flags)) return "flags: integer expected"
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.trace.v1.Span.Link) return O;
                                var $ = new p6.opentelemetry.proto.trace.v1.Span.Link;
                                if (O.traceId != null) {
                                    if (typeof O.traceId === "string") r6.base64.decode(O.traceId, $.traceId = r6.newBuffer(r6.base64.length(O.traceId)), 0);
                                    else if (O.traceId.length >= 0) $.traceId = O.traceId
                                }
                                if (O.spanId != null) {
                                    if (typeof O.spanId === "string") r6.base64.decode(O.spanId, $.spanId = r6.newBuffer(r6.base64.length(O.spanId)), 0);
                                    else if (O.spanId.length >= 0) $.spanId = O.spanId
                                }
                                if (O.traceState != null) $.traceState = String(O.traceState);
                                if (O.attributes) {
                                    if (!Array.isArray(O.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: array expected");
                                    $.attributes = [];
                                    for (var H = 0; H < O.attributes.length; ++H) {
                                        if (typeof O.attributes[H] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: object expected");
                                        $.attributes[H] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.attributes[H])
                                    }
                                }
                                if (O.droppedAttributesCount != null) $.droppedAttributesCount = O.droppedAttributesCount >>> 0;
                                if (O.flags != null) $.flags = O.flags >>> 0;
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.arrays || $.defaults) H.attributes = [];
                                if ($.defaults) {
                                    if ($.bytes === String) H.traceId = "";
                                    else if (H.traceId = [], $.bytes !== Array) H.traceId = r6.newBuffer(H.traceId);
                                    if ($.bytes === String) H.spanId = "";
                                    else if (H.spanId = [], $.bytes !== Array) H.spanId = r6.newBuffer(H.spanId);
                                    H.traceState = "", H.droppedAttributesCount = 0, H.flags = 0
                                }
                                if (O.traceId != null && O.hasOwnProperty("traceId")) H.traceId = $.bytes === String ? r6.base64.encode(O.traceId, 0, O.traceId.length) : $.bytes === Array ? Array.prototype.slice.call(O.traceId) : O.traceId;
                                if (O.spanId != null && O.hasOwnProperty("spanId")) H.spanId = $.bytes === String ? r6.base64.encode(O.spanId, 0, O.spanId.length) : $.bytes === Array ? Array.prototype.slice.call(O.spanId) : O.spanId;
                                if (O.traceState != null && O.hasOwnProperty("traceState")) H.traceState = O.traceState;
                                if (O.attributes && O.attributes.length) {
                                    H.attributes = [];
                                    for (var j = 0; j < O.attributes.length; ++j) H.attributes[j] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(O.attributes[j], $)
                                }
                                if (O.droppedAttributesCount != null && O.hasOwnProperty("droppedAttributesCount")) H.droppedAttributesCount = O.droppedAttributesCount;
                                if (O.flags != null && O.hasOwnProperty("flags")) H.flags = O.flags;
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.trace.v1.Span.Link"
                            }, _
                        }(), z
                    }(), Y.Status = function() {
                        function z(_) {
                            if (_) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.message = null, z.prototype.code = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.message != null && Object.hasOwnProperty.call(w, "message")) O.uint32(18).string(w.message);
                            if (w.code != null && Object.hasOwnProperty.call(w, "code")) O.uint32(24).int32(w.code);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.trace.v1.Status;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 2: {
                                        j.message = w.string();
                                        break
                                    }
                                    case 3: {
                                        j.code = w.int32();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.message != null && w.hasOwnProperty("message")) {
                                if (!r6.isString(w.message)) return "message: string expected"
                            }
                            if (w.code != null && w.hasOwnProperty("code")) switch (w.code) {
                                default:
                                    return "code: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.trace.v1.Status) return w;
                            var O = new p6.opentelemetry.proto.trace.v1.Status;
                            if (w.message != null) O.message = String(w.message);
                            switch (w.code) {
                                default:
                                    if (typeof w.code === "number") {
                                        O.code = w.code;
                                        break
                                    }
                                    break;
                                case "STATUS_CODE_UNSET":
                                case 0:
                                    O.code = 0;
                                    break;
                                case "STATUS_CODE_OK":
                                case 1:
                                    O.code = 1;
                                    break;
                                case "STATUS_CODE_ERROR":
                                case 2:
                                    O.code = 2;
                                    break
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.defaults) $.message = "", $.code = O.enums === String ? "STATUS_CODE_UNSET" : 0;
                            if (w.message != null && w.hasOwnProperty("message")) $.message = w.message;
                            if (w.code != null && w.hasOwnProperty("code")) $.code = O.enums === String ? p6.opentelemetry.proto.trace.v1.Status.StatusCode[w.code] === void 0 ? w.code : p6.opentelemetry.proto.trace.v1.Status.StatusCode[w.code] : w.code;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.trace.v1.Status"
                        }, z.StatusCode = function() {
                            var _ = {},
                                w = Object.create(_);
                            return w[_[0] = "STATUS_CODE_UNSET"] = 0, w[_[1] = "STATUS_CODE_OK"] = 1, w[_[2] = "STATUS_CODE_ERROR"] = 2, w
                        }(), z
                    }(), Y.SpanFlags = function() {
                        var z = {},
                            _ = Object.create(z);
                        return _[z[0] = "SPAN_FLAGS_DO_NOT_USE"] = 0, _[z[255] = "SPAN_FLAGS_TRACE_FLAGS_MASK"] = 255, _[z[256] = "SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK"] = 256, _[z[512] = "SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK"] = 512, _
                    }(), Y
                }(), K
            }(), q.collector = function() {
                var K = {};
                return K.trace = function() {
                    var Y = {};
                    return Y.v1 = function() {
                        var z = {};
                        return z.TraceService = function() {
                            function _(w, O, $) {
                                oq.rpc.Service.call(this, w, O, $)
                            }
                            return (_.prototype = Object.create(oq.rpc.Service.prototype)).constructor = _, _.create = function(O, $, H) {
                                return new this(O, $, H)
                            }, Object.defineProperty(_.prototype.export = function w(O, $) {
                                return this.rpcCall(w, p6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest, p6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse, O, $)
                            }, "name", {
                                value: "Export"
                            }), _
                        }(), z.ExportTraceServiceRequest = function() {
                            function _(w) {
                                if (this.resourceSpans = [], w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.resourceSpans = r6.emptyArray, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.resourceSpans != null && O.resourceSpans.length)
                                    for (var H = 0; H < O.resourceSpans.length; ++H) p6.opentelemetry.proto.trace.v1.ResourceSpans.encode(O.resourceSpans[H], $.uint32(10).fork()).ldelim();
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            if (!(J.resourceSpans && J.resourceSpans.length)) J.resourceSpans = [];
                                            J.resourceSpans.push(p6.opentelemetry.proto.trace.v1.ResourceSpans.decode(O, O.uint32()));
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.resourceSpans != null && O.hasOwnProperty("resourceSpans")) {
                                    if (!Array.isArray(O.resourceSpans)) return "resourceSpans: array expected";
                                    for (var $ = 0; $ < O.resourceSpans.length; ++$) {
                                        var H = p6.opentelemetry.proto.trace.v1.ResourceSpans.verify(O.resourceSpans[$]);
                                        if (H) return "resourceSpans." + H
                                    }
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest) return O;
                                var $ = new p6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
                                if (O.resourceSpans) {
                                    if (!Array.isArray(O.resourceSpans)) throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: array expected");
                                    $.resourceSpans = [];
                                    for (var H = 0; H < O.resourceSpans.length; ++H) {
                                        if (typeof O.resourceSpans[H] !== "object") throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: object expected");
                                        $.resourceSpans[H] = p6.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(O.resourceSpans[H])
                                    }
                                }
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.arrays || $.defaults) H.resourceSpans = [];
                                if (O.resourceSpans && O.resourceSpans.length) {
                                    H.resourceSpans = [];
                                    for (var j = 0; j < O.resourceSpans.length; ++j) H.resourceSpans[j] = p6.opentelemetry.proto.trace.v1.ResourceSpans.toObject(O.resourceSpans[j], $)
                                }
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest"
                            }, _
                        }(), z.ExportTraceServiceResponse = function() {
                            function _(w) {
                                if (w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.partialSuccess = null, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.partialSuccess != null && Object.hasOwnProperty.call(O, "partialSuccess")) p6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.encode(O.partialSuccess, $.uint32(10).fork()).ldelim();
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            J.partialSuccess = p6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.decode(O, O.uint32());
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.partialSuccess != null && O.hasOwnProperty("partialSuccess")) {
                                    var $ = p6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.verify(O.partialSuccess);
                                    if ($) return "partialSuccess." + $
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse) return O;
                                var $ = new p6.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;
                                if (O.partialSuccess != null) {
                                    if (typeof O.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse.partialSuccess: object expected");
                                    $.partialSuccess = p6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.fromObject(O.partialSuccess)
                                }
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.defaults) H.partialSuccess = null;
                                if (O.partialSuccess != null && O.hasOwnProperty("partialSuccess")) H.partialSuccess = p6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.toObject(O.partialSuccess, $);
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse"
                            }, _
                        }(), z.ExportTracePartialSuccess = function() {
                            function _(w) {
                                if (w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.rejectedSpans = null, _.prototype.errorMessage = null, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.rejectedSpans != null && Object.hasOwnProperty.call(O, "rejectedSpans")) $.uint32(8).int64(O.rejectedSpans);
                                if (O.errorMessage != null && Object.hasOwnProperty.call(O, "errorMessage")) $.uint32(18).string(O.errorMessage);
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            J.rejectedSpans = O.int64();
                                            break
                                        }
                                        case 2: {
                                            J.errorMessage = O.string();
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.rejectedSpans != null && O.hasOwnProperty("rejectedSpans")) {
                                    if (!r6.isInteger(O.rejectedSpans) && !(O.rejectedSpans && r6.isInteger(O.rejectedSpans.low) && r6.isInteger(O.rejectedSpans.high))) return "rejectedSpans: integer|Long expected"
                                }
                                if (O.errorMessage != null && O.hasOwnProperty("errorMessage")) {
                                    if (!r6.isString(O.errorMessage)) return "errorMessage: string expected"
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess) return O;
                                var $ = new p6.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;
                                if (O.rejectedSpans != null) {
                                    if (r6.Long)($.rejectedSpans = r6.Long.fromValue(O.rejectedSpans)).unsigned = !1;
                                    else if (typeof O.rejectedSpans === "string") $.rejectedSpans = parseInt(O.rejectedSpans, 10);
                                    else if (typeof O.rejectedSpans === "number") $.rejectedSpans = O.rejectedSpans;
                                    else if (typeof O.rejectedSpans === "object") $.rejectedSpans = new r6.LongBits(O.rejectedSpans.low >>> 0, O.rejectedSpans.high >>> 0).toNumber()
                                }
                                if (O.errorMessage != null) $.errorMessage = String(O.errorMessage);
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.defaults) {
                                    if (r6.Long) {
                                        var j = new r6.Long(0, 0, !1);
                                        H.rejectedSpans = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                    } else H.rejectedSpans = $.longs === String ? "0" : 0;
                                    H.errorMessage = ""
                                }
                                if (O.rejectedSpans != null && O.hasOwnProperty("rejectedSpans"))
                                    if (typeof O.rejectedSpans === "number") H.rejectedSpans = $.longs === String ? String(O.rejectedSpans) : O.rejectedSpans;
                                    else H.rejectedSpans = $.longs === String ? r6.Long.prototype.toString.call(O.rejectedSpans) : $.longs === Number ? new r6.LongBits(O.rejectedSpans.low >>> 0, O.rejectedSpans.high >>> 0).toNumber() : O.rejectedSpans;
                                if (O.errorMessage != null && O.hasOwnProperty("errorMessage")) H.errorMessage = O.errorMessage;
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess"
                            }, _
                        }(), z
                    }(), Y
                }(), K.metrics = function() {
                    var Y = {};
                    return Y.v1 = function() {
                        var z = {};
                        return z.MetricsService = function() {
                            function _(w, O, $) {
                                oq.rpc.Service.call(this, w, O, $)
                            }
                            return (_.prototype = Object.create(oq.rpc.Service.prototype)).constructor = _, _.create = function(O, $, H) {
                                return new this(O, $, H)
                            }, Object.defineProperty(_.prototype.export = function w(O, $) {
                                return this.rpcCall(w, p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest, p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse, O, $)
                            }, "name", {
                                value: "Export"
                            }), _
                        }(), z.ExportMetricsServiceRequest = function() {
                            function _(w) {
                                if (this.resourceMetrics = [], w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.resourceMetrics = r6.emptyArray, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.resourceMetrics != null && O.resourceMetrics.length)
                                    for (var H = 0; H < O.resourceMetrics.length; ++H) p6.opentelemetry.proto.metrics.v1.ResourceMetrics.encode(O.resourceMetrics[H], $.uint32(10).fork()).ldelim();
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            if (!(J.resourceMetrics && J.resourceMetrics.length)) J.resourceMetrics = [];
                                            J.resourceMetrics.push(p6.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(O, O.uint32()));
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.resourceMetrics != null && O.hasOwnProperty("resourceMetrics")) {
                                    if (!Array.isArray(O.resourceMetrics)) return "resourceMetrics: array expected";
                                    for (var $ = 0; $ < O.resourceMetrics.length; ++$) {
                                        var H = p6.opentelemetry.proto.metrics.v1.ResourceMetrics.verify(O.resourceMetrics[$]);
                                        if (H) return "resourceMetrics." + H
                                    }
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest) return O;
                                var $ = new p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
                                if (O.resourceMetrics) {
                                    if (!Array.isArray(O.resourceMetrics)) throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: array expected");
                                    $.resourceMetrics = [];
                                    for (var H = 0; H < O.resourceMetrics.length; ++H) {
                                        if (typeof O.resourceMetrics[H] !== "object") throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: object expected");
                                        $.resourceMetrics[H] = p6.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(O.resourceMetrics[H])
                                    }
                                }
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.arrays || $.defaults) H.resourceMetrics = [];
                                if (O.resourceMetrics && O.resourceMetrics.length) {
                                    H.resourceMetrics = [];
                                    for (var j = 0; j < O.resourceMetrics.length; ++j) H.resourceMetrics[j] = p6.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(O.resourceMetrics[j], $)
                                }
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest"
                            }, _
                        }(), z.ExportMetricsServiceResponse = function() {
                            function _(w) {
                                if (w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.partialSuccess = null, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.partialSuccess != null && Object.hasOwnProperty.call(O, "partialSuccess")) p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.encode(O.partialSuccess, $.uint32(10).fork()).ldelim();
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            J.partialSuccess = p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.decode(O, O.uint32());
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.partialSuccess != null && O.hasOwnProperty("partialSuccess")) {
                                    var $ = p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.verify(O.partialSuccess);
                                    if ($) return "partialSuccess." + $
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse) return O;
                                var $ = new p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;
                                if (O.partialSuccess != null) {
                                    if (typeof O.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse.partialSuccess: object expected");
                                    $.partialSuccess = p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.fromObject(O.partialSuccess)
                                }
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.defaults) H.partialSuccess = null;
                                if (O.partialSuccess != null && O.hasOwnProperty("partialSuccess")) H.partialSuccess = p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.toObject(O.partialSuccess, $);
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse"
                            }, _
                        }(), z.ExportMetricsPartialSuccess = function() {
                            function _(w) {
                                if (w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.rejectedDataPoints = null, _.prototype.errorMessage = null, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.rejectedDataPoints != null && Object.hasOwnProperty.call(O, "rejectedDataPoints")) $.uint32(8).int64(O.rejectedDataPoints);
                                if (O.errorMessage != null && Object.hasOwnProperty.call(O, "errorMessage")) $.uint32(18).string(O.errorMessage);
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            J.rejectedDataPoints = O.int64();
                                            break
                                        }
                                        case 2: {
                                            J.errorMessage = O.string();
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.rejectedDataPoints != null && O.hasOwnProperty("rejectedDataPoints")) {
                                    if (!r6.isInteger(O.rejectedDataPoints) && !(O.rejectedDataPoints && r6.isInteger(O.rejectedDataPoints.low) && r6.isInteger(O.rejectedDataPoints.high))) return "rejectedDataPoints: integer|Long expected"
                                }
                                if (O.errorMessage != null && O.hasOwnProperty("errorMessage")) {
                                    if (!r6.isString(O.errorMessage)) return "errorMessage: string expected"
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess) return O;
                                var $ = new p6.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;
                                if (O.rejectedDataPoints != null) {
                                    if (r6.Long)($.rejectedDataPoints = r6.Long.fromValue(O.rejectedDataPoints)).unsigned = !1;
                                    else if (typeof O.rejectedDataPoints === "string") $.rejectedDataPoints = parseInt(O.rejectedDataPoints, 10);
                                    else if (typeof O.rejectedDataPoints === "number") $.rejectedDataPoints = O.rejectedDataPoints;
                                    else if (typeof O.rejectedDataPoints === "object") $.rejectedDataPoints = new r6.LongBits(O.rejectedDataPoints.low >>> 0, O.rejectedDataPoints.high >>> 0).toNumber()
                                }
                                if (O.errorMessage != null) $.errorMessage = String(O.errorMessage);
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.defaults) {
                                    if (r6.Long) {
                                        var j = new r6.Long(0, 0, !1);
                                        H.rejectedDataPoints = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                    } else H.rejectedDataPoints = $.longs === String ? "0" : 0;
                                    H.errorMessage = ""
                                }
                                if (O.rejectedDataPoints != null && O.hasOwnProperty("rejectedDataPoints"))
                                    if (typeof O.rejectedDataPoints === "number") H.rejectedDataPoints = $.longs === String ? String(O.rejectedDataPoints) : O.rejectedDataPoints;
                                    else H.rejectedDataPoints = $.longs === String ? r6.Long.prototype.toString.call(O.rejectedDataPoints) : $.longs === Number ? new r6.LongBits(O.rejectedDataPoints.low >>> 0, O.rejectedDataPoints.high >>> 0).toNumber() : O.rejectedDataPoints;
                                if (O.errorMessage != null && O.hasOwnProperty("errorMessage")) H.errorMessage = O.errorMessage;
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess"
                            }, _
                        }(), z
                    }(), Y
                }(), K.logs = function() {
                    var Y = {};
                    return Y.v1 = function() {
                        var z = {};
                        return z.LogsService = function() {
                            function _(w, O, $) {
                                oq.rpc.Service.call(this, w, O, $)
                            }
                            return (_.prototype = Object.create(oq.rpc.Service.prototype)).constructor = _, _.create = function(O, $, H) {
                                return new this(O, $, H)
                            }, Object.defineProperty(_.prototype.export = function w(O, $) {
                                return this.rpcCall(w, p6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest, p6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse, O, $)
                            }, "name", {
                                value: "Export"
                            }), _
                        }(), z.ExportLogsServiceRequest = function() {
                            function _(w) {
                                if (this.resourceLogs = [], w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.resourceLogs = r6.emptyArray, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.resourceLogs != null && O.resourceLogs.length)
                                    for (var H = 0; H < O.resourceLogs.length; ++H) p6.opentelemetry.proto.logs.v1.ResourceLogs.encode(O.resourceLogs[H], $.uint32(10).fork()).ldelim();
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            if (!(J.resourceLogs && J.resourceLogs.length)) J.resourceLogs = [];
                                            J.resourceLogs.push(p6.opentelemetry.proto.logs.v1.ResourceLogs.decode(O, O.uint32()));
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.resourceLogs != null && O.hasOwnProperty("resourceLogs")) {
                                    if (!Array.isArray(O.resourceLogs)) return "resourceLogs: array expected";
                                    for (var $ = 0; $ < O.resourceLogs.length; ++$) {
                                        var H = p6.opentelemetry.proto.logs.v1.ResourceLogs.verify(O.resourceLogs[$]);
                                        if (H) return "resourceLogs." + H
                                    }
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest) return O;
                                var $ = new p6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
                                if (O.resourceLogs) {
                                    if (!Array.isArray(O.resourceLogs)) throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: array expected");
                                    $.resourceLogs = [];
                                    for (var H = 0; H < O.resourceLogs.length; ++H) {
                                        if (typeof O.resourceLogs[H] !== "object") throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: object expected");
                                        $.resourceLogs[H] = p6.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(O.resourceLogs[H])
                                    }
                                }
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.arrays || $.defaults) H.resourceLogs = [];
                                if (O.resourceLogs && O.resourceLogs.length) {
                                    H.resourceLogs = [];
                                    for (var j = 0; j < O.resourceLogs.length; ++j) H.resourceLogs[j] = p6.opentelemetry.proto.logs.v1.ResourceLogs.toObject(O.resourceLogs[j], $)
                                }
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest"
                            }, _
                        }(), z.ExportLogsServiceResponse = function() {
                            function _(w) {
                                if (w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.partialSuccess = null, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.partialSuccess != null && Object.hasOwnProperty.call(O, "partialSuccess")) p6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.encode(O.partialSuccess, $.uint32(10).fork()).ldelim();
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            J.partialSuccess = p6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.decode(O, O.uint32());
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.partialSuccess != null && O.hasOwnProperty("partialSuccess")) {
                                    var $ = p6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.verify(O.partialSuccess);
                                    if ($) return "partialSuccess." + $
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse) return O;
                                var $ = new p6.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;
                                if (O.partialSuccess != null) {
                                    if (typeof O.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse.partialSuccess: object expected");
                                    $.partialSuccess = p6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.fromObject(O.partialSuccess)
                                }
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.defaults) H.partialSuccess = null;
                                if (O.partialSuccess != null && O.hasOwnProperty("partialSuccess")) H.partialSuccess = p6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.toObject(O.partialSuccess, $);
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse"
                            }, _
                        }(), z.ExportLogsPartialSuccess = function() {
                            function _(w) {
                                if (w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.rejectedLogRecords = null, _.prototype.errorMessage = null, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.rejectedLogRecords != null && Object.hasOwnProperty.call(O, "rejectedLogRecords")) $.uint32(8).int64(O.rejectedLogRecords);
                                if (O.errorMessage != null && Object.hasOwnProperty.call(O, "errorMessage")) $.uint32(18).string(O.errorMessage);
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            J.rejectedLogRecords = O.int64();
                                            break
                                        }
                                        case 2: {
                                            J.errorMessage = O.string();
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.rejectedLogRecords != null && O.hasOwnProperty("rejectedLogRecords")) {
                                    if (!r6.isInteger(O.rejectedLogRecords) && !(O.rejectedLogRecords && r6.isInteger(O.rejectedLogRecords.low) && r6.isInteger(O.rejectedLogRecords.high))) return "rejectedLogRecords: integer|Long expected"
                                }
                                if (O.errorMessage != null && O.hasOwnProperty("errorMessage")) {
                                    if (!r6.isString(O.errorMessage)) return "errorMessage: string expected"
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess) return O;
                                var $ = new p6.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;
                                if (O.rejectedLogRecords != null) {
                                    if (r6.Long)($.rejectedLogRecords = r6.Long.fromValue(O.rejectedLogRecords)).unsigned = !1;
                                    else if (typeof O.rejectedLogRecords === "string") $.rejectedLogRecords = parseInt(O.rejectedLogRecords, 10);
                                    else if (typeof O.rejectedLogRecords === "number") $.rejectedLogRecords = O.rejectedLogRecords;
                                    else if (typeof O.rejectedLogRecords === "object") $.rejectedLogRecords = new r6.LongBits(O.rejectedLogRecords.low >>> 0, O.rejectedLogRecords.high >>> 0).toNumber()
                                }
                                if (O.errorMessage != null) $.errorMessage = String(O.errorMessage);
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.defaults) {
                                    if (r6.Long) {
                                        var j = new r6.Long(0, 0, !1);
                                        H.rejectedLogRecords = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                    } else H.rejectedLogRecords = $.longs === String ? "0" : 0;
                                    H.errorMessage = ""
                                }
                                if (O.rejectedLogRecords != null && O.hasOwnProperty("rejectedLogRecords"))
                                    if (typeof O.rejectedLogRecords === "number") H.rejectedLogRecords = $.longs === String ? String(O.rejectedLogRecords) : O.rejectedLogRecords;
                                    else H.rejectedLogRecords = $.longs === String ? r6.Long.prototype.toString.call(O.rejectedLogRecords) : $.longs === Number ? new r6.LongBits(O.rejectedLogRecords.low >>> 0, O.rejectedLogRecords.high >>> 0).toNumber() : O.rejectedLogRecords;
                                if (O.errorMessage != null && O.hasOwnProperty("errorMessage")) H.errorMessage = O.errorMessage;
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess"
                            }, _
                        }(), z
                    }(), Y
                }(), K
            }(), q.metrics = function() {
                var K = {};
                return K.v1 = function() {
                    var Y = {};
                    return Y.MetricsData = function() {
                        function z(_) {
                            if (this.resourceMetrics = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.resourceMetrics = r6.emptyArray, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.resourceMetrics != null && w.resourceMetrics.length)
                                for (var $ = 0; $ < w.resourceMetrics.length; ++$) p6.opentelemetry.proto.metrics.v1.ResourceMetrics.encode(w.resourceMetrics[$], O.uint32(10).fork()).ldelim();
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.metrics.v1.MetricsData;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(j.resourceMetrics && j.resourceMetrics.length)) j.resourceMetrics = [];
                                        j.resourceMetrics.push(p6.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(w, w.uint32()));
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.resourceMetrics != null && w.hasOwnProperty("resourceMetrics")) {
                                if (!Array.isArray(w.resourceMetrics)) return "resourceMetrics: array expected";
                                for (var O = 0; O < w.resourceMetrics.length; ++O) {
                                    var $ = p6.opentelemetry.proto.metrics.v1.ResourceMetrics.verify(w.resourceMetrics[O]);
                                    if ($) return "resourceMetrics." + $
                                }
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.metrics.v1.MetricsData) return w;
                            var O = new p6.opentelemetry.proto.metrics.v1.MetricsData;
                            if (w.resourceMetrics) {
                                if (!Array.isArray(w.resourceMetrics)) throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: array expected");
                                O.resourceMetrics = [];
                                for (var $ = 0; $ < w.resourceMetrics.length; ++$) {
                                    if (typeof w.resourceMetrics[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: object expected");
                                    O.resourceMetrics[$] = p6.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(w.resourceMetrics[$])
                                }
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.resourceMetrics = [];
                            if (w.resourceMetrics && w.resourceMetrics.length) {
                                $.resourceMetrics = [];
                                for (var H = 0; H < w.resourceMetrics.length; ++H) $.resourceMetrics[H] = p6.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(w.resourceMetrics[H], O)
                            }
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.MetricsData"
                        }, z
                    }(), Y.ResourceMetrics = function() {
                        function z(_) {
                            if (this.scopeMetrics = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.resource = null, z.prototype.scopeMetrics = r6.emptyArray, z.prototype.schemaUrl = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.resource != null && Object.hasOwnProperty.call(w, "resource")) p6.opentelemetry.proto.resource.v1.Resource.encode(w.resource, O.uint32(10).fork()).ldelim();
                            if (w.scopeMetrics != null && w.scopeMetrics.length)
                                for (var $ = 0; $ < w.scopeMetrics.length; ++$) p6.opentelemetry.proto.metrics.v1.ScopeMetrics.encode(w.scopeMetrics[$], O.uint32(18).fork()).ldelim();
                            if (w.schemaUrl != null && Object.hasOwnProperty.call(w, "schemaUrl")) O.uint32(26).string(w.schemaUrl);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.metrics.v1.ResourceMetrics;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        j.resource = p6.opentelemetry.proto.resource.v1.Resource.decode(w, w.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(j.scopeMetrics && j.scopeMetrics.length)) j.scopeMetrics = [];
                                        j.scopeMetrics.push(p6.opentelemetry.proto.metrics.v1.ScopeMetrics.decode(w, w.uint32()));
                                        break
                                    }
                                    case 3: {
                                        j.schemaUrl = w.string();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.resource != null && w.hasOwnProperty("resource")) {
                                var O = p6.opentelemetry.proto.resource.v1.Resource.verify(w.resource);
                                if (O) return "resource." + O
                            }
                            if (w.scopeMetrics != null && w.hasOwnProperty("scopeMetrics")) {
                                if (!Array.isArray(w.scopeMetrics)) return "scopeMetrics: array expected";
                                for (var $ = 0; $ < w.scopeMetrics.length; ++$) {
                                    var O = p6.opentelemetry.proto.metrics.v1.ScopeMetrics.verify(w.scopeMetrics[$]);
                                    if (O) return "scopeMetrics." + O
                                }
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) {
                                if (!r6.isString(w.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.metrics.v1.ResourceMetrics) return w;
                            var O = new p6.opentelemetry.proto.metrics.v1.ResourceMetrics;
                            if (w.resource != null) {
                                if (typeof w.resource !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.resource: object expected");
                                O.resource = p6.opentelemetry.proto.resource.v1.Resource.fromObject(w.resource)
                            }
                            if (w.scopeMetrics) {
                                if (!Array.isArray(w.scopeMetrics)) throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: array expected");
                                O.scopeMetrics = [];
                                for (var $ = 0; $ < w.scopeMetrics.length; ++$) {
                                    if (typeof w.scopeMetrics[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: object expected");
                                    O.scopeMetrics[$] = p6.opentelemetry.proto.metrics.v1.ScopeMetrics.fromObject(w.scopeMetrics[$])
                                }
                            }
                            if (w.schemaUrl != null) O.schemaUrl = String(w.schemaUrl);
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.scopeMetrics = [];
                            if (O.defaults) $.resource = null, $.schemaUrl = "";
                            if (w.resource != null && w.hasOwnProperty("resource")) $.resource = p6.opentelemetry.proto.resource.v1.Resource.toObject(w.resource, O);
                            if (w.scopeMetrics && w.scopeMetrics.length) {
                                $.scopeMetrics = [];
                                for (var H = 0; H < w.scopeMetrics.length; ++H) $.scopeMetrics[H] = p6.opentelemetry.proto.metrics.v1.ScopeMetrics.toObject(w.scopeMetrics[H], O)
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) $.schemaUrl = w.schemaUrl;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.ResourceMetrics"
                        }, z
                    }(), Y.ScopeMetrics = function() {
                        function z(_) {
                            if (this.metrics = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.scope = null, z.prototype.metrics = r6.emptyArray, z.prototype.schemaUrl = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.scope != null && Object.hasOwnProperty.call(w, "scope")) p6.opentelemetry.proto.common.v1.InstrumentationScope.encode(w.scope, O.uint32(10).fork()).ldelim();
                            if (w.metrics != null && w.metrics.length)
                                for (var $ = 0; $ < w.metrics.length; ++$) p6.opentelemetry.proto.metrics.v1.Metric.encode(w.metrics[$], O.uint32(18).fork()).ldelim();
                            if (w.schemaUrl != null && Object.hasOwnProperty.call(w, "schemaUrl")) O.uint32(26).string(w.schemaUrl);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.metrics.v1.ScopeMetrics;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        j.scope = p6.opentelemetry.proto.common.v1.InstrumentationScope.decode(w, w.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(j.metrics && j.metrics.length)) j.metrics = [];
                                        j.metrics.push(p6.opentelemetry.proto.metrics.v1.Metric.decode(w, w.uint32()));
                                        break
                                    }
                                    case 3: {
                                        j.schemaUrl = w.string();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.scope != null && w.hasOwnProperty("scope")) {
                                var O = p6.opentelemetry.proto.common.v1.InstrumentationScope.verify(w.scope);
                                if (O) return "scope." + O
                            }
                            if (w.metrics != null && w.hasOwnProperty("metrics")) {
                                if (!Array.isArray(w.metrics)) return "metrics: array expected";
                                for (var $ = 0; $ < w.metrics.length; ++$) {
                                    var O = p6.opentelemetry.proto.metrics.v1.Metric.verify(w.metrics[$]);
                                    if (O) return "metrics." + O
                                }
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) {
                                if (!r6.isString(w.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.metrics.v1.ScopeMetrics) return w;
                            var O = new p6.opentelemetry.proto.metrics.v1.ScopeMetrics;
                            if (w.scope != null) {
                                if (typeof w.scope !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.scope: object expected");
                                O.scope = p6.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(w.scope)
                            }
                            if (w.metrics) {
                                if (!Array.isArray(w.metrics)) throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: array expected");
                                O.metrics = [];
                                for (var $ = 0; $ < w.metrics.length; ++$) {
                                    if (typeof w.metrics[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: object expected");
                                    O.metrics[$] = p6.opentelemetry.proto.metrics.v1.Metric.fromObject(w.metrics[$])
                                }
                            }
                            if (w.schemaUrl != null) O.schemaUrl = String(w.schemaUrl);
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.metrics = [];
                            if (O.defaults) $.scope = null, $.schemaUrl = "";
                            if (w.scope != null && w.hasOwnProperty("scope")) $.scope = p6.opentelemetry.proto.common.v1.InstrumentationScope.toObject(w.scope, O);
                            if (w.metrics && w.metrics.length) {
                                $.metrics = [];
                                for (var H = 0; H < w.metrics.length; ++H) $.metrics[H] = p6.opentelemetry.proto.metrics.v1.Metric.toObject(w.metrics[H], O)
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) $.schemaUrl = w.schemaUrl;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.ScopeMetrics"
                        }, z
                    }(), Y.Metric = function() {
                        function z(w) {
                            if (this.metadata = [], w) {
                                for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                    if (w[O[$]] != null) this[O[$]] = w[O[$]]
                            }
                        }
                        z.prototype.name = null, z.prototype.description = null, z.prototype.unit = null, z.prototype.gauge = null, z.prototype.sum = null, z.prototype.histogram = null, z.prototype.exponentialHistogram = null, z.prototype.summary = null, z.prototype.metadata = r6.emptyArray;
                        var _;
                        return Object.defineProperty(z.prototype, "data", {
                            get: r6.oneOfGetter(_ = ["gauge", "sum", "histogram", "exponentialHistogram", "summary"]),
                            set: r6.oneOfSetter(_)
                        }), z.create = function(O) {
                            return new z(O)
                        }, z.encode = function(O, $) {
                            if (!$) $ = n5.create();
                            if (O.name != null && Object.hasOwnProperty.call(O, "name")) $.uint32(10).string(O.name);
                            if (O.description != null && Object.hasOwnProperty.call(O, "description")) $.uint32(18).string(O.description);
                            if (O.unit != null && Object.hasOwnProperty.call(O, "unit")) $.uint32(26).string(O.unit);
                            if (O.gauge != null && Object.hasOwnProperty.call(O, "gauge")) p6.opentelemetry.proto.metrics.v1.Gauge.encode(O.gauge, $.uint32(42).fork()).ldelim();
                            if (O.sum != null && Object.hasOwnProperty.call(O, "sum")) p6.opentelemetry.proto.metrics.v1.Sum.encode(O.sum, $.uint32(58).fork()).ldelim();
                            if (O.histogram != null && Object.hasOwnProperty.call(O, "histogram")) p6.opentelemetry.proto.metrics.v1.Histogram.encode(O.histogram, $.uint32(74).fork()).ldelim();
                            if (O.exponentialHistogram != null && Object.hasOwnProperty.call(O, "exponentialHistogram")) p6.opentelemetry.proto.metrics.v1.ExponentialHistogram.encode(O.exponentialHistogram, $.uint32(82).fork()).ldelim();
                            if (O.summary != null && Object.hasOwnProperty.call(O, "summary")) p6.opentelemetry.proto.metrics.v1.Summary.encode(O.summary, $.uint32(90).fork()).ldelim();
                            if (O.metadata != null && O.metadata.length)
                                for (var H = 0; H < O.metadata.length; ++H) p6.opentelemetry.proto.common.v1.KeyValue.encode(O.metadata[H], $.uint32(98).fork()).ldelim();
                            return $
                        }, z.encodeDelimited = function(O, $) {
                            return this.encode(O, $).ldelim()
                        }, z.decode = function(O, $, H) {
                            if (!(O instanceof $8)) O = $8.create(O);
                            var j = $ === void 0 ? O.len : O.pos + $,
                                J = new p6.opentelemetry.proto.metrics.v1.Metric;
                            while (O.pos < j) {
                                var M = O.uint32();
                                if (M === H) break;
                                switch (M >>> 3) {
                                    case 1: {
                                        J.name = O.string();
                                        break
                                    }
                                    case 2: {
                                        J.description = O.string();
                                        break
                                    }
                                    case 3: {
                                        J.unit = O.string();
                                        break
                                    }
                                    case 5: {
                                        J.gauge = p6.opentelemetry.proto.metrics.v1.Gauge.decode(O, O.uint32());
                                        break
                                    }
                                    case 7: {
                                        J.sum = p6.opentelemetry.proto.metrics.v1.Sum.decode(O, O.uint32());
                                        break
                                    }
                                    case 9: {
                                        J.histogram = p6.opentelemetry.proto.metrics.v1.Histogram.decode(O, O.uint32());
                                        break
                                    }
                                    case 10: {
                                        J.exponentialHistogram = p6.opentelemetry.proto.metrics.v1.ExponentialHistogram.decode(O, O.uint32());
                                        break
                                    }
                                    case 11: {
                                        J.summary = p6.opentelemetry.proto.metrics.v1.Summary.decode(O, O.uint32());
                                        break
                                    }
                                    case 12: {
                                        if (!(J.metadata && J.metadata.length)) J.metadata = [];
                                        J.metadata.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    default:
                                        O.skipType(M & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(O) {
                            if (!(O instanceof $8)) O = new $8(O);
                            return this.decode(O, O.uint32())
                        }, z.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            var $ = {};
                            if (O.name != null && O.hasOwnProperty("name")) {
                                if (!r6.isString(O.name)) return "name: string expected"
                            }
                            if (O.description != null && O.hasOwnProperty("description")) {
                                if (!r6.isString(O.description)) return "description: string expected"
                            }
                            if (O.unit != null && O.hasOwnProperty("unit")) {
                                if (!r6.isString(O.unit)) return "unit: string expected"
                            }
                            if (O.gauge != null && O.hasOwnProperty("gauge")) {
                                $.data = 1;
                                {
                                    var H = p6.opentelemetry.proto.metrics.v1.Gauge.verify(O.gauge);
                                    if (H) return "gauge." + H
                                }
                            }
                            if (O.sum != null && O.hasOwnProperty("sum")) {
                                if ($.data === 1) return "data: multiple values";
                                $.data = 1;
                                {
                                    var H = p6.opentelemetry.proto.metrics.v1.Sum.verify(O.sum);
                                    if (H) return "sum." + H
                                }
                            }
                            if (O.histogram != null && O.hasOwnProperty("histogram")) {
                                if ($.data === 1) return "data: multiple values";
                                $.data = 1;
                                {
                                    var H = p6.opentelemetry.proto.metrics.v1.Histogram.verify(O.histogram);
                                    if (H) return "histogram." + H
                                }
                            }
                            if (O.exponentialHistogram != null && O.hasOwnProperty("exponentialHistogram")) {
                                if ($.data === 1) return "data: multiple values";
                                $.data = 1;
                                {
                                    var H = p6.opentelemetry.proto.metrics.v1.ExponentialHistogram.verify(O.exponentialHistogram);
                                    if (H) return "exponentialHistogram." + H
                                }
                            }
                            if (O.summary != null && O.hasOwnProperty("summary")) {
                                if ($.data === 1) return "data: multiple values";
                                $.data = 1;
                                {
                                    var H = p6.opentelemetry.proto.metrics.v1.Summary.verify(O.summary);
                                    if (H) return "summary." + H
                                }
                            }
                            if (O.metadata != null && O.hasOwnProperty("metadata")) {
                                if (!Array.isArray(O.metadata)) return "metadata: array expected";
                                for (var j = 0; j < O.metadata.length; ++j) {
                                    var H = p6.opentelemetry.proto.common.v1.KeyValue.verify(O.metadata[j]);
                                    if (H) return "metadata." + H
                                }
                            }
                            return null
                        }, z.fromObject = function(O) {
                            if (O instanceof p6.opentelemetry.proto.metrics.v1.Metric) return O;
                            var $ = new p6.opentelemetry.proto.metrics.v1.Metric;
                            if (O.name != null) $.name = String(O.name);
                            if (O.description != null) $.description = String(O.description);
                            if (O.unit != null) $.unit = String(O.unit);
                            if (O.gauge != null) {
                                if (typeof O.gauge !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.gauge: object expected");
                                $.gauge = p6.opentelemetry.proto.metrics.v1.Gauge.fromObject(O.gauge)
                            }
                            if (O.sum != null) {
                                if (typeof O.sum !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.sum: object expected");
                                $.sum = p6.opentelemetry.proto.metrics.v1.Sum.fromObject(O.sum)
                            }
                            if (O.histogram != null) {
                                if (typeof O.histogram !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.histogram: object expected");
                                $.histogram = p6.opentelemetry.proto.metrics.v1.Histogram.fromObject(O.histogram)
                            }
                            if (O.exponentialHistogram != null) {
                                if (typeof O.exponentialHistogram !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.exponentialHistogram: object expected");
                                $.exponentialHistogram = p6.opentelemetry.proto.metrics.v1.ExponentialHistogram.fromObject(O.exponentialHistogram)
                            }
                            if (O.summary != null) {
                                if (typeof O.summary !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.summary: object expected");
                                $.summary = p6.opentelemetry.proto.metrics.v1.Summary.fromObject(O.summary)
                            }
                            if (O.metadata) {
                                if (!Array.isArray(O.metadata)) throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: array expected");
                                $.metadata = [];
                                for (var H = 0; H < O.metadata.length; ++H) {
                                    if (typeof O.metadata[H] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: object expected");
                                    $.metadata[H] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.metadata[H])
                                }
                            }
                            return $
                        }, z.toObject = function(O, $) {
                            if (!$) $ = {};
                            var H = {};
                            if ($.arrays || $.defaults) H.metadata = [];
                            if ($.defaults) H.name = "", H.description = "", H.unit = "";
                            if (O.name != null && O.hasOwnProperty("name")) H.name = O.name;
                            if (O.description != null && O.hasOwnProperty("description")) H.description = O.description;
                            if (O.unit != null && O.hasOwnProperty("unit")) H.unit = O.unit;
                            if (O.gauge != null && O.hasOwnProperty("gauge")) {
                                if (H.gauge = p6.opentelemetry.proto.metrics.v1.Gauge.toObject(O.gauge, $), $.oneofs) H.data = "gauge"
                            }
                            if (O.sum != null && O.hasOwnProperty("sum")) {
                                if (H.sum = p6.opentelemetry.proto.metrics.v1.Sum.toObject(O.sum, $), $.oneofs) H.data = "sum"
                            }
                            if (O.histogram != null && O.hasOwnProperty("histogram")) {
                                if (H.histogram = p6.opentelemetry.proto.metrics.v1.Histogram.toObject(O.histogram, $), $.oneofs) H.data = "histogram"
                            }
                            if (O.exponentialHistogram != null && O.hasOwnProperty("exponentialHistogram")) {
                                if (H.exponentialHistogram = p6.opentelemetry.proto.metrics.v1.ExponentialHistogram.toObject(O.exponentialHistogram, $), $.oneofs) H.data = "exponentialHistogram"
                            }
                            if (O.summary != null && O.hasOwnProperty("summary")) {
                                if (H.summary = p6.opentelemetry.proto.metrics.v1.Summary.toObject(O.summary, $), $.oneofs) H.data = "summary"
                            }
                            if (O.metadata && O.metadata.length) {
                                H.metadata = [];
                                for (var j = 0; j < O.metadata.length; ++j) H.metadata[j] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(O.metadata[j], $)
                            }
                            return H
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.Metric"
                        }, z
                    }(), Y.Gauge = function() {
                        function z(_) {
                            if (this.dataPoints = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.dataPoints = r6.emptyArray, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.dataPoints != null && w.dataPoints.length)
                                for (var $ = 0; $ < w.dataPoints.length; ++$) p6.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(w.dataPoints[$], O.uint32(10).fork()).ldelim();
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.metrics.v1.Gauge;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(j.dataPoints && j.dataPoints.length)) j.dataPoints = [];
                                        j.dataPoints.push(p6.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(w, w.uint32()));
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.dataPoints != null && w.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(w.dataPoints)) return "dataPoints: array expected";
                                for (var O = 0; O < w.dataPoints.length; ++O) {
                                    var $ = p6.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(w.dataPoints[O]);
                                    if ($) return "dataPoints." + $
                                }
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.metrics.v1.Gauge) return w;
                            var O = new p6.opentelemetry.proto.metrics.v1.Gauge;
                            if (w.dataPoints) {
                                if (!Array.isArray(w.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: array expected");
                                O.dataPoints = [];
                                for (var $ = 0; $ < w.dataPoints.length; ++$) {
                                    if (typeof w.dataPoints[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: object expected");
                                    O.dataPoints[$] = p6.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(w.dataPoints[$])
                                }
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.dataPoints = [];
                            if (w.dataPoints && w.dataPoints.length) {
                                $.dataPoints = [];
                                for (var H = 0; H < w.dataPoints.length; ++H) $.dataPoints[H] = p6.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(w.dataPoints[H], O)
                            }
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.Gauge"
                        }, z
                    }(), Y.Sum = function() {
                        function z(_) {
                            if (this.dataPoints = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.dataPoints = r6.emptyArray, z.prototype.aggregationTemporality = null, z.prototype.isMonotonic = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.dataPoints != null && w.dataPoints.length)
                                for (var $ = 0; $ < w.dataPoints.length; ++$) p6.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(w.dataPoints[$], O.uint32(10).fork()).ldelim();
                            if (w.aggregationTemporality != null && Object.hasOwnProperty.call(w, "aggregationTemporality")) O.uint32(16).int32(w.aggregationTemporality);
                            if (w.isMonotonic != null && Object.hasOwnProperty.call(w, "isMonotonic")) O.uint32(24).bool(w.isMonotonic);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.metrics.v1.Sum;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(j.dataPoints && j.dataPoints.length)) j.dataPoints = [];
                                        j.dataPoints.push(p6.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(w, w.uint32()));
                                        break
                                    }
                                    case 2: {
                                        j.aggregationTemporality = w.int32();
                                        break
                                    }
                                    case 3: {
                                        j.isMonotonic = w.bool();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.dataPoints != null && w.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(w.dataPoints)) return "dataPoints: array expected";
                                for (var O = 0; O < w.dataPoints.length; ++O) {
                                    var $ = p6.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(w.dataPoints[O]);
                                    if ($) return "dataPoints." + $
                                }
                            }
                            if (w.aggregationTemporality != null && w.hasOwnProperty("aggregationTemporality")) switch (w.aggregationTemporality) {
                                default:
                                    return "aggregationTemporality: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            if (w.isMonotonic != null && w.hasOwnProperty("isMonotonic")) {
                                if (typeof w.isMonotonic !== "boolean") return "isMonotonic: boolean expected"
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.metrics.v1.Sum) return w;
                            var O = new p6.opentelemetry.proto.metrics.v1.Sum;
                            if (w.dataPoints) {
                                if (!Array.isArray(w.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: array expected");
                                O.dataPoints = [];
                                for (var $ = 0; $ < w.dataPoints.length; ++$) {
                                    if (typeof w.dataPoints[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: object expected");
                                    O.dataPoints[$] = p6.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(w.dataPoints[$])
                                }
                            }
                            switch (w.aggregationTemporality) {
                                default:
                                    if (typeof w.aggregationTemporality === "number") {
                                        O.aggregationTemporality = w.aggregationTemporality;
                                        break
                                    }
                                    break;
                                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                                case 0:
                                    O.aggregationTemporality = 0;
                                    break;
                                case "AGGREGATION_TEMPORALITY_DELTA":
                                case 1:
                                    O.aggregationTemporality = 1;
                                    break;
                                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                                case 2:
                                    O.aggregationTemporality = 2;
                                    break
                            }
                            if (w.isMonotonic != null) O.isMonotonic = Boolean(w.isMonotonic);
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.dataPoints = [];
                            if (O.defaults) $.aggregationTemporality = O.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0, $.isMonotonic = !1;
                            if (w.dataPoints && w.dataPoints.length) {
                                $.dataPoints = [];
                                for (var H = 0; H < w.dataPoints.length; ++H) $.dataPoints[H] = p6.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(w.dataPoints[H], O)
                            }
                            if (w.aggregationTemporality != null && w.hasOwnProperty("aggregationTemporality")) $.aggregationTemporality = O.enums === String ? p6.opentelemetry.proto.metrics.v1.AggregationTemporality[w.aggregationTemporality] === void 0 ? w.aggregationTemporality : p6.opentelemetry.proto.metrics.v1.AggregationTemporality[w.aggregationTemporality] : w.aggregationTemporality;
                            if (w.isMonotonic != null && w.hasOwnProperty("isMonotonic")) $.isMonotonic = w.isMonotonic;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.Sum"
                        }, z
                    }(), Y.Histogram = function() {
                        function z(_) {
                            if (this.dataPoints = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.dataPoints = r6.emptyArray, z.prototype.aggregationTemporality = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.dataPoints != null && w.dataPoints.length)
                                for (var $ = 0; $ < w.dataPoints.length; ++$) p6.opentelemetry.proto.metrics.v1.HistogramDataPoint.encode(w.dataPoints[$], O.uint32(10).fork()).ldelim();
                            if (w.aggregationTemporality != null && Object.hasOwnProperty.call(w, "aggregationTemporality")) O.uint32(16).int32(w.aggregationTemporality);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.metrics.v1.Histogram;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(j.dataPoints && j.dataPoints.length)) j.dataPoints = [];
                                        j.dataPoints.push(p6.opentelemetry.proto.metrics.v1.HistogramDataPoint.decode(w, w.uint32()));
                                        break
                                    }
                                    case 2: {
                                        j.aggregationTemporality = w.int32();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.dataPoints != null && w.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(w.dataPoints)) return "dataPoints: array expected";
                                for (var O = 0; O < w.dataPoints.length; ++O) {
                                    var $ = p6.opentelemetry.proto.metrics.v1.HistogramDataPoint.verify(w.dataPoints[O]);
                                    if ($) return "dataPoints." + $
                                }
                            }
                            if (w.aggregationTemporality != null && w.hasOwnProperty("aggregationTemporality")) switch (w.aggregationTemporality) {
                                default:
                                    return "aggregationTemporality: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.metrics.v1.Histogram) return w;
                            var O = new p6.opentelemetry.proto.metrics.v1.Histogram;
                            if (w.dataPoints) {
                                if (!Array.isArray(w.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: array expected");
                                O.dataPoints = [];
                                for (var $ = 0; $ < w.dataPoints.length; ++$) {
                                    if (typeof w.dataPoints[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: object expected");
                                    O.dataPoints[$] = p6.opentelemetry.proto.metrics.v1.HistogramDataPoint.fromObject(w.dataPoints[$])
                                }
                            }
                            switch (w.aggregationTemporality) {
                                default:
                                    if (typeof w.aggregationTemporality === "number") {
                                        O.aggregationTemporality = w.aggregationTemporality;
                                        break
                                    }
                                    break;
                                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                                case 0:
                                    O.aggregationTemporality = 0;
                                    break;
                                case "AGGREGATION_TEMPORALITY_DELTA":
                                case 1:
                                    O.aggregationTemporality = 1;
                                    break;
                                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                                case 2:
                                    O.aggregationTemporality = 2;
                                    break
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.dataPoints = [];
                            if (O.defaults) $.aggregationTemporality = O.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
                            if (w.dataPoints && w.dataPoints.length) {
                                $.dataPoints = [];
                                for (var H = 0; H < w.dataPoints.length; ++H) $.dataPoints[H] = p6.opentelemetry.proto.metrics.v1.HistogramDataPoint.toObject(w.dataPoints[H], O)
                            }
                            if (w.aggregationTemporality != null && w.hasOwnProperty("aggregationTemporality")) $.aggregationTemporality = O.enums === String ? p6.opentelemetry.proto.metrics.v1.AggregationTemporality[w.aggregationTemporality] === void 0 ? w.aggregationTemporality : p6.opentelemetry.proto.metrics.v1.AggregationTemporality[w.aggregationTemporality] : w.aggregationTemporality;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.Histogram"
                        }, z
                    }(), Y.ExponentialHistogram = function() {
                        function z(_) {
                            if (this.dataPoints = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.dataPoints = r6.emptyArray, z.prototype.aggregationTemporality = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.dataPoints != null && w.dataPoints.length)
                                for (var $ = 0; $ < w.dataPoints.length; ++$) p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.encode(w.dataPoints[$], O.uint32(10).fork()).ldelim();
                            if (w.aggregationTemporality != null && Object.hasOwnProperty.call(w, "aggregationTemporality")) O.uint32(16).int32(w.aggregationTemporality);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.metrics.v1.ExponentialHistogram;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(j.dataPoints && j.dataPoints.length)) j.dataPoints = [];
                                        j.dataPoints.push(p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.decode(w, w.uint32()));
                                        break
                                    }
                                    case 2: {
                                        j.aggregationTemporality = w.int32();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.dataPoints != null && w.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(w.dataPoints)) return "dataPoints: array expected";
                                for (var O = 0; O < w.dataPoints.length; ++O) {
                                    var $ = p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.verify(w.dataPoints[O]);
                                    if ($) return "dataPoints." + $
                                }
                            }
                            if (w.aggregationTemporality != null && w.hasOwnProperty("aggregationTemporality")) switch (w.aggregationTemporality) {
                                default:
                                    return "aggregationTemporality: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.metrics.v1.ExponentialHistogram) return w;
                            var O = new p6.opentelemetry.proto.metrics.v1.ExponentialHistogram;
                            if (w.dataPoints) {
                                if (!Array.isArray(w.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: array expected");
                                O.dataPoints = [];
                                for (var $ = 0; $ < w.dataPoints.length; ++$) {
                                    if (typeof w.dataPoints[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: object expected");
                                    O.dataPoints[$] = p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.fromObject(w.dataPoints[$])
                                }
                            }
                            switch (w.aggregationTemporality) {
                                default:
                                    if (typeof w.aggregationTemporality === "number") {
                                        O.aggregationTemporality = w.aggregationTemporality;
                                        break
                                    }
                                    break;
                                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                                case 0:
                                    O.aggregationTemporality = 0;
                                    break;
                                case "AGGREGATION_TEMPORALITY_DELTA":
                                case 1:
                                    O.aggregationTemporality = 1;
                                    break;
                                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                                case 2:
                                    O.aggregationTemporality = 2;
                                    break
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.dataPoints = [];
                            if (O.defaults) $.aggregationTemporality = O.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
                            if (w.dataPoints && w.dataPoints.length) {
                                $.dataPoints = [];
                                for (var H = 0; H < w.dataPoints.length; ++H) $.dataPoints[H] = p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.toObject(w.dataPoints[H], O)
                            }
                            if (w.aggregationTemporality != null && w.hasOwnProperty("aggregationTemporality")) $.aggregationTemporality = O.enums === String ? p6.opentelemetry.proto.metrics.v1.AggregationTemporality[w.aggregationTemporality] === void 0 ? w.aggregationTemporality : p6.opentelemetry.proto.metrics.v1.AggregationTemporality[w.aggregationTemporality] : w.aggregationTemporality;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.ExponentialHistogram"
                        }, z
                    }(), Y.Summary = function() {
                        function z(_) {
                            if (this.dataPoints = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.dataPoints = r6.emptyArray, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.dataPoints != null && w.dataPoints.length)
                                for (var $ = 0; $ < w.dataPoints.length; ++$) p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.encode(w.dataPoints[$], O.uint32(10).fork()).ldelim();
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.metrics.v1.Summary;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(j.dataPoints && j.dataPoints.length)) j.dataPoints = [];
                                        j.dataPoints.push(p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.decode(w, w.uint32()));
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.dataPoints != null && w.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(w.dataPoints)) return "dataPoints: array expected";
                                for (var O = 0; O < w.dataPoints.length; ++O) {
                                    var $ = p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.verify(w.dataPoints[O]);
                                    if ($) return "dataPoints." + $
                                }
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.metrics.v1.Summary) return w;
                            var O = new p6.opentelemetry.proto.metrics.v1.Summary;
                            if (w.dataPoints) {
                                if (!Array.isArray(w.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: array expected");
                                O.dataPoints = [];
                                for (var $ = 0; $ < w.dataPoints.length; ++$) {
                                    if (typeof w.dataPoints[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: object expected");
                                    O.dataPoints[$] = p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.fromObject(w.dataPoints[$])
                                }
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.dataPoints = [];
                            if (w.dataPoints && w.dataPoints.length) {
                                $.dataPoints = [];
                                for (var H = 0; H < w.dataPoints.length; ++H) $.dataPoints[H] = p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.toObject(w.dataPoints[H], O)
                            }
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.Summary"
                        }, z
                    }(), Y.AggregationTemporality = function() {
                        var z = {},
                            _ = Object.create(z);
                        return _[z[0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED"] = 0, _[z[1] = "AGGREGATION_TEMPORALITY_DELTA"] = 1, _[z[2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"] = 2, _
                    }(), Y.DataPointFlags = function() {
                        var z = {},
                            _ = Object.create(z);
                        return _[z[0] = "DATA_POINT_FLAGS_DO_NOT_USE"] = 0, _[z[1] = "DATA_POINT_FLAGS_NO_RECORDED_VALUE_MASK"] = 1, _
                    }(), Y.NumberDataPoint = function() {
                        function z(w) {
                            if (this.attributes = [], this.exemplars = [], w) {
                                for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                    if (w[O[$]] != null) this[O[$]] = w[O[$]]
                            }
                        }
                        z.prototype.attributes = r6.emptyArray, z.prototype.startTimeUnixNano = null, z.prototype.timeUnixNano = null, z.prototype.asDouble = null, z.prototype.asInt = null, z.prototype.exemplars = r6.emptyArray, z.prototype.flags = null;
                        var _;
                        return Object.defineProperty(z.prototype, "value", {
                            get: r6.oneOfGetter(_ = ["asDouble", "asInt"]),
                            set: r6.oneOfSetter(_)
                        }), z.create = function(O) {
                            return new z(O)
                        }, z.encode = function(O, $) {
                            if (!$) $ = n5.create();
                            if (O.startTimeUnixNano != null && Object.hasOwnProperty.call(O, "startTimeUnixNano")) $.uint32(17).fixed64(O.startTimeUnixNano);
                            if (O.timeUnixNano != null && Object.hasOwnProperty.call(O, "timeUnixNano")) $.uint32(25).fixed64(O.timeUnixNano);
                            if (O.asDouble != null && Object.hasOwnProperty.call(O, "asDouble")) $.uint32(33).double(O.asDouble);
                            if (O.exemplars != null && O.exemplars.length)
                                for (var H = 0; H < O.exemplars.length; ++H) p6.opentelemetry.proto.metrics.v1.Exemplar.encode(O.exemplars[H], $.uint32(42).fork()).ldelim();
                            if (O.asInt != null && Object.hasOwnProperty.call(O, "asInt")) $.uint32(49).sfixed64(O.asInt);
                            if (O.attributes != null && O.attributes.length)
                                for (var H = 0; H < O.attributes.length; ++H) p6.opentelemetry.proto.common.v1.KeyValue.encode(O.attributes[H], $.uint32(58).fork()).ldelim();
                            if (O.flags != null && Object.hasOwnProperty.call(O, "flags")) $.uint32(64).uint32(O.flags);
                            return $
                        }, z.encodeDelimited = function(O, $) {
                            return this.encode(O, $).ldelim()
                        }, z.decode = function(O, $, H) {
                            if (!(O instanceof $8)) O = $8.create(O);
                            var j = $ === void 0 ? O.len : O.pos + $,
                                J = new p6.opentelemetry.proto.metrics.v1.NumberDataPoint;
                            while (O.pos < j) {
                                var M = O.uint32();
                                if (M === H) break;
                                switch (M >>> 3) {
                                    case 7: {
                                        if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                        J.attributes.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.startTimeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 3: {
                                        J.timeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 4: {
                                        J.asDouble = O.double();
                                        break
                                    }
                                    case 6: {
                                        J.asInt = O.sfixed64();
                                        break
                                    }
                                    case 5: {
                                        if (!(J.exemplars && J.exemplars.length)) J.exemplars = [];
                                        J.exemplars.push(p6.opentelemetry.proto.metrics.v1.Exemplar.decode(O, O.uint32()));
                                        break
                                    }
                                    case 8: {
                                        J.flags = O.uint32();
                                        break
                                    }
                                    default:
                                        O.skipType(M & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(O) {
                            if (!(O instanceof $8)) O = new $8(O);
                            return this.decode(O, O.uint32())
                        }, z.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            var $ = {};
                            if (O.attributes != null && O.hasOwnProperty("attributes")) {
                                if (!Array.isArray(O.attributes)) return "attributes: array expected";
                                for (var H = 0; H < O.attributes.length; ++H) {
                                    var j = p6.opentelemetry.proto.common.v1.KeyValue.verify(O.attributes[H]);
                                    if (j) return "attributes." + j
                                }
                            }
                            if (O.startTimeUnixNano != null && O.hasOwnProperty("startTimeUnixNano")) {
                                if (!r6.isInteger(O.startTimeUnixNano) && !(O.startTimeUnixNano && r6.isInteger(O.startTimeUnixNano.low) && r6.isInteger(O.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano")) {
                                if (!r6.isInteger(O.timeUnixNano) && !(O.timeUnixNano && r6.isInteger(O.timeUnixNano.low) && r6.isInteger(O.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (O.asDouble != null && O.hasOwnProperty("asDouble")) {
                                if ($.value = 1, typeof O.asDouble !== "number") return "asDouble: number expected"
                            }
                            if (O.asInt != null && O.hasOwnProperty("asInt")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, !r6.isInteger(O.asInt) && !(O.asInt && r6.isInteger(O.asInt.low) && r6.isInteger(O.asInt.high))) return "asInt: integer|Long expected"
                            }
                            if (O.exemplars != null && O.hasOwnProperty("exemplars")) {
                                if (!Array.isArray(O.exemplars)) return "exemplars: array expected";
                                for (var H = 0; H < O.exemplars.length; ++H) {
                                    var j = p6.opentelemetry.proto.metrics.v1.Exemplar.verify(O.exemplars[H]);
                                    if (j) return "exemplars." + j
                                }
                            }
                            if (O.flags != null && O.hasOwnProperty("flags")) {
                                if (!r6.isInteger(O.flags)) return "flags: integer expected"
                            }
                            return null
                        }, z.fromObject = function(O) {
                            if (O instanceof p6.opentelemetry.proto.metrics.v1.NumberDataPoint) return O;
                            var $ = new p6.opentelemetry.proto.metrics.v1.NumberDataPoint;
                            if (O.attributes) {
                                if (!Array.isArray(O.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: array expected");
                                $.attributes = [];
                                for (var H = 0; H < O.attributes.length; ++H) {
                                    if (typeof O.attributes[H] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: object expected");
                                    $.attributes[H] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.attributes[H])
                                }
                            }
                            if (O.startTimeUnixNano != null) {
                                if (r6.Long)($.startTimeUnixNano = r6.Long.fromValue(O.startTimeUnixNano)).unsigned = !1;
                                else if (typeof O.startTimeUnixNano === "string") $.startTimeUnixNano = parseInt(O.startTimeUnixNano, 10);
                                else if (typeof O.startTimeUnixNano === "number") $.startTimeUnixNano = O.startTimeUnixNano;
                                else if (typeof O.startTimeUnixNano === "object") $.startTimeUnixNano = new r6.LongBits(O.startTimeUnixNano.low >>> 0, O.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.timeUnixNano != null) {
                                if (r6.Long)($.timeUnixNano = r6.Long.fromValue(O.timeUnixNano)).unsigned = !1;
                                else if (typeof O.timeUnixNano === "string") $.timeUnixNano = parseInt(O.timeUnixNano, 10);
                                else if (typeof O.timeUnixNano === "number") $.timeUnixNano = O.timeUnixNano;
                                else if (typeof O.timeUnixNano === "object") $.timeUnixNano = new r6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.asDouble != null) $.asDouble = Number(O.asDouble);
                            if (O.asInt != null) {
                                if (r6.Long)($.asInt = r6.Long.fromValue(O.asInt)).unsigned = !1;
                                else if (typeof O.asInt === "string") $.asInt = parseInt(O.asInt, 10);
                                else if (typeof O.asInt === "number") $.asInt = O.asInt;
                                else if (typeof O.asInt === "object") $.asInt = new r6.LongBits(O.asInt.low >>> 0, O.asInt.high >>> 0).toNumber()
                            }
                            if (O.exemplars) {
                                if (!Array.isArray(O.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: array expected");
                                $.exemplars = [];
                                for (var H = 0; H < O.exemplars.length; ++H) {
                                    if (typeof O.exemplars[H] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: object expected");
                                    $.exemplars[H] = p6.opentelemetry.proto.metrics.v1.Exemplar.fromObject(O.exemplars[H])
                                }
                            }
                            if (O.flags != null) $.flags = O.flags >>> 0;
                            return $
                        }, z.toObject = function(O, $) {
                            if (!$) $ = {};
                            var H = {};
                            if ($.arrays || $.defaults) H.exemplars = [], H.attributes = [];
                            if ($.defaults) {
                                if (r6.Long) {
                                    var j = new r6.Long(0, 0, !1);
                                    H.startTimeUnixNano = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                } else H.startTimeUnixNano = $.longs === String ? "0" : 0;
                                if (r6.Long) {
                                    var j = new r6.Long(0, 0, !1);
                                    H.timeUnixNano = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                } else H.timeUnixNano = $.longs === String ? "0" : 0;
                                H.flags = 0
                            }
                            if (O.startTimeUnixNano != null && O.hasOwnProperty("startTimeUnixNano"))
                                if (typeof O.startTimeUnixNano === "number") H.startTimeUnixNano = $.longs === String ? String(O.startTimeUnixNano) : O.startTimeUnixNano;
                                else H.startTimeUnixNano = $.longs === String ? r6.Long.prototype.toString.call(O.startTimeUnixNano) : $.longs === Number ? new r6.LongBits(O.startTimeUnixNano.low >>> 0, O.startTimeUnixNano.high >>> 0).toNumber() : O.startTimeUnixNano;
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano"))
                                if (typeof O.timeUnixNano === "number") H.timeUnixNano = $.longs === String ? String(O.timeUnixNano) : O.timeUnixNano;
                                else H.timeUnixNano = $.longs === String ? r6.Long.prototype.toString.call(O.timeUnixNano) : $.longs === Number ? new r6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber() : O.timeUnixNano;
                            if (O.asDouble != null && O.hasOwnProperty("asDouble")) {
                                if (H.asDouble = $.json && !isFinite(O.asDouble) ? String(O.asDouble) : O.asDouble, $.oneofs) H.value = "asDouble"
                            }
                            if (O.exemplars && O.exemplars.length) {
                                H.exemplars = [];
                                for (var J = 0; J < O.exemplars.length; ++J) H.exemplars[J] = p6.opentelemetry.proto.metrics.v1.Exemplar.toObject(O.exemplars[J], $)
                            }
                            if (O.asInt != null && O.hasOwnProperty("asInt")) {
                                if (typeof O.asInt === "number") H.asInt = $.longs === String ? String(O.asInt) : O.asInt;
                                else H.asInt = $.longs === String ? r6.Long.prototype.toString.call(O.asInt) : $.longs === Number ? new r6.LongBits(O.asInt.low >>> 0, O.asInt.high >>> 0).toNumber() : O.asInt;
                                if ($.oneofs) H.value = "asInt"
                            }
                            if (O.attributes && O.attributes.length) {
                                H.attributes = [];
                                for (var J = 0; J < O.attributes.length; ++J) H.attributes[J] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(O.attributes[J], $)
                            }
                            if (O.flags != null && O.hasOwnProperty("flags")) H.flags = O.flags;
                            return H
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.NumberDataPoint"
                        }, z
                    }(), Y.HistogramDataPoint = function() {
                        function z(w) {
                            if (this.attributes = [], this.bucketCounts = [], this.explicitBounds = [], this.exemplars = [], w) {
                                for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                    if (w[O[$]] != null) this[O[$]] = w[O[$]]
                            }
                        }
                        z.prototype.attributes = r6.emptyArray, z.prototype.startTimeUnixNano = null, z.prototype.timeUnixNano = null, z.prototype.count = null, z.prototype.sum = null, z.prototype.bucketCounts = r6.emptyArray, z.prototype.explicitBounds = r6.emptyArray, z.prototype.exemplars = r6.emptyArray, z.prototype.flags = null, z.prototype.min = null, z.prototype.max = null;
                        var _;
                        return Object.defineProperty(z.prototype, "_sum", {
                            get: r6.oneOfGetter(_ = ["sum"]),
                            set: r6.oneOfSetter(_)
                        }), Object.defineProperty(z.prototype, "_min", {
                            get: r6.oneOfGetter(_ = ["min"]),
                            set: r6.oneOfSetter(_)
                        }), Object.defineProperty(z.prototype, "_max", {
                            get: r6.oneOfGetter(_ = ["max"]),
                            set: r6.oneOfSetter(_)
                        }), z.create = function(O) {
                            return new z(O)
                        }, z.encode = function(O, $) {
                            if (!$) $ = n5.create();
                            if (O.startTimeUnixNano != null && Object.hasOwnProperty.call(O, "startTimeUnixNano")) $.uint32(17).fixed64(O.startTimeUnixNano);
                            if (O.timeUnixNano != null && Object.hasOwnProperty.call(O, "timeUnixNano")) $.uint32(25).fixed64(O.timeUnixNano);
                            if (O.count != null && Object.hasOwnProperty.call(O, "count")) $.uint32(33).fixed64(O.count);
                            if (O.sum != null && Object.hasOwnProperty.call(O, "sum")) $.uint32(41).double(O.sum);
                            if (O.bucketCounts != null && O.bucketCounts.length) {
                                $.uint32(50).fork();
                                for (var H = 0; H < O.bucketCounts.length; ++H) $.fixed64(O.bucketCounts[H]);
                                $.ldelim()
                            }
                            if (O.explicitBounds != null && O.explicitBounds.length) {
                                $.uint32(58).fork();
                                for (var H = 0; H < O.explicitBounds.length; ++H) $.double(O.explicitBounds[H]);
                                $.ldelim()
                            }
                            if (O.exemplars != null && O.exemplars.length)
                                for (var H = 0; H < O.exemplars.length; ++H) p6.opentelemetry.proto.metrics.v1.Exemplar.encode(O.exemplars[H], $.uint32(66).fork()).ldelim();
                            if (O.attributes != null && O.attributes.length)
                                for (var H = 0; H < O.attributes.length; ++H) p6.opentelemetry.proto.common.v1.KeyValue.encode(O.attributes[H], $.uint32(74).fork()).ldelim();
                            if (O.flags != null && Object.hasOwnProperty.call(O, "flags")) $.uint32(80).uint32(O.flags);
                            if (O.min != null && Object.hasOwnProperty.call(O, "min")) $.uint32(89).double(O.min);
                            if (O.max != null && Object.hasOwnProperty.call(O, "max")) $.uint32(97).double(O.max);
                            return $
                        }, z.encodeDelimited = function(O, $) {
                            return this.encode(O, $).ldelim()
                        }, z.decode = function(O, $, H) {
                            if (!(O instanceof $8)) O = $8.create(O);
                            var j = $ === void 0 ? O.len : O.pos + $,
                                J = new p6.opentelemetry.proto.metrics.v1.HistogramDataPoint;
                            while (O.pos < j) {
                                var M = O.uint32();
                                if (M === H) break;
                                switch (M >>> 3) {
                                    case 9: {
                                        if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                        J.attributes.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.startTimeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 3: {
                                        J.timeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 4: {
                                        J.count = O.fixed64();
                                        break
                                    }
                                    case 5: {
                                        J.sum = O.double();
                                        break
                                    }
                                    case 6: {
                                        if (!(J.bucketCounts && J.bucketCounts.length)) J.bucketCounts = [];
                                        if ((M & 7) === 2) {
                                            var D = O.uint32() + O.pos;
                                            while (O.pos < D) J.bucketCounts.push(O.fixed64())
                                        } else J.bucketCounts.push(O.fixed64());
                                        break
                                    }
                                    case 7: {
                                        if (!(J.explicitBounds && J.explicitBounds.length)) J.explicitBounds = [];
                                        if ((M & 7) === 2) {
                                            var D = O.uint32() + O.pos;
                                            while (O.pos < D) J.explicitBounds.push(O.double())
                                        } else J.explicitBounds.push(O.double());
                                        break
                                    }
                                    case 8: {
                                        if (!(J.exemplars && J.exemplars.length)) J.exemplars = [];
                                        J.exemplars.push(p6.opentelemetry.proto.metrics.v1.Exemplar.decode(O, O.uint32()));
                                        break
                                    }
                                    case 10: {
                                        J.flags = O.uint32();
                                        break
                                    }
                                    case 11: {
                                        J.min = O.double();
                                        break
                                    }
                                    case 12: {
                                        J.max = O.double();
                                        break
                                    }
                                    default:
                                        O.skipType(M & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(O) {
                            if (!(O instanceof $8)) O = new $8(O);
                            return this.decode(O, O.uint32())
                        }, z.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            var $ = {};
                            if (O.attributes != null && O.hasOwnProperty("attributes")) {
                                if (!Array.isArray(O.attributes)) return "attributes: array expected";
                                for (var H = 0; H < O.attributes.length; ++H) {
                                    var j = p6.opentelemetry.proto.common.v1.KeyValue.verify(O.attributes[H]);
                                    if (j) return "attributes." + j
                                }
                            }
                            if (O.startTimeUnixNano != null && O.hasOwnProperty("startTimeUnixNano")) {
                                if (!r6.isInteger(O.startTimeUnixNano) && !(O.startTimeUnixNano && r6.isInteger(O.startTimeUnixNano.low) && r6.isInteger(O.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano")) {
                                if (!r6.isInteger(O.timeUnixNano) && !(O.timeUnixNano && r6.isInteger(O.timeUnixNano.low) && r6.isInteger(O.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (O.count != null && O.hasOwnProperty("count")) {
                                if (!r6.isInteger(O.count) && !(O.count && r6.isInteger(O.count.low) && r6.isInteger(O.count.high))) return "count: integer|Long expected"
                            }
                            if (O.sum != null && O.hasOwnProperty("sum")) {
                                if ($._sum = 1, typeof O.sum !== "number") return "sum: number expected"
                            }
                            if (O.bucketCounts != null && O.hasOwnProperty("bucketCounts")) {
                                if (!Array.isArray(O.bucketCounts)) return "bucketCounts: array expected";
                                for (var H = 0; H < O.bucketCounts.length; ++H)
                                    if (!r6.isInteger(O.bucketCounts[H]) && !(O.bucketCounts[H] && r6.isInteger(O.bucketCounts[H].low) && r6.isInteger(O.bucketCounts[H].high))) return "bucketCounts: integer|Long[] expected"
                            }
                            if (O.explicitBounds != null && O.hasOwnProperty("explicitBounds")) {
                                if (!Array.isArray(O.explicitBounds)) return "explicitBounds: array expected";
                                for (var H = 0; H < O.explicitBounds.length; ++H)
                                    if (typeof O.explicitBounds[H] !== "number") return "explicitBounds: number[] expected"
                            }
                            if (O.exemplars != null && O.hasOwnProperty("exemplars")) {
                                if (!Array.isArray(O.exemplars)) return "exemplars: array expected";
                                for (var H = 0; H < O.exemplars.length; ++H) {
                                    var j = p6.opentelemetry.proto.metrics.v1.Exemplar.verify(O.exemplars[H]);
                                    if (j) return "exemplars." + j
                                }
                            }
                            if (O.flags != null && O.hasOwnProperty("flags")) {
                                if (!r6.isInteger(O.flags)) return "flags: integer expected"
                            }
                            if (O.min != null && O.hasOwnProperty("min")) {
                                if ($._min = 1, typeof O.min !== "number") return "min: number expected"
                            }
                            if (O.max != null && O.hasOwnProperty("max")) {
                                if ($._max = 1, typeof O.max !== "number") return "max: number expected"
                            }
                            return null
                        }, z.fromObject = function(O) {
                            if (O instanceof p6.opentelemetry.proto.metrics.v1.HistogramDataPoint) return O;
                            var $ = new p6.opentelemetry.proto.metrics.v1.HistogramDataPoint;
                            if (O.attributes) {
                                if (!Array.isArray(O.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: array expected");
                                $.attributes = [];
                                for (var H = 0; H < O.attributes.length; ++H) {
                                    if (typeof O.attributes[H] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: object expected");
                                    $.attributes[H] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.attributes[H])
                                }
                            }
                            if (O.startTimeUnixNano != null) {
                                if (r6.Long)($.startTimeUnixNano = r6.Long.fromValue(O.startTimeUnixNano)).unsigned = !1;
                                else if (typeof O.startTimeUnixNano === "string") $.startTimeUnixNano = parseInt(O.startTimeUnixNano, 10);
                                else if (typeof O.startTimeUnixNano === "number") $.startTimeUnixNano = O.startTimeUnixNano;
                                else if (typeof O.startTimeUnixNano === "object") $.startTimeUnixNano = new r6.LongBits(O.startTimeUnixNano.low >>> 0, O.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.timeUnixNano != null) {
                                if (r6.Long)($.timeUnixNano = r6.Long.fromValue(O.timeUnixNano)).unsigned = !1;
                                else if (typeof O.timeUnixNano === "string") $.timeUnixNano = parseInt(O.timeUnixNano, 10);
                                else if (typeof O.timeUnixNano === "number") $.timeUnixNano = O.timeUnixNano;
                                else if (typeof O.timeUnixNano === "object") $.timeUnixNano = new r6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.count != null) {
                                if (r6.Long)($.count = r6.Long.fromValue(O.count)).unsigned = !1;
                                else if (typeof O.count === "string") $.count = parseInt(O.count, 10);
                                else if (typeof O.count === "number") $.count = O.count;
                                else if (typeof O.count === "object") $.count = new r6.LongBits(O.count.low >>> 0, O.count.high >>> 0).toNumber()
                            }
                            if (O.sum != null) $.sum = Number(O.sum);
                            if (O.bucketCounts) {
                                if (!Array.isArray(O.bucketCounts)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.bucketCounts: array expected");
                                $.bucketCounts = [];
                                for (var H = 0; H < O.bucketCounts.length; ++H)
                                    if (r6.Long)($.bucketCounts[H] = r6.Long.fromValue(O.bucketCounts[H])).unsigned = !1;
                                    else if (typeof O.bucketCounts[H] === "string") $.bucketCounts[H] = parseInt(O.bucketCounts[H], 10);
                                else if (typeof O.bucketCounts[H] === "number") $.bucketCounts[H] = O.bucketCounts[H];
                                else if (typeof O.bucketCounts[H] === "object") $.bucketCounts[H] = new r6.LongBits(O.bucketCounts[H].low >>> 0, O.bucketCounts[H].high >>> 0).toNumber()
                            }
                            if (O.explicitBounds) {
                                if (!Array.isArray(O.explicitBounds)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.explicitBounds: array expected");
                                $.explicitBounds = [];
                                for (var H = 0; H < O.explicitBounds.length; ++H) $.explicitBounds[H] = Number(O.explicitBounds[H])
                            }
                            if (O.exemplars) {
                                if (!Array.isArray(O.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: array expected");
                                $.exemplars = [];
                                for (var H = 0; H < O.exemplars.length; ++H) {
                                    if (typeof O.exemplars[H] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: object expected");
                                    $.exemplars[H] = p6.opentelemetry.proto.metrics.v1.Exemplar.fromObject(O.exemplars[H])
                                }
                            }
                            if (O.flags != null) $.flags = O.flags >>> 0;
                            if (O.min != null) $.min = Number(O.min);
                            if (O.max != null) $.max = Number(O.max);
                            return $
                        }, z.toObject = function(O, $) {
                            if (!$) $ = {};
                            var H = {};
                            if ($.arrays || $.defaults) H.bucketCounts = [], H.explicitBounds = [], H.exemplars = [], H.attributes = [];
                            if ($.defaults) {
                                if (r6.Long) {
                                    var j = new r6.Long(0, 0, !1);
                                    H.startTimeUnixNano = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                } else H.startTimeUnixNano = $.longs === String ? "0" : 0;
                                if (r6.Long) {
                                    var j = new r6.Long(0, 0, !1);
                                    H.timeUnixNano = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                } else H.timeUnixNano = $.longs === String ? "0" : 0;
                                if (r6.Long) {
                                    var j = new r6.Long(0, 0, !1);
                                    H.count = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                } else H.count = $.longs === String ? "0" : 0;
                                H.flags = 0
                            }
                            if (O.startTimeUnixNano != null && O.hasOwnProperty("startTimeUnixNano"))
                                if (typeof O.startTimeUnixNano === "number") H.startTimeUnixNano = $.longs === String ? String(O.startTimeUnixNano) : O.startTimeUnixNano;
                                else H.startTimeUnixNano = $.longs === String ? r6.Long.prototype.toString.call(O.startTimeUnixNano) : $.longs === Number ? new r6.LongBits(O.startTimeUnixNano.low >>> 0, O.startTimeUnixNano.high >>> 0).toNumber() : O.startTimeUnixNano;
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano"))
                                if (typeof O.timeUnixNano === "number") H.timeUnixNano = $.longs === String ? String(O.timeUnixNano) : O.timeUnixNano;
                                else H.timeUnixNano = $.longs === String ? r6.Long.prototype.toString.call(O.timeUnixNano) : $.longs === Number ? new r6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber() : O.timeUnixNano;
                            if (O.count != null && O.hasOwnProperty("count"))
                                if (typeof O.count === "number") H.count = $.longs === String ? String(O.count) : O.count;
                                else H.count = $.longs === String ? r6.Long.prototype.toString.call(O.count) : $.longs === Number ? new r6.LongBits(O.count.low >>> 0, O.count.high >>> 0).toNumber() : O.count;
                            if (O.sum != null && O.hasOwnProperty("sum")) {
                                if (H.sum = $.json && !isFinite(O.sum) ? String(O.sum) : O.sum, $.oneofs) H._sum = "sum"
                            }
                            if (O.bucketCounts && O.bucketCounts.length) {
                                H.bucketCounts = [];
                                for (var J = 0; J < O.bucketCounts.length; ++J)
                                    if (typeof O.bucketCounts[J] === "number") H.bucketCounts[J] = $.longs === String ? String(O.bucketCounts[J]) : O.bucketCounts[J];
                                    else H.bucketCounts[J] = $.longs === String ? r6.Long.prototype.toString.call(O.bucketCounts[J]) : $.longs === Number ? new r6.LongBits(O.bucketCounts[J].low >>> 0, O.bucketCounts[J].high >>> 0).toNumber() : O.bucketCounts[J]
                            }
                            if (O.explicitBounds && O.explicitBounds.length) {
                                H.explicitBounds = [];
                                for (var J = 0; J < O.explicitBounds.length; ++J) H.explicitBounds[J] = $.json && !isFinite(O.explicitBounds[J]) ? String(O.explicitBounds[J]) : O.explicitBounds[J]
                            }
                            if (O.exemplars && O.exemplars.length) {
                                H.exemplars = [];
                                for (var J = 0; J < O.exemplars.length; ++J) H.exemplars[J] = p6.opentelemetry.proto.metrics.v1.Exemplar.toObject(O.exemplars[J], $)
                            }
                            if (O.attributes && O.attributes.length) {
                                H.attributes = [];
                                for (var J = 0; J < O.attributes.length; ++J) H.attributes[J] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(O.attributes[J], $)
                            }
                            if (O.flags != null && O.hasOwnProperty("flags")) H.flags = O.flags;
                            if (O.min != null && O.hasOwnProperty("min")) {
                                if (H.min = $.json && !isFinite(O.min) ? String(O.min) : O.min, $.oneofs) H._min = "min"
                            }
                            if (O.max != null && O.hasOwnProperty("max")) {
                                if (H.max = $.json && !isFinite(O.max) ? String(O.max) : O.max, $.oneofs) H._max = "max"
                            }
                            return H
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.HistogramDataPoint"
                        }, z
                    }(), Y.ExponentialHistogramDataPoint = function() {
                        function z(w) {
                            if (this.attributes = [], this.exemplars = [], w) {
                                for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                    if (w[O[$]] != null) this[O[$]] = w[O[$]]
                            }
                        }
                        z.prototype.attributes = r6.emptyArray, z.prototype.startTimeUnixNano = null, z.prototype.timeUnixNano = null, z.prototype.count = null, z.prototype.sum = null, z.prototype.scale = null, z.prototype.zeroCount = null, z.prototype.positive = null, z.prototype.negative = null, z.prototype.flags = null, z.prototype.exemplars = r6.emptyArray, z.prototype.min = null, z.prototype.max = null, z.prototype.zeroThreshold = null;
                        var _;
                        return Object.defineProperty(z.prototype, "_sum", {
                            get: r6.oneOfGetter(_ = ["sum"]),
                            set: r6.oneOfSetter(_)
                        }), Object.defineProperty(z.prototype, "_min", {
                            get: r6.oneOfGetter(_ = ["min"]),
                            set: r6.oneOfSetter(_)
                        }), Object.defineProperty(z.prototype, "_max", {
                            get: r6.oneOfGetter(_ = ["max"]),
                            set: r6.oneOfSetter(_)
                        }), z.create = function(O) {
                            return new z(O)
                        }, z.encode = function(O, $) {
                            if (!$) $ = n5.create();
                            if (O.attributes != null && O.attributes.length)
                                for (var H = 0; H < O.attributes.length; ++H) p6.opentelemetry.proto.common.v1.KeyValue.encode(O.attributes[H], $.uint32(10).fork()).ldelim();
                            if (O.startTimeUnixNano != null && Object.hasOwnProperty.call(O, "startTimeUnixNano")) $.uint32(17).fixed64(O.startTimeUnixNano);
                            if (O.timeUnixNano != null && Object.hasOwnProperty.call(O, "timeUnixNano")) $.uint32(25).fixed64(O.timeUnixNano);
                            if (O.count != null && Object.hasOwnProperty.call(O, "count")) $.uint32(33).fixed64(O.count);
                            if (O.sum != null && Object.hasOwnProperty.call(O, "sum")) $.uint32(41).double(O.sum);
                            if (O.scale != null && Object.hasOwnProperty.call(O, "scale")) $.uint32(48).sint32(O.scale);
                            if (O.zeroCount != null && Object.hasOwnProperty.call(O, "zeroCount")) $.uint32(57).fixed64(O.zeroCount);
                            if (O.positive != null && Object.hasOwnProperty.call(O, "positive")) p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode(O.positive, $.uint32(66).fork()).ldelim();
                            if (O.negative != null && Object.hasOwnProperty.call(O, "negative")) p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode(O.negative, $.uint32(74).fork()).ldelim();
                            if (O.flags != null && Object.hasOwnProperty.call(O, "flags")) $.uint32(80).uint32(O.flags);
                            if (O.exemplars != null && O.exemplars.length)
                                for (var H = 0; H < O.exemplars.length; ++H) p6.opentelemetry.proto.metrics.v1.Exemplar.encode(O.exemplars[H], $.uint32(90).fork()).ldelim();
                            if (O.min != null && Object.hasOwnProperty.call(O, "min")) $.uint32(97).double(O.min);
                            if (O.max != null && Object.hasOwnProperty.call(O, "max")) $.uint32(105).double(O.max);
                            if (O.zeroThreshold != null && Object.hasOwnProperty.call(O, "zeroThreshold")) $.uint32(113).double(O.zeroThreshold);
                            return $
                        }, z.encodeDelimited = function(O, $) {
                            return this.encode(O, $).ldelim()
                        }, z.decode = function(O, $, H) {
                            if (!(O instanceof $8)) O = $8.create(O);
                            var j = $ === void 0 ? O.len : O.pos + $,
                                J = new p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;
                            while (O.pos < j) {
                                var M = O.uint32();
                                if (M === H) break;
                                switch (M >>> 3) {
                                    case 1: {
                                        if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                        J.attributes.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.startTimeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 3: {
                                        J.timeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 4: {
                                        J.count = O.fixed64();
                                        break
                                    }
                                    case 5: {
                                        J.sum = O.double();
                                        break
                                    }
                                    case 6: {
                                        J.scale = O.sint32();
                                        break
                                    }
                                    case 7: {
                                        J.zeroCount = O.fixed64();
                                        break
                                    }
                                    case 8: {
                                        J.positive = p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(O, O.uint32());
                                        break
                                    }
                                    case 9: {
                                        J.negative = p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(O, O.uint32());
                                        break
                                    }
                                    case 10: {
                                        J.flags = O.uint32();
                                        break
                                    }
                                    case 11: {
                                        if (!(J.exemplars && J.exemplars.length)) J.exemplars = [];
                                        J.exemplars.push(p6.opentelemetry.proto.metrics.v1.Exemplar.decode(O, O.uint32()));
                                        break
                                    }
                                    case 12: {
                                        J.min = O.double();
                                        break
                                    }
                                    case 13: {
                                        J.max = O.double();
                                        break
                                    }
                                    case 14: {
                                        J.zeroThreshold = O.double();
                                        break
                                    }
                                    default:
                                        O.skipType(M & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(O) {
                            if (!(O instanceof $8)) O = new $8(O);
                            return this.decode(O, O.uint32())
                        }, z.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            var $ = {};
                            if (O.attributes != null && O.hasOwnProperty("attributes")) {
                                if (!Array.isArray(O.attributes)) return "attributes: array expected";
                                for (var H = 0; H < O.attributes.length; ++H) {
                                    var j = p6.opentelemetry.proto.common.v1.KeyValue.verify(O.attributes[H]);
                                    if (j) return "attributes." + j
                                }
                            }
                            if (O.startTimeUnixNano != null && O.hasOwnProperty("startTimeUnixNano")) {
                                if (!r6.isInteger(O.startTimeUnixNano) && !(O.startTimeUnixNano && r6.isInteger(O.startTimeUnixNano.low) && r6.isInteger(O.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano")) {
                                if (!r6.isInteger(O.timeUnixNano) && !(O.timeUnixNano && r6.isInteger(O.timeUnixNano.low) && r6.isInteger(O.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (O.count != null && O.hasOwnProperty("count")) {
                                if (!r6.isInteger(O.count) && !(O.count && r6.isInteger(O.count.low) && r6.isInteger(O.count.high))) return "count: integer|Long expected"
                            }
                            if (O.sum != null && O.hasOwnProperty("sum")) {
                                if ($._sum = 1, typeof O.sum !== "number") return "sum: number expected"
                            }
                            if (O.scale != null && O.hasOwnProperty("scale")) {
                                if (!r6.isInteger(O.scale)) return "scale: integer expected"
                            }
                            if (O.zeroCount != null && O.hasOwnProperty("zeroCount")) {
                                if (!r6.isInteger(O.zeroCount) && !(O.zeroCount && r6.isInteger(O.zeroCount.low) && r6.isInteger(O.zeroCount.high))) return "zeroCount: integer|Long expected"
                            }
                            if (O.positive != null && O.hasOwnProperty("positive")) {
                                var j = p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify(O.positive);
                                if (j) return "positive." + j
                            }
                            if (O.negative != null && O.hasOwnProperty("negative")) {
                                var j = p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify(O.negative);
                                if (j) return "negative." + j
                            }
                            if (O.flags != null && O.hasOwnProperty("flags")) {
                                if (!r6.isInteger(O.flags)) return "flags: integer expected"
                            }
                            if (O.exemplars != null && O.hasOwnProperty("exemplars")) {
                                if (!Array.isArray(O.exemplars)) return "exemplars: array expected";
                                for (var H = 0; H < O.exemplars.length; ++H) {
                                    var j = p6.opentelemetry.proto.metrics.v1.Exemplar.verify(O.exemplars[H]);
                                    if (j) return "exemplars." + j
                                }
                            }
                            if (O.min != null && O.hasOwnProperty("min")) {
                                if ($._min = 1, typeof O.min !== "number") return "min: number expected"
                            }
                            if (O.max != null && O.hasOwnProperty("max")) {
                                if ($._max = 1, typeof O.max !== "number") return "max: number expected"
                            }
                            if (O.zeroThreshold != null && O.hasOwnProperty("zeroThreshold")) {
                                if (typeof O.zeroThreshold !== "number") return "zeroThreshold: number expected"
                            }
                            return null
                        }, z.fromObject = function(O) {
                            if (O instanceof p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint) return O;
                            var $ = new p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;
                            if (O.attributes) {
                                if (!Array.isArray(O.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: array expected");
                                $.attributes = [];
                                for (var H = 0; H < O.attributes.length; ++H) {
                                    if (typeof O.attributes[H] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: object expected");
                                    $.attributes[H] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.attributes[H])
                                }
                            }
                            if (O.startTimeUnixNano != null) {
                                if (r6.Long)($.startTimeUnixNano = r6.Long.fromValue(O.startTimeUnixNano)).unsigned = !1;
                                else if (typeof O.startTimeUnixNano === "string") $.startTimeUnixNano = parseInt(O.startTimeUnixNano, 10);
                                else if (typeof O.startTimeUnixNano === "number") $.startTimeUnixNano = O.startTimeUnixNano;
                                else if (typeof O.startTimeUnixNano === "object") $.startTimeUnixNano = new r6.LongBits(O.startTimeUnixNano.low >>> 0, O.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.timeUnixNano != null) {
                                if (r6.Long)($.timeUnixNano = r6.Long.fromValue(O.timeUnixNano)).unsigned = !1;
                                else if (typeof O.timeUnixNano === "string") $.timeUnixNano = parseInt(O.timeUnixNano, 10);
                                else if (typeof O.timeUnixNano === "number") $.timeUnixNano = O.timeUnixNano;
                                else if (typeof O.timeUnixNano === "object") $.timeUnixNano = new r6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.count != null) {
                                if (r6.Long)($.count = r6.Long.fromValue(O.count)).unsigned = !1;
                                else if (typeof O.count === "string") $.count = parseInt(O.count, 10);
                                else if (typeof O.count === "number") $.count = O.count;
                                else if (typeof O.count === "object") $.count = new r6.LongBits(O.count.low >>> 0, O.count.high >>> 0).toNumber()
                            }
                            if (O.sum != null) $.sum = Number(O.sum);
                            if (O.scale != null) $.scale = O.scale | 0;
                            if (O.zeroCount != null) {
                                if (r6.Long)($.zeroCount = r6.Long.fromValue(O.zeroCount)).unsigned = !1;
                                else if (typeof O.zeroCount === "string") $.zeroCount = parseInt(O.zeroCount, 10);
                                else if (typeof O.zeroCount === "number") $.zeroCount = O.zeroCount;
                                else if (typeof O.zeroCount === "object") $.zeroCount = new r6.LongBits(O.zeroCount.low >>> 0, O.zeroCount.high >>> 0).toNumber()
                            }
                            if (O.positive != null) {
                                if (typeof O.positive !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.positive: object expected");
                                $.positive = p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(O.positive)
                            }
                            if (O.negative != null) {
                                if (typeof O.negative !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.negative: object expected");
                                $.negative = p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(O.negative)
                            }
                            if (O.flags != null) $.flags = O.flags >>> 0;
                            if (O.exemplars) {
                                if (!Array.isArray(O.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: array expected");
                                $.exemplars = [];
                                for (var H = 0; H < O.exemplars.length; ++H) {
                                    if (typeof O.exemplars[H] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: object expected");
                                    $.exemplars[H] = p6.opentelemetry.proto.metrics.v1.Exemplar.fromObject(O.exemplars[H])
                                }
                            }
                            if (O.min != null) $.min = Number(O.min);
                            if (O.max != null) $.max = Number(O.max);
                            if (O.zeroThreshold != null) $.zeroThreshold = Number(O.zeroThreshold);
                            return $
                        }, z.toObject = function(O, $) {
                            if (!$) $ = {};
                            var H = {};
                            if ($.arrays || $.defaults) H.attributes = [], H.exemplars = [];
                            if ($.defaults) {
                                if (r6.Long) {
                                    var j = new r6.Long(0, 0, !1);
                                    H.startTimeUnixNano = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                } else H.startTimeUnixNano = $.longs === String ? "0" : 0;
                                if (r6.Long) {
                                    var j = new r6.Long(0, 0, !1);
                                    H.timeUnixNano = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                } else H.timeUnixNano = $.longs === String ? "0" : 0;
                                if (r6.Long) {
                                    var j = new r6.Long(0, 0, !1);
                                    H.count = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                } else H.count = $.longs === String ? "0" : 0;
                                if (H.scale = 0, r6.Long) {
                                    var j = new r6.Long(0, 0, !1);
                                    H.zeroCount = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                } else H.zeroCount = $.longs === String ? "0" : 0;
                                H.positive = null, H.negative = null, H.flags = 0, H.zeroThreshold = 0
                            }
                            if (O.attributes && O.attributes.length) {
                                H.attributes = [];
                                for (var J = 0; J < O.attributes.length; ++J) H.attributes[J] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(O.attributes[J], $)
                            }
                            if (O.startTimeUnixNano != null && O.hasOwnProperty("startTimeUnixNano"))
                                if (typeof O.startTimeUnixNano === "number") H.startTimeUnixNano = $.longs === String ? String(O.startTimeUnixNano) : O.startTimeUnixNano;
                                else H.startTimeUnixNano = $.longs === String ? r6.Long.prototype.toString.call(O.startTimeUnixNano) : $.longs === Number ? new r6.LongBits(O.startTimeUnixNano.low >>> 0, O.startTimeUnixNano.high >>> 0).toNumber() : O.startTimeUnixNano;
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano"))
                                if (typeof O.timeUnixNano === "number") H.timeUnixNano = $.longs === String ? String(O.timeUnixNano) : O.timeUnixNano;
                                else H.timeUnixNano = $.longs === String ? r6.Long.prototype.toString.call(O.timeUnixNano) : $.longs === Number ? new r6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber() : O.timeUnixNano;
                            if (O.count != null && O.hasOwnProperty("count"))
                                if (typeof O.count === "number") H.count = $.longs === String ? String(O.count) : O.count;
                                else H.count = $.longs === String ? r6.Long.prototype.toString.call(O.count) : $.longs === Number ? new r6.LongBits(O.count.low >>> 0, O.count.high >>> 0).toNumber() : O.count;
                            if (O.sum != null && O.hasOwnProperty("sum")) {
                                if (H.sum = $.json && !isFinite(O.sum) ? String(O.sum) : O.sum, $.oneofs) H._sum = "sum"
                            }
                            if (O.scale != null && O.hasOwnProperty("scale")) H.scale = O.scale;
                            if (O.zeroCount != null && O.hasOwnProperty("zeroCount"))
                                if (typeof O.zeroCount === "number") H.zeroCount = $.longs === String ? String(O.zeroCount) : O.zeroCount;
                                else H.zeroCount = $.longs === String ? r6.Long.prototype.toString.call(O.zeroCount) : $.longs === Number ? new r6.LongBits(O.zeroCount.low >>> 0, O.zeroCount.high >>> 0).toNumber() : O.zeroCount;
                            if (O.positive != null && O.hasOwnProperty("positive")) H.positive = p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(O.positive, $);
                            if (O.negative != null && O.hasOwnProperty("negative")) H.negative = p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(O.negative, $);
                            if (O.flags != null && O.hasOwnProperty("flags")) H.flags = O.flags;
                            if (O.exemplars && O.exemplars.length) {
                                H.exemplars = [];
                                for (var J = 0; J < O.exemplars.length; ++J) H.exemplars[J] = p6.opentelemetry.proto.metrics.v1.Exemplar.toObject(O.exemplars[J], $)
                            }
                            if (O.min != null && O.hasOwnProperty("min")) {
                                if (H.min = $.json && !isFinite(O.min) ? String(O.min) : O.min, $.oneofs) H._min = "min"
                            }
                            if (O.max != null && O.hasOwnProperty("max")) {
                                if (H.max = $.json && !isFinite(O.max) ? String(O.max) : O.max, $.oneofs) H._max = "max"
                            }
                            if (O.zeroThreshold != null && O.hasOwnProperty("zeroThreshold")) H.zeroThreshold = $.json && !isFinite(O.zeroThreshold) ? String(O.zeroThreshold) : O.zeroThreshold;
                            return H
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint"
                        }, z.Buckets = function() {
                            function w(O) {
                                if (this.bucketCounts = [], O) {
                                    for (var $ = Object.keys(O), H = 0; H < $.length; ++H)
                                        if (O[$[H]] != null) this[$[H]] = O[$[H]]
                                }
                            }
                            return w.prototype.offset = null, w.prototype.bucketCounts = r6.emptyArray, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, H) {
                                if (!H) H = n5.create();
                                if ($.offset != null && Object.hasOwnProperty.call($, "offset")) H.uint32(8).sint32($.offset);
                                if ($.bucketCounts != null && $.bucketCounts.length) {
                                    H.uint32(18).fork();
                                    for (var j = 0; j < $.bucketCounts.length; ++j) H.uint64($.bucketCounts[j]);
                                    H.ldelim()
                                }
                                return H
                            }, w.encodeDelimited = function($, H) {
                                return this.encode($, H).ldelim()
                            }, w.decode = function($, H, j) {
                                if (!($ instanceof $8)) $ = $8.create($);
                                var J = H === void 0 ? $.len : $.pos + H,
                                    M = new p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === j) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            M.offset = $.sint32();
                                            break
                                        }
                                        case 2: {
                                            if (!(M.bucketCounts && M.bucketCounts.length)) M.bucketCounts = [];
                                            if ((D & 7) === 2) {
                                                var X = $.uint32() + $.pos;
                                                while ($.pos < X) M.bucketCounts.push($.uint64())
                                            } else M.bucketCounts.push($.uint64());
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return M
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $8)) $ = new $8($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.offset != null && $.hasOwnProperty("offset")) {
                                    if (!r6.isInteger($.offset)) return "offset: integer expected"
                                }
                                if ($.bucketCounts != null && $.hasOwnProperty("bucketCounts")) {
                                    if (!Array.isArray($.bucketCounts)) return "bucketCounts: array expected";
                                    for (var H = 0; H < $.bucketCounts.length; ++H)
                                        if (!r6.isInteger($.bucketCounts[H]) && !($.bucketCounts[H] && r6.isInteger($.bucketCounts[H].low) && r6.isInteger($.bucketCounts[H].high))) return "bucketCounts: integer|Long[] expected"
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets) return $;
                                var H = new p6.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;
                                if ($.offset != null) H.offset = $.offset | 0;
                                if ($.bucketCounts) {
                                    if (!Array.isArray($.bucketCounts)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.bucketCounts: array expected");
                                    H.bucketCounts = [];
                                    for (var j = 0; j < $.bucketCounts.length; ++j)
                                        if (r6.Long)(H.bucketCounts[j] = r6.Long.fromValue($.bucketCounts[j])).unsigned = !0;
                                        else if (typeof $.bucketCounts[j] === "string") H.bucketCounts[j] = parseInt($.bucketCounts[j], 10);
                                    else if (typeof $.bucketCounts[j] === "number") H.bucketCounts[j] = $.bucketCounts[j];
                                    else if (typeof $.bucketCounts[j] === "object") H.bucketCounts[j] = new r6.LongBits($.bucketCounts[j].low >>> 0, $.bucketCounts[j].high >>> 0).toNumber(!0)
                                }
                                return H
                            }, w.toObject = function($, H) {
                                if (!H) H = {};
                                var j = {};
                                if (H.arrays || H.defaults) j.bucketCounts = [];
                                if (H.defaults) j.offset = 0;
                                if ($.offset != null && $.hasOwnProperty("offset")) j.offset = $.offset;
                                if ($.bucketCounts && $.bucketCounts.length) {
                                    j.bucketCounts = [];
                                    for (var J = 0; J < $.bucketCounts.length; ++J)
                                        if (typeof $.bucketCounts[J] === "number") j.bucketCounts[J] = H.longs === String ? String($.bucketCounts[J]) : $.bucketCounts[J];
                                        else j.bucketCounts[J] = H.longs === String ? r6.Long.prototype.toString.call($.bucketCounts[J]) : H.longs === Number ? new r6.LongBits($.bucketCounts[J].low >>> 0, $.bucketCounts[J].high >>> 0).toNumber(!0) : $.bucketCounts[J]
                                }
                                return j
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets"
                            }, w
                        }(), z
                    }(), Y.SummaryDataPoint = function() {
                        function z(_) {
                            if (this.attributes = [], this.quantileValues = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.attributes = r6.emptyArray, z.prototype.startTimeUnixNano = null, z.prototype.timeUnixNano = null, z.prototype.count = null, z.prototype.sum = null, z.prototype.quantileValues = r6.emptyArray, z.prototype.flags = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.startTimeUnixNano != null && Object.hasOwnProperty.call(w, "startTimeUnixNano")) O.uint32(17).fixed64(w.startTimeUnixNano);
                            if (w.timeUnixNano != null && Object.hasOwnProperty.call(w, "timeUnixNano")) O.uint32(25).fixed64(w.timeUnixNano);
                            if (w.count != null && Object.hasOwnProperty.call(w, "count")) O.uint32(33).fixed64(w.count);
                            if (w.sum != null && Object.hasOwnProperty.call(w, "sum")) O.uint32(41).double(w.sum);
                            if (w.quantileValues != null && w.quantileValues.length)
                                for (var $ = 0; $ < w.quantileValues.length; ++$) p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.encode(w.quantileValues[$], O.uint32(50).fork()).ldelim();
                            if (w.attributes != null && w.attributes.length)
                                for (var $ = 0; $ < w.attributes.length; ++$) p6.opentelemetry.proto.common.v1.KeyValue.encode(w.attributes[$], O.uint32(58).fork()).ldelim();
                            if (w.flags != null && Object.hasOwnProperty.call(w, "flags")) O.uint32(64).uint32(w.flags);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.metrics.v1.SummaryDataPoint;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 7: {
                                        if (!(j.attributes && j.attributes.length)) j.attributes = [];
                                        j.attributes.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    case 2: {
                                        j.startTimeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 3: {
                                        j.timeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 4: {
                                        j.count = w.fixed64();
                                        break
                                    }
                                    case 5: {
                                        j.sum = w.double();
                                        break
                                    }
                                    case 6: {
                                        if (!(j.quantileValues && j.quantileValues.length)) j.quantileValues = [];
                                        j.quantileValues.push(p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.decode(w, w.uint32()));
                                        break
                                    }
                                    case 8: {
                                        j.flags = w.uint32();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.attributes != null && w.hasOwnProperty("attributes")) {
                                if (!Array.isArray(w.attributes)) return "attributes: array expected";
                                for (var O = 0; O < w.attributes.length; ++O) {
                                    var $ = p6.opentelemetry.proto.common.v1.KeyValue.verify(w.attributes[O]);
                                    if ($) return "attributes." + $
                                }
                            }
                            if (w.startTimeUnixNano != null && w.hasOwnProperty("startTimeUnixNano")) {
                                if (!r6.isInteger(w.startTimeUnixNano) && !(w.startTimeUnixNano && r6.isInteger(w.startTimeUnixNano.low) && r6.isInteger(w.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano")) {
                                if (!r6.isInteger(w.timeUnixNano) && !(w.timeUnixNano && r6.isInteger(w.timeUnixNano.low) && r6.isInteger(w.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (w.count != null && w.hasOwnProperty("count")) {
                                if (!r6.isInteger(w.count) && !(w.count && r6.isInteger(w.count.low) && r6.isInteger(w.count.high))) return "count: integer|Long expected"
                            }
                            if (w.sum != null && w.hasOwnProperty("sum")) {
                                if (typeof w.sum !== "number") return "sum: number expected"
                            }
                            if (w.quantileValues != null && w.hasOwnProperty("quantileValues")) {
                                if (!Array.isArray(w.quantileValues)) return "quantileValues: array expected";
                                for (var O = 0; O < w.quantileValues.length; ++O) {
                                    var $ = p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.verify(w.quantileValues[O]);
                                    if ($) return "quantileValues." + $
                                }
                            }
                            if (w.flags != null && w.hasOwnProperty("flags")) {
                                if (!r6.isInteger(w.flags)) return "flags: integer expected"
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.metrics.v1.SummaryDataPoint) return w;
                            var O = new p6.opentelemetry.proto.metrics.v1.SummaryDataPoint;
                            if (w.attributes) {
                                if (!Array.isArray(w.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: array expected");
                                O.attributes = [];
                                for (var $ = 0; $ < w.attributes.length; ++$) {
                                    if (typeof w.attributes[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: object expected");
                                    O.attributes[$] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.attributes[$])
                                }
                            }
                            if (w.startTimeUnixNano != null) {
                                if (r6.Long)(O.startTimeUnixNano = r6.Long.fromValue(w.startTimeUnixNano)).unsigned = !1;
                                else if (typeof w.startTimeUnixNano === "string") O.startTimeUnixNano = parseInt(w.startTimeUnixNano, 10);
                                else if (typeof w.startTimeUnixNano === "number") O.startTimeUnixNano = w.startTimeUnixNano;
                                else if (typeof w.startTimeUnixNano === "object") O.startTimeUnixNano = new r6.LongBits(w.startTimeUnixNano.low >>> 0, w.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.timeUnixNano != null) {
                                if (r6.Long)(O.timeUnixNano = r6.Long.fromValue(w.timeUnixNano)).unsigned = !1;
                                else if (typeof w.timeUnixNano === "string") O.timeUnixNano = parseInt(w.timeUnixNano, 10);
                                else if (typeof w.timeUnixNano === "number") O.timeUnixNano = w.timeUnixNano;
                                else if (typeof w.timeUnixNano === "object") O.timeUnixNano = new r6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.count != null) {
                                if (r6.Long)(O.count = r6.Long.fromValue(w.count)).unsigned = !1;
                                else if (typeof w.count === "string") O.count = parseInt(w.count, 10);
                                else if (typeof w.count === "number") O.count = w.count;
                                else if (typeof w.count === "object") O.count = new r6.LongBits(w.count.low >>> 0, w.count.high >>> 0).toNumber()
                            }
                            if (w.sum != null) O.sum = Number(w.sum);
                            if (w.quantileValues) {
                                if (!Array.isArray(w.quantileValues)) throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: array expected");
                                O.quantileValues = [];
                                for (var $ = 0; $ < w.quantileValues.length; ++$) {
                                    if (typeof w.quantileValues[$] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: object expected");
                                    O.quantileValues[$] = p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.fromObject(w.quantileValues[$])
                                }
                            }
                            if (w.flags != null) O.flags = w.flags >>> 0;
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.quantileValues = [], $.attributes = [];
                            if (O.defaults) {
                                if (r6.Long) {
                                    var H = new r6.Long(0, 0, !1);
                                    $.startTimeUnixNano = O.longs === String ? H.toString() : O.longs === Number ? H.toNumber() : H
                                } else $.startTimeUnixNano = O.longs === String ? "0" : 0;
                                if (r6.Long) {
                                    var H = new r6.Long(0, 0, !1);
                                    $.timeUnixNano = O.longs === String ? H.toString() : O.longs === Number ? H.toNumber() : H
                                } else $.timeUnixNano = O.longs === String ? "0" : 0;
                                if (r6.Long) {
                                    var H = new r6.Long(0, 0, !1);
                                    $.count = O.longs === String ? H.toString() : O.longs === Number ? H.toNumber() : H
                                } else $.count = O.longs === String ? "0" : 0;
                                $.sum = 0, $.flags = 0
                            }
                            if (w.startTimeUnixNano != null && w.hasOwnProperty("startTimeUnixNano"))
                                if (typeof w.startTimeUnixNano === "number") $.startTimeUnixNano = O.longs === String ? String(w.startTimeUnixNano) : w.startTimeUnixNano;
                                else $.startTimeUnixNano = O.longs === String ? r6.Long.prototype.toString.call(w.startTimeUnixNano) : O.longs === Number ? new r6.LongBits(w.startTimeUnixNano.low >>> 0, w.startTimeUnixNano.high >>> 0).toNumber() : w.startTimeUnixNano;
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano"))
                                if (typeof w.timeUnixNano === "number") $.timeUnixNano = O.longs === String ? String(w.timeUnixNano) : w.timeUnixNano;
                                else $.timeUnixNano = O.longs === String ? r6.Long.prototype.toString.call(w.timeUnixNano) : O.longs === Number ? new r6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber() : w.timeUnixNano;
                            if (w.count != null && w.hasOwnProperty("count"))
                                if (typeof w.count === "number") $.count = O.longs === String ? String(w.count) : w.count;
                                else $.count = O.longs === String ? r6.Long.prototype.toString.call(w.count) : O.longs === Number ? new r6.LongBits(w.count.low >>> 0, w.count.high >>> 0).toNumber() : w.count;
                            if (w.sum != null && w.hasOwnProperty("sum")) $.sum = O.json && !isFinite(w.sum) ? String(w.sum) : w.sum;
                            if (w.quantileValues && w.quantileValues.length) {
                                $.quantileValues = [];
                                for (var j = 0; j < w.quantileValues.length; ++j) $.quantileValues[j] = p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.toObject(w.quantileValues[j], O)
                            }
                            if (w.attributes && w.attributes.length) {
                                $.attributes = [];
                                for (var j = 0; j < w.attributes.length; ++j) $.attributes[j] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(w.attributes[j], O)
                            }
                            if (w.flags != null && w.hasOwnProperty("flags")) $.flags = w.flags;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.metrics.v1.SummaryDataPoint"
                        }, z.ValueAtQuantile = function() {
                            function _(w) {
                                if (w) {
                                    for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                        if (w[O[$]] != null) this[O[$]] = w[O[$]]
                                }
                            }
                            return _.prototype.quantile = null, _.prototype.value = null, _.create = function(O) {
                                return new _(O)
                            }, _.encode = function(O, $) {
                                if (!$) $ = n5.create();
                                if (O.quantile != null && Object.hasOwnProperty.call(O, "quantile")) $.uint32(9).double(O.quantile);
                                if (O.value != null && Object.hasOwnProperty.call(O, "value")) $.uint32(17).double(O.value);
                                return $
                            }, _.encodeDelimited = function(O, $) {
                                return this.encode(O, $).ldelim()
                            }, _.decode = function(O, $, H) {
                                if (!(O instanceof $8)) O = $8.create(O);
                                var j = $ === void 0 ? O.len : O.pos + $,
                                    J = new p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;
                                while (O.pos < j) {
                                    var M = O.uint32();
                                    if (M === H) break;
                                    switch (M >>> 3) {
                                        case 1: {
                                            J.quantile = O.double();
                                            break
                                        }
                                        case 2: {
                                            J.value = O.double();
                                            break
                                        }
                                        default:
                                            O.skipType(M & 7);
                                            break
                                    }
                                }
                                return J
                            }, _.decodeDelimited = function(O) {
                                if (!(O instanceof $8)) O = new $8(O);
                                return this.decode(O, O.uint32())
                            }, _.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.quantile != null && O.hasOwnProperty("quantile")) {
                                    if (typeof O.quantile !== "number") return "quantile: number expected"
                                }
                                if (O.value != null && O.hasOwnProperty("value")) {
                                    if (typeof O.value !== "number") return "value: number expected"
                                }
                                return null
                            }, _.fromObject = function(O) {
                                if (O instanceof p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile) return O;
                                var $ = new p6.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;
                                if (O.quantile != null) $.quantile = Number(O.quantile);
                                if (O.value != null) $.value = Number(O.value);
                                return $
                            }, _.toObject = function(O, $) {
                                if (!$) $ = {};
                                var H = {};
                                if ($.defaults) H.quantile = 0, H.value = 0;
                                if (O.quantile != null && O.hasOwnProperty("quantile")) H.quantile = $.json && !isFinite(O.quantile) ? String(O.quantile) : O.quantile;
                                if (O.value != null && O.hasOwnProperty("value")) H.value = $.json && !isFinite(O.value) ? String(O.value) : O.value;
                                return H
                            }, _.prototype.toJSON = function() {
                                return this.constructor.toObject(this, oq.util.toJSONOptions)
                            }, _.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile"
                            }, _
                        }(), z
                    }(), Y.Exemplar = function() {
                        function z(w) {
                            if (this.filteredAttributes = [], w) {
                                for (var O = Object.keys(w), $ = 0; $ < O.length; ++$)
                                    if (w[O[$]] != null) this[O[$]] = w[O[$]]
                            }
                        }
                        z.prototype.filteredAttributes = r6.emptyArray, z.prototype.timeUnixNano = null, z.prototype.asDouble = null, z.prototype.asInt = null, z.prototype.spanId = null, z.prototype.traceId = null;
                        var _;
                        return Object.defineProperty(z.prototype, "value", {
                            get: r6.oneOfGetter(_ = ["asDouble", "asInt"]),
                            set: r6.oneOfSetter(_)
                        }), z.create = function(O) {
                            return new z(O)
                        }, z.encode = function(O, $) {
                            if (!$) $ = n5.create();
                            if (O.timeUnixNano != null && Object.hasOwnProperty.call(O, "timeUnixNano")) $.uint32(17).fixed64(O.timeUnixNano);
                            if (O.asDouble != null && Object.hasOwnProperty.call(O, "asDouble")) $.uint32(25).double(O.asDouble);
                            if (O.spanId != null && Object.hasOwnProperty.call(O, "spanId")) $.uint32(34).bytes(O.spanId);
                            if (O.traceId != null && Object.hasOwnProperty.call(O, "traceId")) $.uint32(42).bytes(O.traceId);
                            if (O.asInt != null && Object.hasOwnProperty.call(O, "asInt")) $.uint32(49).sfixed64(O.asInt);
                            if (O.filteredAttributes != null && O.filteredAttributes.length)
                                for (var H = 0; H < O.filteredAttributes.length; ++H) p6.opentelemetry.proto.common.v1.KeyValue.encode(O.filteredAttributes[H], $.uint32(58).fork()).ldelim();
                            return $
                        }, z.encodeDelimited = function(O, $) {
                            return this.encode(O, $).ldelim()
                        }, z.decode = function(O, $, H) {
                            if (!(O instanceof $8)) O = $8.create(O);
                            var j = $ === void 0 ? O.len : O.pos + $,
                                J = new p6.opentelemetry.proto.metrics.v1.Exemplar;
                            while (O.pos < j) {
                                var M = O.uint32();
                                if (M === H) break;
                                switch (M >>> 3) {
                                    case 7: {
                                        if (!(J.filteredAttributes && J.filteredAttributes.length)) J.filteredAttributes = [];
                                        J.filteredAttributes.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(O, O.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.timeUnixNano = O.fixed64();
                                        break
                                    }
                                    case 3: {
                                        J.asDouble = O.double();
                                        break
                                    }
                                    case 6: {
                                        J.asInt = O.sfixed64();
                                        break
                                    }
                                    case 4: {
                                        J.spanId = O.bytes();
                                        break
                                    }
                                    case 5: {
                                        J.traceId = O.bytes();
                                        break
                                    }
                                    default:
                                        O.skipType(M & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(O) {
                            if (!(O instanceof $8)) O = new $8(O);
                            return this.decode(O, O.uint32())
                        }, z.verify = function(O) {
                            if (typeof O !== "object" || O === null) return "object expected";
                            var $ = {};
                            if (O.filteredAttributes != null && O.hasOwnProperty("filteredAttributes")) {
                                if (!Array.isArray(O.filteredAttributes)) return "filteredAttributes: array expected";
                                for (var H = 0; H < O.filteredAttributes.length; ++H) {
                                    var j = p6.opentelemetry.proto.common.v1.KeyValue.verify(O.filteredAttributes[H]);
                                    if (j) return "filteredAttributes." + j
                                }
                            }
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano")) {
                                if (!r6.isInteger(O.timeUnixNano) && !(O.timeUnixNano && r6.isInteger(O.timeUnixNano.low) && r6.isInteger(O.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (O.asDouble != null && O.hasOwnProperty("asDouble")) {
                                if ($.value = 1, typeof O.asDouble !== "number") return "asDouble: number expected"
                            }
                            if (O.asInt != null && O.hasOwnProperty("asInt")) {
                                if ($.value === 1) return "value: multiple values";
                                if ($.value = 1, !r6.isInteger(O.asInt) && !(O.asInt && r6.isInteger(O.asInt.low) && r6.isInteger(O.asInt.high))) return "asInt: integer|Long expected"
                            }
                            if (O.spanId != null && O.hasOwnProperty("spanId")) {
                                if (!(O.spanId && typeof O.spanId.length === "number" || r6.isString(O.spanId))) return "spanId: buffer expected"
                            }
                            if (O.traceId != null && O.hasOwnProperty("traceId")) {
                                if (!(O.traceId && typeof O.traceId.length === "number" || r6.isString(O.traceId))) return "traceId: buffer expected"
                            }
                            return null
                        }, z.fromObject = function(O) {
                            if (O instanceof p6.opentelemetry.proto.metrics.v1.Exemplar) return O;
                            var $ = new p6.opentelemetry.proto.metrics.v1.Exemplar;
                            if (O.filteredAttributes) {
                                if (!Array.isArray(O.filteredAttributes)) throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: array expected");
                                $.filteredAttributes = [];
                                for (var H = 0; H < O.filteredAttributes.length; ++H) {
                                    if (typeof O.filteredAttributes[H] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: object expected");
                                    $.filteredAttributes[H] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(O.filteredAttributes[H])
                                }
                            }
                            if (O.timeUnixNano != null) {
                                if (r6.Long)($.timeUnixNano = r6.Long.fromValue(O.timeUnixNano)).unsigned = !1;
                                else if (typeof O.timeUnixNano === "string") $.timeUnixNano = parseInt(O.timeUnixNano, 10);
                                else if (typeof O.timeUnixNano === "number") $.timeUnixNano = O.timeUnixNano;
                                else if (typeof O.timeUnixNano === "object") $.timeUnixNano = new r6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (O.asDouble != null) $.asDouble = Number(O.asDouble);
                            if (O.asInt != null) {
                                if (r6.Long)($.asInt = r6.Long.fromValue(O.asInt)).unsigned = !1;
                                else if (typeof O.asInt === "string") $.asInt = parseInt(O.asInt, 10);
                                else if (typeof O.asInt === "number") $.asInt = O.asInt;
                                else if (typeof O.asInt === "object") $.asInt = new r6.LongBits(O.asInt.low >>> 0, O.asInt.high >>> 0).toNumber()
                            }
                            if (O.spanId != null) {
                                if (typeof O.spanId === "string") r6.base64.decode(O.spanId, $.spanId = r6.newBuffer(r6.base64.length(O.spanId)), 0);
                                else if (O.spanId.length >= 0) $.spanId = O.spanId
                            }
                            if (O.traceId != null) {
                                if (typeof O.traceId === "string") r6.base64.decode(O.traceId, $.traceId = r6.newBuffer(r6.base64.length(O.traceId)), 0);
                                else if (O.traceId.length >= 0) $.traceId = O.traceId
                            }
                            return $
                        }, z.toObject = function(O, $) {
                            if (!$) $ = {};
                            var H = {};
                            if ($.arrays || $.defaults) H.filteredAttributes = [];
                            if ($.defaults) {
                                if (r6.Long) {
                                    var j = new r6.Long(0, 0, !1);
                                    H.timeUnixNano = $.longs === String ? j.toString() : $.longs === Number ? j.toNumber() : j
                                } else H.timeUnixNano = $.longs === String ? "0" : 0;
                                if ($.bytes === String) H.spanId = "";
                                else if (H.spanId = [], $.bytes !== Array) H.spanId = r6.newBuffer(H.spanId);
                                if ($.bytes === String) H.traceId = "";
                                else if (H.traceId = [], $.bytes !== Array) H.traceId = r6.newBuffer(H.traceId)
                            }
                            if (O.timeUnixNano != null && O.hasOwnProperty("timeUnixNano"))
                                if (typeof O.timeUnixNano === "number") H.timeUnixNano = $.longs === String ? String(O.timeUnixNano) : O.timeUnixNano;
                                else H.timeUnixNano = $.longs === String ? r6.Long.prototype.toString.call(O.timeUnixNano) : $.longs === Number ? new r6.LongBits(O.timeUnixNano.low >>> 0, O.timeUnixNano.high >>> 0).toNumber() : O.timeUnixNano;
                            if (O.asDouble != null && O.hasOwnProperty("asDouble")) {
                                if (H.asDouble = $.json && !isFinite(O.asDouble) ? String(O.asDouble) : O.asDouble, $.oneofs) H.value = "asDouble"
                            }
                            if (O.spanId != null && O.hasOwnProperty("spanId")) H.spanId = $.bytes === String ? r6.base64.encode(O.spanId, 0, O.spanId.length) : $.bytes === Array ? Array.prototype.slice.call(O.spanId) : O.spanId;
                            if (O.traceId != null && O.hasOwnProperty("traceId")) H.traceId = $.bytes === String ? r6.base64.encode(O.traceId, 0, O.traceId.length) : $.bytes === Array ? Array.prototype.slice.call(O.traceId) : O.traceId;
                            if (O.asInt != null && O.hasOwnProperty("asInt")) {
                                if (typeof O.asInt === "number") H.asInt = $.longs === String ? String(O.asInt) : O.asInt;
                                else H.asInt = $.longs === String ? r6.Long.prototype.toString.call(O.asInt) : $.longs === Number ? new r6.LongBits(O.asInt.low >>> 0, O.asInt.high >>> 0).toNumber() : O.asInt;
                                if ($.oneofs) H.value = "asInt"
                            }
                            if (O.filteredAttributes && O.filteredAttributes.length) {
                                H.filteredAttributes = [];
                                for (var J = 0; J < O.filteredAttributes.length; ++J) H.filteredAttributes[J] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(O.filteredAttributes[J], $)
                            }
                            return H
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(O) {
                            if (O === void 0) O = "type.googleapis.com";
                            return O + "/opentelemetry.proto.metrics.v1.Exemplar"
                        }, z
                    }(), Y
                }(), K
            }(), q.logs = function() {
                var K = {};
                return K.v1 = function() {
                    var Y = {};
                    return Y.LogsData = function() {
                        function z(_) {
                            if (this.resourceLogs = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.resourceLogs = r6.emptyArray, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.resourceLogs != null && w.resourceLogs.length)
                                for (var $ = 0; $ < w.resourceLogs.length; ++$) p6.opentelemetry.proto.logs.v1.ResourceLogs.encode(w.resourceLogs[$], O.uint32(10).fork()).ldelim();
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.logs.v1.LogsData;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        if (!(j.resourceLogs && j.resourceLogs.length)) j.resourceLogs = [];
                                        j.resourceLogs.push(p6.opentelemetry.proto.logs.v1.ResourceLogs.decode(w, w.uint32()));
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.resourceLogs != null && w.hasOwnProperty("resourceLogs")) {
                                if (!Array.isArray(w.resourceLogs)) return "resourceLogs: array expected";
                                for (var O = 0; O < w.resourceLogs.length; ++O) {
                                    var $ = p6.opentelemetry.proto.logs.v1.ResourceLogs.verify(w.resourceLogs[O]);
                                    if ($) return "resourceLogs." + $
                                }
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.logs.v1.LogsData) return w;
                            var O = new p6.opentelemetry.proto.logs.v1.LogsData;
                            if (w.resourceLogs) {
                                if (!Array.isArray(w.resourceLogs)) throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: array expected");
                                O.resourceLogs = [];
                                for (var $ = 0; $ < w.resourceLogs.length; ++$) {
                                    if (typeof w.resourceLogs[$] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: object expected");
                                    O.resourceLogs[$] = p6.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(w.resourceLogs[$])
                                }
                            }
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.resourceLogs = [];
                            if (w.resourceLogs && w.resourceLogs.length) {
                                $.resourceLogs = [];
                                for (var H = 0; H < w.resourceLogs.length; ++H) $.resourceLogs[H] = p6.opentelemetry.proto.logs.v1.ResourceLogs.toObject(w.resourceLogs[H], O)
                            }
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.logs.v1.LogsData"
                        }, z
                    }(), Y.ResourceLogs = function() {
                        function z(_) {
                            if (this.scopeLogs = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.resource = null, z.prototype.scopeLogs = r6.emptyArray, z.prototype.schemaUrl = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.resource != null && Object.hasOwnProperty.call(w, "resource")) p6.opentelemetry.proto.resource.v1.Resource.encode(w.resource, O.uint32(10).fork()).ldelim();
                            if (w.scopeLogs != null && w.scopeLogs.length)
                                for (var $ = 0; $ < w.scopeLogs.length; ++$) p6.opentelemetry.proto.logs.v1.ScopeLogs.encode(w.scopeLogs[$], O.uint32(18).fork()).ldelim();
                            if (w.schemaUrl != null && Object.hasOwnProperty.call(w, "schemaUrl")) O.uint32(26).string(w.schemaUrl);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.logs.v1.ResourceLogs;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        j.resource = p6.opentelemetry.proto.resource.v1.Resource.decode(w, w.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(j.scopeLogs && j.scopeLogs.length)) j.scopeLogs = [];
                                        j.scopeLogs.push(p6.opentelemetry.proto.logs.v1.ScopeLogs.decode(w, w.uint32()));
                                        break
                                    }
                                    case 3: {
                                        j.schemaUrl = w.string();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.resource != null && w.hasOwnProperty("resource")) {
                                var O = p6.opentelemetry.proto.resource.v1.Resource.verify(w.resource);
                                if (O) return "resource." + O
                            }
                            if (w.scopeLogs != null && w.hasOwnProperty("scopeLogs")) {
                                if (!Array.isArray(w.scopeLogs)) return "scopeLogs: array expected";
                                for (var $ = 0; $ < w.scopeLogs.length; ++$) {
                                    var O = p6.opentelemetry.proto.logs.v1.ScopeLogs.verify(w.scopeLogs[$]);
                                    if (O) return "scopeLogs." + O
                                }
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) {
                                if (!r6.isString(w.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.logs.v1.ResourceLogs) return w;
                            var O = new p6.opentelemetry.proto.logs.v1.ResourceLogs;
                            if (w.resource != null) {
                                if (typeof w.resource !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.resource: object expected");
                                O.resource = p6.opentelemetry.proto.resource.v1.Resource.fromObject(w.resource)
                            }
                            if (w.scopeLogs) {
                                if (!Array.isArray(w.scopeLogs)) throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: array expected");
                                O.scopeLogs = [];
                                for (var $ = 0; $ < w.scopeLogs.length; ++$) {
                                    if (typeof w.scopeLogs[$] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: object expected");
                                    O.scopeLogs[$] = p6.opentelemetry.proto.logs.v1.ScopeLogs.fromObject(w.scopeLogs[$])
                                }
                            }
                            if (w.schemaUrl != null) O.schemaUrl = String(w.schemaUrl);
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.scopeLogs = [];
                            if (O.defaults) $.resource = null, $.schemaUrl = "";
                            if (w.resource != null && w.hasOwnProperty("resource")) $.resource = p6.opentelemetry.proto.resource.v1.Resource.toObject(w.resource, O);
                            if (w.scopeLogs && w.scopeLogs.length) {
                                $.scopeLogs = [];
                                for (var H = 0; H < w.scopeLogs.length; ++H) $.scopeLogs[H] = p6.opentelemetry.proto.logs.v1.ScopeLogs.toObject(w.scopeLogs[H], O)
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) $.schemaUrl = w.schemaUrl;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.logs.v1.ResourceLogs"
                        }, z
                    }(), Y.ScopeLogs = function() {
                        function z(_) {
                            if (this.logRecords = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.scope = null, z.prototype.logRecords = r6.emptyArray, z.prototype.schemaUrl = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.scope != null && Object.hasOwnProperty.call(w, "scope")) p6.opentelemetry.proto.common.v1.InstrumentationScope.encode(w.scope, O.uint32(10).fork()).ldelim();
                            if (w.logRecords != null && w.logRecords.length)
                                for (var $ = 0; $ < w.logRecords.length; ++$) p6.opentelemetry.proto.logs.v1.LogRecord.encode(w.logRecords[$], O.uint32(18).fork()).ldelim();
                            if (w.schemaUrl != null && Object.hasOwnProperty.call(w, "schemaUrl")) O.uint32(26).string(w.schemaUrl);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.logs.v1.ScopeLogs;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        j.scope = p6.opentelemetry.proto.common.v1.InstrumentationScope.decode(w, w.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(j.logRecords && j.logRecords.length)) j.logRecords = [];
                                        j.logRecords.push(p6.opentelemetry.proto.logs.v1.LogRecord.decode(w, w.uint32()));
                                        break
                                    }
                                    case 3: {
                                        j.schemaUrl = w.string();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.scope != null && w.hasOwnProperty("scope")) {
                                var O = p6.opentelemetry.proto.common.v1.InstrumentationScope.verify(w.scope);
                                if (O) return "scope." + O
                            }
                            if (w.logRecords != null && w.hasOwnProperty("logRecords")) {
                                if (!Array.isArray(w.logRecords)) return "logRecords: array expected";
                                for (var $ = 0; $ < w.logRecords.length; ++$) {
                                    var O = p6.opentelemetry.proto.logs.v1.LogRecord.verify(w.logRecords[$]);
                                    if (O) return "logRecords." + O
                                }
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) {
                                if (!r6.isString(w.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.logs.v1.ScopeLogs) return w;
                            var O = new p6.opentelemetry.proto.logs.v1.ScopeLogs;
                            if (w.scope != null) {
                                if (typeof w.scope !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.scope: object expected");
                                O.scope = p6.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(w.scope)
                            }
                            if (w.logRecords) {
                                if (!Array.isArray(w.logRecords)) throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: array expected");
                                O.logRecords = [];
                                for (var $ = 0; $ < w.logRecords.length; ++$) {
                                    if (typeof w.logRecords[$] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: object expected");
                                    O.logRecords[$] = p6.opentelemetry.proto.logs.v1.LogRecord.fromObject(w.logRecords[$])
                                }
                            }
                            if (w.schemaUrl != null) O.schemaUrl = String(w.schemaUrl);
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.logRecords = [];
                            if (O.defaults) $.scope = null, $.schemaUrl = "";
                            if (w.scope != null && w.hasOwnProperty("scope")) $.scope = p6.opentelemetry.proto.common.v1.InstrumentationScope.toObject(w.scope, O);
                            if (w.logRecords && w.logRecords.length) {
                                $.logRecords = [];
                                for (var H = 0; H < w.logRecords.length; ++H) $.logRecords[H] = p6.opentelemetry.proto.logs.v1.LogRecord.toObject(w.logRecords[H], O)
                            }
                            if (w.schemaUrl != null && w.hasOwnProperty("schemaUrl")) $.schemaUrl = w.schemaUrl;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.logs.v1.ScopeLogs"
                        }, z
                    }(), Y.SeverityNumber = function() {
                        var z = {},
                            _ = Object.create(z);
                        return _[z[0] = "SEVERITY_NUMBER_UNSPECIFIED"] = 0, _[z[1] = "SEVERITY_NUMBER_TRACE"] = 1, _[z[2] = "SEVERITY_NUMBER_TRACE2"] = 2, _[z[3] = "SEVERITY_NUMBER_TRACE3"] = 3, _[z[4] = "SEVERITY_NUMBER_TRACE4"] = 4, _[z[5] = "SEVERITY_NUMBER_DEBUG"] = 5, _[z[6] = "SEVERITY_NUMBER_DEBUG2"] = 6, _[z[7] = "SEVERITY_NUMBER_DEBUG3"] = 7, _[z[8] = "SEVERITY_NUMBER_DEBUG4"] = 8, _[z[9] = "SEVERITY_NUMBER_INFO"] = 9, _[z[10] = "SEVERITY_NUMBER_INFO2"] = 10, _[z[11] = "SEVERITY_NUMBER_INFO3"] = 11, _[z[12] = "SEVERITY_NUMBER_INFO4"] = 12, _[z[13] = "SEVERITY_NUMBER_WARN"] = 13, _[z[14] = "SEVERITY_NUMBER_WARN2"] = 14, _[z[15] = "SEVERITY_NUMBER_WARN3"] = 15, _[z[16] = "SEVERITY_NUMBER_WARN4"] = 16, _[z[17] = "SEVERITY_NUMBER_ERROR"] = 17, _[z[18] = "SEVERITY_NUMBER_ERROR2"] = 18, _[z[19] = "SEVERITY_NUMBER_ERROR3"] = 19, _[z[20] = "SEVERITY_NUMBER_ERROR4"] = 20, _[z[21] = "SEVERITY_NUMBER_FATAL"] = 21, _[z[22] = "SEVERITY_NUMBER_FATAL2"] = 22, _[z[23] = "SEVERITY_NUMBER_FATAL3"] = 23, _[z[24] = "SEVERITY_NUMBER_FATAL4"] = 24, _
                    }(), Y.LogRecordFlags = function() {
                        var z = {},
                            _ = Object.create(z);
                        return _[z[0] = "LOG_RECORD_FLAGS_DO_NOT_USE"] = 0, _[z[255] = "LOG_RECORD_FLAGS_TRACE_FLAGS_MASK"] = 255, _
                    }(), Y.LogRecord = function() {
                        function z(_) {
                            if (this.attributes = [], _) {
                                for (var w = Object.keys(_), O = 0; O < w.length; ++O)
                                    if (_[w[O]] != null) this[w[O]] = _[w[O]]
                            }
                        }
                        return z.prototype.timeUnixNano = null, z.prototype.observedTimeUnixNano = null, z.prototype.severityNumber = null, z.prototype.severityText = null, z.prototype.body = null, z.prototype.attributes = r6.emptyArray, z.prototype.droppedAttributesCount = null, z.prototype.flags = null, z.prototype.traceId = null, z.prototype.spanId = null, z.prototype.eventName = null, z.create = function(w) {
                            return new z(w)
                        }, z.encode = function(w, O) {
                            if (!O) O = n5.create();
                            if (w.timeUnixNano != null && Object.hasOwnProperty.call(w, "timeUnixNano")) O.uint32(9).fixed64(w.timeUnixNano);
                            if (w.severityNumber != null && Object.hasOwnProperty.call(w, "severityNumber")) O.uint32(16).int32(w.severityNumber);
                            if (w.severityText != null && Object.hasOwnProperty.call(w, "severityText")) O.uint32(26).string(w.severityText);
                            if (w.body != null && Object.hasOwnProperty.call(w, "body")) p6.opentelemetry.proto.common.v1.AnyValue.encode(w.body, O.uint32(42).fork()).ldelim();
                            if (w.attributes != null && w.attributes.length)
                                for (var $ = 0; $ < w.attributes.length; ++$) p6.opentelemetry.proto.common.v1.KeyValue.encode(w.attributes[$], O.uint32(50).fork()).ldelim();
                            if (w.droppedAttributesCount != null && Object.hasOwnProperty.call(w, "droppedAttributesCount")) O.uint32(56).uint32(w.droppedAttributesCount);
                            if (w.flags != null && Object.hasOwnProperty.call(w, "flags")) O.uint32(69).fixed32(w.flags);
                            if (w.traceId != null && Object.hasOwnProperty.call(w, "traceId")) O.uint32(74).bytes(w.traceId);
                            if (w.spanId != null && Object.hasOwnProperty.call(w, "spanId")) O.uint32(82).bytes(w.spanId);
                            if (w.observedTimeUnixNano != null && Object.hasOwnProperty.call(w, "observedTimeUnixNano")) O.uint32(89).fixed64(w.observedTimeUnixNano);
                            if (w.eventName != null && Object.hasOwnProperty.call(w, "eventName")) O.uint32(98).string(w.eventName);
                            return O
                        }, z.encodeDelimited = function(w, O) {
                            return this.encode(w, O).ldelim()
                        }, z.decode = function(w, O, $) {
                            if (!(w instanceof $8)) w = $8.create(w);
                            var H = O === void 0 ? w.len : w.pos + O,
                                j = new p6.opentelemetry.proto.logs.v1.LogRecord;
                            while (w.pos < H) {
                                var J = w.uint32();
                                if (J === $) break;
                                switch (J >>> 3) {
                                    case 1: {
                                        j.timeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 11: {
                                        j.observedTimeUnixNano = w.fixed64();
                                        break
                                    }
                                    case 2: {
                                        j.severityNumber = w.int32();
                                        break
                                    }
                                    case 3: {
                                        j.severityText = w.string();
                                        break
                                    }
                                    case 5: {
                                        j.body = p6.opentelemetry.proto.common.v1.AnyValue.decode(w, w.uint32());
                                        break
                                    }
                                    case 6: {
                                        if (!(j.attributes && j.attributes.length)) j.attributes = [];
                                        j.attributes.push(p6.opentelemetry.proto.common.v1.KeyValue.decode(w, w.uint32()));
                                        break
                                    }
                                    case 7: {
                                        j.droppedAttributesCount = w.uint32();
                                        break
                                    }
                                    case 8: {
                                        j.flags = w.fixed32();
                                        break
                                    }
                                    case 9: {
                                        j.traceId = w.bytes();
                                        break
                                    }
                                    case 10: {
                                        j.spanId = w.bytes();
                                        break
                                    }
                                    case 12: {
                                        j.eventName = w.string();
                                        break
                                    }
                                    default:
                                        w.skipType(J & 7);
                                        break
                                }
                            }
                            return j
                        }, z.decodeDelimited = function(w) {
                            if (!(w instanceof $8)) w = new $8(w);
                            return this.decode(w, w.uint32())
                        }, z.verify = function(w) {
                            if (typeof w !== "object" || w === null) return "object expected";
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano")) {
                                if (!r6.isInteger(w.timeUnixNano) && !(w.timeUnixNano && r6.isInteger(w.timeUnixNano.low) && r6.isInteger(w.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (w.observedTimeUnixNano != null && w.hasOwnProperty("observedTimeUnixNano")) {
                                if (!r6.isInteger(w.observedTimeUnixNano) && !(w.observedTimeUnixNano && r6.isInteger(w.observedTimeUnixNano.low) && r6.isInteger(w.observedTimeUnixNano.high))) return "observedTimeUnixNano: integer|Long expected"
                            }
                            if (w.severityNumber != null && w.hasOwnProperty("severityNumber")) switch (w.severityNumber) {
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
                            if (w.severityText != null && w.hasOwnProperty("severityText")) {
                                if (!r6.isString(w.severityText)) return "severityText: string expected"
                            }
                            if (w.body != null && w.hasOwnProperty("body")) {
                                var O = p6.opentelemetry.proto.common.v1.AnyValue.verify(w.body);
                                if (O) return "body." + O
                            }
                            if (w.attributes != null && w.hasOwnProperty("attributes")) {
                                if (!Array.isArray(w.attributes)) return "attributes: array expected";
                                for (var $ = 0; $ < w.attributes.length; ++$) {
                                    var O = p6.opentelemetry.proto.common.v1.KeyValue.verify(w.attributes[$]);
                                    if (O) return "attributes." + O
                                }
                            }
                            if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) {
                                if (!r6.isInteger(w.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            if (w.flags != null && w.hasOwnProperty("flags")) {
                                if (!r6.isInteger(w.flags)) return "flags: integer expected"
                            }
                            if (w.traceId != null && w.hasOwnProperty("traceId")) {
                                if (!(w.traceId && typeof w.traceId.length === "number" || r6.isString(w.traceId))) return "traceId: buffer expected"
                            }
                            if (w.spanId != null && w.hasOwnProperty("spanId")) {
                                if (!(w.spanId && typeof w.spanId.length === "number" || r6.isString(w.spanId))) return "spanId: buffer expected"
                            }
                            if (w.eventName != null && w.hasOwnProperty("eventName")) {
                                if (!r6.isString(w.eventName)) return "eventName: string expected"
                            }
                            return null
                        }, z.fromObject = function(w) {
                            if (w instanceof p6.opentelemetry.proto.logs.v1.LogRecord) return w;
                            var O = new p6.opentelemetry.proto.logs.v1.LogRecord;
                            if (w.timeUnixNano != null) {
                                if (r6.Long)(O.timeUnixNano = r6.Long.fromValue(w.timeUnixNano)).unsigned = !1;
                                else if (typeof w.timeUnixNano === "string") O.timeUnixNano = parseInt(w.timeUnixNano, 10);
                                else if (typeof w.timeUnixNano === "number") O.timeUnixNano = w.timeUnixNano;
                                else if (typeof w.timeUnixNano === "object") O.timeUnixNano = new r6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (w.observedTimeUnixNano != null) {
                                if (r6.Long)(O.observedTimeUnixNano = r6.Long.fromValue(w.observedTimeUnixNano)).unsigned = !1;
                                else if (typeof w.observedTimeUnixNano === "string") O.observedTimeUnixNano = parseInt(w.observedTimeUnixNano, 10);
                                else if (typeof w.observedTimeUnixNano === "number") O.observedTimeUnixNano = w.observedTimeUnixNano;
                                else if (typeof w.observedTimeUnixNano === "object") O.observedTimeUnixNano = new r6.LongBits(w.observedTimeUnixNano.low >>> 0, w.observedTimeUnixNano.high >>> 0).toNumber()
                            }
                            switch (w.severityNumber) {
                                default:
                                    if (typeof w.severityNumber === "number") {
                                        O.severityNumber = w.severityNumber;
                                        break
                                    }
                                    break;
                                case "SEVERITY_NUMBER_UNSPECIFIED":
                                case 0:
                                    O.severityNumber = 0;
                                    break;
                                case "SEVERITY_NUMBER_TRACE":
                                case 1:
                                    O.severityNumber = 1;
                                    break;
                                case "SEVERITY_NUMBER_TRACE2":
                                case 2:
                                    O.severityNumber = 2;
                                    break;
                                case "SEVERITY_NUMBER_TRACE3":
                                case 3:
                                    O.severityNumber = 3;
                                    break;
                                case "SEVERITY_NUMBER_TRACE4":
                                case 4:
                                    O.severityNumber = 4;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG":
                                case 5:
                                    O.severityNumber = 5;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG2":
                                case 6:
                                    O.severityNumber = 6;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG3":
                                case 7:
                                    O.severityNumber = 7;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG4":
                                case 8:
                                    O.severityNumber = 8;
                                    break;
                                case "SEVERITY_NUMBER_INFO":
                                case 9:
                                    O.severityNumber = 9;
                                    break;
                                case "SEVERITY_NUMBER_INFO2":
                                case 10:
                                    O.severityNumber = 10;
                                    break;
                                case "SEVERITY_NUMBER_INFO3":
                                case 11:
                                    O.severityNumber = 11;
                                    break;
                                case "SEVERITY_NUMBER_INFO4":
                                case 12:
                                    O.severityNumber = 12;
                                    break;
                                case "SEVERITY_NUMBER_WARN":
                                case 13:
                                    O.severityNumber = 13;
                                    break;
                                case "SEVERITY_NUMBER_WARN2":
                                case 14:
                                    O.severityNumber = 14;
                                    break;
                                case "SEVERITY_NUMBER_WARN3":
                                case 15:
                                    O.severityNumber = 15;
                                    break;
                                case "SEVERITY_NUMBER_WARN4":
                                case 16:
                                    O.severityNumber = 16;
                                    break;
                                case "SEVERITY_NUMBER_ERROR":
                                case 17:
                                    O.severityNumber = 17;
                                    break;
                                case "SEVERITY_NUMBER_ERROR2":
                                case 18:
                                    O.severityNumber = 18;
                                    break;
                                case "SEVERITY_NUMBER_ERROR3":
                                case 19:
                                    O.severityNumber = 19;
                                    break;
                                case "SEVERITY_NUMBER_ERROR4":
                                case 20:
                                    O.severityNumber = 20;
                                    break;
                                case "SEVERITY_NUMBER_FATAL":
                                case 21:
                                    O.severityNumber = 21;
                                    break;
                                case "SEVERITY_NUMBER_FATAL2":
                                case 22:
                                    O.severityNumber = 22;
                                    break;
                                case "SEVERITY_NUMBER_FATAL3":
                                case 23:
                                    O.severityNumber = 23;
                                    break;
                                case "SEVERITY_NUMBER_FATAL4":
                                case 24:
                                    O.severityNumber = 24;
                                    break
                            }
                            if (w.severityText != null) O.severityText = String(w.severityText);
                            if (w.body != null) {
                                if (typeof w.body !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.body: object expected");
                                O.body = p6.opentelemetry.proto.common.v1.AnyValue.fromObject(w.body)
                            }
                            if (w.attributes) {
                                if (!Array.isArray(w.attributes)) throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: array expected");
                                O.attributes = [];
                                for (var $ = 0; $ < w.attributes.length; ++$) {
                                    if (typeof w.attributes[$] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: object expected");
                                    O.attributes[$] = p6.opentelemetry.proto.common.v1.KeyValue.fromObject(w.attributes[$])
                                }
                            }
                            if (w.droppedAttributesCount != null) O.droppedAttributesCount = w.droppedAttributesCount >>> 0;
                            if (w.flags != null) O.flags = w.flags >>> 0;
                            if (w.traceId != null) {
                                if (typeof w.traceId === "string") r6.base64.decode(w.traceId, O.traceId = r6.newBuffer(r6.base64.length(w.traceId)), 0);
                                else if (w.traceId.length >= 0) O.traceId = w.traceId
                            }
                            if (w.spanId != null) {
                                if (typeof w.spanId === "string") r6.base64.decode(w.spanId, O.spanId = r6.newBuffer(r6.base64.length(w.spanId)), 0);
                                else if (w.spanId.length >= 0) O.spanId = w.spanId
                            }
                            if (w.eventName != null) O.eventName = String(w.eventName);
                            return O
                        }, z.toObject = function(w, O) {
                            if (!O) O = {};
                            var $ = {};
                            if (O.arrays || O.defaults) $.attributes = [];
                            if (O.defaults) {
                                if (r6.Long) {
                                    var H = new r6.Long(0, 0, !1);
                                    $.timeUnixNano = O.longs === String ? H.toString() : O.longs === Number ? H.toNumber() : H
                                } else $.timeUnixNano = O.longs === String ? "0" : 0;
                                if ($.severityNumber = O.enums === String ? "SEVERITY_NUMBER_UNSPECIFIED" : 0, $.severityText = "", $.body = null, $.droppedAttributesCount = 0, $.flags = 0, O.bytes === String) $.traceId = "";
                                else if ($.traceId = [], O.bytes !== Array) $.traceId = r6.newBuffer($.traceId);
                                if (O.bytes === String) $.spanId = "";
                                else if ($.spanId = [], O.bytes !== Array) $.spanId = r6.newBuffer($.spanId);
                                if (r6.Long) {
                                    var H = new r6.Long(0, 0, !1);
                                    $.observedTimeUnixNano = O.longs === String ? H.toString() : O.longs === Number ? H.toNumber() : H
                                } else $.observedTimeUnixNano = O.longs === String ? "0" : 0;
                                $.eventName = ""
                            }
                            if (w.timeUnixNano != null && w.hasOwnProperty("timeUnixNano"))
                                if (typeof w.timeUnixNano === "number") $.timeUnixNano = O.longs === String ? String(w.timeUnixNano) : w.timeUnixNano;
                                else $.timeUnixNano = O.longs === String ? r6.Long.prototype.toString.call(w.timeUnixNano) : O.longs === Number ? new r6.LongBits(w.timeUnixNano.low >>> 0, w.timeUnixNano.high >>> 0).toNumber() : w.timeUnixNano;
                            if (w.severityNumber != null && w.hasOwnProperty("severityNumber")) $.severityNumber = O.enums === String ? p6.opentelemetry.proto.logs.v1.SeverityNumber[w.severityNumber] === void 0 ? w.severityNumber : p6.opentelemetry.proto.logs.v1.SeverityNumber[w.severityNumber] : w.severityNumber;
                            if (w.severityText != null && w.hasOwnProperty("severityText")) $.severityText = w.severityText;
                            if (w.body != null && w.hasOwnProperty("body")) $.body = p6.opentelemetry.proto.common.v1.AnyValue.toObject(w.body, O);
                            if (w.attributes && w.attributes.length) {
                                $.attributes = [];
                                for (var j = 0; j < w.attributes.length; ++j) $.attributes[j] = p6.opentelemetry.proto.common.v1.KeyValue.toObject(w.attributes[j], O)
                            }
                            if (w.droppedAttributesCount != null && w.hasOwnProperty("droppedAttributesCount")) $.droppedAttributesCount = w.droppedAttributesCount;
                            if (w.flags != null && w.hasOwnProperty("flags")) $.flags = w.flags;
                            if (w.traceId != null && w.hasOwnProperty("traceId")) $.traceId = O.bytes === String ? r6.base64.encode(w.traceId, 0, w.traceId.length) : O.bytes === Array ? Array.prototype.slice.call(w.traceId) : w.traceId;
                            if (w.spanId != null && w.hasOwnProperty("spanId")) $.spanId = O.bytes === String ? r6.base64.encode(w.spanId, 0, w.spanId.length) : O.bytes === Array ? Array.prototype.slice.call(w.spanId) : w.spanId;
                            if (w.observedTimeUnixNano != null && w.hasOwnProperty("observedTimeUnixNano"))
                                if (typeof w.observedTimeUnixNano === "number") $.observedTimeUnixNano = O.longs === String ? String(w.observedTimeUnixNano) : w.observedTimeUnixNano;
                                else $.observedTimeUnixNano = O.longs === String ? r6.Long.prototype.toString.call(w.observedTimeUnixNano) : O.longs === Number ? new r6.LongBits(w.observedTimeUnixNano.low >>> 0, w.observedTimeUnixNano.high >>> 0).toNumber() : w.observedTimeUnixNano;
                            if (w.eventName != null && w.hasOwnProperty("eventName")) $.eventName = w.eventName;
                            return $
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, oq.util.toJSONOptions)
                        }, z.getTypeUrl = function(w) {
                            if (w === void 0) w = "type.googleapis.com";
                            return w + "/opentelemetry.proto.logs.v1.LogRecord"
                        }, z
                    }(), Y
                }(), K
            }(), q
        }(), A
    }();
    kR4.exports = p6
})