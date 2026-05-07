
// @from(Ln 310907, Col 4)
Ke1 = p((y1K) => {
    var E1K = y1K,
        Kq8 = VF(),
        Xl = dD();

    function et1(q, K, _, z) {
        var Y = !1;
        if (K.resolvedType)
            if (K.resolvedType instanceof Kq8) {
                q("switch(d%s){", z);
                for (var A = K.resolvedType.values, O = Object.keys(A), w = 0; w < O.length; ++w) {
                    if (A[O[w]] === K.typeDefault && !Y) {
                        if (q("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}', z, z, z), !K.repeated) q("break");
                        Y = !0
                    }
                    q("case%j:", O[w])("case %i:", A[O[w]])("m%s=%j", z, A[O[w]])("break")
                }
                q("}")
            } else q('if(typeof d%s!=="object")', z)("throw TypeError(%j)", K.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", z, _, z);
        else {
            var $ = !1;
            switch (K.type) {
                case "double":
                case "float":
                    q("m%s=Number(d%s)", z, z);
                    break;
                case "uint32":
                case "fixed32":
                    q("m%s=d%s>>>0", z, z);
                    break;
                case "int32":
                case "sint32":
                case "sfixed32":
                    q("m%s=d%s|0", z, z);
                    break;
                case "uint64":
                    $ = !0;
                case "int64":
                case "sint64":
                case "fixed64":
                case "sfixed64":
                    q("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", z, z, $)('else if(typeof d%s==="string")', z)("m%s=parseInt(d%s,10)", z, z)('else if(typeof d%s==="number")', z)("m%s=d%s", z, z)('else if(typeof d%s==="object")', z)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", z, z, z, $ ? "true" : "");
                    break;
                case "bytes":
                    q('if(typeof d%s==="string")', z)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", z, z, z)("else if(d%s.length >= 0)", z)("m%s=d%s", z, z);
                    break;
                case "string":
                    q("m%s=String(d%s)", z, z);
                    break;
                case "bool":
                    q("m%s=Boolean(d%s)", z, z);
                    break
            }
        }
        return q
    }
    E1K.fromObject = function(K) {
        var _ = K.fieldsArray,
            z = Xl.codegen(["d"], K.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
        if (!_.length) return z("return new this.ctor");
        z("var m=new this.ctor");
        for (var Y = 0; Y < _.length; ++Y) {
            var A = _[Y].resolve(),
                O = Xl.safeProp(A.name);
            if (A.map) z("if(d%s){", O)('if(typeof d%s!=="object")', O)("throw TypeError(%j)", A.fullName + ": object expected")("m%s={}", O)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", O), et1(z, A, Y, O + "[ks[i]]")("}")("}");
            else if (A.repeated) z("if(d%s){", O)("if(!Array.isArray(d%s))", O)("throw TypeError(%j)", A.fullName + ": array expected")("m%s=[]", O)("for(var i=0;i<d%s.length;++i){", O), et1(z, A, Y, O + "[i]")("}")("}");
            else {
                if (!(A.resolvedType instanceof Kq8)) z("if(d%s!=null){", O);
                if (et1(z, A, Y, O), !(A.resolvedType instanceof Kq8)) z("}")
            }
        }
        return z("return m")
    };

    function qe1(q, K, _, z) {
        if (K.resolvedType)
            if (K.resolvedType instanceof Kq8) q("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", z, _, z, z, _, z, z);
            else q("d%s=types[%i].toObject(m%s,o)", z, _, z);
        else {
            var Y = !1;
            switch (K.type) {
                case "double":
                case "float":
                    q("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", z, z, z, z);
                    break;
                case "uint64":
                    Y = !0;
                case "int64":
                case "sint64":
                case "fixed64":
                case "sfixed64":
                    q('if(typeof m%s==="number")', z)("d%s=o.longs===String?String(m%s):m%s", z, z, z)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", z, z, z, z, Y ? "true" : "", z);
                    break;
                case "bytes":
                    q("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", z, z, z, z, z);
                    break;
                default:
                    q("d%s=m%s", z, z);
                    break
            }
        }
        return q
    }
    E1K.toObject = function(K) {
        var _ = K.fieldsArray.slice().sort(Xl.compareFieldsById);
        if (!_.length) return Xl.codegen()("return {}");
        var z = Xl.codegen(["m", "o"], K.name + "$toObject")("if(!o)")("o={}")("var d={}"),
            Y = [],
            A = [],
            O = [],
            w = 0;
        for (; w < _.length; ++w)
            if (!_[w].partOf)(_[w].resolve().repeated ? Y : _[w].map ? A : O).push(_[w]);
        if (Y.length) {
            z("if(o.arrays||o.defaults){");
            for (w = 0; w < Y.length; ++w) z("d%s=[]", Xl.safeProp(Y[w].name));
            z("}")
        }
        if (A.length) {
            z("if(o.objects||o.defaults){");
            for (w = 0; w < A.length; ++w) z("d%s={}", Xl.safeProp(A[w].name));
            z("}")
        }
        if (O.length) {
            z("if(o.defaults){");
            for (w = 0; w < O.length; ++w) {
                var $ = O[w],
                    j = Xl.safeProp($.name);
                if ($.resolvedType instanceof Kq8) z("d%s=o.enums===String?%j:%j", j, $.resolvedType.valuesById[$.typeDefault], $.typeDefault);
                else if ($.long) z("if(util.Long){")("var n=new util.Long(%i,%i,%j)", $.typeDefault.low, $.typeDefault.high, $.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", j)("}else")("d%s=o.longs===String?%j:%i", j, $.typeDefault.toString(), $.typeDefault.toNumber());
                else if ($.bytes) {
                    var H = "[" + Array.prototype.slice.call($.typeDefault).join(",") + "]";
                    z("if(o.bytes===String)d%s=%j", j, String.fromCharCode.apply(String, $.typeDefault))("else{")("d%s=%s", j, H)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", j, j)("}")
                } else z("d%s=%j", j, $.typeDefault)
            }
            z("}")
        }
        var J = !1;
        for (w = 0; w < _.length; ++w) {
            var $ = _[w],
                X = K._fieldsArray.indexOf($),
                j = Xl.safeProp($.name);
            if ($.map) {
                if (!J) J = !0, z("var ks2");
                z("if(m%s&&(ks2=Object.keys(m%s)).length){", j, j)("d%s={}", j)("for(var j=0;j<ks2.length;++j){"), qe1(z, $, X, j + "[ks2[j]]")("}")
            } else if ($.repeated) z("if(m%s&&m%s.length){", j, j)("d%s=[]", j)("for(var j=0;j<m%s.length;++j){", j), qe1(z, $, X, j + "[j]")("}");
            else if (z("if(m%s!=null&&m.hasOwnProperty(%j)){", j, $.name), qe1(z, $, X, j), $.partOf) z("if(o.oneofs)")("d%s=%j", Xl.safeProp($.partOf.name), $.name);
            z("}")
        }
        return z("return d")
    }
})
// @from(Ln 311059, Col 4)
_e1 = p((L1K) => {
    var ppz = L1K,
        Fpz = _B8();
    ppz[".google.protobuf.Any"] = {
        fromObject: function(q) {
            if (q && q["@type"]) {
                var K = q["@type"].substring(q["@type"].lastIndexOf("/") + 1),
                    _ = this.lookup(K);
                if (_) {
                    var z = q["@type"].charAt(0) === "." ? q["@type"].slice(1) : q["@type"];
                    if (z.indexOf("/") === -1) z = "/" + z;
                    return this.create({
                        type_url: z,
                        value: _.encode(_.fromObject(q)).finish()
                    })
                }
            }
            return this.fromObject(q)
        },
        toObject: function(q, K) {
            var _ = "type.googleapis.com/",
                z = "",
                Y = "";
            if (K && K.json && q.type_url && q.value) {
                Y = q.type_url.substring(q.type_url.lastIndexOf("/") + 1), z = q.type_url.substring(0, q.type_url.lastIndexOf("/") + 1);
                var A = this.lookup(Y);
                if (A) q = A.decode(q.value)
            }
            if (!(q instanceof this.ctor) && q instanceof Fpz) {
                var O = q.$type.toObject(q, K),
                    w = q.$type.fullName[0] === "." ? q.$type.fullName.slice(1) : q.$type.fullName;
                if (z === "") z = _;
                return Y = z + w, O["@type"] = Y, O
            }
            return this.toObject(q, K)
        }
    }
})
// @from(Ln 311097, Col 4)
AB8 = p((O32, R1K) => {
    R1K.exports = a2;
    var Ux = NS6();
    ((a2.prototype = Object.create(Ux.prototype)).constructor = a2).className = "Type";
    var gpz = VF(),
        Ae1 = oJ6(),
        zB8 = h36(),
        Upz = em8(),
        Qpz = KB8(),
        ze1 = _B8(),
        Ye1 = Vm8(),
        dpz = vm8(),
        DT = dD(),
        cpz = Oe1(),
        lpz = ot1(),
        npz = tt1(),
        h1K = Ke1(),
        ipz = _e1();

    function a2(q, K) {
        Ux.call(this, q, K), this.fields = {}, this.oneofs = void 0, this.extensions = void 0, this.reserved = void 0, this.group = void 0, this._fieldsById = null, this._fieldsArray = null, this._oneofsArray = null, this._ctor = null
    }
    Object.defineProperties(a2.prototype, {
        fieldsById: {
            get: function() {
                if (this._fieldsById) return this._fieldsById;
                this._fieldsById = {};
                for (var q = Object.keys(this.fields), K = 0; K < q.length; ++K) {
                    var _ = this.fields[q[K]],
                        z = _.id;
                    if (this._fieldsById[z]) throw Error("duplicate id " + z + " in " + this);
                    this._fieldsById[z] = _
                }
                return this._fieldsById
            }
        },
        fieldsArray: {
            get: function() {
                return this._fieldsArray || (this._fieldsArray = DT.toArray(this.fields))
            }
        },
        oneofsArray: {
            get: function() {
                return this._oneofsArray || (this._oneofsArray = DT.toArray(this.oneofs))
            }
        },
        ctor: {
            get: function() {
                return this._ctor || (this.ctor = a2.generateConstructor(this)())
            },
            set: function(q) {
                var K = q.prototype;
                if (!(K instanceof ze1))(q.prototype = new ze1).constructor = q, DT.merge(q.prototype, K);
                q.$type = q.prototype.$type = this, DT.merge(q, ze1, !0), this._ctor = q;
                var _ = 0;
                for (; _ < this.fieldsArray.length; ++_) this._fieldsArray[_].resolve();
                var z = {};
                for (_ = 0; _ < this.oneofsArray.length; ++_) z[this._oneofsArray[_].resolve().name] = {
                    get: DT.oneOfGetter(this._oneofsArray[_].oneof),
                    set: DT.oneOfSetter(this._oneofsArray[_].oneof)
                };
                if (_) Object.defineProperties(q.prototype, z)
            }
        }
    });
    a2.generateConstructor = function(K) {
        var _ = DT.codegen(["p"], K.name);
        for (var z = 0, Y; z < K.fieldsArray.length; ++z)
            if ((Y = K._fieldsArray[z]).map) _("this%s={}", DT.safeProp(Y.name));
            else if (Y.repeated) _("this%s=[]", DT.safeProp(Y.name));
        return _("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]")
    };

    function YB8(q) {
        return q._fieldsById = q._fieldsArray = q._oneofsArray = null, delete q.encode, delete q.decode, delete q.verify, q
    }
    a2.fromJSON = function(K, _) {
        var z = new a2(K, _.options);
        z.extensions = _.extensions, z.reserved = _.reserved;
        var Y = Object.keys(_.fields),
            A = 0;
        for (; A < Y.length; ++A) z.add((typeof _.fields[Y[A]].keyType < "u" ? Upz.fromJSON : zB8.fromJSON)(Y[A], _.fields[Y[A]]));
        if (_.oneofs)
            for (Y = Object.keys(_.oneofs), A = 0; A < Y.length; ++A) z.add(Ae1.fromJSON(Y[A], _.oneofs[Y[A]]));
        if (_.nested)
            for (Y = Object.keys(_.nested), A = 0; A < Y.length; ++A) {
                var O = _.nested[Y[A]];
                z.add((O.id !== void 0 ? zB8.fromJSON : O.fields !== void 0 ? a2.fromJSON : O.values !== void 0 ? gpz.fromJSON : O.methods !== void 0 ? Qpz.fromJSON : Ux.fromJSON)(Y[A], O))
            }
        if (_.extensions && _.extensions.length) z.extensions = _.extensions;
        if (_.reserved && _.reserved.length) z.reserved = _.reserved;
        if (_.group) z.group = !0;
        if (_.comment) z.comment = _.comment;
        if (_.edition) z._edition = _.edition;
        return z._defaultEdition = "proto3", z
    };
    a2.prototype.toJSON = function(K) {
        var _ = Ux.prototype.toJSON.call(this, K),
            z = K ? Boolean(K.keepComments) : !1;
        return DT.toObject(["edition", this._editionToJSON(), "options", _ && _.options || void 0, "oneofs", Ux.arrayToJSON(this.oneofsArray, K), "fields", Ux.arrayToJSON(this.fieldsArray.filter(function(Y) {
            return !Y.declaringField
        }), K) || {}, "extensions", this.extensions && this.extensions.length ? this.extensions : void 0, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "group", this.group || void 0, "nested", _ && _.nested || void 0, "comment", z ? this.comment : void 0])
    };
    a2.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        Ux.prototype.resolveAll.call(this);
        var K = this.oneofsArray;
        z = 0;
        while (z < K.length) K[z++].resolve();
        var _ = this.fieldsArray,
            z = 0;
        while (z < _.length) _[z++].resolve();
        return this
    };
    a2.prototype._resolveFeaturesRecursive = function(K) {
        if (!this._needsRecursiveFeatureResolution) return this;
        return K = this._edition || K, Ux.prototype._resolveFeaturesRecursive.call(this, K), this.oneofsArray.forEach((_) => {
            _._resolveFeatures(K)
        }), this.fieldsArray.forEach((_) => {
            _._resolveFeatures(K)
        }), this
    };
    a2.prototype.get = function(K) {
        return this.fields[K] || this.oneofs && this.oneofs[K] || this.nested && this.nested[K] || null
    };
    a2.prototype.add = function(K) {
        if (this.get(K.name)) throw Error("duplicate name '" + K.name + "' in " + this);
        if (K instanceof zB8 && K.extend === void 0) {
            if (this._fieldsById ? this._fieldsById[K.id] : this.fieldsById[K.id]) throw Error("duplicate id " + K.id + " in " + this);
            if (this.isReservedId(K.id)) throw Error("id " + K.id + " is reserved in " + this);
            if (this.isReservedName(K.name)) throw Error("name '" + K.name + "' is reserved in " + this);
            if (K.parent) K.parent.remove(K);
            return this.fields[K.name] = K, K.message = this, K.onAdd(this), YB8(this)
        }
        if (K instanceof Ae1) {
            if (!this.oneofs) this.oneofs = {};
            return this.oneofs[K.name] = K, K.onAdd(this), YB8(this)
        }
        return Ux.prototype.add.call(this, K)
    };
    a2.prototype.remove = function(K) {
        if (K instanceof zB8 && K.extend === void 0) {
            if (!this.fields || this.fields[K.name] !== K) throw Error(K + " is not a member of " + this);
            return delete this.fields[K.name], K.parent = null, K.onRemove(this), YB8(this)
        }
        if (K instanceof Ae1) {
            if (!this.oneofs || this.oneofs[K.name] !== K) throw Error(K + " is not a member of " + this);
            return delete this.oneofs[K.name], K.parent = null, K.onRemove(this), YB8(this)
        }
        return Ux.prototype.remove.call(this, K)
    };
    a2.prototype.isReservedId = function(K) {
        return Ux.isReservedId(this.reserved, K)
    };
    a2.prototype.isReservedName = function(K) {
        return Ux.isReservedName(this.reserved, K)
    };
    a2.prototype.create = function(K) {
        return new this.ctor(K)
    };
    a2.prototype.setup = function() {
        var K = this.fullName,
            _ = [];
        for (var z = 0; z < this.fieldsArray.length; ++z) _.push(this._fieldsArray[z].resolve().resolvedType);
        this.encode = cpz(this)({
            Writer: dpz,
            types: _,
            util: DT
        }), this.decode = lpz(this)({
            Reader: Ye1,
            types: _,
            util: DT
        }), this.verify = npz(this)({
            types: _,
            util: DT
        }), this.fromObject = h1K.fromObject(this)({
            types: _,
            util: DT
        }), this.toObject = h1K.toObject(this)({
            types: _,
            util: DT
        });
        var Y = ipz[K];
        if (Y) {
            var A = Object.create(this);
            A.fromObject = this.fromObject, this.fromObject = Y.fromObject.bind(A), A.toObject = this.toObject, this.toObject = Y.toObject.bind(A)
        }
        return this
    };
    a2.prototype.encode = function(K, _) {
        return this.setup().encode(K, _)
    };
    a2.prototype.encodeDelimited = function(K, _) {
        return this.encode(K, _ && _.len ? _.fork() : _).ldelim()
    };
    a2.prototype.decode = function(K, _) {
        return this.setup().decode(K, _)
    };
    a2.prototype.decodeDelimited = function(K) {
        if (!(K instanceof Ye1)) K = Ye1.create(K);
        return this.decode(K, K.uint32())
    };
    a2.prototype.verify = function(K) {
        return this.setup().verify(K)
    };
    a2.prototype.fromObject = function(K) {
        return this.setup().fromObject(K)
    };
    a2.prototype.toObject = function(K, _) {
        return this.setup().toObject(K, _)
    };
    a2.d = function(K) {
        return function(z) {
            DT.decorateType(z, K)
        }
    }
})
// @from(Ln 311314, Col 4)
jB8 = p((w32, b1K) => {
    b1K.exports = qS;
    var $B8 = NS6();
    ((qS.prototype = Object.create($B8.prototype)).constructor = qS).className = "Root";
    var OB8 = h36(),
        we1 = VF(),
        rpz = oJ6(),
        S36 = dD(),
        $e1, je1, _q8;

    function qS(q) {
        $B8.call(this, "", q), this.deferred = [], this.files = [], this._edition = "proto2", this._fullyQualifiedObjects = {}
    }
    qS.fromJSON = function(K, _) {
        if (!_) _ = new qS;
        if (K.options) _.setOptions(K.options);
        return _.addJSON(K.nested).resolveAll()
    };
    qS.prototype.resolvePath = S36.path.resolve;
    qS.prototype.fetch = S36.fetch;

    function C1K() {}
    qS.prototype.load = function q(K, _, z) {
        if (typeof _ === "function") z = _, _ = void 0;
        var Y = this;
        if (!z) return S36.asPromise(q, Y, K, _);
        var A = z === C1K;

        function O(M, P) {
            if (!z) return;
            if (A) throw M;
            if (P) P.resolveAll();
            var W = z;
            z = null, W(M, P)
        }

        function w(M) {
            var P = M.lastIndexOf("google/protobuf/");
            if (P > -1) {
                var W = M.substring(P);
                if (W in _q8) return W
            }
            return null
        }

        function $(M, P) {
            try {
                if (S36.isString(P) && P.charAt(0) === "{") P = JSON.parse(P);
                if (!S36.isString(P)) Y.setOptions(P.options).addJSON(P.nested);
                else {
                    je1.filename = M;
                    var W = je1(P, Y, _),
                        D, Z = 0;
                    if (W.imports) {
                        for (; Z < W.imports.length; ++Z)
                            if (D = w(W.imports[Z]) || Y.resolvePath(M, W.imports[Z])) j(D)
                    }
                    if (W.weakImports) {
                        for (Z = 0; Z < W.weakImports.length; ++Z)
                            if (D = w(W.weakImports[Z]) || Y.resolvePath(M, W.weakImports[Z])) j(D, !0)
                    }
                }
            } catch (G) {
                O(G)
            }
            if (!A && !H) O(null, Y)
        }

        function j(M, P) {
            if (M = w(M) || M, Y.files.indexOf(M) > -1) return;
            if (Y.files.push(M), M in _q8) {
                if (A) $(M, _q8[M]);
                else ++H, setTimeout(function() {
                    --H, $(M, _q8[M])
                });
                return
            }
            if (A) {
                var W;
                try {
                    W = S36.fs.readFileSync(M).toString("utf8")
                } catch (D) {
                    if (!P) O(D);
                    return
                }
                $(M, W)
            } else ++H, Y.fetch(M, function(D, Z) {
                if (--H, !z) return;
                if (D) {
                    if (!P) O(D);
                    else if (!H) O(null, Y);
                    return
                }
                $(M, Z)
            })
        }
        var H = 0;
        if (S36.isString(K)) K = [K];
        for (var J = 0, X; J < K.length; ++J)
            if (X = Y.resolvePath("", K[J])) j(X);
        if (A) return Y.resolveAll(), Y;
        if (!H) O(null, Y);
        return Y
    };
    qS.prototype.loadSync = function(K, _) {
        if (!S36.isNode) throw Error("not supported");
        return this.load(K, _, C1K)
    };
    qS.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        if (this.deferred.length) throw Error("unresolvable extensions: " + this.deferred.map(function(K) {
            return "'extend " + K.extend + "' in " + K.parent.fullName
        }).join(", "));
        return $B8.prototype.resolveAll.call(this)
    };
    var wB8 = /^[A-Z]/;

    function S1K(q, K) {
        var _ = K.parent.lookup(K.extend);
        if (_) {
            var z = new OB8(K.fullName, K.id, K.type, K.rule, void 0, K.options);
            if (_.get(z.name)) return !0;
            return z.declaringField = K, K.extensionField = z, _.add(z), !0
        }
        return !1
    }
    qS.prototype._handleAdd = function(K) {
        if (K instanceof OB8) {
            if (K.extend !== void 0 && !K.extensionField) {
                if (!S1K(this, K)) this.deferred.push(K)
            }
        } else if (K instanceof we1) {
            if (wB8.test(K.name)) K.parent[K.name] = K.values
        } else if (!(K instanceof rpz)) {
            if (K instanceof $e1)
                for (var _ = 0; _ < this.deferred.length;)
                    if (S1K(this, this.deferred[_])) this.deferred.splice(_, 1);
                    else ++_;
            for (var z = 0; z < K.nestedArray.length; ++z) this._handleAdd(K._nestedArray[z]);
            if (wB8.test(K.name)) K.parent[K.name] = K
        }
        if (K instanceof $e1 || K instanceof we1 || K instanceof OB8) this._fullyQualifiedObjects[K.fullName] = K
    };
    qS.prototype._handleRemove = function(K) {
        if (K instanceof OB8) {
            if (K.extend !== void 0)
                if (K.extensionField) K.extensionField.parent.remove(K.extensionField), K.extensionField = null;
                else {
                    var _ = this.deferred.indexOf(K);
                    if (_ > -1) this.deferred.splice(_, 1)
                }
        } else if (K instanceof we1) {
            if (wB8.test(K.name)) delete K.parent[K.name]
        } else if (K instanceof $B8) {
            for (var z = 0; z < K.nestedArray.length; ++z) this._handleRemove(K._nestedArray[z]);
            if (wB8.test(K.name)) delete K.parent[K.name]
        }
        delete this._fullyQualifiedObjects[K.fullName]
    };
    qS._configure = function(q, K, _) {
        $e1 = q, je1 = K, _q8 = _
    }
})
// @from(Ln 311477, Col 4)
dD = p(($32, x1K) => {
    var kM = x1K.exports = Ol(),
        I1K = Qs1(),
        He1, Je1;
    kM.codegen = $1K();
    kM.fetch = H1K();
    kM.path = M1K();
    kM.fs = kM.inquire("fs");
    kM.toArray = function(K) {
        if (K) {
            var _ = Object.keys(K),
                z = Array(_.length),
                Y = 0;
            while (Y < _.length) z[Y] = K[_[Y++]];
            return z
        }
        return []
    };
    kM.toObject = function(K) {
        var _ = {},
            z = 0;
        while (z < K.length) {
            var Y = K[z++],
                A = K[z++];
            if (A !== void 0) _[Y] = A
        }
        return _
    };
    var opz = /\\/g,
        apz = /"/g;
    kM.isReserved = function(K) {
        return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(K)
    };
    kM.safeProp = function(K) {
        if (!/^[$\w_]+$/.test(K) || kM.isReserved(K)) return '["' + K.replace(opz, "\\\\").replace(apz, "\\\"") + '"]';
        return "." + K
    };
    kM.ucFirst = function(K) {
        return K.charAt(0).toUpperCase() + K.substring(1)
    };
    var spz = /_([a-z])/g;
    kM.camelCase = function(K) {
        return K.substring(0, 1) + K.substring(1).replace(spz, function(_, z) {
            return z.toUpperCase()
        })
    };
    kM.compareFieldsById = function(K, _) {
        return K.id - _.id
    };
    kM.decorateType = function(K, _) {
        if (K.$type) {
            if (_ && K.$type.name !== _) kM.decorateRoot.remove(K.$type), K.$type.name = _, kM.decorateRoot.add(K.$type);
            return K.$type
        }
        if (!He1) He1 = AB8();
        var z = new He1(_ || K.name);
        return kM.decorateRoot.add(z), z.ctor = K, Object.defineProperty(K, "$type", {
            value: z,
            enumerable: !1
        }), Object.defineProperty(K.prototype, "$type", {
            value: z,
            enumerable: !1
        }), z
    };
    var tpz = 0;
    kM.decorateEnum = function(K) {
        if (K.$type) return K.$type;
        if (!Je1) Je1 = VF();
        var _ = new Je1("Enum" + tpz++, K);
        return kM.decorateRoot.add(_), Object.defineProperty(K, "$type", {
            value: _,
            enumerable: !1
        }), _
    };
    kM.setProperty = function(K, _, z, Y) {
        function A(O, w, $) {
            var j = w.shift();
            if (j === "__proto__" || j === "prototype") return O;
            if (w.length > 0) O[j] = A(O[j] || {}, w, $);
            else {
                var H = O[j];
                if (H && Y) return O;
                if (H) $ = [].concat(H).concat($);
                O[j] = $
            }
            return O
        }
        if (typeof K !== "object") throw TypeError("dst must be an object");
        if (!_) throw TypeError("path must be specified");
        return _ = _.split("."), A(K, _, z)
    };
    Object.defineProperty(kM, "decorateRoot", {
        get: function() {
            return I1K.decorated || (I1K.decorated = new(jB8()))
        }
    })
})
// @from(Ln 311574, Col 4)
aJ6 = p((u1K) => {
    var zq8 = u1K,
        epz = dD(),
        qFz = ["double", "float", "int32", "uint32", "sint32", "fixed32", "sfixed32", "int64", "uint64", "sint64", "fixed64", "sfixed64", "bool", "string", "bytes"];

    function Yq8(q, K) {
        var _ = 0,
            z = {};
        K |= 0;
        while (_ < q.length) z[qFz[_ + K]] = q[_++];
        return z
    }
    zq8.basic = Yq8([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2, 2]);
    zq8.defaults = Yq8([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, !1, "", epz.emptyArray, null]);
    zq8.long = Yq8([0, 0, 0, 1, 1], 7);
    zq8.mapKey = Yq8([0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2], 2);
    zq8.packed = Yq8([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0])
})
// @from(Ln 311592, Col 4)
h36 = p((H32, B1K) => {
    B1K.exports = cD;
    var Oq8 = R36();
    ((cD.prototype = Object.create(Oq8.prototype)).constructor = cD).className = "Field";
    var m1K = VF(),
        Xe1 = aJ6(),
        tP = dD(),
        Aq8, KFz = /^required|optional|repeated$/;
    cD.fromJSON = function(K, _) {
        var z = new cD(K, _.id, _.type, _.rule, _.extend, _.options, _.comment);
        if (_.edition) z._edition = _.edition;
        return z._defaultEdition = "proto3", z
    };

    function cD(q, K, _, z, Y, A, O) {
        if (tP.isObject(z)) O = Y, A = z, z = Y = void 0;
        else if (tP.isObject(Y)) O = A, A = Y, Y = void 0;
        if (Oq8.call(this, q, A), !tP.isInteger(K) || K < 0) throw TypeError("id must be a non-negative integer");
        if (!tP.isString(_)) throw TypeError("type must be a string");
        if (z !== void 0 && !KFz.test(z = z.toString().toLowerCase())) throw TypeError("rule must be a string rule");
        if (Y !== void 0 && !tP.isString(Y)) throw TypeError("extend must be a string");
        if (z === "proto3_optional") z = "optional";
        this.rule = z && z !== "optional" ? z : void 0, this.type = _, this.id = K, this.extend = Y || void 0, this.repeated = z === "repeated", this.map = !1, this.message = null, this.partOf = null, this.typeDefault = null, this.defaultValue = null, this.long = tP.Long ? Xe1.long[_] !== void 0 : !1, this.bytes = _ === "bytes", this.resolvedType = null, this.extensionField = null, this.declaringField = null, this.comment = O
    }
    Object.defineProperty(cD.prototype, "required", {
        get: function() {
            return this._features.field_presence === "LEGACY_REQUIRED"
        }
    });
    Object.defineProperty(cD.prototype, "optional", {
        get: function() {
            return !this.required
        }
    });
    Object.defineProperty(cD.prototype, "delimited", {
        get: function() {
            return this.resolvedType instanceof Aq8 && this._features.message_encoding === "DELIMITED"
        }
    });
    Object.defineProperty(cD.prototype, "packed", {
        get: function() {
            return this._features.repeated_field_encoding === "PACKED"
        }
    });
    Object.defineProperty(cD.prototype, "hasPresence", {
        get: function() {
            if (this.repeated || this.map) return !1;
            return this.partOf || this.declaringField || this.extensionField || this._features.field_presence !== "IMPLICIT"
        }
    });
    cD.prototype.setOption = function(K, _, z) {
        return Oq8.prototype.setOption.call(this, K, _, z)
    };
    cD.prototype.toJSON = function(K) {
        var _ = K ? Boolean(K.keepComments) : !1;
        return tP.toObject(["edition", this._editionToJSON(), "rule", this.rule !== "optional" && this.rule || void 0, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", _ ? this.comment : void 0])
    };
    cD.prototype.resolve = function() {
        if (this.resolved) return this;
        if ((this.typeDefault = Xe1.defaults[this.type]) === void 0)
            if (this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type), this.resolvedType instanceof Aq8) this.typeDefault = null;
            else this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
        else if (this.options && this.options.proto3_optional) this.typeDefault = null;
        if (this.options && this.options.default != null) {
            if (this.typeDefault = this.options.default, this.resolvedType instanceof m1K && typeof this.typeDefault === "string") this.typeDefault = this.resolvedType.values[this.typeDefault]
        }
        if (this.options) {
            if (this.options.packed !== void 0 && this.resolvedType && !(this.resolvedType instanceof m1K)) delete this.options.packed;
            if (!Object.keys(this.options).length) this.options = void 0
        }
        if (this.long) {
            if (this.typeDefault = tP.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u"), Object.freeze) Object.freeze(this.typeDefault)
        } else if (this.bytes && typeof this.typeDefault === "string") {
            var K;
            if (tP.base64.test(this.typeDefault)) tP.base64.decode(this.typeDefault, K = tP.newBuffer(tP.base64.length(this.typeDefault)), 0);
            else tP.utf8.write(this.typeDefault, K = tP.newBuffer(tP.utf8.length(this.typeDefault)), 0);
            this.typeDefault = K
        }
        if (this.map) this.defaultValue = tP.emptyObject;
        else if (this.repeated) this.defaultValue = tP.emptyArray;
        else this.defaultValue = this.typeDefault;
        if (this.parent instanceof Aq8) this.parent.ctor.prototype[this.name] = this.defaultValue;
        return Oq8.prototype.resolve.call(this)
    };
    cD.prototype._inferLegacyProtoFeatures = function(K) {
        if (K !== "proto2" && K !== "proto3") return {};
        var _ = {};
        if (this.rule === "required") _.field_presence = "LEGACY_REQUIRED";
        if (this.parent && Xe1.defaults[this.type] === void 0) {
            var z = this.parent.get(this.type.split(".").pop());
            if (z && z instanceof Aq8 && z.group) _.message_encoding = "DELIMITED"
        }
        if (this.getOption("packed") === !0) _.repeated_field_encoding = "PACKED";
        else if (this.getOption("packed") === !1) _.repeated_field_encoding = "EXPANDED";
        return _
    };
    cD.prototype._resolveFeatures = function(K) {
        return Oq8.prototype._resolveFeatures.call(this, this._edition || K)
    };
    cD.d = function(K, _, z, Y) {
        if (typeof _ === "function") _ = tP.decorateType(_).name;
        else if (_ && typeof _ === "object") _ = tP.decorateEnum(_).name;
        return function(O, w) {
            tP.decorateType(O.constructor).add(new cD(w, K, _, z, {
                default: Y
            }))
        }
    };
    cD._configure = function(K) {
        Aq8 = K
    }
})
// @from(Ln 311704, Col 4)
oJ6 = p((J32, g1K) => {
    g1K.exports = KS;
    var JB8 = R36();
    ((KS.prototype = Object.create(JB8.prototype)).constructor = KS).className = "OneOf";
    var p1K = h36(),
        HB8 = dD();

    function KS(q, K, _, z) {
        if (!Array.isArray(K)) _ = K, K = void 0;
        if (JB8.call(this, q, _), !(K === void 0 || Array.isArray(K))) throw TypeError("fieldNames must be an Array");
        this.oneof = K || [], this.fieldsArray = [], this.comment = z
    }
    KS.fromJSON = function(K, _) {
        return new KS(K, _.oneof, _.options, _.comment)
    };
    KS.prototype.toJSON = function(K) {
        var _ = K ? Boolean(K.keepComments) : !1;
        return HB8.toObject(["options", this.options, "oneof", this.oneof, "comment", _ ? this.comment : void 0])
    };

    function F1K(q) {
        if (q.parent) {
            for (var K = 0; K < q.fieldsArray.length; ++K)
                if (!q.fieldsArray[K].parent) q.parent.add(q.fieldsArray[K])
        }
    }
    KS.prototype.add = function(K) {
        if (!(K instanceof p1K)) throw TypeError("field must be a Field");
        if (K.parent && K.parent !== this.parent) K.parent.remove(K);
        return this.oneof.push(K.name), this.fieldsArray.push(K), K.partOf = this, F1K(this), this
    };
    KS.prototype.remove = function(K) {
        if (!(K instanceof p1K)) throw TypeError("field must be a Field");
        var _ = this.fieldsArray.indexOf(K);
        if (_ < 0) throw Error(K + " is not a member of " + this);
        if (this.fieldsArray.splice(_, 1), _ = this.oneof.indexOf(K.name), _ > -1) this.oneof.splice(_, 1);
        return K.partOf = null, this
    };
    KS.prototype.onAdd = function(K) {
        JB8.prototype.onAdd.call(this, K);
        var _ = this;
        for (var z = 0; z < this.oneof.length; ++z) {
            var Y = K.get(this.oneof[z]);
            if (Y && !Y.partOf) Y.partOf = _, _.fieldsArray.push(Y)
        }
        F1K(this)
    };
    KS.prototype.onRemove = function(K) {
        for (var _ = 0, z; _ < this.fieldsArray.length; ++_)
            if ((z = this.fieldsArray[_]).parent) z.parent.remove(z);
        JB8.prototype.onRemove.call(this, K)
    };
    Object.defineProperty(KS.prototype, "isProto3Optional", {
        get: function() {
            if (this.fieldsArray == null || this.fieldsArray.length !== 1) return !1;
            var q = this.fieldsArray[0];
            return q.options != null && q.options.proto3_optional === !0
        }
    });
    KS.d = function() {
        var K = Array(arguments.length),
            _ = 0;
        while (_ < arguments.length) K[_] = arguments[_++];
        return function(Y, A) {
            HB8.decorateType(Y.constructor).add(new KS(A, K)), Object.defineProperty(Y, A, {
                get: HB8.oneOfGetter(K),
                set: HB8.oneOfSetter(K)
            })
        }
    }
})
// @from(Ln 311775, Col 4)
R36 = p((X32, U1K) => {
    U1K.exports = tf;
    tf.className = "ReflectionObject";
    var _Fz = oJ6(),
        wq8 = dD(),
        XB8, zFz = {
            enum_type: "OPEN",
            field_presence: "EXPLICIT",
            json_format: "ALLOW",
            message_encoding: "LENGTH_PREFIXED",
            repeated_field_encoding: "PACKED",
            utf8_validation: "VERIFY"
        },
        YFz = {
            enum_type: "CLOSED",
            field_presence: "EXPLICIT",
            json_format: "LEGACY_BEST_EFFORT",
            message_encoding: "LENGTH_PREFIXED",
            repeated_field_encoding: "EXPANDED",
            utf8_validation: "NONE"
        },
        AFz = {
            enum_type: "OPEN",
            field_presence: "IMPLICIT",
            json_format: "ALLOW",
            message_encoding: "LENGTH_PREFIXED",
            repeated_field_encoding: "PACKED",
            utf8_validation: "VERIFY"
        };

    function tf(q, K) {
        if (!wq8.isString(q)) throw TypeError("name must be a string");
        if (K && !wq8.isObject(K)) throw TypeError("options must be an object");
        this.options = K, this.parsedOptions = null, this.name = q, this._edition = null, this._defaultEdition = "proto2", this._features = {}, this._featuresResolved = !1, this.parent = null, this.resolved = !1, this.comment = null, this.filename = null
    }
    Object.defineProperties(tf.prototype, {
        root: {
            get: function() {
                var q = this;
                while (q.parent !== null) q = q.parent;
                return q
            }
        },
        fullName: {
            get: function() {
                var q = [this.name],
                    K = this.parent;
                while (K) q.unshift(K.name), K = K.parent;
                return q.join(".")
            }
        }
    });
    tf.prototype.toJSON = function() {
        throw Error()
    };
    tf.prototype.onAdd = function(K) {
        if (this.parent && this.parent !== K) this.parent.remove(this);
        this.parent = K, this.resolved = !1;
        var _ = K.root;
        if (_ instanceof XB8) _._handleAdd(this)
    };
    tf.prototype.onRemove = function(K) {
        var _ = K.root;
        if (_ instanceof XB8) _._handleRemove(this);
        this.parent = null, this.resolved = !1
    };
    tf.prototype.resolve = function() {
        if (this.resolved) return this;
        if (this.root instanceof XB8) this.resolved = !0;
        return this
    };
    tf.prototype._resolveFeaturesRecursive = function(K) {
        return this._resolveFeatures(this._edition || K)
    };
    tf.prototype._resolveFeatures = function(K) {
        if (this._featuresResolved) return;
        var _ = {};
        if (!K) throw Error("Unknown edition for " + this.fullName);
        var z = Object.assign(this.options ? Object.assign({}, this.options.features) : {}, this._inferLegacyProtoFeatures(K));
        if (this._edition) {
            if (K === "proto2") _ = Object.assign({}, YFz);
            else if (K === "proto3") _ = Object.assign({}, AFz);
            else if (K === "2023") _ = Object.assign({}, zFz);
            else throw Error("Unknown edition: " + K);
            this._features = Object.assign(_, z || {}), this._featuresResolved = !0;
            return
        }
        if (this.partOf instanceof _Fz) {
            var Y = Object.assign({}, this.partOf._features);
            this._features = Object.assign(Y, z || {})
        } else if (this.declaringField);
        else if (this.parent) {
            var A = Object.assign({}, this.parent._features);
            this._features = Object.assign(A, z || {})
        } else throw Error("Unable to find a parent for " + this.fullName);
        if (this.extensionField) this.extensionField._features = this._features;
        this._featuresResolved = !0
    };
    tf.prototype._inferLegacyProtoFeatures = function() {
        return {}
    };
    tf.prototype.getOption = function(K) {
        if (this.options) return this.options[K];
        return
    };
    tf.prototype.setOption = function(K, _, z) {
        if (!this.options) this.options = {};
        if (/^features\./.test(K)) wq8.setProperty(this.options, K, _, z);
        else if (!z || this.options[K] === void 0) {
            if (this.getOption(K) !== _) this.resolved = !1;
            this.options[K] = _
        }
        return this
    };
    tf.prototype.setParsedOption = function(K, _, z) {
        if (!this.parsedOptions) this.parsedOptions = [];
        var Y = this.parsedOptions;
        if (z) {
            var A = Y.find(function($) {
                return Object.prototype.hasOwnProperty.call($, K)
            });
            if (A) {
                var O = A[K];
                wq8.setProperty(O, z, _)
            } else A = {}, A[K] = wq8.setProperty({}, z, _), Y.push(A)
        } else {
            var w = {};
            w[K] = _, Y.push(w)
        }
        return this
    };
    tf.prototype.setOptions = function(K, _) {
        if (K)
            for (var z = Object.keys(K), Y = 0; Y < z.length; ++Y) this.setOption(z[Y], K[z[Y]], _);
        return this
    };
    tf.prototype.toString = function() {
        var K = this.constructor.className,
            _ = this.fullName;
        if (_.length) return K + " " + _;
        return K
    };
    tf.prototype._editionToJSON = function() {
        if (!this._edition || this._edition === "proto3") return;
        return this._edition
    };
    tf._configure = function(q) {
        XB8 = q
    }
})
// @from(Ln 311925, Col 4)
VF = p((M32, d1K) => {
    d1K.exports = kF;
    var Me1 = R36();
    ((kF.prototype = Object.create(Me1.prototype)).constructor = kF).className = "Enum";
    var Q1K = NS6(),
        MB8 = dD();

    function kF(q, K, _, z, Y, A) {
        if (Me1.call(this, q, _), K && typeof K !== "object") throw TypeError("values must be an object");
        if (this.valuesById = {}, this.values = Object.create(this.valuesById), this.comment = z, this.comments = Y || {}, this.valuesOptions = A, this._valuesFeatures = {}, this.reserved = void 0, K) {
            for (var O = Object.keys(K), w = 0; w < O.length; ++w)
                if (typeof K[O[w]] === "number") this.valuesById[this.values[O[w]] = K[O[w]]] = O[w]
        }
    }
    kF.prototype._resolveFeatures = function(K) {
        return K = this._edition || K, Me1.prototype._resolveFeatures.call(this, K), Object.keys(this.values).forEach((_) => {
            var z = Object.assign({}, this._features);
            this._valuesFeatures[_] = Object.assign(z, this.valuesOptions && this.valuesOptions[_] && this.valuesOptions[_].features)
        }), this
    };
    kF.fromJSON = function(K, _) {
        var z = new kF(K, _.values, _.options, _.comment, _.comments);
        if (z.reserved = _.reserved, _.edition) z._edition = _.edition;
        return z._defaultEdition = "proto3", z
    };
    kF.prototype.toJSON = function(K) {
        var _ = K ? Boolean(K.keepComments) : !1;
        return MB8.toObject(["edition", this._editionToJSON(), "options", this.options, "valuesOptions", this.valuesOptions, "values", this.values, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "comment", _ ? this.comment : void 0, "comments", _ ? this.comments : void 0])
    };
    kF.prototype.add = function(K, _, z, Y) {
        if (!MB8.isString(K)) throw TypeError("name must be a string");
        if (!MB8.isInteger(_)) throw TypeError("id must be an integer");
        if (this.values[K] !== void 0) throw Error("duplicate name '" + K + "' in " + this);
        if (this.isReservedId(_)) throw Error("id " + _ + " is reserved in " + this);
        if (this.isReservedName(K)) throw Error("name '" + K + "' is reserved in " + this);
        if (this.valuesById[_] !== void 0) {
            if (!(this.options && this.options.allow_alias)) throw Error("duplicate id " + _ + " in " + this);
            this.values[K] = _
        } else this.valuesById[this.values[K] = _] = K;
        if (Y) {
            if (this.valuesOptions === void 0) this.valuesOptions = {};
            this.valuesOptions[K] = Y || null
        }
        return this.comments[K] = z || null, this
    };
    kF.prototype.remove = function(K) {
        if (!MB8.isString(K)) throw TypeError("name must be a string");
        var _ = this.values[K];
        if (_ == null) throw Error("name '" + K + "' does not exist in " + this);
        if (delete this.valuesById[_], delete this.values[K], delete this.comments[K], this.valuesOptions) delete this.valuesOptions[K];
        return this
    };
    kF.prototype.isReservedId = function(K) {
        return Q1K.isReservedId(this.reserved, K)
    };
    kF.prototype.isReservedName = function(K) {
        return Q1K.isReservedName(this.reserved, K)
    }
})
// @from(Ln 311984, Col 4)
Oe1 = p((P32, l1K) => {
    l1K.exports = wFz;
    var OFz = VF(),
        Pe1 = aJ6(),
        We1 = dD();

    function c1K(q, K, _, z) {
        return K.delimited ? q("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", _, z, (K.id << 3 | 3) >>> 0, (K.id << 3 | 4) >>> 0) : q("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", _, z, (K.id << 3 | 2) >>> 0)
    }

    function wFz(q) {
        var K = We1.codegen(["m", "w"], q.name + "$encode")("if(!w)")("w=Writer.create()"),
            _, z, Y = q.fieldsArray.slice().sort(We1.compareFieldsById);
        for (var _ = 0; _ < Y.length; ++_) {
            var A = Y[_].resolve(),
                O = q._fieldsArray.indexOf(A),
                w = A.resolvedType instanceof OFz ? "int32" : A.type,
                $ = Pe1.basic[w];
            if (z = "m" + We1.safeProp(A.name), A.map) {
                if (K("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", z, A.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", z)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (A.id << 3 | 2) >>> 0, 8 | Pe1.mapKey[A.keyType], A.keyType), $ === void 0) K("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", O, z);
                else K(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | $, w, z);
                K("}")("}")
            } else if (A.repeated) {
                if (K("if(%s!=null&&%s.length){", z, z), A.packed && Pe1.packed[w] !== void 0) K("w.uint32(%i).fork()", (A.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", z)("w.%s(%s[i])", w, z)("w.ldelim()");
                else if (K("for(var i=0;i<%s.length;++i)", z), $ === void 0) c1K(K, A, O, z + "[i]");
                else K("w.uint32(%i).%s(%s[i])", (A.id << 3 | $) >>> 0, w, z);
                K("}")
            } else {
                if (A.optional) K("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", z, A.name);
                if ($ === void 0) c1K(K, A, O, z);
                else K("w.uint32(%i).%s(%s)", (A.id << 3 | $) >>> 0, w, z)
            }
        }
        return K("return w")
    }
})
// @from(Ln 312020, Col 4)
i1K = p((W32, n1K) => {
    var JA = n1K.exports = ds1();
    JA.build = "light";

    function $Fz(q, K, _) {
        if (typeof K === "function") _ = K, K = new JA.Root;
        else if (!K) K = new JA.Root;
        return K.load(q, _)
    }
    JA.load = $Fz;

    function jFz(q, K) {
        if (!K) K = new JA.Root;
        return K.loadSync(q)
    }
    JA.loadSync = jFz;
    JA.encoder = Oe1();
    JA.decoder = ot1();
    JA.verifier = tt1();
    JA.converter = Ke1();
    JA.ReflectionObject = R36();
    JA.Namespace = NS6();
    JA.Root = jB8();
    JA.Enum = VF();
    JA.Type = AB8();
    JA.Field = h36();
    JA.OneOf = oJ6();
    JA.MapField = em8();
    JA.Service = KB8();
    JA.Method = qB8();
    JA.Message = _B8();
    JA.wrappers = _e1();
    JA.types = aJ6();
    JA.util = dD();
    JA.ReflectionObject._configure(JA.Root);
    JA.Namespace._configure(JA.Type, JA.Service, JA.Enum);
    JA.Root._configure(JA.Type);
    JA.Field._configure(JA.Type)
})
// @from(Ln 312059, Col 4)
Ze1 = p((D32, a1K) => {
    a1K.exports = o1K;
    var De1 = /[\s{}=;:[\],'"()<>]/g,
        HFz = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,
        JFz = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
        XFz = /^ *[*/]+ */,
        MFz = /^\s*\*?\/*/,
        PFz = /\n/g,
        WFz = /\s/,
        DFz = /\\(.?)/g,
        ZFz = {
            "0": "\x00",
            r: "\r",
            n: `
`,
            t: "\t"
        };

    function r1K(q) {
        return q.replace(DFz, function(K, _) {
            switch (_) {
                case "\\":
                case "":
                    return _;
                default:
                    return ZFz[_] || ""
            }
        })
    }
    o1K.unescape = r1K;

    function o1K(q, K) {
        q = q.toString();
        var _ = 0,
            z = q.length,
            Y = 1,
            A = 0,
            O = {},
            w = [],
            $ = null;

        function j(v) {
            return Error("illegal " + v + " (line " + Y + ")")
        }

        function H() {
            var v = $ === "'" ? JFz : HFz;
            v.lastIndex = _ - 1;
            var V = v.exec(q);
            if (!V) throw j("string");
            return _ = v.lastIndex, D($), $ = null, r1K(V[1])
        }

        function J(v) {
            return q.charAt(v)
        }

        function X(v, V, k) {
            var N = {
                    type: q.charAt(v++),
                    lineEmpty: !1,
                    leading: k
                },
                R;
            if (K) R = 2;
            else R = 3;
            var h = v - R,
                C;
            do
                if (--h < 0 || (C = q.charAt(h)) === `
`) {
                    N.lineEmpty = !0;
                    break
                } while (C === " " || C === "\t");
            var x = q.substring(v, V).split(PFz);
            for (var B = 0; B < x.length; ++B) x[B] = x[B].replace(K ? MFz : XFz, "").trim();
            N.text = x.join(`
`).trim(), O[Y] = N, A = Y
        }

        function M(v) {
            var V = P(v),
                k = q.substring(v, V),
                N = /^\s*\/\//.test(k);
            return N
        }

        function P(v) {
            var V = v;
            while (V < z && J(V) !== `
`) V++;
            return V
        }

        function W() {
            if (w.length > 0) return w.shift();
            if ($) return H();
            var v, V, k, N, R, h = _ === 0;
            do {
                if (_ === z) return null;
                v = !1;
                while (WFz.test(k = J(_))) {
                    if (k === `
`) h = !0, ++Y;
                    if (++_ === z) return null
                }
                if (J(_) === "/") {
                    if (++_ === z) throw j("comment");
                    if (J(_) === "/")
                        if (!K) {
                            R = J(N = _ + 1) === "/";
                            while (J(++_) !== `
`)
                                if (_ === z) return null;
                            if (++_, R) X(N, _ - 1, h), h = !0;
                            ++Y, v = !0
                        } else {
                            if (N = _, R = !1, M(_ - 1)) {
                                R = !0;
                                do {
                                    if (_ = P(_), _ === z) break;
                                    if (_++, !h) break
                                } while (M(_))
                            } else _ = Math.min(z, P(_) + 1);
                            if (R) X(N, _, h), h = !0;
                            Y++, v = !0
                        }
                    else if ((k = J(_)) === "*") {
                        N = _ + 1, R = K || J(N) === "*";
                        do {
                            if (k === `
`) ++Y;
                            if (++_ === z) throw j("comment");
                            V = k, k = J(_)
                        } while (V !== "*" || k !== "/");
                        if (++_, R) X(N, _ - 2, h), h = !0;
                        v = !0
                    } else return "/"
                }
            } while (v);
            var C = _;
            De1.lastIndex = 0;
            var x = De1.test(J(C++));
            if (!x)
                while (C < z && !De1.test(J(C))) ++C;
            var B = q.substring(_, _ = C);
            if (B === '"' || B === "'") $ = B;
            return B
        }

        function D(v) {
            w.push(v)
        }

        function Z() {
            if (!w.length) {
                var v = W();
                if (v === null) return null;
                D(v)
            }
            return w[0]
        }

        function G(v, V) {
            var k = Z(),
                N = k === v;
            if (N) return W(), !0;
            if (!V) throw j("token '" + k + "', '" + v + "' expected");
            return !1
        }

        function f(v) {
            var V = null,
                k;
            if (v === void 0) {
                if (k = O[Y - 1], delete O[Y - 1], k && (K || k.type === "*" || k.lineEmpty)) V = k.leading ? k.text : null
            } else {
                if (A < v) Z();
                if (k = O[v], delete O[v], k && !k.lineEmpty && (K || k.type === "/")) V = k.leading ? null : k.text
            }
            return V
        }
        return Object.defineProperty({
            next: W,
            peek: Z,
            push: D,
            skip: G,
            cmnt: f
        }, "line", {
            get: function() {
                return Y
            }
        })
    }
})
// @from(Ln 312254, Col 4)
_7K = p((Z32, K7K) => {
    K7K.exports = ft;
    ft.filename = null;
    ft.defaults = {
        keepCase: !1
    };
    var fFz = Ze1(),
        s1K = jB8(),
        t1K = AB8(),
        e1K = h36(),
        GFz = em8(),
        q7K = oJ6(),
        vFz = VF(),
        TFz = KB8(),
        VFz = qB8(),
        kFz = R36(),
        NFz = aJ6(),
        fe1 = dD(),
        EFz = /^[1-9][0-9]*$/,
        yFz = /^-?[1-9][0-9]*$/,
        LFz = /^0[x][0-9a-fA-F]+$/,
        hFz = /^-?0[x][0-9a-fA-F]+$/,
        RFz = /^0[0-7]+$/,
        SFz = /^-?0[0-7]+$/,
        CFz = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/,
        Ml = /^[a-zA-Z_][a-zA-Z_0-9]*$/,
        Pl = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/;

    function ft(q, K, _) {
        if (!(K instanceof s1K)) _ = K, K = new s1K;
        if (!_) _ = ft.defaults;
        var z = _.preferTrailingComment || !1,
            Y = fFz(q, _.alternateCommentMode || !1),
            A = Y.next,
            O = Y.push,
            w = Y.peek,
            $ = Y.skip,
            j = Y.cmnt,
            H = !0,
            J, X, M, P = "proto2",
            W = K,
            D = [],
            Z = {},
            G = _.keepCase ? function(r) {
                return r
            } : fe1.camelCase;

        function f() {
            D.forEach((r) => {
                r._edition = P, Object.keys(Z).forEach((t) => {
                    if (r.getOption(t) !== void 0) return;
                    r.setOption(t, Z[t], !0)
                })
            })
        }

        function v(r, t, Y6) {
            var X6 = ft.filename;
            if (!Y6) ft.filename = null;
            return Error("illegal " + (t || "token") + " '" + r + "' (" + (X6 ? X6 + ", " : "") + "line " + Y.line + ")")
        }

        function V() {
            var r = [],
                t;
            do {
                if ((t = A()) !== '"' && t !== "'") throw v(t);
                r.push(A()), $(t), t = w()
            } while (t === '"' || t === "'");
            return r.join("")
        }

        function k(r) {
            var t = A();
            switch (t) {
                case "'":
                case '"':
                    return O(t), V();
                case "true":
                case "TRUE":
                    return !0;
                case "false":
                case "FALSE":
                    return !1
            }
            try {
                return R(t, !0)
            } catch (Y6) {
                if (r && Pl.test(t)) return t;
                throw v(t, "value")
            }
        }

        function N(r, t) {
            var Y6, X6;
            do
                if (t && ((Y6 = w()) === '"' || Y6 === "'")) {
                    var M6 = V();
                    if (r.push(M6), P >= 2023) throw v(M6, "id")
                } else try {
                    r.push([X6 = h(A()), $("to", !0) ? h(A()) : X6])
                } catch (V6) {
                    if (t && Pl.test(Y6) && P >= 2023) r.push(Y6);
                    else throw V6
                }
            while ($(",", !0));
            var W6 = {
                options: void 0
            };
            W6.setOption = function(V6, f6) {
                if (this.options === void 0) this.options = {};
                this.options[V6] = f6
            }, F(W6, function(f6) {
                if (f6 === "option") e(W6, f6), $(";");
                else throw v(f6)
            }, function() {
                $6(W6)
            })
        }

        function R(r, t) {
            var Y6 = 1;
            if (r.charAt(0) === "-") Y6 = -1, r = r.substring(1);
            switch (r) {
                case "inf":
                case "INF":
                case "Inf":
                    return Y6 * (1 / 0);
                case "nan":
                case "NAN":
                case "Nan":
                case "NaN":
                    return NaN;
                case "0":
                    return 0
            }
            if (EFz.test(r)) return Y6 * parseInt(r, 10);
            if (LFz.test(r)) return Y6 * parseInt(r, 16);
            if (RFz.test(r)) return Y6 * parseInt(r, 8);
            if (CFz.test(r)) return Y6 * parseFloat(r);
            throw v(r, "number", t)
        }

        function h(r, t) {
            switch (r) {
                case "max":
                case "MAX":
                case "Max":
                    return 536870911;
                case "0":
                    return 0
            }
            if (!t && r.charAt(0) === "-") throw v(r, "id");
            if (yFz.test(r)) return parseInt(r, 10);
            if (hFz.test(r)) return parseInt(r, 16);
            if (SFz.test(r)) return parseInt(r, 8);
            throw v(r, "id")
        }

        function C() {
            if (J !== void 0) throw v("package");
            if (J = A(), !Pl.test(J)) throw v(J, "name");
            W = W.define(J), $(";")
        }

        function x() {
            var r = w(),
                t;
            switch (r) {
                case "weak":
                    t = M || (M = []), A();
                    break;
                case "public":
                    A();
                default:
                    t = X || (X = []);
                    break
            }
            r = V(), $(";"), t.push(r)
        }

        function B() {
            if ($("="), P = V(), P < 2023) throw v(P, "syntax");
            $(";")
        }

        function m() {
            if ($("="), P = V(), !["2023"].includes(P)) throw v(P, "edition");
            $(";")
        }

        function S(r, t) {
            switch (t) {
                case "option":
                    return e(r, t), $(";"), !0;
                case "message":
                    return U(r, t), !0;
                case "enum":
                    return z6(r, t), !0;
                case "service":
                    return H6(r, t), !0;
                case "extend":
                    return o(r, t), !0
            }
            return !1
        }

        function F(r, t, Y6) {
            var X6 = Y.line;
            if (r) {
                if (typeof r.comment !== "string") r.comment = j();
                r.filename = ft.filename
            }
            if ($("{", !0)) {
                var M6;
                while ((M6 = A()) !== "}") t(M6);
                $(";", !0)
            } else {
                if (Y6) Y6();
                if ($(";"), r && (typeof r.comment !== "string" || z)) r.comment = j(X6) || r.comment
            }
        }

        function U(r, t) {
            if (!Ml.test(t = A())) throw v(t, "type name");
            var Y6 = new t1K(t);
            if (F(Y6, function(M6) {
                    if (S(Y6, M6)) return;
                    switch (M6) {
                        case "map":
                            n(Y6, M6);
                            break;
                        case "required":
                            if (P !== "proto2") throw v(M6);
                        case "repeated":
                            g(Y6, M6);
                            break;
                        case "optional":
                            if (P === "proto3") g(Y6, "proto3_optional");
                            else if (P !== "proto2") throw v(M6);
                            else g(Y6, "optional");
                            break;
                        case "oneof":
                            l(Y6, M6);
                            break;
                        case "extensions":
                            N(Y6.extensions || (Y6.extensions = []));
                            break;
                        case "reserved":
                            N(Y6.reserved || (Y6.reserved = []), !0);
                            break;
                        default:
                            if (P === "proto2" || !Pl.test(M6)) throw v(M6);
                            O(M6), g(Y6, "optional");
                            break
                    }
                }), r.add(Y6), r === W) D.push(Y6)
        }

        function g(r, t, Y6) {
            var X6 = A();
            if (X6 === "group") {
                c(r, t);
                return
            }
            while (X6.endsWith(".") || w().startsWith(".")) X6 += A();
            if (!Pl.test(X6)) throw v(X6, "type");
            var M6 = A();
            if (!Ml.test(M6)) throw v(M6, "name");
            M6 = G(M6), $("=");
            var W6 = new e1K(M6, h(A()), X6, t, Y6);
            if (F(W6, function(G6) {
                    if (G6 === "option") e(W6, G6), $(";");
                    else throw v(G6)
                }, function() {
                    $6(W6)
                }), t === "proto3_optional") {
                var V6 = new q7K("_" + M6);
                W6.setOption("proto3_optional", !0), V6.add(W6), r.add(V6)
            } else r.add(W6);
            if (r === W) D.push(W6)
        }

        function c(r, t) {
            if (P >= 2023) throw v("group");
            var Y6 = A();
            if (!Ml.test(Y6)) throw v(Y6, "name");
            var X6 = fe1.lcFirst(Y6);
            if (Y6 === X6) Y6 = fe1.ucFirst(Y6);
            $("=");
            var M6 = h(A()),
                W6 = new t1K(Y6);
            W6.group = !0;
            var V6 = new e1K(X6, M6, Y6, t);
            V6.filename = ft.filename, F(W6, function(G6) {
                switch (G6) {
                    case "option":
                        e(W6, G6), $(";");
                        break;
                    case "required":
                    case "repeated":
                        g(W6, G6);
                        break;
                    case "optional":
                        if (P === "proto3") g(W6, "proto3_optional");
                        else g(W6, "optional");
                        break;
                    case "message":
                        U(W6, G6);
                        break;
                    case "enum":
                        z6(W6, G6);
                        break;
                    case "reserved":
                        N(W6.reserved || (W6.reserved = []), !0);
                        break;
                    default:
                        throw v(G6)
                }
            }), r.add(W6).add(V6)
        }

        function n(r) {
            $("<");
            var t = A();
            if (NFz.mapKey[t] === void 0) throw v(t, "type");
            $(",");
            var Y6 = A();
            if (!Pl.test(Y6)) throw v(Y6, "type");
            $(">");
            var X6 = A();
            if (!Ml.test(X6)) throw v(X6, "name");
            $("=");
            var M6 = new GFz(G(X6), h(A()), t, Y6);
            F(M6, function(V6) {
                if (V6 === "option") e(M6, V6), $(";");
                else throw v(V6)
            }, function() {
                $6(M6)
            }), r.add(M6)
        }

        function l(r, t) {
            if (!Ml.test(t = A())) throw v(t, "name");
            var Y6 = new q7K(G(t));
            F(Y6, function(M6) {
                if (M6 === "option") e(Y6, M6), $(";");
                else O(M6), g(Y6, "optional")
            }), r.add(Y6)
        }

        function z6(r, t) {
            if (!Ml.test(t = A())) throw v(t, "name");
            var Y6 = new vFz(t);
            if (F(Y6, function(M6) {
                    switch (M6) {
                        case "option":
                            e(Y6, M6), $(";");
                            break;
                        case "reserved":
                            if (N(Y6.reserved || (Y6.reserved = []), !0), Y6.reserved === void 0) Y6.reserved = [];
                            break;
                        default:
                            A6(Y6, M6)
                    }
                }), r.add(Y6), r === W) D.push(Y6)
        }

        function A6(r, t) {
            if (!Ml.test(t)) throw v(t, "name");
            $("=");
            var Y6 = h(A(), !0),
                X6 = {
                    options: void 0
                };
            X6.getOption = function(M6) {
                return this.options[M6]
            }, X6.setOption = function(M6, W6) {
                kFz.prototype.setOption.call(X6, M6, W6)
            }, X6.setParsedOption = function() {
                return
            }, F(X6, function(W6) {
                if (W6 === "option") e(X6, W6), $(";");
                else throw v(W6)
            }, function() {
                $6(X6)
            }), r.add(t, Y6, X6.comment, X6.parsedOptions || X6.options)
        }

        function e(r, t) {
            var Y6, X6, M6 = !0;
            if (t === "option") t = A();
            while (t !== "=") {
                if (t === "(") {
                    var W6 = A();
                    $(")"), t = "(" + W6 + ")"
                }
                if (M6) {
                    if (M6 = !1, t.includes(".") && !t.includes("(")) {
                        var V6 = t.split(".");
                        Y6 = V6[0] + ".", t = V6[1];
                        continue
                    }
                    Y6 = t
                } else X6 = X6 ? X6 += t : t;
                t = A()
            }
            var f6 = X6 ? Y6.concat(X6) : Y6,
                G6 = i(r, f6);
            X6 = X6 && X6[0] === "." ? X6.slice(1) : X6, Y6 = Y6 && Y6[Y6.length - 1] === "." ? Y6.slice(0, -1) : Y6, J6(r, Y6, G6, X6)
        }

        function i(r, t) {
            if ($("{", !0)) {
                var Y6 = {};
                while (!$("}", !0)) {
                    if (!Ml.test(_6 = A())) throw v(_6, "name");
                    if (_6 === null) throw v(_6, "end of input");
                    var X6, M6 = _6;
                    if ($(":", !0), w() === "{") X6 = i(r, t + "." + _6);
                    else if (w() === "[") {
                        X6 = [];
                        var W6;
                        if ($("[", !0)) {
                            do W6 = k(!0), X6.push(W6); while ($(",", !0));
                            if ($("]"), typeof W6 < "u") O6(r, t + "." + _6, W6)
                        }
                    } else X6 = k(!0), O6(r, t + "." + _6, X6);
                    var V6 = Y6[M6];
                    if (V6) X6 = [].concat(V6).concat(X6);
                    Y6[M6] = X6, $(",", !0), $(";", !0)
                }
                return Y6
            }
            var f6 = k(!0);
            return O6(r, t, f6), f6
        }

        function O6(r, t, Y6) {
            if (W === r && /^features\./.test(t)) {
                Z[t] = Y6;
                return
            }
            if (r.setOption) r.setOption(t, Y6)
        }

        function J6(r, t, Y6, X6) {
            if (r.setParsedOption) r.setParsedOption(t, Y6, X6)
        }

        function $6(r) {
            if ($("[", !0)) {
                do e(r, "option"); while ($(",", !0));
                $("]")
            }
            return r
        }

        function H6(r, t) {
            if (!Ml.test(t = A())) throw v(t, "service name");
            var Y6 = new TFz(t);
            if (F(Y6, function(M6) {
                    if (S(Y6, M6)) return;
                    if (M6 === "rpc") q6(Y6, M6);
                    else throw v(M6)
                }), r.add(Y6), r === W) D.push(Y6)
        }

        function q6(r, t) {
            var Y6 = j(),
                X6 = t;
            if (!Ml.test(t = A())) throw v(t, "name");
            var M6 = t,
                W6, V6, f6, G6;
            if ($("("), $("stream", !0)) V6 = !0;
            if (!Pl.test(t = A())) throw v(t);
            if (W6 = t, $(")"), $("returns"), $("("), $("stream", !0)) G6 = !0;
            if (!Pl.test(t = A())) throw v(t);
            f6 = t, $(")");
            var k6 = new VFz(M6, X6, W6, f6, V6, G6);
            k6.comment = Y6, F(k6, function(v6) {
                if (v6 === "option") e(k6, v6), $(";");
                else throw v(v6)
            }), r.add(k6)
        }

        function o(r, t) {
            if (!Pl.test(t = A())) throw v(t, "reference");
            var Y6 = t;
            F(null, function(M6) {
                switch (M6) {
                    case "required":
                    case "repeated":
                        g(r, M6, Y6);
                        break;
                    case "optional":
                        if (P === "proto3") g(r, "proto3_optional", Y6);
                        else g(r, "optional", Y6);
                        break;
                    default:
                        if (P === "proto2" || !Pl.test(M6)) throw v(M6);
                        O(M6), g(r, "optional", Y6);
                        break
                }
            })
        }
        var _6;
        while ((_6 = A()) !== null) switch (_6) {
            case "package":
                if (!H) throw v(_6);
                C();
                break;
            case "import":
                if (!H) throw v(_6);
                x();
                break;
            case "syntax":
                if (!H) throw v(_6);
                B();
                break;
            case "edition":
                if (!H) throw v(_6);
                m();
                break;
            case "option":
                e(W, _6), $(";", !0);
                break;
            default:
                if (S(W, _6)) {
                    H = !1;
                    continue
                }
                throw v(_6)
        }
        return f(), ft.filename = null, {
            package: J,
            imports: X,
            weakImports: M,
            root: K
        }
    }
})
// @from(Ln 312796, Col 4)
A7K = p((f32, Y7K) => {
    Y7K.exports = NF;
    var bFz = /\/|\./;

    function NF(q, K) {
        if (!bFz.test(q)) q = "google/protobuf/" + q + ".proto", K = {
            nested: {
                google: {
                    nested: {
                        protobuf: {
                            nested: K
                        }
                    }
                }
            }
        };
        NF[q] = K
    }
    NF("any", {
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
    var z7K;
    NF("duration", {
        Duration: z7K = {
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
    NF("timestamp", {
        Timestamp: z7K
    });
    NF("empty", {
        Empty: {
            fields: {}
        }
    });
    NF("struct", {
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
    NF("wrappers", {
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
    NF("field_mask", {
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
    NF.get = function(K) {
        return NF[K] || null
    }
})
// @from(Ln 312998, Col 4)
PB8 = p((G32, O7K) => {
    var C36 = O7K.exports = i1K();
    C36.build = "full";
    C36.tokenize = Ze1();
    C36.parse = _7K();
    C36.common = A7K();
    C36.Root._configure(C36.Type, C36.parse, C36.common)
})