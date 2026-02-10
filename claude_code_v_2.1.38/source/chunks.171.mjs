
// @from(Ln 439619, Col 4)
V_q = v(() => {
    SYz = Object.defineProperty, wmA = 4 * jq, uN = 5 * jq, jF = 2 * jq, Bd1 = 2 * jq + 2 * jF, le = {
        row: 0,
        column: 0
    }, ie = Symbol("INTERNAL");
    WA(oZ1, "assertInternal");
    WA(ud1, "isPoint");
    WA(O_q, "setModule");
    hYz = class {
        static {
            WA(this, "LookaheadIterator")
        } [0] = 0;
        language;
        constructor(A, q, K) {
            oZ1(A), this[0] = q, this.language = K
        }
        get currentTypeId() {
            return D6._ts_lookahead_iterator_current_symbol(this[0])
        }
        get currentType() {
            return this.language.types[this.currentTypeId] || "ERROR"
        }
        delete() {
            D6._ts_lookahead_iterator_delete(this[0]), this[0] = 0
        }
        reset(A, q) {
            if (D6._ts_lookahead_iterator_reset(this[0], A[0], q)) return this.language = A, !0;
            return !1
        }
        resetState(A) {
            return Boolean(D6._ts_lookahead_iterator_reset_state(this[0], A))
        } [Symbol.iterator]() {
            return {
                next: WA(() => {
                    if (D6._ts_lookahead_iterator_next(this[0])) return {
                        done: !1,
                        value: this.currentType
                    };
                    return {
                        done: !0,
                        value: ""
                    }
                }, "next")
            }
        }
    };
    WA(_mA, "getText");
    IYz = class A {
        static {
            WA(this, "Tree")
        } [0] = 0;
        textCallback;
        language;
        constructor(q, K, Y, z) {
            oZ1(q), this[0] = K, this.language = Y, this.textCallback = z
        }
        copy() {
            let q = D6._ts_tree_copy(this[0]);
            return new A(ie, q, this.language, this.textCallback)
        }
        delete() {
            D6._ts_tree_delete(this[0]), this[0] = 0
        }
        get rootNode() {
            return D6._ts_tree_root_node_wasm(this[0]), KO(this)
        }
        rootNodeWithOffset(q, K) {
            let Y = r4 + uN;
            return D6.setValue(Y, q, "i32"), Wy(Y + jq, K), D6._ts_tree_root_node_with_offset_wasm(this[0]), KO(this)
        }
        edit(q) {
            J_q(q), D6._ts_tree_edit_wasm(this[0])
        }
        walk() {
            return this.rootNode.walk()
        }
        getChangedRanges(q) {
            if (!(q instanceof A)) throw TypeError("Argument must be a Tree");
            D6._ts_tree_get_changed_ranges_wasm(this[0], q[0]);
            let K = D6.getValue(r4, "i32"),
                Y = D6.getValue(r4 + jq, "i32"),
                z = Array(K);
            if (K > 0) {
                let w = Y;
                for (let H = 0; H < K; H++) z[H] = jT6(w), w += Bd1;
                D6._free(Y)
            }
            return z
        }
        getIncludedRanges() {
            D6._ts_tree_included_ranges_wasm(this[0]);
            let q = D6.getValue(r4, "i32"),
                K = D6.getValue(r4 + jq, "i32"),
                Y = Array(q);
            if (q > 0) {
                let z = K;
                for (let w = 0; w < q; w++) Y[w] = jT6(z), z += Bd1;
                D6._free(K)
            }
            return Y
        }
    }, xYz = class A {
        static {
            WA(this, "TreeCursor")
        } [0] = 0;
        [1] = 0;
        [2] = 0;
        [3] = 0;
        tree;
        constructor(q, K) {
            oZ1(q), this.tree = K, vE(this)
        }
        copy() {
            let q = new A(ie, this.tree);
            return D6._ts_tree_cursor_copy_wasm(this.tree[0]), vE(q), q
        }
        delete() {
            cw(this), D6._ts_tree_cursor_delete_wasm(this.tree[0]), this[0] = this[1] = this[2] = 0
        }
        get currentNode() {
            return cw(this), D6._ts_tree_cursor_current_node_wasm(this.tree[0]), KO(this.tree)
        }
        get currentFieldId() {
            return cw(this), D6._ts_tree_cursor_current_field_id_wasm(this.tree[0])
        }
        get currentFieldName() {
            return this.tree.language.fields[this.currentFieldId]
        }
        get currentDepth() {
            return cw(this), D6._ts_tree_cursor_current_depth_wasm(this.tree[0])
        }
        get currentDescendantIndex() {
            return cw(this), D6._ts_tree_cursor_current_descendant_index_wasm(this.tree[0])
        }
        get nodeType() {
            return this.tree.language.types[this.nodeTypeId] || "ERROR"
        }
        get nodeTypeId() {
            return cw(this), D6._ts_tree_cursor_current_node_type_id_wasm(this.tree[0])
        }
        get nodeStateId() {
            return cw(this), D6._ts_tree_cursor_current_node_state_id_wasm(this.tree[0])
        }
        get nodeId() {
            return cw(this), D6._ts_tree_cursor_current_node_id_wasm(this.tree[0])
        }
        get nodeIsNamed() {
            return cw(this), D6._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]) === 1
        }
        get nodeIsMissing() {
            return cw(this), D6._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]) === 1
        }
        get nodeText() {
            cw(this);
            let q = D6._ts_tree_cursor_start_index_wasm(this.tree[0]),
                K = D6._ts_tree_cursor_end_index_wasm(this.tree[0]);
            D6._ts_tree_cursor_start_position_wasm(this.tree[0]);
            let Y = t91(r4);
            return _mA(this.tree, q, K, Y)
        }
        get startPosition() {
            return cw(this), D6._ts_tree_cursor_start_position_wasm(this.tree[0]), t91(r4)
        }
        get endPosition() {
            return cw(this), D6._ts_tree_cursor_end_position_wasm(this.tree[0]), t91(r4)
        }
        get startIndex() {
            return cw(this), D6._ts_tree_cursor_start_index_wasm(this.tree[0])
        }
        get endIndex() {
            return cw(this), D6._ts_tree_cursor_end_index_wasm(this.tree[0])
        }
        gotoFirstChild() {
            cw(this);
            let q = D6._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
            return vE(this), q === 1
        }
        gotoLastChild() {
            cw(this);
            let q = D6._ts_tree_cursor_goto_last_child_wasm(this.tree[0]);
            return vE(this), q === 1
        }
        gotoParent() {
            cw(this);
            let q = D6._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
            return vE(this), q === 1
        }
        gotoNextSibling() {
            cw(this);
            let q = D6._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
            return vE(this), q === 1
        }
        gotoPreviousSibling() {
            cw(this);
            let q = D6._ts_tree_cursor_goto_previous_sibling_wasm(this.tree[0]);
            return vE(this), q === 1
        }
        gotoDescendant(q) {
            cw(this), D6._ts_tree_cursor_goto_descendant_wasm(this.tree[0], q), vE(this)
        }
        gotoFirstChildForIndex(q) {
            cw(this), D6.setValue(r4 + wmA, q, "i32");
            let K = D6._ts_tree_cursor_goto_first_child_for_index_wasm(this.tree[0]);
            return vE(this), K === 1
        }
        gotoFirstChildForPosition(q) {
            cw(this), Wy(r4 + wmA, q);
            let K = D6._ts_tree_cursor_goto_first_child_for_position_wasm(this.tree[0]);
            return vE(this), K === 1
        }
        reset(q) {
            _5(q), cw(this, r4 + uN), D6._ts_tree_cursor_reset_wasm(this.tree[0]), vE(this)
        }
        resetTo(q) {
            cw(this, r4), cw(q, r4 + wmA), D6._ts_tree_cursor_reset_to_wasm(this.tree[0], q.tree[0]), vE(this)
        }
    }, bYz = class {
        static {
            WA(this, "Node")
        } [0] = 0;
        _children;
        _namedChildren;
        constructor(A, {
            id: q,
            tree: K,
            startIndex: Y,
            startPosition: z,
            other: w
        }) {
            oZ1(A), this[0] = w, this.id = q, this.tree = K, this.startIndex = Y, this.startPosition = z
        }
        id;
        startIndex;
        startPosition;
        tree;
        get typeId() {
            return _5(this), D6._ts_node_symbol_wasm(this.tree[0])
        }
        get grammarId() {
            return _5(this), D6._ts_node_grammar_symbol_wasm(this.tree[0])
        }
        get type() {
            return this.tree.language.types[this.typeId] || "ERROR"
        }
        get grammarType() {
            return this.tree.language.types[this.grammarId] || "ERROR"
        }
        get isNamed() {
            return _5(this), D6._ts_node_is_named_wasm(this.tree[0]) === 1
        }
        get isExtra() {
            return _5(this), D6._ts_node_is_extra_wasm(this.tree[0]) === 1
        }
        get isError() {
            return _5(this), D6._ts_node_is_error_wasm(this.tree[0]) === 1
        }
        get isMissing() {
            return _5(this), D6._ts_node_is_missing_wasm(this.tree[0]) === 1
        }
        get hasChanges() {
            return _5(this), D6._ts_node_has_changes_wasm(this.tree[0]) === 1
        }
        get hasError() {
            return _5(this), D6._ts_node_has_error_wasm(this.tree[0]) === 1
        }
        get endIndex() {
            return _5(this), D6._ts_node_end_index_wasm(this.tree[0])
        }
        get endPosition() {
            return _5(this), D6._ts_node_end_point_wasm(this.tree[0]), t91(r4)
        }
        get text() {
            return _mA(this.tree, this.startIndex, this.endIndex, this.startPosition)
        }
        get parseState() {
            return _5(this), D6._ts_node_parse_state_wasm(this.tree[0])
        }
        get nextParseState() {
            return _5(this), D6._ts_node_next_parse_state_wasm(this.tree[0])
        }
        equals(A) {
            return this.tree === A.tree && this.id === A.id
        }
        child(A) {
            return _5(this), D6._ts_node_child_wasm(this.tree[0], A), KO(this.tree)
        }
        namedChild(A) {
            return _5(this), D6._ts_node_named_child_wasm(this.tree[0], A), KO(this.tree)
        }
        childForFieldId(A) {
            return _5(this), D6._ts_node_child_by_field_id_wasm(this.tree[0], A), KO(this.tree)
        }
        childForFieldName(A) {
            let q = this.tree.language.fields.indexOf(A);
            if (q !== -1) return this.childForFieldId(q);
            return null
        }
        fieldNameForChild(A) {
            _5(this);
            let q = D6._ts_node_field_name_for_child_wasm(this.tree[0], A);
            if (!q) return null;
            return D6.AsciiToString(q)
        }
        fieldNameForNamedChild(A) {
            _5(this);
            let q = D6._ts_node_field_name_for_named_child_wasm(this.tree[0], A);
            if (!q) return null;
            return D6.AsciiToString(q)
        }
        childrenForFieldName(A) {
            let q = this.tree.language.fields.indexOf(A);
            if (q !== -1 && q !== 0) return this.childrenForFieldId(q);
            return []
        }
        childrenForFieldId(A) {
            _5(this), D6._ts_node_children_by_field_id_wasm(this.tree[0], A);
            let q = D6.getValue(r4, "i32"),
                K = D6.getValue(r4 + jq, "i32"),
                Y = Array(q);
            if (q > 0) {
                let z = K;
                for (let w = 0; w < q; w++) Y[w] = KO(this.tree, z), z += uN;
                D6._free(K)
            }
            return Y
        }
        firstChildForIndex(A) {
            _5(this);
            let q = r4 + uN;
            return D6.setValue(q, A, "i32"), D6._ts_node_first_child_for_byte_wasm(this.tree[0]), KO(this.tree)
        }
        firstNamedChildForIndex(A) {
            _5(this);
            let q = r4 + uN;
            return D6.setValue(q, A, "i32"), D6._ts_node_first_named_child_for_byte_wasm(this.tree[0]), KO(this.tree)
        }
        get childCount() {
            return _5(this), D6._ts_node_child_count_wasm(this.tree[0])
        }
        get namedChildCount() {
            return _5(this), D6._ts_node_named_child_count_wasm(this.tree[0])
        }
        get firstChild() {
            return this.child(0)
        }
        get firstNamedChild() {
            return this.namedChild(0)
        }
        get lastChild() {
            return this.child(this.childCount - 1)
        }
        get lastNamedChild() {
            return this.namedChild(this.namedChildCount - 1)
        }
        get children() {
            if (!this._children) {
                _5(this), D6._ts_node_children_wasm(this.tree[0]);
                let A = D6.getValue(r4, "i32"),
                    q = D6.getValue(r4 + jq, "i32");
                if (this._children = Array(A), A > 0) {
                    let K = q;
                    for (let Y = 0; Y < A; Y++) this._children[Y] = KO(this.tree, K), K += uN;
                    D6._free(q)
                }
            }
            return this._children
        }
        get namedChildren() {
            if (!this._namedChildren) {
                _5(this), D6._ts_node_named_children_wasm(this.tree[0]);
                let A = D6.getValue(r4, "i32"),
                    q = D6.getValue(r4 + jq, "i32");
                if (this._namedChildren = Array(A), A > 0) {
                    let K = q;
                    for (let Y = 0; Y < A; Y++) this._namedChildren[Y] = KO(this.tree, K), K += uN;
                    D6._free(q)
                }
            }
            return this._namedChildren
        }
        descendantsOfType(A, q = le, K = le) {
            if (!Array.isArray(A)) A = [A];
            let Y = [],
                z = this.tree.language.types;
            for (let _ of A)
                if (_ == "ERROR") Y.push(65535);
            for (let _ = 0, J = z.length; _ < J; _++)
                if (A.includes(z[_])) Y.push(_);
            let w = D6._malloc(jq * Y.length);
            for (let _ = 0, J = Y.length; _ < J; _++) D6.setValue(w + _ * jq, Y[_], "i32");
            _5(this), D6._ts_node_descendants_of_type_wasm(this.tree[0], w, Y.length, q.row, q.column, K.row, K.column);
            let H = D6.getValue(r4, "i32"),
                $ = D6.getValue(r4 + jq, "i32"),
                O = Array(H);
            if (H > 0) {
                let _ = $;
                for (let J = 0; J < H; J++) O[J] = KO(this.tree, _), _ += uN
            }
            return D6._free($), D6._free(w), O
        }
        get nextSibling() {
            return _5(this), D6._ts_node_next_sibling_wasm(this.tree[0]), KO(this.tree)
        }
        get previousSibling() {
            return _5(this), D6._ts_node_prev_sibling_wasm(this.tree[0]), KO(this.tree)
        }
        get nextNamedSibling() {
            return _5(this), D6._ts_node_next_named_sibling_wasm(this.tree[0]), KO(this.tree)
        }
        get previousNamedSibling() {
            return _5(this), D6._ts_node_prev_named_sibling_wasm(this.tree[0]), KO(this.tree)
        }
        get descendantCount() {
            return _5(this), D6._ts_node_descendant_count_wasm(this.tree[0])
        }
        get parent() {
            return _5(this), D6._ts_node_parent_wasm(this.tree[0]), KO(this.tree)
        }
        childWithDescendant(A) {
            return _5(this), _5(A, 1), D6._ts_node_child_with_descendant_wasm(this.tree[0]), KO(this.tree)
        }
        descendantForIndex(A, q = A) {
            if (typeof A !== "number" || typeof q !== "number") throw Error("Arguments must be numbers");
            _5(this);
            let K = r4 + uN;
            return D6.setValue(K, A, "i32"), D6.setValue(K + jq, q, "i32"), D6._ts_node_descendant_for_index_wasm(this.tree[0]), KO(this.tree)
        }
        namedDescendantForIndex(A, q = A) {
            if (typeof A !== "number" || typeof q !== "number") throw Error("Arguments must be numbers");
            _5(this);
            let K = r4 + uN;
            return D6.setValue(K, A, "i32"), D6.setValue(K + jq, q, "i32"), D6._ts_node_named_descendant_for_index_wasm(this.tree[0]), KO(this.tree)
        }
        descendantForPosition(A, q = A) {
            if (!ud1(A) || !ud1(q)) throw Error("Arguments must be {row, column} objects");
            _5(this);
            let K = r4 + uN;
            return Wy(K, A), Wy(K + jF, q), D6._ts_node_descendant_for_position_wasm(this.tree[0]), KO(this.tree)
        }
        namedDescendantForPosition(A, q = A) {
            if (!ud1(A) || !ud1(q)) throw Error("Arguments must be {row, column} objects");
            _5(this);
            let K = r4 + uN;
            return Wy(K, A), Wy(K + jF, q), D6._ts_node_named_descendant_for_position_wasm(this.tree[0]), KO(this.tree)
        }
        walk() {
            return _5(this), D6._ts_tree_cursor_new_wasm(this.tree[0]), new xYz(ie, this.tree)
        }
        edit(A) {
            if (this.startIndex >= A.oldEndIndex) {
                this.startIndex = A.newEndIndex + (this.startIndex - A.oldEndIndex);
                let q, K;
                if (this.startPosition.row > A.oldEndPosition.row) q = this.startPosition.row - A.oldEndPosition.row, K = this.startPosition.column;
                else if (q = 0, K = this.startPosition.column, this.startPosition.column >= A.oldEndPosition.column) K = this.startPosition.column - A.oldEndPosition.column;
                if (q > 0) this.startPosition.row += q, this.startPosition.column = K;
                else this.startPosition.column += K
            } else if (this.startIndex > A.startIndex) this.startIndex = A.newEndIndex, this.startPosition.row = A.newEndPosition.row, this.startPosition.column = A.newEndPosition.column
        }
        toString() {
            _5(this);
            let A = D6._ts_node_to_string_wasm(this.tree[0]),
                q = D6.AsciiToString(A);
            return D6._free(A), q
        }
    };
    WA(OmA, "unmarshalCaptures");
    WA(_5, "marshalNode");
    WA(KO, "unmarshalNode");
    WA(cw, "marshalTreeCursor");
    WA(vE, "unmarshalTreeCursor");
    WA(Wy, "marshalPoint");
    WA(t91, "unmarshalPoint");
    WA(__q, "marshalRange");
    WA(jT6, "unmarshalRange");
    WA(J_q, "marshalEdit");
    WA(X_q, "unmarshalLanguageMetadata");
    mYz = /[\w-]+/g, NE$ = {
        Zero: 0,
        ZeroOrOne: 1,
        ZeroOrMore: 2,
        One: 3,
        OneOrMore: 4
    }, $_q = WA((A) => A.type === "capture", "isCaptureStep"), JmA = WA((A) => A.type === "string", "isStringStep"), sI = {
        Syntax: 1,
        NodeName: 2,
        FieldName: 3,
        CaptureName: 4,
        PatternStructure: 5
    }, bd1 = class A extends Error {
        constructor(q, K, Y, z) {
            super(A.formatMessage(q, K));
            this.kind = q, this.info = K, this.index = Y, this.length = z, this.name = "QueryError"
        }
        static {
            WA(this, "QueryError")
        }
        static formatMessage(q, K) {
            switch (q) {
                case sI.NodeName:
                    return `Bad node name '${K.word}'`;
                case sI.FieldName:
                    return `Bad field name '${K.word}'`;
                case sI.CaptureName:
                    return `Bad capture name @${K.word}`;
                case sI.PatternStructure:
                    return `Bad pattern structure at offset ${K.suffix}`;
                case sI.Syntax:
                    return `Bad syntax at offset ${K.suffix}`
            }
        }
    };
    WA(D_q, "parseAnyPredicate");
    WA(j_q, "parseMatchPredicate");
    WA(M_q, "parseAnyOfPredicate");
    WA(P_q, "parseIsPredicate");
    WA(W_q, "parseSetDirective");
    WA(G_q, "parsePattern");
    FYz = class {
        static {
            WA(this, "Query")
        } [0] = 0;
        exceededMatchLimit;
        textPredicates;
        captureNames;
        captureQuantifiers;
        predicates;
        setProperties;
        assertedProperties;
        refutedProperties;
        matchLimit;
        constructor(A, q) {
            let K = D6.lengthBytesUTF8(q),
                Y = D6._malloc(K + 1);
            D6.stringToUTF8(q, Y, K + 1);
            let z = D6._ts_query_new(A[0], Y, K, r4, r4 + jq);
            if (!z) {
                let W = D6.getValue(r4 + jq, "i32"),
                    G = D6.getValue(r4, "i32"),
                    f = D6.UTF8ToString(Y, G).length,
                    Z = q.slice(f, f + 100).split(`
`)[0],
                    N = Z.match(mYz)?.[0] ?? "";
                switch (D6._free(Y), W) {
                    case sI.Syntax:
                        throw new bd1(sI.Syntax, {
                            suffix: `${f}: '${Z}'...`
                        }, f, 0);
                    case sI.NodeName:
                        throw new bd1(W, {
                            word: N
                        }, f, N.length);
                    case sI.FieldName:
                        throw new bd1(W, {
                            word: N
                        }, f, N.length);
                    case sI.CaptureName:
                        throw new bd1(W, {
                            word: N
                        }, f, N.length);
                    case sI.PatternStructure:
                        throw new bd1(W, {
                            suffix: `${f}: '${Z}'...`
                        }, f, 0)
                }
            }
            let w = D6._ts_query_string_count(z),
                H = D6._ts_query_capture_count(z),
                $ = D6._ts_query_pattern_count(z),
                O = Array(H),
                _ = Array($),
                J = Array(w);
            for (let W = 0; W < H; W++) {
                let G = D6._ts_query_capture_name_for_id(z, W, r4),
                    f = D6.getValue(r4, "i32");
                O[W] = D6.UTF8ToString(G, f)
            }
            for (let W = 0; W < $; W++) {
                let G = Array(H);
                for (let f = 0; f < H; f++) {
                    let Z = D6._ts_query_capture_quantifier_for_id(z, W, f);
                    G[f] = Z
                }
                _[W] = G
            }
            for (let W = 0; W < w; W++) {
                let G = D6._ts_query_string_value_for_id(z, W, r4),
                    f = D6.getValue(r4, "i32");
                J[W] = D6.UTF8ToString(G, f)
            }
            let X = Array($),
                D = Array($),
                j = Array($),
                M = Array($),
                P = Array($);
            for (let W = 0; W < $; W++) {
                let G = D6._ts_query_predicates_for_pattern(z, W, r4),
                    f = D6.getValue(r4, "i32");
                M[W] = [], P[W] = [];
                let Z = [],
                    N = G;
                for (let T = 0; T < f; T++) {
                    let k = D6.getValue(N, "i32");
                    N += jq;
                    let y = D6.getValue(N, "i32");
                    N += jq, G_q(W, k, y, O, J, Z, P, M, X, D, j)
                }
                Object.freeze(P[W]), Object.freeze(M[W]), Object.freeze(X[W]), Object.freeze(D[W]), Object.freeze(j[W])
            }
            D6._free(Y), this[0] = z, this.captureNames = O, this.captureQuantifiers = _, this.textPredicates = P, this.predicates = M, this.setProperties = X, this.assertedProperties = D, this.refutedProperties = j, this.exceededMatchLimit = !1
        }
        delete() {
            D6._ts_query_delete(this[0]), this[0] = 0
        }
        matches(A, q = {}) {
            let K = q.startPosition ?? le,
                Y = q.endPosition ?? le,
                z = q.startIndex ?? 0,
                w = q.endIndex ?? 0,
                H = q.matchLimit ?? 4294967295,
                $ = q.maxStartDepth ?? 4294967295,
                O = q.timeoutMicros ?? 0,
                _ = q.progressCallback;
            if (typeof H !== "number") throw Error("Arguments must be numbers");
            if (this.matchLimit = H, w !== 0 && z > w) throw Error("`startIndex` cannot be greater than `endIndex`");
            if (Y !== le && (K.row > Y.row || K.row === Y.row && K.column > Y.column)) throw Error("`startPosition` cannot be greater than `endPosition`");
            if (_) D6.currentQueryProgressCallback = _;
            _5(A), D6._ts_query_matches_wasm(this[0], A.tree[0], K.row, K.column, Y.row, Y.column, z, w, H, $, O);
            let J = D6.getValue(r4, "i32"),
                X = D6.getValue(r4 + jq, "i32"),
                D = D6.getValue(r4 + 2 * jq, "i32"),
                j = Array(J);
            this.exceededMatchLimit = Boolean(D);
            let M = 0,
                P = X;
            for (let W = 0; W < J; W++) {
                let G = D6.getValue(P, "i32");
                P += jq;
                let f = D6.getValue(P, "i32");
                P += jq;
                let Z = Array(f);
                if (P = OmA(this, A.tree, P, G, Z), this.textPredicates[G].every((N) => N(Z))) {
                    j[M] = {
                        pattern: G,
                        patternIndex: G,
                        captures: Z
                    };
                    let N = this.setProperties[G];
                    j[M].setProperties = N;
                    let T = this.assertedProperties[G];
                    j[M].assertedProperties = T;
                    let k = this.refutedProperties[G];
                    j[M].refutedProperties = k, M++
                }
            }
            return j.length = M, D6._free(X), D6.currentQueryProgressCallback = null, j
        }
        captures(A, q = {}) {
            let K = q.startPosition ?? le,
                Y = q.endPosition ?? le,
                z = q.startIndex ?? 0,
                w = q.endIndex ?? 0,
                H = q.matchLimit ?? 4294967295,
                $ = q.maxStartDepth ?? 4294967295,
                O = q.timeoutMicros ?? 0,
                _ = q.progressCallback;
            if (typeof H !== "number") throw Error("Arguments must be numbers");
            if (this.matchLimit = H, w !== 0 && z > w) throw Error("`startIndex` cannot be greater than `endIndex`");
            if (Y !== le && (K.row > Y.row || K.row === Y.row && K.column > Y.column)) throw Error("`startPosition` cannot be greater than `endPosition`");
            if (_) D6.currentQueryProgressCallback = _;
            _5(A), D6._ts_query_captures_wasm(this[0], A.tree[0], K.row, K.column, Y.row, Y.column, z, w, H, $, O);
            let J = D6.getValue(r4, "i32"),
                X = D6.getValue(r4 + jq, "i32"),
                D = D6.getValue(r4 + 2 * jq, "i32"),
                j = [];
            this.exceededMatchLimit = Boolean(D);
            let M = [],
                P = X;
            for (let W = 0; W < J; W++) {
                let G = D6.getValue(P, "i32");
                P += jq;
                let f = D6.getValue(P, "i32");
                P += jq;
                let Z = D6.getValue(P, "i32");
                if (P += jq, M.length = f, P = OmA(this, A.tree, P, G, M), this.textPredicates[G].every((N) => N(M))) {
                    let N = M[Z],
                        T = this.setProperties[G];
                    N.setProperties = T;
                    let k = this.assertedProperties[G];
                    N.assertedProperties = k;
                    let y = this.refutedProperties[G];
                    N.refutedProperties = y, j.push(N)
                }
            }
            return D6._free(X), D6.currentQueryProgressCallback = null, j
        }
        predicatesForPattern(A) {
            return this.predicates[A]
        }
        disableCapture(A) {
            let q = D6.lengthBytesUTF8(A),
                K = D6._malloc(q + 1);
            D6.stringToUTF8(A, K, q + 1), D6._ts_query_disable_capture(this[0], K, q), D6._free(K)
        }
        disablePattern(A) {
            if (A >= this.predicates.length) throw Error(`Pattern index is ${A} but the pattern count is ${this.predicates.length}`);
            D6._ts_query_disable_pattern(this[0], A)
        }
        didExceedMatchLimit() {
            return this.exceededMatchLimit
        }
        startIndexForPattern(A) {
            if (A >= this.predicates.length) throw Error(`Pattern index is ${A} but the pattern count is ${this.predicates.length}`);
            return D6._ts_query_start_byte_for_pattern(this[0], A)
        }
        endIndexForPattern(A) {
            if (A >= this.predicates.length) throw Error(`Pattern index is ${A} but the pattern count is ${this.predicates.length}`);
            return D6._ts_query_end_byte_for_pattern(this[0], A)
        }
        patternCount() {
            return D6._ts_query_pattern_count(this[0])
        }
        captureIndexForName(A) {
            return this.captureNames.indexOf(A)
        }
        isPatternRooted(A) {
            return D6._ts_query_is_pattern_rooted(this[0], A) === 1
        }
        isPatternNonLocal(A) {
            return D6._ts_query_is_pattern_non_local(this[0], A) === 1
        }
        isPatternGuaranteedAtStep(A) {
            return D6._ts_query_is_pattern_guaranteed_at_step(this[0], A) === 1
        }
    }, QYz = /^tree_sitter_\w+$/, MT6 = class A {
        static {
            WA(this, "Language")
        } [0] = 0;
        types;
        fields;
        constructor(q, K) {
            oZ1(q), this[0] = K, this.types = Array(D6._ts_language_symbol_count(this[0]));
            for (let Y = 0, z = this.types.length; Y < z; Y++)
                if (D6._ts_language_symbol_type(this[0], Y) < 2) this.types[Y] = D6.UTF8ToString(D6._ts_language_symbol_name(this[0], Y));
            this.fields = Array(D6._ts_language_field_count(this[0]) + 1);
            for (let Y = 0, z = this.fields.length; Y < z; Y++) {
                let w = D6._ts_language_field_name_for_id(this[0], Y);
                if (w !== 0) this.fields[Y] = D6.UTF8ToString(w);
                else this.fields[Y] = null
            }
        }
        get name() {
            let q = D6._ts_language_name(this[0]);
            if (q === 0) return null;
            return D6.UTF8ToString(q)
        }
        get version() {
            return D6._ts_language_version(this[0])
        }
        get abiVersion() {
            return D6._ts_language_abi_version(this[0])
        }
        get metadata() {
            D6._ts_language_metadata(this[0]);
            let q = D6.getValue(r4, "i32"),
                K = D6.getValue(r4 + jq, "i32");
            if (q === 0) return null;
            return X_q(K)
        }
        get fieldCount() {
            return this.fields.length - 1
        }
        get stateCount() {
            return D6._ts_language_state_count(this[0])
        }
        fieldIdForName(q) {
            let K = this.fields.indexOf(q);
            return K !== -1 ? K : null
        }
        fieldNameForId(q) {
            return this.fields[q] ?? null
        }
        idForNodeType(q, K) {
            let Y = D6.lengthBytesUTF8(q),
                z = D6._malloc(Y + 1);
            D6.stringToUTF8(q, z, Y + 1);
            let w = D6._ts_language_symbol_for_name(this[0], z, Y, K ? 1 : 0);
            return D6._free(z), w || null
        }
        get nodeTypeCount() {
            return D6._ts_language_symbol_count(this[0])
        }
        nodeTypeForId(q) {
            let K = D6._ts_language_symbol_name(this[0], q);
            return K ? D6.UTF8ToString(K) : null
        }
        nodeTypeIsNamed(q) {
            return D6._ts_language_type_is_named_wasm(this[0], q) ? !0 : !1
        }
        nodeTypeIsVisible(q) {
            return D6._ts_language_type_is_visible_wasm(this[0], q) ? !0 : !1
        }
        get supertypes() {
            D6._ts_language_supertypes_wasm(this[0]);
            let q = D6.getValue(r4, "i32"),
                K = D6.getValue(r4 + jq, "i32"),
                Y = Array(q);
            if (q > 0) {
                let z = K;
                for (let w = 0; w < q; w++) Y[w] = D6.getValue(z, "i16"), z += H_q
            }
            return Y
        }
        subtypes(q) {
            D6._ts_language_subtypes_wasm(this[0], q);
            let K = D6.getValue(r4, "i32"),
                Y = D6.getValue(r4 + jq, "i32"),
                z = Array(K);
            if (K > 0) {
                let w = Y;
                for (let H = 0; H < K; H++) z[H] = D6.getValue(w, "i16"), w += H_q
            }
            return z
        }
        nextState(q, K) {
            return D6._ts_language_next_state(this[0], q, K)
        }
        lookaheadIterator(q) {
            let K = D6._ts_lookahead_iterator_new(this[0], q);
            if (K) return new hYz(ie, K, this);
            return null
        }
        query(q) {
            return console.warn("Language.query is deprecated. Use new Query(language, source) instead."), new FYz(this, q)
        }
        static async load(q) {
            let K;
            if (q instanceof Uint8Array) K = Promise.resolve(q);
            else if (globalThis.process?.versions.node) K = (await import("fs/promises")).readFile(q);
            else K = fetch(q).then(($) => $.arrayBuffer().then((O) => {
                if ($.ok) return new Uint8Array(O);
                else {
                    let _ = new TextDecoder("utf-8").decode(O);
                    throw Error(`Language.load failed with status ${$.status}.

${_}`)
                }
            }));
            let Y = await D6.loadWebAssemblyModule(await K, {
                    loadAsync: !0
                }),
                z = Object.keys(Y),
                w = z.find(($) => QYz.test($) && !$.includes("external_scanner_"));
            if (!w) throw console.log(`Couldn't find language function in WASM file. Symbols:
${JSON.stringify(z,null,2)}`), Error("Language.load failed: no language function found in WASM file");
            let H = Y[w]();
            return new A(ie, H)
        }
    }, gYz = (() => {
        var _scriptName = import.meta.url;
        return async function(moduleArg = {}) {
            var moduleRtn, Module = moduleArg,
                readyPromiseResolve, readyPromiseReject, readyPromise = new Promise((A, q) => {
                    readyPromiseResolve = A, readyPromiseReject = q
                }),
                ENVIRONMENT_IS_WEB = typeof window == "object",
                ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope < "u",
                ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer",
                ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
            if (ENVIRONMENT_IS_NODE) {
                let {
                    createRequire: A
                } = await import("module");
                var require = A(import.meta.url)
            }
            Module.currentQueryProgressCallback = null, Module.currentProgressCallback = null, Module.currentLogCallback = null, Module.currentParseCallback = null;
            var moduleOverrides = Object.assign({}, Module),
                arguments_ = [],
                thisProgram = "./this.program",
                quit_ = WA((A, q) => {
                    throw q
                }, "quit_"),
                scriptDirectory = "";

            function locateFile(A) {
                if (Module.locateFile) return Module.locateFile(A, scriptDirectory);
                return scriptDirectory + A
            }
            WA(locateFile, "locateFile");
            var readAsync, readBinary;
            if (ENVIRONMENT_IS_NODE) {
                var fs = require("fs"),
                    nodePath = require("path");
                if (!import.meta.url.startsWith("data:")) scriptDirectory = nodePath.dirname(require("url").fileURLToPath(import.meta.url)) + "/";
                if (readBinary = WA((A) => {
                        A = isFileURI(A) ? new URL(A) : A;
                        var q = fs.readFileSync(A);
                        return q
                    }, "readBinary"), readAsync = WA(async (A, q = !0) => {
                        A = isFileURI(A) ? new URL(A) : A;
                        var K = fs.readFileSync(A, q ? void 0 : "utf8");
                        return K
                    }, "readAsync"), !Module.thisProgram && process.argv.length > 1) thisProgram = process.argv[1].replace(/\\/g, "/");
                arguments_ = process.argv.slice(2), quit_ = WA((A, q) => {
                    throw process.exitCode = A, q
                }, "quit_")
            } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
                if (ENVIRONMENT_IS_WORKER) scriptDirectory = self.location.href;
                else if (typeof document < "u" && document.currentScript) scriptDirectory = document.currentScript.src;
                if (_scriptName) scriptDirectory = _scriptName;
                if (scriptDirectory.startsWith("blob:")) scriptDirectory = "";
                else scriptDirectory = scriptDirectory.slice(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
                {
                    if (ENVIRONMENT_IS_WORKER) readBinary = WA((A) => {
                        var q = new XMLHttpRequest;
                        return q.open("GET", A, !1), q.responseType = "arraybuffer", q.send(null), new Uint8Array(q.response)
                    }, "readBinary");
                    readAsync = WA(async (A) => {
                        if (isFileURI(A)) return new Promise((K, Y) => {
                            var z = new XMLHttpRequest;
                            z.open("GET", A, !0), z.responseType = "arraybuffer", z.onload = () => {
                                if (z.status == 200 || z.status == 0 && z.response) {
                                    K(z.response);
                                    return
                                }
                                Y(z.status)
                            }, z.onerror = Y, z.send(null)
                        });
                        var q = await fetch(A, {
                            credentials: "same-origin"
                        });
                        if (q.ok) return q.arrayBuffer();
                        throw Error(q.status + " : " + q.url)
                    }, "readAsync")
                }
            }
            var out = Module.print || console.log.bind(console),
                err = Module.printErr || console.error.bind(console);
            if (Object.assign(Module, moduleOverrides), moduleOverrides = null, Module.arguments) arguments_ = Module.arguments;
            if (Module.thisProgram) thisProgram = Module.thisProgram;
            var dynamicLibraries = Module.dynamicLibraries || [],
                wasmBinary = Module.wasmBinary,
                wasmMemory, ABORT = !1,
                EXITSTATUS;

            function assert(A, q) {
                if (!A) abort(q)
            }
            WA(assert, "assert");
            var HEAP, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPU64, HEAPF64, HEAP_DATA_VIEW, runtimeInitialized = !1,
                isFileURI = WA((A) => A.startsWith("file://"), "isFileURI");

            function updateMemoryViews() {
                var A = wasmMemory.buffer;
                Module.HEAP_DATA_VIEW = HEAP_DATA_VIEW = new DataView(A), Module.HEAP8 = HEAP8 = new Int8Array(A), Module.HEAP16 = HEAP16 = new Int16Array(A), Module.HEAPU8 = HEAPU8 = new Uint8Array(A), Module.HEAPU16 = HEAPU16 = new Uint16Array(A), Module.HEAP32 = HEAP32 = new Int32Array(A), Module.HEAPU32 = HEAPU32 = new Uint32Array(A), Module.HEAPF32 = HEAPF32 = new Float32Array(A), Module.HEAPF64 = HEAPF64 = new Float64Array(A), Module.HEAP64 = HEAP64 = new BigInt64Array(A), Module.HEAPU64 = HEAPU64 = new BigUint64Array(A)
            }
            if (WA(updateMemoryViews, "updateMemoryViews"), Module.wasmMemory) wasmMemory = Module.wasmMemory;
            else {
                var INITIAL_MEMORY = Module.INITIAL_MEMORY || 33554432;
                wasmMemory = new WebAssembly.Memory({
                    initial: INITIAL_MEMORY / 65536,
                    maximum: 32768
                })
            }
            updateMemoryViews();
            var __RELOC_FUNCS__ = [];

            function preRun() {
                if (Module.preRun) {
                    if (typeof Module.preRun == "function") Module.preRun = [Module.preRun];
                    while (Module.preRun.length) addOnPreRun(Module.preRun.shift())
                }
                callRuntimeCallbacks(onPreRuns)
            }
            WA(preRun, "preRun");

            function initRuntime() {
                runtimeInitialized = !0, callRuntimeCallbacks(__RELOC_FUNCS__), wasmExports.__wasm_call_ctors(), callRuntimeCallbacks(onPostCtors)
            }
            WA(initRuntime, "initRuntime");

            function preMain() {}
            WA(preMain, "preMain");

            function postRun() {
                if (Module.postRun) {
                    if (typeof Module.postRun == "function") Module.postRun = [Module.postRun];
                    while (Module.postRun.length) addOnPostRun(Module.postRun.shift())
                }
                callRuntimeCallbacks(onPostRuns)
            }
            WA(postRun, "postRun");
            var runDependencies = 0,
                dependenciesFulfilled = null;

            function getUniqueRunDependency(A) {
                return A
            }
            WA(getUniqueRunDependency, "getUniqueRunDependency");

            function addRunDependency(A) {
                runDependencies++, Module.monitorRunDependencies?.(runDependencies)
            }
            WA(addRunDependency, "addRunDependency");

            function removeRunDependency(A) {
                if (runDependencies--, Module.monitorRunDependencies?.(runDependencies), runDependencies == 0) {
                    if (dependenciesFulfilled) {
                        var q = dependenciesFulfilled;
                        dependenciesFulfilled = null, q()
                    }
                }
            }
            WA(removeRunDependency, "removeRunDependency");

            function abort(A) {
                Module.onAbort?.(A), A = "Aborted(" + A + ")", err(A), ABORT = !0, A += ". Build with -sASSERTIONS for more info.";
                var q = new WebAssembly.RuntimeError(A);
                throw readyPromiseReject(q), q
            }
            WA(abort, "abort");
            var wasmBinaryFile;

            function findWasmBinary() {
                if (Module.locateFile) return locateFile("tree-sitter.wasm");
                return new URL("tree-sitter.wasm", import.meta.url).href
            }
            WA(findWasmBinary, "findWasmBinary");

            function getBinarySync(A) {
                if (A == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
                if (readBinary) return readBinary(A);
                throw "both async and sync fetching of the wasm failed"
            }
            WA(getBinarySync, "getBinarySync");
            async function getWasmBinary(A) {
                if (!wasmBinary) try {
                    var q = await readAsync(A);
                    return new Uint8Array(q)
                } catch {}
                return getBinarySync(A)
            }
            WA(getWasmBinary, "getWasmBinary");
            async function instantiateArrayBuffer(A, q) {
                try {
                    var K = await getWasmBinary(A),
                        Y = await WebAssembly.instantiate(K, q);
                    return Y
                } catch (z) {
                    err(`failed to asynchronously prepare wasm: ${z}`), abort(z)
                }
            }
            WA(instantiateArrayBuffer, "instantiateArrayBuffer");
            async function instantiateAsync(A, q, K) {
                if (!A && typeof WebAssembly.instantiateStreaming == "function" && !isFileURI(q) && !ENVIRONMENT_IS_NODE) try {
                    var Y = fetch(q, {
                            credentials: "same-origin"
                        }),
                        z = await WebAssembly.instantiateStreaming(Y, K);
                    return z
                } catch (w) {
                    err(`wasm streaming compile failed: ${w}`), err("falling back to ArrayBuffer instantiation")
                }
                return instantiateArrayBuffer(q, K)
            }
            WA(instantiateAsync, "instantiateAsync");

            function getWasmImports() {
                return {
                    env: wasmImports,
                    wasi_snapshot_preview1: wasmImports,
                    "GOT.mem": new Proxy(wasmImports, GOTHandler),
                    "GOT.func": new Proxy(wasmImports, GOTHandler)
                }
            }
            WA(getWasmImports, "getWasmImports");
            async function createWasm() {
                function A(w, H) {
                    wasmExports = w.exports, wasmExports = relocateExports(wasmExports, 1024);
                    var $ = getDylinkMetadata(H);
                    if ($.neededDynlibs) dynamicLibraries = $.neededDynlibs.concat(dynamicLibraries);
                    return mergeLibSymbols(wasmExports, "main"), LDSO.init(), loadDylibs(), __RELOC_FUNCS__.push(wasmExports.__wasm_apply_data_relocs), removeRunDependency("wasm-instantiate"), wasmExports
                }
                WA(A, "receiveInstance"), addRunDependency("wasm-instantiate");

                function q(w) {
                    return A(w.instance, w.module)
                }
                WA(q, "receiveInstantiationResult");
                var K = getWasmImports();
                if (Module.instantiateWasm) return new Promise((w, H) => {
                    Module.instantiateWasm(K, ($, O) => {
                        A($, O), w($.exports)
                    })
                });
                wasmBinaryFile ??= findWasmBinary();
                try {
                    var Y = await instantiateAsync(wasmBinary, wasmBinaryFile, K),
                        z = q(Y);
                    return z
                } catch (w) {
                    return readyPromiseReject(w), Promise.reject(w)
                }
            }
            WA(createWasm, "createWasm");
            var ASM_CONSTS = {};
            class ExitStatus {
                static {
                    WA(this, "ExitStatus")
                }
                name = "ExitStatus";
                constructor(A) {
                    this.message = `Program terminated with exit(${A})`, this.status = A
                }
            }
            var GOT = {},
                currentModuleWeakSymbols = new Set([]),
                GOTHandler = {
                    get(A, q) {
                        var K = GOT[q];
                        if (!K) K = GOT[q] = new WebAssembly.Global({
                            value: "i32",
                            mutable: !0
                        });
                        if (!currentModuleWeakSymbols.has(q)) K.required = !0;
                        return K
                    }
                },
                LE_HEAP_LOAD_F32 = WA((A) => HEAP_DATA_VIEW.getFloat32(A, !0), "LE_HEAP_LOAD_F32"),
                LE_HEAP_LOAD_F64 = WA((A) => HEAP_DATA_VIEW.getFloat64(A, !0), "LE_HEAP_LOAD_F64"),
                LE_HEAP_LOAD_I16 = WA((A) => HEAP_DATA_VIEW.getInt16(A, !0), "LE_HEAP_LOAD_I16"),
                LE_HEAP_LOAD_I32 = WA((A) => HEAP_DATA_VIEW.getInt32(A, !0), "LE_HEAP_LOAD_I32"),
                LE_HEAP_LOAD_U16 = WA((A) => HEAP_DATA_VIEW.getUint16(A, !0), "LE_HEAP_LOAD_U16"),
                LE_HEAP_LOAD_U32 = WA((A) => HEAP_DATA_VIEW.getUint32(A, !0), "LE_HEAP_LOAD_U32"),
                LE_HEAP_STORE_F32 = WA((A, q) => HEAP_DATA_VIEW.setFloat32(A, q, !0), "LE_HEAP_STORE_F32"),
                LE_HEAP_STORE_F64 = WA((A, q) => HEAP_DATA_VIEW.setFloat64(A, q, !0), "LE_HEAP_STORE_F64"),
                LE_HEAP_STORE_I16 = WA((A, q) => HEAP_DATA_VIEW.setInt16(A, q, !0), "LE_HEAP_STORE_I16"),
                LE_HEAP_STORE_I32 = WA((A, q) => HEAP_DATA_VIEW.setInt32(A, q, !0), "LE_HEAP_STORE_I32"),
                LE_HEAP_STORE_U16 = WA((A, q) => HEAP_DATA_VIEW.setUint16(A, q, !0), "LE_HEAP_STORE_U16"),
                LE_HEAP_STORE_U32 = WA((A, q) => HEAP_DATA_VIEW.setUint32(A, q, !0), "LE_HEAP_STORE_U32"),
                callRuntimeCallbacks = WA((A) => {
                    while (A.length > 0) A.shift()(Module)
                }, "callRuntimeCallbacks"),
                onPostRuns = [],
                addOnPostRun = WA((A) => onPostRuns.unshift(A), "addOnPostRun"),
                onPreRuns = [],
                addOnPreRun = WA((A) => onPreRuns.unshift(A), "addOnPreRun"),
                UTF8Decoder = typeof TextDecoder < "u" ? new TextDecoder : void 0,
                UTF8ArrayToString = WA((A, q = 0, K = NaN) => {
                    var Y = q + K,
                        z = q;
                    while (A[z] && !(z >= Y)) ++z;
                    if (z - q > 16 && A.buffer && UTF8Decoder) return UTF8Decoder.decode(A.subarray(q, z));
                    var w = "";
                    while (q < z) {
                        var H = A[q++];
                        if (!(H & 128)) {
                            w += String.fromCharCode(H);
                            continue
                        }
                        var $ = A[q++] & 63;
                        if ((H & 224) == 192) {
                            w += String.fromCharCode((H & 31) << 6 | $);
                            continue
                        }
                        var O = A[q++] & 63;
                        if ((H & 240) == 224) H = (H & 15) << 12 | $ << 6 | O;
                        else H = (H & 7) << 18 | $ << 12 | O << 6 | A[q++] & 63;
                        if (H < 65536) w += String.fromCharCode(H);
                        else {
                            var _ = H - 65536;
                            w += String.fromCharCode(55296 | _ >> 10, 56320 | _ & 1023)
                        }
                    }
                    return w
                }, "UTF8ArrayToString"),
                getDylinkMetadata = WA((A) => {
                    var q = 0,
                        K = 0;

                    function Y() {
                        return A[q++]
                    }
                    WA(Y, "getU8");

                    function z() {
                        var U = 0,
                            x = 1;
                        while (!0) {
                            var p = A[q++];
                            if (U += (p & 127) * x, x *= 128, !(p & 128)) break
                        }
                        return U
                    }
                    WA(z, "getLEB");

                    function w() {
                        var U = z();
                        return q += U, UTF8ArrayToString(A, q - U, U)
                    }
                    WA(w, "getString");

                    function H(U, x) {
                        if (U) throw Error(x)
                    }
                    WA(H, "failIf");
                    var $ = "dylink.0";
                    if (A instanceof WebAssembly.Module) {
                        var O = WebAssembly.Module.customSections(A, $);
                        if (O.length === 0) $ = "dylink", O = WebAssembly.Module.customSections(A, $);
                        H(O.length === 0, "need dylink section"), A = new Uint8Array(O[0]), K = A.length
                    } else {
                        var _ = new Uint32Array(new Uint8Array(A.subarray(0, 24)).buffer),
                            J = _[0] == 1836278016 || _[0] == 6386541;
                        H(!J, "need to see wasm magic number"), H(A[8] !== 0, "need the dylink section to be first"), q = 9;
                        var X = z();
                        K = q + X, $ = w()
                    }
                    var D = {
                        neededDynlibs: [],
                        tlsExports: new Set,
                        weakImports: new Set
                    };
                    if ($ == "dylink") {
                        D.memorySize = z(), D.memoryAlign = z(), D.tableSize = z(), D.tableAlign = z();
                        var j = z();
                        for (var M = 0; M < j; ++M) {
                            var P = w();
                            D.neededDynlibs.push(P)
                        }
                    } else {
                        H($ !== "dylink.0");
                        var W = 1,
                            G = 2,
                            f = 3,
                            Z = 4,
                            N = 256,
                            T = 3,
                            k = 1;
                        while (q < K) {
                            var y = Y(),
                                B = z();
                            if (y === W) D.memorySize = z(), D.memoryAlign = z(), D.tableSize = z(), D.tableAlign = z();
                            else if (y === G) {
                                var j = z();
                                for (var M = 0; M < j; ++M) P = w(), D.neededDynlibs.push(P)
                            } else if (y === f) {
                                var S = z();
                                while (S--) {
                                    var m = w(),
                                        b = z();
                                    if (b & N) D.tlsExports.add(m)
                                }
                            } else if (y === Z) {
                                var S = z();
                                while (S--) {
                                    var g = w(),
                                        m = w(),
                                        b = z();
                                    if ((b & T) == k) D.weakImports.add(m)
                                }
                            } else q += B
                        }
                    }
                    return D
                }, "getDylinkMetadata");

            function getValue(A, q = "i8") {
                if (q.endsWith("*")) q = "*";
                switch (q) {
                    case "i1":
                        return HEAP8[A];
                    case "i8":
                        return HEAP8[A];
                    case "i16":
                        return LE_HEAP_LOAD_I16((A >> 1) * 2);
                    case "i32":
                        return LE_HEAP_LOAD_I32((A >> 2) * 4);
                    case "i64":
                        return HEAP64[A >> 3];
                    case "float":
                        return LE_HEAP_LOAD_F32((A >> 2) * 4);
                    case "double":
                        return LE_HEAP_LOAD_F64((A >> 3) * 8);
                    case "*":
                        return LE_HEAP_LOAD_U32((A >> 2) * 4);
                    default:
                        abort(`invalid type for getValue: ${q}`)
                }
            }
            WA(getValue, "getValue");
            var newDSO = WA((A, q, K) => {
                    var Y = {
                        refcount: 1 / 0,
                        name: A,
                        exports: K,
                        global: !0
                    };
                    if (LDSO.loadedLibsByName[A] = Y, q != null) LDSO.loadedLibsByHandle[q] = Y;
                    return Y
                }, "newDSO"),
                LDSO = {
                    loadedLibsByName: {},
                    loadedLibsByHandle: {},
                    init() {
                        newDSO("__main__", 0, wasmImports)
                    }
                },
                ___heap_base = 78224,
                alignMemory = WA((A, q) => Math.ceil(A / q) * q, "alignMemory"),
                getMemory = WA((A) => {
                    if (runtimeInitialized) return _calloc(A, 1);
                    var q = ___heap_base,
                        K = q + alignMemory(A, 16);
                    return ___heap_base = K, GOT.__heap_base.value = K, q
                }, "getMemory"),
                isInternalSym = WA((A) => ["__cpp_exception", "__c_longjmp", "__wasm_apply_data_relocs", "__dso_handle", "__tls_size", "__tls_align", "__set_stack_limits", "_emscripten_tls_init", "__wasm_init_tls", "__wasm_call_ctors", "__start_em_asm", "__stop_em_asm", "__start_em_js", "__stop_em_js"].includes(A) || A.startsWith("__em_js__"), "isInternalSym"),
                uleb128Encode = WA((A, q) => {
                    if (A < 128) q.push(A);
                    else q.push(A % 128 | 128, A >> 7)
                }, "uleb128Encode"),
                sigToWasmTypes = WA((A) => {
                    var q = {
                            i: "i32",
                            j: "i64",
                            f: "f32",
                            d: "f64",
                            e: "externref",
                            p: "i32"
                        },
                        K = {
                            parameters: [],
                            results: A[0] == "v" ? [] : [q[A[0]]]
                        };
                    for (var Y = 1; Y < A.length; ++Y) K.parameters.push(q[A[Y]]);
                    return K
                }, "sigToWasmTypes"),
                generateFuncType = WA((A, q) => {
                    var K = A.slice(0, 1),
                        Y = A.slice(1),
                        z = {
                            i: 127,
                            p: 127,
                            j: 126,
                            f: 125,
                            d: 124,
                            e: 111
                        };
                    q.push(96), uleb128Encode(Y.length, q);
                    for (var w = 0; w < Y.length; ++w) q.push(z[Y[w]]);
                    if (K == "v") q.push(0);
                    else q.push(1, z[K])
                }, "generateFuncType"),
                convertJsFunctionToWasm = WA((A, q) => {
                    if (typeof WebAssembly.Function == "function") return new WebAssembly.Function(sigToWasmTypes(q), A);
                    var K = [1];
                    generateFuncType(q, K);
                    var Y = [0, 97, 115, 109, 1, 0, 0, 0, 1];
                    uleb128Encode(K.length, Y), Y.push(...K), Y.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
                    var z = new WebAssembly.Module(new Uint8Array(Y)),
                        w = new WebAssembly.Instance(z, {
                            e: {
                                f: A
                            }
                        }),
                        H = w.exports.f;
                    return H
                }, "convertJsFunctionToWasm"),
                wasmTableMirror = [],
                wasmTable = new WebAssembly.Table({
                    initial: 31,
                    element: "anyfunc"
                }),
                getWasmTableEntry = WA((A) => {
                    var q = wasmTableMirror[A];
                    if (!q) {
                        if (A >= wasmTableMirror.length) wasmTableMirror.length = A + 1;
                        wasmTableMirror[A] = q = wasmTable.get(A)
                    }
                    return q
                }, "getWasmTableEntry"),
                updateTableMap = WA((A, q) => {
                    if (functionsInTableMap)
                        for (var K = A; K < A + q; K++) {
                            var Y = getWasmTableEntry(K);
                            if (Y) functionsInTableMap.set(Y, K)
                        }
                }, "updateTableMap"),
                functionsInTableMap, getFunctionAddress = WA((A) => {
                    if (!functionsInTableMap) functionsInTableMap = new WeakMap, updateTableMap(0, wasmTable.length);
                    return functionsInTableMap.get(A) || 0
                }, "getFunctionAddress"),
                freeTableIndexes = [],
                getEmptyTableSlot = WA(() => {
                    if (freeTableIndexes.length) return freeTableIndexes.pop();
                    try {
                        wasmTable.grow(1)
                    } catch (A) {
                        if (!(A instanceof RangeError)) throw A;
                        throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."
                    }
                    return wasmTable.length - 1
                }, "getEmptyTableSlot"),
                setWasmTableEntry = WA((A, q) => {
                    wasmTable.set(A, q), wasmTableMirror[A] = wasmTable.get(A)
                }, "setWasmTableEntry"),
                addFunction = WA((A, q) => {
                    var K = getFunctionAddress(A);
                    if (K) return K;
                    var Y = getEmptyTableSlot();
                    try {
                        setWasmTableEntry(Y, A)
                    } catch (w) {
                        if (!(w instanceof TypeError)) throw w;
                        var z = convertJsFunctionToWasm(A, q);
                        setWasmTableEntry(Y, z)
                    }
                    return functionsInTableMap.set(A, Y), Y
                }, "addFunction"),
                updateGOT = WA((A, q) => {
                    for (var K in A) {
                        if (isInternalSym(K)) continue;
                        var Y = A[K];
                        if (GOT[K] ||= new WebAssembly.Global({
                                value: "i32",
                                mutable: !0
                            }), q || GOT[K].value == 0)
                            if (typeof Y == "function") GOT[K].value = addFunction(Y);
                            else if (typeof Y == "number") GOT[K].value = Y;
                        else err(`unhandled export type for '${K}': ${typeof Y}`)
                    }
                }, "updateGOT"),
                relocateExports = WA((A, q, K) => {
                    var Y = {};
                    for (var z in A) {
                        var w = A[z];
                        if (typeof w == "object") w = w.value;
                        if (typeof w == "number") w += q;
                        Y[z] = w
                    }
                    return updateGOT(Y, K), Y
                }, "relocateExports"),
                isSymbolDefined = WA((A) => {
                    var q = wasmImports[A];
                    if (!q || q.stub) return !1;
                    return !0
                }, "isSymbolDefined"),
                dynCall = WA((A, q, K = []) => {
                    var Y = getWasmTableEntry(q)(...K);
                    return Y
                }, "dynCall"),
                stackSave = WA(() => _emscripten_stack_get_current(), "stackSave"),
                stackRestore = WA((A) => __emscripten_stack_restore(A), "stackRestore"),
                createInvokeFunction = WA((A) => (q, ...K) => {
                    var Y = stackSave();
                    try {
                        return dynCall(A, q, K)
                    } catch (z) {
                        if (stackRestore(Y), z !== z + 0) throw z;
                        if (_setThrew(1, 0), A[0] == "j") return 0n
                    }
                }, "createInvokeFunction"),
                resolveGlobalSymbol = WA((A, q = !1) => {
                    var K;
                    if (isSymbolDefined(A)) K = wasmImports[A];
                    else if (A.startsWith("invoke_")) K = wasmImports[A] = createInvokeFunction(A.split("_")[1]);
                    return {
                        sym: K,
                        name: A
                    }
                }, "resolveGlobalSymbol"),
                onPostCtors = [],
                addOnPostCtor = WA((A) => onPostCtors.unshift(A), "addOnPostCtor"),
                UTF8ToString = WA((A, q) => A ? UTF8ArrayToString(HEAPU8, A, q) : "", "UTF8ToString"),
                loadWebAssemblyModule = WA((binary, flags, libName, localScope, handle) => {
                    var metadata = getDylinkMetadata(binary);
                    currentModuleWeakSymbols = metadata.weakImports;

                    function loadModule() {
                        var memAlign = Math.pow(2, metadata.memoryAlign),
                            memoryBase = metadata.memorySize ? alignMemory(getMemory(metadata.memorySize + memAlign), memAlign) : 0,
                            tableBase = metadata.tableSize ? wasmTable.length : 0;
                        if (handle) HEAP8[handle + 8] = 1, LE_HEAP_STORE_U32((handle + 12 >> 2) * 4, memoryBase), LE_HEAP_STORE_I32((handle + 16 >> 2) * 4, metadata.memorySize), LE_HEAP_STORE_U32((handle + 20 >> 2) * 4, tableBase), LE_HEAP_STORE_I32((handle + 24 >> 2) * 4, metadata.tableSize);
                        if (metadata.tableSize) wasmTable.grow(metadata.tableSize);
                        var moduleExports;

                        function resolveSymbol(A) {
                            var q = resolveGlobalSymbol(A).sym;
                            if (!q && localScope) q = localScope[A];
                            if (!q) q = moduleExports[A];
                            return q
                        }
                        WA(resolveSymbol, "resolveSymbol");
                        var proxyHandler = {
                                get(A, q) {
                                    switch (q) {
                                        case "__memory_base":
                                            return memoryBase;
                                        case "__table_base":
                                            return tableBase
                                    }
                                    if (q in wasmImports && !wasmImports[q].stub) {
                                        var K = wasmImports[q];
                                        return K
                                    }
                                    if (!(q in A)) {
                                        var Y;
                                        A[q] = (...z) => {
                                            return Y ||= resolveSymbol(q), Y(...z)
                                        }
                                    }
                                    return A[q]
                                }
                            },
                            proxy = new Proxy({}, proxyHandler),
                            info = {
                                "GOT.mem": new Proxy({}, GOTHandler),
                                "GOT.func": new Proxy({}, GOTHandler),
                                env: proxy,
                                wasi_snapshot_preview1: proxy
                            };

                        function postInstantiation(module, instance) {
                            if (updateTableMap(tableBase, metadata.tableSize), moduleExports = relocateExports(instance.exports, memoryBase), !flags.allowUndefined) reportUndefinedSymbols();

                            function addEmAsm(addr, body) {
                                var args = [],
                                    arity = 0;
                                for (; arity < 16; arity++)
                                    if (body.indexOf("$" + arity) != -1) args.push("$" + arity);
                                    else break;
                                args = args.join(",");
                                var func = `(${args}) => { ${body} };`;
                                ASM_CONSTS[start] = eval(func)
                            }
                            if (WA(addEmAsm, "addEmAsm"), "__start_em_asm" in moduleExports) {
                                var {
                                    __start_em_asm: start,
                                    __stop_em_asm: stop
                                } = moduleExports;
                                while (start < stop) {
                                    var jsString = UTF8ToString(start);
                                    addEmAsm(start, jsString), start = HEAPU8.indexOf(0, start) + 1
                                }
                            }

                            function addEmJs(name, cSig, body) {
                                var jsArgs = [];
                                if (cSig = cSig.slice(1, -1), cSig != "void") {
                                    cSig = cSig.split(",");
                                    for (var i in cSig) {
                                        var jsArg = cSig[i].split(" ").pop();
                                        jsArgs.push(jsArg.replace("*", ""))
                                    }
                                }
                                var func = `(${jsArgs}) => ${body};`;
                                moduleExports[name] = eval(func)
                            }
                            WA(addEmJs, "addEmJs");
                            for (var name in moduleExports)
                                if (name.startsWith("__em_js__")) {
                                    var start = moduleExports[name],
                                        jsString = UTF8ToString(start),
                                        parts = jsString.split("<::>");
                                    addEmJs(name.replace("__em_js__", ""), parts[0], parts[1]), delete moduleExports[name]
                                } var applyRelocs = moduleExports.__wasm_apply_data_relocs;
                            if (applyRelocs)
                                if (runtimeInitialized) applyRelocs();
                                else __RELOC_FUNCS__.push(applyRelocs);
                            var init = moduleExports.__wasm_call_ctors;
                            if (init)
                                if (runtimeInitialized) init();
                                else addOnPostCtor(init);
                            return moduleExports
                        }
                        if (WA(postInstantiation, "postInstantiation"), flags.loadAsync) {
                            if (binary instanceof WebAssembly.Module) {
                                var instance = new WebAssembly.Instance(binary, info);
                                return Promise.resolve(postInstantiation(binary, instance))
                            }
                            return WebAssembly.instantiate(binary, info).then((A) => postInstantiation(A.module, A.instance))
                        }
                        var module = binary instanceof WebAssembly.Module ? binary : new WebAssembly.Module(binary),
                            instance = new WebAssembly.Instance(module, info);
                        return postInstantiation(module, instance)
                    }
                    if (WA(loadModule, "loadModule"), flags.loadAsync) return metadata.neededDynlibs.reduce((A, q) => A.then(() => loadDynamicLibrary(q, flags, localScope)), Promise.resolve()).then(loadModule);
                    return metadata.neededDynlibs.forEach((A) => loadDynamicLibrary(A, flags, localScope)), loadModule()
                }, "loadWebAssemblyModule"),
                mergeLibSymbols = WA((A, q) => {
                    for (var [K, Y] of Object.entries(A)) {
                        let z = WA((H) => {
                            if (!isSymbolDefined(H)) wasmImports[H] = Y
                        }, "setImport");
                        z(K);
                        let w = "__main_argc_argv";
                        if (K == "main") z(w);
                        if (K == w) z("main")
                    }
                }, "mergeLibSymbols"),
                asyncLoad = WA(async (A) => {
                    var q = await readAsync(A);
                    return new Uint8Array(q)
                }, "asyncLoad");

            function loadDynamicLibrary(A, q = {
                global: !0,
                nodelete: !0
            }, K, Y) {
                var z = LDSO.loadedLibsByName[A];
                if (z) {
                    if (!q.global) {
                        if (K) Object.assign(K, z.exports)
                    } else if (!z.global) z.global = !0, mergeLibSymbols(z.exports, A);
                    if (q.nodelete && z.refcount !== 1 / 0) z.refcount = 1 / 0;
                    if (z.refcount++, Y) LDSO.loadedLibsByHandle[Y] = z;
                    return q.loadAsync ? Promise.resolve(!0) : !0
                }
                z = newDSO(A, Y, "loading"), z.refcount = q.nodelete ? 1 / 0 : 1, z.global = q.global;

                function w() {
                    if (Y) {
                        var O = LE_HEAP_LOAD_U32((Y + 28 >> 2) * 4),
                            _ = LE_HEAP_LOAD_U32((Y + 32 >> 2) * 4);
                        if (O && _) {
                            var J = HEAP8.slice(O, O + _);
                            return q.loadAsync ? Promise.resolve(J) : J
                        }
                    }
                    var X = locateFile(A);
                    if (q.loadAsync) return asyncLoad(X);
                    if (!readBinary) throw Error(`${X}: file not found, and synchronous loading of external files is not available`);
                    return readBinary(X)
                }
                WA(w, "loadLibData");

                function H() {
                    if (q.loadAsync) return w().then((O) => loadWebAssemblyModule(O, q, A, K, Y));
                    return loadWebAssemblyModule(w(), q, A, K, Y)
                }
                WA(H, "getExports");

                function $(O) {
                    if (z.global) mergeLibSymbols(O, A);
                    else if (K) Object.assign(K, O);
                    z.exports = O
                }
                if (WA($, "moduleLoaded"), q.loadAsync) return H().then((O) => {
                    return $(O), !0
                });
                return $(H()), !0
            }
            WA(loadDynamicLibrary, "loadDynamicLibrary");
            var reportUndefinedSymbols = WA(() => {
                    for (var [A, q] of Object.entries(GOT))
                        if (q.value == 0) {
                            var K = resolveGlobalSymbol(A, !0).sym;
                            if (!K && !q.required) continue;
                            if (typeof K == "function") q.value = addFunction(K, K.sig);
                            else if (typeof K == "number") q.value = K;
                            else throw Error(`bad export type for '${A}': ${typeof K}`)
                        }
                }, "reportUndefinedSymbols"),
                loadDylibs = WA(() => {
                    if (!dynamicLibraries.length) {
                        reportUndefinedSymbols();
                        return
                    }
                    addRunDependency("loadDylibs"), dynamicLibraries.reduce((A, q) => A.then(() => loadDynamicLibrary(q, {
                        loadAsync: !0,
                        global: !0,
                        nodelete: !0,
                        allowUndefined: !0
                    })), Promise.resolve()).then(() => {
                        reportUndefinedSymbols(), removeRunDependency("loadDylibs")
                    })
                }, "loadDylibs"),
                noExitRuntime = Module.noExitRuntime || !0;

            function setValue(A, q, K = "i8") {
                if (K.endsWith("*")) K = "*";
                switch (K) {
                    case "i1":
                        HEAP8[A] = q;
                        break;
                    case "i8":
                        HEAP8[A] = q;
                        break;
                    case "i16":
                        LE_HEAP_STORE_I16((A >> 1) * 2, q);
                        break;
                    case "i32":
                        LE_HEAP_STORE_I32((A >> 2) * 4, q);
                        break;
                    case "i64":
                        HEAP64[A >> 3] = BigInt(q);
                        break;
                    case "float":
                        LE_HEAP_STORE_F32((A >> 2) * 4, q);
                        break;
                    case "double":
                        LE_HEAP_STORE_F64((A >> 3) * 8, q);
                        break;
                    case "*":
                        LE_HEAP_STORE_U32((A >> 2) * 4, q);
                        break;
                    default:
                        abort(`invalid type for setValue: ${K}`)
                }
            }
            WA(setValue, "setValue");
            var ___memory_base = new WebAssembly.Global({
                    value: "i32",
                    mutable: !1
                }, 1024),
                ___stack_pointer = new WebAssembly.Global({
                    value: "i32",
                    mutable: !0
                }, 78224),
                ___table_base = new WebAssembly.Global({
                    value: "i32",
                    mutable: !1
                }, 1),
                __abort_js = WA(() => abort(""), "__abort_js");
            __abort_js.sig = "v";
            var _emscripten_get_now = WA(() => performance.now(), "_emscripten_get_now");
            _emscripten_get_now.sig = "d";
            var _emscripten_date_now = WA(() => Date.now(), "_emscripten_date_now");
            _emscripten_date_now.sig = "d";
            var nowIsMonotonic = 1,
                checkWasiClock = WA((A) => A >= 0 && A <= 3, "checkWasiClock"),
                INT53_MAX = 9007199254740992,
                INT53_MIN = -9007199254740992,
                bigintToI53Checked = WA((A) => A < INT53_MIN || A > INT53_MAX ? NaN : Number(A), "bigintToI53Checked");

            function _clock_time_get(A, q, K) {
                if (q = bigintToI53Checked(q), !checkWasiClock(A)) return 28;
                var Y;
                if (A === 0) Y = _emscripten_date_now();
                else if (nowIsMonotonic) Y = _emscripten_get_now();
                else return 52;
                var z = Math.round(Y * 1000 * 1000);
                return HEAP64[K >> 3] = BigInt(z), 0
            }
            WA(_clock_time_get, "_clock_time_get"), _clock_time_get.sig = "iijp";
            var getHeapMax = WA(() => 2147483648, "getHeapMax"),
                growMemory = WA((A) => {
                    var q = wasmMemory.buffer,
                        K = (A - q.byteLength + 65535) / 65536 | 0;
                    try {
                        return wasmMemory.grow(K), updateMemoryViews(), 1
                    } catch (Y) {}
                }, "growMemory"),
                _emscripten_resize_heap = WA((A) => {
                    var q = HEAPU8.length;
                    A >>>= 0;
                    var K = getHeapMax();
                    if (A > K) return !1;
                    for (var Y = 1; Y <= 4; Y *= 2) {
                        var z = q * (1 + 0.2 / Y);
                        z = Math.min(z, A + 100663296);
                        var w = Math.min(K, alignMemory(Math.max(A, z), 65536)),
                            H = growMemory(w);
                        if (H) return !0
                    }
                    return !1
                }, "_emscripten_resize_heap");
            _emscripten_resize_heap.sig = "ip";
            var _fd_close = WA((A) => 52, "_fd_close");
            _fd_close.sig = "ii";

            function _fd_seek(A, q, K, Y) {
                return q = bigintToI53Checked(q), 70
            }
            WA(_fd_seek, "_fd_seek"), _fd_seek.sig = "iijip";
            var printCharBuffers = [null, [],
                    []
                ],
                printChar = WA((A, q) => {
                    var K = printCharBuffers[A];
                    if (q === 0 || q === 10)(A === 1 ? out : err)(UTF8ArrayToString(K)), K.length = 0;
                    else K.push(q)
                }, "printChar"),
                flush_NO_FILESYSTEM = WA(() => {
                    if (printCharBuffers[1].length) printChar(1, 10);
                    if (printCharBuffers[2].length) printChar(2, 10)
                }, "flush_NO_FILESYSTEM"),
                SYSCALLS = {
                    varargs: void 0,
                    getStr(A) {
                        var q = UTF8ToString(A);
                        return q
                    }
                },
                _fd_write = WA((A, q, K, Y) => {
                    var z = 0;
                    for (var w = 0; w < K; w++) {
                        var H = LE_HEAP_LOAD_U32((q >> 2) * 4),
                            $ = LE_HEAP_LOAD_U32((q + 4 >> 2) * 4);
                        q += 8;
                        for (var O = 0; O < $; O++) printChar(A, HEAPU8[H + O]);
                        z += $
                    }
                    return LE_HEAP_STORE_U32((Y >> 2) * 4, z), 0
                }, "_fd_write");
            _fd_write.sig = "iippp";

            function _tree_sitter_log_callback(A, q) {
                if (Module.currentLogCallback) {
                    let K = UTF8ToString(q);
                    Module.currentLogCallback(K, A !== 0)
                }
            }
            WA(_tree_sitter_log_callback, "_tree_sitter_log_callback");

            function _tree_sitter_parse_callback(A, q, K, Y, z) {
                let H = Module.currentParseCallback(q, {
                    row: K,
                    column: Y
                });
                if (typeof H === "string") setValue(z, H.length, "i32"), stringToUTF16(H, A, 10240);
                else setValue(z, 0, "i32")
            }
            WA(_tree_sitter_parse_callback, "_tree_sitter_parse_callback");

            function _tree_sitter_progress_callback(A, q) {
                if (Module.currentProgressCallback) return Module.currentProgressCallback({
                    currentOffset: A,
                    hasError: q
                });
                return !1
            }
            WA(_tree_sitter_progress_callback, "_tree_sitter_progress_callback");

            function _tree_sitter_query_progress_callback(A) {
                if (Module.currentQueryProgressCallback) return Module.currentQueryProgressCallback({
                    currentOffset: A
                });
                return !1
            }
            WA(_tree_sitter_query_progress_callback, "_tree_sitter_query_progress_callback");
            var runtimeKeepaliveCounter = 0,
                keepRuntimeAlive = WA(() => noExitRuntime || runtimeKeepaliveCounter > 0, "keepRuntimeAlive"),
                _proc_exit = WA((A) => {
                    if (EXITSTATUS = A, !keepRuntimeAlive()) Module.onExit?.(A), ABORT = !0;
                    quit_(A, new ExitStatus(A))
                }, "_proc_exit");
            _proc_exit.sig = "vi";
            var exitJS = WA((A, q) => {
                    EXITSTATUS = A, _proc_exit(A)
                }, "exitJS"),
                handleException = WA((A) => {
                    if (A instanceof ExitStatus || A == "unwind") return EXITSTATUS;
                    quit_(1, A)
                }, "handleException"),
                lengthBytesUTF8 = WA((A) => {
                    var q = 0;
                    for (var K = 0; K < A.length; ++K) {
                        var Y = A.charCodeAt(K);
                        if (Y <= 127) q++;
                        else if (Y <= 2047) q += 2;
                        else if (Y >= 55296 && Y <= 57343) q += 4, ++K;
                        else q += 3
                    }
                    return q
                }, "lengthBytesUTF8"),
                stringToUTF8Array = WA((A, q, K, Y) => {
                    if (!(Y > 0)) return 0;
                    var z = K,
                        w = K + Y - 1;
                    for (var H = 0; H < A.length; ++H) {
                        var $ = A.charCodeAt(H);
                        if ($ >= 55296 && $ <= 57343) {
                            var O = A.charCodeAt(++H);
                            $ = 65536 + (($ & 1023) << 10) | O & 1023
                        }
                        if ($ <= 127) {
                            if (K >= w) break;
                            q[K++] = $
                        } else if ($ <= 2047) {
                            if (K + 1 >= w) break;
                            q[K++] = 192 | $ >> 6, q[K++] = 128 | $ & 63
                        } else if ($ <= 65535) {
                            if (K + 2 >= w) break;
                            q[K++] = 224 | $ >> 12, q[K++] = 128 | $ >> 6 & 63, q[K++] = 128 | $ & 63
                        } else {
                            if (K + 3 >= w) break;
                            q[K++] = 240 | $ >> 18, q[K++] = 128 | $ >> 12 & 63, q[K++] = 128 | $ >> 6 & 63, q[K++] = 128 | $ & 63
                        }
                    }
                    return q[K] = 0, K - z
                }, "stringToUTF8Array"),
                stringToUTF8 = WA((A, q, K) => stringToUTF8Array(A, HEAPU8, q, K), "stringToUTF8"),
                stackAlloc = WA((A) => __emscripten_stack_alloc(A), "stackAlloc"),
                stringToUTF8OnStack = WA((A) => {
                    var q = lengthBytesUTF8(A) + 1,
                        K = stackAlloc(q);
                    return stringToUTF8(A, K, q), K
                }, "stringToUTF8OnStack"),
                AsciiToString = WA((A) => {
                    var q = "";
                    while (!0) {
                        var K = HEAPU8[A++];
                        if (!K) return q;
                        q += String.fromCharCode(K)
                    }
                }, "AsciiToString"),
                stringToUTF16 = WA((A, q, K) => {
                    if (K ??= 2147483647, K < 2) return 0;
                    K -= 2;
                    var Y = q,
                        z = K < A.length * 2 ? K / 2 : A.length;
                    for (var w = 0; w < z; ++w) {
                        var H = A.charCodeAt(w);
                        LE_HEAP_STORE_I16((q >> 1) * 2, H), q += 2
                    }
                    return LE_HEAP_STORE_I16((q >> 1) * 2, 0), q - Y
                }, "stringToUTF16"),
                wasmImports = {
                    __heap_base: ___heap_base,
                    __indirect_function_table: wasmTable,
                    __memory_base: ___memory_base,
                    __stack_pointer: ___stack_pointer,
                    __table_base: ___table_base,
                    _abort_js: __abort_js,
                    clock_time_get: _clock_time_get,
                    emscripten_resize_heap: _emscripten_resize_heap,
                    fd_close: _fd_close,
                    fd_seek: _fd_seek,
                    fd_write: _fd_write,
                    memory: wasmMemory,
                    tree_sitter_log_callback: _tree_sitter_log_callback,
                    tree_sitter_parse_callback: _tree_sitter_parse_callback,
                    tree_sitter_progress_callback: _tree_sitter_progress_callback,
                    tree_sitter_query_progress_callback: _tree_sitter_query_progress_callback
                },
                wasmExports = await createWasm(),
                ___wasm_call_ctors = wasmExports.__wasm_call_ctors,
                _malloc = Module._malloc = wasmExports.malloc,
                _calloc = Module._calloc = wasmExports.calloc,
                _realloc = Module._realloc = wasmExports.realloc,
                _free = Module._free = wasmExports.free,
                _memcmp = Module._memcmp = wasmExports.memcmp,
                _ts_language_symbol_count = Module._ts_language_symbol_count = wasmExports.ts_language_symbol_count,
                _ts_language_state_count = Module._ts_language_state_count = wasmExports.ts_language_state_count,
                _ts_language_version = Module._ts_language_version = wasmExports.ts_language_version,
                _ts_language_abi_version = Module._ts_language_abi_version = wasmExports.ts_language_abi_version,
                _ts_language_metadata = Module._ts_language_metadata = wasmExports.ts_language_metadata,
                _ts_language_name = Module._ts_language_name = wasmExports.ts_language_name,
                _ts_language_field_count = Module._ts_language_field_count = wasmExports.ts_language_field_count,
                _ts_language_next_state = Module._ts_language_next_state = wasmExports.ts_language_next_state,
                _ts_language_symbol_name = Module._ts_language_symbol_name = wasmExports.ts_language_symbol_name,
                _ts_language_symbol_for_name = Module._ts_language_symbol_for_name = wasmExports.ts_language_symbol_for_name,
                _strncmp = Module._strncmp = wasmExports.strncmp,
                _ts_language_symbol_type = Module._ts_language_symbol_type = wasmExports.ts_language_symbol_type,
                _ts_language_field_name_for_id = Module._ts_language_field_name_for_id = wasmExports.ts_language_field_name_for_id,
                _ts_lookahead_iterator_new = Module._ts_lookahead_iterator_new = wasmExports.ts_lookahead_iterator_new,
                _ts_lookahead_iterator_delete = Module._ts_lookahead_iterator_delete = wasmExports.ts_lookahead_iterator_delete,
                _ts_lookahead_iterator_reset_state = Module._ts_lookahead_iterator_reset_state = wasmExports.ts_lookahead_iterator_reset_state,
                _ts_lookahead_iterator_reset = Module._ts_lookahead_iterator_reset = wasmExports.ts_lookahead_iterator_reset,
                _ts_lookahead_iterator_next = Module._ts_lookahead_iterator_next = wasmExports.ts_lookahead_iterator_next,
                _ts_lookahead_iterator_current_symbol = Module._ts_lookahead_iterator_current_symbol = wasmExports.ts_lookahead_iterator_current_symbol,
                _ts_parser_delete = Module._ts_parser_delete = wasmExports.ts_parser_delete,
                _ts_parser_reset = Module._ts_parser_reset = wasmExports.ts_parser_reset,
                _ts_parser_set_language = Module._ts_parser_set_language = wasmExports.ts_parser_set_language,
                _ts_parser_timeout_micros = Module._ts_parser_timeout_micros = wasmExports.ts_parser_timeout_micros,
                _ts_parser_set_timeout_micros = Module._ts_parser_set_timeout_micros = wasmExports.ts_parser_set_timeout_micros,
                _ts_parser_set_included_ranges = Module._ts_parser_set_included_ranges = wasmExports.ts_parser_set_included_ranges,
                _ts_query_new = Module._ts_query_new = wasmExports.ts_query_new,
                _ts_query_delete = Module._ts_query_delete = wasmExports.ts_query_delete,
                _iswspace = Module._iswspace = wasmExports.iswspace,
                _iswalnum = Module._iswalnum = wasmExports.iswalnum,
                _ts_query_pattern_count = Module._ts_query_pattern_count = wasmExports.ts_query_pattern_count,
                _ts_query_capture_count = Module._ts_query_capture_count = wasmExports.ts_query_capture_count,
                _ts_query_string_count = Module._ts_query_string_count = wasmExports.ts_query_string_count,
                _ts_query_capture_name_for_id = Module._ts_query_capture_name_for_id = wasmExports.ts_query_capture_name_for_id,
                _ts_query_capture_quantifier_for_id = Module._ts_query_capture_quantifier_for_id = wasmExports.ts_query_capture_quantifier_for_id,
                _ts_query_string_value_for_id = Module._ts_query_string_value_for_id = wasmExports.ts_query_string_value_for_id,
                _ts_query_predicates_for_pattern = Module._ts_query_predicates_for_pattern = wasmExports.ts_query_predicates_for_pattern,
                _ts_query_start_byte_for_pattern = Module._ts_query_start_byte_for_pattern = wasmExports.ts_query_start_byte_for_pattern,
                _ts_query_end_byte_for_pattern = Module._ts_query_end_byte_for_pattern = wasmExports.ts_query_end_byte_for_pattern,
                _ts_query_is_pattern_rooted = Module._ts_query_is_pattern_rooted = wasmExports.ts_query_is_pattern_rooted,
                _ts_query_is_pattern_non_local = Module._ts_query_is_pattern_non_local = wasmExports.ts_query_is_pattern_non_local,
                _ts_query_is_pattern_guaranteed_at_step = Module._ts_query_is_pattern_guaranteed_at_step = wasmExports.ts_query_is_pattern_guaranteed_at_step,
                _ts_query_disable_capture = Module._ts_query_disable_capture = wasmExports.ts_query_disable_capture,
                _ts_query_disable_pattern = Module._ts_query_disable_pattern = wasmExports.ts_query_disable_pattern,
                _ts_tree_copy = Module._ts_tree_copy = wasmExports.ts_tree_copy,
                _ts_tree_delete = Module._ts_tree_delete = wasmExports.ts_tree_delete,
                _ts_init = Module._ts_init = wasmExports.ts_init,
                _ts_parser_new_wasm = Module._ts_parser_new_wasm = wasmExports.ts_parser_new_wasm,
                _ts_parser_enable_logger_wasm = Module._ts_parser_enable_logger_wasm = wasmExports.ts_parser_enable_logger_wasm,
                _ts_parser_parse_wasm = Module._ts_parser_parse_wasm = wasmExports.ts_parser_parse_wasm,
                _ts_parser_included_ranges_wasm = Module._ts_parser_included_ranges_wasm = wasmExports.ts_parser_included_ranges_wasm,
                _ts_language_type_is_named_wasm = Module._ts_language_type_is_named_wasm = wasmExports.ts_language_type_is_named_wasm,
                _ts_language_type_is_visible_wasm = Module._ts_language_type_is_visible_wasm = wasmExports.ts_language_type_is_visible_wasm,
                _ts_language_supertypes_wasm = Module._ts_language_supertypes_wasm = wasmExports.ts_language_supertypes_wasm,
                _ts_language_subtypes_wasm = Module._ts_language_subtypes_wasm = wasmExports.ts_language_subtypes_wasm,
                _ts_tree_root_node_wasm = Module._ts_tree_root_node_wasm = wasmExports.ts_tree_root_node_wasm,
                _ts_tree_root_node_with_offset_wasm = Module._ts_tree_root_node_with_offset_wasm = wasmExports.ts_tree_root_node_with_offset_wasm,
                _ts_tree_edit_wasm = Module._ts_tree_edit_wasm = wasmExports.ts_tree_edit_wasm,
                _ts_tree_included_ranges_wasm = Module._ts_tree_included_ranges_wasm = wasmExports.ts_tree_included_ranges_wasm,
                _ts_tree_get_changed_ranges_wasm = Module._ts_tree_get_changed_ranges_wasm = wasmExports.ts_tree_get_changed_ranges_wasm,
                _ts_tree_cursor_new_wasm = Module._ts_tree_cursor_new_wasm = wasmExports.ts_tree_cursor_new_wasm,
                _ts_tree_cursor_copy_wasm = Module._ts_tree_cursor_copy_wasm = wasmExports.ts_tree_cursor_copy_wasm,
                _ts_tree_cursor_delete_wasm = Module._ts_tree_cursor_delete_wasm = wasmExports.ts_tree_cursor_delete_wasm,
                _ts_tree_cursor_reset_wasm = Module._ts_tree_cursor_reset_wasm = wasmExports.ts_tree_cursor_reset_wasm,
                _ts_tree_cursor_reset_to_wasm = Module._ts_tree_cursor_reset_to_wasm = wasmExports.ts_tree_cursor_reset_to_wasm,
                _ts_tree_cursor_goto_first_child_wasm = Module._ts_tree_cursor_goto_first_child_wasm = wasmExports.ts_tree_cursor_goto_first_child_wasm,
                _ts_tree_cursor_goto_last_child_wasm = Module._ts_tree_cursor_goto_last_child_wasm = wasmExports.ts_tree_cursor_goto_last_child_wasm,
                _ts_tree_cursor_goto_first_child_for_index_wasm = Module._ts_tree_cursor_goto_first_child_for_index_wasm = wasmExports.ts_tree_cursor_goto_first_child_for_index_wasm,
                _ts_tree_cursor_goto_first_child_for_position_wasm = Module._ts_tree_cursor_goto_first_child_for_position_wasm = wasmExports.ts_tree_cursor_goto_first_child_for_position_wasm,
                _ts_tree_cursor_goto_next_sibling_wasm = Module._ts_tree_cursor_goto_next_sibling_wasm = wasmExports.ts_tree_cursor_goto_next_sibling_wasm,
                _ts_tree_cursor_goto_previous_sibling_wasm = Module._ts_tree_cursor_goto_previous_sibling_wasm = wasmExports.ts_tree_cursor_goto_previous_sibling_wasm,
                _ts_tree_cursor_goto_descendant_wasm = Module._ts_tree_cursor_goto_descendant_wasm = wasmExports.ts_tree_cursor_goto_descendant_wasm,
                _ts_tree_cursor_goto_parent_wasm = Module._ts_tree_cursor_goto_parent_wasm = wasmExports.ts_tree_cursor_goto_parent_wasm,
                _ts_tree_cursor_current_node_type_id_wasm = Module._ts_tree_cursor_current_node_type_id_wasm = wasmExports.ts_tree_cursor_current_node_type_id_wasm,
                _ts_tree_cursor_current_node_state_id_wasm = Module._ts_tree_cursor_current_node_state_id_wasm = wasmExports.ts_tree_cursor_current_node_state_id_wasm,
                _ts_tree_cursor_current_node_is_named_wasm = Module._ts_tree_cursor_current_node_is_named_wasm = wasmExports.ts_tree_cursor_current_node_is_named_wasm,
                _ts_tree_cursor_current_node_is_missing_wasm = Module._ts_tree_cursor_current_node_is_missing_wasm = wasmExports.ts_tree_cursor_current_node_is_missing_wasm,
                _ts_tree_cursor_current_node_id_wasm = Module._ts_tree_cursor_current_node_id_wasm = wasmExports.ts_tree_cursor_current_node_id_wasm,
                _ts_tree_cursor_start_position_wasm = Module._ts_tree_cursor_start_position_wasm = wasmExports.ts_tree_cursor_start_position_wasm,
                _ts_tree_cursor_end_position_wasm = Module._ts_tree_cursor_end_position_wasm = wasmExports.ts_tree_cursor_end_position_wasm,
                _ts_tree_cursor_start_index_wasm = Module._ts_tree_cursor_start_index_wasm = wasmExports.ts_tree_cursor_start_index_wasm,
                _ts_tree_cursor_end_index_wasm = Module._ts_tree_cursor_end_index_wasm = wasmExports.ts_tree_cursor_end_index_wasm,
                _ts_tree_cursor_current_field_id_wasm = Module._ts_tree_cursor_current_field_id_wasm = wasmExports.ts_tree_cursor_current_field_id_wasm,
                _ts_tree_cursor_current_depth_wasm = Module._ts_tree_cursor_current_depth_wasm = wasmExports.ts_tree_cursor_current_depth_wasm,
                _ts_tree_cursor_current_descendant_index_wasm = Module._ts_tree_cursor_current_descendant_index_wasm = wasmExports.ts_tree_cursor_current_descendant_index_wasm,
                _ts_tree_cursor_current_node_wasm = Module._ts_tree_cursor_current_node_wasm = wasmExports.ts_tree_cursor_current_node_wasm,
                _ts_node_symbol_wasm = Module._ts_node_symbol_wasm = wasmExports.ts_node_symbol_wasm,
                _ts_node_field_name_for_child_wasm = Module._ts_node_field_name_for_child_wasm = wasmExports.ts_node_field_name_for_child_wasm,
                _ts_node_field_name_for_named_child_wasm = Module._ts_node_field_name_for_named_child_wasm = wasmExports.ts_node_field_name_for_named_child_wasm,
                _ts_node_children_by_field_id_wasm = Module._ts_node_children_by_field_id_wasm = wasmExports.ts_node_children_by_field_id_wasm,
                _ts_node_first_child_for_byte_wasm = Module._ts_node_first_child_for_byte_wasm = wasmExports.ts_node_first_child_for_byte_wasm,
                _ts_node_first_named_child_for_byte_wasm = Module._ts_node_first_named_child_for_byte_wasm = wasmExports.ts_node_first_named_child_for_byte_wasm,
                _ts_node_grammar_symbol_wasm = Module._ts_node_grammar_symbol_wasm = wasmExports.ts_node_grammar_symbol_wasm,
                _ts_node_child_count_wasm = Module._ts_node_child_count_wasm = wasmExports.ts_node_child_count_wasm,
                _ts_node_named_child_count_wasm = Module._ts_node_named_child_count_wasm = wasmExports.ts_node_named_child_count_wasm,
                _ts_node_child_wasm = Module._ts_node_child_wasm = wasmExports.ts_node_child_wasm,
                _ts_node_named_child_wasm = Module._ts_node_named_child_wasm = wasmExports.ts_node_named_child_wasm,
                _ts_node_child_by_field_id_wasm = Module._ts_node_child_by_field_id_wasm = wasmExports.ts_node_child_by_field_id_wasm,
                _ts_node_next_sibling_wasm = Module._ts_node_next_sibling_wasm = wasmExports.ts_node_next_sibling_wasm,
                _ts_node_prev_sibling_wasm = Module._ts_node_prev_sibling_wasm = wasmExports.ts_node_prev_sibling_wasm,
                _ts_node_next_named_sibling_wasm = Module._ts_node_next_named_sibling_wasm = wasmExports.ts_node_next_named_sibling_wasm,
                _ts_node_prev_named_sibling_wasm = Module._ts_node_prev_named_sibling_wasm = wasmExports.ts_node_prev_named_sibling_wasm,
                _ts_node_descendant_count_wasm = Module._ts_node_descendant_count_wasm = wasmExports.ts_node_descendant_count_wasm,
                _ts_node_parent_wasm = Module._ts_node_parent_wasm = wasmExports.ts_node_parent_wasm,
                _ts_node_child_with_descendant_wasm = Module._ts_node_child_with_descendant_wasm = wasmExports.ts_node_child_with_descendant_wasm,
                _ts_node_descendant_for_index_wasm = Module._ts_node_descendant_for_index_wasm = wasmExports.ts_node_descendant_for_index_wasm,
                _ts_node_named_descendant_for_index_wasm = Module._ts_node_named_descendant_for_index_wasm = wasmExports.ts_node_named_descendant_for_index_wasm,
                _ts_node_descendant_for_position_wasm = Module._ts_node_descendant_for_position_wasm = wasmExports.ts_node_descendant_for_position_wasm,
                _ts_node_named_descendant_for_position_wasm = Module._ts_node_named_descendant_for_position_wasm = wasmExports.ts_node_named_descendant_for_position_wasm,
                _ts_node_start_point_wasm = Module._ts_node_start_point_wasm = wasmExports.ts_node_start_point_wasm,
                _ts_node_end_point_wasm = Module._ts_node_end_point_wasm = wasmExports.ts_node_end_point_wasm,
                _ts_node_start_index_wasm = Module._ts_node_start_index_wasm = wasmExports.ts_node_start_index_wasm,
                _ts_node_end_index_wasm = Module._ts_node_end_index_wasm = wasmExports.ts_node_end_index_wasm,
                _ts_node_to_string_wasm = Module._ts_node_to_string_wasm = wasmExports.ts_node_to_string_wasm,
                _ts_node_children_wasm = Module._ts_node_children_wasm = wasmExports.ts_node_children_wasm,
                _ts_node_named_children_wasm = Module._ts_node_named_children_wasm = wasmExports.ts_node_named_children_wasm,
                _ts_node_descendants_of_type_wasm = Module._ts_node_descendants_of_type_wasm = wasmExports.ts_node_descendants_of_type_wasm,
                _ts_node_is_named_wasm = Module._ts_node_is_named_wasm = wasmExports.ts_node_is_named_wasm,
                _ts_node_has_changes_wasm = Module._ts_node_has_changes_wasm = wasmExports.ts_node_has_changes_wasm,
                _ts_node_has_error_wasm = Module._ts_node_has_error_wasm = wasmExports.ts_node_has_error_wasm,
                _ts_node_is_error_wasm = Module._ts_node_is_error_wasm = wasmExports.ts_node_is_error_wasm,
                _ts_node_is_missing_wasm = Module._ts_node_is_missing_wasm = wasmExports.ts_node_is_missing_wasm,
                _ts_node_is_extra_wasm = Module._ts_node_is_extra_wasm = wasmExports.ts_node_is_extra_wasm,
                _ts_node_parse_state_wasm = Module._ts_node_parse_state_wasm = wasmExports.ts_node_parse_state_wasm,
                _ts_node_next_parse_state_wasm = Module._ts_node_next_parse_state_wasm = wasmExports.ts_node_next_parse_state_wasm,
                _ts_query_matches_wasm = Module._ts_query_matches_wasm = wasmExports.ts_query_matches_wasm,
                _ts_query_captures_wasm = Module._ts_query_captures_wasm = wasmExports.ts_query_captures_wasm,
                _memset = Module._memset = wasmExports.memset,
                _memcpy = Module._memcpy = wasmExports.memcpy,
                _memmove = Module._memmove = wasmExports.memmove,
                _iswalpha = Module._iswalpha = wasmExports.iswalpha,
                _iswblank = Module._iswblank = wasmExports.iswblank,
                _iswdigit = Module._iswdigit = wasmExports.iswdigit,
                _iswlower = Module._iswlower = wasmExports.iswlower,
                _iswupper = Module._iswupper = wasmExports.iswupper,
                _iswxdigit = Module._iswxdigit = wasmExports.iswxdigit,
                _memchr = Module._memchr = wasmExports.memchr,
                _strlen = Module._strlen = wasmExports.strlen,
                _strcmp = Module._strcmp = wasmExports.strcmp,
                _strncat = Module._strncat = wasmExports.strncat,
                _strncpy = Module._strncpy = wasmExports.strncpy,
                _towlower = Module._towlower = wasmExports.towlower,
                _towupper = Module._towupper = wasmExports.towupper,
                _setThrew = wasmExports.setThrew,
                __emscripten_stack_restore = wasmExports._emscripten_stack_restore,
                __emscripten_stack_alloc = wasmExports._emscripten_stack_alloc,
                _emscripten_stack_get_current = wasmExports.emscripten_stack_get_current,
                ___wasm_apply_data_relocs = wasmExports.__wasm_apply_data_relocs;
            Module.setValue = setValue, Module.getValue = getValue, Module.UTF8ToString = UTF8ToString, Module.stringToUTF8 = stringToUTF8, Module.lengthBytesUTF8 = lengthBytesUTF8, Module.AsciiToString = AsciiToString, Module.stringToUTF16 = stringToUTF16, Module.loadWebAssemblyModule = loadWebAssemblyModule;

            function callMain(A = []) {
                var q = resolveGlobalSymbol("main").sym;
                if (!q) return;
                A.unshift(thisProgram);
                var K = A.length,
                    Y = stackAlloc((K + 1) * 4),
                    z = Y;
                A.forEach((H) => {
                    LE_HEAP_STORE_U32((z >> 2) * 4, stringToUTF8OnStack(H)), z += 4
                }), LE_HEAP_STORE_U32((z >> 2) * 4, 0);
                try {
                    var w = q(K, Y);
                    return exitJS(w, !0), w
                } catch (H) {
                    return handleException(H)
                }
            }
            WA(callMain, "callMain");

            function run(A = arguments_) {
                if (runDependencies > 0) {
                    dependenciesFulfilled = run;
                    return
                }
                if (preRun(), runDependencies > 0) {
                    dependenciesFulfilled = run;
                    return
                }

                function q() {
                    if (Module.calledRun = !0, ABORT) return;
                    initRuntime(), preMain(), readyPromiseResolve(Module), Module.onRuntimeInitialized?.();
                    var K = Module.noInitialRun;
                    if (!K) callMain(A);
                    postRun()
                }
                if (WA(q, "doRun"), Module.setStatus) Module.setStatus("Running..."), setTimeout(() => {
                    setTimeout(() => Module.setStatus(""), 1), q()
                }, 1);
                else q()
            }
            if (WA(run, "run"), Module.preInit) {
                if (typeof Module.preInit == "function") Module.preInit = [Module.preInit];
                while (Module.preInit.length > 0) Module.preInit.pop()()
            }
            return run(), moduleRtn = readyPromise, moduleRtn
        }
    })(), UYz = gYz;
    WA(Z_q, "initializeBinding");
    WA(f_q, "checkModule");
    md1 = class {
        static {
            WA(this, "Parser")
        } [0] = 0;
        [1] = 0;
        logCallback = null;
        language = null;
        static async init(A) {
            O_q(await Z_q(A)), r4 = D6._ts_init(), HmA = D6.getValue(r4, "i32"), $mA = D6.getValue(r4 + jq, "i32")
        }
        constructor() {
            this.initialize()
        }
        initialize() {
            if (!f_q()) throw Error("cannot construct a Parser before calling `init()`");
            D6._ts_parser_new_wasm(), this[0] = D6.getValue(r4, "i32"), this[1] = D6.getValue(r4 + jq, "i32")
        }
        delete() {
            D6._ts_parser_delete(this[0]), D6._free(this[1]), this[0] = 0, this[1] = 0
        }
        setLanguage(A) {
            let q;
            if (!A) q = 0, this.language = null;
            else if (A.constructor === MT6) {
                q = A[0];
                let K = D6._ts_language_version(q);
                if (K < $mA || HmA < K) throw Error(`Incompatible language version ${K}. Compatibility range ${$mA} through ${HmA}.`);
                this.language = A
            } else throw Error("Argument must be a Language");
            return D6._ts_parser_set_language(this[0], q), this
        }
        parse(A, q, K) {
            if (typeof A === "string") D6.currentParseCallback = ($) => A.slice($);
            else if (typeof A === "function") D6.currentParseCallback = A;
            else throw Error("Argument must be a string or a function");
            if (K?.progressCallback) D6.currentProgressCallback = K.progressCallback;
            else D6.currentProgressCallback = null;
            if (this.logCallback) D6.currentLogCallback = this.logCallback, D6._ts_parser_enable_logger_wasm(this[0], 1);
            else D6.currentLogCallback = null, D6._ts_parser_enable_logger_wasm(this[0], 0);
            let Y = 0,
                z = 0;
            if (K?.includedRanges) {
                Y = K.includedRanges.length, z = D6._calloc(Y, Bd1);
                let $ = z;
                for (let O = 0; O < Y; O++) __q($, K.includedRanges[O]), $ += Bd1
            }
            let w = D6._ts_parser_parse_wasm(this[0], this[1], q ? q[0] : 0, z, Y);
            if (!w) return D6.currentParseCallback = null, D6.currentLogCallback = null, D6.currentProgressCallback = null, null;
            if (!this.language) throw Error("Parser must have a language to parse");
            let H = new IYz(ie, w, this.language, D6.currentParseCallback);
            return D6.currentParseCallback = null, D6.currentLogCallback = null, D6.currentProgressCallback = null, H
        }
        reset() {
            D6._ts_parser_reset(this[0])
        }
        getIncludedRanges() {
            D6._ts_parser_included_ranges_wasm(this[0]);
            let A = D6.getValue(r4, "i32"),
                q = D6.getValue(r4 + jq, "i32"),
                K = Array(A);
            if (A > 0) {
                let Y = q;
                for (let z = 0; z < A; z++) K[z] = jT6(Y), Y += Bd1;
                D6._free(q)
            }
            return K
        }
        getTimeoutMicros() {
            return D6._ts_parser_timeout_micros(this[0])
        }
        setTimeoutMicros(A) {
            D6._ts_parser_set_timeout_micros(this[0], 0, A)
        }
        setLogger(A) {
            if (!A) this.logCallback = null;
            else if (typeof A !== "function") throw Error("Logger callback must be a function");
            else this.logCallback = A;
            return this
        }
        getLogger() {
            return this.logCallback
        }
    }
})