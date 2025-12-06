
// @from(Start 8393051, End 8486357)
UA2 = L(() => {
  N15 = Object.defineProperty, Co1 = 4 * d2, vU = 5 * d2, wk = 2 * d2, cNA = 2 * d2 + 2 * wk, yl = {
    row: 0,
    column: 0
  }, xl = Symbol("INTERNAL");
  X0(BIA, "assertInternal");
  X0(dNA, "isPoint");
  X0(YA2, "setModule");
  L15 = class {
    static {
      X0(this, "LookaheadIterator")
    } [0] = 0;
    language;
    constructor(A, Q, B) {
      BIA(A), this[0] = Q, this.language = B
    }
    get currentTypeId() {
      return V1._ts_lookahead_iterator_current_symbol(this[0])
    }
    get currentType() {
      return this.language.types[this.currentTypeId] || "ERROR"
    }
    delete() {
      V1._ts_lookahead_iterator_delete(this[0]), this[0] = 0
    }
    reset(A, Q) {
      if (V1._ts_lookahead_iterator_reset(this[0], A[0], Q)) return this.language = A, !0;
      return !1
    }
    resetState(A) {
      return Boolean(V1._ts_lookahead_iterator_reset_state(this[0], A))
    } [Symbol.iterator]() {
      return {
        next: X0(() => {
          if (V1._ts_lookahead_iterator_next(this[0])) return {
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
  X0($o1, "getText");
  M15 = class A {
    static {
      X0(this, "Tree")
    } [0] = 0;
    textCallback;
    language;
    constructor(Q, B, G, Z) {
      BIA(Q), this[0] = B, this.language = G, this.textCallback = Z
    }
    copy() {
      let Q = V1._ts_tree_copy(this[0]);
      return new A(xl, Q, this.language, this.textCallback)
    }
    delete() {
      V1._ts_tree_delete(this[0]), this[0] = 0
    }
    get rootNode() {
      return V1._ts_tree_root_node_wasm(this[0]), XY(this)
    }
    rootNodeWithOffset(Q, B) {
      let G = $2 + vU;
      return V1.setValue(G, Q, "i32"), bM(G + d2, B), V1._ts_tree_root_node_with_offset_wasm(this[0]), XY(this)
    }
    edit(Q) {
      WA2(Q), V1._ts_tree_edit_wasm(this[0])
    }
    walk() {
      return this.rootNode.walk()
    }
    getChangedRanges(Q) {
      if (!(Q instanceof A)) throw TypeError("Argument must be a Tree");
      V1._ts_tree_get_changed_ranges_wasm(this[0], Q[0]);
      let B = V1.getValue($2, "i32"),
        G = V1.getValue($2 + d2, "i32"),
        Z = Array(B);
      if (B > 0) {
        let I = G;
        for (let Y = 0; Y < B; Y++) Z[Y] = D01(I), I += cNA;
        V1._free(G)
      }
      return Z
    }
    getIncludedRanges() {
      V1._ts_tree_included_ranges_wasm(this[0]);
      let Q = V1.getValue($2, "i32"),
        B = V1.getValue($2 + d2, "i32"),
        G = Array(Q);
      if (Q > 0) {
        let Z = B;
        for (let I = 0; I < Q; I++) G[I] = D01(Z), Z += cNA;
        V1._free(B)
      }
      return G
    }
  }, O15 = class A {
    static {
      X0(this, "TreeCursor")
    } [0] = 0;
    [1] = 0;
    [2] = 0;
    [3] = 0;
    tree;
    constructor(Q, B) {
      BIA(Q), this.tree = B, Hq(this)
    }
    copy() {
      let Q = new A(xl, this.tree);
      return V1._ts_tree_cursor_copy_wasm(this.tree[0]), Hq(Q), Q
    }
    delete() {
      DZ(this), V1._ts_tree_cursor_delete_wasm(this.tree[0]), this[0] = this[1] = this[2] = 0
    }
    get currentNode() {
      return DZ(this), V1._ts_tree_cursor_current_node_wasm(this.tree[0]), XY(this.tree)
    }
    get currentFieldId() {
      return DZ(this), V1._ts_tree_cursor_current_field_id_wasm(this.tree[0])
    }
    get currentFieldName() {
      return this.tree.language.fields[this.currentFieldId]
    }
    get currentDepth() {
      return DZ(this), V1._ts_tree_cursor_current_depth_wasm(this.tree[0])
    }
    get currentDescendantIndex() {
      return DZ(this), V1._ts_tree_cursor_current_descendant_index_wasm(this.tree[0])
    }
    get nodeType() {
      return this.tree.language.types[this.nodeTypeId] || "ERROR"
    }
    get nodeTypeId() {
      return DZ(this), V1._ts_tree_cursor_current_node_type_id_wasm(this.tree[0])
    }
    get nodeStateId() {
      return DZ(this), V1._ts_tree_cursor_current_node_state_id_wasm(this.tree[0])
    }
    get nodeId() {
      return DZ(this), V1._ts_tree_cursor_current_node_id_wasm(this.tree[0])
    }
    get nodeIsNamed() {
      return DZ(this), V1._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]) === 1
    }
    get nodeIsMissing() {
      return DZ(this), V1._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]) === 1
    }
    get nodeText() {
      DZ(this);
      let Q = V1._ts_tree_cursor_start_index_wasm(this.tree[0]),
        B = V1._ts_tree_cursor_end_index_wasm(this.tree[0]);
      V1._ts_tree_cursor_start_position_wasm(this.tree[0]);
      let G = yAA($2);
      return $o1(this.tree, Q, B, G)
    }
    get startPosition() {
      return DZ(this), V1._ts_tree_cursor_start_position_wasm(this.tree[0]), yAA($2)
    }
    get endPosition() {
      return DZ(this), V1._ts_tree_cursor_end_position_wasm(this.tree[0]), yAA($2)
    }
    get startIndex() {
      return DZ(this), V1._ts_tree_cursor_start_index_wasm(this.tree[0])
    }
    get endIndex() {
      return DZ(this), V1._ts_tree_cursor_end_index_wasm(this.tree[0])
    }
    gotoFirstChild() {
      DZ(this);
      let Q = V1._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
      return Hq(this), Q === 1
    }
    gotoLastChild() {
      DZ(this);
      let Q = V1._ts_tree_cursor_goto_last_child_wasm(this.tree[0]);
      return Hq(this), Q === 1
    }
    gotoParent() {
      DZ(this);
      let Q = V1._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
      return Hq(this), Q === 1
    }
    gotoNextSibling() {
      DZ(this);
      let Q = V1._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
      return Hq(this), Q === 1
    }
    gotoPreviousSibling() {
      DZ(this);
      let Q = V1._ts_tree_cursor_goto_previous_sibling_wasm(this.tree[0]);
      return Hq(this), Q === 1
    }
    gotoDescendant(Q) {
      DZ(this), V1._ts_tree_cursor_goto_descendant_wasm(this.tree[0], Q), Hq(this)
    }
    gotoFirstChildForIndex(Q) {
      DZ(this), V1.setValue($2 + Co1, Q, "i32");
      let B = V1._ts_tree_cursor_goto_first_child_for_index_wasm(this.tree[0]);
      return Hq(this), B === 1
    }
    gotoFirstChildForPosition(Q) {
      DZ(this), bM($2 + Co1, Q);
      let B = V1._ts_tree_cursor_goto_first_child_for_position_wasm(this.tree[0]);
      return Hq(this), B === 1
    }
    reset(Q) {
      N8(Q), DZ(this, $2 + vU), V1._ts_tree_cursor_reset_wasm(this.tree[0]), Hq(this)
    }
    resetTo(Q) {
      DZ(this, $2), DZ(Q, $2 + Co1), V1._ts_tree_cursor_reset_to_wasm(this.tree[0], Q.tree[0]), Hq(this)
    }
  }, R15 = class {
    static {
      X0(this, "Node")
    } [0] = 0;
    _children;
    _namedChildren;
    constructor(A, {
      id: Q,
      tree: B,
      startIndex: G,
      startPosition: Z,
      other: I
    }) {
      BIA(A), this[0] = I, this.id = Q, this.tree = B, this.startIndex = G, this.startPosition = Z
    }
    id;
    startIndex;
    startPosition;
    tree;
    get typeId() {
      return N8(this), V1._ts_node_symbol_wasm(this.tree[0])
    }
    get grammarId() {
      return N8(this), V1._ts_node_grammar_symbol_wasm(this.tree[0])
    }
    get type() {
      return this.tree.language.types[this.typeId] || "ERROR"
    }
    get grammarType() {
      return this.tree.language.types[this.grammarId] || "ERROR"
    }
    get isNamed() {
      return N8(this), V1._ts_node_is_named_wasm(this.tree[0]) === 1
    }
    get isExtra() {
      return N8(this), V1._ts_node_is_extra_wasm(this.tree[0]) === 1
    }
    get isError() {
      return N8(this), V1._ts_node_is_error_wasm(this.tree[0]) === 1
    }
    get isMissing() {
      return N8(this), V1._ts_node_is_missing_wasm(this.tree[0]) === 1
    }
    get hasChanges() {
      return N8(this), V1._ts_node_has_changes_wasm(this.tree[0]) === 1
    }
    get hasError() {
      return N8(this), V1._ts_node_has_error_wasm(this.tree[0]) === 1
    }
    get endIndex() {
      return N8(this), V1._ts_node_end_index_wasm(this.tree[0])
    }
    get endPosition() {
      return N8(this), V1._ts_node_end_point_wasm(this.tree[0]), yAA($2)
    }
    get text() {
      return $o1(this.tree, this.startIndex, this.endIndex, this.startPosition)
    }
    get parseState() {
      return N8(this), V1._ts_node_parse_state_wasm(this.tree[0])
    }
    get nextParseState() {
      return N8(this), V1._ts_node_next_parse_state_wasm(this.tree[0])
    }
    equals(A) {
      return this.tree === A.tree && this.id === A.id
    }
    child(A) {
      return N8(this), V1._ts_node_child_wasm(this.tree[0], A), XY(this.tree)
    }
    namedChild(A) {
      return N8(this), V1._ts_node_named_child_wasm(this.tree[0], A), XY(this.tree)
    }
    childForFieldId(A) {
      return N8(this), V1._ts_node_child_by_field_id_wasm(this.tree[0], A), XY(this.tree)
    }
    childForFieldName(A) {
      let Q = this.tree.language.fields.indexOf(A);
      if (Q !== -1) return this.childForFieldId(Q);
      return null
    }
    fieldNameForChild(A) {
      N8(this);
      let Q = V1._ts_node_field_name_for_child_wasm(this.tree[0], A);
      if (!Q) return null;
      return V1.AsciiToString(Q)
    }
    fieldNameForNamedChild(A) {
      N8(this);
      let Q = V1._ts_node_field_name_for_named_child_wasm(this.tree[0], A);
      if (!Q) return null;
      return V1.AsciiToString(Q)
    }
    childrenForFieldName(A) {
      let Q = this.tree.language.fields.indexOf(A);
      if (Q !== -1 && Q !== 0) return this.childrenForFieldId(Q);
      return []
    }
    childrenForFieldId(A) {
      N8(this), V1._ts_node_children_by_field_id_wasm(this.tree[0], A);
      let Q = V1.getValue($2, "i32"),
        B = V1.getValue($2 + d2, "i32"),
        G = Array(Q);
      if (Q > 0) {
        let Z = B;
        for (let I = 0; I < Q; I++) G[I] = XY(this.tree, Z), Z += vU;
        V1._free(B)
      }
      return G
    }
    firstChildForIndex(A) {
      N8(this);
      let Q = $2 + vU;
      return V1.setValue(Q, A, "i32"), V1._ts_node_first_child_for_byte_wasm(this.tree[0]), XY(this.tree)
    }
    firstNamedChildForIndex(A) {
      N8(this);
      let Q = $2 + vU;
      return V1.setValue(Q, A, "i32"), V1._ts_node_first_named_child_for_byte_wasm(this.tree[0]), XY(this.tree)
    }
    get childCount() {
      return N8(this), V1._ts_node_child_count_wasm(this.tree[0])
    }
    get namedChildCount() {
      return N8(this), V1._ts_node_named_child_count_wasm(this.tree[0])
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
        N8(this), V1._ts_node_children_wasm(this.tree[0]);
        let A = V1.getValue($2, "i32"),
          Q = V1.getValue($2 + d2, "i32");
        if (this._children = Array(A), A > 0) {
          let B = Q;
          for (let G = 0; G < A; G++) this._children[G] = XY(this.tree, B), B += vU;
          V1._free(Q)
        }
      }
      return this._children
    }
    get namedChildren() {
      if (!this._namedChildren) {
        N8(this), V1._ts_node_named_children_wasm(this.tree[0]);
        let A = V1.getValue($2, "i32"),
          Q = V1.getValue($2 + d2, "i32");
        if (this._namedChildren = Array(A), A > 0) {
          let B = Q;
          for (let G = 0; G < A; G++) this._namedChildren[G] = XY(this.tree, B), B += vU;
          V1._free(Q)
        }
      }
      return this._namedChildren
    }
    descendantsOfType(A, Q = yl, B = yl) {
      if (!Array.isArray(A)) A = [A];
      let G = [],
        Z = this.tree.language.types;
      for (let X of A)
        if (X == "ERROR") G.push(65535);
      for (let X = 0, V = Z.length; X < V; X++)
        if (A.includes(Z[X])) G.push(X);
      let I = V1._malloc(d2 * G.length);
      for (let X = 0, V = G.length; X < V; X++) V1.setValue(I + X * d2, G[X], "i32");
      N8(this), V1._ts_node_descendants_of_type_wasm(this.tree[0], I, G.length, Q.row, Q.column, B.row, B.column);
      let Y = V1.getValue($2, "i32"),
        J = V1.getValue($2 + d2, "i32"),
        W = Array(Y);
      if (Y > 0) {
        let X = J;
        for (let V = 0; V < Y; V++) W[V] = XY(this.tree, X), X += vU
      }
      return V1._free(J), V1._free(I), W
    }
    get nextSibling() {
      return N8(this), V1._ts_node_next_sibling_wasm(this.tree[0]), XY(this.tree)
    }
    get previousSibling() {
      return N8(this), V1._ts_node_prev_sibling_wasm(this.tree[0]), XY(this.tree)
    }
    get nextNamedSibling() {
      return N8(this), V1._ts_node_next_named_sibling_wasm(this.tree[0]), XY(this.tree)
    }
    get previousNamedSibling() {
      return N8(this), V1._ts_node_prev_named_sibling_wasm(this.tree[0]), XY(this.tree)
    }
    get descendantCount() {
      return N8(this), V1._ts_node_descendant_count_wasm(this.tree[0])
    }
    get parent() {
      return N8(this), V1._ts_node_parent_wasm(this.tree[0]), XY(this.tree)
    }
    childWithDescendant(A) {
      return N8(this), N8(A, 1), V1._ts_node_child_with_descendant_wasm(this.tree[0]), XY(this.tree)
    }
    descendantForIndex(A, Q = A) {
      if (typeof A !== "number" || typeof Q !== "number") throw Error("Arguments must be numbers");
      N8(this);
      let B = $2 + vU;
      return V1.setValue(B, A, "i32"), V1.setValue(B + d2, Q, "i32"), V1._ts_node_descendant_for_index_wasm(this.tree[0]), XY(this.tree)
    }
    namedDescendantForIndex(A, Q = A) {
      if (typeof A !== "number" || typeof Q !== "number") throw Error("Arguments must be numbers");
      N8(this);
      let B = $2 + vU;
      return V1.setValue(B, A, "i32"), V1.setValue(B + d2, Q, "i32"), V1._ts_node_named_descendant_for_index_wasm(this.tree[0]), XY(this.tree)
    }
    descendantForPosition(A, Q = A) {
      if (!dNA(A) || !dNA(Q)) throw Error("Arguments must be {row, column} objects");
      N8(this);
      let B = $2 + vU;
      return bM(B, A), bM(B + wk, Q), V1._ts_node_descendant_for_position_wasm(this.tree[0]), XY(this.tree)
    }
    namedDescendantForPosition(A, Q = A) {
      if (!dNA(A) || !dNA(Q)) throw Error("Arguments must be {row, column} objects");
      N8(this);
      let B = $2 + vU;
      return bM(B, A), bM(B + wk, Q), V1._ts_node_named_descendant_for_position_wasm(this.tree[0]), XY(this.tree)
    }
    walk() {
      return N8(this), V1._ts_tree_cursor_new_wasm(this.tree[0]), new O15(xl, this.tree)
    }
    edit(A) {
      if (this.startIndex >= A.oldEndIndex) {
        this.startIndex = A.newEndIndex + (this.startIndex - A.oldEndIndex);
        let Q, B;
        if (this.startPosition.row > A.oldEndPosition.row) Q = this.startPosition.row - A.oldEndPosition.row, B = this.startPosition.column;
        else if (Q = 0, B = this.startPosition.column, this.startPosition.column >= A.oldEndPosition.column) B = this.startPosition.column - A.oldEndPosition.column;
        if (Q > 0) this.startPosition.row += Q, this.startPosition.column = B;
        else this.startPosition.column += B
      } else if (this.startIndex > A.startIndex) this.startIndex = A.newEndIndex, this.startPosition.row = A.newEndPosition.row, this.startPosition.column = A.newEndPosition.column
    }
    toString() {
      N8(this);
      let A = V1._ts_node_to_string_wasm(this.tree[0]),
        Q = V1.AsciiToString(A);
      return V1._free(A), Q
    }
  };
  X0(Uo1, "unmarshalCaptures");
  X0(N8, "marshalNode");
  X0(XY, "unmarshalNode");
  X0(DZ, "marshalTreeCursor");
  X0(Hq, "unmarshalTreeCursor");
  X0(bM, "marshalPoint");
  X0(yAA, "unmarshalPoint");
  X0(JA2, "marshalRange");
  X0(D01, "unmarshalRange");
  X0(WA2, "marshalEdit");
  X0(XA2, "unmarshalLanguageMetadata");
  j15 = /[\w-]+/g, pwG = {
    Zero: 0,
    ZeroOrOne: 1,
    ZeroOrMore: 2,
    One: 3,
    OneOrMore: 4
  }, IA2 = X0((A) => A.type === "capture", "isCaptureStep"), wo1 = X0((A) => A.type === "string", "isStringStep"), iT = {
    Syntax: 1,
    NodeName: 2,
    FieldName: 3,
    CaptureName: 4,
    PatternStructure: 5
  }, mNA = class A extends Error {
    constructor(Q, B, G, Z) {
      super(A.formatMessage(Q, B));
      this.kind = Q, this.info = B, this.index = G, this.length = Z, this.name = "QueryError"
    }
    static {
      X0(this, "QueryError")
    }
    static formatMessage(Q, B) {
      switch (Q) {
        case iT.NodeName:
          return `Bad node name '${B.word}'`;
        case iT.FieldName:
          return `Bad field name '${B.word}'`;
        case iT.CaptureName:
          return `Bad capture name @${B.word}`;
        case iT.PatternStructure:
          return `Bad pattern structure at offset ${B.suffix}`;
        case iT.Syntax:
          return `Bad syntax at offset ${B.suffix}`
      }
    }
  };
  X0(VA2, "parseAnyPredicate");
  X0(FA2, "parseMatchPredicate");
  X0(KA2, "parseAnyOfPredicate");
  X0(DA2, "parseIsPredicate");
  X0(HA2, "parseSetDirective");
  X0(CA2, "parsePattern");
  S15 = class {
    static {
      X0(this, "Query")
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
    constructor(A, Q) {
      let B = V1.lengthBytesUTF8(Q),
        G = V1._malloc(B + 1);
      V1.stringToUTF8(Q, G, B + 1);
      let Z = V1._ts_query_new(A[0], G, B, $2, $2 + d2);
      if (!Z) {
        let E = V1.getValue($2 + d2, "i32"),
          U = V1.getValue($2, "i32"),
          q = V1.UTF8ToString(G, U).length,
          w = Q.slice(q, q + 100).split(`
`)[0],
          N = w.match(j15)?.[0] ?? "";
        switch (V1._free(G), E) {
          case iT.Syntax:
            throw new mNA(iT.Syntax, {
              suffix: `${q}: '${w}'...`
            }, q, 0);
          case iT.NodeName:
            throw new mNA(E, {
              word: N
            }, q, N.length);
          case iT.FieldName:
            throw new mNA(E, {
              word: N
            }, q, N.length);
          case iT.CaptureName:
            throw new mNA(E, {
              word: N
            }, q, N.length);
          case iT.PatternStructure:
            throw new mNA(E, {
              suffix: `${q}: '${w}'...`
            }, q, 0)
        }
      }
      let I = V1._ts_query_string_count(Z),
        Y = V1._ts_query_capture_count(Z),
        J = V1._ts_query_pattern_count(Z),
        W = Array(Y),
        X = Array(J),
        V = Array(I);
      for (let E = 0; E < Y; E++) {
        let U = V1._ts_query_capture_name_for_id(Z, E, $2),
          q = V1.getValue($2, "i32");
        W[E] = V1.UTF8ToString(U, q)
      }
      for (let E = 0; E < J; E++) {
        let U = Array(Y);
        for (let q = 0; q < Y; q++) {
          let w = V1._ts_query_capture_quantifier_for_id(Z, E, q);
          U[q] = w
        }
        X[E] = U
      }
      for (let E = 0; E < I; E++) {
        let U = V1._ts_query_string_value_for_id(Z, E, $2),
          q = V1.getValue($2, "i32");
        V[E] = V1.UTF8ToString(U, q)
      }
      let F = Array(J),
        K = Array(J),
        D = Array(J),
        H = Array(J),
        C = Array(J);
      for (let E = 0; E < J; E++) {
        let U = V1._ts_query_predicates_for_pattern(Z, E, $2),
          q = V1.getValue($2, "i32");
        H[E] = [], C[E] = [];
        let w = [],
          N = U;
        for (let R = 0; R < q; R++) {
          let T = V1.getValue(N, "i32");
          N += d2;
          let y = V1.getValue(N, "i32");
          N += d2, CA2(E, T, y, W, V, w, C, H, F, K, D)
        }
        Object.freeze(C[E]), Object.freeze(H[E]), Object.freeze(F[E]), Object.freeze(K[E]), Object.freeze(D[E])
      }
      V1._free(G), this[0] = Z, this.captureNames = W, this.captureQuantifiers = X, this.textPredicates = C, this.predicates = H, this.setProperties = F, this.assertedProperties = K, this.refutedProperties = D, this.exceededMatchLimit = !1
    }
    delete() {
      V1._ts_query_delete(this[0]), this[0] = 0
    }
    matches(A, Q = {}) {
      let B = Q.startPosition ?? yl,
        G = Q.endPosition ?? yl,
        Z = Q.startIndex ?? 0,
        I = Q.endIndex ?? 0,
        Y = Q.matchLimit ?? 4294967295,
        J = Q.maxStartDepth ?? 4294967295,
        W = Q.timeoutMicros ?? 0,
        X = Q.progressCallback;
      if (typeof Y !== "number") throw Error("Arguments must be numbers");
      if (this.matchLimit = Y, I !== 0 && Z > I) throw Error("`startIndex` cannot be greater than `endIndex`");
      if (G !== yl && (B.row > G.row || B.row === G.row && B.column > G.column)) throw Error("`startPosition` cannot be greater than `endPosition`");
      if (X) V1.currentQueryProgressCallback = X;
      N8(A), V1._ts_query_matches_wasm(this[0], A.tree[0], B.row, B.column, G.row, G.column, Z, I, Y, J, W);
      let V = V1.getValue($2, "i32"),
        F = V1.getValue($2 + d2, "i32"),
        K = V1.getValue($2 + 2 * d2, "i32"),
        D = Array(V);
      this.exceededMatchLimit = Boolean(K);
      let H = 0,
        C = F;
      for (let E = 0; E < V; E++) {
        let U = V1.getValue(C, "i32");
        C += d2;
        let q = V1.getValue(C, "i32");
        C += d2;
        let w = Array(q);
        if (C = Uo1(this, A.tree, C, U, w), this.textPredicates[U].every((N) => N(w))) {
          D[H] = {
            pattern: U,
            patternIndex: U,
            captures: w
          };
          let N = this.setProperties[U];
          D[H].setProperties = N;
          let R = this.assertedProperties[U];
          D[H].assertedProperties = R;
          let T = this.refutedProperties[U];
          D[H].refutedProperties = T, H++
        }
      }
      return D.length = H, V1._free(F), V1.currentQueryProgressCallback = null, D
    }
    captures(A, Q = {}) {
      let B = Q.startPosition ?? yl,
        G = Q.endPosition ?? yl,
        Z = Q.startIndex ?? 0,
        I = Q.endIndex ?? 0,
        Y = Q.matchLimit ?? 4294967295,
        J = Q.maxStartDepth ?? 4294967295,
        W = Q.timeoutMicros ?? 0,
        X = Q.progressCallback;
      if (typeof Y !== "number") throw Error("Arguments must be numbers");
      if (this.matchLimit = Y, I !== 0 && Z > I) throw Error("`startIndex` cannot be greater than `endIndex`");
      if (G !== yl && (B.row > G.row || B.row === G.row && B.column > G.column)) throw Error("`startPosition` cannot be greater than `endPosition`");
      if (X) V1.currentQueryProgressCallback = X;
      N8(A), V1._ts_query_captures_wasm(this[0], A.tree[0], B.row, B.column, G.row, G.column, Z, I, Y, J, W);
      let V = V1.getValue($2, "i32"),
        F = V1.getValue($2 + d2, "i32"),
        K = V1.getValue($2 + 2 * d2, "i32"),
        D = [];
      this.exceededMatchLimit = Boolean(K);
      let H = [],
        C = F;
      for (let E = 0; E < V; E++) {
        let U = V1.getValue(C, "i32");
        C += d2;
        let q = V1.getValue(C, "i32");
        C += d2;
        let w = V1.getValue(C, "i32");
        if (C += d2, H.length = q, C = Uo1(this, A.tree, C, U, H), this.textPredicates[U].every((N) => N(H))) {
          let N = H[w],
            R = this.setProperties[U];
          N.setProperties = R;
          let T = this.assertedProperties[U];
          N.assertedProperties = T;
          let y = this.refutedProperties[U];
          N.refutedProperties = y, D.push(N)
        }
      }
      return V1._free(F), V1.currentQueryProgressCallback = null, D
    }
    predicatesForPattern(A) {
      return this.predicates[A]
    }
    disableCapture(A) {
      let Q = V1.lengthBytesUTF8(A),
        B = V1._malloc(Q + 1);
      V1.stringToUTF8(A, B, Q + 1), V1._ts_query_disable_capture(this[0], B, Q), V1._free(B)
    }
    disablePattern(A) {
      if (A >= this.predicates.length) throw Error(`Pattern index is ${A} but the pattern count is ${this.predicates.length}`);
      V1._ts_query_disable_pattern(this[0], A)
    }
    didExceedMatchLimit() {
      return this.exceededMatchLimit
    }
    startIndexForPattern(A) {
      if (A >= this.predicates.length) throw Error(`Pattern index is ${A} but the pattern count is ${this.predicates.length}`);
      return V1._ts_query_start_byte_for_pattern(this[0], A)
    }
    endIndexForPattern(A) {
      if (A >= this.predicates.length) throw Error(`Pattern index is ${A} but the pattern count is ${this.predicates.length}`);
      return V1._ts_query_end_byte_for_pattern(this[0], A)
    }
    patternCount() {
      return V1._ts_query_pattern_count(this[0])
    }
    captureIndexForName(A) {
      return this.captureNames.indexOf(A)
    }
    isPatternRooted(A) {
      return V1._ts_query_is_pattern_rooted(this[0], A) === 1
    }
    isPatternNonLocal(A) {
      return V1._ts_query_is_pattern_non_local(this[0], A) === 1
    }
    isPatternGuaranteedAtStep(A) {
      return V1._ts_query_is_pattern_guaranteed_at_step(this[0], A) === 1
    }
  }, _15 = /^tree_sitter_\w+$/, qo1 = class A {
    static {
      X0(this, "Language")
    } [0] = 0;
    types;
    fields;
    constructor(Q, B) {
      BIA(Q), this[0] = B, this.types = Array(V1._ts_language_symbol_count(this[0]));
      for (let G = 0, Z = this.types.length; G < Z; G++)
        if (V1._ts_language_symbol_type(this[0], G) < 2) this.types[G] = V1.UTF8ToString(V1._ts_language_symbol_name(this[0], G));
      this.fields = Array(V1._ts_language_field_count(this[0]) + 1);
      for (let G = 0, Z = this.fields.length; G < Z; G++) {
        let I = V1._ts_language_field_name_for_id(this[0], G);
        if (I !== 0) this.fields[G] = V1.UTF8ToString(I);
        else this.fields[G] = null
      }
    }
    get name() {
      let Q = V1._ts_language_name(this[0]);
      if (Q === 0) return null;
      return V1.UTF8ToString(Q)
    }
    get version() {
      return V1._ts_language_version(this[0])
    }
    get abiVersion() {
      return V1._ts_language_abi_version(this[0])
    }
    get metadata() {
      V1._ts_language_metadata(this[0]);
      let Q = V1.getValue($2, "i32"),
        B = V1.getValue($2 + d2, "i32");
      if (Q === 0) return null;
      return XA2(B)
    }
    get fieldCount() {
      return this.fields.length - 1
    }
    get stateCount() {
      return V1._ts_language_state_count(this[0])
    }
    fieldIdForName(Q) {
      let B = this.fields.indexOf(Q);
      return B !== -1 ? B : null
    }
    fieldNameForId(Q) {
      return this.fields[Q] ?? null
    }
    idForNodeType(Q, B) {
      let G = V1.lengthBytesUTF8(Q),
        Z = V1._malloc(G + 1);
      V1.stringToUTF8(Q, Z, G + 1);
      let I = V1._ts_language_symbol_for_name(this[0], Z, G, B ? 1 : 0);
      return V1._free(Z), I || null
    }
    get nodeTypeCount() {
      return V1._ts_language_symbol_count(this[0])
    }
    nodeTypeForId(Q) {
      let B = V1._ts_language_symbol_name(this[0], Q);
      return B ? V1.UTF8ToString(B) : null
    }
    nodeTypeIsNamed(Q) {
      return V1._ts_language_type_is_named_wasm(this[0], Q) ? !0 : !1
    }
    nodeTypeIsVisible(Q) {
      return V1._ts_language_type_is_visible_wasm(this[0], Q) ? !0 : !1
    }
    get supertypes() {
      V1._ts_language_supertypes_wasm(this[0]);
      let Q = V1.getValue($2, "i32"),
        B = V1.getValue($2 + d2, "i32"),
        G = Array(Q);
      if (Q > 0) {
        let Z = B;
        for (let I = 0; I < Q; I++) G[I] = V1.getValue(Z, "i16"), Z += ZA2
      }
      return G
    }
    subtypes(Q) {
      V1._ts_language_subtypes_wasm(this[0], Q);
      let B = V1.getValue($2, "i32"),
        G = V1.getValue($2 + d2, "i32"),
        Z = Array(B);
      if (B > 0) {
        let I = G;
        for (let Y = 0; Y < B; Y++) Z[Y] = V1.getValue(I, "i16"), I += ZA2
      }
      return Z
    }
    nextState(Q, B) {
      return V1._ts_language_next_state(this[0], Q, B)
    }
    lookaheadIterator(Q) {
      let B = V1._ts_lookahead_iterator_new(this[0], Q);
      if (B) return new L15(xl, B, this);
      return null
    }
    query(Q) {
      return console.warn("Language.query is deprecated. Use new Query(language, source) instead."), new S15(this, Q)
    }
    static async load(Q) {
      let B;
      if (Q instanceof Uint8Array) B = Promise.resolve(Q);
      else if (globalThis.process?.versions.node) B = (await import("fs/promises")).readFile(Q);
      else B = fetch(Q).then((J) => J.arrayBuffer().then((W) => {
        if (J.ok) return new Uint8Array(W);
        else {
          let X = new TextDecoder("utf-8").decode(W);
          throw Error(`Language.load failed with status ${J.status}.

${X}`)
        }
      }));
      let G = await V1.loadWebAssemblyModule(await B, {
          loadAsync: !0
        }),
        Z = Object.keys(G),
        I = Z.find((J) => _15.test(J) && !J.includes("external_scanner_"));
      if (!I) throw console.log(`Couldn't find language function in WASM file. Symbols:
${JSON.stringify(Z,null,2)}`), Error("Language.load failed: no language function found in WASM file");
      let Y = G[I]();
      return new A(xl, Y)
    }
  }, k15 = (() => {
    var _scriptName = import.meta.url;
    return async function(moduleArg = {}) {
      var moduleRtn, Module = moduleArg,
        readyPromiseResolve, readyPromiseReject, readyPromise = new Promise((A, Q) => {
          readyPromiseResolve = A, readyPromiseReject = Q
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
        quit_ = X0((A, Q) => {
          throw Q
        }, "quit_"),
        scriptDirectory = "";

      function locateFile(A) {
        if (Module.locateFile) return Module.locateFile(A, scriptDirectory);
        return scriptDirectory + A
      }
      X0(locateFile, "locateFile");
      var readAsync, readBinary;
      if (ENVIRONMENT_IS_NODE) {
        var fs = require("fs"),
          nodePath = require("path");
        if (!import.meta.url.startsWith("data:")) scriptDirectory = nodePath.dirname(require("url").fileURLToPath(import.meta.url)) + "/";
        if (readBinary = X0((A) => {
            A = isFileURI(A) ? new URL(A) : A;
            var Q = fs.readFileSync(A);
            return Q
          }, "readBinary"), readAsync = X0(async (A, Q = !0) => {
            A = isFileURI(A) ? new URL(A) : A;
            var B = fs.readFileSync(A, Q ? void 0 : "utf8");
            return B
          }, "readAsync"), !Module.thisProgram && process.argv.length > 1) thisProgram = process.argv[1].replace(/\\/g, "/");
        arguments_ = process.argv.slice(2), quit_ = X0((A, Q) => {
          throw process.exitCode = A, Q
        }, "quit_")
      } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) scriptDirectory = self.location.href;
        else if (typeof document < "u" && document.currentScript) scriptDirectory = document.currentScript.src;
        if (_scriptName) scriptDirectory = _scriptName;
        if (scriptDirectory.startsWith("blob:")) scriptDirectory = "";
        else scriptDirectory = scriptDirectory.slice(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
        {
          if (ENVIRONMENT_IS_WORKER) readBinary = X0((A) => {
            var Q = new XMLHttpRequest;
            return Q.open("GET", A, !1), Q.responseType = "arraybuffer", Q.send(null), new Uint8Array(Q.response)
          }, "readBinary");
          readAsync = X0(async (A) => {
            if (isFileURI(A)) return new Promise((B, G) => {
              var Z = new XMLHttpRequest;
              Z.open("GET", A, !0), Z.responseType = "arraybuffer", Z.onload = () => {
                if (Z.status == 200 || Z.status == 0 && Z.response) {
                  B(Z.response);
                  return
                }
                G(Z.status)
              }, Z.onerror = G, Z.send(null)
            });
            var Q = await fetch(A, {
              credentials: "same-origin"
            });
            if (Q.ok) return Q.arrayBuffer();
            throw Error(Q.status + " : " + Q.url)
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

      function assert(A, Q) {
        if (!A) abort(Q)
      }
      X0(assert, "assert");
      var HEAP, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPU64, HEAPF64, HEAP_DATA_VIEW, runtimeInitialized = !1,
        isFileURI = X0((A) => A.startsWith("file://"), "isFileURI");

      function updateMemoryViews() {
        var A = wasmMemory.buffer;
        Module.HEAP_DATA_VIEW = HEAP_DATA_VIEW = new DataView(A), Module.HEAP8 = HEAP8 = new Int8Array(A), Module.HEAP16 = HEAP16 = new Int16Array(A), Module.HEAPU8 = HEAPU8 = new Uint8Array(A), Module.HEAPU16 = HEAPU16 = new Uint16Array(A), Module.HEAP32 = HEAP32 = new Int32Array(A), Module.HEAPU32 = HEAPU32 = new Uint32Array(A), Module.HEAPF32 = HEAPF32 = new Float32Array(A), Module.HEAPF64 = HEAPF64 = new Float64Array(A), Module.HEAP64 = HEAP64 = new BigInt64Array(A), Module.HEAPU64 = HEAPU64 = new BigUint64Array(A)
      }
      if (X0(updateMemoryViews, "updateMemoryViews"), Module.wasmMemory) wasmMemory = Module.wasmMemory;
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
      X0(preRun, "preRun");

      function initRuntime() {
        runtimeInitialized = !0, callRuntimeCallbacks(__RELOC_FUNCS__), wasmExports.__wasm_call_ctors(), callRuntimeCallbacks(onPostCtors)
      }
      X0(initRuntime, "initRuntime");

      function preMain() {}
      X0(preMain, "preMain");

      function postRun() {
        if (Module.postRun) {
          if (typeof Module.postRun == "function") Module.postRun = [Module.postRun];
          while (Module.postRun.length) addOnPostRun(Module.postRun.shift())
        }
        callRuntimeCallbacks(onPostRuns)
      }
      X0(postRun, "postRun");
      var runDependencies = 0,
        dependenciesFulfilled = null;

      function getUniqueRunDependency(A) {
        return A
      }
      X0(getUniqueRunDependency, "getUniqueRunDependency");

      function addRunDependency(A) {
        runDependencies++, Module.monitorRunDependencies?.(runDependencies)
      }
      X0(addRunDependency, "addRunDependency");

      function removeRunDependency(A) {
        if (runDependencies--, Module.monitorRunDependencies?.(runDependencies), runDependencies == 0) {
          if (dependenciesFulfilled) {
            var Q = dependenciesFulfilled;
            dependenciesFulfilled = null, Q()
          }
        }
      }
      X0(removeRunDependency, "removeRunDependency");

      function abort(A) {
        Module.onAbort?.(A), A = "Aborted(" + A + ")", err(A), ABORT = !0, A += ". Build with -sASSERTIONS for more info.";
        var Q = new WebAssembly.RuntimeError(A);
        throw readyPromiseReject(Q), Q
      }
      X0(abort, "abort");
      var wasmBinaryFile;

      function findWasmBinary() {
        if (Module.locateFile) return locateFile("tree-sitter.wasm");
        return new URL("tree-sitter.wasm", import.meta.url).href
      }
      X0(findWasmBinary, "findWasmBinary");

      function getBinarySync(A) {
        if (A == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
        if (readBinary) return readBinary(A);
        throw "both async and sync fetching of the wasm failed"
      }
      X0(getBinarySync, "getBinarySync");
      async function getWasmBinary(A) {
        if (!wasmBinary) try {
          var Q = await readAsync(A);
          return new Uint8Array(Q)
        } catch {}
        return getBinarySync(A)
      }
      X0(getWasmBinary, "getWasmBinary");
      async function instantiateArrayBuffer(A, Q) {
        try {
          var B = await getWasmBinary(A),
            G = await WebAssembly.instantiate(B, Q);
          return G
        } catch (Z) {
          err(`failed to asynchronously prepare wasm: ${Z}`), abort(Z)
        }
      }
      X0(instantiateArrayBuffer, "instantiateArrayBuffer");
      async function instantiateAsync(A, Q, B) {
        if (!A && typeof WebAssembly.instantiateStreaming == "function" && !isFileURI(Q) && !ENVIRONMENT_IS_NODE) try {
          var G = fetch(Q, {
              credentials: "same-origin"
            }),
            Z = await WebAssembly.instantiateStreaming(G, B);
          return Z
        } catch (I) {
          err(`wasm streaming compile failed: ${I}`), err("falling back to ArrayBuffer instantiation")
        }
        return instantiateArrayBuffer(Q, B)
      }
      X0(instantiateAsync, "instantiateAsync");

      function getWasmImports() {
        return {
          env: wasmImports,
          wasi_snapshot_preview1: wasmImports,
          "GOT.mem": new Proxy(wasmImports, GOTHandler),
          "GOT.func": new Proxy(wasmImports, GOTHandler)
        }
      }
      X0(getWasmImports, "getWasmImports");
      async function createWasm() {
        function A(I, Y) {
          wasmExports = I.exports, wasmExports = relocateExports(wasmExports, 1024);
          var J = getDylinkMetadata(Y);
          if (J.neededDynlibs) dynamicLibraries = J.neededDynlibs.concat(dynamicLibraries);
          return mergeLibSymbols(wasmExports, "main"), LDSO.init(), loadDylibs(), __RELOC_FUNCS__.push(wasmExports.__wasm_apply_data_relocs), removeRunDependency("wasm-instantiate"), wasmExports
        }
        X0(A, "receiveInstance"), addRunDependency("wasm-instantiate");

        function Q(I) {
          return A(I.instance, I.module)
        }
        X0(Q, "receiveInstantiationResult");
        var B = getWasmImports();
        if (Module.instantiateWasm) return new Promise((I, Y) => {
          Module.instantiateWasm(B, (J, W) => {
            A(J, W), I(J.exports)
          })
        });
        wasmBinaryFile ??= findWasmBinary();
        try {
          var G = await instantiateAsync(wasmBinary, wasmBinaryFile, B),
            Z = Q(G);
          return Z
        } catch (I) {
          return readyPromiseReject(I), Promise.reject(I)
        }
      }
      X0(createWasm, "createWasm");
      var ASM_CONSTS = {};
      class ExitStatus {
        static {
          X0(this, "ExitStatus")
        }
        name = "ExitStatus";
        constructor(A) {
          this.message = `Program terminated with exit(${A})`, this.status = A
        }
      }
      var GOT = {},
        currentModuleWeakSymbols = new Set([]),
        GOTHandler = {
          get(A, Q) {
            var B = GOT[Q];
            if (!B) B = GOT[Q] = new WebAssembly.Global({
              value: "i32",
              mutable: !0
            });
            if (!currentModuleWeakSymbols.has(Q)) B.required = !0;
            return B
          }
        },
        LE_HEAP_LOAD_F32 = X0((A) => HEAP_DATA_VIEW.getFloat32(A, !0), "LE_HEAP_LOAD_F32"),
        LE_HEAP_LOAD_F64 = X0((A) => HEAP_DATA_VIEW.getFloat64(A, !0), "LE_HEAP_LOAD_F64"),
        LE_HEAP_LOAD_I16 = X0((A) => HEAP_DATA_VIEW.getInt16(A, !0), "LE_HEAP_LOAD_I16"),
        LE_HEAP_LOAD_I32 = X0((A) => HEAP_DATA_VIEW.getInt32(A, !0), "LE_HEAP_LOAD_I32"),
        LE_HEAP_LOAD_U16 = X0((A) => HEAP_DATA_VIEW.getUint16(A, !0), "LE_HEAP_LOAD_U16"),
        LE_HEAP_LOAD_U32 = X0((A) => HEAP_DATA_VIEW.getUint32(A, !0), "LE_HEAP_LOAD_U32"),
        LE_HEAP_STORE_F32 = X0((A, Q) => HEAP_DATA_VIEW.setFloat32(A, Q, !0), "LE_HEAP_STORE_F32"),
        LE_HEAP_STORE_F64 = X0((A, Q) => HEAP_DATA_VIEW.setFloat64(A, Q, !0), "LE_HEAP_STORE_F64"),
        LE_HEAP_STORE_I16 = X0((A, Q) => HEAP_DATA_VIEW.setInt16(A, Q, !0), "LE_HEAP_STORE_I16"),
        LE_HEAP_STORE_I32 = X0((A, Q) => HEAP_DATA_VIEW.setInt32(A, Q, !0), "LE_HEAP_STORE_I32"),
        LE_HEAP_STORE_U16 = X0((A, Q) => HEAP_DATA_VIEW.setUint16(A, Q, !0), "LE_HEAP_STORE_U16"),
        LE_HEAP_STORE_U32 = X0((A, Q) => HEAP_DATA_VIEW.setUint32(A, Q, !0), "LE_HEAP_STORE_U32"),
        callRuntimeCallbacks = X0((A) => {
          while (A.length > 0) A.shift()(Module)
        }, "callRuntimeCallbacks"),
        onPostRuns = [],
        addOnPostRun = X0((A) => onPostRuns.unshift(A), "addOnPostRun"),
        onPreRuns = [],
        addOnPreRun = X0((A) => onPreRuns.unshift(A), "addOnPreRun"),
        UTF8Decoder = typeof TextDecoder < "u" ? new TextDecoder : void 0,
        UTF8ArrayToString = X0((A, Q = 0, B = NaN) => {
          var G = Q + B,
            Z = Q;
          while (A[Z] && !(Z >= G)) ++Z;
          if (Z - Q > 16 && A.buffer && UTF8Decoder) return UTF8Decoder.decode(A.subarray(Q, Z));
          var I = "";
          while (Q < Z) {
            var Y = A[Q++];
            if (!(Y & 128)) {
              I += String.fromCharCode(Y);
              continue
            }
            var J = A[Q++] & 63;
            if ((Y & 224) == 192) {
              I += String.fromCharCode((Y & 31) << 6 | J);
              continue
            }
            var W = A[Q++] & 63;
            if ((Y & 240) == 224) Y = (Y & 15) << 12 | J << 6 | W;
            else Y = (Y & 7) << 18 | J << 12 | W << 6 | A[Q++] & 63;
            if (Y < 65536) I += String.fromCharCode(Y);
            else {
              var X = Y - 65536;
              I += String.fromCharCode(55296 | X >> 10, 56320 | X & 1023)
            }
          }
          return I
        }, "UTF8ArrayToString"),
        getDylinkMetadata = X0((A) => {
          var Q = 0,
            B = 0;

          function G() {
            return A[Q++]
          }
          X0(G, "getU8");

          function Z() {
            var l = 0,
              k = 1;
            while (!0) {
              var m = A[Q++];
              if (l += (m & 127) * k, k *= 128, !(m & 128)) break
            }
            return l
          }
          X0(Z, "getLEB");

          function I() {
            var l = Z();
            return Q += l, UTF8ArrayToString(A, Q - l, l)
          }
          X0(I, "getString");

          function Y(l, k) {
            if (l) throw Error(k)
          }
          X0(Y, "failIf");
          var J = "dylink.0";
          if (A instanceof WebAssembly.Module) {
            var W = WebAssembly.Module.customSections(A, J);
            if (W.length === 0) J = "dylink", W = WebAssembly.Module.customSections(A, J);
            Y(W.length === 0, "need dylink section"), A = new Uint8Array(W[0]), B = A.length
          } else {
            var X = new Uint32Array(new Uint8Array(A.subarray(0, 24)).buffer),
              V = X[0] == 1836278016 || X[0] == 6386541;
            Y(!V, "need to see wasm magic number"), Y(A[8] !== 0, "need the dylink section to be first"), Q = 9;
            var F = Z();
            B = Q + F, J = I()
          }
          var K = {
            neededDynlibs: [],
            tlsExports: new Set,
            weakImports: new Set
          };
          if (J == "dylink") {
            K.memorySize = Z(), K.memoryAlign = Z(), K.tableSize = Z(), K.tableAlign = Z();
            var D = Z();
            for (var H = 0; H < D; ++H) {
              var C = I();
              K.neededDynlibs.push(C)
            }
          } else {
            Y(J !== "dylink.0");
            var E = 1,
              U = 2,
              q = 3,
              w = 4,
              N = 256,
              R = 3,
              T = 1;
            while (Q < B) {
              var y = G(),
                v = Z();
              if (y === E) K.memorySize = Z(), K.memoryAlign = Z(), K.tableSize = Z(), K.tableAlign = Z();
              else if (y === U) {
                var D = Z();
                for (var H = 0; H < D; ++H) C = I(), K.neededDynlibs.push(C)
              } else if (y === q) {
                var x = Z();
                while (x--) {
                  var p = I(),
                    u = Z();
                  if (u & N) K.tlsExports.add(p)
                }
              } else if (y === w) {
                var x = Z();
                while (x--) {
                  var e = I(),
                    p = I(),
                    u = Z();
                  if ((u & R) == T) K.weakImports.add(p)
                }
              } else Q += v
            }
          }
          return K
        }, "getDylinkMetadata");

      function getValue(A, Q = "i8") {
        if (Q.endsWith("*")) Q = "*";
        switch (Q) {
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
            abort(`invalid type for getValue: ${Q}`)
        }
      }
      X0(getValue, "getValue");
      var newDSO = X0((A, Q, B) => {
          var G = {
            refcount: 1 / 0,
            name: A,
            exports: B,
            global: !0
          };
          if (LDSO.loadedLibsByName[A] = G, Q != null) LDSO.loadedLibsByHandle[Q] = G;
          return G
        }, "newDSO"),
        LDSO = {
          loadedLibsByName: {},
          loadedLibsByHandle: {},
          init() {
            newDSO("__main__", 0, wasmImports)
          }
        },
        ___heap_base = 78224,
        alignMemory = X0((A, Q) => Math.ceil(A / Q) * Q, "alignMemory"),
        getMemory = X0((A) => {
          if (runtimeInitialized) return _calloc(A, 1);
          var Q = ___heap_base,
            B = Q + alignMemory(A, 16);
          return ___heap_base = B, GOT.__heap_base.value = B, Q
        }, "getMemory"),
        isInternalSym = X0((A) => ["__cpp_exception", "__c_longjmp", "__wasm_apply_data_relocs", "__dso_handle", "__tls_size", "__tls_align", "__set_stack_limits", "_emscripten_tls_init", "__wasm_init_tls", "__wasm_call_ctors", "__start_em_asm", "__stop_em_asm", "__start_em_js", "__stop_em_js"].includes(A) || A.startsWith("__em_js__"), "isInternalSym"),
        uleb128Encode = X0((A, Q) => {
          if (A < 128) Q.push(A);
          else Q.push(A % 128 | 128, A >> 7)
        }, "uleb128Encode"),
        sigToWasmTypes = X0((A) => {
          var Q = {
              i: "i32",
              j: "i64",
              f: "f32",
              d: "f64",
              e: "externref",
              p: "i32"
            },
            B = {
              parameters: [],
              results: A[0] == "v" ? [] : [Q[A[0]]]
            };
          for (var G = 1; G < A.length; ++G) B.parameters.push(Q[A[G]]);
          return B
        }, "sigToWasmTypes"),
        generateFuncType = X0((A, Q) => {
          var B = A.slice(0, 1),
            G = A.slice(1),
            Z = {
              i: 127,
              p: 127,
              j: 126,
              f: 125,
              d: 124,
              e: 111
            };
          Q.push(96), uleb128Encode(G.length, Q);
          for (var I = 0; I < G.length; ++I) Q.push(Z[G[I]]);
          if (B == "v") Q.push(0);
          else Q.push(1, Z[B])
        }, "generateFuncType"),
        convertJsFunctionToWasm = X0((A, Q) => {
          if (typeof WebAssembly.Function == "function") return new WebAssembly.Function(sigToWasmTypes(Q), A);
          var B = [1];
          generateFuncType(Q, B);
          var G = [0, 97, 115, 109, 1, 0, 0, 0, 1];
          uleb128Encode(B.length, G), G.push(...B), G.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
          var Z = new WebAssembly.Module(new Uint8Array(G)),
            I = new WebAssembly.Instance(Z, {
              e: {
                f: A
              }
            }),
            Y = I.exports.f;
          return Y
        }, "convertJsFunctionToWasm"),
        wasmTableMirror = [],
        wasmTable = new WebAssembly.Table({
          initial: 31,
          element: "anyfunc"
        }),
        getWasmTableEntry = X0((A) => {
          var Q = wasmTableMirror[A];
          if (!Q) {
            if (A >= wasmTableMirror.length) wasmTableMirror.length = A + 1;
            wasmTableMirror[A] = Q = wasmTable.get(A)
          }
          return Q
        }, "getWasmTableEntry"),
        updateTableMap = X0((A, Q) => {
          if (functionsInTableMap)
            for (var B = A; B < A + Q; B++) {
              var G = getWasmTableEntry(B);
              if (G) functionsInTableMap.set(G, B)
            }
        }, "updateTableMap"),
        functionsInTableMap, getFunctionAddress = X0((A) => {
          if (!functionsInTableMap) functionsInTableMap = new WeakMap, updateTableMap(0, wasmTable.length);
          return functionsInTableMap.get(A) || 0
        }, "getFunctionAddress"),
        freeTableIndexes = [],
        getEmptyTableSlot = X0(() => {
          if (freeTableIndexes.length) return freeTableIndexes.pop();
          try {
            wasmTable.grow(1)
          } catch (A) {
            if (!(A instanceof RangeError)) throw A;
            throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."
          }
          return wasmTable.length - 1
        }, "getEmptyTableSlot"),
        setWasmTableEntry = X0((A, Q) => {
          wasmTable.set(A, Q), wasmTableMirror[A] = wasmTable.get(A)
        }, "setWasmTableEntry"),
        addFunction = X0((A, Q) => {
          var B = getFunctionAddress(A);
          if (B) return B;
          var G = getEmptyTableSlot();
          try {
            setWasmTableEntry(G, A)
          } catch (I) {
            if (!(I instanceof TypeError)) throw I;
            var Z = convertJsFunctionToWasm(A, Q);
            setWasmTableEntry(G, Z)
          }
          return functionsInTableMap.set(A, G), G
        }, "addFunction"),
        updateGOT = X0((A, Q) => {
          for (var B in A) {
            if (isInternalSym(B)) continue;
            var G = A[B];
            if (GOT[B] ||= new WebAssembly.Global({
                value: "i32",
                mutable: !0
              }), Q || GOT[B].value == 0)
              if (typeof G == "function") GOT[B].value = addFunction(G);
              else if (typeof G == "number") GOT[B].value = G;
            else err(`unhandled export type for '${B}': ${typeof G}`)
          }
        }, "updateGOT"),
        relocateExports = X0((A, Q, B) => {
          var G = {};
          for (var Z in A) {
            var I = A[Z];
            if (typeof I == "object") I = I.value;
            if (typeof I == "number") I += Q;
            G[Z] = I
          }
          return updateGOT(G, B), G
        }, "relocateExports"),
        isSymbolDefined = X0((A) => {
          var Q = wasmImports[A];
          if (!Q || Q.stub) return !1;
          return !0
        }, "isSymbolDefined"),
        dynCall = X0((A, Q, B = []) => {
          var G = getWasmTableEntry(Q)(...B);
          return G
        }, "dynCall"),
        stackSave = X0(() => _emscripten_stack_get_current(), "stackSave"),
        stackRestore = X0((A) => __emscripten_stack_restore(A), "stackRestore"),
        createInvokeFunction = X0((A) => (Q, ...B) => {
          var G = stackSave();
          try {
            return dynCall(A, Q, B)
          } catch (Z) {
            if (stackRestore(G), Z !== Z + 0) throw Z;
            if (_setThrew(1, 0), A[0] == "j") return 0n
          }
        }, "createInvokeFunction"),
        resolveGlobalSymbol = X0((A, Q = !1) => {
          var B;
          if (isSymbolDefined(A)) B = wasmImports[A];
          else if (A.startsWith("invoke_")) B = wasmImports[A] = createInvokeFunction(A.split("_")[1]);
          return {
            sym: B,
            name: A
          }
        }, "resolveGlobalSymbol"),
        onPostCtors = [],
        addOnPostCtor = X0((A) => onPostCtors.unshift(A), "addOnPostCtor"),
        UTF8ToString = X0((A, Q) => A ? UTF8ArrayToString(HEAPU8, A, Q) : "", "UTF8ToString"),
        loadWebAssemblyModule = X0((binary, flags, libName, localScope, handle) => {
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
              var Q = resolveGlobalSymbol(A).sym;
              if (!Q && localScope) Q = localScope[A];
              if (!Q) Q = moduleExports[A];
              return Q
            }
            X0(resolveSymbol, "resolveSymbol");
            var proxyHandler = {
                get(A, Q) {
                  switch (Q) {
                    case "__memory_base":
                      return memoryBase;
                    case "__table_base":
                      return tableBase
                  }
                  if (Q in wasmImports && !wasmImports[Q].stub) {
                    var B = wasmImports[Q];
                    return B
                  }
                  if (!(Q in A)) {
                    var G;
                    A[Q] = (...Z) => {
                      return G ||= resolveSymbol(Q), G(...Z)
                    }
                  }
                  return A[Q]
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
              if (X0(addEmAsm, "addEmAsm"), "__start_em_asm" in moduleExports) {
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
              X0(addEmJs, "addEmJs");
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
            if (X0(postInstantiation, "postInstantiation"), flags.loadAsync) {
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
          if (X0(loadModule, "loadModule"), flags.loadAsync) return metadata.neededDynlibs.reduce((A, Q) => A.then(() => loadDynamicLibrary(Q, flags, localScope)), Promise.resolve()).then(loadModule);
          return metadata.neededDynlibs.forEach((A) => loadDynamicLibrary(A, flags, localScope)), loadModule()
        }, "loadWebAssemblyModule"),
        mergeLibSymbols = X0((A, Q) => {
          for (var [B, G] of Object.entries(A)) {
            let Z = X0((Y) => {
              if (!isSymbolDefined(Y)) wasmImports[Y] = G
            }, "setImport");
            Z(B);
            let I = "__main_argc_argv";
            if (B == "main") Z(I);
            if (B == I) Z("main")
          }
        }, "mergeLibSymbols"),
        asyncLoad = X0(async (A) => {
          var Q = await readAsync(A);
          return new Uint8Array(Q)
        }, "asyncLoad");

      function loadDynamicLibrary(A, Q = {
        global: !0,
        nodelete: !0
      }, B, G) {
        var Z = LDSO.loadedLibsByName[A];
        if (Z) {
          if (!Q.global) {
            if (B) Object.assign(B, Z.exports)
          } else if (!Z.global) Z.global = !0, mergeLibSymbols(Z.exports, A);
          if (Q.nodelete && Z.refcount !== 1 / 0) Z.refcount = 1 / 0;
          if (Z.refcount++, G) LDSO.loadedLibsByHandle[G] = Z;
          return Q.loadAsync ? Promise.resolve(!0) : !0
        }
        Z = newDSO(A, G, "loading"), Z.refcount = Q.nodelete ? 1 / 0 : 1, Z.global = Q.global;

        function I() {
          if (G) {
            var W = LE_HEAP_LOAD_U32((G + 28 >> 2) * 4),
              X = LE_HEAP_LOAD_U32((G + 32 >> 2) * 4);
            if (W && X) {
              var V = HEAP8.slice(W, W + X);
              return Q.loadAsync ? Promise.resolve(V) : V
            }
          }
          var F = locateFile(A);
          if (Q.loadAsync) return asyncLoad(F);
          if (!readBinary) throw Error(`${F}: file not found, and synchronous loading of external files is not available`);
          return readBinary(F)
        }
        X0(I, "loadLibData");

        function Y() {
          if (Q.loadAsync) return I().then((W) => loadWebAssemblyModule(W, Q, A, B, G));
          return loadWebAssemblyModule(I(), Q, A, B, G)
        }
        X0(Y, "getExports");

        function J(W) {
          if (Z.global) mergeLibSymbols(W, A);
          else if (B) Object.assign(B, W);
          Z.exports = W
        }
        if (X0(J, "moduleLoaded"), Q.loadAsync) return Y().then((W) => {
          return J(W), !0
        });
        return J(Y()), !0
      }
      X0(loadDynamicLibrary, "loadDynamicLibrary");
      var reportUndefinedSymbols = X0(() => {
          for (var [A, Q] of Object.entries(GOT))
            if (Q.value == 0) {
              var B = resolveGlobalSymbol(A, !0).sym;
              if (!B && !Q.required) continue;
              if (typeof B == "function") Q.value = addFunction(B, B.sig);
              else if (typeof B == "number") Q.value = B;
              else throw Error(`bad export type for '${A}': ${typeof B}`)
            }
        }, "reportUndefinedSymbols"),
        loadDylibs = X0(() => {
          if (!dynamicLibraries.length) {
            reportUndefinedSymbols();
            return
          }
          addRunDependency("loadDylibs"), dynamicLibraries.reduce((A, Q) => A.then(() => loadDynamicLibrary(Q, {
            loadAsync: !0,
            global: !0,
            nodelete: !0,
            allowUndefined: !0
          })), Promise.resolve()).then(() => {
            reportUndefinedSymbols(), removeRunDependency("loadDylibs")
          })
        }, "loadDylibs"),
        noExitRuntime = Module.noExitRuntime || !0;

      function setValue(A, Q, B = "i8") {
        if (B.endsWith("*")) B = "*";
        switch (B) {
          case "i1":
            HEAP8[A] = Q;
            break;
          case "i8":
            HEAP8[A] = Q;
            break;
          case "i16":
            LE_HEAP_STORE_I16((A >> 1) * 2, Q);
            break;
          case "i32":
            LE_HEAP_STORE_I32((A >> 2) * 4, Q);
            break;
          case "i64":
            HEAP64[A >> 3] = BigInt(Q);
            break;
          case "float":
            LE_HEAP_STORE_F32((A >> 2) * 4, Q);
            break;
          case "double":
            LE_HEAP_STORE_F64((A >> 3) * 8, Q);
            break;
          case "*":
            LE_HEAP_STORE_U32((A >> 2) * 4, Q);
            break;
          default:
            abort(`invalid type for setValue: ${B}`)
        }
      }
      X0(setValue, "setValue");
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
        __abort_js = X0(() => abort(""), "__abort_js");
      __abort_js.sig = "v";
      var _emscripten_get_now = X0(() => performance.now(), "_emscripten_get_now");
      _emscripten_get_now.sig = "d";
      var _emscripten_date_now = X0(() => Date.now(), "_emscripten_date_now");
      _emscripten_date_now.sig = "d";
      var nowIsMonotonic = 1,
        checkWasiClock = X0((A) => A >= 0 && A <= 3, "checkWasiClock"),
        INT53_MAX = 9007199254740992,
        INT53_MIN = -9007199254740992,
        bigintToI53Checked = X0((A) => A < INT53_MIN || A > INT53_MAX ? NaN : Number(A), "bigintToI53Checked");

      function _clock_time_get(A, Q, B) {
        if (Q = bigintToI53Checked(Q), !checkWasiClock(A)) return 28;
        var G;
        if (A === 0) G = _emscripten_date_now();
        else if (nowIsMonotonic) G = _emscripten_get_now();
        else return 52;
        var Z = Math.round(G * 1000 * 1000);
        return HEAP64[B >> 3] = BigInt(Z), 0
      }
      X0(_clock_time_get, "_clock_time_get"), _clock_time_get.sig = "iijp";
      var getHeapMax = X0(() => 2147483648, "getHeapMax"),
        growMemory = X0((A) => {
          var Q = wasmMemory.buffer,
            B = (A - Q.byteLength + 65535) / 65536 | 0;
          try {
            return wasmMemory.grow(B), updateMemoryViews(), 1
          } catch (G) {}
        }, "growMemory"),
        _emscripten_resize_heap = X0((A) => {
          var Q = HEAPU8.length;
          A >>>= 0;
          var B = getHeapMax();
          if (A > B) return !1;
          for (var G = 1; G <= 4; G *= 2) {
            var Z = Q * (1 + 0.2 / G);
            Z = Math.min(Z, A + 100663296);
            var I = Math.min(B, alignMemory(Math.max(A, Z), 65536)),
              Y = growMemory(I);
            if (Y) return !0
          }
          return !1
        }, "_emscripten_resize_heap");
      _emscripten_resize_heap.sig = "ip";
      var _fd_close = X0((A) => 52, "_fd_close");
      _fd_close.sig = "ii";

      function _fd_seek(A, Q, B, G) {
        return Q = bigintToI53Checked(Q), 70
      }
      X0(_fd_seek, "_fd_seek"), _fd_seek.sig = "iijip";
      var printCharBuffers = [null, [],
          []
        ],
        printChar = X0((A, Q) => {
          var B = printCharBuffers[A];
          if (Q === 0 || Q === 10)(A === 1 ? out : err)(UTF8ArrayToString(B)), B.length = 0;
          else B.push(Q)
        }, "printChar"),
        flush_NO_FILESYSTEM = X0(() => {
          if (printCharBuffers[1].length) printChar(1, 10);
          if (printCharBuffers[2].length) printChar(2, 10)
        }, "flush_NO_FILESYSTEM"),
        SYSCALLS = {
          varargs: void 0,
          getStr(A) {
            var Q = UTF8ToString(A);
            return Q
          }
        },
        _fd_write = X0((A, Q, B, G) => {
          var Z = 0;
          for (var I = 0; I < B; I++) {
            var Y = LE_HEAP_LOAD_U32((Q >> 2) * 4),
              J = LE_HEAP_LOAD_U32((Q + 4 >> 2) * 4);
            Q += 8;
            for (var W = 0; W < J; W++) printChar(A, HEAPU8[Y + W]);
            Z += J
          }
          return LE_HEAP_STORE_U32((G >> 2) * 4, Z), 0
        }, "_fd_write");
      _fd_write.sig = "iippp";

      function _tree_sitter_log_callback(A, Q) {
        if (Module.currentLogCallback) {
          let B = UTF8ToString(Q);
          Module.currentLogCallback(B, A !== 0)
        }
      }
      X0(_tree_sitter_log_callback, "_tree_sitter_log_callback");

      function _tree_sitter_parse_callback(A, Q, B, G, Z) {
        let Y = Module.currentParseCallback(Q, {
          row: B,
          column: G
        });
        if (typeof Y === "string") setValue(Z, Y.length, "i32"), stringToUTF16(Y, A, 10240);
        else setValue(Z, 0, "i32")
      }
      X0(_tree_sitter_parse_callback, "_tree_sitter_parse_callback");

      function _tree_sitter_progress_callback(A, Q) {
        if (Module.currentProgressCallback) return Module.currentProgressCallback({
          currentOffset: A,
          hasError: Q
        });
        return !1
      }
      X0(_tree_sitter_progress_callback, "_tree_sitter_progress_callback");

      function _tree_sitter_query_progress_callback(A) {
        if (Module.currentQueryProgressCallback) return Module.currentQueryProgressCallback({
          currentOffset: A
        });
        return !1
      }
      X0(_tree_sitter_query_progress_callback, "_tree_sitter_query_progress_callback");
      var runtimeKeepaliveCounter = 0,
        keepRuntimeAlive = X0(() => noExitRuntime || runtimeKeepaliveCounter > 0, "keepRuntimeAlive"),
        _proc_exit = X0((A) => {
          if (EXITSTATUS = A, !keepRuntimeAlive()) Module.onExit?.(A), ABORT = !0;
          quit_(A, new ExitStatus(A))
        }, "_proc_exit");
      _proc_exit.sig = "vi";
      var exitJS = X0((A, Q) => {
          EXITSTATUS = A, _proc_exit(A)
        }, "exitJS"),
        handleException = X0((A) => {
          if (A instanceof ExitStatus || A == "unwind") return EXITSTATUS;
          quit_(1, A)
        }, "handleException"),
        lengthBytesUTF8 = X0((A) => {
          var Q = 0;
          for (var B = 0; B < A.length; ++B) {
            var G = A.charCodeAt(B);
            if (G <= 127) Q++;
            else if (G <= 2047) Q += 2;
            else if (G >= 55296 && G <= 57343) Q += 4, ++B;
            else Q += 3
          }
          return Q
        }, "lengthBytesUTF8"),
        stringToUTF8Array = X0((A, Q, B, G) => {
          if (!(G > 0)) return 0;
          var Z = B,
            I = B + G - 1;
          for (var Y = 0; Y < A.length; ++Y) {
            var J = A.charCodeAt(Y);
            if (J >= 55296 && J <= 57343) {
              var W = A.charCodeAt(++Y);
              J = 65536 + ((J & 1023) << 10) | W & 1023
            }
            if (J <= 127) {
              if (B >= I) break;
              Q[B++] = J
            } else if (J <= 2047) {
              if (B + 1 >= I) break;
              Q[B++] = 192 | J >> 6, Q[B++] = 128 | J & 63
            } else if (J <= 65535) {
              if (B + 2 >= I) break;
              Q[B++] = 224 | J >> 12, Q[B++] = 128 | J >> 6 & 63, Q[B++] = 128 | J & 63
            } else {
              if (B + 3 >= I) break;
              Q[B++] = 240 | J >> 18, Q[B++] = 128 | J >> 12 & 63, Q[B++] = 128 | J >> 6 & 63, Q[B++] = 128 | J & 63
            }
          }
          return Q[B] = 0, B - Z
        }, "stringToUTF8Array"),
        stringToUTF8 = X0((A, Q, B) => stringToUTF8Array(A, HEAPU8, Q, B), "stringToUTF8"),
        stackAlloc = X0((A) => __emscripten_stack_alloc(A), "stackAlloc"),
        stringToUTF8OnStack = X0((A) => {
          var Q = lengthBytesUTF8(A) + 1,
            B = stackAlloc(Q);
          return stringToUTF8(A, B, Q), B
        }, "stringToUTF8OnStack"),
        AsciiToString = X0((A) => {
          var Q = "";
          while (!0) {
            var B = HEAPU8[A++];
            if (!B) return Q;
            Q += String.fromCharCode(B)
          }
        }, "AsciiToString"),
        stringToUTF16 = X0((A, Q, B) => {
          if (B ??= 2147483647, B < 2) return 0;
          B -= 2;
          var G = Q,
            Z = B < A.length * 2 ? B / 2 : A.length;
          for (var I = 0; I < Z; ++I) {
            var Y = A.charCodeAt(I);
            LE_HEAP_STORE_I16((Q >> 1) * 2, Y), Q += 2
          }
          return LE_HEAP_STORE_I16((Q >> 1) * 2, 0), Q - G
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
        var Q = resolveGlobalSymbol("main").sym;
        if (!Q) return;
        A.unshift(thisProgram);
        var B = A.length,
          G = stackAlloc((B + 1) * 4),
          Z = G;
        A.forEach((Y) => {
          LE_HEAP_STORE_U32((Z >> 2) * 4, stringToUTF8OnStack(Y)), Z += 4
        }), LE_HEAP_STORE_U32((Z >> 2) * 4, 0);
        try {
          var I = Q(B, G);
          return exitJS(I, !0), I
        } catch (Y) {
          return handleException(Y)
        }
      }
      X0(callMain, "callMain");

      function run(A = arguments_) {
        if (runDependencies > 0) {
          dependenciesFulfilled = run;
          return
        }
        if (preRun(), runDependencies > 0) {
          dependenciesFulfilled = run;
          return
        }

        function Q() {
          if (Module.calledRun = !0, ABORT) return;
          initRuntime(), preMain(), readyPromiseResolve(Module), Module.onRuntimeInitialized?.();
          var B = Module.noInitialRun;
          if (!B) callMain(A);
          postRun()
        }
        if (X0(Q, "doRun"), Module.setStatus) Module.setStatus("Running..."), setTimeout(() => {
          setTimeout(() => Module.setStatus(""), 1), Q()
        }, 1);
        else Q()
      }
      if (X0(run, "run"), Module.preInit) {
        if (typeof Module.preInit == "function") Module.preInit = [Module.preInit];
        while (Module.preInit.length > 0) Module.preInit.pop()()
      }
      return run(), moduleRtn = readyPromise, moduleRtn
    }
  })(), y15 = k15;
  X0(EA2, "initializeBinding");
  X0(zA2, "checkModule");
  No1 = class {
    static {
      X0(this, "Parser")
    } [0] = 0;
    [1] = 0;
    logCallback = null;
    language = null;
    static async init(A) {
      YA2(await EA2(A)), $2 = V1._ts_init(), Eo1 = V1.getValue($2, "i32"), zo1 = V1.getValue($2 + d2, "i32")
    }
    constructor() {
      this.initialize()
    }
    initialize() {
      if (!zA2()) throw Error("cannot construct a Parser before calling `init()`");
      V1._ts_parser_new_wasm(), this[0] = V1.getValue($2, "i32"), this[1] = V1.getValue($2 + d2, "i32")
    }
    delete() {
      V1._ts_parser_delete(this[0]), V1._free(this[1]), this[0] = 0, this[1] = 0
    }
    setLanguage(A) {
      let Q;
      if (!A) Q = 0, this.language = null;
      else if (A.constructor === qo1) {
        Q = A[0];
        let B = V1._ts_language_version(Q);
        if (B < zo1 || Eo1 < B) throw Error(`Incompatible language version ${B}. Compatibility range ${zo1} through ${Eo1}.`);
        this.language = A
      } else throw Error("Argument must be a Language");
      return V1._ts_parser_set_language(this[0], Q), this
    }
    parse(A, Q, B) {
      if (typeof A === "string") V1.currentParseCallback = (J) => A.slice(J);
      else if (typeof A === "function") V1.currentParseCallback = A;
      else throw Error("Argument must be a string or a function");
      if (B?.progressCallback) V1.currentProgressCallback = B.progressCallback;
      else V1.currentProgressCallback = null;
      if (this.logCallback) V1.currentLogCallback = this.logCallback, V1._ts_parser_enable_logger_wasm(this[0], 1);
      else V1.currentLogCallback = null, V1._ts_parser_enable_logger_wasm(this[0], 0);
      let G = 0,
        Z = 0;
      if (B?.includedRanges) {
        G = B.includedRanges.length, Z = V1._calloc(G, cNA);
        let J = Z;
        for (let W = 0; W < G; W++) JA2(J, B.includedRanges[W]), J += cNA
      }
      let I = V1._ts_parser_parse_wasm(this[0], this[1], Q ? Q[0] : 0, Z, G);
      if (!I) return V1.currentParseCallback = null, V1.currentLogCallback = null, V1.currentProgressCallback = null, null;
      if (!this.language) throw Error("Parser must have a language to parse");
      let Y = new M15(xl, I, this.language, V1.currentParseCallback);
      return V1.currentParseCallback = null, V1.currentLogCallback = null, V1.currentProgressCallback = null, Y
    }
    reset() {
      V1._ts_parser_reset(this[0])
    }
    getIncludedRanges() {
      V1._ts_parser_included_ranges_wasm(this[0]);
      let A = V1.getValue($2, "i32"),
        Q = V1.getValue($2 + d2, "i32"),
        B = Array(A);
      if (A > 0) {
        let G = Q;
        for (let Z = 0; Z < A; Z++) B[Z] = D01(G), G += cNA;
        V1._free(Q)
      }
      return B
    }
    getTimeoutMicros() {
      return V1._ts_parser_timeout_micros(this[0])
    }
    setTimeoutMicros(A) {
      V1._ts_parser_set_timeout_micros(this[0], 0, A)
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
// @from(Start 8486398, End 8486490)
function qA2() {
  return (process.argv[1] || "").includes("/.claude/local/node_modules/")
}
// @from(Start 8486491, End 8487177)
async function x15() {
  try {
    if (!RA().existsSync(vl)) RA().mkdirSync(vl);
    if (!RA().existsSync($A2)) {
      let Q = {
        name: "claude-local",
        version: "0.0.1",
        private: !0
      };
      RA().writeFileSync($A2, JSON.stringify(Q, null, 2), {
        encoding: "utf8",
        flush: !1
      })
    }
    let A = pNA(vl, "claude");
    if (!RA().existsSync(A)) {
      let Q = `#!/bin/bash
exec "${vl}/node_modules/.bin/claude" "$@"`;
      RA().writeFileSync(A, Q, {
        encoding: "utf8",
        flush: !1
      }), await QQ("chmod", ["+x", A])
    }
    return !0
  } catch (A) {
    return AA(A instanceof Error ? A : Error(String(A))), !1
  }
}
// @from(Start 8487178, End 8487980)
async function lNA(A = "latest") {
  try {
    if (!await x15()) return "install_failed";
    let Q = await A3("npm", ["install", `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.PACKAGE_URL}@${A}`], {
      cwd: vl,
      maxBuffer: 1e6
    });
    if (Q.code !== 0) return AA(Error(`Failed to install Claude CLI package: ${Q.stderr}`)), Q.code === 190 ? "in_progress" : "install_failed";
    let B = N1();
    return c0({
      ...B,
      installMethod: "local"
    }), "success"
  } catch (Q) {
    return AA(Q instanceof Error ? Q : Error(String(Q))), "install_failed"
  }
}
// @from(Start 8487982, End 8488067)
function bl() {
  return RA().existsSync(pNA(vl, "node_modules", ".bin", "claude"))
}
// @from(Start 8488069, End 8488262)
function GIA() {
  let A = process.env.SHELL || "";
  if (A.includes("zsh")) return "zsh";
  if (A.includes("bash")) return "bash";
  if (A.includes("fish")) return "fish";
  return "unknown"
}
// @from(Start 8488267, End 8488269)
vl
// @from(Start 8488271, End 8488274)
$A2
// @from(Start 8488276, End 8488279)
wA2
// @from(Start 8488285, End 8488425)
xAA = L(() => {
  _8();
  g1();
  jQ();
  AQ();
  hQ();
  vl = pNA(MQ(), "local"), $A2 = pNA(vl, "package.json"), wA2 = pNA(vl, "claude")
})
// @from(Start 8488505, End 8488686)
function fl() {
  let A = process.env.ZDOTDIR || H01();
  return {
    zsh: Lo1(A, ".zshrc"),
    bash: Lo1(H01(), ".bashrc"),
    fish: Lo1(H01(), ".config/fish/config.fish")
  }
}
// @from(Start 8488688, End 8489058)
function C01(A) {
  let Q = !1;
  return {
    filtered: A.filter((G) => {
      if (NA2.test(G)) {
        let Z = G.match(/alias\s+claude\s*=\s*["']([^"']+)["']/);
        if (!Z) Z = G.match(/alias\s+claude\s*=\s*([^#\n]+)/);
        if (Z && Z[1]) {
          if (Z[1].trim() === wA2) return Q = !0, !1
        }
      }
      return !0
    }),
    hadAlias: Q
  }
}
// @from(Start 8489060, End 8489246)
function iNA(A) {
  let Q = RA();
  try {
    if (!Q.existsSync(A)) return null;
    return Q.readFileSync(A, {
      encoding: "utf8"
    }).split(`
`)
  } catch {
    return null
  }
}
// @from(Start 8489248, End 8489350)
function E01(A, Q) {
  RA().writeFileSync(A, Q.join(`
`), {
    encoding: "utf8",
    flush: !0
  })
}
// @from(Start 8489352, End 8489630)
function Mo1() {
  let A = fl();
  for (let Q of Object.values(A)) {
    let B = iNA(Q);
    if (!B) continue;
    for (let G of B)
      if (NA2.test(G)) {
        let Z = G.match(/alias\s+claude=["']?([^"'\s]+)/);
        if (Z && Z[1]) return Z[1]
      }
  }
  return null
}
// @from(Start 8489632, End 8489911)
function LA2() {
  let A = Mo1();
  if (!A) return null;
  let Q = RA(),
    B = A.startsWith("~") ? A.replace("~", H01()) : A;
  try {
    if (Q.existsSync(B)) {
      let G = Q.statSync(B);
      if (G.isFile() || G.isSymbolicLink()) return A
    }
  } catch {}
  return null
}
// @from(Start 8489916, End 8489919)
NA2
// @from(Start 8489925, End 8489993)
z01 = L(() => {
  AQ();
  xAA();
  NA2 = /^\s*alias\s+claude\s*=/
})
// @from(Start 8490116, End 8491193)
async function OA2() {
  try {
    let A = await ab("tengu_version_config", {
      minVersion: "0.0.0"
    });
    if (A.minVersion && MA2.lt({
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION, A.minVersion)) console.error(`
It looks like your version of Claude Code (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION}) needs an update.
A newer version (${A.minVersion} or higher) is required to continue.

To update, please run:
    claude update

This will ensure you have access to the latest features and improvements.
`), l5(1)
  } catch (A) {
    AA(A)
  }
}
// @from(Start 8491195, End 8491248)
function vAA() {
  return b15(MQ(), ".update.lock")
}
// @from(Start 8491250, End 8491702)
function g15() {
  try {
    if (!RA().existsSync(MQ())) RA().mkdirSync(MQ());
    if (RA().existsSync(vAA())) {
      let A = RA().statSync(vAA());
      if (Date.now() - A.mtimeMs < h15) return !1;
      try {
        RA().unlinkSync(vAA())
      } catch (B) {
        return AA(B), !1
      }
    }
    return RA().writeFileSync(vAA(), `${process.pid}`, {
      encoding: "utf8",
      flush: !1
    }), !0
  } catch (A) {
    return AA(A), !1
  }
}
// @from(Start 8491704, End 8491920)
function u15() {
  try {
    if (RA().existsSync(vAA())) {
      if (RA().readFileSync(vAA(), {
          encoding: "utf8"
        }) === `${process.pid}`) RA().unlinkSync(vAA())
    }
  } catch (A) {
    AA(A)
  }
}
// @from(Start 8491921, End 8492223)
async function m15() {
  let A = d0.isRunningWithBun(),
    Q = null;
  if (A) Q = await QQ("bun", ["pm", "bin", "-g"]);
  else Q = await QQ("npm", ["-g", "config", "get", "prefix"]);
  if (Q.code !== 0) return AA(Error(`Failed to check ${A?"bun":"npm"} permissions`)), null;
  return Q.stdout.trim()
}