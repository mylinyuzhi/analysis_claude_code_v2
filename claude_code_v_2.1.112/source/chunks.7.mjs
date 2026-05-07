
// @from(Ln 16314, Col 4)
sV7 = (q, K) => {
        q.name = "$ZodError", Object.defineProperty(q, "_zod", {
            value: q._zod,
            enumerable: !1
        }), Object.defineProperty(q, "issues", {
            value: K,
            enumerable: !1
        }), Object.defineProperty(q, "message", {
            get() {
                return JSON.stringify(K, qq1, 2)
            },
            enumerable: !0
        })
    }
// @from(Ln 16328, Col 4)
BF6
// @from(Ln 16328, Col 9)
NZ6
// @from(Ln 16329, Col 4)
Jq1 = L(() => {
    TZ6();
    c3();
    BF6 = b1("$ZodError", sV7), NZ6 = b1("$ZodError", sV7, {
        Parent: Error
    })
})
// @from(Ln 16336, Col 4)
R28 = (q) => (K, _, z, Y) => {
        let A = z ? Object.assign(z, {
                async: !1
            }) : {
                async: !1
            },
            O = K._zod.run({
                value: _,
                issues: []
            }, A);
        if (O instanceof Promise) throw new ti;
        if (O.issues.length) {
            let w = new(Y?.Err ?? q)(O.issues.map(($) => wh($, A, qP())));
            throw h28(w, Y?.callee), w
        }
        return O.value
    }
// @from(Ln 16353, Col 4)
gF6
// @from(Ln 16353, Col 9)
S28 = (q) => async (K, _, z, Y) => {
        let A = z ? Object.assign(z, {
                async: !0
            }) : {
                async: !0
            },
            O = K._zod.run({
                value: _,
                issues: []
            }, A);
        if (O instanceof Promise) O = await O;
        if (O.issues.length) {
            let w = new(Y?.Err ?? q)(O.issues.map(($) => wh($, A, qP())));
            throw h28(w, Y?.callee), w
        }
        return O.value
    }
// @from(Ln 16369, Col 7)
UF6
// @from(Ln 16369, Col 12)
C28 = (q) => (K, _, z) => {
        let Y = z ? {
                ...z,
                async: !1
            } : {
                async: !1
            },
            A = K._zod.run({
                value: _,
                issues: []
            }, Y);
        if (A instanceof Promise) throw new ti;
        return A.issues.length ? {
            success: !1,
            error: new(q ?? BF6)(A.issues.map((O) => wh(O, Y, qP())))
        } : {
            success: !0,
            data: A.value
        }
    }
// @from(Ln 16388, Col 7)
EZ6
// @from(Ln 16388, Col 12)
b28 = (q) => async (K, _, z) => {
        let Y = z ? Object.assign(z, {
                async: !0
            }) : {
                async: !0
            },
            A = K._zod.run({
                value: _,
                issues: []
            }, Y);
        if (A instanceof Promise) A = await A;
        return A.issues.length ? {
            success: !1,
            error: new q(A.issues.map((O) => wh(O, Y, qP())))
        } : {
            success: !0,
            data: A.value
        }
    }
// @from(Ln 16406, Col 7)
QF6
// @from(Ln 16407, Col 4)
I28 = L(() => {
    TZ6();
    Jq1();
    c3();
    gF6 = R28(NZ6), UF6 = S28(NZ6), EZ6 = C28(NZ6), QF6 = b28(NZ6)
})
// @from(Ln 16413, Col 4)
cY6 = {}
// @from(Ln 16458, Col 0)
function Tq1() {
    return new RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")
}
// @from(Ln 16462, Col 0)
function qk7(q) {
    return typeof q.precision === "number" ? q.precision === -1 ? "(?:[01]\\d|2[0-3]):[0-5]\\d" : q.precision === 0 ? "(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d" : `(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{${q.precision}}` : "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?"
}
// @from(Ln 16466, Col 0)
function Sq1(q) {
    return new RegExp(`^${qk7(q)}$`)
}
// @from(Ln 16470, Col 0)
function Cq1(q) {
    let K = qk7({
            precision: q.precision
        }),
        _ = ["Z"];
    if (q.local) _.push("");
    if (q.offset) _.push("([+-]\\d{2}:\\d{2})");
    let z = `${K}(?:${_.join("|")})`;
    return new RegExp(`^${eV7}T(?:${z})$`)
}
// @from(Ln 16480, Col 4)
Xq1
// @from(Ln 16480, Col 9)
Mq1
// @from(Ln 16480, Col 14)
Pq1
// @from(Ln 16480, Col 19)
Wq1
// @from(Ln 16480, Col 24)
Dq1
// @from(Ln 16480, Col 29)
Zq1
// @from(Ln 16480, Col 34)
fq1
// @from(Ln 16480, Col 39)
Uk5
// @from(Ln 16480, Col 44)
Gq1
// @from(Ln 16480, Col 49)
dY6 = (q) => {
        if (!q) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/;
        return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${q}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`)
    }
// @from(Ln 16484, Col 4)
Qk5
// @from(Ln 16484, Col 9)
dk5
// @from(Ln 16484, Col 14)
ck5
// @from(Ln 16484, Col 19)
vq1
// @from(Ln 16484, Col 24)
lk5
// @from(Ln 16484, Col 29)
nk5
// @from(Ln 16484, Col 34)
ik5
// @from(Ln 16484, Col 39)
rk5
// @from(Ln 16484, Col 44)
ok5 = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$"
// @from(Ln 16485, Col 4)
Vq1
// @from(Ln 16485, Col 9)
kq1
// @from(Ln 16485, Col 14)
Nq1
// @from(Ln 16485, Col 19)
Eq1
// @from(Ln 16485, Col 24)
yq1
// @from(Ln 16485, Col 29)
x28
// @from(Ln 16485, Col 34)
Lq1
// @from(Ln 16485, Col 39)
ak5
// @from(Ln 16485, Col 44)
hq1
// @from(Ln 16485, Col 49)
eV7 = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))"
// @from(Ln 16486, Col 4)
Rq1
// @from(Ln 16486, Col 9)
bq1 = (q) => {
        let K = q ? `[\\s\\S]{${q?.minimum??0},${q?.maximum??""}}` : "[\\s\\S]*";
        return new RegExp(`^${K}$`)
    }
// @from(Ln 16490, Col 4)
Iq1
// @from(Ln 16490, Col 9)
xq1
// @from(Ln 16490, Col 14)
uq1
// @from(Ln 16490, Col 19)
mq1
// @from(Ln 16490, Col 24)
Bq1
// @from(Ln 16490, Col 29)
pq1
// @from(Ln 16490, Col 34)
Fq1
// @from(Ln 16490, Col 39)
gq1
// @from(Ln 16491, Col 4)
u28 = L(() => {
    Xq1 = /^[cC][^\s-]{8,}$/, Mq1 = /^[0-9a-z]+$/, Pq1 = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Wq1 = /^[0-9a-vA-V]{20}$/, Dq1 = /^[A-Za-z0-9]{27}$/, Zq1 = /^[a-zA-Z0-9_-]{21}$/, fq1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Uk5 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Gq1 = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Qk5 = dY6(4), dk5 = dY6(6), ck5 = dY6(7), vq1 = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, lk5 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, nk5 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, ik5 = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u, rk5 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    Vq1 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, kq1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/, Nq1 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Eq1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, yq1 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, x28 = /^[A-Za-z0-9_-]*$/, Lq1 = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/, ak5 = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, hq1 = /^\+(?:[0-9]){6,14}[0-9]$/, Rq1 = new RegExp(`^${eV7}$`);
    Iq1 = /^\d+n?$/, xq1 = /^\d+$/, uq1 = /^-?\d+(?:\.\d+)?/i, mq1 = /true|false/i, Bq1 = /null/i, pq1 = /undefined/i, Fq1 = /^[^A-Z]*$/, gq1 = /^[^a-z]*$/
})
// @from(Ln 16497, Col 0)
function Kk7(q, K, _) {
    if (q.issues.length) K.issues.push(...pN(_, q.issues))
}
// @from(Ln 16500, Col 4)
aH
// @from(Ln 16500, Col 8)
_k7
// @from(Ln 16500, Col 13)
m28
// @from(Ln 16500, Col 18)
B28
// @from(Ln 16500, Col 23)
Uq1
// @from(Ln 16500, Col 28)
Qq1
// @from(Ln 16500, Col 33)
dq1
// @from(Ln 16500, Col 38)
cq1
// @from(Ln 16500, Col 43)
lq1
// @from(Ln 16500, Col 48)
nq1
// @from(Ln 16500, Col 53)
iq1
// @from(Ln 16500, Col 58)
rq1
// @from(Ln 16500, Col 63)
oq1
// @from(Ln 16500, Col 68)
yZ6
// @from(Ln 16500, Col 73)
aq1
// @from(Ln 16500, Col 78)
sq1
// @from(Ln 16500, Col 83)
tq1
// @from(Ln 16500, Col 88)
eq1
// @from(Ln 16500, Col 93)
q41
// @from(Ln 16500, Col 98)
K41
// @from(Ln 16500, Col 103)
_41
// @from(Ln 16500, Col 108)
z41
// @from(Ln 16500, Col 113)
Y41
// @from(Ln 16501, Col 4)
p28 = L(() => {
    TZ6();
    u28();
    c3();
    aH = b1("$ZodCheck", (q, K) => {
        var _;
        q._zod ?? (q._zod = {}), q._zod.def = K, (_ = q._zod).onattach ?? (_.onattach = [])
    }), _k7 = {
        number: "number",
        bigint: "bigint",
        object: "date"
    }, m28 = b1("$ZodCheckLessThan", (q, K) => {
        aH.init(q, K);
        let _ = _k7[typeof K.value];
        q._zod.onattach.push((z) => {
            let Y = z._zod.bag,
                A = (K.inclusive ? Y.maximum : Y.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
            if (K.value < A)
                if (K.inclusive) Y.maximum = K.value;
                else Y.exclusiveMaximum = K.value
        }), q._zod.check = (z) => {
            if (K.inclusive ? z.value <= K.value : z.value < K.value) return;
            z.issues.push({
                origin: _,
                code: "too_big",
                maximum: K.value,
                input: z.value,
                inclusive: K.inclusive,
                inst: q,
                continue: !K.abort
            })
        }
    }), B28 = b1("$ZodCheckGreaterThan", (q, K) => {
        aH.init(q, K);
        let _ = _k7[typeof K.value];
        q._zod.onattach.push((z) => {
            let Y = z._zod.bag,
                A = (K.inclusive ? Y.minimum : Y.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
            if (K.value > A)
                if (K.inclusive) Y.minimum = K.value;
                else Y.exclusiveMinimum = K.value
        }), q._zod.check = (z) => {
            if (K.inclusive ? z.value >= K.value : z.value > K.value) return;
            z.issues.push({
                origin: _,
                code: "too_small",
                minimum: K.value,
                input: z.value,
                inclusive: K.inclusive,
                inst: q,
                continue: !K.abort
            })
        }
    }), Uq1 = b1("$ZodCheckMultipleOf", (q, K) => {
        aH.init(q, K), q._zod.onattach.push((_) => {
            var z;
            (z = _._zod.bag).multipleOf ?? (z.multipleOf = K.value)
        }), q._zod.check = (_) => {
            if (typeof _.value !== typeof K.value) throw Error("Cannot mix number and bigint in multiple_of check.");
            if (typeof _.value === "bigint" ? _.value % K.value === BigInt(0) : Kq1(_.value, K.value) === 0) return;
            _.issues.push({
                origin: typeof _.value,
                code: "not_multiple_of",
                divisor: K.value,
                input: _.value,
                inst: q,
                continue: !K.abort
            })
        }
    }), Qq1 = b1("$ZodCheckNumberFormat", (q, K) => {
        aH.init(q, K), K.format = K.format || "float64";
        let _ = K.format?.includes("int"),
            z = _ ? "int" : "number",
            [Y, A] = Oq1[K.format];
        q._zod.onattach.push((O) => {
            let w = O._zod.bag;
            if (w.format = K.format, w.minimum = Y, w.maximum = A, _) w.pattern = xq1
        }), q._zod.check = (O) => {
            let w = O.value;
            if (_) {
                if (!Number.isInteger(w)) {
                    O.issues.push({
                        expected: z,
                        format: K.format,
                        code: "invalid_type",
                        input: w,
                        inst: q
                    });
                    return
                }
                if (!Number.isSafeInteger(w)) {
                    if (w > 0) O.issues.push({
                        input: w,
                        code: "too_big",
                        maximum: Number.MAX_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst: q,
                        origin: z,
                        continue: !K.abort
                    });
                    else O.issues.push({
                        input: w,
                        code: "too_small",
                        minimum: Number.MIN_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst: q,
                        origin: z,
                        continue: !K.abort
                    });
                    return
                }
            }
            if (w < Y) O.issues.push({
                origin: "number",
                input: w,
                code: "too_small",
                minimum: Y,
                inclusive: !0,
                inst: q,
                continue: !K.abort
            });
            if (w > A) O.issues.push({
                origin: "number",
                input: w,
                code: "too_big",
                maximum: A,
                inst: q
            })
        }
    }), dq1 = b1("$ZodCheckBigIntFormat", (q, K) => {
        aH.init(q, K);
        let [_, z] = wq1[K.format];
        q._zod.onattach.push((Y) => {
            let A = Y._zod.bag;
            A.format = K.format, A.minimum = _, A.maximum = z
        }), q._zod.check = (Y) => {
            let A = Y.value;
            if (A < _) Y.issues.push({
                origin: "bigint",
                input: A,
                code: "too_small",
                minimum: _,
                inclusive: !0,
                inst: q,
                continue: !K.abort
            });
            if (A > z) Y.issues.push({
                origin: "bigint",
                input: A,
                code: "too_big",
                maximum: z,
                inst: q
            })
        }
    }), cq1 = b1("$ZodCheckMaxSize", (q, K) => {
        aH.init(q, K), q._zod.when = (_) => {
            let z = _.value;
            return !t86(z) && z.size !== void 0
        }, q._zod.onattach.push((_) => {
            let z = _._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
            if (K.maximum < z) _._zod.bag.maximum = K.maximum
        }), q._zod.check = (_) => {
            let z = _.value;
            if (z.size <= K.maximum) return;
            _.issues.push({
                origin: uF6(z),
                code: "too_big",
                maximum: K.maximum,
                input: z,
                inst: q,
                continue: !K.abort
            })
        }
    }), lq1 = b1("$ZodCheckMinSize", (q, K) => {
        aH.init(q, K), q._zod.when = (_) => {
            let z = _.value;
            return !t86(z) && z.size !== void 0
        }, q._zod.onattach.push((_) => {
            let z = _._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
            if (K.minimum > z) _._zod.bag.minimum = K.minimum
        }), q._zod.check = (_) => {
            let z = _.value;
            if (z.size >= K.minimum) return;
            _.issues.push({
                origin: uF6(z),
                code: "too_small",
                minimum: K.minimum,
                input: z,
                inst: q,
                continue: !K.abort
            })
        }
    }), nq1 = b1("$ZodCheckSizeEquals", (q, K) => {
        aH.init(q, K), q._zod.when = (_) => {
            let z = _.value;
            return !t86(z) && z.size !== void 0
        }, q._zod.onattach.push((_) => {
            let z = _._zod.bag;
            z.minimum = K.size, z.maximum = K.size, z.size = K.size
        }), q._zod.check = (_) => {
            let z = _.value,
                Y = z.size;
            if (Y === K.size) return;
            let A = Y > K.size;
            _.issues.push({
                origin: uF6(z),
                ...A ? {
                    code: "too_big",
                    maximum: K.size
                } : {
                    code: "too_small",
                    minimum: K.size
                },
                inclusive: !0,
                exact: !0,
                input: _.value,
                inst: q,
                continue: !K.abort
            })
        }
    }), iq1 = b1("$ZodCheckMaxLength", (q, K) => {
        aH.init(q, K), q._zod.when = (_) => {
            let z = _.value;
            return !t86(z) && z.length !== void 0
        }, q._zod.onattach.push((_) => {
            let z = _._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
            if (K.maximum < z) _._zod.bag.maximum = K.maximum
        }), q._zod.check = (_) => {
            let z = _.value;
            if (z.length <= K.maximum) return;
            let A = mF6(z);
            _.issues.push({
                origin: A,
                code: "too_big",
                maximum: K.maximum,
                inclusive: !0,
                input: z,
                inst: q,
                continue: !K.abort
            })
        }
    }), rq1 = b1("$ZodCheckMinLength", (q, K) => {
        aH.init(q, K), q._zod.when = (_) => {
            let z = _.value;
            return !t86(z) && z.length !== void 0
        }, q._zod.onattach.push((_) => {
            let z = _._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
            if (K.minimum > z) _._zod.bag.minimum = K.minimum
        }), q._zod.check = (_) => {
            let z = _.value;
            if (z.length >= K.minimum) return;
            let A = mF6(z);
            _.issues.push({
                origin: A,
                code: "too_small",
                minimum: K.minimum,
                inclusive: !0,
                input: z,
                inst: q,
                continue: !K.abort
            })
        }
    }), oq1 = b1("$ZodCheckLengthEquals", (q, K) => {
        aH.init(q, K), q._zod.when = (_) => {
            let z = _.value;
            return !t86(z) && z.length !== void 0
        }, q._zod.onattach.push((_) => {
            let z = _._zod.bag;
            z.minimum = K.length, z.maximum = K.length, z.length = K.length
        }), q._zod.check = (_) => {
            let z = _.value,
                Y = z.length;
            if (Y === K.length) return;
            let A = mF6(z),
                O = Y > K.length;
            _.issues.push({
                origin: A,
                ...O ? {
                    code: "too_big",
                    maximum: K.length
                } : {
                    code: "too_small",
                    minimum: K.length
                },
                inclusive: !0,
                exact: !0,
                input: _.value,
                inst: q,
                continue: !K.abort
            })
        }
    }), yZ6 = b1("$ZodCheckStringFormat", (q, K) => {
        var _, z;
        if (aH.init(q, K), q._zod.onattach.push((Y) => {
                let A = Y._zod.bag;
                if (A.format = K.format, K.pattern) A.patterns ?? (A.patterns = new Set), A.patterns.add(K.pattern)
            }), K.pattern)(_ = q._zod).check ?? (_.check = (Y) => {
            if (K.pattern.lastIndex = 0, K.pattern.test(Y.value)) return;
            Y.issues.push({
                origin: "string",
                code: "invalid_format",
                format: K.format,
                input: Y.value,
                ...K.pattern ? {
                    pattern: K.pattern.toString()
                } : {},
                inst: q,
                continue: !K.abort
            })
        });
        else(z = q._zod).check ?? (z.check = () => {})
    }), aq1 = b1("$ZodCheckRegex", (q, K) => {
        yZ6.init(q, K), q._zod.check = (_) => {
            if (K.pattern.lastIndex = 0, K.pattern.test(_.value)) return;
            _.issues.push({
                origin: "string",
                code: "invalid_format",
                format: "regex",
                input: _.value,
                pattern: K.pattern.toString(),
                inst: q,
                continue: !K.abort
            })
        }
    }), sq1 = b1("$ZodCheckLowerCase", (q, K) => {
        K.pattern ?? (K.pattern = Fq1), yZ6.init(q, K)
    }), tq1 = b1("$ZodCheckUpperCase", (q, K) => {
        K.pattern ?? (K.pattern = gq1), yZ6.init(q, K)
    }), eq1 = b1("$ZodCheckIncludes", (q, K) => {
        aH.init(q, K);
        let _ = ei(K.includes),
            z = new RegExp(typeof K.position === "number" ? `^.{${K.position}}${_}` : _);
        K.pattern = z, q._zod.onattach.push((Y) => {
            let A = Y._zod.bag;
            A.patterns ?? (A.patterns = new Set), A.patterns.add(z)
        }), q._zod.check = (Y) => {
            if (Y.value.includes(K.includes, K.position)) return;
            Y.issues.push({
                origin: "string",
                code: "invalid_format",
                format: "includes",
                includes: K.includes,
                input: Y.value,
                inst: q,
                continue: !K.abort
            })
        }
    }), q41 = b1("$ZodCheckStartsWith", (q, K) => {
        aH.init(q, K);
        let _ = new RegExp(`^${ei(K.prefix)}.*`);
        K.pattern ?? (K.pattern = _), q._zod.onattach.push((z) => {
            let Y = z._zod.bag;
            Y.patterns ?? (Y.patterns = new Set), Y.patterns.add(_)
        }), q._zod.check = (z) => {
            if (z.value.startsWith(K.prefix)) return;
            z.issues.push({
                origin: "string",
                code: "invalid_format",
                format: "starts_with",
                prefix: K.prefix,
                input: z.value,
                inst: q,
                continue: !K.abort
            })
        }
    }), K41 = b1("$ZodCheckEndsWith", (q, K) => {
        aH.init(q, K);
        let _ = new RegExp(`.*${ei(K.suffix)}$`);
        K.pattern ?? (K.pattern = _), q._zod.onattach.push((z) => {
            let Y = z._zod.bag;
            Y.patterns ?? (Y.patterns = new Set), Y.patterns.add(_)
        }), q._zod.check = (z) => {
            if (z.value.endsWith(K.suffix)) return;
            z.issues.push({
                origin: "string",
                code: "invalid_format",
                format: "ends_with",
                suffix: K.suffix,
                input: z.value,
                inst: q,
                continue: !K.abort
            })
        }
    });
    _41 = b1("$ZodCheckProperty", (q, K) => {
        aH.init(q, K), q._zod.check = (_) => {
            let z = K.schema._zod.run({
                value: _.value[K.property],
                issues: []
            }, {});
            if (z instanceof Promise) return z.then((Y) => Kk7(Y, _, K.property));
            Kk7(z, _, K.property);
            return
        }
    }), z41 = b1("$ZodCheckMimeType", (q, K) => {
        aH.init(q, K);
        let _ = new Set(K.mime);
        q._zod.onattach.push((z) => {
            z._zod.bag.mime = K.mime
        }), q._zod.check = (z) => {
            if (_.has(z.value.type)) return;
            z.issues.push({
                code: "invalid_value",
                values: K.mime,
                input: z.value.type,
                inst: q
            })
        }
    }), Y41 = b1("$ZodCheckOverwrite", (q, K) => {
        aH.init(q, K), q._zod.check = (_) => {
            _.value = K.tx(_.value)
        }
    })
})
// @from(Ln 16915, Col 0)
class F28 {
    constructor(q = []) {
        if (this.content = [], this.indent = 0, this) this.args = q
    }
    indented(q) {
        this.indent += 1, q(this), this.indent -= 1
    }
    write(q) {
        if (typeof q === "function") {
            q(this, {
                execution: "sync"
            }), q(this, {
                execution: "async"
            });
            return
        }
        let _ = q.split(`
`).filter((A) => A),
            z = Math.min(..._.map((A) => A.length - A.trimStart().length)),
            Y = _.map((A) => A.slice(z)).map((A) => " ".repeat(this.indent * 2) + A);
        for (let A of Y) this.content.push(A)
    }
    compile() {
        let q = Function,
            K = this?.args,
            z = [...(this?.content ?? [""]).map((Y) => `  ${Y}`)];
        return new q(...K, z.join(`
`))
    }
}
// @from(Ln 16945, Col 4)
A41
// @from(Ln 16946, Col 4)
O41 = L(() => {
    A41 = {
        major: 4,
        minor: 0,
        patch: 0
    }
})
// @from(Ln 16954, Col 0)
function L41(q) {
    if (q === "") return !0;
    if (q.length % 4 !== 0) return !1;
    try {
        return atob(q), !0
    } catch {
        return !1
    }
}
// @from(Ln 16964, Col 0)
function Wk7(q) {
    if (!x28.test(q)) return !1;
    let K = q.replace(/[-_]/g, (z) => z === "-" ? "+" : "/"),
        _ = K.padEnd(Math.ceil(K.length / 4) * 4, "=");
    return L41(_)
}
// @from(Ln 16971, Col 0)
function Dk7(q, K = null) {
    try {
        let _ = q.split(".");
        if (_.length !== 3) return !1;
        let [z] = _;
        if (!z) return !1;
        let Y = JSON.parse(atob(z));
        if ("typ" in Y && Y?.typ !== "JWT") return !1;
        if (!Y.alg) return !1;
        if (K && (!("alg" in Y) || Y.alg !== K)) return !1;
        return !0
    } catch {
        return !1
    }
}
// @from(Ln 16987, Col 0)
function Yk7(q, K, _) {
    if (q.issues.length) K.issues.push(...pN(_, q.issues));
    K.value[_] = q.value
}
// @from(Ln 16992, Col 0)
function g28(q, K, _) {
    if (q.issues.length) K.issues.push(...pN(_, q.issues));
    K.value[_] = q.value
}
// @from(Ln 16997, Col 0)
function Ak7(q, K, _, z) {
    if (q.issues.length)
        if (z[_] === void 0)
            if (_ in z) K.value[_] = void 0;
            else K.value[_] = q.value;
    else K.issues.push(...pN(_, q.issues));
    else if (q.value === void 0) {
        if (_ in z) K.value[_] = void 0
    } else K.value[_] = q.value
}
// @from(Ln 17008, Col 0)
function Ok7(q, K, _, z) {
    for (let Y of q)
        if (Y.issues.length === 0) return K.value = Y.value, K;
    return K.issues.push({
        code: "invalid_union",
        input: K.value,
        inst: _,
        errors: q.map((Y) => Y.issues.map((A) => wh(A, z, qP())))
    }), K
}
// @from(Ln 17019, Col 0)
function w41(q, K) {
    if (q === K) return {
        valid: !0,
        data: q
    };
    if (q instanceof Date && K instanceof Date && +q === +K) return {
        valid: !0,
        data: q
    };
    if (kZ6(q) && kZ6(K)) {
        let _ = Object.keys(K),
            z = Object.keys(q).filter((A) => _.indexOf(A) !== -1),
            Y = {
                ...q,
                ...K
            };
        for (let A of z) {
            let O = w41(q[A], K[A]);
            if (!O.valid) return {
                valid: !1,
                mergeErrorPath: [A, ...O.mergeErrorPath]
            };
            Y[A] = O.data
        }
        return {
            valid: !0,
            data: Y
        }
    }
    if (Array.isArray(q) && Array.isArray(K)) {
        if (q.length !== K.length) return {
            valid: !1,
            mergeErrorPath: []
        };
        let _ = [];
        for (let z = 0; z < q.length; z++) {
            let Y = q[z],
                A = K[z],
                O = w41(Y, A);
            if (!O.valid) return {
                valid: !1,
                mergeErrorPath: [z, ...O.mergeErrorPath]
            };
            _.push(O.data)
        }
        return {
            valid: !0,
            data: _
        }
    }
    return {
        valid: !1,
        mergeErrorPath: []
    }
}
// @from(Ln 17075, Col 0)
function wk7(q, K, _) {
    if (K.issues.length) q.issues.push(...K.issues);
    if (_.issues.length) q.issues.push(..._.issues);
    if (QY6(q)) return q;
    let z = w41(K.value, _.value);
    if (!z.valid) throw Error(`Unmergable intersection. Error path: ${JSON.stringify(z.mergeErrorPath)}`);
    return q.value = z.data, q
}
// @from(Ln 17084, Col 0)
function U28(q, K, _) {
    if (q.issues.length) K.issues.push(...pN(_, q.issues));
    K.value[_] = q.value
}
// @from(Ln 17089, Col 0)
function $k7(q, K, _, z, Y, A, O) {
    if (q.issues.length)
        if (xF6.has(typeof z)) _.issues.push(...pN(z, q.issues));
        else _.issues.push({
            origin: "map",
            code: "invalid_key",
            input: Y,
            inst: A,
            issues: q.issues.map((w) => wh(w, O, qP()))
        });
    if (K.issues.length)
        if (xF6.has(typeof z)) _.issues.push(...pN(z, K.issues));
        else _.issues.push({
            origin: "map",
            code: "invalid_element",
            input: Y,
            inst: A,
            key: z,
            issues: K.issues.map((w) => wh(w, O, qP()))
        });
    _.value.set(q.value, K.value)
}
// @from(Ln 17112, Col 0)
function jk7(q, K) {
    if (q.issues.length) K.issues.push(...q.issues);
    K.value.add(q.value)
}
// @from(Ln 17117, Col 0)
function Hk7(q, K) {
    if (q.value === void 0) q.value = K.defaultValue;
    return q
}
// @from(Ln 17122, Col 0)
function Jk7(q, K) {
    if (!q.issues.length && q.value === void 0) q.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: q.value,
        inst: K
    });
    return q
}
// @from(Ln 17132, Col 0)
function Xk7(q, K, _) {
    if (QY6(q)) return q;
    return K.out._zod.run({
        value: q.value,
        issues: q.issues
    }, _)
}
// @from(Ln 17140, Col 0)
function Mk7(q) {
    return q.value = Object.freeze(q.value), q
}
// @from(Ln 17144, Col 0)
function Pk7(q, K, _, z) {
    if (!q) {
        let Y = {
            code: "custom",
            input: _,
            inst: z,
            path: [...z._zod.def.path ?? []],
            continue: !z._zod.def.abort
        };
        if (z._zod.def.params) Y.params = z._zod.def.params;
        K.issues.push($q1(Y))
    }
}
// @from(Ln 17157, Col 4)
O9
// @from(Ln 17157, Col 8)
lY6
// @from(Ln 17157, Col 13)
E2
// @from(Ln 17157, Col 17)
$41
// @from(Ln 17157, Col 22)
j41
// @from(Ln 17157, Col 27)
H41
// @from(Ln 17157, Col 32)
J41
// @from(Ln 17157, Col 37)
X41
// @from(Ln 17157, Col 42)
M41
// @from(Ln 17157, Col 47)
P41
// @from(Ln 17157, Col 52)
W41
// @from(Ln 17157, Col 57)
D41
// @from(Ln 17157, Col 62)
Z41
// @from(Ln 17157, Col 67)
f41
// @from(Ln 17157, Col 72)
G41
// @from(Ln 17157, Col 77)
v41
// @from(Ln 17157, Col 82)
T41
// @from(Ln 17157, Col 87)
V41
// @from(Ln 17157, Col 92)
k41
// @from(Ln 17157, Col 97)
N41
// @from(Ln 17157, Col 102)
E41
// @from(Ln 17157, Col 107)
y41
// @from(Ln 17157, Col 112)
h41
// @from(Ln 17157, Col 117)
R41
// @from(Ln 17157, Col 122)
S41
// @from(Ln 17157, Col 127)
C41
// @from(Ln 17157, Col 132)
b41
// @from(Ln 17157, Col 137)
Q28
// @from(Ln 17157, Col 142)
I41
// @from(Ln 17157, Col 147)
dF6
// @from(Ln 17157, Col 152)
d28
// @from(Ln 17157, Col 157)
x41
// @from(Ln 17157, Col 162)
u41
// @from(Ln 17157, Col 167)
m41
// @from(Ln 17157, Col 172)
B41
// @from(Ln 17157, Col 177)
p41
// @from(Ln 17157, Col 182)
LZ6
// @from(Ln 17157, Col 187)
F41
// @from(Ln 17157, Col 192)
g41
// @from(Ln 17157, Col 197)
U41
// @from(Ln 17157, Col 202)
cF6
// @from(Ln 17157, Col 207)
Q41
// @from(Ln 17157, Col 212)
c28
// @from(Ln 17157, Col 217)
d41
// @from(Ln 17157, Col 222)
c41
// @from(Ln 17157, Col 227)
nY6
// @from(Ln 17157, Col 232)
l41
// @from(Ln 17157, Col 237)
n41
// @from(Ln 17157, Col 242)
i41
// @from(Ln 17157, Col 247)
r41
// @from(Ln 17157, Col 252)
o41
// @from(Ln 17157, Col 257)
a41
// @from(Ln 17157, Col 262)
lF6
// @from(Ln 17157, Col 267)
s41
// @from(Ln 17157, Col 272)
t41
// @from(Ln 17157, Col 277)
e41
// @from(Ln 17157, Col 282)
qK1
// @from(Ln 17157, Col 287)
KK1
// @from(Ln 17157, Col 292)
_K1
// @from(Ln 17157, Col 297)
zK1
// @from(Ln 17157, Col 302)
YK1
// @from(Ln 17157, Col 307)
nF6
// @from(Ln 17157, Col 312)
AK1
// @from(Ln 17157, Col 317)
OK1
// @from(Ln 17157, Col 322)
wK1
// @from(Ln 17157, Col 327)
$K1
// @from(Ln 17157, Col 332)
jK1
// @from(Ln 17158, Col 4)
iF6 = L(() => {
    p28();
    TZ6();
    I28();
    u28();
    c3();
    O41();
    c3();
    O9 = b1("$ZodType", (q, K) => {
        var _;
        q ?? (q = {}), q._zod.def = K, q._zod.bag = q._zod.bag || {}, q._zod.version = A41;
        let z = [...q._zod.def.checks ?? []];
        if (q._zod.traits.has("$ZodCheck")) z.unshift(q);
        for (let Y of z)
            for (let A of Y._zod.onattach) A(q);
        if (z.length === 0)(_ = q._zod).deferred ?? (_.deferred = []), q._zod.deferred?.push(() => {
            q._zod.run = q._zod.parse
        });
        else {
            let Y = (A, O, w) => {
                let $ = QY6(A),
                    j;
                for (let H of O) {
                    if (H._zod.when) {
                        if (!H._zod.when(A)) continue
                    } else if ($) continue;
                    let J = A.issues.length,
                        X = H._zod.check(A);
                    if (X instanceof Promise && w?.async === !1) throw new ti;
                    if (j || X instanceof Promise) j = (j ?? Promise.resolve()).then(async () => {
                        if (await X, A.issues.length === J) return;
                        if (!$) $ = QY6(A, J)
                    });
                    else {
                        if (A.issues.length === J) continue;
                        if (!$) $ = QY6(A, J)
                    }
                }
                if (j) return j.then(() => {
                    return A
                });
                return A
            };
            q._zod.run = (A, O) => {
                let w = q._zod.parse(A, O);
                if (w instanceof Promise) {
                    if (O.async === !1) throw new ti;
                    return w.then(($) => Y($, z, O))
                }
                return Y(w, z, O)
            }
        }
        q["~standard"] = {
            validate: (Y) => {
                try {
                    let A = EZ6(q, Y);
                    return A.success ? {
                        value: A.data
                    } : {
                        issues: A.error?.issues
                    }
                } catch (A) {
                    return QF6(q, Y).then((O) => O.success ? {
                        value: O.data
                    } : {
                        issues: O.error?.issues
                    })
                }
            },
            vendor: "zod",
            version: 1
        }
    }), lY6 = b1("$ZodString", (q, K) => {
        O9.init(q, K), q._zod.pattern = [...q?._zod.bag?.patterns ?? []].pop() ?? bq1(q._zod.bag), q._zod.parse = (_, z) => {
            if (K.coerce) try {
                _.value = String(_.value)
            } catch (Y) {}
            if (typeof _.value === "string") return _;
            return _.issues.push({
                expected: "string",
                code: "invalid_type",
                input: _.value,
                inst: q
            }), _
        }
    }), E2 = b1("$ZodStringFormat", (q, K) => {
        yZ6.init(q, K), lY6.init(q, K)
    }), $41 = b1("$ZodGUID", (q, K) => {
        K.pattern ?? (K.pattern = Gq1), E2.init(q, K)
    }), j41 = b1("$ZodUUID", (q, K) => {
        if (K.version) {
            let z = {
                v1: 1,
                v2: 2,
                v3: 3,
                v4: 4,
                v5: 5,
                v6: 6,
                v7: 7,
                v8: 8
            } [K.version];
            if (z === void 0) throw Error(`Invalid UUID version: "${K.version}"`);
            K.pattern ?? (K.pattern = dY6(z))
        } else K.pattern ?? (K.pattern = dY6());
        E2.init(q, K)
    }), H41 = b1("$ZodEmail", (q, K) => {
        K.pattern ?? (K.pattern = vq1), E2.init(q, K)
    }), J41 = b1("$ZodURL", (q, K) => {
        E2.init(q, K), q._zod.check = (_) => {
            try {
                let z = _.value,
                    Y = new URL(z),
                    A = Y.href;
                if (K.hostname) {
                    if (K.hostname.lastIndex = 0, !K.hostname.test(Y.hostname)) _.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid hostname",
                        pattern: Lq1.source,
                        input: _.value,
                        inst: q,
                        continue: !K.abort
                    })
                }
                if (K.protocol) {
                    if (K.protocol.lastIndex = 0, !K.protocol.test(Y.protocol.endsWith(":") ? Y.protocol.slice(0, -1) : Y.protocol)) _.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid protocol",
                        pattern: K.protocol.source,
                        input: _.value,
                        inst: q,
                        continue: !K.abort
                    })
                }
                if (!z.endsWith("/") && A.endsWith("/")) _.value = A.slice(0, -1);
                else _.value = A;
                return
            } catch (z) {
                _.issues.push({
                    code: "invalid_format",
                    format: "url",
                    input: _.value,
                    inst: q,
                    continue: !K.abort
                })
            }
        }
    }), X41 = b1("$ZodEmoji", (q, K) => {
        K.pattern ?? (K.pattern = Tq1()), E2.init(q, K)
    }), M41 = b1("$ZodNanoID", (q, K) => {
        K.pattern ?? (K.pattern = Zq1), E2.init(q, K)
    }), P41 = b1("$ZodCUID", (q, K) => {
        K.pattern ?? (K.pattern = Xq1), E2.init(q, K)
    }), W41 = b1("$ZodCUID2", (q, K) => {
        K.pattern ?? (K.pattern = Mq1), E2.init(q, K)
    }), D41 = b1("$ZodULID", (q, K) => {
        K.pattern ?? (K.pattern = Pq1), E2.init(q, K)
    }), Z41 = b1("$ZodXID", (q, K) => {
        K.pattern ?? (K.pattern = Wq1), E2.init(q, K)
    }), f41 = b1("$ZodKSUID", (q, K) => {
        K.pattern ?? (K.pattern = Dq1), E2.init(q, K)
    }), G41 = b1("$ZodISODateTime", (q, K) => {
        K.pattern ?? (K.pattern = Cq1(K)), E2.init(q, K)
    }), v41 = b1("$ZodISODate", (q, K) => {
        K.pattern ?? (K.pattern = Rq1), E2.init(q, K)
    }), T41 = b1("$ZodISOTime", (q, K) => {
        K.pattern ?? (K.pattern = Sq1(K)), E2.init(q, K)
    }), V41 = b1("$ZodISODuration", (q, K) => {
        K.pattern ?? (K.pattern = fq1), E2.init(q, K)
    }), k41 = b1("$ZodIPv4", (q, K) => {
        K.pattern ?? (K.pattern = Vq1), E2.init(q, K), q._zod.onattach.push((_) => {
            let z = _._zod.bag;
            z.format = "ipv4"
        })
    }), N41 = b1("$ZodIPv6", (q, K) => {
        K.pattern ?? (K.pattern = kq1), E2.init(q, K), q._zod.onattach.push((_) => {
            let z = _._zod.bag;
            z.format = "ipv6"
        }), q._zod.check = (_) => {
            try {
                new URL(`http://[${_.value}]`)
            } catch {
                _.issues.push({
                    code: "invalid_format",
                    format: "ipv6",
                    input: _.value,
                    inst: q,
                    continue: !K.abort
                })
            }
        }
    }), E41 = b1("$ZodCIDRv4", (q, K) => {
        K.pattern ?? (K.pattern = Nq1), E2.init(q, K)
    }), y41 = b1("$ZodCIDRv6", (q, K) => {
        K.pattern ?? (K.pattern = Eq1), E2.init(q, K), q._zod.check = (_) => {
            let [z, Y] = _.value.split("/");
            try {
                if (!Y) throw Error();
                let A = Number(Y);
                if (`${A}` !== Y) throw Error();
                if (A < 0 || A > 128) throw Error();
                new URL(`http://[${z}]`)
            } catch {
                _.issues.push({
                    code: "invalid_format",
                    format: "cidrv6",
                    input: _.value,
                    inst: q,
                    continue: !K.abort
                })
            }
        }
    });
    h41 = b1("$ZodBase64", (q, K) => {
        K.pattern ?? (K.pattern = yq1), E2.init(q, K), q._zod.onattach.push((_) => {
            _._zod.bag.contentEncoding = "base64"
        }), q._zod.check = (_) => {
            if (L41(_.value)) return;
            _.issues.push({
                code: "invalid_format",
                format: "base64",
                input: _.value,
                inst: q,
                continue: !K.abort
            })
        }
    });
    R41 = b1("$ZodBase64URL", (q, K) => {
        K.pattern ?? (K.pattern = x28), E2.init(q, K), q._zod.onattach.push((_) => {
            _._zod.bag.contentEncoding = "base64url"
        }), q._zod.check = (_) => {
            if (Wk7(_.value)) return;
            _.issues.push({
                code: "invalid_format",
                format: "base64url",
                input: _.value,
                inst: q,
                continue: !K.abort
            })
        }
    }), S41 = b1("$ZodE164", (q, K) => {
        K.pattern ?? (K.pattern = hq1), E2.init(q, K)
    });
    C41 = b1("$ZodJWT", (q, K) => {
        E2.init(q, K), q._zod.check = (_) => {
            if (Dk7(_.value, K.alg)) return;
            _.issues.push({
                code: "invalid_format",
                format: "jwt",
                input: _.value,
                inst: q,
                continue: !K.abort
            })
        }
    }), b41 = b1("$ZodCustomStringFormat", (q, K) => {
        E2.init(q, K), q._zod.check = (_) => {
            if (K.fn(_.value)) return;
            _.issues.push({
                code: "invalid_format",
                format: K.format,
                input: _.value,
                inst: q,
                continue: !K.abort
            })
        }
    }), Q28 = b1("$ZodNumber", (q, K) => {
        O9.init(q, K), q._zod.pattern = q._zod.bag.pattern ?? uq1, q._zod.parse = (_, z) => {
            if (K.coerce) try {
                _.value = Number(_.value)
            } catch (O) {}
            let Y = _.value;
            if (typeof Y === "number" && !Number.isNaN(Y) && Number.isFinite(Y)) return _;
            let A = typeof Y === "number" ? Number.isNaN(Y) ? "NaN" : !Number.isFinite(Y) ? "Infinity" : void 0 : void 0;
            return _.issues.push({
                expected: "number",
                code: "invalid_type",
                input: Y,
                inst: q,
                ...A ? {
                    received: A
                } : {}
            }), _
        }
    }), I41 = b1("$ZodNumber", (q, K) => {
        Qq1.init(q, K), Q28.init(q, K)
    }), dF6 = b1("$ZodBoolean", (q, K) => {
        O9.init(q, K), q._zod.pattern = mq1, q._zod.parse = (_, z) => {
            if (K.coerce) try {
                _.value = Boolean(_.value)
            } catch (A) {}
            let Y = _.value;
            if (typeof Y === "boolean") return _;
            return _.issues.push({
                expected: "boolean",
                code: "invalid_type",
                input: Y,
                inst: q
            }), _
        }
    }), d28 = b1("$ZodBigInt", (q, K) => {
        O9.init(q, K), q._zod.pattern = Iq1, q._zod.parse = (_, z) => {
            if (K.coerce) try {
                _.value = BigInt(_.value)
            } catch (Y) {}
            if (typeof _.value === "bigint") return _;
            return _.issues.push({
                expected: "bigint",
                code: "invalid_type",
                input: _.value,
                inst: q
            }), _
        }
    }), x41 = b1("$ZodBigInt", (q, K) => {
        dq1.init(q, K), d28.init(q, K)
    }), u41 = b1("$ZodSymbol", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            let Y = _.value;
            if (typeof Y === "symbol") return _;
            return _.issues.push({
                expected: "symbol",
                code: "invalid_type",
                input: Y,
                inst: q
            }), _
        }
    }), m41 = b1("$ZodUndefined", (q, K) => {
        O9.init(q, K), q._zod.pattern = pq1, q._zod.values = new Set([void 0]), q._zod.optin = "optional", q._zod.optout = "optional", q._zod.parse = (_, z) => {
            let Y = _.value;
            if (typeof Y > "u") return _;
            return _.issues.push({
                expected: "undefined",
                code: "invalid_type",
                input: Y,
                inst: q
            }), _
        }
    }), B41 = b1("$ZodNull", (q, K) => {
        O9.init(q, K), q._zod.pattern = Bq1, q._zod.values = new Set([null]), q._zod.parse = (_, z) => {
            let Y = _.value;
            if (Y === null) return _;
            return _.issues.push({
                expected: "null",
                code: "invalid_type",
                input: Y,
                inst: q
            }), _
        }
    }), p41 = b1("$ZodAny", (q, K) => {
        O9.init(q, K), q._zod.parse = (_) => _
    }), LZ6 = b1("$ZodUnknown", (q, K) => {
        O9.init(q, K), q._zod.parse = (_) => _
    }), F41 = b1("$ZodNever", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            return _.issues.push({
                expected: "never",
                code: "invalid_type",
                input: _.value,
                inst: q
            }), _
        }
    }), g41 = b1("$ZodVoid", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            let Y = _.value;
            if (typeof Y > "u") return _;
            return _.issues.push({
                expected: "void",
                code: "invalid_type",
                input: Y,
                inst: q
            }), _
        }
    }), U41 = b1("$ZodDate", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            if (K.coerce) try {
                _.value = new Date(_.value)
            } catch (w) {}
            let Y = _.value,
                A = Y instanceof Date;
            if (A && !Number.isNaN(Y.getTime())) return _;
            return _.issues.push({
                expected: "date",
                code: "invalid_type",
                input: Y,
                ...A ? {
                    received: "Invalid Date"
                } : {},
                inst: q
            }), _
        }
    });
    cF6 = b1("$ZodArray", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            let Y = _.value;
            if (!Array.isArray(Y)) return _.issues.push({
                expected: "array",
                code: "invalid_type",
                input: Y,
                inst: q
            }), _;
            _.value = Array(Y.length);
            let A = [];
            for (let O = 0; O < Y.length; O++) {
                let w = Y[O],
                    $ = K.element._zod.run({
                        value: w,
                        issues: []
                    }, z);
                if ($ instanceof Promise) A.push($.then((j) => Yk7(j, _, O)));
                else Yk7($, _, O)
            }
            if (A.length) return Promise.all(A).then(() => _);
            return _
        }
    });
    Q41 = b1("$ZodObject", (q, K) => {
        O9.init(q, K);
        let _ = bF6(() => {
            let J = Object.keys(K.shape);
            for (let M of J)
                if (!(K.shape[M] instanceof O9)) throw Error(`Invalid element at key "${M}": expected a Zod schema`);
            let X = Aq1(K.shape);
            return {
                shape: K.shape,
                keys: J,
                keySet: new Set(J),
                numKeys: J.length,
                optionalKeys: new Set(X)
            }
        });
        PO(q._zod, "propValues", () => {
            let J = K.shape,
                X = {};
            for (let M in J) {
                let P = J[M]._zod;
                if (P.values) {
                    X[M] ?? (X[M] = new Set);
                    for (let W of P.values) X[M].add(W)
                }
            }
            return X
        });
        let z = (J) => {
                let X = new F28(["shape", "payload", "ctx"]),
                    M = _.value,
                    P = (G) => {
                        let f = UY6(G);
                        return `shape[${f}]._zod.run({ value: input[${f}], issues: [] }, ctx)`
                    };
                X.write("const input = payload.value;");
                let W = Object.create(null),
                    D = 0;
                for (let G of M.keys) W[G] = `key_${D++}`;
                X.write("const newResult = {}");
                for (let G of M.keys)
                    if (M.optionalKeys.has(G)) {
                        let f = W[G];
                        X.write(`const ${f} = ${P(G)};`);
                        let v = UY6(G);
                        X.write(`
        if (${f}.issues.length) {
          if (input[${v}] === undefined) {
            if (${v} in input) {
              newResult[${v}] = undefined;
            }
          } else {
            payload.issues = payload.issues.concat(
              ${f}.issues.map((iss) => ({
                ...iss,
                path: iss.path ? [${v}, ...iss.path] : [${v}],
              }))
            );
          }
        } else if (${f}.value === undefined) {
          if (${v} in input) newResult[${v}] = undefined;
        } else {
          newResult[${v}] = ${f}.value;
        }
        `)
                    } else {
                        let f = W[G];
                        X.write(`const ${f} = ${P(G)};`), X.write(`
          if (${f}.issues.length) payload.issues = payload.issues.concat(${f}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${UY6(G)}, ...iss.path] : [${UY6(G)}]
          })));`), X.write(`newResult[${UY6(G)}] = ${f}.value`)
                    } X.write("payload.value = newResult;"), X.write("return payload;");
                let Z = X.compile();
                return (G, f) => Z(J, G, f)
            },
            Y, A = VZ6,
            O = !hF6.jitless,
            $ = O && zq1.value,
            j = K.catchall,
            H;
        q._zod.parse = (J, X) => {
            H ?? (H = _.value);
            let M = J.value;
            if (!A(M)) return J.issues.push({
                expected: "object",
                code: "invalid_type",
                input: M,
                inst: q
            }), J;
            let P = [];
            if (O && $ && X?.async === !1 && X.jitless !== !0) {
                if (!Y) Y = z(K.shape);
                J = Y(J, X)
            } else {
                J.value = {};
                let f = H.shape;
                for (let v of H.keys) {
                    let V = f[v],
                        k = V._zod.run({
                            value: M[v],
                            issues: []
                        }, X),
                        N = V._zod.optin === "optional" && V._zod.optout === "optional";
                    if (k instanceof Promise) P.push(k.then((R) => N ? Ak7(R, J, v, M) : g28(R, J, v)));
                    else if (N) Ak7(k, J, v, M);
                    else g28(k, J, v)
                }
            }
            if (!j) return P.length ? Promise.all(P).then(() => J) : J;
            let W = [],
                D = H.keySet,
                Z = j._zod,
                G = Z.def.type;
            for (let f of Object.keys(M)) {
                if (D.has(f)) continue;
                if (G === "never") {
                    W.push(f);
                    continue
                }
                let v = Z.run({
                    value: M[f],
                    issues: []
                }, X);
                if (v instanceof Promise) P.push(v.then((V) => g28(V, J, f)));
                else g28(v, J, f)
            }
            if (W.length) J.issues.push({
                code: "unrecognized_keys",
                keys: W,
                input: M,
                inst: q
            });
            if (!P.length) return J;
            return Promise.all(P).then(() => {
                return J
            })
        }
    });
    c28 = b1("$ZodUnion", (q, K) => {
        O9.init(q, K), PO(q._zod, "optin", () => K.options.some((_) => _._zod.optin === "optional") ? "optional" : void 0), PO(q._zod, "optout", () => K.options.some((_) => _._zod.optout === "optional") ? "optional" : void 0), PO(q._zod, "values", () => {
            if (K.options.every((_) => _._zod.values)) return new Set(K.options.flatMap((_) => Array.from(_._zod.values)));
            return
        }), PO(q._zod, "pattern", () => {
            if (K.options.every((_) => _._zod.pattern)) {
                let _ = K.options.map((z) => z._zod.pattern);
                return new RegExp(`^(${_.map((z)=>IF6(z.source)).join("|")})$`)
            }
            return
        }), q._zod.parse = (_, z) => {
            let Y = !1,
                A = [];
            for (let O of K.options) {
                let w = O._zod.run({
                    value: _.value,
                    issues: []
                }, z);
                if (w instanceof Promise) A.push(w), Y = !0;
                else {
                    if (w.issues.length === 0) return w;
                    A.push(w)
                }
            }
            if (!Y) return Ok7(A, _, q, z);
            return Promise.all(A).then((O) => {
                return Ok7(O, _, q, z)
            })
        }
    }), d41 = b1("$ZodDiscriminatedUnion", (q, K) => {
        c28.init(q, K);
        let _ = q._zod.parse;
        PO(q._zod, "propValues", () => {
            let Y = {};
            for (let A of K.options) {
                let O = A._zod.propValues;
                if (!O || Object.keys(O).length === 0) throw Error(`Invalid discriminated union option at index "${K.options.indexOf(A)}"`);
                for (let [w, $] of Object.entries(O)) {
                    if (!Y[w]) Y[w] = new Set;
                    for (let j of $) Y[w].add(j)
                }
            }
            return Y
        });
        let z = bF6(() => {
            let Y = K.options,
                A = new Map;
            for (let O of Y) {
                let w = O._zod.propValues[K.discriminator];
                if (!w || w.size === 0) throw Error(`Invalid discriminated union option at index "${K.options.indexOf(O)}"`);
                for (let $ of w) {
                    if (A.has($)) throw Error(`Duplicate discriminator value "${String($)}"`);
                    A.set($, O)
                }
            }
            return A
        });
        q._zod.parse = (Y, A) => {
            let O = Y.value;
            if (!VZ6(O)) return Y.issues.push({
                code: "invalid_type",
                expected: "object",
                input: O,
                inst: q
            }), Y;
            let w = z.value.get(O?.[K.discriminator]);
            if (w) return w._zod.run(Y, A);
            if (K.unionFallback) return _(Y, A);
            return Y.issues.push({
                code: "invalid_union",
                errors: [],
                note: "No matching discriminator",
                input: O,
                path: [K.discriminator],
                inst: q
            }), Y
        }
    }), c41 = b1("$ZodIntersection", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            let Y = _.value,
                A = K.left._zod.run({
                    value: Y,
                    issues: []
                }, z),
                O = K.right._zod.run({
                    value: Y,
                    issues: []
                }, z);
            if (A instanceof Promise || O instanceof Promise) return Promise.all([A, O]).then(([$, j]) => {
                return wk7(_, $, j)
            });
            return wk7(_, A, O)
        }
    });
    nY6 = b1("$ZodTuple", (q, K) => {
        O9.init(q, K);
        let _ = K.items,
            z = _.length - [..._].reverse().findIndex((Y) => Y._zod.optin !== "optional");
        q._zod.parse = (Y, A) => {
            let O = Y.value;
            if (!Array.isArray(O)) return Y.issues.push({
                input: O,
                inst: q,
                expected: "tuple",
                code: "invalid_type"
            }), Y;
            Y.value = [];
            let w = [];
            if (!K.rest) {
                let j = O.length > _.length,
                    H = O.length < z - 1;
                if (j || H) return Y.issues.push({
                    input: O,
                    inst: q,
                    origin: "array",
                    ...j ? {
                        code: "too_big",
                        maximum: _.length
                    } : {
                        code: "too_small",
                        minimum: _.length
                    }
                }), Y
            }
            let $ = -1;
            for (let j of _) {
                if ($++, $ >= O.length) {
                    if ($ >= z) continue
                }
                let H = j._zod.run({
                    value: O[$],
                    issues: []
                }, A);
                if (H instanceof Promise) w.push(H.then((J) => U28(J, Y, $)));
                else U28(H, Y, $)
            }
            if (K.rest) {
                let j = O.slice(_.length);
                for (let H of j) {
                    $++;
                    let J = K.rest._zod.run({
                        value: H,
                        issues: []
                    }, A);
                    if (J instanceof Promise) w.push(J.then((X) => U28(X, Y, $)));
                    else U28(J, Y, $)
                }
            }
            if (w.length) return Promise.all(w).then(() => Y);
            return Y
        }
    });
    l41 = b1("$ZodRecord", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            let Y = _.value;
            if (!kZ6(Y)) return _.issues.push({
                expected: "record",
                code: "invalid_type",
                input: Y,
                inst: q
            }), _;
            let A = [];
            if (K.keyType._zod.values) {
                let O = K.keyType._zod.values;
                _.value = {};
                for (let $ of O)
                    if (typeof $ === "string" || typeof $ === "number" || typeof $ === "symbol") {
                        let j = K.valueType._zod.run({
                            value: Y[$],
                            issues: []
                        }, z);
                        if (j instanceof Promise) A.push(j.then((H) => {
                            if (H.issues.length) _.issues.push(...pN($, H.issues));
                            _.value[$] = H.value
                        }));
                        else {
                            if (j.issues.length) _.issues.push(...pN($, j.issues));
                            _.value[$] = j.value
                        }
                    } let w;
                for (let $ in Y)
                    if (!O.has($)) w = w ?? [], w.push($);
                if (w && w.length > 0) _.issues.push({
                    code: "unrecognized_keys",
                    input: Y,
                    inst: q,
                    keys: w
                })
            } else {
                _.value = {};
                for (let O of Reflect.ownKeys(Y)) {
                    if (O === "__proto__") continue;
                    let w = K.keyType._zod.run({
                        value: O,
                        issues: []
                    }, z);
                    if (w instanceof Promise) throw Error("Async schemas not supported in object keys currently");
                    if (w.issues.length) {
                        _.issues.push({
                            origin: "record",
                            code: "invalid_key",
                            issues: w.issues.map((j) => wh(j, z, qP())),
                            input: O,
                            path: [O],
                            inst: q
                        }), _.value[w.value] = w.value;
                        continue
                    }
                    let $ = K.valueType._zod.run({
                        value: Y[O],
                        issues: []
                    }, z);
                    if ($ instanceof Promise) A.push($.then((j) => {
                        if (j.issues.length) _.issues.push(...pN(O, j.issues));
                        _.value[w.value] = j.value
                    }));
                    else {
                        if ($.issues.length) _.issues.push(...pN(O, $.issues));
                        _.value[w.value] = $.value
                    }
                }
            }
            if (A.length) return Promise.all(A).then(() => _);
            return _
        }
    }), n41 = b1("$ZodMap", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            let Y = _.value;
            if (!(Y instanceof Map)) return _.issues.push({
                expected: "map",
                code: "invalid_type",
                input: Y,
                inst: q
            }), _;
            let A = [];
            _.value = new Map;
            for (let [O, w] of Y) {
                let $ = K.keyType._zod.run({
                        value: O,
                        issues: []
                    }, z),
                    j = K.valueType._zod.run({
                        value: w,
                        issues: []
                    }, z);
                if ($ instanceof Promise || j instanceof Promise) A.push(Promise.all([$, j]).then(([H, J]) => {
                    $k7(H, J, _, O, Y, q, z)
                }));
                else $k7($, j, _, O, Y, q, z)
            }
            if (A.length) return Promise.all(A).then(() => _);
            return _
        }
    });
    i41 = b1("$ZodSet", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            let Y = _.value;
            if (!(Y instanceof Set)) return _.issues.push({
                input: Y,
                inst: q,
                expected: "set",
                code: "invalid_type"
            }), _;
            let A = [];
            _.value = new Set;
            for (let O of Y) {
                let w = K.valueType._zod.run({
                    value: O,
                    issues: []
                }, z);
                if (w instanceof Promise) A.push(w.then(($) => jk7($, _)));
                else jk7(w, _)
            }
            if (A.length) return Promise.all(A).then(() => _);
            return _
        }
    });
    r41 = b1("$ZodEnum", (q, K) => {
        O9.init(q, K);
        let _ = CF6(K.entries);
        q._zod.values = new Set(_), q._zod.pattern = new RegExp(`^(${_.filter((z)=>xF6.has(typeof z)).map((z)=>typeof z==="string"?ei(z):z.toString()).join("|")})$`), q._zod.parse = (z, Y) => {
            let A = z.value;
            if (q._zod.values.has(A)) return z;
            return z.issues.push({
                code: "invalid_value",
                values: _,
                input: A,
                inst: q
            }), z
        }
    }), o41 = b1("$ZodLiteral", (q, K) => {
        O9.init(q, K), q._zod.values = new Set(K.values), q._zod.pattern = new RegExp(`^(${K.values.map((_)=>typeof _==="string"?ei(_):_?_.toString():String(_)).join("|")})$`), q._zod.parse = (_, z) => {
            let Y = _.value;
            if (q._zod.values.has(Y)) return _;
            return _.issues.push({
                code: "invalid_value",
                values: K.values,
                input: Y,
                inst: q
            }), _
        }
    }), a41 = b1("$ZodFile", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            let Y = _.value;
            if (Y instanceof File) return _;
            return _.issues.push({
                expected: "file",
                code: "invalid_type",
                input: Y,
                inst: q
            }), _
        }
    }), lF6 = b1("$ZodTransform", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            let Y = K.transform(_.value, _);
            if (z.async) return (Y instanceof Promise ? Y : Promise.resolve(Y)).then((O) => {
                return _.value = O, _
            });
            if (Y instanceof Promise) throw new ti;
            return _.value = Y, _
        }
    }), s41 = b1("$ZodOptional", (q, K) => {
        O9.init(q, K), q._zod.optin = "optional", q._zod.optout = "optional", PO(q._zod, "values", () => {
            return K.innerType._zod.values ? new Set([...K.innerType._zod.values, void 0]) : void 0
        }), PO(q._zod, "pattern", () => {
            let _ = K.innerType._zod.pattern;
            return _ ? new RegExp(`^(${IF6(_.source)})?$`) : void 0
        }), q._zod.parse = (_, z) => {
            if (K.innerType._zod.optin === "optional") return K.innerType._zod.run(_, z);
            if (_.value === void 0) return _;
            return K.innerType._zod.run(_, z)
        }
    }), t41 = b1("$ZodNullable", (q, K) => {
        O9.init(q, K), PO(q._zod, "optin", () => K.innerType._zod.optin), PO(q._zod, "optout", () => K.innerType._zod.optout), PO(q._zod, "pattern", () => {
            let _ = K.innerType._zod.pattern;
            return _ ? new RegExp(`^(${IF6(_.source)}|null)$`) : void 0
        }), PO(q._zod, "values", () => {
            return K.innerType._zod.values ? new Set([...K.innerType._zod.values, null]) : void 0
        }), q._zod.parse = (_, z) => {
            if (_.value === null) return _;
            return K.innerType._zod.run(_, z)
        }
    }), e41 = b1("$ZodDefault", (q, K) => {
        O9.init(q, K), q._zod.optin = "optional", PO(q._zod, "values", () => K.innerType._zod.values), q._zod.parse = (_, z) => {
            if (_.value === void 0) return _.value = K.defaultValue, _;
            let Y = K.innerType._zod.run(_, z);
            if (Y instanceof Promise) return Y.then((A) => Hk7(A, K));
            return Hk7(Y, K)
        }
    });
    qK1 = b1("$ZodPrefault", (q, K) => {
        O9.init(q, K), q._zod.optin = "optional", PO(q._zod, "values", () => K.innerType._zod.values), q._zod.parse = (_, z) => {
            if (_.value === void 0) _.value = K.defaultValue;
            return K.innerType._zod.run(_, z)
        }
    }), KK1 = b1("$ZodNonOptional", (q, K) => {
        O9.init(q, K), PO(q._zod, "values", () => {
            let _ = K.innerType._zod.values;
            return _ ? new Set([..._].filter((z) => z !== void 0)) : void 0
        }), q._zod.parse = (_, z) => {
            let Y = K.innerType._zod.run(_, z);
            if (Y instanceof Promise) return Y.then((A) => Jk7(A, q));
            return Jk7(Y, q)
        }
    });
    _K1 = b1("$ZodSuccess", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            let Y = K.innerType._zod.run(_, z);
            if (Y instanceof Promise) return Y.then((A) => {
                return _.value = A.issues.length === 0, _
            });
            return _.value = Y.issues.length === 0, _
        }
    }), zK1 = b1("$ZodCatch", (q, K) => {
        O9.init(q, K), q._zod.optin = "optional", PO(q._zod, "optout", () => K.innerType._zod.optout), PO(q._zod, "values", () => K.innerType._zod.values), q._zod.parse = (_, z) => {
            let Y = K.innerType._zod.run(_, z);
            if (Y instanceof Promise) return Y.then((A) => {
                if (_.value = A.value, A.issues.length) _.value = K.catchValue({
                    ..._,
                    error: {
                        issues: A.issues.map((O) => wh(O, z, qP()))
                    },
                    input: _.value
                }), _.issues = [];
                return _
            });
            if (_.value = Y.value, Y.issues.length) _.value = K.catchValue({
                ..._,
                error: {
                    issues: Y.issues.map((A) => wh(A, z, qP()))
                },
                input: _.value
            }), _.issues = [];
            return _
        }
    }), YK1 = b1("$ZodNaN", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            if (typeof _.value !== "number" || !Number.isNaN(_.value)) return _.issues.push({
                input: _.value,
                inst: q,
                expected: "nan",
                code: "invalid_type"
            }), _;
            return _
        }
    }), nF6 = b1("$ZodPipe", (q, K) => {
        O9.init(q, K), PO(q._zod, "values", () => K.in._zod.values), PO(q._zod, "optin", () => K.in._zod.optin), PO(q._zod, "optout", () => K.out._zod.optout), q._zod.parse = (_, z) => {
            let Y = K.in._zod.run(_, z);
            if (Y instanceof Promise) return Y.then((A) => Xk7(A, K, z));
            return Xk7(Y, K, z)
        }
    });
    AK1 = b1("$ZodReadonly", (q, K) => {
        O9.init(q, K), PO(q._zod, "propValues", () => K.innerType._zod.propValues), PO(q._zod, "values", () => K.innerType._zod.values), PO(q._zod, "optin", () => K.innerType._zod.optin), PO(q._zod, "optout", () => K.innerType._zod.optout), q._zod.parse = (_, z) => {
            let Y = K.innerType._zod.run(_, z);
            if (Y instanceof Promise) return Y.then(Mk7);
            return Mk7(Y)
        }
    });
    OK1 = b1("$ZodTemplateLiteral", (q, K) => {
        O9.init(q, K);
        let _ = [];
        for (let z of K.parts)
            if (z instanceof O9) {
                if (!z._zod.pattern) throw Error(`Invalid template literal part, no pattern found: ${[...z._zod.traits].shift()}`);
                let Y = z._zod.pattern instanceof RegExp ? z._zod.pattern.source : z._zod.pattern;
                if (!Y) throw Error(`Invalid template literal part: ${z._zod.traits}`);
                let A = Y.startsWith("^") ? 1 : 0,
                    O = Y.endsWith("$") ? Y.length - 1 : Y.length;
                _.push(Y.slice(A, O))
            } else if (z === null || Yq1.has(typeof z)) _.push(ei(`${z}`));
        else throw Error(`Invalid template literal part: ${z}`);
        q._zod.pattern = new RegExp(`^${_.join("")}$`), q._zod.parse = (z, Y) => {
            if (typeof z.value !== "string") return z.issues.push({
                input: z.value,
                inst: q,
                expected: "template_literal",
                code: "invalid_type"
            }), z;
            if (q._zod.pattern.lastIndex = 0, !q._zod.pattern.test(z.value)) return z.issues.push({
                input: z.value,
                inst: q,
                code: "invalid_format",
                format: "template_literal",
                pattern: q._zod.pattern.source
            }), z;
            return z
        }
    }), wK1 = b1("$ZodPromise", (q, K) => {
        O9.init(q, K), q._zod.parse = (_, z) => {
            return Promise.resolve(_.value).then((Y) => K.innerType._zod.run({
                value: Y,
                issues: []
            }, z))
        }
    }), $K1 = b1("$ZodLazy", (q, K) => {
        O9.init(q, K), PO(q._zod, "innerType", () => K.getter()), PO(q._zod, "pattern", () => q._zod.innerType._zod.pattern), PO(q._zod, "propValues", () => q._zod.innerType._zod.propValues), PO(q._zod, "optin", () => q._zod.innerType._zod.optin), PO(q._zod, "optout", () => q._zod.innerType._zod.optout), q._zod.parse = (_, z) => {
            return q._zod.innerType._zod.run(_, z)
        }
    }), jK1 = b1("$ZodCustom", (q, K) => {
        aH.init(q, K), O9.init(q, K), q._zod.parse = (_, z) => {
            return _
        }, q._zod.check = (_) => {
            let z = _.value,
                Y = K.fn(z);
            if (Y instanceof Promise) return Y.then((A) => Pk7(A, _, z, q));
            Pk7(Y, _, z, q);
            return
        }
    })
})
// @from(Ln 18183, Col 0)
function HK1() {
    return {
        localeError: sk5()
    }
}
// @from(Ln 18188, Col 4)
sk5 = () => {
    let q = {
        string: {
            unit: "حرف",
            verb: "أن يحوي"
        },
        file: {
            unit: "بايت",
            verb: "أن يحوي"
        },
        array: {
            unit: "عنصر",
            verb: "أن يحوي"
        },
        set: {
            unit: "عنصر",
            verb: "أن يحوي"
        }
    };

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(Y)) return "array";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
            regex: "مدخل",
            email: "بريد إلكتروني",
            url: "رابط",
            emoji: "إيموجي",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "تاريخ ووقت بمعيار ISO",
            date: "تاريخ بمعيار ISO",
            time: "وقت بمعيار ISO",
            duration: "مدة بمعيار ISO",
            ipv4: "عنوان IPv4",
            ipv6: "عنوان IPv6",
            cidrv4: "مدى عناوين بصيغة IPv4",
            cidrv6: "مدى عناوين بصيغة IPv6",
            base64: "نَص بترميز base64-encoded",
            base64url: "نَص بترميز base64url-encoded",
            json_string: "نَص على هيئة JSON",
            e164: "رقم هاتف بمعيار E.164",
            jwt: "JWT",
            template_literal: "مدخل"
        };
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `مدخلات غير مقبولة: يفترض إدخال ${Y.expected}، ولكن تم إدخال ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `مدخلات غير مقبولة: يفترض إدخال ${H4(Y.values[0])}`;
                return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return ` أكبر من اللازم: يفترض أن تكون ${Y.origin??"القيمة"} ${A} ${Y.maximum.toString()} ${O.unit??"عنصر"}`;
                return `أكبر من اللازم: يفترض أن تكون ${Y.origin??"القيمة"} ${A} ${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `أصغر من اللازم: يفترض لـ ${Y.origin} أن يكون ${A} ${Y.minimum.toString()} ${O.unit}`;
                return `أصغر من اللازم: يفترض لـ ${Y.origin} أن يكون ${A} ${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `نَص غير مقبول: يجب أن يبدأ بـ "${Y.prefix}"`;
                if (A.format === "ends_with") return `نَص غير مقبول: يجب أن ينتهي بـ "${A.suffix}"`;
                if (A.format === "includes") return `نَص غير مقبول: يجب أن يتضمَّن "${A.includes}"`;
                if (A.format === "regex") return `نَص غير مقبول: يجب أن يطابق النمط ${A.pattern}`;
                return `${z[A.format]??Y.format} غير مقبول`
            }
            case "not_multiple_of":
                return `رقم غير مقبول: يجب أن يكون من مضاعفات ${Y.divisor}`;
            case "unrecognized_keys":
                return `معرف${Y.keys.length>1?"ات":""} غريب${Y.keys.length>1?"ة":""}: ${h7(Y.keys,"، ")}`;
            case "invalid_key":
                return `معرف غير مقبول في ${Y.origin}`;
            case "invalid_union":
                return "مدخل غير مقبول";
            case "invalid_element":
                return `مدخل غير مقبول في ${Y.origin}`;
            default:
                return "مدخل غير مقبول"
        }
    }
}
// @from(Ln 18296, Col 4)
fk7 = L(() => {
    c3()
})
// @from(Ln 18300, Col 0)
function JK1() {
    return {
        localeError: tk5()
    }
}
// @from(Ln 18305, Col 4)
tk5 = () => {
    let q = {
        string: {
            unit: "simvol",
            verb: "olmalıdır"
        },
        file: {
            unit: "bayt",
            verb: "olmalıdır"
        },
        array: {
            unit: "element",
            verb: "olmalıdır"
        },
        set: {
            unit: "element",
            verb: "olmalıdır"
        }
    };

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(Y)) return "array";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
            regex: "input",
            email: "email address",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ISO datetime",
            date: "ISO date",
            time: "ISO time",
            duration: "ISO duration",
            ipv4: "IPv4 address",
            ipv6: "IPv6 address",
            cidrv4: "IPv4 range",
            cidrv6: "IPv6 range",
            base64: "base64-encoded string",
            base64url: "base64url-encoded string",
            json_string: "JSON string",
            e164: "E.164 number",
            jwt: "JWT",
            template_literal: "input"
        };
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Yanlış dəyər: gözlənilən ${Y.expected}, daxil olan ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Yanlış dəyər: gözlənilən ${H4(Y.values[0])}`;
                return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Çox böyük: gözlənilən ${Y.origin??"dəyər"} ${A}${Y.maximum.toString()} ${O.unit??"element"}`;
                return `Çox böyük: gözlənilən ${Y.origin??"dəyər"} ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Çox kiçik: gözlənilən ${Y.origin} ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Çox kiçik: gözlənilən ${Y.origin} ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Yanlış mətn: "${A.prefix}" ilə başlamalıdır`;
                if (A.format === "ends_with") return `Yanlış mətn: "${A.suffix}" ilə bitməlidir`;
                if (A.format === "includes") return `Yanlış mətn: "${A.includes}" daxil olmalıdır`;
                if (A.format === "regex") return `Yanlış mətn: ${A.pattern} şablonuna uyğun olmalıdır`;
                return `Yanlış ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Yanlış ədəd: ${Y.divisor} ilə bölünə bilən olmalıdır`;
            case "unrecognized_keys":
                return `Tanınmayan açar${Y.keys.length>1?"lar":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `${Y.origin} daxilində yanlış açar`;
            case "invalid_union":
                return "Yanlış dəyər";
            case "invalid_element":
                return `${Y.origin} daxilində yanlış dəyər`;
            default:
                return "Yanlış dəyər"
        }
    }
}
// @from(Ln 18413, Col 4)
Gk7 = L(() => {
    c3()
})
// @from(Ln 18417, Col 0)
function vk7(q, K, _, z) {
    let Y = Math.abs(q),
        A = Y % 10,
        O = Y % 100;
    if (O >= 11 && O <= 19) return z;
    if (A === 1) return K;
    if (A >= 2 && A <= 4) return _;
    return z
}
// @from(Ln 18427, Col 0)
function XK1() {
    return {
        localeError: ek5()
    }
}
// @from(Ln 18432, Col 4)
ek5 = () => {
    let q = {
        string: {
            unit: {
                one: "сімвал",
                few: "сімвалы",
                many: "сімвалаў"
            },
            verb: "мець"
        },
        array: {
            unit: {
                one: "элемент",
                few: "элементы",
                many: "элементаў"
            },
            verb: "мець"
        },
        set: {
            unit: {
                one: "элемент",
                few: "элементы",
                many: "элементаў"
            },
            verb: "мець"
        },
        file: {
            unit: {
                one: "байт",
                few: "байты",
                many: "байтаў"
            },
            verb: "мець"
        }
    };

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "лік";
                case "object": {
                    if (Array.isArray(Y)) return "масіў";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
            regex: "увод",
            email: "email адрас",
            url: "URL",
            emoji: "эмодзі",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ISO дата і час",
            date: "ISO дата",
            time: "ISO час",
            duration: "ISO працягласць",
            ipv4: "IPv4 адрас",
            ipv6: "IPv6 адрас",
            cidrv4: "IPv4 дыяпазон",
            cidrv6: "IPv6 дыяпазон",
            base64: "радок у фармаце base64",
            base64url: "радок у фармаце base64url",
            json_string: "JSON радок",
            e164: "нумар E.164",
            jwt: "JWT",
            template_literal: "увод"
        };
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Няправільны ўвод: чакаўся ${Y.expected}, атрымана ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Няправільны ўвод: чакалася ${H4(Y.values[0])}`;
                return `Няправільны варыянт: чакаўся адзін з ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) {
                    let w = Number(Y.maximum),
                        $ = vk7(w, O.unit.one, O.unit.few, O.unit.many);
                    return `Занадта вялікі: чакалася, што ${Y.origin??"значэнне"} павінна ${O.verb} ${A}${Y.maximum.toString()} ${$}`
                }
                return `Занадта вялікі: чакалася, што ${Y.origin??"значэнне"} павінна быць ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) {
                    let w = Number(Y.minimum),
                        $ = vk7(w, O.unit.one, O.unit.few, O.unit.many);
                    return `Занадта малы: чакалася, што ${Y.origin} павінна ${O.verb} ${A}${Y.minimum.toString()} ${$}`
                }
                return `Занадта малы: чакалася, што ${Y.origin} павінна быць ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Няправільны радок: павінен пачынацца з "${A.prefix}"`;
                if (A.format === "ends_with") return `Няправільны радок: павінен заканчвацца на "${A.suffix}"`;
                if (A.format === "includes") return `Няправільны радок: павінен змяшчаць "${A.includes}"`;
                if (A.format === "regex") return `Няправільны радок: павінен адпавядаць шаблону ${A.pattern}`;
                return `Няправільны ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Няправільны лік: павінен быць кратным ${Y.divisor}`;
            case "unrecognized_keys":
                return `Нераспазнаны ${Y.keys.length>1?"ключы":"ключ"}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Няправільны ключ у ${Y.origin}`;
            case "invalid_union":
                return "Няправільны ўвод";
            case "invalid_element":
                return `Няправільнае значэнне ў ${Y.origin}`;
            default:
                return "Няправільны ўвод"
        }
    }
}
// @from(Ln 18564, Col 4)
Tk7 = L(() => {
    c3()
})
// @from(Ln 18568, Col 0)
function MK1() {
    return {
        localeError: qN5()
    }
}
// @from(Ln 18573, Col 4)
qN5 = () => {
    let q = {
        string: {
            unit: "caràcters",
            verb: "contenir"
        },
        file: {
            unit: "bytes",
            verb: "contenir"
        },
        array: {
            unit: "elements",
            verb: "contenir"
        },
        set: {
            unit: "elements",
            verb: "contenir"
        }
    };

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(Y)) return "array";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
            regex: "entrada",
            email: "adreça electrònica",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "data i hora ISO",
            date: "data ISO",
            time: "hora ISO",
            duration: "durada ISO",
            ipv4: "adreça IPv4",
            ipv6: "adreça IPv6",
            cidrv4: "rang IPv4",
            cidrv6: "rang IPv6",
            base64: "cadena codificada en base64",
            base64url: "cadena codificada en base64url",
            json_string: "cadena JSON",
            e164: "número E.164",
            jwt: "JWT",
            template_literal: "entrada"
        };
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Tipus invàlid: s'esperava ${Y.expected}, s'ha rebut ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Valor invàlid: s'esperava ${H4(Y.values[0])}`;
                return `Opció invàlida: s'esperava una de ${h7(Y.values," o ")}`;
            case "too_big": {
                let A = Y.inclusive ? "com a màxim" : "menys de",
                    O = K(Y.origin);
                if (O) return `Massa gran: s'esperava que ${Y.origin??"el valor"} contingués ${A} ${Y.maximum.toString()} ${O.unit??"elements"}`;
                return `Massa gran: s'esperava que ${Y.origin??"el valor"} fos ${A} ${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? "com a mínim" : "més de",
                    O = K(Y.origin);
                if (O) return `Massa petit: s'esperava que ${Y.origin} contingués ${A} ${Y.minimum.toString()} ${O.unit}`;
                return `Massa petit: s'esperava que ${Y.origin} fos ${A} ${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Format invàlid: ha de començar amb "${A.prefix}"`;
                if (A.format === "ends_with") return `Format invàlid: ha d'acabar amb "${A.suffix}"`;
                if (A.format === "includes") return `Format invàlid: ha d'incloure "${A.includes}"`;
                if (A.format === "regex") return `Format invàlid: ha de coincidir amb el patró ${A.pattern}`;
                return `Format invàlid per a ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Número invàlid: ha de ser múltiple de ${Y.divisor}`;
            case "unrecognized_keys":
                return `Clau${Y.keys.length>1?"s":""} no reconeguda${Y.keys.length>1?"s":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Clau invàlida a ${Y.origin}`;
            case "invalid_union":
                return "Entrada invàlida";
            case "invalid_element":
                return `Element invàlid a ${Y.origin}`;
            default:
                return "Entrada invàlida"
        }
    }
}
// @from(Ln 18681, Col 4)
Vk7 = L(() => {
    c3()
})
// @from(Ln 18685, Col 0)
function PK1() {
    return {
        localeError: KN5()
    }
}
// @from(Ln 18690, Col 4)
KN5 = () => {
    let q = {
        string: {
            unit: "znaků",
            verb: "mít"
        },
        file: {
            unit: "bajtů",
            verb: "mít"
        },
        array: {
            unit: "prvků",
            verb: "mít"
        },
        set: {
            unit: "prvků",
            verb: "mít"
        }
    };

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "číslo";
                case "string":
                    return "řetězec";
                case "boolean":
                    return "boolean";
                case "bigint":
                    return "bigint";
                case "function":
                    return "funkce";
                case "symbol":
                    return "symbol";
                case "undefined":
                    return "undefined";
                case "object": {
                    if (Array.isArray(Y)) return "pole";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
            regex: "regulární výraz",
            email: "e-mailová adresa",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "datum a čas ve formátu ISO",
            date: "datum ve formátu ISO",
            time: "čas ve formátu ISO",
            duration: "doba trvání ISO",
            ipv4: "IPv4 adresa",
            ipv6: "IPv6 adresa",
            cidrv4: "rozsah IPv4",
            cidrv6: "rozsah IPv6",
            base64: "řetězec zakódovaný ve formátu base64",
            base64url: "řetězec zakódovaný ve formátu base64url",
            json_string: "řetězec ve formátu JSON",
            e164: "číslo E.164",
            jwt: "JWT",
            template_literal: "vstup"
        };
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Neplatný vstup: očekáváno ${Y.expected}, obdrženo ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Neplatný vstup: očekáváno ${H4(Y.values[0])}`;
                return `Neplatná možnost: očekávána jedna z hodnot ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Hodnota je příliš velká: ${Y.origin??"hodnota"} musí mít ${A}${Y.maximum.toString()} ${O.unit??"prvků"}`;
                return `Hodnota je příliš velká: ${Y.origin??"hodnota"} musí být ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Hodnota je příliš malá: ${Y.origin??"hodnota"} musí mít ${A}${Y.minimum.toString()} ${O.unit??"prvků"}`;
                return `Hodnota je příliš malá: ${Y.origin??"hodnota"} musí být ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Neplatný řetězec: musí začínat na "${A.prefix}"`;
                if (A.format === "ends_with") return `Neplatný řetězec: musí končit na "${A.suffix}"`;
                if (A.format === "includes") return `Neplatný řetězec: musí obsahovat "${A.includes}"`;
                if (A.format === "regex") return `Neplatný řetězec: musí odpovídat vzoru ${A.pattern}`;
                return `Neplatný formát ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Neplatné číslo: musí být násobkem ${Y.divisor}`;
            case "unrecognized_keys":
                return `Neznámé klíče: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Neplatný klíč v ${Y.origin}`;
            case "invalid_union":
                return "Neplatný vstup";
            case "invalid_element":
                return `Neplatná hodnota v ${Y.origin}`;
            default:
                return "Neplatný vstup"
        }
    }
}
// @from(Ln 18810, Col 4)
kk7 = L(() => {
    c3()
})
// @from(Ln 18814, Col 0)
function WK1() {
    return {
        localeError: _N5()
    }
}
// @from(Ln 18819, Col 4)
_N5 = () => {
    let q = {
        string: {
            unit: "Zeichen",
            verb: "zu haben"
        },
        file: {
            unit: "Bytes",
            verb: "zu haben"
        },
        array: {
            unit: "Elemente",
            verb: "zu haben"
        },
        set: {
            unit: "Elemente",
            verb: "zu haben"
        }
    };

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "Zahl";
                case "object": {
                    if (Array.isArray(Y)) return "Array";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
            regex: "Eingabe",
            email: "E-Mail-Adresse",
            url: "URL",
            emoji: "Emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ISO-Datum und -Uhrzeit",
            date: "ISO-Datum",
            time: "ISO-Uhrzeit",
            duration: "ISO-Dauer",
            ipv4: "IPv4-Adresse",
            ipv6: "IPv6-Adresse",
            cidrv4: "IPv4-Bereich",
            cidrv6: "IPv6-Bereich",
            base64: "Base64-codierter String",
            base64url: "Base64-URL-codierter String",
            json_string: "JSON-String",
            e164: "E.164-Nummer",
            jwt: "JWT",
            template_literal: "Eingabe"
        };
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Ungültige Eingabe: erwartet ${Y.expected}, erhalten ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Ungültige Eingabe: erwartet ${H4(Y.values[0])}`;
                return `Ungültige Option: erwartet eine von ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Zu groß: erwartet, dass ${Y.origin??"Wert"} ${A}${Y.maximum.toString()} ${O.unit??"Elemente"} hat`;
                return `Zu groß: erwartet, dass ${Y.origin??"Wert"} ${A}${Y.maximum.toString()} ist`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Zu klein: erwartet, dass ${Y.origin} ${A}${Y.minimum.toString()} ${O.unit} hat`;
                return `Zu klein: erwartet, dass ${Y.origin} ${A}${Y.minimum.toString()} ist`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Ungültiger String: muss mit "${A.prefix}" beginnen`;
                if (A.format === "ends_with") return `Ungültiger String: muss mit "${A.suffix}" enden`;
                if (A.format === "includes") return `Ungültiger String: muss "${A.includes}" enthalten`;
                if (A.format === "regex") return `Ungültiger String: muss dem Muster ${A.pattern} entsprechen`;
                return `Ungültig: ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Ungültige Zahl: muss ein Vielfaches von ${Y.divisor} sein`;
            case "unrecognized_keys":
                return `${Y.keys.length>1?"Unbekannte Schlüssel":"Unbekannter Schlüssel"}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Ungültiger Schlüssel in ${Y.origin}`;
            case "invalid_union":
                return "Ungültige Eingabe";
            case "invalid_element":
                return `Ungültiger Wert in ${Y.origin}`;
            default:
                return "Ungültige Eingabe"
        }
    }
}
// @from(Ln 18927, Col 4)
Nk7 = L(() => {
    c3()
})
// @from(Ln 18931, Col 0)
function rF6() {
    return {
        localeError: YN5()
    }
}