
// @from(Ln 406214, Col 4)
Td8 = x((NrY) => {
    var E16 = dL1(),
        cL1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17, 23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47, 65, 77, 25, 49, 68, 81],
        lL1 = [7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430];
    NrY.getBlocksCount = function(q, K) {
        switch (K) {
            case E16.L:
                return cL1[(q - 1) * 4 + 0];
            case E16.M:
                return cL1[(q - 1) * 4 + 1];
            case E16.Q:
                return cL1[(q - 1) * 4 + 2];
            case E16.H:
                return cL1[(q - 1) * 4 + 3];
            default:
                return
        }
    };
    NrY.getTotalCodewordsCount = function(q, K) {
        switch (K) {
            case E16.L:
                return lL1[(q - 1) * 4 + 0];
            case E16.M:
                return lL1[(q - 1) * 4 + 1];
            case E16.Q:
                return lL1[(q - 1) * 4 + 2];
            case E16.H:
                return lL1[(q - 1) * 4 + 3];
            default:
                return
        }
    }
})
// @from(Ln 406247, Col 4)
kOq = x((ErY) => {
    var un6 = new Uint8Array(512),
        iL1 = new Uint8Array(256);
    (function() {
        let q = 1;
        for (let K = 0; K < 255; K++)
            if (un6[K] = q, iL1[q] = K, q <<= 1, q & 256) q ^= 285;
        for (let K = 255; K < 512; K++) un6[K] = un6[K - 255]
    })();
    ErY.log = function(q) {
        if (q < 1) throw Error("log(" + q + ")");
        return iL1[q]
    };
    ErY.exp = function(q) {
        return un6[q]
    };
    ErY.mul = function(q, K) {
        if (q === 0 || K === 0) return 0;
        return un6[iL1[q] + iL1[K]]
    }
})
// @from(Ln 406268, Col 4)
yOq = x((hrY) => {
    var vd8 = kOq();
    hrY.mul = function(q, K) {
        let Y = new Uint8Array(q.length + K.length - 1);
        for (let z = 0; z < q.length; z++)
            for (let _ = 0; _ < K.length; _++) Y[z + _] ^= vd8.mul(q[z], K[_]);
        return Y
    };
    hrY.mod = function(q, K) {
        let Y = new Uint8Array(q);
        while (Y.length - K.length >= 0) {
            let z = Y[0];
            for (let w = 0; w < K.length; w++) Y[w] ^= vd8.mul(K[w], z);
            let _ = 0;
            while (_ < Y.length && Y[_] === 0) _++;
            Y = Y.slice(_)
        }
        return Y
    };
    hrY.generateECPolynomial = function(q) {
        let K = new Uint8Array([1]);
        for (let Y = 0; Y < q; Y++) K = hrY.mul(K, new Uint8Array([1, vd8.exp(Y)]));
        return K
    }
})
// @from(Ln 406293, Col 4)
hOq = x((uIO, ROq) => {
    var LOq = yOq();

    function Nd8(A) {
        if (this.genPoly = void 0, this.degree = A, this.degree) this.initialize(this.degree)
    }
    Nd8.prototype.initialize = function(q) {
        this.degree = q, this.genPoly = LOq.generateECPolynomial(this.degree)
    };
    Nd8.prototype.encode = function(q) {
        if (!this.genPoly) throw Error("Encoder not initialized");
        let K = new Uint8Array(q.length + this.degree);
        K.set(q);
        let Y = LOq.mod(K, this.genPoly),
            z = this.degree - Y.length;
        if (z > 0) {
            let _ = new Uint8Array(this.degree);
            return _.set(Y, z), _
        }
        return Y
    };
    ROq.exports = Nd8
})
// @from(Ln 406316, Col 4)
Vd8 = x((IrY) => {
    IrY.isValid = function(q) {
        return !isNaN(q) && q >= 1 && q <= 40
    }
})
// @from(Ln 406321, Col 4)
kd8 = x((grY) => {
    var mn6 = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    mn6 = mn6.replace(/u/g, "\\u");
    var xrY = "(?:(?![A-Z0-9 $%*+\\-./:]|" + mn6 + `)(?:.|[\r
]))+`;
    grY.KANJI = new RegExp(mn6, "g");
    grY.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    grY.BYTE = new RegExp(xrY, "g");
    grY.NUMERIC = new RegExp("[0-9]+", "g");
    grY.ALPHANUMERIC = new RegExp("[A-Z $%*+\\-./:]+", "g");
    var urY = new RegExp("^" + mn6 + "$"),
        mrY = new RegExp("^[0-9]+$"),
        BrY = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    grY.testKanji = function(q) {
        return urY.test(q)
    };
    grY.testNumeric = function(q) {
        return mrY.test(q)
    };
    grY.testAlphanumeric = function(q) {
        return BrY.test(q)
    }
})
// @from(Ln 406344, Col 4)
y16 = x((orY) => {
    var nrY = Vd8(),
        Ed8 = kd8();
    orY.NUMERIC = {
        id: "Numeric",
        bit: 1,
        ccBits: [10, 12, 14]
    };
    orY.ALPHANUMERIC = {
        id: "Alphanumeric",
        bit: 2,
        ccBits: [9, 11, 13]
    };
    orY.BYTE = {
        id: "Byte",
        bit: 4,
        ccBits: [8, 16, 16]
    };
    orY.KANJI = {
        id: "Kanji",
        bit: 8,
        ccBits: [8, 10, 12]
    };
    orY.MIXED = {
        bit: -1
    };
    orY.getCharCountIndicator = function(q, K) {
        if (!q.ccBits) throw Error("Invalid mode: " + q);
        if (!nrY.isValid(K)) throw Error("Invalid version: " + K);
        if (K >= 1 && K < 10) return q.ccBits[0];
        else if (K < 27) return q.ccBits[1];
        return q.ccBits[2]
    };
    orY.getBestModeForData = function(q) {
        if (Ed8.testNumeric(q)) return orY.NUMERIC;
        else if (Ed8.testAlphanumeric(q)) return orY.ALPHANUMERIC;
        else if (Ed8.testKanji(q)) return orY.KANJI;
        else return orY.BYTE
    };
    orY.toString = function(q) {
        if (q && q.id) return q.id;
        throw Error("Invalid mode")
    };
    orY.isValid = function(q) {
        return q && q.bit && q.ccBits
    };

    function rrY(A) {
        if (typeof A !== "string") throw Error("Param is not a string");
        switch (A.toLowerCase()) {
            case "numeric":
                return orY.NUMERIC;
            case "alphanumeric":
                return orY.ALPHANUMERIC;
            case "kanji":
                return orY.KANJI;
            case "byte":
                return orY.BYTE;
            default:
                throw Error("Unknown mode: " + A)
        }
    }
    orY.from = function(q, K) {
        if (orY.isValid(q)) return q;
        try {
            return rrY(q)
        } catch (Y) {
            return K
        }
    }
})
// @from(Ln 406415, Col 4)
uOq = x((_oY) => {
    var nL1 = k16(),
        qoY = Td8(),
        COq = dL1(),
        L16 = y16(),
        Sd8 = Vd8(),
        IOq = nL1.getBCHDigit(7973);

    function KoY(A, q, K) {
        for (let Y = 1; Y <= 40; Y++)
            if (q <= _oY.getCapacity(Y, K, A)) return Y;
        return
    }

    function bOq(A, q) {
        return L16.getCharCountIndicator(A, q) + 4
    }

    function YoY(A, q) {
        let K = 0;
        return A.forEach(function(Y) {
            let z = bOq(Y.mode, q);
            K += z + Y.getBitsLength()
        }), K
    }

    function zoY(A, q) {
        for (let K = 1; K <= 40; K++)
            if (YoY(A, K) <= _oY.getCapacity(K, q, L16.MIXED)) return K;
        return
    }
    _oY.from = function(q, K) {
        if (Sd8.isValid(q)) return parseInt(q, 10);
        return K
    };
    _oY.getCapacity = function(q, K, Y) {
        if (!Sd8.isValid(q)) throw Error("Invalid QR Code version");
        if (typeof Y > "u") Y = L16.BYTE;
        let z = nL1.getSymbolTotalCodewords(q),
            _ = qoY.getTotalCodewordsCount(q, K),
            w = (z - _) * 8;
        if (Y === L16.MIXED) return w;
        let O = w - bOq(Y, q);
        switch (Y) {
            case L16.NUMERIC:
                return Math.floor(O / 10 * 3);
            case L16.ALPHANUMERIC:
                return Math.floor(O / 11 * 2);
            case L16.KANJI:
                return Math.floor(O / 13);
            case L16.BYTE:
            default:
                return Math.floor(O / 8)
        }
    };
    _oY.getBestVersionForData = function(q, K) {
        let Y, z = COq.from(K, COq.M);
        if (Array.isArray(q)) {
            if (q.length > 1) return zoY(q, z);
            if (q.length === 0) return 1;
            Y = q[0]
        } else Y = q;
        return KoY(Y.mode, Y.getLength(), z)
    };
    _oY.getEncodedBits = function(q) {
        if (!Sd8.isValid(q) || q < 7) throw Error("Invalid QR Code version");
        let K = q << 12;
        while (nL1.getBCHDigit(K) - IOq >= 0) K ^= 7973 << nL1.getBCHDigit(K) - IOq;
        return q << 12 | K
    }
})
// @from(Ln 406486, Col 4)
BOq = x((HoY) => {
    var Cd8 = k16(),
        mOq = Cd8.getBCHDigit(1335);
    HoY.getEncodedBits = function(q, K) {
        let Y = q.bit << 3 | K,
            z = Y << 10;
        while (Cd8.getBCHDigit(z) - mOq >= 0) z ^= 1335 << Cd8.getBCHDigit(z) - mOq;
        return (Y << 10 | z) ^ 21522
    }
})
// @from(Ln 406496, Col 4)
FOq = x((QIO, gOq) => {
    var JoY = y16();

    function ov6(A) {
        this.mode = JoY.NUMERIC, this.data = A.toString()
    }
    ov6.getBitsLength = function(q) {
        return 10 * Math.floor(q / 3) + (q % 3 ? q % 3 * 3 + 1 : 0)
    };
    ov6.prototype.getLength = function() {
        return this.data.length
    };
    ov6.prototype.getBitsLength = function() {
        return ov6.getBitsLength(this.data.length)
    };
    ov6.prototype.write = function(q) {
        let K, Y, z;
        for (K = 0; K + 3 <= this.data.length; K += 3) Y = this.data.substr(K, 3), z = parseInt(Y, 10), q.put(z, 10);
        let _ = this.data.length - K;
        if (_ > 0) Y = this.data.substr(K), z = parseInt(Y, 10), q.put(z, _ * 3 + 1)
    };
    gOq.exports = ov6
})
// @from(Ln 406519, Col 4)
QOq = x((UIO, pOq) => {
    var MoY = y16(),
        Id8 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":"];

    function av6(A) {
        this.mode = MoY.ALPHANUMERIC, this.data = A
    }
    av6.getBitsLength = function(q) {
        return 11 * Math.floor(q / 2) + 6 * (q % 2)
    };
    av6.prototype.getLength = function() {
        return this.data.length
    };
    av6.prototype.getBitsLength = function() {
        return av6.getBitsLength(this.data.length)
    };
    av6.prototype.write = function(q) {
        let K;
        for (K = 0; K + 2 <= this.data.length; K += 2) {
            let Y = Id8.indexOf(this.data[K]) * 45;
            Y += Id8.indexOf(this.data[K + 1]), q.put(Y, 11)
        }
        if (this.data.length % 2) q.put(Id8.indexOf(this.data[K]), 6)
    };
    pOq.exports = av6
})
// @from(Ln 406545, Col 4)
dOq = x((dIO, UOq) => {
    var DoY = y16();

    function sv6(A) {
        if (this.mode = DoY.BYTE, typeof A === "string") this.data = new TextEncoder().encode(A);
        else this.data = new Uint8Array(A)
    }
    sv6.getBitsLength = function(q) {
        return q * 8
    };
    sv6.prototype.getLength = function() {
        return this.data.length
    };
    sv6.prototype.getBitsLength = function() {
        return sv6.getBitsLength(this.data.length)
    };
    sv6.prototype.write = function(A) {
        for (let q = 0, K = this.data.length; q < K; q++) A.put(this.data[q], 8)
    };
    UOq.exports = sv6
})
// @from(Ln 406566, Col 4)
lOq = x((cIO, cOq) => {
    var XoY = y16(),
        PoY = k16();

    function tv6(A) {
        this.mode = XoY.KANJI, this.data = A
    }
    tv6.getBitsLength = function(q) {
        return q * 13
    };
    tv6.prototype.getLength = function() {
        return this.data.length
    };
    tv6.prototype.getBitsLength = function() {
        return tv6.getBitsLength(this.data.length)
    };
    tv6.prototype.write = function(A) {
        let q;
        for (q = 0; q < this.data.length; q++) {
            let K = PoY.toSJIS(this.data[q]);
            if (K >= 33088 && K <= 40956) K -= 33088;
            else if (K >= 57408 && K <= 60351) K -= 49472;
            else throw Error("Invalid SJIS character: " + this.data[q] + `
Make sure your charset is UTF-8`);
            K = (K >>> 8 & 255) * 192 + (K & 255), A.put(K, 13)
        }
    };
    cOq.exports = tv6
})
// @from(Ln 406595, Col 4)
iOq = x((lIO, bd8) => {
    var Bn6 = {
        single_source_shortest_paths: function(A, q, K) {
            var Y = {},
                z = {};
            z[q] = 0;
            var _ = Bn6.PriorityQueue.make();
            _.push(q, 0);
            var w, O, $, H, j, J, M, D, X;
            while (!_.empty()) {
                w = _.pop(), O = w.value, H = w.cost, j = A[O] || {};
                for ($ in j)
                    if (j.hasOwnProperty($)) {
                        if (J = j[$], M = H + J, D = z[$], X = typeof z[$] > "u", X || D > M) z[$] = M, _.push($, M), Y[$] = O
                    }
            }
            if (typeof K < "u" && typeof z[K] > "u") {
                var P = ["Could not find a path from ", q, " to ", K, "."].join("");
                throw Error(P)
            }
            return Y
        },
        extract_shortest_path_from_predecessor_list: function(A, q) {
            var K = [],
                Y = q,
                z;
            while (Y) K.push(Y), z = A[Y], Y = A[Y];
            return K.reverse(), K
        },
        find_path: function(A, q, K) {
            var Y = Bn6.single_source_shortest_paths(A, q, K);
            return Bn6.extract_shortest_path_from_predecessor_list(Y, K)
        },
        PriorityQueue: {
            make: function(A) {
                var q = Bn6.PriorityQueue,
                    K = {},
                    Y;
                A = A || {};
                for (Y in q)
                    if (q.hasOwnProperty(Y)) K[Y] = q[Y];
                return K.queue = [], K.sorter = A.sorter || q.default_sorter, K
            },
            default_sorter: function(A, q) {
                return A.cost - q.cost
            },
            push: function(A, q) {
                var K = {
                    value: A,
                    cost: q
                };
                this.queue.push(K), this.queue.sort(this.sorter)
            },
            pop: function() {
                return this.queue.shift()
            },
            empty: function() {
                return this.queue.length === 0
            }
        }
    };
    if (typeof bd8 < "u") bd8.exports = Bn6
})
// @from(Ln 406658, Col 4)
A$q = x((ToY) => {
    var f_ = y16(),
        oOq = FOq(),
        aOq = QOq(),
        sOq = dOq(),
        tOq = lOq(),
        gn6 = kd8(),
        rL1 = k16(),
        WoY = iOq();

    function nOq(A) {
        return unescape(encodeURIComponent(A)).length
    }

    function Fn6(A, q, K) {
        let Y = [],
            z;
        while ((z = A.exec(K)) !== null) Y.push({
            data: z[0],
            index: z.index,
            mode: q,
            length: z[0].length
        });
        return Y
    }

    function eOq(A) {
        let q = Fn6(gn6.NUMERIC, f_.NUMERIC, A),
            K = Fn6(gn6.ALPHANUMERIC, f_.ALPHANUMERIC, A),
            Y, z;
        if (rL1.isKanjiModeEnabled()) Y = Fn6(gn6.BYTE, f_.BYTE, A), z = Fn6(gn6.KANJI, f_.KANJI, A);
        else Y = Fn6(gn6.BYTE_KANJI, f_.BYTE, A), z = [];
        return q.concat(K, Y, z).sort(function(w, O) {
            return w.index - O.index
        }).map(function(w) {
            return {
                data: w.data,
                mode: w.mode,
                length: w.length
            }
        })
    }

    function xd8(A, q) {
        switch (q) {
            case f_.NUMERIC:
                return oOq.getBitsLength(A);
            case f_.ALPHANUMERIC:
                return aOq.getBitsLength(A);
            case f_.KANJI:
                return tOq.getBitsLength(A);
            case f_.BYTE:
                return sOq.getBitsLength(A)
        }
    }

    function ZoY(A) {
        return A.reduce(function(q, K) {
            let Y = q.length - 1 >= 0 ? q[q.length - 1] : null;
            if (Y && Y.mode === K.mode) return q[q.length - 1].data += K.data, q;
            return q.push(K), q
        }, [])
    }

    function GoY(A) {
        let q = [];
        for (let K = 0; K < A.length; K++) {
            let Y = A[K];
            switch (Y.mode) {
                case f_.NUMERIC:
                    q.push([Y, {
                        data: Y.data,
                        mode: f_.ALPHANUMERIC,
                        length: Y.length
                    }, {
                        data: Y.data,
                        mode: f_.BYTE,
                        length: Y.length
                    }]);
                    break;
                case f_.ALPHANUMERIC:
                    q.push([Y, {
                        data: Y.data,
                        mode: f_.BYTE,
                        length: Y.length
                    }]);
                    break;
                case f_.KANJI:
                    q.push([Y, {
                        data: Y.data,
                        mode: f_.BYTE,
                        length: nOq(Y.data)
                    }]);
                    break;
                case f_.BYTE:
                    q.push([{
                        data: Y.data,
                        mode: f_.BYTE,
                        length: nOq(Y.data)
                    }])
            }
        }
        return q
    }

    function foY(A, q) {
        let K = {},
            Y = {
                start: {}
            },
            z = ["start"];
        for (let _ = 0; _ < A.length; _++) {
            let w = A[_],
                O = [];
            for (let $ = 0; $ < w.length; $++) {
                let H = w[$],
                    j = "" + _ + $;
                O.push(j), K[j] = {
                    node: H,
                    lastCount: 0
                }, Y[j] = {};
                for (let J = 0; J < z.length; J++) {
                    let M = z[J];
                    if (K[M] && K[M].node.mode === H.mode) Y[M][j] = xd8(K[M].lastCount + H.length, H.mode) - xd8(K[M].lastCount, H.mode), K[M].lastCount += H.length;
                    else {
                        if (K[M]) K[M].lastCount = H.length;
                        Y[M][j] = xd8(H.length, H.mode) + 4 + f_.getCharCountIndicator(H.mode, q)
                    }
                }
            }
            z = O
        }
        for (let _ = 0; _ < z.length; _++) Y[z[_]].end = 0;
        return {
            map: Y,
            table: K
        }
    }

    function rOq(A, q) {
        let K, Y = f_.getBestModeForData(A);
        if (K = f_.from(q, Y), K !== f_.BYTE && K.bit < Y.bit) throw Error('"' + A + '" cannot be encoded with mode ' + f_.toString(K) + `.
 Suggested mode is: ` + f_.toString(Y));
        if (K === f_.KANJI && !rL1.isKanjiModeEnabled()) K = f_.BYTE;
        switch (K) {
            case f_.NUMERIC:
                return new oOq(A);
            case f_.ALPHANUMERIC:
                return new aOq(A);
            case f_.KANJI:
                return new tOq(A);
            case f_.BYTE:
                return new sOq(A)
        }
    }
    ToY.fromArray = function(q) {
        return q.reduce(function(K, Y) {
            if (typeof Y === "string") K.push(rOq(Y, null));
            else if (Y.data) K.push(rOq(Y.data, Y.mode));
            return K
        }, [])
    };
    ToY.fromString = function(q, K) {
        let Y = eOq(q, rL1.isKanjiModeEnabled()),
            z = GoY(Y),
            _ = foY(z, K),
            w = WoY.find_path(_.map, "start", "end"),
            O = [];
        for (let $ = 1; $ < w.length - 1; $++) O.push(_.table[w[$]].node);
        return ToY.fromArray(ZoY(O))
    };
    ToY.rawSplit = function(q) {
        return ToY.fromArray(eOq(q, rL1.isKanjiModeEnabled()))
    }
})
// @from(Ln 406833, Col 4)
Qd8 = x((goY) => {
    var aL1 = k16(),
        md8 = dL1(),
        VoY = MOq(),
        koY = XOq(),
        EoY = WOq(),
        yoY = ZOq(),
        Fd8 = VOq(),
        pd8 = Td8(),
        LoY = hOq(),
        oL1 = uOq(),
        RoY = BOq(),
        hoY = y16(),
        Bd8 = A$q();

    function SoY(A, q) {
        let K = A.size,
            Y = yoY.getPositions(q);
        for (let z = 0; z < Y.length; z++) {
            let _ = Y[z][0],
                w = Y[z][1];
            for (let O = -1; O <= 7; O++) {
                if (_ + O <= -1 || K <= _ + O) continue;
                for (let $ = -1; $ <= 7; $++) {
                    if (w + $ <= -1 || K <= w + $) continue;
                    if (O >= 0 && O <= 6 && ($ === 0 || $ === 6) || $ >= 0 && $ <= 6 && (O === 0 || O === 6) || O >= 2 && O <= 4 && $ >= 2 && $ <= 4) A.set(_ + O, w + $, !0, !0);
                    else A.set(_ + O, w + $, !1, !0)
                }
            }
        }
    }

    function CoY(A) {
        let q = A.size;
        for (let K = 8; K < q - 8; K++) {
            let Y = K % 2 === 0;
            A.set(K, 6, Y, !0), A.set(6, K, Y, !0)
        }
    }

    function IoY(A, q) {
        let K = EoY.getPositions(q);
        for (let Y = 0; Y < K.length; Y++) {
            let z = K[Y][0],
                _ = K[Y][1];
            for (let w = -2; w <= 2; w++)
                for (let O = -2; O <= 2; O++)
                    if (w === -2 || w === 2 || O === -2 || O === 2 || w === 0 && O === 0) A.set(z + w, _ + O, !0, !0);
                    else A.set(z + w, _ + O, !1, !0)
        }
    }

    function boY(A, q) {
        let K = A.size,
            Y = oL1.getEncodedBits(q),
            z, _, w;
        for (let O = 0; O < 18; O++) z = Math.floor(O / 3), _ = O % 3 + K - 8 - 3, w = (Y >> O & 1) === 1, A.set(z, _, w, !0), A.set(_, z, w, !0)
    }

    function gd8(A, q, K) {
        let Y = A.size,
            z = RoY.getEncodedBits(q, K),
            _, w;
        for (_ = 0; _ < 15; _++) {
            if (w = (z >> _ & 1) === 1, _ < 6) A.set(_, 8, w, !0);
            else if (_ < 8) A.set(_ + 1, 8, w, !0);
            else A.set(Y - 15 + _, 8, w, !0);
            if (_ < 8) A.set(8, Y - _ - 1, w, !0);
            else if (_ < 9) A.set(8, 15 - _ - 1 + 1, w, !0);
            else A.set(8, 15 - _ - 1, w, !0)
        }
        A.set(Y - 8, 8, 1, !0)
    }

    function xoY(A, q) {
        let K = A.size,
            Y = -1,
            z = K - 1,
            _ = 7,
            w = 0;
        for (let O = K - 1; O > 0; O -= 2) {
            if (O === 6) O--;
            while (!0) {
                for (let $ = 0; $ < 2; $++)
                    if (!A.isReserved(z, O - $)) {
                        let H = !1;
                        if (w < q.length) H = (q[w] >>> _ & 1) === 1;
                        if (A.set(z, O - $, H), _--, _ === -1) w++, _ = 7
                    } if (z += Y, z < 0 || K <= z) {
                    z -= Y, Y = -Y;
                    break
                }
            }
        }
    }

    function uoY(A, q, K) {
        let Y = new VoY;
        K.forEach(function($) {
            Y.put($.mode.bit, 4), Y.put($.getLength(), hoY.getCharCountIndicator($.mode, A)), $.write(Y)
        });
        let z = aL1.getSymbolTotalCodewords(A),
            _ = pd8.getTotalCodewordsCount(A, q),
            w = (z - _) * 8;
        if (Y.getLengthInBits() + 4 <= w) Y.put(0, 4);
        while (Y.getLengthInBits() % 8 !== 0) Y.putBit(0);
        let O = (w - Y.getLengthInBits()) / 8;
        for (let $ = 0; $ < O; $++) Y.put($ % 2 ? 17 : 236, 8);
        return moY(Y, A, q)
    }

    function moY(A, q, K) {
        let Y = aL1.getSymbolTotalCodewords(q),
            z = pd8.getTotalCodewordsCount(q, K),
            _ = Y - z,
            w = pd8.getBlocksCount(q, K),
            O = Y % w,
            $ = w - O,
            H = Math.floor(Y / w),
            j = Math.floor(_ / w),
            J = j + 1,
            M = H - j,
            D = new LoY(M),
            X = 0,
            P = Array(w),
            W = Array(w),
            Z = 0,
            G = new Uint8Array(A.buffer);
        for (let L = 0; L < w; L++) {
            let h = L < $ ? j : J;
            P[L] = G.slice(X, X + h), W[L] = D.encode(P[L]), X += h, Z = Math.max(Z, h)
        }
        let f = new Uint8Array(Y),
            v = 0,
            N, V;
        for (N = 0; N < Z; N++)
            for (V = 0; V < w; V++)
                if (N < P[V].length) f[v++] = P[V][N];
        for (N = 0; N < M; N++)
            for (V = 0; V < w; V++) f[v++] = W[V][N];
        return f
    }

    function BoY(A, q, K, Y) {
        let z;
        if (Array.isArray(A)) z = Bd8.fromArray(A);
        else if (typeof A === "string") {
            let H = q;
            if (!H) {
                let j = Bd8.rawSplit(A);
                H = oL1.getBestVersionForData(j, K)
            }
            z = Bd8.fromString(A, H || 40)
        } else throw Error("Invalid data");
        let _ = oL1.getBestVersionForData(z, K);
        if (!_) throw Error("The amount of data is too big to be stored in a QR Code");
        if (!q) q = _;
        else if (q < _) throw Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` + _ + `.
`);
        let w = uoY(q, K, z),
            O = aL1.getSymbolSize(q),
            $ = new koY(O);
        if (SoY($, q), CoY($), IoY($, q), gd8($, K, 0), q >= 7) boY($, q);
        if (xoY($, w), isNaN(Y)) Y = Fd8.getBestMask($, gd8.bind(null, $, K));
        return Fd8.applyMask(Y, $), gd8($, K, Y), {
            modules: $,
            version: q,
            errorCorrectionLevel: K,
            maskPattern: Y,
            segments: z
        }
    }
    goY.create = function(q, K) {
        if (typeof q > "u" || q === "") throw Error("No input text");
        let Y = md8.M,
            z, _;
        if (typeof K < "u") {
            if (Y = md8.from(K.errorCorrectionLevel, md8.M), z = oL1.from(K.version), _ = Fd8.from(K.maskPattern), K.toSJISFunc) aL1.setToSJISFunction(K.toSJISFunc)
        }
        return BoY(q, z, Y, _)
    }
})
// @from(Ln 407017, Col 4)
Ud8 = x((rIO, K$q) => {
    var poY = x6("util"),
        q$q = x6("stream"),
        cb = K$q.exports = function() {
            q$q.call(this), this._buffers = [], this._buffered = 0, this._reads = [], this._paused = !1, this._encoding = "utf8", this.writable = !0
        };
    poY.inherits(cb, q$q);
    cb.prototype.read = function(A, q) {
        this._reads.push({
            length: Math.abs(A),
            allowLess: A < 0,
            func: q
        }), process.nextTick(function() {
            if (this._process(), this._paused && this._reads && this._reads.length > 0) this._paused = !1, this.emit("drain")
        }.bind(this))
    };
    cb.prototype.write = function(A, q) {
        if (!this.writable) return this.emit("error", Error("Stream not writable")), !1;
        let K;
        if (Buffer.isBuffer(A)) K = A;
        else K = Buffer.from(A, q || this._encoding);
        if (this._buffers.push(K), this._buffered += K.length, this._process(), this._reads && this._reads.length === 0) this._paused = !0;
        return this.writable && !this._paused
    };
    cb.prototype.end = function(A, q) {
        if (A) this.write(A, q);
        if (this.writable = !1, !this._buffers) return;
        if (this._buffers.length === 0) this._end();
        else this._buffers.push(null), this._process()
    };
    cb.prototype.destroySoon = cb.prototype.end;
    cb.prototype._end = function() {
        if (this._reads.length > 0) this.emit("error", Error("Unexpected end of input"));
        this.destroy()
    };
    cb.prototype.destroy = function() {
        if (!this._buffers) return;
        this.writable = !1, this._reads = null, this._buffers = null, this.emit("close")
    };
    cb.prototype._processReadAllowingLess = function(A) {
        this._reads.shift();
        let q = this._buffers[0];
        if (q.length > A.length) this._buffered -= A.length, this._buffers[0] = q.slice(A.length), A.func.call(this, q.slice(0, A.length));
        else this._buffered -= q.length, this._buffers.shift(), A.func.call(this, q)
    };
    cb.prototype._processRead = function(A) {
        this._reads.shift();
        let q = 0,
            K = 0,
            Y = Buffer.alloc(A.length);
        while (q < A.length) {
            let z = this._buffers[K++],
                _ = Math.min(z.length, A.length - q);
            if (z.copy(Y, q, 0, _), q += _, _ !== z.length) this._buffers[--K] = z.slice(_)
        }
        if (K > 0) this._buffers.splice(0, K);
        this._buffered -= A.length, A.func.call(this, Y)
    };
    cb.prototype._process = function() {
        try {
            while (this._buffered > 0 && this._reads && this._reads.length > 0) {
                let A = this._reads[0];
                if (A.allowLess) this._processReadAllowingLess(A);
                else if (this._buffered >= A.length) this._processRead(A);
                else break
            }
            if (this._buffers && !this.writable) this._end()
        } catch (A) {
            this.emit("error", A)
        }
    }
})
// @from(Ln 407089, Col 4)
dd8 = x((QoY) => {
    var R16 = [{
        x: [0],
        y: [0]
    }, {
        x: [4],
        y: [0]
    }, {
        x: [0, 4],
        y: [4]
    }, {
        x: [2, 6],
        y: [0, 4]
    }, {
        x: [0, 2, 4, 6],
        y: [2, 6]
    }, {
        x: [1, 3, 5, 7],
        y: [0, 2, 4, 6]
    }, {
        x: [0, 1, 2, 3, 4, 5, 6, 7],
        y: [1, 3, 5, 7]
    }];
    QoY.getImagePasses = function(A, q) {
        let K = [],
            Y = A % 8,
            z = q % 8,
            _ = (A - Y) / 8,
            w = (q - z) / 8;
        for (let O = 0; O < R16.length; O++) {
            let $ = R16[O],
                H = _ * $.x.length,
                j = w * $.y.length;
            for (let J = 0; J < $.x.length; J++)
                if ($.x[J] < Y) H++;
                else break;
            for (let J = 0; J < $.y.length; J++)
                if ($.y[J] < z) j++;
                else break;
            if (H > 0 && j > 0) K.push({
                width: H,
                height: j,
                index: O
            })
        }
        return K
    };
    QoY.getInterlaceIterator = function(A) {
        return function(q, K, Y) {
            let z = q % R16[Y].x.length,
                _ = (q - z) / R16[Y].x.length * 8 + R16[Y].x[z],
                w = K % R16[Y].y.length,
                O = (K - w) / R16[Y].y.length * 8 + R16[Y].y[w];
            return _ * 4 + O * A * 4
        }
    }
})
// @from(Ln 407146, Col 4)
cd8 = x((aIO, Y$q) => {
    Y$q.exports = function(q, K, Y) {
        let z = q + K - Y,
            _ = Math.abs(z - q),
            w = Math.abs(z - K),
            O = Math.abs(z - Y);
        if (_ <= w && _ <= O) return q;
        if (w <= O) return K;
        return Y
    }
})
// @from(Ln 407157, Col 4)
ld8 = x((sIO, _$q) => {
    var coY = dd8(),
        loY = cd8();

    function z$q(A, q, K) {
        let Y = A * q;
        if (K !== 8) Y = Math.ceil(Y / (8 / K));
        return Y
    }
    var ev6 = _$q.exports = function(A, q) {
        let {
            width: K,
            height: Y,
            interlace: z,
            bpp: _,
            depth: w
        } = A;
        if (this.read = q.read, this.write = q.write, this.complete = q.complete, this._imageIndex = 0, this._images = [], z) {
            let O = coY.getImagePasses(K, Y);
            for (let $ = 0; $ < O.length; $++) this._images.push({
                byteWidth: z$q(O[$].width, _, w),
                height: O[$].height,
                lineIndex: 0
            })
        } else this._images.push({
            byteWidth: z$q(K, _, w),
            height: Y,
            lineIndex: 0
        });
        if (w === 8) this._xComparison = _;
        else if (w === 16) this._xComparison = _ * 2;
        else this._xComparison = 1
    };
    ev6.prototype.start = function() {
        this.read(this._images[this._imageIndex].byteWidth + 1, this._reverseFilterLine.bind(this))
    };
    ev6.prototype._unFilterType1 = function(A, q, K) {
        let Y = this._xComparison,
            z = Y - 1;
        for (let _ = 0; _ < K; _++) {
            let w = A[1 + _],
                O = _ > z ? q[_ - Y] : 0;
            q[_] = w + O
        }
    };
    ev6.prototype._unFilterType2 = function(A, q, K) {
        let Y = this._lastLine;
        for (let z = 0; z < K; z++) {
            let _ = A[1 + z],
                w = Y ? Y[z] : 0;
            q[z] = _ + w
        }
    };
    ev6.prototype._unFilterType3 = function(A, q, K) {
        let Y = this._xComparison,
            z = Y - 1,
            _ = this._lastLine;
        for (let w = 0; w < K; w++) {
            let O = A[1 + w],
                $ = _ ? _[w] : 0,
                H = w > z ? q[w - Y] : 0,
                j = Math.floor((H + $) / 2);
            q[w] = O + j
        }
    };
    ev6.prototype._unFilterType4 = function(A, q, K) {
        let Y = this._xComparison,
            z = Y - 1,
            _ = this._lastLine;
        for (let w = 0; w < K; w++) {
            let O = A[1 + w],
                $ = _ ? _[w] : 0,
                H = w > z ? q[w - Y] : 0,
                j = w > z && _ ? _[w - Y] : 0,
                J = loY(H, $, j);
            q[w] = O + J
        }
    };
    ev6.prototype._reverseFilterLine = function(A) {
        let q = A[0],
            K, Y = this._images[this._imageIndex],
            z = Y.byteWidth;
        if (q === 0) K = A.slice(1, z + 1);
        else switch (K = Buffer.alloc(z), q) {
            case 1:
                this._unFilterType1(A, K, z);
                break;
            case 2:
                this._unFilterType2(A, K, z);
                break;
            case 3:
                this._unFilterType3(A, K, z);
                break;
            case 4:
                this._unFilterType4(A, K, z);
                break;
            default:
                throw Error("Unrecognised filter type - " + q)
        }
        if (this.write(K), Y.lineIndex++, Y.lineIndex >= Y.height) this._lastLine = null, this._imageIndex++, Y = this._images[this._imageIndex];
        else this._lastLine = K;
        if (Y) this.read(Y.byteWidth + 1, this._reverseFilterLine.bind(this));
        else this._lastLine = null, this.complete()
    }
})
// @from(Ln 407262, Col 4)
$$q = x((tIO, O$q) => {
    var ioY = x6("util"),
        w$q = Ud8(),
        noY = ld8(),
        roY = O$q.exports = function(A) {
            w$q.call(this);
            let q = [],
                K = this;
            this._filter = new noY(A, {
                read: this.read.bind(this),
                write: function(Y) {
                    q.push(Y)
                },
                complete: function() {
                    K.emit("complete", Buffer.concat(q))
                }
            }), this._filter.start()
        };
    ioY.inherits(roY, w$q)
})
// @from(Ln 407282, Col 4)
AN6 = x((eIO, H$q) => {
    H$q.exports = {
        PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
        TYPE_IHDR: 1229472850,
        TYPE_IEND: 1229278788,
        TYPE_IDAT: 1229209940,
        TYPE_PLTE: 1347179589,
        TYPE_tRNS: 1951551059,
        TYPE_gAMA: 1732332865,
        COLORTYPE_GRAYSCALE: 0,
        COLORTYPE_PALETTE: 1,
        COLORTYPE_COLOR: 2,
        COLORTYPE_ALPHA: 4,
        COLORTYPE_PALETTE_COLOR: 3,
        COLORTYPE_COLOR_ALPHA: 6,
        COLORTYPE_TO_BPP_MAP: {
            0: 1,
            2: 3,
            3: 1,
            4: 2,
            6: 4
        },
        GAMMA_DIVISION: 1e5
    }
})
// @from(Ln 407307, Col 4)
rd8 = x((AbO, j$q) => {
    var id8 = [];
    (function() {
        for (let A = 0; A < 256; A++) {
            let q = A;
            for (let K = 0; K < 8; K++)
                if (q & 1) q = 3988292384 ^ q >>> 1;
                else q = q >>> 1;
            id8[A] = q
        }
    })();
    var nd8 = j$q.exports = function() {
        this._crc = -1
    };
    nd8.prototype.write = function(A) {
        for (let q = 0; q < A.length; q++) this._crc = id8[(this._crc ^ A[q]) & 255] ^ this._crc >>> 8;
        return !0
    };
    nd8.prototype.crc32 = function() {
        return this._crc ^ -1
    };
    nd8.crc32 = function(A) {
        let q = -1;
        for (let K = 0; K < A.length; K++) q = id8[(q ^ A[K]) & 255] ^ q >>> 8;
        return q ^ -1
    }
})
// @from(Ln 407334, Col 4)
od8 = x((qbO, J$q) => {
    var MD = AN6(),
        ooY = rd8(),
        lX = J$q.exports = function(A, q) {
            this._options = A, A.checkCRC = A.checkCRC !== !1, this._hasIHDR = !1, this._hasIEND = !1, this._emittedHeadersFinished = !1, this._palette = [], this._colorType = 0, this._chunks = {}, this._chunks[MD.TYPE_IHDR] = this._handleIHDR.bind(this), this._chunks[MD.TYPE_IEND] = this._handleIEND.bind(this), this._chunks[MD.TYPE_IDAT] = this._handleIDAT.bind(this), this._chunks[MD.TYPE_PLTE] = this._handlePLTE.bind(this), this._chunks[MD.TYPE_tRNS] = this._handleTRNS.bind(this), this._chunks[MD.TYPE_gAMA] = this._handleGAMA.bind(this), this.read = q.read, this.error = q.error, this.metadata = q.metadata, this.gamma = q.gamma, this.transColor = q.transColor, this.palette = q.palette, this.parsed = q.parsed, this.inflateData = q.inflateData, this.finished = q.finished, this.simpleTransparency = q.simpleTransparency, this.headersFinished = q.headersFinished || function() {}
        };
    lX.prototype.start = function() {
        this.read(MD.PNG_SIGNATURE.length, this._parseSignature.bind(this))
    };
    lX.prototype._parseSignature = function(A) {
        let q = MD.PNG_SIGNATURE;
        for (let K = 0; K < q.length; K++)
            if (A[K] !== q[K]) {
                this.error(Error("Invalid file signature"));
                return
            } this.read(8, this._parseChunkBegin.bind(this))
    };
    lX.prototype._parseChunkBegin = function(A) {
        let q = A.readUInt32BE(0),
            K = A.readUInt32BE(4),
            Y = "";
        for (let _ = 4; _ < 8; _++) Y += String.fromCharCode(A[_]);
        let z = Boolean(A[4] & 32);
        if (!this._hasIHDR && K !== MD.TYPE_IHDR) {
            this.error(Error("Expected IHDR on beggining"));
            return
        }
        if (this._crc = new ooY, this._crc.write(Buffer.from(Y)), this._chunks[K]) return this._chunks[K](q);
        if (!z) {
            this.error(Error("Unsupported critical chunk type " + Y));
            return
        }
        this.read(q + 4, this._skipChunk.bind(this))
    };
    lX.prototype._skipChunk = function() {
        this.read(8, this._parseChunkBegin.bind(this))
    };
    lX.prototype._handleChunkEnd = function() {
        this.read(4, this._parseChunkEnd.bind(this))
    };
    lX.prototype._parseChunkEnd = function(A) {
        let q = A.readInt32BE(0),
            K = this._crc.crc32();
        if (this._options.checkCRC && K !== q) {
            this.error(Error("Crc error - " + q + " - " + K));
            return
        }
        if (!this._hasIEND) this.read(8, this._parseChunkBegin.bind(this))
    };
    lX.prototype._handleIHDR = function(A) {
        this.read(A, this._parseIHDR.bind(this))
    };
    lX.prototype._parseIHDR = function(A) {
        this._crc.write(A);
        let q = A.readUInt32BE(0),
            K = A.readUInt32BE(4),
            Y = A[8],
            z = A[9],
            _ = A[10],
            w = A[11],
            O = A[12];
        if (Y !== 8 && Y !== 4 && Y !== 2 && Y !== 1 && Y !== 16) {
            this.error(Error("Unsupported bit depth " + Y));
            return
        }
        if (!(z in MD.COLORTYPE_TO_BPP_MAP)) {
            this.error(Error("Unsupported color type"));
            return
        }
        if (_ !== 0) {
            this.error(Error("Unsupported compression method"));
            return
        }
        if (w !== 0) {
            this.error(Error("Unsupported filter method"));
            return
        }
        if (O !== 0 && O !== 1) {
            this.error(Error("Unsupported interlace method"));
            return
        }
        this._colorType = z;
        let $ = MD.COLORTYPE_TO_BPP_MAP[this._colorType];
        this._hasIHDR = !0, this.metadata({
            width: q,
            height: K,
            depth: Y,
            interlace: Boolean(O),
            palette: Boolean(z & MD.COLORTYPE_PALETTE),
            color: Boolean(z & MD.COLORTYPE_COLOR),
            alpha: Boolean(z & MD.COLORTYPE_ALPHA),
            bpp: $,
            colorType: z
        }), this._handleChunkEnd()
    };
    lX.prototype._handlePLTE = function(A) {
        this.read(A, this._parsePLTE.bind(this))
    };
    lX.prototype._parsePLTE = function(A) {
        this._crc.write(A);
        let q = Math.floor(A.length / 3);
        for (let K = 0; K < q; K++) this._palette.push([A[K * 3], A[K * 3 + 1], A[K * 3 + 2], 255]);
        this.palette(this._palette), this._handleChunkEnd()
    };
    lX.prototype._handleTRNS = function(A) {
        this.simpleTransparency(), this.read(A, this._parseTRNS.bind(this))
    };
    lX.prototype._parseTRNS = function(A) {
        if (this._crc.write(A), this._colorType === MD.COLORTYPE_PALETTE_COLOR) {
            if (this._palette.length === 0) {
                this.error(Error("Transparency chunk must be after palette"));
                return
            }
            if (A.length > this._palette.length) {
                this.error(Error("More transparent colors than palette size"));
                return
            }
            for (let q = 0; q < A.length; q++) this._palette[q][3] = A[q];
            this.palette(this._palette)
        }
        if (this._colorType === MD.COLORTYPE_GRAYSCALE) this.transColor([A.readUInt16BE(0)]);
        if (this._colorType === MD.COLORTYPE_COLOR) this.transColor([A.readUInt16BE(0), A.readUInt16BE(2), A.readUInt16BE(4)]);
        this._handleChunkEnd()
    };
    lX.prototype._handleGAMA = function(A) {
        this.read(A, this._parseGAMA.bind(this))
    };
    lX.prototype._parseGAMA = function(A) {
        this._crc.write(A), this.gamma(A.readUInt32BE(0) / MD.GAMMA_DIVISION), this._handleChunkEnd()
    };
    lX.prototype._handleIDAT = function(A) {
        if (!this._emittedHeadersFinished) this._emittedHeadersFinished = !0, this.headersFinished();
        this.read(-A, this._parseIDAT.bind(this, A))
    };
    lX.prototype._parseIDAT = function(A, q) {
        if (this._crc.write(q), this._colorType === MD.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) throw Error("Expected palette not found");
        this.inflateData(q);
        let K = A - q.length;
        if (K > 0) this._handleIDAT(K);
        else this._handleChunkEnd()
    };
    lX.prototype._handleIEND = function(A) {
        this.read(A, this._parseIEND.bind(this))
    };
    lX.prototype._parseIEND = function(A) {
        if (this._crc.write(A), this._hasIEND = !0, this._handleChunkEnd(), this.finished) this.finished()
    }
})
// @from(Ln 407482, Col 4)
ad8 = x((qaY) => {
    var M$q = dd8(),
        aoY = [function() {}, function(A, q, K, Y) {
            if (Y === q.length) throw Error("Ran out of data");
            let z = q[Y];
            A[K] = z, A[K + 1] = z, A[K + 2] = z, A[K + 3] = 255
        }, function(A, q, K, Y) {
            if (Y + 1 >= q.length) throw Error("Ran out of data");
            let z = q[Y];
            A[K] = z, A[K + 1] = z, A[K + 2] = z, A[K + 3] = q[Y + 1]
        }, function(A, q, K, Y) {
            if (Y + 2 >= q.length) throw Error("Ran out of data");
            A[K] = q[Y], A[K + 1] = q[Y + 1], A[K + 2] = q[Y + 2], A[K + 3] = 255
        }, function(A, q, K, Y) {
            if (Y + 3 >= q.length) throw Error("Ran out of data");
            A[K] = q[Y], A[K + 1] = q[Y + 1], A[K + 2] = q[Y + 2], A[K + 3] = q[Y + 3]
        }],
        soY = [function() {}, function(A, q, K, Y) {
            let z = q[0];
            A[K] = z, A[K + 1] = z, A[K + 2] = z, A[K + 3] = Y
        }, function(A, q, K) {
            let Y = q[0];
            A[K] = Y, A[K + 1] = Y, A[K + 2] = Y, A[K + 3] = q[1]
        }, function(A, q, K, Y) {
            A[K] = q[0], A[K + 1] = q[1], A[K + 2] = q[2], A[K + 3] = Y
        }, function(A, q, K) {
            A[K] = q[0], A[K + 1] = q[1], A[K + 2] = q[2], A[K + 3] = q[3]
        }];

    function toY(A, q) {
        let K = [],
            Y = 0;

        function z() {
            if (Y === A.length) throw Error("Ran out of data");
            let _ = A[Y];
            Y++;
            let w, O, $, H, j, J, M, D;
            switch (q) {
                default:
                    throw Error("unrecognised depth");
                case 16:
                    M = A[Y], Y++, K.push((_ << 8) + M);
                    break;
                case 4:
                    M = _ & 15, D = _ >> 4, K.push(D, M);
                    break;
                case 2:
                    j = _ & 3, J = _ >> 2 & 3, M = _ >> 4 & 3, D = _ >> 6 & 3, K.push(D, M, J, j);
                    break;
                case 1:
                    w = _ & 1, O = _ >> 1 & 1, $ = _ >> 2 & 1, H = _ >> 3 & 1, j = _ >> 4 & 1, J = _ >> 5 & 1, M = _ >> 6 & 1, D = _ >> 7 & 1, K.push(D, M, J, j, H, $, O, w);
                    break
            }
        }
        return {
            get: function(_) {
                while (K.length < _) z();
                let w = K.slice(0, _);
                return K = K.slice(_), w
            },
            resetAfterLine: function() {
                K.length = 0
            },
            end: function() {
                if (Y !== A.length) throw Error("extra data found")
            }
        }
    }

    function eoY(A, q, K, Y, z, _) {
        let {
            width: w,
            height: O,
            index: $
        } = A;
        for (let H = 0; H < O; H++)
            for (let j = 0; j < w; j++) {
                let J = K(j, H, $);
                aoY[Y](q, z, J, _), _ += Y
            }
        return _
    }

    function AaY(A, q, K, Y, z, _) {
        let {
            width: w,
            height: O,
            index: $
        } = A;
        for (let H = 0; H < O; H++) {
            for (let j = 0; j < w; j++) {
                let J = z.get(Y),
                    M = K(j, H, $);
                soY[Y](q, J, M, _)
            }
            z.resetAfterLine()
        }
    }
    qaY.dataToBitMap = function(A, q) {
        let {
            width: K,
            height: Y,
            depth: z,
            bpp: _,
            interlace: w
        } = q, O;
        if (z !== 8) O = toY(A, z);
        let $;
        if (z <= 8) $ = Buffer.alloc(K * Y * 4);
        else $ = new Uint16Array(K * Y * 4);
        let H = Math.pow(2, z) - 1,
            j = 0,
            J, M;
        if (w) J = M$q.getImagePasses(K, Y), M = M$q.getInterlaceIterator(K, Y);
        else {
            let D = 0;
            M = function() {
                let X = D;
                return D += 4, X
            }, J = [{
                width: K,
                height: Y
            }]
        }
        for (let D = 0; D < J.length; D++)
            if (z === 8) j = eoY(J[D], $, M, _, A, j);
            else AaY(J[D], $, M, _, O, H);
        if (z === 8) {
            if (j !== A.length) throw Error("extra data found")
        } else O.end();
        return $
    }
})
// @from(Ln 407616, Col 4)
sd8 = x((YbO, D$q) => {
    function YaY(A, q, K, Y, z) {
        let _ = 0;
        for (let w = 0; w < Y; w++)
            for (let O = 0; O < K; O++) {
                let $ = z[A[_]];
                if (!$) throw Error("index " + A[_] + " not in palette");
                for (let H = 0; H < 4; H++) q[_ + H] = $[H];
                _ += 4
            }
    }

    function zaY(A, q, K, Y, z) {
        let _ = 0;
        for (let w = 0; w < Y; w++)
            for (let O = 0; O < K; O++) {
                let $ = !1;
                if (z.length === 1) {
                    if (z[0] === A[_]) $ = !0
                } else if (z[0] === A[_] && z[1] === A[_ + 1] && z[2] === A[_ + 2]) $ = !0;
                if ($)
                    for (let H = 0; H < 4; H++) q[_ + H] = 0;
                _ += 4
            }
    }

    function _aY(A, q, K, Y, z) {
        let _ = 255,
            w = Math.pow(2, z) - 1,
            O = 0;
        for (let $ = 0; $ < Y; $++)
            for (let H = 0; H < K; H++) {
                for (let j = 0; j < 4; j++) q[O + j] = Math.floor(A[O + j] * _ / w + 0.5);
                O += 4
            }
    }
    D$q.exports = function(A, q) {
        let {
            depth: K,
            width: Y,
            height: z,
            colorType: _,
            transColor: w,
            palette: O
        } = q, $ = A;
        if (_ === 3) YaY(A, $, Y, z, O);
        else {
            if (w) zaY(A, $, Y, z, w);
            if (K !== 8) {
                if (K === 16) $ = Buffer.alloc(Y * z * 4);
                _aY(A, $, Y, z, K)
            }
        }
        return $
    }
})
// @from(Ln 407672, Col 4)
W$q = x((zbO, P$q) => {
    var waY = x6("util"),
        td8 = x6("zlib"),
        X$q = Ud8(),
        OaY = $$q(),
        $aY = od8(),
        HaY = ad8(),
        jaY = sd8(),
        ZF = P$q.exports = function(A) {
            X$q.call(this), this._parser = new $aY(A, {
                read: this.read.bind(this),
                error: this._handleError.bind(this),
                metadata: this._handleMetaData.bind(this),
                gamma: this.emit.bind(this, "gamma"),
                palette: this._handlePalette.bind(this),
                transColor: this._handleTransColor.bind(this),
                finished: this._finished.bind(this),
                inflateData: this._inflateData.bind(this),
                simpleTransparency: this._simpleTransparency.bind(this),
                headersFinished: this._headersFinished.bind(this)
            }), this._options = A, this.writable = !0, this._parser.start()
        };
    waY.inherits(ZF, X$q);
    ZF.prototype._handleError = function(A) {
        if (this.emit("error", A), this.writable = !1, this.destroy(), this._inflate && this._inflate.destroy) this._inflate.destroy();
        if (this._filter) this._filter.destroy(), this._filter.on("error", function() {});
        this.errord = !0
    };
    ZF.prototype._inflateData = function(A) {
        if (!this._inflate)
            if (this._bitmapInfo.interlace) this._inflate = td8.createInflate(), this._inflate.on("error", this.emit.bind(this, "error")), this._filter.on("complete", this._complete.bind(this)), this._inflate.pipe(this._filter);
            else {
                let K = ((this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1) * this._bitmapInfo.height,
                    Y = Math.max(K, td8.Z_MIN_CHUNK);
                this._inflate = td8.createInflate({
                    chunkSize: Y
                });
                let z = K,
                    _ = this.emit.bind(this, "error");
                this._inflate.on("error", function(O) {
                    if (!z) return;
                    _(O)
                }), this._filter.on("complete", this._complete.bind(this));
                let w = this._filter.write.bind(this._filter);
                this._inflate.on("data", function(O) {
                    if (!z) return;
                    if (O.length > z) O = O.slice(0, z);
                    z -= O.length, w(O)
                }), this._inflate.on("end", this._filter.end.bind(this._filter))
            } this._inflate.write(A)
    };
    ZF.prototype._handleMetaData = function(A) {
        this._metaData = A, this._bitmapInfo = Object.create(A), this._filter = new OaY(this._bitmapInfo)
    };
    ZF.prototype._handleTransColor = function(A) {
        this._bitmapInfo.transColor = A
    };
    ZF.prototype._handlePalette = function(A) {
        this._bitmapInfo.palette = A
    };
    ZF.prototype._simpleTransparency = function() {
        this._metaData.alpha = !0
    };
    ZF.prototype._headersFinished = function() {
        this.emit("metadata", this._metaData)
    };
    ZF.prototype._finished = function() {
        if (this.errord) return;
        if (!this._inflate) this.emit("error", "No Inflate block");
        else this._inflate.end()
    };
    ZF.prototype._complete = function(A) {
        if (this.errord) return;
        let q;
        try {
            let K = HaY.dataToBitMap(A, this._bitmapInfo);
            q = jaY(K, this._bitmapInfo), K = null
        } catch (K) {
            this._handleError(K);
            return
        }
        this.emit("parsed", q)
    }
})
// @from(Ln 407756, Col 4)
G$q = x((_bO, Z$q) => {
    var yh = AN6();
    Z$q.exports = function(A, q, K, Y) {
        let z = [yh.COLORTYPE_COLOR_ALPHA, yh.COLORTYPE_ALPHA].indexOf(Y.colorType) !== -1;
        if (Y.colorType === Y.inputColorType) {
            let X = function() {
                let P = new ArrayBuffer(2);
                return new DataView(P).setInt16(0, 256, !0), new Int16Array(P)[0] !== 256
            }();
            if (Y.bitDepth === 8 || Y.bitDepth === 16 && X) return A
        }
        let _ = Y.bitDepth !== 16 ? A : new Uint16Array(A.buffer),
            w = 255,
            O = yh.COLORTYPE_TO_BPP_MAP[Y.inputColorType];
        if (O === 4 && !Y.inputHasAlpha) O = 3;
        let $ = yh.COLORTYPE_TO_BPP_MAP[Y.colorType];
        if (Y.bitDepth === 16) w = 65535, $ *= 2;
        let H = Buffer.alloc(q * K * $),
            j = 0,
            J = 0,
            M = Y.bgColor || {};
        if (M.red === void 0) M.red = w;
        if (M.green === void 0) M.green = w;
        if (M.blue === void 0) M.blue = w;

        function D() {
            let X, P, W, Z = w;
            switch (Y.inputColorType) {
                case yh.COLORTYPE_COLOR_ALPHA:
                    Z = _[j + 3], X = _[j], P = _[j + 1], W = _[j + 2];
                    break;
                case yh.COLORTYPE_COLOR:
                    X = _[j], P = _[j + 1], W = _[j + 2];
                    break;
                case yh.COLORTYPE_ALPHA:
                    Z = _[j + 1], X = _[j], P = X, W = X;
                    break;
                case yh.COLORTYPE_GRAYSCALE:
                    X = _[j], P = X, W = X;
                    break;
                default:
                    throw Error("input color type:" + Y.inputColorType + " is not supported at present")
            }
            if (Y.inputHasAlpha) {
                if (!z) Z /= w, X = Math.min(Math.max(Math.round((1 - Z) * M.red + Z * X), 0), w), P = Math.min(Math.max(Math.round((1 - Z) * M.green + Z * P), 0), w), W = Math.min(Math.max(Math.round((1 - Z) * M.blue + Z * W), 0), w)
            }
            return {
                red: X,
                green: P,
                blue: W,
                alpha: Z
            }
        }
        for (let X = 0; X < K; X++)
            for (let P = 0; P < q; P++) {
                let W = D(_, j);
                switch (Y.colorType) {
                    case yh.COLORTYPE_COLOR_ALPHA:
                    case yh.COLORTYPE_COLOR:
                        if (Y.bitDepth === 8) {
                            if (H[J] = W.red, H[J + 1] = W.green, H[J + 2] = W.blue, z) H[J + 3] = W.alpha
                        } else if (H.writeUInt16BE(W.red, J), H.writeUInt16BE(W.green, J + 2), H.writeUInt16BE(W.blue, J + 4), z) H.writeUInt16BE(W.alpha, J + 6);
                        break;
                    case yh.COLORTYPE_ALPHA:
                    case yh.COLORTYPE_GRAYSCALE: {
                        let Z = (W.red + W.green + W.blue) / 3;
                        if (Y.bitDepth === 8) {
                            if (H[J] = Z, z) H[J + 1] = W.alpha
                        } else if (H.writeUInt16BE(Z, J), z) H.writeUInt16BE(W.alpha, J + 2);
                        break
                    }
                    default:
                        throw Error("unrecognised color Type " + Y.colorType)
                }
                j += O, J += $
            }
        return H
    }
})
// @from(Ln 407835, Col 4)
v$q = x((wbO, T$q) => {
    var f$q = cd8();

    function JaY(A, q, K, Y, z) {
        for (let _ = 0; _ < K; _++) Y[z + _] = A[q + _]
    }

    function MaY(A, q, K) {
        let Y = 0,
            z = q + K;
        for (let _ = q; _ < z; _++) Y += Math.abs(A[_]);
        return Y
    }

    function DaY(A, q, K, Y, z, _) {
        for (let w = 0; w < K; w++) {
            let O = w >= _ ? A[q + w - _] : 0,
                $ = A[q + w] - O;
            Y[z + w] = $
        }
    }

    function XaY(A, q, K, Y) {
        let z = 0;
        for (let _ = 0; _ < K; _++) {
            let w = _ >= Y ? A[q + _ - Y] : 0,
                O = A[q + _] - w;
            z += Math.abs(O)
        }
        return z
    }

    function PaY(A, q, K, Y, z) {
        for (let _ = 0; _ < K; _++) {
            let w = q > 0 ? A[q + _ - K] : 0,
                O = A[q + _] - w;
            Y[z + _] = O
        }
    }

    function WaY(A, q, K) {
        let Y = 0,
            z = q + K;
        for (let _ = q; _ < z; _++) {
            let w = q > 0 ? A[_ - K] : 0,
                O = A[_] - w;
            Y += Math.abs(O)
        }
        return Y
    }

    function ZaY(A, q, K, Y, z, _) {
        for (let w = 0; w < K; w++) {
            let O = w >= _ ? A[q + w - _] : 0,
                $ = q > 0 ? A[q + w - K] : 0,
                H = A[q + w] - (O + $ >> 1);
            Y[z + w] = H
        }
    }

    function GaY(A, q, K, Y) {
        let z = 0;
        for (let _ = 0; _ < K; _++) {
            let w = _ >= Y ? A[q + _ - Y] : 0,
                O = q > 0 ? A[q + _ - K] : 0,
                $ = A[q + _] - (w + O >> 1);
            z += Math.abs($)
        }
        return z
    }

    function faY(A, q, K, Y, z, _) {
        for (let w = 0; w < K; w++) {
            let O = w >= _ ? A[q + w - _] : 0,
                $ = q > 0 ? A[q + w - K] : 0,
                H = q > 0 && w >= _ ? A[q + w - (K + _)] : 0,
                j = A[q + w] - f$q(O, $, H);
            Y[z + w] = j
        }
    }

    function TaY(A, q, K, Y) {
        let z = 0;
        for (let _ = 0; _ < K; _++) {
            let w = _ >= Y ? A[q + _ - Y] : 0,
                O = q > 0 ? A[q + _ - K] : 0,
                $ = q > 0 && _ >= Y ? A[q + _ - (K + Y)] : 0,
                H = A[q + _] - f$q(w, O, $);
            z += Math.abs(H)
        }
        return z
    }
    var vaY = {
            0: JaY,
            1: DaY,
            2: PaY,
            3: ZaY,
            4: faY
        },
        NaY = {
            0: MaY,
            1: XaY,
            2: WaY,
            3: GaY,
            4: TaY
        };
    T$q.exports = function(A, q, K, Y, z) {
        let _;
        if (!("filterType" in Y) || Y.filterType === -1) _ = [0, 1, 2, 3, 4];
        else if (typeof Y.filterType === "number") _ = [Y.filterType];
        else throw Error("unrecognised filter types");
        if (Y.bitDepth === 16) z *= 2;
        let w = q * z,
            O = 0,
            $ = 0,
            H = Buffer.alloc((w + 1) * K),
            j = _[0];
        for (let J = 0; J < K; J++) {
            if (_.length > 1) {
                let M = 1 / 0;
                for (let D = 0; D < _.length; D++) {
                    let X = NaY[_[D]](A, $, w, z);
                    if (X < M) j = _[D], M = X
                }
            }
            H[O] = j, O++, vaY[j](A, $, w, H, O, z), O += w, $ += w
        }
        return H
    }
})
// @from(Ln 407965, Col 4)
ed8 = x((ObO, N$q) => {
    var QZ = AN6(),
        VaY = rd8(),
        kaY = G$q(),
        EaY = v$q(),
        yaY = x6("zlib"),
        h16 = N$q.exports = function(A) {
            if (this._options = A, A.deflateChunkSize = A.deflateChunkSize || 32768, A.deflateLevel = A.deflateLevel != null ? A.deflateLevel : 9, A.deflateStrategy = A.deflateStrategy != null ? A.deflateStrategy : 3, A.inputHasAlpha = A.inputHasAlpha != null ? A.inputHasAlpha : !0, A.deflateFactory = A.deflateFactory || yaY.createDeflate, A.bitDepth = A.bitDepth || 8, A.colorType = typeof A.colorType === "number" ? A.colorType : QZ.COLORTYPE_COLOR_ALPHA, A.inputColorType = typeof A.inputColorType === "number" ? A.inputColorType : QZ.COLORTYPE_COLOR_ALPHA, [QZ.COLORTYPE_GRAYSCALE, QZ.COLORTYPE_COLOR, QZ.COLORTYPE_COLOR_ALPHA, QZ.COLORTYPE_ALPHA].indexOf(A.colorType) === -1) throw Error("option color type:" + A.colorType + " is not supported at present");
            if ([QZ.COLORTYPE_GRAYSCALE, QZ.COLORTYPE_COLOR, QZ.COLORTYPE_COLOR_ALPHA, QZ.COLORTYPE_ALPHA].indexOf(A.inputColorType) === -1) throw Error("option input color type:" + A.inputColorType + " is not supported at present");
            if (A.bitDepth !== 8 && A.bitDepth !== 16) throw Error("option bit depth:" + A.bitDepth + " is not supported at present")
        };
    h16.prototype.getDeflateOptions = function() {
        return {
            chunkSize: this._options.deflateChunkSize,
            level: this._options.deflateLevel,
            strategy: this._options.deflateStrategy
        }
    };
    h16.prototype.createDeflate = function() {
        return this._options.deflateFactory(this.getDeflateOptions())
    };
    h16.prototype.filterData = function(A, q, K) {
        let Y = kaY(A, q, K, this._options),
            z = QZ.COLORTYPE_TO_BPP_MAP[this._options.colorType];
        return EaY(Y, q, K, this._options, z)
    };
    h16.prototype._packChunk = function(A, q) {
        let K = q ? q.length : 0,
            Y = Buffer.alloc(K + 12);
        if (Y.writeUInt32BE(K, 0), Y.writeUInt32BE(A, 4), q) q.copy(Y, 8);
        return Y.writeInt32BE(VaY.crc32(Y.slice(4, Y.length - 4)), Y.length - 4), Y
    };
    h16.prototype.packGAMA = function(A) {
        let q = Buffer.alloc(4);
        return q.writeUInt32BE(Math.floor(A * QZ.GAMMA_DIVISION), 0), this._packChunk(QZ.TYPE_gAMA, q)
    };
    h16.prototype.packIHDR = function(A, q) {
        let K = Buffer.alloc(13);
        return K.writeUInt32BE(A, 0), K.writeUInt32BE(q, 4), K[8] = this._options.bitDepth, K[9] = this._options.colorType, K[10] = 0, K[11] = 0, K[12] = 0, this._packChunk(QZ.TYPE_IHDR, K)
    };
    h16.prototype.packIDAT = function(A) {
        return this._packChunk(QZ.TYPE_IDAT, A)
    };
    h16.prototype.packIEND = function() {
        return this._packChunk(QZ.TYPE_IEND, null)
    }
})
// @from(Ln 408012, Col 4)
y$q = x(($bO, E$q) => {
    var LaY = x6("util"),
        V$q = x6("stream"),
        RaY = AN6(),
        haY = ed8(),
        k$q = E$q.exports = function(A) {
            V$q.call(this);
            let q = A || {};
            this._packer = new haY(q), this._deflate = this._packer.createDeflate(), this.readable = !0
        };
    LaY.inherits(k$q, V$q);
    k$q.prototype.pack = function(A, q, K, Y) {
        if (this.emit("data", Buffer.from(RaY.PNG_SIGNATURE)), this.emit("data", this._packer.packIHDR(q, K)), Y) this.emit("data", this._packer.packGAMA(Y));
        let z = this._packer.filterData(A, q, K);
        this._deflate.on("error", this.emit.bind(this, "error")), this._deflate.on("data", function(_) {
            this.emit("data", this._packer.packIDAT(_))
        }.bind(this)), this._deflate.on("end", function() {
            this.emit("data", this._packer.packIEND()), this.emit("end")
        }.bind(this)), this._deflate.end(z)
    }
})
// @from(Ln 408033, Col 4)
I$q = x((pn6, C$q) => {
    var L$q = x6("assert").ok,
        qN6 = x6("zlib"),
        SaY = x6("util"),
        R$q = x6("buffer").kMaxLength;

    function D_6(A) {
        if (!(this instanceof D_6)) return new D_6(A);
        if (A && A.chunkSize < qN6.Z_MIN_CHUNK) A.chunkSize = qN6.Z_MIN_CHUNK;
        if (qN6.Inflate.call(this, A), this._offset = this._offset === void 0 ? this._outOffset : this._offset, this._buffer = this._buffer || this._outBuffer, A && A.maxLength != null) this._maxLength = A.maxLength
    }

    function CaY(A) {
        return new D_6(A)
    }

    function h$q(A, q) {
        if (q) process.nextTick(q);
        if (!A._handle) return;
        A._handle.close(), A._handle = null
    }
    D_6.prototype._processChunk = function(A, q, K) {
        if (typeof K === "function") return qN6.Inflate._processChunk.call(this, A, q, K);
        let Y = this,
            z = A && A.length,
            _ = this._chunkSize - this._offset,
            w = this._maxLength,
            O = 0,
            $ = [],
            H = 0,
            j;
        this.on("error", function(X) {
            j = X
        });

        function J(X, P) {
            if (Y._hadError) return;
            let W = _ - P;
            if (L$q(W >= 0, "have should not go down"), W > 0) {
                let Z = Y._buffer.slice(Y._offset, Y._offset + W);
                if (Y._offset += W, Z.length > w) Z = Z.slice(0, w);
                if ($.push(Z), H += Z.length, w -= Z.length, w === 0) return !1
            }
            if (P === 0 || Y._offset >= Y._chunkSize) _ = Y._chunkSize, Y._offset = 0, Y._buffer = Buffer.allocUnsafe(Y._chunkSize);
            if (P === 0) return O += z - X, z = X, !0;
            return !1
        }
        L$q(this._handle, "zlib binding closed");
        let M;
        do M = this._handle.writeSync(q, A, O, z, this._buffer, this._offset, _), M = M || this._writeState; while (!this._hadError && J(M[0], M[1]));
        if (this._hadError) throw j;
        if (H >= R$q) throw h$q(this), RangeError("Cannot create final Buffer. It would be larger than 0x" + R$q.toString(16) + " bytes");
        let D = Buffer.concat($, H);
        return h$q(this), D
    };
    SaY.inherits(D_6, qN6.Inflate);

    function IaY(A, q) {
        if (typeof q === "string") q = Buffer.from(q);
        if (!(q instanceof Buffer)) throw TypeError("Not a string or buffer");
        let K = A._finishFlushFlag;
        if (K == null) K = qN6.Z_FINISH;
        return A._processChunk(q, K)
    }

    function S$q(A, q) {
        return IaY(new D_6(q), A)
    }
    C$q.exports = pn6 = S$q;
    pn6.Inflate = D_6;
    pn6.createInflate = CaY;
    pn6.inflateSync = S$q
})
// @from(Ln 408106, Col 4)
Ac8 = x((HbO, x$q) => {
    var b$q = x$q.exports = function(A) {
        this._buffer = A, this._reads = []
    };
    b$q.prototype.read = function(A, q) {
        this._reads.push({
            length: Math.abs(A),
            allowLess: A < 0,
            func: q
        })
    };
    b$q.prototype.process = function() {
        while (this._reads.length > 0 && this._buffer.length) {
            let A = this._reads[0];
            if (this._buffer.length && (this._buffer.length >= A.length || A.allowLess)) {
                this._reads.shift();
                let q = this._buffer;
                this._buffer = q.slice(A.length), A.func.call(this, q.slice(0, A.length))
            } else break
        }
        if (this._reads.length > 0) return Error("There are some read requests waitng on finished stream");
        if (this._buffer.length > 0) return Error("unrecognised content at end of stream")
    }
})
// @from(Ln 408130, Col 4)
u$q = x((uaY) => {
    var baY = Ac8(),
        xaY = ld8();
    uaY.process = function(A, q) {
        let K = [],
            Y = new baY(A);
        return new xaY(q, {
            read: Y.read.bind(Y),
            write: function(_) {
                K.push(_)
            },
            complete: function() {}
        }).start(), Y.process(), Buffer.concat(K)
    }
})
// @from(Ln 408145, Col 4)
F$q = x((JbO, g$q) => {
    var m$q = !0,
        B$q = x6("zlib"),
        BaY = I$q();
    if (!B$q.deflateSync) m$q = !1;
    var gaY = Ac8(),
        FaY = u$q(),
        paY = od8(),
        QaY = ad8(),
        UaY = sd8();
    g$q.exports = function(A, q) {
        if (!m$q) throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
        let K;

        function Y(v) {
            K = v
        }
        let z;

        function _(v) {
            z = v
        }

        function w(v) {
            z.transColor = v
        }

        function O(v) {
            z.palette = v
        }

        function $() {
            z.alpha = !0
        }
        let H;

        function j(v) {
            H = v
        }
        let J = [];

        function M(v) {
            J.push(v)
        }
        let D = new gaY(A);
        if (new paY(q, {
                read: D.read.bind(D),
                error: Y,
                metadata: _,
                gamma: j,
                palette: O,
                transColor: w,
                inflateData: M,
                simpleTransparency: $
            }).start(), D.process(), K) throw K;
        let P = Buffer.concat(J);
        J.length = 0;
        let W;
        if (z.interlace) W = B$q.inflateSync(P);
        else {
            let N = ((z.width * z.bpp * z.depth + 7 >> 3) + 1) * z.height;
            W = BaY(P, {
                chunkSize: N,
                maxLength: N
            })
        }
        if (P = null, !W || !W.length) throw Error("bad png - invalid inflate data response");
        let Z = FaY.process(W, z);
        P = null;
        let G = QaY.dataToBitMap(Z, z);
        Z = null;
        let f = UaY(G, z);
        return z.data = f, z.gamma = H || 0, z
    }
})
// @from(Ln 408220, Col 4)
d$q = x((MbO, U$q) => {
    var p$q = !0,
        Q$q = x6("zlib");
    if (!Q$q.deflateSync) p$q = !1;
    var daY = AN6(),
        caY = ed8();
    U$q.exports = function(A, q) {
        if (!p$q) throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
        let Y = new caY(q || {}),
            z = [];
        if (z.push(Buffer.from(daY.PNG_SIGNATURE)), z.push(Y.packIHDR(A.width, A.height)), A.gamma) z.push(Y.packGAMA(A.gamma));
        let _ = Y.filterData(A.data, A.width, A.height),
            w = Q$q.deflateSync(_, Y.getDeflateOptions());
        if (_ = null, !w || !w.length) throw Error("bad png - invalid compressed data response");
        return z.push(Y.packIDAT(w)), z.push(Y.packIEND()), Buffer.concat(z)
    }
})
// @from(Ln 408237, Col 4)
c$q = x((naY) => {
    var laY = F$q(),
        iaY = d$q();
    naY.read = function(A, q) {
        return laY(A, q || {})
    };
    naY.write = function(A, q) {
        return iaY(A, q)
    }
})
// @from(Ln 408247, Col 4)
i$q = x((AsY) => {
    var aaY = x6("util"),
        l$q = x6("stream"),
        saY = W$q(),
        taY = y$q(),
        eaY = c$q(),
        Uf = AsY.PNG = function(A) {
            if (l$q.call(this), A = A || {}, this.width = A.width | 0, this.height = A.height | 0, this.data = this.width > 0 && this.height > 0 ? Buffer.alloc(4 * this.width * this.height) : null, A.fill && this.data) this.data.fill(0);
            this.gamma = 0, this.readable = this.writable = !0, this._parser = new saY(A), this._parser.on("error", this.emit.bind(this, "error")), this._parser.on("close", this._handleClose.bind(this)), this._parser.on("metadata", this._metadata.bind(this)), this._parser.on("gamma", this._gamma.bind(this)), this._parser.on("parsed", function(q) {
                this.data = q, this.emit("parsed", q)
            }.bind(this)), this._packer = new taY(A), this._packer.on("data", this.emit.bind(this, "data")), this._packer.on("end", this.emit.bind(this, "end")), this._parser.on("close", this._handleClose.bind(this)), this._packer.on("error", this.emit.bind(this, "error"))
        };
    aaY.inherits(Uf, l$q);
    Uf.sync = eaY;
    Uf.prototype.pack = function() {
        if (!this.data || !this.data.length) return this.emit("error", "No data provided"), this;
        return process.nextTick(function() {
            this._packer.pack(this.data, this.width, this.height, this.gamma)
        }.bind(this)), this
    };
    Uf.prototype.parse = function(A, q) {
        if (q) {
            let K, Y;
            K = function(z) {
                this.removeListener("error", Y), this.data = z, q(null, this)
            }.bind(this), Y = function(z) {
                this.removeListener("parsed", K), q(z, null)
            }.bind(this), this.once("parsed", K), this.once("error", Y)
        }
        return this.end(A), this
    };
    Uf.prototype.write = function(A) {
        return this._parser.write(A), !0
    };
    Uf.prototype.end = function(A) {
        this._parser.end(A)
    };
    Uf.prototype._metadata = function(A) {
        this.width = A.width, this.height = A.height, this.emit("metadata", A)
    };
    Uf.prototype._gamma = function(A) {
        this.gamma = A
    };
    Uf.prototype._handleClose = function() {
        if (!this._parser.writable && !this._packer.readable) this.emit("close")
    };
    Uf.bitblt = function(A, q, K, Y, z, _, w, O) {
        if (K |= 0, Y |= 0, z |= 0, _ |= 0, w |= 0, O |= 0, K > A.width || Y > A.height || K + z > A.width || Y + _ > A.height) throw Error("bitblt reading outside image");
        if (w > q.width || O > q.height || w + z > q.width || O + _ > q.height) throw Error("bitblt writing outside image");
        for (let $ = 0; $ < _; $++) A.data.copy(q.data, (O + $) * q.width + w << 2, (Y + $) * A.width + K << 2, (Y + $) * A.width + K + z << 2)
    };
    Uf.prototype.bitblt = function(A, q, K, Y, z, _, w) {
        return Uf.bitblt(this, A, q, K, Y, z, _, w), this
    };
    Uf.adjustGamma = function(A) {
        if (A.gamma) {
            for (let q = 0; q < A.height; q++)
                for (let K = 0; K < A.width; K++) {
                    let Y = A.width * q + K << 2;
                    for (let z = 0; z < 3; z++) {
                        let _ = A.data[Y + z] / 255;
                        _ = Math.pow(_, 0.45454545454545453 / A.gamma), A.data[Y + z] = Math.round(_ * 255)
                    }
                }
            A.gamma = 0
        }
    };
    Uf.prototype.adjustGamma = function() {
        Uf.adjustGamma(this)
    }
})
// @from(Ln 408318, Col 4)
Qn6 = x((qsY) => {
    function n$q(A) {
        if (typeof A === "number") A = A.toString();
        if (typeof A !== "string") throw Error("Color should be defined as hex string");
        let q = A.slice().replace("#", "").split("");
        if (q.length < 3 || q.length === 5 || q.length > 8) throw Error("Invalid hex color: " + A);
        if (q.length === 3 || q.length === 4) q = Array.prototype.concat.apply([], q.map(function(Y) {
            return [Y, Y]
        }));
        if (q.length === 6) q.push("F", "F");
        let K = parseInt(q.join(""), 16);
        return {
            r: K >> 24 & 255,
            g: K >> 16 & 255,
            b: K >> 8 & 255,
            a: K & 255,
            hex: "#" + q.slice(0, 6).join("")
        }
    }
    qsY.getOptions = function(q) {
        if (!q) q = {};
        if (!q.color) q.color = {};
        let K = typeof q.margin > "u" || q.margin === null || q.margin < 0 ? 4 : q.margin,
            Y = q.width && q.width >= 21 ? q.width : void 0,
            z = q.scale || 4;
        return {
            width: Y,
            scale: Y ? 4 : z,
            margin: K,
            color: {
                dark: n$q(q.color.dark || "#000000ff"),
                light: n$q(q.color.light || "#ffffffff")
            },
            type: q.type,
            rendererOpts: q.rendererOpts || {}
        }
    };
    qsY.getScale = function(q, K) {
        return K.width && K.width >= q + K.margin * 2 ? K.width / (q + K.margin * 2) : K.scale
    };
    qsY.getImageWidth = function(q, K) {
        let Y = qsY.getScale(q, K);
        return Math.floor((q + K.margin * 2) * Y)
    };
    qsY.qrToImageData = function(q, K, Y) {
        let z = K.modules.size,
            _ = K.modules.data,
            w = qsY.getScale(z, Y),
            O = Math.floor((z + Y.margin * 2) * w),
            $ = Y.margin * w,
            H = [Y.color.light, Y.color.dark];
        for (let j = 0; j < O; j++)
            for (let J = 0; J < O; J++) {
                let M = (j * O + J) * 4,
                    D = Y.color.light;
                if (j >= $ && J >= $ && j < O - $ && J < O - $) {
                    let X = Math.floor((j - $) / w),
                        P = Math.floor((J - $) / w);
                    D = H[_[X * z + P] ? 1 : 0]
                }
                q[M++] = D.r, q[M++] = D.g, q[M++] = D.b, q[M] = D.a
            }
    }
})
// @from(Ln 408382, Col 4)
r$q = x((OsY) => {
    var _sY = x6("fs"),
        wsY = i$q().PNG,
        Kc8 = Qn6();
    OsY.render = function(q, K) {
        let Y = Kc8.getOptions(K),
            z = Y.rendererOpts,
            _ = Kc8.getImageWidth(q.modules.size, Y);
        z.width = _, z.height = _;
        let w = new wsY(z);
        return Kc8.qrToImageData(w.data, q, Y), w
    };
    OsY.renderToDataURL = function(q, K, Y) {
        if (typeof Y > "u") Y = K, K = void 0;
        OsY.renderToBuffer(q, K, function(z, _) {
            if (z) Y(z);
            let w = "data:image/png;base64,";
            w += _.toString("base64"), Y(null, w)
        })
    };
    OsY.renderToBuffer = function(q, K, Y) {
        if (typeof Y > "u") Y = K, K = void 0;
        let z = OsY.render(q, K),
            _ = [];
        z.on("error", Y), z.on("data", function(w) {
            _.push(w)
        }), z.on("end", function() {
            Y(null, Buffer.concat(_))
        }), z.pack()
    };
    OsY.renderToFile = function(q, K, Y, z) {
        if (typeof z > "u") z = Y, Y = void 0;
        let _ = !1,
            w = (...$) => {
                if (_) return;
                _ = !0, z.apply(null, $)
            },
            O = _sY.createWriteStream(q);
        O.on("error", w), O.on("close", w), OsY.renderToFileStream(O, K, Y)
    };
    OsY.renderToFileStream = function(q, K, Y) {
        OsY.render(K, Y).pack().pipe(q)
    }
})
// @from(Ln 408426, Col 4)
a$q = x((WsY) => {
    var MsY = Qn6(),
        DsY = {
            WW: " ",
            WB: "▄",
            BB: "█",
            BW: "▀"
        },
        XsY = {
            BB: " ",
            BW: "▄",
            WW: "█",
            WB: "▀"
        };

    function PsY(A, q, K) {
        if (A && q) return K.BB;
        if (A && !q) return K.BW;
        if (!A && q) return K.WB;
        return K.WW
    }
    WsY.render = function(A, q, K) {
        let Y = MsY.getOptions(q),
            z = DsY;
        if (Y.color.dark.hex === "#ffffff" || Y.color.light.hex === "#000000") z = XsY;
        let _ = A.modules.size,
            w = A.modules.data,
            O = "",
            $ = Array(_ + Y.margin * 2 + 1).join(z.WW);
        $ = Array(Y.margin / 2 + 1).join($ + `
`);
        let H = Array(Y.margin + 1).join(z.WW);
        O += $;
        for (let j = 0; j < _; j += 2) {
            O += H;
            for (let J = 0; J < _; J++) {
                let M = w[j * _ + J],
                    D = w[(j + 1) * _ + J];
                O += PsY(M, D, z)
            }
            O += H + `
`
        }
        if (O += $.slice(0, -1), typeof K === "function") K(null, O);
        return O
    };
    WsY.renderToFile = function(q, K, Y, z) {
        if (typeof z > "u") z = Y, Y = void 0;
        let _ = x6("fs"),
            w = WsY.render(K, Y);
        _.writeFile(q, w, z)
    }
})
// @from(Ln 408479, Col 4)
s$q = x((GsY) => {
    GsY.render = function(A, q, K) {
        let Y = A.modules.size,
            z = A.modules.data,
            _ = "\x1B[40m  \x1B[0m",
            w = "\x1B[47m  \x1B[0m",
            O = "",
            $ = Array(Y + 3).join("\x1B[47m  \x1B[0m"),
            H = Array(2).join("\x1B[47m  \x1B[0m");
        O += $ + `
`;
        for (let j = 0; j < Y; ++j) {
            O += "\x1B[47m  \x1B[0m";
            for (let J = 0; J < Y; J++) O += z[j * Y + J] ? "\x1B[40m  \x1B[0m" : "\x1B[47m  \x1B[0m";
            O += H + `
`
        }
        if (O += $ + `
`, typeof K === "function") K(null, O);
        return O
    }
})
// @from(Ln 408501, Col 4)
AHq = x((VsY) => {
    var TsY = "\x1B[47m\x1B[30m",
        vsY = "\x1B[40m\x1B[37m",
        NsY = function(A, q, K) {
            return {
                "00": "\x1B[0m " + A,
                "01": "\x1B[0m" + q + "▄" + A,
                "02": "\x1B[0m" + K + "▄" + A,
                10: "\x1B[0m" + q + "▀" + A,
                11: " ",
                12: "▄",
                20: "\x1B[0m" + K + "▀" + A,
                21: "▀",
                22: "█"
            }
        },
        t$q = function(A, q, K, Y) {
            let z = q + 1;
            if (K >= z || Y >= z || Y < -1 || K < -1) return "0";
            if (K >= q || Y >= q || Y < 0 || K < 0) return "1";
            let _ = Y * q + K;
            return A[_] ? "2" : "1"
        },
        e$q = function(A, q, K, Y) {
            return t$q(A, q, K, Y) + t$q(A, q, K, Y + 1)
        };
    VsY.render = function(A, q, K) {
        let Y = A.modules.size,
            z = A.modules.data,
            _ = !!(q && q.inverse),
            w = q && q.inverse ? vsY : TsY,
            H = NsY(w, _ ? "\x1B[30m" : "\x1B[37m", _ ? "\x1B[37m" : "\x1B[30m"),
            j = `\x1B[0m
` + w,
            J = w;
        for (let M = -1; M < Y + 1; M += 2) {
            for (let D = -1; D < Y; D++) J += H[e$q(z, Y, D, M)];
            J += H[e$q(z, Y, Y, M)] + j
        }
        if (J += "\x1B[0m", typeof K === "function") K(null, J);
        return J
    }
})
// @from(Ln 408544, Col 4)
qHq = x((LsY) => {
    var EsY = s$q(),
        ysY = AHq();
    LsY.render = function(A, q, K) {
        if (q && q.small) return ysY.render(A, q, K);
        return EsY.render(A, q, K)
    }
})
// @from(Ln 408552, Col 4)
_c8 = x((CsY) => {
    var hsY = Qn6();

    function KHq(A, q) {
        let K = A.a / 255,
            Y = q + '="' + A.hex + '"';
        return K < 1 ? Y + " " + q + '-opacity="' + K.toFixed(2).slice(1) + '"' : Y
    }

    function zc8(A, q, K) {
        let Y = A + q;
        if (typeof K < "u") Y += " " + K;
        return Y
    }

    function SsY(A, q, K) {
        let Y = "",
            z = 0,
            _ = !1,
            w = 0;
        for (let O = 0; O < A.length; O++) {
            let $ = Math.floor(O % q),
                H = Math.floor(O / q);
            if (!$ && !_) _ = !0;
            if (A[O]) {
                if (w++, !(O > 0 && $ > 0 && A[O - 1])) Y += _ ? zc8("M", $ + K, 0.5 + H + K) : zc8("m", z, 0), z = 0, _ = !1;
                if (!($ + 1 < q && A[O + 1])) Y += zc8("h", w), w = 0
            } else z++
        }
        return Y
    }
    CsY.render = function(q, K, Y) {
        let z = hsY.getOptions(K),
            _ = q.modules.size,
            w = q.modules.data,
            O = _ + z.margin * 2,
            $ = !z.color.light.a ? "" : "<path " + KHq(z.color.light, "fill") + ' d="M0 0h' + O + "v" + O + 'H0z"/>',
            H = "<path " + KHq(z.color.dark, "stroke") + ' d="' + SsY(w, _, z.margin) + '"/>',
            j = 'viewBox="0 0 ' + O + " " + O + '"',
            M = '<svg xmlns="http://www.w3.org/2000/svg" ' + (!z.width ? "" : 'width="' + z.width + '" height="' + z.width + '" ') + j + ' shape-rendering="crispEdges">' + $ + H + `</svg>
`;
        if (typeof Y === "function") Y(null, M);
        return M
    }
})
// @from(Ln 408597, Col 4)
zHq = x((xsY) => {
    var bsY = _c8();
    xsY.render = bsY.render;
    xsY.renderToFile = function(q, K, Y, z) {
        if (typeof z > "u") z = Y, Y = void 0;
        let _ = x6("fs"),
            O = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + xsY.render(K, Y);
        _.writeFile(q, O, z)
    }
})
// @from(Ln 408607, Col 4)
wHq = x((gsY) => {
    var wc8 = Qn6();

    function msY(A, q, K) {
        if (A.clearRect(0, 0, q.width, q.height), !q.style) q.style = {};
        q.height = K, q.width = K, q.style.height = K + "px", q.style.width = K + "px"
    }

    function BsY() {
        try {
            return document.createElement("canvas")
        } catch (A) {
            throw Error("You need to specify a canvas element")
        }
    }
    gsY.render = function(q, K, Y) {
        let z = Y,
            _ = K;
        if (typeof z > "u" && (!K || !K.getContext)) z = K, K = void 0;
        if (!K) _ = BsY();
        z = wc8.getOptions(z);
        let w = wc8.getImageWidth(q.modules.size, z),
            O = _.getContext("2d"),
            $ = O.createImageData(w, w);
        return wc8.qrToImageData($.data, q, z), msY(O, _, w), O.putImageData($, 0, 0), _
    };
    gsY.renderToDataURL = function(q, K, Y) {
        let z = Y;
        if (typeof z > "u" && (!K || !K.getContext)) z = K, K = void 0;
        if (!z) z = {};
        let _ = gsY.render(q, K, z),
            w = z.type || "image/png",
            O = z.rendererOpts || {};
        return _.toDataURL(w, O.quality)
    }
})
// @from(Ln 408643, Col 4)
$Hq = x((UsY) => {
    var psY = Zd8(),
        Oc8 = Qd8(),
        OHq = wHq(),
        QsY = _c8();

    function $c8(A, q, K, Y, z) {
        let _ = [].slice.call(arguments, 1),
            w = _.length,
            O = typeof _[w - 1] === "function";
        if (!O && !psY()) throw Error("Callback required as last argument");
        if (O) {
            if (w < 2) throw Error("Too few arguments provided");
            if (w === 2) z = K, K = q, q = Y = void 0;
            else if (w === 3)
                if (q.getContext && typeof z > "u") z = Y, Y = void 0;
                else z = Y, Y = K, K = q, q = void 0
        } else {
            if (w < 1) throw Error("Too few arguments provided");
            if (w === 1) K = q, q = Y = void 0;
            else if (w === 2 && !q.getContext) Y = K, K = q, q = void 0;
            return new Promise(function($, H) {
                try {
                    let j = Oc8.create(K, Y);
                    $(A(j, q, Y))
                } catch (j) {
                    H(j)
                }
            })
        }
        try {
            let $ = Oc8.create(K, Y);
            z(null, A($, q, Y))
        } catch ($) {
            z($)
        }
    }
    UsY.create = Oc8.create;
    UsY.toCanvas = $c8.bind(null, OHq.render);
    UsY.toDataURL = $c8.bind(null, OHq.renderToDataURL);
    UsY.toString = $c8.bind(null, function(A, q, K) {
        return QsY.render(A, K)
    })
})
// @from(Ln 408688, Col 0)
function ssY(A, q, K) {
    if (typeof A > "u") throw Error("String required as first argument");
    if (typeof K > "u") K = q, q = {};
    if (typeof K !== "function")
        if (!nsY()) throw Error("Callback required as last argument");
        else q = K || {}, K = null;
    return {
        opts: q,
        cb: K
    }
}
// @from(Ln 408700, Col 0)
function tsY(A) {
    switch (A) {
        case "svg":
            return asY;
        case "terminal":
            return osY;
        case "utf8":
        default:
            return rsY
    }
}
// @from(Ln 408712, Col 0)
function esY(A, q, K) {
    if (!K.cb) return new Promise(function(Y, z) {
        try {
            let _ = Hc8.create(q, K.opts);
            return A(_, K.opts, function(w, O) {
                return w ? z(w) : Y(O)
            })
        } catch (_) {
            z(_)
        }
    });
    try {
        let Y = Hc8.create(q, K.opts);
        return A(Y, K.opts, K.cb)
    } catch (Y) {
        K.cb(Y)
    }
}
// @from(Ln 408730, Col 4)
nsY
// @from(Ln 408730, Col 9)
Hc8
// @from(Ln 408730, Col 14)
ybO
// @from(Ln 408730, Col 19)
rsY
// @from(Ln 408730, Col 24)
osY
// @from(Ln 408730, Col 29)
asY
// @from(Ln 408730, Col 34)
AtY
// @from(Ln 408730, Col 39)
qtY
// @from(Ln 408730, Col 44)
Lh = function(q, K, Y) {
    let z = ssY(q, K, Y),
        _ = z.opts ? z.opts.type : void 0,
        w = tsY(_);
    return esY(w.render, q, z)
}
// @from(Ln 408736, Col 4)
KN6 = E(() => {
    nsY = Zd8(), Hc8 = Qd8(), ybO = r$q(), rsY = a$q(), osY = qHq(), asY = zHq();
    AtY = Hc8.create, qtY = $Hq().toCanvas
})
// @from(Ln 408740, Col 4)
HHq = {}
// @from(Ln 408745, Col 0)
function KtY(A) {
    let q = A6(39),
        {
            onDone: K
        } = A,
        [Y, z] = Un6.useState("ios"),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = {
        ios: "",
        android: ""
    }, q[0] = _;
    else _ = q[0];
    let [w, O] = Un6.useState(_), {
        url: $
    } = jc8[Y], H = w[Y], j, J;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) j = () => {
        (async function() {
            let [Y6, H6] = await Promise.all([Lh(jc8.ios.url, {
                type: "utf8",
                errorCorrectionLevel: "L"
            }), Lh(jc8.android.url, {
                type: "utf8",
                errorCorrectionLevel: "L"
            })]);
            O({
                ios: Y6,
                android: H6
            })
        })().catch(wtY)
    }, J = [], q[1] = j, q[2] = J;
    else j = q[1], J = q[2];
    Un6.useEffect(j, J);
    let M;
    if (q[3] !== K) M = () => {
        K()
    }, q[3] = K, q[4] = M;
    else M = q[4];
    let D = M,
        X;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) X = {
        context: "Confirmation"
    }, q[5] = X;
    else X = q[5];
    D8("confirm:no", D, X);
    let P;
    if (q[6] !== K) P = (r, e) => {
        if (r === "q" || e.ctrl && r === "c") {
            K();
            return
        }
        if (e.tab || e.leftArrow || e.rightArrow) z(_tY)
    }, q[6] = K, q[7] = P;
    else P = q[7];
    jA(P);
    let W, Z, G, f;
    if (q[8] !== H) {
        let r = H.split(`
`).filter(ztY);
        if (W = S3, q[13] === Symbol.for("react.memo_cache_sentinel")) Z = r_.createElement(T, null, " "), G = r_.createElement(T, null, " "), q[13] = Z, q[14] = G;
        else Z = q[13], G = q[14];
        f = r.map(YtY), q[8] = H, q[9] = W, q[10] = Z, q[11] = G, q[12] = f
    } else W = q[9], Z = q[10], G = q[11], f = q[12];
    let v, N;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) v = r_.createElement(T, null, " "), N = r_.createElement(T, null, " "), q[15] = v, q[16] = N;
    else v = q[15], N = q[16];
    let V = Y === "ios",
        L = Y === "ios",
        h;
    if (q[17] !== V || q[18] !== L) h = r_.createElement(T, {
        bold: V,
        underline: L
    }, "iOS"), q[17] = V, q[18] = L, q[19] = h;
    else h = q[19];
    let R;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) R = r_.createElement(T, {
        dimColor: !0
    }, " / "), q[20] = R;
    else R = q[20];
    let u = Y === "android",
        I = Y === "android",
        g;
    if (q[21] !== u || q[22] !== I) g = r_.createElement(T, {
        bold: u,
        underline: I
    }, "Android"), q[21] = u, q[22] = I, q[23] = g;
    else g = q[23];
    let B;
    if (q[24] !== h || q[25] !== g) B = r_.createElement(T, null, h, R, g), q[24] = h, q[25] = g, q[26] = B;
    else B = q[26];
    let b;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) b = r_.createElement(T, {
        dimColor: !0
    }, "(tab to switch, esc to close)"), q[27] = b;
    else b = q[27];
    let p;
    if (q[28] !== B) p = r_.createElement(m, {
        flexDirection: "row",
        gap: 2
    }, B, b), q[28] = B, q[29] = p;
    else p = q[29];
    let Q;
    if (q[30] !== $) Q = r_.createElement(T, {
        dimColor: !0
    }, $), q[30] = $, q[31] = Q;
    else Q = q[31];
    let U;
    if (q[32] !== W || q[33] !== p || q[34] !== Q || q[35] !== Z || q[36] !== G || q[37] !== f) U = r_.createElement(W, null, Z, G, f, v, N, p, Q), q[32] = W, q[33] = p, q[34] = Q, q[35] = Z, q[36] = G, q[37] = f, q[38] = U;
    else U = q[38];
    return U
}
// @from(Ln 408856, Col 0)
function YtY(A, q) {
    return r_.createElement(T, {
        key: q
    }, A)
}
// @from(Ln 408862, Col 0)
function ztY(A) {
    return A.length > 0
}
// @from(Ln 408866, Col 0)
function _tY(A) {
    return A === "ios" ? "android" : "ios"
}
// @from(Ln 408870, Col 0)
function wtY() {}
// @from(Ln 408871, Col 0)
async function OtY(A) {
    return r_.createElement(KtY, {
        onDone: A
    })
}
// @from(Ln 408876, Col 4)
r_
// @from(Ln 408876, Col 8)
Un6
// @from(Ln 408876, Col 13)
jc8
// @from(Ln 408877, Col 4)
jHq = E(() => {
    e6();
    i6();
    _7();
    FJ();
    KN6();
    r_ = t(P6(), 1), Un6 = t(P6(), 1), jc8 = {
        ios: {
            url: "https://apps.apple.com/app/claude-by-anthropic/id6473753684"
        },
        android: {
            url: "https://play.google.com/store/apps/details?id=com.anthropic.claude"
        }
    }
})
// @from(Ln 408892, Col 4)
$tY
// @from(Ln 408892, Col 9)
Jc8
// @from(Ln 408893, Col 4)
JHq = E(() => {
    $tY = {
        type: "local-jsx",
        name: "mobile",
        aliases: ["ios", "android"],
        description: "Show QR code to download the Claude mobile app",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (jHq(), HHq)),
        userFacingName() {
            return "mobile"
        }
    }, Jc8 = $tY
})
// @from(Ln 408907, Col 4)
MHq
// @from(Ln 408908, Col 4)
DHq = E(() => {
    MHq = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 408916, Col 0)
function YN6({
    name: A,
    description: q,
    progressMessage: K,
    pluginName: Y,
    pluginCommand: z,
    getPromptWhileMarketplaceIsPrivate: _
}) {
    return {
        type: "prompt",
        name: A,
        description: q,
        progressMessage: K,
        contentLength: 0,
        isEnabled: () => !0,
        isHidden: !1,
        userFacingName() {
            return A
        },
        source: "builtin",
        async getPromptForCommand(w, O) {
            return _(w, O)
        }
    }
}
// @from(Ln 408941, Col 4)
XHq
// @from(Ln 408942, Col 4)
PHq = E(() => {
    XHq = YN6({
        name: "pr-comments",
        description: "Get comments from a GitHub pull request",
        progressMessage: "fetching PR comments",
        pluginName: "pr-comments",
        pluginCommand: "pr-comments",
        async getPromptWhileMarketplaceIsPrivate(A) {
            return [{
                type: "text",
                text: `You are an AI assistant integrated into a git-based version control system. Your task is to fetch and display comments from a GitHub pull request.

Follow these steps:

1. Use \`gh pr view --json number,headRepository\` to get the PR number and repository info
2. Use \`gh api /repos/{owner}/{repo}/issues/{number}/comments\` to get PR-level comments
3. Use \`gh api /repos/{owner}/{repo}/pulls/{number}/comments\` to get review comments. Pay particular attention to the following fields: \`body\`, \`diff_hunk\`, \`path\`, \`line\`, etc. If the comment references some code, consider fetching it using eg \`gh api /repos/{owner}/{repo}/contents/{path}?ref={branch} | jq .content -r | base64 -d\`
4. Parse and format all comments in a readable way
5. Return ONLY the formatted comments, with no additional text

Format the comments as:

## Comments

[For each comment thread:]
- @author file.ts#line:
  \`\`\`diff
  [diff_hunk from the API response]
  \`\`\`
  > quoted comment text

  [any replies indented]

If there are no comments, return "No comments found."

Remember:
1. Only show the actual comments, no explanatory text
2. Include both PR-level and code review comments
3. Preserve the threading/nesting of comment replies
4. Show the file and line number context for code review comments
5. Use jq to parse the JSON responses from the GitHub API

${A?"Additional user input: "+A:""}
`
            }]
        }
    })
})
// @from(Ln 409000, Col 0)
function Dc8() {
    return HtY(c8(), "cache", "changelog.md")
}
// @from(Ln 409003, Col 0)
async function THq() {
    let A = X1();
    if (!A.cachedChangelog) return;
    let q = Dc8();
    try {
        await GHq(WHq(q), {
            recursive: !0
        }), await ZHq(q, A.cachedChangelog, {
            encoding: "utf-8",
            flag: "wx"
        })
    } catch {}
    d1(({
        cachedChangelog: K,
        ...Y
    }) => Y)
}
// @from(Ln 409020, Col 0)
async function Xc8() {
    if (q7()) return;
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
    let A = await X8.get(MtY);
    if (A.status === 200) {
        let q = A.data,
            K = Dc8();
        await GHq(WHq(K), {
            recursive: !0
        }), await ZHq(K, q, {
            encoding: "utf-8"
        }), zN6 = q;
        let Y = Date.now();
        d1((z) => ({
            ...z,
            changelogLastFetched: Y
        }))
    }
}
// @from(Ln 409039, Col 0)
async function sL1() {
    if (zN6 !== null) return zN6;
    let A = Dc8();
    try {
        let q = await jtY(A, "utf-8");
        return zN6 = q, q
    } catch {
        return zN6 = "", ""
    }
}
// @from(Ln 409050, Col 0)
function tL1() {
    return zN6 ?? ""
}
// @from(Ln 409054, Col 0)
function eL1(A) {
    try {
        if (!A) return {};
        let q = {},
            K = A.split(/^## /gm).slice(1);
        for (let Y of K) {
            let z = Y.trim().split(`
`);
            if (z.length === 0) continue;
            let _ = z[0];
            if (!_) continue;
            let w = _.split(" - ")[0]?.trim() || "";
            if (!w) continue;
            let O = z.slice(1).filter(($) => $.trim().startsWith("- ")).map(($) => $.trim().substring(2).trim()).filter(Boolean);
            if (O.length > 0) q[w] = O
        }
        return q
    } catch (q) {
        return _6(q instanceof Error ? q : Error("Failed to parse changelog")), {}
    }
}
// @from(Ln 409076, Col 0)
function vHq(A, q, K = tL1()) {
    try {
        let Y = eL1(K),
            z = Mc8.coerce(A),
            _ = q ? Mc8.coerce(q) : null;
        if (!_ || z && UG(z.version, _.version)) return Object.entries(Y).filter(([w]) => !_ || UG(w, _.version)).sort(([w], [O]) => UG(w, O) ? -1 : 1).flatMap(([w, O]) => O).filter(Boolean).slice(0, JtY)
    } catch (Y) {
        return _6(Y instanceof Error ? Y : Error("Failed to get release notes")), []
    }
    return []
}
// @from(Ln 409088, Col 0)
function Pc8(A = tL1()) {
    try {
        let q = eL1(A);
        return Object.keys(q).sort((Y, z) => UG(Y, z) ? 1 : -1).map((Y) => {
            let z = q[Y];
            if (!z || z.length === 0) return null;
            let _ = z.filter(Boolean);
            if (_.length === 0) return null;
            return [Y, _]
        }).filter((Y) => Y !== null)
    } catch (q) {
        return _6(q instanceof Error ? q : Error("Failed to get release notes")), []
    }
}