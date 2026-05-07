
// @from(Ln 33716, Col 4)
qS7 = p((tR7) => {
    Object.defineProperty(tR7, "__esModule", {
        value: !0
    });
    tR7.formatNames = tR7.fastFormats = tR7.fullFormats = void 0;

    function wU(q, K) {
        return {
            validate: q,
            compare: K
        }
    }
    tR7.fullFormats = {
        date: wU(rR7, D_1),
        time: wU(P_1(!0), Z_1),
        "date-time": wU(lR7(!0), aR7),
        "iso-time": wU(P_1(), oR7),
        "iso-date-time": wU(lR7(), sR7),
        duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
        uri: Su5,
        "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
        "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
        url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
        email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
        hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
        ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
        ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
        regex: Bu5,
        uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
        "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
        "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
        "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
        byte: Cu5,
        int32: {
            type: "number",
            validate: xu5
        },
        int64: {
            type: "number",
            validate: uu5
        },
        float: {
            type: "number",
            validate: iR7
        },
        double: {
            type: "number",
            validate: iR7
        },
        password: !0,
        binary: !0
    };
    tR7.fastFormats = {
        ...tR7.fullFormats,
        date: wU(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, D_1),
        time: wU(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, Z_1),
        "date-time": wU(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, aR7),
        "iso-time": wU(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, oR7),
        "iso-date-time": wU(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, sR7),
        uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
        "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
        email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    tR7.formatNames = Object.keys(tR7.fullFormats);

    function Eu5(q) {
        return q % 4 === 0 && (q % 100 !== 0 || q % 400 === 0)
    }
    var yu5 = /^(\d\d\d\d)-(\d\d)-(\d\d)$/,
        Lu5 = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function rR7(q) {
        let K = yu5.exec(q);
        if (!K) return !1;
        let _ = +K[1],
            z = +K[2],
            Y = +K[3];
        return z >= 1 && z <= 12 && Y >= 1 && Y <= (z === 2 && Eu5(_) ? 29 : Lu5[z])
    }

    function D_1(q, K) {
        if (!(q && K)) return;
        if (q > K) return 1;
        if (q < K) return -1;
        return 0
    }
    var M_1 = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;

    function P_1(q) {
        return function(_) {
            let z = M_1.exec(_);
            if (!z) return !1;
            let Y = +z[1],
                A = +z[2],
                O = +z[3],
                w = z[4],
                $ = z[5] === "-" ? -1 : 1,
                j = +(z[6] || 0),
                H = +(z[7] || 0);
            if (j > 23 || H > 59 || q && !w) return !1;
            if (Y <= 23 && A <= 59 && O < 60) return !0;
            let J = A - H * $,
                X = Y - j * $ - (J < 0 ? 1 : 0);
            return (X === 23 || X === -1) && (J === 59 || J === -1) && O < 61
        }
    }

    function Z_1(q, K) {
        if (!(q && K)) return;
        let _ = new Date("2020-01-01T" + q).valueOf(),
            z = new Date("2020-01-01T" + K).valueOf();
        if (!(_ && z)) return;
        return _ - z
    }

    function oR7(q, K) {
        if (!(q && K)) return;
        let _ = M_1.exec(q),
            z = M_1.exec(K);
        if (!(_ && z)) return;
        if (q = _[1] + _[2] + _[3], K = z[1] + z[2] + z[3], q > K) return 1;
        if (q < K) return -1;
        return 0
    }
    var W_1 = /t|\s/i;

    function lR7(q) {
        let K = P_1(q);
        return function(z) {
            let Y = z.split(W_1);
            return Y.length === 2 && rR7(Y[0]) && K(Y[1])
        }
    }

    function aR7(q, K) {
        if (!(q && K)) return;
        let _ = new Date(q).valueOf(),
            z = new Date(K).valueOf();
        if (!(_ && z)) return;
        return _ - z
    }

    function sR7(q, K) {
        if (!(q && K)) return;
        let [_, z] = q.split(W_1), [Y, A] = K.split(W_1), O = D_1(_, Y);
        if (O === void 0) return;
        return O || Z_1(z, A)
    }
    var hu5 = /\/|:/,
        Ru5 = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;

    function Su5(q) {
        return hu5.test(q) && Ru5.test(q)
    }
    var nR7 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;

    function Cu5(q) {
        return nR7.lastIndex = 0, nR7.test(q)
    }
    var bu5 = -2147483648,
        Iu5 = 2147483647;

    function xu5(q) {
        return Number.isInteger(q) && q <= Iu5 && q >= bu5
    }

    function uu5(q) {
        return Number.isInteger(q)
    }

    function iR7() {
        return !0
    }
    var mu5 = /[^\\]\\Z/;

    function Bu5(q) {
        if (mu5.test(q)) return !1;
        try {
            return new RegExp(q), !0
        } catch (K) {
            return !1
        }
    }
})
// @from(Ln 33900, Col 4)
_S7 = p((KS7) => {
    Object.defineProperty(KS7, "__esModule", {
        value: !0
    });
    KS7.formatLimitDefinition = void 0;
    var Fu5 = bj8(),
        vm = B_(),
        J16 = vm.operators,
        Ij8 = {
            formatMaximum: {
                okStr: "<=",
                ok: J16.LTE,
                fail: J16.GT
            },
            formatMinimum: {
                okStr: ">=",
                ok: J16.GTE,
                fail: J16.LT
            },
            formatExclusiveMaximum: {
                okStr: "<",
                ok: J16.LT,
                fail: J16.GTE
            },
            formatExclusiveMinimum: {
                okStr: ">",
                ok: J16.GT,
                fail: J16.LTE
            }
        },
        gu5 = {
            message: ({
                keyword: q,
                schemaCode: K
            }) => vm.str`should be ${Ij8[q].okStr} ${K}`,
            params: ({
                keyword: q,
                schemaCode: K
            }) => vm._`{comparison: ${Ij8[q].okStr}, limit: ${K}}`
        };
    KS7.formatLimitDefinition = {
        keyword: Object.keys(Ij8),
        type: "string",
        schemaType: "string",
        $data: !0,
        error: gu5,
        code(q) {
            let {
                gen: K,
                data: _,
                schemaCode: z,
                keyword: Y,
                it: A
            } = q, {
                opts: O,
                self: w
            } = A;
            if (!O.validateFormats) return;
            let $ = new Fu5.KeywordCxt(A, w.RULES.all.format.definition, "format");
            if ($.$data) j();
            else H();

            function j() {
                let X = K.scopeValue("formats", {
                        ref: w.formats,
                        code: O.code.formats
                    }),
                    M = K.const("fmt", vm._`${X}[${$.schemaCode}]`);
                q.fail$data((0, vm.or)(vm._`typeof ${M} != "object"`, vm._`${M} instanceof RegExp`, vm._`typeof ${M}.compare != "function"`, J(M)))
            }

            function H() {
                let X = $.schema,
                    M = w.formats[X];
                if (!M || M === !0) return;
                if (typeof M != "object" || M instanceof RegExp || typeof M.compare != "function") throw Error(`"${Y}": format "${X}" does not define "compare" function`);
                let P = K.scopeValue("formats", {
                    key: X,
                    ref: M,
                    code: O.code.formats ? vm._`${O.code.formats}${(0,vm.getProperty)(X)}` : void 0
                });
                q.fail$data(J(P))
            }

            function J(X) {
                return vm._`${X}.compare(${_}, ${z}) ${Ij8[Y].fail} 0`
            }
        },
        dependencies: ["format"]
    };
    var Uu5 = (q) => {
        return q.addKeyword(KS7.formatLimitDefinition), q
    };
    KS7.default = Uu5
})
// @from(Ln 33995, Col 4)
OS7 = p((wU6, AS7) => {
    Object.defineProperty(wU6, "__esModule", {
        value: !0
    });
    var aZ6 = qS7(),
        du5 = _S7(),
        v_1 = B_(),
        zS7 = new v_1.Name("fullFormats"),
        cu5 = new v_1.Name("fastFormats"),
        T_1 = (q, K = {
            keywords: !0
        }) => {
            if (Array.isArray(K)) return YS7(q, K, aZ6.fullFormats, zS7), q;
            let [_, z] = K.mode === "fast" ? [aZ6.fastFormats, cu5] : [aZ6.fullFormats, zS7], Y = K.formats || aZ6.formatNames;
            if (YS7(q, Y, _, z), K.keywords)(0, du5.default)(q);
            return q
        };
    T_1.get = (q, K = "full") => {
        let z = (K === "fast" ? aZ6.fastFormats : aZ6.fullFormats)[q];
        if (!z) throw Error(`Unknown format "${q}"`);
        return z
    };

    function YS7(q, K, _, z) {
        var Y, A;
        (Y = (A = q.opts.code).formats) !== null && Y !== void 0 || (A.formats = v_1._`require("ajv-formats/dist/formats").${z}`);
        for (let O of K) q.addFormat(O, _[O])
    }
    AS7.exports = wU6 = T_1;
    Object.defineProperty(wU6, "__esModule", {
        value: !0
    });
    wU6.default = T_1
})
// @from(Ln 34030, Col 0)
function lu5() {
    let q = new wS7.default({
        strict: !1,
        validateFormats: !0,
        validateSchema: !1,
        allErrors: !0
    });
    return $S7.default(q), q
}
// @from(Ln 34039, Col 0)
class $U6 {
    constructor(q) {
        this._ajv = q ?? lu5()
    }
    getValidator(q) {
        let K = "$id" in q && typeof q.$id === "string" ? this._ajv.getSchema(q.$id) ?? this._ajv.compile(q) : this._ajv.compile(q);
        return (_) => {
            if (K(_)) return {
                valid: !0,
                data: _,
                errorMessage: void 0
            };
            else return {
                valid: !1,
                data: void 0,
                errorMessage: this._ajv.errorsText(K.errors)
            }
        }
    }
}
// @from(Ln 34059, Col 4)
wS7
// @from(Ln 34059, Col 9)
$S7
// @from(Ln 34060, Col 4)
V_1 = L(() => {
    wS7 = K6(bj8(), 1), $S7 = K6(OS7(), 1)
})
// @from(Ln 34063, Col 0)
class k_1 {
    constructor(q) {
        this._server = q
    }
    requestStream(q, K, _) {
        return this._server.requestStream(q, K, _)
    }
    createMessageStream(q, K) {
        let _ = this._server.getClientCapabilities();
        if ((q.tools || q.toolChoice) && !_?.sampling?.tools) throw Error("Client does not support sampling tools capability.");
        if (q.messages.length > 0) {
            let z = q.messages[q.messages.length - 1],
                Y = Array.isArray(z.content) ? z.content : [z.content],
                A = Y.some((j) => j.type === "tool_result"),
                O = q.messages.length > 1 ? q.messages[q.messages.length - 2] : void 0,
                w = O ? Array.isArray(O.content) ? O.content : [O.content] : [],
                $ = w.some((j) => j.type === "tool_use");
            if (A) {
                if (Y.some((j) => j.type !== "tool_result")) throw Error("The last message must contain only tool_result content if any is present");
                if (!$) throw Error("tool_result blocks are not matching any tool_use from the previous message")
            }
            if ($) {
                let j = new Set(w.filter((J) => J.type === "tool_use").map((J) => J.id)),
                    H = new Set(Y.filter((J) => J.type === "tool_result").map((J) => J.toolUseId));
                if (j.size !== H.size || ![...j].every((J) => H.has(J))) throw Error("ids of tool_result blocks and tool_use blocks from previous message do not match")
            }
        }
        return this.requestStream({
            method: "sampling/createMessage",
            params: q
        }, aY6, K)
    }
    elicitInputStream(q, K) {
        let _ = this._server.getClientCapabilities(),
            z = q.mode ?? "form";
        switch (z) {
            case "url": {
                if (!_?.elicitation?.url) throw Error("Client does not support url elicitation.");
                break
            }
            case "form": {
                if (!_?.elicitation?.form) throw Error("Client does not support form elicitation.");
                break
            }
        }
        let Y = z === "form" && q.mode === void 0 ? {
            ...q,
            mode: "form"
        } : q;
        return this.requestStream({
            method: "elicitation/create",
            params: Y
        }, z16, K)
    }
    async getTask(q, K) {
        return this._server.getTask({
            taskId: q
        }, K)
    }
    async getTaskResult(q, K, _) {
        return this._server.getTaskResult({
            taskId: q
        }, K, _)
    }
    async listTasks(q, K) {
        return this._server.listTasks(q ? {
            cursor: q
        } : void 0, K)
    }
    async cancelTask(q, K) {
        return this._server.cancelTask({
            taskId: q
        }, K)
    }
}
// @from(Ln 34138, Col 4)
jS7 = L(() => {
    _P()
})
// @from(Ln 34142, Col 0)
function xj8(q, K, _) {
    if (!q) throw Error(`${_} does not support task creation (required for ${K})`);
    switch (K) {
        case "tools/call":
            if (!q.tools?.call) throw Error(`${_} does not support task creation for tools/call (required for ${K})`);
            break;
        default:
            break
    }
}
// @from(Ln 34153, Col 0)
function uj8(q, K, _) {
    if (!q) throw Error(`${_} does not support task creation (required for ${K})`);
    switch (K) {
        case "sampling/createMessage":
            if (!q.sampling?.createMessage) throw Error(`${_} does not support task creation for sampling/createMessage (required for ${K})`);
            break;
        case "elicitation/create":
            if (!q.elicitation?.create) throw Error(`${_} does not support task creation for elicitation/create (required for ${K})`);
            break;
        default:
            break
    }
}
// @from(Ln 34166, Col 4)
zA6
// @from(Ln 34167, Col 4)
mj8 = L(() => {
    v91();
    _P();
    V_1();
    Hg6();
    jS7();
    zA6 = class zA6 extends pg6 {
        constructor(q, K) {
            super(K);
            if (this._serverInfo = q, this._loggingLevels = new Map, this.LOG_LEVEL_SEVERITY = new Map(xg6.options.map((_, z) => [_, z])), this.isMessageIgnored = (_, z) => {
                    let Y = this._loggingLevels.get(z);
                    return Y ? this.LOG_LEVEL_SEVERITY.get(_) < this.LOG_LEVEL_SEVERITY.get(Y) : !1
                }, this._capabilities = K?.capabilities ?? {}, this._instructions = K?.instructions, this._jsonSchemaValidator = K?.jsonSchemaValidator ?? new $U6, this.setRequestHandler(x31, (_) => this._oninitialize(_)), this.setNotificationHandler(m$8, () => this.oninitialized?.()), this._capabilities.logging) this.setRequestHandler(d31, async (_, z) => {
                let Y = z.sessionId || z.requestInfo?.headers["mcp-session-id"] || void 0,
                    {
                        level: A
                    } = _.params,
                    O = xg6.safeParse(A);
                if (O.success) this._loggingLevels.set(Y, O.data);
                return {}
            })
        }
        get experimental() {
            if (!this._experimental) this._experimental = {
                tasks: new k_1(this)
            };
            return this._experimental
        }
        registerCapabilities(q) {
            if (this.transport) throw Error("Cannot register capabilities after connecting to transport");
            this._capabilities = a$8(this._capabilities, q)
        }
        setRequestHandler(q, K) {
            let z = IZ6(q)?.method;
            if (!z) throw Error("Schema is missing a method literal");
            let Y;
            if (q16(z)) {
                let O = z;
                Y = O._zod?.def?.value ?? O.value
            } else {
                let O = z;
                Y = O._def?.value ?? O.value
            }
            if (typeof Y !== "string") throw Error("Schema method literal must be a string");
            if (Y === "tools/call") {
                let O = async (w, $) => {
                    let j = DV(YU, w);
                    if (!j.success) {
                        let M = j.error instanceof Error ? j.error.message : String(j.error);
                        throw new SK(V5.InvalidParams, `Invalid tools/call request: ${M}`)
                    }
                    let {
                        params: H
                    } = j.data, J = await Promise.resolve(K(w, $));
                    if (H.task) {
                        let M = DV(Or, J);
                        if (!M.success) {
                            let P = M.error instanceof Error ? M.error.message : String(M.error);
                            throw new SK(V5.InvalidParams, `Invalid task creation result: ${P}`)
                        }
                        return M.data
                    }
                    let X = DV(zU, J);
                    if (!X.success) {
                        let M = X.error instanceof Error ? X.error.message : String(X.error);
                        throw new SK(V5.InvalidParams, `Invalid tools/call result: ${M}`)
                    }
                    return X.data
                };
                return super.setRequestHandler(q, O)
            }
            return super.setRequestHandler(q, K)
        }
        assertCapabilityForMethod(q) {
            switch (q) {
                case "sampling/createMessage":
                    if (!this._clientCapabilities?.sampling) throw Error(`Client does not support sampling (required for ${q})`);
                    break;
                case "elicitation/create":
                    if (!this._clientCapabilities?.elicitation) throw Error(`Client does not support elicitation (required for ${q})`);
                    break;
                case "roots/list":
                    if (!this._clientCapabilities?.roots) throw Error(`Client does not support listing roots (required for ${q})`);
                    break;
                case "ping":
                    break
            }
        }
        assertNotificationCapability(q) {
            switch (q) {
                case "notifications/message":
                    if (!this._capabilities.logging) throw Error(`Server does not support logging (required for ${q})`);
                    break;
                case "notifications/resources/updated":
                case "notifications/resources/list_changed":
                    if (!this._capabilities.resources) throw Error(`Server does not support notifying about resources (required for ${q})`);
                    break;
                case "notifications/tools/list_changed":
                    if (!this._capabilities.tools) throw Error(`Server does not support notifying of tool list changes (required for ${q})`);
                    break;
                case "notifications/prompts/list_changed":
                    if (!this._capabilities.prompts) throw Error(`Server does not support notifying of prompt list changes (required for ${q})`);
                    break;
                case "notifications/elicitation/complete":
                    if (!this._clientCapabilities?.elicitation?.url) throw Error(`Client does not support URL elicitation (required for ${q})`);
                    break;
                case "notifications/cancelled":
                    break;
                case "notifications/progress":
                    break
            }
        }
        assertRequestHandlerCapability(q) {
            if (!this._capabilities) return;
            switch (q) {
                case "completion/complete":
                    if (!this._capabilities.completions) throw Error(`Server does not support completions (required for ${q})`);
                    break;
                case "logging/setLevel":
                    if (!this._capabilities.logging) throw Error(`Server does not support logging (required for ${q})`);
                    break;
                case "prompts/get":
                case "prompts/list":
                    if (!this._capabilities.prompts) throw Error(`Server does not support prompts (required for ${q})`);
                    break;
                case "resources/list":
                case "resources/templates/list":
                case "resources/read":
                    if (!this._capabilities.resources) throw Error(`Server does not support resources (required for ${q})`);
                    break;
                case "tools/call":
                case "tools/list":
                    if (!this._capabilities.tools) throw Error(`Server does not support tools (required for ${q})`);
                    break;
                case "tasks/get":
                case "tasks/list":
                case "tasks/result":
                case "tasks/cancel":
                    if (!this._capabilities.tasks) throw Error(`Server does not support tasks capability (required for ${q})`);
                    break;
                case "ping":
                case "initialize":
                    break
            }
        }
        assertTaskCapability(q) {
            uj8(this._clientCapabilities?.tasks?.requests, q, "Client")
        }
        assertTaskHandlerCapability(q) {
            if (!this._capabilities) return;
            xj8(this._capabilities.tasks?.requests, q, "Server")
        }
        async _oninitialize(q) {
            let K = q.params.protocolVersion;
            return this._clientCapabilities = q.params.capabilities, this._clientVersion = q.params.clientInfo, {
                protocolVersion: b$8.includes(K) ? K : K16,
                capabilities: this.getCapabilities(),
                serverInfo: this._serverInfo,
                ...this._instructions && {
                    instructions: this._instructions
                }
            }
        }
        getClientCapabilities() {
            return this._clientCapabilities
        }
        getClientVersion() {
            return this._clientVersion
        }
        getCapabilities() {
            return this._capabilities
        }
        async ping() {
            return this.request({
                method: "ping"
            }, Ar)
        }
        async createMessage(q, K) {
            if (q.tools || q.toolChoice) {
                if (!this._clientCapabilities?.sampling?.tools) throw Error("Client does not support sampling tools capability.")
            }
            if (q.messages.length > 0) {
                let _ = q.messages[q.messages.length - 1],
                    z = Array.isArray(_.content) ? _.content : [_.content],
                    Y = z.some(($) => $.type === "tool_result"),
                    A = q.messages.length > 1 ? q.messages[q.messages.length - 2] : void 0,
                    O = A ? Array.isArray(A.content) ? A.content : [A.content] : [],
                    w = O.some(($) => $.type === "tool_use");
                if (Y) {
                    if (z.some(($) => $.type !== "tool_result")) throw Error("The last message must contain only tool_result content if any is present");
                    if (!w) throw Error("tool_result blocks are not matching any tool_use from the previous message")
                }
                if (w) {
                    let $ = new Set(O.filter((H) => H.type === "tool_use").map((H) => H.id)),
                        j = new Set(z.filter((H) => H.type === "tool_result").map((H) => H.toolUseId));
                    if ($.size !== j.size || ![...$].every((H) => j.has(H))) throw Error("ids of tool_result blocks and tool_use blocks from previous message do not match")
                }
            }
            if (q.tools) return this.request({
                method: "sampling/createMessage",
                params: q
            }, ug6, K);
            return this.request({
                method: "sampling/createMessage",
                params: q
            }, aY6, K)
        }
        async elicitInput(q, K) {
            switch (q.mode ?? "form") {
                case "url": {
                    if (!this._clientCapabilities?.elicitation?.url) throw Error("Client does not support url elicitation.");
                    let z = q;
                    return this.request({
                        method: "elicitation/create",
                        params: z
                    }, z16, K)
                }
                case "form": {
                    if (!this._clientCapabilities?.elicitation?.form) throw Error("Client does not support form elicitation.");
                    let z = q.mode === "form" ? q : {
                            ...q,
                            mode: "form"
                        },
                        Y = await this.request({
                            method: "elicitation/create",
                            params: z
                        }, z16, K);
                    if (Y.action === "accept" && Y.content && z.requestedSchema) try {
                        let O = this._jsonSchemaValidator.getValidator(z.requestedSchema)(Y.content);
                        if (!O.valid) throw new SK(V5.InvalidParams, `Elicitation response content does not match requested schema: ${O.errorMessage}`)
                    } catch (A) {
                        if (A instanceof SK) throw A;
                        throw new SK(V5.InternalError, `Error validating elicitation response: ${A instanceof Error?A.message:String(A)}`)
                    }
                    return Y
                }
            }
        }
        createElicitationCompletionNotifier(q, K) {
            if (!this._clientCapabilities?.elicitation?.url) throw Error("Client does not support URL elicitation (required for notifications/elicitation/complete)");
            return () => this.notification({
                method: "notifications/elicitation/complete",
                params: {
                    elicitationId: q
                }
            }, K)
        }
        async listRoots(q, K) {
            return this.request({
                method: "roots/list",
                params: q
            }, r31, K)
        }
        async sendLoggingMessage(q, K) {
            if (this._capabilities.logging) {
                if (!this.isMessageIgnored(q.level, K)) return this.notification({
                    method: "notifications/message",
                    params: q
                })
            }
        }
        async sendResourceUpdated(q) {
            return this.notification({
                method: "notifications/resources/updated",
                params: q
            })
        }
        async sendResourceListChanged() {
            return this.notification({
                method: "notifications/resources/list_changed"
            })
        }
        async sendToolListChanged() {
            return this.notification({
                method: "notifications/tools/list_changed"
            })
        }
        async sendPromptListChanged() {
            return this.notification({
                method: "notifications/prompts/list_changed"
            })
        }
    }
})
// @from(Ln 34451, Col 0)
class HS7 {
    clients = new Map;
    tabRoutes = new Map;
    context;
    notificationHandler = null;
    constructor(q) {
        this.context = q
    }
    setNotificationHandler(q) {
        this.notificationHandler = q;
        for (let K of this.clients.values()) K.setNotificationHandler(q)
    }
    async ensureConnected() {
        let {
            logger: q,
            serverName: K
        } = this.context;
        this.refreshClients();
        let _ = [];
        for (let Y of this.clients.values())
            if (!Y.isConnected()) _.push(Y.ensureConnected().catch(() => !1));
        if (_.length > 0) await Promise.all(_);
        let z = this.getConnectedClients().length;
        if (z === 0) return q.info(`[${K}] No connected sockets in pool`), !1;
        return q.info(`[${K}] Socket pool: ${z} connected`), !0
    }
    async callTool(q, K, _) {
        if (q === "tabs_context_mcp") return this.callTabsContext(K);
        let z = K.tabId;
        if (z !== void 0) {
            let A = this.tabRoutes.get(z);
            if (A) {
                let O = this.clients.get(A);
                if (O?.isConnected()) return O.callTool(q, K)
            }
        }
        let Y = this.getConnectedClients();
        if (Y.length === 0) throw new PV(`[${this.context.serverName}] No connected sockets available`);
        return Y[0].callTool(q, K)
    }
    async setPermissionMode(q, K) {
        let _ = this.getConnectedClients();
        await Promise.all(_.map((z) => z.setPermissionMode(q, K)))
    }
    isConnected() {
        return this.getConnectedClients().length > 0
    }
    disconnect() {
        for (let q of this.clients.values()) q.disconnect();
        this.clients.clear(), this.tabRoutes.clear()
    }
    getConnectedClients() {
        return [...this.clients.values()].filter((q) => q.isConnected())
    }
    async callTabsContext(q) {
        let {
            logger: K,
            serverName: _
        } = this.context, z = this.getConnectedClients();
        if (z.length === 0) throw new PV(`[${_}] No connected sockets available`);
        if (z.length === 1) {
            let O = await z[0].callTool("tabs_context_mcp", q);
            return this.updateTabRoutes(O, this.getSocketPathForClient(z[0])), O
        }
        let Y = await Promise.allSettled(z.map(async (O) => {
                let w = await O.callTool("tabs_context_mcp", q),
                    $ = this.getSocketPathForClient(O);
                return {
                    result: w,
                    socketPath: $
                }
            })),
            A = [];
        this.tabRoutes.clear();
        for (let O of Y) {
            if (O.status !== "fulfilled") {
                K.info(`[${_}] tabs_context_mcp failed on one socket: ${O.reason}`);
                continue
            }
            let {
                result: w,
                socketPath: $
            } = O.value;
            this.updateTabRoutes(w, $);
            let j = this.extractTabs(w);
            if (j) A.push(...j)
        }
        if (A.length > 0) {
            let O = A.map((w) => {
                let $ = w;
                return `  • tabId ${$.tabId}: "${$.title}" (${$.url})`
            }).join(`
`);
            return {
                result: {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            availableTabs: A
                        })
                    }, {
                        type: "text",
                        text: `

Tab Context:
- Available tabs:
${O}`
                    }]
                }
            }
        }
        for (let O of Y)
            if (O.status === "fulfilled") return O.value.result;
        throw new PV(`[${_}] All sockets failed for tabs_context_mcp`)
    }
    updateTabRoutes(q, K) {
        let _ = this.extractTabs(q);
        if (!_) return;
        for (let z of _)
            if (typeof z === "object" && z !== null && "tabId" in z) {
                let Y = z.tabId;
                this.tabRoutes.set(Y, K)
            }
    }
    extractTabs(q) {
        if (!q || typeof q !== "object") return null;
        let _ = q.result?.content;
        if (!_ || !Array.isArray(_)) return null;
        for (let z of _)
            if (z.type === "text" && z.text) try {
                let Y = JSON.parse(z.text);
                if (Array.isArray(Y)) return Y;
                if (Y && Array.isArray(Y.availableTabs)) return Y.availableTabs
            } catch {}
        return null
    }
    getSocketPathForClient(q) {
        for (let [K, _] of this.clients.entries())
            if (_ === q) return K;
        return ""
    }
    refreshClients() {
        let q = this.getAvailableSocketPaths(),
            {
                logger: K,
                serverName: _
            } = this.context;
        for (let z of q)
            if (!this.clients.has(z)) {
                K.info(`[${_}] Adding socket to pool: ${z}`);
                let Y = {
                        ...this.context,
                        socketPath: z,
                        getSocketPath: void 0,
                        getSocketPaths: void 0
                    },
                    A = f28(Y);
                if (A.disableAutoReconnect = !0, this.notificationHandler) A.setNotificationHandler(this.notificationHandler);
                this.clients.set(z, A)
            } for (let [z, Y] of this.clients.entries())
            if (!q.includes(z)) {
                K.info(`[${_}] Removing stale socket from pool: ${z}`), Y.disconnect(), this.clients.delete(z);
                for (let [A, O] of this.tabRoutes.entries())
                    if (O === z) this.tabRoutes.delete(A)
            }
    }
    getAvailableSocketPaths() {
        return this.context.getSocketPaths?.() ?? []
    }
}
// @from(Ln 34622, Col 0)
function JS7(q) {
    return new HS7(q)
}
// @from(Ln 34625, Col 4)
XS7 = L(() => {
    GF6()
})
// @from(Ln 34628, Col 0)
async function nu5(q, K, _, z, Y) {
    let A = await K.callTool(_, z, Y);
    if (q.logger.silly(`[${q.serverName}] Received result from socket bridge: ${JSON.stringify(A)}`), A === null || A === void 0) return {
        content: [{
            type: "text",
            text: "Tool execution completed"
        }]
    };
    let {
        result: O,
        error: w
    } = A, $ = w || O, j = !!w;
    if (!$) return {
        content: [{
            type: "text",
            text: "Tool execution completed"
        }]
    };
    if (j && ou5($.content)) q.onAuthenticationError();
    let {
        content: H
    } = $;
    if (H && Array.isArray(H)) {
        if (j) return {
            content: H.map((X) => {
                if (typeof X === "object" && X !== null && "type" in X) return X;
                return {
                    type: "text",
                    text: String(X)
                }
            }),
            isError: !0
        };
        return {
            content: H.map((X) => {
                if (typeof X === "object" && X !== null && "type" in X && "source" in X) {
                    let M = X;
                    if (M.type === "image" && typeof M.source === "object" && M.source !== null && "data" in M.source) return {
                        type: "image",
                        data: M.source.data,
                        mimeType: "media_type" in M.source ? M.source.media_type || "image/png" : "image/png"
                    }
                }
                if (typeof X === "object" && X !== null && "type" in X) return X;
                return {
                    type: "text",
                    text: String(X)
                }
            }),
            isError: j
        }
    }
    if (typeof H === "string") return {
        content: [{
            type: "text",
            text: H
        }],
        isError: j
    };
    return q.logger.warn(`[${q.serverName}] Unexpected result format from socket bridge`, A), {
        content: [{
            type: "text",
            text: JSON.stringify(A)
        }],
        isError: j
    }
}
// @from(Ln 34696, Col 0)
function N_1(q) {
    return {
        content: [{
            type: "text",
            text: q.onToolCallDisconnected()
        }]
    }
}
// @from(Ln 34704, Col 0)
async function iu5(q, K) {
    let _ = ["ask", "skip_all_permission_checks", "follow_a_plan"],
        z = K.mode,
        Y = z && _.includes(z) ? z : "ask";
    if (q.setPermissionMode) await q.setPermissionMode(Y, K.allowed_domains);
    return {
        content: [{
            type: "text",
            text: `Permission mode set to: ${Y}`
        }]
    }
}
// @from(Ln 34716, Col 0)
async function ru5(q, K) {
    if (!q.bridgeConfig) return {
        content: [{
            type: "text",
            text: "Browser switching is only available with bridge connections."
        }],
        isError: !0
    };
    if (!await K.ensureConnected()) return N_1(q);
    let z = await K.switchBrowser?.() ?? null;
    if (z === "no_other_browsers") return {
        content: [{
            type: "text",
            text: "No other browsers available to switch to. Open Chrome with the Claude extension in another browser to switch."
        }],
        isError: !0
    };
    if (z) return {
        content: [{
            type: "text",
            text: `Connected to browser "${z.name}".`
        }]
    };
    return {
        content: [{
            type: "text",
            text: "No browser responded within the timeout. Make sure Chrome is open with the Claude extension installed, then try again."
        }],
        isError: !0
    }
}
// @from(Ln 34748, Col 0)
function ou5(q) {
    return (Array.isArray(q) ? q.map((_) => {
        if (typeof _ === "string") return _;
        if (typeof _ === "object" && _ !== null && "text" in _ && typeof _.text === "string") return _.text;
        return ""
    }).join(" ") : String(q)).toLowerCase().includes("re-authenticated")
}
// @from(Ln 34755, Col 4)
MS7 = async (q, K, _, z, Y) => {
    if (_ === "set_permission_mode") return iu5(K, z);
    if (_ === "switch_browser") return ru5(q, K);
    try {
        let A = await K.ensureConnected();
        if (q.logger.silly(`[${q.serverName}] Server is connected: ${A}. Received tool call: ${_} with args: ${JSON.stringify(z)}.`), A) return await nu5(q, K, _, z, Y);
        return N_1(q)
    } catch (A) {
        if (q.logger.info(`[${q.serverName}] Error calling tool:`, A), A instanceof PV) return N_1(q);
        return {
            content: [{
                type: "text",
                text: `Error calling tool, please try again. : ${A instanceof Error?A.message:String(A)}`
            }],
            isError: !0
        }
    }
}
// @from(Ln 34773, Col 4)
PS7 = L(() => {
    GF6()
})
// @from(Ln 34777, Col 0)
function E_1(q) {
    return q.bridgeConfig ? T28(q) : q.getSocketPaths ? JS7(q) : f28(q)
}
// @from(Ln 34781, Col 0)
function Bj8(q, K) {
    let {
        serverName: _,
        logger: z
    } = q, Y = K ?? E_1(q), A = new zA6({
        name: _,
        version: "1.0.0"
    }, {
        capabilities: {
            tools: {},
            logging: {}
        }
    });
    return A.setRequestHandler(wr, async () => {
        if (q.isDisabled?.()) return {
            tools: []
        };
        return {
            tools: q.bridgeConfig ? ri : ri.filter((O) => O.name !== "switch_browser")
        }
    }), A.setRequestHandler(YU, async (O) => {
        return z.info(`[${_}] Executing tool: ${O.params.name}`), MS7(q, Y, O.params.name, O.params.arguments || {})
    }), Y.setNotificationHandler((O) => {
        z.info(`[${_}] Forwarding MCP notification: ${O.method}`), A.notification({
            method: O.method,
            params: O.params
        }).catch((w) => {
            z.info(`[${_}] Failed to forward MCP notification: ${w.message}`)
        })
    }), A
}
// @from(Ln 34812, Col 4)
WS7 = L(() => {
    mj8();
    _P();
    c71();
    l71();
    GF6();
    XS7();
    PS7()
})
// @from(Ln 34821, Col 4)
DS7 = {}
// @from(Ln 34830, Col 4)
jU6 = L(() => {
    c71();
    l71();
    WS7()
})
// @from(Ln 34835, Col 0)
class HU6 {
    append(q) {
        this._buffer = this._buffer ? Buffer.concat([this._buffer, q]) : q
    }
    readMessage() {
        if (!this._buffer) return null;
        let q = this._buffer.indexOf(`
`);
        if (q === -1) return null;
        let K = this._buffer.toString("utf8", 0, q).replace(/\r$/, "");
        return this._buffer = this._buffer.subarray(q + 1), au5(K)
    }
    clear() {
        this._buffer = void 0
    }
}
// @from(Ln 34852, Col 0)
function au5(q) {
    return Pm.parse(JSON.parse(q))
}
// @from(Ln 34856, Col 0)
function pj8(q) {
    return JSON.stringify(q) + `
`
}
// @from(Ln 34860, Col 4)
y_1 = L(() => {
    _P()
})
// @from(Ln 34864, Col 0)
class YA6 {
    constructor(q = ZS7.stdin, K = ZS7.stdout) {
        this._stdin = q, this._stdout = K, this._readBuffer = new HU6, this._started = !1, this._ondata = (_) => {
            this._readBuffer.append(_), this.processReadBuffer()
        }, this._onerror = (_) => {
            this.onerror?.(_)
        }
    }
    async start() {
        if (this._started) throw Error("StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.");
        this._started = !0, this._stdin.on("data", this._ondata), this._stdin.on("error", this._onerror)
    }
    processReadBuffer() {
        while (!0) try {
            let q = this._readBuffer.readMessage();
            if (q === null) break;
            this.onmessage?.(q)
        } catch (q) {
            this.onerror?.(q)
        }
    }
    async close() {
        if (this._stdin.off("data", this._ondata), this._stdin.off("error", this._onerror), this._stdin.listenerCount("data") === 0) this._stdin.pause();
        this._readBuffer.clear(), this.onclose?.()
    }
    send(q) {
        return new Promise((K) => {
            let _ = pj8(q);
            if (this._stdout.write(_)) K();
            else this._stdout.once("drain", K)
        })
    }
}
// @from(Ln 34897, Col 4)
Fj8 = L(() => {
    y_1()
})
// @from(Ln 34901, Col 0)
function JU6(q, K) {
    return function() {
        return q.apply(K, arguments)
    }
}
// @from(Ln 34907, Col 0)
function XU6(q) {
    return q !== null && !sZ6(q) && q.constructor !== null && !sZ6(q.constructor) && cN(q.constructor.isBuffer) && q.constructor.isBuffer(q)
}
// @from(Ln 34911, Col 0)
function tu5(q) {
    let K;
    if (typeof ArrayBuffer < "u" && ArrayBuffer.isView) K = ArrayBuffer.isView(q);
    else K = q && q.buffer && VS7(q.buffer);
    return K
}
// @from(Ln 34918, Col 0)
function jm5() {
    if (typeof globalThis < "u") return globalThis;
    if (typeof self < "u") return self;
    if (typeof window < "u") return window;
    if (typeof global < "u") return global;
    return {}
}
// @from(Ln 34926, Col 0)
function PU6(q, K, {
    allOwnKeys: _ = !1
} = {}) {
    if (q === null || typeof q > "u") return;
    let z, Y;
    if (typeof q !== "object") q = [q];
    if (tZ6(q))
        for (z = 0, Y = q.length; z < Y; z++) K.call(null, q[z], z, q);
    else {
        if (XU6(q)) return;
        let A = _ ? Object.getOwnPropertyNames(q) : Object.keys(q),
            O = A.length,
            w;
        for (z = 0; z < O; z++) w = A[z], K.call(null, q[w], w, q)
    }
}
// @from(Ln 34943, Col 0)
function NS7(q, K) {
    if (XU6(q)) return null;
    K = K.toLowerCase();
    let _ = Object.keys(q),
        z = _.length,
        Y;
    while (z-- > 0)
        if (Y = _[z], K === Y.toLowerCase()) return Y;
    return null
}
// @from(Ln 34954, Col 0)
function L_1() {
    let {
        caseless: q,
        skipUndefined: K
    } = ES7(this) && this || {}, _ = {}, z = (Y, A) => {
        if (A === "__proto__" || A === "constructor" || A === "prototype") return;
        let O = q && NS7(_, A) || A;
        if (gj8(_[O]) && gj8(Y)) _[O] = L_1(_[O], Y);
        else if (gj8(Y)) _[O] = L_1({}, Y);
        else if (tZ6(Y)) _[O] = Y.slice();
        else if (!K || !sZ6(Y)) _[O] = Y
    };
    for (let Y = 0, A = arguments.length; Y < A; Y++) arguments[Y] && PU6(arguments[Y], z);
    return _
}
// @from(Ln 34970, Col 0)
function Im5(q) {
    return !!(q && cN(q.append) && q[TS7] === "FormData" && q[Uj8])
}
// @from(Ln 34973, Col 4)
su5
// @from(Ln 34973, Col 9)
h_1
// @from(Ln 34973, Col 14)
Uj8
// @from(Ln 34973, Col 19)
TS7
// @from(Ln 34973, Col 24)
Qj8
// @from(Ln 34973, Col 29)
Tm = (q) => {
        return q = q.toLowerCase(), (K) => Qj8(K) === q
    }
// @from(Ln 34976, Col 4)
dj8 = (q) => (K) => typeof K === q
// @from(Ln 34977, Col 4)
tZ6
// @from(Ln 34977, Col 9)
sZ6
// @from(Ln 34977, Col 14)
VS7
// @from(Ln 34977, Col 19)
eu5
// @from(Ln 34977, Col 24)
cN
// @from(Ln 34977, Col 28)
kS7
// @from(Ln 34977, Col 33)
MU6 = (q) => q !== null && typeof q === "object"
// @from(Ln 34978, Col 4)
qm5 = (q) => q === !0 || q === !1
// @from(Ln 34979, Col 4)
gj8 = (q) => {
        if (Qj8(q) !== "object") return !1;
        let K = h_1(q);
        return (K === null || K === Object.prototype || Object.getPrototypeOf(K) === null) && !(TS7 in q) && !(Uj8 in q)
    }
// @from(Ln 34984, Col 4)
Km5 = (q) => {
        if (!MU6(q) || XU6(q)) return !1;
        try {
            return Object.keys(q).length === 0 && Object.getPrototypeOf(q) === Object.prototype
        } catch (K) {
            return !1
        }
    }
// @from(Ln 34992, Col 4)
_m5
// @from(Ln 34992, Col 9)
zm5
// @from(Ln 34992, Col 14)
Ym5 = (q) => {
        return !!(q && typeof q.uri < "u")
    }
// @from(Ln 34995, Col 4)
Am5 = (q) => q && typeof q.getParts < "u"
// @from(Ln 34996, Col 4)
Om5
// @from(Ln 34996, Col 9)
wm5
// @from(Ln 34996, Col 14)
$m5 = (q) => MU6(q) && cN(q.pipe)
// @from(Ln 34997, Col 4)
fS7
// @from(Ln 34997, Col 9)
GS7
// @from(Ln 34997, Col 14)
Hm5 = (q) => {
        let K;
        return q && (GS7 && q instanceof GS7 || cN(q.append) && ((K = Qj8(q)) === "formdata" || K === "object" && cN(q.toString) && q.toString() === "[object FormData]"))
    }
// @from(Ln 35001, Col 4)
Jm5
// @from(Ln 35001, Col 9)
Xm5
// @from(Ln 35001, Col 14)
Mm5
// @from(Ln 35001, Col 19)
Pm5
// @from(Ln 35001, Col 24)
Wm5
// @from(Ln 35001, Col 29)
Dm5 = (q) => {
        return q.trim ? q.trim() : q.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
    }
// @from(Ln 35004, Col 4)
AA6
// @from(Ln 35004, Col 9)
ES7 = (q) => !sZ6(q) && q !== AA6
// @from(Ln 35005, Col 4)
Zm5 = (q, K, _, {
        allOwnKeys: z
    } = {}) => {
        return PU6(K, (Y, A) => {
            if (_ && cN(Y)) Object.defineProperty(q, A, {
                value: JU6(Y, _),
                writable: !0,
                enumerable: !0,
                configurable: !0
            });
            else Object.defineProperty(q, A, {
                value: Y,
                writable: !0,
                enumerable: !0,
                configurable: !0
            })
        }, {
            allOwnKeys: z
        }), q
    }
// @from(Ln 35025, Col 4)
fm5 = (q) => {
        if (q.charCodeAt(0) === 65279) q = q.slice(1);
        return q
    }
// @from(Ln 35029, Col 4)
Gm5 = (q, K, _, z) => {
        q.prototype = Object.create(K.prototype, z), Object.defineProperty(q.prototype, "constructor", {
            value: q,
            writable: !0,
            enumerable: !1,
            configurable: !0
        }), Object.defineProperty(q, "super", {
            value: K.prototype
        }), _ && Object.assign(q.prototype, _)
    }
// @from(Ln 35039, Col 4)
vm5 = (q, K, _, z) => {
        let Y, A, O, w = {};
        if (K = K || {}, q == null) return K;
        do {
            Y = Object.getOwnPropertyNames(q), A = Y.length;
            while (A-- > 0)
                if (O = Y[A], (!z || z(O, q, K)) && !w[O]) K[O] = q[O], w[O] = !0;
            q = _ !== !1 && h_1(q)
        } while (q && (!_ || _(q, K)) && q !== Object.prototype);
        return K
    }
// @from(Ln 35050, Col 4)
Tm5 = (q, K, _) => {
        if (q = String(q), _ === void 0 || _ > q.length) _ = q.length;
        _ -= K.length;
        let z = q.indexOf(K, _);
        return z !== -1 && z === _
    }
// @from(Ln 35056, Col 4)
Vm5 = (q) => {
        if (!q) return null;
        if (tZ6(q)) return q;
        let K = q.length;
        if (!kS7(K)) return null;
        let _ = Array(K);
        while (K-- > 0) _[K] = q[K];
        return _
    }
// @from(Ln 35065, Col 4)
km5
// @from(Ln 35065, Col 9)
Nm5 = (q, K) => {
        let z = (q && q[Uj8]).call(q),
            Y;
        while ((Y = z.next()) && !Y.done) {
            let A = Y.value;
            K.call(q, A[0], A[1])
        }
    }
// @from(Ln 35073, Col 4)
Em5 = (q, K) => {
        let _, z = [];
        while ((_ = q.exec(K)) !== null) z.push(_);
        return z
    }
// @from(Ln 35078, Col 4)
ym5
// @from(Ln 35078, Col 9)
Lm5 = (q) => {
        return q.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(_, z, Y) {
            return z.toUpperCase() + Y
        })
    }
// @from(Ln 35083, Col 4)
vS7
// @from(Ln 35083, Col 9)
hm5
// @from(Ln 35083, Col 14)
yS7 = (q, K) => {
        let _ = Object.getOwnPropertyDescriptors(q),
            z = {};
        PU6(_, (Y, A) => {
            let O;
            if ((O = K(Y, A, q)) !== !1) z[A] = O || Y
        }), Object.defineProperties(q, z)
    }
// @from(Ln 35091, Col 4)
Rm5 = (q) => {
        yS7(q, (K, _) => {
            if (cN(q) && ["arguments", "caller", "callee"].indexOf(_) !== -1) return !1;
            let z = q[_];
            if (!cN(z)) return;
            if (K.enumerable = !1, "writable" in K) {
                K.writable = !1;
                return
            }
            if (!K.set) K.set = () => {
                throw Error("Can not rewrite read-only method '" + _ + "'")
            }
        })
    }
// @from(Ln 35105, Col 4)
Sm5 = (q, K) => {
        let _ = {},
            z = (Y) => {
                Y.forEach((A) => {
                    _[A] = !0
                })
            };
        return tZ6(q) ? z(q) : z(String(q).split(K)), _
    }
// @from(Ln 35114, Col 4)
Cm5 = () => {}
// @from(Ln 35115, Col 4)
bm5 = (q, K) => {
        return q != null && Number.isFinite(q = +q) ? q : K
    }
// @from(Ln 35118, Col 4)
xm5 = (q) => {
        let K = [, , , , , , , , , , ],
            _ = (z, Y) => {
                if (MU6(z)) {
                    if (K.indexOf(z) >= 0) return;
                    if (XU6(z)) return z;
                    if (!("toJSON" in z)) {
                        K[Y] = z;
                        let A = tZ6(z) ? [] : {};
                        return PU6(z, (O, w) => {
                            let $ = _(O, Y + 1);
                            !sZ6($) && (A[w] = $)
                        }), K[Y] = void 0, A
                    }
                }
                return z
            };
        return _(q, 0)
    }
// @from(Ln 35137, Col 4)
um5
// @from(Ln 35137, Col 9)
mm5 = (q) => q && (MU6(q) || cN(q)) && cN(q.then) && cN(q.catch)
// @from(Ln 35138, Col 4)
LS7
// @from(Ln 35138, Col 9)
Bm5
// @from(Ln 35138, Col 14)
pm5 = (q) => q != null && cN(q[Uj8])
// @from(Ln 35139, Col 4)
H1
// @from(Ln 35140, Col 4)
Z$ = L(() => {
    ({
        toString: su5
    } = Object.prototype), {
        getPrototypeOf: h_1
    } = Object, {
        iterator: Uj8,
        toStringTag: TS7
    } = Symbol, Qj8 = ((q) => (K) => {
        let _ = su5.call(K);
        return q[_] || (q[_] = _.slice(8, -1).toLowerCase())
    })(Object.create(null)), {
        isArray: tZ6
    } = Array, sZ6 = dj8("undefined");
    VS7 = Tm("ArrayBuffer");
    eu5 = dj8("string"), cN = dj8("function"), kS7 = dj8("number"), _m5 = Tm("Date"), zm5 = Tm("File"), Om5 = Tm("Blob"), wm5 = Tm("FileList");
    fS7 = jm5(), GS7 = typeof fS7.FormData < "u" ? fS7.FormData : void 0, Jm5 = Tm("URLSearchParams"), [Xm5, Mm5, Pm5, Wm5] = ["ReadableStream", "Request", "Response", "Headers"].map(Tm);
    AA6 = (() => {
        if (typeof globalThis < "u") return globalThis;
        return typeof self < "u" ? self : typeof window < "u" ? window : global
    })();
    km5 = ((q) => {
        return (K) => {
            return q && K instanceof q
        }
    })(typeof Uint8Array < "u" && h_1(Uint8Array)), ym5 = Tm("HTMLFormElement"), vS7 = (({
        hasOwnProperty: q
    }) => (K, _) => q.call(K, _))(Object.prototype), hm5 = Tm("RegExp");
    um5 = Tm("AsyncFunction"), LS7 = ((q, K) => {
        if (q) return setImmediate;
        return K ? ((_, z) => {
            return AA6.addEventListener("message", ({
                source: Y,
                data: A
            }) => {
                if (Y === AA6 && A === _) z.length && z.shift()()
            }, !1), (Y) => {
                z.push(Y), AA6.postMessage(_, "*")
            }
        })(`axios@${Math.random()}`, []) : (_) => setTimeout(_)
    })(typeof setImmediate === "function", cN(AA6.postMessage)), Bm5 = typeof queueMicrotask < "u" ? queueMicrotask.bind(AA6) : typeof process < "u" && process.nextTick || LS7, H1 = {
        isArray: tZ6,
        isArrayBuffer: VS7,
        isBuffer: XU6,
        isFormData: Hm5,
        isArrayBufferView: tu5,
        isString: eu5,
        isNumber: kS7,
        isBoolean: qm5,
        isObject: MU6,
        isPlainObject: gj8,
        isEmptyObject: Km5,
        isReadableStream: Xm5,
        isRequest: Mm5,
        isResponse: Pm5,
        isHeaders: Wm5,
        isUndefined: sZ6,
        isDate: _m5,
        isFile: zm5,
        isReactNativeBlob: Ym5,
        isReactNative: Am5,
        isBlob: Om5,
        isRegExp: hm5,
        isFunction: cN,
        isStream: $m5,
        isURLSearchParams: Jm5,
        isTypedArray: km5,
        isFileList: wm5,
        forEach: PU6,
        merge: L_1,
        extend: Zm5,
        trim: Dm5,
        stripBOM: fm5,
        inherits: Gm5,
        toFlatObject: vm5,
        kindOf: Qj8,
        kindOfTest: Tm,
        endsWith: Tm5,
        toArray: Vm5,
        forEachEntry: Nm5,
        matchAll: Em5,
        isHTMLForm: ym5,
        hasOwnProperty: vS7,
        hasOwnProp: vS7,
        reduceDescriptors: yS7,
        freezeMethods: Rm5,
        toObjectSet: Sm5,
        toCamelCase: Lm5,
        noop: Cm5,
        toFiniteNumber: bm5,
        findKey: NS7,
        global: AA6,
        isContextDefined: ES7,
        isSpecCompliantForm: Im5,
        toJSONObject: xm5,
        isAsyncFn: um5,
        isThenable: mm5,
        setImmediate: LS7,
        asap: Bm5,
        isIterable: pm5
    }
})
// @from(Ln 35242, Col 4)
vV
// @from(Ln 35242, Col 8)
v4
// @from(Ln 35243, Col 4)
jh = L(() => {
    Z$();
    vV = class vV extends Error {
        static from(q, K, _, z, Y, A) {
            let O = new vV(q.message, K || q.code, _, z, Y);
            if (O.cause = q, O.name = q.name, q.status != null && O.status == null) O.status = q.status;
            return A && Object.assign(O, A), O
        }
        constructor(q, K, _, z, Y) {
            super(q);
            if (Object.defineProperty(this, "message", {
                    value: q,
                    enumerable: !0,
                    writable: !0,
                    configurable: !0
                }), this.name = "AxiosError", this.isAxiosError = !0, K && (this.code = K), _ && (this.config = _), z && (this.request = z), Y) this.response = Y, this.status = Y.status
        }
        toJSON() {
            return {
                message: this.message,
                name: this.name,
                description: this.description,
                number: this.number,
                fileName: this.fileName,
                lineNumber: this.lineNumber,
                columnNumber: this.columnNumber,
                stack: this.stack,
                config: H1.toJSONObject(this.config),
                code: this.code,
                status: this.status
            }
        }
    };
    vV.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
    vV.ERR_BAD_OPTION = "ERR_BAD_OPTION";
    vV.ECONNABORTED = "ECONNABORTED";
    vV.ETIMEDOUT = "ETIMEDOUT";
    vV.ERR_NETWORK = "ERR_NETWORK";
    vV.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
    vV.ERR_DEPRECATED = "ERR_DEPRECATED";
    vV.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
    vV.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
    vV.ERR_CANCELED = "ERR_CANCELED";
    vV.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
    vV.ERR_INVALID_URL = "ERR_INVALID_URL";
    v4 = vV
})
// @from(Ln 35290, Col 4)
SS7 = p((FuA, RS7) => {
    var hS7 = d6("stream").Stream,
        Fm5 = d6("util");
    RS7.exports = Vm;

    function Vm() {
        this.source = null, this.dataSize = 0, this.maxDataSize = 1048576, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = []
    }
    Fm5.inherits(Vm, hS7);
    Vm.create = function(q, K) {
        var _ = new this;
        K = K || {};
        for (var z in K) _[z] = K[z];
        _.source = q;
        var Y = q.emit;
        if (q.emit = function() {
                return _._handleEmit(arguments), Y.apply(q, arguments)
            }, q.on("error", function() {}), _.pauseStream) q.pause();
        return _
    };
    Object.defineProperty(Vm.prototype, "readable", {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.source.readable
        }
    });
    Vm.prototype.setEncoding = function() {
        return this.source.setEncoding.apply(this.source, arguments)
    };
    Vm.prototype.resume = function() {
        if (!this._released) this.release();
        this.source.resume()
    };
    Vm.prototype.pause = function() {
        this.source.pause()
    };
    Vm.prototype.release = function() {
        this._released = !0, this._bufferedEvents.forEach(function(q) {
            this.emit.apply(this, q)
        }.bind(this)), this._bufferedEvents = []
    };
    Vm.prototype.pipe = function() {
        var q = hS7.prototype.pipe.apply(this, arguments);
        return this.resume(), q
    };
    Vm.prototype._handleEmit = function(q) {
        if (this._released) {
            this.emit.apply(this, q);
            return
        }
        if (q[0] === "data") this.dataSize += q[1].length, this._checkIfMaxDataSizeExceeded();
        this._bufferedEvents.push(q)
    };
    Vm.prototype._checkIfMaxDataSizeExceeded = function() {
        if (this._maxDataSizeExceeded) return;
        if (this.dataSize <= this.maxDataSize) return;
        this._maxDataSizeExceeded = !0;
        var q = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
        this.emit("error", Error(q))
    }
})
// @from(Ln 35352, Col 4)
xS7 = p((guA, IS7) => {
    var gm5 = d6("util"),
        bS7 = d6("stream").Stream,
        CS7 = SS7();
    IS7.exports = tJ;

    function tJ() {
        this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2097152, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1
    }
    gm5.inherits(tJ, bS7);
    tJ.create = function(q) {
        var K = new this;
        q = q || {};
        for (var _ in q) K[_] = q[_];
        return K
    };
    tJ.isStreamLike = function(q) {
        return typeof q !== "function" && typeof q !== "string" && typeof q !== "boolean" && typeof q !== "number" && !Buffer.isBuffer(q)
    };
    tJ.prototype.append = function(q) {
        var K = tJ.isStreamLike(q);
        if (K) {
            if (!(q instanceof CS7)) {
                var _ = CS7.create(q, {
                    maxDataSize: 1 / 0,
                    pauseStream: this.pauseStreams
                });
                q.on("data", this._checkDataSize.bind(this)), q = _
            }
            if (this._handleErrors(q), this.pauseStreams) q.pause()
        }
        return this._streams.push(q), this
    };
    tJ.prototype.pipe = function(q, K) {
        return bS7.prototype.pipe.call(this, q, K), this.resume(), q
    };
    tJ.prototype._getNext = function() {
        if (this._currentStream = null, this._insideLoop) {
            this._pendingNext = !0;
            return
        }
        this._insideLoop = !0;
        try {
            do this._pendingNext = !1, this._realGetNext(); while (this._pendingNext)
        } finally {
            this._insideLoop = !1
        }
    };
    tJ.prototype._realGetNext = function() {
        var q = this._streams.shift();
        if (typeof q > "u") {
            this.end();
            return
        }
        if (typeof q !== "function") {
            this._pipeNext(q);
            return
        }
        var K = q;
        K(function(_) {
            var z = tJ.isStreamLike(_);
            if (z) _.on("data", this._checkDataSize.bind(this)), this._handleErrors(_);
            this._pipeNext(_)
        }.bind(this))
    };
    tJ.prototype._pipeNext = function(q) {
        this._currentStream = q;
        var K = tJ.isStreamLike(q);
        if (K) {
            q.on("end", this._getNext.bind(this)), q.pipe(this, {
                end: !1
            });
            return
        }
        var _ = q;
        this.write(_), this._getNext()
    };
    tJ.prototype._handleErrors = function(q) {
        var K = this;
        q.on("error", function(_) {
            K._emitError(_)
        })
    };
    tJ.prototype.write = function(q) {
        this.emit("data", q)
    };
    tJ.prototype.pause = function() {
        if (!this.pauseStreams) return;
        if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
        this.emit("pause")
    };
    tJ.prototype.resume = function() {
        if (!this._released) this._released = !0, this.writable = !0, this._getNext();
        if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
        this.emit("resume")
    };
    tJ.prototype.end = function() {
        this._reset(), this.emit("end")
    };
    tJ.prototype.destroy = function() {
        this._reset(), this.emit("close")
    };
    tJ.prototype._reset = function() {
        this.writable = !1, this._streams = [], this._currentStream = null
    };
    tJ.prototype._checkDataSize = function() {
        if (this._updateDataSize(), this.dataSize <= this.maxDataSize) return;
        var q = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
        this._emitError(Error(q))
    };
    tJ.prototype._updateDataSize = function() {
        this.dataSize = 0;
        var q = this;
        if (this._streams.forEach(function(K) {
                if (!K.dataSize) return;
                q.dataSize += K.dataSize
            }), this._currentStream && this._currentStream.dataSize) this.dataSize += this._currentStream.dataSize
    };
    tJ.prototype._emitError = function(q) {
        this._reset(), this.emit("error", q)
    }
})
// @from(Ln 35474, Col 4)
mS7 = p((UuA, uS7) => {
    var WU6 = (q) => () => {
        throw Error("mime-types." + q + "() is stubbed in this build. Do not rely on axios auto-multipart serialization (plain object + Content-Type: multipart/form-data). Use native FormData or hand-roll the multipart body instead. See scripts/build-with-plugins.ts stubMimeTypes plugin.")
    };
    uS7.exports = {
        lookup: WU6("lookup"),
        contentType: WU6("contentType"),
        extension: WU6("extension"),
        charset: WU6("charset"),
        extensions: Object.create(null),
        types: Object.create(null),
        charsets: {
            lookup: WU6("charsets.lookup")
        }
    }
})
// @from(Ln 35490, Col 4)
pS7 = p((QuA, BS7) => {
    BS7.exports = Um5;

    function Um5(q) {
        var K = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
        if (K) K(q);
        else setTimeout(q, 0)
    }
})
// @from(Ln 35499, Col 4)
R_1 = p((duA, gS7) => {
    var FS7 = pS7();
    gS7.exports = Qm5;

    function Qm5(q) {
        var K = !1;
        return FS7(function() {
                K = !0
            }),
            function(z, Y) {
                if (K) q(z, Y);
                else FS7(function() {
                    q(z, Y)
                })
            }
    }
})
// @from(Ln 35516, Col 4)
S_1 = p((cuA, US7) => {
    US7.exports = dm5;

    function dm5(q) {
        Object.keys(q.jobs).forEach(cm5.bind(q)), q.jobs = {}
    }

    function cm5(q) {
        if (typeof this.jobs[q] == "function") this.jobs[q]()
    }
})
// @from(Ln 35527, Col 4)
C_1 = p((luA, dS7) => {
    var QS7 = R_1(),
        lm5 = S_1();
    dS7.exports = nm5;

    function nm5(q, K, _, z) {
        var Y = _.keyedList ? _.keyedList[_.index] : _.index;
        _.jobs[Y] = im5(K, Y, q[Y], function(A, O) {
            if (!(Y in _.jobs)) return;
            if (delete _.jobs[Y], A) lm5(_);
            else _.results[Y] = O;
            z(A, _.results)
        })
    }

    function im5(q, K, _, z) {
        var Y;
        if (q.length == 2) Y = q(_, QS7(z));
        else Y = q(_, K, QS7(z));
        return Y
    }
})
// @from(Ln 35549, Col 4)
b_1 = p((nuA, cS7) => {
    cS7.exports = rm5;

    function rm5(q, K) {
        var _ = !Array.isArray(q),
            z = {
                index: 0,
                keyedList: _ || K ? Object.keys(q) : null,
                jobs: {},
                results: _ ? {} : [],
                size: _ ? Object.keys(q).length : q.length
            };
        if (K) z.keyedList.sort(_ ? K : function(Y, A) {
            return K(q[Y], q[A])
        });
        return z
    }
})
// @from(Ln 35567, Col 4)
I_1 = p((iuA, lS7) => {
    var om5 = S_1(),
        am5 = R_1();
    lS7.exports = sm5;

    function sm5(q) {
        if (!Object.keys(this.jobs).length) return;
        this.index = this.size, om5(this), am5(q)(null, this.results)
    }
})
// @from(Ln 35577, Col 4)
iS7 = p((ruA, nS7) => {
    var tm5 = C_1(),
        em5 = b_1(),
        qB5 = I_1();
    nS7.exports = KB5;

    function KB5(q, K, _) {
        var z = em5(q);
        while (z.index < (z.keyedList || q).length) tm5(q, K, z, function(Y, A) {
            if (Y) {
                _(Y, A);
                return
            }
            if (Object.keys(z.jobs).length === 0) {
                _(null, z.results);
                return
            }
        }), z.index++;
        return qB5.bind(z, _)
    }
})
// @from(Ln 35598, Col 4)
x_1 = p((ouA, cj8) => {
    var rS7 = C_1(),
        _B5 = b_1(),
        zB5 = I_1();
    cj8.exports = YB5;
    cj8.exports.ascending = oS7;
    cj8.exports.descending = AB5;

    function YB5(q, K, _, z) {
        var Y = _B5(q, _);
        return rS7(q, K, Y, function A(O, w) {
            if (O) {
                z(O, w);
                return
            }
            if (Y.index++, Y.index < (Y.keyedList || q).length) {
                rS7(q, K, Y, A);
                return
            }
            z(null, Y.results)
        }), zB5.bind(Y, z)
    }

    function oS7(q, K) {
        return q < K ? -1 : q > K ? 1 : 0
    }

    function AB5(q, K) {
        return -1 * oS7(q, K)
    }
})
// @from(Ln 35629, Col 4)
sS7 = p((auA, aS7) => {
    var OB5 = x_1();
    aS7.exports = wB5;

    function wB5(q, K, _) {
        return OB5(q, K, null, _)
    }
})
// @from(Ln 35637, Col 4)
eS7 = p((suA, tS7) => {
    tS7.exports = {
        parallel: iS7(),
        serial: sS7(),
        serialOrdered: x_1()
    }
})
// @from(Ln 35644, Col 4)
u_1 = p((tuA, qC7) => {
    qC7.exports = Object
})
// @from(Ln 35647, Col 4)
_C7 = p((euA, KC7) => {
    KC7.exports = Error
})
// @from(Ln 35650, Col 4)
YC7 = p((qmA, zC7) => {
    zC7.exports = EvalError
})
// @from(Ln 35653, Col 4)
OC7 = p((KmA, AC7) => {
    AC7.exports = RangeError
})
// @from(Ln 35656, Col 4)
$C7 = p((_mA, wC7) => {
    wC7.exports = ReferenceError
})
// @from(Ln 35659, Col 4)
HC7 = p((zmA, jC7) => {
    jC7.exports = SyntaxError
})
// @from(Ln 35662, Col 4)
lj8 = p((YmA, JC7) => {
    JC7.exports = TypeError
})
// @from(Ln 35665, Col 4)
MC7 = p((AmA, XC7) => {
    XC7.exports = URIError
})
// @from(Ln 35668, Col 4)
WC7 = p((OmA, PC7) => {
    PC7.exports = Math.abs
})
// @from(Ln 35671, Col 4)
ZC7 = p((wmA, DC7) => {
    DC7.exports = Math.floor
})
// @from(Ln 35674, Col 4)
GC7 = p(($mA, fC7) => {
    fC7.exports = Math.max
})
// @from(Ln 35677, Col 4)
TC7 = p((jmA, vC7) => {
    vC7.exports = Math.min
})
// @from(Ln 35680, Col 4)
kC7 = p((HmA, VC7) => {
    VC7.exports = Math.pow
})
// @from(Ln 35683, Col 4)
EC7 = p((JmA, NC7) => {
    NC7.exports = Math.round
})
// @from(Ln 35686, Col 4)
LC7 = p((XmA, yC7) => {
    yC7.exports = Number.isNaN || function(K) {
        return K !== K
    }
})
// @from(Ln 35691, Col 4)
RC7 = p((MmA, hC7) => {
    var $B5 = LC7();
    hC7.exports = function(K) {
        if ($B5(K) || K === 0) return K;
        return K < 0 ? -1 : 1
    }
})
// @from(Ln 35698, Col 4)
CC7 = p((PmA, SC7) => {
    SC7.exports = Object.getOwnPropertyDescriptor
})
// @from(Ln 35701, Col 4)
m_1 = p((WmA, bC7) => {
    var nj8 = CC7();
    if (nj8) try {
        nj8([], "length")
    } catch (q) {
        nj8 = null
    }
    bC7.exports = nj8
})
// @from(Ln 35710, Col 4)
xC7 = p((DmA, IC7) => {
    var ij8 = Object.defineProperty || !1;
    if (ij8) try {
        ij8({}, "a", {
            value: 1
        })
    } catch (q) {
        ij8 = !1
    }
    IC7.exports = ij8
})
// @from(Ln 35721, Col 4)
B_1 = p((ZmA, uC7) => {
    uC7.exports = function() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") return !1;
        if (typeof Symbol.iterator === "symbol") return !0;
        var K = {},
            _ = Symbol("test"),
            z = Object(_);
        if (typeof _ === "string") return !1;
        if (Object.prototype.toString.call(_) !== "[object Symbol]") return !1;
        if (Object.prototype.toString.call(z) !== "[object Symbol]") return !1;
        var Y = 42;
        K[_] = Y;
        for (var A in K) return !1;
        if (typeof Object.keys === "function" && Object.keys(K).length !== 0) return !1;
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(K).length !== 0) return !1;
        var O = Object.getOwnPropertySymbols(K);
        if (O.length !== 1 || O[0] !== _) return !1;
        if (!Object.prototype.propertyIsEnumerable.call(K, _)) return !1;
        if (typeof Object.getOwnPropertyDescriptor === "function") {
            var w = Object.getOwnPropertyDescriptor(K, _);
            if (w.value !== Y || w.enumerable !== !0) return !1
        }
        return !0
    }
})
// @from(Ln 35746, Col 4)
pC7 = p((fmA, BC7) => {
    var mC7 = typeof Symbol < "u" && Symbol,
        jB5 = B_1();
    BC7.exports = function() {
        if (typeof mC7 !== "function") return !1;
        if (typeof Symbol !== "function") return !1;
        if (typeof mC7("foo") !== "symbol") return !1;
        if (typeof Symbol("bar") !== "symbol") return !1;
        return jB5()
    }
})
// @from(Ln 35757, Col 4)
p_1 = p((GmA, FC7) => {
    FC7.exports = typeof Reflect < "u" && Reflect.getPrototypeOf || null
})
// @from(Ln 35760, Col 4)
F_1 = p((vmA, gC7) => {
    var HB5 = u_1();
    gC7.exports = HB5.getPrototypeOf || null
})
// @from(Ln 35764, Col 4)
dC7 = p((TmA, QC7) => {
    var JB5 = "Function.prototype.bind called on incompatible ",
        XB5 = Object.prototype.toString,
        MB5 = Math.max,
        PB5 = "[object Function]",
        UC7 = function(K, _) {
            var z = [];
            for (var Y = 0; Y < K.length; Y += 1) z[Y] = K[Y];
            for (var A = 0; A < _.length; A += 1) z[A + K.length] = _[A];
            return z
        },
        WB5 = function(K, _) {
            var z = [];
            for (var Y = _ || 0, A = 0; Y < K.length; Y += 1, A += 1) z[A] = K[Y];
            return z
        },
        DB5 = function(q, K) {
            var _ = "";
            for (var z = 0; z < q.length; z += 1)
                if (_ += q[z], z + 1 < q.length) _ += K;
            return _
        };
    QC7.exports = function(K) {
        var _ = this;
        if (typeof _ !== "function" || XB5.apply(_) !== PB5) throw TypeError(JB5 + _);
        var z = WB5(arguments, 1),
            Y, A = function() {
                if (this instanceof Y) {
                    var H = _.apply(this, UC7(z, arguments));
                    if (Object(H) === H) return H;
                    return this
                }
                return _.apply(K, UC7(z, arguments))
            },
            O = MB5(0, _.length - z.length),
            w = [];
        for (var $ = 0; $ < O; $++) w[$] = "$" + $;
        if (Y = Function("binder", "return function (" + DB5(w, ",") + "){ return binder.apply(this,arguments); }")(A), _.prototype) {
            var j = function() {};
            j.prototype = _.prototype, Y.prototype = new j, j.prototype = null
        }
        return Y
    }
})
// @from(Ln 35808, Col 4)
DU6 = p((VmA, cC7) => {
    var ZB5 = dC7();
    cC7.exports = Function.prototype.bind || ZB5
})
// @from(Ln 35812, Col 4)
rj8 = p((kmA, lC7) => {
    lC7.exports = Function.prototype.call
})
// @from(Ln 35815, Col 4)
g_1 = p((NmA, nC7) => {
    nC7.exports = Function.prototype.apply
})
// @from(Ln 35818, Col 4)
rC7 = p((EmA, iC7) => {
    iC7.exports = typeof Reflect < "u" && Reflect && Reflect.apply
})
// @from(Ln 35821, Col 4)
aC7 = p((ymA, oC7) => {
    var fB5 = DU6(),
        GB5 = g_1(),
        vB5 = rj8(),
        TB5 = rC7();
    oC7.exports = TB5 || fB5.call(vB5, GB5)
})
// @from(Ln 35828, Col 4)
tC7 = p((LmA, sC7) => {
    var VB5 = DU6(),
        kB5 = lj8(),
        NB5 = rj8(),
        EB5 = aC7();
    sC7.exports = function(K) {
        if (K.length < 1 || typeof K[0] !== "function") throw new kB5("a function is required");
        return EB5(VB5, NB5, K)
    }
})
// @from(Ln 35838, Col 4)
Yb7 = p((hmA, zb7) => {
    var yB5 = tC7(),
        eC7 = m_1(),
        Kb7;
    try {
        Kb7 = [].__proto__ === Array.prototype
    } catch (q) {
        if (!q || typeof q !== "object" || !("code" in q) || q.code !== "ERR_PROTO_ACCESS") throw q
    }
    var U_1 = !!Kb7 && eC7 && eC7(Object.prototype, "__proto__"),
        _b7 = Object,
        qb7 = _b7.getPrototypeOf;
    zb7.exports = U_1 && typeof U_1.get === "function" ? yB5([U_1.get]) : typeof qb7 === "function" ? function(K) {
        return qb7(K == null ? K : _b7(K))
    } : !1
})
// @from(Ln 35854, Col 4)
jb7 = p((RmA, $b7) => {
    var Ab7 = p_1(),
        Ob7 = F_1(),
        wb7 = Yb7();
    $b7.exports = Ab7 ? function(K) {
        return Ab7(K)
    } : Ob7 ? function(K) {
        if (!K || typeof K !== "object" && typeof K !== "function") throw TypeError("getProto: not an object");
        return Ob7(K)
    } : wb7 ? function(K) {
        return wb7(K)
    } : null
})
// @from(Ln 35867, Col 4)
oj8 = p((SmA, Hb7) => {
    var LB5 = Function.prototype.call,
        hB5 = Object.prototype.hasOwnProperty,
        RB5 = DU6();
    Hb7.exports = RB5.call(LB5, hB5)
})
// @from(Ln 35873, Col 4)
Db7 = p((CmA, Wb7) => {
    var Ez, SB5 = u_1(),
        CB5 = _C7(),
        bB5 = YC7(),
        IB5 = OC7(),
        xB5 = $C7(),
        _f6 = HC7(),
        Kf6 = lj8(),
        uB5 = MC7(),
        mB5 = WC7(),
        BB5 = ZC7(),
        pB5 = GC7(),
        FB5 = TC7(),
        gB5 = kC7(),
        UB5 = EC7(),
        QB5 = RC7(),
        Mb7 = Function,
        Q_1 = function(q) {
            try {
                return Mb7('"use strict"; return (' + q + ").constructor;")()
            } catch (K) {}
        },
        ZU6 = m_1(),
        dB5 = xC7(),
        d_1 = function() {
            throw new Kf6
        },
        cB5 = ZU6 ? function() {
            try {
                return arguments.callee, d_1
            } catch (q) {
                try {
                    return ZU6(arguments, "callee").get
                } catch (K) {
                    return d_1
                }
            }
        }() : d_1,
        eZ6 = pC7()(),
        Q0 = jb7(),
        lB5 = F_1(),
        nB5 = p_1(),
        Pb7 = g_1(),
        fU6 = rj8(),
        qf6 = {},
        iB5 = typeof Uint8Array > "u" || !Q0 ? Ez : Q0(Uint8Array),
        OA6 = {
            __proto__: null,
            "%AggregateError%": typeof AggregateError > "u" ? Ez : AggregateError,
            "%Array%": Array,
            "%ArrayBuffer%": typeof ArrayBuffer > "u" ? Ez : ArrayBuffer,
            "%ArrayIteratorPrototype%": eZ6 && Q0 ? Q0([][Symbol.iterator]()) : Ez,
            "%AsyncFromSyncIteratorPrototype%": Ez,
            "%AsyncFunction%": qf6,
            "%AsyncGenerator%": qf6,
            "%AsyncGeneratorFunction%": qf6,
            "%AsyncIteratorPrototype%": qf6,
            "%Atomics%": typeof Atomics > "u" ? Ez : Atomics,
            "%BigInt%": typeof BigInt > "u" ? Ez : BigInt,
            "%BigInt64Array%": typeof BigInt64Array > "u" ? Ez : BigInt64Array,
            "%BigUint64Array%": typeof BigUint64Array > "u" ? Ez : BigUint64Array,
            "%Boolean%": Boolean,
            "%DataView%": typeof DataView > "u" ? Ez : DataView,
            "%Date%": Date,
            "%decodeURI%": decodeURI,
            "%decodeURIComponent%": decodeURIComponent,
            "%encodeURI%": encodeURI,
            "%encodeURIComponent%": encodeURIComponent,
            "%Error%": CB5,
            "%eval%": eval,
            "%EvalError%": bB5,
            "%Float16Array%": typeof Float16Array > "u" ? Ez : Float16Array,
            "%Float32Array%": typeof Float32Array > "u" ? Ez : Float32Array,
            "%Float64Array%": typeof Float64Array > "u" ? Ez : Float64Array,
            "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? Ez : FinalizationRegistry,
            "%Function%": Mb7,
            "%GeneratorFunction%": qf6,
            "%Int8Array%": typeof Int8Array > "u" ? Ez : Int8Array,
            "%Int16Array%": typeof Int16Array > "u" ? Ez : Int16Array,
            "%Int32Array%": typeof Int32Array > "u" ? Ez : Int32Array,
            "%isFinite%": isFinite,
            "%isNaN%": isNaN,
            "%IteratorPrototype%": eZ6 && Q0 ? Q0(Q0([][Symbol.iterator]())) : Ez,
            "%JSON%": typeof JSON === "object" ? JSON : Ez,
            "%Map%": typeof Map > "u" ? Ez : Map,
            "%MapIteratorPrototype%": typeof Map > "u" || !eZ6 || !Q0 ? Ez : Q0(new Map()[Symbol.iterator]()),
            "%Math%": Math,
            "%Number%": Number,
            "%Object%": SB5,
            "%Object.getOwnPropertyDescriptor%": ZU6,
            "%parseFloat%": parseFloat,
            "%parseInt%": parseInt,
            "%Promise%": typeof Promise > "u" ? Ez : Promise,
            "%Proxy%": typeof Proxy > "u" ? Ez : Proxy,
            "%RangeError%": IB5,
            "%ReferenceError%": xB5,
            "%Reflect%": typeof Reflect > "u" ? Ez : Reflect,
            "%RegExp%": RegExp,
            "%Set%": typeof Set > "u" ? Ez : Set,
            "%SetIteratorPrototype%": typeof Set > "u" || !eZ6 || !Q0 ? Ez : Q0(new Set()[Symbol.iterator]()),
            "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? Ez : SharedArrayBuffer,
            "%String%": String,
            "%StringIteratorPrototype%": eZ6 && Q0 ? Q0("" [Symbol.iterator]()) : Ez,
            "%Symbol%": eZ6 ? Symbol : Ez,
            "%SyntaxError%": _f6,
            "%ThrowTypeError%": cB5,
            "%TypedArray%": iB5,
            "%TypeError%": Kf6,
            "%Uint8Array%": typeof Uint8Array > "u" ? Ez : Uint8Array,
            "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? Ez : Uint8ClampedArray,
            "%Uint16Array%": typeof Uint16Array > "u" ? Ez : Uint16Array,
            "%Uint32Array%": typeof Uint32Array > "u" ? Ez : Uint32Array,
            "%URIError%": uB5,
            "%WeakMap%": typeof WeakMap > "u" ? Ez : WeakMap,
            "%WeakRef%": typeof WeakRef > "u" ? Ez : WeakRef,
            "%WeakSet%": typeof WeakSet > "u" ? Ez : WeakSet,
            "%Function.prototype.call%": fU6,
            "%Function.prototype.apply%": Pb7,
            "%Object.defineProperty%": dB5,
            "%Object.getPrototypeOf%": lB5,
            "%Math.abs%": mB5,
            "%Math.floor%": BB5,
            "%Math.max%": pB5,
            "%Math.min%": FB5,
            "%Math.pow%": gB5,
            "%Math.round%": UB5,
            "%Math.sign%": QB5,
            "%Reflect.getPrototypeOf%": nB5
        };
    if (Q0) try {
        null.error
    } catch (q) {
        c_1 = Q0(Q0(q)), OA6["%Error.prototype%"] = c_1
    }
    var c_1, rB5 = function q(K) {
            var _;
            if (K === "%AsyncFunction%") _ = Q_1("async function () {}");
            else if (K === "%GeneratorFunction%") _ = Q_1("function* () {}");
            else if (K === "%AsyncGeneratorFunction%") _ = Q_1("async function* () {}");
            else if (K === "%AsyncGenerator%") {
                var z = q("%AsyncGeneratorFunction%");
                if (z) _ = z.prototype
            } else if (K === "%AsyncIteratorPrototype%") {
                var Y = q("%AsyncGenerator%");
                if (Y && Q0) _ = Q0(Y.prototype)
            }
            return OA6[K] = _, _
        },
        Jb7 = {
            __proto__: null,
            "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
            "%ArrayPrototype%": ["Array", "prototype"],
            "%ArrayProto_entries%": ["Array", "prototype", "entries"],
            "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
            "%ArrayProto_keys%": ["Array", "prototype", "keys"],
            "%ArrayProto_values%": ["Array", "prototype", "values"],
            "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
            "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
            "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
            "%BooleanPrototype%": ["Boolean", "prototype"],
            "%DataViewPrototype%": ["DataView", "prototype"],
            "%DatePrototype%": ["Date", "prototype"],
            "%ErrorPrototype%": ["Error", "prototype"],
            "%EvalErrorPrototype%": ["EvalError", "prototype"],
            "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
            "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
            "%FunctionPrototype%": ["Function", "prototype"],
            "%Generator%": ["GeneratorFunction", "prototype"],
            "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
            "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
            "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
            "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
            "%JSONParse%": ["JSON", "parse"],
            "%JSONStringify%": ["JSON", "stringify"],
            "%MapPrototype%": ["Map", "prototype"],
            "%NumberPrototype%": ["Number", "prototype"],
            "%ObjectPrototype%": ["Object", "prototype"],
            "%ObjProto_toString%": ["Object", "prototype", "toString"],
            "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
            "%PromisePrototype%": ["Promise", "prototype"],
            "%PromiseProto_then%": ["Promise", "prototype", "then"],
            "%Promise_all%": ["Promise", "all"],
            "%Promise_reject%": ["Promise", "reject"],
            "%Promise_resolve%": ["Promise", "resolve"],
            "%RangeErrorPrototype%": ["RangeError", "prototype"],
            "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
            "%RegExpPrototype%": ["RegExp", "prototype"],
            "%SetPrototype%": ["Set", "prototype"],
            "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
            "%StringPrototype%": ["String", "prototype"],
            "%SymbolPrototype%": ["Symbol", "prototype"],
            "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
            "%TypedArrayPrototype%": ["TypedArray", "prototype"],
            "%TypeErrorPrototype%": ["TypeError", "prototype"],
            "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
            "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
            "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
            "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
            "%URIErrorPrototype%": ["URIError", "prototype"],
            "%WeakMapPrototype%": ["WeakMap", "prototype"],
            "%WeakSetPrototype%": ["WeakSet", "prototype"]
        },
        GU6 = DU6(),
        aj8 = oj8(),
        oB5 = GU6.call(fU6, Array.prototype.concat),
        aB5 = GU6.call(Pb7, Array.prototype.splice),
        Xb7 = GU6.call(fU6, String.prototype.replace),
        sj8 = GU6.call(fU6, String.prototype.slice),
        sB5 = GU6.call(fU6, RegExp.prototype.exec),
        tB5 = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,
        eB5 = /\\(\\)?/g,
        qp5 = function(K) {
            var _ = sj8(K, 0, 1),
                z = sj8(K, -1);
            if (_ === "%" && z !== "%") throw new _f6("invalid intrinsic syntax, expected closing `%`");
            else if (z === "%" && _ !== "%") throw new _f6("invalid intrinsic syntax, expected opening `%`");
            var Y = [];
            return Xb7(K, tB5, function(A, O, w, $) {
                Y[Y.length] = w ? Xb7($, eB5, "$1") : O || A
            }), Y
        },
        Kp5 = function(K, _) {
            var z = K,
                Y;
            if (aj8(Jb7, z)) Y = Jb7[z], z = "%" + Y[0] + "%";
            if (aj8(OA6, z)) {
                var A = OA6[z];
                if (A === qf6) A = rB5(z);
                if (typeof A > "u" && !_) throw new Kf6("intrinsic " + K + " exists, but is not available. Please file an issue!");
                return {
                    alias: Y,
                    name: z,
                    value: A
                }
            }
            throw new _f6("intrinsic " + K + " does not exist!")
        };
    Wb7.exports = function(K, _) {
        if (typeof K !== "string" || K.length === 0) throw new Kf6("intrinsic name must be a non-empty string");
        if (arguments.length > 1 && typeof _ !== "boolean") throw new Kf6('"allowMissing" argument must be a boolean');
        if (sB5(/^%?[^%]*%?$/, K) === null) throw new _f6("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        var z = qp5(K),
            Y = z.length > 0 ? z[0] : "",
            A = Kp5("%" + Y + "%", _),
            O = A.name,
            w = A.value,
            $ = !1,
            j = A.alias;
        if (j) Y = j[0], aB5(z, oB5([0, 1], j));
        for (var H = 1, J = !0; H < z.length; H += 1) {
            var X = z[H],
                M = sj8(X, 0, 1),
                P = sj8(X, -1);
            if ((M === '"' || M === "'" || M === "`" || (P === '"' || P === "'" || P === "`")) && M !== P) throw new _f6("property names with quotes must have matching quotes");
            if (X === "constructor" || !J) $ = !0;
            if (Y += "." + X, O = "%" + Y + "%", aj8(OA6, O)) w = OA6[O];
            else if (w != null) {
                if (!(X in w)) {
                    if (!_) throw new Kf6("base intrinsic for " + K + " exists, but the property is not available.");
                    return
                }
                if (ZU6 && H + 1 >= z.length) {
                    var W = ZU6(w, X);
                    if (J = !!W, J && "get" in W && !("originalValue" in W.get)) w = W.get;
                    else w = w[X]
                } else J = aj8(w, X), w = w[X];
                if (J && !$) OA6[O] = w
            }
        }
        return w
    }
})
// @from(Ln 36145, Col 4)
fb7 = p((bmA, Zb7) => {
    var _p5 = B_1();
    Zb7.exports = function() {
        return _p5() && !!Symbol.toStringTag
    }
})
// @from(Ln 36151, Col 4)
Tb7 = p((ImA, vb7) => {
    var zp5 = Db7(),
        Gb7 = zp5("%Object.defineProperty%", !0),
        Yp5 = fb7()(),
        Ap5 = oj8(),
        Op5 = lj8(),
        tj8 = Yp5 ? Symbol.toStringTag : null;
    vb7.exports = function(K, _) {
        var z = arguments.length > 2 && !!arguments[2] && arguments[2].force,
            Y = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
        if (typeof z < "u" && typeof z !== "boolean" || typeof Y < "u" && typeof Y !== "boolean") throw new Op5("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
        if (tj8 && (z || !Ap5(K, tj8)))
            if (Gb7) Gb7(K, tj8, {
                configurable: !Y,
                enumerable: !1,
                value: _,
                writable: !1
            });
            else K[tj8] = _
    }
})
// @from(Ln 36172, Col 4)
kb7 = p((xmA, Vb7) => {
    Vb7.exports = function(q, K) {
        return Object.keys(K).forEach(function(_) {
            q[_] = q[_] || K[_]
        }), q
    }
})