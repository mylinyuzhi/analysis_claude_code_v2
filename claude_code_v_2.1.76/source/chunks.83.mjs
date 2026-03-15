
// @from(Ln 215424, Col 4)
Y14 = x((Yb2, K14) => {
    var GD1 = eg6(),
        $B = AF6(),
        {
            MAX_LENGTH: fD1,
            POSIX_REGEX_SOURCE: gT9,
            REGEX_NON_SPECIAL_CHARS: FT9,
            REGEX_SPECIAL_CHARS_BACKREF: pT9,
            REPLACEMENTS: q14
        } = GD1,
        QT9 = (A, q) => {
            if (typeof q.expandRange === "function") return q.expandRange(...A, q);
            A.sort();
            let K = `[${A.join("-")}]`;
            try {
                new RegExp(K)
            } catch (Y) {
                return A.map((z) => $B.escapeRegex(z)).join("..")
            }
            return K
        },
        V06 = (A, q) => {
            return `Missing ${A}: "${q}" - use "\\\\${q}" to match literal characters`
        },
        yf8 = (A, q) => {
            if (typeof A !== "string") throw TypeError("Expected a string");
            A = q14[A] || A;
            let K = {
                    ...q
                },
                Y = typeof K.maxLength === "number" ? Math.min(fD1, K.maxLength) : fD1,
                z = A.length;
            if (z > Y) throw SyntaxError(`Input length: ${z}, exceeds maximum allowed length: ${Y}`);
            let _ = {
                    type: "bos",
                    value: "",
                    output: K.prepend || ""
                },
                w = [_],
                O = K.capture ? "" : "?:",
                $ = GD1.globChars(K.windows),
                H = GD1.extglobChars($),
                {
                    DOT_LITERAL: j,
                    PLUS_LITERAL: J,
                    SLASH_LITERAL: M,
                    ONE_CHAR: D,
                    DOTS_SLASH: X,
                    NO_DOT: P,
                    NO_DOT_SLASH: W,
                    NO_DOTS_SLASH: Z,
                    QMARK: G,
                    QMARK_NO_DOT: f,
                    STAR: v,
                    START_ANCHOR: N
                } = $,
                V = ($6) => {
                    return `(${O}(?:(?!${N}${$6.dot?X:j}).)*?)`
                },
                L = K.dot ? "" : P,
                h = K.dot ? G : f,
                R = K.bash === !0 ? V(K) : v;
            if (K.capture) R = `(${R})`;
            if (typeof K.noext === "boolean") K.noextglob = K.noext;
            let u = {
                input: A,
                index: -1,
                start: 0,
                dot: K.dot === !0,
                consumed: "",
                output: "",
                prefix: "",
                backtrack: !1,
                negated: !1,
                brackets: 0,
                braces: 0,
                parens: 0,
                quotes: 0,
                globstar: !1,
                tokens: w
            };
            A = $B.removePrefix(A, u), z = A.length;
            let I = [],
                g = [],
                B = [],
                b = _,
                p, Q = () => u.index === z - 1,
                U = u.peek = ($6 = 1) => A[u.index + $6],
                r = u.advance = () => A[++u.index] || "",
                e = () => A.slice(u.index + 1),
                Y6 = ($6 = "", n = 0) => {
                    u.consumed += $6, u.index += n
                },
                H6 = ($6) => {
                    u.output += $6.output != null ? $6.output : $6.value, Y6($6.value)
                },
                J6 = () => {
                    let $6 = 1;
                    while (U() === "!" && (U(2) !== "(" || U(3) === "?")) r(), u.start++, $6++;
                    if ($6 % 2 === 0) return !1;
                    return u.negated = !0, u.start++, !0
                },
                K6 = ($6) => {
                    u[$6]++, B.push($6)
                },
                s = ($6) => {
                    u[$6]--, B.pop()
                },
                X6 = ($6) => {
                    if (b.type === "globstar") {
                        let n = u.braces > 0 && ($6.type === "comma" || $6.type === "brace"),
                            o = $6.extglob === !0 || I.length && ($6.type === "pipe" || $6.type === "paren");
                        if ($6.type !== "slash" && $6.type !== "paren" && !n && !o) u.output = u.output.slice(0, -b.output.length), b.type = "star", b.value = "*", b.output = R, u.output += b.output
                    }
                    if (I.length && $6.type !== "paren") I[I.length - 1].inner += $6.value;
                    if ($6.value || $6.output) H6($6);
                    if (b && b.type === "text" && $6.type === "text") {
                        b.output = (b.output || b.value) + $6.value, b.value += $6.value;
                        return
                    }
                    $6.prev = b, w.push($6), b = $6
                },
                z6 = ($6, n) => {
                    let o = {
                        ...H[n],
                        conditions: 1,
                        inner: ""
                    };
                    o.prev = b, o.parens = u.parens, o.output = u.output;
                    let a = (K.capture ? "(" : "") + o.open;
                    K6("parens"), X6({
                        type: $6,
                        value: n,
                        output: u.output ? "" : D
                    }), X6({
                        type: "paren",
                        extglob: !0,
                        value: r(),
                        output: a
                    }), I.push(o)
                },
                N6 = ($6) => {
                    let n = $6.close + (K.capture ? ")" : ""),
                        o;
                    if ($6.type === "negate") {
                        let a = R;
                        if ($6.inner && $6.inner.length > 1 && $6.inner.includes("/")) a = V(K);
                        if (a !== R || Q() || /^\)+$/.test(e())) n = $6.close = `)$))${a}`;
                        if ($6.inner.includes("*") && (o = e()) && /^\.[^\\/.]+$/.test(o)) {
                            let i = yf8(o, {
                                ...q,
                                fastpaths: !1
                            }).output;
                            n = $6.close = `)${i})${a})`
                        }
                        if ($6.prev.type === "bos") u.negatedExtglob = !0
                    }
                    X6({
                        type: "paren",
                        extglob: !0,
                        value: p,
                        output: n
                    }), s("parens")
                };
            if (K.fastpaths !== !1 && !/(^[*!]|[/()[\]{}"])/.test(A)) {
                let $6 = !1,
                    n = A.replace(pT9, (o, a, i, l, q6, w6) => {
                        if (l === "\\") return $6 = !0, o;
                        if (l === "?") {
                            if (a) return a + l + (q6 ? G.repeat(q6.length) : "");
                            if (w6 === 0) return h + (q6 ? G.repeat(q6.length) : "");
                            return G.repeat(i.length)
                        }
                        if (l === ".") return j.repeat(i.length);
                        if (l === "*") {
                            if (a) return a + l + (q6 ? R : "");
                            return R
                        }
                        return a ? o : `\\${o}`
                    });
                if ($6 === !0)
                    if (K.unescape === !0) n = n.replace(/\\/g, "");
                    else n = n.replace(/\\+/g, (o) => {
                        return o.length % 2 === 0 ? "\\\\" : o ? "\\" : ""
                    });
                if (n === A && K.contains === !0) return u.output = A, u;
                return u.output = $B.wrapOutput(n, u, q), u
            }
            while (!Q()) {
                if (p = r(), p === "\x00") continue;
                if (p === "\\") {
                    let o = U();
                    if (o === "/" && K.bash !== !0) continue;
                    if (o === "." || o === ";") continue;
                    if (!o) {
                        p += "\\", X6({
                            type: "text",
                            value: p
                        });
                        continue
                    }
                    let a = /^\\+/.exec(e()),
                        i = 0;
                    if (a && a[0].length > 2) {
                        if (i = a[0].length, u.index += i, i % 2 !== 0) p += "\\"
                    }
                    if (K.unescape === !0) p = r();
                    else p += r();
                    if (u.brackets === 0) {
                        X6({
                            type: "text",
                            value: p
                        });
                        continue
                    }
                }
                if (u.brackets > 0 && (p !== "]" || b.value === "[" || b.value === "[^")) {
                    if (K.posix !== !1 && p === ":") {
                        let o = b.value.slice(1);
                        if (o.includes("[")) {
                            if (b.posix = !0, o.includes(":")) {
                                let a = b.value.lastIndexOf("["),
                                    i = b.value.slice(0, a),
                                    l = b.value.slice(a + 2),
                                    q6 = gT9[l];
                                if (q6) {
                                    if (b.value = i + q6, u.backtrack = !0, r(), !_.output && w.indexOf(b) === 1) _.output = D;
                                    continue
                                }
                            }
                        }
                    }
                    if (p === "[" && U() !== ":" || p === "-" && U() === "]") p = `\\${p}`;
                    if (p === "]" && (b.value === "[" || b.value === "[^")) p = `\\${p}`;
                    if (K.posix === !0 && p === "!" && b.value === "[") p = "^";
                    b.value += p, H6({
                        value: p
                    });
                    continue
                }
                if (u.quotes === 1 && p !== '"') {
                    p = $B.escapeRegex(p), b.value += p, H6({
                        value: p
                    });
                    continue
                }
                if (p === '"') {
                    if (u.quotes = u.quotes === 1 ? 0 : 1, K.keepQuotes === !0) X6({
                        type: "text",
                        value: p
                    });
                    continue
                }
                if (p === "(") {
                    K6("parens"), X6({
                        type: "paren",
                        value: p
                    });
                    continue
                }
                if (p === ")") {
                    if (u.parens === 0 && K.strictBrackets === !0) throw SyntaxError(V06("opening", "("));
                    let o = I[I.length - 1];
                    if (o && u.parens === o.parens + 1) {
                        N6(I.pop());
                        continue
                    }
                    X6({
                        type: "paren",
                        value: p,
                        output: u.parens ? ")" : "\\)"
                    }), s("parens");
                    continue
                }
                if (p === "[") {
                    if (K.nobracket === !0 || !e().includes("]")) {
                        if (K.nobracket !== !0 && K.strictBrackets === !0) throw SyntaxError(V06("closing", "]"));
                        p = `\\${p}`
                    } else K6("brackets");
                    X6({
                        type: "bracket",
                        value: p
                    });
                    continue
                }
                if (p === "]") {
                    if (K.nobracket === !0 || b && b.type === "bracket" && b.value.length === 1) {
                        X6({
                            type: "text",
                            value: p,
                            output: `\\${p}`
                        });
                        continue
                    }
                    if (u.brackets === 0) {
                        if (K.strictBrackets === !0) throw SyntaxError(V06("opening", "["));
                        X6({
                            type: "text",
                            value: p,
                            output: `\\${p}`
                        });
                        continue
                    }
                    s("brackets");
                    let o = b.value.slice(1);
                    if (b.posix !== !0 && o[0] === "^" && !o.includes("/")) p = `/${p}`;
                    if (b.value += p, H6({
                            value: p
                        }), K.literalBrackets === !1 || $B.hasRegexChars(o)) continue;
                    let a = $B.escapeRegex(b.value);
                    if (u.output = u.output.slice(0, -b.value.length), K.literalBrackets === !0) {
                        u.output += a, b.value = a;
                        continue
                    }
                    b.value = `(${O}${a}|${b.value})`, u.output += b.value;
                    continue
                }
                if (p === "{" && K.nobrace !== !0) {
                    K6("braces");
                    let o = {
                        type: "brace",
                        value: p,
                        output: "(",
                        outputIndex: u.output.length,
                        tokensIndex: u.tokens.length
                    };
                    g.push(o), X6(o);
                    continue
                }
                if (p === "}") {
                    let o = g[g.length - 1];
                    if (K.nobrace === !0 || !o) {
                        X6({
                            type: "text",
                            value: p,
                            output: p
                        });
                        continue
                    }
                    let a = ")";
                    if (o.dots === !0) {
                        let i = w.slice(),
                            l = [];
                        for (let q6 = i.length - 1; q6 >= 0; q6--) {
                            if (w.pop(), i[q6].type === "brace") break;
                            if (i[q6].type !== "dots") l.unshift(i[q6].value)
                        }
                        a = QT9(l, K), u.backtrack = !0
                    }
                    if (o.comma !== !0 && o.dots !== !0) {
                        let i = u.output.slice(0, o.outputIndex),
                            l = u.tokens.slice(o.tokensIndex);
                        o.value = o.output = "\\{", p = a = "\\}", u.output = i;
                        for (let q6 of l) u.output += q6.output || q6.value
                    }
                    X6({
                        type: "brace",
                        value: p,
                        output: a
                    }), s("braces"), g.pop();
                    continue
                }
                if (p === "|") {
                    if (I.length > 0) I[I.length - 1].conditions++;
                    X6({
                        type: "text",
                        value: p
                    });
                    continue
                }
                if (p === ",") {
                    let o = p,
                        a = g[g.length - 1];
                    if (a && B[B.length - 1] === "braces") a.comma = !0, o = "|";
                    X6({
                        type: "comma",
                        value: p,
                        output: o
                    });
                    continue
                }
                if (p === "/") {
                    if (b.type === "dot" && u.index === u.start + 1) {
                        u.start = u.index + 1, u.consumed = "", u.output = "", w.pop(), b = _;
                        continue
                    }
                    X6({
                        type: "slash",
                        value: p,
                        output: M
                    });
                    continue
                }
                if (p === ".") {
                    if (u.braces > 0 && b.type === "dot") {
                        if (b.value === ".") b.output = j;
                        let o = g[g.length - 1];
                        b.type = "dots", b.output += p, b.value += p, o.dots = !0;
                        continue
                    }
                    if (u.braces + u.parens === 0 && b.type !== "bos" && b.type !== "slash") {
                        X6({
                            type: "text",
                            value: p,
                            output: j
                        });
                        continue
                    }
                    X6({
                        type: "dot",
                        value: p,
                        output: j
                    });
                    continue
                }
                if (p === "?") {
                    if (!(b && b.value === "(") && K.noextglob !== !0 && U() === "(" && U(2) !== "?") {
                        z6("qmark", p);
                        continue
                    }
                    if (b && b.type === "paren") {
                        let a = U(),
                            i = p;
                        if (b.value === "(" && !/[!=<:]/.test(a) || a === "<" && !/<([!=]|\w+>)/.test(e())) i = `\\${p}`;
                        X6({
                            type: "text",
                            value: p,
                            output: i
                        });
                        continue
                    }
                    if (K.dot !== !0 && (b.type === "slash" || b.type === "bos")) {
                        X6({
                            type: "qmark",
                            value: p,
                            output: f
                        });
                        continue
                    }
                    X6({
                        type: "qmark",
                        value: p,
                        output: G
                    });
                    continue
                }
                if (p === "!") {
                    if (K.noextglob !== !0 && U() === "(") {
                        if (U(2) !== "?" || !/[!=<:]/.test(U(3))) {
                            z6("negate", p);
                            continue
                        }
                    }
                    if (K.nonegate !== !0 && u.index === 0) {
                        J6();
                        continue
                    }
                }
                if (p === "+") {
                    if (K.noextglob !== !0 && U() === "(" && U(2) !== "?") {
                        z6("plus", p);
                        continue
                    }
                    if (b && b.value === "(" || K.regex === !1) {
                        X6({
                            type: "plus",
                            value: p,
                            output: J
                        });
                        continue
                    }
                    if (b && (b.type === "bracket" || b.type === "paren" || b.type === "brace") || u.parens > 0) {
                        X6({
                            type: "plus",
                            value: p
                        });
                        continue
                    }
                    X6({
                        type: "plus",
                        value: J
                    });
                    continue
                }
                if (p === "@") {
                    if (K.noextglob !== !0 && U() === "(" && U(2) !== "?") {
                        X6({
                            type: "at",
                            extglob: !0,
                            value: p,
                            output: ""
                        });
                        continue
                    }
                    X6({
                        type: "text",
                        value: p
                    });
                    continue
                }
                if (p !== "*") {
                    if (p === "$" || p === "^") p = `\\${p}`;
                    let o = FT9.exec(e());
                    if (o) p += o[0], u.index += o[0].length;
                    X6({
                        type: "text",
                        value: p
                    });
                    continue
                }
                if (b && (b.type === "globstar" || b.star === !0)) {
                    b.type = "star", b.star = !0, b.value += p, b.output = R, u.backtrack = !0, u.globstar = !0, Y6(p);
                    continue
                }
                let $6 = e();
                if (K.noextglob !== !0 && /^\([^?]/.test($6)) {
                    z6("star", p);
                    continue
                }
                if (b.type === "star") {
                    if (K.noglobstar === !0) {
                        Y6(p);
                        continue
                    }
                    let o = b.prev,
                        a = o.prev,
                        i = o.type === "slash" || o.type === "bos",
                        l = a && (a.type === "star" || a.type === "globstar");
                    if (K.bash === !0 && (!i || $6[0] && $6[0] !== "/")) {
                        X6({
                            type: "star",
                            value: p,
                            output: ""
                        });
                        continue
                    }
                    let q6 = u.braces > 0 && (o.type === "comma" || o.type === "brace"),
                        w6 = I.length && (o.type === "pipe" || o.type === "paren");
                    if (!i && o.type !== "paren" && !q6 && !w6) {
                        X6({
                            type: "star",
                            value: p,
                            output: ""
                        });
                        continue
                    }
                    while ($6.slice(0, 3) === "/**") {
                        let O6 = A[u.index + 4];
                        if (O6 && O6 !== "/") break;
                        $6 = $6.slice(3), Y6("/**", 3)
                    }
                    if (o.type === "bos" && Q()) {
                        b.type = "globstar", b.value += p, b.output = V(K), u.output = b.output, u.globstar = !0, Y6(p);
                        continue
                    }
                    if (o.type === "slash" && o.prev.type !== "bos" && !l && Q()) {
                        u.output = u.output.slice(0, -(o.output + b.output).length), o.output = `(?:${o.output}`, b.type = "globstar", b.output = V(K) + (K.strictSlashes ? ")" : "|$)"), b.value += p, u.globstar = !0, u.output += o.output + b.output, Y6(p);
                        continue
                    }
                    if (o.type === "slash" && o.prev.type !== "bos" && $6[0] === "/") {
                        let O6 = $6[1] !== void 0 ? "|$" : "";
                        u.output = u.output.slice(0, -(o.output + b.output).length), o.output = `(?:${o.output}`, b.type = "globstar", b.output = `${V(K)}${M}|${M}${O6})`, b.value += p, u.output += o.output + b.output, u.globstar = !0, Y6(p + r()), X6({
                            type: "slash",
                            value: "/",
                            output: ""
                        });
                        continue
                    }
                    if (o.type === "bos" && $6[0] === "/") {
                        b.type = "globstar", b.value += p, b.output = `(?:^|${M}|${V(K)}${M})`, u.output = b.output, u.globstar = !0, Y6(p + r()), X6({
                            type: "slash",
                            value: "/",
                            output: ""
                        });
                        continue
                    }
                    u.output = u.output.slice(0, -b.output.length), b.type = "globstar", b.output = V(K), b.value += p, u.output += b.output, u.globstar = !0, Y6(p);
                    continue
                }
                let n = {
                    type: "star",
                    value: p,
                    output: R
                };
                if (K.bash === !0) {
                    if (n.output = ".*?", b.type === "bos" || b.type === "slash") n.output = L + n.output;
                    X6(n);
                    continue
                }
                if (b && (b.type === "bracket" || b.type === "paren") && K.regex === !0) {
                    n.output = p, X6(n);
                    continue
                }
                if (u.index === u.start || b.type === "slash" || b.type === "dot") {
                    if (b.type === "dot") u.output += W, b.output += W;
                    else if (K.dot === !0) u.output += Z, b.output += Z;
                    else u.output += L, b.output += L;
                    if (U() !== "*") u.output += D, b.output += D
                }
                X6(n)
            }
            while (u.brackets > 0) {
                if (K.strictBrackets === !0) throw SyntaxError(V06("closing", "]"));
                u.output = $B.escapeLast(u.output, "["), s("brackets")
            }
            while (u.parens > 0) {
                if (K.strictBrackets === !0) throw SyntaxError(V06("closing", ")"));
                u.output = $B.escapeLast(u.output, "("), s("parens")
            }
            while (u.braces > 0) {
                if (K.strictBrackets === !0) throw SyntaxError(V06("closing", "}"));
                u.output = $B.escapeLast(u.output, "{"), s("braces")
            }
            if (K.strictSlashes !== !0 && (b.type === "star" || b.type === "bracket")) X6({
                type: "maybe_slash",
                value: "",
                output: `${M}?`
            });
            if (u.backtrack === !0) {
                u.output = "";
                for (let $6 of u.tokens)
                    if (u.output += $6.output != null ? $6.output : $6.value, $6.suffix) u.output += $6.suffix
            }
            return u
        };
    yf8.fastpaths = (A, q) => {
        let K = {
                ...q
            },
            Y = typeof K.maxLength === "number" ? Math.min(fD1, K.maxLength) : fD1,
            z = A.length;
        if (z > Y) throw SyntaxError(`Input length: ${z}, exceeds maximum allowed length: ${Y}`);
        A = q14[A] || A;
        let {
            DOT_LITERAL: _,
            SLASH_LITERAL: w,
            ONE_CHAR: O,
            DOTS_SLASH: $,
            NO_DOT: H,
            NO_DOTS: j,
            NO_DOTS_SLASH: J,
            STAR: M,
            START_ANCHOR: D
        } = GD1.globChars(K.windows), X = K.dot ? j : H, P = K.dot ? J : H, W = K.capture ? "" : "?:", Z = {
            negated: !1,
            prefix: ""
        }, G = K.bash === !0 ? ".*?" : M;
        if (K.capture) G = `(${G})`;
        let f = (L) => {
                if (L.noglobstar === !0) return G;
                return `(${W}(?:(?!${D}${L.dot?$:_}).)*?)`
            },
            v = (L) => {
                switch (L) {
                    case "*":
                        return `${X}${O}${G}`;
                    case ".*":
                        return `${_}${O}${G}`;
                    case "*.*":
                        return `${X}${G}${_}${O}${G}`;
                    case "*/*":
                        return `${X}${G}${w}${O}${P}${G}`;
                    case "**":
                        return X + f(K);
                    case "**/*":
                        return `(?:${X}${f(K)}${w})?${P}${O}${G}`;
                    case "**/*.*":
                        return `(?:${X}${f(K)}${w})?${P}${G}${_}${O}${G}`;
                    case "**/.*":
                        return `(?:${X}${f(K)}${w})?${_}${O}${G}`;
                    default: {
                        let h = /^(.*?)\.(\w+)$/.exec(L);
                        if (!h) return;
                        let R = v(h[1]);
                        if (!R) return;
                        return R + _ + h[2]
                    }
                }
            },
            N = $B.removePrefix(A, Z),
            V = v(N);
        if (V && K.strictSlashes !== !0) V += `${w}?`;
        return V
    };
    K14.exports = yf8
})
// @from(Ln 216110, Col 4)
w14 = x((zb2, _14) => {
    var UT9 = A14(),
        Lf8 = Y14(),
        z14 = AF6(),
        dT9 = eg6(),
        cT9 = (A) => A && typeof A === "object" && !Array.isArray(A),
        xj = (A, q, K = !1) => {
            if (Array.isArray(A)) {
                let j = A.map((M) => xj(M, q, K));
                return (M) => {
                    for (let D of j) {
                        let X = D(M);
                        if (X) return X
                    }
                    return !1
                }
            }
            let Y = cT9(A) && A.tokens && A.input;
            if (A === "" || typeof A !== "string" && !Y) throw TypeError("Expected pattern to be a non-empty string");
            let z = q || {},
                _ = z.windows,
                w = Y ? xj.compileRe(A, q) : xj.makeRe(A, q, !1, !0),
                O = w.state;
            delete w.state;
            let $ = () => !1;
            if (z.ignore) {
                let j = {
                    ...q,
                    ignore: null,
                    onMatch: null,
                    onResult: null
                };
                $ = xj(z.ignore, j, K)
            }
            let H = (j, J = !1) => {
                let {
                    isMatch: M,
                    match: D,
                    output: X
                } = xj.test(j, w, q, {
                    glob: A,
                    posix: _
                }), P = {
                    glob: A,
                    state: O,
                    regex: w,
                    posix: _,
                    input: j,
                    output: X,
                    match: D,
                    isMatch: M
                };
                if (typeof z.onResult === "function") z.onResult(P);
                if (M === !1) return P.isMatch = !1, J ? P : !1;
                if ($(j)) {
                    if (typeof z.onIgnore === "function") z.onIgnore(P);
                    return P.isMatch = !1, J ? P : !1
                }
                if (typeof z.onMatch === "function") z.onMatch(P);
                return J ? P : !0
            };
            if (K) H.state = O;
            return H
        };
    xj.test = (A, q, K, {
        glob: Y,
        posix: z
    } = {}) => {
        if (typeof A !== "string") throw TypeError("Expected input to be a string");
        if (A === "") return {
            isMatch: !1,
            output: ""
        };
        let _ = K || {},
            w = _.format || (z ? z14.toPosixSlashes : null),
            O = A === Y,
            $ = O && w ? w(A) : A;
        if (O === !1) $ = w ? w(A) : A, O = $ === Y;
        if (O === !1 || _.capture === !0)
            if (_.matchBase === !0 || _.basename === !0) O = xj.matchBase(A, q, K, z);
            else O = q.exec($);
        return {
            isMatch: Boolean(O),
            match: O,
            output: $
        }
    };
    xj.matchBase = (A, q, K) => {
        return (q instanceof RegExp ? q : xj.makeRe(q, K)).test(z14.basename(A))
    };
    xj.isMatch = (A, q, K) => xj(q, K)(A);
    xj.parse = (A, q) => {
        if (Array.isArray(A)) return A.map((K) => xj.parse(K, q));
        return Lf8(A, {
            ...q,
            fastpaths: !1
        })
    };
    xj.scan = (A, q) => UT9(A, q);
    xj.compileRe = (A, q, K = !1, Y = !1) => {
        if (K === !0) return A.output;
        let z = q || {},
            _ = z.contains ? "" : "^",
            w = z.contains ? "" : "$",
            O = `${_}(?:${A.output})${w}`;
        if (A && A.negated === !0) O = `^(?!${O}).*$`;
        let $ = xj.toRegex(O, q);
        if (Y === !0) $.state = A;
        return $
    };
    xj.makeRe = (A, q = {}, K = !1, Y = !1) => {
        if (!A || typeof A !== "string") throw TypeError("Expected a non-empty string");
        let z = {
            negated: !1,
            fastpaths: !0
        };
        if (q.fastpaths !== !1 && (A[0] === "." || A[0] === "*")) z.output = Lf8.fastpaths(A, q);
        if (!z.output) z = Lf8(A, q);
        return xj.compileRe(z, q, K, Y)
    };
    xj.toRegex = (A, q) => {
        try {
            let K = q || {};
            return new RegExp(A, K.flags || (K.nocase ? "i" : ""))
        } catch (K) {
            if (q && q.debug === !0) throw K;
            return /$^/
        }
    };
    xj.constants = dT9;
    _14.exports = xj
})
// @from(Ln 216242, Col 4)
j14 = x((_b2, H14) => {
    var O14 = w14(),
        lT9 = AF6();

    function $14(A, q, K = !1) {
        if (q && (q.windows === null || q.windows === void 0)) q = {
            ...q,
            windows: lT9.isWindows()
        };
        return O14(A, q, K)
    }
    Object.assign($14, O14);
    H14.exports = $14
})
// @from(Ln 216257, Col 0)
function hf8() {
    return {
        async: !1,
        breaks: !1,
        extensions: null,
        gfm: !0,
        hooks: null,
        pedantic: !1,
        renderer: null,
        silent: !1,
        tokenizer: null,
        walkTokens: null
    }
}
// @from(Ln 216272, Col 0)
function W14(A) {
    z36 = A
}
// @from(Ln 216276, Col 0)
function Q_(A, q = "") {
    let K = typeof A === "string" ? A : A.source,
        Y = {
            replace: (z, _) => {
                let w = typeof _ === "string" ? _ : _.source;
                return w = w.replace($f.caret, "$1"), K = K.replace(z, w), Y
            },
            getRegex: () => {
                return new RegExp(K, q)
            }
        };
    return Y
}
// @from(Ln 216290, Col 0)
function HB(A, q) {
    if (q) {
        if ($f.escapeTest.test(A)) return A.replace($f.escapeReplace, M14)
    } else if ($f.escapeTestNoEncode.test(A)) return A.replace($f.escapeReplaceNoEncode, M14);
    return A
}
// @from(Ln 216297, Col 0)
function D14(A) {
    try {
        A = encodeURI(A).replace($f.percentDecode, "%")
    } catch {
        return null
    }
    return A
}
// @from(Ln 216306, Col 0)
function X14(A, q) {
    let K = A.replace($f.findPipe, (_, w, O) => {
            let $ = !1,
                H = w;
            while (--H >= 0 && O[H] === "\\") $ = !$;
            if ($) return "|";
            else return " |"
        }),
        Y = K.split($f.splitPipe),
        z = 0;
    if (!Y[0].trim()) Y.shift();
    if (Y.length > 0 && !Y.at(-1)?.trim()) Y.pop();
    if (q)
        if (Y.length > q) Y.splice(q);
        else
            while (Y.length < q) Y.push("");
    for (; z < Y.length; z++) Y[z] = Y[z].trim().replace($f.slashPipe, "|");
    return Y
}
// @from(Ln 216326, Col 0)
function YF6(A, q, K) {
    let Y = A.length;
    if (Y === 0) return "";
    let z = 0;
    while (z < Y)
        if (A.charAt(Y - z - 1) === q) z++;
        else break;
    return A.slice(0, Y - z)
}
// @from(Ln 216336, Col 0)
function kv9(A, q) {
    if (A.indexOf(q[1]) === -1) return -1;
    let K = 0;
    for (let Y = 0; Y < A.length; Y++)
        if (A[Y] === "\\") Y++;
        else if (A[Y] === q[0]) K++;
    else if (A[Y] === q[1]) {
        if (K--, K < 0) return Y
    }
    return -1
}
// @from(Ln 216348, Col 0)
function P14(A, q, K, Y, z) {
    let _ = q.href,
        w = q.title || null,
        O = A[1].replace(z.other.outputLinkReplace, "$1");
    if (A[0].charAt(0) !== "!") {
        Y.state.inLink = !0;
        let $ = {
            type: "link",
            raw: K,
            href: _,
            title: w,
            text: O,
            tokens: Y.inlineTokens(O)
        };
        return Y.state.inLink = !1, $
    }
    return {
        type: "image",
        raw: K,
        href: _,
        title: w,
        text: O
    }
}
// @from(Ln 216373, Col 0)
function Ev9(A, q, K) {
    let Y = A.match(K.other.indentCodeCompensation);
    if (Y === null) return q;
    let z = Y[1];
    return q.split(`
`).map((_) => {
        let w = _.match(K.other.beginningSpace);
        if (w === null) return _;
        let [O] = w;
        if (O.length >= z.length) return _.slice(z.length);
        return _
    }).join(`
`)
}
// @from(Ln 216387, Col 0)
class wF6 {
    options;
    rules;
    lexer;
    constructor(A) {
        this.options = A || z36
    }
    space(A) {
        let q = this.rules.block.newline.exec(A);
        if (q && q[0].length > 0) return {
            type: "space",
            raw: q[0]
        }
    }
    code(A) {
        let q = this.rules.block.code.exec(A);
        if (q) {
            let K = q[0].replace(this.rules.other.codeRemoveIndent, "");
            return {
                type: "code",
                raw: q[0],
                codeBlockStyle: "indented",
                text: !this.options.pedantic ? YF6(K, `
`) : K
            }
        }
    }
    fences(A) {
        let q = this.rules.block.fences.exec(A);
        if (q) {
            let K = q[0],
                Y = Ev9(K, q[3] || "", this.rules);
            return {
                type: "code",
                raw: K,
                lang: q[2] ? q[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : q[2],
                text: Y
            }
        }
    }
    heading(A) {
        let q = this.rules.block.heading.exec(A);
        if (q) {
            let K = q[2].trim();
            if (this.rules.other.endingHash.test(K)) {
                let Y = YF6(K, "#");
                if (this.options.pedantic) K = Y.trim();
                else if (!Y || this.rules.other.endingSpaceChar.test(Y)) K = Y.trim()
            }
            return {
                type: "heading",
                raw: q[0],
                depth: q[1].length,
                text: K,
                tokens: this.lexer.inline(K)
            }
        }
    }
    hr(A) {
        let q = this.rules.block.hr.exec(A);
        if (q) return {
            type: "hr",
            raw: YF6(q[0], `
`)
        }
    }
    blockquote(A) {
        let q = this.rules.block.blockquote.exec(A);
        if (q) {
            let K = YF6(q[0], `
`).split(`
`),
                Y = "",
                z = "",
                _ = [];
            while (K.length > 0) {
                let w = !1,
                    O = [],
                    $;
                for ($ = 0; $ < K.length; $++)
                    if (this.rules.other.blockquoteStart.test(K[$])) O.push(K[$]), w = !0;
                    else if (!w) O.push(K[$]);
                else break;
                K = K.slice($);
                let H = O.join(`
`),
                    j = H.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
                Y = Y ? `${Y}
${H}` : H, z = z ? `${z}
${j}` : j;
                let J = this.lexer.state.top;
                if (this.lexer.state.top = !0, this.lexer.blockTokens(j, _, !0), this.lexer.state.top = J, K.length === 0) break;
                let M = _.at(-1);
                if (M?.type === "code") break;
                else if (M?.type === "blockquote") {
                    let D = M,
                        X = D.raw + `
` + K.join(`
`),
                        P = this.blockquote(X);
                    _[_.length - 1] = P, Y = Y.substring(0, Y.length - D.raw.length) + P.raw, z = z.substring(0, z.length - D.text.length) + P.text;
                    break
                } else if (M?.type === "list") {
                    let D = M,
                        X = D.raw + `
` + K.join(`
`),
                        P = this.list(X);
                    _[_.length - 1] = P, Y = Y.substring(0, Y.length - M.raw.length) + P.raw, z = z.substring(0, z.length - D.raw.length) + P.raw, K = X.substring(_.at(-1).raw.length).split(`
`);
                    continue
                }
            }
            return {
                type: "blockquote",
                raw: Y,
                tokens: _,
                text: z
            }
        }
    }
    list(A) {
        let q = this.rules.block.list.exec(A);
        if (q) {
            let K = q[1].trim(),
                Y = K.length > 1,
                z = {
                    type: "list",
                    raw: "",
                    ordered: Y,
                    start: Y ? +K.slice(0, -1) : "",
                    loose: !1,
                    items: []
                };
            if (K = Y ? `\\d{1,9}\\${K.slice(-1)}` : `\\${K}`, this.options.pedantic) K = Y ? K : "[*+-]";
            let _ = this.rules.other.listItemRegex(K),
                w = !1;
            while (A) {
                let $ = !1,
                    H = "",
                    j = "";
                if (!(q = _.exec(A))) break;
                if (this.rules.block.hr.test(A)) break;
                H = q[0], A = A.substring(H.length);
                let J = q[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (Z) => " ".repeat(3 * Z.length)),
                    M = A.split(`
`, 1)[0],
                    D = !J.trim(),
                    X = 0;
                if (this.options.pedantic) X = 2, j = J.trimStart();
                else if (D) X = q[1].length + 1;
                else X = q[2].search(this.rules.other.nonSpaceChar), X = X > 4 ? 1 : X, j = J.slice(X), X += q[1].length;
                if (D && this.rules.other.blankLine.test(M)) H += M + `
`, A = A.substring(M.length + 1), $ = !0;
                if (!$) {
                    let Z = this.rules.other.nextBulletRegex(X),
                        G = this.rules.other.hrRegex(X),
                        f = this.rules.other.fencesBeginRegex(X),
                        v = this.rules.other.headingBeginRegex(X),
                        N = this.rules.other.htmlBeginRegex(X);
                    while (A) {
                        let V = A.split(`
`, 1)[0],
                            L;
                        if (M = V, this.options.pedantic) M = M.replace(this.rules.other.listReplaceNesting, "  "), L = M;
                        else L = M.replace(this.rules.other.tabCharGlobal, "    ");
                        if (f.test(M)) break;
                        if (v.test(M)) break;
                        if (N.test(M)) break;
                        if (Z.test(M)) break;
                        if (G.test(M)) break;
                        if (L.search(this.rules.other.nonSpaceChar) >= X || !M.trim()) j += `
` + L.slice(X);
                        else {
                            if (D) break;
                            if (J.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) break;
                            if (f.test(J)) break;
                            if (v.test(J)) break;
                            if (G.test(J)) break;
                            j += `
` + M
                        }
                        if (!D && !M.trim()) D = !0;
                        H += V + `
`, A = A.substring(V.length + 1), J = L.slice(X)
                    }
                }
                if (!z.loose) {
                    if (w) z.loose = !0;
                    else if (this.rules.other.doubleBlankLine.test(H)) w = !0
                }
                let P = null,
                    W;
                if (this.options.gfm) {
                    if (P = this.rules.other.listIsTask.exec(j), P) W = P[0] !== "[ ] ", j = j.replace(this.rules.other.listReplaceTask, "")
                }
                z.items.push({
                    type: "list_item",
                    raw: H,
                    task: !!P,
                    checked: W,
                    loose: !1,
                    text: j,
                    tokens: []
                }), z.raw += H
            }
            let O = z.items.at(-1);
            if (O) O.raw = O.raw.trimEnd(), O.text = O.text.trimEnd();
            else return;
            z.raw = z.raw.trimEnd();
            for (let $ = 0; $ < z.items.length; $++)
                if (this.lexer.state.top = !1, z.items[$].tokens = this.lexer.blockTokens(z.items[$].text, []), !z.loose) {
                    let H = z.items[$].tokens.filter((J) => J.type === "space"),
                        j = H.length > 0 && H.some((J) => this.rules.other.anyLine.test(J.raw));
                    z.loose = j
                } if (z.loose)
                for (let $ = 0; $ < z.items.length; $++) z.items[$].loose = !0;
            return z
        }
    }
    html(A) {
        let q = this.rules.block.html.exec(A);
        if (q) return {
            type: "html",
            block: !0,
            raw: q[0],
            pre: q[1] === "pre" || q[1] === "script" || q[1] === "style",
            text: q[0]
        }
    }
    def(A) {
        let q = this.rules.block.def.exec(A);
        if (q) {
            let K = q[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "),
                Y = q[2] ? q[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "",
                z = q[3] ? q[3].substring(1, q[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : q[3];
            return {
                type: "def",
                tag: K,
                raw: q[0],
                href: Y,
                title: z
            }
        }
    }
    table(A) {
        let q = this.rules.block.table.exec(A);
        if (!q) return;
        if (!this.rules.other.tableDelimiter.test(q[2])) return;
        let K = X14(q[1]),
            Y = q[2].replace(this.rules.other.tableAlignChars, "").split("|"),
            z = q[3]?.trim() ? q[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [],
            _ = {
                type: "table",
                raw: q[0],
                header: [],
                align: [],
                rows: []
            };
        if (K.length !== Y.length) return;
        for (let w of Y)
            if (this.rules.other.tableAlignRight.test(w)) _.align.push("right");
            else if (this.rules.other.tableAlignCenter.test(w)) _.align.push("center");
        else if (this.rules.other.tableAlignLeft.test(w)) _.align.push("left");
        else _.align.push(null);
        for (let w = 0; w < K.length; w++) _.header.push({
            text: K[w],
            tokens: this.lexer.inline(K[w]),
            header: !0,
            align: _.align[w]
        });
        for (let w of z) _.rows.push(X14(w, _.header.length).map((O, $) => {
            return {
                text: O,
                tokens: this.lexer.inline(O),
                header: !1,
                align: _.align[$]
            }
        }));
        return _
    }
    lheading(A) {
        let q = this.rules.block.lheading.exec(A);
        if (q) return {
            type: "heading",
            raw: q[0],
            depth: q[2].charAt(0) === "=" ? 1 : 2,
            text: q[1],
            tokens: this.lexer.inline(q[1])
        }
    }
    paragraph(A) {
        let q = this.rules.block.paragraph.exec(A);
        if (q) {
            let K = q[1].charAt(q[1].length - 1) === `
` ? q[1].slice(0, -1) : q[1];
            return {
                type: "paragraph",
                raw: q[0],
                text: K,
                tokens: this.lexer.inline(K)
            }
        }
    }
    text(A) {
        let q = this.rules.block.text.exec(A);
        if (q) return {
            type: "text",
            raw: q[0],
            text: q[0],
            tokens: this.lexer.inline(q[0])
        }
    }
    escape(A) {
        let q = this.rules.inline.escape.exec(A);
        if (q) return {
            type: "escape",
            raw: q[0],
            text: q[1]
        }
    }
    tag(A) {
        let q = this.rules.inline.tag.exec(A);
        if (q) {
            if (!this.lexer.state.inLink && this.rules.other.startATag.test(q[0])) this.lexer.state.inLink = !0;
            else if (this.lexer.state.inLink && this.rules.other.endATag.test(q[0])) this.lexer.state.inLink = !1;
            if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(q[0])) this.lexer.state.inRawBlock = !0;
            else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(q[0])) this.lexer.state.inRawBlock = !1;
            return {
                type: "html",
                raw: q[0],
                inLink: this.lexer.state.inLink,
                inRawBlock: this.lexer.state.inRawBlock,
                block: !1,
                text: q[0]
            }
        }
    }
    link(A) {
        let q = this.rules.inline.link.exec(A);
        if (q) {
            let K = q[2].trim();
            if (!this.options.pedantic && this.rules.other.startAngleBracket.test(K)) {
                if (!this.rules.other.endAngleBracket.test(K)) return;
                let _ = YF6(K.slice(0, -1), "\\");
                if ((K.length - _.length) % 2 === 0) return
            } else {
                let _ = kv9(q[2], "()");
                if (_ > -1) {
                    let O = (q[0].indexOf("!") === 0 ? 5 : 4) + q[1].length + _;
                    q[2] = q[2].substring(0, _), q[0] = q[0].substring(0, O).trim(), q[3] = ""
                }
            }
            let Y = q[2],
                z = "";
            if (this.options.pedantic) {
                let _ = this.rules.other.pedanticHrefTitle.exec(Y);
                if (_) Y = _[1], z = _[3]
            } else z = q[3] ? q[3].slice(1, -1) : "";
            if (Y = Y.trim(), this.rules.other.startAngleBracket.test(Y))
                if (this.options.pedantic && !this.rules.other.endAngleBracket.test(K)) Y = Y.slice(1);
                else Y = Y.slice(1, -1);
            return P14(q, {
                href: Y ? Y.replace(this.rules.inline.anyPunctuation, "$1") : Y,
                title: z ? z.replace(this.rules.inline.anyPunctuation, "$1") : z
            }, q[0], this.lexer, this.rules)
        }
    }
    reflink(A, q) {
        let K;
        if ((K = this.rules.inline.reflink.exec(A)) || (K = this.rules.inline.nolink.exec(A))) {
            let Y = (K[2] || K[1]).replace(this.rules.other.multipleSpaceGlobal, " "),
                z = q[Y.toLowerCase()];
            if (!z) {
                let _ = K[0].charAt(0);
                return {
                    type: "text",
                    raw: _,
                    text: _
                }
            }
            return P14(K, z, K[0], this.lexer, this.rules)
        }
    }
    emStrong(A, q, K = "") {
        let Y = this.rules.inline.emStrongLDelim.exec(A);
        if (!Y) return;
        if (Y[3] && K.match(this.rules.other.unicodeAlphaNumeric)) return;
        if (!(Y[1] || Y[2]) || !K || this.rules.inline.punctuation.exec(K)) {
            let _ = [...Y[0]].length - 1,
                w, O, $ = _,
                H = 0,
                j = Y[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
            j.lastIndex = 0, q = q.slice(-1 * A.length + _);
            while ((Y = j.exec(q)) != null) {
                if (w = Y[1] || Y[2] || Y[3] || Y[4] || Y[5] || Y[6], !w) continue;
                if (O = [...w].length, Y[3] || Y[4]) {
                    $ += O;
                    continue
                } else if (Y[5] || Y[6]) {
                    if (_ % 3 && !((_ + O) % 3)) {
                        H += O;
                        continue
                    }
                }
                if ($ -= O, $ > 0) continue;
                O = Math.min(O, O + $ + H);
                let J = [...Y[0]][0].length,
                    M = A.slice(0, _ + Y.index + J + O);
                if (Math.min(_, O) % 2) {
                    let X = M.slice(1, -1);
                    return {
                        type: "em",
                        raw: M,
                        text: X,
                        tokens: this.lexer.inlineTokens(X)
                    }
                }
                let D = M.slice(2, -2);
                return {
                    type: "strong",
                    raw: M,
                    text: D,
                    tokens: this.lexer.inlineTokens(D)
                }
            }
        }
    }
    codespan(A) {
        let q = this.rules.inline.code.exec(A);
        if (q) {
            let K = q[2].replace(this.rules.other.newLineCharGlobal, " "),
                Y = this.rules.other.nonSpaceChar.test(K),
                z = this.rules.other.startingSpaceChar.test(K) && this.rules.other.endingSpaceChar.test(K);
            if (Y && z) K = K.substring(1, K.length - 1);
            return {
                type: "codespan",
                raw: q[0],
                text: K
            }
        }
    }
    br(A) {
        let q = this.rules.inline.br.exec(A);
        if (q) return {
            type: "br",
            raw: q[0]
        }
    }
    del(A) {
        let q = this.rules.inline.del.exec(A);
        if (q) return {
            type: "del",
            raw: q[0],
            text: q[2],
            tokens: this.lexer.inlineTokens(q[2])
        }
    }
    autolink(A) {
        let q = this.rules.inline.autolink.exec(A);
        if (q) {
            let K, Y;
            if (q[2] === "@") K = q[1], Y = "mailto:" + K;
            else K = q[1], Y = K;
            return {
                type: "link",
                raw: q[0],
                text: K,
                href: Y,
                tokens: [{
                    type: "text",
                    raw: K,
                    text: K
                }]
            }
        }
    }
    url(A) {
        let q;
        if (q = this.rules.inline.url.exec(A)) {
            let K, Y;
            if (q[2] === "@") K = q[0], Y = "mailto:" + K;
            else {
                let z;
                do z = q[0], q[0] = this.rules.inline._backpedal.exec(q[0])?.[0] ?? ""; while (z !== q[0]);
                if (K = q[0], q[1] === "www.") Y = "http://" + q[0];
                else Y = q[0]
            }
            return {
                type: "link",
                raw: q[0],
                text: K,
                href: Y,
                tokens: [{
                    type: "text",
                    raw: K,
                    text: K
                }]
            }
        }
    }
    inlineText(A) {
        let q = this.rules.inline.text.exec(A);
        if (q) {
            let K = this.lexer.state.inRawBlock;
            return {
                type: "text",
                raw: q[0],
                text: q[0],
                escaped: K
            }
        }
    }
}
// @from(Ln 216904, Col 0)
class tW {
    tokens;
    options;
    state;
    tokenizer;
    inlineQueue;
    constructor(A) {
        this.tokens = [], this.tokens.links = Object.create(null), this.options = A || z36, this.options.tokenizer = this.options.tokenizer || new wF6, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
            inLink: !1,
            inRawBlock: !1,
            top: !0
        };
        let q = {
            other: $f,
            block: TD1.normal,
            inline: KF6.normal
        };
        if (this.options.pedantic) q.block = TD1.pedantic, q.inline = KF6.pedantic;
        else if (this.options.gfm)
            if (q.block = TD1.gfm, this.options.breaks) q.inline = KF6.breaks;
            else q.inline = KF6.gfm;
        this.tokenizer.rules = q
    }
    static get rules() {
        return {
            block: TD1,
            inline: KF6
        }
    }
    static lex(A, q) {
        return new tW(q).lex(A)
    }
    static lexInline(A, q) {
        return new tW(q).inlineTokens(A)
    }
    lex(A) {
        A = A.replace($f.carriageReturn, `
`), this.blockTokens(A, this.tokens);
        for (let q = 0; q < this.inlineQueue.length; q++) {
            let K = this.inlineQueue[q];
            this.inlineTokens(K.src, K.tokens)
        }
        return this.inlineQueue = [], this.tokens
    }
    blockTokens(A, q = [], K = !1) {
        if (this.options.pedantic) A = A.replace($f.tabCharGlobal, "    ").replace($f.spaceLine, "");
        while (A) {
            let Y;
            if (this.options.extensions?.block?.some((_) => {
                    if (Y = _.call({
                            lexer: this
                        }, A, q)) return A = A.substring(Y.raw.length), q.push(Y), !0;
                    return !1
                })) continue;
            if (Y = this.tokenizer.space(A)) {
                A = A.substring(Y.raw.length);
                let _ = q.at(-1);
                if (Y.raw.length === 1 && _ !== void 0) _.raw += `
`;
                else q.push(Y);
                continue
            }
            if (Y = this.tokenizer.code(A)) {
                A = A.substring(Y.raw.length);
                let _ = q.at(-1);
                if (_?.type === "paragraph" || _?.type === "text") _.raw += `
` + Y.raw, _.text += `
` + Y.text, this.inlineQueue.at(-1).src = _.text;
                else q.push(Y);
                continue
            }
            if (Y = this.tokenizer.fences(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.heading(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.hr(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.blockquote(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.list(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.html(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.def(A)) {
                A = A.substring(Y.raw.length);
                let _ = q.at(-1);
                if (_?.type === "paragraph" || _?.type === "text") _.raw += `
` + Y.raw, _.text += `
` + Y.raw, this.inlineQueue.at(-1).src = _.text;
                else if (!this.tokens.links[Y.tag]) this.tokens.links[Y.tag] = {
                    href: Y.href,
                    title: Y.title
                };
                continue
            }
            if (Y = this.tokenizer.table(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.lheading(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            let z = A;
            if (this.options.extensions?.startBlock) {
                let _ = 1 / 0,
                    w = A.slice(1),
                    O;
                if (this.options.extensions.startBlock.forEach(($) => {
                        if (O = $.call({
                                lexer: this
                            }, w), typeof O === "number" && O >= 0) _ = Math.min(_, O)
                    }), _ < 1 / 0 && _ >= 0) z = A.substring(0, _ + 1)
            }
            if (this.state.top && (Y = this.tokenizer.paragraph(z))) {
                let _ = q.at(-1);
                if (K && _?.type === "paragraph") _.raw += `
` + Y.raw, _.text += `
` + Y.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = _.text;
                else q.push(Y);
                K = z.length !== A.length, A = A.substring(Y.raw.length);
                continue
            }
            if (Y = this.tokenizer.text(A)) {
                A = A.substring(Y.raw.length);
                let _ = q.at(-1);
                if (_?.type === "text") _.raw += `
` + Y.raw, _.text += `
` + Y.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = _.text;
                else q.push(Y);
                continue
            }
            if (A) {
                let _ = "Infinite loop on byte: " + A.charCodeAt(0);
                if (this.options.silent) {
                    console.error(_);
                    break
                } else throw Error(_)
            }
        }
        return this.state.top = !0, q
    }
    inline(A, q = []) {
        return this.inlineQueue.push({
            src: A,
            tokens: q
        }), q
    }
    inlineTokens(A, q = []) {
        let K = A,
            Y = null;
        if (this.tokens.links) {
            let w = Object.keys(this.tokens.links);
            if (w.length > 0) {
                while ((Y = this.tokenizer.rules.inline.reflinkSearch.exec(K)) != null)
                    if (w.includes(Y[0].slice(Y[0].lastIndexOf("[") + 1, -1))) K = K.slice(0, Y.index) + "[" + "a".repeat(Y[0].length - 2) + "]" + K.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex)
            }
        }
        while ((Y = this.tokenizer.rules.inline.blockSkip.exec(K)) != null) K = K.slice(0, Y.index) + "[" + "a".repeat(Y[0].length - 2) + "]" + K.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        while ((Y = this.tokenizer.rules.inline.anyPunctuation.exec(K)) != null) K = K.slice(0, Y.index) + "++" + K.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
        let z = !1,
            _ = "";
        while (A) {
            if (!z) _ = "";
            z = !1;
            let w;
            if (this.options.extensions?.inline?.some(($) => {
                    if (w = $.call({
                            lexer: this
                        }, A, q)) return A = A.substring(w.raw.length), q.push(w), !0;
                    return !1
                })) continue;
            if (w = this.tokenizer.escape(A)) {
                A = A.substring(w.raw.length), q.push(w);
                continue
            }
            if (w = this.tokenizer.tag(A)) {
                A = A.substring(w.raw.length), q.push(w);
                continue
            }
            if (w = this.tokenizer.link(A)) {
                A = A.substring(w.raw.length), q.push(w);
                continue
            }
            if (w = this.tokenizer.reflink(A, this.tokens.links)) {
                A = A.substring(w.raw.length);
                let $ = q.at(-1);
                if (w.type === "text" && $?.type === "text") $.raw += w.raw, $.text += w.text;
                else q.push(w);
                continue
            }
            if (w = this.tokenizer.emStrong(A, K, _)) {
                A = A.substring(w.raw.length), q.push(w);
                continue
            }
            if (w = this.tokenizer.codespan(A)) {
                A = A.substring(w.raw.length), q.push(w);
                continue
            }
            if (w = this.tokenizer.br(A)) {
                A = A.substring(w.raw.length), q.push(w);
                continue
            }
            if (w = this.tokenizer.del(A)) {
                A = A.substring(w.raw.length), q.push(w);
                continue
            }
            if (w = this.tokenizer.autolink(A)) {
                A = A.substring(w.raw.length), q.push(w);
                continue
            }
            if (!this.state.inLink && (w = this.tokenizer.url(A))) {
                A = A.substring(w.raw.length), q.push(w);
                continue
            }
            let O = A;
            if (this.options.extensions?.startInline) {
                let $ = 1 / 0,
                    H = A.slice(1),
                    j;
                if (this.options.extensions.startInline.forEach((J) => {
                        if (j = J.call({
                                lexer: this
                            }, H), typeof j === "number" && j >= 0) $ = Math.min($, j)
                    }), $ < 1 / 0 && $ >= 0) O = A.substring(0, $ + 1)
            }
            if (w = this.tokenizer.inlineText(O)) {
                if (A = A.substring(w.raw.length), w.raw.slice(-1) !== "_") _ = w.raw.slice(-1);
                z = !0;
                let $ = q.at(-1);
                if ($?.type === "text") $.raw += w.raw, $.text += w.text;
                else q.push(w);
                continue
            }
            if (A) {
                let $ = "Infinite loop on byte: " + A.charCodeAt(0);
                if (this.options.silent) {
                    console.error($);
                    break
                } else throw Error($)
            }
        }
        return q
    }
}
// @from(Ln 217161, Col 0)
class OF6 {
    options;
    parser;
    constructor(A) {
        this.options = A || z36
    }
    space(A) {
        return ""
    }
    code({
        text: A,
        lang: q,
        escaped: K
    }) {
        let Y = (q || "").match($f.notSpaceStart)?.[0],
            z = A.replace($f.endingNewline, "") + `
`;
        if (!Y) return "<pre><code>" + (K ? z : HB(z, !0)) + `</code></pre>
`;
        return '<pre><code class="language-' + HB(Y) + '">' + (K ? z : HB(z, !0)) + `</code></pre>
`
    }
    blockquote({
        tokens: A
    }) {
        return `<blockquote>
${this.parser.parse(A)}</blockquote>
`
    }
    html({
        text: A
    }) {
        return A
    }
    heading({
        tokens: A,
        depth: q
    }) {
        return `<h${q}>${this.parser.parseInline(A)}</h${q}>
`
    }
    hr(A) {
        return `<hr>
`
    }
    list(A) {
        let {
            ordered: q,
            start: K
        } = A, Y = "";
        for (let w = 0; w < A.items.length; w++) {
            let O = A.items[w];
            Y += this.listitem(O)
        }
        let z = q ? "ol" : "ul",
            _ = q && K !== 1 ? ' start="' + K + '"' : "";
        return "<" + z + _ + `>
` + Y + "</" + z + `>
`
    }
    listitem(A) {
        let q = "";
        if (A.task) {
            let K = this.checkbox({
                checked: !!A.checked
            });
            if (A.loose)
                if (A.tokens[0]?.type === "paragraph") {
                    if (A.tokens[0].text = K + " " + A.tokens[0].text, A.tokens[0].tokens && A.tokens[0].tokens.length > 0 && A.tokens[0].tokens[0].type === "text") A.tokens[0].tokens[0].text = K + " " + HB(A.tokens[0].tokens[0].text), A.tokens[0].tokens[0].escaped = !0
                } else A.tokens.unshift({
                    type: "text",
                    raw: K + " ",
                    text: K + " ",
                    escaped: !0
                });
            else q += K + " "
        }
        return q += this.parser.parse(A.tokens, !!A.loose), `<li>${q}</li>
`
    }
    checkbox({
        checked: A
    }) {
        return "<input " + (A ? 'checked="" ' : "") + 'disabled="" type="checkbox">'
    }
    paragraph({
        tokens: A
    }) {
        return `<p>${this.parser.parseInline(A)}</p>
`
    }
    table(A) {
        let q = "",
            K = "";
        for (let z = 0; z < A.header.length; z++) K += this.tablecell(A.header[z]);
        q += this.tablerow({
            text: K
        });
        let Y = "";
        for (let z = 0; z < A.rows.length; z++) {
            let _ = A.rows[z];
            K = "";
            for (let w = 0; w < _.length; w++) K += this.tablecell(_[w]);
            Y += this.tablerow({
                text: K
            })
        }
        if (Y) Y = `<tbody>${Y}</tbody>`;
        return `<table>
<thead>
` + q + `</thead>
` + Y + `</table>
`
    }
    tablerow({
        text: A
    }) {
        return `<tr>
${A}</tr>
`
    }
    tablecell(A) {
        let q = this.parser.parseInline(A.tokens),
            K = A.header ? "th" : "td";
        return (A.align ? `<${K} align="${A.align}">` : `<${K}>`) + q + `</${K}>
`
    }
    strong({
        tokens: A
    }) {
        return `<strong>${this.parser.parseInline(A)}</strong>`
    }
    em({
        tokens: A
    }) {
        return `<em>${this.parser.parseInline(A)}</em>`
    }
    codespan({
        text: A
    }) {
        return `<code>${HB(A,!0)}</code>`
    }
    br(A) {
        return "<br>"
    }
    del({
        tokens: A
    }) {
        return `<del>${this.parser.parseInline(A)}</del>`
    }
    link({
        href: A,
        title: q,
        tokens: K
    }) {
        let Y = this.parser.parseInline(K),
            z = D14(A);
        if (z === null) return Y;
        A = z;
        let _ = '<a href="' + A + '"';
        if (q) _ += ' title="' + HB(q) + '"';
        return _ += ">" + Y + "</a>", _
    }
    image({
        href: A,
        title: q,
        text: K
    }) {
        let Y = D14(A);
        if (Y === null) return HB(K);
        A = Y;
        let z = `<img src="${A}" alt="${K}"`;
        if (q) z += ` title="${HB(q)}"`;
        return z += ">", z
    }
    text(A) {
        return "tokens" in A && A.tokens ? this.parser.parseInline(A.tokens) : ("escaped" in A) && A.escaped ? A.text : HB(A.text)
    }
}
// @from(Ln 217340, Col 0)
class kD1 {
    strong({
        text: A
    }) {
        return A
    }
    em({
        text: A
    }) {
        return A
    }
    codespan({
        text: A
    }) {
        return A
    }
    del({
        text: A
    }) {
        return A
    }
    html({
        text: A
    }) {
        return A
    }
    text({
        text: A
    }) {
        return A
    }
    link({
        text: A
    }) {
        return "" + A
    }
    image({
        text: A
    }) {
        return "" + A
    }
    br() {
        return ""
    }
}
// @from(Ln 217385, Col 0)
class _R {
    options;
    renderer;
    textRenderer;
    constructor(A) {
        this.options = A || z36, this.options.renderer = this.options.renderer || new OF6, this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new kD1
    }
    static parse(A, q) {
        return new _R(q).parse(A)
    }
    static parseInline(A, q) {
        return new _R(q).parseInline(A)
    }
    parse(A, q = !0) {
        let K = "";
        for (let Y = 0; Y < A.length; Y++) {
            let z = A[Y];
            if (this.options.extensions?.renderers?.[z.type]) {
                let w = z,
                    O = this.options.extensions.renderers[w.type].call({
                        parser: this
                    }, w);
                if (O !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(w.type)) {
                    K += O || "";
                    continue
                }
            }
            let _ = z;
            switch (_.type) {
                case "space": {
                    K += this.renderer.space(_);
                    continue
                }
                case "hr": {
                    K += this.renderer.hr(_);
                    continue
                }
                case "heading": {
                    K += this.renderer.heading(_);
                    continue
                }
                case "code": {
                    K += this.renderer.code(_);
                    continue
                }
                case "table": {
                    K += this.renderer.table(_);
                    continue
                }
                case "blockquote": {
                    K += this.renderer.blockquote(_);
                    continue
                }
                case "list": {
                    K += this.renderer.list(_);
                    continue
                }
                case "html": {
                    K += this.renderer.html(_);
                    continue
                }
                case "paragraph": {
                    K += this.renderer.paragraph(_);
                    continue
                }
                case "text": {
                    let w = _,
                        O = this.renderer.text(w);
                    while (Y + 1 < A.length && A[Y + 1].type === "text") w = A[++Y], O += `
` + this.renderer.text(w);
                    if (q) K += this.renderer.paragraph({
                        type: "paragraph",
                        raw: O,
                        text: O,
                        tokens: [{
                            type: "text",
                            raw: O,
                            text: O,
                            escaped: !0
                        }]
                    });
                    else K += O;
                    continue
                }
                default: {
                    let w = 'Token with "' + _.type + '" type was not found.';
                    if (this.options.silent) return console.error(w), "";
                    else throw Error(w)
                }
            }
        }
        return K
    }
    parseInline(A, q = this.renderer) {
        let K = "";
        for (let Y = 0; Y < A.length; Y++) {
            let z = A[Y];
            if (this.options.extensions?.renderers?.[z.type]) {
                let w = this.options.extensions.renderers[z.type].call({
                    parser: this
                }, z);
                if (w !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(z.type)) {
                    K += w || "";
                    continue
                }
            }
            let _ = z;
            switch (_.type) {
                case "escape": {
                    K += q.text(_);
                    break
                }
                case "html": {
                    K += q.html(_);
                    break
                }
                case "link": {
                    K += q.link(_);
                    break
                }
                case "image": {
                    K += q.image(_);
                    break
                }
                case "strong": {
                    K += q.strong(_);
                    break
                }
                case "em": {
                    K += q.em(_);
                    break
                }
                case "codespan": {
                    K += q.codespan(_);
                    break
                }
                case "br": {
                    K += q.br(_);
                    break
                }
                case "del": {
                    K += q.del(_);
                    break
                }
                case "text": {
                    K += q.text(_);
                    break
                }
                default: {
                    let w = 'Token with "' + _.type + '" type was not found.';
                    if (this.options.silent) return console.error(w), "";
                    else throw Error(w)
                }
            }
        }
        return K
    }
}
// @from(Ln 217543, Col 0)
class L14 {
    defaults = hf8();
    options = this.setOptions;
    parse = this.parseMarkdown(!0);
    parseInline = this.parseMarkdown(!1);
    Parser = _R;
    Renderer = OF6;
    TextRenderer = kD1;
    Lexer = tW;
    Tokenizer = wF6;
    Hooks = _F6;
    constructor(...A) {
        this.use(...A)
    }
    walkTokens(A, q) {
        let K = [];
        for (let Y of A) switch (K = K.concat(q.call(this, Y)), Y.type) {
            case "table": {
                let z = Y;
                for (let _ of z.header) K = K.concat(this.walkTokens(_.tokens, q));
                for (let _ of z.rows)
                    for (let w of _) K = K.concat(this.walkTokens(w.tokens, q));
                break
            }
            case "list": {
                let z = Y;
                K = K.concat(this.walkTokens(z.items, q));
                break
            }
            default: {
                let z = Y;
                if (this.defaults.extensions?.childTokens?.[z.type]) this.defaults.extensions.childTokens[z.type].forEach((_) => {
                    let w = z[_].flat(1 / 0);
                    K = K.concat(this.walkTokens(w, q))
                });
                else if (z.tokens) K = K.concat(this.walkTokens(z.tokens, q))
            }
        }
        return K
    }
    use(...A) {
        let q = this.defaults.extensions || {
            renderers: {},
            childTokens: {}
        };
        return A.forEach((K) => {
            let Y = {
                ...K
            };
            if (Y.async = this.defaults.async || Y.async || !1, K.extensions) K.extensions.forEach((z) => {
                if (!z.name) throw Error("extension name required");
                if ("renderer" in z) {
                    let _ = q.renderers[z.name];
                    if (_) q.renderers[z.name] = function(...w) {
                        let O = z.renderer.apply(this, w);
                        if (O === !1) O = _.apply(this, w);
                        return O
                    };
                    else q.renderers[z.name] = z.renderer
                }
                if ("tokenizer" in z) {
                    if (!z.level || z.level !== "block" && z.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
                    let _ = q[z.level];
                    if (_) _.unshift(z.tokenizer);
                    else q[z.level] = [z.tokenizer];
                    if (z.start) {
                        if (z.level === "block")
                            if (q.startBlock) q.startBlock.push(z.start);
                            else q.startBlock = [z.start];
                        else if (z.level === "inline")
                            if (q.startInline) q.startInline.push(z.start);
                            else q.startInline = [z.start]
                    }
                }
                if ("childTokens" in z && z.childTokens) q.childTokens[z.name] = z.childTokens
            }), Y.extensions = q;
            if (K.renderer) {
                let z = this.defaults.renderer || new OF6(this.defaults);
                for (let _ in K.renderer) {
                    if (!(_ in z)) throw Error(`renderer '${_}' does not exist`);
                    if (["options", "parser"].includes(_)) continue;
                    let w = _,
                        O = K.renderer[w],
                        $ = z[w];
                    z[w] = (...H) => {
                        let j = O.apply(z, H);
                        if (j === !1) j = $.apply(z, H);
                        return j || ""
                    }
                }
                Y.renderer = z
            }
            if (K.tokenizer) {
                let z = this.defaults.tokenizer || new wF6(this.defaults);
                for (let _ in K.tokenizer) {
                    if (!(_ in z)) throw Error(`tokenizer '${_}' does not exist`);
                    if (["options", "rules", "lexer"].includes(_)) continue;
                    let w = _,
                        O = K.tokenizer[w],
                        $ = z[w];
                    z[w] = (...H) => {
                        let j = O.apply(z, H);
                        if (j === !1) j = $.apply(z, H);
                        return j
                    }
                }
                Y.tokenizer = z
            }
            if (K.hooks) {
                let z = this.defaults.hooks || new _F6;
                for (let _ in K.hooks) {
                    if (!(_ in z)) throw Error(`hook '${_}' does not exist`);
                    if (["options", "block"].includes(_)) continue;
                    let w = _,
                        O = K.hooks[w],
                        $ = z[w];
                    if (_F6.passThroughHooks.has(_)) z[w] = (H) => {
                        if (this.defaults.async) return Promise.resolve(O.call(z, H)).then((J) => {
                            return $.call(z, J)
                        });
                        let j = O.call(z, H);
                        return $.call(z, j)
                    };
                    else z[w] = (...H) => {
                        let j = O.apply(z, H);
                        if (j === !1) j = $.apply(z, H);
                        return j
                    }
                }
                Y.hooks = z
            }
            if (K.walkTokens) {
                let z = this.defaults.walkTokens,
                    _ = K.walkTokens;
                Y.walkTokens = function(w) {
                    let O = [];
                    if (O.push(_.call(this, w)), z) O = O.concat(z.call(this, w));
                    return O
                }
            }
            this.defaults = {
                ...this.defaults,
                ...Y
            }
        }), this
    }
    setOptions(A) {
        return this.defaults = {
            ...this.defaults,
            ...A
        }, this
    }
    lexer(A, q) {
        return tW.lex(A, q ?? this.defaults)
    }
    parser(A, q) {
        return _R.parse(A, q ?? this.defaults)
    }
    parseMarkdown(A) {
        return (K, Y) => {
            let z = {
                    ...Y
                },
                _ = {
                    ...this.defaults,
                    ...z
                },
                w = this.onError(!!_.silent, !!_.async);
            if (this.defaults.async === !0 && z.async === !1) return w(Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
            if (typeof K > "u" || K === null) return w(Error("marked(): input parameter is undefined or null"));
            if (typeof K !== "string") return w(Error("marked(): input parameter is of type " + Object.prototype.toString.call(K) + ", string expected"));
            if (_.hooks) _.hooks.options = _, _.hooks.block = A;
            let O = _.hooks ? _.hooks.provideLexer() : A ? tW.lex : tW.lexInline,
                $ = _.hooks ? _.hooks.provideParser() : A ? _R.parse : _R.parseInline;
            if (_.async) return Promise.resolve(_.hooks ? _.hooks.preprocess(K) : K).then((H) => O(H, _)).then((H) => _.hooks ? _.hooks.processAllTokens(H) : H).then((H) => _.walkTokens ? Promise.all(this.walkTokens(H, _.walkTokens)).then(() => H) : H).then((H) => $(H, _)).then((H) => _.hooks ? _.hooks.postprocess(H) : H).catch(w);
            try {
                if (_.hooks) K = _.hooks.preprocess(K);
                let H = O(K, _);
                if (_.hooks) H = _.hooks.processAllTokens(H);
                if (_.walkTokens) this.walkTokens(H, _.walkTokens);
                let j = $(H, _);
                if (_.hooks) j = _.hooks.postprocess(j);
                return j
            } catch (H) {
                return w(H)
            }
        }
    }
    onError(A, q) {
        return (K) => {
            if (K.message += `
Please report this to https://github.com/markedjs/marked.`, A) {
                let Y = "<p>An error occurred:</p><pre>" + HB(K.message + "", !0) + "</pre>";
                if (q) return Promise.resolve(Y);
                return Y
            }
            if (q) return Promise.reject(K);
            throw K
        }
    }
}
// @from(Ln 217745, Col 0)
function l9(A, q) {
    return Y36.parse(A, q)
}
// @from(Ln 217748, Col 4)
z36
// @from(Ln 217748, Col 9)
zF6
// @from(Ln 217748, Col 14)
$f
// @from(Ln 217748, Col 18)
iT9
// @from(Ln 217748, Col 23)
nT9
// @from(Ln 217748, Col 28)
rT9
// @from(Ln 217748, Col 33)
$F6
// @from(Ln 217748, Col 38)
oT9
// @from(Ln 217748, Col 43)
Z14
// @from(Ln 217748, Col 48)
G14
// @from(Ln 217748, Col 53)
Sf8
// @from(Ln 217748, Col 58)
aT9
// @from(Ln 217748, Col 63)
Cf8
// @from(Ln 217748, Col 68)
sT9
// @from(Ln 217748, Col 73)
tT9
// @from(Ln 217748, Col 78)
ND1 = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul"
// @from(Ln 217749, Col 4)
If8
// @from(Ln 217749, Col 9)
eT9
// @from(Ln 217749, Col 14)
f14
// @from(Ln 217749, Col 19)
Av9
// @from(Ln 217749, Col 24)
bf8
// @from(Ln 217749, Col 29)
J14
// @from(Ln 217749, Col 34)
qv9
// @from(Ln 217749, Col 39)
Kv9
// @from(Ln 217749, Col 44)
Yv9
// @from(Ln 217749, Col 49)
zv9
// @from(Ln 217749, Col 54)
T14
// @from(Ln 217749, Col 59)
_v9
// @from(Ln 217749, Col 64)
VD1
// @from(Ln 217749, Col 69)
xf8
// @from(Ln 217749, Col 74)
v14
// @from(Ln 217749, Col 79)
wv9
// @from(Ln 217749, Col 84)
N14
// @from(Ln 217749, Col 89)
Ov9
// @from(Ln 217749, Col 94)
$v9
// @from(Ln 217749, Col 99)
Hv9
// @from(Ln 217749, Col 104)
V14
// @from(Ln 217749, Col 109)
jv9
// @from(Ln 217749, Col 114)
Jv9
// @from(Ln 217749, Col 119)
k14 = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)"
// @from(Ln 217750, Col 4)
Mv9
// @from(Ln 217750, Col 9)
Dv9
// @from(Ln 217750, Col 14)
Xv9
// @from(Ln 217750, Col 19)
Pv9
// @from(Ln 217750, Col 24)
Wv9
// @from(Ln 217750, Col 29)
Zv9
// @from(Ln 217750, Col 34)
Gv9
// @from(Ln 217750, Col 39)
vD1
// @from(Ln 217750, Col 44)
fv9
// @from(Ln 217750, Col 49)
E14
// @from(Ln 217750, Col 54)
y14
// @from(Ln 217750, Col 59)
Tv9
// @from(Ln 217750, Col 64)
uf8
// @from(Ln 217750, Col 69)
vv9
// @from(Ln 217750, Col 74)
Rf8
// @from(Ln 217750, Col 79)
Nv9
// @from(Ln 217750, Col 84)
TD1
// @from(Ln 217750, Col 89)
KF6
// @from(Ln 217750, Col 94)
Vv9
// @from(Ln 217750, Col 99)
M14 = (A) => Vv9[A]
// @from(Ln 217751, Col 4)
_F6
// @from(Ln 217751, Col 9)
Y36
// @from(Ln 217751, Col 14)
wb2
// @from(Ln 217751, Col 19)
Ob2
// @from(Ln 217751, Col 24)
$b2
// @from(Ln 217751, Col 29)
Hb2
// @from(Ln 217751, Col 34)
jb2
// @from(Ln 217751, Col 39)
Jb2
// @from(Ln 217751, Col 44)
Mb2
// @from(Ln 217752, Col 4)
HF6 = E(() => {
    z36 = hf8();
    zF6 = {
        exec: () => null
    };
    $f = {
        codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
        outputLinkReplace: /\\([\[\]])/g,
        indentCodeCompensation: /^(\s+)(?:```)/,
        beginningSpace: /^\s+/,
        endingHash: /#$/,
        startingSpaceChar: /^ /,
        endingSpaceChar: / $/,
        nonSpaceChar: /[^ ]/,
        newLineCharGlobal: /\n/g,
        tabCharGlobal: /\t/g,
        multipleSpaceGlobal: /\s+/g,
        blankLine: /^[ \t]*$/,
        doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
        blockquoteStart: /^ {0,3}>/,
        blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
        blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
        listReplaceTabs: /^\t+/,
        listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
        listIsTask: /^\[[ xX]\] /,
        listReplaceTask: /^\[[ xX]\] +/,
        anyLine: /\n.*\n/,
        hrefBrackets: /^<(.*)>$/,
        tableDelimiter: /[:|]/,
        tableAlignChars: /^\||\| *$/g,
        tableRowBlankLine: /\n[ \t]*$/,
        tableAlignRight: /^ *-+: *$/,
        tableAlignCenter: /^ *:-+: *$/,
        tableAlignLeft: /^ *:-+ *$/,
        startATag: /^<a /i,
        endATag: /^<\/a>/i,
        startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
        endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
        startAngleBracket: /^</,
        endAngleBracket: />$/,
        pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
        unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
        escapeTest: /[&<>"']/,
        escapeReplace: /[&<>"']/g,
        escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
        escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
        unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
        caret: /(^|[^\[])\^/g,
        percentDecode: /%25/g,
        findPipe: /\|/g,
        splitPipe: / \|/,
        slashPipe: /\\\|/g,
        carriageReturn: /\r\n|\r/g,
        spaceLine: /^ +$/gm,
        notSpaceStart: /^\S*/,
        endingNewline: /\n$/,
        listItemRegex: (A) => new RegExp(`^( {0,3}${A})((?:[	 ][^\\n]*)?(?:\\n|$))`),
        nextBulletRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
        hrRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
        fencesBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}(?:\`\`\`|~~~)`),
        headingBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}#`),
        htmlBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}<(?:[a-z].*>|!--)`, "i")
    }, iT9 = /^(?:[ \t]*(?:\n|$))+/, nT9 = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, rT9 = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, $F6 = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, oT9 = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Z14 = /(?:[*+-]|\d{1,9}[.)])/, G14 = Q_(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, Z14).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), Sf8 = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, aT9 = /^[^\n]+/, Cf8 = /(?!\s*\])(?:\\.|[^\[\]\\])+/, sT9 = Q_(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Cf8).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), tT9 = Q_(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Z14).getRegex(), If8 = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, eT9 = Q_("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))", "i").replace("comment", If8).replace("tag", ND1).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), f14 = Q_(Sf8).replace("hr", $F6).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ND1).getRegex(), Av9 = Q_(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", f14).getRegex(), bf8 = {
        blockquote: Av9,
        code: nT9,
        def: sT9,
        fences: rT9,
        heading: oT9,
        hr: $F6,
        html: eT9,
        lheading: G14,
        list: tT9,
        newline: iT9,
        paragraph: f14,
        table: zF6,
        text: aT9
    }, J14 = Q_("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", $F6).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}\t)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ND1).getRegex(), qv9 = {
        ...bf8,
        table: J14,
        paragraph: Q_(Sf8).replace("hr", $F6).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", J14).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ND1).getRegex()
    }, Kv9 = {
        ...bf8,
        html: Q_(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", If8).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: zF6,
        lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        paragraph: Q_(Sf8).replace("hr", $F6).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", G14).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
    }, Yv9 = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, zv9 = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, T14 = /^( {2,}|\\)\n(?!\s*$)/, _v9 = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, VD1 = /[\p{P}\p{S}]/u, xf8 = /[\s\p{P}\p{S}]/u, v14 = /[^\s\p{P}\p{S}]/u, wv9 = Q_(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, xf8).getRegex(), N14 = /(?!~)[\p{P}\p{S}]/u, Ov9 = /(?!~)[\s\p{P}\p{S}]/u, $v9 = /(?:[^\s\p{P}\p{S}]|~)/u, Hv9 = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, V14 = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, jv9 = Q_(V14, "u").replace(/punct/g, VD1).getRegex(), Jv9 = Q_(V14, "u").replace(/punct/g, N14).getRegex(), Mv9 = Q_(k14, "gu").replace(/notPunctSpace/g, v14).replace(/punctSpace/g, xf8).replace(/punct/g, VD1).getRegex(), Dv9 = Q_(k14, "gu").replace(/notPunctSpace/g, $v9).replace(/punctSpace/g, Ov9).replace(/punct/g, N14).getRegex(), Xv9 = Q_("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, v14).replace(/punctSpace/g, xf8).replace(/punct/g, VD1).getRegex(), Pv9 = Q_(/\\(punct)/, "gu").replace(/punct/g, VD1).getRegex(), Wv9 = Q_(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Zv9 = Q_(If8).replace("(?:-->|$)", "-->").getRegex(), Gv9 = Q_("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Zv9).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), vD1 = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, fv9 = Q_(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", vD1).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), E14 = Q_(/^!?\[(label)\]\[(ref)\]/).replace("label", vD1).replace("ref", Cf8).getRegex(), y14 = Q_(/^!?\[(ref)\](?:\[\])?/).replace("ref", Cf8).getRegex(), Tv9 = Q_("reflink|nolink(?!\\()", "g").replace("reflink", E14).replace("nolink", y14).getRegex(), uf8 = {
        _backpedal: zF6,
        anyPunctuation: Pv9,
        autolink: Wv9,
        blockSkip: Hv9,
        br: T14,
        code: zv9,
        del: zF6,
        emStrongLDelim: jv9,
        emStrongRDelimAst: Mv9,
        emStrongRDelimUnd: Xv9,
        escape: Yv9,
        link: fv9,
        nolink: y14,
        punctuation: wv9,
        reflink: E14,
        reflinkSearch: Tv9,
        tag: Gv9,
        text: _v9,
        url: zF6
    }, vv9 = {
        ...uf8,
        link: Q_(/^!?\[(label)\]\((.*?)\)/).replace("label", vD1).getRegex(),
        reflink: Q_(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", vD1).getRegex()
    }, Rf8 = {
        ...uf8,
        emStrongRDelimAst: Dv9,
        emStrongLDelim: Jv9,
        url: Q_(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
        _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
        text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
    }, Nv9 = {
        ...Rf8,
        br: Q_(T14).replace("{2,}", "*").getRegex(),
        text: Q_(Rf8.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
    }, TD1 = {
        normal: bf8,
        gfm: qv9,
        pedantic: Kv9
    }, KF6 = {
        normal: uf8,
        gfm: Rf8,
        breaks: Nv9,
        pedantic: vv9
    }, Vv9 = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };
    _F6 = class _F6 {
        options;
        block;
        constructor(A) {
            this.options = A || z36
        }
        static passThroughHooks = new Set(["preprocess", "postprocess", "processAllTokens"]);
        preprocess(A) {
            return A
        }
        postprocess(A) {
            return A
        }
        processAllTokens(A) {
            return A
        }
        provideLexer() {
            return this.block ? tW.lex : tW.lexInline
        }
        provideParser() {
            return this.block ? _R.parse : _R.parseInline
        }
    };
    Y36 = new L14;
    l9.options = l9.setOptions = function(A) {
        return Y36.setOptions(A), l9.defaults = Y36.defaults, W14(l9.defaults), l9
    };
    l9.getDefaults = hf8;
    l9.defaults = z36;
    l9.use = function(...A) {
        return Y36.use(...A), l9.defaults = Y36.defaults, W14(l9.defaults), l9
    };
    l9.walkTokens = function(A, q) {
        return Y36.walkTokens(A, q)
    };
    l9.parseInline = Y36.parseInline;
    l9.Parser = _R;
    l9.parser = _R.parse;
    l9.Renderer = OF6;
    l9.TextRenderer = kD1;
    l9.Lexer = tW;
    l9.lexer = tW.lex;
    l9.Tokenizer = wF6;
    l9.Hooks = _F6;
    l9.parse = l9;
    wb2 = l9.options, Ob2 = l9.setOptions, $b2 = l9.use, Hb2 = l9.walkTokens, jb2 = l9.parseInline, Jb2 = _R.parse, Mb2 = tW.lex
})