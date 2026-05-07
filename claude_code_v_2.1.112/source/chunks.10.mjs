
// @from(Ln 25401, Col 0)
function k$8(q, K) {
    return new y31({
        type: "pipe",
        in: q,
        out: K
    })
}
// @from(Ln 25409, Col 0)
function nN7(q) {
    return new lN7({
        type: "readonly",
        innerType: q
    })
}
// @from(Ln 25416, Col 0)
function _y5(q, K) {
    return new iN7({
        type: "template_literal",
        parts: q,
        ...K4.normalizeParams(K)
    })
}
// @from(Ln 25424, Col 0)
function oN7(q) {
    return new rN7({
        type: "lazy",
        getter: q
    })
}
// @from(Ln 25431, Col 0)
function zy5(q) {
    return new aN7({
        type: "promise",
        innerType: q
    })
}
// @from(Ln 25438, Col 0)
function sN7(q, K) {
    let _ = new aH({
        check: "custom",
        ...K4.normalizeParams(K)
    });
    return _._zod.check = q, _
}
// @from(Ln 25446, Col 0)
function L31(q, K) {
    return x51(R$8, q ?? (() => !0), K)
}
// @from(Ln 25450, Col 0)
function tN7(q, K = {}) {
    return u51(R$8, q, K)
}
// @from(Ln 25454, Col 0)
function eN7(q, K) {
    let _ = sN7((z) => {
        return z.addIssue = (Y) => {
            if (typeof Y === "string") z.issues.push(K4.issue(Y, z.value, _._zod.def));
            else {
                let A = Y;
                if (A.fatal) A.continue = !1;
                A.code ?? (A.code = "custom"), A.input ?? (A.input = z.value), A.inst ?? (A.inst = _), A.continue ?? (A.continue = !_._zod.def.abort), z.issues.push(K4.issue(A))
            }
        }, q(z.value, z)
    }, K);
    return _
}
// @from(Ln 25468, Col 0)
function Yy5(q, K = {
    error: `Input not instance of ${q.name}`
}) {
    let _ = new R$8({
        type: "custom",
        check: "custom",
        fn: (z) => z instanceof q,
        abort: !0,
        ...K4.normalizeParams(K)
    });
    return _._zod.bag.Class = q, _
}
// @from(Ln 25481, Col 0)
function Oy5(q) {
    let K = oN7(() => {
        return dw([O1(q), GY(), Xw(), N$8(), _4(K), cw(O1(), K)])
    });
    return K
}
// @from(Ln 25488, Col 0)
function S$8(q, K) {
    return k$8(k31(q), K)
}
// @from(Ln 25491, Col 4)
a_
// @from(Ln 25491, Col 8)
e51
// @from(Ln 25491, Col 13)
Xg6
// @from(Ln 25491, Col 18)
W$
// @from(Ln 25491, Col 22)
q31
// @from(Ln 25491, Col 27)
T$8
// @from(Ln 25491, Col 32)
Yr
// @from(Ln 25491, Col 36)
K31
// @from(Ln 25491, Col 41)
z31
// @from(Ln 25491, Col 46)
Y31
// @from(Ln 25491, Col 51)
A31
// @from(Ln 25491, Col 56)
O31
// @from(Ln 25491, Col 61)
w31
// @from(Ln 25491, Col 66)
$31
// @from(Ln 25491, Col 71)
j31
// @from(Ln 25491, Col 76)
H31
// @from(Ln 25491, Col 81)
J31
// @from(Ln 25491, Col 86)
X31
// @from(Ln 25491, Col 91)
M31
// @from(Ln 25491, Col 96)
P31
// @from(Ln 25491, Col 101)
W31
// @from(Ln 25491, Col 106)
D31
// @from(Ln 25491, Col 111)
Z31
// @from(Ln 25491, Col 116)
GN7
// @from(Ln 25491, Col 121)
Mg6
// @from(Ln 25491, Col 126)
mZ6
// @from(Ln 25491, Col 131)
Pg6
// @from(Ln 25491, Col 136)
Wg6
// @from(Ln 25491, Col 141)
f31
// @from(Ln 25491, Col 146)
vN7
// @from(Ln 25491, Col 151)
TN7
// @from(Ln 25491, Col 156)
VN7
// @from(Ln 25491, Col 161)
kN7
// @from(Ln 25491, Col 166)
NN7
// @from(Ln 25491, Col 171)
EN7
// @from(Ln 25491, Col 176)
yN7
// @from(Ln 25491, Col 181)
y$8
// @from(Ln 25491, Col 186)
LN7
// @from(Ln 25491, Col 191)
L$8
// @from(Ln 25491, Col 196)
v31
// @from(Ln 25491, Col 201)
hN7
// @from(Ln 25491, Col 206)
RN7
// @from(Ln 25491, Col 211)
SN7
// @from(Ln 25491, Col 216)
T31
// @from(Ln 25491, Col 221)
CN7
// @from(Ln 25491, Col 226)
bN7
// @from(Ln 25491, Col 231)
Jg6
// @from(Ln 25491, Col 236)
IN7
// @from(Ln 25491, Col 241)
xN7
// @from(Ln 25491, Col 246)
V31
// @from(Ln 25491, Col 251)
N31
// @from(Ln 25491, Col 256)
uN7
// @from(Ln 25491, Col 261)
mN7
// @from(Ln 25491, Col 266)
pN7
// @from(Ln 25491, Col 271)
E31
// @from(Ln 25491, Col 276)
UN7
// @from(Ln 25491, Col 281)
QN7
// @from(Ln 25491, Col 286)
cN7
// @from(Ln 25491, Col 291)
y31
// @from(Ln 25491, Col 296)
lN7
// @from(Ln 25491, Col 301)
iN7
// @from(Ln 25491, Col 306)
rN7
// @from(Ln 25491, Col 311)
aN7
// @from(Ln 25491, Col 316)
R$8
// @from(Ln 25491, Col 321)
Ay5 = (...q) => m51({
    Pipe: y31,
    Boolean: Pg6,
    String: Xg6,
    Transform: V31
}, ...q)
// @from(Ln 25497, Col 4)
v$8 = L(() => {
    WV();
    WV();
    U51();
    G$8();
    s51();
    a_ = b1("ZodType", (q, K) => {
        return O9.init(q, K), q.def = K, Object.defineProperty(q, "_def", {
            value: K
        }), q.check = (..._) => {
            return q.clone({
                ...K,
                checks: [...K.checks ?? [], ..._.map((z) => typeof z === "function" ? {
                    _zod: {
                        check: z,
                        def: {
                            check: "custom"
                        },
                        onattach: []
                    }
                } : z)]
            })
        }, q.clone = (_, z) => Oh(q, _, z), q.brand = () => q, q.register = (_, z) => {
            return _.add(q, z), q
        }, q.parse = (_, z) => i51(q, _, z, {
            callee: q.parse
        }), q.safeParse = (_, z) => o51(q, _, z), q.parseAsync = async (_, z) => r51(q, _, z, {
            callee: q.parseAsync
        }), q.safeParseAsync = async (_, z) => a51(q, _, z), q.spa = q.safeParseAsync, q.refine = (_, z) => q.check(tN7(_, z)), q.superRefine = (_) => q.check(eN7(_)), q.overwrite = (_) => q.check(_r(_)), q.optional = () => D$(q), q.nullable = () => V$8(q), q.nullish = () => D$(V$8(q)), q.nonoptional = (_) => gN7(q, _), q.array = () => _4(q), q.or = (_) => dw([q, _]), q.and = (_) => Dg6(q, _), q.transform = (_) => k$8(q, k31(_)), q.default = (_) => BN7(q, _), q.prefault = (_) => FN7(q, _), q.catch = (_) => dN7(q, _), q.pipe = (_) => k$8(q, _), q.readonly = () => nN7(q), q.describe = (_) => {
            let z = q.clone();
            return KU.add(z, {
                description: _
            }), z
        }, Object.defineProperty(q, "description", {
            get() {
                return KU.get(q)?.description
            },
            configurable: !0
        }), q.meta = (..._) => {
            if (_.length === 0) return KU.get(q);
            let z = q.clone();
            return KU.add(z, _[0]), z
        }, q.isOptional = () => q.safeParse(void 0).success, q.isNullable = () => q.safeParse(null).success, q
    }), e51 = b1("_ZodString", (q, K) => {
        lY6.init(q, K), a_.init(q, K);
        let _ = q._zod.bag;
        q.format = _.format ?? null, q.minLength = _.minimum ?? null, q.maxLength = _.maximum ?? null, q.regex = (...z) => q.check(tF6(...z)), q.includes = (...z) => q.check(Kg6(...z)), q.startsWith = (...z) => q.check(_g6(...z)), q.endsWith = (...z) => q.check(zg6(...z)), q.min = (...z) => q.check(e86(...z)), q.max = (...z) => q.check(CZ6(...z)), q.length = (...z) => q.check(bZ6(...z)), q.nonempty = (...z) => q.check(e86(1, ...z)), q.lowercase = (z) => q.check(eF6(z)), q.uppercase = (z) => q.check(qg6(z)), q.trim = () => q.check(Og6()), q.normalize = (...z) => q.check(Ag6(...z)), q.toLowerCase = () => q.check(wg6()), q.toUpperCase = () => q.check($g6())
    }), Xg6 = b1("ZodString", (q, K) => {
        lY6.init(q, K), e51.init(q, K), q.email = (_) => q.check(i28(q31, _)), q.url = (_) => q.check(t28(K31, _)), q.jwt = (_) => q.check(M$8(Z31, _)), q.emoji = (_) => q.check(e28(z31, _)), q.guid = (_) => q.check(aF6(T$8, _)), q.uuid = (_) => q.check(r28(Yr, _)), q.uuidv4 = (_) => q.check(o28(Yr, _)), q.uuidv6 = (_) => q.check(a28(Yr, _)), q.uuidv7 = (_) => q.check(s28(Yr, _)), q.nanoid = (_) => q.check(q$8(Y31, _)), q.guid = (_) => q.check(aF6(T$8, _)), q.cuid = (_) => q.check(K$8(A31, _)), q.cuid2 = (_) => q.check(_$8(O31, _)), q.ulid = (_) => q.check(z$8(w31, _)), q.base64 = (_) => q.check(H$8(P31, _)), q.base64url = (_) => q.check(J$8(W31, _)), q.xid = (_) => q.check(Y$8($31, _)), q.ksuid = (_) => q.check(A$8(j31, _)), q.ipv4 = (_) => q.check(O$8(H31, _)), q.ipv6 = (_) => q.check(w$8(J31, _)), q.cidrv4 = (_) => q.check($$8(X31, _)), q.cidrv6 = (_) => q.check(j$8(M31, _)), q.e164 = (_) => q.check(X$8(D31, _)), q.datetime = (_) => q.check(Q51(_)), q.date = (_) => q.check(d51(_)), q.time = (_) => q.check(c51(_)), q.duration = (_) => q.check(l51(_))
    });
    W$ = b1("ZodStringFormat", (q, K) => {
        E2.init(q, K), e51.init(q, K)
    }), q31 = b1("ZodEmail", (q, K) => {
        H41.init(q, K), W$.init(q, K)
    });
    T$8 = b1("ZodGUID", (q, K) => {
        $41.init(q, K), W$.init(q, K)
    });
    Yr = b1("ZodUUID", (q, K) => {
        j41.init(q, K), W$.init(q, K)
    });
    K31 = b1("ZodURL", (q, K) => {
        J41.init(q, K), W$.init(q, K)
    });
    z31 = b1("ZodEmoji", (q, K) => {
        X41.init(q, K), W$.init(q, K)
    });
    Y31 = b1("ZodNanoID", (q, K) => {
        M41.init(q, K), W$.init(q, K)
    });
    A31 = b1("ZodCUID", (q, K) => {
        P41.init(q, K), W$.init(q, K)
    });
    O31 = b1("ZodCUID2", (q, K) => {
        W41.init(q, K), W$.init(q, K)
    });
    w31 = b1("ZodULID", (q, K) => {
        D41.init(q, K), W$.init(q, K)
    });
    $31 = b1("ZodXID", (q, K) => {
        Z41.init(q, K), W$.init(q, K)
    });
    j31 = b1("ZodKSUID", (q, K) => {
        f41.init(q, K), W$.init(q, K)
    });
    H31 = b1("ZodIPv4", (q, K) => {
        k41.init(q, K), W$.init(q, K)
    });
    J31 = b1("ZodIPv6", (q, K) => {
        N41.init(q, K), W$.init(q, K)
    });
    X31 = b1("ZodCIDRv4", (q, K) => {
        E41.init(q, K), W$.init(q, K)
    });
    M31 = b1("ZodCIDRv6", (q, K) => {
        y41.init(q, K), W$.init(q, K)
    });
    P31 = b1("ZodBase64", (q, K) => {
        h41.init(q, K), W$.init(q, K)
    });
    W31 = b1("ZodBase64URL", (q, K) => {
        R41.init(q, K), W$.init(q, K)
    });
    D31 = b1("ZodE164", (q, K) => {
        S41.init(q, K), W$.init(q, K)
    });
    Z31 = b1("ZodJWT", (q, K) => {
        C41.init(q, K), W$.init(q, K)
    });
    GN7 = b1("ZodCustomStringFormat", (q, K) => {
        b41.init(q, K), W$.init(q, K)
    });
    Mg6 = b1("ZodNumber", (q, K) => {
        Q28.init(q, K), a_.init(q, K), q.gt = (z, Y) => q.check(Kr(z, Y)), q.gte = (z, Y) => q.check(FN(z, Y)), q.min = (z, Y) => q.check(FN(z, Y)), q.lt = (z, Y) => q.check(qr(z, Y)), q.lte = (z, Y) => q.check(xC(z, Y)), q.max = (z, Y) => q.check(xC(z, Y)), q.int = (z) => q.check(t51(z)), q.safe = (z) => q.check(t51(z)), q.positive = (z) => q.check(Kr(0, z)), q.nonnegative = (z) => q.check(FN(0, z)), q.negative = (z) => q.check(qr(0, z)), q.nonpositive = (z) => q.check(xC(0, z)), q.multipleOf = (z, Y) => q.check(iY6(z, Y)), q.step = (z, Y) => q.check(iY6(z, Y)), q.finite = () => q;
        let _ = q._zod.bag;
        q.minValue = Math.max(_.minimum ?? Number.NEGATIVE_INFINITY, _.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, q.maxValue = Math.min(_.maximum ?? Number.POSITIVE_INFINITY, _.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, q.isInt = (_.format ?? "").includes("int") || Number.isSafeInteger(_.multipleOf ?? 0.5), q.isFinite = !0, q.format = _.format ?? null
    });
    mZ6 = b1("ZodNumberFormat", (q, K) => {
        I41.init(q, K), Mg6.init(q, K)
    });
    Pg6 = b1("ZodBoolean", (q, K) => {
        dF6.init(q, K), a_.init(q, K)
    });
    Wg6 = b1("ZodBigInt", (q, K) => {
        d28.init(q, K), a_.init(q, K), q.gte = (z, Y) => q.check(FN(z, Y)), q.min = (z, Y) => q.check(FN(z, Y)), q.gt = (z, Y) => q.check(Kr(z, Y)), q.gte = (z, Y) => q.check(FN(z, Y)), q.min = (z, Y) => q.check(FN(z, Y)), q.lt = (z, Y) => q.check(qr(z, Y)), q.lte = (z, Y) => q.check(xC(z, Y)), q.max = (z, Y) => q.check(xC(z, Y)), q.positive = (z) => q.check(Kr(BigInt(0), z)), q.negative = (z) => q.check(qr(BigInt(0), z)), q.nonpositive = (z) => q.check(xC(BigInt(0), z)), q.nonnegative = (z) => q.check(FN(BigInt(0), z)), q.multipleOf = (z, Y) => q.check(iY6(z, Y));
        let _ = q._zod.bag;
        q.minValue = _.minimum ?? null, q.maxValue = _.maximum ?? null, q.format = _.format ?? null
    });
    f31 = b1("ZodBigIntFormat", (q, K) => {
        x41.init(q, K), Wg6.init(q, K)
    });
    vN7 = b1("ZodSymbol", (q, K) => {
        u41.init(q, K), a_.init(q, K)
    });
    TN7 = b1("ZodUndefined", (q, K) => {
        m41.init(q, K), a_.init(q, K)
    });
    VN7 = b1("ZodNull", (q, K) => {
        B41.init(q, K), a_.init(q, K)
    });
    kN7 = b1("ZodAny", (q, K) => {
        p41.init(q, K), a_.init(q, K)
    });
    NN7 = b1("ZodUnknown", (q, K) => {
        LZ6.init(q, K), a_.init(q, K)
    });
    EN7 = b1("ZodNever", (q, K) => {
        F41.init(q, K), a_.init(q, K)
    });
    yN7 = b1("ZodVoid", (q, K) => {
        g41.init(q, K), a_.init(q, K)
    });
    y$8 = b1("ZodDate", (q, K) => {
        U41.init(q, K), a_.init(q, K), q.min = (z, Y) => q.check(FN(z, Y)), q.max = (z, Y) => q.check(xC(z, Y));
        let _ = q._zod.bag;
        q.minDate = _.minimum ? new Date(_.minimum) : null, q.maxDate = _.maximum ? new Date(_.maximum) : null
    });
    LN7 = b1("ZodArray", (q, K) => {
        cF6.init(q, K), a_.init(q, K), q.element = K.element, q.min = (_, z) => q.check(e86(_, z)), q.nonempty = (_) => q.check(e86(1, _)), q.max = (_, z) => q.check(CZ6(_, z)), q.length = (_, z) => q.check(bZ6(_, z)), q.unwrap = () => q.element
    });
    L$8 = b1("ZodObject", (q, K) => {
        Q41.init(q, K), a_.init(q, K), K4.defineLazy(q, "shape", () => K.shape), q.keyof = () => ZV(Object.keys(q._zod.def.shape)), q.catchall = (_) => q.clone({
            ...q._zod.def,
            catchall: _
        }), q.passthrough = () => q.clone({
            ...q._zod.def,
            catchall: Kj()
        }), q.loose = () => q.clone({
            ...q._zod.def,
            catchall: Kj()
        }), q.strict = () => q.clone({
            ...q._zod.def,
            catchall: E$8()
        }), q.strip = () => q.clone({
            ...q._zod.def,
            catchall: void 0
        }), q.extend = (_) => {
            return K4.extend(q, _)
        }, q.merge = (_) => K4.merge(q, _), q.pick = (_) => K4.pick(q, _), q.omit = (_) => K4.omit(q, _), q.partial = (..._) => K4.partial(N31, q, _[0]), q.required = (..._) => K4.required(E31, q, _[0])
    });
    v31 = b1("ZodUnion", (q, K) => {
        c28.init(q, K), a_.init(q, K), q.options = K.options
    });
    hN7 = b1("ZodDiscriminatedUnion", (q, K) => {
        v31.init(q, K), d41.init(q, K)
    });
    RN7 = b1("ZodIntersection", (q, K) => {
        c41.init(q, K), a_.init(q, K)
    });
    SN7 = b1("ZodTuple", (q, K) => {
        nY6.init(q, K), a_.init(q, K), q.rest = (_) => q.clone({
            ...q._zod.def,
            rest: _
        })
    });
    T31 = b1("ZodRecord", (q, K) => {
        l41.init(q, K), a_.init(q, K), q.keyType = K.keyType, q.valueType = K.valueType
    });
    CN7 = b1("ZodMap", (q, K) => {
        n41.init(q, K), a_.init(q, K), q.keyType = K.keyType, q.valueType = K.valueType
    });
    bN7 = b1("ZodSet", (q, K) => {
        i41.init(q, K), a_.init(q, K), q.min = (..._) => q.check(rY6(..._)), q.nonempty = (_) => q.check(rY6(1, _)), q.max = (..._) => q.check(SZ6(..._)), q.size = (..._) => q.check(sF6(..._))
    });
    Jg6 = b1("ZodEnum", (q, K) => {
        r41.init(q, K), a_.init(q, K), q.enum = K.entries, q.options = Object.values(K.entries);
        let _ = new Set(Object.keys(K.entries));
        q.extract = (z, Y) => {
            let A = {};
            for (let O of z)
                if (_.has(O)) A[O] = K.entries[O];
                else throw Error(`Key ${O} not found in enum`);
            return new Jg6({
                ...K,
                checks: [],
                ...K4.normalizeParams(Y),
                entries: A
            })
        }, q.exclude = (z, Y) => {
            let A = {
                ...K.entries
            };
            for (let O of z)
                if (_.has(O)) delete A[O];
                else throw Error(`Key ${O} not found in enum`);
            return new Jg6({
                ...K,
                checks: [],
                ...K4.normalizeParams(Y),
                entries: A
            })
        }
    });
    IN7 = b1("ZodLiteral", (q, K) => {
        o41.init(q, K), a_.init(q, K), q.values = new Set(K.values), Object.defineProperty(q, "value", {
            get() {
                if (K.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
                return K.values[0]
            }
        })
    });
    xN7 = b1("ZodFile", (q, K) => {
        a41.init(q, K), a_.init(q, K), q.min = (_, z) => q.check(rY6(_, z)), q.max = (_, z) => q.check(SZ6(_, z)), q.mime = (_, z) => q.check(Yg6(Array.isArray(_) ? _ : [_], z))
    });
    V31 = b1("ZodTransform", (q, K) => {
        lF6.init(q, K), a_.init(q, K), q._zod.parse = (_, z) => {
            _.addIssue = (A) => {
                if (typeof A === "string") _.issues.push(K4.issue(A, _.value, K));
                else {
                    let O = A;
                    if (O.fatal) O.continue = !1;
                    O.code ?? (O.code = "custom"), O.input ?? (O.input = _.value), O.inst ?? (O.inst = q), O.continue ?? (O.continue = !0), _.issues.push(K4.issue(O))
                }
            };
            let Y = K.transform(_.value, _);
            if (Y instanceof Promise) return Y.then((A) => {
                return _.value = A, _
            });
            return _.value = Y, _
        }
    });
    N31 = b1("ZodOptional", (q, K) => {
        s41.init(q, K), a_.init(q, K), q.unwrap = () => q._zod.def.innerType
    });
    uN7 = b1("ZodNullable", (q, K) => {
        t41.init(q, K), a_.init(q, K), q.unwrap = () => q._zod.def.innerType
    });
    mN7 = b1("ZodDefault", (q, K) => {
        e41.init(q, K), a_.init(q, K), q.unwrap = () => q._zod.def.innerType, q.removeDefault = q.unwrap
    });
    pN7 = b1("ZodPrefault", (q, K) => {
        qK1.init(q, K), a_.init(q, K), q.unwrap = () => q._zod.def.innerType
    });
    E31 = b1("ZodNonOptional", (q, K) => {
        KK1.init(q, K), a_.init(q, K), q.unwrap = () => q._zod.def.innerType
    });
    UN7 = b1("ZodSuccess", (q, K) => {
        _K1.init(q, K), a_.init(q, K), q.unwrap = () => q._zod.def.innerType
    });
    QN7 = b1("ZodCatch", (q, K) => {
        zK1.init(q, K), a_.init(q, K), q.unwrap = () => q._zod.def.innerType, q.removeCatch = q.unwrap
    });
    cN7 = b1("ZodNaN", (q, K) => {
        YK1.init(q, K), a_.init(q, K)
    });
    y31 = b1("ZodPipe", (q, K) => {
        nF6.init(q, K), a_.init(q, K), q.in = K.in, q.out = K.out
    });
    lN7 = b1("ZodReadonly", (q, K) => {
        AK1.init(q, K), a_.init(q, K)
    });
    iN7 = b1("ZodTemplateLiteral", (q, K) => {
        OK1.init(q, K), a_.init(q, K)
    });
    rN7 = b1("ZodLazy", (q, K) => {
        $K1.init(q, K), a_.init(q, K), q.unwrap = () => q._zod.def.getter()
    });
    aN7 = b1("ZodPromise", (q, K) => {
        wK1.init(q, K), a_.init(q, K), q.unwrap = () => q._zod.def.innerType
    });
    R$8 = b1("ZodCustom", (q, K) => {
        jK1.init(q, K), a_.init(q, K)
    })
})
// @from(Ln 25802, Col 0)
function wy5(q) {
    qP({
        customError: q
    })
}
// @from(Ln 25808, Col 0)
function $y5() {
    return qP().customError
}
// @from(Ln 25811, Col 4)
h31
// @from(Ln 25812, Col 4)
qE7 = L(() => {
    WV();
    h31 = {
        invalid_type: "invalid_type",
        too_big: "too_big",
        too_small: "too_small",
        invalid_format: "invalid_format",
        not_multiple_of: "not_multiple_of",
        unrecognized_keys: "unrecognized_keys",
        invalid_union: "invalid_union",
        invalid_key: "invalid_key",
        invalid_element: "invalid_element",
        invalid_value: "invalid_value",
        custom: "custom"
    }
})
// @from(Ln 25828, Col 4)
Zg6 = {}
// @from(Ln 25837, Col 0)
function jy5(q) {
    return eK1(Xg6, q)
}
// @from(Ln 25841, Col 0)
function Hy5(q) {
    return O51(Mg6, q)
}
// @from(Ln 25845, Col 0)
function Jy5(q) {
    return M51(Pg6, q)
}
// @from(Ln 25849, Col 0)
function Xy5(q) {
    return W51(Wg6, q)
}
// @from(Ln 25853, Col 0)
function My5(q) {
    return E51(y$8, q)
}
// @from(Ln 25856, Col 4)
KE7 = L(() => {
    WV();
    v$8()
})
// @from(Ln 25860, Col 4)
y = {}
// @from(Ln 26070, Col 4)
R31 = L(() => {
    WV();
    WV();
    DK1();
    WV();
    l28();
    G$8();
    G$8();
    KE7();
    v$8();
    U51();
    n51();
    s51();
    qE7();
    qP(rF6())
})
// @from(Ln 26086, Col 4)
_E7
// @from(Ln 26087, Col 4)
S31 = L(() => {
    R31();
    R31();
    _E7 = y
})
// @from(Ln 26092, Col 4)
fK
// @from(Ln 26093, Col 4)
p7 = L(() => {
    S31();
    S31();
    fK = _E7
})
// @from(Ln 26098, Col 4)
K16 = "2025-11-25"
// @from(Ln 26099, Col 4)
b$8
// @from(Ln 26099, Col 9)
_16 = "io.modelcontextprotocol/related-task"
// @from(Ln 26100, Col 4)
I$8 = "2.0"
// @from(Ln 26101, Col 4)
yW
// @from(Ln 26101, Col 8)
YE7
// @from(Ln 26101, Col 13)
AE7
// @from(Ln 26101, Col 18)
hRA
// @from(Ln 26101, Col 23)
Py5
// @from(Ln 26101, Col 28)
Wy5
// @from(Ln 26101, Col 33)
C31
// @from(Ln 26101, Col 38)
$h
// @from(Ln 26101, Col 42)
fg6
// @from(Ln 26101, Col 47)
OE7 = (q) => fg6.safeParse(q).success
// @from(Ln 26102, Col 4)
mZ
// @from(Ln 26102, Col 8)
uC
// @from(Ln 26102, Col 12)
mC
// @from(Ln 26102, Col 16)
BZ
// @from(Ln 26102, Col 20)
x$8
// @from(Ln 26102, Col 25)
wE7
// @from(Ln 26102, Col 30)
Gg6 = (q) => wE7.safeParse(q).success
// @from(Ln 26103, Col 4)
$E7
// @from(Ln 26103, Col 9)
jE7 = (q) => $E7.safeParse(q).success
// @from(Ln 26104, Col 4)
b31
// @from(Ln 26104, Col 9)
oY6 = (q) => b31.safeParse(q).success
// @from(Ln 26105, Col 4)
V5
// @from(Ln 26105, Col 8)
I31
// @from(Ln 26105, Col 13)
HE7 = (q) => I31.safeParse(q).success
// @from(Ln 26106, Col 4)
Pm
// @from(Ln 26106, Col 8)
RRA
// @from(Ln 26106, Col 13)
Ar
// @from(Ln 26106, Col 17)
Dy5
// @from(Ln 26106, Col 22)
u$8
// @from(Ln 26106, Col 27)
Zy5
// @from(Ln 26106, Col 32)
vg6
// @from(Ln 26106, Col 37)
BZ6
// @from(Ln 26106, Col 42)
JE7
// @from(Ln 26106, Col 47)
fy5
// @from(Ln 26106, Col 52)
Gy5
// @from(Ln 26106, Col 57)
vy5
// @from(Ln 26106, Col 62)
Ty5
// @from(Ln 26106, Col 67)
Vy5
// @from(Ln 26106, Col 72)
ky5
// @from(Ln 26106, Col 77)
x31
// @from(Ln 26106, Col 82)
Ny5
// @from(Ln 26106, Col 87)
u31
// @from(Ln 26106, Col 92)
m$8
// @from(Ln 26106, Col 97)
XE7 = (q) => m$8.safeParse(q).success
// @from(Ln 26107, Col 4)
B$8
// @from(Ln 26107, Col 9)
Ey5
// @from(Ln 26107, Col 14)
yy5
// @from(Ln 26107, Col 19)
p$8
// @from(Ln 26107, Col 24)
Ly5
// @from(Ln 26107, Col 29)
Tg6
// @from(Ln 26107, Col 34)
Vg6
// @from(Ln 26107, Col 39)
hy5
// @from(Ln 26107, Col 44)
kg6
// @from(Ln 26107, Col 49)
Or
// @from(Ln 26107, Col 53)
Ry5
// @from(Ln 26107, Col 58)
Ng6
// @from(Ln 26107, Col 63)
F$8
// @from(Ln 26107, Col 68)
g$8
// @from(Ln 26107, Col 73)
U$8
// @from(Ln 26107, Col 78)
SRA
// @from(Ln 26107, Col 83)
Q$8
// @from(Ln 26107, Col 88)
d$8
// @from(Ln 26107, Col 93)
c$8
// @from(Ln 26107, Col 98)
ME7
// @from(Ln 26107, Col 103)
PE7
// @from(Ln 26107, Col 108)
WE7
// @from(Ln 26107, Col 113)
m31
// @from(Ln 26107, Col 118)
DE7
// @from(Ln 26107, Col 123)
Eg6
// @from(Ln 26107, Col 128)
pZ6
// @from(Ln 26107, Col 133)
ZE7
// @from(Ln 26107, Col 138)
Sy5
// @from(Ln 26107, Col 143)
Cy5
// @from(Ln 26107, Col 148)
yg6
// @from(Ln 26107, Col 153)
by5
// @from(Ln 26107, Col 158)
Lg6
// @from(Ln 26107, Col 163)
B31
// @from(Ln 26107, Col 168)
Iy5
// @from(Ln 26107, Col 173)
xy5
// @from(Ln 26107, Col 178)
hg6
// @from(Ln 26107, Col 183)
Rg6
// @from(Ln 26107, Col 188)
uy5
// @from(Ln 26107, Col 193)
my5
// @from(Ln 26107, Col 198)
By5
// @from(Ln 26107, Col 203)
py5
// @from(Ln 26107, Col 208)
Fy5
// @from(Ln 26107, Col 213)
gy5
// @from(Ln 26107, Col 218)
Uy5
// @from(Ln 26107, Col 223)
Qy5
// @from(Ln 26107, Col 228)
dy5
// @from(Ln 26107, Col 233)
Sg6
// @from(Ln 26107, Col 238)
cy5
// @from(Ln 26107, Col 243)
ly5
// @from(Ln 26107, Col 248)
p31
// @from(Ln 26107, Col 253)
F31
// @from(Ln 26107, Col 258)
g31
// @from(Ln 26107, Col 263)
ny5
// @from(Ln 26107, Col 268)
iy5
// @from(Ln 26107, Col 273)
ry5
// @from(Ln 26107, Col 278)
U31
// @from(Ln 26107, Col 283)
oy5
// @from(Ln 26107, Col 288)
Q31
// @from(Ln 26107, Col 293)
Cg6
// @from(Ln 26107, Col 298)
ay5
// @from(Ln 26107, Col 303)
sy5
// @from(Ln 26107, Col 308)
fE7
// @from(Ln 26107, Col 313)
wr
// @from(Ln 26107, Col 317)
bg6
// @from(Ln 26107, Col 322)
zU
// @from(Ln 26107, Col 326)
CRA
// @from(Ln 26107, Col 331)
ty5
// @from(Ln 26107, Col 336)
YU
// @from(Ln 26107, Col 340)
Ig6
// @from(Ln 26107, Col 345)
GE7
// @from(Ln 26107, Col 350)
xg6
// @from(Ln 26107, Col 355)
ey5
// @from(Ln 26107, Col 360)
d31
// @from(Ln 26107, Col 365)
qL5
// @from(Ln 26107, Col 370)
KL5
// @from(Ln 26107, Col 375)
_L5
// @from(Ln 26107, Col 380)
zL5
// @from(Ln 26107, Col 385)
YL5
// @from(Ln 26107, Col 390)
AL5
// @from(Ln 26107, Col 395)
OL5
// @from(Ln 26107, Col 400)
C$8
// @from(Ln 26107, Col 405)
wL5
// @from(Ln 26107, Col 410)
$L5
// @from(Ln 26107, Col 415)
c31
// @from(Ln 26107, Col 420)
aY6
// @from(Ln 26107, Col 425)
ug6
// @from(Ln 26107, Col 430)
jL5
// @from(Ln 26107, Col 435)
HL5
// @from(Ln 26107, Col 440)
JL5
// @from(Ln 26107, Col 445)
XL5
// @from(Ln 26107, Col 450)
ML5
// @from(Ln 26107, Col 455)
PL5
// @from(Ln 26107, Col 460)
WL5
// @from(Ln 26107, Col 465)
DL5
// @from(Ln 26107, Col 470)
ZL5
// @from(Ln 26107, Col 475)
fL5
// @from(Ln 26107, Col 480)
GL5
// @from(Ln 26107, Col 485)
vL5
// @from(Ln 26107, Col 490)
TL5
// @from(Ln 26107, Col 495)
l31
// @from(Ln 26107, Col 500)
VL5
// @from(Ln 26107, Col 505)
$r
// @from(Ln 26107, Col 509)
kL5
// @from(Ln 26107, Col 514)
mg6
// @from(Ln 26107, Col 519)
z16
// @from(Ln 26107, Col 524)
NL5
// @from(Ln 26107, Col 529)
EL5
// @from(Ln 26107, Col 534)
yL5
// @from(Ln 26107, Col 539)
LL5
// @from(Ln 26107, Col 544)
n31
// @from(Ln 26107, Col 549)
hL5
// @from(Ln 26107, Col 554)
i31
// @from(Ln 26107, Col 559)
r31
// @from(Ln 26107, Col 564)
RL5
// @from(Ln 26107, Col 569)
bRA
// @from(Ln 26107, Col 574)
IRA
// @from(Ln 26107, Col 579)
xRA
// @from(Ln 26107, Col 584)
uRA
// @from(Ln 26107, Col 589)
mRA
// @from(Ln 26107, Col 594)
BRA
// @from(Ln 26107, Col 599)
SK
// @from(Ln 26107, Col 603)
vE7
// @from(Ln 26108, Col 4)
_P = L(() => {
    p7();
    b$8 = [K16, "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"], yW = L31((q) => q !== null && (typeof q === "object" || typeof q === "function")), YE7 = dw([O1(), GY().int()]), AE7 = O1(), hRA = KP({
        ttl: GY().optional(),
        pollInterval: GY().optional()
    }), Py5 = G4({
        ttl: GY().optional()
    }), Wy5 = G4({
        taskId: O1()
    }), C31 = KP({
        progressToken: YE7.optional(),
        [_16]: Wy5.optional()
    }), $h = G4({
        _meta: C31.optional()
    }), fg6 = $h.extend({
        task: Py5.optional()
    }), mZ = G4({
        method: O1(),
        params: $h.loose().optional()
    }), uC = G4({
        _meta: C31.optional()
    }), mC = G4({
        method: O1(),
        params: uC.loose().optional()
    }), BZ = KP({
        _meta: C31.optional()
    }), x$8 = dw([O1(), GY().int()]), wE7 = G4({
        jsonrpc: RK(I$8),
        id: x$8,
        ...mZ.shape
    }).strict(), $E7 = G4({
        jsonrpc: RK(I$8),
        ...mC.shape
    }).strict(), b31 = G4({
        jsonrpc: RK(I$8),
        id: x$8,
        result: BZ
    }).strict();
    (function(q) {
        q[q.ConnectionClosed = -32000] = "ConnectionClosed", q[q.RequestTimeout = -32001] = "RequestTimeout", q[q.ParseError = -32700] = "ParseError", q[q.InvalidRequest = -32600] = "InvalidRequest", q[q.MethodNotFound = -32601] = "MethodNotFound", q[q.InvalidParams = -32602] = "InvalidParams", q[q.InternalError = -32603] = "InternalError", q[q.UrlElicitationRequired = -32042] = "UrlElicitationRequired"
    })(V5 || (V5 = {}));
    I31 = G4({
        jsonrpc: RK(I$8),
        id: x$8.optional(),
        error: G4({
            code: GY().int(),
            message: O1(),
            data: Kj().optional()
        })
    }).strict(), Pm = dw([wE7, $E7, b31, I31]), RRA = dw([b31, I31]), Ar = BZ.strict(), Dy5 = uC.extend({
        requestId: x$8.optional(),
        reason: O1().optional()
    }), u$8 = mC.extend({
        method: RK("notifications/cancelled"),
        params: Dy5
    }), Zy5 = G4({
        src: O1(),
        mimeType: O1().optional(),
        sizes: _4(O1()).optional(),
        theme: ZV(["light", "dark"]).optional()
    }), vg6 = G4({
        icons: _4(Zy5).optional()
    }), BZ6 = G4({
        name: O1(),
        title: O1().optional()
    }), JE7 = BZ6.extend({
        ...BZ6.shape,
        ...vg6.shape,
        version: O1(),
        websiteUrl: O1().optional(),
        description: O1().optional()
    }), fy5 = Dg6(G4({
        applyDefaults: Xw().optional()
    }), cw(O1(), Kj())), Gy5 = S$8((q) => {
        if (q && typeof q === "object" && !Array.isArray(q)) {
            if (Object.keys(q).length === 0) return {
                form: {}
            }
        }
        return q
    }, Dg6(G4({
        form: fy5.optional(),
        url: yW.optional()
    }), cw(O1(), Kj()).optional())), vy5 = KP({
        list: yW.optional(),
        cancel: yW.optional(),
        requests: KP({
            sampling: KP({
                createMessage: yW.optional()
            }).optional(),
            elicitation: KP({
                create: yW.optional()
            }).optional()
        }).optional()
    }), Ty5 = KP({
        list: yW.optional(),
        cancel: yW.optional(),
        requests: KP({
            tools: KP({
                call: yW.optional()
            }).optional()
        }).optional()
    }), Vy5 = G4({
        experimental: cw(O1(), yW).optional(),
        sampling: G4({
            context: yW.optional(),
            tools: yW.optional()
        }).optional(),
        elicitation: Gy5.optional(),
        roots: G4({
            listChanged: Xw().optional()
        }).optional(),
        tasks: vy5.optional(),
        extensions: cw(O1(), yW).optional()
    }), ky5 = $h.extend({
        protocolVersion: O1(),
        capabilities: Vy5,
        clientInfo: JE7
    }), x31 = mZ.extend({
        method: RK("initialize"),
        params: ky5
    }), Ny5 = G4({
        experimental: cw(O1(), yW).optional(),
        logging: yW.optional(),
        completions: yW.optional(),
        prompts: G4({
            listChanged: Xw().optional()
        }).optional(),
        resources: G4({
            subscribe: Xw().optional(),
            listChanged: Xw().optional()
        }).optional(),
        tools: G4({
            listChanged: Xw().optional()
        }).optional(),
        tasks: Ty5.optional(),
        extensions: cw(O1(), yW).optional()
    }), u31 = BZ.extend({
        protocolVersion: O1(),
        capabilities: Ny5,
        serverInfo: JE7,
        instructions: O1().optional()
    }), m$8 = mC.extend({
        method: RK("notifications/initialized"),
        params: uC.optional()
    }), B$8 = mZ.extend({
        method: RK("ping"),
        params: $h.optional()
    }), Ey5 = G4({
        progress: GY(),
        total: D$(GY()),
        message: D$(O1())
    }), yy5 = G4({
        ...uC.shape,
        ...Ey5.shape,
        progressToken: YE7
    }), p$8 = mC.extend({
        method: RK("notifications/progress"),
        params: yy5
    }), Ly5 = $h.extend({
        cursor: AE7.optional()
    }), Tg6 = mZ.extend({
        params: Ly5.optional()
    }), Vg6 = BZ.extend({
        nextCursor: AE7.optional()
    }), hy5 = ZV(["working", "input_required", "completed", "failed", "cancelled"]), kg6 = G4({
        taskId: O1(),
        status: hy5,
        ttl: dw([GY(), N$8()]),
        createdAt: O1(),
        lastUpdatedAt: O1(),
        pollInterval: D$(GY()),
        statusMessage: D$(O1())
    }), Or = BZ.extend({
        task: kg6
    }), Ry5 = uC.merge(kg6), Ng6 = mC.extend({
        method: RK("notifications/tasks/status"),
        params: Ry5
    }), F$8 = mZ.extend({
        method: RK("tasks/get"),
        params: $h.extend({
            taskId: O1()
        })
    }), g$8 = BZ.merge(kg6), U$8 = mZ.extend({
        method: RK("tasks/result"),
        params: $h.extend({
            taskId: O1()
        })
    }), SRA = BZ.loose(), Q$8 = Tg6.extend({
        method: RK("tasks/list")
    }), d$8 = Vg6.extend({
        tasks: _4(kg6)
    }), c$8 = mZ.extend({
        method: RK("tasks/cancel"),
        params: $h.extend({
            taskId: O1()
        })
    }), ME7 = BZ.merge(kg6), PE7 = G4({
        uri: O1(),
        mimeType: D$(O1()),
        _meta: cw(O1(), Kj()).optional()
    }), WE7 = PE7.extend({
        text: O1()
    }), m31 = O1().refine((q) => {
        try {
            return atob(q), !0
        } catch {
            return !1
        }
    }, {
        message: "Invalid Base64 string"
    }), DE7 = PE7.extend({
        blob: m31
    }), Eg6 = ZV(["user", "assistant"]), pZ6 = G4({
        audience: _4(Eg6).optional(),
        priority: GY().min(0).max(1).optional(),
        lastModified: xZ6.datetime({
            offset: !0
        }).optional()
    }), ZE7 = G4({
        ...BZ6.shape,
        ...vg6.shape,
        uri: O1(),
        description: D$(O1()),
        mimeType: D$(O1()),
        size: D$(GY()),
        annotations: pZ6.optional(),
        _meta: D$(KP({}))
    }), Sy5 = G4({
        ...BZ6.shape,
        ...vg6.shape,
        uriTemplate: O1(),
        description: D$(O1()),
        mimeType: D$(O1()),
        annotations: pZ6.optional(),
        _meta: D$(KP({}))
    }), Cy5 = Tg6.extend({
        method: RK("resources/list")
    }), yg6 = Vg6.extend({
        resources: _4(ZE7)
    }), by5 = Tg6.extend({
        method: RK("resources/templates/list")
    }), Lg6 = Vg6.extend({
        resourceTemplates: _4(Sy5)
    }), B31 = $h.extend({
        uri: O1()
    }), Iy5 = B31, xy5 = mZ.extend({
        method: RK("resources/read"),
        params: Iy5
    }), hg6 = BZ.extend({
        contents: _4(dw([WE7, DE7]))
    }), Rg6 = mC.extend({
        method: RK("notifications/resources/list_changed"),
        params: uC.optional()
    }), uy5 = B31, my5 = mZ.extend({
        method: RK("resources/subscribe"),
        params: uy5
    }), By5 = B31, py5 = mZ.extend({
        method: RK("resources/unsubscribe"),
        params: By5
    }), Fy5 = uC.extend({
        uri: O1()
    }), gy5 = mC.extend({
        method: RK("notifications/resources/updated"),
        params: Fy5
    }), Uy5 = G4({
        name: O1(),
        description: D$(O1()),
        required: D$(Xw())
    }), Qy5 = G4({
        ...BZ6.shape,
        ...vg6.shape,
        description: D$(O1()),
        arguments: D$(_4(Uy5)),
        _meta: D$(KP({}))
    }), dy5 = Tg6.extend({
        method: RK("prompts/list")
    }), Sg6 = Vg6.extend({
        prompts: _4(Qy5)
    }), cy5 = $h.extend({
        name: O1(),
        arguments: cw(O1(), O1()).optional()
    }), ly5 = mZ.extend({
        method: RK("prompts/get"),
        params: cy5
    }), p31 = G4({
        type: RK("text"),
        text: O1(),
        annotations: pZ6.optional(),
        _meta: cw(O1(), Kj()).optional()
    }), F31 = G4({
        type: RK("image"),
        data: m31,
        mimeType: O1(),
        annotations: pZ6.optional(),
        _meta: cw(O1(), Kj()).optional()
    }), g31 = G4({
        type: RK("audio"),
        data: m31,
        mimeType: O1(),
        annotations: pZ6.optional(),
        _meta: cw(O1(), Kj()).optional()
    }), ny5 = G4({
        type: RK("tool_use"),
        name: O1(),
        id: O1(),
        input: cw(O1(), Kj()),
        _meta: cw(O1(), Kj()).optional()
    }), iy5 = G4({
        type: RK("resource"),
        resource: dw([WE7, DE7]),
        annotations: pZ6.optional(),
        _meta: cw(O1(), Kj()).optional()
    }), ry5 = ZE7.extend({
        type: RK("resource_link")
    }), U31 = dw([p31, F31, g31, ry5, iy5]), oy5 = G4({
        role: Eg6,
        content: U31
    }), Q31 = BZ.extend({
        description: O1().optional(),
        messages: _4(oy5)
    }), Cg6 = mC.extend({
        method: RK("notifications/prompts/list_changed"),
        params: uC.optional()
    }), ay5 = G4({
        title: O1().optional(),
        readOnlyHint: Xw().optional(),
        destructiveHint: Xw().optional(),
        idempotentHint: Xw().optional(),
        openWorldHint: Xw().optional()
    }), sy5 = G4({
        taskSupport: ZV(["required", "optional", "forbidden"]).optional()
    }), fE7 = G4({
        ...BZ6.shape,
        ...vg6.shape,
        description: O1().optional(),
        inputSchema: G4({
            type: RK("object"),
            properties: cw(O1(), yW).optional(),
            required: _4(O1()).optional()
        }).catchall(Kj()),
        outputSchema: G4({
            type: RK("object"),
            properties: cw(O1(), yW).optional(),
            required: _4(O1()).optional()
        }).catchall(Kj()).optional(),
        annotations: ay5.optional(),
        execution: sy5.optional(),
        _meta: cw(O1(), Kj()).optional()
    }), wr = Tg6.extend({
        method: RK("tools/list")
    }), bg6 = Vg6.extend({
        tools: _4(fE7)
    }), zU = BZ.extend({
        content: _4(U31).default([]),
        structuredContent: cw(O1(), Kj()).optional(),
        isError: Xw().optional()
    }), CRA = zU.or(BZ.extend({
        toolResult: Kj()
    })), ty5 = fg6.extend({
        name: O1(),
        arguments: cw(O1(), Kj()).optional()
    }), YU = mZ.extend({
        method: RK("tools/call"),
        params: ty5
    }), Ig6 = mC.extend({
        method: RK("notifications/tools/list_changed"),
        params: uC.optional()
    }), GE7 = G4({
        autoRefresh: Xw().default(!0),
        debounceMs: GY().int().nonnegative().default(300)
    }), xg6 = ZV(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]), ey5 = $h.extend({
        level: xg6
    }), d31 = mZ.extend({
        method: RK("logging/setLevel"),
        params: ey5
    }), qL5 = uC.extend({
        level: xg6,
        logger: O1().optional(),
        data: Kj()
    }), KL5 = mC.extend({
        method: RK("notifications/message"),
        params: qL5
    }), _L5 = G4({
        name: O1().optional()
    }), zL5 = G4({
        hints: _4(_L5).optional(),
        costPriority: GY().min(0).max(1).optional(),
        speedPriority: GY().min(0).max(1).optional(),
        intelligencePriority: GY().min(0).max(1).optional()
    }), YL5 = G4({
        mode: ZV(["auto", "required", "none"]).optional()
    }), AL5 = G4({
        type: RK("tool_result"),
        toolUseId: O1().describe("The unique identifier for the corresponding tool call."),
        content: _4(U31).default([]),
        structuredContent: G4({}).loose().optional(),
        isError: Xw().optional(),
        _meta: cw(O1(), Kj()).optional()
    }), OL5 = h$8("type", [p31, F31, g31]), C$8 = h$8("type", [p31, F31, g31, ny5, AL5]), wL5 = G4({
        role: Eg6,
        content: dw([C$8, _4(C$8)]),
        _meta: cw(O1(), Kj()).optional()
    }), $L5 = fg6.extend({
        messages: _4(wL5),
        modelPreferences: zL5.optional(),
        systemPrompt: O1().optional(),
        includeContext: ZV(["none", "thisServer", "allServers"]).optional(),
        temperature: GY().optional(),
        maxTokens: GY().int(),
        stopSequences: _4(O1()).optional(),
        metadata: yW.optional(),
        tools: _4(fE7).optional(),
        toolChoice: YL5.optional()
    }), c31 = mZ.extend({
        method: RK("sampling/createMessage"),
        params: $L5
    }), aY6 = BZ.extend({
        model: O1(),
        stopReason: D$(ZV(["endTurn", "stopSequence", "maxTokens"]).or(O1())),
        role: Eg6,
        content: OL5
    }), ug6 = BZ.extend({
        model: O1(),
        stopReason: D$(ZV(["endTurn", "stopSequence", "maxTokens", "toolUse"]).or(O1())),
        role: Eg6,
        content: dw([C$8, _4(C$8)])
    }), jL5 = G4({
        type: RK("boolean"),
        title: O1().optional(),
        description: O1().optional(),
        default: Xw().optional()
    }), HL5 = G4({
        type: RK("string"),
        title: O1().optional(),
        description: O1().optional(),
        minLength: GY().optional(),
        maxLength: GY().optional(),
        format: ZV(["email", "uri", "date", "date-time"]).optional(),
        default: O1().optional()
    }), JL5 = G4({
        type: ZV(["number", "integer"]),
        title: O1().optional(),
        description: O1().optional(),
        minimum: GY().optional(),
        maximum: GY().optional(),
        default: GY().optional()
    }), XL5 = G4({
        type: RK("string"),
        title: O1().optional(),
        description: O1().optional(),
        enum: _4(O1()),
        default: O1().optional()
    }), ML5 = G4({
        type: RK("string"),
        title: O1().optional(),
        description: O1().optional(),
        oneOf: _4(G4({
            const: O1(),
            title: O1()
        })),
        default: O1().optional()
    }), PL5 = G4({
        type: RK("string"),
        title: O1().optional(),
        description: O1().optional(),
        enum: _4(O1()),
        enumNames: _4(O1()).optional(),
        default: O1().optional()
    }), WL5 = dw([XL5, ML5]), DL5 = G4({
        type: RK("array"),
        title: O1().optional(),
        description: O1().optional(),
        minItems: GY().optional(),
        maxItems: GY().optional(),
        items: G4({
            type: RK("string"),
            enum: _4(O1())
        }),
        default: _4(O1()).optional()
    }), ZL5 = G4({
        type: RK("array"),
        title: O1().optional(),
        description: O1().optional(),
        minItems: GY().optional(),
        maxItems: GY().optional(),
        items: G4({
            anyOf: _4(G4({
                const: O1(),
                title: O1()
            }))
        }),
        default: _4(O1()).optional()
    }), fL5 = dw([DL5, ZL5]), GL5 = dw([PL5, WL5, fL5]), vL5 = dw([GL5, jL5, HL5, JL5]), TL5 = fg6.extend({
        mode: RK("form").optional(),
        message: O1(),
        requestedSchema: G4({
            type: RK("object"),
            properties: cw(O1(), vL5),
            required: _4(O1()).optional()
        })
    }), l31 = fg6.extend({
        mode: RK("url"),
        message: O1(),
        elicitationId: O1(),
        url: O1().url()
    }), VL5 = dw([TL5, l31]), $r = mZ.extend({
        method: RK("elicitation/create"),
        params: VL5
    }), kL5 = uC.extend({
        elicitationId: O1()
    }), mg6 = mC.extend({
        method: RK("notifications/elicitation/complete"),
        params: kL5
    }), z16 = BZ.extend({
        action: ZV(["accept", "decline", "cancel"]),
        content: S$8((q) => q === null ? void 0 : q, cw(O1(), dw([O1(), GY(), Xw(), _4(O1())])).optional())
    }), NL5 = G4({
        type: RK("ref/resource"),
        uri: O1()
    }), EL5 = G4({
        type: RK("ref/prompt"),
        name: O1()
    }), yL5 = $h.extend({
        ref: dw([EL5, NL5]),
        argument: G4({
            name: O1(),
            value: O1()
        }),
        context: G4({
            arguments: cw(O1(), O1()).optional()
        }).optional()
    }), LL5 = mZ.extend({
        method: RK("completion/complete"),
        params: yL5
    }), n31 = BZ.extend({
        completion: KP({
            values: _4(O1()).max(100),
            total: D$(GY().int()),
            hasMore: D$(Xw())
        })
    }), hL5 = G4({
        uri: O1().startsWith("file://"),
        name: O1().optional(),
        _meta: cw(O1(), Kj()).optional()
    }), i31 = mZ.extend({
        method: RK("roots/list"),
        params: $h.optional()
    }), r31 = BZ.extend({
        roots: _4(hL5)
    }), RL5 = mC.extend({
        method: RK("notifications/roots/list_changed"),
        params: uC.optional()
    }), bRA = dw([B$8, x31, LL5, d31, ly5, dy5, Cy5, by5, xy5, my5, py5, YU, wr, F$8, U$8, Q$8, c$8]), IRA = dw([u$8, p$8, m$8, RL5, Ng6]), xRA = dw([Ar, aY6, ug6, z16, r31, g$8, d$8, Or]), uRA = dw([B$8, c31, $r, i31, F$8, U$8, Q$8, c$8]), mRA = dw([u$8, p$8, KL5, gy5, Rg6, Ig6, Cg6, Ng6, mg6]), BRA = dw([Ar, u31, n31, Q31, Sg6, yg6, Lg6, hg6, zU, bg6, g$8, d$8, Or]);
    SK = class SK extends Error {
        constructor(q, K, _) {
            super(`MCP error ${q}: ${K}`);
            this.code = q, this.data = _, this.name = "McpError"
        }
        static fromError(q, K, _) {
            if (q === V5.UrlElicitationRequired && _) {
                let z = _;
                if (z.elicitations) return new vE7(z.elicitations, K)
            }
            return new SK(q, K, _)
        }
    };
    vE7 = class vE7 extends SK {
        constructor(q, K = `URL elicitation${q.length>1?"s":""} required`) {
            super(V5.UrlElicitationRequired, K, {
                elicitations: q
            })
        }
        get elicitations() {
            return this.data?.elicitations ?? []
        }
    }
})
// @from(Ln 26687, Col 0)
function Y16(q) {
    return q === "completed" || q === "failed" || q === "cancelled"
}
// @from(Ln 26690, Col 4)
SL5
// @from(Ln 26691, Col 4)
l$8 = L(() => {
    SL5 = Symbol("Let zodToJsonSchema decide on which parser to use")
})
// @from(Ln 26694, Col 4)
o31 = L(() => {
    l$8()
})
// @from(Ln 26697, Col 4)
BC = () => {}
// @from(Ln 26698, Col 4)
a31 = L(() => {
    zP()
})
// @from(Ln 26701, Col 4)
s31 = () => {}
// @from(Ln 26702, Col 4)
n$8 = L(() => {
    zP()
})
// @from(Ln 26705, Col 4)
t31 = L(() => {
    zP()
})
// @from(Ln 26708, Col 4)
e31 = () => {}
// @from(Ln 26709, Col 4)
q91 = L(() => {
    zP()
})
// @from(Ln 26712, Col 4)
K91 = L(() => {
    zP();
    BC()
})
// @from(Ln 26716, Col 4)
_91 = L(() => {
    zP()
})
// @from(Ln 26719, Col 4)
DSA
// @from(Ln 26720, Col 4)
i$8 = L(() => {
    DSA = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789")
})
// @from(Ln 26723, Col 4)
r$8 = L(() => {
    zP();
    i$8();
    n$8();
    BC()
})
// @from(Ln 26729, Col 4)
z91 = L(() => {
    zP();
    r$8();
    BC()
})
// @from(Ln 26734, Col 4)
Y91 = L(() => {
    BC()
})
// @from(Ln 26737, Col 4)
o$8 = L(() => {
    zP()
})
// @from(Ln 26740, Col 4)
A91 = L(() => {
    zP();
    o$8()
})
// @from(Ln 26744, Col 4)
O91 = () => {}
// @from(Ln 26745, Col 4)
w91 = L(() => {
    zP()
})
// @from(Ln 26748, Col 4)
$91 = L(() => {
    zP();
    BC()
})
// @from(Ln 26752, Col 4)
j91 = L(() => {
    zP()
})
// @from(Ln 26755, Col 4)
H91 = L(() => {
    zP()
})
// @from(Ln 26758, Col 4)
J91 = L(() => {
    zP()
})
// @from(Ln 26761, Col 4)
X91 = L(() => {
    zP()
})
// @from(Ln 26764, Col 4)
M91 = L(() => {
    BC()
})
// @from(Ln 26767, Col 4)
P91 = L(() => {
    BC()
})
// @from(Ln 26770, Col 4)
W91 = L(() => {
    zP()
})
// @from(Ln 26773, Col 4)
D91 = L(() => {
    BC();
    a31();
    s31();
    n$8();
    t31();
    e31();
    q91();
    K91();
    _91();
    z91();
    Y91();
    A91();
    O91();
    w91();
    $91();
    j91();
    H91();
    r$8();
    J91();
    i$8();
    X91();
    M91();
    o$8();
    P91();
    W91()
})
// @from(Ln 26800, Col 4)
zP = L(() => {
    l$8();
    D91();
    BC()
})
// @from(Ln 26805, Col 4)
TE7 = () => {}
// @from(Ln 26806, Col 4)
Z91 = L(() => {
    zP();
    o31();
    BC()
})
// @from(Ln 26811, Col 4)
VE7 = L(() => {
    Z91();
    l$8();
    o31();
    zP();
    TE7();
    BC();
    a31();
    s31();
    n$8();
    t31();
    e31();
    q91();
    K91();
    _91();
    z91();
    Y91();
    A91();
    O91();
    w91();
    $91();
    j91();
    H91();
    W91();
    r$8();
    J91();
    i$8();
    X91();
    M91();
    o$8();
    P91();
    D91();
    Z91()
})
// @from(Ln 26846, Col 0)
function f91(q) {
    let _ = IZ6(q)?.method;
    if (!_) throw Error("Schema is missing a method literal");
    let z = DN7(_);
    if (typeof z !== "string") throw Error("Schema method literal must be a string");
    return z
}
// @from(Ln 26854, Col 0)
function G91(q, K) {
    let _ = DV(q, K);
    if (!_.success) throw _.error;
    return _.data
}
// @from(Ln 26859, Col 4)
kE7 = L(() => {
    Hg6();
    VE7()
})
// @from(Ln 26863, Col 0)
class pg6 {
    constructor(q) {
        if (this._options = q, this._requestMessageId = 0, this._requestHandlers = new Map, this._requestHandlerAbortControllers = new Map, this._notificationHandlers = new Map, this._responseHandlers = new Map, this._progressHandlers = new Map, this._timeoutInfo = new Map, this._pendingDebouncedNotifications = new Set, this._taskProgressTokens = new Map, this._requestResolvers = new Map, this.setNotificationHandler(u$8, (K) => {
                this._oncancel(K)
            }), this.setNotificationHandler(p$8, (K) => {
                this._onprogress(K)
            }), this.setRequestHandler(B$8, (K) => ({})), this._taskStore = q?.taskStore, this._taskMessageQueue = q?.taskMessageQueue, this._taskStore) this.setRequestHandler(F$8, async (K, _) => {
            let z = await this._taskStore.getTask(K.params.taskId, _.sessionId);
            if (!z) throw new SK(V5.InvalidParams, "Failed to retrieve task: Task not found");
            return {
                ...z
            }
        }), this.setRequestHandler(U$8, async (K, _) => {
            let z = async () => {
                let Y = K.params.taskId;
                if (this._taskMessageQueue) {
                    let O;
                    while (O = await this._taskMessageQueue.dequeue(Y, _.sessionId)) {
                        if (O.type === "response" || O.type === "error") {
                            let w = O.message,
                                $ = w.id,
                                j = this._requestResolvers.get($);
                            if (j)
                                if (this._requestResolvers.delete($), O.type === "response") j(w);
                                else {
                                    let H = w,
                                        J = new SK(H.error.code, H.error.message, H.error.data);
                                    j(J)
                                }
                            else {
                                let H = O.type === "response" ? "Response" : "Error";
                                this._onerror(Error(`${H} handler missing for request ${$}`))
                            }
                            continue
                        }
                        await this._transport?.send(O.message, {
                            relatedRequestId: _.requestId
                        })
                    }
                }
                let A = await this._taskStore.getTask(Y, _.sessionId);
                if (!A) throw new SK(V5.InvalidParams, `Task not found: ${Y}`);
                if (!Y16(A.status)) return await this._waitForTaskUpdate(Y, _.signal), await z();
                if (Y16(A.status)) {
                    let O = await this._taskStore.getTaskResult(Y, _.sessionId);
                    return this._clearTaskQueue(Y), {
                        ...O,
                        _meta: {
                            ...O._meta,
                            [_16]: {
                                taskId: Y
                            }
                        }
                    }
                }
                return await z()
            };
            return await z()
        }), this.setRequestHandler(Q$8, async (K, _) => {
            try {
                let {
                    tasks: z,
                    nextCursor: Y
                } = await this._taskStore.listTasks(K.params?.cursor, _.sessionId);
                return {
                    tasks: z,
                    nextCursor: Y,
                    _meta: {}
                }
            } catch (z) {
                throw new SK(V5.InvalidParams, `Failed to list tasks: ${z instanceof Error?z.message:String(z)}`)
            }
        }), this.setRequestHandler(c$8, async (K, _) => {
            try {
                let z = await this._taskStore.getTask(K.params.taskId, _.sessionId);
                if (!z) throw new SK(V5.InvalidParams, `Task not found: ${K.params.taskId}`);
                if (Y16(z.status)) throw new SK(V5.InvalidParams, `Cannot cancel task in terminal status: ${z.status}`);
                await this._taskStore.updateTaskStatus(K.params.taskId, "cancelled", "Client cancelled task execution.", _.sessionId), this._clearTaskQueue(K.params.taskId);
                let Y = await this._taskStore.getTask(K.params.taskId, _.sessionId);
                if (!Y) throw new SK(V5.InvalidParams, `Task not found after cancellation: ${K.params.taskId}`);
                return {
                    _meta: {},
                    ...Y
                }
            } catch (z) {
                if (z instanceof SK) throw z;
                throw new SK(V5.InvalidRequest, `Failed to cancel task: ${z instanceof Error?z.message:String(z)}`)
            }
        })
    }
    async _oncancel(q) {
        if (!q.params.requestId) return;
        this._requestHandlerAbortControllers.get(q.params.requestId)?.abort(q.params.reason)
    }
    _setupTimeout(q, K, _, z, Y = !1) {
        this._timeoutInfo.set(q, {
            timeoutId: setTimeout(z, K),
            startTime: Date.now(),
            timeout: K,
            maxTotalTimeout: _,
            resetTimeoutOnProgress: Y,
            onTimeout: z
        })
    }
    _resetTimeout(q) {
        let K = this._timeoutInfo.get(q);
        if (!K) return !1;
        let _ = Date.now() - K.startTime;
        if (K.maxTotalTimeout && _ >= K.maxTotalTimeout) throw this._timeoutInfo.delete(q), SK.fromError(V5.RequestTimeout, "Maximum total timeout exceeded", {
            maxTotalTimeout: K.maxTotalTimeout,
            totalElapsed: _
        });
        return clearTimeout(K.timeoutId), K.timeoutId = setTimeout(K.onTimeout, K.timeout), !0
    }
    _cleanupTimeout(q) {
        let K = this._timeoutInfo.get(q);
        if (K) clearTimeout(K.timeoutId), this._timeoutInfo.delete(q)
    }
    async connect(q) {
        if (this._transport) throw Error("Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.");
        this._transport = q;
        let K = this.transport?.onclose;
        this._transport.onclose = () => {
            K?.(), this._onclose()
        };
        let _ = this.transport?.onerror;
        this._transport.onerror = (Y) => {
            _?.(Y), this._onerror(Y)
        };
        let z = this._transport?.onmessage;
        this._transport.onmessage = (Y, A) => {
            if (z?.(Y, A), oY6(Y) || HE7(Y)) this._onresponse(Y);
            else if (Gg6(Y)) this._onrequest(Y, A);
            else if (jE7(Y)) this._onnotification(Y);
            else this._onerror(Error(`Unknown message type: ${JSON.stringify(Y)}`))
        }, await this._transport.start()
    }
    _onclose() {
        let q = this._responseHandlers;
        this._responseHandlers = new Map, this._progressHandlers.clear(), this._taskProgressTokens.clear(), this._pendingDebouncedNotifications.clear();
        for (let _ of this._timeoutInfo.values()) clearTimeout(_.timeoutId);
        this._timeoutInfo.clear();
        for (let _ of this._requestHandlerAbortControllers.values()) _.abort();
        this._requestHandlerAbortControllers.clear();
        let K = SK.fromError(V5.ConnectionClosed, "Connection closed");
        this._transport = void 0, this.onclose?.();
        for (let _ of q.values()) _(K)
    }
    _onerror(q) {
        this.onerror?.(q)
    }
    _onnotification(q) {
        let K = this._notificationHandlers.get(q.method) ?? this.fallbackNotificationHandler;
        if (K === void 0) return;
        Promise.resolve().then(() => K(q)).catch((_) => this._onerror(Error(`Uncaught error in notification handler: ${_}`)))
    }
    _onrequest(q, K) {
        let _ = this._requestHandlers.get(q.method) ?? this.fallbackRequestHandler,
            z = this._transport,
            Y = q.params?._meta?.[_16]?.taskId;
        if (_ === void 0) {
            let j = {
                jsonrpc: "2.0",
                id: q.id,
                error: {
                    code: V5.MethodNotFound,
                    message: "Method not found"
                }
            };
            if (Y && this._taskMessageQueue) this._enqueueTaskMessage(Y, {
                type: "error",
                message: j,
                timestamp: Date.now()
            }, z?.sessionId).catch((H) => this._onerror(Error(`Failed to enqueue error response: ${H}`)));
            else z?.send(j).catch((H) => this._onerror(Error(`Failed to send an error response: ${H}`)));
            return
        }
        let A = new AbortController;
        this._requestHandlerAbortControllers.set(q.id, A);
        let O = OE7(q.params) ? q.params.task : void 0,
            w = this._taskStore ? this.requestTaskStore(q, z?.sessionId) : void 0,
            $ = {
                signal: A.signal,
                sessionId: z?.sessionId,
                _meta: q.params?._meta,
                sendNotification: async (j) => {
                    if (A.signal.aborted) return;
                    let H = {
                        relatedRequestId: q.id
                    };
                    if (Y) H.relatedTask = {
                        taskId: Y
                    };
                    await this.notification(j, H)
                },
                sendRequest: async (j, H, J) => {
                    if (A.signal.aborted) throw new SK(V5.ConnectionClosed, "Request was cancelled");
                    let X = {
                        ...J,
                        relatedRequestId: q.id
                    };
                    if (Y && !X.relatedTask) X.relatedTask = {
                        taskId: Y
                    };
                    let M = X.relatedTask?.taskId ?? Y;
                    if (M && w) await w.updateTaskStatus(M, "input_required");
                    return await this.request(j, H, X)
                },
                authInfo: K?.authInfo,
                requestId: q.id,
                requestInfo: K?.requestInfo,
                taskId: Y,
                taskStore: w,
                taskRequestedTtl: O?.ttl,
                closeSSEStream: K?.closeSSEStream,
                closeStandaloneSSEStream: K?.closeStandaloneSSEStream
            };
        Promise.resolve().then(() => {
            if (O) this.assertTaskHandlerCapability(q.method)
        }).then(() => _(q, $)).then(async (j) => {
            if (A.signal.aborted) return;
            let H = {
                result: j,
                jsonrpc: "2.0",
                id: q.id
            };
            if (Y && this._taskMessageQueue) await this._enqueueTaskMessage(Y, {
                type: "response",
                message: H,
                timestamp: Date.now()
            }, z?.sessionId);
            else await z?.send(H)
        }, async (j) => {
            if (A.signal.aborted) return;
            let H = {
                jsonrpc: "2.0",
                id: q.id,
                error: {
                    code: Number.isSafeInteger(j.code) ? j.code : V5.InternalError,
                    message: j.message ?? "Internal error",
                    ...j.data !== void 0 && {
                        data: j.data
                    }
                }
            };
            if (Y && this._taskMessageQueue) await this._enqueueTaskMessage(Y, {
                type: "error",
                message: H,
                timestamp: Date.now()
            }, z?.sessionId);
            else await z?.send(H)
        }).catch((j) => this._onerror(Error(`Failed to send response: ${j}`))).finally(() => {
            if (this._requestHandlerAbortControllers.get(q.id) === A) this._requestHandlerAbortControllers.delete(q.id)
        })
    }
    _onprogress(q) {
        let {
            progressToken: K,
            ..._
        } = q.params, z = Number(K), Y = this._progressHandlers.get(z);
        if (!Y) {
            this._onerror(Error(`Received a progress notification for an unknown token: ${JSON.stringify(q)}`));
            return
        }
        let A = this._responseHandlers.get(z),
            O = this._timeoutInfo.get(z);
        if (O && A && O.resetTimeoutOnProgress) try {
            this._resetTimeout(z)
        } catch (w) {
            this._responseHandlers.delete(z), this._progressHandlers.delete(z), this._cleanupTimeout(z), A(w);
            return
        }
        Y(_)
    }
    _onresponse(q) {
        let K = Number(q.id),
            _ = this._requestResolvers.get(K);
        if (_) {
            if (this._requestResolvers.delete(K), oY6(q)) _(q);
            else {
                let A = new SK(q.error.code, q.error.message, q.error.data);
                _(A)
            }
            return
        }
        let z = this._responseHandlers.get(K);
        if (z === void 0) {
            this._onerror(Error(`Received a response for an unknown message ID: ${JSON.stringify(q)}`));
            return
        }
        this._responseHandlers.delete(K), this._cleanupTimeout(K);
        let Y = !1;
        if (oY6(q) && q.result && typeof q.result === "object") {
            let A = q.result;
            if (A.task && typeof A.task === "object") {
                let O = A.task;
                if (typeof O.taskId === "string") Y = !0, this._taskProgressTokens.set(O.taskId, K)
            }
        }
        if (!Y) this._progressHandlers.delete(K);
        if (oY6(q)) z(q);
        else {
            let A = SK.fromError(q.error.code, q.error.message, q.error.data);
            z(A)
        }
    }
    get transport() {
        return this._transport
    }
    async close() {
        await this._transport?.close()
    }
    async * requestStream(q, K, _) {
        let {
            task: z
        } = _ ?? {};
        if (!z) {
            try {
                yield {
                    type: "result",
                    result: await this.request(q, K, _)
                }
            } catch (A) {
                yield {
                    type: "error",
                    error: A instanceof SK ? A : new SK(V5.InternalError, String(A))
                }
            }
            return
        }
        let Y;
        try {
            let A = await this.request(q, Or, _);
            if (A.task) Y = A.task.taskId, yield {
                type: "taskCreated",
                task: A.task
            };
            else throw new SK(V5.InternalError, "Task creation did not return a task");
            while (!0) {
                let O = await this.getTask({
                    taskId: Y
                }, _);
                if (yield {
                        type: "taskStatus",
                        task: O
                    }, Y16(O.status)) {
                    if (O.status === "completed") yield {
                        type: "result",
                        result: await this.getTaskResult({
                            taskId: Y
                        }, K, _)
                    };
                    else if (O.status === "failed") yield {
                        type: "error",
                        error: new SK(V5.InternalError, `Task ${Y} failed`)
                    };
                    else if (O.status === "cancelled") yield {
                        type: "error",
                        error: new SK(V5.InternalError, `Task ${Y} was cancelled`)
                    };
                    return
                }
                if (O.status === "input_required") {
                    yield {
                        type: "result",
                        result: await this.getTaskResult({
                            taskId: Y
                        }, K, _)
                    };
                    return
                }
                let w = O.pollInterval ?? this._options?.defaultTaskPollInterval ?? 1000;
                await new Promise(($) => setTimeout($, w)), _?.signal?.throwIfAborted()
            }
        } catch (A) {
            yield {
                type: "error",
                error: A instanceof SK ? A : new SK(V5.InternalError, String(A))
            }
        }
    }
    request(q, K, _) {
        let {
            relatedRequestId: z,
            resumptionToken: Y,
            onresumptiontoken: A,
            task: O,
            relatedTask: w
        } = _ ?? {};
        return new Promise(($, j) => {
            let H = (Z) => {
                j(Z)
            };
            if (!this._transport) {
                H(Error("Not connected"));
                return
            }
            if (this._options?.enforceStrictCapabilities === !0) try {
                if (this.assertCapabilityForMethod(q.method), O) this.assertTaskCapability(q.method)
            } catch (Z) {
                H(Z);
                return
            }
            _?.signal?.throwIfAborted();
            let J = this._requestMessageId++,
                X = {
                    ...q,
                    jsonrpc: "2.0",
                    id: J
                };
            if (_?.onprogress) this._progressHandlers.set(J, _.onprogress), X.params = {
                ...q.params,
                _meta: {
                    ...q.params?._meta || {},
                    progressToken: J
                }
            };
            if (O) X.params = {
                ...X.params,
                task: O
            };
            if (w) X.params = {
                ...X.params,
                _meta: {
                    ...X.params?._meta || {},
                    [_16]: w
                }
            };
            let M = (Z) => {
                this._responseHandlers.delete(J), this._progressHandlers.delete(J), this._cleanupTimeout(J), this._transport?.send({
                    jsonrpc: "2.0",
                    method: "notifications/cancelled",
                    params: {
                        requestId: J,
                        reason: String(Z)
                    }
                }, {
                    relatedRequestId: z,
                    resumptionToken: Y,
                    onresumptiontoken: A
                }).catch((f) => this._onerror(Error(`Failed to send cancellation: ${f}`)));
                let G = Z instanceof SK ? Z : new SK(V5.RequestTimeout, String(Z));
                j(G)
            };
            this._responseHandlers.set(J, (Z) => {
                if (_?.signal?.aborted) return;
                if (Z instanceof Error) return j(Z);
                try {
                    let G = DV(K, Z.result);
                    if (!G.success) j(G.error);
                    else $(G.data)
                } catch (G) {
                    j(G)
                }
            }), _?.signal?.addEventListener("abort", () => {
                M(_?.signal?.reason)
            });
            let P = _?.timeout ?? mL5,
                W = () => M(SK.fromError(V5.RequestTimeout, "Request timed out", {
                    timeout: P
                }));
            this._setupTimeout(J, P, _?.maxTotalTimeout, W, _?.resetTimeoutOnProgress ?? !1);
            let D = w?.taskId;
            if (D) {
                let Z = (G) => {
                    let f = this._responseHandlers.get(J);
                    if (f) f(G);
                    else this._onerror(Error(`Response handler missing for side-channeled request ${J}`))
                };
                this._requestResolvers.set(J, Z), this._enqueueTaskMessage(D, {
                    type: "request",
                    message: X,
                    timestamp: Date.now()
                }).catch((G) => {
                    this._cleanupTimeout(J), j(G)
                })
            } else this._transport.send(X, {
                relatedRequestId: z,
                resumptionToken: Y,
                onresumptiontoken: A
            }).catch((Z) => {
                this._cleanupTimeout(J), j(Z)
            })
        })
    }
    async getTask(q, K) {
        return this.request({
            method: "tasks/get",
            params: q
        }, g$8, K)
    }
    async getTaskResult(q, K, _) {
        return this.request({
            method: "tasks/result",
            params: q
        }, K, _)
    }
    async listTasks(q, K) {
        return this.request({
            method: "tasks/list",
            params: q
        }, d$8, K)
    }
    async cancelTask(q, K) {
        return this.request({
            method: "tasks/cancel",
            params: q
        }, ME7, K)
    }
    async notification(q, K) {
        if (!this._transport) throw Error("Not connected");
        this.assertNotificationCapability(q.method);
        let _ = K?.relatedTask?.taskId;
        if (_) {
            let O = {
                ...q,
                jsonrpc: "2.0",
                params: {
                    ...q.params,
                    _meta: {
                        ...q.params?._meta || {},
                        [_16]: K.relatedTask
                    }
                }
            };
            await this._enqueueTaskMessage(_, {
                type: "notification",
                message: O,
                timestamp: Date.now()
            });
            return
        }
        if ((this._options?.debouncedNotificationMethods ?? []).includes(q.method) && !q.params && !K?.relatedRequestId && !K?.relatedTask) {
            if (this._pendingDebouncedNotifications.has(q.method)) return;
            this._pendingDebouncedNotifications.add(q.method), Promise.resolve().then(() => {
                if (this._pendingDebouncedNotifications.delete(q.method), !this._transport) return;
                let O = {
                    ...q,
                    jsonrpc: "2.0"
                };
                if (K?.relatedTask) O = {
                    ...O,
                    params: {
                        ...O.params,
                        _meta: {
                            ...O.params?._meta || {},
                            [_16]: K.relatedTask
                        }
                    }
                };
                this._transport?.send(O, K).catch((w) => this._onerror(w))
            });
            return
        }
        let A = {
            ...q,
            jsonrpc: "2.0"
        };
        if (K?.relatedTask) A = {
            ...A,
            params: {
                ...A.params,
                _meta: {
                    ...A.params?._meta || {},
                    [_16]: K.relatedTask
                }
            }
        };
        await this._transport.send(A, K)
    }
    setRequestHandler(q, K) {
        let _ = f91(q);
        this.assertRequestHandlerCapability(_), this._requestHandlers.set(_, (z, Y) => {
            let A = G91(q, z);
            return Promise.resolve(K(A, Y))
        })
    }
    removeRequestHandler(q) {
        this._requestHandlers.delete(q)
    }
    assertCanSetRequestHandler(q) {
        if (this._requestHandlers.has(q)) throw Error(`A request handler for ${q} already exists, which would be overridden`)
    }
    setNotificationHandler(q, K) {
        let _ = f91(q);
        this._notificationHandlers.set(_, (z) => {
            let Y = G91(q, z);
            return Promise.resolve(K(Y))
        })
    }
    removeNotificationHandler(q) {
        this._notificationHandlers.delete(q)
    }
    _cleanupTaskProgressHandler(q) {
        let K = this._taskProgressTokens.get(q);
        if (K !== void 0) this._progressHandlers.delete(K), this._taskProgressTokens.delete(q)
    }
    async _enqueueTaskMessage(q, K, _) {
        if (!this._taskStore || !this._taskMessageQueue) throw Error("Cannot enqueue task message: taskStore and taskMessageQueue are not configured");
        let z = this._options?.maxTaskQueueSize;
        await this._taskMessageQueue.enqueue(q, K, _, z)
    }
    async _clearTaskQueue(q, K) {
        if (this._taskMessageQueue) {
            let _ = await this._taskMessageQueue.dequeueAll(q, K);
            for (let z of _)
                if (z.type === "request" && Gg6(z.message)) {
                    let Y = z.message.id,
                        A = this._requestResolvers.get(Y);
                    if (A) A(new SK(V5.InternalError, "Task cancelled or completed")), this._requestResolvers.delete(Y);
                    else this._onerror(Error(`Resolver missing for request ${Y} during task ${q} cleanup`))
                }
        }
    }
    async _waitForTaskUpdate(q, K) {
        let _ = this._options?.defaultTaskPollInterval ?? 1000;
        try {
            let z = await this._taskStore?.getTask(q);
            if (z?.pollInterval) _ = z.pollInterval
        } catch {}
        return new Promise((z, Y) => {
            if (K.aborted) {
                Y(new SK(V5.InvalidRequest, "Request cancelled"));
                return
            }
            let A = setTimeout(z, _);
            K.addEventListener("abort", () => {
                clearTimeout(A), Y(new SK(V5.InvalidRequest, "Request cancelled"))
            }, {
                once: !0
            })
        })
    }
    requestTaskStore(q, K) {
        let _ = this._taskStore;
        if (!_) throw Error("No task store configured");
        return {
            createTask: async (z) => {
                if (!q) throw Error("No request provided");
                return await _.createTask(z, q.id, {
                    method: q.method,
                    params: q.params
                }, K)
            },
            getTask: async (z) => {
                let Y = await _.getTask(z, K);
                if (!Y) throw new SK(V5.InvalidParams, "Failed to retrieve task: Task not found");
                return Y
            },
            storeTaskResult: async (z, Y, A) => {
                await _.storeTaskResult(z, Y, A, K);
                let O = await _.getTask(z, K);
                if (O) {
                    let w = Ng6.parse({
                        method: "notifications/tasks/status",
                        params: O
                    });
                    if (await this.notification(w), Y16(O.status)) this._cleanupTaskProgressHandler(z)
                }
            },
            getTaskResult: (z) => {
                return _.getTaskResult(z, K)
            },
            updateTaskStatus: async (z, Y, A) => {
                let O = await _.getTask(z, K);
                if (!O) throw new SK(V5.InvalidParams, `Task "${z}" not found - it may have been cleaned up`);
                if (Y16(O.status)) throw new SK(V5.InvalidParams, `Cannot update task "${z}" from terminal status "${O.status}" to "${Y}". Terminal states (completed, failed, cancelled) cannot transition to other states.`);
                await _.updateTaskStatus(z, Y, A, K);
                let w = await _.getTask(z, K);
                if (w) {
                    let $ = Ng6.parse({
                        method: "notifications/tasks/status",
                        params: w
                    });
                    if (await this.notification($), Y16(w.status)) this._cleanupTaskProgressHandler(z)
                }
            },
            listTasks: (z) => {
                return _.listTasks(z, K)
            }
        }
    }
}
// @from(Ln 27547, Col 0)
function NE7(q) {
    return q !== null && typeof q === "object" && !Array.isArray(q)
}
// @from(Ln 27551, Col 0)
function a$8(q, K) {
    let _ = {
        ...q
    };
    for (let z in K) {
        let Y = z,
            A = K[Y];
        if (A === void 0) continue;
        let O = _[Y];
        if (NE7(O) && NE7(A)) _[Y] = {
            ...O,
            ...A
        };
        else _[Y] = A
    }
    return _
}
// @from(Ln 27568, Col 4)
mL5 = 60000
// @from(Ln 27569, Col 4)
v91 = L(() => {
    Hg6();
    _P();
    kE7()
})
// @from(Ln 27574, Col 4)
gg6 = p((LE7) => {
    Object.defineProperty(LE7, "__esModule", {
        value: !0
    });
    LE7.regexpCode = LE7.getEsmExportName = LE7.getProperty = LE7.safeStringify = LE7.stringify = LE7.strConcat = LE7.addCodeArg = LE7.str = LE7._ = LE7.nil = LE7._Code = LE7.Name = LE7.IDENTIFIER = LE7._CodeOrName = void 0;
    class s$8 {}
    LE7._CodeOrName = s$8;
    LE7.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class FZ6 extends s$8 {
        constructor(q) {
            super();
            if (!LE7.IDENTIFIER.test(q)) throw Error("CodeGen: name must be a valid identifier");
            this.str = q
        }
        toString() {
            return this.str
        }
        emptyStr() {
            return !1
        }
        get names() {
            return {
                [this.str]: 1
            }
        }
    }
    LE7.Name = FZ6;
    class Wm extends s$8 {
        constructor(q) {
            super();
            this._items = typeof q === "string" ? [q] : q
        }
        toString() {
            return this.str
        }
        emptyStr() {
            if (this._items.length > 1) return !1;
            let q = this._items[0];
            return q === "" || q === '""'
        }
        get str() {
            var q;
            return (q = this._str) !== null && q !== void 0 ? q : this._str = this._items.reduce((K, _) => `${K}${_}`, "")
        }
        get names() {
            var q;
            return (q = this._names) !== null && q !== void 0 ? q : this._names = this._items.reduce((K, _) => {
                if (_ instanceof FZ6) K[_.str] = (K[_.str] || 0) + 1;
                return K
            }, {})
        }
    }
    LE7._Code = Wm;
    LE7.nil = new Wm("");

    function EE7(q, ...K) {
        let _ = [q[0]],
            z = 0;
        while (z < K.length) V91(_, K[z]), _.push(q[++z]);
        return new Wm(_)
    }
    LE7._ = EE7;
    var T91 = new Wm("+");

    function yE7(q, ...K) {
        let _ = [Fg6(q[0])],
            z = 0;
        while (z < K.length) _.push(T91), V91(_, K[z]), _.push(T91, Fg6(q[++z]));
        return BL5(_), new Wm(_)
    }
    LE7.str = yE7;

    function V91(q, K) {
        if (K instanceof Wm) q.push(...K._items);
        else if (K instanceof FZ6) q.push(K);
        else q.push(gL5(K))
    }
    LE7.addCodeArg = V91;

    function BL5(q) {
        let K = 1;
        while (K < q.length - 1) {
            if (q[K] === T91) {
                let _ = pL5(q[K - 1], q[K + 1]);
                if (_ !== void 0) {
                    q.splice(K - 1, 3, _);
                    continue
                }
                q[K++] = "+"
            }
            K++
        }
    }

    function pL5(q, K) {
        if (K === '""') return q;
        if (q === '""') return K;
        if (typeof q == "string") {
            if (K instanceof FZ6 || q[q.length - 1] !== '"') return;
            if (typeof K != "string") return `${q.slice(0,-1)}${K}"`;
            if (K[0] === '"') return q.slice(0, -1) + K.slice(1);
            return
        }
        if (typeof K == "string" && K[0] === '"' && !(q instanceof FZ6)) return `"${q}${K.slice(1)}`;
        return
    }

    function FL5(q, K) {
        return K.emptyStr() ? q : q.emptyStr() ? K : yE7`${q}${K}`
    }
    LE7.strConcat = FL5;

    function gL5(q) {
        return typeof q == "number" || typeof q == "boolean" || q === null ? q : Fg6(Array.isArray(q) ? q.join(",") : q)
    }

    function UL5(q) {
        return new Wm(Fg6(q))
    }
    LE7.stringify = UL5;

    function Fg6(q) {
        return JSON.stringify(q).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")
    }
    LE7.safeStringify = Fg6;

    function QL5(q) {
        return typeof q == "string" && LE7.IDENTIFIER.test(q) ? new Wm(`.${q}`) : EE7`[${q}]`
    }
    LE7.getProperty = QL5;

    function dL5(q) {
        if (typeof q == "string" && LE7.IDENTIFIER.test(q)) return new Wm(`${q}`);
        throw Error(`CodeGen: invalid export name: ${q}, use explicit $id name mapping`)
    }
    LE7.getEsmExportName = dL5;

    function cL5(q) {
        return new Wm(q.toString())
    }
    LE7.regexpCode = cL5
})
// @from(Ln 27716, Col 4)
y91 = p((CE7) => {
    Object.defineProperty(CE7, "__esModule", {
        value: !0
    });
    CE7.ValueScope = CE7.ValueScopeName = CE7.Scope = CE7.varKinds = CE7.UsedValueState = void 0;
    var gN = gg6();
    class RE7 extends Error {
        constructor(q) {
            super(`CodeGen: "code" for ${q} not defined`);
            this.value = q.value
        }
    }
    var e$8;
    (function(q) {
        q[q.Started = 0] = "Started", q[q.Completed = 1] = "Completed"
    })(e$8 || (CE7.UsedValueState = e$8 = {}));
    CE7.varKinds = {
        const: new gN.Name("const"),
        let: new gN.Name("let"),
        var: new gN.Name("var")
    };
    class N91 {
        constructor({
            prefixes: q,
            parent: K
        } = {}) {
            this._names = {}, this._prefixes = q, this._parent = K
        }
        toName(q) {
            return q instanceof gN.Name ? q : this.name(q)
        }
        name(q) {
            return new gN.Name(this._newName(q))
        }
        _newName(q) {
            let K = this._names[q] || this._nameGroup(q);
            return `${q}${K.index++}`
        }
        _nameGroup(q) {
            var K, _;
            if (((_ = (K = this._parent) === null || K === void 0 ? void 0 : K._prefixes) === null || _ === void 0 ? void 0 : _.has(q)) || this._prefixes && !this._prefixes.has(q)) throw Error(`CodeGen: prefix "${q}" is not allowed in this scope`);
            return this._names[q] = {
                prefix: q,
                index: 0
            }
        }
    }
    CE7.Scope = N91;
    class E91 extends gN.Name {
        constructor(q, K) {
            super(K);
            this.prefix = q
        }
        setValue(q, {
            property: K,
            itemIndex: _
        }) {
            this.value = q, this.scopePath = gN._`.${new gN.Name(K)}[${_}]`
        }
    }
    CE7.ValueScopeName = E91;
    var zh5 = gN._`\n`;
    class SE7 extends N91 {
        constructor(q) {
            super(q);
            this._values = {}, this._scope = q.scope, this.opts = {
                ...q,
                _n: q.lines ? zh5 : gN.nil
            }
        }
        get() {
            return this._scope
        }
        name(q) {
            return new E91(q, this._newName(q))
        }
        value(q, K) {
            var _;
            if (K.ref === void 0) throw Error("CodeGen: ref must be passed in value");
            let z = this.toName(q),
                {
                    prefix: Y
                } = z,
                A = (_ = K.key) !== null && _ !== void 0 ? _ : K.ref,
                O = this._values[Y];
            if (O) {
                let j = O.get(A);
                if (j) return j
            } else O = this._values[Y] = new Map;
            O.set(A, z);
            let w = this._scope[Y] || (this._scope[Y] = []),
                $ = w.length;
            return w[$] = K.ref, z.setValue(K, {
                property: Y,
                itemIndex: $
            }), z
        }
        getValue(q, K) {
            let _ = this._values[q];
            if (!_) return;
            return _.get(K)
        }
        scopeRefs(q, K = this._values) {
            return this._reduceValues(K, (_) => {
                if (_.scopePath === void 0) throw Error(`CodeGen: name "${_}" has no value`);
                return gN._`${q}${_.scopePath}`
            })
        }
        scopeCode(q = this._values, K, _) {
            return this._reduceValues(q, (z) => {
                if (z.value === void 0) throw Error(`CodeGen: name "${z}" has no value`);
                return z.value.code
            }, K, _)
        }
        _reduceValues(q, K, _ = {}, z) {
            let Y = gN.nil;
            for (let A in q) {
                let O = q[A];
                if (!O) continue;
                let w = _[A] = _[A] || new Map;
                O.forEach(($) => {
                    if (w.has($)) return;
                    w.set($, e$8.Started);
                    let j = K($);
                    if (j) {
                        let H = this.opts.es5 ? CE7.varKinds.var : CE7.varKinds.const;
                        Y = gN._`${Y}${H} ${$} = ${j};${this.opts._n}`
                    } else if (j = z === null || z === void 0 ? void 0 : z($)) Y = gN._`${Y}${j}${this.opts._n}`;
                    else throw new RE7($);
                    w.set($, e$8.Completed)
                })
            }
            return Y
        }
    }
    CE7.ValueScope = SE7
})