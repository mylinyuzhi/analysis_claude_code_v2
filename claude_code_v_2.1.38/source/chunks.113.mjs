
// @from(Ln 278320, Col 4)
ZD6 = R((Tj4, vj4) => {
    Object.defineProperty(Tj4, "__esModule", {
        value: !0
    });
    var JK = PZA(),
        $A = JK.Reader,
        H5 = JK.Writer,
        g1 = JK.util,
        u1 = JK.roots.default || (JK.roots.default = {});
    u1.opentelemetry = function() {
        var A = {};
        return A.proto = function() {
            var q = {};
            return q.common = function() {
                var K = {};
                return K.v1 = function() {
                    var Y = {};
                    return Y.AnyValue = function() {
                        function z(H) {
                            if (H) {
                                for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                    if (H[$[O]] != null) this[$[O]] = H[$[O]]
                            }
                        }
                        z.prototype.stringValue = null, z.prototype.boolValue = null, z.prototype.intValue = null, z.prototype.doubleValue = null, z.prototype.arrayValue = null, z.prototype.kvlistValue = null, z.prototype.bytesValue = null;
                        var w;
                        return Object.defineProperty(z.prototype, "value", {
                            get: g1.oneOfGetter(w = ["stringValue", "boolValue", "intValue", "doubleValue", "arrayValue", "kvlistValue", "bytesValue"]),
                            set: g1.oneOfSetter(w)
                        }), z.create = function($) {
                            return new z($)
                        }, z.encode = function($, O) {
                            if (!O) O = H5.create();
                            if ($.stringValue != null && Object.hasOwnProperty.call($, "stringValue")) O.uint32(10).string($.stringValue);
                            if ($.boolValue != null && Object.hasOwnProperty.call($, "boolValue")) O.uint32(16).bool($.boolValue);
                            if ($.intValue != null && Object.hasOwnProperty.call($, "intValue")) O.uint32(24).int64($.intValue);
                            if ($.doubleValue != null && Object.hasOwnProperty.call($, "doubleValue")) O.uint32(33).double($.doubleValue);
                            if ($.arrayValue != null && Object.hasOwnProperty.call($, "arrayValue")) u1.opentelemetry.proto.common.v1.ArrayValue.encode($.arrayValue, O.uint32(42).fork()).ldelim();
                            if ($.kvlistValue != null && Object.hasOwnProperty.call($, "kvlistValue")) u1.opentelemetry.proto.common.v1.KeyValueList.encode($.kvlistValue, O.uint32(50).fork()).ldelim();
                            if ($.bytesValue != null && Object.hasOwnProperty.call($, "bytesValue")) O.uint32(58).bytes($.bytesValue);
                            return O
                        }, z.encodeDelimited = function($, O) {
                            return this.encode($, O).ldelim()
                        }, z.decode = function($, O, _) {
                            if (!($ instanceof $A)) $ = $A.create($);
                            var J = O === void 0 ? $.len : $.pos + O,
                                X = new u1.opentelemetry.proto.common.v1.AnyValue;
                            while ($.pos < J) {
                                var D = $.uint32();
                                if (D === _) break;
                                switch (D >>> 3) {
                                    case 1: {
                                        X.stringValue = $.string();
                                        break
                                    }
                                    case 2: {
                                        X.boolValue = $.bool();
                                        break
                                    }
                                    case 3: {
                                        X.intValue = $.int64();
                                        break
                                    }
                                    case 4: {
                                        X.doubleValue = $.double();
                                        break
                                    }
                                    case 5: {
                                        X.arrayValue = u1.opentelemetry.proto.common.v1.ArrayValue.decode($, $.uint32());
                                        break
                                    }
                                    case 6: {
                                        X.kvlistValue = u1.opentelemetry.proto.common.v1.KeyValueList.decode($, $.uint32());
                                        break
                                    }
                                    case 7: {
                                        X.bytesValue = $.bytes();
                                        break
                                    }
                                    default:
                                        $.skipType(D & 7);
                                        break
                                }
                            }
                            return X
                        }, z.decodeDelimited = function($) {
                            if (!($ instanceof $A)) $ = new $A($);
                            return this.decode($, $.uint32())
                        }, z.verify = function($) {
                            if (typeof $ !== "object" || $ === null) return "object expected";
                            var O = {};
                            if ($.stringValue != null && $.hasOwnProperty("stringValue")) {
                                if (O.value = 1, !g1.isString($.stringValue)) return "stringValue: string expected"
                            }
                            if ($.boolValue != null && $.hasOwnProperty("boolValue")) {
                                if (O.value === 1) return "value: multiple values";
                                if (O.value = 1, typeof $.boolValue !== "boolean") return "boolValue: boolean expected"
                            }
                            if ($.intValue != null && $.hasOwnProperty("intValue")) {
                                if (O.value === 1) return "value: multiple values";
                                if (O.value = 1, !g1.isInteger($.intValue) && !($.intValue && g1.isInteger($.intValue.low) && g1.isInteger($.intValue.high))) return "intValue: integer|Long expected"
                            }
                            if ($.doubleValue != null && $.hasOwnProperty("doubleValue")) {
                                if (O.value === 1) return "value: multiple values";
                                if (O.value = 1, typeof $.doubleValue !== "number") return "doubleValue: number expected"
                            }
                            if ($.arrayValue != null && $.hasOwnProperty("arrayValue")) {
                                if (O.value === 1) return "value: multiple values";
                                O.value = 1;
                                {
                                    var _ = u1.opentelemetry.proto.common.v1.ArrayValue.verify($.arrayValue);
                                    if (_) return "arrayValue." + _
                                }
                            }
                            if ($.kvlistValue != null && $.hasOwnProperty("kvlistValue")) {
                                if (O.value === 1) return "value: multiple values";
                                O.value = 1;
                                {
                                    var _ = u1.opentelemetry.proto.common.v1.KeyValueList.verify($.kvlistValue);
                                    if (_) return "kvlistValue." + _
                                }
                            }
                            if ($.bytesValue != null && $.hasOwnProperty("bytesValue")) {
                                if (O.value === 1) return "value: multiple values";
                                if (O.value = 1, !($.bytesValue && typeof $.bytesValue.length === "number" || g1.isString($.bytesValue))) return "bytesValue: buffer expected"
                            }
                            return null
                        }, z.fromObject = function($) {
                            if ($ instanceof u1.opentelemetry.proto.common.v1.AnyValue) return $;
                            var O = new u1.opentelemetry.proto.common.v1.AnyValue;
                            if ($.stringValue != null) O.stringValue = String($.stringValue);
                            if ($.boolValue != null) O.boolValue = Boolean($.boolValue);
                            if ($.intValue != null) {
                                if (g1.Long)(O.intValue = g1.Long.fromValue($.intValue)).unsigned = !1;
                                else if (typeof $.intValue === "string") O.intValue = parseInt($.intValue, 10);
                                else if (typeof $.intValue === "number") O.intValue = $.intValue;
                                else if (typeof $.intValue === "object") O.intValue = new g1.LongBits($.intValue.low >>> 0, $.intValue.high >>> 0).toNumber()
                            }
                            if ($.doubleValue != null) O.doubleValue = Number($.doubleValue);
                            if ($.arrayValue != null) {
                                if (typeof $.arrayValue !== "object") throw TypeError(".opentelemetry.proto.common.v1.AnyValue.arrayValue: object expected");
                                O.arrayValue = u1.opentelemetry.proto.common.v1.ArrayValue.fromObject($.arrayValue)
                            }
                            if ($.kvlistValue != null) {
                                if (typeof $.kvlistValue !== "object") throw TypeError(".opentelemetry.proto.common.v1.AnyValue.kvlistValue: object expected");
                                O.kvlistValue = u1.opentelemetry.proto.common.v1.KeyValueList.fromObject($.kvlistValue)
                            }
                            if ($.bytesValue != null) {
                                if (typeof $.bytesValue === "string") g1.base64.decode($.bytesValue, O.bytesValue = g1.newBuffer(g1.base64.length($.bytesValue)), 0);
                                else if ($.bytesValue.length >= 0) O.bytesValue = $.bytesValue
                            }
                            return O
                        }, z.toObject = function($, O) {
                            if (!O) O = {};
                            var _ = {};
                            if ($.stringValue != null && $.hasOwnProperty("stringValue")) {
                                if (_.stringValue = $.stringValue, O.oneofs) _.value = "stringValue"
                            }
                            if ($.boolValue != null && $.hasOwnProperty("boolValue")) {
                                if (_.boolValue = $.boolValue, O.oneofs) _.value = "boolValue"
                            }
                            if ($.intValue != null && $.hasOwnProperty("intValue")) {
                                if (typeof $.intValue === "number") _.intValue = O.longs === String ? String($.intValue) : $.intValue;
                                else _.intValue = O.longs === String ? g1.Long.prototype.toString.call($.intValue) : O.longs === Number ? new g1.LongBits($.intValue.low >>> 0, $.intValue.high >>> 0).toNumber() : $.intValue;
                                if (O.oneofs) _.value = "intValue"
                            }
                            if ($.doubleValue != null && $.hasOwnProperty("doubleValue")) {
                                if (_.doubleValue = O.json && !isFinite($.doubleValue) ? String($.doubleValue) : $.doubleValue, O.oneofs) _.value = "doubleValue"
                            }
                            if ($.arrayValue != null && $.hasOwnProperty("arrayValue")) {
                                if (_.arrayValue = u1.opentelemetry.proto.common.v1.ArrayValue.toObject($.arrayValue, O), O.oneofs) _.value = "arrayValue"
                            }
                            if ($.kvlistValue != null && $.hasOwnProperty("kvlistValue")) {
                                if (_.kvlistValue = u1.opentelemetry.proto.common.v1.KeyValueList.toObject($.kvlistValue, O), O.oneofs) _.value = "kvlistValue"
                            }
                            if ($.bytesValue != null && $.hasOwnProperty("bytesValue")) {
                                if (_.bytesValue = O.bytes === String ? g1.base64.encode($.bytesValue, 0, $.bytesValue.length) : O.bytes === Array ? Array.prototype.slice.call($.bytesValue) : $.bytesValue, O.oneofs) _.value = "bytesValue"
                            }
                            return _
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function($) {
                            if ($ === void 0) $ = "type.googleapis.com";
                            return $ + "/opentelemetry.proto.common.v1.AnyValue"
                        }, z
                    }(), Y.ArrayValue = function() {
                        function z(w) {
                            if (this.values = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.values = g1.emptyArray, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.values != null && H.values.length)
                                for (var O = 0; O < H.values.length; ++O) u1.opentelemetry.proto.common.v1.AnyValue.encode(H.values[O], $.uint32(10).fork()).ldelim();
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.common.v1.ArrayValue;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.values && J.values.length)) J.values = [];
                                        J.values.push(u1.opentelemetry.proto.common.v1.AnyValue.decode(H, H.uint32()));
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.values != null && H.hasOwnProperty("values")) {
                                if (!Array.isArray(H.values)) return "values: array expected";
                                for (var $ = 0; $ < H.values.length; ++$) {
                                    var O = u1.opentelemetry.proto.common.v1.AnyValue.verify(H.values[$]);
                                    if (O) return "values." + O
                                }
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.common.v1.ArrayValue) return H;
                            var $ = new u1.opentelemetry.proto.common.v1.ArrayValue;
                            if (H.values) {
                                if (!Array.isArray(H.values)) throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: array expected");
                                $.values = [];
                                for (var O = 0; O < H.values.length; ++O) {
                                    if (typeof H.values[O] !== "object") throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: object expected");
                                    $.values[O] = u1.opentelemetry.proto.common.v1.AnyValue.fromObject(H.values[O])
                                }
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.values = [];
                            if (H.values && H.values.length) {
                                O.values = [];
                                for (var _ = 0; _ < H.values.length; ++_) O.values[_] = u1.opentelemetry.proto.common.v1.AnyValue.toObject(H.values[_], $)
                            }
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.common.v1.ArrayValue"
                        }, z
                    }(), Y.KeyValueList = function() {
                        function z(w) {
                            if (this.values = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.values = g1.emptyArray, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.values != null && H.values.length)
                                for (var O = 0; O < H.values.length; ++O) u1.opentelemetry.proto.common.v1.KeyValue.encode(H.values[O], $.uint32(10).fork()).ldelim();
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.common.v1.KeyValueList;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.values && J.values.length)) J.values = [];
                                        J.values.push(u1.opentelemetry.proto.common.v1.KeyValue.decode(H, H.uint32()));
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.values != null && H.hasOwnProperty("values")) {
                                if (!Array.isArray(H.values)) return "values: array expected";
                                for (var $ = 0; $ < H.values.length; ++$) {
                                    var O = u1.opentelemetry.proto.common.v1.KeyValue.verify(H.values[$]);
                                    if (O) return "values." + O
                                }
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.common.v1.KeyValueList) return H;
                            var $ = new u1.opentelemetry.proto.common.v1.KeyValueList;
                            if (H.values) {
                                if (!Array.isArray(H.values)) throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: array expected");
                                $.values = [];
                                for (var O = 0; O < H.values.length; ++O) {
                                    if (typeof H.values[O] !== "object") throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: object expected");
                                    $.values[O] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject(H.values[O])
                                }
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.values = [];
                            if (H.values && H.values.length) {
                                O.values = [];
                                for (var _ = 0; _ < H.values.length; ++_) O.values[_] = u1.opentelemetry.proto.common.v1.KeyValue.toObject(H.values[_], $)
                            }
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.common.v1.KeyValueList"
                        }, z
                    }(), Y.KeyValue = function() {
                        function z(w) {
                            if (w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.key = null, z.prototype.value = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.key != null && Object.hasOwnProperty.call(H, "key")) $.uint32(10).string(H.key);
                            if (H.value != null && Object.hasOwnProperty.call(H, "value")) u1.opentelemetry.proto.common.v1.AnyValue.encode(H.value, $.uint32(18).fork()).ldelim();
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.common.v1.KeyValue;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.key = H.string();
                                        break
                                    }
                                    case 2: {
                                        J.value = u1.opentelemetry.proto.common.v1.AnyValue.decode(H, H.uint32());
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.key != null && H.hasOwnProperty("key")) {
                                if (!g1.isString(H.key)) return "key: string expected"
                            }
                            if (H.value != null && H.hasOwnProperty("value")) {
                                var $ = u1.opentelemetry.proto.common.v1.AnyValue.verify(H.value);
                                if ($) return "value." + $
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.common.v1.KeyValue) return H;
                            var $ = new u1.opentelemetry.proto.common.v1.KeyValue;
                            if (H.key != null) $.key = String(H.key);
                            if (H.value != null) {
                                if (typeof H.value !== "object") throw TypeError(".opentelemetry.proto.common.v1.KeyValue.value: object expected");
                                $.value = u1.opentelemetry.proto.common.v1.AnyValue.fromObject(H.value)
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.defaults) O.key = "", O.value = null;
                            if (H.key != null && H.hasOwnProperty("key")) O.key = H.key;
                            if (H.value != null && H.hasOwnProperty("value")) O.value = u1.opentelemetry.proto.common.v1.AnyValue.toObject(H.value, $);
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.common.v1.KeyValue"
                        }, z
                    }(), Y.InstrumentationScope = function() {
                        function z(w) {
                            if (this.attributes = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.name = null, z.prototype.version = null, z.prototype.attributes = g1.emptyArray, z.prototype.droppedAttributesCount = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.name != null && Object.hasOwnProperty.call(H, "name")) $.uint32(10).string(H.name);
                            if (H.version != null && Object.hasOwnProperty.call(H, "version")) $.uint32(18).string(H.version);
                            if (H.attributes != null && H.attributes.length)
                                for (var O = 0; O < H.attributes.length; ++O) u1.opentelemetry.proto.common.v1.KeyValue.encode(H.attributes[O], $.uint32(26).fork()).ldelim();
                            if (H.droppedAttributesCount != null && Object.hasOwnProperty.call(H, "droppedAttributesCount")) $.uint32(32).uint32(H.droppedAttributesCount);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.common.v1.InstrumentationScope;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.name = H.string();
                                        break
                                    }
                                    case 2: {
                                        J.version = H.string();
                                        break
                                    }
                                    case 3: {
                                        if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                        J.attributes.push(u1.opentelemetry.proto.common.v1.KeyValue.decode(H, H.uint32()));
                                        break
                                    }
                                    case 4: {
                                        J.droppedAttributesCount = H.uint32();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.name != null && H.hasOwnProperty("name")) {
                                if (!g1.isString(H.name)) return "name: string expected"
                            }
                            if (H.version != null && H.hasOwnProperty("version")) {
                                if (!g1.isString(H.version)) return "version: string expected"
                            }
                            if (H.attributes != null && H.hasOwnProperty("attributes")) {
                                if (!Array.isArray(H.attributes)) return "attributes: array expected";
                                for (var $ = 0; $ < H.attributes.length; ++$) {
                                    var O = u1.opentelemetry.proto.common.v1.KeyValue.verify(H.attributes[$]);
                                    if (O) return "attributes." + O
                                }
                            }
                            if (H.droppedAttributesCount != null && H.hasOwnProperty("droppedAttributesCount")) {
                                if (!g1.isInteger(H.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.common.v1.InstrumentationScope) return H;
                            var $ = new u1.opentelemetry.proto.common.v1.InstrumentationScope;
                            if (H.name != null) $.name = String(H.name);
                            if (H.version != null) $.version = String(H.version);
                            if (H.attributes) {
                                if (!Array.isArray(H.attributes)) throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: array expected");
                                $.attributes = [];
                                for (var O = 0; O < H.attributes.length; ++O) {
                                    if (typeof H.attributes[O] !== "object") throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: object expected");
                                    $.attributes[O] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject(H.attributes[O])
                                }
                            }
                            if (H.droppedAttributesCount != null) $.droppedAttributesCount = H.droppedAttributesCount >>> 0;
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.attributes = [];
                            if ($.defaults) O.name = "", O.version = "", O.droppedAttributesCount = 0;
                            if (H.name != null && H.hasOwnProperty("name")) O.name = H.name;
                            if (H.version != null && H.hasOwnProperty("version")) O.version = H.version;
                            if (H.attributes && H.attributes.length) {
                                O.attributes = [];
                                for (var _ = 0; _ < H.attributes.length; ++_) O.attributes[_] = u1.opentelemetry.proto.common.v1.KeyValue.toObject(H.attributes[_], $)
                            }
                            if (H.droppedAttributesCount != null && H.hasOwnProperty("droppedAttributesCount")) O.droppedAttributesCount = H.droppedAttributesCount;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.common.v1.InstrumentationScope"
                        }, z
                    }(), Y.EntityRef = function() {
                        function z(w) {
                            if (this.idKeys = [], this.descriptionKeys = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.schemaUrl = null, z.prototype.type = null, z.prototype.idKeys = g1.emptyArray, z.prototype.descriptionKeys = g1.emptyArray, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.schemaUrl != null && Object.hasOwnProperty.call(H, "schemaUrl")) $.uint32(10).string(H.schemaUrl);
                            if (H.type != null && Object.hasOwnProperty.call(H, "type")) $.uint32(18).string(H.type);
                            if (H.idKeys != null && H.idKeys.length)
                                for (var O = 0; O < H.idKeys.length; ++O) $.uint32(26).string(H.idKeys[O]);
                            if (H.descriptionKeys != null && H.descriptionKeys.length)
                                for (var O = 0; O < H.descriptionKeys.length; ++O) $.uint32(34).string(H.descriptionKeys[O]);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.common.v1.EntityRef;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.schemaUrl = H.string();
                                        break
                                    }
                                    case 2: {
                                        J.type = H.string();
                                        break
                                    }
                                    case 3: {
                                        if (!(J.idKeys && J.idKeys.length)) J.idKeys = [];
                                        J.idKeys.push(H.string());
                                        break
                                    }
                                    case 4: {
                                        if (!(J.descriptionKeys && J.descriptionKeys.length)) J.descriptionKeys = [];
                                        J.descriptionKeys.push(H.string());
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) {
                                if (!g1.isString(H.schemaUrl)) return "schemaUrl: string expected"
                            }
                            if (H.type != null && H.hasOwnProperty("type")) {
                                if (!g1.isString(H.type)) return "type: string expected"
                            }
                            if (H.idKeys != null && H.hasOwnProperty("idKeys")) {
                                if (!Array.isArray(H.idKeys)) return "idKeys: array expected";
                                for (var $ = 0; $ < H.idKeys.length; ++$)
                                    if (!g1.isString(H.idKeys[$])) return "idKeys: string[] expected"
                            }
                            if (H.descriptionKeys != null && H.hasOwnProperty("descriptionKeys")) {
                                if (!Array.isArray(H.descriptionKeys)) return "descriptionKeys: array expected";
                                for (var $ = 0; $ < H.descriptionKeys.length; ++$)
                                    if (!g1.isString(H.descriptionKeys[$])) return "descriptionKeys: string[] expected"
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.common.v1.EntityRef) return H;
                            var $ = new u1.opentelemetry.proto.common.v1.EntityRef;
                            if (H.schemaUrl != null) $.schemaUrl = String(H.schemaUrl);
                            if (H.type != null) $.type = String(H.type);
                            if (H.idKeys) {
                                if (!Array.isArray(H.idKeys)) throw TypeError(".opentelemetry.proto.common.v1.EntityRef.idKeys: array expected");
                                $.idKeys = [];
                                for (var O = 0; O < H.idKeys.length; ++O) $.idKeys[O] = String(H.idKeys[O])
                            }
                            if (H.descriptionKeys) {
                                if (!Array.isArray(H.descriptionKeys)) throw TypeError(".opentelemetry.proto.common.v1.EntityRef.descriptionKeys: array expected");
                                $.descriptionKeys = [];
                                for (var O = 0; O < H.descriptionKeys.length; ++O) $.descriptionKeys[O] = String(H.descriptionKeys[O])
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.idKeys = [], O.descriptionKeys = [];
                            if ($.defaults) O.schemaUrl = "", O.type = "";
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) O.schemaUrl = H.schemaUrl;
                            if (H.type != null && H.hasOwnProperty("type")) O.type = H.type;
                            if (H.idKeys && H.idKeys.length) {
                                O.idKeys = [];
                                for (var _ = 0; _ < H.idKeys.length; ++_) O.idKeys[_] = H.idKeys[_]
                            }
                            if (H.descriptionKeys && H.descriptionKeys.length) {
                                O.descriptionKeys = [];
                                for (var _ = 0; _ < H.descriptionKeys.length; ++_) O.descriptionKeys[_] = H.descriptionKeys[_]
                            }
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.common.v1.EntityRef"
                        }, z
                    }(), Y
                }(), K
            }(), q.resource = function() {
                var K = {};
                return K.v1 = function() {
                    var Y = {};
                    return Y.Resource = function() {
                        function z(w) {
                            if (this.attributes = [], this.entityRefs = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.attributes = g1.emptyArray, z.prototype.droppedAttributesCount = null, z.prototype.entityRefs = g1.emptyArray, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.attributes != null && H.attributes.length)
                                for (var O = 0; O < H.attributes.length; ++O) u1.opentelemetry.proto.common.v1.KeyValue.encode(H.attributes[O], $.uint32(10).fork()).ldelim();
                            if (H.droppedAttributesCount != null && Object.hasOwnProperty.call(H, "droppedAttributesCount")) $.uint32(16).uint32(H.droppedAttributesCount);
                            if (H.entityRefs != null && H.entityRefs.length)
                                for (var O = 0; O < H.entityRefs.length; ++O) u1.opentelemetry.proto.common.v1.EntityRef.encode(H.entityRefs[O], $.uint32(26).fork()).ldelim();
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.resource.v1.Resource;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                        J.attributes.push(u1.opentelemetry.proto.common.v1.KeyValue.decode(H, H.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.droppedAttributesCount = H.uint32();
                                        break
                                    }
                                    case 3: {
                                        if (!(J.entityRefs && J.entityRefs.length)) J.entityRefs = [];
                                        J.entityRefs.push(u1.opentelemetry.proto.common.v1.EntityRef.decode(H, H.uint32()));
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.attributes != null && H.hasOwnProperty("attributes")) {
                                if (!Array.isArray(H.attributes)) return "attributes: array expected";
                                for (var $ = 0; $ < H.attributes.length; ++$) {
                                    var O = u1.opentelemetry.proto.common.v1.KeyValue.verify(H.attributes[$]);
                                    if (O) return "attributes." + O
                                }
                            }
                            if (H.droppedAttributesCount != null && H.hasOwnProperty("droppedAttributesCount")) {
                                if (!g1.isInteger(H.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            if (H.entityRefs != null && H.hasOwnProperty("entityRefs")) {
                                if (!Array.isArray(H.entityRefs)) return "entityRefs: array expected";
                                for (var $ = 0; $ < H.entityRefs.length; ++$) {
                                    var O = u1.opentelemetry.proto.common.v1.EntityRef.verify(H.entityRefs[$]);
                                    if (O) return "entityRefs." + O
                                }
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.resource.v1.Resource) return H;
                            var $ = new u1.opentelemetry.proto.resource.v1.Resource;
                            if (H.attributes) {
                                if (!Array.isArray(H.attributes)) throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: array expected");
                                $.attributes = [];
                                for (var O = 0; O < H.attributes.length; ++O) {
                                    if (typeof H.attributes[O] !== "object") throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: object expected");
                                    $.attributes[O] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject(H.attributes[O])
                                }
                            }
                            if (H.droppedAttributesCount != null) $.droppedAttributesCount = H.droppedAttributesCount >>> 0;
                            if (H.entityRefs) {
                                if (!Array.isArray(H.entityRefs)) throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: array expected");
                                $.entityRefs = [];
                                for (var O = 0; O < H.entityRefs.length; ++O) {
                                    if (typeof H.entityRefs[O] !== "object") throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: object expected");
                                    $.entityRefs[O] = u1.opentelemetry.proto.common.v1.EntityRef.fromObject(H.entityRefs[O])
                                }
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.attributes = [], O.entityRefs = [];
                            if ($.defaults) O.droppedAttributesCount = 0;
                            if (H.attributes && H.attributes.length) {
                                O.attributes = [];
                                for (var _ = 0; _ < H.attributes.length; ++_) O.attributes[_] = u1.opentelemetry.proto.common.v1.KeyValue.toObject(H.attributes[_], $)
                            }
                            if (H.droppedAttributesCount != null && H.hasOwnProperty("droppedAttributesCount")) O.droppedAttributesCount = H.droppedAttributesCount;
                            if (H.entityRefs && H.entityRefs.length) {
                                O.entityRefs = [];
                                for (var _ = 0; _ < H.entityRefs.length; ++_) O.entityRefs[_] = u1.opentelemetry.proto.common.v1.EntityRef.toObject(H.entityRefs[_], $)
                            }
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.resource.v1.Resource"
                        }, z
                    }(), Y
                }(), K
            }(), q.trace = function() {
                var K = {};
                return K.v1 = function() {
                    var Y = {};
                    return Y.TracesData = function() {
                        function z(w) {
                            if (this.resourceSpans = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.resourceSpans = g1.emptyArray, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.resourceSpans != null && H.resourceSpans.length)
                                for (var O = 0; O < H.resourceSpans.length; ++O) u1.opentelemetry.proto.trace.v1.ResourceSpans.encode(H.resourceSpans[O], $.uint32(10).fork()).ldelim();
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.trace.v1.TracesData;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.resourceSpans && J.resourceSpans.length)) J.resourceSpans = [];
                                        J.resourceSpans.push(u1.opentelemetry.proto.trace.v1.ResourceSpans.decode(H, H.uint32()));
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.resourceSpans != null && H.hasOwnProperty("resourceSpans")) {
                                if (!Array.isArray(H.resourceSpans)) return "resourceSpans: array expected";
                                for (var $ = 0; $ < H.resourceSpans.length; ++$) {
                                    var O = u1.opentelemetry.proto.trace.v1.ResourceSpans.verify(H.resourceSpans[$]);
                                    if (O) return "resourceSpans." + O
                                }
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.trace.v1.TracesData) return H;
                            var $ = new u1.opentelemetry.proto.trace.v1.TracesData;
                            if (H.resourceSpans) {
                                if (!Array.isArray(H.resourceSpans)) throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: array expected");
                                $.resourceSpans = [];
                                for (var O = 0; O < H.resourceSpans.length; ++O) {
                                    if (typeof H.resourceSpans[O] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: object expected");
                                    $.resourceSpans[O] = u1.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(H.resourceSpans[O])
                                }
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.resourceSpans = [];
                            if (H.resourceSpans && H.resourceSpans.length) {
                                O.resourceSpans = [];
                                for (var _ = 0; _ < H.resourceSpans.length; ++_) O.resourceSpans[_] = u1.opentelemetry.proto.trace.v1.ResourceSpans.toObject(H.resourceSpans[_], $)
                            }
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.trace.v1.TracesData"
                        }, z
                    }(), Y.ResourceSpans = function() {
                        function z(w) {
                            if (this.scopeSpans = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.resource = null, z.prototype.scopeSpans = g1.emptyArray, z.prototype.schemaUrl = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.resource != null && Object.hasOwnProperty.call(H, "resource")) u1.opentelemetry.proto.resource.v1.Resource.encode(H.resource, $.uint32(10).fork()).ldelim();
                            if (H.scopeSpans != null && H.scopeSpans.length)
                                for (var O = 0; O < H.scopeSpans.length; ++O) u1.opentelemetry.proto.trace.v1.ScopeSpans.encode(H.scopeSpans[O], $.uint32(18).fork()).ldelim();
                            if (H.schemaUrl != null && Object.hasOwnProperty.call(H, "schemaUrl")) $.uint32(26).string(H.schemaUrl);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.trace.v1.ResourceSpans;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.resource = u1.opentelemetry.proto.resource.v1.Resource.decode(H, H.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(J.scopeSpans && J.scopeSpans.length)) J.scopeSpans = [];
                                        J.scopeSpans.push(u1.opentelemetry.proto.trace.v1.ScopeSpans.decode(H, H.uint32()));
                                        break
                                    }
                                    case 3: {
                                        J.schemaUrl = H.string();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.resource != null && H.hasOwnProperty("resource")) {
                                var $ = u1.opentelemetry.proto.resource.v1.Resource.verify(H.resource);
                                if ($) return "resource." + $
                            }
                            if (H.scopeSpans != null && H.hasOwnProperty("scopeSpans")) {
                                if (!Array.isArray(H.scopeSpans)) return "scopeSpans: array expected";
                                for (var O = 0; O < H.scopeSpans.length; ++O) {
                                    var $ = u1.opentelemetry.proto.trace.v1.ScopeSpans.verify(H.scopeSpans[O]);
                                    if ($) return "scopeSpans." + $
                                }
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) {
                                if (!g1.isString(H.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.trace.v1.ResourceSpans) return H;
                            var $ = new u1.opentelemetry.proto.trace.v1.ResourceSpans;
                            if (H.resource != null) {
                                if (typeof H.resource !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.resource: object expected");
                                $.resource = u1.opentelemetry.proto.resource.v1.Resource.fromObject(H.resource)
                            }
                            if (H.scopeSpans) {
                                if (!Array.isArray(H.scopeSpans)) throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: array expected");
                                $.scopeSpans = [];
                                for (var O = 0; O < H.scopeSpans.length; ++O) {
                                    if (typeof H.scopeSpans[O] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: object expected");
                                    $.scopeSpans[O] = u1.opentelemetry.proto.trace.v1.ScopeSpans.fromObject(H.scopeSpans[O])
                                }
                            }
                            if (H.schemaUrl != null) $.schemaUrl = String(H.schemaUrl);
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.scopeSpans = [];
                            if ($.defaults) O.resource = null, O.schemaUrl = "";
                            if (H.resource != null && H.hasOwnProperty("resource")) O.resource = u1.opentelemetry.proto.resource.v1.Resource.toObject(H.resource, $);
                            if (H.scopeSpans && H.scopeSpans.length) {
                                O.scopeSpans = [];
                                for (var _ = 0; _ < H.scopeSpans.length; ++_) O.scopeSpans[_] = u1.opentelemetry.proto.trace.v1.ScopeSpans.toObject(H.scopeSpans[_], $)
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) O.schemaUrl = H.schemaUrl;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.trace.v1.ResourceSpans"
                        }, z
                    }(), Y.ScopeSpans = function() {
                        function z(w) {
                            if (this.spans = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.scope = null, z.prototype.spans = g1.emptyArray, z.prototype.schemaUrl = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.scope != null && Object.hasOwnProperty.call(H, "scope")) u1.opentelemetry.proto.common.v1.InstrumentationScope.encode(H.scope, $.uint32(10).fork()).ldelim();
                            if (H.spans != null && H.spans.length)
                                for (var O = 0; O < H.spans.length; ++O) u1.opentelemetry.proto.trace.v1.Span.encode(H.spans[O], $.uint32(18).fork()).ldelim();
                            if (H.schemaUrl != null && Object.hasOwnProperty.call(H, "schemaUrl")) $.uint32(26).string(H.schemaUrl);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.trace.v1.ScopeSpans;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.scope = u1.opentelemetry.proto.common.v1.InstrumentationScope.decode(H, H.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(J.spans && J.spans.length)) J.spans = [];
                                        J.spans.push(u1.opentelemetry.proto.trace.v1.Span.decode(H, H.uint32()));
                                        break
                                    }
                                    case 3: {
                                        J.schemaUrl = H.string();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.scope != null && H.hasOwnProperty("scope")) {
                                var $ = u1.opentelemetry.proto.common.v1.InstrumentationScope.verify(H.scope);
                                if ($) return "scope." + $
                            }
                            if (H.spans != null && H.hasOwnProperty("spans")) {
                                if (!Array.isArray(H.spans)) return "spans: array expected";
                                for (var O = 0; O < H.spans.length; ++O) {
                                    var $ = u1.opentelemetry.proto.trace.v1.Span.verify(H.spans[O]);
                                    if ($) return "spans." + $
                                }
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) {
                                if (!g1.isString(H.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.trace.v1.ScopeSpans) return H;
                            var $ = new u1.opentelemetry.proto.trace.v1.ScopeSpans;
                            if (H.scope != null) {
                                if (typeof H.scope !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.scope: object expected");
                                $.scope = u1.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(H.scope)
                            }
                            if (H.spans) {
                                if (!Array.isArray(H.spans)) throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: array expected");
                                $.spans = [];
                                for (var O = 0; O < H.spans.length; ++O) {
                                    if (typeof H.spans[O] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: object expected");
                                    $.spans[O] = u1.opentelemetry.proto.trace.v1.Span.fromObject(H.spans[O])
                                }
                            }
                            if (H.schemaUrl != null) $.schemaUrl = String(H.schemaUrl);
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.spans = [];
                            if ($.defaults) O.scope = null, O.schemaUrl = "";
                            if (H.scope != null && H.hasOwnProperty("scope")) O.scope = u1.opentelemetry.proto.common.v1.InstrumentationScope.toObject(H.scope, $);
                            if (H.spans && H.spans.length) {
                                O.spans = [];
                                for (var _ = 0; _ < H.spans.length; ++_) O.spans[_] = u1.opentelemetry.proto.trace.v1.Span.toObject(H.spans[_], $)
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) O.schemaUrl = H.schemaUrl;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.trace.v1.ScopeSpans"
                        }, z
                    }(), Y.Span = function() {
                        function z(w) {
                            if (this.attributes = [], this.events = [], this.links = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.traceId = null, z.prototype.spanId = null, z.prototype.traceState = null, z.prototype.parentSpanId = null, z.prototype.flags = null, z.prototype.name = null, z.prototype.kind = null, z.prototype.startTimeUnixNano = null, z.prototype.endTimeUnixNano = null, z.prototype.attributes = g1.emptyArray, z.prototype.droppedAttributesCount = null, z.prototype.events = g1.emptyArray, z.prototype.droppedEventsCount = null, z.prototype.links = g1.emptyArray, z.prototype.droppedLinksCount = null, z.prototype.status = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.traceId != null && Object.hasOwnProperty.call(H, "traceId")) $.uint32(10).bytes(H.traceId);
                            if (H.spanId != null && Object.hasOwnProperty.call(H, "spanId")) $.uint32(18).bytes(H.spanId);
                            if (H.traceState != null && Object.hasOwnProperty.call(H, "traceState")) $.uint32(26).string(H.traceState);
                            if (H.parentSpanId != null && Object.hasOwnProperty.call(H, "parentSpanId")) $.uint32(34).bytes(H.parentSpanId);
                            if (H.name != null && Object.hasOwnProperty.call(H, "name")) $.uint32(42).string(H.name);
                            if (H.kind != null && Object.hasOwnProperty.call(H, "kind")) $.uint32(48).int32(H.kind);
                            if (H.startTimeUnixNano != null && Object.hasOwnProperty.call(H, "startTimeUnixNano")) $.uint32(57).fixed64(H.startTimeUnixNano);
                            if (H.endTimeUnixNano != null && Object.hasOwnProperty.call(H, "endTimeUnixNano")) $.uint32(65).fixed64(H.endTimeUnixNano);
                            if (H.attributes != null && H.attributes.length)
                                for (var O = 0; O < H.attributes.length; ++O) u1.opentelemetry.proto.common.v1.KeyValue.encode(H.attributes[O], $.uint32(74).fork()).ldelim();
                            if (H.droppedAttributesCount != null && Object.hasOwnProperty.call(H, "droppedAttributesCount")) $.uint32(80).uint32(H.droppedAttributesCount);
                            if (H.events != null && H.events.length)
                                for (var O = 0; O < H.events.length; ++O) u1.opentelemetry.proto.trace.v1.Span.Event.encode(H.events[O], $.uint32(90).fork()).ldelim();
                            if (H.droppedEventsCount != null && Object.hasOwnProperty.call(H, "droppedEventsCount")) $.uint32(96).uint32(H.droppedEventsCount);
                            if (H.links != null && H.links.length)
                                for (var O = 0; O < H.links.length; ++O) u1.opentelemetry.proto.trace.v1.Span.Link.encode(H.links[O], $.uint32(106).fork()).ldelim();
                            if (H.droppedLinksCount != null && Object.hasOwnProperty.call(H, "droppedLinksCount")) $.uint32(112).uint32(H.droppedLinksCount);
                            if (H.status != null && Object.hasOwnProperty.call(H, "status")) u1.opentelemetry.proto.trace.v1.Status.encode(H.status, $.uint32(122).fork()).ldelim();
                            if (H.flags != null && Object.hasOwnProperty.call(H, "flags")) $.uint32(133).fixed32(H.flags);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.trace.v1.Span;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.traceId = H.bytes();
                                        break
                                    }
                                    case 2: {
                                        J.spanId = H.bytes();
                                        break
                                    }
                                    case 3: {
                                        J.traceState = H.string();
                                        break
                                    }
                                    case 4: {
                                        J.parentSpanId = H.bytes();
                                        break
                                    }
                                    case 16: {
                                        J.flags = H.fixed32();
                                        break
                                    }
                                    case 5: {
                                        J.name = H.string();
                                        break
                                    }
                                    case 6: {
                                        J.kind = H.int32();
                                        break
                                    }
                                    case 7: {
                                        J.startTimeUnixNano = H.fixed64();
                                        break
                                    }
                                    case 8: {
                                        J.endTimeUnixNano = H.fixed64();
                                        break
                                    }
                                    case 9: {
                                        if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                        J.attributes.push(u1.opentelemetry.proto.common.v1.KeyValue.decode(H, H.uint32()));
                                        break
                                    }
                                    case 10: {
                                        J.droppedAttributesCount = H.uint32();
                                        break
                                    }
                                    case 11: {
                                        if (!(J.events && J.events.length)) J.events = [];
                                        J.events.push(u1.opentelemetry.proto.trace.v1.Span.Event.decode(H, H.uint32()));
                                        break
                                    }
                                    case 12: {
                                        J.droppedEventsCount = H.uint32();
                                        break
                                    }
                                    case 13: {
                                        if (!(J.links && J.links.length)) J.links = [];
                                        J.links.push(u1.opentelemetry.proto.trace.v1.Span.Link.decode(H, H.uint32()));
                                        break
                                    }
                                    case 14: {
                                        J.droppedLinksCount = H.uint32();
                                        break
                                    }
                                    case 15: {
                                        J.status = u1.opentelemetry.proto.trace.v1.Status.decode(H, H.uint32());
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.traceId != null && H.hasOwnProperty("traceId")) {
                                if (!(H.traceId && typeof H.traceId.length === "number" || g1.isString(H.traceId))) return "traceId: buffer expected"
                            }
                            if (H.spanId != null && H.hasOwnProperty("spanId")) {
                                if (!(H.spanId && typeof H.spanId.length === "number" || g1.isString(H.spanId))) return "spanId: buffer expected"
                            }
                            if (H.traceState != null && H.hasOwnProperty("traceState")) {
                                if (!g1.isString(H.traceState)) return "traceState: string expected"
                            }
                            if (H.parentSpanId != null && H.hasOwnProperty("parentSpanId")) {
                                if (!(H.parentSpanId && typeof H.parentSpanId.length === "number" || g1.isString(H.parentSpanId))) return "parentSpanId: buffer expected"
                            }
                            if (H.flags != null && H.hasOwnProperty("flags")) {
                                if (!g1.isInteger(H.flags)) return "flags: integer expected"
                            }
                            if (H.name != null && H.hasOwnProperty("name")) {
                                if (!g1.isString(H.name)) return "name: string expected"
                            }
                            if (H.kind != null && H.hasOwnProperty("kind")) switch (H.kind) {
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
                            if (H.startTimeUnixNano != null && H.hasOwnProperty("startTimeUnixNano")) {
                                if (!g1.isInteger(H.startTimeUnixNano) && !(H.startTimeUnixNano && g1.isInteger(H.startTimeUnixNano.low) && g1.isInteger(H.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (H.endTimeUnixNano != null && H.hasOwnProperty("endTimeUnixNano")) {
                                if (!g1.isInteger(H.endTimeUnixNano) && !(H.endTimeUnixNano && g1.isInteger(H.endTimeUnixNano.low) && g1.isInteger(H.endTimeUnixNano.high))) return "endTimeUnixNano: integer|Long expected"
                            }
                            if (H.attributes != null && H.hasOwnProperty("attributes")) {
                                if (!Array.isArray(H.attributes)) return "attributes: array expected";
                                for (var $ = 0; $ < H.attributes.length; ++$) {
                                    var O = u1.opentelemetry.proto.common.v1.KeyValue.verify(H.attributes[$]);
                                    if (O) return "attributes." + O
                                }
                            }
                            if (H.droppedAttributesCount != null && H.hasOwnProperty("droppedAttributesCount")) {
                                if (!g1.isInteger(H.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            if (H.events != null && H.hasOwnProperty("events")) {
                                if (!Array.isArray(H.events)) return "events: array expected";
                                for (var $ = 0; $ < H.events.length; ++$) {
                                    var O = u1.opentelemetry.proto.trace.v1.Span.Event.verify(H.events[$]);
                                    if (O) return "events." + O
                                }
                            }
                            if (H.droppedEventsCount != null && H.hasOwnProperty("droppedEventsCount")) {
                                if (!g1.isInteger(H.droppedEventsCount)) return "droppedEventsCount: integer expected"
                            }
                            if (H.links != null && H.hasOwnProperty("links")) {
                                if (!Array.isArray(H.links)) return "links: array expected";
                                for (var $ = 0; $ < H.links.length; ++$) {
                                    var O = u1.opentelemetry.proto.trace.v1.Span.Link.verify(H.links[$]);
                                    if (O) return "links." + O
                                }
                            }
                            if (H.droppedLinksCount != null && H.hasOwnProperty("droppedLinksCount")) {
                                if (!g1.isInteger(H.droppedLinksCount)) return "droppedLinksCount: integer expected"
                            }
                            if (H.status != null && H.hasOwnProperty("status")) {
                                var O = u1.opentelemetry.proto.trace.v1.Status.verify(H.status);
                                if (O) return "status." + O
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.trace.v1.Span) return H;
                            var $ = new u1.opentelemetry.proto.trace.v1.Span;
                            if (H.traceId != null) {
                                if (typeof H.traceId === "string") g1.base64.decode(H.traceId, $.traceId = g1.newBuffer(g1.base64.length(H.traceId)), 0);
                                else if (H.traceId.length >= 0) $.traceId = H.traceId
                            }
                            if (H.spanId != null) {
                                if (typeof H.spanId === "string") g1.base64.decode(H.spanId, $.spanId = g1.newBuffer(g1.base64.length(H.spanId)), 0);
                                else if (H.spanId.length >= 0) $.spanId = H.spanId
                            }
                            if (H.traceState != null) $.traceState = String(H.traceState);
                            if (H.parentSpanId != null) {
                                if (typeof H.parentSpanId === "string") g1.base64.decode(H.parentSpanId, $.parentSpanId = g1.newBuffer(g1.base64.length(H.parentSpanId)), 0);
                                else if (H.parentSpanId.length >= 0) $.parentSpanId = H.parentSpanId
                            }
                            if (H.flags != null) $.flags = H.flags >>> 0;
                            if (H.name != null) $.name = String(H.name);
                            switch (H.kind) {
                                default:
                                    if (typeof H.kind === "number") {
                                        $.kind = H.kind;
                                        break
                                    }
                                    break;
                                case "SPAN_KIND_UNSPECIFIED":
                                case 0:
                                    $.kind = 0;
                                    break;
                                case "SPAN_KIND_INTERNAL":
                                case 1:
                                    $.kind = 1;
                                    break;
                                case "SPAN_KIND_SERVER":
                                case 2:
                                    $.kind = 2;
                                    break;
                                case "SPAN_KIND_CLIENT":
                                case 3:
                                    $.kind = 3;
                                    break;
                                case "SPAN_KIND_PRODUCER":
                                case 4:
                                    $.kind = 4;
                                    break;
                                case "SPAN_KIND_CONSUMER":
                                case 5:
                                    $.kind = 5;
                                    break
                            }
                            if (H.startTimeUnixNano != null) {
                                if (g1.Long)($.startTimeUnixNano = g1.Long.fromValue(H.startTimeUnixNano)).unsigned = !1;
                                else if (typeof H.startTimeUnixNano === "string") $.startTimeUnixNano = parseInt(H.startTimeUnixNano, 10);
                                else if (typeof H.startTimeUnixNano === "number") $.startTimeUnixNano = H.startTimeUnixNano;
                                else if (typeof H.startTimeUnixNano === "object") $.startTimeUnixNano = new g1.LongBits(H.startTimeUnixNano.low >>> 0, H.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (H.endTimeUnixNano != null) {
                                if (g1.Long)($.endTimeUnixNano = g1.Long.fromValue(H.endTimeUnixNano)).unsigned = !1;
                                else if (typeof H.endTimeUnixNano === "string") $.endTimeUnixNano = parseInt(H.endTimeUnixNano, 10);
                                else if (typeof H.endTimeUnixNano === "number") $.endTimeUnixNano = H.endTimeUnixNano;
                                else if (typeof H.endTimeUnixNano === "object") $.endTimeUnixNano = new g1.LongBits(H.endTimeUnixNano.low >>> 0, H.endTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (H.attributes) {
                                if (!Array.isArray(H.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: array expected");
                                $.attributes = [];
                                for (var O = 0; O < H.attributes.length; ++O) {
                                    if (typeof H.attributes[O] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: object expected");
                                    $.attributes[O] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject(H.attributes[O])
                                }
                            }
                            if (H.droppedAttributesCount != null) $.droppedAttributesCount = H.droppedAttributesCount >>> 0;
                            if (H.events) {
                                if (!Array.isArray(H.events)) throw TypeError(".opentelemetry.proto.trace.v1.Span.events: array expected");
                                $.events = [];
                                for (var O = 0; O < H.events.length; ++O) {
                                    if (typeof H.events[O] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.events: object expected");
                                    $.events[O] = u1.opentelemetry.proto.trace.v1.Span.Event.fromObject(H.events[O])
                                }
                            }
                            if (H.droppedEventsCount != null) $.droppedEventsCount = H.droppedEventsCount >>> 0;
                            if (H.links) {
                                if (!Array.isArray(H.links)) throw TypeError(".opentelemetry.proto.trace.v1.Span.links: array expected");
                                $.links = [];
                                for (var O = 0; O < H.links.length; ++O) {
                                    if (typeof H.links[O] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.links: object expected");
                                    $.links[O] = u1.opentelemetry.proto.trace.v1.Span.Link.fromObject(H.links[O])
                                }
                            }
                            if (H.droppedLinksCount != null) $.droppedLinksCount = H.droppedLinksCount >>> 0;
                            if (H.status != null) {
                                if (typeof H.status !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.status: object expected");
                                $.status = u1.opentelemetry.proto.trace.v1.Status.fromObject(H.status)
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.attributes = [], O.events = [], O.links = [];
                            if ($.defaults) {
                                if ($.bytes === String) O.traceId = "";
                                else if (O.traceId = [], $.bytes !== Array) O.traceId = g1.newBuffer(O.traceId);
                                if ($.bytes === String) O.spanId = "";
                                else if (O.spanId = [], $.bytes !== Array) O.spanId = g1.newBuffer(O.spanId);
                                if (O.traceState = "", $.bytes === String) O.parentSpanId = "";
                                else if (O.parentSpanId = [], $.bytes !== Array) O.parentSpanId = g1.newBuffer(O.parentSpanId);
                                if (O.name = "", O.kind = $.enums === String ? "SPAN_KIND_UNSPECIFIED" : 0, g1.Long) {
                                    var _ = new g1.Long(0, 0, !1);
                                    O.startTimeUnixNano = $.longs === String ? _.toString() : $.longs === Number ? _.toNumber() : _
                                } else O.startTimeUnixNano = $.longs === String ? "0" : 0;
                                if (g1.Long) {
                                    var _ = new g1.Long(0, 0, !1);
                                    O.endTimeUnixNano = $.longs === String ? _.toString() : $.longs === Number ? _.toNumber() : _
                                } else O.endTimeUnixNano = $.longs === String ? "0" : 0;
                                O.droppedAttributesCount = 0, O.droppedEventsCount = 0, O.droppedLinksCount = 0, O.status = null, O.flags = 0
                            }
                            if (H.traceId != null && H.hasOwnProperty("traceId")) O.traceId = $.bytes === String ? g1.base64.encode(H.traceId, 0, H.traceId.length) : $.bytes === Array ? Array.prototype.slice.call(H.traceId) : H.traceId;
                            if (H.spanId != null && H.hasOwnProperty("spanId")) O.spanId = $.bytes === String ? g1.base64.encode(H.spanId, 0, H.spanId.length) : $.bytes === Array ? Array.prototype.slice.call(H.spanId) : H.spanId;
                            if (H.traceState != null && H.hasOwnProperty("traceState")) O.traceState = H.traceState;
                            if (H.parentSpanId != null && H.hasOwnProperty("parentSpanId")) O.parentSpanId = $.bytes === String ? g1.base64.encode(H.parentSpanId, 0, H.parentSpanId.length) : $.bytes === Array ? Array.prototype.slice.call(H.parentSpanId) : H.parentSpanId;
                            if (H.name != null && H.hasOwnProperty("name")) O.name = H.name;
                            if (H.kind != null && H.hasOwnProperty("kind")) O.kind = $.enums === String ? u1.opentelemetry.proto.trace.v1.Span.SpanKind[H.kind] === void 0 ? H.kind : u1.opentelemetry.proto.trace.v1.Span.SpanKind[H.kind] : H.kind;
                            if (H.startTimeUnixNano != null && H.hasOwnProperty("startTimeUnixNano"))
                                if (typeof H.startTimeUnixNano === "number") O.startTimeUnixNano = $.longs === String ? String(H.startTimeUnixNano) : H.startTimeUnixNano;
                                else O.startTimeUnixNano = $.longs === String ? g1.Long.prototype.toString.call(H.startTimeUnixNano) : $.longs === Number ? new g1.LongBits(H.startTimeUnixNano.low >>> 0, H.startTimeUnixNano.high >>> 0).toNumber() : H.startTimeUnixNano;
                            if (H.endTimeUnixNano != null && H.hasOwnProperty("endTimeUnixNano"))
                                if (typeof H.endTimeUnixNano === "number") O.endTimeUnixNano = $.longs === String ? String(H.endTimeUnixNano) : H.endTimeUnixNano;
                                else O.endTimeUnixNano = $.longs === String ? g1.Long.prototype.toString.call(H.endTimeUnixNano) : $.longs === Number ? new g1.LongBits(H.endTimeUnixNano.low >>> 0, H.endTimeUnixNano.high >>> 0).toNumber() : H.endTimeUnixNano;
                            if (H.attributes && H.attributes.length) {
                                O.attributes = [];
                                for (var J = 0; J < H.attributes.length; ++J) O.attributes[J] = u1.opentelemetry.proto.common.v1.KeyValue.toObject(H.attributes[J], $)
                            }
                            if (H.droppedAttributesCount != null && H.hasOwnProperty("droppedAttributesCount")) O.droppedAttributesCount = H.droppedAttributesCount;
                            if (H.events && H.events.length) {
                                O.events = [];
                                for (var J = 0; J < H.events.length; ++J) O.events[J] = u1.opentelemetry.proto.trace.v1.Span.Event.toObject(H.events[J], $)
                            }
                            if (H.droppedEventsCount != null && H.hasOwnProperty("droppedEventsCount")) O.droppedEventsCount = H.droppedEventsCount;
                            if (H.links && H.links.length) {
                                O.links = [];
                                for (var J = 0; J < H.links.length; ++J) O.links[J] = u1.opentelemetry.proto.trace.v1.Span.Link.toObject(H.links[J], $)
                            }
                            if (H.droppedLinksCount != null && H.hasOwnProperty("droppedLinksCount")) O.droppedLinksCount = H.droppedLinksCount;
                            if (H.status != null && H.hasOwnProperty("status")) O.status = u1.opentelemetry.proto.trace.v1.Status.toObject(H.status, $);
                            if (H.flags != null && H.hasOwnProperty("flags")) O.flags = H.flags;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.trace.v1.Span"
                        }, z.SpanKind = function() {
                            var w = {},
                                H = Object.create(w);
                            return H[w[0] = "SPAN_KIND_UNSPECIFIED"] = 0, H[w[1] = "SPAN_KIND_INTERNAL"] = 1, H[w[2] = "SPAN_KIND_SERVER"] = 2, H[w[3] = "SPAN_KIND_CLIENT"] = 3, H[w[4] = "SPAN_KIND_PRODUCER"] = 4, H[w[5] = "SPAN_KIND_CONSUMER"] = 5, H
                        }(), z.Event = function() {
                            function w(H) {
                                if (this.attributes = [], H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.timeUnixNano = null, w.prototype.name = null, w.prototype.attributes = g1.emptyArray, w.prototype.droppedAttributesCount = null, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.timeUnixNano != null && Object.hasOwnProperty.call($, "timeUnixNano")) O.uint32(9).fixed64($.timeUnixNano);
                                if ($.name != null && Object.hasOwnProperty.call($, "name")) O.uint32(18).string($.name);
                                if ($.attributes != null && $.attributes.length)
                                    for (var _ = 0; _ < $.attributes.length; ++_) u1.opentelemetry.proto.common.v1.KeyValue.encode($.attributes[_], O.uint32(26).fork()).ldelim();
                                if ($.droppedAttributesCount != null && Object.hasOwnProperty.call($, "droppedAttributesCount")) O.uint32(32).uint32($.droppedAttributesCount);
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.trace.v1.Span.Event;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            X.timeUnixNano = $.fixed64();
                                            break
                                        }
                                        case 2: {
                                            X.name = $.string();
                                            break
                                        }
                                        case 3: {
                                            if (!(X.attributes && X.attributes.length)) X.attributes = [];
                                            X.attributes.push(u1.opentelemetry.proto.common.v1.KeyValue.decode($, $.uint32()));
                                            break
                                        }
                                        case 4: {
                                            X.droppedAttributesCount = $.uint32();
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.timeUnixNano != null && $.hasOwnProperty("timeUnixNano")) {
                                    if (!g1.isInteger($.timeUnixNano) && !($.timeUnixNano && g1.isInteger($.timeUnixNano.low) && g1.isInteger($.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                                }
                                if ($.name != null && $.hasOwnProperty("name")) {
                                    if (!g1.isString($.name)) return "name: string expected"
                                }
                                if ($.attributes != null && $.hasOwnProperty("attributes")) {
                                    if (!Array.isArray($.attributes)) return "attributes: array expected";
                                    for (var O = 0; O < $.attributes.length; ++O) {
                                        var _ = u1.opentelemetry.proto.common.v1.KeyValue.verify($.attributes[O]);
                                        if (_) return "attributes." + _
                                    }
                                }
                                if ($.droppedAttributesCount != null && $.hasOwnProperty("droppedAttributesCount")) {
                                    if (!g1.isInteger($.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.trace.v1.Span.Event) return $;
                                var O = new u1.opentelemetry.proto.trace.v1.Span.Event;
                                if ($.timeUnixNano != null) {
                                    if (g1.Long)(O.timeUnixNano = g1.Long.fromValue($.timeUnixNano)).unsigned = !1;
                                    else if (typeof $.timeUnixNano === "string") O.timeUnixNano = parseInt($.timeUnixNano, 10);
                                    else if (typeof $.timeUnixNano === "number") O.timeUnixNano = $.timeUnixNano;
                                    else if (typeof $.timeUnixNano === "object") O.timeUnixNano = new g1.LongBits($.timeUnixNano.low >>> 0, $.timeUnixNano.high >>> 0).toNumber()
                                }
                                if ($.name != null) O.name = String($.name);
                                if ($.attributes) {
                                    if (!Array.isArray($.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: array expected");
                                    O.attributes = [];
                                    for (var _ = 0; _ < $.attributes.length; ++_) {
                                        if (typeof $.attributes[_] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: object expected");
                                        O.attributes[_] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject($.attributes[_])
                                    }
                                }
                                if ($.droppedAttributesCount != null) O.droppedAttributesCount = $.droppedAttributesCount >>> 0;
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.arrays || O.defaults) _.attributes = [];
                                if (O.defaults) {
                                    if (g1.Long) {
                                        var J = new g1.Long(0, 0, !1);
                                        _.timeUnixNano = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                    } else _.timeUnixNano = O.longs === String ? "0" : 0;
                                    _.name = "", _.droppedAttributesCount = 0
                                }
                                if ($.timeUnixNano != null && $.hasOwnProperty("timeUnixNano"))
                                    if (typeof $.timeUnixNano === "number") _.timeUnixNano = O.longs === String ? String($.timeUnixNano) : $.timeUnixNano;
                                    else _.timeUnixNano = O.longs === String ? g1.Long.prototype.toString.call($.timeUnixNano) : O.longs === Number ? new g1.LongBits($.timeUnixNano.low >>> 0, $.timeUnixNano.high >>> 0).toNumber() : $.timeUnixNano;
                                if ($.name != null && $.hasOwnProperty("name")) _.name = $.name;
                                if ($.attributes && $.attributes.length) {
                                    _.attributes = [];
                                    for (var X = 0; X < $.attributes.length; ++X) _.attributes[X] = u1.opentelemetry.proto.common.v1.KeyValue.toObject($.attributes[X], O)
                                }
                                if ($.droppedAttributesCount != null && $.hasOwnProperty("droppedAttributesCount")) _.droppedAttributesCount = $.droppedAttributesCount;
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.trace.v1.Span.Event"
                            }, w
                        }(), z.Link = function() {
                            function w(H) {
                                if (this.attributes = [], H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.traceId = null, w.prototype.spanId = null, w.prototype.traceState = null, w.prototype.attributes = g1.emptyArray, w.prototype.droppedAttributesCount = null, w.prototype.flags = null, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.traceId != null && Object.hasOwnProperty.call($, "traceId")) O.uint32(10).bytes($.traceId);
                                if ($.spanId != null && Object.hasOwnProperty.call($, "spanId")) O.uint32(18).bytes($.spanId);
                                if ($.traceState != null && Object.hasOwnProperty.call($, "traceState")) O.uint32(26).string($.traceState);
                                if ($.attributes != null && $.attributes.length)
                                    for (var _ = 0; _ < $.attributes.length; ++_) u1.opentelemetry.proto.common.v1.KeyValue.encode($.attributes[_], O.uint32(34).fork()).ldelim();
                                if ($.droppedAttributesCount != null && Object.hasOwnProperty.call($, "droppedAttributesCount")) O.uint32(40).uint32($.droppedAttributesCount);
                                if ($.flags != null && Object.hasOwnProperty.call($, "flags")) O.uint32(53).fixed32($.flags);
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.trace.v1.Span.Link;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            X.traceId = $.bytes();
                                            break
                                        }
                                        case 2: {
                                            X.spanId = $.bytes();
                                            break
                                        }
                                        case 3: {
                                            X.traceState = $.string();
                                            break
                                        }
                                        case 4: {
                                            if (!(X.attributes && X.attributes.length)) X.attributes = [];
                                            X.attributes.push(u1.opentelemetry.proto.common.v1.KeyValue.decode($, $.uint32()));
                                            break
                                        }
                                        case 5: {
                                            X.droppedAttributesCount = $.uint32();
                                            break
                                        }
                                        case 6: {
                                            X.flags = $.fixed32();
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.traceId != null && $.hasOwnProperty("traceId")) {
                                    if (!($.traceId && typeof $.traceId.length === "number" || g1.isString($.traceId))) return "traceId: buffer expected"
                                }
                                if ($.spanId != null && $.hasOwnProperty("spanId")) {
                                    if (!($.spanId && typeof $.spanId.length === "number" || g1.isString($.spanId))) return "spanId: buffer expected"
                                }
                                if ($.traceState != null && $.hasOwnProperty("traceState")) {
                                    if (!g1.isString($.traceState)) return "traceState: string expected"
                                }
                                if ($.attributes != null && $.hasOwnProperty("attributes")) {
                                    if (!Array.isArray($.attributes)) return "attributes: array expected";
                                    for (var O = 0; O < $.attributes.length; ++O) {
                                        var _ = u1.opentelemetry.proto.common.v1.KeyValue.verify($.attributes[O]);
                                        if (_) return "attributes." + _
                                    }
                                }
                                if ($.droppedAttributesCount != null && $.hasOwnProperty("droppedAttributesCount")) {
                                    if (!g1.isInteger($.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                                }
                                if ($.flags != null && $.hasOwnProperty("flags")) {
                                    if (!g1.isInteger($.flags)) return "flags: integer expected"
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.trace.v1.Span.Link) return $;
                                var O = new u1.opentelemetry.proto.trace.v1.Span.Link;
                                if ($.traceId != null) {
                                    if (typeof $.traceId === "string") g1.base64.decode($.traceId, O.traceId = g1.newBuffer(g1.base64.length($.traceId)), 0);
                                    else if ($.traceId.length >= 0) O.traceId = $.traceId
                                }
                                if ($.spanId != null) {
                                    if (typeof $.spanId === "string") g1.base64.decode($.spanId, O.spanId = g1.newBuffer(g1.base64.length($.spanId)), 0);
                                    else if ($.spanId.length >= 0) O.spanId = $.spanId
                                }
                                if ($.traceState != null) O.traceState = String($.traceState);
                                if ($.attributes) {
                                    if (!Array.isArray($.attributes)) throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: array expected");
                                    O.attributes = [];
                                    for (var _ = 0; _ < $.attributes.length; ++_) {
                                        if (typeof $.attributes[_] !== "object") throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: object expected");
                                        O.attributes[_] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject($.attributes[_])
                                    }
                                }
                                if ($.droppedAttributesCount != null) O.droppedAttributesCount = $.droppedAttributesCount >>> 0;
                                if ($.flags != null) O.flags = $.flags >>> 0;
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.arrays || O.defaults) _.attributes = [];
                                if (O.defaults) {
                                    if (O.bytes === String) _.traceId = "";
                                    else if (_.traceId = [], O.bytes !== Array) _.traceId = g1.newBuffer(_.traceId);
                                    if (O.bytes === String) _.spanId = "";
                                    else if (_.spanId = [], O.bytes !== Array) _.spanId = g1.newBuffer(_.spanId);
                                    _.traceState = "", _.droppedAttributesCount = 0, _.flags = 0
                                }
                                if ($.traceId != null && $.hasOwnProperty("traceId")) _.traceId = O.bytes === String ? g1.base64.encode($.traceId, 0, $.traceId.length) : O.bytes === Array ? Array.prototype.slice.call($.traceId) : $.traceId;
                                if ($.spanId != null && $.hasOwnProperty("spanId")) _.spanId = O.bytes === String ? g1.base64.encode($.spanId, 0, $.spanId.length) : O.bytes === Array ? Array.prototype.slice.call($.spanId) : $.spanId;
                                if ($.traceState != null && $.hasOwnProperty("traceState")) _.traceState = $.traceState;
                                if ($.attributes && $.attributes.length) {
                                    _.attributes = [];
                                    for (var J = 0; J < $.attributes.length; ++J) _.attributes[J] = u1.opentelemetry.proto.common.v1.KeyValue.toObject($.attributes[J], O)
                                }
                                if ($.droppedAttributesCount != null && $.hasOwnProperty("droppedAttributesCount")) _.droppedAttributesCount = $.droppedAttributesCount;
                                if ($.flags != null && $.hasOwnProperty("flags")) _.flags = $.flags;
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.trace.v1.Span.Link"
                            }, w
                        }(), z
                    }(), Y.Status = function() {
                        function z(w) {
                            if (w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.message = null, z.prototype.code = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.message != null && Object.hasOwnProperty.call(H, "message")) $.uint32(18).string(H.message);
                            if (H.code != null && Object.hasOwnProperty.call(H, "code")) $.uint32(24).int32(H.code);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.trace.v1.Status;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 2: {
                                        J.message = H.string();
                                        break
                                    }
                                    case 3: {
                                        J.code = H.int32();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.message != null && H.hasOwnProperty("message")) {
                                if (!g1.isString(H.message)) return "message: string expected"
                            }
                            if (H.code != null && H.hasOwnProperty("code")) switch (H.code) {
                                default:
                                    return "code: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.trace.v1.Status) return H;
                            var $ = new u1.opentelemetry.proto.trace.v1.Status;
                            if (H.message != null) $.message = String(H.message);
                            switch (H.code) {
                                default:
                                    if (typeof H.code === "number") {
                                        $.code = H.code;
                                        break
                                    }
                                    break;
                                case "STATUS_CODE_UNSET":
                                case 0:
                                    $.code = 0;
                                    break;
                                case "STATUS_CODE_OK":
                                case 1:
                                    $.code = 1;
                                    break;
                                case "STATUS_CODE_ERROR":
                                case 2:
                                    $.code = 2;
                                    break
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.defaults) O.message = "", O.code = $.enums === String ? "STATUS_CODE_UNSET" : 0;
                            if (H.message != null && H.hasOwnProperty("message")) O.message = H.message;
                            if (H.code != null && H.hasOwnProperty("code")) O.code = $.enums === String ? u1.opentelemetry.proto.trace.v1.Status.StatusCode[H.code] === void 0 ? H.code : u1.opentelemetry.proto.trace.v1.Status.StatusCode[H.code] : H.code;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.trace.v1.Status"
                        }, z.StatusCode = function() {
                            var w = {},
                                H = Object.create(w);
                            return H[w[0] = "STATUS_CODE_UNSET"] = 0, H[w[1] = "STATUS_CODE_OK"] = 1, H[w[2] = "STATUS_CODE_ERROR"] = 2, H
                        }(), z
                    }(), Y.SpanFlags = function() {
                        var z = {},
                            w = Object.create(z);
                        return w[z[0] = "SPAN_FLAGS_DO_NOT_USE"] = 0, w[z[255] = "SPAN_FLAGS_TRACE_FLAGS_MASK"] = 255, w[z[256] = "SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK"] = 256, w[z[512] = "SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK"] = 512, w
                    }(), Y
                }(), K
            }(), q.collector = function() {
                var K = {};
                return K.trace = function() {
                    var Y = {};
                    return Y.v1 = function() {
                        var z = {};
                        return z.TraceService = function() {
                            function w(H, $, O) {
                                JK.rpc.Service.call(this, H, $, O)
                            }
                            return (w.prototype = Object.create(JK.rpc.Service.prototype)).constructor = w, w.create = function($, O, _) {
                                return new this($, O, _)
                            }, Object.defineProperty(w.prototype.export = function H($, O) {
                                return this.rpcCall(H, u1.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest, u1.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse, $, O)
                            }, "name", {
                                value: "Export"
                            }), w
                        }(), z.ExportTraceServiceRequest = function() {
                            function w(H) {
                                if (this.resourceSpans = [], H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.resourceSpans = g1.emptyArray, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.resourceSpans != null && $.resourceSpans.length)
                                    for (var _ = 0; _ < $.resourceSpans.length; ++_) u1.opentelemetry.proto.trace.v1.ResourceSpans.encode($.resourceSpans[_], O.uint32(10).fork()).ldelim();
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            if (!(X.resourceSpans && X.resourceSpans.length)) X.resourceSpans = [];
                                            X.resourceSpans.push(u1.opentelemetry.proto.trace.v1.ResourceSpans.decode($, $.uint32()));
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.resourceSpans != null && $.hasOwnProperty("resourceSpans")) {
                                    if (!Array.isArray($.resourceSpans)) return "resourceSpans: array expected";
                                    for (var O = 0; O < $.resourceSpans.length; ++O) {
                                        var _ = u1.opentelemetry.proto.trace.v1.ResourceSpans.verify($.resourceSpans[O]);
                                        if (_) return "resourceSpans." + _
                                    }
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest) return $;
                                var O = new u1.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
                                if ($.resourceSpans) {
                                    if (!Array.isArray($.resourceSpans)) throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: array expected");
                                    O.resourceSpans = [];
                                    for (var _ = 0; _ < $.resourceSpans.length; ++_) {
                                        if (typeof $.resourceSpans[_] !== "object") throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: object expected");
                                        O.resourceSpans[_] = u1.opentelemetry.proto.trace.v1.ResourceSpans.fromObject($.resourceSpans[_])
                                    }
                                }
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.arrays || O.defaults) _.resourceSpans = [];
                                if ($.resourceSpans && $.resourceSpans.length) {
                                    _.resourceSpans = [];
                                    for (var J = 0; J < $.resourceSpans.length; ++J) _.resourceSpans[J] = u1.opentelemetry.proto.trace.v1.ResourceSpans.toObject($.resourceSpans[J], O)
                                }
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest"
                            }, w
                        }(), z.ExportTraceServiceResponse = function() {
                            function w(H) {
                                if (H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.partialSuccess = null, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.partialSuccess != null && Object.hasOwnProperty.call($, "partialSuccess")) u1.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.encode($.partialSuccess, O.uint32(10).fork()).ldelim();
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            X.partialSuccess = u1.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.decode($, $.uint32());
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.partialSuccess != null && $.hasOwnProperty("partialSuccess")) {
                                    var O = u1.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.verify($.partialSuccess);
                                    if (O) return "partialSuccess." + O
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse) return $;
                                var O = new u1.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;
                                if ($.partialSuccess != null) {
                                    if (typeof $.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse.partialSuccess: object expected");
                                    O.partialSuccess = u1.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.fromObject($.partialSuccess)
                                }
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.defaults) _.partialSuccess = null;
                                if ($.partialSuccess != null && $.hasOwnProperty("partialSuccess")) _.partialSuccess = u1.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.toObject($.partialSuccess, O);
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse"
                            }, w
                        }(), z.ExportTracePartialSuccess = function() {
                            function w(H) {
                                if (H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.rejectedSpans = null, w.prototype.errorMessage = null, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.rejectedSpans != null && Object.hasOwnProperty.call($, "rejectedSpans")) O.uint32(8).int64($.rejectedSpans);
                                if ($.errorMessage != null && Object.hasOwnProperty.call($, "errorMessage")) O.uint32(18).string($.errorMessage);
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            X.rejectedSpans = $.int64();
                                            break
                                        }
                                        case 2: {
                                            X.errorMessage = $.string();
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.rejectedSpans != null && $.hasOwnProperty("rejectedSpans")) {
                                    if (!g1.isInteger($.rejectedSpans) && !($.rejectedSpans && g1.isInteger($.rejectedSpans.low) && g1.isInteger($.rejectedSpans.high))) return "rejectedSpans: integer|Long expected"
                                }
                                if ($.errorMessage != null && $.hasOwnProperty("errorMessage")) {
                                    if (!g1.isString($.errorMessage)) return "errorMessage: string expected"
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess) return $;
                                var O = new u1.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;
                                if ($.rejectedSpans != null) {
                                    if (g1.Long)(O.rejectedSpans = g1.Long.fromValue($.rejectedSpans)).unsigned = !1;
                                    else if (typeof $.rejectedSpans === "string") O.rejectedSpans = parseInt($.rejectedSpans, 10);
                                    else if (typeof $.rejectedSpans === "number") O.rejectedSpans = $.rejectedSpans;
                                    else if (typeof $.rejectedSpans === "object") O.rejectedSpans = new g1.LongBits($.rejectedSpans.low >>> 0, $.rejectedSpans.high >>> 0).toNumber()
                                }
                                if ($.errorMessage != null) O.errorMessage = String($.errorMessage);
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.defaults) {
                                    if (g1.Long) {
                                        var J = new g1.Long(0, 0, !1);
                                        _.rejectedSpans = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                    } else _.rejectedSpans = O.longs === String ? "0" : 0;
                                    _.errorMessage = ""
                                }
                                if ($.rejectedSpans != null && $.hasOwnProperty("rejectedSpans"))
                                    if (typeof $.rejectedSpans === "number") _.rejectedSpans = O.longs === String ? String($.rejectedSpans) : $.rejectedSpans;
                                    else _.rejectedSpans = O.longs === String ? g1.Long.prototype.toString.call($.rejectedSpans) : O.longs === Number ? new g1.LongBits($.rejectedSpans.low >>> 0, $.rejectedSpans.high >>> 0).toNumber() : $.rejectedSpans;
                                if ($.errorMessage != null && $.hasOwnProperty("errorMessage")) _.errorMessage = $.errorMessage;
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess"
                            }, w
                        }(), z
                    }(), Y
                }(), K.metrics = function() {
                    var Y = {};
                    return Y.v1 = function() {
                        var z = {};
                        return z.MetricsService = function() {
                            function w(H, $, O) {
                                JK.rpc.Service.call(this, H, $, O)
                            }
                            return (w.prototype = Object.create(JK.rpc.Service.prototype)).constructor = w, w.create = function($, O, _) {
                                return new this($, O, _)
                            }, Object.defineProperty(w.prototype.export = function H($, O) {
                                return this.rpcCall(H, u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest, u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse, $, O)
                            }, "name", {
                                value: "Export"
                            }), w
                        }(), z.ExportMetricsServiceRequest = function() {
                            function w(H) {
                                if (this.resourceMetrics = [], H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.resourceMetrics = g1.emptyArray, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.resourceMetrics != null && $.resourceMetrics.length)
                                    for (var _ = 0; _ < $.resourceMetrics.length; ++_) u1.opentelemetry.proto.metrics.v1.ResourceMetrics.encode($.resourceMetrics[_], O.uint32(10).fork()).ldelim();
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            if (!(X.resourceMetrics && X.resourceMetrics.length)) X.resourceMetrics = [];
                                            X.resourceMetrics.push(u1.opentelemetry.proto.metrics.v1.ResourceMetrics.decode($, $.uint32()));
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.resourceMetrics != null && $.hasOwnProperty("resourceMetrics")) {
                                    if (!Array.isArray($.resourceMetrics)) return "resourceMetrics: array expected";
                                    for (var O = 0; O < $.resourceMetrics.length; ++O) {
                                        var _ = u1.opentelemetry.proto.metrics.v1.ResourceMetrics.verify($.resourceMetrics[O]);
                                        if (_) return "resourceMetrics." + _
                                    }
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest) return $;
                                var O = new u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
                                if ($.resourceMetrics) {
                                    if (!Array.isArray($.resourceMetrics)) throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: array expected");
                                    O.resourceMetrics = [];
                                    for (var _ = 0; _ < $.resourceMetrics.length; ++_) {
                                        if (typeof $.resourceMetrics[_] !== "object") throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: object expected");
                                        O.resourceMetrics[_] = u1.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject($.resourceMetrics[_])
                                    }
                                }
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.arrays || O.defaults) _.resourceMetrics = [];
                                if ($.resourceMetrics && $.resourceMetrics.length) {
                                    _.resourceMetrics = [];
                                    for (var J = 0; J < $.resourceMetrics.length; ++J) _.resourceMetrics[J] = u1.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject($.resourceMetrics[J], O)
                                }
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest"
                            }, w
                        }(), z.ExportMetricsServiceResponse = function() {
                            function w(H) {
                                if (H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.partialSuccess = null, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.partialSuccess != null && Object.hasOwnProperty.call($, "partialSuccess")) u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.encode($.partialSuccess, O.uint32(10).fork()).ldelim();
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            X.partialSuccess = u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.decode($, $.uint32());
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.partialSuccess != null && $.hasOwnProperty("partialSuccess")) {
                                    var O = u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.verify($.partialSuccess);
                                    if (O) return "partialSuccess." + O
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse) return $;
                                var O = new u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;
                                if ($.partialSuccess != null) {
                                    if (typeof $.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse.partialSuccess: object expected");
                                    O.partialSuccess = u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.fromObject($.partialSuccess)
                                }
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.defaults) _.partialSuccess = null;
                                if ($.partialSuccess != null && $.hasOwnProperty("partialSuccess")) _.partialSuccess = u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.toObject($.partialSuccess, O);
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse"
                            }, w
                        }(), z.ExportMetricsPartialSuccess = function() {
                            function w(H) {
                                if (H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.rejectedDataPoints = null, w.prototype.errorMessage = null, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.rejectedDataPoints != null && Object.hasOwnProperty.call($, "rejectedDataPoints")) O.uint32(8).int64($.rejectedDataPoints);
                                if ($.errorMessage != null && Object.hasOwnProperty.call($, "errorMessage")) O.uint32(18).string($.errorMessage);
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            X.rejectedDataPoints = $.int64();
                                            break
                                        }
                                        case 2: {
                                            X.errorMessage = $.string();
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.rejectedDataPoints != null && $.hasOwnProperty("rejectedDataPoints")) {
                                    if (!g1.isInteger($.rejectedDataPoints) && !($.rejectedDataPoints && g1.isInteger($.rejectedDataPoints.low) && g1.isInteger($.rejectedDataPoints.high))) return "rejectedDataPoints: integer|Long expected"
                                }
                                if ($.errorMessage != null && $.hasOwnProperty("errorMessage")) {
                                    if (!g1.isString($.errorMessage)) return "errorMessage: string expected"
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess) return $;
                                var O = new u1.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;
                                if ($.rejectedDataPoints != null) {
                                    if (g1.Long)(O.rejectedDataPoints = g1.Long.fromValue($.rejectedDataPoints)).unsigned = !1;
                                    else if (typeof $.rejectedDataPoints === "string") O.rejectedDataPoints = parseInt($.rejectedDataPoints, 10);
                                    else if (typeof $.rejectedDataPoints === "number") O.rejectedDataPoints = $.rejectedDataPoints;
                                    else if (typeof $.rejectedDataPoints === "object") O.rejectedDataPoints = new g1.LongBits($.rejectedDataPoints.low >>> 0, $.rejectedDataPoints.high >>> 0).toNumber()
                                }
                                if ($.errorMessage != null) O.errorMessage = String($.errorMessage);
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.defaults) {
                                    if (g1.Long) {
                                        var J = new g1.Long(0, 0, !1);
                                        _.rejectedDataPoints = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                    } else _.rejectedDataPoints = O.longs === String ? "0" : 0;
                                    _.errorMessage = ""
                                }
                                if ($.rejectedDataPoints != null && $.hasOwnProperty("rejectedDataPoints"))
                                    if (typeof $.rejectedDataPoints === "number") _.rejectedDataPoints = O.longs === String ? String($.rejectedDataPoints) : $.rejectedDataPoints;
                                    else _.rejectedDataPoints = O.longs === String ? g1.Long.prototype.toString.call($.rejectedDataPoints) : O.longs === Number ? new g1.LongBits($.rejectedDataPoints.low >>> 0, $.rejectedDataPoints.high >>> 0).toNumber() : $.rejectedDataPoints;
                                if ($.errorMessage != null && $.hasOwnProperty("errorMessage")) _.errorMessage = $.errorMessage;
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess"
                            }, w
                        }(), z
                    }(), Y
                }(), K.logs = function() {
                    var Y = {};
                    return Y.v1 = function() {
                        var z = {};
                        return z.LogsService = function() {
                            function w(H, $, O) {
                                JK.rpc.Service.call(this, H, $, O)
                            }
                            return (w.prototype = Object.create(JK.rpc.Service.prototype)).constructor = w, w.create = function($, O, _) {
                                return new this($, O, _)
                            }, Object.defineProperty(w.prototype.export = function H($, O) {
                                return this.rpcCall(H, u1.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest, u1.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse, $, O)
                            }, "name", {
                                value: "Export"
                            }), w
                        }(), z.ExportLogsServiceRequest = function() {
                            function w(H) {
                                if (this.resourceLogs = [], H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.resourceLogs = g1.emptyArray, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.resourceLogs != null && $.resourceLogs.length)
                                    for (var _ = 0; _ < $.resourceLogs.length; ++_) u1.opentelemetry.proto.logs.v1.ResourceLogs.encode($.resourceLogs[_], O.uint32(10).fork()).ldelim();
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            if (!(X.resourceLogs && X.resourceLogs.length)) X.resourceLogs = [];
                                            X.resourceLogs.push(u1.opentelemetry.proto.logs.v1.ResourceLogs.decode($, $.uint32()));
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.resourceLogs != null && $.hasOwnProperty("resourceLogs")) {
                                    if (!Array.isArray($.resourceLogs)) return "resourceLogs: array expected";
                                    for (var O = 0; O < $.resourceLogs.length; ++O) {
                                        var _ = u1.opentelemetry.proto.logs.v1.ResourceLogs.verify($.resourceLogs[O]);
                                        if (_) return "resourceLogs." + _
                                    }
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest) return $;
                                var O = new u1.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
                                if ($.resourceLogs) {
                                    if (!Array.isArray($.resourceLogs)) throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: array expected");
                                    O.resourceLogs = [];
                                    for (var _ = 0; _ < $.resourceLogs.length; ++_) {
                                        if (typeof $.resourceLogs[_] !== "object") throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: object expected");
                                        O.resourceLogs[_] = u1.opentelemetry.proto.logs.v1.ResourceLogs.fromObject($.resourceLogs[_])
                                    }
                                }
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.arrays || O.defaults) _.resourceLogs = [];
                                if ($.resourceLogs && $.resourceLogs.length) {
                                    _.resourceLogs = [];
                                    for (var J = 0; J < $.resourceLogs.length; ++J) _.resourceLogs[J] = u1.opentelemetry.proto.logs.v1.ResourceLogs.toObject($.resourceLogs[J], O)
                                }
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest"
                            }, w
                        }(), z.ExportLogsServiceResponse = function() {
                            function w(H) {
                                if (H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.partialSuccess = null, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.partialSuccess != null && Object.hasOwnProperty.call($, "partialSuccess")) u1.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.encode($.partialSuccess, O.uint32(10).fork()).ldelim();
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            X.partialSuccess = u1.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.decode($, $.uint32());
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.partialSuccess != null && $.hasOwnProperty("partialSuccess")) {
                                    var O = u1.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.verify($.partialSuccess);
                                    if (O) return "partialSuccess." + O
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse) return $;
                                var O = new u1.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;
                                if ($.partialSuccess != null) {
                                    if (typeof $.partialSuccess !== "object") throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse.partialSuccess: object expected");
                                    O.partialSuccess = u1.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.fromObject($.partialSuccess)
                                }
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.defaults) _.partialSuccess = null;
                                if ($.partialSuccess != null && $.hasOwnProperty("partialSuccess")) _.partialSuccess = u1.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.toObject($.partialSuccess, O);
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse"
                            }, w
                        }(), z.ExportLogsPartialSuccess = function() {
                            function w(H) {
                                if (H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.rejectedLogRecords = null, w.prototype.errorMessage = null, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.rejectedLogRecords != null && Object.hasOwnProperty.call($, "rejectedLogRecords")) O.uint32(8).int64($.rejectedLogRecords);
                                if ($.errorMessage != null && Object.hasOwnProperty.call($, "errorMessage")) O.uint32(18).string($.errorMessage);
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            X.rejectedLogRecords = $.int64();
                                            break
                                        }
                                        case 2: {
                                            X.errorMessage = $.string();
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.rejectedLogRecords != null && $.hasOwnProperty("rejectedLogRecords")) {
                                    if (!g1.isInteger($.rejectedLogRecords) && !($.rejectedLogRecords && g1.isInteger($.rejectedLogRecords.low) && g1.isInteger($.rejectedLogRecords.high))) return "rejectedLogRecords: integer|Long expected"
                                }
                                if ($.errorMessage != null && $.hasOwnProperty("errorMessage")) {
                                    if (!g1.isString($.errorMessage)) return "errorMessage: string expected"
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess) return $;
                                var O = new u1.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;
                                if ($.rejectedLogRecords != null) {
                                    if (g1.Long)(O.rejectedLogRecords = g1.Long.fromValue($.rejectedLogRecords)).unsigned = !1;
                                    else if (typeof $.rejectedLogRecords === "string") O.rejectedLogRecords = parseInt($.rejectedLogRecords, 10);
                                    else if (typeof $.rejectedLogRecords === "number") O.rejectedLogRecords = $.rejectedLogRecords;
                                    else if (typeof $.rejectedLogRecords === "object") O.rejectedLogRecords = new g1.LongBits($.rejectedLogRecords.low >>> 0, $.rejectedLogRecords.high >>> 0).toNumber()
                                }
                                if ($.errorMessage != null) O.errorMessage = String($.errorMessage);
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.defaults) {
                                    if (g1.Long) {
                                        var J = new g1.Long(0, 0, !1);
                                        _.rejectedLogRecords = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                    } else _.rejectedLogRecords = O.longs === String ? "0" : 0;
                                    _.errorMessage = ""
                                }
                                if ($.rejectedLogRecords != null && $.hasOwnProperty("rejectedLogRecords"))
                                    if (typeof $.rejectedLogRecords === "number") _.rejectedLogRecords = O.longs === String ? String($.rejectedLogRecords) : $.rejectedLogRecords;
                                    else _.rejectedLogRecords = O.longs === String ? g1.Long.prototype.toString.call($.rejectedLogRecords) : O.longs === Number ? new g1.LongBits($.rejectedLogRecords.low >>> 0, $.rejectedLogRecords.high >>> 0).toNumber() : $.rejectedLogRecords;
                                if ($.errorMessage != null && $.hasOwnProperty("errorMessage")) _.errorMessage = $.errorMessage;
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess"
                            }, w
                        }(), z
                    }(), Y
                }(), K
            }(), q.metrics = function() {
                var K = {};
                return K.v1 = function() {
                    var Y = {};
                    return Y.MetricsData = function() {
                        function z(w) {
                            if (this.resourceMetrics = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.resourceMetrics = g1.emptyArray, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.resourceMetrics != null && H.resourceMetrics.length)
                                for (var O = 0; O < H.resourceMetrics.length; ++O) u1.opentelemetry.proto.metrics.v1.ResourceMetrics.encode(H.resourceMetrics[O], $.uint32(10).fork()).ldelim();
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.metrics.v1.MetricsData;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.resourceMetrics && J.resourceMetrics.length)) J.resourceMetrics = [];
                                        J.resourceMetrics.push(u1.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(H, H.uint32()));
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.resourceMetrics != null && H.hasOwnProperty("resourceMetrics")) {
                                if (!Array.isArray(H.resourceMetrics)) return "resourceMetrics: array expected";
                                for (var $ = 0; $ < H.resourceMetrics.length; ++$) {
                                    var O = u1.opentelemetry.proto.metrics.v1.ResourceMetrics.verify(H.resourceMetrics[$]);
                                    if (O) return "resourceMetrics." + O
                                }
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.metrics.v1.MetricsData) return H;
                            var $ = new u1.opentelemetry.proto.metrics.v1.MetricsData;
                            if (H.resourceMetrics) {
                                if (!Array.isArray(H.resourceMetrics)) throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: array expected");
                                $.resourceMetrics = [];
                                for (var O = 0; O < H.resourceMetrics.length; ++O) {
                                    if (typeof H.resourceMetrics[O] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: object expected");
                                    $.resourceMetrics[O] = u1.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(H.resourceMetrics[O])
                                }
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.resourceMetrics = [];
                            if (H.resourceMetrics && H.resourceMetrics.length) {
                                O.resourceMetrics = [];
                                for (var _ = 0; _ < H.resourceMetrics.length; ++_) O.resourceMetrics[_] = u1.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(H.resourceMetrics[_], $)
                            }
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.metrics.v1.MetricsData"
                        }, z
                    }(), Y.ResourceMetrics = function() {
                        function z(w) {
                            if (this.scopeMetrics = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.resource = null, z.prototype.scopeMetrics = g1.emptyArray, z.prototype.schemaUrl = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.resource != null && Object.hasOwnProperty.call(H, "resource")) u1.opentelemetry.proto.resource.v1.Resource.encode(H.resource, $.uint32(10).fork()).ldelim();
                            if (H.scopeMetrics != null && H.scopeMetrics.length)
                                for (var O = 0; O < H.scopeMetrics.length; ++O) u1.opentelemetry.proto.metrics.v1.ScopeMetrics.encode(H.scopeMetrics[O], $.uint32(18).fork()).ldelim();
                            if (H.schemaUrl != null && Object.hasOwnProperty.call(H, "schemaUrl")) $.uint32(26).string(H.schemaUrl);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.metrics.v1.ResourceMetrics;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.resource = u1.opentelemetry.proto.resource.v1.Resource.decode(H, H.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(J.scopeMetrics && J.scopeMetrics.length)) J.scopeMetrics = [];
                                        J.scopeMetrics.push(u1.opentelemetry.proto.metrics.v1.ScopeMetrics.decode(H, H.uint32()));
                                        break
                                    }
                                    case 3: {
                                        J.schemaUrl = H.string();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.resource != null && H.hasOwnProperty("resource")) {
                                var $ = u1.opentelemetry.proto.resource.v1.Resource.verify(H.resource);
                                if ($) return "resource." + $
                            }
                            if (H.scopeMetrics != null && H.hasOwnProperty("scopeMetrics")) {
                                if (!Array.isArray(H.scopeMetrics)) return "scopeMetrics: array expected";
                                for (var O = 0; O < H.scopeMetrics.length; ++O) {
                                    var $ = u1.opentelemetry.proto.metrics.v1.ScopeMetrics.verify(H.scopeMetrics[O]);
                                    if ($) return "scopeMetrics." + $
                                }
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) {
                                if (!g1.isString(H.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.metrics.v1.ResourceMetrics) return H;
                            var $ = new u1.opentelemetry.proto.metrics.v1.ResourceMetrics;
                            if (H.resource != null) {
                                if (typeof H.resource !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.resource: object expected");
                                $.resource = u1.opentelemetry.proto.resource.v1.Resource.fromObject(H.resource)
                            }
                            if (H.scopeMetrics) {
                                if (!Array.isArray(H.scopeMetrics)) throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: array expected");
                                $.scopeMetrics = [];
                                for (var O = 0; O < H.scopeMetrics.length; ++O) {
                                    if (typeof H.scopeMetrics[O] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: object expected");
                                    $.scopeMetrics[O] = u1.opentelemetry.proto.metrics.v1.ScopeMetrics.fromObject(H.scopeMetrics[O])
                                }
                            }
                            if (H.schemaUrl != null) $.schemaUrl = String(H.schemaUrl);
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.scopeMetrics = [];
                            if ($.defaults) O.resource = null, O.schemaUrl = "";
                            if (H.resource != null && H.hasOwnProperty("resource")) O.resource = u1.opentelemetry.proto.resource.v1.Resource.toObject(H.resource, $);
                            if (H.scopeMetrics && H.scopeMetrics.length) {
                                O.scopeMetrics = [];
                                for (var _ = 0; _ < H.scopeMetrics.length; ++_) O.scopeMetrics[_] = u1.opentelemetry.proto.metrics.v1.ScopeMetrics.toObject(H.scopeMetrics[_], $)
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) O.schemaUrl = H.schemaUrl;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.metrics.v1.ResourceMetrics"
                        }, z
                    }(), Y.ScopeMetrics = function() {
                        function z(w) {
                            if (this.metrics = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.scope = null, z.prototype.metrics = g1.emptyArray, z.prototype.schemaUrl = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.scope != null && Object.hasOwnProperty.call(H, "scope")) u1.opentelemetry.proto.common.v1.InstrumentationScope.encode(H.scope, $.uint32(10).fork()).ldelim();
                            if (H.metrics != null && H.metrics.length)
                                for (var O = 0; O < H.metrics.length; ++O) u1.opentelemetry.proto.metrics.v1.Metric.encode(H.metrics[O], $.uint32(18).fork()).ldelim();
                            if (H.schemaUrl != null && Object.hasOwnProperty.call(H, "schemaUrl")) $.uint32(26).string(H.schemaUrl);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.metrics.v1.ScopeMetrics;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.scope = u1.opentelemetry.proto.common.v1.InstrumentationScope.decode(H, H.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(J.metrics && J.metrics.length)) J.metrics = [];
                                        J.metrics.push(u1.opentelemetry.proto.metrics.v1.Metric.decode(H, H.uint32()));
                                        break
                                    }
                                    case 3: {
                                        J.schemaUrl = H.string();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.scope != null && H.hasOwnProperty("scope")) {
                                var $ = u1.opentelemetry.proto.common.v1.InstrumentationScope.verify(H.scope);
                                if ($) return "scope." + $
                            }
                            if (H.metrics != null && H.hasOwnProperty("metrics")) {
                                if (!Array.isArray(H.metrics)) return "metrics: array expected";
                                for (var O = 0; O < H.metrics.length; ++O) {
                                    var $ = u1.opentelemetry.proto.metrics.v1.Metric.verify(H.metrics[O]);
                                    if ($) return "metrics." + $
                                }
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) {
                                if (!g1.isString(H.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.metrics.v1.ScopeMetrics) return H;
                            var $ = new u1.opentelemetry.proto.metrics.v1.ScopeMetrics;
                            if (H.scope != null) {
                                if (typeof H.scope !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.scope: object expected");
                                $.scope = u1.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(H.scope)
                            }
                            if (H.metrics) {
                                if (!Array.isArray(H.metrics)) throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: array expected");
                                $.metrics = [];
                                for (var O = 0; O < H.metrics.length; ++O) {
                                    if (typeof H.metrics[O] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: object expected");
                                    $.metrics[O] = u1.opentelemetry.proto.metrics.v1.Metric.fromObject(H.metrics[O])
                                }
                            }
                            if (H.schemaUrl != null) $.schemaUrl = String(H.schemaUrl);
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.metrics = [];
                            if ($.defaults) O.scope = null, O.schemaUrl = "";
                            if (H.scope != null && H.hasOwnProperty("scope")) O.scope = u1.opentelemetry.proto.common.v1.InstrumentationScope.toObject(H.scope, $);
                            if (H.metrics && H.metrics.length) {
                                O.metrics = [];
                                for (var _ = 0; _ < H.metrics.length; ++_) O.metrics[_] = u1.opentelemetry.proto.metrics.v1.Metric.toObject(H.metrics[_], $)
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) O.schemaUrl = H.schemaUrl;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.metrics.v1.ScopeMetrics"
                        }, z
                    }(), Y.Metric = function() {
                        function z(H) {
                            if (this.metadata = [], H) {
                                for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                    if (H[$[O]] != null) this[$[O]] = H[$[O]]
                            }
                        }
                        z.prototype.name = null, z.prototype.description = null, z.prototype.unit = null, z.prototype.gauge = null, z.prototype.sum = null, z.prototype.histogram = null, z.prototype.exponentialHistogram = null, z.prototype.summary = null, z.prototype.metadata = g1.emptyArray;
                        var w;
                        return Object.defineProperty(z.prototype, "data", {
                            get: g1.oneOfGetter(w = ["gauge", "sum", "histogram", "exponentialHistogram", "summary"]),
                            set: g1.oneOfSetter(w)
                        }), z.create = function($) {
                            return new z($)
                        }, z.encode = function($, O) {
                            if (!O) O = H5.create();
                            if ($.name != null && Object.hasOwnProperty.call($, "name")) O.uint32(10).string($.name);
                            if ($.description != null && Object.hasOwnProperty.call($, "description")) O.uint32(18).string($.description);
                            if ($.unit != null && Object.hasOwnProperty.call($, "unit")) O.uint32(26).string($.unit);
                            if ($.gauge != null && Object.hasOwnProperty.call($, "gauge")) u1.opentelemetry.proto.metrics.v1.Gauge.encode($.gauge, O.uint32(42).fork()).ldelim();
                            if ($.sum != null && Object.hasOwnProperty.call($, "sum")) u1.opentelemetry.proto.metrics.v1.Sum.encode($.sum, O.uint32(58).fork()).ldelim();
                            if ($.histogram != null && Object.hasOwnProperty.call($, "histogram")) u1.opentelemetry.proto.metrics.v1.Histogram.encode($.histogram, O.uint32(74).fork()).ldelim();
                            if ($.exponentialHistogram != null && Object.hasOwnProperty.call($, "exponentialHistogram")) u1.opentelemetry.proto.metrics.v1.ExponentialHistogram.encode($.exponentialHistogram, O.uint32(82).fork()).ldelim();
                            if ($.summary != null && Object.hasOwnProperty.call($, "summary")) u1.opentelemetry.proto.metrics.v1.Summary.encode($.summary, O.uint32(90).fork()).ldelim();
                            if ($.metadata != null && $.metadata.length)
                                for (var _ = 0; _ < $.metadata.length; ++_) u1.opentelemetry.proto.common.v1.KeyValue.encode($.metadata[_], O.uint32(98).fork()).ldelim();
                            return O
                        }, z.encodeDelimited = function($, O) {
                            return this.encode($, O).ldelim()
                        }, z.decode = function($, O, _) {
                            if (!($ instanceof $A)) $ = $A.create($);
                            var J = O === void 0 ? $.len : $.pos + O,
                                X = new u1.opentelemetry.proto.metrics.v1.Metric;
                            while ($.pos < J) {
                                var D = $.uint32();
                                if (D === _) break;
                                switch (D >>> 3) {
                                    case 1: {
                                        X.name = $.string();
                                        break
                                    }
                                    case 2: {
                                        X.description = $.string();
                                        break
                                    }
                                    case 3: {
                                        X.unit = $.string();
                                        break
                                    }
                                    case 5: {
                                        X.gauge = u1.opentelemetry.proto.metrics.v1.Gauge.decode($, $.uint32());
                                        break
                                    }
                                    case 7: {
                                        X.sum = u1.opentelemetry.proto.metrics.v1.Sum.decode($, $.uint32());
                                        break
                                    }
                                    case 9: {
                                        X.histogram = u1.opentelemetry.proto.metrics.v1.Histogram.decode($, $.uint32());
                                        break
                                    }
                                    case 10: {
                                        X.exponentialHistogram = u1.opentelemetry.proto.metrics.v1.ExponentialHistogram.decode($, $.uint32());
                                        break
                                    }
                                    case 11: {
                                        X.summary = u1.opentelemetry.proto.metrics.v1.Summary.decode($, $.uint32());
                                        break
                                    }
                                    case 12: {
                                        if (!(X.metadata && X.metadata.length)) X.metadata = [];
                                        X.metadata.push(u1.opentelemetry.proto.common.v1.KeyValue.decode($, $.uint32()));
                                        break
                                    }
                                    default:
                                        $.skipType(D & 7);
                                        break
                                }
                            }
                            return X
                        }, z.decodeDelimited = function($) {
                            if (!($ instanceof $A)) $ = new $A($);
                            return this.decode($, $.uint32())
                        }, z.verify = function($) {
                            if (typeof $ !== "object" || $ === null) return "object expected";
                            var O = {};
                            if ($.name != null && $.hasOwnProperty("name")) {
                                if (!g1.isString($.name)) return "name: string expected"
                            }
                            if ($.description != null && $.hasOwnProperty("description")) {
                                if (!g1.isString($.description)) return "description: string expected"
                            }
                            if ($.unit != null && $.hasOwnProperty("unit")) {
                                if (!g1.isString($.unit)) return "unit: string expected"
                            }
                            if ($.gauge != null && $.hasOwnProperty("gauge")) {
                                O.data = 1;
                                {
                                    var _ = u1.opentelemetry.proto.metrics.v1.Gauge.verify($.gauge);
                                    if (_) return "gauge." + _
                                }
                            }
                            if ($.sum != null && $.hasOwnProperty("sum")) {
                                if (O.data === 1) return "data: multiple values";
                                O.data = 1;
                                {
                                    var _ = u1.opentelemetry.proto.metrics.v1.Sum.verify($.sum);
                                    if (_) return "sum." + _
                                }
                            }
                            if ($.histogram != null && $.hasOwnProperty("histogram")) {
                                if (O.data === 1) return "data: multiple values";
                                O.data = 1;
                                {
                                    var _ = u1.opentelemetry.proto.metrics.v1.Histogram.verify($.histogram);
                                    if (_) return "histogram." + _
                                }
                            }
                            if ($.exponentialHistogram != null && $.hasOwnProperty("exponentialHistogram")) {
                                if (O.data === 1) return "data: multiple values";
                                O.data = 1;
                                {
                                    var _ = u1.opentelemetry.proto.metrics.v1.ExponentialHistogram.verify($.exponentialHistogram);
                                    if (_) return "exponentialHistogram." + _
                                }
                            }
                            if ($.summary != null && $.hasOwnProperty("summary")) {
                                if (O.data === 1) return "data: multiple values";
                                O.data = 1;
                                {
                                    var _ = u1.opentelemetry.proto.metrics.v1.Summary.verify($.summary);
                                    if (_) return "summary." + _
                                }
                            }
                            if ($.metadata != null && $.hasOwnProperty("metadata")) {
                                if (!Array.isArray($.metadata)) return "metadata: array expected";
                                for (var J = 0; J < $.metadata.length; ++J) {
                                    var _ = u1.opentelemetry.proto.common.v1.KeyValue.verify($.metadata[J]);
                                    if (_) return "metadata." + _
                                }
                            }
                            return null
                        }, z.fromObject = function($) {
                            if ($ instanceof u1.opentelemetry.proto.metrics.v1.Metric) return $;
                            var O = new u1.opentelemetry.proto.metrics.v1.Metric;
                            if ($.name != null) O.name = String($.name);
                            if ($.description != null) O.description = String($.description);
                            if ($.unit != null) O.unit = String($.unit);
                            if ($.gauge != null) {
                                if (typeof $.gauge !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.gauge: object expected");
                                O.gauge = u1.opentelemetry.proto.metrics.v1.Gauge.fromObject($.gauge)
                            }
                            if ($.sum != null) {
                                if (typeof $.sum !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.sum: object expected");
                                O.sum = u1.opentelemetry.proto.metrics.v1.Sum.fromObject($.sum)
                            }
                            if ($.histogram != null) {
                                if (typeof $.histogram !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.histogram: object expected");
                                O.histogram = u1.opentelemetry.proto.metrics.v1.Histogram.fromObject($.histogram)
                            }
                            if ($.exponentialHistogram != null) {
                                if (typeof $.exponentialHistogram !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.exponentialHistogram: object expected");
                                O.exponentialHistogram = u1.opentelemetry.proto.metrics.v1.ExponentialHistogram.fromObject($.exponentialHistogram)
                            }
                            if ($.summary != null) {
                                if (typeof $.summary !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.summary: object expected");
                                O.summary = u1.opentelemetry.proto.metrics.v1.Summary.fromObject($.summary)
                            }
                            if ($.metadata) {
                                if (!Array.isArray($.metadata)) throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: array expected");
                                O.metadata = [];
                                for (var _ = 0; _ < $.metadata.length; ++_) {
                                    if (typeof $.metadata[_] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: object expected");
                                    O.metadata[_] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject($.metadata[_])
                                }
                            }
                            return O
                        }, z.toObject = function($, O) {
                            if (!O) O = {};
                            var _ = {};
                            if (O.arrays || O.defaults) _.metadata = [];
                            if (O.defaults) _.name = "", _.description = "", _.unit = "";
                            if ($.name != null && $.hasOwnProperty("name")) _.name = $.name;
                            if ($.description != null && $.hasOwnProperty("description")) _.description = $.description;
                            if ($.unit != null && $.hasOwnProperty("unit")) _.unit = $.unit;
                            if ($.gauge != null && $.hasOwnProperty("gauge")) {
                                if (_.gauge = u1.opentelemetry.proto.metrics.v1.Gauge.toObject($.gauge, O), O.oneofs) _.data = "gauge"
                            }
                            if ($.sum != null && $.hasOwnProperty("sum")) {
                                if (_.sum = u1.opentelemetry.proto.metrics.v1.Sum.toObject($.sum, O), O.oneofs) _.data = "sum"
                            }
                            if ($.histogram != null && $.hasOwnProperty("histogram")) {
                                if (_.histogram = u1.opentelemetry.proto.metrics.v1.Histogram.toObject($.histogram, O), O.oneofs) _.data = "histogram"
                            }
                            if ($.exponentialHistogram != null && $.hasOwnProperty("exponentialHistogram")) {
                                if (_.exponentialHistogram = u1.opentelemetry.proto.metrics.v1.ExponentialHistogram.toObject($.exponentialHistogram, O), O.oneofs) _.data = "exponentialHistogram"
                            }
                            if ($.summary != null && $.hasOwnProperty("summary")) {
                                if (_.summary = u1.opentelemetry.proto.metrics.v1.Summary.toObject($.summary, O), O.oneofs) _.data = "summary"
                            }
                            if ($.metadata && $.metadata.length) {
                                _.metadata = [];
                                for (var J = 0; J < $.metadata.length; ++J) _.metadata[J] = u1.opentelemetry.proto.common.v1.KeyValue.toObject($.metadata[J], O)
                            }
                            return _
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function($) {
                            if ($ === void 0) $ = "type.googleapis.com";
                            return $ + "/opentelemetry.proto.metrics.v1.Metric"
                        }, z
                    }(), Y.Gauge = function() {
                        function z(w) {
                            if (this.dataPoints = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.dataPoints = g1.emptyArray, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.dataPoints != null && H.dataPoints.length)
                                for (var O = 0; O < H.dataPoints.length; ++O) u1.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(H.dataPoints[O], $.uint32(10).fork()).ldelim();
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.metrics.v1.Gauge;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.dataPoints && J.dataPoints.length)) J.dataPoints = [];
                                        J.dataPoints.push(u1.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(H, H.uint32()));
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.dataPoints != null && H.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(H.dataPoints)) return "dataPoints: array expected";
                                for (var $ = 0; $ < H.dataPoints.length; ++$) {
                                    var O = u1.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(H.dataPoints[$]);
                                    if (O) return "dataPoints." + O
                                }
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.metrics.v1.Gauge) return H;
                            var $ = new u1.opentelemetry.proto.metrics.v1.Gauge;
                            if (H.dataPoints) {
                                if (!Array.isArray(H.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: array expected");
                                $.dataPoints = [];
                                for (var O = 0; O < H.dataPoints.length; ++O) {
                                    if (typeof H.dataPoints[O] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: object expected");
                                    $.dataPoints[O] = u1.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(H.dataPoints[O])
                                }
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.dataPoints = [];
                            if (H.dataPoints && H.dataPoints.length) {
                                O.dataPoints = [];
                                for (var _ = 0; _ < H.dataPoints.length; ++_) O.dataPoints[_] = u1.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(H.dataPoints[_], $)
                            }
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.metrics.v1.Gauge"
                        }, z
                    }(), Y.Sum = function() {
                        function z(w) {
                            if (this.dataPoints = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.dataPoints = g1.emptyArray, z.prototype.aggregationTemporality = null, z.prototype.isMonotonic = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.dataPoints != null && H.dataPoints.length)
                                for (var O = 0; O < H.dataPoints.length; ++O) u1.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(H.dataPoints[O], $.uint32(10).fork()).ldelim();
                            if (H.aggregationTemporality != null && Object.hasOwnProperty.call(H, "aggregationTemporality")) $.uint32(16).int32(H.aggregationTemporality);
                            if (H.isMonotonic != null && Object.hasOwnProperty.call(H, "isMonotonic")) $.uint32(24).bool(H.isMonotonic);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.metrics.v1.Sum;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.dataPoints && J.dataPoints.length)) J.dataPoints = [];
                                        J.dataPoints.push(u1.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(H, H.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.aggregationTemporality = H.int32();
                                        break
                                    }
                                    case 3: {
                                        J.isMonotonic = H.bool();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.dataPoints != null && H.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(H.dataPoints)) return "dataPoints: array expected";
                                for (var $ = 0; $ < H.dataPoints.length; ++$) {
                                    var O = u1.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(H.dataPoints[$]);
                                    if (O) return "dataPoints." + O
                                }
                            }
                            if (H.aggregationTemporality != null && H.hasOwnProperty("aggregationTemporality")) switch (H.aggregationTemporality) {
                                default:
                                    return "aggregationTemporality: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            if (H.isMonotonic != null && H.hasOwnProperty("isMonotonic")) {
                                if (typeof H.isMonotonic !== "boolean") return "isMonotonic: boolean expected"
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.metrics.v1.Sum) return H;
                            var $ = new u1.opentelemetry.proto.metrics.v1.Sum;
                            if (H.dataPoints) {
                                if (!Array.isArray(H.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: array expected");
                                $.dataPoints = [];
                                for (var O = 0; O < H.dataPoints.length; ++O) {
                                    if (typeof H.dataPoints[O] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: object expected");
                                    $.dataPoints[O] = u1.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(H.dataPoints[O])
                                }
                            }
                            switch (H.aggregationTemporality) {
                                default:
                                    if (typeof H.aggregationTemporality === "number") {
                                        $.aggregationTemporality = H.aggregationTemporality;
                                        break
                                    }
                                    break;
                                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                                case 0:
                                    $.aggregationTemporality = 0;
                                    break;
                                case "AGGREGATION_TEMPORALITY_DELTA":
                                case 1:
                                    $.aggregationTemporality = 1;
                                    break;
                                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                                case 2:
                                    $.aggregationTemporality = 2;
                                    break
                            }
                            if (H.isMonotonic != null) $.isMonotonic = Boolean(H.isMonotonic);
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.dataPoints = [];
                            if ($.defaults) O.aggregationTemporality = $.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0, O.isMonotonic = !1;
                            if (H.dataPoints && H.dataPoints.length) {
                                O.dataPoints = [];
                                for (var _ = 0; _ < H.dataPoints.length; ++_) O.dataPoints[_] = u1.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(H.dataPoints[_], $)
                            }
                            if (H.aggregationTemporality != null && H.hasOwnProperty("aggregationTemporality")) O.aggregationTemporality = $.enums === String ? u1.opentelemetry.proto.metrics.v1.AggregationTemporality[H.aggregationTemporality] === void 0 ? H.aggregationTemporality : u1.opentelemetry.proto.metrics.v1.AggregationTemporality[H.aggregationTemporality] : H.aggregationTemporality;
                            if (H.isMonotonic != null && H.hasOwnProperty("isMonotonic")) O.isMonotonic = H.isMonotonic;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.metrics.v1.Sum"
                        }, z
                    }(), Y.Histogram = function() {
                        function z(w) {
                            if (this.dataPoints = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.dataPoints = g1.emptyArray, z.prototype.aggregationTemporality = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.dataPoints != null && H.dataPoints.length)
                                for (var O = 0; O < H.dataPoints.length; ++O) u1.opentelemetry.proto.metrics.v1.HistogramDataPoint.encode(H.dataPoints[O], $.uint32(10).fork()).ldelim();
                            if (H.aggregationTemporality != null && Object.hasOwnProperty.call(H, "aggregationTemporality")) $.uint32(16).int32(H.aggregationTemporality);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.metrics.v1.Histogram;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.dataPoints && J.dataPoints.length)) J.dataPoints = [];
                                        J.dataPoints.push(u1.opentelemetry.proto.metrics.v1.HistogramDataPoint.decode(H, H.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.aggregationTemporality = H.int32();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.dataPoints != null && H.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(H.dataPoints)) return "dataPoints: array expected";
                                for (var $ = 0; $ < H.dataPoints.length; ++$) {
                                    var O = u1.opentelemetry.proto.metrics.v1.HistogramDataPoint.verify(H.dataPoints[$]);
                                    if (O) return "dataPoints." + O
                                }
                            }
                            if (H.aggregationTemporality != null && H.hasOwnProperty("aggregationTemporality")) switch (H.aggregationTemporality) {
                                default:
                                    return "aggregationTemporality: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.metrics.v1.Histogram) return H;
                            var $ = new u1.opentelemetry.proto.metrics.v1.Histogram;
                            if (H.dataPoints) {
                                if (!Array.isArray(H.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: array expected");
                                $.dataPoints = [];
                                for (var O = 0; O < H.dataPoints.length; ++O) {
                                    if (typeof H.dataPoints[O] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: object expected");
                                    $.dataPoints[O] = u1.opentelemetry.proto.metrics.v1.HistogramDataPoint.fromObject(H.dataPoints[O])
                                }
                            }
                            switch (H.aggregationTemporality) {
                                default:
                                    if (typeof H.aggregationTemporality === "number") {
                                        $.aggregationTemporality = H.aggregationTemporality;
                                        break
                                    }
                                    break;
                                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                                case 0:
                                    $.aggregationTemporality = 0;
                                    break;
                                case "AGGREGATION_TEMPORALITY_DELTA":
                                case 1:
                                    $.aggregationTemporality = 1;
                                    break;
                                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                                case 2:
                                    $.aggregationTemporality = 2;
                                    break
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.dataPoints = [];
                            if ($.defaults) O.aggregationTemporality = $.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
                            if (H.dataPoints && H.dataPoints.length) {
                                O.dataPoints = [];
                                for (var _ = 0; _ < H.dataPoints.length; ++_) O.dataPoints[_] = u1.opentelemetry.proto.metrics.v1.HistogramDataPoint.toObject(H.dataPoints[_], $)
                            }
                            if (H.aggregationTemporality != null && H.hasOwnProperty("aggregationTemporality")) O.aggregationTemporality = $.enums === String ? u1.opentelemetry.proto.metrics.v1.AggregationTemporality[H.aggregationTemporality] === void 0 ? H.aggregationTemporality : u1.opentelemetry.proto.metrics.v1.AggregationTemporality[H.aggregationTemporality] : H.aggregationTemporality;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.metrics.v1.Histogram"
                        }, z
                    }(), Y.ExponentialHistogram = function() {
                        function z(w) {
                            if (this.dataPoints = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.dataPoints = g1.emptyArray, z.prototype.aggregationTemporality = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.dataPoints != null && H.dataPoints.length)
                                for (var O = 0; O < H.dataPoints.length; ++O) u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.encode(H.dataPoints[O], $.uint32(10).fork()).ldelim();
                            if (H.aggregationTemporality != null && Object.hasOwnProperty.call(H, "aggregationTemporality")) $.uint32(16).int32(H.aggregationTemporality);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.metrics.v1.ExponentialHistogram;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.dataPoints && J.dataPoints.length)) J.dataPoints = [];
                                        J.dataPoints.push(u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.decode(H, H.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.aggregationTemporality = H.int32();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.dataPoints != null && H.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(H.dataPoints)) return "dataPoints: array expected";
                                for (var $ = 0; $ < H.dataPoints.length; ++$) {
                                    var O = u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.verify(H.dataPoints[$]);
                                    if (O) return "dataPoints." + O
                                }
                            }
                            if (H.aggregationTemporality != null && H.hasOwnProperty("aggregationTemporality")) switch (H.aggregationTemporality) {
                                default:
                                    return "aggregationTemporality: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                    break
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.metrics.v1.ExponentialHistogram) return H;
                            var $ = new u1.opentelemetry.proto.metrics.v1.ExponentialHistogram;
                            if (H.dataPoints) {
                                if (!Array.isArray(H.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: array expected");
                                $.dataPoints = [];
                                for (var O = 0; O < H.dataPoints.length; ++O) {
                                    if (typeof H.dataPoints[O] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: object expected");
                                    $.dataPoints[O] = u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.fromObject(H.dataPoints[O])
                                }
                            }
                            switch (H.aggregationTemporality) {
                                default:
                                    if (typeof H.aggregationTemporality === "number") {
                                        $.aggregationTemporality = H.aggregationTemporality;
                                        break
                                    }
                                    break;
                                case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                                case 0:
                                    $.aggregationTemporality = 0;
                                    break;
                                case "AGGREGATION_TEMPORALITY_DELTA":
                                case 1:
                                    $.aggregationTemporality = 1;
                                    break;
                                case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                                case 2:
                                    $.aggregationTemporality = 2;
                                    break
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.dataPoints = [];
                            if ($.defaults) O.aggregationTemporality = $.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
                            if (H.dataPoints && H.dataPoints.length) {
                                O.dataPoints = [];
                                for (var _ = 0; _ < H.dataPoints.length; ++_) O.dataPoints[_] = u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.toObject(H.dataPoints[_], $)
                            }
                            if (H.aggregationTemporality != null && H.hasOwnProperty("aggregationTemporality")) O.aggregationTemporality = $.enums === String ? u1.opentelemetry.proto.metrics.v1.AggregationTemporality[H.aggregationTemporality] === void 0 ? H.aggregationTemporality : u1.opentelemetry.proto.metrics.v1.AggregationTemporality[H.aggregationTemporality] : H.aggregationTemporality;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.metrics.v1.ExponentialHistogram"
                        }, z
                    }(), Y.Summary = function() {
                        function z(w) {
                            if (this.dataPoints = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.dataPoints = g1.emptyArray, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.dataPoints != null && H.dataPoints.length)
                                for (var O = 0; O < H.dataPoints.length; ++O) u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.encode(H.dataPoints[O], $.uint32(10).fork()).ldelim();
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.metrics.v1.Summary;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.dataPoints && J.dataPoints.length)) J.dataPoints = [];
                                        J.dataPoints.push(u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.decode(H, H.uint32()));
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.dataPoints != null && H.hasOwnProperty("dataPoints")) {
                                if (!Array.isArray(H.dataPoints)) return "dataPoints: array expected";
                                for (var $ = 0; $ < H.dataPoints.length; ++$) {
                                    var O = u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.verify(H.dataPoints[$]);
                                    if (O) return "dataPoints." + O
                                }
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.metrics.v1.Summary) return H;
                            var $ = new u1.opentelemetry.proto.metrics.v1.Summary;
                            if (H.dataPoints) {
                                if (!Array.isArray(H.dataPoints)) throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: array expected");
                                $.dataPoints = [];
                                for (var O = 0; O < H.dataPoints.length; ++O) {
                                    if (typeof H.dataPoints[O] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: object expected");
                                    $.dataPoints[O] = u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.fromObject(H.dataPoints[O])
                                }
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.dataPoints = [];
                            if (H.dataPoints && H.dataPoints.length) {
                                O.dataPoints = [];
                                for (var _ = 0; _ < H.dataPoints.length; ++_) O.dataPoints[_] = u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.toObject(H.dataPoints[_], $)
                            }
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.metrics.v1.Summary"
                        }, z
                    }(), Y.AggregationTemporality = function() {
                        var z = {},
                            w = Object.create(z);
                        return w[z[0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED"] = 0, w[z[1] = "AGGREGATION_TEMPORALITY_DELTA"] = 1, w[z[2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"] = 2, w
                    }(), Y.DataPointFlags = function() {
                        var z = {},
                            w = Object.create(z);
                        return w[z[0] = "DATA_POINT_FLAGS_DO_NOT_USE"] = 0, w[z[1] = "DATA_POINT_FLAGS_NO_RECORDED_VALUE_MASK"] = 1, w
                    }(), Y.NumberDataPoint = function() {
                        function z(H) {
                            if (this.attributes = [], this.exemplars = [], H) {
                                for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                    if (H[$[O]] != null) this[$[O]] = H[$[O]]
                            }
                        }
                        z.prototype.attributes = g1.emptyArray, z.prototype.startTimeUnixNano = null, z.prototype.timeUnixNano = null, z.prototype.asDouble = null, z.prototype.asInt = null, z.prototype.exemplars = g1.emptyArray, z.prototype.flags = null;
                        var w;
                        return Object.defineProperty(z.prototype, "value", {
                            get: g1.oneOfGetter(w = ["asDouble", "asInt"]),
                            set: g1.oneOfSetter(w)
                        }), z.create = function($) {
                            return new z($)
                        }, z.encode = function($, O) {
                            if (!O) O = H5.create();
                            if ($.startTimeUnixNano != null && Object.hasOwnProperty.call($, "startTimeUnixNano")) O.uint32(17).fixed64($.startTimeUnixNano);
                            if ($.timeUnixNano != null && Object.hasOwnProperty.call($, "timeUnixNano")) O.uint32(25).fixed64($.timeUnixNano);
                            if ($.asDouble != null && Object.hasOwnProperty.call($, "asDouble")) O.uint32(33).double($.asDouble);
                            if ($.exemplars != null && $.exemplars.length)
                                for (var _ = 0; _ < $.exemplars.length; ++_) u1.opentelemetry.proto.metrics.v1.Exemplar.encode($.exemplars[_], O.uint32(42).fork()).ldelim();
                            if ($.asInt != null && Object.hasOwnProperty.call($, "asInt")) O.uint32(49).sfixed64($.asInt);
                            if ($.attributes != null && $.attributes.length)
                                for (var _ = 0; _ < $.attributes.length; ++_) u1.opentelemetry.proto.common.v1.KeyValue.encode($.attributes[_], O.uint32(58).fork()).ldelim();
                            if ($.flags != null && Object.hasOwnProperty.call($, "flags")) O.uint32(64).uint32($.flags);
                            return O
                        }, z.encodeDelimited = function($, O) {
                            return this.encode($, O).ldelim()
                        }, z.decode = function($, O, _) {
                            if (!($ instanceof $A)) $ = $A.create($);
                            var J = O === void 0 ? $.len : $.pos + O,
                                X = new u1.opentelemetry.proto.metrics.v1.NumberDataPoint;
                            while ($.pos < J) {
                                var D = $.uint32();
                                if (D === _) break;
                                switch (D >>> 3) {
                                    case 7: {
                                        if (!(X.attributes && X.attributes.length)) X.attributes = [];
                                        X.attributes.push(u1.opentelemetry.proto.common.v1.KeyValue.decode($, $.uint32()));
                                        break
                                    }
                                    case 2: {
                                        X.startTimeUnixNano = $.fixed64();
                                        break
                                    }
                                    case 3: {
                                        X.timeUnixNano = $.fixed64();
                                        break
                                    }
                                    case 4: {
                                        X.asDouble = $.double();
                                        break
                                    }
                                    case 6: {
                                        X.asInt = $.sfixed64();
                                        break
                                    }
                                    case 5: {
                                        if (!(X.exemplars && X.exemplars.length)) X.exemplars = [];
                                        X.exemplars.push(u1.opentelemetry.proto.metrics.v1.Exemplar.decode($, $.uint32()));
                                        break
                                    }
                                    case 8: {
                                        X.flags = $.uint32();
                                        break
                                    }
                                    default:
                                        $.skipType(D & 7);
                                        break
                                }
                            }
                            return X
                        }, z.decodeDelimited = function($) {
                            if (!($ instanceof $A)) $ = new $A($);
                            return this.decode($, $.uint32())
                        }, z.verify = function($) {
                            if (typeof $ !== "object" || $ === null) return "object expected";
                            var O = {};
                            if ($.attributes != null && $.hasOwnProperty("attributes")) {
                                if (!Array.isArray($.attributes)) return "attributes: array expected";
                                for (var _ = 0; _ < $.attributes.length; ++_) {
                                    var J = u1.opentelemetry.proto.common.v1.KeyValue.verify($.attributes[_]);
                                    if (J) return "attributes." + J
                                }
                            }
                            if ($.startTimeUnixNano != null && $.hasOwnProperty("startTimeUnixNano")) {
                                if (!g1.isInteger($.startTimeUnixNano) && !($.startTimeUnixNano && g1.isInteger($.startTimeUnixNano.low) && g1.isInteger($.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if ($.timeUnixNano != null && $.hasOwnProperty("timeUnixNano")) {
                                if (!g1.isInteger($.timeUnixNano) && !($.timeUnixNano && g1.isInteger($.timeUnixNano.low) && g1.isInteger($.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if ($.asDouble != null && $.hasOwnProperty("asDouble")) {
                                if (O.value = 1, typeof $.asDouble !== "number") return "asDouble: number expected"
                            }
                            if ($.asInt != null && $.hasOwnProperty("asInt")) {
                                if (O.value === 1) return "value: multiple values";
                                if (O.value = 1, !g1.isInteger($.asInt) && !($.asInt && g1.isInteger($.asInt.low) && g1.isInteger($.asInt.high))) return "asInt: integer|Long expected"
                            }
                            if ($.exemplars != null && $.hasOwnProperty("exemplars")) {
                                if (!Array.isArray($.exemplars)) return "exemplars: array expected";
                                for (var _ = 0; _ < $.exemplars.length; ++_) {
                                    var J = u1.opentelemetry.proto.metrics.v1.Exemplar.verify($.exemplars[_]);
                                    if (J) return "exemplars." + J
                                }
                            }
                            if ($.flags != null && $.hasOwnProperty("flags")) {
                                if (!g1.isInteger($.flags)) return "flags: integer expected"
                            }
                            return null
                        }, z.fromObject = function($) {
                            if ($ instanceof u1.opentelemetry.proto.metrics.v1.NumberDataPoint) return $;
                            var O = new u1.opentelemetry.proto.metrics.v1.NumberDataPoint;
                            if ($.attributes) {
                                if (!Array.isArray($.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: array expected");
                                O.attributes = [];
                                for (var _ = 0; _ < $.attributes.length; ++_) {
                                    if (typeof $.attributes[_] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: object expected");
                                    O.attributes[_] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject($.attributes[_])
                                }
                            }
                            if ($.startTimeUnixNano != null) {
                                if (g1.Long)(O.startTimeUnixNano = g1.Long.fromValue($.startTimeUnixNano)).unsigned = !1;
                                else if (typeof $.startTimeUnixNano === "string") O.startTimeUnixNano = parseInt($.startTimeUnixNano, 10);
                                else if (typeof $.startTimeUnixNano === "number") O.startTimeUnixNano = $.startTimeUnixNano;
                                else if (typeof $.startTimeUnixNano === "object") O.startTimeUnixNano = new g1.LongBits($.startTimeUnixNano.low >>> 0, $.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if ($.timeUnixNano != null) {
                                if (g1.Long)(O.timeUnixNano = g1.Long.fromValue($.timeUnixNano)).unsigned = !1;
                                else if (typeof $.timeUnixNano === "string") O.timeUnixNano = parseInt($.timeUnixNano, 10);
                                else if (typeof $.timeUnixNano === "number") O.timeUnixNano = $.timeUnixNano;
                                else if (typeof $.timeUnixNano === "object") O.timeUnixNano = new g1.LongBits($.timeUnixNano.low >>> 0, $.timeUnixNano.high >>> 0).toNumber()
                            }
                            if ($.asDouble != null) O.asDouble = Number($.asDouble);
                            if ($.asInt != null) {
                                if (g1.Long)(O.asInt = g1.Long.fromValue($.asInt)).unsigned = !1;
                                else if (typeof $.asInt === "string") O.asInt = parseInt($.asInt, 10);
                                else if (typeof $.asInt === "number") O.asInt = $.asInt;
                                else if (typeof $.asInt === "object") O.asInt = new g1.LongBits($.asInt.low >>> 0, $.asInt.high >>> 0).toNumber()
                            }
                            if ($.exemplars) {
                                if (!Array.isArray($.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: array expected");
                                O.exemplars = [];
                                for (var _ = 0; _ < $.exemplars.length; ++_) {
                                    if (typeof $.exemplars[_] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: object expected");
                                    O.exemplars[_] = u1.opentelemetry.proto.metrics.v1.Exemplar.fromObject($.exemplars[_])
                                }
                            }
                            if ($.flags != null) O.flags = $.flags >>> 0;
                            return O
                        }, z.toObject = function($, O) {
                            if (!O) O = {};
                            var _ = {};
                            if (O.arrays || O.defaults) _.exemplars = [], _.attributes = [];
                            if (O.defaults) {
                                if (g1.Long) {
                                    var J = new g1.Long(0, 0, !1);
                                    _.startTimeUnixNano = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                } else _.startTimeUnixNano = O.longs === String ? "0" : 0;
                                if (g1.Long) {
                                    var J = new g1.Long(0, 0, !1);
                                    _.timeUnixNano = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                } else _.timeUnixNano = O.longs === String ? "0" : 0;
                                _.flags = 0
                            }
                            if ($.startTimeUnixNano != null && $.hasOwnProperty("startTimeUnixNano"))
                                if (typeof $.startTimeUnixNano === "number") _.startTimeUnixNano = O.longs === String ? String($.startTimeUnixNano) : $.startTimeUnixNano;
                                else _.startTimeUnixNano = O.longs === String ? g1.Long.prototype.toString.call($.startTimeUnixNano) : O.longs === Number ? new g1.LongBits($.startTimeUnixNano.low >>> 0, $.startTimeUnixNano.high >>> 0).toNumber() : $.startTimeUnixNano;
                            if ($.timeUnixNano != null && $.hasOwnProperty("timeUnixNano"))
                                if (typeof $.timeUnixNano === "number") _.timeUnixNano = O.longs === String ? String($.timeUnixNano) : $.timeUnixNano;
                                else _.timeUnixNano = O.longs === String ? g1.Long.prototype.toString.call($.timeUnixNano) : O.longs === Number ? new g1.LongBits($.timeUnixNano.low >>> 0, $.timeUnixNano.high >>> 0).toNumber() : $.timeUnixNano;
                            if ($.asDouble != null && $.hasOwnProperty("asDouble")) {
                                if (_.asDouble = O.json && !isFinite($.asDouble) ? String($.asDouble) : $.asDouble, O.oneofs) _.value = "asDouble"
                            }
                            if ($.exemplars && $.exemplars.length) {
                                _.exemplars = [];
                                for (var X = 0; X < $.exemplars.length; ++X) _.exemplars[X] = u1.opentelemetry.proto.metrics.v1.Exemplar.toObject($.exemplars[X], O)
                            }
                            if ($.asInt != null && $.hasOwnProperty("asInt")) {
                                if (typeof $.asInt === "number") _.asInt = O.longs === String ? String($.asInt) : $.asInt;
                                else _.asInt = O.longs === String ? g1.Long.prototype.toString.call($.asInt) : O.longs === Number ? new g1.LongBits($.asInt.low >>> 0, $.asInt.high >>> 0).toNumber() : $.asInt;
                                if (O.oneofs) _.value = "asInt"
                            }
                            if ($.attributes && $.attributes.length) {
                                _.attributes = [];
                                for (var X = 0; X < $.attributes.length; ++X) _.attributes[X] = u1.opentelemetry.proto.common.v1.KeyValue.toObject($.attributes[X], O)
                            }
                            if ($.flags != null && $.hasOwnProperty("flags")) _.flags = $.flags;
                            return _
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function($) {
                            if ($ === void 0) $ = "type.googleapis.com";
                            return $ + "/opentelemetry.proto.metrics.v1.NumberDataPoint"
                        }, z
                    }(), Y.HistogramDataPoint = function() {
                        function z(H) {
                            if (this.attributes = [], this.bucketCounts = [], this.explicitBounds = [], this.exemplars = [], H) {
                                for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                    if (H[$[O]] != null) this[$[O]] = H[$[O]]
                            }
                        }
                        z.prototype.attributes = g1.emptyArray, z.prototype.startTimeUnixNano = null, z.prototype.timeUnixNano = null, z.prototype.count = null, z.prototype.sum = null, z.prototype.bucketCounts = g1.emptyArray, z.prototype.explicitBounds = g1.emptyArray, z.prototype.exemplars = g1.emptyArray, z.prototype.flags = null, z.prototype.min = null, z.prototype.max = null;
                        var w;
                        return Object.defineProperty(z.prototype, "_sum", {
                            get: g1.oneOfGetter(w = ["sum"]),
                            set: g1.oneOfSetter(w)
                        }), Object.defineProperty(z.prototype, "_min", {
                            get: g1.oneOfGetter(w = ["min"]),
                            set: g1.oneOfSetter(w)
                        }), Object.defineProperty(z.prototype, "_max", {
                            get: g1.oneOfGetter(w = ["max"]),
                            set: g1.oneOfSetter(w)
                        }), z.create = function($) {
                            return new z($)
                        }, z.encode = function($, O) {
                            if (!O) O = H5.create();
                            if ($.startTimeUnixNano != null && Object.hasOwnProperty.call($, "startTimeUnixNano")) O.uint32(17).fixed64($.startTimeUnixNano);
                            if ($.timeUnixNano != null && Object.hasOwnProperty.call($, "timeUnixNano")) O.uint32(25).fixed64($.timeUnixNano);
                            if ($.count != null && Object.hasOwnProperty.call($, "count")) O.uint32(33).fixed64($.count);
                            if ($.sum != null && Object.hasOwnProperty.call($, "sum")) O.uint32(41).double($.sum);
                            if ($.bucketCounts != null && $.bucketCounts.length) {
                                O.uint32(50).fork();
                                for (var _ = 0; _ < $.bucketCounts.length; ++_) O.fixed64($.bucketCounts[_]);
                                O.ldelim()
                            }
                            if ($.explicitBounds != null && $.explicitBounds.length) {
                                O.uint32(58).fork();
                                for (var _ = 0; _ < $.explicitBounds.length; ++_) O.double($.explicitBounds[_]);
                                O.ldelim()
                            }
                            if ($.exemplars != null && $.exemplars.length)
                                for (var _ = 0; _ < $.exemplars.length; ++_) u1.opentelemetry.proto.metrics.v1.Exemplar.encode($.exemplars[_], O.uint32(66).fork()).ldelim();
                            if ($.attributes != null && $.attributes.length)
                                for (var _ = 0; _ < $.attributes.length; ++_) u1.opentelemetry.proto.common.v1.KeyValue.encode($.attributes[_], O.uint32(74).fork()).ldelim();
                            if ($.flags != null && Object.hasOwnProperty.call($, "flags")) O.uint32(80).uint32($.flags);
                            if ($.min != null && Object.hasOwnProperty.call($, "min")) O.uint32(89).double($.min);
                            if ($.max != null && Object.hasOwnProperty.call($, "max")) O.uint32(97).double($.max);
                            return O
                        }, z.encodeDelimited = function($, O) {
                            return this.encode($, O).ldelim()
                        }, z.decode = function($, O, _) {
                            if (!($ instanceof $A)) $ = $A.create($);
                            var J = O === void 0 ? $.len : $.pos + O,
                                X = new u1.opentelemetry.proto.metrics.v1.HistogramDataPoint;
                            while ($.pos < J) {
                                var D = $.uint32();
                                if (D === _) break;
                                switch (D >>> 3) {
                                    case 9: {
                                        if (!(X.attributes && X.attributes.length)) X.attributes = [];
                                        X.attributes.push(u1.opentelemetry.proto.common.v1.KeyValue.decode($, $.uint32()));
                                        break
                                    }
                                    case 2: {
                                        X.startTimeUnixNano = $.fixed64();
                                        break
                                    }
                                    case 3: {
                                        X.timeUnixNano = $.fixed64();
                                        break
                                    }
                                    case 4: {
                                        X.count = $.fixed64();
                                        break
                                    }
                                    case 5: {
                                        X.sum = $.double();
                                        break
                                    }
                                    case 6: {
                                        if (!(X.bucketCounts && X.bucketCounts.length)) X.bucketCounts = [];
                                        if ((D & 7) === 2) {
                                            var j = $.uint32() + $.pos;
                                            while ($.pos < j) X.bucketCounts.push($.fixed64())
                                        } else X.bucketCounts.push($.fixed64());
                                        break
                                    }
                                    case 7: {
                                        if (!(X.explicitBounds && X.explicitBounds.length)) X.explicitBounds = [];
                                        if ((D & 7) === 2) {
                                            var j = $.uint32() + $.pos;
                                            while ($.pos < j) X.explicitBounds.push($.double())
                                        } else X.explicitBounds.push($.double());
                                        break
                                    }
                                    case 8: {
                                        if (!(X.exemplars && X.exemplars.length)) X.exemplars = [];
                                        X.exemplars.push(u1.opentelemetry.proto.metrics.v1.Exemplar.decode($, $.uint32()));
                                        break
                                    }
                                    case 10: {
                                        X.flags = $.uint32();
                                        break
                                    }
                                    case 11: {
                                        X.min = $.double();
                                        break
                                    }
                                    case 12: {
                                        X.max = $.double();
                                        break
                                    }
                                    default:
                                        $.skipType(D & 7);
                                        break
                                }
                            }
                            return X
                        }, z.decodeDelimited = function($) {
                            if (!($ instanceof $A)) $ = new $A($);
                            return this.decode($, $.uint32())
                        }, z.verify = function($) {
                            if (typeof $ !== "object" || $ === null) return "object expected";
                            var O = {};
                            if ($.attributes != null && $.hasOwnProperty("attributes")) {
                                if (!Array.isArray($.attributes)) return "attributes: array expected";
                                for (var _ = 0; _ < $.attributes.length; ++_) {
                                    var J = u1.opentelemetry.proto.common.v1.KeyValue.verify($.attributes[_]);
                                    if (J) return "attributes." + J
                                }
                            }
                            if ($.startTimeUnixNano != null && $.hasOwnProperty("startTimeUnixNano")) {
                                if (!g1.isInteger($.startTimeUnixNano) && !($.startTimeUnixNano && g1.isInteger($.startTimeUnixNano.low) && g1.isInteger($.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if ($.timeUnixNano != null && $.hasOwnProperty("timeUnixNano")) {
                                if (!g1.isInteger($.timeUnixNano) && !($.timeUnixNano && g1.isInteger($.timeUnixNano.low) && g1.isInteger($.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if ($.count != null && $.hasOwnProperty("count")) {
                                if (!g1.isInteger($.count) && !($.count && g1.isInteger($.count.low) && g1.isInteger($.count.high))) return "count: integer|Long expected"
                            }
                            if ($.sum != null && $.hasOwnProperty("sum")) {
                                if (O._sum = 1, typeof $.sum !== "number") return "sum: number expected"
                            }
                            if ($.bucketCounts != null && $.hasOwnProperty("bucketCounts")) {
                                if (!Array.isArray($.bucketCounts)) return "bucketCounts: array expected";
                                for (var _ = 0; _ < $.bucketCounts.length; ++_)
                                    if (!g1.isInteger($.bucketCounts[_]) && !($.bucketCounts[_] && g1.isInteger($.bucketCounts[_].low) && g1.isInteger($.bucketCounts[_].high))) return "bucketCounts: integer|Long[] expected"
                            }
                            if ($.explicitBounds != null && $.hasOwnProperty("explicitBounds")) {
                                if (!Array.isArray($.explicitBounds)) return "explicitBounds: array expected";
                                for (var _ = 0; _ < $.explicitBounds.length; ++_)
                                    if (typeof $.explicitBounds[_] !== "number") return "explicitBounds: number[] expected"
                            }
                            if ($.exemplars != null && $.hasOwnProperty("exemplars")) {
                                if (!Array.isArray($.exemplars)) return "exemplars: array expected";
                                for (var _ = 0; _ < $.exemplars.length; ++_) {
                                    var J = u1.opentelemetry.proto.metrics.v1.Exemplar.verify($.exemplars[_]);
                                    if (J) return "exemplars." + J
                                }
                            }
                            if ($.flags != null && $.hasOwnProperty("flags")) {
                                if (!g1.isInteger($.flags)) return "flags: integer expected"
                            }
                            if ($.min != null && $.hasOwnProperty("min")) {
                                if (O._min = 1, typeof $.min !== "number") return "min: number expected"
                            }
                            if ($.max != null && $.hasOwnProperty("max")) {
                                if (O._max = 1, typeof $.max !== "number") return "max: number expected"
                            }
                            return null
                        }, z.fromObject = function($) {
                            if ($ instanceof u1.opentelemetry.proto.metrics.v1.HistogramDataPoint) return $;
                            var O = new u1.opentelemetry.proto.metrics.v1.HistogramDataPoint;
                            if ($.attributes) {
                                if (!Array.isArray($.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: array expected");
                                O.attributes = [];
                                for (var _ = 0; _ < $.attributes.length; ++_) {
                                    if (typeof $.attributes[_] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: object expected");
                                    O.attributes[_] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject($.attributes[_])
                                }
                            }
                            if ($.startTimeUnixNano != null) {
                                if (g1.Long)(O.startTimeUnixNano = g1.Long.fromValue($.startTimeUnixNano)).unsigned = !1;
                                else if (typeof $.startTimeUnixNano === "string") O.startTimeUnixNano = parseInt($.startTimeUnixNano, 10);
                                else if (typeof $.startTimeUnixNano === "number") O.startTimeUnixNano = $.startTimeUnixNano;
                                else if (typeof $.startTimeUnixNano === "object") O.startTimeUnixNano = new g1.LongBits($.startTimeUnixNano.low >>> 0, $.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if ($.timeUnixNano != null) {
                                if (g1.Long)(O.timeUnixNano = g1.Long.fromValue($.timeUnixNano)).unsigned = !1;
                                else if (typeof $.timeUnixNano === "string") O.timeUnixNano = parseInt($.timeUnixNano, 10);
                                else if (typeof $.timeUnixNano === "number") O.timeUnixNano = $.timeUnixNano;
                                else if (typeof $.timeUnixNano === "object") O.timeUnixNano = new g1.LongBits($.timeUnixNano.low >>> 0, $.timeUnixNano.high >>> 0).toNumber()
                            }
                            if ($.count != null) {
                                if (g1.Long)(O.count = g1.Long.fromValue($.count)).unsigned = !1;
                                else if (typeof $.count === "string") O.count = parseInt($.count, 10);
                                else if (typeof $.count === "number") O.count = $.count;
                                else if (typeof $.count === "object") O.count = new g1.LongBits($.count.low >>> 0, $.count.high >>> 0).toNumber()
                            }
                            if ($.sum != null) O.sum = Number($.sum);
                            if ($.bucketCounts) {
                                if (!Array.isArray($.bucketCounts)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.bucketCounts: array expected");
                                O.bucketCounts = [];
                                for (var _ = 0; _ < $.bucketCounts.length; ++_)
                                    if (g1.Long)(O.bucketCounts[_] = g1.Long.fromValue($.bucketCounts[_])).unsigned = !1;
                                    else if (typeof $.bucketCounts[_] === "string") O.bucketCounts[_] = parseInt($.bucketCounts[_], 10);
                                else if (typeof $.bucketCounts[_] === "number") O.bucketCounts[_] = $.bucketCounts[_];
                                else if (typeof $.bucketCounts[_] === "object") O.bucketCounts[_] = new g1.LongBits($.bucketCounts[_].low >>> 0, $.bucketCounts[_].high >>> 0).toNumber()
                            }
                            if ($.explicitBounds) {
                                if (!Array.isArray($.explicitBounds)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.explicitBounds: array expected");
                                O.explicitBounds = [];
                                for (var _ = 0; _ < $.explicitBounds.length; ++_) O.explicitBounds[_] = Number($.explicitBounds[_])
                            }
                            if ($.exemplars) {
                                if (!Array.isArray($.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: array expected");
                                O.exemplars = [];
                                for (var _ = 0; _ < $.exemplars.length; ++_) {
                                    if (typeof $.exemplars[_] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: object expected");
                                    O.exemplars[_] = u1.opentelemetry.proto.metrics.v1.Exemplar.fromObject($.exemplars[_])
                                }
                            }
                            if ($.flags != null) O.flags = $.flags >>> 0;
                            if ($.min != null) O.min = Number($.min);
                            if ($.max != null) O.max = Number($.max);
                            return O
                        }, z.toObject = function($, O) {
                            if (!O) O = {};
                            var _ = {};
                            if (O.arrays || O.defaults) _.bucketCounts = [], _.explicitBounds = [], _.exemplars = [], _.attributes = [];
                            if (O.defaults) {
                                if (g1.Long) {
                                    var J = new g1.Long(0, 0, !1);
                                    _.startTimeUnixNano = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                } else _.startTimeUnixNano = O.longs === String ? "0" : 0;
                                if (g1.Long) {
                                    var J = new g1.Long(0, 0, !1);
                                    _.timeUnixNano = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                } else _.timeUnixNano = O.longs === String ? "0" : 0;
                                if (g1.Long) {
                                    var J = new g1.Long(0, 0, !1);
                                    _.count = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                } else _.count = O.longs === String ? "0" : 0;
                                _.flags = 0
                            }
                            if ($.startTimeUnixNano != null && $.hasOwnProperty("startTimeUnixNano"))
                                if (typeof $.startTimeUnixNano === "number") _.startTimeUnixNano = O.longs === String ? String($.startTimeUnixNano) : $.startTimeUnixNano;
                                else _.startTimeUnixNano = O.longs === String ? g1.Long.prototype.toString.call($.startTimeUnixNano) : O.longs === Number ? new g1.LongBits($.startTimeUnixNano.low >>> 0, $.startTimeUnixNano.high >>> 0).toNumber() : $.startTimeUnixNano;
                            if ($.timeUnixNano != null && $.hasOwnProperty("timeUnixNano"))
                                if (typeof $.timeUnixNano === "number") _.timeUnixNano = O.longs === String ? String($.timeUnixNano) : $.timeUnixNano;
                                else _.timeUnixNano = O.longs === String ? g1.Long.prototype.toString.call($.timeUnixNano) : O.longs === Number ? new g1.LongBits($.timeUnixNano.low >>> 0, $.timeUnixNano.high >>> 0).toNumber() : $.timeUnixNano;
                            if ($.count != null && $.hasOwnProperty("count"))
                                if (typeof $.count === "number") _.count = O.longs === String ? String($.count) : $.count;
                                else _.count = O.longs === String ? g1.Long.prototype.toString.call($.count) : O.longs === Number ? new g1.LongBits($.count.low >>> 0, $.count.high >>> 0).toNumber() : $.count;
                            if ($.sum != null && $.hasOwnProperty("sum")) {
                                if (_.sum = O.json && !isFinite($.sum) ? String($.sum) : $.sum, O.oneofs) _._sum = "sum"
                            }
                            if ($.bucketCounts && $.bucketCounts.length) {
                                _.bucketCounts = [];
                                for (var X = 0; X < $.bucketCounts.length; ++X)
                                    if (typeof $.bucketCounts[X] === "number") _.bucketCounts[X] = O.longs === String ? String($.bucketCounts[X]) : $.bucketCounts[X];
                                    else _.bucketCounts[X] = O.longs === String ? g1.Long.prototype.toString.call($.bucketCounts[X]) : O.longs === Number ? new g1.LongBits($.bucketCounts[X].low >>> 0, $.bucketCounts[X].high >>> 0).toNumber() : $.bucketCounts[X]
                            }
                            if ($.explicitBounds && $.explicitBounds.length) {
                                _.explicitBounds = [];
                                for (var X = 0; X < $.explicitBounds.length; ++X) _.explicitBounds[X] = O.json && !isFinite($.explicitBounds[X]) ? String($.explicitBounds[X]) : $.explicitBounds[X]
                            }
                            if ($.exemplars && $.exemplars.length) {
                                _.exemplars = [];
                                for (var X = 0; X < $.exemplars.length; ++X) _.exemplars[X] = u1.opentelemetry.proto.metrics.v1.Exemplar.toObject($.exemplars[X], O)
                            }
                            if ($.attributes && $.attributes.length) {
                                _.attributes = [];
                                for (var X = 0; X < $.attributes.length; ++X) _.attributes[X] = u1.opentelemetry.proto.common.v1.KeyValue.toObject($.attributes[X], O)
                            }
                            if ($.flags != null && $.hasOwnProperty("flags")) _.flags = $.flags;
                            if ($.min != null && $.hasOwnProperty("min")) {
                                if (_.min = O.json && !isFinite($.min) ? String($.min) : $.min, O.oneofs) _._min = "min"
                            }
                            if ($.max != null && $.hasOwnProperty("max")) {
                                if (_.max = O.json && !isFinite($.max) ? String($.max) : $.max, O.oneofs) _._max = "max"
                            }
                            return _
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function($) {
                            if ($ === void 0) $ = "type.googleapis.com";
                            return $ + "/opentelemetry.proto.metrics.v1.HistogramDataPoint"
                        }, z
                    }(), Y.ExponentialHistogramDataPoint = function() {
                        function z(H) {
                            if (this.attributes = [], this.exemplars = [], H) {
                                for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                    if (H[$[O]] != null) this[$[O]] = H[$[O]]
                            }
                        }
                        z.prototype.attributes = g1.emptyArray, z.prototype.startTimeUnixNano = null, z.prototype.timeUnixNano = null, z.prototype.count = null, z.prototype.sum = null, z.prototype.scale = null, z.prototype.zeroCount = null, z.prototype.positive = null, z.prototype.negative = null, z.prototype.flags = null, z.prototype.exemplars = g1.emptyArray, z.prototype.min = null, z.prototype.max = null, z.prototype.zeroThreshold = null;
                        var w;
                        return Object.defineProperty(z.prototype, "_sum", {
                            get: g1.oneOfGetter(w = ["sum"]),
                            set: g1.oneOfSetter(w)
                        }), Object.defineProperty(z.prototype, "_min", {
                            get: g1.oneOfGetter(w = ["min"]),
                            set: g1.oneOfSetter(w)
                        }), Object.defineProperty(z.prototype, "_max", {
                            get: g1.oneOfGetter(w = ["max"]),
                            set: g1.oneOfSetter(w)
                        }), z.create = function($) {
                            return new z($)
                        }, z.encode = function($, O) {
                            if (!O) O = H5.create();
                            if ($.attributes != null && $.attributes.length)
                                for (var _ = 0; _ < $.attributes.length; ++_) u1.opentelemetry.proto.common.v1.KeyValue.encode($.attributes[_], O.uint32(10).fork()).ldelim();
                            if ($.startTimeUnixNano != null && Object.hasOwnProperty.call($, "startTimeUnixNano")) O.uint32(17).fixed64($.startTimeUnixNano);
                            if ($.timeUnixNano != null && Object.hasOwnProperty.call($, "timeUnixNano")) O.uint32(25).fixed64($.timeUnixNano);
                            if ($.count != null && Object.hasOwnProperty.call($, "count")) O.uint32(33).fixed64($.count);
                            if ($.sum != null && Object.hasOwnProperty.call($, "sum")) O.uint32(41).double($.sum);
                            if ($.scale != null && Object.hasOwnProperty.call($, "scale")) O.uint32(48).sint32($.scale);
                            if ($.zeroCount != null && Object.hasOwnProperty.call($, "zeroCount")) O.uint32(57).fixed64($.zeroCount);
                            if ($.positive != null && Object.hasOwnProperty.call($, "positive")) u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode($.positive, O.uint32(66).fork()).ldelim();
                            if ($.negative != null && Object.hasOwnProperty.call($, "negative")) u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode($.negative, O.uint32(74).fork()).ldelim();
                            if ($.flags != null && Object.hasOwnProperty.call($, "flags")) O.uint32(80).uint32($.flags);
                            if ($.exemplars != null && $.exemplars.length)
                                for (var _ = 0; _ < $.exemplars.length; ++_) u1.opentelemetry.proto.metrics.v1.Exemplar.encode($.exemplars[_], O.uint32(90).fork()).ldelim();
                            if ($.min != null && Object.hasOwnProperty.call($, "min")) O.uint32(97).double($.min);
                            if ($.max != null && Object.hasOwnProperty.call($, "max")) O.uint32(105).double($.max);
                            if ($.zeroThreshold != null && Object.hasOwnProperty.call($, "zeroThreshold")) O.uint32(113).double($.zeroThreshold);
                            return O
                        }, z.encodeDelimited = function($, O) {
                            return this.encode($, O).ldelim()
                        }, z.decode = function($, O, _) {
                            if (!($ instanceof $A)) $ = $A.create($);
                            var J = O === void 0 ? $.len : $.pos + O,
                                X = new u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;
                            while ($.pos < J) {
                                var D = $.uint32();
                                if (D === _) break;
                                switch (D >>> 3) {
                                    case 1: {
                                        if (!(X.attributes && X.attributes.length)) X.attributes = [];
                                        X.attributes.push(u1.opentelemetry.proto.common.v1.KeyValue.decode($, $.uint32()));
                                        break
                                    }
                                    case 2: {
                                        X.startTimeUnixNano = $.fixed64();
                                        break
                                    }
                                    case 3: {
                                        X.timeUnixNano = $.fixed64();
                                        break
                                    }
                                    case 4: {
                                        X.count = $.fixed64();
                                        break
                                    }
                                    case 5: {
                                        X.sum = $.double();
                                        break
                                    }
                                    case 6: {
                                        X.scale = $.sint32();
                                        break
                                    }
                                    case 7: {
                                        X.zeroCount = $.fixed64();
                                        break
                                    }
                                    case 8: {
                                        X.positive = u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode($, $.uint32());
                                        break
                                    }
                                    case 9: {
                                        X.negative = u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode($, $.uint32());
                                        break
                                    }
                                    case 10: {
                                        X.flags = $.uint32();
                                        break
                                    }
                                    case 11: {
                                        if (!(X.exemplars && X.exemplars.length)) X.exemplars = [];
                                        X.exemplars.push(u1.opentelemetry.proto.metrics.v1.Exemplar.decode($, $.uint32()));
                                        break
                                    }
                                    case 12: {
                                        X.min = $.double();
                                        break
                                    }
                                    case 13: {
                                        X.max = $.double();
                                        break
                                    }
                                    case 14: {
                                        X.zeroThreshold = $.double();
                                        break
                                    }
                                    default:
                                        $.skipType(D & 7);
                                        break
                                }
                            }
                            return X
                        }, z.decodeDelimited = function($) {
                            if (!($ instanceof $A)) $ = new $A($);
                            return this.decode($, $.uint32())
                        }, z.verify = function($) {
                            if (typeof $ !== "object" || $ === null) return "object expected";
                            var O = {};
                            if ($.attributes != null && $.hasOwnProperty("attributes")) {
                                if (!Array.isArray($.attributes)) return "attributes: array expected";
                                for (var _ = 0; _ < $.attributes.length; ++_) {
                                    var J = u1.opentelemetry.proto.common.v1.KeyValue.verify($.attributes[_]);
                                    if (J) return "attributes." + J
                                }
                            }
                            if ($.startTimeUnixNano != null && $.hasOwnProperty("startTimeUnixNano")) {
                                if (!g1.isInteger($.startTimeUnixNano) && !($.startTimeUnixNano && g1.isInteger($.startTimeUnixNano.low) && g1.isInteger($.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if ($.timeUnixNano != null && $.hasOwnProperty("timeUnixNano")) {
                                if (!g1.isInteger($.timeUnixNano) && !($.timeUnixNano && g1.isInteger($.timeUnixNano.low) && g1.isInteger($.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if ($.count != null && $.hasOwnProperty("count")) {
                                if (!g1.isInteger($.count) && !($.count && g1.isInteger($.count.low) && g1.isInteger($.count.high))) return "count: integer|Long expected"
                            }
                            if ($.sum != null && $.hasOwnProperty("sum")) {
                                if (O._sum = 1, typeof $.sum !== "number") return "sum: number expected"
                            }
                            if ($.scale != null && $.hasOwnProperty("scale")) {
                                if (!g1.isInteger($.scale)) return "scale: integer expected"
                            }
                            if ($.zeroCount != null && $.hasOwnProperty("zeroCount")) {
                                if (!g1.isInteger($.zeroCount) && !($.zeroCount && g1.isInteger($.zeroCount.low) && g1.isInteger($.zeroCount.high))) return "zeroCount: integer|Long expected"
                            }
                            if ($.positive != null && $.hasOwnProperty("positive")) {
                                var J = u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify($.positive);
                                if (J) return "positive." + J
                            }
                            if ($.negative != null && $.hasOwnProperty("negative")) {
                                var J = u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify($.negative);
                                if (J) return "negative." + J
                            }
                            if ($.flags != null && $.hasOwnProperty("flags")) {
                                if (!g1.isInteger($.flags)) return "flags: integer expected"
                            }
                            if ($.exemplars != null && $.hasOwnProperty("exemplars")) {
                                if (!Array.isArray($.exemplars)) return "exemplars: array expected";
                                for (var _ = 0; _ < $.exemplars.length; ++_) {
                                    var J = u1.opentelemetry.proto.metrics.v1.Exemplar.verify($.exemplars[_]);
                                    if (J) return "exemplars." + J
                                }
                            }
                            if ($.min != null && $.hasOwnProperty("min")) {
                                if (O._min = 1, typeof $.min !== "number") return "min: number expected"
                            }
                            if ($.max != null && $.hasOwnProperty("max")) {
                                if (O._max = 1, typeof $.max !== "number") return "max: number expected"
                            }
                            if ($.zeroThreshold != null && $.hasOwnProperty("zeroThreshold")) {
                                if (typeof $.zeroThreshold !== "number") return "zeroThreshold: number expected"
                            }
                            return null
                        }, z.fromObject = function($) {
                            if ($ instanceof u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint) return $;
                            var O = new u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;
                            if ($.attributes) {
                                if (!Array.isArray($.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: array expected");
                                O.attributes = [];
                                for (var _ = 0; _ < $.attributes.length; ++_) {
                                    if (typeof $.attributes[_] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: object expected");
                                    O.attributes[_] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject($.attributes[_])
                                }
                            }
                            if ($.startTimeUnixNano != null) {
                                if (g1.Long)(O.startTimeUnixNano = g1.Long.fromValue($.startTimeUnixNano)).unsigned = !1;
                                else if (typeof $.startTimeUnixNano === "string") O.startTimeUnixNano = parseInt($.startTimeUnixNano, 10);
                                else if (typeof $.startTimeUnixNano === "number") O.startTimeUnixNano = $.startTimeUnixNano;
                                else if (typeof $.startTimeUnixNano === "object") O.startTimeUnixNano = new g1.LongBits($.startTimeUnixNano.low >>> 0, $.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if ($.timeUnixNano != null) {
                                if (g1.Long)(O.timeUnixNano = g1.Long.fromValue($.timeUnixNano)).unsigned = !1;
                                else if (typeof $.timeUnixNano === "string") O.timeUnixNano = parseInt($.timeUnixNano, 10);
                                else if (typeof $.timeUnixNano === "number") O.timeUnixNano = $.timeUnixNano;
                                else if (typeof $.timeUnixNano === "object") O.timeUnixNano = new g1.LongBits($.timeUnixNano.low >>> 0, $.timeUnixNano.high >>> 0).toNumber()
                            }
                            if ($.count != null) {
                                if (g1.Long)(O.count = g1.Long.fromValue($.count)).unsigned = !1;
                                else if (typeof $.count === "string") O.count = parseInt($.count, 10);
                                else if (typeof $.count === "number") O.count = $.count;
                                else if (typeof $.count === "object") O.count = new g1.LongBits($.count.low >>> 0, $.count.high >>> 0).toNumber()
                            }
                            if ($.sum != null) O.sum = Number($.sum);
                            if ($.scale != null) O.scale = $.scale | 0;
                            if ($.zeroCount != null) {
                                if (g1.Long)(O.zeroCount = g1.Long.fromValue($.zeroCount)).unsigned = !1;
                                else if (typeof $.zeroCount === "string") O.zeroCount = parseInt($.zeroCount, 10);
                                else if (typeof $.zeroCount === "number") O.zeroCount = $.zeroCount;
                                else if (typeof $.zeroCount === "object") O.zeroCount = new g1.LongBits($.zeroCount.low >>> 0, $.zeroCount.high >>> 0).toNumber()
                            }
                            if ($.positive != null) {
                                if (typeof $.positive !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.positive: object expected");
                                O.positive = u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject($.positive)
                            }
                            if ($.negative != null) {
                                if (typeof $.negative !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.negative: object expected");
                                O.negative = u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject($.negative)
                            }
                            if ($.flags != null) O.flags = $.flags >>> 0;
                            if ($.exemplars) {
                                if (!Array.isArray($.exemplars)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: array expected");
                                O.exemplars = [];
                                for (var _ = 0; _ < $.exemplars.length; ++_) {
                                    if (typeof $.exemplars[_] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: object expected");
                                    O.exemplars[_] = u1.opentelemetry.proto.metrics.v1.Exemplar.fromObject($.exemplars[_])
                                }
                            }
                            if ($.min != null) O.min = Number($.min);
                            if ($.max != null) O.max = Number($.max);
                            if ($.zeroThreshold != null) O.zeroThreshold = Number($.zeroThreshold);
                            return O
                        }, z.toObject = function($, O) {
                            if (!O) O = {};
                            var _ = {};
                            if (O.arrays || O.defaults) _.attributes = [], _.exemplars = [];
                            if (O.defaults) {
                                if (g1.Long) {
                                    var J = new g1.Long(0, 0, !1);
                                    _.startTimeUnixNano = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                } else _.startTimeUnixNano = O.longs === String ? "0" : 0;
                                if (g1.Long) {
                                    var J = new g1.Long(0, 0, !1);
                                    _.timeUnixNano = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                } else _.timeUnixNano = O.longs === String ? "0" : 0;
                                if (g1.Long) {
                                    var J = new g1.Long(0, 0, !1);
                                    _.count = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                } else _.count = O.longs === String ? "0" : 0;
                                if (_.scale = 0, g1.Long) {
                                    var J = new g1.Long(0, 0, !1);
                                    _.zeroCount = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                } else _.zeroCount = O.longs === String ? "0" : 0;
                                _.positive = null, _.negative = null, _.flags = 0, _.zeroThreshold = 0
                            }
                            if ($.attributes && $.attributes.length) {
                                _.attributes = [];
                                for (var X = 0; X < $.attributes.length; ++X) _.attributes[X] = u1.opentelemetry.proto.common.v1.KeyValue.toObject($.attributes[X], O)
                            }
                            if ($.startTimeUnixNano != null && $.hasOwnProperty("startTimeUnixNano"))
                                if (typeof $.startTimeUnixNano === "number") _.startTimeUnixNano = O.longs === String ? String($.startTimeUnixNano) : $.startTimeUnixNano;
                                else _.startTimeUnixNano = O.longs === String ? g1.Long.prototype.toString.call($.startTimeUnixNano) : O.longs === Number ? new g1.LongBits($.startTimeUnixNano.low >>> 0, $.startTimeUnixNano.high >>> 0).toNumber() : $.startTimeUnixNano;
                            if ($.timeUnixNano != null && $.hasOwnProperty("timeUnixNano"))
                                if (typeof $.timeUnixNano === "number") _.timeUnixNano = O.longs === String ? String($.timeUnixNano) : $.timeUnixNano;
                                else _.timeUnixNano = O.longs === String ? g1.Long.prototype.toString.call($.timeUnixNano) : O.longs === Number ? new g1.LongBits($.timeUnixNano.low >>> 0, $.timeUnixNano.high >>> 0).toNumber() : $.timeUnixNano;
                            if ($.count != null && $.hasOwnProperty("count"))
                                if (typeof $.count === "number") _.count = O.longs === String ? String($.count) : $.count;
                                else _.count = O.longs === String ? g1.Long.prototype.toString.call($.count) : O.longs === Number ? new g1.LongBits($.count.low >>> 0, $.count.high >>> 0).toNumber() : $.count;
                            if ($.sum != null && $.hasOwnProperty("sum")) {
                                if (_.sum = O.json && !isFinite($.sum) ? String($.sum) : $.sum, O.oneofs) _._sum = "sum"
                            }
                            if ($.scale != null && $.hasOwnProperty("scale")) _.scale = $.scale;
                            if ($.zeroCount != null && $.hasOwnProperty("zeroCount"))
                                if (typeof $.zeroCount === "number") _.zeroCount = O.longs === String ? String($.zeroCount) : $.zeroCount;
                                else _.zeroCount = O.longs === String ? g1.Long.prototype.toString.call($.zeroCount) : O.longs === Number ? new g1.LongBits($.zeroCount.low >>> 0, $.zeroCount.high >>> 0).toNumber() : $.zeroCount;
                            if ($.positive != null && $.hasOwnProperty("positive")) _.positive = u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject($.positive, O);
                            if ($.negative != null && $.hasOwnProperty("negative")) _.negative = u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject($.negative, O);
                            if ($.flags != null && $.hasOwnProperty("flags")) _.flags = $.flags;
                            if ($.exemplars && $.exemplars.length) {
                                _.exemplars = [];
                                for (var X = 0; X < $.exemplars.length; ++X) _.exemplars[X] = u1.opentelemetry.proto.metrics.v1.Exemplar.toObject($.exemplars[X], O)
                            }
                            if ($.min != null && $.hasOwnProperty("min")) {
                                if (_.min = O.json && !isFinite($.min) ? String($.min) : $.min, O.oneofs) _._min = "min"
                            }
                            if ($.max != null && $.hasOwnProperty("max")) {
                                if (_.max = O.json && !isFinite($.max) ? String($.max) : $.max, O.oneofs) _._max = "max"
                            }
                            if ($.zeroThreshold != null && $.hasOwnProperty("zeroThreshold")) _.zeroThreshold = O.json && !isFinite($.zeroThreshold) ? String($.zeroThreshold) : $.zeroThreshold;
                            return _
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function($) {
                            if ($ === void 0) $ = "type.googleapis.com";
                            return $ + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint"
                        }, z.Buckets = function() {
                            function H($) {
                                if (this.bucketCounts = [], $) {
                                    for (var O = Object.keys($), _ = 0; _ < O.length; ++_)
                                        if ($[O[_]] != null) this[O[_]] = $[O[_]]
                                }
                            }
                            return H.prototype.offset = null, H.prototype.bucketCounts = g1.emptyArray, H.create = function(O) {
                                return new H(O)
                            }, H.encode = function(O, _) {
                                if (!_) _ = H5.create();
                                if (O.offset != null && Object.hasOwnProperty.call(O, "offset")) _.uint32(8).sint32(O.offset);
                                if (O.bucketCounts != null && O.bucketCounts.length) {
                                    _.uint32(18).fork();
                                    for (var J = 0; J < O.bucketCounts.length; ++J) _.uint64(O.bucketCounts[J]);
                                    _.ldelim()
                                }
                                return _
                            }, H.encodeDelimited = function(O, _) {
                                return this.encode(O, _).ldelim()
                            }, H.decode = function(O, _, J) {
                                if (!(O instanceof $A)) O = $A.create(O);
                                var X = _ === void 0 ? O.len : O.pos + _,
                                    D = new u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;
                                while (O.pos < X) {
                                    var j = O.uint32();
                                    if (j === J) break;
                                    switch (j >>> 3) {
                                        case 1: {
                                            D.offset = O.sint32();
                                            break
                                        }
                                        case 2: {
                                            if (!(D.bucketCounts && D.bucketCounts.length)) D.bucketCounts = [];
                                            if ((j & 7) === 2) {
                                                var M = O.uint32() + O.pos;
                                                while (O.pos < M) D.bucketCounts.push(O.uint64())
                                            } else D.bucketCounts.push(O.uint64());
                                            break
                                        }
                                        default:
                                            O.skipType(j & 7);
                                            break
                                    }
                                }
                                return D
                            }, H.decodeDelimited = function(O) {
                                if (!(O instanceof $A)) O = new $A(O);
                                return this.decode(O, O.uint32())
                            }, H.verify = function(O) {
                                if (typeof O !== "object" || O === null) return "object expected";
                                if (O.offset != null && O.hasOwnProperty("offset")) {
                                    if (!g1.isInteger(O.offset)) return "offset: integer expected"
                                }
                                if (O.bucketCounts != null && O.hasOwnProperty("bucketCounts")) {
                                    if (!Array.isArray(O.bucketCounts)) return "bucketCounts: array expected";
                                    for (var _ = 0; _ < O.bucketCounts.length; ++_)
                                        if (!g1.isInteger(O.bucketCounts[_]) && !(O.bucketCounts[_] && g1.isInteger(O.bucketCounts[_].low) && g1.isInteger(O.bucketCounts[_].high))) return "bucketCounts: integer|Long[] expected"
                                }
                                return null
                            }, H.fromObject = function(O) {
                                if (O instanceof u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets) return O;
                                var _ = new u1.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;
                                if (O.offset != null) _.offset = O.offset | 0;
                                if (O.bucketCounts) {
                                    if (!Array.isArray(O.bucketCounts)) throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.bucketCounts: array expected");
                                    _.bucketCounts = [];
                                    for (var J = 0; J < O.bucketCounts.length; ++J)
                                        if (g1.Long)(_.bucketCounts[J] = g1.Long.fromValue(O.bucketCounts[J])).unsigned = !0;
                                        else if (typeof O.bucketCounts[J] === "string") _.bucketCounts[J] = parseInt(O.bucketCounts[J], 10);
                                    else if (typeof O.bucketCounts[J] === "number") _.bucketCounts[J] = O.bucketCounts[J];
                                    else if (typeof O.bucketCounts[J] === "object") _.bucketCounts[J] = new g1.LongBits(O.bucketCounts[J].low >>> 0, O.bucketCounts[J].high >>> 0).toNumber(!0)
                                }
                                return _
                            }, H.toObject = function(O, _) {
                                if (!_) _ = {};
                                var J = {};
                                if (_.arrays || _.defaults) J.bucketCounts = [];
                                if (_.defaults) J.offset = 0;
                                if (O.offset != null && O.hasOwnProperty("offset")) J.offset = O.offset;
                                if (O.bucketCounts && O.bucketCounts.length) {
                                    J.bucketCounts = [];
                                    for (var X = 0; X < O.bucketCounts.length; ++X)
                                        if (typeof O.bucketCounts[X] === "number") J.bucketCounts[X] = _.longs === String ? String(O.bucketCounts[X]) : O.bucketCounts[X];
                                        else J.bucketCounts[X] = _.longs === String ? g1.Long.prototype.toString.call(O.bucketCounts[X]) : _.longs === Number ? new g1.LongBits(O.bucketCounts[X].low >>> 0, O.bucketCounts[X].high >>> 0).toNumber(!0) : O.bucketCounts[X]
                                }
                                return J
                            }, H.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, H.getTypeUrl = function(O) {
                                if (O === void 0) O = "type.googleapis.com";
                                return O + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets"
                            }, H
                        }(), z
                    }(), Y.SummaryDataPoint = function() {
                        function z(w) {
                            if (this.attributes = [], this.quantileValues = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.attributes = g1.emptyArray, z.prototype.startTimeUnixNano = null, z.prototype.timeUnixNano = null, z.prototype.count = null, z.prototype.sum = null, z.prototype.quantileValues = g1.emptyArray, z.prototype.flags = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.startTimeUnixNano != null && Object.hasOwnProperty.call(H, "startTimeUnixNano")) $.uint32(17).fixed64(H.startTimeUnixNano);
                            if (H.timeUnixNano != null && Object.hasOwnProperty.call(H, "timeUnixNano")) $.uint32(25).fixed64(H.timeUnixNano);
                            if (H.count != null && Object.hasOwnProperty.call(H, "count")) $.uint32(33).fixed64(H.count);
                            if (H.sum != null && Object.hasOwnProperty.call(H, "sum")) $.uint32(41).double(H.sum);
                            if (H.quantileValues != null && H.quantileValues.length)
                                for (var O = 0; O < H.quantileValues.length; ++O) u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.encode(H.quantileValues[O], $.uint32(50).fork()).ldelim();
                            if (H.attributes != null && H.attributes.length)
                                for (var O = 0; O < H.attributes.length; ++O) u1.opentelemetry.proto.common.v1.KeyValue.encode(H.attributes[O], $.uint32(58).fork()).ldelim();
                            if (H.flags != null && Object.hasOwnProperty.call(H, "flags")) $.uint32(64).uint32(H.flags);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.metrics.v1.SummaryDataPoint;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 7: {
                                        if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                        J.attributes.push(u1.opentelemetry.proto.common.v1.KeyValue.decode(H, H.uint32()));
                                        break
                                    }
                                    case 2: {
                                        J.startTimeUnixNano = H.fixed64();
                                        break
                                    }
                                    case 3: {
                                        J.timeUnixNano = H.fixed64();
                                        break
                                    }
                                    case 4: {
                                        J.count = H.fixed64();
                                        break
                                    }
                                    case 5: {
                                        J.sum = H.double();
                                        break
                                    }
                                    case 6: {
                                        if (!(J.quantileValues && J.quantileValues.length)) J.quantileValues = [];
                                        J.quantileValues.push(u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.decode(H, H.uint32()));
                                        break
                                    }
                                    case 8: {
                                        J.flags = H.uint32();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.attributes != null && H.hasOwnProperty("attributes")) {
                                if (!Array.isArray(H.attributes)) return "attributes: array expected";
                                for (var $ = 0; $ < H.attributes.length; ++$) {
                                    var O = u1.opentelemetry.proto.common.v1.KeyValue.verify(H.attributes[$]);
                                    if (O) return "attributes." + O
                                }
                            }
                            if (H.startTimeUnixNano != null && H.hasOwnProperty("startTimeUnixNano")) {
                                if (!g1.isInteger(H.startTimeUnixNano) && !(H.startTimeUnixNano && g1.isInteger(H.startTimeUnixNano.low) && g1.isInteger(H.startTimeUnixNano.high))) return "startTimeUnixNano: integer|Long expected"
                            }
                            if (H.timeUnixNano != null && H.hasOwnProperty("timeUnixNano")) {
                                if (!g1.isInteger(H.timeUnixNano) && !(H.timeUnixNano && g1.isInteger(H.timeUnixNano.low) && g1.isInteger(H.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (H.count != null && H.hasOwnProperty("count")) {
                                if (!g1.isInteger(H.count) && !(H.count && g1.isInteger(H.count.low) && g1.isInteger(H.count.high))) return "count: integer|Long expected"
                            }
                            if (H.sum != null && H.hasOwnProperty("sum")) {
                                if (typeof H.sum !== "number") return "sum: number expected"
                            }
                            if (H.quantileValues != null && H.hasOwnProperty("quantileValues")) {
                                if (!Array.isArray(H.quantileValues)) return "quantileValues: array expected";
                                for (var $ = 0; $ < H.quantileValues.length; ++$) {
                                    var O = u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.verify(H.quantileValues[$]);
                                    if (O) return "quantileValues." + O
                                }
                            }
                            if (H.flags != null && H.hasOwnProperty("flags")) {
                                if (!g1.isInteger(H.flags)) return "flags: integer expected"
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.metrics.v1.SummaryDataPoint) return H;
                            var $ = new u1.opentelemetry.proto.metrics.v1.SummaryDataPoint;
                            if (H.attributes) {
                                if (!Array.isArray(H.attributes)) throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: array expected");
                                $.attributes = [];
                                for (var O = 0; O < H.attributes.length; ++O) {
                                    if (typeof H.attributes[O] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: object expected");
                                    $.attributes[O] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject(H.attributes[O])
                                }
                            }
                            if (H.startTimeUnixNano != null) {
                                if (g1.Long)($.startTimeUnixNano = g1.Long.fromValue(H.startTimeUnixNano)).unsigned = !1;
                                else if (typeof H.startTimeUnixNano === "string") $.startTimeUnixNano = parseInt(H.startTimeUnixNano, 10);
                                else if (typeof H.startTimeUnixNano === "number") $.startTimeUnixNano = H.startTimeUnixNano;
                                else if (typeof H.startTimeUnixNano === "object") $.startTimeUnixNano = new g1.LongBits(H.startTimeUnixNano.low >>> 0, H.startTimeUnixNano.high >>> 0).toNumber()
                            }
                            if (H.timeUnixNano != null) {
                                if (g1.Long)($.timeUnixNano = g1.Long.fromValue(H.timeUnixNano)).unsigned = !1;
                                else if (typeof H.timeUnixNano === "string") $.timeUnixNano = parseInt(H.timeUnixNano, 10);
                                else if (typeof H.timeUnixNano === "number") $.timeUnixNano = H.timeUnixNano;
                                else if (typeof H.timeUnixNano === "object") $.timeUnixNano = new g1.LongBits(H.timeUnixNano.low >>> 0, H.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (H.count != null) {
                                if (g1.Long)($.count = g1.Long.fromValue(H.count)).unsigned = !1;
                                else if (typeof H.count === "string") $.count = parseInt(H.count, 10);
                                else if (typeof H.count === "number") $.count = H.count;
                                else if (typeof H.count === "object") $.count = new g1.LongBits(H.count.low >>> 0, H.count.high >>> 0).toNumber()
                            }
                            if (H.sum != null) $.sum = Number(H.sum);
                            if (H.quantileValues) {
                                if (!Array.isArray(H.quantileValues)) throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: array expected");
                                $.quantileValues = [];
                                for (var O = 0; O < H.quantileValues.length; ++O) {
                                    if (typeof H.quantileValues[O] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: object expected");
                                    $.quantileValues[O] = u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.fromObject(H.quantileValues[O])
                                }
                            }
                            if (H.flags != null) $.flags = H.flags >>> 0;
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.quantileValues = [], O.attributes = [];
                            if ($.defaults) {
                                if (g1.Long) {
                                    var _ = new g1.Long(0, 0, !1);
                                    O.startTimeUnixNano = $.longs === String ? _.toString() : $.longs === Number ? _.toNumber() : _
                                } else O.startTimeUnixNano = $.longs === String ? "0" : 0;
                                if (g1.Long) {
                                    var _ = new g1.Long(0, 0, !1);
                                    O.timeUnixNano = $.longs === String ? _.toString() : $.longs === Number ? _.toNumber() : _
                                } else O.timeUnixNano = $.longs === String ? "0" : 0;
                                if (g1.Long) {
                                    var _ = new g1.Long(0, 0, !1);
                                    O.count = $.longs === String ? _.toString() : $.longs === Number ? _.toNumber() : _
                                } else O.count = $.longs === String ? "0" : 0;
                                O.sum = 0, O.flags = 0
                            }
                            if (H.startTimeUnixNano != null && H.hasOwnProperty("startTimeUnixNano"))
                                if (typeof H.startTimeUnixNano === "number") O.startTimeUnixNano = $.longs === String ? String(H.startTimeUnixNano) : H.startTimeUnixNano;
                                else O.startTimeUnixNano = $.longs === String ? g1.Long.prototype.toString.call(H.startTimeUnixNano) : $.longs === Number ? new g1.LongBits(H.startTimeUnixNano.low >>> 0, H.startTimeUnixNano.high >>> 0).toNumber() : H.startTimeUnixNano;
                            if (H.timeUnixNano != null && H.hasOwnProperty("timeUnixNano"))
                                if (typeof H.timeUnixNano === "number") O.timeUnixNano = $.longs === String ? String(H.timeUnixNano) : H.timeUnixNano;
                                else O.timeUnixNano = $.longs === String ? g1.Long.prototype.toString.call(H.timeUnixNano) : $.longs === Number ? new g1.LongBits(H.timeUnixNano.low >>> 0, H.timeUnixNano.high >>> 0).toNumber() : H.timeUnixNano;
                            if (H.count != null && H.hasOwnProperty("count"))
                                if (typeof H.count === "number") O.count = $.longs === String ? String(H.count) : H.count;
                                else O.count = $.longs === String ? g1.Long.prototype.toString.call(H.count) : $.longs === Number ? new g1.LongBits(H.count.low >>> 0, H.count.high >>> 0).toNumber() : H.count;
                            if (H.sum != null && H.hasOwnProperty("sum")) O.sum = $.json && !isFinite(H.sum) ? String(H.sum) : H.sum;
                            if (H.quantileValues && H.quantileValues.length) {
                                O.quantileValues = [];
                                for (var J = 0; J < H.quantileValues.length; ++J) O.quantileValues[J] = u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.toObject(H.quantileValues[J], $)
                            }
                            if (H.attributes && H.attributes.length) {
                                O.attributes = [];
                                for (var J = 0; J < H.attributes.length; ++J) O.attributes[J] = u1.opentelemetry.proto.common.v1.KeyValue.toObject(H.attributes[J], $)
                            }
                            if (H.flags != null && H.hasOwnProperty("flags")) O.flags = H.flags;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.metrics.v1.SummaryDataPoint"
                        }, z.ValueAtQuantile = function() {
                            function w(H) {
                                if (H) {
                                    for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                        if (H[$[O]] != null) this[$[O]] = H[$[O]]
                                }
                            }
                            return w.prototype.quantile = null, w.prototype.value = null, w.create = function($) {
                                return new w($)
                            }, w.encode = function($, O) {
                                if (!O) O = H5.create();
                                if ($.quantile != null && Object.hasOwnProperty.call($, "quantile")) O.uint32(9).double($.quantile);
                                if ($.value != null && Object.hasOwnProperty.call($, "value")) O.uint32(17).double($.value);
                                return O
                            }, w.encodeDelimited = function($, O) {
                                return this.encode($, O).ldelim()
                            }, w.decode = function($, O, _) {
                                if (!($ instanceof $A)) $ = $A.create($);
                                var J = O === void 0 ? $.len : $.pos + O,
                                    X = new u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;
                                while ($.pos < J) {
                                    var D = $.uint32();
                                    if (D === _) break;
                                    switch (D >>> 3) {
                                        case 1: {
                                            X.quantile = $.double();
                                            break
                                        }
                                        case 2: {
                                            X.value = $.double();
                                            break
                                        }
                                        default:
                                            $.skipType(D & 7);
                                            break
                                    }
                                }
                                return X
                            }, w.decodeDelimited = function($) {
                                if (!($ instanceof $A)) $ = new $A($);
                                return this.decode($, $.uint32())
                            }, w.verify = function($) {
                                if (typeof $ !== "object" || $ === null) return "object expected";
                                if ($.quantile != null && $.hasOwnProperty("quantile")) {
                                    if (typeof $.quantile !== "number") return "quantile: number expected"
                                }
                                if ($.value != null && $.hasOwnProperty("value")) {
                                    if (typeof $.value !== "number") return "value: number expected"
                                }
                                return null
                            }, w.fromObject = function($) {
                                if ($ instanceof u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile) return $;
                                var O = new u1.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;
                                if ($.quantile != null) O.quantile = Number($.quantile);
                                if ($.value != null) O.value = Number($.value);
                                return O
                            }, w.toObject = function($, O) {
                                if (!O) O = {};
                                var _ = {};
                                if (O.defaults) _.quantile = 0, _.value = 0;
                                if ($.quantile != null && $.hasOwnProperty("quantile")) _.quantile = O.json && !isFinite($.quantile) ? String($.quantile) : $.quantile;
                                if ($.value != null && $.hasOwnProperty("value")) _.value = O.json && !isFinite($.value) ? String($.value) : $.value;
                                return _
                            }, w.prototype.toJSON = function() {
                                return this.constructor.toObject(this, JK.util.toJSONOptions)
                            }, w.getTypeUrl = function($) {
                                if ($ === void 0) $ = "type.googleapis.com";
                                return $ + "/opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile"
                            }, w
                        }(), z
                    }(), Y.Exemplar = function() {
                        function z(H) {
                            if (this.filteredAttributes = [], H) {
                                for (var $ = Object.keys(H), O = 0; O < $.length; ++O)
                                    if (H[$[O]] != null) this[$[O]] = H[$[O]]
                            }
                        }
                        z.prototype.filteredAttributes = g1.emptyArray, z.prototype.timeUnixNano = null, z.prototype.asDouble = null, z.prototype.asInt = null, z.prototype.spanId = null, z.prototype.traceId = null;
                        var w;
                        return Object.defineProperty(z.prototype, "value", {
                            get: g1.oneOfGetter(w = ["asDouble", "asInt"]),
                            set: g1.oneOfSetter(w)
                        }), z.create = function($) {
                            return new z($)
                        }, z.encode = function($, O) {
                            if (!O) O = H5.create();
                            if ($.timeUnixNano != null && Object.hasOwnProperty.call($, "timeUnixNano")) O.uint32(17).fixed64($.timeUnixNano);
                            if ($.asDouble != null && Object.hasOwnProperty.call($, "asDouble")) O.uint32(25).double($.asDouble);
                            if ($.spanId != null && Object.hasOwnProperty.call($, "spanId")) O.uint32(34).bytes($.spanId);
                            if ($.traceId != null && Object.hasOwnProperty.call($, "traceId")) O.uint32(42).bytes($.traceId);
                            if ($.asInt != null && Object.hasOwnProperty.call($, "asInt")) O.uint32(49).sfixed64($.asInt);
                            if ($.filteredAttributes != null && $.filteredAttributes.length)
                                for (var _ = 0; _ < $.filteredAttributes.length; ++_) u1.opentelemetry.proto.common.v1.KeyValue.encode($.filteredAttributes[_], O.uint32(58).fork()).ldelim();
                            return O
                        }, z.encodeDelimited = function($, O) {
                            return this.encode($, O).ldelim()
                        }, z.decode = function($, O, _) {
                            if (!($ instanceof $A)) $ = $A.create($);
                            var J = O === void 0 ? $.len : $.pos + O,
                                X = new u1.opentelemetry.proto.metrics.v1.Exemplar;
                            while ($.pos < J) {
                                var D = $.uint32();
                                if (D === _) break;
                                switch (D >>> 3) {
                                    case 7: {
                                        if (!(X.filteredAttributes && X.filteredAttributes.length)) X.filteredAttributes = [];
                                        X.filteredAttributes.push(u1.opentelemetry.proto.common.v1.KeyValue.decode($, $.uint32()));
                                        break
                                    }
                                    case 2: {
                                        X.timeUnixNano = $.fixed64();
                                        break
                                    }
                                    case 3: {
                                        X.asDouble = $.double();
                                        break
                                    }
                                    case 6: {
                                        X.asInt = $.sfixed64();
                                        break
                                    }
                                    case 4: {
                                        X.spanId = $.bytes();
                                        break
                                    }
                                    case 5: {
                                        X.traceId = $.bytes();
                                        break
                                    }
                                    default:
                                        $.skipType(D & 7);
                                        break
                                }
                            }
                            return X
                        }, z.decodeDelimited = function($) {
                            if (!($ instanceof $A)) $ = new $A($);
                            return this.decode($, $.uint32())
                        }, z.verify = function($) {
                            if (typeof $ !== "object" || $ === null) return "object expected";
                            var O = {};
                            if ($.filteredAttributes != null && $.hasOwnProperty("filteredAttributes")) {
                                if (!Array.isArray($.filteredAttributes)) return "filteredAttributes: array expected";
                                for (var _ = 0; _ < $.filteredAttributes.length; ++_) {
                                    var J = u1.opentelemetry.proto.common.v1.KeyValue.verify($.filteredAttributes[_]);
                                    if (J) return "filteredAttributes." + J
                                }
                            }
                            if ($.timeUnixNano != null && $.hasOwnProperty("timeUnixNano")) {
                                if (!g1.isInteger($.timeUnixNano) && !($.timeUnixNano && g1.isInteger($.timeUnixNano.low) && g1.isInteger($.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if ($.asDouble != null && $.hasOwnProperty("asDouble")) {
                                if (O.value = 1, typeof $.asDouble !== "number") return "asDouble: number expected"
                            }
                            if ($.asInt != null && $.hasOwnProperty("asInt")) {
                                if (O.value === 1) return "value: multiple values";
                                if (O.value = 1, !g1.isInteger($.asInt) && !($.asInt && g1.isInteger($.asInt.low) && g1.isInteger($.asInt.high))) return "asInt: integer|Long expected"
                            }
                            if ($.spanId != null && $.hasOwnProperty("spanId")) {
                                if (!($.spanId && typeof $.spanId.length === "number" || g1.isString($.spanId))) return "spanId: buffer expected"
                            }
                            if ($.traceId != null && $.hasOwnProperty("traceId")) {
                                if (!($.traceId && typeof $.traceId.length === "number" || g1.isString($.traceId))) return "traceId: buffer expected"
                            }
                            return null
                        }, z.fromObject = function($) {
                            if ($ instanceof u1.opentelemetry.proto.metrics.v1.Exemplar) return $;
                            var O = new u1.opentelemetry.proto.metrics.v1.Exemplar;
                            if ($.filteredAttributes) {
                                if (!Array.isArray($.filteredAttributes)) throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: array expected");
                                O.filteredAttributes = [];
                                for (var _ = 0; _ < $.filteredAttributes.length; ++_) {
                                    if (typeof $.filteredAttributes[_] !== "object") throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: object expected");
                                    O.filteredAttributes[_] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject($.filteredAttributes[_])
                                }
                            }
                            if ($.timeUnixNano != null) {
                                if (g1.Long)(O.timeUnixNano = g1.Long.fromValue($.timeUnixNano)).unsigned = !1;
                                else if (typeof $.timeUnixNano === "string") O.timeUnixNano = parseInt($.timeUnixNano, 10);
                                else if (typeof $.timeUnixNano === "number") O.timeUnixNano = $.timeUnixNano;
                                else if (typeof $.timeUnixNano === "object") O.timeUnixNano = new g1.LongBits($.timeUnixNano.low >>> 0, $.timeUnixNano.high >>> 0).toNumber()
                            }
                            if ($.asDouble != null) O.asDouble = Number($.asDouble);
                            if ($.asInt != null) {
                                if (g1.Long)(O.asInt = g1.Long.fromValue($.asInt)).unsigned = !1;
                                else if (typeof $.asInt === "string") O.asInt = parseInt($.asInt, 10);
                                else if (typeof $.asInt === "number") O.asInt = $.asInt;
                                else if (typeof $.asInt === "object") O.asInt = new g1.LongBits($.asInt.low >>> 0, $.asInt.high >>> 0).toNumber()
                            }
                            if ($.spanId != null) {
                                if (typeof $.spanId === "string") g1.base64.decode($.spanId, O.spanId = g1.newBuffer(g1.base64.length($.spanId)), 0);
                                else if ($.spanId.length >= 0) O.spanId = $.spanId
                            }
                            if ($.traceId != null) {
                                if (typeof $.traceId === "string") g1.base64.decode($.traceId, O.traceId = g1.newBuffer(g1.base64.length($.traceId)), 0);
                                else if ($.traceId.length >= 0) O.traceId = $.traceId
                            }
                            return O
                        }, z.toObject = function($, O) {
                            if (!O) O = {};
                            var _ = {};
                            if (O.arrays || O.defaults) _.filteredAttributes = [];
                            if (O.defaults) {
                                if (g1.Long) {
                                    var J = new g1.Long(0, 0, !1);
                                    _.timeUnixNano = O.longs === String ? J.toString() : O.longs === Number ? J.toNumber() : J
                                } else _.timeUnixNano = O.longs === String ? "0" : 0;
                                if (O.bytes === String) _.spanId = "";
                                else if (_.spanId = [], O.bytes !== Array) _.spanId = g1.newBuffer(_.spanId);
                                if (O.bytes === String) _.traceId = "";
                                else if (_.traceId = [], O.bytes !== Array) _.traceId = g1.newBuffer(_.traceId)
                            }
                            if ($.timeUnixNano != null && $.hasOwnProperty("timeUnixNano"))
                                if (typeof $.timeUnixNano === "number") _.timeUnixNano = O.longs === String ? String($.timeUnixNano) : $.timeUnixNano;
                                else _.timeUnixNano = O.longs === String ? g1.Long.prototype.toString.call($.timeUnixNano) : O.longs === Number ? new g1.LongBits($.timeUnixNano.low >>> 0, $.timeUnixNano.high >>> 0).toNumber() : $.timeUnixNano;
                            if ($.asDouble != null && $.hasOwnProperty("asDouble")) {
                                if (_.asDouble = O.json && !isFinite($.asDouble) ? String($.asDouble) : $.asDouble, O.oneofs) _.value = "asDouble"
                            }
                            if ($.spanId != null && $.hasOwnProperty("spanId")) _.spanId = O.bytes === String ? g1.base64.encode($.spanId, 0, $.spanId.length) : O.bytes === Array ? Array.prototype.slice.call($.spanId) : $.spanId;
                            if ($.traceId != null && $.hasOwnProperty("traceId")) _.traceId = O.bytes === String ? g1.base64.encode($.traceId, 0, $.traceId.length) : O.bytes === Array ? Array.prototype.slice.call($.traceId) : $.traceId;
                            if ($.asInt != null && $.hasOwnProperty("asInt")) {
                                if (typeof $.asInt === "number") _.asInt = O.longs === String ? String($.asInt) : $.asInt;
                                else _.asInt = O.longs === String ? g1.Long.prototype.toString.call($.asInt) : O.longs === Number ? new g1.LongBits($.asInt.low >>> 0, $.asInt.high >>> 0).toNumber() : $.asInt;
                                if (O.oneofs) _.value = "asInt"
                            }
                            if ($.filteredAttributes && $.filteredAttributes.length) {
                                _.filteredAttributes = [];
                                for (var X = 0; X < $.filteredAttributes.length; ++X) _.filteredAttributes[X] = u1.opentelemetry.proto.common.v1.KeyValue.toObject($.filteredAttributes[X], O)
                            }
                            return _
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function($) {
                            if ($ === void 0) $ = "type.googleapis.com";
                            return $ + "/opentelemetry.proto.metrics.v1.Exemplar"
                        }, z
                    }(), Y
                }(), K
            }(), q.logs = function() {
                var K = {};
                return K.v1 = function() {
                    var Y = {};
                    return Y.LogsData = function() {
                        function z(w) {
                            if (this.resourceLogs = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.resourceLogs = g1.emptyArray, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.resourceLogs != null && H.resourceLogs.length)
                                for (var O = 0; O < H.resourceLogs.length; ++O) u1.opentelemetry.proto.logs.v1.ResourceLogs.encode(H.resourceLogs[O], $.uint32(10).fork()).ldelim();
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.logs.v1.LogsData;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        if (!(J.resourceLogs && J.resourceLogs.length)) J.resourceLogs = [];
                                        J.resourceLogs.push(u1.opentelemetry.proto.logs.v1.ResourceLogs.decode(H, H.uint32()));
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.resourceLogs != null && H.hasOwnProperty("resourceLogs")) {
                                if (!Array.isArray(H.resourceLogs)) return "resourceLogs: array expected";
                                for (var $ = 0; $ < H.resourceLogs.length; ++$) {
                                    var O = u1.opentelemetry.proto.logs.v1.ResourceLogs.verify(H.resourceLogs[$]);
                                    if (O) return "resourceLogs." + O
                                }
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.logs.v1.LogsData) return H;
                            var $ = new u1.opentelemetry.proto.logs.v1.LogsData;
                            if (H.resourceLogs) {
                                if (!Array.isArray(H.resourceLogs)) throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: array expected");
                                $.resourceLogs = [];
                                for (var O = 0; O < H.resourceLogs.length; ++O) {
                                    if (typeof H.resourceLogs[O] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: object expected");
                                    $.resourceLogs[O] = u1.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(H.resourceLogs[O])
                                }
                            }
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.resourceLogs = [];
                            if (H.resourceLogs && H.resourceLogs.length) {
                                O.resourceLogs = [];
                                for (var _ = 0; _ < H.resourceLogs.length; ++_) O.resourceLogs[_] = u1.opentelemetry.proto.logs.v1.ResourceLogs.toObject(H.resourceLogs[_], $)
                            }
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.logs.v1.LogsData"
                        }, z
                    }(), Y.ResourceLogs = function() {
                        function z(w) {
                            if (this.scopeLogs = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.resource = null, z.prototype.scopeLogs = g1.emptyArray, z.prototype.schemaUrl = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.resource != null && Object.hasOwnProperty.call(H, "resource")) u1.opentelemetry.proto.resource.v1.Resource.encode(H.resource, $.uint32(10).fork()).ldelim();
                            if (H.scopeLogs != null && H.scopeLogs.length)
                                for (var O = 0; O < H.scopeLogs.length; ++O) u1.opentelemetry.proto.logs.v1.ScopeLogs.encode(H.scopeLogs[O], $.uint32(18).fork()).ldelim();
                            if (H.schemaUrl != null && Object.hasOwnProperty.call(H, "schemaUrl")) $.uint32(26).string(H.schemaUrl);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.logs.v1.ResourceLogs;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.resource = u1.opentelemetry.proto.resource.v1.Resource.decode(H, H.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(J.scopeLogs && J.scopeLogs.length)) J.scopeLogs = [];
                                        J.scopeLogs.push(u1.opentelemetry.proto.logs.v1.ScopeLogs.decode(H, H.uint32()));
                                        break
                                    }
                                    case 3: {
                                        J.schemaUrl = H.string();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.resource != null && H.hasOwnProperty("resource")) {
                                var $ = u1.opentelemetry.proto.resource.v1.Resource.verify(H.resource);
                                if ($) return "resource." + $
                            }
                            if (H.scopeLogs != null && H.hasOwnProperty("scopeLogs")) {
                                if (!Array.isArray(H.scopeLogs)) return "scopeLogs: array expected";
                                for (var O = 0; O < H.scopeLogs.length; ++O) {
                                    var $ = u1.opentelemetry.proto.logs.v1.ScopeLogs.verify(H.scopeLogs[O]);
                                    if ($) return "scopeLogs." + $
                                }
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) {
                                if (!g1.isString(H.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.logs.v1.ResourceLogs) return H;
                            var $ = new u1.opentelemetry.proto.logs.v1.ResourceLogs;
                            if (H.resource != null) {
                                if (typeof H.resource !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.resource: object expected");
                                $.resource = u1.opentelemetry.proto.resource.v1.Resource.fromObject(H.resource)
                            }
                            if (H.scopeLogs) {
                                if (!Array.isArray(H.scopeLogs)) throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: array expected");
                                $.scopeLogs = [];
                                for (var O = 0; O < H.scopeLogs.length; ++O) {
                                    if (typeof H.scopeLogs[O] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: object expected");
                                    $.scopeLogs[O] = u1.opentelemetry.proto.logs.v1.ScopeLogs.fromObject(H.scopeLogs[O])
                                }
                            }
                            if (H.schemaUrl != null) $.schemaUrl = String(H.schemaUrl);
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.scopeLogs = [];
                            if ($.defaults) O.resource = null, O.schemaUrl = "";
                            if (H.resource != null && H.hasOwnProperty("resource")) O.resource = u1.opentelemetry.proto.resource.v1.Resource.toObject(H.resource, $);
                            if (H.scopeLogs && H.scopeLogs.length) {
                                O.scopeLogs = [];
                                for (var _ = 0; _ < H.scopeLogs.length; ++_) O.scopeLogs[_] = u1.opentelemetry.proto.logs.v1.ScopeLogs.toObject(H.scopeLogs[_], $)
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) O.schemaUrl = H.schemaUrl;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.logs.v1.ResourceLogs"
                        }, z
                    }(), Y.ScopeLogs = function() {
                        function z(w) {
                            if (this.logRecords = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.scope = null, z.prototype.logRecords = g1.emptyArray, z.prototype.schemaUrl = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.scope != null && Object.hasOwnProperty.call(H, "scope")) u1.opentelemetry.proto.common.v1.InstrumentationScope.encode(H.scope, $.uint32(10).fork()).ldelim();
                            if (H.logRecords != null && H.logRecords.length)
                                for (var O = 0; O < H.logRecords.length; ++O) u1.opentelemetry.proto.logs.v1.LogRecord.encode(H.logRecords[O], $.uint32(18).fork()).ldelim();
                            if (H.schemaUrl != null && Object.hasOwnProperty.call(H, "schemaUrl")) $.uint32(26).string(H.schemaUrl);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.logs.v1.ScopeLogs;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.scope = u1.opentelemetry.proto.common.v1.InstrumentationScope.decode(H, H.uint32());
                                        break
                                    }
                                    case 2: {
                                        if (!(J.logRecords && J.logRecords.length)) J.logRecords = [];
                                        J.logRecords.push(u1.opentelemetry.proto.logs.v1.LogRecord.decode(H, H.uint32()));
                                        break
                                    }
                                    case 3: {
                                        J.schemaUrl = H.string();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.scope != null && H.hasOwnProperty("scope")) {
                                var $ = u1.opentelemetry.proto.common.v1.InstrumentationScope.verify(H.scope);
                                if ($) return "scope." + $
                            }
                            if (H.logRecords != null && H.hasOwnProperty("logRecords")) {
                                if (!Array.isArray(H.logRecords)) return "logRecords: array expected";
                                for (var O = 0; O < H.logRecords.length; ++O) {
                                    var $ = u1.opentelemetry.proto.logs.v1.LogRecord.verify(H.logRecords[O]);
                                    if ($) return "logRecords." + $
                                }
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) {
                                if (!g1.isString(H.schemaUrl)) return "schemaUrl: string expected"
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.logs.v1.ScopeLogs) return H;
                            var $ = new u1.opentelemetry.proto.logs.v1.ScopeLogs;
                            if (H.scope != null) {
                                if (typeof H.scope !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.scope: object expected");
                                $.scope = u1.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(H.scope)
                            }
                            if (H.logRecords) {
                                if (!Array.isArray(H.logRecords)) throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: array expected");
                                $.logRecords = [];
                                for (var O = 0; O < H.logRecords.length; ++O) {
                                    if (typeof H.logRecords[O] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: object expected");
                                    $.logRecords[O] = u1.opentelemetry.proto.logs.v1.LogRecord.fromObject(H.logRecords[O])
                                }
                            }
                            if (H.schemaUrl != null) $.schemaUrl = String(H.schemaUrl);
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.logRecords = [];
                            if ($.defaults) O.scope = null, O.schemaUrl = "";
                            if (H.scope != null && H.hasOwnProperty("scope")) O.scope = u1.opentelemetry.proto.common.v1.InstrumentationScope.toObject(H.scope, $);
                            if (H.logRecords && H.logRecords.length) {
                                O.logRecords = [];
                                for (var _ = 0; _ < H.logRecords.length; ++_) O.logRecords[_] = u1.opentelemetry.proto.logs.v1.LogRecord.toObject(H.logRecords[_], $)
                            }
                            if (H.schemaUrl != null && H.hasOwnProperty("schemaUrl")) O.schemaUrl = H.schemaUrl;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.logs.v1.ScopeLogs"
                        }, z
                    }(), Y.SeverityNumber = function() {
                        var z = {},
                            w = Object.create(z);
                        return w[z[0] = "SEVERITY_NUMBER_UNSPECIFIED"] = 0, w[z[1] = "SEVERITY_NUMBER_TRACE"] = 1, w[z[2] = "SEVERITY_NUMBER_TRACE2"] = 2, w[z[3] = "SEVERITY_NUMBER_TRACE3"] = 3, w[z[4] = "SEVERITY_NUMBER_TRACE4"] = 4, w[z[5] = "SEVERITY_NUMBER_DEBUG"] = 5, w[z[6] = "SEVERITY_NUMBER_DEBUG2"] = 6, w[z[7] = "SEVERITY_NUMBER_DEBUG3"] = 7, w[z[8] = "SEVERITY_NUMBER_DEBUG4"] = 8, w[z[9] = "SEVERITY_NUMBER_INFO"] = 9, w[z[10] = "SEVERITY_NUMBER_INFO2"] = 10, w[z[11] = "SEVERITY_NUMBER_INFO3"] = 11, w[z[12] = "SEVERITY_NUMBER_INFO4"] = 12, w[z[13] = "SEVERITY_NUMBER_WARN"] = 13, w[z[14] = "SEVERITY_NUMBER_WARN2"] = 14, w[z[15] = "SEVERITY_NUMBER_WARN3"] = 15, w[z[16] = "SEVERITY_NUMBER_WARN4"] = 16, w[z[17] = "SEVERITY_NUMBER_ERROR"] = 17, w[z[18] = "SEVERITY_NUMBER_ERROR2"] = 18, w[z[19] = "SEVERITY_NUMBER_ERROR3"] = 19, w[z[20] = "SEVERITY_NUMBER_ERROR4"] = 20, w[z[21] = "SEVERITY_NUMBER_FATAL"] = 21, w[z[22] = "SEVERITY_NUMBER_FATAL2"] = 22, w[z[23] = "SEVERITY_NUMBER_FATAL3"] = 23, w[z[24] = "SEVERITY_NUMBER_FATAL4"] = 24, w
                    }(), Y.LogRecordFlags = function() {
                        var z = {},
                            w = Object.create(z);
                        return w[z[0] = "LOG_RECORD_FLAGS_DO_NOT_USE"] = 0, w[z[255] = "LOG_RECORD_FLAGS_TRACE_FLAGS_MASK"] = 255, w
                    }(), Y.LogRecord = function() {
                        function z(w) {
                            if (this.attributes = [], w) {
                                for (var H = Object.keys(w), $ = 0; $ < H.length; ++$)
                                    if (w[H[$]] != null) this[H[$]] = w[H[$]]
                            }
                        }
                        return z.prototype.timeUnixNano = null, z.prototype.observedTimeUnixNano = null, z.prototype.severityNumber = null, z.prototype.severityText = null, z.prototype.body = null, z.prototype.attributes = g1.emptyArray, z.prototype.droppedAttributesCount = null, z.prototype.flags = null, z.prototype.traceId = null, z.prototype.spanId = null, z.prototype.eventName = null, z.create = function(H) {
                            return new z(H)
                        }, z.encode = function(H, $) {
                            if (!$) $ = H5.create();
                            if (H.timeUnixNano != null && Object.hasOwnProperty.call(H, "timeUnixNano")) $.uint32(9).fixed64(H.timeUnixNano);
                            if (H.severityNumber != null && Object.hasOwnProperty.call(H, "severityNumber")) $.uint32(16).int32(H.severityNumber);
                            if (H.severityText != null && Object.hasOwnProperty.call(H, "severityText")) $.uint32(26).string(H.severityText);
                            if (H.body != null && Object.hasOwnProperty.call(H, "body")) u1.opentelemetry.proto.common.v1.AnyValue.encode(H.body, $.uint32(42).fork()).ldelim();
                            if (H.attributes != null && H.attributes.length)
                                for (var O = 0; O < H.attributes.length; ++O) u1.opentelemetry.proto.common.v1.KeyValue.encode(H.attributes[O], $.uint32(50).fork()).ldelim();
                            if (H.droppedAttributesCount != null && Object.hasOwnProperty.call(H, "droppedAttributesCount")) $.uint32(56).uint32(H.droppedAttributesCount);
                            if (H.flags != null && Object.hasOwnProperty.call(H, "flags")) $.uint32(69).fixed32(H.flags);
                            if (H.traceId != null && Object.hasOwnProperty.call(H, "traceId")) $.uint32(74).bytes(H.traceId);
                            if (H.spanId != null && Object.hasOwnProperty.call(H, "spanId")) $.uint32(82).bytes(H.spanId);
                            if (H.observedTimeUnixNano != null && Object.hasOwnProperty.call(H, "observedTimeUnixNano")) $.uint32(89).fixed64(H.observedTimeUnixNano);
                            if (H.eventName != null && Object.hasOwnProperty.call(H, "eventName")) $.uint32(98).string(H.eventName);
                            return $
                        }, z.encodeDelimited = function(H, $) {
                            return this.encode(H, $).ldelim()
                        }, z.decode = function(H, $, O) {
                            if (!(H instanceof $A)) H = $A.create(H);
                            var _ = $ === void 0 ? H.len : H.pos + $,
                                J = new u1.opentelemetry.proto.logs.v1.LogRecord;
                            while (H.pos < _) {
                                var X = H.uint32();
                                if (X === O) break;
                                switch (X >>> 3) {
                                    case 1: {
                                        J.timeUnixNano = H.fixed64();
                                        break
                                    }
                                    case 11: {
                                        J.observedTimeUnixNano = H.fixed64();
                                        break
                                    }
                                    case 2: {
                                        J.severityNumber = H.int32();
                                        break
                                    }
                                    case 3: {
                                        J.severityText = H.string();
                                        break
                                    }
                                    case 5: {
                                        J.body = u1.opentelemetry.proto.common.v1.AnyValue.decode(H, H.uint32());
                                        break
                                    }
                                    case 6: {
                                        if (!(J.attributes && J.attributes.length)) J.attributes = [];
                                        J.attributes.push(u1.opentelemetry.proto.common.v1.KeyValue.decode(H, H.uint32()));
                                        break
                                    }
                                    case 7: {
                                        J.droppedAttributesCount = H.uint32();
                                        break
                                    }
                                    case 8: {
                                        J.flags = H.fixed32();
                                        break
                                    }
                                    case 9: {
                                        J.traceId = H.bytes();
                                        break
                                    }
                                    case 10: {
                                        J.spanId = H.bytes();
                                        break
                                    }
                                    case 12: {
                                        J.eventName = H.string();
                                        break
                                    }
                                    default:
                                        H.skipType(X & 7);
                                        break
                                }
                            }
                            return J
                        }, z.decodeDelimited = function(H) {
                            if (!(H instanceof $A)) H = new $A(H);
                            return this.decode(H, H.uint32())
                        }, z.verify = function(H) {
                            if (typeof H !== "object" || H === null) return "object expected";
                            if (H.timeUnixNano != null && H.hasOwnProperty("timeUnixNano")) {
                                if (!g1.isInteger(H.timeUnixNano) && !(H.timeUnixNano && g1.isInteger(H.timeUnixNano.low) && g1.isInteger(H.timeUnixNano.high))) return "timeUnixNano: integer|Long expected"
                            }
                            if (H.observedTimeUnixNano != null && H.hasOwnProperty("observedTimeUnixNano")) {
                                if (!g1.isInteger(H.observedTimeUnixNano) && !(H.observedTimeUnixNano && g1.isInteger(H.observedTimeUnixNano.low) && g1.isInteger(H.observedTimeUnixNano.high))) return "observedTimeUnixNano: integer|Long expected"
                            }
                            if (H.severityNumber != null && H.hasOwnProperty("severityNumber")) switch (H.severityNumber) {
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
                            if (H.severityText != null && H.hasOwnProperty("severityText")) {
                                if (!g1.isString(H.severityText)) return "severityText: string expected"
                            }
                            if (H.body != null && H.hasOwnProperty("body")) {
                                var $ = u1.opentelemetry.proto.common.v1.AnyValue.verify(H.body);
                                if ($) return "body." + $
                            }
                            if (H.attributes != null && H.hasOwnProperty("attributes")) {
                                if (!Array.isArray(H.attributes)) return "attributes: array expected";
                                for (var O = 0; O < H.attributes.length; ++O) {
                                    var $ = u1.opentelemetry.proto.common.v1.KeyValue.verify(H.attributes[O]);
                                    if ($) return "attributes." + $
                                }
                            }
                            if (H.droppedAttributesCount != null && H.hasOwnProperty("droppedAttributesCount")) {
                                if (!g1.isInteger(H.droppedAttributesCount)) return "droppedAttributesCount: integer expected"
                            }
                            if (H.flags != null && H.hasOwnProperty("flags")) {
                                if (!g1.isInteger(H.flags)) return "flags: integer expected"
                            }
                            if (H.traceId != null && H.hasOwnProperty("traceId")) {
                                if (!(H.traceId && typeof H.traceId.length === "number" || g1.isString(H.traceId))) return "traceId: buffer expected"
                            }
                            if (H.spanId != null && H.hasOwnProperty("spanId")) {
                                if (!(H.spanId && typeof H.spanId.length === "number" || g1.isString(H.spanId))) return "spanId: buffer expected"
                            }
                            if (H.eventName != null && H.hasOwnProperty("eventName")) {
                                if (!g1.isString(H.eventName)) return "eventName: string expected"
                            }
                            return null
                        }, z.fromObject = function(H) {
                            if (H instanceof u1.opentelemetry.proto.logs.v1.LogRecord) return H;
                            var $ = new u1.opentelemetry.proto.logs.v1.LogRecord;
                            if (H.timeUnixNano != null) {
                                if (g1.Long)($.timeUnixNano = g1.Long.fromValue(H.timeUnixNano)).unsigned = !1;
                                else if (typeof H.timeUnixNano === "string") $.timeUnixNano = parseInt(H.timeUnixNano, 10);
                                else if (typeof H.timeUnixNano === "number") $.timeUnixNano = H.timeUnixNano;
                                else if (typeof H.timeUnixNano === "object") $.timeUnixNano = new g1.LongBits(H.timeUnixNano.low >>> 0, H.timeUnixNano.high >>> 0).toNumber()
                            }
                            if (H.observedTimeUnixNano != null) {
                                if (g1.Long)($.observedTimeUnixNano = g1.Long.fromValue(H.observedTimeUnixNano)).unsigned = !1;
                                else if (typeof H.observedTimeUnixNano === "string") $.observedTimeUnixNano = parseInt(H.observedTimeUnixNano, 10);
                                else if (typeof H.observedTimeUnixNano === "number") $.observedTimeUnixNano = H.observedTimeUnixNano;
                                else if (typeof H.observedTimeUnixNano === "object") $.observedTimeUnixNano = new g1.LongBits(H.observedTimeUnixNano.low >>> 0, H.observedTimeUnixNano.high >>> 0).toNumber()
                            }
                            switch (H.severityNumber) {
                                default:
                                    if (typeof H.severityNumber === "number") {
                                        $.severityNumber = H.severityNumber;
                                        break
                                    }
                                    break;
                                case "SEVERITY_NUMBER_UNSPECIFIED":
                                case 0:
                                    $.severityNumber = 0;
                                    break;
                                case "SEVERITY_NUMBER_TRACE":
                                case 1:
                                    $.severityNumber = 1;
                                    break;
                                case "SEVERITY_NUMBER_TRACE2":
                                case 2:
                                    $.severityNumber = 2;
                                    break;
                                case "SEVERITY_NUMBER_TRACE3":
                                case 3:
                                    $.severityNumber = 3;
                                    break;
                                case "SEVERITY_NUMBER_TRACE4":
                                case 4:
                                    $.severityNumber = 4;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG":
                                case 5:
                                    $.severityNumber = 5;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG2":
                                case 6:
                                    $.severityNumber = 6;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG3":
                                case 7:
                                    $.severityNumber = 7;
                                    break;
                                case "SEVERITY_NUMBER_DEBUG4":
                                case 8:
                                    $.severityNumber = 8;
                                    break;
                                case "SEVERITY_NUMBER_INFO":
                                case 9:
                                    $.severityNumber = 9;
                                    break;
                                case "SEVERITY_NUMBER_INFO2":
                                case 10:
                                    $.severityNumber = 10;
                                    break;
                                case "SEVERITY_NUMBER_INFO3":
                                case 11:
                                    $.severityNumber = 11;
                                    break;
                                case "SEVERITY_NUMBER_INFO4":
                                case 12:
                                    $.severityNumber = 12;
                                    break;
                                case "SEVERITY_NUMBER_WARN":
                                case 13:
                                    $.severityNumber = 13;
                                    break;
                                case "SEVERITY_NUMBER_WARN2":
                                case 14:
                                    $.severityNumber = 14;
                                    break;
                                case "SEVERITY_NUMBER_WARN3":
                                case 15:
                                    $.severityNumber = 15;
                                    break;
                                case "SEVERITY_NUMBER_WARN4":
                                case 16:
                                    $.severityNumber = 16;
                                    break;
                                case "SEVERITY_NUMBER_ERROR":
                                case 17:
                                    $.severityNumber = 17;
                                    break;
                                case "SEVERITY_NUMBER_ERROR2":
                                case 18:
                                    $.severityNumber = 18;
                                    break;
                                case "SEVERITY_NUMBER_ERROR3":
                                case 19:
                                    $.severityNumber = 19;
                                    break;
                                case "SEVERITY_NUMBER_ERROR4":
                                case 20:
                                    $.severityNumber = 20;
                                    break;
                                case "SEVERITY_NUMBER_FATAL":
                                case 21:
                                    $.severityNumber = 21;
                                    break;
                                case "SEVERITY_NUMBER_FATAL2":
                                case 22:
                                    $.severityNumber = 22;
                                    break;
                                case "SEVERITY_NUMBER_FATAL3":
                                case 23:
                                    $.severityNumber = 23;
                                    break;
                                case "SEVERITY_NUMBER_FATAL4":
                                case 24:
                                    $.severityNumber = 24;
                                    break
                            }
                            if (H.severityText != null) $.severityText = String(H.severityText);
                            if (H.body != null) {
                                if (typeof H.body !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.body: object expected");
                                $.body = u1.opentelemetry.proto.common.v1.AnyValue.fromObject(H.body)
                            }
                            if (H.attributes) {
                                if (!Array.isArray(H.attributes)) throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: array expected");
                                $.attributes = [];
                                for (var O = 0; O < H.attributes.length; ++O) {
                                    if (typeof H.attributes[O] !== "object") throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: object expected");
                                    $.attributes[O] = u1.opentelemetry.proto.common.v1.KeyValue.fromObject(H.attributes[O])
                                }
                            }
                            if (H.droppedAttributesCount != null) $.droppedAttributesCount = H.droppedAttributesCount >>> 0;
                            if (H.flags != null) $.flags = H.flags >>> 0;
                            if (H.traceId != null) {
                                if (typeof H.traceId === "string") g1.base64.decode(H.traceId, $.traceId = g1.newBuffer(g1.base64.length(H.traceId)), 0);
                                else if (H.traceId.length >= 0) $.traceId = H.traceId
                            }
                            if (H.spanId != null) {
                                if (typeof H.spanId === "string") g1.base64.decode(H.spanId, $.spanId = g1.newBuffer(g1.base64.length(H.spanId)), 0);
                                else if (H.spanId.length >= 0) $.spanId = H.spanId
                            }
                            if (H.eventName != null) $.eventName = String(H.eventName);
                            return $
                        }, z.toObject = function(H, $) {
                            if (!$) $ = {};
                            var O = {};
                            if ($.arrays || $.defaults) O.attributes = [];
                            if ($.defaults) {
                                if (g1.Long) {
                                    var _ = new g1.Long(0, 0, !1);
                                    O.timeUnixNano = $.longs === String ? _.toString() : $.longs === Number ? _.toNumber() : _
                                } else O.timeUnixNano = $.longs === String ? "0" : 0;
                                if (O.severityNumber = $.enums === String ? "SEVERITY_NUMBER_UNSPECIFIED" : 0, O.severityText = "", O.body = null, O.droppedAttributesCount = 0, O.flags = 0, $.bytes === String) O.traceId = "";
                                else if (O.traceId = [], $.bytes !== Array) O.traceId = g1.newBuffer(O.traceId);
                                if ($.bytes === String) O.spanId = "";
                                else if (O.spanId = [], $.bytes !== Array) O.spanId = g1.newBuffer(O.spanId);
                                if (g1.Long) {
                                    var _ = new g1.Long(0, 0, !1);
                                    O.observedTimeUnixNano = $.longs === String ? _.toString() : $.longs === Number ? _.toNumber() : _
                                } else O.observedTimeUnixNano = $.longs === String ? "0" : 0;
                                O.eventName = ""
                            }
                            if (H.timeUnixNano != null && H.hasOwnProperty("timeUnixNano"))
                                if (typeof H.timeUnixNano === "number") O.timeUnixNano = $.longs === String ? String(H.timeUnixNano) : H.timeUnixNano;
                                else O.timeUnixNano = $.longs === String ? g1.Long.prototype.toString.call(H.timeUnixNano) : $.longs === Number ? new g1.LongBits(H.timeUnixNano.low >>> 0, H.timeUnixNano.high >>> 0).toNumber() : H.timeUnixNano;
                            if (H.severityNumber != null && H.hasOwnProperty("severityNumber")) O.severityNumber = $.enums === String ? u1.opentelemetry.proto.logs.v1.SeverityNumber[H.severityNumber] === void 0 ? H.severityNumber : u1.opentelemetry.proto.logs.v1.SeverityNumber[H.severityNumber] : H.severityNumber;
                            if (H.severityText != null && H.hasOwnProperty("severityText")) O.severityText = H.severityText;
                            if (H.body != null && H.hasOwnProperty("body")) O.body = u1.opentelemetry.proto.common.v1.AnyValue.toObject(H.body, $);
                            if (H.attributes && H.attributes.length) {
                                O.attributes = [];
                                for (var J = 0; J < H.attributes.length; ++J) O.attributes[J] = u1.opentelemetry.proto.common.v1.KeyValue.toObject(H.attributes[J], $)
                            }
                            if (H.droppedAttributesCount != null && H.hasOwnProperty("droppedAttributesCount")) O.droppedAttributesCount = H.droppedAttributesCount;
                            if (H.flags != null && H.hasOwnProperty("flags")) O.flags = H.flags;
                            if (H.traceId != null && H.hasOwnProperty("traceId")) O.traceId = $.bytes === String ? g1.base64.encode(H.traceId, 0, H.traceId.length) : $.bytes === Array ? Array.prototype.slice.call(H.traceId) : H.traceId;
                            if (H.spanId != null && H.hasOwnProperty("spanId")) O.spanId = $.bytes === String ? g1.base64.encode(H.spanId, 0, H.spanId.length) : $.bytes === Array ? Array.prototype.slice.call(H.spanId) : H.spanId;
                            if (H.observedTimeUnixNano != null && H.hasOwnProperty("observedTimeUnixNano"))
                                if (typeof H.observedTimeUnixNano === "number") O.observedTimeUnixNano = $.longs === String ? String(H.observedTimeUnixNano) : H.observedTimeUnixNano;
                                else O.observedTimeUnixNano = $.longs === String ? g1.Long.prototype.toString.call(H.observedTimeUnixNano) : $.longs === Number ? new g1.LongBits(H.observedTimeUnixNano.low >>> 0, H.observedTimeUnixNano.high >>> 0).toNumber() : H.observedTimeUnixNano;
                            if (H.eventName != null && H.hasOwnProperty("eventName")) O.eventName = H.eventName;
                            return O
                        }, z.prototype.toJSON = function() {
                            return this.constructor.toObject(this, JK.util.toJSONOptions)
                        }, z.getTypeUrl = function(H) {
                            if (H === void 0) H = "type.googleapis.com";
                            return H + "/opentelemetry.proto.logs.v1.LogRecord"
                        }, z
                    }(), Y
                }(), K
            }(), q
        }(), A
    }();
    vj4.exports = u1
})