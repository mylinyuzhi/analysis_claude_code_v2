
// @from(Ln 307335, Col 4)
PY6 = x((TWw, Ym4) => {
    Ym4.exports = YE;
    var XT1 = ie();
    ((YE.prototype = Object.create(XT1.prototype)).constructor = YE).className = "OneOf";
    var qm4 = le(),
        DT1 = RX();

    function YE(A, q, K, Y) {
        if (!Array.isArray(q)) K = q, q = void 0;
        if (XT1.call(this, A, K), !(q === void 0 || Array.isArray(q))) throw TypeError("fieldNames must be an Array");
        this.oneof = q || [], this.fieldsArray = [], this.comment = Y
    }
    YE.fromJSON = function(q, K) {
        return new YE(q, K.oneof, K.options, K.comment)
    };
    YE.prototype.toJSON = function(q) {
        var K = q ? Boolean(q.keepComments) : !1;
        return DT1.toObject(["options", this.options, "oneof", this.oneof, "comment", K ? this.comment : void 0])
    };

    function Km4(A) {
        if (A.parent) {
            for (var q = 0; q < A.fieldsArray.length; ++q)
                if (!A.fieldsArray[q].parent) A.parent.add(A.fieldsArray[q])
        }
    }
    YE.prototype.add = function(q) {
        if (!(q instanceof qm4)) throw TypeError("field must be a Field");
        if (q.parent && q.parent !== this.parent) q.parent.remove(q);
        return this.oneof.push(q.name), this.fieldsArray.push(q), q.partOf = this, Km4(this), this
    };
    YE.prototype.remove = function(q) {
        if (!(q instanceof qm4)) throw TypeError("field must be a Field");
        var K = this.fieldsArray.indexOf(q);
        if (K < 0) throw Error(q + " is not a member of " + this);
        if (this.fieldsArray.splice(K, 1), K = this.oneof.indexOf(q.name), K > -1) this.oneof.splice(K, 1);
        return q.partOf = null, this
    };
    YE.prototype.onAdd = function(q) {
        XT1.prototype.onAdd.call(this, q);
        var K = this;
        for (var Y = 0; Y < this.oneof.length; ++Y) {
            var z = q.get(this.oneof[Y]);
            if (z && !z.partOf) z.partOf = K, K.fieldsArray.push(z)
        }
        Km4(this)
    };
    YE.prototype.onRemove = function(q) {
        for (var K = 0, Y; K < this.fieldsArray.length; ++K)
            if ((Y = this.fieldsArray[K]).parent) Y.parent.remove(Y);
        XT1.prototype.onRemove.call(this, q)
    };
    Object.defineProperty(YE.prototype, "isProto3Optional", {
        get: function() {
            if (this.fieldsArray == null || this.fieldsArray.length !== 1) return !1;
            var A = this.fieldsArray[0];
            return A.options != null && A.options.proto3_optional === !0
        }
    });
    YE.d = function() {
        var q = Array(arguments.length),
            K = 0;
        while (K < arguments.length) q[K] = arguments[K++];
        return function(z, _) {
            DT1.decorateType(z.constructor).add(new YE(_, q)), Object.defineProperty(z, _, {
                get: DT1.oneOfGetter(q),
                set: DT1.oneOfSetter(q)
            })
        }
    }
})
// @from(Ln 307406, Col 4)
ie = x((vWw, zm4) => {
    zm4.exports = N0;
    N0.className = "ReflectionObject";
    var nHY = PY6(),
        Md6 = RX(),
        PT1, rHY = {
            enum_type: "OPEN",
            field_presence: "EXPLICIT",
            json_format: "ALLOW",
            message_encoding: "LENGTH_PREFIXED",
            repeated_field_encoding: "PACKED",
            utf8_validation: "VERIFY"
        },
        oHY = {
            enum_type: "CLOSED",
            field_presence: "EXPLICIT",
            json_format: "LEGACY_BEST_EFFORT",
            message_encoding: "LENGTH_PREFIXED",
            repeated_field_encoding: "EXPANDED",
            utf8_validation: "NONE"
        },
        aHY = {
            enum_type: "OPEN",
            field_presence: "IMPLICIT",
            json_format: "ALLOW",
            message_encoding: "LENGTH_PREFIXED",
            repeated_field_encoding: "PACKED",
            utf8_validation: "VERIFY"
        };

    function N0(A, q) {
        if (!Md6.isString(A)) throw TypeError("name must be a string");
        if (q && !Md6.isObject(q)) throw TypeError("options must be an object");
        this.options = q, this.parsedOptions = null, this.name = A, this._edition = null, this._defaultEdition = "proto2", this._features = {}, this._featuresResolved = !1, this.parent = null, this.resolved = !1, this.comment = null, this.filename = null
    }
    Object.defineProperties(N0.prototype, {
        root: {
            get: function() {
                var A = this;
                while (A.parent !== null) A = A.parent;
                return A
            }
        },
        fullName: {
            get: function() {
                var A = [this.name],
                    q = this.parent;
                while (q) A.unshift(q.name), q = q.parent;
                return A.join(".")
            }
        }
    });
    N0.prototype.toJSON = function() {
        throw Error()
    };
    N0.prototype.onAdd = function(q) {
        if (this.parent && this.parent !== q) this.parent.remove(this);
        this.parent = q, this.resolved = !1;
        var K = q.root;
        if (K instanceof PT1) K._handleAdd(this)
    };
    N0.prototype.onRemove = function(q) {
        var K = q.root;
        if (K instanceof PT1) K._handleRemove(this);
        this.parent = null, this.resolved = !1
    };
    N0.prototype.resolve = function() {
        if (this.resolved) return this;
        if (this.root instanceof PT1) this.resolved = !0;
        return this
    };
    N0.prototype._resolveFeaturesRecursive = function(q) {
        return this._resolveFeatures(this._edition || q)
    };
    N0.prototype._resolveFeatures = function(q) {
        if (this._featuresResolved) return;
        var K = {};
        if (!q) throw Error("Unknown edition for " + this.fullName);
        var Y = Object.assign(this.options ? Object.assign({}, this.options.features) : {}, this._inferLegacyProtoFeatures(q));
        if (this._edition) {
            if (q === "proto2") K = Object.assign({}, oHY);
            else if (q === "proto3") K = Object.assign({}, aHY);
            else if (q === "2023") K = Object.assign({}, rHY);
            else throw Error("Unknown edition: " + q);
            this._features = Object.assign(K, Y || {}), this._featuresResolved = !0;
            return
        }
        if (this.partOf instanceof nHY) {
            var z = Object.assign({}, this.partOf._features);
            this._features = Object.assign(z, Y || {})
        } else if (this.declaringField);
        else if (this.parent) {
            var _ = Object.assign({}, this.parent._features);
            this._features = Object.assign(_, Y || {})
        } else throw Error("Unable to find a parent for " + this.fullName);
        if (this.extensionField) this.extensionField._features = this._features;
        this._featuresResolved = !0
    };
    N0.prototype._inferLegacyProtoFeatures = function() {
        return {}
    };
    N0.prototype.getOption = function(q) {
        if (this.options) return this.options[q];
        return
    };
    N0.prototype.setOption = function(q, K, Y) {
        if (!this.options) this.options = {};
        if (/^features\./.test(q)) Md6.setProperty(this.options, q, K, Y);
        else if (!Y || this.options[q] === void 0) {
            if (this.getOption(q) !== K) this.resolved = !1;
            this.options[q] = K
        }
        return this
    };
    N0.prototype.setParsedOption = function(q, K, Y) {
        if (!this.parsedOptions) this.parsedOptions = [];
        var z = this.parsedOptions;
        if (Y) {
            var _ = z.find(function($) {
                return Object.prototype.hasOwnProperty.call($, q)
            });
            if (_) {
                var w = _[q];
                Md6.setProperty(w, Y, K)
            } else _ = {}, _[q] = Md6.setProperty({}, Y, K), z.push(_)
        } else {
            var O = {};
            O[q] = K, z.push(O)
        }
        return this
    };
    N0.prototype.setOptions = function(q, K) {
        if (q)
            for (var Y = Object.keys(q), z = 0; z < Y.length; ++z) this.setOption(Y[z], q[Y[z]], K);
        return this
    };
    N0.prototype.toString = function() {
        var q = this.constructor.className,
            K = this.fullName;
        if (K.length) return q + " " + K;
        return q
    };
    N0.prototype._editionToJSON = function() {
        if (!this._edition || this._edition === "proto3") return;
        return this._edition
    };
    N0._configure = function(A) {
        PT1 = A
    }
})
// @from(Ln 307556, Col 4)
jb = x((NWw, wm4) => {
    wm4.exports = Jb;
    var CC8 = ie();
    ((Jb.prototype = Object.create(CC8.prototype)).constructor = Jb).className = "Enum";
    var _m4 = uG6(),
        WT1 = RX();

    function Jb(A, q, K, Y, z, _) {
        if (CC8.call(this, A, K), q && typeof q !== "object") throw TypeError("values must be an object");
        if (this.valuesById = {}, this.values = Object.create(this.valuesById), this.comment = Y, this.comments = z || {}, this.valuesOptions = _, this._valuesFeatures = {}, this.reserved = void 0, q) {
            for (var w = Object.keys(q), O = 0; O < w.length; ++O)
                if (typeof q[w[O]] === "number") this.valuesById[this.values[w[O]] = q[w[O]]] = w[O]
        }
    }
    Jb.prototype._resolveFeatures = function(q) {
        return q = this._edition || q, CC8.prototype._resolveFeatures.call(this, q), Object.keys(this.values).forEach((K) => {
            var Y = Object.assign({}, this._features);
            this._valuesFeatures[K] = Object.assign(Y, this.valuesOptions && this.valuesOptions[K] && this.valuesOptions[K].features)
        }), this
    };
    Jb.fromJSON = function(q, K) {
        var Y = new Jb(q, K.values, K.options, K.comment, K.comments);
        if (Y.reserved = K.reserved, K.edition) Y._edition = K.edition;
        return Y._defaultEdition = "proto3", Y
    };
    Jb.prototype.toJSON = function(q) {
        var K = q ? Boolean(q.keepComments) : !1;
        return WT1.toObject(["edition", this._editionToJSON(), "options", this.options, "valuesOptions", this.valuesOptions, "values", this.values, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "comment", K ? this.comment : void 0, "comments", K ? this.comments : void 0])
    };
    Jb.prototype.add = function(q, K, Y, z) {
        if (!WT1.isString(q)) throw TypeError("name must be a string");
        if (!WT1.isInteger(K)) throw TypeError("id must be an integer");
        if (this.values[q] !== void 0) throw Error("duplicate name '" + q + "' in " + this);
        if (this.isReservedId(K)) throw Error("id " + K + " is reserved in " + this);
        if (this.isReservedName(q)) throw Error("name '" + q + "' is reserved in " + this);
        if (this.valuesById[K] !== void 0) {
            if (!(this.options && this.options.allow_alias)) throw Error("duplicate id " + K + " in " + this);
            this.values[q] = K
        } else this.valuesById[this.values[q] = K] = q;
        if (z) {
            if (this.valuesOptions === void 0) this.valuesOptions = {};
            this.valuesOptions[q] = z || null
        }
        return this.comments[q] = Y || null, this
    };
    Jb.prototype.remove = function(q) {
        if (!WT1.isString(q)) throw TypeError("name must be a string");
        var K = this.values[q];
        if (K == null) throw Error("name '" + q + "' does not exist in " + this);
        if (delete this.valuesById[K], delete this.values[q], delete this.comments[q], this.valuesOptions) delete this.valuesOptions[q];
        return this
    };
    Jb.prototype.isReservedId = function(q) {
        return _m4.isReservedId(this.reserved, q)
    };
    Jb.prototype.isReservedName = function(q) {
        return _m4.isReservedName(this.reserved, q)
    }
})
// @from(Ln 307615, Col 4)
kC8 = x((VWw, $m4) => {
    $m4.exports = tHY;
    var sHY = jb(),
        IC8 = WY6(),
        bC8 = RX();

    function Om4(A, q, K, Y) {
        return q.delimited ? A("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", K, Y, (q.id << 3 | 3) >>> 0, (q.id << 3 | 4) >>> 0) : A("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", K, Y, (q.id << 3 | 2) >>> 0)
    }

    function tHY(A) {
        var q = bC8.codegen(["m", "w"], A.name + "$encode")("if(!w)")("w=Writer.create()"),
            K, Y, z = A.fieldsArray.slice().sort(bC8.compareFieldsById);
        for (var K = 0; K < z.length; ++K) {
            var _ = z[K].resolve(),
                w = A._fieldsArray.indexOf(_),
                O = _.resolvedType instanceof sHY ? "int32" : _.type,
                $ = IC8.basic[O];
            if (Y = "m" + bC8.safeProp(_.name), _.map) {
                if (q("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", Y, _.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", Y)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (_.id << 3 | 2) >>> 0, 8 | IC8.mapKey[_.keyType], _.keyType), $ === void 0) q("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", w, Y);
                else q(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | $, O, Y);
                q("}")("}")
            } else if (_.repeated) {
                if (q("if(%s!=null&&%s.length){", Y, Y), _.packed && IC8.packed[O] !== void 0) q("w.uint32(%i).fork()", (_.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", Y)("w.%s(%s[i])", O, Y)("w.ldelim()");
                else if (q("for(var i=0;i<%s.length;++i)", Y), $ === void 0) Om4(q, _, w, Y + "[i]");
                else q("w.uint32(%i).%s(%s[i])", (_.id << 3 | $) >>> 0, O, Y);
                q("}")
            } else {
                if (_.optional) q("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", Y, _.name);
                if ($ === void 0) Om4(q, _, w, Y);
                else q("w.uint32(%i).%s(%s)", (_.id << 3 | $) >>> 0, O, Y)
            }
        }
        return q("return w")
    }
})
// @from(Ln 307651, Col 4)
jm4 = x((kWw, Hm4) => {
    var mY = Hm4.exports = hh8();
    mY.build = "light";

    function eHY(A, q, K) {
        if (typeof q === "function") K = q, q = new mY.Root;
        else if (!q) q = new mY.Root;
        return q.load(A, K)
    }
    mY.load = eHY;

    function AjY(A, q) {
        if (!q) q = new mY.Root;
        return q.loadSync(A)
    }
    mY.loadSync = AjY;
    mY.encoder = kC8();
    mY.decoder = DC8();
    mY.verifier = WC8();
    mY.converter = fC8();
    mY.ReflectionObject = ie();
    mY.Namespace = uG6();
    mY.Root = MT1();
    mY.Enum = jb();
    mY.Type = $T1();
    mY.Field = le();
    mY.OneOf = PY6();
    mY.MapField = KT1();
    mY.Service = zT1();
    mY.Method = YT1();
    mY.Message = _T1();
    mY.wrappers = TC8();
    mY.types = WY6();
    mY.util = RX();
    mY.ReflectionObject._configure(mY.Root);
    mY.Namespace._configure(mY.Type, mY.Service, mY.Enum);
    mY.Root._configure(mY.Type);
    mY.Field._configure(mY.Type)
})
// @from(Ln 307690, Col 4)
uC8 = x((EWw, Dm4) => {
    Dm4.exports = Mm4;
    var xC8 = /[\s{}=;:[\],'"()<>]/g,
        qjY = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,
        KjY = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
        YjY = /^ *[*/]+ */,
        zjY = /^\s*\*?\/*/,
        _jY = /\n/g,
        wjY = /\s/,
        OjY = /\\(.?)/g,
        $jY = {
            "0": "\x00",
            r: "\r",
            n: `
`,
            t: "\t"
        };

    function Jm4(A) {
        return A.replace(OjY, function(q, K) {
            switch (K) {
                case "\\":
                case "":
                    return K;
                default:
                    return $jY[K] || ""
            }
        })
    }
    Mm4.unescape = Jm4;

    function Mm4(A, q) {
        A = A.toString();
        var K = 0,
            Y = A.length,
            z = 1,
            _ = 0,
            w = {},
            O = [],
            $ = null;

        function H(v) {
            return Error("illegal " + v + " (line " + z + ")")
        }

        function j() {
            var v = $ === "'" ? KjY : qjY;
            v.lastIndex = K - 1;
            var N = v.exec(A);
            if (!N) throw H("string");
            return K = v.lastIndex, W($), $ = null, Jm4(N[1])
        }

        function J(v) {
            return A.charAt(v)
        }

        function M(v, N, V) {
            var L = {
                    type: A.charAt(v++),
                    lineEmpty: !1,
                    leading: V
                },
                h;
            if (q) h = 2;
            else h = 3;
            var R = v - h,
                u;
            do
                if (--R < 0 || (u = A.charAt(R)) === `
`) {
                    L.lineEmpty = !0;
                    break
                } while (u === " " || u === "\t");
            var I = A.substring(v, N).split(_jY);
            for (var g = 0; g < I.length; ++g) I[g] = I[g].replace(q ? zjY : YjY, "").trim();
            L.text = I.join(`
`).trim(), w[z] = L, _ = z
        }

        function D(v) {
            var N = X(v),
                V = A.substring(v, N),
                L = /^\s*\/\//.test(V);
            return L
        }

        function X(v) {
            var N = v;
            while (N < Y && J(N) !== `
`) N++;
            return N
        }

        function P() {
            if (O.length > 0) return O.shift();
            if ($) return j();
            var v, N, V, L, h, R = K === 0;
            do {
                if (K === Y) return null;
                v = !1;
                while (wjY.test(V = J(K))) {
                    if (V === `
`) R = !0, ++z;
                    if (++K === Y) return null
                }
                if (J(K) === "/") {
                    if (++K === Y) throw H("comment");
                    if (J(K) === "/")
                        if (!q) {
                            h = J(L = K + 1) === "/";
                            while (J(++K) !== `
`)
                                if (K === Y) return null;
                            if (++K, h) M(L, K - 1, R), R = !0;
                            ++z, v = !0
                        } else {
                            if (L = K, h = !1, D(K - 1)) {
                                h = !0;
                                do {
                                    if (K = X(K), K === Y) break;
                                    if (K++, !R) break
                                } while (D(K))
                            } else K = Math.min(Y, X(K) + 1);
                            if (h) M(L, K, R), R = !0;
                            z++, v = !0
                        }
                    else if ((V = J(K)) === "*") {
                        L = K + 1, h = q || J(L) === "*";
                        do {
                            if (V === `
`) ++z;
                            if (++K === Y) throw H("comment");
                            N = V, V = J(K)
                        } while (N !== "*" || V !== "/");
                        if (++K, h) M(L, K - 2, R), R = !0;
                        v = !0
                    } else return "/"
                }
            } while (v);
            var u = K;
            xC8.lastIndex = 0;
            var I = xC8.test(J(u++));
            if (!I)
                while (u < Y && !xC8.test(J(u))) ++u;
            var g = A.substring(K, K = u);
            if (g === '"' || g === "'") $ = g;
            return g
        }

        function W(v) {
            O.push(v)
        }

        function Z() {
            if (!O.length) {
                var v = P();
                if (v === null) return null;
                W(v)
            }
            return O[0]
        }

        function G(v, N) {
            var V = Z(),
                L = V === v;
            if (L) return P(), !0;
            if (!N) throw H("token '" + V + "', '" + v + "' expected");
            return !1
        }

        function f(v) {
            var N = null,
                V;
            if (v === void 0) {
                if (V = w[z - 1], delete w[z - 1], V && (q || V.type === "*" || V.lineEmpty)) N = V.leading ? V.text : null
            } else {
                if (_ < v) Z();
                if (V = w[v], delete w[v], V && !V.lineEmpty && (q || V.type === "/")) N = V.leading ? null : V.text
            }
            return N
        }
        return Object.defineProperty({
            next: P,
            peek: Z,
            push: W,
            skip: G,
            cmnt: f
        }, "line", {
            get: function() {
                return z
            }
        })
    }
})
// @from(Ln 307885, Col 4)
fm4 = x((yWw, Gm4) => {
    Gm4.exports = lc;
    lc.filename = null;
    lc.defaults = {
        keepCase: !1
    };
    var HjY = uC8(),
        Xm4 = MT1(),
        Pm4 = $T1(),
        Wm4 = le(),
        jjY = KT1(),
        Zm4 = PY6(),
        JjY = jb(),
        MjY = zT1(),
        DjY = YT1(),
        XjY = ie(),
        PjY = WY6(),
        mC8 = RX(),
        WjY = /^[1-9][0-9]*$/,
        ZjY = /^-?[1-9][0-9]*$/,
        GjY = /^0[x][0-9a-fA-F]+$/,
        fjY = /^-?0[x][0-9a-fA-F]+$/,
        TjY = /^0[0-7]+$/,
        vjY = /^-?0[0-7]+$/,
        NjY = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/,
        Eg = /^[a-zA-Z_][a-zA-Z_0-9]*$/,
        yg = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/;

    function lc(A, q, K) {
        if (!(q instanceof Xm4)) K = q, q = new Xm4;
        if (!K) K = lc.defaults;
        var Y = K.preferTrailingComment || !1,
            z = HjY(A, K.alternateCommentMode || !1),
            _ = z.next,
            w = z.push,
            O = z.peek,
            $ = z.skip,
            H = z.cmnt,
            j = !0,
            J, M, D, X = "proto2",
            P = q,
            W = [],
            Z = {},
            G = K.keepCase ? function(i) {
                return i
            } : mC8.camelCase;

        function f() {
            W.forEach((i) => {
                i._edition = X, Object.keys(Z).forEach((l) => {
                    if (i.getOption(l) !== void 0) return;
                    i.setOption(l, Z[l], !0)
                })
            })
        }

        function v(i, l, q6) {
            var w6 = lc.filename;
            if (!q6) lc.filename = null;
            return Error("illegal " + (l || "token") + " '" + i + "' (" + (w6 ? w6 + ", " : "") + "line " + z.line + ")")
        }

        function N() {
            var i = [],
                l;
            do {
                if ((l = _()) !== '"' && l !== "'") throw v(l);
                i.push(_()), $(l), l = O()
            } while (l === '"' || l === "'");
            return i.join("")
        }

        function V(i) {
            var l = _();
            switch (l) {
                case "'":
                case '"':
                    return w(l), N();
                case "true":
                case "TRUE":
                    return !0;
                case "false":
                case "FALSE":
                    return !1
            }
            try {
                return h(l, !0)
            } catch (q6) {
                if (i && yg.test(l)) return l;
                throw v(l, "value")
            }
        }

        function L(i, l) {
            var q6, w6;
            do
                if (l && ((q6 = O()) === '"' || q6 === "'")) {
                    var O6 = N();
                    if (i.push(O6), X >= 2023) throw v(O6, "id")
                } else try {
                    i.push([w6 = R(_()), $("to", !0) ? R(_()) : w6])
                } catch (y6) {
                    if (l && yg.test(q6) && X >= 2023) i.push(q6);
                    else throw y6
                }
            while ($(",", !0));
            var L6 = {
                options: void 0
            };
            L6.setOption = function(y6, G6) {
                if (this.options === void 0) this.options = {};
                this.options[y6] = G6
            }, p(L6, function(G6) {
                if (G6 === "option") K6(L6, G6), $(";");
                else throw v(G6)
            }, function() {
                N6(L6)
            })
        }

        function h(i, l) {
            var q6 = 1;
            if (i.charAt(0) === "-") q6 = -1, i = i.substring(1);
            switch (i) {
                case "inf":
                case "INF":
                case "Inf":
                    return q6 * (1 / 0);
                case "nan":
                case "NAN":
                case "Nan":
                case "NaN":
                    return NaN;
                case "0":
                    return 0
            }
            if (WjY.test(i)) return q6 * parseInt(i, 10);
            if (GjY.test(i)) return q6 * parseInt(i, 16);
            if (TjY.test(i)) return q6 * parseInt(i, 8);
            if (NjY.test(i)) return q6 * parseFloat(i);
            throw v(i, "number", l)
        }

        function R(i, l) {
            switch (i) {
                case "max":
                case "MAX":
                case "Max":
                    return 536870911;
                case "0":
                    return 0
            }
            if (!l && i.charAt(0) === "-") throw v(i, "id");
            if (ZjY.test(i)) return parseInt(i, 10);
            if (fjY.test(i)) return parseInt(i, 16);
            if (vjY.test(i)) return parseInt(i, 8);
            throw v(i, "id")
        }

        function u() {
            if (J !== void 0) throw v("package");
            if (J = _(), !yg.test(J)) throw v(J, "name");
            P = P.define(J), $(";")
        }

        function I() {
            var i = O(),
                l;
            switch (i) {
                case "weak":
                    l = D || (D = []), _();
                    break;
                case "public":
                    _();
                default:
                    l = M || (M = []);
                    break
            }
            i = N(), $(";"), l.push(i)
        }

        function g() {
            if ($("="), X = N(), X < 2023) throw v(X, "syntax");
            $(";")
        }

        function B() {
            if ($("="), X = N(), !["2023"].includes(X)) throw v(X, "edition");
            $(";")
        }

        function b(i, l) {
            switch (l) {
                case "option":
                    return K6(i, l), $(";"), !0;
                case "message":
                    return Q(i, l), !0;
                case "enum":
                    return H6(i, l), !0;
                case "service":
                    return $6(i, l), !0;
                case "extend":
                    return o(i, l), !0
            }
            return !1
        }

        function p(i, l, q6) {
            var w6 = z.line;
            if (i) {
                if (typeof i.comment !== "string") i.comment = H();
                i.filename = lc.filename
            }
            if ($("{", !0)) {
                var O6;
                while ((O6 = _()) !== "}") l(O6);
                $(";", !0)
            } else {
                if (q6) q6();
                if ($(";"), i && (typeof i.comment !== "string" || Y)) i.comment = H(w6) || i.comment
            }
        }

        function Q(i, l) {
            if (!Eg.test(l = _())) throw v(l, "type name");
            var q6 = new Pm4(l);
            if (p(q6, function(O6) {
                    if (b(q6, O6)) return;
                    switch (O6) {
                        case "map":
                            e(q6, O6);
                            break;
                        case "required":
                            if (X !== "proto2") throw v(O6);
                        case "repeated":
                            U(q6, O6);
                            break;
                        case "optional":
                            if (X === "proto3") U(q6, "proto3_optional");
                            else if (X !== "proto2") throw v(O6);
                            else U(q6, "optional");
                            break;
                        case "oneof":
                            Y6(q6, O6);
                            break;
                        case "extensions":
                            L(q6.extensions || (q6.extensions = []));
                            break;
                        case "reserved":
                            L(q6.reserved || (q6.reserved = []), !0);
                            break;
                        default:
                            if (X === "proto2" || !yg.test(O6)) throw v(O6);
                            w(O6), U(q6, "optional");
                            break
                    }
                }), i.add(q6), i === P) W.push(q6)
        }

        function U(i, l, q6) {
            var w6 = _();
            if (w6 === "group") {
                r(i, l);
                return
            }
            while (w6.endsWith(".") || O().startsWith(".")) w6 += _();
            if (!yg.test(w6)) throw v(w6, "type");
            var O6 = _();
            if (!Eg.test(O6)) throw v(O6, "name");
            O6 = G(O6), $("=");
            var L6 = new Wm4(O6, R(_()), w6, l, q6);
            if (p(L6, function(R6) {
                    if (R6 === "option") K6(L6, R6), $(";");
                    else throw v(R6)
                }, function() {
                    N6(L6)
                }), l === "proto3_optional") {
                var y6 = new Zm4("_" + O6);
                L6.setOption("proto3_optional", !0), y6.add(L6), i.add(y6)
            } else i.add(L6);
            if (i === P) W.push(L6)
        }

        function r(i, l) {
            if (X >= 2023) throw v("group");
            var q6 = _();
            if (!Eg.test(q6)) throw v(q6, "name");
            var w6 = mC8.lcFirst(q6);
            if (q6 === w6) q6 = mC8.ucFirst(q6);
            $("=");
            var O6 = R(_()),
                L6 = new Pm4(q6);
            L6.group = !0;
            var y6 = new Wm4(w6, O6, q6, l);
            y6.filename = lc.filename, p(L6, function(R6) {
                switch (R6) {
                    case "option":
                        K6(L6, R6), $(";");
                        break;
                    case "required":
                    case "repeated":
                        U(L6, R6);
                        break;
                    case "optional":
                        if (X === "proto3") U(L6, "proto3_optional");
                        else U(L6, "optional");
                        break;
                    case "message":
                        Q(L6, R6);
                        break;
                    case "enum":
                        H6(L6, R6);
                        break;
                    case "reserved":
                        L(L6.reserved || (L6.reserved = []), !0);
                        break;
                    default:
                        throw v(R6)
                }
            }), i.add(L6).add(y6)
        }

        function e(i) {
            $("<");
            var l = _();
            if (PjY.mapKey[l] === void 0) throw v(l, "type");
            $(",");
            var q6 = _();
            if (!yg.test(q6)) throw v(q6, "type");
            $(">");
            var w6 = _();
            if (!Eg.test(w6)) throw v(w6, "name");
            $("=");
            var O6 = new jjY(G(w6), R(_()), l, q6);
            p(O6, function(y6) {
                if (y6 === "option") K6(O6, y6), $(";");
                else throw v(y6)
            }, function() {
                N6(O6)
            }), i.add(O6)
        }

        function Y6(i, l) {
            if (!Eg.test(l = _())) throw v(l, "name");
            var q6 = new Zm4(G(l));
            p(q6, function(O6) {
                if (O6 === "option") K6(q6, O6), $(";");
                else w(O6), U(q6, "optional")
            }), i.add(q6)
        }

        function H6(i, l) {
            if (!Eg.test(l = _())) throw v(l, "name");
            var q6 = new JjY(l);
            if (p(q6, function(O6) {
                    switch (O6) {
                        case "option":
                            K6(q6, O6), $(";");
                            break;
                        case "reserved":
                            if (L(q6.reserved || (q6.reserved = []), !0), q6.reserved === void 0) q6.reserved = [];
                            break;
                        default:
                            J6(q6, O6)
                    }
                }), i.add(q6), i === P) W.push(q6)
        }

        function J6(i, l) {
            if (!Eg.test(l)) throw v(l, "name");
            $("=");
            var q6 = R(_(), !0),
                w6 = {
                    options: void 0
                };
            w6.getOption = function(O6) {
                return this.options[O6]
            }, w6.setOption = function(O6, L6) {
                XjY.prototype.setOption.call(w6, O6, L6)
            }, w6.setParsedOption = function() {
                return
            }, p(w6, function(L6) {
                if (L6 === "option") K6(w6, L6), $(";");
                else throw v(L6)
            }, function() {
                N6(w6)
            }), i.add(l, q6, w6.comment, w6.parsedOptions || w6.options)
        }

        function K6(i, l) {
            var q6, w6, O6 = !0;
            if (l === "option") l = _();
            while (l !== "=") {
                if (l === "(") {
                    var L6 = _();
                    $(")"), l = "(" + L6 + ")"
                }
                if (O6) {
                    if (O6 = !1, l.includes(".") && !l.includes("(")) {
                        var y6 = l.split(".");
                        q6 = y6[0] + ".", l = y6[1];
                        continue
                    }
                    q6 = l
                } else w6 = w6 ? w6 += l : l;
                l = _()
            }
            var G6 = w6 ? q6.concat(w6) : q6,
                R6 = s(i, G6);
            w6 = w6 && w6[0] === "." ? w6.slice(1) : w6, q6 = q6 && q6[q6.length - 1] === "." ? q6.slice(0, -1) : q6, z6(i, q6, R6, w6)
        }

        function s(i, l) {
            if ($("{", !0)) {
                var q6 = {};
                while (!$("}", !0)) {
                    if (!Eg.test(a = _())) throw v(a, "name");
                    if (a === null) throw v(a, "end of input");
                    var w6, O6 = a;
                    if ($(":", !0), O() === "{") w6 = s(i, l + "." + a);
                    else if (O() === "[") {
                        w6 = [];
                        var L6;
                        if ($("[", !0)) {
                            do L6 = V(!0), w6.push(L6); while ($(",", !0));
                            if ($("]"), typeof L6 < "u") X6(i, l + "." + a, L6)
                        }
                    } else w6 = V(!0), X6(i, l + "." + a, w6);
                    var y6 = q6[O6];
                    if (y6) w6 = [].concat(y6).concat(w6);
                    q6[O6] = w6, $(",", !0), $(";", !0)
                }
                return q6
            }
            var G6 = V(!0);
            return X6(i, l, G6), G6
        }

        function X6(i, l, q6) {
            if (P === i && /^features\./.test(l)) {
                Z[l] = q6;
                return
            }
            if (i.setOption) i.setOption(l, q6)
        }

        function z6(i, l, q6, w6) {
            if (i.setParsedOption) i.setParsedOption(l, q6, w6)
        }

        function N6(i) {
            if ($("[", !0)) {
                do K6(i, "option"); while ($(",", !0));
                $("]")
            }
            return i
        }

        function $6(i, l) {
            if (!Eg.test(l = _())) throw v(l, "service name");
            var q6 = new MjY(l);
            if (p(q6, function(O6) {
                    if (b(q6, O6)) return;
                    if (O6 === "rpc") n(q6, O6);
                    else throw v(O6)
                }), i.add(q6), i === P) W.push(q6)
        }

        function n(i, l) {
            var q6 = H(),
                w6 = l;
            if (!Eg.test(l = _())) throw v(l, "name");
            var O6 = l,
                L6, y6, G6, R6;
            if ($("("), $("stream", !0)) y6 = !0;
            if (!yg.test(l = _())) throw v(l);
            if (L6 = l, $(")"), $("returns"), $("("), $("stream", !0)) R6 = !0;
            if (!yg.test(l = _())) throw v(l);
            G6 = l, $(")");
            var T6 = new DjY(O6, w6, L6, G6, y6, R6);
            T6.comment = q6, p(T6, function(Q6) {
                if (Q6 === "option") K6(T6, Q6), $(";");
                else throw v(Q6)
            }), i.add(T6)
        }

        function o(i, l) {
            if (!yg.test(l = _())) throw v(l, "reference");
            var q6 = l;
            p(null, function(O6) {
                switch (O6) {
                    case "required":
                    case "repeated":
                        U(i, O6, q6);
                        break;
                    case "optional":
                        if (X === "proto3") U(i, "proto3_optional", q6);
                        else U(i, "optional", q6);
                        break;
                    default:
                        if (X === "proto2" || !yg.test(O6)) throw v(O6);
                        w(O6), U(i, "optional", q6);
                        break
                }
            })
        }
        var a;
        while ((a = _()) !== null) switch (a) {
            case "package":
                if (!j) throw v(a);
                u();
                break;
            case "import":
                if (!j) throw v(a);
                I();
                break;
            case "syntax":
                if (!j) throw v(a);
                g();
                break;
            case "edition":
                if (!j) throw v(a);
                B();
                break;
            case "option":
                K6(P, a), $(";", !0);
                break;
            default:
                if (b(P, a)) {
                    j = !1;
                    continue
                }
                throw v(a)
        }
        return f(), lc.filename = null, {
            package: J,
            imports: M,
            weakImports: D,
            root: q
        }
    }
})
// @from(Ln 308427, Col 4)
Nm4 = x((LWw, vm4) => {
    vm4.exports = Mb;
    var VjY = /\/|\./;

    function Mb(A, q) {
        if (!VjY.test(A)) A = "google/protobuf/" + A + ".proto", q = {
            nested: {
                google: {
                    nested: {
                        protobuf: {
                            nested: q
                        }
                    }
                }
            }
        };
        Mb[A] = q
    }
    Mb("any", {
        Any: {
            fields: {
                type_url: {
                    type: "string",
                    id: 1
                },
                value: {
                    type: "bytes",
                    id: 2
                }
            }
        }
    });
    var Tm4;
    Mb("duration", {
        Duration: Tm4 = {
            fields: {
                seconds: {
                    type: "int64",
                    id: 1
                },
                nanos: {
                    type: "int32",
                    id: 2
                }
            }
        }
    });
    Mb("timestamp", {
        Timestamp: Tm4
    });
    Mb("empty", {
        Empty: {
            fields: {}
        }
    });
    Mb("struct", {
        Struct: {
            fields: {
                fields: {
                    keyType: "string",
                    type: "Value",
                    id: 1
                }
            }
        },
        Value: {
            oneofs: {
                kind: {
                    oneof: ["nullValue", "numberValue", "stringValue", "boolValue", "structValue", "listValue"]
                }
            },
            fields: {
                nullValue: {
                    type: "NullValue",
                    id: 1
                },
                numberValue: {
                    type: "double",
                    id: 2
                },
                stringValue: {
                    type: "string",
                    id: 3
                },
                boolValue: {
                    type: "bool",
                    id: 4
                },
                structValue: {
                    type: "Struct",
                    id: 5
                },
                listValue: {
                    type: "ListValue",
                    id: 6
                }
            }
        },
        NullValue: {
            values: {
                NULL_VALUE: 0
            }
        },
        ListValue: {
            fields: {
                values: {
                    rule: "repeated",
                    type: "Value",
                    id: 1
                }
            }
        }
    });
    Mb("wrappers", {
        DoubleValue: {
            fields: {
                value: {
                    type: "double",
                    id: 1
                }
            }
        },
        FloatValue: {
            fields: {
                value: {
                    type: "float",
                    id: 1
                }
            }
        },
        Int64Value: {
            fields: {
                value: {
                    type: "int64",
                    id: 1
                }
            }
        },
        UInt64Value: {
            fields: {
                value: {
                    type: "uint64",
                    id: 1
                }
            }
        },
        Int32Value: {
            fields: {
                value: {
                    type: "int32",
                    id: 1
                }
            }
        },
        UInt32Value: {
            fields: {
                value: {
                    type: "uint32",
                    id: 1
                }
            }
        },
        BoolValue: {
            fields: {
                value: {
                    type: "bool",
                    id: 1
                }
            }
        },
        StringValue: {
            fields: {
                value: {
                    type: "string",
                    id: 1
                }
            }
        },
        BytesValue: {
            fields: {
                value: {
                    type: "bytes",
                    id: 1
                }
            }
        }
    });
    Mb("field_mask", {
        FieldMask: {
            fields: {
                paths: {
                    rule: "repeated",
                    type: "string",
                    id: 1
                }
            }
        }
    });
    Mb.get = function(q) {
        return Mb[q] || null
    }
})
// @from(Ln 308629, Col 4)
ZT1 = x((RWw, Vm4) => {
    var re = Vm4.exports = jm4();
    re.build = "full";
    re.tokenize = uC8();
    re.parse = fm4();
    re.common = Nm4();
    re.Root._configure(re.Type, re.parse, re.common)
})