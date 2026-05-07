
// @from(Ln 294284, Col 0)
async function ba1() {
    if (!PF()) return {
        settings: null,
        fetchSucceeded: !0
    };
    let q = Gr();
    if (q) return E(`Remote settings: Using override file ${q} (CLAUDE_CODE_REMOTE_SETTINGS_PATH), skipping API fetch`), {
        settings: vr(),
        fetchSucceeded: !0
    };
    let K = vr(),
        _ = K ? KLz(K) : void 0;
    try {
        let z = await zLz(_);
        if (!z.success) {
            if (K) return E("Remote settings: Using stale cache after fetch failure"), hf6(K), {
                settings: K,
                fetchSucceeded: !1
            };
            return {
                settings: null,
                fetchSucceeded: !1
            }
        }
        if (z.settings === null && K) return E("Remote settings: Cache still valid (304 Not Modified)"), hf6(K), {
            settings: K,
            fetchSucceeded: !0
        };
        let Y = z.settings || {};
        if (Object.keys(Y).length > 0) {
            let O = await gc4(lc4(K), lc4(Y));
            if (!Uc4(O)) return E("Remote settings: User rejected new settings, using cached settings"), {
                settings: K,
                fetchSucceeded: !0
            };
            return hf6(Y), await ALz(Y), E("Remote settings: Applied new settings successfully"), {
                settings: Y,
                fetchSucceeded: !0
            }
        }
        hf6(Y);
        try {
            let O = tU6();
            await nc4(O), E("Remote settings: Deleted cached file (404 response)")
        } catch (O) {
            if (Q1(O) !== "ENOENT") E(`Remote settings: Failed to delete cached file - ${O instanceof Error?O.message:"unknown error"}`)
        }
        return {
            settings: Y,
            fetchSucceeded: !0
        }
    } catch {
        if (K) return E("Remote settings: Using stale cache after error"), hf6(K), {
            settings: K,
            fetchSucceeded: !1
        };
        return {
            settings: null,
            fetchSucceeded: !1
        }
    }
}
// @from(Ln 294346, Col 0)
async function Ia1() {
    if (PF() && !D36) D36 = new Promise((q) => {
        tR = q
    });
    if (vr() && tR) tR(), tR = null;
    try {
        let {
            settings: q,
            fetchSucceeded: K
        } = await ba1();
        if (PF() && !Gr()) oc4();
        if (q !== null) Sa1();
        return K
    } finally {
        if (tR) tR(), tR = null
    }
}
// @from(Ln 294363, Col 0)
async function V78() {
    if (ua1(), ya1(), D36 = null, tR = null, !PF()) return Sa1(), !0;
    let {
        fetchSucceeded: q
    } = await ba1();
    if (E("Remote settings: Refreshed after auth change"), !Gr()) oc4();
    return Sa1(), q
}
// @from(Ln 294372, Col 0)
function Sa1() {
    try {
        _y.notifyChange("policySettings")
    } catch (q) {
        j6(q)
    }
}
// @from(Ln 294379, Col 0)
async function xa1(q) {
    try {
        if (await q()) return {
            valid: !0
        }
    } catch (K) {
        j6(K)
    }
    return {
        valid: !1,
        message: OLz
    }
}
// @from(Ln 294392, Col 0)
async function wLz() {
    if (!PF()) return;
    let q = vr(),
        K = q ? I6(q) : null;
    try {
        await ba1();
        let _ = vr();
        if ((_ ? I6(_) : null) !== K) E("Remote settings: Changed during background poll"), _y.notifyChange("policySettings")
    } catch {}
}
// @from(Ln 294403, Col 0)
function oc4() {
    if (sR6 !== null) return;
    if (!PF()) return;
    sR6 = setInterval(() => {
        wLz()
    }, syz), sR6.unref(), eq(async () => ua1())
}
// @from(Ln 294411, Col 0)
function ua1() {
    if (sR6 !== null) clearInterval(sR6), sR6 = null
}
// @from(Ln 294414, Col 4)
ayz = 1e4
// @from(Ln 294415, Col 4)
ha1 = 5
// @from(Ln 294416, Col 4)
syz = 3600000
// @from(Ln 294417, Col 4)
sR6 = null
// @from(Ln 294418, Col 4)
D36 = null
// @from(Ln 294419, Col 4)
tR = null
// @from(Ln 294420, Col 4)
tyz = 30000
// @from(Ln 294421, Col 4)
OLz = "Your organization requires remote managed settings to load, but they could not be loaded. Check your network connection and credentials, or contact your administrator."
// @from(Ln 294422, Col 4)
tR6 = L(() => {
    CK();
    z3();
    T7();
    R9();
    K8();
    m8();
    U8();
    zK6();
    Th();
    pQ6();
    e8();
    Z36();
    Qc4();
    La1();
    wJ8();
    cc4()
})
// @from(Ln 294440, Col 4)
du8 = p((ac4) => {
    Object.defineProperty(ac4, "__esModule", {
        value: !0
    });
    ac4.AggregationTemporality = void 0;
    var $Lz;
    (function(q) {
        q[q.DELTA = 0] = "DELTA", q[q.CUMULATIVE = 1] = "CUMULATIVE"
    })($Lz = ac4.AggregationTemporality || (ac4.AggregationTemporality = {}))
})
// @from(Ln 294450, Col 4)
f36 = p((tc4) => {
    Object.defineProperty(tc4, "__esModule", {
        value: !0
    });
    tc4.DataPointType = tc4.InstrumentType = void 0;
    var jLz;
    (function(q) {
        q.COUNTER = "COUNTER", q.GAUGE = "GAUGE", q.HISTOGRAM = "HISTOGRAM", q.UP_DOWN_COUNTER = "UP_DOWN_COUNTER", q.OBSERVABLE_COUNTER = "OBSERVABLE_COUNTER", q.OBSERVABLE_GAUGE = "OBSERVABLE_GAUGE", q.OBSERVABLE_UP_DOWN_COUNTER = "OBSERVABLE_UP_DOWN_COUNTER"
    })(jLz = tc4.InstrumentType || (tc4.InstrumentType = {}));
    var HLz;
    (function(q) {
        q[q.HISTOGRAM = 0] = "HISTOGRAM", q[q.EXPONENTIAL_HISTOGRAM = 1] = "EXPONENTIAL_HISTOGRAM", q[q.GAUGE = 2] = "GAUGE", q[q.SUM = 3] = "SUM"
    })(HLz = tc4.DataPointType || (tc4.DataPointType = {}))
})
// @from(Ln 294464, Col 4)
WF = p((ec4) => {
    Object.defineProperty(ec4, "__esModule", {
        value: !0
    });
    ec4.equalsCaseInsensitive = ec4.binarySearchUB = ec4.setEquals = ec4.FlatMap = ec4.isPromiseAllSettledRejectionResult = ec4.PromiseAllSettled = ec4.callWithTimeout = ec4.TimeoutError = ec4.instrumentationScopeId = ec4.hashAttributes = ec4.isNotNullish = void 0;

    function JLz(q) {
        return q !== void 0 && q !== null
    }
    ec4.isNotNullish = JLz;

    function XLz(q) {
        let K = Object.keys(q);
        if (K.length === 0) return "";
        return K = K.sort(), JSON.stringify(K.map((_) => [_, q[_]]))
    }
    ec4.hashAttributes = XLz;

    function MLz(q) {
        return `${q.name}:${q.version??""}:${q.schemaUrl??""}`
    }
    ec4.instrumentationScopeId = MLz;
    class cu8 extends Error {
        constructor(q) {
            super(q);
            Object.setPrototypeOf(this, cu8.prototype)
        }
    }
    ec4.TimeoutError = cu8;

    function PLz(q, K) {
        let _, z = new Promise(function(A, O) {
            _ = setTimeout(function() {
                O(new cu8("Operation timed out."))
            }, K)
        });
        return Promise.race([q, z]).then((Y) => {
            return clearTimeout(_), Y
        }, (Y) => {
            throw clearTimeout(_), Y
        })
    }
    ec4.callWithTimeout = PLz;
    async function WLz(q) {
        return Promise.all(q.map(async (K) => {
            try {
                return {
                    status: "fulfilled",
                    value: await K
                }
            } catch (_) {
                return {
                    status: "rejected",
                    reason: _
                }
            }
        }))
    }
    ec4.PromiseAllSettled = WLz;

    function DLz(q) {
        return q.status === "rejected"
    }
    ec4.isPromiseAllSettledRejectionResult = DLz;

    function ZLz(q, K) {
        let _ = [];
        return q.forEach((z) => {
            _.push(...K(z))
        }), _
    }
    ec4.FlatMap = ZLz;

    function fLz(q, K) {
        if (q.size !== K.size) return !1;
        for (let _ of q)
            if (!K.has(_)) return !1;
        return !0
    }
    ec4.setEquals = fLz;

    function GLz(q, K) {
        let _ = 0,
            z = q.length - 1,
            Y = q.length;
        while (z >= _) {
            let A = _ + Math.trunc((z - _) / 2);
            if (q[A] < K) _ = A + 1;
            else Y = A, z = A - 1
        }
        return Y
    }
    ec4.binarySearchUB = GLz;

    function vLz(q, K) {
        return q.toLowerCase() === K.toLowerCase()
    }
    ec4.equalsCaseInsensitive = vLz
})
// @from(Ln 294563, Col 4)
eR6 = p((Kl4) => {
    Object.defineProperty(Kl4, "__esModule", {
        value: !0
    });
    Kl4.AggregatorKind = void 0;
    var CLz;
    (function(q) {
        q[q.DROP = 0] = "DROP", q[q.SUM = 1] = "SUM", q[q.LAST_VALUE = 2] = "LAST_VALUE", q[q.HISTOGRAM = 3] = "HISTOGRAM", q[q.EXPONENTIAL_HISTOGRAM = 4] = "EXPONENTIAL_HISTOGRAM"
    })(CLz = Kl4.AggregatorKind || (Kl4.AggregatorKind = {}))
})
// @from(Ln 294573, Col 4)
Al4 = p((zl4) => {
    Object.defineProperty(zl4, "__esModule", {
        value: !0
    });
    zl4.DropAggregator = void 0;
    var bLz = eR6();
    class _l4 {
        kind = bLz.AggregatorKind.DROP;
        createAccumulation() {
            return
        }
        merge(q, K) {
            return
        }
        diff(q, K) {
            return
        }
        toMetricData(q, K, _, z) {
            return
        }
    }
    zl4.DropAggregator = _l4
})
// @from(Ln 294596, Col 4)
jl4 = p((wl4) => {
    Object.defineProperty(wl4, "__esModule", {
        value: !0
    });
    wl4.HistogramAggregator = wl4.HistogramAccumulation = void 0;
    var ILz = eR6(),
        k78 = f36(),
        xLz = WF();

    function uLz(q) {
        let K = q.map(() => 0);
        return K.push(0), {
            buckets: {
                boundaries: q,
                counts: K
            },
            sum: 0,
            count: 0,
            hasMinMax: !1,
            min: 1 / 0,
            max: -1 / 0
        }
    }
    class N78 {
        startTime;
        _boundaries;
        _recordMinMax;
        _current;
        constructor(q, K, _ = !0, z = uLz(K)) {
            this.startTime = q, this._boundaries = K, this._recordMinMax = _, this._current = z
        }
        record(q) {
            if (Number.isNaN(q)) return;
            if (this._current.count += 1, this._current.sum += q, this._recordMinMax) this._current.min = Math.min(q, this._current.min), this._current.max = Math.max(q, this._current.max), this._current.hasMinMax = !0;
            let K = (0, xLz.binarySearchUB)(this._boundaries, q);
            this._current.buckets.counts[K] += 1
        }
        setStartTime(q) {
            this.startTime = q
        }
        toPointValue() {
            return this._current
        }
    }
    wl4.HistogramAccumulation = N78;
    class Ol4 {
        _boundaries;
        _recordMinMax;
        kind = ILz.AggregatorKind.HISTOGRAM;
        constructor(q, K) {
            this._boundaries = q, this._recordMinMax = K
        }
        createAccumulation(q) {
            return new N78(q, this._boundaries, this._recordMinMax)
        }
        merge(q, K) {
            let _ = q.toPointValue(),
                z = K.toPointValue(),
                Y = _.buckets.counts,
                A = z.buckets.counts,
                O = Array(Y.length);
            for (let j = 0; j < Y.length; j++) O[j] = Y[j] + A[j];
            let w = 1 / 0,
                $ = -1 / 0;
            if (this._recordMinMax) {
                if (_.hasMinMax && z.hasMinMax) w = Math.min(_.min, z.min), $ = Math.max(_.max, z.max);
                else if (_.hasMinMax) w = _.min, $ = _.max;
                else if (z.hasMinMax) w = z.min, $ = z.max
            }
            return new N78(q.startTime, _.buckets.boundaries, this._recordMinMax, {
                buckets: {
                    boundaries: _.buckets.boundaries,
                    counts: O
                },
                count: _.count + z.count,
                sum: _.sum + z.sum,
                hasMinMax: this._recordMinMax && (_.hasMinMax || z.hasMinMax),
                min: w,
                max: $
            })
        }
        diff(q, K) {
            let _ = q.toPointValue(),
                z = K.toPointValue(),
                Y = _.buckets.counts,
                A = z.buckets.counts,
                O = Array(Y.length);
            for (let w = 0; w < Y.length; w++) O[w] = A[w] - Y[w];
            return new N78(K.startTime, _.buckets.boundaries, this._recordMinMax, {
                buckets: {
                    boundaries: _.buckets.boundaries,
                    counts: O
                },
                count: z.count - _.count,
                sum: z.sum - _.sum,
                hasMinMax: !1,
                min: 1 / 0,
                max: -1 / 0
            })
        }
        toMetricData(q, K, _, z) {
            return {
                descriptor: q,
                aggregationTemporality: K,
                dataPointType: k78.DataPointType.HISTOGRAM,
                dataPoints: _.map(([Y, A]) => {
                    let O = A.toPointValue(),
                        w = q.type === k78.InstrumentType.GAUGE || q.type === k78.InstrumentType.UP_DOWN_COUNTER || q.type === k78.InstrumentType.OBSERVABLE_GAUGE || q.type === k78.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
                    return {
                        attributes: Y,
                        startTime: A.startTime,
                        endTime: z,
                        value: {
                            min: O.hasMinMax ? O.min : void 0,
                            max: O.hasMinMax ? O.max : void 0,
                            sum: !w ? O.sum : void 0,
                            buckets: O.buckets,
                            count: O.count
                        }
                    }
                })
            }
        }
    }
    wl4.HistogramAggregator = Ol4
})
// @from(Ln 294722, Col 4)
Xl4 = p((Hl4) => {
    Object.defineProperty(Hl4, "__esModule", {
        value: !0
    });
    Hl4.Buckets = void 0;
    class Fa1 {
        backing;
        indexBase;
        indexStart;
        indexEnd;
        constructor(q = new ga1, K = 0, _ = 0, z = 0) {
            this.backing = q, this.indexBase = K, this.indexStart = _, this.indexEnd = z
        }
        get offset() {
            return this.indexStart
        }
        get length() {
            if (this.backing.length === 0) return 0;
            if (this.indexEnd === this.indexStart && this.at(0) === 0) return 0;
            return this.indexEnd - this.indexStart + 1
        }
        counts() {
            return Array.from({
                length: this.length
            }, (q, K) => this.at(K))
        }
        at(q) {
            let K = this.indexBase - this.indexStart;
            if (q < K) q += this.backing.length;
            return q -= K, this.backing.countAt(q)
        }
        incrementBucket(q, K) {
            this.backing.increment(q, K)
        }
        decrementBucket(q, K) {
            this.backing.decrement(q, K)
        }
        trim() {
            for (let q = 0; q < this.length; q++)
                if (this.at(q) !== 0) {
                    this.indexStart += q;
                    break
                } else if (q === this.length - 1) {
                this.indexStart = this.indexEnd = this.indexBase = 0;
                return
            }
            for (let q = this.length - 1; q >= 0; q--)
                if (this.at(q) !== 0) {
                    this.indexEnd -= this.length - q - 1;
                    break
                } this._rotate()
        }
        downscale(q) {
            this._rotate();
            let K = 1 + this.indexEnd - this.indexStart,
                _ = 1 << q,
                z = 0,
                Y = 0;
            for (let A = this.indexStart; A <= this.indexEnd;) {
                let O = A % _;
                if (O < 0) O += _;
                for (let w = O; w < _ && z < K; w++) this._relocateBucket(Y, z), z++, A++;
                Y++
            }
            this.indexStart >>= q, this.indexEnd >>= q, this.indexBase = this.indexStart
        }
        clone() {
            return new Fa1(this.backing.clone(), this.indexBase, this.indexStart, this.indexEnd)
        }
        _rotate() {
            let q = this.indexBase - this.indexStart;
            if (q === 0) return;
            else if (q > 0) this.backing.reverse(0, this.backing.length), this.backing.reverse(0, q), this.backing.reverse(q, this.backing.length);
            else this.backing.reverse(0, this.backing.length), this.backing.reverse(0, this.backing.length + q);
            this.indexBase = this.indexStart
        }
        _relocateBucket(q, K) {
            if (q === K) return;
            this.incrementBucket(q, this.backing.emptyBucket(K))
        }
    }
    Hl4.Buckets = Fa1;
    class ga1 {
        _counts;
        constructor(q = [0]) {
            this._counts = q
        }
        get length() {
            return this._counts.length
        }
        countAt(q) {
            return this._counts[q]
        }
        growTo(q, K, _) {
            let z = Array(q).fill(0);
            z.splice(_, this._counts.length - K, ...this._counts.slice(K)), z.splice(0, K, ...this._counts.slice(0, K)), this._counts = z
        }
        reverse(q, K) {
            let _ = Math.floor((q + K) / 2) - q;
            for (let z = 0; z < _; z++) {
                let Y = this._counts[q + z];
                this._counts[q + z] = this._counts[K - z - 1], this._counts[K - z - 1] = Y
            }
        }
        emptyBucket(q) {
            let K = this._counts[q];
            return this._counts[q] = 0, K
        }
        increment(q, K) {
            this._counts[q] += K
        }
        decrement(q, K) {
            if (this._counts[q] >= K) this._counts[q] -= K;
            else this._counts[q] = 0
        }
        clone() {
            return new ga1([...this._counts])
        }
    }
})
// @from(Ln 294842, Col 4)
Qa1 = p((Ml4) => {
    Object.defineProperty(Ml4, "__esModule", {
        value: !0
    });
    Ml4.getSignificand = Ml4.getNormalBase2 = Ml4.MIN_VALUE = Ml4.MAX_NORMAL_EXPONENT = Ml4.MIN_NORMAL_EXPONENT = Ml4.SIGNIFICAND_WIDTH = void 0;
    Ml4.SIGNIFICAND_WIDTH = 52;
    var BLz = 2146435072,
        pLz = 1048575,
        Ua1 = 1023;
    Ml4.MIN_NORMAL_EXPONENT = -Ua1 + 1;
    Ml4.MAX_NORMAL_EXPONENT = Ua1;
    Ml4.MIN_VALUE = Math.pow(2, -1022);

    function FLz(q) {
        let K = new DataView(new ArrayBuffer(8));
        return K.setFloat64(0, q), ((K.getUint32(0) & BLz) >> 20) - Ua1
    }
    Ml4.getNormalBase2 = FLz;

    function gLz(q) {
        let K = new DataView(new ArrayBuffer(8));
        K.setFloat64(0, q);
        let _ = K.getUint32(0),
            z = K.getUint32(4);
        return (_ & pLz) * Math.pow(2, 32) + z
    }
    Ml4.getSignificand = gLz
})
// @from(Ln 294870, Col 4)
lu8 = p((Wl4) => {
    Object.defineProperty(Wl4, "__esModule", {
        value: !0
    });
    Wl4.nextGreaterSquare = Wl4.ldexp = void 0;

    function nLz(q, K) {
        if (q === 0 || q === Number.POSITIVE_INFINITY || q === Number.NEGATIVE_INFINITY || Number.isNaN(q)) return q;
        return q * Math.pow(2, K)
    }
    Wl4.ldexp = nLz;

    function iLz(q) {
        return q--, q |= q >> 1, q |= q >> 2, q |= q >> 4, q |= q >> 8, q |= q >> 16, q++, q
    }
    Wl4.nextGreaterSquare = iLz
})
// @from(Ln 294887, Col 4)
nu8 = p((fl4) => {
    Object.defineProperty(fl4, "__esModule", {
        value: !0
    });
    fl4.MappingError = void 0;
    class Zl4 extends Error {}
    fl4.MappingError = Zl4
})
// @from(Ln 294895, Col 4)
Nl4 = p((Vl4) => {
    Object.defineProperty(Vl4, "__esModule", {
        value: !0
    });
    Vl4.ExponentMapping = void 0;
    var qS6 = Qa1(),
        oLz = lu8(),
        vl4 = nu8();
    class Tl4 {
        _shift;
        constructor(q) {
            this._shift = -q
        }
        mapToIndex(q) {
            if (q < qS6.MIN_VALUE) return this._minNormalLowerBoundaryIndex();
            let K = qS6.getNormalBase2(q),
                _ = this._rightShift(qS6.getSignificand(q) - 1, qS6.SIGNIFICAND_WIDTH);
            return K + _ >> this._shift
        }
        lowerBoundary(q) {
            let K = this._minNormalLowerBoundaryIndex();
            if (q < K) throw new vl4.MappingError(`underflow: ${q} is < minimum lower boundary: ${K}`);
            let _ = this._maxNormalLowerBoundaryIndex();
            if (q > _) throw new vl4.MappingError(`overflow: ${q} is > maximum lower boundary: ${_}`);
            return oLz.ldexp(1, q << this._shift)
        }
        get scale() {
            if (this._shift === 0) return 0;
            return -this._shift
        }
        _minNormalLowerBoundaryIndex() {
            let q = qS6.MIN_NORMAL_EXPONENT >> this._shift;
            if (this._shift < 2) q--;
            return q
        }
        _maxNormalLowerBoundaryIndex() {
            return qS6.MAX_NORMAL_EXPONENT >> this._shift
        }
        _rightShift(q, K) {
            return Math.floor(q * Math.pow(2, -K))
        }
    }
    Vl4.ExponentMapping = Tl4
})
// @from(Ln 294939, Col 4)
Sl4 = p((hl4) => {
    Object.defineProperty(hl4, "__esModule", {
        value: !0
    });
    hl4.LogarithmMapping = void 0;
    var KS6 = Qa1(),
        El4 = lu8(),
        yl4 = nu8();
    class Ll4 {
        _scale;
        _scaleFactor;
        _inverseFactor;
        constructor(q) {
            this._scale = q, this._scaleFactor = El4.ldexp(Math.LOG2E, q), this._inverseFactor = El4.ldexp(Math.LN2, -q)
        }
        mapToIndex(q) {
            if (q <= KS6.MIN_VALUE) return this._minNormalLowerBoundaryIndex() - 1;
            if (KS6.getSignificand(q) === 0) return (KS6.getNormalBase2(q) << this._scale) - 1;
            let K = Math.floor(Math.log(q) * this._scaleFactor),
                _ = this._maxNormalLowerBoundaryIndex();
            if (K >= _) return _;
            return K
        }
        lowerBoundary(q) {
            let K = this._maxNormalLowerBoundaryIndex();
            if (q >= K) {
                if (q === K) return 2 * Math.exp((q - (1 << this._scale)) / this._scaleFactor);
                throw new yl4.MappingError(`overflow: ${q} is > maximum lower boundary: ${K}`)
            }
            let _ = this._minNormalLowerBoundaryIndex();
            if (q <= _) {
                if (q === _) return KS6.MIN_VALUE;
                else if (q === _ - 1) return Math.exp((q + (1 << this._scale)) / this._scaleFactor) / 2;
                throw new yl4.MappingError(`overflow: ${q} is < minimum lower boundary: ${_}`)
            }
            return Math.exp(q * this._inverseFactor)
        }
        get scale() {
            return this._scale
        }
        _minNormalLowerBoundaryIndex() {
            return KS6.MIN_NORMAL_EXPONENT << this._scale
        }
        _maxNormalLowerBoundaryIndex() {
            return (KS6.MAX_NORMAL_EXPONENT + 1 << this._scale) - 1
        }
    }
    hl4.LogarithmMapping = Ll4
})
// @from(Ln 294988, Col 4)
ul4 = p((Il4) => {
    Object.defineProperty(Il4, "__esModule", {
        value: !0
    });
    Il4.getMapping = void 0;
    var aLz = Nl4(),
        sLz = Sl4(),
        tLz = nu8(),
        Cl4 = -10,
        bl4 = 20,
        eLz = Array.from({
            length: 31
        }, (q, K) => {
            if (K > 10) return new sLz.LogarithmMapping(K - 10);
            return new aLz.ExponentMapping(K - 10)
        });

    function qhz(q) {
        if (q > bl4 || q < Cl4) throw new tLz.MappingError(`expected scale >= ${Cl4} && <= ${bl4}, got: ${q}`);
        return eLz[q + 10]
    }
    Il4.getMapping = qhz
})
// @from(Ln 295011, Col 4)
Ul4 = p((Fl4) => {
    Object.defineProperty(Fl4, "__esModule", {
        value: !0
    });
    Fl4.ExponentialHistogramAggregator = Fl4.ExponentialHistogramAccumulation = void 0;
    var Khz = eR6(),
        E78 = f36(),
        _hz = $5(),
        ml4 = Xl4(),
        Bl4 = ul4(),
        zhz = lu8();
    class _S6 {
        low;
        high;
        static combine(q, K) {
            return new _S6(Math.min(q.low, K.low), Math.max(q.high, K.high))
        }
        constructor(q, K) {
            this.low = q, this.high = K
        }
    }
    var Yhz = 20,
        Ahz = 160,
        da1 = 2;
    class iu8 {
        startTime;
        _maxSize;
        _recordMinMax;
        _sum;
        _count;
        _zeroCount;
        _min;
        _max;
        _positive;
        _negative;
        _mapping;
        constructor(q, K = Ahz, _ = !0, z = 0, Y = 0, A = 0, O = Number.POSITIVE_INFINITY, w = Number.NEGATIVE_INFINITY, $ = new ml4.Buckets, j = new ml4.Buckets, H = (0, Bl4.getMapping)(Yhz)) {
            if (this.startTime = q, this._maxSize = K, this._recordMinMax = _, this._sum = z, this._count = Y, this._zeroCount = A, this._min = O, this._max = w, this._positive = $, this._negative = j, this._mapping = H, this._maxSize < da1) _hz.diag.warn(`Exponential Histogram Max Size set to ${this._maxSize},                 changing to the minimum size of: ${da1}`), this._maxSize = da1
        }
        record(q) {
            this.updateByIncrement(q, 1)
        }
        setStartTime(q) {
            this.startTime = q
        }
        toPointValue() {
            return {
                hasMinMax: this._recordMinMax,
                min: this.min,
                max: this.max,
                sum: this.sum,
                positive: {
                    offset: this.positive.offset,
                    bucketCounts: this.positive.counts()
                },
                negative: {
                    offset: this.negative.offset,
                    bucketCounts: this.negative.counts()
                },
                count: this.count,
                scale: this.scale,
                zeroCount: this.zeroCount
            }
        }
        get sum() {
            return this._sum
        }
        get min() {
            return this._min
        }
        get max() {
            return this._max
        }
        get count() {
            return this._count
        }
        get zeroCount() {
            return this._zeroCount
        }
        get scale() {
            if (this._count === this._zeroCount) return 0;
            return this._mapping.scale
        }
        get positive() {
            return this._positive
        }
        get negative() {
            return this._negative
        }
        updateByIncrement(q, K) {
            if (Number.isNaN(q)) return;
            if (q > this._max) this._max = q;
            if (q < this._min) this._min = q;
            if (this._count += K, q === 0) {
                this._zeroCount += K;
                return
            }
            if (this._sum += q * K, q > 0) this._updateBuckets(this._positive, q, K);
            else this._updateBuckets(this._negative, -q, K)
        }
        merge(q) {
            if (this._count === 0) this._min = q.min, this._max = q.max;
            else if (q.count !== 0) {
                if (q.min < this.min) this._min = q.min;
                if (q.max > this.max) this._max = q.max
            }
            this.startTime = q.startTime, this._sum += q.sum, this._count += q.count, this._zeroCount += q.zeroCount;
            let K = this._minScale(q);
            this._downscale(this.scale - K), this._mergeBuckets(this.positive, q, q.positive, K), this._mergeBuckets(this.negative, q, q.negative, K)
        }
        diff(q) {
            this._min = 1 / 0, this._max = -1 / 0, this._sum -= q.sum, this._count -= q.count, this._zeroCount -= q.zeroCount;
            let K = this._minScale(q);
            this._downscale(this.scale - K), this._diffBuckets(this.positive, q, q.positive, K), this._diffBuckets(this.negative, q, q.negative, K)
        }
        clone() {
            return new iu8(this.startTime, this._maxSize, this._recordMinMax, this._sum, this._count, this._zeroCount, this._min, this._max, this.positive.clone(), this.negative.clone(), this._mapping)
        }
        _updateBuckets(q, K, _) {
            let z = this._mapping.mapToIndex(K),
                Y = !1,
                A = 0,
                O = 0;
            if (q.length === 0) q.indexStart = z, q.indexEnd = q.indexStart, q.indexBase = q.indexStart;
            else if (z < q.indexStart && q.indexEnd - z >= this._maxSize) Y = !0, O = z, A = q.indexEnd;
            else if (z > q.indexEnd && z - q.indexStart >= this._maxSize) Y = !0, O = q.indexStart, A = z;
            if (Y) {
                let w = this._changeScale(A, O);
                this._downscale(w), z = this._mapping.mapToIndex(K)
            }
            this._incrementIndexBy(q, z, _)
        }
        _incrementIndexBy(q, K, _) {
            if (_ === 0) return;
            if (q.length === 0) q.indexStart = q.indexEnd = q.indexBase = K;
            if (K < q.indexStart) {
                let Y = q.indexEnd - K;
                if (Y >= q.backing.length) this._grow(q, Y + 1);
                q.indexStart = K
            } else if (K > q.indexEnd) {
                let Y = K - q.indexStart;
                if (Y >= q.backing.length) this._grow(q, Y + 1);
                q.indexEnd = K
            }
            let z = K - q.indexBase;
            if (z < 0) z += q.backing.length;
            q.incrementBucket(z, _)
        }
        _grow(q, K) {
            let _ = q.backing.length,
                z = q.indexBase - q.indexStart,
                Y = _ - z,
                A = (0, zhz.nextGreaterSquare)(K);
            if (A > this._maxSize) A = this._maxSize;
            let O = A - z;
            q.backing.growTo(A, Y, O)
        }
        _changeScale(q, K) {
            let _ = 0;
            while (q - K >= this._maxSize) q >>= 1, K >>= 1, _++;
            return _
        }
        _downscale(q) {
            if (q === 0) return;
            if (q < 0) throw Error(`impossible change of scale: ${this.scale}`);
            let K = this._mapping.scale - q;
            this._positive.downscale(q), this._negative.downscale(q), this._mapping = (0, Bl4.getMapping)(K)
        }
        _minScale(q) {
            let K = Math.min(this.scale, q.scale),
                _ = _S6.combine(this._highLowAtScale(this.positive, this.scale, K), this._highLowAtScale(q.positive, q.scale, K)),
                z = _S6.combine(this._highLowAtScale(this.negative, this.scale, K), this._highLowAtScale(q.negative, q.scale, K));
            return Math.min(K - this._changeScale(_.high, _.low), K - this._changeScale(z.high, z.low))
        }
        _highLowAtScale(q, K, _) {
            if (q.length === 0) return new _S6(0, -1);
            let z = K - _;
            return new _S6(q.indexStart >> z, q.indexEnd >> z)
        }
        _mergeBuckets(q, K, _, z) {
            let Y = _.offset,
                A = K.scale - z;
            for (let O = 0; O < _.length; O++) this._incrementIndexBy(q, Y + O >> A, _.at(O))
        }
        _diffBuckets(q, K, _, z) {
            let Y = _.offset,
                A = K.scale - z;
            for (let O = 0; O < _.length; O++) {
                let $ = (Y + O >> A) - q.indexBase;
                if ($ < 0) $ += q.backing.length;
                q.decrementBucket($, _.at(O))
            }
            q.trim()
        }
    }
    Fl4.ExponentialHistogramAccumulation = iu8;
    class pl4 {
        _maxSize;
        _recordMinMax;
        kind = Khz.AggregatorKind.EXPONENTIAL_HISTOGRAM;
        constructor(q, K) {
            this._maxSize = q, this._recordMinMax = K
        }
        createAccumulation(q) {
            return new iu8(q, this._maxSize, this._recordMinMax)
        }
        merge(q, K) {
            let _ = K.clone();
            return _.merge(q), _
        }
        diff(q, K) {
            let _ = K.clone();
            return _.diff(q), _
        }
        toMetricData(q, K, _, z) {
            return {
                descriptor: q,
                aggregationTemporality: K,
                dataPointType: E78.DataPointType.EXPONENTIAL_HISTOGRAM,
                dataPoints: _.map(([Y, A]) => {
                    let O = A.toPointValue(),
                        w = q.type === E78.InstrumentType.GAUGE || q.type === E78.InstrumentType.UP_DOWN_COUNTER || q.type === E78.InstrumentType.OBSERVABLE_GAUGE || q.type === E78.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
                    return {
                        attributes: Y,
                        startTime: A.startTime,
                        endTime: z,
                        value: {
                            min: O.hasMinMax ? O.min : void 0,
                            max: O.hasMinMax ? O.max : void 0,
                            sum: !w ? O.sum : void 0,
                            positive: {
                                offset: O.positive.offset,
                                bucketCounts: O.positive.bucketCounts
                            },
                            negative: {
                                offset: O.negative.offset,
                                bucketCounts: O.negative.bucketCounts
                            },
                            count: O.count,
                            scale: O.scale,
                            zeroCount: O.zeroCount
                        }
                    }
                })
            }
        }
    }
    Fl4.ExponentialHistogramAggregator = pl4
})
// @from(Ln 295260, Col 4)
ll4 = p((dl4) => {
    Object.defineProperty(dl4, "__esModule", {
        value: !0
    });
    dl4.LastValueAggregator = dl4.LastValueAccumulation = void 0;
    var whz = eR6(),
        y78 = t_(),
        $hz = f36();
    class L78 {
        startTime;
        _current;
        sampleTime;
        constructor(q, K = 0, _ = [0, 0]) {
            this.startTime = q, this._current = K, this.sampleTime = _
        }
        record(q) {
            this._current = q, this.sampleTime = (0, y78.millisToHrTime)(Date.now())
        }
        setStartTime(q) {
            this.startTime = q
        }
        toPointValue() {
            return this._current
        }
    }
    dl4.LastValueAccumulation = L78;
    class Ql4 {
        kind = whz.AggregatorKind.LAST_VALUE;
        createAccumulation(q) {
            return new L78(q)
        }
        merge(q, K) {
            let _ = (0, y78.hrTimeToMicroseconds)(K.sampleTime) >= (0, y78.hrTimeToMicroseconds)(q.sampleTime) ? K : q;
            return new L78(q.startTime, _.toPointValue(), _.sampleTime)
        }
        diff(q, K) {
            let _ = (0, y78.hrTimeToMicroseconds)(K.sampleTime) >= (0, y78.hrTimeToMicroseconds)(q.sampleTime) ? K : q;
            return new L78(K.startTime, _.toPointValue(), _.sampleTime)
        }
        toMetricData(q, K, _, z) {
            return {
                descriptor: q,
                aggregationTemporality: K,
                dataPointType: $hz.DataPointType.GAUGE,
                dataPoints: _.map(([Y, A]) => {
                    return {
                        attributes: Y,
                        startTime: A.startTime,
                        endTime: z,
                        value: A.toPointValue()
                    }
                })
            }
        }
    }
    dl4.LastValueAggregator = Ql4
})
// @from(Ln 295317, Col 4)
ol4 = p((il4) => {
    Object.defineProperty(il4, "__esModule", {
        value: !0
    });
    il4.SumAggregator = il4.SumAccumulation = void 0;
    var Hhz = eR6(),
        Jhz = f36();
    class CJ6 {
        startTime;
        monotonic;
        _current;
        reset;
        constructor(q, K, _ = 0, z = !1) {
            this.startTime = q, this.monotonic = K, this._current = _, this.reset = z
        }
        record(q) {
            if (this.monotonic && q < 0) return;
            this._current += q
        }
        setStartTime(q) {
            this.startTime = q
        }
        toPointValue() {
            return this._current
        }
    }
    il4.SumAccumulation = CJ6;
    class nl4 {
        monotonic;
        kind = Hhz.AggregatorKind.SUM;
        constructor(q) {
            this.monotonic = q
        }
        createAccumulation(q) {
            return new CJ6(q, this.monotonic)
        }
        merge(q, K) {
            let _ = q.toPointValue(),
                z = K.toPointValue();
            if (K.reset) return new CJ6(K.startTime, this.monotonic, z, K.reset);
            return new CJ6(q.startTime, this.monotonic, _ + z)
        }
        diff(q, K) {
            let _ = q.toPointValue(),
                z = K.toPointValue();
            if (this.monotonic && _ > z) return new CJ6(K.startTime, this.monotonic, z, !0);
            return new CJ6(K.startTime, this.monotonic, z - _)
        }
        toMetricData(q, K, _, z) {
            return {
                descriptor: q,
                aggregationTemporality: K,
                dataPointType: Jhz.DataPointType.SUM,
                dataPoints: _.map(([Y, A]) => {
                    return {
                        attributes: Y,
                        startTime: A.startTime,
                        endTime: z,
                        value: A.toPointValue()
                    }
                }),
                isMonotonic: this.monotonic
            }
        }
    }
    il4.SumAggregator = nl4
})
// @from(Ln 295384, Col 4)
qn4 = p((DF) => {
    Object.defineProperty(DF, "__esModule", {
        value: !0
    });
    DF.SumAggregator = DF.SumAccumulation = DF.LastValueAggregator = DF.LastValueAccumulation = DF.ExponentialHistogramAggregator = DF.ExponentialHistogramAccumulation = DF.HistogramAggregator = DF.HistogramAccumulation = DF.DropAggregator = void 0;
    var Mhz = Al4();
    Object.defineProperty(DF, "DropAggregator", {
        enumerable: !0,
        get: function() {
            return Mhz.DropAggregator
        }
    });
    var al4 = jl4();
    Object.defineProperty(DF, "HistogramAccumulation", {
        enumerable: !0,
        get: function() {
            return al4.HistogramAccumulation
        }
    });
    Object.defineProperty(DF, "HistogramAggregator", {
        enumerable: !0,
        get: function() {
            return al4.HistogramAggregator
        }
    });
    var sl4 = Ul4();
    Object.defineProperty(DF, "ExponentialHistogramAccumulation", {
        enumerable: !0,
        get: function() {
            return sl4.ExponentialHistogramAccumulation
        }
    });
    Object.defineProperty(DF, "ExponentialHistogramAggregator", {
        enumerable: !0,
        get: function() {
            return sl4.ExponentialHistogramAggregator
        }
    });
    var tl4 = ll4();
    Object.defineProperty(DF, "LastValueAccumulation", {
        enumerable: !0,
        get: function() {
            return tl4.LastValueAccumulation
        }
    });
    Object.defineProperty(DF, "LastValueAggregator", {
        enumerable: !0,
        get: function() {
            return tl4.LastValueAggregator
        }
    });
    var el4 = ol4();
    Object.defineProperty(DF, "SumAccumulation", {
        enumerable: !0,
        get: function() {
            return el4.SumAccumulation
        }
    });
    Object.defineProperty(DF, "SumAggregator", {
        enumerable: !0,
        get: function() {
            return el4.SumAggregator
        }
    })
})
// @from(Ln 295449, Col 4)
wn4 = p((Kn4) => {
    Object.defineProperty(Kn4, "__esModule", {
        value: !0
    });
    Kn4.DEFAULT_AGGREGATION = Kn4.EXPONENTIAL_HISTOGRAM_AGGREGATION = Kn4.HISTOGRAM_AGGREGATION = Kn4.LAST_VALUE_AGGREGATION = Kn4.SUM_AGGREGATION = Kn4.DROP_AGGREGATION = Kn4.DefaultAggregation = Kn4.ExponentialHistogramAggregation = Kn4.ExplicitBucketHistogramAggregation = Kn4.HistogramAggregation = Kn4.LastValueAggregation = Kn4.SumAggregation = Kn4.DropAggregation = void 0;
    var Whz = $5(),
        bJ6 = qn4(),
        _l = f36();
    class ru8 {
        static DEFAULT_INSTANCE = new bJ6.DropAggregator;
        createAggregator(q) {
            return ru8.DEFAULT_INSTANCE
        }
    }
    Kn4.DropAggregation = ru8;
    class h78 {
        static MONOTONIC_INSTANCE = new bJ6.SumAggregator(!0);
        static NON_MONOTONIC_INSTANCE = new bJ6.SumAggregator(!1);
        createAggregator(q) {
            switch (q.type) {
                case _l.InstrumentType.COUNTER:
                case _l.InstrumentType.OBSERVABLE_COUNTER:
                case _l.InstrumentType.HISTOGRAM:
                    return h78.MONOTONIC_INSTANCE;
                default:
                    return h78.NON_MONOTONIC_INSTANCE
            }
        }
    }
    Kn4.SumAggregation = h78;
    class ou8 {
        static DEFAULT_INSTANCE = new bJ6.LastValueAggregator;
        createAggregator(q) {
            return ou8.DEFAULT_INSTANCE
        }
    }
    Kn4.LastValueAggregation = ou8;
    class au8 {
        static DEFAULT_INSTANCE = new bJ6.HistogramAggregator([0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 1e4], !0);
        createAggregator(q) {
            return au8.DEFAULT_INSTANCE
        }
    }
    Kn4.HistogramAggregation = au8;
    class ca1 {
        _recordMinMax;
        _boundaries;
        constructor(q, K = !0) {
            if (this._recordMinMax = K, q == null) throw Error("ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array");
            q = q.concat(), q = q.sort((Y, A) => Y - A);
            let _ = q.lastIndexOf(-1 / 0),
                z = q.indexOf(1 / 0);
            if (z === -1) z = void 0;
            this._boundaries = q.slice(_ + 1, z)
        }
        createAggregator(q) {
            return new bJ6.HistogramAggregator(this._boundaries, this._recordMinMax)
        }
    }
    Kn4.ExplicitBucketHistogramAggregation = ca1;
    class la1 {
        _maxSize;
        _recordMinMax;
        constructor(q = 160, K = !0) {
            this._maxSize = q, this._recordMinMax = K
        }
        createAggregator(q) {
            return new bJ6.ExponentialHistogramAggregator(this._maxSize, this._recordMinMax)
        }
    }
    Kn4.ExponentialHistogramAggregation = la1;
    class na1 {
        _resolve(q) {
            switch (q.type) {
                case _l.InstrumentType.COUNTER:
                case _l.InstrumentType.UP_DOWN_COUNTER:
                case _l.InstrumentType.OBSERVABLE_COUNTER:
                case _l.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
                    return Kn4.SUM_AGGREGATION;
                case _l.InstrumentType.GAUGE:
                case _l.InstrumentType.OBSERVABLE_GAUGE:
                    return Kn4.LAST_VALUE_AGGREGATION;
                case _l.InstrumentType.HISTOGRAM: {
                    if (q.advice.explicitBucketBoundaries) return new ca1(q.advice.explicitBucketBoundaries);
                    return Kn4.HISTOGRAM_AGGREGATION
                }
            }
            return Whz.diag.warn(`Unable to recognize instrument type: ${q.type}`), Kn4.DROP_AGGREGATION
        }
        createAggregator(q) {
            return this._resolve(q).createAggregator(q)
        }
    }
    Kn4.DefaultAggregation = na1;
    Kn4.DROP_AGGREGATION = new ru8;
    Kn4.SUM_AGGREGATION = new h78;
    Kn4.LAST_VALUE_AGGREGATION = new ou8;
    Kn4.HISTOGRAM_AGGREGATION = new au8;
    Kn4.EXPONENTIAL_HISTOGRAM_AGGREGATION = new la1;
    Kn4.DEFAULT_AGGREGATION = new na1
})
// @from(Ln 295550, Col 4)
R78 = p((jn4) => {
    Object.defineProperty(jn4, "__esModule", {
        value: !0
    });
    jn4.toAggregation = jn4.AggregationType = void 0;
    var IJ6 = wn4(),
        xJ6;
    (function(q) {
        q[q.DEFAULT = 0] = "DEFAULT", q[q.DROP = 1] = "DROP", q[q.SUM = 2] = "SUM", q[q.LAST_VALUE = 3] = "LAST_VALUE", q[q.EXPLICIT_BUCKET_HISTOGRAM = 4] = "EXPLICIT_BUCKET_HISTOGRAM", q[q.EXPONENTIAL_HISTOGRAM = 5] = "EXPONENTIAL_HISTOGRAM"
    })(xJ6 = jn4.AggregationType || (jn4.AggregationType = {}));

    function Nhz(q) {
        switch (q.type) {
            case xJ6.DEFAULT:
                return IJ6.DEFAULT_AGGREGATION;
            case xJ6.DROP:
                return IJ6.DROP_AGGREGATION;
            case xJ6.SUM:
                return IJ6.SUM_AGGREGATION;
            case xJ6.LAST_VALUE:
                return IJ6.LAST_VALUE_AGGREGATION;
            case xJ6.EXPONENTIAL_HISTOGRAM: {
                let K = q;
                return new IJ6.ExponentialHistogramAggregation(K.options?.maxSize, K.options?.recordMinMax)
            }
            case xJ6.EXPLICIT_BUCKET_HISTOGRAM: {
                let K = q;
                if (K.options == null) return IJ6.HISTOGRAM_AGGREGATION;
                else return new IJ6.ExplicitBucketHistogramAggregation(K.options?.boundaries, K.options?.recordMinMax)
            }
            default:
                throw Error("Unsupported Aggregation")
        }
    }
    jn4.toAggregation = Nhz
})
// @from(Ln 295586, Col 4)
ia1 = p((Jn4) => {
    Object.defineProperty(Jn4, "__esModule", {
        value: !0
    });
    Jn4.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = Jn4.DEFAULT_AGGREGATION_SELECTOR = void 0;
    var Ehz = du8(),
        yhz = R78(),
        Lhz = (q) => {
            return {
                type: yhz.AggregationType.DEFAULT
            }
        };
    Jn4.DEFAULT_AGGREGATION_SELECTOR = Lhz;
    var hhz = (q) => Ehz.AggregationTemporality.CUMULATIVE;
    Jn4.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = hhz
})
// @from(Ln 295602, Col 4)
ra1 = p((Dn4) => {
    Object.defineProperty(Dn4, "__esModule", {
        value: !0
    });
    Dn4.MetricReader = void 0;
    var Mn4 = $5(),
        su8 = WF(),
        Pn4 = ia1();
    class Wn4 {
        _shutdown = !1;
        _metricProducers;
        _sdkMetricProducer;
        _aggregationTemporalitySelector;
        _aggregationSelector;
        _cardinalitySelector;
        constructor(q) {
            this._aggregationSelector = q?.aggregationSelector ?? Pn4.DEFAULT_AGGREGATION_SELECTOR, this._aggregationTemporalitySelector = q?.aggregationTemporalitySelector ?? Pn4.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR, this._metricProducers = q?.metricProducers ?? [], this._cardinalitySelector = q?.cardinalitySelector
        }
        setMetricProducer(q) {
            if (this._sdkMetricProducer) throw Error("MetricReader can not be bound to a MeterProvider again.");
            this._sdkMetricProducer = q, this.onInitialized()
        }
        selectAggregation(q) {
            return this._aggregationSelector(q)
        }
        selectAggregationTemporality(q) {
            return this._aggregationTemporalitySelector(q)
        }
        selectCardinalityLimit(q) {
            return this._cardinalitySelector ? this._cardinalitySelector(q) : 2000
        }
        onInitialized() {}
        async collect(q) {
            if (this._sdkMetricProducer === void 0) throw Error("MetricReader is not bound to a MetricProducer");
            if (this._shutdown) throw Error("MetricReader is shutdown");
            let [K, ..._] = await Promise.all([this._sdkMetricProducer.collect({
                timeoutMillis: q?.timeoutMillis
            }), ...this._metricProducers.map((O) => O.collect({
                timeoutMillis: q?.timeoutMillis
            }))]), z = K.errors.concat((0, su8.FlatMap)(_, (O) => O.errors)), Y = K.resourceMetrics.resource, A = K.resourceMetrics.scopeMetrics.concat((0, su8.FlatMap)(_, (O) => O.resourceMetrics.scopeMetrics));
            return {
                resourceMetrics: {
                    resource: Y,
                    scopeMetrics: A
                },
                errors: z
            }
        }
        async shutdown(q) {
            if (this._shutdown) {
                Mn4.diag.error("Cannot call shutdown twice.");
                return
            }
            if (q?.timeoutMillis == null) await this.onShutdown();
            else await (0, su8.callWithTimeout)(this.onShutdown(), q.timeoutMillis);
            this._shutdown = !0
        }
        async forceFlush(q) {
            if (this._shutdown) {
                Mn4.diag.warn("Cannot forceFlush on already shutdown MetricReader.");
                return
            }
            if (q?.timeoutMillis == null) {
                await this.onForceFlush();
                return
            }
            await (0, su8.callWithTimeout)(this.onForceFlush(), q.timeoutMillis)
        }
    }
    Dn4.MetricReader = Wn4
})
// @from(Ln 295673, Col 4)
Vn4 = p((vn4) => {
    Object.defineProperty(vn4, "__esModule", {
        value: !0
    });
    vn4.PeriodicExportingMetricReader = void 0;
    var oa1 = $5(),
        tu8 = t_(),
        Shz = ra1(),
        fn4 = WF();
    class Gn4 extends Shz.MetricReader {
        _interval;
        _exporter;
        _exportInterval;
        _exportTimeout;
        constructor(q) {
            super({
                aggregationSelector: q.exporter.selectAggregation?.bind(q.exporter),
                aggregationTemporalitySelector: q.exporter.selectAggregationTemporality?.bind(q.exporter),
                metricProducers: q.metricProducers
            });
            if (q.exportIntervalMillis !== void 0 && q.exportIntervalMillis <= 0) throw Error("exportIntervalMillis must be greater than 0");
            if (q.exportTimeoutMillis !== void 0 && q.exportTimeoutMillis <= 0) throw Error("exportTimeoutMillis must be greater than 0");
            if (q.exportTimeoutMillis !== void 0 && q.exportIntervalMillis !== void 0 && q.exportIntervalMillis < q.exportTimeoutMillis) throw Error("exportIntervalMillis must be greater than or equal to exportTimeoutMillis");
            this._exportInterval = q.exportIntervalMillis ?? 60000, this._exportTimeout = q.exportTimeoutMillis ?? 30000, this._exporter = q.exporter
        }
        async _runOnce() {
            try {
                await (0, fn4.callWithTimeout)(this._doRun(), this._exportTimeout)
            } catch (q) {
                if (q instanceof fn4.TimeoutError) {
                    oa1.diag.error("Export took longer than %s milliseconds and timed out.", this._exportTimeout);
                    return
                }(0, tu8.globalErrorHandler)(q)
            }
        }
        async _doRun() {
            let {
                resourceMetrics: q,
                errors: K
            } = await this.collect({
                timeoutMillis: this._exportTimeout
            });
            if (K.length > 0) oa1.diag.error("PeriodicExportingMetricReader: metrics collection errors", ...K);
            if (q.resource.asyncAttributesPending) try {
                await q.resource.waitForAsyncAttributes?.()
            } catch (z) {
                oa1.diag.debug("Error while resolving async portion of resource: ", z), (0, tu8.globalErrorHandler)(z)
            }
            if (q.scopeMetrics.length === 0) return;
            let _ = await tu8.internal._export(this._exporter, q);
            if (_.code !== tu8.ExportResultCode.SUCCESS) throw Error(`PeriodicExportingMetricReader: metrics export failed (error ${_.error})`)
        }
        onInitialized() {
            if (this._interval = setInterval(() => {
                    this._runOnce()
                }, this._exportInterval), typeof this._interval !== "number") this._interval.unref()
        }
        async onForceFlush() {
            await this._runOnce(), await this._exporter.forceFlush()
        }
        async onShutdown() {
            if (this._interval) clearInterval(this._interval);
            await this.onForceFlush(), await this._exporter.shutdown()
        }
    }
    vn4.PeriodicExportingMetricReader = Gn4
})
// @from(Ln 295740, Col 4)
Ln4 = p((En4) => {
    Object.defineProperty(En4, "__esModule", {
        value: !0
    });
    En4.InMemoryMetricExporter = void 0;
    var kn4 = t_();
    class Nn4 {
        _shutdown = !1;
        _aggregationTemporality;
        _metrics = [];
        constructor(q) {
            this._aggregationTemporality = q
        }
        export (q, K) {
            if (this._shutdown) {
                setTimeout(() => K({
                    code: kn4.ExportResultCode.FAILED
                }), 0);
                return
            }
            this._metrics.push(q), setTimeout(() => K({
                code: kn4.ExportResultCode.SUCCESS
            }), 0)
        }
        getMetrics() {
            return this._metrics
        }
        forceFlush() {
            return Promise.resolve()
        }
        reset() {
            this._metrics = []
        }
        selectAggregationTemporality(q) {
            return this._aggregationTemporality
        }
        shutdown() {
            return this._shutdown = !0, Promise.resolve()
        }
    }
    En4.InMemoryMetricExporter = Nn4
})
// @from(Ln 295782, Col 4)
Cn4 = p((Rn4) => {
    Object.defineProperty(Rn4, "__esModule", {
        value: !0
    });
    Rn4.ConsoleMetricExporter = void 0;
    var hn4 = t_(),
        Chz = ia1();
    class aa1 {
        _shutdown = !1;
        _temporalitySelector;
        constructor(q) {
            this._temporalitySelector = q?.temporalitySelector ?? Chz.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR
        }
        export (q, K) {
            if (this._shutdown) {
                setImmediate(K, {
                    code: hn4.ExportResultCode.FAILED
                });
                return
            }
            return aa1._sendMetrics(q, K)
        }
        forceFlush() {
            return Promise.resolve()
        }
        selectAggregationTemporality(q) {
            return this._temporalitySelector(q)
        }
        shutdown() {
            return this._shutdown = !0, Promise.resolve()
        }
        static _sendMetrics(q, K) {
            for (let _ of q.scopeMetrics)
                for (let z of _.metrics) console.dir({
                    descriptor: z.descriptor,
                    dataPointType: z.dataPointType,
                    dataPoints: z.dataPoints
                }, {
                    depth: null
                });
            K({
                code: hn4.ExportResultCode.SUCCESS
            })
        }
    }
    Rn4.ConsoleMetricExporter = aa1
})
// @from(Ln 295829, Col 4)
un4 = p((In4) => {
    Object.defineProperty(In4, "__esModule", {
        value: !0
    });
    In4.ViewRegistry = void 0;
    class bn4 {
        _registeredViews = [];
        addView(q) {
            this._registeredViews.push(q)
        }
        findViews(q, K) {
            return this._registeredViews.filter((z) => {
                return this._matchInstrument(z.instrumentSelector, q) && this._matchMeter(z.meterSelector, K)
            })
        }
        _matchInstrument(q, K) {
            return (q.getType() === void 0 || K.type === q.getType()) && q.getNameFilter().match(K.name) && q.getUnitFilter().match(K.unit)
        }
        _matchMeter(q, K) {
            return q.getNameFilter().match(K.name) && (K.version === void 0 || q.getVersionFilter().match(K.version)) && (K.schemaUrl === void 0 || q.getSchemaUrlFilter().match(K.schemaUrl))
        }
    }
    In4.ViewRegistry = bn4
})
// @from(Ln 295853, Col 4)
S78 = p((pn4) => {
    Object.defineProperty(pn4, "__esModule", {
        value: !0
    });
    pn4.isValidName = pn4.isDescriptorCompatibleWith = pn4.createInstrumentDescriptorWithView = pn4.createInstrumentDescriptor = void 0;
    var mn4 = $5(),
        bhz = WF();

    function Ihz(q, K, _) {
        if (!Bn4(q)) mn4.diag.warn(`Invalid metric name: "${q}". The metric name should be a ASCII string with a length no greater than 255 characters.`);
        return {
            name: q,
            type: K,
            description: _?.description ?? "",
            unit: _?.unit ?? "",
            valueType: _?.valueType ?? mn4.ValueType.DOUBLE,
            advice: _?.advice ?? {}
        }
    }
    pn4.createInstrumentDescriptor = Ihz;

    function xhz(q, K) {
        return {
            name: q.name ?? K.name,
            description: q.description ?? K.description,
            type: K.type,
            unit: K.unit,
            valueType: K.valueType,
            advice: K.advice
        }
    }
    pn4.createInstrumentDescriptorWithView = xhz;

    function uhz(q, K) {
        return (0, bhz.equalsCaseInsensitive)(q.name, K.name) && q.unit === K.unit && q.type === K.type && q.valueType === K.valueType
    }
    pn4.isDescriptorCompatibleWith = uhz;
    var mhz = /^[a-z][a-z0-9_.\-/]{0,254}$/i;

    function Bn4(q) {
        return q.match(mhz) != null
    }
    pn4.isValidName = Bn4
})
// @from(Ln 295897, Col 4)
eu8 = p((in4) => {
    Object.defineProperty(in4, "__esModule", {
        value: !0
    });
    in4.isObservableInstrument = in4.ObservableUpDownCounterInstrument = in4.ObservableGaugeInstrument = in4.ObservableCounterInstrument = in4.ObservableInstrument = in4.HistogramInstrument = in4.GaugeInstrument = in4.CounterInstrument = in4.UpDownCounterInstrument = in4.SyncInstrument = void 0;
    var zS6 = $5(),
        ghz = t_();
    class YS6 {
        _writableMetricStorage;
        _descriptor;
        constructor(q, K) {
            this._writableMetricStorage = q, this._descriptor = K
        }
        _record(q, K = {}, _ = zS6.context.active()) {
            if (typeof q !== "number") {
                zS6.diag.warn(`non-number value provided to metric ${this._descriptor.name}: ${q}`);
                return
            }
            if (this._descriptor.valueType === zS6.ValueType.INT && !Number.isInteger(q)) {
                if (zS6.diag.warn(`INT value type cannot accept a floating-point value for ${this._descriptor.name}, ignoring the fractional digits.`), q = Math.trunc(q), !Number.isInteger(q)) return
            }
            this._writableMetricStorage.record(q, K, _, (0, ghz.millisToHrTime)(Date.now()))
        }
    }
    in4.SyncInstrument = YS6;
    class gn4 extends YS6 {
        add(q, K, _) {
            this._record(q, K, _)
        }
    }
    in4.UpDownCounterInstrument = gn4;
    class Un4 extends YS6 {
        add(q, K, _) {
            if (q < 0) {
                zS6.diag.warn(`negative value provided to counter ${this._descriptor.name}: ${q}`);
                return
            }
            this._record(q, K, _)
        }
    }
    in4.CounterInstrument = Un4;
    class Qn4 extends YS6 {
        record(q, K, _) {
            this._record(q, K, _)
        }
    }
    in4.GaugeInstrument = Qn4;
    class dn4 extends YS6 {
        record(q, K, _) {
            if (q < 0) {
                zS6.diag.warn(`negative value provided to histogram ${this._descriptor.name}: ${q}`);
                return
            }
            this._record(q, K, _)
        }
    }
    in4.HistogramInstrument = dn4;
    class AS6 {
        _observableRegistry;
        _metricStorages;
        _descriptor;
        constructor(q, K, _) {
            this._observableRegistry = _, this._descriptor = q, this._metricStorages = K
        }
        addCallback(q) {
            this._observableRegistry.addCallback(q, this)
        }
        removeCallback(q) {
            this._observableRegistry.removeCallback(q, this)
        }
    }
    in4.ObservableInstrument = AS6;
    class cn4 extends AS6 {}
    in4.ObservableCounterInstrument = cn4;
    class ln4 extends AS6 {}
    in4.ObservableGaugeInstrument = ln4;
    class nn4 extends AS6 {}
    in4.ObservableUpDownCounterInstrument = nn4;

    function Uhz(q) {
        return q instanceof AS6
    }
    in4.isObservableInstrument = Uhz
})
// @from(Ln 295981, Col 4)
tn4 = p((an4) => {
    Object.defineProperty(an4, "__esModule", {
        value: !0
    });
    an4.Meter = void 0;
    var uJ6 = S78(),
        mJ6 = eu8(),
        BJ6 = f36();
    class on4 {
        _meterSharedState;
        constructor(q) {
            this._meterSharedState = q
        }
        createGauge(q, K) {
            let _ = (0, uJ6.createInstrumentDescriptor)(q, BJ6.InstrumentType.GAUGE, K),
                z = this._meterSharedState.registerMetricStorage(_);
            return new mJ6.GaugeInstrument(z, _)
        }
        createHistogram(q, K) {
            let _ = (0, uJ6.createInstrumentDescriptor)(q, BJ6.InstrumentType.HISTOGRAM, K),
                z = this._meterSharedState.registerMetricStorage(_);
            return new mJ6.HistogramInstrument(z, _)
        }
        createCounter(q, K) {
            let _ = (0, uJ6.createInstrumentDescriptor)(q, BJ6.InstrumentType.COUNTER, K),
                z = this._meterSharedState.registerMetricStorage(_);
            return new mJ6.CounterInstrument(z, _)
        }
        createUpDownCounter(q, K) {
            let _ = (0, uJ6.createInstrumentDescriptor)(q, BJ6.InstrumentType.UP_DOWN_COUNTER, K),
                z = this._meterSharedState.registerMetricStorage(_);
            return new mJ6.UpDownCounterInstrument(z, _)
        }
        createObservableGauge(q, K) {
            let _ = (0, uJ6.createInstrumentDescriptor)(q, BJ6.InstrumentType.OBSERVABLE_GAUGE, K),
                z = this._meterSharedState.registerAsyncMetricStorage(_);
            return new mJ6.ObservableGaugeInstrument(_, z, this._meterSharedState.observableRegistry)
        }
        createObservableCounter(q, K) {
            let _ = (0, uJ6.createInstrumentDescriptor)(q, BJ6.InstrumentType.OBSERVABLE_COUNTER, K),
                z = this._meterSharedState.registerAsyncMetricStorage(_);
            return new mJ6.ObservableCounterInstrument(_, z, this._meterSharedState.observableRegistry)
        }
        createObservableUpDownCounter(q, K) {
            let _ = (0, uJ6.createInstrumentDescriptor)(q, BJ6.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER, K),
                z = this._meterSharedState.registerAsyncMetricStorage(_);
            return new mJ6.ObservableUpDownCounterInstrument(_, z, this._meterSharedState.observableRegistry)
        }
        addBatchObservableCallback(q, K) {
            this._meterSharedState.observableRegistry.addBatchCallback(q, K)
        }
        removeBatchObservableCallback(q, K) {
            this._meterSharedState.observableRegistry.removeBatchCallback(q, K)
        }
    }
    an4.Meter = on4
})
// @from(Ln 296038, Col 4)
sa1 = p((qi4) => {
    Object.defineProperty(qi4, "__esModule", {
        value: !0
    });
    qi4.MetricStorage = void 0;
    var shz = S78();
    class en4 {
        _instrumentDescriptor;
        constructor(q) {
            this._instrumentDescriptor = q
        }
        getInstrumentDescriptor() {
            return this._instrumentDescriptor
        }
        updateDescription(q) {
            this._instrumentDescriptor = (0, shz.createInstrumentDescriptor)(this._instrumentDescriptor.name, this._instrumentDescriptor.type, {
                description: q,
                valueType: this._instrumentDescriptor.valueType,
                unit: this._instrumentDescriptor.unit,
                advice: this._instrumentDescriptor.advice
            })
        }
    }
    qi4.MetricStorage = en4
})
// @from(Ln 296063, Col 4)
C78 = p((zi4) => {
    Object.defineProperty(zi4, "__esModule", {
        value: !0
    });
    zi4.AttributeHashMap = zi4.HashMap = void 0;
    var thz = WF();
    class ta1 {
        _hash;
        _valueMap = new Map;
        _keyMap = new Map;
        constructor(q) {
            this._hash = q
        }
        get(q, K) {
            return K ??= this._hash(q), this._valueMap.get(K)
        }
        getOrDefault(q, K) {
            let _ = this._hash(q);
            if (this._valueMap.has(_)) return this._valueMap.get(_);
            let z = K();
            if (!this._keyMap.has(_)) this._keyMap.set(_, q);
            return this._valueMap.set(_, z), z
        }
        set(q, K, _) {
            if (_ ??= this._hash(q), !this._keyMap.has(_)) this._keyMap.set(_, q);
            this._valueMap.set(_, K)
        }
        has(q, K) {
            return K ??= this._hash(q), this._valueMap.has(K)
        }* keys() {
            let q = this._keyMap.entries(),
                K = q.next();
            while (K.done !== !0) yield [K.value[1], K.value[0]], K = q.next()
        }* entries() {
            let q = this._valueMap.entries(),
                K = q.next();
            while (K.done !== !0) yield [this._keyMap.get(K.value[0]), K.value[1], K.value[0]], K = q.next()
        }
        get size() {
            return this._valueMap.size
        }
    }
    zi4.HashMap = ta1;
    class _i4 extends ta1 {
        constructor() {
            super(thz.hashAttributes)
        }
    }
    zi4.AttributeHashMap = _i4
})
// @from(Ln 296113, Col 4)
qs1 = p((Oi4) => {
    Object.defineProperty(Oi4, "__esModule", {
        value: !0
    });
    Oi4.DeltaMetricProcessor = void 0;
    var qRz = WF(),
        ea1 = C78();
    class Ai4 {
        _aggregator;
        _activeCollectionStorage = new ea1.AttributeHashMap;
        _cumulativeMemoStorage = new ea1.AttributeHashMap;
        _cardinalityLimit;
        _overflowAttributes = {
            "otel.metric.overflow": !0
        };
        _overflowHashCode;
        constructor(q, K) {
            this._aggregator = q, this._cardinalityLimit = (K ?? 2000) - 1, this._overflowHashCode = (0, qRz.hashAttributes)(this._overflowAttributes)
        }
        record(q, K, _, z) {
            let Y = this._activeCollectionStorage.get(K);
            if (!Y) {
                if (this._activeCollectionStorage.size >= this._cardinalityLimit) {
                    this._activeCollectionStorage.getOrDefault(this._overflowAttributes, () => this._aggregator.createAccumulation(z))?.record(q);
                    return
                }
                Y = this._aggregator.createAccumulation(z), this._activeCollectionStorage.set(K, Y)
            }
            Y?.record(q)
        }
        batchCumulate(q, K) {
            Array.from(q.entries()).forEach(([_, z, Y]) => {
                let A = this._aggregator.createAccumulation(K);
                A?.record(z);
                let O = A;
                if (this._cumulativeMemoStorage.has(_, Y)) {
                    let w = this._cumulativeMemoStorage.get(_, Y);
                    O = this._aggregator.diff(w, A)
                } else if (this._cumulativeMemoStorage.size >= this._cardinalityLimit) {
                    if (_ = this._overflowAttributes, Y = this._overflowHashCode, this._cumulativeMemoStorage.has(_, Y)) {
                        let w = this._cumulativeMemoStorage.get(_, Y);
                        O = this._aggregator.diff(w, A)
                    }
                }
                if (this._activeCollectionStorage.has(_, Y)) {
                    let w = this._activeCollectionStorage.get(_, Y);
                    O = this._aggregator.merge(w, O)
                }
                this._cumulativeMemoStorage.set(_, A, Y), this._activeCollectionStorage.set(_, O, Y)
            })
        }
        collect() {
            let q = this._activeCollectionStorage;
            return this._activeCollectionStorage = new ea1.AttributeHashMap, q
        }
    }
    Oi4.DeltaMetricProcessor = Ai4
})
// @from(Ln 296171, Col 4)
Ks1 = p(($i4) => {
    Object.defineProperty($i4, "__esModule", {
        value: !0
    });
    $i4.TemporalMetricProcessor = void 0;
    var KRz = du8(),
        _Rz = C78();
    class b78 {
        _aggregator;
        _unreportedAccumulations = new Map;
        _reportHistory = new Map;
        constructor(q, K) {
            this._aggregator = q, K.forEach((_) => {
                this._unreportedAccumulations.set(_, [])
            })
        }
        buildMetrics(q, K, _, z) {
            this._stashAccumulations(_);
            let Y = this._getMergedUnreportedAccumulations(q),
                A = Y,
                O;
            if (this._reportHistory.has(q)) {
                let $ = this._reportHistory.get(q),
                    j = $.collectionTime;
                if (O = $.aggregationTemporality, O === KRz.AggregationTemporality.CUMULATIVE) A = b78.merge($.accumulations, Y, this._aggregator);
                else A = b78.calibrateStartTime($.accumulations, Y, j)
            } else O = q.selectAggregationTemporality(K.type);
            this._reportHistory.set(q, {
                accumulations: A,
                collectionTime: z,
                aggregationTemporality: O
            });
            let w = zRz(A);
            if (w.length === 0) return;
            return this._aggregator.toMetricData(K, O, w, z)
        }
        _stashAccumulations(q) {
            let K = this._unreportedAccumulations.keys();
            for (let _ of K) {
                let z = this._unreportedAccumulations.get(_);
                if (z === void 0) z = [], this._unreportedAccumulations.set(_, z);
                z.push(q)
            }
        }
        _getMergedUnreportedAccumulations(q) {
            let K = new _Rz.AttributeHashMap,
                _ = this._unreportedAccumulations.get(q);
            if (this._unreportedAccumulations.set(q, []), _ === void 0) return K;
            for (let z of _) K = b78.merge(K, z, this._aggregator);
            return K
        }
        static merge(q, K, _) {
            let z = q,
                Y = K.entries(),
                A = Y.next();
            while (A.done !== !0) {
                let [O, w, $] = A.value;
                if (q.has(O, $)) {
                    let j = q.get(O, $),
                        H = _.merge(j, w);
                    z.set(O, H, $)
                } else z.set(O, w, $);
                A = Y.next()
            }
            return z
        }
        static calibrateStartTime(q, K, _) {
            for (let [z, Y] of q.keys()) K.get(z, Y)?.setStartTime(_);
            return K
        }
    }
    $i4.TemporalMetricProcessor = b78;

    function zRz(q) {
        return Array.from(q.entries())
    }
})
// @from(Ln 296248, Col 4)
Mi4 = p((Ji4) => {
    Object.defineProperty(Ji4, "__esModule", {
        value: !0
    });
    Ji4.AsyncMetricStorage = void 0;
    var YRz = sa1(),
        ARz = qs1(),
        ORz = Ks1(),
        wRz = C78();
    class Hi4 extends YRz.MetricStorage {
        _attributesProcessor;
        _aggregationCardinalityLimit;
        _deltaMetricStorage;
        _temporalMetricStorage;
        constructor(q, K, _, z, Y) {
            super(q);
            this._attributesProcessor = _, this._aggregationCardinalityLimit = Y, this._deltaMetricStorage = new ARz.DeltaMetricProcessor(K, this._aggregationCardinalityLimit), this._temporalMetricStorage = new ORz.TemporalMetricProcessor(K, z)
        }
        record(q, K) {
            let _ = new wRz.AttributeHashMap;
            Array.from(q.entries()).forEach(([z, Y]) => {
                _.set(this._attributesProcessor.process(z), Y)
            }), this._deltaMetricStorage.batchCumulate(_, K)
        }
        collect(q, K) {
            let _ = this._deltaMetricStorage.collect();
            return this._temporalMetricStorage.buildMetrics(q, this._instrumentDescriptor, _, K)
        }
    }
    Ji4.AsyncMetricStorage = Hi4
})
// @from(Ln 296279, Col 4)
vi4 = p((fi4) => {
    Object.defineProperty(fi4, "__esModule", {
        value: !0
    });
    fi4.getConflictResolutionRecipe = fi4.getDescriptionResolutionRecipe = fi4.getTypeConflictResolutionRecipe = fi4.getUnitConflictResolutionRecipe = fi4.getValueTypeConflictResolutionRecipe = fi4.getIncompatibilityDetails = void 0;

    function $Rz(q, K) {
        let _ = "";
        if (q.unit !== K.unit) _ += `	- Unit '${q.unit}' does not match '${K.unit}'
`;
        if (q.type !== K.type) _ += `	- Type '${q.type}' does not match '${K.type}'
`;
        if (q.valueType !== K.valueType) _ += `	- Value Type '${q.valueType}' does not match '${K.valueType}'
`;
        if (q.description !== K.description) _ += `	- Description '${q.description}' does not match '${K.description}'
`;
        return _
    }
    fi4.getIncompatibilityDetails = $Rz;

    function Pi4(q, K) {
        return `	- use valueType '${q.valueType}' on instrument creation or use an instrument name other than '${K.name}'`
    }
    fi4.getValueTypeConflictResolutionRecipe = Pi4;

    function Wi4(q, K) {
        return `	- use unit '${q.unit}' on instrument creation or use an instrument name other than '${K.name}'`
    }
    fi4.getUnitConflictResolutionRecipe = Wi4;

    function Di4(q, K) {
        let _ = {
                name: K.name,
                type: K.type,
                unit: K.unit
            },
            z = JSON.stringify(_);
        return `	- create a new view with a name other than '${q.name}' and InstrumentSelector '${z}'`
    }
    fi4.getTypeConflictResolutionRecipe = Di4;

    function Zi4(q, K) {
        let _ = {
                name: K.name,
                type: K.type,
                unit: K.unit
            },
            z = JSON.stringify(_);
        return `	- create a new view with a name other than '${q.name}' and InstrumentSelector '${z}'
    	- OR - create a new view with the name ${q.name} and description '${q.description}' and InstrumentSelector ${z}
    	- OR - create a new view with the name ${K.name} and description '${q.description}' and InstrumentSelector ${z}`
    }
    fi4.getDescriptionResolutionRecipe = Zi4;

    function jRz(q, K) {
        if (q.valueType !== K.valueType) return Pi4(q, K);
        if (q.unit !== K.unit) return Wi4(q, K);
        if (q.type !== K.type) return Di4(q, K);
        if (q.description !== K.description) return Zi4(q, K);
        return ""
    }
    fi4.getConflictResolutionRecipe = jRz
})
// @from(Ln 296342, Col 4)
Ni4 = p((Vi4) => {
    Object.defineProperty(Vi4, "__esModule", {
        value: !0
    });
    Vi4.MetricStorageRegistry = void 0;
    var WRz = S78(),
        Ti4 = $5(),
        qm8 = vi4();
    class _s1 {
        _sharedRegistry = new Map;
        _perCollectorRegistry = new Map;
        static create() {
            return new _s1
        }
        getStorages(q) {
            let K = [];
            for (let z of this._sharedRegistry.values()) K = K.concat(z);
            let _ = this._perCollectorRegistry.get(q);
            if (_ != null)
                for (let z of _.values()) K = K.concat(z);
            return K
        }
        register(q) {
            this._registerStorage(q, this._sharedRegistry)
        }
        registerForCollector(q, K) {
            let _ = this._perCollectorRegistry.get(q);
            if (_ == null) _ = new Map, this._perCollectorRegistry.set(q, _);
            this._registerStorage(K, _)
        }
        findOrUpdateCompatibleStorage(q) {
            let K = this._sharedRegistry.get(q.name);
            if (K === void 0) return null;
            return this._findOrUpdateCompatibleStorage(q, K)
        }
        findOrUpdateCompatibleCollectorStorage(q, K) {
            let _ = this._perCollectorRegistry.get(q);
            if (_ === void 0) return null;
            let z = _.get(K.name);
            if (z === void 0) return null;
            return this._findOrUpdateCompatibleStorage(K, z)
        }
        _registerStorage(q, K) {
            let _ = q.getInstrumentDescriptor(),
                z = K.get(_.name);
            if (z === void 0) {
                K.set(_.name, [q]);
                return
            }
            z.push(q)
        }
        _findOrUpdateCompatibleStorage(q, K) {
            let _ = null;
            for (let z of K) {
                let Y = z.getInstrumentDescriptor();
                if ((0, WRz.isDescriptorCompatibleWith)(Y, q)) {
                    if (Y.description !== q.description) {
                        if (q.description.length > Y.description.length) z.updateDescription(q.description);
                        Ti4.diag.warn("A view or instrument with the name ", q.name, ` has already been registered, but has a different description and is incompatible with another registered view.
`, `Details:
`, (0, qm8.getIncompatibilityDetails)(Y, q), `The longer description will be used.
To resolve the conflict:`, (0, qm8.getConflictResolutionRecipe)(Y, q))
                    }
                    _ = z
                } else Ti4.diag.warn("A view or instrument with the name ", q.name, ` has already been registered and is incompatible with another registered view.
`, `Details:
`, (0, qm8.getIncompatibilityDetails)(Y, q), `To resolve the conflict:
`, (0, qm8.getConflictResolutionRecipe)(Y, q))
            }
            return _
        }
    }
    Vi4.MetricStorageRegistry = _s1
})
// @from(Ln 296416, Col 4)
hi4 = p((yi4) => {
    Object.defineProperty(yi4, "__esModule", {
        value: !0
    });
    yi4.MultiMetricStorage = void 0;
    class Ei4 {
        _backingStorages;
        constructor(q) {
            this._backingStorages = q
        }
        record(q, K, _, z) {
            this._backingStorages.forEach((Y) => {
                Y.record(q, K, _, z)
            })
        }
    }
    yi4.MultiMetricStorage = Ei4
})
// @from(Ln 296434, Col 4)
xi4 = p((bi4) => {
    Object.defineProperty(bi4, "__esModule", {
        value: !0
    });
    bi4.BatchObservableResultImpl = bi4.ObservableResultImpl = void 0;
    var OS6 = $5(),
        Ri4 = C78(),
        DRz = eu8();
    class Si4 {
        _instrumentName;
        _valueType;
        _buffer = new Ri4.AttributeHashMap;
        constructor(q, K) {
            this._instrumentName = q, this._valueType = K
        }
        observe(q, K = {}) {
            if (typeof q !== "number") {
                OS6.diag.warn(`non-number value provided to metric ${this._instrumentName}: ${q}`);
                return
            }
            if (this._valueType === OS6.ValueType.INT && !Number.isInteger(q)) {
                if (OS6.diag.warn(`INT value type cannot accept a floating-point value for ${this._instrumentName}, ignoring the fractional digits.`), q = Math.trunc(q), !Number.isInteger(q)) return
            }
            this._buffer.set(K, q)
        }
    }
    bi4.ObservableResultImpl = Si4;
    class Ci4 {
        _buffer = new Map;
        observe(q, K, _ = {}) {
            if (!(0, DRz.isObservableInstrument)(q)) return;
            let z = this._buffer.get(q);
            if (z == null) z = new Ri4.AttributeHashMap, this._buffer.set(q, z);
            if (typeof K !== "number") {
                OS6.diag.warn(`non-number value provided to metric ${q._descriptor.name}: ${K}`);
                return
            }
            if (q._descriptor.valueType === OS6.ValueType.INT && !Number.isInteger(K)) {
                if (OS6.diag.warn(`INT value type cannot accept a floating-point value for ${q._descriptor.name}, ignoring the fractional digits.`), K = Math.trunc(K), !Number.isInteger(K)) return
            }
            z.set(_, K)
        }
    }
    bi4.BatchObservableResultImpl = Ci4
})
// @from(Ln 296479, Col 4)
gi4 = p((pi4) => {
    Object.defineProperty(pi4, "__esModule", {
        value: !0
    });
    pi4.ObservableRegistry = void 0;
    var fRz = $5(),
        ui4 = eu8(),
        mi4 = xi4(),
        I78 = WF();
    class Bi4 {
        _callbacks = [];
        _batchCallbacks = [];
        addCallback(q, K) {
            if (this._findCallback(q, K) >= 0) return;
            this._callbacks.push({
                callback: q,
                instrument: K
            })
        }
        removeCallback(q, K) {
            let _ = this._findCallback(q, K);
            if (_ < 0) return;
            this._callbacks.splice(_, 1)
        }
        addBatchCallback(q, K) {
            let _ = new Set(K.filter(ui4.isObservableInstrument));
            if (_.size === 0) {
                fRz.diag.error("BatchObservableCallback is not associated with valid instruments", K);
                return
            }
            if (this._findBatchCallback(q, _) >= 0) return;
            this._batchCallbacks.push({
                callback: q,
                instruments: _
            })
        }
        removeBatchCallback(q, K) {
            let _ = new Set(K.filter(ui4.isObservableInstrument)),
                z = this._findBatchCallback(q, _);
            if (z < 0) return;
            this._batchCallbacks.splice(z, 1)
        }
        async observe(q, K) {
            let _ = this._observeCallbacks(q, K),
                z = this._observeBatchCallbacks(q, K);
            return (await (0, I78.PromiseAllSettled)([..._, ...z])).filter(I78.isPromiseAllSettledRejectionResult).map((O) => O.reason)
        }
        _observeCallbacks(q, K) {
            return this._callbacks.map(async ({
                callback: _,
                instrument: z
            }) => {
                let Y = new mi4.ObservableResultImpl(z._descriptor.name, z._descriptor.valueType),
                    A = Promise.resolve(_(Y));
                if (K != null) A = (0, I78.callWithTimeout)(A, K);
                await A, z._metricStorages.forEach((O) => {
                    O.record(Y._buffer, q)
                })
            })
        }
        _observeBatchCallbacks(q, K) {
            return this._batchCallbacks.map(async ({
                callback: _,
                instruments: z
            }) => {
                let Y = new mi4.BatchObservableResultImpl,
                    A = Promise.resolve(_(Y));
                if (K != null) A = (0, I78.callWithTimeout)(A, K);
                await A, z.forEach((O) => {
                    let w = Y._buffer.get(O);
                    if (w == null) return;
                    O._metricStorages.forEach(($) => {
                        $.record(w, q)
                    })
                })
            })
        }
        _findCallback(q, K) {
            return this._callbacks.findIndex((_) => {
                return _.callback === q && _.instrument === K
            })
        }
        _findBatchCallback(q, K) {
            return this._batchCallbacks.findIndex((_) => {
                return _.callback === q && (0, I78.setEquals)(_.instruments, K)
            })
        }
    }
    pi4.ObservableRegistry = Bi4
})
// @from(Ln 296569, Col 4)
ci4 = p((Qi4) => {
    Object.defineProperty(Qi4, "__esModule", {
        value: !0
    });
    Qi4.SyncMetricStorage = void 0;
    var GRz = sa1(),
        vRz = qs1(),
        TRz = Ks1();
    class Ui4 extends GRz.MetricStorage {
        _attributesProcessor;
        _aggregationCardinalityLimit;
        _deltaMetricStorage;
        _temporalMetricStorage;
        constructor(q, K, _, z, Y) {
            super(q);
            this._attributesProcessor = _, this._aggregationCardinalityLimit = Y, this._deltaMetricStorage = new vRz.DeltaMetricProcessor(K, this._aggregationCardinalityLimit), this._temporalMetricStorage = new TRz.TemporalMetricProcessor(K, z)
        }
        record(q, K, _, z) {
            K = this._attributesProcessor.process(K, _), this._deltaMetricStorage.record(q, K, _, z)
        }
        collect(q, K) {
            let _ = this._deltaMetricStorage.collect();
            return this._temporalMetricStorage.buildMetrics(q, this._instrumentDescriptor, _, K)
        }
    }
    Qi4.SyncMetricStorage = Ui4
})
// @from(Ln 296596, Col 4)
Km8 = p((oi4) => {
    Object.defineProperty(oi4, "__esModule", {
        value: !0
    });
    oi4.createDenyListAttributesProcessor = oi4.createAllowListAttributesProcessor = oi4.createMultiAttributesProcessor = oi4.createNoopAttributesProcessor = void 0;
    class li4 {
        process(q, K) {
            return q
        }
    }
    class ni4 {
        _processors;
        constructor(q) {
            this._processors = q
        }
        process(q, K) {
            let _ = q;
            for (let z of this._processors) _ = z.process(_, K);
            return _
        }
    }
    class ii4 {
        _allowedAttributeNames;
        constructor(q) {
            this._allowedAttributeNames = q
        }
        process(q, K) {
            let _ = {};
            return Object.keys(q).filter((z) => this._allowedAttributeNames.includes(z)).forEach((z) => _[z] = q[z]), _
        }
    }
    class ri4 {
        _deniedAttributeNames;
        constructor(q) {
            this._deniedAttributeNames = q
        }
        process(q, K) {
            let _ = {};
            return Object.keys(q).filter((z) => !this._deniedAttributeNames.includes(z)).forEach((z) => _[z] = q[z]), _
        }
    }

    function VRz() {
        return yRz
    }
    oi4.createNoopAttributesProcessor = VRz;

    function kRz(q) {
        return new ni4(q)
    }
    oi4.createMultiAttributesProcessor = kRz;

    function NRz(q) {
        return new ii4(q)
    }
    oi4.createAllowListAttributesProcessor = NRz;

    function ERz(q) {
        return new ri4(q)
    }
    oi4.createDenyListAttributesProcessor = ERz;
    var yRz = new li4
})
// @from(Ln 296659, Col 4)
qr4 = p((ti4) => {
    Object.defineProperty(ti4, "__esModule", {
        value: !0
    });
    ti4.MeterSharedState = void 0;
    var SRz = S78(),
        CRz = tn4(),
        bRz = WF(),
        IRz = Mi4(),
        xRz = Ni4(),
        uRz = hi4(),
        mRz = gi4(),
        BRz = ci4(),
        pRz = Km8();
    class si4 {
        _meterProviderSharedState;
        _instrumentationScope;
        metricStorageRegistry = new xRz.MetricStorageRegistry;
        observableRegistry = new mRz.ObservableRegistry;
        meter;
        constructor(q, K) {
            this._meterProviderSharedState = q, this._instrumentationScope = K, this.meter = new CRz.Meter(this)
        }
        registerMetricStorage(q) {
            let K = this._registerMetricStorage(q, BRz.SyncMetricStorage);
            if (K.length === 1) return K[0];
            return new uRz.MultiMetricStorage(K)
        }
        registerAsyncMetricStorage(q) {
            return this._registerMetricStorage(q, IRz.AsyncMetricStorage)
        }
        async collect(q, K, _) {
            let z = await this.observableRegistry.observe(K, _?.timeoutMillis),
                Y = this.metricStorageRegistry.getStorages(q);
            if (Y.length === 0) return null;
            let A = Y.map((O) => {
                return O.collect(q, K)
            }).filter(bRz.isNotNullish);
            if (A.length === 0) return {
                errors: z
            };
            return {
                scopeMetrics: {
                    scope: this._instrumentationScope,
                    metrics: A
                },
                errors: z
            }
        }
        _registerMetricStorage(q, K) {
            let z = this._meterProviderSharedState.viewRegistry.findViews(q, this._instrumentationScope).map((Y) => {
                let A = (0, SRz.createInstrumentDescriptorWithView)(Y, q),
                    O = this.metricStorageRegistry.findOrUpdateCompatibleStorage(A);
                if (O != null) return O;
                let w = Y.aggregation.createAggregator(A),
                    $ = new K(A, w, Y.attributesProcessor, this._meterProviderSharedState.metricCollectors, Y.aggregationCardinalityLimit);
                return this.metricStorageRegistry.register($), $
            });
            if (z.length === 0) {
                let A = this._meterProviderSharedState.selectAggregations(q.type).map(([O, w]) => {
                    let $ = this.metricStorageRegistry.findOrUpdateCompatibleCollectorStorage(O, q);
                    if ($ != null) return $;
                    let j = w.createAggregator(q),
                        H = O.selectCardinalityLimit(q.type),
                        J = new K(q, j, (0, pRz.createNoopAttributesProcessor)(), [O], H);
                    return this.metricStorageRegistry.registerForCollector(O, J), J
                });
                z = z.concat(A)
            }
            return z
        }
    }
    ti4.MeterSharedState = si4
})
// @from(Ln 296733, Col 4)
Yr4 = p((_r4) => {
    Object.defineProperty(_r4, "__esModule", {
        value: !0
    });
    _r4.MeterProviderSharedState = void 0;
    var FRz = WF(),
        gRz = un4(),
        URz = qr4(),
        QRz = R78();
    class Kr4 {
        resource;
        viewRegistry = new gRz.ViewRegistry;
        metricCollectors = [];
        meterSharedStates = new Map;
        constructor(q) {
            this.resource = q
        }
        getMeterSharedState(q) {
            let K = (0, FRz.instrumentationScopeId)(q),
                _ = this.meterSharedStates.get(K);
            if (_ == null) _ = new URz.MeterSharedState(this, q), this.meterSharedStates.set(K, _);
            return _
        }
        selectAggregations(q) {
            let K = [];
            for (let _ of this.metricCollectors) K.push([_, (0, QRz.toAggregation)(_.selectAggregation(q))]);
            return K
        }
    }
    _r4.MeterProviderSharedState = Kr4
})
// @from(Ln 296764, Col 4)
$r4 = p((Or4) => {
    Object.defineProperty(Or4, "__esModule", {
        value: !0
    });
    Or4.MetricCollector = void 0;
    var dRz = t_();
    class Ar4 {
        _sharedState;
        _metricReader;
        constructor(q, K) {
            this._sharedState = q, this._metricReader = K
        }
        async collect(q) {
            let K = (0, dRz.millisToHrTime)(Date.now()),
                _ = [],
                z = [],
                Y = Array.from(this._sharedState.meterSharedStates.values()).map(async (A) => {
                    let O = await A.collect(this, K, q);
                    if (O?.scopeMetrics != null) _.push(O.scopeMetrics);
                    if (O?.errors != null) z.push(...O.errors)
                });
            return await Promise.all(Y), {
                resourceMetrics: {
                    resource: this._sharedState.resource,
                    scopeMetrics: _
                },
                errors: z
            }
        }
        async forceFlush(q) {
            await this._metricReader.forceFlush(q)
        }
        async shutdown(q) {
            await this._metricReader.shutdown(q)
        }
        selectAggregationTemporality(q) {
            return this._metricReader.selectAggregationTemporality(q)
        }
        selectAggregation(q) {
            return this._metricReader.selectAggregation(q)
        }
        selectCardinalityLimit(q) {
            return this._metricReader.selectCardinalityLimit?.(q) ?? 2000
        }
    }
    Or4.MetricCollector = Ar4
})
// @from(Ln 296811, Col 4)
_m8 = p((Hr4) => {
    Object.defineProperty(Hr4, "__esModule", {
        value: !0
    });
    Hr4.ExactPredicate = Hr4.PatternPredicate = void 0;
    var cRz = /[\^$\\.+?()[\]{}|]/g;
    class zs1 {
        _matchAll;
        _regexp;
        constructor(q) {
            if (q === "*") this._matchAll = !0, this._regexp = /.*/;
            else this._matchAll = !1, this._regexp = new RegExp(zs1.escapePattern(q))
        }
        match(q) {
            if (this._matchAll) return !0;
            return this._regexp.test(q)
        }
        static escapePattern(q) {
            return `^${q.replace(cRz,"\\$&").replace("*",".*")}$`
        }
        static hasWildcard(q) {
            return q.includes("*")
        }
    }
    Hr4.PatternPredicate = zs1;
    class jr4 {
        _matchAll;
        _pattern;
        constructor(q) {
            this._matchAll = q === void 0, this._pattern = q
        }
        match(q) {
            if (this._matchAll) return !0;
            if (q === this._pattern) return !0;
            return !1
        }
    }
    Hr4.ExactPredicate = jr4
})
// @from(Ln 296850, Col 4)
Dr4 = p((Pr4) => {
    Object.defineProperty(Pr4, "__esModule", {
        value: !0
    });
    Pr4.InstrumentSelector = void 0;
    var Xr4 = _m8();
    class Mr4 {
        _nameFilter;
        _type;
        _unitFilter;
        constructor(q) {
            this._nameFilter = new Xr4.PatternPredicate(q?.name ?? "*"), this._type = q?.type, this._unitFilter = new Xr4.ExactPredicate(q?.unit)
        }
        getType() {
            return this._type
        }
        getNameFilter() {
            return this._nameFilter
        }
        getUnitFilter() {
            return this._unitFilter
        }
    }
    Pr4.InstrumentSelector = Mr4
})
// @from(Ln 296875, Col 4)
vr4 = p((fr4) => {
    Object.defineProperty(fr4, "__esModule", {
        value: !0
    });
    fr4.MeterSelector = void 0;
    var Ys1 = _m8();
    class Zr4 {
        _nameFilter;
        _versionFilter;
        _schemaUrlFilter;
        constructor(q) {
            this._nameFilter = new Ys1.ExactPredicate(q?.name), this._versionFilter = new Ys1.ExactPredicate(q?.version), this._schemaUrlFilter = new Ys1.ExactPredicate(q?.schemaUrl)
        }
        getNameFilter() {
            return this._nameFilter
        }
        getVersionFilter() {
            return this._versionFilter
        }
        getSchemaUrlFilter() {
            return this._schemaUrlFilter
        }
    }
    fr4.MeterSelector = Zr4
})
// @from(Ln 296900, Col 4)
yr4 = p((Nr4) => {
    Object.defineProperty(Nr4, "__esModule", {
        value: !0
    });
    Nr4.View = void 0;
    var nRz = _m8(),
        Tr4 = Km8(),
        iRz = Dr4(),
        rRz = vr4(),
        Vr4 = R78();

    function oRz(q) {
        return q.instrumentName == null && q.instrumentType == null && q.instrumentUnit == null && q.meterName == null && q.meterVersion == null && q.meterSchemaUrl == null
    }

    function aRz(q) {
        if (oRz(q)) throw Error("Cannot create view with no selector arguments supplied");
        if (q.name != null && (q?.instrumentName == null || nRz.PatternPredicate.hasWildcard(q.instrumentName))) throw Error("Views with a specified name must be declared with an instrument selector that selects at most one instrument per meter.")
    }
    class kr4 {
        name;
        description;
        aggregation;
        attributesProcessor;
        instrumentSelector;
        meterSelector;
        aggregationCardinalityLimit;
        constructor(q) {
            if (aRz(q), q.attributesProcessors != null) this.attributesProcessor = (0, Tr4.createMultiAttributesProcessor)(q.attributesProcessors);
            else this.attributesProcessor = (0, Tr4.createNoopAttributesProcessor)();
            this.name = q.name, this.description = q.description, this.aggregation = (0, Vr4.toAggregation)(q.aggregation ?? {
                type: Vr4.AggregationType.DEFAULT
            }), this.instrumentSelector = new iRz.InstrumentSelector({
                name: q.instrumentName,
                type: q.instrumentType,
                unit: q.instrumentUnit
            }), this.meterSelector = new rRz.MeterSelector({
                name: q.meterName,
                version: q.meterVersion,
                schemaUrl: q.meterSchemaUrl
            }), this.aggregationCardinalityLimit = q.aggregationCardinalityLimit
        }
    }
    Nr4.View = kr4
})
// @from(Ln 296945, Col 4)
Sr4 = p((hr4) => {
    Object.defineProperty(hr4, "__esModule", {
        value: !0
    });
    hr4.MeterProvider = void 0;
    var zm8 = $5(),
        sRz = Bk6(),
        tRz = Yr4(),
        eRz = $r4(),
        qSz = yr4();
    class Lr4 {
        _sharedState;
        _shutdown = !1;
        constructor(q) {
            if (this._sharedState = new tRz.MeterProviderSharedState(q?.resource ?? (0, sRz.defaultResource)()), q?.views != null && q.views.length > 0)
                for (let K of q.views) this._sharedState.viewRegistry.addView(new qSz.View(K));
            if (q?.readers != null && q.readers.length > 0)
                for (let K of q.readers) {
                    let _ = new eRz.MetricCollector(this._sharedState, K);
                    K.setMetricProducer(_), this._sharedState.metricCollectors.push(_)
                }
        }
        getMeter(q, K = "", _ = {}) {
            if (this._shutdown) return zm8.diag.warn("A shutdown MeterProvider cannot provide a Meter"), (0, zm8.createNoopMeter)();
            return this._sharedState.getMeterSharedState({
                name: q,
                version: K,
                schemaUrl: _.schemaUrl
            }).meter
        }
        async shutdown(q) {
            if (this._shutdown) {
                zm8.diag.warn("shutdown may only be called once per MeterProvider");
                return
            }
            this._shutdown = !0, await Promise.all(this._sharedState.metricCollectors.map((K) => {
                return K.shutdown(q)
            }))
        }
        async forceFlush(q) {
            if (this._shutdown) {
                zm8.diag.warn("invalid attempt to force flush after MeterProvider shutdown");
                return
            }
            await Promise.all(this._sharedState.metricCollectors.map((K) => {
                return K.forceFlush(q)
            }))
        }
    }
    hr4.MeterProvider = Lr4
})
// @from(Ln 296996, Col 4)
pJ6 = p((hy) => {
    Object.defineProperty(hy, "__esModule", {
        value: !0
    });
    hy.TimeoutError = hy.createDenyListAttributesProcessor = hy.createAllowListAttributesProcessor = hy.AggregationType = hy.MeterProvider = hy.ConsoleMetricExporter = hy.InMemoryMetricExporter = hy.PeriodicExportingMetricReader = hy.MetricReader = hy.InstrumentType = hy.DataPointType = hy.AggregationTemporality = void 0;
    var KSz = du8();
    Object.defineProperty(hy, "AggregationTemporality", {
        enumerable: !0,
        get: function() {
            return KSz.AggregationTemporality
        }
    });
    var Cr4 = f36();
    Object.defineProperty(hy, "DataPointType", {
        enumerable: !0,
        get: function() {
            return Cr4.DataPointType
        }
    });
    Object.defineProperty(hy, "InstrumentType", {
        enumerable: !0,
        get: function() {
            return Cr4.InstrumentType
        }
    });
    var _Sz = ra1();
    Object.defineProperty(hy, "MetricReader", {
        enumerable: !0,
        get: function() {
            return _Sz.MetricReader
        }
    });
    var zSz = Vn4();
    Object.defineProperty(hy, "PeriodicExportingMetricReader", {
        enumerable: !0,
        get: function() {
            return zSz.PeriodicExportingMetricReader
        }
    });
    var YSz = Ln4();
    Object.defineProperty(hy, "InMemoryMetricExporter", {
        enumerable: !0,
        get: function() {
            return YSz.InMemoryMetricExporter
        }
    });
    var ASz = Cn4();
    Object.defineProperty(hy, "ConsoleMetricExporter", {
        enumerable: !0,
        get: function() {
            return ASz.ConsoleMetricExporter
        }
    });
    var OSz = Sr4();
    Object.defineProperty(hy, "MeterProvider", {
        enumerable: !0,
        get: function() {
            return OSz.MeterProvider
        }
    });
    var wSz = R78();
    Object.defineProperty(hy, "AggregationType", {
        enumerable: !0,
        get: function() {
            return wSz.AggregationType
        }
    });
    var br4 = Km8();
    Object.defineProperty(hy, "createAllowListAttributesProcessor", {
        enumerable: !0,
        get: function() {
            return br4.createAllowListAttributesProcessor
        }
    });
    Object.defineProperty(hy, "createDenyListAttributesProcessor", {
        enumerable: !0,
        get: function() {
            return br4.createDenyListAttributesProcessor
        }
    });
    var $Sz = WF();
    Object.defineProperty(hy, "TimeoutError", {
        enumerable: !0,
        get: function() {
            return $Sz.TimeoutError
        }
    })
})
// @from(Ln 297084, Col 4)
ur4 = p((Ir4) => {
    Object.defineProperty(Ir4, "__esModule", {
        value: !0
    });
    Ir4.ExceptionEventName = void 0;
    Ir4.ExceptionEventName = "exception"
})