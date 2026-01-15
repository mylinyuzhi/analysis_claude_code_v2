
// @from(Ln 359630, Col 4)
Rm2 = w(() => {
  pi5 = Object.defineProperty, Wq0 = 4 * $9, Gw = 5 * $9, Rf = 2 * $9, obA = 2 * $9 + 2 * Rf, Dt = {
    row: 0,
    column: 0
  }, Wt = Symbol("INTERNAL");
  O0(GEA, "assertInternal");
  O0(abA, "isPoint");
  O0(Hm2, "setModule");
  li5 = class {
    static {
      O0(this, "LookaheadIterator")
    } [0] = 0;
    language;
    constructor(A, Q, B) {
      GEA(A), this[0] = Q, this.language = B
    }
    get currentTypeId() {
      return F1._ts_lookahead_iterator_current_symbol(this[0])
    }
    get currentType() {
      return this.language.types[this.currentTypeId] || "ERROR"
    }
    delete() {
      F1._ts_lookahead_iterator_delete(this[0]), this[0] = 0
    }
    reset(A, Q) {
      if (F1._ts_lookahead_iterator_reset(this[0], A[0], Q)) return this.language = A, !0;
      return !1
    }
    resetState(A) {
      return Boolean(F1._ts_lookahead_iterator_reset_state(this[0], A))
    } [Symbol.iterator]() {
      return {
        next: O0(() => {
          if (F1._ts_lookahead_iterator_next(this[0])) return {
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
  O0(Hq0, "getText");
  ii5 = class A {
    static {
      O0(this, "Tree")
    } [0] = 0;
    textCallback;
    language;
    constructor(Q, B, G, Z) {
      GEA(Q), this[0] = B, this.language = G, this.textCallback = Z
    }
    copy() {
      let Q = F1._ts_tree_copy(this[0]);
      return new A(Wt, Q, this.language, this.textCallback)
    }
    delete() {
      F1._ts_tree_delete(this[0]), this[0] = 0
    }
    get rootNode() {
      return F1._ts_tree_root_node_wasm(this[0]), yX(this)
    }
    rootNodeWithOffset(Q, B) {
      let G = s2 + Gw;
      return F1.setValue(G, Q, "i32"), Zj(G + $9, B), F1._ts_tree_root_node_with_offset_wasm(this[0]), yX(this)
    }
    edit(Q) {
      zm2(Q), F1._ts_tree_edit_wasm(this[0])
    }
    walk() {
      return this.rootNode.walk()
    }
    getChangedRanges(Q) {
      if (!(Q instanceof A)) throw TypeError("Argument must be a Tree");
      F1._ts_tree_get_changed_ranges_wasm(this[0], Q[0]);
      let B = F1.getValue(s2, "i32"),
        G = F1.getValue(s2 + $9, "i32"),
        Z = Array(B);
      if (B > 0) {
        let Y = G;
        for (let J = 0; J < B; J++) Z[J] = xK1(Y), Y += obA;
        F1._free(G)
      }
      return Z
    }
    getIncludedRanges() {
      F1._ts_tree_included_ranges_wasm(this[0]);
      let Q = F1.getValue(s2, "i32"),
        B = F1.getValue(s2 + $9, "i32"),
        G = Array(Q);
      if (Q > 0) {
        let Z = B;
        for (let Y = 0; Y < Q; Y++) G[Y] = xK1(Z), Z += obA;
        F1._free(B)
      }
      return G
    }
  }, ni5 = class A {
    static {
      O0(this, "TreeCursor")
    } [0] = 0;
    [1] = 0;
    [2] = 0;
    [3] = 0;
    tree;
    constructor(Q, B) {
      GEA(Q), this.tree = B, gO(this)
    }
    copy() {
      let Q = new A(Wt, this.tree);
      return F1._ts_tree_cursor_copy_wasm(this.tree[0]), gO(Q), Q
    }
    delete() {
      $Y(this), F1._ts_tree_cursor_delete_wasm(this.tree[0]), this[0] = this[1] = this[2] = 0
    }
    get currentNode() {
      return $Y(this), F1._ts_tree_cursor_current_node_wasm(this.tree[0]), yX(this.tree)
    }
    get currentFieldId() {
      return $Y(this), F1._ts_tree_cursor_current_field_id_wasm(this.tree[0])
    }
    get currentFieldName() {
      return this.tree.language.fields[this.currentFieldId]
    }
    get currentDepth() {
      return $Y(this), F1._ts_tree_cursor_current_depth_wasm(this.tree[0])
    }
    get currentDescendantIndex() {
      return $Y(this), F1._ts_tree_cursor_current_descendant_index_wasm(this.tree[0])
    }
    get nodeType() {
      return this.tree.language.types[this.nodeTypeId] || "ERROR"
    }
    get nodeTypeId() {
      return $Y(this), F1._ts_tree_cursor_current_node_type_id_wasm(this.tree[0])
    }
    get nodeStateId() {
      return $Y(this), F1._ts_tree_cursor_current_node_state_id_wasm(this.tree[0])
    }
    get nodeId() {
      return $Y(this), F1._ts_tree_cursor_current_node_id_wasm(this.tree[0])
    }
    get nodeIsNamed() {
      return $Y(this), F1._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]) === 1
    }
    get nodeIsMissing() {
      return $Y(this), F1._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]) === 1
    }
    get nodeText() {
      $Y(this);
      let Q = F1._ts_tree_cursor_start_index_wasm(this.tree[0]),
        B = F1._ts_tree_cursor_end_index_wasm(this.tree[0]);
      F1._ts_tree_cursor_start_position_wasm(this.tree[0]);
      let G = r6A(s2);
      return Hq0(this.tree, Q, B, G)
    }
    get startPosition() {
      return $Y(this), F1._ts_tree_cursor_start_position_wasm(this.tree[0]), r6A(s2)
    }
    get endPosition() {
      return $Y(this), F1._ts_tree_cursor_end_position_wasm(this.tree[0]), r6A(s2)
    }
    get startIndex() {
      return $Y(this), F1._ts_tree_cursor_start_index_wasm(this.tree[0])
    }
    get endIndex() {
      return $Y(this), F1._ts_tree_cursor_end_index_wasm(this.tree[0])
    }
    gotoFirstChild() {
      $Y(this);
      let Q = F1._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
      return gO(this), Q === 1
    }
    gotoLastChild() {
      $Y(this);
      let Q = F1._ts_tree_cursor_goto_last_child_wasm(this.tree[0]);
      return gO(this), Q === 1
    }
    gotoParent() {
      $Y(this);
      let Q = F1._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
      return gO(this), Q === 1
    }
    gotoNextSibling() {
      $Y(this);
      let Q = F1._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
      return gO(this), Q === 1
    }
    gotoPreviousSibling() {
      $Y(this);
      let Q = F1._ts_tree_cursor_goto_previous_sibling_wasm(this.tree[0]);
      return gO(this), Q === 1
    }
    gotoDescendant(Q) {
      $Y(this), F1._ts_tree_cursor_goto_descendant_wasm(this.tree[0], Q), gO(this)
    }
    gotoFirstChildForIndex(Q) {
      $Y(this), F1.setValue(s2 + Wq0, Q, "i32");
      let B = F1._ts_tree_cursor_goto_first_child_for_index_wasm(this.tree[0]);
      return gO(this), B === 1
    }
    gotoFirstChildForPosition(Q) {
      $Y(this), Zj(s2 + Wq0, Q);
      let B = F1._ts_tree_cursor_goto_first_child_for_position_wasm(this.tree[0]);
      return gO(this), B === 1
    }
    reset(Q) {
      O3(Q), $Y(this, s2 + Gw), F1._ts_tree_cursor_reset_wasm(this.tree[0]), gO(this)
    }
    resetTo(Q) {
      $Y(this, s2), $Y(Q, s2 + Wq0), F1._ts_tree_cursor_reset_to_wasm(this.tree[0], Q.tree[0]), gO(this)
    }
  }, ai5 = class {
    static {
      O0(this, "Node")
    } [0] = 0;
    _children;
    _namedChildren;
    constructor(A, {
      id: Q,
      tree: B,
      startIndex: G,
      startPosition: Z,
      other: Y
    }) {
      GEA(A), this[0] = Y, this.id = Q, this.tree = B, this.startIndex = G, this.startPosition = Z
    }
    id;
    startIndex;
    startPosition;
    tree;
    get typeId() {
      return O3(this), F1._ts_node_symbol_wasm(this.tree[0])
    }
    get grammarId() {
      return O3(this), F1._ts_node_grammar_symbol_wasm(this.tree[0])
    }
    get type() {
      return this.tree.language.types[this.typeId] || "ERROR"
    }
    get grammarType() {
      return this.tree.language.types[this.grammarId] || "ERROR"
    }
    get isNamed() {
      return O3(this), F1._ts_node_is_named_wasm(this.tree[0]) === 1
    }
    get isExtra() {
      return O3(this), F1._ts_node_is_extra_wasm(this.tree[0]) === 1
    }
    get isError() {
      return O3(this), F1._ts_node_is_error_wasm(this.tree[0]) === 1
    }
    get isMissing() {
      return O3(this), F1._ts_node_is_missing_wasm(this.tree[0]) === 1
    }
    get hasChanges() {
      return O3(this), F1._ts_node_has_changes_wasm(this.tree[0]) === 1
    }
    get hasError() {
      return O3(this), F1._ts_node_has_error_wasm(this.tree[0]) === 1
    }
    get endIndex() {
      return O3(this), F1._ts_node_end_index_wasm(this.tree[0])
    }
    get endPosition() {
      return O3(this), F1._ts_node_end_point_wasm(this.tree[0]), r6A(s2)
    }
    get text() {
      return Hq0(this.tree, this.startIndex, this.endIndex, this.startPosition)
    }
    get parseState() {
      return O3(this), F1._ts_node_parse_state_wasm(this.tree[0])
    }
    get nextParseState() {
      return O3(this), F1._ts_node_next_parse_state_wasm(this.tree[0])
    }
    equals(A) {
      return this.tree === A.tree && this.id === A.id
    }
    child(A) {
      return O3(this), F1._ts_node_child_wasm(this.tree[0], A), yX(this.tree)
    }
    namedChild(A) {
      return O3(this), F1._ts_node_named_child_wasm(this.tree[0], A), yX(this.tree)
    }
    childForFieldId(A) {
      return O3(this), F1._ts_node_child_by_field_id_wasm(this.tree[0], A), yX(this.tree)
    }
    childForFieldName(A) {
      let Q = this.tree.language.fields.indexOf(A);
      if (Q !== -1) return this.childForFieldId(Q);
      return null
    }
    fieldNameForChild(A) {
      O3(this);
      let Q = F1._ts_node_field_name_for_child_wasm(this.tree[0], A);
      if (!Q) return null;
      return F1.AsciiToString(Q)
    }
    fieldNameForNamedChild(A) {
      O3(this);
      let Q = F1._ts_node_field_name_for_named_child_wasm(this.tree[0], A);
      if (!Q) return null;
      return F1.AsciiToString(Q)
    }
    childrenForFieldName(A) {
      let Q = this.tree.language.fields.indexOf(A);
      if (Q !== -1 && Q !== 0) return this.childrenForFieldId(Q);
      return []
    }
    childrenForFieldId(A) {
      O3(this), F1._ts_node_children_by_field_id_wasm(this.tree[0], A);
      let Q = F1.getValue(s2, "i32"),
        B = F1.getValue(s2 + $9, "i32"),
        G = Array(Q);
      if (Q > 0) {
        let Z = B;
        for (let Y = 0; Y < Q; Y++) G[Y] = yX(this.tree, Z), Z += Gw;
        F1._free(B)
      }
      return G
    }
    firstChildForIndex(A) {
      O3(this);
      let Q = s2 + Gw;
      return F1.setValue(Q, A, "i32"), F1._ts_node_first_child_for_byte_wasm(this.tree[0]), yX(this.tree)
    }
    firstNamedChildForIndex(A) {
      O3(this);
      let Q = s2 + Gw;
      return F1.setValue(Q, A, "i32"), F1._ts_node_first_named_child_for_byte_wasm(this.tree[0]), yX(this.tree)
    }
    get childCount() {
      return O3(this), F1._ts_node_child_count_wasm(this.tree[0])
    }
    get namedChildCount() {
      return O3(this), F1._ts_node_named_child_count_wasm(this.tree[0])
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
        O3(this), F1._ts_node_children_wasm(this.tree[0]);
        let A = F1.getValue(s2, "i32"),
          Q = F1.getValue(s2 + $9, "i32");
        if (this._children = Array(A), A > 0) {
          let B = Q;
          for (let G = 0; G < A; G++) this._children[G] = yX(this.tree, B), B += Gw;
          F1._free(Q)
        }
      }
      return this._children
    }
    get namedChildren() {
      if (!this._namedChildren) {
        O3(this), F1._ts_node_named_children_wasm(this.tree[0]);
        let A = F1.getValue(s2, "i32"),
          Q = F1.getValue(s2 + $9, "i32");
        if (this._namedChildren = Array(A), A > 0) {
          let B = Q;
          for (let G = 0; G < A; G++) this._namedChildren[G] = yX(this.tree, B), B += Gw;
          F1._free(Q)
        }
      }
      return this._namedChildren
    }
    descendantsOfType(A, Q = Dt, B = Dt) {
      if (!Array.isArray(A)) A = [A];
      let G = [],
        Z = this.tree.language.types;
      for (let D of A)
        if (D == "ERROR") G.push(65535);
      for (let D = 0, W = Z.length; D < W; D++)
        if (A.includes(Z[D])) G.push(D);
      let Y = F1._malloc($9 * G.length);
      for (let D = 0, W = G.length; D < W; D++) F1.setValue(Y + D * $9, G[D], "i32");
      O3(this), F1._ts_node_descendants_of_type_wasm(this.tree[0], Y, G.length, Q.row, Q.column, B.row, B.column);
      let J = F1.getValue(s2, "i32"),
        X = F1.getValue(s2 + $9, "i32"),
        I = Array(J);
      if (J > 0) {
        let D = X;
        for (let W = 0; W < J; W++) I[W] = yX(this.tree, D), D += Gw
      }
      return F1._free(X), F1._free(Y), I
    }
    get nextSibling() {
      return O3(this), F1._ts_node_next_sibling_wasm(this.tree[0]), yX(this.tree)
    }
    get previousSibling() {
      return O3(this), F1._ts_node_prev_sibling_wasm(this.tree[0]), yX(this.tree)
    }
    get nextNamedSibling() {
      return O3(this), F1._ts_node_next_named_sibling_wasm(this.tree[0]), yX(this.tree)
    }
    get previousNamedSibling() {
      return O3(this), F1._ts_node_prev_named_sibling_wasm(this.tree[0]), yX(this.tree)
    }
    get descendantCount() {
      return O3(this), F1._ts_node_descendant_count_wasm(this.tree[0])
    }
    get parent() {
      return O3(this), F1._ts_node_parent_wasm(this.tree[0]), yX(this.tree)
    }
    childWithDescendant(A) {
      return O3(this), O3(A, 1), F1._ts_node_child_with_descendant_wasm(this.tree[0]), yX(this.tree)
    }
    descendantForIndex(A, Q = A) {
      if (typeof A !== "number" || typeof Q !== "number") throw Error("Arguments must be numbers");
      O3(this);
      let B = s2 + Gw;
      return F1.setValue(B, A, "i32"), F1.setValue(B + $9, Q, "i32"), F1._ts_node_descendant_for_index_wasm(this.tree[0]), yX(this.tree)
    }
    namedDescendantForIndex(A, Q = A) {
      if (typeof A !== "number" || typeof Q !== "number") throw Error("Arguments must be numbers");
      O3(this);
      let B = s2 + Gw;
      return F1.setValue(B, A, "i32"), F1.setValue(B + $9, Q, "i32"), F1._ts_node_named_descendant_for_index_wasm(this.tree[0]), yX(this.tree)
    }
    descendantForPosition(A, Q = A) {
      if (!abA(A) || !abA(Q)) throw Error("Arguments must be {row, column} objects");
      O3(this);
      let B = s2 + Gw;
      return Zj(B, A), Zj(B + Rf, Q), F1._ts_node_descendant_for_position_wasm(this.tree[0]), yX(this.tree)
    }
    namedDescendantForPosition(A, Q = A) {
      if (!abA(A) || !abA(Q)) throw Error("Arguments must be {row, column} objects");
      O3(this);
      let B = s2 + Gw;
      return Zj(B, A), Zj(B + Rf, Q), F1._ts_node_named_descendant_for_position_wasm(this.tree[0]), yX(this.tree)
    }
    walk() {
      return O3(this), F1._ts_tree_cursor_new_wasm(this.tree[0]), new ni5(Wt, this.tree)
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
      O3(this);
      let A = F1._ts_node_to_string_wasm(this.tree[0]),
        Q = F1.AsciiToString(A);
      return F1._free(A), Q
    }
  };
  O0(Fq0, "unmarshalCaptures");
  O0(O3, "marshalNode");
  O0(yX, "unmarshalNode");
  O0($Y, "marshalTreeCursor");
  O0(gO, "unmarshalTreeCursor");
  O0(Zj, "marshalPoint");
  O0(r6A, "unmarshalPoint");
  O0(Em2, "marshalRange");
  O0(xK1, "unmarshalRange");
  O0(zm2, "marshalEdit");
  O0($m2, "unmarshalLanguageMetadata");
  si5 = /[\w-]+/g, A7Y = {
    Zero: 0,
    ZeroOrOne: 1,
    ZeroOrMore: 2,
    One: 3,
    OneOrMore: 4
  }, Fm2 = O0((A) => A.type === "capture", "isCaptureStep"), Eq0 = O0((A) => A.type === "string", "isStringStep"), Fx = {
    Syntax: 1,
    NodeName: 2,
    FieldName: 3,
    CaptureName: 4,
    PatternStructure: 5
  }, nbA = class A extends Error {
    constructor(Q, B, G, Z) {
      super(A.formatMessage(Q, B));
      this.kind = Q, this.info = B, this.index = G, this.length = Z, this.name = "QueryError"
    }
    static {
      O0(this, "QueryError")
    }
    static formatMessage(Q, B) {
      switch (Q) {
        case Fx.NodeName:
          return `Bad node name '${B.word}'`;
        case Fx.FieldName:
          return `Bad field name '${B.word}'`;
        case Fx.CaptureName:
          return `Bad capture name @${B.word}`;
        case Fx.PatternStructure:
          return `Bad pattern structure at offset ${B.suffix}`;
        case Fx.Syntax:
          return `Bad syntax at offset ${B.suffix}`
      }
    }
  };
  O0(Cm2, "parseAnyPredicate");
  O0(Um2, "parseMatchPredicate");
  O0(qm2, "parseAnyOfPredicate");
  O0(Nm2, "parseIsPredicate");
  O0(wm2, "parseSetDirective");
  O0(Lm2, "parsePattern");
  ti5 = class {
    static {
      O0(this, "Query")
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
      let B = F1.lengthBytesUTF8(Q),
        G = F1._malloc(B + 1);
      F1.stringToUTF8(Q, G, B + 1);
      let Z = F1._ts_query_new(A[0], G, B, s2, s2 + $9);
      if (!Z) {
        let z = F1.getValue(s2 + $9, "i32"),
          $ = F1.getValue(s2, "i32"),
          O = F1.UTF8ToString(G, $).length,
          L = Q.slice(O, O + 100).split(`
`)[0],
          M = L.match(si5)?.[0] ?? "";
        switch (F1._free(G), z) {
          case Fx.Syntax:
            throw new nbA(Fx.Syntax, {
              suffix: `${O}: '${L}'...`
            }, O, 0);
          case Fx.NodeName:
            throw new nbA(z, {
              word: M
            }, O, M.length);
          case Fx.FieldName:
            throw new nbA(z, {
              word: M
            }, O, M.length);
          case Fx.CaptureName:
            throw new nbA(z, {
              word: M
            }, O, M.length);
          case Fx.PatternStructure:
            throw new nbA(z, {
              suffix: `${O}: '${L}'...`
            }, O, 0)
        }
      }
      let Y = F1._ts_query_string_count(Z),
        J = F1._ts_query_capture_count(Z),
        X = F1._ts_query_pattern_count(Z),
        I = Array(J),
        D = Array(X),
        W = Array(Y);
      for (let z = 0; z < J; z++) {
        let $ = F1._ts_query_capture_name_for_id(Z, z, s2),
          O = F1.getValue(s2, "i32");
        I[z] = F1.UTF8ToString($, O)
      }
      for (let z = 0; z < X; z++) {
        let $ = Array(J);
        for (let O = 0; O < J; O++) {
          let L = F1._ts_query_capture_quantifier_for_id(Z, z, O);
          $[O] = L
        }
        D[z] = $
      }
      for (let z = 0; z < Y; z++) {
        let $ = F1._ts_query_string_value_for_id(Z, z, s2),
          O = F1.getValue(s2, "i32");
        W[z] = F1.UTF8ToString($, O)
      }
      let K = Array(X),
        V = Array(X),
        F = Array(X),
        H = Array(X),
        E = Array(X);
      for (let z = 0; z < X; z++) {
        let $ = F1._ts_query_predicates_for_pattern(Z, z, s2),
          O = F1.getValue(s2, "i32");
        H[z] = [], E[z] = [];
        let L = [],
          M = $;
        for (let _ = 0; _ < O; _++) {
          let j = F1.getValue(M, "i32");
          M += $9;
          let x = F1.getValue(M, "i32");
          M += $9, Lm2(z, j, x, I, W, L, E, H, K, V, F)
        }
        Object.freeze(E[z]), Object.freeze(H[z]), Object.freeze(K[z]), Object.freeze(V[z]), Object.freeze(F[z])
      }
      F1._free(G), this[0] = Z, this.captureNames = I, this.captureQuantifiers = D, this.textPredicates = E, this.predicates = H, this.setProperties = K, this.assertedProperties = V, this.refutedProperties = F, this.exceededMatchLimit = !1
    }
    delete() {
      F1._ts_query_delete(this[0]), this[0] = 0
    }
    matches(A, Q = {}) {
      let B = Q.startPosition ?? Dt,
        G = Q.endPosition ?? Dt,
        Z = Q.startIndex ?? 0,
        Y = Q.endIndex ?? 0,
        J = Q.matchLimit ?? 4294967295,
        X = Q.maxStartDepth ?? 4294967295,
        I = Q.timeoutMicros ?? 0,
        D = Q.progressCallback;
      if (typeof J !== "number") throw Error("Arguments must be numbers");
      if (this.matchLimit = J, Y !== 0 && Z > Y) throw Error("`startIndex` cannot be greater than `endIndex`");
      if (G !== Dt && (B.row > G.row || B.row === G.row && B.column > G.column)) throw Error("`startPosition` cannot be greater than `endPosition`");
      if (D) F1.currentQueryProgressCallback = D;
      O3(A), F1._ts_query_matches_wasm(this[0], A.tree[0], B.row, B.column, G.row, G.column, Z, Y, J, X, I);
      let W = F1.getValue(s2, "i32"),
        K = F1.getValue(s2 + $9, "i32"),
        V = F1.getValue(s2 + 2 * $9, "i32"),
        F = Array(W);
      this.exceededMatchLimit = Boolean(V);
      let H = 0,
        E = K;
      for (let z = 0; z < W; z++) {
        let $ = F1.getValue(E, "i32");
        E += $9;
        let O = F1.getValue(E, "i32");
        E += $9;
        let L = Array(O);
        if (E = Fq0(this, A.tree, E, $, L), this.textPredicates[$].every((M) => M(L))) {
          F[H] = {
            pattern: $,
            patternIndex: $,
            captures: L
          };
          let M = this.setProperties[$];
          F[H].setProperties = M;
          let _ = this.assertedProperties[$];
          F[H].assertedProperties = _;
          let j = this.refutedProperties[$];
          F[H].refutedProperties = j, H++
        }
      }
      return F.length = H, F1._free(K), F1.currentQueryProgressCallback = null, F
    }
    captures(A, Q = {}) {
      let B = Q.startPosition ?? Dt,
        G = Q.endPosition ?? Dt,
        Z = Q.startIndex ?? 0,
        Y = Q.endIndex ?? 0,
        J = Q.matchLimit ?? 4294967295,
        X = Q.maxStartDepth ?? 4294967295,
        I = Q.timeoutMicros ?? 0,
        D = Q.progressCallback;
      if (typeof J !== "number") throw Error("Arguments must be numbers");
      if (this.matchLimit = J, Y !== 0 && Z > Y) throw Error("`startIndex` cannot be greater than `endIndex`");
      if (G !== Dt && (B.row > G.row || B.row === G.row && B.column > G.column)) throw Error("`startPosition` cannot be greater than `endPosition`");
      if (D) F1.currentQueryProgressCallback = D;
      O3(A), F1._ts_query_captures_wasm(this[0], A.tree[0], B.row, B.column, G.row, G.column, Z, Y, J, X, I);
      let W = F1.getValue(s2, "i32"),
        K = F1.getValue(s2 + $9, "i32"),
        V = F1.getValue(s2 + 2 * $9, "i32"),
        F = [];
      this.exceededMatchLimit = Boolean(V);
      let H = [],
        E = K;
      for (let z = 0; z < W; z++) {
        let $ = F1.getValue(E, "i32");
        E += $9;
        let O = F1.getValue(E, "i32");
        E += $9;
        let L = F1.getValue(E, "i32");
        if (E += $9, H.length = O, E = Fq0(this, A.tree, E, $, H), this.textPredicates[$].every((M) => M(H))) {
          let M = H[L],
            _ = this.setProperties[$];
          M.setProperties = _;
          let j = this.assertedProperties[$];
          M.assertedProperties = j;
          let x = this.refutedProperties[$];
          M.refutedProperties = x, F.push(M)
        }
      }
      return F1._free(K), F1.currentQueryProgressCallback = null, F
    }
    predicatesForPattern(A) {
      return this.predicates[A]
    }
    disableCapture(A) {
      let Q = F1.lengthBytesUTF8(A),
        B = F1._malloc(Q + 1);
      F1.stringToUTF8(A, B, Q + 1), F1._ts_query_disable_capture(this[0], B, Q), F1._free(B)
    }
    disablePattern(A) {
      if (A >= this.predicates.length) throw Error(`Pattern index is ${A} but the pattern count is ${this.predicates.length}`);
      F1._ts_query_disable_pattern(this[0], A)
    }
    didExceedMatchLimit() {
      return this.exceededMatchLimit
    }
    startIndexForPattern(A) {
      if (A >= this.predicates.length) throw Error(`Pattern index is ${A} but the pattern count is ${this.predicates.length}`);
      return F1._ts_query_start_byte_for_pattern(this[0], A)
    }
    endIndexForPattern(A) {
      if (A >= this.predicates.length) throw Error(`Pattern index is ${A} but the pattern count is ${this.predicates.length}`);
      return F1._ts_query_end_byte_for_pattern(this[0], A)
    }
    patternCount() {
      return F1._ts_query_pattern_count(this[0])
    }
    captureIndexForName(A) {
      return this.captureNames.indexOf(A)
    }
    isPatternRooted(A) {
      return F1._ts_query_is_pattern_rooted(this[0], A) === 1
    }
    isPatternNonLocal(A) {
      return F1._ts_query_is_pattern_non_local(this[0], A) === 1
    }
    isPatternGuaranteedAtStep(A) {
      return F1._ts_query_is_pattern_guaranteed_at_step(this[0], A) === 1
    }
  }, ei5 = /^tree_sitter_\w+$/, yK1 = class A {
    static {
      O0(this, "Language")
    } [0] = 0;
    types;
    fields;
    constructor(Q, B) {
      GEA(Q), this[0] = B, this.types = Array(F1._ts_language_symbol_count(this[0]));
      for (let G = 0, Z = this.types.length; G < Z; G++)
        if (F1._ts_language_symbol_type(this[0], G) < 2) this.types[G] = F1.UTF8ToString(F1._ts_language_symbol_name(this[0], G));
      this.fields = Array(F1._ts_language_field_count(this[0]) + 1);
      for (let G = 0, Z = this.fields.length; G < Z; G++) {
        let Y = F1._ts_language_field_name_for_id(this[0], G);
        if (Y !== 0) this.fields[G] = F1.UTF8ToString(Y);
        else this.fields[G] = null
      }
    }
    get name() {
      let Q = F1._ts_language_name(this[0]);
      if (Q === 0) return null;
      return F1.UTF8ToString(Q)
    }
    get version() {
      return F1._ts_language_version(this[0])
    }
    get abiVersion() {
      return F1._ts_language_abi_version(this[0])
    }
    get metadata() {
      F1._ts_language_metadata(this[0]);
      let Q = F1.getValue(s2, "i32"),
        B = F1.getValue(s2 + $9, "i32");
      if (Q === 0) return null;
      return $m2(B)
    }
    get fieldCount() {
      return this.fields.length - 1
    }
    get stateCount() {
      return F1._ts_language_state_count(this[0])
    }
    fieldIdForName(Q) {
      let B = this.fields.indexOf(Q);
      return B !== -1 ? B : null
    }
    fieldNameForId(Q) {
      return this.fields[Q] ?? null
    }
    idForNodeType(Q, B) {
      let G = F1.lengthBytesUTF8(Q),
        Z = F1._malloc(G + 1);
      F1.stringToUTF8(Q, Z, G + 1);
      let Y = F1._ts_language_symbol_for_name(this[0], Z, G, B ? 1 : 0);
      return F1._free(Z), Y || null
    }
    get nodeTypeCount() {
      return F1._ts_language_symbol_count(this[0])
    }
    nodeTypeForId(Q) {
      let B = F1._ts_language_symbol_name(this[0], Q);
      return B ? F1.UTF8ToString(B) : null
    }
    nodeTypeIsNamed(Q) {
      return F1._ts_language_type_is_named_wasm(this[0], Q) ? !0 : !1
    }
    nodeTypeIsVisible(Q) {
      return F1._ts_language_type_is_visible_wasm(this[0], Q) ? !0 : !1
    }
    get supertypes() {
      F1._ts_language_supertypes_wasm(this[0]);
      let Q = F1.getValue(s2, "i32"),
        B = F1.getValue(s2 + $9, "i32"),
        G = Array(Q);
      if (Q > 0) {
        let Z = B;
        for (let Y = 0; Y < Q; Y++) G[Y] = F1.getValue(Z, "i16"), Z += Vm2
      }
      return G
    }
    subtypes(Q) {
      F1._ts_language_subtypes_wasm(this[0], Q);
      let B = F1.getValue(s2, "i32"),
        G = F1.getValue(s2 + $9, "i32"),
        Z = Array(B);
      if (B > 0) {
        let Y = G;
        for (let J = 0; J < B; J++) Z[J] = F1.getValue(Y, "i16"), Y += Vm2
      }
      return Z
    }
    nextState(Q, B) {
      return F1._ts_language_next_state(this[0], Q, B)
    }
    lookaheadIterator(Q) {
      let B = F1._ts_lookahead_iterator_new(this[0], Q);
      if (B) return new li5(Wt, B, this);
      return null
    }
    query(Q) {
      return console.warn("Language.query is deprecated. Use new Query(language, source) instead."), new ti5(this, Q)
    }
    static async load(Q) {
      let B;
      if (Q instanceof Uint8Array) B = Promise.resolve(Q);
      else if (globalThis.process?.versions.node) B = (await import("fs/promises")).readFile(Q);
      else B = fetch(Q).then((X) => X.arrayBuffer().then((I) => {
        if (X.ok) return new Uint8Array(I);
        else {
          let D = new TextDecoder("utf-8").decode(I);
          throw Error(`Language.load failed with status ${X.status}.

${D}`)
        }
      }));
      let G = await F1.loadWebAssemblyModule(await B, {
          loadAsync: !0
        }),
        Z = Object.keys(G),
        Y = Z.find((X) => ei5.test(X) && !X.includes("external_scanner_"));
      if (!Y) throw console.log(`Couldn't find language function in WASM file. Symbols:
${JSON.stringify(Z,null,2)}`), Error("Language.load failed: no language function found in WASM file");
      let J = G[Y]();
      return new A(Wt, J)
    }
  }, An5 = (() => {
    var _scriptName = import.meta.url;
    return async function (moduleArg = {}) {
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
        quit_ = O0((A, Q) => {
          throw Q
        }, "quit_"),
        scriptDirectory = "";

      function locateFile(A) {
        if (Module.locateFile) return Module.locateFile(A, scriptDirectory);
        return scriptDirectory + A
      }
      O0(locateFile, "locateFile");
      var readAsync, readBinary;
      if (ENVIRONMENT_IS_NODE) {
        var fs = require("fs"),
          nodePath = require("path");
        if (!import.meta.url.startsWith("data:")) scriptDirectory = nodePath.dirname(require("url").fileURLToPath(import.meta.url)) + "/";
        if (readBinary = O0((A) => {
            A = isFileURI(A) ? new URL(A) : A;
            var Q = fs.readFileSync(A);
            return Q
          }, "readBinary"), readAsync = O0(async (A, Q = !0) => {
            A = isFileURI(A) ? new URL(A) : A;
            var B = fs.readFileSync(A, Q ? void 0 : "utf8");
            return B
          }, "readAsync"), !Module.thisProgram && process.argv.length > 1) thisProgram = process.argv[1].replace(/\\/g, "/");
        arguments_ = process.argv.slice(2), quit_ = O0((A, Q) => {
          throw process.exitCode = A, Q
        }, "quit_")
      } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) scriptDirectory = self.location.href;
        else if (typeof document < "u" && document.currentScript) scriptDirectory = document.currentScript.src;
        if (_scriptName) scriptDirectory = _scriptName;
        if (scriptDirectory.startsWith("blob:")) scriptDirectory = "";
        else scriptDirectory = scriptDirectory.slice(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
        {
          if (ENVIRONMENT_IS_WORKER) readBinary = O0((A) => {
            var Q = new XMLHttpRequest;
            return Q.open("GET", A, !1), Q.responseType = "arraybuffer", Q.send(null), new Uint8Array(Q.response)
          }, "readBinary");
          readAsync = O0(async (A) => {
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
      O0(assert, "assert");
      var HEAP, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPU64, HEAPF64, HEAP_DATA_VIEW, runtimeInitialized = !1,
        isFileURI = O0((A) => A.startsWith("file://"), "isFileURI");

      function updateMemoryViews() {
        var A = wasmMemory.buffer;
        Module.HEAP_DATA_VIEW = HEAP_DATA_VIEW = new DataView(A), Module.HEAP8 = HEAP8 = new Int8Array(A), Module.HEAP16 = HEAP16 = new Int16Array(A), Module.HEAPU8 = HEAPU8 = new Uint8Array(A), Module.HEAPU16 = HEAPU16 = new Uint16Array(A), Module.HEAP32 = HEAP32 = new Int32Array(A), Module.HEAPU32 = HEAPU32 = new Uint32Array(A), Module.HEAPF32 = HEAPF32 = new Float32Array(A), Module.HEAPF64 = HEAPF64 = new Float64Array(A), Module.HEAP64 = HEAP64 = new BigInt64Array(A), Module.HEAPU64 = HEAPU64 = new BigUint64Array(A)
      }
      if (O0(updateMemoryViews, "updateMemoryViews"), Module.wasmMemory) wasmMemory = Module.wasmMemory;
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
      O0(preRun, "preRun");

      function initRuntime() {
        runtimeInitialized = !0, callRuntimeCallbacks(__RELOC_FUNCS__), wasmExports.__wasm_call_ctors(), callRuntimeCallbacks(onPostCtors)
      }
      O0(initRuntime, "initRuntime");

      function preMain() {}
      O0(preMain, "preMain");

      function postRun() {
        if (Module.postRun) {
          if (typeof Module.postRun == "function") Module.postRun = [Module.postRun];
          while (Module.postRun.length) addOnPostRun(Module.postRun.shift())
        }
        callRuntimeCallbacks(onPostRuns)
      }
      O0(postRun, "postRun");
      var runDependencies = 0,
        dependenciesFulfilled = null;

      function getUniqueRunDependency(A) {
        return A
      }
      O0(getUniqueRunDependency, "getUniqueRunDependency");

      function addRunDependency(A) {
        runDependencies++, Module.monitorRunDependencies?.(runDependencies)
      }
      O0(addRunDependency, "addRunDependency");

      function removeRunDependency(A) {
        if (runDependencies--, Module.monitorRunDependencies?.(runDependencies), runDependencies == 0) {
          if (dependenciesFulfilled) {
            var Q = dependenciesFulfilled;
            dependenciesFulfilled = null, Q()
          }
        }
      }
      O0(removeRunDependency, "removeRunDependency");

      function abort(A) {
        Module.onAbort?.(A), A = "Aborted(" + A + ")", err(A), ABORT = !0, A += ". Build with -sASSERTIONS for more info.";
        var Q = new WebAssembly.RuntimeError(A);
        throw readyPromiseReject(Q), Q
      }
      O0(abort, "abort");
      var wasmBinaryFile;

      function findWasmBinary() {
        if (Module.locateFile) return locateFile("tree-sitter.wasm");
        return new URL("tree-sitter.wasm", import.meta.url).href
      }
      O0(findWasmBinary, "findWasmBinary");

      function getBinarySync(A) {
        if (A == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
        if (readBinary) return readBinary(A);
        throw "both async and sync fetching of the wasm failed"
      }
      O0(getBinarySync, "getBinarySync");
      async function getWasmBinary(A) {
        if (!wasmBinary) try {
          var Q = await readAsync(A);
          return new Uint8Array(Q)
        } catch {}
        return getBinarySync(A)
      }
      O0(getWasmBinary, "getWasmBinary");
      async function instantiateArrayBuffer(A, Q) {
        try {
          var B = await getWasmBinary(A),
            G = await WebAssembly.instantiate(B, Q);
          return G
        } catch (Z) {
          err(`failed to asynchronously prepare wasm: ${Z}`), abort(Z)
        }
      }
      O0(instantiateArrayBuffer, "instantiateArrayBuffer");
      async function instantiateAsync(A, Q, B) {
        if (!A && typeof WebAssembly.instantiateStreaming == "function" && !isFileURI(Q) && !ENVIRONMENT_IS_NODE) try {
          var G = fetch(Q, {
              credentials: "same-origin"
            }),
            Z = await WebAssembly.instantiateStreaming(G, B);
          return Z
        } catch (Y) {
          err(`wasm streaming compile failed: ${Y}`), err("falling back to ArrayBuffer instantiation")
        }
        return instantiateArrayBuffer(Q, B)
      }
      O0(instantiateAsync, "instantiateAsync");

      function getWasmImports() {
        return {
          env: wasmImports,
          wasi_snapshot_preview1: wasmImports,
          "GOT.mem": new Proxy(wasmImports, GOTHandler),
          "GOT.func": new Proxy(wasmImports, GOTHandler)
        }
      }
      O0(getWasmImports, "getWasmImports");
      async function createWasm() {
        function A(Y, J) {
          wasmExports = Y.exports, wasmExports = relocateExports(wasmExports, 1024);
          var X = getDylinkMetadata(J);
          if (X.neededDynlibs) dynamicLibraries = X.neededDynlibs.concat(dynamicLibraries);
          return mergeLibSymbols(wasmExports, "main"), LDSO.init(), loadDylibs(), __RELOC_FUNCS__.push(wasmExports.__wasm_apply_data_relocs), removeRunDependency("wasm-instantiate"), wasmExports
        }
        O0(A, "receiveInstance"), addRunDependency("wasm-instantiate");

        function Q(Y) {
          return A(Y.instance, Y.module)
        }
        O0(Q, "receiveInstantiationResult");
        var B = getWasmImports();
        if (Module.instantiateWasm) return new Promise((Y, J) => {
          Module.instantiateWasm(B, (X, I) => {
            A(X, I), Y(X.exports)
          })
        });
        wasmBinaryFile ??= findWasmBinary();
        try {
          var G = await instantiateAsync(wasmBinary, wasmBinaryFile, B),
            Z = Q(G);
          return Z
        } catch (Y) {
          return readyPromiseReject(Y), Promise.reject(Y)
        }
      }
      O0(createWasm, "createWasm");
      var ASM_CONSTS = {};
      class ExitStatus {
        static {
          O0(this, "ExitStatus")
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
        LE_HEAP_LOAD_F32 = O0((A) => HEAP_DATA_VIEW.getFloat32(A, !0), "LE_HEAP_LOAD_F32"),
        LE_HEAP_LOAD_F64 = O0((A) => HEAP_DATA_VIEW.getFloat64(A, !0), "LE_HEAP_LOAD_F64"),
        LE_HEAP_LOAD_I16 = O0((A) => HEAP_DATA_VIEW.getInt16(A, !0), "LE_HEAP_LOAD_I16"),
        LE_HEAP_LOAD_I32 = O0((A) => HEAP_DATA_VIEW.getInt32(A, !0), "LE_HEAP_LOAD_I32"),
        LE_HEAP_LOAD_U16 = O0((A) => HEAP_DATA_VIEW.getUint16(A, !0), "LE_HEAP_LOAD_U16"),
        LE_HEAP_LOAD_U32 = O0((A) => HEAP_DATA_VIEW.getUint32(A, !0), "LE_HEAP_LOAD_U32"),
        LE_HEAP_STORE_F32 = O0((A, Q) => HEAP_DATA_VIEW.setFloat32(A, Q, !0), "LE_HEAP_STORE_F32"),
        LE_HEAP_STORE_F64 = O0((A, Q) => HEAP_DATA_VIEW.setFloat64(A, Q, !0), "LE_HEAP_STORE_F64"),
        LE_HEAP_STORE_I16 = O0((A, Q) => HEAP_DATA_VIEW.setInt16(A, Q, !0), "LE_HEAP_STORE_I16"),
        LE_HEAP_STORE_I32 = O0((A, Q) => HEAP_DATA_VIEW.setInt32(A, Q, !0), "LE_HEAP_STORE_I32"),
        LE_HEAP_STORE_U16 = O0((A, Q) => HEAP_DATA_VIEW.setUint16(A, Q, !0), "LE_HEAP_STORE_U16"),
        LE_HEAP_STORE_U32 = O0((A, Q) => HEAP_DATA_VIEW.setUint32(A, Q, !0), "LE_HEAP_STORE_U32"),
        callRuntimeCallbacks = O0((A) => {
          while (A.length > 0) A.shift()(Module)
        }, "callRuntimeCallbacks"),
        onPostRuns = [],
        addOnPostRun = O0((A) => onPostRuns.unshift(A), "addOnPostRun"),
        onPreRuns = [],
        addOnPreRun = O0((A) => onPreRuns.unshift(A), "addOnPreRun"),
        UTF8Decoder = typeof TextDecoder < "u" ? new TextDecoder : void 0,
        UTF8ArrayToString = O0((A, Q = 0, B = NaN) => {
          var G = Q + B,
            Z = Q;
          while (A[Z] && !(Z >= G)) ++Z;
          if (Z - Q > 16 && A.buffer && UTF8Decoder) return UTF8Decoder.decode(A.subarray(Q, Z));
          var Y = "";
          while (Q < Z) {
            var J = A[Q++];
            if (!(J & 128)) {
              Y += String.fromCharCode(J);
              continue
            }
            var X = A[Q++] & 63;
            if ((J & 224) == 192) {
              Y += String.fromCharCode((J & 31) << 6 | X);
              continue
            }
            var I = A[Q++] & 63;
            if ((J & 240) == 224) J = (J & 15) << 12 | X << 6 | I;
            else J = (J & 7) << 18 | X << 12 | I << 6 | A[Q++] & 63;
            if (J < 65536) Y += String.fromCharCode(J);
            else {
              var D = J - 65536;
              Y += String.fromCharCode(55296 | D >> 10, 56320 | D & 1023)
            }
          }
          return Y
        }, "UTF8ArrayToString"),
        getDylinkMetadata = O0((A) => {
          var Q = 0,
            B = 0;

          function G() {
            return A[Q++]
          }
          O0(G, "getU8");

          function Z() {
            var n = 0,
              y = 1;
            while (!0) {
              var p = A[Q++];
              if (n += (p & 127) * y, y *= 128, !(p & 128)) break
            }
            return n
          }
          O0(Z, "getLEB");

          function Y() {
            var n = Z();
            return Q += n, UTF8ArrayToString(A, Q - n, n)
          }
          O0(Y, "getString");

          function J(n, y) {
            if (n) throw Error(y)
          }
          O0(J, "failIf");
          var X = "dylink.0";
          if (A instanceof WebAssembly.Module) {
            var I = WebAssembly.Module.customSections(A, X);
            if (I.length === 0) X = "dylink", I = WebAssembly.Module.customSections(A, X);
            J(I.length === 0, "need dylink section"), A = new Uint8Array(I[0]), B = A.length
          } else {
            var D = new Uint32Array(new Uint8Array(A.subarray(0, 24)).buffer),
              W = D[0] == 1836278016 || D[0] == 6386541;
            J(!W, "need to see wasm magic number"), J(A[8] !== 0, "need the dylink section to be first"), Q = 9;
            var K = Z();
            B = Q + K, X = Y()
          }
          var V = {
            neededDynlibs: [],
            tlsExports: new Set,
            weakImports: new Set
          };
          if (X == "dylink") {
            V.memorySize = Z(), V.memoryAlign = Z(), V.tableSize = Z(), V.tableAlign = Z();
            var F = Z();
            for (var H = 0; H < F; ++H) {
              var E = Y();
              V.neededDynlibs.push(E)
            }
          } else {
            J(X !== "dylink.0");
            var z = 1,
              $ = 2,
              O = 3,
              L = 4,
              M = 256,
              _ = 3,
              j = 1;
            while (Q < B) {
              var x = G(),
                b = Z();
              if (x === z) V.memorySize = Z(), V.memoryAlign = Z(), V.tableSize = Z(), V.tableAlign = Z();
              else if (x === $) {
                var F = Z();
                for (var H = 0; H < F; ++H) E = Y(), V.neededDynlibs.push(E)
              } else if (x === O) {
                var S = Z();
                while (S--) {
                  var u = Y(),
                    f = Z();
                  if (f & M) V.tlsExports.add(u)
                }
              } else if (x === L) {
                var S = Z();
                while (S--) {
                  var AA = Y(),
                    u = Y(),
                    f = Z();
                  if ((f & _) == j) V.weakImports.add(u)
                }
              } else Q += b
            }
          }
          return V
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
      O0(getValue, "getValue");
      var newDSO = O0((A, Q, B) => {
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
        alignMemory = O0((A, Q) => Math.ceil(A / Q) * Q, "alignMemory"),
        getMemory = O0((A) => {
          if (runtimeInitialized) return _calloc(A, 1);
          var Q = ___heap_base,
            B = Q + alignMemory(A, 16);
          return ___heap_base = B, GOT.__heap_base.value = B, Q
        }, "getMemory"),
        isInternalSym = O0((A) => ["__cpp_exception", "__c_longjmp", "__wasm_apply_data_relocs", "__dso_handle", "__tls_size", "__tls_align", "__set_stack_limits", "_emscripten_tls_init", "__wasm_init_tls", "__wasm_call_ctors", "__start_em_asm", "__stop_em_asm", "__start_em_js", "__stop_em_js"].includes(A) || A.startsWith("__em_js__"), "isInternalSym"),
        uleb128Encode = O0((A, Q) => {
          if (A < 128) Q.push(A);
          else Q.push(A % 128 | 128, A >> 7)
        }, "uleb128Encode"),
        sigToWasmTypes = O0((A) => {
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
        generateFuncType = O0((A, Q) => {
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
          for (var Y = 0; Y < G.length; ++Y) Q.push(Z[G[Y]]);
          if (B == "v") Q.push(0);
          else Q.push(1, Z[B])
        }, "generateFuncType"),
        convertJsFunctionToWasm = O0((A, Q) => {
          if (typeof WebAssembly.Function == "function") return new WebAssembly.Function(sigToWasmTypes(Q), A);
          var B = [1];
          generateFuncType(Q, B);
          var G = [0, 97, 115, 109, 1, 0, 0, 0, 1];
          uleb128Encode(B.length, G), G.push(...B), G.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
          var Z = new WebAssembly.Module(new Uint8Array(G)),
            Y = new WebAssembly.Instance(Z, {
              e: {
                f: A
              }
            }),
            J = Y.exports.f;
          return J
        }, "convertJsFunctionToWasm"),
        wasmTableMirror = [],
        wasmTable = new WebAssembly.Table({
          initial: 31,
          element: "anyfunc"
        }),
        getWasmTableEntry = O0((A) => {
          var Q = wasmTableMirror[A];
          if (!Q) {
            if (A >= wasmTableMirror.length) wasmTableMirror.length = A + 1;
            wasmTableMirror[A] = Q = wasmTable.get(A)
          }
          return Q
        }, "getWasmTableEntry"),
        updateTableMap = O0((A, Q) => {
          if (functionsInTableMap)
            for (var B = A; B < A + Q; B++) {
              var G = getWasmTableEntry(B);
              if (G) functionsInTableMap.set(G, B)
            }
        }, "updateTableMap"),
        functionsInTableMap, getFunctionAddress = O0((A) => {
          if (!functionsInTableMap) functionsInTableMap = new WeakMap, updateTableMap(0, wasmTable.length);
          return functionsInTableMap.get(A) || 0
        }, "getFunctionAddress"),
        freeTableIndexes = [],
        getEmptyTableSlot = O0(() => {
          if (freeTableIndexes.length) return freeTableIndexes.pop();
          try {
            wasmTable.grow(1)
          } catch (A) {
            if (!(A instanceof RangeError)) throw A;
            throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."
          }
          return wasmTable.length - 1
        }, "getEmptyTableSlot"),
        setWasmTableEntry = O0((A, Q) => {
          wasmTable.set(A, Q), wasmTableMirror[A] = wasmTable.get(A)
        }, "setWasmTableEntry"),
        addFunction = O0((A, Q) => {
          var B = getFunctionAddress(A);
          if (B) return B;
          var G = getEmptyTableSlot();
          try {
            setWasmTableEntry(G, A)
          } catch (Y) {
            if (!(Y instanceof TypeError)) throw Y;
            var Z = convertJsFunctionToWasm(A, Q);
            setWasmTableEntry(G, Z)
          }
          return functionsInTableMap.set(A, G), G
        }, "addFunction"),
        updateGOT = O0((A, Q) => {
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
        relocateExports = O0((A, Q, B) => {
          var G = {};
          for (var Z in A) {
            var Y = A[Z];
            if (typeof Y == "object") Y = Y.value;
            if (typeof Y == "number") Y += Q;
            G[Z] = Y
          }
          return updateGOT(G, B), G
        }, "relocateExports"),
        isSymbolDefined = O0((A) => {
          var Q = wasmImports[A];
          if (!Q || Q.stub) return !1;
          return !0
        }, "isSymbolDefined"),
        dynCall = O0((A, Q, B = []) => {
          var G = getWasmTableEntry(Q)(...B);
          return G
        }, "dynCall"),
        stackSave = O0(() => _emscripten_stack_get_current(), "stackSave"),
        stackRestore = O0((A) => __emscripten_stack_restore(A), "stackRestore"),
        createInvokeFunction = O0((A) => (Q, ...B) => {
          var G = stackSave();
          try {
            return dynCall(A, Q, B)
          } catch (Z) {
            if (stackRestore(G), Z !== Z + 0) throw Z;
            if (_setThrew(1, 0), A[0] == "j") return 0n
          }
        }, "createInvokeFunction"),
        resolveGlobalSymbol = O0((A, Q = !1) => {
          var B;
          if (isSymbolDefined(A)) B = wasmImports[A];
          else if (A.startsWith("invoke_")) B = wasmImports[A] = createInvokeFunction(A.split("_")[1]);
          return {
            sym: B,
            name: A
          }
        }, "resolveGlobalSymbol"),
        onPostCtors = [],
        addOnPostCtor = O0((A) => onPostCtors.unshift(A), "addOnPostCtor"),
        UTF8ToString = O0((A, Q) => A ? UTF8ArrayToString(HEAPU8, A, Q) : "", "UTF8ToString"),
        loadWebAssemblyModule = O0((binary, flags, libName, localScope, handle) => {
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
            O0(resolveSymbol, "resolveSymbol");
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
              if (O0(addEmAsm, "addEmAsm"), "__start_em_asm" in moduleExports) {
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
              O0(addEmJs, "addEmJs");
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
            if (O0(postInstantiation, "postInstantiation"), flags.loadAsync) {
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
          if (O0(loadModule, "loadModule"), flags.loadAsync) return metadata.neededDynlibs.reduce((A, Q) => A.then(() => loadDynamicLibrary(Q, flags, localScope)), Promise.resolve()).then(loadModule);
          return metadata.neededDynlibs.forEach((A) => loadDynamicLibrary(A, flags, localScope)), loadModule()
        }, "loadWebAssemblyModule"),
        mergeLibSymbols = O0((A, Q) => {
          for (var [B, G] of Object.entries(A)) {
            let Z = O0((J) => {
              if (!isSymbolDefined(J)) wasmImports[J] = G
            }, "setImport");
            Z(B);
            let Y = "__main_argc_argv";
            if (B == "main") Z(Y);
            if (B == Y) Z("main")
          }
        }, "mergeLibSymbols"),
        asyncLoad = O0(async (A) => {
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

        function Y() {
          if (G) {
            var I = LE_HEAP_LOAD_U32((G + 28 >> 2) * 4),
              D = LE_HEAP_LOAD_U32((G + 32 >> 2) * 4);
            if (I && D) {
              var W = HEAP8.slice(I, I + D);
              return Q.loadAsync ? Promise.resolve(W) : W
            }
          }
          var K = locateFile(A);
          if (Q.loadAsync) return asyncLoad(K);
          if (!readBinary) throw Error(`${K}: file not found, and synchronous loading of external files is not available`);
          return readBinary(K)
        }
        O0(Y, "loadLibData");

        function J() {
          if (Q.loadAsync) return Y().then((I) => loadWebAssemblyModule(I, Q, A, B, G));
          return loadWebAssemblyModule(Y(), Q, A, B, G)
        }
        O0(J, "getExports");

        function X(I) {
          if (Z.global) mergeLibSymbols(I, A);
          else if (B) Object.assign(B, I);
          Z.exports = I
        }
        if (O0(X, "moduleLoaded"), Q.loadAsync) return J().then((I) => {
          return X(I), !0
        });
        return X(J()), !0
      }
      O0(loadDynamicLibrary, "loadDynamicLibrary");
      var reportUndefinedSymbols = O0(() => {
          for (var [A, Q] of Object.entries(GOT))
            if (Q.value == 0) {
              var B = resolveGlobalSymbol(A, !0).sym;
              if (!B && !Q.required) continue;
              if (typeof B == "function") Q.value = addFunction(B, B.sig);
              else if (typeof B == "number") Q.value = B;
              else throw Error(`bad export type for '${A}': ${typeof B}`)
            }
        }, "reportUndefinedSymbols"),
        loadDylibs = O0(() => {
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
      O0(setValue, "setValue");
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
        __abort_js = O0(() => abort(""), "__abort_js");
      __abort_js.sig = "v";
      var _emscripten_get_now = O0(() => performance.now(), "_emscripten_get_now");
      _emscripten_get_now.sig = "d";
      var _emscripten_date_now = O0(() => Date.now(), "_emscripten_date_now");
      _emscripten_date_now.sig = "d";
      var nowIsMonotonic = 1,
        checkWasiClock = O0((A) => A >= 0 && A <= 3, "checkWasiClock"),
        INT53_MAX = 9007199254740992,
        INT53_MIN = -9007199254740992,
        bigintToI53Checked = O0((A) => A < INT53_MIN || A > INT53_MAX ? NaN : Number(A), "bigintToI53Checked");

      function _clock_time_get(A, Q, B) {
        if (Q = bigintToI53Checked(Q), !checkWasiClock(A)) return 28;
        var G;
        if (A === 0) G = _emscripten_date_now();
        else if (nowIsMonotonic) G = _emscripten_get_now();
        else return 52;
        var Z = Math.round(G * 1000 * 1000);
        return HEAP64[B >> 3] = BigInt(Z), 0
      }
      O0(_clock_time_get, "_clock_time_get"), _clock_time_get.sig = "iijp";
      var getHeapMax = O0(() => 2147483648, "getHeapMax"),
        growMemory = O0((A) => {
          var Q = wasmMemory.buffer,
            B = (A - Q.byteLength + 65535) / 65536 | 0;
          try {
            return wasmMemory.grow(B), updateMemoryViews(), 1
          } catch (G) {}
        }, "growMemory"),
        _emscripten_resize_heap = O0((A) => {
          var Q = HEAPU8.length;
          A >>>= 0;
          var B = getHeapMax();
          if (A > B) return !1;
          for (var G = 1; G <= 4; G *= 2) {
            var Z = Q * (1 + 0.2 / G);
            Z = Math.min(Z, A + 100663296);
            var Y = Math.min(B, alignMemory(Math.max(A, Z), 65536)),
              J = growMemory(Y);
            if (J) return !0
          }
          return !1
        }, "_emscripten_resize_heap");
      _emscripten_resize_heap.sig = "ip";
      var _fd_close = O0((A) => 52, "_fd_close");
      _fd_close.sig = "ii";

      function _fd_seek(A, Q, B, G) {
        return Q = bigintToI53Checked(Q), 70
      }
      O0(_fd_seek, "_fd_seek"), _fd_seek.sig = "iijip";
      var printCharBuffers = [null, [],
          []
        ],
        printChar = O0((A, Q) => {
          var B = printCharBuffers[A];
          if (Q === 0 || Q === 10)(A === 1 ? out : err)(UTF8ArrayToString(B)), B.length = 0;
          else B.push(Q)
        }, "printChar"),
        flush_NO_FILESYSTEM = O0(() => {
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
        _fd_write = O0((A, Q, B, G) => {
          var Z = 0;
          for (var Y = 0; Y < B; Y++) {
            var J = LE_HEAP_LOAD_U32((Q >> 2) * 4),
              X = LE_HEAP_LOAD_U32((Q + 4 >> 2) * 4);
            Q += 8;
            for (var I = 0; I < X; I++) printChar(A, HEAPU8[J + I]);
            Z += X
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
      O0(_tree_sitter_log_callback, "_tree_sitter_log_callback");

      function _tree_sitter_parse_callback(A, Q, B, G, Z) {
        let J = Module.currentParseCallback(Q, {
          row: B,
          column: G
        });
        if (typeof J === "string") setValue(Z, J.length, "i32"), stringToUTF16(J, A, 10240);
        else setValue(Z, 0, "i32")
      }
      O0(_tree_sitter_parse_callback, "_tree_sitter_parse_callback");

      function _tree_sitter_progress_callback(A, Q) {
        if (Module.currentProgressCallback) return Module.currentProgressCallback({
          currentOffset: A,
          hasError: Q
        });
        return !1
      }
      O0(_tree_sitter_progress_callback, "_tree_sitter_progress_callback");

      function _tree_sitter_query_progress_callback(A) {
        if (Module.currentQueryProgressCallback) return Module.currentQueryProgressCallback({
          currentOffset: A
        });
        return !1
      }
      O0(_tree_sitter_query_progress_callback, "_tree_sitter_query_progress_callback");
      var runtimeKeepaliveCounter = 0,
        keepRuntimeAlive = O0(() => noExitRuntime || runtimeKeepaliveCounter > 0, "keepRuntimeAlive"),
        _proc_exit = O0((A) => {
          if (EXITSTATUS = A, !keepRuntimeAlive()) Module.onExit?.(A), ABORT = !0;
          quit_(A, new ExitStatus(A))
        }, "_proc_exit");
      _proc_exit.sig = "vi";
      var exitJS = O0((A, Q) => {
          EXITSTATUS = A, _proc_exit(A)
        }, "exitJS"),
        handleException = O0((A) => {
          if (A instanceof ExitStatus || A == "unwind") return EXITSTATUS;
          quit_(1, A)
        }, "handleException"),
        lengthBytesUTF8 = O0((A) => {
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
        stringToUTF8Array = O0((A, Q, B, G) => {
          if (!(G > 0)) return 0;
          var Z = B,
            Y = B + G - 1;
          for (var J = 0; J < A.length; ++J) {
            var X = A.charCodeAt(J);
            if (X >= 55296 && X <= 57343) {
              var I = A.charCodeAt(++J);
              X = 65536 + ((X & 1023) << 10) | I & 1023
            }
            if (X <= 127) {
              if (B >= Y) break;
              Q[B++] = X
            } else if (X <= 2047) {
              if (B + 1 >= Y) break;
              Q[B++] = 192 | X >> 6, Q[B++] = 128 | X & 63
            } else if (X <= 65535) {
              if (B + 2 >= Y) break;
              Q[B++] = 224 | X >> 12, Q[B++] = 128 | X >> 6 & 63, Q[B++] = 128 | X & 63
            } else {
              if (B + 3 >= Y) break;
              Q[B++] = 240 | X >> 18, Q[B++] = 128 | X >> 12 & 63, Q[B++] = 128 | X >> 6 & 63, Q[B++] = 128 | X & 63
            }
          }
          return Q[B] = 0, B - Z
        }, "stringToUTF8Array"),
        stringToUTF8 = O0((A, Q, B) => stringToUTF8Array(A, HEAPU8, Q, B), "stringToUTF8"),
        stackAlloc = O0((A) => __emscripten_stack_alloc(A), "stackAlloc"),
        stringToUTF8OnStack = O0((A) => {
          var Q = lengthBytesUTF8(A) + 1,
            B = stackAlloc(Q);
          return stringToUTF8(A, B, Q), B
        }, "stringToUTF8OnStack"),
        AsciiToString = O0((A) => {
          var Q = "";
          while (!0) {
            var B = HEAPU8[A++];
            if (!B) return Q;
            Q += String.fromCharCode(B)
          }
        }, "AsciiToString"),
        stringToUTF16 = O0((A, Q, B) => {
          if (B ??= 2147483647, B < 2) return 0;
          B -= 2;
          var G = Q,
            Z = B < A.length * 2 ? B / 2 : A.length;
          for (var Y = 0; Y < Z; ++Y) {
            var J = A.charCodeAt(Y);
            LE_HEAP_STORE_I16((Q >> 1) * 2, J), Q += 2
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
        A.forEach((J) => {
          LE_HEAP_STORE_U32((Z >> 2) * 4, stringToUTF8OnStack(J)), Z += 4
        }), LE_HEAP_STORE_U32((Z >> 2) * 4, 0);
        try {
          var Y = Q(B, G);
          return exitJS(Y, !0), Y
        } catch (J) {
          return handleException(J)
        }
      }
      O0(callMain, "callMain");

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
        if (O0(Q, "doRun"), Module.setStatus) Module.setStatus("Running..."), setTimeout(() => {
          setTimeout(() => Module.setStatus(""), 1), Q()
        }, 1);
        else Q()
      }
      if (O0(run, "run"), Module.preInit) {
        if (typeof Module.preInit == "function") Module.preInit = [Module.preInit];
        while (Module.preInit.length > 0) Module.preInit.pop()()
      }
      return run(), moduleRtn = readyPromise, moduleRtn
    }
  })(), Qn5 = An5;
  O0(Om2, "initializeBinding");
  O0(Mm2, "checkModule");
  rbA = class {
    static {
      O0(this, "Parser")
    } [0] = 0;
    [1] = 0;
    logCallback = null;
    language = null;
    static async init(A) {
      Hm2(await Om2(A)), s2 = F1._ts_init(), Kq0 = F1.getValue(s2, "i32"), Vq0 = F1.getValue(s2 + $9, "i32")
    }
    constructor() {
      this.initialize()
    }
    initialize() {
      if (!Mm2()) throw Error("cannot construct a Parser before calling `init()`");
      F1._ts_parser_new_wasm(), this[0] = F1.getValue(s2, "i32"), this[1] = F1.getValue(s2 + $9, "i32")
    }
    delete() {
      F1._ts_parser_delete(this[0]), F1._free(this[1]), this[0] = 0, this[1] = 0
    }
    setLanguage(A) {
      let Q;
      if (!A) Q = 0, this.language = null;
      else if (A.constructor === yK1) {
        Q = A[0];
        let B = F1._ts_language_version(Q);
        if (B < Vq0 || Kq0 < B) throw Error(`Incompatible language version ${B}. Compatibility range ${Vq0} through ${Kq0}.`);
        this.language = A
      } else throw Error("Argument must be a Language");
      return F1._ts_parser_set_language(this[0], Q), this
    }
    parse(A, Q, B) {
      if (typeof A === "string") F1.currentParseCallback = (X) => A.slice(X);
      else if (typeof A === "function") F1.currentParseCallback = A;
      else throw Error("Argument must be a string or a function");
      if (B?.progressCallback) F1.currentProgressCallback = B.progressCallback;
      else F1.currentProgressCallback = null;
      if (this.logCallback) F1.currentLogCallback = this.logCallback, F1._ts_parser_enable_logger_wasm(this[0], 1);
      else F1.currentLogCallback = null, F1._ts_parser_enable_logger_wasm(this[0], 0);
      let G = 0,
        Z = 0;
      if (B?.includedRanges) {
        G = B.includedRanges.length, Z = F1._calloc(G, obA);
        let X = Z;
        for (let I = 0; I < G; I++) Em2(X, B.includedRanges[I]), X += obA
      }
      let Y = F1._ts_parser_parse_wasm(this[0], this[1], Q ? Q[0] : 0, Z, G);
      if (!Y) return F1.currentParseCallback = null, F1.currentLogCallback = null, F1.currentProgressCallback = null, null;
      if (!this.language) throw Error("Parser must have a language to parse");
      let J = new ii5(Wt, Y, this.language, F1.currentParseCallback);
      return F1.currentParseCallback = null, F1.currentLogCallback = null, F1.currentProgressCallback = null, J
    }
    reset() {
      F1._ts_parser_reset(this[0])
    }
    getIncludedRanges() {
      F1._ts_parser_included_ranges_wasm(this[0]);
      let A = F1.getValue(s2, "i32"),
        Q = F1.getValue(s2 + $9, "i32"),
        B = Array(A);
      if (A > 0) {
        let G = Q;
        for (let Z = 0; Z < A; Z++) B[Z] = xK1(G), G += obA;
        F1._free(Q)
      }
      return B
    }
    getTimeoutMicros() {
      return F1._ts_parser_timeout_micros(this[0])
    }
    setTimeoutMicros(A) {
      F1._ts_parser_set_timeout_micros(this[0], 0, A)
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
// @from(Ln 361859, Col 0)
function Tm2() {
  return (process.argv[1] || "").includes("/.claude/local/node_modules/")
}
// @from(Ln 361862, Col 0)
async function Bn5() {
  try {
    if (!vA().existsSync(Kt)) vA().mkdirSync(Kt);
    if (!vA().existsSync(_m2)) bB(_m2, eA({
      name: "claude-local",
      version: "0.0.1",
      private: !0
    }, null, 2), {
      encoding: "utf8",
      flush: !1
    });
    let A = sbA(Kt, "claude");
    if (!vA().existsSync(A)) {
      let Q = `#!/bin/bash
exec "${Kt}/node_modules/.bin/claude" "$@"`;
      bB(A, Q, {
        encoding: "utf8",
        flush: !1
      }), await TQ("chmod", ["+x", A])
    }
    return !0
  } catch (A) {
    return e(A instanceof Error ? A : Error(String(A))), !1
  }
}
// @from(Ln 361887, Col 0)
async function ZEA(A, Q) {
  try {
    if (!await Bn5()) return "install_failed";
    let B = Q ? Q : A === "stable" ? "stable" : "latest",
      G = await J2("npm", ["install", `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.PACKAGE_URL}@${B}`], {
        cwd: Kt,
        maxBuffer: 1e6
      });
    if (G.code !== 0) {
      let Z = Error(`Failed to install Claude CLI package: ${G.stderr}`);
      return e(Z), zq0.captureException(Z), G.code === 190 ? "in_progress" : "install_failed"
    }
    return S0((Z) => ({
      ...Z,
      installMethod: "local"
    })), "success"
  } catch (B) {
    return e(B instanceof Error ? B : Error(String(B))), zq0.captureException(B), "install_failed"
  }
}
// @from(Ln 361908, Col 0)
function kc() {
  return vA().existsSync(sbA(Kt, "node_modules", ".bin", "claude"))
}
// @from(Ln 361912, Col 0)
function YEA() {
  let A = process.env.SHELL || "";
  if (A.includes("zsh")) return "zsh";
  if (A.includes("bash")) return "bash";
  if (A.includes("fish")) return "fish";
  return "unknown"
}
// @from(Ln 361919, Col 4)
zq0
// @from(Ln 361919, Col 9)
Kt
// @from(Ln 361919, Col 13)
_m2
// @from(Ln 361919, Col 18)
jm2
// @from(Ln 361920, Col 4)
Vt = w(() => {
  t4();
  v1();
  GQ();
  DQ();
  fQ();
  A0();
  A0();
  zq0 = c(Sg(), 1), Kt = sbA(zQ(), "local"), _m2 = sbA(Kt, "package.json"), jm2 = sbA(Kt, "claude")
})
// @from(Ln 361937, Col 0)
function Ft() {
  let A = process.env.ZDOTDIR || vK1();
  return {
    zsh: $q0(A, ".zshrc"),
    bash: $q0(vK1(), ".bashrc"),
    fish: $q0(vK1(), ".config/fish/config.fish")
  }
}
// @from(Ln 361946, Col 0)
function kK1(A) {
  let Q = !1;
  return {
    filtered: A.filter((G) => {
      if (Pm2.test(G)) {
        let Z = G.match(/alias\s+claude\s*=\s*["']([^"']+)["']/);
        if (!Z) Z = G.match(/alias\s+claude\s*=\s*([^#\n]+)/);
        if (Z && Z[1]) {
          if (Z[1].trim() === jm2) return Q = !0, !1
        }
      }
      return !0
    }),
    hadAlias: Q
  }
}
// @from(Ln 361963, Col 0)
function tbA(A) {
  let Q = vA();
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
// @from(Ln 361976, Col 0)
function bK1(A, Q) {
  bB(A, Q.join(`
`), {
    encoding: "utf8",
    flush: !0
  })
}
// @from(Ln 361984, Col 0)
function Cq0() {
  let A = Ft();
  for (let Q of Object.values(A)) {
    let B = tbA(Q);
    if (!B) continue;
    for (let G of B)
      if (Pm2.test(G)) {
        let Z = G.match(/alias\s+claude=["']?([^"'\s]+)/);
        if (Z && Z[1]) return Z[1]
      }
  }
  return null
}
// @from(Ln 361998, Col 0)
function Sm2() {
  let A = Cq0();
  if (!A) return null;
  let Q = vA(),
    B = A.startsWith("~") ? A.replace("~", vK1()) : A;
  try {
    if (Q.existsSync(B)) {
      let G = Q.statSync(B);
      if (G.isFile() || G.isSymbolicLink()) return A
    }
  } catch {}
  return null
}
// @from(Ln 362011, Col 4)
Pm2
// @from(Ln 362012, Col 4)
fK1 = w(() => {
  DQ();
  Vt();
  A0();
  Pm2 = /^\s*alias\s+claude\s*=/
})
// @from(Ln 362030, Col 0)
async function ym2() {
  try {
    let A = await XP("tengu_version_config", {
      minVersion: "0.0.0"
    });
    if (A.minVersion && gK1.lt({
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.VERSION, A.minVersion)) console.error(`
It looks like your version of Claude Code (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION}) needs an update.
A newer version (${A.minVersion} or higher) is required to continue.

To update, please run:
    claude update

This will ensure you have access to the latest features and improvements.
`), f6(1)
  } catch (A) {
    e(A)
  }
}
// @from(Ln 362056, Col 0)
function JEA(A) {
  let B = r3()?.minimumVersion;
  if (!B) return !1;
  let G = !gK1.gte(A, B, {
    loose: !0
  });
  if (G) k(`Skipping update to ${A} - below minimumVersion ${B}`);
  return G
}
// @from(Ln 362066, Col 0)
function s6A() {
  return Zn5(zQ(), ".update.lock")
}
// @from(Ln 362070, Col 0)
function In5() {
  try {
    if (!vA().existsSync(zQ())) vA().mkdirSync(zQ());
    if (vA().existsSync(s6A())) {
      let A = vA().statSync(s6A());
      if (Date.now() - A.mtimeMs < Xn5) return !1;
      try {
        vA().unlinkSync(s6A())
      } catch (B) {
        return e(B), !1
      }
    }
    return bB(s6A(), `${process.pid}`, {
      encoding: "utf8"
    }), !0
  } catch (A) {
    return e(A), !1
  }
}
// @from(Ln 362090, Col 0)
function Dn5() {
  try {
    if (vA().existsSync(s6A())) {
      if (vA().readFileSync(s6A(), {
          encoding: "utf8"
        }) === `${process.pid}`) vA().unlinkSync(s6A())
    }
  } catch (A) {
    e(A)
  }
}
// @from(Ln 362101, Col 0)
async function Wn5() {
  let A = l0.isRunningWithBun(),
    Q = null;
  if (A) Q = await J2("bun", ["pm", "bin", "-g"], {
    cwd: ebA()
  });
  else Q = await J2("npm", ["-g", "config", "get", "prefix"], {
    cwd: ebA()
  });
  if (Q.code !== 0) return e(Error(`Failed to check ${A?"bun":"npm"} permissions`)), null;
  return Q.stdout.trim()
}