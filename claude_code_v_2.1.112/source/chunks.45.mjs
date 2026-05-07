
// @from(Ln 111472, Col 4)
RT1 = p((vJO, vf8) => {
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    var Wvq, Dvq, Zvq, fvq, Gvq, vvq, Tvq, Vvq, kvq, Gf8, hT1, Nvq, Evq, UT6, yvq, Lvq, hvq, Rvq, Svq, Cvq, bvq, Ivq, xvq;
    (function(q) {
        var K = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(z) {
            q(_(K, _(z)))
        });
        else if (typeof vf8 === "object" && typeof vJO === "object") q(_(K, _(vJO)));
        else q(_(K));

        function _(z, Y) {
            if (z !== K)
                if (typeof Object.create === "function") Object.defineProperty(z, "__esModule", {
                    value: !0
                });
                else z.__esModule = !0;
            return function(A, O) {
                return z[A] = Y ? Y(A, O) : O
            }
        }
    })(function(q) {
        var K = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function(_, z) {
            _.__proto__ = z
        } || function(_, z) {
            for (var Y in z)
                if (z.hasOwnProperty(Y)) _[Y] = z[Y]
        };
        Wvq = function(_, z) {
            K(_, z);

            function Y() {
                this.constructor = _
            }
            _.prototype = z === null ? Object.create(z) : (Y.prototype = z.prototype, new Y)
        }, Dvq = Object.assign || function(_) {
            for (var z, Y = 1, A = arguments.length; Y < A; Y++) {
                z = arguments[Y];
                for (var O in z)
                    if (Object.prototype.hasOwnProperty.call(z, O)) _[O] = z[O]
            }
            return _
        }, Zvq = function(_, z) {
            var Y = {};
            for (var A in _)
                if (Object.prototype.hasOwnProperty.call(_, A) && z.indexOf(A) < 0) Y[A] = _[A];
            if (_ != null && typeof Object.getOwnPropertySymbols === "function") {
                for (var O = 0, A = Object.getOwnPropertySymbols(_); O < A.length; O++)
                    if (z.indexOf(A[O]) < 0 && Object.prototype.propertyIsEnumerable.call(_, A[O])) Y[A[O]] = _[A[O]]
            }
            return Y
        }, fvq = function(_, z, Y, A) {
            var O = arguments.length,
                w = O < 3 ? z : A === null ? A = Object.getOwnPropertyDescriptor(z, Y) : A,
                $;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") w = Reflect.decorate(_, z, Y, A);
            else
                for (var j = _.length - 1; j >= 0; j--)
                    if ($ = _[j]) w = (O < 3 ? $(w) : O > 3 ? $(z, Y, w) : $(z, Y)) || w;
            return O > 3 && w && Object.defineProperty(z, Y, w), w
        }, Gvq = function(_, z) {
            return function(Y, A) {
                z(Y, A, _)
            }
        }, vvq = function(_, z) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(_, z)
        }, Tvq = function(_, z, Y, A) {
            function O(w) {
                return w instanceof Y ? w : new Y(function($) {
                    $(w)
                })
            }
            return new(Y || (Y = Promise))(function(w, $) {
                function j(X) {
                    try {
                        J(A.next(X))
                    } catch (M) {
                        $(M)
                    }
                }

                function H(X) {
                    try {
                        J(A.throw(X))
                    } catch (M) {
                        $(M)
                    }
                }

                function J(X) {
                    X.done ? w(X.value) : O(X.value).then(j, H)
                }
                J((A = A.apply(_, z || [])).next())
            })
        }, Vvq = function(_, z) {
            var Y = {
                    label: 0,
                    sent: function() {
                        if (w[0] & 1) throw w[1];
                        return w[1]
                    },
                    trys: [],
                    ops: []
                },
                A, O, w, $;
            return $ = {
                next: j(0),
                throw: j(1),
                return: j(2)
            }, typeof Symbol === "function" && ($[Symbol.iterator] = function() {
                return this
            }), $;

            function j(J) {
                return function(X) {
                    return H([J, X])
                }
            }

            function H(J) {
                if (A) throw TypeError("Generator is already executing.");
                while (Y) try {
                    if (A = 1, O && (w = J[0] & 2 ? O.return : J[0] ? O.throw || ((w = O.return) && w.call(O), 0) : O.next) && !(w = w.call(O, J[1])).done) return w;
                    if (O = 0, w) J = [J[0] & 2, w.value];
                    switch (J[0]) {
                        case 0:
                        case 1:
                            w = J;
                            break;
                        case 4:
                            return Y.label++, {
                                value: J[1],
                                done: !1
                            };
                        case 5:
                            Y.label++, O = J[1], J = [0];
                            continue;
                        case 7:
                            J = Y.ops.pop(), Y.trys.pop();
                            continue;
                        default:
                            if ((w = Y.trys, !(w = w.length > 0 && w[w.length - 1])) && (J[0] === 6 || J[0] === 2)) {
                                Y = 0;
                                continue
                            }
                            if (J[0] === 3 && (!w || J[1] > w[0] && J[1] < w[3])) {
                                Y.label = J[1];
                                break
                            }
                            if (J[0] === 6 && Y.label < w[1]) {
                                Y.label = w[1], w = J;
                                break
                            }
                            if (w && Y.label < w[2]) {
                                Y.label = w[2], Y.ops.push(J);
                                break
                            }
                            if (w[2]) Y.ops.pop();
                            Y.trys.pop();
                            continue
                    }
                    J = z.call(_, Y)
                } catch (X) {
                    J = [6, X], O = 0
                } finally {
                    A = w = 0
                }
                if (J[0] & 5) throw J[1];
                return {
                    value: J[0] ? J[1] : void 0,
                    done: !0
                }
            }
        }, xvq = function(_, z, Y, A) {
            if (A === void 0) A = Y;
            _[A] = z[Y]
        }, kvq = function(_, z) {
            for (var Y in _)
                if (Y !== "default" && !z.hasOwnProperty(Y)) z[Y] = _[Y]
        }, Gf8 = function(_) {
            var z = typeof Symbol === "function" && Symbol.iterator,
                Y = z && _[z],
                A = 0;
            if (Y) return Y.call(_);
            if (_ && typeof _.length === "number") return {
                next: function() {
                    if (_ && A >= _.length) _ = void 0;
                    return {
                        value: _ && _[A++],
                        done: !_
                    }
                }
            };
            throw TypeError(z ? "Object is not iterable." : "Symbol.iterator is not defined.")
        }, hT1 = function(_, z) {
            var Y = typeof Symbol === "function" && _[Symbol.iterator];
            if (!Y) return _;
            var A = Y.call(_),
                O, w = [],
                $;
            try {
                while ((z === void 0 || z-- > 0) && !(O = A.next()).done) w.push(O.value)
            } catch (j) {
                $ = {
                    error: j
                }
            } finally {
                try {
                    if (O && !O.done && (Y = A.return)) Y.call(A)
                } finally {
                    if ($) throw $.error
                }
            }
            return w
        }, Nvq = function() {
            for (var _ = [], z = 0; z < arguments.length; z++) _ = _.concat(hT1(arguments[z]));
            return _
        }, Evq = function() {
            for (var _ = 0, z = 0, Y = arguments.length; z < Y; z++) _ += arguments[z].length;
            for (var A = Array(_), O = 0, z = 0; z < Y; z++)
                for (var w = arguments[z], $ = 0, j = w.length; $ < j; $++, O++) A[O] = w[$];
            return A
        }, UT6 = function(_) {
            return this instanceof UT6 ? (this.v = _, this) : new UT6(_)
        }, yvq = function(_, z, Y) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var A = Y.apply(_, z || []),
                O, w = [];
            return O = {}, $("next"), $("throw"), $("return"), O[Symbol.asyncIterator] = function() {
                return this
            }, O;

            function $(P) {
                if (A[P]) O[P] = function(W) {
                    return new Promise(function(D, Z) {
                        w.push([P, W, D, Z]) > 1 || j(P, W)
                    })
                }
            }

            function j(P, W) {
                try {
                    H(A[P](W))
                } catch (D) {
                    M(w[0][3], D)
                }
            }

            function H(P) {
                P.value instanceof UT6 ? Promise.resolve(P.value.v).then(J, X) : M(w[0][2], P)
            }

            function J(P) {
                j("next", P)
            }

            function X(P) {
                j("throw", P)
            }

            function M(P, W) {
                if (P(W), w.shift(), w.length) j(w[0][0], w[0][1])
            }
        }, Lvq = function(_) {
            var z, Y;
            return z = {}, A("next"), A("throw", function(O) {
                throw O
            }), A("return"), z[Symbol.iterator] = function() {
                return this
            }, z;

            function A(O, w) {
                z[O] = _[O] ? function($) {
                    return (Y = !Y) ? {
                        value: UT6(_[O]($)),
                        done: O === "return"
                    } : w ? w($) : $
                } : w
            }
        }, hvq = function(_) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var z = _[Symbol.asyncIterator],
                Y;
            return z ? z.call(_) : (_ = typeof Gf8 === "function" ? Gf8(_) : _[Symbol.iterator](), Y = {}, A("next"), A("throw"), A("return"), Y[Symbol.asyncIterator] = function() {
                return this
            }, Y);

            function A(w) {
                Y[w] = _[w] && function($) {
                    return new Promise(function(j, H) {
                        $ = _[w]($), O(j, H, $.done, $.value)
                    })
                }
            }

            function O(w, $, j, H) {
                Promise.resolve(H).then(function(J) {
                    w({
                        value: J,
                        done: j
                    })
                }, $)
            }
        }, Rvq = function(_, z) {
            if (Object.defineProperty) Object.defineProperty(_, "raw", {
                value: z
            });
            else _.raw = z;
            return _
        }, Svq = function(_) {
            if (_ && _.__esModule) return _;
            var z = {};
            if (_ != null) {
                for (var Y in _)
                    if (Object.hasOwnProperty.call(_, Y)) z[Y] = _[Y]
            }
            return z.default = _, z
        }, Cvq = function(_) {
            return _ && _.__esModule ? _ : {
                default: _
            }
        }, bvq = function(_, z) {
            if (!z.has(_)) throw TypeError("attempted to get private field on non-instance");
            return z.get(_)
        }, Ivq = function(_, z, Y) {
            if (!z.has(_)) throw TypeError("attempted to set private field on non-instance");
            return z.set(_, Y), Y
        }, q("__extends", Wvq), q("__assign", Dvq), q("__rest", Zvq), q("__decorate", fvq), q("__param", Gvq), q("__metadata", vvq), q("__awaiter", Tvq), q("__generator", Vvq), q("__exportStar", kvq), q("__createBinding", xvq), q("__values", Gf8), q("__read", hT1), q("__spread", Nvq), q("__spreadArrays", Evq), q("__await", UT6), q("__asyncGenerator", yvq), q("__asyncDelegator", Lvq), q("__asyncValues", hvq), q("__makeTemplateObject", Rvq), q("__importStar", Svq), q("__importDefault", Cvq), q("__classPrivateFieldGet", bvq), q("__classPrivateFieldSet", Ivq)
    })
})
// @from(Ln 111818, Col 4)
Bvq = p((uvq) => {
    Object.defineProperty(uvq, "__esModule", {
        value: !0
    });
    uvq.convertToBuffer = void 0;
    var EQ9 = MT1(),
        yQ9 = typeof Buffer < "u" && Buffer.from ? function(q) {
            return Buffer.from(q, "utf8")
        } : EQ9.fromUtf8;

    function LQ9(q) {
        if (q instanceof Uint8Array) return q;
        if (typeof q === "string") return yQ9(q);
        if (ArrayBuffer.isView(q)) return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return new Uint8Array(q)
    }
    uvq.convertToBuffer = LQ9
})
// @from(Ln 111836, Col 4)
gvq = p((pvq) => {
    Object.defineProperty(pvq, "__esModule", {
        value: !0
    });
    pvq.isEmptyData = void 0;

    function hQ9(q) {
        if (typeof q === "string") return q.length === 0;
        return q.byteLength === 0
    }
    pvq.isEmptyData = hQ9
})
// @from(Ln 111848, Col 4)
dvq = p((Uvq) => {
    Object.defineProperty(Uvq, "__esModule", {
        value: !0
    });
    Uvq.numToUint8 = void 0;

    function RQ9(q) {
        return new Uint8Array([(q & 4278190080) >> 24, (q & 16711680) >> 16, (q & 65280) >> 8, q & 255])
    }
    Uvq.numToUint8 = RQ9
})
// @from(Ln 111859, Col 4)
nvq = p((cvq) => {
    Object.defineProperty(cvq, "__esModule", {
        value: !0
    });
    cvq.uint32ArrayFrom = void 0;

    function SQ9(q) {
        if (!Uint32Array.from) {
            var K = new Uint32Array(q.length),
                _ = 0;
            while (_ < q.length) K[_] = q[_], _ += 1;
            return K
        }
        return Uint32Array.from(q)
    }
    cvq.uint32ArrayFrom = SQ9
})
// @from(Ln 111876, Col 4)
ST1 = p((QT6) => {
    Object.defineProperty(QT6, "__esModule", {
        value: !0
    });
    QT6.uint32ArrayFrom = QT6.numToUint8 = QT6.isEmptyData = QT6.convertToBuffer = void 0;
    var CQ9 = Bvq();
    Object.defineProperty(QT6, "convertToBuffer", {
        enumerable: !0,
        get: function() {
            return CQ9.convertToBuffer
        }
    });
    var bQ9 = gvq();
    Object.defineProperty(QT6, "isEmptyData", {
        enumerable: !0,
        get: function() {
            return bQ9.isEmptyData
        }
    });
    var IQ9 = dvq();
    Object.defineProperty(QT6, "numToUint8", {
        enumerable: !0,
        get: function() {
            return IQ9.numToUint8
        }
    });
    var xQ9 = nvq();
    Object.defineProperty(QT6, "uint32ArrayFrom", {
        enumerable: !0,
        get: function() {
            return xQ9.uint32ArrayFrom
        }
    })
})
// @from(Ln 111910, Col 4)
svq = p((ovq) => {
    Object.defineProperty(ovq, "__esModule", {
        value: !0
    });
    ovq.AwsCrc32 = void 0;
    var ivq = RT1(),
        CT1 = ST1(),
        rvq = Tf8(),
        mQ9 = function() {
            function q() {
                this.crc32 = new rvq.Crc32
            }
            return q.prototype.update = function(K) {
                if ((0, CT1.isEmptyData)(K)) return;
                this.crc32.update((0, CT1.convertToBuffer)(K))
            }, q.prototype.digest = function() {
                return ivq.__awaiter(this, void 0, void 0, function() {
                    return ivq.__generator(this, function(K) {
                        return [2, (0, CT1.numToUint8)(this.crc32.digest())]
                    })
                })
            }, q.prototype.reset = function() {
                this.crc32 = new rvq.Crc32
            }, q
        }();
    ovq.AwsCrc32 = mQ9
})
// @from(Ln 111937, Col 4)
Tf8 = p((bT1) => {
    Object.defineProperty(bT1, "__esModule", {
        value: !0
    });
    bT1.AwsCrc32 = bT1.Crc32 = bT1.crc32 = void 0;
    var BQ9 = RT1(),
        pQ9 = ST1();

    function FQ9(q) {
        return new tvq().update(q).digest()
    }
    bT1.crc32 = FQ9;
    var tvq = function() {
        function q() {
            this.checksum = 4294967295
        }
        return q.prototype.update = function(K) {
            var _, z;
            try {
                for (var Y = BQ9.__values(K), A = Y.next(); !A.done; A = Y.next()) {
                    var O = A.value;
                    this.checksum = this.checksum >>> 8 ^ UQ9[(this.checksum ^ O) & 255]
                }
            } catch (w) {
                _ = {
                    error: w
                }
            } finally {
                try {
                    if (A && !A.done && (z = Y.return)) z.call(Y)
                } finally {
                    if (_) throw _.error
                }
            }
            return this
        }, q.prototype.digest = function() {
            return (this.checksum ^ 4294967295) >>> 0
        }, q
    }();
    bT1.Crc32 = tvq;
    var gQ9 = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
        UQ9 = (0, pQ9.uint32ArrayFrom)(gQ9),
        QQ9 = svq();
    Object.defineProperty(bT1, "AwsCrc32", {
        enumerable: !0,
        get: function() {
            return QQ9.AwsCrc32
        }
    })
})
// @from(Ln 111987, Col 4)
ATq = p((CJO, YTq) => {
    var {
        defineProperty: Vf8,
        getOwnPropertyDescriptor: nQ9,
        getOwnPropertyNames: iQ9
    } = Object, rQ9 = Object.prototype.hasOwnProperty, evq = (q, K) => Vf8(q, "name", {
        value: K,
        configurable: !0
    }), oQ9 = (q, K) => {
        for (var _ in K) Vf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, aQ9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of iQ9(K))
                if (!rQ9.call(q, Y) && Y !== _) Vf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = nQ9(K, Y)) || z.enumerable
                })
        }
        return q
    }, sQ9 = (q) => aQ9(Vf8({}, "__esModule", {
        value: !0
    }), q), qTq = {};
    oQ9(qTq, {
        fromHex: () => _Tq,
        toHex: () => zTq
    });
    YTq.exports = sQ9(qTq);
    var KTq = {},
        IT1 = {};
    for (let q = 0; q < 256; q++) {
        let K = q.toString(16).toLowerCase();
        if (K.length === 1) K = `0${K}`;
        KTq[q] = K, IT1[K] = q
    }

    function _Tq(q) {
        if (q.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let K = new Uint8Array(q.length / 2);
        for (let _ = 0; _ < q.length; _ += 2) {
            let z = q.slice(_, _ + 2).toLowerCase();
            if (z in IT1) K[_ / 2] = IT1[z];
            else throw Error(`Cannot decode unrecognized sequence ${z} as hexadecimal`)
        }
        return K
    }
    evq(_Tq, "fromHex");

    function zTq(q) {
        let K = "";
        for (let _ = 0; _ < q.byteLength; _++) K += KTq[q[_]];
        return K
    }
    evq(zTq, "toHex")
})
// @from(Ln 112044, Col 4)
GTq = p((bJO, fTq) => {
    var {
        defineProperty: Nf8,
        getOwnPropertyDescriptor: tQ9,
        getOwnPropertyNames: eQ9
    } = Object, qd9 = Object.prototype.hasOwnProperty, To = (q, K) => Nf8(q, "name", {
        value: K,
        configurable: !0
    }), Kd9 = (q, K) => {
        for (var _ in K) Nf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, _d9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of eQ9(K))
                if (!qd9.call(q, Y) && Y !== _) Nf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = tQ9(K, Y)) || z.enumerable
                })
        }
        return q
    }, zd9 = (q) => _d9(Nf8({}, "__esModule", {
        value: !0
    }), q), wTq = {};
    Kd9(wTq, {
        EventStreamCodec: () => Dd9,
        HeaderMarshaller: () => HTq,
        Int64: () => kf8,
        MessageDecoderStream: () => Zd9,
        MessageEncoderStream: () => fd9,
        SmithyMessageDecoderStream: () => Gd9,
        SmithyMessageEncoderStream: () => vd9
    });
    fTq.exports = zd9(wTq);
    var Yd9 = Tf8(),
        ww6 = ATq(),
        $Tq = class q {
            constructor(K) {
                if (this.bytes = K, K.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
            }
            static fromNumber(K) {
                if (K > 9223372036854776000 || K < -9223372036854776000) throw Error(`${K} is too large (or, if negative, too small) to represent as an Int64`);
                let _ = new Uint8Array(8);
                for (let z = 7, Y = Math.abs(Math.round(K)); z > -1 && Y > 0; z--, Y /= 256) _[z] = Y;
                if (K < 0) xT1(_);
                return new q(_)
            }
            valueOf() {
                let K = this.bytes.slice(0),
                    _ = K[0] & 128;
                if (_) xT1(K);
                return parseInt((0, ww6.toHex)(K), 16) * (_ ? -1 : 1)
            }
            toString() {
                return String(this.valueOf())
            }
        };
    To($Tq, "Int64");
    var kf8 = $Tq;

    function xT1(q) {
        for (let K = 0; K < 8; K++) q[K] ^= 255;
        for (let K = 7; K > -1; K--)
            if (q[K]++, q[K] !== 0) break
    }
    To(xT1, "negate");
    var jTq = class {
        constructor(K, _) {
            this.toUtf8 = K, this.fromUtf8 = _
        }
        format(K) {
            let _ = [];
            for (let A of Object.keys(K)) {
                let O = this.fromUtf8(A);
                _.push(Uint8Array.from([O.byteLength]), O, this.formatHeaderValue(K[A]))
            }
            let z = new Uint8Array(_.reduce((A, O) => A + O.byteLength, 0)),
                Y = 0;
            for (let A of _) z.set(A, Y), Y += A.byteLength;
            return z
        }
        formatHeaderValue(K) {
            switch (K.type) {
                case "boolean":
                    return Uint8Array.from([K.value ? 0 : 1]);
                case "byte":
                    return Uint8Array.from([2, K.value]);
                case "short":
                    let _ = new DataView(new ArrayBuffer(3));
                    return _.setUint8(0, 3), _.setInt16(1, K.value, !1), new Uint8Array(_.buffer);
                case "integer":
                    let z = new DataView(new ArrayBuffer(5));
                    return z.setUint8(0, 4), z.setInt32(1, K.value, !1), new Uint8Array(z.buffer);
                case "long":
                    let Y = new Uint8Array(9);
                    return Y[0] = 5, Y.set(K.value.bytes, 1), Y;
                case "binary":
                    let A = new DataView(new ArrayBuffer(3 + K.value.byteLength));
                    A.setUint8(0, 6), A.setUint16(1, K.value.byteLength, !1);
                    let O = new Uint8Array(A.buffer);
                    return O.set(K.value, 3), O;
                case "string":
                    let w = this.fromUtf8(K.value),
                        $ = new DataView(new ArrayBuffer(3 + w.byteLength));
                    $.setUint8(0, 7), $.setUint16(1, w.byteLength, !1);
                    let j = new Uint8Array($.buffer);
                    return j.set(w, 3), j;
                case "timestamp":
                    let H = new Uint8Array(9);
                    return H[0] = 8, H.set(kf8.fromNumber(K.value.valueOf()).bytes, 1), H;
                case "uuid":
                    if (!Md9.test(K.value)) throw Error(`Invalid UUID received: ${K.value}`);
                    let J = new Uint8Array(17);
                    return J[0] = 9, J.set((0, ww6.fromHex)(K.value.replace(/\-/g, "")), 1), J
            }
        }
        parse(K) {
            let _ = {},
                z = 0;
            while (z < K.byteLength) {
                let Y = K.getUint8(z++),
                    A = this.toUtf8(new Uint8Array(K.buffer, K.byteOffset + z, Y));
                switch (z += Y, K.getUint8(z++)) {
                    case 0:
                        _[A] = {
                            type: OTq,
                            value: !0
                        };
                        break;
                    case 1:
                        _[A] = {
                            type: OTq,
                            value: !1
                        };
                        break;
                    case 2:
                        _[A] = {
                            type: Ad9,
                            value: K.getInt8(z++)
                        };
                        break;
                    case 3:
                        _[A] = {
                            type: Od9,
                            value: K.getInt16(z, !1)
                        }, z += 2;
                        break;
                    case 4:
                        _[A] = {
                            type: wd9,
                            value: K.getInt32(z, !1)
                        }, z += 4;
                        break;
                    case 5:
                        _[A] = {
                            type: $d9,
                            value: new kf8(new Uint8Array(K.buffer, K.byteOffset + z, 8))
                        }, z += 8;
                        break;
                    case 6:
                        let O = K.getUint16(z, !1);
                        z += 2, _[A] = {
                            type: jd9,
                            value: new Uint8Array(K.buffer, K.byteOffset + z, O)
                        }, z += O;
                        break;
                    case 7:
                        let w = K.getUint16(z, !1);
                        z += 2, _[A] = {
                            type: Hd9,
                            value: this.toUtf8(new Uint8Array(K.buffer, K.byteOffset + z, w))
                        }, z += w;
                        break;
                    case 8:
                        _[A] = {
                            type: Jd9,
                            value: new Date(new kf8(new Uint8Array(K.buffer, K.byteOffset + z, 8)).valueOf())
                        }, z += 8;
                        break;
                    case 9:
                        let $ = new Uint8Array(K.buffer, K.byteOffset + z, 16);
                        z += 16, _[A] = {
                            type: Xd9,
                            value: `${(0,ww6.toHex)($.subarray(0,4))}-${(0,ww6.toHex)($.subarray(4,6))}-${(0,ww6.toHex)($.subarray(6,8))}-${(0,ww6.toHex)($.subarray(8,10))}-${(0,ww6.toHex)($.subarray(10))}`
                        };
                        break;
                    default:
                        throw Error("Unrecognized header type tag")
                }
            }
            return _
        }
    };
    To(jTq, "HeaderMarshaller");
    var HTq = jTq,
        OTq = "boolean",
        Ad9 = "byte",
        Od9 = "short",
        wd9 = "integer",
        $d9 = "long",
        jd9 = "binary",
        Hd9 = "string",
        Jd9 = "timestamp",
        Xd9 = "uuid",
        Md9 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
        Pd9 = Tf8(),
        JTq = 4,
        wq6 = JTq * 2,
        $w6 = 4,
        Wd9 = wq6 + $w6 * 2;

    function XTq({
        byteLength: q,
        byteOffset: K,
        buffer: _
    }) {
        if (q < Wd9) throw Error("Provided message too short to accommodate event stream message overhead");
        let z = new DataView(_, K, q),
            Y = z.getUint32(0, !1);
        if (q !== Y) throw Error("Reported message length does not match received message length");
        let A = z.getUint32(JTq, !1),
            O = z.getUint32(wq6, !1),
            w = z.getUint32(q - $w6, !1),
            $ = new Pd9.Crc32().update(new Uint8Array(_, K, wq6));
        if (O !== $.digest()) throw Error(`The prelude checksum specified in the message (${O}) does not match the calculated CRC32 checksum (${$.digest()})`);
        if ($.update(new Uint8Array(_, K + wq6, q - (wq6 + $w6))), w !== $.digest()) throw Error(`The message checksum (${$.digest()}) did not match the expected value of ${w}`);
        return {
            headers: new DataView(_, K + wq6 + $w6, A),
            body: new Uint8Array(_, K + wq6 + $w6 + A, Y - A - (wq6 + $w6 + $w6))
        }
    }
    To(XTq, "splitMessage");
    var MTq = class {
        constructor(K, _) {
            this.headerMarshaller = new HTq(K, _), this.messageBuffer = [], this.isEndOfStream = !1
        }
        feed(K) {
            this.messageBuffer.push(this.decode(K))
        }
        endOfStream() {
            this.isEndOfStream = !0
        }
        getMessage() {
            let K = this.messageBuffer.pop(),
                _ = this.isEndOfStream;
            return {
                getMessage() {
                    return K
                },
                isEndOfStream() {
                    return _
                }
            }
        }
        getAvailableMessages() {
            let K = this.messageBuffer;
            this.messageBuffer = [];
            let _ = this.isEndOfStream;
            return {
                getMessages() {
                    return K
                },
                isEndOfStream() {
                    return _
                }
            }
        }
        encode({
            headers: K,
            body: _
        }) {
            let z = this.headerMarshaller.format(K),
                Y = z.byteLength + _.byteLength + 16,
                A = new Uint8Array(Y),
                O = new DataView(A.buffer, A.byteOffset, A.byteLength),
                w = new Yd9.Crc32;
            return O.setUint32(0, Y, !1), O.setUint32(4, z.byteLength, !1), O.setUint32(8, w.update(A.subarray(0, 8)).digest(), !1), A.set(z, 12), A.set(_, z.byteLength + 12), O.setUint32(Y - 4, w.update(A.subarray(8, Y - 4)).digest(), !1), A
        }
        decode(K) {
            let {
                headers: _,
                body: z
            } = XTq(K);
            return {
                headers: this.headerMarshaller.parse(_),
                body: z
            }
        }
        formatHeaders(K) {
            return this.headerMarshaller.format(K)
        }
    };
    To(MTq, "EventStreamCodec");
    var Dd9 = MTq,
        PTq = class {
            constructor(K) {
                this.options = K
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let K of this.options.inputStream) yield this.options.decoder.decode(K)
            }
        };
    To(PTq, "MessageDecoderStream");
    var Zd9 = PTq,
        WTq = class {
            constructor(K) {
                this.options = K
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let K of this.options.messageStream) yield this.options.encoder.encode(K);
                if (this.options.includeEndFrame) yield new Uint8Array(0)
            }
        };
    To(WTq, "MessageEncoderStream");
    var fd9 = WTq,
        DTq = class {
            constructor(K) {
                this.options = K
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let K of this.options.messageStream) {
                    let _ = await this.options.deserializer(K);
                    if (_ === void 0) continue;
                    yield _
                }
            }
        };
    To(DTq, "SmithyMessageDecoderStream");
    var Gd9 = DTq,
        ZTq = class {
            constructor(K) {
                this.options = K
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let K of this.options.inputStream) yield this.options.serializer(K)
            }
        };
    To(ZTq, "SmithyMessageEncoderStream");
    var vd9 = ZTq
})
// @from(Ln 112393, Col 4)
yTq = p((IJO, ETq) => {
    var {
        defineProperty: Ef8,
        getOwnPropertyDescriptor: Td9,
        getOwnPropertyNames: Vd9
    } = Object, kd9 = Object.prototype.hasOwnProperty, dT6 = (q, K) => Ef8(q, "name", {
        value: K,
        configurable: !0
    }), Nd9 = (q, K) => {
        for (var _ in K) Ef8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, Ed9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of Vd9(K))
                if (!kd9.call(q, Y) && Y !== _) Ef8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = Td9(K, Y)) || z.enumerable
                })
        }
        return q
    }, yd9 = (q) => Ed9(Ef8({}, "__esModule", {
        value: !0
    }), q), vTq = {};
    Nd9(vTq, {
        EventStreamMarshaller: () => NTq,
        eventStreamSerdeProvider: () => Ld9
    });
    ETq.exports = yd9(vTq);
    var fn6 = GTq();

    function TTq(q) {
        let K = 0,
            _ = 0,
            z = null,
            Y = null,
            A = dT6((w) => {
                if (typeof w !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + w);
                K = w, _ = 4, z = new Uint8Array(w), new DataView(z.buffer).setUint32(0, w, !1)
            }, "allocateMessage"),
            O = dT6(async function*() {
                let w = q[Symbol.asyncIterator]();
                while (!0) {
                    let {
                        value: $,
                        done: j
                    } = await w.next();
                    if (j) {
                        if (!K) return;
                        else if (K === _) yield z;
                        else throw Error("Truncated event message received.");
                        return
                    }
                    let H = $.length,
                        J = 0;
                    while (J < H) {
                        if (!z) {
                            let M = H - J;
                            if (!Y) Y = new Uint8Array(4);
                            let P = Math.min(4 - _, M);
                            if (Y.set($.slice(J, J + P), _), _ += P, J += P, _ < 4) break;
                            A(new DataView(Y.buffer).getUint32(0, !1)), Y = null
                        }
                        let X = Math.min(K - _, H - J);
                        if (z.set($.slice(J, J + X), _), _ += X, J += X, K && K === _) yield z, z = null, K = 0, _ = 0
                    }
                }
            }, "iterator");
        return {
            [Symbol.asyncIterator]: O
        }
    }
    dT6(TTq, "getChunkedStream");

    function VTq(q, K) {
        return async function(_) {
            let {
                value: z
            } = _.headers[":message-type"];
            if (z === "error") {
                let Y = Error(_.headers[":error-message"].value || "UnknownError");
                throw Y.name = _.headers[":error-code"].value, Y
            } else if (z === "exception") {
                let Y = _.headers[":exception-type"].value,
                    A = {
                        [Y]: _
                    },
                    O = await q(A);
                if (O.$unknown) {
                    let w = Error(K(_.body));
                    throw w.name = Y, w
                }
                throw O[Y]
            } else if (z === "event") {
                let Y = {
                        [_.headers[":event-type"].value]: _
                    },
                    A = await q(Y);
                if (A.$unknown) return;
                return A
            } else throw Error(`Unrecognizable event type: ${_.headers[":event-type"].value}`)
        }
    }
    dT6(VTq, "getMessageUnmarshaller");
    var kTq = class {
        constructor({
            utf8Encoder: K,
            utf8Decoder: _
        }) {
            this.eventStreamCodec = new fn6.EventStreamCodec(K, _), this.utfEncoder = K
        }
        deserialize(K, _) {
            let z = TTq(K);
            return new fn6.SmithyMessageDecoderStream({
                messageStream: new fn6.MessageDecoderStream({
                    inputStream: z,
                    decoder: this.eventStreamCodec
                }),
                deserializer: VTq(_, this.utfEncoder)
            })
        }
        serialize(K, _) {
            return new fn6.MessageEncoderStream({
                messageStream: new fn6.SmithyMessageEncoderStream({
                    inputStream: K,
                    serializer: _
                }),
                encoder: this.eventStreamCodec,
                includeEndFrame: !0
            })
        }
    };
    dT6(kTq, "EventStreamMarshaller");
    var NTq = kTq,
        Ld9 = dT6((q) => new NTq(q), "eventStreamSerdeProvider")
})
// @from(Ln 112530, Col 4)
bTq = p((xJO, CTq) => {
    var {
        defineProperty: yf8,
        getOwnPropertyDescriptor: hd9,
        getOwnPropertyNames: Rd9
    } = Object, Sd9 = Object.prototype.hasOwnProperty, uT1 = (q, K) => yf8(q, "name", {
        value: K,
        configurable: !0
    }), Cd9 = (q, K) => {
        for (var _ in K) yf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, bd9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of Rd9(K))
                if (!Sd9.call(q, Y) && Y !== _) yf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = hd9(K, Y)) || z.enumerable
                })
        }
        return q
    }, Id9 = (q) => bd9(yf8({}, "__esModule", {
        value: !0
    }), q), LTq = {};
    Cd9(LTq, {
        EventStreamMarshaller: () => STq,
        eventStreamSerdeProvider: () => md9
    });
    CTq.exports = Id9(LTq);
    var xd9 = yTq(),
        ud9 = d6("stream");
    async function* hTq(q) {
        let K = !1,
            _ = !1,
            z = [];
        q.on("error", (Y) => {
            if (!K) K = !0;
            if (Y) throw Y
        }), q.on("data", (Y) => {
            z.push(Y)
        }), q.on("end", () => {
            K = !0
        });
        while (!_) {
            let Y = await new Promise((A) => setTimeout(() => A(z.shift()), 0));
            if (Y) yield Y;
            _ = K && z.length === 0
        }
    }
    uT1(hTq, "readabletoIterable");
    var RTq = class {
        constructor({
            utf8Encoder: K,
            utf8Decoder: _
        }) {
            this.universalMarshaller = new xd9.EventStreamMarshaller({
                utf8Decoder: _,
                utf8Encoder: K
            })
        }
        deserialize(K, _) {
            let z = typeof K[Symbol.asyncIterator] === "function" ? K : hTq(K);
            return this.universalMarshaller.deserialize(z, _)
        }
        serialize(K, _) {
            return ud9.Readable.from(this.universalMarshaller.serialize(K, _))
        }
    };
    uT1(RTq, "EventStreamMarshaller");
    var STq = RTq,
        md9 = uT1((q) => new STq(q), "eventStreamSerdeProvider")
})
// @from(Ln 112603, Col 4)
uTq = p((ITq) => {
    Object.defineProperty(ITq, "__esModule", {
        value: !0
    });
    ITq.fromBase64 = void 0;
    var Bd9 = dO6(),
        pd9 = /^[A-Za-z0-9+/]*={0,2}$/,
        Fd9 = (q) => {
            if (q.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!pd9.exec(q)) throw TypeError("Invalid base64 string.");
            let K = (0, Bd9.fromString)(q, "base64");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength)
        };
    ITq.fromBase64 = Fd9
})
// @from(Ln 112618, Col 4)
gTq = p((mJO, FTq) => {
    var {
        defineProperty: Lf8,
        getOwnPropertyDescriptor: gd9,
        getOwnPropertyNames: Ud9
    } = Object, Qd9 = Object.prototype.hasOwnProperty, mT1 = (q, K) => Lf8(q, "name", {
        value: K,
        configurable: !0
    }), dd9 = (q, K) => {
        for (var _ in K) Lf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, cd9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of Ud9(K))
                if (!Qd9.call(q, Y) && Y !== _) Lf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = gd9(K, Y)) || z.enumerable
                })
        }
        return q
    }, ld9 = (q) => cd9(Lf8({}, "__esModule", {
        value: !0
    }), q), mTq = {};
    dd9(mTq, {
        fromUtf8: () => pTq,
        toUint8Array: () => nd9,
        toUtf8: () => id9
    });
    FTq.exports = ld9(mTq);
    var BTq = dO6(),
        pTq = mT1((q) => {
            let K = (0, BTq.fromString)(q, "utf8");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        nd9 = mT1((q) => {
            if (typeof q === "string") return pTq(q);
            if (ArrayBuffer.isView(q)) return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(q)
        }, "toUint8Array"),
        id9 = mT1((q) => {
            if (typeof q === "string") return q;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, BTq.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 112665, Col 4)
dTq = p((UTq) => {
    Object.defineProperty(UTq, "__esModule", {
        value: !0
    });
    UTq.toBase64 = void 0;
    var rd9 = dO6(),
        od9 = gTq(),
        ad9 = (q) => {
            let K;
            if (typeof q === "string") K = (0, od9.fromUtf8)(q);
            else K = q;
            if (typeof K !== "object" || typeof K.byteOffset !== "number" || typeof K.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, rd9.fromArrayBuffer)(K.buffer, K.byteOffset, K.byteLength).toString("base64")
        };
    UTq.toBase64 = ad9
})
// @from(Ln 112681, Col 4)
FT1 = p((pJO, hf8) => {
    var {
        defineProperty: cTq,
        getOwnPropertyDescriptor: sd9,
        getOwnPropertyNames: td9
    } = Object, ed9 = Object.prototype.hasOwnProperty, BT1 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of td9(K))
                if (!ed9.call(q, Y) && Y !== _) cTq(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = sd9(K, Y)) || z.enumerable
                })
        }
        return q
    }, lTq = (q, K, _) => (BT1(q, K, "default"), _ && BT1(_, K, "default")), qc9 = (q) => BT1(cTq({}, "__esModule", {
        value: !0
    }), q), pT1 = {};
    hf8.exports = qc9(pT1);
    lTq(pT1, uTq(), hf8.exports);
    lTq(pT1, dTq(), hf8.exports)
})
// @from(Ln 112702, Col 4)
aTq = p((FJO, oTq) => {
    var {
        defineProperty: Rf8,
        getOwnPropertyDescriptor: Kc9,
        getOwnPropertyNames: _c9
    } = Object, zc9 = Object.prototype.hasOwnProperty, db = (q, K) => Rf8(q, "name", {
        value: K,
        configurable: !0
    }), Yc9 = (q, K) => {
        for (var _ in K) Rf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, Ac9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of _c9(K))
                if (!zc9.call(q, Y) && Y !== _) Rf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = Kc9(K, Y)) || z.enumerable
                })
        }
        return q
    }, Oc9 = (q) => Ac9(Rf8({}, "__esModule", {
        value: !0
    }), q), rTq = {};
    Yc9(rTq, {
        constructStack: () => gT1
    });
    oTq.exports = Oc9(rTq);
    var jw6 = db((q, K) => {
            let _ = [];
            if (q) _.push(q);
            if (K)
                for (let z of K) _.push(z);
            return _
        }, "getAllAliases"),
        $q6 = db((q, K) => {
            return `${q||"anonymous"}${K&&K.length>0?` (a.k.a. ${K.join(",")})`:""}`
        }, "getMiddlewareNameWithAliases"),
        gT1 = db(() => {
            let q = [],
                K = [],
                _ = !1,
                z = new Set,
                Y = db((J) => J.sort((X, M) => nTq[M.step] - nTq[X.step] || iTq[M.priority || "normal"] - iTq[X.priority || "normal"]), "sort"),
                A = db((J) => {
                    let X = !1,
                        M = db((P) => {
                            let W = jw6(P.name, P.aliases);
                            if (W.includes(J)) {
                                X = !0;
                                for (let D of W) z.delete(D);
                                return !1
                            }
                            return !0
                        }, "filterCb");
                    return q = q.filter(M), K = K.filter(M), X
                }, "removeByName"),
                O = db((J) => {
                    let X = !1,
                        M = db((P) => {
                            if (P.middleware === J) {
                                X = !0;
                                for (let W of jw6(P.name, P.aliases)) z.delete(W);
                                return !1
                            }
                            return !0
                        }, "filterCb");
                    return q = q.filter(M), K = K.filter(M), X
                }, "removeByReference"),
                w = db((J) => {
                    var X;
                    return q.forEach((M) => {
                        J.add(M.middleware, {
                            ...M
                        })
                    }), K.forEach((M) => {
                        J.addRelativeTo(M.middleware, {
                            ...M
                        })
                    }), (X = J.identifyOnResolve) == null || X.call(J, H.identifyOnResolve()), J
                }, "cloneTo"),
                $ = db((J) => {
                    let X = [];
                    return J.before.forEach((M) => {
                        if (M.before.length === 0 && M.after.length === 0) X.push(M);
                        else X.push(...$(M))
                    }), X.push(J), J.after.reverse().forEach((M) => {
                        if (M.before.length === 0 && M.after.length === 0) X.push(M);
                        else X.push(...$(M))
                    }), X
                }, "expandRelativeMiddlewareList"),
                j = db((J = !1) => {
                    let X = [],
                        M = [],
                        P = {};
                    return q.forEach((D) => {
                        let Z = {
                            ...D,
                            before: [],
                            after: []
                        };
                        for (let G of jw6(Z.name, Z.aliases)) P[G] = Z;
                        X.push(Z)
                    }), K.forEach((D) => {
                        let Z = {
                            ...D,
                            before: [],
                            after: []
                        };
                        for (let G of jw6(Z.name, Z.aliases)) P[G] = Z;
                        M.push(Z)
                    }), M.forEach((D) => {
                        if (D.toMiddleware) {
                            let Z = P[D.toMiddleware];
                            if (Z === void 0) {
                                if (J) return;
                                throw Error(`${D.toMiddleware} is not found when adding ${$q6(D.name,D.aliases)} middleware ${D.relation} ${D.toMiddleware}`)
                            }
                            if (D.relation === "after") Z.after.push(D);
                            if (D.relation === "before") Z.before.push(D)
                        }
                    }), Y(X).map($).reduce((D, Z) => {
                        return D.push(...Z), D
                    }, [])
                }, "getMiddlewareList"),
                H = {
                    add: (J, X = {}) => {
                        let {
                            name: M,
                            override: P,
                            aliases: W
                        } = X, D = {
                            step: "initialize",
                            priority: "normal",
                            middleware: J,
                            ...X
                        }, Z = jw6(M, W);
                        if (Z.length > 0) {
                            if (Z.some((G) => z.has(G))) {
                                if (!P) throw Error(`Duplicate middleware name '${$q6(M,W)}'`);
                                for (let G of Z) {
                                    let f = q.findIndex((V) => {
                                        var k;
                                        return V.name === G || ((k = V.aliases) == null ? void 0 : k.some((N) => N === G))
                                    });
                                    if (f === -1) continue;
                                    let v = q[f];
                                    if (v.step !== D.step || D.priority !== v.priority) throw Error(`"${$q6(v.name,v.aliases)}" middleware with ${v.priority} priority in ${v.step} step cannot be overridden by "${$q6(M,W)}" middleware with ${D.priority} priority in ${D.step} step.`);
                                    q.splice(f, 1)
                                }
                            }
                            for (let G of Z) z.add(G)
                        }
                        q.push(D)
                    },
                    addRelativeTo: (J, X) => {
                        let {
                            name: M,
                            override: P,
                            aliases: W
                        } = X, D = {
                            middleware: J,
                            ...X
                        }, Z = jw6(M, W);
                        if (Z.length > 0) {
                            if (Z.some((G) => z.has(G))) {
                                if (!P) throw Error(`Duplicate middleware name '${$q6(M,W)}'`);
                                for (let G of Z) {
                                    let f = K.findIndex((V) => {
                                        var k;
                                        return V.name === G || ((k = V.aliases) == null ? void 0 : k.some((N) => N === G))
                                    });
                                    if (f === -1) continue;
                                    let v = K[f];
                                    if (v.toMiddleware !== D.toMiddleware || v.relation !== D.relation) throw Error(`"${$q6(v.name,v.aliases)}" middleware ${v.relation} "${v.toMiddleware}" middleware cannot be overridden by "${$q6(M,W)}" middleware ${D.relation} "${D.toMiddleware}" middleware.`);
                                    K.splice(f, 1)
                                }
                            }
                            for (let G of Z) z.add(G)
                        }
                        K.push(D)
                    },
                    clone: () => w(gT1()),
                    use: (J) => {
                        J.applyToStack(H)
                    },
                    remove: (J) => {
                        if (typeof J === "string") return A(J);
                        else return O(J)
                    },
                    removeByTag: (J) => {
                        let X = !1,
                            M = db((P) => {
                                let {
                                    tags: W,
                                    name: D,
                                    aliases: Z
                                } = P;
                                if (W && W.includes(J)) {
                                    let G = jw6(D, Z);
                                    for (let f of G) z.delete(f);
                                    return X = !0, !1
                                }
                                return !0
                            }, "filterCb");
                        return q = q.filter(M), K = K.filter(M), X
                    },
                    concat: (J) => {
                        var X;
                        let M = w(gT1());
                        return M.use(J), M.identifyOnResolve(_ || M.identifyOnResolve() || (((X = J.identifyOnResolve) == null ? void 0 : X.call(J)) ?? !1)), M
                    },
                    applyToStack: w,
                    identify: () => {
                        return j(!0).map((J) => {
                            let X = J.step ?? J.relation + " " + J.toMiddleware;
                            return $q6(J.name, J.aliases) + " - " + X
                        })
                    },
                    identifyOnResolve(J) {
                        if (typeof J === "boolean") _ = J;
                        return _
                    },
                    resolve: (J, X) => {
                        for (let M of j().map((P) => P.middleware).reverse()) J = M(J, X);
                        if (_) console.log(H.identify());
                        return J
                    }
                };
            return H
        }, "constructStack"),
        nTq = {
            initialize: 5,
            serialize: 4,
            build: 3,
            finalizeRequest: 2,
            deserialize: 1
        },
        iTq = {
            high: 3,
            normal: 2,
            low: 1
        }
})
// @from(Ln 112947, Col 4)
KVq = p((gJO, qVq) => {
    var {
        defineProperty: Sf8,
        getOwnPropertyDescriptor: wc9,
        getOwnPropertyNames: $c9
    } = Object, jc9 = Object.prototype.hasOwnProperty, UT1 = (q, K) => Sf8(q, "name", {
        value: K,
        configurable: !0
    }), Hc9 = (q, K) => {
        for (var _ in K) Sf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, Jc9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of $c9(K))
                if (!jc9.call(q, Y) && Y !== _) Sf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = wc9(K, Y)) || z.enumerable
                })
        }
        return q
    }, Xc9 = (q) => Jc9(Sf8({}, "__esModule", {
        value: !0
    }), q), sTq = {};
    Hc9(sTq, {
        fromUtf8: () => eTq,
        toUint8Array: () => Mc9,
        toUtf8: () => Pc9
    });
    qVq.exports = Xc9(sTq);
    var tTq = dO6(),
        eTq = UT1((q) => {
            let K = (0, tTq.fromString)(q, "utf8");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        Mc9 = UT1((q) => {
            if (typeof q === "string") return eTq(q);
            if (ArrayBuffer.isView(q)) return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(q)
        }, "toUint8Array"),
        Pc9 = UT1((q) => {
            if (typeof q === "string") return q;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, tTq.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 112994, Col 4)
YVq = p((_Vq) => {
    Object.defineProperty(_Vq, "__esModule", {
        value: !0
    });
    _Vq.getAwsChunkedEncodingStream = void 0;
    var Wc9 = d6("stream"),
        Dc9 = (q, K) => {
            let {
                base64Encoder: _,
                bodyLengthChecker: z,
                checksumAlgorithmFn: Y,
                checksumLocationName: A,
                streamHasher: O
            } = K, w = _ !== void 0 && Y !== void 0 && A !== void 0 && O !== void 0, $ = w ? O(Y, q) : void 0, j = new Wc9.Readable({
                read: () => {}
            });
            return q.on("data", (H) => {
                let J = z(H) || 0;
                j.push(`${J.toString(16)}\r
`), j.push(H), j.push(`\r
`)
            }), q.on("end", async () => {
                if (j.push(`0\r
`), w) {
                    let H = _(await $);
                    j.push(`${A}:${H}\r
`), j.push(`\r
`)
                }
                j.push(null)
            }), j
        };
    _Vq.getAwsChunkedEncodingStream = Dc9
})
// @from(Ln 113028, Col 4)
$Vq = p((QJO, wVq) => {
    var {
        defineProperty: Cf8,
        getOwnPropertyDescriptor: Zc9,
        getOwnPropertyNames: fc9
    } = Object, Gc9 = Object.prototype.hasOwnProperty, QT1 = (q, K) => Cf8(q, "name", {
        value: K,
        configurable: !0
    }), vc9 = (q, K) => {
        for (var _ in K) Cf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, Tc9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of fc9(K))
                if (!Gc9.call(q, Y) && Y !== _) Cf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = Zc9(K, Y)) || z.enumerable
                })
        }
        return q
    }, Vc9 = (q) => Tc9(Cf8({}, "__esModule", {
        value: !0
    }), q), AVq = {};
    vc9(AVq, {
        escapeUri: () => OVq,
        escapeUriPath: () => Nc9
    });
    wVq.exports = Vc9(AVq);
    var OVq = QT1((q) => encodeURIComponent(q).replace(/[!'()*]/g, kc9), "escapeUri"),
        kc9 = QT1((q) => `%${q.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
        Nc9 = QT1((q) => q.split("/").map(OVq).join("/"), "escapeUriPath")
})
// @from(Ln 113062, Col 4)
XVq = p((dJO, JVq) => {
    var {
        defineProperty: bf8,
        getOwnPropertyDescriptor: Ec9,
        getOwnPropertyNames: yc9
    } = Object, Lc9 = Object.prototype.hasOwnProperty, hc9 = (q, K) => bf8(q, "name", {
        value: K,
        configurable: !0
    }), Rc9 = (q, K) => {
        for (var _ in K) bf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, Sc9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of yc9(K))
                if (!Lc9.call(q, Y) && Y !== _) bf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = Ec9(K, Y)) || z.enumerable
                })
        }
        return q
    }, Cc9 = (q) => Sc9(bf8({}, "__esModule", {
        value: !0
    }), q), jVq = {};
    Rc9(jVq, {
        buildQueryString: () => HVq
    });
    JVq.exports = Cc9(jVq);
    var dT1 = $Vq();

    function HVq(q) {
        let K = [];
        for (let _ of Object.keys(q).sort()) {
            let z = q[_];
            if (_ = (0, dT1.escapeUri)(_), Array.isArray(z))
                for (let Y = 0, A = z.length; Y < A; Y++) K.push(`${_}=${(0,dT1.escapeUri)(z[Y])}`);
            else {
                let Y = _;
                if (z || typeof z === "string") Y += `=${(0,dT1.escapeUri)(z)}`;
                K.push(Y)
            }
        }
        return K.join("&")
    }
    hc9(HVq, "buildQueryString")
})
// @from(Ln 113109, Col 4)
hVq = p((cJO, LVq) => {
    var {
        create: bc9,
        defineProperty: Gn6,
        getOwnPropertyDescriptor: Ic9,
        getOwnPropertyNames: xc9,
        getPrototypeOf: uc9
    } = Object, mc9 = Object.prototype.hasOwnProperty, jD = (q, K) => Gn6(q, "name", {
        value: K,
        configurable: !0
    }), Bc9 = (q, K) => {
        for (var _ in K) Gn6(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, WVq = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of xc9(K))
                if (!mc9.call(q, Y) && Y !== _) Gn6(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = Ic9(K, Y)) || z.enumerable
                })
        }
        return q
    }, pc9 = (q, K, _) => (_ = q != null ? bc9(uc9(q)) : {}, WVq(K || !q || !q.__esModule ? Gn6(_, "default", {
        value: q,
        enumerable: !0
    }) : _, q)), Fc9 = (q) => WVq(Gn6({}, "__esModule", {
        value: !0
    }), q), DVq = {};
    Bc9(DVq, {
        DEFAULT_REQUEST_TIMEOUT: () => cc9,
        NodeHttp2Handler: () => oc9,
        NodeHttpHandler: () => lc9,
        streamCollector: () => sc9
    });
    LVq.exports = Fc9(DVq);
    var ZVq = Wn6(),
        fVq = XVq(),
        cT1 = d6("http"),
        lT1 = d6("https"),
        gc9 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"],
        GVq = jD((q) => {
            let K = {};
            for (let _ of Object.keys(q)) {
                let z = q[_];
                K[_] = Array.isArray(z) ? z.join(",") : z
            }
            return K
        }, "getTransformedHeaders"),
        Uc9 = jD((q, K, _ = 0) => {
            if (!_) return;
            let z = setTimeout(() => {
                q.destroy(), K(Object.assign(Error(`Socket timed out without establishing a connection within ${_} ms`), {
                    name: "TimeoutError"
                }))
            }, _);
            q.on("socket", (Y) => {
                if (Y.connecting) Y.on("connect", () => {
                    clearTimeout(z)
                });
                else clearTimeout(z)
            })
        }, "setConnectionTimeout"),
        Qc9 = jD((q, {
            keepAlive: K,
            keepAliveMsecs: _
        }) => {
            if (K !== !0) return;
            q.on("socket", (z) => {
                z.setKeepAlive(K, _ || 0)
            })
        }, "setSocketKeepAlive"),
        dc9 = jD((q, K, _ = 0) => {
            q.setTimeout(_, () => {
                q.destroy(), K(Object.assign(Error(`Connection timed out after ${_} ms`), {
                    name: "TimeoutError"
                }))
            })
        }, "setSocketTimeout"),
        vVq = d6("stream"),
        MVq = 1000;
    async function nT1(q, K, _ = MVq) {
        let z = K.headers ?? {},
            Y = z.Expect || z.expect,
            A = -1,
            O = !1;
        if (Y === "100-continue") await Promise.race([new Promise((w) => {
            A = Number(setTimeout(w, Math.max(MVq, _)))
        }), new Promise((w) => {
            q.on("continue", () => {
                clearTimeout(A), w()
            }), q.on("error", () => {
                O = !0, clearTimeout(A), w()
            })
        })]);
        if (!O) TVq(q, K.body)
    }
    jD(nT1, "writeRequestBody");

    function TVq(q, K) {
        if (K instanceof vVq.Readable) {
            K.pipe(q);
            return
        }
        if (K) {
            if (Buffer.isBuffer(K) || typeof K === "string") {
                q.end(K);
                return
            }
            let _ = K;
            if (typeof _ === "object" && _.buffer && typeof _.byteOffset === "number" && typeof _.byteLength === "number") {
                q.end(Buffer.from(_.buffer, _.byteOffset, _.byteLength));
                return
            }
            q.end(Buffer.from(K));
            return
        }
        q.end()
    }
    jD(TVq, "writeBody");
    var cc9 = 0,
        VVq = class q {
            constructor(K) {
                this.socketWarningTimestamp = 0, this.metadata = {
                    handlerProtocol: "http/1.1"
                }, this.configProvider = new Promise((_, z) => {
                    if (typeof K === "function") K().then((Y) => {
                        _(this.resolveDefaultConfig(Y))
                    }).catch(z);
                    else _(this.resolveDefaultConfig(K))
                })
            }
            static create(K) {
                if (typeof(K == null ? void 0 : K.handle) === "function") return K;
                return new q(K)
            }
            static checkSocketUsage(K, _) {
                var z, Y;
                let {
                    sockets: A,
                    requests: O,
                    maxSockets: w
                } = K;
                if (typeof w !== "number" || w === 1 / 0) return _;
                let $ = 15000;
                if (Date.now() - $ < _) return _;
                if (A && O)
                    for (let j in A) {
                        let H = ((z = A[j]) == null ? void 0 : z.length) ?? 0,
                            J = ((Y = O[j]) == null ? void 0 : Y.length) ?? 0;
                        if (H >= w && J >= 2 * w) return console.warn("@smithy/node-http-handler:WARN", `socket usage at capacity=${H} and ${J} additional requests are enqueued.`, "See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html", "or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config."), Date.now()
                    }
                return _
            }
            resolveDefaultConfig(K) {
                let {
                    requestTimeout: _,
                    connectionTimeout: z,
                    socketTimeout: Y,
                    httpAgent: A,
                    httpsAgent: O
                } = K || {}, w = !0, $ = 50;
                return {
                    connectionTimeout: z,
                    requestTimeout: _ ?? Y,
                    httpAgent: (() => {
                        if (A instanceof cT1.Agent || typeof(A == null ? void 0 : A.destroy) === "function") return A;
                        return new cT1.Agent({
                            keepAlive: !0,
                            maxSockets: 50,
                            ...A
                        })
                    })(),
                    httpsAgent: (() => {
                        if (O instanceof lT1.Agent || typeof(O == null ? void 0 : O.destroy) === "function") return O;
                        return new lT1.Agent({
                            keepAlive: !0,
                            maxSockets: 50,
                            ...O
                        })
                    })()
                }
            }
            destroy() {
                var K, _, z, Y;
                (_ = (K = this.config) == null ? void 0 : K.httpAgent) == null || _.destroy(), (Y = (z = this.config) == null ? void 0 : z.httpsAgent) == null || Y.destroy()
            }
            async handle(K, {
                abortSignal: _
            } = {}) {
                if (!this.config) this.config = await this.configProvider;
                let z;
                return new Promise((Y, A) => {
                    let O = void 0,
                        w = jD(async (G) => {
                            await O, clearTimeout(z), Y(G)
                        }, "resolve"),
                        $ = jD(async (G) => {
                            await O, A(G)
                        }, "reject");
                    if (!this.config) throw Error("Node HTTP request handler config is not resolved");
                    if (_ == null ? void 0 : _.aborted) {
                        let G = Error("Request aborted");
                        G.name = "AbortError", $(G);
                        return
                    }
                    let j = K.protocol === "https:",
                        H = j ? this.config.httpsAgent : this.config.httpAgent;
                    z = setTimeout(() => {
                        this.socketWarningTimestamp = q.checkSocketUsage(H, this.socketWarningTimestamp)
                    }, this.config.socketAcquisitionWarningTimeout ?? (this.config.requestTimeout ?? 2000) + (this.config.connectionTimeout ?? 1000));
                    let J = (0, fVq.buildQueryString)(K.query || {}),
                        X = void 0;
                    if (K.username != null || K.password != null) {
                        let G = K.username ?? "",
                            f = K.password ?? "";
                        X = `${G}:${f}`
                    }
                    let M = K.path;
                    if (J) M += `?${J}`;
                    if (K.fragment) M += `#${K.fragment}`;
                    let P = {
                            headers: K.headers,
                            host: K.hostname,
                            method: K.method,
                            path: M,
                            port: K.port,
                            agent: H,
                            auth: X
                        },
                        D = (j ? lT1.request : cT1.request)(P, (G) => {
                            let f = new ZVq.HttpResponse({
                                statusCode: G.statusCode || -1,
                                reason: G.statusMessage,
                                headers: GVq(G.headers),
                                body: G
                            });
                            w({
                                response: f
                            })
                        });
                    if (D.on("error", (G) => {
                            if (gc9.includes(G.code)) $(Object.assign(G, {
                                name: "TimeoutError"
                            }));
                            else $(G)
                        }), Uc9(D, $, this.config.connectionTimeout), dc9(D, $, this.config.requestTimeout), _) _.onabort = () => {
                        D.abort();
                        let G = Error("Request aborted");
                        G.name = "AbortError", $(G)
                    };
                    let Z = P.agent;
                    if (typeof Z === "object" && "keepAlive" in Z) Qc9(D, {
                        keepAlive: Z.keepAlive,
                        keepAliveMsecs: Z.keepAliveMsecs
                    });
                    O = nT1(D, K, this.config.requestTimeout).catch(A)
                })
            }
            updateHttpClientConfig(K, _) {
                this.config = void 0, this.configProvider = this.configProvider.then((z) => {
                    return {
                        ...z,
                        [K]: _
                    }
                })
            }
            httpHandlerConfigs() {
                return this.config ?? {}
            }
        };
    jD(VVq, "NodeHttpHandler");
    var lc9 = VVq,
        PVq = d6("http2"),
        nc9 = pc9(d6("http2")),
        kVq = class {
            constructor(K) {
                this.sessions = [], this.sessions = K ?? []
            }
            poll() {
                if (this.sessions.length > 0) return this.sessions.shift()
            }
            offerLast(K) {
                this.sessions.push(K)
            }
            contains(K) {
                return this.sessions.includes(K)
            }
            remove(K) {
                this.sessions = this.sessions.filter((_) => _ !== K)
            } [Symbol.iterator]() {
                return this.sessions[Symbol.iterator]()
            }
            destroy(K) {
                for (let _ of this.sessions)
                    if (_ === K) {
                        if (!_.destroyed) _.destroy()
                    }
            }
        };
    jD(kVq, "NodeHttp2ConnectionPool");
    var ic9 = kVq,
        NVq = class {
            constructor(K) {
                if (this.sessionCache = new Map, this.config = K, this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrency must be greater than zero.")
            }
            lease(K, _) {
                let z = this.getUrlString(K),
                    Y = this.sessionCache.get(z);
                if (Y) {
                    let $ = Y.poll();
                    if ($ && !this.config.disableConcurrency) return $
                }
                let A = nc9.default.connect(z);
                if (this.config.maxConcurrency) A.settings({
                    maxConcurrentStreams: this.config.maxConcurrency
                }, ($) => {
                    if ($) throw Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + K.destination.toString())
                });
                A.unref();
                let O = jD(() => {
                    A.destroy(), this.deleteSession(z, A)
                }, "destroySessionCb");
                if (A.on("goaway", O), A.on("error", O), A.on("frameError", O), A.on("close", () => this.deleteSession(z, A)), _.requestTimeout) A.setTimeout(_.requestTimeout, O);
                let w = this.sessionCache.get(z) || new ic9;
                return w.offerLast(A), this.sessionCache.set(z, w), A
            }
            deleteSession(K, _) {
                let z = this.sessionCache.get(K);
                if (!z) return;
                if (!z.contains(_)) return;
                z.remove(_), this.sessionCache.set(K, z)
            }
            release(K, _) {
                var z;
                let Y = this.getUrlString(K);
                (z = this.sessionCache.get(Y)) == null || z.offerLast(_)
            }
            destroy() {
                for (let [K, _] of this.sessionCache) {
                    for (let z of _) {
                        if (!z.destroyed) z.destroy();
                        _.remove(z)
                    }
                    this.sessionCache.delete(K)
                }
            }
            setMaxConcurrentStreams(K) {
                if (this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrentStreams must be greater than zero.");
                this.config.maxConcurrency = K
            }
            setDisableConcurrentStreams(K) {
                this.config.disableConcurrency = K
            }
            getUrlString(K) {
                return K.destination.toString()
            }
        };
    jD(NVq, "NodeHttp2ConnectionManager");
    var rc9 = NVq,
        EVq = class q {
            constructor(K) {
                this.metadata = {
                    handlerProtocol: "h2"
                }, this.connectionManager = new rc9({}), this.configProvider = new Promise((_, z) => {
                    if (typeof K === "function") K().then((Y) => {
                        _(Y || {})
                    }).catch(z);
                    else _(K || {})
                })
            }
            static create(K) {
                if (typeof(K == null ? void 0 : K.handle) === "function") return K;
                return new q(K)
            }
            destroy() {
                this.connectionManager.destroy()
            }
            async handle(K, {
                abortSignal: _
            } = {}) {
                if (!this.config) {
                    if (this.config = await this.configProvider, this.connectionManager.setDisableConcurrentStreams(this.config.disableConcurrentStreams || !1), this.config.maxConcurrentStreams) this.connectionManager.setMaxConcurrentStreams(this.config.maxConcurrentStreams)
                }
                let {
                    requestTimeout: z,
                    disableConcurrentStreams: Y
                } = this.config;
                return new Promise((A, O) => {
                    var w;
                    let $ = !1,
                        j = void 0,
                        H = jD(async (h) => {
                            await j, A(h)
                        }, "resolve"),
                        J = jD(async (h) => {
                            await j, O(h)
                        }, "reject");
                    if (_ == null ? void 0 : _.aborted) {
                        $ = !0;
                        let h = Error("Request aborted");
                        h.name = "AbortError", J(h);
                        return
                    }
                    let {
                        hostname: X,
                        method: M,
                        port: P,
                        protocol: W,
                        query: D
                    } = K, Z = "";
                    if (K.username != null || K.password != null) {
                        let h = K.username ?? "",
                            C = K.password ?? "";
                        Z = `${h}:${C}@`
                    }
                    let G = `${W}//${Z}${X}${P?`:${P}`:""}`,
                        f = {
                            destination: new URL(G)
                        },
                        v = this.connectionManager.lease(f, {
                            requestTimeout: (w = this.config) == null ? void 0 : w.sessionTimeout,
                            disableConcurrentStreams: Y || !1
                        }),
                        V = jD((h) => {
                            if (Y) this.destroySession(v);
                            $ = !0, J(h)
                        }, "rejectWithDestroy"),
                        k = (0, fVq.buildQueryString)(D || {}),
                        N = K.path;
                    if (k) N += `?${k}`;
                    if (K.fragment) N += `#${K.fragment}`;
                    let R = v.request({
                        ...K.headers,
                        [PVq.constants.HTTP2_HEADER_PATH]: N,
                        [PVq.constants.HTTP2_HEADER_METHOD]: M
                    });
                    if (v.ref(), R.on("response", (h) => {
                            let C = new ZVq.HttpResponse({
                                statusCode: h[":status"] || -1,
                                headers: GVq(h),
                                body: R
                            });
                            if ($ = !0, H({
                                    response: C
                                }), Y) v.close(), this.connectionManager.deleteSession(G, v)
                        }), z) R.setTimeout(z, () => {
                        R.close();
                        let h = Error(`Stream timed out because of no activity for ${z} ms`);
                        h.name = "TimeoutError", V(h)
                    });
                    if (_) _.onabort = () => {
                        R.close();
                        let h = Error("Request aborted");
                        h.name = "AbortError", V(h)
                    };
                    R.on("frameError", (h, C, x) => {
                        V(Error(`Frame type id ${h} in stream id ${x} has failed with code ${C}.`))
                    }), R.on("error", V), R.on("aborted", () => {
                        V(Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${R.rstCode}.`))
                    }), R.on("close", () => {
                        if (v.unref(), Y) v.destroy();
                        if (!$) V(Error("Unexpected error: http2 request did not get a response"))
                    }), j = nT1(R, K, z)
                })
            }
            updateHttpClientConfig(K, _) {
                this.config = void 0, this.configProvider = this.configProvider.then((z) => {
                    return {
                        ...z,
                        [K]: _
                    }
                })
            }
            httpHandlerConfigs() {
                return this.config ?? {}
            }
            destroySession(K) {
                if (!K.destroyed) K.destroy()
            }
        };
    jD(EVq, "NodeHttp2Handler");
    var oc9 = EVq,
        yVq = class extends vVq.Writable {
            constructor() {
                super(...arguments);
                this.bufferedBytes = []
            }
            _write(K, _, z) {
                this.bufferedBytes.push(K), z()
            }
        };
    jD(yVq, "Collector");
    var ac9 = yVq,
        sc9 = jD((q) => new Promise((K, _) => {
            let z = new ac9;
            q.pipe(z), q.on("error", (Y) => {
                z.end(), _(Y)
            }), z.on("error", _), z.on("finish", function() {
                let Y = new Uint8Array(Buffer.concat(this.bufferedBytes));
                K(Y)
            })
        }), "streamCollector")
})
// @from(Ln 113614, Col 4)
bVq = p((SVq) => {
    Object.defineProperty(SVq, "__esModule", {
        value: !0
    });
    SVq.sdkStreamMixin = void 0;
    var tc9 = hVq(),
        ec9 = dO6(),
        iT1 = d6("stream"),
        ql9 = d6("util"),
        RVq = "The stream has already been transformed.",
        Kl9 = (q) => {
            var K, _;
            if (!(q instanceof iT1.Readable)) {
                let A = ((_ = (K = q === null || q === void 0 ? void 0 : q.__proto__) === null || K === void 0 ? void 0 : K.constructor) === null || _ === void 0 ? void 0 : _.name) || q;
                throw Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${A}`)
            }
            let z = !1,
                Y = async () => {
                    if (z) throw Error(RVq);
                    return z = !0, await (0, tc9.streamCollector)(q)
                };
            return Object.assign(q, {
                transformToByteArray: Y,
                transformToString: async (A) => {
                    let O = await Y();
                    if (A === void 0 || Buffer.isEncoding(A)) return (0, ec9.fromArrayBuffer)(O.buffer, O.byteOffset, O.byteLength).toString(A);
                    else return new ql9.TextDecoder(A).decode(O)
                },
                transformToWebStream: () => {
                    if (z) throw Error(RVq);
                    if (q.readableFlowing !== null) throw Error("The stream has been consumed by other callbacks.");
                    if (typeof iT1.Readable.toWeb !== "function") throw Error("Readable.toWeb() is not supported. Please make sure you are using Node.js >= 17.0.0, or polyfill is available.");
                    return z = !0, iT1.Readable.toWeb(q)
                }
            })
        };
    SVq.sdkStreamMixin = Kl9
})
// @from(Ln 113652, Col 4)
FVq = p((nJO, uf8) => {
    var {
        defineProperty: If8,
        getOwnPropertyDescriptor: _l9,
        getOwnPropertyNames: zl9
    } = Object, Yl9 = Object.prototype.hasOwnProperty, aT1 = (q, K) => If8(q, "name", {
        value: K,
        configurable: !0
    }), Al9 = (q, K) => {
        for (var _ in K) If8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, rT1 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of zl9(K))
                if (!Yl9.call(q, Y) && Y !== _) If8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = _l9(K, Y)) || z.enumerable
                })
        }
        return q
    }, IVq = (q, K, _) => (rT1(q, K, "default"), _ && rT1(_, K, "default")), Ol9 = (q) => rT1(If8({}, "__esModule", {
        value: !0
    }), q), xf8 = {};
    Al9(xf8, {
        Uint8ArrayBlobAdapter: () => oT1
    });
    uf8.exports = Ol9(xf8);
    var xVq = FT1(),
        uVq = KVq();

    function mVq(q, K = "utf-8") {
        if (K === "base64") return (0, xVq.toBase64)(q);
        return (0, uVq.toUtf8)(q)
    }
    aT1(mVq, "transformToString");

    function BVq(q, K) {
        if (K === "base64") return oT1.mutate((0, xVq.fromBase64)(q));
        return oT1.mutate((0, uVq.fromUtf8)(q))
    }
    aT1(BVq, "transformFromString");
    var pVq = class q extends Uint8Array {
        static fromString(K, _ = "utf-8") {
            switch (typeof K) {
                case "string":
                    return BVq(K, _);
                default:
                    throw Error(`Unsupported conversion from ${typeof K} to Uint8ArrayBlobAdapter.`)
            }
        }
        static mutate(K) {
            return Object.setPrototypeOf(K, q.prototype), K
        }
        transformToString(K = "utf-8") {
            return mVq(this, K)
        }
    };
    aT1(pVq, "Uint8ArrayBlobAdapter");
    var oT1 = pVq;
    IVq(xf8, YVq(), uf8.exports);
    IVq(xf8, bVq(), uf8.exports)
})