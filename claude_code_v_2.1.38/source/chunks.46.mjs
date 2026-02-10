
// @from(Ln 120793, Col 4)
Ie8 = v(() => {
    Dq6();
    jq6();
    Ee8();
    F8A();
    cy1();
    _W5 = /^c[^\s-]{8,}$/i, JW5 = /^[0-9a-z]+$/, XW5 = /^[0-9A-HJKMNP-TV-Z]{26}$/i, DW5 = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, jW5 = /^[a-z0-9_-]{21}$/i, MW5 = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, PW5 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, WW5 = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, ZW5 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, fW5 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, VW5 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, NW5 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, TW5 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, vW5 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, EW5 = new RegExp(`^${Re8}$`);
    eC = class eC extends q9 {
        _parse(A) {
            if (this._def.coerce) A.data = String(A.data);
            if (this._getType(A) !== C7.string) {
                let z = this._getOrReturnCtx(A);
                return t7(z, {
                    code: r8.invalid_type,
                    expected: C7.string,
                    received: z.parsedType
                }), LK
            }
            let K = new DM,
                Y = void 0;
            for (let z of this._def.checks)
                if (z.kind === "min") {
                    if (A.data.length < z.value) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                        code: r8.too_small,
                        minimum: z.value,
                        type: "string",
                        inclusive: !0,
                        exact: !1,
                        message: z.message
                    }), K.dirty()
                } else if (z.kind === "max") {
                if (A.data.length > z.value) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    code: r8.too_big,
                    maximum: z.value,
                    type: "string",
                    inclusive: !0,
                    exact: !1,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "length") {
                let w = A.data.length > z.value,
                    H = A.data.length < z.value;
                if (w || H) {
                    if (Y = this._getOrReturnCtx(A, Y), w) t7(Y, {
                        code: r8.too_big,
                        maximum: z.value,
                        type: "string",
                        inclusive: !0,
                        exact: !0,
                        message: z.message
                    });
                    else if (H) t7(Y, {
                        code: r8.too_small,
                        minimum: z.value,
                        type: "string",
                        inclusive: !0,
                        exact: !0,
                        message: z.message
                    });
                    K.dirty()
                }
            } else if (z.kind === "email") {
                if (!WW5.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "email",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "emoji") {
                if (!Q8A) Q8A = new RegExp(GW5, "u");
                if (!Q8A.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "emoji",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "uuid") {
                if (!DW5.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "uuid",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "nanoid") {
                if (!jW5.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "nanoid",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "cuid") {
                if (!_W5.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "cuid",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "cuid2") {
                if (!JW5.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "cuid2",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "ulid") {
                if (!XW5.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "ulid",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "url") try {
                new URL(A.data)
            } catch {
                Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "url",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "regex") {
                if (z.regex.lastIndex = 0, !z.regex.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "regex",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "trim") A.data = A.data.trim();
            else if (z.kind === "includes") {
                if (!A.data.includes(z.value, z.position)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    code: r8.invalid_string,
                    validation: {
                        includes: z.value,
                        position: z.position
                    },
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "toLowerCase") A.data = A.data.toLowerCase();
            else if (z.kind === "toUpperCase") A.data = A.data.toUpperCase();
            else if (z.kind === "startsWith") {
                if (!A.data.startsWith(z.value)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    code: r8.invalid_string,
                    validation: {
                        startsWith: z.value
                    },
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "endsWith") {
                if (!A.data.endsWith(z.value)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    code: r8.invalid_string,
                    validation: {
                        endsWith: z.value
                    },
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "datetime") {
                if (!Ce8(z).test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    code: r8.invalid_string,
                    validation: "datetime",
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "date") {
                if (!EW5.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    code: r8.invalid_string,
                    validation: "date",
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "time") {
                if (!kW5(z).test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    code: r8.invalid_string,
                    validation: "time",
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "duration") {
                if (!PW5.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "duration",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "ip") {
                if (!LW5(A.data, z.version)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "ip",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "jwt") {
                if (!RW5(A.data, z.alg)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "jwt",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "cidr") {
                if (!yW5(A.data, z.version)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "cidr",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "base64") {
                if (!TW5.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "base64",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else if (z.kind === "base64url") {
                if (!vW5.test(A.data)) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    validation: "base64url",
                    code: r8.invalid_string,
                    message: z.message
                }), K.dirty()
            } else x9.assertNever(z);
            return {
                status: K.value,
                value: A.data
            }
        }
        _regex(A, q, K) {
            return this.refinement((Y) => A.test(Y), {
                validation: q,
                code: r8.invalid_string,
                ..._q.errToObj(K)
            })
        }
        _addCheck(A) {
            return new eC({
                ...this._def,
                checks: [...this._def.checks, A]
            })
        }
        email(A) {
            return this._addCheck({
                kind: "email",
                ..._q.errToObj(A)
            })
        }
        url(A) {
            return this._addCheck({
                kind: "url",
                ..._q.errToObj(A)
            })
        }
        emoji(A) {
            return this._addCheck({
                kind: "emoji",
                ..._q.errToObj(A)
            })
        }
        uuid(A) {
            return this._addCheck({
                kind: "uuid",
                ..._q.errToObj(A)
            })
        }
        nanoid(A) {
            return this._addCheck({
                kind: "nanoid",
                ..._q.errToObj(A)
            })
        }
        cuid(A) {
            return this._addCheck({
                kind: "cuid",
                ..._q.errToObj(A)
            })
        }
        cuid2(A) {
            return this._addCheck({
                kind: "cuid2",
                ..._q.errToObj(A)
            })
        }
        ulid(A) {
            return this._addCheck({
                kind: "ulid",
                ..._q.errToObj(A)
            })
        }
        base64(A) {
            return this._addCheck({
                kind: "base64",
                ..._q.errToObj(A)
            })
        }
        base64url(A) {
            return this._addCheck({
                kind: "base64url",
                ..._q.errToObj(A)
            })
        }
        jwt(A) {
            return this._addCheck({
                kind: "jwt",
                ..._q.errToObj(A)
            })
        }
        ip(A) {
            return this._addCheck({
                kind: "ip",
                ..._q.errToObj(A)
            })
        }
        cidr(A) {
            return this._addCheck({
                kind: "cidr",
                ..._q.errToObj(A)
            })
        }
        datetime(A) {
            if (typeof A === "string") return this._addCheck({
                kind: "datetime",
                precision: null,
                offset: !1,
                local: !1,
                message: A
            });
            return this._addCheck({
                kind: "datetime",
                precision: typeof A?.precision > "u" ? null : A?.precision,
                offset: A?.offset ?? !1,
                local: A?.local ?? !1,
                ..._q.errToObj(A?.message)
            })
        }
        date(A) {
            return this._addCheck({
                kind: "date",
                message: A
            })
        }
        time(A) {
            if (typeof A === "string") return this._addCheck({
                kind: "time",
                precision: null,
                message: A
            });
            return this._addCheck({
                kind: "time",
                precision: typeof A?.precision > "u" ? null : A?.precision,
                ..._q.errToObj(A?.message)
            })
        }
        duration(A) {
            return this._addCheck({
                kind: "duration",
                ..._q.errToObj(A)
            })
        }
        regex(A, q) {
            return this._addCheck({
                kind: "regex",
                regex: A,
                ..._q.errToObj(q)
            })
        }
        includes(A, q) {
            return this._addCheck({
                kind: "includes",
                value: A,
                position: q?.position,
                ..._q.errToObj(q?.message)
            })
        }
        startsWith(A, q) {
            return this._addCheck({
                kind: "startsWith",
                value: A,
                ..._q.errToObj(q)
            })
        }
        endsWith(A, q) {
            return this._addCheck({
                kind: "endsWith",
                value: A,
                ..._q.errToObj(q)
            })
        }
        min(A, q) {
            return this._addCheck({
                kind: "min",
                value: A,
                ..._q.errToObj(q)
            })
        }
        max(A, q) {
            return this._addCheck({
                kind: "max",
                value: A,
                ..._q.errToObj(q)
            })
        }
        length(A, q) {
            return this._addCheck({
                kind: "length",
                value: A,
                ..._q.errToObj(q)
            })
        }
        nonempty(A) {
            return this.min(1, _q.errToObj(A))
        }
        trim() {
            return new eC({
                ...this._def,
                checks: [...this._def.checks, {
                    kind: "trim"
                }]
            })
        }
        toLowerCase() {
            return new eC({
                ...this._def,
                checks: [...this._def.checks, {
                    kind: "toLowerCase"
                }]
            })
        }
        toUpperCase() {
            return new eC({
                ...this._def,
                checks: [...this._def.checks, {
                    kind: "toUpperCase"
                }]
            })
        }
        get isDatetime() {
            return !!this._def.checks.find((A) => A.kind === "datetime")
        }
        get isDate() {
            return !!this._def.checks.find((A) => A.kind === "date")
        }
        get isTime() {
            return !!this._def.checks.find((A) => A.kind === "time")
        }
        get isDuration() {
            return !!this._def.checks.find((A) => A.kind === "duration")
        }
        get isEmail() {
            return !!this._def.checks.find((A) => A.kind === "email")
        }
        get isURL() {
            return !!this._def.checks.find((A) => A.kind === "url")
        }
        get isEmoji() {
            return !!this._def.checks.find((A) => A.kind === "emoji")
        }
        get isUUID() {
            return !!this._def.checks.find((A) => A.kind === "uuid")
        }
        get isNANOID() {
            return !!this._def.checks.find((A) => A.kind === "nanoid")
        }
        get isCUID() {
            return !!this._def.checks.find((A) => A.kind === "cuid")
        }
        get isCUID2() {
            return !!this._def.checks.find((A) => A.kind === "cuid2")
        }
        get isULID() {
            return !!this._def.checks.find((A) => A.kind === "ulid")
        }
        get isIP() {
            return !!this._def.checks.find((A) => A.kind === "ip")
        }
        get isCIDR() {
            return !!this._def.checks.find((A) => A.kind === "cidr")
        }
        get isBase64() {
            return !!this._def.checks.find((A) => A.kind === "base64")
        }
        get isBase64url() {
            return !!this._def.checks.find((A) => A.kind === "base64url")
        }
        get minLength() {
            let A = null;
            for (let q of this._def.checks)
                if (q.kind === "min") {
                    if (A === null || q.value > A) A = q.value
                } return A
        }
        get maxLength() {
            let A = null;
            for (let q of this._def.checks)
                if (q.kind === "max") {
                    if (A === null || q.value < A) A = q.value
                } return A
        }
    };
    eC.create = (A) => {
        return new eC({
            checks: [],
            typeName: cK.ZodString,
            coerce: A?.coerce ?? !1,
            ...Z5(A)
        })
    };
    wr = class wr extends q9 {
        constructor() {
            super(...arguments);
            this.min = this.gte, this.max = this.lte, this.step = this.multipleOf
        }
        _parse(A) {
            if (this._def.coerce) A.data = Number(A.data);
            if (this._getType(A) !== C7.number) {
                let z = this._getOrReturnCtx(A);
                return t7(z, {
                    code: r8.invalid_type,
                    expected: C7.number,
                    received: z.parsedType
                }), LK
            }
            let K = void 0,
                Y = new DM;
            for (let z of this._def.checks)
                if (z.kind === "int") {
                    if (!x9.isInteger(A.data)) K = this._getOrReturnCtx(A, K), t7(K, {
                        code: r8.invalid_type,
                        expected: "integer",
                        received: "float",
                        message: z.message
                    }), Y.dirty()
                } else if (z.kind === "min") {
                if (z.inclusive ? A.data < z.value : A.data <= z.value) K = this._getOrReturnCtx(A, K), t7(K, {
                    code: r8.too_small,
                    minimum: z.value,
                    type: "number",
                    inclusive: z.inclusive,
                    exact: !1,
                    message: z.message
                }), Y.dirty()
            } else if (z.kind === "max") {
                if (z.inclusive ? A.data > z.value : A.data >= z.value) K = this._getOrReturnCtx(A, K), t7(K, {
                    code: r8.too_big,
                    maximum: z.value,
                    type: "number",
                    inclusive: z.inclusive,
                    exact: !1,
                    message: z.message
                }), Y.dirty()
            } else if (z.kind === "multipleOf") {
                if (CW5(A.data, z.value) !== 0) K = this._getOrReturnCtx(A, K), t7(K, {
                    code: r8.not_multiple_of,
                    multipleOf: z.value,
                    message: z.message
                }), Y.dirty()
            } else if (z.kind === "finite") {
                if (!Number.isFinite(A.data)) K = this._getOrReturnCtx(A, K), t7(K, {
                    code: r8.not_finite,
                    message: z.message
                }), Y.dirty()
            } else x9.assertNever(z);
            return {
                status: Y.value,
                value: A.data
            }
        }
        gte(A, q) {
            return this.setLimit("min", A, !0, _q.toString(q))
        }
        gt(A, q) {
            return this.setLimit("min", A, !1, _q.toString(q))
        }
        lte(A, q) {
            return this.setLimit("max", A, !0, _q.toString(q))
        }
        lt(A, q) {
            return this.setLimit("max", A, !1, _q.toString(q))
        }
        setLimit(A, q, K, Y) {
            return new wr({
                ...this._def,
                checks: [...this._def.checks, {
                    kind: A,
                    value: q,
                    inclusive: K,
                    message: _q.toString(Y)
                }]
            })
        }
        _addCheck(A) {
            return new wr({
                ...this._def,
                checks: [...this._def.checks, A]
            })
        }
        int(A) {
            return this._addCheck({
                kind: "int",
                message: _q.toString(A)
            })
        }
        positive(A) {
            return this._addCheck({
                kind: "min",
                value: 0,
                inclusive: !1,
                message: _q.toString(A)
            })
        }
        negative(A) {
            return this._addCheck({
                kind: "max",
                value: 0,
                inclusive: !1,
                message: _q.toString(A)
            })
        }
        nonpositive(A) {
            return this._addCheck({
                kind: "max",
                value: 0,
                inclusive: !0,
                message: _q.toString(A)
            })
        }
        nonnegative(A) {
            return this._addCheck({
                kind: "min",
                value: 0,
                inclusive: !0,
                message: _q.toString(A)
            })
        }
        multipleOf(A, q) {
            return this._addCheck({
                kind: "multipleOf",
                value: A,
                message: _q.toString(q)
            })
        }
        finite(A) {
            return this._addCheck({
                kind: "finite",
                message: _q.toString(A)
            })
        }
        safe(A) {
            return this._addCheck({
                kind: "min",
                inclusive: !0,
                value: Number.MIN_SAFE_INTEGER,
                message: _q.toString(A)
            })._addCheck({
                kind: "max",
                inclusive: !0,
                value: Number.MAX_SAFE_INTEGER,
                message: _q.toString(A)
            })
        }
        get minValue() {
            let A = null;
            for (let q of this._def.checks)
                if (q.kind === "min") {
                    if (A === null || q.value > A) A = q.value
                } return A
        }
        get maxValue() {
            let A = null;
            for (let q of this._def.checks)
                if (q.kind === "max") {
                    if (A === null || q.value < A) A = q.value
                } return A
        }
        get isInt() {
            return !!this._def.checks.find((A) => A.kind === "int" || A.kind === "multipleOf" && x9.isInteger(A.value))
        }
        get isFinite() {
            let A = null,
                q = null;
            for (let K of this._def.checks)
                if (K.kind === "finite" || K.kind === "int" || K.kind === "multipleOf") return !0;
                else if (K.kind === "min") {
                if (q === null || K.value > q) q = K.value
            } else if (K.kind === "max") {
                if (A === null || K.value < A) A = K.value
            }
            return Number.isFinite(q) && Number.isFinite(A)
        }
    };
    wr.create = (A) => {
        return new wr({
            checks: [],
            typeName: cK.ZodNumber,
            coerce: A?.coerce || !1,
            ...Z5(A)
        })
    };
    Hr = class Hr extends q9 {
        constructor() {
            super(...arguments);
            this.min = this.gte, this.max = this.lte
        }
        _parse(A) {
            if (this._def.coerce) try {
                A.data = BigInt(A.data)
            } catch {
                return this._getInvalidInput(A)
            }
            if (this._getType(A) !== C7.bigint) return this._getInvalidInput(A);
            let K = void 0,
                Y = new DM;
            for (let z of this._def.checks)
                if (z.kind === "min") {
                    if (z.inclusive ? A.data < z.value : A.data <= z.value) K = this._getOrReturnCtx(A, K), t7(K, {
                        code: r8.too_small,
                        type: "bigint",
                        minimum: z.value,
                        inclusive: z.inclusive,
                        message: z.message
                    }), Y.dirty()
                } else if (z.kind === "max") {
                if (z.inclusive ? A.data > z.value : A.data >= z.value) K = this._getOrReturnCtx(A, K), t7(K, {
                    code: r8.too_big,
                    type: "bigint",
                    maximum: z.value,
                    inclusive: z.inclusive,
                    message: z.message
                }), Y.dirty()
            } else if (z.kind === "multipleOf") {
                if (A.data % z.value !== BigInt(0)) K = this._getOrReturnCtx(A, K), t7(K, {
                    code: r8.not_multiple_of,
                    multipleOf: z.value,
                    message: z.message
                }), Y.dirty()
            } else x9.assertNever(z);
            return {
                status: Y.value,
                value: A.data
            }
        }
        _getInvalidInput(A) {
            let q = this._getOrReturnCtx(A);
            return t7(q, {
                code: r8.invalid_type,
                expected: C7.bigint,
                received: q.parsedType
            }), LK
        }
        gte(A, q) {
            return this.setLimit("min", A, !0, _q.toString(q))
        }
        gt(A, q) {
            return this.setLimit("min", A, !1, _q.toString(q))
        }
        lte(A, q) {
            return this.setLimit("max", A, !0, _q.toString(q))
        }
        lt(A, q) {
            return this.setLimit("max", A, !1, _q.toString(q))
        }
        setLimit(A, q, K, Y) {
            return new Hr({
                ...this._def,
                checks: [...this._def.checks, {
                    kind: A,
                    value: q,
                    inclusive: K,
                    message: _q.toString(Y)
                }]
            })
        }
        _addCheck(A) {
            return new Hr({
                ...this._def,
                checks: [...this._def.checks, A]
            })
        }
        positive(A) {
            return this._addCheck({
                kind: "min",
                value: BigInt(0),
                inclusive: !1,
                message: _q.toString(A)
            })
        }
        negative(A) {
            return this._addCheck({
                kind: "max",
                value: BigInt(0),
                inclusive: !1,
                message: _q.toString(A)
            })
        }
        nonpositive(A) {
            return this._addCheck({
                kind: "max",
                value: BigInt(0),
                inclusive: !0,
                message: _q.toString(A)
            })
        }
        nonnegative(A) {
            return this._addCheck({
                kind: "min",
                value: BigInt(0),
                inclusive: !0,
                message: _q.toString(A)
            })
        }
        multipleOf(A, q) {
            return this._addCheck({
                kind: "multipleOf",
                value: A,
                message: _q.toString(q)
            })
        }
        get minValue() {
            let A = null;
            for (let q of this._def.checks)
                if (q.kind === "min") {
                    if (A === null || q.value > A) A = q.value
                } return A
        }
        get maxValue() {
            let A = null;
            for (let q of this._def.checks)
                if (q.kind === "max") {
                    if (A === null || q.value < A) A = q.value
                } return A
        }
    };
    Hr.create = (A) => {
        return new Hr({
            checks: [],
            typeName: cK.ZodBigInt,
            coerce: A?.coerce ?? !1,
            ...Z5(A)
        })
    };
    W_1 = class W_1 extends q9 {
        _parse(A) {
            if (this._def.coerce) A.data = Boolean(A.data);
            if (this._getType(A) !== C7.boolean) {
                let K = this._getOrReturnCtx(A);
                return t7(K, {
                    code: r8.invalid_type,
                    expected: C7.boolean,
                    received: K.parsedType
                }), LK
            }
            return XW(A.data)
        }
    };
    W_1.create = (A) => {
        return new W_1({
            typeName: cK.ZodBoolean,
            coerce: A?.coerce || !1,
            ...Z5(A)
        })
    };
    i81 = class i81 extends q9 {
        _parse(A) {
            if (this._def.coerce) A.data = new Date(A.data);
            if (this._getType(A) !== C7.date) {
                let z = this._getOrReturnCtx(A);
                return t7(z, {
                    code: r8.invalid_type,
                    expected: C7.date,
                    received: z.parsedType
                }), LK
            }
            if (Number.isNaN(A.data.getTime())) {
                let z = this._getOrReturnCtx(A);
                return t7(z, {
                    code: r8.invalid_date
                }), LK
            }
            let K = new DM,
                Y = void 0;
            for (let z of this._def.checks)
                if (z.kind === "min") {
                    if (A.data.getTime() < z.value) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                        code: r8.too_small,
                        message: z.message,
                        inclusive: !0,
                        exact: !1,
                        minimum: z.value,
                        type: "date"
                    }), K.dirty()
                } else if (z.kind === "max") {
                if (A.data.getTime() > z.value) Y = this._getOrReturnCtx(A, Y), t7(Y, {
                    code: r8.too_big,
                    message: z.message,
                    inclusive: !0,
                    exact: !1,
                    maximum: z.value,
                    type: "date"
                }), K.dirty()
            } else x9.assertNever(z);
            return {
                status: K.value,
                value: new Date(A.data.getTime())
            }
        }
        _addCheck(A) {
            return new i81({
                ...this._def,
                checks: [...this._def.checks, A]
            })
        }
        min(A, q) {
            return this._addCheck({
                kind: "min",
                value: A.getTime(),
                message: _q.toString(q)
            })
        }
        max(A, q) {
            return this._addCheck({
                kind: "max",
                value: A.getTime(),
                message: _q.toString(q)
            })
        }
        get minDate() {
            let A = null;
            for (let q of this._def.checks)
                if (q.kind === "min") {
                    if (A === null || q.value > A) A = q.value
                } return A != null ? new Date(A) : null
        }
        get maxDate() {
            let A = null;
            for (let q of this._def.checks)
                if (q.kind === "max") {
                    if (A === null || q.value < A) A = q.value
                } return A != null ? new Date(A) : null
        }
    };
    i81.create = (A) => {
        return new i81({
            checks: [],
            coerce: A?.coerce || !1,
            typeName: cK.ZodDate,
            ...Z5(A)
        })
    };
    iy1 = class iy1 extends q9 {
        _parse(A) {
            if (this._getType(A) !== C7.symbol) {
                let K = this._getOrReturnCtx(A);
                return t7(K, {
                    code: r8.invalid_type,
                    expected: C7.symbol,
                    received: K.parsedType
                }), LK
            }
            return XW(A.data)
        }
    };
    iy1.create = (A) => {
        return new iy1({
            typeName: cK.ZodSymbol,
            ...Z5(A)
        })
    };
    G_1 = class G_1 extends q9 {
        _parse(A) {
            if (this._getType(A) !== C7.undefined) {
                let K = this._getOrReturnCtx(A);
                return t7(K, {
                    code: r8.invalid_type,
                    expected: C7.undefined,
                    received: K.parsedType
                }), LK
            }
            return XW(A.data)
        }
    };
    G_1.create = (A) => {
        return new G_1({
            typeName: cK.ZodUndefined,
            ...Z5(A)
        })
    };
    Z_1 = class Z_1 extends q9 {
        _parse(A) {
            if (this._getType(A) !== C7.null) {
                let K = this._getOrReturnCtx(A);
                return t7(K, {
                    code: r8.invalid_type,
                    expected: C7.null,
                    received: K.parsedType
                }), LK
            }
            return XW(A.data)
        }
    };
    Z_1.create = (A) => {
        return new Z_1({
            typeName: cK.ZodNull,
            ...Z5(A)
        })
    };
    n81 = class n81 extends q9 {
        constructor() {
            super(...arguments);
            this._any = !0
        }
        _parse(A) {
            return XW(A.data)
        }
    };
    n81.create = (A) => {
        return new n81({
            typeName: cK.ZodAny,
            ...Z5(A)
        })
    };
    zr = class zr extends q9 {
        constructor() {
            super(...arguments);
            this._unknown = !0
        }
        _parse(A) {
            return XW(A.data)
        }
    };
    zr.create = (A) => {
        return new zr({
            typeName: cK.ZodUnknown,
            ...Z5(A)
        })
    };
    Hu = class Hu extends q9 {
        _parse(A) {
            let q = this._getOrReturnCtx(A);
            return t7(q, {
                code: r8.invalid_type,
                expected: C7.never,
                received: q.parsedType
            }), LK
        }
    };
    Hu.create = (A) => {
        return new Hu({
            typeName: cK.ZodNever,
            ...Z5(A)
        })
    };
    ny1 = class ny1 extends q9 {
        _parse(A) {
            if (this._getType(A) !== C7.undefined) {
                let K = this._getOrReturnCtx(A);
                return t7(K, {
                    code: r8.invalid_type,
                    expected: C7.void,
                    received: K.parsedType
                }), LK
            }
            return XW(A.data)
        }
    };
    ny1.create = (A) => {
        return new ny1({
            typeName: cK.ZodVoid,
            ...Z5(A)
        })
    };
    AS = class AS extends q9 {
        _parse(A) {
            let {
                ctx: q,
                status: K
            } = this._processInputParams(A), Y = this._def;
            if (q.parsedType !== C7.array) return t7(q, {
                code: r8.invalid_type,
                expected: C7.array,
                received: q.parsedType
            }), LK;
            if (Y.exactLength !== null) {
                let w = q.data.length > Y.exactLength.value,
                    H = q.data.length < Y.exactLength.value;
                if (w || H) t7(q, {
                    code: w ? r8.too_big : r8.too_small,
                    minimum: H ? Y.exactLength.value : void 0,
                    maximum: w ? Y.exactLength.value : void 0,
                    type: "array",
                    inclusive: !0,
                    exact: !0,
                    message: Y.exactLength.message
                }), K.dirty()
            }
            if (Y.minLength !== null) {
                if (q.data.length < Y.minLength.value) t7(q, {
                    code: r8.too_small,
                    minimum: Y.minLength.value,
                    type: "array",
                    inclusive: !0,
                    exact: !1,
                    message: Y.minLength.message
                }), K.dirty()
            }
            if (Y.maxLength !== null) {
                if (q.data.length > Y.maxLength.value) t7(q, {
                    code: r8.too_big,
                    maximum: Y.maxLength.value,
                    type: "array",
                    inclusive: !0,
                    exact: !1,
                    message: Y.maxLength.message
                }), K.dirty()
            }
            if (q.common.async) return Promise.all([...q.data].map((w, H) => {
                return Y.type._parseAsync(new KS(q, w, q.path, H))
            })).then((w) => {
                return DM.mergeArray(K, w)
            });
            let z = [...q.data].map((w, H) => {
                return Y.type._parseSync(new KS(q, w, q.path, H))
            });
            return DM.mergeArray(K, z)
        }
        get element() {
            return this._def.type
        }
        min(A, q) {
            return new AS({
                ...this._def,
                minLength: {
                    value: A,
                    message: _q.toString(q)
                }
            })
        }
        max(A, q) {
            return new AS({
                ...this._def,
                maxLength: {
                    value: A,
                    message: _q.toString(q)
                }
            })
        }
        length(A, q) {
            return new AS({
                ...this._def,
                exactLength: {
                    value: A,
                    message: _q.toString(q)
                }
            })
        }
        nonempty(A) {
            return this.min(1, A)
        }
    };
    AS.create = (A, q) => {
        return new AS({
            type: A,
            minLength: null,
            maxLength: null,
            exactLength: null,
            typeName: cK.ZodArray,
            ...Z5(q)
        })
    };
    IO = class IO extends q9 {
        constructor() {
            super(...arguments);
            this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend
        }
        _getCached() {
            if (this._cached !== null) return this._cached;
            let A = this._def.shape(),
                q = x9.objectKeys(A);
            return this._cached = {
                shape: A,
                keys: q
            }, this._cached
        }
        _parse(A) {
            if (this._getType(A) !== C7.object) {
                let O = this._getOrReturnCtx(A);
                return t7(O, {
                    code: r8.invalid_type,
                    expected: C7.object,
                    received: O.parsedType
                }), LK
            }
            let {
                status: K,
                ctx: Y
            } = this._processInputParams(A), {
                shape: z,
                keys: w
            } = this._getCached(), H = [];
            if (!(this._def.catchall instanceof Hu && this._def.unknownKeys === "strip")) {
                for (let O in Y.data)
                    if (!w.includes(O)) H.push(O)
            }
            let $ = [];
            for (let O of w) {
                let _ = z[O],
                    J = Y.data[O];
                $.push({
                    key: {
                        status: "valid",
                        value: O
                    },
                    value: _._parse(new KS(Y, J, Y.path, O)),
                    alwaysSet: O in Y.data
                })
            }
            if (this._def.catchall instanceof Hu) {
                let O = this._def.unknownKeys;
                if (O === "passthrough")
                    for (let _ of H) $.push({
                        key: {
                            status: "valid",
                            value: _
                        },
                        value: {
                            status: "valid",
                            value: Y.data[_]
                        }
                    });
                else if (O === "strict") {
                    if (H.length > 0) t7(Y, {
                        code: r8.unrecognized_keys,
                        keys: H
                    }), K.dirty()
                } else if (O === "strip");
                else throw Error("Internal ZodObject error: invalid unknownKeys value.")
            } else {
                let O = this._def.catchall;
                for (let _ of H) {
                    let J = Y.data[_];
                    $.push({
                        key: {
                            status: "valid",
                            value: _
                        },
                        value: O._parse(new KS(Y, J, Y.path, _)),
                        alwaysSet: _ in Y.data
                    })
                }
            }
            if (Y.common.async) return Promise.resolve().then(async () => {
                let O = [];
                for (let _ of $) {
                    let J = await _.key,
                        X = await _.value;
                    O.push({
                        key: J,
                        value: X,
                        alwaysSet: _.alwaysSet
                    })
                }
                return O
            }).then((O) => {
                return DM.mergeObjectSync(K, O)
            });
            else return DM.mergeObjectSync(K, $)
        }
        get shape() {
            return this._def.shape()
        }
        strict(A) {
            return _q.errToObj, new IO({
                ...this._def,
                unknownKeys: "strict",
                ...A !== void 0 ? {
                    errorMap: (q, K) => {
                        let Y = this._def.errorMap?.(q, K).message ?? K.defaultError;
                        if (q.code === "unrecognized_keys") return {
                            message: _q.errToObj(A).message ?? Y
                        };
                        return {
                            message: Y
                        }
                    }
                } : {}
            })
        }
        strip() {
            return new IO({
                ...this._def,
                unknownKeys: "strip"
            })
        }
        passthrough() {
            return new IO({
                ...this._def,
                unknownKeys: "passthrough"
            })
        }
        extend(A) {
            return new IO({
                ...this._def,
                shape: () => ({
                    ...this._def.shape(),
                    ...A
                })
            })
        }
        merge(A) {
            return new IO({
                unknownKeys: A._def.unknownKeys,
                catchall: A._def.catchall,
                shape: () => ({
                    ...this._def.shape(),
                    ...A._def.shape()
                }),
                typeName: cK.ZodObject
            })
        }
        setKey(A, q) {
            return this.augment({
                [A]: q
            })
        }
        catchall(A) {
            return new IO({
                ...this._def,
                catchall: A
            })
        }
        pick(A) {
            let q = {};
            for (let K of x9.objectKeys(A))
                if (A[K] && this.shape[K]) q[K] = this.shape[K];
            return new IO({
                ...this._def,
                shape: () => q
            })
        }
        omit(A) {
            let q = {};
            for (let K of x9.objectKeys(this.shape))
                if (!A[K]) q[K] = this.shape[K];
            return new IO({
                ...this._def,
                shape: () => q
            })
        }
        deepPartial() {
            return M_1(this)
        }
        partial(A) {
            let q = {};
            for (let K of x9.objectKeys(this.shape)) {
                let Y = this.shape[K];
                if (A && !A[K]) q[K] = Y;
                else q[K] = Y.optional()
            }
            return new IO({
                ...this._def,
                shape: () => q
            })
        }
        required(A) {
            let q = {};
            for (let K of x9.objectKeys(this.shape))
                if (A && !A[K]) q[K] = this.shape[K];
                else {
                    let z = this.shape[K];
                    while (z instanceof qS) z = z._def.innerType;
                    q[K] = z
                } return new IO({
                ...this._def,
                shape: () => q
            })
        }
        keyof() {
            return Se8(x9.objectKeys(this.shape))
        }
    };
    IO.create = (A, q) => {
        return new IO({
            shape: () => A,
            unknownKeys: "strip",
            catchall: Hu.create(),
            typeName: cK.ZodObject,
            ...Z5(q)
        })
    };
    IO.strictCreate = (A, q) => {
        return new IO({
            shape: () => A,
            unknownKeys: "strict",
            catchall: Hu.create(),
            typeName: cK.ZodObject,
            ...Z5(q)
        })
    };
    IO.lazycreate = (A, q) => {
        return new IO({
            shape: A,
            unknownKeys: "strip",
            catchall: Hu.create(),
            typeName: cK.ZodObject,
            ...Z5(q)
        })
    };
    f_1 = class f_1 extends q9 {
        _parse(A) {
            let {
                ctx: q
            } = this._processInputParams(A), K = this._def.options;

            function Y(z) {
                for (let H of z)
                    if (H.result.status === "valid") return H.result;
                for (let H of z)
                    if (H.result.status === "dirty") return q.common.issues.push(...H.ctx.common.issues), H.result;
                let w = z.map((H) => new fV(H.ctx.common.issues));
                return t7(q, {
                    code: r8.invalid_union,
                    unionErrors: w
                }), LK
            }
            if (q.common.async) return Promise.all(K.map(async (z) => {
                let w = {
                    ...q,
                    common: {
                        ...q.common,
                        issues: []
                    },
                    parent: null
                };
                return {
                    result: await z._parseAsync({
                        data: q.data,
                        path: q.path,
                        parent: w
                    }),
                    ctx: w
                }
            })).then(Y);
            else {
                let z = void 0,
                    w = [];
                for (let $ of K) {
                    let O = {
                            ...q,
                            common: {
                                ...q.common,
                                issues: []
                            },
                            parent: null
                        },
                        _ = $._parseSync({
                            data: q.data,
                            path: q.path,
                            parent: O
                        });
                    if (_.status === "valid") return _;
                    else if (_.status === "dirty" && !z) z = {
                        result: _,
                        ctx: O
                    };
                    if (O.common.issues.length) w.push(O.common.issues)
                }
                if (z) return q.common.issues.push(...z.ctx.common.issues), z.result;
                let H = w.map(($) => new fV($));
                return t7(q, {
                    code: r8.invalid_union,
                    unionErrors: H
                }), LK
            }
        }
        get options() {
            return this._def.options
        }
    };
    f_1.create = (A, q) => {
        return new f_1({
            options: A,
            typeName: cK.ZodUnion,
            ...Z5(q)
        })
    };
    Wq6 = class Wq6 extends q9 {
        _parse(A) {
            let {
                ctx: q
            } = this._processInputParams(A);
            if (q.parsedType !== C7.object) return t7(q, {
                code: r8.invalid_type,
                expected: C7.object,
                received: q.parsedType
            }), LK;
            let K = this.discriminator,
                Y = q.data[K],
                z = this.optionsMap.get(Y);
            if (!z) return t7(q, {
                code: r8.invalid_union_discriminator,
                options: Array.from(this.optionsMap.keys()),
                path: [K]
            }), LK;
            if (q.common.async) return z._parseAsync({
                data: q.data,
                path: q.path,
                parent: q
            });
            else return z._parseSync({
                data: q.data,
                path: q.path,
                parent: q
            })
        }
        get discriminator() {
            return this._def.discriminator
        }
        get options() {
            return this._def.options
        }
        get optionsMap() {
            return this._def.optionsMap
        }
        static create(A, q, K) {
            let Y = new Map;
            for (let z of q) {
                let w = gg(z.shape[A]);
                if (!w.length) throw Error(`A discriminator value for key \`${A}\` could not be extracted from all schema options`);
                for (let H of w) {
                    if (Y.has(H)) throw Error(`Discriminator property ${String(A)} has duplicate value ${String(H)}`);
                    Y.set(H, z)
                }
            }
            return new Wq6({
                typeName: cK.ZodDiscriminatedUnion,
                discriminator: A,
                options: q,
                optionsMap: Y,
                ...Z5(K)
            })
        }
    };
    V_1 = class V_1 extends q9 {
        _parse(A) {
            let {
                status: q,
                ctx: K
            } = this._processInputParams(A), Y = (z, w) => {
                if (Mq6(z) || Mq6(w)) return LK;
                let H = g8A(z.value, w.value);
                if (!H.valid) return t7(K, {
                    code: r8.invalid_intersection_types
                }), LK;
                if (Pq6(z) || Pq6(w)) q.dirty();
                return {
                    status: q.value,
                    value: H.data
                }
            };
            if (K.common.async) return Promise.all([this._def.left._parseAsync({
                data: K.data,
                path: K.path,
                parent: K
            }), this._def.right._parseAsync({
                data: K.data,
                path: K.path,
                parent: K
            })]).then(([z, w]) => Y(z, w));
            else return Y(this._def.left._parseSync({
                data: K.data,
                path: K.path,
                parent: K
            }), this._def.right._parseSync({
                data: K.data,
                path: K.path,
                parent: K
            }))
        }
    };
    V_1.create = (A, q, K) => {
        return new V_1({
            left: A,
            right: q,
            typeName: cK.ZodIntersection,
            ...Z5(K)
        })
    };
    $u = class $u extends q9 {
        _parse(A) {
            let {
                status: q,
                ctx: K
            } = this._processInputParams(A);
            if (K.parsedType !== C7.array) return t7(K, {
                code: r8.invalid_type,
                expected: C7.array,
                received: K.parsedType
            }), LK;
            if (K.data.length < this._def.items.length) return t7(K, {
                code: r8.too_small,
                minimum: this._def.items.length,
                inclusive: !0,
                exact: !1,
                type: "array"
            }), LK;
            if (!this._def.rest && K.data.length > this._def.items.length) t7(K, {
                code: r8.too_big,
                maximum: this._def.items.length,
                inclusive: !0,
                exact: !1,
                type: "array"
            }), q.dirty();
            let z = [...K.data].map((w, H) => {
                let $ = this._def.items[H] || this._def.rest;
                if (!$) return null;
                return $._parse(new KS(K, w, K.path, H))
            }).filter((w) => !!w);
            if (K.common.async) return Promise.all(z).then((w) => {
                return DM.mergeArray(q, w)
            });
            else return DM.mergeArray(q, z)
        }
        get items() {
            return this._def.items
        }
        rest(A) {
            return new $u({
                ...this._def,
                rest: A
            })
        }
    };
    $u.create = (A, q) => {
        if (!Array.isArray(A)) throw Error("You must pass an array of schemas to z.tuple([ ... ])");
        return new $u({
            items: A,
            typeName: cK.ZodTuple,
            rest: null,
            ...Z5(q)
        })
    };
    ry1 = class ry1 extends q9 {
        get keySchema() {
            return this._def.keyType
        }
        get valueSchema() {
            return this._def.valueType
        }
        _parse(A) {
            let {
                status: q,
                ctx: K
            } = this._processInputParams(A);
            if (K.parsedType !== C7.object) return t7(K, {
                code: r8.invalid_type,
                expected: C7.object,
                received: K.parsedType
            }), LK;
            let Y = [],
                z = this._def.keyType,
                w = this._def.valueType;
            for (let H in K.data) Y.push({
                key: z._parse(new KS(K, H, K.path, H)),
                value: w._parse(new KS(K, K.data[H], K.path, H)),
                alwaysSet: H in K.data
            });
            if (K.common.async) return DM.mergeObjectAsync(q, Y);
            else return DM.mergeObjectSync(q, Y)
        }
        get element() {
            return this._def.valueType
        }
        static create(A, q, K) {
            if (q instanceof q9) return new ry1({
                keyType: A,
                valueType: q,
                typeName: cK.ZodRecord,
                ...Z5(K)
            });
            return new ry1({
                keyType: eC.create(),
                valueType: A,
                typeName: cK.ZodRecord,
                ...Z5(q)
            })
        }
    };
    oy1 = class oy1 extends q9 {
        get keySchema() {
            return this._def.keyType
        }
        get valueSchema() {
            return this._def.valueType
        }
        _parse(A) {
            let {
                status: q,
                ctx: K
            } = this._processInputParams(A);
            if (K.parsedType !== C7.map) return t7(K, {
                code: r8.invalid_type,
                expected: C7.map,
                received: K.parsedType
            }), LK;
            let Y = this._def.keyType,
                z = this._def.valueType,
                w = [...K.data.entries()].map(([H, $], O) => {
                    return {
                        key: Y._parse(new KS(K, H, K.path, [O, "key"])),
                        value: z._parse(new KS(K, $, K.path, [O, "value"]))
                    }
                });
            if (K.common.async) {
                let H = new Map;
                return Promise.resolve().then(async () => {
                    for (let $ of w) {
                        let O = await $.key,
                            _ = await $.value;
                        if (O.status === "aborted" || _.status === "aborted") return LK;
                        if (O.status === "dirty" || _.status === "dirty") q.dirty();
                        H.set(O.value, _.value)
                    }
                    return {
                        status: q.value,
                        value: H
                    }
                })
            } else {
                let H = new Map;
                for (let $ of w) {
                    let {
                        key: O,
                        value: _
                    } = $;
                    if (O.status === "aborted" || _.status === "aborted") return LK;
                    if (O.status === "dirty" || _.status === "dirty") q.dirty();
                    H.set(O.value, _.value)
                }
                return {
                    status: q.value,
                    value: H
                }
            }
        }
    };
    oy1.create = (A, q, K) => {
        return new oy1({
            valueType: q,
            keyType: A,
            typeName: cK.ZodMap,
            ...Z5(K)
        })
    };
    r81 = class r81 extends q9 {
        _parse(A) {
            let {
                status: q,
                ctx: K
            } = this._processInputParams(A);
            if (K.parsedType !== C7.set) return t7(K, {
                code: r8.invalid_type,
                expected: C7.set,
                received: K.parsedType
            }), LK;
            let Y = this._def;
            if (Y.minSize !== null) {
                if (K.data.size < Y.minSize.value) t7(K, {
                    code: r8.too_small,
                    minimum: Y.minSize.value,
                    type: "set",
                    inclusive: !0,
                    exact: !1,
                    message: Y.minSize.message
                }), q.dirty()
            }
            if (Y.maxSize !== null) {
                if (K.data.size > Y.maxSize.value) t7(K, {
                    code: r8.too_big,
                    maximum: Y.maxSize.value,
                    type: "set",
                    inclusive: !0,
                    exact: !1,
                    message: Y.maxSize.message
                }), q.dirty()
            }
            let z = this._def.valueType;

            function w($) {
                let O = new Set;
                for (let _ of $) {
                    if (_.status === "aborted") return LK;
                    if (_.status === "dirty") q.dirty();
                    O.add(_.value)
                }
                return {
                    status: q.value,
                    value: O
                }
            }
            let H = [...K.data.values()].map(($, O) => z._parse(new KS(K, $, K.path, O)));
            if (K.common.async) return Promise.all(H).then(($) => w($));
            else return w(H)
        }
        min(A, q) {
            return new r81({
                ...this._def,
                minSize: {
                    value: A,
                    message: _q.toString(q)
                }
            })
        }
        max(A, q) {
            return new r81({
                ...this._def,
                maxSize: {
                    value: A,
                    message: _q.toString(q)
                }
            })
        }
        size(A, q) {
            return this.min(A, q).max(A, q)
        }
        nonempty(A) {
            return this.min(1, A)
        }
    };
    r81.create = (A, q) => {
        return new r81({
            valueType: A,
            minSize: null,
            maxSize: null,
            typeName: cK.ZodSet,
            ...Z5(q)
        })
    };
    P_1 = class P_1 extends q9 {
        constructor() {
            super(...arguments);
            this.validate = this.implement
        }
        _parse(A) {
            let {
                ctx: q
            } = this._processInputParams(A);
            if (q.parsedType !== C7.function) return t7(q, {
                code: r8.invalid_type,
                expected: C7.function,
                received: q.parsedType
            }), LK;

            function K(H, $) {
                return ly1({
                    data: H,
                    path: q.path,
                    errorMaps: [q.common.contextualErrorMap, q.schemaErrorMap, D_1(), Qg].filter((O) => !!O),
                    issueData: {
                        code: r8.invalid_arguments,
                        argumentsError: $
                    }
                })
            }

            function Y(H, $) {
                return ly1({
                    data: H,
                    path: q.path,
                    errorMaps: [q.common.contextualErrorMap, q.schemaErrorMap, D_1(), Qg].filter((O) => !!O),
                    issueData: {
                        code: r8.invalid_return_type,
                        returnTypeError: $
                    }
                })
            }
            let z = {
                    errorMap: q.common.contextualErrorMap
                },
                w = q.data;
            if (this._def.returns instanceof o81) {
                let H = this;
                return XW(async function(...$) {
                    let O = new fV([]),
                        _ = await H._def.args.parseAsync($, z).catch((D) => {
                            throw O.addIssue(K($, D)), O
                        }),
                        J = await Reflect.apply(w, this, _);
                    return await H._def.returns._def.type.parseAsync(J, z).catch((D) => {
                        throw O.addIssue(Y(J, D)), O
                    })
                })
            } else {
                let H = this;
                return XW(function(...$) {
                    let O = H._def.args.safeParse($, z);
                    if (!O.success) throw new fV([K($, O.error)]);
                    let _ = Reflect.apply(w, this, O.data),
                        J = H._def.returns.safeParse(_, z);
                    if (!J.success) throw new fV([Y(_, J.error)]);
                    return J.data
                })
            }
        }
        parameters() {
            return this._def.args
        }
        returnType() {
            return this._def.returns
        }
        args(...A) {
            return new P_1({
                ...this._def,
                args: $u.create(A).rest(zr.create())
            })
        }
        returns(A) {
            return new P_1({
                ...this._def,
                returns: A
            })
        }
        implement(A) {
            return this.parse(A)
        }
        strictImplement(A) {
            return this.parse(A)
        }
        static create(A, q, K) {
            return new P_1({
                args: A ? A : $u.create([]).rest(zr.create()),
                returns: q || zr.create(),
                typeName: cK.ZodFunction,
                ...Z5(K)
            })
        }
    };
    N_1 = class N_1 extends q9 {
        get schema() {
            return this._def.getter()
        }
        _parse(A) {
            let {
                ctx: q
            } = this._processInputParams(A);
            return this._def.getter()._parse({
                data: q.data,
                path: q.path,
                parent: q
            })
        }
    };
    N_1.create = (A, q) => {
        return new N_1({
            getter: A,
            typeName: cK.ZodLazy,
            ...Z5(q)
        })
    };
    T_1 = class T_1 extends q9 {
        _parse(A) {
            if (A.data !== this._def.value) {
                let q = this._getOrReturnCtx(A);
                return t7(q, {
                    received: q.data,
                    code: r8.invalid_literal,
                    expected: this._def.value
                }), LK
            }
            return {
                status: "valid",
                value: A.data
            }
        }
        get value() {
            return this._def.value
        }
    };
    T_1.create = (A, q) => {
        return new T_1({
            value: A,
            typeName: cK.ZodLiteral,
            ...Z5(q)
        })
    };
    $r = class $r extends q9 {
        _parse(A) {
            if (typeof A.data !== "string") {
                let q = this._getOrReturnCtx(A),
                    K = this._def.values;
                return t7(q, {
                    expected: x9.joinValues(K),
                    received: q.parsedType,
                    code: r8.invalid_type
                }), LK
            }
            if (!this._cache) this._cache = new Set(this._def.values);
            if (!this._cache.has(A.data)) {
                let q = this._getOrReturnCtx(A),
                    K = this._def.values;
                return t7(q, {
                    received: q.data,
                    code: r8.invalid_enum_value,
                    options: K
                }), LK
            }
            return XW(A.data)
        }
        get options() {
            return this._def.values
        }
        get enum() {
            let A = {};
            for (let q of this._def.values) A[q] = q;
            return A
        }
        get Values() {
            let A = {};
            for (let q of this._def.values) A[q] = q;
            return A
        }
        get Enum() {
            let A = {};
            for (let q of this._def.values) A[q] = q;
            return A
        }
        extract(A, q = this._def) {
            return $r.create(A, {
                ...this._def,
                ...q
            })
        }
        exclude(A, q = this._def) {
            return $r.create(this.options.filter((K) => !A.includes(K)), {
                ...this._def,
                ...q
            })
        }
    };
    $r.create = Se8;
    v_1 = class v_1 extends q9 {
        _parse(A) {
            let q = x9.getValidEnumValues(this._def.values),
                K = this._getOrReturnCtx(A);
            if (K.parsedType !== C7.string && K.parsedType !== C7.number) {
                let Y = x9.objectValues(q);
                return t7(K, {
                    expected: x9.joinValues(Y),
                    received: K.parsedType,
                    code: r8.invalid_type
                }), LK
            }
            if (!this._cache) this._cache = new Set(x9.getValidEnumValues(this._def.values));
            if (!this._cache.has(A.data)) {
                let Y = x9.objectValues(q);
                return t7(K, {
                    received: K.data,
                    code: r8.invalid_enum_value,
                    options: Y
                }), LK
            }
            return XW(A.data)
        }
        get enum() {
            return this._def.values
        }
    };
    v_1.create = (A, q) => {
        return new v_1({
            values: A,
            typeName: cK.ZodNativeEnum,
            ...Z5(q)
        })
    };
    o81 = class o81 extends q9 {
        unwrap() {
            return this._def.type
        }
        _parse(A) {
            let {
                ctx: q
            } = this._processInputParams(A);
            if (q.parsedType !== C7.promise && q.common.async === !1) return t7(q, {
                code: r8.invalid_type,
                expected: C7.promise,
                received: q.parsedType
            }), LK;
            let K = q.parsedType === C7.promise ? q.data : Promise.resolve(q.data);
            return XW(K.then((Y) => {
                return this._def.type.parseAsync(Y, {
                    path: q.path,
                    errorMap: q.common.contextualErrorMap
                })
            }))
        }
    };
    o81.create = (A, q) => {
        return new o81({
            type: A,
            typeName: cK.ZodPromise,
            ...Z5(q)
        })
    };
    YS = class YS extends q9 {
        innerType() {
            return this._def.schema
        }
        sourceType() {
            return this._def.schema._def.typeName === cK.ZodEffects ? this._def.schema.sourceType() : this._def.schema
        }
        _parse(A) {
            let {
                status: q,
                ctx: K
            } = this._processInputParams(A), Y = this._def.effect || null, z = {
                addIssue: (w) => {
                    if (t7(K, w), w.fatal) q.abort();
                    else q.dirty()
                },
                get path() {
                    return K.path
                }
            };
            if (z.addIssue = z.addIssue.bind(z), Y.type === "preprocess") {
                let w = Y.transform(K.data, z);
                if (K.common.async) return Promise.resolve(w).then(async (H) => {
                    if (q.value === "aborted") return LK;
                    let $ = await this._def.schema._parseAsync({
                        data: H,
                        path: K.path,
                        parent: K
                    });
                    if ($.status === "aborted") return LK;
                    if ($.status === "dirty") return l81($.value);
                    if (q.value === "dirty") return l81($.value);
                    return $
                });
                else {
                    if (q.value === "aborted") return LK;
                    let H = this._def.schema._parseSync({
                        data: w,
                        path: K.path,
                        parent: K
                    });
                    if (H.status === "aborted") return LK;
                    if (H.status === "dirty") return l81(H.value);
                    if (q.value === "dirty") return l81(H.value);
                    return H
                }
            }
            if (Y.type === "refinement") {
                let w = (H) => {
                    let $ = Y.refinement(H, z);
                    if (K.common.async) return Promise.resolve($);
                    if ($ instanceof Promise) throw Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                    return H
                };
                if (K.common.async === !1) {
                    let H = this._def.schema._parseSync({
                        data: K.data,
                        path: K.path,
                        parent: K
                    });
                    if (H.status === "aborted") return LK;
                    if (H.status === "dirty") q.dirty();
                    return w(H.value), {
                        status: q.value,
                        value: H.value
                    }
                } else return this._def.schema._parseAsync({
                    data: K.data,
                    path: K.path,
                    parent: K
                }).then((H) => {
                    if (H.status === "aborted") return LK;
                    if (H.status === "dirty") q.dirty();
                    return w(H.value).then(() => {
                        return {
                            status: q.value,
                            value: H.value
                        }
                    })
                })
            }
            if (Y.type === "transform")
                if (K.common.async === !1) {
                    let w = this._def.schema._parseSync({
                        data: K.data,
                        path: K.path,
                        parent: K
                    });
                    if (!Yr(w)) return LK;
                    let H = Y.transform(w.value, z);
                    if (H instanceof Promise) throw Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
                    return {
                        status: q.value,
                        value: H
                    }
                } else return this._def.schema._parseAsync({
                    data: K.data,
                    path: K.path,
                    parent: K
                }).then((w) => {
                    if (!Yr(w)) return LK;
                    return Promise.resolve(Y.transform(w.value, z)).then((H) => ({
                        status: q.value,
                        value: H
                    }))
                });
            x9.assertNever(Y)
        }
    };
    YS.create = (A, q, K) => {
        return new YS({
            schema: A,
            typeName: cK.ZodEffects,
            effect: q,
            ...Z5(K)
        })
    };
    YS.createWithPreprocess = (A, q, K) => {
        return new YS({
            schema: q,
            effect: {
                type: "preprocess",
                transform: A
            },
            typeName: cK.ZodEffects,
            ...Z5(K)
        })
    };
    qS = class qS extends q9 {
        _parse(A) {
            if (this._getType(A) === C7.undefined) return XW(void 0);
            return this._def.innerType._parse(A)
        }
        unwrap() {
            return this._def.innerType
        }
    };
    qS.create = (A, q) => {
        return new qS({
            innerType: A,
            typeName: cK.ZodOptional,
            ...Z5(q)
        })
    };
    Ug = class Ug extends q9 {
        _parse(A) {
            if (this._getType(A) === C7.null) return XW(null);
            return this._def.innerType._parse(A)
        }
        unwrap() {
            return this._def.innerType
        }
    };
    Ug.create = (A, q) => {
        return new Ug({
            innerType: A,
            typeName: cK.ZodNullable,
            ...Z5(q)
        })
    };
    E_1 = class E_1 extends q9 {
        _parse(A) {
            let {
                ctx: q
            } = this._processInputParams(A), K = q.data;
            if (q.parsedType === C7.undefined) K = this._def.defaultValue();
            return this._def.innerType._parse({
                data: K,
                path: q.path,
                parent: q
            })
        }
        removeDefault() {
            return this._def.innerType
        }
    };
    E_1.create = (A, q) => {
        return new E_1({
            innerType: A,
            typeName: cK.ZodDefault,
            defaultValue: typeof q.default === "function" ? q.default : () => q.default,
            ...Z5(q)
        })
    };
    k_1 = class k_1 extends q9 {
        _parse(A) {
            let {
                ctx: q
            } = this._processInputParams(A), K = {
                ...q,
                common: {
                    ...q.common,
                    issues: []
                }
            }, Y = this._def.innerType._parse({
                data: K.data,
                path: K.path,
                parent: {
                    ...K
                }
            });
            if (j_1(Y)) return Y.then((z) => {
                return {
                    status: "valid",
                    value: z.status === "valid" ? z.value : this._def.catchValue({
                        get error() {
                            return new fV(K.common.issues)
                        },
                        input: K.data
                    })
                }
            });
            else return {
                status: "valid",
                value: Y.status === "valid" ? Y.value : this._def.catchValue({
                    get error() {
                        return new fV(K.common.issues)
                    },
                    input: K.data
                })
            }
        }
        removeCatch() {
            return this._def.innerType
        }
    };
    k_1.create = (A, q) => {
        return new k_1({
            innerType: A,
            typeName: cK.ZodCatch,
            catchValue: typeof q.catch === "function" ? q.catch : () => q.catch,
            ...Z5(q)
        })
    };
    ay1 = class ay1 extends q9 {
        _parse(A) {
            if (this._getType(A) !== C7.nan) {
                let K = this._getOrReturnCtx(A);
                return t7(K, {
                    code: r8.invalid_type,
                    expected: C7.nan,
                    received: K.parsedType
                }), LK
            }
            return {
                status: "valid",
                value: A.data
            }
        }
    };
    ay1.create = (A) => {
        return new ay1({
            typeName: cK.ZodNaN,
            ...Z5(A)
        })
    };
    SW5 = Symbol("zod_brand");
    Gq6 = class Gq6 extends q9 {
        _parse(A) {
            let {
                ctx: q
            } = this._processInputParams(A), K = q.data;
            return this._def.type._parse({
                data: K,
                path: q.path,
                parent: q
            })
        }
        unwrap() {
            return this._def.type
        }
    };
    sy1 = class sy1 extends q9 {
        _parse(A) {
            let {
                status: q,
                ctx: K
            } = this._processInputParams(A);
            if (K.common.async) return (async () => {
                let z = await this._def.in._parseAsync({
                    data: K.data,
                    path: K.path,
                    parent: K
                });
                if (z.status === "aborted") return LK;
                if (z.status === "dirty") return q.dirty(), l81(z.value);
                else return this._def.out._parseAsync({
                    data: z.value,
                    path: K.path,
                    parent: K
                })
            })();
            else {
                let Y = this._def.in._parseSync({
                    data: K.data,
                    path: K.path,
                    parent: K
                });
                if (Y.status === "aborted") return LK;
                if (Y.status === "dirty") return q.dirty(), {
                    status: "dirty",
                    value: Y.value
                };
                else return this._def.out._parseSync({
                    data: Y.value,
                    path: K.path,
                    parent: K
                })
            }
        }
        static create(A, q) {
            return new sy1({
                in: A,
                out: q,
                typeName: cK.ZodPipeline
            })
        }
    };
    L_1 = class L_1 extends q9 {
        _parse(A) {
            let q = this._def.innerType._parse(A),
                K = (Y) => {
                    if (Yr(Y)) Y.value = Object.freeze(Y.value);
                    return Y
                };
            return j_1(q) ? q.then((Y) => K(Y)) : K(q)
        }
        unwrap() {
            return this._def.innerType
        }
    };
    L_1.create = (A, q) => {
        return new L_1({
            innerType: A,
            typeName: cK.ZodReadonly,
            ...Z5(q)
        })
    };
    hW5 = {
        object: IO.lazycreate
    };
    (function(A) {
        A.ZodString = "ZodString", A.ZodNumber = "ZodNumber", A.ZodNaN = "ZodNaN", A.ZodBigInt = "ZodBigInt", A.ZodBoolean = "ZodBoolean", A.ZodDate = "ZodDate", A.ZodSymbol = "ZodSymbol", A.ZodUndefined = "ZodUndefined", A.ZodNull = "ZodNull", A.ZodAny = "ZodAny", A.ZodUnknown = "ZodUnknown", A.ZodNever = "ZodNever", A.ZodVoid = "ZodVoid", A.ZodArray = "ZodArray", A.ZodObject = "ZodObject", A.ZodUnion = "ZodUnion", A.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", A.ZodIntersection = "ZodIntersection", A.ZodTuple = "ZodTuple", A.ZodRecord = "ZodRecord", A.ZodMap = "ZodMap", A.ZodSet = "ZodSet", A.ZodFunction = "ZodFunction", A.ZodLazy = "ZodLazy", A.ZodLiteral = "ZodLiteral", A.ZodEnum = "ZodEnum", A.ZodEffects = "ZodEffects", A.ZodNativeEnum = "ZodNativeEnum", A.ZodOptional = "ZodOptional", A.ZodNullable = "ZodNullable", A.ZodDefault = "ZodDefault", A.ZodCatch = "ZodCatch", A.ZodPromise = "ZodPromise", A.ZodBranded = "ZodBranded", A.ZodPipeline = "ZodPipeline", A.ZodReadonly = "ZodReadonly"
    })(cK || (cK = {}));
    g8 = eC.create, _L = wr.create, xW5 = ay1.create, bW5 = Hr.create, u0 = W_1.create, uW5 = i81.create, BW5 = iy1.create, mW5 = G_1.create, FW5 = Z_1.create, QW5 = n81.create, gW5 = zr.create, UW5 = Hu.create, pW5 = ny1.create, N_ = AS.create, Av = IO.create, qv = IO.strictCreate, a81 = f_1.create, dW5 = Wq6.create, cW5 = V_1.create, lW5 = $u.create, zS = ry1.create, iW5 = oy1.create, nW5 = r81.create, rW5 = P_1.create, oW5 = N_1.create, aW5 = T_1.create, wS = $r.create, sW5 = v_1.create, tW5 = o81.create, eW5 = YS.create, AG5 = qS.create, qG5 = Ug.create, KG5 = YS.createWithPreprocess, YG5 = sy1.create, $G5 = {
        string: (A) => eC.create({
            ...A,
            coerce: !0
        }),
        number: (A) => wr.create({
            ...A,
            coerce: !0
        }),
        boolean: (A) => W_1.create({
            ...A,
            coerce: !0
        }),
        bigint: (A) => Hr.create({
            ...A,
            coerce: !0
        }),
        date: (A) => i81.create({
            ...A,
            coerce: !0
        })
    }, OG5 = LK
})
// @from(Ln 123239, Col 4)
ZK = {}
// @from(Ln 123349, Col 4)
U8A = v(() => {
    jq6();
    F8A();
    ve8();
    cy1();
    Ie8();
    Dq6()
})
// @from(Ln 123357, Col 4)
R_1 = v(() => {
    U8A();
    U8A()
})
// @from(Ln 123361, Col 4)
d8A
// @from(Ln 123361, Col 9)
p8A
// @from(Ln 123361, Col 14)
_G5
// @from(Ln 123361, Col 19)
be8
// @from(Ln 123361, Col 24)
ue8
// @from(Ln 123361, Col 29)
Be8
// @from(Ln 123361, Col 34)
me8
// @from(Ln 123361, Col 39)
JG5
// @from(Ln 123361, Col 44)
Fe8
// @from(Ln 123362, Col 4)
Qe8 = v(() => {
    R_1();
    d8A = ZK.string().refine((A) => {
        if (A.includes("://") || A.includes("/") || A.includes(":")) return !1;
        if (A === "localhost") return !0;
        if (A.startsWith("*.")) {
            let q = A.slice(2);
            if (!q.includes(".") || q.startsWith(".") || q.endsWith(".")) return !1;
            let K = q.split(".");
            return K.length >= 2 && K.every((Y) => Y.length > 0)
        }
        if (A.includes("*")) return !1;
        return A.includes(".") && !A.startsWith(".") && !A.endsWith(".")
    }, {
        message: 'Invalid domain pattern. Must be a valid domain (e.g., "example.com") or wildcard (e.g., "*.example.com"). Overly broad patterns like "*.com" or "*" are not allowed for security reasons.'
    }), p8A = ZK.string().min(1, "Path cannot be empty"), _G5 = ZK.object({
        socketPath: ZK.string().min(1).describe("Unix socket path to the MITM proxy"),
        domains: ZK.array(d8A).min(1).describe('Domains to route through the MITM proxy (e.g., ["api.example.com", "*.internal.org"])')
    }), be8 = ZK.object({
        allowedDomains: ZK.array(d8A).describe('List of allowed domains (e.g., ["github.com", "*.npmjs.org"])'),
        deniedDomains: ZK.array(d8A).describe("List of denied domains"),
        allowUnixSockets: ZK.array(ZK.string()).optional().describe("macOS only: Unix socket paths to allow. Ignored on Linux (seccomp cannot filter by path)."),
        allowAllUnixSockets: ZK.boolean().optional().describe("If true, allow all Unix sockets (disables blocking on both platforms)."),
        allowLocalBinding: ZK.boolean().optional().describe("Whether to allow binding to local ports (default: false)"),
        httpProxyPort: ZK.number().int().min(1).max(65535).optional().describe("Port of an external HTTP proxy to use instead of starting a local one. When provided, the library will skip starting its own HTTP proxy and use this port. The external proxy must handle domain filtering."),
        socksProxyPort: ZK.number().int().min(1).max(65535).optional().describe("Port of an external SOCKS proxy to use instead of starting a local one. When provided, the library will skip starting its own SOCKS proxy and use this port. The external proxy must handle domain filtering."),
        mitmProxy: _G5.optional().describe("Optional MITM proxy configuration. Routes matching domains through an upstream proxy via Unix socket while SRT still handles allow/deny filtering.")
    }), ue8 = ZK.object({
        denyRead: ZK.array(p8A).describe("Paths denied for reading"),
        allowWrite: ZK.array(p8A).describe("Paths allowed for writing"),
        denyWrite: ZK.array(p8A).describe("Paths denied for writing (takes precedence over allowWrite)"),
        allowGitConfig: ZK.boolean().optional().describe("Allow writes to .git/config files (default: false). Enables git remote URL updates while keeping .git/hooks protected.")
    }), Be8 = ZK.record(ZK.string(), ZK.array(ZK.string())).describe('Map of command patterns to filesystem paths to ignore violations for. Use "*" to match all commands'), me8 = ZK.object({
        command: ZK.string().describe('The ripgrep command to execute (e.g., "rg", "claude")'),
        args: ZK.array(ZK.string()).optional().describe('Additional arguments to pass before ripgrep args (e.g., ["--ripgrep"])')
    }), JG5 = ZK.object({
        bpfPath: ZK.string().optional().describe("Path to the unix-block.bpf filter file"),
        applyPath: ZK.string().optional().describe("Path to the apply-seccomp binary")
    }), Fe8 = ZK.object({
        network: be8.describe("Network restrictions configuration"),
        filesystem: ue8.describe("Filesystem restrictions configuration"),
        ignoreViolations: Be8.optional().describe("Optional configuration for ignoring specific violations"),
        enableWeakerNestedSandbox: ZK.boolean().optional().describe("Enable weaker nested sandbox mode (for Docker environments)"),
        ripgrep: me8.optional().describe('Custom ripgrep configuration (default: { command: "rg" })'),
        mandatoryDenySearchDepth: ZK.number().int().min(1).max(10).optional().describe("Maximum directory depth to search for dangerous files on Linux (default: 3). Higher values provide more protection but slower performance."),
        allowPty: ZK.boolean().optional().describe("Allow pseudo-terminal (pty) operations (macOS only)"),
        seccomp: JG5.optional().describe("Custom seccomp binary paths (Linux only).")
    })
})
// @from(Ln 123411, Col 4)
ge8 = v(() => {
    Ne8();
    h8A();
    Qe8();
    J_1();
    wq6()
})
// @from(Ln 123419, Col 0)
function Ue8(A, q, K) {
    return `
Web page content:
---
${A}
---

${q}

${K?"Provide a concise response based on the content above. Include relevant details, code examples, and documentation excerpts as needed.":`Provide a concise response based only on the content above. In your response:
 - Enforce a strict 125-character maximum for quotes from any source document. Open Source Software is ok as long as we respect the license.
 - Use quotation marks for exact language from articles; any language outside of the quotation should never be word-for-word the same.
 - You are not a lawyer and never comment on the legality of your own prompts and responses.
 - Never produce or reproduce exact song lyrics.`}
`
}
// @from(Ln 123435, Col 4)
xO = "WebFetch"
// @from(Ln 123436, Col 4)
c8A = `
- Fetches content from a specified URL and processes it using an AI model
- Takes a URL and a prompt as input
- Fetches the URL content, converts HTML to markdown
- Processes the content with the prompt using a small, fast model
- Returns the model's response about the content
- Use this tool when you need to retrieve and analyze web content

Usage notes:
  - IMPORTANT: If an MCP-provided web fetch tool is available, prefer using that tool instead of this one, as it may have fewer restrictions.
  - The URL must be a fully-formed valid URL
  - HTTP URLs will be automatically upgraded to HTTPS
  - The prompt should describe what information you want to extract from the page
  - This tool is read-only and does not modify any files
  - Results may be summarized if the content is very large
  - Includes a self-cleaning 15-minute cache for faster responses when repeatedly accessing the same URL
  - When a URL redirects to a different host, the tool will inform you and provide the redirect URL in a special format. You should then make a new WebFetch request with the redirect URL to fetch the content.
  - For GitHub URLs, prefer using the gh CLI via Bash instead (e.g., gh pr view, gh issue view, gh api).
`
// @from(Ln 123455, Col 4)
bq = "Edit"
// @from(Ln 123456, Col 4)
Zq6 = "/.claude/**"
// @from(Ln 123457, Col 4)
fq6 = "~/.claude/**"
// @from(Ln 123458, Col 4)
ty1 = "File has been unexpectedly modified. Read it again before attempting to write it."
// @from(Ln 123460, Col 0)
function l8A(A) {
    let q = A.trim();
    if (!q) return null;
    if (q.endsWith("-")) {
        let w = parseInt(q.slice(0, -1), 10);
        if (isNaN(w) || w < 1) return null;
        return {
            firstPage: w,
            lastPage: 1 / 0
        }
    }
    let K = q.indexOf("-");
    if (K === -1) {
        let w = parseInt(q, 10);
        if (isNaN(w) || w < 1) return null;
        return {
            firstPage: w,
            lastPage: w
        }
    }
    let Y = parseInt(q.slice(0, K), 10),
        z = parseInt(q.slice(K + 1), 10);
    if (isNaN(Y) || isNaN(z) || Y < 1 || z < 1 || z < Y) return null;
    return {
        firstPage: Y,
        lastPage: z
    }
}
// @from(Ln 123489, Col 0)
function ey1() {
    return E4() === "firstParty"
}
// @from(Ln 123493, Col 0)
function s81(A) {
    let q = A.startsWith(".") ? A.slice(1) : A;
    return XG5.has(q.toLowerCase())
}
// @from(Ln 123497, Col 4)
XG5
// @from(Ln 123498, Col 4)
Vq6 = v(() => {
    UH();
    XG5 = new Set(["pdf"])
})
// @from(Ln 123502, Col 4)
Jq = "Read"
// @from(Ln 123503, Col 4)
AC1 = 2000
// @from(Ln 123504, Col 4)
DG5 = 2000
// @from(Ln 123505, Col 4)
pe8 = "Read a file from the local filesystem."
// @from(Ln 123506, Col 4)
de8
// @from(Ln 123507, Col 4)
_H = v(() => {
    Vq6();
    de8 = `Reads a file from the local filesystem. You can access any file directly by using this tool.
Assume this tool is able to read all files on the machine. If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.

Usage:
- The file_path parameter must be an absolute path, not a relative path
- By default, it reads up to ${AC1} lines starting from the beginning of the file
- You can optionally specify a line offset and limit (especially handy for long files), but it's recommended to read the whole file by not providing these parameters
- Any lines longer than ${DG5} characters will be truncated
- Results are returned using cat -n format, with line numbers starting at 1
- This tool allows Claude Code to read images (eg PNG, JPG, etc). When reading an image file the contents are presented visually as Claude Code is a multimodal LLM.${ey1()?`
- This tool can read PDF files (.pdf). For large PDFs (more than 10 pages), you MUST provide the pages parameter to read specific page ranges (e.g., pages: "1-5"). Reading a large PDF without the pages parameter will fail. Maximum 20 pages per request.`:""}
- This tool can read Jupyter notebooks (.ipynb files) and returns all cells with their outputs, combining code, text, and visualizations.
- This tool can only read files, not directories. To read a directory, use an ls command via the ${h4} tool.
- You can call multiple tools in a single response. It is always better to speculatively read multiple potentially useful files in parallel.
- You will regularly be asked to read screenshots. If the user provides a path to a screenshot, ALWAYS use this tool to view the file at the path. This tool will work with all temporary file paths.
- If you read a file that exists but has empty contents you will receive a system reminder warning in place of file contents.`
})
// @from(Ln 123535, Col 0)
function y_1(A) {
    let q = A.match(/^([^(]+)\(([^)]+)\)$/);
    if (!q) return {
        toolName: A
    };
    let K = q[1],
        Y = q[2];
    if (!K || !Y) return {
        toolName: A
    };
    return {
        toolName: K,
        ruleContent: Y
    }
}
// @from(Ln 123551, Col 0)
function WG5(A) {
    return A.match(/^(.+):\*$/)?.[1] ?? null
}
// @from(Ln 123555, Col 0)
function i8A(A, q) {
    if (A.startsWith("//")) return A.slice(1);
    if (A.startsWith("/") && !A.startsWith("//")) {
        let K = RO1(q);
        return qC1(K, A.slice(1))
    }
    return A
}
// @from(Ln 123564, Col 0)
function KC1() {
    return y7("policySettings")?.sandbox?.network?.allowManagedDomainsOnly === !0
}
// @from(Ln 123568, Col 0)
function n8A(A) {
    let q = A.permissions || {},
        K = [],
        Y = [];
    if (KC1()) {
        let j = y7("policySettings");
        for (let M of j?.sandbox?.network?.allowedDomains || []) K.push(M);
        for (let M of j?.permissions?.allow || []) {
            let P = y_1(M);
            if (P.toolName === xO && P.ruleContent?.startsWith("domain:")) K.push(P.ruleContent.substring(7))
        }
    } else {
        for (let j of A.sandbox?.network?.allowedDomains || []) K.push(j);
        for (let j of q.allow || []) {
            let M = y_1(j);
            if (M.toolName === xO && M.ruleContent?.startsWith("domain:")) K.push(M.ruleContent.substring(7))
        }
    }
    for (let j of q.deny || []) {
        let M = y_1(j);
        if (M.toolName === xO && M.ruleContent?.startsWith("domain:")) Y.push(M.ruleContent.substring(7))
    }
    let z = [".", YC1()],
        w = [],
        H = [],
        $ = gf.map((j) => Vw(j)).filter((j) => j !== void 0);
    w.push(...$);
    let O = Ex(),
        _ = y8();
    if (O !== _) w.push(qC1(O, ".claude", "settings.json")), w.push(qC1(O, ".claude", "settings.local.json"));
    if (w.push(qC1(_, ".claude", "skills")), O !== _) w.push(qC1(O, ".claude", "skills"));
    let J = jG5(O, ".git");
    try {
        if (MG5(J).isFile()) {
            let P = PG5(J, {
                encoding: "utf8"
            }).match(/^gitdir:\s*(.+)$/m);
            if (P?.[1]) {
                let W = P[1].trim(),
                    G = W.indexOf(".git");
                if (G > 0) {
                    let f = W.substring(0, G - 1);
                    if (f !== O) z.push(f)
                }
            }
        }
    } catch {}
    let X = new Set([...A.permissions?.additionalDirectories || [], ...qC()]);
    z.push(...X);
    for (let j of gf) {
        let M = y7(j);
        if (!M?.permissions) continue;
        for (let P of M.permissions.allow || []) {
            let W = y_1(P);
            if (W.toolName === bq && W.ruleContent) z.push(i8A(W.ruleContent, j))
        }
        for (let P of M.permissions.deny || []) {
            let W = y_1(P);
            if (W.toolName === bq && W.ruleContent) w.push(i8A(W.ruleContent, j));
            if (W.toolName === Jq && W.ruleContent) H.push(i8A(W.ruleContent, j))
        }
    }
    let D = A.sandbox?.ripgrep ? A.sandbox.ripgrep : (() => {
        let {
            rgPath: j,
            rgArgs: M
        } = uw1();
        return {
            command: j,
            args: M
        }
    })();
    return {
        network: {
            allowedDomains: K,
            deniedDomains: Y,
            allowUnixSockets: A.sandbox?.network?.allowUnixSockets,
            allowAllUnixSockets: A.sandbox?.network?.allowAllUnixSockets,
            allowLocalBinding: A.sandbox?.network?.allowLocalBinding,
            httpProxyPort: A.sandbox?.network?.httpProxyPort,
            socksProxyPort: A.sandbox?.network?.socksProxyPort
        },
        filesystem: {
            denyRead: H,
            allowWrite: z,
            denyWrite: w
        },
        ignoreViolations: A.sandbox?.ignoreViolations,
        enableWeakerNestedSandbox: A.sandbox?.enableWeakerNestedSandbox,
        ripgrep: D
    }
}
// @from(Ln 123661, Col 0)
function le8() {
    try {
        let A = C8();
        return ce8(A)
    } catch (A) {
        return h(`Failed to get settings for sandbox check: ${A}`), !1
    }
}
// @from(Ln 123670, Col 0)
function GG5() {
    let A = C8();
    return ie8(A)
}
// @from(Ln 123675, Col 0)
function ZG5() {
    let A = C8();
    return ne8(A)
}
// @from(Ln 123680, Col 0)
function oe8() {
    try {
        let A = l4();
        return re8(A)
    } catch (A) {
        return h(`Failed to check enabledPlatforms: ${A}`), !0
    }
}
// @from(Ln 123689, Col 0)
function Nq6() {
    if (!a8A()) return !1;
    if (o8A().errors.length > 0) return !1;
    if (!oe8()) return !1;
    return le8()
}
// @from(Ln 123696, Col 0)
function fG5() {
    let A = eA();
    if (A !== "linux" && A !== "wsl") return [];
    try {
        let q = C8();
        if (!q?.sandbox?.enabled) return [];
        let K = q?.permissions || {},
            Y = [],
            z = (w) => {
                let H = w.replace(/\/\*\*$/, "");
                return /[*?[\]]/.test(H)
            };
        for (let w of [...K.allow || [], ...K.deny || []]) {
            let H = y_1(w);
            if ((H.toolName === bq || H.toolName === Jq) && H.ruleContent && z(H.ruleContent)) Y.push(w)
        }
        return Y
    } catch (q) {
        return h(`Failed to get Linux glob pattern warnings: ${q}`), []
    }
}
// @from(Ln 123718, Col 0)
function VG5() {
    let A = ["flagSettings", "policySettings"];
    for (let q of A) {
        let K = y7(q);
        if (K?.sandbox?.enabled !== void 0 || K?.sandbox?.autoAllowBashIfSandboxed !== void 0 || K?.sandbox?.allowUnsandboxedCommands !== void 0) return !0
    }
    return !1
}
// @from(Ln 123726, Col 0)
async function NG5(A) {
    let q = y7("localSettings");
    Z7("localSettings", {
        sandbox: {
            ...q?.sandbox,
            ...A.enabled !== void 0 && {
                enabled: A.enabled
            },
            ...A.autoAllowBashIfSandboxed !== void 0 && {
                autoAllowBashIfSandboxed: A.autoAllowBashIfSandboxed
            },
            ...A.allowUnsandboxedCommands !== void 0 && {
                allowUnsandboxedCommands: A.allowUnsandboxedCommands
            }
        }
    })
}
// @from(Ln 123744, Col 0)
function TG5() {
    return C8()?.sandbox?.excludedCommands ?? []
}
// @from(Ln 123747, Col 0)
async function vG5(A, q, K, Y) {
    if (Nq6())
        if (Or) await Or;
        else throw Error("Sandbox failed to initialize. ");
    return hO.wrapWithSandbox(A, q, K, Y)
}