
// @from(Ln 157880, Col 0)
class bQ1 {
  constructor(A) {
    this.counter = 0, this.metadataRegistry = A?.metadata ?? Ek, this.target = A?.target ?? "draft-2020-12", this.unrepresentable = A?.unrepresentable ?? "throw", this.override = A?.override ?? (() => {}), this.io = A?.io ?? "output", this.seen = new Map
  }
  process(A, Q = {
    path: [],
    schemaPath: []
  }) {
    var B;
    let G = A._zod.def,
      Z = {
        guid: "uuid",
        url: "uri",
        datetime: "date-time",
        json_string: "json-string",
        regex: ""
      },
      Y = this.seen.get(A);
    if (Y) {
      if (Y.count++, Q.schemaPath.includes(A)) Y.cycle = Q.path;
      return Y.schema
    }
    let J = {
      schema: {},
      count: 1,
      cycle: void 0,
      path: Q.path
    };
    this.seen.set(A, J);
    let X = A._zod.toJSONSchema?.();
    if (X) J.schema = X;
    else {
      let W = {
          ...Q,
          schemaPath: [...Q.schemaPath, A],
          path: Q.path
        },
        K = A._zod.parent;
      if (K) J.ref = K, this.process(K, W), this.seen.get(K).isParent = !0;
      else {
        let V = J.schema;
        switch (G.type) {
          case "string": {
            let F = V;
            F.type = "string";
            let {
              minimum: H,
              maximum: E,
              format: z,
              patterns: $,
              contentEncoding: O
            } = A._zod.bag;
            if (typeof H === "number") F.minLength = H;
            if (typeof E === "number") F.maxLength = E;
            if (z) {
              if (F.format = Z[z] ?? z, F.format === "") delete F.format
            }
            if (O) F.contentEncoding = O;
            if ($ && $.size > 0) {
              let L = [...$];
              if (L.length === 1) F.pattern = L[0].source;
              else if (L.length > 1) J.schema.allOf = [...L.map((M) => ({
                ...this.target === "draft-7" ? {
                  type: "string"
                } : {},
                pattern: M.source
              }))]
            }
            break
          }
          case "number": {
            let F = V,
              {
                minimum: H,
                maximum: E,
                format: z,
                multipleOf: $,
                exclusiveMaximum: O,
                exclusiveMinimum: L
              } = A._zod.bag;
            if (typeof z === "string" && z.includes("int")) F.type = "integer";
            else F.type = "number";
            if (typeof L === "number") F.exclusiveMinimum = L;
            if (typeof H === "number") {
              if (F.minimum = H, typeof L === "number")
                if (L >= H) delete F.minimum;
                else delete F.exclusiveMinimum
            }
            if (typeof O === "number") F.exclusiveMaximum = O;
            if (typeof E === "number") {
              if (F.maximum = E, typeof O === "number")
                if (O <= E) delete F.maximum;
                else delete F.exclusiveMaximum
            }
            if (typeof $ === "number") F.multipleOf = $;
            break
          }
          case "boolean": {
            let F = V;
            F.type = "boolean";
            break
          }
          case "bigint": {
            if (this.unrepresentable === "throw") throw Error("BigInt cannot be represented in JSON Schema");
            break
          }
          case "symbol": {
            if (this.unrepresentable === "throw") throw Error("Symbols cannot be represented in JSON Schema");
            break
          }
          case "null": {
            V.type = "null";
            break
          }
          case "any":
            break;
          case "unknown":
            break;
          case "undefined":
          case "never": {
            V.not = {};
            break
          }
          case "void": {
            if (this.unrepresentable === "throw") throw Error("Void cannot be represented in JSON Schema");
            break
          }
          case "date": {
            if (this.unrepresentable === "throw") throw Error("Date cannot be represented in JSON Schema");
            break
          }
          case "array": {
            let F = V,
              {
                minimum: H,
                maximum: E
              } = A._zod.bag;
            if (typeof H === "number") F.minItems = H;
            if (typeof E === "number") F.maxItems = E;
            F.type = "array", F.items = this.process(G.element, {
              ...W,
              path: [...W.path, "items"]
            });
            break
          }
          case "object": {
            let F = V;
            F.type = "object", F.properties = {};
            let H = G.shape;
            for (let $ in H) F.properties[$] = this.process(H[$], {
              ...W,
              path: [...W.path, "properties", $]
            });
            let E = new Set(Object.keys(H)),
              z = new Set([...E].filter(($) => {
                let O = G.shape[$]._zod;
                if (this.io === "input") return O.optin === void 0;
                else return O.optout === void 0
              }));
            if (z.size > 0) F.required = Array.from(z);
            if (G.catchall?._zod.def.type === "never") F.additionalProperties = !1;
            else if (!G.catchall) {
              if (this.io === "output") F.additionalProperties = !1
            } else if (G.catchall) F.additionalProperties = this.process(G.catchall, {
              ...W,
              path: [...W.path, "additionalProperties"]
            });
            break
          }
          case "union": {
            let F = V;
            F.anyOf = G.options.map((H, E) => this.process(H, {
              ...W,
              path: [...W.path, "anyOf", E]
            }));
            break
          }
          case "intersection": {
            let F = V,
              H = this.process(G.left, {
                ...W,
                path: [...W.path, "allOf", 0]
              }),
              E = this.process(G.right, {
                ...W,
                path: [...W.path, "allOf", 1]
              }),
              z = (O) => ("allOf" in O) && Object.keys(O).length === 1,
              $ = [...z(H) ? H.allOf : [H], ...z(E) ? E.allOf : [E]];
            F.allOf = $;
            break
          }
          case "tuple": {
            let F = V;
            F.type = "array";
            let H = G.items.map(($, O) => this.process($, {
              ...W,
              path: [...W.path, "prefixItems", O]
            }));
            if (this.target === "draft-2020-12") F.prefixItems = H;
            else F.items = H;
            if (G.rest) {
              let $ = this.process(G.rest, {
                ...W,
                path: [...W.path, "items"]
              });
              if (this.target === "draft-2020-12") F.items = $;
              else F.additionalItems = $
            }
            if (G.rest) F.items = this.process(G.rest, {
              ...W,
              path: [...W.path, "items"]
            });
            let {
              minimum: E,
              maximum: z
            } = A._zod.bag;
            if (typeof E === "number") F.minItems = E;
            if (typeof z === "number") F.maxItems = z;
            break
          }
          case "record": {
            let F = V;
            F.type = "object", F.propertyNames = this.process(G.keyType, {
              ...W,
              path: [...W.path, "propertyNames"]
            }), F.additionalProperties = this.process(G.valueType, {
              ...W,
              path: [...W.path, "additionalProperties"]
            });
            break
          }
          case "map": {
            if (this.unrepresentable === "throw") throw Error("Map cannot be represented in JSON Schema");
            break
          }
          case "set": {
            if (this.unrepresentable === "throw") throw Error("Set cannot be represented in JSON Schema");
            break
          }
          case "enum": {
            let F = V,
              H = WRA(G.entries);
            if (H.every((E) => typeof E === "number")) F.type = "number";
            if (H.every((E) => typeof E === "string")) F.type = "string";
            F.enum = H;
            break
          }
          case "literal": {
            let F = V,
              H = [];
            for (let E of G.values)
              if (E === void 0) {
                if (this.unrepresentable === "throw") throw Error("Literal `undefined` cannot be represented in JSON Schema")
              } else if (typeof E === "bigint")
              if (this.unrepresentable === "throw") throw Error("BigInt literals cannot be represented in JSON Schema");
              else H.push(Number(E));
            else H.push(E);
            if (H.length === 0);
            else if (H.length === 1) {
              let E = H[0];
              F.type = E === null ? "null" : typeof E, F.const = E
            } else {
              if (H.every((E) => typeof E === "number")) F.type = "number";
              if (H.every((E) => typeof E === "string")) F.type = "string";
              if (H.every((E) => typeof E === "boolean")) F.type = "string";
              if (H.every((E) => E === null)) F.type = "null";
              F.enum = H
            }
            break
          }
          case "file": {
            let F = V,
              H = {
                type: "string",
                format: "binary",
                contentEncoding: "binary"
              },
              {
                minimum: E,
                maximum: z,
                mime: $
              } = A._zod.bag;
            if (E !== void 0) H.minLength = E;
            if (z !== void 0) H.maxLength = z;
            if ($)
              if ($.length === 1) H.contentMediaType = $[0], Object.assign(F, H);
              else F.anyOf = $.map((O) => {
                return {
                  ...H,
                  contentMediaType: O
                }
              });
            else Object.assign(F, H);
            break
          }
          case "transform": {
            if (this.unrepresentable === "throw") throw Error("Transforms cannot be represented in JSON Schema");
            break
          }
          case "nullable": {
            let F = this.process(G.innerType, W);
            V.anyOf = [F, {
              type: "null"
            }];
            break
          }
          case "nonoptional": {
            this.process(G.innerType, W), J.ref = G.innerType;
            break
          }
          case "success": {
            let F = V;
            F.type = "boolean";
            break
          }
          case "default": {
            this.process(G.innerType, W), J.ref = G.innerType, V.default = JSON.parse(JSON.stringify(G.defaultValue));
            break
          }
          case "prefault": {
            if (this.process(G.innerType, W), J.ref = G.innerType, this.io === "input") V._prefault = JSON.parse(JSON.stringify(G.defaultValue));
            break
          }
          case "catch": {
            this.process(G.innerType, W), J.ref = G.innerType;
            let F;
            try {
              F = G.catchValue(void 0)
            } catch {
              throw Error("Dynamic catch values are not supported in JSON Schema")
            }
            V.default = F;
            break
          }
          case "nan": {
            if (this.unrepresentable === "throw") throw Error("NaN cannot be represented in JSON Schema");
            break
          }
          case "template_literal": {
            let F = V,
              H = A._zod.pattern;
            if (!H) throw Error("Pattern not found in template literal");
            F.type = "string", F.pattern = H.source;
            break
          }
          case "pipe": {
            let F = this.io === "input" ? G.in._zod.def.type === "transform" ? G.out : G.in : G.out;
            this.process(F, W), J.ref = F;
            break
          }
          case "readonly": {
            this.process(G.innerType, W), J.ref = G.innerType, V.readOnly = !0;
            break
          }
          case "promise": {
            this.process(G.innerType, W), J.ref = G.innerType;
            break
          }
          case "optional": {
            this.process(G.innerType, W), J.ref = G.innerType;
            break
          }
          case "lazy": {
            let F = A._zod.innerType;
            this.process(F, W), J.ref = F;
            break
          }
          case "custom": {
            if (this.unrepresentable === "throw") throw Error("Custom types cannot be represented in JSON Schema");
            break
          }
          default:
        }
      }
    }
    let I = this.metadataRegistry.get(A);
    if (I) Object.assign(J.schema, I);
    if (this.io === "input" && aK(A)) delete J.schema.examples, delete J.schema.default;
    if (this.io === "input" && J.schema._prefault)(B = J.schema).default ?? (B.default = J.schema._prefault);
    return delete J.schema._prefault, this.seen.get(A).schema
  }
  emit(A, Q) {
    let B = {
        cycles: Q?.cycles ?? "ref",
        reused: Q?.reused ?? "inline",
        external: Q?.external ?? void 0
      },
      G = this.seen.get(A);
    if (!G) throw Error("Unprocessed schema. This is a bug in Zod.");
    let Z = (D) => {
        let W = this.target === "draft-2020-12" ? "$defs" : "definitions";
        if (B.external) {
          let H = B.external.registry.get(D[0])?.id;
          if (H) return {
            ref: B.external.uri(H)
          };
          let E = D[1].defId ?? D[1].schema.id ?? `schema${this.counter++}`;
          return D[1].defId = E, {
            defId: E,
            ref: `${B.external.uri("__shared")}#/${W}/${E}`
          }
        }
        if (D[1] === G) return {
          ref: "#"
        };
        let V = `${"#"}/${W}/`,
          F = D[1].schema.id ?? `__schema${this.counter++}`;
        return {
          defId: F,
          ref: V + F
        }
      },
      Y = (D) => {
        if (D[1].schema.$ref) return;
        let W = D[1],
          {
            ref: K,
            defId: V
          } = Z(D);
        if (W.def = {
            ...W.schema
          }, V) W.defId = V;
        let F = W.schema;
        for (let H in F) delete F[H];
        F.$ref = K
      };
    for (let D of this.seen.entries()) {
      let W = D[1];
      if (A === D[0]) {
        Y(D);
        continue
      }
      if (B.external) {
        let V = B.external.registry.get(D[0])?.id;
        if (A !== D[0] && V) {
          Y(D);
          continue
        }
      }
      if (this.metadataRegistry.get(D[0])?.id) {
        Y(D);
        continue
      }
      if (W.cycle) {
        if (B.cycles === "throw") throw Error(`Cycle detected: #/${W.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
        else if (B.cycles === "ref") Y(D);
        continue
      }
      if (W.count > 1) {
        if (B.reused === "ref") {
          Y(D);
          continue
        }
      }
    }
    let J = (D, W) => {
      let K = this.seen.get(D),
        V = K.def ?? K.schema,
        F = {
          ...V
        };
      if (K.ref === null) return;
      let H = K.ref;
      if (K.ref = null, H) {
        J(H, W);
        let E = this.seen.get(H).schema;
        if (E.$ref && W.target === "draft-7") V.allOf = V.allOf ?? [], V.allOf.push(E);
        else Object.assign(V, E), Object.assign(V, F)
      }
      if (!K.isParent) this.override({
        zodSchema: D,
        jsonSchema: V,
        path: K.path ?? []
      })
    };
    for (let D of [...this.seen.entries()].reverse()) J(D[0], {
      target: this.target
    });
    let X = {};
    if (this.target === "draft-2020-12") X.$schema = "https://json-schema.org/draft/2020-12/schema";
    else if (this.target === "draft-7") X.$schema = "http://json-schema.org/draft-07/schema#";
    else console.warn(`Invalid target: ${this.target}`);
    Object.assign(X, G.def);
    let I = B.external?.defs ?? {};
    for (let D of this.seen.entries()) {
      let W = D[1];
      if (W.def && W.defId) I[W.defId] = W.def
    }
    if (!B.external && Object.keys(I).length > 0)
      if (this.target === "draft-2020-12") X.$defs = I;
      else X.definitions = I;
    try {
      return JSON.parse(JSON.stringify(X))
    } catch (D) {
      throw Error("Error converting schema to JSON.")
    }
  }
}
// @from(Ln 158382, Col 0)
function UBA(A, Q) {
  if (A instanceof jRA) {
    let G = new bQ1(Q),
      Z = {};
    for (let X of A._idmap.entries()) {
      let [I, D] = X;
      G.process(D)
    }
    let Y = {},
      J = {
        registry: A,
        uri: Q?.uri || ((X) => X),
        defs: Z
      };
    for (let X of A._idmap.entries()) {
      let [I, D] = X;
      Y[I] = G.emit(D, {
        ...Q,
        external: J
      })
    }
    if (Object.keys(Z).length > 0) {
      let X = G.target === "draft-2020-12" ? "$defs" : "definitions";
      Y.__shared = {
        [X]: Z
      }
    }
    return {
      schemas: Y
    }
  }
  let B = new bQ1(Q);
  return B.process(A), B.emit(A, Q)
}
// @from(Ln 158417, Col 0)
function aK(A, Q) {
  let B = Q ?? {
    seen: new Set
  };
  if (B.seen.has(A)) return !1;
  B.seen.add(A);
  let Z = A._zod.def;
  switch (Z.type) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "date":
    case "symbol":
    case "undefined":
    case "null":
    case "any":
    case "unknown":
    case "never":
    case "void":
    case "literal":
    case "enum":
    case "nan":
    case "file":
    case "template_literal":
      return !1;
    case "array":
      return aK(Z.element, B);
    case "object": {
      for (let Y in Z.shape)
        if (aK(Z.shape[Y], B)) return !0;
      return !1
    }
    case "union": {
      for (let Y of Z.options)
        if (aK(Y, B)) return !0;
      return !1
    }
    case "intersection":
      return aK(Z.left, B) || aK(Z.right, B);
    case "tuple": {
      for (let Y of Z.items)
        if (aK(Y, B)) return !0;
      if (Z.rest && aK(Z.rest, B)) return !0;
      return !1
    }
    case "record":
      return aK(Z.keyType, B) || aK(Z.valueType, B);
    case "map":
      return aK(Z.keyType, B) || aK(Z.valueType, B);
    case "set":
      return aK(Z.valueType, B);
    case "promise":
    case "optional":
    case "nonoptional":
    case "nullable":
    case "readonly":
      return aK(Z.innerType, B);
    case "lazy":
      return aK(Z.getter(), B);
    case "default":
      return aK(Z.innerType, B);
    case "prefault":
      return aK(Z.innerType, B);
    case "custom":
      return !1;
    case "transform":
      return !0;
    case "pipe":
      return aK(Z.in, B) || aK(Z.out, B);
    case "success":
      return !1;
    case "catch":
      return !1;
    default:
  }
  throw Error(`Unknown schema type: ${Z.type}`)
}
// @from(Ln 158495, Col 4)
lzB = w(() => {
  ne1();
  W6()
})
// @from(Ln 158499, Col 4)
izB = {}
// @from(Ln 158500, Col 4)
nzB = () => {}
// @from(Ln 158501, Col 4)
zk = {}
// @from(Ln 158743, Col 4)
EC = w(() => {
  W6();
  GQ1();
  FQ1();
  nzB();
  WIA();
  QQ1();
  Xs1();
  RRA();
  JQ1();
  Bt1();
  ne1();
  pzB();
  vA0();
  lzB()
})
// @from(Ln 158759, Col 4)
fA0 = w(() => {
  EC()
})
// @from(Ln 158762, Col 4)
wIA = {}
// @from(Ln 158774, Col 0)
function hA0(A) {
  return se1(fQ1, A)
}
// @from(Ln 158778, Col 0)
function gA0(A) {
  return te1(hQ1, A)
}
// @from(Ln 158782, Col 0)
function uA0(A) {
  return ee1(gQ1, A)
}
// @from(Ln 158786, Col 0)
function mA0(A) {
  return AA0(uQ1, A)
}
// @from(Ln 158789, Col 4)
fQ1
// @from(Ln 158789, Col 9)
hQ1
// @from(Ln 158789, Col 14)
gQ1
// @from(Ln 158789, Col 19)
uQ1
// @from(Ln 158790, Col 4)
mQ1 = w(() => {
  EC();
  dQ1();
  fQ1 = z0("ZodISODateTime", (A, Q) => {
    Et1.init(A, Q), mY.init(A, Q)
  });
  hQ1 = z0("ZodISODate", (A, Q) => {
    zt1.init(A, Q), mY.init(A, Q)
  });
  gQ1 = z0("ZodISOTime", (A, Q) => {
    $t1.init(A, Q), mY.init(A, Q)
  });
  uQ1 = z0("ZodISODuration", (A, Q) => {
    Ct1.init(A, Q), mY.init(A, Q)
  })
})
// @from(Ln 158806, Col 4)
ozB = (A, Q) => {
    zRA.init(A, Q), A.name = "ZodError", Object.defineProperties(A, {
      format: {
        value: (B) => CRA(A, B)
      },
      flatten: {
        value: (B) => $RA(A, B)
      },
      addIssue: {
        value: (B) => A.issues.push(B)
      },
      addIssues: {
        value: (B) => A.issues.push(...B)
      },
      isEmpty: {
        get() {
          return A.issues.length === 0
        }
      }
    })
  }
// @from(Ln 158827, Col 2)
eY8
// @from(Ln 158827, Col 7)
LIA
// @from(Ln 158828, Col 4)
dA0 = w(() => {
  EC();
  EC();
  eY8 = z0("ZodError", ozB), LIA = z0("ZodError", ozB, {
    Parent: Error
  })
})
// @from(Ln 158835, Col 4)
cA0
// @from(Ln 158835, Col 9)
pA0
// @from(Ln 158835, Col 14)
lA0
// @from(Ln 158835, Col 19)
iA0
// @from(Ln 158836, Col 4)
nA0 = w(() => {
  EC();
  dA0();
  cA0 = s01(LIA), pA0 = t01(LIA), lA0 = e01(LIA), iA0 = AQ1(LIA)
})
// @from(Ln 158842, Col 0)
function h1(A) {
  return ae1(pRA, A)
}
// @from(Ln 158846, Col 0)
function QJ8(A) {
  return EQ1(rA0, A)
}
// @from(Ln 158850, Col 0)
function BJ8(A) {
  return TRA(cQ1, A)
}
// @from(Ln 158854, Col 0)
function GJ8(A) {
  return zQ1(ru, A)
}
// @from(Ln 158858, Col 0)
function ZJ8(A) {
  return $Q1(ru, A)
}
// @from(Ln 158862, Col 0)
function YJ8(A) {
  return CQ1(ru, A)
}
// @from(Ln 158866, Col 0)
function JJ8(A) {
  return UQ1(ru, A)
}
// @from(Ln 158870, Col 0)
function tA0(A) {
  return qQ1(sA0, A)
}
// @from(Ln 158874, Col 0)
function XJ8(A) {
  return NQ1(eA0, A)
}
// @from(Ln 158878, Col 0)
function IJ8(A) {
  return wQ1(A10, A)
}
// @from(Ln 158882, Col 0)
function DJ8(A) {
  return LQ1(Q10, A)
}
// @from(Ln 158886, Col 0)
function WJ8(A) {
  return OQ1(B10, A)
}
// @from(Ln 158890, Col 0)
function KJ8(A) {
  return MQ1(G10, A)
}
// @from(Ln 158894, Col 0)
function VJ8(A) {
  return RQ1(Z10, A)
}
// @from(Ln 158898, Col 0)
function FJ8(A) {
  return _Q1(Y10, A)
}
// @from(Ln 158902, Col 0)
function HJ8(A) {
  return jQ1(J10, A)
}
// @from(Ln 158906, Col 0)
function EJ8(A) {
  return TQ1(X10, A)
}
// @from(Ln 158910, Col 0)
function zJ8(A) {
  return PQ1(I10, A)
}
// @from(Ln 158914, Col 0)
function $J8(A) {
  return SQ1(D10, A)
}
// @from(Ln 158918, Col 0)
function CJ8(A) {
  return xQ1(W10, A)
}
// @from(Ln 158922, Col 0)
function UJ8(A) {
  return yQ1(K10, A)
}
// @from(Ln 158926, Col 0)
function qJ8(A) {
  return vQ1(V10, A)
}
// @from(Ln 158930, Col 0)
function NJ8(A) {
  return kQ1(F10, A)
}
// @from(Ln 158934, Col 0)
function wJ8(A, Q, B = {}) {
  return yA0(rzB, A, Q, B)
}
// @from(Ln 158938, Col 0)
function c7(A) {
  return QA0(lRA, A)
}
// @from(Ln 158942, Col 0)
function aA0(A) {
  return GA0(OIA, A)
}
// @from(Ln 158946, Col 0)
function LJ8(A) {
  return ZA0(OIA, A)
}
// @from(Ln 158950, Col 0)
function OJ8(A) {
  return YA0(OIA, A)
}
// @from(Ln 158954, Col 0)
function MJ8(A) {
  return JA0(OIA, A)
}
// @from(Ln 158958, Col 0)
function RJ8(A) {
  return XA0(OIA, A)
}
// @from(Ln 158962, Col 0)
function RZ(A) {
  return IA0(iRA, A)
}
// @from(Ln 158966, Col 0)
function _J8(A) {
  return WA0(nRA, A)
}
// @from(Ln 158970, Col 0)
function jJ8(A) {
  return VA0(H10, A)
}
// @from(Ln 158974, Col 0)
function TJ8(A) {
  return FA0(H10, A)
}
// @from(Ln 158978, Col 0)
function PJ8(A) {
  return HA0(szB, A)
}
// @from(Ln 158982, Col 0)
function SJ8(A) {
  return EA0(tzB, A)
}
// @from(Ln 158986, Col 0)
function aRA(A) {
  return zA0(ezB, A)
}
// @from(Ln 158990, Col 0)
function E10() {
  return $A0(A$B)
}
// @from(Ln 158994, Col 0)
function yD() {
  return CIA(Q$B)
}
// @from(Ln 158998, Col 0)
function iQ1(A) {
  return CA0(B$B, A)
}
// @from(Ln 159002, Col 0)
function xJ8(A) {
  return UA0(G$B, A)
}
// @from(Ln 159006, Col 0)
function yJ8(A) {
  return qA0(nQ1, A)
}
// @from(Ln 159010, Col 0)
function iB(A, Q) {
  return dRA(Z$B, A, Q)
}
// @from(Ln 159014, Col 0)
function vJ8(A) {
  let Q = A._zod.def.shape;
  return I9(Object.keys(Q))
}
// @from(Ln 159019, Col 0)
function CB(A, Q) {
  let B = {
    type: "object",
    get shape() {
      return lB.assignProp(this, "shape", {
        ...A
      }), this.shape
    },
    ...lB.normalizeParams(Q)
  };
  return new aQ1(B)
}
// @from(Ln 159032, Col 0)
function kJ8(A, Q) {
  return new aQ1({
    type: "object",
    get shape() {
      return lB.assignProp(this, "shape", {
        ...A
      }), this.shape
    },
    catchall: iQ1(),
    ...lB.normalizeParams(Q)
  })
}
// @from(Ln 159045, Col 0)
function hH(A, Q) {
  return new aQ1({
    type: "object",
    get shape() {
      return lB.assignProp(this, "shape", {
        ...A
      }), this.shape
    },
    catchall: yD(),
    ...lB.normalizeParams(Q)
  })
}
// @from(Ln 159058, Col 0)
function _Z(A, Q) {
  return new z10({
    type: "union",
    options: A,
    ...lB.normalizeParams(Q)
  })
}
// @from(Ln 159066, Col 0)
function oQ1(A, Q, B) {
  return new Y$B({
    type: "union",
    options: Q,
    discriminator: A,
    ...lB.normalizeParams(B)
  })
}
// @from(Ln 159075, Col 0)
function oRA(A, Q) {
  return new J$B({
    type: "intersection",
    left: A,
    right: Q
  })
}
// @from(Ln 159083, Col 0)
function bJ8(A, Q, B) {
  let G = Q instanceof v6,
    Z = G ? B : Q;
  return new X$B({
    type: "tuple",
    items: A,
    rest: G ? Q : null,
    ...lB.normalizeParams(Z)
  })
}
// @from(Ln 159094, Col 0)
function pI(A, Q, B) {
  return new $10({
    type: "record",
    keyType: A,
    valueType: Q,
    ...lB.normalizeParams(B)
  })
}
// @from(Ln 159103, Col 0)
function fJ8(A, Q, B) {
  return new $10({
    type: "record",
    keyType: _Z([A, iQ1()]),
    valueType: Q,
    ...lB.normalizeParams(B)
  })
}
// @from(Ln 159112, Col 0)
function hJ8(A, Q, B) {
  return new I$B({
    type: "map",
    keyType: A,
    valueType: Q,
    ...lB.normalizeParams(B)
  })
}
// @from(Ln 159121, Col 0)
function gJ8(A, Q) {
  return new D$B({
    type: "set",
    valueType: A,
    ...lB.normalizeParams(Q)
  })
}
// @from(Ln 159129, Col 0)
function YF(A, Q) {
  let B = Array.isArray(A) ? Object.fromEntries(A.map((G) => [G, G])) : A;
  return new cRA({
    type: "enum",
    entries: B,
    ...lB.normalizeParams(Q)
  })
}
// @from(Ln 159138, Col 0)
function uJ8(A, Q) {
  return new cRA({
    type: "enum",
    entries: A,
    ...lB.normalizeParams(Q)
  })
}
// @from(Ln 159146, Col 0)
function I9(A, Q) {
  return new W$B({
    type: "literal",
    values: Array.isArray(A) ? A : [A],
    ...lB.normalizeParams(Q)
  })
}
// @from(Ln 159154, Col 0)
function mJ8(A) {
  return TA0(K$B, A)
}
// @from(Ln 159158, Col 0)
function U10(A) {
  return new C10({
    type: "transform",
    transform: A
  })
}
// @from(Ln 159165, Col 0)
function w9(A) {
  return new q10({
    type: "optional",
    innerType: A
  })
}
// @from(Ln 159172, Col 0)
function pQ1(A) {
  return new V$B({
    type: "nullable",
    innerType: A
  })
}
// @from(Ln 159179, Col 0)
function dJ8(A) {
  return w9(pQ1(A))
}
// @from(Ln 159183, Col 0)
function H$B(A, Q) {
  return new F$B({
    type: "default",
    innerType: A,
    get defaultValue() {
      return typeof Q === "function" ? Q() : Q
    }
  })
}
// @from(Ln 159193, Col 0)
function z$B(A, Q) {
  return new E$B({
    type: "prefault",
    innerType: A,
    get defaultValue() {
      return typeof Q === "function" ? Q() : Q
    }
  })
}
// @from(Ln 159203, Col 0)
function $$B(A, Q) {
  return new N10({
    type: "nonoptional",
    innerType: A,
    ...lB.normalizeParams(Q)
  })
}
// @from(Ln 159211, Col 0)
function cJ8(A) {
  return new C$B({
    type: "success",
    innerType: A
  })
}
// @from(Ln 159218, Col 0)
function q$B(A, Q) {
  return new U$B({
    type: "catch",
    innerType: A,
    catchValue: typeof Q === "function" ? Q : () => Q
  })
}
// @from(Ln 159226, Col 0)
function pJ8(A) {
  return wA0(N$B, A)
}
// @from(Ln 159230, Col 0)
function lQ1(A, Q) {
  return new w10({
    type: "pipe",
    in: A,
    out: Q
  })
}
// @from(Ln 159238, Col 0)
function L$B(A) {
  return new w$B({
    type: "readonly",
    innerType: A
  })
}
// @from(Ln 159245, Col 0)
function lJ8(A, Q) {
  return new O$B({
    type: "template_literal",
    parts: A,
    ...lB.normalizeParams(Q)
  })
}
// @from(Ln 159253, Col 0)
function R$B(A) {
  return new M$B({
    type: "lazy",
    getter: A
  })
}
// @from(Ln 159260, Col 0)
function iJ8(A) {
  return new _$B({
    type: "promise",
    innerType: A
  })
}
// @from(Ln 159267, Col 0)
function j$B(A, Q) {
  let B = new XI({
    check: "custom",
    ...lB.normalizeParams(Q)
  });
  return B._zod.check = A, B
}
// @from(Ln 159275, Col 0)
function L10(A, Q) {
  return PA0(rQ1, A ?? (() => !0), Q)
}
// @from(Ln 159279, Col 0)
function T$B(A, Q = {}) {
  return SA0(rQ1, A, Q)
}
// @from(Ln 159283, Col 0)
function P$B(A, Q) {
  let B = j$B((G) => {
    return G.addIssue = (Z) => {
      if (typeof Z === "string") G.issues.push(lB.issue(Z, G.value, B._zod.def));
      else {
        let Y = Z;
        if (Y.fatal) Y.continue = !1;
        Y.code ?? (Y.code = "custom"), Y.input ?? (Y.input = G.value), Y.inst ?? (Y.inst = B), Y.continue ?? (Y.continue = !B._zod.def.abort), G.issues.push(lB.issue(Y))
      }
    }, A(G.value, G)
  }, Q);
  return B
}
// @from(Ln 159297, Col 0)
function nJ8(A, Q = {
  error: `Input not instance of ${A.name}`
}) {
  let B = new rQ1({
    type: "custom",
    check: "custom",
    fn: (G) => G instanceof A,
    abort: !0,
    ...lB.normalizeParams(Q)
  });
  return B._zod.bag.Class = A, B
}
// @from(Ln 159310, Col 0)
function oJ8(A) {
  let Q = R$B(() => {
    return _Z([h1(A), c7(), RZ(), aRA(), iB(Q), pI(h1(), Q)])
  });
  return Q
}
// @from(Ln 159317, Col 0)
function sQ1(A, Q) {
  return lQ1(U10(A), Q)
}
// @from(Ln 159320, Col 4)
O8
// @from(Ln 159320, Col 8)
oA0
// @from(Ln 159320, Col 13)
pRA
// @from(Ln 159320, Col 18)
mY
// @from(Ln 159320, Col 22)
rA0
// @from(Ln 159320, Col 27)
cQ1
// @from(Ln 159320, Col 32)
ru
// @from(Ln 159320, Col 36)
sA0
// @from(Ln 159320, Col 41)
eA0
// @from(Ln 159320, Col 46)
A10
// @from(Ln 159320, Col 51)
Q10
// @from(Ln 159320, Col 56)
B10
// @from(Ln 159320, Col 61)
G10
// @from(Ln 159320, Col 66)
Z10
// @from(Ln 159320, Col 71)
Y10
// @from(Ln 159320, Col 76)
J10
// @from(Ln 159320, Col 81)
X10
// @from(Ln 159320, Col 86)
I10
// @from(Ln 159320, Col 91)
D10
// @from(Ln 159320, Col 96)
W10
// @from(Ln 159320, Col 101)
K10
// @from(Ln 159320, Col 106)
V10
// @from(Ln 159320, Col 111)
F10
// @from(Ln 159320, Col 116)
rzB
// @from(Ln 159320, Col 121)
lRA
// @from(Ln 159320, Col 126)
OIA
// @from(Ln 159320, Col 131)
iRA
// @from(Ln 159320, Col 136)
nRA
// @from(Ln 159320, Col 141)
H10
// @from(Ln 159320, Col 146)
szB
// @from(Ln 159320, Col 151)
tzB
// @from(Ln 159320, Col 156)
ezB
// @from(Ln 159320, Col 161)
A$B
// @from(Ln 159320, Col 166)
Q$B
// @from(Ln 159320, Col 171)
B$B
// @from(Ln 159320, Col 176)
G$B
// @from(Ln 159320, Col 181)
nQ1
// @from(Ln 159320, Col 186)
Z$B
// @from(Ln 159320, Col 191)
aQ1
// @from(Ln 159320, Col 196)
z10
// @from(Ln 159320, Col 201)
Y$B
// @from(Ln 159320, Col 206)
J$B
// @from(Ln 159320, Col 211)
X$B
// @from(Ln 159320, Col 216)
$10
// @from(Ln 159320, Col 221)
I$B
// @from(Ln 159320, Col 226)
D$B
// @from(Ln 159320, Col 231)
cRA
// @from(Ln 159320, Col 236)
W$B
// @from(Ln 159320, Col 241)
K$B
// @from(Ln 159320, Col 246)
C10
// @from(Ln 159320, Col 251)
q10
// @from(Ln 159320, Col 256)
V$B
// @from(Ln 159320, Col 261)
F$B
// @from(Ln 159320, Col 266)
E$B
// @from(Ln 159320, Col 271)
N10
// @from(Ln 159320, Col 276)
C$B
// @from(Ln 159320, Col 281)
U$B
// @from(Ln 159320, Col 286)
N$B
// @from(Ln 159320, Col 291)
w10
// @from(Ln 159320, Col 296)
w$B
// @from(Ln 159320, Col 301)
O$B
// @from(Ln 159320, Col 306)
M$B
// @from(Ln 159320, Col 311)
_$B
// @from(Ln 159320, Col 316)
rQ1
// @from(Ln 159320, Col 321)
aJ8 = (...A) => xA0({
  Pipe: w10,
  Boolean: iRA,
  String: pRA,
  Transform: C10
}, ...A)
// @from(Ln 159326, Col 4)
dQ1 = w(() => {
  EC();
  EC();
  fA0();
  mQ1();
  nA0();
  O8 = z0("ZodType", (A, Q) => {
    return v6.init(A, Q), A.def = Q, Object.defineProperty(A, "_def", {
      value: Q
    }), A.check = (...B) => {
      return A.clone({
        ...Q,
        checks: [...Q.checks ?? [], ...B.map((G) => typeof G === "function" ? {
          _zod: {
            check: G,
            def: {
              check: "custom"
            },
            onattach: []
          }
        } : G)]
      })
    }, A.clone = (B, G) => gL(A, B, G), A.brand = () => A, A.register = (B, G) => {
      return B.add(A, G), A
    }, A.parse = (B, G) => cA0(A, B, G, {
      callee: A.parse
    }), A.safeParse = (B, G) => lA0(A, B, G), A.parseAsync = async (B, G) => pA0(A, B, G, {
      callee: A.parseAsync
    }), A.safeParseAsync = async (B, G) => iA0(A, B, G), A.spa = A.safeParseAsync, A.refine = (B, G) => A.check(T$B(B, G)), A.superRefine = (B) => A.check(P$B(B)), A.overwrite = (B) => A.check(ou(B)), A.optional = () => w9(A), A.nullable = () => pQ1(A), A.nullish = () => w9(pQ1(A)), A.nonoptional = (B) => $$B(A, B), A.array = () => iB(A), A.or = (B) => _Z([A, B]), A.and = (B) => oRA(A, B), A.transform = (B) => lQ1(A, U10(B)), A.default = (B) => H$B(A, B), A.prefault = (B) => z$B(A, B), A.catch = (B) => q$B(A, B), A.pipe = (B) => lQ1(A, B), A.readonly = () => L$B(A), A.describe = (B) => {
      let G = A.clone();
      return Ek.add(G, {
        description: B
      }), G
    }, Object.defineProperty(A, "description", {
      get() {
        return Ek.get(A)?.description
      },
      configurable: !0
    }), A.meta = (...B) => {
      if (B.length === 0) return Ek.get(A);
      let G = A.clone();
      return Ek.add(G, B[0]), G
    }, A.isOptional = () => A.safeParse(void 0).success, A.isNullable = () => A.safeParse(null).success, A
  }), oA0 = z0("_ZodString", (A, Q) => {
    EBA.init(A, Q), O8.init(A, Q);
    let B = A._zod.bag;
    A.format = B.format ?? null, A.minLength = B.minimum ?? null, A.maxLength = B.maximum ?? null, A.regex = (...G) => A.check(SRA(...G)), A.includes = (...G) => A.check(vRA(...G)), A.startsWith = (...G) => A.check(kRA(...G)), A.endsWith = (...G) => A.check(bRA(...G)), A.min = (...G) => A.check(qa(...G)), A.max = (...G) => A.check(qIA(...G)), A.length = (...G) => A.check(NIA(...G)), A.nonempty = (...G) => A.check(qa(1, ...G)), A.lowercase = (G) => A.check(xRA(G)), A.uppercase = (G) => A.check(yRA(G)), A.trim = () => A.check(gRA()), A.normalize = (...G) => A.check(hRA(...G)), A.toLowerCase = () => A.check(uRA()), A.toUpperCase = () => A.check(mRA())
  }), pRA = z0("ZodString", (A, Q) => {
    EBA.init(A, Q), oA0.init(A, Q), A.email = (B) => A.check(EQ1(rA0, B)), A.url = (B) => A.check(qQ1(sA0, B)), A.jwt = (B) => A.check(kQ1(F10, B)), A.emoji = (B) => A.check(NQ1(eA0, B)), A.guid = (B) => A.check(TRA(cQ1, B)), A.uuid = (B) => A.check(zQ1(ru, B)), A.uuidv4 = (B) => A.check($Q1(ru, B)), A.uuidv6 = (B) => A.check(CQ1(ru, B)), A.uuidv7 = (B) => A.check(UQ1(ru, B)), A.nanoid = (B) => A.check(wQ1(A10, B)), A.guid = (B) => A.check(TRA(cQ1, B)), A.cuid = (B) => A.check(LQ1(Q10, B)), A.cuid2 = (B) => A.check(OQ1(B10, B)), A.ulid = (B) => A.check(MQ1(G10, B)), A.base64 = (B) => A.check(xQ1(W10, B)), A.base64url = (B) => A.check(yQ1(K10, B)), A.xid = (B) => A.check(RQ1(Z10, B)), A.ksuid = (B) => A.check(_Q1(Y10, B)), A.ipv4 = (B) => A.check(jQ1(J10, B)), A.ipv6 = (B) => A.check(TQ1(X10, B)), A.cidrv4 = (B) => A.check(PQ1(I10, B)), A.cidrv6 = (B) => A.check(SQ1(D10, B)), A.e164 = (B) => A.check(vQ1(V10, B)), A.datetime = (B) => A.check(hA0(B)), A.date = (B) => A.check(gA0(B)), A.time = (B) => A.check(uA0(B)), A.duration = (B) => A.check(mA0(B))
  });
  mY = z0("ZodStringFormat", (A, Q) => {
    QY.init(A, Q), oA0.init(A, Q)
  }), rA0 = z0("ZodEmail", (A, Q) => {
    Jt1.init(A, Q), mY.init(A, Q)
  });
  cQ1 = z0("ZodGUID", (A, Q) => {
    Zt1.init(A, Q), mY.init(A, Q)
  });
  ru = z0("ZodUUID", (A, Q) => {
    Yt1.init(A, Q), mY.init(A, Q)
  });
  sA0 = z0("ZodURL", (A, Q) => {
    Xt1.init(A, Q), mY.init(A, Q)
  });
  eA0 = z0("ZodEmoji", (A, Q) => {
    It1.init(A, Q), mY.init(A, Q)
  });
  A10 = z0("ZodNanoID", (A, Q) => {
    Dt1.init(A, Q), mY.init(A, Q)
  });
  Q10 = z0("ZodCUID", (A, Q) => {
    Wt1.init(A, Q), mY.init(A, Q)
  });
  B10 = z0("ZodCUID2", (A, Q) => {
    Kt1.init(A, Q), mY.init(A, Q)
  });
  G10 = z0("ZodULID", (A, Q) => {
    Vt1.init(A, Q), mY.init(A, Q)
  });
  Z10 = z0("ZodXID", (A, Q) => {
    Ft1.init(A, Q), mY.init(A, Q)
  });
  Y10 = z0("ZodKSUID", (A, Q) => {
    Ht1.init(A, Q), mY.init(A, Q)
  });
  J10 = z0("ZodIPv4", (A, Q) => {
    Ut1.init(A, Q), mY.init(A, Q)
  });
  X10 = z0("ZodIPv6", (A, Q) => {
    qt1.init(A, Q), mY.init(A, Q)
  });
  I10 = z0("ZodCIDRv4", (A, Q) => {
    Nt1.init(A, Q), mY.init(A, Q)
  });
  D10 = z0("ZodCIDRv6", (A, Q) => {
    wt1.init(A, Q), mY.init(A, Q)
  });
  W10 = z0("ZodBase64", (A, Q) => {
    Ot1.init(A, Q), mY.init(A, Q)
  });
  K10 = z0("ZodBase64URL", (A, Q) => {
    Mt1.init(A, Q), mY.init(A, Q)
  });
  V10 = z0("ZodE164", (A, Q) => {
    Rt1.init(A, Q), mY.init(A, Q)
  });
  F10 = z0("ZodJWT", (A, Q) => {
    _t1.init(A, Q), mY.init(A, Q)
  });
  rzB = z0("ZodCustomStringFormat", (A, Q) => {
    jt1.init(A, Q), mY.init(A, Q)
  });
  lRA = z0("ZodNumber", (A, Q) => {
    WQ1.init(A, Q), O8.init(A, Q), A.gt = (G, Z) => A.check(au(G, Z)), A.gte = (G, Z) => A.check(sq(G, Z)), A.min = (G, Z) => A.check(sq(G, Z)), A.lt = (G, Z) => A.check(nu(G, Z)), A.lte = (G, Z) => A.check(lR(G, Z)), A.max = (G, Z) => A.check(lR(G, Z)), A.int = (G) => A.check(aA0(G)), A.safe = (G) => A.check(aA0(G)), A.positive = (G) => A.check(au(0, G)), A.nonnegative = (G) => A.check(sq(0, G)), A.negative = (G) => A.check(nu(0, G)), A.nonpositive = (G) => A.check(lR(0, G)), A.multipleOf = (G, Z) => A.check($BA(G, Z)), A.step = (G, Z) => A.check($BA(G, Z)), A.finite = () => A;
    let B = A._zod.bag;
    A.minValue = Math.max(B.minimum ?? Number.NEGATIVE_INFINITY, B.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, A.maxValue = Math.min(B.maximum ?? Number.POSITIVE_INFINITY, B.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, A.isInt = (B.format ?? "").includes("int") || Number.isSafeInteger(B.multipleOf ?? 0.5), A.isFinite = !0, A.format = B.format ?? null
  });
  OIA = z0("ZodNumberFormat", (A, Q) => {
    Tt1.init(A, Q), lRA.init(A, Q)
  });
  iRA = z0("ZodBoolean", (A, Q) => {
    wRA.init(A, Q), O8.init(A, Q)
  });
  nRA = z0("ZodBigInt", (A, Q) => {
    KQ1.init(A, Q), O8.init(A, Q), A.gte = (G, Z) => A.check(sq(G, Z)), A.min = (G, Z) => A.check(sq(G, Z)), A.gt = (G, Z) => A.check(au(G, Z)), A.gte = (G, Z) => A.check(sq(G, Z)), A.min = (G, Z) => A.check(sq(G, Z)), A.lt = (G, Z) => A.check(nu(G, Z)), A.lte = (G, Z) => A.check(lR(G, Z)), A.max = (G, Z) => A.check(lR(G, Z)), A.positive = (G) => A.check(au(BigInt(0), G)), A.negative = (G) => A.check(nu(BigInt(0), G)), A.nonpositive = (G) => A.check(lR(BigInt(0), G)), A.nonnegative = (G) => A.check(sq(BigInt(0), G)), A.multipleOf = (G, Z) => A.check($BA(G, Z));
    let B = A._zod.bag;
    A.minValue = B.minimum ?? null, A.maxValue = B.maximum ?? null, A.format = B.format ?? null
  });
  H10 = z0("ZodBigIntFormat", (A, Q) => {
    Pt1.init(A, Q), nRA.init(A, Q)
  });
  szB = z0("ZodSymbol", (A, Q) => {
    St1.init(A, Q), O8.init(A, Q)
  });
  tzB = z0("ZodUndefined", (A, Q) => {
    xt1.init(A, Q), O8.init(A, Q)
  });
  ezB = z0("ZodNull", (A, Q) => {
    yt1.init(A, Q), O8.init(A, Q)
  });
  A$B = z0("ZodAny", (A, Q) => {
    vt1.init(A, Q), O8.init(A, Q)
  });
  Q$B = z0("ZodUnknown", (A, Q) => {
    zIA.init(A, Q), O8.init(A, Q)
  });
  B$B = z0("ZodNever", (A, Q) => {
    kt1.init(A, Q), O8.init(A, Q)
  });
  G$B = z0("ZodVoid", (A, Q) => {
    bt1.init(A, Q), O8.init(A, Q)
  });
  nQ1 = z0("ZodDate", (A, Q) => {
    ft1.init(A, Q), O8.init(A, Q), A.min = (G, Z) => A.check(sq(G, Z)), A.max = (G, Z) => A.check(lR(G, Z));
    let B = A._zod.bag;
    A.minDate = B.minimum ? new Date(B.minimum) : null, A.maxDate = B.maximum ? new Date(B.maximum) : null
  });
  Z$B = z0("ZodArray", (A, Q) => {
    LRA.init(A, Q), O8.init(A, Q), A.element = Q.element, A.min = (B, G) => A.check(qa(B, G)), A.nonempty = (B) => A.check(qa(1, B)), A.max = (B, G) => A.check(qIA(B, G)), A.length = (B, G) => A.check(NIA(B, G)), A.unwrap = () => A.element
  });
  aQ1 = z0("ZodObject", (A, Q) => {
    ht1.init(A, Q), O8.init(A, Q), lB.defineLazy(A, "shape", () => Q.shape), A.keyof = () => YF(Object.keys(A._zod.def.shape)), A.catchall = (B) => A.clone({
      ...A._zod.def,
      catchall: B
    }), A.passthrough = () => A.clone({
      ...A._zod.def,
      catchall: yD()
    }), A.loose = () => A.clone({
      ...A._zod.def,
      catchall: yD()
    }), A.strict = () => A.clone({
      ...A._zod.def,
      catchall: iQ1()
    }), A.strip = () => A.clone({
      ...A._zod.def,
      catchall: void 0
    }), A.extend = (B) => {
      return lB.extend(A, B)
    }, A.merge = (B) => lB.merge(A, B), A.pick = (B) => lB.pick(A, B), A.omit = (B) => lB.omit(A, B), A.partial = (...B) => lB.partial(q10, A, B[0]), A.required = (...B) => lB.required(N10, A, B[0])
  });
  z10 = z0("ZodUnion", (A, Q) => {
    VQ1.init(A, Q), O8.init(A, Q), A.options = Q.options
  });
  Y$B = z0("ZodDiscriminatedUnion", (A, Q) => {
    z10.init(A, Q), gt1.init(A, Q)
  });
  J$B = z0("ZodIntersection", (A, Q) => {
    ut1.init(A, Q), O8.init(A, Q)
  });
  X$B = z0("ZodTuple", (A, Q) => {
    zBA.init(A, Q), O8.init(A, Q), A.rest = (B) => A.clone({
      ...A._zod.def,
      rest: B
    })
  });
  $10 = z0("ZodRecord", (A, Q) => {
    mt1.init(A, Q), O8.init(A, Q), A.keyType = Q.keyType, A.valueType = Q.valueType
  });
  I$B = z0("ZodMap", (A, Q) => {
    dt1.init(A, Q), O8.init(A, Q), A.keyType = Q.keyType, A.valueType = Q.valueType
  });
  D$B = z0("ZodSet", (A, Q) => {
    ct1.init(A, Q), O8.init(A, Q), A.min = (...B) => A.check(CBA(...B)), A.nonempty = (B) => A.check(CBA(1, B)), A.max = (...B) => A.check(UIA(...B)), A.size = (...B) => A.check(PRA(...B))
  });
  cRA = z0("ZodEnum", (A, Q) => {
    pt1.init(A, Q), O8.init(A, Q), A.enum = Q.entries, A.options = Object.values(Q.entries);
    let B = new Set(Object.keys(Q.entries));
    A.extract = (G, Z) => {
      let Y = {};
      for (let J of G)
        if (B.has(J)) Y[J] = Q.entries[J];
        else throw Error(`Key ${J} not found in enum`);
      return new cRA({
        ...Q,
        checks: [],
        ...lB.normalizeParams(Z),
        entries: Y
      })
    }, A.exclude = (G, Z) => {
      let Y = {
        ...Q.entries
      };
      for (let J of G)
        if (B.has(J)) delete Y[J];
        else throw Error(`Key ${J} not found in enum`);
      return new cRA({
        ...Q,
        checks: [],
        ...lB.normalizeParams(Z),
        entries: Y
      })
    }
  });
  W$B = z0("ZodLiteral", (A, Q) => {
    lt1.init(A, Q), O8.init(A, Q), A.values = new Set(Q.values), Object.defineProperty(A, "value", {
      get() {
        if (Q.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
        return Q.values[0]
      }
    })
  });
  K$B = z0("ZodFile", (A, Q) => {
    it1.init(A, Q), O8.init(A, Q), A.min = (B, G) => A.check(CBA(B, G)), A.max = (B, G) => A.check(UIA(B, G)), A.mime = (B, G) => A.check(fRA(Array.isArray(B) ? B : [B], G))
  });
  C10 = z0("ZodTransform", (A, Q) => {
    ORA.init(A, Q), O8.init(A, Q), A._zod.parse = (B, G) => {
      B.addIssue = (Y) => {
        if (typeof Y === "string") B.issues.push(lB.issue(Y, B.value, Q));
        else {
          let J = Y;
          if (J.fatal) J.continue = !1;
          J.code ?? (J.code = "custom"), J.input ?? (J.input = B.value), J.inst ?? (J.inst = A), J.continue ?? (J.continue = !0), B.issues.push(lB.issue(J))
        }
      };
      let Z = Q.transform(B.value, B);
      if (Z instanceof Promise) return Z.then((Y) => {
        return B.value = Y, B
      });
      return B.value = Z, B
    }
  });
  q10 = z0("ZodOptional", (A, Q) => {
    nt1.init(A, Q), O8.init(A, Q), A.unwrap = () => A._zod.def.innerType
  });
  V$B = z0("ZodNullable", (A, Q) => {
    at1.init(A, Q), O8.init(A, Q), A.unwrap = () => A._zod.def.innerType
  });
  F$B = z0("ZodDefault", (A, Q) => {
    ot1.init(A, Q), O8.init(A, Q), A.unwrap = () => A._zod.def.innerType, A.removeDefault = A.unwrap
  });
  E$B = z0("ZodPrefault", (A, Q) => {
    rt1.init(A, Q), O8.init(A, Q), A.unwrap = () => A._zod.def.innerType
  });
  N10 = z0("ZodNonOptional", (A, Q) => {
    st1.init(A, Q), O8.init(A, Q), A.unwrap = () => A._zod.def.innerType
  });
  C$B = z0("ZodSuccess", (A, Q) => {
    tt1.init(A, Q), O8.init(A, Q), A.unwrap = () => A._zod.def.innerType
  });
  U$B = z0("ZodCatch", (A, Q) => {
    et1.init(A, Q), O8.init(A, Q), A.unwrap = () => A._zod.def.innerType, A.removeCatch = A.unwrap
  });
  N$B = z0("ZodNaN", (A, Q) => {
    Ae1.init(A, Q), O8.init(A, Q)
  });
  w10 = z0("ZodPipe", (A, Q) => {
    MRA.init(A, Q), O8.init(A, Q), A.in = Q.in, A.out = Q.out
  });
  w$B = z0("ZodReadonly", (A, Q) => {
    Qe1.init(A, Q), O8.init(A, Q)
  });
  O$B = z0("ZodTemplateLiteral", (A, Q) => {
    Be1.init(A, Q), O8.init(A, Q)
  });
  M$B = z0("ZodLazy", (A, Q) => {
    Ze1.init(A, Q), O8.init(A, Q), A.unwrap = () => A._zod.def.getter()
  });
  _$B = z0("ZodPromise", (A, Q) => {
    Ge1.init(A, Q), O8.init(A, Q), A.unwrap = () => A._zod.def.innerType
  });
  rQ1 = z0("ZodCustom", (A, Q) => {
    Ye1.init(A, Q), O8.init(A, Q)
  })
})
// @from(Ln 159631, Col 0)
function rJ8(A) {
  pW({
    customError: A
  })
}
// @from(Ln 159637, Col 0)
function sJ8() {
  return pW().customError
}
// @from(Ln 159640, Col 4)
O10
// @from(Ln 159641, Col 4)
S$B = w(() => {
  EC();
  O10 = {
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
// @from(Ln 159657, Col 4)
rRA = {}
// @from(Ln 159666, Col 0)
function tJ8(A) {
  return oe1(pRA, A)
}
// @from(Ln 159670, Col 0)
function eJ8(A) {
  return BA0(lRA, A)
}
// @from(Ln 159674, Col 0)
function AX8(A) {
  return DA0(iRA, A)
}
// @from(Ln 159678, Col 0)
function QX8(A) {
  return KA0(nRA, A)
}
// @from(Ln 159682, Col 0)
function BX8(A) {
  return NA0(nQ1, A)
}
// @from(Ln 159685, Col 4)
x$B = w(() => {
  EC();
  dQ1()
})
// @from(Ln 159689, Col 4)
m = {}
// @from(Ln 159899, Col 4)
M10 = w(() => {
  EC();
  EC();
  Ve1();
  EC();
  FQ1();
  mQ1();
  mQ1();
  x$B();
  dQ1();
  fA0();
  dA0();
  nA0();
  S$B();
  pW(_RA())
})
// @from(Ln 159915, Col 4)
y$B
// @from(Ln 159916, Col 4)
R10 = w(() => {
  M10();
  M10();
  y$B = m
})
// @from(Ln 159921, Col 4)
k2
// @from(Ln 159922, Col 4)
j9 = w(() => {
  R10();
  R10();
  k2 = y$B
})
// @from(Ln 159928, Col 0)
function tQ1(A) {
  switch (A) {
    case "bypassPermissions":
      return "bypassPermissions";
    case "acceptEdits":
      return "acceptEdits";
    case "plan":
      return "plan";
    case "delegate":
      return "delegate";
    case "dontAsk":
      return "dontAsk";
    case "default":
      return "default";
    default:
      return "default"
  }
}
// @from(Ln 159947, Col 0)
function su(A) {
  switch (A) {
    case "default":
      return "Default";
    case "plan":
      return "Plan Mode";
    case "delegate":
      return "Delegate Mode";
    case "acceptEdits":
      return "Accept edits";
    case "bypassPermissions":
      return "Bypass Permissions";
    case "dontAsk":
      return "Don't Ask"
  }
}
// @from(Ln 159964, Col 0)
function b$B(A) {
  return A === "default" || A === void 0
}
// @from(Ln 159968, Col 0)
function f$B(A) {
  switch (A) {
    case "default":
      return "";
    case "plan":
      return "⏸";
    case "delegate":
      return "⇢";
    case "acceptEdits":
      return "⏵⏵";
    case "bypassPermissions":
      return "⏵⏵";
    case "dontAsk":
      return "⏵⏵"
  }
}
// @from(Ln 159985, Col 0)
function iR(A) {
  switch (A) {
    case "default":
      return "text";
    case "plan":
      return "planMode";
    case "delegate":
      return "delegateMode";
    case "acceptEdits":
      return "autoAccept";
    case "bypassPermissions":
      return "error";
    case "dontAsk":
      return "error"
  }
}
// @from(Ln 160001, Col 4)
NP
// @from(Ln 160001, Col 8)
k$B
// @from(Ln 160002, Col 4)
mL = w(() => {
  j9();
  NP = ["acceptEdits", "bypassPermissions", "default", "delegate", "dontAsk", "plan"], k$B = k2.enum(NP)
})
// @from(Ln 160007, Col 0)
function j2(A, Q, B, G, Z) {
  if (G === "m") throw TypeError("Private method is not writable");
  if (G === "a" && !Z) throw TypeError("Private accessor was defined without a setter");
  if (typeof Q === "function" ? A !== Q || !Z : !Q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
  return G === "a" ? Z.call(A, B) : Z ? Z.value = B : Q.set(A, B), B
}
// @from(Ln 160014, Col 0)
function u0(A, Q, B, G) {
  if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
  if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
  return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
}
// @from(Ln 160019, Col 4)
tu = () => {}
// @from(Ln 160020, Col 4)
GX8 = (A) => {
    let Q = 0,
      B = [];
    while (Q < A.length) {
      let G = A[Q];
      if (G === "\\") {
        Q++;
        continue
      }
      if (G === "{") {
        B.push({
          type: "brace",
          value: "{"
        }), Q++;
        continue
      }
      if (G === "}") {
        B.push({
          type: "brace",
          value: "}"
        }), Q++;
        continue
      }
      if (G === "[") {
        B.push({
          type: "paren",
          value: "["
        }), Q++;
        continue
      }
      if (G === "]") {
        B.push({
          type: "paren",
          value: "]"
        }), Q++;
        continue
      }
      if (G === ":") {
        B.push({
          type: "separator",
          value: ":"
        }), Q++;
        continue
      }
      if (G === ",") {
        B.push({
          type: "delimiter",
          value: ","
        }), Q++;
        continue
      }
      if (G === '"') {
        let X = "",
          I = !1;
        G = A[++Q];
        while (G !== '"') {
          if (Q === A.length) {
            I = !0;
            break
          }
          if (G === "\\") {
            if (Q++, Q === A.length) {
              I = !0;
              break
            }
            X += G + A[Q], G = A[++Q]
          } else X += G, G = A[++Q]
        }
        if (G = A[++Q], !I) B.push({
          type: "string",
          value: X
        });
        continue
      }
      if (G && /\s/.test(G)) {
        Q++;
        continue
      }
      let Y = /[0-9]/;
      if (G && Y.test(G) || G === "-" || G === ".") {
        let X = "";
        if (G === "-") X += G, G = A[++Q];
        while (G && Y.test(G) || G === ".") X += G, G = A[++Q];
        B.push({
          type: "number",
          value: X
        });
        continue
      }
      let J = /[a-z]/i;
      if (G && J.test(G)) {
        let X = "";
        while (G && J.test(G)) {
          if (Q === A.length) break;
          X += G, G = A[++Q]
        }
        if (X == "true" || X == "false" || X === "null") B.push({
          type: "name",
          value: X
        });
        else {
          Q++;
          continue
        }
        continue
      }
      Q++
    }
    return B
  }
// @from(Ln 160130, Col 2)
MIA = (A) => {
    if (A.length === 0) return A;
    let Q = A[A.length - 1];
    switch (Q.type) {
      case "separator":
        return A = A.slice(0, A.length - 1), MIA(A);
        break;
      case "number":
        let B = Q.value[Q.value.length - 1];
        if (B === "." || B === "-") return A = A.slice(0, A.length - 1), MIA(A);
      case "string":
        let G = A[A.length - 2];
        if (G?.type === "delimiter") return A = A.slice(0, A.length - 1), MIA(A);
        else if (G?.type === "brace" && G.value === "{") return A = A.slice(0, A.length - 1), MIA(A);
        break;
      case "delimiter":
        return A = A.slice(0, A.length - 1), MIA(A);
        break
    }
    return A
  }
// @from(Ln 160151, Col 2)
ZX8 = (A) => {
    let Q = [];
    if (A.map((B) => {
        if (B.type === "brace")
          if (B.value === "{") Q.push("}");
          else Q.splice(Q.lastIndexOf("}"), 1);
        if (B.type === "paren")
          if (B.value === "[") Q.push("]");
          else Q.splice(Q.lastIndexOf("]"), 1)
      }), Q.length > 0) Q.reverse().map((B) => {
      if (B === "}") A.push({
        type: "brace",
        value: "}"
      });
      else if (B === "]") A.push({
        type: "paren",
        value: "]"
      })
    });
    return A
  }
// @from(Ln 160172, Col 2)
YX8 = (A) => {
    let Q = "";
    return A.map((B) => {
      switch (B.type) {
        case "string":
          Q += '"' + B.value + '"';
          break;
        default:
          Q += B.value;
          break
      }
    }), Q
  }
// @from(Ln 160185, Col 2)
eQ1 = (A) => JSON.parse(YX8(ZX8(MIA(GX8(A)))))
// @from(Ln 160186, Col 4)
_10 = () => {}
// @from(Ln 160188, Col 0)
function eu(A) {
  return typeof A === "object" && A !== null && (("name" in A) && A.name === "AbortError" || ("message" in A) && String(A.message).includes("FetchRequestCanceledException"))
}
// @from(Ln 160191, Col 4)
sRA = (A) => {
  if (A instanceof Error) return A;
  if (typeof A === "object" && A !== null) {
    try {
      if (Object.prototype.toString.call(A) === "[object Error]") {
        let Q = Error(A.message, A.cause ? {
          cause: A.cause
        } : {});
        if (A.stack) Q.stack = A.stack;
        if (A.cause && !Q.cause) Q.cause = A.cause;
        if (A.name) Q.name = A.name;
        return Q
      }
    } catch {}
    try {
      return Error(JSON.stringify(A))
    } catch {}
  }
  return Error(A)
}
// @from(Ln 160211, Col 4)
M2
// @from(Ln 160211, Col 8)
D9
// @from(Ln 160211, Col 12)
II
// @from(Ln 160211, Col 16)
zC
// @from(Ln 160211, Col 20)
$k
// @from(Ln 160211, Col 24)
tRA
// @from(Ln 160211, Col 29)
qBA
// @from(Ln 160211, Col 34)
eRA
// @from(Ln 160211, Col 39)
NBA
// @from(Ln 160211, Col 44)
A_A
// @from(Ln 160211, Col 49)
Q_A
// @from(Ln 160211, Col 54)
B_A
// @from(Ln 160211, Col 59)
G_A
// @from(Ln 160212, Col 4)
$C = w(() => {
  M2 = class M2 extends Error {};
  D9 = class D9 extends M2 {
    constructor(A, Q, B, G) {
      super(`${D9.makeMessage(A,Q,B)}`);
      this.status = A, this.headers = G, this.requestID = G?.get("request-id"), this.error = Q
    }
    static makeMessage(A, Q, B) {
      let G = Q?.message ? typeof Q.message === "string" ? Q.message : JSON.stringify(Q.message) : Q ? JSON.stringify(Q) : B;
      if (A && G) return `${A} ${G}`;
      if (A) return `${A} status code (no body)`;
      if (G) return G;
      return "(no status code or body)"
    }
    static generate(A, Q, B, G) {
      if (!A || !G) return new zC({
        message: B,
        cause: sRA(Q)
      });
      let Z = Q;
      if (A === 400) return new tRA(A, Z, B, G);
      if (A === 401) return new qBA(A, Z, B, G);
      if (A === 403) return new eRA(A, Z, B, G);
      if (A === 404) return new NBA(A, Z, B, G);
      if (A === 409) return new A_A(A, Z, B, G);
      if (A === 422) return new Q_A(A, Z, B, G);
      if (A === 429) return new B_A(A, Z, B, G);
      if (A >= 500) return new G_A(A, Z, B, G);
      return new D9(A, Z, B, G)
    }
  };
  II = class II extends D9 {
    constructor({
      message: A
    } = {}) {
      super(void 0, void 0, A || "Request was aborted.", void 0)
    }
  };
  zC = class zC extends D9 {
    constructor({
      message: A,
      cause: Q
    }) {
      super(void 0, void 0, A || "Connection error.", void 0);
      if (Q) this.cause = Q
    }
  };
  $k = class $k extends zC {
    constructor({
      message: A
    } = {}) {
      super({
        message: A ?? "Request timed out."
      })
    }
  };
  tRA = class tRA extends D9 {};
  qBA = class qBA extends D9 {};
  eRA = class eRA extends D9 {};
  NBA = class NBA extends D9 {};
  A_A = class A_A extends D9 {};
  Q_A = class Q_A extends D9 {};
  B_A = class B_A extends D9 {};
  G_A = class G_A extends D9 {}
})
// @from(Ln 160277, Col 4)
wBA = w(() => {
  $C()
})
// @from(Ln 160281, Col 0)
function h$B() {
  if (typeof fetch < "u") return fetch;
  throw Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`")
}
// @from(Ln 160286, Col 0)
function j10(...A) {
  let Q = globalThis.ReadableStream;
  if (typeof Q > "u") throw Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  return new Q(...A)
}
// @from(Ln 160292, Col 0)
function AB1(A) {
  let Q = Symbol.asyncIterator in A ? A[Symbol.asyncIterator]() : A[Symbol.iterator]();
  return j10({
    start() {},
    async pull(B) {
      let {
        done: G,
        value: Z
      } = await Q.next();
      if (G) B.close();
      else B.enqueue(Z)
    },
    async cancel() {
      await Q.return?.()
    }
  })
}
// @from(Ln 160310, Col 0)
function Z_A(A) {
  if (A[Symbol.asyncIterator]) return A;
  let Q = A.getReader();
  return {
    async next() {
      try {
        let B = await Q.read();
        if (B?.done) Q.releaseLock();
        return B
      } catch (B) {
        throw Q.releaseLock(), B
      }
    },
    async return () {
      let B = Q.cancel();
      return Q.releaseLock(), await B, {
        done: !0,
        value: void 0
      }
    },
    [Symbol.asyncIterator]() {
      return this
    }
  }
}
// @from(Ln 160335, Col 0)
async function g$B(A) {
  if (A === null || typeof A !== "object") return;
  if (A[Symbol.asyncIterator]) {
    await A[Symbol.asyncIterator]().return?.();
    return
  }
  let Q = A.getReader(),
    B = Q.cancel();
  Q.releaseLock(), await B
}
// @from(Ln 160346, Col 0)
function d$B(A) {
  let Q = 0;
  for (let Z of A) Q += Z.length;
  let B = new Uint8Array(Q),
    G = 0;
  for (let Z of A) B.set(Z, G), G += Z.length;
  return B
}
// @from(Ln 160355, Col 0)
function Y_A(A) {
  let Q;
  return (u$B ?? (Q = new globalThis.TextEncoder, u$B = Q.encode.bind(Q)))(A)
}
// @from(Ln 160360, Col 0)
function T10(A) {
  let Q;
  return (m$B ?? (Q = new globalThis.TextDecoder, m$B = Q.decode.bind(Q)))(A)
}
// @from(Ln 160364, Col 4)
u$B
// @from(Ln 160364, Col 9)
m$B
// @from(Ln 160365, Col 0)
class Na {
  constructor() {
    dL.set(this, void 0), cL.set(this, void 0), j2(this, dL, new Uint8Array, "f"), j2(this, cL, null, "f")
  }
  decode(A) {
    if (A == null) return [];
    let Q = A instanceof ArrayBuffer ? new Uint8Array(A) : typeof A === "string" ? Y_A(A) : A;
    j2(this, dL, d$B([u0(this, dL, "f"), Q]), "f");
    let B = [],
      G;
    while ((G = IX8(u0(this, dL, "f"), u0(this, cL, "f"))) != null) {
      if (G.carriage && u0(this, cL, "f") == null) {
        j2(this, cL, G.index, "f");
        continue
      }
      if (u0(this, cL, "f") != null && (G.index !== u0(this, cL, "f") + 1 || G.carriage)) {
        B.push(T10(u0(this, dL, "f").subarray(0, u0(this, cL, "f") - 1))), j2(this, dL, u0(this, dL, "f").subarray(u0(this, cL, "f")), "f"), j2(this, cL, null, "f");
        continue
      }
      let Z = u0(this, cL, "f") !== null ? G.preceding - 1 : G.preceding,
        Y = T10(u0(this, dL, "f").subarray(0, Z));
      B.push(Y), j2(this, dL, u0(this, dL, "f").subarray(G.index), "f"), j2(this, cL, null, "f")
    }
    return B
  }
  flush() {
    if (!u0(this, dL, "f").length) return [];
    return this.decode(`
`)
  }
}
// @from(Ln 160397, Col 0)
function IX8(A, Q) {
  for (let Z = Q ?? 0; Z < A.length; Z++) {
    if (A[Z] === 10) return {
      preceding: Z,
      index: Z + 1,
      carriage: !1
    };
    if (A[Z] === 13) return {
      preceding: Z,
      index: Z + 1,
      carriage: !0
    }
  }
  return null
}
// @from(Ln 160413, Col 0)
function c$B(A) {
  for (let G = 0; G < A.length - 1; G++) {
    if (A[G] === 10 && A[G + 1] === 10) return G + 2;
    if (A[G] === 13 && A[G + 1] === 13) return G + 2;
    if (A[G] === 13 && A[G + 1] === 10 && G + 3 < A.length && A[G + 2] === 13 && A[G + 3] === 10) return G + 4
  }
  return -1
}
// @from(Ln 160421, Col 4)
dL
// @from(Ln 160421, Col 8)
cL
// @from(Ln 160422, Col 4)
P10 = w(() => {
  tu();
  dL = new WeakMap, cL = new WeakMap;
  Na.NEWLINE_CHARS = new Set([`
`, "\r"]);
  Na.NEWLINE_REGEXP = /\r\n|[\n\r]/g
})
// @from(Ln 160430, Col 0)
function QB1(A) {
  if (typeof A !== "object") return {};
  return A ?? {}
}
// @from(Ln 160435, Col 0)
function l$B(A) {
  if (!A) return !0;
  for (let Q in A) return !1;
  return !0
}
// @from(Ln 160441, Col 0)
function i$B(A, Q) {
  return Object.prototype.hasOwnProperty.call(A, Q)
}
// @from(Ln 160444, Col 4)
DX8
// @from(Ln 160444, Col 9)
p$B = (A) => {
    return DX8.test(A)
  }
// @from(Ln 160447, Col 2)
S10 = (A) => (S10 = Array.isArray, S10(A))
// @from(Ln 160448, Col 2)
x10
// @from(Ln 160448, Col 7)
n$B = (A, Q) => {
    if (typeof Q !== "number" || !Number.isInteger(Q)) throw new M2(`${A} must be an integer`);
    if (Q < 0) throw new M2(`${A} must be a positive integer`);
    return Q
  }
// @from(Ln 160453, Col 2)
BB1 = (A) => {
    try {
      return JSON.parse(A)
    } catch (Q) {
      return
    }
  }
// @from(Ln 160460, Col 4)
LBA = w(() => {
  $C();
  DX8 = /^[a-z][a-z0-9+.-]*:/i, x10 = S10
})
// @from(Ln 160465, Col 0)
function J_A() {}
// @from(Ln 160467, Col 0)
function GB1(A, Q, B) {
  if (!Q || ZB1[A] > ZB1[B]) return J_A;
  else return Q[A].bind(Q)
}
// @from(Ln 160472, Col 0)
function JF(A) {
  let Q = A.logger,
    B = A.logLevel ?? "off";
  if (!Q) return WX8;
  let G = a$B.get(Q);
  if (G && G[0] === B) return G[1];
  let Z = {
    error: GB1("error", Q, B),
    warn: GB1("warn", Q, B),
    info: GB1("info", Q, B),
    debug: GB1("debug", Q, B)
  };
  return a$B.set(Q, [B, Z]), Z
}
// @from(Ln 160486, Col 4)
ZB1
// @from(Ln 160486, Col 9)
y10 = (A, Q, B) => {
    if (!A) return;
    if (i$B(ZB1, A)) return A;
    JF(B).warn(`${Q} was set to ${JSON.stringify(A)}, expected one of ${JSON.stringify(Object.keys(ZB1))}`);
    return
  }
// @from(Ln 160492, Col 2)
WX8
// @from(Ln 160492, Col 7)
a$B
// @from(Ln 160492, Col 12)
Am = (A) => {
    if (A.options) A.options = {
      ...A.options
    }, delete A.options.headers;
    if (A.headers) A.headers = Object.fromEntries((A.headers instanceof Headers ? [...A.headers] : Object.entries(A.headers)).map(([Q, B]) => [Q, Q.toLowerCase() === "x-api-key" || Q.toLowerCase() === "authorization" || Q.toLowerCase() === "cookie" || Q.toLowerCase() === "set-cookie" ? "***" : B]));
    if ("retryOfRequestLogID" in A) {
      if (A.retryOfRequestLogID) A.retryOf = A.retryOfRequestLogID;
      delete A.retryOfRequestLogID
    }
    return A
  }
// @from(Ln 160503, Col 4)
YB1 = w(() => {
  LBA();
  ZB1 = {
    off: 0,
    error: 200,
    warn: 300,
    info: 400,
    debug: 500
  };
  WX8 = {
    error: J_A,
    warn: J_A,
    info: J_A,
    debug: J_A
  }, a$B = new WeakMap
})
// @from(Ln 160519, Col 0)
async function* KX8(A, Q) {
  if (!A.body) {
    if (Q.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative") throw new M2("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
    throw new M2("Attempted to iterate over a response with no body")
  }
  let B = new o$B,
    G = new Na,
    Z = Z_A(A.body);
  for await (let Y of VX8(Z)) for (let J of G.decode(Y)) {
    let X = B.decode(J);
    if (X) yield X
  }
  for (let Y of G.flush()) {
    let J = B.decode(Y);
    if (J) yield J
  }
}
// @from(Ln 160536, Col 0)
async function* VX8(A) {
  let Q = new Uint8Array;
  for await (let B of A) {
    if (B == null) continue;
    let G = B instanceof ArrayBuffer ? new Uint8Array(B) : typeof B === "string" ? Y_A(B) : B,
      Z = new Uint8Array(Q.length + G.length);
    Z.set(Q), Z.set(G, Q.length), Q = Z;
    let Y;
    while ((Y = c$B(Q)) !== -1) yield Q.slice(0, Y), Q = Q.slice(Y)
  }
  if (Q.length > 0) yield Q
}
// @from(Ln 160548, Col 0)
class o$B {
  constructor() {
    this.event = null, this.data = [], this.chunks = []
  }
  decode(A) {
    if (A.endsWith("\r")) A = A.substring(0, A.length - 1);
    if (!A) {
      if (!this.event && !this.data.length) return null;
      let Z = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks
      };
      return this.event = null, this.data = [], this.chunks = [], Z
    }
    if (this.chunks.push(A), A.startsWith(":")) return null;
    let [Q, B, G] = FX8(A, ":");
    if (G.startsWith(" ")) G = G.substring(1);
    if (Q === "event") this.event = G;
    else if (Q === "data") this.data.push(G);
    return null
  }
}
// @from(Ln 160573, Col 0)
function FX8(A, Q) {
  let B = A.indexOf(Q);
  if (B !== -1) return [A.substring(0, B), Q, A.substring(B + Q.length)];
  return [A, "", ""]
}
// @from(Ln 160578, Col 4)
X_A
// @from(Ln 160578, Col 9)
CC
// @from(Ln 160579, Col 4)
v10 = w(() => {
  tu();
  $C();
  P10();
  LBA();
  YB1();
  $C();
  CC = class CC {
    constructor(A, Q, B) {
      this.iterator = A, X_A.set(this, void 0), this.controller = Q, j2(this, X_A, B, "f")
    }
    static fromSSEResponse(A, Q, B) {
      let G = !1,
        Z = B ? JF(B) : console;
      async function* Y() {
        if (G) throw new M2("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        G = !0;
        let J = !1;
        try {
          for await (let X of KX8(A, Q)) {
            if (X.event === "completion") try {
              yield JSON.parse(X.data)
            } catch (I) {
              throw Z.error("Could not parse message into JSON:", X.data), Z.error("From chunk:", X.raw), I
            }
            if (X.event === "message_start" || X.event === "message_delta" || X.event === "message_stop" || X.event === "content_block_start" || X.event === "content_block_delta" || X.event === "content_block_stop") try {
              yield JSON.parse(X.data)
            } catch (I) {
              throw Z.error("Could not parse message into JSON:", X.data), Z.error("From chunk:", X.raw), I
            }
            if (X.event === "ping") continue;
            if (X.event === "error") throw new D9(void 0, BB1(X.data) ?? X.data, void 0, A.headers)
          }
          J = !0
        } catch (X) {
          if (eu(X)) return;
          throw X
        } finally {
          if (!J) Q.abort()
        }
      }
      return new CC(Y, Q, B)
    }
    static fromReadableStream(A, Q, B) {
      let G = !1;
      async function* Z() {
        let J = new Na,
          X = Z_A(A);
        for await (let I of X) for (let D of J.decode(I)) yield D;
        for (let I of J.flush()) yield I
      }
      async function* Y() {
        if (G) throw new M2("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        G = !0;
        let J = !1;
        try {
          for await (let X of Z()) {
            if (J) continue;
            if (X) yield JSON.parse(X)
          }
          J = !0
        } catch (X) {
          if (eu(X)) return;
          throw X
        } finally {
          if (!J) Q.abort()
        }
      }
      return new CC(Y, Q, B)
    } [(X_A = new WeakMap, Symbol.asyncIterator)]() {
      return this.iterator()
    }
    tee() {
      let A = [],
        Q = [],
        B = this.iterator(),
        G = (Z) => {
          return {
            next: () => {
              if (Z.length === 0) {
                let Y = B.next();
                A.push(Y), Q.push(Y)
              }
              return Z.shift()
            }
          }
        };
      return [new CC(() => G(A), this.controller, u0(this, X_A, "f")), new CC(() => G(Q), this.controller, u0(this, X_A, "f"))]
    }
    toReadableStream() {
      let A = this,
        Q;
      return j10({
        async start() {
          Q = A[Symbol.asyncIterator]()
        },
        async pull(B) {
          try {
            let {
              value: G,
              done: Z
            } = await Q.next();
            if (Z) return B.close();
            let Y = Y_A(JSON.stringify(G) + `
`);
            B.enqueue(Y)
          } catch (G) {
            B.error(G)
          }
        },
        async cancel() {
          await Q.return?.()
        }
      })
    }
  }
})
// @from(Ln 160696, Col 4)
JB1 = w(() => {
  v10()
})
// @from(Ln 160700, Col 0)
function k10(A, Q) {
  if (!Q || !("parse" in (Q.output_format ?? {}))) return {
    ...A,
    content: A.content.map((B) => {
      if (B.type === "text") return {
        ...B,
        parsed: null
      };
      return B
    }),
    parsed_output: null
  };
  return b10(A, Q)
}
// @from(Ln 160715, Col 0)
function b10(A, Q) {
  let B = null,
    G = A.content.map((Z) => {
      if (Z.type === "text") {
        let Y = HX8(Q, Z.text);
        if (B === null) B = Y;
        return {
          ...Z,
          parsed: Y
        }
      }
      return Z
    });
  return {
    ...A,
    content: G,
    parsed_output: B
  }
}
// @from(Ln 160735, Col 0)
function HX8(A, Q) {
  if (A.output_format?.type !== "json_schema") return null;
  try {
    if ("parse" in A.output_format) return A.output_format.parse(Q);
    return JSON.parse(Q)
  } catch (B) {
    throw new M2(`Failed to parse structured output: ${B}`)
  }
}
// @from(Ln 160744, Col 4)
f10 = w(() => {
  $C()
})
// @from(Ln 160748, Col 0)
function e$B(A) {
  return A.type === "tool_use" || A.type === "server_tool_use" || A.type === "mcp_tool_use"
}
// @from(Ln 160752, Col 0)
function ACB(A) {}
// @from(Ln 160753, Col 4)
nR
// @from(Ln 160753, Col 8)
wa
// @from(Ln 160753, Col 12)
RIA
// @from(Ln 160753, Col 17)
I_A
// @from(Ln 160753, Col 22)
XB1
// @from(Ln 160753, Col 27)
D_A
// @from(Ln 160753, Col 32)
W_A
// @from(Ln 160753, Col 37)
IB1
// @from(Ln 160753, Col 42)
K_A
// @from(Ln 160753, Col 47)
Qm
// @from(Ln 160753, Col 51)
V_A
// @from(Ln 160753, Col 56)
DB1
// @from(Ln 160753, Col 61)
WB1
// @from(Ln 160753, Col 66)
_IA
// @from(Ln 160753, Col 71)
KB1
// @from(Ln 160753, Col 76)
VB1
// @from(Ln 160753, Col 81)
h10
// @from(Ln 160753, Col 86)
r$B
// @from(Ln 160753, Col 91)
FB1
// @from(Ln 160753, Col 96)
g10
// @from(Ln 160753, Col 101)
u10
// @from(Ln 160753, Col 106)
m10
// @from(Ln 160753, Col 111)
s$B
// @from(Ln 160753, Col 116)
t$B = "__json_buf"
// @from(Ln 160754, Col 2)
OBA
// @from(Ln 160755, Col 4)
d10 = w(() => {
  tu();
  _10();
  wBA();
  JB1();
  f10();
  OBA = class OBA {
    constructor(A) {
      nR.add(this), this.messages = [], this.receivedMessages = [], wa.set(this, void 0), RIA.set(this, null), this.controller = new AbortController, I_A.set(this, void 0), XB1.set(this, () => {}), D_A.set(this, () => {}), W_A.set(this, void 0), IB1.set(this, () => {}), K_A.set(this, () => {}), Qm.set(this, {}), V_A.set(this, !1), DB1.set(this, !1), WB1.set(this, !1), _IA.set(this, !1), KB1.set(this, void 0), VB1.set(this, void 0), FB1.set(this, (Q) => {
        if (j2(this, DB1, !0, "f"), eu(Q)) Q = new II;
        if (Q instanceof II) return j2(this, WB1, !0, "f"), this._emit("abort", Q);
        if (Q instanceof M2) return this._emit("error", Q);
        if (Q instanceof Error) {
          let B = new M2(Q.message);
          return B.cause = Q, this._emit("error", B)
        }
        return this._emit("error", new M2(String(Q)))
      }), j2(this, I_A, new Promise((Q, B) => {
        j2(this, XB1, Q, "f"), j2(this, D_A, B, "f")
      }), "f"), j2(this, W_A, new Promise((Q, B) => {
        j2(this, IB1, Q, "f"), j2(this, K_A, B, "f")
      }), "f"), u0(this, I_A, "f").catch(() => {}), u0(this, W_A, "f").catch(() => {}), j2(this, RIA, A, "f")
    }
    get response() {
      return u0(this, KB1, "f")
    }
    get request_id() {
      return u0(this, VB1, "f")
    }
    async withResponse() {
      let A = await u0(this, I_A, "f");
      if (!A) throw Error("Could not resolve a `Response` object");
      return {
        data: this,
        response: A,
        request_id: A.headers.get("request-id")
      }
    }
    static fromReadableStream(A) {
      let Q = new OBA(null);
      return Q._run(() => Q._fromReadableStream(A)), Q
    }
    static createMessage(A, Q, B) {
      let G = new OBA(Q);
      for (let Z of Q.messages) G._addMessageParam(Z);
      return j2(G, RIA, {
        ...Q,
        stream: !0
      }, "f"), G._run(() => G._createMessage(A, {
        ...Q,
        stream: !0
      }, {
        ...B,
        headers: {
          ...B?.headers,
          "X-Stainless-Helper-Method": "stream"
        }
      })), G
    }
    _run(A) {
      A().then(() => {
        this._emitFinal(), this._emit("end")
      }, u0(this, FB1, "f"))
    }
    _addMessageParam(A) {
      this.messages.push(A)
    }
    _addMessage(A, Q = !0) {
      if (this.receivedMessages.push(A), Q) this._emit("message", A)
    }
    async _createMessage(A, Q, B) {
      let G = B?.signal,
        Z;
      if (G) {
        if (G.aborted) this.controller.abort();
        Z = this.controller.abort.bind(this.controller), G.addEventListener("abort", Z)
      }
      try {
        u0(this, nR, "m", g10).call(this);
        let {
          response: Y,
          data: J
        } = await A.create({
          ...Q,
          stream: !0
        }, {
          ...B,
          signal: this.controller.signal
        }).withResponse();
        this._connected(Y);
        for await (let X of J) u0(this, nR, "m", u10).call(this, X);
        if (J.controller.signal?.aborted) throw new II;
        u0(this, nR, "m", m10).call(this)
      } finally {
        if (G && Z) G.removeEventListener("abort", Z)
      }
    }
    _connected(A) {
      if (this.ended) return;
      j2(this, KB1, A, "f"), j2(this, VB1, A?.headers.get("request-id"), "f"), u0(this, XB1, "f").call(this, A), this._emit("connect")
    }
    get ended() {
      return u0(this, V_A, "f")
    }
    get errored() {
      return u0(this, DB1, "f")
    }
    get aborted() {
      return u0(this, WB1, "f")
    }
    abort() {
      this.controller.abort()
    }
    on(A, Q) {
      return (u0(this, Qm, "f")[A] || (u0(this, Qm, "f")[A] = [])).push({
        listener: Q
      }), this
    }
    off(A, Q) {
      let B = u0(this, Qm, "f")[A];
      if (!B) return this;
      let G = B.findIndex((Z) => Z.listener === Q);
      if (G >= 0) B.splice(G, 1);
      return this
    }
    once(A, Q) {
      return (u0(this, Qm, "f")[A] || (u0(this, Qm, "f")[A] = [])).push({
        listener: Q,
        once: !0
      }), this
    }
    emitted(A) {
      return new Promise((Q, B) => {
        if (j2(this, _IA, !0, "f"), A !== "error") this.once("error", B);
        this.once(A, Q)
      })
    }
    async done() {
      j2(this, _IA, !0, "f"), await u0(this, W_A, "f")
    }
    get currentMessage() {
      return u0(this, wa, "f")
    }
    async finalMessage() {
      return await this.done(), u0(this, nR, "m", h10).call(this)
    }
    async finalText() {
      return await this.done(), u0(this, nR, "m", r$B).call(this)
    }
    _emit(A, ...Q) {
      if (u0(this, V_A, "f")) return;
      if (A === "end") j2(this, V_A, !0, "f"), u0(this, IB1, "f").call(this);
      let B = u0(this, Qm, "f")[A];
      if (B) u0(this, Qm, "f")[A] = B.filter((G) => !G.once), B.forEach(({
        listener: G
      }) => G(...Q));
      if (A === "abort") {
        let G = Q[0];
        if (!u0(this, _IA, "f") && !B?.length) Promise.reject(G);
        u0(this, D_A, "f").call(this, G), u0(this, K_A, "f").call(this, G), this._emit("end");
        return
      }
      if (A === "error") {
        let G = Q[0];
        if (!u0(this, _IA, "f") && !B?.length) Promise.reject(G);
        u0(this, D_A, "f").call(this, G), u0(this, K_A, "f").call(this, G), this._emit("end")
      }
    }
    _emitFinal() {
      if (this.receivedMessages.at(-1)) this._emit("finalMessage", u0(this, nR, "m", h10).call(this))
    }
    async _fromReadableStream(A, Q) {
      let B = Q?.signal,
        G;
      if (B) {
        if (B.aborted) this.controller.abort();
        G = this.controller.abort.bind(this.controller), B.addEventListener("abort", G)
      }
      try {
        u0(this, nR, "m", g10).call(this), this._connected(null);
        let Z = CC.fromReadableStream(A, this.controller);
        for await (let Y of Z) u0(this, nR, "m", u10).call(this, Y);
        if (Z.controller.signal?.aborted) throw new II;
        u0(this, nR, "m", m10).call(this)
      } finally {
        if (B && G) B.removeEventListener("abort", G)
      }
    } [(wa = new WeakMap, RIA = new WeakMap, I_A = new WeakMap, XB1 = new WeakMap, D_A = new WeakMap, W_A = new WeakMap, IB1 = new WeakMap, K_A = new WeakMap, Qm = new WeakMap, V_A = new WeakMap, DB1 = new WeakMap, WB1 = new WeakMap, _IA = new WeakMap, KB1 = new WeakMap, VB1 = new WeakMap, FB1 = new WeakMap, nR = new WeakSet, h10 = function () {
      if (this.receivedMessages.length === 0) throw new M2("stream ended without producing a Message with role=assistant");
      return this.receivedMessages.at(-1)
    }, r$B = function () {
      if (this.receivedMessages.length === 0) throw new M2("stream ended without producing a Message with role=assistant");
      let Q = this.receivedMessages.at(-1).content.filter((B) => B.type === "text").map((B) => B.text);
      if (Q.length === 0) throw new M2("stream ended without producing a content block with type=text");
      return Q.join(" ")
    }, g10 = function () {
      if (this.ended) return;
      j2(this, wa, void 0, "f")
    }, u10 = function (Q) {
      if (this.ended) return;
      let B = u0(this, nR, "m", s$B).call(this, Q);
      switch (this._emit("streamEvent", Q, B), Q.type) {
        case "content_block_delta": {
          let G = B.content.at(-1);
          switch (Q.delta.type) {
            case "text_delta": {
              if (G.type === "text") this._emit("text", Q.delta.text, G.text || "");
              break
            }
            case "citations_delta": {
              if (G.type === "text") this._emit("citation", Q.delta.citation, G.citations ?? []);
              break
            }
            case "input_json_delta": {
              if (e$B(G) && G.input) this._emit("inputJson", Q.delta.partial_json, G.input);
              break
            }
            case "thinking_delta": {
              if (G.type === "thinking") this._emit("thinking", Q.delta.thinking, G.thinking);
              break
            }
            case "signature_delta": {
              if (G.type === "thinking") this._emit("signature", G.signature);
              break
            }
            default:
              ACB(Q.delta)
          }
          break
        }
        case "message_stop": {
          this._addMessageParam(B), this._addMessage(k10(B, u0(this, RIA, "f")), !0);
          break
        }
        case "content_block_stop": {
          this._emit("contentBlock", B.content.at(-1));
          break
        }
        case "message_start": {
          j2(this, wa, B, "f");
          break
        }
        case "content_block_start":
        case "message_delta":
          break
      }
    }, m10 = function () {
      if (this.ended) throw new M2("stream has ended, this shouldn't happen");
      let Q = u0(this, wa, "f");
      if (!Q) throw new M2("request ended without sending any chunks");
      return j2(this, wa, void 0, "f"), k10(Q, u0(this, RIA, "f"))
    }, s$B = function (Q) {
      let B = u0(this, wa, "f");
      if (Q.type === "message_start") {
        if (B) throw new M2(`Unexpected event order, got ${Q.type} before receiving "message_stop"`);
        return Q.message
      }
      if (!B) throw new M2(`Unexpected event order, got ${Q.type} before "message_start"`);
      switch (Q.type) {
        case "message_stop":
          return B;
        case "message_delta":
          if (B.container = Q.delta.container, B.stop_reason = Q.delta.stop_reason, B.stop_sequence = Q.delta.stop_sequence, B.usage.output_tokens = Q.usage.output_tokens, B.context_management = Q.context_management, Q.usage.input_tokens != null) B.usage.input_tokens = Q.usage.input_tokens;
          if (Q.usage.cache_creation_input_tokens != null) B.usage.cache_creation_input_tokens = Q.usage.cache_creation_input_tokens;
          if (Q.usage.cache_read_input_tokens != null) B.usage.cache_read_input_tokens = Q.usage.cache_read_input_tokens;
          if (Q.usage.server_tool_use != null) B.usage.server_tool_use = Q.usage.server_tool_use;
          return B;
        case "content_block_start":
          return B.content.push(Q.content_block), B;
        case "content_block_delta": {
          let G = B.content.at(Q.index);
          switch (Q.delta.type) {
            case "text_delta": {
              if (G?.type === "text") B.content[Q.index] = {
                ...G,
                text: (G.text || "") + Q.delta.text
              };
              break
            }
            case "citations_delta": {
              if (G?.type === "text") B.content[Q.index] = {
                ...G,
                citations: [...G.citations ?? [], Q.delta.citation]
              };
              break
            }
            case "input_json_delta": {
              if (G && e$B(G)) {
                let Z = G[t$B] || "";
                Z += Q.delta.partial_json;
                let Y = {
                  ...G
                };
                if (Object.defineProperty(Y, t$B, {
                    value: Z,
                    enumerable: !1,
                    writable: !0
                  }), Z) try {
                  Y.input = eQ1(Z)
                } catch (J) {
                  let X = new M2(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${J}. JSON: ${Z}`);
                  u0(this, FB1, "f").call(this, X)
                }
                B.content[Q.index] = Y
              }
              break
            }
            case "thinking_delta": {
              if (G?.type === "thinking") B.content[Q.index] = {
                ...G,
                thinking: G.thinking + Q.delta.thinking
              };
              break
            }
            case "signature_delta": {
              if (G?.type === "thinking") B.content[Q.index] = {
                ...G,
                signature: Q.delta.signature
              };
              break
            }
            default:
              ACB(Q.delta)
          }
          return B
        }
        case "content_block_stop":
          return B
      }
    }, Symbol.asyncIterator)]() {
      let A = [],
        Q = [],
        B = !1;
      return this.on("streamEvent", (G) => {
        let Z = Q.shift();
        if (Z) Z.resolve(G);
        else A.push(G)
      }), this.on("end", () => {
        B = !0;
        for (let G of Q) G.resolve(void 0);
        Q.length = 0
      }), this.on("abort", (G) => {
        B = !0;
        for (let Z of Q) Z.reject(G);
        Q.length = 0
      }), this.on("error", (G) => {
        B = !0;
        for (let Z of Q) Z.reject(G);
        Q.length = 0
      }), {
        next: async () => {
          if (!A.length) {
            if (B) return {
              value: void 0,
              done: !0
            };
            return new Promise((Z, Y) => Q.push({
              resolve: Z,
              reject: Y
            })).then((Z) => Z ? {
              value: Z,
              done: !1
            } : {
              value: void 0,
              done: !0
            })
          }
          return {
            value: A.shift(),
            done: !1
          }
        },
        return: async () => {
          return this.abort(), {
            value: void 0,
            done: !0
          }
        }
      }
    }
    toReadableStream() {
      return new CC(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream()
    }
  }
})
// @from(Ln 161140, Col 4)
lI = "Glob"
// @from(Ln 161141, Col 2)
c10 = `- Fast file pattern matching tool that works with any codebase size
- Supports glob patterns like "**/*.js" or "src/**/*.ts"
- Returns matching file paths sorted by modification time
- Use this tool when you need to find files by name patterns
- When you are doing an open ended search that may require multiple rounds of globbing and grepping, use the Agent tool instead
- You can call multiple tools in a single response. It is always better to speculatively perform multiple searches in parallel if they are potentially useful.`
// @from(Ln 161147, Col 4)
f3 = "Task"
// @from(Ln 161149, Col 0)
function p10() {
  return `A powerful search tool built on ripgrep

  Usage:
  - ALWAYS use ${DI} for search tasks. NEVER invoke \`grep\` or \`rg\` as a ${X9} command. The ${DI} tool has been optimized for correct permissions and access.
  - Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
  - Filter files with glob parameter (e.g., "*.js", "**/*.tsx") or type parameter (e.g., "js", "py", "rust")
  - Output modes: "content" shows matching lines, "files_with_matches" shows only file paths (default), "count" shows match counts
  - Use ${f3} tool for open-ended searches requiring multiple rounds
  - Pattern syntax: Uses ripgrep (not grep) - literal braces need escaping (use \`interface\\{\\}\` to find \`interface{}\` in Go code)
  - Multiline matching: By default patterns match within single lines only. For cross-line patterns like \`struct \\{[\\s\\S]*?field\`, use \`multiline: true\`
`
}
// @from(Ln 161162, Col 4)
DI = "Grep"
// @from(Ln 161163, Col 4)
wP = () => {}
// @from(Ln 161164, Col 4)
BY = "Write"
// @from(Ln 161165, Col 2)
QCB
// @from(Ln 161166, Col 4)
pL = w(() => {
  cW();
  QCB = `Writes a file to the local filesystem.

Usage:
- This tool will overwrite the existing file if there is one at the provided path.
- If this is an existing file, you MUST use the ${z3} tool first to read the file's contents. This tool will fail if you did not read the file first.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
- Only use emojis if the user explicitly requests it. Avoid writing emojis to files unless asked.`
})
// @from(Ln 161177, Col 4)
tq = "NotebookEdit"
// @from(Ln 161179, Col 0)
function HB1() {
  let A = new Date,
    Q = A.getFullYear(),
    B = String(A.getMonth() + 1).padStart(2, "0"),
    G = String(A.getDate()).padStart(2, "0");
  return `${Q}-${B}-${G}`
}
// @from(Ln 161187, Col 0)
function BCB() {
  return `
- Allows Claude to search the web and use the results to inform responses
- Provides up-to-date information for current events and recent data
- Returns search result information formatted as search result blocks, including links as markdown hyperlinks
- Use this tool for accessing information beyond Claude's knowledge cutoff
- Searches are performed automatically within a single API call

CRITICAL REQUIREMENT - You MUST follow this:
  - After answering the user's question, you MUST include a "Sources:" section at the end of your response
  - In the Sources section, list all relevant URLs from the search results as markdown hyperlinks: [Title](URL)
  - This is MANDATORY - never skip including sources in your response
  - Example format:

    [Your answer here]

    Sources:
    - [Source Title 1](https://example.com/1)
    - [Source Title 2](https://example.com/2)

Usage notes:
  - Domain filtering is supported to include or block specific websites
  - Web search is only available in the US

IMPORTANT - Use the correct year in search queries:
  - Today's date is ${HB1()}. You MUST use this year when searching for recent information, documentation, or current events.
  - Example: If today is 2025-07-15 and the user asks for "latest React docs", search for "React documentation 2025", NOT "React documentation 2024"
`
}
// @from(Ln 161216, Col 4)
aR = "WebSearch"
// @from(Ln 161217, Col 4)
MBA = () => {}
// @from(Ln 161219, Col 0)
function YCB(A) {
  let {
    hasThinking: Q = !1
  } = A ?? {}, B = HX("preserve_thinking", "enabled", !1);
  if (!B) return;
  let G = a1(process.env.USE_API_CLEAR_TOOL_RESULTS),
    Z = a1(process.env.USE_API_CLEAR_TOOL_USES);
  if (!G && !Z && !B) return;
  let Y = [];
  if (G) {
    let J = process.env.API_MAX_INPUT_TOKENS ? parseInt(process.env.API_MAX_INPUT_TOKENS) : GCB,
      X = process.env.API_TARGET_INPUT_TOKENS ? parseInt(process.env.API_TARGET_INPUT_TOKENS) : ZCB,
      I = {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: J
        },
        clear_at_least: {
          type: "input_tokens",
          value: J - X
        },
        clear_tool_inputs: EX8
      };
    Y.push(I)
  }
  if (Z) {
    let J = process.env.API_MAX_INPUT_TOKENS ? parseInt(process.env.API_MAX_INPUT_TOKENS) : GCB,
      X = process.env.API_TARGET_INPUT_TOKENS ? parseInt(process.env.API_TARGET_INPUT_TOKENS) : ZCB,
      I = {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: J
        },
        clear_at_least: {
          type: "input_tokens",
          value: J - X
        },
        exclude_tools: zX8
      };
    Y.push(I)
  }
  if (B && Q) {
    let J = {
      type: "clear_thinking_20251015",
      keep: "all"
    };
    Y.push(J)
  }
  return Y.length > 0 ? {
    edits: Y
  } : void 0
}
// @from(Ln 161273, Col 4)
GCB = 180000
// @from(Ln 161274, Col 2)
ZCB = 40000
// @from(Ln 161275, Col 2)
EX8
// @from(Ln 161275, Col 7)
zX8
// @from(Ln 161276, Col 4)
JCB = w(() => {
  fQ();
  wP();
  cW();
  pL();
  MBA();
  BI();
  EX8 = [X9, lI, DI, z3, cI, aR], zX8 = [I8, BY, tq]
})
// @from(Ln 161286, Col 0)
function EB1(A) {
  if (R4() === "vertex") return l10;
  if (A?.isNonInteractive) {
    if (A.hasAppendSystemPrompt) return XCB;
    return ICB
  }
  return l10
}
// @from(Ln 161295, Col 0)
function zB1(A) {
  let Q = f8("tengu_ant_attribution_header_new");
  return ""
}
// @from(Ln 161299, Col 4)
l10 = "You are Claude Code, Anthropic's official CLI for Claude."
// @from(Ln 161300, Col 2)
XCB = "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."
// @from(Ln 161301, Col 2)
ICB = "You are a Claude agent, built on Anthropic's Claude Agent SDK."
// @from(Ln 161302, Col 2)
$X8
// @from(Ln 161302, Col 7)
DCB
// @from(Ln 161303, Col 4)
$B1 = w(() => {
  MD();
  w6();
  T1();
  $X8 = [l10, XCB, ICB], DCB = new Set($X8)
})
// @from(Ln 161313, Col 0)
function qX8(A) {
  let Q = A.find((G) => G.type === "user");
  if (!Q) return "";
  let B = Q.message.content;
  if (typeof B === "string") return B;
  if (Array.isArray(B)) {
    let G = B.find((Z) => Z.type === "text");
    if (G && G.type === "text") return G.text
  }
  return ""
}
// @from(Ln 161325, Col 0)
function i10(A, Q) {
  let G = [4, 7, 20].map((J) => A[J] || "0").join(""),
    Z = `${UX8}${G}${Q}`;
  return CX8("sha256").update(Z).digest("hex").slice(0, 3)
}
// @from(Ln 161331, Col 0)
function WCB(A) {
  let Q = qX8(A);
  return i10(Q, {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION)
}
// @from(Ln 161342, Col 4)
UX8 = "59cf53e54c78"
// @from(Ln 161343, Col 4)
n10 = () => {}
// @from(Ln 161344, Col 4)
KCB
// @from(Ln 161344, Col 9)
VCB = "Update the todo list for the current session. To be used proactively and often to track progress and pending tasks. Make sure that at least one task is in_progress at all times. Always provide both content (imperative) and activeForm (present continuous) for each task."