
// @from(Ln 289229, Col 4)
SfA = R((NZ4) => {
    var VZ4 = NZ4,
        gm1 = rh(),
        Hm = Xj();

    function yfA(A, q, K, Y) {
        var z = !1;
        if (q.resolvedType)
            if (q.resolvedType instanceof gm1) {
                A("switch(d%s){", Y);
                for (var w = q.resolvedType.values, H = Object.keys(w), $ = 0; $ < H.length; ++$) {
                    if (w[H[$]] === q.typeDefault && !z) {
                        if (A("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}', Y, Y, Y), !q.repeated) A("break");
                        z = !0
                    }
                    A("case%j:", H[$])("case %i:", w[H[$]])("m%s=%j", Y, w[H[$]])("break")
                }
                A("}")
            } else A('if(typeof d%s!=="object")', Y)("throw TypeError(%j)", q.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", Y, K, Y);
        else {
            var O = !1;
            switch (q.type) {
                case "double":
                case "float":
                    A("m%s=Number(d%s)", Y, Y);
                    break;
                case "uint32":
                case "fixed32":
                    A("m%s=d%s>>>0", Y, Y);
                    break;
                case "int32":
                case "sint32":
                case "sfixed32":
                    A("m%s=d%s|0", Y, Y);
                    break;
                case "uint64":
                    O = !0;
                case "int64":
                case "sint64":
                case "fixed64":
                case "sfixed64":
                    A("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", Y, Y, O)('else if(typeof d%s==="string")', Y)("m%s=parseInt(d%s,10)", Y, Y)('else if(typeof d%s==="number")', Y)("m%s=d%s", Y, Y)('else if(typeof d%s==="object")', Y)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", Y, Y, Y, O ? "true" : "");
                    break;
                case "bytes":
                    A('if(typeof d%s==="string")', Y)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", Y, Y, Y)("else if(d%s.length >= 0)", Y)("m%s=d%s", Y, Y);
                    break;
                case "string":
                    A("m%s=String(d%s)", Y, Y);
                    break;
                case "bool":
                    A("m%s=Boolean(d%s)", Y, Y);
                    break
            }
        }
        return A
    }
    VZ4.fromObject = function(q) {
        var K = q.fieldsArray,
            Y = Hm.codegen(["d"], q.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
        if (!K.length) return Y("return new this.ctor");
        Y("var m=new this.ctor");
        for (var z = 0; z < K.length; ++z) {
            var w = K[z].resolve(),
                H = Hm.safeProp(w.name);
            if (w.map) Y("if(d%s){", H)('if(typeof d%s!=="object")', H)("throw TypeError(%j)", w.fullName + ": object expected")("m%s={}", H)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", H), yfA(Y, w, z, H + "[ks[i]]")("}")("}");
            else if (w.repeated) Y("if(d%s){", H)("if(!Array.isArray(d%s))", H)("throw TypeError(%j)", w.fullName + ": array expected")("m%s=[]", H)("for(var i=0;i<d%s.length;++i){", H), yfA(Y, w, z, H + "[i]")("}")("}");
            else {
                if (!(w.resolvedType instanceof gm1)) Y("if(d%s!=null){", H);
                if (yfA(Y, w, z, H), !(w.resolvedType instanceof gm1)) Y("}")
            }
        }
        return Y("return m")
    };

    function CfA(A, q, K, Y) {
        if (q.resolvedType)
            if (q.resolvedType instanceof gm1) A("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", Y, K, Y, Y, K, Y, Y);
            else A("d%s=types[%i].toObject(m%s,o)", Y, K, Y);
        else {
            var z = !1;
            switch (q.type) {
                case "double":
                case "float":
                    A("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", Y, Y, Y, Y);
                    break;
                case "uint64":
                    z = !0;
                case "int64":
                case "sint64":
                case "fixed64":
                case "sfixed64":
                    A('if(typeof m%s==="number")', Y)("d%s=o.longs===String?String(m%s):m%s", Y, Y, Y)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", Y, Y, Y, Y, z ? "true" : "", Y);
                    break;
                case "bytes":
                    A("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", Y, Y, Y, Y, Y);
                    break;
                default:
                    A("d%s=m%s", Y, Y);
                    break
            }
        }
        return A
    }
    VZ4.toObject = function(q) {
        var K = q.fieldsArray.slice().sort(Hm.compareFieldsById);
        if (!K.length) return Hm.codegen()("return {}");
        var Y = Hm.codegen(["m", "o"], q.name + "$toObject")("if(!o)")("o={}")("var d={}"),
            z = [],
            w = [],
            H = [],
            $ = 0;
        for (; $ < K.length; ++$)
            if (!K[$].partOf)(K[$].resolve().repeated ? z : K[$].map ? w : H).push(K[$]);
        if (z.length) {
            Y("if(o.arrays||o.defaults){");
            for ($ = 0; $ < z.length; ++$) Y("d%s=[]", Hm.safeProp(z[$].name));
            Y("}")
        }
        if (w.length) {
            Y("if(o.objects||o.defaults){");
            for ($ = 0; $ < w.length; ++$) Y("d%s={}", Hm.safeProp(w[$].name));
            Y("}")
        }
        if (H.length) {
            Y("if(o.defaults){");
            for ($ = 0; $ < H.length; ++$) {
                var O = H[$],
                    _ = Hm.safeProp(O.name);
                if (O.resolvedType instanceof gm1) Y("d%s=o.enums===String?%j:%j", _, O.resolvedType.valuesById[O.typeDefault], O.typeDefault);
                else if (O.long) Y("if(util.Long){")("var n=new util.Long(%i,%i,%j)", O.typeDefault.low, O.typeDefault.high, O.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", _)("}else")("d%s=o.longs===String?%j:%i", _, O.typeDefault.toString(), O.typeDefault.toNumber());
                else if (O.bytes) {
                    var J = "[" + Array.prototype.slice.call(O.typeDefault).join(",") + "]";
                    Y("if(o.bytes===String)d%s=%j", _, String.fromCharCode.apply(String, O.typeDefault))("else{")("d%s=%s", _, J)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", _, _)("}")
                } else Y("d%s=%j", _, O.typeDefault)
            }
            Y("}")
        }
        var X = !1;
        for ($ = 0; $ < K.length; ++$) {
            var O = K[$],
                D = q._fieldsArray.indexOf(O),
                _ = Hm.safeProp(O.name);
            if (O.map) {
                if (!X) X = !0, Y("var ks2");
                Y("if(m%s&&(ks2=Object.keys(m%s)).length){", _, _)("d%s={}", _)("for(var j=0;j<ks2.length;++j){"), CfA(Y, O, D, _ + "[ks2[j]]")("}")
            } else if (O.repeated) Y("if(m%s&&m%s.length){", _, _)("d%s=[]", _)("for(var j=0;j<m%s.length;++j){", _), CfA(Y, O, D, _ + "[j]")("}");
            else if (Y("if(m%s!=null&&m.hasOwnProperty(%j)){", _, O.name), CfA(Y, O, D, _), O.partOf) Y("if(o.oneofs)")("d%s=%j", Hm.safeProp(O.partOf.name), O.name);
            Y("}")
        }
        return Y("return d")
    }
})
// @from(Ln 289381, Col 4)
hfA = R((TZ4) => {
    var UzY = TZ4,
        pzY = sD6();
    UzY[".google.protobuf.Any"] = {
        fromObject: function(A) {
            if (A && A["@type"]) {
                var q = A["@type"].substring(A["@type"].lastIndexOf("/") + 1),
                    K = this.lookup(q);
                if (K) {
                    var Y = A["@type"].charAt(0) === "." ? A["@type"].slice(1) : A["@type"];
                    if (Y.indexOf("/") === -1) Y = "/" + Y;
                    return this.create({
                        type_url: Y,
                        value: K.encode(K.fromObject(A)).finish()
                    })
                }
            }
            return this.fromObject(A)
        },
        toObject: function(A, q) {
            var K = "type.googleapis.com/",
                Y = "",
                z = "";
            if (q && q.json && A.type_url && A.value) {
                z = A.type_url.substring(A.type_url.lastIndexOf("/") + 1), Y = A.type_url.substring(0, A.type_url.lastIndexOf("/") + 1);
                var w = this.lookup(z);
                if (w) A = w.decode(A.value)
            }
            if (!(A instanceof this.ctor) && A instanceof pzY) {
                var H = A.$type.toObject(A, q),
                    $ = A.$type.fullName[0] === "." ? A.$type.fullName.slice(1) : A.$type.fullName;
                if (Y === "") Y = K;
                return z = Y + $, H["@type"] = z, H
            }
            return this.toObject(A, q)
        }
    }
})
// @from(Ln 289419, Col 4)
A06 = R((Omw, EZ4) => {
    EZ4.exports = Fw;
    var mR = rM1();
    ((Fw.prototype = Object.create(mR.prototype)).constructor = Fw).className = "Type";
    var dzY = rh(),
        bfA = y31(),
        tD6 = Ls(),
        czY = rD6(),
        lzY = aD6(),
        IfA = sD6(),
        xfA = GD6(),
        izY = PD6(),
        UW = Xj(),
        nzY = ufA(),
        rzY = EfA(),
        ozY = RfA(),
        vZ4 = SfA(),
        azY = hfA();

    function Fw(A, q) {
        mR.call(this, A, q), this.fields = {}, this.oneofs = void 0, this.extensions = void 0, this.reserved = void 0, this.group = void 0, this._fieldsById = null, this._fieldsArray = null, this._oneofsArray = null, this._ctor = null
    }
    Object.defineProperties(Fw.prototype, {
        fieldsById: {
            get: function() {
                if (this._fieldsById) return this._fieldsById;
                this._fieldsById = {};
                for (var A = Object.keys(this.fields), q = 0; q < A.length; ++q) {
                    var K = this.fields[A[q]],
                        Y = K.id;
                    if (this._fieldsById[Y]) throw Error("duplicate id " + Y + " in " + this);
                    this._fieldsById[Y] = K
                }
                return this._fieldsById
            }
        },
        fieldsArray: {
            get: function() {
                return this._fieldsArray || (this._fieldsArray = UW.toArray(this.fields))
            }
        },
        oneofsArray: {
            get: function() {
                return this._oneofsArray || (this._oneofsArray = UW.toArray(this.oneofs))
            }
        },
        ctor: {
            get: function() {
                return this._ctor || (this.ctor = Fw.generateConstructor(this)())
            },
            set: function(A) {
                var q = A.prototype;
                if (!(q instanceof IfA))(A.prototype = new IfA).constructor = A, UW.merge(A.prototype, q);
                A.$type = A.prototype.$type = this, UW.merge(A, IfA, !0), this._ctor = A;
                var K = 0;
                for (; K < this.fieldsArray.length; ++K) this._fieldsArray[K].resolve();
                var Y = {};
                for (K = 0; K < this.oneofsArray.length; ++K) Y[this._oneofsArray[K].resolve().name] = {
                    get: UW.oneOfGetter(this._oneofsArray[K].oneof),
                    set: UW.oneOfSetter(this._oneofsArray[K].oneof)
                };
                if (K) Object.defineProperties(A.prototype, Y)
            }
        }
    });
    Fw.generateConstructor = function(q) {
        var K = UW.codegen(["p"], q.name);
        for (var Y = 0, z; Y < q.fieldsArray.length; ++Y)
            if ((z = q._fieldsArray[Y]).map) K("this%s={}", UW.safeProp(z.name));
            else if (z.repeated) K("this%s=[]", UW.safeProp(z.name));
        return K("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]")
    };

    function eD6(A) {
        return A._fieldsById = A._fieldsArray = A._oneofsArray = null, delete A.encode, delete A.decode, delete A.verify, A
    }
    Fw.fromJSON = function(q, K) {
        var Y = new Fw(q, K.options);
        Y.extensions = K.extensions, Y.reserved = K.reserved;
        var z = Object.keys(K.fields),
            w = 0;
        for (; w < z.length; ++w) Y.add((typeof K.fields[z[w]].keyType < "u" ? czY.fromJSON : tD6.fromJSON)(z[w], K.fields[z[w]]));
        if (K.oneofs)
            for (z = Object.keys(K.oneofs), w = 0; w < z.length; ++w) Y.add(bfA.fromJSON(z[w], K.oneofs[z[w]]));
        if (K.nested)
            for (z = Object.keys(K.nested), w = 0; w < z.length; ++w) {
                var H = K.nested[z[w]];
                Y.add((H.id !== void 0 ? tD6.fromJSON : H.fields !== void 0 ? Fw.fromJSON : H.values !== void 0 ? dzY.fromJSON : H.methods !== void 0 ? lzY.fromJSON : mR.fromJSON)(z[w], H))
            }
        if (K.extensions && K.extensions.length) Y.extensions = K.extensions;
        if (K.reserved && K.reserved.length) Y.reserved = K.reserved;
        if (K.group) Y.group = !0;
        if (K.comment) Y.comment = K.comment;
        if (K.edition) Y._edition = K.edition;
        return Y._defaultEdition = "proto3", Y
    };
    Fw.prototype.toJSON = function(q) {
        var K = mR.prototype.toJSON.call(this, q),
            Y = q ? Boolean(q.keepComments) : !1;
        return UW.toObject(["edition", this._editionToJSON(), "options", K && K.options || void 0, "oneofs", mR.arrayToJSON(this.oneofsArray, q), "fields", mR.arrayToJSON(this.fieldsArray.filter(function(z) {
            return !z.declaringField
        }), q) || {}, "extensions", this.extensions && this.extensions.length ? this.extensions : void 0, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "group", this.group || void 0, "nested", K && K.nested || void 0, "comment", Y ? this.comment : void 0])
    };
    Fw.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        mR.prototype.resolveAll.call(this);
        var q = this.oneofsArray;
        Y = 0;
        while (Y < q.length) q[Y++].resolve();
        var K = this.fieldsArray,
            Y = 0;
        while (Y < K.length) K[Y++].resolve();
        return this
    };
    Fw.prototype._resolveFeaturesRecursive = function(q) {
        if (!this._needsRecursiveFeatureResolution) return this;
        return q = this._edition || q, mR.prototype._resolveFeaturesRecursive.call(this, q), this.oneofsArray.forEach((K) => {
            K._resolveFeatures(q)
        }), this.fieldsArray.forEach((K) => {
            K._resolveFeatures(q)
        }), this
    };
    Fw.prototype.get = function(q) {
        return this.fields[q] || this.oneofs && this.oneofs[q] || this.nested && this.nested[q] || null
    };
    Fw.prototype.add = function(q) {
        if (this.get(q.name)) throw Error("duplicate name '" + q.name + "' in " + this);
        if (q instanceof tD6 && q.extend === void 0) {
            if (this._fieldsById ? this._fieldsById[q.id] : this.fieldsById[q.id]) throw Error("duplicate id " + q.id + " in " + this);
            if (this.isReservedId(q.id)) throw Error("id " + q.id + " is reserved in " + this);
            if (this.isReservedName(q.name)) throw Error("name '" + q.name + "' is reserved in " + this);
            if (q.parent) q.parent.remove(q);
            return this.fields[q.name] = q, q.message = this, q.onAdd(this), eD6(this)
        }
        if (q instanceof bfA) {
            if (!this.oneofs) this.oneofs = {};
            return this.oneofs[q.name] = q, q.onAdd(this), eD6(this)
        }
        return mR.prototype.add.call(this, q)
    };
    Fw.prototype.remove = function(q) {
        if (q instanceof tD6 && q.extend === void 0) {
            if (!this.fields || this.fields[q.name] !== q) throw Error(q + " is not a member of " + this);
            return delete this.fields[q.name], q.parent = null, q.onRemove(this), eD6(this)
        }
        if (q instanceof bfA) {
            if (!this.oneofs || this.oneofs[q.name] !== q) throw Error(q + " is not a member of " + this);
            return delete this.oneofs[q.name], q.parent = null, q.onRemove(this), eD6(this)
        }
        return mR.prototype.remove.call(this, q)
    };
    Fw.prototype.isReservedId = function(q) {
        return mR.isReservedId(this.reserved, q)
    };
    Fw.prototype.isReservedName = function(q) {
        return mR.isReservedName(this.reserved, q)
    };
    Fw.prototype.create = function(q) {
        return new this.ctor(q)
    };
    Fw.prototype.setup = function() {
        var q = this.fullName,
            K = [];
        for (var Y = 0; Y < this.fieldsArray.length; ++Y) K.push(this._fieldsArray[Y].resolve().resolvedType);
        this.encode = nzY(this)({
            Writer: izY,
            types: K,
            util: UW
        }), this.decode = rzY(this)({
            Reader: xfA,
            types: K,
            util: UW
        }), this.verify = ozY(this)({
            types: K,
            util: UW
        }), this.fromObject = vZ4.fromObject(this)({
            types: K,
            util: UW
        }), this.toObject = vZ4.toObject(this)({
            types: K,
            util: UW
        });
        var z = azY[q];
        if (z) {
            var w = Object.create(this);
            w.fromObject = this.fromObject, this.fromObject = z.fromObject.bind(w), w.toObject = this.toObject, this.toObject = z.toObject.bind(w)
        }
        return this
    };
    Fw.prototype.encode = function(q, K) {
        return this.setup().encode(q, K)
    };
    Fw.prototype.encodeDelimited = function(q, K) {
        return this.encode(q, K && K.len ? K.fork() : K).ldelim()
    };
    Fw.prototype.decode = function(q, K) {
        return this.setup().decode(q, K)
    };
    Fw.prototype.decodeDelimited = function(q) {
        if (!(q instanceof xfA)) q = xfA.create(q);
        return this.decode(q, q.uint32())
    };
    Fw.prototype.verify = function(q) {
        return this.setup().verify(q)
    };
    Fw.prototype.fromObject = function(q) {
        return this.setup().fromObject(q)
    };
    Fw.prototype.toObject = function(q, K) {
        return this.setup().toObject(q, K)
    };
    Fw.d = function(q) {
        return function(Y) {
            UW.decorateType(Y, q)
        }
    }
})
// @from(Ln 289636, Col 4)
z06 = R((_mw, RZ4) => {
    RZ4.exports = Fv;
    var Y06 = rM1();
    ((Fv.prototype = Object.create(Y06.prototype)).constructor = Fv).className = "Root";
    var q06 = Ls(),
        BfA = rh(),
        szY = y31(),
        ys = Xj(),
        mfA, FfA, Um1;

    function Fv(A) {
        Y06.call(this, "", A), this.deferred = [], this.files = [], this._edition = "proto2", this._fullyQualifiedObjects = {}
    }
    Fv.fromJSON = function(q, K) {
        if (!K) K = new Fv;
        if (q.options) K.setOptions(q.options);
        return K.addJSON(q.nested).resolveAll()
    };
    Fv.prototype.resolvePath = ys.path.resolve;
    Fv.prototype.fetch = ys.fetch;

    function LZ4() {}
    Fv.prototype.load = function A(q, K, Y) {
        if (typeof K === "function") Y = K, K = void 0;
        var z = this;
        if (!Y) return ys.asPromise(A, z, q, K);
        var w = Y === LZ4;

        function H(j, M) {
            if (!Y) return;
            if (w) throw j;
            if (M) M.resolveAll();
            var P = Y;
            Y = null, P(j, M)
        }

        function $(j) {
            var M = j.lastIndexOf("google/protobuf/");
            if (M > -1) {
                var P = j.substring(M);
                if (P in Um1) return P
            }
            return null
        }

        function O(j, M) {
            try {
                if (ys.isString(M) && M.charAt(0) === "{") M = JSON.parse(M);
                if (!ys.isString(M)) z.setOptions(M.options).addJSON(M.nested);
                else {
                    FfA.filename = j;
                    var P = FfA(M, z, K),
                        W, G = 0;
                    if (P.imports) {
                        for (; G < P.imports.length; ++G)
                            if (W = $(P.imports[G]) || z.resolvePath(j, P.imports[G])) _(W)
                    }
                    if (P.weakImports) {
                        for (G = 0; G < P.weakImports.length; ++G)
                            if (W = $(P.weakImports[G]) || z.resolvePath(j, P.weakImports[G])) _(W, !0)
                    }
                }
            } catch (f) {
                H(f)
            }
            if (!w && !J) H(null, z)
        }

        function _(j, M) {
            if (j = $(j) || j, z.files.indexOf(j) > -1) return;
            if (z.files.push(j), j in Um1) {
                if (w) O(j, Um1[j]);
                else ++J, setTimeout(function() {
                    --J, O(j, Um1[j])
                });
                return
            }
            if (w) {
                var P;
                try {
                    P = ys.fs.readFileSync(j).toString("utf8")
                } catch (W) {
                    if (!M) H(W);
                    return
                }
                O(j, P)
            } else ++J, z.fetch(j, function(W, G) {
                if (--J, !Y) return;
                if (W) {
                    if (!M) H(W);
                    else if (!J) H(null, z);
                    return
                }
                O(j, G)
            })
        }
        var J = 0;
        if (ys.isString(q)) q = [q];
        for (var X = 0, D; X < q.length; ++X)
            if (D = z.resolvePath("", q[X])) _(D);
        if (w) return z.resolveAll(), z;
        if (!J) H(null, z);
        return z
    };
    Fv.prototype.loadSync = function(q, K) {
        if (!ys.isNode) throw Error("not supported");
        return this.load(q, K, LZ4)
    };
    Fv.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        if (this.deferred.length) throw Error("unresolvable extensions: " + this.deferred.map(function(q) {
            return "'extend " + q.extend + "' in " + q.parent.fullName
        }).join(", "));
        return Y06.prototype.resolveAll.call(this)
    };
    var K06 = /^[A-Z]/;

    function kZ4(A, q) {
        var K = q.parent.lookup(q.extend);
        if (K) {
            var Y = new q06(q.fullName, q.id, q.type, q.rule, void 0, q.options);
            if (K.get(Y.name)) return !0;
            return Y.declaringField = q, q.extensionField = Y, K.add(Y), !0
        }
        return !1
    }
    Fv.prototype._handleAdd = function(q) {
        if (q instanceof q06) {
            if (q.extend !== void 0 && !q.extensionField) {
                if (!kZ4(this, q)) this.deferred.push(q)
            }
        } else if (q instanceof BfA) {
            if (K06.test(q.name)) q.parent[q.name] = q.values
        } else if (!(q instanceof szY)) {
            if (q instanceof mfA)
                for (var K = 0; K < this.deferred.length;)
                    if (kZ4(this, this.deferred[K])) this.deferred.splice(K, 1);
                    else ++K;
            for (var Y = 0; Y < q.nestedArray.length; ++Y) this._handleAdd(q._nestedArray[Y]);
            if (K06.test(q.name)) q.parent[q.name] = q
        }
        if (q instanceof mfA || q instanceof BfA || q instanceof q06) this._fullyQualifiedObjects[q.fullName] = q
    };
    Fv.prototype._handleRemove = function(q) {
        if (q instanceof q06) {
            if (q.extend !== void 0)
                if (q.extensionField) q.extensionField.parent.remove(q.extensionField), q.extensionField = null;
                else {
                    var K = this.deferred.indexOf(q);
                    if (K > -1) this.deferred.splice(K, 1)
                }
        } else if (q instanceof BfA) {
            if (K06.test(q.name)) delete q.parent[q.name]
        } else if (q instanceof Y06) {
            for (var Y = 0; Y < q.nestedArray.length; ++Y) this._handleRemove(q._nestedArray[Y]);
            if (K06.test(q.name)) delete q.parent[q.name]
        }
        delete this._fullyQualifiedObjects[q.fullName]
    };
    Fv._configure = function(A, q, K) {
        mfA = A, FfA = q, Um1 = K
    }
})
// @from(Ln 289799, Col 4)
Xj = R((Jmw, CZ4) => {
    var kJ = CZ4.exports = Am(),
        yZ4 = MZA(),
        QfA, gfA;
    kJ.codegen = YZ4();
    kJ.fetch = wZ4();
    kJ.path = OZ4();
    kJ.fs = kJ.inquire("fs");
    kJ.toArray = function(q) {
        if (q) {
            var K = Object.keys(q),
                Y = Array(K.length),
                z = 0;
            while (z < K.length) Y[z] = q[K[z++]];
            return Y
        }
        return []
    };
    kJ.toObject = function(q) {
        var K = {},
            Y = 0;
        while (Y < q.length) {
            var z = q[Y++],
                w = q[Y++];
            if (w !== void 0) K[z] = w
        }
        return K
    };
    var tzY = /\\/g,
        ezY = /"/g;
    kJ.isReserved = function(q) {
        return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(q)
    };
    kJ.safeProp = function(q) {
        if (!/^[$\w_]+$/.test(q) || kJ.isReserved(q)) return '["' + q.replace(tzY, "\\\\").replace(ezY, "\\\"") + '"]';
        return "." + q
    };
    kJ.ucFirst = function(q) {
        return q.charAt(0).toUpperCase() + q.substring(1)
    };
    var A2Y = /_([a-z])/g;
    kJ.camelCase = function(q) {
        return q.substring(0, 1) + q.substring(1).replace(A2Y, function(K, Y) {
            return Y.toUpperCase()
        })
    };
    kJ.compareFieldsById = function(q, K) {
        return q.id - K.id
    };
    kJ.decorateType = function(q, K) {
        if (q.$type) {
            if (K && q.$type.name !== K) kJ.decorateRoot.remove(q.$type), q.$type.name = K, kJ.decorateRoot.add(q.$type);
            return q.$type
        }
        if (!QfA) QfA = A06();
        var Y = new QfA(K || q.name);
        return kJ.decorateRoot.add(Y), Y.ctor = q, Object.defineProperty(q, "$type", {
            value: Y,
            enumerable: !1
        }), Object.defineProperty(q.prototype, "$type", {
            value: Y,
            enumerable: !1
        }), Y
    };
    var q2Y = 0;
    kJ.decorateEnum = function(q) {
        if (q.$type) return q.$type;
        if (!gfA) gfA = rh();
        var K = new gfA("Enum" + q2Y++, q);
        return kJ.decorateRoot.add(K), Object.defineProperty(q, "$type", {
            value: K,
            enumerable: !1
        }), K
    };
    kJ.setProperty = function(q, K, Y, z) {
        function w(H, $, O) {
            var _ = $.shift();
            if (_ === "__proto__" || _ === "prototype") return H;
            if ($.length > 0) H[_] = w(H[_] || {}, $, O);
            else {
                var J = H[_];
                if (J && z) return H;
                if (J) O = [].concat(J).concat(O);
                H[_] = O
            }
            return H
        }
        if (typeof q !== "object") throw TypeError("dst must be an object");
        if (!K) throw TypeError("path must be specified");
        return K = K.split("."), w(q, K, Y)
    };
    Object.defineProperty(kJ, "decorateRoot", {
        get: function() {
            return yZ4.decorated || (yZ4.decorated = new(z06()))
        }
    })
})
// @from(Ln 289896, Col 4)
C31 = R((SZ4) => {
    var pm1 = SZ4,
        K2Y = Xj(),
        Y2Y = ["double", "float", "int32", "uint32", "sint32", "fixed32", "sfixed32", "int64", "uint64", "sint64", "fixed64", "sfixed64", "bool", "string", "bytes"];

    function dm1(A, q) {
        var K = 0,
            Y = {};
        q |= 0;
        while (K < A.length) Y[Y2Y[K + q]] = A[K++];
        return Y
    }
    pm1.basic = dm1([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2, 2]);
    pm1.defaults = dm1([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, !1, "", K2Y.emptyArray, null]);
    pm1.long = dm1([0, 0, 0, 1, 1], 7);
    pm1.mapKey = dm1([0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2], 2);
    pm1.packed = dm1([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0])
})
// @from(Ln 289914, Col 4)
Ls = R((Dmw, IZ4) => {
    IZ4.exports = Dj;
    var lm1 = Rs();
    ((Dj.prototype = Object.create(lm1.prototype)).constructor = Dj).className = "Field";
    var hZ4 = rh(),
        UfA = C31(),
        lX = Xj(),
        cm1, z2Y = /^required|optional|repeated$/;
    Dj.fromJSON = function(q, K) {
        var Y = new Dj(q, K.id, K.type, K.rule, K.extend, K.options, K.comment);
        if (K.edition) Y._edition = K.edition;
        return Y._defaultEdition = "proto3", Y
    };

    function Dj(A, q, K, Y, z, w, H) {
        if (lX.isObject(Y)) H = z, w = Y, Y = z = void 0;
        else if (lX.isObject(z)) H = w, w = z, z = void 0;
        if (lm1.call(this, A, w), !lX.isInteger(q) || q < 0) throw TypeError("id must be a non-negative integer");
        if (!lX.isString(K)) throw TypeError("type must be a string");
        if (Y !== void 0 && !z2Y.test(Y = Y.toString().toLowerCase())) throw TypeError("rule must be a string rule");
        if (z !== void 0 && !lX.isString(z)) throw TypeError("extend must be a string");
        if (Y === "proto3_optional") Y = "optional";
        this.rule = Y && Y !== "optional" ? Y : void 0, this.type = K, this.id = q, this.extend = z || void 0, this.repeated = Y === "repeated", this.map = !1, this.message = null, this.partOf = null, this.typeDefault = null, this.defaultValue = null, this.long = lX.Long ? UfA.long[K] !== void 0 : !1, this.bytes = K === "bytes", this.resolvedType = null, this.extensionField = null, this.declaringField = null, this.comment = H
    }
    Object.defineProperty(Dj.prototype, "required", {
        get: function() {
            return this._features.field_presence === "LEGACY_REQUIRED"
        }
    });
    Object.defineProperty(Dj.prototype, "optional", {
        get: function() {
            return !this.required
        }
    });
    Object.defineProperty(Dj.prototype, "delimited", {
        get: function() {
            return this.resolvedType instanceof cm1 && this._features.message_encoding === "DELIMITED"
        }
    });
    Object.defineProperty(Dj.prototype, "packed", {
        get: function() {
            return this._features.repeated_field_encoding === "PACKED"
        }
    });
    Object.defineProperty(Dj.prototype, "hasPresence", {
        get: function() {
            if (this.repeated || this.map) return !1;
            return this.partOf || this.declaringField || this.extensionField || this._features.field_presence !== "IMPLICIT"
        }
    });
    Dj.prototype.setOption = function(q, K, Y) {
        return lm1.prototype.setOption.call(this, q, K, Y)
    };
    Dj.prototype.toJSON = function(q) {
        var K = q ? Boolean(q.keepComments) : !1;
        return lX.toObject(["edition", this._editionToJSON(), "rule", this.rule !== "optional" && this.rule || void 0, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", K ? this.comment : void 0])
    };
    Dj.prototype.resolve = function() {
        if (this.resolved) return this;
        if ((this.typeDefault = UfA.defaults[this.type]) === void 0)
            if (this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type), this.resolvedType instanceof cm1) this.typeDefault = null;
            else this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
        else if (this.options && this.options.proto3_optional) this.typeDefault = null;
        if (this.options && this.options.default != null) {
            if (this.typeDefault = this.options.default, this.resolvedType instanceof hZ4 && typeof this.typeDefault === "string") this.typeDefault = this.resolvedType.values[this.typeDefault]
        }
        if (this.options) {
            if (this.options.packed !== void 0 && this.resolvedType && !(this.resolvedType instanceof hZ4)) delete this.options.packed;
            if (!Object.keys(this.options).length) this.options = void 0
        }
        if (this.long) {
            if (this.typeDefault = lX.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u"), Object.freeze) Object.freeze(this.typeDefault)
        } else if (this.bytes && typeof this.typeDefault === "string") {
            var q;
            if (lX.base64.test(this.typeDefault)) lX.base64.decode(this.typeDefault, q = lX.newBuffer(lX.base64.length(this.typeDefault)), 0);
            else lX.utf8.write(this.typeDefault, q = lX.newBuffer(lX.utf8.length(this.typeDefault)), 0);
            this.typeDefault = q
        }
        if (this.map) this.defaultValue = lX.emptyObject;
        else if (this.repeated) this.defaultValue = lX.emptyArray;
        else this.defaultValue = this.typeDefault;
        if (this.parent instanceof cm1) this.parent.ctor.prototype[this.name] = this.defaultValue;
        return lm1.prototype.resolve.call(this)
    };
    Dj.prototype._inferLegacyProtoFeatures = function(q) {
        if (q !== "proto2" && q !== "proto3") return {};
        var K = {};
        if (this.rule === "required") K.field_presence = "LEGACY_REQUIRED";
        if (this.parent && UfA.defaults[this.type] === void 0) {
            var Y = this.parent.get(this.type.split(".").pop());
            if (Y && Y instanceof cm1 && Y.group) K.message_encoding = "DELIMITED"
        }
        if (this.getOption("packed") === !0) K.repeated_field_encoding = "PACKED";
        else if (this.getOption("packed") === !1) K.repeated_field_encoding = "EXPANDED";
        return K
    };
    Dj.prototype._resolveFeatures = function(q) {
        return lm1.prototype._resolveFeatures.call(this, this._edition || q)
    };
    Dj.d = function(q, K, Y, z) {
        if (typeof K === "function") K = lX.decorateType(K).name;
        else if (K && typeof K === "object") K = lX.decorateEnum(K).name;
        return function(H, $) {
            lX.decorateType(H.constructor).add(new Dj($, q, K, Y, {
                default: z
            }))
        }
    };
    Dj._configure = function(q) {
        cm1 = q
    }
})
// @from(Ln 290026, Col 4)
y31 = R((jmw, uZ4) => {
    uZ4.exports = Qv;
    var H06 = Rs();
    ((Qv.prototype = Object.create(H06.prototype)).constructor = Qv).className = "OneOf";
    var xZ4 = Ls(),
        w06 = Xj();

    function Qv(A, q, K, Y) {
        if (!Array.isArray(q)) K = q, q = void 0;
        if (H06.call(this, A, K), !(q === void 0 || Array.isArray(q))) throw TypeError("fieldNames must be an Array");
        this.oneof = q || [], this.fieldsArray = [], this.comment = Y
    }
    Qv.fromJSON = function(q, K) {
        return new Qv(q, K.oneof, K.options, K.comment)
    };
    Qv.prototype.toJSON = function(q) {
        var K = q ? Boolean(q.keepComments) : !1;
        return w06.toObject(["options", this.options, "oneof", this.oneof, "comment", K ? this.comment : void 0])
    };

    function bZ4(A) {
        if (A.parent) {
            for (var q = 0; q < A.fieldsArray.length; ++q)
                if (!A.fieldsArray[q].parent) A.parent.add(A.fieldsArray[q])
        }
    }
    Qv.prototype.add = function(q) {
        if (!(q instanceof xZ4)) throw TypeError("field must be a Field");
        if (q.parent && q.parent !== this.parent) q.parent.remove(q);
        return this.oneof.push(q.name), this.fieldsArray.push(q), q.partOf = this, bZ4(this), this
    };
    Qv.prototype.remove = function(q) {
        if (!(q instanceof xZ4)) throw TypeError("field must be a Field");
        var K = this.fieldsArray.indexOf(q);
        if (K < 0) throw Error(q + " is not a member of " + this);
        if (this.fieldsArray.splice(K, 1), K = this.oneof.indexOf(q.name), K > -1) this.oneof.splice(K, 1);
        return q.partOf = null, this
    };
    Qv.prototype.onAdd = function(q) {
        H06.prototype.onAdd.call(this, q);
        var K = this;
        for (var Y = 0; Y < this.oneof.length; ++Y) {
            var z = q.get(this.oneof[Y]);
            if (z && !z.partOf) z.partOf = K, K.fieldsArray.push(z)
        }
        bZ4(this)
    };
    Qv.prototype.onRemove = function(q) {
        for (var K = 0, Y; K < this.fieldsArray.length; ++K)
            if ((Y = this.fieldsArray[K]).parent) Y.parent.remove(Y);
        H06.prototype.onRemove.call(this, q)
    };
    Object.defineProperty(Qv.prototype, "isProto3Optional", {
        get: function() {
            if (this.fieldsArray == null || this.fieldsArray.length !== 1) return !1;
            var A = this.fieldsArray[0];
            return A.options != null && A.options.proto3_optional === !0
        }
    });
    Qv.d = function() {
        var q = Array(arguments.length),
            K = 0;
        while (K < arguments.length) q[K] = arguments[K++];
        return function(z, w) {
            w06.decorateType(z.constructor).add(new Qv(w, q)), Object.defineProperty(z, w, {
                get: w06.oneOfGetter(q),
                set: w06.oneOfSetter(q)
            })
        }
    }
})
// @from(Ln 290097, Col 4)
Rs = R((Mmw, BZ4) => {
    BZ4.exports = tM;
    tM.className = "ReflectionObject";
    var w2Y = y31(),
        im1 = Xj(),
        $06, H2Y = {
            enum_type: "OPEN",
            field_presence: "EXPLICIT",
            json_format: "ALLOW",
            message_encoding: "LENGTH_PREFIXED",
            repeated_field_encoding: "PACKED",
            utf8_validation: "VERIFY"
        },
        $2Y = {
            enum_type: "CLOSED",
            field_presence: "EXPLICIT",
            json_format: "LEGACY_BEST_EFFORT",
            message_encoding: "LENGTH_PREFIXED",
            repeated_field_encoding: "EXPANDED",
            utf8_validation: "NONE"
        },
        O2Y = {
            enum_type: "OPEN",
            field_presence: "IMPLICIT",
            json_format: "ALLOW",
            message_encoding: "LENGTH_PREFIXED",
            repeated_field_encoding: "PACKED",
            utf8_validation: "VERIFY"
        };

    function tM(A, q) {
        if (!im1.isString(A)) throw TypeError("name must be a string");
        if (q && !im1.isObject(q)) throw TypeError("options must be an object");
        this.options = q, this.parsedOptions = null, this.name = A, this._edition = null, this._defaultEdition = "proto2", this._features = {}, this._featuresResolved = !1, this.parent = null, this.resolved = !1, this.comment = null, this.filename = null
    }
    Object.defineProperties(tM.prototype, {
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
    tM.prototype.toJSON = function() {
        throw Error()
    };
    tM.prototype.onAdd = function(q) {
        if (this.parent && this.parent !== q) this.parent.remove(this);
        this.parent = q, this.resolved = !1;
        var K = q.root;
        if (K instanceof $06) K._handleAdd(this)
    };
    tM.prototype.onRemove = function(q) {
        var K = q.root;
        if (K instanceof $06) K._handleRemove(this);
        this.parent = null, this.resolved = !1
    };
    tM.prototype.resolve = function() {
        if (this.resolved) return this;
        if (this.root instanceof $06) this.resolved = !0;
        return this
    };
    tM.prototype._resolveFeaturesRecursive = function(q) {
        return this._resolveFeatures(this._edition || q)
    };
    tM.prototype._resolveFeatures = function(q) {
        if (this._featuresResolved) return;
        var K = {};
        if (!q) throw Error("Unknown edition for " + this.fullName);
        var Y = Object.assign(this.options ? Object.assign({}, this.options.features) : {}, this._inferLegacyProtoFeatures(q));
        if (this._edition) {
            if (q === "proto2") K = Object.assign({}, $2Y);
            else if (q === "proto3") K = Object.assign({}, O2Y);
            else if (q === "2023") K = Object.assign({}, H2Y);
            else throw Error("Unknown edition: " + q);
            this._features = Object.assign(K, Y || {}), this._featuresResolved = !0;
            return
        }
        if (this.partOf instanceof w2Y) {
            var z = Object.assign({}, this.partOf._features);
            this._features = Object.assign(z, Y || {})
        } else if (this.declaringField);
        else if (this.parent) {
            var w = Object.assign({}, this.parent._features);
            this._features = Object.assign(w, Y || {})
        } else throw Error("Unable to find a parent for " + this.fullName);
        if (this.extensionField) this.extensionField._features = this._features;
        this._featuresResolved = !0
    };
    tM.prototype._inferLegacyProtoFeatures = function() {
        return {}
    };
    tM.prototype.getOption = function(q) {
        if (this.options) return this.options[q];
        return
    };
    tM.prototype.setOption = function(q, K, Y) {
        if (!this.options) this.options = {};
        if (/^features\./.test(q)) im1.setProperty(this.options, q, K, Y);
        else if (!Y || this.options[q] === void 0) {
            if (this.getOption(q) !== K) this.resolved = !1;
            this.options[q] = K
        }
        return this
    };
    tM.prototype.setParsedOption = function(q, K, Y) {
        if (!this.parsedOptions) this.parsedOptions = [];
        var z = this.parsedOptions;
        if (Y) {
            var w = z.find(function(O) {
                return Object.prototype.hasOwnProperty.call(O, q)
            });
            if (w) {
                var H = w[q];
                im1.setProperty(H, Y, K)
            } else w = {}, w[q] = im1.setProperty({}, Y, K), z.push(w)
        } else {
            var $ = {};
            $[q] = K, z.push($)
        }
        return this
    };
    tM.prototype.setOptions = function(q, K) {
        if (q)
            for (var Y = Object.keys(q), z = 0; z < Y.length; ++z) this.setOption(Y[z], q[Y[z]], K);
        return this
    };
    tM.prototype.toString = function() {
        var q = this.constructor.className,
            K = this.fullName;
        if (K.length) return q + " " + K;
        return q
    };
    tM.prototype._editionToJSON = function() {
        if (!this._edition || this._edition === "proto3") return;
        return this._edition
    };
    tM._configure = function(A) {
        $06 = A
    }
})
// @from(Ln 290247, Col 4)
rh = R((Pmw, FZ4) => {
    FZ4.exports = oh;
    var pfA = Rs();
    ((oh.prototype = Object.create(pfA.prototype)).constructor = oh).className = "Enum";
    var mZ4 = rM1(),
        O06 = Xj();

    function oh(A, q, K, Y, z, w) {
        if (pfA.call(this, A, K), q && typeof q !== "object") throw TypeError("values must be an object");
        if (this.valuesById = {}, this.values = Object.create(this.valuesById), this.comment = Y, this.comments = z || {}, this.valuesOptions = w, this._valuesFeatures = {}, this.reserved = void 0, q) {
            for (var H = Object.keys(q), $ = 0; $ < H.length; ++$)
                if (typeof q[H[$]] === "number") this.valuesById[this.values[H[$]] = q[H[$]]] = H[$]
        }
    }
    oh.prototype._resolveFeatures = function(q) {
        return q = this._edition || q, pfA.prototype._resolveFeatures.call(this, q), Object.keys(this.values).forEach((K) => {
            var Y = Object.assign({}, this._features);
            this._valuesFeatures[K] = Object.assign(Y, this.valuesOptions && this.valuesOptions[K] && this.valuesOptions[K].features)
        }), this
    };
    oh.fromJSON = function(q, K) {
        var Y = new oh(q, K.values, K.options, K.comment, K.comments);
        if (Y.reserved = K.reserved, K.edition) Y._edition = K.edition;
        return Y._defaultEdition = "proto3", Y
    };
    oh.prototype.toJSON = function(q) {
        var K = q ? Boolean(q.keepComments) : !1;
        return O06.toObject(["edition", this._editionToJSON(), "options", this.options, "valuesOptions", this.valuesOptions, "values", this.values, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "comment", K ? this.comment : void 0, "comments", K ? this.comments : void 0])
    };
    oh.prototype.add = function(q, K, Y, z) {
        if (!O06.isString(q)) throw TypeError("name must be a string");
        if (!O06.isInteger(K)) throw TypeError("id must be an integer");
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
    oh.prototype.remove = function(q) {
        if (!O06.isString(q)) throw TypeError("name must be a string");
        var K = this.values[q];
        if (K == null) throw Error("name '" + q + "' does not exist in " + this);
        if (delete this.valuesById[K], delete this.values[q], delete this.comments[q], this.valuesOptions) delete this.valuesOptions[q];
        return this
    };
    oh.prototype.isReservedId = function(q) {
        return mZ4.isReservedId(this.reserved, q)
    };
    oh.prototype.isReservedName = function(q) {
        return mZ4.isReservedName(this.reserved, q)
    }
})
// @from(Ln 290306, Col 4)
ufA = R((Wmw, gZ4) => {
    gZ4.exports = J2Y;
    var _2Y = rh(),
        dfA = C31(),
        cfA = Xj();

    function QZ4(A, q, K, Y) {
        return q.delimited ? A("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", K, Y, (q.id << 3 | 3) >>> 0, (q.id << 3 | 4) >>> 0) : A("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", K, Y, (q.id << 3 | 2) >>> 0)
    }

    function J2Y(A) {
        var q = cfA.codegen(["m", "w"], A.name + "$encode")("if(!w)")("w=Writer.create()"),
            K, Y, z = A.fieldsArray.slice().sort(cfA.compareFieldsById);
        for (var K = 0; K < z.length; ++K) {
            var w = z[K].resolve(),
                H = A._fieldsArray.indexOf(w),
                $ = w.resolvedType instanceof _2Y ? "int32" : w.type,
                O = dfA.basic[$];
            if (Y = "m" + cfA.safeProp(w.name), w.map) {
                if (q("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", Y, w.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", Y)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (w.id << 3 | 2) >>> 0, 8 | dfA.mapKey[w.keyType], w.keyType), O === void 0) q("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", H, Y);
                else q(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | O, $, Y);
                q("}")("}")
            } else if (w.repeated) {
                if (q("if(%s!=null&&%s.length){", Y, Y), w.packed && dfA.packed[$] !== void 0) q("w.uint32(%i).fork()", (w.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", Y)("w.%s(%s[i])", $, Y)("w.ldelim()");
                else if (q("for(var i=0;i<%s.length;++i)", Y), O === void 0) QZ4(q, w, H, Y + "[i]");
                else q("w.uint32(%i).%s(%s[i])", (w.id << 3 | O) >>> 0, $, Y);
                q("}")
            } else {
                if (w.optional) q("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", Y, w.name);
                if (O === void 0) QZ4(q, w, H, Y);
                else q("w.uint32(%i).%s(%s)", (w.id << 3 | O) >>> 0, $, Y)
            }
        }
        return q("return w")
    }
})
// @from(Ln 290342, Col 4)
pZ4 = R((Gmw, UZ4) => {
    var xY = UZ4.exports = PZA();
    xY.build = "light";

    function X2Y(A, q, K) {
        if (typeof q === "function") K = q, q = new xY.Root;
        else if (!q) q = new xY.Root;
        return q.load(A, K)
    }
    xY.load = X2Y;

    function D2Y(A, q) {
        if (!q) q = new xY.Root;
        return q.loadSync(A)
    }
    xY.loadSync = D2Y;
    xY.encoder = ufA();
    xY.decoder = EfA();
    xY.verifier = RfA();
    xY.converter = SfA();
    xY.ReflectionObject = Rs();
    xY.Namespace = rM1();
    xY.Root = z06();
    xY.Enum = rh();
    xY.Type = A06();
    xY.Field = Ls();
    xY.OneOf = y31();
    xY.MapField = rD6();
    xY.Service = aD6();
    xY.Method = oD6();
    xY.Message = sD6();
    xY.wrappers = hfA();
    xY.types = C31();
    xY.util = Xj();
    xY.ReflectionObject._configure(xY.Root);
    xY.Namespace._configure(xY.Type, xY.Service, xY.Enum);
    xY.Root._configure(xY.Type);
    xY.Field._configure(xY.Type)
})
// @from(Ln 290381, Col 4)
ifA = R((Zmw, lZ4) => {
    lZ4.exports = cZ4;
    var lfA = /[\s{}=;:[\],'"()<>]/g,
        j2Y = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,
        M2Y = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
        P2Y = /^ *[*/]+ */,
        W2Y = /^\s*\*?\/*/,
        G2Y = /\n/g,
        Z2Y = /\s/,
        f2Y = /\\(.?)/g,
        V2Y = {
            "0": "\x00",
            r: "\r",
            n: `
`,
            t: "\t"
        };

    function dZ4(A) {
        return A.replace(f2Y, function(q, K) {
            switch (K) {
                case "\\":
                case "":
                    return K;
                default:
                    return V2Y[K] || ""
            }
        })
    }
    cZ4.unescape = dZ4;

    function cZ4(A, q) {
        A = A.toString();
        var K = 0,
            Y = A.length,
            z = 1,
            w = 0,
            H = {},
            $ = [],
            O = null;

        function _(N) {
            return Error("illegal " + N + " (line " + z + ")")
        }

        function J() {
            var N = O === "'" ? M2Y : j2Y;
            N.lastIndex = K - 1;
            var T = N.exec(A);
            if (!T) throw _("string");
            return K = N.lastIndex, W(O), O = null, dZ4(T[1])
        }

        function X(N) {
            return A.charAt(N)
        }

        function D(N, T, k) {
            var y = {
                    type: A.charAt(N++),
                    lineEmpty: !1,
                    leading: k
                },
                B;
            if (q) B = 2;
            else B = 3;
            var S = N - B,
                m;
            do
                if (--S < 0 || (m = A.charAt(S)) === `
`) {
                    y.lineEmpty = !0;
                    break
                } while (m === " " || m === "\t");
            var b = A.substring(N, T).split(G2Y);
            for (var g = 0; g < b.length; ++g) b[g] = b[g].replace(q ? W2Y : P2Y, "").trim();
            y.text = b.join(`
`).trim(), H[z] = y, w = z
        }

        function j(N) {
            var T = M(N),
                k = A.substring(N, T),
                y = /^\s*\/\//.test(k);
            return y
        }

        function M(N) {
            var T = N;
            while (T < Y && X(T) !== `
`) T++;
            return T
        }

        function P() {
            if ($.length > 0) return $.shift();
            if (O) return J();
            var N, T, k, y, B, S = K === 0;
            do {
                if (K === Y) return null;
                N = !1;
                while (Z2Y.test(k = X(K))) {
                    if (k === `
`) S = !0, ++z;
                    if (++K === Y) return null
                }
                if (X(K) === "/") {
                    if (++K === Y) throw _("comment");
                    if (X(K) === "/")
                        if (!q) {
                            B = X(y = K + 1) === "/";
                            while (X(++K) !== `
`)
                                if (K === Y) return null;
                            if (++K, B) D(y, K - 1, S), S = !0;
                            ++z, N = !0
                        } else {
                            if (y = K, B = !1, j(K - 1)) {
                                B = !0;
                                do {
                                    if (K = M(K), K === Y) break;
                                    if (K++, !S) break
                                } while (j(K))
                            } else K = Math.min(Y, M(K) + 1);
                            if (B) D(y, K, S), S = !0;
                            z++, N = !0
                        }
                    else if ((k = X(K)) === "*") {
                        y = K + 1, B = q || X(y) === "*";
                        do {
                            if (k === `
`) ++z;
                            if (++K === Y) throw _("comment");
                            T = k, k = X(K)
                        } while (T !== "*" || k !== "/");
                        if (++K, B) D(y, K - 2, S), S = !0;
                        N = !0
                    } else return "/"
                }
            } while (N);
            var m = K;
            lfA.lastIndex = 0;
            var b = lfA.test(X(m++));
            if (!b)
                while (m < Y && !lfA.test(X(m))) ++m;
            var g = A.substring(K, K = m);
            if (g === '"' || g === "'") O = g;
            return g
        }

        function W(N) {
            $.push(N)
        }

        function G() {
            if (!$.length) {
                var N = P();
                if (N === null) return null;
                W(N)
            }
            return $[0]
        }

        function f(N, T) {
            var k = G(),
                y = k === N;
            if (y) return P(), !0;
            if (!T) throw _("token '" + k + "', '" + N + "' expected");
            return !1
        }

        function Z(N) {
            var T = null,
                k;
            if (N === void 0) {
                if (k = H[z - 1], delete H[z - 1], k && (q || k.type === "*" || k.lineEmpty)) T = k.leading ? k.text : null
            } else {
                if (w < N) G();
                if (k = H[N], delete H[N], k && !k.lineEmpty && (q || k.type === "/")) T = k.leading ? null : k.text
            }
            return T
        }
        return Object.defineProperty({
            next: P,
            peek: G,
            push: W,
            skip: f,
            cmnt: Z
        }, "line", {
            get: function() {
                return z
            }
        })
    }
})
// @from(Ln 290576, Col 4)
sZ4 = R((fmw, aZ4) => {
    aZ4.exports = _d;
    _d.filename = null;
    _d.defaults = {
        keepCase: !1
    };
    var N2Y = ifA(),
        iZ4 = z06(),
        nZ4 = A06(),
        rZ4 = Ls(),
        T2Y = rD6(),
        oZ4 = y31(),
        v2Y = rh(),
        E2Y = aD6(),
        k2Y = oD6(),
        L2Y = Rs(),
        R2Y = C31(),
        nfA = Xj(),
        y2Y = /^[1-9][0-9]*$/,
        C2Y = /^-?[1-9][0-9]*$/,
        S2Y = /^0[x][0-9a-fA-F]+$/,
        h2Y = /^-?0[x][0-9a-fA-F]+$/,
        I2Y = /^0[0-7]+$/,
        x2Y = /^-?0[0-7]+$/,
        b2Y = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/,
        $m = /^[a-zA-Z_][a-zA-Z_0-9]*$/,
        Om = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/;

    function _d(A, q, K) {
        if (!(q instanceof iZ4)) K = q, q = new iZ4;
        if (!K) K = _d.defaults;
        var Y = K.preferTrailingComment || !1,
            z = N2Y(A, K.alternateCommentMode || !1),
            w = z.next,
            H = z.push,
            $ = z.peek,
            O = z.skip,
            _ = z.cmnt,
            J = !0,
            X, D, j, M = "proto2",
            P = q,
            W = [],
            G = {},
            f = K.keepCase ? function(z1) {
                return z1
            } : nfA.camelCase;

        function Z() {
            W.forEach((z1) => {
                z1._edition = M, Object.keys(G).forEach((Y1) => {
                    if (z1.getOption(Y1) !== void 0) return;
                    z1.setOption(Y1, G[Y1], !0)
                })
            })
        }

        function N(z1, Y1, _1) {
            var $1 = _d.filename;
            if (!_1) _d.filename = null;
            return Error("illegal " + (Y1 || "token") + " '" + z1 + "' (" + ($1 ? $1 + ", " : "") + "line " + z.line + ")")
        }

        function T() {
            var z1 = [],
                Y1;
            do {
                if ((Y1 = w()) !== '"' && Y1 !== "'") throw N(Y1);
                z1.push(w()), O(Y1), Y1 = $()
            } while (Y1 === '"' || Y1 === "'");
            return z1.join("")
        }

        function k(z1) {
            var Y1 = w();
            switch (Y1) {
                case "'":
                case '"':
                    return H(Y1), T();
                case "true":
                case "TRUE":
                    return !0;
                case "false":
                case "FALSE":
                    return !1
            }
            try {
                return B(Y1, !0)
            } catch (_1) {
                if (z1 && Om.test(Y1)) return Y1;
                throw N(Y1, "value")
            }
        }

        function y(z1, Y1) {
            var _1, $1;
            do
                if (Y1 && ((_1 = $()) === '"' || _1 === "'")) {
                    var G1 = T();
                    if (z1.push(G1), M >= 2023) throw N(G1, "id")
                } else try {
                    z1.push([$1 = S(w()), O("to", !0) ? S(w()) : $1])
                } catch (x1) {
                    if (Y1 && Om.test(_1) && M >= 2023) z1.push(_1);
                    else throw x1
                }
            while (O(",", !0));
            var L1 = {
                options: void 0
            };
            L1.setOption = function(x1, f1) {
                if (this.options === void 0) this.options = {};
                this.options[x1] = f1
            }, p(L1, function(f1) {
                if (f1 === "option") q1(L1, f1), O(";");
                else throw N(f1)
            }, function() {
                Z1(L1)
            })
        }

        function B(z1, Y1) {
            var _1 = 1;
            if (z1.charAt(0) === "-") _1 = -1, z1 = z1.substring(1);
            switch (z1) {
                case "inf":
                case "INF":
                case "Inf":
                    return _1 * (1 / 0);
                case "nan":
                case "NAN":
                case "Nan":
                case "NaN":
                    return NaN;
                case "0":
                    return 0
            }
            if (y2Y.test(z1)) return _1 * parseInt(z1, 10);
            if (S2Y.test(z1)) return _1 * parseInt(z1, 16);
            if (I2Y.test(z1)) return _1 * parseInt(z1, 8);
            if (b2Y.test(z1)) return _1 * parseFloat(z1);
            throw N(z1, "number", Y1)
        }

        function S(z1, Y1) {
            switch (z1) {
                case "max":
                case "MAX":
                case "Max":
                    return 536870911;
                case "0":
                    return 0
            }
            if (!Y1 && z1.charAt(0) === "-") throw N(z1, "id");
            if (C2Y.test(z1)) return parseInt(z1, 10);
            if (h2Y.test(z1)) return parseInt(z1, 16);
            if (x2Y.test(z1)) return parseInt(z1, 8);
            throw N(z1, "id")
        }

        function m() {
            if (X !== void 0) throw N("package");
            if (X = w(), !Om.test(X)) throw N(X, "name");
            P = P.define(X), O(";")
        }

        function b() {
            var z1 = $(),
                Y1;
            switch (z1) {
                case "weak":
                    Y1 = j || (j = []), w();
                    break;
                case "public":
                    w();
                default:
                    Y1 = D || (D = []);
                    break
            }
            z1 = T(), O(";"), Y1.push(z1)
        }

        function g() {
            if (O("="), M = T(), M < 2023) throw N(M, "syntax");
            O(";")
        }

        function U() {
            if (O("="), M = T(), !["2023"].includes(M)) throw N(M, "edition");
            O(";")
        }

        function x(z1, Y1) {
            switch (Y1) {
                case "option":
                    return q1(z1, Y1), O(";"), !0;
                case "message":
                    return l(z1, Y1), !0;
                case "enum":
                    return N1(z1, Y1), !0;
                case "service":
                    return E1(z1, Y1), !0;
                case "extend":
                    return A1(z1, Y1), !0
            }
            return !1
        }

        function p(z1, Y1, _1) {
            var $1 = z.line;
            if (z1) {
                if (typeof z1.comment !== "string") z1.comment = _();
                z1.filename = _d.filename
            }
            if (O("{", !0)) {
                var G1;
                while ((G1 = w()) !== "}") Y1(G1);
                O(";", !0)
            } else {
                if (_1) _1();
                if (O(";"), z1 && (typeof z1.comment !== "string" || Y)) z1.comment = _($1) || z1.comment
            }
        }

        function l(z1, Y1) {
            if (!$m.test(Y1 = w())) throw N(Y1, "type name");
            var _1 = new nZ4(Y1);
            if (p(_1, function(G1) {
                    if (x(_1, G1)) return;
                    switch (G1) {
                        case "map":
                            O1(_1, G1);
                            break;
                        case "required":
                            if (M !== "proto2") throw N(G1);
                        case "repeated":
                            r(_1, G1);
                            break;
                        case "optional":
                            if (M === "proto3") r(_1, "proto3_optional");
                            else if (M !== "proto2") throw N(G1);
                            else r(_1, "optional");
                            break;
                        case "oneof":
                            T1(_1, G1);
                            break;
                        case "extensions":
                            y(_1.extensions || (_1.extensions = []));
                            break;
                        case "reserved":
                            y(_1.reserved || (_1.reserved = []), !0);
                            break;
                        default:
                            if (M === "proto2" || !Om.test(G1)) throw N(G1);
                            H(G1), r(_1, "optional");
                            break
                    }
                }), z1.add(_1), z1 === P) W.push(_1)
        }

        function r(z1, Y1, _1) {
            var $1 = w();
            if ($1 === "group") {
                s(z1, Y1);
                return
            }
            while ($1.endsWith(".") || $().startsWith(".")) $1 += w();
            if (!Om.test($1)) throw N($1, "type");
            var G1 = w();
            if (!$m.test(G1)) throw N(G1, "name");
            G1 = f(G1), O("=");
            var L1 = new rZ4(G1, S(w()), $1, Y1, _1);
            if (p(L1, function(R1) {
                    if (R1 === "option") q1(L1, R1), O(";");
                    else throw N(R1)
                }, function() {
                    Z1(L1)
                }), Y1 === "proto3_optional") {
                var x1 = new oZ4("_" + G1);
                L1.setOption("proto3_optional", !0), x1.add(L1), z1.add(x1)
            } else z1.add(L1);
            if (z1 === P) W.push(L1)
        }

        function s(z1, Y1) {
            if (M >= 2023) throw N("group");
            var _1 = w();
            if (!$m.test(_1)) throw N(_1, "name");
            var $1 = nfA.lcFirst(_1);
            if (_1 === $1) _1 = nfA.ucFirst(_1);
            O("=");
            var G1 = S(w()),
                L1 = new nZ4(_1);
            L1.group = !0;
            var x1 = new rZ4($1, G1, _1, Y1);
            x1.filename = _d.filename, p(L1, function(R1) {
                switch (R1) {
                    case "option":
                        q1(L1, R1), O(";");
                        break;
                    case "required":
                    case "repeated":
                        r(L1, R1);
                        break;
                    case "optional":
                        if (M === "proto3") r(L1, "proto3_optional");
                        else r(L1, "optional");
                        break;
                    case "message":
                        l(L1, R1);
                        break;
                    case "enum":
                        N1(L1, R1);
                        break;
                    case "reserved":
                        y(L1.reserved || (L1.reserved = []), !0);
                        break;
                    default:
                        throw N(R1)
                }
            }), z1.add(L1).add(x1)
        }

        function O1(z1) {
            O("<");
            var Y1 = w();
            if (R2Y.mapKey[Y1] === void 0) throw N(Y1, "type");
            O(",");
            var _1 = w();
            if (!Om.test(_1)) throw N(_1, "type");
            O(">");
            var $1 = w();
            if (!$m.test($1)) throw N($1, "name");
            O("=");
            var G1 = new T2Y(f($1), S(w()), Y1, _1);
            p(G1, function(x1) {
                if (x1 === "option") q1(G1, x1), O(";");
                else throw N(x1)
            }, function() {
                Z1(G1)
            }), z1.add(G1)
        }

        function T1(z1, Y1) {
            if (!$m.test(Y1 = w())) throw N(Y1, "name");
            var _1 = new oZ4(f(Y1));
            p(_1, function(G1) {
                if (G1 === "option") q1(_1, G1), O(";");
                else H(G1), r(_1, "optional")
            }), z1.add(_1)
        }

        function N1(z1, Y1) {
            if (!$m.test(Y1 = w())) throw N(Y1, "name");
            var _1 = new v2Y(Y1);
            if (p(_1, function(G1) {
                    switch (G1) {
                        case "option":
                            q1(_1, G1), O(";");
                            break;
                        case "reserved":
                            if (y(_1.reserved || (_1.reserved = []), !0), _1.reserved === void 0) _1.reserved = [];
                            break;
                        default:
                            j1(_1, G1)
                    }
                }), z1.add(_1), z1 === P) W.push(_1)
        }

        function j1(z1, Y1) {
            if (!$m.test(Y1)) throw N(Y1, "name");
            O("=");
            var _1 = S(w(), !0),
                $1 = {
                    options: void 0
                };
            $1.getOption = function(G1) {
                return this.options[G1]
            }, $1.setOption = function(G1, L1) {
                L2Y.prototype.setOption.call($1, G1, L1)
            }, $1.setParsedOption = function() {
                return
            }, p($1, function(L1) {
                if (L1 === "option") q1($1, L1), O(";");
                else throw N(L1)
            }, function() {
                Z1($1)
            }), z1.add(Y1, _1, $1.comment, $1.parsedOptions || $1.options)
        }

        function q1(z1, Y1) {
            var _1, $1, G1 = !0;
            if (Y1 === "option") Y1 = w();
            while (Y1 !== "=") {
                if (Y1 === "(") {
                    var L1 = w();
                    O(")"), Y1 = "(" + L1 + ")"
                }
                if (G1) {
                    if (G1 = !1, Y1.includes(".") && !Y1.includes("(")) {
                        var x1 = Y1.split(".");
                        _1 = x1[0] + ".", Y1 = x1[1];
                        continue
                    }
                    _1 = Y1
                } else $1 = $1 ? $1 += Y1 : Y1;
                Y1 = w()
            }
            var f1 = $1 ? _1.concat($1) : _1,
                R1 = t(z1, f1);
            $1 = $1 && $1[0] === "." ? $1.slice(1) : $1, _1 = _1 && _1[_1.length - 1] === "." ? _1.slice(0, -1) : _1, D1(z1, _1, R1, $1)
        }

        function t(z1, Y1) {
            if (O("{", !0)) {
                var _1 = {};
                while (!O("}", !0)) {
                    if (!$m.test(M1 = w())) throw N(M1, "name");
                    if (M1 === null) throw N(M1, "end of input");
                    var $1, G1 = M1;
                    if (O(":", !0), $() === "{") $1 = t(z1, Y1 + "." + M1);
                    else if ($() === "[") {
                        $1 = [];
                        var L1;
                        if (O("[", !0)) {
                            do L1 = k(!0), $1.push(L1); while (O(",", !0));
                            if (O("]"), typeof L1 < "u") J1(z1, Y1 + "." + M1, L1)
                        }
                    } else $1 = k(!0), J1(z1, Y1 + "." + M1, $1);
                    var x1 = _1[G1];
                    if (x1) $1 = [].concat(x1).concat($1);
                    _1[G1] = $1, O(",", !0), O(";", !0)
                }
                return _1
            }
            var f1 = k(!0);
            return J1(z1, Y1, f1), f1
        }

        function J1(z1, Y1, _1) {
            if (P === z1 && /^features\./.test(Y1)) {
                G[Y1] = _1;
                return
            }
            if (z1.setOption) z1.setOption(Y1, _1)
        }

        function D1(z1, Y1, _1, $1) {
            if (z1.setParsedOption) z1.setParsedOption(Y1, _1, $1)
        }

        function Z1(z1) {
            if (O("[", !0)) {
                do q1(z1, "option"); while (O(",", !0));
                O("]")
            }
            return z1
        }

        function E1(z1, Y1) {
            if (!$m.test(Y1 = w())) throw N(Y1, "service name");
            var _1 = new E2Y(Y1);
            if (p(_1, function(G1) {
                    if (x(_1, G1)) return;
                    if (G1 === "rpc") a(_1, G1);
                    else throw N(G1)
                }), z1.add(_1), z1 === P) W.push(_1)
        }

        function a(z1, Y1) {
            var _1 = _(),
                $1 = Y1;
            if (!$m.test(Y1 = w())) throw N(Y1, "name");
            var G1 = Y1,
                L1, x1, f1, R1;
            if (O("("), O("stream", !0)) x1 = !0;
            if (!Om.test(Y1 = w())) throw N(Y1);
            if (L1 = Y1, O(")"), O("returns"), O("("), O("stream", !0)) R1 = !0;
            if (!Om.test(Y1 = w())) throw N(Y1);
            f1 = Y1, O(")");
            var H1 = new k2Y(G1, $1, L1, f1, x1, R1);
            H1.comment = _1, p(H1, function(B1) {
                if (B1 === "option") q1(H1, B1), O(";");
                else throw N(B1)
            }), z1.add(H1)
        }

        function A1(z1, Y1) {
            if (!Om.test(Y1 = w())) throw N(Y1, "reference");
            var _1 = Y1;
            p(null, function(G1) {
                switch (G1) {
                    case "required":
                    case "repeated":
                        r(z1, G1, _1);
                        break;
                    case "optional":
                        if (M === "proto3") r(z1, "proto3_optional", _1);
                        else r(z1, "optional", _1);
                        break;
                    default:
                        if (M === "proto2" || !Om.test(G1)) throw N(G1);
                        H(G1), r(z1, "optional", _1);
                        break
                }
            })
        }
        var M1;
        while ((M1 = w()) !== null) switch (M1) {
            case "package":
                if (!J) throw N(M1);
                m();
                break;
            case "import":
                if (!J) throw N(M1);
                b();
                break;
            case "syntax":
                if (!J) throw N(M1);
                g();
                break;
            case "edition":
                if (!J) throw N(M1);
                U();
                break;
            case "option":
                q1(P, M1), O(";", !0);
                break;
            default:
                if (x(P, M1)) {
                    J = !1;
                    continue
                }
                throw N(M1)
        }
        return Z(), _d.filename = null, {
            package: X,
            imports: D,
            weakImports: j,
            root: q
        }
    }
})
// @from(Ln 291118, Col 4)
Af4 = R((Vmw, eZ4) => {
    eZ4.exports = ah;
    var u2Y = /\/|\./;

    function ah(A, q) {
        if (!u2Y.test(A)) A = "google/protobuf/" + A + ".proto", q = {
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
        ah[A] = q
    }
    ah("any", {
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
    var tZ4;
    ah("duration", {
        Duration: tZ4 = {
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
    ah("timestamp", {
        Timestamp: tZ4
    });
    ah("empty", {
        Empty: {
            fields: {}
        }
    });
    ah("struct", {
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
    ah("wrappers", {
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
    ah("field_mask", {
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
    ah.get = function(q) {
        return ah[q] || null
    }
})
// @from(Ln 291320, Col 4)
_06 = R((Nmw, qf4) => {
    var Cs = qf4.exports = pZ4();
    Cs.build = "full";
    Cs.tokenize = ifA();
    Cs.parse = sZ4();
    Cs.common = Af4();
    Cs.Root._configure(Cs.Type, Cs.parse, Cs.common)
})