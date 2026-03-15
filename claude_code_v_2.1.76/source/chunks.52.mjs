
// @from(Ln 128424, Col 4)
fb6 = x((Xk3) => {
    function Dk3(A, {
        flow: q,
        indicator: K,
        next: Y,
        offset: z,
        onError: _,
        parentIndent: w,
        startOnNewline: O
    }) {
        let $ = !1,
            H = O,
            j = O,
            J = "",
            M = "",
            D = !1,
            X = !1,
            P = null,
            W = null,
            Z = null,
            G = null,
            f = null,
            v = null,
            N = null;
        for (let h of A) {
            if (X) {
                if (h.type !== "space" && h.type !== "newline" && h.type !== "comma") _(h.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
                X = !1
            }
            if (P) {
                if (H && h.type !== "comment" && h.type !== "newline") _(P, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
                P = null
            }
            switch (h.type) {
                case "space":
                    if (!q && (K !== "doc-start" || Y?.type !== "flow-collection") && h.source.includes("\t")) P = h;
                    j = !0;
                    break;
                case "comment": {
                    if (!j) _(h, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
                    let R = h.source.substring(1) || " ";
                    if (!J) J = R;
                    else J += M + R;
                    M = "", H = !1;
                    break
                }
                case "newline":
                    if (H) {
                        if (J) J += h.source;
                        else if (!v || K !== "seq-item-ind") $ = !0
                    } else M += h.source;
                    if (H = !0, D = !0, W || Z) G = h;
                    j = !0;
                    break;
                case "anchor":
                    if (W) _(h, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
                    if (h.source.endsWith(":")) _(h.offset + h.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0);
                    W = h, N ?? (N = h.offset), H = !1, j = !1, X = !0;
                    break;
                case "tag": {
                    if (Z) _(h, "MULTIPLE_TAGS", "A node can have at most one tag");
                    Z = h, N ?? (N = h.offset), H = !1, j = !1, X = !0;
                    break
                }
                case K:
                    if (W || Z) _(h, "BAD_PROP_ORDER", `Anchors and tags must be after the ${h.source} indicator`);
                    if (v) _(h, "UNEXPECTED_TOKEN", `Unexpected ${h.source} in ${q??"collection"}`);
                    v = h, H = K === "seq-item-ind" || K === "explicit-key-ind", j = !1;
                    break;
                case "comma":
                    if (q) {
                        if (f) _(h, "UNEXPECTED_TOKEN", `Unexpected , in ${q}`);
                        f = h, H = !1, j = !1;
                        break
                    }
                default:
                    _(h, "UNEXPECTED_TOKEN", `Unexpected ${h.type} token`), H = !1, j = !1
            }
        }
        let V = A[A.length - 1],
            L = V ? V.offset + V.source.length : z;
        if (X && Y && Y.type !== "space" && Y.type !== "newline" && Y.type !== "comma" && (Y.type !== "scalar" || Y.source !== "")) _(Y.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
        if (P && (H && P.indent <= w || Y?.type === "block-map" || Y?.type === "block-seq")) _(P, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
        return {
            comma: f,
            found: v,
            spaceBefore: $,
            comment: J,
            hasNewline: D,
            anchor: W,
            tag: Z,
            newlineAfterProp: G,
            end: L,
            start: N ?? L
        }
    }
    Xk3.resolveProps = Dk3
})
// @from(Ln 128522, Col 4)
cz1 = x((Wk3) => {
    function T_8(A) {
        if (!A) return null;
        switch (A.type) {
            case "alias":
            case "scalar":
            case "double-quoted-scalar":
            case "single-quoted-scalar":
                if (A.source.includes(`
`)) return !0;
                if (A.end) {
                    for (let q of A.end)
                        if (q.type === "newline") return !0
                }
                return !1;
            case "flow-collection":
                for (let q of A.items) {
                    for (let K of q.start)
                        if (K.type === "newline") return !0;
                    if (q.sep) {
                        for (let K of q.sep)
                            if (K.type === "newline") return !0
                    }
                    if (T_8(q.key) || T_8(q.value)) return !0
                }
                return !1;
            default:
                return !0
        }
    }
    Wk3.containsNewline = T_8
})
// @from(Ln 128554, Col 4)
v_8 = x((Tk3) => {
    var Gk3 = cz1();

    function fk3(A, q, K) {
        if (q?.type === "flow-collection") {
            let Y = q.end[0];
            if (Y.indent === A && (Y.source === "]" || Y.source === "}") && Gk3.containsNewline(q)) K(Y, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0)
        }
    }
    Tk3.flowIndentCheck = fk3
})
// @from(Ln 128565, Col 4)
N_8 = x((Vk3) => {
    var WD7 = CY();

    function Nk3(A, q, K) {
        let {
            uniqueKeys: Y
        } = A.options;
        if (Y === !1) return !1;
        let z = typeof Y === "function" ? Y : (_, w) => _ === w || WD7.isScalar(_) && WD7.isScalar(w) && _.value === w.value;
        return q.some((_) => z(_.key, K))
    }
    Vk3.mapIncludes = Nk3
})
// @from(Ln 128578, Col 4)
vD7 = x((hk3) => {
    var ZD7 = Ga(),
        Ek3 = Ta(),
        GD7 = fb6(),
        yk3 = cz1(),
        fD7 = v_8(),
        Lk3 = N_8(),
        TD7 = "All mapping items must start at the same column";

    function Rk3({
        composeNode: A,
        composeEmptyNode: q
    }, K, Y, z, _) {
        let O = new(_?.nodeClass ?? Ek3.YAMLMap)(K.schema);
        if (K.atRoot) K.atRoot = !1;
        let $ = Y.offset,
            H = null;
        for (let j of Y.items) {
            let {
                start: J,
                key: M,
                sep: D,
                value: X
            } = j, P = GD7.resolveProps(J, {
                indicator: "explicit-key-ind",
                next: M ?? D?.[0],
                offset: $,
                onError: z,
                parentIndent: Y.indent,
                startOnNewline: !0
            }), W = !P.found;
            if (W) {
                if (M) {
                    if (M.type === "block-seq") z($, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
                    else if ("indent" in M && M.indent !== Y.indent) z($, "BAD_INDENT", TD7)
                }
                if (!P.anchor && !P.tag && !D) {
                    if (H = P.end, P.comment)
                        if (O.comment) O.comment += `
` + P.comment;
                        else O.comment = P.comment;
                    continue
                }
                if (P.newlineAfterProp || yk3.containsNewline(M)) z(M ?? J[J.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line")
            } else if (P.found?.indent !== Y.indent) z($, "BAD_INDENT", TD7);
            K.atKey = !0;
            let Z = P.end,
                G = M ? A(K, M, P, z) : q(K, Z, J, null, P, z);
            if (K.schema.compat) fD7.flowIndentCheck(Y.indent, M, z);
            if (K.atKey = !1, Lk3.mapIncludes(K, O.items, G)) z(Z, "DUPLICATE_KEY", "Map keys must be unique");
            let f = GD7.resolveProps(D ?? [], {
                indicator: "map-value-ind",
                next: X,
                offset: G.range[2],
                onError: z,
                parentIndent: Y.indent,
                startOnNewline: !M || M.type === "block-scalar"
            });
            if ($ = f.end, f.found) {
                if (W) {
                    if (X?.type === "block-map" && !f.hasNewline) z($, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
                    if (K.options.strict && P.start < f.found.offset - 1024) z(G.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key")
                }
                let v = X ? A(K, X, f, z) : q(K, $, D, null, f, z);
                if (K.schema.compat) fD7.flowIndentCheck(Y.indent, X, z);
                $ = v.range[2];
                let N = new ZD7.Pair(G, v);
                if (K.options.keepSourceTokens) N.srcToken = j;
                O.items.push(N)
            } else {
                if (W) z(G.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
                if (f.comment)
                    if (G.comment) G.comment += `
` + f.comment;
                    else G.comment = f.comment;
                let v = new ZD7.Pair(G);
                if (K.options.keepSourceTokens) v.srcToken = j;
                O.items.push(v)
            }
        }
        if (H && H < $) z(H, "IMPOSSIBLE", "Map comment with trailing content");
        return O.range = [Y.offset, $, H ?? $], O
    }
    hk3.resolveBlockMap = Rk3
})
// @from(Ln 128663, Col 4)
ND7 = x((uk3) => {
    var Ck3 = va(),
        Ik3 = fb6(),
        bk3 = v_8();

    function xk3({
        composeNode: A,
        composeEmptyNode: q
    }, K, Y, z, _) {
        let O = new(_?.nodeClass ?? Ck3.YAMLSeq)(K.schema);
        if (K.atRoot) K.atRoot = !1;
        if (K.atKey) K.atKey = !1;
        let $ = Y.offset,
            H = null;
        for (let {
                start: j,
                value: J
            }
            of Y.items) {
            let M = Ik3.resolveProps(j, {
                indicator: "seq-item-ind",
                next: J,
                offset: $,
                onError: z,
                parentIndent: Y.indent,
                startOnNewline: !0
            });
            if (!M.found)
                if (M.anchor || M.tag || J)
                    if (J && J.type === "block-seq") z(M.end, "BAD_INDENT", "All sequence items must start at the same column");
                    else z($, "MISSING_CHAR", "Sequence item without - indicator");
            else {
                if (H = M.end, M.comment) O.comment = M.comment;
                continue
            }
            let D = J ? A(K, J, M, z) : q(K, M.end, j, null, M, z);
            if (K.schema.compat) bk3.flowIndentCheck(Y.indent, J, z);
            $ = D.range[2], O.items.push(D)
        }
        return O.range = [Y.offset, $, H ?? $], O
    }
    uk3.resolveBlockSeq = xk3
})
// @from(Ln 128706, Col 4)
uM6 = x((gk3) => {
    function Bk3(A, q, K, Y) {
        let z = "";
        if (A) {
            let _ = !1,
                w = "";
            for (let O of A) {
                let {
                    source: $,
                    type: H
                } = O;
                switch (H) {
                    case "space":
                        _ = !0;
                        break;
                    case "comment": {
                        if (K && !_) Y(O, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
                        let j = $.substring(1) || " ";
                        if (!z) z = j;
                        else z += w + j;
                        w = "";
                        break
                    }
                    case "newline":
                        if (z) w += $;
                        _ = !0;
                        break;
                    default:
                        Y(O, "UNEXPECTED_TOKEN", `Unexpected ${H} at node end`)
                }
                q += $.length
            }
        }
        return {
            comment: z,
            offset: q
        }
    }
    gk3.resolveEnd = Bk3
})
// @from(Ln 128746, Col 4)
ED7 = x((nk3) => {
    var pk3 = CY(),
        Qk3 = Ga(),
        VD7 = Ta(),
        Uk3 = va(),
        dk3 = uM6(),
        kD7 = fb6(),
        ck3 = cz1(),
        lk3 = N_8(),
        V_8 = "Block collections are not allowed within flow collections",
        k_8 = (A) => A && (A.type === "block-map" || A.type === "block-seq");

    function ik3({
        composeNode: A,
        composeEmptyNode: q
    }, K, Y, z, _) {
        let w = Y.start.source === "{",
            O = w ? "flow map" : "flow sequence",
            H = new(_?.nodeClass ?? (w ? VD7.YAMLMap : Uk3.YAMLSeq))(K.schema);
        H.flow = !0;
        let j = K.atRoot;
        if (j) K.atRoot = !1;
        if (K.atKey) K.atKey = !1;
        let J = Y.offset + Y.start.source.length;
        for (let W = 0; W < Y.items.length; ++W) {
            let Z = Y.items[W],
                {
                    start: G,
                    key: f,
                    sep: v,
                    value: N
                } = Z,
                V = kD7.resolveProps(G, {
                    flow: O,
                    indicator: "explicit-key-ind",
                    next: f ?? v?.[0],
                    offset: J,
                    onError: z,
                    parentIndent: Y.indent,
                    startOnNewline: !1
                });
            if (!V.found) {
                if (!V.anchor && !V.tag && !v && !N) {
                    if (W === 0 && V.comma) z(V.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${O}`);
                    else if (W < Y.items.length - 1) z(V.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${O}`);
                    if (V.comment)
                        if (H.comment) H.comment += `
` + V.comment;
                        else H.comment = V.comment;
                    J = V.end;
                    continue
                }
                if (!w && K.options.strict && ck3.containsNewline(f)) z(f, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line")
            }
            if (W === 0) {
                if (V.comma) z(V.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${O}`)
            } else {
                if (!V.comma) z(V.start, "MISSING_CHAR", `Missing , between ${O} items`);
                if (V.comment) {
                    let L = "";
                    A: for (let h of G) switch (h.type) {
                        case "comma":
                        case "space":
                            break;
                        case "comment":
                            L = h.source.substring(1);
                            break A;
                        default:
                            break A
                    }
                    if (L) {
                        let h = H.items[H.items.length - 1];
                        if (pk3.isPair(h)) h = h.value ?? h.key;
                        if (h.comment) h.comment += `
` + L;
                        else h.comment = L;
                        V.comment = V.comment.substring(L.length + 1)
                    }
                }
            }
            if (!w && !v && !V.found) {
                let L = N ? A(K, N, V, z) : q(K, V.end, v, null, V, z);
                if (H.items.push(L), J = L.range[2], k_8(N)) z(L.range, "BLOCK_IN_FLOW", V_8)
            } else {
                K.atKey = !0;
                let L = V.end,
                    h = f ? A(K, f, V, z) : q(K, L, G, null, V, z);
                if (k_8(f)) z(h.range, "BLOCK_IN_FLOW", V_8);
                K.atKey = !1;
                let R = kD7.resolveProps(v ?? [], {
                    flow: O,
                    indicator: "map-value-ind",
                    next: N,
                    offset: h.range[2],
                    onError: z,
                    parentIndent: Y.indent,
                    startOnNewline: !1
                });
                if (R.found) {
                    if (!w && !V.found && K.options.strict) {
                        if (v)
                            for (let g of v) {
                                if (g === R.found) break;
                                if (g.type === "newline") {
                                    z(g, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                                    break
                                }
                            }
                        if (V.start < R.found.offset - 1024) z(R.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key")
                    }
                } else if (N)
                    if ("source" in N && N.source && N.source[0] === ":") z(N, "MISSING_CHAR", `Missing space after : in ${O}`);
                    else z(R.start, "MISSING_CHAR", `Missing , or : between ${O} items`);
                let u = N ? A(K, N, R, z) : R.found ? q(K, R.end, v, null, R, z) : null;
                if (u) {
                    if (k_8(N)) z(u.range, "BLOCK_IN_FLOW", V_8)
                } else if (R.comment)
                    if (h.comment) h.comment += `
` + R.comment;
                    else h.comment = R.comment;
                let I = new Qk3.Pair(h, u);
                if (K.options.keepSourceTokens) I.srcToken = Z;
                if (w) {
                    let g = H;
                    if (lk3.mapIncludes(K, g.items, h)) z(L, "DUPLICATE_KEY", "Map keys must be unique");
                    g.items.push(I)
                } else {
                    let g = new VD7.YAMLMap(K.schema);
                    g.flow = !0, g.items.push(I);
                    let B = (u ?? h).range;
                    g.range = [h.range[0], B[1], B[2]], H.items.push(g)
                }
                J = u ? u.range[2] : R.end
            }
        }
        let M = w ? "}" : "]",
            [D, ...X] = Y.end,
            P = J;
        if (D && D.source === M) P = D.offset + D.source.length;
        else {
            let W = O[0].toUpperCase() + O.substring(1),
                Z = j ? `${W} must end with a ${M}` : `${W} in block collection must be sufficiently indented and end with a ${M}`;
            if (z(J, j ? "MISSING_CHAR" : "BAD_INDENT", Z), D && D.source.length !== 1) X.unshift(D)
        }
        if (X.length > 0) {
            let W = dk3.resolveEnd(X, P, K.options.strict, z);
            if (W.comment)
                if (H.comment) H.comment += `
` + W.comment;
                else H.comment = W.comment;
            H.range = [Y.offset, P, W.offset]
        } else H.range = [Y.offset, P, P];
        return H
    }
    nk3.resolveFlowCollection = ik3
})
// @from(Ln 128902, Col 4)
yD7 = x((YE3) => {
    var ok3 = CY(),
        ak3 = SJ(),
        sk3 = Ta(),
        tk3 = va(),
        ek3 = vD7(),
        AE3 = ND7(),
        qE3 = ED7();

    function E_8(A, q, K, Y, z, _) {
        let w = K.type === "block-map" ? ek3.resolveBlockMap(A, q, K, Y, _) : K.type === "block-seq" ? AE3.resolveBlockSeq(A, q, K, Y, _) : qE3.resolveFlowCollection(A, q, K, Y, _),
            O = w.constructor;
        if (z === "!" || z === O.tagName) return w.tag = O.tagName, w;
        if (z) w.tag = z;
        return w
    }

    function KE3(A, q, K, Y, z) {
        let _ = Y.tag,
            w = !_ ? null : q.directives.tagName(_.source, (M) => z(_, "TAG_RESOLVE_FAILED", M));
        if (K.type === "block-seq") {
            let {
                anchor: M,
                newlineAfterProp: D
            } = Y, X = M && _ ? M.offset > _.offset ? M : _ : M ?? _;
            if (X && (!D || D.offset < X.offset)) z(X, "MISSING_CHAR", "Missing newline after block sequence props")
        }
        let O = K.type === "block-map" ? "map" : K.type === "block-seq" ? "seq" : K.start.source === "{" ? "map" : "seq";
        if (!_ || !w || w === "!" || w === sk3.YAMLMap.tagName && O === "map" || w === tk3.YAMLSeq.tagName && O === "seq") return E_8(A, q, K, z, w);
        let $ = q.schema.tags.find((M) => M.tag === w && M.collection === O);
        if (!$) {
            let M = q.schema.knownTags[w];
            if (M && M.collection === O) q.schema.tags.push(Object.assign({}, M, {
                default: !1
            })), $ = M;
            else {
                if (M) z(_, "BAD_COLLECTION_TYPE", `${M.tag} used for ${O} collection, but expects ${M.collection??"scalar"}`, !0);
                else z(_, "TAG_RESOLVE_FAILED", `Unresolved tag: ${w}`, !0);
                return E_8(A, q, K, z, w)
            }
        }
        let H = E_8(A, q, K, z, w, $),
            j = $.resolve?.(H, (M) => z(_, "TAG_RESOLVE_FAILED", M), q.options) ?? H,
            J = ok3.isNode(j) ? j : new ak3.Scalar(j);
        if (J.range = H.range, J.tag = w, $?.format) J.format = $.format;
        return J
    }
    YE3.composeCollection = KE3
})
// @from(Ln 128951, Col 4)
L_8 = x(($E3) => {
    var y_8 = SJ();

    function _E3(A, q, K) {
        let Y = q.offset,
            z = wE3(q, A.options.strict, K);
        if (!z) return {
            value: "",
            type: null,
            comment: "",
            range: [Y, Y, Y]
        };
        let _ = z.mode === ">" ? y_8.Scalar.BLOCK_FOLDED : y_8.Scalar.BLOCK_LITERAL,
            w = q.source ? OE3(q.source) : [],
            O = w.length;
        for (let P = w.length - 1; P >= 0; --P) {
            let W = w[P][1];
            if (W === "" || W === "\r") O = P;
            else break
        }
        if (O === 0) {
            let P = z.chomp === "+" && w.length > 0 ? `
`.repeat(Math.max(1, w.length - 1)) : "",
                W = Y + z.length;
            if (q.source) W += q.source.length;
            return {
                value: P,
                type: _,
                comment: z.comment,
                range: [Y, W, W]
            }
        }
        let $ = q.indent + z.indent,
            H = q.offset + z.length,
            j = 0;
        for (let P = 0; P < O; ++P) {
            let [W, Z] = w[P];
            if (Z === "" || Z === "\r") {
                if (z.indent === 0 && W.length > $) $ = W.length
            } else {
                if (W.length < $) K(H + W.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator");
                if (z.indent === 0) $ = W.length;
                if (j = P, $ === 0 && !A.atRoot) K(H, "BAD_INDENT", "Block scalar values in collections must be indented");
                break
            }
            H += W.length + Z.length + 1
        }
        for (let P = w.length - 1; P >= O; --P)
            if (w[P][0].length > $) O = P + 1;
        let J = "",
            M = "",
            D = !1;
        for (let P = 0; P < j; ++P) J += w[P][0].slice($) + `
`;
        for (let P = j; P < O; ++P) {
            let [W, Z] = w[P];
            H += W.length + Z.length + 1;
            let G = Z[Z.length - 1] === "\r";
            if (G) Z = Z.slice(0, -1);
            if (Z && W.length < $) {
                let v = `Block scalar lines must not be less indented than their ${z.indent?"explicit indentation indicator":"first line"}`;
                K(H - Z.length - (G ? 2 : 1), "BAD_INDENT", v), W = ""
            }
            if (_ === y_8.Scalar.BLOCK_LITERAL) J += M + W.slice($) + Z, M = `
`;
            else if (W.length > $ || Z[0] === "\t") {
                if (M === " ") M = `
`;
                else if (!D && M === `
`) M = `

`;
                J += M + W.slice($) + Z, M = `
`, D = !0
            } else if (Z === "")
                if (M === `
`) J += `
`;
                else M = `
`;
            else J += M + Z, M = " ", D = !1
        }
        switch (z.chomp) {
            case "-":
                break;
            case "+":
                for (let P = O; P < w.length; ++P) J += `
` + w[P][0].slice($);
                if (J[J.length - 1] !== `
`) J += `
`;
                break;
            default:
                J += `
`
        }
        let X = Y + z.length + q.source.length;
        return {
            value: J,
            type: _,
            comment: z.comment,
            range: [Y, X, X]
        }
    }

    function wE3({
        offset: A,
        props: q
    }, K, Y) {
        if (q[0].type !== "block-scalar-header") return Y(q[0], "IMPOSSIBLE", "Block scalar header not found"), null;
        let {
            source: z
        } = q[0], _ = z[0], w = 0, O = "", $ = -1;
        for (let M = 1; M < z.length; ++M) {
            let D = z[M];
            if (!O && (D === "-" || D === "+")) O = D;
            else {
                let X = Number(D);
                if (!w && X) w = X;
                else if ($ === -1) $ = A + M
            }
        }
        if ($ !== -1) Y($, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${z}`);
        let H = !1,
            j = "",
            J = z.length;
        for (let M = 1; M < q.length; ++M) {
            let D = q[M];
            switch (D.type) {
                case "space":
                    H = !0;
                case "newline":
                    J += D.source.length;
                    break;
                case "comment":
                    if (K && !H) Y(D, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
                    J += D.source.length, j = D.source.substring(1);
                    break;
                case "error":
                    Y(D, "UNEXPECTED_TOKEN", D.message), J += D.source.length;
                    break;
                default: {
                    let X = `Unexpected token in block scalar header: ${D.type}`;
                    Y(D, "UNEXPECTED_TOKEN", X);
                    let P = D.source;
                    if (P && typeof P === "string") J += P.length
                }
            }
        }
        return {
            mode: _,
            indent: w,
            chomp: O,
            comment: j,
            length: J
        }
    }

    function OE3(A) {
        let q = A.split(/\n( *)/),
            K = q[0],
            Y = K.match(/^( *)/),
            _ = [Y?.[1] ? [Y[1], K.slice(Y[1].length)] : ["", K]];
        for (let w = 1; w < q.length; w += 2) _.push([q[w], q[w + 1]]);
        return _
    }
    $E3.resolveBlockScalar = _E3
})
// @from(Ln 129119, Col 4)
h_8 = x((GE3) => {
    var R_8 = SJ(),
        jE3 = uM6();

    function JE3(A, q, K) {
        let {
            offset: Y,
            type: z,
            source: _,
            end: w
        } = A, O, $, H = (M, D, X) => K(Y + M, D, X);
        switch (z) {
            case "scalar":
                O = R_8.Scalar.PLAIN, $ = ME3(_, H);
                break;
            case "single-quoted-scalar":
                O = R_8.Scalar.QUOTE_SINGLE, $ = DE3(_, H);
                break;
            case "double-quoted-scalar":
                O = R_8.Scalar.QUOTE_DOUBLE, $ = XE3(_, H);
                break;
            default:
                return K(A, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${z}`), {
                    value: "",
                    type: null,
                    comment: "",
                    range: [Y, Y + _.length, Y + _.length]
                }
        }
        let j = Y + _.length,
            J = jE3.resolveEnd(w, j, q, K);
        return {
            value: $,
            type: O,
            comment: J.comment,
            range: [Y, j, J.offset]
        }
    }

    function ME3(A, q) {
        let K = "";
        switch (A[0]) {
            case "\t":
                K = "a tab character";
                break;
            case ",":
                K = "flow indicator character ,";
                break;
            case "%":
                K = "directive indicator character %";
                break;
            case "|":
            case ">": {
                K = `block scalar indicator ${A[0]}`;
                break
            }
            case "@":
            case "`": {
                K = `reserved character ${A[0]}`;
                break
            }
        }
        if (K) q(0, "BAD_SCALAR_START", `Plain value cannot start with ${K}`);
        return LD7(A)
    }

    function DE3(A, q) {
        if (A[A.length - 1] !== "'" || A.length === 1) q(A.length, "MISSING_CHAR", "Missing closing 'quote");
        return LD7(A.slice(1, -1)).replace(/''/g, "'")
    }

    function LD7(A) {
        let q, K;
        try {
            q = new RegExp(`(.*?)(?<![ 	])[ 	]*\r?
`, "sy"), K = new RegExp(`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`, "sy")
        } catch {
            q = /(.*?)[ \t]*\r?\n/sy, K = /[ \t]*(.*?)[ \t]*\r?\n/sy
        }
        let Y = q.exec(A);
        if (!Y) return A;
        let z = Y[1],
            _ = " ",
            w = q.lastIndex;
        K.lastIndex = w;
        while (Y = K.exec(A)) {
            if (Y[1] === "")
                if (_ === `
`) z += _;
                else _ = `
`;
            else z += _ + Y[1], _ = " ";
            w = K.lastIndex
        }
        let O = /[ \t]*(.*)/sy;
        return O.lastIndex = w, Y = O.exec(A), z + _ + (Y?.[1] ?? "")
    }

    function XE3(A, q) {
        let K = "";
        for (let Y = 1; Y < A.length - 1; ++Y) {
            let z = A[Y];
            if (z === "\r" && A[Y + 1] === `
`) continue;
            if (z === `
`) {
                let {
                    fold: _,
                    offset: w
                } = PE3(A, Y);
                K += _, Y = w
            } else if (z === "\\") {
                let _ = A[++Y],
                    w = WE3[_];
                if (w) K += w;
                else if (_ === `
`) {
                    _ = A[Y + 1];
                    while (_ === " " || _ === "\t") _ = A[++Y + 1]
                } else if (_ === "\r" && A[Y + 1] === `
`) {
                    _ = A[++Y + 1];
                    while (_ === " " || _ === "\t") _ = A[++Y + 1]
                } else if (_ === "x" || _ === "u" || _ === "U") {
                    let O = {
                        x: 2,
                        u: 4,
                        U: 8
                    } [_];
                    K += ZE3(A, Y + 1, O, q), Y += O
                } else {
                    let O = A.substr(Y - 1, 2);
                    q(Y - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${O}`), K += O
                }
            } else if (z === " " || z === "\t") {
                let _ = Y,
                    w = A[Y + 1];
                while (w === " " || w === "\t") w = A[++Y + 1];
                if (w !== `
` && !(w === "\r" && A[Y + 2] === `
`)) K += Y > _ ? A.slice(_, Y + 1) : z
            } else K += z
        }
        if (A[A.length - 1] !== '"' || A.length === 1) q(A.length, "MISSING_CHAR", 'Missing closing "quote');
        return K
    }

    function PE3(A, q) {
        let K = "",
            Y = A[q + 1];
        while (Y === " " || Y === "\t" || Y === `
` || Y === "\r") {
            if (Y === "\r" && A[q + 2] !== `
`) break;
            if (Y === `
`) K += `
`;
            q += 1, Y = A[q + 1]
        }
        if (!K) K = " ";
        return {
            fold: K,
            offset: q
        }
    }
    var WE3 = {
        "0": "\x00",
        a: "\x07",
        b: "\b",
        e: "\x1B",
        f: "\f",
        n: `
`,
        r: "\r",
        t: "\t",
        v: "\v",
        N: "",
        _: " ",
        L: "\u2028",
        P: "\u2029",
        " ": " ",
        '"': '"',
        "/": "/",
        "\\": "\\",
        "\t": "\t"
    };

    function ZE3(A, q, K, Y) {
        let z = A.substr(q, K),
            w = z.length === K && /^[0-9a-fA-F]+$/.test(z) ? parseInt(z, 16) : NaN;
        if (isNaN(w)) {
            let O = A.substr(q - 2, K + 2);
            return Y(q - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${O}`), O
        }
        return String.fromCodePoint(w)
    }
    GE3.resolveFlowScalar = JE3
})
// @from(Ln 129318, Col 4)
hD7 = x((EE3) => {
    var kq6 = CY(),
        RD7 = SJ(),
        TE3 = L_8(),
        vE3 = h_8();

    function NE3(A, q, K, Y) {
        let {
            value: z,
            type: _,
            comment: w,
            range: O
        } = q.type === "block-scalar" ? TE3.resolveBlockScalar(A, q, Y) : vE3.resolveFlowScalar(q, A.options.strict, Y), $ = K ? A.directives.tagName(K.source, (J) => Y(K, "TAG_RESOLVE_FAILED", J)) : null, H;
        if (A.options.stringKeys && A.atKey) H = A.schema[kq6.SCALAR];
        else if ($) H = VE3(A.schema, z, $, K, Y);
        else if (q.type === "scalar") H = kE3(A, z, q, Y);
        else H = A.schema[kq6.SCALAR];
        let j;
        try {
            let J = H.resolve(z, (M) => Y(K ?? q, "TAG_RESOLVE_FAILED", M), A.options);
            j = kq6.isScalar(J) ? J : new RD7.Scalar(J)
        } catch (J) {
            let M = J instanceof Error ? J.message : String(J);
            Y(K ?? q, "TAG_RESOLVE_FAILED", M), j = new RD7.Scalar(z)
        }
        if (j.range = O, j.source = z, _) j.type = _;
        if ($) j.tag = $;
        if (H.format) j.format = H.format;
        if (w) j.comment = w;
        return j
    }

    function VE3(A, q, K, Y, z) {
        if (K === "!") return A[kq6.SCALAR];
        let _ = [];
        for (let O of A.tags)
            if (!O.collection && O.tag === K)
                if (O.default && O.test) _.push(O);
                else return O;
        for (let O of _)
            if (O.test?.test(q)) return O;
        let w = A.knownTags[K];
        if (w && !w.collection) return A.tags.push(Object.assign({}, w, {
            default: !1,
            test: void 0
        })), w;
        return z(Y, "TAG_RESOLVE_FAILED", `Unresolved tag: ${K}`, K !== "tag:yaml.org,2002:str"), A[kq6.SCALAR]
    }

    function kE3({
        atKey: A,
        directives: q,
        schema: K
    }, Y, z, _) {
        let w = K.tags.find((O) => (O.default === !0 || A && O.default === "key") && O.test?.test(Y)) || K[kq6.SCALAR];
        if (K.compat) {
            let O = K.compat.find(($) => $.default && $.test?.test(Y)) ?? K[kq6.SCALAR];
            if (w.tag !== O.tag) {
                let $ = q.tagString(w.tag),
                    H = q.tagString(O.tag),
                    j = `Value may be parsed as either ${$} or ${H}`;
                _(z, "TAG_RESOLVE_FAILED", j, !0)
            }
        }
        return w
    }
    EE3.composeScalar = NE3
})
// @from(Ln 129386, Col 4)
SD7 = x((RE3) => {
    function LE3(A, q, K) {
        if (q) {
            K ?? (K = q.length);
            for (let Y = K - 1; Y >= 0; --Y) {
                let z = q[Y];
                switch (z.type) {
                    case "space":
                    case "comment":
                    case "newline":
                        A -= z.source.length;
                        continue
                }
                z = q[++Y];
                while (z?.type === "space") A += z.source.length, z = q[++Y];
                break
            }
        }
        return A
    }
    RE3.emptyScalarPosition = LE3
})
// @from(Ln 129408, Col 4)
bD7 = x((BE3) => {
    var SE3 = Kb6(),
        CE3 = CY(),
        IE3 = yD7(),
        CD7 = hD7(),
        bE3 = uM6(),
        xE3 = SD7(),
        uE3 = {
            composeNode: ID7,
            composeEmptyNode: S_8
        };

    function ID7(A, q, K, Y) {
        let z = A.atKey,
            {
                spaceBefore: _,
                comment: w,
                anchor: O,
                tag: $
            } = K,
            H, j = !0;
        switch (q.type) {
            case "alias":
                if (H = mE3(A, q, Y), O || $) Y(q, "ALIAS_PROPS", "An alias node must not specify any properties");
                break;
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar":
            case "block-scalar":
                if (H = CD7.composeScalar(A, q, $, Y), O) H.anchor = O.source.substring(1);
                break;
            case "block-map":
            case "block-seq":
            case "flow-collection":
                if (H = IE3.composeCollection(uE3, A, q, K, Y), O) H.anchor = O.source.substring(1);
                break;
            default: {
                let J = q.type === "error" ? q.message : `Unsupported token (type: ${q.type})`;
                Y(q, "UNEXPECTED_TOKEN", J), H = S_8(A, q.offset, void 0, null, K, Y), j = !1
            }
        }
        if (O && H.anchor === "") Y(O, "BAD_ALIAS", "Anchor cannot be an empty string");
        if (z && A.options.stringKeys && (!CE3.isScalar(H) || typeof H.value !== "string" || H.tag && H.tag !== "tag:yaml.org,2002:str")) Y($ ?? q, "NON_STRING_KEY", "With stringKeys, all keys must be strings");
        if (_) H.spaceBefore = !0;
        if (w)
            if (q.type === "scalar" && q.source === "") H.comment = w;
            else H.commentBefore = w;
        if (A.options.keepSourceTokens && j) H.srcToken = q;
        return H
    }

    function S_8(A, q, K, Y, {
        spaceBefore: z,
        comment: _,
        anchor: w,
        tag: O,
        end: $
    }, H) {
        let j = {
                type: "scalar",
                offset: xE3.emptyScalarPosition(q, K, Y),
                indent: -1,
                source: ""
            },
            J = CD7.composeScalar(A, j, O, H);
        if (w) {
            if (J.anchor = w.source.substring(1), J.anchor === "") H(w, "BAD_ALIAS", "Anchor cannot be an empty string")
        }
        if (z) J.spaceBefore = !0;
        if (_) J.comment = _, J.range[2] = $;
        return J
    }

    function mE3({
        options: A
    }, {
        offset: q,
        source: K,
        end: Y
    }, z) {
        let _ = new SE3.Alias(K.substring(1));
        if (_.source === "") z(q, "BAD_ALIAS", "Alias cannot be an empty string");
        if (_.source.endsWith(":")) z(q + K.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
        let w = q + K.length,
            O = bE3.resolveEnd(Y, w, A.strict, z);
        if (_.range = [q, w, O.offset], O.comment) _.comment = O.comment;
        return _
    }
    BE3.composeEmptyNode = S_8;
    BE3.composeNode = ID7
})
// @from(Ln 129499, Col 4)
uD7 = x((cE3) => {
    var pE3 = Zb6(),
        xD7 = bD7(),
        QE3 = uM6(),
        UE3 = fb6();

    function dE3(A, q, {
        offset: K,
        start: Y,
        value: z,
        end: _
    }, w) {
        let O = Object.assign({
                _directives: q
            }, A),
            $ = new pE3.Document(void 0, O),
            H = {
                atKey: !1,
                atRoot: !0,
                directives: $.directives,
                options: $.options,
                schema: $.schema
            },
            j = UE3.resolveProps(Y, {
                indicator: "doc-start",
                next: z ?? _?.[0],
                offset: K,
                onError: w,
                parentIndent: 0,
                startOnNewline: !0
            });
        if (j.found) {
            if ($.directives.docStart = !0, z && (z.type === "block-map" || z.type === "block-seq") && !j.hasNewline) w(j.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")
        }
        $.contents = z ? xD7.composeNode(H, z, j, w) : xD7.composeEmptyNode(H, j.end, Y, null, j, w);
        let J = $.contents.range[2],
            M = QE3.resolveEnd(_, J, !1, w);
        if (M.comment) $.comment = M.comment;
        return $.range = [K, J, M.offset], $
    }
    cE3.composeDoc = dE3
})
// @from(Ln 129541, Col 4)
C_8 = x((sE3) => {
    var iE3 = x6("process"),
        nE3 = uz8(),
        rE3 = Zb6(),
        Tb6 = Gb6(),
        mD7 = CY(),
        oE3 = uD7(),
        aE3 = uM6();

    function vb6(A) {
        if (typeof A === "number") return [A, A + 1];
        if (Array.isArray(A)) return A.length === 2 ? A : [A[0], A[1]];
        let {
            offset: q,
            source: K
        } = A;
        return [q, q + (typeof K === "string" ? K.length : 1)]
    }

    function BD7(A) {
        let q = "",
            K = !1,
            Y = !1;
        for (let z = 0; z < A.length; ++z) {
            let _ = A[z];
            switch (_[0]) {
                case "#":
                    q += (q === "" ? "" : Y ? `

` : `
`) + (_.substring(1) || " "), K = !0, Y = !1;
                    break;
                case "%":
                    if (A[z + 1]?.[0] !== "#") z += 1;
                    K = !1;
                    break;
                default:
                    if (!K) Y = !0;
                    K = !1
            }
        }
        return {
            comment: q,
            afterEmptyLine: Y
        }
    }
    class gD7 {
        constructor(A = {}) {
            this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (q, K, Y, z) => {
                let _ = vb6(q);
                if (z) this.warnings.push(new Tb6.YAMLWarning(_, K, Y));
                else this.errors.push(new Tb6.YAMLParseError(_, K, Y))
            }, this.directives = new nE3.Directives({
                version: A.version || "1.2"
            }), this.options = A
        }
        decorate(A, q) {
            let {
                comment: K,
                afterEmptyLine: Y
            } = BD7(this.prelude);
            if (K) {
                let z = A.contents;
                if (q) A.comment = A.comment ? `${A.comment}
${K}` : K;
                else if (Y || A.directives.docStart || !z) A.commentBefore = K;
                else if (mD7.isCollection(z) && !z.flow && z.items.length > 0) {
                    let _ = z.items[0];
                    if (mD7.isPair(_)) _ = _.key;
                    let w = _.commentBefore;
                    _.commentBefore = w ? `${K}
${w}` : K
                } else {
                    let _ = z.commentBefore;
                    z.commentBefore = _ ? `${K}
${_}` : K
                }
            }
            if (q) Array.prototype.push.apply(A.errors, this.errors), Array.prototype.push.apply(A.warnings, this.warnings);
            else A.errors = this.errors, A.warnings = this.warnings;
            this.prelude = [], this.errors = [], this.warnings = []
        }
        streamInfo() {
            return {
                comment: BD7(this.prelude).comment,
                directives: this.directives,
                errors: this.errors,
                warnings: this.warnings
            }
        }* compose(A, q = !1, K = -1) {
            for (let Y of A) yield* this.next(Y);
            yield* this.end(q, K)
        }* next(A) {
            if (iE3.env.LOG_STREAM) console.dir(A, {
                depth: null
            });
            switch (A.type) {
                case "directive":
                    this.directives.add(A.source, (q, K, Y) => {
                        let z = vb6(A);
                        z[0] += q, this.onError(z, "BAD_DIRECTIVE", K, Y)
                    }), this.prelude.push(A.source), this.atDirectives = !0;
                    break;
                case "document": {
                    let q = oE3.composeDoc(this.options, this.directives, A, this.onError);
                    if (this.atDirectives && !q.directives.docStart) this.onError(A, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
                    if (this.decorate(q, !1), this.doc) yield this.doc;
                    this.doc = q, this.atDirectives = !1;
                    break
                }
                case "byte-order-mark":
                case "space":
                    break;
                case "comment":
                case "newline":
                    this.prelude.push(A.source);
                    break;
                case "error": {
                    let q = A.source ? `${A.message}: ${JSON.stringify(A.source)}` : A.message,
                        K = new Tb6.YAMLParseError(vb6(A), "UNEXPECTED_TOKEN", q);
                    if (this.atDirectives || !this.doc) this.errors.push(K);
                    else this.doc.errors.push(K);
                    break
                }
                case "doc-end": {
                    if (!this.doc) {
                        this.errors.push(new Tb6.YAMLParseError(vb6(A), "UNEXPECTED_TOKEN", "Unexpected doc-end without preceding document"));
                        break
                    }
                    this.doc.directives.docEnd = !0;
                    let q = aE3.resolveEnd(A.end, A.offset + A.source.length, this.doc.options.strict, this.onError);
                    if (this.decorate(this.doc, !0), q.comment) {
                        let K = this.doc.comment;
                        this.doc.comment = K ? `${K}
${q.comment}` : q.comment
                    }
                    this.doc.range[2] = q.offset;
                    break
                }
                default:
                    this.errors.push(new Tb6.YAMLParseError(vb6(A), "UNEXPECTED_TOKEN", `Unsupported token ${A.type}`))
            }
        }* end(A = !1, q = -1) {
            if (this.doc) this.decorate(this.doc, !0), yield this.doc, this.doc = null;
            else if (A) {
                let K = Object.assign({
                        _directives: this.directives
                    }, this.options),
                    Y = new rE3.Document(void 0, K);
                if (this.atDirectives) this.onError(q, "MISSING_CHAR", "Missing directives-end indicator line");
                Y.range = [0, q, q], this.decorate(Y, !1), yield Y
            }
        }
    }
    sE3.Composer = gD7
})
// @from(Ln 129697, Col 4)
QD7 = x((wy3) => {
    var eE3 = L_8(),
        Ay3 = h_8(),
        qy3 = Gb6(),
        FD7 = wb6();

    function Ky3(A, q = !0, K) {
        if (A) {
            let Y = (z, _, w) => {
                let O = typeof z === "number" ? z : Array.isArray(z) ? z[0] : z.offset;
                if (K) K(O, _, w);
                else throw new qy3.YAMLParseError([O, O + 1], _, w)
            };
            switch (A.type) {
                case "scalar":
                case "single-quoted-scalar":
                case "double-quoted-scalar":
                    return Ay3.resolveFlowScalar(A, q, Y);
                case "block-scalar":
                    return eE3.resolveBlockScalar({
                        options: {
                            strict: q
                        }
                    }, A, Y)
            }
        }
        return null
    }

    function Yy3(A, q) {
        let {
            implicitKey: K = !1,
            indent: Y,
            inFlow: z = !1,
            offset: _ = -1,
            type: w = "PLAIN"
        } = q, O = FD7.stringifyString({
            type: w,
            value: A
        }, {
            implicitKey: K,
            indent: Y > 0 ? " ".repeat(Y) : "",
            inFlow: z,
            options: {
                blockQuote: !0,
                lineWidth: -1
            }
        }), $ = q.end ?? [{
            type: "newline",
            offset: -1,
            indent: Y,
            source: `
`
        }];
        switch (O[0]) {
            case "|":
            case ">": {
                let H = O.indexOf(`
`),
                    j = O.substring(0, H),
                    J = O.substring(H + 1) + `
`,
                    M = [{
                        type: "block-scalar-header",
                        offset: _,
                        indent: Y,
                        source: j
                    }];
                if (!pD7(M, $)) M.push({
                    type: "newline",
                    offset: -1,
                    indent: Y,
                    source: `
`
                });
                return {
                    type: "block-scalar",
                    offset: _,
                    indent: Y,
                    props: M,
                    source: J
                }
            }
            case '"':
                return {
                    type: "double-quoted-scalar", offset: _, indent: Y, source: O, end: $
                };
            case "'":
                return {
                    type: "single-quoted-scalar", offset: _, indent: Y, source: O, end: $
                };
            default:
                return {
                    type: "scalar", offset: _, indent: Y, source: O, end: $
                }
        }
    }

    function zy3(A, q, K = {}) {
        let {
            afterKey: Y = !1,
            implicitKey: z = !1,
            inFlow: _ = !1,
            type: w
        } = K, O = "indent" in A ? A.indent : null;
        if (Y && typeof O === "number") O += 2;
        if (!w) switch (A.type) {
            case "single-quoted-scalar":
                w = "QUOTE_SINGLE";
                break;
            case "double-quoted-scalar":
                w = "QUOTE_DOUBLE";
                break;
            case "block-scalar": {
                let H = A.props[0];
                if (H.type !== "block-scalar-header") throw Error("Invalid block scalar header");
                w = H.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
                break
            }
            default:
                w = "PLAIN"
        }
        let $ = FD7.stringifyString({
            type: w,
            value: q
        }, {
            implicitKey: z || O === null,
            indent: O !== null && O > 0 ? " ".repeat(O) : "",
            inFlow: _,
            options: {
                blockQuote: !0,
                lineWidth: -1
            }
        });
        switch ($[0]) {
            case "|":
            case ">":
                _y3(A, $);
                break;
            case '"':
                I_8(A, $, "double-quoted-scalar");
                break;
            case "'":
                I_8(A, $, "single-quoted-scalar");
                break;
            default:
                I_8(A, $, "scalar")
        }
    }

    function _y3(A, q) {
        let K = q.indexOf(`
`),
            Y = q.substring(0, K),
            z = q.substring(K + 1) + `
`;
        if (A.type === "block-scalar") {
            let _ = A.props[0];
            if (_.type !== "block-scalar-header") throw Error("Invalid block scalar header");
            _.source = Y, A.source = z
        } else {
            let {
                offset: _
            } = A, w = "indent" in A ? A.indent : -1, O = [{
                type: "block-scalar-header",
                offset: _,
                indent: w,
                source: Y
            }];
            if (!pD7(O, "end" in A ? A.end : void 0)) O.push({
                type: "newline",
                offset: -1,
                indent: w,
                source: `
`
            });
            for (let $ of Object.keys(A))
                if ($ !== "type" && $ !== "offset") delete A[$];
            Object.assign(A, {
                type: "block-scalar",
                indent: w,
                props: O,
                source: z
            })
        }
    }

    function pD7(A, q) {
        if (q)
            for (let K of q) switch (K.type) {
                case "space":
                case "comment":
                    A.push(K);
                    break;
                case "newline":
                    return A.push(K), !0
            }
        return !1
    }

    function I_8(A, q, K) {
        switch (A.type) {
            case "scalar":
            case "double-quoted-scalar":
            case "single-quoted-scalar":
                A.type = K, A.source = q;
                break;
            case "block-scalar": {
                let Y = A.props.slice(1),
                    z = q.length;
                if (A.props[0].type === "block-scalar-header") z -= A.props[0].source.length;
                for (let _ of Y) _.offset += z;
                delete A.props, Object.assign(A, {
                    type: K,
                    source: q,
                    end: Y
                });
                break
            }
            case "block-map":
            case "block-seq": {
                let z = {
                    type: "newline",
                    offset: A.offset + q.length,
                    indent: A.indent,
                    source: `
`
                };
                delete A.items, Object.assign(A, {
                    type: K,
                    source: q,
                    end: [z]
                });
                break
            }
            default: {
                let Y = "indent" in A ? A.indent : -1,
                    z = "end" in A && Array.isArray(A.end) ? A.end.filter((_) => _.type === "space" || _.type === "comment" || _.type === "newline") : [];
                for (let _ of Object.keys(A))
                    if (_ !== "type" && _ !== "offset") delete A[_];
                Object.assign(A, {
                    type: K,
                    indent: Y,
                    source: q,
                    end: z
                })
            }
        }
    }
    wy3.createScalarToken = Yy3;
    wy3.resolveAsScalar = Ky3;
    wy3.setScalarValue = zy3
})
// @from(Ln 129950, Col 4)
UD7 = x((Jy3) => {
    var jy3 = (A) => ("type" in A) ? iz1(A) : lz1(A);

    function iz1(A) {
        switch (A.type) {
            case "block-scalar": {
                let q = "";
                for (let K of A.props) q += iz1(K);
                return q + A.source
            }
            case "block-map":
            case "block-seq": {
                let q = "";
                for (let K of A.items) q += lz1(K);
                return q
            }
            case "flow-collection": {
                let q = A.start.source;
                for (let K of A.items) q += lz1(K);
                for (let K of A.end) q += K.source;
                return q
            }
            case "document": {
                let q = lz1(A);
                if (A.end)
                    for (let K of A.end) q += K.source;
                return q
            }
            default: {
                let q = A.source;
                if ("end" in A && A.end)
                    for (let K of A.end) q += K.source;
                return q
            }
        }
    }

    function lz1({
        start: A,
        key: q,
        sep: K,
        value: Y
    }) {
        let z = "";
        for (let _ of A) z += _.source;
        if (q) z += iz1(q);
        if (K)
            for (let _ of K) z += _.source;
        if (Y) z += iz1(Y);
        return z
    }
    Jy3.stringify = jy3
})
// @from(Ln 130003, Col 4)
lD7 = x((Xy3) => {
    var b_8 = Symbol("break visit"),
        Dy3 = Symbol("skip children"),
        dD7 = Symbol("remove item");

    function Eq6(A, q) {
        if ("type" in A && A.type === "document") A = {
            start: A.start,
            value: A.value
        };
        cD7(Object.freeze([]), A, q)
    }
    Eq6.BREAK = b_8;
    Eq6.SKIP = Dy3;
    Eq6.REMOVE = dD7;
    Eq6.itemAtPath = (A, q) => {
        let K = A;
        for (let [Y, z] of q) {
            let _ = K?.[Y];
            if (_ && "items" in _) K = _.items[z];
            else return
        }
        return K
    };
    Eq6.parentCollection = (A, q) => {
        let K = Eq6.itemAtPath(A, q.slice(0, -1)),
            Y = q[q.length - 1][0],
            z = K?.[Y];
        if (z && "items" in z) return z;
        throw Error("Parent collection not found")
    };

    function cD7(A, q, K) {
        let Y = K(q, A);
        if (typeof Y === "symbol") return Y;
        for (let z of ["key", "value"]) {
            let _ = q[z];
            if (_ && "items" in _) {
                for (let w = 0; w < _.items.length; ++w) {
                    let O = cD7(Object.freeze(A.concat([
                        [z, w]
                    ])), _.items[w], K);
                    if (typeof O === "number") w = O - 1;
                    else if (O === b_8) return b_8;
                    else if (O === dD7) _.items.splice(w, 1), w -= 1
                }
                if (typeof Y === "function" && z === "key") Y = Y(q, A)
            }
        }
        return typeof Y === "function" ? Y(q, A) : Y
    }
    Xy3.visit = Eq6
})
// @from(Ln 130056, Col 4)
nz1 = x((Ny3) => {
    var x_8 = QD7(),
        Wy3 = UD7(),
        Zy3 = lD7(),
        u_8 = "\uFEFF",
        m_8 = "\x02",
        B_8 = "\x18",
        g_8 = "\x1F",
        Gy3 = (A) => !!A && ("items" in A),
        fy3 = (A) => !!A && (A.type === "scalar" || A.type === "single-quoted-scalar" || A.type === "double-quoted-scalar" || A.type === "block-scalar");

    function Ty3(A) {
        switch (A) {
            case u_8:
                return "<BOM>";
            case m_8:
                return "<DOC>";
            case B_8:
                return "<FLOW_END>";
            case g_8:
                return "<SCALAR>";
            default:
                return JSON.stringify(A)
        }
    }

    function vy3(A) {
        switch (A) {
            case u_8:
                return "byte-order-mark";
            case m_8:
                return "doc-mode";
            case B_8:
                return "flow-error-end";
            case g_8:
                return "scalar";
            case "---":
                return "doc-start";
            case "...":
                return "doc-end";
            case "":
            case `
`:
            case `\r
`:
                return "newline";
            case "-":
                return "seq-item-ind";
            case "?":
                return "explicit-key-ind";
            case ":":
                return "map-value-ind";
            case "{":
                return "flow-map-start";
            case "}":
                return "flow-map-end";
            case "[":
                return "flow-seq-start";
            case "]":
                return "flow-seq-end";
            case ",":
                return "comma"
        }
        switch (A[0]) {
            case " ":
            case "\t":
                return "space";
            case "#":
                return "comment";
            case "%":
                return "directive-line";
            case "*":
                return "alias";
            case "&":
                return "anchor";
            case "!":
                return "tag";
            case "'":
                return "single-quoted-scalar";
            case '"':
                return "double-quoted-scalar";
            case "|":
            case ">":
                return "block-scalar-header"
        }
        return null
    }
    Ny3.createScalarToken = x_8.createScalarToken;
    Ny3.resolveAsScalar = x_8.resolveAsScalar;
    Ny3.setScalarValue = x_8.setScalarValue;
    Ny3.stringify = Wy3.stringify;
    Ny3.visit = Zy3.visit;
    Ny3.BOM = u_8;
    Ny3.DOCUMENT = m_8;
    Ny3.FLOW_END = B_8;
    Ny3.SCALAR = g_8;
    Ny3.isCollection = Gy3;
    Ny3.isScalar = fy3;
    Ny3.prettyToken = Ty3;
    Ny3.tokenType = vy3
})
// @from(Ln 130157, Col 4)
p_8 = x((gy3) => {
    var Nb6 = nz1();

    function vC(A) {
        switch (A) {
            case void 0:
            case " ":
            case `
`:
            case "\r":
            case "\t":
                return !0;
            default:
                return !1
        }
    }
    var iD7 = new Set("0123456789ABCDEFabcdef"),
        my3 = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"),
        rz1 = new Set(",[]{}"),
        By3 = new Set(` ,[]{}
\r	`),
        F_8 = (A) => !A || By3.has(A);
    class nD7 {
        constructor() {
            this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0
        }* lex(A, q = !1) {
            if (A) {
                if (typeof A !== "string") throw TypeError("source is not a string");
                this.buffer = this.buffer ? this.buffer + A : A, this.lineEndPos = null
            }
            this.atEnd = !q;
            let K = this.next ?? "stream";
            while (K && (q || this.hasChars(1))) K = yield* this.parseNext(K)
        }
        atLineEnd() {
            let A = this.pos,
                q = this.buffer[A];
            while (q === " " || q === "\t") q = this.buffer[++A];
            if (!q || q === "#" || q === `
`) return !0;
            if (q === "\r") return this.buffer[A + 1] === `
`;
            return !1
        }
        charAt(A) {
            return this.buffer[this.pos + A]
        }
        continueScalar(A) {
            let q = this.buffer[A];
            if (this.indentNext > 0) {
                let K = 0;
                while (q === " ") q = this.buffer[++K + A];
                if (q === "\r") {
                    let Y = this.buffer[K + A + 1];
                    if (Y === `
` || !Y && !this.atEnd) return A + K + 1
                }
                return q === `
` || K >= this.indentNext || !q && !this.atEnd ? A + K : -1
            }
            if (q === "-" || q === ".") {
                let K = this.buffer.substr(A, 3);
                if ((K === "---" || K === "...") && vC(this.buffer[A + 3])) return -1
            }
            return A
        }
        getLine() {
            let A = this.lineEndPos;
            if (typeof A !== "number" || A !== -1 && A < this.pos) A = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = A;
            if (A === -1) return this.atEnd ? this.buffer.substring(this.pos) : null;
            if (this.buffer[A - 1] === "\r") A -= 1;
            return this.buffer.substring(this.pos, A)
        }
        hasChars(A) {
            return this.pos + A <= this.buffer.length
        }
        setNext(A) {
            return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = A, null
        }
        peek(A) {
            return this.buffer.substr(this.pos, A)
        }* parseNext(A) {
            switch (A) {
                case "stream":
                    return yield* this.parseStream();
                case "line-start":
                    return yield* this.parseLineStart();
                case "block-start":
                    return yield* this.parseBlockStart();
                case "doc":
                    return yield* this.parseDocument();
                case "flow":
                    return yield* this.parseFlowCollection();
                case "quoted-scalar":
                    return yield* this.parseQuotedScalar();
                case "block-scalar":
                    return yield* this.parseBlockScalar();
                case "plain-scalar":
                    return yield* this.parsePlainScalar()
            }
        }* parseStream() {
            let A = this.getLine();
            if (A === null) return this.setNext("stream");
            if (A[0] === Nb6.BOM) yield* this.pushCount(1), A = A.substring(1);
            if (A[0] === "%") {
                let q = A.length,
                    K = A.indexOf("#");
                while (K !== -1) {
                    let z = A[K - 1];
                    if (z === " " || z === "\t") {
                        q = K - 1;
                        break
                    } else K = A.indexOf("#", K + 1)
                }
                while (!0) {
                    let z = A[q - 1];
                    if (z === " " || z === "\t") q -= 1;
                    else break
                }
                let Y = (yield* this.pushCount(q)) + (yield* this.pushSpaces(!0));
                return yield* this.pushCount(A.length - Y), this.pushNewline(), "stream"
            }
            if (this.atLineEnd()) {
                let q = yield* this.pushSpaces(!0);
                return yield* this.pushCount(A.length - q), yield* this.pushNewline(), "stream"
            }
            return yield Nb6.DOCUMENT, yield* this.parseLineStart()
        }* parseLineStart() {
            let A = this.charAt(0);
            if (!A && !this.atEnd) return this.setNext("line-start");
            if (A === "-" || A === ".") {
                if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
                let q = this.peek(3);
                if ((q === "---" || q === "...") && vC(this.charAt(3))) return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, q === "---" ? "doc" : "stream"
            }
            if (this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !vC(this.charAt(1))) this.indentNext = this.indentValue;
            return yield* this.parseBlockStart()
        }* parseBlockStart() {
            let [A, q] = this.peek(2);
            if (!q && !this.atEnd) return this.setNext("block-start");
            if ((A === "-" || A === "?" || A === ":") && vC(q)) {
                let K = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
                return this.indentNext = this.indentValue + 1, this.indentValue += K, yield* this.parseBlockStart()
            }
            return "doc"
        }* parseDocument() {
            yield* this.pushSpaces(!0);
            let A = this.getLine();
            if (A === null) return this.setNext("doc");
            let q = yield* this.pushIndicators();
            switch (A[q]) {
                case "#":
                    yield* this.pushCount(A.length - q);
                case void 0:
                    return yield* this.pushNewline(), yield* this.parseLineStart();
                case "{":
                case "[":
                    return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
                case "}":
                case "]":
                    return yield* this.pushCount(1), "doc";
                case "*":
                    return yield* this.pushUntil(F_8), "doc";
                case '"':
                case "'":
                    return yield* this.parseQuotedScalar();
                case "|":
                case ">":
                    return q += yield* this.parseBlockScalarHeader(), q += yield* this.pushSpaces(!0), yield* this.pushCount(A.length - q), yield* this.pushNewline(), yield* this.parseBlockScalar();
                default:
                    return yield* this.parsePlainScalar()
            }
        }* parseFlowCollection() {
            let A, q, K = -1;
            do {
                if (A = yield* this.pushNewline(), A > 0) q = yield* this.pushSpaces(!1), this.indentValue = K = q;
                else q = 0;
                q += yield* this.pushSpaces(!0)
            } while (A + q > 0);
            let Y = this.getLine();
            if (Y === null) return this.setNext("flow");
            if (K !== -1 && K < this.indentNext && Y[0] !== "#" || K === 0 && (Y.startsWith("---") || Y.startsWith("...")) && vC(Y[3])) {
                if (!(K === this.indentNext - 1 && this.flowLevel === 1 && (Y[0] === "]" || Y[0] === "}"))) return this.flowLevel = 0, yield Nb6.FLOW_END, yield* this.parseLineStart()
            }
            let z = 0;
            while (Y[z] === ",") z += yield* this.pushCount(1), z += yield* this.pushSpaces(!0), this.flowKey = !1;
            switch (z += yield* this.pushIndicators(), Y[z]) {
                case void 0:
                    return "flow";
                case "#":
                    return yield* this.pushCount(Y.length - z), "flow";
                case "{":
                case "[":
                    return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
                case "}":
                case "]":
                    return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
                case "*":
                    return yield* this.pushUntil(F_8), "flow";
                case '"':
                case "'":
                    return this.flowKey = !0, yield* this.parseQuotedScalar();
                case ":": {
                    let _ = this.charAt(1);
                    if (this.flowKey || vC(_) || _ === ",") return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow"
                }
                default:
                    return this.flowKey = !1, yield* this.parsePlainScalar()
            }
        }* parseQuotedScalar() {
            let A = this.charAt(0),
                q = this.buffer.indexOf(A, this.pos + 1);
            if (A === "'")
                while (q !== -1 && this.buffer[q + 1] === "'") q = this.buffer.indexOf("'", q + 2);
            else
                while (q !== -1) {
                    let z = 0;
                    while (this.buffer[q - 1 - z] === "\\") z += 1;
                    if (z % 2 === 0) break;
                    q = this.buffer.indexOf('"', q + 1)
                }
            let K = this.buffer.substring(0, q),
                Y = K.indexOf(`
`, this.pos);
            if (Y !== -1) {
                while (Y !== -1) {
                    let z = this.continueScalar(Y + 1);
                    if (z === -1) break;
                    Y = K.indexOf(`
`, z)
                }
                if (Y !== -1) q = Y - (K[Y - 1] === "\r" ? 2 : 1)
            }
            if (q === -1) {
                if (!this.atEnd) return this.setNext("quoted-scalar");
                q = this.buffer.length
            }
            return yield* this.pushToIndex(q + 1, !1), this.flowLevel ? "flow" : "doc"
        }* parseBlockScalarHeader() {
            this.blockScalarIndent = -1, this.blockScalarKeep = !1;
            let A = this.pos;
            while (!0) {
                let q = this.buffer[++A];
                if (q === "+") this.blockScalarKeep = !0;
                else if (q > "0" && q <= "9") this.blockScalarIndent = Number(q) - 1;
                else if (q !== "-") break
            }
            return yield* this.pushUntil((q) => vC(q) || q === "#")
        }* parseBlockScalar() {
            let A = this.pos - 1,
                q = 0,
                K;
            A: for (let z = this.pos; K = this.buffer[z]; ++z) switch (K) {
                case " ":
                    q += 1;
                    break;
                case `
`:
                    A = z, q = 0;
                    break;
                case "\r": {
                    let _ = this.buffer[z + 1];
                    if (!_ && !this.atEnd) return this.setNext("block-scalar");
                    if (_ === `
`) break
                }
                default:
                    break A
            }
            if (!K && !this.atEnd) return this.setNext("block-scalar");
            if (q >= this.indentNext) {
                if (this.blockScalarIndent === -1) this.indentNext = q;
                else this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
                do {
                    let z = this.continueScalar(A + 1);
                    if (z === -1) break;
                    A = this.buffer.indexOf(`
`, z)
                } while (A !== -1);
                if (A === -1) {
                    if (!this.atEnd) return this.setNext("block-scalar");
                    A = this.buffer.length
                }
            }
            let Y = A + 1;
            K = this.buffer[Y];
            while (K === " ") K = this.buffer[++Y];
            if (K === "\t") {
                while (K === "\t" || K === " " || K === "\r" || K === `
`) K = this.buffer[++Y];
                A = Y - 1
            } else if (!this.blockScalarKeep)
                do {
                    let z = A - 1,
                        _ = this.buffer[z];
                    if (_ === "\r") _ = this.buffer[--z];
                    let w = z;
                    while (_ === " ") _ = this.buffer[--z];
                    if (_ === `
` && z >= this.pos && z + 1 + q > w) A = z;
                    else break
                } while (!0);
            return yield Nb6.SCALAR, yield* this.pushToIndex(A + 1, !0), yield* this.parseLineStart()
        }* parsePlainScalar() {
            let A = this.flowLevel > 0,
                q = this.pos - 1,
                K = this.pos - 1,
                Y;
            while (Y = this.buffer[++K])
                if (Y === ":") {
                    let z = this.buffer[K + 1];
                    if (vC(z) || A && rz1.has(z)) break;
                    q = K
                } else if (vC(Y)) {
                let z = this.buffer[K + 1];
                if (Y === "\r")
                    if (z === `
`) K += 1, Y = `
`, z = this.buffer[K + 1];
                    else q = K;
                if (z === "#" || A && rz1.has(z)) break;
                if (Y === `
`) {
                    let _ = this.continueScalar(K + 1);
                    if (_ === -1) break;
                    K = Math.max(K, _ - 2)
                }
            } else {
                if (A && rz1.has(Y)) break;
                q = K
            }
            if (!Y && !this.atEnd) return this.setNext("plain-scalar");
            return yield Nb6.SCALAR, yield* this.pushToIndex(q + 1, !0), A ? "flow" : "doc"
        }* pushCount(A) {
            if (A > 0) return yield this.buffer.substr(this.pos, A), this.pos += A, A;
            return 0
        }* pushToIndex(A, q) {
            let K = this.buffer.slice(this.pos, A);
            if (K) return yield K, this.pos += K.length, K.length;
            else if (q) yield "";
            return 0
        }* pushIndicators() {
            switch (this.charAt(0)) {
                case "!":
                    return (yield* this.pushTag()) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
                case "&":
                    return (yield* this.pushUntil(F_8)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
                case "-":
                case "?":
                case ":": {
                    let A = this.flowLevel > 0,
                        q = this.charAt(1);
                    if (vC(q) || A && rz1.has(q)) {
                        if (!A) this.indentNext = this.indentValue + 1;
                        else if (this.flowKey) this.flowKey = !1;
                        return (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators())
                    }
                }
            }
            return 0
        }* pushTag() {
            if (this.charAt(1) === "<") {
                let A = this.pos + 2,
                    q = this.buffer[A];
                while (!vC(q) && q !== ">") q = this.buffer[++A];
                return yield* this.pushToIndex(q === ">" ? A + 1 : A, !1)
            } else {
                let A = this.pos + 1,
                    q = this.buffer[A];
                while (q)
                    if (my3.has(q)) q = this.buffer[++A];
                    else if (q === "%" && iD7.has(this.buffer[A + 1]) && iD7.has(this.buffer[A + 2])) q = this.buffer[A += 3];
                else break;
                return yield* this.pushToIndex(A, !1)
            }
        }* pushNewline() {
            let A = this.buffer[this.pos];
            if (A === `
`) return yield* this.pushCount(1);
            else if (A === "\r" && this.charAt(1) === `
`) return yield* this.pushCount(2);
            else return 0
        }* pushSpaces(A) {
            let q = this.pos - 1,
                K;
            do K = this.buffer[++q]; while (K === " " || A && K === "\t");
            let Y = q - this.pos;
            if (Y > 0) yield this.buffer.substr(this.pos, Y), this.pos = q;
            return Y
        }* pushUntil(A) {
            let q = this.pos,
                K = this.buffer[q];
            while (!A(K)) K = this.buffer[++q];
            return yield* this.pushToIndex(q, !1)
        }
    }
    gy3.Lexer = nD7
})
// @from(Ln 130556, Col 4)
Q_8 = x((py3) => {
    class rD7 {
        constructor() {
            this.lineStarts = [], this.addNewLine = (A) => this.lineStarts.push(A), this.linePos = (A) => {
                let q = 0,
                    K = this.lineStarts.length;
                while (q < K) {
                    let z = q + K >> 1;
                    if (this.lineStarts[z] < A) q = z + 1;
                    else K = z
                }
                if (this.lineStarts[q] === A) return {
                    line: q + 1,
                    col: 1
                };
                if (q === 0) return {
                    line: 0,
                    col: A
                };
                let Y = this.lineStarts[q - 1];
                return {
                    line: q,
                    col: A - Y + 1
                }
            }
        }
    }
    py3.LineCounter = rD7
})