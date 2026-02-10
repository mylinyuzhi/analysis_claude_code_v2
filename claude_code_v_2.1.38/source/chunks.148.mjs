
// @from(Ln 376559, Col 4)
je4 = R((WUY, LSA) => {
    var a51 = kG1(),
        ze4 = LG1(),
        ngY = yt4(),
        rgY = IZ6(),
        rt = Object.prototype.hasOwnProperty,
        xZ6 = 1,
        we4 = 2,
        He4 = 3,
        bZ6 = 4,
        vSA = 1,
        ogY = 2,
        tt4 = 3,
        agY = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,
        sgY = /[\x85\u2028\u2029]/,
        tgY = /[,\[\]\{\}]/,
        $e4 = /^(?:!|!!|![a-z\-]+!)$/i,
        Oe4 = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;

    function et4(A) {
        return Object.prototype.toString.call(A)
    }

    function pm(A) {
        return A === 10 || A === 13
    }

    function s51(A) {
        return A === 9 || A === 32
    }

    function kN(A) {
        return A === 9 || A === 32 || A === 10 || A === 13
    }

    function RG1(A) {
        return A === 44 || A === 91 || A === 93 || A === 123 || A === 125
    }

    function egY(A) {
        var q;
        if (48 <= A && A <= 57) return A - 48;
        if (q = A | 32, 97 <= q && q <= 102) return q - 97 + 10;
        return -1
    }

    function AUY(A) {
        if (A === 120) return 2;
        if (A === 117) return 4;
        if (A === 85) return 8;
        return 0
    }

    function qUY(A) {
        if (48 <= A && A <= 57) return A - 48;
        return -1
    }

    function Ae4(A) {
        return A === 48 ? "\x00" : A === 97 ? "\x07" : A === 98 ? "\b" : A === 116 ? "\t" : A === 9 ? "\t" : A === 110 ? `
` : A === 118 ? "\v" : A === 102 ? "\f" : A === 114 ? "\r" : A === 101 ? "\x1B" : A === 32 ? " " : A === 34 ? '"' : A === 47 ? "/" : A === 92 ? "\\" : A === 78 ? "" : A === 95 ? " " : A === 76 ? "\u2028" : A === 80 ? "\u2029" : ""
    }

    function KUY(A) {
        if (A <= 65535) return String.fromCharCode(A);
        return String.fromCharCode((A - 65536 >> 10) + 55296, (A - 65536 & 1023) + 56320)
    }
    var _e4 = Array(256),
        Je4 = Array(256);
    for (it = 0; it < 256; it++) _e4[it] = Ae4(it) ? 1 : 0, Je4[it] = Ae4(it);
    var it;

    function YUY(A, q) {
        this.input = A, this.filename = q.filename || null, this.schema = q.schema || rgY, this.onWarning = q.onWarning || null, this.legacy = q.legacy || !1, this.json = q.json || !1, this.listener = q.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = A.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = []
    }

    function Xe4(A, q) {
        var K = {
            name: A.filename,
            buffer: A.input.slice(0, -1),
            position: A.position,
            line: A.line,
            column: A.position - A.lineStart
        };
        return K.snippet = ngY(K), new ze4(q, K)
    }

    function rq(A, q) {
        throw Xe4(A, q)
    }

    function uZ6(A, q) {
        if (A.onWarning) A.onWarning.call(null, Xe4(A, q))
    }
    var qe4 = {
        YAML: function(q, K, Y) {
            var z, w, H;
            if (q.version !== null) rq(q, "duplication of %YAML directive");
            if (Y.length !== 1) rq(q, "YAML directive accepts exactly one argument");
            if (z = /^([0-9]+)\.([0-9]+)$/.exec(Y[0]), z === null) rq(q, "ill-formed argument of the YAML directive");
            if (w = parseInt(z[1], 10), H = parseInt(z[2], 10), w !== 1) rq(q, "unacceptable YAML version of the document");
            if (q.version = Y[0], q.checkLineBreaks = H < 2, H !== 1 && H !== 2) uZ6(q, "unsupported YAML version of the document")
        },
        TAG: function(q, K, Y) {
            var z, w;
            if (Y.length !== 2) rq(q, "TAG directive accepts exactly two arguments");
            if (z = Y[0], w = Y[1], !$e4.test(z)) rq(q, "ill-formed tag handle (first argument) of the TAG directive");
            if (rt.call(q.tagMap, z)) rq(q, 'there is a previously declared suffix for "' + z + '" tag handle');
            if (!Oe4.test(w)) rq(q, "ill-formed tag prefix (second argument) of the TAG directive");
            try {
                w = decodeURIComponent(w)
            } catch (H) {
                rq(q, "tag prefix is malformed: " + w)
            }
            q.tagMap[z] = w
        }
    };

    function nt(A, q, K, Y) {
        var z, w, H, $;
        if (q < K) {
            if ($ = A.input.slice(q, K), Y) {
                for (z = 0, w = $.length; z < w; z += 1)
                    if (H = $.charCodeAt(z), !(H === 9 || 32 <= H && H <= 1114111)) rq(A, "expected valid JSON character")
            } else if (agY.test($)) rq(A, "the stream contains non-printable characters");
            A.result += $
        }
    }

    function Ke4(A, q, K, Y) {
        var z, w, H, $;
        if (!a51.isObject(K)) rq(A, "cannot merge mappings; the provided source object is unacceptable");
        z = Object.keys(K);
        for (H = 0, $ = z.length; H < $; H += 1)
            if (w = z[H], !rt.call(q, w)) q[w] = K[w], Y[w] = !0
    }

    function yG1(A, q, K, Y, z, w, H, $, O) {
        var _, J;
        if (Array.isArray(z)) {
            z = Array.prototype.slice.call(z);
            for (_ = 0, J = z.length; _ < J; _ += 1) {
                if (Array.isArray(z[_])) rq(A, "nested arrays are not supported inside keys");
                if (typeof z === "object" && et4(z[_]) === "[object Object]") z[_] = "[object Object]"
            }
        }
        if (typeof z === "object" && et4(z) === "[object Object]") z = "[object Object]";
        if (z = String(z), q === null) q = {};
        if (Y === "tag:yaml.org,2002:merge")
            if (Array.isArray(w))
                for (_ = 0, J = w.length; _ < J; _ += 1) Ke4(A, q, w[_], K);
            else Ke4(A, q, w, K);
        else {
            if (!A.json && !rt.call(K, z) && rt.call(q, z)) A.line = H || A.line, A.lineStart = $ || A.lineStart, A.position = O || A.position, rq(A, "duplicated mapping key");
            if (z === "__proto__") Object.defineProperty(q, z, {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                value: w
            });
            else q[z] = w;
            delete K[z]
        }
        return q
    }

    function ESA(A) {
        var q = A.input.charCodeAt(A.position);
        if (q === 10) A.position++;
        else if (q === 13) {
            if (A.position++, A.input.charCodeAt(A.position) === 10) A.position++
        } else rq(A, "a line break is expected");
        A.line += 1, A.lineStart = A.position, A.firstTabInLine = -1
    }

    function eX(A, q, K) {
        var Y = 0,
            z = A.input.charCodeAt(A.position);
        while (z !== 0) {
            while (s51(z)) {
                if (z === 9 && A.firstTabInLine === -1) A.firstTabInLine = A.position;
                z = A.input.charCodeAt(++A.position)
            }
            if (q && z === 35)
                do z = A.input.charCodeAt(++A.position); while (z !== 10 && z !== 13 && z !== 0);
            if (pm(z)) {
                ESA(A), z = A.input.charCodeAt(A.position), Y++, A.lineIndent = 0;
                while (z === 32) A.lineIndent++, z = A.input.charCodeAt(++A.position)
            } else break
        }
        if (K !== -1 && Y !== 0 && A.lineIndent < K) uZ6(A, "deficient indentation");
        return Y
    }

    function BZ6(A) {
        var q = A.position,
            K;
        if (K = A.input.charCodeAt(q), (K === 45 || K === 46) && K === A.input.charCodeAt(q + 1) && K === A.input.charCodeAt(q + 2)) {
            if (q += 3, K = A.input.charCodeAt(q), K === 0 || kN(K)) return !0
        }
        return !1
    }

    function kSA(A, q) {
        if (q === 1) A.result += " ";
        else if (q > 1) A.result += a51.repeat(`
`, q - 1)
    }

    function zUY(A, q, K) {
        var Y, z, w, H, $, O, _, J, X = A.kind,
            D = A.result,
            j;
        if (j = A.input.charCodeAt(A.position), kN(j) || RG1(j) || j === 35 || j === 38 || j === 42 || j === 33 || j === 124 || j === 62 || j === 39 || j === 34 || j === 37 || j === 64 || j === 96) return !1;
        if (j === 63 || j === 45) {
            if (z = A.input.charCodeAt(A.position + 1), kN(z) || K && RG1(z)) return !1
        }
        A.kind = "scalar", A.result = "", w = H = A.position, $ = !1;
        while (j !== 0) {
            if (j === 58) {
                if (z = A.input.charCodeAt(A.position + 1), kN(z) || K && RG1(z)) break
            } else if (j === 35) {
                if (Y = A.input.charCodeAt(A.position - 1), kN(Y)) break
            } else if (A.position === A.lineStart && BZ6(A) || K && RG1(j)) break;
            else if (pm(j))
                if (O = A.line, _ = A.lineStart, J = A.lineIndent, eX(A, !1, -1), A.lineIndent >= q) {
                    $ = !0, j = A.input.charCodeAt(A.position);
                    continue
                } else {
                    A.position = H, A.line = O, A.lineStart = _, A.lineIndent = J;
                    break
                } if ($) nt(A, w, H, !1), kSA(A, A.line - O), w = H = A.position, $ = !1;
            if (!s51(j)) H = A.position + 1;
            j = A.input.charCodeAt(++A.position)
        }
        if (nt(A, w, H, !1), A.result) return !0;
        return A.kind = X, A.result = D, !1
    }

    function wUY(A, q) {
        var K, Y, z;
        if (K = A.input.charCodeAt(A.position), K !== 39) return !1;
        A.kind = "scalar", A.result = "", A.position++, Y = z = A.position;
        while ((K = A.input.charCodeAt(A.position)) !== 0)
            if (K === 39)
                if (nt(A, Y, A.position, !0), K = A.input.charCodeAt(++A.position), K === 39) Y = A.position, A.position++, z = A.position;
                else return !0;
        else if (pm(K)) nt(A, Y, z, !0), kSA(A, eX(A, !1, q)), Y = z = A.position;
        else if (A.position === A.lineStart && BZ6(A)) rq(A, "unexpected end of the document within a single quoted scalar");
        else A.position++, z = A.position;
        rq(A, "unexpected end of the stream within a single quoted scalar")
    }

    function HUY(A, q) {
        var K, Y, z, w, H, $;
        if ($ = A.input.charCodeAt(A.position), $ !== 34) return !1;
        A.kind = "scalar", A.result = "", A.position++, K = Y = A.position;
        while (($ = A.input.charCodeAt(A.position)) !== 0)
            if ($ === 34) return nt(A, K, A.position, !0), A.position++, !0;
            else if ($ === 92) {
            if (nt(A, K, A.position, !0), $ = A.input.charCodeAt(++A.position), pm($)) eX(A, !1, q);
            else if ($ < 256 && _e4[$]) A.result += Je4[$], A.position++;
            else if ((H = AUY($)) > 0) {
                z = H, w = 0;
                for (; z > 0; z--)
                    if ($ = A.input.charCodeAt(++A.position), (H = egY($)) >= 0) w = (w << 4) + H;
                    else rq(A, "expected hexadecimal character");
                A.result += KUY(w), A.position++
            } else rq(A, "unknown escape sequence");
            K = Y = A.position
        } else if (pm($)) nt(A, K, Y, !0), kSA(A, eX(A, !1, q)), K = Y = A.position;
        else if (A.position === A.lineStart && BZ6(A)) rq(A, "unexpected end of the document within a double quoted scalar");
        else A.position++, Y = A.position;
        rq(A, "unexpected end of the stream within a double quoted scalar")
    }

    function $UY(A, q) {
        var K = !0,
            Y, z, w, H = A.tag,
            $, O = A.anchor,
            _, J, X, D, j, M = Object.create(null),
            P, W, G, f;
        if (f = A.input.charCodeAt(A.position), f === 91) J = 93, j = !1, $ = [];
        else if (f === 123) J = 125, j = !0, $ = {};
        else return !1;
        if (A.anchor !== null) A.anchorMap[A.anchor] = $;
        f = A.input.charCodeAt(++A.position);
        while (f !== 0) {
            if (eX(A, !0, q), f = A.input.charCodeAt(A.position), f === J) return A.position++, A.tag = H, A.anchor = O, A.kind = j ? "mapping" : "sequence", A.result = $, !0;
            else if (!K) rq(A, "missed comma between flow collection entries");
            else if (f === 44) rq(A, "expected the node content, but found ','");
            if (W = P = G = null, X = D = !1, f === 63) {
                if (_ = A.input.charCodeAt(A.position + 1), kN(_)) X = D = !0, A.position++, eX(A, !0, q)
            }
            if (Y = A.line, z = A.lineStart, w = A.position, CG1(A, q, xZ6, !1, !0), W = A.tag, P = A.result, eX(A, !0, q), f = A.input.charCodeAt(A.position), (D || A.line === Y) && f === 58) X = !0, f = A.input.charCodeAt(++A.position), eX(A, !0, q), CG1(A, q, xZ6, !1, !0), G = A.result;
            if (j) yG1(A, $, M, W, P, G, Y, z, w);
            else if (X) $.push(yG1(A, null, M, W, P, G, Y, z, w));
            else $.push(P);
            if (eX(A, !0, q), f = A.input.charCodeAt(A.position), f === 44) K = !0, f = A.input.charCodeAt(++A.position);
            else K = !1
        }
        rq(A, "unexpected end of the stream within a flow collection")
    }

    function OUY(A, q) {
        var K, Y, z = vSA,
            w = !1,
            H = !1,
            $ = q,
            O = 0,
            _ = !1,
            J, X;
        if (X = A.input.charCodeAt(A.position), X === 124) Y = !1;
        else if (X === 62) Y = !0;
        else return !1;
        A.kind = "scalar", A.result = "";
        while (X !== 0)
            if (X = A.input.charCodeAt(++A.position), X === 43 || X === 45)
                if (vSA === z) z = X === 43 ? tt4 : ogY;
                else rq(A, "repeat of a chomping mode identifier");
        else if ((J = qUY(X)) >= 0)
            if (J === 0) rq(A, "bad explicit indentation width of a block scalar; it cannot be less than one");
            else if (!H) $ = q + J - 1, H = !0;
        else rq(A, "repeat of an indentation width identifier");
        else break;
        if (s51(X)) {
            do X = A.input.charCodeAt(++A.position); while (s51(X));
            if (X === 35)
                do X = A.input.charCodeAt(++A.position); while (!pm(X) && X !== 0)
        }
        while (X !== 0) {
            ESA(A), A.lineIndent = 0, X = A.input.charCodeAt(A.position);
            while ((!H || A.lineIndent < $) && X === 32) A.lineIndent++, X = A.input.charCodeAt(++A.position);
            if (!H && A.lineIndent > $) $ = A.lineIndent;
            if (pm(X)) {
                O++;
                continue
            }
            if (A.lineIndent < $) {
                if (z === tt4) A.result += a51.repeat(`
`, w ? 1 + O : O);
                else if (z === vSA) {
                    if (w) A.result += `
`
                }
                break
            }
            if (Y)
                if (s51(X)) _ = !0, A.result += a51.repeat(`
`, w ? 1 + O : O);
                else if (_) _ = !1, A.result += a51.repeat(`
`, O + 1);
            else if (O === 0) {
                if (w) A.result += " "
            } else A.result += a51.repeat(`
`, O);
            else A.result += a51.repeat(`
`, w ? 1 + O : O);
            w = !0, H = !0, O = 0, K = A.position;
            while (!pm(X) && X !== 0) X = A.input.charCodeAt(++A.position);
            nt(A, K, A.position, !1)
        }
        return !0
    }

    function Ye4(A, q) {
        var K, Y = A.tag,
            z = A.anchor,
            w = [],
            H, $ = !1,
            O;
        if (A.firstTabInLine !== -1) return !1;
        if (A.anchor !== null) A.anchorMap[A.anchor] = w;
        O = A.input.charCodeAt(A.position);
        while (O !== 0) {
            if (A.firstTabInLine !== -1) A.position = A.firstTabInLine, rq(A, "tab characters must not be used in indentation");
            if (O !== 45) break;
            if (H = A.input.charCodeAt(A.position + 1), !kN(H)) break;
            if ($ = !0, A.position++, eX(A, !0, -1)) {
                if (A.lineIndent <= q) {
                    w.push(null), O = A.input.charCodeAt(A.position);
                    continue
                }
            }
            if (K = A.line, CG1(A, q, He4, !1, !0), w.push(A.result), eX(A, !0, -1), O = A.input.charCodeAt(A.position), (A.line === K || A.lineIndent > q) && O !== 0) rq(A, "bad indentation of a sequence entry");
            else if (A.lineIndent < q) break
        }
        if ($) return A.tag = Y, A.anchor = z, A.kind = "sequence", A.result = w, !0;
        return !1
    }

    function _UY(A, q, K) {
        var Y, z, w, H, $, O, _ = A.tag,
            J = A.anchor,
            X = {},
            D = Object.create(null),
            j = null,
            M = null,
            P = null,
            W = !1,
            G = !1,
            f;
        if (A.firstTabInLine !== -1) return !1;
        if (A.anchor !== null) A.anchorMap[A.anchor] = X;
        f = A.input.charCodeAt(A.position);
        while (f !== 0) {
            if (!W && A.firstTabInLine !== -1) A.position = A.firstTabInLine, rq(A, "tab characters must not be used in indentation");
            if (Y = A.input.charCodeAt(A.position + 1), w = A.line, (f === 63 || f === 58) && kN(Y)) {
                if (f === 63) {
                    if (W) yG1(A, X, D, j, M, null, H, $, O), j = M = P = null;
                    G = !0, W = !0, z = !0
                } else if (W) W = !1, z = !0;
                else rq(A, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
                A.position += 1, f = Y
            } else {
                if (H = A.line, $ = A.lineStart, O = A.position, !CG1(A, K, we4, !1, !0)) break;
                if (A.line === w) {
                    f = A.input.charCodeAt(A.position);
                    while (s51(f)) f = A.input.charCodeAt(++A.position);
                    if (f === 58) {
                        if (f = A.input.charCodeAt(++A.position), !kN(f)) rq(A, "a whitespace character is expected after the key-value separator within a block mapping");
                        if (W) yG1(A, X, D, j, M, null, H, $, O), j = M = P = null;
                        G = !0, W = !1, z = !1, j = A.tag, M = A.result
                    } else if (G) rq(A, "can not read an implicit mapping pair; a colon is missed");
                    else return A.tag = _, A.anchor = J, !0
                } else if (G) rq(A, "can not read a block mapping entry; a multiline key may not be an implicit key");
                else return A.tag = _, A.anchor = J, !0
            }
            if (A.line === w || A.lineIndent > q) {
                if (W) H = A.line, $ = A.lineStart, O = A.position;
                if (CG1(A, q, bZ6, !0, z))
                    if (W) M = A.result;
                    else P = A.result;
                if (!W) yG1(A, X, D, j, M, P, H, $, O), j = M = P = null;
                eX(A, !0, -1), f = A.input.charCodeAt(A.position)
            }
            if ((A.line === w || A.lineIndent > q) && f !== 0) rq(A, "bad indentation of a mapping entry");
            else if (A.lineIndent < q) break
        }
        if (W) yG1(A, X, D, j, M, null, H, $, O);
        if (G) A.tag = _, A.anchor = J, A.kind = "mapping", A.result = X;
        return G
    }

    function JUY(A) {
        var q, K = !1,
            Y = !1,
            z, w, H;
        if (H = A.input.charCodeAt(A.position), H !== 33) return !1;
        if (A.tag !== null) rq(A, "duplication of a tag property");
        if (H = A.input.charCodeAt(++A.position), H === 60) K = !0, H = A.input.charCodeAt(++A.position);
        else if (H === 33) Y = !0, z = "!!", H = A.input.charCodeAt(++A.position);
        else z = "!";
        if (q = A.position, K) {
            do H = A.input.charCodeAt(++A.position); while (H !== 0 && H !== 62);
            if (A.position < A.length) w = A.input.slice(q, A.position), H = A.input.charCodeAt(++A.position);
            else rq(A, "unexpected end of the stream within a verbatim tag")
        } else {
            while (H !== 0 && !kN(H)) {
                if (H === 33)
                    if (!Y) {
                        if (z = A.input.slice(q - 1, A.position + 1), !$e4.test(z)) rq(A, "named tag handle cannot contain such characters");
                        Y = !0, q = A.position + 1
                    } else rq(A, "tag suffix cannot contain exclamation marks");
                H = A.input.charCodeAt(++A.position)
            }
            if (w = A.input.slice(q, A.position), tgY.test(w)) rq(A, "tag suffix cannot contain flow indicator characters")
        }
        if (w && !Oe4.test(w)) rq(A, "tag name cannot contain such characters: " + w);
        try {
            w = decodeURIComponent(w)
        } catch ($) {
            rq(A, "tag name is malformed: " + w)
        }
        if (K) A.tag = w;
        else if (rt.call(A.tagMap, z)) A.tag = A.tagMap[z] + w;
        else if (z === "!") A.tag = "!" + w;
        else if (z === "!!") A.tag = "tag:yaml.org,2002:" + w;
        else rq(A, 'undeclared tag handle "' + z + '"');
        return !0
    }

    function XUY(A) {
        var q, K;
        if (K = A.input.charCodeAt(A.position), K !== 38) return !1;
        if (A.anchor !== null) rq(A, "duplication of an anchor property");
        K = A.input.charCodeAt(++A.position), q = A.position;
        while (K !== 0 && !kN(K) && !RG1(K)) K = A.input.charCodeAt(++A.position);
        if (A.position === q) rq(A, "name of an anchor node must contain at least one character");
        return A.anchor = A.input.slice(q, A.position), !0
    }

    function DUY(A) {
        var q, K, Y;
        if (Y = A.input.charCodeAt(A.position), Y !== 42) return !1;
        Y = A.input.charCodeAt(++A.position), q = A.position;
        while (Y !== 0 && !kN(Y) && !RG1(Y)) Y = A.input.charCodeAt(++A.position);
        if (A.position === q) rq(A, "name of an alias node must contain at least one character");
        if (K = A.input.slice(q, A.position), !rt.call(A.anchorMap, K)) rq(A, 'unidentified alias "' + K + '"');
        return A.result = A.anchorMap[K], eX(A, !0, -1), !0
    }

    function CG1(A, q, K, Y, z) {
        var w, H, $, O = 1,
            _ = !1,
            J = !1,
            X, D, j, M, P, W;
        if (A.listener !== null) A.listener("open", A);
        if (A.tag = null, A.anchor = null, A.kind = null, A.result = null, w = H = $ = bZ6 === K || He4 === K, Y) {
            if (eX(A, !0, -1)) {
                if (_ = !0, A.lineIndent > q) O = 1;
                else if (A.lineIndent === q) O = 0;
                else if (A.lineIndent < q) O = -1
            }
        }
        if (O === 1)
            while (JUY(A) || XUY(A))
                if (eX(A, !0, -1)) {
                    if (_ = !0, $ = w, A.lineIndent > q) O = 1;
                    else if (A.lineIndent === q) O = 0;
                    else if (A.lineIndent < q) O = -1
                } else $ = !1;
        if ($) $ = _ || z;
        if (O === 1 || bZ6 === K) {
            if (xZ6 === K || we4 === K) P = q;
            else P = q + 1;
            if (W = A.position - A.lineStart, O === 1)
                if ($ && (Ye4(A, W) || _UY(A, W, P)) || $UY(A, P)) J = !0;
                else {
                    if (H && OUY(A, P) || wUY(A, P) || HUY(A, P)) J = !0;
                    else if (DUY(A)) {
                        if (J = !0, A.tag !== null || A.anchor !== null) rq(A, "alias node should not have any properties")
                    } else if (zUY(A, P, xZ6 === K)) {
                        if (J = !0, A.tag === null) A.tag = "?"
                    }
                    if (A.anchor !== null) A.anchorMap[A.anchor] = A.result
                }
            else if (O === 0) J = $ && Ye4(A, W)
        }
        if (A.tag === null) {
            if (A.anchor !== null) A.anchorMap[A.anchor] = A.result
        } else if (A.tag === "?") {
            if (A.result !== null && A.kind !== "scalar") rq(A, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + A.kind + '"');
            for (X = 0, D = A.implicitTypes.length; X < D; X += 1)
                if (M = A.implicitTypes[X], M.resolve(A.result)) {
                    if (A.result = M.construct(A.result), A.tag = M.tag, A.anchor !== null) A.anchorMap[A.anchor] = A.result;
                    break
                }
        } else if (A.tag !== "!") {
            if (rt.call(A.typeMap[A.kind || "fallback"], A.tag)) M = A.typeMap[A.kind || "fallback"][A.tag];
            else {
                M = null, j = A.typeMap.multi[A.kind || "fallback"];
                for (X = 0, D = j.length; X < D; X += 1)
                    if (A.tag.slice(0, j[X].tag.length) === j[X].tag) {
                        M = j[X];
                        break
                    }
            }
            if (!M) rq(A, "unknown tag !<" + A.tag + ">");
            if (A.result !== null && M.kind !== A.kind) rq(A, "unacceptable node kind for !<" + A.tag + '> tag; it should be "' + M.kind + '", not "' + A.kind + '"');
            if (!M.resolve(A.result, A.tag)) rq(A, "cannot resolve a node with !<" + A.tag + "> explicit tag");
            else if (A.result = M.construct(A.result, A.tag), A.anchor !== null) A.anchorMap[A.anchor] = A.result
        }
        if (A.listener !== null) A.listener("close", A);
        return A.tag !== null || A.anchor !== null || J
    }

    function jUY(A) {
        var q = A.position,
            K, Y, z, w = !1,
            H;
        A.version = null, A.checkLineBreaks = A.legacy, A.tagMap = Object.create(null), A.anchorMap = Object.create(null);
        while ((H = A.input.charCodeAt(A.position)) !== 0) {
            if (eX(A, !0, -1), H = A.input.charCodeAt(A.position), A.lineIndent > 0 || H !== 37) break;
            w = !0, H = A.input.charCodeAt(++A.position), K = A.position;
            while (H !== 0 && !kN(H)) H = A.input.charCodeAt(++A.position);
            if (Y = A.input.slice(K, A.position), z = [], Y.length < 1) rq(A, "directive name must not be less than one character in length");
            while (H !== 0) {
                while (s51(H)) H = A.input.charCodeAt(++A.position);
                if (H === 35) {
                    do H = A.input.charCodeAt(++A.position); while (H !== 0 && !pm(H));
                    break
                }
                if (pm(H)) break;
                K = A.position;
                while (H !== 0 && !kN(H)) H = A.input.charCodeAt(++A.position);
                z.push(A.input.slice(K, A.position))
            }
            if (H !== 0) ESA(A);
            if (rt.call(qe4, Y)) qe4[Y](A, Y, z);
            else uZ6(A, 'unknown document directive "' + Y + '"')
        }
        if (eX(A, !0, -1), A.lineIndent === 0 && A.input.charCodeAt(A.position) === 45 && A.input.charCodeAt(A.position + 1) === 45 && A.input.charCodeAt(A.position + 2) === 45) A.position += 3, eX(A, !0, -1);
        else if (w) rq(A, "directives end mark is expected");
        if (CG1(A, A.lineIndent - 1, bZ6, !1, !0), eX(A, !0, -1), A.checkLineBreaks && sgY.test(A.input.slice(q, A.position))) uZ6(A, "non-ASCII line breaks are interpreted as content");
        if (A.documents.push(A.result), A.position === A.lineStart && BZ6(A)) {
            if (A.input.charCodeAt(A.position) === 46) A.position += 3, eX(A, !0, -1);
            return
        }
        if (A.position < A.length - 1) rq(A, "end of the stream or a document separator is expected");
        else return
    }

    function De4(A, q) {
        if (A = String(A), q = q || {}, A.length !== 0) {
            if (A.charCodeAt(A.length - 1) !== 10 && A.charCodeAt(A.length - 1) !== 13) A += `
`;
            if (A.charCodeAt(0) === 65279) A = A.slice(1)
        }
        var K = new YUY(A, q),
            Y = A.indexOf("\x00");
        if (Y !== -1) K.position = Y, rq(K, "null byte is not allowed in input");
        K.input += "\x00";
        while (K.input.charCodeAt(K.position) === 32) K.lineIndent += 1, K.position += 1;
        while (K.position < K.length - 1) jUY(K);
        return K.documents
    }

    function MUY(A, q, K) {
        if (q !== null && typeof q === "object" && typeof K > "u") K = q, q = null;
        var Y = De4(A, K);
        if (typeof q !== "function") return Y;
        for (var z = 0, w = Y.length; z < w; z += 1) q(Y[z])
    }

    function PUY(A, q) {
        var K = De4(A, q);
        if (K.length === 0) return;
        else if (K.length === 1) return K[0];
        throw new ze4("expected a single document in the stream, but found more")
    }
    WUY.loadAll = MUY;
    WUY.load = PUY
})
// @from(Ln 377193, Col 4)
be4 = R((ApY, xe4) => {
    var QZ6 = kG1(),
        EU1 = LG1(),
        fUY = IZ6(),
        Te4 = Object.prototype.toString,
        ve4 = Object.prototype.hasOwnProperty,
        hSA = 65279,
        VUY = 9,
        NU1 = 10,
        NUY = 13,
        TUY = 32,
        vUY = 33,
        EUY = 34,
        RSA = 35,
        kUY = 37,
        LUY = 38,
        RUY = 39,
        yUY = 42,
        Ee4 = 44,
        CUY = 45,
        mZ6 = 58,
        SUY = 61,
        hUY = 62,
        IUY = 63,
        xUY = 64,
        ke4 = 91,
        Le4 = 93,
        bUY = 96,
        Re4 = 123,
        uUY = 124,
        ye4 = 125,
        zG = {};
    zG[0] = "\\0";
    zG[7] = "\\a";
    zG[8] = "\\b";
    zG[9] = "\\t";
    zG[10] = "\\n";
    zG[11] = "\\v";
    zG[12] = "\\f";
    zG[13] = "\\r";
    zG[27] = "\\e";
    zG[34] = "\\\"";
    zG[92] = "\\\\";
    zG[133] = "\\N";
    zG[160] = "\\_";
    zG[8232] = "\\L";
    zG[8233] = "\\P";
    var BUY = ["y", "Y", "yes", "Yes", "YES", "on", "On", "ON", "n", "N", "no", "No", "NO", "off", "Off", "OFF"],
        mUY = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;

    function FUY(A, q) {
        var K, Y, z, w, H, $, O;
        if (q === null) return {};
        K = {}, Y = Object.keys(q);
        for (z = 0, w = Y.length; z < w; z += 1) {
            if (H = Y[z], $ = String(q[H]), H.slice(0, 2) === "!!") H = "tag:yaml.org,2002:" + H.slice(2);
            if (O = A.compiledTypeMap.fallback[H], O && ve4.call(O.styleAliases, $)) $ = O.styleAliases[$];
            K[H] = $
        }
        return K
    }

    function QUY(A) {
        var q, K, Y;
        if (q = A.toString(16).toUpperCase(), A <= 255) K = "x", Y = 2;
        else if (A <= 65535) K = "u", Y = 4;
        else if (A <= 4294967295) K = "U", Y = 8;
        else throw new EU1("code point within a string may not be greater than 0xFFFFFFFF");
        return "\\" + K + QZ6.repeat("0", Y - q.length) + q
    }
    var gUY = 1,
        TU1 = 2;

    function UUY(A) {
        this.schema = A.schema || fUY, this.indent = Math.max(1, A.indent || 2), this.noArrayIndent = A.noArrayIndent || !1, this.skipInvalid = A.skipInvalid || !1, this.flowLevel = QZ6.isNothing(A.flowLevel) ? -1 : A.flowLevel, this.styleMap = FUY(this.schema, A.styles || null), this.sortKeys = A.sortKeys || !1, this.lineWidth = A.lineWidth || 80, this.noRefs = A.noRefs || !1, this.noCompatMode = A.noCompatMode || !1, this.condenseFlow = A.condenseFlow || !1, this.quotingType = A.quotingType === '"' ? TU1 : gUY, this.forceQuotes = A.forceQuotes || !1, this.replacer = typeof A.replacer === "function" ? A.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null
    }

    function Me4(A, q) {
        var K = QZ6.repeat(" ", q),
            Y = 0,
            z = -1,
            w = "",
            H, $ = A.length;
        while (Y < $) {
            if (z = A.indexOf(`
`, Y), z === -1) H = A.slice(Y), Y = $;
            else H = A.slice(Y, z + 1), Y = z + 1;
            if (H.length && H !== `
`) w += K;
            w += H
        }
        return w
    }

    function ySA(A, q) {
        return `
` + QZ6.repeat(" ", A.indent * q)
    }

    function pUY(A, q) {
        var K, Y, z;
        for (K = 0, Y = A.implicitTypes.length; K < Y; K += 1)
            if (z = A.implicitTypes[K], z.resolve(q)) return !0;
        return !1
    }

    function FZ6(A) {
        return A === TUY || A === VUY
    }

    function vU1(A) {
        return 32 <= A && A <= 126 || 161 <= A && A <= 55295 && A !== 8232 && A !== 8233 || 57344 <= A && A <= 65533 && A !== hSA || 65536 <= A && A <= 1114111
    }

    function Pe4(A) {
        return vU1(A) && A !== hSA && A !== NUY && A !== NU1
    }

    function We4(A, q, K) {
        var Y = Pe4(A),
            z = Y && !FZ6(A);
        return (K ? Y : Y && A !== Ee4 && A !== ke4 && A !== Le4 && A !== Re4 && A !== ye4) && A !== RSA && !(q === mZ6 && !z) || Pe4(q) && !FZ6(q) && A === RSA || q === mZ6 && z
    }

    function dUY(A) {
        return vU1(A) && A !== hSA && !FZ6(A) && A !== CUY && A !== IUY && A !== mZ6 && A !== Ee4 && A !== ke4 && A !== Le4 && A !== Re4 && A !== ye4 && A !== RSA && A !== LUY && A !== yUY && A !== vUY && A !== uUY && A !== SUY && A !== hUY && A !== RUY && A !== EUY && A !== kUY && A !== xUY && A !== bUY
    }

    function cUY(A) {
        return !FZ6(A) && A !== mZ6
    }

    function VU1(A, q) {
        var K = A.charCodeAt(q),
            Y;
        if (K >= 55296 && K <= 56319 && q + 1 < A.length) {
            if (Y = A.charCodeAt(q + 1), Y >= 56320 && Y <= 57343) return (K - 55296) * 1024 + Y - 56320 + 65536
        }
        return K
    }

    function Ce4(A) {
        var q = /^\n* /;
        return q.test(A)
    }
    var Se4 = 1,
        CSA = 2,
        he4 = 3,
        Ie4 = 4,
        SG1 = 5;

    function lUY(A, q, K, Y, z, w, H, $) {
        var O, _ = 0,
            J = null,
            X = !1,
            D = !1,
            j = Y !== -1,
            M = -1,
            P = dUY(VU1(A, 0)) && cUY(VU1(A, A.length - 1));
        if (q || H)
            for (O = 0; O < A.length; _ >= 65536 ? O += 2 : O++) {
                if (_ = VU1(A, O), !vU1(_)) return SG1;
                P = P && We4(_, J, $), J = _
            } else {
                for (O = 0; O < A.length; _ >= 65536 ? O += 2 : O++) {
                    if (_ = VU1(A, O), _ === NU1) {
                        if (X = !0, j) D = D || O - M - 1 > Y && A[M + 1] !== " ", M = O
                    } else if (!vU1(_)) return SG1;
                    P = P && We4(_, J, $), J = _
                }
                D = D || j && (O - M - 1 > Y && A[M + 1] !== " ")
            }
        if (!X && !D) {
            if (P && !H && !z(A)) return Se4;
            return w === TU1 ? SG1 : CSA
        }
        if (K > 9 && Ce4(A)) return SG1;
        if (!H) return D ? Ie4 : he4;
        return w === TU1 ? SG1 : CSA
    }

    function iUY(A, q, K, Y, z) {
        A.dump = function() {
            if (q.length === 0) return A.quotingType === TU1 ? '""' : "''";
            if (!A.noCompatMode) {
                if (BUY.indexOf(q) !== -1 || mUY.test(q)) return A.quotingType === TU1 ? '"' + q + '"' : "'" + q + "'"
            }
            var w = A.indent * Math.max(1, K),
                H = A.lineWidth === -1 ? -1 : Math.max(Math.min(A.lineWidth, 40), A.lineWidth - w),
                $ = Y || A.flowLevel > -1 && K >= A.flowLevel;

            function O(_) {
                return pUY(A, _)
            }
            switch (lUY(q, $, A.indent, H, O, A.quotingType, A.forceQuotes && !Y, z)) {
                case Se4:
                    return q;
                case CSA:
                    return "'" + q.replace(/'/g, "''") + "'";
                case he4:
                    return "|" + Ge4(q, A.indent) + Ze4(Me4(q, w));
                case Ie4:
                    return ">" + Ge4(q, A.indent) + Ze4(Me4(nUY(q, H), w));
                case SG1:
                    return '"' + rUY(q, H) + '"';
                default:
                    throw new EU1("impossible error: invalid scalar style")
            }
        }()
    }

    function Ge4(A, q) {
        var K = Ce4(A) ? String(q) : "",
            Y = A[A.length - 1] === `
`,
            z = Y && (A[A.length - 2] === `
` || A === `
`),
            w = z ? "+" : Y ? "" : "-";
        return K + w + `
`
    }

    function Ze4(A) {
        return A[A.length - 1] === `
` ? A.slice(0, -1) : A
    }

    function nUY(A, q) {
        var K = /(\n+)([^\n]*)/g,
            Y = function() {
                var _ = A.indexOf(`
`);
                return _ = _ !== -1 ? _ : A.length, K.lastIndex = _, fe4(A.slice(0, _), q)
            }(),
            z = A[0] === `
` || A[0] === " ",
            w, H;
        while (H = K.exec(A)) {
            var $ = H[1],
                O = H[2];
            w = O[0] === " ", Y += $ + (!z && !w && O !== "" ? `
` : "") + fe4(O, q), z = w
        }
        return Y
    }

    function fe4(A, q) {
        if (A === "" || A[0] === " ") return A;
        var K = / [^ ]/g,
            Y, z = 0,
            w, H = 0,
            $ = 0,
            O = "";
        while (Y = K.exec(A)) {
            if ($ = Y.index, $ - z > q) w = H > z ? H : $, O += `
` + A.slice(z, w), z = w + 1;
            H = $
        }
        if (O += `
`, A.length - z > q && H > z) O += A.slice(z, H) + `
` + A.slice(H + 1);
        else O += A.slice(z);
        return O.slice(1)
    }

    function rUY(A) {
        var q = "",
            K = 0,
            Y;
        for (var z = 0; z < A.length; K >= 65536 ? z += 2 : z++)
            if (K = VU1(A, z), Y = zG[K], !Y && vU1(K)) {
                if (q += A[z], K >= 65536) q += A[z + 1]
            } else q += Y || QUY(K);
        return q
    }

    function oUY(A, q, K) {
        var Y = "",
            z = A.tag,
            w, H, $;
        for (w = 0, H = K.length; w < H; w += 1) {
            if ($ = K[w], A.replacer) $ = A.replacer.call(K, String(w), $);
            if (qc(A, q, $, !1, !1) || typeof $ > "u" && qc(A, q, null, !1, !1)) {
                if (Y !== "") Y += "," + (!A.condenseFlow ? " " : "");
                Y += A.dump
            }
        }
        A.tag = z, A.dump = "[" + Y + "]"
    }

    function Ve4(A, q, K, Y) {
        var z = "",
            w = A.tag,
            H, $, O;
        for (H = 0, $ = K.length; H < $; H += 1) {
            if (O = K[H], A.replacer) O = A.replacer.call(K, String(H), O);
            if (qc(A, q + 1, O, !0, !0, !1, !0) || typeof O > "u" && qc(A, q + 1, null, !0, !0, !1, !0)) {
                if (!Y || z !== "") z += ySA(A, q);
                if (A.dump && NU1 === A.dump.charCodeAt(0)) z += "-";
                else z += "- ";
                z += A.dump
            }
        }
        A.tag = w, A.dump = z || "[]"
    }

    function aUY(A, q, K) {
        var Y = "",
            z = A.tag,
            w = Object.keys(K),
            H, $, O, _, J;
        for (H = 0, $ = w.length; H < $; H += 1) {
            if (J = "", Y !== "") J += ", ";
            if (A.condenseFlow) J += '"';
            if (O = w[H], _ = K[O], A.replacer) _ = A.replacer.call(K, O, _);
            if (!qc(A, q, O, !1, !1)) continue;
            if (A.dump.length > 1024) J += "? ";
            if (J += A.dump + (A.condenseFlow ? '"' : "") + ":" + (A.condenseFlow ? "" : " "), !qc(A, q, _, !1, !1)) continue;
            J += A.dump, Y += J
        }
        A.tag = z, A.dump = "{" + Y + "}"
    }

    function sUY(A, q, K, Y) {
        var z = "",
            w = A.tag,
            H = Object.keys(K),
            $, O, _, J, X, D;
        if (A.sortKeys === !0) H.sort();
        else if (typeof A.sortKeys === "function") H.sort(A.sortKeys);
        else if (A.sortKeys) throw new EU1("sortKeys must be a boolean or a function");
        for ($ = 0, O = H.length; $ < O; $ += 1) {
            if (D = "", !Y || z !== "") D += ySA(A, q);
            if (_ = H[$], J = K[_], A.replacer) J = A.replacer.call(K, _, J);
            if (!qc(A, q + 1, _, !0, !0, !0)) continue;
            if (X = A.tag !== null && A.tag !== "?" || A.dump && A.dump.length > 1024, X)
                if (A.dump && NU1 === A.dump.charCodeAt(0)) D += "?";
                else D += "? ";
            if (D += A.dump, X) D += ySA(A, q);
            if (!qc(A, q + 1, J, !0, X)) continue;
            if (A.dump && NU1 === A.dump.charCodeAt(0)) D += ":";
            else D += ": ";
            D += A.dump, z += D
        }
        A.tag = w, A.dump = z || "{}"
    }

    function Ne4(A, q, K) {
        var Y, z, w, H, $, O;
        z = K ? A.explicitTypes : A.implicitTypes;
        for (w = 0, H = z.length; w < H; w += 1)
            if ($ = z[w], ($.instanceOf || $.predicate) && (!$.instanceOf || typeof q === "object" && q instanceof $.instanceOf) && (!$.predicate || $.predicate(q))) {
                if (K)
                    if ($.multi && $.representName) A.tag = $.representName(q);
                    else A.tag = $.tag;
                else A.tag = "?";
                if ($.represent) {
                    if (O = A.styleMap[$.tag] || $.defaultStyle, Te4.call($.represent) === "[object Function]") Y = $.represent(q, O);
                    else if (ve4.call($.represent, O)) Y = $.represent[O](q, O);
                    else throw new EU1("!<" + $.tag + '> tag resolver accepts not "' + O + '" style');
                    A.dump = Y
                }
                return !0
            } return !1
    }

    function qc(A, q, K, Y, z, w, H) {
        if (A.tag = null, A.dump = K, !Ne4(A, K, !1)) Ne4(A, K, !0);
        var $ = Te4.call(A.dump),
            O = Y,
            _;
        if (Y) Y = A.flowLevel < 0 || A.flowLevel > q;
        var J = $ === "[object Object]" || $ === "[object Array]",
            X, D;
        if (J) X = A.duplicates.indexOf(K), D = X !== -1;
        if (A.tag !== null && A.tag !== "?" || D || A.indent !== 2 && q > 0) z = !1;
        if (D && A.usedDuplicates[X]) A.dump = "*ref_" + X;
        else {
            if (J && D && !A.usedDuplicates[X]) A.usedDuplicates[X] = !0;
            if ($ === "[object Object]") {
                if (Y && Object.keys(A.dump).length !== 0) {
                    if (sUY(A, q, A.dump, z), D) A.dump = "&ref_" + X + A.dump
                } else if (aUY(A, q, A.dump), D) A.dump = "&ref_" + X + " " + A.dump
            } else if ($ === "[object Array]") {
                if (Y && A.dump.length !== 0) {
                    if (A.noArrayIndent && !H && q > 0) Ve4(A, q - 1, A.dump, z);
                    else Ve4(A, q, A.dump, z);
                    if (D) A.dump = "&ref_" + X + A.dump
                } else if (oUY(A, q, A.dump), D) A.dump = "&ref_" + X + " " + A.dump
            } else if ($ === "[object String]") {
                if (A.tag !== "?") iUY(A, A.dump, q, w, O)
            } else if ($ === "[object Undefined]") return !1;
            else {
                if (A.skipInvalid) return !1;
                throw new EU1("unacceptable kind of an object to dump " + $)
            }
            if (A.tag !== null && A.tag !== "?") {
                if (_ = encodeURI(A.tag[0] === "!" ? A.tag.slice(1) : A.tag).replace(/!/g, "%21"), A.tag[0] === "!") _ = "!" + _;
                else if (_.slice(0, 18) === "tag:yaml.org,2002:") _ = "!!" + _.slice(18);
                else _ = "!<" + _ + ">";
                A.dump = _ + " " + A.dump
            }
        }
        return !0
    }

    function tUY(A, q) {
        var K = [],
            Y = [],
            z, w;
        SSA(A, K, Y);
        for (z = 0, w = Y.length; z < w; z += 1) q.duplicates.push(K[Y[z]]);
        q.usedDuplicates = Array(w)
    }

    function SSA(A, q, K) {
        var Y, z, w;
        if (A !== null && typeof A === "object")
            if (z = q.indexOf(A), z !== -1) {
                if (K.indexOf(z) === -1) K.push(z)
            } else if (q.push(A), Array.isArray(A))
            for (z = 0, w = A.length; z < w; z += 1) SSA(A[z], q, K);
        else {
            Y = Object.keys(A);
            for (z = 0, w = Y.length; z < w; z += 1) SSA(A[Y[z]], q, K)
        }
    }

    function eUY(A, q) {
        q = q || {};
        var K = new UUY(q);
        if (!K.noRefs) tUY(A, K);
        var Y = A;
        if (K.replacer) Y = K.replacer.call({
            "": Y
        }, "", Y);
        if (qc(K, 0, Y, !0, !0)) return K.dump + `
`;
        return ""
    }
    ApY.dump = eUY
})
// @from(Ln 377636, Col 4)
xSA = R((YpY, rZ) => {
    var ue4 = je4(),
        KpY = be4();

    function ISA(A, q) {
        return function() {
            throw Error("Function yaml." + A + " is removed in js-yaml 4. Use yaml." + q + " instead, which is now safe by default.")
        }
    }
    YpY.Type = YG();
    YpY.Schema = $SA();
    YpY.FAILSAFE_SCHEMA = XSA();
    YpY.JSON_SCHEMA = hZ6();
    YpY.CORE_SCHEMA = hZ6();
    YpY.DEFAULT_SCHEMA = IZ6();
    YpY.load = ue4.load;
    YpY.loadAll = ue4.loadAll;
    YpY.dump = KpY.dump;
    YpY.YAMLException = LG1();
    YpY.types = {
        binary: fSA(),
        float: PSA(),
        map: JSA(),
        null: DSA(),
        pairs: NSA(),
        set: TSA(),
        timestamp: WSA(),
        bool: jSA(),
        int: MSA(),
        merge: GSA(),
        omap: VSA(),
        seq: _SA(),
        str: OSA()
    };
    YpY.safeLoad = ISA("safeLoad", "load");
    YpY.safeLoadAll = ISA("safeLoadAll", "loadAll");
    YpY.safeDump = ISA("safeDump", "dump")
})
// @from(Ln 377674, Col 4)
me4 = R((XyH, Be4) => {
    var {
        ParserError: ZpY
    } = hI(), fpY = xSA(), {
        JSON_SCHEMA: VpY
    } = xSA();
    Be4.exports = {
        order: 200,
        allowEmpty: !0,
        canParse: [".yaml", ".yml", ".json"],
        async parse(A) {
            let q = A.data;
            if (Buffer.isBuffer(q)) q = q.toString();
            if (typeof q === "string") try {
                return fpY.load(q, {
                    schema: VpY
                })
            } catch (K) {
                throw new ZpY(K.message, A.url)
            } else return q
        }
    }
})
// @from(Ln 377697, Col 4)
Qe4 = R((DyH, Fe4) => {
    var {
        ParserError: NpY
    } = hI(), TpY = /\.(txt|htm|html|md|xml|js|min|map|css|scss|less|svg)$/i;
    Fe4.exports = {
        order: 300,
        allowEmpty: !0,
        encoding: "utf8",
        canParse(A) {
            return (typeof A.data === "string" || Buffer.isBuffer(A.data)) && TpY.test(A.url)
        },
        parse(A) {
            if (typeof A.data === "string") return A.data;
            else if (Buffer.isBuffer(A.data)) return A.data.toString(this.encoding);
            else throw new NpY("data is not text", A.url)
        }
    }
})
// @from(Ln 377715, Col 4)
Ue4 = R((jyH, ge4) => {
    var vpY = /\.(jpeg|jpg|gif|png|bmp|ico)$/i;
    ge4.exports = {
        order: 400,
        allowEmpty: !0,
        canParse(A) {
            return Buffer.isBuffer(A.data) && vpY.test(A.url)
        },
        parse(A) {
            if (Buffer.isBuffer(A.data)) return A.data;
            else return Buffer.from(A.data)
        }
    }
})
// @from(Ln 377729, Col 4)
ce4 = R((MyH, de4) => {
    var EpY = h1("fs"),
        {
            ono: bSA
        } = gt(),
        pe4 = zy(),
        {
            ResolverError: uSA
        } = hI();
    de4.exports = {
        order: 100,
        canRead(A) {
            return pe4.isFileSystemPath(A.url)
        },
        read(A) {
            return new Promise((q, K) => {
                let Y;
                try {
                    Y = pe4.toFileSystemPath(A.url)
                } catch (z) {
                    K(new uSA(bSA.uri(z, `Malformed URI: ${A.url}`), A.url))
                }
                try {
                    EpY.readFile(Y, (z, w) => {
                        if (z) K(new uSA(bSA(z, `Error opening file "${Y}"`), Y));
                        else q(w)
                    })
                } catch (z) {
                    K(new uSA(bSA(z, `Error opening file "${Y}"`), Y))
                }
            })
        }
    }
})
// @from(Ln 377763, Col 4)
re4 = R((PyH, ne4) => {
    var kpY = h1("http"),
        LpY = h1("https"),
        {
            ono: gZ6
        } = gt(),
        UZ6 = zy(),
        {
            ResolverError: le4
        } = hI();
    ne4.exports = {
        order: 200,
        headers: null,
        timeout: 5000,
        redirects: 5,
        withCredentials: !1,
        canRead(A) {
            return UZ6.isHttp(A.url)
        },
        read(A) {
            let q = UZ6.parse(A.url);
            return ie4(q, this)
        }
    };

    function ie4(A, q, K) {
        return new Promise((Y, z) => {
            A = UZ6.parse(A), K = K || [], K.push(A.href), RpY(A, q).then((w) => {
                if (w.statusCode >= 400) throw gZ6({
                    status: w.statusCode
                }, `HTTP ERROR ${w.statusCode}`);
                else if (w.statusCode >= 300)
                    if (K.length > q.redirects) z(new le4(gZ6({
                        status: w.statusCode
                    }, `Error downloading ${K[0]}. 
Too many redirects: 
  ${K.join(` 
  `)}`)));
                    else if (!w.headers.location) throw gZ6({
                    status: w.statusCode
                }, `HTTP ${w.statusCode} redirect with no location header`);
                else {
                    let H = UZ6.resolve(A, w.headers.location);
                    ie4(H, q, K).then(Y, z)
                } else Y(w.body || Buffer.alloc(0))
            }).catch((w) => {
                z(new le4(gZ6(w, `Error downloading ${A.href}`), A.href))
            })
        })
    }

    function RpY(A, q) {
        return new Promise((K, Y) => {
            let w = (A.protocol === "https:" ? LpY : kpY).get({
                hostname: A.hostname,
                port: A.port,
                path: A.path,
                auth: A.auth,
                protocol: A.protocol,
                headers: q.headers || {},
                withCredentials: q.withCredentials
            });
            if (typeof w.setTimeout === "function") w.setTimeout(q.timeout);
            w.on("timeout", () => {
                w.abort()
            }), w.on("error", Y), w.once("response", (H) => {
                H.body = Buffer.alloc(0), H.on("data", ($) => {
                    H.body = Buffer.concat([H.body, Buffer.from($)])
                }), H.on("error", Y), H.on("end", () => {
                    K(H)
                })
            })
        })
    }
})
// @from(Ln 377838, Col 4)
se4 = R((WyH, ae4) => {
    var ypY = vt4(),
        CpY = me4(),
        SpY = Qe4(),
        hpY = Ue4(),
        IpY = ce4(),
        xpY = re4();
    ae4.exports = mSA;

    function mSA(A) {
        BSA(this, mSA.defaults), BSA(this, A)
    }
    mSA.defaults = {
        parse: {
            json: ypY,
            yaml: CpY,
            text: SpY,
            binary: hpY
        },
        resolve: {
            file: IpY,
            http: xpY,
            external: !0
        },
        continueOnError: !1,
        dereference: {
            circular: !0,
            excludedPathMatcher: () => !1
        }
    };

    function BSA(A, q) {
        if (oe4(q)) {
            let K = Object.keys(q);
            for (let Y = 0; Y < K.length; Y++) {
                let z = K[Y],
                    w = q[z],
                    H = A[z];
                if (oe4(w)) A[z] = BSA(H || {}, w);
                else if (w !== void 0) A[z] = w
            }
        }
        return A
    }

    function oe4(A) {
        return A && typeof A === "object" && !Array.isArray(A) && !(A instanceof RegExp) && !(A instanceof Date)
    }
})
// @from(Ln 377887, Col 4)
A1q = R((GyH, ee4) => {
    var te4 = se4();
    ee4.exports = bpY;

    function bpY(A) {
        let q, K, Y, z;
        if (A = Array.prototype.slice.call(A), typeof A[A.length - 1] === "function") z = A.pop();
        if (typeof A[0] === "string")
            if (q = A[0], typeof A[2] === "object") K = A[1], Y = A[2];
            else K = void 0, Y = A[1];
        else q = "", K = A[0], Y = A[1];
        if (!(Y instanceof te4)) Y = new te4(Y);
        return {
            path: q,
            schema: K,
            options: Y,
            callback: z
        }
    }
})
// @from(Ln 377907, Col 4)
z1q = R((ZyH, Y1q) => {
    var q1q = EG1(),
        upY = WU1(),
        BpY = KSA(),
        kU1 = zy(),
        {
            isHandledError: mpY
        } = hI();
    Y1q.exports = FpY;

    function FpY(A, q) {
        if (!q.resolve.external) return Promise.resolve();
        try {
            let K = FSA(A.schema, A.$refs._root$Ref.path + "#", A.$refs, q);
            return Promise.all(K)
        } catch (K) {
            return Promise.reject(K)
        }
    }

    function FSA(A, q, K, Y, z) {
        z = z || new Set;
        let w = [];
        if (A && typeof A === "object" && !ArrayBuffer.isView(A) && !z.has(A))
            if (z.add(A), q1q.isExternal$Ref(A)) w.push(K1q(A, q, K, Y));
            else
                for (let H of Object.keys(A)) {
                    let $ = upY.join(q, H),
                        O = A[H];
                    if (q1q.isExternal$Ref(O)) w.push(K1q(O, $, K, Y));
                    else w = w.concat(FSA(O, $, K, Y, z))
                }
        return w
    }
    async function K1q(A, q, K, Y) {
        let z = kU1.resolve(q, A.$ref),
            w = kU1.stripHash(z);
        if (A = K._$refs[w], A) return Promise.resolve(A.value);
        try {
            let H = await BpY(z, K, Y),
                $ = FSA(H, w + "#", K, Y);
            return Promise.all($)
        } catch (H) {
            if (!Y.continueOnError || !mpY(H)) throw H;
            if (K._$refs[w]) H.source = decodeURI(kU1.stripHash(q)), H.path = kU1.safePointerToPath(kU1.getHash(q));
            return []
        }
    }
})
// @from(Ln 377956, Col 4)
$1q = R((fyH, H1q) => {
    var pZ6 = EG1(),
        LU1 = WU1(),
        QSA = zy();
    H1q.exports = QpY;

    function QpY(A, q) {
        let K = [];
        gSA(A, "schema", A.$refs._root$Ref.path + "#", "#", 0, K, A.$refs, q), gpY(K)
    }

    function gSA(A, q, K, Y, z, w, H, $) {
        let O = q === null ? A : A[q];
        if (O && typeof O === "object" && !ArrayBuffer.isView(O))
            if (pZ6.isAllowed$Ref(O)) w1q(A, q, K, Y, z, w, H, $);
            else {
                let _ = Object.keys(O).sort((J, X) => {
                    if (J === "definitions") return -1;
                    else if (X === "definitions") return 1;
                    else return J.length - X.length
                });
                for (let J of _) {
                    let X = LU1.join(K, J),
                        D = LU1.join(Y, J),
                        j = O[J];
                    if (pZ6.isAllowed$Ref(j)) w1q(O, J, K, D, z, w, H, $);
                    else gSA(O, J, X, D, z, w, H, $)
                }
            }
    }

    function w1q(A, q, K, Y, z, w, H, $) {
        let O = q === null ? A : A[q],
            _ = QSA.resolve(K, O.$ref),
            J = H._resolve(_, Y, $);
        if (J === null) return;
        let X = LU1.parse(Y).length,
            D = QSA.stripHash(J.path),
            j = QSA.getHash(J.path),
            M = D !== H._root$Ref.path,
            P = pZ6.isExtended$Ref(O);
        z += J.indirections;
        let W = UpY(w, A, q);
        if (W)
            if (X < W.depth || z < W.indirections) ppY(w, W);
            else return;
        if (w.push({
                $ref: O,
                parent: A,
                key: q,
                pathFromRoot: Y,
                depth: X,
                file: D,
                hash: j,
                value: J.value,
                circular: J.circular,
                extended: P,
                external: M,
                indirections: z
            }), !W) gSA(J.value, null, J.path, Y, z + 1, w, H, $)
    }

    function gpY(A) {
        A.sort((z, w) => {
            if (z.file !== w.file) return z.file < w.file ? -1 : 1;
            else if (z.hash !== w.hash) return z.hash < w.hash ? -1 : 1;
            else if (z.circular !== w.circular) return z.circular ? -1 : 1;
            else if (z.extended !== w.extended) return z.extended ? 1 : -1;
            else if (z.indirections !== w.indirections) return z.indirections - w.indirections;
            else if (z.depth !== w.depth) return z.depth - w.depth;
            else {
                let H = z.pathFromRoot.lastIndexOf("/definitions"),
                    $ = w.pathFromRoot.lastIndexOf("/definitions");
                if (H !== $) return $ - H;
                else return z.pathFromRoot.length - w.pathFromRoot.length
            }
        });
        let q, K, Y;
        for (let z of A)
            if (!z.external) z.$ref.$ref = z.hash;
            else if (z.file === q && z.hash === K) z.$ref.$ref = Y;
        else if (z.file === q && z.hash.indexOf(K + "/") === 0) z.$ref.$ref = LU1.join(Y, LU1.parse(z.hash.replace(K, "#")));
        else if (q = z.file, K = z.hash, Y = z.pathFromRoot, z.$ref = z.parent[z.key] = pZ6.dereference(z.$ref, z.value), z.circular) z.$ref.$ref = z.pathFromRoot
    }

    function UpY(A, q, K) {
        for (let Y = 0; Y < A.length; Y++) {
            let z = A[Y];
            if (z.parent === q && z.key === K) return z
        }
    }

    function ppY(A, q) {
        let K = A.indexOf(q);
        A.splice(K, 1)
    }
})
// @from(Ln 378053, Col 4)
D1q = R((VyH, X1q) => {
    var USA = EG1(),
        O1q = WU1(),
        {
            ono: dpY
        } = gt(),
        cpY = zy();
    X1q.exports = lpY;

    function lpY(A, q) {
        let K = pSA(A.schema, A.$refs._root$Ref.path, "#", new Set, new Set, new Map, A.$refs, q);
        A.$refs.circular = K.circular, A.schema = K.value
    }

    function pSA(A, q, K, Y, z, w, H, $) {
        let O, _ = {
                value: A,
                circular: !1
            },
            J = $.dereference.excludedPathMatcher;
        if ($.dereference.circular === "ignore" || !z.has(A)) {
            if (A && typeof A === "object" && !ArrayBuffer.isView(A) && !J(K)) {
                if (Y.add(A), z.add(A), USA.isAllowed$Ref(A, $)) O = _1q(A, q, K, Y, z, w, H, $), _.circular = O.circular, _.value = O.value;
                else
                    for (let X of Object.keys(A)) {
                        let D = O1q.join(q, X),
                            j = O1q.join(K, X);
                        if (J(j)) continue;
                        let M = A[X],
                            P = !1;
                        if (USA.isAllowed$Ref(M, $)) {
                            if (O = _1q(M, D, j, Y, z, w, H, $), P = O.circular, A[X] !== O.value) A[X] = O.value
                        } else if (!Y.has(M)) {
                            if (O = pSA(M, D, j, Y, z, w, H, $), P = O.circular, A[X] !== O.value) A[X] = O.value
                        } else P = J1q(D, H, $);
                        _.circular = _.circular || P
                    }
                Y.delete(A)
            }
        }
        return _
    }

    function _1q(A, q, K, Y, z, w, H, $) {
        let O = cpY.resolve(q, A.$ref),
            _ = w.get(O);
        if (_) {
            let P = Object.keys(A);
            if (P.length > 1) {
                let W = {};
                for (let G of P)
                    if (G !== "$ref" && !(G in _.value)) W[G] = A[G];
                return {
                    circular: _.circular,
                    value: Object.assign({}, _.value, W)
                }
            }
            return _
        }
        let J = H._resolve(O, q, $);
        if (J === null) return {
            circular: !1,
            value: null
        };
        let X = J.circular,
            D = X || Y.has(J.value);
        D && J1q(q, H, $);
        let j = USA.dereference(A, J.value);
        if (!D) {
            let P = pSA(j, J.path, K, Y, z, w, H, $);
            D = P.circular, j = P.value
        }
        if (D && !X && $.dereference.circular === "ignore") j = A;
        if (X) j.$ref = K;
        let M = {
            circular: D,
            value: j
        };
        if (Object.keys(A).length === 1) w.set(O, M);
        return M
    }

    function J1q(A, q, K) {
        if (q.circular = !0, !K.dereference.circular) throw dpY.reference(`Circular $ref pointer found at ${A}`);
        return !0
    }
})
// @from(Ln 378140, Col 4)
M1q = R((NyH, j1q) => {
    function ipY() {
        if (typeof process === "object" && typeof process.nextTick === "function") return process.nextTick;
        else if (typeof setImmediate === "function") return setImmediate;
        else return function(q) {
            setTimeout(q, 0)
        }
    }
    j1q.exports = ipY()
})
// @from(Ln 378150, Col 4)
G1q = R((TyH, W1q) => {
    var P1q = M1q();
    W1q.exports = function(q, K) {
        if (q) {
            K.then(function(Y) {
                P1q(function() {
                    q(null, Y)
                })
            }, function(Y) {
                P1q(function() {
                    q(Y)
                })
            });
            return
        } else return K
    }
})
// @from(Ln 378167, Col 4)
N1q = R((vyH, cm) => {
    var V1q = Pt4(),
        npY = KSA(),
        dZ6 = A1q(),
        rpY = z1q(),
        opY = $1q(),
        apY = D1q(),
        hG1 = zy(),
        {
            JSONParserError: spY,
            InvalidPointerError: tpY,
            MissingPointerError: epY,
            ResolverError: AdY,
            ParserError: qdY,
            UnmatchedParserError: KdY,
            UnmatchedResolverError: YdY,
            isHandledError: zdY,
            JSONParserErrorGroup: Z1q
        } = hI(),
        xI = G1q(),
        {
            ono: f1q
        } = gt();
    cm.exports = dm;
    cm.exports.default = dm;
    cm.exports.JSONParserError = spY;
    cm.exports.InvalidPointerError = tpY;
    cm.exports.MissingPointerError = epY;
    cm.exports.ResolverError = AdY;
    cm.exports.ParserError = qdY;
    cm.exports.UnmatchedParserError = KdY;
    cm.exports.UnmatchedResolverError = YdY;

    function dm() {
        this.schema = null, this.$refs = new V1q
    }
    dm.parse = function(q, K, Y, z) {
        let H = new this;
        return H.parse.apply(H, arguments)
    };
    dm.prototype.parse = async function(q, K, Y, z) {
        let w = dZ6(arguments),
            H;
        if (!w.path && !w.schema) {
            let _ = f1q(`Expected a file path, URL, or object. Got ${w.path||w.schema}`);
            return xI(w.callback, Promise.reject(_))
        }
        this.schema = null, this.$refs = new V1q;
        let $ = "http";
        if (hG1.isFileSystemPath(w.path)) w.path = hG1.fromFileSystemPath(w.path), $ = "file";
        if (w.path = hG1.resolve(hG1.cwd(), w.path), w.schema && typeof w.schema === "object") {
            let _ = this.$refs._add(w.path);
            _.value = w.schema, _.pathType = $, H = Promise.resolve(w.schema)
        } else H = npY(w.path, this.$refs, w.options);
        let O = this;
        try {
            let _ = await H;
            if (_ !== null && typeof _ === "object" && !Buffer.isBuffer(_)) return O.schema = _, xI(w.callback, Promise.resolve(O.schema));
            else if (w.options.continueOnError) return O.schema = null, xI(w.callback, Promise.resolve(O.schema));
            else throw f1q.syntax(`"${O.$refs._root$Ref.path||_}" is not a valid JSON Schema`)
        } catch (_) {
            if (!w.options.continueOnError || !zdY(_)) return xI(w.callback, Promise.reject(_));
            if (this.$refs._$refs[hG1.stripHash(w.path)]) this.$refs._$refs[hG1.stripHash(w.path)].addError(_);
            return xI(w.callback, Promise.resolve(null))
        }
    };
    dm.resolve = function(q, K, Y, z) {
        let H = new this;
        return H.resolve.apply(H, arguments)
    };
    dm.prototype.resolve = async function(q, K, Y, z) {
        let w = this,
            H = dZ6(arguments);
        try {
            return await this.parse(H.path, H.schema, H.options), await rpY(w, H.options), dSA(w), xI(H.callback, Promise.resolve(w.$refs))
        } catch ($) {
            return xI(H.callback, Promise.reject($))
        }
    };
    dm.bundle = function(q, K, Y, z) {
        let H = new this;
        return H.bundle.apply(H, arguments)
    };
    dm.prototype.bundle = async function(q, K, Y, z) {
        let w = this,
            H = dZ6(arguments);
        try {
            return await this.resolve(H.path, H.schema, H.options), opY(w, H.options), dSA(w), xI(H.callback, Promise.resolve(w.schema))
        } catch ($) {
            return xI(H.callback, Promise.reject($))
        }
    };
    dm.dereference = function(q, K, Y, z) {
        let H = new this;
        return H.dereference.apply(H, arguments)
    };
    dm.prototype.dereference = async function(q, K, Y, z) {
        let w = this,
            H = dZ6(arguments);
        try {
            return await this.resolve(H.path, H.schema, H.options), apY(w, H.options), dSA(w), xI(H.callback, Promise.resolve(w.schema))
        } catch ($) {
            return xI(H.callback, Promise.reject($))
        }
    };

    function dSA(A) {
        if (Z1q.getParserErrors(A).length > 0) throw new Z1q(A)
    }
})
// @from(Ln 378278, Col 0)
function ot({
    mainThreadAgentDefinition: A,
    toolUseContext: q,
    customSystemPrompt: K,
    defaultSystemPrompt: Y,
    appendSystemPrompt: z,
    overrideSystemPrompt: w
}) {
    if (w) return [w];
    let H = A ? iD(A) ? A.getSystemPrompt({
        toolUseContext: {
            options: q.options
        }
    }) : A.getSystemPrompt() : void 0;
    if (A?.memory) c("tengu_agent_memory_loaded", {
        ...{},
        scope: A.memory,
        source: "main-thread"
    });
    return [...H ? [H] : K ? [K] : Y, ...z ? [z] : []]
}
// @from(Ln 378299, Col 4)
cZ6 = v(() => {
    uv();
    u6();
    hA()
})
// @from(Ln 378304, Col 0)
async function RU1(A, q) {
    try {
        let K = await hx1(A, q);
        if (K !== null) return K;
        h(`countTokensWithFallback: API returned null, trying haiku fallback (${q.length} tools)`)
    } catch (K) {
        h(`countTokensWithFallback: API failed: ${K instanceof Error?K.message:String(K)}`), K1(K instanceof Error ? K : Error(String(K)))
    }
    try {
        let K = await HL7(A, q);
        if (K === null) h(`countTokensWithFallback: haiku fallback also returned null (${q.length} tools)`);
        return K
    } catch (K) {
        return h(`countTokensWithFallback: haiku fallback failed: ${K instanceof Error?K.message:String(K)}`), K1(K instanceof Error ? K : Error(String(K))), null
    }
}
// @from(Ln 378320, Col 0)
async function Kc(A, q, K, Y) {
    let z = await Promise.all(A.map((H) => nZ6(H, {
            getToolPermissionContext: q,
            tools: A,
            agents: K?.activeAgents ?? [],
            model: Y
        }))),
        w = await RU1([], z);
    if (w === null || w === 0) {
        let H = A.map(($) => $.name).join(", ");
        h(`countToolDefinitionTokens returned ${w} for ${A.length} tools: ${H.slice(0,100)}${H.length>100?"...":""}`)
    }
    return w ?? 0
}
// @from(Ln 378334, Col 0)
async function wdY(A) {
    let q = await l$(),
        K = [...A, ...Object.values(q)];
    if (K.length < 1) return 0;
    return (await Promise.all(K.filter((z) => z.length > 0).map((z) => RU1([{
        role: "user",
        content: z
    }], [])))).reduce((z, w) => z + (w || 0), 0)
}
// @from(Ln 378343, Col 0)
async function HdY() {
    let A = I_(),
        q = [],
        K = 0;
    if (A.length < 1) return {
        memoryFileDetails: [],
        claudeMdTokens: 0
    };
    let Y = await Promise.all(A.map(async (z) => {
        let w = await RU1([{
            role: "user",
            content: z.content
        }], []);
        return {
            file: z,
            tokens: w || 0
        }
    }));
    for (let {
            file: z,
            tokens: w
        }
        of Y) K += w, q.push({
        path: z.path,
        type: z.type,
        tokens: w
    });
    return {
        claudeMdTokens: K,
        memoryFileDetails: q
    }
}
// @from(Ln 378375, Col 0)
async function $dY(A, q, K, Y, z) {
    let w = A.filter((P) => !P.isMcp);
    if (w.length < 1) return {
        builtInToolTokens: 0,
        deferredBuiltinDetails: [],
        deferredBuiltinTokens: 0
    };
    let {
        isToolSearchEnabled: H
    } = await Promise.resolve().then(() => (oL(), iSA)), {
        isDeferredTool: $
    } = await Promise.resolve().then(() => (la(), cp7)), O = await H(Y ?? "", A, q, K?.activeAgents ?? [], "analyzeBuiltIn"), _ = w.filter((P) => !$(P)), J = w.filter((P) => $(P)), X = _.length > 0 ? await Kc(_, q, K, Y) : 0, D = [], j = 0, M = 0;
    if (J.length > 0 && O) {
        let P = new Set;
        if (z) {
            let G = new Set(J.map((f) => f.name));
            for (let f of z)
                if (f.type === "assistant") {
                    for (let Z of f.message.content)
                        if ("type" in Z && Z.type === "tool_use" && "name" in Z && typeof Z.name === "string" && G.has(Z.name)) P.add(Z.name)
                }
        }
        let W = await Promise.all(J.map((G) => Kc([G], q, K, Y)));
        for (let [G, f] of J.entries()) {
            let Z = Math.max(0, (W[G] || 0) - lZ6),
                N = P.has(f.name);
            if (D.push({
                    name: f.name,
                    tokens: Z,
                    isLoaded: N
                }), M += Z, N) j += Z
        }
    } else if (J.length > 0) {
        let P = await Kc(J, q, K, Y);
        return {
            builtInToolTokens: X + P,
            deferredBuiltinDetails: [],
            deferredBuiltinTokens: 0
        }
    }
    return {
        builtInToolTokens: X + j,
        deferredBuiltinDetails: D,
        deferredBuiltinTokens: M - j
    }
}
// @from(Ln 378422, Col 0)
function T1q(A) {
    return A.find((q) => q.name === NJ)
}
// @from(Ln 378425, Col 0)
async function OdY(A, q, K) {
    let Y = await mU7(h6()),
        z = T1q(A);
    if (!z) return {
        slashCommandTokens: 0,
        commandInfo: {
            totalCommands: 0,
            includedCommands: 0
        }
    };
    return {
        slashCommandTokens: await Kc([z], q, K),
        commandInfo: {
            totalCommands: Y.totalCommands,
            includedCommands: Y.includedCommands
        }
    }
}
// @from(Ln 378443, Col 0)
async function _dY(A, q, K) {
    try {
        let Y = await FU7(h6()),
            z = T1q(A);
        if (!z) return {
            skillTokens: 0,
            skillInfo: {
                totalSkills: 0,
                includedSkills: 0,
                skillFrontmatter: []
            }
        };
        let w = await Kc([z], q, K),
            H = Y.map(($) => ({
                name: $.userFacingName(),
                source: $.type === "prompt" ? $.source : "plugin",
                tokens: NW1($)
            }));
        return {
            skillTokens: w,
            skillInfo: {
                totalSkills: Y.length,
                includedSkills: Y.length,
                skillFrontmatter: H
            }
        }
    } catch (Y) {
        return K1(Y instanceof Error ? Y : Error("Failed to count skill tokens")), {
            skillTokens: 0,
            skillInfo: {
                totalSkills: 0,
                includedSkills: 0,
                skillFrontmatter: []
            }
        }
    }
}
// @from(Ln 378480, Col 0)
async function yU1(A, q, K, Y, z) {
    let w = A.filter((P) => P.isMcp),
        H = [],
        O = (await Promise.all(w.map((P) => Kc([P], q, K, Y)))).map((P) => Math.max(0, (P || 0) - lZ6)),
        _ = O.reduce((P, W) => P + W, 0),
        {
            isToolSearchEnabled: J
        } = await Promise.resolve().then(() => (oL(), iSA)),
        X = await J(Y, A, q, K?.activeAgents ?? [], "analyzeMcp"),
        D = new Set;
    if (X && z) {
        let P = new Set(w.map((W) => W.name));
        for (let W of z)
            if (W.type === "assistant") {
                for (let G of W.message.content)
                    if ("type" in G && G.type === "tool_use" && "name" in G && typeof G.name === "string" && P.has(G.name)) D.add(G.name)
            }
    }
    for (let [P, W] of w.entries()) H.push({
        name: W.name,
        serverName: W.name.split("__")[1] || "unknown",
        tokens: O[P],
        isLoaded: D.has(W.name)
    });
    let j = 0,
        M = 0;
    for (let P of H)
        if (P.isLoaded) j += P.tokens;
        else if (X) M += P.tokens;
    return {
        mcpToolTokens: X ? j : _,
        mcpToolDetails: H,
        deferredToolTokens: M,
        loadedMcpToolNames: D
    }
}
// @from(Ln 378516, Col 0)
async function v1q(A, q, K) {
    let Y = A.filter((z) => !z.isMcp);
    if (Y.length === 0) return 0;
    return Kc(Y, q, K)
}
// @from(Ln 378521, Col 0)
async function JdY(A) {
    let q = A.activeAgents.filter((w) => w.source !== "built-in"),
        K = [],
        Y = 0,
        z = await Promise.all(q.map((w) => RU1([{
            role: "user",
            content: [w.agentType, w.whenToUse].join(" ")
        }], [])));
    for (let [w, H] of q.entries()) {
        let $ = z[w] || 0;
        Y += $ || 0, K.push({
            agentType: H.agentType,
            source: H.source,
            tokens: $ || 0
        })
    }
    return {
        agentTokens: Y,
        agentDetails: K
    }
}
// @from(Ln 378542, Col 0)
async function XdY(A) {
    let q = await gm(A),
        K = {
            totalTokens: 0,
            toolCallTokens: 0,
            toolResultTokens: 0,
            attachmentTokens: 0,
            assistantMessageTokens: 0,
            userMessageTokens: 0,
            toolCallsByType: new Map,
            toolResultsByType: new Map,
            attachmentsByType: new Map
        },
        Y = await RU1(WJ(q.messages).map((z) => {
            if (z.type === "assistant") return {
                role: "assistant",
                content: z.message.content
            };
            return z.message
        }), []);
    return K.totalTokens = Y ?? 0, K
}
// @from(Ln 378564, Col 0)
async function iZ6(A, q, K, Y, z, w, H, $, O) {
    let _ = $71({
            permissionMode: (await K()).mode,
            mainLoopModel: q
        }),
        J = yG(_, FP()),
        X = await dZ(Y, _),
        D = ot({
            mainThreadAgentDefinition: $,
            toolUseContext: H ?? {
                options: {}
            },
            customSystemPrompt: H?.options.customSystemPrompt,
            defaultSystemPrompt: X,
            appendSystemPrompt: H?.options.appendSystemPrompt
        }),
        [j, {
            claudeMdTokens: M,
            memoryFileDetails: P
        }, {
            builtInToolTokens: W,
            deferredBuiltinDetails: G,
            deferredBuiltinTokens: f
        }, {
            mcpToolTokens: Z,
            mcpToolDetails: N,
            deferredToolTokens: T
        }, {
            agentTokens: k,
            agentDetails: y
        }, {
            slashCommandTokens: B,
            commandInfo: S
        }, m] = await Promise.all([wdY(D), HdY(), $dY(Y, K, z, _, A), yU1(Y, K, z, _, A), JdY(z), OdY(Y, K, z), XdY(A)]),
        g = (await _dY(Y, K, z)).skillInfo,
        U = g.skillFrontmatter.reduce((H1, y1) => H1 + y1.tokens, 0),
        x = m.totalTokens,
        p = xm(),
        l = p ? m51(q) - cCA : void 0,
        r = [];
    if (j > 0) r.push({
        name: "System prompt",
        tokens: j,
        color: "promptBorder"
    });
    let s = W - U;
    if (s > 0) r.push({
        name: "System tools",
        tokens: s,
        color: "inactive"
    });
    if (Z > 0) r.push({
        name: "MCP tools",
        tokens: Z,
        color: "cyan_FOR_SUBAGENTS_ONLY"
    });
    if (T > 0) r.push({
        name: "MCP tools (deferred)",
        tokens: T,
        color: "inactive",
        isDeferred: !0
    });
    if (f > 0) r.push({
        name: "System tools (deferred)",
        tokens: f,
        color: "inactive",
        isDeferred: !0
    });
    if (k > 0) r.push({
        name: "Custom agents",
        tokens: k,
        color: "permission"
    });
    if (M > 0) r.push({
        name: "Memory files",
        tokens: M,
        color: "claude"
    });
    if (U > 0) r.push({
        name: "Skills",
        tokens: U,
        color: "warning"
    });
    if (x !== null && x > 0) r.push({
        name: "Messages",
        tokens: x,
        color: "purple_FOR_SUBAGENTS_ONLY"
    });
    let O1 = r.reduce((H1, y1) => H1 + (y1.isDeferred ? 0 : y1.tokens), 0),
        T1 = 0;
    if (p && l !== void 0) T1 = J - l, r.push({
        name: cSA,
        tokens: T1,
        color: "inactive"
    });
    else if (!p) T1 = lCA, r.push({
        name: lSA,
        tokens: T1,
        color: "inactive"
    });
    let N1 = Math.max(0, J - O1 - T1);
    r.push({
        name: "Free space",
        tokens: N1,
        color: "promptBorder"
    });
    let j1 = O1,
        q1 = Ew6(O ?? A),
        J1 = (q1 ? q1.input_tokens + q1.cache_creation_input_tokens + q1.cache_read_input_tokens : null) ?? j1,
        D1 = w && w < 80,
        Z1 = J >= 1e6 ? D1 ? 5 : 20 : D1 ? 5 : 10,
        E1 = J >= 1e6 ? 10 : D1 ? 5 : 10,
        a = Z1 * E1,
        M1 = r.filter((H1) => !H1.isDeferred).map((H1) => ({
            ...H1,
            squares: H1.name === "Free space" ? Math.round(H1.tokens / J * a) : Math.max(1, Math.round(H1.tokens / J * a)),
            percentageOfTotal: Math.round(H1.tokens / J * 100)
        }));

    function z1(H1) {
        let y1 = [],
            B1 = H1.tokens / J * a,
            A6 = Math.floor(B1),
            O6 = B1 - A6;
        for (let P6 = 0; P6 < H1.squares; P6++) {
            let V6 = 1;
            if (P6 === A6 && O6 > 0) V6 = O6;
            y1.push({
                color: H1.color,
                isFilled: !0,
                categoryName: H1.name,
                tokens: H1.tokens,
                percentage: H1.percentageOfTotal,
                squareFullness: V6
            })
        }
        return y1
    }
    let Y1 = [],
        _1 = M1.find((H1) => H1.name === cSA || H1.name === lSA),
        $1 = M1.filter((H1) => H1.name !== cSA && H1.name !== lSA && H1.name !== "Free space");
    for (let H1 of $1) {
        let y1 = z1(H1);
        for (let B1 of y1)
            if (Y1.length < a) Y1.push(B1)
    }
    let G1 = _1 ? _1.squares : 0,
        L1 = r.find((H1) => H1.name === "Free space"),
        x1 = a - G1;
    while (Y1.length < x1) Y1.push({
        color: "promptBorder",
        isFilled: !0,
        categoryName: "Free space",
        tokens: L1?.tokens || 0,
        percentage: L1 ? Math.round(L1.tokens / J * 100) : 0,
        squareFullness: 1
    });
    if (_1) {
        let H1 = z1(_1);
        for (let y1 of H1)
            if (Y1.length < a) Y1.push(y1)
    }
    let f1 = [];
    for (let H1 = 0; H1 < E1; H1++) f1.push(Y1.slice(H1 * Z1, (H1 + 1) * Z1));
    let R1;
    return {
        categories: r,
        totalTokens: J1,
        maxTokens: J,
        rawMaxTokens: J,
        percentage: Math.round(J1 / J * 100),
        gridRows: f1,
        model: _,
        memoryFiles: P,
        mcpTools: N,
        deferredBuiltinTools: G,
        agents: y,
        slashCommands: B > 0 ? {
            totalCommands: S.totalCommands,
            includedCommands: S.includedCommands,
            tokens: B
        } : void 0,
        skills: U > 0 ? {
            totalSkills: g.totalSkills,
            includedSkills: g.includedSkills,
            tokens: U,
            skillFrontmatter: g.skillFrontmatter
        } : void 0,
        autoCompactThreshold: l,
        isAutoCompactEnabled: p,
        messageBreakdown: R1,
        apiUsage: q1
    }
}
// @from(Ln 378758, Col 4)
cSA = "Autocompact buffer"
// @from(Ln 378759, Col 4)
lSA = "Compact buffer"
// @from(Ln 378760, Col 4)
lZ6 = 500
// @from(Ln 378761, Col 4)
IG1 = v(() => {
    hf();
    B6();
    TR();
    vv();
    RW();
    ov();
    cZ6();
    dD();
    Qt();
    N8();
    at();
    e7();
    du1();
    N7();
    xd();
    y6();
    Z6();
    Zt();
    m6()
})
// @from(Ln 378786, Col 0)
function PdY(A, q) {
    let K = MdY[A];
    if (!K || K.length === 0) return q;
    let Y = {
            ...q
        },
        z = Y.properties;
    if (z && typeof z === "object") {
        let w = {
            ...z
        };
        for (let H of K) delete w[H];
        Y.properties = w
    }
    return Y
}
// @from(Ln 378802, Col 0)
async function nZ6(A, q) {
    let K = i2("tengu_tool_pear"),
        Y = "inputJSONSchema" in A && A.inputJSONSchema ? A.inputJSONSchema : n51(A.inputSchema);
    if (!l8()) Y = PdY(A.name, Y);
    let z = {
        name: A.name,
        description: await A.prompt({
            getToolPermissionContext: q.getToolPermissionContext,
            tools: q.tools,
            agents: q.agents,
            allowedAgentTypes: q.allowedAgentTypes
        }),
        input_schema: Y
    };
    if (K && A.strict === !0 && q.model && UF6(q.model)) z.strict = !0;
    if (q.betas?.includes(On1) && A.input_examples) z.input_examples = A.input_examples;
    if (q.deferLoading) z.defer_loading = !0;
    if (q.cacheControl) z.cache_control = q.cacheControl;
    return z
}
// @from(Ln 378823, Col 0)
function E1q(A) {
    let [q] = nSA(A), K = q?.text;
    c("tengu_sysprompt_block", {
        snippet: K?.slice(0, 20),
        length: K?.length ?? 0,
        hash: K ? DdY("sha256").update(K).digest("hex") : ""
    })
}
// @from(Ln 378832, Col 0)
function nSA(A, q) {
    let K = E4() === "firstParty" && (J6(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) || x8("tengu_system_prompt_global_cache", !1));
    if (K && q?.skipGlobalCacheForSystemPrompt) {
        c("tengu_sysprompt_using_tool_based_cache", {
            promptBlockCount: A.length
        });
        let O, _, J = [];
        for (let j of A) {
            if (!j) continue;
            if (j === xG1) continue;
            if (j.startsWith("x-anthropic-billing-header")) O = j;
            else if (dq6.has(j)) _ = j;
            else J.push(j)
        }
        let X = [];
        if (O) X.push({
            text: O,
            cacheScope: null
        });
        if (_) X.push({
            text: _,
            cacheScope: null
        });
        let D = J.join(`

`);
        if (D) X.push({
            text: D,
            cacheScope: null
        });
        return X
    }
    if (K) {
        let O = A.findIndex((_) => _ === xG1);
        if (O !== -1) {
            let _, J, X = [],
                D = [];
            for (let W = 0; W < A.length; W++) {
                let G = A[W];
                if (!G || G === xG1) continue;
                if (G.startsWith("x-anthropic-billing-header")) _ = G;
                else if (dq6.has(G)) J = G;
                else if (W < O) X.push(G);
                else D.push(G)
            }
            let j = [];
            if (_) j.push({
                text: _,
                cacheScope: null
            });
            if (J) j.push({
                text: J,
                cacheScope: null
            });
            let M = X.join(`

`);
            if (M) j.push({
                text: M,
                cacheScope: "global"
            });
            let P = D.join(`

`);
            if (P) j.push({
                text: P,
                cacheScope: null
            });
            return c("tengu_sysprompt_boundary_found", {
                blockCount: j.length,
                staticBlockLength: M.length,
                dynamicBlockLength: P.length
            }), j
        } else c("tengu_sysprompt_missing_boundary_marker", {
            promptBlockCount: A.length
        })
    }
    let Y, z, w = [];
    for (let O of A) {
        if (!O) continue;
        if (O.startsWith("x-anthropic-billing-header")) Y = O;
        else if (dq6.has(O)) z = O;
        else w.push(O)
    }
    let H = [];
    if (Y) H.push({
        text: Y,
        cacheScope: null
    });
    if (z) H.push({
        text: z,
        cacheScope: "org"
    });
    let $ = w.join(`

`);
    if ($) H.push({
        text: $,
        cacheScope: "org"
    });
    return H
}
// @from(Ln 378935, Col 0)
function k1q(A, q) {
    return [...A, Object.entries(q).map(([K, Y]) => `${K}: ${Y}`).join(`
`)].filter(Boolean)
}
// @from(Ln 378940, Col 0)
function bG1(A, q) {
    if (Object.entries(q).length === 0) return A;
    return [c6({
        content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(q).map(([K,Y])=>`# ${K}
${Y}`).join(`
`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
        isMeta: !0
    }), ...A]
}
// @from(Ln 378955, Col 0)
async function L1q(A, q) {
    if (BZ()) return;
    let [{
        tools: K
    }, Y, z, w] = await Promise.all([tG6(A), tD(q), i$(), l$()]), H = w.gitStatus?.length ?? 0, $ = z.claudeMd?.length ?? 0, O = H + $, _ = Aq();
    setTimeout(() => _.abort(), 1000);
    let J = h6(),
        X = _01(q),
        D = O01(X, J),
        j = await Va1(J, _.signal, D),
        M = 0,
        P = 0,
        W = 0,
        G = 0,
        f = 0,
        Z = Y.filter((T) => !T.isMcp);
    M = K.length, G = Z.length;
    let N = new Set;
    for (let T of K) {
        let k = T.name.split("__");
        if (k.length >= 3 && k[1]) N.add(k[1])
    }
    P = N.size;
    try {
        let T = _i4(q, K);
        if (K.length > 0) {
            let k = l3(),
                {
                    mcpToolTokens: y
                } = await yU1(T, async () => q, null, k);
            W = y
        }
        if (Z.length > 0) f = await v1q(T, async () => q, null)
    } catch {}
    c("tengu_context_size", {
        git_status_size: H,
        claude_md_size: $,
        total_context_size: O,
        project_file_count_rounded: j,
        mcp_tools_count: M,
        mcp_servers_count: P,
        mcp_tools_tokens: W,
        non_mcp_tools_count: G,
        non_mcp_tools_tokens: f
    })
}
// @from(Ln 379002, Col 0)
function R1q(A, q, K) {
    switch (A.name) {
        case bW: {
            let Y = pD(K);
            return q_6(), Y !== null ? {
                ...q,
                plan: Y
            } : q
        }
        case qq.name: {
            let Y = qq.inputSchema.parse(q),
                {
                    command: z,
                    timeout: w,
                    description: H
                } = Y,
                $ = z.replace(`cd ${h6()} && `, "");
            if ($ = $.replace(/\\\\;/g, "\\;"), /^echo\s+["']?[^|&;><]*["']?$/i.test($.trim())) c("tengu_bash_tool_simple_echo", {});
            let O = "run_in_background" in Y ? Y.run_in_background : void 0;
            return {
                command: $,
                description: H,
                ...w ? {
                    timeout: w
                } : {},
                ...H ? {
                    description: H
                } : {},
                ...O ? {
                    run_in_background: O
                } : {},
                ..."dangerouslyDisableSandbox" in Y && Y.dangerouslyDisableSandbox ? {
                    dangerouslyDisableSandbox: Y.dangerouslyDisableSandbox
                } : {}
            }
        }
        case sW.name: {
            let Y = sW.inputSchema.parse(q),
                {
                    file_path: z,
                    edits: w
                } = Np7({
                    file_path: Y.file_path,
                    edits: [{
                        old_string: Y.old_string,
                        new_string: Y.new_string,
                        replace_all: Y.replace_all
                    }]
                });
            return {
                replace_all: w[0].replace_all,
                file_path: z,
                old_string: w[0].old_string,
                new_string: w[0].new_string
            }
        }
        case vj.name: {
            let Y = vj.inputSchema.parse(q);
            return {
                file_path: Y.file_path,
                content: XjA(Y.content)
            }
        }
        case uj1: {
            let Y = q,
                z = Y.task_id ?? Y.agentId ?? Y.bash_id,
                w = Y.timeout ?? (typeof Y.wait_up_to === "number" ? Y.wait_up_to * 1000 : void 0);
            return {
                task_id: z ?? "",
                block: Y.block ?? !0,
                timeout: w ?? 30000
            }
        }
        default:
            return q
    }
}
// @from(Ln 379080, Col 0)
function y1q(A, q) {
    switch (A.name) {
        case bW: {
            if (q && typeof q === "object" && "plan" in q) {
                let {
                    plan: K,
                    ...Y
                } = q;
                return Y
            }
            return q
        }
        default:
            return q
    }
}
// @from(Ln 379096, Col 4)
jdY
// @from(Ln 379096, Col 9)
MdY
// @from(Ln 379097, Col 4)
at = v(() => {
    hA();
    kZ6();
    U4();
    iq6();
    u6();
    N8();
    ix();
    N7();
    E2();
    i0();
    V51();
    WK1();
    Lt();
    G2();
    S9();
    mX();
    m6();
    Z6();
    IG1();
    e7();
    UH();
    Wk();
    e11();
    SW();
    TR();
    $P();
    Js();
    ov();
    U4();
    jdY = o(N1q(), 1), MdY = {
        [bW]: ["launchSwarm", "teammateCount"],
        [fK]: ["name", "team_name", "mode"]
    }
})
// @from(Ln 379133, Col 0)
function oZ6() {
    if (!rSA) rSA = h1("perf_hooks").performance;
    return rSA
}
// @from(Ln 379138, Col 0)
function GdY() {
    let A = oZ6(),
        q = A.getEntriesByType("mark");
    for (let K of q)
        if (K.name.startsWith(SU1)) A.clearMarks(K.name)
}
// @from(Ln 379145, Col 0)
function aSA() {
    if (!w4()) return;
    if (!oSA) return;
    if (CU1++, GdY(), oZ6().mark(`${SU1}turn_start`), rZ6) h(`[headlessProfiler] Started turn ${CU1}`)
}
// @from(Ln 379151, Col 0)
function t51(A) {
    if (!w4()) return;
    if (!oSA) return;
    let q = oZ6();
    if (q.mark(`${SU1}${A}`), rZ6) h(`[headlessProfiler] Checkpoint: ${A} at ${q.now().toFixed(1)}ms`)
}
// @from(Ln 379158, Col 0)
function sSA() {
    if (!w4()) return;
    if (!oSA) return;
    let K = oZ6().getEntriesByType("mark").filter((J) => J.name.startsWith(SU1));
    if (K.length === 0) return;
    let Y = new Map;
    for (let J of K) {
        let X = J.name.slice(SU1.length);
        Y.set(X, J.startTime)
    }
    let z = Y.get("turn_start");
    if (z === void 0) return;
    let w = {
            turn_number: CU1
        },
        H = Y.get("system_message_yielded");
    if (H !== void 0 && CU1 === 0) w.time_to_system_message_ms = Math.round(H);
    let $ = Y.get("query_started");
    if ($ !== void 0) w.time_to_query_start_ms = Math.round($ - z);
    let O = Y.get("first_chunk");
    if (O !== void 0) w.time_to_first_response_ms = Math.round(O - z);
    let _ = Y.get("api_request_sent");
    if ($ !== void 0 && _ !== void 0) w.query_overhead_ms = Math.round(_ - $);
    if (w.checkpoint_count = K.length, process.env.CLAUDE_CODE_ENTRYPOINT) w.entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
    if (C1q) c("tengu_headless_latency", w);
    if (rZ6) h(`[headlessProfiler] Turn ${CU1} metrics: ${Q1(w)}`)
}
// @from(Ln 379185, Col 4)
rZ6
// @from(Ln 379185, Col 9)
WdY = 0.05
// @from(Ln 379186, Col 4)
C1q
// @from(Ln 379186, Col 9)
oSA
// @from(Ln 379186, Col 14)
rSA = null
// @from(Ln 379187, Col 4)
SU1 = "headless_"
// @from(Ln 379188, Col 4)
CU1 = -1
// @from(Ln 379189, Col 4)
hU1 = v(() => {
    Z6();
    u6();
    B6();
    m6();
    rZ6 = process.env.CLAUDE_CODE_PROFILE_STARTUP === "1", C1q = Math.random() < WdY, oSA = rZ6 || C1q
})
// @from(Ln 379197, Col 0)
function aZ6(A) {
    S1q.push(A)
}
// @from(Ln 379200, Col 0)
async function h1q(A, q, K, Y, z, w) {
    let H = {
        messages: A,
        systemPrompt: q,
        userContext: K,
        systemContext: Y,
        toolUseContext: z,
        querySource: w
    };
    for (let $ of S1q) try {
        await $(H)
    } catch (O) {
        K1(O instanceof Error ? O : Error(`Post-sampling hook failed: ${O}`))
    }
}
// @from(Ln 379215, Col 4)
S1q
// @from(Ln 379216, Col 4)
IU1 = v(() => {
    y6();
    S1q = []
})
// @from(Ln 379220, Col 4)
xU1
// @from(Ln 379221, Col 4)
tSA = v(() => {
    xU1 = class xU1 {
        returned;
        queue = [];
        readResolve;
        readReject;
        isDone = !1;
        hasError;
        started = !1;
        constructor(A) {
            this.returned = A
        } [Symbol.asyncIterator]() {
            if (this.started) throw Error("Stream can only be iterated once");
            return this.started = !0, this
        }
        next() {
            if (this.queue.length > 0) return Promise.resolve({
                done: !1,
                value: this.queue.shift()
            });
            if (this.isDone) return Promise.resolve({
                done: !0,
                value: void 0
            });
            if (this.hasError) return Promise.reject(this.hasError);
            return new Promise((A, q) => {
                this.readResolve = A, this.readReject = q
            })
        }
        enqueue(A) {
            if (this.readResolve) {
                let q = this.readResolve;
                this.readResolve = void 0, this.readReject = void 0, q({
                    done: !1,
                    value: A
                })
            } else this.queue.push(A)
        }
        done() {
            if (this.isDone = !0, this.readResolve) {
                let A = this.readResolve;
                this.readResolve = void 0, this.readReject = void 0, A({
                    done: !0,
                    value: void 0
                })
            }
        }
        error(A) {
            if (this.hasError = A, this.readReject) {
                let q = this.readReject;
                this.readResolve = void 0, this.readReject = void 0, q(A)
            }
        }
        return () {
            if (this.isDone = !0, this.returned) this.returned();
            return Promise.resolve({
                done: !0,
                value: void 0
            })
        }
    }
})
// @from(Ln 379284, Col 0)
function uG1(A) {
    if (A instanceof dz) return A.message || YN;
    if (!(A instanceof Error)) return String(A);
    let K = eSA(A).filter(Boolean).join(`
`).trim() || "Command failed with no output";
    if (K.length <= 1e4) return K;
    let Y = 5000,
        z = K.slice(0, Y),
        w = K.slice(-Y);
    return `${z}

... [${K.length-1e4} characters truncated] ...

${w}`
}
// @from(Ln 379300, Col 0)
function eSA(A) {
    if (A instanceof DC) return [`Exit code ${A.code}`, A.interrupted ? YN : "", A.stderr, A.stdout];
    let q = [A.message];
    if ("stderr" in A && typeof A.stderr === "string") q.push(A.stderr);
    if ("stdout" in A && typeof A.stdout === "string") q.push(A.stdout);
    return q
}
// @from(Ln 379308, Col 0)
function I1q(A) {
    if (A.length === 0) return "";
    return A.reduce((q, K, Y) => {
        let z = String(K);
        if (typeof K === "number") return `${String(q)}[${z}]`;
        return Y === 0 ? z : `${String(q)}.${z}`
    }, "")
}
// @from(Ln 379317, Col 0)
function x1q(A, q) {
    let K = q.issues.filter(($) => $.code === "invalid_type" && $.message.includes("received undefined")).map(($) => I1q($.path)),
        Y = q.issues.filter(($) => $.code === "unrecognized_keys").flatMap(($) => $.keys),
        z = q.issues.filter(($) => $.code === "invalid_type" && !$.message.includes("received undefined")).map(($) => {
            let O = $,
                _ = $.message.match(/received (\w+)/),
                J = _ ? _[1] : "unknown";
            return {
                param: I1q($.path),
                expected: O.expected,
                received: J
            }
        }),
        w = q.message,
        H = [];
    if (K.length > 0) {
        let $ = K.map((O) => `The required parameter \`${O}\` is missing`);
        H.push(...$)
    }
    if (Y.length > 0) {
        let $ = Y.map((O) => `An unexpected parameter \`${O}\` was provided`);
        H.push(...$)
    }
    if (z.length > 0) {
        let $ = z.map(({
            param: O,
            expected: _,
            received: J
        }) => `The parameter \`${O}\` type is expected as \`${_}\` but provided as \`${J}\``);
        H.push(...$)
    }
    if (H.length > 0) w = `${A} failed due to the following ${H.length>1?"issues":"issue"}:
${H.join(`
`)}`;
    return w
}
// @from(Ln 379353, Col 4)
sZ6 = v(() => {
    qH();
    N8()
})
// @from(Ln 379358, Col 0)
function AhA(A) {
    switch (A) {
        case "allow":
            return "allowed";
        case "deny":
            return "denied";
        default:
            return "asked for confirmation for"
    }
}